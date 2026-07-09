---
name: health-check workflow spurious 404s
description: The health-check workflow can report all-pages-404 even when the app is healthy; verify with a direct script run before trusting it.
---

The `health-check` workflow (`scripts/health-check.mjs`) fires 28 concurrent
`Promise.all` fetches against the dev server. When triggered via the workflow
runner (especially right after other edits/restarts touched the dev server),
it can report 27/28 pages as `404` while only a slow DB-backed API route
passes — even though the app is fully healthy.

**Why:** The workflow-triggered run appears to race the dev server's
restart/HMR state in a way a plain sequential `curl` never does, and the
concurrent burst of 28 simultaneous requests seems to trigger it. Sequential
curls to the same routes return 200 the entire time this is happening.

**How to apply:** If the `health-check` workflow reports many/most pages
failing (not a handful of unrelated ones), do not treat it as a real
regression. Re-verify with `node scripts/health-check.mjs` run directly via
the bash tool (not the workflow) — this reliably reflects the true state and
has resolved to 28/28 passing every time the workflow falsely reported
failures. Only trust a failure that also reproduces with direct curl or a
direct script run.
