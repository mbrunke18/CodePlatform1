import PageLayout from "@/components/layout/PageLayout";
import DecisionVelocityDashboard from "@/components/DecisionVelocityDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Target, Award } from "lucide-react";

export default function DecisionVelocityPage() {
  const organizationId = "demo-org-1";

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  return (
    <PageLayout>
      <div className="space-y-12 bg-[#F8F7F4]">
        {/* Navy Hero Header */}
        <div style={{ background: NAVY, padding: "64px 48px", margin: "-32px -32px 32px -32px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "radial-gradient(#C9A84C 0.5px, transparent 0.5px)", 
            backgroundSize: "24px 24px",
            opacity: 0.1
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: GOLD }}>Performance Analytics</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h1 style={{ ...CG, color: "#fff", fontSize: "clamp(32px,4vw,56px)", fontWeight: 600, lineHeight: 1.1, marginBottom: 16 }}>
                  Decision Velocity <em style={{ fontStyle: "italic", color: "#DFC178" }}>Dashboard</em>
                </h1>
                <p className="text-white/60 text-lg max-w-2xl">
                  Measure your competitive advantage through execution speed—the #1 metric for elite strategic practitioners.
                </p>
              </div>
              <Badge className="bg-[#DFC178] text-[#0A0F2E] rounded-none border-none px-4 py-2 font-bold tracking-widest text-[10px] uppercase">
                Dynamic Strategy Metric
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-12 space-y-12 pb-20">
          {/* Readiness Infrastructure Foundation */}
          <Card className="bg-[#0A0F2E] border-none rounded-none overflow-hidden relative">
            <div style={{ 
              position: "absolute", 
              right: "-5%", 
              bottom: "-10%", 
              width: "40%", 
              height: "120%", 
              background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
              filter: "blur(40px)"
            }} />
            <CardHeader className="p-10 pb-4 relative z-10">
              <CardTitle style={CG} className="text-3xl text-white flex items-center gap-4 mb-2">
                <Target className="h-8 w-8 text-[#C9A84C]" />
                The Foundation: Readiness Infrastructure
              </CardTitle>
              <CardDescription className="text-[#DFC178] text-lg font-medium italic">
                Built on what 15 major firms say enterprises are missing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-4 relative z-10 space-y-8">
              <p className="text-white/80 text-lg leading-relaxed max-w-4xl">
                Readiness OS provides the <strong className="text-white font-black">execution infrastructure</strong> that McKinsey, IBM, Bain, and BCG all say is missing—governance, decision rights, and coordination systems built <em className="italic">before</em> the moment hits.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 p-8 rounded-none">
                <div className="text-[10px] font-bold text-[#C9A84C] tracking-[0.2em] uppercase mb-4">Pre-Defined Governance</div>
                <div className="space-y-3 text-sm text-white/60">
                  <div className="flex justify-between border-b border-white/5 pb-2"><strong>170 Prepared responses</strong> <span>9 Domains</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><strong>Roles Mapped</strong> <span>Pre-Incident</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><strong>Accountability</strong> <span>Clear Chain</span></div>
                  <div className="text-[#2B8A6E] font-bold mt-4 pt-2">✓ "Embedded Governance"</div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-none">
                <div className="text-[10px] font-bold text-[#2B8A6E] tracking-[0.2em] uppercase mb-4">Clear Decision Rights</div>
                <div className="space-y-3 text-sm text-white/60">
                  <div className="flex justify-between border-b border-white/5 pb-2"><strong>Pre-Assigned</strong> <span>Known Roles</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><strong>Zero Ambiguity</strong> <span>Defined Authority</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><strong>Instant Action</strong> <span>No Meetings</span></div>
                  <div className="text-[#2B8A6E] font-bold mt-4 pt-2">✓ "Management Redefined"</div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-none">
                <div className="text-[10px] font-bold text-[#DFC178] tracking-[0.2em] uppercase mb-4">12-Minute Coordination</div>
                <div className="space-y-3 text-sm text-white/60">
                  <div className="flex justify-between border-b border-white/5 pb-2"><strong>Trigger Detection</strong> <span>AI Signaling</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><strong>Notifications</strong> <span>Instant Alert</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><strong>Tasking</strong> <span>Automated Flow</span></div>
                  <div className="text-[#2B8A6E] font-bold mt-4 pt-2">✓ "New Operating Model"</div>
                </div>
              </div>
              </div>

              <div className="bg-white p-8 rounded-none border-l-4 border-[#C9A84C]">
                <div className="text-[10px] font-bold text-[#0A0F2E] tracking-[0.2em] uppercase mb-2">The Strategic MOAT</div>
                <p className="text-[#6B7280] leading-relaxed">
                  Companies like Microsoft and Amazon built execution infrastructure over 5+ years. 
                  Readiness OS gives you that infrastructure on <strong className="text-[#0A0F2E]">day one</strong>—170 playbooks, pre-defined governance, and a compressed 12-minute execution cycle.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What is Decision Velocity */}
          <Card className="rounded-none border-[#E8E4DC] bg-white overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="p-10 md:w-2/3 border-r border-[#F8F7F4]">
                <CardHeader className="px-0 pt-0 mb-6">
                  <CardTitle style={CG} className="text-3xl text-[#0A0F2E] flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-[#2B8A6E]" />
                    What is Decision Velocity?
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                    The competitive advantage metric Fortune 1000 leaders track
                  </CardDescription>
                </CardHeader>
                  <p className="text-[#0A0F2E] text-lg leading-relaxed">
                    <strong>Decision Velocity</strong> measures how fast your organization moves from <em className="italic">strategic signal</em> to <em className="italic">execution completion</em>. 
                    While competitors coordinate through email chains and emergency meetings, Readiness OS practitioners execute in minutes.
                  </p>
                  <p className="text-[#6B7280] leading-relaxed">
                    After 10 strategic events, an Readiness OS-powered organization is <strong className="text-[#0A0F2E]">50 days ahead</strong> of the competition—the difference between a category leader and a market follower.
                  </p>
              </div>
              <div className="p-10 md:w-1/3 bg-[#F8F7F4] flex flex-col justify-center">
                <div className="text-[10px] font-bold text-[#6B7280] tracking-[0.2em] uppercase mb-4">The Velocity Formula</div>
                <div className="space-y-6">
                  <div>
                    <div style={CG} className="text-4xl font-bold text-[#0A0F2E]">12m</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#2B8A6E]">Readiness OS Velocity</div>
                  </div>
                  <div className="w-full h-px bg-[#E8E4DC]" />
                  <div>
                    <div style={CG} className="text-4xl font-bold text-[#6B7280]">72h</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280]">Competitor Avg</div>
                  </div>
                  <div className="pt-4">
                    <div className="text-[11px] font-bold text-[#2B8A6E] bg-[#2B8A6E]/10 p-3 rounded-none text-center">
                      5-DAY ADVANTAGE PER MOVE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Dashboard Component */}
          <div className="p-8 bg-white border border-[#E8E4DC] rounded-none">
             <DecisionVelocityDashboard organizationId={organizationId} />
          </div>

          {/* Improvement Principles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Perpetual Foresight', color: '#2B8A6E', desc: 'continuous signal monitoring detects signals early. Early detection equals faster response.' },
              { title: 'Aligned Agility', color: '#0A0F2E', desc: 'Pre-configured prepared responses eliminate coordination time. One-click activation.' },
              { title: 'Ecosystem Connectors', color: '#C9A84C', desc: 'Integrated systems eliminate manual handoffs and communication gaps.' },
              { title: 'Institutional Memory', color: '#DFC178', desc: 'AI learns from every move. Each execution improves velocity for the next event.' }
            ].map((p, i) => (
              <Card key={i} className="rounded-none border-[#E8E4DC] p-6 bg-white hover:border-[#C9A84C] transition-colors">
                <div style={{ color: p.color }} className="font-bold text-[10px] tracking-widest uppercase mb-4">0{i+1}. {p.title}</div>
                <p className="text-sm text-[#6B7280] leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>

          {/* Real Examples */}
          <Card className="rounded-none border-[#E8E4DC] bg-white p-10">
            <CardHeader className="px-0 pt-0 mb-8">
              <CardTitle style={CG} className="text-3xl font-bold text-[#0A0F2E] flex items-center gap-4">
                <Award className="h-8 w-8 text-[#C9A84C]" />
                Real-World Velocity <em className="italic">Benchmarks</em>
              </CardTitle>
            </CardHeader>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="h-1 w-12 bg-[#0A0F2E]" />
                <h4 className="font-bold text-[#0A0F2E] text-xl">Microsoft</h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Transformed from 5-year planning cycles to continuous iteration. Decision velocity enabled market cap growth from $300B to $3T.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-1 w-12 bg-[#2B8A6E]" />
                <h4 className="font-bold text-[#0A0F2E] text-xl">DBS Bank</h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Built a "data nervous system" to improve decision velocity. Result: executing 5x faster than traditional competitors.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-1 w-12 bg-[#C9A84C]" />
                <h4 className="font-bold text-[#0A0F2E] text-xl">Amazon</h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  "Always Day One" culture equals continuous velocity. Speed of execution created category leadership across three distinct industries.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
