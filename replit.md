# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform for Fortune 1000 companies, designed to eliminate the time organizations spend organizing after strategic events by automating project creation, task assignment, document staging, and budget allocation within 12 minutes of a trigger. It integrates AI-driven trigger monitoring with a library of 170 strategic playbooks across 9 domains. Operating on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), it fosters a human-AI partnership — AI handles monitoring, pattern detection, and recommendations; human executives retain ultimate decision-making authority. Positioned as "The Execution Infrastructure Enterprises Are Missing."

## User Preferences
- Preferred communication style: Simple, everyday language
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision of human-AI partnership for strategic velocity
- Executive professional language required across UI/UX
- All text must be clearly and boldly readable — medium weight minimum, deep navy or dark gray
- Brand placement and visual memory is a priority — logo should appear on every key page

## Branding Rules (CRITICAL)
- **Company:** VaughnMartin | **Product:** Execution OS (internal code identifiers like `ExecuteIQLogo` are NOT renamed)
- **ExecuteIQLogo** variants: `full`, `icon-only`, `text-only` | colors: `navy` (light bg), `white` (dark bg)
- **VaughnMartinLogo** variants: `full`, `icon-only` | colors: `dark`, `light`
- **BrandStamp** component: reusable brand placement unit with variants `dual`, `logo`, `icon`, `watermark`
- **Logo placement rule:** `color="navy"` on white/light backgrounds; `color="white"` on dark/navy backgrounds
- **Footer** (`bg-poise-navy`) intentionally stays dark — `ExecuteIQLogo color="white"` inside it
- **Nav** (`StandardNav`) uses `color="navy"` logo on white background
- Do NOT rename internal code identifiers (ExecuteIQLogo, routes, function names)

## Theme & Colors (CRITICAL)
- **Default theme:** Fully light mode — pure white `#ffffff` backgrounds everywhere
- **Dark mode:** Supported via localStorage / `.dark` class; dark: prefixed variants preserved
- **Light mode rule:** ALL page section backgrounds forced to pure white. Only `bg-poise-navy` (nav/footer) intentionally stays dark
- **Text in light mode:** Deep navy `#0A0F2E` for headings, `#1e2340` for body, `#374151` for captions
- **Text in dark containers:** `text-white` is correct ONLY inside `bg-poise-navy` or equivalent dark elements
- **Brand palette:**
  - Gold: `#C9A84C` / `#D4AF37` — used in accents, labels, metrics (NEVER as background)
  - Teal/Emerald: `#2B8A6E` — positive outcomes, highlights
  - Midnight Navy: `#0A0F2E` — headings, primary text, dark containers
  - Off-white: `#F0EDE4` — legacy warm ivory (now replaced with pure white)

## Typography System (CRITICAL)
- **Global base (index.css):** `body` font-weight 500; `p, li, span, div` all font-weight 500 by default
- **Headings h1–h6:** `font-weight: 700`, `color: #0A0F2E` (midnight navy)
- **Text color scale:**
  - `text-gray-900` — primary headings and critical labels
  - `text-gray-800` — body text (standard paragraphs, descriptions)
  - `text-gray-700` — secondary/supporting text
  - `text-gray-600` — muted/caption text (minimum for readable content)
  - NEVER use `text-gray-400/300/200/100` or `text-slate-300/200/100` — too light
- **Design system utility classes:**
  - `.text-title` — Barlow Condensed 800, navy, uppercase
  - `.text-subtitle` — semibold, dark navy `#1e2340`
  - `.text-body` — medium, dark navy `#1e2340`, line-height 1.7
  - `.text-caption` — medium, `#374151`
  - `.text-label` — Barlow Condensed 700, gold, uppercase tracking-widest
  - `.text-gold` — gold `#C9A84C`, bold
  - `.text-navy` — midnight `#0A0F2E`, bold
  - `.text-teal` — `#2B8A6E`, semibold
  - `.text-strong-body` — navy `#1e2340`, semibold, line-height 1.7
  - `.text-readable-muted` — `#374151`, medium

## UI/UX Architecture

**Navigation:**
- Streamlined 5-item nav with a "More" dropdown
- CTAs: "Try Demo" and "Start Pilot"
- `StandardNav` on white background with `ExecuteIQLogo color="navy"`

**Layout:**
- `PageLayout` component wraps all pages with `StandardNav` header and `Footer`
- `BrandStamp` component placed at top of hero section on every major page

**Video Intro (Homepage):**
- `VideoIntro.tsx` → 13 scenes → always plays on every Homepage load (no sessionStorage guard)
- All 13 scenes use white/gray-50 backgrounds
- Timer logic uses `useRef` for elapsed time — `nextScene()` is called directly from `setInterval`, NOT inside `setProgress()` state updater (critical: prevents React cross-component state update violation)
- Progress dots: gold (`bg-[#D4AF37]`) for active/past, `bg-gray-300` for inactive (NOT `bg-white`)
- Outro "Start Pilot" button: visible on white background
- NarrationBox: white frosted card

**Brand Placement:**
- `BrandStamp` component at `client/src/components/BrandStamp.tsx`
- Placed in 45+ pages: all marketing, investor, demo, and product dashboard pages
- Pattern: `<BrandStamp variant="dual" size="md" className="mb-8" />` above the first `<Badge>` in every hero section
- Dashboard pages: `<BrandStamp variant="icon" size="sm" />` in content header area

## IDEA Framework Phases
- **IDENTIFY (ExecuteIQ Playbook™):** Build and customize playbooks from 170 templates across 9 strategic domains
- **DETECT (ExecuteIQ Signal™):** AI-powered pattern matching, competitive intelligence aggregation, early warning dashboards, human-triggered playbook activation
- **EXECUTE (ExecuteIQ Compass™):** Orchestrates coordinated responses within 12 minutes, pre-approved budgets, enterprise integrations, Command Center management
- **ADVANCE (ExecuteIQ Retrospect™):** Institutional learning, AI-powered outcome analysis, playbook refinement suggestions

## Strategic Domains (170 Playbooks)
- **OFFENSE:** Market Entry, M&A, Product Launch
- **DEFENSE:** Crisis Response, Cyber Incident, Regulatory Change
- **SPECIAL TEAMS:** Digital Transformation, Competitive Response, AI Governance

## Key Features
- **Executive Summary Generator:** One-click AI-powered reports (Strategic Overview, Crisis Readiness, Competitive Intelligence, Transformation Progress). Configurable by industry/org/timeframe
- **New User Journey:** 7-step guided onboarding
- **Enterprise Task Library:** 42 pre-defined tasks by IDEA phases and 9 functional areas
- **Execution Plan Sync:** `ExecutionPlanSyncService` for bi-directional sync, `DocumentTemplateEngine` for auto-generating documents, `FileExportService`
- **Live Signal Ingestion:** Real-time signal monitoring from 16 categories, auto-persisted to DB
- **Pilot Demo:** Full trigger-to-execution loop with real email notifications, command center timeline, pre-built scenarios

## System Design

**Frontend:**
- React 18, TypeScript, Vite
- Radix UI + shadcn/ui component library
- Tailwind CSS (darkMode: `["class"]`)
- TanStack Query v5 (object form only: `useQuery({ queryKey: [...] })`)
- Wouter for routing
- React Hook Form + Zod validation
- Framer Motion for animations
- Lucide React icons + react-icons/si for brand logos

**Backend:**
- Node.js + Express.js + TypeScript
- PostgreSQL (Neon serverless) via Drizzle ORM
- Socket.IO WebSocket server for real-time collaboration
- Background job queue (PostgreSQL-backed) for async AI tasks
- Live Signal Ingestion service (15-min cycles)

**Authentication:**
- Replit OIDC with Passport.js
- Session management via PostgreSQL
- `javascript_log_in_with_replit` integration installed

**AI Services:**
- OpenAI GPT-4o via `javascript_openai_ai_integrations` (v2.0.0 installed)
- Used for: pulse analysis, risk assessment, executive summaries, opportunity detection

**Email:**
- SendGrid integration installed (`sendgrid==1.0.0`)

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL
- **Auth:** Replit OIDC
- **Email:** SendGrid
- **Enterprise Integrations (webhook endpoints registered):** Salesforce, HubSpot, ServiceNow, Jira, Slack, Microsoft Teams, Google Workspace, Outlook/Exchange, AWS CloudWatch, Workday, Okta, Microsoft Active Directory

## Domain Configuration
- **executeiq.io** — verified in Replit; DNS pending in Cloudflare
  - A record: `@` → `34.111.179.208` (DNS-only / grey cloud, NOT proxied)
  - TXT record: `@` → `replit-verify=3bd53afc-ff4f-401b-9e3d-b367791ef629`

## Key File Locations
- `client/src/components/ExecuteIQLogo.tsx` — Execution OS product logo (arrow icon + wordmark)
- `client/src/components/VaughnMartinLogo.tsx` — VaughnMartin company logo (V-icon + Cormorant wordmark)
- `client/src/components/BrandStamp.tsx` — Reusable brand placement component (NEW)
- `client/src/components/marketing/VideoIntro.tsx` — Homepage cinematic intro (13 scenes)
- `client/src/components/video/` — All 13 individual video scene components (white backgrounds)
- `client/src/components/layout/StandardNav.tsx` — Main navigation (white bg, navy logo)
- `client/src/components/layout/Footer.tsx` — Footer (bg-poise-navy, white logo — intentionally dark)
- `client/src/index.css` — Global styles, brand colors, typography system, light/dark mode
- `shared/schema.ts` — All Drizzle ORM models and Zod insert schemas
- `server/storage.ts` — Storage interface and CRUD operations
- `server/routes.ts` — All API routes (thin, delegates to storage)

## Database Operations
- **Never write SQL migrations manually** — use `npm run db:push`
- If data-loss warning appears: `npm run db:push --force`
- Schema changes: add to `shared/schema.ts` first, then update `server/storage.ts`
