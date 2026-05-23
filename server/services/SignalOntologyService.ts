/**
 * SignalOntologyService — Phase 5a: Rule-based Signal Ontology
 * 
 * The unassailable moat. Maps semantic relationships between signal types,
 * trigger categories, organizational contexts, and historical activation patterns.
 * 
 * Phase 5a (this implementation): manually codified signal relationships
 * visible in the 180 Readiness Protocol library. Rule-based relationship
 * map derived from existing playbook knowledge.
 * 
 * Phase 5b: Activation-enriched (after 3+ Founding Partner pilots).
 * Phase 5c: ML-based relationship learning (10+ orgs, 100+ activations).
 * 
 * The ontology seed encodes which signals co-occur for which trigger types,
 * and which signal sequences precede which activations.
 */

import { db } from '../db.js';
import { eq, and } from 'drizzle-orm';
import { signalOntologyNodes, signalOntologyEdges } from '@shared/schema';

// ── Ontology seed: 16 trigger patterns with relationship mappings ─────────────
// Mirrors TRIGGER_PATTERNS from SignalEvaluationService.ts
// Encodes: which triggers co-occur, which amplify each other, which precede others
const ONTOLOGY_SEED_PATTERNS = [
  // ── Market Dynamics ────────────────────────────────────────────────────────
  {
    name: 'Competitive Market Entry',
    domain: 'Market Dynamics',
    primaryPlaybook: 'Competitive Threat Response',
    amplifies: ['M&A Activity Detected', 'Market Valuation Shift'],
    precedes: ['Financial Distress Signal'],
    confirms: [],
  },
  {
    name: 'M&A Activity Detected',
    domain: 'Market Dynamics',
    primaryPlaybook: 'M&A Response Prepared response',
    amplifies: ['Regulatory Enforcement Action', 'Financial Distress Signal'],
    precedes: ['Executive Leadership Event', 'Market Valuation Shift'],
    confirms: [],
  },
  {
    name: 'Market Valuation Shift',
    domain: 'Market Dynamics',
    primaryPlaybook: 'Investor Communications Protocol',
    amplifies: ['Financial Distress Signal', 'Earnings Surprise'],
    precedes: ['Regulatory Enforcement Action'],
    confirms: [],
  },

  // ── Regulatory & Compliance ────────────────────────────────────────────────
  {
    name: 'Regulatory Enforcement Action',
    domain: 'Regulatory & Compliance',
    primaryPlaybook: 'Regulatory Compliance Sprint',
    amplifies: ['Reputational Crisis Signal', '8-K Material Event Filing'],
    precedes: ['Financial Distress Signal'],
    confirms: [],
  },
  {
    name: 'Legislation Change',
    domain: 'Regulatory & Compliance',
    primaryPlaybook: 'Regulatory Compliance Sprint',
    amplifies: ['Regulatory Enforcement Action', 'ESG / Climate Event'],
    precedes: [],
    confirms: [],
  },
  {
    name: '8-K Material Event Filing',
    domain: 'Regulatory & Compliance',
    primaryPlaybook: 'Regulatory Disclosure Protocol',
    amplifies: ['Regulatory Enforcement Action', 'Executive Leadership Event'],
    precedes: ['Market Valuation Shift'],
    confirms: [],
  },

  // ── Technology & Security ──────────────────────────────────────────────────
  {
    name: 'Cybersecurity Breach Signal',
    domain: 'Technology & Security',
    primaryPlaybook: 'Cybersecurity Breach Response',
    amplifies: ['Reputational Crisis Signal', '8-K Material Event Filing', 'Regulatory Enforcement Action'],
    precedes: ['Financial Distress Signal'],
    confirms: [],
  },
  {
    name: 'AI Disruption Signal',
    domain: 'Technology & Security',
    primaryPlaybook: 'Technology Disruption Response',
    amplifies: ['Competitive Market Entry', 'Market Valuation Shift'],
    precedes: [],
    confirms: [],
  },

  // ── Supply Chain & Operations ──────────────────────────────────────────────
  {
    name: 'Supply Chain Disruption',
    domain: 'Supply Chain & Operations',
    primaryPlaybook: 'Supply Chain Disruption Protocol',
    amplifies: ['Operational Crisis', 'Geopolitical Risk Signal'],
    precedes: ['Financial Distress Signal', 'Reputational Crisis Signal'],
    confirms: [],
  },
  {
    name: 'Operational Crisis',
    domain: 'Supply Chain & Operations',
    primaryPlaybook: 'Operational Crisis Response',
    amplifies: ['Reputational Crisis Signal', 'Supply Chain Disruption'],
    precedes: ['Regulatory Enforcement Action'],
    confirms: [],
  },

  // ── Brand & Reputation ─────────────────────────────────────────────────────
  {
    name: 'Reputational Crisis Signal',
    domain: 'Brand & Reputation',
    primaryPlaybook: 'Reputational Crisis Protocol',
    amplifies: ['Executive Leadership Event', 'ESG / Climate Event'],
    precedes: ['Financial Distress Signal', 'Regulatory Enforcement Action'],
    confirms: [],
  },
  {
    name: 'Executive Leadership Event',
    domain: 'Brand & Reputation',
    primaryPlaybook: 'Executive Leadership Crisis',
    amplifies: ['Reputational Crisis Signal', '8-K Material Event Filing'],
    precedes: ['Market Valuation Shift', 'M&A Activity Detected'],
    confirms: [],
  },

  // ── Financial ─────────────────────────────────────────────────────────────
  {
    name: 'Financial Distress Signal',
    domain: 'Financial',
    primaryPlaybook: 'Financial Crisis Response',
    amplifies: ['Market Valuation Shift', 'Regulatory Enforcement Action'],
    precedes: ['Reputational Crisis Signal', 'Operational Crisis'],
    confirms: [],
  },
  {
    name: 'Earnings Surprise',
    domain: 'Financial',
    primaryPlaybook: 'Investor Communications Protocol',
    amplifies: ['Market Valuation Shift', 'Financial Distress Signal'],
    precedes: [],
    confirms: [],
  },

  // ── ESG & Sustainability ───────────────────────────────────────────────────
  {
    name: 'ESG / Climate Event',
    domain: 'ESG & Sustainability',
    primaryPlaybook: 'ESG Crisis Response',
    amplifies: ['Reputational Crisis Signal', 'Regulatory Enforcement Action'],
    precedes: ['Financial Distress Signal'],
    confirms: [],
  },

  // ── Geopolitical ───────────────────────────────────────────────────────────
  {
    name: 'Geopolitical Risk Signal',
    domain: 'Geopolitical',
    primaryPlaybook: 'Geopolitical Risk Response',
    amplifies: ['Supply Chain Disruption', 'Operational Crisis'],
    precedes: ['Financial Distress Signal', 'Market Valuation Shift'],
    confirms: [],
  },
];

const UNIQUE_DOMAINS = Array.from(
  new Set(ONTOLOGY_SEED_PATTERNS.map(p => p.domain))
);

export interface OntologyStats {
  nodes: number;
  edges: number;
  seeded: boolean;
}

/**
 * seedSignalOntology — Phase 5a rule-based ontology seed
 * 
 * Idempotent: skips if already seeded.
 * Seeds domain nodes, trigger nodes, and weighted relationship edges.
 */
export async function seedSignalOntology(): Promise<OntologyStats> {
  // Check if already seeded
  const existing = await db.select().from(signalOntologyNodes).limit(1);
  if (existing.length > 0) {
    const nodeCount = await db.select().from(signalOntologyNodes);
    const edgeCount = await db.select().from(signalOntologyEdges);
    console.log('[SignalOntology] Already seeded — skipping');
    return { nodes: nodeCount.length, edges: edgeCount.length, seeded: false };
  }

  let nodeCount = 0;
  let edgeCount = 0;

  // ── Seed domain nodes ──────────────────────────────────────────────────────
  const domainNodeMap: Record<string, string> = {};
  for (const domain of UNIQUE_DOMAINS) {
    const [node] = await db
      .insert(signalOntologyNodes)
      .values({
        nodeType: 'domain',
        nodeKey: domain,
        properties: {
          label: domain,
          triggerCount: ONTOLOGY_SEED_PATTERNS.filter(p => p.domain === domain).length,
          phase: '5a-rule-based',
        },
      })
      .returning();
    domainNodeMap[domain] = node.id;
    nodeCount++;
  }

  // ── Seed trigger nodes ─────────────────────────────────────────────────────
  const triggerNodeMap: Record<string, string> = {};
  for (const pattern of ONTOLOGY_SEED_PATTERNS) {
    const [node] = await db
      .insert(signalOntologyNodes)
      .values({
        nodeType: 'trigger',
        nodeKey: pattern.name,
        properties: {
          domain: pattern.domain,
          primaryPlaybook: pattern.primaryPlaybook,
          amplifies: pattern.amplifies,
          precedes: pattern.precedes,
          phase: '5a-rule-based',
        },
      })
      .returning();
    triggerNodeMap[pattern.name] = node.id;
    nodeCount++;
  }

  // ── Seed domain → trigger edges (domain contains trigger) ─────────────────
  for (const pattern of ONTOLOGY_SEED_PATTERNS) {
    const domainId = domainNodeMap[pattern.domain];
    const triggerId = triggerNodeMap[pattern.name];
    if (!domainId || !triggerId) continue;

    await db.insert(signalOntologyEdges).values({
      fromNodeId: domainId,
      toNodeId: triggerId,
      edgeType: 'precedes',
      weight: '1.0',
      evidenceCount: 0,
    });
    edgeCount++;
  }

  // ── Seed trigger → trigger amplification edges ─────────────────────────────
  for (const pattern of ONTOLOGY_SEED_PATTERNS) {
    const fromId = triggerNodeMap[pattern.name];
    if (!fromId) continue;

    for (const related of pattern.amplifies) {
      const toId = triggerNodeMap[related];
      if (!toId) continue;
      await db.insert(signalOntologyEdges).values({
        fromNodeId: fromId,
        toNodeId: toId,
        edgeType: 'amplifies',
        weight: '0.7',
        evidenceCount: 0,
      });
      edgeCount++;
    }

    for (const preceded of pattern.precedes) {
      const toId = triggerNodeMap[preceded];
      if (!toId) continue;
      await db.insert(signalOntologyEdges).values({
        fromNodeId: fromId,
        toNodeId: toId,
        edgeType: 'precedes',
        weight: '0.8',
        evidenceCount: 0,
      });
      edgeCount++;
    }
  }

  console.log(`[SignalOntology] Phase 5a seed complete: ${nodeCount} nodes, ${edgeCount} edges`);
  return { nodes: nodeCount, edges: edgeCount, seeded: true };
}

/**
 * getOntologyGraph — returns all nodes and edges for visualization
 */
export async function getOntologyGraph(): Promise<{
  nodes: any[];
  edges: any[];
  stats: { totalNodes: number; totalEdges: number; domains: number; triggers: number };
}> {
  const nodes = await db.select().from(signalOntologyNodes);
  const edges = await db.select().from(signalOntologyEdges);

  const domains = nodes.filter(n => n.nodeType === 'domain').length;
  const triggers = nodes.filter(n => n.nodeType === 'trigger').length;

  return {
    nodes,
    edges,
    stats: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      domains,
      triggers,
    },
  };
}

/**
 * enrichOntologyEdge — called by SignalLearningService after each activation
 * to increase evidence count and adjust edge weight based on real data.
 * 
 * This is the bridge from Phase 5a (rule-based) to Phase 5b (activation-enriched).
 */
export async function enrichOntologyEdge(
  fromKey: string,
  toKey: string,
  edgeType: 'precedes' | 'amplifies' | 'contradicts' | 'confirms'
): Promise<void> {
  try {
    const [fromNode] = await db
      .select()
      .from(signalOntologyNodes)
      .where(eq(signalOntologyNodes.nodeKey, fromKey))
      .limit(1);

    const [toNode] = await db
      .select()
      .from(signalOntologyNodes)
      .where(eq(signalOntologyNodes.nodeKey, toKey))
      .limit(1);

    if (!fromNode || !toNode) return;

    const [existing] = await db
      .select()
      .from(signalOntologyEdges)
      .where(
        and(
          eq(signalOntologyEdges.fromNodeId, fromNode.id),
          eq(signalOntologyEdges.toNodeId, toNode.id),
          eq(signalOntologyEdges.edgeType, edgeType)
        )
      )
      .limit(1);

    if (existing) {
      const newCount = (existing.evidenceCount ?? 0) + 1;
      // Weight increases with evidence, capped at 2.0
      const newWeight = Math.min(2.0, Number(existing.weight ?? 1.0) + 0.05);
      await db
        .update(signalOntologyEdges)
        .set({
          evidenceCount: newCount,
          weight: String(newWeight.toFixed(2)),
          lastUpdated: new Date(),
        })
        .where(eq(signalOntologyEdges.id, existing.id));
    } else {
      await db.insert(signalOntologyEdges).values({
        fromNodeId: fromNode.id,
        toNodeId: toNode.id,
        edgeType,
        weight: '1.0',
        evidenceCount: 1,
      });
    }
  } catch {
    // Non-critical — ontology enrichment failures must not interrupt the main pipeline
  }
}

/**
 * getOntologyContext — used by signal evaluation to score a new signal
 * against the relationship map, not just individual threshold rules.
 */
export async function getOntologyContext(triggerName: string): Promise<{
  amplifiedBy: string[];
  precedes: string[];
  confirmedBy: string[];
}> {
  try {
    const [triggerNode] = await db
      .select()
      .from(signalOntologyNodes)
      .where(
        and(
          eq(signalOntologyNodes.nodeKey, triggerName),
          eq(signalOntologyNodes.nodeType, 'trigger')
        )
      )
      .limit(1);

    if (!triggerNode) return { amplifiedBy: [], precedes: [], confirmedBy: [] };

    const edges = await db
      .select()
      .from(signalOntologyEdges)
      .where(eq(signalOntologyEdges.fromNodeId, triggerNode.id));

    const amplifiedBy: string[] = [];
    const precedesList: string[] = [];
    const confirmedBy: string[] = [];

    for (const edge of edges) {
      const [toNode] = await db
        .select()
        .from(signalOntologyNodes)
        .where(eq(signalOntologyNodes.id, edge.toNodeId!))
        .limit(1);

      if (!toNode) continue;
      if (edge.edgeType === 'amplifies') amplifiedBy.push(toNode.nodeKey);
      if (edge.edgeType === 'precedes') precedesList.push(toNode.nodeKey);
      if (edge.edgeType === 'confirms') confirmedBy.push(toNode.nodeKey);
    }

    return { amplifiedBy, precedes: precedesList, confirmedBy };
  } catch {
    return { amplifiedBy: [], precedes: [], confirmedBy: [] };
  }
}
