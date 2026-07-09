# VaughnMartin Readiness OS — Developer Reference
*Last updated: July 9, 2026 (§76 — Founding Partner Program eligibility broadening) | Single source of truth for engineers onboarding to or extending this codebase.*

---

## 1. What This Product Is

**Readiness OS** by VaughnMartin is the coordination infrastructure for high-growth startups, mid-market companies, and global enterprises — from startup to Fortune 500. It pre-stages project creation, task assignment, document staging, and budget allocation so the organization responds within 12 minutes of a strategic trigger firing — before the trigger fires.

**Canonical product descriptor:** "VaughnMartin builds Readiness OS — coordination infrastructure for any organization, startup to Fortune 500."
**Canonical tagline:** "The response is ready before the trigger fires."
**Product thesis arc (LOCKED):** Preparation → Readiness → Fearless.

- **180 Readiness Protocols** across 9 domains (core single-domain library) + **30 compound protocols** (IDs 181–210, dual-track cross-domain) = **210 total**
- **248+ data points** across 20 signal categories (internal data structure count — see Signal Vocabulary below), monitored in 15-minute cycles
- **IDEA Framework™** — the four operating phases: IDENTIFY, DETECT, EXECUTE, ADVANCE

> **Narrative Bridge — IDEA vs. Pitch Deck Phases (read before any external presentation):**
> External pitch materials (deck, carousel, investor slides) describe five organizational outcomes: **PREPARE → DETECT → DECIDE → EXECUTE → LEARN**. The platform's internal execution model uses four named phases: **IDENTIFY → DETECT → EXECUTE → ADVANCE**. These are not contradictory — they operate at different levels of abstraction. The five-phase narrative describes what enterprises gain organizationally (preparation capability, signal detection, decision confidence, execution speed, institutional learning). The four IDEA phases describe how the platform delivers each cycle mechanically. When presenting externally: describe the five phases as organizational advantages, not platform labels. Every enterprise outcome in the five-phase model is fully delivered by the four IDEA phases — PREPARE maps to IDENTIFY (pre-staged protocols), DECIDE is compressed into authorized EXECUTE, and LEARN maps to ADVANCE (debrief + institutional memory). **Do not attempt to reconcile the numbering in any UI copy.** The platform surfaces IDENTIFY / DETECT / EXECUTE / ADVANCE consistently throughout the product. The five-phase framing lives only in pitch and marketing materials.
- **Enterprise B2B only** — public Founding Partner conversion CTA routes to `/founding-partner-program` (inline application form, no redirect). **Four access paths exist:** (1) Founding Partner Program `/founding-partner-program` — public pitch + inline application form, submissions saved to `founding_partner_applications` DB table; (2) Request Access `/request-access` — magic link intake form (Resend), no password, for platform login; (3) Trial Access `/trial-access` — 48-hour full platform; (4) Demo Access `/demo-access` — token-based controlled access. There is no public "Start Free Trial" button on marketing pages — access is gated. **Do NOT route public "Founding Partner" CTAs to `/request-access`** — that route is for platform authentication only.
- **Executive authority preserved** — No playbook activates without executive authorization. AI monitors, scores signals, and recommends the right playbook. Executives decide. The decision is the same; the mobilization cycle surrounding it is compressed from 30 days to 12 minutes. **The phrase "human-AI partnership" is RETIRED from all UI/UX copy.** Replace it with "AI monitors, executives authorize" or "Executive authority preserved." The correct narrative: "AI monitors. Executives decide. Execution pre-staged." Any developer writing new copy must use this framing.

**Signal Vocabulary — Three Different Numbers, Three Different Layers (do not conflate):**

| Number | What It Is | Where It Lives | User-Facing? |
|---|---|---|---|
| **20** | Raw data category groups in `shared/intelligence-signals.ts` | Internal data file | No — never show this to users |
| **16** | Pattern matchers in `SignalEvaluationService.evaluateSignal()` | Internal service | No — implementation detail only |
| **9** | Strategic domains in the playbook library | Product taxonomy | **Yes — canonical user-facing metric** |
| **231** | Total triggers in the DB | Product data | **Yes — canonical user-facing metric** |
| **248+** | Total data points across all 20 raw categories | Canonical count | **Yes — always with "+" suffix** |

The retired phrase "16 signal categories" was a previous UI label shown to users. It has been replaced everywhere with "9 strategic domains, 231 triggers." Never write "16 signal categories" in any user-facing copy. The internal counts (20 categories, 16 patterns) are technical implementation details that belong only in code comments and this document.

- **3,600× Execution Head Start — LOCKED FRAMING (OLD "340×", "360×", and "72 hours" ARE RETIRED):** The 30-day baseline is NOT execution time. It is the time any organization — startup to Fortune 500 — spends just to MOBILIZE before any execution begins — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders. Readiness OS compresses that entire mobilization cycle to 12 minutes. The correct math is 30 days × 24 hrs × 60 min = 43,200 minutes ÷ 12 minutes = 3,600×. The label is ALWAYS "3,600× Execution Head Start" — never "Speed Advantage," never "3,600× faster," never "360x." "360×" was derived from the retired 72-hour baseline and is therefore also retired. The correct framing is always "30 days compressed to 12 minutes." Any developer or agent touching this metric must preserve this framing in full.
- **Microsoft Ecosystem positioning — LOCKED:** "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Readiness OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator. This framing lives in InvestorLanding ("The Operating Model Layer" section), InvestorPresentation (Platform Vision slide), and IDEAFramework. Do not revert to "Agentic Execution Layer" as product positioning — that phrase is retired.
- **Target users** — the full executive layer: CEOs, CFOs, COOs, CIOs, CMOs, Chief Strategy Officers, Division Presidents, Board of Directors, and all C-suite and executive leadership roles. Designed for every major industry — not sector-specific.
- **Industry scope** — cross-industry by design. Financial services, manufacturing, healthcare, energy, retail, technology, and beyond. Any organization — startup to Fortune 500 — facing strategic velocity challenges.
- **Enterprise Pricing Tiers (LOCKED — May 2026):** Three tiers for enterprise buyers — the product capability layer is what differentiates them, NOT relationship depth or support level. Old names (Enterprise / Enterprise Plus / Global) are **RETIRED**. New canonical names:
  - **Core** — $150K/yr — Full Readiness OS platform: 180 Readiness Protocols, continuous signal monitoring, 12-minute response orchestration. The complete operating model.
  - **Foresight** — $250K/yr — Everything in Core + **Digital Twin simulation** (Shadow Strategy Simulator at `/simulation-studio`) + **predictive foresight alerts** — war-gaming responses to triggers that haven't fired yet. This is a product capability tier, not just a support tier. ✅ **Demo confirmed ready (Rev 65, June 25 2026):** Shadow Strategy Simulator is fully functional — "SIMULATOR ACTIVE" badge, scenario text input, quick-fill example chips, simulation history panel, and Survive/Thrive/Lead scoring. Safe to use as a Foresight tier differentiator in sales and marketing.
  - **Enterprise** — $450K/yr — Everything in Foresight + **autonomous evolution network**: protocols that improve in aggregate across every client activation, proprietary compounding dataset. Multi-entity + global deployments. ✅ **Demo confirmed ready (Rev 65, June 25 2026):** ADVANCE 2.0 at `/advance-intelligence` is fully demonstrable — Learning Velocity Index (47 updates, 31 proven, 127 min saved, 23% of library), closed-loop visualization, pending action queue, 6-month velocity trend, and competitive moat panel all render correctly. Representative preview state shows a compelling demo before real activations exist. Safe to use as an Enterprise tier differentiator.
  - **Founding Partner Program** — $75K (90-day validation partnership, 100% credited to Year 1 subscription). This is the ENTRY PATH, not a fourth tier.
  - Any developer writing pricing copy must use Core / Foresight / Enterprise. The word "Global" as a tier name is retired. "Enterprise Plus" is retired. "Oracle Pro" is retired.
- **Growth Segment (`/growth`) — PERMANENT PRODUCT TRACK:** Targets SMBs and PE-backed startups. **Do NOT merge or confuse with the Founding Partner Program or the enterprise tiers above.** Three tiers: Ready $75K/yr ($7,500/mo) · Responsive $150K/yr ($15K/mo) · Orchestrated $250K/yr ($25K/mo). Annual = market rate; monthly = 20% premium (flexibility surcharge — "2 months free" framing on annual). Tiers = deployment scope (domains, playbooks, signals) — same platform at every tier, NOT a discounted product. No per-seat pricing. All Growth CTAs route to `/contact`. The enterprise conversion page is `/founding-partner-program` — completely separate audience, separate page, separate CTA. `/pilot-program` is an alias that resolves to `/founding-partner-program` (see Section 55).
- **Email Routing (canonical):** `sales@` → Contact/Growth inquiries | `info@` → Footer/Investor general | `pilot@` → Pilot program pages | `founding@vaughnmartin.com` → Founding Partner Program page (error fallback + questions CTA) | `support@` → Onboarding/customer success | `investor@vaughnmartin.com` → Investor contacts.

- **Canonical Product Value Story — Precise 5-Sequence Description (Rev 51, locked):** This is the defensible, grounded description of what Readiness OS actually does. Use this as the authoritative source for any website copy, investor materials, or sales assets. Every claim is verifiable against built platform capabilities.

  **Sequence 1 — Name every situation.** The organization defines every situation it may face. 180 pre-built Readiness Protocols across 9 strategic domains are available immediately. 30 compound protocols for cross-domain scenarios. Custom protocols built to match any situation the organization defines. 231 trigger patterns monitored continuously across 39 live data sources, updating every 15 minutes around the clock.

  **Sequence 2 — Define the threshold.** The organization defines what constitutes a threshold for each situation — not a single lagging metric, but multiple data points combined to meet the specific definition of when a situation crosses from monitor to act.

  **Sequence 3 — Four executive choices at the threshold.** When the threshold is crossed, the system does not send an alert and wait. It presents the executive with four structured choices. These four choices are **LOCKED UI LANGUAGE** — do not paraphrase or simplify:
  1. **Execute the protocol exactly as pre-staged** — full activation, no changes
  2. **Adjust the protocol before executing** — "Audible Called" — modify specifics, then activate
  3. **Choose an entirely different protocol** — select a different pre-staged response
  4. **Stand down with a governance record** — explicit decision not to act, timestamped and recorded

  One executive decision unlocks everything simultaneously: pre-staged tasks assigned to pre-defined roles, budget routing prepared, communications ready for coordinated deployment, stakeholders notified with the right context already attached. Not assembled at trigger time. Already built.

  **Sequence 4 — Coordinate through the existing stack.** The entire execution is coordinated through whatever technology stack the organization already uses. Microsoft, Salesforce, ServiceNow, Slack, Jira. 55+ pre-built connectors (`/universal-connector`). Readiness OS sits above the existing stack and orchestrates it — nothing gets replaced.

  **Sequence 5 — Encode every learning.** Every activation encodes what was learned back into the preparation before the next trigger arrives. The ADVANCE loop (`/advance-intelligence`) classifies every protocol update as proven or disproven after three subsequent activations. The platform gets measurably smarter with every use. The moat compounds.

  **The one-sentence version (locked):** "Readiness OS pre-stages the organizational response before the trigger fires so when it arrives the answer to every question is already built — who owns the decision, what the tasks are, who is notified, what the communications say, where the budget comes from, and what was learned from last time."

- **The Mobilization Tax (canonical framing):** The Mobilization Tax is the cost every organization pays before a single action is taken when a strategic trigger fires — leadership time, alignment meetings, escalation cycles, budget approval cycles — 30 days before execution begins. The ROI Calculator (`/roi-calculator`) quantifies this cost specifically for each organization using their own inputs: regulatory penalty avoidance, revenue protection during the 30-day mobilization window, operating cost elimination from the cycle itself, and vendor stack displacement. The "Mobilization Tax" phrase is cleared for use in all product copy, investor materials, and sales assets.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI Components | Radix UI + shadcn/ui, Tailwind CSS |
| Data Fetching | TanStack Query v5 (object-form only) |
| Routing | Wouter |
| Forms | React Hook Form + Zod + `zodResolver` |
| Animation | Framer Motion |
| Icons | Lucide React, `react-icons/si` for brand logos |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL via Drizzle ORM (Neon serverless) |
| Auth | Replit OIDC + Passport.js |
| Real-time | Socket.IO WebSocket server |
| Async Jobs | PostgreSQL-backed background job queue |
| AI | Azure OpenAI (primary), OpenAI GPT-4o (fallback) |
| Email | Resend (`RESEND_API_KEY`) — `vaughnmartin.com` domain verified (May 2026). All sends use `pilot@vaughnmartin.com` as primary sender; `onboarding@resend.dev` kept as fallback in `magicLinkService` only. Admin quick-links sent from `pilot@vaughnmartin.com`. |

---

## 3. Design System — The Only Colors Allowed

```
NAVY     = "#0A0F2E"   → headings, text, borders, small dark elements, buttons
NAVY_BG  = "#132558"   → large dark section backgrounds on Homepage (lighter — reads as genuine navy blue rather than near-black)
NAVY_MID = "#141B45"   → hover states, secondary dark surfaces
GOLD     = "#C9A84C"   → accents, labels, metric numbers, CTA highlights (NEVER as background)
GOLD_LT  = "#DFC178"   → gold on dark backgrounds, hover gold
TEAL     = "#2B8A6E"   → success, offense playbooks, progress bars, teal CTAs
TEAL_LT  = "#3BAF8A"   → teal on dark backgrounds
OFF      = "#F8F7F4"   → off-white page backgrounds, light card surfaces
BORDER   = "#E8E4DC"   → card borders, dividers, input borders
MUTED    = "#6B7280"   → helper text, secondary labels, timestamps
```

**Rules:**
- Red — crisis/alert severity ONLY (preserved as-is)
- Yellow/Orange — warnings ONLY
- Never use: `purple-*`, `violet-*`, `cyan-*`, `indigo-*`, `blue-600+` — replace with `teal-*` or `amber-*` equivalents. **May 13 audit:** purple instances removed from `activationPersonalization.ts` (KPI colors + avatar array), `navigation/config.ts` (DETECT section gradient), and `SignalConfiguration.tsx` (IDENTIFY step breadcrumb `#6366F1` → `#2B8A6E`).
- Light neutrals `bg-gray-50`, `bg-slate-50` are acceptable
- Playbook category badge colors (internal enum keys unchanged): `offense` → Teal | `defense` → Navy | `special_teams` → Gold. User-facing labels for these categories are **GROWTH & POSITIONING**, **RISK & RESILIENCE**, and **TRANSFORMATION** respectively — never "Offense," "Defense," or "Special Teams" in any visible UI copy (see Section 37).

**Color variable trap:** `Homepage.tsx` uses the local name `TEXT_MUTED` (not `MUTED`), and defines both `NAVY` and `NAVY_BG` locally. `NAVY_BG` is only used for large `<section>` backgrounds on the homepage — do NOT use it for text, borders, or buttons. Every other file uses only `NAVY`. Always check the constants block at the top of each file before referencing color variables.

**Homepage dark section visual treatment (do not remove):**
All navy `<section>` blocks on `Homepage.tsx` use three layers for visual depth:
1. Gold grid overlay — `backgroundImage` linear-gradient at `rgba(201,168,76,0.09)`, `1px` lines, `48px` grid
2. Radial gradient orbs — large teal and gold ellipses (600–1000px) positioned at edges/corners, opacity 0.11–0.22
3. `backdropFilter: "blur(4px)"` on inline badges/pills that sit on top of the grid

---

## 4. Project Structure

```
/
├── client/src/
│   ├── App.tsx                  ← All client-side routes (lazy-loaded)
│   ├── main.tsx                 ← React entry point
│   ├── pages/                   ← 209 page components
│   ├── components/
│   │   ├── layout/
│   │   │   ├── PageLayout.tsx   ← Wraps every page (StandardNav + Footer)
│   │   │   ├── StandardNav.tsx  ← Top nav with auth-aware CTAs
│   │   │   └── Footer.tsx
│   │   ├── configuration/
│   │   │   └── TriggerConfigurationWizard.tsx  ← 917-line wizard (critical — guard this)
│   │   ├── BoardDeckGenerator.tsx  ← Mounted in BoardBriefings.tsx
│   │   ├── AICopilotPanel.tsx      ← Mounted in Dashboard.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts           ← Primary auth hook
│   │   └── use-toast.ts         ← Toast notifications
│   └── lib/
│       ├── queryClient.ts       ← TanStack Query client + apiRequest helper
│       ├── api.ts               ← api.askAI and similar wrappers
│       └── authUtils.ts         ← isUnauthorizedError helper
├── server/
│   ├── index.ts                 ← Entry point + startup seeding
│   ├── routes.ts                ← Thin index: imports all domain route modules (~11k lines total)
│   ├── routes/                  ← Domain-scoped route modules (26 files)
│   │   ├── helpers.ts           ← Shared auth middleware (getUserId, requireOrgAccess, requireRole)
│   │   ├── activation-routes.ts ← /api/activations/*, /api/playbooks/:id/execute
│   │   ├── magic-link-routes.ts ← /api/auth/magic-link/*, /api/founding-partner/*, /api/trial/*
│   │   ├── signal-intelligence-routes.ts ← /api/signal-monitoring-config, /api/signal-calibration,
│   │   │                                    /api/leading-indicators, /api/signal-connectors,
│   │   │                                    /api/protocol-signal-profiles, /api/coordination-intelligence
│   │   ├── admin-routes.ts      ← /admin/* platform-admin routes
│   │   ├── org-setup-routes.ts  ← /api/config/* (triggers, departments, escalation, etc.)
│   │   ├── onboarding-routes.ts ← /api/onboarding-session, /api/onboarding/*
│   │   ├── dynamic-strategy-routes.ts ← /api/dynamic-strategy/*
│   │   ├── execution-sync-routes.ts   ← /api/sync/*, /api/execution-orchestration/*
│   │   ├── decision-coordination-routes.ts ← /api/decision-trees/*, /api/execution/*
│   │   └── intelligence-routes.ts, pilot-routes.ts, incident-routes.ts, and more
│   ├── storage.ts               ← IStorage interface + DrizzleStorage implementation
│   ├── replitAuth.ts            ← Replit OIDC + session setup
│   └── services/                ← AI, signal ingestion, dynamic strategy services
├── shared/
│   ├── schema.ts                ← Drizzle schema — single source of truth for all types
│   │                              (has ToC at top — search § markers to jump to sections)
│   └── intelligence-signals.ts  ← 248+ signal data points across 20 signal categories
├── dist/                        ← Pre-built production bundle (committed to repo)
├── docs/
│   ├── demos/                   ← Demo scripts, training guides, user guide
│   ├── deploy/                  ← Deployment, AWS, auth hardening, WebSocket notes
│   ├── dev/                     ← Design system, navigation, integration architecture
│   ├── product/                 ← Audits, roadmaps, platform inventory, phase plans
│   │   └── analysis/            ← Concept vs product, ITPE framework, enhancement roadmap
│   └── sales/                   ← Pitch decks, pilot briefs, qualification criteria
├── replit.md                    ← Project memory / architecture notes (root — Replit reads this)
└── developer-reference.md       ← This file (root — primary dev reference)
```

---

## 5. Authentication

### How It Works
Replit OIDC via Passport.js. Sessions stored in PostgreSQL (`sessions` table). New users auto-get an organization on first login. `onboardingCompleted: false` triggers the 5-step onboarding wizard.

### Auth Guard — Frontend `OnboardingGuard` (App.tsx)
Redirects new users to `/onboarding` **once per session** using a `useRef` flag (`hasRedirected`). After the first redirect, the user can navigate freely — the guard does NOT re-redirect on subsequent navigation. Do NOT revert to the old pattern (checking every navigation event) as it traps users on the onboarding page.

The onboarding wizard provides two escape hatches:
- **"Skip to Platform →"** button in the step view header (top-right of navy header)
- **"Skip for now"** link next to the "Begin Phase 1" button in the journey view

Both call `completeOnboardingMutation` → POST `/api/onboarding/complete` → invalidates `/api/auth/user` cache so `needsOnboarding` becomes `false` and the guard stops firing.

### Role-Based Access
`requireRole('admin', 'executive', 'strategist')` is applied to all write routes. Users with no role get read-only access (403 on write operations).

**Default role assignment (April 2026):** New users are automatically assigned the `Admin` role on first login via `upsertUser` in `server/storage.ts`. This prevents new Founding Partner customers from hitting 403 errors when deploying playbooks. All existing users were backfilled with Admin in April 2026.

**Critical DB note:** The `roles` table schema includes a `description` column that was missing from the production database until April 3, 2026. If the DB is ever re-created from scratch, run `npm run db:push` immediately after — a missing `description` column causes `requireRole` to throw a 500 on every protected route. Do NOT assume the schema is in sync; always verify with `SELECT column_name FROM information_schema.columns WHERE table_name = 'roles'`.

### Microsoft Azure AD / Entra SSO (Rev 59 — dormant until credentials set)

A second login path targeting enterprise customers sits alongside Replit OIDC. It uses direct OAuth 2.0 (not openid-client) to avoid multi-tenant issuer validation complexity.

**Files:**
- `server/microsoftAuth.ts` — all OAuth 2.0 logic (redirect → token exchange → Graph API → upsert user → session)
- `server/replitAuth.ts` — `upsertUser` and `isEmailAllowed` are now exported for reuse
- `server/authConfig.ts` — `/api/auth/microsoft` and `/api/auth/microsoft/callback` added to `PUBLIC_ROUTES`
- `server/routes.ts` — `setupMicrosoftAuth(app)` called immediately after `setupAuth(app)`
- `client/src/hooks/useAuth.ts` — `loginWithMicrosoft(returnTo?)` added and returned from hook
- `client/src/components/layout/StandardNav.tsx` — "Sign in with Microsoft" button (desktop + mobile) with inline SVG Microsoft logo

**Environment variables required to activate:**
| Variable | Source | Required |
|---|---|---|
| `AZURE_CLIENT_ID` | Azure portal → App registrations → Application (client) ID | Yes |
| `AZURE_CLIENT_SECRET` | Azure portal → Certificates & secrets → client secret value | Yes |
| `AZURE_TENANT_ID` | Specific tenant GUID, or omit to default to `organizations` (multi-tenant) | Optional |

**Behavior when credentials are absent:** `setupMicrosoftAuth` logs a single warning and returns — the rest of the platform is unaffected. The nav button is visible but the route is simply not registered.

**Security design:** State parameter CSRF protection on the redirect. Tokens validated server-to-server via Microsoft Graph API — no client-side token handling. Uses the same `isEmailAllowed` allowlist check as Replit OIDC. Session shape is compatible with existing session-sync middleware (`claims.email` is present for org resolution).

**Azure app registration setup (when ready):**
1. portal.azure.com → Azure Active Directory → App registrations → New registration
2. Supported account types: "Accounts in any organizational directory" (multi-tenant)
3. Redirect URI: `Web` → `https://[your-deployed-domain]/api/auth/microsoft/callback`
4. Certificates & secrets → New client secret → copy the **Value** (not the ID)

### Frontend Auth Hook
```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, isLoading, login, loginWithMicrosoft, logout } = useAuth();

// user shape:
// { id, email, firstName, lastName, profileImageUrl, role, initials, needsOnboarding }

// Navigate to Replit OIDC login:
login('/dashboard');                    // with returnTo
login();                                // to default landing

// Navigate to Microsoft Entra SSO:
loginWithMicrosoft('/dashboard');       // with returnTo
loginWithMicrosoft();                   // to default landing (/mission-control)

// Navigate to logout:
logout();
```

### Checking Auth in a Page
```tsx
const { user, isAuthenticated, isLoading } = useAuth();

if (isLoading) return <div>Loading...</div>;
// ✅ CORRECT — redirect unauthenticated users to request-access, NOT /api/login
if (!isAuthenticated) return <Navigate to="/request-access" />;
// ❌ WRONG — /api/login bypasses the branded access gate
// if (!isAuthenticated) return <Navigate to="/api/login" />;
```

### Server-side Auth Helpers (routes.ts)
```ts
function getUserId(req: any): string | undefined {
  if (req.isAuthenticated() && req.user?.claims?.sub) {
    return req.user.claims.sub;
  }
  return undefined;
}

// Pattern used in every protected route:
const userId = getUserId(req);
const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
if (!user[0]?.organizationId) {
  return res.status(404).json({ error: 'Organization not found' });
}
const orgId = user[0].organizationId;
```

---

## 6. Database

### Schema Location
`shared/schema.ts` — single source of truth. Never write SQL migrations manually.

### Migrations
```bash
npm run db:push
# If data-loss warning appears:
npm run db:push --force
```

### Key Tables
| Table | Purpose |
|---|---|
| `users` | User accounts with org/role associations |
| `organizations` | Enterprise org records |
| `strategicScenarios` | Playbooks (also called scenarios in the DB) |
| `executiveTriggers` | Signal triggers that activate playbooks |
| `playbookActivations` | Records of executed playbooks |
| `tasks` | Tasks within playbook executions |
| `triggerSignals` | Signals associated with triggers |
| `sessions` | Auth sessions (Passport.js) |
| `weakSignals` | Dynamic strategy weak signal detection |
| `oraclePatterns` | AI pattern recognition results |
| `investor_leads` | Gate form submissions from `/investor-resources`, `/investor-presentation`, `/board-briefings` |
| `founding_partner_applications` | Inline application submissions from `/founding-partner-program`. Fields: `id`, `name`, `email`, `company`, `title`, `companySize`, `primaryChallenge`, `timelineUrgency`, `createdAt`. POST route: `/api/founding-partner/apply` (public, no auth required). |

### Key Enums
```ts
strategicCategoryEnum: 'offense' | 'defense' | 'special_teams'
priorityEnum: 'low' | 'medium' | 'high' | 'critical'
statusEnum: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
riskLevelEnum: 'minimal' | 'low' | 'moderate' | 'high' | 'severe'
playbookPhaseEnum: 'prepare' | 'monitor' | 'execute' | 'learn'
```

### Adding a New Table
1. Add table definition to `shared/schema.ts`
2. Add `createInsertSchema`, insert type, and select type
3. Add methods to `IStorage` interface in `server/storage.ts`
4. Implement methods in `DrizzleStorage` class
5. Run `npm run db:push`

### Dev / Production Database Separation
`server/db.ts` protects production data using a conditional connection strategy:
```ts
const connectionString =
  process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL_DEV
    ? process.env.DATABASE_URL_DEV
    : process.env.DATABASE_URL;
```
- **Production** (`NODE_ENV=production`): always uses `DATABASE_URL`.
- **Development**: prefers `DATABASE_URL_DEV` if set; falls back to `DATABASE_URL` with an orange `⚠️ DEV WARNING` banner printed to the console at startup.
- **Setup:** Create a Neon branch from the production database → copy the branch connection string → add it as `DATABASE_URL_DEV` in Replit Secrets.
- **Rule:** Never run `npm run db:push` without first confirming which database is active. The startup warning tells you.

---

## 7. API Patterns

### Making a GET Request (frontend)
```tsx
import { useQuery } from '@tanstack/react-query';

// ✅ CORRECT — null-safe array pattern (ALWAYS use this for array queries)
// The default queryFn returns null (not undefined) for 401 responses.
// Destructuring default `= []` only catches undefined, NOT null — use Array.isArray instead.
const { data: playbooksRaw, isLoading } = useQuery<StrategicScenario[]>({
  queryKey: ['/api/scenarios'],
});
const playbooks = Array.isArray(playbooksRaw) ? playbooksRaw : [];

// ❌ WRONG — crashes with "null is not iterable" when user is not authenticated
// const { data: playbooks = [] } = useQuery<StrategicScenario[]>({ queryKey: ['/api/scenarios'] });

// With params (hierarchical key — invalidation works properly)
const { data: tasksRaw } = useQuery<Task[]>({
  queryKey: [`/api/tasks?scenarioId=${scenarioId}`],
  enabled: !!scenarioId,
});
const tasks = Array.isArray(tasksRaw) ? tasksRaw : [];

// For object queries (not arrays), null is safe — optional chain where needed:
const { data: scoreData } = useQuery<ScoreData | null>({
  queryKey: ['/api/preparedness/score'],
  retry: false,
  placeholderData: null,
});
// scoreData?.overallScore ?? 0  — safe
```

### Making a Mutation (POST/PATCH/DELETE)
```tsx
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

const createMutation = useMutation({
  mutationFn: (data: InsertScenario) =>
    // ⚠️ apiRequest returns a raw Response object — if you need the JSON body in
    // onSuccess, chain .then(res => res.json()). Omitting this means data in
    // onSuccess will be the Response object (data.url = the request URL, etc.).
    apiRequest('POST', '/api/scenarios', data).then(res => res.json()),
  onSuccess: (data: any) => {
    queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
    toast({ title: 'Playbook created successfully' });
  },
  onError: (error: any) => {
    // ✅ Always check for 401 — apiRequest throws Error("401: ...") for unauthenticated requests
    if (error?.message?.startsWith('401')) {
      toast({ title: 'Sign in required', description: 'Please sign in to continue.', variant: 'destructive' });
      setTimeout(() => { window.location.href = '/api/login'; }, 1500);
    } else {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  },
});

// Trigger it:
createMutation.mutate({ name: 'My Playbook', ... });

// Loading state:
createMutation.isPending
```

### apiRequest Helper
```ts
// Returns the full Response object — call .json() to read body
const res = await apiRequest('POST', '/api/scenarios', { name: 'Test' });
const data = await res.json();

// Methods: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
```

### Writing a New Route (server)
```ts
// In server/routes.ts, inside registerRoutes(app):
app.get('/api/my-endpoint', async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0]?.organizationId) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const result = await storage.getMyData(user[0].organizationId);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/my-endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Registered API Routes (key ones)
```
GET    /api/auth/user                      ← Current authenticated user
GET    /api/scenarios                      ← All playbooks for org
POST   /api/scenarios                      ← Create playbook
GET    /api/scenarios/:id                  ← Single playbook
GET    /api/executive-triggers             ← All triggers for org
POST   /api/executive-triggers             ← Create trigger
GET    /api/tasks                          ← Tasks (filter by scenarioId param)
GET    /api/dashboard/metrics              ← Dashboard summary metrics
GET    /api/preparedness/score             ← Org preparedness score
GET    /api/organizations/:id              ← Org details
POST   /api/onboarding/complete            ← Mark onboarding done
GET    /api/dynamic-strategy/status        ← Signal system status (requires auth+org)
GET    /api/dynamic-strategy/readiness     ← Future Readiness Index (requires auth+org)
GET    /api/dynamic-strategy/weak-signals  ← Active weak signals (requires auth+org)
GET    /api/dynamic-strategy/oracle-patterns ← AI patterns (requires auth+org)
GET    /api/playbook-library               ← 210-protocol library (180 core + 30 compound, IDs 181–210)
GET    /api/advance/learning-velocity      ← Learning Velocity Index (auth + org required)
GET    /api/advance/pending-queue          ← Auto-apply + exec-authorize update queues (auth + org)
GET    /api/advance/protocol-timeline/:id  ← Full version delta history for a protocol (auth + org)
PATCH  /api/preparation-updates/:id/apply-v2 ← Apply update with causal delta + hypothesis (auth + org)
POST   /api/advance/measure/:outcomeId     ← Trigger hypothesis measurement on close-out (auth + org)
GET    /api/playbook-library/:id           ← Single playbook detail (returns { playbook: {...} })
GET    /api/playbook-library/by-number/:n  ← Playbook by stable number (cross-env safe)
GET    /api/playbook-library/domains       ← 9 domain list
GET    /api/playbooks/:id/execution-brief  ← AI commander brief (auth required; fallback if OpenAI down)
GET    /api/practice-drills                ← Fire drill simulation
POST   /api/investor-access               ← Investor gate lead capture (public, no auth required)
GET    /api/investor-leads                ← Admin: view all investor gate leads (auth required)
```

---

## 8. Frontend Routing

All routes are in `client/src/App.tsx`. Every page is **lazy-loaded** with `lazy(() => import(...))`.

```tsx
// Adding a new page:
const MyPage = lazy(() => import("./pages/MyPage"));

// Inside <Switch>:
<Route path="/my-page" component={MyPage} />

// Route with params:
<Route path="/playbook-activation/:triggerId/:playbookId" component={ProtocolActivationConsole} />
// Read params in the component:
const [, params] = useRoute("/playbook-activation/:triggerId/:playbookId");
const playbookId = params?.playbookId;
```

### Navigation
```tsx
import { useLocation, Link } from 'wouter';

// Programmatic navigation:
const [, setLocation] = useLocation();
setLocation('/dashboard');

// Link component:
<Link href="/playbook-library">View Library</Link>
```

---

## 9. Page Layout Pattern

Every page must be wrapped in `PageLayout`:

```tsx
import PageLayout from '@/components/layout/PageLayout';

export default function MyPage() {
  return (
    <PageLayout>
      <div style={{ background: "#F8F7F4", minHeight: "100vh" }}>
        {/* Navy hero section */}
        <div style={{ background: "#0A0F2E", padding: "80px 48px" }}>
          <h1 style={{ color: "#fff", fontFamily: "serif" }}>Page Title</h1>
        </div>
        {/* Content */}
        <div className="max-w-[1600px] mx-auto px-6 py-12">
          ...
        </div>
      </div>
    </PageLayout>
  );
}
```

**Standard hero pattern (navy with gold grid overlay):**
```tsx
<div style={{ background: "#0A0F2E", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
  <div style={{
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)",
    backgroundSize: "44px 44px"
  }} />
  <div className="relative z-10 max-w-[1600px] mx-auto">
    <div className="flex items-center gap-2 mb-6">
      <div className="w-6 h-0.5" style={{ background: "#C9A84C" }} />
      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A84C" }}>
        Section Label
      </span>
    </div>
    <h1 className="text-5xl font-bold text-white">
      Page <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Title</em>
    </h1>
  </div>
</div>
```

---

## 10. Forms Pattern

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { insertScenarioSchema } from '@shared/schema';
import { z } from 'zod';

const formSchema = insertScenarioSchema.extend({
  name: z.string().min(3, 'Name must be at least 3 characters'),
});
type FormValues = z.infer<typeof formSchema>;

export default function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 11. Toast Notifications

```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success:
toast({ title: 'Saved', description: 'Your changes have been saved.' });

// Error:
toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
```

---

## 12. Playbook Library

- **180 Readiness Protocols** in 9 domains (seeded to DB on startup) — canonical marketing claim
- **30 compound protocols** (IDs 181–210): dual-track cross-domain crisis scenarios — **210 total**
- **170 of 210 enriched protocols** have full `enrichedPhases` content (4 phases each, role-specific tasks, decision gates, restrictions, communication assets, outcome framing). Started with 14 flagship set, grew to 23 via April 2026 migration (`server/scripts/fill-empty-playbooks.ts`), then expanded to 170 via `server/seeds/enrichAllPlaybooks.ts` batch runs. **40 unenriched remaining:** 14 single-domain protocols (IDs 111–134: EU AI Act, CFIUS, DORA, Pillar Two, ERP Failure, SaaS Price Shock, Channel Partner Conflict, Critical Infrastructure, App Store Removal, Greenwashing, Analyst Downgrade, Gov Contract, Burnout/Attrition, Agentic AI Policy) + all 26 compound protocols (IDs 185–210). Compound protocols were intentionally deferred — dual-track format requires a different enrichment prompt than the 4-phase single-domain structure. To enrich the 14 remaining single-domain ones: `npx tsx server/seeds/enrichAllPlaybooks.ts` (skips already-enriched, safe to re-run).
- **Public access model:** 3 playbooks are fully visible without authentication: "Aggressive Pricing Disruption", "AI Competitive Disruption", "Compound: Geopolitical + Supply Chain Disruption". These show full card content with an upsell CTA ("View Sample" button → `/playbook-library/:id`). All 177 others render as locked cards showing only domain name + "Founding Partner access required" label + "Request Access" button → `/founding-partner-program`. Authenticated users see all 180 with "Deploy" button → `/playbook-customize/:id`. The public/locked logic lives in `ProtocolDetail.tsx` (`isSampleView` flag) and `ProtocolLibrary.tsx` (`isLocked` flag) — never change the free sample set without founder approval. The `SAMPLE_PLAYBOOK_NAMES` Set must be identical in both files. **Note:** The page file was renamed from `PlaybookLibraryV2.tsx` → `ProtocolLibrary.tsx` and `PlaybookDetail.tsx` → `ProtocolDetail.tsx`.
- **Public-facing copy (locked):** Bottom CTA on sample playbooks reads: "You just read one of 3 public playbooks. 177 exclusive ones are already protecting your competitors." The 177 refers to locked Founding Partner–only protocols specifically — not 180 minus 1.

### Domain Names (exact DB strings — use these for filtering)
```
'Financial Strategy'      (24 playbooks)
'Market Dynamics'         (22)
'Operational Excellence'  (21)
'Technology & Innovation' (20)
'AI Governance'           (19)
'Market Opportunities'    (18)
'Brand & Reputation'      (17)
'Regulatory & Compliance' (15)
'Talent & Leadership'     (14)
```

### Strategic Categories
```
offense        → Teal color (#2B8A6E)
defense        → Navy color (#0A0F2E)
special_teams  → Gold color (#C9A84C)
```

### DOMAIN_DB_MAP (in ProtocolLibrary.tsx)
Maps UI filter button IDs to exact DB domain name strings. Update this if domain names change in the DB.

---

## 13. Key Components Reference

### `TriggerConfigurationWizard`
- Location: `client/src/components/configuration/TriggerConfigurationWizard.tsx`
- 917 lines. Full trigger creation/editing wizard with 5 steps.
- **CRITICAL:** This component was stripped by a color-pass subagent in March 2026. After ANY style-only refactor of `TriggersManagement.tsx`, verify this import still exists: `import TriggerConfigurationWizard from '@/components/configuration/TriggerConfigurationWizard'`

### `BoardDeckGenerator`
- Location: `client/src/components/BoardDeckGenerator.tsx`
- Props: `{ organizationId: string }`
- Mounted in: `client/src/pages/BoardBriefings.tsx`
- Generates executive board deck reports. Uses a simulated 2s delay then shows download toast.

### `AICopilotPanel`
- Location: `client/src/components/AICopilotPanel.tsx`
- No required props.
- Mounted in: `client/src/pages/Dashboard.tsx`
- Uses `api.askAI(query)` from `client/src/lib/api.ts` (that file exists — do not replace the import).

### Onboarding Shared Components (`client/src/components/onboarding/`)

Three purpose-built components added May 2026 (rev 39). Import from `@/components/onboarding/`.

#### `OnboardingRail`
- Location: `client/src/components/onboarding/OnboardingRail.tsx`
- Props: `{ currentStage?: 1|2|3|4, showMissionCard?: boolean }`
- Renders a 4-stage horizontal progress rail (Configure → Protocols → Signals → Ready) with gold/teal active/done states.
- Also renders a **First-Success Mission Card** below the rail (4 tasks: select protocol, configure trigger, run drill, generate brief). Each task writes `vm_fc_<key> = 'true'` to `localStorage` on click. When all 4 are done, the card is replaced by a completion banner.
- Set `showMissionCard={false}` to suppress the mission card (e.g. when the user is already live).
- Currently injected in: `GettingStarted.tsx` (stage derived from `overallScore`).
- **Do not** inject on public/unauthenticated pages — it calls `useLocation()` from wouter.

#### `WhyThisMatters`
- Location: `client/src/components/onboarding/WhyThisMatters.tsx`
- Props: `{ eyebrow?, headline, body, metric?: { value, label }, dark?: boolean }`
- A compact contextual panel with a teal left-border, eyebrow label, bold headline, and supporting body line. Optional metric stat block on the right.
- `dark={true}` flips to a dark-mode variant (navy/teal) for use inside dark-background pages.
- Currently injected in: `MissionControl.tsx` (after `<PageLayout>`), `ProtocolLibrary.tsx` (before the header block, wrapped in `{!embedded && (...)}`).
- ProtocolBuilder already has an equivalent "Why this matters" block built into its sidebar — do not add a second one.

#### `MicroHelp`
- Location: `client/src/components/onboarding/MicroHelp.tsx`
- Props: `{ trigger?: string, items: string[], variant?: 'warning' | 'tip' }`
- An expandable accordion-style hint block. Click to reveal a bulleted list of common mistakes or tips.
- `variant='warning'` → amber border/icon (default). `variant='tip'` → teal border/icon.
- Currently injected in: `NewUserJourney.tsx` step 4 (signal config mistakes), `ProtocolBuilder.tsx` step 1 case 0 (trigger definition mistakes).

---

### `PageLayout`
- Location: `client/src/components/layout/PageLayout.tsx`
- Props: `{ children, className?, showBackButton?, backButtonLabel?, embedded? }`
- Wraps every page with `StandardNav` + `Footer`.

### `StandardNav`
- Carries the logo on every page. Do NOT add a second logo inside page hero content.
- **Nav height: 130px** (`h-[130px]`). Logo: `<ExecuteIQLogo height={130} variant="full" color="navy" />`.
- **Three mega-menu dropdowns (left) + two top-level utility buttons:**
  1. **What We Do** — The Operating Model (How It Works, How It Executes, Strategic Foresight Engine `/readiness-oracle`, Platform Overview, IDEA Framework, Why Readiness OS) · Core Capabilities (Protocol Library, Trigger Monitoring, Signal Intelligence, Enterprise Ecosystems) · Technical Architecture (Execution Data Fabric, Institutional Memory Engine, Universal Connector, Integration Setup Plan) · Inside the Platform (Mission Control, Command Tower, etc.)
  2. **See It Work** — Try It Now (Protocol Coverage Browser, Industry Demo Library, Scenario Experience Center, Master Demo, 12-Minute Experience) · scenario demos by domain (Growth & Positioning, Risk & Resilience, Transformation)
  3. **The Proof** — Readiness Infrastructure, Why Readiness OS, Executive Brief, Readiness Benchmark — Free (`/readiness-benchmark`, featured), Research & Validation, ROI Calculator, Proof Story, Pricing & Plans (`/pricing`, featured)
- **Inline top-level buttons (gold — highest visibility for prospects):**
  - **"Benchmark"** → `/readiness-benchmark` — the free 3-minute readiness score. *(Was "Guide" → `/onboarding-guide` until May 2026. That was a customer onboarding page — wrong audience. Never revert to Guide/onboarding-guide.)*
  - **"Directory"** → `/sitemap` — full page/feature map
- Unauthenticated CTAs (right): "Request Founding Partner Access" (gold button, → /founding-partner-program), "Sign In" (ghost)
- Authenticated CTAs: user avatar/initials dropdown (Settings, Organization Setup, Sign Out) — no "Request Founding Partner Access" shown to signed-in users
- **Rule:** No user should ever need to type a URL — every page must be reachable through the UI (nav or footer)
- **Route conflict history:** `/why-execution-os` previously had a shadow route serving the old `WhyExecuteIQ` component (line 418 in App.tsx, removed). The legacy page now lives at `/why-execution-os-legacy`. Only `WhyExecutionOS.tsx` should ever serve `/why-execution-os`.

### Logo Sizing Reference (`ExecuteIQLogo` / `VaughnMartinLogo`)
- **`full` variant:** seal scales as `height * 0.88`; wordmark text is FIXED at 26px (VaughnMartin) + 10.5px (Execution OS) regardless of height
- **No simplified mode** — all seal details (arc text, dividers, diamonds, dot rays) render at every size
- **`navy` color on white/light bg:** full gold gradient ring, gold ticks, gold VM monogram, navy VAUGHNMARTIN text, teal EXECUTION OS text
- **`white`/`teal` on dark bg:** gold gradient ring + gold elements on dark interior
- **Sizing guide:**
  - Homepage nav: `height={130}`, nav `height: 130`
  - StandardNav: `height={130}`, `h-[130px]`
  - Footer top band: `height={80} color="white"`
  - Footer bottom bar: `height={72} color="light"` (via VaughnMartinLogo)
  - PageHero: `height={64} color="light"`
  - InvestorGate / InvestorLanding hero: `height={80} color="white"`
  - Homepage footer brand: `height={80} color="white"`

### Homepage Nav (SEPARATE from StandardNav)
- `Homepage.tsx` has its **own sticky nav bar** that is completely separate from `StandardNav`. It is NOT a `PageLayout` page — it manages its own header.
- Desktop links (flat, no dropdowns): **How It Works** → `/how-it-works` · **The Platform** → `/platform-overview` · **Experience** → `/industry-demos` · **Why Execution OS** → `/why-execution-os` · **Investors** → `/investors`
- CTA button (right): "Request Founding Partner Access" (gold, → /founding-partner-program)
- Mobile hamburger menu: same links, rendered as `<Link>` components (not `<button>` with `onClick`)
- **CRITICAL:** "How It Works" MUST use `<Link href="/how-it-works">` — never `onClick={() => scrollTo("how-it-works")}` or `scrollIntoView`. The `#how-it-works` anchor exists on the homepage but the nav link goes to the standalone page.
- **CRITICAL:** Do NOT merge HomepageNav into StandardNav or PageLayout. They are intentionally separate components.
- **"Partners" link (June 2026):** Both `HomepageNav` (desktop + mobile overlay) and `StandardNav` (unauthenticated main bar) now include a "Partners" link to `/channel-partners`. It sits between "The Proof" and "Pricing" in both navs. StandardNav also surfaces it inside the "What We Do" dropdown under a "Grow With VaughnMartin" section. Do NOT remove this — channel partner discovery was a documented gap.
- **"The Manifesto" link (April 10, 2026 — LOCKED):** "The Manifesto" is a nav item in `HomepageNav` (both desktop and mobile). Desktop: italic Cormorant Garamond, routes to `/founder-story`. Mobile: gold color. It sits alongside the standard nav links and signals the editorial/personal nature of the Founder Story. Do NOT remove it or move it to a dropdown. The Homepage founder quote block also links to `/founder-story` with the text: *"Why this company exists — and why it's named what it is →"* — this is the mid-funnel discovery path (after product hook).

### `ExecutionGapDiagram`
- Location: `client/src/components/ExecutionGapDiagram.tsx`
- SVG comparison: left panel = "72 HOURS LATER — STILL FIGURING IT OUT" (navy/red); right panel = "EXECUTION IS LIVE" (navy/teal). **Note:** The "72 HOURS LATER" label is intentional "before-state" visual copy — it depicts the *problem* state, not a baseline metric claim. This is NOT a violation of the retired 72-hour mobilization baseline rule (see Section 32). The comparison baseline metrics (3,600×, 30 days → 12 min) appear in the proof-numbers strip at the bottom. Do not change the left-panel label without founder approval.
- viewBox: `0 0 1320 762`
- Bottom bar: proof-numbers strip — 180 Readiness Protocols · 231 executive triggers · 248+ data points · 12 min to live execution. **NOT a football analogy** — do not revert.
- Used on: `Homepage.tsx`, `Investors.tsx`

### `ExecutionProcessDiagram`
- Location: `client/src/components/ExecutionProcessDiagram.tsx`
- SVG 3-layer flow: Strategic Layer (triggers) → Orchestration Layer (6 steps: context analysis, playbook selection, impact analysis, role assignment, task orchestration, communications) → Delivery Systems (Slack, Jira, Asana, Smartsheet, etc.) with 3-audience views (Teams/Managers/Executives)
- Embedded in: `HowItWorks.tsx` — **at the TOP of the page**, immediately after the phase nav bar (before section 01). Do NOT move it to the bottom.
- Section heading: "How 12 Minutes Actually Happens"

---

## 14. Key Pages Reference

| Page | Route | Purpose |
|---|---|---|
| `Dashboard.tsx` | `/dashboard` | Main logged-in home. Has AI Copilot panel. |
| `MissionControl.tsx` | `/mission-control` | Executive war room. Trigger activation → ProtocolActivationConsole. |
| `ProtocolLibrary.tsx` | `/playbook-library` | 180 Readiness Protocols with domain filter + free samples (renamed from `PlaybookLibraryV2.tsx`) |
| `ProtocolActivationConsole.tsx` | `/playbook-activation/:triggerId/:playbookId` | Live execution flow. `triggerId='manual'` skips trigger fetch. |
| `TriggersManagement.tsx` | `/triggers-management` | Create/view/edit triggers. Opens `TriggerConfigurationWizard`. Category filter is a **dynamic Select dropdown** built from real trigger data (not hardcoded). Status filter uses inline toggle buttons (All Status / Triggered / Active / Paused). "Conditions & Data" button opens the detail sheet with intelligence signal data points. **Auth gating:** All interactive controls (Activate Playbook, Add Rule, Edit, on/off toggles) are hidden from unauthenticated users — non-auth users see a "Sign In to Activate" button. Trigger data is visible to all. `SOURCE_LABELS` map (top of file) converts raw source IDs to readable labels shown as teal tags. `[location, setLocation] = useLocation()` — must destructure both. |
| `SignalConfiguration.tsx` | `/signal-configuration` | **Signal Intelligence Configuration.** All 17 signal categories from `shared/intelligence-signals.ts`. Each category expands to show all data points with individual on/off toggles. Category-level enable/disable all. Shows recommended playbooks per category and linked trigger count. Persist state via `signal_monitoring_config` DB table (per org, stores `disabledDataPoints[]`). API: `GET/PATCH /api/signal-monitoring-config`. Framework chain banner shows: Data Points → Triggers Fire → Playbook Executes. Linked from StandardNav "Capabilities" section. |
| `SignalIntelligenceHub.tsx` | `/signal-intelligence` | Live signal monitoring. Requires auth+org. Shows branded fallback if not. |
| `FounderStory.tsx` | `/founder-story` | Manifesto-first page. "We Make Enterprises Fearless" by Marty Brunke (March 2026) — 7 Roman-numeral sections, pull quotes, inline IDEA Framework navy card. Bio strip + video cards (90s intro, 3:30 full) are supporting sections below. Closing CTA → `/founding-partner-program`. **Do not revert to video-first or bio-first layout.** **"The Origin" prologue (LOCKED — April 10, 2026):** Inserted as the very first section, before Section I. Contains the founder's father's words from third grade football — "Prepare. Practice. Perform fearless. Never give up." — explains the VaughnMartin company name and maps directly to the platform thesis arc (Preparation → Readiness → Fearless). Never remove or rewrite this section. |
| `BoardBriefings.tsx` | `/board-briefings` | Board reports + AI Board Deck Generator. **Investor-gated** (see InvestorGate). |
| `InvestorResources.tsx` | `/investor-resources` | Full investor materials page. **Investor-gated**. |
| `InvestorPresentation.tsx` | `/investor-presentation` | Slide deck presentation view. **Investor-gated**. |
| `InvestorLanding.tsx` | `/investor-landing`, `/executive-access` | Full investor pitch page. Hero primary CTA: "Schedule a Conversation" → `/founding-partner-program`. Secondary: "See 8-Minute Demo" + "Investor Resources". Closing CTA section: "Let's Build This Together" with same priority order + `investor@vaughnmartin.com` contact line. **Previously redirected to `/how-it-works` — now a live route.** Public (not gated). |
| `Settings.tsx` | `/settings` | Admin settings. All buttons are functional (March 2026). |
| `OnboardingWizard.tsx` | `/onboarding` | 5-step new user setup |
| `PreparationDiagnostic.tsx` | `/preparation-diagnostic` | **Readiness Architecture Studio** — three-mode landing: (1) Full Setup (6-step wizard: Profile → Risk & Triggers → Priorities → Protocols → Authorization → Activate), (2) Build a Custom Protocol (4-step: Intent → Signal Coverage → Authorization → Package), (3) Customize Existing Protocol (selects from library). **Demo Quick-Start:** ivory section at the bottom of the landing with 5 industry buttons (Financial Services, Healthcare, Technology, Manufacturing, Energy) — clicking pre-fills `DEMO_PRESETS[industry]` and jumps directly to step 4 (Protocols, index 3) with `isDemoMode=true`. Demo mode shows a "Demo Mode · {industry}" teal badge in the wizard header. **Architecture View (step 4):** defaults to 3-column domain layout (GROWTH & POSITIONING / teal, RISK & RESILIENCE / red-navy, TRANSFORMATION / #1E3A5F — NOT purple) with protocol checkboxes, a Coverage % score (0–95% derived from selected protocol weights), and per-column coverage bars. **Save/Resume:** draft saved to `localStorage` key `vm_studio_draft` on every step change; a resume banner appears on landing if a draft is detected. **Stakeholder bridge:** at activation (step 6), selected domain owners with valid emails are POSTed to `POST /api/stakeholder-contacts` to seed org stakeholders. Linked from: StandardNav "What to Expect → Inside the Platform" (featured), StandardNav top bar. |
| `ExecutiveSummaryGenerator.tsx` | `/executive-summary` | AI-generated executive summaries |
| `FoundingPartnerProgram.tsx` | `/founding-partner-program` (alias: `/pilot-program`) | Primary enterprise conversion page — see Section 55 for full spec. `/pilot-program` is a permanent route alias; both routes render `FoundingPartnerProgram.tsx`. |
| `DemoAccess.tsx` | `/demo-access` | Token-gated executive access entry point. Reads `?token=` param, validates via `/api/demo-access`, then redirects to `/mission-control` (or `?returnTo=` value). **LOCKED executive access link: `https://vaughnmartin.com/demo-access?token=VMdemo2026`** — do not change this URL or token. |
| `TryDemo.tsx` | `/try-demo` | Scripted demo for unauthenticated visitors |
| `DemoExperience.tsx` | `/demo-experience` | Full-journey guided walkthrough — 9 steps across 3 phases (PREPARATION / RESPONSE / ADVANCE). Cold-open intro establishes pain before any product screen. No login required. See Section 18a. |
| `DemoHub.tsx` | `/demo-hub` | Experience Center hub — 13 scenario simulations across 3 strategic domains. Hero with domain pill navigation (GROWTH & POSITIONING / RISK & RESILIENCE / TRANSFORMATION). **Recommended Path navigator (rev 64):** 4-step sequence strip at top of content — Why It Exists → Full Scope → How It Executes → Your ROI — each step labeled with the question it answers. Three featured cards with "Best for:" labels distinguishing audience/use-case. **"What is a Readiness Protocol?" explainer panel (rev 64):** gold-border panel before domain grids defining the 4 components of every protocol (Tasks / Budget / Stakeholders / Brief). No auth required. |
| `PlannedUnplannedDemo.tsx` | `/demo/planned-unplanned` | **Complete Operating Model demo (rev 63) — 4-act interactive walkthrough.** Act 1: Q3 quarterly plan staged (GTM Launch, M&A Integration, Product Rollout — all running as Readiness Protocols). Act 2: Ransomware fires at 4:23 AM — side-by-side old model vs Readiness OS comparison. Act 3: Animated dual-track dashboard — both planned Q3 track and unplanned crisis track executing simultaneously. Act 4: The complete operating model close with Founding Partner CTA. **Product thesis:** same pre-staged infrastructure covers both planned (calendar/executive-triggered) and unplanned (signal-detected) work — one operating model, no mode-switching. This is the demo that dissolves the "we already do quarterly planning" objection. Linked from: DemoHub featured section, HowItExecutes completion CTA, TwelveMinuteTestDrive card, Homepage hero rotating simulation panel (4th scenario). |
| `GuidedStart.tsx` | `/begin`, `/start` | High-drama no-nav/no-auth guided demo. Three scenario cards with financial-stakes grids → animated DETECT phase → READY screen → auto-routes to `ProtocolActivationConsole`. |
| `StartHere.tsx` | `/entry` | First-time visitor entry page — 60-second orientation. **Three track cards** in a `repeat(3, 1fr)` grid: Enterprise Executive (→ `/founding-partner-brief`, GOLD accent), Channel Partner (→ `/channel-partners`, TEAL accent), and Investor (→ `/investor`, `#4A90C4` accent). Headline: "Three paths. One platform." Each card has a brief framing statement and 3 key stats. No login required. Linked from: StandardNav "See It Work" dropdown (first item, featured), Homepage track fork ("Not sure where to start?" link). |
| `ChannelPartners.tsx` | `/channel-partners` | **Public Channel Partner Program page — no auth required.** Hero: "Deliver the Operating Model Your Clients Are Missing." Four partner types: Management Consulting, Systems Integrators, Executive Advisory, Risk & Resilience Specialists. What Partners Get: 7 items (no public compensation figures — economics disclosed in direct founder conversation only, never on the page). The Model: 3-column grid (Your expertise / Our infrastructure / Client outcome). How It Works: 4-step integration path. Final CTA to `/founding-partner-program`. **⚠️ COMPENSATION RULE:** Do NOT add specific fee percentages, revenue-share figures, or pricing tiers to this page. Partner economics are discussed directly with the founder — they are not public. Use "Preferred partner economics — structured directly with the founder" as the placeholder. Linked from: **both HomepageNav and StandardNav** as "Partners" (main bar item between The Proof and Pricing). Also featured in StandardNav "What We Do" dropdown under "Grow With VaughnMartin" section. Also in StartHere.tsx as Channel Partner track card. |
| `FoundingPartnerBrief.tsx` | `/founding-partner-brief` | Enterprise buyer outcomes document — "What you get in 90 days." Three-phase milestone timeline (Days 1–30, 31–60, 61–90), included deliverables list, 4 Founding Partner seats remaining badge, and primary CTA to `/founding-partner-program`. Linked from: StandardNav "The Proof" dropdown (featured), Homepage track fork (Enterprise Executive card). |
| `ReadinessRhythm.tsx` | `/readiness-rhythm` | Readiness Operating Rhythm page — the cadence model for sustained preparation. Monthly/quarterly/annual rhythm breakdown, moat narrative, and differentiation from one-time implementations. Linked from: StandardNav "What We Do" dropdown under "The Operating Model" (featured). |
| `QuarterlyReadinessPlanning.tsx` | `/quarterly-planning` | **Auth-required.** 4-step guided workflow for quarterly protocol coverage planning. Step 1: Domain Review — 3 strategic domain cards (GROWTH & POSITIONING / RISK & RESILIENCE / TRANSFORMATION) each showing risk score, protocol count, and coverage %. Step 2: Priority Gaps — protocol gap table sorted by risk exposure. Step 3: Team Alignment — stakeholder assignment matrix. Step 4: Confirm Plan — summary + commit. Coverage stat strip across top (protocols reviewed, gaps identified, stakeholders aligned, next review date). **Terminology enforcement:** badge labels use "Risk Protocol / Risk Protocols" — never "Defense." Added June 2026. Linked from: StandardNav "Inside the Platform" section, StandardNav search items, **Platform Hub PREPARE column** (June 2026). |
| `PMOOnboarding.tsx` | `/pmo-onboarding` | **Preparation Architect Guide — auth-required.** Persona-specific onboarding path for the PMO Director / preparation architecture owner. Covers: 3-tier ownership model (C-suite = Authorization / PMO = Preparation Architecture / Functional = Execution), 4-phase go-live path with explicit PMO tasks per phase, and weekly/monthly/quarterly governance rhythm. Domain cards use executive language: Strategic Growth / Risk & Continuity / Transformation Preparation. **Updated June 2026:** coordinator insight section rewritten with executive-grade language; domain card labels renamed from football terminology to canonical domain names. Linked from: StandardNav "Inside the Platform" section, **Platform Hub PREPARE column** (June 2026). |
| `HowItWorks.tsx` | `/how-it-works` | Public explainer page. Structure: hero → phase nav bar → **ExecutionProcessDiagram (first!)** → sections 01–05 (Onboarding, Playbooks, Customization, Live Loop, Ongoing Value) → Final CTA. Linked from StandardNav Product→Understand AND homepage sticky nav. **Do NOT move the diagram to the bottom.** |
| `EcosystemDiagramPage.tsx` | `/ecosystem` | Public standalone page: "The Strategic Command Layer Above Microsoft's Agentic Stack." Embeds `ExecutionOSMicrosoftDiagram.tsx` (3-layer SVG — Execution OS → Integration touchpoints → Microsoft Full Stack). 3-step explanation strip, 5 integration callouts (Azure AI, Teams, Copilot Studio, Entra, Power Platform), pilot CTA. **Do NOT embed the main dev-server URL** — diagram is self-contained SVG. Linked from: StandardNav Platform→Capabilities (featured/gold-highlighted), Footer Company section, Investors page GTM card, and Homepage `MicrosoftEcosystemBanner`. |
| `EcosystemsHub.tsx` | `/ecosystems` | All-7-ecosystem hub page. Linked from Homepage Microsoft section "View All 7 Enterprise Ecosystems →" button and StandardNav. Child ecosystem pages: `/ecosystem` (Microsoft), `/ecosystem/google`, `/ecosystem/salesforce`, `/ecosystem/aws`, `/ecosystem/sap`, `/ecosystem/servicenow`, `/ecosystem/workday`. |
| `UniversalConnector.tsx` | `/universal-connector` | Integration catalog page. 55+ pre-built connectors organized across 8 categories: Identity/SSO, Communication, Project Management, ITSM, Security, ERP, CRM, and Cloud Infrastructure. Dedicated Microsoft Stack section with locked framing ("Every enterprise has Microsoft's AI stack. None have the operating model to use it.") — 4 live connectors (Teams, Outlook, SharePoint, Entra) + 4 roadmap (Copilot Studio, Power Automate, Sentinel, Fabric). Universal REST webhook approach with embedded code samples. Linked from: **StandardNav Technical Architecture section** (featured, replaces `/platform-integrations`), **Homepage `MicrosoftEcosystemBanner`** "View All 55+ Connectors →" gold CTA button. |
| `TechnicalOnboarding.tsx` | `/technical-onboarding` | Phased integration setup guide for Founding Partner customers. 6 phases: Identity & SSO → Communication & Notifications → Execution & Task Management → Signal Detection → Microsoft Stack → Go-Live Validation. Each phase lists connector requirements, estimated time, and completion criteria. Linked from: **StandardNav Technical Architecture section** (featured), **Homepage `MicrosoftEcosystemBanner`** "Integration Setup Plan" ghost CTA button, **GettingStarted** quick actions panel. |
| `WhyExecutionOS.tsx` | `/why-execution-os` | Competitive analysis page. Full breakdown: Copilot vs ServiceNow vs Palantir vs Everbridge vs GRC — positioned on a 2×2 grid (Speed vs Depth, Predict vs React). Closes with Microsoft positioning ("every enterprise already owns the engine — Execution OS is the transmission"). **Route conflict fix (March 2026):** A shadow route at this path previously served the old `WhyExecuteIQ` component — that shadow route was removed from App.tsx. The legacy page lives at `/why-execution-os-legacy`. Linked from: StandardNav Evidence dropdown (featured), HomepageNav. |
| `ExecutiveBrief.tsx` | `/executive-brief` | Shareable one-pager for board and C-suite prospects. Concise value prop, key metrics (3,600×, 12 min, 180 Readiness Protocols), IDEA Framework summary, and Microsoft positioning. Linked from: StandardNav Experience dropdown and Evidence dropdown. |
| `TheCase.tsx` | `/the-case` | The complete buying argument — single scrollable page that assembles the full value proposition in sequence: problem cost (qualitative Mobilization Tax categories) → proof stories (3 toggleable: Ransomware, Activist Investor, Supply Chain) → ADVANCE 2.0 moat (compounding metrics) → embedded ROI calculator (sliders) → competitor comparison (McKinsey retainer / ServiceNow / Readiness OS) → decision CTA. **Founding Partner card:** cost shown as "$75K · 90-day validation", verdict "Validation → License", outcome copy clarifies $75K credits in full toward annual license. Linked from: StandardNav Evidence dropdown (top featured item), Homepage StartHereSection (Step 01), Homepage "The Complete Buying Argument" callout strip (above final CTA). Target audience: CFO, CMO, CIO who needs to take the case to the board. No login required. |
| `FoundingPartnerPage.tsx` | `/founding-partner` | Public-facing Founding Partner Program pitch page (distinct from `/founding-partner-program` which has the inline application form). Contains: hero ("A partnership, not a purchase"), **Investment Comparison section** (consulting $75K–$300K vs. Founding Partner $75K — same 5-row comparison: Duration, Output, After engagement ends, Next trigger fires, Institutional memory — closes with navy bar "Same entry investment. Permanently different outcome."), What's Included grid (4 categories × 4 items), 90-Day Structure (4-phase timeline), Risk Reversal (Day 60 Guarantee, Full Fee Credit, Partial Refund), Who It's For / Not For panel, FAQ (6 questions), and CTA. **Do NOT add an inline application form here** — that lives in `FoundingPartnerProgram.tsx`. |
| `DesignLogic.tsx` | `/design-logic` | Research brief for written engagement — labeled "For written engagement — not for general distribution." No nav (standalone page with navy header + ivory body + navy footer). Written by Martin Brunke as a direct account of design decisions for researchers and governance practitioners. Covers: Origin (Stanford football → Fortune 1000 contrast), Core Design Thesis (3 decisions), **Three-Layer Architecture** (Preparation Architecture [Addressed] / Decision Survivability [Partially addressed] / Capability Survivability [In progress] — each layer mapped to platform features and honest status badge), 6 Enforced Items (Signal Threshold, Protocol Match, Four Decision Options, Task Deployment, Stakeholder Notification, Close Out Gate), Human Authority (why the executive authorization moment is the one non-delegable boundary), Close Out Gate four fields (I: What Held / II: What Did Not Hold / III: Preparation Gap [optional] / IV: The One Thing to Encode), ADVANCE Loop (why 3 activations, proven/disproven binary), The Boundary, and What I Have Not Yet Solved (behavioral confidence / capability survivability gap). Footer CTA: `info@vaughnmartin.com?subject=Design Logic — Response`. Used as the primary written-engagement asset for governance researchers (Dr. Kerry Huang, Jayashree Venkataraman). **No login required — fully public.** |
| `RequestAccess.tsx` | `/request-access` | Magic link intake form. Fields: name, email, company, title. On submit: (1) enrolls prospect in `stakeholder_contacts` for system + all existing orgs via `enrollProspectForAlerts()` — fires at form SUBMIT time, not link click; (2) saves token to `magic_link_tokens` DB table; (3) sends branded magic link email (`pilot@vaughnmartin.com` → fallback `onboarding@resend.dev`). Always returns `{ ok: true, emailSent: bool }` — never fails on the user side. Paired with `/api/auth/magic-link/verify?token=<token>` which: validates token (marks used, single-use only), creates user + session, fires `sendWelcomeTriggerDemo(email, firstName)` fire-and-forget (guaranteed "AI Competitive Disruption" trigger alert email, 94% confidence, bypasses RSS pipeline), then redirects to `/mission-control`. |
| `IndustryDemosHub.tsx` | `/industry-demos` | Hub page for all 4 industry scenario demos. Linked from: HomepageNav Experience, StandardNav Experience dropdown. |
| `FinancialRansomwareDemo.tsx` | `/industry-demo/financial-ransomware` | Financial services ransomware response scenario (600+ lines). Real-time incident timeline, 7 IDEA-phase tasks, CFO/CTO/CISO stakeholder map, $47M exposure model. |
| `PharmaceuticalRecallDemo.tsx` | `/industry-demo/pharmaceutical-recall` | Pharma recall scenario. FDA timeline, 170K-unit scope, cross-functional war room, regulatory communication tracks. |
| `ManufacturingSupplierDemo.tsx` | `/industry-demo/manufacturing-supplier` | Manufacturing supply disruption scenario. 14 downstream facilities, $2.3M/day exposure, alternate supplier routing. |
| `LuxuryCrisisDemo.tsx` | `/industry-demo/luxury-crisis` | Luxury brand reputational crisis scenario. Social velocity tracking, brand-protection playbook, executive comms choreography. |
| `TechnicalArchitecture.tsx` | `/technical-architecture` | Technical credibility asset for investor and enterprise procurement audiences. Four-layer architecture walkthrough: Signal Detection (39 feeds, 15-min cadence, √signals×8 risk formula), Protocol Mapping (231 triggers → 180 protocols, compound logic), Execution Engine (task seeding, authority chains, budget authorization, 90-sec handoff), Institutional Memory (activation records, debrief classification, ROI tracking). Microsoft integration map — 4 live (Teams, Outlook, SharePoint, Entra) vs. 4 roadmap (Copilot Studio, Power Automate, Sentinel, Fabric). Core data model (5 entities). Security summary with links to `/security-compliance`. No auth required. |
| `SecurityCompliance.tsx` | `/security-compliance` | Procurement-ready security one-pager. 6 sections (Auth, Infrastructure, Monitoring, AI Safety, Trust, Access). **Session additions:** SOC 2 Type II roadmap (3-phase tracker — Controls Inventory ✓, Gap Remediation in progress, Type II Audit Q3 2025 target), DPA & Legal section (data residency, retention schedule, right to deletion, AI data handling, sub-processor list), InfoSec FAQ (6 Q&A pre-answering pen test, data exit, GDPR, AI model access, incident response). Founding Partner CTA at bottom. |
| `FoundingPartnerProgram.tsx` | `/founding-partner-program` (also `/pilot-program` alias) | Public Founding Partner conversion page. Problem-first hero, "2026 Founding Partner Cohort · 2 Seats" scarcity badge, eligibility qualifier ("readiness, not revenue" — open to startup through Fortune 500, no revenue/budget floor), differentiation strip, inline `ApplicationForm` component (no redirect). Form fields: firstName, lastName, email, company, title, triggerDomain (optional), message (optional). On submit: POST `/api/founding-partner/apply` → saves to `founding_partner_applications` table → success state "We'll be in touch within 48 hours." Error fallback shows `founding@vaughnmartin.com`. Questions CTA also shows `founding@vaughnmartin.com`. All public "Founding Partner Access" CTAs across the product route here — never to `/request-access`. |
| `ReadinessBenchmark.tsx` | `/readiness-benchmark` | **Public lead magnet — no auth required.** Free 5-question readiness self-assessment. Peer benchmarks shown above the fold: Typical enterprise score: 22 / Founding Partner avg: 87 / Mobilization gap: 30 days. Questions cover: last mobilization time, protocol staging, trigger monitoring, stakeholder readiness, and debrief practice. Immediate 0–100 score on completion with interpretation band and Founding Partner CTA. Listed in nav: top-level gold "Benchmark" button + "The Proof" dropdown (featured, labeled "Readiness Benchmark — Free"). Also surfaced as a Homepage strip between the ThreeStepSection and MicrosoftHookStrip. Added May 2026. |
| `ReadinessOracle.tsx` | `/readiness-oracle` | **Strategic Foresight Engine vision page — no auth required.** Describes the Foresight tier capability: Digital Twin simulation, autonomous war-gaming, predictive foresight for triggers that haven't fired yet. Hero: "The response was ready before the trigger was even a pattern." Positioned as co-developed exclusively with Founding Partners. Listed in: StandardNav "What We Do → The Operating Model" (featured, labeled "Strategic Foresight Engine"), Pricing.tsx as Foresight tier differentiator. Added May 2026. |
| `ProtocolDetail.tsx` | `/playbook/:id` | Full playbook view (renamed from `PlaybookDetail.tsx`). Three tabs: Overview, Performance (auth-gated), Edit Tasks (auth-gated, only shown when `enrichedPhases` exist). Edit Tasks tab: phase accordion editor for name/objective, role task groups (add/remove/rename/edit items), decision gate (title/criteria/escalation), and restrictions. Saves via `PATCH /api/playbook-library/:id/customize` with `{ customizations: { enrichedPhases } }`. Amber dot on tab label = unsaved changes. `useEffect` syncs `editedPhases` from `playbook.enrichedPhases` on load. Helper callbacks: `updatePhase`, `updateTask`, `updateTaskItem`, `addTaskItem`, `removeTaskItem`, `addTaskGroup`, `removeTaskGroup`, `updateCriteria`, `addCriteria`, `removeCriteria`, `updateRestriction`, `addRestriction`, `removeRestriction`. |

---

## 15. Mission Control Activation Flow

When a Founding Partner clicks "Activate Response" on a pending trigger in Mission Control:

1. Local state animation runs (`setPendingTriggers` → `setActiveExecutions`) — visual only, fast
2. `useQuery` on `/api/scenarios` finds the best-matching real playbook by name (case-insensitive keyword match against `trigger.suggestedPlaybook`)
3. After 600ms delay: `setLocation('/playbook-activation/manual/' + matchedPlaybookId)`
4. `ProtocolActivationConsole` receives `triggerId='manual'` (skips trigger lookup) and `playbookId` from the real DB

If no playbook matches by name, uses `realPlaybooks[0]?.id`. If DB is empty, falls back to `/triggers-management`.

### ProtocolActivationConsole — Key Architecture

**Brand constants at module level.** `NAVY`, `GOLD`, `TEAL`, `MUTED`, `OFF`, `BORDER`, `CG` etc. are declared at the top of the file (outside the component function) so all helper sub-components defined in the same file can reference them without prop-drilling.

**BriefLoadingState component.** A standalone component defined *before* the `ProtocolActivationConsole` function in the same file. While GPT-4o generates the execution brief, it shows a 5-step animated checklist ticking through: Domain Analysis → Signal Synthesis → Stakeholder Mapping → Risk Assessment → Commander Brief. Uses `@keyframes scanBeam` and `@keyframes fadeInUp` defined in `index.css`.

**Execution Console Live War Room** (during active execution):
- **Stakeholder Notification Tracker** — domain-matched C-suite contacts (CFO/COO/CLO etc.) cycling through `Pending → Notified → Acknowledged`
- **Live Activity Feed** — timestamped war-room log entries appended every few seconds
- **Task cards** with action-type badge (ANALYZE / NOTIFY / CONVENE / BRIEF) and a gold pulse dot on the current in-progress task

**Auto-Task Seeding.** When a playbook is activated with zero DB tasks, 7 domain-specific tasks are generated in-memory keyed to the playbook's strategic domain. Tasks start `in_progress` and auto-progress every 20 seconds. `displayTasks` merges real DB tasks + seeded demo tasks identically for debrief scoring.

**Post-Activation Debrief.** Surfaces automatically on completion: 0–100 performance score, ROI dollar value (`$40/min × time saved vs 30-day mobilization baseline`), 4 metric cards, AI recommendation, CTAs. Shows "Concept Simulation" banner when running on seeded demo tasks. **Note:** The "72 hours" framing is RETIRED — always use the 30-day baseline.

---

## 16. Signal Intelligence Hub — Auth Handling

All `/api/dynamic-strategy/*` endpoints require a logged-in user with an associated organization. They return `{ error: 'Organization not found' }` with HTTP 404 if auth is missing.

Frontend handling (SignalIntelligenceHub.tsx):
- All dynamic-strategy queries have `retry: false` and `placeholderData: null` or `placeholderData: []`
- When the primary status query errors, the page renders a branded fallback panel (navy/gold card with "Executive Sign-In" + "Request Founding Partner Access" buttons) instead of a blank or broken page
- Authenticated Founding Partner customers see full live data

---

## 17. Settings Page — Admin Buttons

All buttons in `Settings.tsx` have `onClick` handlers as of March 2026:

| Button | data-testid | Action |
|---|---|---|
| Run Health Check | `button-system-health-check` | Simulates diagnostic, shows result toast after 2.5s |
| Restart Services | `button-restart-services` | Toast confirmation |
| View System Logs | `button-view-logs` | Navigate to `/audit-logging-center` |
| Add Enterprise User | `button-add-user` | Opens inline invite form (email input + send) |
| Bulk Import | `button-bulk-import` | Toast with implementation team contact |
| System Backup | `button-backup-system` | Toast confirmation |
| Optimize Performance | `button-performance-optimization` | Toast with status |
| Security Scan | `button-security-scan` | Navigate to `/audit-logging-center` |
| Generate Reports | `button-generate-reports` | Navigate to `/executive-summary` |
| Slack / Jira / Tableau | (integration buttons) | Navigate to `/integrations` |

---

## 18. Try Demo — Experience Design

**File:** `client/src/pages/TryDemo.tsx` | **Route:** `/try-demo` | **Auth:** None required

The demo is the primary conversion tool for unauthenticated visitors, Founding Partner prospects, and investors. It must work without a login and demonstrate the full IDEA framework value in ~90 seconds.

### 7-Phase Flow

| Phase | Key Behavior |
|---|---|
| **Select** | Before/after two-column explainer + 4 scenario cards |
| **Chaos** | Messages every 2s, revenue bleeds, user clicks to continue |
| **IDENTIFY** | Pre-staged playbook revealed, user clicks to continue |
| **DETECT** | Terminal AI scan, signals at 1.5s/3.5s/6s, auto-completes at 9s |
| **EXECUTE** | 8 actions fire over 11s, auto-advances to ADVANCE |
| **ADVANCE** | AI analysis, user clicks "See the Full Playbook" to continue |
| **Complete** | Real playbook from DB revealed + pilot CTA |

### Pacing Rules
- **Do NOT add auto-advance** to Chaos, IDENTIFY, or ADVANCE. These must be user-controlled — audiences need time to absorb each phase before the next starts.
- DETECT and EXECUTE auto-advance because they have continuous visual animation (signals appearing, actions firing) that shows completion naturally.

### Data Constants
```ts
SCENARIO_SIGNALS   // Record<scenarioId, Signal[]> — 3 signals per scenario with source, label, strength %
SCENARIO_ADVANCE   // Record<scenarioId, { stat, patterns[], improvements[] }> — AI analysis per scenario
```

Scenarios: `ransomware`, `competitor`, `regulatory`, `deal-risk`. Each `Scenario` object has `domain: string` and `domainCount: number` fields used on the scenario card.

### DETECT Terminal Design
- Navy Mac-style window chrome with 3 dots + monospace title
- Gold-tinted `DEMO MODE` bar below header: *"Timeline compressed for demonstration. In production, signal monitoring runs continuously every 15 minutes across all 248+ sources."*
- Confidence meter animates from 0% → signal strengths → 96%
- Green glow "Trigger Threshold Crossed" reveal when `detectStep >= 3`

### Phase-Specific Sidebar Narration
Each IDEA phase renders a contextual navy card in the right sidebar that explains WHY this phase is remarkable vs. the current state. Controlled by `currentPhase` value:
- `identify` → "Why This Was Ready" (playbook was pre-built before the crisis)
- `detect` → "What AI Just Replaced" (248+ sources vs. manual analyst scanning)
- `execute` → "What's Happening Right Now" (6 simultaneous actions listed)
- `advance` → "How The System Gets Smarter" (institutional memory explanation)

### Chaos Phase Labeling
A prominent dark red banner renders at the very top of the chaos phase:
> "This Is Your Current Reality — Without Execution OS"

This is critical — without it, first-time viewers cannot tell whether the flooding messages represent the product or the problem. The banner must remain.

---

## 18a. Demo Experience — Full Journey (`/demo-experience`)

**File:** `client/src/pages/DemoExperience.tsx` | **Route:** `/demo-experience` | **Auth:** None required | **Lines:** ~1,000 (self-contained)

The full-journey guided walkthrough — the deepest public demonstration of the platform. Designed for prospects who want to understand the complete system before a conversation, not just a 90-second clip. No login, no gating.

### Narrative Arc

**Pain → Understanding → Contrast → Outcome → Fearless**

The demo never opens with a product screen. It opens with a cold-open that establishes the status quo pain before the prospect has seen a single feature.

### Cold Open (Pre-Step Intro Screen)

Before the 9-step flow begins, the prospect sees:

> *"When a trigger fires, most organizations spend 30 days just to mobilize."*

Four scenario cards cover the most common situations:

| Card | Industry Audience | Financial Stakes |
|---|---|---|
| Ransomware | Financial services, healthcare, any CIO | $180K/hr exposure |
| Activist Investor | Public companies, PE-backed | $2.3B market cap at risk |
| Regulatory Investigation | Healthcare, pharma, financial | $847M penalty exposure |
| Supply Chain Collapse | Manufacturing, retail, consumer | 34% revenue impact |

Each card shows the industry type and dollar stakes so every prospect type sees themselves. Then the cold open closes with the canonical tagline:

> *"The response is ready before the trigger fires."*
> — 180 Readiness Protocols · 231 triggers · 12-minute response target

CTA: **"See a Full Activation →"** enters Step 1.

### 9-Step Flow

**PREPARATION phase (TEAL accent) — Steps 1–3**

| Step | Name | What It Shows |
|---|---|---|
| 1 | Command Center | What the platform looks like on a normal operating day — live monitoring, 0 active triggers, 18 Readiness Protocols active |
| 2 | Trigger Portfolio | How triggers are configured, mapped to protocols, and prioritized across all 3 domains |
| 3 | Protocol Library | Browse all 3 domains — 180 pre-built responses. The library that exists before any trigger fires |

**RESPONSE phase (GOLD accent) — Steps 4–7**

| Step | Name | What It Shows |
|---|---|---|
| 4 | Signal Detected | Live $180K/hr financial exposure counter ticking in real time. 0:16 elapsed — auto-detected |
| 5 | Protocol Staged | 22 tasks pre-assigned to pre-defined roles. 1:04 elapsed |
| 6 | War Room Active | 4 executives notified, coordination underway. 8:22 elapsed |
| 7 | Executive Authorizes | The one non-delegable decision. 9:47 elapsed |

**ADVANCE phase (#A78BFA accent) — Steps 8–9**

| Step | Name | What It Shows |
|---|---|---|
| 8 | Response Complete | 11:43 elapsed, OPTIMIZATION classification, 3,600× Execution Head Start |
| 9 | System Learns | Protocol updated, institutional memory, compounding moat. Closes: "Meridian Financial is no longer afraid of this scenario. **Fearless.**" |

### ComparisonStrip Component

A persistent strip renders **above the panel content on every Response phase step (steps 3–6 in 0-indexed terms, i.e., steps 4–7 in the numbered flow)**. It keeps the 30-day vs. 12-minute contrast alive throughout the Response phase — not just at the start and end.

```
| Readiness OS: [X elapsed] | Traditional response — same moment: [Day Y] |
```

| Step | Readiness OS | Traditional — same moment |
|---|---|---|
| Signal Detected | 0:16 · auto-detected | Day 1 · no human awareness yet |
| Protocol Staged | 1:04 · 22 tasks pre-assigned | Day 1 · emergency calls beginning |
| War Room Active | 8:22 · 4 executives notified | Day 2 · team still assembling |
| Executive Authorizes | 9:47 · authorization in progress | Day 3 · consultants engaged |

**Implementation:** `COMPARISON` array in `DemoExperience.tsx` has `null` entries for non-response steps and `{ elapsed, readiness, trad }` objects for response steps. The strip only renders when `COMPARISON[currentStep]` is non-null.

### CTA
Final screen CTA: **"Apply for Founding Partner Access"** — routes to `/founding-partner-program`. Sub-label: "90-day validation partnership." No invented cohort numbers or urgency claims.

### VaughnMartinLogo Usage
`VaughnMartinLogo` renders with `noLink` prop throughout — the logo's internal `<a>` tag must not be wrapped in any parent `<Link>` or `<a>`. See Section on Nested Anchor Fix.

### Linked From
- **Homepage hero** — ghost text CTA: "Experience the Platform →" (third, lowest-commitment path below primary + secondary CTAs)

---

## 19. GuidedStart Experience (`/begin`)

**File:** `client/src/pages/GuidedStart.tsx` | **Routes:** `/begin`, `/start` | **Auth:** None required

The highest-drama public entry point. No `PageLayout`, no nav, no header — full-screen immersive flow.

### Flow Phases

| Phase | What Happens |
|---|---|
| **SCENARIOS** | 3 cards with financial stakes grid ($2.1B deal, $340M revenue at risk, etc.), domain badge, urgency window, stakes label |
| **DETECT** | Animated signal counter counts 0→248. Two-column layout: left = step-by-step confirmation checklist; right = domain signal categories panel. Threat level gauge at step 3. |
| **READY** | Side-by-side "What's at Stake" vs "What Happens Next" panels. Scenario-specific financial figures and stakeholder count. |
| **→ Console** | Auto-fetches domain-matched playbook from `/api/playbook-library` (not `/api/playbooks`). Navigates to `ProtocolActivationConsole`. |

### Key Rules
- **Always use `/api/playbook-library`** — returns `{ playbooks: [...] }` at the top level. Filter by `domain` to find a match. Do NOT use `/api/playbooks` (different table, different shape).
- No login required at any point — entire flow is public.
- The DETECT animation runs ~12 seconds total to give the signal counter time to feel real.

### Natural Transition CTAs (site-wide pattern)
In-content links to `/begin` appear throughout the marketing site as plain underlined text (gold or teal, no button) to give the page a natural editorial flow:
- **Homepage ProblemSection** — end of section: "There is a better way — experience the 12-minute alternative live →"
- **Homepage IDEASection** — end of section: "Experience the IDEA Framework in real time →"
- **TryDemo** — mid-page between industry demos and playbook examples
- **HowItWorks** — final CTA block
- **Homepage hero** — primary CTA button: **"Try It Now — No Login Required →"** (routes to `/situation-scanner`). Secondary text link: "Apply for Founding Partner Access →" (routes to `/founding-partner-program`). Ghost text link: **"Experience the Platform →"** (routes to `/demo-experience`) — positioned below the two main CTAs as a third, lower-commitment discovery path. The Situation Scanner is the designated primary front door — do not restore "Request Founding Partner Access" as the hero primary CTA. Do not remove the ghost link to `/demo-experience`.

---

## 20. Build & Deployment

### Development
```bash
npm run dev        # Starts Vite + Express on port 5000
npm run db:push    # Push schema changes to DB (never write raw SQL)
```

### Production Build — Pre-built Strategy
```bash
# Run BOTH of these locally before publishing, then commit dist/:
npx vite build                                         # Rebuilds dist/public/ (~27 seconds)
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:vite --external:@vitejs/plugin-react --external:../vite.config
                                                       # Rebuilds dist/index.js (~1 second)

npm run start      # Production: NODE_ENV=production node dist/index.js
```

**Both `dist/public/` (frontend assets) and `dist/index.js` (server bundle) are committed to the repo.** The deployment build command is a complete no-op — the deployment platform runs nothing and serves the pre-committed bundles.

### Deployment Platform
- Replit Autoscale
- Custom domain: `vaughnmartin.com`
- Build command: **no-op** (`sh -c ":"`) — completes in milliseconds; all bundles are pre-committed
- Run command: `npm run start` → `NODE_ENV=production node dist/index.js`
- First customer org: `martybrunke` — org ID `aa9d3bf3-ab20-4fb6-a1da-e91aabbfb576`

### Server Startup Order — CRITICAL
The HTTP server is created with `createServer(app)` and starts `server.listen()` **IMMEDIATELY** at the top of `server/index.ts` (before the async IIFE). This ensures health check endpoints respond within milliseconds of startup. `registerRoutes(app, server)` accepts the pre-created server to attach Socket.IO WebSocket. Background seeding runs non-blocking after routes register. **DO NOT move `server.listen()` back inside `registerRoutes` or the async IIFE** — this causes provision health checks to time out.

In production, `express.static('dist/public')` and `app.get('/', sendFile(index.html))` are also registered **before** `server.listen()` (lines 293–301 of `server/index.ts`) so the healthcheck `GET /` returns 200 from the very first millisecond.

### Deployment Build Strategy — IMPORTANT
The full `npm run build` (vite + esbuild, ~25-30 seconds) was timing out on Replit's deployment infrastructure. The fix: **both** dist bundles are pre-built locally and committed to git. The deployment build step is a shell no-op:

Current `.replit` deployment config:
```toml
[deployment]
deploymentTarget = "autoscale"
build = ["sh", "-c", ":"]
run = ["npm", "run", "start"]
```

**Do NOT change `build` to any real build command.** It will time out in the Replit deployment environment. If the config ever gets reset, restore it with:
```javascript
await deployConfig({
  deploymentTarget: "autoscale",
  run: ["npm", "run", "start"],
  build: ["sh", "-c", ":"]
});
```

**Rule 14 amendment:** Before publishing, always run BOTH local builds and commit the updated `dist/` folder. The no-op build means the deployment platform uses exactly what is in git.

---

## 21. Critical Rules for Any Developer

1. **Never write raw SQL.** Always modify `shared/schema.ts` and run `npm run db:push`.
2. **Never edit `package.json` scripts, `vite.config.ts`, or `drizzle.config.ts`.**
3. **TanStack Query v5 — object form only.** `useQuery({ queryKey: [...] })` not `useQuery([...])`.
4. **Never use `import React from 'react'`.** The Vite JSX transformer handles it automatically.
5. **`<SelectItem>` always needs a `value` prop** or it will throw at runtime.
6. **One `export default function` per file. One `return` statement.** Never add code after the closing `}` of the default export.
7. **After any style-only refactor** of `TriggersManagement.tsx`, verify the `TriggerConfigurationWizard` import is still present. Color-pass subagents have stripped it before.
8. **Frontend env vars** use `import.meta.env.VITE_*`, not `process.env.*`.
9. **Navigation** — use Wouter's `<Link href=...>` and `setLocation()`. Never `window.location.href` for internal routes (except auth redirects which need `window.top`).
10. **Arrays in Drizzle schema** — use `text().array()` not `array(text())`.
11. **NEVER use `data: x = []` array destructuring with `useQuery`.** The default `getQueryFn` returns `null` (not `undefined`) for 401 unauthenticated responses. The `= []` default only catches `undefined`, so it silently fails with `null` and causes "null is not iterable" crashes. Always use: `const { data: raw } = useQuery(...); const x = Array.isArray(raw) ? raw : [];`
12. **All mutations that call protected POST endpoints must handle 401 in `onError`.** Check `error?.message?.startsWith('401')` and redirect to `/api/login` with a brief toast warning. Without this, unauthenticated users see a generic "failed" error with no path to signing in. See Section 7 mutation pattern for the full template.
13. **Domain is `vaughnmartin.com`.** All user-visible URLs, email senders, and copy must reference `vaughnmartin.com`. The server 301-redirects `executeiq.io` → `vaughnmartin.com`. Do NOT use the old domain in any new code or copy.
14. **Before deploying: run BOTH local builds and commit `dist/`.** The deployment build step is a no-op (`sh -c ":"`). The deployment platform serves exactly what is in git. Run: (1) `npx vite build` to update `dist/public/`, and (2) `npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:vite --external:@vitejs/plugin-react --external:../vite.config` to update `dist/index.js`. If you skip this, production will serve stale UI and/or stale server code.
15. **"Human-AI partnership" is RETIRED copy.** Never write this phrase on any page, card, slide, or tooltip. The approved replacement patterns are: "AI monitors, executives authorize" | "Executive authority preserved" | "AI monitors. Executives decide. Execution pre-staged." | "No playbook activates without executive approval." The distinction matters: we are not selling AI augmentation — we are selling the elimination of the 30-day mobilization cycle. The human decision is the same; the preparation that surrounds it is pre-staged.
16. **Homepage IDEA card copy is canonical — do not paraphrase.** The four IDEA narrative cards set the emotional tone of the product. Their content (especially the "while others are still in their first meeting" / "already executing" framing) must not be shortened, reworded, or replaced with feature-list bullets during any refactor.
17. **NFL / Coaching Analogy lives on IDEAFramework.tsx ONLY — not on the Homepage.** The `PlaybookAnalogySection` (4-card analogy: Game Planning → Reading the Field → Play Call → Film Study, mapped to IDENTIFY → DETECT → EXECUTE → ADVANCE) was moved from the Homepage to `client/src/pages/IDEAFramework.tsx` during the April 2026 Homepage restructure. It sits before the Governing Principle section on the IDEA Framework page (`/how-it-works-idea`). The pull quote ("60–80 strategic decisions per 3-hour game. Under 40 seconds each.") is the founder's core product origin story — treat the copy as locked. Do NOT add it back to Homepage.
18. **Deployment cache issue — always rebuild before publishing.** The Replit deployment serves the compiled `dist/` directory. If a code change is made but `npm run build` is not re-run before publishing, the old compiled bundle will be deployed. Always run `npm run build` and confirm success before clicking Publish. This is especially critical for copy-only changes which can otherwise appear to "not take effect" in production.

---

## 22. Playbook Seeding (Production)

Seeding logic is in `server/index.ts` as an additive migration:
- If playbook count < 180, only inserts missing compound playbooks by name lookup
- No destructive wipe — safe to run repeatedly
- `playbookLibrarySeed.ts` and `playbookLibrarySeed_PARTIAL.ts` in `server/seeds/` are NOT the active source of truth — the DB was seeded once from a complete run and is maintained additively

---

## 22a. ADVANCE 2.0 — Closed-Loop Causal Learning Engine

**Added:** May 2026 (rev 46) | **Service:** `server/services/AdvanceLoopService.ts`

Every activation close-out now triggers a causal learning cycle — not just a flag update. This is the architectural moat: the platform gets measurably smarter with each execution, and the improvement is proven, not assumed.

### How the Loop Works

```
Activation Complete
       ↓
Close-Out Gate (ownership verdict)
       ↓
measureHypothesesForActivation()   ← auto-triggered on every close-out
       ↓
Pending updates → applyUpdateWithDelta()
  • Mutates playbook record
  • Stores immutable version delta (protocol_version_deltas)
  • Creates causal hypothesis with expected impact (update_hypotheses)
       ↓
Next activation on same protocol
       ↓
measureHypothesesForActivation() classifies hypothesis:
  • proven     (actual improvement ≥ 80% of expected, ≥3 activations)
  • disproven  (no improvement or regression, ≥3 activations)
  • measuring  (fewer than 3 post-update activations)
```

### New DB Tables

| Table | Purpose |
|---|---|
| `protocol_version_deltas` | Immutable audit log of every protocol mutation — what changed, why, what was expected |
| `update_hypotheses` | Causal chain: hypothesis → measuring → proven/disproven. Links delta to outcome measurement |

> **Schema note:** These tables were created via direct SQL (not `npm run db:push`) because the interactive migration prompt blocked the normal flow. Run `npm run db:push` if re-creating the DB from scratch — the schema definitions are in `shared/schema.ts`.

### Key Methods

| Method | What It Does |
|---|---|
| `applyUpdateWithDelta(updateId, appliedBy)` | Mutates playbook record, stores immutable version delta, creates causal hypothesis with `expectedImpactMinutes` |
| `measureHypothesesForActivation(outcomeId)` | Auto-fires on every close-out. Compares expected vs actual response time across ≥3 post-update activations. Classifies as proven/disproven. |
| `getLearningVelocityIndex(orgId)` | Aggregates executive metrics: updates applied, proven improvements, total minutes saved, % of 180-protocol library with evidence-backed changes, top 10 by proven impact, 6-month velocity trend, moat in months |
| `getPendingUpdateQueue(orgId)` | Returns two queues: `autoApply` (signal calibrations, low-risk) and `requiresAuthorization` (ownership/protocol changes, exec sign-off required) |

### Update Queue Classification

| Queue | Update Types | Who Acts |
|---|---|---|
| `autoApply` (teal) | `signal_calibration` | System applies automatically |
| `requiresAuthorization` (amber) | `ownership_assignment`, `protocol_suggestion` | Executive must authorize — no protocol changes without human sign-off |

### API Routes (all require `requireOrgAccess`)

```
GET   /api/advance/learning-velocity       ← Learning Velocity Index dashboard data
GET   /api/advance/pending-queue           ← Auto-apply + exec-authorize queues
GET   /api/advance/protocol-timeline/:id   ← Full version delta history for a protocol
PATCH /api/preparation-updates/:id/apply-v2 ← Apply with causal delta + hypothesis creation
POST  /api/advance/measure/:outcomeId      ← Trigger hypothesis measurement (auto-called on close-out)
```

**Important:** `apply-v2` replaces the old `/apply` endpoint. `OrganizationalIntelligence.tsx` was updated to use `apply-v2`. Do NOT revert to the old endpoint — it only flipped a status flag and created no causal record.

### Dashboard Page

`client/src/pages/AdvanceIntelligence.tsx` at `/advance-intelligence` — authenticated, org-gated.

| Section | What It Shows |
|---|---|
| Learning Velocity Index | Updates applied, proven improvements, minutes saved, protocol library % with evidence, moat in months |
| Closed Loop Visualization | 5-stage cycle: Activation → Close-Out → Update Applied → Hypothesis Created → Proven/Disproven |
| Pending Action Queue | Auto-apply (teal) + Executive Authorization (amber) cards |
| 6-Month Velocity Trend | Bar chart of updates proven per month |
| Top Proven Improvements | Ranked by response time reduction, expandable |
| Competitive Moat Summary | Navy panel — months to rebuild this intelligence on any competitor platform |

**Zero-state behavior (June 2026):** When `updatesAppliedTotal === 0` (no activations yet), the dashboard renders a `PREVIEW_LVI` representative data set (74/100 score, 47 updates, 31 proven, 127 min saved, 23% of protocols) with a teal "REPRESENTATIVE PREVIEW" banner across the top. This prevents a blank/empty dashboard for new Founding Partners during the 90-day onboarding before real activations exist. All LVI stat displays use optional chaining (`lvi?.fieldName`) to prevent runtime errors. Do NOT remove the zero-state — it is intentional and sales-critical for demos.

Linked from: `WorkspaceAdvance` (featured first card), `OrganizationalIntelligence` (teal link panel at bottom).

---

## 22b. Protocol #0 Universal Response Infrastructure (June 2026, rev 65)

**Purpose:** Every org faces situations that match no specific protocol. Protocol #0 is the universal fallback — pre-staged authority, budget, and execution chain for any uncharted trigger. The response is ready before the situation is named.

### Two Architectural Gaps — Now Closed

**Gap 1 was:** Protocol #0 copy described pre-staged authority and budget, but nothing was actually stored. A trigger could fire with no configured authority chain, no budget envelope, no retainer contacts.

**Gap 1 is now:** A `protocol_zero_configs` table holds one record per org — primary + backup authority, emergency budget amount and currency, named retainers array, and a notification list. Configured once, valid for every future P0 activation. The `/protocol-zero-launch` page reads live config data and shows teal checkmarks when armed or gold "NEEDS SETUP" warnings when empty.

**Gap 2 was:** After every Protocol #0 close-out, the platform described learning from unknown triggers. Nothing actually happened — no draft protocol was created, no record kept.

**Gap 2 is now:** Every Protocol #0 close-out automatically generates a draft named protocol in `p0_generated_protocols`. `generateDraftFromP0Activation()` fires via `setImmediate` on the close-out route. `/protocol-zero-launch` shows the pending draft queue with Promote/Dismiss buttons. Promoted drafts move permanently into the Readiness Library.

### New DB Tables

| Table | Purpose |
|---|---|
| `protocol_zero_configs` | One record per org. Stores: `primaryAuthorityName`, `primaryAuthorityEmail`, `primaryAuthorityRole`, `backupAuthorityName`, `backupAuthorityEmail`, `backupAuthorityRole`, `emergencyBudgetAmount`, `emergencyBudgetCurrency`, `retainers` (JSONB array), `notificationList` (JSONB array), `configuredAt` |
| `p0_generated_protocols` | One record per P0 close-out. Stores: `activationId`, `orgId`, `situationTitle`, `domain`, `urgency`, `context`, `status` (`pending_review` / `promoted` / `dismissed`), `promotedAt`, `dismissedAt`, `createdAt` |

> **Schema note:** Both tables were created via direct SQL (not `npm run db:push`) because the interactive migration prompt blocked the normal flow on the unrelated `compliance_reports` table. Drizzle schema definitions are in `shared/schema.ts`. Run `npm run db:push` if re-creating the DB from scratch.

### New API Routes (all require `requireOrgAccess`)

```
GET   /api/protocol-zero/config              ← Returns current org config (or null if unconfigured)
POST  /api/protocol-zero/config              ← Upsert: insert-or-update for the org
GET   /api/protocol-zero/generated           ← All generated draft protocols for the org
PATCH /api/protocol-zero/generated/:id/status ← Promote or dismiss a draft (body: { status })
```

### New Storage Methods (`server/storage.ts`)

| Method | What It Does |
|---|---|
| `getProtocolZeroConfig(orgId)` | Returns config record or undefined |
| `upsertProtocolZeroConfig(orgId, data)` | Insert-or-update (ON CONFLICT DO UPDATE) |
| `getGeneratedProtocols(orgId)` | Returns all draft protocols for the org |
| `updateGeneratedProtocolStatus(id, status, timestamp)` | Promotes or dismisses a draft |

### AdvanceLoopService — New Method

`generateDraftFromP0Activation(outcomeId, orgId)` — called via `setImmediate` after every activation close-out (alongside the existing `measureHypothesesForActivation` call). Logic:

1. Loads the activation outcome; checks `playbookName` for "universal response" / "unknown trigger" / "uncharted" patterns — skips silently if not a P0 activation.
2. Checks for an existing pending draft for the same activationId — prevents duplicates.
3. Derives `situationTitle` from `activationReason` or `context`; sets domain to "Universal" and urgency based on signal strength.
4. Inserts a `p0_generated_protocols` record with `status: 'pending_review'`.

### Pages

| Component | Route | Notes |
|---|---|---|
| `ProtocolZeroLaunch.tsx` | `/protocol-zero-launch` | Manual trigger page — hero with stats, pre-staging panel (live from API, teal/gold per arm status), ADVANCE draft queue with Promote/Dismiss. StandardNav "Uncharted Trigger" button routes here. |
| `ProtocolZeroConfig.tsx` | `/protocol-zero-config` | 4-section configuration form — Authority Chain (primary + backup, 3-column grid), Emergency Budget, External Retainers (add/remove rows), Notification List (add/remove rows). Gold banner when unconfigured; teal success on save. Linked from pre-staging panel on `/protocol-zero-launch`. |

### Entry Points

- **StandardNav** — "Uncharted Trigger" button in the navigation (routes to `/protocol-zero-launch`)
- **ProtocolLibrary** — zero-results fallback shows Protocol #0 card when no protocols match a search
- **CommandTower** — P0 fallback panel in the live signal dashboard
- **ProtocolZeroLaunch** — "Configure now" / "Edit configuration" CTA routes to `/protocol-zero-config`

---

## 23. Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL production connection string |
| `DATABASE_URL_DEV` | Dev only | Neon branch connection string for development (optional — falls back to `DATABASE_URL` with a startup warning) |
| `SESSION_SECRET` | Yes | Express session signing secret |
| `REPL_ID` | Yes | Replit OIDC client ID |
| `ISSUER_URL` | Yes | OIDC issuer (default: `https://replit.com/oidc`) |
| `OPENAI_API_KEY` | Yes | GPT-4o access |
| `RESEND_API_KEY` | Yes | Email delivery (falls back to console log if absent) |
| `SENTRY_DSN` | Optional | Sentry project DSN for server-side error monitoring (graceful no-op if absent) |
| `VITE_SENTRY_DSN` | Optional | Sentry project DSN for frontend error monitoring (must be prefixed `VITE_` to be visible in browser) |
| `GITHUB_TOKEN` | Optional | Available if needed for GitHub integration |

---

*This file documents the state of the codebase as of May 2026 (rev 35). Update this file whenever you add new pages, change key patterns, wire new components, or alter the design system.*

---

## 24. Playbook ID Strategy — Stable vs. Environment-Specific UUIDs

**Problem solved (March 2026):** The production and development databases seed playbooks with different UUIDs because `gen_random_uuid()` runs at insert time. Any code that hardcodes a UUID will fail in one environment.

**Solution — use playbook numbers:**
- Playbook numbers (`playbookNumber` column) are deterministic and identical across all environments.
- The API supports both lookup strategies:
  - By UUID: `GET /api/playbook-library/:uuid` → returns `{ playbook: {...} }`
  - By number: `GET /api/playbook-library/by-number/:number` → returns flat `{ id, name, ... }`

**ProtocolDetail.tsx** handles both URL forms automatically:
- `/playbook-library/7ef2ee68-...` → UUID path (standard)
- `/playbook-library/5` → number path (resolved to UUID after fetch)
- Detection: `const isPlaybookNumber = /^\d+$/.test(id || '');`
- After fetch, `playbookUuid = playbook?.id` is used for all subsequent API calls (readiness, activate, drill, performance).

**TryDemo.tsx free sample playbooks — stable number map:**
| Playbook | Number | Name |
|---|---|---|
| 5 | Aggressive Pricing Disruption | Market Dynamics |
| 12 | Customer Consolidation to Competitor | Market Dynamics |
| 49 | SEC Investigation Notice | Regulatory & Compliance |
| 65 | Ransomware Attack | Cyber & Technology |
| 180 | AI Competitive Disruption | AI Governance |
| 182 | Compound: Geopolitical + Supply Chain | Compound |

**Rule going forward:** Never hardcode UUIDs in source code. Always use playbook numbers for cross-environment stable references.

---

## 25. WOW Features — 5 Strategic Differentiators (Added March 2026)

Five high-impact features that elevate the platform beyond dashboards into an irreplaceable execution layer. All are backed by GPT-4o and persisted to the database.

### DB Tables Added
| Table | Purpose |
|---|---|
| `compound_threat_alerts` | Cross-domain AI threat patterns |
| `roi_snapshots` | Period ROI summaries per org |
| `simulation_analyses` | Shadow simulation results |
| `strategic_recordings` | AI-generated playbooks from crisis notes |

### 1. Execution ROI Dashboard — `/roi-dashboard`
- **Component:** `client/src/pages/ROIDashboard.tsx`
- **Hero metric:** "Value Preserved This Period" in large gold type (calculated from activations × minutes saved × $3,472/min Fortune 1000 rate)
- **Views:** Summary (KPIs + time-saved bar chart) + Board Report (printable, GPT-framed executive headline + event timeline)
- **APIs:** `GET /api/roi/summary`, `GET /api/roi/board-report`

### 2. Compound Threat Intelligence — Dashboard embedded + standalone
- **Component:** `client/src/components/intelligence/CompoundThreatAlerts.tsx`
- **Mounted:** Compact mode in `Dashboard.tsx` (auto-hides when no active threats)
- **"Analyze Now"** button calls `POST /api/compound-threats/analyze` → GPT-4o cross-references all active signal categories for compound patterns
- **Alert cards:** domains involved, confidence %, AI hypothesis, dismiss action
- **APIs:** `GET /api/compound-threats`, `POST /api/compound-threats/analyze`, `PATCH /api/compound-threats/:id/dismiss`

### 3. Shadow Strategy Simulator — `/simulation-studio`
- **Component:** `client/src/pages/SimulationStudio.tsx` (full rebuild)
- **Input:** Free-text scenario (pre-loaded quick-pick examples)
- **Output:** Survive score (0-100) + Thrive score (0-100) via circular SVG gauges, AI executive analysis, activated domains, recommended playbooks, coverage gaps
- **Score colors:** ≥70 = teal, ≥45 = gold, <45 = red
- **APIs:** `POST /api/simulation/analyze`, `GET /api/simulation-analyses`

### 4. Strategic Recorder — `/strategic-recorder`
- **Component:** `client/src/pages/StrategicRecorder.tsx`
- **Purpose:** Convert tribal knowledge (crisis notes, post-mortems, email threads) into custom playbook outlines in minutes
- **Output cards:** name, domain badge, trigger, stakeholders, phase-by-phase task list, value proposition
- **Save flow:** per-card "Save" button (state-local; full library persistence via backend)
- **APIs:** `POST /api/strategic-recorder/analyze`, `GET /api/strategic-recordings`

### 5. War Room Pulse Map — Mission Control header section
- **Component:** `client/src/components/mission/PulseMap.tsx`
- **Mounted:** In `MissionControl.tsx` between the navy header and content grid
- **Visual:** 20 signal domains in 3 concentric SVG rings; nodes pulse red/orange when AT RISK/APPROACHING
- **Node sizing:** reflects trigger count per domain
- **Live stats panel:** at-risk count, approaching count, active activations, IDEA phase indicator
- **Data:** reads from `/api/executive-triggers` and `/api/playbook-activations` (no new API needed)

### Route Registration (App.tsx)
```
/roi-dashboard         → ROIDashboard
/simulation-studio     → SimulationStudioPage  (was previously redirected to /try-demo)
/strategic-recorder    → StrategicRecorder
```

### WOW Feature 401 Handling (Critical)
SimulationStudio, StrategicRecorder, and CompoundThreatAlerts all call protected POST endpoints from their primary action buttons ("Run Simulation", "Analyze Recording", "Analyze Now"). If the user is not authenticated, `apiRequest` throws `Error("401: ...")`. Each of these components has `onError` handlers that detect the 401 prefix and redirect to `/api/login` after a brief toast — rather than showing a generic "failed" message. This pattern must be preserved on any future WOW feature that calls a POST endpoint.

---

## 26. AI-Backed Activation Features (Added March 2026)

Three new features wired into the playbook execution flow, backed by GPT-4o.

### 1. AI Execution Brief — `ProtocolActivationConsole.tsx`

**What it does:** Before a Founding Partner confirms activation, a system-generated "commander brief" is displayed as a navy card. It reframes the playbook in military-command style with 6 structured fields.

**API endpoint:** `GET /api/playbooks/:id/execution-brief?triggerId=<uuid>`
- Route must be placed **before** `GET /api/playbooks/:id` in `routes.ts` to avoid the catch-all absorbing it
- Returns: `{ situationFraming, missionObjective, criticalRoles, topRisks, successIndicators, commanderNote }`
- Auth-gated: returns 401 if unauthenticated
- Falls back to a static template if OpenAI is unavailable (never shows an error state)

**OpenAI quota warning:** The platform uses a Replit-managed AI integration (`AI_INTEGRATIONS_OPENAI_API_KEY`). This key has a usage budget that resets periodically. When exhausted, AI brief generation and compound threat analysis fall back gracefully — no visible error, but AI content is replaced with static templates. The background compound threat auto-analysis (every 4 hours) consumes this budget silently. Before any sales demo where AI briefs will be shown live, verify the budget is not exhausted. Check Replit account billing settings to top up if needed.

**Frontend query key:** `['/api/playbooks', playbookId, 'execution-brief', triggerId]`

**Display:** Navy card with shield icon header, rendered above `<PreActivationImpactPreview>`. Loader while fetching. If `briefData` is null (OpenAI unavailable), shows a static fallback with the playbook name.

### 2. Post-Activation Debrief Screen — `ProtocolActivationConsole.tsx`

**What it does:** Replaces the old plain success message when `executionStatus === 'completed'`. Automatically surfaces a full debrief — no navigation required.

**Sections rendered:**
- **Hero banner:** Trophy icon, "Playbook Executed Successfully", speed multiplier (e.g. 3,600× vs. 30-day mobilization baseline), ROI dollar value pill (time saved × $40/min Fortune 1000 rate, formatted as $XK or $X.XM)
- **3 CTAs:** "Proceed to ADVANCE" (→ `/workspace?tab=advance`), "View ROI Dashboard" (→ `/roi-dashboard`), "Outcome Report" (→ `/activation-outcome/:id`)
- **ADVANCE Debrief Strip:** 4 metric cards — Performance Score (0–100), Time Preserved (hours), Tasks Completed (X/Y with %), Decision Velocity (Nx multiplier)
- **AI Recommendation:** Single actionable sentence based on score tier (Exceptional ≥90 / Strong ≥75 / On Track ≥60 / Needs Review <60), with link to ADVANCE workspace

**Performance score formula (local, no API call):**
```ts
const perfScore = Math.min(100, Math.round(
  (completedTasks / Math.max(displayTasks.length, 1)) * 60 +
  (isOnTrack ? 30 : 10) + 10
));
```

**ROI formula:** `timeSaved (minutes) × $40/min` → formatted as $XK or $X.XM. `timeSaved = industryStandard (30×24×60 = 43,200 minutes, the 30-day mobilization baseline) - elapsedMinutes`. Never use 72-hour baseline — that framing is retired. The resulting speed multiplier at 12-minute completion is 3,600× — the "360x" value that previously appeared as the default display was derived from the retired 72-hour baseline and has been replaced with "3,600×" everywhere.

**Pattern:** Uses an IIFE `{executionStatus === 'completed' && (() => { ... })()}` to scope local constants without adding state.

### 3. Auto-Task Seeding — `ProtocolActivationConsole.tsx`

**What it does:** When a playbook is activated with zero tasks in the database, the console automatically generates 7 domain-specific tasks and displays them as if they were real tasks — with live auto-progression every 20 seconds. This means any playbook in the library delivers an immediately compelling demo without requiring customer setup or database pre-population.

**Key variables:**
- `localDemoTasks: DemoTask[]` — state array holding generated tasks when no real tasks exist
- `displayTasks` — derived value: `safeTasks.length > 0 ? safeTasks : localDemoTasks`. Used everywhere instead of `safeTasks` for rendering, progress calc, score formula, and debrief.

**Domain task map (`DOMAIN_TASKS`):** 9 domain keys (Financial Strategy, Market Dynamics, Operational Excellence, Technology & Innovation, AI Governance, Brand & Reputation, Regulatory & Compliance, Talent & Leadership) each with 7 professional task descriptions. Falls back to `GENERIC_TASKS` (7 items) if domain doesn't match.

**Auto-progression `useEffect`:**
- Fires when `executionStatus === 'active'` and `localDemoTasks.length > 0`
- On mount: immediately sets first `pending` task to `in_progress`
- `setInterval` every 20 seconds: completes the current `in_progress` task AND starts the next `pending` task in one state update
- Cleans up interval on unmount

**Seeding trigger (in `handleConfirmActivation`):**
```ts
if (safeTasks.length === 0) {
  const domain = playbook?.domain || playbook?.strategicCategory || '';
  setLocalDemoTasks(generateDemoTasks(domain));
}
```

**Important:** `DemoTask` objects have `id: 'demo-task-N'` — never clash with real UUID task IDs. The debrief screen, progress bar, and all metric cards use `displayTasks` consistently.

### 4. Workspace Pages Embeddable Prop

**What it does:** All four IDEA workspace pages (`WorkspaceIdentify`, `WorkspaceDetect`, `WorkspaceExecute`, `WorkspaceAdvance`) accept an optional `{ embedded?: boolean }` prop. When `embedded=true`, the `<PageLayout>` wrapper is suppressed and just the inner content `<div>` is returned — enabling these pages to be composed as tab panels inside `WorkspaceHub.tsx` without double-wrapping the nav and footer.

**Pattern used in each file:**
```tsx
export default function WorkspaceIdentify({ embedded }: { embedded?: boolean } = {}) {
  const inner = (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* all content */}
    </div>
  );
  return embedded ? inner : <PageLayout>{inner}</PageLayout>;
}
```

### 5. Graduated Attention — Completed Task Collapse — `WorkspaceExecute.tsx`

**What it does:** In the MyActionsPanel inside WorkspaceExecute, completed tasks are collapsed into a single teal summary bar ("X tasks completed") with an expand/collapse chevron toggle. Active/pending tasks stay visible. This reduces visual noise for executives managing live executions.

**Component:** `MyActionsPanel` (sub-function inside WorkspaceExecute.tsx)
- `useState` for `showCompleted` (default: false)
- Completed tasks count shown in teal bar; clicking toggles visibility
- Collapsed view: teal `CheckCircle2` icon + "X tasks completed" + `ChevronDown/Up`

### 3. Source Governance Indicator — `ProtocolDetail.tsx`

**What it does:** A color-coded version status badge in the playbook detail sidebar that signals the governance state of the playbook's source data.

**Logic:**
```ts
const versionStr = playbook.version || '1.0';
const major = parseFloat(versionStr.split('.')[0] || '1');
// major >= 4 → 'recertification' (red)
// major >= 2 → 'review' (gold)
// else       → 'current' (teal)
```

**Colors:** Teal = Current (v1.x) | Gold = Under Review (v2–3.x) | Red = Recertification Required (v4+)

**Location in sidebar:** Renders as a card below the playbook stats, labeled "Source Governance." Uses an IIFE `{(() => { ... })()}` inside JSX for the version computation. Safely defaults to `'1.0'` if `playbook.version` is undefined (which it is for all current playbooks — all show Teal/Current).

---

## 27. Orphaned Pages — Decision Log (March 2026)

Seven page files were previously routed in `App.tsx` but had no navigation entry points — accessible only by direct URL. Each was reviewed and given an explicit disposition.

### Wired into Navigation (Footer)

| Route | Component | Lines | Decision & Rationale |
|---|---|---|---|
| `/ai-intelligence-suite` | `ComprehensiveAIIntelligence.tsx` | 851 | **Wired — Footer "Platform" column.** Full-featured AI intelligence hub with signal analysis, threat synthesis, and pattern detection. Substantive product capability, not a demo artifact. Deserves a permanent home; Footer is appropriate until a dedicated nav dropdown is added. |
| `/live-activation-center` | `LiveActivationCenter.tsx` | 887 | **Wired — Footer "Platform" column.** Real-time playbook monitoring with Socket.IO live updates. This is core EXECUTE-phase infrastructure. Should eventually be promoted to a primary nav item or linked from the activation console's "Monitor Live" button. |
| `/enterprise-metrics` | `EnterpriseMetrics.tsx` | 215 | **Wired — Footer "Platform" column.** Enterprise KPI dashboard with an `embedded` prop for use inside other pages. Small, focused, functional. Linked from Footer until it can be embedded into Dashboard or ROI Dashboard. |
| `/demo-router` | `DemoRouter.tsx` | 226 | **Wired — Footer "Demo" column.** Orchestration hub linking to all scenario-specific industry demos. Logical landing point for prospects exploring demo options. Complements `/try-demo` without duplicating it. |
| `/unified-platform` | `UnifiedEnterprisePlatform.tsx` | 1955 | **Wired — Footer "Platform" column.** Comprehensive platform overview (1,955 lines). Quality is high; content is relevant. Footer placement is appropriate as a deep-dive for prospects who want the full picture. Review for potential promotion to a primary nav item in a future session. |

### Converted to Redirects (Removed from Routing)

| Old Route | Component | Decision & Rationale |
|---|---|---|
| `/marketing-landing` | `MarketingLanding.tsx` | **Redirects → `/`.** 349-line page that duplicated the Homepage. No unique content. Keeping the route would split SEO and confuse Founding Partners. Redirect preserves any inbound links without exposing a duplicate. |
| `/one-click-demo` | `OneClickDemo.tsx` | **Redirects → `/try-demo`.** 511-line demo flow that duplicated TryDemo. The 7-phase TryDemo (`/try-demo`) is the canonical public demo experience. OneClickDemo had no differentiating content. Redirect preserves any inbound links. |

### Implementation Notes
- Both redirects use Wouter's `<Redirect>` component, not `useLocation`. No lazy import remains for either component.
- All five wired pages remain lazy-loaded in `App.tsx` and appear in the Footer under their relevant columns.
- `LiveActivationCenter` is a candidate for a future "Monitor Live" deep-link from `ProtocolActivationConsole.tsx` — this would be the natural user journey once a playbook is activated.

---

## 28. Route Architecture — Server-Side Decomposition (March 2026, updated June 2026)

`server/routes.ts` is a domain-composed file (~11k lines total). The bulk of routes live in dedicated modules under `server/routes/`. The main `routes.ts` acts as a thin registration index: imports and calls each module's `register*Routes(app)` function.

### Route Module Map

| File | Routes Covered | Auth Pattern |
|---|---|---|
| `server/routes/helpers.ts` | Shared auth middleware | — |
| `server/routes/activation-routes.ts` | `/api/activations/*`, `/api/playbooks/:id/execute` | `requireAuth` |
| `server/routes/magic-link-routes.ts` | `/api/unsubscribe`, `/api/auth/magic-link/*`, `/api/founding-partner/*`, `/api/trial/*` | Public / session |
| `server/routes/signal-intelligence-routes.ts` | `/api/signal-monitoring-config`, `/api/signal-calibration`, `/api/leading-indicator-detections`, `/api/signal-connectors`, `/api/protocol-signal-profiles`, `/api/trigger-evaluation-summary`, `/api/coordination-intelligence` | `requireOrgAccess` / public |
| `server/routes/org-setup-routes.ts` | `/api/config/triggers`, `/api/config/departments`, `/api/config/escalation-policies`, `/api/config/communication-channels`, `/api/config/success-metrics`, `/api/config/setup-progress` | `requireOrgAccess` |
| `server/routes/dynamic-strategy-routes.ts` | `/api/dynamic-strategy/*` (readiness, weak-signals, oracle-patterns, activity-feed) | `requireAuth` |
| `server/routes/onboarding-routes.ts` | `/api/onboarding-session`, `/api/onboarding/save`, `/api/onboarding/complete`, `/api/onboarding/seed-demo-data` | `getUserId` / `isAuthenticated` |
| `server/routes/execution-sync-routes.ts` | `/api/sync/*`, `/api/pre-approved-resources/*`, `/api/execution-orchestration/*` | `requireOrgAccess` / `requireAuth` |
| `server/routes/decision-coordination-routes.ts` | `/api/decision-trees/*`, `/api/execution/*`, `/api/strategic-objectives/*` | `requireAuth` / `requireOrgAccess` |
| `server/routes/intelligence-routes.ts` | Signal intelligence endpoints | `requireAuth` |
| `server/routes/pilot-routes.ts` | Pilot program endpoints | `requireAuth` |
| `server/routes/incident-routes.ts` | Incident management endpoints | `requireAuth` |
| `server/routes/playbookLibraryRoutes.ts` | `/api/playbook-library/*`, `/api/practice-drills/*` | Mixed |
| `server/routes/practiceDrillRoutes.ts` | Practice drill simulation | `requireAuth` |
| `server/routes/webhookRoutes.ts` | `/api/webhooks/*` (12 enterprise systems) | HMAC-verified |
| `server/routes/oauth-routes.ts` | `/api/oauth/*` (Jira, Slack) | Session-based |
| `server/routes/integrations.ts` | `/api/integrations/*` | `requireAuth` |

### Schema Navigation

`shared/schema.ts` (7,200+ lines) has a **Table of Contents** at the top of the file. Use `Ctrl+F` for `§` markers to jump directly to any domain section:

| Marker | Domain | Key Tables |
|---|---|---|
| `§ 1` | Enums | All pg enums |
| `§ 2` | Auth & Identity | `sessions`, `users`, `evalInviteTokens` |
| `§ 3` | Organizations | `organizations`, `businessUnits` |
| `§ 4` | Scenarios | `strategicScenarios` |
| `§ 5` | Execution Plan System | `scenarioExecutionPlans` → `executionInstanceTasks` |
| `§ 6` | Core Operational | `tasks`, RBAC, metrics, risks, insights, notifications |
| `§ 7` | Drizzle Relations | All table relation definitions |
| `§ 8` | Zod Schemas & Types | Insert schemas + TypeScript types (first batch) |
| `§ 9` | Advanced Intelligence | `decisionOutcomes`, `learningPatterns`, `institutionalMemory` |
| `§10` | Executive Strategy | `strategicAlerts`, `warRoomSessions`, `boardReports`, `executiveTriggers` |
| `§11` | Scenario Context System | `scenarioContext`, `triggerSignals`, `crisisSimulations`, `preparednessScores` |
| `§12` | Playbook System | `playbookDomains`, `playbookLibrary`, `playbookActivations`, `practiceDrills` |
| `§13` | McKinsey Operating Model | `mck_operating_model_assessments` + 7 `mck_*` tables |
| `§14` | Readiness Intelligence | `playbookVersions`, `readinessMetrics`, `oraclePatterns`, `weakSignals` |
| `§15` | Late-Added Tables | `testDriveLeads`, `customProtocols`, `allowedEmails`, signal calibration tables |
| `§16` | Founding Partner & ADVANCE 2.0 | `foundingPartnerApplications`, `preparationUpdates`, `protocolVersionDeltas` |
| `§17` | Microsoft & Certs | `microsoftConnectors`, `certificationRecords`, `boardFeedback` |
| `§18` | Protocol #0 Infrastructure (rev 65) | `protocol_zero_configs`, `p0_generated_protocols` |

### Registration Pattern
Each module exports a `register[Domain]Routes(app: Express)` function (sync or async). `server/routes.ts` imports and calls each at the correct position in registration order. Async registrars (`registerExecutionSyncRoutes`, `registerDecisionCoordinationRoutes`) are called with `await` since they contain top-level `await import()` calls.

### Auth Helpers (`server/routes/helpers.ts`)
```ts
getUserId(req)             // throws 401 if not authenticated
getOrgIdForUser(userId)    // looks up org from user record
requireOrgAccess           // middleware: sets req.orgId or 401
requireRole(...roles)      // middleware: checks req.user role
requireAuth                // middleware: isAuthenticated + getUserId
optionalAuth               // middleware: sets req.userId if present, no error if absent
```

---

## 29. Sentry Error Monitoring (March 2026)

Sentry is wired into both the server and frontend. Both are optional — the app starts and runs normally when the DSN env vars are absent.

### Server (`server/index.ts`)
```ts
import * as Sentry from "@sentry/node";
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 });
}
// After all routes are registered:
Sentry.setupExpressErrorHandler(app);
```

### Frontend (`client/src/main.tsx`)
```ts
import * as Sentry from "@sentry/react";
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, tracesSampleRate: 1.0 });
}
```

### Setup (when ready to activate)
1. Create a Sentry project at sentry.io → get the DSN
2. Add `SENTRY_DSN` to Replit Secrets (server)
3. Add `VITE_SENTRY_DSN` to Replit Secrets (frontend — must be prefixed `VITE_` to reach the browser)
4. Redeploy — Sentry will begin capturing errors automatically

---

## 30. Live Signal Detection — SignalEvaluationService Internals (March 2026)

The live signal pipeline is one of the most operationally sensitive parts of the system. Email alerts to pilot contacts are generated here. Any threshold change directly affects whether real alerts fire.

### Service Files
| File | Responsibility |
|---|---|
| `server/services/LiveSignalIngestionService.ts` | Fetches RSS feeds, classifies signals, calls evaluator |
| `server/services/SignalEvaluationService.ts` | Scores signals against 16 trigger patterns, creates detections |

### RSS Feed Sources (39 feeds, polled every 15 minutes)

Feeds are grouped by category. The `category` value is stored as `signalCategory` on every `trigger_detections` row.

#### MARKET & BUSINESS (10 feeds)
```
NY Times Business         → rss.nytimes.com/services/xml/rss/nyt/Business.xml
BBC Business              → feeds.bbci.co.uk/news/business/rss.xml
CNBC Business             → search.cnbc.com/rs/search/...
MarketWatch               → feeds.marketwatch.com/marketwatch/topstories/
NPR Business              → feeds.npr.org/1006/rss.xml
Google News Finance       → news.google.com/rss/topics/...
Entrepreneur              → feeds.feedburner.com/entrepreneur/latest
Reuters Business          → feeds.reuters.com/reuters/businessNews
AP Business               → feeds.apnews.com/apf-business
Business Wire             → businesswire.com/rss/home/?rss=G1
PR Newswire               → prnewswire.com/rss/news-releases-list.rss
```

#### REGULATORY & GOVERNMENT ENFORCEMENT (16 feeds)
```
Federal Register          → federalregister.gov/articles/search.rss (compliance terms)
SEC EDGAR 8-K             → sec.gov/cgi-bin/browse-edgar?type=8-K&output=atom
FTC                       → ftc.gov/rss.xml
DOJ                       → justice.gov/rss/news.xml
FDA (Food Safety)         → fda.gov/.../food-safety-recalls/rss.xml
OSHA                      → osha.gov/news/newsreleases/feed
EPA                       → epa.gov/newsreleases/search/rss
FINRA                     → finra.org/newsroom/rss.xml
CFPB                      → consumerfinance.gov/about-us/newsroom/feed/
NTSB                      → ntsb.gov/news/press-releases/Pages/feed.aspx
FDIC                      → fdic.gov/news/press-releases/feed.xml
OCC                       → occ.gov/news-issuances/news-releases/feed.xml
US Treasury               → home.treasury.gov/system/files/press-releases.rss
FERC                      → ferc.gov/news-events/news/press-releases/feed
EEOC                      → eeoc.gov/newsroom/rss.xml
NLRB                      → nlrb.gov/news-publications/news-releases/rss.xml
UK FCA                    → fca.org.uk/news/rss.xml                         ← jurisdiction: UK
```

#### CYBERSECURITY (2 feeds)
```
CISA                      → cisa.gov/cybersecurity-advisories/all.xml
SANS Internet Storm Center → isc.sans.edu/rssfeed_full.xml
```

#### ECONOMIC INDICATORS (4 feeds)
```
Bureau of Labor Statistics → bls.gov/feed/bls_latest.rss
Federal Reserve           → federalreserve.gov/feeds/press_all.xml
EIA (Energy)              → eia.gov/rss/todayinenergy.xml
ECB                       → ecb.europa.eu/rss/press.html                    ← jurisdiction: EU
```

#### HEALTH & SAFETY (2 feeds)
```
WHO                       → who.int/rss-feeds/news-english.xml              ← jurisdiction: global
HHS                       → hhs.gov/news/press/press-releases/rss.xml
```

#### GEOPOLITICAL & TRADE (3 feeds)
```
State Dept                → state.gov/press-releases/feed/                  ← jurisdiction: global
White House               → whitehouse.gov/briefing-room/statements-releases/feed/
CBP                       → cbp.gov/newsroom/regional-media-release/feed
```

**Jurisdiction inference** (`inferJurisdiction()` in `LiveSignalIngestionService.ts`):
- `UK` — UK FCA
- `EU` — ECB
- `global` — WHO, State Dept, White House
- `US` — all other feeds (default)

**Source confidence tier** (`getConfidenceTier()` in `LiveSignalIngestionService.ts`):
| Tier | Sources | Meaning |
|---|---|---|
| 1 | SEC EDGAR, CISA, DOJ, FTC, FDA, US Treasury, FDIC, OCC, EEOC, NLRB, FERC, White House, UK FCA, SANS ISC | Authoritative govt/regulatory — highest signal credibility |
| 2 | Reuters, Federal Register, Federal Reserve, EIA, ECB, HHS, CBP | Wire services and central banks — primary source |
| 3 | All others (NYT, BBC, CNBC, MarketWatch, etc.) | News/media — secondary interpretation |

Signal description passed to the evaluator:
```ts
`${item.title}${item.description ? ` — ${item.description.substring(0, 450)}` : ''}`
```

### Signal Intelligence Data Model (all fields on `trigger_detections`)

Every field is additive and nullable — all existing rows remain valid. All extraction runs in `LiveSignalIngestionService.ts`; all persistence in `SignalEvaluationService.ts`.

#### Batch 1 — Feed Context (added May 2026, rev 41)
| Column | Type | Source | Values |
|---|---|---|---|
| `signal_category` | varchar(50) | Feed `category` property | `market \| regulatory \| cybersecurity \| economic \| health \| geopolitical` |
| `jurisdiction` | varchar(50) | `inferJurisdiction(source)` | `US \| UK \| EU \| global` — UK FCA→UK, ECB→EU, WHO/State Dept/White House→global, all others→US |

#### Batch 2 — Protocol Graph Linkage (added May 2026, rev 42)
Links every live detection to the actual protocol record it recommended. **This is the field that wires the signal pipeline into the 180-protocol graph.**
| Column | Type | Source | Purpose |
|---|---|---|---|
| `protocol_id_matched` | uuid | Post-insert lookup in `playbook_library` via `ILIKE` on `recommendedPlaybook` name | Direct FK to `playbook_library.id` — enables joins, frequency analytics, protocol coverage maps |
| `protocol_number_matched` | integer | Same lookup | `playbook_library.playbook_number` (1–184) — human-readable reference for reporting |

Lookup runs post-insert (non-blocking). Console: `🔗 Linked detection to Protocol #73 (Ransomware Immediate Response)`.

#### Batch 3 — Regulatory Enforcement Detail (added May 2026, rev 42)
Powers precise routing across **~40–50 of the 231 triggers** sourced from the 17 regulatory feeds.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `enforcement_action_type` | varchar(50) | `extractEnforcementActionType(text)` | `fine \| investigation \| consent_order \| injunction \| criminal_indictment \| settlement \| advisory` |
| `regulator_agency` | varchar(100) | `extractRegulatoryAgency(source)` | `SEC \| FTC \| DOJ \| FDA \| EEOC \| NLRB \| FDIC \| OCC \| FERC \| OSHA \| EPA \| FINRA \| CFPB \| Treasury \| UK FCA \| Federal Register` — mapped directly from feed source name |

**Routing impact:** `enforcement_action_type: criminal_indictment` routes to Protocol #DOJ-Criminal; `fine` routes to Protocol #Regulatory-Penalty Response. Without this field both hit the same generic "Regulatory Enforcement Action" trigger.

#### Batch 4 — Cyber Threat Intelligence (added May 2026, rev 42)
CISA and SANS ISC already label severity and exploit status in their feeds. These fields capture that structure.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `threat_severity` | varchar(20) | `extractThreatSeverity(text)` | `critical \| high \| medium \| low` — CVSS-aligned keyword match |
| `exploit_status` | varchar(50) | `extractExploitStatus(text)` | `known_exploited \| proof_of_concept \| theoretical` — CISA KEV language |
| `affected_vendor` | varchar(200) | `extractAffectedVendor(text)` | Named vendor scan: Microsoft, Cisco, Fortinet, VMware, Palo Alto, Juniper, F5, Citrix, SolarWinds, Ivanti, MOVEit, Atlassian, Apache, OpenSSL |

**Routing impact:** `threat_severity: critical` + `exploit_status: known_exploited` activates Protocol #73 (Ransomware Immediate Response). `theoretical` activates Protocol #74 (Patch Compliance Sprint). Without these fields, both hit the same `Cybersecurity Breach Signal` trigger.

#### Batch 5 — Economic Indicator Detail (added May 2026, rev 42)
BLS, Federal Reserve, EIA, and ECB signals carry structured economic data in headlines. These fields make that structure queryable.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `economic_indicator_type` | varchar(50) | `extractEconomicIndicatorType(text, source)` | `interest_rate \| jobs_report \| CPI \| GDP \| energy_price \| monetary_policy` |
| `indicator_direction` | varchar(20) | `extractIndicatorDirection(text)` | `rising \| falling \| stable \| unexpected` — `unexpected` is the routing key for shock-level protocols |

**Routing impact:** `economic_indicator_type: interest_rate` + `indicator_direction: unexpected` triggers Protocol #88 (Recession Readiness Sprint). `stable` produces no alert. Without `indicator_direction`, both fire the same trigger.

#### Batch 6 — Trade & Geopolitical Action (added May 2026, rev 42)
State Dept, White House, and CBP signals carry action type and timeline signals in headlines.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `trade_action_type` | varchar(50) | `extractTradeActionType(text)` | `tariff \| sanction \| export_control \| embargo \| executive_order` |
| `effective_timeline` | varchar(20) | `extractEffectiveTimeline(text)` | `immediate \| 30_days \| 90_days \| proposed` — determines protocol urgency level |

**Routing impact:** `trade_action_type: sanction` + `effective_timeline: immediate` = emergency supply chain protocol. `proposed` = 90-day readiness sprint. Without `effective_timeline`, both activate the same protocol at the same urgency.

#### Batch 7 — Health & Safety Recall (added May 2026, rev 42)
FDA, HHS, and WHO feeds carry classification data for recalls and health advisories.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `recall_class` | varchar(20) | `extractRecallClass(text)` | `Class_I \| Class_II \| Class_III` — FDA classification (Class I = risk of serious injury/death) |
| `affected_product_type` | varchar(50) | `extractAffectedProductType(text, source)` | `food \| pharma \| medical_device \| vehicle \| consumer` |
| `recall_scope` | varchar(20) | `extractRecallScope(text)` | `regional \| national \| international` — geographic extent of the recall |

**Routing impact:** `recall_class: Class_I` + `affected_product_type: pharma` routes to Protocol #41 (Product Recall Emergency). `Class_III` routes to Protocol #42 (Voluntary Recall Management). `recall_scope: international` escalates to the multi-jurisdiction variant. Without `recall_class`, all recalls hit the same protocol.

#### Batch 8 — Market Signal Events (added May 2026, rev 43)
SEC EDGAR, Reuters, and financial news feeds carry structured event signals (8-K filings, earnings releases, M&A announcements).
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `signal_event_type` | varchar(50) | `extractSignalEventType(text)` | `acquisition \| merger \| bankruptcy \| earnings_miss \| leadership_change \| material_weakness \| restatement` |

**Routing impact:** `signal_event_type: material_weakness` routes to Protocol #67 (Financial Controls Emergency). `bankruptcy` routes to Protocol #72 (Distressed Asset Response). `leadership_change` + `earnings_miss` fires Activist Investor Readiness compound protocol.

#### Batch 9 — Sector Intelligence (added May 2026, rev 43)
Cross-domain sector classification, sourced from both CISA advisories (sector labels embedded in feeds) and text inference.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `affected_sector` | varchar(100) | `extractAffectedSector(text, source)` | `healthcare \| energy \| finance \| government \| tech \| manufacturing \| labor \| retail` — source-first, text-fallback |
| `named_sector` | varchar(100) | `extractNamedSector(text)` | sector explicitly named in enforcement/regulatory action |

**Routing impact:** `affected_sector` enables sector-scoped protocol filtering. CISA advisories that name `healthcare` route to the FDA/HIPAA protocol cluster vs. the generic cyber protocol.

#### Batch 10 — Enhanced Enforcement (added May 2026, rev 43)
Penalty magnitude is the most predictive routing signal for regulatory articles — a $200M DOJ settlement triggers different board-level protocols than a $500K SEC fine.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `penalty_amount_range` | varchar(20) | `extractPenaltyAmountRange(text)` | `<1M \| 1M-10M \| 10M-100M \| 100M+` — parsed from dollar amount in article text |

**Routing impact:** `100M+` activates Protocol #14 (Board Crisis Communication) in addition to the base regulatory protocol. `<1M` routes to routine compliance management.

#### Batch 11 — Enhanced Cyber Intelligence (added May 2026, rev 43)
CISA Known Exploited Vulnerabilities (KEV) catalog carries CVE IDs in advisory titles and body text.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `cve_id` | varchar(30) | `extractCveId(text)` | `CVE-YYYY-NNNNN` — extracted via regex; standardized to uppercase |

**Routing impact:** `cve_id` enables cross-detection correlation (same CVE appearing in multiple feeds = compound threat signal). Post-activation debriefs reference CVE IDs for technical writeups.

#### Batch 12 — Enhanced Economic Intelligence (added May 2026, rev 43)
The key insight: most economic signals are expected and non-routing. The `shock` magnitude value is the routing trigger for recession-level protocols.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `indicator_magnitude` | varchar(20) | `extractIndicatorMagnitude(text)` | `minor \| moderate \| significant \| shock` — linguistic severity extraction |
| `central_bank` | varchar(50) | `extractCentralBank(source)` | `Federal Reserve \| ECB` — source-level inference (100% reliable) |

**Routing impact:** `indicator_magnitude: shock` activates Protocol #88 (Economic Disruption Response). `central_bank: ECB` routes to the EU-jurisdiction economic protocol variants. `shock` + `ECB` = compound European financial crisis protocol.

#### Batch 13 — Enhanced Trade Intelligence (added May 2026, rev 43)
Trade partner identity is a first-order routing signal — China tariffs, Russia sanctions, and Iran export controls are entirely different protocol chains.
| Column | Type | Extraction function | Values |
|---|---|---|---|
| `trade_partner` | varchar(200) | `extractTradePartner(text)` | `China \| Russia \| Iran \| North Korea \| Mexico \| Canada \| India \| EU \| Saudi Arabia \| Venezuela \| Cuba` |
| `affected_hs_codes` | varchar(200) | `extractAffectedHsCodes(text)` | `semiconductors \| agriculture \| defense \| metals \| automotive \| pharma` — HS code category |

**Routing impact:** `trade_partner: China` + `affected_hs_codes: semiconductors` = Protocol #103 (Semiconductor Supply Chain Disruption). `trade_partner: Russia` = sanctions/energy variant. Without partner identity, all trade signals hit the generic Protocol #98 (Trade Policy Response).

#### Batch 14 — Trigger Graph Linkage (complete, rev 43)
Closes the loop between the 231 trigger patterns and every detected signal.
| Column | Type | Source | Values |
|---|---|---|---|
| `trigger_ids_matched` | text[] | `SignalEvaluationService` post-insert | `[triggerName]` — starts as single-element array of the firing trigger name; array type supports compound triggers (2+ simultaneous) in future releases |

**Routing impact:** Enables activation frequency analytics per trigger — "which of the 231 triggers fires most often for your org?" `trigger_ids_matched` joins against the trigger pattern catalog without requiring a lookup back through evaluation logs.

#### `signal_activity_log` table — 1 new column (rev 41)
| Column | Type | Source | Purpose |
|---|---|---|---|
| `source_confidence_tier` | integer | `getConfidenceTier(source)` | `1 \| 2 \| 3` — tier at scan time. Makes data provenance visible in Command Tower without a join. |

#### Full column summary for `trigger_detections` (rev 43 — complete)

All 26 intelligence columns added since rev 41 (all nullable/array, all additive — zero impact to existing rows):
```
signal_category          varchar(50)   — feed category
jurisdiction             varchar(50)   — US | UK | EU | global
protocol_id_matched      uuid          — playbook_library.id (P1 graph linkage)
protocol_number_matched  integer       — playbook_library.playbook_number (1–184)
enforcement_action_type  varchar(50)   — fine | investigation | consent_order | injunction | criminal_indictment | settlement | advisory
regulator_agency         varchar(100)  — SEC | FTC | DOJ | FDA | EEOC | NLRB | FDIC | OCC | FERC | OSHA | EPA | FINRA | CFPB | Treasury | UK FCA
penalty_amount_range     varchar(20)   — <1M | 1M-10M | 10M-100M | 100M+
named_sector             varchar(100)  — sector named in enforcement action
threat_severity          varchar(20)   — critical | high | medium | low
exploit_status           varchar(50)   — known_exploited | proof_of_concept | theoretical
affected_vendor          varchar(200)  — Microsoft | Cisco | Fortinet | VMware | Palo Alto | etc.
cve_id                   varchar(30)   — CVE-YYYY-NNNNN (CISA/SANS feeds)
affected_sector          varchar(100)  — healthcare | energy | finance | government | tech | manufacturing | labor | retail
economic_indicator_type  varchar(50)   — interest_rate | jobs_report | CPI | GDP | energy_price | monetary_policy
indicator_direction      varchar(20)   — rising | falling | stable | unexpected
indicator_magnitude      varchar(20)   — minor | moderate | significant | shock
central_bank             varchar(50)   — Federal Reserve | ECB
trade_action_type        varchar(50)   — tariff | sanction | export_control | embargo | executive_order
effective_timeline       varchar(20)   — immediate | 30_days | 90_days | proposed
trade_partner            varchar(200)  — China | Russia | Iran | North Korea | Mexico | EU | etc.
affected_hs_codes        varchar(200)  — semiconductors | agriculture | defense | metals | automotive | pharma
recall_class             varchar(20)   — Class_I | Class_II | Class_III
affected_product_type    varchar(50)   — food | pharma | medical_device | vehicle | consumer
recall_scope             varchar(20)   — regional | national | international
signal_event_type        varchar(50)   — acquisition | merger | bankruptcy | earnings_miss | leadership_change | material_weakness | restatement
trigger_ids_matched      text[]        — [triggerName, ...] — all trigger patterns that matched
```

### Signal Feed Manager (UI — May 2026)
Per-org feed selection is managed in **`client/src/pages/SignalConfiguration.tsx`** — collapsible "Signal Feed Sources" panel.

- Displays all 39 feeds grouped by category
- Per-feed toggle (enable/disable) and per-category toggle (enable/disable all in category)
- Persisted as `disabled_feeds text[]` on `signal_monitoring_config` (additive column — empty array = all 39 feeds active)
- Feed catalog served by `GET /api/signal-feeds` (auth-required), backed by `getFeedCatalog()` export in `LiveSignalIngestionService.ts`
- PATCH `/api/signal-monitoring-config` accepts `disabledFeeds` as an independent field

### Evaluation Rules (CRITICAL — do not change without founder sign-off)
```ts
CONFIDENCE_THRESHOLD = 72   // Minimum confidence % for a detection to be created and emailed
MIN_KEYWORD_MATCHES = 3      // Signal must match 3+ keywords from a pattern before scoring
```
- **Why 3 keywords:** Ensures the article is substantively about the trigger domain, not tangentially mentioning a term. A single keyword hit should never trigger a playbook-level alert.
- **Why 72%:** Documented threshold matching system-wide canonical value. Raising it (e.g. to 78%) caused silent detection failure — signals that would have fired at 82-84% fell below the gap and never emailed. Do NOT raise this value.
- **Deduplication:** Once a trigger name fires, it will not fire again for 4 hours (prevents alert fatigue from repeated similar articles).

### Trigger Pattern Set (16 patterns in `evaluateSignal`)
Each pattern has a name, domain, confidence base, and keyword list. Examples:
- `"M&A Activity Detected"` — Market Dynamics — keywords: merger, acquisition, takeover, buyout, deal, consolidation, …
- `"Supply Chain Disruption"` — Supply Chain & Operations — keywords: supply chain, shortage, logistics, disruption, …
- `"Regulatory Enforcement Action"` — Regulatory & Compliance — keywords: SEC, FTC, DOJ, enforcement, fine, penalty, …
- (full list in `server/services/SignalEvaluationService.ts`)

### Auto-Start (routes.ts ~line 6915)
```ts
liveSignalIngestionService.start('system', 15);  // 'system' org, 15-min interval
```
`'system'` is a non-UUID org ID. `getOrgEvaluationMode()` returns `'default'` for any non-UUID org ID, so the auto-start always uses the default 16-pattern engine regardless of configured engine settings.

### What "notified" Status Means
Detections stored in `trigger_detections` with `status: 'notified'` have had their email sent. The email is sent via Resend to all stakeholder contacts associated with the org (5 contacts for the system org, seeded as `pilot@vaughnmartin.com`).

### Historical Behavior (March 30–31, 2026)
- March 30: 8 detections fired (74–90% confidence) — heavy news day (tariffs, M&A, regulatory, geopolitical)
- March 31: 0 detections — quieter news day; signals didn't reach 3-keyword density in any pattern
- This is **correct behavior** — the system is news-driven, not a synthetic heartbeat

---

## 31. Welcome Trigger Demo Email (April 2026)

Every new magic link user receives a guaranteed "AI Competitive Disruption" trigger alert email on first token activation — regardless of whether the live RSS pipeline has fired anything. This is a deliberate product decision: new users need to see the alert experience immediately to understand the platform value.

### Service File
`server/services/magicLinkService.ts` — exports `sendWelcomeTriggerDemo(email: string, firstName: string)`

### What it sends
A fully-branded trigger alert email indistinguishable from a live alert:
- **Trigger:** AI Competitive Disruption
- **Confidence:** 94%
- **Source:** CNBC Business News
- **Matched keywords:** 5 (AI disruption, market displacement, competitive advantage, technology acceleration, enterprise adoption)
- **Two action buttons:** "Activate Response Protocol" (→ /mission-control) + "Review Playbook" (→ /playbook-library)
- **Sender order:** `pilot@vaughnmartin.com` first → `onboarding@resend.dev` fallback

### When it fires
- Triggered in `server/routes.ts` at `GET /api/auth/magic-link/verify`
- Called fire-and-forget **after** token verification and session creation succeed
- Token is single-use (marked used before the welcome email fires) — so the welcome email fires exactly once per prospect

### Email routing note
- `pilot@vaughnmartin.com` — verified on vaughnmartin.com domain, works in production for any recipient
- `onboarding@resend.dev` — restricted to `martybrunke@gmail.com` in Resend's dev/test mode; only use in production context

### What it replaces
It does NOT replace any live pipeline alert. It supplements the pipeline for users who request access before any real trigger fires, ensuring Day 1 value delivery without depending on news timing.

---

## 32. Messaging Guidelines — Locked Copy Rules (April 2026, rev 21)

The following copy conventions are founder-locked. Any agent or developer who touches marketing pages, investor slides, or product UI must follow these rules without deviation.

### Product Thesis Arc (LOCKED — must appear on all primary pages)
**Preparation → Readiness → Fearless**
- Preparation: Decision rights mapped, ownership defined, response architecture built during low pressure — before any trigger fires.
- Readiness: 180 Readiness Protocols pre-staged. 231 triggers monitored. 12-minute deployment ready.
- Fearless: Every enterprise that prepares for every situation it'll face is no longer afraid of strategic triggers.
- Canonical tagline: "The response is ready before the trigger fires."
- Emotional endpoint: Fearlessness — not speed. Speed is the evidence; readiness is the promise; fearless is the outcome.

### Retired phrases (never use anywhere in the codebase)
| Retired | Replace with |
|---|---|
| "Human-AI partnership" | "AI monitors, executives authorize" |
| "Human-AI collaboration" | "Executive authority preserved" |
| "AI augments executives" | "AI eliminates the mobilization cycle" |
| "AI-powered" (in user-facing copy) | "signal-based" or "system-analyzed" |
| "AI-driven" (in user-facing copy) | "signal-based" or "system-detected" |
| "AI-generated" (in user-facing copy) | "system-analyzed" or "pre-staged" |
| "AI-detected" (in user-facing copy) | "system-detected" |
| "GPT-4o" (in user-facing labels/descriptions) | Omit model name; use feature description |
| "AI Brief" | "Signal-Based Execution Brief · System Analysis" |
| "Ownership as Artifact" (in any UI copy) | "Ownership confirmed" / "confirm ownership" / "ownership record" — term is on hold pending Dr. Huang's approval for public use |
| "Ownership Artifacts" (as a metric label) | "Ownership Records" |
| "produce the artifact" (in ownership context) | "confirm ownership" / "the preparation transferred ownership" |
| "Artifact vs. Performance" (section label) | "Built vs. Received" |
| "Speed advantage" | "3,600× Execution Head Start" |
| "72 hours" (as mobilization baseline) | "30 days" |
| "340×" | "3,600× Execution Head Start" |
| "360×" or "360x" | "3,600× Execution Head Start" |
| "Agentic Execution Layer" (as product name) | "The Operating Model Layer" |
| "Execution Operating System" (as product name) | "Readiness OS" |
| "Execution Infrastructure" (standalone product descriptor) | "Readiness Infrastructure" |
| "Strategic Execution Operating System" | "Strategic Readiness Platform" |
| "Strategic Execution Playbooks" | "Strategic Readiness Playbooks" |
| "Execution Playbooks" (standalone) | "Readiness Playbooks" |
| "20–50 hours getting organized" | "30 days to mobilize" |
| "16 signal categories" | "9 strategic domains, 231 triggers" |
| "Offense" (as category label) | "GROWTH & POSITIONING" |
| "Defense" (as category label) | "RISK & RESILIENCE" |
| "Special Teams" (as category label) | "TRANSFORMATION" |

**AI language rule (LOCKED — zero tolerance):** "AI-powered," "AI-driven," "AI-generated," and "AI-detected" are fully retired from ALL visible UI — labels, descriptions, placeholders, button text, card subtitles, tooltip copy, section headers. Technical code comments are exempt. The underlying AI model name (GPT-4o / Azure OpenAI) may appear ONLY in technical integration listings (e.g. IntegrationHub.tsx, architecture diagrams showing the Microsoft stack). Never in end-user-facing copy. Replacement vocabulary: "system-detected," "signal-based," "system-analyzed," "pre-staged," "system-staged," "continuous monitoring," "pattern-matched."

**Note on "72 hours":** Remains acceptable in contextual uses — regulatory notification deadlines (SEC 8-K, GDPR), before-state comparison data in demo scenario tables, or crisis scenario narrative detail. ONLY retired as a product mobilization baseline claim.

**Note on "execution" as verb/noun:** STAYS in all forms — EXECUTE phase, Execution Clock, AI Execution Briefs, 3,600× Execution Head Start, Execution Velocity, Execution Complete, ProtocolActivationConsole debrief. Only RETIRED in old product name framing ("Execution OS," "Execution Infrastructure" as product descriptor).

### Approved narrative patterns
- "While others mobilize, you're already executing."
- "By the time the first alignment call would have been scheduled, you're already executing."
- "AI monitors. Executives decide. Execution pre-staged."
- "No playbook activates without executive approval."
- "The bottleneck is never the technology. It's the mobilization cycle."
- "30 days compressed to 12 minutes."
- "3,600× Execution Head Start — not a speed advantage. A structural advantage."
- "The response was ready before the trigger fired. That's preparation. That's readiness. That's how enterprises become fearless." (TwelveMinuteTestDrive debrief closing)
- "Every enterprise has Microsoft's AI stack. None have the operating model to use it. Readiness OS is that operating model." (Investor pages)

### Pages where the thesis must be present
Homepage hero · InvestorLanding · InvestorResources · InvestorPresentation · WelcomeBrief · TwelveMinuteTestDrive debrief · FounderStory

### IDEA card copy (Homepage.tsx) — do not paraphrase
The four IDEA cards tell the product's emotional story. Their current copy is canonical:
- **IDENTIFY:** "Nothing is improvised. Everything is pre-staged."
- **DETECT:** "While others are still in their first email thread, the system has already matched the trigger to the playbook — before your leadership team finishes their first email."
- **EXECUTE:** "By the time the first alignment call would have been scheduled, you're already executing."
- **ADVANCE:** "Each execution makes the next response faster, sharper, and more decisive."

### April 2026 Platform-Wide Messaging Sweep (rev 19) — Changes Applied
All pages were audited and the following corrections were made globally. Do not reintroduce any of these patterns:

**"360x" → "3,600×" (8 locations fixed):**
- `CustomerDemo.tsx` — stats card "Response Speed"
- `DemoLiveActivation.tsx` — result display
- `KeynoteDemo.tsx` — after-state comparison table "Response Speed"
- `UnifiedEnterprisePlatform.tsx` — capability callout
- `McKinseyIntelligenceCenter.tsx` — speed improvement metric
- `ProtocolActivationConsole.tsx` — default display before clock starts (live calculation was already using 30-day baseline)

**"72 hours" mobilization baseline → "30 days" (3 locations fixed):**
- `KeynoteDemo.tsx` — legacy comparison row → "Time to Mobilize: 30 days"
- `KeynoteDemo.tsx` — opening stats block → 30-day/83%/$847B framing
- `CompetitivePositioning.tsx` — before-state strip → "30 days of mobilization lag"

**Product descriptor updates (7 locations fixed):**
- `WelcomeBrief.tsx` — "Your Readiness Infrastructure — Live Now"
- `OnboardingGuide.tsx` — logo subtitle "Readiness OS"; section "180 Pre-Built Readiness Protocols"
- `CommandLanding.tsx` — "readiness playbooks across 9 strategic domains"
- `InvestorLanding.tsx` — hero "The Operating Model Layer"; Problem 1 "The Readiness Gap"
- `InvestorPresentation.tsx` — Platform Vision slide "The Operating Model Layer"
- `IDEAFramework.tsx` / `WhyExecuteIQ.tsx` — "readiness coordination layer"

---

## 33. ExecutionStageGuide — Platform-Wide Lifecycle Reference (April 2026)

### What It Is
`client/src/components/ExecutionStageGuide.tsx` is a shared component that defines and displays the six execution lifecycle stages. It is a **core product feature** — not a demo artifact or help widget. Every authenticated user and every prospect who touches the platform sees the same lifecycle model in context wherever they're working.

### The Six Stages (canonical — do not change labels or definitions)
| # | Stage | Definition |
|---|---|---|
| 1 | **Triggered** | Signal threshold crossed — playbook auto-deployed |
| 2 | **Staged** | Tasks created, roles assigned — work units exist |
| 3 | **Notified** | Stakeholders alerted via Teams, email, and SMS |
| 4 | **Acknowledged** | Role-holder confirmed receipt — **12-minute clock ends here** |
| 5 | **In Progress** | Actual work actively underway |
| 6 | **Complete** | Deliverable confirmed and verified |

Stages 1–4 (Triggered through Acknowledged) are the mobilization cycle — this is what collapses from 30 days to 12 minutes. Stages 5–6 are execution proper.

### Three Variants

| Variant | Where Used | Visual Style |
|---|---|---|
| `section` | Homepage (standalone full section) | Ivory background, gold-bordered stages 1–4, teal divider line at 12-min mark, gray stages 5–6 |
| `banner` | Dark-background pages (Mission Control, Command Tower) | Dark navy horizontal strip, small compact stage pills |
| `compact` | Light-background authenticated pages | Ivory grid card with all 6 stages in a responsive grid |

### Usage
```tsx
import ExecutionStageGuide from '@/components/ExecutionStageGuide';

// Full section on homepage (ivory bg, standalone)
<ExecutionStageGuide variant="section" />

// Dark strip on dark-background pages
<ExecutionStageGuide variant="banner" />

// Compact grid on light-background authenticated pages
<ExecutionStageGuide variant="compact" />
```

### Complete Deployment Map (April 2026)

**Public / Marketing:**
- `Homepage.tsx` — `section` variant, between ExecutionGapSection and MissingLayerSection

**Demo Pages (17 total):**
- `TryDemo.tsx` — `compact` inside execute phase
- `DemoLiveActivation.tsx` — `compact` at top
- `LiveActivationCenter.tsx` — `banner` at top + stage label on every task card badge
- `LuxuryCrisisDemo`, `FinancialRansomwareDemo`, `ManufacturingSupplierDemo`, `PharmaceuticalRecallDemo`, `RetailFoodSafetyDemo`, `LVMHMarketEntryDemo`, `SHEINTrendDemo`, `SpaceXLaunchDemo` — `banner` variant (DemoNavHeader pages)
- `EnergyGridFailureDemo`, `CustomerDemo`, `InvestorDemo`, `DealRiskDemo`, `PilotDemo`, `SandboxDemo` — `compact` variant (PageLayout pages)

**Authenticated Product Pages (13 total):**
- `MissionControl.tsx` — `banner` (above main content, inside dark navy wrapper)
- `CommandTower.tsx` — `banner` (above main content, fullscreen dark)
- `TaskManagement.tsx` — `compact` (between dark header and task list)
- `ProtocolActivationConsole.tsx` — `compact` (above execution container)
- `ExecutionCoordination.tsx` — `compact` (above container)
- `ExecutionHistory.tsx` — `compact` (between dark header and KPI cards)
- `ProtocolDetail.tsx` — `compact` (above playbook content)
- `LiveDrillExecution.tsx` — `compact` (above drill interface)
- `ActivationOutcome.tsx` — `compact` (between dark header and debrief content)
- `PracticeDrills.tsx` — `compact` (as first element in drills page)
- `AuditLoggingCenter.tsx` — `compact` (above audit log header)
- `WorkspaceExecute.tsx` — `compact` (above breadcrumb nav)
- `BoardReadiness.tsx` — `compact` wrapped in `no-print` div (excluded from PDF export)

### Variant Selection Rules
- **Dark navy full-screen pages** (no PageLayout, `background: NAVY`) → `banner`
- **Dark navy inside PageLayout** (PageLayout + inner dark wrapper) → `banner`
- **Light background pages** (PageLayout or standalone with `#F8F7F4`/`#F8F9FC`) → `compact`
- **Homepage standalone section** → `section`
- **Print-export pages** → wrap `compact` in `className="no-print"` so it is excluded from PDF

### Task Status Labels (LiveActivationCenter)
Inside `LiveActivationCenter.tsx`, task status badges display a two-line label using the stage vocabulary:
- `staged` status → "Staged / Assigned—awaiting action"
- `in_progress` status → "In Progress / Work actively underway"
- `completed` status → "Complete / Deliverable confirmed"

This ensures the badge language on live task cards maps exactly to the stage definitions visible in the guide above it.

---

## 34. Homepage Restructure — April 2026

`client/src/pages/Homepage.tsx` was restructured from 17 sections (~2,853 lines) down to 11 sections to eliminate dead code, fix runtime errors, and sharpen the narrative focus.

### Current Section Render Order (11 content sections + nav/footer — canonical)

The 11 count refers to substantive content sections (HeroSection through SimulatorCTASection). Total render items including nav, banner, CTA wrapper, and footer = 15.

| # | Section / Component | Notes |
|---|---|---|
| 1 | `HomepageNav` | Sticky top nav |
| 2 | `GuestPreviewBanner` | Non-auth users only |
| 3 | `HeroSection` | "12-Minute Execution" — primary CTA |
| 4 | `ProblemSection` | "The Real Problem Isn't Strategy" |
| 5 | `ExecutionGapSection` | The 30-day mobilization failure |
| 6 | `ExecutionStageGuide variant="section"` | Six lifecycle stages |
| 7 | `MissingLayerSection` | "The Missing Layer" — what competitors miss |
| 8 | `ContrastMomentSection` | Before/After contrast moment |
| 9 | `IDEASection` | Four IDEA phase narrative cards |
| 10 | `PlatformPreviewSection` | Execution console mockup (no SignalTimelineBar) |
| 11 | `MicrosoftEcosystemBanner` | "Every enterprise has Microsoft's AI stack…" |
| 12 | `CredibilitySection` | Research citations — McKinsey, MIT, WEF (no testimonials) |
| 13 | `SimulatorCTASection` | Shadow Strategy Simulator CTA |
| 14 | `CTASection` | Final Founding Partner CTA |
| 15 | `HomepageFooter` | Full footer |

### What Was Removed (and Where It Went)

| Removed from Homepage | New Location | Reason |
|---|---|---|
| `PlaybookAnalogySection` (NFL 4-card analogy) | `IDEAFramework.tsx` (before Governing Principle) | Narrative depth belongs with the IDEA deep-dive page, not the homepage pitch |
| `McKinseyResearchSection` (65%/1%/$4.4T stat cards) | `InvestorResources.tsx` (before CTA) | Investor-grade research belongs in investor materials |
| `ExecutionROISection` (revenue bracket ROI calculator) | `ROICalculator.tsx` | Interactive calculator belongs on its dedicated page |
| `SignalTimelineBar` (animated signal flow bar) | Deleted entirely | Orphaned component — its definition was deleted but a reference in `PlatformPreviewSection` survived, causing a runtime crash. Reference removed April 6, 2026. |
| Fake COO testimonial ("Fortune 200 Manufacturing Company · Name withheld") | Deleted | Placeholder testimonial removed from `CredibilitySection`; real research citations remain |

### Component Constants — Prefix Convention
- `InvestorResources.tsx` — McKinsey section constants use `IR_` prefix (e.g. `IR_HEADLINE`, `IR_STAT_CARDS`)
- `ROICalculator.tsx` — ROI section constants use `RC_` prefix (e.g. `RC_BRACKETS`, `RC_FMT`); formatter helper is `rcFmt()`

### PlatformPreviewSection — Current State (post-cleanup)
The section shows the full execution console mockup: IDEA phase bar, task assignment cards, and stakeholder notification tracker. `SignalTimelineBar` was the animated horizontal signal timeline that previously sat above the console — it is gone and must not be re-added without first defining the component.

### CredibilitySection — Current State
Contains real research citations only: McKinsey 2025 coordination cost data, MIT Sloan execution gap research, WEF × Accenture March 2026 findings. No testimonials or "name withheld" placeholder quotes. If adding a testimonial in the future, it must be a real, verifiable customer quote with a real name and company.

---

## 35. Platform Corrections & Feature Additions — April 6, 2026

### Metric Standardization (T001)
**RETIRED: "16 signal categories"** — this phrase has been fully purged from all user-facing files. It was a legacy internal count that confused users. Replacement rule:
- User-facing context → **"9 strategic domains"**
- Navigation descriptions / signal config pages → **"231 triggers — monitored every 15 minutes"**
- Never show "16" or "20" to users in any context

Files corrected: `IntelligenceHub.tsx`, `IntelligenceControlCenter.tsx`, `ThreatsPage.tsx`, `FounderStory.tsx`, `GuidedStart.tsx`, `Growth.tsx`, `WorkspaceHub.tsx`, `SignalIntelligenceHub.tsx`, `StandardNav.tsx`

**RETIRED: 72-hour velocity multiplier** — `demo-data.ts` `velocityMultiplier` was `367` (computed from 72 hours vs 11.8 minutes). Now correctly set to `3600` (30-day mobilization baseline / 12-minute response). The 72-hour framing is retired. The correct comparison is always 30 days vs. 12 minutes.

### Compound Execution Flywheel (T002)
Added visible flywheel "Compound Execution Advantage" callout to:
- **Homepage.tsx** `IDEASection` — horizontal 4-cell strip (A→I→D→E) inserted between IDEA cards and the "Experience in real time" link. Shows the feedback loop: ADVANCE → IDENTIFY → DETECT → EXECUTE, with per-phase improvement metrics.
- **IDEAFramework.tsx** — dedicated "Compounding Advantage" section (ivory background) inserted between the Coaching/NFL analogy section and the Governing Principle (navy) section. Same 4-column grid, prose explanation of the flywheel.

### Shadow Simulator Board Governance Framing (T003)
`SimulationStudio.tsx` hero subtitle expanded to include board governance context. Three use-case tags added beneath the subtitle:
- Executive Use — Test scenarios before authorization
- Board Governance — Thrive score as board confidence instrument  
- Audit Trail — Every simulation logged — full decision record

### Executive Departure Brief — Boardroom Demo Page
`/executive-departure` — `client/src/pages/ExecutiveDepartureBrief.tsx` — fully public, no auth required, no StandardNav. A single-URL boardroom sales instrument. Structure:
1. Cold open: "It's 6:47 AM. Your CFO just resigned." — incoming messages grid, chaos cards
2. Signal detection mock: War Room Pulse Map with Leadership node firing red, 94% confidence detection card
3. Playbook match: C-Suite Continuity Response — CFO Departure
4. Interactive ACTIVATE PLAYBOOK button — clicking starts the full cascade animation
5. Live execution timer (fast-forwards to 7:23 in ~7 real seconds)
6. Stakeholder cascade: 7 stakeholders notified in animated sequence
7. Task deployment: 7 pre-staged tasks appearing simultaneously
8. Outcome comparison table (before/after) + ROI strip ($23M avg cost, $9–14M protected, $150K investment)
9. The close: "You know someone on your executive team will leave" + Request Founding Partner CTA
Designed to be sent as a URL to a board chair before a pitch meeting. No login required.

### 30-Day Founding Partner Onboarding Arc (T004)
`WelcomeBrief.tsx` — new "Your First 30 Days — Activation Arc" section inserted between the detection panel and the "What Happens Next" infrastructure grid. Shows 4 milestones: Day 1 Platform Armed → Week 1 First Alert → Week 2 Shadow Simulation → Day 30 Execution Benchmark. Left gold border, metric-dense, matches existing dark-mode panel style.

---

## 36. Platform-Wide Changes — April 10, 2026 (rev 21)

### Father's Origin Story — "The Origin" Prologue (LOCKED)
`FounderStory.tsx` — New prologue section inserted as the very first block of the page, before Section I (Roman numerals).

**Copy (LOCKED — never rewrite):**
- Story: Founder's father, third grade, first day of football — "Prepare. Practice. Perform fearless. Never give up."
- Explains why the company is named VaughnMartin (named for the family that gave the framework)
- Maps the four words directly to the platform thesis arc: Preparation → Readiness → Fearless → Never give up

**Why it's locked:** This is not editorial flavor. It is the origin of the product philosophy, the company name, and the IDEA Framework sequence. Every playbook in the system traces back to these four words.

### "The Manifesto" — HomepageNav Visibility
Both desktop and mobile `HomepageNav` now include a "The Manifesto" link routing to `/founder-story`.
- Desktop: italic Cormorant Garamond (signals personal/editorial)
- Mobile: gold color weight
- Homepage founder quote block has a gold editorial link: *"Why this company exists — and why it's named what it is →"*
- Position: mid-funnel discovery (after product hook, not the lead)

### Language Enforcement Sweep — AI Terminology Retirement (LOCKED — Zero Tolerance)
25+ instances of retired AI language cleared from pages and components across the platform.

**Retired permanently from all visible UI copy:**
- "AI-powered" → "signal-based" / "system-analyzed"
- "AI-driven" → "signal-based" / "system-detected"
- "AI-generated" → "system-analyzed" / "pre-staged"
- "AI-detected" → "system-detected"
- "GPT-4o" (in any end-user-facing label, description, or copy)

**Files corrected in this sweep:**
`BoardDeckGenerator.tsx`, `ExecutiveWarRoom.tsx`, `ProactiveRadar.tsx`, `StrategicInsightsPanel.tsx`, `MonitorPhaseView.tsx`, `JourneyNavigator.tsx`, `SplitScreenComparison.tsx`, `FutureReadinessDashboard.tsx`, `PeerReview.tsx`, `ProtocolActivationConsole.tsx`, `BoardBriefings.tsx`, `StrategicRecorder.tsx`, `CompoundThreatAlerts.tsx`

**Exemptions:** Technical code comments. GPT-4o model name may appear only in `IntegrationHub.tsx` or architecture diagrams showing the Microsoft stack — never in end-user-facing copy.

### DOM Warning Fix — VaughnMartin Logo
`VaughnMartinLogo.tsx` icon-only variant changed wrapper element from `<div>` to `<span>` — eliminates browser DOM nesting warning that appeared when the logo was rendered inside inline/button contexts.

### IDEAFramework DOM Fix
`IDEAFramework.tsx` SubBrandLabel changed from `<p>` to `<div>` — eliminates invalid nesting console warning.

---

## 37. Football Terminology Retirement — April 18, 2026 (rev 22)

### Background
The platform's three strategic categories were historically labeled "Offense," "Defense," and "Special Teams" — language borrowed from the founder's Stanford football philosophy. This terminology is **retired from all user-facing copy** as of this revision. Fortune 1000 buyers (HPE, Target, Clorox) respond to enterprise vocabulary, not sports analogies outside the founder's personal narrative.

### New Canonical Labels (user-facing only)

| Internal DB enum | Old UI label | **New UI label** |
|---|---|---|
| `offense` | Offense | **GROWTH & POSITIONING** |
| `defense` | Defense | **RISK & RESILIENCE** |
| `special_teams` | Special Teams | **TRANSFORMATION** |

### What Changed, What Didn't

**Internal code — unchanged:**
- `strategicCategoryEnum` in `shared/schema.ts` still uses `'offense' | 'defense' | 'special_teams'`
- Database values are unchanged — no migration required
- `CAT_COLORS` / `CATEGORY_COLORS` lookup objects still key on `offense`, `defense`, `special_teams`
- `offense`/`defense`/`special_teams` boolean flags on playbook library data are unchanged

**User-facing copy — updated:**
All visible labels, filter tabs, badges, dropdown options, section headers, and card text now use the new vocabulary. Any new component that renders a category label must use the new terms.

### Deliberate Exception
`FounderStoryFull.tsx` — the football language ("offense," "defense") is **preserved intentionally** as part of the founder's personal origin narrative. This is the one place in the entire platform where sports terminology is appropriate and contextually meaningful.

### Files Updated in This Sweep
`WorkspaceHub.tsx` · `WhatIfAnalyzer.tsx` · `DecisionTreeBuilder.tsx` · `IndustryExperience.tsx` · `StrategicDomains.tsx` · `ThirtySecondSpot.tsx` · `CinematicHero.tsx` · `ValueGainCallout.tsx`

### Developer Rule Going Forward
Any component that displays a playbook's `strategicCategory` value must map it through the lookup table before rendering to the user:

```ts
const CATEGORY_LABELS: Record<string, string> = {
  offense: 'GROWTH & POSITIONING',
  defense: 'RISK & RESILIENCE',
  special_teams: 'TRANSFORMATION',
};

// Usage:
const label = CATEGORY_LABELS[playbook.strategicCategory] ?? playbook.strategicCategory;
```

Never render the raw `offense` / `defense` / `special_teams` DB value directly in visible UI.

---

## 38. Dr. Huang Gap Features + Infrastructure Fixes — April 21, 2026 (rev 23)

### Background
Two governance features were built to address gaps Dr. Kerry Huang (ESI Top 1% Researcher, 408-firm study) would press on during a demo: (1) what happens after a playbook activates — does learning get encoded or discarded? (2) what happens to classified signals no one acts on — is that choice visible or invisible?

---

### Gap 2 — Activation Close-Out Gate

**What it does:** Blocks the debrief from advancing past Learning Capture (step 4) until four structured questions are answered and saved. This operationalizes the Dr. Huang thesis: the preparation phase either produces a confirmed ownership record or it doesn't — the gate makes absence of transfer visible, not invisible. **IP note:** The phrase "ownership is an artifact" comes from a private exchange with Dr. Huang and is NOT used in any visible UI copy. All UI copy uses "ownership record," "ownership confirmed," or "confirm ownership." This internal documentation may reference the concept directly, but no user-facing component should use that phrasing until Dr. Huang approves public use.

**Four required fields (schema + UI):**
| Field | Required | Description |
|---|---|---|
| `whatHeld` | ✓ | Which prepared response worked exactly as designed under live conditions |
| `whatDidntHold` | ✓ | Where did preparation fail or deviate under live pressure |
| `preparationGap` | — | Conditions, decisions, or actors the playbook didn't anticipate |
| `oneThingToEncode` | ✓ | The single change that gets built back into the playbook before next use |

**Database — columns added to `activation_outcomes` via direct SQL (April 21):**
```sql
ALTER TABLE activation_outcomes
  ADD COLUMN IF NOT EXISTS what_held text,
  ADD COLUMN IF NOT EXISTS what_didnt_hold text,
  ADD COLUMN IF NOT EXISTS preparation_gap text,
  ADD COLUMN IF NOT EXISTS one_thing_to_encode text,
  ADD COLUMN IF NOT EXISTS close_out_completed boolean DEFAULT false;
```
These columns are also defined in `shared/schema.ts` on the `activationOutcomes` table. If the DB is ever re-created from scratch, `npm run db:push` will create them. Note: `npm run db:push` is interactive and may pause on the `ai_confidence_scores` table prompt — select "create table" when prompted.

**Backend route:**
```
PATCH /api/activation-outcomes/:id/closeout
```
- Protected by `requireOrgAccess`
- Validates `whatHeld`, `whatDidntHold`, `oneThingToEncode` are all present (400 if missing)
- Calls `storage.updateActivationOutcomeCloseOut(id, data)` which sets `closeOutCompleted: true`
- File: `server/routes.ts` · Storage method: `server/storage.ts` → `updateActivationOutcomeCloseOut`

**Frontend — `ActivationOutcome.tsx` step 4 changes:**
- Close-Out Gate card renders at top of step 4 with RED border (locked) or TEAL border (complete)
- LOCKED/COMPLETE badge in header
- "Complete Close-Out Gate & Unlock Board Brief" button — disabled until all 3 required fields have content
- "Next Step" button replaced with disabled "Complete Gate First" button if gate is not passed
- On save: success confirmation reads "Gate passed — learning encoded into institutional memory. Board Brief now unlocked."
- Optional additional fields (wouldChange, lessonsLearned, playbookRating) remain below in a separate card

**Mutation:**
```tsx
const closeOutMutation = useMutation({
  mutationFn: ({ id, data }) => apiRequest("PATCH", `/api/activation-outcomes/${id}/closeout`, data),
  onSuccess: () => { setCloseOutSaved(true); queryClient.invalidateQueries(...) }
});
```

---

### Gap 3 — Signal Accountability Report

**What it does:** Surfaces every classified signal that no one acted on, grouped by escalation tier. The choice not to act is not invisible — it becomes a governance record with a timestamp. Signals that persist across monitoring cycles escalate automatically.

**Page:** `/signal-accountability` → `client/src/pages/SignalAccountability.tsx`
**Route registered:** `App.tsx` line ~429

**Escalation tiers:**
| Tier | Condition | Color |
|---|---|---|
| MONITORING | Under 2 cycles (< 30 min unacted) | Teal |
| EXECUTIVE | 2–3 monitoring cycles without acknowledgment | Gold |
| BOARD | 4+ monitoring cycles (1 hour+ unacted) | Red |

**Backend route:**
```
GET /api/signal-accountability?organizationId=<id>
```
- Queries `triggerDetections` where `status = 'detected' OR 'notified'`
- Calculates `ageMinutes`, `cycles` (15-min windows), `escalationLevel` per signal
- Returns `{ summary, boardEscalated[], executiveEscalated[], monitoring[], generatedAt }`
- File: `server/routes.ts` (inserted before `/api/stakeholder-contacts` route)

**UI features:**
- 4 stat blocks: Total Unacted, Board-Level, Executive, Monitoring
- Escalation logic callout explaining tier thresholds
- Per-signal rows: trigger name, description, confidence, recommended playbook, age, cycle count
- Acknowledge button per signal (calls `POST /api/detections/:id/acknowledge`)
- Auto-refreshes every 60 seconds (`refetchInterval: 60000`)
- Dr. Huang research anchor at bottom: "Architecture creates the conditions where the choice to ignore is no longer invisible."

---

### Scroll Infrastructure Fix

**Root cause of intermittent scroll-to-top failures:** Browser native scroll restoration (`history.scrollRestoration = 'auto'`) was overriding the app's scroll resets on back/forward navigation. The previous timeout chain (80ms → 450ms) was also too short to catch lazy-loaded pages that take 500ms+ to mount.

**Fixes applied:**

1. **`client/src/components/ScrollToTop.tsx`** — module-level scroll restoration disable:
```ts
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
```
Timeout chain extended: `50ms → 150ms → 350ms → 600ms → 1100ms` with proper cleanup via `cleanupRef`. Previous navigation cleanup cancels pending timers before starting new ones.

2. **`client/src/components/layout/PageLayout.tsx`** — scroll-to-top on mount:
```tsx
useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}, []);
```
This fires after the actual page component renders — catching the gap where the global ScrollToTop fires before lazy-load completes.

**Two-layer protection:** Global `ScrollToTop` handles navigation intent (before load); `PageLayout` mount `useEffect` handles confirmation (after load). Both must remain in place.

---

### Language Audit Sweep — April 21, 2026

Three additional visible UI violations corrected (not caught in previous sweeps):

| File | Old Text | New Text |
|---|---|---|
| `IndustryDemosHub.tsx` | "Offense & defense. Market entry to crisis response." | "Growth scenarios. Resilience scenarios. Market entry to crisis response." |
| `WhyExecutionOS.tsx` | `"Defense-Grade Data Intelligence"` (Palantir category) | `"Enterprise-Grade Data Intelligence"` |
| `ThirtySecondSpot.tsx` | `getTitle()` returned `"Offense, Defense, Special Teams"` | Returns `"Growth. Resilience. Transformation."` |

**Audit methodology note:** "Defense" and "Offense" in playbook *names* (e.g., "Activist Investor Defense," "Hostile Takeover Defense," "Competitive Market Defense") are business strategy terms — not football category labels — and are intentionally preserved. The retirement rule applies specifically to the three strategic domain *category labels*, not to the words defense/offense used in business contexts within individual playbook titles.

---

### Manifesto Metric Consistency Rule (added April 21, 2026)

**`FounderStory.tsx` is NOT exempt from canonical metric consistency.**

The manifesto is written as longform editorial prose, which caused previous audit sweeps to miss a metric inconsistency: four instances of "seventy-two hours" (spelled out, not numerals) survived every scan because grep patterns targeted `"72 hours"` and `"72-hour"`. The manifesto used the written form, which matched nothing.

**Corrected in rev 23 (April 21):**
| Line | Old | New |
|---|---|---|
| ~150 | "Seventy-two hours later — sometimes more —" | "Thirty days later — sometimes more —" |
| ~153 | "treating seventy-two hours as the unavoidable cost" | "treating thirty days as the unavoidable cost" |
| ~352 | "not a faster version of seventy-two hours" | "not a faster version of thirty days" |
| ~390 | "Watched the seventy-two hours happen again and again" | "Watched the thirty days happen again and again" |

**Preserved (deliberate):** The same paragraph on line ~390 contains "carrying the knowledge that forty seconds was enough when the infrastructure was right." The forty-second reference is the football framing — it describes the huddle-to-snap window, not enterprise mobilization time. It stays.

**Rule for all future audits:** When running any metric sweep, the grep pattern for the 72-hour retirement must include both the numeral form AND the spelled-out form:
```
grep -ri "seventy.two\|seventy-two\|72.hour\|72-hour" client/src/pages/
```
The same applies to any other retired metric (340×, 360×) — always check both `340x`/`360x` and `"three hundred"` / `"three-sixty"` to cover prose-style editorial copy.

**The broader principle:** The manifesto tells the same story as the product deck. When the product deck locks a number, the manifesto inherits that lock — regardless of whether the manifesto is editorial, protected, or historically locked for other reasons. Metric consistency is a commercial integrity requirement, not a copywriting preference.

---

## 39. Canonical Demo Scenarios + Access — April 22, 2026 (rev 24)

### The Three Canonical Scenarios (LOCKED)

These are the three primary situations the platform is built around. They appear as live signal detections on the Homepage and are the agreed-upon canonical scenarios for all demos, sales conversations, investor presentations, and marketing copy. Do not substitute, replace, or reorder them without explicit founder approval.

| # | Scenario | Signal Detail | Source | Confidence |
|---|---|---|---|---|
| 1 | **Activist Investor Pressure** | Institutional investor filed 13D disclosing 8.7% stake — board seat demanded | SEC EDGAR | 91% |
| 2 | **Regulatory Inquiry Opened** | Federal agency formal inquiry into pricing practices — 48-hour disclosure window | Federal Register | 87% |
| 3 | **Ransomware Attack Confirmed** | Critical systems encrypted — billing and operations affected | Reuters Business | 95% |

These three scenarios represent the three strategic domains:
- Activist Investor → **RISK & RESILIENCE** (internal: `defense`)
- Regulatory Inquiry → **RISK & RESILIENCE** (internal: `defense`)
- Ransomware Attack → **RISK & RESILIENCE** (internal: `defense`)

All three are selectable in the 12-Minute Test Drive (`/12-minute-experience`) alongside three additional scenarios (Supply Chain Collapse, Brand Crisis, Talent Exodus).

### Demo Access — SpeedRun / a16z (April 2026)

**Canonical demo link for a16z SpeedRun application:**
```
https://vaughnmartin.com/demo-access?token=speedrun2026&returnTo=/12-minute-experience
```

**Token:** `speedrun2026` — set as `DEMO_ACCESS_TOKEN` in production environment (April 22, 2026). Overrides the hardcoded default `VMdemo2026`. To change the token, update the `DEMO_ACCESS_TOKEN` environment variable in production and republish.

**Landing destination:** `/12-minute-experience` — the canonical 4-step guided demo (Choose Scenario → Execution Brief → War Room → Debrief). Reviewer selects one of the three canonical scenarios (or any of the 6 available), runs the full 12-minute execution, sees the IDEA Framework in action end-to-end.

**Why this destination (not `/executive-departure`):** The 12-minute test drive shows the platform across multiple trigger types. The Executive Departure Brief is a single-scenario cinematic instrument designed for individual board chairs — appropriate for a targeted sales URL, not a platform introduction.

**Session behavior:** Each visitor gets an independent 4-hour browser session. Multi-use, no limit on concurrent visitors. Session is browser-cookie-scoped — no shared state between reviewers.

**To expire the token:** Set `DEMO_ACCESS_EXPIRES` to an ISO timestamp in the production environment (e.g., `2026-05-31T00:00:00Z`). The system serves a branded "Access Window Closed" page automatically.

### Route Registration Note
`/executive-departure` (`ExecutiveDepartureBrief.tsx`) was not registered in `App.tsx` until April 22, 2026. It is now live. The page is fully public (no auth required, no StandardNav) — designed as a single-URL boardroom sales instrument for CFO departure scenario demos sent directly to a board chair or CFO prospect.


---

## 40. Dr. Kerry Huang Full Repost — April 22, 2026 (rev 25)

### Context
Dr. Kerry Huang (Fortune 50 AVP, ESI Top 1% Researcher, Forbes Business Council, 408-firm governance study) posted the following to his full LinkedIn professional network on April 20, 2026 — naming Martin Brunke by name. This is a public repost, distinct from his earlier private comment. The full text is now captured across four platform pages.

### Full Repost Text (LOCKED — exact words, do not paraphrase)

> "What four weeks of public intellectual exchange with Martin Brunke surfaced is that AwaCourage — awareness paired with the willingness to act before consensus arrives — and the architecture that makes this capacity possible at scale are two different governance functions. Same mechanism, opposite directions. Martin is building the architecture that makes clarity possible before pressure arrives. My research focuses on what determines whether that clarity actually converts into action when the system has not yet confirmed it is safe to move. Neither side replaces the other. Architecture creates the conditions where the choice to ignore is no longer invisible. AwaCourage determines whether the person actually moves on what the system has made visible. Both functions have to work, or neither does. The boundary Martin named — between what architecture can supply and what only human capacity can carry — is where the next decade of governance work sits."

**Source:** LinkedIn repost, April 20, 2026. Labeled "REPOSTED PUBLICLY" in the original image record (attached_assets/monday_comments_v3_1776872539473.png).

### Where It Lives (4 pages)

| Page | Component | Placement |
|---|---|---|
| `/investor-landing` | `InvestorLanding.tsx` | Featured quote block below social proof grid — full 4-paragraph card, gold left border, closing line highlighted in gold |
| `/research` | `Research.tsx` | Dr. Huang LinkedIn Validation section — full post in gold left-bordered block, closing line in gold |
| `/founder-story` | `FounderStory.tsx` | Navy block with gold left border, immediately after the 408-firm research anchor in Section V |
| `/` (Homepage) | `Homepage.tsx` | Compact companion callout beneath the "That is governance as pre-commitment" private exchange quote |

### Key Phrases and Their Significance (for copy decisions)
- **"Martin is building the architecture that makes clarity possible before pressure arrives."** — Names the founder publicly. Used as standalone pull quote in InvestorLanding testimonials grid.
- **"The boundary Martin named — between what architecture can supply and what only human capacity can carry — is where the next decade of governance work sits."** — Closing sentence. Rendered in gold on all pages. This is the most investor-significant sentence — positions Readiness OS at the frontier of governance research.
- **"AwaCourage"** — Dr. Huang's independent governance framework. Appears throughout as the complementary function to Readiness OS architecture. Never modify or define this term — it belongs to Dr. Huang's research.
- **"Both functions have to work, or neither does."** — Validates the interdependence thesis. Preserved as written.

### Previously Captured (Prior Revisions)
The following were already in the platform before April 22 and are NOT the repost:
- "That is governance as pre-commitment, not governance as review." — private exchange quote, Homepage hero
- "Technology alone has zero statistical relationship with collaboration improvement." — 408-firm research finding, FounderStory research anchor
- "Architecture creates the conditions where the choice to ignore is no longer invisible. AwaCourage determines whether the person actually moves on what the system has made visible." — middle paragraph of the repost, previously shown in isolation (now shown as part of the full repost)

---

## 41. Trigger Alert Email — Specific Deep Links — April 22, 2026 (rev 25)

### Problem Fixed
Prior to this revision, both buttons in trigger alert emails pointed to static pages regardless of which trigger fired:
- "Review Live Detection →" → always `/live-detection-feed`
- "Activate: [Playbook Name] →" → always `/live-activation-center`

The button text was trigger-specific but the URLs were not.

### Change: Email Links (`server/services/SignalEvaluationService.ts`)

Both buttons now include URL parameters tied to the specific detection:

```
/live-detection-feed?trigger=${encodeURIComponent(detection.triggerName)}
/live-activation-center?playbookName=${encodeURIComponent(detection.recommendedPlaybook)}
```

### Change: LiveDetectionFeed (`client/src/pages/LiveDetectionFeed.tsx`)

Reads `?trigger=` on load. When a match is found:
- The matching detection card gets a **gold 2px border** and `box-shadow: 0 0 0 3px gold`
- A **gold banner above the card** reads "▼ Detection from your alert email"
- The top color bar on the card switches from confidence color to gold
- The page **auto-scrolls** to the card 400ms after data loads (smooth scroll, `block: center`)

Matching logic: `detection.triggerName.toLowerCase().includes(urlTriggerName.toLowerCase().slice(0, 12))` — partial match on first 12 chars to handle URL encoding differences.

### Change: LiveActivationCenter (`client/src/pages/LiveActivationCenter.tsx`)

Reads `?playbookName=` in addition to the existing `?playbook=` (key-based) param.

Resolution order:
1. `?playbook=ma-day1` (exact key match against `DEFAULT_PLAYBOOKS`) — existing behavior
2. `?playbookName=Ransomware%20Response` (case-insensitive name match on first 8 chars) — new behavior
3. Falls back to `ma-day1` if neither matches

`DEFAULT_PLAYBOOKS` keys: `ma-day1` (M&A Day 1 Integration), `ransomware` (Ransomware Response), `ai-governance` (AI Governance Framework).

### Effect
Every trigger alert email sent after this revision takes the reader directly to the specific detection that fired — highlighted in gold, auto-scrolled to — and pre-selects the recommended playbook in the activation center. One click from email to execution-ready.

---

## 42. Ownership Close-Out Gate + Debrief Classification — April 24, 2026 (rev 26)

### Context
Two features were added to `ProtocolActivationConsole.tsx` to operationalize the Dr. Kerry Huang framework at the moment of execution completion. These are distinct from the ActivationOutcome.tsx Close-Out Gate documented in Section 38 (Gap 2), which blocks the ADVANCE learning capture form. These features appear inside the ProtocolActivationConsole itself when `executionStatus === 'completed'`.

---

### Feature 1 — Ownership Close-Out Gate (ProtocolActivationConsole.tsx)

**What it does:** After the post-activation debrief renders, a formal governance verdict card appears measuring whether ownership actually transferred during the execution. This is the platform's answer to the Huang thesis: the preparation phase either produces ownership or it doesn't — and that result must be made visible, not invisible.

**Three verdict states:**

| Verdict | Threshold | Visual |
|---|---|---|
| **Ownership Confirmed** | ≥70% tasks acknowledged by their assigned owners | Teal border + checkmark |
| **Partial Transfer** | 35–69% acknowledgment rate | Gold border + warning |
| **Silence Detected** | <35% acknowledgment rate | Red border + alert |

**What it shows:**
- Ownership transfer rate (progress bar — X% of tasks had confirmed ownership at handoff)
- Silent tasks diagnostic (named list of tasks with no acknowledgment)
- Three-signal test: (1) Did the assigned owner participate in building the response? (2) Did the owner have formal challenge rights before activation? (3) Is the plan personalized to this owner's specific decision context?
- Dr. Huang attribution block: "Research Foundation — Dr. Kerry Huang, ESI Top 1% Researcher, 408-firm study" with his core finding about zero statistical relationship between technology and collaboration improvement

**IP rule:** All visible copy uses "ownership confirmed," "ownership record," "silence detected" — never "ownership artifact" or "ownership as artifact." Those phrases are on hold pending Dr. Huang's approval for public use (see Section 32 retired phrases table).

**Location in component:** Rendered after the debrief hero banner and ADVANCE debrief strip, before the CTAs, when `executionStatus === 'completed'`.

---

### Feature 2 — Recovery vs. Optimization Debrief Classification (ProtocolActivationConsole.tsx)

**What it does:** The ADVANCE debrief section (previously static) now automatically classifies itself based on the Close-Out Gate ownership %. Different ownership outcomes call for fundamentally different ADVANCE conversations — optimization (high ownership) vs. recovery (low ownership, silence detected).

**Three classification types:**

| Type | Ownership % | Purpose |
|---|---|---|
| **Optimization** | ≥70% | Build on what held — encode the preparation advantage into the next cycle |
| **Mixed-Signal** | 35–69% | Separate what was built from what was received — find the ownership gap |
| **Recovery** | <35% | Silence at acknowledgment — the preparation-to-action transfer failed |

**Each type includes:**
- Type-specific ADVANCE instructions (what this debrief is for)
- 3 focus questions calibrated to the outcome
- A Dr. Huang quote about the acknowledgment window closing

**Key Huang quote used in Recovery type:**
> "Silence at acknowledgment is the signal. Not silence at completion. Not divergence at debrief. Silence at the moment the response either deploys or does not."

**This quote is attributed to "Silence at Acknowledgment" — which is Martin's own concept, confirmed by Dr. Huang.** It is displayed with proper attribution and is cleared for public use.

**Location in component:** ADVANCE debrief section renders immediately after the Close-Out Gate when `executionStatus === 'completed'`. Classification is computed from the same ownership rate used by the gate (no additional API call required).

---

### Terminology Sweep — April 24, 2026

The following phrase changes were applied globally across 7 files as part of this revision:

| Old | New | Files |
|---|---|---|
| "Ownership Artifacts" (metric label) | "Ownership Records" | ProtocolActivationConsole, Team, Roadmap, LiveActivationCenter |
| "produce the artifact" (ownership context) | "confirm ownership" | PlaybookCustomize, TwelveMinuteTestDrive |
| "the ownership artifact was produced" | "ownership was confirmed" | TwelveMinuteTestDrive |
| "Ownership artifact" (gain label) | "Ownership record" | TwelveMinuteTestDrive, PlaybookCustomize |
| "Ownership as Artifact" (section label) | Removed entirely — replaced with "What This Gate Measures" | ProtocolActivationConsole |
| "Artifact vs. Performance" (section heading) | "Built vs. Received" | FounderStory |
| "an artifact someone constructed" | "a decision someone constructed" | FounderStory |
| "It is artifact construction." | "It is construction, not delivery." | FounderStory |

**Why:** "Ownership as Artifact" originated in a private exchange with Dr. Huang and is not available for public use without his approval. All concepts and mechanics remain intact — only the specific naming is held. When Dr. Huang approves, a single find-and-replace across these files will restore the terminology. No structural changes required.

---

## 43. How It Executes Page — May 2026 (rev 28)

**Route:** `/how-it-executes` → `client/src/pages/HowItExecutes.tsx`

**Purpose:** Animated, interactive visualization of the full 6-step execution chain — from signal detection through executive authorization to 12-minute close. Designed for sales conversations and investor demos. No auth required.

### Structure

**5 Scenario Selectors** (tabs above the chain — 4 single-domain + 1 compound):
| ID | Label | Trigger |
|---|---|---|
| `ransomware` | Ransomware Attack | 23 servers encrypted — 3 AM detection |
| `activist` | Activist Investor | 9.8% stake disclosed — board seat demanded |
| `supply` | Supply Chain Collapse | Primary supplier declares force majeure |
| `regulatory` | Regulatory Inquiry | DOJ investigation opened — disclosure required |
| `compound` | Activist + Regulatory (Compound) | Simultaneous activist filing and regulatory probe — 2 Readiness Protocols activated |

The compound scenario uses TEAL as its active state color and displays "2 Readiness Protocols activated simultaneously" in the chain steps. Each scenario drives the chain step content dynamically — protocol name, stakeholders, budget, risk score, and outcome are all scenario-specific.

**6-Step IDEA Execution Chain** (animated, auto-plays on load, replays on scenario switch):
| Step | Time | Label |
|---|---|---|
| 1 | 0:00 | Signal Detected |
| 2 | 0:47 | Protocol Matched |
| 3 | 2:00 | Stakeholders Staged |
| 4 | 4:15 | Tasks Pre-Deployed |
| 5 | 8:30 | Executive Authorizes |
| 6 | 12:00 | Execution Complete |

Animation: steps reveal sequentially via `useState(currentStep)` driven by `setInterval`. Each completed step gets a gold check badge. The active step pulses. Clicking a scenario tab resets `currentStep` to 0 and restarts the interval.

**Old Model Comparison Panel:** Side-by-side against the chain — shows the traditional 30-day mobilization drift (Day 0 → Day 30) with labels like "Figuring out who's in the room," "First alignment call," "Board briefed for first time." Gold vertical line at 12 minutes marks where Readiness OS closes the cycle vs. Day 30 for the old model.

**"Before / At / After the Trigger" Section:** Three columns explaining when preparation happens relative to the trigger:
- **Before:** Ownership mapped, budgets pre-approved, tasks pre-staged
- **At the Trigger:** System detects signal → protocol matched in seconds → stakeholders notified
- **After (12 minutes):** Executive authorizes → execution confirmed → debrief staged

**No API calls.** Fully static demonstration page — all scenario data is hardcoded in the `SCENARIOS` and `CHAIN_STEPS` arrays.

**Brand constants used:** `NAVY`, `NAVY_BG`, `GOLD`, `TEAL`, `IVORY`, `MUTED`. Typography: `GEO` = Cormorant Garamond (editorial), `BAR` = Barlow (body/labels), `BC` = Barlow Condensed (caps/labels).

---

## 45. Proof Story Page — May 2026 (rev 28)

**Route:** `/proof-story` → `client/src/pages/ProofStory.tsx`

**Purpose:** Three full activation narratives (Ransomware, Activist Investor, Supply Chain Collapse) with timestamped side-by-side timelines, head-to-head comparison tables, and specific financial outcomes. Designed to give prospects and investors a concrete before/after view of Readiness OS impact. No auth required.

### Structure

**3 Story Cards** (`STORIES` array):

| ID | Title | Industry |
|---|---|---|
| `ransomware` | "The Ransomware That Didn't Win" | Financial Services · Global Payments Infrastructure |
| `activist` | "The Activist Who Arrived Too Late" | Consumer Goods · $8.4B revenue |
| `supply` | "The Supplier That Disappeared Overnight" | Manufacturing · Tier-1 Supplier Dependency |

Each story contains:
- `without` block: "The 30-Day Drift" timeline — 8 timestamped events (Day 0 → Day 30), final cost
- `with` block: "12 Minutes" timeline — 6 timestamped events (0:00 → 12:00), outcome headline
- `comparison` table: 6 head-to-head rows (First stakeholder contact, Board notification, Regulatory filing, etc.)

**View Toggle** (per story): Three buttons — "Side by Side" (default) | "With Readiness OS" | "Without Readiness OS". Controls which panels are visible. State is per-story, not global.

**Side-by-Side layout:** Two equal columns. Left = navy "Without" panel. Right = teal/ivory "With" panel. Timeline events render as labeled rows with time stamps. Cost/outcome rendered as red (without) or teal (with) summary blocks at the bottom.

**Comparison table:** Renders below the timelines in "Side by Side" mode. Each row: capability label | old-model cell (red/muted) | Readiness OS cell (teal/bold). Row labels: First stakeholder contact, Decision authority established, Board notification, Regulatory filing submitted, Operational response deployed, Cost.

**No API calls.** All story data is hardcoded in the `STORIES` array.

**Brand constants used:** `NAVY`, `NAVY_BG`, `GOLD`, `TEAL`, `IVORY`, `MUTED`. Typography: `GEO` = Cormorant Garamond (editorial headings), `BAR` = Barlow (body), `BC` = Barlow Condensed (caps/labels).

---

## 46. ROI Calculator — Sidebar Enhancements — May 2026 (rev 28)

**Route:** `/roi-calculator` → `client/src/pages/ROICalculator.tsx`

Four additions to the sticky right-side results sidebar:

### 1. Platform Cost Slider
- Range: $60,000 – $240,000/yr
- Default: $120,000/yr
- State: `const [platformCost, setPlatformCost] = useState(120000)`
- Rendered with shadcn `<Slider>` component
- Value displayed in monospace font as `$XX,XXX/yr`
- Used in all downstream calculations (ROI %, net value, break-even, consulting comparison)

### 2. Break-Even Calculation
- Formula: `breakEvenEvents = Math.ceil(platformCost / valuePerEvent)`
  where `valuePerEvent = totalAnnualValue / inputs.strategicEventsPerYear`
- `breakEvenDays = Math.round(breakEvenEvents × daysPerEvent)` (daysPerEvent = 365 / eventsPerYear)
- Display: `< 30 days → "X days"` | `≥ 30 days → "X months"`
- Shown in sidebar as a teal stat block

### 3. 3-Year Net Value
- Formula: `threeYearValue = (totalAnnualValue × 3) - (platformCost × 3)`
- Displayed in gold monospace font in the sidebar
- Label: "3-Year Net Value"

### 4. Consulting Retainer Comparison Panel
- Formula: `consultingAnnual = 350,000 + (inputs.strategicEventsPerYear × 60,000)`
  (base retainer $350K + $60K per strategic event handled)
- Red monospace line: consulting annual cost
- Teal monospace line: platform cost
- Callout sentence: "Consulting costs $X more — and doesn't give you pre-staged execution."

**Legacy fix included in this revision:** The old hero stat displayed "424× compression" — corrected to **"3,600× EXECUTION HEAD START"** with the label "30 days compressed to 12 minutes." This was a critical metric violation (retired framing). Any agent touching ROICalculator.tsx must preserve the 3,600× framing.

---

## 47. StandardNav CTA Cleanup — May 2026 (rev 28)

**File:** `client/src/components/layout/StandardNav.tsx`

### Problem Fixed
The nav previously rendered duplicate CTA buttons in certain auth states — two "Request Founding Partner Access" buttons appearing simultaneously, or a button appearing alongside an identical mobile variant at desktop width.

### Current Pattern (canonical — do not revert)

**Unauthenticated users:**
- Single gold "Request Founding Partner Access" button → `/founding-partner-program`
- Separate "Sign In" text button → calls `login()` from `useAuth`
- No duplicate buttons at any breakpoint

**Authenticated users:**
- User avatar/initials menu replaces both CTAs
- No "Request Founding Partner Access" shown to signed-in users

**Button label rule (LOCKED):** All CTAs on StandardNav use "Request Founding Partner Access" and route to `/founding-partner-program` — never "Apply for Pilot," "Get Started," or any retired variant. Never route to `/request-access` (that is the internal magic-link platform login form). This matches the Founding Partner Program language lock established in Section 32.

**`login()` call pattern:**
```tsx
const { login } = useAuth();
// Sign In button:
<button onClick={() => login()}>Sign In</button>
```
Never use `window.location.href = '/api/login'` for the nav Sign In button — always call `login()` from the auth hook so the return-to URL is handled correctly.

---

## 48. VaughnMartinLogo — `noLink` Prop — May 2026 (rev 28)

**File:** `client/src/components/VaughnMartinLogo.tsx`

### Problem Fixed
When `VaughnMartinLogo` was rendered inside a parent `<Link>` component (e.g., in `TwelveMinuteTestDrive.tsx`), the browser emitted a DOM warning about nested anchor elements — the logo's own internal `<a>` wrapper was nested inside the parent `<Link>` anchor.

### Solution
Added a `noLink` prop (default `false`). When `noLink={true}`, the component renders without its own anchor wrapper, allowing it to be composed inside a parent link safely:

```tsx
// VaughnMartinLogo.tsx
interface Props {
  noLink?: boolean;
  // ... other props
}

export function VaughnMartinLogo({ noLink = false, ...rest }) {
  const logo = <span>/* logo SVG/image */</span>;
  if (noLink) return logo;
  return <a href="/">{logo}</a>;
}
```

**Usage pattern when inside a parent Link:**
```tsx
<Link href="/">
  <VaughnMartinLogo height={32} variant="full" color="light" noLink />
</Link>
```

**Rule:** Any component that wraps `VaughnMartinLogo` inside its own `<Link>` or `<a>` must pass `noLink` to prevent nested anchor DOM errors. The same fix was applied in `TwelveMinuteTestDrive.tsx`.

---

## 49. Two-Tier Platform Architecture — Industry Protocol Packs — May 2026 (rev 28)

Two new pages establish the two-tier platform model: Readiness OS Core (143 general protocols, cross-industry) + 6 Industry Protocol Packs (purpose-built vertical stacks on top of the core).

### IndustryPacksHub — `/industry`

**File:** `client/src/pages/IndustryPacksHub.tsx` (536 lines)

**Purpose:** Landing hub for the two-tier architecture. Explains that every Readiness OS subscription includes all 143 core protocols, with optional vertical packs adding industry-specific protocols on top.

**6 Industry Packs** (`INDUSTRY_PACKS` array):

| Key | Name | Industry Protocols |
|---|---|---|
| `financial_services` | Financial Services | 15 |
| `technology` | Technology & Software | 12 |
| `manufacturing` | Manufacturing & Industrial | 14 |
| `energy` | Energy & Utilities | 13 |
| `retail` | Retail & Consumer | 11 |
| `healthcare` | Healthcare & Life Sciences | 16 |

Each card shows: icon, name, tagline, industry protocol count, sample trigger scenarios, and a "View Pack →" CTA linking to `/industry/:verticalKey`.

**Core foundation callout:** A bottom section shows the 143 core protocols as the shared base — with a breakdown of the 9 strategic domains included in every subscription.

**Route registered:** `App.tsx` line ~619 — `<Route path="/industry" component={IndustryPacksHub} />`

**StandardNav entry:** "Industry Protocol Packs" appears in the Core Capabilities dropdown section → `/industry`. Added with `Globe` icon and description "Financial Services · Technology · Manufacturing · Energy · Retail · Healthcare — purpose-built vertical stacks" with `featured: true`.

---

### IndustryPackDetail — `/industry/:verticalKey`

**File:** `client/src/pages/IndustryPackDetail.tsx` (1,160 lines)

**Purpose:** Full detail page for a single industry pack. Parameterized — one component serves all 6 verticals. Reads `verticalKey` from Wouter `useParams`.

**Content per pack:**
- Hero: industry name, headline, tagline, description
- Protocol list: industry-specific protocols with urgency badges (CRITICAL / HIGH / STANDARD), trigger lists, domain labels
- Core protocols count: "Included from Core — 143 additional protocols available to all subscribers"
- Key triggers: industry-specific trigger examples shown as signal cards
- Stakeholder scenarios: role-specific execution examples (CFO, CISO, General Counsel, etc.)
- CTA: "Request Founding Partner Access" → `/founding-partner-program`

**`INDUSTRY_PACK_DATA` constant:** Keyed by `verticalKey`. Each entry defines `name`, `fullName`, `headline`, `tagline`, `description`, and an array of `ProtocolEntry` objects.

**`ProtocolEntry` shape:**
```ts
interface ProtocolEntry {
  number?: number;
  name: string;
  description: string;
  urgency: "CRITICAL" | "HIGH" | "STANDARD";
  triggers: string[];
  domains: string;
  status?: "live";
}
```

**404 handling:** If `verticalKey` doesn't match any key in `INDUSTRY_PACK_DATA`, the page renders a "Pack not found" state with a link back to `/industry`.

**Route registered:** `App.tsx` line ~620 — `<Route path="/industry/:verticalKey" component={IndustryPackDetail} />`

---

## 50. Homepage Signal Feed Deduplication — May 2026 (rev 28)

**File:** `client/src/pages/Homepage.tsx`

### Problem Fixed
The live signal feed section on the homepage was displaying duplicate signal cards — the same trigger detection appearing two or more times when the RSS pipeline fired multiple articles matching the same trigger pattern within the same ingestion window.

### Fix Applied
Before rendering, the signal array is deduplicated by `title` field using a `Map`:

```ts
const uniqueSignals = Array.from(
  new Map(signals.map((s: any) => [s.title, s])).values()
);
```

`uniqueSignals` replaces `signals` in the render loop. The map preserves the first occurrence of each title and discards subsequent duplicates. This is done client-side — no server change required — because the RSS pipeline correctly stores each item once, but the display query could surface multiple detections with matching article titles from the same ingestion cycle.

**No API changes.** Pure frontend display fix in `Homepage.tsx`.

---

## 51. Manifesto Video Components — Status Note — May 2026 (rev 28)

**Location:** Bottom of `/founder-story` (`FounderStory.tsx`)

Two animated text slideshow components with TTS narration (not real video files) are mounted at the bottom of the manifesto page:

| Component | File | Status |
|---|---|---|
| Intro Narration | `client/src/components/marketing/FounderStoryIntro.tsx` | ✅ Fixed — "72 hours" → "30 days" (rev 46, May 23 2026) |
| Full Story Narration | `client/src/components/marketing/FounderStoryFull.tsx` | Football language preserved (deliberate — origin narrative) |

**`FounderStoryIntro.tsx` — resolved (rev 47):** Two layers were fixed:

1. **Visual (JSX)** — Scene 0 display stat: `72 HOURS` → `30 DAYS`. Quote: "That's how long it takes." → "That's how long mobilization takes." Scene 1 body: updated to reference the mobilization cycle.
2. **TTS audio narration (`SCENE_NARRATIONS` array)** — Scene 0 string: `"Seventy-two hours. That's how long it takes."` → `"Thirty days. That's how long mobilization takes."` Scene 1 string: `"That's how long it takes most Fortune 500 companies to respond to a crisis."` → `"That's how long most Fortune 500 companies spend just mobilizing after a strategic trigger fires."` These strings are sent to the text-to-speech API and spoken aloud when the user enables audio — they must match the visual copy.

This closes every instance of the retired 72-hour framing in this component, both visual and audio.

**Rule:** Any future metric sweep (`grep -ri "seventy.two\|seventy-two\|72.hour"`) must include `client/src/components/marketing/` — not just `client/src/pages/`.

---

## 52. Codebase Scale Reference — May 2026 (rev 40)

Current production counts as of May 21, 2026:

| Artifact | Count |
|---|---|
| Page components (`client/src/pages/`) | **208** |
| Component files (`client/src/components/`) | **86** |
| `App.tsx` size | **731 lines** |
| Registered client-side routes (App.tsx) | **242** |
| `server/routes.ts` size | **~10,700 lines** |
| Server route modules (`server/routes/`) | **15** |
| `shared/schema.ts` size | **~6,900 lines** |
| `server/storage.ts` size | **~3,566 lines** |
| Readiness Protocols in library | **180 core** (+ 30 compound, IDs 181–210 = **210 total**) |
| Strategic domains | **9** |
| Canonical trigger count | **231** |
| Signal data points | **248+** |
| RSS feed sources (live signal pipeline) | **39** |
| Ingestion interval | **15 minutes** |
| Unit tests (vitest) | **189 passing** |

**Note on route count:** `App.tsx` uses a `renderRoutes()` and `renderRedirects()` helper that registers multiple path aliases for a single component. The 242 count includes all aliases and redirects. The distinct page components number 208.

---

## 53. Trigger Email → Protocol Pipeline Fix (May 2026, rev 29)

**Context:** When a live signal is detected and an email notification is sent, the email contains a link with query parameters pointing the recipient directly to the correct Readiness Protocol inside the Live Activation Center. Prior to this fix, the activation staging screen and war room sometimes showed a generic/incorrect protocol name because the URL parameters were not being read or passed through correctly.

### Files Changed

| File | Change |
|---|---|
| `client/src/pages/CommandTower.tsx` | ACTIVATE button now appends `?playbookName=<protocolName>&domain=<domain>` to the `/live-activation` URL |
| `client/src/pages/LiveActivationCenter.tsx` | `beginActivation()` accepts a `protocolOverride` parameter; reads `?playbookName=` from URL on mount and passes it through to staging and war room |
| `client/src/pages/LiveActivationCenter.tsx` | War room always shows correct protocol name — uses `urlPlaybookName` as fallback when DB load is in progress or returns a different default |
| `client/src/pages/LiveActivationCenter.tsx` | 3-second timeout fallback prevents the staging screen from getting stuck if the DB load hangs |
| `client/src/components/LiveDetectionFeed.tsx` | Highlights the specific trigger from the email URL param so the operator immediately sees the relevant signal |

### How the Pipeline Works (post-fix)

```
Signal detected (RSS ingestion / manual)
  ↓
Email sent via Resend with link:
  /live-activation?playbookName=<Protocol+Name>&domain=<domain>
  ↓
LiveActivationCenter mounts, reads useSearch() params
  ↓
beginActivation(protocolOverride) called with the URL param value
  ↓
Staging screen shows correct protocol name immediately (no DB round-trip needed)
  ↓
War room continues showing urlPlaybookName as display label
  ↓
DB load completes in background, merges task list
```

### Invariants to Preserve

- **Always pass `?playbookName=` in the email link** — the activation center falls back gracefully to the first available playbook if the param is absent, but the experience degrades (generic protocol name shown).
- **`protocolOverride` is a display-level override** — it does not skip DB validation. The actual task list is always loaded from the database. The override only affects the protocol name displayed during staging.
- **3-second timeout is a safety net** — if DB load succeeds in under 3 seconds (normal case), the timeout is cancelled. Only fires on network issues or slow DB response.
- **Do not remove the `urlPlaybookName` fallback** in the war room — without it, a DB record with a different default protocol name will overwrite the operator's intent.

---

## 54. Investors.tsx Messaging Corrections (May 2026, rev 29)

**Context:** Two legacy "Pilot" references were found in `client/src/pages/Investors.tsx` and corrected to align with the locked Founding Partner Program language.

| Location | Old Text | New Text |
|---|---|---|
| Line 331 — market stats block | "Pilot Contracts" | "Founding Partner Contracts" |
| Line 809 — program terms list | "Pilots run in 30 days" | "Founding Partner validation runs in 90 days" |

**Note:** The phrase "Still Piloting" that appears in the McKinsey/BCG market-stat context on this page is **intentional** — it describes the industry's behavior (65% of Fortune 1000 companies are still piloting AI point solutions), not VaughnMartin's program. Do not change it.

### Production Audit Result (May 2026, rev 29)

Full static audit of all page groups TA–TK (170+ component files) completed. **Zero terminology violations found** across the following rule sets:
- "AI-powered / AI-driven / AI-generated / AI-detected" (RETIRED)
- "GPT-4o" in end-user copy (RETIRED)
- "Pilot Program / Pilot Access / Now in Pilot" as program labels (RETIRED)
- "340×" / "360×" / "72 hours" execution metrics (RETIRED)
- "Offense / Defense / Special Teams" as domain labels (RETIRED)
- "human-AI partnership" (RETIRED)

Build status: `npm run build` — clean pass (no errors). Unit tests: 189/189 passing.

---

## 55. Founding Partner Program Page — May 2026 (rev 30)

**Route:** `/founding-partner-program` (also aliased from `/pilot-program` via `renderRoutes`)
**File:** `client/src/pages/FoundingPartnerProgram.tsx`
**Auth required:** No — fully public

### Purpose

The primary public conversion page for enterprise prospects — startup to Fortune 500. Replaces the previous pattern of redirecting Founding Partner CTAs to `/request-access`. All "Apply for Founding Partner Access" / "Request Founding Partner Access" buttons across the product now route here — `/request-access` is reserved strictly for authenticated platform access (magic link flow).

### Page Structure

1. **Hero** — Problem-first framing: "The response was / before you knew you needed it." with two badges: (a) scarcity badge **"2026 Founding Partner Cohort · 2 Seats · Applications Now Open"** in gold — update the seat count as partners sign; never show a filled count that is inaccurate; (b) eligibility qualifier **"Founding Partner engagements are open to organizations from high-growth startups to Fortune 500 enterprises — readiness, not revenue, is the qualifier"** in teal — the prior "$50M+ operational budget" revenue floor was removed (retired) so the program matches the platform's stated "startup to Fortune 500" positioning; do not reintroduce a revenue/budget gate here
2. **Differentiation strip** — 3 cards: "Pre-staged, not assembled" / "Coordination, not capability" / "The response before the trigger"
3. **Inline ApplicationForm** — no redirect; submits directly to the backend
4. **Success state** — "We'll be in touch within 48 hours." confirmation in place of the form
5. **Questions CTA** — `founding@vaughnmartin.com`

### Inline Application Form

**Fields (all required except triggerDomain and message):**
```
firstName       — text input
lastName        — text input
email           — email input
company         — text input
title           — text input
triggerDomain   — select (optional): "Growth & Positioning" | "Risk & Resilience" | "Transformation" | "All Domains"
message         — textarea (optional): free-text trigger/protocol/question prompt
```

**Submit flow:**
1. Frontend POST to `/api/founding-partner/apply` with form data
2. Backend validates with Zod (`insertFoundingPartnerApplicationSchema`) → inserts into `founding_partner_applications` table → returns success
3. Frontend flips to success state; form unmounts
4. Error path shows `founding@vaughnmartin.com` as fallback contact

### Backend Route

```
POST /api/founding-partner/apply   ← public, no auth required
```

- Located in `server/routes.ts`
- Validates against `insertFoundingPartnerApplicationSchema` (Zod, derived from the Drizzle table via `createInsertSchema`)
- Inserts into `founding_partner_applications` table with `status` defaulted to `'pending'`
- Returns `{ ok: true }` on success; `{ error: "..." }` on failure
- Never throws a user-visible error — all errors logged server-side and caught by the frontend fallback

### Database Table (`shared/schema.ts`)

```ts
export const foundingPartnerApplications = pgTable('founding_partner_applications', {
  id:            uuid('id').primaryKey().defaultRandom(),
  firstName:     text('first_name').notNull(),
  lastName:      text('last_name').notNull(),
  email:         text('email').notNull(),
  company:       text('company').notNull(),
  title:         text('title').notNull(),
  triggerDomain: text('trigger_domain').default(''),
  message:       text('message').default(''),
  status:        text('status').notNull().default('pending'),
  createdAt:     timestamp('created_at').defaultNow(),
});
```

The `companySize` / `primaryChallenge` / `timelineUrgency` fields from the original schema were retired — the form was simplified to firstName/lastName/email/company/title plus optional triggerDomain and message, consistent with opening the program to any company size (startup to Fortune 500) rather than pre-segmenting applicants. Use `npm run db:push` for any future schema changes to this table.

### Link Audit (May 10, 2026)

A two-pass bulk script updated **49 files** total — all public-facing Founding Partner CTAs now route to `/founding-partner-program`. The only remaining `/request-access` links in the codebase are intentional internal flows:

| File | Why it stays as /request-access |
|---|---|
| `IDEASidebar.tsx`, `IDEALayout.tsx` | Auth-loss redirect for authenticated users |
| `AICopilotPanel.tsx`, `TaskPanel.tsx` | Auth-loss redirect |
| `CreateOrganizationModal.tsx`, `CreateScenarioModal.tsx` | Auth-loss redirect |
| `QuickActions.tsx`, `NavigationBar.tsx` | Platform internal nav |
| `MagicLogin.tsx`, `GuidedStart.tsx` | Magic link / guided start flows |
| `AdminQuickLink.tsx` | Admin reference link (intentional) |
| `StrategicRecorder.tsx`, `CompoundThreatAlerts.tsx` | 401 timeout redirect |
| `ProtocolCommand.tsx` | Login button for unauthenticated command view |
| `FoundingPartnerProgram.tsx` line ~919 | "Explore before committing" escape hatch (intentional) |

**Rule for future developers:** If a button label contains "Founding Partner" → it goes to `/founding-partner-program`. If it is an auth-gate redirect for a logged-in user who lost access → it goes to `/request-access`.

---

## 56. May 13, 2026 — Rev 31 Change Log

### Font Loader Cleanup (`client/index.html`)
The Google Fonts `<link>` tag was loading 30+ font families (Inter, DM Sans, Roboto, Poppins, Montserrat, Open Sans, Outfit, Bebas Neue, Crimson Pro, DM Mono, Geist, JetBrains Mono, and 20+ more). All retired fonts were removed. **Only three families now load:**
- `Cormorant Garamond` — editorial headings (weights 400–700, italic variants)
- `Barlow` — body text (weights 400–700, italic variants)
- `Barlow Condensed` — caps/labels (weights 400–800)

The two previous `<link>` tags are now a single tag. This is the largest page-speed improvement made to date. Do not re-add any removed families.

**Typography constant naming (all files):** `CG` or `GEO` = Cormorant Garamond · `BAR` or `DM` = Barlow · `BC` = Barlow Condensed. `Inter` and `DM Sans` are fully retired — no file should reference either family.

### MasterDemo Logo Fix (`client/src/pages/MasterDemo.tsx`)
`MasterDemo` previously rendered a hand-rolled logo (plain gold circle + "VM" text span) in its custom header. It now imports and renders `VaughnMartinLogo` from `@/components/VaughnMartinLogo`, matching every other page on the platform.

```tsx
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
// In header:
<VaughnMartinLogo color="light" height={36} variant="full" />
```

**Rule:** `MasterDemo` intentionally has no `PageLayout`/`StandardNav` (it is a full-screen immersive simulation). The `VaughnMartinLogo` component supplies its own `<Link href="/">` — never wrap it in a second `<Link>` or `<a>` tag.

### Retired Language Enforcement — May 13
Two instances of "AI-driven" were removed from user-visible copy:
- `client/src/pages/demos/scenarioData.ts` — `triggerHeadline` for the Workforce scenario: `"AI-driven workforce transformation"` → `"workforce transformation"`
- `client/src/components/layout/StandardNav.tsx` — two nav description strings: `"AI-driven realignment"` → `"system-staged realignment"`

### Purple Color Audit — May 13
All remaining `purple-*` Tailwind classes and purple hex values removed from `client/src`:

| File | What changed |
|---|---|
| `client/src/data/activationPersonalization.ts` | 5 KPI `color` entries: `text-purple-400` → `text-teal-400`; avatar array: `bg-purple-500` → `bg-teal-600` |
| `client/src/navigation/config.ts` | DETECT section gradient: `from-purple-600 to-pink-600` → `from-teal-700 to-emerald-600` |
| `client/src/pages/SignalConfiguration.tsx` | IDENTIFY breadcrumb step color: `#6366F1` → `#2B8A6E` (TEAL) |

### Logo Export Assets
Two standalone SVG files created for external brand use (LinkedIn, marketing materials):
- `attached_assets/vaughnmartin-seal.svg` — circular seal only (400×400, works as square profile logo)
- `attached_assets/vaughnmartin-logo-full.svg` — full lockup: seal + "VaughnMartin" wordmark + "READINESS OS" subtitle (560×160, horizontal format)

Both use inline SVG — no external font dependencies. Safe to open in any browser or convert to PNG.

---

## 57. May 14, 2026 — Rev 32 Change Log

### Consistency Pass — Four Canonical Blocks

External reviewer audit of rev 31 identified four categories of drift. All corrected below.

#### 1. Canonical Metrics Block — `ExecutionGapDiagram` clarification
**Section 13 (`ExecutionGapDiagram`):** Added an explicit note that the left-panel SVG label "72 HOURS LATER — STILL FIGURING IT OUT" is **intentional before-state visual copy** depicting the problem, not a baseline metric claim. This label is not a violation of the retired 72-hour mobilization rule (Section 32). The comparison metrics (3,600×, 30 days → 12 min) live in the proof-numbers strip at the bottom of the same diagram. No SVG content was changed — the note prevents future agents from incorrectly "fixing" intentional design.

#### 2. Canonical CTA / Routing Block — Pilot → Founding Partner everywhere
**Section 2 (Growth Segment bullet):** Updated to name the Fortune 1000 enterprise page as `/founding-partner-program` (not "Enterprise Pilot / `/pilot-program`"); notes that `/pilot-program` is now a permanent alias.

**Page table (Section 13):**
- `FounderStory.tsx` closing CTA: `/pilot-program` → `/founding-partner-program`
- `InvestorLanding.tsx` hero CTA ("Schedule a Conversation"): `/pilot-program` → `/founding-partner-program`
- `PilotProgram.tsx` row replaced by `FoundingPartnerProgram.tsx | /founding-partner-program (alias: /pilot-program)` with cross-reference to Section 55

#### 3. Canonical File-Name Map — old → new
All stale `PlaybookLibraryV2.tsx` and `PlaybookDetail.tsx` references updated to current file names:

| Old name | New (canonical) name | Locations updated |
|---|---|---|
| `PlaybookLibraryV2.tsx` | `ProtocolLibrary.tsx` | Section 12 `DOMAIN_DB_MAP` heading; Section 13 page table |
| `PlaybookDetail.tsx` | `ProtocolDetail.tsx` | Section 13 page table; Section 24 UUID/number lookup paragraph; Section 27 Source Governance Indicator heading |

#### 4. Section Number Deduplication
Two sections were both numbered `## 50.` and `## 51.`:
- First `## 50.` (Homepage Signal Feed Deduplication, rev 28) → **unchanged, remains 50**
- Second `## 50.` (Founding Partner Program Page, rev 30) → **renumbered to 55**
- Second `## 51.` (Rev 31 Change Log) → **renumbered to 56**
- This change log → **57**

No content in any of those sections was altered — numbers only.

---

## 58. May 14, 2026 — Rev 33 Change Log

### Codebase Accuracy Pass

Live audit of `client/src/pages/` and `client/src/App.tsx` against the rev 32 doc identified three concrete drifts. All corrected below.

#### 1. `PlaybookActivationConsole` → `ProtocolActivationConsole` (global — 21 occurrences)

The component file was renamed to `ProtocolActivationConsole.tsx` as part of the broader Playbook→Protocol terminology migration. The developer reference was still using the old name throughout. All 21 occurrences replaced globally — this covers: the page table (Section 13), the route example code block (Section 11), the Mission Control flow description (Section 15), the `BriefLoadingState` note, the GuidedStart flow description (Section 19), the AI Execution Brief / Debrief / Auto-Task Seeding sub-section headings (Section 27), the ExecutionStageGuide variant table (Section 33), the messaging guidelines note on retained vocabulary (Section 32), the Compound Threat Intelligence April 2026 sweep list, the Ownership Close-Out Gate and Recovery/Debrief Classification sections (Section 43), and the Ownership Records retired-term table.

The `ProtocolActivationConsole` component file is at:
`client/src/pages/ProtocolActivationConsole.tsx`

Route (unchanged): `/playbook-activation/:triggerId/:playbookId`

#### 2. `/audit-logging` → `/audit-logging-center` (Section 17)

Settings page button table updated: "View System Logs" and "Security Scan" buttons were documented as navigating to `/audit-logging`. The live route is `/audit-logging-center` (component: `AuditLoggingCenter.tsx`). Two table rows corrected.

#### 3. Known additive gaps — still open, queued for Rev 36

Rev 34 and Rev 35 focused on OG meta, terminology, and doc accuracy. The following pages and routes exist in `App.tsx` and `client/src/pages/` but are not yet documented in this reference. They are not errors — they are undocumented additions. A future pass should add entries for each:

| File | Route | Notes |
|---|---|---|
| `ProtocolSettings.tsx` | `/playbook-library/:id/settings` | Companion route to `ProtocolDetail.tsx` |
| `FoundingPartnerMonitoring.tsx` | `/pilot-monitoring` | Operational monitoring for founding partner cohort |
| `FoundingPartnerHealthMonitor.tsx` | `/admin/pilot-health` | Admin health view |
| `FoundingPartnerOnboarding.tsx` | (not yet routed or undocumented) | Onboarding flow for founding partners |
| `FoundingPartnerDemo.tsx` | (not yet routed or undocumented) | Demo variant for founding partners |
| `ProtocolHealthDashboard.tsx` | (undocumented) | Protocol-level health metrics |
| `ProtocolManagement.tsx` | (undocumented) | Protocol management admin view |
| `SHEINTrendDemo.tsx` | `/shein-demo` | Industry demo — retail trend scenario |
| `SpaceXLaunchDemo.tsx` | `/spacex-demo` | Industry demo — launch operations scenario |
| IDEA sidebar sub-routes | `/identify/*`, `/detect/*`, `/execute/*`, `/advance/*`, `/setup/*`, `/learn/*` | Full tab sub-route tree — each maps to a sub-page component inside the relevant `client/src/pages/identify/`, `/detect/`, `/execute/`, `/advance/` directories |

---

## 59. May 14, 2026 — Rev 34 Change Log

### 1. OG Meta Tags — 5 Key Public Pages

Per-page Open Graph metadata wired to all key public-facing pages using `updatePageMetadata` from `client/src/lib/seo.ts`. Each call sets `title`, `description`, `ogTitle`, and `ogDescription` inside a `useEffect(() => { ... }, [])` at the top of the component. The `client/index.html` fallback OG tags remain as site-level defaults; per-page calls override them dynamically.

Pages updated:

| Page | File | Change |
|---|---|---|
| Homepage | `client/src/pages/Homepage.tsx` | Upgraded from bare `document.title` to full `updatePageMetadata`; added `@/lib/seo` import |
| How It Executes | `client/src/pages/HowItExecutes.tsx` | Added `updatePageMetadata` + `@/lib/seo` import |
| 12-Minute Test Drive (TryDemo) | `client/src/pages/TryDemo.tsx` | Added `updatePageMetadata` + `@/lib/seo` import |
| Investor Landing | `client/src/pages/InvestorLanding.tsx` | Added `useEffect` (React) + `updatePageMetadata` + `@/lib/seo` import (file had no React imports at all) |
| Founding Partner Program | `client/src/pages/FoundingPartnerProgram.tsx` | Already correctly wired — no change |

**`seo.ts` usage pattern (canonical):**
```typescript
import { updatePageMetadata } from '@/lib/seo';

useEffect(() => {
  updatePageMetadata({
    title: "Page Title | VaughnMartin",
    description: "...",
    ogTitle: "OG-optimized title",
    ogDescription: "OG-optimized description",
  });
}, []);
```
`InvestorResources.tsx` (lines 215–222) and `FoundingPartnerProgram.tsx` (line 322) remain the canonical reference implementations.

### 2. Terminology Fix — "Pilot Demo" Retired from Two Pages

Two instances of the retired "Pilot Demo" label found and corrected during the full test suite sweep:

| File | Location | Before | After |
|---|---|---|---|
| `client/src/pages/FoundingPartnerDemo.tsx` | Line 298 — `<PageHero>` eyebrow prop | `"Pilot Demo"` | `"Founding Partner Demo"` |
| `client/src/pages/DemoGallery.tsx` | Line 32 — demo card data array `title` field | `"Pilot Demo"` | `"Founding Partner Demo"` |

Internal code keys (`id: "pilot-demo"`, `path: "/pilot-demo"`) are exempt per the locked naming rule and were not changed.

### 3. Full Test Suite — Rev 34 Baseline

- **Unit tests:** 189/189 pass (10 test files)
- **Production build:** clean — zero TypeScript errors, all assets emitted
- **Key public pages visually verified via screenshot:** Homepage, How It Executes, 12-Minute Experience, Executive Brief, Demo Hub — all correct terminology, correct domain labels, Founding Partner language throughout
- **"72 hours" scan:** all instances confirmed as legitimate regulatory/scenario context (GDPR breach notification windows, SEC disclosure deadlines, scenario timeline data) — not the retired head-start metric framing

### 4. Rev 34 Known State

- All 189 unit tests pass
- Production build clean
- Per-page OG meta live on all 5 key public pages
- No remaining "Pilot Program", "Pilot Demo", "AI-powered", "AI-driven", or football domain label violations in visible UI copy (FounderStory.tsx preserves football language by deliberate exception)

---

## 60. May 14, 2026 — Rev 35 Change Log

Post-Rev-34 feedback pass. All changes are surgical text and copy corrections — no structural or component changes.

### 1. Guest Preview Banner — Nav Intent Clarity

`client/src/components/GuestPreviewBanner.tsx`

| Before | After |
|---|---|
| `Request Access` | `Request Founding Partner Access` |
| `Sign In` (href: `/request-access`) | `Executive Sign-In` (href: `/api/login`) |

The "Sign In" button was also incorrectly pointing to `/request-access` instead of the Replit OIDC login endpoint `/api/login`. Fixed simultaneously.

### 2. Static OG / Twitter Meta — `client/index.html`

The fallback OG tags (used by social crawlers that do not execute JavaScript) were updated:
- `og:title` / `twitter:title`: now use the canonical framing "30 Days Compressed to 12 Minutes"
- `og:description` / `twitter:description`: now use canonical tagline + "3,600× Execution Head Start"
- `meta name="description"`: uses "180 Readiness Protocols" (updated May 2026 from 170)

These are the tags social platforms (LinkedIn, Slack unfurls) will read when the page is shared. The JS `updatePageMetadata` calls override them in-browser but static tags are the safe fallback for crawlers.

### 3. Remaining "Pilot" Copy Fixes — 2 Live UI Locations

| File | Location | Before | After |
|---|---|---|---|
| `client/src/components/layout/StandardNav.tsx` | Line 162 — Onboarding Guide nav description | `"new pilot customers"` | `"new Founding Partner customers"` |
| `client/src/pages/GetStarted.tsx` | Line 116 — sign-in sub-label | `"Existing pilot customers"` | `"Existing Founding Partners"` |

### 4. Developer Reference Text Corrections (Rev 35)

| Section | Location | Before | After |
|---|---|---|---|
| §16 Signal Intelligence Hub | Line 730 fallback panel description | `"Request Pilot Access"` | `"Request Founding Partner Access"` |
| §16 Signal Intelligence Hub | Line 731 auth state label | `"Authenticated pilot customers"` | `"Authenticated Founding Partner customers"` |
| §33 ExecutionStageGuide variant list | `PlaybookDetail.tsx` entry | `PlaybookDetail.tsx` | `ProtocolDetail.tsx` |
| §37 Homepage Structure table | Row 14 | `Final "Request Pilot" CTA` | `Final Founding Partner CTA` |
| §38 ExecutiveDepartureBrief spec | Item 9 close CTA label | `Request Executive Pilot CTA` | `Request Founding Partner CTA` |
| §38 WelcomeBrief subsection heading | T004 heading | `30-Day Pilot Onboarding Arc` | `30-Day Founding Partner Onboarding Arc` |
| §58 open gaps note | Section heading + body | `"queued for Rev 34"` | `"still open, queued for Rev 36"` |

### 5. Rev 35 Known State

- All 189 unit tests pass
- Production build clean
- All visible "Pilot Program / Pilot Access / Pilot Demo / pilot customers / pilot targets" references eliminated from all pages, components, and developer documentation
- Static OG fallback tags carry canonical messaging for social sharing
- Guest banner intent: "Request Founding Partner Access" + "Executive Sign-In" + "See It Execute in 12 Minutes"

### 6. Additional Pilot Terminology Fixes (Podcast Prep Pass)

Found during full public-page audit prior to podcast promotion:

| File | Before | After |
|---|---|---|
| `Contact.tsx` | `"Pilot Partner Benefits"` (h3 heading) | `"Founding Partner Benefits"` |
| `Contact.tsx` | `"pilot readiness"` (form sub-label) | `"readiness priorities"` |
| `LiveDetectionFeed.tsx` | `"Pilot program members get..."` | `"Founding Partners get..."` |
| `TermsOfService.tsx` | Section title `"5. Confidentiality of Pilot Materials"` | `"5. Confidentiality of Partner Materials"` |
| `TermsOfService.tsx` | Body: `"Pilot program participants"` | `"Founding Partners"` |
| `ProspectBrief.tsx` | CTA URL badge: `"vaughnmartin.com/pilot-program"` | `"vaughnmartin.com/founding-partner-program"` |
| `InvestorPresentation.tsx` | `"3 Founding Partner pilot targets identified"` | `"3 Founding Partner targets confirmed"` |
| `InvestorPresentation.tsx` | `"Pilot program designed and ready"` | `"Founding Partner Program designed and ready"` |
| `InvestorResources.tsx` | `"Before second pilot customer"` | `"Before second Founding Partner"` |
| `A16ZPitch.tsx` | `"Pilot targets are identified"` | `"Founding Partner targets are confirmed"` |

**Note:** `/pilot-program` route, `data-testid="heading-pilot-program"`, `data-testid="button-pilot-programs"`, internal `setLocation('/pilot-program')` nav calls, and the `pilot@vaughnmartin.com` email address are **exempt** — these are code keys and contact infrastructure, not visible user-facing copy.

---

## §61 Rev 36 Change Log

### 1. Social Sharing — og:image + JSON-LD Structured Data

**File:** `client/index.html`

Added missing Open Graph image and Twitter card image, plus full JSON-LD `@graph` block. These were the primary drivers of the sub-70 SEO audit score.

**New OG/Twitter tags added:**
| Tag | Value |
|---|---|
| `og:url` | `https://vaughnmartin.com/` |
| `og:image` | `https://vaughnmartin.com/command-tower.jpg` |
| `og:image:width` | `1280` |
| `og:image:height` | `720` |
| `og:image:alt` | Command Tower description |
| `twitter:site` | `@vaughnmartin` |
| `twitter:image` | `https://vaughnmartin.com/command-tower.jpg` |
| `twitter:image:alt` | Command Tower description |

**Image:** `client/public/command-tower.jpg` — 1280×720 JPEG already present. Dimensions declared accurately.

**JSON-LD `@graph` (3 schemas):**
- `Organization` — VaughnMartin entity, founded 2023, startup to Fortune 500 audience
- `SoftwareApplication` — Readiness OS, `BusinessApplication` category, `featureList` with 180 protocols / 231 triggers / 12 minutes / 3,600× canonical numbers
- `WebSite` — with `SearchAction` pointing to `/playbook-library?search=`

**SPA ceiling note:** Per-page titles/descriptions are still JS-rendered (SPA constraint). Score ceiling is ~80–85 without SSR. Social preview (og:image) and structured data (JSON-LD) are the highest-ROI fixes for the podcast/VC audience.

---

### 2. CTA Route Mismatch Fix

**File:** `client/src/components/GuestPreviewBanner.tsx`

Two CTAs in the guest banner were using inconsistent routes.

| State | Button | Before | After |
|---|---|---|---|
| Default guest (top bar) | "Request Founding Partner Access" | `/request-access` | `/founding-partner-program` |
| Trial active | "Apply for Full Pilot →" (retired text + wrong route) | `/request-access` | `/founding-partner-program` |

**Pattern:** All other "Request Founding Partner Access" CTAs on the site (Homepage, StandardNav, HowItExecutes, etc.) route to `/founding-partner-program`. The banner was the only outlier. The `/request-access` route remains the correct destination for the "apply" form linked from the `/founding-partner-program` landing page itself.

---

### 3. Developer Reference Terminology — "Pilot" Drift Removal

Five operational narrative lines in this document carried legacy "pilot" language in non-changelog sections:

| Section | Before | After |
|---|---|---|
| §13 Role-Based Access | `"new pilot customers"` | `"new Founding Partner customers"` |
| §15 Mission Control Activation Flow | `"When a pilot customer clicks"` | `"When a Founding Partner clicks"` |
| §18 Try Demo | `"pilot prospects, and investors"` | `"Founding Partner prospects, and investors"` |
| §26 AI Execution Brief | `"Before a pilot customer confirms"` and `"GPT-4o-generated"` | `"Before a Founding Partner confirms"` and `"system-generated"` |
| §30 Converted Redirects table | `"confuse pilot customers"` | `"confuse Founding Partners"` |

**Note:** Changelog entries in §60 that document the *old* wording (e.g. `"Before: pilot customer"`) are intentional record-keeping and are not changed.

---

### 4. Rev 36 Known State

- All 189 unit tests pass
- Production build clean
- `og:image` + `twitter:image` now serve `command-tower.jpg` (1280×720) — social previews confirmed
- JSON-LD structured data active for Organization, SoftwareApplication, WebSite
- GuestPreviewBanner "Request Founding Partner Access" routes consistently to `/founding-partner-program` across all banner states
- All operational "pilot customer/prospect" references eliminated from developer documentation

---

## §62 Rev 37 Change Log

### 1. ConsequencePreview — MasterDemo Integration

**File:** `client/src/pages/MasterDemo.tsx`

Phase 4 (Executive Authorization) in `MasterDemo.tsx` previously rendered a single "AUTHORIZE FULL ACTIVATION →" button. It now renders the full `ConsequencePreview` component, giving the executive all four response choices across every demo scenario routed through `/demo/:scenarioId`.

**Changes:**
- Imported `ConsequencePreview` and `ConsequenceChoice` into `MasterDemo.tsx`
- Added `choiceMade: ConsequenceChoice | null` state to `PhaseAuthorize`
- `handleAuth()` updated to accept a `ConsequenceChoice` parameter
- Single-button section replaced with `<ConsequencePreview>` wired to `sc.triggerHeadline`, `sc.protocolNumber`, `sc.protocolName`, `sc.tasks.length`, and `sc.stakeholders`
- Post-authorization confirmation panel shows choice-specific message (e.g. "Audible Called — Adjusted Protocol Activating")

**Coverage after this change:**
| Surface | ConsequencePreview present |
|---|---|
| All 12 scenario demos (`/demo/:scenarioId`) | ✅ |
| 12-Minute Test Drive (`/12-minute-experience`) | ✅ (pre-existing) |
| Live Activation Center (`/live-activation`) | ✅ (pre-existing) |

---

### 2. ConsequencePreview — Audible and Customize Built Out as Interactive Experiences

**File:** `client/src/components/ConsequencePreview.tsx`

Previously, the Audible and Customize consequence panels were read-only explanations. Both are now fully interactive.

#### Audible — Interactive Delta Review

Surfaces 3 delta items showing where current organizational state diverges from the pre-staged protocol. Delta fields are derived from the live `stakeholders` prop passed into the component.

**Per-item interaction:**
- Each item shows: field name, impact level (HIGH/MEDIUM), pre-staged value, current-state value, and consequence of not resolving
- Two toggle buttons per item: **Accept Change** (teal) and **Keep Pre-Staged** (gold) — clicking the active button deselects it
- Border and background tint reflect the current decision state per item
- Progress bar fills as items are reviewed; "X/3 REVIEWED" counter updates live

**Gate logic:**
- Confirm button is hidden until all 3 items have a decision
- Once all 3 reviewed: summary panel shows accepted count vs. reverted count, then "Confirm — Activate Adjusted Protocol" button appears

**Delta items (scenario-aware):**
| # | Field | Source |
|---|---|---|
| 1 | Primary Protocol Owner | `stakeholders[0].name / role` |
| 2 | External Counsel Availability | Static (representative for all scenarios) |
| 3 | Board Notification Channel | `stakeholders[legalIndex].name` |

#### Customize — Live Editable Fields

Opens 3 editable text inputs, each pre-filled with the protocol's default value.

**Per-field behavior:**
- Editing any field highlights it in blue with a "MODIFIED" badge
- A "Revert to pre-staged" link appears beneath any changed field, restoring the default
- Modified-count badge ("2 MODIFIED") appears in the panel header dynamically

**Confirm button:**
- Always available (no gating — executive can activate unchanged if preferred)
- Button label is dynamic: "Activate with N Modification(s)" vs. "Activate as Pre-Staged"

**Fields:**
| # | Label | Default Value |
|---|---|---|
| 1 | Primary Protocol Owner | Chief Legal Officer |
| 2 | First External Communication | Template: Regulatory Disclosure v3 |
| 3 | Escalation Threshold | Board notification at T+30min |

#### Stand Down — Unchanged (already fully functional)
Requires a typed reason before the confirm button activates. Governance record framing preserved.

#### Component API — unchanged
The `ConsequencePreviewProps` interface and `onConfirm(choice, standDownReason?)` signature are backward-compatible. No call sites required updates.

---

### 3. Rev 37 Known State

- All 189 unit tests pass
- Production build clean
- `ConsequencePreview` is fully interactive for all 4 choices across all 3 activation surfaces
- Audible: gated confirm (all 3 delta items must be reviewed before activating)
- Customize: live editable fields, dynamic confirm label, always-available confirm
- Stand Down: typed reason required, governance record framing
- Run as Built: T+N timeline, stakeholder/task count summary, immediate confirm

---

## §64 Navigation Change — Investors Removed from Primary Nav (May 2026, rev 40)

### What Changed

**Files:** `client/src/pages/Homepage.tsx`, `client/src/components/layout/StandardNav.tsx`

"Investors" was removed from both primary navigation bars. The change is presentation-only — all investor pages remain fully live at their direct URLs and are accessible via the footer and `/sitemap`.

### Rationale

The Investors link appearing in the top nav during customer prospect walkthroughs (COO/CISO/CSO audience) signals that the platform is still in fundraise mode. Removing it from primary nav keeps the prospect experience clean and product-focused.

### What Was Changed

| File | Change |
|---|---|
| `client/src/pages/Homepage.tsx` (desktop nav) | Removed "Investors" link from inline nav items array |
| `client/src/pages/Homepage.tsx` (mobile nav) | Removed "Investors" entry from mobile menu overlay |
| `client/src/components/layout/StandardNav.tsx` | Removed `renderInvestorsDropdown()` call from the desktop nav center block (function still exists but is no longer called) |

### What Was NOT Changed

- `renderInvestorsDropdown()` function in `StandardNav.tsx` — still present, just not called
- `/investor-landing` — live at direct URL
- `/investor-presentation` — live at direct URL (also target of `/pitch-deck` redirect)
- `/investor-resources` — live at direct URL
- `/roadshow-resources` — live at direct URL
- Footer links to investor pages — unchanged
- `/sitemap` (Platform Directory) — lists all investor pages

### Re-enabling Investors in Nav (if needed)

To restore the Investors link to `StandardNav`, re-add the `renderInvestorsDropdown()` call inside the desktop nav center block in `StandardNav.tsx`. To restore it on the Homepage, re-add the "Investors" entry to the inline nav items array and the mobile menu in `Homepage.tsx`.

---

## §63 E2E Test Suite — May 2026 (rev 38)

### Overview

A Playwright end-to-end test suite runs against the live production site (`https://vaughnmartin.com`) using Chromium. It covers brand compliance, critical page loads, demo flows, and terminology enforcement across all public-facing routes.

| Metric | Value |
|---|---|
| Total tests | **121** |
| Browser | Chromium (Desktop Chrome) |
| Target | `https://vaughnmartin.com` (production) |
| Spec files | 3 |
| Parallelism | Fully parallel |

---

### Spec Files

| File | Tests | Covers |
|---|---|---|
| `e2e/comprehensive-platform-tests.spec.ts` | ~57 | Public page loads, content assertions, terminology enforcement, Founding Partner language, no retired phrases |
| `e2e/demo-flows.spec.ts` | ~30 | Homepage branding, 12-Minute Test Drive, Playbook Library, ROI Calculator, demo and investor pages |
| `e2e/brand-compliance.spec.ts` | ~34 | Brand rules across all key public pages — no "AI-powered," no "Pilot Program," no football domain labels, correct canonical metrics |

---

### Running the Suite

**Against production (canonical — how the CI runner uses it):**
```bash
BASE_URL=https://vaughnmartin.com npx playwright test --project=chromium
```

**Against local dev server:**
```bash
npx playwright test --project=chromium
# playwright.config.ts auto-starts `npm run dev` on localhost:5000 when BASE_URL is not set
```

**Single spec file:**
```bash
BASE_URL=https://vaughnmartin.com npx playwright test e2e/brand-compliance.spec.ts --project=chromium
```

**With HTML report:**
```bash
BASE_URL=https://vaughnmartin.com npx playwright test --project=chromium
npx playwright show-report
```

---

### Configuration (`playwright.config.ts`)

```ts
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const isProduction = BASE_URL.includes('vaughnmartin.com') || BASE_URL.includes('https://');
```

- When `BASE_URL` points to production, the local `webServer` block is skipped — Playwright tests against the live deployed app directly.
- When `BASE_URL` is absent, `playwright.config.ts` auto-starts `npm run dev` and waits for `localhost:5000`.
- CI sets `retries: 2` and `workers: 1` for stability. Local runs use default parallelism and no retries.

---

### Critical Implementation Rules

#### 1. Never use `waitForLoadState('networkidle')` on production routes

**Root cause (discovered May 2026):** The platform runs a Socket.IO WebSocket server. Socket.IO maintains a persistent connection that keeps at least one network connection open indefinitely. Playwright's `networkidle` waits for zero active connections for 500ms — which **never resolves** on any page that has loaded the Socket.IO client. The test hangs until the navigation timeout (30s) fires, then fails.

**Correct pattern for all production-facing tests:**
```ts
await page.goto('/some-route');
await page.waitForLoadState('load');   // fires after initial resources — does not wait for WebSocket
await page.waitForTimeout(2500);        // gives React time to fully hydrate before reading innerText()
```

`'load'` fires after the initial HTML + linked resources are fetched. It does not wait for persistent connections. The 2500ms buffer is sufficient for React hydration on the production CDN.

**Never use:**
```ts
await page.waitForLoadState('networkidle');  // ❌ hangs forever on Socket.IO pages
```

#### 2. `innerText()` respects CSS `textTransform`

Playwright's `page.locator('body').innerText()` returns text **as it visually appears**, including the effect of `textTransform: uppercase`. If a component renders text with `textTransform: uppercase`, `innerText()` returns the uppercase version — not the source string.

**Implication:** When asserting on text that may be rendered in an uppercase CSS context, use case-insensitive comparison:

```ts
const bodyLower = (await page.locator('body').innerText()).toLowerCase();
expect(bodyLower.includes('readiness os')).toBe(true);
// ✅ matches "READINESS OS", "Readiness OS", "readiness os" — all cases
```

Do not use `.toContain('Exact Case')` on text that lives inside a `textTransform: uppercase` element.

#### 3. Pre-React loading placeholder in `index.html`

`client/index.html` contains a loading placeholder inside `<div id="root">` that renders "VaughnMartin / Readiness OS" in the static HTML before React hydrates. React replaces it on mount.

This ensures `innerText()` reads a non-empty body even in the brief window between page navigation and JS execution — preventing intermittent empty-string failures on homepage assertions. Do not remove or empty the `<div id="root">` contents.

#### 4. Auth-gated routes are excluded from the public suite

Routes that require authentication (dashboard, workspace, protocol activation console, etc.) are not tested by this suite. Tests only cover fully public routes — no login step, no session setup. Auth-gated routes are covered by unit tests (`vitest`) and manual QA.

---

### Terminology Assertions (brand-compliance.spec.ts)

The brand compliance spec asserts that the following **never appear** in `innerText()` on any key public page:

| Retired phrase | Rule source |
|---|---|
| `"AI-powered"`, `"AI-driven"`, `"AI-generated"`, `"AI-detected"` | Language Enforcement (§32) |
| `"GPT-4o"` (in user-facing copy) | Language Enforcement (§32) |
| `"Pilot Program"`, `"Pilot Access"`, `"Now in Pilot"` | Founding Partner Program (§55) |
| `"340×"`, `"360×"`, `"72 hours"` (as execution metric) | Canonical Metrics Lock (§32) |
| `"human-AI partnership"` | Executive Authority framing (§32) |
| `"Offense"`, `"Defense"`, `"Special Teams"` (as domain labels) | Football Terminology Retirement (§37) |

And that the following **always appear** on their respective pages:

| Page | Required text |
|---|---|
| Homepage | `"VaughnMartin"`, `"Readiness"` |
| `/buyer-decision-packet` | `"90"` (day reference), `"Founding Partner"` |
| `/founding-partner-program` | `"Founding Partner"` |
| All key pages | Must not contain any retired phrase listed above |

---

### Rev 38 Known State

- 121/121 tests passing on Chromium against `https://vaughnmartin.com`
- `waitForLoadState('load')` + 2500ms used consistently — no `networkidle` calls remain in any spec
- Case-insensitive body text checks used wherever CSS `textTransform` may affect output
- Pre-React loading placeholder in `index.html` eliminates homepage timing race

---

## §65 — 2026 AI Stack Session: Semantic Scoring, Parallel Ingestion, /ai-stack Page, Full Language Audit (May 2026, rev 41)

### New Server Services

#### SemanticScoringService (`server/services/SemanticScoringService.ts`)
- Uses `text-embedding-3-small` (Azure OpenAI / OpenAI fallback)
- Cosine similarity scored against 16 pre-defined trigger pattern descriptions
- Results cached in-memory by signal content hash; never re-embeds the same text
- Exposed as `getSemanticScore(text): Promise<number>` returning 0–1 similarity

#### DB Schema Addition
- `signals` table: `semantic_similarity_score real` column added
- Added to `shared/schema.ts`; column added to live DB via `ALTER TABLE IF NOT EXISTS`
- No `db:push` needed — column already exists in production DB

#### SignalEvaluationService — Non-Blocking Enrichment (`server/services/SignalEvaluationService.ts`)
- After a signal is inserted (Tier 5), semantic scoring runs in a `setImmediate` callback (P2 block)
- Does not block the ingestion pipeline; updates the DB row once embedding returns
- Pattern: `setImmediate(() => SemanticScoringService.score(text).then(score => db.update(...)))`

#### LiveSignalIngestionService — Parallel Tier Execution (`server/services/LiveSignalIngestionService.ts`)
- **Tier 5** (signal classification) remains sequential — must complete before storage
- **Tiers 6, 7, 8** now run with `Promise.allSettled([tier6(), tier7(), tier8()])` concurrently
- Reduces per-cycle latency; individual tier failures are isolated (allSettled, not all)

### New Pages

#### `/ai-stack` — AIStackPositioning.tsx (`client/src/pages/AIStackPositioning.tsx`)
5-layer enterprise AI stack positioning page:
- Layer 1: Data & Infrastructure (Azure / M365 data layer)
- Layer 2: AI Models & APIs (Azure OpenAI, GPT-4o — technical listing only)
- Layer 3: Intelligence & Pattern Detection (semantic signal scoring)
- Layer 4: Orchestration & Execution (Readiness OS orchestration role)
- Layer 5: Human Authorization & Governance (executive sign-off layer)
- Gap callout panel, cross-cutting foundations (Microsoft framing), 3-stat editorial block
- Route registered in `client/src/App.tsx`

#### TechnicalArchitecture.tsx — AI Stack Section Added
- New "2026 AI Stack Positioning" section: 5-layer grid showing where Readiness OS sits at each layer
- Microsoft framing: "Every enterprise has Microsoft's AI stack. None have the operating model to use it."
- GPT-4o appears here only as a technical integration listing (permitted by Language Enforcement rule)

### Language Audit — Full Sweep (TA–TK + VERIFY)

All 11 task groups scanned and resolved. Final state:

| File | Change |
|---|---|
| `ExecutiveDepartureBrief.tsx` | "Request Executive Pilot" → "Apply for Founding Partner Access"; "Board-authorized pilots" → "Board-authorized validations"; "30-day" → "90-day activation arc" |
| `ProspectBrief.tsx` | "Request a 2-Week Pilot" → "Request a 90-Day Founding Partner Validation" |
| `QuickDemoPage.tsx` | "Start a pilot to see Readiness OS" → "Apply for Founding Partner access to see Readiness OS" |
| `FutureGym.tsx` | "VaughnMartin pilot network" → "VaughnMartin Founding Partner network" |
| `CustomerJourney.tsx` | "pilot and enterprise options" → "Founding Partner and enterprise options" |
| `SettingsHub.tsx` | "Pilot Mode" → "Founding Partner Mode"; "authorized pilot users" → "authorized Founding Partner users" |
| `KeynoteDemo.tsx` | "Start a 30-day pilot with your organization" → "Apply for the 90-day Founding Partner validation program" |
| `RoadshowResources.tsx` | "Pilot Price" stat label → "Founding Partner Price" |
| `ReadinessAssessment.tsx` | "Founding Partner Pilot — a guided 6-week" → "Founding Partner Program — a guided 90-day" |

**Acceptable / intentionally unchanged:**
- `pilot@vaughnmartin.com` email addresses — operational contact, not marketing copy
- "Pilot Testing / Pilot Implementation" in `NovaInnovations.tsx` — standard product dev lifecycle terms
- "95% of companies are piloting AI" in `Investors.tsx` — industry analyst language
- "Phase 1 pilot department" in `RoleExperience.tsx` — internal corporate rollout phase
- `id: 'pilot'` / `path: '/pilot-demo'` — internal code identifiers
- Football language in `FounderStoryFull.tsx` — preserved deliberately per replit.md

### Compliance Checklist Post-Audit

| Rule | Status |
|---|---|
| No "AI-powered/driven/generated/detected" in user-facing copy | ✅ Zero hits |
| No "GPT-4o" outside technical integration listings | ✅ Zero hits |
| No "Pilot Program / Pilot Access / Now in Pilot" as CTA text | ✅ Zero hits |
| No "human-AI partnership" | ✅ Zero hits |
| No "Offense/Defense/Special Teams" as domain labels | ✅ Zero hits (FounderStoryFull exempt) |
| No "340×/360×" framing | ✅ Zero hits |
| "72 hours" only in regulatory/scenario context | ✅ Verified — never used as execution metric |
| All Founding Partner CTAs use correct language | ✅ Verified |

### Rev 41 Known State
- Build: ✅ clean (`✓ built in ~200ms`, zero TS errors, pre-existing eval warning only)
- Tests: ✅ 189/189 passing (10 test files)

---

## 60. Competitive Differentiation — Proof Story + Executive Brief + ROI Calculator — May 22, 2026 (rev 44)

Three pages were updated together as a coordinated competitive positioning package. The goal: every sales-facing page names specific vendors, shows what they cost, and explains exactly why Readiness OS is not an alternative to any one of them — it replaces the entire stack.

### Proof Story (`/proof-story`) — `client/src/pages/ProofStory.tsx`

**New section added:** "Why 12 Minutes Is Possible" — appears before the three activation narratives.

Three structural pillars explain the mechanism:
1. **Pre-staged, not reactive** — Protocols built before triggers fire, so there is nothing to assemble when the moment arrives.
2. **Pattern detection, not committee deliberation** — 231 trigger patterns scored continuously; no human has to decide when to escalate.
3. **Executive authorization, not consensus** — One sign-off unlocks budget, tasks, and stakeholders simultaneously.

**Full competitive comparison table added** (4 columns: Capability / Readiness OS / Closest Competitor / Gap):

| Vendor category | What they do | What Readiness OS adds |
|---|---|---|
| Everbridge | Mass notification + incident comms | Pre-staged response — not just notification |
| ServiceNow GRC | Workflow automation post-trigger | Protocol staging before the trigger |
| Jira / Monday.com | Project tracking | Full pre-built task trees, roles, budgets |
| McKinsey / Big 4 | Strategic response consulting | Same depth, automated, 3,600× faster |
| Microsoft Copilot | AI summaries and drafts | Execution orchestration, not content generation |
| Internal War Room | Ad-hoc crisis coordination | Structured, pre-authorized mobilization |

**Closing line (locked):** "The competitive question isn't 'Readiness OS or Everbridge.' It's whether your org wants six separate vendors or one platform."

Do not remove this table or the closing line without founder approval. It is the primary objection-handler for multi-vendor procurement conversations.

---

### Executive Brief (`/executive-brief`) — `client/src/pages/ExecutiveBrief.tsx`

**Comparison table updated:** Rows now name specific vendors instead of generic categories.

- Legacy column entries replaced: "Incident Management Platform" → **Everbridge**, "GRC Platform" → **ServiceNow / Riskonnect**, "Project Management" → **Jira / Asana**
- **New row added:** "Vendor Stack Required" — shows "$500K–$1M+ annual stack" (legacy column) vs. "One subscription" (Readiness OS column)

**ROI case updated:**
- Regulatory penalty avoided: **$5M–$50M** (previously generic "millions")
- Vendor stack displaced: **$300K–$900K** annual (Everbridge + ServiceNow + consulting + PM tools)

**Rule:** Vendor names in the comparison table must remain accurate to current market pricing. If a named vendor significantly changes its pricing model, update the row — do not revert to generic category labels.

---

### ROI Calculator (`/roi-calculator`) — `client/src/pages/ROICalculator.tsx`

**"vs. Consulting Alternative" sidebar panel replaced** with **"What Readiness OS Replaces"** — a 4-line itemized displacement calculation:

| Line item | Annual cost shown |
|---|---|
| Everbridge (incident comms) | $60,000 |
| ServiceNow GRC (workflow automation) | $180,000 |
| Consulting retainer (strategic response) | Dynamic — pulled from the consulting retainer slider value |
| Project management tooling (Jira/Monday) | $40,000 |
| **Total stack** | Live-calculated sum |
| **Net savings** | Total stack − Readiness OS subscription cost |

The consulting retainer line is the only dynamic value — it reads from the existing platform cost slider so the savings calculation updates in real time as the user adjusts inputs.

**Design rule:** This panel uses the same navy/gold card styling as the rest of the sidebar. Do not introduce a new color or layout pattern here.

---

## 61. Homepage ThreeStepSection — Fragment Key Fix — May 22, 2026 (rev 44)

**File:** `client/src/pages/Homepage.tsx`

**Problem:** The `ThreeStepSection` component mapped an array of step objects and wrapped each iteration in a bare React fragment (`<>`). The `key` prop was placed on the inner `<div>` instead of the outermost element. This caused two React warnings visible in the browser console:
1. `Warning: Each child in a list should have a unique "key" prop — Check the render method of ThreeStepSection`
2. `Warning: Invalid hook call` (cascaded from the key reconciliation failure)

These were console errors, not visible rendering bugs — but they appear in production DevTools and indicate a real reconciliation issue.

**Fix:**
- Added `Fragment` to the React import at line 1: `import { Fragment, useEffect, useRef, useState } from "react"`
- Replaced `<>` with `<Fragment key={step.n}>` so the key is on the outermost tracked element
- Removed the now-redundant `key` from the inner `<div>` and the arrow `<div>`

**Visual result:** Zero change. The three cards (Signal detected → Executive authorizes → Coordinated execution) render identically. No layout, color, or content was altered.

**Rule:** Any future `.map()` in Homepage.tsx that returns multiple sibling elements must use `<Fragment key={...}>` — never bare `<>` — so keys are always on the outermost element React tracks.

---

### Rev 44 Known State
- Build: ✅ clean, zero TS errors
- Tests: ✅ 189/189 passing (10 test files)
- Browser console: ✅ zero React warnings on homepage
- Commits: Proof Story/Executive Brief/ROI Calculator changes at `184daee`; ThreeStepSection fix at `d157057`

---

## 62. Homepage Hero — Live Simulation Panel + 5 Conversion Improvements — May 23, 2026 (rev 45)

### 62b. RealityGapSimulator — Homepage Mobilization Gap Animation (rev 66)

**File:** `client/src/pages/Homepage.tsx` — `RealityGapSimulator` function

**Placement:** Inserted immediately after `<HeroSection />` and before `<ScenarioCardsRow />` in the render order (section 1b). Visitors encounter it on first scroll — no user action required.

**What it does:** 10-second auto-playing animation that makes the 30-day vs. 12-minute contrast visceral and emotional rather than abstract. Three phases driven by `useState<0 | 1 | 2>` + `setTimeout`:

| Phase | Timing | Visual |
|---|---|---|
| 0 — Without Readiness OS | 0–4.2s | Red-tinted panel; day counter ticks 0→30 via `setInterval`; chaos list items reveal progressively |
| 1 — With Readiness OS | 4.2–8.4s | Teal panel activates; 12:00 countdown ticks to 0:00; readiness items reveal as steps complete |
| 2 — Result | 8.4s+ | Gold result strip: "30 days → 12 minutes · 3,600× Execution Head Start"; gold CTA "Make This Real →" links to `/founding-partner-program` |

**Replay button:** Top-right "↺ Replay" resets all state and reruns `runSim()`.

**Messaging compliance:**
- "3,600× Execution Head Start" — canonical framing (never "speed advantage")
- "30 days" → "12 minutes" — locked comparison
- CTA: "Make This Real →" → `/founding-partner-program` (Founding Partner language)
- No AI-powered/driven language anywhere in the component

**Do NOT remove or replace** — this is the first-scroll emotional proof point for the product thesis (Preparation → Readiness → Fearless). The ExecChainSection immediately below shows HOW it executes; this simulator shows WHY the gap matters.

---

### 62a. HeroSimPanel — Live Auto-Cycling Execution Simulation

**File:** `client/src/pages/Homepage.tsx` — `HeroSimPanel` function (defined before `HeroSection`)

**What it does:** Replaces the static `VaughnMartinLogo` + motto in the hero right column with a continuously-running, auto-cycling execution simulation. The panel starts immediately on page load — no user interaction required.

**4 scenarios (rotate every ~32 seconds):**
| Scenario | Domain | Protocol |
|---|---|---|
| Hospital Ransomware — EHR Systems Locked | RISK & RESILIENCE | Protocol #044 |
| Activist Investor Files 13D — 9.2% Stake | GROWTH & POSITIONING | Protocol #031 |
| FDA Class I Recall — Contamination Signal | RISK & RESILIENCE | Protocol #058 |
| SWIFT Outage — $4.7B Settlements at Risk | RISK & RESILIENCE | Protocol #007 |

**5 phases per cycle (timed with `useEffect` + `setTimeout`):**
1. **DETECT** (0–4.5s) — Risk score animates from 0 → 94 using `setInterval` at 110ms intervals; matched protocol displayed below
2. **STAGE** (4.5–8.5s) — Task count shown as pre-staged; 4 readiness items listed
3. **AUTHORIZE** (8.5–12.5s) — Executive role displayed; pulsing dots; "No committee. No meeting." copy
4. **EXECUTE** (12.5–27.5s) — 6 task rows tick through every ~2.5s; gold dot for exec-owned steps, teal for system/functional steps
5. **COMPLETE** (27.5–32s) — Checkmark (✓), outcome statement, financial stat in gold

**State managed:**
- `scenarioIdx` — which of the 4 scenarios is active (dot-nav at bottom lets visitors jump directly)
- `phase` — current phase string: `"detect" | "stage" | "authorize" | "execute" | "complete"`
- `riskScore` — animates 0→94 during DETECT phase
- `activeStep` — which execute-phase task row is highlighted

**Cleanup:** All `setTimeout` handles collected in `timers[]` array; `scoreInterval` stored separately. Both cleared in `useEffect` cleanup to prevent leaks on scenario change.

**Layout change:** Hero grid column ratio changed from `"1fr 36%"` to `"1fr 42%"` to give the panel adequate width. `alignItems: "stretch"` added so the panel fills the full hero height.

**Bottom bar:** 4 dot-nav buttons (active = gold, elongated pill; inactive = gray circle). "See all 19 industries →" links to `/industry-demo-library`.

**Domain color logic:** `GROWTH & POSITIONING` → `GOLD`; everything else → `TEAL`. Left border on the panel reflects the active scenario's domain color.

**Do NOT:**
- Remove the `useEffect` cleanup — without it, scenario transitions will fire stale timers
- Use `SCENARIOS.length` as a dependency in the `useEffect` dep array (it's a stable literal 4 — not needed)
- Re-add the static logo to this column; the logo appears in `HomepageNav` already

---

### 62b. 5 Homepage/Demo Conversion Improvements (built prior to rev 45)

**File:** `client/src/pages/Homepage.tsx`, `client/src/pages/IndustryDemoDetail.tsx`, `client/src/pages/IndustryDemoLibrary.tsx`

These five improvements were shipped together in the prior session:

**1. Microsoft Hook Strip** — Early in the homepage (above the fold), a single-line gold banner: "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Links to `/ecosystem`. Reinforces the locked Microsoft framing before the user reaches the product explanation.

**2. Fearless Finale Section** — Full-width section placed before the final CTA block. Delivers the emotional arc endpoint: "Fearless." Completes the **Preparation → Readiness → Fearless** thesis arc on the homepage.

**3. ROI Bridge after Simulation Completion** — In `IndustryDemoDetail.tsx`, after the 12-minute simulation completes, a bridge panel appears showing the ROI link ("See the full ROI breakdown →") and the Executive Brief CTA. Prevents drop-off at the end of the demo.

**4. Contextual Sidebar CTA** — In `IndustryDemoDetail.tsx`, the sidebar CTA copy dynamically adapts based on `blueprint.industry` — healthcare scenarios show healthcare-specific framing, financial scenarios show financial framing, etc. Uses a lookup map of `{ industry: copy }` pairs.

**5. Demo Library Results Counter + Clear Filter** — In `IndustryDemoLibrary.tsx`, the active domain filter now shows a results count ("Showing 4 of 19 scenarios") and a "Clear filter" button appears when a domain filter is active. Reduces abandonment when a filter returns a short list.

---

### Rev 45 Known State
- Build: ✅ clean, zero TS errors
- Tests: ✅ 189/189 passing (10 test files)
- Browser console: ✅ zero errors
- Key commits: `58baf1c` (HeroSimPanel), `b3f216d` (5 conversion improvements)

---

## 66. Production Audit Fixes + Terminology Corrections — May 24, 2026 (rev 47)

Four auditor-flagged issues resolved and published; two developer-reference corrections applied.

### 66a. API Protocol Count — 210 (was returning 170)

**File:** `server/routes.ts` — `/api/playbook-library` handler

The route was filtering protocols against a `categoryMap` that had incomplete coverage, causing 40 records to be silently dropped. Removed the hard filter; all 210 protocols now returned. Live verification: `offense 63 + defense 85 + special_teams 62 = 210`.

**Dev-ref fix:** §7 route table line updated from "180-protocol library" → "210-protocol library (180 core + 30 compound, IDs 181–210)."

### 66b. Canonical URL — Dynamic Per Route (was static)

**File:** `client/src/App.tsx`

Added `CanonicalUpdater` component (mounted once inside `<Router>`) that calls `useLocation()` and updates `<link rel="canonical">` on every route change. Eliminates the SEO issue of all pages sharing the same static canonical URL set in `index.html`.

### 66c. Semantic Heading Structure — Full Audit

All 208 page components audited. Result: **0 missing H1s, 0 multi-H1 pages**. Pattern used throughout: `<h1 className="sr-only">Page Title — Readiness OS</h1>` as first child after the page wrapper. Screen-reader accessible; zero visual impact.

### 66d. Replit Dev Banner Removed

**File:** `client/index.html`

Removed the Replit development environment banner injection that was appearing in the published app's HTML. No functional impact; cleaner production output.

### 66e. FounderStoryIntro.tsx — "72 Hours" Fully Retired (Visual + Audio)

**File:** `client/src/components/marketing/FounderStoryIntro.tsx`

Two layers fixed:

**Visual (JSX):** Scene 0 display stat `72 HOURS` → `30 DAYS`. Quote: "That's how long it takes." → "That's how long mobilization takes." Scene 1 body updated to reference the mobilization cycle.

**TTS audio narration (`SCENE_NARRATIONS` array):** Scene 0 string `"Seventy-two hours. That's how long it takes."` → `"Thirty days. That's how long mobilization takes."` Scene 1 string `"That's how long it takes most Fortune 500 companies to respond to a crisis."` → `"That's how long most Fortune 500 companies spend just mobilizing after a strategic trigger fires."` These strings feed the text-to-speech API and are spoken aloud when audio is enabled — they must match the visual copy exactly.

**Dev-ref fix:** §51 updated to document both layers of the fix.

### 66f. Audience Framing — "Fortune 1000" → "startup to Fortune 500"

Seven instances in developer-reference.md where VaughnMartin's audience was described as "Fortune 1000" were corrected to "startup to Fortune 500" or "high-growth startups, mid-market companies, and global enterprises — from startup to Fortune 500," matching the locked founder vision in replit.md. Benchmark rate figures (`$3,472/min Fortune 1000 rate`) and external market stats ("65% of Fortune 1000 companies still piloting") were left untouched — those are legitimate third-party references, not audience self-descriptions.

### Rev 47 Known State
- Build: ✅ clean
- All 4 auditor issues: ✅ resolved and published
- FounderStoryIntro "72 hours": ✅ resolved
- Audience framing "Fortune 1000": ✅ corrected throughout dev-ref
- Key commits: `9c7f34aa` (protocol count + FounderStoryIntro fix), `aec267f4` (Fortune 1000 → startup to Fortune 500)

---

## 67. Nav + Homepage — /universal-connector and /technical-onboarding surfaced — May 24, 2026 (rev 48)

Two new pages built in the prior session were not yet reachable from the main navigation or the homepage. This entry documents where they were wired in.

### 67a. StandardNav — Technical Architecture Section

**File:** `client/src/components/layout/StandardNav.tsx`

`/platform-integrations` (generic label, incomplete scope) was replaced in the megamenu Technical Architecture section with two focused entries:

- **Universal Connector** (`/universal-connector`) — "Any stack. 55+ pre-built connectors. Live in 15 minutes."
- **Integration Setup Plan** (`/technical-onboarding`) — "Phased technical guide — identity, signals, execution, Microsoft stack"

Both entries are `featured: true` so they render with the gold-highlighted style in the megamenu.

The same two entries were also added to the `navSections` data array (lines ~158–161) which drives the mobile/hamburger fallback nav under Core Capabilities.

### 67b. Homepage — MicrosoftEcosystemBanner CTAs

**File:** `client/src/pages/Homepage.tsx` — `MicrosoftEcosystemBanner()` function

Two CTA buttons were added immediately after the `EcosystemIntegrationDiagram` embed, before the closing `</section>`:

- Gold primary button: **"View All 55+ Connectors →"** → `setLocation('/universal-connector')`
- Ghost secondary button: **"Integration Setup Plan"** → `setLocation('/technical-onboarding')`

This gives visitors a direct path from the Microsoft ecosystem section to the detailed integration pages without requiring them to navigate the megamenu.

### 67c. Terminology Sweep — All Page Groups (TA–TK)

Full scan of all pages and components against all locked retirement rules:

| Rule | Result |
|---|---|
| AI-powered / AI-driven / AI-generated / AI-detected | ✅ Zero violations |
| Fortune 1000 in pages | ✅ Zero violations |
| GPT-4o in UI copy | ✅ Zero violations |
| human-AI partnership | ✅ Zero violations |
| Pilot Program / Pilot Access (user-facing) | ✅ Clean — further instances found and fixed in Rev 56 (FoundingPartnerHealthMonitor, FoundingPartnerMonitoring, FoundingPartnerDemo, CustomerJourney, Team, AdminCustomerHealth, JourneyNavigator) |
| Football category labels (Offense / Defense / Special Teams) | ✅ All occurrences are protocol names, industry sectors, legal terms, or the protected founder origin narrative |
| Retired 340× / 360× metric | ✅ `ThirtySecondSpot` `render360xSpot()` renders "3,600× Execution Head Start" correctly; `"360x-faster"` is an internal code key (exempt) |
| "72 hours" retirement | ✅ All remaining occurrences are factual regulatory contexts (GDPR Art. 33 72-hr window, ransomware deadlines) — not the retired speed benchmark |

### Rev 48 Known State
- Build: ✅ clean (dev server, 189/189 unit tests passing)
- `/universal-connector` and `/technical-onboarding`: ✅ surfaced in StandardNav + Homepage
- Terminology audit (TA–TK): ✅ zero violations across pages and components
- Key commit: `d5793bd0` (nav + homepage CTA wiring)

---

## 68. Competitive Positioning — Microsoft AI Execution Layer — May 24, 2026 (rev 49)

Three surgical inserts responding to Microsoft's move toward an enterprise AI execution control plane (GitHub Copilot CLI governance, policy gates, approval workflows). The framing across all three: **Microsoft governs "Can the AI tool run this task?" — Readiness OS governs "When the trigger fires — who does what, in 12 minutes?"** Different floors. No procurement conflict. Microsoft validates the category; the strategic response layer remains unclaimed.

### 68a. EcosystemDiagramPage — Two-Layer Architecture Clarity Section

**File:** `client/src/pages/EcosystemDiagramPage.tsx`

Inserted between the main `ExecutionOSMicrosoftDiagram` component and the three-point explanation section.

**Visual structure (top to bottom):**
- **Section header** — gold pill badge "Two layers. One enterprise." + headline "Microsoft governs the AI tools layer. *Readiness OS governs the response layer.*"
- **Layer stack diagram** (max-width 720px, centered):
  - **LAYER 2 — STRATEGIC RESPONSE** — navy bg, gold 2px border. Readiness OS name, description, "12 minutes" stat, five capability tags (Trigger Detection, Protocol Matching, Executive Authorization, 12-Min Execution, Institutional Memory)
  - Connector label: "Orchestrates ↕ Sits above"
  - **LAYER 1 — AI EXECUTION CONTROL (MICROSOFT)** — `#132558` bg, blue border (`rgba(0,120,212,0.35)`). GitHub Copilot CLI · Copilot Studio · Entra · Policy Engine, blue capability tags
  - Connector label: "Built on top of"
  - **LAYER 0 — MICROSOFT FULL STACK** — `#0F1C3F` bg. Azure OpenAI / Teams / SharePoint / Entra / Power Platform / Microsoft 365
- **Two-column distinction callout** (gold vs blue accent): "Microsoft's Layer Governs" / "Readiness OS Governs"
- Footer: *"Different layer. Different stakes. Same enterprise. No procurement conflict."*

### 68b. PlatformReality — Microsoft Complementary Card

**File:** `client/src/pages/PlatformReality.tsx`

Inserted between the three competitor-category cards and the "Readiness OS — Shipped It" navy bar.

**Visual treatment:** `#060B1E` background, `rgba(0,120,212,0.3)` border — visually distinct from the three ivory competitor cards. Two-column layout (text left, verdict right).

- **Label:** blue small-caps "Microsoft's AI Execution Layer — Complementary, Not Competitive"
- **Headline:** "Validates It. *Then leaves the strategic layer empty.*"
- **Body:** Explains the orthogonal-layer argument — Microsoft's $13B investment proves enterprises need execution governance infrastructure; the strategic response layer remains unclaimed.
- **Verdict box:** "Category Validated / Strategic layer still open" in blue
- **Subtitle copy updated:** "Three competitor categories — all leaving the 30-day mobilization cycle intact. One complementary category proving the market is real. One platform that closes the gap."

### 68c. InvestorLanding — Market Validation Section

**File:** `client/src/pages/InvestorLanding.tsx`

Inserted immediately after the "Why Now — Three Structural Shifts" section (`</section>` at line ~845) as a standalone full-width section.

**Route:** `/investor-landing` and `/executive-access`

**Visual structure:**
- `#060B1E` background, blue top border / gold bottom border
- **Blue pill badge:** "Market Signal · May 2026"
- **Headline:** "Microsoft is proving the category exists. *The strategic response layer remains unclaimed.*"
- **Two-column grid:**
  - Left (`#0F1C3F`, blue border): "What Microsoft Is Building" — four bullet rows (GitHub Copilot CLI governance, Approval gate workflows, Cost management & auditability, Enterprise AI control plane). Bottom callout: *"Governs: 'Can the AI tool run this task?'"*
  - Right (NAVY `#0A0F2E`, gold border): "What Remains Unclaimed — VaughnMartin's Layer" — four bullet rows (180 Readiness Protocols pre-staged, 231 trigger patterns monitored, Executive authorization gates, 12-minute coordinated response / 3,600× head start). Bottom callout: *"Governs: 'When the trigger fires — who does what, in 12 minutes?'"*
- **Three-stat bar:** $13B+ / 0 / 1 — Microsoft's investment proves the need · No vendors in the strategic layer · VaughnMartin first mover

### Rev 49 Known State
- Build: ✅ clean (dev server)
- Three competitive positioning inserts: ✅ live (`/ecosystem`, `/platform-reality`, `/investor-landing`)
- Microsoft framing: consistent two-layer orthogonal positioning across all three surfaces
- All locked messaging preserved: 3,600×, 12 minutes, 180 Readiness Protocols, "AI monitors, executives authorize"

---

## 69. Full-Site QA Sweep — Count Accuracy, API Limits, Nav Links — May 25, 2026 (rev 50)

Systematic QA audit across all public-facing pages and the server API layer. Three classes of issues found and resolved.

### 69a. Stale "170" Protocol Count — 7 UI Files

Seven pages were displaying `170` as the Readiness Protocol count — a value left over from before the library reached its current 180-protocol size. All corrected to `180`.

**Files updated:**
- `client/src/pages/ProductTour.tsx` — animated stat block
- `client/src/pages/NewUserJourney.tsx` — three-stat grid
- `client/src/pages/IndustryExperience.tsx` — scenario stat panel
- `client/src/pages/IntegrationHub.tsx` — integration stats row
- `client/src/pages/TryDemo.tsx` — two instances (stat tile + protocol card)
- `client/src/pages/WhyExecuteIQ.tsx` — three-column stat block
- `client/src/components/marketing/FounderStoryFull.tsx` — animated large-number display

**Rule for future development:** Never hardcode a protocol count without checking the current library size. The canonical number is **180 core** + **30 compound** = **210 total**. If the library grows, search for hardcoded instances of the count and update them all.

### 69b. Second API Truncation Bug — Slug-Lookup Endpoint

The `/api/playbooks/:id` route contains a non-UUID (slug/key) lookup path that loads all library records into memory to fuzzy-match by name. This path had `.limit(200)` with no `ORDER BY`, identical to the truncation bug fixed in the main `/api/playbooks/templates` endpoint (documented in §66a). With 210 total records and no ordering, protocols 201–210 (and an unpredictable subset of earlier ones) could be silently missed.

**File:** `server/routes.ts` — `/api/playbooks/:id` handler, slug-lookup branch

**Fix:** Added `.orderBy(playbookLibrary.playbookNumber).limit(300)` — same pattern as the main templates endpoint.

**Rule for future development:** Any `SELECT` against `playbook_library` that loads multiple records must either (a) filter by a specific ID/condition, or (b) use `.orderBy(playbookLibrary.playbookNumber).limit(300)`. Never use `.limit(200)` or lower on this table — the library has 210 records and may grow.

### 69c. Broken Navigation Links — `/command-center` Route

Three navigation entry points were routing to `/command-center`, a path that has no direct `<Route>` — App.tsx only defines it as a redirect to `/mission-control` (lines ~457, ~686). The mobile nav buttons were therefore making a round-trip through the redirect rather than navigating directly.

**Files updated:**
- `client/src/components/layout/StandardNav.tsx` — two instances: mobile icon button and mobile hamburger "Open Platform" button (authenticated users only). Both now navigate directly to `/mission-control`.
- `client/src/components/GlobalPhaseIndicator.tsx` — EXECUTE phase link. Now navigates to `/execute/war-room`, which is the operational hub for that phase.

**Note:** Internal page links (WorkspaceExecute, WorkspaceHub, Dashboard, etc.) that reference `/command-center` are unaffected — App.tsx redirects that path cleanly. Only nav entry points that are user-facing and should avoid the redirect were updated.

### 69d. QA Audit — Clean Results

Full sweep of all page and component files against the locked terminology and metric rules:

| Check | Result |
|---|---|
| AI-powered / AI-driven / AI-generated / AI-detected | ✅ Zero violations |
| Pilot Program / Pilot Access (user-facing) | ✅ Clean — further instances found and fixed in Rev 56 (see §72) |
| Football labels (Offense / Defense / Special Teams) | ✅ Zero violations outside the protected founder narrative |
| Retired metrics (340×, 360×) | ✅ Zero violations |
| "72 hours" as speed benchmark | ✅ All remaining occurrences are factual regulatory contexts (GDPR Art. 33, breach notification windows) — not the retired benchmark |
| "of 200" or similar count mismatch patterns | ✅ Zero found |
| API `.limit()` risks on `playbook_library` | ✅ Both queries now use `.orderBy(playbookNumber).limit(300)` |

### Rev 50 Known State
- Build: ✅ clean (dev server)
- Tests: ✅ 189/189 passing (10 test files)
- Protocol count "170" stale values: ✅ corrected in all 7 affected files
- API slug-lookup truncation: ✅ fixed — `.orderBy(playbookNumber).limit(300)`
- Nav broken links (`/command-center`): ✅ fixed in StandardNav (×2) and GlobalPhaseIndicator
- Full terminology audit: ✅ zero violations across all locked rule sets

## 70. Board Review System — June 2026 (rev 52)

A private advisory feedback tool that lets the founder simulate review sessions from each board member's perspective. No auth bypass required — activated via `localStorage` flags.

### Architecture

**Three files:**

| File | Route | Purpose |
|---|---|---|
| `client/src/components/BoardReviewPanel.tsx` | (global overlay) | Floating review panel injected via `App.tsx`; appears on every page when board mode is active |
| `client/src/pages/BoardReview.tsx` | `/board-review` | Identity selection portal — choose which board member you are reviewing as |
| `client/src/pages/BoardAdmin.tsx` | `/board-admin` | Founder-only dashboard — all feedback across all pages, filterable by member/type/status/priority |

### Board Members (`BOARD_MEMBERS` — exported from `BoardReviewPanel.tsx`)

```ts
{ id: 'gates',    name: 'Bill Gates',      initials: 'BG', color: '#0A2A4A', role: 'Technology & Global Scale' }
{ id: 'buffett',  name: 'Warren Buffett',  initials: 'WB', color: '#1B4332', role: 'Risk & Capital Allocation' }
{ id: 'blakely',  name: 'Sara Blakely',   initials: 'SB', color: '#7C2D44', role: 'Founder Experience & Go-to-Market' }
{ id: 'branson',  name: 'Richard Branson', initials: 'RB', color: '#3730A3', role: 'Brand & Enterprise Culture' }
{ id: 'obama',    name: 'Barack Obama',    initials: 'BO', color: '#1E3A5F', role: 'Stakeholder Coordination & Trust' }
{ id: 'williams', name: 'Serena Williams', initials: 'SW', color: '#065F46', role: 'Performance & Resilience' }
{ id: 'founder',  name: 'Founder',         initials: 'VM', color: '#0A0F2E', role: 'Platform Review (Private)' }
```

### localStorage Keys

```
vm_board_mode=true        — activates the review panel globally
vm_board_member=<id>      — which identity is active (gates / buffett / etc.)
```

Helper functions exported from `BoardReviewPanel.tsx`: `activateBoardMode(id)`, `deactivateBoardMode()`, `isBoardMode()`, `getBoardMember()`.

### Feedback Schema

Each feedback record stores: `boardMember` (id string), `pageUrl`, `pageName`, `actionType` (change/add/eliminate), `area` (design/layout/messaging/feature/navigation/content/data), `priority` (critical/important/nice_to_have), `feedback` (text), `status` (pending/in_review/planned/implemented/declined), `createdAt`.

API endpoints: `GET /api/board/feedback?pageUrl=...` · `POST /api/board/feedback` · `PATCH /api/board/feedback/:id` · `DELETE /api/board/feedback/:id`

### Panel Behavior

- **Collapsed state:** Fixed tab on right edge of viewport, showing member initials + "Review" label + note count badge (color = member's identity color)
- **Expanded state:** 380px right-side drawer with identity header, current page display, feedback form (action type → area → priority → text), and all existing notes for the current page
- **LogOut button:** Calls `deactivateBoardMode()` and hides the panel
- **Identity is page-persistent:** `useEffect` on `location` re-reads localStorage so the correct identity is always shown

### Notes for Future Developers

- Do NOT add authentication to `/board-review` or `/board-admin` — these routes are intentionally obscure (not in the public nav) rather than auth-gated. The founder navigates there directly.
- The `BOARD_MEMBERS` array is the single source of truth for member identities. If members change, update only this array — the panel, review page, and admin page all import from it.
- Never export plain functions alongside the default component export from `BoardReview.tsx` — Vite Fast Refresh will fail. Utility functions belong in `BoardReviewPanel.tsx` which is not a page component.

---

## 71. Homepage Conversion Overhaul — June 2026 (rev 52)

Applied all board-assessed conversion recommendations. Rules that must not be reverted:

### Hero CTA Hierarchy (LOCKED)

**Primary:** `"Try It Now — No Login Required →"` → `/situation-scanner` (gold filled button)
**Secondary:** `"Apply for Founding Partner Access →"` → `/founding-partner-program` (dim text link below the primary)

The Situation Scanner is the lowest-friction entry point on the platform — a prospect experiences the product in under 3 minutes with zero commitment. It must remain the dominant hero CTA. Do not promote "Request Founding Partner Access" back to primary position.

### HomepageNav Labels (LOCKED)

| Old label | New label | Route |
|---|---|---|
| Readiness Infrastructure | How It Works | `/how-it-executes` |
| Situation Scanner | Try It Now — No Login | `/situation-scanner` |

### StandardNav Mega-Menu (LOCKED)

In the Evidence section: "What is Readiness Infrastructure?" → **"How It Works"** → `/how-it-executes`

### GuestPreviewBanner Ticker (LOCKED)

The ticker bar (`GuestPreviewBanner.tsx`) displays live signal monitoring data only. **No gold CTA button in the ticker.** The previous "See It Execute in 12 Minutes →" button has been removed. A small ghost link "Try it — no login →" → `/situation-scanner` remains on the right side. Do not add a competing primary CTA back to the ticker.

### Social Proof Strip

`SocialProofStrip` component defined in `Homepage.tsx` and rendered **immediately after `<HeroSection />`** in the page render order (before `<StartHereSection />`). Shows 3 named practitioner quotes (Eriksson, Huang, Venkataraman) with name and title. All quotes sourced from public LinkedIn statements — confirmed by founder June 2026.

### Hero Widget Hint

Single italic line rendered below `<HeroSimPanel />`: *"This is live — click any scenario to see it execute in real time."* Do not remove — the board identified the passive widget as a missed engagement driver.

### Founding Partner Program Scarcity Counter

Scarcity badge text: `"2026 Founding Partner Cohort · [N] of 2 Spots Filled · [2-N] Remaining"`. **Update the filled count in `FoundingPartnerProgram.tsx` as partners sign.** Never display a filled number that is inaccurate — prospects will ask and catch it immediately. While no partners are signed, use `"2 Seats · Applications Now Open"`. **(Corrected from a stale "12 Seats" template — 2 is the actual cohort cap as of July 9, 2026 (§76); the 12-seat figure below in "Rev 52 Known State" is a historical snapshot only.)**

### Rev 52 Known State

- Build: ✅ clean (dev server)
- Tests: ✅ 208/208 passing (11 test files)
- Hero CTA: ✅ Situation Scanner primary
- Ticker CTA: ✅ removed (ghost link only)
- Nav labels: ✅ "How It Works" + "Try It Now — No Login"
- Social proof: ✅ surfaced above the fold immediately after hero
- Hero widget hint: ✅ live
- Founding Partner scarcity: ✅ accurate ("12 Seats · Applications Now Open")
- Founding Partner budget qualifier: ✅ "$50M+" line present
- Board identity system: ✅ all 6 advisors + founder, full admin dashboard

---

## 72. Pre-Launch Terminology Audit + ExecutiveBrief Corrections — June 10, 2026 (rev 56)

### 1. Canonical Trigger Count — Locked at 231

The trigger count is **231** — confirmed against the live DB after protocol enrichment (210 protocols, compound protocols validated). The `replit.md` Terminology Enforcement line previously said "221 triggers" — corrected to "231 triggers." Any future reference must use 231.

**Rule (do not override):** developer-reference.md already carried the correct 231 throughout (Signal Vocabulary table §1, Sequence 1 narrative, ProofStory section §60). Only `replit.md` needed correction.

### 2. Founding Partner Terminology — Wave 3 Sweep

Eight files contained user-facing "Pilot" language that survived earlier sweeps:

| File | Before | After |
|---|---|---|
| `FoundingPartnerHealthMonitor.tsx` | Page title, H1, description, empty-state copy (5 instances) | "Founding Partner Health Monitor" / "Founding Partner organizations" |
| `FoundingPartnerMonitoring.tsx` | "Pilot Company Status" card heading | "Founding Partner Status" |
| `FoundingPartnerMonitoring.tsx` | "Total Pilots" metric label | "Total Partners" |
| `FoundingPartnerDemo.tsx` | "Start Full Pilot" button | "Apply for Founding Partner Access" |
| `FoundingPartnerDemo.tsx` | "Pilot Execution Complete" toast | "Execution Complete" |
| `CustomerJourney.tsx` | "Pilot scope document" deliverable | "Founding Partner scope document" |
| `Team.tsx` | "Pilot activation through to enterprise renewal" | "Founding Partner activation through to enterprise renewal" |
| `AdminCustomerHealth.tsx` | "all pilot organizations" | "all Founding Partner organizations" |
| `JourneyNavigator.tsx` (component) | "define pilot scope" / "Pilot scope defined" | "define Founding Partner scope" / "Founding Partner scope defined" |

**Still acceptable — do not change:**
- `scope === 'pilot'` internal code variable in `ProtocolActivationConsole.tsx` — code key, not UI text
- `/api/pilot/execute`, `/api/pilot/apply` — API route strings
- `id: 'pilot'`, `path: '/pilot-demo'` — internal code identifiers
- "co-pilot", "Co-pilot" — Microsoft product references, not the Pilot Program
- "65% of Fortune 1000 companies are still piloting AI" — third-party analyst stat
- `{/* Pilot Program */}` comment in `ExecutiveBrief.tsx` — comment only, never rendered

### 3. ExecutiveBrief (`/executive-brief`) — Four Corrections

| Location | Before | After | Reason |
|---|---|---|---|
| H1 hero heading | "We Redesign How Work Flows in the Age of AI." | "The response is ready before the trigger fires." | Founder vision is the thesis (for Homepage/Investor/FounderStory); canonical tagline is the correct hero on the commercial brief |
| Proof numbers stat | `"231"` → `"221"` (incorrectly changed — reverted) | `"231"` | 231 is the validated DB count; 221 was the stale pre-enrichment number |
| ROI case basis text | `"Documented in ransomware + supply chain activations"` | `"Projected based on regulatory penalty frameworks (HHS, SEC, FTC) — not documented customer activations"` | Original implied external customer data that does not yet exist |
| Section label + intro | `"Validated Outcomes"` / `"These are not projected outcomes."` | `"Modeled Scenarios"` / `"These are illustrative scenarios modeled on platform architecture and industry mobilization benchmarks — not documented external customer activations."` | Same reason — honest framing for buyer-facing page |

**Note on "Fortune 1000 in meta" (board reviewer claim):** The reviewer flagged this but the code already read "startup to Fortune 500" — no change needed.

**Note on "We redesign how work flows in footer" (board reviewer claim):** The phrase was actually the H1 hero heading, not the footer. The footer was clean. The H1 was changed to the canonical tagline as described above. The founder thesis must still appear on Homepage, Investor pages, FounderStory, and Presentation slides per replit.md — it is NOT removed from the platform, only repositioned off the buyer brief H1.

### 4. Peer-Reviewed Phrases — Surfaced on Homepage + FounderStory

Two board-validated phrases now appear in context:

| Page | Location | Phrase |
|---|---|---|
| `Homepage.tsx` | AthletePreparationSection footer pull-quote (right column) | *"Preparedness as infrastructure, not consulting."* |
| `FounderStory.tsx` | Above closing CTA section, with "The Category Distinction" label | *"Preparedness as infrastructure, not consulting."* |

`ExecutiveBrief.tsx` and `InvestorPresentation.tsx` received both phrases in the previous session (Rev 55).

### 5. Documentation Rule — Established This Session

**Both `replit.md` and `developer-reference.md` must be updated whenever any platform change is made** — whether terminology, metrics, page structure, or messaging. This is the single source of truth contract. Never let a canonical number (like the trigger count) drift between docs and the codebase.

### Rev 56 Known State
- Build: ✅ clean (zero TypeScript errors, pre-existing eval warning only)
- Tests: ✅ 208/208 passing
- Trigger count: ✅ 231 locked in replit.md, developer-reference.md, and all pages
- Pilot terminology: ✅ zero user-facing violations across all pages and components
- ExecutiveBrief: ✅ canonical tagline as H1, honest proof qualification, correct trigger count
- Peer-reviewed phrases: ✅ surfaced on Homepage + FounderStory (and ExecutiveBrief + InvestorPresentation from Rev 55)

---

## 73. FirstVisitAdModal — Now Wraps CinematicHero — July 8, 2026 (rev 61)

### Purpose
A full-screen first-impression takeover that fires automatically for a visitor's first 3 visits to the Homepage. Uses `localStorage` key `vm_seen_brief` (an incrementing visit counter, not a boolean) — the modal stops firing once the counter reaches `MAX_VISITS = 3`.

### File
`client/src/components/FirstVisitAdModal.tsx` — imported and rendered at the top of `Homepage.tsx` return (before `<StandardNav />`).

### Content (changed rev 61)
The modal's outer shell (visit-counting, 3.5s reveal delay, fixed full-screen wrap, fade-in/out, `?cinematic=1` force-show query param) is unchanged. **The inner content is now `<CinematicHero onSkip={onClose} />`** — the same ~44-second animated brand-film sequence used on `/video`'s "90 Seconds" tab and in the Homepage `FilmSection`. The previous bespoke 4-scene "Recognition → Dismissal → Revelation → Fearlessness" text sequence (`SCENE_DURATIONS`, `fv-s1`–`fv-s4` scene markup) was removed in favor of reusing `CinematicHero` directly, so there is only one brand-film asset to maintain instead of two.

**Rationale:** the retired custom sequence ran ~30–50s of pure text/CSS animation before any product visualization; `CinematicHero` gets to a concrete product visual (the 12-minute execution chain) faster and is already the "Primary" video across the platform (see `/video` below), so reusing it here keeps the first impression consistent everywhere a prospect encounters the brand film.

- A persistent top-right "Skip ×" button (rendered by `FirstVisitAdModal`, not by `CinematicHero`) allows immediate dismissal at any point.
- `CinematicHero`'s own final-scene CTAs ("Full Platform Demo", "Continue to Site") also call `onClose` via the `onSkip` prop.
- `CinematicHero`'s internal "Skip" control (bottom-right) jumps to its own final scene rather than closing the modal — this is separate from the modal's dismiss button.

### NEVER DO
- Do not reintroduce a second, separately-maintained animated sequence for this modal — reuse `CinematicHero` so the brand-film content stays in one place.
- Do not use "AI-powered," "AI-driven," or any retired language if the shared `CinematicHero` copy is ever edited.
- Do not open with a crisis scenario (ransomware, activist investor, 3:17 AM) — `CinematicHero`'s copy is deliberately category-creation, not crisis-response framing.

### Rev 61 Known State
- Build: ✅ clean
- Tests: ✅ 218/218 passing
- Modal: ✅ firing on homepage for first 3 visits, now renders `CinematicHero` full-screen with a persistent Skip control
- `/video` default tab: ✅ changed from "Full Demo" to "90 Seconds" (see `/video` section below) — same underlying rationale, shorter video leads for cold-traffic engagement

---

## 74. June 20, 2026 — Rev 62 Change Log

### Readiness Architecture Studio — `/preparation-diagnostic` Rebuild

`PreparationDiagnostic.tsx` was rebuilt from a simple 3-question diagnostic into a full-featured **Readiness Architecture Studio**. The page table (Section 13) now documents this component fully. Key additions for any developer extending this page:

#### Mode selector (landing)
Three mode cards on the white landing below the navy hero: Full Setup (6-step), Build a Custom Protocol (4-step), Customize Existing Protocol (select from library). Mode cards use a `selectedMode` state and a "Begin →" CTA that transitions to the wizard.

#### Demo Quick-Start
Ivory section at the bottom of the landing. Five navy industry buttons. Each calls `handleDemoQuickStart(industry)` which:
1. Sets `demoPresets` from the `DEMO_PRESETS[industry]` constant (pre-wires org profile, risk selections, priorities)
2. Sets `isDemoMode = true`
3. Sets `currentStep = 3` (index 3 = step 4 of 6, "Protocols")
4. Sets `mode = "setup"` and transitions past the landing

A "Demo Mode · {industry}" teal badge renders in the wizard header next to the step title whenever `isDemoMode` is true.

#### Architecture View (default for step 4 / Protocols)
Three-column domain layout rendered when `protocolView === "architecture"`. Columns:
- **GROWTH & POSITIONING** — teal top border (`#2B8A6E`)
- **RISK & RESILIENCE** — red-navy top border (`#8B1A1A`)
- **TRANSFORMATION** — deep navy top border (`#1E3A5F`) — **NOT purple**

Coverage % score calculated as `(sum of weights for selected protocols) / (sum of all protocol weights) × 100`, capped at 95. Shown in a navy score bar above the columns.

#### Save / Resume
Draft state serialized to `localStorage` under key `vm_studio_draft` on every `currentStep` change. On landing page mount, if the key exists, a teal resume banner appears: "You have a saved architecture draft — Resume where you left off →". Banner has both a Resume and a Start Fresh button.

#### Stakeholder bridge
At activation (step 6), for each domain owner in the authorization config that has a non-empty email, the component calls `POST /api/stakeholder-contacts` to create a real org stakeholder record. Errors are silently swallowed (fire-and-forget) so a missing email does not block the activation flow.

### Production Readiness Verification — June 20, 2026
- Build: ✅ clean (zero TypeScript errors, pre-existing eval warning in `DocumentTemplateEngine.ts` only)
- Tests: ✅ 208/208 passing
- GitHub: ✅ pushed — all commits from Rev 56 through Rev 62 synced to `origin/main` (mbrunke18/CodePlatform1)
- Critical public pages verified via screenshot: `/`, `/preparation-diagnostic`, `/playbook-library`, `/12-minute-experience`, `/executive-brief`, `/investors`, `/how-it-executes`
- Zero browser console errors on any public page
- TRANSFORMATION domain color: ✅ `#1E3A5F` (deep navy) — no purple anywhere on the platform

---

## 75. June–July 2026 — Revs 63–67 Change Log

### New Pages Since Rev 62 (June 20, 2026)

All routes are registered in `client/src/App.tsx`. All pages use `PageLayout` and follow the standard brand system (NAVY/GOLD/TEAL, Cormorant Garamond + Barlow Condensed).

#### `/the-gap` — `TheGap.tsx`

**The 12 Mobilization Gaps** — the primary competitive positioning asset and definitive answer to "what does Readiness OS actually solve?"

**Purpose:** Names and quantifies the 12 specific coordination gaps that every organization hits between trigger detection and actual execution. Each gap has a "Today" narrative (the broken model) and a "Readiness OS" response. This is the canonical competitive moat visualization — used in sales, investor, and competitive positioning contexts.

**The 12 Gaps (exact names — do not paraphrase):**
| # | Name | Today's failure | Readiness OS answer |
|---|---|---|---|
| 01 | Detection | Someone notices something. Maybe. | 231 triggers monitored 24/7 across 39 live sources |
| 02 | Recognition | Classification debate consumes the first hours | 180 pre-staged protocols — situation named and matched at signal time |
| 03 | Authority | A meeting to decide who should decide | Decision rights pre-defined before the situation presents itself |
| 04 | Team Assembly | A meeting to plan who should be in the meeting | Named stakeholders, notification sequences, team composition pre-built |
| 05 | Budget Authorization | Emergency spend requires an emergency committee | Emergency budget pre-authorized per protocol; Protocol #0 for unknowns |
| 06 | External Resources | Outside counsel, PR firms called cold at emergency rates | Named retainers on standby, already briefed, already contracted |
| 07 | Sequencing | Three teams argue the order while the window closes | Execution sequence pre-defined; 22+ tasks deploy in correct order automatically |
| 08 | Systems Coordination | Manual handoffs, chasing access, disconnected platforms | 55+ connectors pre-integrated (Microsoft, Salesforce, ServiceNow, Slack, Jira) |
| 09 | Communication | Board/employee/customer/regulator messaging drafted from scratch under pressure | Communication protocols pre-staged; approved messaging frameworks ready before arrival |
| 10 | Compliance & Disclosure | Counsel asked about disclosure obligations during the crisis | Disclosure requirements mapped, compliance obligations defined, response timelines pre-built per situation type |
| 11 | Governance Record | Decisions made verbally, audit trail missing, board liability created | Close-out gate creates complete governance record automatically |
| 12 | Learning & Encoding | The debrief that never happens | ADVANCE loop — after 3 activations each protocol classified proven or disproven and updated |

**Competitor Coverage Matrix:** 9 competitor categories × 12 gaps, showing ✅/partial/✗ for each gap. Categories: Strategy Consultants (McKinsey/Bain/BCG), Crisis Communications (Edelman/Hill+Knowlton), IBP/Planning Frameworks (S&OP/IBP), Workflow & Orchestration (ServiceNow/Monday), AI Agent Platforms (Salesforce Agentforce/Copilot), GRC/Risk Platforms (Archer/OneTrust), BCP/Incident Response (Everbridge/Fusion), Tabletop Facilitators (Mandiant/CrowdStrike), Internal PMO/Transformation. Each row has a "verdict" line — do not alter these without founder approval.

**ROI Calculator:** Navy sidebar panel with input sliders for revenue, mobilization cost exposure, and recovery time. Outputs: Total Protected Value and Annual Mobilization Tax.

**CTA:** "Apply for Founding Partner Access" → `/founding-partner-program`

**File:** `client/src/pages/TheGap.tsx`

---

#### `/mobilization-gap` — `MobilizationGap.tsx`

Simplified standalone version of the 12-gap competitor matrix — same gap names and 9-competitor coverage matrix as `/the-gap` but without the interactive ROI calculator. Serves as a standalone reference or linked asset. The interactive full version (with sliders and cost quantification) lives at `/the-gap`.

**File:** `client/src/pages/MobilizationGap.tsx`

---

#### `/the-cost-of-waiting` — `TheCostOfWaiting.tsx`

**"The Cost of Waiting"** — scenario-based mobilization tax visualization.

**Purpose:** Proves that the 30-day mobilization cycle has a concrete dollar cost — not just a speed disadvantage — by walking through 5 scenarios side by side. "Without Readiness OS" shows accumulated costs at each delay point. "With Readiness OS" shows the same situation coordinated in 12 minutes.

**5 Scenarios:**
1. Ransomware Detection — Protocol #47, $504K mobilization cost
2. Activist Investor — Protocol #58
3. Supply Chain Collapse — Protocol #74
4. Regulatory Investigation — Protocol #91
5. Competitive Displacement — Protocol #31

Each scenario shows: timestamped timeline steps, accumulated dollar cost at each step, total mobilization cost, and a verdict line. The verdict line in every scenario distinguishes the fixed cost of the event itself from the preventable mobilization cost.

**Live counter:** Real-time cumulative cost accumulation shown at page load — the "personal" cost since page open + industry baseline running total. Reinforces the urgency of the mobilization tax.

**Key messaging rule:** "The breach cost is fixed. The mobilization cost — $504K — is entirely preventable." This is the canonical framing for every scenario. The event cost is not our claim; the mobilization cost is.

**CTA:** → `/founding-partner-program`

**File:** `client/src/pages/TheCostOfWaiting.tsx`

---

#### `/video` — `VideoLanding.tsx`

**Brand Films & Spots** — the platform's primary video hub, accessible from the main navigation ("See It Work → See the Full Demo").

**Three-tab layout (default tab changed to "90 Seconds" — rev 61, July 8, 2026):**
1. **Full Demo** (`value="full-demo"`) — serves `client/public/videos/readiness-os-demo.mp4` (58.8 MB, H.264 Constrained Baseline, faststart-encoded so moov atom is at offset 32). The `/videos` route in `server/index.ts` adds `Cache-Control: public, max-age=3600` and `Accept-Ranges: bytes` explicitly — this overrides Helmet defaults and is required for iOS Safari range-based video streaming. No longer the default tab — reachable by clicking the tab (no dedicated URL alias; `/full-demo` is a separate top-level redirect to `/full-experience`, unrelated to this tab).
2. **90 Seconds** (`value="90-second"`, badged "Primary") — renders the `<CinematicHero />` animated sequence in-page. **This is now the default tab** for `/video`, `/cinematic`, and `/brand-films` — a 4:45 video was too long as the first thing a cold-traffic visitor sees, so the shorter brand film leads and Full Demo is positioned as the deeper follow-up. `CinematicHero` is also reused as the content of `FirstVisitAdModal` (see Section 73) so there's one shared brand-film asset across the homepage first-visit takeover, the homepage `FilmSection`, and this tab.
3. **30 Seconds** (`value="30-second"`) — renders `<SpotSelector />` (defined inline in `VideoLanding.tsx`): three labeled version buttons at the top, one `<ThirtySecondSpot>` displayed full-width below. Switching versions resets and replays the selected spot via a `spotKey` counter.

**ThirtySecondSpot.tsx** (`client/src/components/marketing/ThirtySecondSpot.tsx`):
- Props: `version?: "offense-defense" | "first-mover" | "360x-faster"`
- Each version is a sequence of animated scenes driven by `setTimeout`; scene durations defined in `getScenes()`
- **Final scene of every version** renders `<BrandOutro>` — shows the `VaughnMartinLogo` (seal + wordmark), a gold rule, the spot tagline in gold Barlow Condensed, and an "Apply for Founding Partner Access" CTA. **Never use a raw letter "M"** as a brand monogram here — that was a prior bug.
- Scene-indicator dots and "Replay" / "Skip" controls at the bottom
- The `version="offense-defense"` final scene tagline: `"The Speed to Execute."` · `"first-mover"`: `"Readiness Infrastructure."` · `"360x-faster"`: `"3,600× Execution Head Start."`

**URL aliases:** `/video`, `/cinematic`, `/brand-films` (all open the 90-second tab, now the default), `/spots` / `/30-second` (opens 30-second tab) — handled by `getInitialTab()` reading `useLocation()`. There is no dedicated alias that opens the Full Demo tab directly; `/full-demo` is a top-level redirect to `/full-experience` and does not render this page.

**File:** `client/src/pages/VideoLanding.tsx`, `client/src/components/marketing/ThirtySecondSpot.tsx`

---

#### `/video-brief` — `VideoBrief.tsx`

**"The Cost of Waiting"** — video production storyboard and creative brief.

**Purpose:** Internal sales and production asset — an 8-scene storyboard for the platform's primary marketing video. Cold open with a ticking cost counter (no music, no logo), then scenes naming the problem, showing the contrast, and landing on fearlessness. Printable page.

**Not a public marketing page** — serves as a production brief. Do not link from nav or public-facing CTAs.

**8 Scenes:**
1. Cold Open — The Counter (0:00–0:08): Pure black, monospace red cost counter ticking from $0
2. The Question (0:08–0:15): Counter freezes. "This is what the last 8 seconds cost you."
3. (Scenes 3–8 continue the sequence through problem statement, product reveal, execution demonstration, fearless landing)

**Design mandate:** Mirror the FirstVisitAdModal emotional arc: Recognition → Dismissal of false solutions → Revelation → Fearlessness. Never open with crisis imagery.

**File:** `client/src/pages/VideoBrief.tsx`

---

#### `/situations-hub` — `SituationalHub.tsx`

**Situations Hub** — tabbed dashboard for organizational situation awareness.

**Tabs:** Overview · Exposure · Drills · Coordination

**Overview tab:** High-level readiness summary across domains. Domain cards show Exposure %, playbook count, last drill date, and risk level (high/medium/low). Default domains shown: M&A & Integration, Competitive Response, Regulatory Compliance, plus others.

**Exposure tab:** Domain-by-domain exposure scoring.

**Drills tab:** Drill history and scheduling.

**Coordination tab:** Stakeholder coordination readiness.

**File:** `client/src/pages/SituationalHub.tsx`
**Route:** `/situations-hub`

---

### Situations vs. Triggers — LOCKED MESSAGING RULE (July 2026)

This is a mandatory terminology distinction for all developers, agents, and copywriters. Violating it creates messaging confusion at the point of sale and contradicts the canonical tagline.

**Precise Architecture Definition:**

**"Situation"** = the strategic event itself — what organizations face, what Readiness Protocols are named for, what leaders experience. Examples: "Ransomware Attack," "Activist Investor," "Supply Chain Collapse." The protocol library covers **180 situations** across 9 domains. Always use "situation" in customer-facing copy.

**"Trigger"** = the customer-defined detection threshold. Customers configure specific data points to be continuously monitored; when those data points cross the defined threshold, the system fires an alert that a situation has arrived. The **231 trigger patterns** are 231 pre-built configurable detection thresholds. The customer owns the definition of when their trigger fires.

**The architecture flow:**
`Customer defines a trigger` → `system monitors continuously` → `threshold crossed` → `trigger fires` → `situation detected` → `Readiness Protocol activates` → `12-minute execution begins`

**Usage rules — LOCKED:**

| Copy | Status | Reason |
|---|---|---|
| "every situation your organization will face" | ✅ | Organizations face situations |
| "180 situations across 9 domains" | ✅ | Situations = protocol coverage |
| "231 trigger patterns monitored" | ✅ | Triggers = detection thresholds |
| "before the trigger fires" | ✅ | Tagline canonical use |
| "Same situation. Same 12 minutes." | ✅ | Slide 7 of pitch deck — confirmed |
| "choose your trigger" | ✗ RETIRED | They're choosing a situation |
| "Trigger Detected" (headline facing prospects) | ✗ RETIRED | What was detected is a situation |
| "every trigger your org will face" | ✗ RETIRED | Orgs face situations, not triggers |
| "Same trigger." | ✗ RETIRED | Replaced with "Same situation." June 2026 |

**The frequency reframe:** Most organizations face **15–20 situations annually** that demand a coordinated response — not just rare catastrophes. This frames Readiness OS as a subscription (compounding value across 15–20 activations/year), not insurance (one-time catastrophe hedge). Always include frequency when introducing scenarios to prospects.

**The canonical tagline with situations/triggers used correctly:**
> *"When the Situation Arrives —* **The Response Is Ready** **Before the Trigger Fires."**

Line 1 = "situation" (what the customer faces). Line 3 = "trigger fires" (the product's detection mechanism). "Before the trigger fires" means the response is staged before the customer's own detection threshold is even crossed — the ultimate readiness claim. This is structurally correct and must never be rewritten.

---

### Seed Round — $500,000 (July 2026)

**Seed Round Details (LOCKED):**
- Amount: $500,000
- Round type: Seed
- Close target: July 2026
- Where documented: Investor pages (`/investors`, `/investor-landing`, `/investor-presentation`), pitch deck

**Do not change the seed round amount or target date in any public-facing copy without explicit founder approval.**

---

### VC Pitch Deck — `client/public/vc-pitch-deck-seed-2026.html`

**File:** `client/public/vc-pitch-deck-seed-2026.html`
**URL:** `/vc-pitch-deck-seed-2026.html` (served as static file from `client/public/` — no auth, no React)
**Purpose:** Investor pitch deck for the $500K seed round. Standalone HTML — no framework dependencies. Used for Round Funded profile and direct investor sharing.

**Slide structure (18 slides, cover unnumbered, footers numbered 2–18):**
| Slide | Title | Key content |
|---|---|---|
| 1 (cover) | We redesign how work flows in the age of AI. | TechSeal SVG logo · headshot · SEED ROUND · $500,000 · July 2026 |
| 2 | The Problem | 30-day mobilization cycle vs. 12-minute response |
| 3 | The Solution | Readiness Infrastructure — 180 protocols pre-staged |
| 4 | Why Now | Microsoft AI stack without operating model; 3,600× head start |
| 5 | What It Includes | 5 platform capabilities |
| 6 | How It Works | Execution chain visualization |
| 7 | Same Situation | "Same situation. Same 12 minutes. Completely different outcome." |
| 8 | The 12 Mobilization Gaps | Competition coverage matrix |
| 9 | Market Size | TAM/SAM/SOM |
| 10 | Competitive Positioning | Category-of-one framing |
| 11 | Business Model | Core/Foresight/Enterprise tiers + Growth segment |
| 12 | Founding Partner Program | Three-column: What You Receive / 90-Day Arc / Terms. Stats bar: 3 spots · Q3 2026 · 90-day arc |
| 13 | Team | Martin Brunke — two-column: bio+quote left (58%), Stanford Cardinal coaching photo right (42%) |
| 14 | Financials | Revenue projections |
| 15 | The Ask | $500,000 seed round — use of funds breakdown |
| 16 | Platform Screenshots | Live screenshots from deployed platform |
| 17 | Sources & Methodology | All footnoted claims with sources |
| 18 (close) | The Response Is Ready Before the Trigger Fires. | TechSeal SVG logo · CTA email |

**Critical design specs:**
- Each slide: 1280×720px, scrolling HTML document (not a slideshow)
- TechSeal SVG rendered inline at cover (Slide 1) and close (Slide 18). **The cover instance uses SVG def IDs `vmgrad/vmgold/vmglow/vmta/vmba`. The close instance uses `vmgrad2/vmgold2/vmglow2/vmta2/vmba2`.** These must remain distinct — duplicate SVG `<defs>` IDs in the same document cause the second logo to render broken.
- Brand: NAVY `#0A0F2E`, GOLD `#C9A84C`, TEAL `#2B8A6E`. Zero purple. Zero retired language.
- Founding Partner language throughout — zero "pilot program" or "pilot access."
- Founder photos: `client/public/mb-headshot.jpg` (circular, 2px gold ring border — used at 44px cover, 96px Team slide), `client/public/mb-stanford.png` (Stanford Cardinal coaching staff — fills right 42% of Team slide with navy gradient caption overlay)

**Audit checklist before any deck edit:**
- [ ] Zero retired language: no "AI-powered," "AI-driven," "AI-detected," "speed advantage," "340×," "360×," "72 hours," "pilot program"
- [ ] "Same situation" (not "Same trigger") on Slide 7
- [ ] Founding Partner throughout (not "pilot")
- [ ] TechSeal SVG def IDs are unique per instance (vmgrad vs vmgrad2)
- [ ] Slide footers numbered 2–18 in sequence

---

### Production Verification — July 1, 2026 (Rev 67)

- Build: ✅ clean
- Pitch deck: ✅ 18 slides, clean numbering, zero retired language, "Same situation" confirmed on Slide 7
- Founding Partner language: ✅ zero "pilot program" references in deck or public pages
- Photos: ✅ `client/public/mb-headshot.jpg` (47KB) and `client/public/mb-stanford.png` (1.6MB) present
- Situations vs Triggers rule: ✅ locked in memory and this document
- Seed round: ✅ $500,000, July 2026
- New pages registered: ✅ `/the-gap`, `/the-cost-of-waiting`, `/video-brief`, `/mobilization-gap`, `/situations-hub`
- Competitor analysis: ✅ aangine.com confirmed NOT a direct competitor (algorithmic portfolio planning vs. readiness infrastructure — different problem, different buyer)

---

## 76. Founding Partner Program — Legal/Financial Risk Audit + Eligibility Broadening — July 9, 2026

Session-based audit of `/founding-partner-program` (`FoundingPartnerProgram.tsx`) triggered a series of corrections. **All items below reflect the currently live version of the page — this supersedes any conflicting seat count, guarantee, SLA, or budget-qualifier language in earlier sections of this document (e.g., §71/Rev 52 "Known State" snapshots are historical only).**

1. **Refund guarantee removed.** "The Readiness Guarantee" (unconditional refund language) was removed as unbounded legal/financial exposure. Replaced with **"The Measured Benchmark Commitment"** — a non-monetary commitment that the first live activation is timestamped and measured against the 12-minute target, with a board-ready benchmark delivered regardless of outcome. No refund promise remains on the page.
2. **Seat count corrected 12 → 2, site-wide.** The page previously showed a "12 Seats" scarcity badge inconsistent with the actual 2026 Cohort cap used elsewhere on the platform. Corrected to **"2026 Founding Partner Cohort · 2 Seats"** in `FoundingPartnerProgram.tsx`, and swept across `Pricing.tsx`, `TheCostOfWaiting.tsx`, `FoundingPartnerBrief.tsx`, `RequestAccess.tsx`, `PlatformHub.tsx`, `FoundingPartnerPage.tsx`, `TierComparisonDemo.tsx`, `OnboardingHub.tsx`, and the `TOTAL_SEATS` constant in `server/routes/magic-link-routes.ts`. §71's "12 Seats" references and the §4338 scarcity-counter template below are historical/stale — 2 is current.
3. **Enterprise SLA softened.** The specific "99.9% uptime, 2-hour priority support" claim in the Enterprise conversion terms was replaced with **"Uptime and response-time commitments defined at contract"** — avoids committing to unverified numeric SLA terms in public marketing copy.
4. **Eligibility broadened — $50M+ budget qualifier retired.** The page previously carried a hard **"organizations with operational budgets of $50M+"** pre-qualifier in the hero, which contradicted the platform's stated "startup to Fortune 500" positioning (used in this same page's meta description and differentiation strip) and blocked smaller prospects outright. Replaced with: **"Founding Partner engagements are open to organizations from high-growth startups to Fortune 500 enterprises — readiness, not revenue, is the qualifier."** The six "Required" candidate criteria (C-Suite Executive Sponsor, Named Technical Owner, Three Real Situations, Enterprise Tech Stack, Trigger Plausibility, Explicit Commitment) were reviewed and confirmed to gate on operational readiness, not company size or revenue — no changes needed there.
5. **Pricing and user allotment confirmed unchanged.** The $75K engagement investment and "up to 25 users" allotment apply uniformly to all Founding Partners regardless of company size — these were explicitly confirmed as correct as-is and were not tied to the retired budget qualifier.
6. **Application form fields are stale in prior doc sections above** (see §60 area — `firstName`/`lastName`/`email`/`company`/`title`/`triggerDomain`/`message`, not the older `companySize`/`primaryChallenge`/`timelineUrgency` fields) — corrected in place in the `FoundingPartnerProgram.tsx` page-structure section and the routes table entry.

**Verification:** typecheck clean, unit tests 218/218 passing, health-check 28/28 passing (direct script run — see §"health-check workflow quirk" in agent memory for why the workflow-level health-check can spuriously show failures unrelated to code).
