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
import { useEffect, useState } from "react";
import { updatePageMetadata } from "@/lib/seo";
import StandardNav from "@/components/layout/StandardNav";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import CreateScenarioButton from "@/components/scenario/CreateScenarioButton";
import DemoWelcomeScreen from "@/components/demo/DemoWelcomeScreen";
import ExecutionTimelineDemo from "@/components/demo/ExecutionTimelineDemo";
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
      <section className="py-24 px-6 text-poise-navy relative overflow-hidden bg-poise-navy">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
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
              <span className="text-poise-gold italic">Your Competitor Just Launched.</span>
            </h1>
            <div className="max-w-4xl mx-auto mb-10">
              <div className="bg-white/5 border-l-4 border-red-600 p-8 mb-8 backdrop-blur-sm">
                <p className="text-xl md:text-3xl text-white font-medium mb-4 leading-relaxed">
                  Their product is 15% cheaper. Social sentiment is tanking. 12 deals worth $2.4M are at risk.
                </p>
                <p className="text-lg text-slate-400 uppercase tracking-widest font-bold">
                  Your next board meeting? <span className="text-white">Thursday 2 PM.</span>
                </p>
              </div>
              <p className="text-2xl md:text-3xl text-poise-gold font-serif italic mb-2">
                By then, you'll have lost market share.
              </p>
              <p className="text-xl md:text-2xl text-white uppercase tracking-[0.15em] font-bold">
                Unless you have Execution OS.
              </p>
            </div>
          </div>

          {/* Solution - Category Definition */}
          <div className="mb-16">
            <div className="max-w-5xl mx-auto mb-12">
              <div className="flex justify-center mb-6">
                <Badge className="bg-poise-teal text-white border-0 text-[10px] tracking-[0.2em] font-bold px-6 py-2 rounded-none uppercase">
                  The Strategic Execution OS
                </Badge>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-white mb-8">
                Execution OS for Fortune 1000 Companies
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed font-light">
                When a strategic trigger hits—a competitor launches, regulations shift, or a market opportunity appears—organizations typically <span className="text-red-400 font-medium">waste 20-50 hours getting organized</span>. Execution OS compresses that to <span className="text-poise-teal font-bold underline decoration-poise-gold underline-offset-8">12 minutes</span>.
              </p>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-4xl mx-auto">
                Our AI monitors 216 data points across 16 intelligence categories, detecting threats and opportunities before competitors see them. When a signal breaches a threshold, Execution OS automatically activates the right playbook: notifying stakeholders, assigning tasks, and unlocking pre-approved budgets—all in under 12 minutes.
              </p>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-4xl mx-auto font-medium">
                We're the orchestration layer between strategy and execution. <span className="text-poise-teal">AI handles detection and coordination. Executives make the decisions.</span>
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-10 text-sm uppercase tracking-widest font-bold text-poise-gold">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-poise-teal" />
                  <span>170 Strategic Playbooks</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-poise-teal" />
                  <span>5 AI Intelligence Modules</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-poise-teal" />
                  <span>24/7 Monitoring</span>
                </div>
              </div>
            </div>

            {/* Execution OS Product Suite */}
            <Card className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border-white/10 rounded-none">
              <CardContent className="p-10">
                <div className="text-center mb-12">
                  <h3 className="font-serif text-3xl text-white mb-3">
                    The Execution OS Product Suite
                  </h3>
                  <p className="text-poise-gold text-xs uppercase tracking-[0.2em] font-bold">
                    Four integrated modules powered by the IDEA Framework™
                  </p>
                </div>
                <div className="grid md:grid-cols-4 gap-6 text-left">
                  <div className="bg-white/5 p-6 border-l-2 border-poise-gold hover:bg-white/10 transition-colors">
                    <Badge className="mb-4 bg-poise-gold text-poise-navy border-0 text-[9px] tracking-widest font-bold rounded-none uppercase">Identify</Badge>
                    <div className="text-white font-serif text-xl mb-3"><SubBrandLabel name="Playbook™" /></div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      170 pre-built playbooks across 9 strategic domains. Build your depth chart before events hit.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 border-l-2 border-poise-teal hover:bg-white/10 transition-colors">
                    <Badge className="mb-4 bg-poise-teal text-white border-0 text-[9px] tracking-widest font-bold rounded-none uppercase">Detect</Badge>
                    <div className="text-white font-serif text-xl mb-3"><SubBrandLabel name="Signal™" /></div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      AI-powered monitoring across 216 data points. Detect threats and opportunities before competitors.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 border-l-2 border-poise-gold hover:bg-white/10 transition-colors">
                    <Badge className="mb-4 bg-poise-gold text-poise-navy border-0 text-[9px] tracking-widest font-bold rounded-none uppercase">Execute</Badge>
                    <div className="text-white font-serif text-xl mb-3"><SubBrandLabel name="Compass™" /></div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      12-minute coordinated execution. Stakeholders, budgets, and actions—automatically orchestrated.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 border-l-2 border-poise-teal hover:bg-white/10 transition-colors">
                    <Badge className="mb-4 bg-poise-teal text-white border-0 text-[9px] tracking-widest font-bold rounded-none uppercase">Advance</Badge>
                    <div className="text-white font-serif text-xl mb-3"><SubBrandLabel name="Retrospect™" /></div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Capture lessons, refine playbooks. Every execution makes your organization smarter.
                    </p>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em]">
                    Plus <span className="text-poise-teal font-bold">Execution OS One™</span> — Single-pane executive overview
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Primary Conversion Funnel - Try Demo + Start Pilot */}
          <div className="text-center mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <Button 
                onClick={() => { window.location.href = '/try-demo'; }}
                size="lg"
                className="bg-poise-teal hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-sm px-12 py-8 rounded-none shadow-2xl transition-all"
                data-testid="button-try-demo"
              >
                <Play className="mr-3 h-4 w-4" />
                Try Interactive Demo
              </Button>
              
              <Button 
                onClick={() => setLocation("/contact")}
                size="lg"
                className="bg-poise-gold hover:bg-amber-600 text-poise-navy font-bold uppercase tracking-widest text-sm px-12 py-8 rounded-none shadow-2xl transition-all"
                data-testid="button-start-pilot"
              >
                Start Pilot Program
                <ArrowRight className="ml-3 h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">
              See the platform in action or{" "}
              <button 
                onClick={() => setLocation("/playbooks")}
                className="text-poise-gold hover:text-white transition-colors underline decoration-poise-gold/30 underline-offset-4"
                data-testid="link-explore-playbooks"
              >
                explore 170 playbooks
              </button>
              {" "}•{" "}
              <button 
                onClick={() => setLocation("/how-it-works")}
                className="text-poise-gold hover:text-white transition-colors underline decoration-poise-gold/30 underline-offset-4"
                data-testid="link-watch-demo"
              >
                learn how it works
              </button>
            </p>
          </div>

          {/* Q1 2026 Founding Partner Program - Supporting Info */}
          <div className="max-w-5xl mx-auto">
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6" data-testid="card-pilot-info">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <Badge className="bg-poise-gold/10 text-poise-gold border border-poise-gold/30 text-[9px] tracking-widest font-bold rounded-none uppercase px-3 py-1">
                    Q1 2026 Founding Partners
                  </Badge>
                  <span className="text-slate-400 text-xs uppercase tracking-widest">
                    90-day validation • Only 3 slots remaining
                  </span>
                </div>
                <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-poise-teal" />
                    <span>Full platform access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-poise-teal" />
                    <span>Priority roadmap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-poise-navy mb-4 italic">The ROI of 12-Minute Execution</h2>
            <p className="text-slate-600 uppercase tracking-widest text-xs font-bold">Calculate the value of strategic agility</p>
          </div>
          <InteractiveROICalculator persona="general" industry="general" />
        </div>
      </section>

      {/* Complete Product Features - All Capabilities */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-poise-navy text-poise-gold border-0 text-[10px] tracking-[0.3em] font-bold px-8 py-2 rounded-none uppercase">
              Complete Platform Access
            </Badge>
            <h2 className="font-serif text-4xl md:text-6xl text-poise-navy mb-6">
              Explore All Product Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Complete platform ecosystem for championship-level execution. Build your organization's decision operations infrastructure.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* 1. Create Playbook - PROMINENT */}
            <Card className="border-2 border-poise-navy bg-slate-50 rounded-none hover:shadow-2xl transition-all duration-500 col-span-full lg:col-span-1" data-testid="card-create-playbook">
              <CardContent className="p-10">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 rounded-none bg-poise-navy flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-8 h-8 text-poise-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-poise-navy mb-3">
                      Create Strategic Playbook
                    </h3>
                    <Badge className="bg-poise-gold text-poise-navy rounded-none text-[9px] tracking-widest font-bold uppercase px-3 py-1 mb-4">Start Here</Badge>
                  </div>
                </div>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Build complete decision operations playbook in 5 phases: Context, Stakeholders, Triggers, Metrics, and Review.
                </p>
                <CreateScenarioButton organizationId="default-org" className="w-full bg-poise-navy hover:bg-slate-800 text-white rounded-none h-14 uppercase tracking-widest text-xs font-bold" />
              </CardContent>
            </Card>

            {/* 2. AI Intelligence (5 Modules) */}
            <Card className="border border-slate-200 rounded-none hover:border-poise-teal transition-all duration-300 group" data-testid="card-ai-intelligence">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-poise-teal/10 transition-colors">
                  <Brain className="w-7 h-7 text-poise-navy group-hover:text-poise-teal transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-poise-navy mb-4">AI Intelligence Layer</h3>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  5 specialized AI modules: Pulse, Flux, Prism, Echo, Nova for real-time strategic insights and pattern detection.
                </p>
                <Button onClick={() => setLocation('/ai')} variant="outline" className="w-full border-slate-200 text-poise-navy hover:bg-poise-navy hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-ai-intelligence">
                  Explore AI Modules <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 3. 24/7 Monitoring */}
            <Card className="border border-slate-200 rounded-none hover:border-poise-teal transition-all duration-300 group" data-testid="card-monitoring">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-poise-teal/10 transition-colors">
                  <Radio className="w-7 h-7 text-poise-navy group-hover:text-poise-teal transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-poise-navy mb-4">24/7 Monitoring System</h3>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  Track 12 intelligence signals with AI-powered pattern recognition and proactive alerts tailored to your industry.
                </p>
                <Button onClick={() => setLocation('/ai-radar')} variant="outline" className="w-full border-slate-200 text-poise-navy hover:bg-poise-navy hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-monitoring">
                  View AI Radar <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 4. Playbook Library */}
            <Card className="border border-slate-200 rounded-none hover:border-poise-teal transition-all duration-300 group" data-testid="card-scenarios">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-poise-teal/10 transition-colors">
                  <FileText className="w-7 h-7 text-poise-navy group-hover:text-poise-teal transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-poise-navy mb-4">Playbook Library</h3>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  170 strategic playbooks across 9 operational domains covering growth, defense, transformation, and AI governance.
                </p>
                <Button onClick={() => setLocation('/playbook-library')} variant="outline" className="w-full border-slate-200 text-poise-navy hover:bg-poise-navy hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-scenarios">
                  Browse Playbooks <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 5. What-If Analyzer */}
            <Card className="border border-slate-200 rounded-none hover:border-poise-teal transition-all duration-300 group" data-testid="card-what-if">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-poise-teal/10 transition-colors">
                  <Layers className="w-7 h-7 text-poise-navy group-hover:text-poise-teal transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-poise-navy mb-4">What-If Analyzer</h3>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  Test strategic approaches, simulate outcomes, and optimize execution plans before allocating resources.
                </p>
                <Button onClick={() => setLocation('/what-if-analyzer')} variant="outline" className="w-full border-slate-200 text-poise-navy hover:bg-poise-navy hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-what-if">
                  Run Simulations <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 6. Command Center */}
            <Card className="border border-slate-200 rounded-none hover:border-poise-teal transition-all duration-300 group" data-testid="card-command-center">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-none bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-poise-teal/10 transition-colors">
                  <Shield className="w-7 h-7 text-poise-navy group-hover:text-poise-teal transition-colors" />
                </div>
                <h3 className="font-serif text-xl text-poise-navy mb-4">Executive Command Center</h3>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  Real-time strategic coordination hub for 12-minute execution. Manage active scenarios and stakeholder alignment.
                </p>
                <Button onClick={() => setLocation('/command-center')} variant="outline" className="w-full border-slate-200 text-poise-navy hover:bg-poise-navy hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12" data-testid="button-command-center">
                  Open War Room <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

            {/* 7. Triggers Management */}
            <Card className="border-2 border-yellow-300 dark:border-yellow-700 hover:shadow-xl transition-all duration-300" data-testid="card-triggers">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Trigger Management
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-slate-300 mb-4">
                      Define conditions, activate playbooks, monitor execution status
                    </p>
                  </div>
                </div>
                <Button onClick={() => setLocation('/triggers-management')} variant="outline" className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20" data-testid="button-triggers">
                  Manage Triggers <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 8. Integration Hub */}
            <Card className="border-2 border-indigo-300 dark:border-indigo-700 hover:shadow-xl transition-all duration-300" data-testid="card-integrations">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                    <Plug className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Integration Hub
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-slate-300 mb-4">
                      Connect Jira, Slack, Teams, Salesforce, and 50+ enterprise tools
                    </p>
                  </div>
                </div>
                <Button onClick={() => setLocation('/integrations')} variant="outline" className="w-full border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" data-testid="button-integrations">
                  View Integrations <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 9. Institutional Memory */}
            <Card className="border-2 border-teal-300 dark:border-teal-700 hover:shadow-xl transition-all duration-300" data-testid="card-memory">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Institutional Memory
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-slate-300 mb-4">
                      Capture decision outcomes, refine playbooks, build organizational wisdom
                    </p>
                  </div>
                </div>
                <Button onClick={() => setLocation('/institutional-memory')} variant="outline" className="w-full border-teal-500 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20" data-testid="button-memory">
                  Explore Memory <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Four-Phase Framework */}
      <section className="py-20 px-6 text-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-500 text-slate-900 border-0 text-base px-6 py-2" data-testid="badge-framework">
              The Core Workflow
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              IDENTIFY → DETECT → EXECUTE → ADVANCE
            </h2>
            <p className="text-xl text-blue-800 max-w-4xl mx-auto leading-relaxed">
              This is the framework that wins championships—whether in Eugene, Oregon or in Fortune 1000 boardrooms. Four phases that transform strategic intent into coordinated organizational execution.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {/* Phase 1: IDENTIFY */}
            <Card className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-2 border-violet-500" data-testid="card-phase-identify">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-violet-500 text-gray-900 text-2xl font-bold mb-3">
                    I
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">IDENTIFY</h3>
                  <div className="text-violet-300 text-sm font-semibold mb-4">Build Your Depth Chart</div>
                </div>
                <p className="text-blue-800 text-sm mb-4">
                  Build playbooks for scenarios you might never face. Study the competitive landscape. Define every stakeholder's role. Set trigger conditions.
                </p>
                <div className="bg-violet-950/30 rounded-lg p-3 border border-violet-500/30">
                  <p className="text-violet-200 text-xs italic">
                    "We're never going to see this defense."
                  </p>
                  <p className="text-violet-300 text-xs font-semibold mt-1">
                    "Maybe. But if we do, we'll be ready."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2: DETECT */}
            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-500" data-testid="card-phase-detect">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-gray-900 text-2xl font-bold mb-3">
                    D
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">DETECT</h3>
                  <div className="text-blue-300 text-sm font-semibold mb-4">Monitor Signals</div>
                </div>
                <p className="text-blue-800 text-sm mb-4">
                  AI monitors competitive signals, customer patterns, operational metrics, and market shifts. Pattern recognition spots trigger conditions in real-time.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-blue-800">
                    <CheckCircle2 className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Competitive moves detected</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-800">
                    <CheckCircle2 className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Customer sentiment analyzed</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-800">
                    <CheckCircle2 className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Market triggers identified</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3: EXECUTE */}
            <Card className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border-2 border-emerald-500" data-testid="card-phase-execute">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500 text-gray-900 text-2xl font-bold mb-3">
                    E
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">EXECUTE</h3>
                  <div className="text-emerald-300 text-sm font-semibold mb-4">Execute Response</div>
                </div>
                <p className="text-blue-800 text-sm mb-4">
                  One-click playbook activation. Every stakeholder receives coordinated assignments simultaneously. No meetings. No delays. Just execution.
                </p>
                <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-500/30">
                  <div className="text-emerald-200 text-xs space-y-1">
                    <div><strong>0-2 min:</strong> System validation</div>
                    <div><strong>2-5 min:</strong> Stakeholder distribution</div>
                    <div><strong>5-12 min:</strong> Coordinated execution begins</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 4: ADVANCE */}
            <Card className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-2 border-amber-500" data-testid="card-phase-advance">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-500 text-gray-900 text-2xl font-bold mb-3">
                    A
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">ADVANCE</h3>
                  <div className="text-amber-300 text-sm font-semibold mb-4">Review the Film</div>
                </div>
                <p className="text-blue-800 text-sm mb-4">
                  Capture what worked. Measure performance across all 12 operating model elements. Refine playbooks. Get better every execution.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-blue-800">
                    <CheckCircle2 className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Decision outcomes documented</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-800">
                    <CheckCircle2 className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Playbooks continuously improved</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-800">
                    <CheckCircle2 className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Organization gets smarter</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/50">
              <CardContent className="p-8 text-center">
                <p className="text-2xl font-bold text-gray-900 mb-3">
                  Elite organizations succeed through preparation, not improvisation.
                </p>
                <p className="text-xl text-blue-800">
                  Execution OS is the orchestration layer that enables Fortune 1000 leaders to sense change early, act decisively, and mobilize across 9 strategic domains in 12 minutes instead of 72 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Scenarios Preview */}
      <section className="py-20 px-6 bg-gradient-to-br dark:from-slate-950 dark:to-blue-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-cyan-500 text-gray-900 border-0" data-testid="badge-scenarios">
              See It In Action
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              170 Strategic Playbook Library
            </h2>
            <p className="text-xl text-blue-800 mb-8 max-w-3xl mx-auto">
              Enterprise-ready playbook templates across 9 operational domains. From market dynamics to technology innovation, talent leadership to AI governance—transform any strategic initiative from a 72-hour process into a 12-minute coordinated response.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-green-600/10 border-2 border-green-500" data-testid="card-market-dynamics">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Market Dynamics</h3>
                  <p className="text-emerald-800 text-xs">Competitive threats & opportunities</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-600/10 border-2 border-emerald-500" data-testid="card-financial-strategy">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Financial Strategy</h3>
                  <p className="text-emerald-200 text-xs">Capital allocation & risk management</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-600/10 border-2 border-blue-500" data-testid="card-operational-excellence">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Shield className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Operational Excellence</h3>
                  <p className="text-blue-800 text-xs">Supply chain & process optimization</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-600/10 border-2 border-purple-500" data-testid="card-technology-innovation">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Zap className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Technology & Innovation</h3>
                  <p className="text-purple-700 text-xs">Digital transformation & AI adoption</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-600/10 border-2 border-amber-500" data-testid="card-talent-leadership">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Users className="h-10 w-10 text-amber-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Talent & Leadership</h3>
                  <p className="text-[#C9A84C] text-xs">Culture, workforce & succession</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-pink-600/10 border-2 border-pink-500" data-testid="card-brand-reputation">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Target className="h-10 w-10 text-pink-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Brand & Reputation</h3>
                  <p className="text-pink-200 text-xs">PR crises & stakeholder trust</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cyan-600/10 border-2 border-cyan-500" data-testid="card-regulatory-compliance">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Shield className="h-10 w-10 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Regulatory & Compliance</h3>
                  <p className="text-cyan-200 text-xs">Legal, regulatory & governance</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-indigo-600/10 border-2 border-indigo-500" data-testid="card-market-opportunities">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Rocket className="h-10 w-10 text-indigo-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Market Opportunities</h3>
                  <p className="text-indigo-200 text-xs">M&A, expansion & new markets</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6 h-auto font-semibold"
              onClick={() => setLocation("/playbook-library")}
              data-testid="button-explore-scenarios"
            >
              Explore Playbook Library
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Execution Plan Demo - 12-Minute Playbook Example */}
      <section id="execution-demo-section" className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 text-base px-6 py-2">
              See 12-Minute Execution in Action
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Complete Playbook: Competitive Response
            </h2>
            <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto">
              When your competitor launches a 15% price cut, here's how Execution OS coordinates your entire response team in 12 minutes—instead of the 72-hour industry standard.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <ExecutionTimelineDemo planType="competitive_response" />
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-2 border-cyan-500/50 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  From 72 Hours to 12 Minutes = 360x Faster
                </h3>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                  This is preparation-driven execution at enterprise scale. Build your playbooks once. Trigger them instantly. Execute with precision. Learn systematically.
                </p>
                <Button 
                  size="lg" 
                  className="bg-cyan-600 hover:bg-cyan-500 text-gray-900 text-lg px-10 py-6"
                  onClick={() => setLocation("/how-it-works")}
                  data-testid="button-see-execution-demo"
                >
                  See Full Interactive Demo <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof - Research & Credibility */}
      <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600 text-white border-0" data-testid="badge-problem-research">
              The Research
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              The Fortune 1000 Execution Gap
            </h2>
            <p className="text-lg text-gray-800 dark:text-slate-300 max-w-2xl mx-auto">
              The gap between strategic planning and coordinated execution costs enterprises billions annually
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card data-testid="card-stat-coordination-time">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-red-700 mb-2">72 hours</div>
                <div className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Industry Standard</div>
                <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">
                  Average coordination time for strategic initiatives in Fortune 1000 companies
                </div>
                <div className="text-xs text-gray-800 italic">Source: HBR "Why Strategy Execution Unravels" (2015), McKinsey "Decision Making in the Age of Urgency" (2023)</div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-missed-opportunities">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-red-700 mb-2">87%</div>
                <div className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Missed Windows</div>
                <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">
                  Strategic initiatives that miss execution windows due to coordination delays
                </div>
                <div className="text-xs text-gray-800 italic">Source: Bain & Company "The Execution Premium" study (2022)</div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-vexor-target">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-emerald-700 mb-2">12 min</div>
                <div className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Execution OS Target</div>
                <div className="text-sm text-gray-800 dark:text-slate-300">
                  Design goal: Coordinated execution with pre-built playbooks and AI orchestration
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800" data-testid="card-founding-vision">
            <CardContent className="pt-8 pb-8">
              <p className="text-xl italic text-slate-700 dark:text-slate-300 mb-4 text-center max-w-3xl mx-auto">
                "Execution OS transforms leadership from guardians of continuity into architects of transformation. We're the orchestration layer that enables Fortune 1000 leaders to sense change early, act decisively, and mobilize across all 9 strategic domains."
              </p>
              <div className="text-center">
                <div className="font-semibold text-slate-900 dark:text-white">Execution OS Founding Team</div>
                <div className="text-sm text-gray-800 dark:text-slate-300">Bringing championship-level execution to enterprise strategy</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA - Unified Conversion Funnel */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Strategic Execution?
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            See how Execution OS transforms 72-hour coordination into 12-minute response.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg"
              onClick={() => { window.location.href = '/try-demo'; }}
              className="bg-poise-teal hover:bg-cyan-500 text-gray-900 text-lg px-10 py-6 font-semibold"
              data-testid="button-cta-demo"
            >
              <Play className="h-5 w-5 mr-2" />
              Try Interactive Demo
            </Button>
            <Button 
              size="lg"
              onClick={() => setLocation("/contact")}
              className="bg-poise-gold hover:bg-amber-500 text-poise-navy text-lg px-10 py-6 font-semibold"
              data-testid="button-cta-pilot"
            >
              Start Pilot Program
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-gray-800 dark:text-slate-200">
            Q1 2026 Founding Partner Program • 90-day validation • $75K (100% credited to Year 1)
          </p>
        </div>
      </section>
    </div>
  );
}
