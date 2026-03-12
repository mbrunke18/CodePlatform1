export interface MockDeal {
  id: string;
  name: string;
  accountName: string;
  amount: number;
  stage: string;
  probability: number;
  closeDate: string;
  competitor?: string;
  riskIndicators: {
    probability: number;
    closeDateCompression: number;
    engagementDrop: number;
    budgetReview: boolean;
  };
  lastModified: Date;
}

export const MOCK_DEALS: MockDeal[] = [
  {
    id: 'opp_001',
    name: 'Acme Corp Digital Transformation',
    accountName: 'Acme Corp',
    amount: 5000000,
    stage: 'Negotiation',
    probability: 75,
    closeDate: '2026-02-15',
    competitor: 'Competitor A',
    riskIndicators: {
      probability: 30,
      closeDateCompression: 21,
      engagementDrop: 45,
      budgetReview: true,
    },
    lastModified: new Date(),
  },
  {
    id: 'opp_002',
    name: 'TechCorp Analytics Platform',
    accountName: 'TechCorp Inc',
    amount: 3200000,
    stage: 'Proposal',
    probability: 85,
    closeDate: '2026-02-28',
    riskIndicators: {
      probability: 5,
      closeDateCompression: 0,
      engagementDrop: 10,
      budgetReview: false,
    },
    lastModified: new Date(),
  },
  {
    id: 'opp_003',
    name: 'Global Finance Risk Management',
    accountName: 'Global Finance Ltd',
    amount: 4100000,
    stage: 'Discovery',
    probability: 65,
    closeDate: '2026-03-10',
    riskIndicators: {
      probability: 15,
      closeDateCompression: 7,
      engagementDrop: 20,
      budgetReview: true,
    },
    lastModified: new Date(),
  },
  {
    id: 'opp_004',
    name: 'Enterprise Cloud Migration',
    accountName: 'Enterprise Solutions',
    amount: 6800000,
    stage: 'Contract Review',
    probability: 80,
    closeDate: '2026-02-20',
    riskIndicators: {
      probability: 8,
      closeDateCompression: 5,
      engagementDrop: 15,
      budgetReview: false,
    },
    lastModified: new Date(),
  },
  {
    id: 'opp_005',
    name: 'Innovation Labs AI Platform',
    accountName: 'Innovation Labs',
    amount: 4800000,
    stage: 'Proposal',
    probability: 72,
    closeDate: '2026-03-05',
    riskIndicators: {
      probability: 10,
      closeDateCompression: 3,
      engagementDrop: 8,
      budgetReview: false,
    },
    lastModified: new Date(),
  },
];

export function calculateDealRiskScore(deal: MockDeal): number {
  let score = 0;
  
  score += deal.riskIndicators.probability * 0.4;
  score += Math.min(deal.riskIndicators.closeDateCompression * 2, 25);
  score += deal.riskIndicators.engagementDrop * 0.5;
  if (deal.riskIndicators.budgetReview) score += 10;
  if (deal.competitor) score += 10;
  
  return Math.min(100, Math.round(score));
}

export function isDeaLatRisk(deal: MockDeal): boolean {
  return calculateDealRiskScore(deal) >= 60;
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export interface SalesforceOpportunity {
  Id: string;
  Name: string;
  AccountId: string;
  Amount: number;
  StageName: string;
  Probability: number;
  CloseDate: string;
}

export function mockDealToSalesforce(deal: MockDeal): SalesforceOpportunity {
  return {
    Id: deal.id,
    Name: deal.name,
    AccountId: deal.accountName,
    Amount: deal.amount,
    StageName: deal.stage,
    Probability: deal.probability,
    CloseDate: deal.closeDate,
  };
}
