/**
 * Enrichment script — generates Phase/Gate/Communication/Risk/Outcome content
 * for every unenriched playbook in playbook_library using GPT-4o.
 *
 * Run: npx tsx server/seeds/enrichAllPlaybooks.ts
 *
 * Safe to restart: skips playbooks that already have enriched_phases set.
 * Logs progress and errors without stopping — a failed playbook is skipped,
 * not a reason to abort the whole run.
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { playbookLibrary } from '../../shared/schema';
import { eq, isNull } from 'drizzle-orm';
import OpenAI from 'openai';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DELAY_MS = 1200; // stay well under rate limits

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const SYSTEM_PROMPT = `You are a senior Fortune 500 strategic advisor with 20 years of experience
designing crisis and competitive response playbooks. You write execution plans in plain,
specific, boardroom-ready language.

You will receive a playbook's metadata and must return a JSON object with exactly these 6 fields:

{
  "whyItMatters": "string — one or two specific, quantified sentences about why fast response is
    critical for this scenario. Include a realistic research finding or industry benchmark.
    Do NOT fabricate specific statistics — frame as 'Research consistently shows...' or
    'Organizations that respond within X timeframe tend to...'",

  "signalSources": ["array of 3-5 specific strings — what enterprise systems, data feeds,
    or human intelligence channels the platform monitors to detect this trigger"],

  "enrichedPhases": [
    {
      "id": "phase-1",
      "name": "short name (2-4 words)",
      "timeWindow": "e.g. Hours 0–4",
      "objective": "one sentence — what must be accomplished before moving to next phase",
      "tasks": [
        {
          "role": "specific executive title or team (e.g. CFO, Chief Supply Chain Officer, Legal)",
          "priority": "lead | required | conditional",
          "deadline": "e.g. within 2 hours | within this phase | within 48 hours",
          "items": ["3-6 specific actionable tasks for this role — not generic, not vague"]
        }
      ],
      "restrictions": ["2-4 things that must NOT happen during this phase"],
      "decisionGate": {
        "title": "Phase N → Phase N+1 Decision Gate",
        "criteria": ["3-5 specific conditions that must be true before advancing"],
        "escalation": "string or null — what happens if gate cannot clear"
      }
    }
  ],
  — provide EXACTLY 4 phases:
    Phase 1: Immediate Assessment (Hours 0-4)
    Phase 2: Internal Response Execution (Hours 4-8 OR Hours 4-48 for complex scenarios)
    Phase 3: External Communication / Market Action (Hours 8-72)
    Phase 4: Sustain / Structural Response (Days 2-30)
  — Phase 4 decisionGate should be null

  "communicationAssets": [
    {
      "type": "board_notification | customer_outreach | press_response | sales_battle_card | executive_statement | investor_communication | employee_communication",
      "label": "Short human-readable label",
      "timing": "e.g. Hour 6 — notification, not approval",
      "subject": "string or null (null for non-email assets like battle cards)",
      "body": "The draft communication text. Use [brackets] for fill-in-the-blank sections.
        For board notifications: 150-200 words. For customer scripts: 75-100 words.
        For battle cards: structured Q&A format. Be specific, not generic."
    }
  ],
  — provide 2-4 assets relevant to this specific scenario type

  "riskIndicators": {
    "green": ["3 specific signals that indicate response is working well"],
    "yellow": ["3 specific signals to watch closely — early warning"],
    "red": ["3 specific signals that require immediate escalation"]
  },

  "outcomeFraming": {
    "at12hours": ["3-4 specific conditions that define success at the 12-hour mark"],
    "at30days": ["3-4 specific outcomes that define success at 30 days"],
    "failureModes": ["3-4 specific, avoidable failure patterns this playbook prevents"]
  }
}

Rules:
- Be specific to this EXACT scenario — never write generic corporate-speak
- Use real executive titles and specific action verbs
- Communication assets should feel like working drafts, not templates
- Risk indicators should have specific thresholds, not just "monitor the situation"
- Failure modes should describe actual organizational behaviors that cause bad outcomes
- Return ONLY the JSON object — no markdown, no explanation, no prefix text`;

function buildUserPrompt(playbook: any): string {
  return `Generate enriched execution content for this strategic playbook:

PLAYBOOK NAME: ${playbook.name}
DOMAIN: ${playbook.domain_name}
TRIGGER CRITERIA: ${playbook.trigger_criteria}
PRIMARY RESPONSE STRATEGY: ${playbook.primary_response_strategy || 'Not specified'}
PRE-APPROVED BUDGET: $${Number(playbook.pre_approved_budget || 500000).toLocaleString()} (no board vote required for amounts within this threshold)
TARGET EXECUTION TIME: ${playbook.target_execution_time || 12} hours to initial coordination
TIER 1 STAKEHOLDERS (Decision Makers): ${JSON.stringify(playbook.tier1_stakeholders)}
TIER 2 STAKEHOLDERS (Execution Team): ${JSON.stringify(playbook.tier2_stakeholders)}
TIER 3 STAKEHOLDERS (Notification Groups): ${JSON.stringify(playbook.tier3_stakeholders)}
EXTERNAL PARTNERS: ${JSON.stringify(playbook.external_partners)}
HISTORICAL SUCCESS RATE: ${playbook.historical_success_rate ? (Number(playbook.historical_success_rate) * 100).toFixed(0) + '%' : 'Not available'}

This playbook is part of VaughnMartin's Execution OS — a strategic execution platform for
Fortune 1000 companies. The audience for this content is C-suite executives and their
direct reports at large enterprises. Language should be boardroom-ready and execution-specific.

Return ONLY a valid JSON object matching the schema in your instructions.`;
}

async function generateEnrichment(playbook: any): Promise<any> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(playbook) }
    ],
    temperature: 0.4,
    max_tokens: 3500,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No content returned from OpenAI');
  return JSON.parse(content);
}

async function run() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY not set. Cannot proceed.');
    process.exit(1);
  }

  // Fetch all unenriched playbooks with domain name joined
  const { Pool: PgPool } = await import('pg');
  const pgPool = new PgPool({ connectionString: process.env.DATABASE_URL });

  const { rows: playbooks } = await pgPool.query(`
    SELECT pl.id, pl.name, pl.playbook_number, pl.trigger_criteria,
           pl.primary_response_strategy, pl.pre_approved_budget,
           pl.tier1_stakeholders, pl.tier2_stakeholders, pl.tier3_stakeholders,
           pl.external_partners, pl.historical_success_rate, pl.target_execution_time,
           pd.name as domain_name
    FROM playbook_library pl
    JOIN playbook_domains pd ON pl.domain_id = pd.id
    WHERE pl.enriched_phases IS NULL
    ORDER BY pl.playbook_number
  `);

  console.log(`\nFound ${playbooks.length} playbooks to enrich.\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < playbooks.length; i++) {
    const playbook = playbooks[i];
    const progress = `[${i + 1}/${playbooks.length}]`;

    try {
      process.stdout.write(`${progress} Generating: "${playbook.name}" (${playbook.domain_name})... `);

      const enrichment = await generateEnrichment(playbook);

      // Validate the shape before writing
      if (!enrichment.enrichedPhases || !Array.isArray(enrichment.enrichedPhases)) {
        throw new Error('Response missing enrichedPhases array');
      }
      if (!enrichment.riskIndicators?.green) {
        throw new Error('Response missing riskIndicators');
      }

      await pgPool.query(`
        UPDATE playbook_library SET
          why_it_matters = $1,
          signal_sources = $2,
          enriched_phases = $3,
          communication_assets = $4,
          risk_indicators = $5,
          outcome_framing = $6
        WHERE id = $7
      `, [
        enrichment.whyItMatters,
        JSON.stringify(enrichment.signalSources),
        JSON.stringify(enrichment.enrichedPhases),
        JSON.stringify(enrichment.communicationAssets),
        JSON.stringify(enrichment.riskIndicators),
        JSON.stringify(enrichment.outcomeFraming),
        playbook.id,
      ]);

      console.log(`✓ (${enrichment.enrichedPhases.length} phases, ${enrichment.communicationAssets?.length || 0} comms)`);
      successCount++;

    } catch (err: any) {
      console.log(`✗ FAILED: ${err.message}`);
      failCount++;
    }

    // Delay between calls to respect rate limits (skip delay on last item)
    if (i < playbooks.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Enrichment complete.`);
  console.log(`  Succeeded: ${successCount}`);
  console.log(`  Failed:    ${failCount}`);
  console.log(`  Total:     ${playbooks.length}`);
  if (failCount > 0) {
    console.log(`\nRe-run the script to retry failed playbooks.`);
  }

  await pgPool.end();
  await pool.end();
}

run().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
