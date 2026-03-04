import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Radio, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
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
  Sparkles,
  Brain,
  Timer,
  Radar,
  Grid3X3
} from 'lucide-react';
import { Link } from 'wouter';
import { SIGNAL_CATEGORIES, type SignalCategory, type DataPoint } from '@shared/intelligence-signals';
import { SubBrandLabel } from "@/components/SubBrandLabel";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

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
    color: TEAL
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
    color: GOLD
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
    color: '#2B8A6E'
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
    color: NAVY
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
    <div 
      style={{ 
        border: isActive ? `2px solid ${NAVY}` : "1px solid #E8E4DC", 
        padding: 24, 
        background: isActive ? "#F8F7F4" : "#fff", 
        cursor: "pointer", 
        transition: "all 0.2s" 
      }}
      onClick={onSelect}
      className="hover:shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          style={{ width: 40, height: 40, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CategoryIcon 
            iconName={category.icon} 
            className="h-5 w-5 text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          {triggerCount > 0 && (
            <span style={{ fontSize: 9, fontWeight: 700, color: TEAL }}>{triggerCount} ACTIVE</span>
          )}
          <span style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", border: "1px solid #E8E4DC", padding: "2px 8px" }}>
            {category.phase.toUpperCase()}
          </span>
        </div>
      </div>
      
      <h3 style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY, marginBottom: 8 }}>{category.shortName}</h3>
      <p style={{ fontSize: 12, color: "#4B5563", marginBottom: 16, lineHeight: 1.5 }} className="line-clamp-2">
        {category.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>{dataPointCount} DATA POINTS</span>
        <ChevronRight className="h-4 w-4" style={{ color: GOLD }} />
      </div>
    </div>
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
  const { data: signalStatus } = useQuery<any>({
    queryKey: ['/api/dynamic-strategy/status'],
    retry: false,
    placeholderData: null
  });

  const isActive = existingTrigger?.isActive ?? false;

  const currentValue = signalStatus?.metrics?.[dataPoint.id] || 
    (dataPoint.metricType === 'percentage' 
    ? '0%'
    : dataPoint.metricType === 'currency'
    ? '$0'
    : '0');

  const handleToggle = (checked: boolean) => {
    onQuickToggle(dataPoint, category, checked, existingTrigger?.id);
  };

  return (
    <div style={{ padding: "16px 24px", borderBottom: "1px solid #E8E4DC" }} className="flex items-center justify-between hover:bg-[#F8F7F4] transition-colors">
      <div className="flex items-center gap-6 flex-1">
        <Switch 
          checked={isActive}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          className="data-[state=checked]:bg-[#2B8A6E]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>{dataPoint.name}</span>
            {dataPoint.defaultThreshold && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", background: "#E8E4DC", padding: "2px 8px" }}>
                {getOperatorLabel(dataPoint.defaultThreshold.operator)} {dataPoint.defaultThreshold.value}{dataPoint.unit || ''}
              </span>
            )}
            {isActive && (
              <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, display: "flex", alignItems: "center", gap: 4 }}>
                <Bell className="h-3 w-3" />
                MONITORING
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{dataPoint.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-8 ml-8">
        <div className="text-right">
          <div style={{ fontSize: 16, fontWeight: 600, color: NAVY }}>{currentValue}</div>
          <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>Current</div>
        </div>
        
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => onConfigureTrigger(dataPoint)}
          className="text-[#6B7280] hover:text-[#0A0F2E]"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function SignalIntelligenceHub() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(SIGNAL_CATEGORIES[0].id);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [editingDataPoint, setEditingDataPoint] = useState<DataPoint | null>(null);
  const [editingTrigger, setEditingTrigger] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: signalStatus, isError: isStatusError } = useQuery<any>({
    queryKey: ['/api/dynamic-strategy/status'],
    retry: false,
    placeholderData: null
  });

  const { data: triggers = [], isLoading: triggersLoading } = useQuery<any[]>({
    queryKey: ['/api/dynamic-strategy/triggers'],
    retry: false,
    placeholderData: []
  });

  const saveTriggerMutation = useMutation({
    mutationFn: (triggerData: any) => {
      const endpoint = triggerData.id 
        ? `/api/dynamic-strategy/triggers/${triggerData.id}`
        : '/api/dynamic-strategy/triggers';
      return apiRequest(triggerData.id ? 'PATCH' : 'POST', endpoint, triggerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/triggers'] });
      toast({ title: 'Trigger Saved', description: 'Monitoring configuration updated successfully.' });
    }
  });

  const deleteTriggerMutation = useMutation({
    mutationFn: (triggerId: string) => apiRequest('DELETE', `/api/dynamic-strategy/triggers/${triggerId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/triggers'] });
      toast({ title: 'Trigger Deleted' });
    }
  });

  const toggleTriggerMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string, isActive: boolean }) => 
      apiRequest('PATCH', `/api/dynamic-strategy/triggers/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/triggers'] });
    }
  });

  const selectedCategory = SIGNAL_CATEGORIES.find(c => c.id === selectedCategoryId)!;
  
  const filteredDataPoints = selectedCategory.dataPoints.filter(dp => 
    dp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTriggerForDataPoint = (dataPointId: string) => {
    return triggers.find(t => t.conditions?.dataPointId === dataPointId);
  };

  const handleQuickToggle = (dp: DataPoint, cat: SignalCategory, enable: boolean, existingId?: string) => {
    if (enable && !existingId) {
      saveTriggerMutation.mutate({
        name: `${dp.name} Monitor`,
        description: `Automated monitoring for ${dp.name}`,
        category: cat.id,
        triggerType: 'threshold',
        conditions: {
          dataPointId: dp.id,
          operator: dp.defaultThreshold?.operator || 'gt',
          value: dp.defaultThreshold?.value || 1
        },
        alertThreshold: dp.defaultThreshold?.urgency || 'high',
        isActive: true,
        recommendedPlaybooks: cat.recommendedPlaybooks
      });
    } else if (existingId) {
      toggleTriggerMutation.mutate({ id: existingId, isActive: enable });
    }
  };

  if (isStatusError || !signalStatus) {
    return (
      <PageLayout>
        <div className="bg-white min-h-screen flex items-center justify-center p-6">
          <div style={{ background: "#0A0F2E", border: "1px solid #C9A84C", padding: 48, textAlign: "center", maxWidth: 600 }}>
            <h2 style={{ ...CG, color: GOLD, fontSize: 32, marginBottom: 16 }}>Signal Monitoring Active</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32, lineHeight: 1.6 }}>
              Real-time intelligence feeds are available to authenticated enterprise users. Sign in or request pilot access to connect your organization's signal layer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/api/login'}
                style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setLocation('/pilot-program')}
                style={{ background: "#C9A84C", color: "#0A0F2E" }}
              >
                Request Pilot Access
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-white min-h-screen">
        {/* Navy Header */}
        <div style={{ background: NAVY, padding: "64px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="relative z-10 max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)" }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Signal Configuration</span>
              </div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", color: "#fff", lineHeight: 1.1 }}>
                Intelligence <em style={{ fontStyle: "italic", color: "#DFC178" }}>Command Hub</em>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 16, fontSize: 16, maxWidth: "600px" }}>
                Configure automated monitoring for 16 distinct categories of market, competitive, and operational intelligence.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div style={{ textAlign: "right" }}>
                <div style={{ ...CG, fontSize: 32, color: GOLD, fontWeight: 600 }}>{triggers.length}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>ACTIVE MONITORS</div>
              </div>
              <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.15)" }} />
              <div style={{ textAlign: "right" }}>
                <div style={{ ...CG, fontSize: 32, color: TEAL, fontWeight: 600 }}>24/7</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>SURVEILLANCE</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 py-12">
          <Tabs defaultValue="browse" className="w-full">
            <TabsList style={{ background: "transparent", borderBottom: "1px solid #E8E4DC", width: "100%", justifyContent: "flex-start", borderRadius: 0, height: "auto", padding: 0, marginBottom: 48 }}>
              {["browse", "active", "templates"].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  style={{ 
                    background: "transparent", 
                    border: "none", 
                    borderBottom: "2px solid transparent",
                    borderRadius: 0,
                    padding: "16px 32px",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#6B7280"
                  }}
                  className="data-[state=active]:border-b-[#0A0F2E] data-[state=active]:text-[#0A0F2E]"
                >
                  {tab === 'browse' && <Grid3X3 className="w-4 h-4 mr-2" />}
                  {tab === 'active' && <Activity className="h-4 w-4 mr-2" />}
                  {tab === 'templates' && <Sparkles className="h-4 w-4 mr-2" />}
                  {tab === 'browse' ? 'Signal Browser' : tab === 'active' ? 'Active Monitors' : 'Templates'}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="browse">
              <div className="grid grid-cols-12 gap-12">
                <div className="col-span-4 space-y-4">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Categories</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                    {SIGNAL_CATEGORIES.map(category => (
                      <SignalCategoryCard 
                        key={category.id}
                        category={category}
                        onSelect={() => setSelectedCategoryId(category.id)}
                        isActive={selectedCategoryId === category.id}
                        triggerCount={triggers.filter(t => t.category === category.id).length}
                      />
                    ))}
                  </div>
                </div>

                <div className="col-span-8">
                  <div style={{ border: "1px solid #E8E4DC", padding: 48, background: "#fff" }}>
                    <div className="flex items-center justify-between mb-12">
                      <div>
                        <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY }}>{selectedCategory.name}</h2>
                        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>{selectedCategory.description}</p>
                      </div>
                      <div className="relative w-64">
                        <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} className="h-4 w-4 text-[#6B7280]" />
                        <Input 
                          placeholder="Search signals..." 
                          style={{ paddingLeft: 40, borderRadius: 0, border: "1px solid #E8E4DC" }}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-0 border-t border-[#E8E4DC]">
                      {filteredDataPoints.map(dp => (
                        <DataPointRow 
                          key={dp.id}
                          dataPoint={dp}
                          category={selectedCategory}
                          onConfigureTrigger={(dp) => {
                            setEditingDataPoint(dp);
                            setEditingTrigger(getTriggerForDataPoint(dp.id));
                            setIsConfigDialogOpen(true);
                          }}
                          onQuickToggle={handleQuickToggle}
                          existingTrigger={getTriggerForDataPoint(dp.id)}
                          isToggling={toggleTriggerMutation.isPending || saveTriggerMutation.isPending}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="max-w-4xl mx-auto py-12 space-y-6">
                {triggers.map(trigger => {
                  const category = SIGNAL_CATEGORIES.find(c => c.id === trigger.category);
                  return (
                    <div key={trigger.id} style={{ border: "1px solid #E8E4DC", padding: 32, background: "#fff" }} className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div style={{ width: 48, height: 48, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {category && <CategoryIcon iconName={category.icon} className="h-6 w-6 text-white" />}
                        </div>
                        <div>
                          <h4 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY }}>{trigger.name}</h4>
                          <p style={{ fontSize: 13, color: "#6B7280" }}>{trigger.description}</p>
                          <div className="flex items-center gap-3 mt-4">
                            <Badge style={{ background: OFF, color: NAVY, border: "1px solid #E8E4DC", fontSize: 10 }}>{trigger.triggerType.toUpperCase()}</Badge>
                            <Badge style={{ background: trigger.alertThreshold === 'red' ? 'rgba(239,68,68,0.1)' : 'rgba(201,168,76,0.1)', color: trigger.alertThreshold === 'red' ? '#ef4444' : GOLD, border: "none", fontSize: 10 }}>
                              {mapAlertThresholdToUrgency(trigger.alertThreshold).toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch 
                          checked={trigger.isActive} 
                          onCheckedChange={(checked) => toggleTriggerMutation.mutate({ id: trigger.id, isActive: checked })}
                        />
                        <Button variant="ghost" onClick={() => {
                          const dp = category?.dataPoints.find(d => d.id === trigger.conditions?.dataPointId);
                          if (dp && category) {
                            setEditingDataPoint(dp);
                            setEditingTrigger(trigger);
                            setIsConfigDialogOpen(true);
                          }
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" onClick={() => deleteTriggerMutation.mutate(trigger.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
