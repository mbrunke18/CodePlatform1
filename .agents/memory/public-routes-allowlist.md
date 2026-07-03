---
name: conditionalAuth PUBLIC_ROUTES allowlist gotcha
description: New public POST endpoints silently 401 unless explicitly added to PUBLIC_ROUTES in server/authConfig.ts
---

`app.use('/api', conditionalAuth)` in `server/routes.ts` wraps every `/api/*` route registered after it. `conditionalAuth` checks `isPublicRoute(path)` against the `PUBLIC_ROUTES` array in `server/authConfig.ts` — routes NOT in that list require auth by default, even if the route handler itself has no `requireAuth`/`requireRole` middleware attached.

**Why:** This is opt-in, not opt-out — copying the code pattern of an existing "public" lead-capture endpoint is not enough, because the reference endpoint itself may already be broken the same way. Found and fixed three endpoints (`/api/test-drive/email-summary`, `/api/situation-scanner/lead`, `/api/roi-calculator/email-report`) that were silently 401ing for real unauthenticated prospects — the intended audience for every public sales tool on this platform.

**How to apply:** Any time you add a new endpoint meant to be called by anonymous/unauthenticated visitors (lead capture, email-export, public calculators, demo/test-drive flows), add its exact path to `PUBLIC_ROUTES` in `server/authConfig.ts` and verify with a real `curl` POST (not just `tsc`/unit tests, which won't catch this) that it returns 200, not 401.

**Regression coverage:** `server/__tests__/public-routes-allowlist.test.ts` calls the real `conditionalAuth`/`isPublicRoute` functions (no DB, no server boot — `authConfig.ts` has zero imports) against a hardcoded list of critical lead-capture paths plus a synthetic protected-path sanity check. Add any new anonymous-facing endpoint to that test's list too, not just to `PUBLIC_ROUTES` — the array alone doesn't fail CI if someone forgets it.
