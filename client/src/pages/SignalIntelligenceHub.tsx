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
      className=""
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
            <span style={{ fontSize: 10, fontWeight: 700, color: TEAL }}>{triggerCount} ACTIVE</span>
          )}
          <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", border: "1px solid #E8E4DC", padding: "2px 8px" }}>
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

// ── Preparation Signals Panel (Phase 5, Tier 8) ─────────────────────────────
function PreparationSignalsPanel() {
  const { data: raw } = useQuery({ queryKey: ['/api/preparation-signals'] });
  const triggers = Array.isArray(raw) ? raw : [];

  const { data: thresholds } = useQuery({ queryKey: ['/api/preparation-thresholds'] });
  const thresholdMap = (thresholds ?? {}) as Record<string, { warning: number; critical: number; playbook: string }>;

  if (triggers.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 28, height: 2, background: TEAL }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL }}>Internal Readiness Monitoring</span>
        </div>
        <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Readiness Gap Signals</h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 40, maxWidth: 640 }}>
          Declining organizational preparedness is treated as a trigger in its own right.
          When any strategic domain drops below its readiness threshold, a recovery protocol is automatically staged.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {Object.entries(thresholdMap).map(([domain, cfg]) => (
            <div key={domain} style={{ border: "1px solid #E8E4DC", padding: "20px 24px", background: "#fff" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{domain}</div>
              <div className="flex items-center gap-4 mt-2">
                <div style={{ fontSize: 11, color: "#6B7280" }}>
                  <span style={{ color: GOLD, fontWeight: 700 }}>⚠ {cfg.warning}%</span> warning
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>🔴 {cfg.critical}%</span> critical
                </div>
              </div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 8 }}>{cfg.playbook}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "48px 24px", border: "1px solid #E8E4DC", background: "#fff" }}>
          <CheckCircle className="h-10 w-10 mx-auto mb-4" style={{ color: TEAL, opacity: 0.5 }} />
          <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 8 }}>All preparedness thresholds met</div>
          <p style={{ fontSize: 13, color: "#6B7280" }}>
            All strategic domains are currently above their readiness thresholds.
            The system monitors continuously — any decline will appear here before it becomes a crisis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 28, height: 2, background: "#ef4444" }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#ef4444" }}>Readiness Gaps Detected</span>
      </div>
      <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Readiness Gap Signals</h2>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 32, maxWidth: 640 }}>
        These domains have dropped below their readiness thresholds.
        Each gap has a pre-staged recovery protocol ready for executive authorization.
      </p>
      <div className="space-y-4">
        {triggers.map((trigger: any) => {
          const isCritical = trigger.urgencyLevel === 'CRITICAL' || trigger.confidenceScore >= 90;
          const urgencyColor = isCritical ? "#ef4444" : GOLD;
          return (
            <div key={trigger.id} style={{ border: `1px solid ${urgencyColor}30`, borderLeft: `4px solid ${urgencyColor}`, background: "#fff", padding: "24px 28px" }}>
              <div className="flex items-start justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: urgencyColor, background: `${urgencyColor}12`, padding: "2px 10px" }}>
                      {isCritical ? "CRITICAL GAP" : "WARNING"}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {trigger.triggerDomain}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 12 }}>
                    {trigger.signalDescription}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span style={{ fontSize: 11, color: "#6B7280" }}>
                      Recovery protocol: <strong style={{ color: NAVY }}>{trigger.recommendedPlaybook}</strong>
                    </span>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>
                      Detected: <strong style={{ color: NAVY }}>{trigger.detectedAt ? new Date(trigger.detectedAt).toLocaleString() : "—"}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    style={{ background: NAVY, color: "#fff", borderRadius: 0, fontSize: 11, fontWeight: 700 }}
                    onClick={() => window.location.href = `/playbook-library`}
                  >
                    Activate Recovery Protocol
                  </Button>
                  <Button size="sm" variant="outline" style={{ borderRadius: 0, fontSize: 11, border: "1px solid #E8E4DC" }}>
                    Schedule Review
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
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

  const { data: leadingDetectionsRaw } = useQuery<any[]>({
    queryKey: ['/api/leading-indicator-detections'],
    retry: false,
    placeholderData: []
  });
  const leadingDetections = Array.isArray(leadingDetectionsRaw) ? leadingDetectionsRaw : [];

  const acknowledgeLeadingMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/leading-indicator-detections/${id}/acknowledge`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leading-indicator-detections'] });
      toast({ title: 'Situation acknowledged', description: 'Developing situation logged to governance chain.' });
    }
  });

  const { data: signalStatus, isError: isStatusError } = useQuery<any>({
    queryKey: ['/api/dynamic-strategy/status'],
    retry: false,
    placeholderData: null
  });

  const { data: triggersRaw, isLoading: triggersLoading } = useQuery<any[]>({
    queryKey: ['/api/dynamic-strategy/triggers'],
    retry: false,
    placeholderData: []
  });
  const triggers = Array.isArray(triggersRaw) ? triggersRaw : [];

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

  if (false) {
    return (
      <PageLayout>
        <div className="bg-white min-h-screen flex items-center justify-center p-6">
          <div style={{ background: "#0A0F2E", border: "1px solid #C9A84C", padding: 48, textAlign: "center", maxWidth: 600 }}>
            <h2 style={{ ...CG, color: GOLD, fontSize: 32, marginBottom: 16 }}>Signal Monitoring Active</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32, lineHeight: 1.6 }}>
              Real-time intelligence feeds are available to authenticated enterprise users. Sign in or apply for Founding Partner Access to connect your organization's signal layer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/founding-partner-program'}
                style={{ borderColor: "rgba(255,255,255,0.68)", color: "white" }}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setLocation('/founding-partner-program')}
                style={{ background: "#C9A84C", color: "#0A0F2E" }}
              >
                Apply for Founding Partner Access
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
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Signal Configuration</span>
              </div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", color: "#fff", lineHeight: 1.1 }}>
                Intelligence <em style={{ fontStyle: "italic", color: "#DFC178" }}>Command Hub</em>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 16, fontSize: 16, maxWidth: "600px" }}>
                Configure automated monitoring across all 19 signal categories covering market, competitive, and operational intelligence — 248+ data points, 221 triggers.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div style={{ textAlign: "right" }}>
                <div style={{ ...CG, fontSize: 32, color: GOLD, fontWeight: 600 }}>{triggers.length}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>ACTIVE MONITORS</div>
              </div>
              <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.15)" }} />
              <div style={{ textAlign: "right" }}>
                <div style={{ ...CG, fontSize: 32, color: TEAL, fontWeight: 600 }}>24/7</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>SURVEILLANCE</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 py-12">
          <Tabs defaultValue="browse" className="w-full">
            <TabsList style={{ background: "transparent", borderBottom: "1px solid #E8E4DC", width: "100%", justifyContent: "flex-start", borderRadius: 0, height: "auto", padding: 0, marginBottom: 48 }}>
              {[
                { key: "browse", label: "Signal Browser", icon: <Grid3X3 className="w-4 h-4 mr-2" /> },
                { key: "active", label: "Active Monitors", icon: <Activity className="h-4 w-4 mr-2" /> },
                { key: "developing", label: "Developing Situations", icon: <Brain className="h-4 w-4 mr-2" />, badge: leadingDetections.length },
                { key: "preparation", label: "Readiness Gaps", icon: <AlertTriangle className="h-4 w-4 mr-2" /> },
                { key: "templates", label: "Templates", icon: <Sparkles className="h-4 w-4 mr-2" /> },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.key}
                  value={tab.key} 
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
                  {tab.icon}
                  {tab.label}
                  {tab.badge != null && tab.badge > 0 && (
                    <span style={{ marginLeft: 6, background: TEAL, color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 99 }}>
                      {tab.badge}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="browse">
              <div className="grid grid-cols-12 gap-12">
                <div className="col-span-4 space-y-4">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Categories</span>
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

            {/* ── Developing Situations Tab ─────────────────────────── */}
            <TabsContent value="developing">
              <div className="max-w-4xl mx-auto py-12">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 28, height: 2, background: TEAL }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL }}>Early Warning Intelligence</span>
                </div>
                <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Developing Situations</h2>
                <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 40, maxWidth: 640 }}>
                  These patterns have not yet crossed the detection threshold, but multiple leading indicators are converging. Each situation below represents a pre-trigger signal cluster — the system detected early-stage evidence before a full trigger fires.
                </p>
                {leadingDetections.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 24px", border: "1px solid #E8E4DC", background: "#fff" }}>
                    <Radar className="h-10 w-10 mx-auto mb-4" style={{ color: TEAL, opacity: 0.5 }} />
                    <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 8 }}>No developing situations detected</div>
                    <p style={{ fontSize: 13, color: "#6B7280" }}>Leading indicators are actively monitored. Any pre-trigger convergence will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {[...leadingDetections]
                      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
                      .map((det: any) => {
                        const pct = Math.min(100, Math.round((det.indicatorsMatched / Math.max(det.totalIndicators, 1)) * 100));
                        const urgencyColor = pct >= 70 ? "#ef4444" : pct >= 40 ? GOLD : TEAL;
                        return (
                          <div key={det.id} style={{ border: `1px solid ${urgencyColor}30`, borderLeft: `4px solid ${urgencyColor}`, background: "#fff", padding: "20px 24px" }}>
                            <div className="flex items-start justify-between gap-8">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: urgencyColor, background: `${urgencyColor}12`, padding: "2px 8px" }}>
                                    {pct >= 70 ? "HIGH CONVERGENCE" : pct >= 40 ? "DEVELOPING" : "EARLY SIGNAL"}
                                  </span>
                                  <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                    {det.triggerPattern}
                                  </span>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                  <div className="flex items-center gap-3 mb-1">
                                    <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{det.indicatorsMatched} of {det.totalIndicators} leading indicators matched</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: urgencyColor }}>{pct}% convergence</span>
                                  </div>
                                  <div style={{ height: 6, background: "#E8E4DC", position: "relative" }}>
                                    <div style={{ height: "100%", width: `${pct}%`, background: urgencyColor, transition: "width 0.4s ease" }} />
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 flex-wrap">
                                  <span style={{ fontSize: 11, color: "#6B7280" }}>
                                    Detected: <strong style={{ color: NAVY }}>{new Date(det.detectedAt).toLocaleString()}</strong>
                                  </span>
                                  {det.matchScore != null && (
                                    <span style={{ fontSize: 11, color: "#6B7280" }}>
                                      Match score: <strong style={{ color: NAVY }}>{det.matchScore.toFixed(1)}</strong>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 flex-shrink-0">
                                <Button
                                  size="sm"
                                  onClick={() => acknowledgeLeadingMutation.mutate(det.id)}
                                  disabled={acknowledgeLeadingMutation.isPending}
                                  style={{ background: NAVY, color: "#fff", borderRadius: 0, fontSize: 11, fontWeight: 700 }}
                                >
                                  <Eye className="h-3 w-3 mr-1.5" />
                                  Acknowledge
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  style={{ borderRadius: 0, fontSize: 11, border: `1px solid #E8E4DC` }}
                                >
                                  <Layers className="h-3 w-3 mr-1.5" />
                                  Stage Protocol
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preparation">
              <PreparationSignalsPanel />
            </TabsContent>

            <TabsContent value="templates">
              <div className="max-w-4xl mx-auto py-12">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 28, height: 2, background: GOLD }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Pre-Built Monitor Templates</span>
                </div>
                <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Quick-Start Templates</h2>
                <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 40, maxWidth: 640 }}>
                  Deploy a pre-configured monitor in one click. Each template is mapped to a recommended Readiness Protocol and uses default thresholds validated across enterprise deployments.
                </p>
                <div className="grid grid-cols-1 gap-6">
                  {TRIGGER_TEMPLATES.map(template => {
                    const Icon = template.icon;
                    const alreadyActive = triggers.some(t => t.conditions?.dataPointId === template.dataPointId);
                    return (
                      <div key={template.id} style={{ border: "1px solid #E8E4DC", padding: "28px 32px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
                        <div className="flex items-center gap-6">
                          <div style={{ width: 52, height: 52, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY }}>{template.name}</h3>
                              {alreadyActive && (
                                <span style={{ fontSize: 10, fontWeight: 800, color: TEAL, background: "rgba(43,138,110,0.1)", padding: "2px 8px", letterSpacing: "0.1em" }}>ACTIVE</span>
                              )}
                            </div>
                            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 10 }}>{template.description}</p>
                            <div className="flex items-center gap-4">
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", background: "#F3F4F6", padding: "3px 10px" }}>
                                Threshold: {getOperatorLabel(template.operator)} {template.value}
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: template.urgency === 'critical' ? '#ef4444' : GOLD, background: template.urgency === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(201,168,76,0.1)', padding: "3px 10px" }}>
                                {template.urgency.toUpperCase()} URGENCY
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          disabled={alreadyActive || saveTriggerMutation.isPending}
                          onClick={() => {
                            const cat = SIGNAL_CATEGORIES.find(c => c.id === template.category);
                            saveTriggerMutation.mutate({
                              name: template.name,
                              description: template.description,
                              category: template.category,
                              triggerType: 'threshold',
                              conditions: { dataPointId: template.dataPointId, operator: template.operator, value: template.value },
                              alertThreshold: mapUrgencyToAlertThreshold(template.urgency),
                              isActive: true,
                              recommendedPlaybooks: cat?.recommendedPlaybooks ?? []
                            });
                          }}
                          style={{ flexShrink: 0, background: alreadyActive ? "#E8E4DC" : NAVY, color: alreadyActive ? "#9CA3AF" : "#fff", borderRadius: 0, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", padding: "10px 24px", cursor: alreadyActive ? "default" : "pointer" }}
                        >
                          {alreadyActive ? "Already Active" : "Deploy Monitor"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="max-w-4xl mx-auto py-12 space-y-6">
                {triggersLoading && (
                  <div style={{ textAlign: "center", padding: "60px 24px" }}>
                    <p style={{ color: "#6B7280", fontSize: 14 }}>Loading active monitors…</p>
                  </div>
                )}
                {!triggersLoading && triggers.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 24px", border: "1px solid #E8E4DC", background: "#fff" }}>
                    <Bell className="h-10 w-10 mx-auto mb-4" style={{ color: TEAL, opacity: 0.4 }} />
                    <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 8 }}>No active monitors configured</div>
                    <p style={{ fontSize: 13, color: "#6B7280", maxWidth: 480, margin: "0 auto 32px" }}>
                      Active monitors watch your organization's key signals 24/7 and stage the appropriate Readiness Protocol the moment a threshold is crossed.
                      Deploy a template or configure a custom monitor from the Signal Browser.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        onClick={() => {
                          const el = document.querySelector('[data-value="templates"]') as HTMLElement;
                          el?.click();
                        }}
                        style={{ background: NAVY, color: "#fff", borderRadius: 0, fontWeight: 700, fontSize: 12 }}
                      >
                        Deploy a Template
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const el = document.querySelector('[data-value="browse"]') as HTMLElement;
                          el?.click();
                        }}
                        style={{ borderRadius: 0, border: "1px solid #E8E4DC", fontWeight: 700, fontSize: 12 }}
                      >
                        Open Signal Browser
                      </Button>
                    </div>
                  </div>
                )}
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

      {/* ── Data Point Configuration Dialog ─────────────────────────── */}
      {editingDataPoint && (
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent style={{ maxWidth: 560, borderRadius: 0, border: `1px solid #E8E4DC` }}>
            <DialogHeader>
              <DialogTitle style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY }}>
                Configure Monitor
              </DialogTitle>
              <DialogDescription style={{ fontSize: 13, color: "#6B7280" }}>
                {editingDataPoint.name} — set your threshold and alert level.
              </DialogDescription>
            </DialogHeader>

            <TriggerConfigForm
              dataPoint={editingDataPoint}
              existingTrigger={editingTrigger}
              onSave={(formData) => {
                saveTriggerMutation.mutate(formData, {
                  onSuccess: () => setIsConfigDialogOpen(false)
                });
              }}
              onCancel={() => setIsConfigDialogOpen(false)}
              isSaving={saveTriggerMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  );
}

function TriggerConfigForm({
  dataPoint,
  existingTrigger,
  onSave,
  onCancel,
  isSaving
}: {
  dataPoint: DataPoint;
  existingTrigger?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const cat = SIGNAL_CATEGORIES.find(c => c.dataPoints.some(d => d.id === dataPoint.id));
  const [operator, setOperator] = useState<string>(
    existingTrigger?.conditions?.operator ?? dataPoint.defaultThreshold?.operator ?? 'gt'
  );
  const [thresholdValue, setThresholdValue] = useState<string>(
    String(existingTrigger?.conditions?.value ?? dataPoint.defaultThreshold?.value ?? '')
  );
  const [urgency, setUrgency] = useState<string>(
    existingTrigger ? mapAlertThresholdToUrgency(existingTrigger.alertThreshold) : (dataPoint.defaultThreshold?.urgency ?? 'high')
  );

  const OPERATORS = [
    { value: 'gt', label: '> Greater than' },
    { value: 'gte', label: '≥ At least' },
    { value: 'lt', label: '< Less than' },
    { value: 'lte', label: '≤ At most' },
    { value: 'eq', label: '= Equals' },
    { value: 'spike', label: '↑ Spike above' },
    { value: 'drop', label: '↓ Drop below' },
  ];

  const URGENCIES = [
    { value: 'critical', label: 'Critical — immediate executive notification' },
    { value: 'high', label: 'High — same-day review required' },
    { value: 'medium', label: 'Medium — weekly review queue' },
    { value: 'low', label: 'Low — informational only' },
  ];

  return (
    <div className="space-y-5 py-2">
      <div style={{ background: "#F8F7F4", border: "1px solid #E8E4DC", padding: "14px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Data Point</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>{dataPoint.name}</div>
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{dataPoint.description}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>Condition</Label>
          <Select value={operator} onValueChange={setOperator}>
            <SelectTrigger style={{ borderRadius: 0, border: "1px solid #E8E4DC" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPERATORS.map(op => (
                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Threshold{dataPoint.unit ? ` (${dataPoint.unit})` : ''}
          </Label>
          <Input
            value={thresholdValue}
            onChange={e => setThresholdValue(e.target.value)}
            placeholder={String(dataPoint.defaultThreshold?.value ?? 'Enter value')}
            style={{ borderRadius: 0, border: "1px solid #E8E4DC" }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>Alert Level</Label>
        <Select value={urgency} onValueChange={setUrgency}>
          <SelectTrigger style={{ borderRadius: 0, border: "1px solid #E8E4DC" }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {URGENCIES.map(u => (
              <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className="pt-2">
        <Button variant="outline" onClick={onCancel} style={{ borderRadius: 0, border: "1px solid #E8E4DC" }}>
          Cancel
        </Button>
        <Button
          disabled={isSaving || !thresholdValue}
          onClick={() => onSave({
            ...(existingTrigger?.id ? { id: existingTrigger.id } : {}),
            name: `${dataPoint.name} Monitor`,
            description: `Monitoring threshold for ${dataPoint.name}`,
            category: cat?.id ?? 'competitive',
            triggerType: 'threshold',
            conditions: { dataPointId: dataPoint.id, operator, value: thresholdValue },
            alertThreshold: mapUrgencyToAlertThreshold(urgency),
            isActive: true,
            recommendedPlaybooks: cat?.recommendedPlaybooks ?? []
          })}
          style={{ borderRadius: 0, background: NAVY, color: "#fff", fontWeight: 700 }}
        >
          {isSaving ? 'Saving…' : existingTrigger ? 'Update Monitor' : 'Activate Monitor'}
        </Button>
      </DialogFooter>
    </div>
  );
}
