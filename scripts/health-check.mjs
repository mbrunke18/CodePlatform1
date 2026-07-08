/**
 * VaughnMartin Readiness OS — Pre-Demo Health Check
 * Verifies every key customer/investor-facing page returns 200.
 * Run: node scripts/health-check.mjs
 * Or:  BASE_URL=https://your-domain.com node scripts/health-check.mjs
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function waitForServer(url, maxWaitMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const r = await fetch(`${url}/api/auth/user`, { signal: AbortSignal.timeout(2000) });
      if (r.status < 500) return true;
    } catch { /* not ready yet */ }
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

const PAGES = [
  // Core public pages
  { path: '/',                    label: 'Homepage' },
  { path: '/how-it-executes',     label: 'How It Executes' },
  { path: '/proof-story',         label: 'Proof Story' },
  { path: '/request-access',      label: 'Request Access' },
  { path: '/executive-brief',     label: 'Executive Brief' },
  { path: '/roi-calculator',      label: 'ROI Calculator' },

  // Demo Center
  { path: '/demo-hub',            label: 'Demo Hub' },
  { path: '/full-experience',     label: 'Full Platform Experience' },
  { path: '/12-minute-experience',label: '12-Minute Test Drive' },
  { path: '/master-demo',         label: 'Master Demo (Activist)' },

  // All 10 scenario demos
  { path: '/demo/ransomware',     label: 'Demo — Ransomware' },
  { path: '/demo/pharma',         label: 'Demo — FDA Recall' },
  { path: '/demo/supply-chain',   label: 'Demo — Supply Chain' },
  { path: '/demo/energy',         label: 'Demo — Energy Grid' },
  { path: '/demo/food-safety',    label: 'Demo — Food Safety' },
  { path: '/demo/data-breach',    label: 'Demo — Data Breach' },
  { path: '/demo/regulatory',     label: 'Demo — DOJ Investigation' },
  { path: '/demo/market-entry',   label: 'Demo — Competitor Displacement' },
  { path: '/demo/acquisition',    label: 'Demo — M&A Response' },

  // Role experiences
  { path: '/experience/ceo',      label: 'Role — CEO' },
  { path: '/experience/cfo',      label: 'Role — CFO' },
  { path: '/experience/ciso',     label: 'Role — CISO' },
  { path: '/experience/coo',      label: 'Role — COO' },
  { path: '/experience/cmo',      label: 'Role — CMO' },

  // Investor & sales pages
  { path: '/investor-landing',    label: 'Investor Landing' },
  { path: '/how-it-works',        label: 'How It Works' },

  // API health
  { path: '/api/playbooks/metadata', label: 'API — Playbooks Metadata' },
];

const RETIRED_TERMS = [
  'Pilot Program', 'Pilot Access', 'Now in Pilot',
  '340×', '360×', '72 hours',
  'AI-powered', 'AI-driven', 'AI-generated',
  'human-AI partnership',
];

async function checkPage({ path, label }) {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'text/html,application/json' },
      signal: AbortSignal.timeout(10000),
    });
    const ms = Date.now() - start;
    const ok = res.status < 400;

    // Content check for HTML pages
    let contentWarning = null;
    if (ok && res.headers.get('content-type')?.includes('text/html')) {
      const text = await res.text();
      for (const term of RETIRED_TERMS) {
        if (text.includes(term)) {
          contentWarning = `Contains retired term: "${term}"`;
          break;
        }
      }
      if (!text.includes('VaughnMartin') && !text.includes('Readiness')) {
        contentWarning = 'Missing VaughnMartin/Readiness branding';
      }
    }

    return { label, path, status: res.status, ok, ms, contentWarning };
  } catch (err) {
    return { label, path, status: 0, ok: false, ms: Date.now() - start, error: err.message };
  }
}

async function run() {
  console.log(`\n🔍 VaughnMartin Readiness OS — Health Check`);
  console.log(`   Target: ${BASE_URL}`);
  console.log(`   Pages:  ${PAGES.length}\n`);

  if (!process.env.BASE_URL) {
    process.stdout.write('   Waiting for dev server...');
    const ready = await waitForServer(BASE_URL);
    if (!ready) { console.log(' timed out. Is the server running?\n'); process.exit(1); }
    console.log(' ready.\n');
  }

  const results = await Promise.all(PAGES.map(checkPage));

  let passed = 0, failed = 0, warned = 0;

  for (const r of results) {
    const icon = r.ok ? (r.contentWarning ? '⚠️ ' : '✅') : '❌';
    const status = r.status || 'ERR';
    const ms = r.ms ? `${r.ms}ms` : '';
    const note = r.contentWarning || r.error || '';
    console.log(`  ${icon} [${status}] ${r.label.padEnd(36)} ${ms.padStart(6)}  ${note}`);
    if (r.ok && !r.contentWarning) passed++;
    else if (r.ok && r.contentWarning) { passed++; warned++; }
    else failed++;
  }

  console.log(`\n  Results: ${passed} passed · ${warned} warnings · ${failed} failed\n`);

  if (failed > 0) {
    console.error(`  ❌ Health check FAILED — ${failed} page(s) returned errors.\n`);
    process.exit(1);
  }
  if (warned > 0) {
    console.warn(`  ⚠️  Health check passed with ${warned} content warning(s).\n`);
    process.exit(0);
  }
  console.log(`  ✅ All ${passed} pages healthy. Safe to present.\n`);
  process.exit(0);
}

run();
