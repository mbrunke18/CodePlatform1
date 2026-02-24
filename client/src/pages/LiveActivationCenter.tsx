import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Shield,
  AlertTriangle,
  Brain,
  Clock,
  Users,
  CheckCircle2,
  Circle,
  Loader2,
  Activity,
  Zap,
  Target,
  ArrowRight,
  Play,
  X,
  ArrowLeft,
  BarChart3,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Link } from 'wouter';
import { io, Socket } from 'socket.io-client';
import { ROLE_OVERLAYS, INDUSTRY_OVERLAYS } from '@/data/activationPersonalization';
import type { RoleOverlay, IndustryOverlay } from '@/data/activationPersonalization';
import PageLayout from '@/components/layout/PageLayout';

type StakeholderStatus = 'pending' | 'notifying' | 'notified' | 'acknowledged';
type TaskStatus = 'pending' | 'in_progress' | 'completed';
type ActivationPhase = 'IMMEDIATE' | 'SECONDARY' | 'FOLLOW_UP';
type ActivationState = 'ACTIVATING' | 'IN_PROGRESS' | 'COMPLETED';

interface Stakeholder {
  id: string;
  name: string;
  title: string;
  department: string;
  tier: 1 | 2;
  status: StakeholderStatus;
  responseTime?: number;
  initials: string;
  color: string;
}

interface Task {
  id: string;
  name: string;
  owner: string;
  phase: ActivationPhase;
  status: TaskStatus;
}

interface ActivityEntry {
  id: string;
  timestamp: number;
  type: 'stakeholder' | 'task' | 'phase' | 'system';
  description: string;
}

interface PlaybookDef {
  key: string;
  name: string;
  category: 'OFFENSE' | 'DEFENSE' | 'SPECIAL TEAMS';
  description: string;
  icon: 'shield' | 'alert-triangle' | 'brain';
  stakeholderCount: number;
  taskCount: number;
  duration: string;
  color: string;
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
  'bg-teal-500', 'bg-orange-500'
];

const DEFAULT_PLAYBOOKS: PlaybookDef[] = [
  {
    key: 'ma-day1',
    name: 'M&A Day 1 Integration',
    category: 'OFFENSE',
    description: 'Coordinate Day 1 integration across all business units with synchronized stakeholder communication and task execution.',
    icon: 'shield',
    stakeholderCount: 10,
    taskCount: 12,
    duration: '12-min coordination',
    color: 'blue'
  },
  {
    key: 'ransomware',
    name: 'Ransomware Response',
    category: 'DEFENSE',
    description: 'Execute rapid incident response protocol with coordinated containment, stakeholder notification, and recovery procedures.',
    icon: 'alert-triangle',
    stakeholderCount: 10,
    taskCount: 12,
    duration: '12-min coordination',
    color: 'red'
  },
  {
    key: 'ai-governance',
    name: 'AI Governance Framework',
    category: 'SPECIAL TEAMS',
    description: 'Deploy comprehensive AI governance framework with cross-functional alignment, policy activation, and compliance verification.',
    icon: 'brain',
    stakeholderCount: 9,
    taskCount: 10,
    duration: '12-min coordination',
    color: 'purple'
  }
];

const DEFAULT_STAKEHOLDERS: Record<string, Stakeholder[]> = {
  'ma-day1': [
    { id: 's1', name: 'Sarah Chen', title: 'CEO', department: 'Executive', tier: 1, status: 'pending', initials: 'SC', color: AVATAR_COLORS[0] },
    { id: 's2', name: 'Marcus Rivera', title: 'CFO', department: 'Finance', tier: 1, status: 'pending', initials: 'MR', color: AVATAR_COLORS[1] },
    { id: 's3', name: 'Diana Park', title: 'COO', department: 'Operations', tier: 1, status: 'pending', initials: 'DP', color: AVATAR_COLORS[2] },
    { id: 's4', name: 'James Mitchell', title: 'CTO', department: 'Technology', tier: 1, status: 'pending', initials: 'JM', color: AVATAR_COLORS[3] },
    { id: 's5', name: 'Rachel Torres', title: 'CHRO', department: 'Human Resources', tier: 1, status: 'pending', initials: 'RT', color: AVATAR_COLORS[4] },
    { id: 's6', name: 'David Kim', title: 'VP Integration', department: 'PMO', tier: 2, status: 'pending', initials: 'DK', color: AVATAR_COLORS[5] },
    { id: 's7', name: 'Lisa Wang', title: 'General Counsel', department: 'Legal', tier: 2, status: 'pending', initials: 'LW', color: AVATAR_COLORS[6] },
    { id: 's8', name: 'Tom Bradley', title: 'VP Sales', department: 'Revenue', tier: 2, status: 'pending', initials: 'TB', color: AVATAR_COLORS[7] },
    { id: 's9', name: 'Ana Petrov', title: 'VP Engineering', department: 'Engineering', tier: 2, status: 'pending', initials: 'AP', color: AVATAR_COLORS[8] },
    { id: 's10', name: 'Chris Taylor', title: 'VP Communications', department: 'Comms', tier: 2, status: 'pending', initials: 'CT', color: AVATAR_COLORS[9] },
  ],
  'ransomware': [
    { id: 's1', name: 'Sarah Chen', title: 'CEO', department: 'Executive', tier: 1, status: 'pending', initials: 'SC', color: AVATAR_COLORS[0] },
    { id: 's2', name: 'James Mitchell', title: 'CISO', department: 'Security', tier: 1, status: 'pending', initials: 'JM', color: AVATAR_COLORS[1] },
    { id: 's3', name: 'Diana Park', title: 'COO', department: 'Operations', tier: 1, status: 'pending', initials: 'DP', color: AVATAR_COLORS[2] },
    { id: 's4', name: 'Marcus Rivera', title: 'CFO', department: 'Finance', tier: 1, status: 'pending', initials: 'MR', color: AVATAR_COLORS[3] },
    { id: 's5', name: 'Lisa Wang', title: 'General Counsel', department: 'Legal', tier: 1, status: 'pending', initials: 'LW', color: AVATAR_COLORS[4] },
    { id: 's6', name: 'Tom Bradley', title: 'IR Lead', department: 'Security Ops', tier: 2, status: 'pending', initials: 'TB', color: AVATAR_COLORS[5] },
    { id: 's7', name: 'Ana Petrov', title: 'VP Engineering', department: 'Engineering', tier: 2, status: 'pending', initials: 'AP', color: AVATAR_COLORS[6] },
    { id: 's8', name: 'David Kim', title: 'VP Infrastructure', department: 'IT', tier: 2, status: 'pending', initials: 'DK', color: AVATAR_COLORS[7] },
    { id: 's9', name: 'Rachel Torres', title: 'VP HR', department: 'Human Resources', tier: 2, status: 'pending', initials: 'RT', color: AVATAR_COLORS[8] },
    { id: 's10', name: 'Chris Taylor', title: 'VP Communications', department: 'Comms', tier: 2, status: 'pending', initials: 'CT', color: AVATAR_COLORS[9] },
  ],
  'ai-governance': [
    { id: 's1', name: 'Sarah Chen', title: 'CEO', department: 'Executive', tier: 1, status: 'pending', initials: 'SC', color: AVATAR_COLORS[0] },
    { id: 's2', name: 'James Mitchell', title: 'CTO', department: 'Technology', tier: 1, status: 'pending', initials: 'JM', color: AVATAR_COLORS[1] },
    { id: 's3', name: 'Lisa Wang', title: 'General Counsel', department: 'Legal', tier: 1, status: 'pending', initials: 'LW', color: AVATAR_COLORS[2] },
    { id: 's4', name: 'Marcus Rivera', title: 'Chief Ethics Officer', department: 'Ethics', tier: 1, status: 'pending', initials: 'MR', color: AVATAR_COLORS[3] },
    { id: 's5', name: 'Diana Park', title: 'COO', department: 'Operations', tier: 1, status: 'pending', initials: 'DP', color: AVATAR_COLORS[4] },
    { id: 's6', name: 'Ana Petrov', title: 'VP AI/ML', department: 'Data Science', tier: 2, status: 'pending', initials: 'AP', color: AVATAR_COLORS[5] },
    { id: 's7', name: 'David Kim', title: 'VP Compliance', department: 'Compliance', tier: 2, status: 'pending', initials: 'DK', color: AVATAR_COLORS[6] },
    { id: 's8', name: 'Rachel Torres', title: 'VP Product', department: 'Product', tier: 2, status: 'pending', initials: 'RT', color: AVATAR_COLORS[7] },
    { id: 's9', name: 'Chris Taylor', title: 'VP Communications', department: 'Comms', tier: 2, status: 'pending', initials: 'CT', color: AVATAR_COLORS[8] },
  ]
};

const DEFAULT_TASKS: Record<string, Task[]> = {
  'ma-day1': [
    { id: 't1', name: 'Activate Integration War Room', owner: 'PMO Lead', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't2', name: 'Notify Tier 1 Stakeholders', owner: 'Comms Lead', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't3', name: 'Lock Financial Systems Access', owner: 'CFO', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't4', name: 'Deploy Day 1 Communications', owner: 'VP Comms', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't5', name: 'Begin IT Systems Integration', owner: 'CTO', phase: 'SECONDARY', status: 'pending' },
    { id: 't6', name: 'Activate HR Transition Plans', owner: 'CHRO', phase: 'SECONDARY', status: 'pending' },
    { id: 't7', name: 'Customer Notification Sequence', owner: 'VP Sales', phase: 'SECONDARY', status: 'pending' },
    { id: 't8', name: 'Regulatory Filing Submission', owner: 'Legal', phase: 'SECONDARY', status: 'pending' },
    { id: 't9', name: 'Vendor Contract Review', owner: 'Procurement', phase: 'FOLLOW_UP', status: 'pending' },
    { id: 't10', name: 'Brand Alignment Assessment', owner: 'Marketing', phase: 'FOLLOW_UP', status: 'pending' },
    { id: 't11', name: 'Cross-team Sync Cadence Setup', owner: 'PMO Lead', phase: 'FOLLOW_UP', status: 'pending' },
    { id: 't12', name: 'Integration Dashboard Go-Live', owner: 'CTO', phase: 'FOLLOW_UP', status: 'pending' },
  ],
  'ransomware': [
    { id: 't1', name: 'Isolate Affected Systems', owner: 'CISO', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't2', name: 'Activate Incident Response Team', owner: 'IR Lead', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't3', name: 'Notify Executive Leadership', owner: 'Comms Lead', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't4', name: 'Engage Forensics Team', owner: 'CISO', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't5', name: 'Assess Data Exposure Scope', owner: 'VP Engineering', phase: 'SECONDARY', status: 'pending' },
    { id: 't6', name: 'Notify Legal & Compliance', owner: 'General Counsel', phase: 'SECONDARY', status: 'pending' },
    { id: 't7', name: 'Activate Backup Recovery', owner: 'VP Infrastructure', phase: 'SECONDARY', status: 'pending' },
    { id: 't8', name: 'Customer Impact Assessment', owner: 'VP Comms', phase: 'SECONDARY', status: 'pending' },
    { id: 't9', name: 'Regulatory Notification Prep', owner: 'Legal', phase: 'FOLLOW_UP', status: 'pending' },
    { id: 't10', name: 'Insurance Claim Initiation', owner: 'CFO', phase: 'FOLLOW_UP', status: 'pending' },
    { id: 't11', name: 'Systems Restoration Plan', owner: 'CTO', phase: 'FOLLOW_UP', status: 'pending' },
    { id: 't12', name: 'Post-Incident Review Setup', owner: 'CISO', phase: 'FOLLOW_UP', status: 'pending' },
  ],
  'ai-governance': [
    { id: 't1', name: 'Activate AI Ethics Board', owner: 'Chief Ethics Officer', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't2', name: 'Inventory Active AI Models', owner: 'VP AI/ML', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't3', name: 'Notify Regulatory Stakeholders', owner: 'VP Compliance', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't4', name: 'Deploy Governance Dashboard', owner: 'CTO', phase: 'IMMEDIATE', status: 'pending' },
    { id: 't5', name: 'Bias Audit Initialization', owner: 'VP AI/ML', phase: 'SECONDARY', status: 'pending' },
    { id: 't6', name: 'Data Privacy Impact Assessment', owner: 'General Counsel', phase: 'SECONDARY', status: 'pending' },
    { id: 't7', name: 'Stakeholder Training Schedule', owner: 'VP Product', phase: 'SECONDARY', status: 'pending' },
    { id: 't8', name: 'Policy Document Distribution', owner: 'VP Comms', phase: 'FOLLOW_UP', status: 'pending' },
    { id: 't9', name: 'Compliance Monitoring Setup', owner: 'VP Compliance', phase: 'FOLLOW_UP', status: 'pending' },
    { id: 't10', name: 'Board Reporting Framework', owner: 'CEO', phase: 'FOLLOW_UP', status: 'pending' },
  ]
};

const CHANNELS = ['Slack', 'Email', 'SMS', 'Teams', 'Push Notification'];

function getPlaybookIcon(icon: string) {
  switch (icon) {
    case 'shield': return <Shield className="w-8 h-8" />;
    case 'alert-triangle': return <AlertTriangle className="w-8 h-8" />;
    case 'brain': return <Brain className="w-8 h-8" />;
    default: return <Shield className="w-8 h-8" />;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'OFFENSE': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', ring: 'ring-blue-500', solid: 'bg-blue-500' };
    case 'DEFENSE': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', ring: 'ring-red-500', solid: 'bg-red-500' };
    case 'SPECIAL TEAMS': return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', ring: 'ring-purple-500', solid: 'bg-purple-500' };
    default: return { bg: 'bg-gray-500/10', text: 'text-gray-600', border: 'border-gray-500/30', ring: 'ring-gray-500', solid: 'bg-gray-500' };
  }
}

const DEMO_DURATION = 90;
const SIMULATED_DURATION = 720;
const TIME_SCALE = SIMULATED_DURATION / DEMO_DURATION;

function toSimulatedTime(realSeconds: number): number {
  return Math.min(Math.round(realSeconds * TIME_SCALE), SIMULATED_DURATION);
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}


export default function LiveActivationCenter() {
  const params = new URLSearchParams(window.location.search);
  const urlPlaybook = params.get('playbook');
  const urlRole = params.get('role');
  const urlIndustry = params.get('industry');

  const initialPlaybook = (urlPlaybook && DEFAULT_PLAYBOOKS.some(p => p.key === urlPlaybook)) ? urlPlaybook : 'ma-day1';
  const roleOverlay: RoleOverlay | null = urlRole ? ROLE_OVERLAYS[urlRole.toLowerCase()] || null : null;
  const industryOverlay: IndustryOverlay | null = urlIndustry ? INDUSTRY_OVERLAYS[urlIndustry.toLowerCase()] || null : null;
  const contextLabel = roleOverlay?.label || industryOverlay?.label || null;
  const contextPerspective = roleOverlay?.perspective || industryOverlay?.perspective || null;
  const activeKpis = industryOverlay?.kpis || roleOverlay?.kpis || null;
  const highlightedTaskIds = roleOverlay?.highlightedTaskIds || [];

  const [selectedPlaybook, setSelectedPlaybook] = useState<string>(initialPlaybook);
  const [activationId, setActivationId] = useState<string | null>(null);
  const [activationState, setActivationState] = useState<ActivationState>('ACTIVATING');
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEntry[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<ActivationPhase>('IMMEDIATE');
  const [showCompletion, setShowCompletion] = useState(false);
  const [liveDispatchResults, setLiveDispatchResults] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const simulationRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const activePlaybook = DEFAULT_PLAYBOOKS.find(p => p.key === selectedPlaybook);

  const { data: orgData } = useQuery({
    queryKey: ['/api/organizations'],
    retry: false,
    staleTime: 60000,
  });
  const organizationId = (orgData as any)?.[0]?.id || null;

  const { data: integrationStatus } = useQuery({
    queryKey: ['/api/activation/integrations-status', organizationId],
    enabled: !!organizationId,
    retry: false,
    staleTime: 30000,
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/activation/integrations-status?organizationId=${organizationId}`);
      return res.json();
    },
  });

  const hasJira = integrationStatus?.jira?.connected === true;
  const hasSlack = integrationStatus?.slack?.connected === true;
  const hasLiveIntegrations = hasJira || hasSlack;

  const { data: playbooksData } = useQuery({
    queryKey: ['/api/activation/playbooks'],
    retry: false,
    staleTime: 60000,
  });

  const playbooks: PlaybookDef[] = (() => {
    if (!playbooksData) return DEFAULT_PLAYBOOKS;
    const raw = playbooksData as any;
    return Array.isArray(raw) ? raw : Array.isArray(raw?.playbooks) ? raw.playbooks : DEFAULT_PLAYBOOKS;
  })();

  const activateMutation = useMutation({
    mutationFn: async (playbookKey: string) => {
      const res = await apiRequest('POST', '/api/activation/activate', { playbookKey });
      return res.json();
    },
    onSuccess: (data: any) => {
      const id = data?.activation?.id || data?.activationId || data?.id || `local-${Date.now()}`;
      beginActivation(id);
    },
    onError: () => {
      beginActivation(`local-${Date.now()}`);
    }
  });

  const addActivity = useCallback((type: ActivityEntry['type'], description: string, ts?: number) => {
    setActivityFeed(prev => [
      ...prev,
      {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: ts ?? Math.floor((Date.now() - startTimeRef.current) / 1000),
        type,
        description,
      }
    ]);
  }, []);

  const beginActivation = useCallback((id: string) => {
    setActivationId(id);
    setActivationState('ACTIVATING');
    setElapsedSeconds(0);
    setCurrentPhase('IMMEDIATE');
    setShowCompletion(false);
    setActivityFeed([]);
    setLiveDispatchResults(null);
    startTimeRef.current = Date.now();

    const playbookKey = selectedPlaybook;
    const industryStakeholders = industryOverlay?.stakeholders?.[playbookKey];
    const industryTasks = industryOverlay?.tasks?.[playbookKey];
    const initialStakeholders = (industryStakeholders || DEFAULT_STAKEHOLDERS[playbookKey] || DEFAULT_STAKEHOLDERS['ma-day1']).map(s => ({ ...s, status: 'pending' as StakeholderStatus }));
    const initialTasks = (industryTasks || DEFAULT_TASKS[playbookKey] || DEFAULT_TASKS['ma-day1']).map(t => ({ ...t, status: 'pending' as TaskStatus }));

    setStakeholders(initialStakeholders);
    setTasks(initialTasks);

    if (hasLiveIntegrations && organizationId && activePlaybook) {
      const dispatchPayload = {
        organizationId,
        playbookName: activePlaybook.name,
        tasks: initialTasks.map(t => ({ name: t.name, owner: t.owner, phase: t.phase })),
        stakeholders: initialStakeholders.map(s => ({ name: s.name, title: s.title })),
      };
      apiRequest('POST', '/api/activation/dispatch-live', dispatchPayload)
        .then(r => r.json())
        .then(result => {
          setLiveDispatchResults(result);
          if (result.jira?.length > 0) {
            const created = result.jira.filter((r: any) => r.success);
            if (created.length > 0) {
              addActivity('system', `⚡ LIVE: ${created.length} Jira issue(s) created in your workspace`);
              created.forEach((r: any) => {
                addActivity('task', `⚡ Jira ${r.detail?.key}: ${r.detail?.taskName}`);
              });
            }
          }
          if (result.slack?.length > 0) {
            const sent = result.slack.filter((r: any) => r.success);
            if (sent.length > 0) {
              addActivity('system', `⚡ LIVE: Activation notification sent to Slack`);
            }
          }
        })
        .catch(() => {});
    }

    setTimeout(() => {
      setActivationState('IN_PROGRESS');
      addActivity('system', 'Playbook activated — coordination sequence initiated', 0);
    }, 1500);

    const socket = io({ path: '/socket.io/' });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-activation', id);
    });

    socket.on('stakeholder-update', (data: any) => {
      if (data?.id) {
        setStakeholders(prev => prev.map(s => s.id === data.id ? { ...s, ...data } : s));
      }
    });
    socket.on('task-update', (data: any) => {
      if (data?.id) {
        setTasks(prev => prev.map(t => t.id === data.id ? { ...t, ...data } : t));
      }
    });
    socket.on('activity-log', (data: any) => {
      if (data?.description) {
        addActivity(data.type || 'system', data.description, data.timestamp);
      }
    });
    socket.on('metrics-update', () => {});
    socket.on('phase-change', (data: any) => {
      if (data?.phase) setCurrentPhase(data.phase);
    });
    socket.on('activation-complete', () => {
      completeActivation();
    });

    runClientSimulation(initialStakeholders, initialTasks, playbookKey);
  }, [selectedPlaybook, addActivity, industryOverlay, hasLiveIntegrations, organizationId, activePlaybook]);

  const runClientSimulation = useCallback((initStakeholders: Stakeholder[], initTasks: Task[], playbookKey: string) => {
    simulationRef.current.forEach(t => clearTimeout(t));
    simulationRef.current = [];

    const totalTime = 90;
    const stakeholderCount = initStakeholders.length;
    const taskCount = initTasks.length;

    initStakeholders.forEach((s, i) => {
      const notifyDelay = 2000 + i * 800;
      const t1 = setTimeout(() => {
        setStakeholders(prev => prev.map(st => st.id === s.id ? { ...st, status: 'notifying' } : st));
      }, notifyDelay);

      const notifiedDelay = notifyDelay + 1500 + Math.random() * 2000;
      const t2 = setTimeout(() => {
        setStakeholders(prev => prev.map(st => st.id === s.id ? { ...st, status: 'notified' } : st));
        addActivity('system', `Notification sent to ${s.name} (${s.title}) via ${CHANNELS[i % CHANNELS.length]}`);
      }, notifiedDelay);

      const ackBase = totalTime * 1000 / (stakeholderCount + 2);
      const ackDelay = notifiedDelay + 3000 + (ackBase * 0.3) + Math.random() * ackBase * 0.8;
      const responseTime = Math.floor((ackDelay - notifiedDelay) / 1000);
      const t3 = setTimeout(() => {
        setStakeholders(prev => prev.map(st => st.id === s.id ? { ...st, status: 'acknowledged', responseTime } : st));
        addActivity('stakeholder', `${s.name} (${s.title}) acknowledged via ${CHANNELS[i % CHANNELS.length]}`);
      }, Math.min(ackDelay, (totalTime - 60) * 1000));

      simulationRef.current.push(t1, t2, t3);
    });

    const phases: ActivationPhase[] = ['IMMEDIATE', 'SECONDARY', 'FOLLOW_UP'];
    const phaseTimings = [0, totalTime * 0.2, totalTime * 0.5];

    phases.forEach((phase, pi) => {
      if (pi > 0) {
        const t = setTimeout(() => {
          setCurrentPhase(phase);
          const label = phase === 'SECONDARY' ? 'SECONDARY' : 'FOLLOW UP';
          addActivity('phase', `Phase transition: ${phases[pi - 1].replace('_', ' ')} → ${label}`);
        }, phaseTimings[pi] * 1000);
        simulationRef.current.push(t);
      }
    });

    initTasks.forEach((task, i) => {
      const phaseIndex = phases.indexOf(task.phase);
      const phaseStart = phaseTimings[phaseIndex] * 1000;
      const phaseTasks = initTasks.filter(t => t.phase === task.phase);
      const posInPhase = phaseTasks.findIndex(t => t.id === task.id);
      const phaseEnd = (phaseIndex < 2 ? phaseTimings[phaseIndex + 1] : totalTime) * 1000;
      const taskInterval = (phaseEnd - phaseStart) / (phaseTasks.length + 1);
      const startDelay = phaseStart + taskInterval * (posInPhase + 0.5);

      const t1 = setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'in_progress' } : t));
      }, startDelay);

      const completeDelay = startDelay + 3000 + Math.random() * 5000;
      const t2 = setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
        addActivity('task', `Task: ${task.name} — COMPLETED`);
      }, Math.min(completeDelay, (totalTime - 30) * 1000));

      simulationRef.current.push(t1, t2);
    });

    const completionTimer = setTimeout(() => {
      completeActivation();
    }, totalTime * 1000);
    simulationRef.current.push(completionTimer);
  }, [addActivity]);

  const completeActivation = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setActivationState('COMPLETED');
    setStakeholders(prev => prev.map(s => s.status !== 'acknowledged' ? { ...s, status: 'acknowledged', responseTime: Math.floor(Math.random() * 30 + 10) } : s));
    setTasks(prev => prev.map(t => t.status !== 'completed' ? { ...t, status: 'completed' } : t));
    addActivity('system', 'All coordination tasks complete — activation successful');
    setTimeout(() => setShowCompletion(true), 800);
  }, [addActivity]);

  useEffect(() => {
    if (!activationId) return;
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 200);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activationId]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activityFeed]);

  useEffect(() => {
    return () => {
      simulationRef.current.forEach(t => clearTimeout(t));
      if (socketRef.current) socketRef.current.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const cancelActivation = () => {
    simulationRef.current.forEach(t => clearTimeout(t));
    if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setActivationId(null);
    setShowCompletion(false);
  };

  const runAnother = () => {
    cancelActivation();
  };

  const handleActivate = () => {
    activateMutation.mutate(selectedPlaybook);
  };

  const acknowledgedCount = stakeholders.filter(s => s.status === 'acknowledged').length;
  const completedTaskCount = tasks.filter(t => t.status === 'completed').length;
  const coordinationPct = stakeholders.length > 0 ? Math.round((acknowledgedCount / stakeholders.length) * 100) : 0;
  const taskPct = tasks.length > 0 ? Math.round((completedTaskCount / tasks.length) * 100) : 0;

  const phaseLabel = currentPhase === 'FOLLOW_UP' ? 'FOLLOW UP' : currentPhase;
  const simulatedSeconds = toSimulatedTime(elapsedSeconds);

  if (!activationId) {
    return (
      <PageLayout>
      <div className="min-h-screen bg-white text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Execution OS
            </Link>
          </div>
          {(roleOverlay || industryOverlay) && (
            <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
              <div className="p-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">
                    {roleOverlay ? `${contextLabel} Perspective` : `${contextLabel} Industry`}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{contextPerspective}</p>
              </div>

              {industryOverlay && (
                <div className="px-4 pb-3 border-t border-emerald-500/10 pt-3">
                  <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">Scenario</div>
                  <div className="text-sm font-medium text-white mb-1">{industryOverlay.scenario}</div>
                  <div className="text-xs text-gray-600">{industryOverlay.organization}</div>
                </div>
              )}

              {roleOverlay && (
                <div className="px-4 pb-3 border-t border-emerald-500/10 pt-3">
                  <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">Your Priority Actions</div>
                  <div className="space-y-1">
                    {roleOverlay.yourActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeKpis && (
                <div className="px-4 pb-4 border-t border-emerald-500/10 pt-3">
                  <div className="grid grid-cols-3 gap-3">
                    {activeKpis.map((kpi, i) => (
                      <div key={i} className="text-center">
                        <div className={cn('text-sm font-bold', kpi.color)}>{kpi.value}</div>
                        <div className="text-[10px] text-gray-600">{kpi.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-emerald-400" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Live Activation Command Center</h1>
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Watch strategic coordination unfold in real-time. Select a playbook and see how Execution OS orchestrates cross-functional alignment in under 12 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {playbooks.map((pb) => {
              const colors = getCategoryColor(pb.category);
              const isSelected = selectedPlaybook === pb.key;
              return (
                <button
                  key={pb.key}
                  onClick={() => setSelectedPlaybook(pb.key)}
                  className={cn(
                    'relative text-left rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer',
                    'bg-white hover:bg-gray-800/80',
                    isSelected
                      ? `${colors.border} ring-2 ${colors.ring} shadow-lg`
                      : 'border-gray-200 hover:border-gray-700'
                  )}
                >
                  {isSelected && (
                    <div className={cn('absolute top-3 right-3 w-3 h-3 rounded-full', colors.solid)} />
                  )}
                  <Badge className={cn('mb-4 text-xs font-semibold tracking-wider', colors.bg, colors.text, 'border-0')}>
                    {pb.category}
                  </Badge>
                  <div className={cn('mb-4', colors.text)}>
                    {getPlaybookIcon(pb.icon)}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{pb.name}</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">{pb.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {pb.stakeholderCount} stakeholders
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" /> {pb.taskCount} tasks
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {pb.duration}
                  </div>
                </button>
              );
            })}
          </div>

          {hasLiveIntegrations && (
            <div className="mb-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Live Integrations Active</span>
                <Badge className="text-[10px] border-0 bg-cyan-500/20 text-cyan-300 ml-auto">CONNECTED</Badge>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Activating this playbook will push real tasks and notifications to your connected tools:
              </p>
              <div className="flex items-center gap-3">
                {hasJira && (
                  <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-medium text-blue-400">Jira</span>
                    <span className="text-[10px] text-gray-600">Tasks will be created</span>
                  </div>
                )}
                {hasSlack && (
                  <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-xs font-medium text-purple-400">Slack</span>
                    <span className="text-[10px] text-gray-600">Notifications will be sent</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center">
            <Button
              size="lg"
              onClick={handleActivate}
              disabled={activateMutation.isPending}
              className={cn(
                'text-lg px-12 py-7 font-bold tracking-wide rounded-xl transition-all duration-300',
                'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20',
                'disabled:opacity-50'
              )}
            >
              {activateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  INITIALIZING...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {hasLiveIntegrations ? 'ACTIVATE PLAYBOOK (LIVE)' : 'ACTIVATE PLAYBOOK'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            {!hasLiveIntegrations && (
              <p className="text-xs text-gray-600 mt-3">
                <Link href="/integrations/connections" className="text-gray-600 hover:text-gray-300 underline">Connect Jira or Slack</Link>
                {' '}to push real tasks and notifications during activation
              </p>
            )}
          </div>
        </div>
      </div>
      </PageLayout>
    );
  }

  if (showCompletion) {
    const avgResponseTime = stakeholders.length > 0
      ? Math.round(stakeholders.reduce((sum, s) => sum + (s.responseTime || 0), 0) / stakeholders.length)
      : 0;
    const tier1Stakeholders = stakeholders.filter(s => s.tier === 1);
    const tier2Stakeholders = stakeholders.filter(s => s.tier === 2);

    return (
      <PageLayout>
      <div className="min-h-screen bg-white text-white p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 md:py-12">
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 animate-[pulse_2s_ease-in-out_infinite]">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Coordination Complete</h1>
            <p className="text-gray-600 mb-4 text-lg">All stakeholders aligned and tasks executed successfully.</p>
            {industryOverlay && (
              <div className="mb-4 text-sm text-gray-600">
                <span className="text-white font-medium">{industryOverlay.scenario}</span> — {industryOverlay.organization}
              </div>
            )}
            {roleOverlay && (
              <div className="mb-4 text-sm text-gray-600">
                Viewed as <span className="text-white font-medium">{roleOverlay.label}</span>
              </div>
            )}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Full coordination in under 12 minutes — vs. 3-6 weeks traditional</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-emerald-400">{formatElapsed(simulatedSeconds)}</div>
              <div className="text-xs text-gray-600 mt-1">Execution Time</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-emerald-400">{acknowledgedCount}/{stakeholders.length}</div>
              <div className="text-xs text-gray-600 mt-1">Stakeholders Reached</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-emerald-400">{completedTaskCount}/{tasks.length}</div>
              <div className="text-xs text-gray-600 mt-1">Tasks Completed</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-blue-400">{formatElapsed(toSimulatedTime(avgResponseTime))}</div>
              <div className="text-xs text-gray-600 mt-1">Avg Response Time</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Executive After-Action Brief</h2>
              <Badge className="text-[10px] border-0 bg-blue-500/10 text-blue-400 font-semibold ml-auto">AUTO-GENERATED</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-gray-600 mb-3 uppercase">Playbook Executed</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('p-2 rounded-lg', getCategoryColor(activePlaybook?.category || 'OFFENSE').bg)}>
                    {getPlaybookIcon(activePlaybook?.icon || 'shield')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{activePlaybook?.name}</div>
                    <Badge className={cn('text-[10px] border-0 mt-1', getCategoryColor(activePlaybook?.category || 'OFFENSE').bg, getCategoryColor(activePlaybook?.category || 'OFFENSE').text)}>
                      {activePlaybook?.category}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-xs font-bold tracking-wider text-gray-600 mb-3 uppercase">Coordination Channels</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Slack', 'Email', 'SMS', 'Teams', 'Push'].map(ch => (
                    <Badge key={ch} variant="outline" className="text-[10px] border-gray-200 text-gray-600">{ch}</Badge>
                  ))}
                </div>

                <h3 className="text-xs font-bold tracking-wider text-gray-600 mb-3 uppercase">Phase Breakdown</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Immediate', count: tasks.filter(t => t.phase === 'IMMEDIATE').length, color: 'text-red-400' },
                    { label: 'Secondary', count: tasks.filter(t => t.phase === 'SECONDARY').length, color: 'text-amber-400' },
                    { label: 'Follow Up', count: tasks.filter(t => t.phase === 'FOLLOW_UP').length, color: 'text-blue-400' },
                  ].map(p => (
                    <div key={p.label} className="flex items-center justify-between text-sm">
                      <span className={cn('font-medium', p.color)}>{p.label}</span>
                      <span className="text-gray-600">{p.count} tasks completed</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-wider text-gray-600 mb-3 uppercase">Tier 1 Leadership ({tier1Stakeholders.length})</h3>
                <div className="space-y-1.5 mb-4">
                  {tier1Stakeholders.map(s => (
                    <div key={s.id} className="flex items-center gap-2">
                      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0', s.color)}>{s.initials}</div>
                      <span className="text-xs text-gray-300 flex-1 truncate">{s.name} — {s.title}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>

                <h3 className="text-xs font-bold tracking-wider text-gray-600 mb-3 uppercase">Tier 2 Functional ({tier2Stakeholders.length})</h3>
                <div className="space-y-1.5 mb-4">
                  {tier2Stakeholders.map(s => (
                    <div key={s.id} className="flex items-center gap-2">
                      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0', s.color)}>{s.initials}</div>
                      <span className="text-xs text-gray-300 flex-1 truncate">{s.name} — {s.title}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>

                {(() => {
                  const metrics = industryOverlay?.completionMetrics || roleOverlay?.completionMetrics || null;
                  return metrics ? (
                    <>
                      <h3 className="text-xs font-bold tracking-wider text-gray-600 mb-3 uppercase">
                        {roleOverlay ? `${roleOverlay.label} Impact` : industryOverlay ? `${industryOverlay.label} Impact` : 'Impact'} vs. Traditional
                      </h3>
                      <div className="space-y-3">
                        {metrics.map((m, i) => (
                          <div key={i} className="space-y-1">
                            <div className="text-xs font-medium text-gray-600">{m.label}</div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-red-400/70 line-through text-xs">{m.before}</span>
                              <ArrowRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
                              <span className="text-emerald-400 font-semibold text-xs">{m.after}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xs font-bold tracking-wider text-gray-600 mb-3 uppercase">Impact vs. Traditional</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Time Saved</span>
                          <span className="text-emerald-400 font-semibold">3-6 weeks → 12 min</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5 text-blue-400" /> Cost Reduction</span>
                          <span className="text-blue-400 font-semibold">~85% lower</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1"><Users className="w-3.5 h-3.5 text-purple-400" /> Coordination</span>
                          <span className="text-purple-400 font-semibold">100% simultaneous</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {liveDispatchResults && (liveDispatchResults.jira?.length > 0 || liveDispatchResults.slack?.length > 0) && (
            <div className="bg-white border border-cyan-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Live Integration Results</h2>
                <Badge className="text-[10px] border-0 bg-cyan-500/20 text-cyan-300 ml-auto">REAL DATA</Badge>
              </div>
              {liveDispatchResults.jira?.filter((r: any) => r.success).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold tracking-wider text-gray-600 mb-2 uppercase">Jira Issues Created</h3>
                  <div className="space-y-1.5">
                    {liveDispatchResults.jira.filter((r: any) => r.success).map((r: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="text-blue-400 font-mono text-xs">{r.detail?.key}</span>
                        <span className="text-gray-300 text-xs">{r.detail?.taskName}</span>
                        {r.detail?.url && (
                          <a href={r.detail.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-600 hover:text-blue-400 ml-auto">View</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {liveDispatchResults.slack?.filter((r: any) => r.success).length > 0 && (
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-gray-600 mb-2 uppercase">Slack Notifications</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300 text-xs">Activation alert sent to Slack workspace</span>
                  </div>
                </div>
              )}
              {liveDispatchResults.summary && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                  {liveDispatchResults.summary}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={runAnother}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-6 text-lg rounded-xl w-full sm:w-auto"
            >
              Run Another Demo
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-200 text-gray-300 hover:bg-gray-800 hover:text-white px-10 py-6 text-lg rounded-xl w-full"
              >
                Back to Execution OS
              </Button>
            </Link>
          </div>
        </div>
      </div>
      </PageLayout>
    );
  }

  const immediateT = tasks.filter(t => t.phase === 'IMMEDIATE');
  const secondaryT = tasks.filter(t => t.phase === 'SECONDARY');
  const followUpT = tasks.filter(t => t.phase === 'FOLLOW_UP');

  return (
    <PageLayout>
    <div className="min-h-screen bg-white text-white">
      <div className="border-b border-gray-200 bg-white backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <h2 className="text-sm md:text-lg font-bold truncate">{activePlaybook?.name}</h2>
            {activePlaybook && (
              <Badge className={cn('text-[10px] md:text-xs font-semibold border-0 hidden sm:inline-flex', getCategoryColor(activePlaybook.category).bg, getCategoryColor(activePlaybook.category).text)}>
                {activePlaybook.category}
              </Badge>
            )}
            <Badge className={cn(
              'text-[10px] md:text-xs font-semibold border-0',
              activationState === 'ACTIVATING' ? 'bg-yellow-500/10 text-yellow-400' :
              activationState === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400' :
              'bg-emerald-500/10 text-emerald-400'
            )}>
              {activationState === 'ACTIVATING' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              {activationState === 'ACTIVATING' ? 'ACTIVATING...' : activationState === 'IN_PROGRESS' ? 'IN PROGRESS' : 'COMPLETED'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-1.5 text-gray-300 font-mono text-sm md:text-lg">
                <Clock className="w-4 h-4 text-gray-600" />
                {formatElapsed(simulatedSeconds)}
              </div>
              <Badge className="text-[9px] md:text-[10px] border-0 bg-amber-500/10 text-amber-400 font-semibold">8x ACCELERATED</Badge>
            {hasLiveIntegrations && (
              <Badge className="text-[9px] md:text-[10px] border-0 bg-cyan-500/10 text-cyan-400 font-semibold hidden sm:inline-flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                LIVE
              </Badge>
            )}
            </div>
            <Button variant="ghost" size="sm" onClick={cancelActivation} className="text-gray-600 hover:text-white hover:bg-gray-800 px-2 md:px-3">
              <X className="w-4 h-4" /><span className="hidden sm:inline ml-1">Cancel</span>
            </Button>
          </div>
        </div>
      </div>

      {activeKpis && (
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-[1800px] mx-auto px-4 py-2 flex items-center justify-center gap-6 md:gap-10">
            {contextLabel && (
              <span className="text-xs font-semibold text-emerald-400 hidden sm:inline">
                {roleOverlay ? `${contextLabel} View` : `${contextLabel}`}
              </span>
            )}
            {activeKpis.map((kpi, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-600">{kpi.label}:</span>
                <span className={cn('font-semibold', kpi.color)}>{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[1800px] mx-auto p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="lg:col-span-1 space-y-3">
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" /> Stakeholder Coordination
                </CardTitle>
                <span className="text-xs text-emerald-400 font-mono">{acknowledgedCount}/{stakeholders.length} acknowledged</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              {stakeholders.map(s => (
                <div key={s.id} className={cn(
                  'flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300',
                  s.status === 'acknowledged'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : s.status === 'notifying'
                    ? 'bg-yellow-500/5 border-yellow-500/20'
                    : s.status === 'notified'
                    ? 'bg-blue-500/5 border-blue-500/20'
                    : 'bg-gray-50 border-gray-200'
                )}>
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0', s.color)}>
                    {s.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{s.name}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gray-200 text-gray-600">
                        Tier {s.tier}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 truncate">{s.title} · {s.department}</div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {s.status === 'pending' && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-gray-600" />
                        <span className="text-xs text-gray-600">Pending</span>
                      </>
                    )}
                    {s.status === 'notifying' && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                        <span className="text-xs text-yellow-400">Notifying...</span>
                      </>
                    )}
                    {s.status === 'notified' && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-xs text-blue-400">Notified</span>
                      </>
                    )}
                    {s.status === 'acknowledged' && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs text-emerald-400">{formatElapsed(toSimulatedTime(s.responseTime || 0))}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-3">
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" /> Execution Tasks
                </CardTitle>
                <span className="text-xs text-emerald-400 font-mono">{completedTaskCount}/{tasks.length} complete</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              {[
                { label: 'IMMEDIATE (0-2 min)', items: immediateT },
                { label: 'SECONDARY (2-6 min)', items: secondaryT },
                { label: 'FOLLOW UP (6-12 min)', items: followUpT },
              ].map(group => (
                group.items.length > 0 && (
                  <div key={group.label}>
                    <div className="text-[10px] font-bold tracking-widest text-gray-600 mb-2 uppercase">{group.label}</div>
                    <div className="space-y-1.5">
                      {group.items.map(task => {
                        const isYourTask = highlightedTaskIds.includes(task.id);
                        return (
                        <div key={task.id} className={cn(
                          'flex items-center gap-2.5 p-2 rounded-lg transition-all duration-300',
                          isYourTask && task.status !== 'completed' ? 'ring-1 ring-amber-500/30 bg-amber-500/5' :
                          task.status === 'completed' ? 'bg-emerald-500/5' :
                          task.status === 'in_progress' ? 'bg-blue-500/5' : 'bg-gray-50'
                        )}>
                          {task.status === 'pending' && <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                          {task.status === 'in_progress' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />}
                          {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={cn(
                                'text-sm truncate',
                                task.status === 'completed' ? 'text-gray-600' :
                                task.status === 'in_progress' ? 'text-white' : 'text-gray-600'
                              )}>{task.name}</span>
                              {isYourTask && (
                                <Badge className="text-[8px] px-1 py-0 bg-amber-500/20 text-amber-400 border-0 flex-shrink-0">YOU</Badge>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gray-200 text-gray-600 flex-shrink-0">
                            {task.owner}
                          </Badge>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-3">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgb(31 41 55)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke="rgb(16 185 129)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - Math.min(simulatedSeconds / SIMULATED_DURATION, 1))}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-mono text-white">{formatElapsed(simulatedSeconds)}</span>
                  <span className="text-[10px] text-gray-600">EXECUTION TIME</span>
                </div>
              </div>
              <div className="text-xs text-gray-600 font-semibold tracking-wider mb-6">12-MINUTE COORDINATION CYCLE</div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-emerald-400">{coordinationPct}%</div>
                  <div className="text-[10px] text-gray-600 mt-1">Coordination</div>
                  <Progress value={coordinationPct} className="h-1 mt-2 bg-gray-50" />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-blue-400">{acknowledgedCount}/{stakeholders.length}</div>
                  <div className="text-[10px] text-gray-600 mt-1">Stakeholders</div>
                  <Progress value={stakeholders.length > 0 ? (acknowledgedCount / stakeholders.length) * 100 : 0} className="h-1 mt-2 bg-gray-50" />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-blue-400">{completedTaskCount}/{tasks.length}</div>
                  <div className="text-[10px] text-gray-600 mt-1">Tasks</div>
                  <Progress value={taskPct} className="h-1 mt-2 bg-gray-50" />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-lg font-bold text-purple-400">{phaseLabel}</div>
                  <div className="text-[10px] text-gray-600 mt-1">Phase</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 lg:col-span-1 space-y-3">
          <Card className="bg-white border-gray-200 h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Live Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div ref={feedRef} className="space-y-2 max-h-[60vh] lg:max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
                {activityFeed.length === 0 && (
                  <div className="text-center text-gray-600 text-sm py-8">Waiting for activity...</div>
                )}
                {activityFeed.map(entry => (
                  <div key={entry.id} className="flex items-start gap-2 py-1.5 border-b border-gray-200 last:border-0">
                    <span className="text-[10px] font-mono text-gray-600 mt-0.5 flex-shrink-0 w-12 text-right">
                      [{formatElapsed(toSimulatedTime(entry.timestamp))}]
                    </span>
                    <div className="flex-shrink-0 mt-1">
                      {entry.type === 'stakeholder' && <Users className="w-3 h-3 text-emerald-400" />}
                      {entry.type === 'task' && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                      {entry.type === 'phase' && <Zap className="w-3 h-3 text-purple-400" />}
                      {entry.type === 'system' && <Activity className="w-3 h-3 text-gray-600" />}
                    </div>
                    <span className="text-xs text-gray-600 leading-relaxed">{entry.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}
