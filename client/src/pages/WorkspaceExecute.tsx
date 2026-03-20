import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Compass, 
  Play,
  Users, 
  MessageSquare,
  Shield,
  ChevronRight, 
  Timer,
  AlertTriangle,
  Activity,
  ArrowRight,
  ClipboardList,
  Radar,
  TrendingUp,
  Zap,
  CheckCircle,
  Calendar,
  BookOpen,
  Target,
  AlertOctagon,
  User,
  Clock,
  Loader2,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { SubBrandLabel } from "@/components/SubBrandLabel";

const workspaceTools = [
  {
    title: "Command Center",
    description: "Real-time coordination hub for active playbook execution",
    path: "/command-center",
    icon: Compass,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Live coordination",
    featured: true
  },
  {
    title: "Crisis Response",
    description: "Rapid response protocols for critical situations",
    path: "/crisis",
    icon: AlertTriangle,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Emergency protocols"
  },
  {
    title: "Situation Room",
    description: "War room for strategic decision-making during execution",
    path: "/war-room",
    icon: Shield,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Decision support"
  },
  {
    title: "Team Collaboration",
    description: "Real-time communication and task coordination",
    path: "/collaboration",
    icon: MessageSquare,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Team sync"
  },
  {
    title: "Practice Drills",
    description: "Simulate scenarios and test team readiness",
    path: "/practice-drills",
    icon: Play,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Simulation"
  },
  {
    title: "Stakeholder Tracking",
    description: "Monitor stakeholder engagement and task completion",
    path: "/stakeholder-management",
    icon: Users,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "Engagement"
  }
];

const executionMetrics = [
  { label: "Active Playbooks", value: "2", icon: Play, color: "text-[#2B8A6E]" },
  { label: "Tasks In Progress", value: "14", icon: Activity, color: "text-[#0A0F2E]" },
  { label: "Stakeholders Engaged", value: "28", icon: Users, color: "text-[#2B8A6E]" },
  { label: "Avg Response Time", value: "12m", icon: Timer, color: "text-[#C9A84C]" }
];

type ExecutionRun = {
  id: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  outcome: string | null;
};

type ExecutionContext = {
  instanceId: string;
  status: string;
  objective: string;
  description: string | null;
  currentPhase: string | null;
  phaseLabel: string;
  phaseGuidance: string;
  completionPct: number;
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
  elapsedMinutes: number;
  minutesRemaining: number;
  targetMinutes: number;
  startedAt: string | null;
  criticalConstraint: string | null;
};

type MyTask = {
  id: string;
  status: string;
  taskTitle: string | null;
  taskDescription: string | null;
  taskRole: string | null;
  taskPriority: string | null;
  taskEstimatedMinutes: number | null;
  isMyTask: boolean;
  isScopedView: boolean;
  userRole: string;
  blockedReason: string | null;
  updatedAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  pending: 'bg-gray-100 text-gray-600 border-gray-200',
  blocked: 'bg-red-50 text-red-700 border-red-200',
};

const PRIORITY_BORDER: Record<string, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-400',
  medium: 'border-l-[#C9A84C]',
  low: 'border-l-gray-300',
};

function JITContextBanner({ runId }: { runId: string }) {
  const { data: ctx, isLoading, refetch } = useQuery<ExecutionContext>({
    queryKey: ['/api/execution-runs', runId, 'context'],
    queryFn: () => fetch(`/api/execution-runs/${runId}/context`, { credentials: 'include' }).then(r => r.json()),
    refetchInterval: 30000,
    enabled: !!runId,
  });

  if (isLoading) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-[#C9A84C]/5 border border-[#C9A84C]/20 flex items-center gap-3 text-[#6B7280]">
        <Loader2 className="h-4 w-4 animate-spin text-[#C9A84C]" />
        <span className="text-sm">Loading execution context...</span>
      </div>
    );
  }

  if (!ctx) return null;

  const isUrgent = ctx.blocked > 0 || ctx.minutesRemaining < 60;

  return (
    <Card className={`mb-6 overflow-hidden border-2 ${isUrgent ? 'border-[#C9A84C]' : 'border-[#C9A84C]/30'}`}>
      <div className="bg-[#0A0F2E] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C9A84C]/20">
              <MapPin className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {ctx.objective}
                </span>
                <Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none font-bold text-xs uppercase tracking-wider">
                  EXECUTE
                </Badge>
              </div>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-wider mt-0.5">{ctx.phaseLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="text-white text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{ctx.completionPct}%</p>
              <p className="text-white/50 text-xs">{ctx.completed}/{ctx.total} tasks</p>
            </div>
            <button onClick={() => refetch()} className="text-white/40 hover:text-white/80 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-3">
          <Progress value={ctx.completionPct} className="h-1.5 bg-white/10 [&>div]:bg-[#C9A84C]" />
        </div>
      </div>

      <CardContent className="p-4 bg-white dark:bg-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phase guidance — JIT re-injection */}
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-[#C9A84C]/10 h-fit">
              <BookOpen className="h-4 w-4 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0A0F2E] dark:text-white uppercase tracking-wider mb-1">Phase Guidance</p>
              <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/70 leading-relaxed">{ctx.phaseGuidance}</p>
            </div>
          </div>

          {/* Status snapshot */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#0A0F2E] dark:text-white uppercase tracking-wider mb-2">Live Status</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <Activity className="h-3.5 w-3.5 text-blue-500" /> In Progress
              </span>
              <span className="font-bold text-[#0A0F2E] dark:text-white text-sm">{ctx.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <Clock className="h-3.5 w-3.5 text-[#C9A84C]" /> Time Elapsed
              </span>
              <span className="font-bold text-[#0A0F2E] dark:text-white text-sm">{ctx.elapsedMinutes}m</span>
            </div>
            {ctx.blocked > 0 && (
              <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <AlertOctagon className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                <span className="text-xs text-red-700 dark:text-red-400 font-medium">{ctx.criticalConstraint}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MyActionsPanel({ runId }: { runId: string }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const { data: myTasks = [], isLoading } = useQuery<MyTask[]>({
    queryKey: ['/api/execution-runs', runId, 'my-tasks'],
    queryFn: () => fetch(`/api/execution-runs/${runId}/my-tasks`, { credentials: 'include' }).then(r => r.json()),
    refetchInterval: 30000,
  });

  const pending = myTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const done = myTasks.filter(t => t.status === 'completed' || t.status === 'skipped');
  const blocked = myTasks.filter(t => t.status === 'blocked');
  const isScopedView = myTasks[0]?.isScopedView;
  const userRole = myTasks[0]?.userRole;

  return (
    <Card className="mb-8 border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 overflow-hidden">
      <CardHeader className="pb-4 border-b border-[#E8E4DC] dark:border-[#C9A84C]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C9A84C]/10">
              <User className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  My Actions
                </CardTitle>
                {isScopedView && userRole && (
                  <Badge className="bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20 dark:bg-white/10 dark:text-white text-xs font-bold uppercase tracking-wider">
                    {userRole}
                  </Badge>
                )}
                {!isScopedView && (
                  <Badge variant="outline" className="text-xs text-[#6B7280]">All roles visible</Badge>
                )}
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#C9A84C]/60 mt-0.5">
                {isScopedView
                  ? `Schema-gated to your role — other roles' actions are not shown`
                  : 'Full action surface — admin or executive view'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {blocked.length > 0 && (
              <Badge className="bg-red-100 text-red-700 border-red-200 font-bold">{blocked.length} blocked</Badge>
            )}
            <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20 font-bold">{done.length}/{myTasks.length} done</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading your actions...</span>
          </div>
        ) : myTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <CheckCircle className="h-8 w-8 text-[#2B8A6E]" />
            <p className="text-sm font-medium text-[#0A0F2E] dark:text-white">No tasks assigned to your role</p>
            <p className="text-xs text-[#6B7280] dark:text-[#C9A84C]/60">Tasks will appear here when this execution assigns your role</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E4DC] dark:divide-white/10">
            {[...blocked, ...pending].map(task => (
              <div key={task.id} className={`px-5 py-4 flex items-start gap-4 border-l-4 ${PRIORITY_BORDER[task.taskPriority || 'medium'] || 'border-l-[#C9A84C]'}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {task.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                  ) : task.status === 'blocked' ? (
                    <AlertOctagon className="h-4 w-4 text-red-500" />
                  ) : task.status === 'in_progress' ? (
                    <Activity className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-[#6B7280]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-[#6B7280]' : 'text-[#0A0F2E] dark:text-white'}`}>
                      {task.taskTitle || 'Unnamed Task'}
                    </span>
                    <Badge className={`text-xs border ${STATUS_COLORS[task.status] || STATUS_COLORS.pending}`}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {task.taskDescription && (
                    <p className="text-xs text-[#6B7280] dark:text-[#C9A84C]/60 mb-1 leading-relaxed">{task.taskDescription}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280] dark:text-[#C9A84C]/60">
                    {task.taskRole && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {task.taskRole}
                      </span>
                    )}
                    {task.taskEstimatedMinutes && (
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" /> Est. {task.taskEstimatedMinutes}m
                      </span>
                    )}
                    {task.blockedReason && (
                      <span className="text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> {task.blockedReason}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {done.length > 0 && (
              <>
                <button
                  onClick={() => setShowCompleted(prev => !prev)}
                  className="w-full px-5 py-3 flex items-center justify-between bg-[#F8F7F4] dark:bg-white/5 hover:bg-[#2B8A6E]/5 transition-colors border-l-4 border-l-[#2B8A6E]"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                    <span className="text-sm font-bold text-[#2B8A6E] uppercase tracking-wider">
                      {done.length} task{done.length !== 1 ? 's' : ''} completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6B7280]">{showCompleted ? 'Hide' : 'Show'}</span>
                    <ChevronRight className={`h-4 w-4 text-[#6B7280] transition-transform duration-200 ${showCompleted ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                {showCompleted && done.map(task => (
                  <div key={task.id} className={`px-5 py-4 flex items-start gap-4 border-l-4 border-l-[#2B8A6E] opacity-60`}>
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm line-through text-[#6B7280]">
                          {task.taskTitle || 'Unnamed Task'}
                        </span>
                        <Badge className={`text-xs border ${STATUS_COLORS[task.status] || STATUS_COLORS.pending}`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      {task.taskRole && (
                        <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                          <User className="h-3 w-3" /> {task.taskRole}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function WorkspaceExecute({ embedded }: { embedded?: boolean } = {}) {
  // Fetch active execution runs to power the JIT context and My Actions panels
  const { data: runsRaw } = useQuery<ExecutionRun[]>({
    queryKey: ['/api/execution-runs'],
    queryFn: () => fetch('/api/execution-runs', { credentials: 'include' }).then(r => r.json()),
  });

  const runs = Array.isArray(runsRaw) ? runsRaw : [];
  const activeRun = runs.find(r => r.status === 'running' || r.status === 'pending') || null;

  const inner = (
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/command-center">
              <span className="text-[#0A0F2E] dark:text-[#C9A84C]/60 hover:text-[#C9A84C] cursor-pointer">Execution OS One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-[#0A0F2E] dark:text-[#C9A84C]/40" />
            <span className="text-[#C9A84C] font-bold uppercase tracking-wider">EXECUTE</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#C9A84C] shadow-lg shadow-[#C9A84C]/30">
                <Compass className="h-8 w-8 text-[#0A0F2E]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Compass Command</h1>
                  <Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none px-3 py-1 font-bold uppercase tracking-wider">
                    EXECUTE
                  </Badge>
                </div>
                <p className="text-[#6B7280] dark:text-[#C9A84C]/60 mt-1">
                  Coordinate responses and execute playbooks in 12 minutes
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/command-center">
                <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                  <Compass className="h-4 w-4 mr-2" />
                  Open Command Center
                </Button>
              </Link>
              <Link href="/practice-drills">
                <Button variant="outline" className="border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/5 dark:border-[#C9A84C]/40">
                  <Play className="h-4 w-4 mr-2" />
                  Run Drill
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker */}
          <Card className="mb-8 border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60">Phase 3 of 4</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link href="/workspaces/identify">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2B8A6E]/10 hover:bg-[#2B8A6E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(43,138,110,0.2)" }}>
                    <ClipboardList className="h-4 w-4 text-[#2B8A6E]" />
                    <span className="text-sm text-[#2B8A6E]">IDENTIFY</span>
                  </div>
                </Link>
                <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                <Link href="/workspaces/detect">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A0F2E]/10 hover:bg-[#0A0F2E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(10,15,46,0.2)" }}>
                    <Radar className="h-4 w-4 text-[#0A0F2E]" />
                    <span className="text-sm text-[#0A0F2E]">DETECT</span>
                  </div>
                </Link>
                <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C9A84C]/20 border-2 border-[#C9A84C] shadow-sm shadow-[#C9A84C]/20">
                  <Compass className="h-4 w-4 text-[#C9A84C]" />
                  <span className="text-sm font-bold text-[#C9A84C] uppercase tracking-wider">EXECUTE</span>
                </div>
                <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                <Link href="/workspaces/advance">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2B8A6E]/10 hover:bg-[#2B8A6E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(43,138,110,0.2)" }}>
                    <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />
                    <span className="text-sm text-[#2B8A6E] font-medium">ADVANCE</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Execution Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {executionMetrics.map((metric) => (
              <Card key={metric.label} className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{metric.value}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#C9A84C]/60">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* JIT CONTEXT BANNER — re-injects playbook intent at execution checkpoints */}
          {activeRun && <JITContextBanner runId={activeRun.id} />}

          {/* ROLE-SCOPED MY ACTIONS — schema-gated to user's role */}
          {activeRun && <MyActionsPanel runId={activeRun.id} />}

          {/* 12-Minute Promise Banner */}
          <Card className="mb-8 bg-white border border-[#E8E4DC] dark:bg-white/5 dark:border-[#C9A84C]/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#0A0F2E]/10 dark:bg-white/10">
                  <Timer className="h-8 w-8 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12 Minutes to Coordinated Response</h3>
                  <p className="text-[#6B7280] dark:text-[#C9A84C]/60">Execution OS delivers a 3,600× Execution Head Start — while rivals spend weeks mobilizing, you're already executing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Executions */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Active Executions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 border-l-4 border-l-[#C9A84C] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#0A0F2E] dark:text-white">M&A Integration — CloudTech Acquisition</h4>
                  <Badge className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">Active</Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[#0A0F2E] dark:text-white">78%</span>
                  <Progress value={78} className="flex-1 h-2 bg-[#E8E4DC] dark:bg-white/10 [&>div]:bg-[#C9A84C]" />
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6B7280] dark:text-[#C9A84C]/60 mb-4">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> 28 of 45 tasks</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 45 stakeholders</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Jan 28</span>
                </div>
                <Link href="/command-center">
                  <Button size="sm" variant="outline" className="border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/5">
                    View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 border-l-4 border-l-[#C9A84C] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Competitive Response — Market Counter-Strategy</h4>
                  <Badge className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">In Progress</Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[#0A0F2E] dark:text-white">34%</span>
                  <Progress value={34} className="flex-1 h-2 bg-[#E8E4DC] dark:bg-white/10 [&>div]:bg-[#C9A84C]" />
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6B7280] dark:text-[#C9A84C]/60 mb-4">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> 8 of 24 tasks</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 18 stakeholders</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Feb 15</span>
                </div>
                <Link href="/command-center">
                  <Button size="sm" variant="outline" className="border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/5">
                    View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>EXECUTE Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workspaceTools.map((tool) => (
              <Link key={tool.path + tool.title} href={tool.path}>
                <Card className={`border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 h-full hover:shadow-lg transition-all cursor-pointer group ${tool.featured ? 'border-2 border-[#2B8A6E]/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${tool.bgColor}`}>
                        <tool.icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#0A0F2E] dark:text-white group-hover:text-[#C9A84C] transition-colors">
                            {tool.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40 group-hover:text-[#C9A84C] transition-colors" />
                        </div>
                        <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60 mt-1">
                          {tool.description}
                        </p>
                        <Badge variant="outline" className="mt-3 text-xs border-[#E8E4DC] dark:border-[#C9A84C]/10 text-[#6B7280] dark:text-[#C9A84C]">
                          {tool.stats}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Next Phase CTA */}
          <Card className="bg-[#0A0F2E] border-[#C9A84C]/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    <TrendingUp className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Execution complete?</h3>
                    <p className="text-sm text-white/60">
                      Capture lessons learned and improve for next time in ADVANCE
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/advance">
                  <Button className="bg-[#2B8A6E] text-white font-bold hover:bg-[#3BAF8A]">
                    Go to ADVANCE
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
  return embedded ? inner : <PageLayout>{inner}</PageLayout>;
}
