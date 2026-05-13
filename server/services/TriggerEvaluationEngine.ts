/**
 * TriggerEvaluationEngine
 *
 * Evaluates incoming signals against an organization's CONFIGURED trigger thresholds —
 * not a global keyword score. The customer has set up triggers, thresholds, and playbooks
 * for the specific situations they want to execute on. A trigger only fires when the
 * customer's own parameters are met.
 *
 * Two evaluation paths:
 *   1. Configured  — org has triggers in executiveTriggers / customTriggers → evaluate those
 *   2. Default     — org has no configured triggers → fall back to TRIGGER_PATTERNS
 *
 * Confidence thresholds by alert level (what the customer set):
 *   red    → 85 %  (critical severity, pre-staged playbook ready, must be certain)
 *   yellow → 72 %  (high/medium severity, standard bar)
 *   green  → 58 %  (low severity or informational, lower bar — still signal-based)
 */

import { db } from '../db.js';
import { executiveTriggers, customTriggers } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import type { AnalyzedSignal, DetectedTrigger } from './SignalEvaluationService.js';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TriggerCondition {
  field: string;
  operator: string;
  value: string | number | boolean;
  logic?: string;
}

// ─── Composite trigger group (created via DETECT tab on playbooks) ─────────────

interface TriggerGroupDataPoint {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  unit: string;
  operator: string;
  value: number;
  mandatory: boolean;
}

interface TriggerGroupConditions {
  type: 'trigger_group';
  dataPoints: TriggerGroupDataPoint[];
  minimumRequired: number;
}

interface ConfiguredTrigger {
  id: string;
  name: string;
  category: string;
  triggerType: string;
  conditions: TriggerCondition | TriggerCondition[];
  alertThreshold: string;          // 'red' | 'yellow' | 'green'
  severity: string;
  recommendedPlaybooks: string[];  // customer-configured playbooks for this exact scenario
  isActive: boolean;
  source: 'executive' | 'custom';
}

// ─── Confidence floor by the customer's configured alert threshold ────────────
// Aligned with SignalEvaluationService quality gates (updated May 2026):
//   red    → 85% (critical — pre-staged playbook must be certain)
//   yellow → 78% (raised from 72 — prevents borderline matches from alerting)
//   green  → 60% (informational, raised from 58 — still meaningful signal floor)
const THRESHOLD_CONFIDENCE_FLOOR: Record<string, number> = {
  red: 85,
  yellow: 78,
  green: 60,
};

// ─── Signal field keywords — maps data-point field IDs to text indicators ────
// When a signal mentions these terms, it is relevant to that data-point field.
// This bridges the gap between structured trigger config and unstructured news text.
const FIELD_KEYWORDS: Record<string, string[]> = {
  // Competitive
  comp_product_launch:    ['launch', 'released', 'announced', 'new product', 'new feature', 'unveiled', 'debut', 'introduced'],
  comp_pricing_change:    ['price cut', 'pricing', 'discount', 'price drop', 'price reduction', 'cheaper', 'cost reduction', 'price war'],
  comp_patent_filings:    ['patent', 'ip filing', 'intellectual property', 'trademark', 'innovation filing'],
  comp_job_postings:      ['hiring', 'job posting', 'recruitment', 'headcount', 'talent acquisition', 'open roles'],
  comp_exec_changes:      ['CEO', 'CFO', 'CTO', 'executive', 'leadership change', 'appointed', 'departed', 'succession'],
  comp_funding:           ['funding', 'raised', 'series', 'investment', 'venture capital', 'valuation', 'IPO'],

  // Market
  market_share:           ['market share', 'market position', 'market leader', 'gaining share', 'losing share', 'market dominance'],
  market_growth:          ['market growth', 'market expansion', 'growing market', 'market opportunity'],
  economic_indicators:    ['GDP', 'inflation', 'interest rate', 'recession', 'economic slowdown', 'economic growth'],
  consumer_sentiment:     ['consumer confidence', 'customer sentiment', 'buyer mood', 'consumer spending'],

  // Financial
  revenue_decline:        ['revenue decline', 'revenue miss', 'earnings miss', 'profit warning', 'guidance cut', 'revenue shortfall'],
  cash_flow:              ['cash flow', 'liquidity', 'cash crunch', 'free cash', 'working capital'],
  credit_rating:          ['credit rating', 'downgrade', 'credit watch', 'Moody', "S&P", 'Fitch', 'credit risk'],
  debt_levels:            ['debt', 'leverage', 'borrowing', 'loan', 'bond', 'debt load'],
  stock_price:            ['stock price', 'share price', 'stock drop', 'market cap', 'equity value', 'stock decline', 'stock surge'],

  // Regulatory
  regulatory_fine:        ['fine', 'penalty', 'enforcement', 'SEC', 'FTC', 'DOJ', 'regulator', 'sanction', 'consent decree'],
  legislation_change:     ['legislation', 'regulation', 'new law', 'rule change', 'compliance', 'mandate', 'GDPR', 'CCPA', 'executive order'],
  sec_filing:             ['8-K', 'SEC filing', 'material event', 'securities filing', '10-K', '10-Q', 'material disclosure'],

  // Supply Chain
  supplier_failure:       ['supplier', 'vendor', 'sourcing', 'supply chain', 'supply disruption', 'supplier risk'],
  logistics_disruption:   ['shipping', 'logistics', 'port', 'freight', 'delivery delay', 'transport disruption', 'shipping delay'],
  inventory:              ['inventory', 'stockout', 'shortage', 'overstock', 'inventory levels'],

  // Talent
  executive_departure:    ['CEO resigned', 'CFO left', 'executive departure', 'key executive', 'leadership transition', 'interim CEO'],
  talent_exodus:          ['layoffs', 'mass departure', 'attrition', 'retention crisis', 'talent loss', 'brain drain'],
  labor_action:           ['strike', 'union', 'labor dispute', 'walkout', 'collective bargaining'],

  // Technology / Cyber
  data_breach:            ['data breach', 'hack', 'cyber attack', 'ransomware', 'security incident', 'data leak', 'compromised', 'unauthorized access'],
  ai_disruption:          ['AI', 'artificial intelligence', 'generative AI', 'automation', 'large language model', 'ChatGPT', 'GPT', 'AI launch'],
  tech_obsolescence:      ['obsolete', 'legacy system', 'end of life', 'deprecated', 'technology shift', 'platform migration'],

  // Brand / Reputation
  media_crisis:           ['controversy', 'scandal', 'backlash', 'viral', 'boycott', 'PR crisis', 'reputational', 'public outcry', 'brand damage'],
  customer_complaint:     ['customer complaint', 'negative review', 'dissatisfied', 'customer backlash', 'review bombing'],
  social_sentiment:       ['social media', 'twitter', 'trending', 'viral', 'public reaction', 'online sentiment'],

  // Geopolitical
  trade_war:              ['tariff', 'trade war', 'trade policy', 'sanctions', 'export control', 'trade restriction', 'embargo'],
  political_instability:  ['political instability', 'government change', 'election', 'coup', 'political crisis', 'regime change'],
  sanctions:              ['sanctions', 'blacklist', 'OFAC', 'banned', 'restricted', 'economic sanction'],

  // ESG
  esg_controversy:        ['ESG', 'greenwashing', 'environmental violation', 'emissions', 'climate', 'sustainability', 'carbon', 'DEI', 'social responsibility'],
};

// Category → broad keyword fallback when no field-level match found
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  competitive:   ['competitor', 'rival', 'competition', 'market entry', 'competitive threat', 'disrupt'],
  market:        ['market', 'industry', 'sector', 'demand', 'consumer', 'economic'],
  financial:     ['financial', 'earnings', 'revenue', 'profit', 'fiscal', 'stock', 'shares'],
  regulatory:    ['regulatory', 'compliance', 'enforcement', 'SEC', 'FTC', 'DOJ', 'government', 'legislation'],
  supplychain:   ['supply chain', 'supplier', 'logistics', 'inventory', 'manufacturing', 'operations'],
  talent:        ['talent', 'executive', 'employee', 'workforce', 'HR', 'hiring', 'layoff'],
  technology:    ['technology', 'AI', 'digital', 'platform', 'software', 'cyber', 'data'],
  cyber:         ['cyber', 'breach', 'hack', 'ransomware', 'security', 'data leak', 'vulnerability'],
  media:         ['media', 'press', 'news', 'coverage', 'publicity', 'PR', 'brand'],
  customer:      ['customer', 'consumer', 'client', 'user', 'buyer', 'market'],
  geopolitical:  ['geopolitical', 'trade', 'sanction', 'tariff', 'government', 'political', 'war', 'conflict'],
  economic:      ['economic', 'GDP', 'inflation', 'recession', 'interest rate', 'federal reserve'],
  partnership:   ['partnership', 'alliance', 'joint venture', 'collaboration', 'strategic partner'],
  execution:     ['execution', 'operational', 'performance', 'delivery', 'project', 'initiative'],
  behavior:      ['behavior', 'trend', 'pattern', 'consumer behavior', 'shift', 'change'],
  innovation:    ['innovation', 'R&D', 'patent', 'breakthrough', 'new technology', 'invention'],
  esg:           ['ESG', 'sustainability', 'climate', 'carbon', 'emissions', 'diversity', 'governance'],
};

// Directional operator boosters — signal text mentions movement matching the operator
const OPERATOR_SIGNAL_WORDS: Record<string, string[]> = {
  spike:  ['surged', 'spiked', 'jumped', 'soared', 'increased sharply', 'rose dramatically', 'rapid increase', 'dramatic rise'],
  drop:   ['fell', 'dropped', 'plunged', 'declined', 'decreased sharply', 'tumbled', 'slumped', 'steep decline'],
  gt:     ['exceeded', 'surpassed', 'above', 'more than', 'over', 'higher than', 'beats', 'outpaced'],
  lt:     ['below', 'under', 'less than', 'fell short', 'missed', 'lower than', 'beneath'],
  gte:    ['at least', 'reached', 'hit', 'surpassed', 'exceeded', 'met or exceeded'],
  lte:    ['no more than', 'at most', 'capped at', 'limited to', 'within', 'not exceeding'],
  change: ['changed', 'shifted', 'altered', 'new', 'update', 'announced', 'reported'],
  trend:  ['trending', 'pattern', 'consistent', 'ongoing', 'sustained', 'continued'],
};

// ─── Load configured triggers for org ────────────────────────────────────────

// Simple UUID format check — avoids DB errors from non-UUID org IDs like "system"
function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function loadConfiguredTriggers(organizationId: string): Promise<ConfiguredTrigger[]> {
  const configured: ConfiguredTrigger[] = [];

  // Non-UUID org IDs (e.g. "system" demo org) have no configured triggers
  if (!isValidUuid(organizationId)) {
    return configured;
  }

  try {
    // 1. Load executiveTriggers (seeded from 221 intelligence signals)
    const execTriggers = await db
      .select()
      .from(executiveTriggers)
      .where(and(
        eq(executiveTriggers.organizationId, organizationId as any),
        eq(executiveTriggers.isActive, true)
      ));

    for (const t of execTriggers) {
      const playbooks = Array.isArray(t.recommendedPlaybooks)
        ? (t.recommendedPlaybooks as string[])
        : [];
      configured.push({
        id: t.id,
        name: t.name,
        category: t.category || 'general',
        triggerType: t.triggerType,
        conditions: (t.conditions as TriggerCondition | TriggerCondition[]) || { field: '', operator: 'change', value: 'any' },
        alertThreshold: t.alertThreshold || 'yellow',
        severity: t.severity || 'medium',
        recommendedPlaybooks: playbooks,
        isActive: t.isActive ?? true,
        source: 'executive',
      });
    }

    // 2. Load custom triggers created by the org
    const custom = await db
      .select()
      .from(customTriggers)
      .where(and(
        eq(customTriggers.organizationId, organizationId as any),
        eq(customTriggers.isActive, true)
      ));

    for (const t of custom) {
      const playbooks = Array.isArray(t.recommendedPlaybooks)
        ? (t.recommendedPlaybooks as string[])
        : [];
      configured.push({
        id: t.id,
        name: t.name,
        category: t.category || 'general',
        triggerType: t.signalType || 'event',
        conditions: {
          field: t.conditionField,
          operator: t.conditionOperator,
          value: t.conditionValue ? Number(t.conditionValue) : 'any',
        },
        alertThreshold: t.alertThreshold || 'yellow',
        severity: t.severity || 'medium',
        recommendedPlaybooks: playbooks,
        isActive: t.isActive ?? true,
        source: 'custom',
      });
    }
  } catch (err) {
    console.error('[TriggerEvaluationEngine] Error loading configured triggers:', err);
  }

  return configured;
}

// ─── Evaluate a single signal against a single configured trigger ─────────────
//
// AND LOGIC GATE: Every configured condition must have at least a field-level
// keyword match in the signal text. If any condition has zero field-level
// evidence, the trigger does NOT fire — regardless of the total score.
// This prevents a single strong keyword from masking unmet conditions.

interface ScoringResult {
  score: number;
  matchedTerms: string[];
  conditionsMet: number;
  totalConditions: number;
  dataPoints: string[];           // human-readable labels for each condition hit
  allConditionsMet: boolean;      // the AND gate — all conditions must pass
}

function scoreSignalAgainstConfiguredTrigger(
  signal: AnalyzedSignal,
  trigger: ConfiguredTrigger
): ScoringResult {
  const text = (signal.description + ' ' + signal.signalType + ' ' + signal.category).toLowerCase();
  const matchedTerms: string[] = [];
  const dataPoints: string[] = [];
  let score = 0;

  // Normalize conditions into an array for uniform processing
  const conditions = Array.isArray(trigger.conditions)
    ? trigger.conditions
    : [trigger.conditions];

  let conditionsMet = 0;

  for (const condition of conditions) {
    const { field, operator, value } = condition;
    let conditionHit = false;

    // ── 1. Field-level keyword match (primary evidence source) ────────────────
    const fieldWords = FIELD_KEYWORDS[field] || [];
    const fieldMatches = fieldWords.filter(kw => text.includes(kw.toLowerCase()));
    if (fieldMatches.length > 0) {
      score += 30 + Math.min(fieldMatches.length * 5, 20);
      matchedTerms.push(...fieldMatches);
      conditionHit = true;

      // Human-readable data point label
      const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      dataPoints.push(`${fieldLabel}: matched "${fieldMatches.slice(0, 2).join('", "')}"`);
    }

    // ── 2. Operator-specific directional evidence (only if field hit) ─────────
    if (conditionHit) {
      const opWords = OPERATOR_SIGNAL_WORDS[operator] || [];
      const opMatches = opWords.filter(kw => text.includes(kw.toLowerCase()));
      if (opMatches.length > 0) {
        score += 8 + opMatches.length * 3;
        matchedTerms.push(...opMatches);
        dataPoints[dataPoints.length - 1] += ` (${operator}: "${opMatches[0]}")`;
      }

      // ── 3. Explicit condition value in text ───────────────────────────────
      if (typeof value === 'string' && value !== 'any' && text.includes(value.toLowerCase())) {
        score += 6;
        matchedTerms.push(value as string);
      }

      conditionsMet++;
    }
    // NOTE: No category-level fallback — that was the source of false positives.
    // A condition is either met by its specific field keywords or it is not met.
  }

  // ── AND GATE: all conditions must be met ──────────────────────────────────
  const allConditionsMet = conditionsMet === conditions.length;

  // ── Signal impact contributes only when core conditions are met ───────────
  if (allConditionsMet) {
    if (signal.impact === 'critical') score += 12;
    else if (signal.impact === 'high') score += 7;
    else if (signal.impact === 'medium') score += 3;

    score += Math.max(0, (signal.confidence - 50) * 0.25);

    if (signal.source.includes('SEC') || signal.source.includes('Reuters') || signal.source.includes('Bloomberg')) {
      score += 8;
    }
  }

  return {
    score: allConditionsMet ? Math.min(Math.round(score), 97) : 0,
    matchedTerms: Array.from(new Set(matchedTerms)),
    conditionsMet,
    totalConditions: conditions.length,
    dataPoints,
    allConditionsMet,
  };
}

// ─── Evaluate a signal against a composite trigger group ─────────────────────
//
// A composite trigger group has multiple data points, each with its own threshold.
// The group fires when:
//   1. ALL mandatory data points find evidence in the signal.
//   2. Total valid data points (mandatory + optional) >= minimumRequired.
//
// Each data point is matched using:
//   - Keywords extracted from the data point's name (substantive words only)
//   - Category-level keywords from FIELD_KEYWORDS (domain signals)
//   - Operator-directional words from OPERATOR_SIGNAL_WORDS
//
function scoreSignalAgainstTriggerGroup(
  signal: AnalyzedSignal,
  groupConditions: TriggerGroupConditions
): ScoringResult {
  const text = (signal.description + ' ' + signal.signalType + ' ' + signal.category).toLowerCase();
  const matchedTerms: string[] = [];
  const dataPointLabels: string[] = [];

  const { minimumRequired, dataPoints } = groupConditions;

  let validMandatory = 0;
  let validOptional = 0;
  const mandatoryTotal = dataPoints.filter(p => p.mandatory).length;

  for (const dp of dataPoints) {
    // ── Build keyword evidence from the data point ─────────────────────────
    // 1. Name-derived keywords: split name into substantive words (length > 3)
    const nameKeywords = dp.name
      .toLowerCase()
      .split(/[\s,\/\-\(\)]+/)
      .filter(w => w.length > 3 && !['that', 'with', 'from', 'this', 'have', 'been', 'will'].includes(w));

    // 2. Category-level field keywords (reuse existing FIELD_KEYWORDS map)
    const catKeywords = (FIELD_KEYWORDS[dp.category] || FIELD_KEYWORDS[dp.id] || []).map((k: string) => k.toLowerCase());

    // 3. Operator directional words
    const opWords = (OPERATOR_SIGNAL_WORDS[dp.operator] || []).map((k: string) => k.toLowerCase());

    // ── Match against signal text ──────────────────────────────────────────
    const nameMatches = nameKeywords.filter(kw => text.includes(kw));
    const catMatches  = catKeywords.filter(kw => text.includes(kw));
    const opMatches   = opWords.filter(kw => text.includes(kw));

    // A data point is "valid" if:
    //  - at least 1 name keyword matches, OR
    //  - at least 2 category keywords match (domain-level evidence)
    const isValid = nameMatches.length >= 1 || catMatches.length >= 2;

    if (isValid) {
      const evidence = [...nameMatches.slice(0, 2), ...catMatches.slice(0, 1), ...opMatches.slice(0, 1)];
      matchedTerms.push(...evidence);
      dataPointLabels.push(
        `${dp.name}${dp.mandatory ? ' [MANDATORY]' : ''}: "${evidence.slice(0, 2).join('", "')}"`
      );
      if (dp.mandatory) validMandatory++;
      else validOptional++;
    }
  }

  // ── Gate checks ───────────────────────────────────────────────────────────
  const allMandatoryMet   = validMandatory === mandatoryTotal;
  const totalValid        = validMandatory + validOptional;
  const groupThresholdMet = totalValid >= minimumRequired;
  const allConditionsMet  = allMandatoryMet && groupThresholdMet;

  // ── Confidence score ──────────────────────────────────────────────────────
  let score = 0;
  if (allConditionsMet) {
    // Ratio of matched data points drives the base score (45–80)
    const matchRatio = totalValid / Math.max(dataPoints.length, 1);
    score = 45 + Math.round(matchRatio * 35);

    // Signal quality boosts (same as standard path)
    if (signal.impact === 'critical')    score += 12;
    else if (signal.impact === 'high')   score += 7;
    else if (signal.impact === 'medium') score += 3;

    score += Math.max(0, (signal.confidence - 50) * 0.25);

    if (
      signal.source.includes('SEC')    ||
      signal.source.includes('Reuters') ||
      signal.source.includes('Bloomberg')
    ) score += 8;

    score = Math.min(Math.round(score), 95);
  }

  return {
    score,
    matchedTerms: Array.from(new Set(matchedTerms)),
    conditionsMet:    totalValid,
    totalConditions:  minimumRequired,
    dataPoints:       dataPointLabels,
    allConditionsMet,
  };
}

// ─── Build a DetectedTrigger from a configured trigger + score ────────────────

function buildDetection(
  trigger: ConfiguredTrigger,
  signal: AnalyzedSignal,
  result: ScoringResult
): DetectedTrigger {
  // Map the org's configured recommended playbooks to the detection
  // First playbook = primary AI recommendation (what was staged for this exact situation)
  // Remaining = alternates the approver can choose from
  const [primaryPlaybook, ...alternates] = trigger.recommendedPlaybooks;

  return {
    triggerName: trigger.name,
    triggerDomain: categoryToDomain(trigger.category),
    confidenceScore: result.score,
    recommendedPlaybook: primaryPlaybook || 'Playbook Not Configured',
    alternatePlaybooks: alternates.slice(0, 2),
    matchedKeywords: result.matchedTerms,
    conditionsMet: result.conditionsMet,
    totalConditions: result.totalConditions,
    dataPoints: result.dataPoints,
    engine: 'configured',
  };
}

// ─── Map signal category to a human-readable domain ──────────────────────────

function categoryToDomain(category: string): string {
  const map: Record<string, string> = {
    competitive:   'Market Dynamics',
    market:        'Market Dynamics',
    financial:     'Financial Strategy',
    regulatory:    'Regulatory & Compliance',
    supplychain:   'Supply Chain & Operations',
    talent:        'Talent & Leadership',
    technology:    'Technology & Innovation',
    cyber:         'Technology & Innovation',
    media:         'Brand & Reputation',
    customer:      'Brand & Reputation',
    geopolitical:  'Geopolitical',
    economic:      'Financial Strategy',
    partnership:   'Market Dynamics',
    execution:     'Operational Excellence',
    behavior:      'Market Dynamics',
    innovation:    'Technology & Innovation',
    esg:           'ESG & Sustainability',
    general:       'Strategic Intelligence',
  };
  return map[category.toLowerCase()] || 'Strategic Intelligence';
}

// ─── Primary export: evaluate signals against org-configured triggers ─────────

/**
 * Evaluates an array of analyzed signals against the organization's configured
 * triggers. Only fires a detection when the signal meets the trigger's own
 * configured threshold — not a global bar.
 *
 * Returns detections sorted by confidence, top 2 per signal to avoid fatigue.
 * Returns null if the org has no configured triggers (caller falls back to defaults).
 */
export async function evaluateSignalsWithOrgTriggers(
  signals: AnalyzedSignal[],
  organizationId: string
): Promise<DetectedTrigger[] | null> {
  const configuredTriggers = await loadConfiguredTriggers(organizationId);

  // No configured triggers → tell caller to use default TRIGGER_PATTERNS
  if (configuredTriggers.length === 0) {
    console.log(`[TriggerEvaluationEngine] Org ${organizationId} has no configured triggers — using default patterns`);
    return null;
  }

  console.log(`[TriggerEvaluationEngine] Evaluating ${signals.length} signal(s) against ${configuredTriggers.length} configured trigger(s) for org ${organizationId}`);

  const allDetections: DetectedTrigger[] = [];

  for (const signal of signals) {
    const signalDetections: DetectedTrigger[] = [];

    for (const trigger of configuredTriggers) {
      // ── Route: composite trigger group vs. standard condition ────────────
      const rawConditions = trigger.conditions as any;
      const isCompositeGroup =
        rawConditions &&
        typeof rawConditions === 'object' &&
        !Array.isArray(rawConditions) &&
        rawConditions.type === 'trigger_group' &&
        Array.isArray(rawConditions.dataPoints) &&
        rawConditions.dataPoints.length > 0;

      let result: ScoringResult;

      if (isCompositeGroup) {
        // ── Composite trigger group path (DETECT tab) ─────────────────────
        result = scoreSignalAgainstTriggerGroup(signal, rawConditions as TriggerGroupConditions);

        if (result.score === 0) {
          if (result.conditionsMet > 0) {
            console.log(
              `[TriggerEvaluationEngine] ✗ "${trigger.name}" — group threshold not met: ` +
              `${result.conditionsMet}/${result.totalConditions} data points valid`
            );
          }
          continue;
        }

        // Composite groups use a fixed 60% confidence floor (customer-designed triggers
        // get more benefit of the doubt than the global keyword patterns)
        const requiredConfidence = 60;
        if (result.score >= requiredConfidence) {
          const detection = buildDetection(trigger, signal, result);
          signalDetections.push(detection);
          console.log(
            `[TriggerEvaluationEngine] ✓ COMPOSITE "${trigger.name}" fired at ${result.score}% — ` +
            `${result.conditionsMet}/${result.totalConditions} required data points valid — ` +
            `data points: [${result.dataPoints.join(' | ')}]`
          );
        }
      } else {
        // ── Standard condition path (field/operator/value) ────────────────
        result = scoreSignalAgainstConfiguredTrigger(signal, trigger);

        if (result.score === 0) {
          if (result.conditionsMet > 0 && result.conditionsMet < result.totalConditions) {
            console.log(
              `[TriggerEvaluationEngine] ✗ "${trigger.name}" — AND gate failed: ` +
              `${result.conditionsMet}/${result.totalConditions} conditions met — will not fire`
            );
          }
          continue;
        }

        const requiredConfidence = THRESHOLD_CONFIDENCE_FLOOR[trigger.alertThreshold] ?? 72;

        if (result.score >= requiredConfidence) {
          const detection = buildDetection(trigger, signal, result);
          signalDetections.push(detection);
          console.log(
            `[TriggerEvaluationEngine] ✓ "${trigger.name}" fired at ${result.score}% ` +
            `(threshold: ${requiredConfidence}% for "${trigger.alertThreshold}") — ` +
            `ALL ${result.totalConditions} condition(s) met — ` +
            `data points: [${result.dataPoints.join(' | ')}]`
          );
        }
      }
    }

    // Top 2 detections per signal (avoid alert fatigue)
    const top2 = signalDetections
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, 2);

    allDetections.push(...top2);
  }

  return allDetections;
}

// ─── Diagnostic helper ────────────────────────────────────────────────────────

/**
 * Returns a summary of configured triggers for an org — used for admin/debug
 * views to show what will and won't fire.
 */
export async function getOrgTriggerSummary(organizationId: string): Promise<{
  total: number;
  byAlertLevel: Record<string, number>;
  byCategory: Record<string, number>;
  triggerNames: string[];
}> {
  const triggers = await loadConfiguredTriggers(organizationId);

  const byAlertLevel: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const t of triggers) {
    byAlertLevel[t.alertThreshold] = (byAlertLevel[t.alertThreshold] || 0) + 1;
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  }

  return {
    total: triggers.length,
    byAlertLevel,
    byCategory,
    triggerNames: triggers.map(t => t.name),
  };
}
