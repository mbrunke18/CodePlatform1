import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ValueGainCallout } from '@/components/ValueGainCallout';
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
  TrendingUp,
  Trophy
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { io, Socket } from 'socket.io-client';
import { BrandStamp } from "@/components/BrandStamp";
import { ROLE_OVERLAYS, INDUSTRY_OVERLAYS } from '@/data/activationPersonalization';
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import type { RoleOverlay, IndustryOverlay } from '@/data/activationPersonalization';
import PageLayout from '@/components/layout/PageLayout';
import { GovernanceReadinessCheck } from '@/components/execution/GovernanceReadinessCheck';

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
  'bg-[#0A0F2E]', 'bg-[#2B8A6E]', 'bg-[#0A0F2E]', 'bg-[#C9A84C]',
  'bg-[#0A0F2E]', 'bg-[#2B8A6E]', 'bg-[#0A0F2E]', 'bg-[#C9A84C]',
  'bg-[#2B8A6E]', 'bg-[#DFC178]'
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
    duration: '12 min to live execution',
    color: 'teal'
  },
  {
    key: 'ransomware',
    name: 'Ransomware Response',
    category: 'DEFENSE',
    description: 'Execute rapid incident response protocol — roles assigned, containment tasks staged, stakeholders notified, recovery underway.',
    icon: 'alert-triangle',
    stakeholderCount: 10,
    taskCount: 12,
    duration: '12 min to live execution',
    color: 'navy'
  },
  {
    key: 'ai-governance',
    name: 'AI Governance Framework',
    category: 'SPECIAL TEAMS',
    description: 'Deploy comprehensive AI governance framework — roles assigned, policies activated, compliance tasks staged and execution underway.',
    icon: 'brain',
    stakeholderCount: 9,
    taskCount: 10,
    duration: '12 min to live execution',
    color: 'gold'
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
    case 'OFFENSE': return { bg: 'bg-[#2B8A6E]/10', text: 'text-[#2B8A6E]', border: 'border-[#2B8A6E]/30', ring: 'ring-[#2B8A6E]', solid: 'bg-[#2B8A6E]' };
    case 'DEFENSE': return { bg: 'bg-[#0A0F2E]/10', text: 'text-[#0A0F2E]', border: 'border-[#0A0F2E]/30', ring: 'ring-[#0A0F2E]', solid: 'bg-[#0A0F2E]' };
    case 'SPECIAL TEAMS': return { bg: 'bg-[#C9A84C]/10', text: 'text-[#C9A84C]', border: 'border-[#C9A84C]/30', ring: 'ring-[#C9A84C]', solid: 'bg-[#C9A84C]' };
    default: return { bg: 'bg-[#F8F7F4]', text: 'text-[#0A0F2E]', border: 'border-[#E8E4DC]', ring: 'ring-[#E8E4DC]', solid: 'bg-[#0A0F2E]' };
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
  const [showGovernanceCheck, setShowGovernanceCheck] = useState(false);
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

  const NAVY = "#0A0F2E";
  const NAVY_MID = "#141B45";
  const GOLD = "#C9A84C";
  const GOLD_LT = "#DFC178";
  const TEAL = "#2B8A6E";
  const TEAL_LT = "#3BAF8A";
  const OFF = "#F8F7F4";
  const BORDER = "#E8E4DC";
  const MUTED = "#6B7280";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  const activePlaybook = DEFAULT_PLAYBOOKS.find(p => p.key === selectedPlaybook);

  const [, setLocation] = useLocation();

  const { data: orgData } = useQuery({
    queryKey: ['/api/organizations'],
    retry: false,
    staleTime: 60000,
  });
  const organizationId = (orgData as any)?.[0]?.id || null;

  const { data: situationIntents = [] } = useQuery<any[]>({
    queryKey: ['/api/situation-intents'],
    retry: false,
    staleTime: 30000,
  });
  const configuredIntentCount = Array.isArray(situationIntents) ? situationIntents.length : 0;

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

  const completeActivation = useCallback(() => {
    setActivationState('COMPLETED');
    setShowCompletion(true);
    if (timerRef.current) clearInterval(timerRef.current);
    addActivity('system', 'Activation sequence complete — operational state maintained');
  }, [addActivity]);

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
      addActivity('system', 'Playbook activated — roles assigned, tasks staged, execution live', 0);
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
  }, [selectedPlaybook, addActivity, industryOverlay, hasLiveIntegrations, organizationId, activePlaybook, completeActivation]);

  const runClientSimulation = useCallback((initStakeholders: Stakeholder[], initTasks: Task[], playbookKey: string) => {
    simulationRef.current.forEach(t => clearTimeout(t));
    simulationRef.current = [];

    const totalTime = 90;
    const stakeholderCount = initStakeholders.length;

    initStakeholders.forEach((s, i) => {
      const notifyDelay = 2000 + i * 800;
      const t1 = setTimeout(() => {
        setStakeholders(prev => prev.map(st => st.id === s.id ? { ...st, status: 'notifying' } : st));
      }, notifyDelay);

      const notifiedDelay = notifyDelay + 1500;
      const t2 = setTimeout(() => {
        setStakeholders(prev => prev.map(st => st.id === s.id ? { ...st, status: 'notified' } : st));
        addActivity('system', `Notification sent to ${s.name} (${s.title}) via ${CHANNELS[i % CHANNELS.length]}`);
      }, notifiedDelay);

      const ackBase = totalTime * 1000 / (stakeholderCount + 2);
      const ackDelay = notifiedDelay + 3000 + (ackBase * 0.3);
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

      const completeDelay = startDelay + 5000 + Math.random() * 10000;
      const t2 = setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
        addActivity('task', `Task completed: ${task.name}`);
      }, Math.min(completeDelay, (totalTime - 10) * 1000));

      simulationRef.current.push(t1, t2);
    });

    const tFinal = setTimeout(() => {
      completeActivation();
    }, totalTime * 1000);
    simulationRef.current.push(tFinal);

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }, [addActivity, completeActivation]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activityFeed]);

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
      simulationRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  if (!activationId) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-[#F8F7F4] p-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-10 h-[2px] bg-[#C9A84C]" />
                <span style={{ color: "#C9A84C", fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" }}>Activation Center</span>
                <div className="w-10 h-[2px] bg-[#C9A84C]" />
              </div>
              <h1 style={CG} className="text-6xl font-bold text-[#0A0F2E]">Live Playbook Engagement</h1>
              <p className="text-[#6B7280] text-xl max-w-2xl mx-auto">Select a strategic scenario. Roles assign, tasks stage, communications send — execution is live in 12 minutes.</p>
            </div>

            <div className="grid gap-6">
              {playbooks.map((p) => {
                const colors = getCategoryColor(p.category);
                const isSelected = selectedPlaybook === p.key;
                return (
                  <Card 
                    key={p.key}
                    onClick={() => setSelectedPlaybook(p.key)}
                    className={cn(
                      "cursor-pointer transition-all duration-300 bg-white border-[#E8E4DC] overflow-hidden group",
                      isSelected ? "ring-2 ring-[#C9A84C] scale-[1.02]" : "hover:border-[#C9A84C]"
                    )}
                  >
                    <div className="flex">
                      <div className={cn("w-2", colors.solid)} />
                      <div className="flex-1 p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-14 h-14 flex items-center justify-center border", colors.border, colors.bg, colors.text)}>
                              {getPlaybookIcon(p.icon)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-0", colors.bg, colors.text)}>
                                  {p.category}
                                </Badge>
                                <span className="text-xs text-[#6B7280] flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {p.duration}
                                </span>
                              </div>
                              <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">{p.name}</h3>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Impact Scope</div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-[#C9A84C]" />
                                <span className="text-sm font-bold text-[#0A0F2E]">{p.stakeholderCount} Stakeholders</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#2B8A6E]" />
                                <span className="text-sm font-bold text-[#0A0F2E]">{p.taskCount} Tasks</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-[#6B7280] leading-relaxed mb-0">{p.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Situation Intent Context Panel */}
            <div style={{
              background: configuredIntentCount > 0 ? 'rgba(43,138,110,0.06)' : 'rgba(201,168,76,0.06)',
              border: configuredIntentCount > 0 ? '1px solid rgba(43,138,110,0.25)' : '1px solid rgba(201,168,76,0.25)',
              borderRadius: 0, padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 0,
                  background: configuredIntentCount > 0 ? 'rgba(43,138,110,0.15)' : 'rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Target size={16} color={configuredIntentCount > 0 ? '#2B8A6E' : '#C9A84C'} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0A0F2E', marginBottom: 2 }}>
                    {configuredIntentCount > 0
                      ? `${configuredIntentCount} Situation Intent${configuredIntentCount !== 1 ? 's' : ''} Configured`
                      : 'Situation Intents Not Configured'}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>
                    {configuredIntentCount > 0
                      ? 'Decision context, primary indicators, and stakeholder routing are pre-staged for these triggers.'
                      : 'Configure situation intents to pre-stage decision context for the authorizing executive.'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setLocation('/identify/situation-intents')}
                style={{
                  flexShrink: 0, padding: '8px 16px',
                  background: configuredIntentCount > 0 ? 'rgba(43,138,110,0.1)' : '#C9A84C',
                  border: configuredIntentCount > 0 ? '1px solid rgba(43,138,110,0.3)' : 'none',
                  borderRadius: 0, fontSize: 12, fontWeight: 700,
                  color: configuredIntentCount > 0 ? '#2B8A6E' : '#0A0F2E',
                  cursor: 'pointer',
                }}
              >
                {configuredIntentCount > 0 ? 'View Intents' : 'Configure Now'}
              </button>
            </div>

            {/* ─── Three-Decision Panel ─────────────────────────────── */}
            <div style={{ background: '#0A0F2E', padding: '32px 32px 24px' }}>
              <div style={{
                fontSize: 9, fontWeight: 800, letterSpacing: '0.25em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
                marginBottom: 20, textAlign: 'center',
              }}>
                When the trigger fires — three decisions already built
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                {/* Option 1: Authorize as built */}
                <button
                  onClick={() => selectedPlaybook && setShowGovernanceCheck(true)}
                  disabled={activateMutation.isPending || !selectedPlaybook}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderTop: '3px solid rgba(255,255,255,0.3)',
                    padding: '22px 20px', textAlign: 'left',
                    cursor: selectedPlaybook && !activateMutation.isPending ? 'pointer' : 'not-allowed',
                    opacity: selectedPlaybook ? 1 : 0.45,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>Option 1</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6, fontFamily: "'Cormorant Garamond', serif" }}>
                    {activateMutation.isPending ? 'Initializing…' : 'Authorize as built'}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                    Deploy in 12 minutes
                  </div>
                </button>

                {/* Option 2: Call the audible */}
                <button
                  onClick={() => selectedPlaybook && setLocation(`/playbooks/${selectedPlaybook}/customize`)}
                  disabled={!selectedPlaybook}
                  style={{
                    background: 'rgba(201,168,76,0.07)',
                    border: '1px solid rgba(201,168,76,0.22)',
                    borderTop: '3px solid #C9A84C',
                    padding: '22px 20px', textAlign: 'left',
                    cursor: selectedPlaybook ? 'pointer' : 'not-allowed',
                    opacity: selectedPlaybook ? 1 : 0.45,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 10 }}>Option 2</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6, fontFamily: "'Cormorant Garamond', serif" }}>
                    Call the audible
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                    Adjust to fit this specific trigger
                  </div>
                </button>

                {/* Option 3: Select a different play */}
                <button
                  onClick={() => setLocation('/playbooks')}
                  style={{
                    background: 'rgba(43,138,110,0.06)',
                    border: '1px solid rgba(43,138,110,0.18)',
                    borderTop: '3px solid rgba(43,138,110,0.55)',
                    padding: '22px 20px', textAlign: 'left',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(43,138,110,0.75)', marginBottom: 10 }}>Option 3</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6, fontFamily: "'Cormorant Garamond', serif" }}>
                    Select a different play
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                    170 options already built
                  </div>
                </button>
              </div>

              <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic', letterSpacing: '0.03em' }}>
                Not automation. Preparation producing executive power.
              </div>
            </div>

            {showGovernanceCheck && (
              <GovernanceReadinessCheck
                playbookName={activePlaybook?.name || 'Selected Playbook'}
                onConfirm={() => {
                  setShowGovernanceCheck(false);
                  activateMutation.mutate(selectedPlaybook);
                }}
                onCancel={() => setShowGovernanceCheck(false)}
                isActivating={activateMutation.isPending}
              />
            )}
          </div>
        </div>
      </PageLayout>
    );
  }

  const colors = getCategoryColor(activePlaybook?.category || 'DEFENSE');

  return (
    <PageLayout>
      <ExecutionStageGuide variant="banner" />
      <div className="min-h-screen bg-[#0A0F2E] p-6 lg:p-10 font-sans selection:bg-[#C9A84C] selection:text-[#0A0F2E]">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 border border-white/10 p-8 rounded-none backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className={cn("w-16 h-16 flex items-center justify-center border text-white", colors.border, colors.bg)}>
                  {getPlaybookIcon(activePlaybook?.icon || 'shield')}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={cn("text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 border-0", colors.bg, colors.text)}>
                      {activePlaybook?.category} ACTIVE
                    </Badge>
                    <span className="text-white/40 text-xs font-mono">ID: {activationId}</span>
                  </div>
                  <h1 style={CG} className="text-4xl font-bold text-white leading-none">{activePlaybook?.name}</h1>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Elapsed Time</div>
                    <div className="text-3xl font-mono text-[#C9A84C] font-bold">{formatElapsed(elapsedSeconds)}</div>
                  </div>
                  <div className="h-10 w-[1px] bg-white/10 mx-2" />
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Simulated Progress</div>
                    <div className="text-3xl font-mono text-[#2B8A6E] font-bold">{formatElapsed(toSimulatedTime(elapsedSeconds))}</div>
                  </div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10 p-6 rounded-none">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Stakeholder Alignment</div>
                  <Users className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stakeholders.filter(s => s.status === 'acknowledged').length}/{stakeholders.length}
                </div>
                <Progress value={(stakeholders.filter(s => s.status === 'acknowledged').length / stakeholders.length) * 100} className="h-2 bg-white/10" />
              </Card>
              <Card className="bg-white/5 border-white/10 p-6 rounded-none">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Task Execution</div>
                  <CheckCircle2 className="w-4 h-4 text-[#2B8A6E]" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {tasks.filter(t => t.status === 'completed').length}/{tasks.length}
                </div>
                <Progress value={(tasks.filter(t => t.status === 'completed').length / tasks.length) * 100} className="h-2 bg-white/10" />
              </Card>
              <Card className="bg-white/5 border-white/10 p-6 rounded-none">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Phase</div>
                  <Zap className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#C9A84C] animate-pulse" />
                  {currentPhase.replace('_', ' ')}
                </div>
                <div className="text-[10px] text-white/40 font-mono">NEXT: {currentPhase === 'IMMEDIATE' ? 'SECONDARY' : currentPhase === 'SECONDARY' ? 'FOLLOW UP' : 'COMPLETION'}</div>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10 rounded-none overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#C9A84C]" />
                  <h3 className="font-bold text-white uppercase tracking-wider text-sm">Synchronized Stakeholder Command</h3>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10">
                    <div className="w-1.5 h-1.5 bg-[#C9A84C]" />
                    <span className="text-[9px] font-bold text-white/60 uppercase">Tier 1 Strategy</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {stakeholders.map((s) => (
                    <div key={s.id} className="group relative flex flex-col items-center text-center space-y-3">
                      <div className="relative">
                        <div className={cn(
                          "w-16 h-16 flex items-center justify-center text-white text-xl font-bold transition-all duration-500",
                          s.status === 'acknowledged' ? "ring-4 ring-[#2B8A6E] ring-offset-4 ring-offset-[#0A0F2E]" : 
                          s.status === 'notifying' || s.status === 'notified' ? "ring-4 ring-[#C9A84C] ring-offset-4 ring-offset-[#0A0F2E] animate-pulse" : 
                          "opacity-40",
                          s.color
                        )}>
                          {s.initials}
                        </div>
                        {s.status === 'acknowledged' && (
                          <div className="absolute -bottom-1 -right-1 bg-[#2B8A6E] text-white p-1 border-2 border-[#0A0F2E]">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">{s.name}</div>
                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">{s.title}</div>
                      </div>
                      <div className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none",
                        s.status === 'acknowledged' ? "bg-[#2B8A6E]/20 text-[#2B8A6E]" : 
                        s.status === 'notifying' || s.status === 'notified' ? "bg-[#C9A84C]/20 text-[#C9A84C]" : 
                        "bg-white/5 text-white/20"
                      )}>
                        {s.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 rounded-none overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2B8A6E]" />
                  <h3 className="font-bold text-white uppercase tracking-wider text-sm">Operational Task Realization</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#2B8A6E]" />
                    <span className="text-[10px] font-bold text-white/40 uppercase">Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#C9A84C]" />
                    <span className="text-[10px] font-bold text-white/40 uppercase">Active</span>
                  </div>
                </div>
              </div>
              <div className="p-0 max-h-[400px] overflow-y-auto custom-scrollbar">
                {tasks.map((t) => (
                  <div 
                    key={t.id} 
                    className={cn(
                      "flex items-center justify-between p-6 border-b border-white/5 transition-colors",
                      t.status === 'in_progress' ? "bg-white/5" : "hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-6 h-6 rounded-none flex items-center justify-center border transition-colors",
                        t.status === 'completed' ? "bg-[#2B8A6E] border-[#2B8A6E] text-white" : 
                        t.status === 'in_progress' ? "bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C]" : 
                        "border-white/20 text-white/20"
                      )}>
                        {t.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className={cn("text-sm font-bold transition-colors", t.status === 'completed' ? "text-white/40 line-through" : "text-white")}>
                          {t.name}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t.owner}</span>
                          <div className="w-1 h-1 bg-white/20" />
                          <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">{t.phase}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {t.status === 'in_progress' && (
                        <div className="flex items-center gap-2 text-[#C9A84C]">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">In Progress</span>
                        </div>
                      )}
                      {t.status === 'completed' && (
                        <span className="text-[10px] font-bold text-[#2B8A6E] uppercase tracking-widest">Complete</span>
                      )}
                      {t.status === 'pending' && (
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Staged</span>
                      )}
                      <span className="text-[9px] text-white/25 text-right" style={{ maxWidth: 140, lineHeight: 1.3 }}>
                        {t.status === 'pending' && 'Assigned — awaiting action'}
                        {t.status === 'in_progress' && 'Work actively underway'}
                        {t.status === 'completed' && 'Deliverable confirmed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-white/5 border-white/10 rounded-none overflow-hidden flex flex-col h-[calc(100vh-140px)] sticky top-6">
              <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#C9A84C]" />
                  <h3 className="font-bold text-white uppercase tracking-wider text-sm">Coordination Intelligence</h3>
                </div>
                <Badge variant="outline" className="text-[9px] font-bold text-[#2B8A6E] border-[#2B8A6E]/30 bg-[#2B8A6E]/10">LIVE SIGNAL</Badge>
              </div>
              <div ref={feedRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {activityFeed.map((entry) => (
                  <div key={entry.id} className="relative pl-6 border-l border-white/10 group">
                    <div className={cn(
                      "absolute -left-[5px] top-0 w-2.5 h-2.5 border-2 border-[#0A0F2E]",
                      entry.type === 'stakeholder' ? "bg-[#C9A84C]" : 
                      entry.type === 'task' ? "bg-[#2B8A6E]" : 
                      entry.type === 'phase' ? "bg-white" : "bg-white/40"
                    )} />
                    <div className="text-[10px] font-mono text-white/40 mb-1">{formatElapsed(entry.timestamp)}</div>
                    <p className="text-sm text-white/80 leading-relaxed font-medium">
                      {entry.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white/5 border-t border-white/10">
                <Button 
                  onClick={() => setActivationId(null)}
                  variant="ghost" 
                  className="w-full text-white/40 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] py-6"
                >
                  Terminate Activation Cycle
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {showCompletion && (() => {
          const simSeconds = toSimulatedTime(elapsedSeconds);
          const simMinutes = Math.max(1, Math.round(simSeconds / 60));
          const acknowledgedCount = stakeholders.filter(s => s.status === 'acknowledged').length;
          const ackPct = stakeholders.length > 0 ? Math.round((acknowledgedCount / stakeholders.length) * 100) : 100;
          const completedTasks = tasks.filter(t => t.status === 'completed').length;
          const taskPct = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 100;
          const targetMet = simMinutes <= 12;
          return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-[#0A0F2E]/80 animate-in fade-in duration-500 overflow-y-auto">
            <Card className="max-w-2xl w-full bg-white border-[#E8E4DC] rounded-none shadow-[0_0_100px_rgba(201,168,76,0.15)] overflow-hidden my-6">
              <div className="h-2 bg-[#C9A84C]" />
              <div className="p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-[#2B8A6E]/10 rounded-none flex items-center justify-center mx-auto border border-[#2B8A6E]/20">
                  <Trophy className="w-10 h-10 text-[#2B8A6E]" />
                </div>
                <div className="space-y-3">
                  <h2 style={CG} className="text-4xl font-bold text-[#0A0F2E]">Coordination Realized</h2>
                  <p className="text-[#6B7280] max-w-md mx-auto">
                    {activePlaybook?.name || 'Playbook'} executed successfully.
                    {targetMet ? ' 12-minute target met.' : ` Coordination completed in ${simMinutes} minutes.`}
                  </p>
                </div>

                {/* Live metric cards from actual activation */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Coordination Time</div>
                    <div className={`text-2xl font-bold font-mono ${targetMet ? 'text-[#2B8A6E]' : 'text-[#EF4444]'}`}>{simMinutes}<span className="text-sm font-normal text-[#6B7280] ml-0.5">m</span></div>
                    <div className="text-[9px] text-[#6B7280] mt-1">{targetMet ? '✓ Below 12-min target' : 'Above 12-min target'}</div>
                  </div>
                  <div className="text-center p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Stakeholders</div>
                    <div className="text-2xl font-bold text-[#0A0F2E] font-mono">{ackPct}%</div>
                    <div className="text-[9px] text-[#6B7280] mt-1">{acknowledgedCount} of {stakeholders.length} acknowledged</div>
                  </div>
                  <div className="text-center p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Tasks</div>
                    <div className="text-2xl font-bold text-[#0A0F2E] font-mono">{taskPct}%</div>
                    <div className="text-[9px] text-[#6B7280] mt-1">{completedTasks} of {tasks.length} completed</div>
                  </div>
                </div>

                {/* 3,600x benchmark comparison */}
                <div className="pt-2 pb-1 px-4 border border-[#E8E4DC] bg-[#0A0F2E] mx-2">
                  <div className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest mb-3 mt-3">Coordination Benchmark</div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-[10px] text-white/40 mb-0.5">Industry Baseline</div>
                      <div className="text-lg font-bold font-mono text-red-400">30 days</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 mb-0.5">This Activation</div>
                      <div className={`text-lg font-bold font-mono ${targetMet ? 'text-[#2B8A6E]' : 'text-[#C9A84C]'}`}>{simMinutes} min</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 mb-0.5">Head Start</div>
                      <div className="text-lg font-bold font-mono text-[#C9A84C]">{Math.round(43200 / simMinutes).toLocaleString()}×</div>
                    </div>
                  </div>
                </div>

                {/* What this activation produced — position framing */}
                <ValueGainCallout
                  mode="special-teams"
                  position=""
                  insight="The coordination infrastructure just proved itself under a live trigger. Every stakeholder acknowledged, every task deployed, every sequence intact. This is the ownership artifact the preparation phase was built to produce — and it held under pressure."
                  gain={{ label: "Coordination moat built", value: "Compounding" }}
                  compact
                  style={{ textAlign: "left", marginTop: 4 }}
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/coordination-intelligence" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] h-12 font-bold"
                      onClick={() => setShowCompletion(false)}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Coordination Record
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => { setActivationId(null); setShowCompletion(false); }}
                    className="flex-1 bg-[#0A0F2E] hover:bg-[#141B45] text-white h-12 font-bold"
                  >
                    Return to Mission Control
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          );
        })()}
      </div>

    </PageLayout>
  );
}
