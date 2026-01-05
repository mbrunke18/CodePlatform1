import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import TriggerConfigurationWizard from '@/components/configuration/TriggerConfigurationWizard';
import { 
  AlertTriangle, 
  Activity, 
  Bell,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  Settings,
  Eye,
  Zap,
  Shield,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  PlayCircle,
  ArrowLeft,
  Home,
  Plus
} from 'lucide-react';

interface TriggerCondition {
  id: string;
  scenarioId: string;
  scenarioName: string;
  triggerType: 'threshold' | 'event' | 'time' | 'condition' | 'ml_prediction' | 'composite';
  condition: string;
  currentValue: number | string;
  thresholdValue: number | string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'triggered' | 'paused' | 'learning' | 'predicting';
  category: string;
  lastChecked: string;
  triggeredAt?: string;
  autoEscalate: boolean;
  recommendedPlaybooks?: string[];
  // Enhanced AI & Automation Features
  mlPrediction?: {
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    forecastedTrigger: string;
    aiModel: string;
    dataPoints: number;
  };
  compositeLogic?: {
    operator: 'AND' | 'OR';
    conditions: Array<{
      metric: string;
      operator: '>' | '<' | '=' | '>=' | '<=';
      value: number | string;
      weight: number;
    }>;
  };
  automatedResponse?: {
    enabled: boolean;
    actions: Array<{
      type: 'activate_scenario' | 'send_notification' | 'escalate' | 'run_script';
      target: string;
      delay: number;
    }>;
  };
  escalationWorkflow?: {
    levels: Array<{
      level: number;
      threshold: number;
      approvers: string[];
      timeout: number;
      actions: string[];
    }>;
  };
  dataSource?: {
    type: 'api' | 'database' | 'webhook' | 'manual';
    endpoint?: string;
    refreshRate: number;
    lastUpdate: string;
    status: 'connected' | 'disconnected' | 'error';
  };
}

const mockTriggers: TriggerCondition[] = [
  {
    id: '1',
    scenarioId: 'supply-chain-crisis',
    scenarioName: 'Supply Chain Disruption',
    triggerType: 'ml_prediction',
    condition: 'AI-predicted supply chain disruption risk',
    currentValue: 12,
    thresholdValue: 7,
    severity: 'high',
    status: 'predicting',
    category: 'supply-chain',
    lastChecked: '2 minutes ago',
    autoEscalate: true,
    mlPrediction: {
      confidence: 89.4,
      trend: 'increasing',
      forecastedTrigger: '2.3 hours',
      aiModel: 'Supply Chain Risk Predictor v3.2',
      dataPoints: 15420
    },
    automatedResponse: {
      enabled: true,
      actions: [
        { type: 'send_notification', target: 'coo@company.com', delay: 0 },
        { type: 'activate_scenario', target: 'supply-chain-crisis', delay: 300 },
        { type: 'escalate', target: 'executive-team', delay: 900 }
      ]
    },
    dataSource: {
      type: 'api',
      endpoint: 'https://api.supplier-network.com/v1/status',
      refreshRate: 300,
      lastUpdate: '2 minutes ago',
      status: 'connected'
    }
  },
  {
    id: '2',
    scenarioId: 'cybersecurity-incident',
    scenarioName: 'Cybersecurity Incident',
    triggerType: 'composite',
    condition: 'Advanced threat detection (Multi-factor analysis)',
    currentValue: 847,
    thresholdValue: 1000,
    severity: 'critical',
    status: 'triggered',
    category: 'security',
    lastChecked: '30 seconds ago',
    triggeredAt: '5 minutes ago',
    autoEscalate: true,
    compositeLogic: {
      operator: 'OR',
      conditions: [
        { metric: 'failed_logins', operator: '>', value: 500, weight: 0.4 },
        { metric: 'suspicious_ips', operator: '>=', value: 10, weight: 0.3 },
        { metric: 'malware_signatures', operator: '>', value: 0, weight: 0.5 },
        { metric: 'anomaly_score', operator: '>=', value: 85, weight: 0.6 }
      ]
    },
    escalationWorkflow: {
      levels: [
        { level: 1, threshold: 300, approvers: ['security-team'], timeout: 300, actions: ['immediate-lockdown'] },
        { level: 2, threshold: 600, approvers: ['ciso', 'cto'], timeout: 600, actions: ['incident-response', 'external-forensics'] },
        { level: 3, threshold: 1200, approvers: ['ceo', 'board'], timeout: 900, actions: ['public-disclosure', 'regulatory-notification'] }
      ]
    },
    dataSource: {
      type: 'api',
      endpoint: 'https://siem.company.com/api/v2/threats',
      refreshRate: 30,
      lastUpdate: '30 seconds ago',
      status: 'connected'
    }
  },
  {
    id: '3',
    scenarioId: 'financial-liquidity-crisis',
    scenarioName: 'Financial Liquidity Crisis',
    triggerType: 'threshold',
    condition: 'Cash flow below operational requirements',
    currentValue: 2.3,
    thresholdValue: 2.0,
    severity: 'high',
    status: 'active',
    category: 'financial',
    lastChecked: '1 minute ago',
    autoEscalate: false
  },
  {
    id: '4',
    scenarioId: 'product-recall-crisis',
    scenarioName: 'Product Recall Crisis',
    triggerType: 'event',
    condition: 'Customer complaints exceed threshold',
    currentValue: 23,
    thresholdValue: 50,
    severity: 'medium',
    status: 'paused',
    category: 'operational',
    lastChecked: '5 minutes ago',
    autoEscalate: true
  }
];

export default function TriggersManagement() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerCondition | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  // Fetch real triggers from the API
  const { data: triggersData, isLoading, isError, error } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  // Mutation to toggle trigger active status
  const toggleTriggerMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      console.log('Toggling trigger active state:', id, isActive);
      return await apiRequest('PUT', `/api/executive-triggers/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['/api/executive-triggers'], exact: false });
      toast({
        title: 'Trigger Updated',
        description: 'Trigger status has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update trigger status.',
        variant: 'destructive',
      });
    },
  });

  // Keep raw trigger data for detailed view
  const rawTriggers = triggersData || [];

  // Transform database triggers to frontend format
  const allTriggers: TriggerCondition[] = rawTriggers.map((trigger: any) => ({
    id: trigger.id,
    scenarioId: trigger.id,
    scenarioName: trigger.name,
    triggerType: trigger.triggerType || 'threshold' as const,
    condition: trigger.description || 'Monitor threshold',
    currentValue: trigger.conditions?.value || 0,
    thresholdValue: trigger.conditions?.value || 0,
    severity: trigger.severity || 'medium' as const,
    status: trigger.isActive ? (trigger.alertThreshold === 'red' ? 'triggered' : 'active') : 'paused' as const,
    category: trigger.category || 'operational',
    lastChecked: trigger.updatedAt ? new Date(trigger.updatedAt).toLocaleString() : 'Just now',
    autoEscalate: trigger.notificationSettings?.escalation || false,
    recommendedPlaybooks: trigger.recommendedPlaybooks || [],
    triggeredAt: trigger.lastTriggeredAt ? new Date(trigger.lastTriggeredAt).toLocaleString() : undefined,
  }));

  // Get raw trigger data by ID for detailed view
  const getRawTrigger = (id: string) => rawTriggers.find((t: any) => t.id === id);

  const filteredTriggers = allTriggers.filter(trigger => {
    const categoryMatch = selectedCategory === 'all' || trigger.category === selectedCategory;
    const statusMatch = filterStatus === 'all' || trigger.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const triggeredCount = allTriggers.filter(t => t.status === 'triggered').length;
  const activeCount = allTriggers.filter(t => t.status === 'active').length;
  const pausedCount = allTriggers.filter(t => t.status === 'paused').length;

  const getTriggerTypeIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'ml_prediction': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'composite': return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case 'threshold': return <Target className="h-4 w-4 text-green-600" />;
      case 'event': return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'time': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'triggered': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'predicting': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'learning': return <Settings className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'active': return <Play className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-gray-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDataSourceStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disconnected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'supply-chain': return <Target className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'operational': return <Activity className="h-4 w-4" />;
      case 'compliance': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <PageLayout>
      <div className="page-background min-h-screen bg-transparent p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 h-auto">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <span>/</span>
              <span>Crisis Management</span>
              <span>/</span>
              <span className="text-white">Triggers Management</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold" data-testid="triggers-page-title">Executive Trigger Dashboard</h1>
                  <p className="text-blue-100 mt-1">Define YOUR conditions • AI monitors 24/7 • Execute playbooks when triggers fire</p>
                  <p className="text-blue-200 mt-1 text-sm">You define what matters, AI co-pilot handles the monitoring and execution speed</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setIsWizardOpen(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  data-testid="button-create-custom-trigger"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Trigger
                </Button>
                <OnboardingTrigger pageId="triggers-management" autoStart={true} className="bg-white/10 border-white/30 text-white hover:bg-white/20" />
                <Link to="/">
                  <Button variant="secondary" className="bg-blue-700 hover:bg-blue-800 text-blue-100 border-blue-600">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="text-right">
                  <div className="text-3xl font-bold">{triggeredCount}</div>
                  <div className="text-blue-100">Active Alerts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-red-300 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Critical Alerts</p>
                    <p className="text-2xl font-bold text-red-700">{triggeredCount}</p>
                  </div>
                  <Bell className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-300 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Active Monitoring</p>
                    <p className="text-2xl font-bold text-green-700">{activeCount}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-300 bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Paused Triggers</p>
                    <p className="text-2xl font-bold text-gray-700">{pausedCount}</p>
                  </div>
                  <Pause className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Triggers</p>
                    <p className="text-2xl font-bold text-blue-700">{isLoading ? '...' : allTriggers.length}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts Banner */}
          {triggeredCount > 0 && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">⚠️ Critical Triggers Activated</div>
                    <div className="mt-1">{triggeredCount} scenario triggers require immediate attention</div>
                  </div>
                  <Button variant="destructive" size="sm">
                    View All Alerts
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Signal Categories Overview */}
          <Card className="border-blue-500/30 bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <Eye className="h-5 w-5" />
                Intelligence Signal Categories ({allTriggers.length} Data Points)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {['competitive', 'market', 'financial', 'regulatory', 'supplychain', 'customer', 'talent', 'geopolitical', 'technology', 'media', 'cyber', 'economic', 'partnership', 'execution', 'behavior', 'innovation'].map(cat => {
                  const count = allTriggers.filter(t => t.category === cat).length;
                  return (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className="text-xs capitalize"
                      data-testid={`category-${cat}`}
                    >
                      {cat} ({count})
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-white dark:bg-gray-800 flex-wrap h-auto gap-1 p-1">
                <TabsTrigger value="all">All ({allTriggers.length})</TabsTrigger>
                <TabsTrigger value="competitive">Competitive</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
                <TabsTrigger value="supplychain">Supply Chain</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="talent">Talent</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="triggered">Triggered</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>

            <TabsContent value={selectedCategory} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {isLoading && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="text-gray-500">Loading triggers...</div>
                    </CardContent>
                  </Card>
                )}
                
                {isError && (
                  <Card className="border-red-300">
                    <CardContent className="p-12 text-center">
                      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Triggers</h3>
                      <p className="text-gray-600">Failed to fetch triggers from the database. Please try refreshing the page.</p>
                    </CardContent>
                  </Card>
                )}
                
                {!isLoading && !isError && filteredTriggers.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Triggers Found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {allTriggers.length === 0 
                          ? "You haven't created any executive triggers yet. Create your first trigger to start monitoring critical conditions."
                          : "No triggers match the selected filters. Try adjusting your category or status filters."}
                      </p>
                      <Button 
                        onClick={() => setIsWizardOpen(true)}
                        data-testid="button-create-trigger"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Trigger
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                {!isLoading && !isError && filteredTriggers.map((trigger) => {
                  const rawData = getRawTrigger(trigger.id);
                  return (
                  <Card key={trigger.id} className={`transition-all hover:shadow-md ${
                    trigger.status === 'triggered' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 
                    trigger.status === 'active' ? 'border-green-300' : 'border-gray-200'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(trigger.category)}
                            {getTriggerTypeIcon(trigger.triggerType)}
                            {getSeverityIcon(trigger.severity)}
                            {getStatusIcon(trigger.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {trigger.scenarioName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{trigger.condition}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Threshold</div>
                            <div className="font-bold">{rawData?.conditions?.operator || '≥'} {rawData?.conditions?.value || trigger.thresholdValue}</div>
                          </div>
                          
                          {/* Enable/Disable Toggle */}
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`trigger-toggle-${trigger.id}`} className="text-sm text-gray-500">
                              {trigger.status === 'paused' ? 'Disabled' : 'Enabled'}
                            </Label>
                            <Switch
                              id={`trigger-toggle-${trigger.id}`}
                              checked={trigger.status !== 'paused'}
                              onCheckedChange={(checked) => {
                                toggleTriggerMutation.mutate({ id: trigger.id, isActive: checked });
                              }}
                              disabled={toggleTriggerMutation.isPending}
                              data-testid={`switch-trigger-${trigger.id}`}
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(trigger.status)}
                            <Badge variant={
                              trigger.status === 'triggered' ? 'destructive' :
                              trigger.status === 'active' ? 'default' : 'secondary'
                            }>
                              {trigger.status}
                            </Badge>
                          </div>
                          <Badge variant="outline" className={
                            trigger.severity === 'critical' ? 'border-red-500 text-red-600' :
                            trigger.severity === 'high' ? 'border-orange-500 text-orange-600' :
                            trigger.severity === 'medium' ? 'border-yellow-500 text-yellow-600' :
                            'border-blue-500 text-blue-600'
                          }>
                            {trigger.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Full Data Points Display */}
                      {rawData && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* Condition Details */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Trigger Condition</span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Field:</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">{rawData.conditions?.field || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Operator:</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">{rawData.conditions?.operator || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Value:</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">{rawData.conditions?.value}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Logic:</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">{rawData.conditions?.logic || 'single'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Notification Settings */}
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Bell className="h-4 w-4 text-amber-500" />
                              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Notifications</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {rawData.notificationSettings?.email && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Email ✓</Badge>
                              )}
                              {rawData.notificationSettings?.inApp && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">In-App ✓</Badge>
                              )}
                              {rawData.notificationSettings?.slack && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Slack ✓</Badge>
                              )}
                              {rawData.notificationSettings?.escalation && (
                                <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">Escalation ✓</Badge>
                              )}
                            </div>
                          </div>

                          {/* Category & Metadata */}
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Metadata</span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Category:</span>
                                <Badge variant="outline" className="text-xs capitalize">{rawData.category}</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Type:</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">{rawData.triggerType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Alert Level:</span>
                                <Badge variant={rawData.alertThreshold === 'red' ? 'destructive' : rawData.alertThreshold === 'yellow' ? 'default' : 'secondary'} className="text-xs">
                                  {rawData.alertThreshold}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Enhanced Features Display */}
                      <div className="mt-4 space-y-3">
                        {/* AI Prediction Display */}
                        {trigger.mlPrediction && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Prediction</span>
                                <Badge variant="outline" className="text-xs border-purple-300 text-purple-600">
                                  {trigger.mlPrediction.confidence}% Confidence
                                </Badge>
                              </div>
                              <Badge variant={trigger.mlPrediction.trend === 'increasing' ? 'destructive' : 'secondary'}>
                                {trigger.mlPrediction.trend}
                              </Badge>
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 grid grid-cols-3 gap-4">
                              <div>Forecasted trigger: {trigger.mlPrediction.forecastedTrigger}</div>
                              <div>Model: {trigger.mlPrediction.aiModel}</div>
                              <div>Data points: {trigger.mlPrediction.dataPoints.toLocaleString()}</div>
                            </div>
                          </div>
                        )}

                        {/* Composite Logic Display */}
                        {trigger.compositeLogic && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Composite Logic</span>
                              <Badge variant="outline" className="text-xs border-blue-300 text-blue-600">
                                {trigger.compositeLogic.operator}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {trigger.compositeLogic.conditions.map((condition, idx) => (
                                <div key={idx} className="text-xs text-blue-600 dark:text-blue-400 flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded">
                                  <span>{condition.metric.replace('_', ' ')} {condition.operator} {condition.value}</span>
                                  <Badge variant="secondary" className="text-xs">W: {condition.weight}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Automated Response Display */}
                        {trigger.automatedResponse && trigger.automatedResponse.enabled && (
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Settings className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">Automated Response</span>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {trigger.automatedResponse.actions.length} Actions Configured
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                              {trigger.automatedResponse.actions.map((action, idx) => (
                                <div key={idx} className="text-xs text-green-600 dark:text-green-400 flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded">
                                  <span className="capitalize">{action.type.replace('_', ' ')}: {action.target}</span>
                                  {action.delay > 0 && <Badge variant="outline" className="text-xs">Delay: {action.delay}s</Badge>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Escalation Workflow Display */}
                        {trigger.escalationWorkflow && (
                          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Escalation Workflow</span>
                              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                                {trigger.escalationWorkflow.levels.length} Levels
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {trigger.escalationWorkflow.levels.map((level, idx) => (
                                <div key={idx} className="text-xs bg-white dark:bg-gray-800 p-2 rounded border">
                                  <div className="font-medium text-orange-600">Level {level.level}</div>
                                  <div className="text-gray-600 dark:text-gray-400">{level.threshold}s threshold</div>
                                  <div className="text-gray-600 dark:text-gray-400">{level.approvers.join(', ')}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Data Source Status */}
                        {trigger.dataSource && (
                          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getDataSourceStatusIcon(trigger.dataSource.status)}
                                <span className="text-sm font-medium">Data Source</span>
                                <Badge variant="outline" className="text-xs">
                                  {trigger.dataSource.type.toUpperCase()}
                                </Badge>
                                <Badge variant={trigger.dataSource.status === 'connected' ? 'secondary' : 'destructive'} className="text-xs">
                                  {trigger.dataSource.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500">
                                Refresh: {trigger.dataSource.refreshRate}s | Last: {trigger.dataSource.lastUpdate}
                              </div>
                            </div>
                            {trigger.dataSource.endpoint && (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {trigger.dataSource.endpoint}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Recommended Playbooks */}
                        {trigger.recommendedPlaybooks && trigger.recommendedPlaybooks.length > 0 && (
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-4 w-4 text-indigo-600" />
                              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Recommended Playbooks</span>
                              <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-600">
                                {trigger.recommendedPlaybooks.length} Available
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {trigger.recommendedPlaybooks.map((playbook, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200">
                                  {playbook}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {trigger.status === 'triggered' && (
                        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-red-800 dark:text-red-200">
                              <strong>🚨 TRIGGERED:</strong> {trigger.triggeredAt} - Immediate action required
                            </div>
                            <div className="flex space-x-2">
                              <Link href={trigger.recommendedPlaybooks?.[0] ? `/playbook-activation/${trigger.id}/${trigger.recommendedPlaybooks[0]}` : `/scenarios`}>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                  data-testid="button-execute-playbook"
                                >
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  {trigger.recommendedPlaybooks?.[0] ? 'Execute Playbook' : 'Select Playbook'}
                                </Button>
                              </Link>
                              <Button variant="destructive" size="sm">
                                Escalate Now
                              </Button>
                              <Button variant="outline" size="sm">
                                Acknowledge
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {trigger.status === 'active' && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Progress to threshold</span>
                            <span className="text-xs text-gray-500">
                              {Math.round((Number(trigger.currentValue) / Number(trigger.thresholdValue)) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.min((Number(trigger.currentValue) / Number(trigger.thresholdValue)) * 100, 100)} 
                            className="mt-1"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Trigger Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Trigger Analytics & Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98.7%</div>
                  <div className="text-sm text-gray-600">Detection Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1.2s</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">47</div>
                  <div className="text-sm text-gray-600">Prevented Escalations</div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      
      {/* Trigger Configuration Wizard */}
      <TriggerConfigurationWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={() => {
          setIsWizardOpen(false);
        }}
      />
    </PageLayout>
  );
}