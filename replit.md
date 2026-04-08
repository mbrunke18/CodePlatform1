# VaughnMartin — Readiness OS

## Overview
VaughnMartin's Readiness OS is the command infrastructure platform for Fortune 1000 companies. Its core purpose is to automate project creation, task assignment, document staging, and budget allocation to achieve a 12-minute response time to strategic triggers. The platform integrates 170 strategic playbooks across 9 domains within its proprietary IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE). AI monitors, executives authorize, and execution is pre-staged, ensuring rapid, approved action. The vision is to be "The Readiness Infrastructure Enterprises Are Missing," making enterprises "Fearless."

## User Preferences
- Preferred communication style: Simple, everyday language
- **FOUNDER VISION (HIGHEST PRIORITY — LOCKED):** "We redesign how work flows in the age of AI." Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint. But every vendor bolted AI onto the old model (faster spreadsheets, smarter summaries, better notes from the same slow meetings). VaughnMartin rebuilds from first principles. Pre-staged playbooks REPLACE real-time coordination. Pattern detection REPLACES committee deliberation. 12-minute execution REPLACES 30-day alignment cycles. **We are NOT competing with Copilot or AI tools — we're competing with the 40-year-old meeting-heavy operating model itself.** This thesis must be present on the Homepage, Investor pages, Founder Story, and Presentation slides.
- **LOCKED MESSAGING — NEVER CHANGE:** The 3,600× metric is NOT a generic "speed advantage." The real-world comparison is weeks to months (30 days conservative baseline) vs. 12 minutes. In a Fortune 1000, when a strategic trigger fires, the enterprise spends weeks just to MOBILIZE — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — before execution even begins. Readiness OS compresses that entire cycle to 12 minutes. The correct label is always "3,600× Execution Head Start" — never "speed advantage," never "faster." The correct framing is "30 days compressed to 12 minutes." Comparison table entries must NEVER show "0" — use: "Automatic — continuous monitoring," "Pre-staged before the trigger fires," "Pre-staged — 170 playbooks ready," "Automated at trigger point," or "12 minutes after trigger detection." Every instance of this metric on the platform must reflect this framing. The old "340×" and "72 hours" framing is RETIRED.
- **MICROSOFT FRAMING (LOCKED):** "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Readiness OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator.
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision: AI monitors, executives authorize, execution pre-staged. The phrase "human-AI partnership" is RETIRED from all UI/UX copy — replace with "AI monitors, executives authorize" or "Executive authority preserved." No playbook activates without executive sign-off. The preparation compresses the mobilization cycle; the decision remains human.
- Executive professional language required across UI/UX
- All text must be clearly and boldly readable — medium weight minimum, deep navy or dark gray
- Brand placement and visual memory is a priority — logo should appear on every key page
- Desktop-first layout; mobile adjustments only if non-disruptive
- Homepage dark sections use `NAVY_BG="#132558"` (not `NAVY="#0A0F2E"`) for large `<section>` backgrounds — lighter so it reads as genuine navy blue rather than near-black. All other files use `NAVY` only. Dark sections layer a gold grid (`rgba(201,168,76,0.09)`, 1px, 48px) and large radial gradient orbs (teal + gold, 600–1000px, opacity 0.11–0.22) for visual depth.

## System Architecture

**UI/UX Decisions:**
- **Theme:** Light mode with pure white backgrounds; dark mode supported.
- **Typography:** Global base font-weight 500; headings are font-weight 700 in midnight navy.
- **Branding:** Consistent VaughnMartin and Readiness OS branding with a circular seal logo. Logos use a gold gradient ring. Component: `VaughnMartinLogo`.
- **Navigation:** Three synchronized navigation systems: `HomepageNav`, `StandardNav`, and `IDEASidebar`.
- **Layout:** All pages are wrapped by a `PageLayout` component.
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
- **Email:** Resend API with sender `pilot@vaughnmartin.com`.

**Feature Specifications:**
- **Core Platform:** Playbook Library (170 playbooks), Demo Experience, Execution Intelligence Dashboard, Investor Gate, admin views.
- **AI-Powered Execution:** AI Execution Briefs, Live War Room, Post-Activation Debriefs.
- **Automation & Simulation:** Auto-Task Seeding, embeddable Workspace Pages, Guided Start Experience, Shadow Strategy Simulator (Digital Twin).
- **IDEA Framework:** Full Trigger → Playbook IDEA Chain for detecting triggers and recommending playbooks.
- **Task Management:** Task Acknowledgment & Audit Trail with action buttons.
- **Reporting & Analytics:** Execution History Dashboard with KPIs and activation logs.
- **Flagship Playbooks:** 23 enriched playbooks with expert content and decision gates.
- **Configuration Wizards:** Trigger Configuration Wizard for setting up situations and playbook mapping.
- **Key Differentiators:** Execution ROI Dashboard, Compound Threat Intelligence, Strategic Recorder, War Room Pulse Map.
- **Data Consistency:** Strict adherence to consistent values for response time (12 minutes), execution head start (3,600×), number of playbooks (170), signals, data points (248+), and triggers (221).
- **Personalized ROI Calculator:** Interactive calculator on `/roi-calculator` (`ROICalculator.tsx`) with revenue brackets, exec population, scenario frequency, and live output (annual value, exec time saved, revenue protected, 3,600× head start). `ExecutionROISection` component with `RC_` prefixed constants. McKinsey $250M Decision Tax strip included.
- **12-Minute Test Drive:** A public 4-step sequential experience simulating execution.
- **Playbook Public Access Model:** 3 playbooks are fully public. All 167 others require authentication.
- **McKinsey Research Citations:** Full `McKinseyResearchSection` added to `InvestorResources.tsx` (before CTA). Covers McKinsey Enterprise Architecture Synthesis 2025–2026, MGI November 2025, and WEF × Accenture March 2026. Uses `IR_` prefixed local constants. Headline: "McKinsey Named the Gap. We Built the Infrastructure."
- **Live Signal Detection:** Real RSS ingestion from 8 sources every 15 minutes. `SignalEvaluationService` scores signals against 16 trigger patterns.
- **Command Tower:** Full-screen executive display page (`/command-tower`) with live trigger detections, system pulse stats, execution log, and real-time updates.
- **Dual Evaluation Engine:** `SignalEvaluationService` runs configured + default engines in parallel, tracking source.
- **Magic Link Authentication:** `/request-access` form for branded magic link login, with a guaranteed "AI Competitive Disruption" trigger alert email on first token activation.
- **Growth Segment:** Permanent product track targeting SMBs and PE-backed startups with three tiers.
- **Unsubscribe System:** Public `GET /api/unsubscribe` endpoint with branded confirmation page.
- **Execution Clock:** `execution_timelines` DB table tracks 12-minute clock milestones per trigger event.
- **Execution Dividend:** Real-time ROI counter (`ExecutionDividend` component) on Mission Control.
- **Board Readiness Snapshot:** Print-ready executive report at `/board-readiness` with readiness score and recent detections.
- **Day One Welcome Brief:** Full-screen first-login experience at `/welcome-brief`.
- **Live Signal Activity Feed:** `signal_activity_log` DB table buffers scan events; `LiveSignalFeed` component shows real-time evaluation work.
- **New APIs:** `GET /api/org/execution-timelines`, `PATCH /api/org/execution-timelines/:id/advance`, `GET /api/org/execution-dividend`, `GET /api/org/board-readiness`, `GET /api/org/welcome-brief`, `GET /api/signal-activity-log`.
- **PlaybookDetail Task Editor:** Authenticated users have an "Edit Tasks" tab on playbook detail pages for customizing phases, tasks, and decision gates.
- **Coaching / NFL Analogy Section:** 4-card analogy section on the IDEA Framework page (`IDEAFramework.tsx`) before the Governing Principle section. Removed from Homepage in the Homepage restructure.
- **Executive Scenario Suite:** Authenticated deep walk-through at `/executive-scenarios`. Industry + role selector (4 scenarios: Technology/CISO, Financial Services/CFO, Manufacturing/COO, Healthcare/General Counsel). Full 5-stage walk-through per scenario: Trigger → Detection → Playbook → Execution Cascade → Outcome. Uses real playbook names, IDEA chain, authentic stakeholder data, before/after comparison tables, and ROI strip. Gated — redirects to `/request-access` if not authenticated. Listed in EXECUTE phase of sidebar navigation.
- **SimulationStudio CTA:** Contextual gold CTA appears after scenario analysis, directing to `/request-access`.
- **GuestPreviewBanner:** Shows on every page for non-authenticated users with appropriate CTAs.
- **Platform Capabilities Page:** `/capabilities` (`PlatformCapabilities.tsx`) — full decision lifecycle page serving both product users and investors. Four phases: IDENTIFY (Decision Preparation), DETECT→EXECUTE (Decision Confidence), EXECUTE (Decision Coordination), ADVANCE (Decision Learning), each with a thesis statement and capability cards. Plus a Platform Breadth grid (6 supporting capabilities). Surfaced in: Experience dropdown → deeper demos, Investors dropdown → Investor Materials column, mobile investorsLinks, and EXECUTE phase of sidebar. CTA row at bottom → Mission Control, Executive Scenarios, Investor Resources.
- **ExecutionStageGuide:** Shared component (`client/src/components/ExecutionStageGuide.tsx`) defining all 6 execution lifecycle stages: Triggered → Staged → Notified → Acknowledged (12-min clock ends here) → In Progress → Complete. Three variants: `section` (full homepage section, ivory bg), `banner` (dark navy strip for dark-background pages), `compact` (light ivory grid for light-background pages). Deployed across the entire platform — homepage, all 17 demo pages, and all 13 authenticated product pages where execution stages appear. This is a core product feature, not a demo artifact.

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend
- **Deployment:** Replit deployments (vaughnmartin.com)