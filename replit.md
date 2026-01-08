# POISE - Strategic Execution OS

## Overview
POISE is the Strategic Execution OS for Fortune 1000 companies, designed to eliminate the 20-50 hours organizations spend getting organized after a strategic event hits. It bridges the gap between strategic preparation and operational execution by leveraging AI-driven trigger monitoring and an extensive library of 166 strategic playbooks across 9 domains. POISE integrates with existing tools like Jira, automatically creating projects, assigning tasks, staging documents, and unlocking pre-approved budgets within 12 minutes of a trigger. The platform operates on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), fostering a human-AI partnership where AI recommends and humans make final decisions.

## Core Messaging (Updated Jan 2026)
- **Primary Tagline:** "Composure in every decision."
- **Extended Tagline:** "Calm, Precise, Instant Execution"
- **Alternate Taglines:** "Adapt at the Speed of Change" | "Your Employees Have AI. Your Organization Doesn't."
- **IDEA Framework Tagline:** "That's the IDEA."

## POISE Module Naming
The platform uses trademarked module names aligned to the IDEA Framework:
- **POISE Playbook™** (IDENTIFY): Build and customize strategic playbooks
- **POISE Signal™** (DETECT): AI-powered signal monitoring and detection
- **POISE Compass™** (EXECUTE): Coordinated response and execution
- **POISE Retrospect™** (ADVANCE): Institutional learning and improvement
- **POISE One™** (Optional): Single-pane executive view

## Brand Colors
- **Primary (Dark Navy):** #1A2B3D
- **Accent Gold:** #D4AF37
- **Accent Teal:** #00A8A8
- **Text Light:** #FFFFFF
- **Text Muted:** #94A3B8

## User Preferences
- Preferred communication style: Simple, everyday language
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision of human-AI partnership for strategic velocity
- Executive professional language required across UI/UX

## System Architecture
POISE operates on the IDEA Framework (IDENTIFY, DETECT, EXECUTE, ADVANCE), facilitating a human-AI partnership where AI handles monitoring, pattern detection, recommendations, and learning, while executives maintain decision-making control.

**UI/UX Decisions:**
- **Design:** Modern, enterprise-grade interface focused on decision velocity and human-AI collaboration.
- **Theme:** Full dark/light mode support with localStorage persistence and WCAG AAA contrast compliance.
- **Navigation:** Simplified 4-item navigation (Why POISE, How It Works, Playbooks, Pricing) with "More" dropdown for secondary pages. CTAs consolidated to "Try Demo" and "Start Pilot".
- **Branding:** Consistent "POISE - Strategic Execution OS" branding with compass needle logo.
- **Design System:** Established with 60+ utility classes.

**Homepage Executive-Readiness (Jan 2026):**
- **Cinematic Video Intro:** First-time visitors see an immersive cinematic experience that builds excitement for the product value before revealing the full homepage
- **AI Era Positioning:** "Your Employees Have AI. Your Organization Doesn't." with visual cards showing Individual Work (SOLVED), Coordination (BROKEN), With POISE (NOW SOLVED)
- **POISE at a Glance Section:** Executive summary with 4 capabilities (Monitor, Activate, Orchestrate, Learn) and 4 key metrics (340X faster, 12 min, 166 playbooks, 10.3% revenue impact)
- **Research-backed Trust Bar:** IBM/Ponemon ($4.88M breach cost), McKinsey (340X faster), BAI 2025 (10.3% growth) citations
- **Skip Option:** Users can skip the intro via button in bottom-right corner

**Pilot Demo (Jan 2026):**
- **Live Proof-of-Concept:** /pilot-demo route with 5-step guided flow demonstrating full trigger→execution loop
- **Real Email Notifications:** Sends actual stakeholder email via SMTP (or simulates if not configured)
- **Command Center Timeline:** Real-time visualization of execution steps with timestamps
- **Trigger Scenarios:** 4 pre-built scenarios (Competitor Launch, Regulatory Change, Market Opportunity, Crisis)
- **Playbook Options:** 4 matching playbooks with task/stakeholder counts and activation times

**Technical Implementations & Feature Specifications:**
- **IDEA Framework Phases:**
    - **IDENTIFY (POISE Playbook™):** Build and customize playbooks from 166 templates across 9 strategic domains.
    - **DETECT (POISE Signal™):** AI-powered pattern matching, scenario pattern library, competitive intelligence aggregation, early warning dashboards, and human-triggered playbook activation.
    - **EXECUTE (POISE Compass™):** Orchestrates 12-minute coordinated responses, utilizing pre-approved budgets and enterprise integrations. Features a Command Center for real-time coordination.
    - **ADVANCE (POISE Retrospect™):** Captures outcomes, conducts AI-powered analysis, and suggests playbook refinements for institutional learning.
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
- `shared/constants/framework.ts`: Centralized POISE_BRAND, IDEA_PHASES, STRATEGIC_DOMAINS, TIMING_BENCHMARKS, and UI constants (colors, icons, capabilities for each phase/domain).
- `shared/constants/taskLibrary.ts`: Enterprise Task Library with 42 pre-defined tasks organized by IDEA phases and 9 functional categories (Program Management, Communications, Risk/Compliance, Finance, Technology, HR/Change, Legal, Operations, Strategy).
- `shared/schema.ts`: Database schema with TypeScript interfaces for TriggerCondition, PlaybookTask, DecisionPoint, LessonLearned, StakeholderMapping.
- `client/src/assets/poise-logo.png`: POISE logo with compass needle integrated into the "I"
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

## Production Readiness (Jan 2026)

### Security Measures Implemented
- **Helmet Security Headers**: CSP, XSS protection, frame guards, HSTS
- **API Rate Limiting**: 1000 requests/15min for general API, 20 requests/15min for auth endpoints
- **CORS Configuration**: Restricted to allowed Replit domains in production
- **Request Size Limits**: 10MB max payload
- **Sensitive Data Redaction**: Passwords, emails, API keys, tokens redacted from logs
- **Session Security**: HTTP-only, secure cookies with PostgreSQL session store

### Deployment Configuration
- **Deployment Type**: Autoscale (recommended for variable traffic)
- **Health Checks**: `/health` and `/_health` endpoints return 503 until seeding complete
- **Database**: Separate development and production databases (Replit-managed)

### Environment Variables Required
**Secrets (already configured):**
- `SESSION_SECRET` - Express session encryption
- `DATABASE_URL` - PostgreSQL connection string
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API access

**Optional for Analytics:**
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 tracking ID (format: G-XXXXXXXXXX)

### Database Seeding Strategy
The application auto-seeds on startup:
1. **Playbook Library**: 166 pre-built playbooks across 9 domains (from `server/seeds/playbookLibrarySeed.ts`)
2. **Executive Triggers**: Sample triggers for demo purposes (from `server/seeds/triggersSeed.ts`)
3. **Demo Scenarios**: Interactive demo data (from `server/seeds/demoScenariosSeed.ts`)

For production:
- Seeding runs automatically on first deployment
- Health check returns 503 until seeding completes (prevents empty database traffic)
- To reset, clear database and redeploy

### Custom Domain Setup
1. Purchase domain from registrar (e.g., Namecheap, GoDaddy, Cloudflare)
2. In Replit: Publishing → Settings → Custom Domain
3. Add DNS records as instructed:
   - CNAME record pointing to your `.replit.app` domain
   - Or A/AAAA records as provided
4. Wait for SSL certificate provisioning (automatic)

### Monitoring
- **Replit Dashboard**: Publishing → Monitoring for metrics and logs
- **Application Logs**: Structured JSON logging with Pino
- **Audit Trail**: All API requests logged with timing and response codes
