import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  Pause,
  CheckCircle,
  Clock,
  Users,
  Target,
  AlertTriangle,
  ChevronRight,
  Activity,
  Zap,
  X,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

interface Complication {
  id: string;
  title: string;
  description: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  responseOptions: string[];
  injectedAt: string;
  minuteElapsed: number;
  selectedResponse?: string;
}

const COMPLICATION_MINUTES = [3, 6, 9];

export default function LiveDrillExecution() {
  const [, params] = useRoute('/practice-drills/:drillId/live');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const drillId = params?.drillId;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedDecisions, setSelectedDecisions] = useState<Record<string, string>>({});
  const [complications, setComplications] = useState<Complication[]>([]);
  const [activeComplication, setActiveComplication] = useState<Complication | null>(null);
  const injectedMinutes = useRef<Set<number>>(new Set());

  const { data: drillDetails, isLoading } = useQuery<any>({
    queryKey: [`/api/practice-drills/drill/${drillId}`],
    enabled: !!drillId,
  });

  const drill = drillDetails?.drill;
  const playbook = drillDetails?.playbook;
  const domain = drillDetails?.domain;

  const { data: decisionTreesData } = useQuery<any[]>({
    queryKey: [`/api/playbook-library/${drill?.playbookId}/decision-trees`],
    enabled: !!drill?.playbookId,
  });
  const decisionTrees = decisionTreesData ?? [];

  const { data: taskSequencesData } = useQuery<any[]>({
    queryKey: [`/api/playbook-library/${drill?.playbookId}/task-sequences`],
    enabled: !!drill?.playbookId,
  });
  const taskSequences = taskSequencesData ?? [];

  const completeDrillMutation = useMutation({
    mutationFn: async (performanceData: any) => {
      const response = await apiRequest('POST', `/api/practice-drills/${drillId}/complete`, performanceData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/practice-drills'] });
      toast({
        title: 'Drill Completed',
        description: 'Performance data recorded successfully',
      });
      setLocation('/practice-drills');
    },
  });

  const injectComplicationMutation = useMutation({
    mutationFn: async (minuteElapsed: number) => {
      const response = await apiRequest('POST', `/api/practice-drills/${drillId}/complication`, {
        minuteElapsed,
        playbookName: playbook?.name ?? drill?.drillName ?? 'Readiness Protocol',
        domain: domain?.domainName ?? 'risk',
      });
      return response.json();
    },
    onSuccess: (data: Complication) => {
      setComplications(prev => [...prev, data]);
      setActiveComplication(data);
    },
  });

  // Countdown timer
  useEffect(() => {
    if (!isRunning || !drill?.startedAt) return;
    const interval = setInterval(() => {
      const start = new Date(drill.startedAt).getTime();
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, drill?.startedAt]);

  // Complication injection at minutes 3, 6, 9
  useEffect(() => {
    if (!isRunning || !drill?.startedAt) return;
    const currentMinute = Math.floor(elapsedSeconds / 60);
    for (const targetMinute of COMPLICATION_MINUTES) {
      if (currentMinute >= targetMinute && !injectedMinutes.current.has(targetMinute)) {
        injectedMinutes.current.add(targetMinute);
        injectComplicationMutation.mutate(targetMinute);
        break;
      }
    }
  }, [elapsedSeconds, isRunning, drill?.startedAt]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const targetSeconds = 720;
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100);

  const getCheckpointStatus = (timing: string) => {
    const match = timing.match(/T\+(\d+):(\d+)/);
    if (!match) return 'pending';
    const checkpointSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
    return elapsedSeconds >= checkpointSeconds ? 'active' : 'pending';
  };

  const handleCompleteDrill = () => {
    const performanceData = {
      actualExecutionTime: Math.floor(elapsedSeconds / 60),
      executionSpeedScore: progress >= 100 ? 95 : Math.floor((100 - progress) * 0.8 + 60),
      triggerToAlert: 30,
      alertToActivation: 60,
      activationToWarRoom: 120,
      warRoomToDecision: 180,
      decisionToExecution: 180,
      tier1Participation: 1.0,
      tier2Participation: 0.95,
      tier3Acknowledgment: 0.90,
      roleClarity: 0.95,
      bottlenecks: complications.length > 0 ? complications.map(c => c.title) : [],
      communicationsSent: taskSequences.length,
      communicationsDelivered: taskSequences.length,
      communicationEffectiveness: 0.95,
      overallScore: complications.length > 0 ? Math.max(75, 90 - complications.filter(c => !c.selectedResponse).length * 5) : 90,
      passed: progress <= 100,
      whatWorked: 'Strong coordination and communication',
      whatDidntWork: complications.filter(c => !c.selectedResponse).length > 0
        ? `${complications.filter(c => !c.selectedResponse).length} complication(s) were not formally responded to`
        : '',
      recommendations: [],
      actualParticipants: [],
    };
    completeDrillMutation.mutate(performanceData);
  };

  const severityColor = (severity: string) =>
    severity === 'CRITICAL' ? '#DC2626' : severity === 'HIGH' ? '#D97706' : '#2B8A6E';

  const severityBg = (severity: string) =>
    severity === 'CRITICAL' ? '#FEF2F2' : severity === 'HIGH' ? '#FFFBEB' : '#F0FDF9';

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-6">
          <div className="animate-pulse">Loading drill execution...</div>
        </div>
      </PageLayout>
    );
  }

  if (!drill) {
    return (
      <PageLayout>
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">Drill not found</div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ExecutionStageGuide variant="compact" />
      <div className="p-6 space-y-6" data-testid="live-drill-execution-page">

        {/* ── Active Complication Alert ── */}
        {activeComplication && (
          <div
            style={{
              border: `2px solid ${severityColor(activeComplication.severity)}`,
              borderRadius: '0.15rem',
              background: severityBg(activeComplication.severity),
              padding: '0',
              animation: 'pulse 1s ease-in-out 3',
            }}
          >
            {/* Header bar */}
            <div style={{ background: severityColor(activeComplication.severity), padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap size={16} color="#fff" />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  COMPLICATION INJECTED — MINUTE {activeComplication.minuteElapsed}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: 9999 }}>
                  {activeComplication.severity}
                </span>
              </div>
              <button
                onClick={() => setActiveComplication(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <X size={16} color="rgba(255,255,255,0.8)" />
              </button>
            </div>

            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 8 }}>
                {activeComplication.title}
              </div>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 16 }}>
                {activeComplication.description}
              </div>

              {/* Response options */}
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                How does your team respond?
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {activeComplication.responseOptions.map((opt, i) => {
                  const chosen = activeComplication.selectedResponse === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const updated = { ...activeComplication, selectedResponse: opt };
                        setActiveComplication(updated);
                        setComplications(prev => prev.map(c => c.id === updated.id ? updated : c));
                      }}
                      style={{
                        padding: '8px 14px',
                        border: `1.5px solid ${chosen ? NAVY : '#D1D5DB'}`,
                        borderRadius: '0.15rem',
                        background: chosen ? NAVY : '#fff',
                        color: chosen ? GOLD : NAVY,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      {chosen && <CheckCircle size={12} style={{ display: 'inline', marginRight: 5 }} />}
                      {opt}
                    </button>
                  );
                })}
              </div>

              {activeComplication.selectedResponse && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>
                    ✓ Response selected — continue primary execution
                  </div>
                  <button
                    onClick={() => setActiveComplication(null)}
                    style={{ padding: '6px 14px', background: TEAL, color: '#fff', border: 'none', borderRadius: '0.15rem', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Acknowledge &amp; Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-red-700 animate-pulse" />
              <h1 className="text-3xl font-bold" data-testid="page-title">
                LIVE DRILL EXECUTION
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">
              {playbook?.name || drill.drillName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {complications.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#FEF3C7', border: '1px solid #D97706', borderRadius: '0.15rem' }}>
                <Zap size={12} color="#D97706" />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706' }}>
                  {complications.length} COMPLICATION{complications.length > 1 ? 'S' : ''}
                </span>
              </div>
            )}
            <Badge variant="destructive" className="text-lg px-4 py-2 animate-pulse">
              ACTIVE
            </Badge>
          </div>
        </div>

        {/* Countdown Timer */}
        <Card className="border-2 border-red-600 dark:border-red-400">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                <CardTitle>Elapsed Time</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <Button size="sm" variant="outline" onClick={() => setIsRunning(false)} data-testid="button-pause-timer">
                    <Pause className="h-4 w-4 mr-2" />Pause
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setIsRunning(true)} data-testid="button-resume-timer">
                    <Play className="h-4 w-4 mr-2" />Resume
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold" data-testid="text-elapsed-time">
                {formatTime(elapsedSeconds)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Target: 12:00 minutes
              </div>
            </div>
            <Progress value={progress} className="h-3" data-testid="progress-execution" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Started: {new Date(drill.startedAt).toLocaleTimeString()}</span>
              <span>{Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s elapsed</span>
            </div>
            {/* Complication timeline indicators */}
            {COMPLICATION_MINUTES.length > 0 && (
              <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Complication marks:</span>
                {COMPLICATION_MINUTES.map(min => {
                  const fired = injectedMinutes.current.has(min);
                  return (
                    <span key={min} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: '0.1rem', background: fired ? '#D97706' : '#F3F4F6', color: fired ? '#fff' : '#6B7280', border: `1px solid ${fired ? '#D97706' : '#E5E7EB'}` }}>
                      {fired ? <Zap size={9} style={{ display: 'inline', marginRight: 2 }} /> : null}
                      T+{min}:00
                    </span>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Decision Checkpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Decision Checkpoints
              </CardTitle>
              <CardDescription>Critical decisions during execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {decisionTrees.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No decision checkpoints defined for this Readiness Protocol
                </div>
              ) : (
                decisionTrees.map((checkpoint: any) => {
                  const status = getCheckpointStatus(checkpoint.checkpointTiming || 'T+0:00');
                  return (
                    <div
                      key={checkpoint.id}
                      className={`p-4 border-2 ${status === 'active' ? 'border-[#2B8A6E] bg-[#F8F7F4] dark:bg-[#0A0F2E]/30' : 'border-gray-200 dark:border-gray-800'}`}
                      data-testid={`checkpoint-${checkpoint.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold">{checkpoint.checkpointName}</div>
                          <div className="text-xs text-muted-foreground">
                            {checkpoint.checkpointTiming} • {checkpoint.decisionAuthority}
                          </div>
                        </div>
                        {status === 'active' && (
                          <Badge variant="default" className="bg-[#2B8A6E]">
                            <Activity className="h-3 w-3 mr-1 animate-pulse" />NOW
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mb-3">{checkpoint.decisionQuestion}</p>
                      {status === 'active' && (
                        <div className="space-y-1">
                          {(checkpoint.decisionOptions as any[])?.map((option: any, idx: number) => (
                            <Button
                              key={idx}
                              variant={selectedDecisions[checkpoint.id] === option.label ? 'default' : 'outline'}
                              size="sm"
                              className="w-full justify-start text-left"
                              onClick={() => setSelectedDecisions({ ...selectedDecisions, [checkpoint.id]: option.label })}
                              data-testid={`decision-option-${checkpoint.id}-${idx}`}
                            >
                              <ChevronRight className="h-4 w-4 mr-2" />
                              {option.label}: {option.description}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Task Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Execution Timeline
              </CardTitle>
              <CardDescription>Minute-by-minute task sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {taskSequences.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No task sequences defined for this Readiness Protocol
                  </div>
                ) : (
                  taskSequences.map((task: any) => {
                    const match = task.timing?.match(/T\+(\d+):(\d+)/);
                    let taskSeconds = 0;
                    if (match) taskSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
                    const isActive = elapsedSeconds >= taskSeconds && elapsedSeconds < taskSeconds + 300;
                    const isCompleted = elapsedSeconds > taskSeconds + 300;

                    return (
                      <div
                        key={task.id}
                        className={`p-3 border ${isActive ? 'border-[#0A0F2E] bg-[#0A0F2E] dark:bg-[#0A0F2E]' : isCompleted ? 'border-gray-300 dark:border-gray-700 opacity-50' : 'border-gray-200 dark:border-gray-800'}`}
                        data-testid={`task-${task.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 page-background">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-muted-foreground">{task.timing}</span>
                              {isCompleted && <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />}
                              {isActive && <AlertTriangle className="h-4 w-4 text-[#0A0F2E] animate-pulse" />}
                            </div>
                            <div className="font-medium text-sm">{task.taskName}</div>
                            <div className="text-xs text-muted-foreground mt-1">Owner: {task.taskOwner}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complications Log */}
        {complications.length > 0 && (
          <Card style={{ borderColor: '#D97706' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#D97706' }}>
                <Zap className="h-5 w-5" />
                Complication Log
                <Badge style={{ background: '#D97706', color: '#fff', marginLeft: 4 }}>{complications.length}</Badge>
              </CardTitle>
              <CardDescription>Mid-drill complications injected during this exercise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complications.map(c => (
                  <div key={c.id} style={{ padding: '12px 16px', border: `1px solid ${severityColor(c.severity)}30`, borderLeft: `3px solid ${severityColor(c.severity)}`, borderRadius: '0.15rem', background: severityBg(c.severity) }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{c.title}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: severityColor(c.severity), background: `${severityColor(c.severity)}15`, padding: '2px 7px', borderRadius: '0.1rem' }}>{c.severity}</span>
                      </div>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>T+{c.minuteElapsed}:00</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{c.description}</div>
                    {c.selectedResponse && (
                      <div style={{ marginTop: 6, fontSize: 12, color: TEAL, fontWeight: 600 }}>
                        ✓ Response: {c.selectedResponse}
                      </div>
                    )}
                    {!c.selectedResponse && (
                      <div style={{ marginTop: 6, fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
                        ⚠ No formal response recorded
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Drill */}
        <Card className="border-2 border-[#2B8A6E] rounded-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[#0A0F2E]">Ready to complete drill?</h3>
                <p className="text-sm text-[#6B7280] font-light">
                  {complications.length > 0
                    ? `${complications.filter(c => c.selectedResponse).length}/${complications.length} complications responded to`
                    : 'Your performance will be recorded and analyzed'}
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleCompleteDrill}
                disabled={completeDrillMutation.isPending}
                className="bg-[#2B8A6E] hover:bg-[#256B56] rounded-none font-bold uppercase tracking-widest text-xs px-8"
                data-testid="button-complete-drill"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Drill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
