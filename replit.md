# M - Strategic Execution Operating System

## Overview
M is the Strategic Execution Operating System for Fortune 1000 companies, designed to eliminate the 20-50 hours organizations spend getting organized after a strategic event hits. It bridges the gap between strategic preparation and operational execution by leveraging AI-driven trigger monitoring and an extensive library of 166 strategic playbooks across 9 domains. M integrates with existing tools like Jira, automatically creating projects, assigning tasks, staging documents, and unlocking pre-approved budgets within 12 minutes of a trigger. The platform operates on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), fostering a human-AI partnership where AI recommends and humans make final decisions. Its core value proposition is to enable organizations to "Adapt at the Speed of Change" by providing a coordinated response capability for any strategic event.

## Core Messaging (Updated Dec 2025)
- **Primary Tagline:** "Adapt at the Speed of Change."
- **Secondary Tagline:** "The world won't wait for you to coordinate."
- **AI Era Headline:** "Your Employees Have AI. Your Organization Doesn't."
- **IDEA Framework Tagline:** "That's the IDEA."

## AI Era Positioning
- **Primary AI Value Proposition:** "AI Made Your Team 10X Faster. Your Coordination Speed Didn't Change. M Platform fixes that."
- **AI Coordination Gap:** Individual work is solved (10X faster with AI), but organizational coordination is still broken (same speed). M Platform solves coordination at AI speed.
- **Key Insight:** "AI made the work faster. M Platform makes the COORDINATION faster. That's where 95% of the time is wasted."
- **Three Corporate AI Angles:**
  1. AI Governance: 18 pre-built playbooks for AI governance (model deployment, bias incidents, vendor assessment)
  2. AI Productivity Gap: Bridge individual AI productivity to organizational AI productivity
  3. AI-Native Operations: Move from AI for tasks to AI for coordination

## User Preferences
- Preferred communication style: Simple, everyday language
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision of human-AI partnership for strategic velocity
- Executive professional language required across UI/UX

## System Architecture
M operates on the IDEA Framework (IDENTIFY, DETECT, EXECUTE, ADVANCE), facilitating a human-AI partnership where AI handles monitoring, pattern detection, recommendations, and learning, while executives maintain decision-making control.

**UI/UX Decisions:**
- **Design:** Modern, enterprise-grade interface focused on decision velocity and human-AI collaboration.
- **Theme:** Full dark/light mode support with localStorage persistence and WCAG AAA contrast compliance.
- **Navigation:** Sidebar with collapsible 4-phase sections for platform pages and a light topbar for marketing pages.
- **Branding:** Consistent "M - Strategic Execution Operating System" branding.
- **Design System:** Established with 60+ utility classes.

**Technical Implementations & Feature Specifications:**
- **IDEA Framework Phases:**
    - **IDENTIFY:** Build and customize playbooks from 166 templates across 9 strategic domains.
    - **DETECT:** AI-powered pattern matching, scenario pattern library, competitive intelligence aggregation, early warning dashboards, and human-triggered playbook activation.
    - **EXECUTE:** Orchestrates 12-minute coordinated responses, utilizing pre-approved budgets and enterprise integrations. Features a Command Center for real-time coordination.
    - **ADVANCE:** Captures outcomes, conducts AI-powered analysis, and suggests playbook refinements for institutional learning.
- **9 Strategic Domains:** Encompassing OFFENSE (Market Entry, M&A, Product Launch), DEFENSE (Crisis, Cyber, Regulatory), and SPECIAL TEAMS (Digital Transformation, Competitive Response, AI Governance), with a total of 166 playbooks.
- **AI Governance Domain:** Includes 18 playbooks covering AI-specific risks and a Foundational AI Principles Framework with 9 core principles.
- **Execution Plan Sync & Integration Architecture:**
    - `ExecutionPlanSyncService`: Bi-directional sync engine with adapters for Jira, Asana, Monday.com, MS Project, and ServiceNow, supporting idempotent task mapping and conflict resolution.
    - `DocumentTemplateEngine`: Auto-generates execution documents.
    - `FileExportService`: Exports to DOCX, PDF, Markdown, XLSX, CSV, and MS Project XML.
    - `CredentialEncryptionService`: AES-256-GCM encryption for OAuth credentials.
- **Authentication:** Replit OIDC integration with session management via PostgreSQL.
- **Dashboard Metrics:** Live metrics for active scenarios, teams, and performance.
- **New User Journey:** A 7-step guided onboarding experience.
- **Demos:** Includes a Transformational Demo with a ChaosSimulator, InteractiveDecisionPoint, and OrganizationReadinessScore.

**System Design Choices:**
- **Frontend**: React 18, TypeScript, Vite, Radix UI, shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM.
- **Authentication**: Replit OIDC with Passport.js and Express sessions.
- **Real-time**: Socket.IO WebSocket server.
- **AI Services**: OpenAI GPT-4o.

**Key Files & Constants:**
- `shared/constants/framework.ts`: Centralized IDEA_PHASES, STRATEGIC_DOMAINS, TIMING_BENCHMARKS, and UI constants (colors, icons, capabilities for each phase/domain).
- `shared/constants/taskLibrary.ts`: Enterprise Task Library with 42 pre-defined tasks organized by IDEA phases and 9 functional categories (Program Management, Communications, Risk/Compliance, Finance, Technology, HR/Change, Legal, Operations, Strategy).
- `shared/schema.ts`: Database schema with TypeScript interfaces for TriggerCondition, PlaybookTask, DecisionPoint, LessonLearned, StakeholderMapping.
- `client/src/components/ScrollToTop.tsx`: Ensures page navigation scrolls to top.
- `client/src/pages/TaskManagement.tsx`: Task Management page with dual-tab UI for Playbook Tasks and Task Library browsing.

**Enterprise Task Library (Jan 2026):**
- 42 pre-defined enterprise tasks organized by IDEA Framework phases (Identify: 7, Detect: 6, Execute: 18, Advance: 10)
- 9 functional categories for cross-departmental coordination
- Playbooks come pre-loaded with 12 critical tasks ensuring everyone knows their role when triggered
- Phase and category filters for easy task discovery
- "Add all tasks by phase" quick actions for rapid playbook setup
- Duplicate detection via templateId to prevent adding the same task twice
- Key requirement: Playbooks must have predetermined stakeholders and tasks for immediate execution readiness

## External Dependencies
- **AI Services**: OpenAI GPT-4o
- **Database Services**: Neon PostgreSQL
- **Authentication**: Replit OIDC
- **Enterprise Integrations**: Salesforce, HubSpot, ServiceNow, Jira, Slack, Microsoft Teams, Google Workspace, Outlook/Exchange, AWS CloudWatch, Workday, Okta, Microsoft Active Directory