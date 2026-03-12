# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform for Fortune 1000 companies. It automates project creation, task assignment, document staging, and budget allocation, enabling a 12-minute response to strategic triggers. The platform integrates AI-driven trigger monitoring with 170 strategic playbooks across 9 domains, operating on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE). It fosters a human-AI partnership, with AI handling monitoring and recommendations while human executives retain decision-making. The project aims to become "The Execution Infrastructure Enterprises Are Missing," targeting C-suite executives and boards across all major industries. Its brand tagline is "We Make Enterprises Fearless."

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
- **Branding:** Consistent `VaughnMartin` (company) and `Execution OS` (product) branding with logo placement on all key pages.
- **Navigation:** Four-section nav (Product, Experience, Platform, Investors) with no duplicates. Product = marketing/education. Experience = AI tools + get started. Platform = 7 authenticated hub pages only. Footer mirrors nav structure organized by IDEA phases. "Crisis Hub" retired — replaced by "Situations Hub" covering all 9 strategic domains.
- **Layout:** All pages are wrapped by a `PageLayout` component including `StandardNav` and `Footer`.
- **Homepage Messaging:** Focuses on 12-minute execution, the IDEA Framework, and research-backed validation, targeting a broad executive audience.

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form + Zod, Framer Motion, Lucide React/react-icons.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server.
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.
- **Live Signal Ingestion:** Real-time signal monitoring in 15-minute cycles across 20 categories and 248+ data points.
- **Authentication:** Replit OIDC with Passport.js; new users get an organization on first login.
- **Role-Based Access:** `requireRole()` middleware enforces permissions for write routes.
- **AI Services:** OpenAI GPT-4o for pulse analysis, risk assessment, executive summaries, and opportunity detection.
- **Error Monitoring:** Sentry integration for server and frontend.
- **Route Architecture:** Centralized `server/routes.ts` with domain logic extracted into modular files.

**Feature Specifications:**
- **Founder Story / Manifesto (`/founder-story`):** Manifesto-first page emphasizing the "We Make Enterprises Fearless" statement, supported by bio and video content.
- **Playbook Library:** 170 active playbooks across 9 domains, with enriched content and free samples for unauthenticated users.
- **Try Demo Experience (`/try-demo`):** Public route demonstrating the platform's value through a 7-phase process.
- **Role Availability Signal:** Admin-set flags for managing key role limitations to ensure 12-minute response.
- **Activation Outcome Card:** Records outcomes for completed playbook activations, including task stats and AI summaries.
- **Admin Customer Health View:** Admin-only dashboard showing RAG status of pilot organizations.
- **Execution Intelligence Dashboard + Maturity Score:** Displays a 0-100 maturity score based on platform usage.
- **Playbook Performance Fingerprints:** Details activation count, execution time, and target met rate for playbooks.
- **Investor Gate (`InvestorGate.tsx`):** Secure access to investor resources, capturing leads via a form.
- **AI Execution Brief (`PlaybookActivationConsole.tsx`):** AI-generated commander-style brief before playbook activation.
- **Graduated Attention — Completed Task Collapse (`WorkspaceExecute.tsx`):** Collapses completed tasks in the MyActionsPanel for better focus.
- **Source Governance Indicator (`PlaybookDetail.tsx`):** Version-based color-coded status badge for playbooks.
- **Trigger → Playbook IDEA Chain (`TriggersManagement.tsx` + `GET /api/executive-triggers`):** The IDEA Framework is fully wired: data points DETECT a trigger → specific playbooks surface for EXECUTE. The API resolves each trigger's `recommendedPlaybooks` slugs to real `playbookLibrary` records via fuzzy name matching then keyword-scored domain fallback — returning `linkedPlaybooks: [{id, name, domain}]` with real UUIDs. UI shows "Execute With" tags that link to `/identify/playbooks/:id`. "Execute Playbook" button routes to first specific linked playbook. Do NOT revert to domain-filter routing. Auth gating: all interactive controls hidden from unauthenticated users; trigger data remains visible to demonstrate value before sign-in.
- **Trigger Configuration Wizard (`TriggerConfigurationWizard.tsx`):** 4-step wizard: (1) Situation & Category — 6 scenario quick-selects auto-fill name/category; (2) Conditions — full 248 data points from `shared/intelligence-signals.ts` per category; (3) Notifications; (4) Playbook Mapping — fetches `/api/playbooks/templates`, shows "Recommended" (domain-matched) first then "Other". Saves actual playbook UUIDs. On edit, pre-loads from `linkedPlaybooks` IDs not old slugs. Do NOT revert to `/api/playbooks` or hardcoded `SIGNAL_FIELDS`.
- **Homepage Hero Headline:** Three-line gold-on-navy problem statement highlighting time savings.
- **Homepage Problem Section:** Four failure cards illustrating escalating losses, contrasting old and new execution timelines.

**"WOW" Features (5 Differentiators):**
- **Execution ROI Dashboard (`/roi-dashboard`):** Board-ready value intelligence.
- **Compound Threat Intelligence:** GPT-4o-powered cross-domain threat synthesis.
- **Shadow Strategy Simulator (`/simulation-studio`):** Digital Twin scenario dry-run.
- **Strategic Recorder (`/strategic-recorder`):** Generates playbook outlines from strategic notes using GPT-4o.
- **War Room Pulse Map:** Animated SVG visualization of signal domains.

**Data Consistency Standards (enforced across all pages):**
- Response time: **12 minutes** (never "4 min" or "4-minute activation")
- Speed advantage: **340x faster** (never "15,000x")
- Playbooks: **170** across **9 strategic domains**
- Signal categories: **20** (never "16")
- Data points: **248+** (never "216+")
- Executive triggers: **221**
- Navigation: All nav links verified working for both public and authenticated users — zero dead links.

**Deployment & Build Strategy:**
- **Platform:** Replit Autoscale, custom domain `vaughnmartin.com`.
- **Build:** Frontend and server bundles pre-built and committed to the repo, with a no-op deployment build command.
- **Server Startup Order:** HTTP server starts immediately, serving static assets before asynchronous initialization.
- **Startup Migrations:** `CREATE TABLE IF NOT EXISTS` for key tables on every boot.
- **Playbook Enrichment Seed:** Seeds enriched playbook content from JSON on every boot.
- **Route Ordering Rule:** Specific named routes registered before parameterized catch-all routes.

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend