import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { useWebSocket } from "@/hooks/useWebSocket";
import { updatePageMetadata } from "@/lib/seo";
import IDEALayout from '@/components/layout/IDEALayout';
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
  TrendingUp
} from 'lucide-react';
import { Link } from 'wouter';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { BrandStamp } from "@/components/BrandStamp";
import AICopilotPanel from '@/components/AICopilotPanel';

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
        className="transition-all cursor-pointer hover:shadow-lg h-full border-t-4 rounded-none"
        style={{ borderColor: accentColor, background: "#fff" }}
      >
        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div style={{ width: 40, height: 40, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 0 }}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: accentColor }}>{phase}</div>
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

export default function Dashboard() {
  const { isConnected } = useWebSocket();
  const { activeScenarios, weakSignals } = useDynamicStrategy();

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
      title: "Strategic Dashboard | VaughnMartin Execution OS",
      description: "Real-time visibility into strategic execution, AI-driven intelligence, and organizational readiness.",
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
                Real-time visibility into strategic execution, AI-driven intelligence, and organizational readiness.
              </p>
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

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PhaseCard
                  phase="IDENTIFY"
                  title="Depth Chart"
                  description="170 templates across 9 strategic domains"
                  icon={Target}
                  color="teal"
                  link="/playbook-library"
                  metrics={[
                    { label: 'Playbook Templates', value: '170' },
                    { label: 'Coverage', value: '94%', highlight: true }
                  ]}
                />
                <PhaseCard
                  phase="DETECT"
                  title="Monitor Signals"
                  description="Real-time signal detection and alerts"
                  icon={Radio}
                  color="navy"
                  link="/signal-intelligence"
                  metrics={[
                    { label: 'AI Modules', value: '5 Active', highlight: true },
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
                  description="AI-powered analysis and refinement"
                  icon={Brain}
                  color="teal"
                  link="/institutional-memory"
                  metrics={[
                    { label: 'Patterns Found', value: '18' },
                    { label: 'Improvements', value: '+34%', highlight: true }
                  ]}
                />
              </div>

              <Card className="border-[#E8E4DC] bg-white rounded-none shadow-sm">
                <CardHeader className="border-b border-[#E8E4DC]">
                  <div className="flex items-center justify-between">
                    <CardTitle style={{ ...CG, fontSize: "24px", color: "#0A0F2E" }}>Intelligence Feed</CardTitle>
                    <Badge style={{ background: "rgba(10,15,46,0.05)", color: "#0A0F2E", border: "none" }} className="rounded-none">Live Updates</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
          <div className="divide-y divide-[#E8E4DC]">
                    <div className="p-4 flex items-start gap-4 hover:bg-[#F8F7F4] transition-colors">
                      <div className="w-2 h-2 rounded-none bg-[#2B8A6E] mt-1.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-[#0A0F2E]">Weak signal detected</span>
                          <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">2m ago</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Competitor pricing change detected across 3 regions.</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-start gap-4 hover:bg-[#F8F7F4] transition-colors">
                      <div className="w-2 h-2 rounded-none bg-[#0A0F2E] mt-1.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-[#0A0F2E]">Playbook activated</span>
                          <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">15m ago</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">M&A Integration playbook activated for Project Phoenix.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="border-[#E8E4DC] bg-white rounded-none shadow-sm">
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
                        <div className="font-bold text-xs uppercase tracking-wider text-[#0A0F2E]">Browse Playbooks</div>
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
                        <div className="text-[10px] text-[#6B7280]">Set up AI monitoring</div>
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
                </CardContent>
              </Card>

              <Card style={{ background: "#0A0F2E" }} className="border-none text-white rounded-none shadow-sm">
                <CardContent className="pt-6">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 20, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>System Status</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">AI Intelligence Core</span>
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
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0F2E", fontFamily: "serif" }}>AI Executive Copilot</h2>
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
