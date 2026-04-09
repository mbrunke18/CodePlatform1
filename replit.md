# VaughnMartin — Readiness OS

## Overview
VaughnMartin's Readiness OS is coordination infrastructure for the Fortune 1000. Its primary goal is to automate project creation, task assignment, document staging, and budget allocation to achieve a 12-minute response time to strategic triggers. The platform incorporates 170 strategic readiness playbooks across 9 domains within its proprietary IDEA Framework™. It operates on a model where AI monitors, executives authorize, and execution is pre-staged, enabling rapid and approved actions. The vision is to become "The Readiness Infrastructure Enterprises Are Missing," empowering enterprises to be "Fearless."

**Canonical product descriptor:** "VaughnMartin builds Readiness OS — coordination infrastructure for the Fortune 1000."

## User Preferences
- Preferred communication style: Simple, everyday language
- **FOUNDER VISION (HIGHEST PRIORITY — LOCKED):** "We redesign how work flows in the age of AI." Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint. But every vendor bolted AI onto the old model (faster spreadsheets, smarter summaries, better notes from the same slow meetings). VaughnMartin rebuilds from first principles. Pre-staged playbooks REPLACE real-time coordination. Pattern detection REPLACES committee deliberation. 12-minute execution REPLACES 30-day alignment cycles. **We are NOT competing with Copilot or AI tools — we're competing with the 40-year-old meeting-heavy operating model itself.** This thesis must be present on the Homepage, Investor pages, Founder Story, and Presentation slides.
- **PRODUCT THESIS ARC (LOCKED):** Preparation → Readiness → Fearless. "Any organization can be ready and prepared to respond to any situation they would expect to encounter or have encountered." The canonical tagline is: **"The response is ready before the trigger fires."** The emotional endpoint of the platform is fearlessness — not speed. Speed is the evidence; readiness is the promise; fearless is the outcome. This arc must be present on the Homepage hero, Investor pages, WelcomeBrief, TwelveMinuteTestDrive debrief, and FounderStory. Every enterprise that prepares for every situation it'll face is no longer afraid of strategic triggers — it's fearless.
- **LOCKED MESSAGING — NEVER CHANGE:** The 3,600× metric is NOT a generic "speed advantage." The real-world comparison is weeks to months (30 days conservative baseline) vs. 12 minutes. In a Fortune 1000, when a strategic trigger fires, the enterprise spends weeks just to MOBILIZE — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — before execution even begins. Readiness OS compresses that entire cycle to 12 minutes. The correct label is always "3,600× Execution Head Start" — never "speed advantage," never "faster." The correct framing is "30 days compressed to 12 minutes." Comparison table entries must NEVER show "0" — use: "Automatic — continuous monitoring," "Pre-staged before the trigger fires," "Pre-staged — 170 playbooks ready," "Automated at trigger point," or "12 minutes after trigger detection." Every instance of this metric on the platform must reflect this framing. The old "340×," "360×," and "72 hours" framing is RETIRED.
- **MICROSOFT FRAMING (LOCKED):** "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Readiness OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator.
- **HBR INTEGRATION (Feb 2026):** Harvard Business Review research shows AI intensifies work without an operating model (+47% task scope, +32% multitasking, blurred roles). HBR cards use red accent (#dc2626). Deployed across 8 touchpoints: Homepage, Validation.tsx, SizzleReel (retired), Research.tsx, and 3 investor pages.
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision: AI monitors, executives authorize, execution pre-staged. The phrase "human-AI partnership" is RETIRED from all UI/UX copy — replace with "AI monitors, executives authorize" or "Executive authority preserved." No playbook activates without executive sign-off. The preparation compresses the mobilization cycle; the decision remains human.
- Executive professional language required across UI/UX
- All text must be clearly and boldly readable — medium weight minimum, deep navy or dark gray
- Brand placement and visual memory is a priority — logo should appear on every key page
- Desktop-first layout; mobile adjustments only if non-disruptive
- Homepage dark sections use `NAVY_BG="#132558"` (not `NAVY="#0A0F2E"`) for large `<section>` backgrounds — lighter so it reads as genuine navy blue rather than near-black. All other files use `NAVY` only. Dark sections layer a gold grid (`rgba(201,168,76,0.09)`, 1px, 48px) and large radial gradient orbs (teal + gold, 600–1000px, opacity 0.11–0.22) for visual depth.

## Retired Terms — NEVER USE in UI
The following terms have been permanently retired from all customer-facing copy:
- `"72 hours"` as a mobilization baseline (legitimate uses only: regulatory windows, incident timelines, "before Readiness OS" comparison columns)
- `"340×"` or `"340x"` — retired speed metric
- `"360×"` or `"360x"` or `"360X"` — retired speed metric (internal-only prop `version="360x-faster"` on ThirtySecondSpot is acceptable as a code identifier, not display text)
- `"Agentic Execution"` — replaced with "AI-Coordinated Execution"
- `"Agentic Execution Layer"` — fully retired
- `"Execution Operating System"` — product is "Readiness OS"
- `"Strategic Execution Operating System"` — retired category name
- `"Execution Infrastructure"` as a standalone descriptor — replaced with "coordination infrastructure"
- `"Human-AI partnership"` — replaced with "AI monitors, executives authorize"
- `"Prepared to Execute."` as a tagline — replaced with "The response is ready before the trigger fires."

## Canonical Metrics (use these exact values everywhere)
- Response time: **12 minutes**
- Execution head start: **3,600× Execution Head Start**
- Baseline comparison: **30 days compressed to 12 minutes**
- Playbooks: **170**
- Domains: **9**
- Triggers: **221**
- Data points: **248+**
- Fortune 1000 strategic spend: **$847B**
- Strategic initiative failure rate: **83%**

## Brand Colors
- `NAVY="#0A0F2E"` — primary dark (all files except Homepage sections)
- `NAVY_BG="#132558"` — Homepage large section backgrounds only
- `GOLD="#C9A84C"`
- `TEAL="#2B8A6E"`
- `IVORY="#F0EDE4"`

## System Architecture

**UI/UX Decisions:**
- **Theme:** Light mode with pure white backgrounds; dark mode supported.
- **Typography:** Global base font-weight 500; headings are font-weight 700 in midnight navy.
- **Branding:** Consistent VaughnMartin and Readiness OS branding with a circular seal logo.
- **Navigation:** Three synchronized navigation systems (`HomepageNav`, `StandardNav`, `IDEASidebar`). StandardNav Experience dropdown is hardcoded in `renderExperienceDropdown()` — edit `deeperDemos`/`primaryDemos` arrays to change it.
- **Layout:** All pages are wrapped by a `PageLayout` component.
- **Homepage:** Focuses on 12-minute execution, IDEA Framework, and research-backed validation with a specific section order.

**Critical Import Rules:**
- `ExecutionStageGuide` is a NAMED export — always `import { ExecutionStageGuide } from '@/components/ExecutionStageGuide'`

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form + Zod, Framer Motion.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server.
- **AI Services:** Primarily Azure OpenAI, with fallback to OpenAI GPT-4o, utilizing a multi-agent IDEA Framework.
- **Authentication:** Replit OIDC with Passport.js.
- **Role-Based Access:** `requireRole()` middleware.
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.

**Feature Specifications:**
- **Core Platform:** Playbook Library (170 playbooks), Demo Experience, Execution Intelligence Dashboard, Investor Gate, admin views.
- **AI-Powered Execution:** AI Execution Briefs, Live War Room, Post-Activation Debriefs.
- **Automation & Simulation:** Auto-Task Seeding, embeddable Workspace Pages, Guided Start Experience, Shadow Strategy Simulator (Digital Twin).
- **IDEA Framework:** Full Trigger → Playbook IDEA Chain for trigger detection and playbook recommendations.
- **Task Management:** Task Acknowledgment & Audit Trail.
- **Reporting & Analytics:** Execution History Dashboard with KPIs and activation logs.
- **Flagship Playbooks:** 23 enriched playbooks with expert content and decision gates.
- **Configuration Wizards:** Trigger Configuration Wizard for setting up situations and playbook mapping.
- **Key Differentiators:** Readiness ROI Dashboard, Compound Threat Intelligence, Strategic Recorder, War Room Pulse Map.
- **Data Consistency:** Strict adherence to consistent values for response time (12 minutes), execution head start (3,600×), number of playbooks (170), and triggers (221).
- **Personalized ROI Calculator:** Interactive calculator on `/roi-calculator`.
- **12-Minute Test Drive:** A public 4-step sequential experience simulating execution at `/12-minute-experience`. Primary destination for prospects — replaces the retired SizzleReel as the "send before a call" asset.
- **Playbook Public Access Model:** 3 playbooks are fully public, others require authentication.
- **McKinsey Research Citations:** Integrated `McKinseyResearchSection` on investor pages.
- **Live Signal Detection:** Real RSS ingestion from 8 sources every 15 minutes, with `SignalEvaluationService` scoring against 16 trigger patterns.
- **Command Tower:** Full-screen executive display page (`/command-tower`) with live trigger detections and system stats.
- **Dual Evaluation Engine:** `SignalEvaluationService` runs configured and default engines in parallel.
- **Magic Link Authentication:** `/request-access` form for branded magic link login.
- **Execution Clock:** `execution_timelines` DB table tracks 12-minute clock milestones.
- **Execution Dividend:** Real-time ROI counter on Mission Control.
- **Board Readiness Snapshot:** Print-ready executive report at `/board-readiness`.
- **Day One Welcome Brief:** Full-screen first-login experience at `/welcome-brief`.
- **Live Signal Activity Feed:** `signal_activity_log` DB table buffers scan events; `LiveSignalFeed` component shows real-time evaluation.
- **PlaybookDetail Task Editor:** Authenticated users can edit tasks on playbook detail pages.
- **Executive Scenario Suite:** Authenticated deep walk-through at `/executive-scenarios` with industry and role selectors.
- **Platform Capabilities Page:** `/capabilities` details the full decision lifecycle for product users and investors.
- **ExecutionStageGuide:** Shared component defining all 6 execution lifecycle stages, deployed across the platform.
- **Brand Films Page (`/video`, `/brand-films`, `/cinematic`):** Two-tab layout — 90-Second CinematicHero and 30-Second ThirtySecondSpot (3 versions). Routes `/sizzle` and `/2-minute` redirect to `/12-minute-experience`.
- **ThirtySecondSpot:** Three versions — `offense-defense`, `first-mover`, `360x-faster` (internal prop identifier only; display label is "3,600× Execution Head Start").
- Playbooks are consistently referred to as "Readiness Playbooks" across the UI.

**Retired Components:**
- `SizzleReel.tsx` — permanently deleted. Was a 2-minute animated brand film. Superseded by the 12-Minute Test Drive (interactive) and ThirtySecondSpot (quick pitch). File removed from codebase April 2026.

**MS Project EOL Positioning Page (`/ms-project`, `/ms-project-transition`, `/vs-servicenow`, `/migration`):**
- Full comparison page: ServiceNow SPM vs. Readiness OS — targeting Fortune 1000 COOs/CIOs at the Microsoft Project EOL decision point
- Core positioning: "Don't migrate your lag to a new database." ServiceNow = IT cost center migration; Readiness OS = CEO/Board evolution
- Key lines: "Visibility is not velocity." / "The engine is Microsoft. The transmission is Readiness OS." / "While others move their static plans to ServiceNow, Readiness OS users are already executing."
- Homepage callout section (`MsProjectCalloutSection`) deployed between MicrosoftEcosystemBanner and CredibilitySection
- Page linked from StandardNav whyLinks array as featured entry

**Pages not in footer (keep files, just not linked):**
- `/execution-coordination`, `/enterprise-metrics`, `/ai-radar`, `/intelligence-hub`, `/decision-velocity`

## External Dependencies
- **AI:** OpenAI GPT-4o, Azure OpenAI
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend
- **Deployment:** Replit deployments
- **Microsoft Ecosystem:** Microsoft Teams, Copilot Studio, Microsoft Entra
