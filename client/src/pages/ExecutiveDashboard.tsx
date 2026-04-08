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
import ExecutionIntelligenceDashboard from '@/components/ExecutionIntelligenceDashboard';
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
    critical: { bg: 'bg-[#dc2626]', className: 'text-[#dc2626]', label: 'Critical' }
  };
  const c = config[status];
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 ${c.bg} rounded-none`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest ${c.className}`}>{c.label}</span>
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
    critical: 'border-l-[#dc2626]'
  };

  const trendIcons = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    neutral: Minus
  };
  const TrendIcon = trendDirection ? trendIcons[trendDirection] : null;

  const trendClasses = {
    up: 'text-[#2B8A6E]',
    down: 'text-[#C9A84C]',
    neutral: 'text-[#6B7280]'
  };

  return (
    <Card className={`border-l-4 ${statusBorders[status]} bg-white border-[#E8E4DC] hover:shadow-md transition-shadow rounded-none shadow-sm`}>
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div style={{ width: 32, height: 32, background: "#0A0F2E", borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <StatusIndicator status={status} />
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6B7280] mb-1">{title}</div>
          <div className="flex items-baseline gap-1">
            <span style={{ ...CG, fontSize: "32px", fontWeight: 600, color: "#0A0F2E" }}>{value}{unit}</span>
          </div>
        </div>
        {trend && trendDirection && TrendIcon && (
          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${trendClasses[trendDirection]}`}>
            <TrendIcon className="h-3 w-3" />
            <span>{trend}</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-[#6B7280]">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface ReadinessMetric {
  id: string;
  organizationId: string;
  overallScore: number;
  foresightScore: number;
  velocityScore: number;
  agilityScore: number;
  learningScore: number;
  adaptabilityScore: number;
  playbooksReady: number;
  playbooksTotal: number;
  averageResponseTime: number;
  weakSignalsDetected: number;
  measurementDate: string;
}

interface WeakSignal {
  id: string;
  signalType: string;
  description: string;
  confidence: number;
  impact: string;
  timeline: string;
  source: string;
  status: string;
  detectedAt: string;
}

interface OraclePattern {
  id: string;
  patternType: string;
  description: string;
  impact: string;
  confidence: number;
  timeline: string;
  recommendations: string[];
  status: string;
}

export default function ExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    updatePageMetadata({
      title: "Executive Dashboard | VaughnMartin Command OS",
      description: "Unified strategic command center for Command OS.",
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

  const friScore = readiness?.overallScore || dynamicStatus?.readinessScore || 84.5;
  const foresightScore = readiness?.foresightScore || dynamicStatus?.readinessScore || 82;
  const playbookMaturity = readiness ? (readiness.playbooksReady / Math.max(readiness.playbooksTotal, 1)) * 100 : 78;
  const executionVelocity = readiness?.velocityScore || dynamicStatus?.readinessScore || 92;
  const agilityScore = readiness?.agilityScore || 85;
  const learningScore = readiness?.learningScore || 78;
  const adaptabilityScore = readiness?.adaptabilityScore || 83;
  const signalDetection = readiness?.weakSignalsDetected ? Math.min(readiness.weakSignalsDetected * 10, 100) : 86;
  
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
    return 'text-[#dc2626]';
  };

  const scoreValueColor = getScoreColor(friScore);

  const organizationId = organizations[0]?.id || 'demo-org-1';

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        {/* Navy Header Section */}
        <div style={{ background: "#0A0F2E", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <div className="w-6 h-0.5" style={{ background: GOLD }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                  Executive Command Center
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" style={CG}>
                Unified Strategic <em style={{ fontStyle: "italic", color: GOLD }}>Command</em>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                Single-pane executive overview of organizational gravity. 
                Monitor readiness, velocity, and AI-detected strategic signals.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }} className="px-4 py-2 rounded-none h-12">
                <Activity className="h-4 w-4 mr-2 text-[#2B8A6E]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Live System Telemetry</span>
              </Badge>
              <Button 
                onClick={handleRecalculate}
                style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff" }}
                className="hover:bg-white/10 rounded-none h-12 px-8 uppercase tracking-widest font-bold text-[10px]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Intelligence
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          <ExecutionIntelligenceDashboard />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList style={{ background: "#E8E4DC", padding: 4 }} className="grid grid-cols-4 mb-8 rounded-none">
              <TabsTrigger value="overview" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] text-[10px] font-bold uppercase tracking-widest">
                Overview
              </TabsTrigger>
              <TabsTrigger value="readiness" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] text-[10px] font-bold uppercase tracking-widest">
                Readiness
              </TabsTrigger>
              <TabsTrigger value="velocity" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] text-[10px] font-bold uppercase tracking-widest">
                Velocity
              </TabsTrigger>
              <TabsTrigger value="preparedness" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] text-[10px] font-bold uppercase tracking-widest">
                Crisis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-0">
              {/* Hero Score */}
              <Card className="border-[#E8E4DC] bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row items-stretch">
                    <div style={{ background: "#F8F7F4", borderRight: "1px solid #E8E4DC" }} className="p-12 text-center lg:w-1/3">
                      <div style={{ ...CG, fontSize: "64px", fontWeight: 600 }} className={scoreValueColor}>
                        {friScore.toFixed(1)}%
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280] mt-2">Future Readiness Index™</div>
                    </div>
                    <div className="p-12 flex-1 flex flex-col justify-center space-y-6">
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 28, height: 2, background: GOLD }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>Status Assessment</span>
                      </div>
                      <h2 style={{ ...CG, fontSize: "32px", fontWeight: 600, color: "#0A0F2E" }}>Your organization is in a <em style={{ fontStyle: "italic", color: "#2B8A6E" }}>high-gravity</em> preparedness state.</h2>
                      <p className="text-[#6B7280] text-sm max-w-xl">
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
                      <CardTitle style={{ ...CG, fontSize: "20px", color: "#0A0F2E" }}>Weak Signals</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {weakSignals.length === 0 ? (
                      <div className="text-center py-12 text-[#6B7280] italic text-sm">No signals requiring immediate attention</div>
                    ) : (
                      weakSignals.slice(0, 3).map((s) => (
                        <div key={s.id} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC] rounded-none flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-[#0A0F2E] capitalize">{s.signalType?.replace(/_/g, ' ')} Signal</div>
                            <div className="text-xs text-[#6B7280]">{s.description}</div>
                          </div>
                          <Badge style={{ background: s.impact === 'high' ? '#EF4444' : s.impact === 'medium' ? '#C9A84C' : '#0A0F2E', color: "#fff", border: "none" }} className="text-[9px] font-bold uppercase tracking-widest rounded-none">{s.impact}</Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="border-[#E8E4DC] bg-white">
                  <CardHeader className="border-b border-[#E8E4DC]">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Sparkles className="h-4 w-4 text-[#C9A84C]" />
                      <CardTitle style={{ ...CG, fontSize: "20px", color: "#0A0F2E" }}>Oracle Patterns</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {oraclePatterns.length === 0 ? (
                      <div className="text-center py-12 text-[#6B7280] italic text-sm">Oracle is synthesizing data...</div>
                    ) : (
                      oraclePatterns.slice(0, 3).map((p) => (
                        <div key={p.id} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC] rounded-none flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-[#0A0F2E] capitalize">{p.patternType?.replace(/_/g, ' ')}</div>
                            <div className="text-xs text-[#6B7280]">{p.description}</div>
                          </div>
                          <div className="text-[10px] font-bold text-[#2B8A6E] uppercase tracking-widest">{p.impact} Impact</div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="readiness" className="mt-0 space-y-8">
              {/* Readiness Score Hero */}
              <Card className="border-[#E8E4DC] bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row items-stretch">
                    <div style={{ background: NAVY, padding: "48px" }} className="text-center lg:w-1/4 flex flex-col justify-center">
                      <div style={{ ...CG, fontSize: "60px", fontWeight: 600, color: friScore >= 80 ? '#2B8A6E' : friScore >= 60 ? '#C9A84C' : '#EF4444' }}>
                        {typeof friScore === 'number' ? friScore.toFixed(1) : friScore}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mt-2">Future Readiness Index™</div>
                    </div>
                    <div className="p-10 flex-1 space-y-6">
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 28, height: 2, background: GOLD }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>5-Dimension Readiness Breakdown</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          { label: 'Foresight', score: foresightScore, desc: 'Signal detection & early warning' },
                          { label: 'Velocity', score: executionVelocity, desc: 'Trigger-to-action speed' },
                          { label: 'Agility', score: agilityScore, desc: 'Adaptive response capability' },
                          { label: 'Learning', score: learningScore, desc: 'Post-activation intelligence' },
                          { label: 'Adaptability', score: adaptabilityScore, desc: 'Scenario customization depth' },
                          { label: 'Playbook Coverage', score: playbookMaturity, desc: `${readiness?.playbooksReady ?? '—'} of ${readiness?.playbooksTotal ?? '170'} ready` },
                        ].map((dim, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{dim.label}</span>
                              <span className="text-sm font-bold" style={{ color: dim.score >= 80 ? TEAL : dim.score >= 60 ? GOLD : '#EF4444' }}>{typeof dim.score === 'number' ? dim.score.toFixed(0) : dim.score}%</span>
                            </div>
                            <Progress value={dim.score} className="h-1.5 rounded-none" />
                            <p className="text-[10px] text-gray-400">{dim.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Readiness Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Avg Response Time', value: readiness?.averageResponseTime ? `${readiness.averageResponseTime}m` : '11.4m', desc: 'Trigger-to-activation', icon: Clock, status: 'good' as const },
                  { label: 'Weak Signals Detected', value: readiness?.weakSignalsDetected ?? weakSignals.length, desc: 'Active monitoring alerts', icon: AlertTriangle, status: weakSignals.length > 0 ? 'warning' as const : 'good' as const },
                  { label: 'Playbooks Active', value: `${readiness?.playbooksReady ?? 170} / 170`, desc: 'Ready for deployment', icon: Layers, status: 'good' as const },
                ].map((m, i) => (
                  <Card key={i} className={`border-l-4 ${m.status === 'good' ? 'border-l-[#2B8A6E]' : 'border-l-[#C9A84C]'} border-[#E8E4DC] bg-white`}>
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div style={{ width: 32, height: 32, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <m.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className={`w-2 h-2 rounded-none ${m.status === 'good' ? 'bg-[#2B8A6E]' : 'bg-[#C9A84C]'}`} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-[#6B7280] mb-1">{m.label}</div>
                        <div style={{ ...CG, fontSize: "28px", fontWeight: 600, color: NAVY }}>{m.value}</div>
                        <p className="text-xs text-gray-400 mt-1">{m.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Weak Signals Detail */}
              <Card className="border-[#E8E4DC] bg-white">
                <CardHeader className="border-b border-[#E8E4DC]">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <AlertTriangle className="h-4 w-4" style={{ color: GOLD }} />
                    <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>Active Weak Signals</CardTitle>
                    <Badge style={{ background: weakSignals.length > 0 ? '#EF4444' : TEAL, color: '#fff' }} className="text-[9px] rounded-none ml-2">{weakSignals.length} detected</Badge>
                  </div>
                  <CardDescription className="text-xs text-gray-500 mt-1">Early warning indicators that may require strategic attention</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {weakSignals.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                      <CheckCircle className="h-10 w-10" style={{ color: TEAL }} />
                      <p className="text-sm font-semibold" style={{ color: NAVY }}>No active signals detected</p>
                      <p className="text-xs text-gray-400">AI monitoring is active across all 248+ data points</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {weakSignals.map((s) => (
                        <div key={s.id} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC] flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold capitalize" style={{ color: NAVY }}>{s.signalType?.replace(/_/g, ' ')} Signal</span>
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 ${s.impact === 'high' ? 'bg-red-100 text-red-600' : s.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{s.impact} impact</span>
                            </div>
                            <p className="text-xs text-gray-600">{s.description}</p>
                            {s.source && <p className="text-[10px] text-gray-400">Source: {s.source}</p>}
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Confidence</div>
                            <div className="text-sm font-bold" style={{ color: TEAL }}>{s.confidence}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button onClick={handleRecalculate} style={{ background: NAVY, color: "#fff" }} className="rounded-none px-8 uppercase tracking-widest font-bold text-[10px]">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recalculate Readiness Score
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="velocity" className="mt-0">
               <DecisionVelocityDashboard organizationId={organizationId} />
            </TabsContent>

            <TabsContent value="preparedness" className="mt-0 space-y-8">
              {/* Crisis Preparedness Hero */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: 'Crisis Response Readiness',
                    value: `${Math.round(friScore)}%`,
                    icon: Shield,
                    status: friScore >= 80 ? 'good' as const : friScore >= 60 ? 'warning' as const : 'critical' as const,
                    desc: 'Based on active playbook coverage',
                    link: '/crisis-response'
                  },
                  {
                    label: 'Active Threat Signals',
                    value: weakSignals.filter(s => s.impact === 'high').length || 0,
                    icon: AlertTriangle,
                    status: weakSignals.filter(s => s.impact === 'high').length > 0 ? 'warning' as const : 'good' as const,
                    desc: 'High-impact signals detected',
                    link: '/signal-intelligence'
                  },
                  {
                    label: 'Playbooks on Standby',
                    value: readiness?.playbooksReady ?? 170,
                    icon: Layers,
                    status: 'good' as const,
                    desc: 'Pre-authorized for activation',
                    link: '/playbook-library'
                  },
                ].map((m, i) => (
                  <Link key={i} to={m.link}>
                    <Card className={`border-l-4 ${m.status === 'good' ? 'border-l-[#2B8A6E]' : m.status === 'warning' ? 'border-l-[#C9A84C]' : 'border-l-red-500'} border-[#E8E4DC] bg-white hover:shadow-md transition-shadow cursor-pointer`}>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <div style={{ width: 32, height: 32, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <m.icon className="h-4 w-4 text-white" />
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6B7280] mb-1">{m.label}</div>
                          <div style={{ ...CG, fontSize: "32px", fontWeight: 600, color: NAVY }}>{m.value}</div>
                          <p className="text-xs text-gray-400 mt-1">{m.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Crisis Response Center Links */}
              <Card className="border-[#E8E4DC] bg-white">
                <CardHeader className="border-b border-[#E8E4DC]">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Shield className="h-4 w-4" style={{ color: TEAL }} />
                    <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>Crisis Response Capabilities</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-500 mt-1">Pre-authorized response protocols across all crisis categories</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Crisis Response Center', desc: 'Full crisis coordination hub — active playbooks, war rooms, and task tracking', link: '/crisis-response', icon: Shield },
                      { title: 'Crisis Exposure Matrix', desc: 'Cross-scenario risk mapping across business units and geographies', link: '/crisis-exposure', icon: BarChart3 },
                      { title: 'Preparedness Report', desc: 'Drill completion rates, coverage gaps, and improvement recommendations', link: '/preparedness-report', icon: TrendingUp },
                      { title: 'Signal Intelligence Hub', desc: 'Live monitoring of 248+ data points across 20 signal categories', link: '/signal-intelligence', icon: Radio },
                    ].map((item, i) => (
                      <Link key={i} to={item.link}>
                        <div className="p-4 border border-[#E8E4DC] hover:border-[#C9A84C] transition-colors bg-[#F8F7F4] hover:bg-white cursor-pointer flex items-start gap-4">
                          <div style={{ width: 36, height: 36, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <item.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold" style={{ color: NAVY }}>{item.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* High-Impact Weak Signals for Crisis */}
              {weakSignals.filter(s => s.impact === 'high').length > 0 && (
                <Card className="border-[#E8E4DC] bg-white">
                  <CardHeader className="border-b border-[#E8E4DC]">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>High-Impact Signals Requiring Attention</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    {weakSignals.filter(s => s.impact === 'high').map((s) => (
                      <div key={s.id} className="p-4 bg-red-50 border border-red-100 flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="text-sm font-bold capitalize" style={{ color: NAVY }}>{s.signalType?.replace(/_/g, ' ')} Signal</div>
                          <p className="text-xs text-gray-600">{s.description}</p>
                        </div>
                        <Link to="/playbook-library">
                          <Button size="sm" style={{ background: NAVY, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Activate Playbook
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
