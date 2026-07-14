# Readiness OS Replit End-to-End Test Suite

This suite is a deterministic, Chromium-based Playwright workflow intended for Replit runs.

## What this suite covers

The suite validates:

1. **Platform availability**
   - `/health`
   - `/_health`
   - `/api/health`
   - `/api/health-check`

2. **Core public product experience**
   - Homepage
   - How It Executes
   - How It Works
   - Protocol Library
   - Request Access
   - Founding Partner Program
   - 12-Minute Experience
   - Growth
   - Investor Landing
   - Industry Demos

3. **Routing integrity**
   - Alias and redirect behavior (`/home`, `/command-center`, `/pilot-program`)

4. **Feature functionality**
   - Protocol Library guest gating
   - Founding Partner conversion CTA path
   - Request Access form submit success state (with mocked API response)
   - 12-Minute Experience scenario progression into active war room state

5. **Public API response checks**
   - `/api/public/live-context`
   - `/api/playbook-library`
   - `/api/playbook-library/domains`
   - `/api/preparedness/score`
   - `/api/dashboard/metrics`

6. **Baseline static metadata**
   - `<title>`
   - `meta[name="description"]`
   - `meta[property="og:title"]`

---

## Files

- Config: `playwright.replit.config.ts`
- Suite: `e2e/readiness-os-full-suite.spec.ts`

---

## Run commands

From repo root:

```bash
npx playwright test -c playwright.replit.config.ts
```

With an already-running server:

```bash
PLAYWRIGHT_BASE_URL="http://localhost:5000" npx playwright test -c playwright.replit.config.ts
```

Open HTML report:

```bash
npx playwright show-report playwright-report/replit-full-suite
```

---

## Expected outcome

A passing run confirms:

- public routes render expected product narratives,
- core conversion interactions work end-to-end,
- key public APIs respond,
- redirects/aliases behave as intended,
- and the 12-minute demo flow enters the live war-room execution state.
