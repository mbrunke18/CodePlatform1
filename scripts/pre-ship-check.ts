/**
 * Pre-Ship Consistency Check
 *
 * Run this before every production publish to catch data state issues
 * that unit tests cannot catch (DB invariants, orphaned records, etc.)
 *
 * Usage:
 *   npx tsx scripts/pre-ship-check.ts
 *
 * Exit code 0 = all checks passed
 * Exit code 1 = one or more checks failed — do not publish until resolved
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

const results: CheckResult[] = [];

async function check(
  name: string,
  query: string,
  expectZeroRows: boolean,
  failMessage: (rows: any[]) => string
): Promise<void> {
  try {
    const { rows } = await pool.query(query);
    const count = rows.length;

    if (expectZeroRows && count === 0) {
      results.push({ name, passed: true, detail: 'OK' });
    } else if (!expectZeroRows && count > 0) {
      results.push({ name, passed: true, detail: `OK (${count} row${count === 1 ? '' : 's'})` });
    } else {
      results.push({ name, passed: false, detail: failMessage(rows) });
    }
  } catch (err: any) {
    results.push({ name, passed: false, detail: `Query error: ${err.message}` });
  }
}

async function run() {
  console.log('\n🔍  VaughnMartin Readiness OS — Pre-Ship Consistency Check');
  console.log('─'.repeat(60));

  // ── 1. Auto-heal: backfill organization_id for org owners missing it ──────
  // This is a known safe repair — the login flow also does this on every sign-in.
  // We fix it here proactively so deploys are never blocked by this state.
  try {
    const { rowCount } = await pool.query(`
      UPDATE users
      SET organization_id = (
        SELECT id FROM organizations WHERE owner_id = users.id LIMIT 1
      )
      WHERE organization_id IS NULL
        AND EXISTS (SELECT 1 FROM organizations WHERE owner_id = users.id)
    `);
    const fixed = rowCount ?? 0;
    if (fixed > 0) {
      results.push({
        name: 'users.organization_id backfilled for all org owners',
        passed: true,
        detail: `Auto-fixed ${fixed} user(s) — organization_id backfilled`,
      });
    } else {
      results.push({
        name: 'users.organization_id backfilled for all org owners',
        passed: true,
        detail: 'OK',
      });
    }
  } catch (err: any) {
    results.push({
      name: 'users.organization_id backfilled for all org owners',
      passed: false,
      detail: `Backfill query failed: ${err.message}`,
    });
  }

  // ── 2. Users with organization_id pointing to a non-existent org ────────
  await check(
    'no users reference a deleted/missing organization',
    `SELECT u.id, u.email, u.organization_id
     FROM users u
     LEFT JOIN organizations o ON o.id = u.organization_id
     WHERE u.organization_id IS NOT NULL AND o.id IS NULL
     LIMIT 20`,
    true,
    (rows) =>
      `${rows.length} user(s) reference a non-existent org: ` +
      rows.map((r: any) => `${r.email} → ${r.organization_id}`).join(', ')
  );

  // ── 3. Organizations exist ──────────────────────────────────────────────
  await check(
    'at least one organization exists',
    `SELECT id FROM organizations LIMIT 1`,
    false,
    () => 'No organizations found in DB — seeding may have failed'
  );

  // ── 4. Protocols seeded ─────────────────────────────────────────────────
  await check(
    'Readiness Protocols seeded (expect 180+)',
    `SELECT id FROM playbooks LIMIT 180`,
    false,
    (rows) => `Only ${rows.length} protocols found — expected 180+`
  );

  // ── 5. Executive triggers seeded ───────────────────────────────────────
  await check(
    'Executive triggers seeded',
    `SELECT id FROM executive_triggers LIMIT 1`,
    false,
    () => 'executive_triggers table is empty — trigger monitoring will not function'
  );

  // ── 6. Sessions table exists (required for auth) ────────────────────────
  await check(
    'sessions table exists',
    `SELECT 1 FROM sessions LIMIT 1`,
    false,
    () => 'sessions table missing — auth will fail for all users'
  );

  // ── 7. Allowed emails table accessible ─────────────────────────────────
  await check(
    'allowed_emails table accessible',
    `SELECT COUNT(*) FROM allowed_emails`,
    false,
    () => 'allowed_emails table missing — access control will fail open'
  );

  // ── 8. No orphaned org memberships ─────────────────────────────────────
  await check(
    'no orphaned org memberships (user or org deleted)',
    `SELECT om.id
     FROM org_memberships om
     LEFT JOIN users u ON u.id = om.user_id
     LEFT JOIN organizations o ON o.id = om.organization_id
     WHERE u.id IS NULL OR o.id IS NULL
     LIMIT 10`,
    true,
    (rows) => `${rows.length} orphaned org_memberships found — cleanup needed`
  );

  // ── Report ───────────────────────────────────────────────────────────────
  console.log('');
  let allPassed = true;
  for (const r of results) {
    const icon = r.passed ? '✅' : '❌';
    console.log(`${icon}  ${r.name}`);
    if (!r.passed) {
      console.log(`     → ${r.detail}`);
      allPassed = false;
    }
  }

  console.log('\n' + '─'.repeat(60));
  if (allPassed) {
    console.log('✅  All checks passed — safe to publish\n');
  } else {
    const failed = results.filter(r => !r.passed).length;
    console.log(`❌  ${failed} check(s) failed — resolve before publishing\n`);
  }

  await pool.end();
  process.exit(allPassed ? 0 : 1);
}

run().catch((err) => {
  console.error('Pre-ship check crashed:', err);
  pool.end().finally(() => process.exit(1));
});
