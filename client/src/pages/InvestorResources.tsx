import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign, 
  Zap, 
  Target, 
  BookOpen, 
  Radio,
  ArrowRight,
  Download,
  CheckCircle2,
  BarChart3,
  Shield,
  Lightbulb,
  AlertTriangle,
  Server,
  Database,
  Layers,
  XCircle
} from "lucide-react";
import { Link } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { BrandStamp } from "@/components/BrandStamp";
import InvestorGate from "@/components/InvestorGate";

export default function InvestorResources() {
  useEffect(() => {
    updatePageMetadata({
      title: "Investor Resources | Execution OS Strategic Execution OS",
      description: "Investment overview for Execution OS, the first Strategic Execution Operating System. Creating a new $5B+ software category for Fortune 1000 strategic execution.",
      ogTitle: "Invest in Execution OS - Category-Defining Opportunity",
      ogDescription: "Transform 72-hour strategic coordination into 12-minute execution. First-mover in Strategic Execution Operating System (SEOS) category.",
    });
  }, []);

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  return (
    <InvestorGate pageName="/investor-resources">
    <div className="min-h-screen bg-[#F8F7F4] text-[#0A0F2E]">
      <StandardNav />

      {/* Hero Section */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${GOLD} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-[1px] w-7 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.2em]">Investor Overview</span>
            <div className="h-[1px] w-7 bg-[#C9A84C]" />
          </div>
          <BrandStamp variant="dual" size="md" className="mb-8" />
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white" style={CG} data-testid="heading-investor">
            We're Creating a New Category
          </h1>
          
          <p className="text-xl md:text-2xl text-[#DFC178] mb-4 max-w-3xl mx-auto font-medium">
            Strategic Execution Operating System (SEOS)
          </p>
          
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            What Salesforce did for customer relationships, Execution OS does for strategic execution.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/investor-presentation">
              <Button size="lg" className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">
                View Presentation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo-selector">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-[#0A0F2E] bg-transparent">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Investment Thesis */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A0F2E] mb-4" style={CG}>The Investment Thesis</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* The Problem */}
            <Card className="border-[#E8E4DC] bg-white shadow-xl hover:shadow-2xl transition-all">
              <CardHeader className="border-b border-[#E8E4DC] pb-6">
                <CardTitle className="flex items-center gap-3 text-[#0A0F2E]" style={CG}>
                  <div className="p-2 bg-[#0A0F2E]/5 rounded-lg">
                    <Clock className="h-6 w-6 text-[#0A0F2E]" />
                  </div>
                  The Problem: 72-Hour Gap
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-[#0A0F2E] font-medium leading-relaxed">
                  When significant strategic events occur, most organizations experience a chaotic "fumble" period:
                </p>
                <div className="space-y-4">
                  {[
                    { time: '0-4 hrs', label: 'Discovery and initial confusion' },
                    { time: '4-12 hrs', label: 'Ad-hoc calls to identify who should be involved' },
                    { time: '12-24 hrs', label: 'Scramble to find relevant documents and data' },
                    { time: '24-48 hrs', label: 'Debate about authority, budget, and approach' },
                    { time: '48-72 hrs', label: 'Finally begin coordinated response' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-20 shrink-0 text-[10px] font-bold text-[#0A0F2E] uppercase tracking-widest bg-[#0A0F2E]/5 py-1 px-2 rounded text-center border border-[#0A0F2E]/10">
                        {item.time}
                      </div>
                      <div className="text-sm text-[#6B7280] font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-[#E8E4DC] mt-6 text-center">
                  <Badge className="bg-[#0A0F2E] text-white font-bold text-[10px] uppercase tracking-widest py-1 px-3">
                    Every Fortune 500 operates this way today.
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* The Solution */}
            <Card className="border-[#C9A84C]/30 bg-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <CardHeader className="border-b border-[#E8E4DC] pb-6">
                <CardTitle className="flex items-center gap-3 text-[#2B8A6E]" style={CG}>
                  <div className="p-2 bg-[#2B8A6E]/10 rounded-lg">
                    <Zap className="h-6 w-6 text-[#2B8A6E]" />
                  </div>
                  Solution: 12-Minute Activation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-[#0A0F2E] font-medium leading-relaxed">
                  Execution OS fundamentally changes the operating model:
                </p>
                <div className="space-y-4">
                  {[
                    { text: 'Signal detected', sub: 'Pre-configured monitoring triggers alert' },
                    { text: 'Playbook activates', sub: 'Pre-staged, pre-assigned, pre-approved' },
                    { text: 'Tasks deploy', sub: 'Auto-created in Jira/ServiceNow/Asana' },
                    { text: 'Teams execute', sub: 'Clear ownership, no ambiguity' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 p-0.5 bg-[#2B8A6E]/10 rounded-full">
                        <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] shrink-0" />
                      </div>
                      <div>
                        <div className="text-sm text-[#0A0F2E] font-bold">{item.text}</div>
                        <div className="text-[11px] text-[#6B7280] font-medium leading-tight">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-[#E8E4DC] mt-6">
                  <div className="bg-[#C9A84C] text-[#0A0F2E] p-4 rounded-lg text-center shadow-lg">
                    <p className="text-4xl font-bold" style={CG}>12 minutes</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Coordinated response underway</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20 px-6 bg-[#F8F7F4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A0F2E] mb-4" style={CG}>Platform Metrics</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { val: "170", label: "Strategic Playbooks", sub: "Across 9 domains" },
              { val: "248+", label: "Data Points Monitored", sub: "Real-time signals" },
              { val: "12 min", label: "Response Time", sub: "vs 72 hrs industry avg" },
              { val: "24/7", label: "AI Intelligence", sub: "Continuous monitoring" },
            ].map((m, i) => (
              <Card key={i} className="text-center border-[#E8E4DC] bg-white">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-[#C9A84C] mb-2" style={CG}>{m.val}</div>
                  <div className="text-sm font-bold text-[#0A0F2E]">{m.label}</div>
                  <div className="text-xs text-[#6B7280] mt-1">{m.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* The 4-Phase Lifecycle */}
          <Card className="mb-12 border-[#E8E4DC] bg-white">
            <CardHeader>
              <CardTitle className="text-[#0A0F2E]" style={CG}>The Execution OS Framework: 4-Phase Lifecycle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[#2B8A6E]/5 border border-[#2B8A6E]/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-[#2B8A6E]" />
                    <span className="font-bold text-[#2B8A6E] text-xs uppercase tracking-widest">IDENTIFY</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Stakeholders assigned, documents staged, budgets pre-approved, authorities delegated
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#0A0F2E]/5 border border-[#0A0F2E]/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Radio className="h-5 w-5 text-[#0A0F2E]" />
                    <span className="font-bold text-[#0A0F2E] text-xs uppercase tracking-widest">DETECT</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    248+ signals tracked, triggers configured, alerts routed
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#C9A84C]/5 border border-[#C9A84C]/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-[#C9A84C]" />
                    <span className="font-bold text-[#C9A84C] text-xs uppercase tracking-widest">EXECUTE</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    One-click activation, auto-project creation, coordinated tasks
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#2B8A6E]/5 border border-[#2B8A6E]/10">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-[#2B8A6E]" />
                    <span className="font-bold text-[#2B8A6E] text-xs uppercase tracking-widest">ADVANCE</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Structured debriefs, metrics captured, playbooks improved
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Value Per Event */}
      <section className="py-20 px-6 bg-white border-y border-[#E8E4DC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A0F2E] mb-4" style={CG}>ROI Per Strategic Event</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Execution OS pays for itself on the first significant event
            </p>
          </div>

          <Card className="mb-8 border-[#E8E4DC] bg-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="p-4 border-r border-[#E8E4DC]">
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-1" style={CG}>$10K-25K</div>
                  <div className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Planning Elimination</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-1 uppercase">20-50 hrs × $500/hr</div>
                </div>
                <div className="p-4 border-r border-[#E8E4DC]">
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-1" style={CG}>$500K-2M</div>
                  <div className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Revenue Protected</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-1 uppercase">Faster execution</div>
                </div>
                <div className="p-4 border-r border-[#E8E4DC]">
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-1" style={CG}>$50K+</div>
                  <div className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Executive Time</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-1 uppercase">50+ hrs × $1K/hr</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-1" style={CG}>$50-100K</div>
                  <div className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Tool Consolidation</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-1 uppercase">Annual savings</div>
                </div>
              </div>
              <div className="mt-8 p-6 bg-[#0A0F2E] rounded-lg text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(${GOLD} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                <div className="relative z-10">
                  <div className="text-3xl font-bold text-[#C9A84C] mb-2" style={CG}>$60K - $2M+</div>
                  <p className="text-sm font-bold text-white uppercase tracking-[0.2em]">Total value per major event</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Competitive Differentiation */}
      <section className="py-20 px-6 bg-[#F8F7F4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A0F2E] mb-4" style={CG}>Competitive Differentiation</h2>
            <p className="text-[#6B7280]">
              Execution OS owns the category between strategic preparation and operational execution
            </p>
          </div>

          <Card className="border-[#E8E4DC] bg-white overflow-hidden shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8E4DC] bg-[#0A0F2E]/5">
                      <th className="text-left py-4 px-6 font-bold text-[#0A0F2E]">Capability</th>
                      <th className="text-center py-4 px-4 font-bold text-[#6B7280]">Crisis Tools</th>
                      <th className="text-center py-4 px-4 font-bold text-[#6B7280]">PM Tools</th>
                      <th className="text-center py-4 px-4 font-bold text-[#C9A84C] bg-[#0A0F2E]/5">Execution OS</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#6B7280]">
                    {[
                      { cap: "Alert/notify stakeholders", crisis: true, pm: false, vm: true },
                      { cap: "Pre-built response playbooks", crisis: false, pm: false, vm: true },
                      { cap: "Auto-create project structure", crisis: false, pm: false, vm: true },
                      { cap: "Assign tasks with acceptance criteria", crisis: false, pm: "Manual", vm: "Auto" },
                      { cap: "Stage documents and templates", crisis: false, pm: false, vm: true },
                      { cap: "Unlock pre-approved budgets", crisis: false, pm: false, vm: true },
                      { cap: "Sync to existing PM tools", crisis: false, pm: "N/A", vm: true },
                      { cap: "Institutional learning loop", crisis: false, pm: false, vm: true },
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-[#E8E4DC] hover:bg-[#F8F7F4]/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-[#0A0F2E]">{r.cap}</td>
                        <td className="py-4 px-4 text-center">
                          {typeof r.crisis === 'boolean' ? (r.crisis ? <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mx-auto" /> : <span className="text-[#0A0F2E]/20">—</span>) : r.crisis}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {typeof r.pm === 'boolean' ? (r.pm ? <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mx-auto" /> : <span className="text-[#0A0F2E]/20">—</span>) : r.pm}
                        </td>
                        <td className="py-4 px-4 text-center bg-[#C9A84C]/5">
                          {typeof r.vm === 'boolean' ? (r.vm ? <CheckCircle2 className="h-4 w-4 text-[#C9A84C] mx-auto" /> : <span className="text-[#0A0F2E]/20">—</span>) : <span className="font-bold text-[#C9A84C]">{r.vm}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="border-[#C9A84C]/30 bg-[#F8F7F4]/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-[#0A0F2E] flex items-center justify-center text-[#C9A84C] text-3xl font-bold shrink-0 border-2 border-[#C9A84C]">
                  MB
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-[#C9A84C]" />
                    <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">Founder-Market Fit</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A0F2E] mb-2" style={CG}>Martin Brunke</h3>
                  <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
                    5 years collegiate football coaching + 20+ years Fortune 500 strategic execution 
                    (Ford, Toyota, Lockheed Martin, Boyd Gaming, Churchill Downs, Charles Schwab)
                  </p>
                  <p className="text-[#0A0F2E] italic font-medium">
                    "Business has no operating system for coordinated response. We're building it."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tech Architecture & Roadmap */}
      <section className="py-20 px-6 bg-[#F8F7F4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[1px] w-7 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.2em]">Technical Due Diligence</span>
              <div className="h-[1px] w-7 bg-[#C9A84C]" />
            </div>
            <h2 className="text-3xl font-bold text-[#0A0F2E] mb-4" style={CG}>Engineering Foundation & Roadmap</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              A transparent accounting of what is production-grade, what is a known workaround, and what is an active gap — with a sequenced plan to close each one.
            </p>
          </div>

          {/* Tech Stack */}
          <Card className="border-[#E8E4DC] bg-white shadow-sm mb-8">
            <CardHeader className="border-b border-[#E8E4DC]">
              <CardTitle className="text-[#0A0F2E] flex items-center gap-2" style={CG}>
                <Server className="h-5 w-5 text-[#2B8A6E]" />
                Current Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8E4DC] bg-[#0A0F2E]/3">
                      <th className="text-left py-3 px-6 font-bold text-[#0A0F2E] text-xs uppercase tracking-widest">Layer</th>
                      <th className="text-left py-3 px-4 font-bold text-[#0A0F2E] text-xs uppercase tracking-widest">Technology</th>
                      <th className="text-left py-3 px-4 font-bold text-[#0A0F2E] text-xs uppercase tracking-widest">Role</th>
                      <th className="text-center py-3 px-4 font-bold text-[#0A0F2E] text-xs uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { layer: "Frontend", tech: "React 18 + TypeScript + Vite", role: "Component architecture, type safety, optimized builds", status: "production" },
                      { layer: "UI", tech: "Radix UI + shadcn/ui + Tailwind", role: "Accessible primitives, enforced design system", status: "production" },
                      { layer: "Data", tech: "TanStack Query v5", role: "Server state, caching, optimistic updates", status: "production" },
                      { layer: "Backend", tech: "Node.js + Express + TypeScript", role: "REST API — decomposition into domain files planned", status: "production" },
                      { layer: "Database", tech: "PostgreSQL / Drizzle ORM (Neon)", role: "Schema-as-code, serverless Postgres", status: "warning", note: "Shared dev/prod" },
                      { layer: "Auth", tech: "Replit OIDC + Passport.js", role: "Multi-tenant, role-based, session persistence", status: "production" },
                      { layer: "Real-time", tech: "Socket.IO WebSocket", role: "Live signal updates, collaborative execution console", status: "production" },
                      { layer: "AI", tech: "OpenAI GPT-4o", role: "Threat synthesis, playbook generation, outcome summaries", status: "production" },
                      { layer: "Deployment", tech: "Replit Autoscale + vaughnmartin.com", role: "Custom domain, auto-scaling", status: "warning", note: "Manual CI" },
                      { layer: "Monitoring", tech: "Not yet implemented", role: "No error tracking — Phase 1 priority", status: "gap" },
                      { layer: "Testing", tech: "Not yet implemented", role: "No automated test suite — Phase 2 priority", status: "gap" },
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-[#E8E4DC] last:border-0 hover:bg-[#F8F7F4]/50">
                        <td className="py-3 px-6 font-bold text-[#0A0F2E] text-xs uppercase tracking-widest whitespace-nowrap">{r.layer}</td>
                        <td className="py-3 px-4 text-[#0A0F2E] text-xs font-medium whitespace-nowrap">{r.tech}</td>
                        <td className="py-3 px-4 text-[#6B7280] text-xs">{r.role}</td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {r.status === "production" && (
                            <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border border-[#2B8A6E]/20 text-[9px] font-bold uppercase tracking-widest">Production</Badge>
                          )}
                          {r.status === "warning" && (
                            <Badge className="bg-[#C9A84C]/10 text-[#8B6B1A] border border-[#C9A84C]/30 text-[9px] font-bold uppercase tracking-widest">⚠ {r.note}</Badge>
                          )}
                          {r.status === "gap" && (
                            <Badge className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold uppercase tracking-widest">Gap</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Known Gaps */}
          <Card className="border-[#E8E4DC] bg-white shadow-sm mb-8">
            <CardHeader className="border-b border-[#E8E4DC]">
              <CardTitle className="text-[#0A0F2E] flex items-center gap-2" style={CG}>
                <AlertTriangle className="h-5 w-5 text-[#C9A84C]" />
                Known Gaps — Sequenced, Not Surprises
              </CardTitle>
              <p className="text-xs text-[#6B7280] mt-1">These gaps are the deliberate result of shipping a working product first. Each is operationally fixable.</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8E4DC] bg-[#0A0F2E]/3">
                      <th className="text-left py-3 px-6 font-bold text-[#0A0F2E] text-xs uppercase tracking-widest">Area</th>
                      <th className="text-left py-3 px-4 font-bold text-[#0A0F2E] text-xs uppercase tracking-widest">Risk</th>
                      <th className="text-left py-3 px-4 font-bold text-[#0A0F2E] text-xs uppercase tracking-widest">Current State</th>
                      <th className="text-center py-3 px-4 font-bold text-[#0A0F2E] text-xs uppercase tracking-widest">Phase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { area: "Dev/Prod Database", risk: "HIGH", state: "Single Neon instance. Bad migration during dev can corrupt live customer data.", phase: 1 },
                      { area: "Error Monitoring", risk: "HIGH", state: "No Sentry or equivalent. Production errors are invisible until a customer reports them.", phase: 1 },
                      { area: "CI/CD Pipeline", risk: "HIGH", state: "Deployments are manual. No build verification on commit.", phase: 1 },
                      { area: "Deployment Process", risk: "MEDIUM", state: "Pre-publish esbuild step lives in institutional memory. Will fail when forgotten under pressure.", phase: 1 },
                      { area: "Test Suite", risk: "HIGH", state: "No automated tests. Auth flow, activation chain — all untested. Regressions found in production.", phase: 2 },
                      { area: "DB Migration Files", risk: "MEDIUM", state: "db:push is not safe for production. No versioned files, no rollback story for security reviews.", phase: 2 },
                      { area: "Route Architecture", risk: "MEDIUM", state: "~8,500 line routes.ts. High onboarding risk. Decomposition planned.", phase: 2 },
                      { area: "Security Headers", risk: "MEDIUM", state: "No helmet.js, no rate limiting. Will fail enterprise security review before second customer.", phase: 2 },
                      { area: "Staging Environment", risk: "MEDIUM", state: "Changes go dev → production directly. No safe test environment.", phase: 3 },
                      { area: "API Documentation", risk: "LOW", state: "No Swagger/OpenAPI spec. Enterprise IT teams require this during procurement.", phase: 3 },
                      { area: "Backup / Recovery", risk: "MEDIUM", state: "Neon PITR available but no documented runbook. Cannot state RPO/RTO to enterprise buyer.", phase: 3 },
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-[#E8E4DC] last:border-0 hover:bg-[#F8F7F4]/50">
                        <td className="py-3 px-6 font-bold text-[#0A0F2E] text-xs whitespace-nowrap">{r.area}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Badge className={`text-[9px] font-bold uppercase tracking-widest border ${
                            r.risk === "HIGH" ? "bg-red-50 text-red-600 border-red-200" :
                            r.risk === "MEDIUM" ? "bg-[#C9A84C]/10 text-[#8B6B1A] border-[#C9A84C]/30" :
                            "bg-[#0A0F2E]/5 text-[#6B7280] border-[#0A0F2E]/10"
                          }`}>{r.risk}</Badge>
                        </td>
                        <td className="py-3 px-4 text-[#6B7280] text-xs">{r.state}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={`text-[9px] font-bold uppercase tracking-widest border ${
                            r.phase === 1 ? "bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20" :
                            r.phase === 2 ? "bg-[#0A0F2E]/5 text-[#0A0F2E] border-[#0A0F2E]/10" :
                            "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20"
                          }`}>Phase {r.phase}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Three-Phase Plan */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#0A0F2E] mb-6 text-center" style={CG}>Three-Phase Hardening Plan</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  phase: "Phase 1", weeks: "Weeks 1–2", milestone: "Before second pilot customer",
                  color: "#2B8A6E", bg: "#2B8A6E",
                  items: [
                    "Separate Dev/Prod databases — second Neon project for dev, production credentials in secrets only",
                    "Sentry monitoring — error tracking on frontend + server, email alerts",
                    "GitHub Actions CI — TypeScript check + build verify on every push to main",
                    "Deployment runbook — pre-publish checklist as code-controlled config, not memory",
                  ]
                },
                {
                  phase: "Phase 2", weeks: "Weeks 3–6", milestone: "Before active sales pipeline",
                  color: "#0A0F2E", bg: "#0A0F2E",
                  items: [
                    "20-test suite — Vitest + Supertest covering playbook seeding, auth, activation chain, top API routes",
                    "Drizzle versioned migrations — replace db:push, give auditable rollback story",
                    "Route decomposition — split routes.ts into domain-grouped files",
                    "helmet.js + rate limiting — required before any enterprise security review",
                  ]
                },
                {
                  phase: "Phase 3", weeks: "Weeks 7–10", milestone: "Before 5+ customers",
                  color: "#6B7280", bg: "#6B7280",
                  items: [
                    "Staging environment — second deployment instance mirroring production",
                    "Swagger/OpenAPI spec — hosted at /api/docs, answers security questionnaires",
                    "Recovery runbook — document PITR procedure, define and publish RPO/RTO",
                    "Auth migration plan — document Replit OIDC dependencies, define portable path",
                  ]
                },
              ].map((p, i) => (
                <Card key={i} className="border-[#E8E4DC] bg-white shadow-sm overflow-hidden">
                  <div className="h-1.5" style={{ background: p.bg }} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className="text-[9px] font-bold uppercase tracking-widest border" style={{ background: `${p.bg}15`, color: p.color, borderColor: `${p.bg}30` }}>{p.phase}</Badge>
                      <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">{p.weeks}</span>
                    </div>
                    <CardTitle className="text-sm font-bold text-[#0A0F2E]">{p.milestone}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {p.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `${p.bg}15` }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.bg }} />
                          </div>
                          <p className="text-xs text-[#6B7280] leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-[#0A0F2E] rounded-lg text-center">
            <p className="text-white font-medium text-sm mb-1">The gaps are known. The plan is sequenced. None require rebuilding — only hardening.</p>
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">Phase 1 closes before customer two. Phase 2 before procurement reviews. Phase 3 before parallel pilots.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-white relative overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${GOLD} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-white" style={CG}>
            Ready to Learn More?
          </h2>
          <p className="text-lg text-white/70 mb-10">
            See Execution OS in action and explore the category-defining opportunity.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/investor-presentation">
              <Button size="lg" className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">
                <BarChart3 className="mr-2 h-5 w-5" />
                Full Presentation
              </Button>
            </Link>
            <Link href="/demo-selector">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-[#0A0F2E] bg-transparent">
                Watch Demo
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-[#0A0F2E] bg-transparent">
                Contact Martin
              </Button>
            </Link>
            <a href="mailto:mbrunke@vaughnmartin.com">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-[#0A0F2E] bg-transparent">
                mbrunke@vaughnmartin.com
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
    </InvestorGate>
  );
}
