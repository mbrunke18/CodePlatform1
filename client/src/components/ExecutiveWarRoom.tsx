import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Command, 
  Shield, 
  AlertTriangle, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  Brain,
  Zap,
  FileText,
  CheckCircle,
  XCircle,
  Plus,
  Send,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface WarRoomSession {
  id: string;
  organizationId: string;
  scenarioId?: string;
  name: string;
  description: string;
  status: 'active' | 'standby' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  sessionType: 'crisis' | 'opportunity' | 'strategic_planning' | 'risk_mitigation';
  leadExecutive: string;
  participants: string[];
  startTime: string;
  expectedDuration?: number;
  objectives: string[];
  currentPhase: string;
  nextActions: string[];
  resources: any;
  decisionLog: any[];
  communicationPlan: any;
  escalationProtocol: any;
  createdAt: string;
  lastUpdated: string;
}

interface ExecutiveBriefing {
  id: string;
  organizationId: string;
  executiveId: string;
  briefingType: 'daily' | 'weekly' | 'incident' | 'strategic' | 'board_ready';
  title: string;
  summary: string;
  keyInsights: any[];
  actionItems: any[];
  riskAlerts: any[];
  opportunities: any[];
  metrics: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  readingTime: number;
  acknowledgedAt?: string;
  createdAt: string;
}

interface StrategicAlert {
  id: string;
  organizationId: string;
  alertType: 'opportunity' | 'threat' | 'anomaly' | 'milestone' | 'regulatory';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceSystem: string;
  triggerConditions: any;
  recommendedActions: any[];
  impactAssessment: any;
  timeframe: string;
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved';
  assignedTo?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

interface BoardReport {
  id: string;
  organizationId: string;
  reportType: 'monthly' | 'quarterly' | 'annual' | 'special';
  title: string;
  executiveSummary: string;
  keyMetrics: any;
  strategicInitiatives: any[];
  riskAssessment: any;
  financialHighlights: any;
  recommendations: any[];
  appendices: any[];
  presentationSlides?: any[];
  status: 'draft' | 'review' | 'approved' | 'presented';
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  presentedAt?: string;
  createdAt: string;
}

export function ExecutiveWarRoom() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newSessionForm, setNewSessionForm] = useState(false);
  const [sessionData, setSessionData] = useState({
    name: '',
    description: '',
    sessionType: 'crisis' as const,
    priority: 'medium' as const,
    leadExecutive: '',
    objectives: ['']
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch War Room Sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/strategic/war-room/sessions'],
    queryFn: async () => {
      const response = await fetch('/api/strategic/war-room/sessions');
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Fetch Executive Briefings
  const { data: briefings = [] } = useQuery({
    queryKey: ['/api/strategic/briefings'],
    queryFn: async () => {
      const response = await fetch('/api/strategic/briefings');
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Fetch Strategic Alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ['/api/strategic/alerts'],
    queryFn: async () => {
      const response = await fetch('/api/strategic/alerts');
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Fetch Board Reports
  const { data: reports = [] } = useQuery({
    queryKey: ['/api/strategic/reports'],
    queryFn: async () => {
      const response = await fetch('/api/strategic/reports');
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Create War Room Session
  const createSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/strategic/war-room/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/strategic/war-room/sessions'] });
      setNewSessionForm(false);
      setSessionData({
        name: '',
        description: '',
        sessionType: 'crisis',
        priority: 'medium',
        leadExecutive: '',
        objectives: ['']
      });
      toast({
        title: 'War Room Session Created',
        description: 'Strategic command center activated successfully.'
      });
    }
  });

  // Acknowledge Alert
  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/strategic/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledgedBy: 'Current User' })
      });
      if (!response.ok) throw new Error('Failed to acknowledge alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/strategic/alerts'] });
      toast({
        title: 'Alert Acknowledged',
        description: 'Strategic alert has been marked as acknowledged.'
      });
    }
  });

  const handleCreateSession = () => {
    if (!sessionData.name || !sessionData.leadExecutive) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    createSessionMutation.mutate({
      organizationId: 'default-org',
      ...sessionData,
      participants: [sessionData.leadExecutive],
      currentPhase: 'initialization',
      nextActions: sessionData.objectives,
      resources: {},
      decisionLog: [],
      communicationPlan: {},
      escalationProtocol: {}
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-500';
      case 'new': return 'bg-blue-500';
      case 'acknowledged': return 'bg-orange-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Command className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Executive War Room</h1>
            <p className="text-gray-600 dark:text-gray-400">Strategic Command & Crisis Coordination Center</p>
          </div>
        </div>
        <Button 
          onClick={() => setNewSessionForm(true)}
          className="bg-primary hover:bg-primary/90"
          data-testid="button-new-session"
        >
          <Plus className="h-4 w-4 mr-2" />
          Activate War Room
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-primary">
                  {sessions.filter((s: WarRoomSession) => s.status === 'active').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Critical Alerts</p>
                <p className="text-2xl font-bold text-orange-600">
                  {alerts.filter((a: StrategicAlert) => a.severity === 'critical' && a.status === 'new').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Briefings</p>
                <p className="text-2xl font-bold text-blue-600">
                  {briefings.filter((b: ExecutiveBriefing) => 
                    new Date(b.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reports</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter((r: BoardReport) => r.status === 'draft').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessions" data-testid="tab-sessions">Command Center</TabsTrigger>
          <TabsTrigger value="intelligence" data-testid="tab-intelligence">Zero-Click Intel</TabsTrigger>
          <TabsTrigger value="alerts" data-testid="tab-alerts">Strategic Alerts</TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports">Board Reports</TabsTrigger>
        </TabsList>

        {/* Command Center Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Sessions</h3>
              </div>
              
              {sessionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Command className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Sessions</h3>
                    <p className="text-gray-500 mb-4">All strategic command centers are in standby mode</p>
                    <Button onClick={() => setNewSessionForm(true)} variant="outline">
                      Activate First Session
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session: WarRoomSession) => (
                    <Card key={session.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedSession(session.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-lg">{session.name}</h4>
                              <Badge className={`${getPriorityColor(session.priority)} text-white`}>
                                {session.priority.toUpperCase()}
                              </Badge>
                              <Badge className={`${getStatusColor(session.status)} text-white`}>
                                {session.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">{session.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                Lead: {session.leadExecutive}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(session.startTime).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Current Phase</p>
                            <p className="font-medium">{session.currentPhase}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Session Type</p>
                            <p className="font-medium capitalize">{session.sessionType.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Participants</p>
                            <p className="font-medium">{session.participants.length} members</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Real-Time Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">System Health</span>
                    <Badge className="bg-green-500 text-white">OPERATIONAL</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Radar</span>
                    <Badge className="bg-blue-500 text-white">SCANNING</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Command Ready</span>
                    <Badge className="bg-green-500 text-white">READY</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Response Time</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Decision Speed</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Execution Rate</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Zero-Click Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Executive Briefings
              </h3>
              {briefings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Intelligence Available</h3>
                    <p className="text-gray-500">AI-powered briefings will appear here automatically</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {briefings.slice(0, 5).map((briefing: ExecutiveBriefing) => (
                    <Card key={briefing.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{briefing.title}</h4>
                              <Badge className={`${getPriorityColor(briefing.priority)} text-white`}>
                                {briefing.briefingType.toUpperCase()}
                              </Badge>
                              {briefing.acknowledgedAt && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{briefing.summary}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{briefing.readingTime} min read</span>
                              <span>{new Date(briefing.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {briefing.keyInsights.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Key Insights</p>
                            <div className="flex flex-wrap gap-1">
                              {briefing.keyInsights.slice(0, 3).map((insight: any, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {insight.title || `Insight ${idx + 1}`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                AI Insights Engine
              </h3>
              <Card>
                <CardHeader>
                  <CardTitle>Proactive Intelligence</CardTitle>
                  <CardDescription>AI-powered strategic analysis and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900 dark:text-blue-100">Strategic Opportunity</span>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Market analysis indicates 23% growth opportunity in Q2. Recommend accelerating Product Line Alpha expansion.
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="font-medium text-orange-900 dark:text-orange-100">Risk Alert</span>
                    </div>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Supply chain volatility detected. Suggest diversifying vendor portfolio within 30 days.
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-900 dark:text-green-100">Performance Insight</span>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Team productivity up 18% following strategic process optimization initiatives.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Strategic Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Strategic Alerts
            </h3>
            <Badge variant="outline">
              {alerts.filter((a: StrategicAlert) => a.status === 'new').length} New
            </Badge>
          </div>

          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Alerts</h3>
                <p className="text-gray-500">Strategic monitoring systems are operating normally</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: StrategicAlert) => (
                <Card key={alert.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge className={`${getPriorityColor(alert.severity)} text-white`}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge className={`${getStatusColor(alert.status)} text-white`}>
                            {alert.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {alert.alertType.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{alert.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Source System</p>
                            <p className="font-medium">{alert.sourceSystem}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Timeframe</p>
                            <p className="font-medium">{alert.timeframe}</p>
                          </div>
                        </div>

                        {alert.recommendedActions.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">Recommended Actions</p>
                            <div className="space-y-1">
                              {alert.recommendedActions.slice(0, 2).map((action: any, idx: number) => (
                                <div key={idx} className="flex items-center text-sm">
                                  <Target className="h-3 w-3 mr-2 text-gray-400" />
                                  {action.description || action}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        {alert.status === 'new' && (
                          <Button
                            size="sm"
                            onClick={() => acknowledgeAlertMutation.mutate(alert.id)}
                            disabled={acknowledgeAlertMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Board Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Board-Ready Reports
            </h3>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>

          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports Available</h3>
                <p className="text-gray-500">Board-ready reports will be generated automatically</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report: BoardReport) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{report.title}</h4>
                          <Badge variant="outline">
                            {report.reportType.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {report.executiveSummary}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Status:</span>
                            <Badge className={`${getStatusColor(report.status)} text-white text-xs`}>
                              {report.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Created by:</span>
                            <span>{report.createdBy}</span>
                          </div>
                          {report.approvedBy && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Approved by:</span>
                              <span>{report.approvedBy}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {report.status === 'draft' && (
                        <Button size="sm" className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* New Session Modal */}
      {newSessionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Activate War Room Session</CardTitle>
              <CardDescription>Deploy strategic command center for crisis or opportunity management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Session Name *</label>
                <Input
                  value={sessionData.name}
                  onChange={(e) => setSessionData({...sessionData, name: e.target.value})}
                  placeholder="e.g., Q2 Market Disruption Response"
                  data-testid="input-session-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={sessionData.description}
                  onChange={(e) => setSessionData({...sessionData, description: e.target.value})}
                  placeholder="Brief description of the strategic situation..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Session Type</label>
                  <Select
                    value={sessionData.sessionType}
                    onValueChange={(value: any) => setSessionData({...sessionData, sessionType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crisis">Crisis Response</SelectItem>
                      <SelectItem value="opportunity">Strategic Opportunity</SelectItem>
                      <SelectItem value="strategic_planning">Strategic Planning</SelectItem>
                      <SelectItem value="risk_mitigation">Risk Mitigation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority Level</label>
                  <Select
                    value={sessionData.priority}
                    onValueChange={(value: any) => setSessionData({...sessionData, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lead Executive *</label>
                <Input
                  value={sessionData.leadExecutive}
                  onChange={(e) => setSessionData({...sessionData, leadExecutive: e.target.value})}
                  placeholder="Executive leading this session"
                  data-testid="input-lead-executive"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Primary Objective</label>
                <Input
                  value={sessionData.objectives[0]}
                  onChange={(e) => setSessionData({...sessionData, objectives: [e.target.value]})}
                  placeholder="Main strategic objective"
                />
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setNewSessionForm(false)}
                className="flex-1"
                data-testid="button-cancel-session"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSession}
                disabled={createSessionMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700"
                data-testid="button-activate-session"
              >
                {createSessionMutation.isPending ? 'Activating...' : 'Activate Session'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}