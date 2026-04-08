import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  BookOpen,
  BarChart3, 
  Brain,
  Lightbulb,
  ChevronRight, 
  Target,
  Activity,
  ArrowRight,
  ClipboardList,
  Radar,
  Compass,
  RefreshCw,
  Award,
  AlertTriangle,
  AlertOctagon,
  Eye,
  Zap,
  Clock,
  User,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { SubBrandLabel } from "@/components/SubBrandLabel";
import { useToast } from '@/hooks/use-toast';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

const workspaceTools = [
  {
    title: "Strategic Learning Center",
    description: "AI-powered performance intelligence — review what worked, refine what didn't, and close the improvement loop",
    path: "/execution-learning",
    icon: Brain,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "AI optimization",
    featured: true
  },
  {
    title: "Institutional Memory",
    description: "Capture and preserve organizational learnings from every execution",
    path: "/institutional-memory",
    icon: BookOpen,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Knowledge base"
  },
  {
    title: "Decision Velocity",
    description: "Track and improve organizational decision-making speed",
    path: "/decision-velocity",
    icon: Activity,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Performance metrics"
  },
  {
    title: "Executive Dashboard",
    description: "Strategic overview of organizational readiness and performance",
    path: "/command-center",
    icon: BarChart3,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "Executive view"
  },
  {
    title: "Executive Analytics",
    description: "Deep-dive analytics on playbook effectiveness and outcomes",
    path: "/analytics",
    icon: TrendingUp,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Advanced insights"
  },
  {
    title: "AI Intelligence Hub",
    description: "AI-powered pattern recognition and improvement suggestions",
    path: "/ai",
    icon: Brain,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "AI recommendations"
  },
  {
    title: "Playbook Refinement",
    description: "Update playbooks based on lessons learned",
    path: "/living-playbooks",
    icon: RefreshCw,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Continuous improvement"
  }
];

const learningMetrics = [
  { label: "Lessons Captured", value: "47", icon: Lightbulb, color: "text-[#2B8A6E]" },
  { label: "Playbooks Improved", value: "23", icon: RefreshCw, color: "text-[#0A0F2E]" },
  { label: "Decision Velocity", value: "+34%", icon: Activity, color: "text-[#C9A84C]" },
  { label: "Team Readiness", value: "92%", icon: Award, color: "text-[#0A0F2E]" }
];

const THRESHOLD_OPTIONS = [
  { label: "2 hours", value: "2" },
  { label: "4 hours", value: "4" },
  { label: "8 hours", value: "8" },
  { label: "24 hours", value: "24" },
];

type StuckTask = {
  id: string;
  executionInstanceId: string;
  status: string;
  blockedReason: string | null;
  assignedUserId: string | null;
  updatedAt: string;
  createdAt: string;
  taskTitle: string | null;
  taskRole: string | null;
  taskPriority: string | null;
  taskEstimatedMinutes: number | null;
  hoursStuck: number;
  severity: 'watch' | 'warning' | 'critical';
};

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === 'critical') return <AlertOctagon className="h-4 w-4 text-red-500" />;
  if (severity === 'warning') return <AlertTriangle className="h-4 w-4 text-[#C9A84C]" />;
  return <Eye className="h-4 w-4 text-[#6B7280]" />;
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === 'critical') return (
    <Badge className="bg-red-100 text-red-700 border-red-200 font-bold text-xs uppercase tracking-wider">Critical</Badge>
  );
  if (severity === 'warning') return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-bold text-xs uppercase tracking-wider">Warning</Badge>
  );
  return (
    <Badge className="bg-gray-100 text-gray-600 border-gray-200 font-bold text-xs uppercase tracking-wider">Watch</Badge>
  );
}

function DoomLoopDetector() {
  const [threshold, setThreshold] = useState("4");
  const [escalatedIds, setEscalatedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const { data: stuckTasks = [], isLoading, refetch } = useQuery<StuckTask[]>({
    queryKey: ['/api/stuck-tasks', threshold],
    queryFn: () => fetch(`/api/stuck-tasks?hours=${threshold}`, { credentials: 'include' }).then(r => r.ok ? r.json() : []),
    refetchInterval: 60000,
  });

  const escalateMutation = useMutation({
    mutationFn: ({ taskId, notes }: { taskId: string; notes: string }) =>
      apiRequest('PATCH', `/api/stuck-tasks/${taskId}/escalate`, { notes }),
    onSuccess: (_, { taskId }) => {
      setEscalatedIds(prev => new Set([...Array.from(prev), taskId]));
      queryClient.invalidateQueries({ queryKey: ['/api/stuck-tasks'] });
      toast({ title: "Task escalated", description: "The task has been marked as re-escalated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to escalate task.", variant: "destructive" });
    }
  });

  const criticalCount = stuckTasks.filter(t => t.severity === 'critical').length;
  const warningCount = stuckTasks.filter(t => t.severity === 'warning').length;

  return (
    <Card className="mb-8 border-2 border-[#C9A84C]/30 bg-white dark:bg-white/5 overflow-hidden">
      <CardHeader className="pb-4 bg-[#0A0F2E]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C9A84C]/20">
              <ShieldAlert className="h-6 w-6 text-[#C9A84C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-white text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Stuck Execution Detector
                </CardTitle>
                <Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none font-bold text-xs uppercase tracking-wider px-2">
                  ADVANCE
                </Badge>
              </div>
              <p className="text-white/50 text-sm mt-0.5">
                Tasks assigned but not advancing — the enterprise doom-loop fingerprint
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-sm whitespace-nowrap">Stuck longer than</span>
            <Select value={threshold} onValueChange={(v) => setThreshold(v)}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {THRESHOLD_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Summary row */}
        {!isLoading && stuckTasks.length > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <AlertOctagon className="h-4 w-4 text-red-400" />
              <span className="text-red-400 font-bold text-sm">{criticalCount} critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-[#C9A84C]" />
              <span className="text-[#C9A84C] font-bold text-sm">{warningCount} warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-white/40" />
              <span className="text-white/40 text-sm">{stuckTasks.length - criticalCount - warningCount} watch</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-[#6B7280]">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Scanning active executions...</span>
          </div>
        ) : stuckTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="p-3 rounded-full bg-[#2B8A6E]/10">
              <CheckCircle2 className="h-8 w-8 text-[#2B8A6E]" />
            </div>
            <p className="font-semibold text-[#0A0F2E] dark:text-white">No stuck tasks detected</p>
            <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60">
              All active tasks have moved within the last {threshold} hour{threshold !== "1" ? "s" : ""}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E4DC] dark:divide-white/10">
            {stuckTasks.map((task) => {
              const isEscalated = escalatedIds.has(task.id);
              return (
                <div key={task.id} className={`p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-[#F8F7F4] dark:hover:bg-white/5 transition-colors ${task.severity === 'critical' ? 'bg-red-50/60 dark:bg-red-500/5' : ''}`}>
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${task.severity === 'critical' ? 'bg-red-100' : task.severity === 'warning' ? 'bg-amber-50' : 'bg-gray-100'}`}>
                      <SeverityIcon severity={task.severity} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-[#0A0F2E] dark:text-white text-sm truncate">
                          {task.taskTitle || "Unnamed Task"}
                        </span>
                        <SeverityBadge severity={task.severity} />
                        {task.status === 'in_progress' && (
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">In Progress</Badge>
                        )}
                        {task.status === 'pending' && (
                          <Badge className="bg-gray-50 text-gray-600 border-gray-200 text-xs">Pending</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280] dark:text-[#C9A84C]/60">
                        {task.taskRole && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.taskRole}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Stuck <strong className={`ml-0.5 ${task.severity === 'critical' ? 'text-red-600' : task.severity === 'warning' ? 'text-amber-600' : 'text-[#6B7280]'}`}>{task.hoursStuck}h</strong>
                        </span>
                        {task.taskEstimatedMinutes && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Est. {task.taskEstimatedMinutes}m
                          </span>
                        )}
                        {task.blockedReason && (
                          <span className="text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {task.blockedReason}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isEscalated ? (
                      <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20 font-semibold px-3 py-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Escalated
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => escalateMutation.mutate({ taskId: task.id, notes: `Re-escalated after ${task.hoursStuck}h without progress` })}
                        disabled={escalateMutation.isPending}
                        className="bg-[#0A0F2E] text-white hover:bg-[#141B45] font-semibold text-xs"
                      >
                        <Zap className="h-3.5 w-3.5 mr-1.5" />
                        Re-Escalate
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function WorkspaceAdvance({ embedded }: { embedded?: boolean } = {}) {
  const inner = (
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/command-center">
              <span className="text-[#0A0F2E] dark:text-[#C9A84C]/60 hover:text-[#C9A84C] cursor-pointer">Command OS One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-[#0A0F2E] dark:text-[#C9A84C]/40" />
            <span className="text-[#2B8A6E] font-medium uppercase tracking-wider">ADVANCE</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#2B8A6E] shadow-lg shadow-[#2B8A6E]/30">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Retrospect Lab</h1>
                  <Badge className="bg-[#2B8A6E] text-white border-none px-3 py-1 font-bold uppercase tracking-wider">
                    ADVANCE
                  </Badge>
                </div>
                <p className="text-[#6B7280] dark:text-[#C9A84C]/60 mt-1">
                  Learn, improve, and strengthen organizational resilience
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/institutional-memory">
                <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Learnings
                </Button>
              </Link>
              <Link href="/command-center">
                <Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E] hover:bg-[#0A0F2E]/5 dark:text-white dark:border-[#C9A84C]/20">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker */}
          <Card className="mb-8 border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60">Phase 4 of 4 — Continuous Loop</span>
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
                <Link href="/workspaces/execute">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
                    <Compass className="h-4 w-4 text-[#C9A84C]" />
                    <span className="text-sm text-[#C9A84C] font-medium">EXECUTE</span>
                  </div>
                </Link>
                <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2B8A6E]/10 border-2 border-[#2B8A6E] shadow-sm shadow-[#2B8A6E]/20">
                  <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />
                  <span className="text-sm font-bold text-[#2B8A6E] uppercase tracking-wider">ADVANCE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {learningMetrics.map((metric) => (
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

          {/* DOOM-LOOP DETECTOR — Live stuck task alert panel */}
          <DoomLoopDetector />

          {/* Continuous Improvement Banner */}
          <Card className="mb-8 bg-white border border-[#E8E4DC] dark:bg-white/5 dark:border-[#C9A84C]/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#0A0F2E]/10 dark:bg-white/10">
                  <RefreshCw className="h-8 w-8 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Continuous Learning Loop</h3>
                  <p className="text-[#6B7280] dark:text-[#C9A84C]/60">Every execution makes your playbooks smarter and your team faster</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Learnings */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Recent Learnings</h2>
          <div className="space-y-3 mb-8">
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#2B8A6E]/10">
                    <Lightbulb className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">5-tier stakeholder hierarchy reduced notification fatigue by 41%</h4>
                      <Badge className="bg-[#2B8A6E] text-white border-none">Pattern</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60">Confidence: 89%</span>
                      <Progress value={89} className="w-24 h-1.5 bg-[#E8E4DC] dark:bg-white/10 [&>div]:bg-[#C9A84C]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#2B8A6E]/10">
                    <Brain className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Auto-isolation rules cut cyber incident damage by 78%</h4>
                      <Badge className="bg-[#2B8A6E] text-white border-none">Automation</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60">Confidence: 96%</span>
                      <Progress value={96} className="w-24 h-1.5 bg-[#E8E4DC] dark:bg-white/10 [&>div]:bg-[#C9A84C]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#C9A84C]/10">
                    <BarChart3 className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Pre-approved budget thresholds accelerate response by 34%</h4>
                      <Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none font-bold">Financial</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60">Confidence: 87%</span>
                      <Progress value={87} className="w-24 h-1.5 bg-[#E8E4DC] dark:bg-white/10 [&>div]:bg-[#C9A84C]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>ADVANCE Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workspaceTools.map((tool) => (
              <Link key={tool.path + tool.title} href={tool.path}>
                <Card className={`border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 h-full hover:shadow-lg transition-all cursor-pointer group ${tool.featured ? 'border-2 border-[#C9A84C]/50' : ''}`}>
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

          {/* Back to Start CTA */}
          <Card className="bg-[#0A0F2E] border-[#C9A84C]/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    <ClipboardList className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Ready to apply learnings?</h3>
                    <p className="text-sm text-white/60">
                      Update your playbooks with new insights and start the cycle again
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/identify">
                  <Button className="bg-[#2B8A6E] text-white font-bold hover:bg-[#3BAF8A]">
                    Back to IDENTIFY
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
