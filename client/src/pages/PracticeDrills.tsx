import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Target, 
  Play, 
  Calendar, 
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  Activity
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PracticeDrills() {
  const { toast } = useToast();
  const [selectedDrill, setSelectedDrill] = useState<any>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [participants, setParticipants] = useState('');
  const [selectedPlaybookId, setSelectedPlaybookId] = useState('');

  // Fetch organizations
  const { data: organizations = [] } = useQuery<any[]>({ 
    queryKey: ['/api/organizations'] 
  });
  const organizationId = organizations[0]?.id;

  // Fetch playbooks for selection
  const { data: libraryData } = useQuery<any>({
    queryKey: ['/api/playbook-library'],
  });
  const playbooks = libraryData?.playbooks || [];

  // Fetch scheduled drills
  const { data: drills = [], isLoading: drillsLoading } = useQuery<any[]>({
    queryKey: ['/api/practice-drills', organizationId],
    enabled: !!organizationId,
  });

  // Fetch drill performance data
  const { data: performanceData } = useQuery<any>({
    queryKey: [`/api/practice-drills/performance`, organizationId],
    enabled: !!organizationId,
  });
  const performances = performanceData?.performances || [];
  const performanceSummary = performanceData?.summary || {
    totalDrills: 0,
    passedDrills: 0,
    passRate: 0,
    averageScore: 0,
    averageExecutionTime: 0,
    targetExecutionTime: 12
  };

  // Schedule drill mutation
  const scheduleDrillMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/practice-drills', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/practice-drills'] });
      toast({
        title: 'Drill Scheduled',
        description: 'Practice drill has been scheduled successfully',
      });
      setIsScheduling(false);
      setScheduledDate('');
      setParticipants('');
      setSelectedPlaybookId('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to schedule practice drill',
        variant: 'destructive',
      });
    },
  });

  // Start drill mutation
  const startDrillMutation = useMutation({
    mutationFn: async (drillId: string) => {
      return apiRequest('POST', `/api/practice-drills/${drillId}/start`, {});
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/practice-drills'] });
      toast({
        title: 'Drill Started',
        description: 'Live simulation is now running',
      });
      setSelectedDrill(data);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to start drill',
        variant: 'destructive',
      });
    },
  });

  // Complete drill mutation
  const completeDrillMutation = useMutation({
    mutationFn: async ({ drillId, data }: any) => {
      return apiRequest('POST', `/api/practice-drills/${drillId}/complete`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/practice-drills'] });
      queryClient.invalidateQueries({ queryKey: ['/api/practice-drills/performance'] });
      toast({
        title: 'Drill Completed',
        description: 'Performance data has been recorded',
      });
      setSelectedDrill(null);
    },
  });

  const handleScheduleDrill = () => {
    if (!selectedPlaybookId || !scheduledDate || !organizationId) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const participantsList = participants.split(',').map(p => p.trim()).filter(Boolean);

    scheduleDrillMutation.mutate({
      organizationId,
      playbookId: selectedPlaybookId,
      scheduledFor: new Date(scheduledDate).toISOString(),
      participants: participantsList,
    });
  };

  const handleCompleteDrill = (drillId: string, success: boolean) => {
    completeDrillMutation.mutate({
      drillId,
      data: {
        timeToComplete: Math.floor(Math.random() * 20) + 5, // Simulated time
        participantsFeedback: success ? 'excellent' : 'needs_improvement',
        bottlenecks: success ? [] : ['Communication delays', 'Resource allocation'],
        successRate: success ? 95 : 65,
      },
    });
  };

  if (drillsLoading) {
    return (
      <PageLayout>
        <div className="p-6">
          <div className="animate-pulse">Loading practice drills...</div>
        </div>
      </PageLayout>
    );
  }

  const upcomingDrills = drills.filter(d => d.status === 'scheduled');
  const completedDrills = drills.filter(d => d.status === 'completed');
  const activeDrills = drills.filter(d => d.status === 'in_progress');

  // Calculate aggregate stats
  const avgCompletionTime = performances.length > 0
    ? Math.round(performances.reduce((sum, p) => sum + (p.timeToComplete || 0), 0) / performances.length)
    : 0;

  const avgSuccessRate = performances.length > 0
    ? Math.round(performances.reduce((sum, p) => sum + (p.successRate || 0), 0) / performances.length)
    : 0;

  return (
    <PageLayout>
      <div className="p-6 space-y-6" data-testid="practice-drills-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="page-title">
              Strategic Simulations & War Games
            </h1>
            <p className="text-muted-foreground mt-1">
              Practice decision execution through scenario testing and executive simulations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setIsScheduling(!isScheduling)}
              data-testid="button-schedule-drill"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule New Drill
            </Button>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-total-drills">
                    {drills.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Total Drills</div>
                </div>
                <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-completion-time">
                    {avgCompletionTime}m
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Avg. Completion</div>
                </div>
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-success-rate">
                    {avgSuccessRate}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Success Rate</div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-upcoming">
                    {upcomingDrills.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Upcoming</div>
                </div>
                <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule New Drill */}
        {isScheduling && (
          <Card className="border-2 border-[#0A1F44] dark:border-[#D4AF37]">
            <CardHeader>
              <CardTitle>Schedule Practice Drill</CardTitle>
              <CardDescription>Set up a new fire drill simulation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="playbook">Select Playbook</Label>
                  <Select value={selectedPlaybookId} onValueChange={setSelectedPlaybookId}>
                    <SelectTrigger id="playbook" data-testid="select-playbook">
                      <SelectValue placeholder="Choose a playbook..." />
                    </SelectTrigger>
                    <SelectContent>
                      {playbooks.map((playbook: any) => (
                        <SelectItem key={playbook.id} value={playbook.id}>
                          {playbook.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Scheduled Date & Time</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    data-testid="input-date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">Participants (comma-separated emails)</Label>
                <Input
                  id="participants"
                  placeholder="john@company.com, jane@company.com"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  data-testid="input-participants"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleScheduleDrill}
                  disabled={scheduleDrillMutation.isPending}
                  data-testid="button-confirm-schedule"
                >
                  {scheduleDrillMutation.isPending ? 'Scheduling...' : 'Schedule Drill'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsScheduling(false)}
                  data-testid="button-cancel-schedule"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different drill views */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming" data-testid="tab-upcoming">
              Upcoming ({upcomingDrills.length})
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active">
              Active ({activeDrills.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed ({completedDrills.length})
            </TabsTrigger>
            <TabsTrigger value="performance" data-testid="tab-performance">
              Performance Reports
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Drills */}
          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingDrills.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No upcoming drills</p>
                    <p className="text-sm mt-1">Schedule your first practice drill</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              upcomingDrills.map((drill: any) => {
                const playbook = playbooks.find((p: any) => p.id === drill.playbookId);
                return (
                  <Card key={drill.id} data-testid={`card-drill-${drill.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-drill-title-${drill.id}`}>
                            {playbook?.title || 'Unknown Playbook'}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              {new Date(drill.scheduledFor).toLocaleString()}
                            </div>
                          </CardDescription>
                        </div>
                        <Badge variant="outline" data-testid={`badge-status-${drill.id}`}>
                          {drill.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <Users className="h-4 w-4 inline mr-1" />
                          {drill.participants?.length || 0} participants
                        </div>
                        <Button
                          onClick={() => startDrillMutation.mutate(drill.id)}
                          disabled={startDrillMutation.isPending}
                          data-testid={`button-start-${drill.id}`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Active Drills */}
          <TabsContent value="active" className="space-y-4 mt-6">
            {activeDrills.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No active drills</p>
                    <p className="text-sm mt-1">Start an upcoming drill to see it here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              activeDrills.map((drill: any) => {
                const playbook = playbooks.find((p: any) => p.id === drill.playbookId);
                return (
                  <Card key={drill.id} className="border-2 border-green-500" data-testid={`card-active-drill-${drill.id}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600 animate-pulse" />
                        {playbook?.title || 'Unknown Playbook'} - LIVE
                      </CardTitle>
                      <CardDescription>Simulation in progress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Started: {drill.startedAt ? new Date(drill.startedAt).toLocaleString() : 'N/A'}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCompleteDrill(drill.id, true)}
                          disabled={completeDrillMutation.isPending}
                          data-testid={`button-complete-success-${drill.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Successfully
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleCompleteDrill(drill.id, false)}
                          disabled={completeDrillMutation.isPending}
                          data-testid={`button-complete-issues-${drill.id}`}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Complete with Issues
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Completed Drills */}
          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedDrills.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No completed drills</p>
                    <p className="text-sm mt-1">Complete your first drill to see results</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              completedDrills.map((drill: any) => {
                const playbook = playbooks.find((p: any) => p.id === drill.playbookId);
                const performance = performances.find(p => p.drillId === drill.id);
                
                return (
                  <Card key={drill.id} data-testid={`card-completed-drill-${drill.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {playbook?.title || 'Unknown Playbook'}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Completed: {drill.completedAt ? new Date(drill.completedAt).toLocaleDateString() : 'N/A'}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" data-testid={`badge-completed-${drill.id}`}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    {performance && (
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Time</div>
                            <div className="font-medium" data-testid={`text-time-${drill.id}`}>
                              {performance.timeToComplete}m
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Success Rate</div>
                            <div className="font-medium" data-testid={`text-success-${drill.id}`}>
                              {performance.successRate}%
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Bottlenecks</div>
                            <div className="font-medium" data-testid={`text-bottlenecks-${drill.id}`}>
                              {performance.bottlenecks?.length || 0}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Performance Reports */}
          <TabsContent value="performance" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Drill execution trends and improvement areas</CardDescription>
              </CardHeader>
              <CardContent>
                {performances.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No performance data yet</p>
                    <p className="text-sm mt-1">Complete drills to see analytics</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Common Bottlenecks</h4>
                        <div className="space-y-1">
                          {Array.from(new Set(
                            performances.flatMap(p => p.bottlenecks || [])
                          )).slice(0, 5).map((bottleneck, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span>{bottleneck}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Performance Metrics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Best Time:</span>
                            <span className="font-medium">
                              {Math.min(...performances.map(p => p.timeToComplete || 999))}m
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Best Success Rate:</span>
                            <span className="font-medium">
                              {Math.max(...performances.map(p => p.successRate || 0))}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Drills:</span>
                            <span className="font-medium">{performances.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
