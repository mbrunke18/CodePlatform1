# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform designed for Fortune 1000 companies. Its primary purpose is to automate project creation, task assignment, document staging, and budget allocation, enabling a 12-minute response to strategic triggers. The platform integrates 170 strategic playbooks across 9 domains within its proprietary IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE). AI monitors continuously and recommends; executives authorize; execution is pre-staged before the trigger fires. No playbook activates without executive approval — the human decision is the same, it just arrives in seconds instead of 30 days. The project's vision is to become "The Execution Infrastructure Enterprises Are Missing," making enterprises "Fearless" by targeting C-suite executives and boards.

## User Preferences
- Preferred communication style: Simple, everyday language
- **FOUNDER VISION (HIGHEST PRIORITY — LOCKED):** "We redesign how work flows in the age of AI." Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint. But every vendor bolted AI onto the old model (faster spreadsheets, smarter summaries, better notes from the same slow meetings). VaughnMartin rebuilds from first principles. Pre-staged playbooks REPLACE real-time coordination. Pattern detection REPLACES committee deliberation. 12-minute execution REPLACES 30-day alignment cycles. **We are NOT competing with Copilot or AI tools — we're competing with the 40-year-old meeting-heavy operating model itself.** This thesis must be present on the Homepage, Investor pages, Founder Story, and Presentation slides.
- **LOCKED MESSAGING — NEVER CHANGE:** The 3,600× metric is NOT a generic "speed advantage." The real-world comparison is weeks to months (30 days conservative baseline) vs. 12 minutes. In a Fortune 1000, when a strategic trigger fires, the enterprise spends weeks just to MOBILIZE — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — before execution even begins. Execution OS compresses that entire cycle to 12 minutes. The correct label is always "3,600× Execution Head Start" — never "speed advantage," never "faster." The correct framing is "30 days compressed to 12 minutes." Comparison table entries must NEVER show "0" — use: "Automatic — continuous monitoring," "Pre-staged before the trigger fires," "Pre-staged — 170 playbooks ready," "Automated at trigger point," or "12 minutes after trigger detection." Every instance of this metric on the platform must reflect this framing. The old "340×" and "72 hours" framing is RETIRED.
- **MICROSOFT FRAMING (LOCKED):** "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Execution OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator.
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision: AI monitors, executives authorize, execution pre-staged. The phrase "human-AI partnership" is RETIRED from all UI/UX copy — replace with "AI monitors, executives authorize" or "Executive authority preserved." No playbook activates without executive sign-off. The preparation compresses the mobilization cycle; the decision remains human.
- Executive professional language required across UI/UX
- All text must be clearly and boldly readable — medium weight minimum, deep navy or dark gray
- Brand placement and visual memory is a priority — logo should appear on every key page
- Desktop-first layout; mobile adjustments only if non-disruptive
- Homepage dark sections use `NAVY_BG="#132558"` (not `NAVY="#0A0F2E"`) for large `<section>` backgrounds — lighter so it reads as genuine navy blue rather than near-black. All other files use `NAVY` only. Dark sections layer a gold grid (`rgba(201,168,76,0.09)`, 1px, 48px) and large radial gradient orbs (teal + gold, 600–1000px, opacity 0.11–0.22) for visual depth.

## RETIRED Phrases & Routing — Enforce Strictly
The following are permanently retired from all copy and code. Any agent finding these must replace them:
- **"HUMAN-AI PARTNERSHIP"** → replace with "AI monitors, executives authorize" or "Executive authority preserved"
- **"340×"** and **"72 hours → 12 minutes"** → replace with "3,600× Execution Head Start" and "30 days → 12 minutes"
- **"ExecuteIQ"** brand name → replace with "VaughnMartin" or "Execution OS"
- **`/pilot-program`** as a navigation CTA → replace with `/request-access`. The `/pilot-program` page itself still exists as a product description of the $75K formal enterprise engagement — only nav links and CTAs pointing prospects there are retired.
- **"Q1 2026"** in forward-looking marketing copy → use current or remove

## Developer Rules — CSS & Styling (CRITICAL)
These rules were enforced in a full codebase audit (April 2026) and must be followed in all new code:

**1. Outline buttons on dark backgrounds — ALWAYS add `bg-transparent`**
Shadcn's `variant="outline"` Button applies `bg-background` (pure white in light mode). On dark-background pages, this creates white text on white background = invisible. Any time you write `variant="outline"` with light text on a dark page, add `bg-transparent` to className:
```tsx
<Button variant="outline" className="bg-transparent text-white border-white/20 hover:bg-white/10">
```

**2. Never use `text-gray-900` on dark or colored backgrounds**
`text-gray-900` is near-black. It's invisible on: dark navy (`#0A0F2E`), teal (`#2B8A6E`), any gradient `from-[#0A0F2E]`, red, amber, or orange backgrounds. Use `text-white` instead. This applies to icons, badges, and button text — everywhere.
```tsx
// WRONG — invisible dark text on dark navy gradient button
<Button className="bg-gradient-to-r from-[#0A0F2E] to-teal-600 text-gray-900">
// CORRECT
<Button className="bg-gradient-to-r from-[#0A0F2E] to-teal-600 text-white">
```

**3. Hover states must pair background + text color**
If you add `hover:bg-[#0A0F2E]` to a button with dark text, you must also add `hover:text-white`. Dark text on dark hover background = invisible.

**4. Demo pages must NOT use `page-background` or `min-h-screen` Tailwind classes**
The `.page-background` class in `index.css` forces `background: #ffffff !important`. Demo pages with dark backgrounds must use inline styles:
```tsx
style={{ minHeight: "100vh", background: "#0A0F2E" }}
```

**5. Every outcome/results screen must have a primary gold CTA → `/request-access`**
No dead ends. After any demo, simulation, or quiz result, show a conversion button.

**6. Brand colors (use these, not one-off hex values)**
```
NAVY   = #0A0F2E  (page backgrounds, dark sections)
GOLD   = #C9A84C  (primary CTAs, highlights)
TEAL   = #2B8A6E  (secondary actions, success states)
TEAL_L = #3BAF8A  (lighter teal accents)
IVORY  = #F0EDE4  (light backgrounds, card surfaces)
NAVY_BG = #132558 (Homepage dark section backgrounds ONLY)
```

## System Architecture

**UI/UX Decisions:**
- **Theme:** Light mode with pure white backgrounds; dark mode supported.
- **Typography:** Global base font-weight 500; headings are font-weight 700 in midnight navy.
- **Branding:** Consistent VaughnMartin and Execution OS branding with a circular seal logo (gold gradient rings, 8 tick marks, "VAUGHNMARTIN" / "EXECUTION OS" text, VM monogram). Variants: `full` | `icon-only` | `text-only`. Logos use a gold gradient ring. Component: `VaughnMartinLogo` (the old `ExecuteIQLogo` is retired).
- **Navigation:** Three synchronized navigation systems: `HomepageNav` (flat links, homepage only), `StandardNav` (dropdown-based, all other pages), and `IDEASidebar` (accordion, authenticated platform view).
- **Layout:** All pages are wrapped by a `PageLayout` component including `StandardNav` and `Footer`.
- **Homepage:** Focuses on 12-minute execution, IDEA Framework, and research-backed validation, with a specific, unchangeable section order.

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form + Zod, Framer Motion.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server.
- **Microsoft Ecosystem:** Integration with Microsoft Teams, Azure OpenAI, Copilot Studio, and Microsoft Entra.
- **AI Services:** Primarily Azure OpenAI, with fallback to OpenAI GPT-4o, utilizing a multi-agent IDEA Framework.
- **Authentication:** Replit OIDC with Passport.js, creating organizations for new users.
- **Role-Based Access:** `requireRole()` middleware for permissions.
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.
- **Email:** Resend API with sender `pilot@vaughnmartin.com` (fallback: `onboarding@resend.dev`).

**Feature Specifications:**
- **Core Platform:** Playbook Library (170 playbooks), Demo Experience, Execution Intelligence Dashboard, Investor Gate, admin views.
- **AI-Powered Execution:** AI Execution Briefs, Live War Room, Post-Activation Debriefs with performance scores and AI recommendations.
- **Automation & Simulation:** Auto-Task Seeding, embeddable Workspace Pages, Guided Start Experience, Shadow Strategy Simulator (Digital Twin).
- **IDEA Framework:** Full Trigger → Playbook IDEA Chain for detecting triggers and recommending playbooks.
- **Task Management:** Task Acknowledgment & Audit Trail with action buttons.
- **Reporting & Analytics:** Execution History Dashboard with KPIs and activation logs.
- **Flagship Playbooks:** 23 enriched playbooks with expert content, task owners, time targets, and decision gates. (14 original + 9 added April 2026: AI Competitive Disruption, Data Breach, CEO Sudden Departure, Financial Services Compliance Breach, SLA Mass Breach, Competitive Acquisition, AI Data Privacy Breach, Third-Party Data Breach, Compound Cyber+Regulatory — all with 4 phases, role-specific tasks, decision gates, restrictions.)
- **Configuration Wizards:** Trigger Configuration Wizard for setting up situations and playbook mapping.
- **Key Differentiators:** Execution ROI Dashboard, Compound Threat Intelligence, Strategic Recorder, War Room Pulse Map.
- **Data Consistency:** Strict adherence to consistent values for response time (12 minutes), execution head start (3,600×, labeled "3,600× Execution Head Start"), number of playbooks (170), signals, data points (248+), and triggers (221).
- **Personalized ROI Calculator:** Homepage section calculating annual value, exec time saved, and revenue protected.
- **12-Minute Test Drive:** A public 4-step sequential experience simulating execution.
- **Playbook Public Access Model:** 3 playbooks are fully public (no auth required): "Aggressive Pricing Disruption", "AI Competitive Disruption", "Compound: Geopolitical + Supply Chain Disruption". All 167 others require authentication (locked). Guests are directed to `/request-access` for magic link access. The `/pilot-program` page describes the formal $75K enterprise engagement and still exists — but it is NOT used as a navigation CTA destination. Authenticated users see all 170 with Deploy/Preview actions.
- **Playbook Public Access Copy:** Bottom CTA on sample playbooks reads: "You just read one of 3 public playbooks. 167 exclusive ones are already protecting your competitors." Sidebar reads: "167 exclusive playbooks are waiting for your team." The 167 refers specifically to the locked pilot-only playbooks, not 170-1.
- **McKinsey Research Citations (TWO reports):** (1) Enterprise Architecture Synthesis 2025–26 — 65%/1%/$4.4T stats, used in general platform credentialing. (2) MGI "Skill Partnerships in the Age of AI" Nov 2025 — $2.9T labor impact, 90% of executives believe AI will change their operating model, <40% have an execution framework, 77% cite mobilization speed as top barrier. Includes CEO quote, bottleneck quote ("The bottleneck is never the technology…"), and 3 case studies (Finance/Healthcare/Manufacturing). Both featured in `McKinseyValidationSection` on Homepage and the Investor Presentation McKinsey slide.
- **Live Signal Detection:** Real RSS ingestion from 8 sources (NYT, BBC, SEC EDGAR, CNBC, MarketWatch, NPR, Google News Finance, Entrepreneur), every 15 minutes. `SignalEvaluationService` scores signals against 16 trigger patterns, requiring 3+ keyword matches and confidence ≥ 72% before a `trigger_detection` is created and email alerts sent. 4-hour deduplication window per trigger name prevents alert fatigue. Includes a `LiveDetectionFeed` page and Stakeholder Contact Registry.
- **Command Tower:** Full-screen executive display page (`/command-tower`) — live trigger detections, system pulse stats, execution log, signal ticker, WebSocket real-time updates, countdown to next scan, and MONITORING/ALERT/EXECUTING status badge. First item under EXECUTE in the sidebar nav.
- **Dual Evaluation Engine:** `SignalEvaluationService` runs configured + default engines in parallel (`'both'` mode, switchable per org). Each detection entry tracks its source engine (`'configured' | 'default'`) for accurate audit logging.
- **Magic Link Authentication:** `/request-access` form for branded magic link login, creating tracked user identities. On first token activation, `sendWelcomeTriggerDemo(email, firstName)` fires immediately — a guaranteed "AI Competitive Disruption" trigger alert email (94% confidence, 5 keywords matched, CNBC source) that bypasses the RSS pipeline entirely. Sender order: `pilot@vaughnmartin.com` first, then `onboarding@resend.dev` fallback. Fired fire-and-forget from `/api/auth/magic-link/verify` after token verification. One-time only (tokens are single-use).
- **Growth Segment:** Permanent product track targeting SMBs and PE-backed startups with three tiers: Ready, Responsive, Orchestrated, based on deployment scope (not discounted products or per-seat pricing).
- **Unsubscribe System:** Public `GET /api/unsubscribe?t=<base64url>` endpoint with branded confirmation page. All 4 email types send individually per-recipient with personalized unsubscribe tokens. `isActive = false` removes from all pipelines.
- **Execution Clock:** `execution_timelines` DB table tracks 12-minute clock milestones per trigger event (detectedAt, notificationSentAt, playbookActivatedAt, firstTaskAcknowledgedAt, executionCompletedAt, totalMinutes, speedMultiplier). `ExecutionClock` component shown on Mission Control with expand/collapse per event and milestone advance buttons.
- **Execution Dividend:** Real-time ROI counter (`ExecutionDividend` component on Mission Control). Formula: triggerCount × hours saved vs. 30-day baseline × $500/hr. API at `GET /api/org/execution-dividend`.
- **Board Readiness Snapshot:** Print-ready executive report at `/board-readiness`. Domain coverage ring, response time stats, Execution Dividend, readiness score (0-100), recent detections table. Print/PDF export via `window.print()`. Sidebar under ADVANCE.
- **Day One Welcome Brief:** Full-screen first-login experience at `/welcome-brief`. localStorage gate (shown once). Shows triggers armed, signals scanned 72h, historical detections, "what you would have seen" panel.
- **Live Signal Activity Feed:** `signal_activity_log` DB table buffers scan events (scanning, threshold_not_met, trigger_fired). `LiveSignalFeed` component on Command Tower shows real-time evaluation work. `SignalEvaluationService` logs one "scanning" entry per batch + up to 2 "threshold_not_met" entries for partial matches + "trigger_fired" on detection.
- **5 New APIs:** `GET /api/org/execution-timelines`, `PATCH /api/org/execution-timelines/:id/advance`, `GET /api/org/execution-dividend`, `GET /api/org/board-readiness`, `GET /api/org/welcome-brief`, `GET /api/signal-activity-log`.
- **PlaybookDetail Task Editor:** Authenticated users have an "Edit Tasks" tab on every playbook detail page. Full phase accordion editor: rename phase name/objective, add/remove role task groups, edit task items inline, update decision gate title/criteria/escalation, add/remove restrictions. Saves via `PATCH /api/playbook-library/:id/customize` → `enrichedPhases` column. Amber dot indicator signals unsaved changes. State syncs from `playbook.enrichedPhases` on load.
- **Coaching / NFL Analogy Sections:** Two placements anchor the operating model metaphor. (1) Homepage `PlaybookAnalogySection` — inserted between `ContrastMomentSection` and `IDEASection` — 4-column grid mapping elite coach cycle (Game Planning → Reading the Field → Play Call → Film Study) to IDENTIFY/DETECT/EXECUTE/ADVANCE, with pull quote "60–80 strategic decisions per 3-hour game. Under 40 seconds each." (2) IDEA Framework page — compact analogy panel after the phase strip, before deep-dives, with authority closer: "AI monitors. Executives authorize. Execution pre-staged."
- **SimulationStudio CTA:** After running a scenario analysis and seeing survive/thrive scores, a contextual gold CTA appears: "Want these 170 playbooks armed and ready before the trigger fires? → Request Pilot Access" routed to `/request-access`. No dead ends.
- **GuestPreviewBanner:** Shows on every page for non-authenticated users with correct CTAs: guest state → `/request-access`, expired trial → `/request-access`. All copy matches current brand voice.

## Acquisition & Conversion Funnel (Fully Audited April 2026)
All prospect-facing paths have been verified end-to-end:
- **Entry:** Homepage, industry demos, role experience, simulation studio, investor pages
- **Middle:** All demo flows complete with gold "Request Pilot Access" CTAs — no dead ends
- **Exit/Conversion:** All CTAs → `/request-access` → magic link email → welcome trigger demo email fires on first login
- **Guest state:** `GuestPreviewBanner` on all authenticated pages shows appropriate CTAs
- **RoleExperience:** 13-stage simulation (CEO/CFO/CMO/CISO/COO/CRO/CDO/CLO) ends with "Request Pilot Access" → `/request-access` and "Try Another Role" → `/role-selector`
- **Industry Demos (9 total):** All end with gold pilot access CTA and transparent "Replay" / "All Demos" secondary buttons
- **SimulationStudio:** Results screen has conversion CTA
- **IncidentAnalyzer:** Authenticated platform tool, no CTA required

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend (sender: `pilot@vaughnmartin.com`)
- **Deployment:** vaughnmartin.com (Replit deployments)
