---
name: RoleSelector / RoleExperience persona pattern
description: How C-suite persona simulations are added — two synchronized files, shared stakeholder roster, category mapping
---

Adding a new executive persona (e.g. CIO, VP PMO) to the role-based demo requires editing **two files in lockstep**:
- `client/src/pages/RoleSelector.tsx` — the card/hook-question array (`roleConfigs`)
- `client/src/pages/RoleExperience.tsx` — the full interactive simulation (`ROLES` dict), keyed by the same `id`

**Why:** the two files duplicate the persona's identity (title, category) independently — there's no shared source of truth — so a persona added to only one file renders a broken link or a missing card.

**How to apply:**
- `category` in RoleSelector (`OFFENSE`/`DEFENSE`/`SPECIAL TEAMS`) must match `domainCategory` in RoleExperience (`GROWTH & POSITIONING`/`RISK & RESILIENCE`/`TRANSFORMATION`) — same mapping, different key names in each file.
- All personas share one fictional company ("Meridian Financial Group") and a reused stakeholder roster (Jennifer Park/CEO, Sarah Chen/CFO, Michael Rodriguez/CTO, David Wilson/COO, Robert Kim/CISO, Emily Taylor/GC, Michelle Harris/CHRO, etc.) — reuse these names for supporting stakeholders in a new persona's scenario rather than inventing a full new cast, for continuity across personas.
- Give each new persona a genuinely distinct crisis domain from existing roles (e.g. CIO = infrastructure/cloud outage, not overlapping with CTO's platform-rollout or CISO's breach-response) so hook questions don't read as duplicates.
- RoleExperience's `RoleData` interface pins the exact object shape (triggers, dataSources, customizations, signal, aiInsights, stakeholders, executionTasks, outcomes, lesson) — copy an existing block of similar domain as the template rather than freeform authoring.
