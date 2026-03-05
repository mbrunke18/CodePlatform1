# VaughnMartin Execution OS — Developer Reference
*Last updated: March 2026 | Single source of truth for engineers onboarding to or extending this codebase.*

---

## 1. What This Product Is

**Execution OS** by VaughnMartin is a Strategic Execution platform for Fortune 1000 companies. It automates project creation, task assignment, document staging, and budget allocation within 12 minutes of a strategic trigger firing.

- **170 active playbooks** across 9 domains
- **216+ data points** across 16 signal categories, monitored in 15-minute cycles
- **IDEA Framework™** — the four operating phases: IDENTIFY, DETECT, EXECUTE, ADVANCE
- **Enterprise B2B only** — primary CTA is "Request Pilot" → `/pilot-program`. No self-serve trial. No "Start Free Trial" button anywhere.
- **Human-AI partnership model** — AI monitors and recommends, human executives approve and decide.

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
| Email | Resend (`RESEND_API_KEY`) from `noreply@executeiq.io` |

---

## 3. Design System — The Only Colors Allowed

```
NAVY    = "#0A0F2E"   → hero sections, headings, primary buttons, dark backgrounds
NAVY_MID= "#141B45"   → hover states, secondary dark surfaces
GOLD    = "#C9A84C"   → accents, labels, metric numbers, CTA highlights (NEVER as background)
GOLD_LT = "#DFC178"   → gold on dark backgrounds, hover gold
TEAL    = "#2B8A6E"   → success, offense playbooks, progress bars, teal CTAs
TEAL_LT = "#3BAF8A"   → teal on dark backgrounds
OFF     = "#F8F7F4"   → off-white page backgrounds, light card surfaces
BORDER  = "#E8E4DC"   → card borders, dividers, input borders
MUTED   = "#6B7280"   → helper text, secondary labels, timestamps
```

**Rules:**
- Red — crisis/alert severity ONLY (preserved as-is)
- Yellow/Orange — warnings ONLY
- Never use: `purple-*`, `violet-*`, `cyan-*`, `indigo-*`, `emerald-*`, `blue-600+`
- Light neutrals `bg-gray-50`, `bg-slate-50` are acceptable
- OFFENSE playbooks = Teal. DEFENSE = Navy. SPECIAL_TEAMS = Gold.

**Color variable trap:** `Homepage.tsx` uses the local name `TEXT_MUTED` (not `MUTED`). Every other file uses `MUTED`. Always check the constants block at the top of each file before referencing color variables.

---

## 4. Project Structure

```
/
├── client/src/
│   ├── App.tsx                  ← All client-side routes (lazy-loaded)
│   ├── main.tsx                 ← React entry point
│   ├── pages/                   ← 146 page components
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
│   └── intelligence-signals.ts  ← 216 signal data points across 16 categories
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

---

## 7. API Patterns

### Making a GET Request (frontend)
```tsx
import { useQuery } from '@tanstack/react-query';

// Simple — default queryFn handles fetch + auth
const { data: playbooks = [], isLoading } = useQuery<StrategicScenario[]>({
  queryKey: ['/api/scenarios'],
});

// With params (hierarchical key — invalidation works properly)
const { data: tasks } = useQuery<Task[]>({
  queryKey: ['/api/tasks', scenarioId],
  queryKey: [`/api/tasks?scenarioId=${scenarioId}`],   // also valid
  enabled: !!scenarioId,
});

// Handling unauthenticated endpoints gracefully
const { data, error } = useQuery<StatusData | null>({
  queryKey: ['/api/dynamic-strategy/status'],
  retry: false,
  placeholderData: null,
});
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
  onError: (error) => {
    toast({ title: 'Error', description: error.message, variant: 'destructive' });
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
GET    /api/practice-drills                ← Fire drill simulation
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
| `TriggersManagement.tsx` | `/triggers-management` | Create/view/edit triggers. Opens `TriggerConfigurationWizard`. Category filter is a **dynamic Select dropdown** built from real trigger data (not hardcoded). Status filter uses inline toggle buttons (All Status / Triggered / Active / Paused). "Conditions & Data" button opens the detail sheet with intelligence signal data points. |
| `SignalIntelligenceHub.tsx` | `/signal-intelligence` | Live signal monitoring. Requires auth+org. Shows branded fallback if not. |
| `BoardBriefings.tsx` | `/board-briefings` | Board reports + AI Board Deck Generator |
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
- Gold-tinted `DEMO MODE` bar below header: *"Timeline compressed for demonstration. In production, signal monitoring runs continuously every 15 minutes across all 216+ sources."*
- Confidence meter animates from 0% → signal strengths → 96%
- Green glow "Trigger Threshold Crossed" reveal when `detectStep >= 3`

### Phase-Specific Sidebar Narration
Each IDEA phase renders a contextual navy card in the right sidebar that explains WHY this phase is remarkable vs. the current state. Controlled by `currentPhase` value:
- `identify` → "Why This Was Ready" (playbook was pre-built before the crisis)
- `detect` → "What AI Just Replaced" (216+ sources vs. manual analyst scanning)
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

### Production Build
```bash
npm run build      # Builds to dist/ (~22 seconds)
npm run start      # Serves pre-built dist/index.js
```

**The `dist/` folder is committed to the repo.** Always run `npm run build` before publishing.

### Deployment Platform
- Replit Autoscale
- Custom domain: `executeiq.io`
- Start command: `npm run start` (no build step during deploy — avoids bundle timeout)
- First customer org: `martybrunke` — org ID `aa9d3bf3-ab20-4fb6-a1da-e91aabbfb576`

### Known `.replit` Issue — Run Before Every Publish
The `.replit` file persistently resets to include a `build` step in the deployment block, which causes a bundle timeout during deploy. Before every publish, override it using the deployment config tool:

```javascript
// Run this via the agent before every publish:
await deployConfig({
  deploymentTarget: "autoscale",
  run: ["npm", "run", "start"],
  build: ["true"]   // "true" is a no-op — prevents bundle timeout
});
```

The API config takes precedence over `.replit` once set.

---

## 19. Critical Rules for Any Developer

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

---

## 20. Playbook Seeding (Production)

Seeding logic is in `server/index.ts` as an additive migration:
- If playbook count < 170, only inserts missing compound playbooks by name lookup
- No destructive wipe — safe to run repeatedly
- `playbookLibrarySeed.ts` and `playbookLibrarySeed_PARTIAL.ts` in `server/seeds/` are NOT the active source of truth — the DB was seeded once from a complete run and is maintained additively

---

## 21. Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `SESSION_SECRET` | Express session signing secret |
| `REPL_ID` | Replit OIDC client ID |
| `ISSUER_URL` | OIDC issuer (default: `https://replit.com/oidc`) |
| `OPENAI_API_KEY` | GPT-4o access |
| `RESEND_API_KEY` | Email delivery (falls back to console log if absent) |
| `GITHUB_TOKEN` | Available if needed for GitHub integration |

---

*This file documents the state of the codebase as of March 2026. Update this file whenever you add new pages, change key patterns, wire new components, or alter the design system.*

---

## 22. Playbook ID Strategy — Stable vs. Environment-Specific UUIDs

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

