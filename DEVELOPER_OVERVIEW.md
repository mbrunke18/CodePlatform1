# VaughnMartin Execution OS — Developer Overview
**Version:** February 2026 | **Domain:** executeiq.io

---

## What This Is

A production-deployed Strategic Execution platform for Fortune 1000 companies. Core value: trigger any strategic event → the system automatically coordinates projects, tasks, documents, and budgets within 12 minutes. Built on the **IDEA Framework™** (Identify → Detect → Execute → Advance).

**Live deployment:** https://executeiq.io  
**Stack:** React 18 + TypeScript + Vite (frontend) / Node.js + Express + TypeScript (backend) / Neon PostgreSQL + Drizzle ORM (database)

---

## Project Structure

```
/
├── client/src/
│   ├── App.tsx              # All client routes (495 lines, 139 pages registered)
│   ├── pages/               # 139 page components
│   ├── components/          # 47 shared components
│   └── lib/
│       └── queryClient.ts   # TanStack Query setup + apiRequest helper
│
├── server/
│   ├── index.ts             # Entry point, startup seeding, middleware (724 lines)
│   ├── routes.ts            # All API routes in one file (8,558 lines)
│   ├── storage.ts           # Drizzle DB abstraction layer (2,965 lines)
│   ├── routes/              # 10 supplemental route files (sub-domain routes)
│   ├── services/            # AI, job queue, collaboration, signal ingestion
│   └── seeds/               # Database seed files (see Seeding section)
│
├── shared/
│   └── schema.ts            # Drizzle schema — single source of truth (6,122 lines)
│
└── dist/                    # Pre-built production bundle (committed to repo)
    ├── index.js             # Server bundle (1.9mb, built by esbuild)
    └── public/              # Vite frontend build output
```

---

## Getting Started

```bash
npm install         # Install dependencies
npm run dev         # Start dev server on :5000 (Vite + Express)
npm run build       # Build production bundle into dist/
npm run db:push     # Sync Drizzle schema changes to Neon DB (never write SQL manually)
```

---

## Authentication & Access Control

- **Provider:** Replit OIDC via Passport.js
- **Session:** express-session with PostgreSQL store
- **New user flow:** First login → org auto-created → redirected to `/onboarding` (5-step wizard)
- **Middleware:** `requireAuth` (session check) → `requireOrgAccess` (org scope) → `requireRole()` (write operations)
- **Roles:** admin, executive, strategist (write access); no role = read-only
- **Public routes:** `/api/playbooks/templates`, demo endpoints, health checks

---

## Database

- **Provider:** Neon serverless PostgreSQL (same instance for dev and production)
- **ORM:** Drizzle — schema in `shared/schema.ts`, queries via `server/storage.ts`
- **Migrations:** Never write SQL. Use `npm run db:push` to apply schema changes.
- **Org-scoped:** Almost all tables have an `organization_id` column. Storage methods enforce org scope.

### Key Tables
| Table | Purpose |
|-------|---------|
| `users` | Auth users, roles, org membership |
| `organizations` | Tenant orgs |
| `playbook_library` | 170 strategic playbook templates (read-only library) |
| `playbook_domains` | 9 domains (Financial Strategy, Market Dynamics, etc.) |
| `playbook_categories` | Sub-categories within domains |
| `playbooks` | User-activated/customized playbooks (per org) |
| `strategic_signals` | Live market/news signals |
| `action_items` | Tasks generated from playbook activation |
| `background_jobs` | PostgreSQL-backed async job queue |

---

## Playbook Library (170 Playbooks)

### Domain Breakdown
| Domain | Count |
|--------|-------|
| Financial Strategy | 24 |
| Market Dynamics | 22 |
| Operational Excellence | 21 |
| Technology & Innovation | 20 |
| AI Governance | 19 |
| Market Opportunities | 18 |
| Brand & Reputation | 17 |
| Regulatory & Compliance | 15 |
| Talent & Leadership | 14 |

### Compound Playbooks (playbook_number 181–184)
Four cross-domain playbooks added after the initial seed:
1. Compound: Cyber + Regulatory Cascade (Technology & Innovation)
2. Compound: Geopolitical + Supply Chain Disruption (Operational Excellence)
3. Compound: Climate + Operations Cascade (Operational Excellence)
4. Compound: AI + Workforce Transformation Crisis (AI Governance)

### Free Sample Playbooks (Unauthenticated Users)
Three playbooks are matched **by name** and pinned to the top of the library with "Free Sample" badges. Name-matching is intentional — UUIDs change on reseed, names are stable:
- "Aggressive Pricing Disruption"
- "Compound: Geopolitical + Supply Chain Disruption"
- "AI Competitive Disruption"

### Production Seeding
`server/index.ts` runs an **additive migration** on startup:
- If `COUNT(playbook_library) >= 170`: skip
- If `COUNT < 170`: insert only the 4 missing Compound playbooks by domain/category name lookup

**Do not use:** `server/seeds/playbookLibrarySeed.ts` (stub, does nothing) or `playbookLibrarySeed_PARTIAL.ts` (covers only 3 domains, ~48 playbooks).

---

## API Structure

All routes in `server/routes.ts` except sub-domain routes in `server/routes/`:

```
GET  /api/health                     # Health check
GET  /api/playbooks/templates        # Public — 170 library templates
GET  /api/playbooks/templates/:id    # Single template detail
POST /api/playbooks/templates/:id/copy  # Copy template to user's org
GET  /api/organizations/:orgId/*     # Org-scoped resources (requires auth)
GET  /api/signals                    # Live strategic signals
POST /api/executive-summary          # AI-generated summary
POST /api/analyze-pulse              # AI pulse analysis
WS   /                               # Socket.IO real-time collaboration
```

---

## AI Integration

- **Provider:** OpenAI GPT-4o via `server/services/openai-service.ts`
- **Used for:** Pulse analysis, risk scoring, executive summaries, opportunity detection, playbook recommendations
- **Job queue:** Long-running AI tasks are queued in `background_jobs` table and processed async
- **Env var:** `OPENAI_API_KEY` (set via Replit Secrets)

---

## Real-Time

- **Socket.IO** server registered in `server/index.ts`, handlers in `server/services/collaboration-service.ts`
- **Live signals:** `server/services/live-signal-ingestion.ts` polls external feeds every 15 minutes

---

## Email

- **Provider:** Resend (`RESEND_API_KEY`)
- **From:** `noreply@executeiq.io`
- **Fallback:** Console.log when key is absent (dev-safe)

---

## Design System

All 139 pages use a consistent brand palette applied via Tailwind inline styles:

| Token | Hex | Usage |
|-------|-----|-------|
| `NAVY` | `#0A0F2E` | Hero backgrounds, primary buttons, headings |
| `NAVY_MID` | `#141B45` | Secondary dark surfaces |
| `GOLD` | `#C9A84C` | Accents, metrics, labels (never background fill) |
| `TEAL` | `#2B8A6E` | Success, progress, offense playbooks |
| `OFF` | `#F8F7F4` | Light background sections |
| `BORDER` | `#E8E4DC` | Card/section borders |
| `MUTED` | `#6B7280` | Secondary text |

Red is preserved for crisis/alert severity. Yellow/orange for warnings. All Tailwind `purple-*`, `cyan-*`, `indigo-*`, `violet-*`, `blue-600+` classes have been removed from all pages.

---

## Deployment

**Current setup:** `dist/` is committed to the repo. Production runs directly from `dist/` with no build step during deployment (avoids Replit's bundle timeout).

```
Deployment config:
  run: ["npm", "run", "start"]    # No build step
  
Before publishing:
  npm run build                    # Rebuild dist/ locally, then publish
```

**Why:** `npm run build` takes ~23 seconds locally. In Replit's deployment environment it exceeded the bundle timeout. Pre-building and committing `dist/` resolves this permanently.

---

## Known Limitations / Watch Out For

1. **`server/routes.ts` is 8,558 lines** — consider splitting further into `server/routes/` sub-files for large feature areas
2. **`shared/schema.ts` is 6,122 lines** — all types in one file; imports are easy but diffs are large
3. **Playbook seeding:** The full 170-playbook seed has no clean re-runnable script. The production DB relies on the additive migration for the 4 Compound playbooks and an assumed 166-playbook baseline from an earlier seed.
4. **`dist/` is committed:** Developers must remember to `npm run build` before publishing. Stale `dist/` = stale production.
5. **Replit OIDC:** Authentication only works when running on Replit (dev or deployed). Local development outside Replit requires mocking auth.
6. **Single database:** Dev and production share the same Neon PostgreSQL instance. Schema changes in dev affect production immediately.

---

## First Customer

- **Org:** martybrunke
- **Org ID:** `aa9d3bf3-ab20-4fb6-a1da-e91aabbfb576`
- **Contact:** mbrunke@vaughnmartin.com
- **Access paths:** Scripted demo, self-serve free trial, enterprise pilot program
