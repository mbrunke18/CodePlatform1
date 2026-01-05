import { useState } from 'react';
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
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { PhaseProgressBar } from '@/components/playbook/PhaseProgressBar';
import { PreparePhaseView } from '@/components/playbook/PreparePhaseView';
import { MonitorPhaseView } from '@/components/playbook/MonitorPhaseView';
import { LearnPhaseView } from '@/components/playbook/LearnPhaseView';
import { AIPrinciplesScorecard, DeterministicExecutionBadge } from '@/components/ai/AIPrinciplesScorecard';
import { ExecutionCommandCenter } from '@/components/execution/ExecutionCommandCenter';

const SEVERITY_COLORS = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  low: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
};

export default function PlaybookDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const { data: organizations = [] } = useQuery<any[]>({
    queryKey: ['/api/organizations'],
  });
  const organizationId = organizations[0]?.id;

  const { data: playbookData, isLoading } = useQuery<any>({
    queryKey: ['/api/playbook-library', id],
    queryFn: async () => {
      const response = await fetch(`/api/playbook-library/${id}`);
      if (!response.ok) throw new Error('Failed to fetch playbook');
      return response.json();
    },
    enabled: !!id,
  });
  
  const playbook = playbookData?.playbook;

  const { data: readiness } = useQuery<any>({
    queryKey: ['/api/playbook-library', id, 'readiness', { organizationId }],
    queryFn: async () => {
      const response = await fetch(
        `/api/playbook-library/${id}/readiness?organizationId=${organizationId}`
      );
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!id && !!organizationId,
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
    enabled: !!organizationId,
  });

  const activatePlaybookMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/playbook-library/${id}/activate`, {
        scenarioId: `scenario-${Date.now()}`,
      });
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: 'Playbook Activated',
        description: `12-minute execution window initiated. ${result.stakeholders} stakeholders notified.`,
      });
      setLocation('/command-center');
    },
    onError: (error) => {
      toast({
        title: 'Activation Failed',
        description: error instanceof Error ? error.message : 'Unable to activate playbook',
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
        drillName: `Practice Drill: ${playbook?.name || 'Playbook'}`,
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

  const overallScore = readiness?.overallScore ?? 0;
  const canActivate = overallScore >= 50;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto p-6 animate-pulse">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </PageLayout>
    );
  }

  if (!playbook) {
    return (
      <PageLayout>
        <div className="container mx-auto p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
          <h2 className="text-xl font-semibold mb-2">Playbook Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested playbook could not be found.
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
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6" data-testid="playbook-detail-page">
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <Button variant="ghost" size="sm" asChild data-testid="button-back">
            <Link href="/playbook-library">
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back to Library</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">#{playbook.playbookNumber}</Badge>
                      {playbook.primaryExecutiveRole && (
                        <Badge>{playbook.primaryExecutiveRole}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg sm:text-2xl" data-testid="text-playbook-title">
                      {playbook.name}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {playbook.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 text-blue-500" />
                    <div className="text-sm sm:text-base font-semibold">{playbook.timeSensitivity || 12}h</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Response</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 text-orange-500" />
                    <div className="text-sm sm:text-base font-semibold">{playbook.severityScore || 75}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Severity</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 text-purple-500" />
                    <div className="text-sm sm:text-base font-semibold">
                      {(playbook.tier1Count || 0) + (playbook.tier2Count || 0)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Teams</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 text-green-500" />
                    <div className="text-sm sm:text-base font-semibold">{playbook.historicalFrequency || 'N/A'}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Frequency</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5" data-testid="phase-tabs">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="identify" className="flex items-center gap-1">
                  <span className="text-blue-500 font-bold">I</span>
                  <span className="hidden sm:inline">Identify</span>
                </TabsTrigger>
                <TabsTrigger value="detect" className="flex items-center gap-1">
                  <span className="text-amber-500 font-bold">D</span>
                  <span className="hidden sm:inline">Detect</span>
                </TabsTrigger>
                <TabsTrigger value="execute" className="flex items-center gap-1">
                  <span className="text-green-500 font-bold">E</span>
                  <span className="hidden sm:inline">Execute</span>
                </TabsTrigger>
                <TabsTrigger value="advance" className="flex items-center gap-1">
                  <span className="text-purple-500 font-bold">A</span>
                  <span className="hidden sm:inline">Advance</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trigger Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{playbook.triggerCriteria}</p>
                  </CardContent>
                </Card>

                {playbook.tier1Stakeholders && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Stakeholders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Tier 1 - Decision Makers</h4>
                        <div className="flex flex-wrap gap-2">
                          {(typeof playbook.tier1Stakeholders === 'object'
                            ? Object.values(playbook.tier1Stakeholders)
                            : [playbook.tier1Stakeholders]
                          ).map((s: any, i: number) => (
                            <Badge key={i} variant="secondary">
                              {typeof s === 'string' ? s : s?.role || 'Unknown'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {playbook.tier2Stakeholders && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Tier 2 - Execution Team</h4>
                          <div className="flex flex-wrap gap-2">
                            {(typeof playbook.tier2Stakeholders === 'object'
                              ? Object.values(playbook.tier2Stakeholders)
                              : [playbook.tier2Stakeholders]
                            ).map((s: any, i: number) => (
                              <Badge key={i} variant="outline">
                                {typeof s === 'string' ? s : s?.role || 'Unknown'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="identify" className="mt-6">
                {organizationId ? (
                  <PreparePhaseView
                    playbookId={id!}
                    organizationId={organizationId}
                    isEditable={true}
                  />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">Loading organization...</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="detect" className="mt-6">
                {organizationId ? (
                  <MonitorPhaseView
                    playbookId={id!}
                    organizationId={organizationId}
                    isEditable={true}
                  />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">Loading organization...</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="execute" className="mt-6">
                {organizationId && id ? (
                  <ExecutionCommandCenter
                    organizationId={organizationId}
                    scenarioId={playbookData?.scenario?.id || null}
                    executionPlanId={playbookData?.executionPlan?.id || id}
                    playbookId={id}
                    playbookName={playbook?.name || 'Playbook'}
                    userId={users[0]?.id}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-500" />
                        EXECUTE Phase
                      </CardTitle>
                      <CardDescription>
                        12-minute coordinated response window
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          When Activated
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            Auto-creates Jira project with all tasks
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            Assigns all stakeholders to their roles
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            Stages all pre-approved documents
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            Unlocks pre-approved budgets
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            Notifies all stakeholders via preferred channels
                          </li>
                        </ul>
                      </div>

                      <div className="text-center py-6">
                        <div className="text-4xl font-bold text-orange-500 mb-2">
                          72 hrs → 12 min
                        </div>
                        <p className="text-sm text-muted-foreground">
                          M eliminates the planning phase entirely
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="advance" className="mt-6">
                {organizationId ? (
                  <LearnPhaseView
                    playbookId={id!}
                    organizationId={organizationId}
                    isEditable={true}
                  />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">Loading organization...</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Playbook Readiness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div
                    className={`text-5xl font-bold mb-2 ${
                      overallScore >= 80
                        ? 'text-green-500'
                        : overallScore >= 50
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}
                    data-testid="overall-readiness-score"
                  >
                    {overallScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {overallScore >= 80
                      ? 'Ready for activation'
                      : overallScore >= 50
                      ? 'Minimum readiness met'
                      : 'Below minimum threshold'}
                  </p>
                </div>

                <PhaseProgressBar
                  prepareScore={readiness?.prepareScore ?? 0}
                  monitorScore={readiness?.monitorScore ?? 0}
                  executeScore={readiness?.executeScore ?? 0}
                  learnScore={readiness?.learnScore ?? 0}
                />

                <div className="space-y-3 pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={!canActivate || activatePlaybookMutation.isPending}
                        data-testid="button-activate"
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        {activatePlaybookMutation.isPending
                          ? 'Activating...'
                          : 'Activate Playbook'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Activate Playbook?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will initiate the 12-minute execution window. All stakeholders will
                          be notified, tasks will be created, and budgets will be unlocked. This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => activatePlaybookMutation.mutate()}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Yes, Activate Now
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {!canActivate && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="text-amber-700 dark:text-amber-300">
                        Readiness must be at least 50% to activate
                      </span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => startDrillMutation.mutate()}
                    disabled={startDrillMutation.isPending}
                    data-testid="button-run-drill"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {startDrillMutation.isPending ? 'Starting...' : 'Run Practice Drill'}
                  </Button>

                  <Button variant="ghost" className="w-full" asChild>
                    <Link href={`/playbook-library/${id}/settings`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {readiness && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Readiness Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Stakeholders Assigned</span>
                    <span className="font-medium">
                      {readiness.stakeholdersAssigned || 0}/{readiness.stakeholdersTotal || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Documents Ready</span>
                    <span className="font-medium">
                      {readiness.documentsReady || 0}/{readiness.documentsTotal || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Resources Staged</span>
                    <span className="font-medium">
                      {readiness.resourcesStaged || 0}/{readiness.resourcesTotal || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Triggers Active</span>
                    <span className="font-medium">
                      {readiness.triggersActive || 0}/{readiness.triggersConfigured || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Learn Items</span>
                    <span className="font-medium">
                      {readiness.learnItemsConfigured || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {(playbook?.playbookNumber >= 163 && playbook?.playbookNumber <= 180) && (
              <AIPrinciplesScorecard compact={false} />
            )}

            <Card className="p-4">
              <DeterministicExecutionBadge />
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
