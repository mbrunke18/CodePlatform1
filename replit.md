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
- **Email:** Resend (`RESEND_API_KEY`) from `noreply@executeiq.io`.
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

**Deployment:**
- **Platform:** Replit Autoscale, custom domain `executeiq.io`.
- **Build Strategy:** `dist/` is pre-built and committed; deployment runs `npm run start` directly.

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend
- **Enterprise Integrations (planned):** Salesforce, HubSpot, ServiceNow, Jira, Slack, Microsoft Teams, Google Workspace, Outlook/Exchange, AWS CloudWatch, Workday, Okta, Microsoft Active Directory