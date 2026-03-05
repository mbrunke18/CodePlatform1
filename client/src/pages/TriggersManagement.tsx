import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useSearch } from 'wouter';
import TriggerConfigurationWizard from '@/components/configuration/TriggerConfigurationWizard';
import TriggerProbabilityForecast from '@/components/predictive/TriggerProbabilityForecast';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';
import {
  AlertTriangle,
  Activity,
  Clock,
  TrendingUp,
  Target,
  Settings,
  Eye,
  Zap,
  Users,
  Pause,
  Plus,
  Bell,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  Info,
  Database,
  BarChart2,
  BookOpen,
  ChevronRight,
  Layers,
  Radio
} from 'lucide-react';
import { format } from 'date-fns';

function formatOperator(op: string): string {
  switch (op) {
    case 'gte': return '≥';
    case 'lte': return '≤';
    case 'gt': return '>';
    case 'lt': return '<';
    case 'eq': return '=';
    case 'drop': return 'drops ≥';
    case 'spike': return 'spikes ≥';
    case 'increase': return 'increases ≥';
    case 'decrease': return 'decreases ≥';
    default: return op;
  }
}

function parseConditionText(conditions: any, description: string): string {
  if (!conditions) return description;
  try {
    const c = typeof conditions === 'string' ? JSON.parse(conditions) : conditions;
    if (c.field && c.operator && c.value !== undefined) {
      const field = String(c.field).replace(/_/g, ' ');
      return `${field} ${formatOperator(c.operator)} ${c.value}${typeof c.value === 'number' && c.operator === 'drop' ? '%' : ''}`;
    }
  } catch {}
  return description;
}

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const METRIC_TYPE_COLORS: Record<string, string> = {
  percentage: '#2B8A6E',
  count: '#0A0F2E',
  currency: '#C9A84C',
  score: '#7C3AED',
  boolean: '#6B7280',
  text: '#6B7280',
  trend: '#2563EB',
};

const CATEGORY_TO_SIGNALS: Record<string, string[]> = {
  'supply-chain': ['supplychain', 'geopolitical'],
  'supply_chain': ['supplychain'],
  'security': ['cyber', 'technology'],
  'cyber': ['cyber'],
  'financial': ['financial', 'economic'],
  'market': ['market', 'competitive'],
  'competitive': ['competitive'],
  'customer': ['customer'],
  'talent': ['talent'],
  'regulatory': ['regulatory'],
  'innovation': ['innovation', 'technology'],
  'technology': ['technology', 'innovation'],
  'geopolitical': ['geopolitical'],
  'economic': ['economic'],
  'esg': ['esg'],
  'media': ['media'],
  'brand': ['media'],
  'operational': ['execution'],
  'execution': ['execution'],
  'partnership': ['partnership'],
  'behavior': ['behavior'],
};

function getCategorySignals(triggerCategory: string) {
  const cat = (triggerCategory || '').toLowerCase().replace(/ /g, '-');
  const ids = CATEGORY_TO_SIGNALS[cat] || [cat];
  return SIGNAL_CATEGORIES.filter(sc => ids.includes(sc.id));
}

export default function TriggersManagement({ embedded }: { embedded?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editTriggerData, setEditTriggerData] = useState<any>(null);
  const [viewTrigger, setViewTrigger] = useState<any>(null);
  const { toast } = useToast();
  const searchString = useSearch();

  const { data: triggersData, isLoading } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  const { data: signalData } = useQuery<any[]>({
    queryKey: ['/api/trigger-signals', viewTrigger?.category],
    queryFn: () => fetch(`/api/trigger-signals?category=${encodeURIComponent(viewTrigger?.category || '')}`).then(r => r.json()),
    enabled: !!viewTrigger?.category,
  });

  const toggleTriggerMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest('PUT', `/api/executive-triggers/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executive-triggers'] });
      toast({ title: 'Trigger Updated', description: 'Monitoring status updated successfully.' });
    }
  });

  const allTriggers = (triggersData || []).map((trigger: any) => ({
    ...trigger,
    status: trigger.isActive ? (trigger.alertThreshold === 'red' ? 'triggered' : 'active') : 'paused',
  }));

  const triggeredCount = allTriggers.filter(t => t.status === 'triggered').length;
  const activeCount = allTriggers.filter(t => t.status === 'active').length;
  const pausedCount = allTriggers.filter(t => t.status === 'paused').length;

  const filteredTriggers = allTriggers.filter(trigger => {
    const categoryMatch = selectedCategory === 'all' || trigger.category === selectedCategory;
    const statusMatch = filterStatus === 'all' || trigger.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  // Handle URL parameters to auto-open edit dialog (e.g. ?id=...&action=edit)
  useEffect(() => {
    if (!triggersData || triggersData.length === 0) return;
    const params = new URLSearchParams(searchString);
    const triggerId = params.get('id');
    const action = params.get('action');
    if (triggerId) {
      const found = triggersData.find((t: any) => t.id === triggerId);
      if (found) {
        if (action === 'edit') {
          setEditTriggerData(found);
          setIsWizardOpen(true);
        } else {
          setViewTrigger({ ...found, status: found.isActive ? (found.alertThreshold === 'red' ? 'triggered' : 'active') : 'paused' });
        }
        setTimeout(() => {
          const el = document.querySelector(`[data-trigger-id="${triggerId}"]`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    }
  }, [triggersData, searchString]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A84C]" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout embedded={embedded}>
      <div className="flex-1 overflow-auto bg-white">
        <div className="p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div style={{ width: 48, height: 48, background: NAVY, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Execution Control</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "2rem", color: NAVY }}>Triggers & Guardrails</h1>
              </div>
            </div>
            <Button
              style={{ background: NAVY, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
              onClick={() => { setEditTriggerData(null); setIsWizardOpen(true); }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Trigger
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Critical Alerts', value: triggeredCount, color: '#EF4444', icon: <Bell className="h-6 w-6 text-red-500" /> },
              { label: 'Active Monitoring', value: activeCount, color: TEAL, icon: <Activity className="h-6 w-6" style={{ color: TEAL }} /> },
              { label: 'Paused Triggers', value: pausedCount, color: NAVY, icon: <Pause className="h-6 w-6 text-gray-400" /> },
              { label: 'Total Triggers', value: allTriggers.length, color: NAVY, icon: <Target className="h-6 w-6" style={{ color: GOLD }} /> },
            ].map((m, i) => (
              <Card key={i} className="border border-[#E8E4DC] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{m.label}</p>
                      <p style={{ ...CG, fontSize: "1.5rem", fontWeight: 600, color: m.color }}>{m.value}</p>
                    </div>
                    {m.icon}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Trigger Probability Forecast */}
          <div className="mb-8">
            <TriggerProbabilityForecast triggers={allTriggers} compact={false} />
          </div>

          {/* Triggers List Section */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Management Dashboard</span>
              </div>
              <div className="flex items-center space-x-4">
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto">
                  <TabsList className="bg-gray-100 p-1">
                    <TabsTrigger value="all" className="text-[10px] font-bold uppercase tracking-wider">All</TabsTrigger>
                    <TabsTrigger value="supply-chain" className="text-[10px] font-bold uppercase tracking-wider">Supply Chain</TabsTrigger>
                    <TabsTrigger value="security" className="text-[10px] font-bold uppercase tracking-wider">Security</TabsTrigger>
                    <TabsTrigger value="financial" className="text-[10px] font-bold uppercase tracking-wider">Financial</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredTriggers.map((trigger) => (
                <Card
                  key={trigger.id}
                  data-trigger-id={trigger.id}
                  className="border border-[#E8E4DC] hover:border-[#C9A84C] transition-all bg-white overflow-hidden shadow-sm"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch">
                      <div className={`w-1 flex-shrink-0 ${trigger.status === 'triggered' ? 'bg-red-500' : 'bg-[#2B8A6E]'}`} />
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                              <h3 style={{ ...CG, fontSize: "1.25rem", fontWeight: 600, color: NAVY }}>{trigger.name}</h3>
                              <div style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                background: trigger.status === 'triggered' ? 'rgba(239,68,68,0.1)' : 'rgba(43,138,110,0.12)',
                                color: trigger.status === 'triggered' ? '#EF4444' : '#3BAF8A',
                                fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px"
                              }}>
                                {trigger.status}
                              </div>
                              <div className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${trigger.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-[#C9A84C] text-[#0A0F2E]'}`}>
                                {trigger.severity}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 max-w-2xl">{trigger.description}</p>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Monitoring</span>
                              <Switch
                                checked={trigger.isActive}
                                onCheckedChange={(isActive) => toggleTriggerMutation.mutate({ id: trigger.id, isActive })}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, border: "1px solid #E8E4DC" }}
                              onClick={() => setViewTrigger(trigger)}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, border: "1px solid rgba(201,168,76,0.35)" }}
                              onClick={() => { setEditTriggerData(trigger); setIsWizardOpen(true); }}
                            >
                              <Settings className="w-3.5 h-3.5 mr-1.5" />
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#E8E4DC] space-y-4">
                          {/* Trigger Condition — clickable row */}
                          <button
                            className="w-full text-left group"
                            onClick={() => setViewTrigger(trigger)}
                          >
                            <div className="flex items-center justify-between p-3 bg-[#F8F7F4] border border-[#E8E4DC] group-hover:border-[#C9A84C] group-hover:bg-[#FFFDF5] transition-all rounded">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Trigger Condition</p>
                                  <p className="text-sm font-semibold" style={{ color: NAVY }}>{parseConditionText(trigger.conditions, trigger.description)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                {(() => {
                                  const signals = getCategorySignals(trigger.category);
                                  const dpCount = signals.reduce((sum, s) => sum + s.dataPoints.length, 0);
                                  return dpCount > 0 ? (
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(43,138,110,0.1)", color: TEAL, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 4 }}>
                                      <Database className="w-3 h-3" />
                                      {dpCount} data points
                                    </div>
                                  ) : null;
                                })()}
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C9A84C] transition-colors" />
                              </div>
                            </div>
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-xs text-gray-500 uppercase tracking-wider font-bold">
                                <Activity className="w-3.5 h-3.5 mr-2" style={{ color: TEAL }} />
                                Automated Response
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" style={{ border: "1px solid #E8E4DC", color: NAVY, fontSize: 10 }}>
                                  {trigger.action || 'Execute Protocol'}
                                </Badge>
                                {trigger.status === 'triggered' && (
                                  <Badge style={{ background: TEAL, color: "#fff", fontSize: 10 }}>Executing</Badge>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-xs text-gray-500 uppercase tracking-wider font-bold">
                                <Clock className="w-3.5 h-3.5 mr-2" style={{ color: NAVY }} />
                                Last Evaluated
                              </div>
                              <p className="text-sm text-gray-600">
                                {trigger.updatedAt ? format(new Date(trigger.updatedAt), 'MMM d, h:mm a') : 'Never'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Guardrails Section */}
          <div className="mt-12">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Safety Protocols</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Budget Caps', description: 'Prevent automated execution from exceeding defined financial thresholds.', icon: <TrendingUp style={{ color: TEAL }} /> },
                { title: 'Human-in-the-Loop', description: 'Requires manual authorization for critical high-impact actions.', icon: <Users style={{ color: NAVY }} /> },
                { title: 'Conflict Detection', description: 'Identifies and pauses overlapping or contradictory execution protocols.', icon: <AlertTriangle style={{ color: GOLD }} /> }
              ].map((guardrail, idx) => (
                <Card key={idx} className="border border-[#E8E4DC] bg-[#F8F7F4] p-6 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-white border border-[#E8E4DC] flex items-center justify-center mb-4">
                    {guardrail.icon}
                  </div>
                  <h3 style={{ ...CG, fontSize: "1.125rem", fontWeight: 600, color: NAVY, marginBottom: 8 }}>{guardrail.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{guardrail.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Configuration Wizard — Create & Edit */}
      <TriggerConfigurationWizard
        isOpen={isWizardOpen}
        onClose={() => { setIsWizardOpen(false); setEditTriggerData(null); }}
        onSuccess={() => {
          setIsWizardOpen(false);
          setEditTriggerData(null);
          queryClient.invalidateQueries({ queryKey: ['/api/executive-triggers'] });
          toast({ title: editTriggerData ? 'Trigger Updated' : 'Trigger Created', description: editTriggerData ? 'Your trigger has been updated.' : 'Your new trigger is now active.' });
        }}
        editTrigger={editTriggerData}
      />

      {/* View Trigger Detail Sheet */}
      <Sheet open={!!viewTrigger} onOpenChange={(open) => { if (!open) setViewTrigger(null); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto" style={{ borderLeft: `3px solid ${GOLD}` }}>
          {viewTrigger && (
            <>
              <SheetHeader className="mb-6">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 2, background: GOLD }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Trigger Detail</span>
                </div>
                <SheetTitle style={{ ...CG, fontSize: "1.5rem", fontWeight: 600, color: NAVY }}>{viewTrigger.name}</SheetTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: viewTrigger.status === 'triggered' ? 'rgba(239,68,68,0.1)' : 'rgba(43,138,110,0.12)',
                    color: viewTrigger.status === 'triggered' ? '#EF4444' : '#3BAF8A',
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 12px"
                  }}>
                    {viewTrigger.status === 'triggered' ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    {viewTrigger.status}
                  </div>
                  <div className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${viewTrigger.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-[#C9A84C] text-[#0A0F2E]'}`}>
                    {viewTrigger.severity}
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Description */}
                <div className="p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-3.5 h-3.5" style={{ color: GOLD }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Description</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{viewTrigger.description}</p>
                </div>

                {/* Trigger Condition — parsed from conditions JSON */}
                <div style={{ border: `2px solid ${GOLD}`, background: "#FFFDF5", padding: 16 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4" style={{ color: GOLD }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>Active Trigger Condition</span>
                  </div>
                  <p className="text-base font-bold mb-3" style={{ color: NAVY }}>{parseConditionText(viewTrigger.conditions, viewTrigger.description)}</p>
                  {viewTrigger.conditions && (() => {
                    try {
                      const c = typeof viewTrigger.conditions === 'string' ? JSON.parse(viewTrigger.conditions) : viewTrigger.conditions;
                      return (
                        <div className="grid grid-cols-3 gap-2">
                          {c.field && (
                            <div className="bg-white border border-[#E8E4DC] p-3">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Signal Field</p>
                              <p className="text-xs font-bold" style={{ color: NAVY }}>{String(c.field).replace(/_/g, ' ')}</p>
                            </div>
                          )}
                          {c.operator && (
                            <div className="bg-white border border-[#E8E4DC] p-3">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Operator</p>
                              <p className="text-sm font-bold" style={{ color: TEAL }}>{formatOperator(c.operator)}</p>
                            </div>
                          )}
                          {c.value !== undefined && (
                            <div style={{ background: NAVY, padding: 12 }}>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-300 mb-1">Threshold</p>
                              <p className="text-sm font-bold text-white">{String(c.value)}{typeof c.value === 'number' && (c.operator === 'drop' || c.operator === 'spike') ? '%' : ''}</p>
                            </div>
                          )}
                        </div>
                      );
                    } catch { return null; }
                  })()}
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Category', value: viewTrigger.category || '—', icon: <Tag className="w-3.5 h-3.5" style={{ color: GOLD }} /> },
                    { label: 'Type', value: viewTrigger.triggerType || '—', icon: <Zap className="w-3.5 h-3.5" style={{ color: NAVY }} /> },
                    { label: 'Alert Threshold', value: viewTrigger.alertThreshold || '—', icon: <Bell className="w-3.5 h-3.5 text-red-500" /> },
                    { label: 'Monitoring', value: viewTrigger.isActive ? 'Active' : 'Paused', icon: viewTrigger.isActive ? <CheckCircle className="w-3.5 h-3.5" style={{ color: TEAL }} /> : <Pause className="w-3.5 h-3.5 text-gray-400" /> },
                  ].map((item, i) => (
                    <div key={i} className="p-3 border border-[#E8E4DC] bg-white">
                      <div className="flex items-center gap-1.5 mb-1">
                        {item.icon}
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{item.label}</span>
                      </div>
                      <p className="text-sm font-semibold capitalize" style={{ color: NAVY }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Intelligence Signal Data Points — from SIGNAL_CATEGORIES */}
                {(() => {
                  const matchedCategories = getCategorySignals(viewTrigger.category);
                  if (matchedCategories.length === 0) return null;
                  const totalDPs = matchedCategories.reduce((sum, sc) => sum + sc.dataPoints.length, 0);
                  return (
                    <div className="border border-[#E8E4DC]">
                      <div className="flex items-center justify-between p-4 border-b border-[#E8E4DC] bg-[#F8F7F4]">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" style={{ color: TEAL }} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Signal Intelligence — Data Points</span>
                        </div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(43,138,110,0.12)", color: TEAL, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px" }}>
                          {totalDPs} data points
                        </div>
                      </div>
                      <div className="p-4 space-y-5">
                        {matchedCategories.map((sc) => (
                          <div key={sc.id}>
                            <div className="flex items-center gap-2 mb-3">
                              <Radio className="w-3 h-3" style={{ color: sc.color || GOLD }} />
                              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: NAVY }}>{sc.name}</span>
                              <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded">{sc.dataPoints.length}</span>
                            </div>
                            <div className="space-y-2">
                              {sc.dataPoints.map((dp) => (
                                <div key={dp.id} className="bg-[#F8F7F4] border border-[#E8E4DC] p-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold" style={{ color: NAVY }}>{dp.name}</p>
                                      <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{dp.description}</p>
                                      {dp.sources && dp.sources.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                          {dp.sources.slice(0, 3).map((src) => (
                                            <span key={src} className="text-[8px] font-bold uppercase tracking-wider bg-white border border-[#E8E4DC] px-1.5 py-0.5 text-gray-500">{src.replace(/-/g, ' ')}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                      <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: `${METRIC_TYPE_COLORS[dp.metricType] || '#6B7280'}15`, color: METRIC_TYPE_COLORS[dp.metricType] || '#6B7280' }}>
                                        {dp.metricType}{dp.unit ? ` (${dp.unit})` : ''}
                                      </span>
                                      {dp.defaultThreshold && (
                                        <span className="text-[9px] font-mono font-bold text-gray-500">
                                          {formatOperator(dp.defaultThreshold.operator)} {String(dp.defaultThreshold.value)}{dp.unit ? dp.unit : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* DB Signal Data (if any live data) */}
                {signalData && signalData.length > 0 && (
                  <div className="p-4 border border-[#E8E4DC]">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-3.5 h-3.5" style={{ color: TEAL }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Live Signal Readings</span>
                      <span className="text-[9px] bg-[#E8F5EF] text-[#2B8A6E] font-bold px-2 py-0.5 rounded">{signalData.length} active</span>
                    </div>
                    <div className="space-y-2">
                      {signalData.map((sig: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-[#F8F7F4] border border-[#E8E4DC] text-xs">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{sig.name}</p>
                            {sig.description && <p className="text-gray-500 text-[10px] truncate">{sig.description}</p>}
                          </div>
                          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                            <span className="font-mono text-[10px] bg-white border border-[#E8E4DC] px-1.5 py-0.5" style={{ color: TEAL }}>
                              {formatOperator(sig.operator)} {sig.thresholdValue ?? sig.threshold_value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Playbooks */}
                {viewTrigger.recommendedPlaybooks && Array.isArray(viewTrigger.recommendedPlaybooks) && viewTrigger.recommendedPlaybooks.length > 0 && (
                  <div className="p-4 border border-[#E8E4DC]">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-3.5 h-3.5" style={{ color: GOLD }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Linked Playbooks</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {viewTrigger.recommendedPlaybooks.map((pb: string, i: number) => (
                        <Badge key={i} variant="outline" style={{ border: `1px solid ${GOLD}`, color: NAVY, fontSize: 10 }}>{pb}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action */}
                <div className="p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-3.5 h-3.5" style={{ color: TEAL }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Automated Response</span>
                  </div>
                  <Badge variant="outline" style={{ border: `1px solid ${TEAL}`, color: TEAL, fontSize: 11 }}>
                    {viewTrigger.action || 'Execute Protocol'}
                  </Badge>
                </div>

                {/* Timestamps */}
                <div className="p-4 border border-[#E8E4DC]">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-3.5 h-3.5" style={{ color: NAVY }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Timeline</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Evaluated</span>
                      <span className="font-medium" style={{ color: NAVY }}>
                        {viewTrigger.updatedAt ? format(new Date(viewTrigger.updatedAt), 'MMM d, yyyy h:mm a') : 'Never'}
                      </span>
                    </div>
                    {viewTrigger.lastTriggeredAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Triggered</span>
                        <span className="font-medium text-red-600">
                          {format(new Date(viewTrigger.lastTriggeredAt), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    )}
                    {viewTrigger.triggerCount !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Fires</span>
                        <span className="font-bold" style={{ color: NAVY }}>{viewTrigger.triggerCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit CTA */}
                <Button
                  className="w-full"
                  style={{ background: NAVY, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
                  onClick={() => { setViewTrigger(null); setEditTriggerData(viewTrigger); setIsWizardOpen(true); }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit This Trigger
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
