import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Zap, 
  Target, 
  TrendingUp, 
  Clock, 
  Brain, 
  ChevronRight,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Rocket,
  Radio,
  FileText,
  Layers,
  Plug,
  Users,
  Play
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import StandardNav from "@/components/layout/StandardNav";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import CreateScenarioButton from "@/components/scenario/CreateScenarioButton";
import InteractiveROICalculator from "@/components/demo/InteractiveROICalculator";
import { SubBrandLabel } from "@/components/SubBrandLabel";

export default function MarketingLanding() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Execution OS - Strategic Execution Operating System | Transform Strategy into 12-Minute Execution",
      description: "Your competitor just launched. Your board meeting is in 3 days. Execution OS is the orchestration layer that transforms 72-hour strategic coordination into 12-minute coordinated execution. 170 playbooks, 5 AI modules, 24/7 monitoring, institutional memory—built for Fortune 1000 strategic dominance.",
      ogTitle: "Execution OS - When Your Competitor Moves, Will You Be Ready?",
      ogDescription: "The category-defining Strategic Execution Operating System. Limited Q1 2026 pilot: 10 Fortune 1000 design partners. Identify → Detect → Execute → Advance.",
    });
  }, []);

  return (
    <div className="page-background min-h-screen bg-white">
      <StandardNav />

      {/* Hero Section */}
      <section className="py-24 px-6 text-white relative overflow-hidden bg-[#0A0F2E]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMDEsMTY4LDc2LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Execution OS Logo */}
          <div className="mb-12 flex justify-center">
            <div className="inline-block px-8 py-6 rounded-none border border-white/10 backdrop-blur-md bg-white/5">
              <ExecuteIQLogo width={320} variant="full" color="white" showTagline={true} />
            </div>
          </div>
          {/* High-Stakes Competitive Scenario */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <Badge className="bg-red-600 text-white border-0 text-[10px] tracking-[0.2em] font-bold px-4 py-1 rounded-none uppercase animate-pulse" data-testid="badge-alert">
                Competitive Alert
              </Badge>
            </div>
            <h1 className="font-serif text-5xl md:text-8xl mb-8 leading-tight max-w-6xl mx-auto text-white" data-testid="heading-hero">
              Monday 9:15 AM:<br />
              <span className="text-[#C9A84C] italic">Your Competitor Just Launched.</span>
            </h1>
            <div className="max-w-4xl mx-auto mb-10">
              <div className="bg-white/5 border-l-4 border-[#0A0F2E] p-8 mb-8 backdrop-blur-sm">
                <p className="text-xl md:text-3xl text-white font-medium mb-4 leading-relaxed">
                  Their product is 15% cheaper. Social sentiment is tanking. 12 deals worth $2.4M are at risk.
                </p>
                <p className="text-lg text-white/40 uppercase tracking-widest font-bold">
                  Your next board meeting? <span className="text-white">Thursday 2 PM.</span>
                </p>
              </div>
              <p className="text-2xl md:text-3xl text-[#C9A84C] font-serif italic mb-2">
                By then, you'll have lost market share.
              </p>
              <p className="text-xl md:text-2xl text-white uppercase tracking-[0.15em] font-bold">
                Unless you have Execution OS.
              </p>
            </div>
          </div>

          {/* Primary Conversion Funnel - Try Demo + Start Pilot */}
          <div className="text-center mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <Button 
                onClick={() => { window.location.href = '/try-demo'; }}
                size="lg"
                className="bg-[#0A0F2E] border border-white/20 hover:bg-[#141B45] text-white font-bold uppercase tracking-widest text-sm px-12 py-8 rounded-none shadow-2xl transition-all"
                data-testid="button-try-demo"
              >
                <Play className="mr-3 h-4 w-4" />
                Try Interactive Demo
              </Button>
              
              <Button 
                onClick={() => setLocation("/contact")}
                size="lg"
                className="bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold uppercase tracking-widest text-sm px-12 py-8 rounded-none shadow-2xl transition-all"
                data-testid="button-start-pilot"
              >
                Start Pilot Program
                <ArrowRight className="ml-3 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Solution - Category Definition */}
      <section className="py-24 px-6 bg-white border-b border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto mb-12 text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-[#0A0F2E] text-white border-0 text-[10px] tracking-[0.2em] font-bold px-6 py-2 rounded-none uppercase">
                The Strategic Execution OS
              </Badge>
            </div>
            <h2 className="font-serif text-3xl md:text-6xl text-[#0A0F2E] mb-8">
              Execution OS for Fortune 1000 Companies
            </h2>
            <p className="text-xl md:text-2xl text-[#6B7280] mb-8 leading-relaxed font-light">
              When a strategic trigger hits—a competitor launches, regulations shift, or a market opportunity appears—organizations typically <span className="text-[#0A0F2E] font-medium">waste 20-50 hours getting organized</span>. Execution OS compresses that to <span className="text-[#C9A84C] font-bold underline decoration-[#C9A84C] underline-offset-8">12 minutes</span>.
            </p>
            <p className="text-lg text-[#6B7280] mb-8 leading-relaxed max-w-4xl mx-auto">
              Our AI monitors 216 data points across 16 intelligence categories, detecting threats and opportunities before competitors see them. When a signal breaches a threshold, Execution OS automatically activates the right playbook: notifying stakeholders, assigning tasks, and unlocking pre-approved budgets—all in under 12 minutes.
            </p>
            <p className="text-lg text-[#0A0F2E] mb-10 leading-relaxed max-w-4xl mx-auto font-medium">
              We're the orchestration layer between strategy and execution. <span className="text-[#C9A84C]">AI handles detection and coordination. Executives make the decisions.</span>
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-10 text-[10px] uppercase tracking-widest font-bold text-[#C9A84C]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C]" />
                <span>170 Strategic Playbooks</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C]" />
                <span>5 AI Intelligence Modules</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C]" />
                <span>24/7 Monitoring</span>
              </div>
            </div>
          </div>

          {/* Execution OS Product Suite */}
          <Card className="max-w-6xl mx-auto bg-[#F8F7F4] border-[#E8E4DC] rounded-none shadow-sm">
            <CardContent className="p-10">
              <div className="text-center mb-12">
                <h3 className="font-serif text-3xl text-[#0A0F2E] mb-3">
                  The Execution OS Product Suite
                </h3>
                <p className="text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] font-bold">
                  Four integrated modules powered by the IDEA Framework™
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-6 text-left">
                <div className="bg-white p-6 border border-[#E8E4DC] hover:border-[#C9A84C] transition-colors">
                  <Badge className="mb-4 bg-[#C9A84C] text-[#0A0F2E] border-0 text-[9px] tracking-widest font-bold rounded-none uppercase">Identify</Badge>
                  <div className="text-[#0A0F2E] font-serif text-xl mb-3"><SubBrandLabel name="Playbook™" /></div>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    170 pre-built playbooks across 9 strategic domains. Build your depth chart before events hit.
                  </p>
                </div>
                <div className="bg-white p-6 border border-[#E8E4DC] hover:border-[#2B8A6E] transition-colors">
                  <Badge className="mb-4 bg-[#0A0F2E] text-white border-0 text-[9px] tracking-widest font-bold rounded-none uppercase">Detect</Badge>
                  <div className="text-[#0A0F2E] font-serif text-xl mb-3"><SubBrandLabel name="Signal™" /></div>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    AI-powered monitoring across 216 data points. Detect threats and opportunities before competitors.
                  </p>
                </div>
                <div className="bg-white p-6 border border-[#E8E4DC] hover:border-[#C9A84C] transition-colors">
                  <Badge className="mb-4 bg-[#C9A84C] text-[#0A0F2E] border-0 text-[9px] tracking-widest font-bold rounded-none uppercase">Execute</Badge>
                  <div className="text-[#0A0F2E] font-serif text-xl mb-3"><SubBrandLabel name="Compass™" /></div>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    12-minute coordinated execution. Stakeholders, budgets, and actions—automatically orchestrated.
                  </p>
                </div>
                <div className="bg-white p-6 border border-[#E8E4DC] hover:border-[#2B8A6E] transition-colors">
                  <Badge className="mb-4 bg-[#0A0F2E] text-white border-0 text-[9px] tracking-widest font-bold rounded-none uppercase">Advance</Badge>
                  <div className="text-[#0A0F2E] font-serif text-xl mb-3"><SubBrandLabel name="Retrospect™" /></div>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Capture lessons, refine playbooks. Every execution makes your organization smarter.
                  </p>
                </div>
              </div>
              <div className="text-center mt-10">
                <p className="text-[#6B7280] text-[10px] font-bold uppercase tracking-[0.3em]">
                  Plus <span className="text-[#C9A84C] font-bold">Execution OS One™</span> — Single-pane executive overview
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section className="py-24 px-6 bg-[#F8F7F4] border-b border-[#E8E4DC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>Strategic Value</span>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
            </div>
            <h2 className="font-serif text-4xl text-[#0A0F2E] mb-4">The ROI of <em className="italic text-[#C9A84C]">12-Minute Execution</em></h2>
            <p className="text-[#6B7280] uppercase tracking-widest text-[10px] font-bold">Calculate the value of strategic agility</p>
          </div>
          <InteractiveROICalculator persona="general" industry="general" />
        </div>
      </section>

      {/* Complete Product Features - All Capabilities */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-[#0A0F2E] text-[#C9A84C] border-0 text-[10px] tracking-[0.3em] font-bold px-8 py-2 rounded-none uppercase">
              Complete Platform Access
            </Badge>
            <h2 className="font-serif text-4xl md:text-6xl text-[#0A0F2E] mb-6">
              Explore All Product Features
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto font-light leading-relaxed">
              Complete platform ecosystem for championship-level execution. Build your organization's decision operations infrastructure.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* 1. Create Playbook - PROMINENT */}
            <Card className="border-2 border-[#0A0F2E] bg-white rounded-none hover:shadow-2xl transition-all duration-500 col-span-full lg:col-span-1" data-testid="card-create-playbook">
              <CardContent className="p-10">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 rounded-none bg-[#0A0F2E] flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-8 h-8 text-[#C9A84C]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-[#0A0F2E] mb-3">
                      Create Strategic Playbook
                    </h3>
                    <Badge className="bg-[#C9A84C] text-[#0A0F2E] rounded-none text-[9px] tracking-widest font-bold uppercase px-3 py-1 mb-4">Start Here</Badge>
                  </div>
                </div>
                <p className="text-[#6B7280] mb-8 leading-relaxed">
                  Build complete decision operations playbook in 5 phases: Context, Stakeholders, Triggers, Metrics, and Review.
                </p>
                <CreateScenarioButton organizationId="default-org" className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white rounded-none h-14 uppercase tracking-widest text-xs font-bold" />
              </CardContent>
            </Card>

            {/* 2. AI Intelligence (5 Modules) */}
            <Card className="border border-[#E8E4DC] rounded-none hover:border-[#0A0F2E] transition-all duration-300 group" data-testid="card-ai-intelligence">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-[#F8F7F4] flex items-center justify-center mb-6 group-hover:bg-[#0A0F2E] group-hover:text-white transition-colors">
                  <Brain className="w-7 h-7 text-[#0A0F2E] group-hover:text-[#C9A84C] transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-[#0A0F2E] mb-4">AI Intelligence Layer</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  5 specialized AI modules: Pulse, Flux, Prism, Echo, Nova for real-time strategic insights and pattern detection.
                </p>
                <Button onClick={() => setLocation('/ai')} variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-ai-intelligence">
                  Explore AI Modules <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 3. 24/7 Monitoring */}
            <Card className="border border-[#E8E4DC] rounded-none hover:border-[#0A0F2E] transition-all duration-300 group" data-testid="card-monitoring">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-[#F8F7F4] flex items-center justify-center mb-6 group-hover:bg-[#0A0F2E] group-hover:text-white transition-colors">
                  <Radio className="w-7 h-7 text-[#0A0F2E] group-hover:text-[#C9A84C] transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-[#0A0F2E] mb-4">24/7 Monitoring System</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  Track 12 intelligence signals with AI-powered pattern recognition and proactive alerts tailored to your industry.
                </p>
                <Button onClick={() => setLocation('/ai-radar')} variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-monitoring">
                  View AI Radar <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 4. Playbook Library */}
            <Card className="border border-[#E8E4DC] rounded-none hover:border-[#0A0F2E] transition-all duration-300 group" data-testid="card-scenarios">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-[#F8F7F4] flex items-center justify-center mb-6 group-hover:bg-[#0A0F2E] group-hover:text-white transition-colors">
                  <FileText className="w-7 h-7 text-[#0A0F2E] group-hover:text-[#C9A84C] transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-[#0A0F2E] mb-4">Playbook Library</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  170 strategic playbooks across 9 operational domains covering growth, defense, transformation, and AI governance.
                </p>
                <Button onClick={() => setLocation('/playbook-library')} variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-scenarios">
                  Browse Playbooks <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 5. What-If Analyzer */}
            <Card className="border border-[#E8E4DC] rounded-none hover:border-[#0A0F2E] transition-all duration-300 group" data-testid="card-what-if">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-[#F8F7F4] flex items-center justify-center mb-6 group-hover:bg-[#0A0F2E] group-hover:text-white transition-colors">
                  <Layers className="w-7 h-7 text-[#0A0F2E] group-hover:text-[#C9A84C] transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-[#0A0F2E] mb-4">What-If Analyzer</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  Test strategic approaches, simulate outcomes, and optimize execution plans before allocating resources.
                </p>
                <Button onClick={() => setLocation('/what-if-analyzer')} variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-what-if">
                  Run Simulations <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 6. Command Center */}
            <Card className="border border-[#E8E4DC] rounded-none hover:border-[#0A0F2E] transition-all duration-300 group" data-testid="card-command-center">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-[#F8F7F4] flex items-center justify-center mb-6 group-hover:bg-[#0A0F2E] group-hover:text-white transition-colors">
                  <Shield className="w-7 h-7 text-[#0A0F2E] group-hover:text-[#C9A84C] transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-[#0A0F2E] mb-4">Executive Command Center</h3>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  Real-time strategic coordination hub for 12-minute execution. Manage active scenarios and stakeholder alignment.
                </p>
                <Button onClick={() => setLocation('/command-center')} variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-command-center">
                  Open War Room <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0A0F2E] border-t border-white/10 text-center">
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
          Execution OS — Strategic Execution Operating System by VaughnMartin
        </p>
      </footer>
    </div>
  );
}
