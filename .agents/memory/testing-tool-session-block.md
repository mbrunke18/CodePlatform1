---
name: Testing skill session-level block
description: runTest() (Playwright testing subagent) can get stuck refusing all tests for the rest of the session after one auth-related blocker, even for unrelated public routes.
---

Once the `runTest()` testing subagent encounters an authentication blocker (e.g. Replit OIDC redirecting protected routes to `/request-access`), it can remember that blocker for the rest of the session and refuse to run *any* subsequent test plan — even one that only targets explicitly public, unauthenticated routes and explicitly instructs it not to touch the gated routes.

**Why:** The subagent appears to cache a session-level "testing is blocked" flag rather than evaluating each new test plan on its own scope. Restarting the `code_execution` sandbox (`restart: true`) does NOT clear this — the block persists across sandbox restarts within the same conversation.

**How to apply:** If `runTest()` returns `"Testing is blocked: Testing was blocked earlier..."` for a test plan that doesn't touch the previously-blocked routes, don't keep retrying with reworded prompts — it won't help. Fall back to manual verification instead: visual screenshots (`screenshot` tool with `app_preview`), `tsc --noEmit`, existing unit/integration test suites, and careful code/diff review. Mention the limitation to the user rather than silently giving up on verification.
