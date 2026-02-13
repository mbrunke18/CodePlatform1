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
  X
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

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
    default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', ring: 'ring-gray-500', solid: 'bg-gray-500' };
  }
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function LiveActivationCenter() {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string>('ma-day1');
  const [activationId, setActivationId] = useState<string | null>(null);
  const [activationState, setActivationState] = useState<ActivationState>('ACTIVATING');
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEntry[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<ActivationPhase>('IMMEDIATE');
  const [showCompletion, setShowCompletion] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const simulationRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const activePlaybook = DEFAULT_PLAYBOOKS.find(p => p.key === selectedPlaybook);

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
    startTimeRef.current = Date.now();

    const playbookKey = selectedPlaybook;
    const initialStakeholders = (DEFAULT_STAKEHOLDERS[playbookKey] || DEFAULT_STAKEHOLDERS['ma-day1']).map(s => ({ ...s, status: 'pending' as StakeholderStatus }));
    const initialTasks = (DEFAULT_TASKS[playbookKey] || DEFAULT_TASKS['ma-day1']).map(t => ({ ...t, status: 'pending' as TaskStatus }));

    setStakeholders(initialStakeholders);
    setTasks(initialTasks);

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
  }, [selectedPlaybook, addActivity]);

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

  if (!activationId) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-emerald-400" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Live Activation Command Center</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Watch strategic coordination unfold in real-time
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
                    'bg-gray-900 hover:bg-gray-800/80',
                    isSelected
                      ? `${colors.border} ring-2 ${colors.ring} shadow-lg shadow-${pb.color}-500/10`
                      : 'border-gray-800 hover:border-gray-700'
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
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">{pb.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {pb.stakeholderCount} stakeholders
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" /> {pb.taskCount} tasks
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {pb.duration}
                  </div>
                </button>
              );
            })}
          </div>

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
                  ACTIVATE PLAYBOOK
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8 animate-[pulse_2s_ease-in-out_infinite]">
            <CheckCircle2 className="w-14 h-14 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Coordination Complete</h1>
          <p className="text-gray-400 mb-10 text-lg">All stakeholders aligned and tasks executed successfully.</p>

          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-3xl font-bold text-emerald-400">{formatElapsed(elapsedSeconds)}</div>
              <div className="text-xs text-gray-500 mt-1">Total Time</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-3xl font-bold text-emerald-400">{acknowledgedCount}/{stakeholders.length}</div>
              <div className="text-xs text-gray-500 mt-1">Response Rate</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-3xl font-bold text-emerald-400">{completedTaskCount}/{tasks.length}</div>
              <div className="text-xs text-gray-500 mt-1">Tasks Completed</div>
            </div>
          </div>

          <Button
            size="lg"
            onClick={runAnother}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-6 text-lg rounded-xl"
          >
            Run Another Demo
          </Button>
        </div>
      </div>
    );
  }

  const immediateT = tasks.filter(t => t.phase === 'IMMEDIATE');
  const secondaryT = tasks.filter(t => t.phase === 'SECONDARY');
  const followUpT = tasks.filter(t => t.phase === 'FOLLOW_UP');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold truncate">{activePlaybook?.name}</h2>
            {activePlaybook && (
              <Badge className={cn('text-xs font-semibold border-0', getCategoryColor(activePlaybook.category).bg, getCategoryColor(activePlaybook.category).text)}>
                {activePlaybook.category}
              </Badge>
            )}
            <Badge className={cn(
              'text-xs font-semibold border-0',
              activationState === 'ACTIVATING' ? 'bg-yellow-500/10 text-yellow-400' :
              activationState === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400' :
              'bg-emerald-500/10 text-emerald-400'
            )}>
              {activationState === 'ACTIVATING' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              {activationState === 'ACTIVATING' ? 'ACTIVATING...' : activationState === 'IN_PROGRESS' ? 'IN PROGRESS' : 'COMPLETED'}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300 font-mono text-lg">
              <Clock className="w-4 h-4 text-gray-500" />
              {formatElapsed(elapsedSeconds)}
            </div>
            <Button variant="ghost" size="sm" onClick={cancelActivation} className="text-gray-400 hover:text-white hover:bg-gray-800">
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-3">
          <Card className="bg-gray-900 border-gray-800">
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
                    : 'bg-gray-800/50 border-gray-800'
                )}>
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0', s.color)}>
                    {s.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{s.name}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gray-700 text-gray-500">
                        Tier {s.tier}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{s.title} · {s.department}</div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {s.status === 'pending' && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-gray-600" />
                        <span className="text-xs text-gray-500">Pending</span>
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
                        <span className="text-xs text-emerald-400">{s.responseTime}s</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-3">
          <Card className="bg-gray-900 border-gray-800">
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
                { label: 'SECONDARY (2-5 min)', items: secondaryT },
                { label: 'FOLLOW UP (5-12 min)', items: followUpT },
              ].map(group => (
                group.items.length > 0 && (
                  <div key={group.label}>
                    <div className="text-[10px] font-bold tracking-widest text-gray-600 mb-2 uppercase">{group.label}</div>
                    <div className="space-y-1.5">
                      {group.items.map(task => (
                        <div key={task.id} className={cn(
                          'flex items-center gap-2.5 p-2 rounded-lg transition-all duration-300',
                          task.status === 'completed' ? 'bg-emerald-500/5' :
                          task.status === 'in_progress' ? 'bg-blue-500/5' : 'bg-gray-800/30'
                        )}>
                          {task.status === 'pending' && <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                          {task.status === 'in_progress' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />}
                          {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <div className={cn(
                              'text-sm truncate',
                              task.status === 'completed' ? 'text-gray-400' :
                              task.status === 'in_progress' ? 'text-white' : 'text-gray-500'
                            )}>{task.name}</div>
                          </div>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gray-700 text-gray-600 flex-shrink-0">
                            {task.owner}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-3">
          <Card className="bg-gray-900 border-gray-800">
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
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - Math.min(elapsedSeconds / 90, 1))}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-mono text-white">{formatElapsed(elapsedSeconds)}</span>
                  <span className="text-[10px] text-gray-500">ELAPSED</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-semibold tracking-wider mb-6">ACCELERATED DEMO (90s)</div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-gray-800/60 rounded-lg p-3 text-center border border-gray-800">
                  <div className="text-2xl font-bold text-emerald-400">{coordinationPct}%</div>
                  <div className="text-[10px] text-gray-500 mt-1">Coordination</div>
                  <Progress value={coordinationPct} className="h-1 mt-2 bg-gray-700" />
                </div>
                <div className="bg-gray-800/60 rounded-lg p-3 text-center border border-gray-800">
                  <div className="text-2xl font-bold text-blue-400">{acknowledgedCount}/{stakeholders.length}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Stakeholders</div>
                  <Progress value={stakeholders.length > 0 ? (acknowledgedCount / stakeholders.length) * 100 : 0} className="h-1 mt-2 bg-gray-700" />
                </div>
                <div className="bg-gray-800/60 rounded-lg p-3 text-center border border-gray-800">
                  <div className="text-2xl font-bold text-blue-400">{completedTaskCount}/{tasks.length}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Tasks</div>
                  <Progress value={taskPct} className="h-1 mt-2 bg-gray-700" />
                </div>
                <div className="bg-gray-800/60 rounded-lg p-3 text-center border border-gray-800">
                  <div className="text-lg font-bold text-purple-400">{phaseLabel}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Phase</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-3">
          <Card className="bg-gray-900 border-gray-800 h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Live Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div ref={feedRef} className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
                {activityFeed.length === 0 && (
                  <div className="text-center text-gray-600 text-sm py-8">Waiting for activity...</div>
                )}
                {activityFeed.map(entry => (
                  <div key={entry.id} className="flex items-start gap-2 py-1.5 border-b border-gray-800/50 last:border-0">
                    <span className="text-[10px] font-mono text-gray-600 mt-0.5 flex-shrink-0 w-12 text-right">
                      [{formatElapsed(entry.timestamp)}]
                    </span>
                    <div className="flex-shrink-0 mt-1">
                      {entry.type === 'stakeholder' && <Users className="w-3 h-3 text-emerald-400" />}
                      {entry.type === 'task' && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                      {entry.type === 'phase' && <Zap className="w-3 h-3 text-purple-400" />}
                      {entry.type === 'system' && <Activity className="w-3 h-3 text-gray-500" />}
                    </div>
                    <span className="text-xs text-gray-400 leading-relaxed">{entry.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
