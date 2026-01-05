# Overview

Bastion - The Executive Playbook Platform, is a full-stack web application designed to empower Fortune 1000 executives with rapid decision-making capabilities. Analogous to an NFL coach's playbook, Bastion provides 80+ pre-configured scenario playbooks, enabling organizations to activate coordinated responses in minutes, not days. The platform delivers "Certainty, Engineered" - transforming 72-hour crisis responses into 12-minute coordinated executions through scenario management, real-time collaboration, and AI-powered pattern recognition.

The application is built as a monorepo with a React frontend and a Node.js/Express backend, offering features for managing organizations, strategic scenarios, crisis protocols, advanced AI intelligence modules (Pulse, Flux, Prism, Echo, Nova), and team activities with real-time updates via WebSockets.

# Brand Identity

**Brand Name**: Bastion
**Tagline**: Certainty, Engineered.
**Brand Positioning**: Strategic stronghold for proactive leadership

**Four Brand Pillars**:
1. **Proactive Preparation** - "Building Your Bastion": Creating strategic strongholds during peacetime for crisis readiness
2. **Prompt Action & Swift Decisions** - "The Apex of Command": Achieving speed and precision from strategic vantage points
3. **Handling Triggers** - "Mastering the Moments That Matter": Pre-analyzed scenarios with ready-to-execute plans
4. **Clear Plans & Roadmaps** - "Certainty, Engineered": Superior processes creating operational certainty

# Core Use Case: The Problem We Solve

**Traditional Executive Response (Current State):**
When situations arise in an executive's sector/industry, the typical response cycle takes months:
1. Information/data is identified that requires action
2. Teams begin creating a response plan after becoming aware
3. Build a roadmap and project plan
4. Identify key resources and ensure all are in place
5. Finally execute (weeks/months later - often too late)

**Bastion Solution (NFL Coach Model):**
In a 3-hour NFL game, coaches make 80+ decisions in less than a minute each because they have pre-prepared playbooks for every scenario. Bastion brings this same rapid-response capability to executive decision-making:
- **Pre-configured Playbooks**: 80+ ready-to-execute plans for common industry scenarios
- **Executive-Defined Triggers**: Executives define what conditions matter; AI monitors 24/7
- **Instant Activation**: When triggers fire, playbooks execute immediately (not months later)
- **12-Minute Execution**: Average coordinated response vs. 72-hour industry standard

From your strategic Bastion, executives maintain strategic control over "what matters" while AI handles the operational speed of "monitoring and execution."

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite
- **UI Library**: Radix UI with shadcn/ui
- **Styling**: Tailwind CSS with CSS variables
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod
- **Real-time Communication**: WebSocket client

## Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Authentication**: Replit's OpenID Connect (OIDC) with Passport.js
- **Session Management**: Express sessions with PostgreSQL store
- **Real-time Features**: WebSocket server ('ws' library)
- **API Design**: RESTful API with JSON responses

## Database Design
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations
- **Key Tables**: Users, Organizations, Strategic scenarios, Tasks, Activities, Roles and permissions, Sessions, Data Sources, Executive Triggers, Trigger Monitoring History, Playbook Trigger Associations.

## Authentication & Authorization
- **Primary Auth**: Replit OIDC integration
- **Session Storage**: PostgreSQL-backed sessions
- **Authorization**: Role-based permissions
- **Security**: Secure cookies, CSRF protection

## Real-time Features
- **WebSocket Integration**: Bidirectional communication for live updates, user-specific connection tracking, and event broadcasting.

## UI/UX Decisions
- Modern design with a focus on executive-level usability and clear information presentation.
- Color schemes and branding reflect "Bastion" identity with a blue-to-teal gradient representing strategic strength and precision.
- Visual language emphasizes architectural stability, command authority, and engineered certainty.

## Technical Implementations
- **Executive Trigger Management System**: Allows executives to define triggers, which are then monitored 24/7 by an AI Co-Pilot. When triggers fire, playbooks are recommended or auto-executed. This system includes database enhancements for `dataSources`, `executiveTriggers`, `triggerMonitoringHistory`, and `playbookTriggerAssociations` tables, alongside a comprehensive Trigger Dashboard UI.

- **NFL-Style Playbook Readiness System** (Recent Enhancement): Transforms playbook library into execution-ready rapid response system:
  - **Readiness Indicators**: Traffic light system (green/yellow/red) shows which playbooks are immediately executable
  - **Drill Tracking**: lastDrillDate shows when playbooks were last practiced
  - **Automation Coverage**: Percentage of automated vs manual steps
  - **Execution Metrics**: Average execution time and total execution count prove speed advantage
  - **Approval Status**: Pre-approval tracking for instant authorization

- **Trigger Activation Console** (Recent Enhancement): War room experience for coordinated execution:
  - **Real-time countdown timer** tracking elapsed execution time
  - **Decision Velocity metrics** showing speed advantage vs industry standard (12 min vs 72 hours)
  - **Time saved calculations** proving ROI of rapid response
  - **Task progress tracking** with role assignments and checkpoints
  - **Execution notes** for documenting decisions and actions
  - **Automated data tracking** updates playbook metrics after each execution

- **What-If Scenario Analyzer** (Latest Enhancement): Proactive decision modeling and stress testing:
  - **Test conditions before they happen**: Define hypothetical conditions (e.g., "Oil price > $120")
  - **Trigger prediction**: See which monitoring triggers would fire under test conditions
  - **Playbook recommendations**: Preview which playbooks would be activated
  - **Decision velocity projection**: Calculate projected execution time vs industry standard
  - **Team mobilization preview**: Identify which teams would be involved
  - **Stress testing**: Test multiple simultaneous triggers to verify capacity
  - **Board presentation mode**: Save scenarios for executive presentations with ROI metrics
  - **Industry comparison**: Compare response speed against industry benchmarks

## Feature Specifications
- **AI Intelligence Modules**: Pulse Intelligence, Flux Adaptations, Prism Insights, Echo Cultural Analytics, Nova Innovations. These modules act as AI co-pilots, assisting executives in defining better triggers and providing strategic insights.
- **Executive Playbook Library**: 80+ pre-configured playbooks for various scenarios, one-click execution, drill mode for practice, playbook analytics, and a Decision Velocity Dashboard.
- **Strategic Planning**: Scenario template system, enterprise project management, real-time collaboration.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting.

## Authentication Provider
- **Replit OIDC**: Primary authentication service.

## Development Tools
- **Replit Environment**: Integrated development environment.
- **Cartographer Plugin**: Development-only debugging tool.

## UI Component Libraries
- **Radix UI**: Accessible component primitives.
- **shadcn/ui**: Component system built on Radix UI.
- **Lucide React**: Icon library.

## Build & Development
- **Vite**: Fast build tool and development server.
- **ESBuild**: Production bundling for server-side code.
- **PostCSS**: CSS processing with Tailwind CSS.