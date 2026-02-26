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
    critical: 'bg-[#ef4444]'
  };
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[status]} animate-pulse`} />;
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
  const statusColors = {
    good: 'text-[#2B8A6E]',
    warning: 'text-[#C9A84C]',
    critical: 'text-[#ef4444]'
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <StatusDot status={status} />
      <div>
        <div style={{ ...CG, fontSize: "24px", fontWeight: 600 }} className={statusColors[status]}>{value}</div>
        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{label}</div>
        {trend && <div className="text-xs text-gray-400 hidden sm:block">{trend}</div>}
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
    navy: { border: BORDER, accent: NAVY },
    gold: { border: BORDER, accent: GOLD },
    teal: { border: BORDER, accent: TEAL }
  };

  const c = colorMap[color];

  return (
    <Link href={link}>
      <Card 
        className="transition-all cursor-pointer hover:shadow-lg h-full border-t-4 rounded-none"
        style={{ borderColor: c.accent, background: "#fff" }}
      >
        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div style={{ width: 40, height: 40, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>{phase}</div>
                <CardTitle style={{ ...CG, fontSize: "20px", fontWeight: 600, color: NAVY }}>{title}</CardTitle>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
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
      title: "Strategic Dashboard | ExecuteIQ",
      description: "Real-time visibility into strategic execution, AI-driven intelligence, and organizational readiness.",
    });
  }, []);

  const overallStatus: 'good' | 'warning' | 'critical' = 
    scoreValue >= 80 && triggerCount >= 10 ? 'good' :
    scoreValue >= 60 ? 'warning' : 'critical';

  return (
    <IDEALayout showBackButton={false}>
      <div style={{ background: "#F8F7F4", minHeight: "100vh" }}>
        {/* Header Section */}
        <div style={{ background: "#0A0F2E", padding: "48px 48px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)" }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                    Command Center
                  </span>
                </div>
                <h1 style={{ ...CG, color: "#fff", fontSize: "40px", fontWeight: 600, lineHeight: 1.1 }}>
                  Strategic <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Intelligence</em> Dashboard
                </h1>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 flex gap-8 items-center rounded-none">
                <KPICard 
                  label="Execution Score" 
                  value={`${scoreValue}%`} 
                  status={overallStatus} 
                  trend="+2.4% vs last week"
                />
                <div className="w-px h-10 bg-white/10" />
                <KPICard 
                  label="Active Signals" 
                  value={`${triggerCount}`} 
                  status="warning" 
                  trend="3 high priority"
                />
              </div>
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
                    <CardTitle style={{ ...CG, fontSize: "24px", color: NAVY }}>Intelligence Feed</CardTitle>
                    <Badge style={{ background: "rgba(10,15,46,0.05)", color: NAVY, border: "none" }} className="rounded-none">Live Updates</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[#E8E4DC]">
                    <div className="p-4 flex items-start gap-4 hover:bg-[#F8F7F4] transition-colors">
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, marginTop: 6 }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-[#0A0F2E]">Weak signal detected</span>
                          <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">2m ago</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Competitor pricing change detected across 3 regions.</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-start gap-4 hover:bg-[#F8F7F4] transition-colors">
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: NAVY, marginTop: 6 }} />
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
                  <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>Strategic Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/playbook-library">
                    <Button variant="outline" className="w-full justify-start h-auto py-4 border-[#E8E4DC] hover:border-[#0A0F2E] hover:bg-transparent rounded-none">
                      <div style={{ width: 32, height: 32, background: NAVY, borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
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

              <Card style={{ background: NAVY }} className="border-none text-white rounded-none shadow-sm">
                <CardContent className="pt-6">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 20, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>System Status</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">AI Intelligence Core</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2B8A6E]" />
                        <span className="text-[10px] font-bold text-[#2B8A6E] uppercase">Operational</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">Execution Engine</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2B8A6E]" />
                        <span className="text-[10px] font-bold text-[#2B8A6E] uppercase">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
