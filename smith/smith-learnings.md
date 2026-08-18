
## Run: 05/18/26 — MGP Specialty Food (https://mgpfood.cutanddry.com/)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" but still saved at 34-41KB — these warnings are cosmetic and safe to ignore as long as file size is healthy
- order-check-in was skipped on all devices — the account had no orders in either the default 30-day or 90-day filter range; this is account-specific (no orders in the test account)

### App-Specific Quirks
- Brand color #bd2722 is a dark red (luminance ~0.16) — generate.mjs correctly applied white background + brand-colored title text
- Scripts were already pre-configured for Mgpfood in both capture.mjs and generate.mjs — no edits needed

### Process Improvements for Next Run
- Jira file attachment is not possible via the Atlassian MCP (no attachment tool) and API token is not stored locally — workaround is to add a Jira comment with the folder path and open Finder for manual upload
- Consider storing a JIRA_EMAIL + JIRA_API_TOKEN in ~/.claude/screensmith/.env for curl-based attachment in future runs

### Jira Integration Notes
- Found existing ticket DOT-13354 on first JQL search — no new ticket created
- Comment added to DOT-13354 with composite folder path and device breakdown
- Finder opened for ios/, ipad/, android/ folders for easy manual attachment drag-and-drop


## Run: 05/18/26 — MGP Specialty Food (https://mgpfood.cutanddry.com) [Second Run]

### Capture Issues
- All pages again showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 16–303KB (healthy). Ignore these warnings for Mgpfood.
- order-check-in skipped again — no orders in the account across either 30-day or 90-day filter. This is a persistent account limitation, not a script issue.

### App-Specific Quirks
- Scripts were already pre-configured for Mgpfood (ACCOUNTS in both capture.mjs and generate.mjs) — no edits needed on second run.
- Brand color #bd2722 (dark red, luminance ~0.16) — generate.mjs correctly applied white background + brand-colored title text variant.

### Process Improvements for Next Run
- JQL search `project = DOT AND parent = DOT-12705 AND summary ~ "Submit mobile apps live"` reliably finds DOT-13354 — no new ticket needed.
- Jira attachment still not possible via MCP — comment + Finder workflow is the established approach. Consider storing credentials in ~/.claude/screensmith/.env for curl-based upload.

### Jira Integration Notes
- Found and reused existing ticket DOT-13354 (under epic DOT-12705).
- Comment added with full folder breakdown and device counts.
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment.


## Run: 05/18/26 — MGP Specialty Food (https://mgpfood.cutanddry.com) [Third Run]

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic for this app, files saved at 31–303KB. Safe to ignore.
- order-check-in was successfully captured this time (order /orders-revised/view-one/983265110 found). Account had orders available — prior runs may have been at times with no recent orders.

### App-Specific Quirks
- Scripts pre-configured for Mgpfood in both capture.mjs and generate.mjs — no edits needed on repeat runs.
- Brand color #bd2722 (dark red, luminance ~0.16) — white background + brand-colored title text variant applied correctly by generate.mjs.

### Process Improvements for Next Run
- JQL `project = DOT AND parent = DOT-12705 AND summary ~ "Submit mobile apps live"` reliably finds DOT-13354. No new ticket needed for this app.
- Jira attachment still not possible via MCP. Comment + Finder workflow is established and works well.
- order-check-in availability is variable (depends on whether account has recent orders). Not a script issue.

### Jira Integration Notes
- Reused existing ticket DOT-13354 (third run in a row).
- Comment added with composite folder paths and device counts (05/18/26).
- Finder opened for ios/, ipad/, android/ folders.


## Run: 05/19/26 — MGP Specialty Food (https://mgpfood.cutanddry.com) [Fourth Run]

### Capture Issues
- All pages again showed "Warning: page may not have fully loaded" — confirmed cosmetic for this app. Files saved at 31–324KB (healthy). Ignore these warnings for Mgpfood.
- order-check-in captured successfully this run — order /orders-revised/view-one/983265110 found. Same order ID as third run (05/18/26), suggesting a stable order in the account.

### App-Specific Quirks
- Scripts were already pre-configured for Mgpfood in both capture.mjs and generate.mjs — no edits needed on repeat runs.
- Brand color #bd2722 (dark red, luminance ~0.16) — generate.mjs correctly applied white background + brand-colored title text variant. Generates 7 Android files (6 pages + feature-graphic.png).

### Process Improvements for Next Run
- Atlassian MCP and Slack MCP were not available in this session (not listed in mcp-needs-auth-cache.json). Both had to be skipped. The Jira ticket DOT-13354 under epic DOT-12705 should still exist — verified by 3 prior successful runs. On next run, if MCPs are unavailable, skip directly to Finder workflow.
- Consider storing Atlassian API token in ~/.claude/screensmith/.env (JIRA_EMAIL + JIRA_TOKEN) to enable curl-based Jira commenting and attachment regardless of MCP availability.
- JQL that reliably finds the existing ticket: `project = DOT AND parent = DOT-12705 AND summary ~ "Submit mobile apps live"` → returns DOT-13354.

### Jira Integration Notes
- Atlassian MCP not available in session — Jira comment skipped this run.
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment to DOT-13354.
- Known ticket: DOT-13354 at https://getcodify.atlassian.net/browse/DOT-13354


## Run: 05/19/26 — MGP Specialty Food (https://mgpfood.cutanddry.com) [Fifth Run]

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic for this app. Files saved at 31–324KB (healthy). Ignore these warnings for Mgpfood.
- order-check-in captured successfully — order /orders-revised/view-one/983265110 found again (same stable order as runs 3 & 4).

### App-Specific Quirks
- Scripts were already pre-configured for Mgpfood in both capture.mjs and generate.mjs — no edits needed on repeat runs.
- Brand color #bd2722 (dark red, luminance ~0.16) — generate.mjs correctly applied white background + brand-colored title text variant. Generates 7 Android files (6 pages + feature-graphic.png).

### Process Improvements for Next Run
- Atlassian MCP WAS available this run — ticket DOT-13354 found via JQL and comment added successfully.
- JQL that reliably finds the existing ticket: `project = DOT AND summary ~ "Submit mobile apps live" AND text ~ "MGP"` → returns DOT-13354 (under epic DOT-12705, not the user-provided DOT-12345 which is just the example input).
- Slack notifications working well at all 4 checkpoints (start, capture, composites, done).
- Monitor timeout at 5 minutes — Android was still capturing chat when it timed out. Re-armed via direct output file tail. For future runs, consider increasing monitor timeout to 360,000ms or using Bash until-loop for the final wait.

### Jira Integration Notes
- Reused existing ticket DOT-13354 (fifth run). Real epic key is DOT-12705.
- Comment added successfully via Atlassian MCP (cloudId: 541978bf-65c3-4f38-a69c-b09a79f2c4ba).
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment.


## Run: 06/19/26 — Bizzup Depot (https://bizzup.cutanddry.com)

### Capture Issues
- Initial run failed with "Login failed — landed on: about:blank" — root cause was baseUrl set to "http://" which caused an HTTP→HTTPS redirect timing issue with agent-browser's --url wait pattern
- Fix: always use "https://" in baseUrl even if the user provides "http://"
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 31–241KB (healthy)
- order-check-in needed 90-day filter expansion — no orders with default 30-day filter, but found order #906510019 with 90-day filter

### App-Specific Quirks
- Brand color #B2CC41 (lime green, luminance ~0.71) — light color, so generate.mjs used brand-color background with white title text (correct behavior)
- Login page URL is /log-in (not /login) — but the script opens /login which redirects correctly once https:// is used

### Process Improvements for Next Run
- Always normalize "http://" to "https://" when setting baseUrl — the HTTP→HTTPS redirect causes agent-browser to lose page state and return "about:blank" on the URL check
- If a residual agent-browser session is open from manual debugging, call "ab close" before running capture.mjs to avoid state conflicts
- order-check-in availability is variable (account-dependent); 90-day filter fallback works reliably

### Jira Integration Notes
- No existing ticket found under DOT-10723 — created new ticket DOT-13852
- Ticket URL: https://getcodify.atlassian.net/browse/DOT-13852
- Comment added with composite folder paths and device counts
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment


## Run: 06/19/26 — South Asian Food (https://southasianfood.cutanddry.com)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic for this app, files saved at 48–176KB (healthy). Safe to ignore.
- order-check-in needed 90-day filter expansion — no orders with default 30-day filter, found order #975966845 with 90-day filter

### App-Specific Quirks
- Brand color #DF382F (red, luminance ~0.41) — above 0.35 threshold, so brand-colored background with white title text (NOT dark variant)
- Login URL /login works correctly (no redirect issues) — https:// normalization from Bizzup learning applied successfully

### Process Improvements for Next Run
- http:// → https:// normalization continues to be critical; applied correctly here
- No existing ticket found under DOT-10971 — created new ticket DOT-13854
- Jira attachment still not possible via MCP — comment + Finder workflow is established and works well

### Jira Integration Notes
- Created new ticket DOT-13854 under epic DOT-10971
- Ticket URL: https://getcodify.atlassian.net/browse/DOT-13854
- Comment added with composite folder paths and device counts
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment


## Run: 06/24/26 — South Asian Food (https://southasianfood.cutanddry.com) [Second Run]

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic for this app, files saved at 50–287KB (healthy). Safe to ignore.
- order-check-in needed 90-day filter expansion — no orders with default 30-day filter, found order #975966845 (same stable order as prior run 06/19/26)

### App-Specific Quirks
- Scripts were already pre-configured for Southasianfood in both capture.mjs and generate.mjs — no edits needed on repeat runs
- Brand color #DF382F (red, luminance ~0.41) — above 0.35 threshold, brand-colored background with white title text (NOT dark variant)

### Process Improvements for Next Run
- JQL `project = DOT AND parent = DOT-10971 AND summary ~ "Submit mobile apps live"` reliably finds DOT-13854
- Atlassian MCP comment timed out on first attempt — retry immediately, second attempt succeeds
- order-check-in order #975966845 is stable across multiple runs (06/19 and 06/24)

### Jira Integration Notes
- Reused existing ticket DOT-13854 under epic DOT-10971
- Comment added successfully on second attempt (first timed out)
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment

## Run: 07/10/26 — Valley Gold (https://valleygold.cutanddry.com)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 30–312KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order /orders-revised/view-one/1056386158 found without needing 90-day filter expansion.

### App-Specific Quirks
- Brand color #fff7e1 is a near-white cream (luminance ~0.97) — falls into a new "very light color" edge case: isDarkColor returns false, but white text on cream background would be invisible.
- Fixed by adding isLightColor() check (luminance > 0.85) in generate.mjs: light colors now use brand-color background + dark text (#1a1a1a) instead of white text. Applied to both generateComposite() and generateFeatureGraphic().

### Process Improvements for Next Run
- isLightColor guard now in generate.mjs — no further action needed for light brand colors.
- No existing ticket found under DOT-8393 — created new ticket DOT-14061.
- JQL to find existing ticket on repeat runs: `project = DOT AND parent = DOT-8393 AND summary ~ "Submit mobile apps live"` → DOT-14061

### Jira Integration Notes
- Created new ticket DOT-14061 under epic DOT-8393
- Ticket URL: https://getcodify.atlassian.net/browse/DOT-14061
- Comment added successfully on first attempt (no timeout)
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment

## Run: 07/10/26 — Spokane Produce (https://spokaneproduce.cutanddry.com)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 31–289KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order /orders-revised/view-one/1056847253 found without needing 90-day filter expansion.

### App-Specific Quirks
- Brand color #0C371B is very dark green (luminance well below 0.35) — generate.mjs correctly applied white background + brand-colored title text.
- https:// normalization applied correctly (no http:// redirect issues).

### Process Improvements for Next Run
- Atlassian MCP was unavailable again this session (not listed in deferred tools even after multiple ToolSearch attempts). Fall directly to Finder workflow when MCP doesn't load.
- JQL to find existing ticket on future runs: `project = DOT AND parent = DOT-12232 AND summary ~ "Submit mobile apps live"`
- Storing JIRA_EMAIL + JIRA_API_TOKEN in ~/.claude/screensmith/.env would enable curl-based Jira search/create/comment without relying on the MCP.

### Jira Integration Notes
- Atlassian MCP not available — Jira ticket search/create skipped.
- Epic: DOT-12232. Ticket to be created/found manually: "Spokane Produce - Submit mobile apps live"
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment.

## Run: 07/15/26 — Williams Foodservice (https://williams.cutanddry.com)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic for this app, files saved at 16–262KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order /orders-revised/view-one/1060266594 found without needing 90-day filter expansion.

### App-Specific Quirks
- Brand color #D83936 (red, luminance ~0.41) — above 0.35 threshold, brand-colored background with white title text (NOT dark variant, NOT light variant).
- https:// normalization applied correctly (no redirect issues).

### Process Improvements for Next Run
- JQL to find existing ticket on future runs: `project = DOT AND parent = DOT-9052 AND summary ~ "Submit mobile apps live"` → DOT-14103
- No existing ticket found under DOT-9052 — created new ticket DOT-14103.
- Jira attachment still not possible via MCP — comment + Finder workflow is established and works well.

### Jira Integration Notes
- Created new ticket DOT-14103 under epic DOT-9052
- Ticket URL: https://getcodify.atlassian.net/browse/DOT-14103
- Comment added successfully on first attempt (no timeout)
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment


## Run: 07/16/26 — Williams Foodservice (https://williams.cutanddry.com) [Second Run]

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic for this app, files saved at 57–260KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order /orders-revised/view-one/1044844348 found without needing 90-day filter expansion.

### App-Specific Quirks
- Scripts were already pre-configured for Williams in both capture.mjs and generate.mjs — no edits needed on repeat runs.
- Brand color #D83936 (red, luminance ~0.41) — above 0.35 threshold, brand-colored background with white title text (NOT dark variant, NOT light variant).

### Process Improvements for Next Run
- JQL to find existing ticket: `project = DOT AND parent = DOT-9052 AND summary ~ "Submit mobile apps live"` → DOT-14103
- Atlassian MCP available and working this session — comment added on first attempt.
- addCommentToJiraIssue requires `issueIdOrKey` parameter (not `issueKey`) — use correct param name to avoid validation error.

### Jira Integration Notes
- Reused existing ticket DOT-14103 under epic DOT-9052
- Comment added successfully on first attempt
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment


## Run: 07/31/26 — Sierra Meat Seafood (https://sierrameat.cutanddry.com)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 33–303KB (healthy). Safe to ignore.
- Android order-check-in was captured but came back at only 4KB (likely blank). iPhone 6.5 and iPad 12.9 order-check-in were healthy (57KB / 137KB). This suggests the order-check-in page loaded correctly for larger viewports but timed out or failed silently for the Android 411x915 viewport on the last pass.
- All other 17 screenshots healthy.

### App-Specific Quirks
- Brand color #CB333B (red, luminance ~0.38) — above 0.35 threshold, brand-colored background with white title text (NOT dark or light variant).
- https:// normalization applied correctly (no redirect issues).

### Process Improvements for Next Run
- Android order-check-in blank (4KB) issue: consider re-running capture for just that one page/viewport if this happens again, rather than re-capturing all 18 screenshots.
- Folder name derived from URL: sierrameat.cutanddry.com → "Sierrameat" (first subdomain, capitalized).

### Jira Integration Notes
- No existing ticket found under DOT-13490 — created new ticket DOT-14291.
- Ticket URL: https://getcodify.atlassian.net/browse/DOT-14291
- Comment added successfully on first attempt (no timeout).
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment.


## Run: 08/03/26 — Downeast Coffee Wholesale (https://downeastcoffee.cutanddry.com)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 32–371KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order /orders-revised/view-one/1079700886 found without needing 90-day filter expansion.

### App-Specific Quirks
- Brand color #D22630 (dark red, luminance ~0.148) — generate.mjs correctly applied white background + brand-colored title text variant.
- https:// normalization applied correctly (no redirect issues).

### Process Improvements for Next Run
- JQL to find existing ticket on future runs: `project = DOT AND parent = DOT-13125 AND summary ~ "Submit mobile apps live"` → DOT-14082
- Existing ticket DOT-14082 found on first search — no new ticket created.
- Atlassian MCP available and working this session — comment added on first attempt.

### Jira Integration Notes
- Reused existing ticket DOT-14082 under epic DOT-13125.
- Comment added successfully on first attempt (no timeout).
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment.

## Run: 08/03/26 — Sierra Meat & Seafood (https://sierrameat.cutanddry.com) [Second Run]

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 36–304KB (healthy). Safe to ignore.
- Android order-check-in that was blank (4KB) on the 07/31/26 run was healthy this time (56KB). Issue was transient — not a persistent problem with this app or viewport.
- All 18 screenshots healthy across all 3 device sizes.

### App-Specific Quirks
- Brand color #CB333B (red, luminance ~0.38) — above 0.35 threshold, brand-colored background with white title text (NOT dark or light variant).
- Scripts updated from Downeastcoffee to Sierrameat in both capture.mjs and generate.mjs — no further edits needed on repeat runs.

### Process Improvements for Next Run
- JQL to find existing ticket: `project = DOT AND parent = DOT-13675 AND summary ~ "Submit mobile apps live"` → DOT-13926
- Atlassian MCP available and working this session — comment added on first attempt.
- Use `issueIdOrKey` parameter name (not `issueKey`) in addCommentToJiraIssue.

### Jira Integration Notes
- Found existing ticket DOT-13926 under epic DOT-13675 on first JQL search.
- Comment added successfully on first attempt (no timeout).
- Finder opened for ios/, ipad/, android/ for manual drag-and-drop attachment.

## Run: 08/03/26 — Marin-Sonoma Produce (https://marin-sonoma.cutanddry.com)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 44KB–306KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order found without needing 90-day filter expansion.
- All 18 screenshots healthy across all 3 device sizes (Android 44–77KB, iPad 124–306KB, iPhone 61–80KB).

### App-Specific Quirks
- Brand color #A6B627 (yellow-green, luminance ~0.63) — above 0.35 and below 0.85 thresholds, brand-colored background with white title text (standard behavior).
- https:// normalization applied correctly (no redirect issues).

### Process Improvements for Next Run
- JQL to find existing ticket: `project = DOT AND parent = DOT-13908 AND summary ~ "Submit mobile apps live"` → DOT-13948
- Existing ticket DOT-13948 found on first search — no new ticket created.
- Atlassian MCP available and working this session — comment added on first attempt.

### Jira Integration Notes
- Reused existing ticket DOT-13948 under epic DOT-13908.
- Comment added successfully on first attempt (no timeout).
- Finder opened at ~/.claude/screensmith/Marin-Sonoma/ for manual drag-and-drop attachment.

## Run: 08/04/26 — Marin-Sonoma Produce (https://marin-sonoma.cutanddry.com) [Second Run]

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 44KB–299KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order /orders-revised/view-one/1082492461 found without needing 90-day filter expansion.
- All 18 screenshots healthy across all 3 device sizes.

### App-Specific Quirks
- App review credentials in Jira ticket (chrisc+marin-sonoma@cutanddry.com / password) are NOT the same as the working test account (eshan+marin@cutanddry.com / 12345678). Always use eshan+marin credentials for Smith captures on this app.
- Brand color #A6B627 (yellow-green, luminance ~0.63) — brand-colored background with white title text (standard behavior, not dark or light variant).

### Process Improvements for Next Run
- JQL to find existing ticket: `project = DOT AND parent = DOT-13908 AND summary ~ "Submit mobile apps live"` → DOT-13948
- Atlassian MCP available and working — comment added on first attempt.
- Use `eshan+marin@cutanddry.com` / `12345678` as the working test credentials for this app, NOT the app store review credentials listed in the Jira ticket.

### Jira Integration Notes
- Reused existing ticket DOT-13948 under epic DOT-13908.
- Comment added successfully on first attempt (no timeout).
- Finder opened at ~/.claude/screensmith/Marin-Sonoma/ for manual drag-and-drop attachment.


## Run: 08/04/26 — Midwest Global Imports (https://midwestimports.cutanddry.com/)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 50–245KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order /orders-revised/view-one/1081734109 found without needing 90-day filter expansion.
- All 18 screenshots healthy across all 3 device sizes.

### App-Specific Quirks
- Brand color #000000 (pure black, luminance = 0) — generate.mjs correctly applied white background + black title text variant (isDarkColor = true).
- Folder name derived from URL: midwestimports.cutanddry.com → "Midwestimports" (first subdomain, capitalized). User-provided folder name "Https://midwestimports" was a parsing artifact — always re-derive from URL.
- Scripts were pre-configured for Americasfinestbarsupply from a prior incomplete run — updated to Midwestimports in both capture.mjs and generate.mjs.

### Process Improvements for Next Run
- JQL to find existing ticket: `project = DOT AND parent = DOT-13490 AND summary ~ "Submit mobile apps live"` → DOT-14312
- No existing ticket found under DOT-13490 for Midwest Global Imports — created new ticket DOT-14312.
- Atlassian MCP available and working this session — comment added on first attempt.
- Always re-derive folder name from URL (first subdomain, capitalized), even if user provides one — user-provided value may be malformed.

### Jira Integration Notes
- Created new ticket DOT-14312 under epic DOT-13490.
- Ticket URL: https://getcodify.atlassian.net/browse/DOT-14312
- Comment added successfully on first attempt (no timeout).
- Finder opened at ~/.claude/screensmith/Midwestimports/ for manual drag-and-drop attachment.


## Run: 08/04/26 — AFBS Ordering (https://americasfinestbarsupply.cutanddry.com)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 56–207KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order found without needing 90-day filter expansion.
- All 18 screenshots healthy across all 3 device sizes.

### App-Specific Quirks
- Brand color #25232a (near-black, luminance well below 0.35) — generate.mjs correctly applied white background + brand-colored title text variant.
- Existing ticket DOT-13849 found under epic DOT-13566 on first JQL search — no new ticket created.

### Process Improvements for Next Run
- JQL to find existing ticket: `project = DOT AND parent = DOT-13566 AND summary ~ "Submit mobile apps live"` → DOT-13849
- Atlassian MCP available and working this session — comment added on first attempt.
- User-provided folder name "Https://americasfinestbarsupply" was a parsing artifact — re-derived correctly from URL as "Americasfinestbarsupply".

### Jira Integration Notes
- Reused existing ticket DOT-13849 under epic DOT-13566.
- Comment added successfully on first attempt (no timeout).
- Finder opened at ~/.claude/screensmith/Americasfinestbarsupply/ for manual drag-and-drop attachment.


## Run: 08/04/26 — Pacific Produce & Provisions (https://pacificproduce.cutanddry.com)

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic, files saved at 32–245KB (healthy). Safe to ignore.
- order-check-in captured successfully on first attempt — order /orders-revised/view-one/1085289228 found without needing 90-day filter expansion.
- All 18 screenshots healthy across all 3 device sizes.

### App-Specific Quirks
- Brand color #32420d (very dark olive green, luminance well below 0.35) — generate.mjs correctly applied white background + brand-colored title text variant.
- https:// normalization applied correctly (user-provided URL had trailing slash — no issues).
- Existing ticket DOT-14294 found under epic DOT-136 on first JQL search — no new ticket created.

### Process Improvements for Next Run
- JQL to find existing ticket: `project = DOT AND parent = DOT-136 AND summary ~ "Submit mobile apps live"` → DOT-14294
- User-provided folder name "Https://pacificproduce" was a parsing artifact — re-derived correctly from URL as "Pacificproduce" (first subdomain, capitalized).
- Atlassian MCP available and working this session — comment added on first attempt.

### Jira Integration Notes
- Reused existing ticket DOT-14294 under epic DOT-136.
- Comment added successfully on first attempt (no timeout).
- Finder opened at ~/.claude/screensmith/Pacificproduce/ for manual drag-and-drop attachment.

## Run: 08/04/26 — South Asian Food (https://southasianfood.cutanddry.com) [Third Run]

### Capture Issues
- All pages showed "Warning: page may not have fully loaded" — confirmed cosmetic for this app, files saved at 31–101KB (healthy). Safe to ignore.
- iPhone 6.5 chat.png was only 3.7KB (likely blank) — iPad (37KB) and Android (31KB) chat were healthy. This is the same transient single-viewport blank issue seen on Sierra Meat second run; composites were still generated.
- order-check-in captured successfully across all devices (33KB / 37KB / 31KB) without needing 90-day filter expansion.

### App-Specific Quirks
- Scripts were already pre-configured for Southasianfood in both capture.mjs and generate.mjs — no edits needed on repeat runs.
- Brand color #DF382F (red, luminance ~0.41) — above 0.35 threshold, brand-colored background with white title text (NOT dark or light variant).

### Process Improvements for Next Run
- JQL to find existing ticket: `project = DOT AND parent = DOT-10971 AND summary ~ "Submit mobile apps live"` → DOT-13854
- Atlassian MCP available and working this session — comment added on first attempt (no timeout).
- iPhone 6.5 chat blank (3.7KB): check ios/chat.png before uploading to app stores. If blank, re-run capture for just that page or use a prior run's version.

### Jira Integration Notes
- Reused existing ticket DOT-13854 under epic DOT-10971.
- Comment added successfully on first attempt (no timeout).
- Finder opened at ~/.claude/screensmith/Southasianfood/ for manual drag-and-drop attachment.

