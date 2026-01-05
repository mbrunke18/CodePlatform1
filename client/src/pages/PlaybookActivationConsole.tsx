import StandardNav from '@/components/layout/StandardNav';
import { useEffect, useState } from "react";
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
  const [executionStartTime] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [executionStatus, setExecutionStatus] = useState<'active' | 'paused' | 'completed'>('active');
  const [executionId] = useState(`exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

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
  const { data: tasks = [] } = useQuery<any[]>({
    queryKey: [`/api/tasks?playbookId=${params?.playbookId}`],
    enabled: !!params?.playbookId,
  });

  // Countdown timer
  useEffect(() => {
    if (executionStatus !== 'active') return;
    
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((new Date().getTime() - executionStartTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [executionStartTime, executionStatus]);

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
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['/api/scenarios'], exact: false });
      queryClient.refetchQueries({ queryKey: ['/api/executive-triggers'], exact: false });
      setExecutionStatus('completed');
      toast({
        title: "✅ Playbook Execution Completed",
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
  const completedTasks = safeTasks.filter((t: any) => t.status === 'completed').length;
  const progressPercent = safeTasks.length > 0 ? (completedTasks / safeTasks.length) * 100 : 0;
  
  // Decision Velocity Metrics
  const targetTime = 12; // 12 minutes target
  const elapsedMinutes = elapsedSeconds / 60;
  const isOnTrack = elapsedMinutes <= targetTime;
  const industryStandard = 72 * 60; // 72 hours in minutes
  const timeSaved = industryStandard - elapsedMinutes;

  // For manual executions, only wait for playbook. For trigger-based, wait for both.
  if (!playbook || (!isManualExecution && !trigger)) {
    return <div className="p-6">Loading activation console...</div>;
  }

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              Execute Your Playbook
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Make the call. Rally your team. Win the moment.
            </p>
          </div>
          <Link href="/triggers-management">
            <Button variant="outline" data-testid="button-back-triggers">
              Back to Triggers
            </Button>
          </Link>
        </div>

        {/* Time Compression Banner - Shows benchmark comparison */}
        <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-blue-950/30 border-2 border-blue-400 dark:border-blue-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <strong>Industry Benchmark:</strong> Traditional coordination takes 72 hours on average.
                <strong className="ml-2">M Target:</strong> 12 minutes or less.
              </div>
              <div className="flex items-center gap-2 text-sm">
                {elapsedMinutes > 0 && (
                  <Badge variant={isOnTrack ? "default" : "secondary"} className={isOnTrack ? "bg-green-600" : "bg-yellow-600"}>
                    {isOnTrack ? '✅ On Track for 12 Min Target' : '⚠️ Exceeding 12 Min Target'}
                  </Badge>
                )}
                {elapsedMinutes === 0 && (
                  <Badge variant="outline">Execution will start when you begin</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execution Timer & Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-red-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Execution Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold" data-testid="text-execution-time">
                {formatTime(elapsedSeconds)}
              </div>
              <p className="text-xs mt-1 opacity-90">
                {executionStatus === 'active' ? 'In Progress' : executionStatus === 'paused' ? 'Paused' : 'Completed'}
              </p>
            </CardContent>
          </Card>

          <Card className={isOnTrack ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white'}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Target: 12 Minutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold" data-testid="text-target-status">
                {isOnTrack ? 'On Track' : 'Behind'}
              </div>
              <p className="text-xs mt-1 opacity-90">
                {Math.max(0, targetTime - elapsedMinutes).toFixed(1)} min remaining
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Decision Velocity Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              {elapsedMinutes > 0 ? (
                <>
                  <div className="text-4xl font-bold" data-testid="text-velocity-multiplier">
                    {(industryStandard / elapsedMinutes).toFixed(0)}x
                  </div>
                  <p className="text-xs mt-1 opacity-90">
                    faster than 72hr standard
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-velocity-target">
                    360x+
                  </div>
                  <p className="text-xs mt-1 opacity-90">
                    target vs 72hr standard
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Time Savings Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              {elapsedMinutes > 0 ? (
                <>
                  <div className="text-4xl font-bold" data-testid="text-time-saved">
                    {Math.floor(timeSaved / 60)}h
                  </div>
                  <p className="text-xs mt-1 opacity-90">
                    {(timeSaved % 60).toFixed(0)} min saved so far
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-time-saved-target">
                    ~72 Hours
                  </div>
                  <p className="text-xs mt-1 opacity-90">
                    target savings vs industry
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trigger & Playbook Info */}
        <div className={`grid grid-cols-1 ${isManualExecution ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
          {!isManualExecution && trigger && (
            <Card className="border-2 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Trigger Alert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Trigger Name</div>
                  <div className="font-semibold" data-testid="text-trigger-name">{trigger.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Description</div>
                  <div className="text-sm">{trigger.description}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Status</div>
                  <Badge variant={trigger?.currentStatus === 'red' ? 'destructive' : 'secondary'} data-testid="badge-trigger-status">
                    {(trigger?.currentStatus || 'active').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Severity</div>
                  <Badge variant={trigger.severity === 'high' || trigger.severity === 'critical' ? 'destructive' : 'default'}>
                    {trigger.severity}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-blue-600" />
                Active Playbook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Playbook Name</div>
                <div className="font-semibold" data-testid="text-playbook-name">{playbook.title || playbook.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Description</div>
                <div className="text-sm">{playbook.description}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Readiness</div>
                <Badge 
                  variant={playbook.readinessState === 'green' ? 'default' : playbook.readinessState === 'yellow' ? 'secondary' : 'destructive'}
                  data-testid="badge-playbook-readiness"
                >
                  {playbook.readinessState === 'green' ? '✓ Ready' : playbook.readinessState === 'yellow' ? '⚠ Needs Review' : '✗ Requires Setup'}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Execution</div>
                <div className="font-semibold">
                  {playbook.averageExecutionTime ? `${playbook.averageExecutionTime} minutes` : 'First execution'}
                </div>
              </div>
            </CardContent>
          </Card>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Execution Progress
              </span>
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {completedTasks} of {safeTasks.length} tasks completed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercent} className="h-3" data-testid="progress-execution" />
            
            <div className="space-y-3">
              {safeTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No tasks defined for this playbook
                </div>
              ) : (
                safeTasks.map((task: any, index: number) => (
                  <div 
                    key={task.id} 
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                      task.status === 'completed' 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                        : task.status === 'in_progress'
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                        : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                    data-testid={`task-item-${index}`}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 page-background">
                      <div className="font-semibold">{task.description}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-3">
                        {task.assignedTo && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Assigned to: {task.assignedTo}
                          </span>
                        )}
                        {task.estimatedHours && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Est: {task.estimatedHours}h
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in_progress' ? 'secondary' : 'outline'}>
                      {task.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Execution Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Execution Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Document key decisions, actions taken, or important observations during this execution..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full"
              data-testid="textarea-execution-notes"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-3">
            {executionStatus === 'active' ? (
              <Button 
                variant="outline" 
                onClick={() => setExecutionStatus('paused')}
                data-testid="button-pause-execution"
              >
                <PauseCircle className="h-4 w-4 mr-2" />
                Pause Execution
              </Button>
            ) : executionStatus === 'paused' ? (
              <Button 
                variant="outline" 
                onClick={() => setExecutionStatus('active')}
                data-testid="button-resume-execution"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Resume Execution
              </Button>
            ) : null}
          </div>

          <Button 
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            disabled={executionStatus === 'completed' || completeExecutionMutation.isPending}
            onClick={() => completeExecutionMutation.mutate()}
            data-testid="button-complete-execution"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            {completeExecutionMutation.isPending ? 'Completing...' : 'Complete Execution'}
          </Button>
        </div>

        {/* Success Message */}
        {executionStatus === 'completed' && (
          <>
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <Trophy className="h-16 w-16 mx-auto" />
                  <h2 className="text-3xl font-bold">Playbook Executed Successfully!</h2>
                  <p className="text-lg">
                    Completed in {formatTime(elapsedSeconds)} • {(industryStandard / Math.max(elapsedMinutes, 1)).toFixed(0)}x faster than industry standard
                  </p>
                  <p className="text-sm opacity-90">
                    You saved {Math.floor(timeSaved / 60)} hours and {(timeSaved % 60).toFixed(0)} minutes of coordination time
                  </p>
                </div>
              </CardContent>
            </Card>

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
  );
}
