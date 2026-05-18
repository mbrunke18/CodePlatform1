/**
 * TriggerTaxonomyService — Phase 4: Trigger Taxonomy Intelligence
 * 
 * Recommends trigger portfolios based on organizational context.
 * Tells the organization which triggers they should be monitoring based on
 * their industry, size, and current coverage gaps.
 * 
 * This closes the readiness loop: Readiness OS doesn't just monitor — it tells
 * the organization when their monitoring architecture has gaps that leave them
 * blind to categories of risk they should have staged responses for.
 */

import { db } from '../db.js';
import { eq } from 'drizzle-orm';
import { executiveTriggers } from '@shared/schema';

// ── Domain risk profiles for startup to Fortune 500 organizations ──────────────────────
// Priority 1-10 where 10 = highest strategic exposure for most enterprises
const DOMAIN_BASE_PROFILES: Record<string, {
  priority: number;
  triggers: string[];
  rationale: string;
}> = {
  'Technology & Security': {
    priority: 10,
    triggers: ['Cybersecurity Breach Signal', 'AI Disruption Signal'],
    rationale: 'Cyber events are the fastest-moving trigger category. Average dwell time before detection is 197 days. Every startup to Fortune 500 organization is a target.',
  },
  'Regulatory & Compliance': {
    priority: 9,
    triggers: ['Regulatory Enforcement Action', 'Legislation Change', '8-K Material Event Filing'],
    rationale: 'Regulatory enforcement actions carry mandatory 8-K disclosure timelines. Non-compliance is not a risk to manage — it is a certainty to prevent.',
  },
  'Financial': {
    priority: 9,
    triggers: ['Financial Distress Signal', 'Earnings Surprise'],
    rationale: 'Financial signals move markets within minutes. Investor communications protocols must be staged before quarterly results, not after.',
  },
  'Market Dynamics': {
    priority: 8,
    triggers: ['Competitive Market Entry', 'M&A Activity Detected', 'Market Valuation Shift'],
    rationale: 'Competitor moves and M&A activity reshape market position within weeks. Staged responses reduce board alignment time from 30 days to 12 minutes.',
  },
  'Brand & Reputation': {
    priority: 8,
    triggers: ['Reputational Crisis Signal', 'Executive Leadership Event'],
    rationale: 'Reputational events compound without rapid response. Social media cycles measure in hours, not days.',
  },
  'Supply Chain & Operations': {
    priority: 7,
    triggers: ['Supply Chain Disruption', 'Operational Crisis'],
    rationale: 'Supply chain concentration risk is undermonitored in most enterprises. A single supplier failure can cascade to revenue impact within 72 hours.',
  },
  'Geopolitical': {
    priority: 7,
    triggers: ['Geopolitical Risk Signal'],
    rationale: 'Geopolitical events move faster than traditional risk committee cycles. Organizations with staged responses avoid reactive improvisation.',
  },
  'ESG & Sustainability': {
    priority: 6,
    triggers: ['ESG / Climate Event'],
    rationale: 'ESG triggers are increasing in frequency and regulatory weight. Board-level ESG exposure requires pre-staged investor communication protocols.',
  },
};

// ── Industry-specific priority adjustments ───────────────────────────────────
// Applied additively on top of base profile priorities
const INDUSTRY_ADJUSTMENTS: Record<string, Record<string, number>> = {
  'Technology':       { 'Technology & Security': 3, 'Market Dynamics': 2, 'Regulatory & Compliance': 1 },
  'Financial Services': { 'Regulatory & Compliance': 3, 'Financial': 3, 'Technology & Security': 2 },
  'Healthcare':       { 'Regulatory & Compliance': 3, 'Supply Chain & Operations': 2, 'Brand & Reputation': 1 },
  'Manufacturing':    { 'Supply Chain & Operations': 3, 'Geopolitical': 2, 'Market Dynamics': 1 },
  'Retail':           { 'Supply Chain & Operations': 2, 'Brand & Reputation': 2, 'Financial': 1 },
  'Energy':           { 'Regulatory & Compliance': 2, 'Geopolitical': 3, 'ESG & Sustainability': 2 },
  'Pharmaceuticals':  { 'Regulatory & Compliance': 3, 'Supply Chain & Operations': 2, 'Brand & Reputation': 2 },
  'Media':            { 'Brand & Reputation': 3, 'Regulatory & Compliance': 1, 'Market Dynamics': 2 },
};

export interface TriggerRecommendation {
  domain: string;
  priority: number;
  triggers: string[];
  rationale: string;
  gapStatus: 'not-configured' | 'partially-configured' | 'fully-configured';
  configuredCount: number;
  totalCount: number;
  missingTriggers: string[];
}

export interface TaxonomyPortfolio {
  recommendations: TriggerRecommendation[];
  coverageScore: number; // 0-100
  criticalGaps: string[]; // Domains with zero coverage
  totalConfigured: number;
  totalRecommended: number;
  industry: string;
}

/**
 * getTriggerTaxonomyRecommendations
 * 
 * Analyzes the organization's current trigger configuration against
 * the recommended portfolio for their industry context.
 * Returns ranked recommendations with gap status and rationale.
 */
export async function getTriggerTaxonomyRecommendations(
  organizationId: string,
  industry?: string,
  orgSize?: string
): Promise<TaxonomyPortfolio> {
  try {
    // Get org's currently configured triggers
    const configured = await db
      .select()
      .from(executiveTriggers)
      .where(eq(executiveTriggers.organizationId, organizationId as any));

    const configuredNames = new Set(configured.map((t: any) => t.name || t.triggerName));

    const recommendations: TriggerRecommendation[] = [];
    let totalConfigured = 0;
    let totalRecommended = 0;
    const criticalGaps: string[] = [];

    for (const [domain, profile] of Object.entries(DOMAIN_BASE_PROFILES)) {
      let priority = profile.priority;

      // Apply industry adjustment if available
      if (industry && INDUSTRY_ADJUSTMENTS[industry]?.[domain]) {
        priority = Math.min(10, priority + INDUSTRY_ADJUSTMENTS[industry][domain]);
      }

      // Assess gap status
      const domainTriggers = configured.filter(
        (t: any) => (t.category || t.domain) === domain
      );
      const configuredInDomain = domainTriggers.length;
      const totalInDomain = profile.triggers.length;
      const missingTriggers = profile.triggers.filter(t => !configuredNames.has(t));

      let gapStatus: TriggerRecommendation['gapStatus'] = 'not-configured';
      if (configuredInDomain >= totalInDomain) {
        gapStatus = 'fully-configured';
      } else if (configuredInDomain > 0) {
        gapStatus = 'partially-configured';
      } else {
        criticalGaps.push(domain);
      }

      totalConfigured += configuredInDomain;
      totalRecommended += totalInDomain;

      recommendations.push({
        domain,
        priority,
        triggers: profile.triggers,
        rationale: profile.rationale,
        gapStatus,
        configuredCount: configuredInDomain,
        totalCount: totalInDomain,
        missingTriggers,
      });
    }

    // Sort: highest priority first, then by gap severity
    const gapOrder = { 'not-configured': 0, 'partially-configured': 1, 'fully-configured': 2 };
    recommendations.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return gapOrder[a.gapStatus] - gapOrder[b.gapStatus];
    });

    // Coverage score: 0-100
    const coverageScore = totalRecommended > 0
      ? Math.round((totalConfigured / totalRecommended) * 100)
      : 0;

    return {
      recommendations,
      coverageScore,
      criticalGaps,
      totalConfigured,
      totalRecommended,
      industry: industry || 'General Enterprise',
    };
  } catch (err) {
    console.error('[TriggerTaxonomy] getTriggerTaxonomyRecommendations error:', err);
    return {
      recommendations: [],
      coverageScore: 0,
      criticalGaps: [],
      totalConfigured: 0,
      totalRecommended: 0,
      industry: industry || 'General Enterprise',
    };
  }
}
