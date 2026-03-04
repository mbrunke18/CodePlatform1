import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link, useSearch } from 'wouter';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { 
  AlertTriangle, 
  Activity, 
  Clock, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Settings, 
  Eye, 
  Zap, 
  Shield, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Pause, 
  Play, 
  ArrowLeft, 
  Home, 
  Plus,
  Bell
} from 'lucide-react';
import TriggerProbabilityForecast from '@/components/predictive/TriggerProbabilityForecast';
import { format } from 'date-fns';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function TriggersManagement({ embedded }: { embedded?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTrigger, setSelectedTrigger] = useState<any>(null);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('view');
  const { toast } = useToast();
  const searchString = useSearch();

  const { data: triggersData, isLoading } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  const toggleTriggerMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest('PUT', `/api/executive-triggers/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executive-triggers'] });
      toast({ title: 'Trigger Updated', description: 'Trigger status updated successfully.' });
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

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A84C]"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout embedded={embedded}>
      <div className="flex-1 page-background overflow-auto bg-white">
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
            <div className="flex items-center gap-4">
              <Button style={{ background: NAVY, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }} data-testid="button-create-trigger">
                <Plus className="w-4 h-4 mr-2" />
                Create New Trigger
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border border-[#E8E4DC] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Critical Alerts</p>
                    <p style={{ ...CG, fontSize: "1.5rem", fontWeight: 600, color: "#EF4444" }}>{triggeredCount}</p>
                  </div>
                  <Bell className="h-6 w-6 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-[#E8E4DC] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Monitoring</p>
                    <p style={{ ...CG, fontSize: "1.5rem", fontWeight: 600, color: "#2B8A6E" }}>{activeCount}</p>
                  </div>
                  <Activity className="h-6 w-6 text-[#2B8A6E]" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-[#E8E4DC] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Paused Triggers</p>
                    <p style={{ ...CG, fontSize: "1.5rem", fontWeight: 600, color: NAVY }}>{pausedCount}</p>
                  </div>
                  <Pause className="h-6 w-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-[#E8E4DC] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Triggers</p>
                    <p style={{ ...CG, fontSize: "1.5rem", fontWeight: 600, color: NAVY }}>{allTriggers.length}</p>
                  </div>
                  <Target className="h-6 w-6 text-[#C9A84C]" />
                </div>
              </CardContent>
            </Card>
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
                <Card key={trigger.id} className="border border-[#E8E4DC] hover:border-[#C9A84C] transition-all bg-white overflow-hidden shadow-sm">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch">
                      <div className={`w-1 ${trigger.status === 'triggered' ? 'bg-red-500' : 'bg-[#2B8A6E]'}`} />
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-3">
                              <h3 style={{ ...CG, fontSize: "1.25rem", fontWeight: 600, color: NAVY }}>{trigger.name}</h3>
                              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background: trigger.status === 'triggered' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(43,138,110,0.12)', color: trigger.status === 'triggered' ? '#EF4444' : '#3BAF8A', fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                                {trigger.status}
                              </div>
                              <div className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${trigger.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-[#C9A84C] text-[#0A0F2E]'}`}>
                                {trigger.severity}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 max-w-2xl">{trigger.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
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
                              onClick={() => { setSelectedTrigger(trigger); setSheetMode('view'); }}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
                              onClick={() => { setSelectedTrigger(trigger); setSheetMode('edit'); }}
                            >
                              <Settings className="w-3.5 h-3.5 mr-1.5" />
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-[#E8E4DC]">
                          <div className="space-y-2">
                            <div className="flex items-center text-xs text-gray-500 uppercase tracking-wider font-bold">
                              <Target className="w-3.5 h-3.5 mr-2 text-[#C9A84C]" />
                              Condition
                            </div>
                            <p className="text-sm font-medium text-gray-800">{trigger.condition || trigger.description}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-xs text-gray-500 uppercase tracking-wider font-bold">
                              <Activity className="w-3.5 h-3.5 mr-2 text-[#2B8A6E]" />
                              Automated Response
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" style={{ border:"1px solid #E8E4DC", color: NAVY, fontSize: 10 }}>{trigger.action || 'Execute Protocol'}</Badge>
                              {trigger.status === 'triggered' && (
                                <Badge style={{ background: "#2B8A6E", color: "#fff", fontSize: 10 }}>Executing</Badge>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-xs text-gray-500 uppercase tracking-wider font-bold">
                              <Clock className="w-3.5 h-3.5 mr-2 text-[#0A0F2E]" />
                              Last Evaluated
                            </div>
                            <p className="text-sm text-gray-600">
                              {trigger.updatedAt ? format(new Date(trigger.updatedAt), 'MMM d, h:mm a') : 'Never'}
                            </p>
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
                { title: 'Budget Caps', description: 'Prevent automated execution from exceeding defined financial thresholds.', icon: <TrendingUp className="text-[#2B8A6E]" /> },
                { title: 'Human-in-the-Loop', description: 'Requires manual authorization for critical high-impact actions.', icon: <Users className="text-[#0A0F2E]" /> },
                { title: 'Conflict Detection', description: 'Identifies and pauses overlapping or contradictory execution protocols.', icon: <AlertTriangle className="text-[#C9A84C]" /> }
              ].map((guardrail, idx) => (
                <Card key={idx} className="border border-[#E8E4DC] bg-[#F8F7F4] p-6 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-white border border-[#E8E4DC] flex items-center justify-center mb-4">
                    {guardrail.icon}
                  </div>
                  <h3 style={{ ...CG, fontSize: "1.125rem", fontWeight: 600, color: NAVY, marginBottom: 8 }}>{guardrail.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{guardrail.description}</p>
                  <Button variant="link" className="p-0 h-auto text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:text-[#DFC178]">
                    Configure Protocol
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}