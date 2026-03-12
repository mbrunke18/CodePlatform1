
export interface OpportunityData {
  id: string;
  accountName: string;
  accountId: string;
  dealName: string;
  amount: number;
  probability: number;
  closeDate: string;
  stage: string;
  competitor?: string;
  budgetApprovalStatus: string;
  engagementScore: number;
  lastActivityDaysAgo: number;
  contractCompressionRisk: number;
  keyContactEngagement: number;
  executiveVisibility: number;
}

export class MockSalesforceService {
  private opportunities: OpportunityData[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.opportunities = [
      {
        id: 'opp_001',
        accountName: 'Acme Corp',
        accountId: 'acc_001',
        dealName: 'Acme Corp Digital Transformation',
        amount: 5000000,
        probability: 75,
        closeDate: '2026-02-15',
        stage: 'Negotiation',
        competitor: 'Competitor A',
        budgetApprovalStatus: 'In Review',
        engagementScore: 45,
        lastActivityDaysAgo: 2,
        contractCompressionRisk: 0.85,
        keyContactEngagement: 0.42,
        executiveVisibility: 0.35,
      },
      {
        id: 'opp_002',
        accountName: 'TechCorp Inc',
        accountId: 'acc_002',
        dealName: 'TechCorp Analytics Platform',
        amount: 3200000,
        probability: 85,
        closeDate: '2026-02-28',
        stage: 'Proposal',
        budgetApprovalStatus: 'Approved',
        engagementScore: 78,
        lastActivityDaysAgo: 1,
        contractCompressionRisk: 0.25,
        keyContactEngagement: 0.82,
        executiveVisibility: 0.75,
      },
      {
        id: 'opp_003',
        accountName: 'Global Finance Ltd',
        accountId: 'acc_003',
        dealName: 'Global Finance Risk Management',
        amount: 4100000,
        probability: 65,
        closeDate: '2026-03-10',
        stage: 'Discovery',
        budgetApprovalStatus: 'Pending',
        engagementScore: 55,
        lastActivityDaysAgo: 5,
        contractCompressionRisk: 0.45,
        keyContactEngagement: 0.60,
        executiveVisibility: 0.55,
      },
      {
        id: 'opp_004',
        accountName: 'Enterprise Solutions',
        accountId: 'acc_004',
        dealName: 'Enterprise Cloud Migration',
        amount: 6800000,
        probability: 80,
        closeDate: '2026-02-20',
        stage: 'Contract Review',
        budgetApprovalStatus: 'Approved',
        engagementScore: 70,
        lastActivityDaysAgo: 0,
        contractCompressionRisk: 0.35,
        keyContactEngagement: 0.88,
        executiveVisibility: 0.92,
      },
      {
        id: 'opp_005',
        accountName: 'Innovation Labs',
        accountId: 'acc_005',
        dealName: 'Innovation Labs AI Platform',
        amount: 4800000,
        probability: 72,
        closeDate: '2026-03-05',
        stage: 'Proposal',
        budgetApprovalStatus: 'Approved',
        engagementScore: 82,
        lastActivityDaysAgo: 1,
        contractCompressionRisk: 0.20,
        keyContactEngagement: 0.91,
        executiveVisibility: 0.85,
      },
    ];
  }

  calculateDealRiskScore(opp: OpportunityData): number {
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

  detectTriggers(opp: OpportunityData): string[] {
    const triggers: string[] = [];
    const riskScore = this.calculateDealRiskScore(opp);

    if (riskScore >= 70) triggers.push('HIGH_RISK_SCORE');
    if (opp.contractCompressionRisk > 0.7) triggers.push('CONTRACT_COMPRESSION');
    if (opp.keyContactEngagement < 0.5) triggers.push('LOW_ENGAGEMENT');
    if (opp.budgetApprovalStatus === 'In Review' && opp.amount > 4000000)
      triggers.push('LARGE_DEAL_BUDGET_RISK');
    if (opp.lastActivityDaysAgo > 3) triggers.push('STALLED_DEAL');
    if (opp.competitor && opp.probability < 80) triggers.push('COMPETITOR_THREAT');

    return triggers;
  }

  async getDeals(): Promise<OpportunityData[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.opportunities), 100);
    });
  }

  async getDealsAtRisk(): Promise<OpportunityData[]> {
    const deals = await this.getDeals();
    return deals.filter((opp) => {
      const riskScore = this.calculateDealRiskScore(opp);
      return riskScore > 60;
    });
  }

  async getOpportunityDetails(id: string): Promise<OpportunityData | null> {
    return this.opportunities.find((opp) => opp.id === id) || null;
  }

  getDealRiskDetails(opp: OpportunityData) {
    return {
      id: opp.id,
      dealName: opp.dealName,
      accountName: opp.accountName,
      amount: opp.amount,
      probability: opp.probability,
      riskScore: this.calculateDealRiskScore(opp),
      triggers: this.detectTriggers(opp),
      riskFactors: {
        contractCompression: opp.contractCompressionRisk,
        engagement: opp.engagementScore,
        budgetApprovalStatus: opp.budgetApprovalStatus,
        competitor: opp.competitor || 'None',
        lastActivity: `${opp.lastActivityDaysAgo} days ago`,
      },
    };
  }

  getPipelineSummary() {
    const totalPipeline = this.opportunities.reduce((sum, opp) => sum + opp.amount, 0);
    const atRisk = this.opportunities.filter(opp => this.calculateDealRiskScore(opp) > 60);
    
    return {
      totalDeals: this.opportunities.length,
      totalPipeline,
      dealsAtRisk: atRisk.length,
      atRiskValue: atRisk.reduce((sum, opp) => sum + opp.amount, 0),
    };
  }

  reset() {
    this.initializeMockData();
  }
}

export const mockSalesforce = new MockSalesforceService();
