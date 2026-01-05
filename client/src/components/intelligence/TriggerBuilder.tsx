/**
 * Visual Trigger Builder
 * 
 * Drag-and-drop interface for executives to define trigger conditions.
 * Allows selecting signal categories, data points, and configuring thresholds.
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  GripVertical,
  Layers,
  Link,
  Play,
  Plus,
  Settings,
  Target,
  Trash2,
  X,
  Zap
} from 'lucide-react';

interface SignalCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
  phase: 'external' | 'internal';
  icon: string;
  color: string;
  dataPoints: DataPoint[];
  recommendedPlaybooks: string[];
}

interface DataPoint {
  id: string;
  name: string;
  description: string;
  metricType: string;
  unit?: string;
  sources: string[];
  defaultThreshold?: {
    operator: string;
    value: number;
    urgency: string;
  };
}

interface SelectedCondition {
  categoryId: string;
  categoryName: string;
  dataPointId: string;
  dataPointName: string;
  operator: string;
  value: string | number;
}

interface TriggerConfig {
  name: string;
  description: string;
  conditions: SelectedCondition[];
  logic: 'any' | 'all' | 'threshold';
  thresholdCount: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  playbookIds: string[];
  autoActivate: boolean;
}

const OPERATORS = [
  { value: 'gte', label: '>= (Greater than or equal)', symbol: '≥' },
  { value: 'gt', label: '> (Greater than)', symbol: '>' },
  { value: 'lte', label: '<= (Less than or equal)', symbol: '≤' },
  { value: 'lt', label: '< (Less than)', symbol: '<' },
  { value: 'eq', label: '= (Equals)', symbol: '=' },
  { value: 'neq', label: '!= (Not equals)', symbol: '≠' },
  { value: 'spike', label: 'Spike (Sudden increase)', symbol: '↗' },
  { value: 'drop', label: 'Drop (Sudden decrease)', symbol: '↘' },
  { value: 'change', label: 'Any change', symbol: 'Δ' },
];

const URGENCY_LEVELS = [
  { value: 'critical', label: 'Critical', color: 'bg-red-500', description: 'Immediate executive action required' },
  { value: 'high', label: 'High', color: 'bg-orange-500', description: 'Requires attention within hours' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Review within 24 hours' },
  { value: 'low', label: 'Low', color: 'bg-blue-500', description: 'Informational, weekly review' },
];

export function TriggerBuilder({ 
  onClose, 
  existingTrigger 
}: { 
  onClose?: () => void;
  existingTrigger?: any;
}) {
  const { toast } = useToast();
  const [step, setStep] = useState<'select' | 'configure' | 'review'>('select');
  const [triggerConfig, setTriggerConfig] = useState<TriggerConfig>({
    name: existingTrigger?.name || '',
    description: existingTrigger?.description || '',
    conditions: [],
    logic: 'any',
    thresholdCount: 2,
    urgency: 'high',
    playbookIds: [],
    autoActivate: false
  });
  const [selectedCategory, setSelectedCategory] = useState<SignalCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Fetch signal catalog
  const { data: catalogResponse } = useQuery<{
    success: boolean;
    data: SignalCategory[];
  }>({
    queryKey: ['/api/intelligence/catalog']
  });

  // Fetch trigger templates
  const { data: templatesResponse } = useQuery<{
    success: boolean;
    data: any[];
  }>({
    queryKey: ['/api/intelligence/templates']
  });

  const catalog = catalogResponse?.data || [];
  const templates = templatesResponse?.data || [];

  // Create trigger mutation
  const createTriggerMutation = useMutation({
    mutationFn: async (config: TriggerConfig) => {
      const payload = {
        name: config.name,
        description: config.description,
        signalCategoryId: config.conditions[0]?.categoryId || 'multi',
        dataPointIds: config.conditions.map(c => c.dataPointId),
        logic: config.logic,
        thresholdCount: config.thresholdCount,
        conditions: {
          logic: config.logic,
          conditions: config.conditions.map(c => ({
            categoryId: c.categoryId,
            dataPointId: c.dataPointId,
            operator: c.operator,
            value: c.value
          }))
        },
        urgency: config.urgency,
        playbookIds: config.playbookIds
      };
      return apiRequest('POST', '/api/intelligence/triggers', payload);
    },
    onSuccess: () => {
      toast({
        title: 'Trigger Created',
        description: 'Your trigger has been created and is now monitoring signals.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/intelligence/triggers'] });
      onClose?.();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create trigger. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const addCondition = (category: SignalCategory, dataPoint: DataPoint) => {
    const newCondition: SelectedCondition = {
      categoryId: category.id,
      categoryName: category.name,
      dataPointId: dataPoint.id,
      dataPointName: dataPoint.name,
      operator: dataPoint.defaultThreshold?.operator || 'gte',
      value: dataPoint.defaultThreshold?.value || 0
    };
    setTriggerConfig(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  };

  const removeCondition = (index: number) => {
    setTriggerConfig(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index: number, field: keyof SelectedCondition, value: any) => {
    setTriggerConfig(prev => ({
      ...prev,
      conditions: prev.conditions.map((c, i) => 
        i === index ? { ...c, [field]: value } : c
      )
    }));
  };

  const applyTemplate = (template: any) => {
    try {
      const conditions = Array.isArray(template.conditions) 
        ? template.conditions.map((c: any) => {
            const category = catalog.find(cat => cat.id === c.signalCategoryId);
            const dataPoint = category?.dataPoints?.find(dp => dp.id === c.dataPointId);
            return {
              categoryId: c.signalCategoryId || '',
              categoryName: category?.name || c.signalCategoryId || 'Unknown',
              dataPointId: c.dataPointId || '',
              dataPointName: dataPoint?.name || c.dataPointId || 'Unknown Signal',
              operator: c.operator || 'gte',
              value: c.value ?? 0
            };
          })
        : [];
      
      setTriggerConfig(prev => ({
        ...prev,
        name: template.name || '',
        description: template.description || '',
        conditions,
        urgency: template.urgency || 'high',
        playbookIds: template.recommendedPlaybooks || []
      }));
      setStep('configure');
    } catch (error) {
      console.error('Error applying template:', error);
      toast({
        title: 'Template Error',
        description: 'Could not apply this template. Try selecting signals manually.',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = () => {
    if (!triggerConfig.name) {
      toast({
        title: 'Name Required',
        description: 'Please provide a name for this trigger.',
        variant: 'destructive'
      });
      return;
    }
    if (triggerConfig.conditions.length === 0) {
      toast({
        title: 'Conditions Required',
        description: 'Please add at least one condition to this trigger.',
        variant: 'destructive'
      });
      return;
    }
    createTriggerMutation.mutate(triggerConfig);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between px-4">
        <StepIndicator 
          step={1} 
          label="Select Signals" 
          active={step === 'select'} 
          completed={step !== 'select'}
        />
        <div className="flex-1 h-px bg-border mx-4"></div>
        <StepIndicator 
          step={2} 
          label="Configure Logic" 
          active={step === 'configure'} 
          completed={step === 'review'}
        />
        <div className="flex-1 h-px bg-border mx-4"></div>
        <StepIndicator 
          step={3} 
          label="Review & Create" 
          active={step === 'review'} 
          completed={false}
        />
      </div>

      {/* Step 1: Select Signals */}
      {step === 'select' && (
        <div className="space-y-6">
          {/* Quick Start Templates */}
          {templates.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Quick Start Templates
                </CardTitle>
                <CardDescription>Pre-configured trigger patterns for common scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {templates.slice(0, 4).map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="h-auto p-4 justify-start flex-col items-start"
                      onClick={() => applyTemplate(template)}
                      data-testid={`template-${template.id}`}
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Conditions */}
          {triggerConfig.conditions.length > 0 && (
            <Card className="border-primary/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Selected Conditions ({triggerConfig.conditions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {triggerConfig.conditions.map((condition, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <div>
                          <span className="font-medium">{condition.dataPointName}</span>
                          <span className="text-muted-foreground mx-2">
                            {OPERATORS.find(o => o.value === condition.operator)?.symbol || condition.operator}
                          </span>
                          <span className="font-mono">{condition.value}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {condition.categoryName}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(index)}
                        data-testid={`remove-condition-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Signal Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4" />
                Signal Categories
              </CardTitle>
              <CardDescription>Select data points to monitor</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {catalog.map((category) => (
                    <div key={category.id} className="border rounded-lg overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors"
                        onClick={() => toggleCategory(category.id)}
                        data-testid={`category-toggle-${category.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="font-medium">{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.dataPoints.length} signals
                          </Badge>
                        </div>
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      {expandedCategories.has(category.id) && (
                        <div className="border-t bg-muted/30 p-3 space-y-2">
                          {category.dataPoints.map((dataPoint) => {
                            const isSelected = triggerConfig.conditions.some(
                              c => c.categoryId === category.id && c.dataPointId === dataPoint.id
                            );
                            return (
                              <div
                                key={dataPoint.id}
                                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                                  isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
                                }`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{dataPoint.name}</span>
                                    {dataPoint.defaultThreshold && (
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                          dataPoint.defaultThreshold.urgency === 'critical' ? 'border-red-500 text-red-600' :
                                          dataPoint.defaultThreshold.urgency === 'high' ? 'border-orange-500 text-orange-600' :
                                          'border-gray-500'
                                        }`}
                                      >
                                        {dataPoint.defaultThreshold.urgency}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {dataPoint.description}
                                  </p>
                                </div>
                                <Button
                                  variant={isSelected ? "secondary" : "outline"}
                                  size="sm"
                                  onClick={() => {
                                    if (isSelected) {
                                      const idx = triggerConfig.conditions.findIndex(
                                        c => c.categoryId === category.id && c.dataPointId === dataPoint.id
                                      );
                                      if (idx >= 0) removeCondition(idx);
                                    } else {
                                      addCondition(category, dataPoint);
                                    }
                                  }}
                                  data-testid={`datapoint-select-${dataPoint.id}`}
                                >
                                  {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={() => setStep('configure')}
              disabled={triggerConfig.conditions.length === 0}
              data-testid="button-next-step"
            >
              Configure Logic
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Configure Logic */}
      {step === 'configure' && (
        <div className="space-y-6">
          {/* Trigger Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trigger Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="trigger-name">Trigger Name</Label>
                  <Input
                    id="trigger-name"
                    value={triggerConfig.name}
                    onChange={(e) => setTriggerConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Competitor Product Launch Alert"
                    data-testid="input-trigger-name"
                  />
                </div>
                <div>
                  <Label htmlFor="trigger-description">Description</Label>
                  <Textarea
                    id="trigger-description"
                    value={triggerConfig.description}
                    onChange={(e) => setTriggerConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this trigger monitors..."
                    rows={2}
                    data-testid="input-trigger-description"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condition Logic */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Condition Logic
              </CardTitle>
              <CardDescription>How should conditions be evaluated?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={triggerConfig.logic}
                onValueChange={(value) => setTriggerConfig(prev => ({ 
                  ...prev, 
                  logic: value as 'any' | 'all' | 'threshold' 
                }))}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="any" id="logic-any" />
                  <div className="flex-1">
                    <Label htmlFor="logic-any" className="font-medium">ANY condition triggers</Label>
                    <p className="text-xs text-muted-foreground">Alert when any single condition is met</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="all" id="logic-all" />
                  <div className="flex-1">
                    <Label htmlFor="logic-all" className="font-medium">ALL conditions required</Label>
                    <p className="text-xs text-muted-foreground">Alert only when all conditions are met simultaneously</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="threshold" id="logic-threshold" />
                  <div className="flex-1">
                    <Label htmlFor="logic-threshold" className="font-medium">Threshold (at least N)</Label>
                    <p className="text-xs text-muted-foreground">Alert when a minimum number of conditions are met</p>
                    {triggerConfig.logic === 'threshold' && (
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={triggerConfig.conditions.length}
                          value={triggerConfig.thresholdCount}
                          onChange={(e) => setTriggerConfig(prev => ({ 
                            ...prev, 
                            thresholdCount: parseInt(e.target.value) || 1 
                          }))}
                          className="w-20"
                          data-testid="input-threshold-count"
                        />
                        <span className="text-sm text-muted-foreground">
                          of {triggerConfig.conditions.length} conditions
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Configure Individual Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Condition Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {triggerConfig.conditions.map((condition, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{condition.dataPointName}</div>
                      <Badge variant="outline">{condition.categoryName}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Operator</Label>
                        <Select
                          value={condition.operator}
                          onValueChange={(value) => updateCondition(index, 'operator', value)}
                        >
                          <SelectTrigger data-testid={`select-operator-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OPERATORS.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                <span className="flex items-center gap-2">
                                  <span className="font-mono w-4">{op.symbol}</span>
                                  <span>{op.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Value</Label>
                        <Input
                          type="text"
                          value={condition.value}
                          onChange={(e) => updateCondition(index, 'value', e.target.value)}
                          data-testid={`input-value-${index}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Urgency Level */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Alert Urgency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={triggerConfig.urgency}
                onValueChange={(value) => setTriggerConfig(prev => ({ 
                  ...prev, 
                  urgency: value as 'critical' | 'high' | 'medium' | 'low'
                }))}
                className="grid grid-cols-2 gap-3"
              >
                {URGENCY_LEVELS.map((level) => (
                  <div 
                    key={level.value}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      triggerConfig.urgency === level.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setTriggerConfig(prev => ({ ...prev, urgency: level.value as any }))}
                  >
                    <RadioGroupItem value={level.value} id={`urgency-${level.value}`} />
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                      <div>
                        <Label htmlFor={`urgency-${level.value}`} className="font-medium cursor-pointer">
                          {level.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('select')} data-testid="button-back">
              Back
            </Button>
            <Button onClick={() => setStep('review')} data-testid="button-review">
              Review Trigger
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Create */}
      {step === 'review' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {triggerConfig.name || 'Untitled Trigger'}
              </CardTitle>
              <CardDescription>{triggerConfig.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Conditions Summary */}
              <div>
                <h4 className="font-medium mb-3">Monitoring Conditions</h4>
                <div className="space-y-2">
                  {triggerConfig.conditions.map((condition, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                    >
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{condition.dataPointName}</span>
                      <Badge variant="outline" className="font-mono">
                        {OPERATORS.find(o => o.value === condition.operator)?.symbol} {condition.value}
                      </Badge>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {condition.categoryName}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Link className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 dark:text-blue-200">
                      {triggerConfig.logic === 'any' && 'Alert triggers when ANY condition is met'}
                      {triggerConfig.logic === 'all' && 'Alert triggers when ALL conditions are met'}
                      {triggerConfig.logic === 'threshold' && 
                        `Alert triggers when ${triggerConfig.thresholdCount} or more conditions are met`}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Urgency */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Alert Urgency</span>
                <Badge className={URGENCY_LEVELS.find(l => l.value === triggerConfig.urgency)?.color}>
                  {URGENCY_LEVELS.find(l => l.value === triggerConfig.urgency)?.label}
                </Badge>
              </div>

              <Separator />

              {/* Auto-activate Option */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-activate Playbook</div>
                  <p className="text-sm text-muted-foreground">
                    Automatically recommend playbook activation when triggered
                  </p>
                </div>
                <Switch
                  checked={triggerConfig.autoActivate}
                  onCheckedChange={(checked) => setTriggerConfig(prev => ({ ...prev, autoActivate: checked }))}
                  data-testid="switch-auto-activate"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('configure')} data-testid="button-edit">
                Edit Configuration
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createTriggerMutation.isPending}
                data-testid="button-create-trigger"
              >
                {createTriggerMutation.isPending ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Create Trigger
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

// Step Indicator Component
function StepIndicator({ 
  step, 
  label, 
  active, 
  completed 
}: { 
  step: number; 
  label: string; 
  active: boolean; 
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' :
        completed ? 'bg-green-500 text-white' :
        'bg-muted text-muted-foreground'
      }`}>
        {completed ? <Check className="w-4 h-4" /> : step}
      </div>
      <span className={`text-sm ${active ? 'font-medium' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  );
}

export default TriggerBuilder;
