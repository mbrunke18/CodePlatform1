/**
 * Playbook enrichment — generates execution content for all unenriched playbooks.
 *
 * Run full:   npx tsx server/seeds/enrichAllPlaybooks.ts
 * Run chunk:  npx tsx server/seeds/enrichAllPlaybooks.ts --count 20
 *
 * Safe to re-run — skips playbooks already enriched.
 */

import OpenAI from 'openai';
import { Pool } from 'pg';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const DELAY_MS = 600;

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// Deliberately concise prompt — schema is described not shown, leaving max tokens for output
function buildPrompt(p: any): string {
  const budget = `$${Number(p.pre_approved_budget || 500000).toLocaleString()}`;
  const t1 = Array.isArray(p.tier1_stakeholders) ? p.tier1_stakeholders.join(', ') : String(p.tier1_stakeholders);
  const t2 = Array.isArray(p.tier2_stakeholders) ? p.tier2_stakeholders.join(', ') : String(p.tier2_stakeholders);

  return `Generate a Fortune 500 strategic execution plan for the playbook below. Return ONLY a JSON object with exactly these keys:

whyItMatters (string): 2 specific sentences with realistic industry benchmarks on why fast response matters for this exact scenario.

signalSources (string[]): 4 specific enterprise data sources that detect this trigger.

enrichedPhases (array of 4 objects): 4 execution phases named "Immediate Assessment" (0-4h), "Internal Response" (4-24h), "External Action" (24-72h), "Structural Response" (3-30d). Each phase has: id (phase-1 through phase-4), name, timeWindow, objective (1 sentence), tasks (array of 2 role objects, each with role/priority/deadline/items array of 3 tasks), restrictions (2 strings), decisionGate (object with title/criteria array/escalation string, or null for phase 4).

communicationAssets (array of 2 objects): A board_notification (with subject line, 120-word draft body using [Company] placeholder) and a sales_battle_card (2 Q&A pairs in the body field, subject null).

riskIndicators (object): green (3 on-track signals), yellow (3 early warning signals), red (3 escalation triggers) — each as string array.

outcomeFraming (object): at12hours (3 success conditions), at30days (3 outcomes), failureModes (3 avoidable failure patterns) — each as string array.

Be highly specific to this scenario — no generic corporate language.

PLAYBOOK: ${p.name}
DOMAIN: ${p.domain_name}
TRIGGER: ${p.trigger_criteria}
STRATEGY: ${p.primary_response_strategy || 'Coordinated rapid response'}
PRE-APPROVED BUDGET: ${budget}
DECISION MAKERS: ${t1}
EXECUTION TEAM: ${t2}`;
}

async function enrich(playbook: any): Promise<any> {
  const res = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [{ role: 'user', content: buildPrompt(playbook) }],
    max_completion_tokens: 4096,
    response_format: { type: 'json_object' },
  });

  const choice = res.choices[0];
  if (!choice) throw new Error('No choices in response');
  if (choice.finish_reason === 'length') throw new Error('Truncated — hit token limit');
  const raw = choice.message?.content ?? '';
  if (!raw) throw new Error('Empty content');
  return JSON.parse(raw);
}

async function run() {
  console.log(`\nUsing: ${process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || 'OpenAI direct'}\n`);

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

  const batch = limit === Infinity ? unenriched : unenriched.slice(0, limit);
  console.log(`Unenriched total: ${unenriched.length} | This run: ${batch.length}\n`);

  let ok = 0, fail = 0;

  for (let i = 0; i < batch.length; i++) {
    const p = batch[i];
    process.stdout.write(`[${i + 1}/${batch.length}] "${p.name}" (${p.domain_name})... `);

    try {
      const data = await enrich(p);

      if (!Array.isArray(data.enrichedPhases) || data.enrichedPhases.length < 4)
        throw new Error('Expected 4 phases');
      if (!data.riskIndicators?.green)
        throw new Error('Missing riskIndicators');

      await db.query(`
        UPDATE playbook_library SET
          why_it_matters = $1, signal_sources = $2, enriched_phases = $3,
          communication_assets = $4, risk_indicators = $5, outcome_framing = $6
        WHERE id = $7
      `, [
        data.whyItMatters,
        JSON.stringify(data.signalSources),
        JSON.stringify(data.enrichedPhases),
        JSON.stringify(data.communicationAssets),
        JSON.stringify(data.riskIndicators),
        JSON.stringify(data.outcomeFraming),
        p.id,
      ]);

      process.stdout.write(`✓\n`);
      ok++;
    } catch (e: any) {
      process.stdout.write(`✗ ${e.message}\n`);
      fail++;
    }

    if (i < batch.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n${'─'.repeat(55)}`);
  console.log(`Done — ${ok} enriched, ${fail} failed, ${unenriched.length - ok} still remaining`);
  if (fail > 0) console.log('Re-run to retry failures.');

  await db.end();
}

run().catch(e => { console.error(e); process.exit(1); });
