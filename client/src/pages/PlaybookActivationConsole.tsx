import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/layout/PageLayout';
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  AlertTriangle, 
  Target, 
  Users, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  PauseCircle,
  Trophy,
  MessageSquare,
  Zap,
  Loader2,
  Shield,
  Crosshair,
  Award,
  Brain,
  BarChart3,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DecisionConfidenceScore from "@/components/DecisionConfidenceScore";
import StakeholderAlignmentDashboard from "@/components/StakeholderAlignmentDashboard";
import ExecutionValidationReport from "@/components/ExecutionValidationReport";
import PlaybookLearningsPanel from "@/components/playbook/PlaybookLearningsPanel";
import PreActivationImpactPreview from "@/components/predictive/PreActivationImpactPreview";

interface ExecutionCheckpoint {
  id: string;
  title: string;
  description: string;
  assignedRole: string;
  status: 'pending' | 'in_progress' | 'completed';
  estimatedMinutes: number;
  completedAt?: Date;
}

interface DemoTask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: string;
  assignedTo: null;
  assignedRole?: string | null;  // From enrichedPhases: the specific C-suite owner
  timeTarget?: string | null;    // From enrichedPhases: "90 sec", "2 min", etc.
  phase?: string | null;         // From enrichedPhases: phase name e.g. "DETECT & VALIDATE"
  decisionGate?: { question: string; yes: string; no: string } | null; // After last task of a phase
  isAIGenerated?: boolean; // True for GPT-4o generated scenario-specific tasks
}

// ─── Brand constants (module-level so helper components can use them) ──────
const NAVY   = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD   = "#C9A84C";
const GOLD_LT  = "#DFC178";
const TEAL   = "#2B8A6E";
const TEAL_LT  = "#3BAF8A";
const OFF    = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED  = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const DOMAIN_TASKS: Record<string, string[]> = {
  'Financial Strategy': [
    'Brief CFO and treasury team — assess immediate liquidity exposure',
    'Engage investment bank advisors for rapid situation assessment',
    'Activate board finance committee for emergency session',
    'Initiate regulatory disclosure review with legal counsel',
    'Model 3 financial response scenarios with downside protection',
    'Deploy investor relations protocol — prepare stakeholder messaging',
    'Establish war room with real-time financial monitoring dashboard',
  ],
  'Market Dynamics': [
    'Activate competitive intelligence sweep across all monitored channels',
    'Brief sales leadership — identify accounts at immediate risk',
    'Deploy customer retention task force for top 20 accounts',
    'Engage marketing for rapid positioning response campaign',
    'Convene pricing strategy team for emergency review session',
    'Launch win/loss analysis on recent competitive deals',
    'Prepare board competitive briefing with response options',
  ],
  'Operational Excellence': [
    'Stand up cross-functional operations war room',
    'Activate backup vendor and supplier protocols',
    'Brief operations leadership on containment priorities',
    'Deploy rapid process audit across critical workflows',
    'Initiate SLA review and customer impact triage',
    'Mobilize field teams for immediate assessment',
    'Establish 24-hour status reporting cadence',
  ],
  'Technology & Innovation': [
    'Activate technology risk assessment and impact analysis',
    'Brief CTO and engineering leads on containment options',
    'Initiate vendor and platform dependency audit',
    'Deploy security and compliance review team',
    'Launch accelerated evaluation of alternative technology paths',
    'Establish engineering war room with real-time system monitoring',
    'Prepare board technology briefing with response timeline',
  ],
  'AI Governance': [
    'Activate AI governance review committee',
    'Initiate model audit and bias detection sweep',
    'Brief legal and compliance on regulatory exposure',
    'Deploy AI ethics review across affected systems',
    'Establish AI incident response protocol',
    'Engage external AI governance advisors',
    'Prepare board briefing on AI risk and remediation timeline',
  ],
  'Brand & Reputation': [
    'Activate crisis communications team — assess narrative exposure',
    'Brief CEO and executive team on messaging protocol',
    'Engage PR firm for rapid media monitoring and response',
    'Deploy social media containment and monitoring protocol',
    'Prepare holding statement and customer communication drafts',
    'Launch stakeholder outreach to key partners and investors',
    'Establish 24-hour media monitoring war room',
  ],
  'Regulatory & Compliance': [
    'Engage outside legal counsel for immediate regulatory review',
    'Brief board audit committee on exposure and disclosure obligations',
    'Activate compliance team for rapid assessment and response',
    'Initiate document preservation and litigation hold protocol',
    'Prepare regulatory agency communication strategy',
    'Deploy cross-functional compliance task force',
    'Establish government affairs engagement protocol',
  ],
  'Talent & Leadership': [
    'Brief CHRO and people leadership on talent risk exposure',
    'Activate retention protocol for critical role holders',
    'Deploy leadership succession review and contingency planning',
    'Initiate employee communication and engagement protocol',
    'Engage executive search firm for contingency pipeline',
    'Launch culture and sentiment rapid assessment',
    'Prepare board talent briefing with risk and response options',
  ],
};

const GENERIC_TASKS = [
  'Initiate executive response protocol — notify leadership team',
  'Activate cross-functional response task force',
  'Brief board and key stakeholders on situation and response plan',
  'Deploy legal and compliance review team',
  'Launch stakeholder communication and messaging protocol',
  'Establish real-time monitoring and escalation framework',
  'Prepare executive briefing with response options and timeline',
];

const DOMAIN_STAKEHOLDERS: Record<string, { name: string; title: string; method: string }[]> = {
  'Financial Strategy': [
    { name: 'Sarah Chen', title: 'Chief Financial Officer', method: 'Direct call' },
    { name: 'Board Finance Committee', title: 'Board of Directors', method: 'Emergency alert' },
    { name: 'Marcus Webb', title: 'Chief Executive Officer', method: 'Executive briefing' },
    { name: 'Diana Reeves', title: 'General Counsel', method: 'Secure messaging' },
    { name: 'Tyler Ross', title: 'VP Investor Relations', method: 'Secure portal' },
  ],
  'Market Dynamics': [
    { name: 'James Harlow', title: 'Chief Revenue Officer', method: 'Direct call' },
    { name: 'Priya Shah', title: 'Chief Marketing Officer', method: 'Emergency briefing' },
    { name: 'VP Sales Leadership', title: 'VP Sales', method: 'War room invite' },
    { name: 'Marcus Webb', title: 'Chief Executive Officer', method: 'Executive briefing' },
    { name: 'Board of Directors', title: 'Board', method: 'Emergency notification' },
  ],
  'Brand & Reputation': [
    { name: 'Marcus Webb', title: 'Chief Executive Officer', method: 'Direct briefing' },
    { name: 'Priya Shah', title: 'Chief Marketing Officer', method: 'Crisis war room' },
    { name: 'Diana Reeves', title: 'General Counsel', method: 'Secure messaging' },
    { name: 'Board of Directors', title: 'Board', method: 'Emergency notification' },
    { name: 'External PR Firm', title: 'Edelman Crisis Group', method: 'Hotline activation' },
  ],
  'Regulatory & Compliance': [
    { name: 'Diana Reeves', title: 'General Counsel', method: 'Direct call' },
    { name: 'Board Audit Committee', title: 'Board of Directors', method: 'Emergency alert' },
    { name: 'Anna Ferris', title: 'Chief Compliance Officer', method: 'Secure portal' },
    { name: 'Sarah Chen', title: 'Chief Financial Officer', method: 'Executive briefing' },
    { name: 'Government Affairs Lead', title: 'VP Government Affairs', method: 'Secure messaging' },
  ],
  'Operational Excellence': [
    { name: 'Tom Bradley', title: 'Chief Operating Officer', method: 'Direct call' },
    { name: 'Lena Park', title: 'Chief Technology Officer', method: 'War room invite' },
    { name: 'VP Operations', title: 'Operations Leadership', method: 'Emergency alert' },
    { name: 'Marcus Webb', title: 'Chief Executive Officer', method: 'Executive briefing' },
    { name: 'Site Leadership', title: 'Regional Directors', method: 'Cascade notification' },
  ],
  'Technology & Innovation': [
    { name: 'Lena Park', title: 'Chief Technology Officer', method: 'Direct call' },
    { name: 'CISO', title: 'Chief Information Security Officer', method: 'Emergency alert' },
    { name: 'VP Engineering', title: 'Engineering Leadership', method: 'War room invite' },
    { name: 'Marcus Webb', title: 'Chief Executive Officer', method: 'Executive briefing' },
    { name: 'Board Tech Committee', title: 'Board of Directors', method: 'Emergency notification' },
  ],
  'AI Governance': [
    { name: 'Marcus Webb', title: 'Chief Executive Officer', method: 'Direct briefing' },
    { name: 'Lena Park', title: 'Chief Technology Officer', method: 'Emergency alert' },
    { name: 'Ethics & Governance Board', title: 'Board of Directors', method: 'Emergency notification' },
    { name: 'Diana Reeves', title: 'General Counsel', method: 'Secure messaging' },
    { name: 'External AI Advisors', title: 'Governance Counsel', method: 'Secure portal' },
  ],
  'Talent & Leadership': [
    { name: 'Rachel Kim', title: 'Chief Human Resources Officer', method: 'Direct call' },
    { name: 'Marcus Webb', title: 'Chief Executive Officer', method: 'Executive briefing' },
    { name: 'Board of Directors', title: 'Board', method: 'Emergency notification' },
    { name: 'Executive Search Partner', title: 'Spencer Stuart', method: 'Secure portal' },
    { name: 'People Leadership', title: 'HR Leadership Team', method: 'War room invite' },
  ],
};

const GENERIC_STAKEHOLDERS = [
  { name: 'Chief Executive Officer', title: 'CEO', method: 'Direct briefing' },
  { name: 'Board of Directors', title: 'Board', method: 'Emergency notification' },
  { name: 'General Counsel', title: 'Chief Legal Officer', method: 'Secure messaging' },
  { name: 'Chief Operating Officer', title: 'COO', method: 'War room invite' },
  { name: 'Chief Financial Officer', title: 'CFO', method: 'Executive briefing' },
];

function getTaskActionType(desc: string): string {
  const d = desc.toLowerCase();
  if (d.includes('brief') || d.includes('notify') || d.includes('notify')) return 'BRIEFING';
  if (d.includes('activate') || d.includes('deploy') || d.includes('stand up')) return 'DEPLOYMENT';
  if (d.includes('review') || d.includes('assess') || d.includes('audit') || d.includes('analysis')) return 'ASSESSMENT';
  if (d.includes('prepare') || d.includes('draft') || d.includes('model')) return 'PREPARATION';
  if (d.includes('establish') || d.includes('coordinate') || d.includes('war room')) return 'COORDINATION';
  if (d.includes('engage') || d.includes('launch') || d.includes('initiate')) return 'ENGAGEMENT';
  return 'EXECUTION';
}

function formatEventTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function generateDemoTasks(domain: string, enrichedPhases?: any[]): DemoTask[] {
  // ── Priority 1: Use expert content from enrichedPhases if available ──────────
  if (enrichedPhases && Array.isArray(enrichedPhases) && enrichedPhases.length > 0) {
    const tasks: DemoTask[] = [];
    enrichedPhases.forEach((phase: any) => {
      const phaseTasks: any[] = Array.isArray(phase.tasks) ? phase.tasks : [];
      phaseTasks.forEach((t: any, taskIdx: number) => {
        const isLastInPhase = taskIdx === phaseTasks.length - 1;
        tasks.push({
          id: `flagship-${tasks.length}`,
          description: t.action || t.description || '',
          status: 'pending' as const,
          priority: tasks.length === 0 ? 'critical' : tasks.length < 3 ? 'high' : 'medium',
          assignedTo: null,
          assignedRole: t.owner || null,
          timeTarget: t.timeTarget || null,
          phase: phase.name || null,
          decisionGate: (isLastInPhase && phase.decisionGate) ? phase.decisionGate : null,
        });
      });
    });
    if (tasks.length > 0) return tasks;
  }
  // ── Fallback: domain-based template tasks ───────────────────────────────────
  const descriptions = DOMAIN_TASKS[domain] || GENERIC_TASKS;
  return descriptions.map((desc, i) => ({
    id: `demo-task-${i}`,
    description: desc,
    status: 'pending' as const,
    priority: i === 0 ? 'critical' : i < 3 ? 'high' : 'medium',
    assignedTo: null,
    assignedRole: null,
    timeTarget: null,
    phase: null,
    decisionGate: null,
  }));
}

const BRIEF_LOADING_STEPS = [
  'Analyzing strategic domain and prepared response configuration',
  'Synthesizing intelligence signals from 248+ data points',
  'Mapping critical roles and stakeholder dependencies',
  'Generating risk and mitigation assessment',
  'Composing Commander Brief — final review',
];

function BriefLoadingState() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStep(s => Math.min(s + 1, BRIEF_LOADING_STEPS.length - 1)), 900);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ padding: "28px 24px", background: "rgba(124,58,237,0.02)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BRIEF_LOADING_STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i > step ? 0.25 : 1, transition: "opacity 0.5s" }}>
            <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i < step ? (
                <CheckCircle2 style={{ width: 14, height: 14, color: TEAL }} />
              ) : i === step ? (
                <Loader2 style={{ width: 14, height: 14, color: TEAL, animation: "spin 0.8s linear infinite" }} />
              ) : (
                <div style={{ width: 5, height: 5, borderRadius: 0, background: "#ccc" }} />
              )}
            </div>
            <span style={{
              fontSize: 12,
              fontWeight: i === step ? 600 : 400,
              color: i < step ? MUTED : i === step ? TEAL : "#bbb",
              transition: "color 0.4s",
            }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, fontSize: 11, color: MUTED, fontStyle: "italic" }}>
        Analyzing strategic context — your brief will be ready momentarily
      </div>
    </div>
  );
}

export default function PlaybookActivationConsole() {
  const [, params] = useRoute("/playbook-activation/:triggerId/:playbookId");
  const { user } = useAuth();
  const { toast } = useToast();
  const [activationConfirmed, setActivationConfirmed] = useState(false);
  const [showInitiatedScreen, setShowInitiatedScreen] = useState(false);
  const [initiatedProgress, setInitiatedProgress] = useState(0);
  const [executionStartTime, setExecutionStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [executionStatus, setExecutionStatus] = useState<'pending' | 'active' | 'paused' | 'completed'>('pending');
  const [executionId] = useState(`exec-${Date.now()}`);
  const [activationDbId, setActivationDbId] = useState<string | null>(null);
  const [localDemoTasks, setLocalDemoTasks] = useState<DemoTask[]>([]);
  const [liveEvents, setLiveEvents] = useState<{ time: string; text: string; type: 'start' | 'complete' | 'notify' | 'init' }[]>([]);
  const [stakeholderStatuses, setStakeholderStatuses] = useState<{ name: string; title: string; method: string; status: 'pending' | 'notified' | 'acknowledged' }[]>([]);
  const prevTasksRef = useRef<DemoTask[]>([]);

  // T1: Task Acknowledgment & Audit Trail
  const sessionIdRef = useRef<string>(`session-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [ackMap, setAckMap] = useState<Record<string, { by: string; role: string; at: string; actionType: string }>>({});
  const [ackFormTaskId, setAckFormTaskId] = useState<string | null>(null);
  const [ackName, setAckName] = useState("Executive");
  const [ackRole, setAckRole] = useState("CEO");
  const [ackActionType, setAckActionType] = useState<'complete' | 'escalate' | 'delegate'>('complete');

  // Pre-fill acknowledgment form from authenticated user — removes manual entry friction
  useEffect(() => {
    if (user?.firstName) {
      setAckName(`${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`);
    }
    if (user?.role) {
      const roleToTitle: Record<string, string> = {
        admin: 'Chief Strategy Officer',
        executive: 'CEO',
        strategist: 'Chief Strategy Officer',
      };
      setAckRole(roleToTitle[user.role] || 'CEO');
    }
  }, [user]);

  const submitAcknowledgment = useCallback(async (taskId: string, taskLabel: string, taskIndex: number) => {
    const at = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setAckMap(prev => ({ ...prev, [taskId]: { by: ackName, role: ackRole, at, actionType: ackActionType } }));
    
    if (ackActionType === 'escalate') {
      setLiveEvents(prev => [
        { time: at, text: `🚨 ESCALATION — "${taskLabel.slice(0, 60)}${taskLabel.length > 60 ? '…' : ''}"`, type: 'start' as const },
        { time: at, text: `↑ [${ackRole}] escalated to Senior Leadership — response required within 2 minutes`, type: 'complete' as const },
        { time: at, text: `📲 Emergency stakeholder loop activated — C-Suite channel opened`, type: 'init' },
        ...prev,
      ]);
    } else if (ackActionType === 'delegate') {
      setLiveEvents(prev => [
        { time: at, text: `→ [${ackRole}] delegated task — ownership transferred and tracking initiated`, type: 'complete' as const },
        { time: at, text: `🔔 Delegate notified via Readiness OS — task marked for real-time progress monitoring`, type: 'init' },
        ...prev,
      ]);
    } else {
      setLiveEvents(prev => [{ time: at, text: `[${ackRole}] ✓ Committed — ownership confirmed on "${taskLabel.slice(0, 45)}${taskLabel.length > 45 ? '…' : ''}"`, type: 'complete' as const }, ...prev]);
    }
    setAckFormTaskId(null);
    try {
      await apiRequest('POST', '/api/task-acknowledgments', {
        sessionId: sessionIdRef.current,
        taskLabel,
        taskIndex,
        acknowledgedBy: ackName,
        acknowledgedRole: ackRole,
        actionType: ackActionType,
      });
    } catch {
      // Non-fatal: UI already updated
    }
  }, [ackName, ackRole, ackActionType]);

  // Fetch trigger details (skip for manual executions)
  const isManualExecution = params?.triggerId === 'manual';
  const { data: trigger } = useQuery<any>({
    queryKey: ['/api/executive-triggers', params?.triggerId],
    queryFn: () =>
      fetch(`/api/executive-triggers/${params?.triggerId}`, { credentials: 'include' })
        .then(r => r.ok ? r.json() : null),
    enabled: !!params?.triggerId && !isManualExecution,
  });

  // Fetch prepared response details from playbookLibrary (IDs come from linkedPlaybooks on triggers)
  const { data: playbookRaw } = useQuery<any>({
    queryKey: ['/api/playbook-library', params?.playbookId],
    queryFn: () =>
      fetch(`/api/playbook-library/${params?.playbookId}`, { credentials: 'include' })
        .then(r => r.ok ? r.json() : null),
    enabled: !!params?.playbookId,
  });
  // Normalize: playbookLibrary returns { playbook: {...} }, scenarios returns the object directly
  const playbook = playbookRaw?.playbook ?? playbookRaw;

  // Fetch tasks for this prepared response
  const { data: tasksRaw } = useQuery<any[]>({
    queryKey: [`/api/tasks?playbookId=${params?.playbookId}`],
    enabled: !!params?.playbookId,
  });
  const tasks = Array.isArray(tasksRaw) ? tasksRaw : [];

  // Role availability check — extract role names from prepared response and check for flags
  const { data: roleAvailabilityFlagsRaw } = useQuery<any[]>({
    queryKey: ['/api/role-availability'],
    enabled: !activationConfirmed,
  });
  const roleAvailabilityFlags = Array.isArray(roleAvailabilityFlagsRaw) ? roleAvailabilityFlagsRaw : [];

  // AI-generated Execution Brief — fetched once prepared response ID is known
  const { data: briefData, isLoading: briefLoading } = useQuery<any>({
    queryKey: ['/api/playbooks', params?.playbookId, 'execution-brief', params?.triggerId],
    queryFn: () => {
      const url = `/api/playbooks/${params?.playbookId}/execution-brief${!isManualExecution && params?.triggerId ? `?triggerId=${params.triggerId}` : ''}`;
      return fetch(url, { credentials: 'include' }).then(r => r.ok ? r.json() : null);
    },
    enabled: !!params?.playbookId && !activationConfirmed,
    staleTime: 5 * 60 * 1000,
  });
  const brief = briefData?.brief;

  const playbookRoleNames: string[] = playbook ? [
    ...(typeof playbook.tier1Stakeholders === 'object' && playbook.tier1Stakeholders
      ? Object.values(playbook.tier1Stakeholders as Record<string, any>).map((s: any) => (typeof s === 'string' ? s : s?.role || '')).filter(Boolean)
      : []),
    ...(typeof playbook.tier2Stakeholders === 'object' && playbook.tier2Stakeholders
      ? Object.values(playbook.tier2Stakeholders as Record<string, any>).map((s: any) => (typeof s === 'string' ? s : s?.role || '')).filter(Boolean)
      : []),
  ] : [];

  const limitedPlaybookRoles = roleAvailabilityFlags.filter((f: any) =>
    f.isLimited && playbookRoleNames.some(r => r.toLowerCase().includes(f.roleName.toLowerCase()) || f.roleName.toLowerCase().includes(r.toLowerCase()))
  );

  // Countdown timer - only starts after activation is confirmed
  useEffect(() => {
    if (executionStatus !== 'active' || !executionStartTime) return;
    
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((new Date().getTime() - executionStartTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [executionStartTime, executionStatus]);

  // Auto-progress demo tasks every 20 seconds when active
  useEffect(() => {
    if (executionStatus !== 'active' || localDemoTasks.length === 0) return;
    // Immediately set first pending task to in_progress
    setLocalDemoTasks(prev => {
      const firstPending = prev.findIndex(t => t.status === 'pending');
      if (firstPending === -1) return prev;
      return prev.map((t, i) => i === firstPending ? { ...t, status: 'in_progress' } : t);
    });
    const interval = setInterval(() => {
      setLocalDemoTasks(prev => {
        const inProgressIdx = prev.findIndex(t => t.status === 'in_progress');
        const nextPendingIdx = prev.findIndex(t => t.status === 'pending');
        if (inProgressIdx !== -1 && nextPendingIdx !== -1) {
          return prev.map((t, i) => {
            if (i === inProgressIdx) return { ...t, status: 'completed' };
            if (i === nextPendingIdx) return { ...t, status: 'in_progress' };
            return t;
          });
        } else if (inProgressIdx !== -1) {
          return prev.map((t, i) => i === inProgressIdx ? { ...t, status: 'completed' } : t);
        }
        return prev;
      });
    }, 20000);
    return () => clearInterval(interval);
  }, [executionStatus, localDemoTasks.length]);

  // Track task state changes → emit live events + advance stakeholder statuses
  useEffect(() => {
    const prev = prevTasksRef.current;
    if (prev.length === 0 || localDemoTasks.length === 0) {
      prevTasksRef.current = localDemoTasks;
      return;
    }
    localDemoTasks.forEach((task, i) => {
      const prevTask = prev[i];
      if (!prevTask) return;
      if (prevTask.status !== 'in_progress' && task.status === 'in_progress') {
        const actionType = getTaskActionType(task.description);
        setLiveEvents(ev => [
          { time: formatEventTime(), text: `[${actionType}] ${task.description}`, type: 'start' as const },
          ...ev,
        ].slice(0, 20));
      }
      if (prevTask.status !== 'completed' && task.status === 'completed') {
        setLiveEvents(ev => [
          { time: formatEventTime(), text: `✓ Completed — ${task.description}`, type: 'complete' as const },
          ...ev,
        ].slice(0, 20));
        setStakeholderStatuses(prev => {
          const firstPending = prev.findIndex(s => s.status === 'pending');
          const firstNotified = prev.findIndex(s => s.status === 'notified');
          if (firstPending !== -1) {
            const updated = [...prev];
            updated[firstPending] = { ...updated[firstPending], status: 'notified' };
            setTimeout(() => {
              setLiveEvents(ev => [
                { time: formatEventTime(), text: `📣 ${updated[firstPending].name} notified via ${updated[firstPending].method}`, type: 'notify' as const },
                ...ev,
              ].slice(0, 20));
            }, 2000);
            return updated;
          }
          if (firstNotified !== -1) {
            const updated = [...prev];
            updated[firstNotified] = { ...updated[firstNotified], status: 'acknowledged' };
            setTimeout(() => {
              setLiveEvents(ev => [
                { time: formatEventTime(), text: `✅ ${updated[firstNotified].name} acknowledged — response confirmed`, type: 'notify' as const },
                ...ev,
              ].slice(0, 20));
            }, 3500);
            return updated;
          }
          return prev;
        });
      }
    });
    prevTasksRef.current = localDemoTasks;
  }, [localDemoTasks]);

  // Handle activation confirmation — receives deployment parameters set by approver
  const handleConfirmActivation = (params?: { scope?: string; timeline?: string; notifyDepartments?: string[] }) => {
    const scope = params?.scope || 'full';
    const timeline = params?.timeline || 'standard';
    const timelineMinutes = timeline === 'accelerated' ? 8 : timeline === 'extended' ? 20 : 12;

    setActivationConfirmed(true);
    setShowInitiatedScreen(true);
    setInitiatedProgress(0);
    const progressInterval = setInterval(() => {
      setInitiatedProgress(p => {
        if (p >= 100) { clearInterval(progressInterval); return 100; }
        return p + 2.5;
      });
    }, 60);
    setTimeout(() => { setShowInitiatedScreen(false); clearInterval(progressInterval); }, 2600);
    setExecutionStartTime(new Date());
    setExecutionStatus('active');
    const domain = playbook?.domain || playbook?.strategicCategory || '';
    if (safeTasks.length === 0) {
      // Use expert enrichedPhases tasks if available — otherwise fall back to domain templates
      const enrichedPhases = Array.isArray(playbook?.enrichedPhases) ? playbook.enrichedPhases : null;
      const baseTasks = generateDemoTasks(domain, enrichedPhases ?? undefined);
      // Prepend GPT-4o scenario-specific tasks from the Execution Brief if available
      const aiTasks: DemoTask[] = Array.isArray(brief?.scenarioTasks)
        ? brief.scenarioTasks.map((t: any, idx: number) => ({
            id: `ai-task-${idx}`,
            description: t.action || 'Pre-staged task',
            status: 'pending' as const,
            priority: t.priority || 'high',
            assignedTo: null,
            assignedRole: t.role || null,
            timeTarget: t.timeTarget || null,
            phase: 'AI SCENARIO INTELLIGENCE',
            isAIGenerated: true,
          }))
        : [];
      // In pilot scope, use only AI-generated tasks for the core team
      setLocalDemoTasks(scope === 'pilot' ? [...aiTasks, ...baseTasks.slice(0, 5)] : [...aiTasks, ...baseTasks]);
    }
    const domainStakeholders = DOMAIN_STAKEHOLDERS[domain] || GENERIC_STAKEHOLDERS;
    // In pilot scope, only notify first 2 stakeholders (core team)
    const activeStakeholders = scope === 'pilot' ? domainStakeholders.slice(0, 2) : domainStakeholders;
    setStakeholderStatuses(activeStakeholders.map(s => ({ ...s, status: 'pending' as const })));
    const now = formatEventTime();
    const scopeLabel = scope === 'pilot' ? 'Pilot Deployment (core team)' : 'Full Deployment (all teams)';
    setLiveEvents([
      { time: now, text: `⚡ Execution protocol activated — ${timelineMinutes}-minute response clock started`, type: 'init' },
      { time: now, text: `🎯 ${scopeLabel} — ${activeStakeholders.length} stakeholders queued for notification`, type: 'init' },
      { time: now, text: `📊 Real-time monitoring dashboard initialized`, type: 'init' },
    ]);
    toast({
      title: "Readiness Protocol Activated",
      description: `${scopeLabel} · ${timelineMinutes}-min clock started.`,
    });
  };

  const handleCancelActivation = () => {
    window.history.back();
  };

  // Complete execution mutation
  const completeExecutionMutation = useMutation({
    mutationFn: async () => {
      const executionTime = Math.floor(elapsedSeconds / 60);
      const prevCount = playbook?.executionCount || 0;
      const prevAvg = playbook?.averageExecutionTime || 0;
      const newAverage = prevCount > 0
        ? Math.round((prevAvg * prevCount + executionTime) / (prevCount + 1))
        : executionTime;

      // Non-fatal stat updates — 404s are expected when prepared response is from library (not scenarios table)
      try {
        await fetch(`/api/scenarios/${params?.playbookId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            executionCount: prevCount + 1,
            averageExecutionTime: newAverage,
            lastTriggered: new Date().toISOString(),
          }),
        });
      } catch (_) {}

      // Non-fatal trigger status reset
      if (!isManualExecution && params?.triggerId && params.triggerId !== 'guided') {
        try {
          await fetch(`/api/executive-triggers/${params.triggerId}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'green', currentValue: null }),
          });
        } catch (_) {}
      }
    },
    onSuccess: async () => {
      queryClient.refetchQueries({ queryKey: ['/api/scenarios'], exact: false });
      queryClient.refetchQueries({ queryKey: ['/api/executive-triggers'], exact: false });
      setExecutionStatus('completed');
      toast({
        title: "✅ Readiness Protocol Execution Completed",
        description: `Executed in ${formatTime(elapsedSeconds)}`,
      });
      try {
        const executionTime = Math.floor(elapsedSeconds / 60);
        const targetMet = executionTime <= 12;
        const actRes = await fetch('/api/playbook-activations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playbookId: params?.playbookId,
            actualExecutionTime: executionTime,
            targetMet,
            triggerEventId: !isManualExecution && params?.triggerId !== 'guided' ? params?.triggerId : null,
            playbookName: playbook?.name || null,
            playbookDomain: playbook?.domain || playbook?.triggerCriteria || null,
            taskCount: displayTasks.length || 7,
            stakeholderCount: stakeholderStatuses.length || 5,
          }),
        });
        if (actRes.ok) {
          const act = await actRes.json();
          setActivationDbId(act.id);
          await fetch('/api/activation-outcomes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activationId: act.id, playbookId: params?.playbookId }),
          });
        }
      } catch (_) {}
    },
    onError: () => {
      // Still advance to debrief — stat updates are non-critical
      setExecutionStatus('completed');
      toast({
        title: "✅ Execution Complete",
        description: `Executed in ${formatTime(elapsedSeconds)}`,
      });
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const safeTasks = tasks || [];
  const displayTasks = safeTasks.length > 0 ? safeTasks : localDemoTasks;
  const completedTasks = displayTasks.filter((t: any) => t.status === 'completed').length;
  const progressPercent = displayTasks.length > 0 ? (completedTasks / displayTasks.length) * 100 : 0;
  
  // SuccessMetrics:
  const targetTime = 12; // 12 minutes target
  const elapsedMinutes = elapsedSeconds / 60;
  const isOnTrack = elapsedMinutes <= targetTime;
  const industryStandard = 30 * 24 * 60; // 30 days in minutes (canonical mobilization baseline)
  const timeSaved = industryStandard - elapsedMinutes;

  // For manual executions, only wait for playbook. For trigger-based, wait for both.
  if (!playbook || (!isManualExecution && !trigger)) {
    return (
      <PageLayout>
        <div style={{ background: NAVY, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {/* Background grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
          {/* Radial orb */}
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(43,138,110,0.13) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", textAlign: "center", maxWidth: 480, padding: "0 32px" }}>
            {/* Overline */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
              <div style={{ width: 24, height: 1, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, fontFamily: "'Barlow Condensed', sans-serif" }}>Readiness OS</span>
              <div style={{ width: 24, height: 1, background: GOLD }} />
            </div>
            {/* Heading */}
            <h1 style={{ ...CG, fontSize: "clamp(28px,4vw,42px)", fontWeight: 600, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
              Staging Execution Console
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em", marginBottom: 40 }}>
              Retrieving prepared response parameters and staging response architecture
            </p>
            {/* Animated indicator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 40 }}>
              <Loader2 style={{ width: 18, height: 18, color: TEAL, animation: "spin 1s linear infinite" }} />
              <span style={{ color: TEAL, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, fontFamily: "'Barlow Condensed', sans-serif" }}>Initializing</span>
            </div>
            {/* Status lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", borderLeft: `2px solid ${GOLD}`, paddingLeft: 16 }}>
              {[
                "Loading prepared response configuration",
                "Verifying trigger context",
                "Pre-staging task architecture",
              ].map((line, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 5, height: 5, background: i === 0 ? TEAL : "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                  <span style={{ color: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Dramatic "Response Initiated" moment — shown for ~2.5s after executive confirms activation
  if (showInitiatedScreen) {
    const domainStakeholderCount = (DOMAIN_STAKEHOLDERS[playbook?.domain || ''] || GENERIC_STAKEHOLDERS).length;
    const taskCount = safeTasks.length > 0 ? safeTasks.length : 7;
    return (
      <PageLayout>
        <div style={{ background: NAVY, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {/* Background grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
          {/* Gold orb */}
          <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
          {/* Teal orb */}
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(43,138,110,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", textAlign: "center", maxWidth: 560, padding: "0 40px" }}>
            {/* Overline */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28 }}>
              <div style={{ width: 32, height: 1, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD, fontFamily: "'Barlow Condensed', sans-serif" }}>Authorization Confirmed</span>
              <div style={{ width: 32, height: 1, background: GOLD }} />
            </div>

            {/* Main heading */}
            <h1 style={{ ...CG, fontSize: "clamp(38px,6vw,64px)", fontWeight: 600, color: "#fff", lineHeight: 1.0, marginBottom: 12, letterSpacing: "-0.01em" }}>
              Response <em style={{ color: GOLD, fontStyle: "italic" }}>Initiated</em>
            </h1>

            {/* Readiness Protocol name */}
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em", marginBottom: 48, fontWeight: 500 }}>
              {playbook?.name || 'Readiness Protocol'} · Execution Clock Running
            </p>

            {/* Three stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, marginBottom: 48, border: `1px solid rgba(201,168,76,0.2)` }}>
              {[
                { label: "Clock", value: "0:00", sub: "12-min target" },
                { label: "Tasks", value: taskCount.toString(), sub: "pre-staged" },
                { label: "Stakeholders", value: domainStakeholderCount.toString(), sub: "being notified" },
              ].map((stat, i) => (
                <div key={i} style={{ padding: "20px 16px", background: i === 1 ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)", borderRight: i < 2 ? "1px solid rgba(201,168,76,0.2)" : "none" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: i === 1 ? GOLD : "#fff", fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: GOLD, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 2 }}>{stat.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Status line */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, background: TEAL, borderRadius: "50%", animation: "pulse 1s ease-in-out infinite" }} />
              <span style={{ color: TEAL, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, fontFamily: "'Barlow Condensed', sans-serif" }}>Execution Console Loading</span>
            </div>

            {/* Progress bar */}
            <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${initiatedProgress}%`, background: `linear-gradient(90deg, ${TEAL}, ${GOLD})`, transition: "width 60ms linear" }} />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show Pre-Activation Impact Preview if not yet confirmed
  if (!activationConfirmed) {
    return (
      <PageLayout>
        <div style={{ background: OFF, minHeight: "100vh" }}>
          <div className="container mx-auto p-6 space-y-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD }}>Pre-Activation Review</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,5vw,48px)", lineHeight: 1.05, color: NAVY, marginBottom: 16 }}>
                  Review <em style={{ fontStyle: "italic", color: GOLD }}>Projected Impact</em>
                </h1>
                <p style={{ color: MUTED, marginTop: 4 }}>
                  Verify mission parameters before initiating coordination sequence
                </p>
              </div>
              <Link href="/triggers-management">
                <Button variant="outline" data-testid="button-back-triggers-preview" style={{ border: `1.5px solid ${BORDER}`, color: NAVY, background: "transparent" }}>
                  Back to Triggers
                </Button>
              </Link>
            </div>

            {/* Readiness Protocol Summary Card */}
            <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, padding: "20px 24px", background: "#fff", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 8 }}>
                <PlayCircle className="h-5 w-5" style={{ color: GOLD }} />
                <span style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY }}>Readiness Protocol: {playbook?.name || 'Loading...'}</span>
              </div>
              <p style={{ fontSize: 14, color: MUTED }}>
                {playbook?.description || 'Strategic response prepared response ready for activation.'}
              </p>
              {!isManualExecution && trigger && (
                <div style={{ marginTop: 16, padding: 12, background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 2, color: "#B91C1C", fontWeight: 500, fontSize: 13 }}>
                    <AlertTriangle className="h-4 w-4" />
                    Triggered by: {trigger.name}
                  </div>
                </div>
              )}
            </div>

            {/* ── What This Readiness Protocol Replaces ──────────────────────────────── */}
            <div style={{ borderLeft: `4px solid ${NAVY}`, borderTop: `1px solid rgba(10,15,46,0.12)`, borderRight: `1px solid rgba(10,15,46,0.12)`, borderBottom: `1px solid rgba(10,15,46,0.12)`, padding: '20px 24px', marginBottom: 16, background: 'rgba(10,15,46,0.03)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: NAVY, marginBottom: 14 }}>What This Readiness Protocol Replaces</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#dc2626', marginBottom: 6 }}>Without It</div>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }}>
                    30 days to mobilize. Figuring out who calls who, where the brief is, who owns it, who authorizes — while the window closes.
                  </p>
                </div>
                <div style={{ width: 1, height: 64, background: 'rgba(10,15,46,0.12)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: TEAL, marginBottom: 6 }}>With This Readiness Protocol</div>
                  <p style={{ fontSize: 13, color: NAVY, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    12 minutes from this moment. Brief built. Team assigned. Authority defined. Execution begins.
                  </p>
                </div>
              </div>
            </div>

            {/* Dry-Run Prompt */}
            <div style={{ border: `1px solid rgba(201,168,76,0.3)`, background: "rgba(201,168,76,0.04)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 0, background: GOLD, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 2 }}>Pre-Deployment Dry-Run Available</div>
                  <div style={{ fontSize: 12, color: MUTED }}>Validate your response strategy before committing resources — review pre-staged coverage readiness.</div>
                </div>
              </div>
              <Link href="/simulation-studio">
                <Button variant="outline" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, border: `1px solid ${GOLD}`, color: GOLD, background: "transparent", whiteSpace: "nowrap", flexShrink: 0 }}>
                  Run Dry-Run →
                </Button>
              </Link>
            </div>

            {/* Role Availability Warning Banner */}
            {limitedPlaybookRoles.length > 0 && (
              <div style={{ border: '1px solid #C9A84C', borderLeft: '4px solid #C9A84C', background: 'rgba(201,168,76,0.06)', padding: '16px 20px', marginBottom: 20, borderRadius: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <AlertTriangle className="h-4 w-4" style={{ color: '#C9A84C', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>Role Availability Advisory</span>
                </div>
                <p style={{ fontSize: 13, color: '#0A0F2E', lineHeight: 1.5, marginBottom: 8 }}>
                  The following roles have been flagged as limited availability by your admin. This is advisory — you can still proceed, but response time may be impacted.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                  {limitedPlaybookRoles.map((f: any) => (
                    <span key={f.roleName} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(201,168,76,0.12)', color: '#0A0F2E', padding: '3px 8px', border: '1px solid #C9A84C' }}>
                      {f.roleName}{f.note ? ` — ${f.note}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Execution Brief */}
            <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`, background: "#fff", marginBottom: 24 }}>
              <div style={{ padding: "18px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 0, background: "rgba(43,138,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Shield style={{ width: 14, height: 14, color: TEAL }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL }}>Signal-Based Execution Brief · System Analysis</span>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>Generated for this activation</div>
                  </div>
                </div>
                {briefLoading && <Loader2 style={{ width: 16, height: 16, color: TEAL, animation: "spin 1s linear infinite" }} />}
              </div>

              {briefLoading ? (
                <BriefLoadingState />
              ) : brief ? (
                <div style={{ padding: "20px 24px" }}>
                  {/* Situation + Objective */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 8 }}>Situation</div>
                    <p style={{ fontSize: 14, color: NAVY, lineHeight: 1.65, marginBottom: 12 }}>{brief.situationFraming}</p>
                    <div style={{ padding: "10px 14px", background: `${NAVY}06`, border: `1px solid ${BORDER}`, display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <Crosshair style={{ width: 14, height: 14, color: NAVY, flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{brief.missionObjective}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: 20 }}>
                    {/* Critical Roles */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 8 }}>Critical Roles</div>
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                        {(brief.criticalRoles || []).map((role: string, i: number) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: 0, background: GOLD, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: NAVY, fontWeight: 500 }}>{role}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Success Indicators */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 8 }}>Success Indicators</div>
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                        {(brief.successIndicators || []).map((indicator: string, i: number) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <CheckCircle2 style={{ width: 13, height: 13, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Risks */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 8 }}>Top Execution Risks</div>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                      {(brief.topRisks || []).map((r: { risk: string; mitigation: string }, i: number) => (
                        <div key={i} style={{ padding: "10px 14px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", gap: 12 }}>
                          <AlertTriangle style={{ width: 13, height: 13, color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#B91C1C", marginBottom: 2 }}>{r.risk}</div>
                            <div style={{ fontSize: 11, color: MUTED }}>→ {r.mitigation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Commander Note */}
                  {brief.commanderNote && (
                    <div style={{ padding: "12px 16px", background: NAVY, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: GOLD, flexShrink: 0 }}>Commander</div>
                      <div style={{ width: 1, height: 24, background: `${GOLD}40`, flexShrink: 0 }} />
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontStyle: "italic", lineHeight: 1.5 }}>{brief.commanderNote}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: "20px 24px", color: MUTED, fontSize: 13 }}>
                  Brief generation unavailable — proceed with manual review.
                </div>
              )}
            </div>

            {/* Pre-Activation Impact Preview */}
            <PreActivationImpactPreview 
              prepared response={ playbook }
              onConfirmActivation={handleConfirmActivation}
              onCancel={handleCancelActivation}
            />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        <ExecutionStageGuide variant="compact" />
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Live Execution Console</span>
              </div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,5vw,48px)", lineHeight: 1.05, color: NAVY, marginBottom: 16 }}>
                Execute Your <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Readiness Protocol</em>
              </h1>
              <p style={{ color: MUTED, marginTop: 4 }}>
                Make the call. Rally your team. Win the moment.
              </p>
            </div>
            <Link href="/triggers-management">
              <Button variant="outline" data-testid="button-back-triggers" style={{ border: `1.5px solid ${BORDER}`, color: NAVY, background: "transparent" }}>
                Back to Triggers
              </Button>
            </Link>
          </div>

          {/* Time Compression Banner - Shows benchmark comparison */}
          <div style={{ background: NAVY, padding: "24px 32px", border: `1px solid ${NAVY_MID}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px", opacity: 0.5 }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>
                <strong style={{ color: GOLD }}>INDUSTRY BENCHMARK:</strong> Traditional mobilization takes 30 days from trigger to execution.
                <strong style={{ color: GOLD, marginLeft: 16 }}>OUR TARGET:</strong> 12 minutes or less.
              </div>
              <div className="flex items-center gap-4">
                {elapsedMinutes > 0 && (
                  <div style={{ 
                    display:"inline-flex", alignItems:"center", gap:5, 
                    background: isOnTrack ? "rgba(43,138,110,0.2)" : "rgba(201,168,76,0.2)", 
                    color: isOnTrack ? TEAL_LT : GOLD_LT, 
                    fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"6px 14px",
                    border: `1px solid ${isOnTrack ? TEAL : GOLD}`
                  }}>
                    {isOnTrack ? '✅ On Track for 12 Min Target' : '⚠️ Exceeding 12 Min Target'}
                  </div>
                )}
                {elapsedMinutes === 0 && (
                  <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.6)", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"6px 14px", border: "1px solid rgba(255,255,255,0.2)" }}>
                    Ready for Initiation
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Execution Timer & Status */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", background: OFF, border: `1px solid ${BORDER}`, borderBottom: "none" }}>
            {/* Timer Block */}
            <div style={{ padding:24, borderRight:`1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: NAVY }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Clock className="h-3 w-3" style={{ color: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Execution Time</span>
              </div>
              <div style={{ ...CG, fontSize:40, fontWeight:600, color:"#fff", lineHeight:1 }} data-testid="text-execution-time">
                {formatTime(elapsedSeconds)}
              </div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: GOLD, marginTop:8 }}>
                {executionStatus === 'active' ? '● Live' : executionStatus.toUpperCase()}
              </div>
            </div>

            {/* Target Status Block */}
            <div style={{ padding:24, borderRight:`1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: isOnTrack ? "rgba(43,138,110,0.05)" : "rgba(201,168,76,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Target className="h-3 w-3" style={{ color: isOnTrack ? TEAL : GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>Target: 12 Min</span>
              </div>
              <div style={{ ...CG, fontSize:40, fontWeight:600, color: isOnTrack ? TEAL : GOLD, lineHeight:1 }} data-testid="text-target-status">
                {isOnTrack ? 'On Track' : 'Behind'}
              </div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: MUTED, marginTop:8 }}>
                {Math.max(0, targetTime - elapsedMinutes).toFixed(1)} min remaining
              </div>
            </div>

            {/* Velocity Multiplier Block */}
            <div style={{ padding:24, borderRight:`1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Zap className="h-3 w-3" style={{ color: NAVY }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>Decision Velocity</span>
              </div>
              <div style={{ ...CG, fontSize:40, fontWeight:600, color: NAVY, lineHeight:1 }} data-testid="text-velocity-multiplier">
                {elapsedMinutes > 0 ? `${(industryStandard / elapsedMinutes).toFixed(0)}x` : '3,600×'}
              </div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: MUTED, marginTop:8 }}>
                3,600× Execution Head Start
              </div>
            </div>

            {/* Time Saved Block */}
            <div style={{ padding:24, borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Trophy className="h-3 w-3" style={{ color: TEAL }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>Time Saved</span>
              </div>
              <div style={{ ...CG, fontSize:40, fontWeight:600, color: TEAL, lineHeight:1 }} data-testid="text-time-saved">
                {elapsedMinutes > 0 ? `${Math.floor(timeSaved / 60)}h` : '~72h'}
              </div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: MUTED, marginTop:8 }}>
                Cumulative efficiency gain
              </div>
            </div>
          </div>

        {/* Trigger & Readiness Protocol Info */}
        <div className={`grid grid-cols-1 ${isManualExecution ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
          {!isManualExecution && trigger && (
            <div style={{ border: `1px solid ${BORDER}`, borderLeft: "3px solid #EF4444", padding: "20px 24px", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <AlertTriangle className="h-5 w-5" style={{ color: "#EF4444" }} />
                <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Trigger Alert</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Trigger Name</div>
                  <div style={{ fontWeight: 600, color: NAVY }} data-testid="text-trigger-name">{trigger.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Description</div>
                  <div style={{ fontSize: 14, color: NAVY }}>{trigger.description}</div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Status</div>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(239,68,68,0.12)", color:"#EF4444", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px", marginTop:4 }} data-testid="badge-trigger-status">
                      {trigger?.currentStatus || 'active'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Severity</div>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(239,68,68,0.12)", color:"#EF4444", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px", marginTop:4 }}>
                      {trigger.severity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`, padding: "20px 24px", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <PlayCircle className="h-5 w-5" style={{ color: TEAL }} />
              <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Active Readiness Protocol</span>
            </div>
            <div className="space-y-4">
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Readiness Protocol Name</div>
                <div style={{ fontWeight: 600, color: NAVY }} data-testid="text-prepared response-name">{playbook.title || playbook.name}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Description</div>
                <div style={{ fontSize: 14, color: NAVY }}>{playbook.description}</div>
              </div>
              <div className="flex gap-4">
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Readiness</div>
                  <div style={{ 
                    display:"inline-flex", alignItems:"center", gap:5, 
                    background: playbook.readinessState === 'green' ? "rgba(43,138,110,0.12)" : "rgba(201,168,76,0.12)", 
                    color: playbook.readinessState === 'green' ? TEAL : GOLD, 
                    fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px", marginTop:4 
                  }} data-testid="badge-prepared response-readiness">
                    {playbook.readinessState === 'green' ? '✓ Ready' : '⚠ Needs Review'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Avg Execution</div>
                  <div style={{ fontWeight: 600, color: NAVY, fontSize: 14, marginTop: 4 }}>
                    {playbook.averageExecutionTime ? `${playbook.averageExecutionTime}m` : 'First execution'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Confidence Score */}
        {params?.playbookId && (
          <DecisionConfidenceScore 
            scenarioId={params.playbookId}
            stakeholderCount={5}
            dataSourcesConnected={3}
          />
        )}

        {/* Stakeholder Notification Tracker */}
        {executionStatus === 'active' && stakeholderStatuses.length > 0 && (
          <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, padding: "20px 24px", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Users className="h-5 w-5" style={{ color: GOLD }} />
              <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Stakeholder Notification Status</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 12, fontSize: 11 }}>
                <span style={{ color: MUTED }}><span style={{ fontWeight: 700, color: TEAL }}>{stakeholderStatuses.filter(s => s.status === 'acknowledged').length}</span> acknowledged</span>
                <span style={{ color: MUTED }}><span style={{ fontWeight: 700, color: GOLD }}>{stakeholderStatuses.filter(s => s.status === 'notified').length}</span> notified</span>
                <span style={{ color: MUTED }}><span style={{ fontWeight: 700, color: '#999' }}>{stakeholderStatuses.filter(s => s.status === 'pending').length}</span> pending</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
              {stakeholderStatuses.map((s, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  border: `1px solid ${s.status === 'acknowledged' ? TEAL : s.status === 'notified' ? GOLD : BORDER}`,
                  borderLeft: `3px solid ${s.status === 'acknowledged' ? TEAL : s.status === 'notified' ? GOLD : '#ccc'}`,
                  background: s.status === 'acknowledged' ? "rgba(43,138,110,0.04)" : s.status === 'notified' ? "rgba(201,168,76,0.04)" : "#fafafa",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 0, flexShrink: 0,
                    background: s.status === 'acknowledged' ? "rgba(43,138,110,0.15)" : s.status === 'notified' ? "rgba(201,168,76,0.15)" : "rgba(0,0,0,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: s.status === 'acknowledged' ? TEAL : s.status === 'notified' ? GOLD : MUTED,
                  }}>
                    {s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>via {s.method}</div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                    padding: "3px 8px", whiteSpace: "nowrap",
                    background: s.status === 'acknowledged' ? "rgba(43,138,110,0.12)" : s.status === 'notified' ? "rgba(201,168,76,0.12)" : "rgba(0,0,0,0.05)",
                    color: s.status === 'acknowledged' ? TEAL : s.status === 'notified' ? GOLD : MUTED,
                  }}>
                    {s.status === 'acknowledged' ? '✓ Ownership Confirmed' : s.status === 'notified' ? '📣 Notified' : '⏳ Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stakeholder Alignment Dashboard - shown during active execution when real data exists */}
        {executionStatus !== 'completed' && params?.playbookId && stakeholderStatuses.length === 0 && (
          <StakeholderAlignmentDashboard 
            scenarioId={params.playbookId}
            executionId={executionId}
          />
        )}

        {/* Progress Checkpoints */}
        <div className="bg-white border border-[#E8E4DC] p-6 hover:border-[#0A0F2E] transition-colors">
          <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 className="h-5 w-5" style={{ color: TEAL }} />
              <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Execution Progress</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>
              {completedTasks} of {displayTasks.length} tasks completed
            </span>
          </div>
          <div className="space-y-6">
            <div className="relative h-2 w-full bg-[#E8E4DC] overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full transition-all duration-500" 
                style={{ width: `${progressPercent}%`, background: GOLD }}
              />
            </div>
            
            <div className="space-y-3">
              {displayTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks defined for this prepared response
                </div>
              ) : (
                displayTasks.map((task: any, index: number) => {
                  const actionType = getTaskActionType(task.description || '');
                  const isActive = task.status === 'in_progress';
                  const isDone = task.status === 'completed';
                  const prevTask = displayTasks[index - 1] as any;
                  const isNewPhase = task.phase && task.phase !== prevTask?.phase;
                  return (
                  <div key={task.id}>
                    {/* Phase header — appears when a new phase begins */}
                    {isNewPhase && (
                      task.phase === 'AI SCENARIO INTELLIGENCE' ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0 8px", margin: "4px 0 0" }}>
                          <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, padding: "4px 12px", background: GOLD, color: NAVY }}>
                            <span>✦</span> SCENARIO INTELLIGENCE TASKS <span>✦</span>
                          </div>
                          <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, ${GOLD}, transparent)` }} />
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0 6px", margin: "4px 0 0" }}>
                          <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${NAVY}, transparent)` }} />
                          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, padding: "3px 10px", background: NAVY, color: "#fff" }}>
                            {task.phase}
                          </div>
                          <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, ${NAVY}, transparent)` }} />
                        </div>
                      )
                    )}

                  <div 
                    style={{ 
                      display: "flex", 
                      alignItems: "flex-start", 
                      gap: 12, 
                      padding: 16, 
                      background: isDone ? "rgba(43,138,110,0.03)" : isActive ? "rgba(201,168,76,0.03)" : task.isAIGenerated ? "rgba(201,168,76,0.04)" : "#fff",
                      border: `1px solid ${isDone ? TEAL : isActive ? GOLD : task.isAIGenerated ? GOLD : BORDER}`,
                      borderLeft: `3px solid ${isDone ? TEAL : isActive ? GOLD : task.isAIGenerated ? GOLD : BORDER}`,
                      transition: "all 0.3s ease",
                    }}
                    data-testid={`task-item-${index}`}
                  >
                    <div style={{ position: "relative", flexShrink: 0, marginTop: 2 }}>
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5" style={{ color: TEAL }} />
                      ) : isActive ? (
                        <>
                          <div style={{
                            width: 20, height: 20, borderRadius: 0, border: `2px solid ${GOLD}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: 0, background: GOLD, animation: "pulse 1.2s ease-in-out infinite" }} />
                          </div>
                        </>
                      ) : (
                        <Circle className="h-5 w-5" style={{ color: BORDER }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" as const }}>
                        <div style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                          padding: "2px 7px", background: isActive ? "rgba(201,168,76,0.12)" : isDone ? "rgba(43,138,110,0.08)" : "rgba(0,0,0,0.05)",
                          color: isActive ? GOLD : isDone ? TEAL : MUTED,
                        }}>
                          {actionType}
                        </div>
                        {/* Role owner badge — only shows for flagship prepared responses with expert content */}
                        {task.assignedRole && (
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "2px 8px", background: "rgba(10,15,46,0.07)", color: NAVY, borderRadius: 0 }}>
                            {task.assignedRole}
                          </div>
                        )}
                        {/* Time target badge */}
                        {task.timeTarget && (
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "2px 7px", background: isActive ? "rgba(201,168,76,0.15)" : "rgba(0,0,0,0.04)", color: isActive ? GOLD : MUTED, borderRadius: 0, display: "flex", alignItems: "center", gap: 4 }}>
                            ⏱ {task.timeTarget}
                          </div>
                        )}
                        {isActive && (
                          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                            ● IN PROGRESS
                          </div>
                        )}
                      </div>
                      <div style={{ fontWeight: 600, color: isDone ? "#666" : NAVY, fontSize: 14, textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.7 : 1 }}>
                        {task.description}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6, flexWrap: "wrap" as const }}>
                        {task.assignedTo && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MUTED }}>
                            <Users className="h-3 w-3" />
                            {task.assignedTo}
                          </span>
                        )}
                        {task.estimatedHours && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MUTED }}>
                            <Clock className="h-3 w-3" />
                            {task.estimatedHours}h target
                          </span>
                        )}
                        {isDone && (
                          <span style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>✓ Complete</span>
                        )}
                      </div>

                      {/* Acknowledgment section */}
                      {ackMap[task.id] ? (
                        <div style={{ marginTop: 10, padding: "6px 12px", background: "rgba(43,138,110,0.07)", border: `1px solid rgba(43,138,110,0.2)`, borderRadius: 0, display: "flex", alignItems: "center", gap: 10 }}>
                          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: TEAL }} />
                          <span style={{ fontSize: 11, color: TEAL, fontWeight: 700 }}>
                            {ackMap[task.id].actionType === 'escalate' ? '↑ Escalated' : ackMap[task.id].actionType === 'delegate' ? '→ Delegated' : '✓ Committed'} by {ackMap[task.id].role} — {ackMap[task.id].at}
                          </span>
                        </div>
                      ) : (isActive || isDone) && ackFormTaskId !== task.id ? (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <button
                              onClick={() => { setAckFormTaskId(task.id); setAckActionType('complete'); }}
                              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "5px 12px", background: "rgba(43,138,110,0.1)", border: `1px solid rgba(43,138,110,0.3)`, color: TEAL, borderRadius: 0, cursor: "pointer" }}
                            >✓ Commit to This</button>
                            <button
                              onClick={() => { setAckFormTaskId(task.id); setAckActionType('escalate'); }}
                              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "5px 12px", background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.3)`, color: GOLD, borderRadius: 0, cursor: "pointer" }}
                            >↑ Escalate</button>
                            <button
                              onClick={() => { setAckFormTaskId(task.id); setAckActionType('delegate'); }}
                              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "5px 12px", background: "rgba(10,15,46,0.05)", border: `1px solid rgba(10,15,46,0.2)`, color: NAVY, borderRadius: 0, cursor: "pointer" }}
                            >→ Delegate</button>
                          </div>
                          <div style={{ fontSize: 10, color: "rgba(10,15,46,0.38)", fontStyle: "italic", lineHeight: 1.5, letterSpacing: "0.01em" }}>
                            Silence at acknowledgment is the signal. The response either deploys here — before any outcome exists — or the window closes.
                          </div>
                        </div>
                      ) : null}

                      {/* Inline acknowledgment form */}
                      {ackFormTaskId === task.id && (
                        <div style={{ marginTop: 12, padding: "14px 16px", background: "#F8F9FC", border: `1px solid ${BORDER}`, borderRadius: 0 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: NAVY, marginBottom: 10 }}>
                            {ackActionType === 'escalate' ? '↑ Escalate Task' : ackActionType === 'delegate' ? '→ Delegate Task' : '✓ Commit to Task'}
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                            <input
                              value={ackName}
                              onChange={e => setAckName(e.target.value)}
                              placeholder="Your name"
                              style={{ flex: "1 1 120px", padding: "7px 10px", border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 12, color: NAVY, minWidth: 100 }}
                            />
                            <select
                              value={ackRole}
                              onChange={e => setAckRole(e.target.value)}
                              style={{ flex: "1 1 100px", padding: "7px 10px", border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 12, color: NAVY, background: "#fff" }}
                            >
                              {['CEO','CFO','COO','CMO','CTO','CISO','CHRO','General Counsel','Chief Strategy Officer','Chief Revenue Officer','Chief Procurement Officer','Board Chair','VP Operations','VP Finance','Head of Sales'].map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => submitAcknowledgment(task.id, task.description || '', index)}
                              style={{ padding: "7px 18px", background: ackActionType === 'complete' ? TEAL : ackActionType === 'escalate' ? GOLD : NAVY, color: "#fff", border: "none", borderRadius: 0, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                            >Confirm</button>
                            <button
                              onClick={() => setAckFormTaskId(null)}
                              style={{ padding: "7px 12px", background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 12, cursor: "pointer" }}
                            >Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                    {/* Decision Gate — shown after last task of each phase */}
                    {task.decisionGate && (
                      <div style={{ margin: "6px 0 10px", padding: "10px 16px", background: "rgba(10,15,46,0.03)", border: `1px solid rgba(10,15,46,0.12)`, borderLeft: `3px solid ${GOLD}` }}>
                        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>⬥ Decision Gate</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 8 }}>{task.decisionGate.question}</div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                          <div style={{ flex: 1, minWidth: 140, padding: "6px 10px", background: "rgba(43,138,110,0.07)", border: `1px solid rgba(43,138,110,0.25)`, borderRadius: 0 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 2 }}>✓ YES — Advance</div>
                            <div style={{ fontSize: 11, color: "#444" }}>{task.decisionGate.yes}</div>
                          </div>
                          <div style={{ flex: 1, minWidth: 140, padding: "6px 10px", background: "rgba(201,168,76,0.07)", border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 0 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 2 }}>✗ NO — Contain</div>
                            <div style={{ fontSize: 11, color: "#444" }}>{task.decisionGate.no}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        {executionStatus === 'active' && liveEvents.length > 0 && (
          <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`, background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 24px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ width: 8, height: 8, borderRadius: 0, background: TEAL, animation: "pulse 1.5s ease-in-out infinite" }} />
              <span style={{ ...CG, fontSize: 16, fontWeight: 600, color: NAVY }}>Live Execution Feed</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: TEAL, marginLeft: 4 }}>● LIVE</span>
            </div>
            <div style={{ padding: "12px 24px", maxHeight: 260, overflowY: "auto" as const, display: "flex", flexDirection: "column" as const, gap: 0 }}>
              {liveEvents.map((ev, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "baseline", gap: 12, padding: "7px 0",
                  borderBottom: i < liveEvents.length - 1 ? `1px solid rgba(0,0,0,0.04)` : "none",
                  opacity: i === 0 ? 1 : Math.max(0.4, 1 - i * 0.08),
                }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, whiteSpace: "nowrap" as const, flexShrink: 0, fontFamily: "monospace" }}>{ev.time}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 500,
                    color: ev.type === 'complete' ? TEAL : ev.type === 'notify' ? GOLD : ev.type === 'init' ? NAVY : "#444",
                  }}>{ev.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Execution Notes */}
        <div className="bg-white border border-[#E8E4DC] p-6">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <MessageSquare className="h-5 w-5" style={{ color: NAVY }} />
            <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Execution Notes</span>
          </div>
          <Textarea 
            placeholder="Document key decisions, actions taken, or important observations during this execution..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full focus-visible:ring-NAVY"
            style={{ border: `1.5px solid ${BORDER}`, color: NAVY }}
            data-testid="textarea-execution-notes"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4">
          <div className="flex gap-3">
            {executionStatus === 'active' ? (
              <Button 
                variant="outline" 
                onClick={() => setExecutionStatus('paused')}
                style={{ border:`1.5px solid ${BORDER}`, color:NAVY, background:"transparent", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"11px 24px" }}
                data-testid="button-pause-execution"
              >
                <PauseCircle className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : executionStatus === 'paused' ? (
              <Button 
                variant="outline" 
                onClick={() => setExecutionStatus('active')}
                style={{ border:`1.5px solid ${BORDER}`, color:NAVY, background:"transparent", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"11px 24px" }}
                data-testid="button-resume-execution"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Resume
              </Button>
            ) : null}
          </div>

          <Button 
            onClick={() => completeExecutionMutation.mutate()}
            disabled={completeExecutionMutation.isPending || executionStatus === 'completed'}
            style={{ background:NAVY, color:"#fff", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"11px 28px", border:"none" }}
            data-testid="button-complete-execution"
          >
            {completeExecutionMutation.isPending ? 'Finalizing...' : 'Complete Execution'}
          </Button>
        </div>

        {/* Post-Activation Debrief */}
        {executionStatus === 'completed' && (() => {
          const perfScore = Math.min(100, Math.round(
            (completedTasks / Math.max(displayTasks.length, 1)) * 60 +
            (isOnTrack ? 30 : 10) + 10
          ));
          const roiValue = Math.round(Math.max(timeSaved, 0) * 40);
          const roiFormatted = roiValue >= 1000000
            ? `$${(roiValue / 1000000).toFixed(1)}M`
            : `$${(roiValue / 1000).toFixed(0)}K`;
          const perfLabel = perfScore >= 90 ? 'Exceptional' : perfScore >= 75 ? 'Strong' : perfScore >= 60 ? 'On Track' : 'Needs Review';
          const perfColor = perfScore >= 90 ? TEAL : perfScore >= 75 ? GOLD : perfScore >= 60 ? NAVY : '#B91C1C';
          const recommendation = perfScore >= 90
            ? 'Outstanding execution. This prepared response is ready to be promoted as a benchmark across your portfolio. Consider sharing learnings with your strategic leadership team.'
            : perfScore >= 75
            ? 'Strong execution. Review task-level performance in the ADVANCE workspace to identify 1–2 optimizations for the next activation cycle.'
            : perfScore >= 60
            ? 'Solid execution. Focus your ADVANCE debrief on timeline adherence — explore where time was lost and update task estimates accordingly.'
            : 'This activation surfaced areas for improvement. Use the ADVANCE workspace to run a full debrief before the next trigger fires.';

          return (
            <>
              {/* Hero Completion Banner */}
              <div style={{ background: NAVY, padding: "56px 48px", textAlign: "center", color: "#fff", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
                <div className="relative z-10">
                  <Trophy className="h-14 w-14 mx-auto mb-4" style={{ color: GOLD }} />
                  <h2 style={{ ...CG, fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, marginBottom: 12 }}>
                    Readiness Protocol Executed <em style={{ fontStyle: "italic", color: GOLD }}>Successfully</em>
                  </h2>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>
                    Completed in {formatTime(elapsedSeconds)} &nbsp;·&nbsp; 3,600× Execution Head Start vs. 30-day industry mobilization cycle
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(201,168,76,0.15)", border: `1px solid ${GOLD}`, padding: "12px 28px", marginBottom: 28 }}>
                    <BarChart3 className="h-4 w-4" style={{ color: GOLD }} />
                    <span style={{ color: GOLD_LT, fontSize: 15, fontWeight: 700 }}>
                      {roiFormatted} decision time preserved &nbsp;·&nbsp; 30-day mobilization cycle compressed to 12 minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Link href="/execution-learning">
                      <Button style={{ background: GOLD, color: NAVY, fontWeight: 700, padding: "11px 28px", borderRadius: 0, fontSize: 12, letterSpacing: "0.05em" }}>
                        Review in Learning Center <ArrowRight className="h-4 w-4 ml-2 inline" />
                      </Button>
                    </Link>
                    <Link href="/workspace?tab=advance">
                      <Button variant="outline" style={{ border: `1.5px solid rgba(255,255,255,0.3)`, color: "#fff", background: "transparent", fontWeight: 600, padding: "11px 28px", borderRadius: 0, fontSize: 12 }}>
                        Proceed to ADVANCE
                      </Button>
                    </Link>
                    <Link href="/roi-dashboard">
                      <Button variant="outline" style={{ border: `1.5px solid rgba(255,255,255,0.3)`, color: "#fff", background: "transparent", fontWeight: 600, padding: "11px 28px", borderRadius: 0, fontSize: 12 }}>
                        View ROI Dashboard
                      </Button>
                    </Link>
                    {activationDbId && (
                      <Link href={`/activation-outcome/${activationDbId}`}>
                        <Button variant="outline" style={{ border: `1.5px solid rgba(255,255,255,0.3)`, color: "rgba(255,255,255,0.7)", background: "transparent", fontWeight: 600, padding: "11px 28px", borderRadius: 0, fontSize: 12 }}>
                          Outcome Report
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 14, textAlign: "center" }}>
                      Evaluating Readiness OS for your organization?
                    </p>
                    <Link href="/peer-review">
                      <button style={{
                        display: "block", width: "100%", padding: "14px 24px",
                        background: "transparent", border: `2px solid ${GOLD}`,
                        borderRadius: 0, color: GOLD, fontSize: 13, fontWeight: 700,
                        letterSpacing: "0.08em", textTransform: "uppercase" as const,
                        cursor: "pointer", transition: "all 0.2s",
                      }}>
                        Share Your Independent Assessment →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Counter-factual Timeline — What would have happened without Readiness OS */}
              {(() => {
                const domain = playbook?.domain || playbook?.strategicCategory || '';
                const cfEvents: { time: string; withOS: string; without: string; highlight?: boolean }[] = [
                  { time: "T+0:00", withOS: "Signal detected. Readiness Protocol auto-deployed.", without: "Trigger fires. No one knows yet.", highlight: true },
                  { time: "T+0:12", withOS: "Stakeholders acknowledged. Execution underway.", without: "Someone notices the headline. Starts forwarding emails." },
                  { time: "T+1:00", withOS: "All tasks assigned and in progress.", without: "Calendar invite sent: 'Alignment Call' — 3 days out." },
                  { time: "Day 2",  withOS: "First task wave complete. Debrief prep begins.", without: "Alignment call. No decisions made. 'Let's loop in legal.'" },
                  { time: "Day 7",  withOS: "Execution complete. ROI logged.", without: "Second meeting. Workstream owners finally identified." },
                  { time: "Day 14", withOS: "ADVANCE phase: learnings encoded for next cycle.", without: "Draft plan circulated. Awaiting approval from 6 stakeholders." },
                  { time: "Day 30", withOS: "Platform already monitoring the next trigger.", without: "First real action taken. The market has already moved.", highlight: true },
                ];
                return (
                  <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "40px 48px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 24, height: 2, background: "#dc2626" }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#dc2626" }}>
                        Counter-Factual · Without Readiness OS
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: MUTED, marginBottom: 24, lineHeight: 1.6, maxWidth: 600 }}>
                      What the same trigger would have looked like inside a standard Fortune 1000 mobilization cycle.
                    </p>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                            <th style={{ textAlign: "left", padding: "8px 12px 10px 0", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: MUTED, width: 90 }}>When</th>
                            <th style={{ textAlign: "left", padding: "8px 16px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: TEAL }}>With Readiness OS</th>
                            <th style={{ textAlign: "left", padding: "8px 0 10px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#dc2626" }}>Without Readiness OS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cfEvents.map((ev, i) => (
                            <tr
                              key={i}
                              style={{
                                borderBottom: `1px solid ${BORDER}`,
                                background: ev.highlight ? "rgba(10,15,46,0.02)" : "transparent",
                              }}
                            >
                              <td style={{ padding: "12px 12px 12px 0", fontWeight: 700, color: NAVY, fontSize: 11, letterSpacing: "0.04em", whiteSpace: "nowrap" as const }}>{ev.time}</td>
                              <td style={{ padding: "12px 16px", color: TEAL, fontWeight: 500, lineHeight: 1.5 }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                                  {ev.withOS}
                                </span>
                              </td>
                              <td style={{ padding: "12px 0 12px 16px", color: "#6B7280", fontWeight: 400, lineHeight: 1.5, borderLeft: `1px solid ${BORDER}` }}>
                                <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 6 }}>
                                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626", flexShrink: 0, marginTop: 5 }} />
                                  {ev.without}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(10,15,46,0.03)", borderLeft: `4px solid ${NAVY}` }}>
                      <p style={{ margin: 0, fontSize: 13, color: NAVY, fontWeight: 600, lineHeight: 1.6 }}>
                        The bottleneck was never the strategy. It was the 30 days it took to mobilize around it.
                        You just compressed that to {formatTime(elapsedSeconds)}.
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Simulation Context Banner — shown when demo tasks were used */}
              {safeTasks.length === 0 && (
                <div style={{ background: "rgba(43,138,110,0.06)", borderBottom: "1px solid rgba(43,138,110,0.2)", padding: "16px 48px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ flexShrink: 0, marginTop: 1 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 0, background: TEAL }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 4 }}>
                      Concept Simulation — Evidence of Execution Velocity
                    </p>
                    <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.55 }}>
                      This simulation demonstrates what your organization could achieve with Readiness OS in a live strategic event.
                      Performance scores, ROI estimates, and task completion rates are modeled against the <strong>30-day industry mobilization benchmark</strong> for comparable strategic response events.
                      Actual results vary by organization readiness and prepared response configuration.
                    </p>
                  </div>
                </div>
              )}

              {/* ADVANCE Debrief Strip */}
              <div style={{ background: OFF, borderBottom: `1px solid ${BORDER}`, padding: "40px 48px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                  <div style={{ width: 24, height: 2, background: GOLD }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD }}>ADVANCE — Execution Debrief</span>
                </div>

                {/* 4 Metric Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
                  {/* Performance Score */}
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${perfColor}`, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <Award className="h-3.5 w-3.5" style={{ color: perfColor }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED }}>Performance Score</span>
                    </div>
                    <div style={{ ...CG, fontSize: 40, fontWeight: 700, color: perfColor, lineHeight: 1 }}>{perfScore}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: perfColor, marginTop: 6, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{perfLabel}</div>
                  </div>

                  {/* Time Saved */}
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${TEAL}`, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <Clock className="h-3.5 w-3.5" style={{ color: TEAL }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED }}>Time Preserved</span>
                    </div>
                    <div style={{ ...CG, fontSize: 40, fontWeight: 700, color: TEAL, lineHeight: 1 }}>{Math.floor(timeSaved / 60)}h</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, marginTop: 6, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>vs. 30-day standard</div>
                  </div>

                  {/* Tasks Completed */}
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${NAVY}`, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color: NAVY }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED }}>Tasks Completed</span>
                    </div>
                    <div style={{ ...CG, fontSize: 40, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{completedTasks}/{displayTasks.length}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, marginTop: 6, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                      {displayTasks.length > 0 ? `${Math.round((completedTasks / displayTasks.length) * 100)}% completion rate` : 'No tasks tracked'}
                    </div>
                  </div>

                  {/* Decision Velocity */}
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${GOLD}`, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <Zap className="h-3.5 w-3.5" style={{ color: GOLD }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED }}>Decision Velocity</span>
                    </div>
                    <div style={{ ...CG, fontSize: 40, fontWeight: 700, color: GOLD, lineHeight: 1 }}>
                      {(industryStandard / Math.max(elapsedMinutes, 1)).toFixed(0)}x
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, marginTop: 6, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>faster than benchmark</div>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `4px solid ${perfColor}`, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <Brain className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: perfColor }} />
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: perfColor, marginBottom: 6 }}>AI Execution Recommendation</div>
                    <p style={{ fontSize: 13, color: NAVY, fontWeight: 500, lineHeight: 1.6, margin: 0 }}>{recommendation}</p>
                    <Link href="/workspace?tab=advance">
                      <button style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: perfColor, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase" as const, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                        Open ADVANCE Workspace <ArrowRight className="h-3 w-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Post-Execution Validation Report */}
              {params?.playbookId && (
                <>
                  <ExecutionValidationReport
                    scenarioId={params.playbookId}
                    executionId={executionId}
                    executionCompleted={true}
                  />
                  <PlaybookLearningsPanel scenarioId={params.playbookId} />
                </>
              )}
            </>
          );
        })()}
      </div>
    </div>
    </PageLayout>
  );
}
