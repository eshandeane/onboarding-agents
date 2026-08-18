import { chromium } from "playwright";

const BASE = "http://localhost:3007";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
  await page.fill('input[type="email"]', "admin@cutanddry.com");
  await page.fill('input[type="password"]', "Te7U91BUOCm$ylcDoH3#");
  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.click('button[type="submit"]'),
  ]);
  console.log("After login URL:", page.url());

  if (!/workspace/i.test(page.url())) {
    await page.goto(BASE + "/workspaces", { waitUntil: "networkidle" });
  }
  console.log("Workspaces URL:", page.url());

  await page.waitForTimeout(1000);
  const fishLink = page.getByRole("link", { name: /The Fish Guys/i }).first();
  const fishCount = await fishLink.count();
  console.log("Fish Guys link count:", fishCount);
  if (!fishCount) {
    const search = page.locator('input[placeholder*="Search" i]').first();
    if (await search.count()) {
      await search.fill("Fish");
      await page.waitForTimeout(800);
    }
    const fishLink2 = page.getByText(/The Fish Guys/i).first();
    if (await fishLink2.count()) {
      await fishLink2.click();
    } else {
      console.log("STILL no Fish Guys");
      await page.screenshot({ path: "/tmp/debug-workspaces.png", fullPage: true });
      process.exit(2);
    }
  } else {
    await fishLink.click();
  }
  await page.waitForLoadState("networkidle");
  console.log("On workspace page. URL:", page.url());
  await page.waitForTimeout(800);

  await page.screenshot({ path: "/tmp/workspace-overview.png", fullPage: true });

  const trainingTrigger = page.getByRole("button").filter({ hasText: /Training/i }).filter({ hasText: /0\/7/i }).first();
  await trainingTrigger.waitFor({ timeout: 15000 });
  console.log("Training trigger count:", await trainingTrigger.count());
  await trainingTrigger.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await page.screenshot({ path: "/tmp/training-trigger-collapsed.png", fullPage: false });

  const progressInsideTrigger = await trainingTrigger.locator('[role="progressbar"]').count();
  console.log("Progress bars inside training trigger:", progressInsideTrigger);

  await trainingTrigger.click();
  await page.waitForTimeout(700);

  const scheduleBtns = page.getByRole("button", { name: /Schedule this training/i });
  console.log("Schedule buttons:", await scheduleBtns.count());

  await scheduleBtns.first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/popover-initial.png", fullPage: false });

  const timeInput = page.locator("#training-schedule-time");
  console.log("Time disabled initially?", await timeInput.isDisabled());
  const hintVisible = await page.getByText("Pick a date first").isVisible().catch(() => false);
  console.log("Hint visible initially?", hintVisible);

  const dayBtns = page.locator('[role="gridcell"] button:not([disabled])');
  const dayCount = await dayBtns.count();
  console.log("Calendar enabled days:", dayCount);
  if (dayCount > 0) {
    await dayBtns.nth(Math.min(15, dayCount - 1)).click();
  }
  await page.waitForTimeout(700);
  await page.screenshot({ path: "/tmp/after-date-pick.png", fullPage: false });

  const reschedulePill = page.getByRole("button", { name: /Reschedule this training/i }).first();
  console.log("Reschedule pill count:", await reschedulePill.count());
  console.log("Pill text after date pick:", await reschedulePill.textContent());
  await reschedulePill.click();
  await page.waitForTimeout(400);

  const timeInput2 = page.locator("#training-schedule-time");
  console.log("Time disabled now?", await timeInput2.isDisabled());
  console.log("Time value (expect 09:00):", await timeInput2.inputValue());

  await timeInput2.fill("14:30");
  await timeInput2.dispatchEvent("change");
  await page.waitForTimeout(400);

  const popoverStillOpen = await page.locator('[data-radix-popper-content-wrapper]').count();
  console.log("Popper open after time change?", popoverStillOpen);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  const reschedulePillAfter = page.getByRole("button", { name: /Reschedule this training/i }).first();
  console.log("Pill text after time change:", await reschedulePillAfter.textContent());

  const remaining = page.getByRole("button", { name: "Schedule this training", exact: true });
  console.log("Remaining schedule buttons (expect 6):", await remaining.count());
  if ((await remaining.count()) > 0) {
    await remaining.first().click();
    await page.waitForTimeout(600);
    const dayBtns2 = page.locator('[role="gridcell"] button:not([disabled])');
    const c2 = await dayBtns2.count();
    console.log("Calendar days available 2nd time:", c2);
    if (c2 > 0) {
      await dayBtns2.nth(Math.min(20, c2 - 1)).click();
    }
    await page.waitForTimeout(800);
  }

  const remaining2 = page.getByRole("button", { name: "Schedule this training", exact: true });
  console.log("Remaining schedule buttons after 2nd (expect 5):", await remaining2.count());
  if ((await remaining2.count()) > 0) {
    await remaining2.nth(2).click();
    await page.waitForTimeout(600);
    const dayBtns3 = page.locator('[role="gridcell"] button:not([disabled])');
    const c3 = await dayBtns3.count();
    if (c3 > 0) {
      await dayBtns3.nth(Math.min(10, c3 - 1)).click();
    }
    await page.waitForTimeout(800);
  }

  // Find the scrollable main container and scroll it so the training rows show
  await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll("*"));
    const scrollables = candidates.filter((el) => {
      const cs = getComputedStyle(el);
      const oy = cs.overflowY;
      return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 20;
    });
    scrollables.sort((a, b) => (b.clientHeight * b.clientWidth) - (a.clientHeight * a.clientWidth));
    if (scrollables[0]) scrollables[0].scrollTo({ top: scrollables[0].scrollHeight, behavior: "auto" });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/training-schedule-with-time.png", fullPage: false });

  const reschedulePill2 = page.getByRole("button", { name: /Reschedule this training/i }).first();
  await reschedulePill2.click();
  await page.waitForTimeout(400);
  const clearBtn = page.getByRole("button", { name: /^Clear$/i });
  if (await clearBtn.count()) {
    await clearBtn.click();
    await page.waitForTimeout(500);
    const firstSched = page.getByRole("button", { name: /Schedule this training/i }).first();
    console.log("After clear - first sched btn text:", await firstSched.textContent());
  } else {
    console.log("Clear button not found by name 'Clear'");
  }

  await browser.close();
  console.log("DONE");
})().catch((e) => { console.error("ERR:", e); process.exit(1); });
