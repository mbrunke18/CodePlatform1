# VaughnMartin Readiness OS — Developer Overview

**Version:** May 2026 | **Domain:** vaughnmartin.com

---

## What This Is

A production-deployed Strategic Readiness platform for organizations from startup to Fortune 500. Core value: a strategic trigger fires → the system activates a pre-staged Readiness Protocol, coordinates projects, tasks, stakeholders, and budgets within **12 minutes**. Built on the **IDEA Framework™** (Identify → Detect → Execute → Advance).

**Live deployment:** https://vaughnmartin.com  
**GitHub:** https://github.com/mbrunke18/CodePlatform1  
**Stack:** React 18 + TypeScript + Vite (frontend) / Node.js + Express + TypeScript (backend) / Neon PostgreSQL + Drizzle ORM (database)

---

## Project Structure

```
/
├── client/src/
│   ├── App.tsx              # All client routes (731 lines, 242 routes)
│   ├── pages/               # 140+ page components
│   ├── components/          # 47+ shared components
│   │   ├── layout/          # StandardNav (1,319 lines), Footer, PageLayout
│   │   └── ui/              # shadcn/ui primitives
│   └── lib/
│       └── queryClient.ts   # TanStack Query setup + apiRequest helper
│
├── server/
│   ├── index.ts             # Entry point, startup seeding, middleware
│   ├── routes.ts            # All API routes (~10,700 lines)
│   ├── storage.ts           # Drizzle DB abstraction (~3,566 lines)
│   ├── routes/              # Supplemental route files
│   └── services/            # AI, job queue, Socket.IO, signal ingestion
│
├── shared/
│   └── schema.ts            # Drizzle schema — single source of truth (~6,900 lines)
│
├── docs/
│   └── dev/                 # Developer reference docs
│
└── dist/                    # Pre-built production bundle (committed to repo)
    ├── index.js             # Server bundle (esbuild, ~4.6MB)
    └── public/              # Vite frontend build output
```

---

## Getting Started

```bash
npm install         # Install dependencies
npm run dev         # Start dev server on :5000 (Vite + Express)
npm run build       # Build production bundle into dist/
npm run db:push     # Sync Drizzle schema changes to Neon DB (never write SQL manually)
npx vitest run      # Run unit tests (189 tests)
```

---

## Authentication & Access Control

- **Provider:** Replit OIDC via Passport.js
- **Session:** express-session with PostgreSQL store
- **New user flow:** First login → org auto-created → `/onboarding` wizard
- **Middleware:** `requireAuth` (session check) → `requireOrgAccess` (org scope) → `requireRole()` (write operations)
- **Roles:** `admin`, `executive`, `strategist` (write access); no role = read-only
- **Platform admin:** `PLATFORM_ADMIN_EMAIL` env secret bypasses allowlist
- **Access gate:** `allowed_emails` table — open when empty, restrictive once any email added
- **Blocked users:** Shown `/access-denied`

---

## Database

- **Provider:** Neon serverless PostgreSQL (shared dev + production instance)
- **ORM:** Drizzle — schema in `shared/schema.ts`, queries via `server/storage.ts`
- **Migrations:** Never write SQL. Use `npm run db:push`.
- **Org-scoped:** Almost all tables have `organization_id`. Storage methods enforce scope.

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | Auth users, roles, org membership |
| `organizations` | Tenant orgs |
| `playbook_library` | 170 Readiness Protocol templates + 12 compound (IDs 181–192) |
| `playbook_domains` | 9 strategic domains |
| `playbooks` | User-activated protocols per org |
| `strategic_signals` | Live ingested market/news signals |
| `action_items` | Tasks from protocol activation |
| `background_jobs` | PostgreSQL-backed async job queue |
| `allowed_emails` | Email allowlist |

---

## Readiness Protocol Library (170 Protocols)

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

### Compound Protocols (IDs 181–192)

12 cross-domain compound protocols requiring simultaneous multi-track execution. These span multiple strategic domains and activate when compound trigger patterns are detected.

---

## Design System

See `docs/dev/DESIGN_SYSTEM.md` for full reference. Canonical colors:

| Token | Hex | Usage |
|-------|-----|-------|
| `NAVY` | `#0A0F2E` | Primary backgrounds, headings |
| `GOLD` | `#C9A84C` | Accents, CTAs, labels |
| `TEAL` | `#2B8A6E` | Secondary accent, compound indicators |
| `IVORY` | `#F0EDE4` | Light panels |

No purple anywhere. `border-radius: 0.15rem` on all interactive elements.

---

## Navigation

See `docs/dev/NAVIGATION.md` for full route map.

Three nav systems:
1. **Homepage inline nav** — custom nav inside `Homepage.tsx`
2. **`StandardNav`** — used on all other pages (`client/src/components/layout/StandardNav.tsx`)
3. **`IDEASidebar`** — authenticated product navigation

---

## Deployment

`dist/` is committed to the repo. Production runs from `dist/` with no build step during deployment.

```
Deployment config:
  run: ["npm", "run", "start"]   # Runs from pre-built dist/
  build: null                     # No build step (avoids Replit timeout)

Before every publish:
  npm run build                   # Rebuild dist/ (~48s), then publish
```

**Critical `.replit` issue:** The `.replit` file resets to include `build = ["npm", "run", "build"]` on every Replit checkpoint. Deployment will timeout unless `build: null` is set via the Replit deployment config API before each publish. Editing `.replit` directly does not fix this.

---

## Known Limitations

1. **`server/routes.ts` is ~10,700 lines** — consider splitting into `server/routes/` sub-files
2. **`shared/schema.ts` is ~6,900 lines** — all types in one file; diffs are large
3. **Single database** — dev and production share the same Neon instance; schema changes affect production immediately
4. **`dist/` is committed** — run `npm run build` before publishing
5. **Replit OIDC** — auth only works on Replit; requires mocking for local development

---

## Key Terminology (Enforced Platform-Wide)

| ❌ Retired | ✅ Current |
|-----------|-----------|
| Playbook | Readiness Protocol |
| Pilot Program | Founding Partner Program |
| AI-powered / AI-driven | system-detected / signal-based / pre-staged |
| Human-AI partnership | AI monitors, executives authorize |
| Offense / Defense / Special Teams | Growth & Positioning / Risk & Resilience / Transformation |
| 340× or 360× speed advantage | 3,600× Execution Head Start |

---

## First Customer

- **Org:** martybrunke
- **Org ID:** `aa9d3bf3-ab20-4fb6-a1da-e91aabbfb576`
- **Contact:** mbrunke@vaughnmartin.com
