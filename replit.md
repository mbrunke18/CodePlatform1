# VaughnMartin — Readiness OS

## Overview
VaughnMartin's Readiness OS is a coordination infrastructure for high-growth startups, mid-market companies, and global enterprises — from startup to Fortune 500 — designed to automate project creation, task assignment, document staging, and budget allocation. Its core purpose is to achieve a 12-minute response time to strategic triggers by leveraging 180 strategic Readiness Protocols within its proprietary IDEA Framework™. The platform aims to transform enterprise operating models from slow, meeting-heavy processes to pre-staged, pattern-detected execution, empowering companies to be "Fearless" by enabling rapid, approved actions with AI monitoring and executive authorization. The project's vision is to redesign how work flows in the age of AI, moving enterprises from 30-day alignment cycles to 12-minute execution through pre-staged Readiness Protocols and pattern detection.

## User Preferences
- Preferred communication style: Simple, everyday language
- **FOUNDER VISION (HIGHEST PRIORITY — LOCKED):** "We redesign how work flows in the age of AI." Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint. But every vendor bolted AI onto the old model (faster spreadsheets, smarter summaries, better notes from the same slow meetings). VaughnMartin rebuilds from first principles. Pre-staged Readiness Protocols REPLACE real-time coordination. Pattern detection REPLACES committee deliberation. 12-minute execution REPLACES 30-day alignment cycles. **We are NOT competing with Copilot or AI tools — we're competing with the 40-year-old meeting-heavy operating model itself.** This thesis must be present on the Homepage, Investor pages, Founder Story, and Presentation slides.
- **PRODUCT THESIS ARC (LOCKED):** Preparation → Readiness → Fearless. "Any organization can be ready and prepared to respond to any situation they would expect to encounter or have encountered." The canonical tagline is: **"The response is ready before the trigger fires."** The emotional endpoint of the platform is fearlessness — not speed. Speed is the evidence; readiness is the promise; fearless is the outcome. This arc must be present on the Homepage hero, Investor pages, WelcomeBrief, TwelveMinuteTestDrive debrief, and FounderStory. Every enterprise that prepares for every situation it'll face is no longer afraid of strategic triggers — it's fearless.
- **LOCKED MESSAGING — NEVER CHANGE:** The 3,600× metric is NOT a generic "speed advantage." The real-world comparison is weeks to months (30 days conservative baseline) vs. 12 minutes. In any organization — startup to Fortune 500 — when a strategic trigger fires, the enterprise spends weeks just to MOBILIZE — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — before execution even begins. Readiness OS compresses that entire cycle to 12 minutes. The correct label is always "3,600× Execution Head Start" — never "speed advantage," never "faster." The correct framing is "30 days compressed to 12 minutes." Comparison table entries must NEVER show "0" — use: "Automatic — continuous monitoring," "Pre-staged before the trigger fires," "Pre-staged — 180 Readiness Protocols ready," "Automated at trigger point," or "12 minutes after trigger detection." Every instance of this metric on the platform must reflect this framing. The old "340×," "360×," and "72 hours" framing is RETIRED.
- **MICROSOFT FRAMING (LOCKED):** "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Readiness OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator.
- Valued prioritization approach with phase-by-phase implementation
- **NO TASK LISTS** — no open task lists, ever. Every request handled as a focused, surgical change only.
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
- **Authorization:** Role-Based Access Control using `requireRole()` middleware. Fail-closed on errors. Org membership validated on all mutable routes.
- **Background Tasks:** PostgreSQL-backed job queue for asynchronous AI tasks.
- **Access Control:** Email allowlist (`allowed_emails` table) gates logins. Open when list is empty; restrictive once any email is added. Platform admin email bypasses list. `/access-denied` shown to unauthorized users.
- **Admin Panel:** `/admin/users` — platform admin only. View/delete users, manage allowlist. Protected by `requirePlatformAdmin` middleware keyed on `PLATFORM_ADMIN_EMAIL` env secret.

### Feature Specifications
- **Core Platform:** Includes a Playbook Library (180 core protocols + 30 compound protocols, IDs 181–210), Demo Experience, Execution Intelligence Dashboard, Investor Gate, and admin views.
- **Pre-Staged Execution:** Features Execution Briefs, Live War Room, and Post-Activation Debriefs for human-authorized, pre-staged execution.
- **Automation & Simulation:** Offers Auto-Task Seeding, embeddable Workspace Pages, Guided Start Experience, and a Shadow Strategy Simulator (Digital Twin).
- **IDEA Framework:** Manages the entire Trigger → Playbook IDEA Chain, from trigger detection to playbook recommendations and execution.
- **Key Differentiators:** Readiness ROI Dashboard, Compound Threat Intelligence, Strategic Recorder, War Room Pulse Map.
- **ADVANCE 2.0 — Closed-Loop Causal Learning (`/advance-intelligence`):** Every activation close-out generates preparation updates. `AdvanceLoopService` closes the loop: `applyUpdateWithDelta()` mutates the protocol record, stores an immutable version delta, and creates a causal hypothesis ("expected −4 min"). After the next activation, `measureHypothesesForActivation()` compares expected vs actual and classifies as proven/disproven. The `Learning Velocity Index` dashboard shows: updates applied, proven improvements, total minutes saved, % of 180-protocol library with evidence-backed changes, top 10 updates by proven impact, 6-month velocity trend, and the moat metric (months to rebuild on any competitor). Schema: `protocol_version_deltas` + `update_hypotheses` tables. Auto-apply queue (low-risk signal calibrations) + executive authorization queue (ownership/protocol changes). Measurement triggers automatically on every close-out completion.
- **Sales Assets:** Executive Brief (`/executive-brief`) — full printable 1-pager with comparison table, proof numbers, ROI case, and Founding Partner CTA. Security & Compliance (`/security-compliance`) — procurement-ready one-pager covering auth, data governance, compliance readiness, and AI safety controls across 6 sections.
- **Terminology Enforcement:** Consistent use of "12 minutes," "3,600×," "180 Readiness Protocols," and "221 triggers." "Readiness Protocol" is the canonical term for all execution artifacts.
- **Demo Experience Center (`/demo-hub`):** 12 full scenario simulations across all 3 strategic domains. GROWTH & POSITIONING: Competitor Displacement Sprint (`/demo/market-entry` — Protocol #31, LegacyPoint Ch.11, 72-hour window) and M&A Rapid Response (`/demo/acquisition` — Protocol #58, LOI in 48 hours). RISK & RESILIENCE: Ransomware, FDA Recall, Supply Chain, Energy Grid, Food Safety, Data Breach, DOJ Investigation. TRANSFORMATION: Go-to-Market Acceleration Sprint (`/demo/product-launch` — Protocol #89) and Workforce Transformation Protocol (`/demo/workforce` — Protocol #112, 6,720 roles, 12 countries). Master Demo at `/master-demo` (Activist Investor, 7-phase complete walkthrough). Domain nav pills with anchor links. All 12 scenarios route through the single `MasterDemo` component via `/demo/:scenarioId`.
- **12-Minute Test Drive:** A public 4-step simulation at `/12-minute-experience` for lead generation and experience demonstration. 7 scenarios: 6 single-domain + 1 compound (Activist + Regulatory, full 10-task dual-track war room). Compound card spans full grid width with teal left-border and "2 Protocols · Simultaneous" badge.
- **How It Executes (`/how-it-executes`):** Animated signal → protocol → tasks staged → stakeholders notified → executive authorizes → 12 minutes complete chain visualization. 5 scenario selectors (4 single-domain + 1 compound), auto-plays on load, Old Model comparison panel, "Before/At/After the Trigger" preparation breakdown section. Compound scenario uses TEAL active state and shows "2 Readiness Protocols activated simultaneously" in chain steps.
- **Proof Story (`/proof-story`):** Three full activation narratives (Ransomware, Activist Investor, Supply Chain Collapse) with side-by-side timelines (with vs. without Readiness OS), head-to-head comparison tables, and specific financial outcomes. Toggle between "Side by Side," "With Readiness OS," and "Without" views.
- **ROI Calculator (`/roi-calculator`):** Enhanced with platform cost slider ($60K–$240K, default $120K), break-even calculation, 3-year net value, first-year ROI %, and consulting retainer comparison panel in the sticky results sidebar.
- **Platform Architecture:** Two-tier model: Readiness OS Core (180 cross-industry protocols) + 6 Industry Protocol Packs.
- **Getting Started Hub (`/getting-started`):** A single-page dashboard for go-live readiness, tracking 4 setup phases with a live completion score.
- **Protocol Builder (`/protocol-builder`):** A 6-step wizard for Founding Partners and prospects to create custom protocols.
- **Live Signal Detection:** Real-time RSS ingestion from 8 sources every 15 minutes, scored against 16 trigger patterns.
- **Risk Scoring:** Uses square-root scaling (`√signals × 8`) to classify risk as LOW (<35), MEDIUM (35–74), HIGH (75+).
- **Command Tower (`/command-tower`):** A full-screen executive display page showing live trigger detections and system statistics.
- **Competitive Positioning:** Dedicated pages (`/platform-reality`, `/ms-project`, `/vs-consulting`) highlighting unique value.
- **Access Paths:** Three distinct access routes: Request Access (`/request-access`), Trial Access (`/trial-access`), Demo Access (`/demo-access`).
- **Executive Readiness Score:** A 0–100 score derived from live signals, triggers, playbooks, and activations.
- **Sector Playbook Packs:** Organizes protocols by 6 industry sectors.
- **Regulatory Calendar:** Displays compliance deadlines with urgency and recommended actions.
- **Board-Ready Activation Report:** Generates reports for activations, including elapsed time and next steps.
- **Ownership Close-Out Gate:** Formal governance verdict post-activation.
- **Recovery vs. Optimization Debrief Classification:** Debriefs are automatically classified as Optimization, Mixed-Signal, or Recovery.
- **Post-Drill Debrief (`/practice-drills`):** Structured debrief dialog after practice drills.
- **ROI Dashboard:** Displays actual costs logged across activations and outcome classifications.
- **Activation Console:** Integrates real organizational stakeholders for notifications.
- **Intelligence Control Center:** Features a live Recent Signal Detections feed.
- **AIRadarDashboard:** Displays real-time average response times against benchmarks.

## External Dependencies
- **AI:** OpenAI GPT-4o, Azure OpenAI
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend
- **Deployment:** Replit deployments
- **Microsoft Ecosystem:** Microsoft Teams, Copilot Studio, Microsoft Entra

---

## Critical Asset Reference (READ BEFORE ANY VISUAL WORK)

This section exists to prevent recurring errors. Read it before touching branding, logos, presentations, or screenshots.

### THE LOGO — Authoritative Definition
The VaughnMartin / Readiness OS logo is a **custom SVG React component**. It is NOT any PNG file in `client/src/assets/`.

**Source of truth:** `client/src/components/ExecuteIQLogo.tsx` → exported as `VaughnMartinLogo`
**Wrapper:** `client/src/components/VaughnMartinLogo.tsx`

**Visual anatomy (do not deviate):**
1. **TechSeal** — circular badge, navy radial gradient fill (`#0A0F2E` → `#1a2860`), gold outer ring (`#C9A84C`, 1px), tick marks around the perimeter, small cardinal diamonds at N/S/E/W, "VM" monogram centered in **Georgia serif bold gold**, "VAUGHNMARTIN · READINESS OS" arced along the top in gold Courier monospace, "ANTE IGNEM PARATUS" arced along the bottom in teal Courier monospace, teal signal pulse dot at 6 o'clock.
2. **Wordmark** — "VaughnMartin" in **Cormorant Garamond** (font-weight 600), followed by a short gold rule + "READINESS OS" in **Barlow Condensed** (font-weight 700, letter-spacing 0.34em, uppercase), both positioned to the right of the seal.

**NEVER use these for the logo:**
- `client/src/assets/poise-logo-official.png` — legacy/wrong asset, do not use
- `client/src/assets/poise-logo.png` — legacy/wrong asset, do not use
- Any PNG from `attached_assets/` unless the user explicitly provides it as the current logo

**For external files (PPTX, PDF, etc.) where SVG components cannot be used:**
- Screenshot the logo directly from the running app (e.g., `/executive-brief` page body shows a large clear instance)
- Crop with PIL and use the resulting PNG — OR — draw the logo manually using the anatomy above

### Brand Colors (exact hex — do not guess)
- `NAVY = #0A0F2E` (primary background, headings)
- `GOLD = #C9A84C` (accent, rules, key labels)
- `TEAL = #2B8A6E` (secondary accent)
- `IVORY = #F0EDE4` (light panel backgrounds)
- No purple anywhere on the platform

### Screenshot Assets Available
Located in `screenshots/` — use these for decks, not placeholder boxes:
- `slide_mission_control.jpg` — Command Tower / live signal feed
- `slide_protocol_library.jpg` — Playbook/Protocol Library
- `slide_onboarding.jpg` — Getting Started / Onboarding
- `slide_buyer_packet.jpg` — Executive Brief / Buyer Packet
- `slide_execution.jpg` — Execution / War Room view
- `deck_signals.jpg` — Signal Detection feed
- `deck_activation.jpg` — Activation Console