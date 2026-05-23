import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ClipboardList, BookOpen, Target, FileText, ChevronRight, Sparkles,
  CheckCircle, CheckCircle2, Clock, Users, ArrowRight, Lightbulb, Shield,
  Rocket, Globe, Radar, Compass, TrendingUp, Search, Layers, ExternalLink,
  Loader2, X, Radio, Eye, Bell, AlertTriangle, Activity, Zap, Brain,
  Play, MessageSquare, Timer, AlertOctagon, User, Calendar, RefreshCw,
  BarChart3, Award, ShieldAlert, MapPin, BookOpen as BookOpenIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const TABS = [
  { id: 'identify', label: 'IDENTIFY', icon: ClipboardList, color: TEAL, phase: 'Phase 1' },
  { id: 'detect',   label: 'DETECT',   icon: Radar,         color: NAVY, phase: 'Phase 2' },
  { id: 'execute',  label: 'EXECUTE',  icon: Compass,       color: GOLD, phase: 'Phase 3' },
  { id: 'advance',  label: 'ADVANCE',  icon: TrendingUp,    color: TEAL, phase: 'Phase 4' },
];

// ─── IDENTIFY DATA ───────────────────────────────────────────────────────────
const identifyTools = [
  { title: "Readiness Protocol Library", description: "Browse 170 pre-built Readiness Protocols across 9 domains", path: "/playbook-library", icon: BookOpen, color: "text-[#C9A84C]", bgColor: "bg-[#C9A84C]/10", stats: "170 protocols", featured: true },
  { title: "Scenario Planning Hub", description: "Design strategic scenarios and map potential trigger conditions", path: "/strategic", icon: Target, color: "text-[#2B8A6E]", bgColor: "bg-[#2B8A6E]/10", stats: "Strategic planning" },
  { title: "What-If Analyzer", description: "Model different scenarios and their potential outcomes", path: "/what-if-analyzer", icon: Lightbulb, color: "text-[#C9A84C]", bgColor: "bg-[#C9A84C]/10", stats: "Predictive modeling" },
  { title: "Board Briefings", description: "Generate executive-ready presentations and board materials", path: "/board-briefings", icon: FileText, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Executive reports" },
  { title: "Protocol Customization", description: "Tailor protocols to your organization's specific needs", path: "/playbook-customization", icon: ClipboardList, color: "text-[#2B8A6E]", bgColor: "bg-[#2B8A6E]/10", stats: "Personalization" },
  { title: "Preparedness Report", description: "Assess your organization's strategic readiness score", path: "/preparedness-report", icon: Shield, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Readiness scoring" },
];
const domainCategories = [
  { name: "GROWTH & POSITIONING", domains: ["Market Entry", "M&A", "Product Launch"], count: 58, color: "text-[#2B8A6E]", icon: Rocket },
  { name: "RISK & RESILIENCE", domains: ["Crisis", "Cyber", "Regulatory"], count: 58, color: "text-[#0A0F2E]", icon: Shield },
  { name: "STRATEGIC TRANSFORMATION", domains: ["Digital Transformation", "Competitive Response", "AI Governance"], count: 54, color: "text-[#C9A84C]", icon: Globe },
];
const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
};
const CAT_COLORS: Record<string, string> = {
  offense: 'text-[#2B8A6E]', defense: 'text-[#0A0F2E]', special_teams: 'text-[#C9A84C]',
};
type PlaybookMeta = { id: string; name: string; domain: string; category: string | null; description: string | null; priority: string | null; timesUsed: number | null; sourceType: string; approvalStatus: string | null; status: string | null; };
type ProtocolDetailType = PlaybookMeta & { triggerConditions?: any; escalationPaths?: any; stakeholders?: any; executionSteps?: any; enrichedPhases?: any; };

function TwoPhasePlaybookSelector() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: metaList = [], isLoading: metaLoading } = useQuery<PlaybookMeta[]>({
    queryKey: ['/api/playbooks/metadata', search],
    queryFn: () => { const p = new URLSearchParams({ limit: '30' }); if (search.trim()) p.set('search', search.trim()); return fetch(`/api/playbooks/metadata?${p}`, { credentials: 'include' }).then(r => r.ok ? r.json() : []); },
  });
  const { data: detail, isLoading: detailLoading } = useQuery<ProtocolDetailType>({
    queryKey: ['/api/playbooks', selectedId],
    queryFn: () => fetch(`/api/playbooks/${selectedId}`, { credentials: 'include' }).then(r => r.json()),
    enabled: !!selectedId,
  });
  const filtered = (Array.isArray(metaList) ? metaList : []).filter(p => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || (p.domain || '').toLowerCase().includes(search.toLowerCase()));
  return (
    <Card className="mb-8 border-2 border-[#2B8A6E]/20 bg-white dark:bg-white/5 overflow-hidden">
      <CardHeader className="pb-4 bg-[#0A0F2E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2B8A6E]/20"><Layers className="h-5 w-5 text-[#2B8A6E]" /></div>
            <div>
              <div className="flex items-center gap-2"><h3 className="text-white font-semibold" style={CG}>Readiness Protocol Quick-Select</h3><Badge className="bg-[#2B8A6E] text-white border-none text-xs font-bold uppercase tracking-wider">Two-Phase</Badge></div>
              <p className="text-white/50 text-xs mt-0.5">Metadata loads instantly — full detail on selection</p>
            </div>
          </div>
          <Link href="/playbooks"><Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent text-xs">Full Library <ExternalLink className="h-3 w-3 ml-1.5" /></Button></Link>
        </div>
        <div className="mt-4 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search protocols..." className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#2B8A6E]" /></div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#E8E4DC] dark:divide-white/10">
          <div className="overflow-y-auto max-h-72">
            {metaLoading ? (<div className="flex items-center justify-center py-10 gap-2 text-[#6B7280]"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Loading...</span></div>)
              : filtered.length === 0 ? (<div className="flex flex-col items-center justify-center py-10 gap-2 text-[#6B7280]"><Search className="h-5 w-5" /><span className="text-sm">No Readiness Protocols match "{search}"</span></div>)
              : filtered.map(p => (<button key={p.id} onClick={() => setSelectedId(prev => prev === p.id ? null : p.id)} className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[#F8F7F4] dark:hover:bg-white/5 transition-colors border-b border-[#E8E4DC] dark:border-white/5 last:border-b-0 ${selectedId === p.id ? 'bg-[#2B8A6E]/5 border-l-2 border-l-[#2B8A6E]' : ''}`}><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-sm text-[#0A0F2E] dark:text-white truncate">{p.name}</span>{p.priority && <Badge className={`text-xs border ${PRIORITY_COLORS[p.priority] || PRIORITY_COLORS.medium}`}>{p.priority}</Badge>}</div><div className="flex items-center gap-2 mt-0.5"><span className={`text-xs font-medium ${CAT_COLORS[p.category?.toLowerCase() || ''] || 'text-[#6B7280]'}`}>{p.domain}</span>{p.timesUsed && p.timesUsed > 0 && <span className="text-xs text-[#6B7280]">· Used {p.timesUsed}×</span>}</div></div><ChevronRight className={`h-4 w-4 flex-shrink-0 mt-0.5 transition-transform ${selectedId === p.id ? 'rotate-90 text-[#2B8A6E]' : 'text-[#6B7280]'}`} /></button>))}
          </div>
          <div className="p-5 min-h-[180px]">
            {!selectedId ? (<div className="flex flex-col items-center justify-center h-full py-8 gap-3 text-center"><div className="p-3 bg-[#2B8A6E]/10"><BookOpen className="h-6 w-6 text-[#2B8A6E]" /></div><p className="text-sm font-medium text-[#0A0F2E] dark:text-white">Select a Readiness Protocol for full details</p><p className="text-xs text-[#6B7280]">Trigger conditions, escalation paths, and execution steps load on demand</p></div>)
              : detailLoading ? (<div className="flex items-center justify-center h-full gap-2 text-[#6B7280]"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Loading...</span></div>)
              : detail ? (<div className="space-y-4"><div className="flex items-start justify-between gap-2"><div><h4 className="font-bold text-[#0A0F2E] dark:text-white text-base" style={CG}>{detail.name}</h4><div className="flex items-center gap-2 mt-1 flex-wrap"><Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20 text-xs">{detail.domain}</Badge>{detail.category && <Badge variant="outline" className="text-xs">{detail.category}</Badge>}{detail.priority && <Badge className={`text-xs border ${PRIORITY_COLORS[detail.priority] || PRIORITY_COLORS.medium}`}>{detail.priority}</Badge>}</div></div><button onClick={() => setSelectedId(null)} className="text-[#6B7280] hover:text-[#0A0F2E] flex-shrink-0"><X className="h-4 w-4" /></button></div>{detail.description && <p className="text-sm text-[#6B7280] leading-relaxed">{detail.description}</p>}<div className="grid grid-cols-2 gap-3"><div className="p-3 bg-[#F8F7F4] dark:bg-white/5 text-center"><p className="text-lg font-bold text-[#0A0F2E] dark:text-white" style={CG}>{Array.isArray(detail.executionSteps) ? detail.executionSteps.length : Array.isArray(detail.enrichedPhases) ? detail.enrichedPhases.length : '—'}</p><p className="text-xs text-[#6B7280]">{Array.isArray(detail.executionSteps) ? 'Steps' : 'Phases'}</p></div><div className="p-3 bg-[#F8F7F4] dark:bg-white/5 text-center"><p className="text-lg font-bold text-[#0A0F2E] dark:text-white" style={CG}>{Array.isArray(detail.stakeholders) ? detail.stakeholders.length : '—'}</p><p className="text-xs text-[#6B7280]">Stakeholders</p></div></div><Link href={`/playbooks/${detail.id}/preview`}><Button size="sm" className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45] font-semibold text-xs mt-1">Open Full Readiness Protocol <ExternalLink className="h-3.5 w-3.5 ml-1.5" /></Button></Link></div>)
              : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── DETECT DATA ─────────────────────────────────────────────────────────────
const detectTools = [
  { title: "Signal Intelligence Hub", description: "Centralized view of all incoming signals and intelligence feeds", path: "/signal-intelligence", icon: Radio, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Real-time monitoring", featured: true },
  { title: "Trigger Monitoring", description: "Configure and manage automated trigger detection rules", path: "/triggers-management", icon: Target, color: "text-[#C9A84C]", bgColor: "bg-[#C9A84C]/10", stats: "Continuous" },
  { title: "Signal Radar Dashboard", description: "360° view of emerging situations and opportunities", path: "/ai-radar", icon: Radar, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Predictive insights" },
  { title: "Weak Signal Detection", description: "Identify early warning indicators before they escalate", path: "/pulse-intelligence", icon: Activity, color: "text-[#C9A84C]", bgColor: "bg-[#C9A84C]/10", stats: "Early warning" },
  { title: "Foresight Radar", description: "Long-range strategic scanning and trend analysis", path: "/foresight-radar", icon: Eye, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Strategic foresight" },
  { title: "Alert Configuration", description: "Set up notifications and escalation workflows", path: "/triggers-management", icon: Bell, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Instant alerts" },
];
const signalCategories = [
  { name: "Market Signals", count: 12, status: "healthy", icon: TrendingUp },
  { name: "Competitive Intel", count: 8, status: "warning", icon: Eye },
  { name: "Regulatory Changes", count: 3, status: "healthy", icon: AlertTriangle },
  { name: "Technology Shifts", count: 5, status: "healthy", icon: Zap },
];

// ─── EXECUTE DATA ─────────────────────────────────────────────────────────────
const executeTools = [
  { title: "Command Center", description: "Real-time coordination hub for active Readiness Protocol execution", path: "/mission-control", icon: Compass, color: "text-[#2B8A6E]", bgColor: "bg-[#2B8A6E]/10", stats: "Live coordination", featured: true },
  { title: "Crisis Response", description: "Rapid response protocols for critical situations", path: "/crisis", icon: AlertTriangle, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Emergency protocols" },
  { title: "Situation Room", description: "War room for strategic decision-making during execution", path: "/war-room", icon: Shield, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Decision support" },
  { title: "Team Collaboration", description: "Real-time communication and task coordination", path: "/collaboration", icon: MessageSquare, color: "text-[#2B8A6E]", bgColor: "bg-[#2B8A6E]/10", stats: "Team sync" },
  { title: "Practice Drills", description: "Simulate scenarios and test team readiness", path: "/practice-drills", icon: Play, color: "text-[#2B8A6E]", bgColor: "bg-[#2B8A6E]/10", stats: "Simulation" },
  { title: "Stakeholder Tracking", description: "Monitor stakeholder engagement and task completion", path: "/stakeholder-management", icon: Users, color: "text-[#C9A84C]", bgColor: "bg-[#C9A84C]/10", stats: "Engagement" },
];
const executionMetrics = [
  { label: "Active Readiness Protocols", value: "2", icon: Play, color: "text-[#2B8A6E]" },
  { label: "Tasks In Progress", value: "14", icon: Activity, color: "text-[#0A0F2E]" },
  { label: "Stakeholders Engaged", value: "28", icon: Users, color: "text-[#2B8A6E]" },
  { label: "Avg Response Time", value: "12m", icon: Timer, color: "text-[#C9A84C]" },
];
type ExecutionRun = { id: string; status: string; startedAt: string | null; completedAt: string | null; outcome: string | null; };
type ExecutionContext = { instanceId: string; status: string; objective: string; description: string | null; currentPhase: string | null; phaseLabel: string; phaseGuidance: string; completionPct: number; total: number; completed: number; inProgress: number; blocked: number; elapsedMinutes: number; minutesRemaining: number; targetMinutes: number; startedAt: string | null; criticalConstraint: string | null; };
type MyTask = { id: string; status: string; taskTitle: string | null; taskDescription: string | null; taskRole: string | null; taskPriority: string | null; taskEstimatedMinutes: number | null; isMyTask: boolean; isScopedView: boolean; userRole: string; blockedReason: string | null; updatedAt: string; };
const STATUS_COLORS: Record<string, string> = { completed: 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20', in_progress: 'bg-[#C9A84C]/10 text-[#92760E] border-[#C9A84C]/30', pending: 'bg-gray-100 text-gray-600 border-gray-200', blocked: 'bg-red-50 text-red-700 border-red-200' };
const PRIORITY_BORDER: Record<string, string> = { critical: 'border-l-red-500', high: 'border-l-orange-400', medium: 'border-l-[#C9A84C]', low: 'border-l-gray-300' };

function JITContextBanner({ runId }: { runId: string }) {
  const { data: ctx, isLoading, refetch } = useQuery<ExecutionContext>({ queryKey: ['/api/execution-runs', runId, 'context'], queryFn: () => fetch(`/api/execution-runs/${runId}/context`, { credentials: 'include' }).then(r => r.json()), refetchInterval: 30000, enabled: !!runId });
  if (isLoading) return <div className="mb-6 p-4 bg-[#C9A84C]/5 border border-[#C9A84C]/20 flex items-center gap-3 text-[#6B7280]"><Loader2 className="h-4 w-4 animate-spin text-[#C9A84C]" /><span className="text-sm">Loading execution context...</span></div>;
  if (!ctx) return null;
  const isUrgent = ctx.blocked > 0 || ctx.minutesRemaining < 60;
  return (
    <Card className={`mb-6 overflow-hidden border-2 ${isUrgent ? 'border-[#C9A84C]' : 'border-[#C9A84C]/30'}`}>
      <div className="bg-[#0A0F2E] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3"><div className="p-2 bg-[#C9A84C]/20"><MapPin className="h-5 w-5 text-[#C9A84C]" /></div><div><div className="flex items-center gap-2"><span className="text-white font-semibold text-sm" style={CG}>{ctx.objective}</span><Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none font-bold text-xs uppercase tracking-wider">EXECUTE</Badge></div><p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-wider mt-0.5">{ctx.phaseLabel}</p></div></div>
          <div className="flex items-center gap-3 flex-shrink-0"><div className="text-right"><p className="text-white text-lg font-bold" style={CG}>{ctx.completionPct}%</p><p className="text-white/50 text-xs">{ctx.completed}/{ctx.total} tasks</p></div><button onClick={() => refetch()} className="text-white/40 hover:text-white/80 transition-colors"><RefreshCw className="h-3.5 w-3.5" /></button></div>
        </div>
        <div className="mt-3"><Progress value={ctx.completionPct} className="h-1.5 bg-white/10 [&>div]:bg-[#C9A84C]" /></div>
      </div>
      <CardContent className="p-4 bg-white dark:bg-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3"><div className="p-2 bg-[#C9A84C]/10 h-fit"><BookOpenIcon className="h-4 w-4 text-[#C9A84C]" /></div><div><p className="text-xs font-bold text-[#0A0F2E] dark:text-white uppercase tracking-wider mb-1">Phase Guidance</p><p className="text-sm text-[#6B7280] leading-relaxed">{ctx.phaseGuidance}</p></div></div>
          <div className="space-y-2"><p className="text-xs font-bold text-[#0A0F2E] dark:text-white uppercase tracking-wider mb-2">Live Status</p><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-sm text-[#6B7280]"><Activity className="h-3.5 w-3.5 text-[#2B8A6E]" /> In Progress</span><span className="font-bold text-[#0A0F2E] dark:text-white text-sm">{ctx.inProgress}</span></div><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-sm text-[#6B7280]"><Clock className="h-3.5 w-3.5 text-[#C9A84C]" /> Time Elapsed</span><span className="font-bold text-[#0A0F2E] dark:text-white text-sm">{ctx.elapsedMinutes}m</span></div>{ctx.blocked > 0 && <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200"><AlertOctagon className="h-3.5 w-3.5 text-red-500 flex-shrink-0" /><span className="text-xs text-red-700 font-medium">{ctx.criticalConstraint}</span></div>}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function MyActionsPanel({ runId }: { runId: string }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const { data: myTasks = [], isLoading } = useQuery<MyTask[]>({ queryKey: ['/api/execution-runs', runId, 'my-tasks'], queryFn: () => fetch(`/api/execution-runs/${runId}/my-tasks`, { credentials: 'include' }).then(r => r.ok ? r.json() : []), refetchInterval: 30000 });
  const pending = myTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const done = myTasks.filter(t => t.status === 'completed' || t.status === 'skipped');
  const blocked = myTasks.filter(t => t.status === 'blocked');
  const isScopedView = myTasks[0]?.isScopedView;
  const userRole = myTasks[0]?.userRole;
  return (
    <Card className="mb-8 border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 overflow-hidden">
      <CardHeader className="pb-4 border-b border-[#E8E4DC]"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="p-2 bg-[#C9A84C]/10"><User className="h-5 w-5 text-[#C9A84C]" /></div><div><div className="flex items-center gap-2"><CardTitle className="text-base text-[#0A0F2E]" style={CG}>My Actions</CardTitle>{isScopedView && userRole && <Badge className="bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20 text-xs font-bold uppercase tracking-wider">{userRole}</Badge>}{!isScopedView && <Badge variant="outline" className="text-xs text-[#6B7280]">All roles visible</Badge>}</div><p className="text-xs text-[#6B7280] mt-0.5">{isScopedView ? 'Schema-gated to your role' : 'Full action surface — admin or executive view'}</p></div></div><div className="flex items-center gap-2">{blocked.length > 0 && <Badge className="bg-red-100 text-red-700 border-red-200 font-bold">{blocked.length} blocked</Badge>}<Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20 font-bold">{done.length}/{myTasks.length} done</Badge></div></div></CardHeader>
      <CardContent className="p-0">
        {isLoading ? <div className="flex items-center justify-center py-10 gap-2 text-[#6B7280]"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Loading your actions...</span></div>
          : myTasks.length === 0 ? <div className="flex flex-col items-center justify-center py-10 gap-3"><CheckCircle className="h-8 w-8 text-[#2B8A6E]" /><p className="text-sm font-medium text-[#0A0F2E]">No tasks assigned to your role</p></div>
          : <div className="divide-y divide-[#E8E4DC]">{[...blocked, ...pending].map(task => (<div key={task.id} className={`px-5 py-4 flex items-start gap-4 border-l-4 ${PRIORITY_BORDER[task.taskPriority || 'medium'] || 'border-l-[#C9A84C]'}`}><div className="flex-shrink-0 mt-0.5">{task.status === 'completed' ? <CheckCircle className="h-4 w-4 text-[#2B8A6E]" /> : task.status === 'blocked' ? <AlertOctagon className="h-4 w-4 text-red-500" /> : task.status === 'in_progress' ? <Activity className="h-4 w-4 text-[#2B8A6E]" /> : <Clock className="h-4 w-4 text-[#6B7280]" />}</div><div className="flex-1 min-w-0"><div className="flex flex-wrap items-center gap-2 mb-1"><span className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-[#6B7280]' : 'text-[#0A0F2E]'}`}>{task.taskTitle || 'Unnamed Task'}</span><Badge className={`text-xs border ${STATUS_COLORS[task.status] || STATUS_COLORS.pending}`}>{task.status.replace('_', ' ')}</Badge></div>{task.taskDescription && <p className="text-xs text-[#6B7280] mb-1 leading-relaxed">{task.taskDescription}</p>}<div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">{task.taskRole && <span className="flex items-center gap-1"><User className="h-3 w-3" />{task.taskRole}</span>}{task.taskEstimatedMinutes && <span className="flex items-center gap-1"><Timer className="h-3 w-3" />Est. {task.taskEstimatedMinutes}m</span>}{task.blockedReason && <span className="text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{task.blockedReason}</span>}</div></div></div>))}{done.length > 0 && (<><button onClick={() => setShowCompleted(prev => !prev)} className="w-full px-5 py-3 flex items-center justify-between bg-[#F8F7F4] hover:bg-[#2B8A6E]/5 transition-colors border-l-4 border-l-[#2B8A6E]"><div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#2B8A6E]" /><span className="text-sm font-bold text-[#2B8A6E] uppercase tracking-wider">{done.length} task{done.length !== 1 ? 's' : ''} completed</span></div><ChevronRight className={`h-4 w-4 text-[#6B7280] transition-transform duration-200 ${showCompleted ? 'rotate-90' : ''}`} /></button>{showCompleted && done.map(task => (<div key={task.id} className="px-5 py-4 flex items-start gap-4 border-l-4 border-l-[#2B8A6E] opacity-60"><CheckCircle className="h-4 w-4 text-[#2B8A6E] flex-shrink-0 mt-0.5" /><div className="flex-1 min-w-0"><span className="font-semibold text-sm line-through text-[#6B7280]">{task.taskTitle || 'Unnamed Task'}</span></div></div>))}</>)}</div>}
      </CardContent>
    </Card>
  );
}

// ─── ADVANCE DATA ─────────────────────────────────────────────────────────────
const advanceTools = [
  { title: "Strategic Learning Center", description: "Pattern-based performance intelligence — review what worked, refine what didn't, and close the improvement loop", path: "/execution-learning", icon: Brain, color: "text-[#C9A84C]", bgColor: "bg-[#C9A84C]/10", stats: "AI optimization", featured: true },
  { title: "Institutional Memory", description: "Capture and preserve organizational learnings from every execution", path: "/institutional-memory", icon: BookOpen, color: "text-[#2B8A6E]", bgColor: "bg-[#2B8A6E]/10", stats: "Knowledge base" },
  { title: "Decision Velocity", description: "Track and improve organizational decision-making speed", path: "/decision-velocity", icon: Activity, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Performance metrics" },
  { title: "Executive Dashboard", description: "Strategic overview of organizational readiness and performance", path: "/executive-dashboard", icon: BarChart3, color: "text-[#C9A84C]", bgColor: "bg-[#C9A84C]/10", stats: "Executive view" },
  { title: "Executive Analytics", description: "Deep-dive analytics on Readiness Protocol effectiveness and outcomes", path: "/analytics", icon: TrendingUp, color: "text-[#0A0F2E]", bgColor: "bg-[#0A0F2E]/10", stats: "Advanced insights" },
  { title: "Intelligence Hub", description: "Pattern-based recognition and improvement suggestions", path: "/ai", icon: Brain, color: "text-[#2B8A6E]", bgColor: "bg-[#2B8A6E]/10", stats: "System recommendations" },
  { title: "Readiness Protocol Refinement", description: "Update Readiness Protocols based on lessons learned", path: "/living-Readiness Protocols", icon: RefreshCw, color: "text-[#2B8A6E]", bgColor: "bg-[#2B8A6E]/10", stats: "Continuous improvement" },
];
const learningMetrics = [
  { label: "Lessons Captured", value: "47", icon: Lightbulb, color: "text-[#2B8A6E]" },
  { label: "Readiness Protocols Improved", value: "23", icon: RefreshCw, color: "text-[#0A0F2E]" },
  { label: "Decision Velocity", value: "+34%", icon: Activity, color: "text-[#C9A84C]" },
  { label: "Team Readiness", value: "92%", icon: Award, color: "text-[#0A0F2E]" },
];
const THRESHOLD_OPTIONS = [{ label: "2 hours", value: "2" }, { label: "4 hours", value: "4" }, { label: "8 hours", value: "8" }, { label: "24 hours", value: "24" }];
type StuckTask = { id: string; executionInstanceId: string; status: string; blockedReason: string | null; assignedUserId: string | null; updatedAt: string; createdAt: string; taskTitle: string | null; taskRole: string | null; taskPriority: string | null; taskEstimatedMinutes: number | null; hoursStuck: number; severity: 'watch' | 'warning' | 'critical'; };
function SeverityIcon({ severity }: { severity: string }) {
  if (severity === 'critical') return <AlertOctagon className="h-4 w-4 text-red-500" />;
  if (severity === 'warning') return <AlertTriangle className="h-4 w-4 text-[#C9A84C]" />;
  return <Eye className="h-4 w-4 text-[#6B7280]" />;
}
function SeverityBadge({ severity }: { severity: string }) {
  if (severity === 'critical') return <Badge className="bg-red-100 text-red-700 border-red-200 font-bold text-xs uppercase tracking-wider">Critical</Badge>;
  if (severity === 'warning') return <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-bold text-xs uppercase tracking-wider">Warning</Badge>;
  return <Badge className="bg-gray-100 text-gray-600 border-gray-200 font-bold text-xs uppercase tracking-wider">Watch</Badge>;
}
function DoomLoopDetector() {
  const [threshold, setThreshold] = useState("4");
  const [escalatedIds, setEscalatedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { data: stuckTasks = [], isLoading, refetch } = useQuery<StuckTask[]>({ queryKey: ['/api/stuck-tasks', threshold], queryFn: () => fetch(`/api/stuck-tasks?hours=${threshold}`, { credentials: 'include' }).then(r => r.ok ? r.json() : []), refetchInterval: 60000 });
  const escalateMutation = useMutation({ mutationFn: ({ taskId, notes }: { taskId: string; notes: string }) => apiRequest('PATCH', `/api/stuck-tasks/${taskId}/escalate`, { notes }), onSuccess: (_, { taskId }) => { setEscalatedIds(prev => new Set([...Array.from(prev), taskId])); queryClient.invalidateQueries({ queryKey: ['/api/stuck-tasks'] }); toast({ title: "Task escalated" }); }, onError: () => toast({ title: "Error", description: "Failed to escalate task.", variant: "destructive" }) });
  const criticalCount = stuckTasks.filter(t => t.severity === 'critical').length;
  const warningCount = stuckTasks.filter(t => t.severity === 'warning').length;
  return (
    <Card className="mb-8 border-2 border-[#C9A84C]/30 bg-white dark:bg-white/5 overflow-hidden">
      <CardHeader className="pb-4 bg-[#0A0F2E]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3"><div className="p-2.5 bg-[#C9A84C]/20"><ShieldAlert className="h-6 w-6 text-[#C9A84C]" /></div><div><div className="flex items-center gap-2"><CardTitle className="text-white text-lg" style={CG}>Stuck Execution Detector</CardTitle><Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none font-bold text-xs uppercase tracking-wider px-2">ADVANCE</Badge></div><p className="text-white/50 text-sm mt-0.5">Tasks assigned but not advancing — the enterprise doom-loop fingerprint</p></div></div>
          <div className="flex items-center gap-3"><span className="text-white/50 text-sm whitespace-nowrap">Stuck longer than</span><Select value={threshold} onValueChange={setThreshold}><SelectTrigger className="w-32 bg-white/10 border-white/20 text-white text-sm"><SelectValue /></SelectTrigger><SelectContent>{THRESHOLD_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select><Button variant="outline" size="sm" onClick={() => refetch()} className="border-white/20 text-white hover:bg-white/10 bg-transparent"><RefreshCw className="h-3.5 w-3.5" /></Button></div>
        </div>
        {!isLoading && stuckTasks.length > 0 && <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10"><div className="flex items-center gap-1.5"><AlertOctagon className="h-4 w-4 text-red-400" /><span className="text-red-400 font-bold text-sm">{criticalCount} critical</span></div><div className="flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-[#C9A84C]" /><span className="text-[#C9A84C] font-bold text-sm">{warningCount} warning</span></div><div className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-white/40" /><span className="text-white/40 text-sm">{stuckTasks.length - criticalCount - warningCount} watch</span></div></div>}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? <div className="flex items-center justify-center py-12 gap-3 text-[#6B7280]"><RefreshCw className="h-4 w-4 animate-spin" /><span className="text-sm">Scanning active executions...</span></div>
          : stuckTasks.length === 0 ? <div className="flex flex-col items-center justify-center py-12 gap-3"><div className="p-3 bg-[#2B8A6E]/10"><CheckCircle2 className="h-8 w-8 text-[#2B8A6E]" /></div><p className="font-semibold text-[#0A0F2E] dark:text-white">No stuck tasks detected</p><p className="text-sm text-[#6B7280]">All active tasks have moved within the last {threshold} hour{threshold !== "1" ? "s" : ""}</p></div>
          : <div className="divide-y divide-[#E8E4DC] dark:divide-white/10">{stuckTasks.map(task => { const isEscalated = escalatedIds.has(task.id); return (<div key={task.id} className={`p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-[#F8F7F4] transition-colors ${task.severity === 'critical' ? 'bg-red-50/60' : ''}`}><div className="flex items-start gap-3 flex-1 min-w-0"><div className={`mt-0.5 p-1.5 flex-shrink-0 ${task.severity === 'critical' ? 'bg-red-100' : task.severity === 'warning' ? 'bg-amber-50' : 'bg-gray-100'}`}><SeverityIcon severity={task.severity} /></div><div className="flex-1 min-w-0"><div className="flex flex-wrap items-center gap-2 mb-1"><span className="font-semibold text-[#0A0F2E] text-sm truncate">{task.taskTitle || "Unnamed Task"}</span><SeverityBadge severity={task.severity} /></div><div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">{task.taskRole && <span className="flex items-center gap-1"><User className="h-3 w-3" />{task.taskRole}</span>}<span className="flex items-center gap-1"><Clock className="h-3 w-3" />Stuck <strong className="ml-0.5">{task.hoursStuck}h</strong></span>{task.blockedReason && <span className="text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{task.blockedReason}</span>}</div></div></div><div className="flex-shrink-0">{isEscalated ? <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20 font-semibold px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Escalated</Badge> : <Button size="sm" onClick={() => escalateMutation.mutate({ taskId: task.id, notes: `Re-escalated after ${task.hoursStuck}h without progress` })} disabled={escalateMutation.isPending} className="bg-[#0A0F2E] text-white hover:bg-[#141B45] font-semibold text-xs"><Zap className="h-3.5 w-3.5 mr-1.5" />Re-Escalate</Button>}</div></div>); })}</div>}
      </CardContent>
    </Card>
  );
}

// ─── SHARED TOOLS GRID ────────────────────────────────────────────────────────
function ToolsGrid({ tools, label }: { tools: typeof identifyTools; label: string }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4" style={{ ...CG, color: NAVY }}>{label} Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tools.map(tool => (
          <Link key={tool.path + tool.title} href={tool.path}>
            <Card className={`border-[#E8E4DC] bg-white h-full transition-all cursor-pointer group ${tool.featured ? 'border-2 border-[#C9A84C]/50' : ''}`}>
              <CardContent className="p-6"><div className="flex items-start gap-4"><div className={`p-3 ${tool.bgColor}`}><tool.icon className={`h-6 w-6 ${tool.color}`} /></div><div className="flex-1"><div className="flex items-center justify-between"><h3 className="font-semibold text-[#0A0F2E] group-hover:text-[#C9A84C] transition-colors">{tool.title}</h3><ChevronRight className="h-4 w-4 text-[#6B7280] group-hover:text-[#C9A84C] transition-colors" /></div><p className="text-sm text-[#6B7280] mt-1">{tool.description}</p><Badge variant="outline" className="mt-3 text-xs border-[#E8E4DC] text-[#6B7280]">{tool.stats}</Badge></div></div></CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

// ─── IDEA PHASE TILES DATA ─────────────────────────────────────────────────────
const IDEA_PHASE_TILES = [
  {
    id: 'identify',
    phase: 'Phase 1',
    label: 'IDENTIFY',
    name: 'Readiness Protocol Factory',
    desc: 'Build, customize, and manage strategic Readiness Protocols for every scenario your organization will face.',
    stat: '180 Readiness Protocols',
    statSub: 'across 9 domains',
    accentColor: TEAL,
    borderHover: TEAL,
    anim: 'wh-tile-1',
  },
  {
    id: 'detect',
    phase: 'Phase 2',
    label: 'DETECT',
    name: 'Signal Ops',
    desc: 'Monitor 248+ data points across 9 strategic domains. AI flags triggers before competitors see them.',
    stat: '248+ Data Points',
    statSub: '9 strategic domains',
    accentColor: GOLD,
    borderHover: GOLD,
    anim: 'wh-tile-2',
  },
  {
    id: 'execute',
    phase: 'Phase 3',
    label: 'EXECUTE',
    name: 'Compass Command',
    desc: 'Coordinate full organizational response. Roles assigned, tasks staged, stakeholders notified.',
    stat: '12 Minutes',
    statSub: 'to live execution',
    accentColor: GOLD,
    borderHover: GOLD,
    anim: 'wh-tile-3',
  },
  {
    id: 'advance',
    phase: 'Phase 4',
    label: 'ADVANCE',
    name: 'Retrospect Lab',
    desc: 'Capture learnings, refine playbooks, improve decision velocity. Every execution makes you faster.',
    stat: '+34%',
    statSub: 'decision velocity',
    accentColor: TEAL,
    borderHover: TEAL,
    anim: 'wh-tile-4',
  },
];

function IDEAPhaseLanding({ activeTab, onSelect }: { activeTab: string; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div style={{ background: NAVY, borderBottom: `1px solid rgba(201,168,76,0.15)`, padding: '32px 0 0' }}>
      <style>{`
        @keyframes wh-fadeup { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .wh-tile-1{animation:wh-fadeup 0.45s ease 0.05s both}
        .wh-tile-2{animation:wh-fadeup 0.45s ease 0.12s both}
        .wh-tile-3{animation:wh-fadeup 0.45s ease 0.19s both}
        .wh-tile-4{animation:wh-fadeup 0.45s ease 0.26s both}
      `}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 28, height: 1.5, background: GOLD }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>IDEA Framework™</span>
          <div style={{ width: 28, height: 1.5, background: GOLD }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.5)', marginLeft: 4 }}>Execution Workspace</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, paddingBottom: 0 }}>
          {IDEA_PHASE_TILES.map(tile => {
            const isActive = activeTab === tile.id;
            const isHov = hovered === tile.id;
            return (
              <div
                key={tile.id}
                className={tile.anim}
                onClick={() => onSelect(tile.id)}
                onMouseEnter={() => setHovered(tile.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.06)' : isHov ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.025)',
                  borderTop: `1px solid ${isActive ? tile.accentColor : isHov ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderLeft: `1px solid ${isActive ? tile.accentColor : isHov ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderRight: `1px solid ${isActive ? tile.accentColor : isHov ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderBottom: `3px solid ${isActive ? tile.accentColor : 'transparent'}`,
                  padding: '20px 20px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: tile.accentColor }}>{tile.phase}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: isActive ? tile.accentColor : 'rgba(240,237,228,0.4)', border: `1px solid ${isActive ? tile.accentColor : 'rgba(255,255,255,0.1)'}`, padding: '2px 7px' }}>{tile.label}</span>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#F0EDE4', marginBottom: 6, lineHeight: 1.1 }}>{tile.name}</div>
                <p style={{ fontSize: 11, color: 'rgba(240,237,228,0.5)', lineHeight: 1.5, marginBottom: 14, minHeight: 48 }}>{tile.desc}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: tile.accentColor, lineHeight: 1 }}>{tile.stat}</div>
                    <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.5)', letterSpacing: '0.06em', marginTop: 2 }}>{tile.statSub}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: isActive ? tile.accentColor : 'rgba(240,237,228,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {isActive ? 'ACTIVE' : 'ENTER'} <span style={{ fontSize: 12 }}>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN HUB ─────────────────────────────────────────────────────────────────
export default function WorkspaceHub() {
  const { isReady } = useRequireAuth();
  const [location] = useLocation();
  const initTab = () => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get('tab') || '';
    if (['identify','detect','execute','advance'].includes(t)) return t;
    if (location.includes('identify')) return 'identify';
    if (location.includes('detect')) return 'detect';
    if (location.includes('execute')) return 'execute';
    if (location.includes('advance')) return 'advance';
    return 'identify';
  };
  const [activeTab, setActiveTab] = useState(initTab);

  const { data: runsRaw } = useQuery<ExecutionRun[]>({ queryKey: ['/api/execution-runs'], queryFn: () => fetch('/api/execution-runs', { credentials: 'include' }).then(r => r.json()), enabled: activeTab === 'execute' });
  const runs = Array.isArray(runsRaw) ? runsRaw : [];
  const activeRun = runs.find(r => r.status === 'running' || r.status === 'pending') || null;

  const activeTabData = TABS.find(t => t.id === activeTab)!;

  if (!isReady) return null;
  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">

        {/* ─── IDEA Phase Tile Landing ───────────────────────────────────── */}
        <IDEAPhaseLanding activeTab={activeTab} onSelect={setActiveTab} />

        {/* ─── IDEA Tab Bar ─────────────────────────────────────────────── */}
        <div className="bg-white border-b border-[#E8E4DC] sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-5 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all border-b-2"
                    style={{
                      color: isActive ? tab.color : '#9CA3AF',
                      borderBottomColor: isActive ? tab.color : 'transparent',
                      background: 'transparent',
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                    <span className="ml-1 text-[9px] font-medium opacity-60">{tab.phase}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Tab Content ──────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Page header */}
          <div className="mb-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6B7280] hover:text-[#0A0F2E] transition-colors" style={{ textDecoration: 'none', letterSpacing: '0.1em' }}>
              ← Dashboard
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4" style={{ background: activeTabData.color, boxShadow: `0 8px 20px ${activeTabData.color}33` }}>
                <activeTabData.icon className="h-8 w-8" style={{ color: activeTab === 'execute' ? NAVY : 'white' }} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold" style={{ ...CG, color: NAVY }}>
                    {activeTab === 'identify' ? 'Readiness Protocol Factory' : activeTab === 'detect' ? 'Signal Ops' : activeTab === 'execute' ? 'Compass Command' : 'Retrospect Lab'}
                  </h1>
                  <Badge className="px-3 py-1 font-bold uppercase tracking-wider border-none" style={{ background: activeTabData.color, color: activeTab === 'execute' ? NAVY : 'white' }}>
                    {activeTabData.label}
                  </Badge>
                </div>
                <p className="text-[#6B7280] mt-1">
                  {activeTab === 'identify' ? 'Build, customize, and manage strategic Readiness Protocols for every scenario'
                    : activeTab === 'detect' ? 'Monitor, detect, and analyze strategic signals in real-time'
                    : activeTab === 'execute' ? 'Coordinate responses and execute Readiness Protocols in 12 minutes'
                    : 'Learn, improve, and strengthen organizational resilience'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {activeTab === 'identify' && (<><Link href="/playbooks"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><BookOpen className="h-4 w-4 mr-2" />Browse Library</Button></Link><Link href="/playbook-customize/new"><Button variant="outline"><Sparkles className="h-4 w-4 mr-2" />Create New</Button></Link></>)}
              {activeTab === 'detect' && (<><Link href="/signal-intelligence"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><Radio className="h-4 w-4 mr-2" />View Signals</Button></Link><Link href="/triggers-management"><Button variant="outline"><Target className="h-4 w-4 mr-2" />Configure Triggers</Button></Link></>)}
              {activeTab === 'execute' && (<><Link href="/command-center"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><Compass className="h-4 w-4 mr-2" />Open Command Center</Button></Link><Link href="/practice-drills"><Button variant="outline" className="border-[#C9A84C]/20 text-[#C9A84C]"><Play className="h-4 w-4 mr-2" />Run Drill</Button></Link></>)}
              {activeTab === 'advance' && (<><Link href="/institutional-memory"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><BookOpen className="h-4 w-4 mr-2" />View Learnings</Button></Link><Link href="/command-center"><Button variant="outline"><BarChart3 className="h-4 w-4 mr-2" />Dashboard</Button></Link></>)}
            </div>
          </div>

          {/* ── IDENTIFY ── */}
          {activeTab === 'identify' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {domainCategories.map(cat => (
                  <Card key={cat.name} className="border-[#E8E4DC] bg-white ">
                    <CardContent className="p-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><cat.icon className={`h-6 w-6 ${cat.color}`} /><h3 className="font-bold" style={{ ...CG, color: NAVY }}>{cat.name}</h3></div><Badge variant="secondary" className="bg-[#E8E4DC]">{cat.count} Readiness Protocols</Badge></div><div className="space-y-1">{cat.domains.map(d => <p key={d} className="text-sm text-[#6B7280]">• {d}</p>)}</div></CardContent>
                  </Card>
                ))}
              </div>
              <TwoPhasePlaybookSelector />
              <h2 className="text-xl font-bold mb-4" style={{ ...CG, color: NAVY }}>Recent Readiness Protocol Activity</h2>
              <div className="space-y-3 mb-8">
                {[{ name: "M&A Integration Readiness Protocol #12", badge: "Active", badgeBg: "#2B8A6E", icon: BookOpen, border: "#2B8A6E", time: "2 hours ago", note: "Updated by Sarah Chen" },{ name: "Crisis Response Readiness Protocol #31", badge: "Triggered", badgeBg: "#EF4444", icon: Shield, border: NAVY, time: "Feb 3", note: "Activated via automated trigger" },{ name: "Product Launch Readiness Protocol #45", badge: "In Review", badgeBg: GOLD, icon: Rocket, border: GOLD, time: "Pending", note: "Draft review from 3 stakeholders" }].map(item => (
                  <Card key={item.name} className="border-[#E8E4DC] bg-white " style={{ borderLeft: `4px solid ${item.border}` }}>
                    <CardContent className="p-4"><div className="flex items-center gap-4"><div className="p-2" style={{ background: `${item.border}1A` }}><item.icon className="h-5 w-5" style={{ color: item.border }} /></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><h4 className="font-semibold text-[#0A0F2E]">{item.name}</h4><Badge className="border-none text-white font-bold" style={{ background: item.badgeBg, color: item.badgeBg === GOLD ? NAVY : 'white' }}>{item.badge}</Badge></div><p className="text-sm text-[#6B7280] mt-0.5">{item.note} · {item.time}</p></div></div></CardContent>
                  </Card>
                ))}
              </div>
              <ToolsGrid tools={identifyTools} label="IDENTIFY" />
              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30"><CardContent className="p-6"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="p-3 bg-white/10"><Target className="h-6 w-6 text-[#C9A84C]" /></div><div><h3 className="font-semibold text-white">Ready for the next phase?</h3><p className="text-sm text-white/60">Set up signal monitoring in DETECT</p></div></div><Button onClick={() => setActiveTab('detect')} className="bg-[#0A0F2E] text-white font-bold hover:bg-[#141B45] border border-white/20">Go to DETECT <ArrowRight className="h-4 w-4 ml-2" /></Button></div></CardContent></Card>
            </>
          )}

          {/* ── DETECT ── */}
          {activeTab === 'detect' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {signalCategories.map(cat => (
                  <Card key={cat.name} className="border-[#E8E4DC] bg-white ">
                    <CardContent className="p-4"><div className="flex items-center justify-between mb-2"><cat.icon className="h-5 w-5 text-[#0A0F2E]" /><Badge variant={cat.status === 'warning' ? 'destructive' : 'secondary'} className="text-xs">{cat.status}</Badge></div><p className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{cat.count}</p><p className="text-xs text-[#6B7280]">{cat.name}</p></CardContent>
                  </Card>
                ))}
              </div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ ...CG, color: NAVY }}>
                <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full bg-[#0A0F2E] opacity-75"></span><span className="relative inline-flex h-3 w-3 bg-[#0A0F2E]"></span></span>
                Live Signal Feed
              </h2>
              <div className="space-y-3 mb-8">
                {[{ title: "Competitor patent filing detected", desc: "TechCorp filed 3 new AI patents", severity: "Medium", color: TEAL, time: "14 min ago" },{ title: "Regulatory alert", desc: "SEC proposed new AI disclosure requirements", severity: "High", color: "#EF4444", time: "2 hours ago" },{ title: "Market shift", desc: "APAC semiconductor demand up 23% QoQ", severity: "Low", color: TEAL, time: "4 hours ago" },{ title: "Social sentiment spike", desc: "Brand mentions up 340% on Twitter/X", severity: "Medium", color: TEAL, time: "6 hours ago" }].map(sig => (
                  <Card key={sig.title} className="border-[#E8E4DC] bg-white "><CardContent className="p-4"><div className="flex items-center gap-4"><span className="flex h-3 w-3 flex-shrink-0" style={{ background: sig.color }} /><div className="flex-1 min-w-0"><h4 className="font-semibold text-[#0A0F2E]">{sig.title}</h4><p className="text-sm text-[#6B7280] mt-0.5">{sig.desc}</p></div><Badge className="border-none text-white flex-shrink-0" style={{ background: sig.color }}>{sig.severity}</Badge><span className="text-xs text-[#6B7280] whitespace-nowrap">{sig.time}</span></div></CardContent></Card>
                ))}
              </div>
              <ToolsGrid tools={detectTools} label="DETECT" />
              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30"><CardContent className="p-6"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="p-3 bg-white/10"><Zap className="h-6 w-6 text-[#C9A84C]" /></div><div><h3 className="font-semibold text-white">Trigger detected?</h3><p className="text-sm text-white/60">Move to EXECUTE for coordinated response</p></div></div><Button onClick={() => setActiveTab('execute')} className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">Go to EXECUTE <ArrowRight className="h-4 w-4 ml-2" /></Button></div></CardContent></Card>
            </>
          )}

          {/* ── EXECUTE ── */}
          {activeTab === 'execute' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {executionMetrics.map(m => (<Card key={m.label} className="border-[#E8E4DC] bg-white "><CardContent className="p-4"><m.icon className={`h-5 w-5 ${m.color} mb-2`} /><p className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{m.value}</p><p className="text-xs text-[#6B7280]">{m.label}</p></CardContent></Card>))}
              </div>
              {activeRun && <JITContextBanner runId={activeRun.id} />}
              {activeRun && <MyActionsPanel runId={activeRun.id} />}
              <Card className="mb-8 bg-white border border-[#E8E4DC]"><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 bg-[#0A0F2E]/10"><Timer className="h-8 w-8 text-[#C9A84C]" /></div><div><h3 className="text-xl font-bold text-[#0A0F2E]" style={CG}>12 Minutes to Coordinated Response</h3><p className="text-[#6B7280]">Readiness OS delivers a 3,600× Execution Head Start — 30 days of mobilization compressed to 12 minutes</p></div></div></CardContent></Card>
              <h2 className="text-xl font-bold mb-4" style={{ ...CG, color: NAVY }}>Active Executions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[{ name: "M&A Integration — CloudTech Acquisition", pct: 78, tasks: "28 of 45", stakeholders: "45", date: "Jan 28", badge: "Active" },{ name: "Competitive Response — Market Counter-Strategy", pct: 34, tasks: "8 of 24", stakeholders: "18", date: "Feb 15", badge: "In Progress" }].map(ex => (
                  <Card key={ex.name} className="border-[#E8E4DC] bg-white border-l-4 border-l-[#C9A84C] "><CardContent className="p-6"><div className="flex items-center justify-between mb-3"><h4 className="font-semibold text-[#0A0F2E]">{ex.name}</h4><Badge className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">{ex.badge}</Badge></div><div className="flex items-center gap-2 mb-2"><span className="text-sm font-medium text-[#0A0F2E]">{ex.pct}%</span><Progress value={ex.pct} className="flex-1 h-2 bg-[#E8E4DC] [&>div]:bg-[#C9A84C]" /></div><div className="flex items-center gap-4 text-sm text-[#6B7280] mb-4"><span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" />{ex.tasks} tasks</span><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{ex.stakeholders} stakeholders</span><span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{ex.date}</span></div><Link href="/command-center"><Button size="sm" variant="outline" className="border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/5">View Details <ChevronRight className="h-3.5 w-3.5 ml-1" /></Button></Link></CardContent></Card>
                ))}
              </div>
              <ToolsGrid tools={executeTools} label="EXECUTE" />
              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30"><CardContent className="p-6"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="p-3 bg-white/10"><TrendingUp className="h-6 w-6 text-[#C9A84C]" /></div><div><h3 className="font-semibold text-white">Execution complete?</h3><p className="text-sm text-white/60">Capture lessons learned in ADVANCE</p></div></div><Button onClick={() => setActiveTab('advance')} className="bg-[#2B8A6E] text-white font-bold hover:bg-[#3BAF8A]">Go to ADVANCE <ArrowRight className="h-4 w-4 ml-2" /></Button></div></CardContent></Card>
            </>
          )}

          {/* ── ADVANCE ── */}
          {activeTab === 'advance' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {learningMetrics.map(m => (<Card key={m.label} className="border-[#E8E4DC] bg-white "><CardContent className="p-4"><m.icon className={`h-5 w-5 ${m.color} mb-2`} /><p className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{m.value}</p><p className="text-xs text-[#6B7280]">{m.label}</p></CardContent></Card>))}
              </div>
              <DoomLoopDetector />
              <Card className="mb-8 bg-white border border-[#E8E4DC]"><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 bg-[#0A0F2E]/10"><RefreshCw className="h-8 w-8 text-[#C9A84C]" /></div><div><h3 className="text-xl font-bold text-[#0A0F2E]" style={CG}>Continuous Learning Loop</h3><p className="text-[#6B7280]">Every execution makes your Readiness Protocols smarter and your team faster</p></div></div></CardContent></Card>
              <h2 className="text-xl font-bold mb-4" style={{ ...CG, color: NAVY }}>Recent Learnings</h2>
              <div className="space-y-3 mb-8">
                {[{ text: "5-tier stakeholder hierarchy reduced notification fatigue by 41%", badge: "Pattern", badgeBg: TEAL, icon: Lightbulb, conf: 89 },{ text: "Auto-isolation rules cut cyber incident damage by 78%", badge: "Automation", badgeBg: TEAL, icon: Brain, conf: 96 },{ text: "Pre-approved budget thresholds accelerate response by 34%", badge: "Financial", badgeBg: GOLD, icon: BarChart3, conf: 87 }].map(l => (
                  <Card key={l.text} className="border-[#E8E4DC] bg-white "><CardContent className="p-4"><div className="flex items-center gap-4"><div className="p-2" style={{ background: `${l.badgeBg}1A` }}><l.icon className="h-5 w-5" style={{ color: l.badgeBg }} /></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap mb-1"><h4 className="font-semibold text-[#0A0F2E]">{l.text}</h4><Badge className="border-none font-bold" style={{ background: `${l.badgeBg}1A`, color: l.badgeBg }}>{l.badge}</Badge></div><div className="flex items-center gap-3"><span className="text-sm text-[#6B7280]">Confidence: {l.conf}%</span><Progress value={l.conf} className="w-24 h-1.5 bg-[#E8E4DC] [&>div]:bg-[#C9A84C]" /></div></div></div></CardContent></Card>
                ))}
              </div>
              <ToolsGrid tools={advanceTools} label="ADVANCE" />
              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30"><CardContent className="p-6"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="p-3 bg-white/10"><ClipboardList className="h-6 w-6 text-[#C9A84C]" /></div><div><h3 className="font-semibold text-white">Ready to apply learnings?</h3><p className="text-sm text-white/60">Update your Readiness Protocols and start the cycle again</p></div></div><Button onClick={() => setActiveTab('identify')} className="bg-[#2B8A6E] text-white font-bold hover:bg-[#3BAF8A]">Back to IDENTIFY <ArrowRight className="h-4 w-4 ml-2" /></Button></div></CardContent></Card>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
