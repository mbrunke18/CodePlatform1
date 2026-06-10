# VaughnMartin Readiness OS — Developer Guide

**Last Updated:** May 2026

---

## Quick Start

```bash
npm install         # Install dependencies
npm run dev         # Start dev server on :5000 (Vite + Express, hot reload)
npm run build       # Build production bundle into dist/
npm run db:push     # Sync Drizzle schema to Neon DB (never write SQL manually)
npx vitest run      # Run unit tests
```

---

## Project Overview

VaughnMartin Readiness OS compresses the 30-day mobilization cycle to 12-minute execution through:
- **170 pre-staged Readiness Protocols** across 9 strategic domains
- **IDEA Framework™** (Identify → Detect → Execute → Advance)
- **AI monitors, executives authorize** — no protocol activates without executive sign-off
- **231 trigger patterns** monitored across 248+ signal sources every 15 minutes

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| UI Components | Radix UI, shadcn/ui, Tailwind CSS |
| State Management | TanStack Query v5 |
| Routing | Wouter |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (Neon serverless) |
| ORM | Drizzle ORM |
| Auth | Replit OIDC + Passport.js |
| Real-time | Socket.IO |
| AI | Azure OpenAI (primary), OpenAI GPT-4o (fallback) |

### Directory Structure

```
/
├── client/src/
│   ├── App.tsx              # All client routes (731 lines, 242 routes)
│   ├── pages/               # 140+ page components
│   ├── components/          # Shared components
│   │   ├── layout/          # StandardNav, Footer, PageLayout, IDEASidebar
│   │   └── ui/              # shadcn/ui primitives
│   ├── contexts/            # React contexts (DemoController, CustomerContext, etc.)
│   └── lib/
│       └── queryClient.ts   # TanStack Query setup + apiRequest helper
│
├── server/
│   ├── index.ts             # Entry point, middleware, startup seeding
│   ├── routes.ts            # All API routes (~10,700 lines)
│   ├── storage.ts           # Drizzle DB abstraction (~3,566 lines)
│   ├── routes/              # Supplemental route files
│   └── services/            # AI, job queue, Socket.IO, signal ingestion
│
├── shared/
│   └── schema.ts            # Drizzle schema — single source of truth (~6,900 lines)
│
├── docs/
│   └── dev/                 # Developer reference (this directory)
│
└── dist/                    # Pre-built production bundle (committed to repo)
    ├── index.js             # Server bundle (esbuild)
    └── public/              # Vite frontend build output
```

---

## Authentication & Access Control

- **Provider:** Replit OIDC via Passport.js
- **Session:** express-session with PostgreSQL store
- **New user flow:** First login → org auto-created → `/onboarding` wizard
- **Middleware chain:** `requireAuth` → `requireOrgAccess` → `requireRole()`
- **Roles:** `admin`, `executive`, `strategist` (write access); no role = read-only
- **Platform admin:** `PLATFORM_ADMIN_EMAIL` env var bypasses allowlist checks
- **Public routes:** `/api/playbooks/templates`, demo endpoints, health checks
- **Email allowlist:** `allowed_emails` table — open when empty, restrictive once any email is added

---

## Database

- **Provider:** Neon serverless PostgreSQL (shared dev + production instance)
- **ORM:** Drizzle — schema in `shared/schema.ts`, queries via `server/storage.ts`
- **Migrations:** Never write SQL. Use `npm run db:push` to apply schema changes.
- **Org-scoped:** Almost all tables have `organization_id`. Storage methods enforce scope.

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | Auth users, roles, org membership |
| `organizations` | Tenant orgs |
| `playbook_library` | 170 Readiness Protocol templates (read-only library) |
| `playbook_domains` | 9 strategic domains |
| `playbooks` | User-activated/customized protocols (per org) |
| `strategic_signals` | Live market/news signals |
| `action_items` | Tasks from protocol activation |
| `background_jobs` | PostgreSQL-backed async job queue |
| `allowed_emails` | Email allowlist for login gating |

### Compound Protocols (playbook_number 181–192)

12 cross-domain compound protocols added after the 170-protocol baseline seed. These span multiple domains and activate simultaneously on compound triggers.

---

## Design System

See `docs/dev/DESIGN_SYSTEM.md` for full reference. Key rules:

| Token | Value |
|-------|-------|
| `NAVY` | `#0A0F2E` |
| `GOLD` | `#C9A84C` |
| `TEAL` | `#2B8A6E` |
| `IVORY` | `#F0EDE4` |
| Editorial font | Cormorant Garamond |
| Label font | Barlow Condensed |
| Border radius | `0.15rem` |

**No purple anywhere. No `AI-powered` in UI copy. No "Pilot Program" in user-facing text.**

---

## Logo

The logo is a **custom SVG React component**:

```tsx
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
// alias: import VaughnMartinLogo from "@/components/VaughnMartinLogo";

<ExecuteIQLogo variant="full" color="navy" height={56} animated={true} />
<ExecuteIQLogo variant="icon-only" color="navy" height={40} />
```

Never use PNG files from `client/src/assets/` as the logo.

---

## Navigation

See `docs/dev/NAVIGATION.md` for full route map and nav component reference.

Quick summary:
- **Homepage:** Custom inline nav in `Homepage.tsx`
- **All other pages:** `StandardNav` component (1,319 lines)
- **Authenticated:** `IDEASidebar` for product navigation

---

## API Patterns

```typescript
// GET list
app.get('/api/playbooks', requireAuth, async (req, res) => { ... });

// GET single
app.get('/api/playbooks/:id', requireAuth, async (req, res) => { ... });

// POST create (validate with Zod before storage)
app.post('/api/playbooks', requireAuth, requireRole('strategist'), async (req, res) => {
  const validated = insertPlaybookSchema.parse(req.body);
  const result = await storage.createPlaybook(validated);
  res.json(result);
});
```

### Frontend Data Fetching

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Query — default fetcher handles GET automatically
const { data, isLoading } = useQuery({
  queryKey: ['/api/playbooks'],
});

// Mutation — use apiRequest for POST/PATCH/DELETE
const mutation = useMutation({
  mutationFn: (data) => apiRequest('/api/playbooks', { method: 'POST', body: data }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/playbooks'] }),
});
```

---

## Component Patterns

### Forms

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { insertPlaybookSchema } from '@shared/schema';

const form = useForm({
  resolver: zodResolver(insertPlaybookSchema),
  defaultValues: { name: '', domain: '' },
});
```

### Toast

```tsx
import { useToast } from '@/hooks/use-toast';  // correct import path
const { toast } = useToast();
toast({ title: "Protocol activated", description: "12-minute clock started." });
```

### Environment Variables (Frontend)

Use `import.meta.env.VITE_*` — not `process.env`. Variables must be prefixed `VITE_` to be available client-side.

---

## Deployment

`dist/` is committed to the repo. Production runs from `dist/` with no build step during deployment (avoids Replit bundle timeout).

```bash
# Before every publish:
npm run build     # Rebuild dist/ (~48s)
# Then publish via Replit dashboard
```

**Critical:** The `.replit` file resets to include `build = ["npm", "run", "build"]` on every Replit checkpoint. This causes bundle timeout on publish. Before deploying, use the Replit deployment config API to set `build: null`. Do not try to fix this by editing `.replit` directly.

---

## Known Limitations

1. **`server/routes.ts` is ~10,700 lines** — consider splitting into `server/routes/` sub-files for large areas
2. **`shared/schema.ts` is ~6,900 lines** — all types in one file; easy to import but diffs are large
3. **Single database** — dev and production share the same Neon instance; schema changes affect production immediately
4. **`dist/` is committed** — run `npm run build` before publishing; stale `dist/` = stale production
5. **Replit OIDC** — auth only works on Replit (dev or deployed); requires auth mocking for local development outside Replit

---

## Security

- **Helmet** — security headers (CSP, XSS protection)
- **Rate limiting** — 1000 req/15min API, 20 req/15min auth
- **Session security** — HTTP-only cookies, PostgreSQL store
- **Authorization** — `requireRole()` middleware; fail-closed on errors
- **Secrets** — all sensitive values in environment variables (never in code)

### Required Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection |
| `SESSION_SECRET` | Express session encryption |
| `PLATFORM_ADMIN_EMAIL` | Platform admin bypass |
| `RESEND_API_KEY` | Email via Resend |

---

## Testing

```bash
npx vitest run                   # Run all unit tests
npx vitest run --reporter=verbose # Verbose output
```

189 unit tests as of May 2026.

---

## Code Review Checklist

### Language Compliance
- [ ] No `AI-powered`, `AI-driven`, `AI-generated`, `AI-detected` in UI copy
- [ ] No `GPT-4o` in user-facing text (only in technical integration listings)
- [ ] No `Pilot Program` — use `Founding Partner Program`
- [ ] No `Offense / Defense / Special Teams` — use `Growth & Positioning / Risk & Resilience / Transformation`
- [ ] No `human-AI partnership` — use `AI monitors, executives authorize`
- [ ] Metrics: `3,600× Execution Head Start`, not `340×` or `speed advantage`

### Design Consistency
- [ ] Brand colors: NAVY `#0A0F2E`, GOLD `#C9A84C`, TEAL `#2B8A6E`, IVORY `#F0EDE4`
- [ ] No purple anywhere
- [ ] Logo is SVG component, not PNG
- [ ] Border radius `0.15rem` on buttons/cards/badges
- [ ] Font-weight ≥ 500 on all visible text

### Code Quality
- [ ] TypeScript types complete (no `any` abuse)
- [ ] API routes validate input with Zod schemas
- [ ] TanStack Query v5 object form: `useQuery({ queryKey: [...] })`
- [ ] Cache invalidated after mutations
- [ ] Loading/error states handled
- [ ] No static imports of React (JSX transformer handles it)
