---
name: Protocol #0 Architecture
description: 3-tier universal fallback system — how it works, numbering, DB constraints, and display rules
---

# Protocol #0 Universal Response Infrastructure

**Rule:** The platform has a 3-tier fallback chain for unmatched triggers:
1. Specific protocol match → run that protocol
2. Domain known, no protocol match → run the domain-level #0 for that domain
3. No domain match at all → run master Protocol #0 (universal)

**Why:** Organizations face novel situations not covered by any of the 180 protocols. The #0 family ensures no trigger ever finds the organization without a pre-staged response infrastructure.

**Numbering scheme (reserved — do not use these numbers for real protocols):**
- `0` — Master Universal Response Protocol (P0-000, domain: AI Governance as home)
- `10001–10009` — Domain-level #0s (P0-D1 through P0-D9, one per strategic domain)
- These are NOT counted in the "180 Readiness Protocols" total

**DB seeding:** `server/seeds/protocolZeroSeed.ts` → `seedProtocolZeroFamily()` — idempotent, called from `server/index.ts` after `seedEnrichedPlaybooks()`. Inserts all 10 with full IDEA Framework enrichedPhases as JSONB.

**How to apply:**
- Detection in ProtocolLibrary: `isUniversalFallback(p)` checks `playbookNumber === 0` OR `10001-10009` OR name startsWith "Unknown Trigger —"
- All 10 names are in `SAMPLE_PLAYBOOK_NAMES` so they're publicly visible without auth
- Rendered in a separate teal "Universal Response Infrastructure" section above the main protocol grid
- ProtocolDetail shows a teal simulation banner for `playbookNumber === 0` linking to `/protocol-zero`
- `playbookNumber` is now included in the `/api/playbooks/templates` response shape
