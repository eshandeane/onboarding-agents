import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const AB_BIN = `${process.env.HOME}/.npm-global/bin/agent-browser`;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const ENV = { ...process.env, AGENT_BROWSER_EXECUTABLE_PATH: CHROME };

const VIEWPORTS = {
  "Iphone 6.5": { width: 428, height: 930 },
  "Ipad 12.9": { width: 1024, height: 1365 },
  Android: { width: 411, height: 915 },
};

const PAGES = [
  { name: "home-page", path: "/white-label-home" },
  { name: "order-guide", path: "/place-order" },
  { name: "catalog", path: "/place-order", clickTab: "Catalog" },
  { name: "order-history", path: "/revised-order-history" },
  { name: "chat", path: "/chat-v2" },
  { name: "order-check-in", path: null },
];

const ACCOUNTS = [
  {
    name: "Southasianfood",
    baseUrl: "https://southasianfood.cutanddry.com",
    email: "michael+saf@cutanddry.com",
    password: "password",
  },
];

function ab(...args) {
  const result = spawnSync(AB_BIN, args, {
    encoding: "utf8",
    env: ENV,
    stdio: ["pipe", "pipe", "pipe"],
  });
  return (result.stdout || "").trim();
}

// Reliable synchronous sleep — ab("wait", "ms") may be treated as a selector wait
function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// Poll until body has meaningful text content (React has rendered)
function waitForContent(label = "page", timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const raw = ab("eval", "String(document.body ? document.body.innerText.trim().length : 0)");
    if ((parseInt(raw) || 0) > 200) return;
    sleep(500);
  }
  console.log(`    Warning: ${label} may not have fully loaded`);
}

const BANNER_JS =
  "var s=document.getElementById('__hbs');if(!s){s=document.createElement('style');s.id='__hbs';s.textContent='a[href*=getMobileApp]{display:none!important}';document.head.appendChild(s)}";

function dismissBanner() {
  ab("eval", BANNER_JS);
}

// When /place-order shows a "Select Order Guide" modal, click the first OG row to load the order guide
function selectOrderGuideIfModalPresent() {
  const check = stripQuotes(
    ab("eval", "document.body.innerText.includes('Select Order Guide') ? 'yes' : 'no'")
  );
  if (check !== "yes") return;

  console.log("    Select Order Guide modal — clicking first OG option...");

  ab(
    "eval",
    `(function(){
      // Find the "Select Order Guide" heading text node
      var heading = Array.from(document.querySelectorAll('*')).find(function(el){
        return el.children.length === 0 && el.textContent.trim() === 'Select Order Guide';
      });
      if (!heading) return;

      // Walk up to the modal card container
      var card = heading.parentElement;
      for (var i = 0; i < 8; i++) {
        if (!card || card === document.body) return;
        // Stop when we reach a container that has clickable OG rows inside it
        var rows = Array.from(card.querySelectorAll('*')).filter(function(el){
          if (el.children.length > 2) return false;
          var text = el.textContent.trim();
          return text.length > 2 && text !== 'Select Order Guide' &&
                 !text.includes('Please select') && text !== '\xD7' &&
                 window.getComputedStyle(el).cursor === 'pointer';
        });
        if (rows.length >= 1) { rows[0].click(); return; }
        card = card.parentElement;
      }
    })()`
  );

  sleep(2000);
  waitForPageReady();
  waitForContent("order guide");
}

function waitForPageReady() {
  ab("wait", "--load", "networkidle");
  sleep(3000);
}

// Fill any input field using React-compatible native setter (works for type="text" and type="email")
function fillInput(selector, value) {
  const escaped = value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  ab(
    "eval",
    `(function(){
      var el = document.querySelector('${selector}');
      if (!el) return;
      var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, '${escaped}');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    })()`
  );
}

function login(account) {
  console.log(`  Logging in to ${account.name}...`);
  ab("open", `${account.baseUrl}/login`);
  ab("wait", 'input[type="password"]', "--timeout", "30000");

  // C&D white-label apps use type="text" for the email/mobile field, not type="email"
  fillInput('input[type="email"], input[type="text"]', account.email);
  fillInput('input[type="password"]', account.password);

  ab("click", 'button[type="submit"]');
  ab("wait", "--url", "**/white-label-home", "--timeout", "20000");
  sleep(3000);

  // Check success by verifying expected destination (failed logins redirect to /log-in, not /login)
  const url = stripQuotes(ab("eval", "window.location.href"));
  if (!url || !url.includes("white-label-home")) {
    throw new Error(`Login failed — landed on: ${url}`);
  }
  console.log(`  Logged in. URL: ${url}`);
}

const ORDER_LINK_JS =
  "document.querySelector('[href*=\"/orders-revised/view-one/\"]')?.getAttribute('href') || ''";

function stripQuotes(s) {
  return /^["'].*["']$/.test(s) ? s.slice(1, -1) : s;
}

function resolveOrderCheckInPath(account) {
  console.log("  Finding order check-in URL...");
  ab("open", `${account.baseUrl}/revised-order-history`);
  waitForPageReady();
  waitForContent("order-history");

  let href = stripQuotes(ab("eval", ORDER_LINK_JS));

  if (!href) {
    console.log("  No orders with default filter — trying Last 90 Days...");
    try {
      ab("click", ".dropdown-toggle");
      sleep(500);
      ab("find", "text", "Filters", "click");
      sleep(1000);
      ab("find", "text", "Last 30 Days", "click");
      sleep(500);
      ab("find", "text", "Last 90 Days", "click");
      sleep(500);
      ab("find", "text", "Save", "click");
      waitForPageReady();
      waitForContent("order-history");
      href = stripQuotes(ab("eval", ORDER_LINK_JS));
    } catch (e) {
      console.log(`  Filter change failed: ${e.message}`);
    }
  }

  if (href) {
    const urlPath = href.startsWith("http") ? new URL(href).pathname : href;
    console.log(`  Found: ${urlPath}`);
    return urlPath;
  }

  console.log("  Warning: No orders found — skipping order-check-in");
  return null;
}

function main() {
  for (const account of ACCOUNTS) {
    console.log(`\n=== ${account.name} ===`);

    login(account);
    dismissBanner();

    const orderCheckInPath = resolveOrderCheckInPath(account);

    for (const [viewportName, vp] of Object.entries(VIEWPORTS)) {
      console.log(`\n  [${viewportName}] ${vp.width}x${vp.height}`);
      const outDir = path.join(ROOT, account.name, viewportName);
      fs.mkdirSync(outDir, { recursive: true });

      ab("set", "viewport", String(vp.width), String(vp.height));

      for (const page of PAGES) {
        if (page.name === "order-check-in" && !orderCheckInPath) {
          console.log(`    Skipping order-check-in (no order found)`);
          continue;
        }

        const pagePath = page.name === "order-check-in" ? orderCheckInPath : page.path;
        const outFile = path.join(outDir, `${page.name}.png`);

        console.log(`    Capturing ${page.name}...`);
        ab("open", `${account.baseUrl}${pagePath}`);
        waitForPageReady();

        // Select an order guide if the modal appears (required before order guide or catalog loads)
        if (page.path === "/place-order") {
          selectOrderGuideIfModalPresent();
        }

        if (page.clickTab) {
          ab("find", "text", page.clickTab, "click");
          sleep(2000);
        }

        waitForContent(page.name);
        dismissBanner();
        ab("screenshot", outFile);

        const kb = Math.round(fs.statSync(outFile).size / 1024);
        if (kb < 5) {
          console.log(`    WARNING: ${page.name}.png is only ${kb}KB — likely blank`);
        } else {
          console.log(`    Saved: ${outFile} (${kb}KB)`);
        }
      }
    }

    console.log(`\n  Done with ${account.name}`);
  }

  ab("close");
  console.log("\nAll done!");
}

main();
