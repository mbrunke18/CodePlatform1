---
name: E2E testing subagent quirks
description: Known failure modes of the Playwright-based runTest() e2e testing subagent in this project
---

## Stale cross-run auth block
`runTest()` can return `Error: Testing is blocked` citing a Replit OIDC auth blocker (e.g. `/dashboard` redirecting to `/request-access`, `GET /api/auth/user` 401) even when the test plan only targets a fully public route (like the marketing Homepage at `/`) and never touches an authenticated path.

**Why:** The testing subagent appears to carry a cached "blocked" verdict from an earlier test attempt in the same session that hit a protected route, and it applies that verdict to unrelated subsequent test plans rather than evaluating the new plan in isolation.

**How to apply:** If this happens, retrying with an even more explicit "public route only, do not visit X" test plan does not clear it (confirmed by two consecutive retries). Don't burn more attempts — fall back to unit tests, `tsc --noEmit`, workflow log inspection, and manual `screenshot` tool checks to verify the change, and note in the completion summary that e2e verification was blocked by this stale subagent state rather than a real app issue.
