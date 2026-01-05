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
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
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
  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: [`/api/tasks?scenarioId=${crisisId}`],
    enabled: !!crisisId,
  });

  // Fetch organization details
  const { data: organizations = [] } = useQuery<any[]>({ 
    queryKey: ['/api/organizations'] 
  });
  
  const organization = organizations.find(org => org.id === crisis?.organizationId);

  // Update crisis status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      return apiRequest(`/api/scenarios/${crisisId}`, 'PATCH', { status: newStatus });
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

  if (crisisLoading) {
    return (
      <VeridiusPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </VeridiusPageLayout>
    );
  }

  if (!crisis) {
    return (
      <VeridiusPageLayout>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Crisis Not Found</h2>
          <p className="text-gray-600 mb-4">The requested crisis scenario could not be found.</p>
          <Link href="/crisis">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Crisis Management
            </Button>
          </Link>
        </div>
      </VeridiusPageLayout>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'destructive';
      case 'monitoring': return 'default';
      case 'resolved': return 'secondary';
      case 'draft': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto" data-testid="crisis-detail-page">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Link href="/crisis">
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Crisis Center
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={getStatusBadgeVariant(crisis.status)} 
                  className="bg-white/20 text-white border-white/30"
                >
                  {crisis.status.toUpperCase()}
                </Badge>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{crisis.title}</h1>
              <p className="text-red-100 text-lg">
                {organization?.name || 'Organization'} • Crisis Response Protocol
              </p>
              <div className="flex items-center gap-4 text-sm text-red-100">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {new Date(crisis.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last updated {new Date(crisis.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Quick Actions & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Response Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Task Completion</span>
                  <span className="text-sm text-gray-600" data-testid="task-progress-counter">{completedTasks} of {totalTasks} tasks</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
                    <div className="text-sm text-gray-600">Total Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => updateStatusMutation.mutate('active')}
                  disabled={updateStatusMutation.isPending}
                  data-testid="button-activate-crisis"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Activate Response
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => updateStatusMutation.mutate('monitoring')}
                  disabled={updateStatusMutation.isPending}
                  data-testid="button-monitor-crisis"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Monitor Situation
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => updateStatusMutation.mutate('resolved')}
                  disabled={updateStatusMutation.isPending}
                  data-testid="button-resolve-crisis"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Resolved
                </Button>
                <Separator className="my-3" />
                <Button variant="ghost" className="w-full text-left justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks" data-testid="nav-item-tasks">Tasks ({totalTasks})</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Crisis Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {crisis.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Organization Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Organization</div>
                      <div className="text-lg font-semibold">{organization?.name || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Industry</div>
                      <div>{organization?.industry || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Size</div>
                      <div>{organization?.size ? `${organization.size} employees` : 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Location</div>
                      <div>{organization?.headquarters || 'Not specified'}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Impact Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Severity Level</span>
                      <Badge variant="destructive">HIGH</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm">&lt; 2 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Affected Stakeholders</span>
                      <span className="text-sm">Multiple departments</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Est. Financial Impact</span>
                      <span className="text-sm font-semibold text-red-600">$2.4M+</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Strategic Action Items</h3>
                <div className="text-sm text-gray-600">
                  {completedTasks} of {totalTasks} completed
                </div>
              </div>

              {tasksLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : tasks.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Tasks Yet</h3>
                    <p className="text-gray-600">Tasks will be created when the crisis response is activated.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
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
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                                )}
                              </Button>
                              <div className="flex-1">
                                <p className={`text-sm ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                                  {task.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 ml-8">
                              <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
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

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Crisis Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Crisis Detected</div>
                        <div className="text-xs text-gray-500">{new Date(crisis.createdAt).toLocaleString()}</div>
                        <div className="text-sm text-gray-600 mt-1">Initial crisis scenario created and logged</div>
                      </div>
                    </div>
                    
                    {crisis.status === 'active' && (
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Response Activated</div>
                          <div className="text-xs text-gray-500">{new Date().toLocaleString()}</div>
                          <div className="text-sm text-gray-600 mt-1">Emergency response protocols initiated</div>
                        </div>
                      </div>
                    )}

                    {crisis.status === 'resolved' && (
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Crisis Resolved</div>
                          <div className="text-xs text-gray-500">{new Date(crisis.updatedAt).toLocaleString()}</div>
                          <div className="text-sm text-gray-600 mt-1">All critical tasks completed, situation stabilized</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Response Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Task Completion Rate</span>
                      <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    
                    <div className="pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Response Speed</span>
                        <Badge variant="outline">Excellent</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Team Coordination</span>
                        <Badge variant="outline">Good</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Resource Efficiency</span>
                        <Badge variant="outline">Very Good</Badge>
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
    </VeridiusPageLayout>
  );
}