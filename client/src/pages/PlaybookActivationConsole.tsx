import { useEffect, useState } from "react";
import PageLayout from '@/components/layout/PageLayout';
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
  Zap
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

export default function PlaybookActivationConsole() {
  const [, params] = useRoute("/playbook-activation/:triggerId/:playbookId");
  const { toast } = useToast();
  const [activationConfirmed, setActivationConfirmed] = useState(false);
  const [executionStartTime, setExecutionStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [executionStatus, setExecutionStatus] = useState<'pending' | 'active' | 'paused' | 'completed'>('pending');
  const [executionId] = useState(`exec-${Date.now()}`);
  const [activationDbId, setActivationDbId] = useState<string | null>(null);

  // Fetch trigger details (skip for manual executions)
  const isManualExecution = params?.triggerId === 'manual';
  const { data: trigger } = useQuery<any>({
    queryKey: ['/api/executive-triggers', params?.triggerId],
    enabled: !!params?.triggerId && !isManualExecution,
  });

  // Fetch playbook details
  const { data: playbook } = useQuery<any>({
    queryKey: ['/api/scenarios', params?.playbookId],
    enabled: !!params?.playbookId,
  });

  // Fetch tasks for this playbook
  const { data: tasksRaw } = useQuery<any[]>({
    queryKey: [`/api/tasks?playbookId=${params?.playbookId}`],
    enabled: !!params?.playbookId,
  });
  const tasks = Array.isArray(tasksRaw) ? tasksRaw : [];

  // Role availability check — extract role names from playbook and check for flags
  const { data: roleAvailabilityFlagsRaw } = useQuery<any[]>({
    queryKey: ['/api/role-availability'],
    enabled: !activationConfirmed,
  });
  const roleAvailabilityFlags = Array.isArray(roleAvailabilityFlagsRaw) ? roleAvailabilityFlagsRaw : [];

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

  // Handle activation confirmation
  const handleConfirmActivation = () => {
    setActivationConfirmed(true);
    setExecutionStartTime(new Date());
    setExecutionStatus('active');
    toast({
      title: "Playbook Activated",
      description: "Execution timer started. Rally your team!",
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
      
      // Calculate weighted rolling average: (prevAvg * prevCount + newTime) / (prevCount + 1)
      const newAverage = prevCount > 0
        ? Math.round((prevAvg * prevCount + executionTime) / (prevCount + 1))
        : executionTime;
      
      // Update scenario with execution data
      const response1 = await fetch(`/api/scenarios/${params?.playbookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          executionCount: prevCount + 1,
          averageExecutionTime: newAverage,
          lastTriggered: new Date().toISOString(),
        }),
      });
      
      if (!response1.ok) throw new Error('Failed to update scenario');

      // Update trigger status back to green (only for trigger-based executions)
      if (!isManualExecution) {
        const response2 = await fetch(`/api/executive-triggers/${params?.triggerId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'green',
            currentValue: null,
          }),
        });
        
        if (!response2.ok) throw new Error('Failed to update trigger status');
      }
    },
    onSuccess: async () => {
      queryClient.refetchQueries({ queryKey: ['/api/scenarios'], exact: false });
      queryClient.refetchQueries({ queryKey: ['/api/executive-triggers'], exact: false });
      setExecutionStatus('completed');
      toast({
        title: "✅ Playbook Execution Completed",
        description: `Executed in ${formatTime(elapsedSeconds)}`,
      });
      // Create activation DB record and auto-seed outcome card
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
            triggerEventId: !isManualExecution ? params?.triggerId : null,
          }),
        });
        if (actRes.ok) {
          const act = await actRes.json();
          setActivationDbId(act.id);
          // Auto-create outcome record
          await fetch('/api/activation-outcomes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activationId: act.id, playbookId: params?.playbookId }),
          });
        }
      } catch (_) {}
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const safeTasks = tasks || [];
  const completedTasks = safeTasks.filter((t: any) => t.status === 'completed').length;
  const progressPercent = safeTasks.length > 0 ? (completedTasks / safeTasks.length) * 100 : 0;
  
  // SuccessMetrics:
  const targetTime = 12; // 12 minutes target
  const elapsedMinutes = elapsedSeconds / 60;
  const isOnTrack = elapsedMinutes <= targetTime;
  const industryStandard = 72 * 60; // 72 hours in minutes
  const timeSaved = industryStandard - elapsedMinutes;

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

  // For manual executions, only wait for playbook. For trigger-based, wait for both.
  if (!playbook || (!isManualExecution && !trigger)) {
    return <PageLayout><div className="p-6" style={{ background: OFF, minHeight: "100vh", color: NAVY }}>Loading activation console...</div></PageLayout>;
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
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Pre-Activation Review</span>
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

            {/* Playbook Summary Card */}
            <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, padding: "20px 24px", background: "#fff", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 8 }}>
                <PlayCircle className="h-5 w-5" style={{ color: GOLD }} />
                <span style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY }}>Playbook: {playbook?.name || 'Loading...'}</span>
              </div>
              <p style={{ fontSize: 14, color: MUTED }}>
                {playbook?.description || 'Strategic response playbook ready for activation.'}
              </p>
              {!isManualExecution && trigger && (
                <div style={{ marginTop: 16, padding: 12, background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 2, color: "#B91C1C", fontWeight: 500, fontSize: 13 }}>
                    <AlertTriangle className="h-4 w-4" />
                    Triggered by: {trigger.name}
                  </div>
                </div>
              )}
            </div>

            {/* Role Availability Warning Banner */}
            {limitedPlaybookRoles.length > 0 && (
              <div style={{ border: '1px solid #D97706', borderLeft: '4px solid #D97706', background: 'rgba(217, 119, 6, 0.06)', padding: '16px 20px', marginBottom: 20, borderRadius: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <AlertTriangle className="h-4 w-4" style={{ color: '#D97706', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#D97706' }}>Role Availability Advisory</span>
                </div>
                <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5, marginBottom: 8 }}>
                  The following roles have been flagged as limited availability by your admin. This is advisory — you can still proceed, but response time may be impacted.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                  {limitedPlaybookRoles.map((f: any) => (
                    <span key={f.roleName} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(217, 119, 6, 0.12)', color: '#92400E', padding: '3px 8px', border: '1px solid #D97706' }}>
                      {f.roleName}{f.note ? ` — ${f.note}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pre-Activation Impact Preview */}
            <PreActivationImpactPreview 
              playbook={playbook}
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
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Live Execution Console</span>
              </div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,5vw,48px)", lineHeight: 1.05, color: NAVY, marginBottom: 16 }}>
                Execute Your <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Playbook</em>
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
                <strong style={{ color: GOLD }}>INDUSTRY BENCHMARK:</strong> Traditional coordination takes 72 hours average.
                <strong style={{ color: GOLD, marginLeft: 16 }}>M TARGET:</strong> 12 minutes or less.
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
                {elapsedMinutes > 0 ? `${(industryStandard / elapsedMinutes).toFixed(0)}x` : '360x+'}
              </div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: MUTED, marginTop:8 }}>
                Faster than 72hr standard
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

        {/* Trigger & Playbook Info */}
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
              <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Active Playbook</span>
            </div>
            <div className="space-y-4">
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>Playbook Name</div>
                <div style={{ fontWeight: 600, color: NAVY }} data-testid="text-playbook-name">{playbook.title || playbook.name}</div>
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
                  }} data-testid="badge-playbook-readiness">
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

        {/* Stakeholder Alignment Dashboard - shown during active execution */}
        {executionStatus !== 'completed' && params?.playbookId && (
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
              {completedTasks} of {safeTasks.length} tasks completed
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
              {safeTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks defined for this playbook
                </div>
              ) : (
                safeTasks.map((task: any, index: number) => (
                  <div 
                    key={task.id} 
                    style={{ 
                      display: "flex", 
                      alignItems: "flex-start", 
                      gap: 12, 
                      padding: 16, 
                      background: task.status === 'completed' ? "rgba(43,138,110,0.03)" : "#fff",
                      border: `1px solid ${task.status === 'completed' ? TEAL : BORDER}`,
                      borderLeft: `3px solid ${task.status === 'completed' ? TEAL : task.status === 'in_progress' ? GOLD : BORDER}`
                    }}
                    data-testid={`task-item-${index}`}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: TEAL }} />
                    ) : (
                      <Circle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: BORDER }} />
                    )}
                    <div className="flex-1">
                      <div style={{ fontWeight: 600, color: NAVY, fontSize: 14 }}>{task.description}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
                        {task.assignedTo && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {task.assignedTo}
                          </span>
                        )}
                        {task.estimatedHours && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedHours}h target
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ 
                      display:"inline-flex", alignItems:"center", gap:5, 
                      background: task.status === 'completed' ? "rgba(43,138,110,0.12)" : task.status === 'in_progress' ? "rgba(201,168,76,0.12)" : "rgba(0,0,0,0.05)", 
                      color: task.status === 'completed' ? TEAL : task.status === 'in_progress' ? GOLD : MUTED, 
                      fontSize:8, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"2px 8px"
                    }}>
                      {task.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

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

        {/* Success Message */}
        {executionStatus === 'completed' && (
          <>
            <div style={{ background: NAVY, padding: "64px 48px", textAlign: "center", color: "#fff", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
              <div className="relative z-10 space-y-4">
                <Trophy className="h-16 w-16 mx-auto" style={{ color: GOLD }} />
                <h2 style={{ ...CG, fontSize: "clamp(32px,5vw,48px)", fontWeight: 600 }}>Playbook Executed <em style={{ fontStyle: "italic", color: GOLD }}>Successfully</em></h2>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Completed in {formatTime(elapsedSeconds)} • {(industryStandard / Math.max(elapsedMinutes, 1)).toFixed(0)}x faster than industry standard
                </div>
                <p style={{ color: GOLD_LT, fontSize: 18 }}>
                  Mission critical time saved: {Math.floor(timeSaved / 60)}h {(timeSaved % 60).toFixed(0)}m
                </p>
                {activationDbId && (
                  <Link href={`/activation-outcome/${activationDbId}`}>
                    <Button style={{ background: GOLD, color: NAVY, fontWeight: 700, borderRadius: 0, marginTop: 8 }}>
                      Close the Loop — View Outcome Report →
                    </Button>
                  </Link>
                )}
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
                
                {/* AI-Powered Learning Extraction */}
                <PlaybookLearningsPanel scenarioId={params.playbookId} />
              </>
            )}
          </>
        )}
      </div>
    </div>
    </PageLayout>
  );
}
