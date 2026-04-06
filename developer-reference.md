# VaughnMartin Execution OS — Developer Reference
*Last updated: April 6, 2026 (rev 16) | Single source of truth for engineers onboarding to or extending this codebase.*

---

## 1. What This Product Is

**Execution OS** by VaughnMartin is a Strategic Execution platform for Fortune 1000 companies. It automates project creation, task assignment, document staging, and budget allocation within 12 minutes of a strategic trigger firing.

- **170 active playbooks** across 9 domains
- **248+ data points** across 20 signal categories, monitored in 15-minute cycles
- **IDEA Framework™** — the four operating phases: IDENTIFY, DETECT, EXECUTE, ADVANCE
- **Enterprise B2B only** — primary CTA is "Request Pilot" → `/pilot-program`. No self-serve trial. No "Start Free Trial" button anywhere.
- **Executive authority preserved** — No playbook activates without executive authorization. AI monitors continuously, scores signals, and recommends the right playbook. The executive decision is the same decision — it just arrives in seconds rather than 30 days. **The phrase "human-AI partnership" is RETIRED from all UI/UX copy.** Replace it with "AI monitors, executives authorize" or "Executive authority preserved." The correct narrative: "AI monitors. Executives decide. Execution pre-staged." Any developer writing new copy must use this framing.
- **3,600× Execution Head Start — LOCKED FRAMING (OLD "340×" and "72 hours" ARE RETIRED):** The 30-day baseline is NOT execution time. It is the time most Fortune 1000 organizations spend just to MOBILIZE before any execution begins — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders. Execution OS compresses that entire mobilization cycle to 12 minutes. The correct math is 30 days × 24 hrs × 60 min = 43,200 minutes ÷ 12 minutes = 3,600×. The label is ALWAYS "3,600× Execution Head Start" — never "Speed Advantage," never "3,600× faster." The correct framing is always "30 days compressed to 12 minutes." Any developer or agent touching this metric must preserve this framing in full.
- **Microsoft Ecosystem positioning** — Execution OS is positioned as "The strategic command layer *above* Microsoft's agentic stack." It does NOT replace Azure AI, Teams, Copilot Studio, Entra, or Power Platform — it orchestrates them. This is a key GTM message: every Microsoft enterprise customer is an immediately addressable prospect with no rip-and-replace required. The full architecture diagram lives at `/ecosystem`.
- **Target users** — the full executive layer: CEOs, CFOs, COOs, CIOs, CMOs, Chief Strategy Officers, Division Presidents, Board of Directors, and all C-suite and executive leadership roles. Designed for every major industry — not sector-specific.
- **Industry scope** — cross-industry by design. Financial services, manufacturing, healthcare, energy, retail, technology, and beyond. Any Fortune 1000 enterprise facing strategic velocity challenges.
- **Growth Segment (`/growth`) — PERMANENT PRODUCT TRACK:** Targets SMBs and PE-backed startups. **Do NOT merge or confuse with the Enterprise Pilot.** Three tiers: Ready $75K/yr ($7,500/mo) · Responsive $150K/yr ($15K/mo) · Orchestrated $250K/yr ($25K/mo). Annual = market rate; monthly = 20% premium (flexibility surcharge — "2 months free" framing on annual). Tiers = deployment scope (domains, playbooks, signals) — same platform at every tier, NOT a discounted product. No per-seat pricing. All Growth CTAs route to `/contact`. Enterprise Pilot ($75K flat fee, Fortune 1000) stays on `/pilot-program` — completely separate audience, separate page, separate CTA.
- **Email Routing (canonical):** `sales@` → Contact/Growth inquiries | `info@` → Footer/Investor general | `pilot@` → Pilot program pages | `support@` → Onboarding/customer success | `investor@vaughnmartin.com` → Investor contacts.

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
| AI | OpenAI GPT-4o |
| Email | Resend (`RESEND_API_KEY`) — tries `pilot@vaughnmartin.com` first, falls back to `onboarding@resend.dev`; always logs admin URL to console |

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
- Never use: `purple-*`, `violet-*`, `cyan-*`, `indigo-*`, `emerald-*`, `blue-600+`
- Light neutrals `bg-gray-50`, `bg-slate-50` are acceptable
- OFFENSE playbooks = Teal. DEFENSE = Navy. SPECIAL_TEAMS = Gold.

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
│   ├── pages/                   ← 151 page components
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
│   ├── routes.ts                ← All API routes (~8,500 lines)
│   ├── storage.ts               ← IStorage interface + DrizzleStorage implementation
│   ├── replitAuth.ts            ← Replit OIDC + session setup
│   └── services/                ← AI, signal ingestion, dynamic strategy services
├── shared/
│   ├── schema.ts                ← Drizzle schema — single source of truth for all types
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

**Default role assignment (April 2026):** New users are automatically assigned the `Admin` role on first login via `upsertUser` in `server/storage.ts`. This prevents new pilot customers from hitting 403 errors when deploying playbooks. All existing users were backfilled with Admin in April 2026.

**Critical DB note:** The `roles` table schema includes a `description` column that was missing from the production database until April 3, 2026. If the DB is ever re-created from scratch, run `npm run db:push` immediately after — a missing `description` column causes `requireRole` to throw a 500 on every protected route. Do NOT assume the schema is in sync; always verify with `SELECT column_name FROM information_schema.columns WHERE table_name = 'roles'`.

### Frontend Auth Hook
```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, isLoading, login, logout } = useAuth();

// user shape:
// { id, email, firstName, lastName, profileImageUrl, role, initials, needsOnboarding }

// Navigate to login:
login('/dashboard');          // with returnTo
login();                      // to default landing

// Navigate to logout:
logout();
```

### Checking Auth in a Page
```tsx
const { user, isAuthenticated, isLoading } = useAuth();

if (isLoading) return <div>Loading...</div>;
if (!isAuthenticated) return <Navigate to="/api/login" />;
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
    apiRequest('POST', '/api/scenarios', data),
  onSuccess: () => {
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
GET    /api/playbook-library               ← 170 playbook taxonomy
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
<Route path="/playbook-activation/:triggerId/:playbookId" component={PlaybookActivationConsole} />
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

- **170 active playbooks** in 9 domains (seeded to DB on startup)
- **4 compound playbooks** (IDs 181–184): cross-domain crisis scenarios
- **23 enriched playbooks** with full `enrichedPhases` content (4 phases each, role-specific tasks, decision gates, restrictions). 14 original flagship set + 9 added April 2026 via migration script `server/scripts/fill-empty-playbooks.ts`: AI Competitive Disruption, Data Breach, CEO Sudden Departure, Financial Services Compliance Breach, SLA Mass Breach, Competitive Acquisition, AI Data Privacy Breach, Third-Party Data Breach, Compound Cyber+Regulatory.
- **Public access model:** 3 playbooks are fully visible without authentication: "Aggressive Pricing Disruption", "AI Competitive Disruption", "Compound: Geopolitical + Supply Chain Disruption". These show full card content with an upsell CTA ("View Sample" button → `/playbook-library/:id`). All 167 others render as locked cards showing only domain name + "Pilot Access Required" label + "Request Pilot Access" button → `/request-access`. Authenticated users see all 170 with "Deploy" button → `/playbook-customize/:id`. The public/locked logic lives in `PlaybookDetail.tsx` (`isSampleView` flag) and `PlaybookLibraryV2.tsx` (`isLocked` flag) — never change the free sample set without founder approval. The `SAMPLE_PLAYBOOK_NAMES` Set must be identical in both files.
- **Public-facing copy (locked):** Bottom CTA on sample playbooks reads: "You just read one of 3 public playbooks. 167 exclusive ones are already protecting your competitors." The 167 refers to locked pilot-only playbooks specifically — not 170 minus 1.

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

### DOMAIN_DB_MAP (in PlaybookLibraryV2.tsx)
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

### `PageLayout`
- Location: `client/src/components/layout/PageLayout.tsx`
- Props: `{ children, className?, showBackButton?, backButtonLabel?, embedded? }`
- Wraps every page with `StandardNav` + `Footer`.

### `StandardNav`
- Carries the logo on every page. Do NOT add a second logo inside page hero content.
- **Nav height: 130px** (`h-[130px]`). Logo: `<ExecuteIQLogo height={130} variant="full" color="navy" />`.
- **Four dropdown menus (left):**
  1. **The Platform** — operating model, core capabilities, platform tools, execute tools
  2. **Experience** — Try It Now (Live Demo `/try-demo`, 12-Min Test Drive `/test-drive`, Industry Scenarios `/industry-demos`) · Go Deeper (Shadow Simulator, By Role, Strategic Analyzer, Executive Brief `/executive-brief`)
  3. **Evidence** — Why Execution OS (featured, `/why-execution-os`), Executive Brief (featured, `/executive-brief`), Research, ROI Calc, Pricing
  4. **Investors** — Resources, Thesis, Deck, Briefings, Founder Story
- Unauthenticated CTAs (right): "Request Access" (outline, → /request-access), "Request a Pilot" (gold, → /pilot-program), "Sign In" (ghost)
- Authenticated CTAs: same plus "Open Platform" (teal, → /mission-control), user name dropdown (Settings, Organization Setup, Sign Out)
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
- CTA buttons (right): "Request Access" (outline, → /request-access) + "Request a Pilot" (gold, → /pilot-program)
- Mobile hamburger menu: same five links, rendered as `<Link>` components (not `<button>` with `onClick`)
- **CRITICAL:** "How It Works" MUST use `<Link href="/how-it-works">` — never `onClick={() => scrollTo("how-it-works")}` or `scrollIntoView`. The `#how-it-works` anchor exists on the homepage but the nav link goes to the standalone page.
- **CRITICAL:** Do NOT merge HomepageNav into StandardNav or PageLayout. They are intentionally separate components.

### `ExecutionGapDiagram`
- Location: `client/src/components/ExecutionGapDiagram.tsx`
- SVG comparison: left panel = "72 HOURS LATER — STILL FIGURING IT OUT" (navy/red); right panel = "EXECUTION IS LIVE" (navy/teal)
- viewBox: `0 0 1320 762`
- Bottom bar: proof-numbers strip — 170 playbooks · 221 executive triggers · 248+ data points · 12 min to live execution. **NOT a football analogy** — do not revert.
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
| `MissionControl.tsx` | `/mission-control` | Executive war room. Trigger activation → PlaybookActivationConsole. |
| `PlaybookLibraryV2.tsx` | `/playbook-library` | 170 playbooks with domain filter + free samples |
| `PlaybookActivationConsole.tsx` | `/playbook-activation/:triggerId/:playbookId` | Live execution flow. `triggerId='manual'` skips trigger fetch. |
| `TriggersManagement.tsx` | `/triggers-management` | Create/view/edit triggers. Opens `TriggerConfigurationWizard`. Category filter is a **dynamic Select dropdown** built from real trigger data (not hardcoded). Status filter uses inline toggle buttons (All Status / Triggered / Active / Paused). "Conditions & Data" button opens the detail sheet with intelligence signal data points. **Auth gating:** All interactive controls (Activate Playbook, Add Rule, Edit, on/off toggles) are hidden from unauthenticated users — non-auth users see a "Sign In to Activate" button. Trigger data is visible to all. `SOURCE_LABELS` map (top of file) converts raw source IDs to readable labels shown as teal tags. `[location, setLocation] = useLocation()` — must destructure both. |
| `SignalConfiguration.tsx` | `/signal-configuration` | **Signal Intelligence Configuration.** All 17 signal categories from `shared/intelligence-signals.ts`. Each category expands to show all data points with individual on/off toggles. Category-level enable/disable all. Shows recommended playbooks per category and linked trigger count. Persist state via `signal_monitoring_config` DB table (per org, stores `disabledDataPoints[]`). API: `GET/PATCH /api/signal-monitoring-config`. Framework chain banner shows: Data Points → Triggers Fire → Playbook Executes. Linked from StandardNav "Capabilities" section. |
| `SignalIntelligenceHub.tsx` | `/signal-intelligence` | Live signal monitoring. Requires auth+org. Shows branded fallback if not. |
| `FounderStory.tsx` | `/founder-story` | Manifesto-first page. "We Make Enterprises Fearless" by Marty Brunke (March 2026) — 7 Roman-numeral sections, pull quotes, inline IDEA Framework navy card. Bio strip + video cards (90s intro, 3:30 full) are supporting sections below. Closing CTA → `/pilot-program`. **Do not revert to video-first or bio-first layout.** |
| `BoardBriefings.tsx` | `/board-briefings` | Board reports + AI Board Deck Generator. **Investor-gated** (see InvestorGate). |
| `InvestorResources.tsx` | `/investor-resources` | Full investor materials page. **Investor-gated**. |
| `InvestorPresentation.tsx` | `/investor-presentation` | Slide deck presentation view. **Investor-gated**. |
| `InvestorLanding.tsx` | `/investor-landing`, `/executive-access` | Full investor pitch page. Hero primary CTA: "Schedule a Conversation" → `/pilot-program`. Secondary: "See 8-Minute Demo" + "Investor Resources". Closing CTA section: "Let's Build This Together" with same priority order + `investor@vaughnmartin.com` contact line. **Previously redirected to `/how-it-works` — now a live route.** Public (not gated). |
| `Settings.tsx` | `/settings` | Admin settings. All buttons are functional (March 2026). |
| `OnboardingWizard.tsx` | `/onboarding` | 5-step new user setup |
| `ExecutiveSummaryGenerator.tsx` | `/executive-summary` | AI-generated executive summaries |
| `PilotProgram.tsx` | `/pilot-program` | Primary enterprise conversion page |
| `DemoAccess.tsx` | `/demo-access` | Token-gated executive access entry point. Reads `?token=` param, validates via `/api/demo-access`, then redirects to `/mission-control` (or `?returnTo=` value). **LOCKED executive access link: `https://vaughnmartin.com/demo-access?token=VMdemo2026`** — do not change this URL or token. |
| `TryDemo.tsx` | `/try-demo` | Scripted demo for unauthenticated visitors |
| `GuidedStart.tsx` | `/begin`, `/start` | High-drama no-nav/no-auth guided demo. Three scenario cards with financial-stakes grids → animated DETECT phase → READY screen → auto-routes to `PlaybookActivationConsole`. |
| `HowItWorks.tsx` | `/how-it-works` | Public explainer page. Structure: hero → phase nav bar → **ExecutionProcessDiagram (first!)** → sections 01–05 (Onboarding, Playbooks, Customization, Live Loop, Ongoing Value) → Final CTA. Linked from StandardNav Product→Understand AND homepage sticky nav. **Do NOT move the diagram to the bottom.** |
| `EcosystemDiagramPage.tsx` | `/ecosystem` | Public standalone page: "The Strategic Command Layer Above Microsoft's Agentic Stack." Embeds `ExecutionOSMicrosoftDiagram.tsx` (3-layer SVG — Execution OS → Integration touchpoints → Microsoft Full Stack). 3-step explanation strip, 5 integration callouts (Azure AI, Teams, Copilot Studio, Entra, Power Platform), pilot CTA. **Do NOT embed the main dev-server URL** — diagram is self-contained SVG. Linked from: StandardNav Platform→Capabilities (featured/gold-highlighted), Footer Company section, Investors page GTM card, and Homepage `MicrosoftEcosystemBanner`. |
| `EcosystemsHub.tsx` | `/ecosystems` | All-7-ecosystem hub page. Linked from Homepage Microsoft section "View All 7 Enterprise Ecosystems →" button and StandardNav. Child ecosystem pages: `/ecosystem` (Microsoft), `/ecosystem/google`, `/ecosystem/salesforce`, `/ecosystem/aws`, `/ecosystem/sap`, `/ecosystem/servicenow`, `/ecosystem/workday`. |
| `WhyExecutionOS.tsx` | `/why-execution-os` | Competitive analysis page. Full breakdown: Copilot vs ServiceNow vs Palantir vs Everbridge vs GRC — positioned on a 2×2 grid (Speed vs Depth, Predict vs React). Closes with Microsoft positioning ("every enterprise already owns the engine — Execution OS is the transmission"). **Route conflict fix (March 2026):** A shadow route at this path previously served the old `WhyExecuteIQ` component — that shadow route was removed from App.tsx. The legacy page lives at `/why-execution-os-legacy`. Linked from: StandardNav Evidence dropdown (featured), HomepageNav. |
| `ExecutiveBrief.tsx` | `/executive-brief` | Shareable one-pager for board and C-suite prospects. Concise value prop, key metrics (3,600×, 12 min, 170 playbooks), IDEA Framework summary, and Microsoft positioning. Linked from: StandardNav Experience dropdown and Evidence dropdown. |
| `RequestAccess.tsx` | `/request-access` | Magic link intake form. Fields: name, email, company, title. On submit: (1) enrolls prospect in `stakeholder_contacts` for system + all existing orgs via `enrollProspectForAlerts()` — fires at form SUBMIT time, not link click; (2) saves token to `magic_link_tokens` DB table; (3) sends branded magic link email (`pilot@vaughnmartin.com` → fallback `onboarding@resend.dev`). Always returns `{ ok: true, emailSent: bool }` — never fails on the user side. Paired with `/api/auth/magic-link/verify?token=<token>` which: validates token (marks used, single-use only), creates user + session, fires `sendWelcomeTriggerDemo(email, firstName)` fire-and-forget (guaranteed "AI Competitive Disruption" trigger alert email, 94% confidence, bypasses RSS pipeline), then redirects to `/mission-control`. |
| `IndustryDemosHub.tsx` | `/industry-demos` | Hub page for all 4 industry scenario demos. Linked from: HomepageNav Experience, StandardNav Experience dropdown. |
| `FinancialRansomwareDemo.tsx` | `/industry-demo/financial-ransomware` | Financial services ransomware response scenario (600+ lines). Real-time incident timeline, 7 IDEA-phase tasks, CFO/CTO/CISO stakeholder map, $47M exposure model. |
| `PharmaceuticalRecallDemo.tsx` | `/industry-demo/pharmaceutical-recall` | Pharma recall scenario. FDA timeline, 170K-unit scope, cross-functional war room, regulatory communication tracks. |
| `ManufacturingSupplierDemo.tsx` | `/industry-demo/manufacturing-supplier` | Manufacturing supply disruption scenario. 14 downstream facilities, $2.3M/day exposure, alternate supplier routing. |
| `LuxuryCrisisDemo.tsx` | `/industry-demo/luxury-crisis` | Luxury brand reputational crisis scenario. Social velocity tracking, brand-protection playbook, executive comms choreography. |
| `PlaybookDetail.tsx` | `/playbook/:id` | Full playbook view. Three tabs: Overview, Performance (auth-gated), Edit Tasks (auth-gated, only shown when `enrichedPhases` exist). Edit Tasks tab: phase accordion editor for name/objective, role task groups (add/remove/rename/edit items), decision gate (title/criteria/escalation), and restrictions. Saves via `PATCH /api/playbook-library/:id/customize` with `{ customizations: { enrichedPhases } }`. Amber dot on tab label = unsaved changes. `useEffect` syncs `editedPhases` from `playbook.enrichedPhases` on load. Helper callbacks: `updatePhase`, `updateTask`, `updateTaskItem`, `addTaskItem`, `removeTaskItem`, `addTaskGroup`, `removeTaskGroup`, `updateCriteria`, `addCriteria`, `removeCriteria`, `updateRestriction`, `addRestriction`, `removeRestriction`. |

---

## 15. Mission Control Activation Flow

When a pilot customer clicks "Activate Response" on a pending trigger in Mission Control:

1. Local state animation runs (`setPendingTriggers` → `setActiveExecutions`) — visual only, fast
2. `useQuery` on `/api/scenarios` finds the best-matching real playbook by name (case-insensitive keyword match against `trigger.suggestedPlaybook`)
3. After 600ms delay: `setLocation('/playbook-activation/manual/' + matchedPlaybookId)`
4. `PlaybookActivationConsole` receives `triggerId='manual'` (skips trigger lookup) and `playbookId` from the real DB

If no playbook matches by name, uses `realPlaybooks[0]?.id`. If DB is empty, falls back to `/triggers-management`.

### PlaybookActivationConsole — Key Architecture

**Brand constants at module level.** `NAVY`, `GOLD`, `TEAL`, `MUTED`, `OFF`, `BORDER`, `CG` etc. are declared at the top of the file (outside the component function) so all helper sub-components defined in the same file can reference them without prop-drilling.

**BriefLoadingState component.** A standalone component defined *before* the `PlaybookActivationConsole` function in the same file. While GPT-4o generates the execution brief, it shows a 5-step animated checklist ticking through: Domain Analysis → Signal Synthesis → Stakeholder Mapping → Risk Assessment → Commander Brief. Uses `@keyframes scanBeam` and `@keyframes fadeInUp` defined in `index.css`.

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
- When the primary status query errors, the page renders a branded fallback panel (navy/gold card with "Sign In" + "Request Pilot Access" buttons) instead of a blank or broken page
- Authenticated pilot customers see full live data

---

## 17. Settings Page — Admin Buttons

All buttons in `Settings.tsx` have `onClick` handlers as of March 2026:

| Button | data-testid | Action |
|---|---|---|
| Run Health Check | `button-system-health-check` | Simulates diagnostic, shows result toast after 2.5s |
| Restart Services | `button-restart-services` | Toast confirmation |
| View System Logs | `button-view-logs` | Navigate to `/audit-logging` |
| Add Enterprise User | `button-add-user` | Opens inline invite form (email input + send) |
| Bulk Import | `button-bulk-import` | Toast with implementation team contact |
| System Backup | `button-backup-system` | Toast confirmation |
| Optimize Performance | `button-performance-optimization` | Toast with status |
| Security Scan | `button-security-scan` | Navigate to `/audit-logging` |
| Generate Reports | `button-generate-reports` | Navigate to `/executive-summary` |
| Slack / Jira / Tableau | (integration buttons) | Navigate to `/integrations` |

---

## 18. Try Demo — Experience Design

**File:** `client/src/pages/TryDemo.tsx` | **Route:** `/try-demo` | **Auth:** None required

The demo is the primary conversion tool for unauthenticated visitors, pilot prospects, and investors. It must work without a login and demonstrate the full IDEA framework value in ~90 seconds.

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

## 19. GuidedStart Experience (`/begin`)

**File:** `client/src/pages/GuidedStart.tsx` | **Routes:** `/begin`, `/start` | **Auth:** None required

The highest-drama public entry point. No `PageLayout`, no nav, no header — full-screen immersive flow.

### Flow Phases

| Phase | What Happens |
|---|---|
| **SCENARIOS** | 3 cards with financial stakes grid ($2.1B deal, $340M revenue at risk, etc.), domain badge, urgency window, stakes label |
| **DETECT** | Animated signal counter counts 0→248. Two-column layout: left = step-by-step confirmation checklist; right = domain signal categories panel. Threat level gauge at step 3. |
| **READY** | Side-by-side "What's at Stake" vs "What Happens Next" panels. Scenario-specific financial figures and stakeholder count. |
| **→ Console** | Auto-fetches domain-matched playbook from `/api/playbook-library` (not `/api/playbooks`). Navigates to `PlaybookActivationConsole`. |

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
- **Homepage hero** — primary CTA button: "Experience 12-Minute Execution"

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
- If playbook count < 170, only inserts missing compound playbooks by name lookup
- No destructive wipe — safe to run repeatedly
- `playbookLibrarySeed.ts` and `playbookLibrarySeed_PARTIAL.ts` in `server/seeds/` are NOT the active source of truth — the DB was seeded once from a complete run and is maintained additively

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

*This file documents the state of the codebase as of April 2026 (rev 12). Update this file whenever you add new pages, change key patterns, wire new components, or alter the design system.*

---

## 24. Playbook ID Strategy — Stable vs. Environment-Specific UUIDs

**Problem solved (March 2026):** The production and development databases seed playbooks with different UUIDs because `gen_random_uuid()` runs at insert time. Any code that hardcodes a UUID will fail in one environment.

**Solution — use playbook numbers:**
- Playbook numbers (`playbookNumber` column) are deterministic and identical across all environments.
- The API supports both lookup strategies:
  - By UUID: `GET /api/playbook-library/:uuid` → returns `{ playbook: {...} }`
  - By number: `GET /api/playbook-library/by-number/:number` → returns flat `{ id, name, ... }`

**PlaybookDetail.tsx** handles both URL forms automatically:
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

### 1. AI Execution Brief — `PlaybookActivationConsole.tsx`

**What it does:** Before a pilot customer confirms activation, a GPT-4o-generated "commander brief" is displayed as a navy card. It reframes the playbook in military-command style with 6 structured fields.

**API endpoint:** `GET /api/playbooks/:id/execution-brief?triggerId=<uuid>`
- Route must be placed **before** `GET /api/playbooks/:id` in `routes.ts` to avoid the catch-all absorbing it
- Returns: `{ situationFraming, missionObjective, criticalRoles, topRisks, successIndicators, commanderNote }`
- Auth-gated: returns 401 if unauthenticated
- Falls back to a static template if OpenAI is unavailable (never shows an error state)

**OpenAI quota warning:** The platform uses a Replit-managed AI integration (`AI_INTEGRATIONS_OPENAI_API_KEY`). This key has a usage budget that resets periodically. When exhausted, AI brief generation and compound threat analysis fall back gracefully — no visible error, but AI content is replaced with static templates. The background compound threat auto-analysis (every 4 hours) consumes this budget silently. Before any sales demo where AI briefs will be shown live, verify the budget is not exhausted. Check Replit account billing settings to top up if needed.

**Frontend query key:** `['/api/playbooks', playbookId, 'execution-brief', triggerId]`

**Display:** Navy card with shield icon header, rendered above `<PreActivationImpactPreview>`. Loader while fetching. If `briefData` is null (OpenAI unavailable), shows a static fallback with the playbook name.

### 2. Post-Activation Debrief Screen — `PlaybookActivationConsole.tsx`

**What it does:** Replaces the old plain success message when `executionStatus === 'completed'`. Automatically surfaces a full debrief — no navigation required.

**Sections rendered:**
- **Hero banner:** Trophy icon, "Playbook Executed Successfully", speed multiplier (e.g. 360x vs. 72-hr standard), ROI dollar value pill (time saved × $40/min Fortune 1000 rate, formatted as $XK or $X.XM)
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

**ROI formula:** `timeSaved (minutes) × $40/min` → formatted as $XK or $X.XM. `timeSaved = industryStandard (30×24×60 = 43,200 minutes, the 30-day mobilization baseline) - elapsedMinutes`. Never use 72-hour baseline — that framing is retired.

**Pattern:** Uses an IIFE `{executionStatus === 'completed' && (() => { ... })()}` to scope local constants without adding state.

### 3. Auto-Task Seeding — `PlaybookActivationConsole.tsx`

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

### 3. Source Governance Indicator — `PlaybookDetail.tsx`

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
| `/marketing-landing` | `MarketingLanding.tsx` | **Redirects → `/`.** 349-line page that duplicated the Homepage. No unique content. Keeping the route would split SEO and confuse pilot customers. Redirect preserves any inbound links without exposing a duplicate. |
| `/one-click-demo` | `OneClickDemo.tsx` | **Redirects → `/try-demo`.** 511-line demo flow that duplicated TryDemo. The 7-phase TryDemo (`/try-demo`) is the canonical public demo experience. OneClickDemo had no differentiating content. Redirect preserves any inbound links. |

### Implementation Notes
- Both redirects use Wouter's `<Redirect>` component, not `useLocation`. No lazy import remains for either component.
- All five wired pages remain lazy-loaded in `App.tsx` and appear in the Footer under their relevant columns.
- `LiveActivationCenter` is a candidate for a future "Monitor Live" deep-link from `PlaybookActivationConsole.tsx` — this would be the natural user journey once a playbook is activated.

---

## 28. Route Architecture — Server-Side Decomposition (March 2026)

`server/routes.ts` was decomposed from a 9,341-line monolith to approximately 6,800 lines by extracting domain-scoped sections into dedicated route module files.

### Route Module Map

| File | Routes Covered | Auth Pattern |
|---|---|---|
| `server/routes/helpers.ts` | Shared auth middleware | — |
| `server/routes/activation-routes.ts` | `/api/activations/*`, `/api/playbooks/:id/execute` | `requireAuth` |
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

### RSS Feed Sources (8 feeds, polled every 15 minutes)
```
NY Times Business     → rss.nytimes.com/services/xml/rss/nyt/Business.xml
BBC Business          → feeds.bbci.co.uk/news/business/rss.xml
SEC EDGAR 8-K         → sec.gov/cgi-bin/browse-edgar?type=8-K&output=atom
CNBC Business         → search.cnbc.com/rs/search/...
MarketWatch           → feeds.marketwatch.com/marketwatch/topstories/
NPR Business          → feeds.npr.org/1006/rss.xml
Google News Finance   → news.google.com/rss/topics/...
Entrepreneur          → feeds.feedburner.com/entrepreneur/latest
```

Signal description passed to the evaluator:
```ts
`${item.title}${item.description ? ` — ${item.description.substring(0, 200)}` : ''}`
```

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

## 32. Messaging Guidelines — Locked Copy Rules (April 2026)

The following copy conventions are founder-locked. Any agent or developer who touches marketing pages, investor slides, or product UI must follow these rules without deviation.

### Retired phrases (never use)
| Retired | Replace with |
|---|---|
| "Human-AI partnership" | "AI monitors, executives authorize" |
| "Human-AI collaboration" | "Executive authority preserved" |
| "AI augments executives" | "AI eliminates the mobilization cycle" |
| "Speed advantage" | "3,600× Execution Head Start" |
| "72 hours" (as baseline) | "30 days" |
| "340×" | "3,600×" |
| "20–50 hours getting organized" | "30 days to mobilize" |
| "16 signal categories" | "9 strategic domains, 221 triggers" |
| "Strategic Execution Platform" (repeated) | Use once at introduction only |

### Approved narrative patterns
- "While others mobilize, you're already executing."
- "By the time the first alignment call would have been scheduled, you're already executing."
- "AI monitors. Executives decide. Execution pre-staged."
- "No playbook activates without executive approval."
- "The bottleneck is never the technology. It's the mobilization cycle."
- "30 days compressed to 12 minutes."
- "3,600× Execution Head Start — not a speed advantage. A structural advantage."

### Pages where the thesis must be present
Homepage · Investor pages · Founder Story · Investor Presentation · ExecutiveBrief · WhyExecutionOS · MarketingLanding

### IDEA card copy (Homepage.tsx) — do not paraphrase
The four IDEA cards tell the product's emotional story. Their current copy is canonical:
- **IDENTIFY:** "Nothing is improvised. Everything is pre-staged."
- **DETECT:** "While others are still in their first email thread, the system has already matched the trigger to the playbook — before your leadership team finishes their first email."
- **EXECUTE:** "By the time the first alignment call would have been scheduled, you're already executing."
- **ADVANCE:** "Each execution makes the next response faster, sharper, and more decisive."

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
- `PlaybookActivationConsole.tsx` — `compact` (above execution container)
- `ExecutionCoordination.tsx` — `compact` (above container)
- `ExecutionHistory.tsx` — `compact` (between dark header and KPI cards)
- `PlaybookDetail.tsx` — `compact` (above playbook content)
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
| 14 | `CTASection` | Final "Request Pilot" CTA |
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

