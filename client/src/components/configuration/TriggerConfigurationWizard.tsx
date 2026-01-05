import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Target, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  Bell,
  Settings,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Globe,
  Cpu,
  BarChart3,
  Activity,
  Eye,
  Mail,
  MessageSquare,
  Smartphone,
  Webhook,
  PlayCircle,
  Clock
} from 'lucide-react';

interface TriggerConfigurationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editTrigger?: any;
}

const SIGNAL_CATEGORIES = [
  { id: 'competitive', name: 'Competitive Intelligence', icon: Target, color: 'text-purple-500', description: 'Track competitor moves, pricing, market share' },
  { id: 'market', name: 'Market Dynamics', icon: TrendingUp, color: 'text-blue-500', description: 'Monitor market trends, demand shifts, sentiment' },
  { id: 'financial', name: 'Financial Signals', icon: DollarSign, color: 'text-green-500', description: 'Track revenue, margins, cash flow indicators' },
  { id: 'regulatory', name: 'Regulatory & Compliance', icon: Shield, color: 'text-red-500', description: 'Monitor policy changes, compliance requirements' },
  { id: 'supplychain', name: 'Supply Chain', icon: Activity, color: 'text-orange-500', description: 'Track supplier health, logistics, inventory' },
  { id: 'customer', name: 'Customer Signals', icon: Users, color: 'text-indigo-500', description: 'Monitor NPS, churn, satisfaction metrics' },
  { id: 'talent', name: 'Talent & Workforce', icon: Users, color: 'text-pink-500', description: 'Track attrition, engagement, skill gaps' },
  { id: 'geopolitical', name: 'Geopolitical', icon: Globe, color: 'text-amber-500', description: 'Monitor regional stability, trade policies' },
  { id: 'technology', name: 'Technology', icon: Cpu, color: 'text-cyan-500', description: 'Track tech disruptions, infrastructure issues' },
  { id: 'media', name: 'Media & Reputation', icon: Eye, color: 'text-violet-500', description: 'Monitor brand mentions, sentiment, PR issues' },
  { id: 'cyber', name: 'Cybersecurity', icon: Shield, color: 'text-red-600', description: 'Track threat levels, vulnerabilities, incidents' },
  { id: 'economic', name: 'Economic Indicators', icon: BarChart3, color: 'text-emerald-500', description: 'Monitor GDP, inflation, interest rates' },
  { id: 'partnership', name: 'Partnership & Alliance', icon: Users, color: 'text-teal-500', description: 'Track partner health, joint venture status' },
  { id: 'execution', name: 'Execution Velocity', icon: Zap, color: 'text-yellow-500', description: 'Monitor project timelines, delivery metrics' },
  { id: 'behavior', name: 'Behavioral Analytics', icon: Activity, color: 'text-rose-500', description: 'Track user patterns, engagement shifts' },
  { id: 'innovation', name: 'Innovation Pipeline', icon: PlayCircle, color: 'text-sky-500', description: 'Monitor R&D progress, patent filings' },
];

const SIGNAL_FIELDS: Record<string, Array<{ id: string; name: string; unit: string }>> = {
  competitive: [
    { id: 'market_share_change', name: 'Market Share Change', unit: '%' },
    { id: 'competitor_price_change', name: 'Competitor Price Change', unit: '%' },
    { id: 'new_product_launches', name: 'New Product Launches', unit: 'count' },
    { id: 'competitor_hiring', name: 'Competitor Hiring Activity', unit: 'count' },
  ],
  market: [
    { id: 'demand_index', name: 'Demand Index', unit: 'score' },
    { id: 'market_sentiment', name: 'Market Sentiment Score', unit: '%' },
    { id: 'search_volume', name: 'Search Volume Change', unit: '%' },
    { id: 'industry_growth', name: 'Industry Growth Rate', unit: '%' },
  ],
  financial: [
    { id: 'revenue_variance', name: 'Revenue Variance', unit: '%' },
    { id: 'margin_change', name: 'Gross Margin Change', unit: '%' },
    { id: 'cash_flow_ratio', name: 'Cash Flow Ratio', unit: 'ratio' },
    { id: 'debt_to_equity', name: 'Debt to Equity Ratio', unit: 'ratio' },
  ],
  regulatory: [
    { id: 'compliance_score', name: 'Compliance Score', unit: '%' },
    { id: 'policy_change_count', name: 'Policy Changes', unit: 'count' },
    { id: 'audit_findings', name: 'Audit Findings', unit: 'count' },
    { id: 'regulatory_risk', name: 'Regulatory Risk Score', unit: 'score' },
  ],
  supplychain: [
    { id: 'supplier_health', name: 'Supplier Health Score', unit: '%' },
    { id: 'lead_time_variance', name: 'Lead Time Variance', unit: 'days' },
    { id: 'inventory_turnover', name: 'Inventory Turnover', unit: 'ratio' },
    { id: 'disruption_risk', name: 'Disruption Risk Level', unit: 'score' },
  ],
  customer: [
    { id: 'nps_score', name: 'Net Promoter Score', unit: 'score' },
    { id: 'churn_rate', name: 'Churn Rate', unit: '%' },
    { id: 'csat_score', name: 'Customer Satisfaction', unit: '%' },
    { id: 'ticket_volume', name: 'Support Ticket Volume', unit: 'count' },
  ],
  talent: [
    { id: 'attrition_rate', name: 'Attrition Rate', unit: '%' },
    { id: 'engagement_score', name: 'Employee Engagement', unit: '%' },
    { id: 'time_to_hire', name: 'Time to Hire', unit: 'days' },
    { id: 'training_completion', name: 'Training Completion', unit: '%' },
  ],
  geopolitical: [
    { id: 'stability_index', name: 'Political Stability Index', unit: 'score' },
    { id: 'trade_risk', name: 'Trade Risk Level', unit: 'score' },
    { id: 'currency_volatility', name: 'Currency Volatility', unit: '%' },
    { id: 'sanctions_risk', name: 'Sanctions Risk', unit: 'score' },
  ],
  technology: [
    { id: 'system_uptime', name: 'System Uptime', unit: '%' },
    { id: 'tech_debt_score', name: 'Technical Debt Score', unit: 'score' },
    { id: 'deployment_frequency', name: 'Deployment Frequency', unit: 'per_week' },
    { id: 'incident_count', name: 'Incident Count', unit: 'count' },
  ],
  media: [
    { id: 'sentiment_score', name: 'Brand Sentiment', unit: '%' },
    { id: 'mention_volume', name: 'Media Mentions', unit: 'count' },
    { id: 'share_of_voice', name: 'Share of Voice', unit: '%' },
    { id: 'crisis_probability', name: 'Crisis Probability', unit: '%' },
  ],
  cyber: [
    { id: 'threat_level', name: 'Threat Level', unit: 'score' },
    { id: 'vulnerability_count', name: 'Open Vulnerabilities', unit: 'count' },
    { id: 'failed_logins', name: 'Failed Login Attempts', unit: 'count' },
    { id: 'anomaly_score', name: 'Anomaly Score', unit: 'score' },
  ],
  economic: [
    { id: 'gdp_growth', name: 'GDP Growth Forecast', unit: '%' },
    { id: 'inflation_rate', name: 'Inflation Rate', unit: '%' },
    { id: 'interest_rate', name: 'Interest Rate Change', unit: '%' },
    { id: 'unemployment_rate', name: 'Unemployment Rate', unit: '%' },
  ],
  partnership: [
    { id: 'partner_health', name: 'Partner Health Score', unit: '%' },
    { id: 'contract_risk', name: 'Contract Risk', unit: 'score' },
    { id: 'revenue_share', name: 'Revenue Share Variance', unit: '%' },
    { id: 'sla_compliance', name: 'SLA Compliance', unit: '%' },
  ],
  execution: [
    { id: 'project_velocity', name: 'Project Velocity', unit: 'score' },
    { id: 'deadline_variance', name: 'Deadline Variance', unit: 'days' },
    { id: 'resource_utilization', name: 'Resource Utilization', unit: '%' },
    { id: 'milestone_completion', name: 'Milestone Completion', unit: '%' },
  ],
  behavior: [
    { id: 'engagement_rate', name: 'User Engagement Rate', unit: '%' },
    { id: 'session_duration', name: 'Avg Session Duration', unit: 'minutes' },
    { id: 'feature_adoption', name: 'Feature Adoption', unit: '%' },
    { id: 'conversion_rate', name: 'Conversion Rate', unit: '%' },
  ],
  innovation: [
    { id: 'rd_velocity', name: 'R&D Velocity', unit: 'score' },
    { id: 'patent_filings', name: 'Patent Filings', unit: 'count' },
    { id: 'prototype_completion', name: 'Prototype Completion', unit: '%' },
    { id: 'innovation_index', name: 'Innovation Index', unit: 'score' },
  ],
};

const OPERATORS = [
  { id: 'gt', name: 'Greater than', symbol: '>' },
  { id: 'lt', name: 'Less than', symbol: '<' },
  { id: 'gte', name: 'Greater than or equal', symbol: '>=' },
  { id: 'lte', name: 'Less than or equal', symbol: '<=' },
  { id: 'eq', name: 'Equal to', symbol: '=' },
  { id: 'change', name: 'Changes by', symbol: '±' },
  { id: 'drop', name: 'Drops by', symbol: '↓' },
  { id: 'spike', name: 'Spikes by', symbol: '↑' },
];

const SEVERITY_LEVELS = [
  { id: 'low', name: 'Low', color: 'bg-blue-100 text-blue-800', description: 'Informational, monitor only' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Requires attention within 24 hours' },
  { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800', description: 'Urgent, requires action within 4 hours' },
  { id: 'critical', name: 'Critical', color: 'bg-red-100 text-red-800', description: 'Emergency, immediate response required' },
];

const MONITORING_FREQUENCIES = [
  { id: 'realtime', name: 'Real-time', description: 'Continuous monitoring' },
  { id: '5min', name: 'Every 5 minutes', description: 'Near real-time' },
  { id: '15min', name: 'Every 15 minutes', description: 'Frequent checks' },
  { id: 'hourly', name: 'Hourly', description: 'Standard monitoring' },
  { id: 'daily', name: 'Daily', description: 'Daily digest' },
];

export default function TriggerConfigurationWizard({ 
  isOpen, 
  onClose, 
  onSuccess,
  editTrigger 
}: TriggerConfigurationWizardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Form state
  const [triggerName, setTriggerName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [operator, setOperator] = useState('gt');
  const [thresholdValue, setThresholdValue] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [monitoringFrequency, setMonitoringFrequency] = useState('realtime');
  const [autoActivatePlaybook, setAutoActivatePlaybook] = useState(false);
  
  // Notification settings
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [escalationEnabled, setEscalationEnabled] = useState(true);
  const [escalationTimeout, setEscalationTimeout] = useState('30');
  
  // Playbook mapping
  const [selectedPlaybooks, setSelectedPlaybooks] = useState<string[]>([]);
  
  // Fetch available playbooks
  const { data: playbooks } = useQuery({
    queryKey: ['/api/playbooks'],
  });
  
  // Create trigger mutation
  const createTriggerMutation = useMutation({
    mutationFn: async (triggerData: any) => {
      return apiRequest('POST', '/api/config/triggers', triggerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/triggers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/triggers'] });
      toast({
        title: 'Trigger Created',
        description: 'Your custom trigger has been configured successfully.',
      });
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create trigger',
        variant: 'destructive',
      });
    },
  });
  
  const handleClose = () => {
    setStep(1);
    setTriggerName('');
    setDescription('');
    setSelectedCategory('');
    setSelectedField('');
    setOperator('gt');
    setThresholdValue('');
    setSeverity('medium');
    setMonitoringFrequency('realtime');
    setAutoActivatePlaybook(false);
    setEmailEnabled(true);
    setSlackEnabled(false);
    setInAppEnabled(true);
    setWebhookEnabled(false);
    setEscalationEnabled(true);
    setEscalationTimeout('30');
    setSelectedPlaybooks([]);
    onClose();
  };
  
  const canProceed = () => {
    switch (step) {
      case 1:
        return triggerName && selectedCategory;
      case 2:
        return selectedField && operator && thresholdValue;
      case 3:
        return emailEnabled || slackEnabled || inAppEnabled || webhookEnabled;
      case 4:
        return true;
      default:
        return false;
    }
  };
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = () => {
    const selectedFieldData = SIGNAL_FIELDS[selectedCategory]?.find(f => f.id === selectedField);
    
    const triggerData = {
      name: triggerName,
      description,
      category: selectedCategory,
      signalType: selectedField,
      conditionField: selectedFieldData?.name || selectedField,
      conditionOperator: operator,
      conditionValue: parseFloat(thresholdValue),
      conditionUnit: selectedFieldData?.unit || '',
      severity,
      monitoringFrequency,
      autoActivatePlaybook,
      notificationChannels: {
        email: emailEnabled,
        slack: slackEnabled,
        inApp: inAppEnabled,
        webhook: webhookEnabled,
      },
      escalationEnabled,
      escalationTimeoutMinutes: parseInt(escalationTimeout),
      recommendedPlaybooks: selectedPlaybooks,
    };
    
    createTriggerMutation.mutate(triggerData);
  };
  
  const getFieldUnit = () => {
    if (!selectedCategory || !selectedField) return '';
    const field = SIGNAL_FIELDS[selectedCategory]?.find(f => f.id === selectedField);
    return field?.unit || '';
  };
  
  const togglePlaybook = (playbookId: string) => {
    setSelectedPlaybooks(prev => 
      prev.includes(playbookId)
        ? prev.filter(id => id !== playbookId)
        : [...prev, playbookId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-6 w-6 text-blue-600" />
            {editTrigger ? 'Edit Trigger' : 'Create Custom Trigger'}
          </DialogTitle>
          <DialogDescription>
            Define YOUR monitoring conditions - M AI will monitor 24/7 and alert you when triggers fire
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
            <span className="text-sm font-medium">
              {step === 1 && 'Category & Basics'}
              {step === 2 && 'Conditions'}
              {step === 3 && 'Notifications'}
              {step === 4 && 'Playbook Mapping'}
            </span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          
          <div className="flex justify-between mt-2">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`flex items-center gap-1 text-xs ${s <= step ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  s < step ? 'bg-blue-600 text-white' : 
                  s === step ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  {s < step ? <Check className="h-3 w-3" /> : s}
                </div>
                <span className="hidden md:inline">
                  {s === 1 && 'Category'}
                  {s === 2 && 'Conditions'}
                  {s === 3 && 'Notify'}
                  {s === 4 && 'Playbooks'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Step 1: Category & Basics */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trigger-name">Trigger Name *</Label>
                <Input
                  id="trigger-name"
                  placeholder="e.g., NPS Score Drop Alert"
                  value={triggerName}
                  onChange={(e) => setTriggerName(e.target.value)}
                  data-testid="input-trigger-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe when this trigger should fire and what action should be taken..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  data-testid="input-trigger-description"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Select Signal Category *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SIGNAL_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <Card 
                      key={category.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? 'ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedField('');
                      }}
                      data-testid={`category-card-${category.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center gap-2">
                          <Icon className={`h-6 w-6 ${category.color}`} />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {selectedCategory && (
                <p className="text-sm text-gray-500 mt-2">
                  {SIGNAL_CATEGORIES.find(c => c.id === selectedCategory)?.description}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Step 2: Conditions */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Category: {SIGNAL_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Define the specific condition that will trigger an alert
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Select Metric to Monitor *</Label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger data-testid="select-field">
                    <SelectValue placeholder="Choose a metric..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SIGNAL_FIELDS[selectedCategory]?.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name} ({field.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger data-testid="select-operator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        {op.symbol} {op.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Threshold Value *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Enter value..."
                    value={thresholdValue}
                    onChange={(e) => setThresholdValue(e.target.value)}
                    data-testid="input-threshold"
                  />
                  <span className="text-sm text-gray-500 min-w-[60px]">
                    {getFieldUnit()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Severity Level</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger data-testid="select-severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITY_LEVELS.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        <div className="flex items-center gap-2">
                          <Badge className={level.color}>{level.name}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {SEVERITY_LEVELS.find(l => l.id === severity)?.description}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Monitoring Frequency</Label>
              <Select value={monitoringFrequency} onValueChange={setMonitoringFrequency}>
                <SelectTrigger data-testid="select-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONITORING_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.id} value={freq.id}>
                      <div className="flex flex-col">
                        <span>{freq.name}</span>
                        <span className="text-xs text-gray-500">{freq.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Preview */}
            {selectedField && thresholdValue && (
              <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Trigger Preview</span>
                  </div>
                  <p className="text-lg font-medium">
                    Alert when{' '}
                    <span className="text-blue-600">
                      {SIGNAL_FIELDS[selectedCategory]?.find(f => f.id === selectedField)?.name}
                    </span>{' '}
                    <span className="text-orange-600">
                      {OPERATORS.find(o => o.id === operator)?.symbol} {thresholdValue} {getFieldUnit()}
                    </span>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* Step 3: Notifications */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-800 dark:text-amber-200">
                  Configure how you want to be notified when this trigger fires
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Notification Channels</Label>
              
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Send email alerts to configured recipients</p>
                      </div>
                    </div>
                    <Switch 
                      checked={emailEnabled} 
                      onCheckedChange={setEmailEnabled}
                      data-testid="switch-email"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Slack Notifications</p>
                        <p className="text-sm text-gray-500">Post alerts to Slack channels</p>
                      </div>
                    </div>
                    <Switch 
                      checked={slackEnabled} 
                      onCheckedChange={setSlackEnabled}
                      data-testid="switch-slack"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">In-App Notifications</p>
                        <p className="text-sm text-gray-500">Show alerts in the M platform</p>
                      </div>
                    </div>
                    <Switch 
                      checked={inAppEnabled} 
                      onCheckedChange={setInAppEnabled}
                      data-testid="switch-in-app"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Webhook className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Webhook Integration</p>
                        <p className="text-sm text-gray-500">Send data to external systems via webhook</p>
                      </div>
                    </div>
                    <Switch 
                      checked={webhookEnabled} 
                      onCheckedChange={setWebhookEnabled}
                      data-testid="switch-webhook"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Escalation Rules</Label>
              
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Auto-Escalate</p>
                        <p className="text-sm text-gray-500">Automatically escalate if not acknowledged</p>
                      </div>
                    </div>
                    <Switch 
                      checked={escalationEnabled} 
                      onCheckedChange={setEscalationEnabled}
                      data-testid="switch-escalation"
                    />
                  </div>
                  
                  {escalationEnabled && (
                    <div className="ml-8 space-y-2">
                      <Label>Escalation Timeout (minutes)</Label>
                      <Select value={escalationTimeout} onValueChange={setEscalationTimeout}>
                        <SelectTrigger className="w-48" data-testid="select-timeout">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Alert will be escalated to the next level if not acknowledged within this time
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Step 4: Playbook Mapping */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Link playbooks to this trigger for faster response
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-semibold">Auto-Activate Playbook</Label>
                <p className="text-sm text-gray-500">Automatically activate selected playbook when trigger fires</p>
              </div>
              <Switch 
                checked={autoActivatePlaybook} 
                onCheckedChange={setAutoActivatePlaybook}
                data-testid="switch-auto-activate"
              />
            </div>
            
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Recommended Playbooks</Label>
              <p className="text-sm text-gray-500">
                Select playbooks that should be suggested when this trigger fires
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {Array.isArray(playbooks) && playbooks.length > 0 ? (
                  playbooks.map((playbook: any) => (
                    <Card 
                      key={playbook.id}
                      className={`cursor-pointer transition-all ${
                        selectedPlaybooks.includes(playbook.id)
                          ? 'ring-2 ring-green-600 bg-green-50 dark:bg-green-900/20'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => togglePlaybook(playbook.id)}
                      data-testid={`playbook-card-${playbook.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{playbook.name || playbook.title}</p>
                            <p className="text-sm text-gray-500">{playbook.category}</p>
                          </div>
                          {selectedPlaybooks.includes(playbook.id) && (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-2">
                    <CardContent className="p-8 text-center">
                      <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No playbooks available</p>
                      <p className="text-sm text-gray-500">Create playbooks first to link them to triggers</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Summary */}
            <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Trigger Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium">{triggerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium">{SIGNAL_CATEGORIES.find(c => c.id === selectedCategory)?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Condition:</span>
                    <p className="font-medium">
                      {SIGNAL_FIELDS[selectedCategory]?.find(f => f.id === selectedField)?.name}{' '}
                      {OPERATORS.find(o => o.id === operator)?.symbol} {thresholdValue} {getFieldUnit()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Severity:</span>
                    <Badge className={SEVERITY_LEVELS.find(l => l.id === severity)?.color}>
                      {severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Notifications:</span>
                    <div className="flex gap-1 mt-1">
                      {emailEnabled && <Badge variant="outline">Email</Badge>}
                      {slackEnabled && <Badge variant="outline">Slack</Badge>}
                      {inAppEnabled && <Badge variant="outline">In-App</Badge>}
                      {webhookEnabled && <Badge variant="outline">Webhook</Badge>}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Linked Playbooks:</span>
                    <p className="font-medium">{selectedPlaybooks.length} selected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || createTriggerMutation.isPending}
              data-testid="button-next"
            >
              {createTriggerMutation.isPending ? (
                'Creating...'
              ) : step === totalSteps ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create Trigger
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}