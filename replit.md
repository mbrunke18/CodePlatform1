# VaughnMartin — Execution Operating System

## Overview
VaughnMartin's Execution OS is a Strategic Execution platform for Fortune 1000 companies. Its primary purpose is to automate project creation, task assignment, document staging, and budget allocation within 12 minutes of a strategic trigger. This platform aims to eliminate organizational lag after strategic events. It integrates AI-driven trigger monitoring with a library of 170 strategic playbooks across 9 domains. Operating on the IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), it fosters a human-AI partnership where AI handles monitoring, pattern detection, and recommendations, while human executives retain ultimate decision-making authority. The project's vision is to become "The Execution Infrastructure Enterprises Are Missing."

## User Preferences
- Preferred communication style: Simple, everyday language
- Valued prioritization approach with phase-by-phase implementation
- Maintain core product vision of human-AI partnership for strategic velocity
- Executive professional language required across UI/UX
- All text must be clearly and boldly readable — medium weight minimum, deep navy or dark gray
- Brand placement and visual memory is a priority — logo should appear on every key page
- Desktop-first layout; mobile adjustments only if non-disruptive

## Design System
- **Primary Colors:** Navy `#0A0F2E`, Navy Mid `#141B45`, Gold `#C9A84C`, Gold Light `#DFC178`, Teal `#2B8A6E`, Teal Light `#3BAF8A`
- **Neutral Colors:** Off-white `#F8F7F4`, Border `#E8E4DC`, Muted `#6B7280`
- **Rules:** Gold = accents, labels, metrics (never background). Navy = hero sections, headings, primary buttons. Teal = success states, offense playbooks, progress. Red = crisis/alert severity only (preserved). Yellow/orange = warnings only.
- **Applied:** Full design system applied across all 171 pages — zero off-brand Tailwind color classes remain.

## System Architecture

**UI/UX Decisions:**
- **Default Theme:** Fully light mode with pure white backgrounds. Dark mode is supported via localStorage.
- **Typography:** Global base font-weight 500. Headings are font-weight 700 in midnight navy.
- **Branding:** Uses `VaughnMartin` (company) and `Execution OS` (product). A `BrandStamp` component provides consistent brand placement. Logo is carried by `StandardNav` on all pages — do NOT add a second logo instance inside page hero content (was removed from `Homepage.tsx` hero as it caused redundancy and poor rendering on dark backgrounds).
- **Navigation:** Streamlined 5-item nav with a "More" dropdown and CTAs for "Try Demo" and "Start Pilot."
- **Layout:** `PageLayout` component wraps all pages with `StandardNav` header and `Footer`.
- **Homepage Messaging (current):** Hero opens with "They spend 72 hours getting the right people in a room. You spend 12 minutes already in execution." Core positioning: Execution OS replaces coordination — it doesn't accelerate it. Key sections: The Real Cost of Alignment → IDEA Framework → Execution-Ready Plans (not templates) → From Signal to Execution in 12 Minutes → CTA "The Gap Isn't Talent. It's Infrastructure."

**Technical Implementations:**
- **Frontend:** React 18, TypeScript, Vite, Radix UI + shadcn/ui, Tailwind CSS, TanStack Query v5, Wouter routing, React Hook Form + Zod, Framer Motion, Lucide React/react-icons.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (Neon serverless) via Drizzle ORM. Schema in `shared/schema.ts`. Never write SQL migrations manually — use `npm run db:push`.
- **Real-time:** Socket.IO WebSocket server for real-time collaboration.
- **Async Tasks:** PostgreSQL-backed background job queue for AI tasks.
- **Live Signal Ingestion:** Real-time signal monitoring in 15-minute cycles.
- **Authentication:** Replit OIDC with Passport.js. New users auto-get an org on first login (`onboardingCompleted: false`).
- **Onboarding Guard:** `requireOrgAccess` middleware redirects unauthenticated/incomplete-onboarding users to `/onboarding` (5-step wizard).
- **Role-Based Access:** `requireRole()` middleware on write routes (admin, executive, strategist). No role = read-only.
- **AI Services:** OpenAI GPT-4o for pulse analysis, risk assessment, executive summaries, opportunity detection.
- **Email:** Resend (`RESEND_API_KEY`) from `noreply@executeiq.io`. Falls back to console log when key absent.
- **IDEA Framework:** IDENTIFY, DETECT, EXECUTE, ADVANCE — with playbook customization, AI pattern matching, coordinated orchestration, and outcome analysis.

## Playbook Library
- **Total:** 170 active playbooks across 9 domains
- **Domains (exact DB names):** Financial Strategy (24), Market Dynamics (22), Operational Excellence (21), Technology & Innovation (20), AI Governance (19), Market Opportunities (18), Brand & Reputation (17), Regulatory & Compliance (15), Talent & Leadership (14)
- **Compound Playbooks (numbers 181-184):** 4 cross-domain playbooks added after initial seed — Compound: Cyber + Regulatory Cascade, Compound: Geopolitical + Supply Chain Disruption, Compound: Climate + Operations Cascade, Compound: AI + Workforce Transformation Crisis
- **Free Samples (unauthenticated):** 3 playbooks pinned to top with teal "Free Sample" badges, matched by name (not UUID): "Aggressive Pricing Disruption", "Compound: Geopolitical + Supply Chain Disruption", "AI Competitive Disruption"
- **Domain Filter:** `DOMAIN_DB_MAP` in `PlaybookLibraryV2.tsx` maps UI filter IDs to exact DB domain name strings
- **Production Seeding:** Additive migration in `server/index.ts` — if count < 170, inserts only missing Compound playbooks by name lookup (no destructive wipe). The old stub `playbookLibrarySeed.ts` and incomplete `playbookLibrarySeed_PARTIAL.ts` (covers only 3 domains) are NOT the source of truth; the production DB was seeded once from a complete run and maintained additively.

## Deployment
- **Platform:** Replit Autoscale
- **Custom Domain:** executeiq.io
- **Build Strategy:** `dist/` is pre-built and committed to the repo (removed from `.gitignore`). Deployment runs `npm run start` directly — no build step during deploy. This avoids bundle timeout in Replit's deployment environment. **Before publishing: run `npm run build` to update `dist/`.**
- **Start Command:** `npm run start` (production server from pre-built `dist/index.js`)
- **Dev Command:** `npm run dev` (Vite + Express dev server on port 5000)
- **Known `.replit` issue:** The `.replit` file persistently resets to include `build = ["npm", "run", "build"]` in the deployment block. Before every publish, use the Replit `deployConfig` API (via the agent) to remove the build step — otherwise deployment will attempt to bundle and hit the timeout. The deployment API config takes precedence over the file once set.

## Customer & Deployment
- **Custom Domain:** executeiq.io
- **First Customer:** martybrunke — org ID `aa9d3bf3-ab20-4fb6-a1da-e91aabbfb576`
- **Contact Email:** mbrunke@vaughnmartin.com

## External Dependencies
- **AI:** OpenAI GPT-4o
- **Database:** Neon PostgreSQL (same instance for dev and production)
- **Authentication:** Replit OIDC
- **Email:** Resend (RESEND_API_KEY) — previously SendGrid, now migrated
- **Enterprise Integrations (planned):** Salesforce, HubSpot, ServiceNow, Jira, Slack, Microsoft Teams, Google Workspace, Outlook/Exchange, AWS CloudWatch, Workday, Okta, Microsoft Active Directory

## Key Files Reference
| File | Purpose |
|------|---------|
| `client/src/App.tsx` | All client-side routes |
| `client/src/pages/PlaybookLibraryV2.tsx` | Main playbook library with domain filter + free samples |
| `client/src/pages/PlaybookDetail.tsx` | Individual playbook view |
| `server/index.ts` | Server entry point, startup seeding/migration |
| `server/routes.ts` | All API routes (~8500 lines) |
| `server/storage.ts` | Storage interface (Drizzle DB layer) |
| `shared/schema.ts` | Drizzle schema — single source of truth for all types |
| `server/seeds/playbookLibrarySeed_PARTIAL.ts` | Real seed covering 3 domains (48 playbooks) |
| `server/seeds/seedPipelineData.ts` | Pipeline demo data seed |
| `dist/` | Pre-built production bundle (committed; update with `npm run build`) |
