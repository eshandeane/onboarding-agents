# onboarding-agents

AI agents for automating Cut+Dry distributor onboarding tasks.

---

## Smith — App Store Screenshot Agent

Smith automates the entire app store submission screenshot pipeline for Cut+Dry white-label apps. Given a distributor URL, it logs into the app, captures screenshots across three device sizes, composites them into on-brand marketing images with device frames and marketing titles, finds or creates a Jira ticket under the epic you provide, attaches all assets to that ticket, and posts progress to Slack.

**Time saved: 2-3 hours → ~5 minutes per distributor.**

### What it does

1. **Reads prior learnings** from `~/.claude/agents/learnings/smith-learnings.md` and applies known workarounds
2. **Captures 18 screenshots** — 6 pages (home, order guide, catalog, order history, chat, order check-in) at 3 device sizes (iPhone 6.5", iPad 12.9", Android)
3. **Generates composites** — device-framed marketing images sized for App Store and Play Store, with brand color background, marketing titles, and automatic dark/light color handling
4. **Finds or creates the Jira ticket** — first searches the epic for an existing "Submit mobile apps live" task and reuses it; only creates a new one if none exists
5. **Attaches composites to the ticket** via the Jira REST API
6. **Pings Slack** at each checkpoint (start, capture complete, composites ready, done, or on failure)
7. **Appends a new learnings entry** so the next run inherits any fixes or quirks discovered

### File layout

```
onboarding-agents/
├── README.md                         (this file)
└── smith/
    ├── smith.md                      Agent definition (uses SMITH_PATH placeholder)
    ├── smith-learnings.md            Seed learnings from ~15 prior runs
    ├── package.json                  npm entry, playwright dep, postinstall hook
    ├── install.sh                    Manual install script (postinstall runs the same steps)
    ├── bin/smith.js                  smith CLI entrypoint
    ├── screenshot-templates/
    │   ├── capture.mjs               Playwright login + page capture
    │   ├── generate.mjs               Composite generator (device frames + titles)
    │   ├── compose.html               HTML template for phone/tablet composites
    │   ├── feature-graphic.html       HTML template for Play Store feature graphic
    │   ├── frames/                    iphone.png, android.png, ipad.png device frames
    │   ├── verify-training.mjs        Utility: verify screenshots for training set
    │   ├── wl-refactor.mjs            Utility: white-label refactor helper
    │   ├── find-order.mjs             Utility: dynamic order-id resolver
    │   └── android-template.html      Alt Android composite template
    └── outputs/                      (gitignored) progress log + generated screenshots
```

Screenshots and composites for each distributor land at `smith/{DistributorName}/{android,ios,ipad,Iphone 6.5,Ipad 12.9,Android}/` inside the clone. These directories are gitignored per distributor.

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Claude Code](https://claude.ai/code) (CLI, desktop, or IDE extension)
- Atlassian MCP connected in Claude Code (for Jira create/search)
- Slack MCP connected in Claude Code (for progress notifications; optional but recommended)

### Installation

```bash
git clone https://github.com/eshandeane/onboarding-agents.git
cd onboarding-agents/smith
npm install
```

`npm install` runs a `postinstall` hook that automatically:

1. Installs Node dependencies (`playwright`)
2. Downloads Chromium to `~/Library/Caches/ms-playwright/`
3. Substitutes `SMITH_PATH` in `smith.md` with the absolute clone path
4. Copies the substituted agent definition to `~/.claude/agents/smith.md`
5. Symlinks `bin/smith.js` into `$(npm config get prefix)/bin/smith` so `smith` is on PATH

Scripts, device frames, and generated screenshots stay in the cloned repo directory. Only the substituted agent definition is placed into `~/.claude/agents/`.

If postinstall fails (e.g., permissions on the npm prefix), run `./install.sh` from `smith/` to re-run the same steps manually.

### MCP setup

**Atlassian** (required for Jira ticket create/search):

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp
```

Authenticate when prompted in Claude Code.

**Slack** (required for progress pings — the agent hardcodes channel `DL88SS3EU`, which is Eshan's DM; change this in `smith.md` before running as a new engineer):

Add the Slack MCP per the Claude Code MCP docs and authenticate.

**Jira REST attachments**: Step 7 in `smith.md` shells out to `curl` to attach PNGs to the ticket. Export `JIRA_EMAIL` and `JIRA_TOKEN` in your shell environment, or the agent will attempt to read them from `~/.claude/.mcp.json`.

### Usage

From anywhere in your terminal:

```bash
smith
```

The CLI prompts for the app URL and then launches Claude Code with the smith agent. You can also pass the URL directly:

```bash
smith https://hillcrest.cutanddry.com
```

Inside Claude Code, Smith will ask (via AskUserQuestion) for:

- Login email + password for the app
- Jira epic key (e.g. `DOT-12345`)
- App name (e.g. "Hillcrest Foodservice")
- Brand color hex (e.g. `#E87722`)

Then walk away. Progress streams to Slack and `smith/outputs/screensmith-progress.log`.

### Output

Composites are saved to `smith/{DistributorName}/{android,ios,ipad}/` and attached to the Jira ticket.

| Asset           | Size        |
| --------------- | ----------- |
| iPhone 6.5"     | 1284 × 2778 |
| iPad 12.9"      | 2048 × 2732 |
| Android         | 1080 × 1920 |
| Feature Graphic | 1024 × 500  |

### Slack notifications

Smith posts five message types to the channel configured in `smith.md`:

- **Started** (immediately after inputs collected)
- **Capture complete** (with per-page WARNING list if any)
- **Composites ready** (with per-device counts)
- **Done** (with Jira URL + folder path)
- **Failed** (with error message + failed step)

### Brand color handling

`generate.mjs` picks a background/text pairing based on relative luminance:

- **Dark colors** (luminance < 0.35, e.g., `#000000`, `#25232a`): white background, brand-colored title text
- **Light colors** (luminance > 0.85, e.g., cream, off-white like `#fff7e1`): brand background, dark title text (`#1a1a1a`)
- **Everything else**: brand background, white title text

### The learnings loop

Smith is designed to get better with every run.

**On start** (Phase 0): Smith reads `~/.claude/agents/learnings/smith-learnings.md` and applies any prior fixes (login workarounds, timing issues, MCP quirks, per-app credential notes).

**On finish**: Smith appends a new entry to the same file with capture issues, app-specific quirks, process improvements, and Jira integration notes.

The seed file `smith/smith-learnings.md` ships with ~15 real prior runs (MGP, Bizzup, South Asian Food, Valley Gold, Spokane Produce, Williams, Sierra Meat, Downeast Coffee, Marin-Sonoma, Midwest Global Imports, AFBS, Pacific Produce). Copy it to the shared location on first install:

```bash
cp smith/smith-learnings.md ~/.claude/agents/learnings/smith-learnings.md
```

### Known issues + workarounds

- **`http://` in the app URL breaks login** — the HTTP→HTTPS redirect leaves agent-browser on `about:blank`. Always normalize to `https://` before setting `baseUrl`.
- **Order check-in requires an order in the account** — the script auto-expands the order history filter from 30 → 90 days if empty. If the account has zero orders in the last 90 days, the page is skipped.
- **Occasional blank single-viewport captures (~4KB PNG)** — has been seen on Android chat and iPhone chat/order-check-in. Transient; usually resolved by re-running just the affected page. Check file sizes before uploading to app stores.
- **Atlassian MCP intermittently unavailable** — falls back to Finder + manual drag-and-drop. See per-run learnings for JQL that finds the existing ticket in that case.
- **Marketing test credentials in the Jira ticket sometimes differ from working test credentials** — see the Marin-Sonoma learnings entry. Prefer the credentials the previous run used successfully.

### Handover notes

- **Prior owner**: Eshan (eshan@cutanddry.com). Handing over as of 2026-08-18.
- **Current state**: Working end-to-end. ~15 successful runs recorded in `smith-learnings.md`. Composites accepted into iOS and Google Play submissions for all distributors listed above.
- **First things a new owner should do**:
  1. Change the Slack channel in `smith.md` (search for `DL88SS3EU`) to your own DM or the `#smith` channel `C0B4EB10NJJ`.
  2. Copy `smith/smith-learnings.md` to `~/.claude/agents/learnings/smith-learnings.md` so Phase 0 has priors.
  3. Confirm Atlassian + Slack MCPs are connected in your Claude Code install.
  4. Do a test run against a distributor with a known-working Jira epic (see any recent entry in `smith-learnings.md` for a JQL + epic pair).
- **Not portable outside Cut+Dry**: The agent hardcodes Cut+Dry-specific URLs (`/white-label-home`, `/place-order`, `/chat-v2`, `/orders-revised/view-one/`), Jira project (`DOT` at `getcodify.atlassian.net`), and marketing copy. Any repurposing requires editing `smith.md`.

### Re-installing after updates

```bash
git pull
cd smith && npm install
```
