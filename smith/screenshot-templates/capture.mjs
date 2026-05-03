import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const VIEWPORTS = {
  "Iphone 6.5": { width: 428, height: 930 },
  "Ipad 12.9": { width: 1024, height: 1365 },
  Android: { width: 411, height: 915 },
};

const PAGES = [
  { name: "home-page", path: "/white-label-home" },
  { name: "order-guide", path: "/place-order", clickTab: null },
  { name: "catalog", path: "/place-order", clickTab: "Catalog" },
  { name: "order-history", path: "/revised-order-history" },
  { name: "chat", path: "/chat-v2" },
  // order-check-in path is resolved dynamically per account — see resolveOrderCheckInPath()
  { name: "order-check-in", path: null },
];

const ACCOUNTS = [
  {
    name: "Oneworldfoods",
    baseUrl: "https://oneworldfoods.cutanddry.com",
    email: "michael+owm@cutanddry.com",
    password: "password",
  },
];

async function dismissBanner(page) {
  try {
    const dismissed = await page.evaluate(() => {
      // Inject a persistent CSS rule — React can't override <style> tags
      if (!document.querySelector("#hide-banner-style")) {
        const style = document.createElement("style");
        style.id = "hide-banner-style";
        style.textContent =
          'a[href*="getMobileApp"] { display: none !important; }';
        document.head.appendChild(style);
      }
      return "injected css";
    });
    if (dismissed) {
      await page.waitForTimeout(500);
      console.log(`  Banner dismissed (${dismissed})`);
      return true;
    }
  } catch {}
  console.log("  No banner found");
  return false;
}

async function login(page, account) {
  console.log(`  Logging in to ${account.name}...`);
  await page.goto(`${account.baseUrl}/login`, { waitUntil: "load", timeout: 30000 }).catch(() => {});

  // Wait for login form to render (SPA may take a moment)
  const passwordInput = page.locator('input[type="password"]').first();
  await passwordInput.waitFor({ state: "visible", timeout: 30000 });

  const emailInput = page
    .locator(
      'input[type="email"], input[name="email"], input[placeholder*="email" i]'
    )
    .first();

  await emailInput.fill(account.email);
  await passwordInput.fill(account.password);

  const submitBtn = page
    .locator(
      'button[type="submit"], button:has-text("Log in"), button:has-text("Sign in")'
    )
    .first();
  await submitBtn.click();

  await page.waitForURL(/white-label-home/, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  console.log(`  Logged in. URL: ${page.url()}`);
}

// Shared: open kebab -> Filters -> change date range to "Last 90 Days" -> Save
async function expandOrderHistoryFilter(page) {
  await page.locator(".dropdown-toggle").first().click();
  await page.waitForTimeout(500);
  await page.locator("text=Filters").first().click();
  await page.waitForTimeout(1000);
  // Click whichever date range is currently shown (could be 30 or 90 days)
  const dateDropdown = page.locator(".modal.show").locator("text=/Last \\d+ Days/i").first();
  await dateDropdown.click();
  await page.waitForTimeout(500);
  await page.locator("text=Last 90 Days").first().click();
  await page.waitForTimeout(500);
  await page.locator(".modal.show").locator("text=Save").first().click();
}

async function resolveOrderCheckInPath(page, account) {
  console.log("  Finding order check-in URL...");
  await page.goto(`${account.baseUrl}/revised-order-history`, {
    waitUntil: "load",
    timeout: 30000,
  }).catch(() => {});
  await waitForPageReady(page);

  // Find the first order link on the order history page
  let orderLink = await page
    .locator('[href*="/orders-revised/view-one/"]')
    .first()
    .getAttribute("href", { timeout: 10000 })
    .catch(() => null);

  // If no orders found, open the filter modal and change to "Last 90 Days"
  if (!orderLink) {
    console.log("  No orders with default filter — trying Last 90 Days...");
    try {
      await expandOrderHistoryFilter(page);
      await waitForPageReady(page);
      orderLink = await page
        .locator('[href*="/orders-revised/view-one/"]')
        .first()
        .getAttribute("href", { timeout: 10000 })
        .catch(() => null);
    } catch (e) {
      console.log(`  Filter change failed: ${e.message}`);
    }
  }

  if (orderLink) {
    const urlPath = orderLink.startsWith("http")
      ? new URL(orderLink).pathname
      : orderLink;
    console.log(`  Found order check-in: ${urlPath}`);
    return urlPath;
  }

  console.log("  Warning: No orders found even with 90-day filter — skipping order-check-in page");
  return null;
}

// Wait for the page to fully load — no spinners, no skeleton screens
async function waitForPageReady(page) {
  // 1. Wait for network to be idle (no pending requests for 500ms)
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

  // 2. Wait for common loading indicators to disappear
  const spinnerSelectors = [
    // CSS animation spinners
    '[class*="spinner"]',
    '[class*="loading"]',
    '[class*="loader"]',
    // Animated SVG/icon spinners
    ".animate-spin",
    'svg[class*="spin"]',
    // MUI / generic circular progress
    '[role="progressbar"]',
    // The specific C+D loading spinner (colored squares)
    '[class*="LoadingIndicator"]',
    '[class*="loadingIndicator"]',
  ];

  for (const selector of spinnerSelectors) {
    try {
      const spinner = page.locator(selector).first();
      if (await spinner.isVisible({ timeout: 500 })) {
        console.log(`    Waiting for ${selector} to disappear...`);
        await spinner.waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
      }
    } catch {}
  }

  // 3. Wait for images to finish loading
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
        )
    );
  }).catch(() => {});

  // 4. Final settle — let any post-load animations/transitions finish
  await page.waitForTimeout(1500);
}

// Verify the page loaded real content (not just a spinner/blank page)
function verifyScreenshot(page, pageName) {
  return page.evaluate(() => {
    // Check if body has meaningful content (more than just nav/header)
    const body = document.body;
    const text = body.innerText || "";
    // A loaded page should have at least 50 chars of visible text
    return text.trim().length > 50;
  }).catch(() => false);
}

async function captureScreenshots(browser, account) {
  console.log(`\n=== ${account.name} ===`);

  // Single context per account — login once, dismiss banner once
  const context = await browser.newContext({
    viewport: { width: 411, height: 915 },
  });
  const page = await context.newPage();

  // Login at mobile size so banner appears
  await login(page, account);

  // Dismiss the banner once — it stays dismissed for the session
  await dismissBanner(page);

  // Resolve the order-check-in path dynamically
  const orderCheckInPath = await resolveOrderCheckInPath(page, account);
  const pages = PAGES.map((p) =>
    p.name === "order-check-in" ? { ...p, path: orderCheckInPath } : p
  );

  // Now capture each page at each viewport size
  for (const [deviceName, viewport] of Object.entries(VIEWPORTS)) {
    console.log(
      `\n  Device: ${deviceName} (${viewport.width}x${viewport.height})`
    );

    // Resize viewport
    await page.setViewportSize(viewport);

    for (const pageInfo of pages) {
      if (!pageInfo.path) {
        console.log(`    SKIP ${pageInfo.name} (no URL found)`);
        continue;
      }

      const outDir = path.join(ROOT, account.name, deviceName);
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, `${pageInfo.name}.png`);

      const url = `${account.baseUrl}${pageInfo.path}`;
      await page
        .goto(url, { waitUntil: "load", timeout: 30000 })
        .catch(() => {});

      // Wait for page to fully load (network idle + spinners gone + images loaded)
      await waitForPageReady(page);

      // Dismiss banner if it appears
      await dismissBanner(page);

      // If order-history shows no records, try expanding the date filter to 90 days
      if (pageInfo.name === "order-history") {
        const noRecords = await page.locator('text=/No Records Available/i').first().isVisible({ timeout: 2000 }).catch(() => false);
        if (noRecords) {
          console.log(`    No records — expanding filter to Last 90 Days...`);
          try {
            await expandOrderHistoryFilter(page);
            await waitForPageReady(page);
            await dismissBanner(page);
          } catch (e) {
            console.log(`    Filter change failed: ${e.message}`);
          }
        }
      }

      // If this page needs a tab click (e.g., Catalog tab)
      if (pageInfo.clickTab) {
        try {
          const tab = page.locator(`text="${pageInfo.clickTab}"`).first();
          if (await tab.isVisible({ timeout: 3000 })) {
            await tab.click();
            // Wait for the tab content to load — product cards with images
            await waitForPageReady(page);
            // Extra wait for product grid: look for product images or "Add to Cart" buttons
            await page
              .locator('img[src*="product"], img[src*="item"], button:has-text("Add to Cart"), [class*="product-card"], [class*="ProductCard"]')
              .first()
              .waitFor({ state: "visible", timeout: 20000 })
              .catch(() => {
                console.log(`    Warning: No product cards found after ${pageInfo.clickTab} tab click`);
              });
            // Wait for product images to fully render
            await waitForPageReady(page);
          }
        } catch {
          console.log(`    Warning: Could not click ${pageInfo.clickTab} tab`);
        }
      }

      // Hide banner right before screenshot in case React re-rendered it
      await dismissBanner(page);

      // Verify page loaded real content
      const hasContent = await verifyScreenshot(page, pageInfo.name);
      if (!hasContent) {
        console.log(`    WARN ${pageInfo.name} may not have fully loaded — retrying...`);
        // Retry: reload and wait again
        await page.reload({ waitUntil: "load", timeout: 30000 }).catch(() => {});
        await waitForPageReady(page);
        await dismissBanner(page);
        const retryOk = await verifyScreenshot(page, pageInfo.name);
        if (!retryOk) {
          console.log(`    WARN ${pageInfo.name} still looks empty after retry`);
        }
      }

      await page.screenshot({ path: outPath, type: "png" });
      console.log(`    OK ${pageInfo.name}.png`);
    }
  }

  await page.close();
  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  for (const account of ACCOUNTS) {
    await captureScreenshots(browser, account);
  }

  await browser.close();
  console.log("\nAll screenshots captured!");
}

main().catch(console.error);
