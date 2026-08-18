import { chromium } from "playwright";

const WORKSPACE_ID = "cmpf2ok880008fsu8iubp2uhf";
const WL_INTAKE_ID = "cmpf2ok8t000gfsu8ajde51u1";
const BRANDING_TASK_ID = "cmpf2ok8u000ifsu8ab56jhip";
const OUT = "/tmp/wl-refactor-screenshots";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await ctx.newPage();

// Log in
await page.goto("http://localhost:3010/login");
await page.waitForSelector('input[type="email"]');
await page.fill('input[type="email"]', "admin@cutanddry.com");
await page.fill('input[type="password"]', "Te7U91BUOCm$ylcDoH3#");
await Promise.all([
  page.waitForURL((url) => !url.toString().includes("/login"), {
    timeout: 30000,
  }),
  page.click('button[type="submit"]'),
]);
await page.waitForLoadState("networkidle");
console.log("logged in, url =", page.url());

// 1) Workspace overview — capture full page so we can see Cut+Dry Setup section
await page.goto(`http://localhost:3010/workspaces/${WORKSPACE_ID}`);
await page.waitForLoadState("networkidle");
// Give accordions a moment to settle
await page.waitForTimeout(800);
await page.screenshot({
  path: `${OUT}/01-overview-fullpage.png`,
  fullPage: true,
});
console.log("01-overview-fullpage.png done");

// 2) Expand the Cut+Dry Setup White Label accordion (click on "White Label App Setup" trigger inside Cut+Dry Setup)
// AccordionTrigger renders as a button; the title is a Link inside it. The trigger button itself is the closest button ancestor.
const trigger = page
  .locator('button[data-slot="accordion-trigger"]', {
    has: page.getByText("White Label App Setup"),
  })
  .first();
await trigger.scrollIntoViewIfNeeded();
await trigger.click();
await page.waitForTimeout(400);
await page.screenshot({
  path: `${OUT}/02-overview-wl-expanded-fullpage.png`,
  fullPage: true,
});
console.log("02-overview-wl-expanded-fullpage.png done");

// 3) Just the Cut+Dry Setup region — try to locate the heading and snapshot the section
const cdSetupHeading = page.locator("text=Cut+Dry Setup").first();
const region = cdSetupHeading.locator("xpath=..");
try {
  await region.screenshot({ path: `${OUT}/03-overview-cd-setup-region.png` });
  console.log("03-overview-cd-setup-region.png done");
} catch (e) {
  console.log("region screenshot failed:", e.message);
}

// 4) Intake detail page for the WL intake
await page.goto(
  `http://localhost:3010/workspaces/${WORKSPACE_ID}/intakes/${WL_INTAKE_ID}`
);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(800);
await page.screenshot({
  path: `${OUT}/04-wl-intake-detail-fullpage.png`,
  fullPage: true,
});
console.log("04-wl-intake-detail-fullpage.png done");

// 5) Click the "Provide Branding Assets" task row → BrandingTaskView
const brandingRow = page
  .locator("a", { hasText: "Provide Branding Assets" })
  .first();
if (await brandingRow.count()) {
  await brandingRow.click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: `${OUT}/05-branding-task-view-fullpage.png`,
    fullPage: true,
  });
  console.log("05-branding-task-view-fullpage.png done");
} else {
  // Try navigating directly via task URL
  await page.goto(
    `http://localhost:3010/workspaces/${WORKSPACE_ID}/intakes/${WL_INTAKE_ID}/tasks/${BRANDING_TASK_ID}`
  );
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: `${OUT}/05-branding-task-view-fullpage.png`,
    fullPage: true,
  });
  console.log("05-branding-task-view-fullpage.png done (direct nav)");
}

await browser.close();
console.log("ALL DONE");
