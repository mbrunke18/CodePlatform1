# VaughnMartin — Readiness OS

## Overview
VaughnMartin's Readiness OS is a coordination infrastructure for the Fortune 1000, designed to automate project creation, task assignment, document staging, and budget allocation. Its core purpose is to achieve a 12-minute response time to strategic triggers by leveraging 170 strategic Readiness Protocols within its proprietary IDEA Framework™. The platform aims to transform enterprise operating models from slow, meeting-heavy processes to pre-staged, pattern-detected execution, empowering companies to be "Fearless" by enabling rapid, approved actions with AI monitoring and executive authorization. The project's vision is to redesign how work flows in the age of AI, moving enterprises from 30-day alignment cycles to 12-minute execution through pre-staged Readiness Protocols and pattern detection.

## User Preferences
- Preferred communication style: Simple, everyday language
- **FOUNDER VISION (HIGHEST PRIORITY — LOCKED):** "We redesign how work flows in the age of AI." Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint. But every vendor bolted AI onto the old model (faster spreadsheets, smarter summaries, better notes from the same slow meetings). VaughnMartin rebuilds from first principles. Pre-staged Readiness Protocols REPLACE real-time coordination. Pattern detection REPLACES committee deliberation. 12-minute execution REPLACES 30-day alignment cycles. **We are NOT competing with Copilot or AI tools — we're competing with the 40-year-old meeting-heavy operating model itself.** This thesis must be present on the Homepage, Investor pages, Founder Story, and Presentation slides.
- **PRODUCT THESIS ARC (LOCKED):** Preparation → Readiness → Fearless. "Any organization can be ready and prepared to respond to any situation they would expect to encounter or have encountered." The canonical tagline is: **"The response is ready before the trigger fires."** The emotional endpoint of the platform is fearlessness — not speed. Speed is the evidence; readiness is the promise; fearless is the outcome. This arc must be present on the Homepage hero, Investor pages, WelcomeBrief, TwelveMinuteTestDrive debrief, and FounderStory. Every enterprise that prepares for every situation it'll face is no longer afraid of strategic triggers — it's fearless.
- **LOCKED MESSAGING — NEVER CHANGE:** The 3,600× metric is NOT a generic "speed advantage." The real-world comparison is weeks to months (30 days conservative baseline) vs. 12 minutes. In a Fortune 1000, when a strategic trigger fires, the enterprise spends weeks just to MOBILIZE — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — before execution even begins. Readiness OS compresses that entire cycle to 12 minutes. The correct label is always "3,600× Execution Head Start" — never "speed advantage," never "faster." The correct framing is "30 days compressed to 12 minutes." Comparison table entries must NEVER show "0" — use: "Automatic — continuous monitoring," "Pre-staged before the trigger fires," "Pre-staged — 170 Readiness Protocols ready," "Automated at trigger point," or "12 minutes after trigger detection." Every instance of this metric on the platform must reflect this framing. The old "340×," "360×," and "72 hours" framing is RETIRED.
- **MICROSOFT FRAMING (LOCKED):** "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Readiness OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator.
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision: AI monitors, executives authorize, execution pre-staged. The phrase "human-AI partnership" is RETIRED from all UI/UX copy — replace with "AI monitors, executives authorize" or "Executive authority preserved." No Readiness Protocol activates without executive sign-off. The preparation compresses the mobilization cycle; the decision remains human.
- **LANGUAGE ENFORCEMENT (LOCKED — Zero Tolerance):** "AI-powered," "AI-driven," "AI-generated," "AI-detected," and "GPT-4o" are RETIRED from all visible UI copy, labels, descriptions, placeholders, and button text. Replace with: "system-detected," "signal-based," "system-analyzed," "pre-staged," "system-staged," or "continuous monitoring." Technical code comments are exempt. The AI model name (GPT-4o/Azure OpenAI) may appear only in technical integration listings (IntegrationHub, architecture diagrams showing the Microsoft stack), never in end-user-facing copy.
- **FOUNDING PARTNER PROGRAM (LOCKED):** The pre-launch program is "Founding Partner Program" — never "Pilot Program," "Pilot Access," or "Now in Pilot" in user-facing copy. The program is a 90-day validation partnership. Button labels: "Apply for Founding Partner Access" or "Request Founding Partner Access." CTAs pointing to /contact or /request-access must use Founding Partner language. Internal code file names (PilotProgram.tsx, etc.) are unchanged — only visible UI text.
- **FOOTBALL TERMINOLOGY RETIRED (LOCKED):** "Offense," "Defense," and "Special Teams" as category labels are RETIRED from all user-facing copy. The three strategic domains are now: **GROWTH & POSITIONING** (was Offense), **RISK & RESILIENCE** (was Defense), **TRANSFORMATION** (was Special Teams). Internal code keys (`offense`, `defense`, `special_teams`) and database values are unchanged — only visible UI text. Exception: `FounderStoryFull.tsx` preserves the football language deliberately as part of the founder's personal origin narrative.
- Executive professional language required across UI/UX
- All text must be clearly and boldly readable — medium weight minimum, deep navy or dark gray
- Brand placement and visual memory is a priority — logo should appear on every key page
- Desktop-first layout; mobile adjustments only if non-disruptive

## System Architecture

### UI/UX Decisions
- **Theme:** Light mode with pure white backgrounds; dark mode supported.
- **Typography:** Global base font-weight 500; headings font-weight 700 in midnight navy. Cormorant Garamond for editorial, Barlow Condensed for labels.
- **Branding:** Consistent VaughnMartin and Readiness OS branding with a circular seal logo.
- **Navigation:** Three synchronized navigation systems (`HomepageNav`, `StandardNav`, `IDEASidebar`).
- **Layout:** All pages are wrapped by a `PageLayout` component.
- **Color Palette:** `NAVY="#0A0F2E"`, `NAVY_BG="#132558"`, `GOLD="#C9A84C"`, `TEAL="#2B8A6E"`, `IVORY="#F0EDE4"`. No purple.
- **Design System:** Custom CSS utilities for consistent styling (e.g., stat blocks, section labels, cards, buttons) and shared React components (`SectionLabel`, `EditorialStat`, `GoldRule`). Buttons/cards/badges use `border-radius: 0.15rem`.

### Technical Implementations
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form + Zod, Framer Motion.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server.
- **AI Services:** Azure OpenAI primarily, with fallback to OpenAI GPT-4o, employing a multi-agent IDEA Framework.
- **Authentication:** Replit OIDC with Passport.js.
- **Authorization:** Role-Based Access Control using `requireRole()` middleware.
- **Background Tasks:** PostgreSQL-backed job queue for asynchronous AI tasks.

### Feature Specifications
- **Core Platform:** Includes a Playbook Library (170 protocols), Demo Experience, Execution Intelligence Dashboard, Investor Gate, and admin views.
- **Pre-Staged Execution:** Features Execution Briefs, Live War Room, and Post-Activation Debriefs for human-authorized, pre-staged execution.
- **Automation & Simulation:** Offers Auto-Task Seeding, embeddable Workspace Pages, Guided Start Experience, and a Shadow Strategy Simulator (Digital Twin).
- **IDEA Framework:** Manages the entire Trigger → Playbook IDEA Chain, from trigger detection to playbook recommendations and execution.
- **Key Differentiators:** Readiness ROI Dashboard, Compound Threat Intelligence, Strategic Recorder, War Room Pulse Map.
- **Terminology Enforcement:** Consistent use of "12 minutes," "3,600×," "170 Readiness Protocols," and "221 triggers." "Readiness Protocol" is the canonical term for all execution artifacts.
- **12-Minute Test Drive:** A public 4-step simulation at `/12-minute-experience` for lead generation and experience demonstration.
- **Platform Architecture:** Presented as a three-tier model: Readiness OS Core (170 protocols), Industry Protocol Packs (6 verticals), and Protocol Builder (custom protocol creation).
- **Getting Started Hub (`/getting-started`):** A single-page dashboard for go-live readiness, tracking 4 setup phases (Foundation, Org Structure, Protocol Readiness, Validation) with a live completion score.
- **Protocol Builder (`/protocol-builder`):** A 6-step wizard for Founding Partners and prospects to create custom protocols based on the established anatomy.
- **Live Signal Detection:** Real-time RSS ingestion from 8 sources every 15 minutes, scored against 16 trigger patterns.
- **Risk Scoring:** Uses square-root scaling (`√signals × 8`) to classify risk as LOW (<35), MEDIUM (35–74), HIGH (75+).
- **Command Tower (`/command-tower`):** A full-screen executive display page showing live trigger detections and system statistics.
- **Competitive Positioning:** Dedicated pages (`/platform-reality`, `/ms-project`, `/vs-consulting`) highlighting unique value.
- **Access Paths:** Three distinct access routes: Request Access (`/request-access`), Trial Access (`/trial-access`), Demo Access (`/demo-access`).
- **Executive Readiness Score:** A 0–100 score derived from live signals, triggers, playbooks, and activations.
- **Sector Playbook Packs:** Organizes protocols by 6 industry sectors.
- **Regulatory Calendar:** Displays compliance deadlines with urgency and recommended actions.
- **Board-Ready Activation Report:** Generates reports for activations, including elapsed time and next steps.
- **Ownership Close-Out Gate:** Formal governance verdict post-activation, measuring ownership transfer rate and diagnosing silent tasks.
- **Recovery vs. Optimization Debrief Classification:** Debriefs are automatically classified as Optimization, Mixed-Signal, or Recovery based on ownership transfer percentage.
- **Post-Drill Debrief (`/practice-drills`):** Structured debrief dialog after practice drills, capturing insights and action items.
- **ROI Dashboard:** Displays actual costs logged across activations and outcome classifications.
- **Activation Console:** Integrates real organizational stakeholders for notifications.
- **Intelligence Control Center:** Features a live Recent Signal Detections feed.
- **AIRadarDashboard:** Displays real-time average response times against benchmarks.

## Test Suite

### Structure
- **Unit Tests (Vitest):** Run with `npx vitest run --reporter=verbose`. Covers server business logic, Zod schema validation, brand terminology enforcement, and key React components.
- **E2E Tests (Playwright):** Run with `npx playwright test --reporter=list`. Targets `http://localhost:5000`. Covers critical user flows and brand language compliance across key pages.

### Test Files
| File | What it tests |
|---|---|
| `server/__tests__/business-logic.test.ts` | Task value calculation (priority multipliers, strategic keywords) |
| `server/__tests__/platform-scoring.test.ts` | Risk scoring (√signals × 8), velocity, foresight, agility scores |
| `server/__tests__/deal-risk.test.ts` | Deal risk score and trigger detection (MockSalesforceService logic) |
| `server/routes.test.ts` | Zod validation schemas for organization, scenario, and task API inputs |
| `client/src/__tests__/brand-terminology.test.ts` | Retired-term detection, approved replacements, metric correctness |
| `client/src/components/__tests__/BrandStamp.test.tsx` | BrandStamp variants, sizes, alignment |
| `client/src/components/__tests__/SubBrandLabel.test.tsx` | SubBrandLabel rendering, `isSubBrand()` function, SUB_BRAND_NAMES constant |
| `client/src/components/ui/__tests__/badge.test.tsx` | Badge shadcn component variants |
| `client/src/components/ui/__tests__/card.test.tsx` | Card/CardHeader/CardTitle/CardContent/CardFooter components |
| `e2e/comprehensive-platform-tests.spec.ts` | Full platform page coverage — data-testid assertions |
| `e2e/demo-flows.spec.ts` | Core demo and CTA flows with current VaughnMartin branding |
| `e2e/brand-compliance.spec.ts` | Zero-tolerance language rules across 8 key public pages |

### Validation Commands (registered)
- `unit-tests` → `npx vitest run --reporter=verbose`
- `typecheck` → `npx tsc --noEmit`
- `e2e-tests` → `npx playwright test --reporter=list`

### Vitest Configuration
`vitest.config.ts` excludes `e2e/**`, `archive/**`, `executeiq-complete/**`, and `bastion-complete/**` to prevent false picks from backup directories.

## External Dependencies
- **AI:** OpenAI GPT-4o, Azure OpenAI
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend
- **Deployment:** Replit deployments
- **Microsoft Ecosystem:** Microsoft Teams, Copilot Studio, Microsoft Entra