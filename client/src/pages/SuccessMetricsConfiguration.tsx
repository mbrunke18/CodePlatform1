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
  { id: 'fri', name: 'Future Readiness Index', icon: Gauge, color: 'text-[#C9A84C]', description: 'Overall organizational readiness score' },
  { id: 'velocity', name: 'Decision Velocity', icon: Zap, color: 'text-[#C9A84C]', description: 'Speed of strategic decision-making' },
  { id: 'coverage', name: 'Scenario Coverage', icon: Shield, color: 'text-[#2B8A6E]', description: 'Percentage of risks with active playbooks' },
  { id: 'roi', name: 'ROI Metrics', icon: DollarSign, color: 'text-[#2B8A6E]', description: 'Return on strategic investments' },
  { id: 'custom', name: 'Custom KPI', icon: BarChart3, color: 'text-[#0A0F2E]', description: 'Organization-specific metrics' },
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

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function SuccessMetricsConfiguration({ embedded }: { embedded?: boolean }) {
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
      return apiRequest('POST', '/api/config/success-metrics', {
        name: metric.name,
        description: metric.description,
        metricType: metric.type,
        targetValue: metric.targetValue,
        currentValue: metric.currentValue,
        baselineValue: metric.baselineValue,
        unit: metric.unit,
        reviewCadence: metric.reviewCadence,
        isActive: metric.isActive,
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
      return apiRequest('DELETE', `/api/config/success-metrics/${id}`);
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
    if (progress >= 80) return 'bg-[#2B8A6E]';
    if (progress >= 50) return 'bg-[#C9A84C]';
    return 'bg-[#0A0F2E]';
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
    <PageLayout embedded={embedded}>
      <div className="page-background min-h-screen bg-transparent p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-[#0A0F2E]">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-[#0A0F2E] hover:text-[#C9A84C] p-1 h-auto">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <span>/</span>
              <span>Configuration</span>
              <span>/</span>
              <span className="text-[#0A0F2E] font-medium">Success Metrics</span>
            </div>
          </div>

          <div className="bg-[#0A0F2E] text-white p-6 rounded-none border border-[#E8E4DC]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 style={{...CG}} className="text-3xl font-bold" data-testid="success-metrics-title">Success Metrics <em style={{ fontStyle: "italic", color: "#DFC178" }}>Configuration</em></h1>
                  <p className="text-white/60 mt-1">Define YOUR success criteria and KPIs</p>
                  <p className="text-white/40 mt-1 text-sm">Track progress toward your strategic goals with custom metrics</p>
                </div>
              </div>
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={() => setIsAddMetricDialogOpen(true)}
                      className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] border-none"
                      data-testid="button-add-metric"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Metric
                    </Button>
                    <Link to="/dashboard">
                      <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </div>
            </div>
          </div>

          {/* FRI Hero Card */}
          <Card className="border-[#E8E4DC] bg-white rounded-none">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-none border-8 border-[#C9A84C]/20 flex items-center justify-center bg-[#F8F7F4]">
                      <div className="text-center">
                        <div style={{...CG}} className="text-4xl font-bold text-[#0A0F2E]">{overallFRI.toFixed(1)}%</div>
                        <div className="text-[10px] uppercase tracking-wider text-[#6B7280]">Current FRI</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 style={{...CG}} className="text-2xl font-bold text-[#0A0F2E]">Future Readiness Index™</h2>
                    <p className="text-[#6B7280] mt-1">Your organization's strategic preparedness score</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-[#6B7280]">Target:</span>
                        <span className="ml-2 text-lg font-semibold text-[#0A0F2E]">{friTarget}%</span>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-[#6B7280]">Improvement:</span>
                        <span className="ml-2 text-lg font-semibold text-[#2B8A6E]">+{(overallFRI - (friMetric?.baselineValue || 0)).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                  <div className="w-64">
                    <div className="flex justify-between text-xs uppercase tracking-wider mb-2">
                      <span className="text-[#6B7280]">Progress to Target</span>
                      <span className="text-[#0A0F2E] font-bold">{friProgress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-[#E8E4DC] overflow-hidden">
                      <div 
                        className="bg-[#C9A84C] h-full transition-all duration-500" 
                        style={{ width: `${friProgress}%` }} 
                      />
                    </div>
                    <p className="text-xs text-[#6B7280] mt-2">
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
                <Card key={metric.id} className="bg-white border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div style={{ width: 3, alignSelf: 'stretch', background: '#C9A84C', flexShrink: 0 }} />
                        <div>
                          <CardTitle style={{...CG}} className="text-[#0A0F2E] text-lg">{metric.name}</CardTitle>
                          <CardDescription className="text-[#6B7280] text-sm">
                            {metric.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B7280] hover:text-[#0A0F2E]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-[#6B7280] hover:text-red-600"
                          onClick={() => handleDeleteMetric(metric.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-[#F8F7F4] rounded-none border border-[#E8E4DC]">
                        <div className="text-[10px] uppercase tracking-wider text-[#6B7280]">Baseline</div>
                        <div className="text-lg font-semibold text-[#6B7280]">
                          {metric.baselineValue}{metric.unit === '%' || metric.unit === 'minutes' ? '' : ' '}{metric.unit}
                        </div>
                      </div>
                      <div className="p-2 bg-[#F8F7F4] rounded-none border border-[#E8E4DC]">
                        <div className="text-[10px] uppercase tracking-wider text-[#6B7280]">Current</div>
                        <div className="text-lg font-semibold text-[#0A0F2E]">
                          {metric.currentValue}{metric.unit === '%' || metric.unit === 'minutes' ? '' : ' '}{metric.unit}
                        </div>
                      </div>
                      <div className="p-2 bg-[#F8F7F4] rounded-none border border-[#E8E4DC]">
                        <div className="text-[10px] uppercase tracking-wider text-[#6B7280]">Target</div>
                        <div className="text-lg font-semibold text-[#2B8A6E]">
                          {metric.targetValue}{metric.unit === '%' || metric.unit === 'minutes' ? '' : ' '}{metric.unit}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs uppercase tracking-wider mb-1">
                        <span className="text-[#6B7280]">Progress</span>
                        <span className={progress >= 80 ? 'text-[#2B8A6E]' : progress >= 50 ? 'text-[#C9A84C]' : 'text-red-600'}>
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#F8F7F4] overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(progress)} transition-all`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    
                    <div className="flex items-center justify-between text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-2 text-[#6B7280]">
                        <RefreshCw className="h-4 w-4" />
                        <span>Review: {metric.reviewCadence}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={metric.isActive ? 'text-[#2B8A6E] border-[#2B8A6E]/30 bg-[#2B8A6E]/5' : 'text-[#6B7280] border-[#E8E4DC]'}
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
            <DialogContent className="max-w-lg bg-white border-[#E8E4DC]">
              <DialogHeader>
                <DialogTitle style={{...CG}} className="flex items-center gap-2 text-[#0A0F2E] text-2xl">
                  <Plus className="h-5 w-5 text-[#C9A84C]" />
                  Add Success Metric
                </DialogTitle>
                <DialogDescription className="text-[#6B7280]">
                  Define a new KPI to track your organization's strategic success
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-[#6B7280]">Metric Type</Label>
                  <Select 
                    value={newMetric.type} 
                    onValueChange={(value: any) => setNewMetric({ ...newMetric, type: value })}
                  >
                    <SelectTrigger className="border-[#E8E4DC]">
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
                  <Label className="text-xs uppercase tracking-wider text-[#6B7280]">Metric Name *</Label>
                  <Input 
                    value={newMetric.name}
                    onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                    placeholder="e.g., Customer Response Time"
                    className="border-[#E8E4DC]"
                    data-testid="input-metric-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-[#6B7280]">Description</Label>
                  <Textarea 
                    value={newMetric.description}
                    onChange={(e) => setNewMetric({ ...newMetric, description: e.target.value })}
                    placeholder="Describe what this metric measures..."
                    className="border-[#E8E4DC]"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-[#6B7280]">Baseline</Label>
                    <Input 
                      type="number"
                      value={newMetric.baselineValue}
                      className="border-[#E8E4DC]"
                      onChange={(e) => setNewMetric({ ...newMetric, baselineValue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-[#6B7280]">Current</Label>
                    <Input 
                      type="number"
                      value={newMetric.currentValue}
                      className="border-[#E8E4DC]"
                      onChange={(e) => setNewMetric({ ...newMetric, currentValue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-[#6B7280]">Target</Label>
                    <Input 
                      type="number"
                      value={newMetric.targetValue}
                      className="border-[#E8E4DC]"
                      onChange={(e) => setNewMetric({ ...newMetric, targetValue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-[#6B7280]">Unit</Label>
                    <Select 
                      value={newMetric.unit} 
                      onValueChange={(value) => setNewMetric({ ...newMetric, unit: value })}
                    >
                      <SelectTrigger className="border-[#E8E4DC]">
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
                    <Label className="text-xs uppercase tracking-wider text-[#6B7280]">Review Cadence</Label>
                    <Select 
                      value={newMetric.reviewCadence} 
                      onValueChange={(value: any) => setNewMetric({ ...newMetric, reviewCadence: value })}
                    >
                      <SelectTrigger className="border-[#E8E4DC]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REVIEW_CADENCES.map((cadence) => (
                          <SelectItem key={cadence.id} value={cadence.id}>
                            {cadence.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddMetricDialogOpen(false)}
                  className="border-[#E8E4DC] text-[#6B7280]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddMetric}
                  disabled={createMetricMutation.isPending}
                  className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"
                >
                  {createMetricMutation.isPending ? 'Creating...' : 'Create Metric'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
        </div>
      </div>
    </PageLayout>
  );
}