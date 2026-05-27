---
name: Brunke Sisters seed schema quirks
description: Non-obvious DB type constraints encountered when seeding the Brunke Sisters 60-day history — prevents repeat debugging
---

## Rules

**ai_confidence in strategic_alerts is decimal(3,2)** — must be stored as 0.0–1.0 (e.g., `0.88`), not 0–100 integer. Inserting `88` causes numeric field overflow.

**applied_by_user_id in protocol_version_deltas is UUID type** — varchar seed user IDs like `audit-test-3` cause "invalid input syntax for type uuid". Use NULL when the actor is a varchar-keyed seed user.

**ADVANCE 2.0 FK chain must be seeded in order:** `preparation_updates` → `protocol_version_deltas` → `update_hypotheses`. Both downstream tables have NOT NULL FK on `preparation_update_id`. Seed preparation_updates first using RETURNING id to capture IDs.

**previous_value / new_value in protocol_version_deltas are JSONB** — must be valid JSON strings (e.g., `'"some text"'` with outer single quotes wrapping inner double quotes). Plain text strings cause "invalid input syntax for type json".

**playbook_activations.activated_by is varchar FK to users.id** — audit-test-3 (Marty Brunke) is the correct seed user for Brunke Sisters historical records. Her user ID is `audit-test-3`.

**Why:** These constraints are invisible from the Drizzle schema at a glance and caused multiple seed failures requiring iterative correction.

**How to apply:** Whenever seeding historical data for Brunke Sisters or any org with ADVANCE 2.0 loop records, follow the FK chain order above and check column types before inserting.
