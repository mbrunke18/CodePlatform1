---
name: StandardNav mega-menu descriptions can drift from tier renames
description: Nav dropdown descriptions are separate from page content and must be audited independently during any tier rename
---

During the Oracle Pro → Foresight rename, the StandardNav.tsx mega-menu description for "Pricing & Plans" was missed:

`"Core · Oracle Pro · Enterprise — three layers..."` → fixed to `"Core · Foresight · Enterprise..."`

**Why:** Grep scans for retired terms in `client/src/pages/` miss content in `client/src/components/`. The nav description strings are in StandardNav.tsx, not the Pricing page.

**How to apply:** When auditing tier names or any locked messaging, always scan `client/src/components/` separately from `client/src/pages/`. The StandardNav mega-menu descriptions at lines ~230-241 are particularly prone to drift.
