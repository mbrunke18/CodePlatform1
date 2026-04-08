import { useState, useEffect } from 'react';
import { SIGNAL_CATEGORIES as INTEL_CATEGORIES } from '@shared/intelligence-signals';
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
  { id: 'competitive', name: 'Competitive Intelligence', icon: Target, color: 'text-[#C9A84C]', description: 'Track competitor moves, pricing, market share' },
  { id: 'market', name: 'Market Dynamics', icon: TrendingUp, color: 'text-[#0A0F2E]', description: 'Monitor market trends, demand shifts, sentiment' },
  { id: 'financial', name: 'Financial Signals', icon: DollarSign, color: 'text-green-500', description: 'Track revenue, margins, cash flow indicators' },
  { id: 'regulatory', name: 'Regulatory & Compliance', icon: Shield, color: 'text-red-500', description: 'Monitor policy changes, compliance requirements' },
  { id: 'supplychain', name: 'Supply Chain', icon: Activity, color: 'text-orange-500', description: 'Track supplier health, logistics, inventory' },
  { id: 'customer', name: 'Customer Signals', icon: Users, color: 'text-[#0A0F2E]', description: 'Monitor NPS, churn, satisfaction metrics' },
  { id: 'talent', name: 'Talent & Workforce', icon: Users, color: 'text-pink-500', description: 'Track attrition, engagement, skill gaps' },
  { id: 'geopolitical', name: 'Geopolitical', icon: Globe, color: 'text-amber-500', description: 'Monitor regional stability, trade policies' },
  { id: 'technology', name: 'Technology', icon: Cpu, color: 'text-[#2B8A6E]', description: 'Track tech disruptions, infrastructure issues' },
  { id: 'media', name: 'Media & Reputation', icon: Eye, color: 'text-[#C9A84C]', description: 'Monitor brand mentions, sentiment, PR issues' },
  { id: 'cyber', name: 'Cybersecurity', icon: Shield, color: 'text-red-600', description: 'Track threat levels, vulnerabilities, incidents' },
  { id: 'economic', name: 'Economic Indicators', icon: BarChart3, color: 'text-[#2B8A6E]', description: 'Monitor GDP, inflation, interest rates' },
  { id: 'partnership', name: 'Partnership & Alliance', icon: Users, color: 'text-teal-500', description: 'Track partner health, joint venture status' },
  { id: 'execution', name: 'Execution Velocity', icon: Zap, color: 'text-yellow-500', description: 'Monitor project timelines, delivery metrics' },
  { id: 'behavior', name: 'Behavioral Analytics', icon: Activity, color: 'text-rose-500', description: 'Track user patterns, engagement shifts' },
  { id: 'innovation', name: 'Innovation Pipeline', icon: PlayCircle, color: 'text-sky-500', description: 'Monitor R&D progress, patent filings' },
];


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
  { id: 'low', name: 'Low', color: 'bg-[#F8F7F4] text-[#0A0F2E]', description: 'Informational, monitor only' },
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
  
  // Pre-populate form when editing an existing trigger
  useEffect(() => {
    if (editTrigger && isOpen) {
      setTriggerName(editTrigger.name || '');
      setDescription(editTrigger.description || '');
      setSelectedCategory(editTrigger.category || '');
      setSelectedField(editTrigger.conditions?.field || '');
      setOperator(editTrigger.conditions?.operator || 'gt');
      setThresholdValue(String(editTrigger.conditions?.value || ''));
      setSeverity(editTrigger.severity || 'medium');
      setMonitoringFrequency(editTrigger.monitoringFrequency || 'realtime');
      setAutoActivatePlaybook(editTrigger.autoActivatePlaybook || false);
      setEmailEnabled(editTrigger.notificationSettings?.email ?? true);
      setSlackEnabled(editTrigger.notificationSettings?.slack ?? false);
      setInAppEnabled(editTrigger.notificationSettings?.inApp ?? true);
      setWebhookEnabled(editTrigger.notificationSettings?.webhook ?? false);
      setEscalationEnabled(editTrigger.notificationSettings?.escalation ?? true);
      setEscalationTimeout(String(editTrigger.escalationTimeout || '30'));
      // Use resolved linkedPlaybooks IDs if available, fall back to stored recommendedPlaybooks
      const preloadIds = editTrigger.linkedPlaybooks?.map((p: any) => p.id)
        || editTrigger.recommendedPlaybooks
        || [];
      setSelectedPlaybooks(preloadIds);
    }
  }, [editTrigger, isOpen]);
  
  // Fetch available playbooks (all 170 templates)
  const { data: playbooks } = useQuery({
    queryKey: ['/api/playbooks/templates'],
  });

  // Map trigger categories to playbook domains for smart filtering
  const CATEGORY_TO_DOMAIN: Record<string, string> = {
    competitive: 'Market Dynamics', market: 'Market Dynamics',
    financial: 'Financial Strategy', economic: 'Financial Strategy',
    regulatory: 'Regulatory & Compliance', esg: 'Regulatory & Compliance',
    talent: 'Talent & Leadership', customer: 'Operational Excellence',
    supplychain: 'Operational Excellence', execution: 'Operational Excellence',
    behavior: 'Operational Excellence', partnership: 'Market Opportunities',
    technology: 'Technology & Innovation', cyber: 'Technology & Innovation',
    innovation: 'Technology & Innovation', media: 'Brand & Reputation',
    geopolitical: 'AI Governance',
  };

  const relevantPlaybooks = Array.isArray(playbooks)
    ? playbooks.filter((p: any) => !selectedCategory || p.domain === CATEGORY_TO_DOMAIN[selectedCategory])
    : [];
  const otherPlaybooks = Array.isArray(playbooks)
    ? playbooks.filter((p: any) => selectedCategory && p.domain !== CATEGORY_TO_DOMAIN[selectedCategory])
    : [];
  
  // Create/Update trigger mutation
  const saveTriggerMutation = useMutation({
    mutationFn: async (triggerData: any) => {
      if (editTrigger?.id) {
        return apiRequest('PUT', `/api/executive-triggers/${editTrigger.id}`, triggerData);
      }
      return apiRequest('POST', '/api/config/triggers', triggerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/triggers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/triggers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/executive-triggers'] });
      toast({
        title: editTrigger ? 'Trigger Updated' : 'Trigger Created',
        description: editTrigger 
          ? 'Your trigger has been updated successfully.'
          : 'Your custom trigger has been configured successfully.',
      });
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${editTrigger ? 'update' : 'create'} trigger`,
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
    const catDataPoints = INTEL_CATEGORIES.find(c => (c as any).id === selectedCategory)?.dataPoints;
    const selectedFieldData = catDataPoints?.find((dp: any) => dp.id === selectedField);
    
    const triggerData = {
      name: triggerName,
      description,
      category: selectedCategory,
      signalType: selectedField,
      conditionField: selectedFieldData?.name || selectedField,
      conditionOperator: operator,
      conditionValue: parseFloat(thresholdValue),
      conditionUnit: (selectedFieldData as any)?.metricType || '',
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
    
    saveTriggerMutation.mutate(triggerData);
  };
  
  const getFieldUnit = () => {
    if (!selectedCategory || !selectedField) return '';
    const dp = INTEL_CATEGORIES.find(c => (c as any).id === selectedCategory)
      ?.dataPoints?.find((d: any) => d.id === selectedField);
    return (dp as any)?.metricType || '';
  };

  const getFieldName = () => {
    if (!selectedCategory || !selectedField) return selectedField;
    const dp = INTEL_CATEGORIES.find(c => (c as any).id === selectedCategory)
      ?.dataPoints?.find((d: any) => d.id === selectedField);
    return dp?.name || selectedField;
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
            <Target className="h-6 w-6 text-[#0A0F2E]" />
            {editTrigger ? 'Edit Trigger' : 'Create Custom Trigger'}
          </DialogTitle>
          <DialogDescription>
            Define YOUR monitoring conditions - Command OS AI will monitor 24/7 and alert you when triggers fire
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Step {step} of {totalSteps}</span>
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
                className={`flex items-center gap-1 text-xs ${s <= step ? 'text-[#0A0F2E]' : 'text-gray-600 dark:text-gray-200'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  s < step ? 'bg-[#0A0F2E] text-white' : 
                  s === step ? 'bg-[#F8F7F4] text-[#0A0F2E] border-2 border-[#0A0F2E]' : 
                  'bg-gray-100 text-gray-600 dark:text-gray-200'
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
        
        {/* Step 1: Situation & Category */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Situation framing */}
            <div className="p-4 rounded-lg border-l-4" style={{ background: 'rgba(201,168,76,0.06)', borderColor: '#C9A84C' }}>
              <p className="text-sm font-semibold" style={{ color: '#0A0F2E' }}>What strategic situation do you want to prepare for?</p>
              <p className="text-xs text-gray-500 mt-1">Define the scenario — we'll monitor the right signals and surface the right playbook the moment it fires.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { label: 'Competitor price cut', cat: 'competitive', desc: 'Competitor cuts prices significantly' },
                  { label: 'Key executive departure', cat: 'talent', desc: 'Critical leadership role becomes vacant' },
                  { label: 'Regulatory mandate', cat: 'regulatory', desc: 'New regulation requires immediate compliance' },
                  { label: 'Supply chain disruption', cat: 'supplychain', desc: 'Supplier failure or logistics breakdown' },
                  { label: 'Cybersecurity incident', cat: 'cyber', desc: 'Security breach or threat detected' },
                  { label: 'Market share decline', cat: 'market', desc: 'Measurable loss of market position' },
                ].map(ex => (
                  <button key={ex.label}
                    className="text-xs px-2.5 py-1 rounded border font-medium hover:opacity-80 transition-opacity"
                    style={{ background: selectedCategory === ex.cat ? '#0A0F2E' : '#F0EDE8', color: selectedCategory === ex.cat ? '#fff' : '#444', borderColor: selectedCategory === ex.cat ? '#0A0F2E' : '#E8E4DC' }}
                    onClick={() => {
                      setSelectedCategory(ex.cat);
                      if (!triggerName) setTriggerName(ex.label);
                      if (!description) setDescription(ex.desc);
                    }}
                  >{ex.label}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trigger-name">Situation Name *</Label>
                <Input
                  id="trigger-name"
                  placeholder="e.g., Competitor Price Cut Alert"
                  value={triggerName}
                  onChange={(e) => setTriggerName(e.target.value)}
                  data-testid="input-trigger-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">What happens in this situation?</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the scenario and what outcome you want to avoid or capture..."
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
                        isSelected ? 'ring-2 ring-[#0A0F2E] bg-[#0A0F2E] dark:bg-[#0A0F2E]/20' : ''
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
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {SIGNAL_CATEGORIES.find(c => c.id === selectedCategory)?.description}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Step 2: Conditions */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-[#0A0F2E] dark:bg-[#0A0F2E]/20 rounded-lg border border-[#E8E4DC]">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-[#0A0F2E]" />
                <span className="font-medium text-[#0A0F2E] dark:text-[#DFC178]">
                  Category: {SIGNAL_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </span>
              </div>
              <p className="text-sm text-[#0A0F2E] dark:text-[#DFC178]">
                Define the specific condition that will trigger an alert
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Select Data Point to Monitor *</Label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger data-testid="select-field">
                    <SelectValue placeholder="Choose a data point..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INTEL_CATEGORIES.find(c => (c as any).id === selectedCategory)?.dataPoints?.map((dp: any) => (
                      <SelectItem key={dp.id} value={dp.id}>
                        {dp.name} ({dp.metricType || 'value'})
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
                  <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[60px]">
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
                <p className="text-xs text-gray-600 dark:text-gray-300">
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
                        <span className="text-xs text-gray-600 dark:text-gray-300">{freq.description}</span>
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
                    <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-200">Trigger Preview</span>
                  </div>
                  <p className="text-lg font-medium">
                    Alert when{' '}
                    <span className="text-[#0A0F2E]">
                      {getFieldName()}
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
                      <Mail className="h-5 w-5 text-[#0A0F2E]" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Send email alerts to configured recipients</p>
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
                      <MessageSquare className="h-5 w-5 text-[#C9A84C]" />
                      <div>
                        <p className="font-medium">Slack Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Post alerts to Slack channels</p>
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
                        <p className="text-sm text-gray-600 dark:text-gray-300">Show alerts in the Command OS platform</p>
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
                        <p className="text-sm text-gray-600 dark:text-gray-300">Send data to external systems via webhook</p>
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
                        <p className="text-sm text-gray-600 dark:text-gray-300">Automatically escalate if not acknowledged</p>
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
                      <p className="text-xs text-gray-600 dark:text-gray-300">
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
                <p className="text-sm text-gray-600 dark:text-gray-300">Automatically activate selected playbook when trigger fires</p>
              </div>
              <Switch 
                checked={autoActivatePlaybook} 
                onCheckedChange={setAutoActivatePlaybook}
                data-testid="switch-auto-activate"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Link Playbooks to This Trigger</Label>
                <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C' }}>
                  {selectedPlaybooks.length} selected
                </span>
              </div>
              <p className="text-sm text-gray-600">
                When this trigger fires, these playbooks will be immediately surfaced for decision-maker approval and execution.
              </p>

              {relevantPlaybooks.length > 0 && (
                <>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#C9A84C' }}>
                    Recommended for this situation ({relevantPlaybooks.length} playbooks)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto">
                    {relevantPlaybooks.map((playbook: any) => (
                      <div key={playbook.id}
                        className="cursor-pointer p-3 rounded border transition-all hover:opacity-90"
                        style={{
                          background: selectedPlaybooks.includes(playbook.id) ? '#0A0F2E' : '#fff',
                          borderColor: selectedPlaybooks.includes(playbook.id) ? '#0A0F2E' : '#E8E4DC',
                          borderLeft: `3px solid ${selectedPlaybooks.includes(playbook.id) ? '#C9A84C' : '#E8E4DC'}`,
                        }}
                        onClick={() => togglePlaybook(playbook.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: selectedPlaybooks.includes(playbook.id) ? '#fff' : '#0A0F2E' }}>{playbook.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: selectedPlaybooks.includes(playbook.id) ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>{playbook.domain}</p>
                          </div>
                          {selectedPlaybooks.includes(playbook.id) && <Check className="h-4 w-4 flex-shrink-0" style={{ color: '#C9A84C' }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {otherPlaybooks.length > 0 && (
                <>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-2">
                    Other playbooks ({otherPlaybooks.length})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto opacity-70">
                    {otherPlaybooks.map((playbook: any) => (
                      <div key={playbook.id}
                        className="cursor-pointer p-3 rounded border transition-all hover:opacity-90"
                        style={{
                          background: selectedPlaybooks.includes(playbook.id) ? '#0A0F2E' : '#F8F7F4',
                          borderColor: selectedPlaybooks.includes(playbook.id) ? '#0A0F2E' : '#E8E4DC',
                        }}
                        onClick={() => togglePlaybook(playbook.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium" style={{ color: selectedPlaybooks.includes(playbook.id) ? '#fff' : '#0A0F2E' }}>{playbook.name}</p>
                            <p className="text-xs" style={{ color: selectedPlaybooks.includes(playbook.id) ? 'rgba(255,255,255,0.6)' : '#9CA3AF' }}>{playbook.domain}</p>
                          </div>
                          {selectedPlaybooks.includes(playbook.id) && <Check className="h-4 w-4 flex-shrink-0 text-green-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
                    <span className="text-gray-600 dark:text-gray-300">Name:</span>
                    <p className="font-medium">{triggerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Category:</span>
                    <p className="font-medium">{SIGNAL_CATEGORIES.find(c => c.id === selectedCategory)?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Condition:</span>
                    <p className="font-medium">
                      {getFieldName()}{' '}
                      {OPERATORS.find(o => o.id === operator)?.symbol} {thresholdValue} {getFieldUnit()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Severity:</span>
                    <Badge className={SEVERITY_LEVELS.find(l => l.id === severity)?.color}>
                      {severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Notifications:</span>
                    <div className="flex gap-1 mt-1">
                      {emailEnabled && <Badge variant="outline">Email</Badge>}
                      {slackEnabled && <Badge variant="outline">Slack</Badge>}
                      {inAppEnabled && <Badge variant="outline">In-App</Badge>}
                      {webhookEnabled && <Badge variant="outline">Webhook</Badge>}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Linked Playbooks:</span>
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
              disabled={!canProceed() || saveTriggerMutation.isPending}
              data-testid="button-next"
            >
              {saveTriggerMutation.isPending ? (
                editTrigger ? 'Updating...' : 'Creating...'
              ) : step === totalSteps ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {editTrigger ? 'Save Changes' : 'Create Trigger'}
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