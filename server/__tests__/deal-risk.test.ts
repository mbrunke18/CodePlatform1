import { describe, it, expect } from 'vitest';

/**
 * Deal Risk Scoring — mirrors MockSalesforceService.calculateDealRiskScore
 * and detectTriggers logic from server/services/MockSalesforceService.ts
 */

interface OpportunityData {
  probability: number;
  contractCompressionRisk: number;
  engagementScore: number;
  budgetApprovalStatus: string;
  competitor?: string | null;
  amount?: number;
  lastActivityDaysAgo?: number;
  keyContactEngagement?: number;
}

function calculateDealRiskScore(opp: OpportunityData): number {
  let riskScore = 0;
  const probabilityRisk = Math.max(0, 100 - opp.probability) * 0.3;
  riskScore += probabilityRisk;
  riskScore += opp.contractCompressionRisk * 25;
  const engagementRisk = (1 - opp.engagementScore / 100) * 25;
  riskScore += engagementRisk;
  if (opp.budgetApprovalStatus === 'In Review') riskScore += 8;
  if (opp.budgetApprovalStatus === 'Pending') riskScore += 5;
  if (opp.competitor) riskScore += 10;
  return Math.min(100, riskScore);
}

function detectTriggers(opp: OpportunityData): string[] {
  const triggers: string[] = [];
  const riskScore = calculateDealRiskScore(opp);
  if (riskScore >= 70) triggers.push('HIGH_RISK_SCORE');
  if (opp.contractCompressionRisk > 0.7) triggers.push('CONTRACT_COMPRESSION');
  if ((opp.keyContactEngagement ?? 1) < 0.5) triggers.push('LOW_ENGAGEMENT');
  if (opp.budgetApprovalStatus === 'In Review' && (opp.amount ?? 0) > 4_000_000)
    triggers.push('LARGE_DEAL_BUDGET_RISK');
  if ((opp.lastActivityDaysAgo ?? 0) > 3) triggers.push('STALLED_DEAL');
  if (opp.competitor && opp.probability < 80) triggers.push('COMPETITOR_THREAT');
  return triggers;
}

const lowRiskDeal: OpportunityData = {
  probability: 95,
  contractCompressionRisk: 0.1,
  engagementScore: 90,
  budgetApprovalStatus: 'Approved',
  competitor: null,
};

const highRiskDeal: OpportunityData = {
  probability: 40,
  contractCompressionRisk: 0.9,
  engagementScore: 20,
  budgetApprovalStatus: 'In Review',
  competitor: 'Competitor Corp',
  amount: 5_000_000,
  lastActivityDaysAgo: 7,
  keyContactEngagement: 0.3,
};

describe('calculateDealRiskScore', () => {
  it('returns low score for a healthy deal', () => {
    const score = calculateDealRiskScore(lowRiskDeal);
    expect(score).toBeLessThan(20);
  });

  it('returns high score for a distressed deal', () => {
    const score = calculateDealRiskScore(highRiskDeal);
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it('caps score at 100 regardless of stacked risk factors', () => {
    const worstCase: OpportunityData = {
      probability: 0,
      contractCompressionRisk: 10,
      engagementScore: 0,
      budgetApprovalStatus: 'In Review',
      competitor: 'Competitor',
    };
    expect(calculateDealRiskScore(worstCase)).toBe(100);
  });

  it('adds 8 points for "In Review" budget status', () => {
    const base: OpportunityData = {
      probability: 80,
      contractCompressionRisk: 0,
      engagementScore: 100,
      budgetApprovalStatus: 'Approved',
    };
    const withReview: OpportunityData = { ...base, budgetApprovalStatus: 'In Review' };
    expect(calculateDealRiskScore(withReview) - calculateDealRiskScore(base)).toBe(8);
  });

  it('adds 5 points for "Pending" budget status', () => {
    const base: OpportunityData = {
      probability: 80,
      contractCompressionRisk: 0,
      engagementScore: 100,
      budgetApprovalStatus: 'Approved',
    };
    const withPending: OpportunityData = { ...base, budgetApprovalStatus: 'Pending' };
    expect(calculateDealRiskScore(withPending) - calculateDealRiskScore(base)).toBe(5);
  });

  it('adds 10 points for a known competitor', () => {
    const base: OpportunityData = {
      probability: 80,
      contractCompressionRisk: 0,
      engagementScore: 100,
      budgetApprovalStatus: 'Approved',
    };
    const withCompetitor: OpportunityData = { ...base, competitor: 'Rival Inc' };
    expect(calculateDealRiskScore(withCompetitor) - calculateDealRiskScore(base)).toBe(10);
  });

  it('adds 0 points when no competitor', () => {
    const base: OpportunityData = {
      probability: 80,
      contractCompressionRisk: 0,
      engagementScore: 100,
      budgetApprovalStatus: 'Approved',
    };
    const withoutCompetitor: OpportunityData = { ...base, competitor: null };
    const withoutCompetitor2: OpportunityData = { ...base };
    expect(calculateDealRiskScore(withoutCompetitor)).toBe(calculateDealRiskScore(withoutCompetitor2));
  });

  it('computes probability risk as (100 - probability) × 0.3', () => {
    const deal: OpportunityData = {
      probability: 70,
      contractCompressionRisk: 0,
      engagementScore: 100,
      budgetApprovalStatus: 'Approved',
    };
    const expected = (100 - 70) * 0.3;
    expect(calculateDealRiskScore(deal)).toBeCloseTo(expected, 5);
  });

  it('returns 0 for a perfect deal with no risk factors', () => {
    const perfect: OpportunityData = {
      probability: 100,
      contractCompressionRisk: 0,
      engagementScore: 100,
      budgetApprovalStatus: 'Approved',
      competitor: null,
    };
    expect(calculateDealRiskScore(perfect)).toBe(0);
  });
});

describe('detectTriggers', () => {
  it('returns empty array for a healthy low-risk deal', () => {
    const triggers = detectTriggers(lowRiskDeal);
    expect(triggers).toEqual([]);
  });

  it('fires HIGH_RISK_SCORE when risk score ≥ 70', () => {
    const triggers = detectTriggers(highRiskDeal);
    expect(triggers).toContain('HIGH_RISK_SCORE');
  });

  it('fires CONTRACT_COMPRESSION when compression risk > 0.7', () => {
    const triggers = detectTriggers(highRiskDeal);
    expect(triggers).toContain('CONTRACT_COMPRESSION');
  });

  it('fires LOW_ENGAGEMENT when key contact engagement < 0.5', () => {
    const triggers = detectTriggers(highRiskDeal);
    expect(triggers).toContain('LOW_ENGAGEMENT');
  });

  it('fires LARGE_DEAL_BUDGET_RISK for large deal under review', () => {
    const triggers = detectTriggers(highRiskDeal);
    expect(triggers).toContain('LARGE_DEAL_BUDGET_RISK');
  });

  it('does NOT fire LARGE_DEAL_BUDGET_RISK for small deal under review', () => {
    const smallDeal: OpportunityData = {
      ...highRiskDeal,
      amount: 1_000_000,
    };
    const triggers = detectTriggers(smallDeal);
    expect(triggers).not.toContain('LARGE_DEAL_BUDGET_RISK');
  });

  it('fires STALLED_DEAL when last activity was more than 3 days ago', () => {
    const triggers = detectTriggers(highRiskDeal);
    expect(triggers).toContain('STALLED_DEAL');
  });

  it('does NOT fire STALLED_DEAL when activity is within 3 days', () => {
    const activeDeal: OpportunityData = { ...highRiskDeal, lastActivityDaysAgo: 2 };
    const triggers = detectTriggers(activeDeal);
    expect(triggers).not.toContain('STALLED_DEAL');
  });

  it('fires COMPETITOR_THREAT when competitor exists and probability < 80', () => {
    const triggers = detectTriggers(highRiskDeal);
    expect(triggers).toContain('COMPETITOR_THREAT');
  });

  it('does NOT fire COMPETITOR_THREAT when probability ≥ 80', () => {
    const confidentDeal: OpportunityData = { ...highRiskDeal, probability: 85 };
    const triggers = detectTriggers(confidentDeal);
    expect(triggers).not.toContain('COMPETITOR_THREAT');
  });

  it('can fire multiple triggers simultaneously on a distressed deal', () => {
    const triggers = detectTriggers(highRiskDeal);
    expect(triggers.length).toBeGreaterThan(2);
  });
});
