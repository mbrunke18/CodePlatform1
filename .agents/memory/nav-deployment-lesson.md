---
name: Nav deployment lesson
description: StandardNav is position:fixed (not sticky); deployment verification process for this project.
---

# Nav Architecture & Deployment Verification

## The nav is position:fixed — not sticky

`StandardNav.tsx` uses `className="fixed top-0 left-0 right-0 z-50 w-full"` with a `ResizeObserver`-measured spacer div returned in a Fragment. This replaced `sticky top-0 z-50`.

**Why:** `position:sticky` breaks in real browser windows (not Replit iframe previews) whenever any ancestor gets `overflow:hidden` set dynamically — Radix UI dialogs, PageLayout cleanup code (`el.style.overflow = ''`), or modal libs all trigger this. `position:fixed` is an absolute browser guarantee; no ancestor property can break it.

**How to apply:** Never revert to `sticky` on this nav. If sticky is needed for a sub-component, test in a real browser window (not the Replit preview iframe) before shipping.

## Deployment verification — REQUIRED process

This project's Replit deployment runs `build = ["npm", "run", "build"]` from `.replit` then `run = ["npm", "run", "start"]`. The `dist/` folder is NOT gitignored — it is committed and deployed.

**The failure pattern (happened 3× — do not repeat):**
1. Fix source code
2. Say "it's fixed" based on dev preview (which runs live source, not `dist/`)
3. Deploy — Replit may serve stale `dist/` if build step is cached or skipped
4. Production still shows old behavior

**Required verification steps before saying anything is fixed in production:**
1. Run `npm run build` manually and confirm it completes without error
2. After deploy, fetch deployment logs and look for the `starting up user application` line to confirm new instance started
3. Then check: `grep -c "overflow-x:clip" dist/public/assets/*.css` or equivalent to confirm the built artifact has the change
4. Only then say it is fixed

**Key insight:** The Replit dev preview runs the live TypeScript source via `tsx` — it always shows fixes immediately. Production serves the compiled `dist/` bundle. These are different. A fix that "works in preview" has NOT been verified for production until the build artifact is confirmed.
