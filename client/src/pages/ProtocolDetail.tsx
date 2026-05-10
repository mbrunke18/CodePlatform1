import { useState, useEffect, useCallback } from 'react';
import TriggerGroupManager from '@/components/protocol/TriggerGroupBuilder';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Play,
  Target,
  Zap,
  Clock,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Settings,
  BarChart3,
  Layers,
  ArrowRight,
  Lock,
  TrendingUp,
  Radio,
  GitBranch,
  MessageSquare,
  Activity,
  Flag,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Pencil,
  Plus,
  Trash2,
  Save,
  X,
  GripVertical,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import { useAuth } from '@/hooks/useAuth';
import { PhaseProgressBar } from '@/components/protocol/PhaseProgressBar';
import { PreparePhaseView } from '@/components/protocol/PreparePhaseView';
import { MonitorPhaseView } from '@/components/protocol/MonitorPhaseView';
import { LearnPhaseView } from '@/components/protocol/LearnPhaseView';
import { AIPrinciplesScorecard, DeterministicExecutionBadge } from '@/components/ai/AIPrinciplesScorecard';
import { ExecutionCommandCenter } from '@/components/execution/ExecutionCommandCenter';
import { PhaseSLASummary } from '@/components/protocol/PhaseSLASummary';

const SAMPLE_PLAYBOOK_NAMES = new Set([
  "Aggressive Pricing Disruption",
  "Compound: Geopolitical + Supply Chain Disruption",
  "AI Competitive Disruption",
]);

const SEVERITY_COLORS = {
  critical: 'bg-red-50 text-red-700',
  high: 'bg-[#C9A84C]/10 text-[#C9A84C]',
  medium: 'bg-[#2B8A6E]/10 text-[#2B8A6E]',
  low: 'bg-[#0A0F2E]/10 text-[#0A0F2E]',
};

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function RoleTaskCard({ task, index }: { task: any; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const priorityColor = task.priority === 'lead' ? GOLD : task.priority === 'conditional' ? TEAL : NAVY;
  return (
    <div style={{ border: `1px solid ${BORDER}`, marginBottom: 8, background: "#fff" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ width: 8, height: 8, borderRadius: 0, background: priorityColor, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, flex: 1 }}>{task.role}</span>
        {task.deadline && (
          <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>{task.deadline}</span>
        )}
        {open ? <ChevronDown size={14} color={MUTED} /> : <ChevronRight size={14} color={MUTED} />}
      </button>
      {open && (
        <div style={{ padding: "0 20px 16px 40px" }}>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {task.items.map((item: string, i: number) => (
              <li key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: 0, background: GOLD, flexShrink: 0, marginTop: 7 }} />
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DecisionGateBlock({ gate }: { gate: any }) {
  if (!gate) return null;
  return (
    <div style={{ border: `1px solid ${GOLD}`, background: `${GOLD}10`, padding: 20, marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <GitBranch size={14} color={GOLD} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>Decision Gate</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10 }}>{gate.title}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>All of the following must be true before advancing:</div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {gate.criteria.map((c: string, i: number) => (
          <li key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <CheckCircle2 size={13} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, color: "#374151" }}>{c}</span>
          </li>
        ))}
      </ul>
      {gate.escalation && (
        <div style={{ marginTop: 12, padding: "8px 12px", background: "#fff", border: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444" }}>ESCALATION: </span>
          <span style={{ fontSize: 12, color: MUTED }}>{gate.escalation}</span>
        </div>
      )}
    </div>
  );
}

// ── Task Editor Types ─────────────────────────────────────────────────────────
interface EditableTaskGroup { role: string; items: string[]; }
interface EditableDecisionGate { title: string; criteria: string[]; escalation: string; }
interface EditablePhase {
  id: string; name: string; timeWindow: string; objective: string;
  tasks: EditableTaskGroup[];
  decisionGate: EditableDecisionGate;
  restrictions: string[];
}

export default function ProtocolDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedPhase, setExpandedPhase] = useState<string | null>('phase-1');
  const { toast } = useToast();
  const { isAuthenticated, login, user } = useAuth();

  // Task editor state
  const [editedPhases, setEditedPhases] = useState<EditablePhase[]>([]);
  const [editorExpandedPhase, setEditorExpandedPhase] = useState<string | null>(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  const { data: organizationsRaw } = useQuery<any[]>({
    queryKey: ['/api/organizations'],
  });
  const organizations = Array.isArray(organizationsRaw) ? organizationsRaw : [];
  const organizationId = organizations[0]?.id;

  const isPlaybookNumber = /^\d+$/.test(id || '');

  const { data: playbookData, isLoading } = useQuery<any>({
    queryKey: ['/api/playbook-library', id],
    queryFn: async () => {
      if (isPlaybookNumber) {
        const response = await fetch(`/api/playbook-library/by-number/${id}`);
        if (!response.ok) throw new Error('Failed to fetch Readiness Protocol');
        const data = await response.json();
        return { playbook: data };
      }
      const response = await fetch(`/api/playbook-library/${id}`);
      if (!response.ok) throw new Error('Failed to fetch Readiness Protocol');
      return response.json();
    },
    enabled: !!id,
  });

  const playbook = playbookData?.playbook;
  const playbookUuid = playbook?.id;
  const isSampleView = SAMPLE_PLAYBOOK_NAMES.has(playbook?.name || "") && !isAuthenticated;

  const { data: performance } = useQuery<any>({
    queryKey: ['/api/playbook-performance', playbookUuid],
    queryFn: () => fetch(`/api/playbook-performance/${playbookUuid}`).then(r => r.json()),
    enabled: !!playbookUuid && !!user,
  });

  const { data: readiness } = useQuery<any>({
    queryKey: ['/api/playbook-library', playbookUuid, 'readiness', { organizationId }],
    queryFn: async () => {
      const response = await fetch(
        `/api/playbook-library/${playbookUuid}/readiness?organizationId=${organizationId}`
      );
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!playbookUuid && !!organizationId,
  });

  const { data: usersRaw } = useQuery<any[]>({
    queryKey: ['/api/users'],
    enabled: !!organizationId,
  });
  const users = Array.isArray(usersRaw) ? usersRaw : [];

  const activatePlaybookMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/playbook-library/${playbookUuid}/activate`, {
        scenarioId: `scenario-${Date.now()}`,
      });
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: 'Readiness Protocol Activated',
        description: `12-minute execution window initiated. ${result.stakeholders} stakeholders notified.`,
      });
      setLocation('/command-center');
    },
    onError: (error) => {
      toast({
        title: 'Activation Failed',
        description: error instanceof Error ? error.message : 'Unable to activate Readiness Protocol',
        variant: 'destructive',
      });
    },
  });

  const startDrillMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId || !users[0]?.id) throw new Error('No organization or user found');

      const drillData = {
        organizationId,
        playbookId: id,
        drillName: `Practice Drill: ${playbook?.name || 'Readiness Protocol'}`,
        drillType: 'simulation',
        scenarioDescription: playbook?.description || 'Practice drill simulation',
        scheduledDate: new Date(),
        scheduledTime: new Date().toTimeString().slice(0, 5),
        estimatedDuration: 30,
        invitedParticipants: [],
        actualParticipants: [],
        status: 'scheduled',
        complications: null,
        createdBy: users[0].id,
      };

      const drillResponse = await apiRequest('POST', '/api/practice-drills', drillData);
      const drill = await drillResponse.json();
      await apiRequest('POST', `/api/practice-drills/${drill.id}/start`, {});
      return drill;
    },
    onSuccess: (drill) => {
      toast({
        title: 'Practice Drill Started',
        description: 'Navigating to live execution...',
      });
      setLocation(`/practice-drills/${drill.id}/live`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start drill',
        variant: 'destructive',
      });
    },
  });

  // Sync enrichedPhases into the editor when Readiness Protocol data loads
  useEffect(() => {
    if (playbook?.enrichedPhases && Array.isArray(playbook.enrichedPhases)) {
      setEditedPhases(JSON.parse(JSON.stringify(playbook.enrichedPhases)));
      setHasUnsaved(false);
      setEditorExpandedPhase(playbook.enrichedPhases[0]?.id || null);
    }
  }, [playbook?.id, playbook?.enrichedPhases]);

  const savePhasesMutation = useMutation({
    mutationFn: async (phases: EditablePhase[]) => {
      const res = await apiRequest('PATCH', `/api/playbook-library/${playbookUuid}/customize`, {
        organizationId: organizationId || 'demo-org',
        customizations: { enrichedPhases: phases },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', id] });
      setHasUnsaved(false);
      toast({ title: 'Readiness Protocol updated', description: 'Phase tasks and decision gates saved.' });
    },
    onError: (error: any) => {
      toast({ title: 'Save failed', description: error.message || 'Could not save changes.', variant: 'destructive' });
    },
  });

  // Phase editor helpers
  const updatePhase = useCallback((phaseIdx: number, updates: Partial<EditablePhase>) => {
    setEditedPhases(prev => {
      const next = [...prev];
      next[phaseIdx] = { ...next[phaseIdx], ...updates };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const updateTask = useCallback((phaseIdx: number, taskIdx: number, updates: Partial<EditableTaskGroup>) => {
    setEditedPhases(prev => {
      const next = [...prev];
      const tasks = [...next[phaseIdx].tasks];
      tasks[taskIdx] = { ...tasks[taskIdx], ...updates };
      next[phaseIdx] = { ...next[phaseIdx], tasks };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const updateTaskItem = useCallback((phaseIdx: number, taskIdx: number, itemIdx: number, value: string) => {
    setEditedPhases(prev => {
      const next = [...prev];
      const tasks = [...next[phaseIdx].tasks];
      const items = [...tasks[taskIdx].items];
      items[itemIdx] = value;
      tasks[taskIdx] = { ...tasks[taskIdx], items };
      next[phaseIdx] = { ...next[phaseIdx], tasks };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const addTaskItem = useCallback((phaseIdx: number, taskIdx: number) => {
    setEditedPhases(prev => {
      const next = [...prev];
      const tasks = [...next[phaseIdx].tasks];
      tasks[taskIdx] = { ...tasks[taskIdx], items: [...tasks[taskIdx].items, ''] };
      next[phaseIdx] = { ...next[phaseIdx], tasks };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const removeTaskItem = useCallback((phaseIdx: number, taskIdx: number, itemIdx: number) => {
    setEditedPhases(prev => {
      const next = [...prev];
      const tasks = [...next[phaseIdx].tasks];
      const items = tasks[taskIdx].items.filter((_, i) => i !== itemIdx);
      tasks[taskIdx] = { ...tasks[taskIdx], items };
      next[phaseIdx] = { ...next[phaseIdx], tasks };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const addTaskGroup = useCallback((phaseIdx: number) => {
    setEditedPhases(prev => {
      const next = [...prev];
      next[phaseIdx] = { ...next[phaseIdx], tasks: [...next[phaseIdx].tasks, { role: 'New Role', items: [''] }] };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const removeTaskGroup = useCallback((phaseIdx: number, taskIdx: number) => {
    setEditedPhases(prev => {
      const next = [...prev];
      next[phaseIdx] = { ...next[phaseIdx], tasks: next[phaseIdx].tasks.filter((_, i) => i !== taskIdx) };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const updateCriteria = useCallback((phaseIdx: number, criteriaIdx: number, value: string) => {
    setEditedPhases(prev => {
      const next = [...prev];
      const gate = { ...next[phaseIdx].decisionGate };
      const criteria = [...gate.criteria];
      criteria[criteriaIdx] = value;
      gate.criteria = criteria;
      next[phaseIdx] = { ...next[phaseIdx], decisionGate: gate };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const addCriteria = useCallback((phaseIdx: number) => {
    setEditedPhases(prev => {
      const next = [...prev];
      const gate = { ...next[phaseIdx].decisionGate, criteria: [...next[phaseIdx].decisionGate.criteria, ''] };
      next[phaseIdx] = { ...next[phaseIdx], decisionGate: gate };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const removeCriteria = useCallback((phaseIdx: number, criteriaIdx: number) => {
    setEditedPhases(prev => {
      const next = [...prev];
      const gate = { ...next[phaseIdx].decisionGate, criteria: next[phaseIdx].decisionGate.criteria.filter((_, i) => i !== criteriaIdx) };
      next[phaseIdx] = { ...next[phaseIdx], decisionGate: gate };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const updateRestriction = useCallback((phaseIdx: number, restrictIdx: number, value: string) => {
    setEditedPhases(prev => {
      const next = [...prev];
      const restrictions = [...next[phaseIdx].restrictions];
      restrictions[restrictIdx] = value;
      next[phaseIdx] = { ...next[phaseIdx], restrictions };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const addRestriction = useCallback((phaseIdx: number) => {
    setEditedPhases(prev => {
      const next = [...prev];
      next[phaseIdx] = { ...next[phaseIdx], restrictions: [...next[phaseIdx].restrictions, ''] };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const removeRestriction = useCallback((phaseIdx: number, restrictIdx: number) => {
    setEditedPhases(prev => {
      const next = [...prev];
      next[phaseIdx] = { ...next[phaseIdx], restrictions: next[phaseIdx].restrictions.filter((_, i) => i !== restrictIdx) };
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const overallScore = readiness?.overallScore ?? 0;
  const canActivate = overallScore >= 50;

  const phases: any[] = playbook?.enrichedPhases || [];
  const commAssets: any[] = playbook?.communicationAssets || [];
  const riskIndicators: any = playbook?.riskIndicators || null;
  const outcomeFraming: any = playbook?.outcomeFraming || null;
  const signalSources: string[] = playbook?.signalSources || [];

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto p-6 animate-pulse">
          <div className="h-8 w-64 bg-slate-200 dark:bg-[#141B45] rounded mb-4" />
          <div className="h-48 bg-slate-200 dark:bg-[#141B45] rounded" />
        </div>
      </PageLayout>
    );
  }

  if (!playbook) {
    return (
      <PageLayout>
        <div className="container mx-auto p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
          <h2 className="text-xl font-semibold mb-2">Readiness Protocol Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested Readiness Protocol could not be found.
          </p>
          <Button asChild>
            <Link href="/playbook-library">Back to Library</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ExecutionStageGuide variant="compact" />
      <div style={{ background: OFF, minHeight: "100vh" }}>
        <div className="container mx-auto px-6 py-12 space-y-8" data-testid="Readiness Protocol-detail-page">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild data-testid="button-back" style={{ color: NAVY }}>
              <Link href="/playbook-library">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Link>
            </Button>
            <div className="flex gap-3">
              <Button
                onClick={() => setLocation(`/playbooks/${id}/customize`)}
                style={{ border: `1.5px solid ${BORDER}`, color: NAVY, background: "transparent", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── MAIN COLUMN ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Hero card */}
              <div style={{ border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GOLD}`, padding: 40, background: "#fff" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Readiness Protocol No. {playbook.playbookNumber}</span>
                </div>
                <h1 style={{ ...CG, fontSize: "clamp(32px,5vw,48px)", fontWeight: 600, color: NAVY, lineHeight: 1.05, marginBottom: 24 }}>
                  {playbook.name}
                </h1>
                <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, marginBottom: 40 }}>
                  {playbook.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-[#E8E4DC]">
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>Target Execution</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY }}>{playbook.averageExecutionTime || 12}m</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>Tier 1 Roles</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY }}>{playbook.tier1Count || 6}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>Severity</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: playbook.severity === 'critical' ? '#EF4444' : NAVY }}>
                      {playbook.severityScore || 85}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>Status</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: TEAL }}>Active</div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-transparent border-b border-[#E8E4DC] w-full justify-start rounded-none h-auto p-0 mb-8">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#6B7280]"
                  >
                    Overview
                  </TabsTrigger>
                  {isAuthenticated && (
                    <TabsTrigger
                      value="performance"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#6B7280]"
                    >
                      Performance
                    </TabsTrigger>
                  )}
                  {isAuthenticated && phases.length > 0 && (
                    <TabsTrigger
                      value="edit-tasks"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#6B7280]"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      Edit Tasks
                      {hasUnsaved && <span className="ml-2 w-2 h-2 bg-amber-500 inline-block" />}
                    </TabsTrigger>
                  )}
                  {isAuthenticated && (
                    <TabsTrigger
                      value="detect"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#6B7280]"
                    >
                      <Zap className="h-3.5 w-3.5 mr-2" />
                      Detect
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="overview" className="mt-0 space-y-8">
                  {/* Why It Matters */}
                  {playbook.whyItMatters && (
                    <div style={{ border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`, background: `${GOLD}08`, padding: 32 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <TrendingUp size={16} color={GOLD} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Why Speed Matters</span>
                      </div>
                      <p style={{ fontSize: 17, color: NAVY, lineHeight: 1.7, fontStyle: "italic", fontWeight: 500 }}>
                        {playbook.whyItMatters}
                      </p>
                    </div>
                  )}

                  {/* Trigger Criteria + Signal Sources */}
                  <div className="space-y-6">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                      <div style={{ width: 28, height: 2, background: NAVY, flexShrink: 0 }} />
                      <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Strategic Parameters</span>
                    </div>

                    <div className="grid gap-6">
                      <div style={{ border: `1px solid ${BORDER}`, padding: 32, background: "#fff" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Trigger Criteria</div>
                        <p style={{ color: NAVY, lineHeight: 1.6, marginBottom: signalSources.length > 0 ? 24 : 0 }}>{playbook.triggerCriteria}</p>

                        {signalSources.length > 0 && (
                          <>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                              <Radio size={12} color={MUTED} />
                              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED }}>Live Monitoring Sources</span>
                            </div>
                            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                              {signalSources.map((s: string, i: number) => (
                                <li key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                                  <div style={{ width: 6, height: 6, borderRadius: 0, background: TEAL, flexShrink: 0, marginTop: 6 }} />
                                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>

                      <div style={{ border: `1px solid ${BORDER}`, padding: 32, background: "#fff" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Core Stakeholders</div>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", marginBottom: 16 }}>Tier 1 — Decision Makers</h4>
                            <div className="flex flex-wrap gap-2">
                              {(typeof playbook.tier1Stakeholders === 'object' ? Object.values(playbook.tier1Stakeholders) : [playbook.tier1Stakeholders]).map((s: any, i: number) => (
                                <span key={i} style={{ padding: "4px 12px", background: OFF, border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 600, color: NAVY }}>
                                  {typeof s === 'string' ? s : s?.role || 'Stakeholder'}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", marginBottom: 16 }}>Tier 2 — Execution Team</h4>
                            <div className="flex flex-wrap gap-2">
                              {(typeof playbook.tier2Stakeholders === 'object' ? Object.values(playbook.tier2Stakeholders) : [playbook.tier2Stakeholders]).map((s: any, i: number) => (
                                <span key={i} style={{ padding: "4px 12px", background: "#fff", border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 600, color: MUTED }}>
                                  {typeof s === 'string' ? s : s?.role || 'Support'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Execution Phases */}
                  {phases.length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 28, height: 2, background: NAVY, flexShrink: 0 }} />
                        <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Execution Phases</span>
                      </div>
                      <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>
                        Each phase has specific role owners, deliverables, and a decision gate that must clear before the next phase begins.
                      </div>

                      <div className="space-y-4">
                        {phases.map((phase: any, pi: number) => {
                          const isOpen = expandedPhase === phase.id;
                          return (
                            <div key={phase.id} style={{ border: `1px solid ${BORDER}`, background: "#fff" }}>
                              <button
                                onClick={() => setExpandedPhase(isOpen ? null : phase.id)}
                                style={{ width: "100%", padding: "20px 28px", display: "flex", alignItems: "center", gap: 16, background: isOpen ? NAVY : "#fff", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                              >
                                <div style={{ width: 32, height: 32, borderRadius: 0, background: isOpen ? GOLD : OFF, border: `1px solid ${isOpen ? GOLD : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <span style={{ fontSize: 11, fontWeight: 700, color: isOpen ? NAVY : MUTED }}>{pi + 1}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isOpen ? GOLD : MUTED, marginBottom: 4 }}>{phase.timeWindow}</div>
                                  <div style={{ fontSize: 15, fontWeight: 700, color: isOpen ? "#fff" : NAVY }}>{phase.name}</div>
                                </div>
                                {isOpen ? <ChevronDown size={16} color={GOLD} /> : <ChevronRight size={16} color={MUTED} />}
                              </button>

                              {isOpen && (
                                <div style={{ padding: "24px 28px" }}>
                                  <div style={{ padding: "12px 16px", background: OFF, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>Objective: </span>
                                    <span style={{ fontSize: 13, color: NAVY }}>{phase.objective}</span>
                                  </div>

                                  {isSampleView ? (
                                    <>
                                      {phase.tasks.slice(0, 1).map((task: any, ti: number) => (
                                        <RoleTaskCard key={ti} task={task} index={ti} />
                                      ))}
                                      {phase.tasks.length > 1 && (
                                        <div style={{ border: `1px solid ${GOLD}`, background: "rgba(201,168,76,0.04)", padding: "20px 24px", marginTop: 12, textAlign: "center" }}>
                                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>
                                            {phase.tasks.length - 1} more task{phase.tasks.length > 2 ? "s" : ""} in this phase
                                          </div>
                                          <div style={{ fontSize: 13, color: MUTED, marginBottom: 16, lineHeight: 1.6 }}>
                                            Task sequences, decision rights mapping, stakeholder sequencing, and decision gates are available to pilot participants.
                                          </div>
                                          <button
                                            onClick={() => setLocation('/request-access')}
                                            style={{ background: NAVY, color: "#fff", border: "none", padding: "10px 24px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}
                                          >
                                            Request Access to View Full Sequence
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    phase.tasks.map((task: any, ti: number) => (
                                      <RoleTaskCard key={ti} task={task} index={ti} />
                                    ))
                                  )}

                                  {!isSampleView && phase.restrictions && phase.restrictions.length > 0 && (
                                    <div style={{ border: `1px solid #FCA5A5`, background: "#FFF5F5", padding: 16, marginTop: 16 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                        <AlertCircle size={13} color="#EF4444" />
                                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#EF4444" }}>What Does NOT Happen This Phase</span>
                                      </div>
                                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                        {phase.restrictions.map((r: string, ri: number) => (
                                          <li key={ri} style={{ fontSize: 12, color: "#7F1D1D", marginBottom: 4, paddingLeft: 12 }}>— {r}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {!isSampleView && <DecisionGateBlock gate={phase.decisionGate} />}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Communication Assets */}
                  {commAssets.length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 28, height: 2, background: NAVY, flexShrink: 0 }} />
                        <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Communication Assets</span>
                      </div>
                      <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>
                        Pre-staged draft communications — ready to personalize and deploy when the phase clock starts.
                      </div>

                      <div className="space-y-4">
                        {commAssets.map((asset: any, ai: number) => (
                          <div key={ai} style={{ border: `1px solid ${BORDER}`, background: "#fff" }}>
                            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 12 }}>
                              <MessageSquare size={14} color={GOLD} />
                              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, flex: 1 }}>{asset.label}</span>
                              <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", background: OFF, padding: "3px 8px", border: `1px solid ${BORDER}` }}>{asset.timing}</span>
                            </div>
                            {asset.subject && (
                              <div style={{ padding: "12px 24px", borderBottom: `1px solid ${BORDER}`, background: OFF }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>Subject: </span>
                                <span style={{ fontSize: 12, color: NAVY }}>{asset.subject}</span>
                              </div>
                            )}
                            <div style={{ padding: "20px 24px" }}>
                              <pre style={{ fontSize: 12, color: "#374151", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>
                                {asset.body}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Indicators */}
                  {riskIndicators && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 28, height: 2, background: NAVY, flexShrink: 0 }} />
                        <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Risk Indicators</span>
                      </div>
                      <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>
                        Signals that tell you whether the response is working — or needs to escalate.
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div style={{ border: `1px solid #86EFAC`, background: "#F0FDF4", padding: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 0, background: "#22C55E" }} />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#16A34A" }}>Green — On Track</span>
                          </div>
                          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                            {riskIndicators.green.map((item: string, i: number) => (
                              <li key={i} style={{ fontSize: 12, color: "#166534", marginBottom: 10, lineHeight: 1.5, paddingLeft: 8, borderLeft: "2px solid #86EFAC" }}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ border: `1px solid rgba(201,168,76,0.4)`, background: "rgba(201,168,76,0.05)", padding: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 0, background: "#C9A84C" }} />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0A0F2E" }}>Watch Closely</span>
                          </div>
                          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                            {riskIndicators.yellow.map((item: string, i: number) => (
                              <li key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 10, lineHeight: 1.5, paddingLeft: 8, borderLeft: "2px solid #C9A84C" }}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ border: `1px solid #FCA5A5`, background: "#FFF5F5", padding: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 0, background: "#EF4444" }} />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#DC2626" }}>Red — Escalate Now</span>
                          </div>
                          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                            {riskIndicators.red.map((item: string, i: number) => (
                              <li key={i} style={{ fontSize: 12, color: "#7F1D1D", marginBottom: 10, lineHeight: 1.5, paddingLeft: 8, borderLeft: "2px solid #FCA5A5" }}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Outcome Framing */}
                  {outcomeFraming && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 28, height: 2, background: NAVY, flexShrink: 0 }} />
                        <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Outcome Framing</span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {outcomeFraming.at12hours && (
                          <div style={{ border: `1px solid ${BORDER}`, background: "#fff", padding: 28 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                              <Clock size={13} color={TEAL} />
                              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: TEAL }}>Success at 12 Hours</span>
                            </div>
                            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                              {outcomeFraming.at12hours.map((item: string, i: number) => (
                                <li key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                  <CheckCircle2 size={13} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
                                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {outcomeFraming.at30days && (
                          <div style={{ border: `1px solid ${BORDER}`, background: "#fff", padding: 28 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                              <Flag size={13} color={GOLD} />
                              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>Success at 30 Days</span>
                            </div>
                            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                              {outcomeFraming.at30days.map((item: string, i: number) => (
                                <li key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                  <CheckCircle2 size={13} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
                                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {outcomeFraming.failureModes && (
                        <div style={{ border: `1px solid ${BORDER}`, borderLeft: `4px solid #EF4444`, background: "#fff", padding: 28 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <AlertTriangle size={13} color="#EF4444" />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#EF4444" }}>What Failure Looks Like</span>
                          </div>
                          <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
                            These are the specific, avoidable failure modes this Readiness Protocol is designed to prevent.
                          </div>
                          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                            {outcomeFraming.failureModes.map((item: string, i: number) => (
                              <li key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                <div style={{ width: 6, height: 6, borderRadius: 0, background: "#EF4444", flexShrink: 0, marginTop: 5 }} />
                                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="performance" className="mt-0">
                  {(!performance || performance.hasEnoughData === false || performance.activationCount < 3) ? (
                    <div style={{ background: NAVY, border: `1px solid ${GOLD}`, padding: 40, textAlign: "center" }}>
                      <Activity className="mx-auto h-12 w-12 mb-4" style={{ color: GOLD }} />
                      <h3 style={{ ...CG, fontSize: 24, color: GOLD, marginBottom: 12 }}>Performance Intelligence Accumulating</h3>
                      <p style={{ color: OFF, opacity: 0.8, fontSize: 16 }}>
                        This Readiness Protocol needs 3+ activations to generate meaningful patterns.
                        <br />
                        <span style={{ fontWeight: 700, color: GOLD }}>{performance?.activationCount || 0} activation(s) recorded.</span>
                      </p>
                    </div>
                  ) : (
                    <div style={{ background: NAVY, border: `1px solid ${BORDER}`, padding: 40 }}>
                      <div className="flex justify-between items-start mb-12">
                        <div>
                          <h2 style={{ ...CG, fontSize: 32, color: OFF, marginBottom: 8 }}>Performance Fingerprint</h2>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Historical Execution Data</div>
                        </div>
                        {performance.lastUsed && (
                          <div className="text-right">
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 4 }}>Last Used</div>
                            <div style={{ fontSize: 14, color: OFF }}>{new Date(performance.lastUsed).toLocaleDateString()}</div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div style={{ border: `1px solid ${NAVY_MID}`, background: "#141B45", padding: 24 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>Activations</div>
                          <div style={{ ...CG, fontSize: 32, color: OFF }}>{performance.activationCount}</div>
                        </div>
                        <div style={{ border: `1px solid ${NAVY_MID}`, background: "#141B45", padding: 24 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>Avg Execution</div>
                          <div style={{ ...CG, fontSize: 32, color: OFF }}>{performance.avgExecutionTime}m</div>
                        </div>
                        <div style={{ border: `1px solid ${NAVY_MID}`, background: "#141B45", padding: 24 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>Target Met</div>
                          <div style={{ ...CG, fontSize: 32, color: TEAL }}>{performance.targetMetRate}%</div>
                        </div>
                        <div style={{ border: `1px solid ${NAVY_MID}`, background: "#141B45", padding: 24 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>Success Rating</div>
                          <div style={{ ...CG, fontSize: 32, color: GOLD }}>{performance.avgSuccessRating}/5</div>
                        </div>
                      </div>

                      {performance.recentOutcomes && performance.recentOutcomes.length > 0 && (
                        <div>
                          <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 20 }}>Recent Execution Outcomes</h3>
                          <div className="space-y-4">
                            {performance.recentOutcomes.map((outcome: any, idx: number) => (
                              <div key={idx} style={{ border: `1px solid ${NAVY_MID}`, padding: 20, display: "flex", justifyContent: "between", alignItems: "center" }}>
                                <div className="flex-1">
                                  <p style={{ color: OFF, fontSize: 14, lineHeight: 1.5 }}>"{outcome.humanNote}"</p>
                                </div>
                                <div className="ml-6">
                                  <Badge className={outcome.targetMet ? "bg-[#2B8A6E] text-white" : "bg-red-500 text-white"}>
                                    {outcome.targetMet ? "Target Met" : "Target Missed"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* ── Edit Tasks Tab ─────────────────────────────────────────── */}
                <TabsContent value="edit-tasks" className="mt-0">
                  <div className="space-y-4">
                    {/* Header + Save */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", background: NAVY, border: `1px solid ${GOLD}` }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>Phase & Task Editor</div>
                        <div style={{ fontSize: 13, color: OFF, opacity: 0.8 }}>Add, edit, or remove tasks, decision gate criteria, and restrictions per phase.</div>
                      </div>
                      <div className="flex items-center gap-3">
                        {hasUnsaved && (
                          <span style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                            <span className="w-2 h-2 inline-block" style={{ background: "#C9A84C" }} />
                            Unsaved changes
                          </span>
                        )}
                        <Button
                          onClick={() => savePhasesMutation.mutate(editedPhases)}
                          disabled={savePhasesMutation.isPending || !hasUnsaved}
                          style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", height: 40 }}
                        >
                          <Save className="h-3.5 w-3.5 mr-2" />
                          {savePhasesMutation.isPending ? 'Saving…' : 'Save All Changes'}
                        </Button>
                      </div>
                    </div>

                    {/* Phase accordions */}
                    {editedPhases.map((phase, phaseIdx) => {
                      const isOpen = editorExpandedPhase === phase.id;
                      return (
                        <div key={phase.id} style={{ border: `1px solid ${BORDER}`, background: "#fff" }}>
                          {/* Phase header */}
                          <button
                            onClick={() => setEditorExpandedPhase(isOpen ? null : phase.id)}
                            style={{ width: "100%", padding: "18px 24px", display: "flex", alignItems: "center", gap: 14, background: isOpen ? NAVY : "#fff", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                          >
                            <div style={{ width: 28, height: 28, borderRadius: 0, background: isOpen ? GOLD : OFF, border: `1px solid ${isOpen ? GOLD : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: isOpen ? NAVY : MUTED }}>{phaseIdx + 1}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isOpen ? GOLD : MUTED, marginBottom: 2 }}>{phase.timeWindow}</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: isOpen ? "#fff" : NAVY }}>{phase.name}</div>
                            </div>
                            {isOpen ? <ChevronDown size={15} color={GOLD} /> : <ChevronRight size={15} color={MUTED} />}
                          </button>

                          {isOpen && (
                            <div style={{ padding: "24px 28px", background: "#FAFAF8", borderTop: `1px solid ${BORDER}` }}>

                              {/* Phase metadata */}
                              <div className="space-y-3 mb-6">
                                <div>
                                  <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, display: "block", marginBottom: 6 }}>Phase Name</label>
                                  <input
                                    type="text"
                                    value={phase.name}
                                    onChange={e => updatePhase(phaseIdx, { name: e.target.value })}
                                    style={{ width: "100%", border: `1px solid ${BORDER}`, padding: "8px 12px", fontSize: 13, fontWeight: 600, color: NAVY, background: "#fff", outline: "none" }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, display: "block", marginBottom: 6 }}>Objective</label>
                                  <textarea
                                    value={phase.objective}
                                    onChange={e => updatePhase(phaseIdx, { objective: e.target.value })}
                                    rows={2}
                                    style={{ width: "100%", border: `1px solid ${BORDER}`, padding: "8px 12px", fontSize: 13, color: NAVY, background: "#fff", outline: "none", resize: "vertical", lineHeight: 1.5 }}
                                  />
                                </div>
                              </div>

                              {/* Tasks by role */}
                              <div style={{ marginBottom: 24 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: NAVY }}>Role Task Groups</span>
                                  <button
                                    onClick={() => addTaskGroup(phaseIdx)}
                                    style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.08em", background: "none", border: `1px solid ${TEAL}`, padding: "4px 10px", cursor: "pointer" }}
                                  >
                                    <Plus size={11} /> Add Role Group
                                  </button>
                                </div>

                                {phase.tasks.map((taskGroup, taskIdx) => (
                                  <div key={taskIdx} style={{ border: `1px solid ${BORDER}`, background: "#fff", marginBottom: 10 }}>
                                    {/* Role header */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, background: "#F8F7F4" }}>
                                      <GripVertical size={13} color={MUTED} />
                                      <input
                                        type="text"
                                        value={taskGroup.role}
                                        onChange={e => updateTask(phaseIdx, taskIdx, { role: e.target.value })}
                                        style={{ flex: 1, border: "none", background: "transparent", fontSize: 12, fontWeight: 700, color: NAVY, outline: "none", letterSpacing: "0.02em" }}
                                        placeholder="Role (e.g. CEO, CISO, CMO)"
                                      />
                                      <button
                                        onClick={() => removeTaskGroup(phaseIdx, taskIdx)}
                                        style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0, display: "flex" }}
                                        title="Remove role group"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>

                                    {/* Task items */}
                                    <div style={{ padding: "10px 14px" }}>
                                      {taskGroup.items.map((item, itemIdx) => (
                                        <div key={itemIdx} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                                          <div style={{ width: 5, height: 5, borderRadius: 0, background: TEAL, flexShrink: 0, marginTop: 8 }} />
                                          <textarea
                                            value={item}
                                            onChange={e => updateTaskItem(phaseIdx, taskIdx, itemIdx, e.target.value)}
                                            rows={2}
                                            style={{ flex: 1, border: `1px solid ${BORDER}`, padding: "6px 10px", fontSize: 12, color: "#374151", lineHeight: 1.5, outline: "none", resize: "vertical", background: "#fff" }}
                                            placeholder="Task description…"
                                          />
                                          <button
                                            onClick={() => removeTaskItem(phaseIdx, taskIdx, itemIdx)}
                                            style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0, marginTop: 4, display: "flex" }}
                                            title="Remove task"
                                          >
                                            <X size={13} />
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        onClick={() => addTaskItem(phaseIdx, taskIdx)}
                                        style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, color: TEAL, background: "none", border: "none", cursor: "pointer", marginTop: 6, padding: "2px 0" }}
                                      >
                                        <Plus size={11} /> Add task
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Decision Gate */}
                              <div style={{ border: `1px solid ${GOLD}`, background: `${GOLD}05`, padding: 20, marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                  <CheckCircle2 size={13} color={GOLD} />
                                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>Decision Gate</span>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <label style={{ fontSize: 10, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Gate Question / Title</label>
                                    <input
                                      type="text"
                                      value={phase.decisionGate?.title || ''}
                                      onChange={e => {
                                        const gate = { ...phase.decisionGate, title: e.target.value };
                                        updatePhase(phaseIdx, { decisionGate: gate });
                                      }}
                                      style={{ width: "100%", border: `1px solid ${BORDER}`, padding: "7px 11px", fontSize: 13, color: NAVY, fontWeight: 600, background: "#fff", outline: "none" }}
                                    />
                                  </div>

                                  <div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                      <label style={{ fontSize: 10, fontWeight: 600, color: MUTED }}>Gate Criteria</label>
                                      <button
                                        onClick={() => addCriteria(phaseIdx)}
                                        style={{ fontSize: 10, fontWeight: 600, color: TEAL, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                      >
                                        <Plus size={11} /> Add criterion
                                      </button>
                                    </div>
                                    {(phase.decisionGate?.criteria || []).map((criterion: string, cIdx: number) => (
                                      <div key={cIdx} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                                        <div style={{ width: 5, height: 5, borderRadius: 0, background: GOLD, flexShrink: 0, marginTop: 9 }} />
                                        <input
                                          type="text"
                                          value={criterion}
                                          onChange={e => updateCriteria(phaseIdx, cIdx, e.target.value)}
                                          style={{ flex: 1, border: `1px solid ${BORDER}`, padding: "6px 10px", fontSize: 12, color: NAVY, background: "#fff", outline: "none" }}
                                        />
                                        <button
                                          onClick={() => removeCriteria(phaseIdx, cIdx)}
                                          style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
                                        >
                                          <X size={13} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  <div>
                                    <label style={{ fontSize: 10, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Escalation Protocol</label>
                                    <textarea
                                      value={phase.decisionGate?.escalation || ''}
                                      onChange={e => {
                                        const gate = { ...phase.decisionGate, escalation: e.target.value };
                                        updatePhase(phaseIdx, { decisionGate: gate });
                                      }}
                                      rows={2}
                                      style={{ width: "100%", border: `1px solid ${BORDER}`, padding: "7px 11px", fontSize: 12, color: "#374151", lineHeight: 1.5, background: "#fff", outline: "none", resize: "vertical" }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Restrictions */}
                              <div style={{ border: `1px solid #FCA5A5`, background: "#FFF5F5", padding: 20 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <AlertCircle size={13} color="#EF4444" />
                                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#EF4444" }}>What Does NOT Happen This Phase</span>
                                  </div>
                                  <button
                                    onClick={() => addRestriction(phaseIdx)}
                                    style={{ fontSize: 10, fontWeight: 600, color: "#DC2626", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                  >
                                    <Plus size={11} /> Add restriction
                                  </button>
                                </div>
                                {phase.restrictions.map((restriction, rIdx) => (
                                  <div key={rIdx} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                                    <span style={{ fontSize: 12, color: "#7F1D1D", flexShrink: 0, marginTop: 7 }}>—</span>
                                    <input
                                      type="text"
                                      value={restriction}
                                      onChange={e => updateRestriction(phaseIdx, rIdx, e.target.value)}
                                      style={{ flex: 1, border: `1px solid #FCA5A5`, padding: "6px 10px", fontSize: 12, color: "#7F1D1D", background: "#fff", outline: "none" }}
                                    />
                                    <button
                                      onClick={() => removeRestriction(phaseIdx, rIdx)}
                                      style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
                                    >
                                      <X size={13} />
                                    </button>
                                  </div>
                                ))}
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Bottom Save */}
                    {hasUnsaved && (
                      <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.06)", border: `1px solid #C9A84C`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "#0A0F2E", fontWeight: 600 }}>You have unsaved changes.</span>
                        <Button
                          onClick={() => savePhasesMutation.mutate(editedPhases)}
                          disabled={savePhasesMutation.isPending}
                          style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", height: 38 }}
                        >
                          <Save className="h-3.5 w-3.5 mr-2" />
                          {savePhasesMutation.isPending ? 'Saving…' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="detect" className="mt-0">
                  {playbookUuid && <TriggerGroupManager playbookId={playbookUuid} />}
                </TabsContent>

              </Tabs>
            </div>

            {/* ── SIDEBAR ── */}
            <aside className="space-y-6">
              <div style={{ border: `1px solid ${BORDER}`, padding: 32, background: "#fff", textAlign: "center" }}>
                {isSampleView ? (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>Free Sample Preview</div>
                    <div style={{ ...CG, fontSize: 15, fontWeight: 600, color: NAVY, marginBottom: 8, lineHeight: 1.4 }}>
                      167 exclusive Readiness Protocols are waiting for your team
                    </div>
                    <p style={{ fontSize: 12, color: MUTED, marginBottom: 24, lineHeight: 1.6 }}>
                      Access the full library, activate Readiness Protocols in real-time, and run practice drills with your executive team.
                    </p>
                    <Button
                      style={{ width: "100%", background: GOLD, color: NAVY, height: 54, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}
                      onClick={() => setLocation("/founding-partner-program")}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Apply for Founding Partner Access
                    </Button>
                    <Button
                      variant="outline"
                      style={{ width: "100%", border: `1.5px solid ${BORDER}`, color: NAVY, background: "transparent", height: 44, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                      onClick={() => setLocation('/founding-partner-program')}
                    >
                      Request Access
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 24 }}>Readiness Score</div>
                    <div style={{ ...CG, fontSize: 64, fontWeight: 600, color: overallScore >= 80 ? TEAL : overallScore >= 50 ? GOLD : "#EF4444", lineHeight: 1, marginBottom: 8 }}>
                      {overallScore}%
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 32 }}>
                      {overallScore >= 80 ? 'Combat Ready' : 'Optimization Required'}
                    </div>
                    <div className="space-y-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            style={{ width: "100%", background: NAVY, color: "#fff", height: 54, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                            disabled={!canActivate || activatePlaybookMutation.isPending}
                            data-testid="button-activate"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Activate Readiness Protocol
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent style={{ borderRadius: 0, border: `1px solid ${GOLD}` }}>
                          <AlertDialogHeader>
                            <AlertDialogTitle style={{ ...CG, fontSize: 24, color: NAVY }}>Confirm Activation</AlertDialogTitle>
                            <AlertDialogDescription style={{ color: MUTED }}>
                              This will initiate the 12-minute execution window. All stakeholders will
                              be notified, tasks will be created, and budgets will be unlocked.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel style={{ borderRadius: 0 }}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => activatePlaybookMutation.mutate()}
                              style={{ background: NAVY, color: "#fff", borderRadius: 0 }}
                            >
                              Initiate Execution
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        variant="outline"
                        style={{ width: "100%", border: `1.5px solid ${BORDER}`, color: NAVY, background: "transparent", height: 54, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                        onClick={() => startDrillMutation.mutate()}
                        disabled={startDrillMutation.isPending}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Practice Drill
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ border: `1px solid ${BORDER}`, padding: 32, background: NAVY, color: "#fff" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Mission Summary</div>
                <ul className="space-y-4">
                  {[
                    'Automatic Jira project creation',
                    'Role-based stakeholder notification',
                    'Real-time SLA tracking (12 min target)',
                    'Dynamic post-execution reporting'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Readiness Protocol Governance Indicator */}
              {(() => {
                const versionStr: string = playbook.version || '1.0';
                const major = parseFloat(versionStr.split('.')[0] || '1');
                const status = major >= 4 ? 'recertification' : major >= 2 ? 'review' : 'current';
                const statusConfig = {
                  current: { label: 'Current', color: TEAL, bg: `${TEAL}10`, borderColor: TEAL },
                  review: { label: 'Review Recommended', color: GOLD, bg: `${GOLD}10`, borderColor: GOLD },
                  recertification: { label: 'Recertification Required', color: '#EF4444', bg: 'rgba(239,68,68,0.06)', borderColor: '#EF4444' },
                };
                const cfg = statusConfig[status];
                return (
                  <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${cfg.borderColor}`, padding: "20px 24px", background: "#fff" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 12 }}>Source Governance</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <GitBranch size={14} color={cfg.color} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, background: OFF, padding: "2px 8px", border: `1px solid ${BORDER}` }}>v{versionStr}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" as const, fontSize: 11, color: MUTED }}>
                        <span>Readiness Protocol No.</span>
                        <span style={{ fontWeight: 600, color: NAVY }}>#{playbook.playbookNumber || '—'}</span>
                      </div>
                      {playbook.domain && (
                        <div style={{ display: "flex", justifyContent: "space-between" as const, fontSize: 11, color: MUTED }}>
                          <span>Domain</span>
                          <span style={{ fontWeight: 600, color: NAVY }}>
                            {typeof playbook.domain === 'object' ? (playbook.domain as any)?.name : playbook.domain}
                          </span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" as const, fontSize: 11, color: MUTED }}>
                        <span>Library Status</span>
                        <span style={{ fontWeight: 600, color: TEAL }}>Active</span>
                      </div>
                    </div>
                    {status !== 'current' && (
                      <div style={{ marginTop: 14, padding: "8px 12px", background: cfg.bg, border: `1px solid ${cfg.borderColor}`, fontSize: 11, color: cfg.color, lineHeight: 1.5 }}>
                        {status === 'review' ? 'This Readiness Protocol has undergone significant revisions. Validate against current operating conditions.' : 'High version count — schedule a formal recertification review with your strategy team.'}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Quick-jump nav for enriched sections */}
              {phases.length > 0 && (
                <div style={{ border: `1px solid ${BORDER}`, padding: 24, background: "#fff" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Jump to Phase</div>
                  <div className="space-y-2">
                    {phases.map((phase: any, pi: number) => (
                      <button
                        key={phase.id}
                        onClick={() => {
                          setExpandedPhase(phase.id);
                          document.getElementById(`phase-${phase.id}`)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: expandedPhase === phase.id ? `${NAVY}08` : "transparent", border: `1px solid ${expandedPhase === phase.id ? NAVY : BORDER}`, cursor: "pointer", textAlign: "left" }}
                      >
                        <div style={{ width: 20, height: 20, borderRadius: 0, background: expandedPhase === phase.id ? NAVY : OFF, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: expandedPhase === phase.id ? "#fff" : MUTED }}>{pi + 1}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{phase.timeWindow}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: NAVY }}>{phase.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {isSampleView && (
            <div style={{ background: NAVY, padding: "64px 48px", marginTop: 0 }}>
              <div className="max-w-3xl mx-auto text-center">
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                  VaughnMartin · Readiness OS
                </div>
                <div style={{ ...CG, fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
                  You just read one of 3 public playbooks.<br />
                  <em style={{ color: GOLD }}>167 exclusive ones are already protecting your competitors.</em>
                </div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
                  Every Readiness Protocol in the Readiness OS library is built from 20+ years of Fortune 500 transformation.
                  Your team can be execution-ready in 12 minutes — not 12 weeks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    style={{ background: GOLD, color: NAVY, height: 56, paddingLeft: 36, paddingRight: 36, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", borderRadius: 0 }}
                    onClick={() => setLocation("/founding-partner-program")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Apply for Founding Partner Access
                  </Button>
                  <Button
                    style={{ background: "transparent", color: "#fff", height: 56, paddingLeft: 36, paddingRight: 36, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", borderRadius: 0, border: "1.5px solid rgba(255,255,255,0.25)" }}
                    onClick={() => setLocation("/founding-partner-program")}
                  >
                    Request Enterprise Pilot
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
                  {["170 Readiness Protocols", "9 Strategic Domains", "12-Minute Execution", "Fortune 1000 Ready"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color: GOLD }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
