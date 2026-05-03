# onboarding-agents

AI agents for automating Cut+Dry distributor onboarding tasks.

---

## Smith — App Store Screenshot Agent

Smith automates the entire app store submission screenshot pipeline for Cut+Dry white-label apps. Give it a distributor URL and it handles everything: captures screenshots across all required device sizes, composites them into on-brand marketing images, and creates a Jira ticket with all assets attached.

**Time saved: 2–3 hours → ~5 minutes per distributor.**

### What it does

1. Logs into the white-label app and captures 6 pages at 3 device sizes (18 screenshots)
2. Composites screenshots into App Store / Play Store ready images with device frames, brand colors, and marketing titles
3. Creates a Jira ticket under the provided epic and attaches all assets

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Claude Code](https://claude.ai/code) (desktop or CLI)
- Atlassian MCP connected in Claude Code (for Jira ticket creation)

### Installation

```bash
git clone https://github.com/eshandeane/onboarding-agents.git
cd onboarding-agents/smith
npm install
```

That's it. `npm install` will automatically:
- Install Node.js dependencies (`playwright`)
- Download the Chromium browser to `~/Library/Caches/ms-playwright/`
- Register the Smith agent at `~/.claude/agents/smith.md`

Scripts, device frames, and generated screenshots all stay in the cloned repo directory. Nothing else is moved or copied.

### Atlassian MCP setup

Smith needs the Atlassian MCP to create Jira tickets. If you haven't set it up yet, add it to your Claude Code MCP config:

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp
```

Then authenticate when prompted in Claude Code.

### Usage

Once installed, open Claude Code and run the Smith agent:

```
/agents → smith
```

Or start a new conversation and say:

```
Run smith on https://yourapp.cutanddry.com
```

Smith will ask for:
- Login credentials for the app
- Jira epic key (e.g. `DOT-12345`)
- App name (e.g. "Hillcrest Foodservice")
- Brand color (hex, e.g. `#E87722`)

Then walk away. It logs progress to `smith/outputs/screensmith-progress.log` if you want to follow along.

### Output

Composites are saved to `smith/{AccountName}/{android,ios,ipad}/` and automatically attached to the Jira ticket.

| Device | Size |
|--------|------|
| iPhone 6.5" | 1284 × 2778 |
| iPad 12.9" | 2048 × 2732 |
| Android | 1080 × 1920 |
| Feature Graphic | 1024 × 500 |

### Re-installing after updates

```bash
git pull
cd smith && npm install
```
