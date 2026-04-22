import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@/hooks/useAuth";
import PerspectiveSwitcher from "@/components/PerspectiveSwitcher";
import { ThreePositionStrip } from "@/components/ValueGainCallout";
import { useWebSocket } from "@/hooks/useWebSocket";
import { updatePageMetadata } from "@/lib/seo";
import IDEALayout from '@/components/layout/IDEALayout';
import ReadinessScore from '@/components/ReadinessScore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Target, 
  Radio, 
  Brain,
  ChevronRight,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  X,
  ArrowRight,
  Settings
} from 'lucide-react';
import { Link } from 'wouter';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { BrandStamp } from "@/components/BrandStamp";
import AICopilotPanel from '@/components/AICopilotPanel';
import ExecutionIntelligenceDashboard from '@/components/ExecutionIntelligenceDashboard';
import CompoundThreatAlerts from '@/components/intelligence/CompoundThreatAlerts';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function StatusDot({ status }: { status: 'good' | 'warning' | 'critical' }) {
  const colors = {
    good: 'bg-[#2B8A6E]',
    warning: 'bg-[#C9A84C]',
    critical: 'bg-[#dc2626]'
  };
  return <div className={`w-2.5 h-2.5 rounded-none ${colors[status]} animate-pulse`} />;
}

function KPICard({ 
  label, 
  value, 
  status, 
  trend 
}: { 
  label: string; 
  value: string; 
  status: 'good' | 'warning' | 'critical';
  trend?: string;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <StatusDot status={status} />
      <div>
        <div style={{ ...CG, fontSize: "24px", fontWeight: 600, color: status === 'good' ? TEAL : status === 'warning' ? GOLD : '#dc2626' }}>{value}</div>
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#6B7280]">{label}</div>
        {trend && <div className="text-xs text-[#6B7280] hidden sm:block">{trend}</div>}
      </div>
    </div>
  );
}


function PhaseCard({
  phase,
  title,
  description,
  icon: Icon,
  metrics,
  link,
  color
}: {
  phase: string;
  title: string;
  description: string;
  icon: any;
  metrics: { label: string; value: string; highlight?: boolean }[];
  link: string;
  color: 'navy' | 'gold' | 'teal';
}) {
  const colorMap = {
    navy: { border: BORDER, accent: "#0A0F2E" },
    gold: { border: BORDER, accent: "#C9A84C" },
    teal: { border: BORDER, accent: "#2B8A6E" }
  };

  const phaseColorMap = {
    'IDENTIFY': "#2B8A6E",
    'DETECT': "#0A0F2E",
    'EXECUTE': "#C9A84C",
    'ADVANCE': "#2B8A6E"
  };

  const accentColor = (phaseColorMap as any)[phase] || colorMap[color].accent;

  return (
    <Link href={link}>
      <Card 
        className="transition-all cursor-pointer h-full border-t-4 rounded-none"
        style={{ borderColor: accentColor, background: "#fff" }}
      >
        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div style={{ width: 40, height: 40, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 0 }}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: accentColor }}>{phase}</div>
                <CardTitle style={{ ...CG, fontSize: "20px", fontWeight: 600, color: "#0A0F2E" }}>{title}</CardTitle>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#E8E4DC]" />
          </div>
          <p className="text-sm text-[#4B5563] line-clamp-2">{description}</p>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2">
            {metrics.map((m, i) => (
              <div key={i} className="p-2 sm:p-3 rounded-none bg-[#F8F7F4] border border-[#E8E4DC]">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#6B7280]">{m.label}</div>
                <div style={{ ...CG, fontSize: "18px", fontWeight: 600, color: m.highlight ? GOLD : NAVY }}>{m.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

const ORIENTATION_STEPS = [
  { icon: Settings, label: "Configure signal monitoring", sub: "Set up your 221 armed triggers", href: "/signal-configuration", color: TEAL },
  { icon: Target, label: "Explore your playbook library", sub: "170 pre-staged templates across 9 domains", href: "/playbook-library", color: NAVY },
  { icon: Zap, label: "Run a live simulation", sub: "Experience the 12-minute execution cycle", href: "/command-center", color: GOLD },
  { icon: Brain, label: "Invite your stakeholders", sub: "Map your executive decision network", href: "/stakeholder-management", color: TEAL },
];

export default function Dashboard() {
  const { isConnected } = useWebSocket();
  const { activeScenarios, weakSignals } = useDynamicStrategy();
  const { user } = useAuth();
  const execRole = (user as any)?.executiveRole as string | undefined;
  const industry = (user as any)?.industryVertical as string | undefined;
  const userName = (user as any)?.firstName as string | undefined;

  const [orientationDismissed, setOrientationDismissed] = useState<boolean>(() => {
    try { return localStorage.getItem('vm_orientation_dismissed') === 'true'; } catch { return false; }
  });

  const dismissOrientation = () => {
    setOrientationDismissed(true);
    try { localStorage.setItem('vm_orientation_dismissed', 'true'); } catch {}
  };

  const { data: preparednessScore } = useQuery({
    queryKey: ['/api/preparedness-score'],
  });

  const { data: activeTriggers } = useQuery({
    queryKey: ['/api/triggers'],
  });

  const { data: recentActivations } = useQuery({
    queryKey: ['/api/playbook-activations/recent'],
  });

  const scoreValue = (preparednessScore as any)?.overall_score || 84;
  const triggerCount = Array.isArray(activeTriggers) ? activeTriggers.filter((t: any) => t.status === 'active').length : 12;

  useEffect(() => {
    updatePageMetadata({
      title: "Strategic Dashboard | VaughnMartin Readiness OS",
      description: "Real-time visibility into strategic execution, signal-detected intelligence, and organizational readiness.",
    });
  }, []);

  const overallStatus: 'good' | 'warning' | 'critical' = 
    scoreValue >= 80 && triggerCount >= 10 ? 'good' :
    scoreValue >= 60 ? 'warning' : 'critical';

  return (
    <IDEALayout showBackButton={false}>
      <div style={{ background: "#F8F7F4", minHeight: "100vh" }}>
        {/* Navy Header Section */}
        <div style={{ background: "#0A0F2E", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <div className="w-6 h-0.5" style={{ background: GOLD }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                  Command Center
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" style={CG}>
                Strategic <em style={{ fontStyle: "italic", color: GOLD }}>Intelligence</em>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                The response is ready before the trigger fires. 248+ signals. 170 playbooks. 12 minutes from detection to full organizational execution.
              </p>
              <div className="mt-5 flex justify-center md:justify-start">
                <PerspectiveSwitcher currentRole={execRole} currentIndustry={industry} />
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex flex-wrap gap-10 items-center justify-center rounded-none shadow-[0_0_40px_rgba(201,168,76,0.1)]">
              <KPICard 
                label="Execution Score" 
                value={`${scoreValue}%`} 
                status={overallStatus} 
                trend="+2.4% vs last week"
              />
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <KPICard 
                label="Active Signals" 
                value={`${triggerCount}`} 
                status="warning" 
                trend="3 high priority"
              />
            </div>
          </div>
        </div>

        {/* ── First Activation Banner — shown until dismissed ─────────────── */}
        {!orientationDismissed && (
          <div style={{ background: NAVY, borderBottom: "3px solid rgba(201,168,76,0.4)", position: "relative", overflow: "hidden" }}>
            {/* Subtle grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, display: "inline-block" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL, fontFamily: "'Barlow Condensed', sans-serif" }}>
                      READINESS OS · YOUR FIRST ACTIVATION
                    </span>
                  </div>
                  <h3 style={{ ...CG, fontSize: "clamp(20px,2.2vw,28px)", fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                    {userName ? `${userName}, your` : "Your"} platform is armed and ready.
                    {industry ? <span style={{ color: GOLD }}> Run your first {industry.split("&")[0].trim()} scenario.</span>
                    : <span style={{ color: GOLD }}> Run your first activation now.</span>}
                  </h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", maxWidth: 560, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                    {execRole ? `As ${execRole.split("—")[0].trim()}, you authorize — the system pre-stages.` : "The response is pre-staged. You authorize."}
                    {" "}Walk through a live critical supplier failure — see 12-minute execution from trigger to full deployment.
                  </p>
                </div>
                <button onClick={dismissOrientation} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 4, flexShrink: 0, marginTop: 2 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Primary CTA + secondary steps */}
              <div className="flex flex-col lg:flex-row gap-4 items-start">
                {/* Primary — full activation */}
                <Link href="/manufacturing-demo">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: GOLD, color: NAVY, padding: "14px 28px", cursor: "pointer", textDecoration: "none", flexShrink: 0 }}>
                    <Zap style={{ width: 16, height: 16 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" as const, fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Run Your First Activation
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.7, fontFamily: "'DM Sans', sans-serif" }}>
                        Critical Supplier Failure · 12-minute execution
                      </div>
                    </div>
                    <ArrowRight style={{ width: 14, height: 14, marginLeft: 4 }} />
                  </div>
                </Link>

                {/* Secondary steps */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Target, label: "Explore 170 Playbooks", href: "/playbook-library" },
                    { icon: Radio, label: "Live Signal Tower", href: "/command-tower" },
                    { icon: Brain, label: "Practice Drills", href: "/practice-drills" },
                  ].map(({ icon: Icon, label, href }) => (
                    <Link key={href} href={href}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)", padding: "10px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}>
                        <Icon style={{ width: 13, height: 13 }} />
                        {label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Challenge Strip — makes the value visceral ─────────────────── */}
        {triggerCount > 0 && (
          <div style={{ background: '#0A0F2E', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '20px 48px' }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 flex-wrap">
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(16px,2vw,22px)', fontWeight: 700, color: '#fff', lineHeight: 1.4, margin: 0 }}>
                The system has detected <span style={{ color: '#C9A84C' }}>{triggerCount} signals</span> today.{' '}
                <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
                  If any of them triggered a response in your organization right now — your brief is already built, your team is already assigned.
                </em>
              </p>
              <Link href="/command-tower">
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#C9A84C', whiteSpace: 'nowrap' as const, cursor: 'pointer' }}>
                  See Live Detections →
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* ── Strategic Position Strip — what this readiness level means ── */}
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-0.5" style={{ background: GOLD }} />
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>
              What Your Readiness Builds
            </span>
          </div>
          <ThreePositionStrip />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-8 h-0.5" style={{ background: GOLD }} />
                  <h2 style={{ ...CG, fontSize: "28px", color: NAVY }}>ADVANCE · Intelligence Accumulation</h2>
                </div>
                <ExecutionIntelligenceDashboard />
              </div>

              {/* Compound Threat Intelligence */}
              <div className="border border-[#E8E4DC] bg-white p-6">
                <CompoundThreatAlerts compact />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PhaseCard
                  phase="IDENTIFY"
                  title="Depth Chart"
                  description="170 templates across 9 strategic domains"
                  icon={Target}
                  color="teal"
                  link="/playbook-library"
                  metrics={[
                    { label: 'Prepared Response Templates', value: '170' },
                    { label: 'Coverage', value: '94%', highlight: true }
                  ]}
                />
                <PhaseCard
                  phase="DETECT"
                  title="Signal Configuration"
                  description="20 categories · 248+ data points · live triggers"
                  icon={Radio}
                  color="navy"
                  link="/signal-configuration"
                  metrics={[
                    { label: 'Signal Categories', value: '20', highlight: true },
                    { label: 'Weak Signals', value: `${weakSignals.length} detected` }
                  ]}
                />
                <PhaseCard
                  phase="EXECUTE"
                  title="Execute Response"
                  description="12-minute coordinated response"
                  icon={Zap}
                  color="gold"
                  link="/command-center"
                  metrics={[
                    { label: 'Active Scenarios', value: `${activeScenarios.length}` },
                    { label: 'Avg Execution', value: '11m 47s', highlight: true }
                  ]}
                />
                <PhaseCard
                  phase="ADVANCE"
                  title="Review Film"
                  description="Continuous analysis and refinement"
                  icon={Brain}
                  color="teal"
                  link="/institutional-memory"
                  metrics={[
                    { label: 'Patterns Found', value: '18' },
                    { label: 'Improvements', value: '+34%', highlight: true }
                  ]}
                />
              </div>

              <Card className="border-[#E8E4DC] bg-white rounded-none">
                <CardHeader className="border-b border-[#E8E4DC]">
                  <div className="flex items-center justify-between">
                    <CardTitle style={{ ...CG, fontSize: "24px", color: "#0A0F2E" }}>Recent Activations</CardTitle>
                    <Badge style={{ background: "rgba(10,15,46,0.05)", color: "#0A0F2E", border: "none" }} className="rounded-none">Live Updates</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {(!recentActivations || (recentActivations as any[]).length === 0) ? (
                    <div className="py-12 px-6 text-center">
                      <div style={{ width: 48, height: 48, background: "rgba(10,15,46,0.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <Zap className="h-6 w-6" style={{ color: GOLD }} />
                      </div>
                      <h3 className="font-semibold text-sm mb-1" style={{ color: NAVY }}>No activations yet</h3>
                      <p className="text-xs mb-5" style={{ color: "#6B7280" }}>Activate a prepared response to begin tracking execution history and performance data.</p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Link href="/playbook-library">
                          <Button size="sm" className="rounded-none text-xs font-bold uppercase tracking-wider" style={{ background: NAVY, color: "#fff" }}>
                            <Target className="h-3.5 w-3.5 mr-2" />
                            Browse Prepared responses
                          </Button>
                        </Link>
                        <Link href="/command-center">
                          <Button size="sm" variant="outline" className="rounded-none text-xs font-bold uppercase tracking-wider border-[#E8E4DC] hover:border-[#0A0F2E]">
                            <Zap className="h-3.5 w-3.5 mr-2" />
                            Go to Command Center
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="divide-y divide-[#E8E4DC]">
                        {(recentActivations as any[]).slice(0, 3).map((activation: any, i: number) => (
                          <Link key={activation.id || i} href={`/live-activation-center`}>
                            <div className="p-4 flex items-start gap-4 hover:bg-[#F8F7F4] transition-colors cursor-pointer group">
                              <div className="w-2 h-2 rounded-none mt-1.5 flex-shrink-0" style={{ background: activation.status === 'completed' ? TEAL : activation.status === 'active' ? GOLD : "#9CA3AF" }} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-semibold group-hover:text-[#2B8A6E] transition-colors" style={{ color: NAVY }}>{activation.playbookName || activation.name || "Prepared Response Activation"}</span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                                    {activation.createdAt ? new Date(activation.createdAt).toLocaleDateString() : "Recent"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs" style={{ color: "#6B7280" }}>{activation.playbookDomain || activation.domain || "Strategic"}</span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5" style={{ background: activation.status === 'completed' ? "rgba(43,138,110,0.1)" : "rgba(201,168,76,0.1)", color: activation.status === 'completed' ? TEAL : GOLD }}>{activation.status || "active"}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      {(recentActivations as any[]).length > 3 && (
                        <div className="border-t border-[#E8E4DC] px-4 py-3">
                          <Link href="/execution-history">
                            <button className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all" style={{ color: NAVY }}>
                              View all {(recentActivations as any[]).length} activations
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
                <div className="border-t border-[#E8E4DC] px-4 py-3 flex justify-end">
                  <Link href="/execution-history">
                    <button className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all" style={{ color: "#6B7280" }}>
                      Full execution history
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <ReadinessScore />

              <Card className="border-[#E8E4DC] bg-white rounded-none">
                <CardHeader>
                  <CardTitle style={{ ...CG, fontSize: "20px", color: "#0A0F2E" }}>Strategic Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/playbook-library">
                    <Button variant="outline" className="w-full justify-start h-auto py-4 border-[#E8E4DC] hover:border-[#0A0F2E] hover:bg-transparent rounded-none">
                      <div style={{ width: 32, height: 32, background: "#0A0F2E", borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs uppercase tracking-wider text-[#0A0F2E]">Browse Prepared responses</div>
                        <div className="text-[10px] text-[#6B7280]">170 strategic templates</div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/triggers-management">
                    <Button variant="outline" className="w-full justify-start h-auto py-4 border-[#E8E4DC] hover:border-[#0A0F2E] hover:bg-transparent rounded-none">
                      <div style={{ width: 32, height: 32, background: GOLD, borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                        <Radio className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs uppercase tracking-wider text-[#0A0F2E]">Configure Triggers</div>
                        <div className="text-[10px] text-[#6B7280]">Set up signal monitoring</div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/preparedness-report">
                    <Button variant="outline" className="w-full justify-start h-auto py-4 border-[#E8E4DC] hover:border-[#0A0F2E] hover:bg-transparent rounded-none">
                      <div style={{ width: 32, height: 32, background: TEAL, borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs uppercase tracking-wider text-[#0A0F2E]">Readiness Audit</div>
                        <div className="text-[10px] text-[#6B7280]">Full platform analysis</div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/regulatory-calendar">
                    <Button variant="outline" className="w-full justify-start h-auto py-4 border-[#E8E4DC] hover:border-[#0A0F2E] hover:bg-transparent rounded-none">
                      <div style={{ width: 32, height: 32, borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12, background: "#DC2626" }}>
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs uppercase tracking-wider text-[#0A0F2E]">Regulatory Calendar</div>
                        <div className="text-[10px] text-[#6B7280]">Upcoming compliance deadlines</div>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card style={{ background: "#0A0F2E" }} className="border-none text-white rounded-none">
                <CardContent className="pt-6">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 20, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>System Status</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">Intelligence Core</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-none bg-[#2B8A6E]" />
                        <span className="text-[10px] font-bold text-[#2B8A6E] uppercase">Operational</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">Execution Engine</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-none bg-[#2B8A6E]" />
                        <span className="text-[10px] font-bold text-[#2B8A6E] uppercase">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div style={{ marginTop: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 2, background: "#C9A84C" }} />
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0F2E", fontFamily: "serif" }}>Executive Copilot</h2>
                </div>
                <AICopilotPanel />
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#E8E4DC]">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
              Data refreshes automatically • Last updated {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </IDEALayout>
  );
}
