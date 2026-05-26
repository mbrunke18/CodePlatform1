---
name: Investor route — broken /investor
description: /investor is a 404; correct investor routes and where stale links were found
---

The route `/investor` does not exist. Correct routes:
- `/investors` → Investors.tsx (overview, "The Strategic Readiness Platform for startup to Fortune 500")
- `/investor-landing` → InvestorLanding.tsx (full pitch deck, "The Salesforce Moment for Strategic Readiness")

**Stale /investor links found and fixed:**
- StartHere.tsx line 44 (ctaPath)
- OnboardingGuide.tsx line 406 (path)
- Homepage.tsx line 3783 (ctaPath)

**Why:** The route was removed/renamed at some point but internal CTAs were not updated.

**How to apply:** Any new CTA pointing to "the investor page" should use `/investor-landing` for the full deck or `/investors` for the overview.
