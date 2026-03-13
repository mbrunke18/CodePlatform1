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
- **Branding:** Consistent `VaughnMartin` and `Execution OS` branding with logo placement on all key pages.
- **Navigation:** Four-section navigation (Product, Experience, Platform, Investors) with a consolidated "Situations Hub" for strategic domains and an "Investors" dropdown.
- **Hub Route Consolidation:** Over 30 pages consolidated into 6 hub pages with tab navigation (e.g., `/dashboard` routes to `/command-center`).
- **Layout:** All pages are wrapped by a `PageLayout` component including `StandardNav` and `Footer`.
- **Homepage Messaging:** Focuses on 12-minute execution, the IDEA Framework, and research-backed validation.

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form + Zod, Framer Motion, Lucide React/react-icons.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server.
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.
- **Live Signal Ingestion:** Real-time signal monitoring across 20 categories and 248+ data points.
- **Authentication:** Replit OIDC with Passport.js; new users get an organization on first login.
- **Role-Based Access:** `requireRole()` middleware for permission enforcement.
- **AI Services:** OpenAI GPT-4o for various analytical and generative tasks.
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

**Deployment & Build Strategy:**
- **Platform:** Replit Autoscale, custom domain `vaughnmartin.com`.
- **Build:** Frontend and server bundles pre-built and committed to the repo.
- **Server Startup:** HTTP server starts immediately, serving static assets before asynchronous initialization.
- **Startup Migrations:** `CREATE TABLE IF NOT EXISTS` for key tables on every boot.
- **Playbook Enrichment Seed:** Seeds enriched playbook content from JSON on every boot.
- **Route Ordering:** Specific named routes registered before parameterized catch-all routes.

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend