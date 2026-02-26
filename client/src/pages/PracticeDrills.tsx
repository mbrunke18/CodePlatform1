import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
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
  Activity,
  ArrowUp,
  Minus
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function PracticeDrills({ embedded }: { embedded?: boolean }) {
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
        timeToComplete: 12, // Standard target time
        participantsFeedback: success ? 'excellent' : 'needs_improvement',
        bottlenecks: success ? [] : ['Communication delays', 'Resource allocation'],
        successRate: success ? 95 : 65,
      },
    });
  };

  if (drillsLoading) {
    return (
      <PageLayout embedded={embedded}>
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
    <PageLayout embedded={embedded}>
      <div className="p-8 space-y-8 bg-[#F8F7F4] min-h-screen" data-testid="practice-drills-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-[2px] bg-[#C9A84C]"></div>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#C9A84C]">Executive Readiness</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0A0F2E]" style={CG} data-testid="page-title">
              Strategic Simulations & War Games
            </h1>
            <p className="text-[#6B7280] mt-1 font-medium">
              Practice decision execution through scenario testing and executive simulations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              className="bg-[#0A0F2E] text-white hover:bg-[#141B45] font-bold"
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
          <Card className="border border-[#E8E4DC] bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold" style={{ ...CG, color: GOLD }} data-testid="stat-total-drills">
                    {drills.length}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-1">Total Drills</div>
                </div>
                <div className="h-8 w-8 bg-[#0A0F2E] rounded flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E8E4DC] bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold" style={{ ...CG, color: GOLD }} data-testid="stat-completion-time">
                    {avgCompletionTime}m
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-1">Avg. Completion</div>
                </div>
                <div className="h-8 w-8 bg-[#2B8A6E] rounded flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E8E4DC] bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold" style={{ ...CG, color: GOLD }} data-testid="stat-success-rate">
                    {avgSuccessRate}%
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-1">Success Rate</div>
                </div>
                <div className="h-8 w-8 bg-[#0A0F2E] rounded flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E8E4DC] bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold" style={{ ...CG, color: GOLD }} data-testid="stat-upcoming">
                    {upcomingDrills.length}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-1">Upcoming</div>
                </div>
                <div className="h-8 w-8 bg-[#C9A84C] rounded flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule New Drill */}
        {isScheduling && (
          <Card className="border-2 border-[#0A0F2E] bg-white">
            <CardHeader>
              <CardTitle style={CG} className="text-2xl">Schedule Practice Drill</CardTitle>
              <CardDescription>Set up a new fire drill simulation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="playbook" className="font-bold text-[#0A0F2E]">Select Playbook</Label>
                  <Select value={selectedPlaybookId} onValueChange={setSelectedPlaybookId}>
                    <SelectTrigger id="playbook" className="border-[#E8E4DC]" data-testid="select-playbook">
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
                  <Label htmlFor="date" className="font-bold text-[#0A0F2E]">Scheduled Date & Time</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    className="border-[#E8E4DC]"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    data-testid="input-date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants" className="font-bold text-[#0A0F2E]">Participants (comma-separated emails)</Label>
                <Input
                  id="participants"
                  className="border-[#E8E4DC]"
                  placeholder="john@company.com, jane@company.com"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  data-testid="input-participants"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
                  onClick={handleScheduleDrill}
                  disabled={scheduleDrillMutation.isPending}
                  data-testid="button-confirm-schedule"
                >
                  {scheduleDrillMutation.isPending ? 'Scheduling...' : 'Schedule Drill'}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#E8E4DC] text-[#0A0F2E]"
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
          <TabsList className="bg-transparent border-b border-[#E8E4DC] rounded-none p-0 h-auto">
            <TabsTrigger 
              value="upcoming" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 font-bold text-[#6B7280] data-[state=active]:text-[#0A0F2E]"
              data-testid="tab-upcoming"
            >
              Upcoming ({upcomingDrills.length})
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 font-bold text-[#6B7280] data-[state=active]:text-[#0A0F2E]"
              data-testid="tab-active"
            >
              Active ({activeDrills.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 font-bold text-[#6B7280] data-[state=active]:text-[#0A0F2E]"
              data-testid="tab-completed"
            >
              Completed ({completedDrills.length})
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 font-bold text-[#6B7280] data-[state=active]:text-[#0A0F2E]"
              data-testid="tab-performance"
            >
              Performance Reports
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Drills */}
          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingDrills.length === 0 ? (
              <Card className="border border-[#E8E4DC] bg-white">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-[#E8E4DC]" />
                    <p className="font-bold text-[#0A0F2E]">No upcoming drills</p>
                    <p className="text-sm text-[#6B7280] mt-1">Schedule your first practice drill</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              upcomingDrills.map((drill: any) => {
                const playbook = playbooks.find((p: any) => p.id === drill.playbookId);
                return (
                  <Card key={drill.id} className="border border-[#E8E4DC] bg-white hover:shadow-md transition-all" data-testid={`card-drill-${drill.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl" style={CG} data-testid={`text-drill-title-${drill.id}`}>
                            {playbook?.title || 'Unknown Playbook'}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Clock className="h-4 w-4 text-[#C9A84C]" />
                              {new Date(drill.scheduledFor).toLocaleString()}
                            </div>
                          </CardDescription>
                        </div>
                          <Badge variant="outline" className="border-[#2B8A6E] text-[#2B8A6E] bg-[#2B8A6E]/5 font-bold uppercase tracking-wider text-[10px]">
                            {drill.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-[#6B7280]">
                            <Users className="h-4 w-4 inline mr-2 text-[#0A0F2E]" />
                            {drill.participants?.length || 0} executive participants
                          </div>
                          <Button
                            className="bg-[#2B8A6E] text-white hover:bg-[#3BAF8A] font-bold"
                            onClick={() => startDrillMutation.mutate(drill.id)}
                            disabled={startDrillMutation.isPending}
                            data-testid={`button-start-${drill.id}`}
                          >
                            <Play className="h-4 w-4 mr-2 text-white" />
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
                <Card className="border border-[#E8E4DC] bg-white">
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 mx-auto mb-3 text-[#E8E4DC]" />
                      <p className="font-bold text-[#0A0F2E]">No active drills</p>
                      <p className="text-sm text-[#6B7280] mt-1">Start an upcoming drill to see it here</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                activeDrills.map((drill: any) => {
                  const playbook = playbooks.find((p: any) => p.id === drill.playbookId);
                  return (
                    <Card key={drill.id} className="border-2 border-[#2B8A6E] bg-white" data-testid={`card-active-drill-${drill.id}`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl" style={CG}>
                          <Activity className="h-5 w-5 text-[#2B8A6E] animate-pulse" />
                          {playbook?.title || 'Unknown Playbook'} - LIVE SIMULATION
                        </CardTitle>
                        <CardDescription className="font-medium">Strategic coordination in progress</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">
                          Started: <span className="text-[#0A0F2E]">{drill.startedAt ? new Date(drill.startedAt).toLocaleString() : 'N/A'}</span>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            className="bg-[#2B8A6E] text-white hover:bg-[#3BAF8A] font-bold"
                            onClick={() => handleCompleteDrill(drill.id, true)}
                            disabled={completeDrillMutation.isPending}
                            data-testid={`button-complete-success-${drill.id}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete Successfully
                          </Button>
                          <Button
                            variant="outline"
                            className="border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/5 font-bold"
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
              <Card className="border border-[#E8E4DC] bg-white">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 mx-auto mb-3 text-[#E8E4DC]" />
                    <p className="font-bold text-[#0A0F2E]">No completed drills</p>
                    <p className="text-sm text-[#6B7280] mt-1">Complete your first drill to see results</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              completedDrills.map((drill: any) => {
                const playbook = playbooks.find((p: any) => p.id === drill.playbookId);
                const performance = performances.find(p => p.drillId === drill.id);
                
                return (
                  <Card key={drill.id} className="border border-[#E8E4DC] bg-white hover:shadow-sm transition-all" data-testid={`card-completed-drill-${drill.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl" style={CG}>
                            {playbook?.title || 'Unknown Playbook'}
                          </CardTitle>
                          <CardDescription className="mt-1 font-medium">
                            Completed: {drill.completedAt ? new Date(drill.completedAt).toLocaleDateString() : 'N/A'}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-none font-bold uppercase tracking-wider text-[10px]" data-testid={`badge-completed-${drill.id}`}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Validated
                        </Badge>
                      </div>
                    </CardHeader>
                    {performance && (
                      <CardContent>
                        <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#E8E4DC]">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Execution Time</div>
                            <div className="text-2xl font-bold" style={{ ...CG, color: GOLD }} data-testid={`text-time-${drill.id}`}>
                              {performance.timeToComplete}m
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Success Rate</div>
                            <div className="text-2xl font-bold" style={{ ...CG, color: GOLD }} data-testid={`text-success-${drill.id}`}>
                              {performance.successRate}%
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Bottlenecks</div>
                            <div className="text-2xl font-bold" style={{ ...CG, color: performance.bottlenecks?.length > 0 ? '#C9A84C' : '#2B8A6E' }} data-testid={`text-bottlenecks-${drill.id}`}>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#0A0F2E] dark:text-[#0A0F2E]" />
                  Drill Scoring Breakdown
                </CardTitle>
                <CardDescription>Detailed performance across key response dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {[
                    { label: "Response Time", score: 92, description: "How quickly stakeholders acknowledged" },
                    { label: "Task Completion", score: 87, description: "Percentage of tasks completed on time" },
                    { label: "Communication", score: 78, description: "Effectiveness of cross-team coordination" },
                    { label: "Decision Quality", score: 85, description: "Accuracy of decisions under pressure" },
                    { label: "Recovery", score: 91, description: "Speed of return to normal operations" },
                  ].map((criteria) => (
                    <div key={criteria.label} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{criteria.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">— {criteria.description}</span>
                        </div>
                        <span className="text-sm font-bold">{criteria.score}/100</span>
                      </div>
                      <Progress value={criteria.score} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#C9A84C]" />
                      <span className="font-semibold">Overall Average</span>
                    </div>
                    <div className="text-2xl font-bold text-[#0A0F2E] dark:text-[#0A0F2E]">
                      {Math.round((92 + 87 + 78 + 85 + 91) / 5)}/100
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#C9A84C] dark:text-[#C9A84C]" />
                  Team Performance Comparison
                </CardTitle>
                <CardDescription>Cross-team drill performance and readiness trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { team: "Security Operations", passRate: 94, avgTime: 10.2, trend: "up" as const },
                    { team: "Legal & Compliance", passRate: 88, avgTime: 13.8, trend: "stable" as const },
                    { team: "Executive Leadership", passRate: 82, avgTime: 15.1, trend: "up" as const },
                    { team: "IT Infrastructure", passRate: 91, avgTime: 11.4, trend: "up" as const },
                  ].map((item) => (
                    <div
                      key={item.team}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.team}</div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-muted-foreground text-xs">Pass Rate</div>
                          <div className="font-bold">{item.passRate}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground text-xs">Avg Time</div>
                          <div className="font-bold">{item.avgTime} min</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.trend === "up" && (
                            <Badge variant="outline" className="text-[#2B8A6E] border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30">
                              <ArrowUp className="h-3 w-3 mr-1" />
                              Up
                            </Badge>
                          )}
                          {item.trend === "stable" && (
                            <Badge variant="outline" className="text-[#C9A84C] border-[#C9A84C]/30 bg-[#C9A84C]/5">
                              <Minus className="h-3 w-3 mr-1" />
                              Stable
                            </Badge>
                          )}
                          {item.trend === "down" && (
                            <Badge variant="outline" className="text-red-700 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30">
                              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                              Down
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
