# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform designed for Fortune 1000 companies. Its primary purpose is to automate project creation, task assignment, document staging, and budget allocation, enabling a rapid 12-minute response to strategic triggers. The platform leverages AI-driven trigger monitoring and integrates 170 strategic playbooks across 9 domains, all operating within the proprietary IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE). It emphasizes a human-AI partnership, where AI handles monitoring and recommendations, while human executives retain ultimate decision-making authority. The project's vision is to become "The Execution Infrastructure Enterprises Are Missing," targeting C-suite executives and boards across all major industries, with the brand tagline "We Make Enterprises Fearless."

## User Preferences
- Preferred communication style: Simple, everyday language
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
- **Branding:** Consistent `VaughnMartin` and `Execution OS` branding with logo placement on all key pages. **Logo is the circular seal** (`ExecuteIQLogo.tsx` / `VaughnMartinLogo`): gold gradient rings (3.5px outer), 8 tick marks (4 cardinal + 4 diagonal), "VAUGHNMARTIN" top arc + "EXECUTION OS" bottom arc in Barlow Condensed, VM monogram, gold dot with rays, diamond ornaments. Uses React `useId` for unique gradient IDs per instance. Variants: `full` | `icon-only` | `text-only`. Colors: `navy` (full gold gradient ring + teal on white/light bg) | `white`/`teal` (gold seal on dark bg) | `gold` (navy seal on gold bg). **All color variants now use the gold gradient ring** — the `navy` variant was updated to use gold/teal color elements on white backgrounds for a vivid, premium look. **No simplified rendering mode** — full seal detail renders at all sizes. Two-brand architecture: **VaughnMartin** = the institution ("The layer nobody built") | **Execution OS** = the product ("We Make Enterprises Fearless").
- **Logo Sizing Standard:** Nav bars are **130px tall**. Homepage nav: `height={130}`, StandardNav: `height={130}`. `full` variant uses fixed wordmark text sizes (26px VaughnMartin, 10.5px Execution OS) regardless of seal size — seal scales with `height * 0.88`. Footer top: `height={80}`, Footer bottom: `height={72}`, PageHero: `height={64}`, InvestorGate: `height={80}`. All logos on dark backgrounds use `color="white"`, light backgrounds use `color="navy"`.
- **Navigation:** Four-section navigation (Product, Experience, Platform, Investors) with a consolidated "Situations Hub" for strategic domains and an "Investors" dropdown. "How It Works" is in Product → Understand dropdown in StandardNav AND linked in the homepage's own sticky nav bar and footer — all pointing to `/how-it-works` (not a scroll anchor).
- **Route Architecture:** All pages are direct routes — no hub consolidation redirects. Each page is a distinct component at its own URL. Do NOT add redirects that replace real pages with hub pages.
- **Layout:** All pages are wrapped by a `PageLayout` component including `StandardNav` and `Footer`.
- **Homepage Messaging:** Focuses on 12-minute execution, the IDEA Framework, and research-backed validation.
- **Homepage Nav Rule:** The homepage has its OWN sticky nav bar (separate from StandardNav) with links: How It Works, Execution OS, Pricing, About, and a mobile hamburger menu. These must be kept in sync with StandardNav. "How It Works" links in homepage nav must use `<Link href="/how-it-works">` — never a scroll anchor.

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form + Zod, Framer Motion, Lucide React/react-icons.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server.
- **Microsoft Ecosystem:** Teams war room notifications (`TeamsNotificationService.ts`, `TEAMS_WEBHOOK_URL`), Azure OpenAI support (`AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_KEY`, `AZURE_OPENAI_DEPLOYMENT`), Copilot Studio connector (IntegrationHub), Microsoft Entra Agent ID (IntegrationHub).
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.
- **Live Signal Ingestion:** Real-time signal monitoring across 20 categories and 248+ data points.
- **Authentication:** Replit OIDC with Passport.js; new users get an organization on first login.
- **Role-Based Access:** `requireRole()` middleware for permission enforcement.
- **AI Services:** Azure OpenAI (primary, when `AZURE_OPENAI_ENDPOINT` + `AZURE_OPENAI_KEY` set) with graceful fallback to OpenAI GPT-4o. Multi-agent IDEA Framework runs 4 specialist agents in parallel (IDENTIFY · DETECT · EXECUTE · ADVANCE). Provider status exposed at `/api/ai/provider-status`.
- **Error Monitoring:** Sentry integration for server and frontend.
- **Route Architecture:** Centralized `server/routes.ts` with modular domain logic.

**Feature Specifications:**
- **Core Platform Features:** Founder Story, Playbook Library (170 playbooks across 9 domains), Try Demo Experience, Role Availability Signal, Activation Outcome Card, Admin Customer Health View, Execution Intelligence Dashboard + Maturity Score, Playbook Performance Fingerprints, Investor Gate.
- **AI-Powered Execution:** AI Execution Brief before playbook activation, Live War Room during execution (Stakeholder Notification Tracker, Live Activity Feed, task cards with action-type badges), Post-Activation Debrief Screen (performance score, ROI calculation, AI recommendations).
- **Automation & Simulation:** Auto-Task Seeding for demos, embeddable Workspace Pages, Graduated Attention for completed tasks, Source Governance Indicator for playbooks, Guided Start Experience with scenario cards, Simulation Context Banner for demo runs.
- **IDEA Framework Implementation:** Full Trigger → Playbook IDEA Chain (`TriggersManagement.tsx` and API) for detecting triggers and recommending playbooks.
- **Enhanced Task Management:** Task Acknowledgment & Audit Trail with action buttons (Acknowledge, Escalate, Delegate) and DB persistence.
- **Reporting & Analytics:** Execution History Dashboard (`/execution-history`) with KPIs, response time trajectory, and activation log.
- **Flagship Playbooks:** 14 enriched flagship playbooks (5 original + 9 added: Activist Investor Defense, M&A Integration, Brand Crisis, Product Recall, Talent Flight, ESG Crisis, Ransomware, Financial Fraud, IPO Market Disruption) — each with 4-phase expert content, specific task owners, time targets, decision gates, and `why_it_matters` statements.
- **Configuration Wizards:** Trigger Configuration Wizard for setting up situations, conditions, notifications, and playbook mapping.
- **Key Differentiators ("WOW" Features):** Execution ROI Dashboard, Compound Threat Intelligence (GPT-4o), Shadow Strategy Simulator (Digital Twin), Strategic Recorder (GPT-4o), War Room Pulse Map.
- **Data Consistency Standards:** Strict adherence to consistent values for response time (12 minutes), speed advantage (340x faster), playbooks (170 across 9 domains), signal categories (20), data points (248+), executive triggers (221), and brand naming (Execution OS).
- **Investor Page Standards:** Rebuilt `/investors` page with code-based architecture, illustrative scenario cards, and purged all references to outdated branding/claims.
- **Personalized ROI Calculator** (`PersonalizedROISection`): Homepage section with 4 chip-selectors (revenue bracket, industry, exec count, scenarios/year); real-time calculation of annual value, exec time saved, revenue protected, 340x speed advantage.
- **12-Minute Test Drive** (`/12-minute-experience`, `/test-drive`): Public 4-step sequential page — scenario selection → GPT-4o AI brief → live war room with countdown and auto-progressing tasks → debrief with metrics + Request a Pilot CTA.
- **War Room Escalate/Delegate Consequences:** Escalating injects 3 cascading live feed events (🚨 banner, C-Suite loop, stakeholder channel); delegating injects ownership transfer + delegate tracking confirmation.
- **Dynamic Command Center Intelligence:** Rotating pool of 20 realistic intelligence signals (shifts every 5 min); rotating coordination timeline (10-event pool, shifts every 10 min); live IDEA Framework recommendation card (`SIGNAL_PLAYBOOK_MAP`: 17 signal patterns → named playbooks with domain/urgency).
- **Playbook Library Deep Enrichment:** `/api/playbooks/templates` returns `whyItMatters`, `phaseCount`, `signalSourceCount`, `preApprovedBudget`, `priority` for all 170 playbooks; cards show gold-bordered "Why Speed Matters" excerpt + phase/signal/stakeholder/budget badges.
- **Living Playbooks Connected Data:** `LivingPlaybooks.tsx` fetches from `/api/playbooks/templates`, shows top 6 playbooks sorted by severity score with activation counts, success rates, version numbers, and domain-specific AI improvement narratives.
- **IDEAFramework Stats Bar:** Platform stats section between hero and phase strip (170 playbooks, 221 triggers, 248+ data points, 12m response window).
- **ExecutionGapDiagram** (`ExecutionGapDiagram.tsx`): SVG comparison diagram (72 hrs vs 12 min). Bottom bar is a proof-numbers strip (170 playbooks · 221 triggers · 248+ data points · 12 min to live execution) — NOT a football analogy. viewBox `0 0 1320 762`. Used on Homepage and Investors page.
- **ExecutionProcessDiagram** (`ExecutionProcessDiagram.tsx`): SVG 3-layer process diagram (Strategic Layer → Orchestration Layer → Delivery Systems). Embedded at the TOP of `/how-it-works`, immediately after the phase nav bar. This is the "mechanics proof" diagram. Do NOT move it back to the bottom of the page.
- **How It Works page** (`/how-it-works`): Diagram section appears first (after hero + phase nav), followed by sections 01–05 (Onboarding → Ongoing Value), then Final CTA.

**Deployment & Build Strategy:**
- **Platform:** Replit Autoscale, custom domain `vaughnmartin.com`.
- **Build:** Frontend and server bundles pre-built and committed to the repo.
- **Server Startup:** HTTP server starts immediately, serving static assets before asynchronous initialization.
- **Startup Migrations:** `CREATE TABLE IF NOT EXISTS` for key tables on every boot.
- **Playbook Enrichment Seed:** Seeds enriched playbook content from JSON on every boot.
- **Route Ordering:** Specific named routes registered before parameterized catch-all routes.

## Critical Access Links (NEVER CHANGE WITHOUT UPDATING HERE)
- **Public site (limited access):** `https://vaughnmartin.com` — homepage, playbook library, ROI calculator, investor page, pilot program
- **Executive full access:** `https://vaughnmartin.com/demo-access?token=VMdemo2026` — branded loading screen → establishes session via `/api/demo-access` → lands on `/command-center`
- **Backup full access (same deployment):** `https://martybrunke.replit.app/demo-access?token=VMdemo2026`
- **Token:** `VMdemo2026` (default; overridable via `DEMO_ACCESS_TOKEN` env var)
- **Post-login destination:** `/command-center` (CommandLanding — Bloomberg Terminal-style hub with Activate, Signal Radar, Playbooks, Mission Control, and Performance tiles)
- **Feedback questionnaire:** `https://vaughnmartin.com/peer-review`
- **Customer Journey:** `https://vaughnmartin.com/customer-journey`

**Access Flow:** `/demo-access` (React) → auto-redirects to `/api/demo-access` (Express) → session established → `/command-center`

**Deployment Rule:** NEVER change `build` in `.replit` deployment config away from `["sh", "-c", ":"]`. The dist must be pre-built locally and committed. Remote builds on Replit's servers break the demo-access session flow.

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend