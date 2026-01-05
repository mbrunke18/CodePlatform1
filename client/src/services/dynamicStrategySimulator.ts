import { queryClient } from '@/lib/queryClient';

interface ReadinessMetrics {
  foresight: number;
  velocity: number;
  agility: number;
  learning: number;
  adaptability: number;
}

interface WeakSignal {
  type: string;
  confidence: number;
  timeline: string;
  impact: string;
  timestamp: Date;
  id: string;
}

interface OraclePattern {
  type: string;
  confidence: number;
  impact: string;
  timeline: string;
  recommendations: string[];
}

interface ActiveScenario {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  status: 'active' | 'completed';
  progress: number;
  duration?: string;
  success?: boolean;
}

interface ContinuousMode {
  enabled: boolean;
  schedule: Record<string, {
    task: string;
    duration: number;
    status: 'completed' | 'pending' | 'scheduled';
  }>;
  metrics: {
    patternsDetected: number;
    playbooksUpdated: number;
    teamReadiness: number;
  };
}

class DynamicStrategySimulator {
  private readinessScore: number = 84.4;
  private metrics: ReadinessMetrics = {
    foresight: 82,
    velocity: 94,
    agility: 87,
    learning: 73,
    adaptability: 85
  };
  private activeScenarios: Map<string, {scenario: ActiveScenario, interval: NodeJS.Timeout}> = new Map();
  private weakSignals: WeakSignal[] = [];
  private oraclePatterns: OraclePattern[] = [];
  private continuousMode: ContinuousMode | null = null;
  private realTimeInterval: NodeJS.Timeout | null = null;
  private patternInterval: NodeJS.Timeout | null = null;
  private activityInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  start() {
    if (this.isRunning) return;
    
    console.log('🚀 M Dynamic Strategy Simulator: STARTING');
    this.isRunning = true;
    this.startRealTimeUpdates();
    this.initializeOracle();
    this.enableContinuousMode();
  }

  stop() {
    console.log('⏸️ M Dynamic Strategy Simulator: STOPPING');
    this.isRunning = false;
    
    if (this.realTimeInterval) clearInterval(this.realTimeInterval);
    if (this.patternInterval) clearInterval(this.patternInterval);
    if (this.activityInterval) clearInterval(this.activityInterval);
  }

  private startRealTimeUpdates() {
    this.realTimeInterval = setInterval(() => {
      this.updateReadinessScore();
      this.detectWeakSignals();
      this.updateActivityFeed();
    }, 5000);
  }

  private updateReadinessScore() {
    const variance = (Math.random() * 2 - 1) * 0.5;
    this.readinessScore = Math.max(70, Math.min(95, this.readinessScore + variance));
    
    Object.keys(this.metrics).forEach(key => {
      const change = (Math.random() * 2 - 1) * 2;
      this.metrics[key as keyof ReadinessMetrics] = Math.max(60, Math.min(100, this.metrics[key as keyof ReadinessMetrics] + change));
    });

    this.invalidateQueries();
  }

  private detectWeakSignals() {
    const signalTypes = [
      { type: 'regulatory', confidence: 73, timeline: '3-6 months', impact: 'high' },
      { type: 'competitor', confidence: 61, timeline: '1-2 months', impact: 'medium' },
      { type: 'technology', confidence: 85, timeline: '6-12 months', impact: 'high' },
      { type: 'market', confidence: 67, timeline: '2-4 weeks', impact: 'low' },
      { type: 'supply chain', confidence: 79, timeline: '1-3 months', impact: 'critical' }
    ];

    if (Math.random() > 0.7) {
      const signalTemplate = signalTypes[Math.floor(Math.random() * signalTypes.length)];
      const signal: WeakSignal = {
        ...signalTemplate,
        timestamp: new Date(),
        id: Math.random().toString(36).substr(2, 9)
      };
      
      this.weakSignals.push(signal);
      this.alertNewSignal(signal);
      this.invalidateQueries();
    }
  }

  private alertNewSignal(signal: WeakSignal) {
    console.log(`⚠️ New weak signal detected: ${signal.type} (${signal.confidence}% confidence)`);
    
    this.logActivity({
      eventType: 'weak_signal_detected',
      title: `Weak Signal: ${signal.type}`,
      description: `${signal.confidence}% confidence, ${signal.timeline} timeline`,
      severity: signal.impact === 'critical' ? 'critical' : signal.impact === 'high' ? 'high' : 'medium'
    });
  }

  private initializeOracle() {
    this.patternInterval = setInterval(() => {
      this.detectPatterns();
    }, 30000);
  }

  private detectPatterns() {
    const patterns: OraclePattern[] = [
      {
        type: 'Regulatory shift',
        confidence: Math.floor(60 + Math.random() * 30),
        impact: ['high', 'medium', 'critical'][Math.floor(Math.random() * 3)],
        timeline: ['1-3 months', '3-6 months', '6-12 months'][Math.floor(Math.random() * 3)],
        recommendations: [
          'Pre-load compliance playbook',
          'Schedule legal briefing',
          'Run simulation exercise'
        ]
      },
      {
        type: 'Market disruption',
        confidence: Math.floor(50 + Math.random() * 40),
        impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        timeline: ['2-4 weeks', '1-2 months', '2-3 months'][Math.floor(Math.random() * 3)],
        recommendations: [
          'Review competitor responses',
          'Update pricing strategy',
          'Prepare customer communications'
        ]
      },
      {
        type: 'Supply chain risk',
        confidence: Math.floor(70 + Math.random() * 25),
        impact: 'critical',
        timeline: '1-4 weeks',
        recommendations: [
          'Identify alternate suppliers',
          'Increase inventory buffers',
          'Alert operations teams'
        ]
      }
    ];

    if (Math.random() > 0.6) {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.oraclePatterns.push(pattern);
      this.alertPattern(pattern);
      this.invalidateQueries();
    }
  }

  private alertPattern(pattern: OraclePattern) {
    console.log(`🔮 M Oracle: ${pattern.type} detected (${pattern.confidence}% confidence)`);
    
    this.logActivity({
      eventType: 'oracle_pattern_detected',
      title: `Oracle Pattern: ${pattern.type}`,
      description: `${pattern.confidence}% confidence, impact: ${pattern.impact}`,
      severity: pattern.impact === 'critical' ? 'critical' : 'high'
    });
  }

  private enableContinuousMode() {
    this.continuousMode = {
      enabled: true,
      schedule: {
        monday: { task: 'Weak Signal Scan', duration: 15, status: 'completed' },
        tuesday: { task: 'Scenario Refresh', duration: 30, status: 'completed' },
        wednesday: { task: 'Team Drill', duration: 12, status: 'pending' },
        thursday: { task: 'Playbook Evolution', duration: 45, status: 'scheduled' },
        friday: { task: 'Readiness Review', duration: 20, status: 'scheduled' }
      },
      metrics: {
        patternsDetected: 3,
        playbooksUpdated: 2,
        teamReadiness: 91
      }
    };

    console.log('✅ Continuous Operations Mode: ACTIVE');
  }

  launchScenario(scenarioId: string, scenarioName: string) {
    const activeScenario: ActiveScenario = {
      id: scenarioId,
      name: scenarioName,
      description: `Simulating ${scenarioName} execution`,
      startTime: new Date(),
      status: 'active',
      progress: 0
    };

    const interval = this.startScenarioCoordination(activeScenario);
    this.activeScenarios.set(scenarioId, { scenario: activeScenario, interval });
    
    this.logActivity({
      eventType: 'scenario_launched',
      title: `Scenario Activated: ${scenarioName}`,
      description: 'Coordinated response initiated',
      severity: 'info'
    });
  }

  private startScenarioCoordination(scenario: ActiveScenario): NodeJS.Timeout {
    console.log(`🚀 Launching ${scenario.name} coordination...`);
    
    const interval = setInterval(() => {
      scenario.progress += 10;
      
      if (scenario.progress >= 100) {
        clearInterval(interval);
        this.completeScenario(scenario);
      } else {
        this.invalidateQueries();
      }
    }, 1000);
    
    return interval;
  }

  private completeScenario(scenario: ActiveScenario) {
    const endTime = new Date();
    const duration = (endTime.getTime() - scenario.startTime.getTime()) / 60000;
    
    scenario.status = 'completed';
    scenario.duration = duration.toFixed(1);
    scenario.success = duration <= 12;

    console.log(`✅ Scenario completed in ${scenario.duration} minutes`);
    
    this.logActivity({
      eventType: 'scenario_completed',
      title: `Scenario Completed: ${scenario.name}`,
      description: `Finished in ${scenario.duration} minutes - ${scenario.success ? 'SUCCESS' : 'LEARNING OPPORTUNITY'}`,
      severity: scenario.success ? 'success' : 'warning'
    });

    this.invalidateQueries();
  }

  private updateActivityFeed() {
    const activities = [
      { type: 'pattern_detected', text: 'Pattern detected: Unusual network activity', severity: 'warning' },
      { type: 'playbook_updated', text: 'Playbook updated: Regulatory Response v2.3', severity: 'info' },
      { type: 'drill_completed', text: 'Team drill completed: 13.2 minutes', severity: 'success' },
      { type: 'weak_signal', text: 'Weak signal: Competitor announcement detected', severity: 'medium' },
      { type: 'oracle_prediction', text: 'AI Oracle: New regulatory risk identified', severity: 'high' },
      { type: 'scenario_launched', text: 'Scenario launched: Supply chain exercise', severity: 'info' },
      { type: 'learning_integrated', text: 'Learning integrated: Response time improved', severity: 'success' },
      { type: 'alert', text: 'Alert: Stakeholder availability confirmed', severity: 'info' }
    ];

    if (Math.random() > 0.6) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      this.logActivity({
        eventType: activity.type,
        title: activity.text,
        description: `Automated system update - ${new Date().toLocaleTimeString()}`,
        severity: activity.severity as any
      });
    }
  }

  private logActivity(activity: {
    eventType: string;
    title: string;
    description: string;
    severity: string;
  }) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${activity.title}`);
    
    queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/activity-feed'] });
  }

  private invalidateQueries() {
    queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/status'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/readiness'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/weak-signals'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/oracle-patterns'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/activity-feed'] });
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      readinessScore: this.readinessScore,
      metrics: this.metrics,
      activeScenarios: this.activeScenarios.size,
      weakSignals: this.weakSignals.length,
      oraclePatterns: this.oraclePatterns.length,
      continuousMode: this.continuousMode?.enabled || false
    };
  }
}

export const dynamicStrategySimulator = new DynamicStrategySimulator();
