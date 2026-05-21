# VaughnMartin Readiness OS — Navigation Architecture

**Last Updated:** May 2026

---

## Navigation Components

Three synchronized navigation systems exist:

| Component | File | Used On |
|-----------|------|---------|
| Homepage inline nav | `client/src/pages/Homepage.tsx` (inline) | Homepage only |
| `StandardNav` | `client/src/components/layout/StandardNav.tsx` | All other pages |
| `IDEASidebar` | `client/src/components/layout/IDEASidebar.tsx` | Authenticated platform pages |

All pages are wrapped by `PageLayout` (`client/src/components/layout/PageLayout.tsx`).

---

## StandardNav — Unauthenticated Desktop Nav

Four top-level dropdown groups plus two icon links and one CTA button:

| Label | Type | Key Paths |
|-------|------|-----------|
| **What We Do** | Dropdown | `/how-it-works`, `/how-it-executes`, `/platform-overview`, `/idea-framework`, `/playbooks`, `/industry`, `/ecosystems`, `/getting-started`, `/mission-control`, `/command-tower`, `/situations-hub`, `/roadmap` |
| **► See It Work** | Dropdown | `/12-minute-experience`, `/demo-hub`, `/master-demo`, `/try-demo`, `/proof-story`, `/protocol-builder`, `/demo/:scenarioId` |
| **The Proof** | Dropdown | `/the-proof`, `/executive-brief`, `/research`, `/roi-calculator`, `/proof-story`, `/readiness-assessment`, `/growth`, `/customer-journey`, `/vs-consulting`, `/ms-project`, `/platform-reality` |
| Guide | Icon + text | `/onboarding-guide` |
| Directory | Icon + text | `/sitemap` |
| **Request Founding Partner Access** | Gold CTA button | `/founding-partner-program` |

> **Note (May 2026):** "Investors" was removed from primary nav. Investor pages remain accessible at `/investor-landing`, `/investor-presentation`, `/investor-resources` via direct URL, footer, and `/sitemap`.

---

## StandardNav — Authenticated Desktop Nav

When signed in, the center nav switches to the product navigation:

| Label | Path |
|-------|------|
| Mission Control | `/mission-control` |
| Protocols | `/playbooks` |
| Execution | `/live-activation-center` |
| Intelligence | `/intelligence-control-center` |
| Command Tower | `/command-tower` |

---

## Homepage Nav (Inline)

Custom nav in `Homepage.tsx`. Not a separate component. Desktop:

```
What We Do | Readiness Infrastructure | ► See It Work | The Proof | Founder's Story | [Request Founding Partner Access]
```

Mobile overlay menu (full-screen, navy background):
- What We Do → `/platform-overview`
- See It Work → `/demo-hub`  
- The Proof → `/the-proof`
- Founder's Story → `/founder-story`
- Request Founding Partner Access

---

## Alert Bar

Persistent teal strip below `StandardNav` on all pages. Three slots:
1. `SEE IT EXECUTE IN 12 MINUTES →` → `/12-minute-experience`
2. `REQUEST FOUNDING PARTNER ACCESS` → `/founding-partner-program`
3. `Executive Sign-In` → auth flow

---

## Route Map (App.tsx — 731 lines, 242 routes)

```
Public Marketing
  /                           Homepage
  /founding-partner-program   Founding Partner Program
  /platform-overview          Platform Overview
  /how-it-works               How It Works
  /how-it-executes            12-Minute Execution Chain (animated)
  /idea-framework             IDEA Framework
  /the-proof                  Why Readiness OS
  /proof-story                Activation Narratives
  /roi-calculator             ROI Calculator
  /executive-brief            Printable Executive Brief
  /security-compliance        Security & Compliance One-Pager
  /growth                     Pricing & Plans
  /research                   Research Foundation
  /vs-consulting              vs. McKinsey / Big 4
  /ms-project                 vs. Microsoft Project / ServiceNow
  /platform-reality           Platform Reality

Demo & Experience (all public)
  /12-minute-experience       4-step interactive test drive (7 scenarios)
  /demo-hub                   Full Scenario Experience Center (12 scenarios)
  /master-demo                Activist Investor — 7-phase walkthrough
  /try-demo                   Interactive demo (side-by-side before/after)
  /demo/:scenarioId           All 12 scenarios → MasterDemo component
  /industry-experience/:id    Industry-specific scenario
  /industry-demos             Industry demos hub

Protocol Library (public browse; login to activate)
  /playbooks                  170 Readiness Protocols + filters + search
  /industry                   Industry Protocol Packs hub
  /industry/:verticalKey      Single vertical pack detail
  /protocol-builder           6-step wizard to build custom protocol

Public Tools
  /readiness-assessment       5-question readiness gap diagnostic
  /command-tower              Live executive wall display (auto-refresh)
  /situations-hub             9-Domain Coverage Board

Founding Partner Journey
  /getting-started            Go-Live Readiness checklist (4 phases)
  /onboarding-guide           Executive Onboarding Guide (PDF-ready)
  /new-user-journey           8-step guided walkthrough
  /request-access             Access request form
  /founding-partner-program   Program page + application form

Authenticated Platform
  /dashboard                  Main user dashboard
  /mission-control            Interactive operations center
  /live-activation-center     War room — active protocol execution
  /practice-drills            Drill library + post-drill debrief
  /workspace                  All 4 IDEA phases in one surface
  /settings, /settings-hub    Platform settings
  /organization-setup         Org configuration
  /intelligence-control-center Signal intelligence hub
  /ai-radar                   Live signal monitoring dashboard
  /signal-intelligence        Signal intelligence deep view
  /triggers-management        Trigger configuration
  /crisis-response-center     Crisis coordination

Investor & Executive Materials
  /investor-landing           Full investor landing page
  /investor-presentation      Slide-format investor deck
  /investor-resources         Resource library
  /roadshow-resources         Roadshow materials
  /pitch-deck                 → redirects to /investor-presentation

Key Redirects
  /command-center             → /mission-control
  /pitch-deck                 → /investor-presentation
  /crisis-hub                 → /situations-hub
  /product-tour, /video-tour  → /industry-demos
```

---

## Search

Global search lives inside `StandardNav.tsx`. Toggles on clicking the magnifying glass icon. Searches all nav link labels and descriptions. Results navigate immediately on click.

---

## Mobile Navigation (< 1024px)

Hamburger opens a full-screen slide-over. Structure mirrors desktop dropdowns with accordion expansion. Implemented entirely in `StandardNav.tsx` (lines ~1000–1200).

---

## Terminology Rules (enforced in all nav copy)

| ❌ Retired | ✅ Current |
|-----------|-----------|
| Pilot Program | Founding Partner Program |
| Playbook | Readiness Protocol |
| Offense / Defense / Special Teams | Growth & Positioning / Risk & Resilience / Transformation |
| AI-powered, AI-driven, AI-generated | system-detected, signal-based, pre-staged |
| Human-AI partnership | AI monitors, executives authorize |
| 340× or 360× speed advantage | 3,600× Execution Head Start |
| 72 hours (as response metric) | 12 minutes |
