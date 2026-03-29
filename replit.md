# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform for Fortune 1000 companies. It automates project creation, task assignment, document staging, and budget allocation, enabling a 12-minute response to strategic triggers. The platform uses AI for trigger monitoring and integrates 170 strategic playbooks across 9 domains within its proprietary IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE). It promotes a human-AI partnership, with AI handling monitoring and recommendations while human executives make final decisions. The project aims to be "The Execution Infrastructure Enterprises Are Missing," targeting C-suite executives and boards with the tagline "We Make Enterprises Fearless."

## User Preferences
- Preferred communication style: Simple, everyday language
- **FOUNDER VISION (HIGHEST PRIORITY — LOCKED):** "We redesign how work flows in the age of AI." Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint. But every vendor bolted AI onto the old model (faster spreadsheets, smarter summaries, better notes from the same slow meetings). VaughnMartin rebuilds from first principles. Pre-staged playbooks REPLACE real-time coordination. Pattern detection REPLACES committee deliberation. 12-minute execution REPLACES 30-day alignment cycles. **We are NOT competing with Copilot or AI tools — we're competing with the 40-year-old meeting-heavy operating model itself.** This thesis must be present on the Homepage, Investor pages, Founder Story, and Presentation slides.
- **LOCKED MESSAGING — NEVER CHANGE:** The 3,600× metric is NOT a generic "speed advantage." The real-world comparison is weeks to months (30 days conservative baseline) vs. 12 minutes. In a Fortune 1000, when a strategic trigger fires, the enterprise spends weeks just to MOBILIZE — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — before execution even begins. Execution OS compresses that entire cycle to 12 minutes. The correct label is always "3,600× Execution Head Start" — never "speed advantage," never "faster." The correct framing is "30 days compressed to 12 minutes." Comparison table entries must NEVER show "0" — use: "Automatic — continuous monitoring," "Pre-staged before the trigger fires," "Pre-staged — 170 playbooks ready," "Automated at trigger point," or "12 minutes after trigger detection." Every instance of this metric on the platform must reflect this framing. The old "340×" and "72 hours" framing is RETIRED.
- **MICROSOFT FRAMING (LOCKED):** "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Execution OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator.
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision of human-AI partnership for strategic velocity
- Executive professional language required across UI/UX
- All text must be clearly and boldly readable — medium weight minimum, deep navy or dark gray
- Brand placement and visual memory is a priority — logo should appear on every key page
- Desktop-first layout; mobile adjustments only if non-disruptive
- Homepage dark sections use `NAVY_BG="#132558"` (not `NAVY="#0A0F2E"`) for large `<section>` backgrounds — lighter so it reads as genuine navy blue rather than near-black. All other files use `NAVY` only. Dark sections layer a gold grid (`rgba(201,168,76,0.09)`, 1px, 48px) and large radial gradient orbs (teal + gold, 600–1000px, opacity 0.11–0.22) for visual depth.

## System Architecture

**UI/UX Decisions:**
- **Theme:** Light mode with pure white backgrounds; dark mode supported.
- **Typography:** Global base font-weight 500; headings are font-weight 700 in midnight navy.
- **Branding:** Consistent VaughnMartin and Execution OS branding with a circular seal logo (gold gradient rings, 8 tick marks, "VAUGHNMARTIN" / "EXECUTION OS" text, VM monogram). Variants: `full` | `icon-only` | `text-only`. All color variants use a gold gradient ring for a premium look.
- **Logo Sizing Standard:** Nav bars are 130px tall; various fixed sizes for other placements. Logos on dark backgrounds use `color="white"`, light backgrounds use `color="navy"`.
- **Navigation:** Three navigation systems exist — all must stay in sync:
  1. **`HomepageNav`** (Homepage only, flat links): How It Works · The Platform · Experience (→`/industry-demos`) · Why Execution OS (→`/why-execution-os`) · Investors + CTA buttons. Mobile overlay mirrors this.
  2. **`StandardNav`** (all other pages, dropdown-based): Four dropdowns — **The Platform** (operating model, core capabilities, platform tools, execute tools) · **Experience** (Try It Now: Live Demo, 12-Min Test Drive, Industry Scenarios; Go Deeper: Shadow Simulator, By Role, Strategic Analyzer, Executive Brief) · **Evidence** (Why Execution OS featured, Executive Brief featured, Research, ROI Calc, Pricing) · **Investors** (Resources, Thesis, Deck, Briefings, Founder Story). Auth-aware right-side CTAs.
  3. **`IDEASidebar`** (authenticated platform view): IDEA-phase accordion using `navigationConfig` from `client/src/navigation/config.ts`.
- **Route Architecture:** All pages are direct routes; no hub consolidation redirects. Pages are distinct components with unique URLs.
- **Layout:** All pages are wrapped by a `PageLayout` component including `StandardNav` and `Footer`.
- **Homepage Messaging:** Focuses on 12-minute execution, the IDEA Framework, and research-backed validation.
- **Homepage Section Order:** A specific, unchangeable sequence of sections. `MicrosoftEcosystemBanner` is strategically placed after `PlatformPreviewSection`.
- **Homepage Nav Rule:** Dedicated sticky navigation bar for the homepage, distinct from `StandardNav`, with specific links.

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form + Zod, Framer Motion.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server.
- **Microsoft Ecosystem:** Integration with Microsoft Teams (notifications), Azure OpenAI, Copilot Studio, and Microsoft Entra.
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.
- **AI Services:** Primarily Azure OpenAI, with graceful fallback to OpenAI GPT-4o. Utilizes a multi-agent IDEA Framework.
- **Authentication:** Replit OIDC with Passport.js, creating organizations for new users.
- **Role-Based Access:** `requireRole()` middleware for permissions.
- **Error Monitoring:** Sentry integration.
- **Route Architecture:** Centralized `server/routes.ts` with modular domain logic.

**Feature Specifications:**
- **Core Platform Features:** Playbook Library (170 playbooks across 9 domains), Demo Experience, Execution Intelligence Dashboard, Investor Gate, and various admin views.
- **AI-Powered Execution:** AI Execution Briefs, Live War Room with stakeholder tracking and activity feeds, Post-Activation Debriefs with performance scores and AI recommendations.
- **Automation & Simulation:** Auto-Task Seeding, embeddable Workspace Pages, Guided Start Experience, Shadow Strategy Simulator (Digital Twin).
- **IDEA Framework Implementation:** Full Trigger → Playbook IDEA Chain for detecting triggers and recommending playbooks.
- **Enhanced Task Management:** Task Acknowledgment & Audit Trail with action buttons.
- **Reporting & Analytics:** Execution History Dashboard with KPIs and activation logs.
- **Flagship Playbooks:** 14 enriched flagship playbooks with expert content, task owners, time targets, and decision gates.
- **Configuration Wizards:** Trigger Configuration Wizard for setting up situations and playbook mapping.
- **Key Differentiators:** Execution ROI Dashboard, Compound Threat Intelligence, Strategic Recorder, War Room Pulse Map.
- **Data Consistency Standards:** Strict adherence to consistent values for response time (12 minutes), execution head start (3,600×, always labeled "3,600× Execution Head Start" — never "speed advantage," never "faster"), number of playbooks (170), signals, data points (248+), and triggers (221). Old "340×" and "72 hours" framing is RETIRED.
- **Personalized ROI Calculator:** Homepage section calculating annual value, exec time saved, and revenue protected based on user inputs.
- **12-Minute Test Drive:** A public 4-step sequential experience simulating execution.
- **War Room Escalate/Delegate Consequences:** Defined consequences for task escalation and delegation.
- **Dynamic Command Center Intelligence:** Rotating intelligence signals, coordination timeline, and live IDEA Framework recommendation cards.
- **Playbook Library Deep Enrichment:** Detailed playbook data including `whyItMatters`, `phaseCount`, `signalSourceCount`, `preApprovedBudget`, `priority`.
- **Living Playbooks Connected Data:** Displays top 6 playbooks sorted by severity, with activation counts, success rates, and AI improvement narratives.
- **IDEAFramework Stats Bar:** Platform statistics bar displaying key numbers.
- **ExecutionGapDiagram:** SVG comparison diagram (30 days vs 12 min) with proof numbers — the "30 days" baseline reflects enterprise mobilization time, never "72 hours."
- **ExecutionProcessDiagram:** SVG 3-layer process diagram (Strategic → Orchestration → Delivery Systems) on the "How It Works" page.
- **ExecutionOSMicrosoftDiagram:** SVG 3-layer architecture diagram illustrating Execution OS orchestrating the Microsoft stack.
- **EcosystemDiagramPage:** Standalone page (`/ecosystem`) detailing Microsoft integration.
- **How It Works page:** Features diagrams and sections on the process from onboarding to ongoing value.
- **InvestorLanding CTAs:** `/investor-landing` and `/executive-access` both serve `InvestorLanding.tsx`. Hero and closing CTA updated to prioritise "Schedule a Conversation" → `/pilot-program` and "Investor Resources" → `/investor-resources`. Closing section includes `investor@vaughnmartin.com` contact line.
- **Homepage — Microsoft Section CTA:** "Also integrates with" badge row (Google Workspace, Salesforce, AWS, SAP, ServiceNow, Workday) + gold-outlined "View All 7 Enterprise Ecosystems →" button linking to `/ecosystems` replaces old faint text link.
- **Homepage — WHY THE WORLD NEEDED THIS heading:** "Enterprise work was designed for a world **without AI.**" / "Nobody redesigned it." — two deliberate lines, no mid-sentence forced break.
- **Executive Access Link (LOCKED):** `https://vaughnmartin.com/demo-access?token=VMdemo2026` — token-gated entry that validates and drops visitor into the platform.
- **Magic Link Authentication:** `/request-access` — branded form (name, email, company, title); server generates a 24-hour single-use token and sends a Resend email; `/magic-login?token=<token>` verifies, creates a named user record + session, redirects to Command Center. Each prospect gets their own tracked identity (not a shared demo user). **Email behavior:** tries `pilot@vaughnmartin.com` first, falls back to `onboarding@resend.dev`; always saves token to DB and logs the full admin URL to console regardless of email result — prospect submission never shows an error. Requires valid `RESEND_API_KEY` + `vaughnmartin.com` domain verified at resend.com for live delivery. Token table: `magic_link_tokens`.
- **Growth Segment (`/growth`) — PERMANENT PRODUCT TRACK:** Targets SMBs and PE-backed startups. Three tiers: Ready $75K/yr ($7,500/mo) · Responsive $150K/yr ($15K/mo) · Orchestrated $250K/yr ($25K/mo). Annual = market rate; monthly = 20% premium (flexibility surcharge). Tiers = deployment scope (domains, playbooks, signals) — NOT a discounted product. No per-seat pricing. All Growth CTAs → `/contact`. Enterprise Pilot ($75K flat, Fortune 1000) stays on `/pilot-program` and is completely separate from Growth.
- **Email Routing:** `sales@` → Contact/Growth inquiries | `info@` → Footer/Investor general | `pilot@` → Pilot program pages | `support@` → Onboarding/customer success | `investor@vaughnmartin.com` → Investor contacts.

**Deployment & Build Strategy:**
- **Platform:** Replit Autoscale, custom domain `vaughnmartin.com`.
- **Build:** Frontend and server bundles are pre-built and committed to the repository.
- **Server Startup:** HTTP server starts immediately, serving static assets before asynchronous initialization.
- **Startup Migrations:** `CREATE TABLE IF NOT EXISTS` for key tables on every boot.
- **Playbook Enrichment Seed:** Seeds enriched playbook content from JSON on every boot.

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend