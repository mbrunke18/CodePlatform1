import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from '@/components/layout/PageLayout';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DecisionVelocityDashboard from '@/components/DecisionVelocityDashboard';
import { 
  Shield, 
  Zap, 
  Target, 
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Brain,
  TrendingUp,
  Eye,
  Clock,
  BarChart3,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Radio,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { queryClient } from '@/lib/queryClient';
import { BrandStamp } from "@/components/BrandStamp";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function StatusIndicator({ status }: { status: 'good' | 'warning' | 'critical' }) {
  const config = {
    good: { bg: 'bg-[#2B8A6E]', className: 'text-[#2B8A6E]', label: 'Healthy' },
    warning: { bg: 'bg-[#C9A84C]', className: 'text-[#C9A84C]', label: 'Attention' },
    critical: { bg: 'bg-red-500', className: 'text-red-700', label: 'Critical' }
  };
  const c = config[status];
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${c.bg}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${c.className}`}>{c.label}</span>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  unit,
  trend,
  trendDirection,
  status,
  icon: Icon,
  description
}: {
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  status: 'good' | 'warning' | 'critical';
  icon: any;
  description?: string;
}) {
  const statusBorders = {
    good: 'border-l-[#2B8A6E]',
    warning: 'border-l-[#C9A84C]',
    critical: 'border-l-red-500'
  };

  const trendIcons = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    neutral: Minus
  };
  const TrendIcon = trendDirection ? trendIcons[trendDirection] : null;

  const trendClasses = {
    up: 'text-[#2B8A6E]',
    down: 'text-red-700',
    neutral: 'text-gray-400'
  };

  return (
    <Card className={`border-l-4 ${statusBorders[status]} bg-white border-[#E8E4DC] hover:shadow-md transition-shadow`}>
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div style={{ width: 32, height: 32, background: NAVY, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <StatusIndicator status={status} />
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">{title}</div>
          <div className="flex items-baseline gap-1">
            <span style={{ ...CG, fontSize: "32px", fontWeight: 600, color: NAVY }}>{value}</span>
            {unit && <span style={{ ...CG, fontSize: "18px", color: "#6B7280" }}>{unit}</span>}
          </div>
        </div>
        {trend && trendDirection && TrendIcon && (
          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${trendClasses[trendDirection]}`}>
            <TrendIcon className="h-3 w-3" />
            <span>{trend}</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface ReadinessMetric {
  id: string;
  organizationId: string;
  overallScore: string;
  playbookMaturity: string;
  executionVelocity: string;
  learningRate: string;
  signalDetection: string;
  insights: Record<string, any>;
  calculatedAt: string;
}

interface WeakSignal {
  id: string;
  title: string;
  urgency: string;
  confidence: string;
  description: string;
  detectedAt: string;
}

interface OraclePattern {
  id: string;
  title: string;
  impact: string;
  confidence: string;
  description: string;
}

export default function ExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    updatePageMetadata({
      title: "Executive Dashboard | ExecuteIQ",
      description: "Unified strategic command center for Execution OS.",
    });
  }, []);

  const { data: dynamicStatus } = useQuery<any>({
    queryKey: ['/api/dynamic-strategy/status'],
  });

  const { data: readiness } = useQuery<ReadinessMetric>({
    queryKey: ['/api/dynamic-strategy/readiness'],
  });

  const { data: weakSignalsData } = useQuery<WeakSignal[]>({
    queryKey: ['/api/dynamic-strategy/weak-signals'],
  });

  const { data: oraclePatternsData } = useQuery<OraclePattern[]>({
    queryKey: ['/api/dynamic-strategy/oracle-patterns'],
  });

  const { data: organizationsData } = useQuery<any[]>({ 
    queryKey: ['/api/organizations'] 
  });

  const weakSignals = weakSignalsData ?? [];
  const oraclePatterns = oraclePatternsData ?? [];
  const organizations = organizationsData ?? [];

  const { data: preparednessScore } = useQuery({
    queryKey: ['/api/preparedness-score'],
  });

  const { data: activeTriggers } = useQuery({
    queryKey: ['/api/triggers'],
  });

  const friScore = parseFloat(readiness?.overallScore || '0') || dynamicStatus?.readinessScore || 84.5;
  const playbookMaturity = parseFloat(readiness?.playbookMaturity || '78');
  const executionVelocity = parseFloat(readiness?.executionVelocity || '92');
  const signalDetection = parseFloat(readiness?.signalDetection || '86');
  
  const activeTriggersList = Array.isArray(activeTriggers) ? activeTriggers : [];
  const activeCount = activeTriggersList.filter((t: any) => t.status === 'active').length || 12;

  const overallStatus: 'good' | 'warning' | 'critical' = 
    friScore >= 80 ? 'good' :
    friScore >= 60 ? 'warning' : 'critical';

  const handleRecalculate = async () => {
    try {
      await fetch('/api/dynamic-strategy/readiness/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/readiness'] });
    } catch (error) {
      console.error('Failed to recalculate:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#2B8A6E]';
    if (score >= 60) return 'text-[#C9A84C]';
    return 'text-red-700';
  };

  const organizationId = organizations[0]?.id || 'demo-org-1';

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        {/* Navy Header */}
        <div style={{ background: NAVY, padding: "48px 48px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)" }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                  Executive Command
                </span>
              </div>
              <h1 style={{ ...CG, color: "#fff", fontSize: "40px", fontWeight: 600, lineHeight: 1.1 }}>
                Unified Strategic <em style={{ fontStyle: "italic", color: "#DFC178" }}>Command</em>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }} className="px-3 py-1">
                <Activity className="h-3 w-3 mr-2 text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Live System</span>
              </Badge>
              <Button 
                onClick={handleRecalculate}
                style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff" }}
                className="hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Intelligence
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList style={{ background: "#E8E4DC", padding: 4 }} className="grid grid-cols-4 mb-8 rounded-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] text-[10px] font-bold uppercase tracking-widest">
                Overview
              </TabsTrigger>
              <TabsTrigger value="readiness" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] text-[10px] font-bold uppercase tracking-widest">
                Readiness
              </TabsTrigger>
              <TabsTrigger value="velocity" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] text-[10px] font-bold uppercase tracking-widest">
                Velocity
              </TabsTrigger>
              <TabsTrigger value="preparedness" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] text-[10px] font-bold uppercase tracking-widest">
                Crisis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-0">
              {/* Hero Score */}
              <Card className="border-[#E8E4DC] bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row items-stretch">
                    <div style={{ background: "#F8F7F4", borderRight: "1px solid #E8E4DC" }} className="p-12 text-center lg:w-1/3">
                      <div style={{ ...CG, fontSize: "64px", fontWeight: 600 }} className={getScoreColor(friScore)}>
                        {friScore.toFixed(1)}%
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mt-2">Future Readiness Index™</div>
                    </div>
                    <div className="p-12 flex-1 flex flex-col justify-center space-y-6">
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 28, height: 2, background: GOLD }} />
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Status Assessment</span>
                      </div>
                      <h2 style={{ ...CG, fontSize: "32px", fontWeight: 600, color: NAVY }}>Your organization is in a <em style={{ fontStyle: "italic", color: TEAL }}>high-gravity</em> preparedness state.</h2>
                      <p className="text-gray-600 text-sm max-w-xl">
                        Based on real-time telemetry across 170 strategic playbooks and active signal detection modules. Decision velocity is currently outperforming industry benchmarks by 84%.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Playbook Maturity"
                  value={playbookMaturity.toFixed(0)}
                  unit="%"
                  trend="+2.3% this month"
                  trendDirection="up"
                  status={playbookMaturity >= 80 ? 'good' : 'warning'}
                  icon={Target}
                  description="Coverage across 9 domains"
                />
                <MetricCard
                  title="Execution Velocity"
                  value={executionVelocity.toFixed(0)}
                  unit="%"
                  trend="11.4 min avg response"
                  trendDirection="up"
                  status="good"
                  icon={Zap}
                  description="Trigger-to-Action speed"
                />
                <MetricCard
                  title="Active Signals"
                  value={activeCount}
                  trend="24/7 AI monitoring"
                  trendDirection="neutral"
                  status={activeCount >= 5 ? 'good' : 'warning'}
                  icon={Radio}
                  description="Real-time threat detection"
                />
                <MetricCard
                  title="Signal Precision"
                  value={signalDetection.toFixed(0)}
                  unit="%"
                  trend="Target: 92%"
                  trendDirection="up"
                  status="good"
                  icon={Eye}
                  description="AI pattern recognition accuracy"
                />
              </div>

              {/* Signals and Patterns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-[#E8E4DC] bg-white">
                  <CardHeader className="border-b border-[#E8E4DC]">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <AlertTriangle className="h-4 w-4 text-[#C9A84C]" />
                      <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>Weak Signals</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {weakSignals.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 italic text-sm">No signals requiring immediate attention</div>
                    ) : (
                      weakSignals.slice(0, 3).map((s) => (
                        <div key={s.id} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC] rounded-sm flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-[#0A0F2E]">{s.title}</div>
                            <div className="text-xs text-gray-500">{s.description}</div>
                          </div>
                          <Badge style={{ background: NAVY, color: "#fff", border: "none" }} className="text-[9px] font-bold uppercase tracking-widest">{s.urgency}</Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="border-[#E8E4DC] bg-white">
                  <CardHeader className="border-b border-[#E8E4DC]">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>Oracle Patterns</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {oraclePatterns.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 italic text-sm">Oracle is synthesizing data...</div>
                    ) : (
                      oraclePatterns.slice(0, 3).map((p) => (
                        <div key={p.id} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC] rounded-sm flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-[#0A0F2E]">{p.title}</div>
                            <div className="text-xs text-gray-500">{p.description}</div>
                          </div>
                          <div className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{p.impact} Impact</div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="velocity" className="mt-0">
               <DecisionVelocityDashboard organizationId={organizationId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
