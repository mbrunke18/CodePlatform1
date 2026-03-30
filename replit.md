# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform designed for Fortune 1000 companies. Its primary purpose is to automate project creation, task assignment, document staging, and budget allocation, enabling a 12-minute response to strategic triggers. The platform leverages AI for trigger monitoring and integrates 170 strategic playbooks across 9 domains within its proprietary IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE). It fosters a human-AI partnership, where AI handles monitoring and recommendations, and human executives retain final decision-making authority. The project's vision is to become "The Execution Infrastructure Enterprises Are Missing," aiming to make enterprises "Fearless" by targeting C-suite executives and boards.

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
- **Branding:** Consistent VaughnMartin and Execution OS branding with a circular seal logo (gold gradient rings, 8 tick marks, "VAUGHNMARTIN" / "EXECUTION OS" text, VM monogram). Variants: `full` | `icon-only` | `text-only`. Logos use a gold gradient ring.
- **Navigation:** Three synchronized navigation systems: `HomepageNav` (flat links, homepage only), `StandardNav` (dropdown-based, all other pages), and `IDEASidebar` (accordion, authenticated platform view).
- **Layout:** All pages are wrapped by a `PageLayout` component including `StandardNav` and `Footer`.
- **Homepage:** Focuses on 12-minute execution, IDEA Framework, and research-backed validation, with a specific, unchangeable section order.

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form + Zod, Framer Motion.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) with Drizzle ORM.
- **Real-time:** Socket.IO WebSocket server.
- **Microsoft Ecosystem:** Integration with Microsoft Teams, Azure OpenAI, Copilot Studio, and Microsoft Entra.
- **AI Services:** Primarily Azure OpenAI, with fallback to OpenAI GPT-4o, utilizing a multi-agent IDEA Framework.
- **Authentication:** Replit OIDC with Passport.js, creating organizations for new users.
- **Role-Based Access:** `requireRole()` middleware for permissions.
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.

**Feature Specifications:**
- **Core Platform:** Playbook Library (170 playbooks), Demo Experience, Execution Intelligence Dashboard, Investor Gate, admin views.
- **AI-Powered Execution:** AI Execution Briefs, Live War Room, Post-Activation Debriefs with performance scores and AI recommendations.
- **Automation & Simulation:** Auto-Task Seeding, embeddable Workspace Pages, Guided Start Experience, Shadow Strategy Simulator (Digital Twin).
- **IDEA Framework:** Full Trigger → Playbook IDEA Chain for detecting triggers and recommending playbooks.
- **Task Management:** Task Acknowledgment & Audit Trail with action buttons.
- **Reporting & Analytics:** Execution History Dashboard with KPIs and activation logs.
- **Flagship Playbooks:** 14 enriched playbooks with expert content, task owners, time targets, and decision gates.
- **Configuration Wizards:** Trigger Configuration Wizard for setting up situations and playbook mapping.
- **Key Differentiators:** Execution ROI Dashboard, Compound Threat Intelligence, Strategic Recorder, War Room Pulse Map.
- **Data Consistency:** Strict adherence to consistent values for response time (12 minutes), execution head start (3,600×, labeled "3,600× Execution Head Start"), number of playbooks (170), signals, data points (248+), and triggers (221).
- **Personalized ROI Calculator:** Homepage section calculating annual value, exec time saved, and revenue protected.
- **12-Minute Test Drive:** A public 4-step sequential experience simulating execution.
- **Live Signal Detection:** Real RSS ingestion from 8 sources, `SignalEvaluationService` scores signals against 16 trigger patterns, creating `trigger_detections` and sending Slack/email alerts when confidence ≥ 72%. Includes a `LiveDetectionFeed` page and Stakeholder Contact Registry.
- **Magic Link Authentication:** `/request-access` form for branded magic link login, creating tracked user identities.
- **Growth Segment:** Permanent product track targeting SMBs and PE-backed startups with three tiers: Ready, Responsive, Orchestrated, based on deployment scope (not discounted products or per-seat pricing).

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Authentication:** Replit OIDC
- **Email:** Resend