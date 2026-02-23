# ExecuteIQ - Strategic Execution OS

## Overview
ExecuteIQ is the Strategic Execution OS for Fortune 1000 companies, designed to transform how leaders balance transformation and stability across 9 strategic domains simultaneously. It streamlines strategic execution by eliminating the extensive time organizations spend getting organized after a strategic event. The platform utilizes AI-driven trigger monitoring and an extensive library of 166 strategic playbooks. ExecuteIQ integrates with existing tools like Jira, automating project creation, task assignment, document staging, and budget allocation within 12 minutes of a trigger. It operates on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), fostering a human-AI partnership where AI recommends and humans make final decisions. ExecuteIQ aims to be "The Execution Infrastructure Enterprises Are Missing," accelerating execution, saving time, and reducing costs in strategic initiatives.

## User Preferences
- Preferred communication style: Simple, everyday language
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision of human-AI partnership for strategic velocity
- Executive professional language required across UI/UX

## System Architecture
ExecuteIQ is built around the IDEA Framework (IDENTIFY, DETECT, EXECUTE, ADVANCE), promoting a human-AI collaboration where AI handles monitoring, pattern detection, recommendations, and continuous learning, while human executives retain ultimate decision-making authority.

**UI/UX Decisions:**
- **Design:** A modern, enterprise-grade interface prioritizing decision velocity and seamless human-AI interaction.
- **Theme:** Supports both dark and light modes with localStorage persistence and WCAG AAA contrast compliance.
- **Navigation:** Features a streamlined 5-item navigation with a "More" dropdown for secondary pages. Calls to action are consolidated to "Try Demo" and "Start Pilot."
- **Branding:** Consistent "ExecuteIQ - Strategic Execution OS" branding, featuring a concentric rings icon.
- **Layout:** A `PageLayout` component ensures a consistent `StandardNav` header and `Footer` across all pages.
- **Design System:** Utilizes a robust design system with over 60 utility classes.
- **Homepage:** Features a cinematic video introduction, AI era positioning, an "ExecuteIQ at a Glance" section detailing capabilities and key metrics, and a research-backed trust bar.
- **Strategy Execution Dashboard:** Provides insights into transformation progress, an orchestration health score, anticipation insights, and generates executive intelligence reports.
- **Pilot Demo:** A live proof-of-concept demonstrating the full trigger-to-execution loop with real email notifications, a command center timeline, and pre-built trigger scenarios and playbooks.

**Technical Implementations & Feature Specifications:**
- **IDEA Framework Phases:**
    - **IDENTIFY (ExecuteIQ Playbook™):** Enables building and customizing strategic playbooks from 166 templates across 9 strategic domains.
    - **DETECT (ExecuteIQ Signal™):** Provides AI-powered pattern matching, competitive intelligence aggregation, early warning dashboards, and human-triggered playbook activation.
    - **EXECUTE (ExecuteIQ Compass™):** Orchestrates coordinated responses within 12 minutes, leveraging pre-approved budgets and enterprise integrations, managed via a Command Center.
    - **ADVANCE (ExecuteIQ Retrospect™):** Facilitates institutional learning by capturing outcomes, conducting AI-powered analysis, and suggesting playbook refinements.
- **Strategic Domains:** Covers 9 domains, categorized into OFFENSE (Market Entry, M&A, Product Launch), DEFENSE (Crisis, Cyber, Regulatory), and SPECIAL TEAMS (Digital Transformation, Competitive Response, AI Governance), comprising 166 playbooks. The AI Governance domain includes 18 playbooks and a Foundational AI Principles Framework.
- **Execution Plan Sync & Integration Architecture:** Employs an `ExecutionPlanSyncService` for bi-directional synchronization with various project management tools, a `DocumentTemplateEngine` for auto-generating documents, and a `FileExportService` for multiple file formats.
- **Authentication:** Uses Replit OIDC integration with session management via PostgreSQL.
- **New User Journey:** A 7-step guided onboarding experience.

**System Design Choices:**
- **Frontend**: React 18, TypeScript, Vite, Radix UI, shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM.
- **Authentication**: Replit OIDC with Passport.js and Express sessions.
- **Real-time**: Socket.IO WebSocket server.
- **AI Services**: OpenAI GPT-4o.
- **Key Constants:** Centralized constants for branding, leadership capabilities, IDEA phases, strategic domains, timing benchmarks, and UI elements.
- **Enterprise Task Library:** A library of 42 pre-defined tasks categorized by IDEA phases and 9 functional areas, designed for rapid playbook setup and ensuring immediate execution readiness with predetermined stakeholders and tasks.

## Recent Changes (Feb 2026)
- **Major codebase cleanup**: Removed 5 dead scenario/playbook pages, archive folder, deprecated EnterpriseNavigation, 4 unused homepage components, 3 unused execution components, 12 unused demo components, 10 unused server services, 3 orphaned navigation files, empty __tests__ directory
- **Route consolidation**: App.tsx reduced from 643 to 483 lines. Replaced 7 individual redirect components with a single generic Redirect. Grouped duplicate routes with renderRoutes/renderRedirects helpers. Removed 10+ unused page imports.
- **Performance**: Added lazy loading (React.lazy + Suspense) for 100+ secondary pages. Only 12 critical pages (Homepage, HowItWorks, TryDemo, key Experience features) load eagerly. Added PageLoader spinner for loading state.
- Navigation config (config.ts, types.ts) retained in client/src/navigation/ as they're actively used by IDEASidebar/IDEALayout
- iconRenderer.tsx updated to define IconName type locally
- Enhanced What-If Analyzer with clickable department chips and preset buttons
- Added Enterprise Integration section to Homepage
- Added zero-disruption integration differentiator to How It Works page
- **Positioning refinement**: Homepage hero leads with "Trigger-to-Execution Orchestration" and "From Trigger to Coordinated Execution In 12 Minutes" as primary message
- **Quantified value metrics**: Added 4 key metrics (72hrs→12min, 70% faster mobilization, 50% less decision latency, $2.4M avg savings) to Homepage hero stats bar
- **12-minute clarification**: Added "12 minutes = trigger-to-coordinated-execution. Deploy ExecuteIQ itself in weeks, not months" distinction
- **Playbook credibility**: Added maturity ratings (Battle-Tested/Mission-Critical/Innovation-Ready), outcome scores, and validated-by indicators to PlaybookLibraryV2 category cards and individual playbook cards
- **Data moat (ADVANCE phase)**: Updated ADVANCE descriptions across Homepage and HowItWorks to emphasize proprietary intelligence layer, cross-domain pattern detection, outcome benchmarking, and compounding competitive moat
- **Enterprise auth roadmap**: Added Enterprise SSO & IAM card (Azure AD, Okta, Ping Identity, SAML 2.0, OIDC) to Homepage integration section and Enterprise-Grade Security differentiator to HowItWorks
- **Agentic execution layer positioning**: Added "Agentic Execution Layer" stack positioning to HowItWorks (vertical stack diagram showing strategy→ExecuteIQ→workflow→operational layers), WhyExecuteIQ (workflow tools vs agentic comparison + decision authority spectrum: Assist→Coordinate→Execute→Decide), and InvestorLanding (architectural thesis with agent type cards + hero tagline update to "The Agentic Execution Layer for Fortune 1000")
- **Investor Pitch Deck rebuild**: Complete rebuild of InvestorPresentation.tsx with 15-slide pitch deck matching Deck 2 content. Full-screen slides with keyboard navigation, slide counter, fullscreen mode. Covers: Problem, Cost, IDEA Framework, Transformation, Playbooks, Market ($13-20B TAM), Competition, Business Model ($250K-$1.5M tiers), Traction, Team, GTM, Financials ($100M+ ARR Y5), The Ask ($2M pre-seed). Added "Pitch Deck" link to Investors navigation dropdown.
- **Navigation consolidation**: Consolidated StandardNav from 7 dropdowns (Product, Solutions, Experience, Demos, Platform, Investors, Intelligence) to 4 focused dropdowns (Product, Experience, Platform, Investors). Product uses sectioned dropdown with Understand/Capabilities/Explore headers. Experience uses sectioned dropdown with AI Tools/Live Demos headers. Platform and Investors use flat dropdowns. Eliminated duplicate entries (Industry Demos, What-If Analyzer). Intelligence items moved to Product (Capabilities) and Platform. Mobile menu updated to match.
- **Canonical demo path**: All /scenario-demo references replaced with /try-demo across 12+ files. Added /scenario-demo and /ultimate-demo redirects. Fixed homepage bottom CTA broken link.
- **War Room consolidation**: Removed "War Room" from Platform nav. /war-room now redirects to /command-center. ExecuteIQ One™ (MissionControl) remains the primary hub, Command Center remains the live execution view.
- **Homepage validation section**: Restored all 15 research quotes (IBM, Bain, BCG, McKinsey, Accenture, Forrester, Anthropic, OpenAI, Deloitte, Microsoft, Google Cloud, WEF, PwC, Gartner, IDC) with smart expandable layout—top 6 shown prominently, remaining 9 revealed via "See All 15 Research Findings" button. All 15 firm pills displayed. Closing tagline: "15 independent reports. One conclusion: ExecuteIQ is what they're describing."
- **12-minute proof point**: Added visual timeline breakdown to HowItWorks page showing 7-step execution sequence (0:00 Trigger → 0:30 Playbook Match → 1:00 Notification → 3:00 Acknowledge → 5:00 Tasks Assigned → 8:00 Budget Released → 12:00 Full Execution). Uses vertical timeline with color-coded dots and gradient connector.
- **Product depth enhancement (sales-readiness sweep)**: Comprehensive enhancements across 10+ pages for road-show readiness:
  - **ROI Calculator**: Added executive summary with dynamic industry/size-aware copy, industry benchmarks comparison table, shareable results buttons, and full CTA section with Founding Partner Pilot promotion
  - **Readiness Assessment**: Added industry benchmark comparison bars (Fortune 500 avg vs ExecuteIQ clients), "How ExecuteIQ Closes These Gaps" IDEA framework section, and personalized next-step CTA based on score
  - **IDEA Workspace hubs (4 pages)**: WorkspaceIdentify added Recent Playbook Activity, WorkspaceDetect added Live Signal Feed with severity indicators, WorkspaceExecute added Active Executions with progress bars, WorkspaceAdvance added Recent Learnings with confidence bars
  - **Institutional Memory**: Added Execution Performance Trend chart (6-month improvement visualization) and Playbooks Improved From Learnings tracker with version history
  - **Board Briefings**: Added Decisions Requiring Board Action (priority-coded pending decisions) and AI-Generated Strategic Recommendations with confidence scores
  - **Practice Drills**: Added Drill Scoring Breakdown (5 criteria with progress bars) and Team Performance Comparison (4 teams with trend indicators)
  - **Pricing**: Added comprehensive Feature Comparison Matrix (18 features across 6 categories comparing Enterprise/Enterprise Plus/Global tiers)
  - **Stakeholder Management**: Added Engagement Analytics (response time, reach, participation), Communication Timeline (5 recent events), and RACI Matrix visualization (6 stakeholders × 4 playbooks)
- **Demo consolidation**: Consolidated 22+ demo pages into one primary "Try Demo" path. Nav "Live Demos" reduced from 5 links to 1 ("Try Demo"). Footer "Experience" cleaned up (removed "Ultimate Demo"). Added "See It In Your Industry" section at bottom of TryDemo with 9 industry scenario cards. Redirected 15+ legacy demo routes (investor-demo, customer-demo, keynote, executive-simulation, sandbox-demo, pilot-demo, demo-gallery, deal-risk-demo, live-activation, etc.) to /try-demo. Industry-specific demos (luxury, financial, pharma, manufacturing, retail, energy, lvmh, shein, spacex) remain accessible from TryDemo page. Removed unused lazy imports from App.tsx.
- **Metaruptions integration (Feb 2026)**: Integrated Disruptive Futures Institute's Metaruptions framework across 4 pages:
  - **Homepage**: Updated hero sub-text ("better predictions won't save you, better response infrastructure will"), added "From Prediction to Preparation" paradigm shift section with Old Model vs New Model comparison, AAA→IDEA framework mapping (Anticipatory→IDENTIFY, Agile→DETECT+EXECUTE, Antifragile→ADVANCE)
  - **How It Works**: Updated hero subtitle with metaruptions positioning, added "Built for Compound Disruption" section with 4 compound disruption scenarios (Cyber+Regulatory, Geopolitical+Supply Chain, Climate+Operations, AI+Workforce) and AAA→IDEA framework mapping
  - **Investor Presentation**: Added "Paradigm Shift" slide (From Prediction to Preparation with Dead Model vs ExecuteIQ Model), updated "Why Now?" with metaruptions framing, updated totalSlides to 17, fixed DECIDE→DETECT in IDEA Framework slide
  - **Playbook Library**: Added Compound Disruption Response callout section with 4 multi-domain coordination scenarios and cross-domain activation messaging

## External Dependencies
- **AI Services**: OpenAI GPT-4o
- **Database Services**: Neon PostgreSQL
- **Authentication**: Replit OIDC
- **Enterprise Integrations**: Salesforce, HubSpot, ServiceNow, Jira, Slack, Microsoft Teams, Google Workspace, Outlook/Exchange, AWS CloudWatch, Workday, Okta, Microsoft Active Directory