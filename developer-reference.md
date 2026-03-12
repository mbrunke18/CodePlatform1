# VaughnMartin Execution OS — Developer Reference
*Last updated: March 2026 (rev 5) | Single source of truth for engineers onboarding to or extending this codebase.*

---

## 1. What This Product Is

**Execution OS** by VaughnMartin is a Strategic Execution platform for Fortune 1000 companies. It automates project creation, task assignment, document staging, and budget allocation within 12 minutes of a strategic trigger firing.

- **170 active playbooks** across 9 domains
- **248+ data points** across 20 signal categories, monitored in 15-minute cycles
- **IDEA Framework™** — the four operating phases: IDENTIFY, DETECT, EXECUTE, ADVANCE
- **Enterprise B2B only** — primary CTA is "Request Pilot" → `/pilot-program`. No self-serve trial. No "Start Free Trial" button anywhere.
- **Human-AI partnership model** — AI monitors and recommends, human executives approve and decide.
- **Target users** — the full executive layer: CEOs, CFOs, COOs, CIOs, CMOs, Chief Strategy Officers, Division Presidents, Board of Directors, and all C-suite and executive leadership roles. Designed for every major industry — not sector-specific.
- **Industry scope** — cross-industry by design. Financial services, manufacturing, healthcare, energy, retail, technology, and beyond. Any Fortune 1000 enterprise facing strategic velocity challenges.

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
| Email | Resend (`RESEND_API_KEY`) from `noreply@vaughnmartin.com` |

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
├── replit.md                    ← Project memory / architecture notes
└── developer-reference.md       ← This file
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
`requireRole('admin', 'executive', 'strategist')` is applied to all write routes. Users with no role get read-only access.

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
- **3 free sample playbooks** (visible to unauthenticated users): "Aggressive Pricing Disruption", "Compound: Geopolitical + Supply Chain Disruption", "AI Competitive Disruption"

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
- Unauthenticated CTAs: "Try Demo" (outline, → /try-demo), "Request Pilot" (gold, → /pilot-program), "Sign In" (ghost)
- Authenticated CTAs: "Try Demo" + "Request Pilot" always visible (same as unauthenticated — execs share these with prospects), "Open Platform" (teal, → /mission-control), user name as a **dropdown** with: Settings (→ /settings), Organization Setup (→ /organization-setup), Sign Out
- **Rule:** No user should ever need to type a URL — every page must be reachable through the UI (nav or footer)
- Footer includes Settings and Sitemap links in the Company column for full coverage

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
| `Settings.tsx` | `/settings` | Admin settings. All buttons are functional (March 2026). |
| `OnboardingWizard.tsx` | `/onboarding` | 5-step new user setup |
| `ExecutiveSummaryGenerator.tsx` | `/executive-summary` | AI-generated executive summaries |
| `PilotProgram.tsx` | `/pilot-program` | Primary enterprise conversion page |
| `TryDemo.tsx` | `/try-demo` | Scripted demo for unauthenticated visitors |

---

## 15. Mission Control Activation Flow

When a pilot customer clicks "Activate Response" on a pending trigger in Mission Control:

1. Local state animation runs (`setPendingTriggers` → `setActiveExecutions`) — visual only, fast
2. `useQuery` on `/api/scenarios` finds the best-matching real playbook by name (case-insensitive keyword match against `trigger.suggestedPlaybook`)
3. After 600ms delay: `setLocation('/playbook-activation/manual/' + matchedPlaybookId)`
4. `PlaybookActivationConsole` receives `triggerId='manual'` (skips trigger lookup) and `playbookId` from the real DB

If no playbook matches by name, uses `realPlaybooks[0]?.id`. If DB is empty, falls back to `/triggers-management`.

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

## 19. Build & Deployment

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

## 20. Critical Rules for Any Developer

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

---

## 21. Playbook Seeding (Production)

Seeding logic is in `server/index.ts` as an additive migration:
- If playbook count < 170, only inserts missing compound playbooks by name lookup
- No destructive wipe — safe to run repeatedly
- `playbookLibrarySeed.ts` and `playbookLibrarySeed_PARTIAL.ts` in `server/seeds/` are NOT the active source of truth — the DB was seeded once from a complete run and is maintained additively

---

## 22. Environment Variables

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

*This file documents the state of the codebase as of March 2026. Update this file whenever you add new pages, change key patterns, wire new components, or alter the design system.*

---

## 23. Playbook ID Strategy — Stable vs. Environment-Specific UUIDs

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

## 24. WOW Features — 5 Strategic Differentiators (Added March 2026)

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

## 25. AI-Backed Activation Features (Added March 2026)

Three new features wired into the playbook execution flow, backed by GPT-4o.

### 1. AI Execution Brief — `PlaybookActivationConsole.tsx`

**What it does:** Before a pilot customer confirms activation, a GPT-4o-generated "commander brief" is displayed as a navy card. It reframes the playbook in military-command style with 6 structured fields.

**API endpoint:** `GET /api/playbooks/:id/execution-brief?triggerId=<uuid>`
- Route must be placed **before** `GET /api/playbooks/:id` in `routes.ts` to avoid the catch-all absorbing it
- Returns: `{ situationFraming, missionObjective, criticalRoles, topRisks, successIndicators, commanderNote }`
- Auth-gated: returns 401 if unauthenticated
- Falls back to a static template if OpenAI is unavailable (never shows an error state)

**Frontend query key:** `['/api/playbooks', playbookId, 'execution-brief', triggerId]`

**Display:** Navy card with shield icon header, rendered above `<PreActivationImpactPreview>`. Loader while fetching. If `briefData` is null (OpenAI unavailable), shows a static fallback with the playbook name.

### 2. Graduated Attention — Completed Task Collapse — `WorkspaceExecute.tsx`

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

## 26. Orphaned Pages — Decision Log (March 2026)

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

## 27. Route Architecture — Server-Side Decomposition (March 2026)

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

## 28. Sentry Error Monitoring (March 2026)

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

