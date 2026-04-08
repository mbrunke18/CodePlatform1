import { randomUUID } from 'crypto';

const AVATAR_COLORS = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899',
  '#06B6D4', '#F97316', '#6366F1', '#14B8A6', '#E11D48',
];

interface ActivationState {
  id: string;
  playbookKey: string;
  playbookName: string;
  strategicCategory: 'offense' | 'defense' | 'special_teams';
  status: 'pending' | 'running' | 'completed';
  stakeholders: StakeholderState[];
  tasks: TaskState[];
  activityLog: ActivityLogEntry[];
  metrics: {
    coordinationPercent: number;
    stakeholdersAcknowledged: number;
    totalStakeholders: number;
    tasksCompleted: number;
    totalTasks: number;
    elapsedSeconds: number;
    targetSeconds: number;
  };
  startedAt: string | null;
  completedAt: string | null;
}

interface StakeholderState {
  id: string;
  roleName: string;
  personName: string;
  title: string;
  department: string;
  tier: number;
  status: 'pending' | 'notifying' | 'notified' | 'acknowledged';
  notifiedAt: string | null;
  acknowledgedAt: string | null;
  responseTimeSeconds: number | null;
  avatarColor: string;
}

interface TaskState {
  id: string;
  taskName: string;
  ownerRole: string;
  priority: string;
  sequence: number;
  phase: 'immediate' | 'secondary' | 'follow_up';
  status: 'pending' | 'in_progress' | 'completed';
  startedAt: string | null;
  completedAt: string | null;
  estimatedMinutes: number;
}

interface ActivityLogEntry {
  id: string;
  eventType: string;
  actorName: string;
  actorRole: string;
  description: string;
  timestamp: string;
}

interface PlaybookConfig {
  key: string;
  name: string;
  playbookNumber: number;
  strategicCategory: 'offense' | 'defense' | 'special_teams';
  stakeholders: Array<{
    roleName: string;
    personName: string;
    title: string;
    department: string;
    tier: number;
  }>;
  tasks: Array<{
    taskName: string;
    ownerRole: string;
    priority: string;
    sequence: number;
    phase: 'immediate' | 'secondary' | 'follow_up';
    estimatedMinutes: number;
  }>;
}

const DEMO_PLAYBOOKS: Record<string, PlaybookConfig> = {
  'ma-day1-integration': {
    key: 'ma-day1-integration',
    name: 'M&A Day 1 Integration',
    playbookNumber: 10,
    strategicCategory: 'offense',
    stakeholders: [
      { roleName: 'CEO', personName: 'Sarah Chen', title: 'Chief Executive Officer', department: 'Executive Leadership', tier: 1 },
      { roleName: 'CFO', personName: 'Michael Torres', title: 'Chief Financial Officer', department: 'Finance', tier: 1 },
      { roleName: 'CLO', personName: 'Patricia Williams', title: 'Chief Legal Officer', department: 'Legal', tier: 1 },
      { roleName: 'CTO', personName: 'James Rodriguez', title: 'Chief Technology Officer', department: 'Technology', tier: 1 },
      { roleName: 'VP M&A', personName: 'Diana Martinez', title: 'Vice President, Mergers & Acquisitions', department: 'Corporate Development', tier: 1 },
      { roleName: 'Integration PMO Lead', personName: 'Robert Kim', title: 'Integration PMO Lead', department: 'Operations', tier: 2 },
      { roleName: 'HR Director', personName: 'Jennifer Walsh', title: 'Director of Human Resources', department: 'Human Resources', tier: 2 },
      { roleName: 'Communications VP', personName: 'David Park', title: 'Vice President, Communications', department: 'Communications', tier: 2 },
      { roleName: 'Board Liaison', personName: 'Margaret Liu', title: 'Board Liaison', department: 'Governance', tier: 2 },
      { roleName: 'Investment Banking MD', personName: 'Goldman Sachs', title: 'Managing Director, Investment Banking', department: 'External Advisory', tier: 2 },
    ],
    tasks: [
      { taskName: 'Activate Integration War Room', ownerRole: 'VP M&A', priority: 'critical', sequence: 1, phase: 'immediate', estimatedMinutes: 1 },
      { taskName: 'Issue stakeholder notification - Tier 1', ownerRole: 'Communications VP', priority: 'critical', sequence: 2, phase: 'immediate', estimatedMinutes: 1 },
      { taskName: 'Confirm regulatory filing status', ownerRole: 'CLO', priority: 'critical', sequence: 3, phase: 'immediate', estimatedMinutes: 2 },
      { taskName: 'Lock data room access controls', ownerRole: 'CTO', priority: 'critical', sequence: 4, phase: 'immediate', estimatedMinutes: 1 },
      { taskName: 'Launch Day 1 employee communication', ownerRole: 'HR Director', priority: 'high', sequence: 5, phase: 'secondary', estimatedMinutes: 2 },
      { taskName: 'Activate IT systems integration protocol', ownerRole: 'CTO', priority: 'high', sequence: 6, phase: 'secondary', estimatedMinutes: 3 },
      { taskName: 'Initiate customer retention outreach', ownerRole: 'Communications VP', priority: 'high', sequence: 7, phase: 'secondary', estimatedMinutes: 2 },
      { taskName: 'Begin vendor contract review', ownerRole: 'CLO', priority: 'high', sequence: 8, phase: 'secondary', estimatedMinutes: 3 },
      { taskName: 'Deploy cultural integration framework', ownerRole: 'HR Director', priority: 'medium', sequence: 9, phase: 'follow_up', estimatedMinutes: 5 },
      { taskName: 'Activate synergy tracking dashboard', ownerRole: 'CFO', priority: 'medium', sequence: 10, phase: 'follow_up', estimatedMinutes: 3 },
      { taskName: 'Schedule 72-hour checkpoint review', ownerRole: 'Integration PMO Lead', priority: 'medium', sequence: 11, phase: 'follow_up', estimatedMinutes: 2 },
      { taskName: 'Generate executive situation report', ownerRole: 'CEO', priority: 'medium', sequence: 12, phase: 'follow_up', estimatedMinutes: 4 },
    ],
  },
  'ransomware-response': {
    key: 'ransomware-response',
    name: 'Ransomware Response',
    playbookNumber: 60,
    strategicCategory: 'defense',
    stakeholders: [
      { roleName: 'CISO', personName: 'Alexandra Foster', title: 'Chief Information Security Officer', department: 'Information Security', tier: 1 },
      { roleName: 'CTO', personName: 'James Rodriguez', title: 'Chief Technology Officer', department: 'Technology', tier: 1 },
      { roleName: 'CLO', personName: 'Patricia Williams', title: 'Chief Legal Officer', department: 'Legal', tier: 1 },
      { roleName: 'CEO', personName: 'Sarah Chen', title: 'Chief Executive Officer', department: 'Executive Leadership', tier: 1 },
      { roleName: 'VP Infrastructure', personName: 'Thomas Greene', title: 'Vice President, Infrastructure', department: 'IT Operations', tier: 1 },
      { roleName: 'Incident Commander', personName: 'Maria Santos', title: 'Incident Commander', department: 'Security Operations', tier: 2 },
      { roleName: 'Forensics Lead', personName: 'Kevin Patel', title: 'Digital Forensics Lead', department: 'Cybersecurity', tier: 2 },
      { roleName: 'Communications Director', personName: 'Lisa Chang', title: 'Communications Director', department: 'Communications', tier: 2 },
      { roleName: 'Cyber Insurance Broker', personName: 'Cyber Insurance Broker', title: 'Cyber Insurance Broker', department: 'External Advisory', tier: 2 },
      { roleName: 'FBI Cyber Division Liaison', personName: 'FBI Cyber Division Liaison', title: 'FBI Cyber Division Liaison', department: 'External Law Enforcement', tier: 2 },
    ],
    tasks: [
      { taskName: 'Isolate affected systems', ownerRole: 'VP Infrastructure', priority: 'critical', sequence: 1, phase: 'immediate', estimatedMinutes: 1 },
      { taskName: 'Activate incident response team', ownerRole: 'CISO', priority: 'critical', sequence: 2, phase: 'immediate', estimatedMinutes: 1 },
      { taskName: 'Engage cyber forensics unit', ownerRole: 'Forensics Lead', priority: 'critical', sequence: 3, phase: 'immediate', estimatedMinutes: 2 },
      { taskName: 'Notify insurance carrier', ownerRole: 'CLO', priority: 'critical', sequence: 4, phase: 'immediate', estimatedMinutes: 1 },
      { taskName: 'Assess data exfiltration scope', ownerRole: 'Forensics Lead', priority: 'high', sequence: 5, phase: 'secondary', estimatedMinutes: 3 },
      { taskName: 'Activate backup recovery protocol', ownerRole: 'CTO', priority: 'high', sequence: 6, phase: 'secondary', estimatedMinutes: 3 },
      { taskName: 'Draft stakeholder communications', ownerRole: 'Communications Director', priority: 'high', sequence: 7, phase: 'secondary', estimatedMinutes: 2 },
      { taskName: 'Engage law enforcement liaison', ownerRole: 'CLO', priority: 'high', sequence: 8, phase: 'secondary', estimatedMinutes: 2 },
      { taskName: 'Begin system restoration sequence', ownerRole: 'VP Infrastructure', priority: 'medium', sequence: 9, phase: 'follow_up', estimatedMinutes: 5 },
      { taskName: 'Deploy enhanced monitoring', ownerRole: 'CISO', priority: 'medium', sequence: 10, phase: 'follow_up', estimatedMinutes: 3 },
      { taskName: 'Conduct initial lessons learned', ownerRole: 'Incident Commander', priority: 'medium', sequence: 11, phase: 'follow_up', estimatedMinutes: 4 },
      { taskName: 'Generate regulatory notification package', ownerRole: 'CLO', priority: 'medium', sequence: 12, phase: 'follow_up', estimatedMinutes: 3 },
    ],
  },
  'ai-governance-framework': {
    key: 'ai-governance-framework',
    name: 'AI Governance Framework',
    playbookNumber: 155,
    strategicCategory: 'special_teams',
    stakeholders: [
      { roleName: 'Chief AI Officer', personName: 'Dr. Anika Patel', title: 'Chief AI Officer', department: 'AI & Innovation', tier: 1 },
      { roleName: 'CTO', personName: 'James Rodriguez', title: 'Chief Technology Officer', department: 'Technology', tier: 1 },
      { roleName: 'CLO', personName: 'Patricia Williams', title: 'Chief Legal Officer', department: 'Legal', tier: 1 },
      { roleName: 'Chief Ethics Officer', personName: 'Dr. Marcus Johnson', title: 'Chief Ethics Officer', department: 'Ethics & Compliance', tier: 1 },
      { roleName: 'VP Data Science', personName: 'Rachel Kim', title: 'Vice President, Data Science', department: 'Data Science', tier: 1 },
      { roleName: 'AI Risk Manager', personName: 'Chris Thompson', title: 'AI Risk Manager', department: 'Risk Management', tier: 2 },
      { roleName: 'Compliance Director', personName: 'Samantha Lee', title: 'Compliance Director', department: 'Compliance', tier: 2 },
      { roleName: 'AI Ethics Board Advisor', personName: 'AI Ethics Board Advisor (MIT)', title: 'AI Ethics Board Advisor', department: 'External Academic', tier: 2 },
      { roleName: 'Industry Standards Representative', personName: 'Industry Standards Representative', title: 'Industry Standards Representative', department: 'External Standards Body', tier: 2 },
    ],
    tasks: [
      { taskName: 'Convene AI Governance Committee', ownerRole: 'Chief AI Officer', priority: 'critical', sequence: 1, phase: 'immediate', estimatedMinutes: 1 },
      { taskName: 'Activate AI risk assessment framework', ownerRole: 'AI Risk Manager', priority: 'critical', sequence: 2, phase: 'immediate', estimatedMinutes: 2 },
      { taskName: 'Review model inventory and risk scores', ownerRole: 'VP Data Science', priority: 'critical', sequence: 3, phase: 'immediate', estimatedMinutes: 2 },
      { taskName: 'Deploy bias and fairness audit protocol', ownerRole: 'Chief Ethics Officer', priority: 'high', sequence: 4, phase: 'secondary', estimatedMinutes: 3 },
      { taskName: 'Initiate regulatory compliance mapping', ownerRole: 'Compliance Director', priority: 'high', sequence: 5, phase: 'secondary', estimatedMinutes: 3 },
      { taskName: 'Activate stakeholder impact assessment', ownerRole: 'Chief AI Officer', priority: 'high', sequence: 6, phase: 'secondary', estimatedMinutes: 2 },
      { taskName: 'Review data governance controls', ownerRole: 'CTO', priority: 'high', sequence: 7, phase: 'secondary', estimatedMinutes: 2 },
      { taskName: 'Establish continuous monitoring framework', ownerRole: 'AI Risk Manager', priority: 'medium', sequence: 8, phase: 'follow_up', estimatedMinutes: 4 },
      { taskName: 'Generate governance compliance report', ownerRole: 'Compliance Director', priority: 'medium', sequence: 9, phase: 'follow_up', estimatedMinutes: 3 },
      { taskName: 'Schedule quarterly AI ethics review', ownerRole: 'Chief Ethics Officer', priority: 'medium', sequence: 10, phase: 'follow_up', estimatedMinutes: 2 },
    ],
  },
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

class LiveActivationService {
  private activations: Map<string, ActivationState> = new Map();
  private timers: Map<string, NodeJS.Timeout[]> = new Map();

  getPlaybookConfigs(): Record<string, { key: string; name: string; playbookNumber: number; strategicCategory: string }> {
    const result: Record<string, { key: string; name: string; playbookNumber: number; strategicCategory: string }> = {};
    for (const [key, config] of Object.entries(DEMO_PLAYBOOKS)) {
      result[key] = {
        key: config.key,
        name: config.name,
        playbookNumber: config.playbookNumber,
        strategicCategory: config.strategicCategory,
      };
    }
    return result;
  }

  async activatePlaybook(playbookKey: string): Promise<ActivationState> {
    const config = DEMO_PLAYBOOKS[playbookKey];
    if (!config) {
      throw new Error(`Unknown playbook key: ${playbookKey}. Available: ${Object.keys(DEMO_PLAYBOOKS).join(', ')}`);
    }

    const activationId = randomUUID();

    const stakeholders: StakeholderState[] = config.stakeholders.map((s, i) => ({
      id: randomUUID(),
      roleName: s.roleName,
      personName: s.personName,
      title: s.title,
      department: s.department,
      tier: s.tier,
      status: 'pending' as const,
      notifiedAt: null,
      acknowledgedAt: null,
      responseTimeSeconds: null,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
    }));

    const tasks: TaskState[] = config.tasks.map((t) => ({
      id: randomUUID(),
      taskName: t.taskName,
      ownerRole: t.ownerRole,
      priority: t.priority,
      sequence: t.sequence,
      phase: t.phase,
      status: 'pending' as const,
      startedAt: null,
      completedAt: null,
      estimatedMinutes: t.estimatedMinutes,
    }));

    const state: ActivationState = {
      id: activationId,
      playbookKey: config.key,
      playbookName: config.name,
      strategicCategory: config.strategicCategory,
      status: 'pending',
      stakeholders,
      tasks,
      activityLog: [],
      metrics: {
        coordinationPercent: 0,
        stakeholdersAcknowledged: 0,
        totalStakeholders: stakeholders.length,
        tasksCompleted: 0,
        totalTasks: tasks.length,
        elapsedSeconds: 0,
        targetSeconds: 720,
      },
      startedAt: null,
      completedAt: null,
    };

    this.activations.set(activationId, state);
    return state;
  }

  getActivationState(activationId: string): ActivationState | null {
    return this.activations.get(activationId) || null;
  }

  startSimulation(activationId: string, emitCallback: (event: string, data: any) => void): void {
    const state = this.activations.get(activationId);
    if (!state) {
      console.error(`Activation ${activationId} not found for simulation`);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    this.timers.set(activationId, timers);

    const now = new Date();
    state.status = 'running';
    state.startedAt = now.toISOString();
    const startTime = Date.now();

    const addLog = (eventType: string, actorName: string, actorRole: string, description: string) => {
      const entry: ActivityLogEntry = {
        id: randomUUID(),
        eventType,
        actorName,
        actorRole,
        description,
        timestamp: new Date().toISOString(),
      };
      state.activityLog.push(entry);
      emitCallback('activity-log', { activationId, ...entry });
    };

    const updateMetrics = () => {
      const ackCount = state.stakeholders.filter(s => s.status === 'acknowledged').length;
      const completedCount = state.tasks.filter(t => t.status === 'completed').length;
      const elapsed = Math.round((Date.now() - startTime) / 1000);

      const stakeholderProgress = ackCount / state.metrics.totalStakeholders;
      const taskProgress = completedCount / state.metrics.totalTasks;
      const coordination = Math.round((stakeholderProgress * 40 + taskProgress * 60) * 100) / 100;

      state.metrics.stakeholdersAcknowledged = ackCount;
      state.metrics.tasksCompleted = completedCount;
      state.metrics.elapsedSeconds = elapsed;
      state.metrics.coordinationPercent = Math.min(coordination, 100);

      emitCallback('metrics-update', {
        activationId,
        coordinationPercent: state.metrics.coordinationPercent,
        stakeholdersAcknowledged: ackCount,
        tasksCompleted: completedCount,
        elapsedSeconds: elapsed,
      });
    };

    addLog('activation-started', 'Readiness OS', 'Platform', `Playbook "${state.playbookName}" activated — coordinating ${state.stakeholders.length} stakeholders across ${state.tasks.length} tasks`);
    emitCallback('phase-change', { activationId, phase: 'activation-started', timestamp: now.toISOString() });

    const t0 = setTimeout(() => {
      state.stakeholders.forEach(s => {
        s.status = 'notifying';
        s.notifiedAt = new Date().toISOString();
        emitCallback('stakeholder-update', {
          activationId,
          stakeholderId: s.id,
          status: 'notifying',
          notifiedAt: s.notifiedAt,
          responseTimeSeconds: null,
        });
      });
      addLog('notifications-sent', 'Readiness OS', 'Platform', `Notifications dispatched to all ${state.stakeholders.length} stakeholders`);
      emitCallback('phase-change', { activationId, phase: 'immediate', timestamp: new Date().toISOString() });
      updateMetrics();
    }, 500);
    timers.push(t0);

    const tier1 = state.stakeholders.filter(s => s.tier === 1);
    const tier2 = state.stakeholders.filter(s => s.tier === 2);

    tier1.forEach((s, i) => {
      const delay = randomBetween(2000, 5000) + i * randomBetween(300, 800);
      const t = setTimeout(() => {
        const responseTime = parseFloat(randomFloat(1.2, 4.5).toFixed(1));
        s.status = 'acknowledged';
        s.acknowledgedAt = new Date().toISOString();
        s.responseTimeSeconds = responseTime;

        emitCallback('stakeholder-update', {
          activationId,
          stakeholderId: s.id,
          status: 'acknowledged',
          acknowledgedAt: s.acknowledgedAt,
          responseTimeSeconds: responseTime,
        });
        addLog('stakeholder-acknowledged', s.personName, s.roleName, `${s.personName} (${s.roleName}) acknowledged — response time ${responseTime}s`);
        updateMetrics();
      }, delay);
      timers.push(t);
    });

    tier2.forEach((s, i) => {
      const delay = randomBetween(5000, 8000) + i * randomBetween(400, 900);
      const t = setTimeout(() => {
        const responseTime = parseFloat(randomFloat(3.0, 8.0).toFixed(1));
        s.status = 'acknowledged';
        s.acknowledgedAt = new Date().toISOString();
        s.responseTimeSeconds = responseTime;

        emitCallback('stakeholder-update', {
          activationId,
          stakeholderId: s.id,
          status: 'acknowledged',
          acknowledgedAt: s.acknowledgedAt,
          responseTimeSeconds: responseTime,
        });
        addLog('stakeholder-acknowledged', s.personName, s.roleName, `${s.personName} (${s.roleName}) acknowledged — response time ${responseTime}s`);
        updateMetrics();
      }, delay);
      timers.push(t);
    });

    const immediateTasks = state.tasks.filter(t => t.phase === 'immediate');
    const secondaryTasks = state.tasks.filter(t => t.phase === 'secondary');
    const followUpTasks = state.tasks.filter(t => t.phase === 'follow_up');

    const scheduleTaskPhase = (
      phaseTasks: TaskState[],
      startDelayMs: number,
      durationSpanMs: number,
      phaseName: string,
    ) => {
      if (phaseTasks.length === 0) return;

      const phaseTimer = setTimeout(() => {
        emitCallback('phase-change', { activationId, phase: phaseName, timestamp: new Date().toISOString() });
        addLog('phase-started', 'Readiness OS', 'Platform', `Phase "${phaseName}" initiated`);
      }, startDelayMs);
      timers.push(phaseTimer);

      phaseTasks.forEach((task, i) => {
        const taskStartDelay = startDelayMs + (i * Math.floor(durationSpanMs / phaseTasks.length)) + randomBetween(200, 600);

        const startTimer = setTimeout(() => {
          task.status = 'in_progress';
          task.startedAt = new Date().toISOString();
          emitCallback('task-update', {
            activationId,
            taskId: task.id,
            status: 'in_progress',
            startedAt: task.startedAt,
          });
          addLog('task-started', task.ownerRole, task.ownerRole, `Task "${task.taskName}" started by ${task.ownerRole}`);
          updateMetrics();
        }, taskStartDelay);
        timers.push(startTimer);

        const completionDelay = taskStartDelay + randomBetween(1500, 3500);
        const completeTimer = setTimeout(() => {
          task.status = 'completed';
          task.completedAt = new Date().toISOString();
          emitCallback('task-update', {
            activationId,
            taskId: task.id,
            status: 'completed',
            completedAt: task.completedAt,
          });
          addLog('task-completed', task.ownerRole, task.ownerRole, `Task "${task.taskName}" completed by ${task.ownerRole}`);
          updateMetrics();
        }, completionDelay);
        timers.push(completeTimer);
      });
    };

    scheduleTaskPhase(immediateTasks, 3000, 7000, 'immediate');
    scheduleTaskPhase(secondaryTasks, 12000, 10000, 'secondary');
    scheduleTaskPhase(followUpTasks, 24000, 10000, 'follow_up');

    const metricsInterval = setInterval(() => {
      if (state.status === 'completed') {
        clearInterval(metricsInterval);
        return;
      }
      updateMetrics();
    }, 2000);
    timers.push(metricsInterval as unknown as NodeJS.Timeout);

    const completionTimer = setTimeout(() => {
      state.stakeholders.forEach(s => {
        if (s.status !== 'acknowledged') {
          const responseTime = parseFloat(randomFloat(8.0, 12.0).toFixed(1));
          s.status = 'acknowledged';
          s.acknowledgedAt = new Date().toISOString();
          s.responseTimeSeconds = responseTime;
          emitCallback('stakeholder-update', {
            activationId,
            stakeholderId: s.id,
            status: 'acknowledged',
            acknowledgedAt: s.acknowledgedAt,
            responseTimeSeconds: responseTime,
          });
        }
      });

      state.tasks.forEach(t => {
        if (t.status !== 'completed') {
          if (!t.startedAt) {
            t.startedAt = new Date().toISOString();
          }
          t.status = 'completed';
          t.completedAt = new Date().toISOString();
          emitCallback('task-update', {
            activationId,
            taskId: t.id,
            status: 'completed',
            completedAt: t.completedAt,
          });
        }
      });

      state.status = 'completed';
      state.completedAt = new Date().toISOString();
      state.metrics.coordinationPercent = 100;
      state.metrics.stakeholdersAcknowledged = state.metrics.totalStakeholders;
      state.metrics.tasksCompleted = state.metrics.totalTasks;
      const totalTimeSeconds = Math.round((Date.now() - startTime) / 1000);
      state.metrics.elapsedSeconds = totalTimeSeconds;

      addLog('activation-complete', 'Readiness OS', 'Platform', `Playbook "${state.playbookName}" execution complete — ${state.metrics.totalStakeholders} stakeholders coordinated, ${state.metrics.totalTasks} tasks completed in ${totalTimeSeconds}s (simulating 12-minute coordination)`);

      emitCallback('metrics-update', {
        activationId,
        coordinationPercent: 100,
        stakeholdersAcknowledged: state.metrics.totalStakeholders,
        tasksCompleted: state.metrics.totalTasks,
        elapsedSeconds: totalTimeSeconds,
      });

      emitCallback('activation-complete', {
        activationId,
        totalTimeSeconds,
        coordinationPercent: 100,
        summary: `${state.playbookName}: ${state.metrics.totalStakeholders} stakeholders coordinated, ${state.metrics.totalTasks} tasks completed. Simulated 12-minute coordination completed in ${totalTimeSeconds} seconds.`,
      });

      clearInterval(metricsInterval);
      this.timers.delete(activationId);
    }, 38000);
    timers.push(completionTimer);
  }

  cancelSimulation(activationId: string): void {
    const timers = this.timers.get(activationId);
    if (timers) {
      timers.forEach(t => clearTimeout(t));
      this.timers.delete(activationId);
    }
    const state = this.activations.get(activationId);
    if (state && state.status === 'running') {
      state.status = 'completed';
      state.completedAt = new Date().toISOString();
    }
  }

  getAvailablePlaybooks(): Array<{ key: string; name: string; playbookNumber: number; strategicCategory: string; stakeholderCount: number; taskCount: number }> {
    return Object.values(DEMO_PLAYBOOKS).map(p => ({
      key: p.key,
      name: p.name,
      playbookNumber: p.playbookNumber,
      strategicCategory: p.strategicCategory,
      stakeholderCount: p.stakeholders.length,
      taskCount: p.tasks.length,
    }));
  }
}

export const liveActivationService = new LiveActivationService();
