import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react';

interface TriggerConfigurationPhaseProps {
  data: any;
  onChange: (updates: any) => void;
  organizationId: string;
}

const TRIGGER_TEMPLATES = [
  { name: 'Revenue Decline', signal: 'Monthly Revenue', operator: 'lt', threshold: '10%', category: 'financial' },
  { name: 'On-Time Delivery Drop', signal: 'Delivery Rate', operator: 'lt', threshold: '85%', category: 'operational' },
  { name: 'Churn Rate Spike', signal: 'Customer Churn', operator: 'gt', threshold: '5%', category: 'customer' },
  { name: 'Inventory Shortage', signal: 'Stock Level', operator: 'lt', threshold: '30 days', category: 'supply_chain' },
];

const OPERATORS = [
  { value: 'gt', label: 'Greater than (>)', icon: TrendingUp },
  { value: 'lt', label: 'Less than (<)', icon: TrendingDown },
  { value: 'eq', label: 'Equals (=)', icon: Zap },
];

const PRIORITY_LEVELS = [
  { value: 'critical', label: 'Critical', color: 'bg-red-600/20 text-red-300 border-red-500/50' },
  { value: 'high', label: 'High', color: 'bg-orange-600/20 text-orange-300 border-orange-500/50' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50' },
  { value: 'low', label: 'Low', color: 'bg-blue-600/20 text-blue-300 border-blue-500/50' },
];

export default function TriggerConfigurationPhase({ data, onChange, organizationId }: TriggerConfigurationPhaseProps) {
  const [newTrigger, setNewTrigger] = useState({
    name: '',
    signal: '',
    operator: 'lt' as const,
    threshold: '',
    priority: 'medium' as const,
    confidenceWeight: [100],
  });

  const addTrigger = () => {
    if (newTrigger.name && newTrigger.signal && newTrigger.threshold) {
      const triggers = [...(data.triggers || []), { 
        ...newTrigger, 
        id: Date.now(),
        confidenceWeight: newTrigger.confidenceWeight[0] / 100 
      }];
      onChange({ triggers });
      setNewTrigger({
        name: '',
        signal: '',
        operator: 'lt',
        threshold: '',
        priority: 'medium',
        confidenceWeight: [100],
      });
    }
  };

  const removeTrigger = (id: number) => {
    const triggers = (data.triggers || []).filter((t: any) => t.id !== id);
    onChange({ triggers });
  };

  const applyTemplate = (template: typeof TRIGGER_TEMPLATES[0]) => {
    setNewTrigger({
      ...newTrigger,
      name: template.name,
      signal: template.signal,
      operator: template.operator as any,
      threshold: template.threshold,
    });
  };

  return (
    <div className="space-y-6">
      {/* Template Quick Start */}
      <Card className="border-purple-500/30 bg-purple-950/20">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-purple-300 mb-3">Quick Start Templates</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {TRIGGER_TEMPLATES.map((template, index) => (
              <button
                key={index}
                onClick={() => applyTemplate(template)}
                className="p-3 rounded border border-purple-500/30 bg-slate-900/50 hover:bg-slate-800/50 transition-colors text-left"
                data-testid={`template-trigger-${index}`}
              >
                <p className="text-sm font-medium text-white">{template.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {template.signal} {template.operator === 'lt' ? '<' : '>'} {template.threshold}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Trigger Form */}
      <Card className="border-blue-500/30 bg-slate-900/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-blue-400" />
            Define Monitoring Trigger
          </h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trigger-name" className="text-white">Trigger Name *</Label>
                <Input
                  id="trigger-name"
                  data-testid="input-trigger-name"
                  placeholder="e.g., Revenue Decline Alert"
                  value={newTrigger.name}
                  onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="trigger-signal" className="text-white">Signal to Monitor *</Label>
                <Input
                  id="trigger-signal"
                  data-testid="input-trigger-signal"
                  placeholder="e.g., Monthly Revenue"
                  value={newTrigger.signal}
                  onChange={(e) => setNewTrigger({ ...newTrigger, signal: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">What metric or event should AI monitor?</p>
              </div>

              <div>
                <Label htmlFor="trigger-operator" className="text-white">Condition *</Label>
                <Select 
                  value={newTrigger.operator} 
                  onValueChange={(value: any) => setNewTrigger({ ...newTrigger, operator: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-2" data-testid="select-trigger-operator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((op) => {
                      const Icon = op.icon;
                      return (
                        <SelectItem key={op.value} value={op.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {op.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="trigger-threshold" className="text-white">Threshold Value *</Label>
                <Input
                  id="trigger-threshold"
                  data-testid="input-trigger-threshold"
                  placeholder="e.g., 85%, $10M, 30 days"
                  value={newTrigger.threshold}
                  onChange={(e) => setNewTrigger({ ...newTrigger, threshold: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="trigger-priority" className="text-white">Alert Priority</Label>
                <Select 
                  value={newTrigger.priority} 
                  onValueChange={(value: any) => setNewTrigger({ ...newTrigger, priority: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-2" data-testid="select-trigger-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <Badge className={level.color}>{level.label}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Signal Confidence: {newTrigger.confidenceWeight[0]}%</Label>
                <Slider
                  value={newTrigger.confidenceWeight}
                  onValueChange={(value) => setNewTrigger({ ...newTrigger, confidenceWeight: value })}
                  min={50}
                  max={100}
                  step={5}
                  className="mt-3"
                  data-testid="slider-confidence-weight"
                />
                <p className="text-xs text-gray-500 mt-1">How reliable is this signal? (prevents false positives)</p>
              </div>
            </div>

            <Button
              onClick={addTrigger}
              disabled={!newTrigger.name || !newTrigger.signal || !newTrigger.threshold}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-add-trigger"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Trigger
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trigger List */}
      {data.triggers && data.triggers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-blue-400" />
            Active Triggers ({data.triggers.length})
          </h3>

          <div className="space-y-3">
            {data.triggers.map((trigger: any) => {
              const operatorConfig = OPERATORS.find(o => o.value === trigger.operator);
              const OperatorIcon = operatorConfig?.icon || AlertTriangle;
              const priorityConfig = PRIORITY_LEVELS.find(p => p.value === trigger.priority);

              return (
                <Card key={trigger.id} className="border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <OperatorIcon className="h-4 w-4 text-blue-400" />
                          <h4 className="font-semibold text-white">{trigger.name}</h4>
                          <Badge className={priorityConfig?.color}>
                            {priorityConfig?.label || trigger.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p className="font-mono">
                            {trigger.signal} {operatorConfig?.label.split(' ')[0]} {trigger.threshold}
                          </p>
                          <p className="text-xs">
                            Confidence: {Math.round((trigger.confidenceWeight || 1) * 100)}%
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTrigger(trigger.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                        data-testid={`button-remove-trigger-${trigger.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
