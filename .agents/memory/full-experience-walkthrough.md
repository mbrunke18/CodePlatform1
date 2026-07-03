---
name: Full Platform Experience walkthrough (/full-experience)
description: Flagship end-to-end sales demo the founder uses solo to sell; how it's structured and how to extend it safely.
---

`/full-experience` (client/src/pages/full-experience/) is the founder's primary sales tool — he is a solo founder and uses this page in place of a live salesperson, so its clarity and persuasive power carry real commercial weight. Treat requests to improve it as sales-critical, not cosmetic.

It's a 10-chapter (Ch0–Ch9) scenario walkthrough driven by client-side state in `FullPlatformExperience.tsx` (chapter index + industryId), not by per-chapter routes — `/full-experience/:scenarioId` only seeds the initial scenario and jumps to chapter 1. There is no URL-addressable way to deep-link into chapter 3+, which makes automated e2e testing of later chapters hard; verify via code review + unit tests + a chapter-1 screenshot when the testing subagent is blocked.

**Why:** the founder has no sales team, so this single page must independently convey the entire platform's breadth, depth, and the cost of not buying — it gets scrutiny other pages don't.

**How to apply / extend:**
- `sc.oldModelCost` (punchy one-liner) and `sc.oldModel` (day-by-day timeline) in `client/src/pages/demos/scenarioData.ts` are the existing, reusable mechanism for "cost of not being a customer" messaging — reuse these fields rather than inventing new copy per chapter.
- A reusable `ProductScreenPanel` component (shared.tsx) shows a real product screenshot + numbered "what to look for as a customer" callouts + route label, used to prove platform breadth/depth without leaving the single situational narrative. Screenshots referenced as plain `/screenshots/<file>.jpg` from `client/public/screenshots/`.
- Chapter titles/labels ("Chapter N — ...") are hardcoded per chapter file — avoid inserting/renumbering chapters; fold new content into existing chapters instead.
