/**
 * Playbook enrichment — generates Phase/Gate/Communication/Risk/Outcome content
 * for all unenriched playbooks using gpt-5.2 with concurrent batching.
 *
 * Run chunk:  npx tsx server/seeds/enrichAllPlaybooks.ts --count 15
 * Run all:    npx tsx server/seeds/enrichAllPlaybooks.ts
 *
 * Safe to re-run — skips playbooks that already have enriched_phases set.
 * Runs CONCURRENCY calls at a time to balance speed vs. rate limits.
 */

import OpenAI from 'openai';
import { Pool } from 'pg';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const CONCURRENCY = 3;

function buildPrompt(p: any): string {
  const budget = `$${Number(p.pre_approved_budget || 500000).toLocaleString()}`;
  const t1 = Array.isArray(p.tier1_stakeholders)
    ? p.tier1_stakeholders.join(', ')
    : String(p.tier1_stakeholders ?? '');
  const t2 = Array.isArray(p.tier2_stakeholders)
    ? p.tier2_stakeholders.join(', ')
    : String(p.tier2_stakeholders ?? '');

  return `You are a senior Fortune 500 strategic execution advisor. Return a single JSON object for this playbook — no prose, no markdown, JSON only.

Required keys and formats:

"whyItMatters": string — 2 sentences citing realistic industry benchmarks about why fast response is critical for this specific scenario.

"signalSources": string[4] — 4 specific enterprise data feeds or monitoring channels that detect this trigger.

"enrichedPhases": array of exactly 4 objects with this shape:
{ "id": "phase-N", "name": string, "timeWindow": string, "objective": string,
  "tasks": [ { "role": string, "priority": "lead"|"required", "deadline": string, "items": string[3] }, (2 role objects per phase) ],
  "restrictions": string[2],
  "decisionGate": { "title": string, "criteria": string[3], "escalation": string } | null }
Phase names: "Immediate Assessment" (0-4h), "Internal Response" (4-24h), "External Action" (24-72h), "Structural Response" (3-30d). Phase 4 decisionGate must be null.

"communicationAssets": array of 2 objects:
- { "type": "board_notification", "label": string, "timing": string, "subject": string, "body": string (100 words, use [Company] placeholder) }
- { "type": "sales_battle_card", "label": string, "timing": string, "subject": null, "body": string (2 Q&A pairs) }

"riskIndicators": { "green": string[3], "yellow": string[3], "red": string[3] }

"outcomeFraming": { "at12hours": string[3], "at30days": string[3], "failureModes": string[3] }

All content must be specific to this exact scenario. No filler language.

PLAYBOOK: ${p.name}
DOMAIN: ${p.domain_name}
TRIGGER: ${p.trigger_criteria}
RESPONSE STRATEGY: ${p.primary_response_strategy || 'Coordinated rapid response'}
PRE-APPROVED BUDGET: ${budget}
DECISION MAKERS (Tier 1): ${t1}
EXECUTION TEAM (Tier 2): ${t2}`;
}

async function enrichOne(p: any, db: Pool): Promise<'ok' | 'fail'> {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [{ role: 'user', content: buildPrompt(p) }],
      max_completion_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const choice = res.choices[0];
    if (!choice) throw new Error('No choices in response');
    if (choice.finish_reason === 'length') throw new Error('Truncated at token limit');
    const raw = choice.message?.content ?? '';
    if (!raw) throw new Error('Empty content returned');

    const data = JSON.parse(raw);

    if (!Array.isArray(data.enrichedPhases) || data.enrichedPhases.length < 4)
      throw new Error('Expected 4 enrichedPhases');
    if (!data.riskIndicators?.green)
      throw new Error('Missing riskIndicators.green');

    await db.query(
      `UPDATE playbook_library SET
         why_it_matters = $1, signal_sources = $2, enriched_phases = $3,
         communication_assets = $4, risk_indicators = $5, outcome_framing = $6
       WHERE id = $7`,
      [
        data.whyItMatters,
        JSON.stringify(data.signalSources),
        JSON.stringify(data.enrichedPhases),
        JSON.stringify(data.communicationAssets),
        JSON.stringify(data.riskIndicators),
        JSON.stringify(data.outcomeFraming),
        p.id,
      ]
    );

    process.stdout.write(`  ✓ "${p.name}"\n`);
    return 'ok';
  } catch (e: any) {
    process.stdout.write(`  ✗ "${p.name}" — ${e.message}\n`);
    return 'fail';
  }
}

async function run() {
  const endpoint = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || 'OpenAI direct';
  console.log(`\nEnrichment engine — ${endpoint} — concurrency ${CONCURRENCY}\n`);

  const countIdx = process.argv.indexOf('--count');
  const limit = countIdx !== -1 ? parseInt(process.argv[countIdx + 1], 10) : Infinity;

  const db = new Pool({ connectionString: process.env.DATABASE_URL });

  const { rows: unenriched } = await db.query(`
    SELECT pl.id, pl.name, pl.playbook_number, pl.trigger_criteria,
           pl.primary_response_strategy, pl.pre_approved_budget,
           pl.tier1_stakeholders, pl.tier2_stakeholders,
           pd.name as domain_name
    FROM playbook_library pl
    JOIN playbook_domains pd ON pl.domain_id = pd.id
    WHERE pl.enriched_phases IS NULL
    ORDER BY pl.playbook_number
  `);

  const todo = limit === Infinity ? unenriched : unenriched.slice(0, limit);
  console.log(`Unenriched total: ${unenriched.length} | Processing this run: ${todo.length}\n`);

  let ok = 0, fail = 0;

  // Process in batches of CONCURRENCY
  for (let i = 0; i < todo.length; i += CONCURRENCY) {
    const batchPlaybooks = todo.slice(i, i + CONCURRENCY);
    const batchNum = Math.floor(i / CONCURRENCY) + 1;
    const totalBatches = Math.ceil(todo.length / CONCURRENCY);
    console.log(`Batch ${batchNum}/${totalBatches} — ${batchPlaybooks.map(p => p.name).join(', ')}`);

    const results = await Promise.all(batchPlaybooks.map(p => enrichOne(p, db)));
    ok += results.filter(r => r === 'ok').length;
    fail += results.filter(r => r === 'fail').length;
  }

  const remaining = unenriched.length - ok;
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Run complete — ${ok} enriched, ${fail} failed`);
  console.log(`Remaining unenriched in DB: ${Math.max(0, remaining)}`);
  if (remaining > 0 && limit !== Infinity) {
    console.log(`\nRun again to continue: npx tsx server/seeds/enrichAllPlaybooks.ts --count ${limit}`);
  }

  await db.end();
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
