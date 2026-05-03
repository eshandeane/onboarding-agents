import { chromium } from "playwright";

const account = {
  baseUrl: "https://oneworldfoods.cutanddry.com",
  email: "michael+owm@cutanddry.com",
  password: "password",
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 411, height: 915 } });
  const page = await context.newPage();

  // Login
  await page.goto(`${account.baseUrl}/login`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  await emailInput.fill(account.email);
  await passwordInput.fill(account.password);
  const submitBtn = page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Sign in")').first();
  await submitBtn.click();
  await page.waitForURL(/white-label-home/, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  console.log("Logged in. URL:", page.url());

  // Go to order history
  await page.goto(`${account.baseUrl}/revised-order-history`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  console.log("Order history URL:", page.url());

  // Get page content to find order references
  const content = await page.content();
  
  // Look for order refs — try to find links with /view-one/ pattern
  const links = await page.locator('a[href*="view-one"]').all();
  console.log(`Found ${links.length} view-one links`);
  for (const link of links.slice(0, 3)) {
    const href = await link.getAttribute('href');
    console.log("  Link:", href);
  }

  // Also look for order numbers in text
  const orderNumbers = content.match(/\d{9,}/g);
  if (orderNumbers) {
    console.log("Potential order numbers:", [...new Set(orderNumbers)].slice(0, 5));
  }

  await browser.close();
}

main().catch(console.error);
