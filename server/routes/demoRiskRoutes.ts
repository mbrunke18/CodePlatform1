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
  
  const learnings = {
    executionId: demoState.currentExecution?.executionId,
    lessonsLearned: [
      'Early detection of contract compression risk enabled proactive engagement',
      'Cross-functional coordination completed 15x faster than industry average',
      'Automated task creation reduced manual coordination overhead by 90%',
    ],
    playbookImprovements: [
      'Add competitive intelligence trigger for deals over $3M',
      'Include CFO in stakeholder list for deals with budget approval delays',
    ],
    metrics: {
      timeToResponse: 12,
      industryBenchmark: 180,
      efficiencyGain: '15x',
      costAvoidance: demoState.currentExecution?.amount || 0,
    },
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
