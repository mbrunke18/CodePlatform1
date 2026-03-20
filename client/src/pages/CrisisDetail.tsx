import { useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { Link } from 'wouter';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Activity, 
  Target, 
  Zap,
  Building2,
  Globe,
  TrendingUp,
  BarChart3,
  ArrowLeft,
  Calendar,
  DollarSign,
  MessageSquare,
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  ExternalLink,
  Download,
  Share2,
  Bell,
  Eye
} from 'lucide-react';

interface CrisisScenario {
  id: string;
  organizationId: string;
  name: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface Task {
  id: string;
  scenarioId: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
}

export default function CrisisDetail() {
  const params = useParams();
  const crisisId = params.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch crisis details
  const { data: crisis, isLoading: crisisLoading } = useQuery<CrisisScenario>({
    queryKey: ['/api/scenarios', crisisId],
    enabled: !!crisisId,
  });

  // Fetch related tasks
  const { data: tasksData, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: [`/api/tasks?scenarioId=${crisisId}`],
    enabled: !!crisisId,
  });
  const tasks = tasksData ?? [];

  // Fetch organization details
  const { data: organizationsData } = useQuery<any[]>({ 
    queryKey: ['/api/organizations'] 
  });
  const organizations = organizationsData ?? [];
  
  const organization = organizations.find(org => org.id === crisis?.organizationId);

  // Update crisis status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      return apiRequest('PATCH', `/api/scenarios/${crisisId}`, { status: newStatus });
    },
    onSuccess: () => {
      toast({
        title: 'Crisis Status Updated',
        description: 'Crisis response status has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios', crisisId] });
    },
  });

  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const response = await apiRequest('PATCH', `/api/tasks/${taskId}/status`, { completed });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Task Updated',
        description: 'Task status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tasks?scenarioId=${crisisId}`] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update task status. Please try again.',
        variant: 'destructive',
      });
      console.error('Task update error:', error);
    },
  });

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  if (crisisLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64 bg-[#F8F7F4]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A0F2E]"></div>
        </div>
      </PageLayout>
    );
  }

  if (!crisis) {
    return (
      <PageLayout>
        <div className="text-center py-24 bg-[#F8F7F4]">
          <AlertTriangle className="h-16 w-16 text-[#C9A84C] mx-auto mb-6" />
          <h2 style={CG} className="text-3xl font-bold mb-4 text-[#0A0F2E]">Crisis Not Found</h2>
          <p className="text-[#6B7280] mb-8 max-w-md mx-auto">The requested crisis scenario could not be found or has been archived.</p>
          <Link href="/crisis">
            <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none px-8 font-bold tracking-widest text-[10px] uppercase">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Crisis Management
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return { background: "rgba(220,38,38,0.12)", color: "#DC2626" };
      case 'monitoring': return { background: "rgba(201,168,76,0.12)", color: "#C9A84C" };
      case 'resolved': return { background: "rgba(43,138,110,0.12)", color: "#2B8A6E" };
      default: return { background: "#F8F7F4", color: "#6B7280" };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-[#DC2626] bg-[#DC2626]/10 font-bold';
      case 'medium': return `text-[#C9A84C] bg-[#C9A84C]/10 font-bold`;
      case 'low': return `text-[#2B8A6E] bg-[#2B8A6E]/10 font-bold`;
      default: return 'text-[#6B7280] bg-[#F8F7F4]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-[#DC2626]/10 text-[#DC2626]';
      case 'medium': return `bg-[#C9A84C]/10 text-[#C9A84C]`;
      case 'low': return `bg-[#2B8A6E]/10 text-[#2B8A6E]`;
      default: return 'bg-[#F8F7F4] text-[#6B7280]';
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <PageLayout>
      <div className="flex-1 bg-[#F8F7F4] overflow-auto" data-testid="crisis-detail-page">
        {/* Header */}
        <div style={{ background: NAVY, padding: "64px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "radial-gradient(#C9A84C 0.5px, transparent 0.5px)", 
            backgroundSize: "32px 32px",
            opacity: 0.1
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-8">
              <Link href="/crisis">
                <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 px-0">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Back to Crisis Center</span>
                </Button>
              </Link>
              <div className="flex items-center gap-6">
                <div style={{ ...getStatusBadgeStyle(crisis.status), fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 12px" }}>
                  {crisis.status}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 h-10 w-10 p-0 rounded-none">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 h-10 w-10 p-0 rounded-none">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: GOLD }}>Crisis Detail Report</span>
                </div>
                <h1 style={{ ...CG, color: "#fff", fontSize: "clamp(32px,4vw,56px)", fontWeight: 600, lineHeight: 1.1 }}>
                  {crisis.title}
                </h1>
                <p className="text-[#DFC178] text-lg italic max-w-2xl font-medium">
                  {organization?.name || 'Organization'} • Strategic Execution Protocol
                </p>
                <div className="flex items-center gap-6 text-[10px] font-bold tracking-[0.15em] uppercase text-white/40">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-white/20" />
                    Started: {new Date(crisis.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-white/20" />
                    Updated: {new Date(crisis.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 backdrop-blur-sm min-w-[320px]">
                 <div className="text-center">
                    <div style={CG} className="text-4xl font-bold text-[#C9A84C]">{Math.round(progressPercentage)}%</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Completion</div>
                 </div>
                 <div className="w-px h-12 bg-white/10" />
                 <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">
                       <span>Tasks</span>
                       <span>{completedTasks}/{totalTasks}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-1 bg-white/10 [&>div]:bg-[#C9A84C]" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-12 max-w-7xl mx-auto space-y-12">
          {/* Quick Actions & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <Card className="lg:col-span-2 rounded-none border-[#E8E4DC] shadow-sm bg-white p-8">
              <CardHeader className="px-0 pt-0 mb-8">
                <CardTitle style={CG} className="text-2xl font-bold flex items-center gap-3 text-[#0A0F2E]">
                  <Activity className="h-6 w-6 text-[#2B8A6E]" />
                  Response Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <div style={CG} className="text-5xl font-bold text-[#0A0F2E] mb-2">{totalTasks}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Total Strategic Tasks</div>
                  </div>
                  <div className="p-8 bg-[#2B8A6E]/5 border border-[#2B8A6E]/20">
                    <div style={CG} className="text-5xl font-bold text-[#2B8A6E] mb-2">{completedTasks}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Validated Completions</div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Execution Velocity</h4>
                        <p className="text-sm font-medium text-[#0A0F2E]">Real-time task synchronization</p>
                     </div>
                     <span style={CG} className="text-2xl font-bold text-[#0A0F2E]">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-1.5 bg-[#E8E4DC] [&>div]:bg-[#C9A84C]" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border-[#E8E4DC] shadow-sm bg-white p-8">
              <CardHeader className="px-0 pt-0 mb-8">
                <CardTitle style={CG} className="text-2xl font-bold flex items-center gap-3 text-[#0A0F2E]">
                  <Settings className="h-6 w-6 text-[#C9A84C]" />
                  Protocol Control
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-3">
                <Button 
                  className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45] h-14 rounded-none font-bold text-[10px] tracking-widest uppercase px-6 justify-between"
                  onClick={() => updateStatusMutation.mutate('active')}
                  disabled={updateStatusMutation.isPending}
                  data-testid="button-activate-crisis"
                >
                  Activate Response
                  <Play className="w-4 h-4 text-[#C9A84C]" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] h-14 rounded-none font-bold text-[10px] tracking-widest uppercase px-6 justify-between"
                  onClick={() => updateStatusMutation.mutate('monitoring')}
                  disabled={updateStatusMutation.isPending}
                  data-testid="button-monitor-crisis"
                >
                  Monitor Situation
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] h-14 rounded-none font-bold text-[10px] tracking-widest uppercase px-6 justify-between"
                  onClick={() => updateStatusMutation.mutate('resolved')}
                  disabled={updateStatusMutation.isPending}
                  data-testid="button-resolve-crisis"
                >
                  Mark Resolved
                  <CheckCircle className="w-4 h-4 text-[#2B8A6E]" />
                </Button>
                <div className="pt-4 mt-4 border-t border-[#F8F7F4]">
                   <Button variant="ghost" className="w-full text-[#6B7280] hover:text-[#0A0F2E] hover:bg-transparent font-bold text-[10px] tracking-widest uppercase justify-center">
                      <Bell className="w-4 h-4 mr-2" />
                      Protocol Notifications
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-transparent border-b border-[#E8E4DC] rounded-none h-auto p-0 gap-12">
              {['overview', 'tasks', 'timeline', 'analysis'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none px-0 py-5 text-[10px] font-bold tracking-[0.25em] uppercase text-[#6B7280]"
                  data-testid={tab === 'tasks' ? 'nav-item-tasks' : undefined}
                >
                  {tab === 'tasks' ? `Tasks (${totalTasks})` : tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-8">
              <Card className="rounded-none border-[#E8E4DC]">
                <CardHeader>
                  <CardTitle style={CG} className="flex items-center gap-2 text-2xl text-[#0A0F2E]">
                    <FileText className="h-5 w-5 text-[#C9A84C]" />
                    Crisis Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-[#0A0F2E] leading-relaxed">
                      {crisis.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-none border-[#E8E4DC]">
                  <CardHeader>
                    <CardTitle style={CG} className="text-2xl font-bold flex items-center gap-2 text-[#0A0F2E]">
                      <Building2 className="h-5 w-5 text-[#C9A84C]" />
                      Organization Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-[#0A0F2E]">Organization</div>
                      <div className="text-lg font-semibold text-[#0A0F2E]">{organization?.name || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#0A0F2E]">Industry</div>
                      <div className="text-[#0A0F2E]">{organization?.industry || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#0A0F2E]">Size</div>
                      <div className="text-[#0A0F2E]">{organization?.size ? `${organization.size} employees` : 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#0A0F2E]">Location</div>
                      <div className="text-[#0A0F2E]">{organization?.headquarters || 'Not specified'}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-[#E8E4DC]">
                  <CardHeader>
                    <CardTitle style={CG} className="flex items-center gap-2 text-2xl text-[#0A0F2E]">
                      <BarChart3 className="h-5 w-5 text-[#2B8A6E]" />
                      Impact Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#0A0F2E]">Severity Level</span>
                    <Badge variant="destructive" className="bg-[#DC2626] text-white rounded-none">HIGH</Badge>
                  </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#0A0F2E]">Response Time</span>
                      <span className="text-sm text-[#0A0F2E]">&lt; 2 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#0A0F2E]">Affected Stakeholders</span>
                      <span className="text-sm text-[#0A0F2E]">Multiple departments</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#0A0F2E]">Est. Financial Impact</span>
                      <span className="text-sm font-semibold text-[#DC2626]">$2.4M+</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0A0F2E]">Strategic Action Items</h3>
                <div className="text-sm text-[#6B7280]">
                  {completedTasks} of {totalTasks} completed
                </div>
              </div>

              {tasksLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A0F2E] mx-auto"></div>
                </div>
              ) : tasks.length === 0 ? (
                <Card className="rounded-none border-[#E8E4DC]">
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-[#0A0F2E]">No Tasks Yet</h3>
                    <p className="text-[#6B7280]">Tasks will be created when the crisis response is activated.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow rounded-none border-[#E8E4DC]">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-auto"
                                onClick={() => updateTaskMutation.mutate({
                                  taskId: task.id,
                                  completed: task.status !== 'Completed'
                                })}
                                disabled={updateTaskMutation.isPending}
                                data-testid={`button-toggle-task-${task.id}`}
                              >
                                {task.status === 'Completed' ? (
                                  <CheckCircle className="h-5 w-5 text-[#2B8A6E]" />
                                ) : (
                                  <div className="h-5 w-5 border-2 border-[#E8E4DC] rounded-full" />
                                )}
                              </Button>
                              <div className="flex-1">
                                <p className={`text-sm ${task.status === 'Completed' ? 'line-through text-[#6B7280]' : 'text-[#0A0F2E]'}`}>
                                  {task.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-[#6B7280] ml-8">
                              <span className={`px-2 py-1 rounded-none ${getPriorityStyle(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              <span>Status: {task.status}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 mt-8">
              <Card className="rounded-none border-[#E8E4DC]">
                <CardHeader>
                  <CardTitle style={CG} className="flex items-center gap-2 text-2xl text-[#0A0F2E]">
                    <Clock className="h-5 w-5 text-[#C9A84C]" />
                    Crisis Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-[#0A0F2E] rounded-full mt-2"></div>
                      <div className="flex-1 page-background">
                        <div className="text-sm font-medium">Crisis Detected</div>
                        <div className="text-xs text-[#6B7280]">{new Date(crisis.createdAt).toLocaleString()}</div>
                        <div className="text-sm text-[#0A0F2E] mt-1">Initial crisis scenario created and logged</div>
                      </div>
                    </div>
                    
                    {crisis.status === 'active' && (
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-[#C9A84C] rounded-full mt-2"></div>
                        <div className="flex-1 page-background">
                          <div className="text-sm font-medium">Response Activated</div>
                          <div className="text-xs text-[#6B7280]">{new Date().toLocaleString()}</div>
                          <div className="text-sm text-[#0A0F2E] mt-1">Emergency response protocols initiated</div>
                        </div>
                      </div>
                    )}

                    {crisis.status === 'resolved' && (
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-[#2B8A6E] rounded-full mt-2"></div>
                        <div className="flex-1 page-background">
                          <div className="text-sm font-medium">Crisis Resolved</div>
                          <div className="text-xs text-[#6B7280]">{new Date(crisis.updatedAt).toLocaleString()}</div>
                          <div className="text-sm text-[#0A0F2E] mt-1">All critical tasks completed, situation stabilized</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-none border-[#E8E4DC]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                      <TrendingUp className="h-5 w-5 text-[#2B8A6E]" />
                      Response Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-[#0A0F2E]">
                      <span className="text-sm">Task Completion Rate</span>
                      <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-[#E8E4DC] [&>div]:bg-[#2B8A6E]" />
                    
                    <div className="pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-[#6B7280]">Response Speed</span>
                        <Badge variant="outline" className="text-[#2B8A6E] border-[#2B8A6E]/20 bg-[#2B8A6E]/5 rounded-none uppercase text-[10px] tracking-widest font-bold">Excellent</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#6B7280]">Team Coordination</span>
                        <Badge variant="outline" className="text-[#C9A84C] border-[#C9A84C]/20 bg-[#C9A84C]/5 rounded-none uppercase text-[10px] tracking-widest font-bold">Good</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#6B7280]">Resource Efficiency</span>
                        <Badge variant="outline" className="text-[#2B8A6E] border-[#2B8A6E]/20 bg-[#2B8A6E]/5 rounded-none uppercase text-[10px] tracking-widest font-bold">Very Good</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Crisis response is progressing well with {Math.round(progressPercentage)}% of critical tasks completed.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2 text-sm">
                      <div>• Executive team alignment achieved</div>
                      <div>• Communication protocols established</div>
                      <div>• Resource allocation optimized</div>
                      <div>• Stakeholder engagement active</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}