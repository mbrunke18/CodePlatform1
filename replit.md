# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform designed for Fortune 1000 companies. Its core purpose is to automate project creation, task assignment, document staging, and budget allocation, enabling a 12-minute response to strategic triggers. This platform aims to eliminate organizational lag by integrating AI-driven trigger monitoring with a library of 170 strategic playbooks across 9 domains. It operates on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), fostering a human-AI partnership where AI handles monitoring and recommendations, while human executives retain decision-making. The project's vision is to become "The Execution Infrastructure Enterprises Are Missing."

## User Preferences
- Preferred communication style: Simple, everyday language
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision of human-AI partnership for strategic velocity
- Executive professional language required across UI/UX
- All text must be clearly and boldly readable — medium weight minimum, deep navy or dark gray
- Brand placement and visual memory is a priority — logo should appear on every key page
- Desktop-first layout; mobile adjustments only if non-disruptive

## System Architecture

**UI/UX Decisions:**
- **Default Theme:** Light mode with pure white backgrounds; dark mode supported via localStorage.
- **Typography:** Global base font-weight 500; headings are font-weight 700 in midnight navy.
- **Branding:** Uses `VaughnMartin` (company) and `Execution OS` (product). `BrandStamp` component ensures consistent logo placement via `StandardNav` on all pages.
- **Navigation:** Streamlined navigation with distinct CTAs for authenticated and unauthenticated users. All pages must be reachable through the UI.
- **Layout:** `PageLayout` component wraps all pages with a `StandardNav` header and `Footer`.
- **Homepage Messaging:** Focuses on replacing coordination with 12-minute execution, highlighting the IDEA Framework, the missing layer gap, and research-backed validation.

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter routing, React Hook Form + Zod, Framer Motion, Lucide React/react-icons.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) via Drizzle ORM, with schema in `shared/schema.ts`. `npm run db:push` for migrations.
- **Real-time:** Socket.IO WebSocket server for real-time collaboration.
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.
- **Live Signal Ingestion:** Real-time signal monitoring in 15-minute cycles, with 16 signal categories and 216+ data points (`shared/intelligence-signals.ts`).
- **Authentication:** Replit OIDC with Passport.js; new users auto-get an org on first login.
- **Onboarding Guard:** `OnboardingGuard` component in `App.tsx` redirects new users to `/onboarding` once per session.
- **Role-Based Access:** `requireRole()` middleware for write routes (admin, executive, strategist); no role means read-only.
- **AI Services:** OpenAI GPT-4o for pulse analysis, risk assessment, executive summaries, and opportunity detection.
- **Email:** Resend (`RESEND_API_KEY`) from `noreply@vaughnmartin.com`.
- **IDEA Framework:** Core framework supporting playbook customization, AI pattern matching, coordinated orchestration, and outcome analysis.

**Playbook Library:**
- **Total:** 170 active playbooks across 9 domains, plus 4 compound playbooks.
- **Domains:** Financial Strategy, Market Dynamics, Operational Excellence, Technology & Innovation, AI Governance, Market Opportunities, Brand & Reputation, Regulatory & Compliance, Talent & Leadership.
- **Free Samples:** Three specific playbooks are available as free samples for unauthenticated users: "Aggressive Pricing Disruption", "Compound: Geopolitical + Supply Chain Disruption", and "AI Competitive Disruption."
- **Enriched Content:** All 170 playbooks include enriched fields like `why_it_matters`, `signal_sources`, `enriched_phases`, `communication_assets`, `risk_indicators`, and `outcome_framing`.

**Try Demo — Experience Design:**
- **Route:** `/try-demo` (unauthenticated, public-facing).
- **Purpose:** Demonstrates the before/after value of Execution OS in ~90 seconds.
- **Flow:** Consists of 7 phases (Select, Chaos, IDENTIFY, DETECT, EXECUTE, ADVANCE, Complete) guiding the user through a simulated strategic event and its resolution. Pacing is user-controlled.

**Role Availability Signal:**
- **Purpose:** Protects the 12-minute promise — admin-set flags warn the activation console when key roles are limited.
- **Admin UI:** `OrganizationSetup.tsx` Stakeholders tab → "Role Availability" section with 12 common executive roles (CEO, CFO, CTO, CISO, etc.) each with a toggle + optional reason note.
- **Pre-Activation Warning:** `PlaybookActivationConsole.tsx` checks flags against the playbook's `tier1Stakeholders`/`tier2Stakeholders` and shows an amber advisory banner. Non-blocking — executive can still proceed.
- **API:** `GET/POST /api/role-availability`, `POST /api/role-availability/check`.
- **DB Table:** `role_availability_flags` (organizationId, roleName, isLimited, note, updatedBy).

**Activation Outcome Card (ADVANCE Phase Closure):**
- **Purpose:** Closes the ADVANCE loop — every completed playbook activation automatically seeds an outcome record.
- **Flow:** `PlaybookActivationConsole.tsx` on completion → creates `playbook_activations` record → auto-seeds `activation_outcomes` → shows "Close the Loop — View Outcome Report →" button.
- **Outcome Page:** `/activation-outcome/:activationId` — shows task stats, target met status, one human input field ("What would you change?"), and GPT-4o executive summary generation.
- **API:** `GET/POST /api/activation-outcomes`, `PATCH /api/activation-outcomes/:id/note`, `POST /api/activation-outcomes/:id/generate`.
- **DB Table:** `activation_outcomes` (activationId, orgId, playbookId, aiSummary, tasksCompleted, tasksSkipped, totalTasks, actualMinutes, targetMet, humanNote, status).

**Admin Customer Health View:**
- **Route:** `/admin/customer-health` (admin-only).
- **Purpose:** RAG-status view across all pilot organizations for pilot management.
- **RAG Logic:** Green = activation last 7 days, Amber = 8–21 days, Red = 22+ days or never.
- **Metrics per org:** totalActivations, completedActivations, lastActivationAt, memberCount, triggerCount, closedLoopCount.
- **API:** `GET /api/admin/customer-health`.

**Execution Intelligence Dashboard + Maturity Score:**
- **Component:** `client/src/components/ExecutionIntelligenceDashboard.tsx` — mounted in `Dashboard.tsx` above the Intelligence Feed.
- **Maturity Score Formula:** `activationScore×0.4 + advanceClosureScore×0.4 + triggerDepthScore×0.2`, normalized 0–100.
- **Labels:** 0–33 = Emerging, 34–66 = Developing, 67–100 = Operating.
- **Shows:** Circular score display, 3 breakdown bars, key stats (activations, target met rate, closed loop count, trigger depth).
- **API:** `GET /api/intelligence/maturity-score`.

**Playbook Performance Fingerprints:**
- **Location:** Performance tab added to `PlaybookDetail.tsx` (tabs were already imported but unused).
- **Gating:** Tab only visible to authenticated users; requires 3+ activations for real data.
- **Placeholder State:** Below 3 activations shows "Performance Intelligence Accumulating" message.
- **Shows (with data):** Activation count, avg execution time, target met rate, avg success rating, recent outcome notes.
- **API:** `GET /api/playbook-performance/:playbookId`.

**WOW Features (5 Differentiators):**

- **Execution ROI Dashboard** (`/roi-dashboard`): Board-ready value intelligence. Hero "Value Preserved" metric in gold, time-saved bar chart (72h industry vs 12-min OS), activation timeline, printable board report view. API: `GET /api/roi/summary`, `GET /api/roi/board-report`. DB: `roi_snapshots`.

- **Compound Threat Intelligence** (`CompoundThreatAlerts.tsx`): GPT-4o cross-domain threat synthesis. Detects patterns spanning multiple signal domains. Compact mode mounts in Dashboard. "Analyze Now" button triggers fresh scan. Dismiss individual alerts. API: `GET/POST /api/compound-threats`, `PATCH /api/compound-threats/:id/dismiss`, `POST /api/compound-threats/analyze`. DB: `compound_threat_alerts`.

- **Shadow Strategy Simulator** (`/simulation-studio`): Digital Twin scenario dry-run. Input scenario text → GPT-4o returns Survive score (0-100), Thrive score (0-100), playbooks that activate, coverage gaps. Circular SVG gauges, simulation history. API: `POST /api/simulation/analyze`, `GET /api/simulation-analyses`. DB: `simulation_analyses`.

- **Strategic Recorder** (`/strategic-recorder`): Paste crisis notes/meeting transcripts → GPT-4o generates custom playbook outlines (name, phases, stakeholders, triggers, value prop). 48-hour onboarding accelerator. Save-to-library flow. API: `POST /api/strategic-recorder/analyze`, `GET /api/strategic-recordings`. DB: `strategic_recordings`.

- **War Room Pulse Map** (`PulseMap.tsx` + `MissionControl.tsx`): Animated SVG concentric ring visualization of all 20 signal domains. Each node sized by trigger count, colored by proximity score. Pulse animations for AT RISK/APPROACHING nodes. Live stats panel (at-risk count, approaching, active activations). Mounted in MissionControl between header and content grid. Component: `client/src/components/mission/PulseMap.tsx`.

**Deployment:**
- **Platform:** Replit Autoscale, custom domain `vaughnmartin.com`.
- **Build Strategy:** `dist/public/` (frontend) is pre-built and committed to git. Deployment build step runs only the fast server esbuild (~1 second): `esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:vite ...`. This avoids the 25-second vite build that was timing out on deployment infrastructure. Do NOT change back to `["true"]` or `npm run build`.
- **Server Startup Order (critical):** HTTP server is created with `createServer(app)` and starts `server.listen()` IMMEDIATELY at the top of `server/index.ts` before the async IIFE runs. This ensures health check endpoints (`/health`, `/ping`) respond within milliseconds of startup. `registerRoutes(app, server)` accepts the pre-created server to attach WebSocket (Socket.IO). Background seeding/initialization runs after routes are registered, non-blocking. DO NOT move `server.listen()` back inside the async IIFE or registerRoutes.

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend
- **Enterprise Integrations (planned):** Salesforce, HubSpot, ServiceNow, Jira, Slack, Microsoft Teams, Google Workspace, Outlook/Exchange, AWS CloudWatch, Workday, Okta, Microsoft Active Directory