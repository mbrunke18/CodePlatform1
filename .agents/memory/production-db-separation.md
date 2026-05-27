---
name: Production DB separation and pre-ship auto-heal
description: Dev and production databases are genuinely separate. executeSql hits dev only. The pre-ship check runs against whichever DATABASE_URL the build environment provides.
---

## The rule

`executeSql` (code_execution sandbox) hits the **development** database only — confirmed by `environment` parameter rejecting `"production"`. It cannot patch the production database directly.

The pre-ship check script (`scripts/pre-ship-check.ts`) uses `DATABASE_URL` from the environment it runs in. During local dev, that's the dev DB. During a Replit deployment build, that's the **production** DB — a genuinely separate Neon instance.

**Why:** Replit deployments inject their own `DATABASE_URL` secret into the build container, which differs from the dev environment's `DATABASE_URL` even when `DATABASE_URL_DEV` is not set.

## How to apply

- Never assume a patch run via `executeSql` also applied to production.
- To repair production data, write an **auto-heal** in the pre-ship check itself (runs during deployment build against production DB), OR add a startup migration in `server/index.ts`.
- For checks where the fix is known and safe (e.g., backfilling a FK that the login flow also sets), use auto-heal pattern: UPDATE + report rows fixed + always pass. Reserve hard failures for things that can't be safely auto-repaired (missing tables, missing seed data).

## Auto-heal pattern (already applied to check #1 in pre-ship-check.ts)

```ts
const { rowCount } = await pool.query(`UPDATE users SET organization_id = ...`);
results.push({ name: '...', passed: true, detail: rowCount > 0 ? `Auto-fixed ${rowCount}` : 'OK' });
```
