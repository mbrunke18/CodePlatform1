# VaughnMartin Readiness OS - Full Product User Guide
Last updated: 2026-05-18  
Primary source of route truth: `client/src/App.tsx`
---
## 1) Purpose of this document
This is the operational user document for VaughnMartin Readiness OS.  
It is designed to answer, page-by-page:
1. What each page is for
2. What features/functions are available on that page
3. How a user should run the page in practice
4. What result/outcome to expect
This guide is written for:
- Executive sponsors (CEO, COO, Chief of Staff, board-facing leaders)
- Platform admins and operations leaders
- Functional owners (risk, legal, comms, cyber, finance, HR, transformation)
- Demo and sales operators
---
## 2) Operating principles (applies to every page)
1. **AI monitors, executives authorize.**
   - AI identifies, matches, and recommends.
   - Authorization authority remains human.
2. **Readiness Protocols are pre-staged execution architectures.**
   - Trigger logic, owners, task flow, communications, and governance are prepared before events occur.
3. **The platform objective is not "faster chaos."**
   - It is pre-coordinated execution where the mobilization work was completed in advance.
4. **Expected value pattern across the product**
   - Higher decision quality under pressure
   - Reduced coordination lag
   - Better auditability and board-grade evidence
   - Repeatable learning cycle through the ADVANCE phase
---
## 3) Role-based quick starts
### Executive Sponsor (first 30 minutes)
1. `/` (Homepage) -> validate thesis and fit
2. `/how-it-works` -> understand sequence
3. `/mission-control` -> see live operational posture
4. `/board-briefings` -> inspect board-ready output format
5. `/buyer-decision-packet` -> align buy/no-buy decision criteria
**Expected result:** executive clarity on decision authority, adoption value, and proof structure.
### Platform Admin (first 60-90 minutes)
1. `/workspace?tab=identify` -> define priority readiness protocols
2. `/triggers-management` -> define trigger conditions/escalation
3. `/signal-configuration` -> connect signal sources
4. `/integration-hub` and `/integrations` -> wire delivery systems
5. `/practice-drills` -> run dry-run and readiness checks
**Expected result:** first protocol operational path configured end-to-end.
### Functional Lead (first 45 minutes)
1. `/playbook-library` -> select protocol(s) in your domain
2. `/playbook-library/:id` -> review execution logic
3. `/playbooks/:id/customize` -> assign roles/tasks/approvals
4. `/playbook-readiness` -> validate response quality
5. `/execute/war-room` -> understand runtime operating view
**Expected result:** functional ownership and execution role clarity before a live event.
---
## 4) Core lifecycle workflow (how the product is intended to be used)
### Phase A - Prepare
- Configure protocol inventory (`/playbook-library`, `/protocol-builder`)
- Define ownership and escalation (`/playbooks/:id/customize`, `/stakeholders`)
- Set trigger logic and signal feeds (`/triggers-management`, `/signal-configuration`)
**Expected result:** organization has staged response architectures for priority situations.
### Phase B - Detect
- Monitor signal and trend surfaces (`/detect/dashboard`, `/signal-intelligence`, `/live-detection-feed`)
- Review alert quality and routing (`/detect/alerts`, `/detect/history`)
**Expected result:** early signal detection with less manual monitoring burden.
### Phase C - Execute
- Activate from command view (`/mission-control`, `/execute/activation`, `/playbook-command/:id`)
- Coordinate through war-room/task surfaces (`/execute/war-room`, `/task-management`)
- Run stakeholder messaging and role assignment (`/crisis-communications`, `/stakeholder-management`)
**Expected result:** controlled response launch with clear decision authority and coordinated action.
### Phase D - Advance
- Capture outcomes and timing (`/advance/outcomes`, `/execution-history`)
- Analyze effectiveness and governance (`/advance/effectiveness`, `/audit-logging-center`)
- Produce leadership artifacts (`/board-briefings`, `/board-export`, `/preparedness-report`)
**Expected result:** measurable improvement loop and board/audit-ready evidence.
---
## 5) Deep page guides (primary operational pages)
Each deep guide uses the same structure:
- **Purpose**
- **Key features/functionality**
- **How to use**
- **Expected result**
### 5.1 Homepage (`/`)
**Purpose:** establish strategic fit and platform thesis.  
**Key features/functionality:** product thesis, framework framing, conversion CTAs, economic framing entry points.  
**How to use:** validate messaging with your use case; route to `/how-it-works`, `/pricing`, and `/request-access`.  
**Expected result:** stakeholders understand what the product does and why it is differentiated.
### 5.2 How It Works (`/how-it-works`) + How It Executes (`/how-it-executes`)
**Purpose:** explain execution flow from signal -> authorization -> coordinated action.  
**Key features/functionality:** sequence explanations, architecture framing, operational narrative.  
**How to use:** use as pre-demo and pre-procurement explainer for executive and IT audiences.  
**Expected result:** reduced confusion around mechanics and decision rights.
### 5.3 Mission Control (`/mission-control`)
**Purpose:** top-level strategic operating cockpit.  
**Key features/functionality:** situation awareness, activation entry points, cross-domain signal context, execution status awareness.  
**How to use:** review active/pending conditions, choose action path, launch or monitor protocol execution.  
**Expected result:** faster, clearer executive action in live conditions.
### 5.4 Workspace Hub (`/workspace`, tabs for Identify/Detect/Execute/Advance)
**Purpose:** structured IDEA workflow surface.  
**Key features/functionality:** tabbed lifecycle navigation and handoff logic between phases.  
**How to use:** run team cadence by phase (design -> monitor -> execute -> learn).  
**Expected result:** predictable execution lifecycle management.
### 5.5 Identify Pages (`/identify/*`)
**Purpose:** protocol selection, design, and readiness setup.  
**Key features/functionality:** protocol catalog, templates, wizard, SLA and metrics setup, situation intents.  
**How to use:** shortlist priority scenarios, define intent, ownership, and quality criteria.  
**Expected result:** organization-specific readiness protocols are staged with measurable quality standards.
### 5.6 Detect Pages (`/detect/*`)
**Purpose:** continuous monitoring and alert intelligence.  
**Key features/functionality:** signal dashboards, alert queues, threat/trend and historical views.  
**How to use:** review monitoring health, tune alert sensitivity/escalation, validate false-positive rates.  
**Expected result:** better signal-to-noise and earlier decision windows.
### 5.7 Execute Pages (`/execute/*`)
**Purpose:** controlled activation and runtime coordination.  
**Key features/functionality:** war-room view, activation control, task/decision/updates/tracking surfaces.  
**How to use:** authorize action path, execute task orchestration, manage progress and updates.  
**Expected result:** coordinated response with lower coordination friction.
### 5.8 Advance Pages (`/advance/*`)
**Purpose:** post-activation learning and performance optimization.  
**Key features/functionality:** outcomes, effectiveness, team learning, audit trail surfaces.  
**How to use:** review response quality, bottlenecks, and repeatability gaps after events/drills.  
**Expected result:** measurable readiness improvement cycle.
### 5.9 Protocol Library (`/playbook-library`, `/playbooks`, `/business-scenarios`)
**Purpose:** browse and select readiness protocols.  
**Key features/functionality:** library browsing, filtering, protocol detail navigation.  
**How to use:** identify relevant scenario protocol and move into detail/customization.  
**Expected result:** faster protocol discovery and adoption.
### 5.10 Protocol Detail (`/playbook-library/:id`, `/business-scenario/:id`)
**Purpose:** inspect protocol execution blueprint.  
**Key features/functionality:** trigger logic, ownership map, decision chain, execution structure.  
**How to use:** confirm fitness, then route to customize/settings/command.  
**Expected result:** confidence in protocol content before activation.
### 5.11 Protocol Customize (`/playbooks/:id/customize`, `/playbooks/:id/edit`, `/playbooks/create`)
**Purpose:** tailor protocol to org-specific operating model.  
**Key features/functionality:** role assignment, task sequencing, decision authority, communication and governance settings.  
**How to use:** map protocol to real people/systems, validate dependencies and fallback plans.  
**Expected result:** deployable, organization-specific protocol.
### 5.12 Protocol Command (`/playbook-command/:id`, `/identify/playbook-command/:id`)
**Purpose:** execute and monitor an active protocol command surface.  
**Key features/functionality:** runtime controls, status transitions, coordination visibility.  
**How to use:** run activation with leadership and operator roles synchronized.  
**Expected result:** high-control execution instead of fragmented response.
### 5.13 Protocol Builder (`/protocol-builder`)
**Purpose:** create new readiness protocols and custom scenarios.  
**Key features/functionality:** templates, signal/data coverage setup, cadence controls, governance/versioning fields, readiness scorecard, trigger sandbox.  
**How to use:** use template or blank path, define trigger thresholds, assign authority chain, validate via sandbox.  
**Expected result:** net-new protocol can be published with readiness confidence and governance context.
### 5.14 Triggers + Signal Configuration (`/triggers-management`, `/signal-configuration`)
**Purpose:** define monitoring logic and source connectivity.  
**Key features/functionality:** trigger thresholds, signal taxonomy, escalation logic, source-level config.  
**How to use:** tune triggers for actionable fidelity, then verify alert behavior in detect views.  
**Expected result:** trigger system aligned to operational reality (fewer missed signals and fewer noisy alerts).
### 5.15 Practice Drills + Live Drill (`/practice-drills`, `/practice-drills/:drillId/live`)
**Purpose:** build muscle memory before a real event.  
**Key features/functionality:** drill planning/execution, live mode orchestration, performance observations.  
**How to use:** schedule scenario drill, run timed execution, capture lessons and remediation actions.  
**Expected result:** improved readiness and reduced activation friction in real events.
### 5.16 Simulation + Exposure Tools (`/simulation-studio`, `/crisis-exposure-matrix`, `/financial-exposure`, `/concurrent-situations`)
**Purpose:** model risk/opportunity and execution stress before live activation.  
**Key features/functionality:** scenario simulation, exposure quantification, multi-situation coordination views.  
**How to use:** test response alternatives and quantify impact before selecting a path.  
**Expected result:** better decision quality and resource prioritization.
### 5.17 Intelligence Surfaces (`/intelligence-control-center`, `/signal-intelligence`, `/activation-intelligence`, `/live-detection-feed`)
**Purpose:** centralize signal interpretation and readiness posture.  
**Key features/functionality:** intelligence dashboards, signal stream visibility, activation readiness context.  
**How to use:** monitor signal conditions and route potential activations to mission/execute surfaces.  
**Expected result:** continuous intelligence loop with clearer escalation decisions.
### 5.18 Analytics + Governance (`/analytics`, `/executive-analytics-dashboard`, `/audit-logging-center`, `/signal-accountability`)
**Purpose:** measure execution performance and governance quality.  
**Key features/functionality:** KPI reporting, trend analytics, audit/event logs, accountability views.  
**How to use:** review periodic performance, isolate bottlenecks, validate compliance-grade traceability.  
**Expected result:** operating transparency and repeatable performance improvement.
### 5.19 Readiness and Outcome Pages (`/readiness-assessment`, `/agility-assessment`, `/future-readiness`, `/preparedness-report`)
**Purpose:** baseline and communicate readiness maturity.  
**Key features/functionality:** assessments, scoring outputs, preparedness reporting.  
**How to use:** run assessments before/after protocol and drill cycles; track improvement trajectory.  
**Expected result:** measurable readiness posture and board-friendly progress narrative.
### 5.20 Board + ROI Surfaces (`/board-briefings`, `/board-export`, `/roi-calculator`, `/roi-dashboard`, `/roi-breakdown`)
**Purpose:** translate product usage into decision and financial evidence.  
**Key features/functionality:** briefing generation, export workflows, ROI estimation and monitoring views.  
**How to use:** run board prep package before governance meetings; use ROI outputs for investment decisions.  
**Expected result:** faster executive alignment and stronger commercial justification.
### 5.21 Integration Pages (`/integration-hub`, `/integrations`, `/integration-connections`, `/ecosystems`, `/ecosystem/*`)
**Purpose:** connect Readiness OS to enterprise systems.  
**Key features/functionality:** connector management, ecosystem overviews, integration guidance paths.  
**How to use:** connect target systems in rollout sequence; validate data flow and delivery behavior.  
**Expected result:** operational handoff into existing enterprise stack with less manual coordination.
### 5.22 Conversion + Decision Pages
- `/founding-partner-program` (and `/pilot-program` alias)
- `/request-access`
- `/founding-partner`
- `/cost-of-inaction`
- `/first-90-days`
- `/board-memo`
- `/buyer-decision-packet`
- `/executive-brief`
- `/security-compliance`
**Purpose:** move buyers from interest -> procurement-ready decision.  
**Key features/functionality:** program definition, implementation path, risk reduction narrative, board/procurement support content.  
**How to use:** sequence these pages in executive meetings and follow-up packets.  
**Expected result:** reduced buyer uncertainty and clearer go-forward decision path.
---
## 6) Complete page catalog matrix (current production routes)
This matrix summarizes the main route groups and user outcomes.  
For exact route implementation details and aliases, use `client/src/App.tsx`.
### 6.1 Public, story, and conversion pages
| Routes | Main features/functions | Expected user result |
|---|---|---|
| `/`, `/home` | Core product thesis, top-level navigation | Understand platform value and next action |
| `/how-it-works`, `/how-it-executes`, `/idea-framework` | Execution model + framework explanation | Shared understanding of operating model |
| `/research`, `/research-foundation` | Evidence and market framing | Confidence and stakeholder validation |
| `/pricing`, `/growth`, `/competitive-positioning` | Commercial framing and comparative positioning | Budget and category-fit clarity |
| `/founding-partner-program`, `/pilot-program`, `/founding-partner` | Program scope, engagement model | Clear entry path to adoption |
| `/request-access`, `/contact`, `/early-access`, `/trial-access`, `/demo-access`, `/magic-login` | Lead capture and access workflows | Qualified user onboarding path |
| `/cost-of-inaction`, `/first-90-days`, `/board-memo`, `/buyer-decision-packet`, `/executive-brief`, `/security-compliance` | Buyer decision assets and procurement support | Reduced deal friction and stronger internal case |
| `/investors`, `/for-investors`, `/investor-landing`, `/investor-presentation`, `/pitch-deck`, `/investor-resources`, `/a16z`, `/speedrun-pitch` | Investor narrative and materials | Investment-readiness communication |
| `/our-story`, `/about`, `/founder-story`, `/team`, `/terms` | Company and trust content | Brand and legal confidence |
### 6.2 IDEA operations and execution pages
| Routes | Main features/functions | Expected user result |
|---|---|---|
| `/mission-control`, `/command-tower`, `/executive-dashboard` | Executive operating cockpit | High-level situational control |
| `/workspace` + `/workspaces/*` redirects | IDEA phase-based working model | Structured cross-phase execution |
| `/identify/*` | Protocol design/prep surfaces | Readiness protocols staged before events |
| `/detect/*` | Signal monitoring and alert operations | Better early detection and escalation |
| `/execute/*` | Activation and war-room execution | Faster coordinated response |
| `/advance/*` | Outcome analysis and learning | Performance improvement loop |
| `/strategic-monitoring`, `/strategic-monitoring/:id`, `/execution-history`, `/live-activation-center`, `/collaboration` | Situation operations and runtime history | Shared execution visibility |
### 6.3 Protocol lifecycle and scenario tools
| Routes | Main features/functions | Expected user result |
|---|---|---|
| `/playbook-library`, `/playbooks`, `/business-scenarios` | Protocol browsing and selection | Faster protocol discovery |
| `/playbook-library/:id`, `/business-scenario/:id` | Protocol detail view | Better scenario fit decisions |
| `/playbooks/:id/customize`, `/playbooks/:id/edit`, `/playbooks/create`, `/playbook-customize/*` | Protocol customization and creation | Org-specific executable protocols |
| `/playbook-command/:id`, `/identify/playbook-command/:id`, `/playbook-activation/:triggerId/:playbookId` | Runtime command surfaces | Controlled live execution |
| `/protocol-builder` | New protocol construction with governance controls | Publishable custom readiness protocol |
| `/playbook-management`, `/playbook-readiness`, `/playbook-audit`, `/living-playbooks`, `/continuous-mode` | Portfolio management and readiness validation | Better protocol quality and maintainability |
| `/practice-drills`, `/practice-drills/:drillId/live`, `/drill-tracking`, `/executive-scenarios`, `/incident-analyzer`, `/simulation-studio` | Drill/simulation execution | Increased readiness confidence |
| `/crisis-exposure-matrix`, `/financial-exposure`, `/concurrent-situations`, `/crisis-communications` | Risk and communication execution tools | Better cross-functional response planning |
### 6.4 Intelligence, analytics, and reporting
| Routes | Main features/functions | Expected user result |
|---|---|---|
| `/intelligence`, `/intelligence-control-center`, `/signal-intelligence`, `/activation-intelligence`, `/protocol-health`, `/live-detection`, `/live-detection-feed` | Signal and activation intelligence | Improved operational awareness |
| `/analytics`, `/advanced-analytics`, `/executive-analytics-dashboard`, `/enterprise-metrics` | Performance analytics | KPI visibility and optimization |
| `/decision-velocity`, `/decisions`, `/decision-trees`, `/execution-coordination`, `/institutional-memory`, `/signal-accountability` | Decision and governance tooling | Better decision discipline and traceability |
| `/board-briefings`, `/board-export`, `/executive-summary*`, `/report-generator` | Executive/board reporting outputs | Faster briefing preparation |
| `/roi-calculator`, `/roi-dashboard`, `/roi-breakdown`, `/calculator` | Financial impact and return analysis | Stronger budget/procurement case |
| `/readiness-assessment`, `/agility-assessment`, `/future-readiness`, `/readiness`, `/preparedness-report` | Readiness scoring and reporting | Quantified readiness trajectory |
### 6.5 Onboarding, setup, integrations, and administration
| Routes | Main features/functions | Expected user result |
|---|---|---|
| `/get-started`, `/getting-started`, `/onboarding-guide`, `/onboarding`, `/onboarding-wizard`, `/setup`, `/welcome-brief`, `/roadmap` | Guided onboarding and adoption sequencing | Faster initial activation |
| `/setup/team`, `/setup/integrations`, `/setup/organization`, `/setup/api`, `/organization-setup`, `/success-metrics` | Configuration setup | Deployment baseline established |
| `/learn/quick-demo`, `/learn/role-demo`, `/learn/drills`, `/learn/help` | Embedded learning and enablement | Better user proficiency |
| `/integration-hub`, `/integrations`, `/integration-connections`, `/integrations-legacy`, `/ecosystems`, `/ecosystem/*` | Integration and connector pathways | Connected enterprise delivery flow |
| `/settings`, `/settings-hub`, `/uat-admin`, `/admin/*`, `/access-denied`, `/approval-success`, `/approval-error` | Admin controls and access states | Controlled operations and governance |
### 6.6 Demo and experience routes
| Routes | Main features/functions | Expected user result |
|---|---|---|
| `/demo-hub`, `/master-demo`, `/demo/:scenarioId`, `/industry-demos`, `/crisis-demos` | Guided demo entry points | High-quality product walkthroughs |
| `/financial-demo`, `/pharma-demo`, `/manufacturing-demo`, `/retail-demo`, `/energy-demo`, `/luxury-demo`, `/lvmh-demo`, `/shein-demo`, `/spacex-demo` | Industry scenario demonstrations | Contextual value proof by vertical |
| `/12-minute-experience`, `/test-drive`, `/try-demo`, `/role-selector`, `/experience/:roleId`, `/industry-experience/:industryId` | Test-drive and role-based experience flows | Better buying confidence through hands-on proof |
---
## 7) Per-page quality checklist (for documentation and UX consistency)
Use this checklist any time a page changes:
1. **Purpose clarity:** can a new user explain why this page exists in one sentence?
2. **Action clarity:** does the page show the next best action?
3. **Authority clarity:** does it reinforce "AI monitors, executives authorize" where decision rights matter?
4. **Outcome clarity:** does it show what result the user should expect after action?
5. **Terminology alignment:** uses "Readiness Protocol" and "Founding Partner" language.
6. **Measurement alignment:** outputs are traceable through analytics/audit/reporting pages.
---
## 8) Recommended publishing format
For external customer onboarding, publish this guide in three layers:
1. **Quick Start PDF** (executive view, 5-7 pages)
2. **Role Playbooks** (executive, admin, functional operator)
3. **Full in-product route guide** (this document as canonical reference)
This layered format keeps onboarding fast while preserving full depth for power users.