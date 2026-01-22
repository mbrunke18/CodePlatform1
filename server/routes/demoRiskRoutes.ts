import { Router, Request, Response } from 'express';
import { mockSalesforce } from '../services/MockSalesforceService';
import { triggerDetectionService, type TriggerAlert } from '../services/TriggerDetectionService';
import { dealRiskOrchestrator, type ExecutionResult } from '../services/DealRiskExecutionOrchestrator';

const router = Router();

let demoState = {
  phase: 'idle' as 'idle' | 'identify' | 'detect' | 'execute' | 'advance',
  currentExecution: null as ExecutionResult | null,
  integrations: {
    salesforce: false,
    slack: false,
    jira: false,
    calendar: false,
  },
  playbook: null as { id: string; name: string; triggers: string[] } | null,
};

router.get('/status', (req: Request, res: Response) => {
  res.json({
    phase: demoState.phase,
    integrations: demoState.integrations,
    playbook: demoState.playbook,
    monitoring: triggerDetectionService.isMonitoring(),
    currentExecution: demoState.currentExecution,
  });
});

router.post('/reset', (req: Request, res: Response) => {
  mockSalesforce.reset();
  triggerDetectionService.stopMonitoring();
  demoState = {
    phase: 'idle',
    currentExecution: null,
    integrations: {
      salesforce: false,
      slack: false,
      jira: false,
      calendar: false,
    },
    playbook: null,
  };
  res.json({ success: true, message: 'Demo reset to initial state' });
});

router.post('/identify/connect-salesforce', (req: Request, res: Response) => {
  demoState.integrations.salesforce = true;
  demoState.phase = 'identify';
  res.json({ 
    success: true, 
    message: 'Salesforce connected',
    pipeline: mockSalesforce.getPipelineSummary(),
  });
});

router.post('/identify/connect-slack', (req: Request, res: Response) => {
  demoState.integrations.slack = true;
  res.json({ success: true, message: 'Slack connected' });
});

router.post('/identify/connect-jira', (req: Request, res: Response) => {
  demoState.integrations.jira = true;
  res.json({ success: true, message: 'Jira connected' });
});

router.post('/identify/connect-calendar', (req: Request, res: Response) => {
  demoState.integrations.calendar = true;
  res.json({ success: true, message: 'Google Calendar connected' });
});

router.post('/identify/select-playbook', (req: Request, res: Response) => {
  demoState.playbook = {
    id: 'deal-risk-response',
    name: 'Deal Risk Response',
    triggers: ['HIGH_RISK_SCORE', 'CONTRACT_COMPRESSION', 'LOW_ENGAGEMENT', 'COMPETITOR_THREAT'],
  };
  res.json({ 
    success: true, 
    playbook: demoState.playbook,
    message: 'Playbook selected and configured',
  });
});

router.get('/identify/pipeline', async (req: Request, res: Response) => {
  const deals = await mockSalesforce.getDeals();
  const dealsWithRisk = deals.map(deal => ({
    ...deal,
    riskScore: mockSalesforce.calculateDealRiskScore(deal),
    triggers: mockSalesforce.detectTriggers(deal),
  }));
  
  res.json({
    deals: dealsWithRisk,
    summary: mockSalesforce.getPipelineSummary(),
  });
});

router.post('/detect/start-monitoring', (req: Request, res: Response) => {
  demoState.phase = 'detect';
  triggerDetectionService.startMonitoring();
  res.json({ 
    success: true, 
    message: 'Trigger detection started',
    status: triggerDetectionService.getStatus(),
  });
});

router.post('/detect/stop-monitoring', (req: Request, res: Response) => {
  triggerDetectionService.stopMonitoring();
  res.json({ success: true, message: 'Trigger detection stopped' });
});

router.get('/detect/triggers', async (req: Request, res: Response) => {
  const triggers = await triggerDetectionService.checkForTriggers();
  res.json({ triggers });
});

router.get('/detect/current-alerts', (req: Request, res: Response) => {
  const alerts = triggerDetectionService.getCurrentTriggers();
  res.json({ alerts });
});

router.post('/execute/trigger', async (req: Request, res: Response) => {
  const { dealId } = req.body;
  
  const triggers = await triggerDetectionService.checkForTriggers();
  const targetTrigger = triggers.find(t => t.dealId === dealId) || triggers[0];
  
  if (!targetTrigger) {
    res.status(404).json({ error: 'No triggers found to execute' });
    return;
  }
  
  demoState.phase = 'execute';
  const result = await dealRiskOrchestrator.executeRiskResponse(targetTrigger);
  demoState.currentExecution = result;
  
  res.json({ 
    success: true,
    execution: result,
  });
});

router.get('/execute/timeline', (req: Request, res: Response) => {
  if (!demoState.currentExecution) {
    res.status(404).json({ error: 'No active execution' });
    return;
  }
  
  res.json({
    timeline: demoState.currentExecution.timeline,
    results: demoState.currentExecution.results,
    metrics: demoState.currentExecution.comparisonMetrics,
  });
});

router.post('/advance/complete', (req: Request, res: Response) => {
  demoState.phase = 'advance';
  
  const dealAmount = demoState.currentExecution?.amount || 5000000;
  const dealName = demoState.currentExecution?.dealName || 'Enterprise Deal';
  
  const learnings = {
    executionId: demoState.currentExecution?.executionId,
    dealContext: {
      dealName,
      dealAmount,
      riskType: 'Contract Timeline Compression',
      triggerDetected: 'Customer requested 60% timeline acceleration',
    },
    
    // What worked well - specific, measurable outcomes
    successPatterns: [
      {
        category: 'Early Detection',
        insight: 'Risk signal detected 3 weeks before traditional discovery',
        impact: 'Created window for proactive engagement vs reactive firefighting',
        icon: 'radar',
      },
      {
        category: 'Stakeholder Alignment',
        insight: '6 stakeholders aligned in 12 minutes vs typical 3-4 day cycle',
        impact: 'Prevented conflicting customer communications',
        icon: 'users',
      },
      {
        category: 'Decision Velocity',
        insight: 'Executive sponsor briefed before customer escalation',
        impact: 'Maintained relationship trust and deal momentum',
        icon: 'zap',
      },
    ],
    
    // Actionable playbook improvements with specific triggers
    playbookImprovements: [
      {
        type: 'trigger',
        title: 'Add Competitive Intelligence Trigger',
        description: 'For deals over $3M, add trigger when competitor is mentioned in meeting notes',
        priority: 'high',
        estimatedImpact: 'Could have detected competitive threat 2 weeks earlier',
      },
      {
        type: 'stakeholder',
        title: 'Include CFO in Budget Delay Scenarios',
        description: 'When budget approval delay >7 days, automatically loop in CFO',
        priority: 'medium',
        estimatedImpact: 'Reduces budget approval cycle by average 4 days',
      },
      {
        type: 'task',
        title: 'Add Technical Validation Checkpoint',
        description: 'Before legal review, require technical architecture sign-off',
        priority: 'medium',
        estimatedImpact: 'Prevents late-stage technical objections in 23% of deals',
      },
    ],
    
    // Institutional knowledge captured
    institutionalKnowledge: [
      {
        pattern: 'Timeline Compression Pattern',
        frequency: 'Occurs in 34% of enterprise deals',
        bestResponse: 'Proactive scope negotiation within 24 hours preserves deal value',
        worstOutcome: 'Delayed response leads to 15-40% scope reduction',
      },
    ],
    
    // ROI metrics
    metrics: {
      timeToResponse: 12,
      industryBenchmark: 180,
      efficiencyGain: '15x',
      hoursRecovered: 20,
      dealValueProtected: dealAmount,
      costOfDelay: Math.round(dealAmount * 0.15), // 15% deal erosion avoided
    },
    
    // Next execution improvements
    nextExecutionRecommendations: [
      'Apply improved playbook to 3 similar at-risk deals in pipeline',
      'Schedule quarterly playbook review with sales leadership',
      'Train new SDRs on early risk signal recognition',
    ],
  };
  
  res.json({
    success: true,
    phase: 'advance',
    learnings,
  });
});

router.get('/advance/roi', (req: Request, res: Response) => {
  const execution = demoState.currentExecution;
  
  res.json({
    dealValue: execution?.amount || 5000000,
    timeSaved: {
      minutes: 168,
      description: 'vs 3-hour industry average',
    },
    tasksAutomated: 4,
    stakeholdersNotified: 6,
    systemsOrchestrated: 4,
    potentialRevenueSaved: execution?.amount || 5000000,
  });
});

export default router;
