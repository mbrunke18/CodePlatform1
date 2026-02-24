# ExecuteIQ - Strategic Execution OS

## Overview
ExecuteIQ is a Strategic Execution OS for Fortune 1000 companies, designed to enhance strategic execution by integrating AI-driven trigger monitoring and an extensive library of 170 strategic playbooks. It aims to eliminate the time organizations spend organizing after strategic events by automating project creation, task assignment, document staging, and budget allocation within 12 minutes of a trigger. Operating on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), ExecuteIQ fosters a human-AI partnership, positioning itself as "The Execution Infrastructure Enterprises Are Missing" to accelerate execution, save time, and reduce costs in strategic initiatives.

## User Preferences
- Preferred communication style: Simple, everyday language
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision of human-AI partnership for strategic velocity
- Executive professional language required across UI/UX

## System Architecture
ExecuteIQ is built around the IDEA Framework (IDENTIFY, DETECT, EXECUTE, ADVANCE), promoting human-AI collaboration where AI handles monitoring, pattern detection, recommendations, and continuous learning, while human executives retain ultimate decision-making authority.

**UI/UX Decisions:**
- **Design:** Modern, enterprise-grade interface prioritizing decision velocity and seamless human-AI interaction.
- **Theme:** Default is fully light mode (warm ivory `#F0EDE4`). Dark mode supported via localStorage. All page sections forced to ivory in light mode; only nav/footer (`bg-poise-navy`) intentionally remain dark. Light text classes (text-white, text-slate-100–300) converted to dark navy in light mode; restored to white only inside `bg-poise-navy` containers.
- **Navigation:** Streamlined 5-item navigation with a "More" dropdown. Calls to action are "Try Demo" and "Start Pilot."
- **Branding:** Company = VaughnMartin, Product = Execution OS (formerly ExecuteIQ). Logo icon is a forward-pointing arrow with trailing lines. Wordmark stacks "EXECUTION" over "OPERATING SYSTEM". VaughnMartinLogo uses ascending double-V icon with Cormorant Garamond wordmark.
- **Layout:** `PageLayout` component for consistent `StandardNav` header and `Footer`.
- **Design System:** Robust design system with over 60 utility classes.
- **Homepage:** Features a cinematic video introduction, AI era positioning, "ExecuteIQ at a Glance" detailing capabilities and metrics, and a research-backed trust bar.
- **Strategy Execution Dashboard:** Provides insights into transformation progress, orchestration health score, anticipation insights, and generates executive intelligence reports.
- **Pilot Demo:** Live proof-of-concept demonstrating the full trigger-to-execution loop with real email notifications, a command center timeline, and pre-built trigger scenarios and playbooks.

**Technical Implementations & Feature Specifications:**
- **IDEA Framework Phases:**
    - **IDENTIFY (ExecuteIQ Playbook™):** Build and customize strategic playbooks from 170 templates across 9 strategic domains.
    - **DETECT (ExecuteIQ Signal™):** AI-powered pattern matching, competitive intelligence aggregation, early warning dashboards, and human-triggered playbook activation.
    - **EXECUTE (ExecuteIQ Compass™):** Orchestrates coordinated responses within 12 minutes, leveraging pre-approved budgets and enterprise integrations, managed via a Command Center.
    - **ADVANCE (ExecuteIQ Retrospect™):** Facilitates institutional learning by capturing outcomes, conducting AI-powered analysis, and suggesting playbook refinements.
- **Strategic Domains:** Covers 9 domains: OFFENSE (Market Entry, M&A, Product Launch), DEFENSE (Crisis, Cyber, Regulatory), and SPECIAL TEAMS (Digital Transformation, Competitive Response, AI Governance), comprising 170 playbooks.
- **Execution Plan Sync & Integration Architecture:** Employs an `ExecutionPlanSyncService` for bi-directional synchronization, a `DocumentTemplateEngine` for auto-generating documents, and a `FileExportService`.
- **Authentication:** Replit OIDC integration with session management via PostgreSQL.
- **New User Journey:** A 7-step guided onboarding experience.
- **Enterprise Task Library:** A library of 42 pre-defined tasks categorized by IDEA phases and 9 functional areas for rapid playbook setup.
- **Executive Summary Generator:** One-click AI-powered executive report generation for 4 report types (Strategic Overview, Crisis Readiness, Competitive Intelligence, Transformation Progress). Configurable by industry/org/timeframe.

**System Design Choices:**
- **Frontend**: React 18, TypeScript, Vite, Radix UI, shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM.
- **Authentication**: Replit OIDC with Passport.js and Express sessions.
- **Real-time**: Socket.IO WebSocket server.
- **AI Services**: OpenAI GPT-4o.
- **Key Constants:** Centralized constants for branding, leadership capabilities, IDEA phases, strategic domains, timing benchmarks, and UI elements.

## External Dependencies
- **AI Services**: OpenAI GPT-4o
- **Database Services**: Neon PostgreSQL
- **Authentication**: Replit OIDC
- **Enterprise Integrations**: Salesforce, HubSpot, ServiceNow, Jira, Slack, Microsoft Teams, Google Workspace, Outlook/Exchange, AWS CloudWatch, Workday, Okta, Microsoft Active Directory