# VaughnMartin — Readiness OS

## Overview
VaughnMartin's Readiness OS is coordination infrastructure for high-growth startups, mid-market companies, and global enterprises — from startup to Fortune 500 — automating project creation, task assignment, document staging, and budget allocation. Its core purpose: a 12-minute response time to strategic triggers via 180 strategic Readiness Protocols within its proprietary IDEA Framework™. The platform transforms enterprise operating models from slow, meeting-heavy processes into pre-staged, pattern-detected execution — empowering companies to be "Fearless" through rapid, approved actions with AI monitoring and executive authorization. Vision: redesign how work flows in the age of AI, moving enterprises from 30-day alignment cycles to 12-minute execution through pre-staged Readiness Protocols and pattern detection.

## User Preferences

### Locked Product Messaging (NEVER CHANGE)
- **FOUNDER VISION (HIGHEST PRIORITY):** "We redesign how work flows in the age of AI." Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint, but every vendor bolted AI onto the old model (faster spreadsheets, smarter summaries, better notes from the same slow meetings). VaughnMartin rebuilds from first principles: pre-staged Readiness Protocols REPLACE real-time coordination, pattern detection REPLACES committee deliberation, 12-minute execution REPLACES 30-day alignment cycles. **We are NOT competing with Copilot or AI tools — we're competing with the 40-year-old meeting-heavy operating model itself.** Must appear on the Homepage, Investor pages, Founder Story, and Presentation slides.
- **PRODUCT THESIS ARC:** Preparation → Readiness → Fearless. "Any organization can be ready and prepared to respond to any situation they would expect to encounter or have encountered." Canonical tagline: **"When the situation arrives — The Response Is Ready Before the Trigger Fires."** (three-line display: italic "When the Situation Arrives —" in white/muted, then "The Response Is Ready" in white, then "Before the Trigger Fires." in gold). The emotional endpoint is fearlessness, not speed — speed is the evidence, readiness is the promise, fearless is the outcome. Must appear on the Homepage hero, Investor pages, WelcomeBrief, TwelveMinuteTestDrive debrief, and FounderStory.
- **3,600× METRIC:** Not a generic "speed advantage." Real comparison: weeks-to-months (30 days conservative baseline) to MOBILIZE after a trigger fires — deciding who needs to be in the room, agreeing a plan, aligning stakeholders — before execution even begins, vs. 12 minutes with Readiness OS. Always label it "3,600× Execution Head Start" (never "speed advantage," never "faster"). Framing is always "30 days compressed to 12 minutes." Comparison tables must NEVER show "0" — use "Automatic — continuous monitoring," "Pre-staged before the trigger fires," "Pre-staged — 180 Readiness Protocols ready," "Automated at trigger point," or "12 minutes after trigger detection." Retired: "340×," "360×," "72 hours."
- **MICROSOFT FRAMING:** "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Readiness OS is the operating model layer above the Microsoft investment — an orchestrator, not a replacement.
- **CANONICAL PRODUCT NARRATIVE** (authoritative verbiage reference for all copy): "Pre-staged before the trigger. Authorized in real time. Teams mobilized in 12 minutes — and executing from a fully-staged position. Every activation makes the next response faster." Sequence: (1) preparation before the event, (2) human authorization in the moment, (3) the 12-minute mobilization outcome, (4) the continuous improvement loop (ADVANCE 2.0). Test all hero copy, section intros, investor decks, and onboarding text against this sequence.
- **DESCRIPTOR TERMINOLOGY:** "Situational Readiness Platform" is retired (too generic). One primary + two contextual variants — never mix them: (1) **Primary — "Readiness Infrastructure"**: everywhere as the product descriptor (nav subtitles, hero badges, meta titles, footers, investor pages), pairs with "Readiness OS." (2) **Contextual — "Coordination Infrastructure"**: competitive positioning only (CompetitivePositioning page, partner briefs, category-of-one framing). (3) **Contextual — "Operating Model Layer"**: only when describing Readiness OS's position above the Microsoft/AI stack in investor/integration diagrams.
- **CONCEPT HIERARCHY** (insight → diagnostic → category argument, keep distinct): "Mobilization is work" is the structural insight — every enterprise treats mobilization (authority, teams, budget, sequencing, systems, communication, compliance, governance record, learning) as overhead instead of something engineered; Readiness OS is the first platform to engineer it. "The 12 Mobilization Gaps" (Detection, Recognition, Authority, Team Assembly, Budget, External Resources, Sequencing, Systems, Communication, Compliance, Governance Record, Learning) are the diagnostic layer, used on `/the-gap` and in sales/investor conversations to let a prospect self-diagnose. The SaaS-contrast framing — "Most enterprise software: a better way to do existing work. Readiness OS: a new category based on a structural organizational flaw that has never had a platform." — is the category-argument layer, used on `/investors` and investor materials.

### Locked Terminology Rules
- **Language enforcement (zero tolerance):** "AI-powered," "AI-driven," "AI-generated," "AI-detected," and "GPT-4o" are retired from all visible UI copy/labels/descriptions/placeholders/buttons. Use "system-detected," "signal-based," "system-analyzed," "pre-staged," "system-staged," or "continuous monitoring" instead. Code comments are exempt; the AI model name may appear only in technical integration listings (IntegrationHub, architecture diagrams), never in end-user-facing copy.
- **Founding Partner Program:** the pre-launch program is always "Founding Partner Program" — never "Pilot Program/Access" or "Now in Pilot." It's a 90-day validation partnership. Buttons: "Apply for Founding Partner Access" / "Request Founding Partner Access." CTAs to `/contact` or `/request-access` must use Founding Partner language. Internal variable names/route slugs are exempt.
- **Football terminology retired:** "Offense/Defense/Special Teams" as category labels are gone from user-facing copy. Current names: **GROWTH & POSITIONING** (was Offense), **RISK & RESILIENCE** (was Defense), **TRANSFORMATION** (was Special Teams). Internal code keys (`offense`, `defense`, `special_teams`) and DB values are unchanged. Exception: `FounderStoryFull.tsx` deliberately preserves football language as part of the founder's personal origin story.
- **"Human-AI partnership" is retired** — use "AI monitors, executives authorize" or "Executive authority preserved." No Readiness Protocol activates without executive sign-off; preparation compresses the mobilization cycle, but the decision stays human.
- Terminology stays consistent: "12 minutes," "3,600×," "180 Readiness Protocols," "231 triggers." "Readiness Protocol" is the canonical term for all execution artifacts.

### Workflow & Style Preferences
- Simple, everyday communication style.
- Valued prioritization approach with phase-by-phase implementation.
- **NO TASK LISTS** — every request handled as a focused, surgical change only.
- Executive professional language required across UI/UX.
- All text clearly and boldly readable — medium weight minimum, deep navy or dark gray.
- Brand placement and visual memory is a priority — logo on every key page.
- Desktop-first layout; mobile adjustments only if non-disruptive.

## System Architecture

### UI/UX Decisions
- **Theme:** Light mode with pure white backgrounds; dark mode supported.
- **Typography:** Global base font-weight 500; headings font-weight 700 in midnight navy. Cormorant Garamond for editorial, Barlow Condensed for labels.
- **Branding:** Consistent VaughnMartin and Readiness OS branding with a circular seal logo.
- **Navigation:** Three synchronized navigation systems (`HomepageNav`, `StandardNav`, `IDEASidebar`).
- **Layout:** All pages wrapped by a `PageLayout` component.
- **Color Palette:** `NAVY="#0A0F2E"`, `NAVY_BG="#132558"`, `GOLD="#C9A84C"`, `TEAL="#2B8A6E"`, `IVORY="#F0EDE4"`. No purple.
- **Design System:** Custom CSS utilities (stat blocks, section labels, cards, buttons) and shared components (`SectionLabel`, `EditorialStat`, `GoldRule`). Buttons/cards/badges use `border-radius: 0.15rem`.

### Technical Implementations
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form + Zod, Framer Motion.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server.
- **AI Services:** Azure OpenAI primarily, fallback to OpenAI GPT-4o, multi-agent IDEA Framework.
- **Authentication:** Replit OIDC with Passport.js.
- **Authorization:** RBAC via `requireRole()` middleware. Fail-closed on errors. Org membership validated on all mutable routes.
- **Background Tasks:** PostgreSQL-backed job queue for asynchronous AI tasks.
- **Access Control:** Email allowlist (`allowed_emails` table) gates logins. Open when list is empty; restrictive once any email is added. Platform admin email bypasses list. `/access-denied` shown to unauthorized users.
- **Admin Panel:** `/admin/users` — platform admin only. View/delete users, manage allowlist. Protected by `requirePlatformAdmin` middleware keyed on `PLATFORM_ADMIN_EMAIL` env secret.

### Feature Specifications
- **Core Platform:** Playbook Library (180 core protocols + 30 compound protocols, IDs 181–210), Demo Experience, Execution Intelligence Dashboard, Investor Gate, admin views.
- **Pre-Staged Execution:** Execution Briefs, Live War Room, Post-Activation Debriefs for human-authorized, pre-staged execution.
- **Automation & Simulation:** Auto-Task Seeding, embeddable Workspace Pages, Guided Start Experience, Shadow Strategy Simulator (Digital Twin).
- **IDEA Framework:** Manages the Trigger → Playbook IDEA Chain end-to-end, from trigger detection to playbook recommendations and execution.
- **Key Differentiators:** Readiness ROI Dashboard, Compound Threat Intelligence, Strategic Recorder, War Room Pulse Map.
- **ADVANCE 2.0 — Closed-Loop Causal Learning (`/advance-intelligence`):** Every activation close-out generates preparation updates. `AdvanceLoopService.applyUpdateWithDelta()` mutates the protocol record, stores an immutable version delta, and creates a causal hypothesis ("expected −4 min"). After the next activation, `measureHypothesesForActivation()` compares expected vs actual and classifies proven/disproven. Learning Velocity Index dashboard shows updates applied, proven improvements, total minutes saved, % of library with evidence-backed changes, top 10 updates by proven impact, 6-month velocity trend, and the moat metric (months to rebuild on any competitor). Schema: `protocol_version_deltas` + `update_hypotheses`. Auto-apply queue (low-risk signal calibrations) + executive authorization queue (ownership/protocol changes). Measurement triggers automatically on every close-out.
- **Sales Assets:** Executive Brief (`/executive-brief`) — printable 1-pager with comparison table, proof numbers, ROI case, Founding Partner CTA. Security & Compliance (`/security-compliance`) — procurement-ready one-pager covering auth, data governance, compliance readiness, AI safety controls across 6 sections.
- **Demo Experience Center (`/demo-hub`):** 12 scenario simulations across all 3 domains. GROWTH & POSITIONING: Competitor Displacement Sprint (`/demo/market-entry` — Protocol #31, LegacyPoint Ch.11, 72-hour window), M&A Rapid Response (`/demo/acquisition` — Protocol #58, LOI in 48 hours). RISK & RESILIENCE: Ransomware, FDA Recall, Supply Chain, Energy Grid, Food Safety, Data Breach, DOJ Investigation. TRANSFORMATION: Go-to-Market Acceleration Sprint (`/demo/product-launch` — Protocol #89), Workforce Transformation Protocol (`/demo/workforce` — Protocol #112, 6,720 roles, 12 countries). Master Demo at `/master-demo` (Activist Investor, 7-phase walkthrough). All 12 scenarios route through the single `MasterDemo` component via `/demo/:scenarioId`.
- **12-Minute Test Drive:** Public 4-step simulation at `/12-minute-experience`. 7 scenarios: 6 single-domain + 1 compound (Activist + Regulatory, 10-task dual-track war room). Compound card spans full grid width with teal left-border and "2 Protocols · Simultaneous" badge.
- **How It Executes (`/how-it-executes`):** Animated signal → protocol → tasks staged → stakeholders notified → executive authorizes → 12 minutes complete chain visualization. 5 scenario selectors (4 single-domain + 1 compound), auto-plays on load, Old Model comparison panel, "Before/At/After the Trigger" breakdown. Compound scenario uses TEAL active state.
- **Proof Story (`/proof-story`):** Three activation narratives (Ransomware, Activist Investor, Supply Chain Collapse) with side-by-side timelines (with vs. without Readiness OS), comparison tables, financial outcomes. Toggle "Side by Side" / "With Readiness OS" / "Without."
- **ROI Calculator (`/roi-calculator`):** Platform cost slider ($60K–$240K, default $120K), break-even calculation, 3-year net value, first-year ROI %, consulting retainer comparison in the sticky sidebar.
- **Platform Architecture:** Two-tier model — Readiness OS Core (180 cross-industry protocols) + 6 Industry Protocol Packs.
- **Getting Started Hub (`/getting-started`):** Go-live readiness dashboard tracking 4 setup phases with a live completion score.
- **PMO Director Onboarding (`/pmo-onboarding`):** Persona-specific path for the preparation architecture owner — 3-tier ownership model (C-suite = Authorization, PMO = Preparation Architecture, Functional = Execution), 4-phase go-live path, weekly/monthly/quarterly governance rhythm. Linked from StandardNav under "Inside the Platform."
- **Protocol Builder (`/protocol-builder`):** 6-step wizard for Founding Partners/prospects to create custom protocols.
- **Live Signal Detection:** RSS ingestion from 8 sources every 15 minutes, scored against 16 trigger patterns.
- **Risk Scoring:** Square-root scaling (`√signals × 8`) — LOW (<35), MEDIUM (35–74), HIGH (75+).
- **Command Tower (`/command-tower`):** Full-screen executive display of live trigger detections and system statistics.
- **Competitive Positioning:** `/platform-reality`, `/ms-project`, `/vs-consulting`.
- **Access Paths:** Request Access (`/request-access`), Trial Access (`/trial-access`), Demo Access (`/demo-access`).
- **Executive Readiness Score:** 0–100, derived from live signals, triggers, playbooks, activations.
- **Sector Playbook Packs:** Protocols organized by 6 industry sectors.
- **Regulatory Calendar:** Compliance deadlines with urgency and recommended actions.
- **Board-Ready Activation Report:** Reports for activations, including elapsed time and next steps.
- **Ownership Close-Out Gate:** Formal governance verdict post-activation.
- **Authorization Precedent Panel:** In `GovernanceReadinessCheck.tsx`, above the 3 pre-flight questions at the moment of executive decision. Shows prior authorization records (executive initials, date, choice, outcome: Proven teal / Measuring amber). Sourced from live execution + close-out data; currently seeded with illustrative records.
- **Capability Survivability Indicator:** Badge on every protocol card in `ProtocolLibrary.tsx`. Three states from stakeholder count + activation history — System-Embedded (teal, ≥3 stakeholders + ≥3 activations), Establishing (gold, partial), Owner-Dependent (gray, low configuration).
- **Recovery vs. Optimization Debrief Classification:** Debriefs auto-classified as Optimization, Mixed-Signal, or Recovery.
- **Post-Drill Debrief (`/practice-drills`):** Structured debrief dialog after practice drills.
- **ROI Dashboard:** Actual costs logged across activations and outcome classifications.
- **Activation Console:** Integrates real organizational stakeholders for notifications.
- **Intelligence Control Center:** Live Recent Signal Detections feed.
- **AIRadarDashboard:** Real-time average response times against benchmarks.

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
