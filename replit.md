# ExecuteIQ - Strategic Execution OS

## Overview
ExecuteIQ is the Strategic Execution OS for Fortune 1000 companies—the orchestration layer that transforms how leaders balance transformation and stability across all 9 strategic domains simultaneously. It eliminates the 20-50 hours organizations spend getting organized after a strategic event hits, bridging the gap between strategic preparation and operational execution through AI-driven trigger monitoring and an extensive library of 166 strategic playbooks across 9 domains. ExecuteIQ integrates with existing tools like Jira, automatically creating projects, assigning tasks, staging documents, and unlocking pre-approved budgets within 12 minutes of a trigger. The platform operates on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), fostering a human-AI partnership where AI recommends and humans make final decisions.

## Core Messaging (Updated Jan 2026)
- **Primary Tagline:** "Execute Decisions at Scale"
- **Extended Tagline:** "Detect Early. Execute Precisely. Advance Strategy."
- **Alternate Taglines:** "Transform strategy into 12-minute execution" | "The orchestration layer for Fortune 1000 leaders"
- **IDEA Framework Tagline:** "That's the IDEA."

## Research-Validated Benchmarks (Jan 2026)
All performance claims are now backed by third-party research:
- **5-10x faster execution** - McKinsey Operating Model Research (organizations with effective operating models)
- **98 days saved** - IBM Cost of a Data Breach 2024 (AI/automation in incident response)
- **$4.88M avg breach cost** - IBM Cost of a Data Breach 2024
- **$2.2M cost savings** - IBM 2024 (organizations using AI extensively in prevention)
- **3.5x faster crisis response** - PagerDuty 2024 (distributed vs centralized crisis management)
- **12 minutes playbook activation** - ExecuteIQ internal capability (time to activate playbook and notify stakeholders)
- **Industry coordination time: 20-72 hours** - Based on enterprise crisis management research

Key principle: Claims use "days to minutes" or "10x faster" language rather than specific multipliers that cannot be directly validated.

## ExecuteIQ Module Naming
The platform uses trademarked module names aligned to the IDEA Framework:
- **ExecuteIQ Playbook™** (IDENTIFY): Build and customize strategic playbooks
- **ExecuteIQ Signal™** (DETECT): AI-powered signal monitoring and detection
- **ExecuteIQ Compass™** (EXECUTE): Coordinated response and execution
- **ExecuteIQ Retrospect™** (ADVANCE): Institutional learning and improvement
- **ExecuteIQ One™** (/mission-control): Single-pane executive overview of strategic readiness and execution status

## Leadership Capabilities (Fisk Leadership Model)
Domains are now grouped into 5 Leadership Capabilities:
- **Foresight** (Anticipate & Shape Markets): Market Entry, Competitive Response
- **Courage** (Bold Bets with Incomplete Data): M&A, Product Launch
- **Agility** (Continuous Reinvention): Digital Transformation, AI Governance
- **Purpose** (Maintain Stakeholder Trust): Regulatory, Crisis Management
- **Orchestration** (Align 9 Domains Simultaneously): Cross-Domain coordination

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
ExecuteIQ operates on the IDEA Framework (IDENTIFY, DETECT, EXECUTE, ADVANCE), facilitating a human-AI partnership where AI handles monitoring, pattern detection, recommendations, and learning, while executives maintain decision-making control.

**UI/UX Decisions:**
- **Design:** Modern, enterprise-grade interface focused on decision velocity and human-AI collaboration.
- **Theme:** Full dark/light mode support with localStorage persistence and WCAG AAA contrast compliance.
- **Navigation:** Simplified 5-item navigation (Why ExecuteIQ, How It Works, Playbooks, ExecuteIQ One™, Pricing) with "More" dropdown for secondary pages. CTAs consolidated to "Try Demo" and "Start Pilot".
- **Branding:** Consistent "ExecuteIQ - Strategic Execution OS" branding with concentric rings icon.
- **Layout:** PageLayout component includes StandardNav header and Footer with full logo + tagline on all pages.
- **Design System:** Established with 60+ utility classes.

**Homepage Executive-Readiness (Jan 2026):**
- **Cinematic Video Intro:** First-time visitors see an immersive cinematic experience that builds excitement for the product value before revealing the full homepage
- **AI Era Positioning:** "Your Employees Have AI. Your Organization Doesn't." with visual cards showing Individual Work (SOLVED), Coordination (BROKEN), With ExecuteIQ (NOW SOLVED)
- **ExecuteIQ at a Glance Section:** Executive summary with 4 capabilities (Monitor, Activate, Orchestrate, Learn) and 4 key metrics (10x faster, 12 min activation, 166 playbooks, 98 days saved)
- **Research-backed Trust Bar:** IBM 2024 ($4.88M breach cost, 98 days saved), McKinsey (5-10x faster), PagerDuty (3.5x crisis response) citations
- **Skip Option:** Users can skip the intro via button in bottom-right corner

**Strategy Execution Dashboard (NEW):**
- **Transformation Progress:** Quarterly playbook activation stats, strategic goal advancement
- **Orchestration Health Score:** Domain balance, cross-domain coordination, execution velocity
- **Anticipation Insights:** Early signal detection metrics, anticipation window improvement
- **Execution Intelligence Reports:** Monthly/quarterly PDF exports for board presentations

**Pilot Demo (Jan 2026):**
- **Live Proof-of-Concept:** /pilot-demo route with 5-step guided flow demonstrating full trigger→execution loop
- **Real Email Notifications:** Sends actual stakeholder email via SMTP (or simulates if not configured)
- **Command Center Timeline:** Real-time visualization of execution steps with timestamps
- **Trigger Scenarios:** 4 pre-built scenarios (Competitor Launch, Regulatory Change, Market Opportunity, Crisis)
- **Playbook Options:** 4 matching playbooks with task/stakeholder counts and activation times

**Technical Implementations & Feature Specifications:**
- **IDEA Framework Phases:**
    - **IDENTIFY (ExecuteIQ Playbook™):** Build and customize playbooks from 166 templates across 9 strategic domains.
    - **DETECT (ExecuteIQ Signal™):** AI-powered pattern matching, scenario pattern library, competitive intelligence aggregation, early warning dashboards, and human-triggered playbook activation.
    - **EXECUTE (ExecuteIQ Compass™):** Orchestrates 12-minute coordinated responses, utilizing pre-approved budgets and enterprise integrations. Features a Command Center for real-time coordination.
    - **ADVANCE (ExecuteIQ Retrospect™):** Captures outcomes, conducts AI-powered analysis, and suggests playbook refinements for institutional learning.
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
- `shared/constants/framework.ts`: Centralized EXECUTEIQ_BRAND, LEADERSHIP_CAPABILITIES, IDEA_PHASES, STRATEGIC_DOMAINS, TIMING_BENCHMARKS, and UI constants (colors, icons, capabilities for each phase/domain).
- `shared/constants/taskLibrary.ts`: Enterprise Task Library with 42 pre-defined tasks organized by IDEA phases and 9 functional categories (Program Management, Communications, Risk/Compliance, Finance, Technology, HR/Change, Legal, Operations, Strategy).
- `shared/schema.ts`: Database schema with TypeScript interfaces for TriggerCondition, PlaybookTask, DecisionPoint, LessonLearned, StakeholderMapping.
- `client/src/components/ExecuteIQLogo.tsx`: SVG logo component with 3 variants (full, icon-only, text-only), concentric rings icon, and tagline. Supports darkMode prop.
- `attached_assets/executeiq-logo-official.png`: Official PNG logo used in nav and footer.
- `client/src/pages/TaskManagement.tsx`: Task Management page with dual-tab UI for Playbook Tasks and Task Library browsing.

**ExecuteIQ Logo Usage:**
- PNG (`executeiq-logo-official.png`): Main navigation, footer, hero sections
- SVG (`ExecuteIQLogo` component): Dashboard headers (icon-only), internal pages where variants are needed
- Variants: `full` (text + concentric rings + tagline), `icon-only` (concentric rings only), `text-only` (ExecuteIQ text)

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
