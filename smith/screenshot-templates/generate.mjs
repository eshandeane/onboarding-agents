import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const AB_BIN = `${process.env.HOME}/.npm-global/bin/agent-browser`;
const ENV = {
  ...process.env,
  AGENT_BROWSER_EXECUTABLE_PATH: CHROME,
  AGENT_BROWSER_ALLOW_FILE_ACCESS: "true",
};

function ab(...args) {
  const result = spawnSync(AB_BIN, args, {
    encoding: "utf8",
    env: ENV,
    stdio: ["pipe", "pipe", "pipe"],
  });
  return (result.stdout || "").trim();
}

const ROOT = path.resolve(import.meta.dirname, "..");
const FRAMES_DIR = path.join(import.meta.dirname, "frames");
const TEMPLATE = fs.readFileSync(
  path.join(import.meta.dirname, "compose.html"),
  "utf8"
);
const FEATURE_TEMPLATE = fs.readFileSync(
  path.join(import.meta.dirname, "feature-graphic.html"),
  "utf8"
);

// Returns true if a hex color is too dark for a good background
// (white text on dark bg would be invisible)
function isDarkColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.35;
}

// Returns true if a hex color is too light for white text (near-white backgrounds)
function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.85;
}

// Device configs: canvas size = app store required size
// Screen area coords measured from the PNG frame files
const DEVICES = {
  android: {
    canvasW: 1080,
    canvasH: 1920,
    deviceW: 780,
    deviceH: 1516,
    // Screen area within frame PNG (original: 170,140,1344,2991 in 1684x3272)
    // Scale: 780/1684 = 0.4632
    screenX: 79,
    screenY: 65,
    screenW: 623,
    screenH: 1385,
    screenRadius: 77,
    framePng: "android.png",
    titleSize: 72,
    titlePadTop: 80,
    devicePadTop: 60,
    screenshotW: 411,
    screenshotH: 823,
  },
  "iphone-6.5": {
    canvasW: 1284,
    canvasH: 2778,
    deviceW: 920,
    deviceH: 1858,
    // Screen area within frame PNG (original: 100,100,1320,2868 in 1520x3068)
    // Scale: 920/1520 = 0.6053
    screenX: 61,
    screenY: 61,
    screenW: 799,
    screenH: 1736,
    screenRadius: 108,
    framePng: "iphone.png",
    titleSize: 84,
    titlePadTop: 100,
    devicePadTop: 80,
    screenshotW: 428,
    screenshotH: 890,
  },
  "ipad-12.9": {
    canvasW: 2048,
    canvasH: 2732,
    deviceW: 1700,
    deviceH: 2220,
    // Screen area within frame PNG (original: 100,100,2064,2752 in 2264x2952)
    // Scale: 1700/2264 = 0.7509
    screenX: 75,
    screenY: 75,
    screenW: 1550,
    screenH: 2067,
    screenRadius: 50,
    framePng: "ipad.png",
    titleSize: 96,
    titlePadTop: 80,
    devicePadTop: 60,
    screenshotW: 1024,
    screenshotH: 1337,
  },
};

const TITLES = [
  "Order online with our new app",
  "Shop from your order guide",
  "Shop from our entire product catalog",
  "View your order history",
  "Chat with your sales rep",
  "Track and check-in your orders",
];

const PAGES = [
  "home-page",
  "order-guide",
  "catalog",
  "order-history",
  "chat",
  "order-check-in",
];

const ACCOUNTS = {
  Southasianfood: { color: "#DF382F", appName: "South Asian Food" },
};

function generateComposite(account, bgColor, deviceKey, deviceCfg, pageName, title) {
  // Map device keys to capture folder names (from capture.mjs)
  const captureFolderMap = {
    android: "Android",
    "iphone-6.5": "Iphone 6.5",
    "ipad-12.9": "Ipad 12.9",
  };
  // Map device keys to clean output folder names
  const outputFolderMap = {
    android: "android",
    "iphone-6.5": "ios",
    "ipad-12.9": "ipad",
  };
  const captureFolder = captureFolderMap[deviceKey];
  const outputFolder = outputFolderMap[deviceKey];
  const screenshotSrc = path.join(ROOT, account, captureFolder, `${pageName}.png`);

  if (!fs.existsSync(screenshotSrc)) {
    console.log(`  SKIP ${account}/${captureFolder}/${pageName}.png (not found)`);
    return;
  }

  const outDir = path.join(ROOT, account, outputFolder);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${pageName}.png`);

  const screenshotFileUrl = `file://${screenshotSrc}`;
  const frameFileUrl = `file://${path.join(FRAMES_DIR, deviceCfg.framePng)}`;

  // Dark brand colors → white background with brand color text
  // Very light brand colors → brand background with dark text (avoids white-on-cream invisible text)
  const dark = isDarkColor(bgColor);
  const light = !dark && isLightColor(bgColor);
  const actualBg = dark ? "#FFFFFF" : bgColor;
  const titleColor = dark ? bgColor : light ? "#1a1a1a" : "#FFFFFF";

  let html = TEMPLATE.replace("TITLE_TEXT", title)
    .replace("SCREENSHOT_PATH", screenshotFileUrl)
    .replace("FRAME_PATH", frameFileUrl)
    .replace(
      "</head>",
      `<style>
      :root {
        --canvas-w: ${deviceCfg.canvasW}px;
        --canvas-h: ${deviceCfg.canvasH}px;
        --bg-color: ${actualBg};
        --title-color: ${titleColor};
        --title-size: ${deviceCfg.titleSize}px;
        --title-pad-top: ${deviceCfg.titlePadTop}px;
        --device-pad-top: ${deviceCfg.devicePadTop}px;
        --device-w: ${deviceCfg.deviceW}px;
        --device-h: ${deviceCfg.deviceH}px;
        --screen-x: ${deviceCfg.screenX}px;
        --screen-y: ${deviceCfg.screenY}px;
        --screen-w: ${deviceCfg.screenW}px;
        --screen-h: ${deviceCfg.screenH}px;
        --screen-radius: ${deviceCfg.screenRadius}px;
      }
    </style></head>`
    );

  const tmpHtml = path.join(outDir, `_tmp_${pageName}.html`);
  fs.writeFileSync(tmpHtml, html);

  ab("set", "viewport", String(deviceCfg.canvasW), String(deviceCfg.canvasH));
  ab("open", `file://${tmpHtml}`);
  ab("wait", "--load", "networkidle");
  ab("wait", "500");
  ab("screenshot", outPath);
  fs.unlinkSync(tmpHtml);

  console.log(`  OK ${outPath}`);
}

function generateFeatureGraphic(account, bgColor, appName) {
  const dark = isDarkColor(bgColor);
  const light = !dark && isLightColor(bgColor);
  const actualBg = dark ? "#FFFFFF" : bgColor;
  const titleColor = dark ? bgColor : light ? "#1a1a1a" : "#FFFFFF";

  // Use raw iPhone captures (untouched by generate) for the phone previews
  const screenshot1 = path.join(ROOT, account, "Iphone 6.5", "home-page.png");
  const screenshot2 = path.join(ROOT, account, "Iphone 6.5", "catalog.png");
  const framePng = path.join(FRAMES_DIR, "iphone.png");

  if (!fs.existsSync(screenshot1) || !fs.existsSync(screenshot2)) {
    console.log(`  SKIP Feature Graphic (missing Android screenshots)`);
    return;
  }

  const outDir = path.join(ROOT, account, "android");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "feature-graphic.png");

  let html = FEATURE_TEMPLATE.replace("APP_NAME_TEXT", appName)
    .replace("SCREENSHOT_1_PATH", `file://${screenshot1}`)
    .replace("SCREENSHOT_2_PATH", `file://${screenshot2}`)
    .replaceAll("FRAME_PATH", `file://${framePng}`)
    .replace(
      "</head>",
      `<style>
      :root {
        --bg-color: ${actualBg};
        --title-color: ${titleColor};
      }
    </style></head>`
    );

  const tmpHtml = path.join(outDir, "_tmp_feature-graphic.html");
  fs.writeFileSync(tmpHtml, html);

  ab("set", "viewport", "1024", "500");
  ab("open", `file://${tmpHtml}`);
  ab("wait", "--load", "networkidle");
  ab("wait", "500");
  ab("screenshot", outPath);
  fs.unlinkSync(tmpHtml);

  console.log(`  OK ${outPath}`);
}

function main() {
  for (const [account, { color: bgColor, appName }] of Object.entries(ACCOUNTS)) {
    console.log(`\n=== ${account} ===`);
    for (const [deviceKey, deviceCfg] of Object.entries(DEVICES)) {
      console.log(`\n  Device: ${deviceKey}`);
      for (let i = 0; i < PAGES.length; i++) {
        generateComposite(account, bgColor, deviceKey, deviceCfg, PAGES[i], TITLES[i]);
      }
    }

    console.log(`\n  Feature Graphic:`);
    generateFeatureGraphic(account, bgColor, appName);
  }

  ab("close");
  console.log("\nDone!");
}

main();
