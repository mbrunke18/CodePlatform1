import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  FileText, 
  DollarSign,
  ExternalLink,
  Activity,
  Timer,
  Loader2
} from "lucide-react";
import { PreFlightChecklist } from "./PreFlightChecklist";
import { ActivationButton } from "./ActivationButton";

interface ExecutionStatus {
  instance: {
    id: string;
    status: string;
    currentPhase: string;
    startedAt: string;
    completedAt?: string;
    actualExecutionTime?: number;
  };
  events: Array<{
    id: string;
    eventType: string;
    eventData: any;
    success: boolean;
    durationMs: number;
    createdAt: string;
  }>;
  stakeholderAcks: Array<{
    id: string;
    stakeholderId: string;
    userId: string;
    acknowledgedAt?: string;
    notificationChannel: string;
  }>;
  documents: Array<{
    id: string;
    documentName: string;
    documentType: string;
    format: string;
    createdAt: string;
  }>;
  projectSync: {
    platform: string;
    externalProjectKey: string;
    externalProjectUrl: string;
    tasksCreated: number;
    syncStatus: string;
  } | null;
  budgets: Array<{
    id: string;
    budgetCategory: string;
    preApprovedAmount: string;
    currency: string;
    status: string;
    unlockedAt: string;
  }>;
}

interface ExecutionCommandCenterProps {
  executionInstanceId?: string;
  executionPlanId?: string;
  organizationId: string;
  scenarioId?: string | null;
  playbookId: string;
  playbookName: string;
  userId?: string;
  syncPlatform?: 'jira' | 'asana' | 'monday' | 'ms_project' | 'servicenow';
}

function CountdownTimer({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ minutes: 0, seconds: 0 });
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft({ minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  const progressPercent = isExpired ? 100 : Math.max(0, 100 - ((timeLeft.minutes * 60 + timeLeft.seconds) / 720) * 100);

  return (
    <div className="space-y-2" data-testid="countdown-timer">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Time Remaining</span>
        <span className={`text-2xl font-mono font-bold ${isExpired ? 'text-red-500' : timeLeft.minutes < 2 ? 'text-orange-500' : 'text-green-500'}`}>
          {isExpired ? "EXPIRED" : `${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`}
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <div className="text-xs text-muted-foreground text-right">
        12-minute execution window
      </div>
    </div>
  );
}

export function ExecutionCommandCenter({
  executionInstanceId,
  executionPlanId,
  organizationId,
  scenarioId,
  playbookId,
  playbookName,
  userId,
  syncPlatform,
}: ExecutionCommandCenterProps) {
  const [activeInstanceId, setActiveInstanceId] = useState(executionInstanceId);
  const [canActivate, setCanActivate] = useState(true);
  const [readinessScore, setReadinessScore] = useState(100);
  const [deadline, setDeadline] = useState<Date | null>(null);

  const { data: status, isLoading } = useQuery<ExecutionStatus>({
    queryKey: ['/api/execution/status', activeInstanceId],
    enabled: !!activeInstanceId,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (status?.instance?.startedAt) {
      const startTime = new Date(status.instance.startedAt);
      const deadlineTime = new Date(startTime.getTime() + 12 * 60 * 1000);
      setDeadline(deadlineTime);
    }
  }, [status?.instance?.startedAt]);

  const handleReadyChange = (ready: boolean, score: number) => {
    setCanActivate(ready);
    setReadinessScore(score);
  };

  const handleActivationComplete = (result: any) => {
    if (result.executionInstanceId) {
      setActiveInstanceId(result.executionInstanceId);
      if (result.deadline) {
        setDeadline(new Date(result.deadline));
      }
    }
  };

  const totalAcks = status?.stakeholderAcks?.length || 0;
  const completedAcks = status?.stakeholderAcks?.filter(a => a.acknowledgedAt)?.length || 0;
  const totalBudget = status?.budgets?.reduce((sum, b) => sum + parseFloat(b.preApprovedAmount || '0'), 0) || 0;

  return (
    <div className="space-y-6" data-testid="execution-command-center">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Command Center
          </h2>
          <p className="text-muted-foreground">{playbookName}</p>
        </div>
        {!activeInstanceId && executionPlanId && (
          <ActivationButton
            organizationId={organizationId}
            scenarioId={scenarioId}
            executionPlanId={executionPlanId}
            playbookId={playbookId}
            playbookName={playbookName}
            userId={userId}
            syncPlatform={syncPlatform}
            canActivate={canActivate}
            readinessScore={readinessScore}
            onActivationComplete={handleActivationComplete}
          />
        )}
      </div>

      {!activeInstanceId && executionPlanId && (
        <PreFlightChecklist
          executionPlanId={executionPlanId}
          organizationId={organizationId}
          onReadyChange={handleReadyChange}
        />
      )}

      {!activeInstanceId && !executionPlanId && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <Clock className="h-5 w-5" />
              Ready for One-Click Activation
            </CardTitle>
            <CardDescription>
              When triggered, M will execute this playbook in under 12 minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Auto-generate documents</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Notify all stakeholders</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span>Create Jira/Asana project</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Unlock pre-approved budgets</span>
              </div>
            </div>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-orange-500 mb-2">
                72 hrs → 12 min
              </div>
              <p className="text-sm text-muted-foreground">
                M eliminates the planning phase entirely
              </p>
            </div>
            <ActivationButton
              organizationId={organizationId}
              scenarioId={scenarioId}
              executionPlanId={playbookId}
              playbookId={playbookId}
              playbookName={playbookName}
              userId={userId}
              syncPlatform={syncPlatform}
              canActivate={true}
              readinessScore={100}
              onActivationComplete={handleActivationComplete}
            />
          </CardContent>
        </Card>
      )}

      {activeInstanceId && (
        <>
          {deadline && (
            <Card data-testid="deadline-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Execution Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CountdownTimer deadline={deadline} />
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <Card>
              <CardContent className="py-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : status ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="stakeholders" data-testid="tab-stakeholders">
                  Stakeholders
                  <Badge variant="secondary" className="ml-2">{completedAcks}/{totalAcks}</Badge>
                </TabsTrigger>
                <TabsTrigger value="documents" data-testid="tab-documents">
                  Documents
                  <Badge variant="secondary" className="ml-2">{status.documents?.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card data-testid="status-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        {status.instance.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : status.instance.status === 'failed' ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
                        )}
                        <span className="text-xl font-semibold capitalize">
                          {status.instance.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Phase: {status.instance.currentPhase || 'N/A'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card data-testid="stakeholders-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Stakeholders Acknowledged</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xl font-semibold">
                          {completedAcks} / {totalAcks}
                        </span>
                      </div>
                      <Progress value={totalAcks > 0 ? (completedAcks / totalAcks) * 100 : 0} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card data-testid="documents-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Documents Generated</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xl font-semibold">
                          {status.documents?.length || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="budget-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Budget Unlocked</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xl font-semibold">
                          ${totalBudget.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {status.projectSync && (
                  <Card className="mt-4" data-testid="project-sync-card">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ExternalLink className="h-5 w-5" />
                        External Project
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">{status.projectSync.platform}</p>
                          <p className="text-sm text-muted-foreground">
                            {status.projectSync.tasksCreated} tasks synced
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={status.projectSync.externalProjectUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            data-testid="link-external-project"
                          >
                            Open in {status.projectSync.platform}
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="stakeholders">
                <Card>
                  <CardHeader>
                    <CardTitle>Stakeholder Acknowledgments</CardTitle>
                    <CardDescription>
                      Track who has acknowledged the activation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {status.stakeholderAcks?.map((ack, idx) => (
                          <div 
                            key={ack.id} 
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            data-testid={`stakeholder-ack-${idx}`}
                          >
                            <div className="flex items-center gap-3">
                              {ack.acknowledgedAt ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-500" />
                              )}
                              <div>
                                <p className="font-medium">Stakeholder #{ack.stakeholderId?.slice(-4) || idx + 1}</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                  via {ack.notificationChannel?.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            <Badge variant={ack.acknowledgedAt ? "default" : "secondary"}>
                              {ack.acknowledgedAt ? "Acknowledged" : "Pending"}
                            </Badge>
                          </div>
                        ))}
                        {(!status.stakeholderAcks || status.stakeholderAcks.length === 0) && (
                          <p className="text-center text-muted-foreground py-4">
                            No stakeholders to notify
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Documents</CardTitle>
                    <CardDescription>
                      Documents created during activation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {status.documents?.map((doc, idx) => (
                        <div 
                          key={doc.id} 
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          data-testid={`document-item-${idx}`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.documentName}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {doc.documentType} • {doc.format}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" data-testid={`button-view-doc-${idx}`}>
                            View
                          </Button>
                        </div>
                      ))}
                      {(!status.documents || status.documents.length === 0) && (
                        <p className="text-center text-muted-foreground py-4">
                          No documents generated yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Activation Events</CardTitle>
                    <CardDescription>
                      Timeline of activation events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {status.events?.map((event, idx) => (
                          <div 
                            key={event.id} 
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                            data-testid={`event-item-${idx}`}
                          >
                            {event.success ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium capitalize">
                                  {event.eventType?.replace(/_/g, ' ')}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {event.durationMs}ms
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(event.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {(!status.events || status.events.length === 0) && (
                          <p className="text-center text-muted-foreground py-4">
                            No events recorded yet
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : null}
        </>
      )}
    </div>
  );
}
