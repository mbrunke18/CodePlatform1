# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform for Fortune 1000 companies. It automates project creation, task assignment, document staging, and budget allocation, enabling a 12-minute response to strategic triggers. The platform uses AI for trigger monitoring and integrates 170 strategic playbooks across 9 domains within its proprietary IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE). It promotes a human-AI partnership, with AI handling monitoring and recommendations while human executives make final decisions. The project aims to be "The Execution Infrastructure Enterprises Are Missing," targeting C-suite executives and boards with the tagline "We Make Enterprises Fearless."

## User Preferences
- Preferred communication style: Simple, everyday language
- **LOCKED MESSAGING — NEVER CHANGE:** The 3,600× metric is NOT a generic "speed advantage." The real-world comparison is weeks to months (30 days conservative baseline) vs. 12 minutes. In a Fortune 1000, when a strategic trigger fires, the enterprise spends weeks just to MOBILIZE — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — before execution even begins. Execution OS compresses that entire cycle to 12 minutes. The correct label is always "3,600× Execution Head Start" — never "speed advantage," never "faster." The correct framing is "30 days compressed to 12 minutes." Comparison table entries must NEVER show "0" — use: "Automatic — continuous monitoring," "Pre-staged before the trigger fires," "Pre-staged — 170 playbooks ready," "Automated at trigger point," or "12 minutes after trigger detection." Every instance of this metric on the platform must reflect this framing. The old "340×" and "72 hours" framing is RETIRED.
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
- **Navigation:** Four-section navigation (Product, Experience, Platform, Investors) with a "Situations Hub" and "Investors" dropdown. "How It Works" is a key link.
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
- **Data Consistency Standards:** Strict adherence to consistent values for response time (12 minutes), speed advantage (340x), number of playbooks, signals, data points, and triggers.
- **Personalized ROI Calculator:** Homepage section calculating annual value, exec time saved, and revenue protected based on user inputs.
- **12-Minute Test Drive:** A public 4-step sequential experience simulating execution.
- **War Room Escalate/Delegate Consequences:** Defined consequences for task escalation and delegation.
- **Dynamic Command Center Intelligence:** Rotating intelligence signals, coordination timeline, and live IDEA Framework recommendation cards.
- **Playbook Library Deep Enrichment:** Detailed playbook data including `whyItMatters`, `phaseCount`, `signalSourceCount`, `preApprovedBudget`, `priority`.
- **Living Playbooks Connected Data:** Displays top 6 playbooks sorted by severity, with activation counts, success rates, and AI improvement narratives.
- **IDEAFramework Stats Bar:** Platform statistics bar displaying key numbers.
- **ExecutionGapDiagram:** SVG comparison diagram (72 hrs vs 12 min) with proof numbers.
- **ExecutionProcessDiagram:** SVG 3-layer process diagram (Strategic → Orchestration → Delivery Systems) on the "How It Works" page.
- **ExecutionOSMicrosoftDiagram:** SVG 3-layer architecture diagram illustrating Execution OS orchestrating the Microsoft stack.
- **EcosystemDiagramPage:** Standalone page (`/ecosystem`) detailing Microsoft integration.
- **How It Works page:** Features diagrams and sections on the process from onboarding to ongoing value.

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