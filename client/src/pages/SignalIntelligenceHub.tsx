import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Radio, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Zap,
  Target,
  TrendingUp,
  Activity,
  DollarSign,
  Scale,
  Truck,
  Heart,
  Users,
  Cpu,
  Newspaper,
  Globe,
  BarChart3,
  Handshake,
  Lightbulb,
  Leaf,
  Swords,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  Bell,
  Layers,
  Copy,
  Sparkles
} from 'lucide-react';
import { Link } from 'wouter';
import { SIGNAL_CATEGORIES, type SignalCategory, type DataPoint } from '@shared/intelligence-signals';

const iconMap: Record<string, any> = {
  Swords, TrendingUp, DollarSign, Scale, Truck, Heart, Users, Cpu, 
  Newspaper, Globe, BarChart3, Handshake, Target, Activity, Lightbulb, Leaf
};

function CategoryIcon({ iconName, className, style }: { iconName: string; className?: string; style?: React.CSSProperties }) {
  const Icon = iconMap[iconName] || Radio;
  return <Icon className={className} style={style} />;
}

function getOperatorLabel(operator: string): string {
  const labels: Record<string, string> = {
    gt: '>',
    lt: '<',
    gte: '≥',
    lte: '≤',
    eq: '=',
    neq: '≠',
    contains: 'contains',
    spike: '↑ spike',
    drop: '↓ drop',
    trend: 'trend'
  };
  return labels[operator] || operator;
}

function mapUrgencyToAlertThreshold(urgency: string): string {
  return urgency === 'critical' ? 'red' : 
         urgency === 'high' ? 'yellow' : 'green';
}

function mapUrgencyToSeverity(urgency: string): string {
  return urgency === 'critical' ? 'critical' : 
         urgency === 'high' ? 'high' :
         urgency === 'medium' ? 'medium' : 'low';
}

function mapAlertThresholdToUrgency(alertThreshold: string, severity?: string): string {
  if (alertThreshold === 'red') return 'critical';
  if (alertThreshold === 'yellow') return 'high';
  if (alertThreshold === 'green') return severity === 'medium' ? 'medium' : 'low';
  if (['critical', 'high', 'medium', 'low'].includes(alertThreshold)) return alertThreshold;
  return 'high';
}

const TRIGGER_TEMPLATES = [
  {
    id: 'competitor-launch',
    name: 'Competitor Product Launch',
    description: 'Alert when a competitor announces a new product',
    category: 'competitive',
    dataPointId: 'comp_product_launch',
    operator: 'gte',
    value: '1',
    urgency: 'critical',
    icon: Swords,
    color: '#ef4444'
  },
  {
    id: 'pricing-war',
    name: 'Pricing War Detection',
    description: 'Detect significant competitor pricing changes',
    category: 'competitive',
    dataPointId: 'comp_pricing_change',
    operator: 'drop',
    value: '15',
    urgency: 'critical',
    icon: DollarSign,
    color: '#22c55e'
  },
  {
    id: 'supply-risk',
    name: 'Supply Chain Risk',
    description: 'Monitor supplier health and lead time changes',
    category: 'supplychain',
    dataPointId: 'sc_lead_times',
    operator: 'spike',
    value: '30',
    urgency: 'high',
    icon: Truck,
    color: '#f59e0b'
  },
  {
    id: 'customer-churn',
    name: 'Customer Churn Risk',
    description: 'Alert on declining NPS or increasing churn signals',
    category: 'customer',
    dataPointId: 'cust_nps',
    operator: 'drop',
    value: '10',
    urgency: 'critical',
    icon: Heart,
    color: '#ec4899'
  },
  {
    id: 'talent-flight',
    name: 'Key Talent Departure',
    description: 'Detect signals of key employee departures',
    category: 'talent',
    dataPointId: 'tal_key_departures',
    operator: 'eq',
    value: 'true',
    urgency: 'critical',
    icon: Users,
    color: '#6366f1'
  },
  {
    id: 'regulatory-alert',
    name: 'Regulatory Change',
    description: 'Monitor new legislation or enforcement actions',
    category: 'regulatory',
    dataPointId: 'reg_legislation',
    operator: 'gte',
    value: '1',
    urgency: 'high',
    icon: Scale,
    color: '#8b5cf6'
  },
  {
    id: 'media-crisis',
    name: 'Media Crisis Detection',
    description: 'Detect negative news spikes or viral content',
    category: 'media',
    dataPointId: 'med_viral_negative',
    operator: 'gte',
    value: '1',
    urgency: 'critical',
    icon: Newspaper,
    color: '#f43f5e'
  },
  {
    id: 'ma-activity',
    name: 'M&A Activity',
    description: 'Track mergers and acquisitions in your sector',
    category: 'financial',
    dataPointId: 'fin_ma_activity',
    operator: 'gte',
    value: '1',
    urgency: 'critical',
    icon: DollarSign,
    color: '#22c55e'
  }
];

function SignalCategoryCard({ 
  category, 
  onSelect,
  isActive,
  triggerCount 
}: { 
  category: SignalCategory; 
  onSelect: () => void;
  isActive: boolean;
  triggerCount: number;
}) {
  const dataPointCount = category.dataPoints.length;
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${isActive ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
      onClick={onSelect}
      data-testid={`signal-category-${category.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <CategoryIcon 
              iconName={category.icon} 
              className="h-5 w-5"
              style={{ color: category.color }}
            />
          </div>
          <div className="flex items-center gap-1">
            {triggerCount > 0 && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                {triggerCount} active
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: category.color, color: category.color }}
            >
              {category.phase === 'external' ? 'External' : 'Internal'}
            </Badge>
          </div>
        </div>
        
        <h3 className="font-semibold text-sm mb-1">{category.shortName}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {category.description}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{dataPointCount} data points</span>
          <ChevronRight className="h-3 w-3" style={{ color: category.color }} />
        </div>
      </CardContent>
    </Card>
  );
}

function DataPointRow({ 
  dataPoint, 
  category,
  onConfigureTrigger,
  onQuickToggle,
  existingTrigger,
  isToggling
}: { 
  dataPoint: DataPoint; 
  category: SignalCategory;
  onConfigureTrigger: (dp: DataPoint) => void;
  onQuickToggle: (dp: DataPoint, category: SignalCategory, enable: boolean, existingTriggerId?: string) => void;
  existingTrigger?: any;
  isToggling?: boolean;
}) {
  const isActive = existingTrigger?.isActive ?? false;
  const currentValue = dataPoint.metricType === 'percentage' 
    ? `${Math.floor(Math.random() * 100)}%`
    : dataPoint.metricType === 'currency'
    ? `$${(Math.random() * 10000000).toLocaleString()}`
    : dataPoint.metricType === 'count'
    ? Math.floor(Math.random() * 100).toString()
    : dataPoint.metricType === 'boolean'
    ? (Math.random() > 0.5 ? 'Yes' : 'No')
    : Math.floor(Math.random() * 100).toString();

  const handleToggle = (checked: boolean) => {
    onQuickToggle(dataPoint, category, checked, existingTrigger?.id);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Switch 
          checked={isActive}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          data-testid={`toggle-${dataPoint.id}`}
          className="data-[state=checked]:bg-emerald-500"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{dataPoint.name}</span>
            {dataPoint.defaultThreshold && (
              <Badge variant="outline" className="text-xs">
                {getOperatorLabel(dataPoint.defaultThreshold.operator)} {dataPoint.defaultThreshold.value}{dataPoint.unit || ''}
              </Badge>
            )}
            {isActive && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                <Bell className="h-3 w-3 mr-1" />
                Monitoring
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{dataPoint.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <div className="text-right min-w-[60px]">
          <div className="text-sm font-semibold">{currentValue}</div>
          <div className="text-xs text-muted-foreground">Current</div>
        </div>
        
        <div className="hidden md:flex items-center gap-1">
          {dataPoint.sources.slice(0, 2).map((source, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {source}
            </Badge>
          ))}
          {dataPoint.sources.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{dataPoint.sources.length - 2}
            </Badge>
          )}
        </div>
        
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => onConfigureTrigger(dataPoint)}
          data-testid={`configure-trigger-${dataPoint.id}`}
          title="Customize trigger settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MyTriggersTab({ triggers, isLoading, onEdit, onToggle, onDelete }: { 
  triggers: any[];
  isLoading: boolean;
  onEdit: (trigger: any) => void;
  onToggle: (triggerId: string, isActive: boolean) => void;
  onDelete: (triggerId: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Loading your triggers...</p>
      </div>
    );
  }

  if (triggers.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="font-semibold mb-2">No Triggers Configured</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create your first trigger to start monitoring signals
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {triggers.map((trigger: any) => {
        const category = SIGNAL_CATEGORIES.find(c => c.id === trigger.category);
        const statusColor = trigger.currentStatus === 'red' ? 'bg-red-500' :
                           trigger.currentStatus === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500';
        
        return (
          <Card key={trigger.id} className={`card-bg ${!trigger.isActive ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category ? `${category.color}20` : '#e2e8f0' }}
                  >
                    {category && (
                      <CategoryIcon 
                        iconName={category.icon} 
                        className="h-5 w-5"
                        style={{ color: category.color }}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{trigger.name}</h4>
                    <p className="text-sm text-muted-foreground">{trigger.description || 'No description'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {trigger.triggerType}
                      </Badge>
                      <Badge 
                        className={`text-xs ${
                          trigger.alertThreshold === 'red' || trigger.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          trigger.alertThreshold === 'yellow' || trigger.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          trigger.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {mapAlertThresholdToUrgency(trigger.alertThreshold, trigger.severity)}
                      </Badge>
                      {trigger.triggerCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Triggered {trigger.triggerCount}x
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={trigger.isActive} 
                    onCheckedChange={(checked) => onToggle(trigger.id, checked)}
                  />
                  <Button variant="ghost" size="sm" onClick={() => onEdit(trigger)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(trigger.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function TemplatesTab({ onUseTemplate }: { onUseTemplate: (template: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold">Quick-Start Templates</h3>
        <span className="text-sm text-muted-foreground">Pre-configured triggers for common scenarios</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRIGGER_TEMPLATES.map(template => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="card-bg hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: template.color }} />
                  </div>
                  <Badge 
                    className={`text-xs ${
                      template.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                      template.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {template.urgency}
                  </Badge>
                </div>
                <h4 className="font-semibold mb-1">{template.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {getOperatorLabel(template.operator)} {template.value}
                  </Badge>
                  <Button 
                    size="sm" 
                    onClick={() => onUseTemplate(template)}
                    data-testid={`use-template-${template.id}`}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TriggerConfigDialog({ 
  open, 
  onOpenChange, 
  dataPoint,
  category,
  existingTrigger,
  onSave
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  dataPoint: DataPoint | null;
  category: SignalCategory | null;
  existingTrigger?: any;
  onSave: (triggerData: any) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [operator, setOperator] = useState<string>('gt');
  const [threshold, setThreshold] = useState('');
  const [urgency, setUrgency] = useState<string>('high');
  const [isActive, setIsActive] = useState(true);
  const [autoActivate, setAutoActivate] = useState(false);

  useEffect(() => {
    if (open) {
      if (existingTrigger) {
        setName(existingTrigger.name || '');
        setDescription(existingTrigger.description || '');
        setOperator(existingTrigger.conditions?.operator || 'gt');
        setThreshold(existingTrigger.conditions?.value?.toString() || '');
        setUrgency(mapAlertThresholdToUrgency(existingTrigger.alertThreshold, existingTrigger.severity));
        setIsActive(existingTrigger.isActive ?? true);
        setAutoActivate(existingTrigger.autoActivate ?? false);
      } else if (dataPoint) {
        setName(`${dataPoint.name} Monitor`);
        setDescription(`Monitor ${dataPoint.name.toLowerCase()} for changes`);
        setOperator(dataPoint.defaultThreshold?.operator || 'gt');
        setThreshold(dataPoint.defaultThreshold?.value?.toString() || '');
        setUrgency(dataPoint.defaultThreshold?.urgency || 'high');
        setIsActive(true);
        setAutoActivate(false);
      }
    }
  }, [dataPoint, open, existingTrigger]);

  const handleSave = () => {
    onSave({
      id: existingTrigger?.id,
      name,
      description,
      category: category?.id,
      triggerType: 'threshold',
      conditions: {
        dataPointId: dataPoint?.id,
        operator,
        value: threshold
      },
      alertThreshold: urgency,
      isActive,
      autoActivate,
      recommendedPlaybooks: category?.recommendedPlaybooks || []
    });
    onOpenChange(false);
  };

  if (!dataPoint || !category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <CategoryIcon 
                iconName={category.icon} 
                className="h-4 w-4"
                style={{ color: category.color }}
              />
            </div>
            {existingTrigger ? 'Edit Trigger' : 'Create Trigger'}: {dataPoint.name}
          </DialogTitle>
          <DialogDescription>
            Set up automated monitoring and alerts for this data point
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trigger Name</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Competitor Launch Alert"
                data-testid="input-trigger-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Signal Category</Label>
              <Input value={category.name} disabled />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this trigger monitors..."
              rows={2}
              data-testid="input-trigger-description"
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-semibold">Trigger Conditions</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Operator</Label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger data-testid="select-operator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gt">Greater than (&gt;)</SelectItem>
                    <SelectItem value="gte">Greater or equal (≥)</SelectItem>
                    <SelectItem value="lt">Less than (&lt;)</SelectItem>
                    <SelectItem value="lte">Less or equal (≤)</SelectItem>
                    <SelectItem value="eq">Equals (=)</SelectItem>
                    <SelectItem value="spike">Spike increase (↑)</SelectItem>
                    <SelectItem value="drop">Drop decrease (↓)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Threshold Value</Label>
                <Input 
                  type="text" 
                  value={threshold} 
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder={`e.g., ${dataPoint.defaultThreshold?.value || '10'}`}
                  data-testid="input-threshold"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Urgency Level</Label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger data-testid="select-urgency">
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
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-semibold">Data Sources</h4>
            <div className="flex flex-wrap gap-2">
              {dataPoint.sources.map((source, i) => (
                <Badge key={i} variant="outline" className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  {source}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              These sources will be monitored for changes in this data point
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-semibold">Automation Settings</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Trigger Active</Label>
                <p className="text-xs text-muted-foreground">Enable monitoring for this trigger</p>
              </div>
              <Switch 
                checked={isActive} 
                onCheckedChange={setIsActive}
                data-testid="switch-active"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Activate Playbook</Label>
                <p className="text-xs text-muted-foreground">Automatically activate recommended playbooks when triggered</p>
              </div>
              <Switch 
                checked={autoActivate} 
                onCheckedChange={setAutoActivate}
                data-testid="switch-auto-activate"
              />
            </div>
          </div>
          
          {category.recommendedPlaybooks.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Recommended Playbooks</h4>
                <div className="flex flex-wrap gap-2">
                  {category.recommendedPlaybooks.map((playbook, i) => (
                    <Badge key={i} className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      <Target className="h-3 w-3 mr-1" />
                      {playbook}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-trigger">
            <CheckCircle className="h-4 w-4 mr-2" />
            {existingTrigger ? 'Update Trigger' : 'Create Trigger'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompositeBuilderDialog({ 
  open, 
  onOpenChange,
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSave: (triggerData: any) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = useState<any[]>([
    { categoryId: '', dataPointId: '', operator: 'gt', value: '' }
  ]);
  const [urgency, setUrgency] = useState('high');

  const addCondition = () => {
    setConditions([...conditions, { categoryId: '', dataPointId: '', operator: 'gt', value: '' }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: string, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    if (field === 'categoryId') {
      newConditions[index].dataPointId = '';
    }
    setConditions(newConditions);
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      triggerType: 'composite',
      conditions: {
        logic,
        conditions: conditions.filter(c => c.dataPointId)
      },
      alertThreshold: urgency,
      isActive: true
    });
    onOpenChange(false);
    setName('');
    setDescription('');
    setConditions([{ categoryId: '', dataPointId: '', operator: 'gt', value: '' }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-500" />
            Create Composite Trigger
          </DialogTitle>
          <DialogDescription>
            Combine multiple conditions to create sophisticated trigger logic
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trigger Name</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Multi-Signal Crisis Alert"
              />
            </div>
            <div className="space-y-2">
              <Label>Urgency Level</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger>
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
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the composite trigger..."
              rows={2}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Conditions</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Logic:</span>
                <Select value={logic} onValueChange={(v) => setLogic(v as 'AND' | 'OR')}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              {conditions.map((condition, index) => {
                const selectedCategory = SIGNAL_CATEGORIES.find(c => c.id === condition.categoryId);
                return (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && (
                      <Badge variant="outline" className="shrink-0">
                        {logic}
                      </Badge>
                    )}
                    <Select 
                      value={condition.categoryId} 
                      onValueChange={(v) => updateCondition(index, 'categoryId', v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SIGNAL_CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.shortName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={condition.dataPointId} 
                      onValueChange={(v) => updateCondition(index, 'dataPointId', v)}
                      disabled={!condition.categoryId}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Data Point" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory?.dataPoints.map(dp => (
                          <SelectItem key={dp.id} value={dp.id}>{dp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={condition.operator} 
                      onValueChange={(v) => updateCondition(index, 'operator', v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gt">&gt;</SelectItem>
                        <SelectItem value="lt">&lt;</SelectItem>
                        <SelectItem value="gte">≥</SelectItem>
                        <SelectItem value="lte">≤</SelectItem>
                        <SelectItem value="spike">↑ spike</SelectItem>
                        <SelectItem value="drop">↓ drop</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input 
                      value={condition.value}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="w-24"
                    />
                    
                    {conditions.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeCondition(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
            
            <Button variant="outline" size="sm" onClick={addCondition}>
              <Plus className="h-4 w-4 mr-1" />
              Add Condition
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name || conditions.every(c => !c.dataPointId)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Create Composite Trigger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SignalIntelligenceHub() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<SignalCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'external' | 'internal'>('all');
  const [activeTab, setActiveTab] = useState<'brief' | 'signals' | 'triggers' | 'templates'>('brief');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [compositeDialogOpen, setCompositeDialogOpen] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<DataPoint | null>(null);
  const [editingTrigger, setEditingTrigger] = useState<any>(null);

  const { data: triggers = [], isLoading: triggersLoading } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  const { data: organizations = [] } = useQuery<any[]>({
    queryKey: ['/api/organizations'],
  });
  const organizationId = organizations[0]?.id;

  const createTriggerMutation = useMutation({
    mutationFn: async (triggerData: any) => {
      const urgency = triggerData.alertThreshold || 'high';
      const payload = {
        organizationId: organizationId || '00000000-0000-0000-0000-000000000000',
        name: triggerData.name || 'New Trigger',
        description: triggerData.description || '',
        category: triggerData.category || 'competitive',
        triggerType: triggerData.triggerType || 'threshold',
        conditions: triggerData.conditions || {},
        severity: mapUrgencyToSeverity(urgency),
        alertThreshold: mapUrgencyToAlertThreshold(urgency),
        recommendedPlaybooks: Array.isArray(triggerData.recommendedPlaybooks) 
          ? triggerData.recommendedPlaybooks 
          : [],
        notificationSettings: { email: true, slack: false, teams: false },
        createdBy: 'current-user'
      };
      console.log('Creating trigger with payload:', payload);
      return apiRequest('POST', '/api/executive-triggers', payload);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['/api/executive-triggers'], exact: false });
      toast({ title: 'Trigger created', description: 'Your trigger is now active' });
    },
    onError: (error: any) => {
      console.error('Create trigger error:', error);
      toast({ title: 'Error', description: 'Failed to create trigger. Check console for details.', variant: 'destructive' });
    }
  });

  const updateTriggerMutation = useMutation({
    mutationFn: async ({ id, isActive, ...data }: any) => {
      if (isActive !== undefined && Object.keys(data).length === 0) {
        console.log('Toggling trigger active state:', id, isActive);
        return apiRequest('PUT', `/api/executive-triggers/${id}`, { isActive });
      }
      
      const payload: Record<string, any> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.description !== undefined) payload.description = data.description;
      if (isActive !== undefined) payload.isActive = isActive;
      if (data.conditions !== undefined) payload.conditions = data.conditions;
      if (data.alertThreshold !== undefined) {
        payload.severity = mapUrgencyToSeverity(data.alertThreshold);
        payload.alertThreshold = mapUrgencyToAlertThreshold(data.alertThreshold);
      }
      console.log('Updating trigger with payload:', id, payload);
      return apiRequest('PUT', `/api/executive-triggers/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['/api/executive-triggers'], exact: false });
      toast({ title: 'Trigger updated', description: 'Changes saved successfully' });
    },
    onError: (error: any) => {
      console.error('Update trigger error:', error);
      toast({ title: 'Error', description: 'Failed to update trigger', variant: 'destructive' });
    }
  });

  const deleteTriggerMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting trigger:', id);
      return apiRequest('DELETE', `/api/executive-triggers/${id}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['/api/executive-triggers'], exact: false });
      toast({ title: 'Trigger deleted' });
    },
    onError: (error: any) => {
      console.error('Delete trigger error:', error);
      toast({ title: 'Error', description: 'Failed to delete trigger', variant: 'destructive' });
    }
  });

  const filteredCategories = SIGNAL_CATEGORIES.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = phaseFilter === 'all' || cat.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  const externalCount = SIGNAL_CATEGORIES.filter(c => c.phase === 'external').length;
  const internalCount = SIGNAL_CATEGORIES.filter(c => c.phase === 'internal').length;
  const totalDataPoints = SIGNAL_CATEGORIES.reduce((sum, cat) => sum + cat.dataPoints.length, 0);
  // Ensure triggers is always an array
  const safeTriggers = Array.isArray(triggers) ? triggers : [];
  const activeTriggerCount = safeTriggers.filter((t: any) => t.isActive).length;

  const getCategoryTriggerCount = (categoryId: string) => {
    return safeTriggers.filter((t: any) => t.category === categoryId && t.isActive).length;
  };

  const handleConfigureTrigger = (dp: DataPoint) => {
    setSelectedDataPoint(dp);
    setEditingTrigger(null);
    setConfigDialogOpen(true);
  };

  const handleEditTrigger = (trigger: any) => {
    const category = SIGNAL_CATEGORIES.find(c => c.id === trigger.category);
    const dataPoint = category?.dataPoints.find(dp => dp.id === trigger.conditions?.dataPointId);
    setSelectedCategory(category || null);
    setSelectedDataPoint(dataPoint || null);
    setEditingTrigger(trigger);
    setConfigDialogOpen(true);
  };

  const handleSaveTrigger = (triggerData: any) => {
    if (triggerData.id) {
      updateTriggerMutation.mutate(triggerData);
    } else {
      createTriggerMutation.mutate(triggerData);
    }
  };

  const handleToggleTrigger = (triggerId: string, isActive: boolean) => {
    updateTriggerMutation.mutate({ id: triggerId, isActive });
  };

  const handleDeleteTrigger = (triggerId: string) => {
    deleteTriggerMutation.mutate(triggerId);
  };

  const handleQuickToggle = (dataPoint: DataPoint, category: SignalCategory, enable: boolean, existingTriggerId?: string) => {
    if (enable) {
      if (existingTriggerId) {
        updateTriggerMutation.mutate({ id: existingTriggerId, isActive: true });
      } else {
        const defaultThreshold = dataPoint.defaultThreshold;
        const urgency = defaultThreshold?.urgency || 'high';
        const thresholdValue = defaultThreshold?.value;
        const valueAsString = thresholdValue !== undefined && thresholdValue !== null 
          ? String(thresholdValue) 
          : '0';
        
        createTriggerMutation.mutate({
          name: `${dataPoint.name} Monitor`,
          description: `Auto-monitoring: ${dataPoint.description}`,
          category: category.id,
          triggerType: 'threshold',
          conditions: {
            dataPointId: dataPoint.id,
            operator: defaultThreshold?.operator || 'gt',
            value: valueAsString
          },
          alertThreshold: urgency,
          isActive: true,
          autoActivate: false,
          recommendedPlaybooks: category.recommendedPlaybooks || []
        });
      }
    } else {
      if (existingTriggerId) {
        updateTriggerMutation.mutate({ id: existingTriggerId, isActive: false });
      }
    }
  };

  const handleUseTemplate = (template: any) => {
    const category = SIGNAL_CATEGORIES.find(c => c.id === template.category);
    const dataPoint = category?.dataPoints.find(dp => dp.id === template.dataPointId);
    if (category && dataPoint) {
      setSelectedCategory(category);
      setSelectedDataPoint(dataPoint);
      setEditingTrigger({
        name: template.name,
        description: template.description,
        conditions: { operator: template.operator, value: template.value },
        alertThreshold: template.urgency
      });
      setConfigDialogOpen(true);
    }
  };

  return (
    <PageLayout>
      <div className="flex-1 overflow-auto page-background">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedCategory && activeTab === 'signals' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  data-testid="button-back-to-categories"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  All Categories
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Radio className="h-6 w-6 text-amber-500" />
                  {selectedCategory && activeTab === 'signals' ? selectedCategory.name : 'Signal Intelligence Hub'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCategory && activeTab === 'signals'
                    ? selectedCategory.description 
                    : `Monitor ${totalDataPoints} data points across ${SIGNAL_CATEGORIES.length} signal categories`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCompositeDialogOpen(true)}
                data-testid="button-composite-trigger"
              >
                <Layers className="h-4 w-4 mr-2" />
                Composite Trigger
              </Button>
              <Button 
                onClick={() => {
                  setActiveTab('templates');
                }}
                data-testid="button-create-trigger"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Trigger
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="card-bg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Radio className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{SIGNAL_CATEGORIES.length}</div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-bg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalDataPoints}</div>
                  <div className="text-xs text-muted-foreground">Data Points</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-bg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeTriggerCount}</div>
                  <div className="text-xs text-muted-foreground">Active Triggers</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-bg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{externalCount}</div>
                  <div className="text-xs text-muted-foreground">External</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-bg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Target className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{internalCount}</div>
                  <div className="text-xs text-muted-foreground">Internal</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="brief" data-testid="tab-executive-brief">
                <BarChart3 className="h-4 w-4 mr-2" />
                Executive Brief
              </TabsTrigger>
              <TabsTrigger value="signals" data-testid="tab-signals">
                <Radio className="h-4 w-4 mr-2" />
                Signal Catalog
              </TabsTrigger>
              <TabsTrigger value="triggers" data-testid="tab-my-triggers">
                <Bell className="h-4 w-4 mr-2" />
                My Triggers ({activeTriggerCount})
              </TabsTrigger>
              <TabsTrigger value="templates" data-testid="tab-templates">
                <Sparkles className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
            </TabsList>

            {/* Executive Brief Tab */}
            <TabsContent value="brief" className="mt-6">
              <div className="space-y-6">
                {/* Live Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className={`card-bg border-l-4 ${safeTriggers.filter((t: any) => t.currentStatus === 'red').length > 0 ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Critical Alerts</p>
                          <p className="text-3xl font-bold">{safeTriggers.filter((t: any) => t.currentStatus === 'red').length}</p>
                        </div>
                        <AlertTriangle className={`h-8 w-8 ${safeTriggers.filter((t: any) => t.currentStatus === 'red').length > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-bg border-l-4 border-l-amber-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Warnings</p>
                          <p className="text-3xl font-bold">{safeTriggers.filter((t: any) => t.currentStatus === 'yellow').length}</p>
                        </div>
                        <Eye className="h-8 w-8 text-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-bg border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Monitors</p>
                          <p className="text-3xl font-bold">{activeTriggerCount}</p>
                        </div>
                        <Activity className="h-8 w-8 text-emerald-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-bg border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Signal Coverage</p>
                          <p className="text-3xl font-bold">{totalDataPoints}</p>
                        </div>
                        <Radio className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Alerts */}
                  <Card className="card-bg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="h-5 w-5 text-amber-500" />
                        Recent Trigger Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {safeTriggers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No triggers configured yet</p>
                          <Button 
                            variant="link" 
                            className="mt-2"
                            onClick={() => setActiveTab('signals')}
                          >
                            Browse Signal Catalog to create triggers
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {safeTriggers.slice(0, 5).map((trigger: any) => {
                            const category = SIGNAL_CATEGORIES.find(c => c.id === trigger.category);
                            return (
                              <div key={trigger.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className={`w-2 h-2 rounded-full ${
                                  trigger.currentStatus === 'red' ? 'bg-red-500' :
                                  trigger.currentStatus === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{trigger.name}</p>
                                  <p className="text-xs text-muted-foreground">{category?.name || 'Unknown'}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {trigger.isActive ? 'Active' : 'Paused'}
                                </Badge>
                              </div>
                            );
                          })}
                          {safeTriggers.length > 5 && (
                            <Button 
                              variant="ghost" 
                              className="w-full"
                              onClick={() => setActiveTab('triggers')}
                            >
                              View all {safeTriggers.length} triggers
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Signal Categories Overview */}
                  <Card className="card-bg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Radio className="h-5 w-5 text-blue-500" />
                        Signal Coverage by Category
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {SIGNAL_CATEGORIES.slice(0, 8).map(category => {
                          const triggerCount = getCategoryTriggerCount(category.id);
                          return (
                            <div 
                              key={category.id} 
                              className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                              onClick={() => {
                                setSelectedCategory(category);
                                setActiveTab('signals');
                              }}
                            >
                              <div 
                                className="w-8 h-8 rounded flex items-center justify-center"
                                style={{ backgroundColor: `${category.color}20` }}
                              >
                                <CategoryIcon 
                                  iconName={category.icon} 
                                  className="h-4 w-4"
                                  style={{ color: category.color }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{category.name}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-muted-foreground">{category.dataPoints.length} signals</span>
                                {triggerCount > 0 && (
                                  <Badge className="ml-2 text-xs" variant="secondary">{triggerCount} active</Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {SIGNAL_CATEGORIES.length > 8 && (
                          <Button 
                            variant="ghost" 
                            className="w-full text-sm"
                            onClick={() => setActiveTab('signals')}
                          >
                            View all {SIGNAL_CATEGORIES.length} categories
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="card-bg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col items-center gap-2"
                        onClick={() => setActiveTab('signals')}
                      >
                        <Radio className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Browse Signals</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col items-center gap-2"
                        onClick={() => setActiveTab('templates')}
                      >
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        <span className="text-sm">Use Template</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col items-center gap-2"
                        onClick={() => setCompositeDialogOpen(true)}
                      >
                        <Layers className="h-5 w-5 text-purple-500" />
                        <span className="text-sm">Composite Trigger</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col items-center gap-2"
                        onClick={() => setActiveTab('triggers')}
                      >
                        <Settings className="h-5 w-5 text-slate-500" />
                        <span className="text-sm">Manage Triggers</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="signals" className="mt-6">
              {!selectedCategory ? (
                <>
                  {/* Filters */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search signal categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                        data-testid="input-search-signals"
                      />
                    </div>
                    
                    <Tabs value={phaseFilter} onValueChange={(v) => setPhaseFilter(v as any)}>
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="external">External</TabsTrigger>
                        <TabsTrigger value="internal">Internal</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Category Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredCategories.map(category => (
                      <SignalCategoryCard
                        key={category.id}
                        category={category}
                        onSelect={() => setSelectedCategory(category)}
                        isActive={false}
                        triggerCount={getCategoryTriggerCount(category.id)}
                      />
                    ))}
                  </div>
                  
                  {filteredCategories.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No signal categories match your search</p>
                    </div>
                  )}
                </>
              ) : (
                /* Category Detail View */
                <Card className="card-bg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${selectedCategory.color}20` }}
                        >
                          <CategoryIcon 
                            iconName={selectedCategory.icon} 
                            className="h-6 w-6"
                            style={{ color: selectedCategory.color }}
                          />
                        </div>
                        <div>
                          <CardTitle>{selectedCategory.name}</CardTitle>
                          <CardDescription>{selectedCategory.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Refreshes every {selectedCategory.refreshInterval >= 86400 
                            ? `${selectedCategory.refreshInterval / 86400}d`
                            : selectedCategory.refreshInterval >= 3600
                            ? `${selectedCategory.refreshInterval / 3600}h`
                            : `${selectedCategory.refreshInterval / 60}m`
                          }
                        </Badge>
                        <Badge style={{ backgroundColor: selectedCategory.color, color: 'white' }}>
                          {selectedCategory.dataPoints.length} Data Points
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <span className="w-10">Enable</span>
                          <span>Data Point</span>
                        </span>
                        <span className="flex items-center gap-4">
                          <span>Value</span>
                          <span className="hidden md:inline">Sources</span>
                          <span>Settings</span>
                        </span>
                      </div>
                      
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-1">
                          {selectedCategory.dataPoints.map(dataPoint => {
                            const existingTrigger = safeTriggers.find((t: any) => 
                              t.conditions?.dataPointId === dataPoint.id
                            );
                            return (
                              <DataPointRow
                                key={dataPoint.id}
                                dataPoint={dataPoint}
                                category={selectedCategory}
                                onConfigureTrigger={handleConfigureTrigger}
                                onQuickToggle={handleQuickToggle}
                                existingTrigger={existingTrigger}
                                isToggling={createTriggerMutation.isPending || updateTriggerMutation.isPending}
                              />
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    {selectedCategory.recommendedPlaybooks.length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold mb-3">Recommended Playbooks</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCategory.recommendedPlaybooks.map((playbook, i) => (
                            <Link key={i} href="/playbook-library">
                              <Badge 
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: `${selectedCategory.color}20`, color: selectedCategory.color, borderColor: selectedCategory.color }}
                              >
                                <Target className="h-3 w-3 mr-1" />
                                {playbook}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="triggers" className="mt-6">
              <MyTriggersTab 
                triggers={safeTriggers}
                isLoading={triggersLoading}
                onEdit={handleEditTrigger}
                onToggle={handleToggleTrigger}
                onDelete={handleDeleteTrigger}
              />
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <TemplatesTab onUseTemplate={handleUseTemplate} />
            </TabsContent>
          </Tabs>
          
          <TriggerConfigDialog
            open={configDialogOpen}
            onOpenChange={setConfigDialogOpen}
            dataPoint={selectedDataPoint}
            category={selectedCategory}
            existingTrigger={editingTrigger}
            onSave={handleSaveTrigger}
          />
          
          <CompositeBuilderDialog
            open={compositeDialogOpen}
            onOpenChange={setCompositeDialogOpen}
            onSave={handleSaveTrigger}
          />
        </div>
      </div>
    </PageLayout>
  );
}
