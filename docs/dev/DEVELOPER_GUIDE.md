# VaughnMartin — Execution OS Developer Guide

**Strategic Execution OS for Fortune 1000 Companies**

This guide provides everything developers need to understand, review, and contribute to the VaughnMartin Execution OS.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Push database schema changes
npm run db:push
```

The app runs on port 5000 with hot reload enabled.

---

## Project Overview

VaughnMartin Readiness OS compresses the 30-day mobilization cycle to 12-minute execution through:
- **170 pre-built playbooks** across 9 strategic domains
- **IDEA Framework™** (Identify, Detect, Execute, Advance)
- **AI monitors, executives authorize** — no playbook activates without executive sign-off. The phrase "human-AI partnership" is RETIRED from all copy.
- **248+ data points** across 20 signal categories, monitored in real time

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| UI Components | Radix UI, shadcn/ui, Tailwind CSS |
| State Management | TanStack Query v5 |
| Routing | Wouter |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (Neon serverless) |
| ORM | Drizzle ORM |
| Auth | Replit OIDC + Passport.js |
| Real-time | Socket.IO |
| AI | OpenAI GPT-4o |

### Directory Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── layout/     # StandardNav, Footer, PageLayout
│   │   │   ├── ui/         # shadcn/ui primitives
│   │   │   └── ...         # Feature-specific components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and helpers
│   │   └── navigation/     # Navigation configuration
│   └── index.html          # Entry HTML with meta tags
├── server/                 # Backend Express application
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database interface
│   ├── seeds/              # Database seed data
│   └── vite.ts             # Vite dev server integration
├── shared/                 # Shared code between client/server
│   ├── schema.ts           # Drizzle database schema
│   └── constants/          # Framework constants, task library
└── docs/                   # Documentation
```

---

## Design System

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Navy (Primary) | `#1A2B3D` | Headers, primary buttons |
| Gold (Accent) | `#D4AF37` | CTAs, highlights, premium features |
| Teal (Accent) | `#00A8A8` | Interactive elements, links |
| White | `#FFFFFF` | Text on dark backgrounds |
| Muted | `#94A3B8` | Secondary text |

### Typography

- **Headings**: Montserrat Bold
- **Body**: Inter Regular
- **Tagline**: "EXECUTE DECISIONS AT SCALE"

### Logo Component

```tsx
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";

// Variants
<ExecuteIQLogo variant="full" />        // Icon + text + tagline
<ExecuteIQLogo variant="icon-only" />   // Just concentric rings
<ExecuteIQLogo variant="text-only" />   // Just wordmark

// Colors
<ExecuteIQLogo color="navy" />   // Dark backgrounds
<ExecuteIQLogo color="white" />  // Light/dark hero sections
<ExecuteIQLogo color="gold" />   // Premium sections
```

### Layout Components

```tsx
// Standard page with nav + footer
import PageLayout from '@/components/layout/PageLayout';

<PageLayout>
  {/* Page content */}
</PageLayout>

// Just navigation
import StandardNav from '@/components/layout/StandardNav';
```

---

## IDEA Framework Modules

| Phase | Module | Description |
|-------|--------|-------------|
| **I**DENTIFY | Playbook Library | Build/customize playbooks from 170 templates |
| **D**ETECT | Signal Intelligence | AI-powered trigger monitoring across 248+ data points |
| **E**XECUTE | War Room | 12-minute coordinated response |
| **A**DVANCE | Execution History | Institutional learning and debrief |

Plus **Mission Control** — executive radar with clickable triggers → playbook activation

---

## Key Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing homepage |
| `/why-executeiq` | Origin story and value proposition |
| `/how-it-works` | IDEA Framework explanation |
| `/playbooks` | Playbook library browser |
| `/dashboard` | Main user dashboard |
| `/mission-control` | Executive command center |
| `/pilot-program` | 90-day pilot signup |
| `/investor` | Investor presentation |

---

## Database Schema

Key tables in `shared/schema.ts`:

- `users` - User accounts
- `organizations` - Company entities
- `playbooks` - Strategic playbook definitions
- `playbookTasks` - Tasks within playbooks
- `triggers` - Event trigger configurations
- `scenarios` - Active strategic scenarios
- `sessions` - User sessions

### Migrations

Never write raw SQL. Use Drizzle:

```bash
npm run db:push        # Push schema to database
npm run db:push --force # Force push (data loss warning)
```

---

## API Patterns

### Endpoints

All API routes are in `server/routes.ts`:

```typescript
// GET list
app.get('/api/playbooks', async (req, res) => { ... });

// GET single
app.get('/api/playbooks/:id', async (req, res) => { ... });

// POST create
app.post('/api/playbooks', async (req, res) => { ... });

// PATCH update
app.patch('/api/playbooks/:id', async (req, res) => { ... });

// DELETE
app.delete('/api/playbooks/:id', async (req, res) => { ... });
```

### Frontend Data Fetching

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Fetch data
const { data, isLoading } = useQuery({
  queryKey: ['/api/playbooks'],
});

// Mutate data
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

const form = useForm({
  resolver: zodResolver(insertPlaybookSchema),
  defaultValues: { name: '', domain: '' },
});
```

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

---

## Security

- **Helmet** - Security headers (CSP, XSS protection)
- **Rate Limiting** - 1000 req/15min API, 20 req/15min auth
- **Session Security** - HTTP-only cookies, PostgreSQL store
- **Secrets** - All sensitive data in environment variables

---

## Testing

```bash
npm run test        # Run Vitest tests
npm run test:ui     # Vitest with UI
```

---

## Review Checklist

### Code Quality
- [ ] TypeScript types are complete (no `any` abuse)
- [ ] Components are properly extracted and reusable
- [ ] API routes validate input with Zod schemas
- [ ] Error handling is comprehensive

### Design Consistency
- [ ] Uses brand colors (navy/gold/teal)
- [ ] Uses Montserrat for headings, Inter for body
- [ ] Logo appears in header and footer
- [ ] Dark/light mode works correctly

### UX
- [ ] Loading states shown during data fetching
- [ ] Error states handled gracefully
- [ ] Mobile responsive layouts
- [ ] Navigation is intuitive

### Performance
- [ ] No unnecessary re-renders
- [ ] Images optimized
- [ ] Lazy loading where appropriate

---

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection
- `SESSION_SECRET` - Express session encryption

**Optional:**
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI access
- `VITE_GA_MEASUREMENT_ID` - Google Analytics

---

## Contributing

1. Create a feature branch
2. Make changes following existing patterns
3. Test thoroughly
4. Update documentation if needed
5. Submit for review

---

## Contact

For questions about the codebase or architecture, refer to `replit.md` for additional context.
