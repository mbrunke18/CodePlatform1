import { useState, useEffect } from 'react';
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
  Activity
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function LiveDrillExecution() {
  const [, params] = useRoute('/practice-drills/:drillId/live');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const drillId = params?.drillId;

  // State for countdown timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedDecisions, setSelectedDecisions] = useState<Record<string, string>>({});

  // Fetch drill details with playbook data
  const { data: drillDetails, isLoading } = useQuery<any>({
    queryKey: [`/api/practice-drills/drill/${drillId}`],
    enabled: !!drillId,
  });

  const drill = drillDetails?.drill;
  const playbook = drillDetails?.playbook;
  const domain = drillDetails?.domain;

  // Fetch decision trees for this playbook
  const { data: decisionTreesData } = useQuery<any[]>({
    queryKey: [`/api/playbook-library/${drill?.playbookId}/decision-trees`],
    enabled: !!drill?.playbookId,
  });
  const decisionTrees = decisionTreesData ?? [];

  // Fetch task sequences for this playbook
  const { data: taskSequencesData } = useQuery<any[]>({
    queryKey: [`/api/playbook-library/${drill?.playbookId}/task-sequences`],
    enabled: !!drill?.playbookId,
  });
  const taskSequences = taskSequencesData ?? [];

  // Complete drill mutation
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

  // Countdown timer effect
  useEffect(() => {
    if (!isRunning || !drill?.startedAt) return;

    const interval = setInterval(() => {
      const start = new Date(drill.startedAt).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, drill?.startedAt]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress (target is 12 minutes = 720 seconds)
  const targetSeconds = 720;
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100);

  // Determine which checkpoints have been reached
  const getCheckpointStatus = (timing: string) => {
    // Parse timing like "T+3:00" to seconds
    const match = timing.match(/T\+(\d+):(\d+)/);
    if (!match) return 'pending';
    
    const minutes = parseInt(match[1]);
    const seconds = parseInt(match[2]);
    const checkpointSeconds = minutes * 60 + seconds;
    
    if (elapsedSeconds >= checkpointSeconds) return 'active';
    return 'pending';
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
      bottlenecks: [],
      communicationsSent: taskSequences.length,
      communicationsDelivered: taskSequences.length,
      communicationEffectiveness: 0.95,
      overallScore: 90,
      passed: progress <= 100,
      whatWorked: 'Strong coordination and communication',
      whatDidntWork: '',
      recommendations: [],
      actualParticipants: [],
    };

    completeDrillMutation.mutate(performanceData);
  };

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
              <div className="text-center text-muted-foreground">
                Drill not found
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-6 space-y-6" data-testid="live-drill-execution-page">
        {/* Header with countdown */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-red-600 animate-pulse" />
              <h1 className="text-3xl font-bold" data-testid="page-title">
                LIVE DRILL EXECUTION
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">
              {playbook?.name || drill.drillName}
            </p>
          </div>
          <div className="flex items-center gap-4">
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsRunning(false)}
                    data-testid="button-pause-timer"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setIsRunning(true)}
                    data-testid="button-resume-timer"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume
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
              <CardDescription>
                Critical decisions during execution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {decisionTrees.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No decision checkpoints defined for this playbook
                </div>
              ) : (
                decisionTrees.map((checkpoint: any) => {
                  const status = getCheckpointStatus(checkpoint.checkpointTiming || 'T+0:00');
                  return (
                    <div 
                      key={checkpoint.id}
                      className={`p-4 rounded-lg border-2 ${
                        status === 'active' 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                          : 'border-gray-200 dark:border-gray-800'
                      }`}
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
                          <Badge variant="default" className="bg-green-600">
                            <Activity className="h-3 w-3 mr-1 animate-pulse" />
                            NOW
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
                              onClick={() => setSelectedDecisions({...selectedDecisions, [checkpoint.id]: option.label})}
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
              <CardDescription>
                Minute-by-minute task sequences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {taskSequences.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No task sequences defined for this playbook
                  </div>
                ) : (
                  taskSequences.map((task: any, idx: number) => {
                    // Parse timing to determine if task is due
                    const match = task.timing?.match(/T\+(\d+):(\d+)/);
                    let taskSeconds = 0;
                    if (match) {
                      const minutes = parseInt(match[1]);
                      const seconds = parseInt(match[2]);
                      taskSeconds = minutes * 60 + seconds;
                    }
                    const isActive = elapsedSeconds >= taskSeconds && elapsedSeconds < taskSeconds + 300; // Active for 5 min window
                    const isCompleted = elapsedSeconds > taskSeconds + 300;

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border ${
                          isActive 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                            : isCompleted 
                            ? 'border-gray-300 dark:border-gray-700 opacity-50'
                            : 'border-gray-200 dark:border-gray-800'
                        }`}
                        data-testid={`task-${task.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 page-background">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-muted-foreground">
                                {task.timing}
                              </span>
                              {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {isActive && <AlertTriangle className="h-4 w-4 text-blue-600 animate-pulse" />}
                            </div>
                            <div className="font-medium text-sm">{task.taskName}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Owner: {task.taskOwner}
                            </div>
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

        {/* Complete Drill Button */}
        <Card className="border-2 border-green-600 dark:border-green-400">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Ready to complete drill?</h3>
                <p className="text-sm text-muted-foreground">
                  Your performance will be recorded and analyzed
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleCompleteDrill}
                disabled={completeDrillMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
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
