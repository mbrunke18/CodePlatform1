import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { 
  Target,
  TrendingUp,
  BarChart3,
  Clock,
  DollarSign,
  Users,
  Zap,
  Shield,
  ArrowLeft,
  Home,
  Save,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertTriangle,
  Gauge,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface SuccessMetric {
  id: string;
  name: string;
  type: 'fri' | 'velocity' | 'coverage' | 'roi' | 'custom';
  description: string;
  targetValue: number;
  currentValue: number;
  baselineValue: number;
  unit: string;
  reviewCadence: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  isActive: boolean;
}

const METRIC_TYPES = [
  { id: 'fri', name: 'Future Readiness Index', icon: Gauge, color: 'text-blue-500', description: 'Overall organizational readiness score' },
  { id: 'velocity', name: 'Decision Velocity', icon: Zap, color: 'text-yellow-500', description: 'Speed of strategic decision-making' },
  { id: 'coverage', name: 'Scenario Coverage', icon: Shield, color: 'text-purple-500', description: 'Percentage of risks with active playbooks' },
  { id: 'roi', name: 'ROI Metrics', icon: DollarSign, color: 'text-green-500', description: 'Return on strategic investments' },
  { id: 'custom', name: 'Custom KPI', icon: BarChart3, color: 'text-cyan-500', description: 'Organization-specific metrics' },
];

const REVIEW_CADENCES = [
  { id: 'daily', name: 'Daily', description: 'Review every day' },
  { id: 'weekly', name: 'Weekly', description: 'Review every week' },
  { id: 'monthly', name: 'Monthly', description: 'Review every month' },
  { id: 'quarterly', name: 'Quarterly', description: 'Review every quarter' },
];

const DEFAULT_METRICS: SuccessMetric[] = [
  { 
    id: '1', 
    name: 'Future Readiness Index', 
    type: 'fri', 
    description: 'Overall organizational readiness score measuring strategic preparedness across all domains',
    targetValue: 84.4,
    currentValue: 72.3,
    baselineValue: 58.1,
    unit: '%',
    reviewCadence: 'weekly',
    isActive: true,
  },
  { 
    id: '2', 
    name: 'Decision Velocity', 
    type: 'velocity', 
    description: 'Average time from trigger detection to coordinated response initiation',
    targetValue: 12,
    currentValue: 18,
    baselineValue: 45,
    unit: 'minutes',
    reviewCadence: 'daily',
    isActive: true,
  },
  { 
    id: '3', 
    name: 'Scenario Coverage', 
    type: 'coverage', 
    description: 'Percentage of identified risk scenarios with active, tested playbooks',
    targetValue: 95,
    currentValue: 78,
    baselineValue: 35,
    unit: '%',
    reviewCadence: 'monthly',
    isActive: true,
  },
  { 
    id: '4', 
    name: 'Stakeholder Coordination', 
    type: 'custom', 
    description: 'Number of stakeholders actively engaged in execution coordination',
    targetValue: 30,
    currentValue: 24,
    baselineValue: 8,
    unit: 'people',
    reviewCadence: 'weekly',
    isActive: true,
  },
];

export default function SuccessMetricsConfiguration() {
  const { toast } = useToast();
  const [isAddMetricDialogOpen, setIsAddMetricDialogOpen] = useState(false);
  
  // Form state
  const [newMetric, setNewMetric] = useState<Partial<SuccessMetric>>({
    name: '',
    type: 'custom',
    description: '',
    targetValue: 0,
    currentValue: 0,
    baselineValue: 0,
    unit: '%',
    reviewCadence: 'weekly',
    isActive: true,
  });
  
  // Fetch metrics from API
  const { data: apiMetrics, isLoading } = useQuery<any[]>({
    queryKey: ['/api/config/success-metrics'],
  });
  
  // Use API data if available, otherwise use defaults
  const metrics: SuccessMetric[] = (apiMetrics && apiMetrics.length > 0) 
    ? apiMetrics.map((m: any) => ({
        id: m.id,
        name: m.name,
        type: m.metric_type || m.metricType || 'custom',
        description: m.description || '',
        targetValue: parseFloat(m.target_value || m.targetValue) || 0,
        currentValue: parseFloat(m.current_value || m.currentValue) || 0,
        baselineValue: parseFloat(m.baseline_value || m.baselineValue) || 0,
        unit: m.unit || '%',
        reviewCadence: m.review_cadence || m.reviewCadence || 'weekly',
        isActive: m.is_active ?? m.isActive ?? true,
      }))
    : DEFAULT_METRICS;
  
  // Create metric mutation
  const createMetricMutation = useMutation({
    mutationFn: async (metric: Partial<SuccessMetric>) => {
      return apiRequest('/api/config/success-metrics', {
        method: 'POST',
        body: JSON.stringify({
          name: metric.name,
          description: metric.description,
          metricType: metric.type,
          targetValue: metric.targetValue,
          currentValue: metric.currentValue,
          baselineValue: metric.baselineValue,
          unit: metric.unit,
          reviewCadence: metric.reviewCadence,
          isActive: metric.isActive,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/success-metrics'] });
      toast({ title: 'Success', description: 'Metric created successfully' });
      setIsAddMetricDialogOpen(false);
      setNewMetric({
        name: '',
        type: 'custom',
        description: '',
        targetValue: 0,
        currentValue: 0,
        baselineValue: 0,
        unit: '%',
        reviewCadence: 'weekly',
        isActive: true,
      });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create metric', variant: 'destructive' });
    },
  });
  
  // Delete metric mutation
  const deleteMetricMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/config/success-metrics/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/success-metrics'] });
      toast({ title: 'Deleted', description: 'Metric removed' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete metric', variant: 'destructive' });
    },
  });
  
  // Local state for metrics that aren't persisted yet (for demo)
  const [localMetrics, setLocalMetrics] = useState<SuccessMetric[]>([]);
  
  // Combine API metrics with local metrics for display
  const allMetrics = [...metrics, ...localMetrics.filter(lm => !metrics.find(m => m.id === lm.id))];
  
  const calculateProgress = (current: number, baseline: number, target: number) => {
    if (target === baseline) return 0;
    const progress = ((current - baseline) / (target - baseline)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const handleAddMetric = () => {
    if (!newMetric.name) {
      toast({ title: 'Error', description: 'Metric name is required', variant: 'destructive' });
      return;
    }
    
    // Try to save to API
    createMetricMutation.mutate(newMetric);
  };
  
  const handleDeleteMetric = (id: string) => {
    // Try to delete from API
    deleteMetricMutation.mutate(id);
  };
  
  const getMetricTypeInfo = (type: string) => {
    return METRIC_TYPES.find(t => t.id === type) || METRIC_TYPES[4];
  };

  // Calculate overall FRI
  const friMetric = metrics.find(m => m.type === 'fri');
  const overallFRI = friMetric?.currentValue || 0;
  const friTarget = friMetric?.targetValue || 84.4;
  const friProgress = friMetric ? calculateProgress(friMetric.currentValue, friMetric.baselineValue, friMetric.targetValue) : 0;

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
              <span>Configuration</span>
              <span>/</span>
              <span className="text-white">Success Metrics</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold" data-testid="success-metrics-title">Success Metrics Configuration</h1>
                  <p className="text-amber-100 mt-1">Define YOUR success criteria and KPIs</p>
                  <p className="text-amber-200 mt-1 text-sm">Track progress toward your strategic goals with custom metrics</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setIsAddMetricDialogOpen(true)}
                  className="bg-white text-amber-600 hover:bg-amber-50"
                  data-testid="button-add-metric"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Metric
                </Button>
                <Link to="/">
                  <Button variant="secondary" className="bg-amber-700 hover:bg-amber-800 text-amber-100 border-amber-600">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* FRI Hero Card */}
          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-900/30 to-orange-900/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-amber-500/30 flex items-center justify-center bg-gray-900">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-amber-400">{overallFRI.toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">Current FRI</div>
                      </div>
                    </div>
                    <div className="absolute -right-2 -top-2 w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Future Readiness Index™</h2>
                    <p className="text-gray-400 mt-1">Your organization's strategic preparedness score</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div>
                        <span className="text-sm text-gray-400">Target:</span>
                        <span className="ml-2 text-lg font-semibold text-amber-400">{friTarget}%</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Improvement:</span>
                        <span className="ml-2 text-lg font-semibold text-green-400">+{(overallFRI - (friMetric?.baselineValue || 0)).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-64">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress to Target</span>
                    <span className="text-amber-400">{friProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={friProgress} className="h-3" />
                  <p className="text-xs text-gray-500 mt-2">
                    {friProgress >= 100 ? 'Target achieved!' : `${(friTarget - overallFRI).toFixed(1)}% remaining to target`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric) => {
              const typeInfo = getMetricTypeInfo(metric.type);
              const TypeIcon = typeInfo.icon;
              const progress = calculateProgress(metric.currentValue, metric.baselineValue, metric.targetValue);
              
              return (
                <Card key={metric.id} className="bg-gray-800/50 border-gray-700 hover:border-amber-500/50 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-700`}>
                          <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{metric.name}</CardTitle>
                          <CardDescription className="text-gray-400 text-sm">
                            {metric.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                          onClick={() => handleDeleteMetric(metric.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-gray-700/50 rounded-lg">
                        <div className="text-xs text-gray-400">Baseline</div>
                        <div className="text-lg font-semibold text-gray-300">
                          {metric.baselineValue}{metric.unit === '%' || metric.unit === 'minutes' ? '' : ' '}{metric.unit}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-700/50 rounded-lg border-2 border-amber-500/30">
                        <div className="text-xs text-gray-400">Current</div>
                        <div className="text-lg font-semibold text-amber-400">
                          {metric.currentValue}{metric.unit === '%' || metric.unit === 'minutes' ? '' : ' '}{metric.unit}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-700/50 rounded-lg">
                        <div className="text-xs text-gray-400">Target</div>
                        <div className="text-lg font-semibold text-green-400">
                          {metric.targetValue}{metric.unit === '%' || metric.unit === 'minutes' ? '' : ' '}{metric.unit}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className={progress >= 80 ? 'text-green-400' : progress >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(progress)} transition-all`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <RefreshCw className="h-4 w-4" />
                        <span>Review: {metric.reviewCadence}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={metric.isActive ? 'text-green-400 border-green-500/30' : 'text-gray-400 border-gray-500/30'}
                      >
                        {metric.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add Metric Dialog */}
          <Dialog open={isAddMetricDialogOpen} onOpenChange={setIsAddMetricDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-amber-500" />
                  Add Success Metric
                </DialogTitle>
                <DialogDescription>
                  Define a new KPI to track your organization's strategic success
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Metric Type</Label>
                  <Select 
                    value={newMetric.type} 
                    onValueChange={(value: any) => setNewMetric({ ...newMetric, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {METRIC_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <type.icon className={`h-4 w-4 ${type.color}`} />
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Metric Name *</Label>
                  <Input 
                    value={newMetric.name}
                    onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                    placeholder="e.g., Customer Response Time"
                    data-testid="input-metric-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    value={newMetric.description}
                    onChange={(e) => setNewMetric({ ...newMetric, description: e.target.value })}
                    placeholder="Describe what this metric measures..."
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Baseline</Label>
                    <Input 
                      type="number"
                      value={newMetric.baselineValue}
                      onChange={(e) => setNewMetric({ ...newMetric, baselineValue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current</Label>
                    <Input 
                      type="number"
                      value={newMetric.currentValue}
                      onChange={(e) => setNewMetric({ ...newMetric, currentValue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target</Label>
                    <Input 
                      type="number"
                      value={newMetric.targetValue}
                      onChange={(e) => setNewMetric({ ...newMetric, targetValue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select 
                      value={newMetric.unit} 
                      onValueChange={(value) => setNewMetric({ ...newMetric, unit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="%">Percentage (%)</SelectItem>
                        <SelectItem value="$">Currency ($)</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="people">People</SelectItem>
                        <SelectItem value="score">Score</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Review Cadence</Label>
                    <Select 
                      value={newMetric.reviewCadence} 
                      onValueChange={(value: any) => setNewMetric({ ...newMetric, reviewCadence: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REVIEW_CADENCES.map((cadence) => (
                          <SelectItem key={cadence.id} value={cadence.id}>{cadence.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMetricDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMetric} className="bg-amber-600 hover:bg-amber-700" data-testid="button-save-metric">
                  <Save className="h-4 w-4 mr-2" />
                  Save Metric
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
        </div>
      </div>
    </PageLayout>
  );
}