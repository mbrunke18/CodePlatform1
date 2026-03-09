# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform for Fortune 1000 companies. Its primary goal is to automate project creation, task assignment, document staging, and budget allocation, enabling a 12-minute response to strategic triggers. The platform eliminates organizational lag by integrating AI-driven trigger monitoring with a library of 170 strategic playbooks across 9 domains. It operates on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), fostering a human-AI partnership where AI handles monitoring and recommendations, and human executives retain decision-making. The project aims to become "The Execution Infrastructure Enterprises Are Missing."

**Target audience:** The full executive layer — CEOs, CFOs, COOs, CIOs, CMOs, Chief Strategy Officers, Division Presidents, and Boards of Directors. Designed for all C-suite and executive leadership roles across every major industry. Cross-industry by design: financial services, manufacturing, healthcare, energy, retail, technology, and beyond. Any Fortune 1000 enterprise facing strategic velocity challenges. The homepage "Built for" tags read: CEOs & Boards · C-Suite Executives · Division Presidents · Executive Leadership. Never list only a subset of roles or specific industries as primary targets.

**Brand tagline:** "We Make Enterprises Fearless." — primary brand statement used in the Footer (sitewide), Homepage closing CTA, PilotProgram CTA section, TryDemo completion screen, and FounderStory manifesto. This tagline should appear on high-impact closing moments across the product. The supporting quote is: "Stop improvising. Start executing."

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
- **Default Theme:** Light mode with pure white backgrounds; dark mode supported.
- **Typography:** Global base font-weight 500; headings are font-weight 700 in midnight navy.
- **Branding:** Uses `VaughnMartin` (company) and `Execution OS` (product). `BrandStamp` component ensures consistent logo placement via `StandardNav` on all pages.
- **Navigation:** Streamlined navigation with distinct CTAs for authenticated and unauthenticated users. All pages must be reachable through the UI.
- **Layout:** `PageLayout` component wraps all pages with a `StandardNav` header and `Footer`.
- **Homepage Messaging:** Focuses on replacing coordination with 12-minute execution, highlighting the IDEA Framework, the missing layer gap, and research-backed validation. The "Built for" badge row displays: CEOs & Boards · C-Suite Executives · Division Presidents · Executive Leadership. Social proof line reads: "Active across Fortune 1000 enterprises in every major industry." Never name only specific roles or industries.

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter routing, React Hook Form + Zod, Framer Motion, Lucide React/react-icons.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) via Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server for real-time collaboration.
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.
- **Live Signal Ingestion:** Real-time signal monitoring in 15-minute cycles, with 16 signal categories and 216+ data points.
- **Authentication:** Replit OIDC with Passport.js; new users auto-get an org on first login.
- **Role-Based Access:** `requireRole()` middleware for write routes (admin, executive, strategist); no role means read-only.
- **AI Services:** OpenAI GPT-4o for pulse analysis, risk assessment, executive summaries, and opportunity detection.
- **Email:** Resend from `noreply@vaughnmartin.com`.
- **IDEA Framework:** Core framework supporting playbook customization, AI pattern matching, coordinated orchestration, and outcome analysis.

**Feature Specifications:**
- **Founder Story / Manifesto (`/founder-story`):** `FounderStory.tsx` is a manifesto-first page. The full "We Make Enterprises Fearless" manifesto by Marty Brunke (March 2026) is the dominant centerpiece — 7 Roman-numeral sections with pull quotes, styled body text, and an inline IDEA Framework navy card. The bio strip (MB monogram + Fortune 500 company badges) and two video cards (90-second intro, 3:30 full story) appear in a separate off-white section below. Closing CTA: "Request Pilot Access" → `/pilot-program`. Do not revert to a video-first or bio-first layout.
- **Playbook Library:** 170 active playbooks across 9 domains, plus 4 compound playbooks. Includes enriched content like `why_it_matters`, `signal_sources`, `enriched_phases`. Three free sample playbooks for unauthenticated users.
- **Try Demo Experience:** Public-facing `/try-demo` route demonstrating the before/after value of Execution OS in 7 phases (Select, Chaos, IDENTIFY, DETECT, EXECUTE, ADVANCE, Complete).
- **Role Availability Signal:** Admin-set flags warn the activation console when key roles are limited, ensuring the 12-minute promise.
- **Activation Outcome Card:** Closes the ADVANCE loop by seeding an outcome record for every completed playbook activation, showing task stats, target met status, human input, and GPT-4o executive summary.
- **Admin Customer Health View:** Admin-only route `/admin/customer-health` providing a RAG-status view of pilot organizations based on activation frequency.
- **Execution Intelligence Dashboard + Maturity Score:** Displays a normalized 0-100 maturity score based on activation, advance closure, and trigger depth, with corresponding labels (Emerging, Developing, Operating).
- **Playbook Performance Fingerprints:** A dedicated tab in `PlaybookDetail.tsx` showing activation count, average execution time, target met rate, and recent outcome notes for playbooks with 3+ activations.
- **Investor Gate (`InvestorGate.tsx`):** A full-screen dark navy gate component wrapping `/investor-resources`, `/investor-presentation`, and `/board-briefings`. Captures name, work email, company, and role via a form; stores leads in the `investor_leads` DB table via `POST /api/investor-access` (public, no auth required). Access token stored in localStorage for 7 days. Admin can view all leads via `GET /api/investor-leads`.
- **AI Execution Brief (`PlaybookActivationConsole.tsx`):** Before confirming a playbook activation, an AI-generated commander-style brief is shown. Endpoint `GET /api/playbooks/:id/execution-brief` calls GPT-4o and returns 6 structured fields: situation framing, mission objective, critical roles, top risks, success indicators, and commander note. Displays as a navy card above the PreActivationImpactPreview. Falls back to a static template if OpenAI is unavailable. Auth-gated (401 for unauthenticated).
- **Graduated Attention — Completed Task Collapse (`WorkspaceExecute.tsx`):** In the MyActionsPanel, completed tasks collapse into a teal summary bar ("X tasks completed") with an expand/collapse toggle. Keeps active tasks front-and-center without losing completed work context.
- **Source Governance Indicator (`PlaybookDetail.tsx`):** A version-based color-coded status badge in the sidebar of every playbook detail page. Teal = Current (v1.x), Gold = Under Review (v2–3.x), Red = Recertification Required (v4+). Uses `playbook.version` with `'1.0'` as the default fallback.

**"WOW" Features (5 Differentiators):**
- **Execution ROI Dashboard (`/roi-dashboard`):** Board-ready value intelligence, highlighting "Value Preserved" and time saved.
- **Compound Threat Intelligence:** GPT-4o cross-domain threat synthesis detecting patterns across multiple signal domains.
- **Shadow Strategy Simulator (`/simulation-studio`):** Digital Twin scenario dry-run, providing Survive/Thrive scores and identifying relevant playbooks/coverage gaps.
- **Strategic Recorder (`/strategic-recorder`):** Generates custom playbook outlines from crisis notes or transcripts using GPT-4o.
- **War Room Pulse Map:** Animated SVG concentric ring visualization of 20 signal domains, showing trigger counts, proximity scores, and pulse animations for at-risk nodes.

**Deployment & Build Strategy:**
- **Platform:** Replit Autoscale, custom domain `vaughnmartin.com`.
- **Build:** Both `dist/index.js` (server bundle) and `dist/public/` (frontend) are pre-built and committed to the repo. The deployment build command is a no-op (`sh -c ":"`), so the bundle phase completes instantly. Before publishing, always run locally: (1) `npx vite build` to update `dist/public/`, and (2) `esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:vite --external:@vitejs/plugin-react --external:../vite.config` to update `dist/index.js`. Commit both before publishing. The deployment run command is `npm run start` = `NODE_ENV=production node dist/index.js`.
- **Server Startup Order:** HTTP server starts immediately. In production, `express.static(dist/public)` and `app.get("/", sendFile(index.html))` are registered BEFORE `server.listen()` so Replit's healthcheck (GET /) returns 200 from the very first millisecond. Routes and background initialization run async after listen. Without this, GET / returns 500 during the startup window and healthchecks fail.

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend