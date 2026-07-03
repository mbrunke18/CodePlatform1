---
name: Full-experience is the canonical demo front door
description: All legacy demo/walkthrough entry points redirect to /full-experience — do not re-add separate demo landing pages or point new CTAs at the old ones
---

# Canonical Front Door: /full-experience

## The Decision
`/full-experience` (the 11-chapter `FullPlatformExperience` walkthrough) is the single canonical entry point for the "see the whole platform" experience. Legacy/duplicate entry points now **redirect** into it rather than rendering their own page:
- `/master-demo` → `/full-experience/activist` (the old 7-step Activist Investor walkthrough is now chapter-driven inside full-experience)
- `/demo-experience`, `/full-demo`, `/platform-demo`, `/guided-demo` → `/full-experience`
- `/product-tour`, `/video-tour` → `/full-experience` (previously redirected to `/industry-demos`)

`/demo-hub` (browse all 12 individual scenario simulations) and `/demo/:scenarioId` deep links are intentionally **left alone** — they serve a different job ("see my specific situation") and are the "browse all scenarios" path referenced from Homepage/StandardNav, distinct from the "experience the whole platform" job that `/full-experience` now owns.

**Why:** Founder feedback (accumulated ~15+ fragmented demo/nav entry points) — consolidating onto one narratively-complete walkthrough instead of scattering visitors across near-duplicate demo pages. `MasterDemo.tsx` and `DemoExperience.tsx` page components still exist on disk (used by `/demo/:scenarioId` and as redirect history) but are no longer directly routed as top-level "full demo" destinations.

**How to apply:** When adding any new CTA, nav item, or marketing page that wants to showcase "the full platform experience," link to `/full-experience` — never resurrect `/master-demo` or `/demo-experience` as a direct link target. If you need to link to a specific scenario's full walkthrough, use `/full-experience/:scenarioId` (valid ids are in `client/src/data/scenarioData.ts`), not `/master-demo`.
