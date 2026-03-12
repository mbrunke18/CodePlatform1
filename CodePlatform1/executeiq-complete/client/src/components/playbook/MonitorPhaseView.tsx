import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Radio,
  Radar,
  Activity,
  TrendingUp,
  Globe,
  Scale,
  DollarSign,
  Users,
  Boxes,
  Plus,
  Signal,
  SignalHigh,
  SignalLow,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Trash2,
  Zap,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MonitorPhaseViewProps {
  playbookId: string;
  organizationId: string;
  isEditable?: boolean;
}

type SignalType = 
  | 'competitive'
  | 'market'
  | 'regulatory'
  | 'operational'
  | 'financial'
  | 'talent'
  | 'supply_chain'
  | 'technology';

type TriggerType = 'event' | 'threshold' | 'pattern' | 'scheduled';

interface MonitorItem {
  id: string;
  playbookId: string;
  organizationId: string;
  signalType: SignalType;
  signalName: string;
  signalDescription?: string;
  triggerType: TriggerType;
  triggerConditions?: Record<string, any>;
  severity: 'critical' | 'high' | 'medium' | 'low';
  isActive: boolean;
  sequence: number;
  lastTriggeredAt?: string;
}

const SIGNAL_TYPE_CONFIG: Record<SignalType, { icon: any; label: string; color: string }> = {
  competitive: { icon: Radar, label: 'Competitive Intelligence', color: 'text-red-500' },
  market: { icon: TrendingUp, label: 'Market Dynamics', color: 'text-blue-500' },
  regulatory: { icon: Scale, label: 'Regulatory & Compliance', color: 'text-purple-500' },
  operational: { icon: Activity, label: 'Operational', color: 'text-orange-500' },
  financial: { icon: DollarSign, label: 'Financial', color: 'text-green-500' },
  talent: { icon: Users, label: 'Talent & Leadership', color: 'text-pink-500' },
  supply_chain: { icon: Boxes, label: 'Supply Chain', color: 'text-amber-500' },
  technology: { icon: Globe, label: 'Technology', color: 'text-cyan-500' },
};

const TRIGGER_TYPE_CONFIG: Record<TriggerType, { label: string; description: string }> = {
  event: { label: 'Event-based', description: 'Triggers when a specific event occurs' },
  threshold: { label: 'Threshold', description: 'Triggers when a metric crosses a threshold' },
  pattern: { label: 'Pattern Detection', description: 'AI-powered pattern matching' },
  scheduled: { label: 'Scheduled', description: 'Time-based monitoring intervals' },
};

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', icon: SignalHigh },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', icon: Signal },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300', icon: SignalLow },
  low: { label: 'Low', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: Radio },
};

export function MonitorPhaseView({ playbookId, organizationId, isEditable = true }: MonitorPhaseViewProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [newItem, setNewItem] = useState<{
    signalType: SignalType;
    signalName: string;
    signalDescription: string;
    triggerType: TriggerType;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>({
    signalType: 'competitive',
    signalName: '',
    signalDescription: '',
    triggerType: 'event',
    severity: 'high',
  });
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<MonitorItem[]>({
    queryKey: ['/api/playbook-library', playbookId, 'monitor-items', { organizationId }],
    queryFn: async () => {
      const response = await fetch(
        `/api/playbook-library/${playbookId}/monitor-items?organizationId=${organizationId}`
      );
      if (!response.ok) throw new Error('Failed to fetch monitor items');
      return response.json();
    },
    enabled: !!playbookId && !!organizationId,
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: Partial<MonitorItem>) => {
      const response = await apiRequest('POST', `/api/playbook-library/${playbookId}/monitor-items`, {
        ...data,
        organizationId,
        sequence: items.length + 1,
        isActive: true,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'monitor-items'] });
      setIsAddDialogOpen(false);
      setNewItem({
        signalType: 'competitive',
        signalName: '',
        signalDescription: '',
        triggerType: 'event',
        severity: 'high',
      });
      toast({ title: 'Monitor trigger added', description: 'The signal is now being monitored.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add monitor trigger.', variant: 'destructive' });
    },
  });

  const toggleItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest(
        'PATCH',
        `/api/playbook-library/${playbookId}/monitor-items/${itemId}/toggle`
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'monitor-items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'readiness'] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest('DELETE', `/api/playbook-library/${playbookId}/monitor-items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'monitor-items'] });
      toast({ title: 'Trigger deleted' });
    },
  });

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const activeCount = items.filter((i) => i.isActive).length;
  const criticalCount = items.filter((i) => i.severity === 'critical' && i.isActive).length;
  const progressPercent = items.length > 0 ? Math.round((activeCount / items.length) * 100) : 0;

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.signalType]) acc[item.signalType] = [];
    acc[item.signalType].push(item);
    return acc;
  }, {} as Record<SignalType, MonitorItem[]>);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="monitor-phase-view">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📡</span>
                DETECT Phase — Monitor Signals
              </CardTitle>
              <CardDescription>
                Human insight amplified by AI-powered pattern matching. Configure the signals that matter.
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400" data-testid="active-triggers-count">
                {activeCount}
              </div>
              <div className="text-xs text-muted-foreground">Active Triggers</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-lg font-semibold text-red-500">{criticalCount}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-lg font-semibold">{items.length}</div>
              <div className="text-xs text-muted-foreground">Total Signals</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-lg font-semibold text-green-500">
                {Object.keys(groupedItems).length}
              </div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedItems).map(([type, typeItems]) => {
        const config = SIGNAL_TYPE_CONFIG[type as SignalType];
        const Icon = config.icon;

        return (
          <Card key={type} data-testid={`monitor-section-${type}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className={`h-5 w-5 ${config.color}`} />
                {config.label}
                <Badge variant="outline" className="ml-auto">
                  {typeItems.filter((i) => i.isActive).length}/{typeItems.length} active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {typeItems.map((item) => {
                const severityConfig = SEVERITY_CONFIG[item.severity];
                const SeverityIcon = severityConfig.icon;
                const isExpanded = expandedItems.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3 transition-all ${
                      item.isActive
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 opacity-60'
                    }`}
                    data-testid={`monitor-item-${item.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {isEditable && (
                        <Switch
                          checked={item.isActive}
                          onCheckedChange={() => toggleItemMutation.mutate(item.id)}
                          data-testid={`switch-${item.id}`}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <SeverityIcon className={`h-4 w-4 ${item.isActive ? severityConfig.color.split(' ')[1] : 'text-slate-400'}`} />
                          <span className="font-medium truncate">{item.signalName}</span>
                          <Badge className={`text-xs shrink-0 ${severityConfig.color}`}>
                            {severityConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Zap className="h-3 w-3" />
                          {TRIGGER_TYPE_CONFIG[item.triggerType].label}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(item.id)}
                        data-testid={`expand-${item.id}`}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                        <p>{item.signalDescription || 'No description provided.'}</p>
                        {item.triggerConditions && (
                          <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
                            {JSON.stringify(item.triggerConditions, null, 2)}
                          </div>
                        )}
                        {item.lastTriggeredAt && (
                          <p className="mt-2 text-xs">
                            Last triggered: {new Date(item.lastTriggeredAt).toLocaleDateString()}
                          </p>
                        )}
                        {isEditable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-red-500 hover:text-red-600"
                            onClick={() => deleteItemMutation.mutate(item.id)}
                            data-testid={`delete-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
            <h3 className="font-medium mb-2">No Monitoring Triggers Configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add signals and triggers to automatically detect when this playbook should be activated.
            </p>
            {isEditable && (
              <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-trigger">
                <Plus className="h-4 w-4 mr-2" /> Add First Trigger
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {isEditable && items.length > 0 && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline" data-testid="button-add-monitor-trigger">
              <Plus className="h-4 w-4 mr-2" /> Add Monitor Trigger
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Monitor Trigger</DialogTitle>
              <DialogDescription>
                Configure a new signal to monitor for playbook activation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Signal Type</Label>
                <Select
                  value={newItem.signalType}
                  onValueChange={(v) => setNewItem({ ...newItem, signalType: v as SignalType })}
                >
                  <SelectTrigger data-testid="select-signal-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SIGNAL_TYPE_CONFIG).map(([type, config]) => (
                      <SelectItem key={type} value={type}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Signal Name</Label>
                <Input
                  value={newItem.signalName}
                  onChange={(e) => setNewItem({ ...newItem, signalName: e.target.value })}
                  placeholder="e.g., Competitor Patent Filing Alert"
                  data-testid="input-signal-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newItem.signalDescription}
                  onChange={(e) => setNewItem({ ...newItem, signalDescription: e.target.value })}
                  placeholder="Describe what this signal monitors..."
                  data-testid="input-signal-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Trigger Type</Label>
                  <Select
                    value={newItem.triggerType}
                    onValueChange={(v) => setNewItem({ ...newItem, triggerType: v as TriggerType })}
                  >
                    <SelectTrigger data-testid="select-trigger-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TRIGGER_TYPE_CONFIG).map(([type, config]) => (
                        <SelectItem key={type} value={type}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select
                    value={newItem.severity}
                    onValueChange={(v) => setNewItem({ ...newItem, severity: v as 'critical' | 'high' | 'medium' | 'low' })}
                  >
                    <SelectTrigger data-testid="select-severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createItemMutation.mutate(newItem)}
                disabled={!newItem.signalName || createItemMutation.isPending}
                data-testid="button-save-trigger"
              >
                {createItemMutation.isPending ? 'Saving...' : 'Add Trigger'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default MonitorPhaseView;
