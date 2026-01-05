import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Radio, AlertTriangle, TrendingUp, Shield, Bell, X, Zap } from 'lucide-react';

interface TriggerCondition {
  id: string;
  signalType: 'competitive' | 'regulatory' | 'market' | 'security' | 'operational' | 'financial';
  condition: string;
  threshold?: string;
  dataSource?: string;
  enabled: boolean;
}

interface MonitorTriggersStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

const SIGNAL_TYPES = [
  { value: 'competitive', label: 'Competitive Intelligence', icon: TrendingUp, color: 'text-blue-500' },
  { value: 'regulatory', label: 'Regulatory Change', icon: Shield, color: 'text-purple-500' },
  { value: 'market', label: 'Market Signal', icon: TrendingUp, color: 'text-emerald-500' },
  { value: 'security', label: 'Security Threat', icon: AlertTriangle, color: 'text-red-500' },
  { value: 'operational', label: 'Operational Risk', icon: Radio, color: 'text-amber-500' },
  { value: 'financial', label: 'Financial Trigger', icon: TrendingUp, color: 'text-cyan-500' },
];

const DEFAULT_TRIGGERS: TriggerCondition[] = [
  { id: '1', signalType: 'security', condition: 'Anomalous network traffic exceeds baseline by 300%', threshold: '300%', dataSource: 'SIEM/CloudWatch', enabled: true },
  { id: '2', signalType: 'security', condition: 'Known ransomware signature detected', dataSource: 'EDR/CrowdStrike', enabled: true },
  { id: '3', signalType: 'operational', condition: 'Critical system availability drops below 99.5%', threshold: '99.5%', dataSource: 'APM/Datadog', enabled: true },
];

export default function MonitorTriggersStep({ data, onChange, playbook }: MonitorTriggersStepProps) {
  const [triggers, setTriggers] = useState<TriggerCondition[]>(
    data.triggers || DEFAULT_TRIGGERS
  );
  const [autoActivate, setAutoActivate] = useState(data.autoActivate ?? false);
  const [notificationRoles, setNotificationRoles] = useState<string[]>(
    data.notificationRoles || ['CISO', 'CTO', 'General Counsel']
  );
  const [showAddTrigger, setShowAddTrigger] = useState(false);
  const [newTrigger, setNewTrigger] = useState<Partial<TriggerCondition>>({
    signalType: 'security',
    condition: '',
    enabled: true,
  });

  const handleAddTrigger = () => {
    if (!newTrigger.condition) return;
    const trigger: TriggerCondition = {
      id: Date.now().toString(),
      signalType: newTrigger.signalType as TriggerCondition['signalType'],
      condition: newTrigger.condition,
      threshold: newTrigger.threshold,
      dataSource: newTrigger.dataSource,
      enabled: true,
    };
    const updated = [...triggers, trigger];
    setTriggers(updated);
    onChange({ triggers: updated, autoActivate, notificationRoles });
    setNewTrigger({ signalType: 'security', condition: '', enabled: true });
    setShowAddTrigger(false);
  };

  const handleToggleTrigger = (id: string) => {
    const updated = triggers.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t);
    setTriggers(updated);
    onChange({ triggers: updated, autoActivate, notificationRoles });
  };

  const handleRemoveTrigger = (id: string) => {
    const updated = triggers.filter(t => t.id !== id);
    setTriggers(updated);
    onChange({ triggers: updated, autoActivate, notificationRoles });
  };

  const handleAutoActivateChange = (checked: boolean) => {
    setAutoActivate(checked);
    onChange({ triggers, autoActivate: checked, notificationRoles });
  };

  const getSignalIcon = (type: string) => {
    const signalType = SIGNAL_TYPES.find(t => t.value === type);
    const Icon = signalType?.icon || Radio;
    const color = signalType?.color || 'text-slate-500';
    return <Icon className={`h-4 w-4 ${color}`} />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-lg">📡</span> DETECT Phase — Monitor Signals
        </h3>
        <p className="text-xs text-muted-foreground">
          Define the signals and conditions that will trigger this playbook. M's AI continuously monitors 
          these data sources and recommends activation when thresholds are met.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Trigger Conditions</CardTitle>
            <Badge variant="secondary">
              {triggers.filter(t => t.enabled).length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {triggers.map((trigger) => (
            <div
              key={trigger.id}
              className={`flex items-start gap-3 p-3 border rounded-lg ${trigger.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'}`}
              data-testid={`trigger-${trigger.id}`}
            >
              <Switch
                checked={trigger.enabled}
                onCheckedChange={() => handleToggleTrigger(trigger.id)}
                data-testid={`switch-trigger-${trigger.id}`}
              />
              <div className="flex-shrink-0 pt-0.5">
                {getSignalIcon(trigger.signalType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{trigger.condition}</div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {trigger.threshold && (
                    <Badge variant="outline" className="text-xs">
                      Threshold: {trigger.threshold}
                    </Badge>
                  )}
                  {trigger.dataSource && (
                    <Badge variant="outline" className="text-xs">
                      Source: {trigger.dataSource}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveTrigger(trigger.id)}
                data-testid={`button-remove-trigger-${trigger.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {showAddTrigger ? (
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Signal Type</Label>
                    <Select
                      value={newTrigger.signalType}
                      onValueChange={(value) => setNewTrigger({ ...newTrigger, signalType: value as TriggerCondition['signalType'] })}
                    >
                      <SelectTrigger data-testid="select-signal-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SIGNAL_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Data Source (optional)</Label>
                    <Input
                      value={newTrigger.dataSource || ''}
                      onChange={(e) => setNewTrigger({ ...newTrigger, dataSource: e.target.value })}
                      placeholder="e.g., SIEM, APM, RSS"
                      data-testid="input-data-source"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Trigger Condition</Label>
                  <Textarea
                    value={newTrigger.condition || ''}
                    onChange={(e) => setNewTrigger({ ...newTrigger, condition: e.target.value })}
                    placeholder="e.g., When competitor announces major acquisition AND affects top 3 market segments"
                    rows={2}
                    data-testid="input-condition"
                  />
                </div>
                <div>
                  <Label className="text-xs">Threshold (optional)</Label>
                  <Input
                    value={newTrigger.threshold || ''}
                    onChange={(e) => setNewTrigger({ ...newTrigger, threshold: e.target.value })}
                    placeholder="e.g., 25%, $1M, 100 events/hour"
                    data-testid="input-threshold"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddTrigger} data-testid="button-add-trigger">
                    Add Trigger
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddTrigger(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setShowAddTrigger(true)}
              data-testid="button-show-add-trigger"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Trigger Condition
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Activation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="text-sm font-medium">Auto-Activate Playbook</div>
              <div className="text-xs text-muted-foreground">
                Automatically activate when all trigger conditions are met (requires CISO approval)
              </div>
            </div>
            <Switch
              checked={autoActivate}
              onCheckedChange={handleAutoActivateChange}
              data-testid="switch-auto-activate"
            />
          </div>

          <div>
            <Label className="text-xs mb-2 block">Notification Roles (when triggered)</Label>
            <div className="flex flex-wrap gap-2">
              {notificationRoles.map((role, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  <Bell className="h-3 w-3" />
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
