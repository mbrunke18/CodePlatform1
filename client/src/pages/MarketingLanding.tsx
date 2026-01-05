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
  Users
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { updatePageMetadata } from "@/lib/seo";
import StandardNav from "@/components/layout/StandardNav";
import CreateScenarioButton from "@/components/scenario/CreateScenarioButton";
import DemoWelcomeScreen from "@/components/demo/DemoWelcomeScreen";
import ExecutionTimelineDemo from "@/components/demo/ExecutionTimelineDemo";
import InteractiveROICalculator from "@/components/demo/InteractiveROICalculator";

export default function MarketingLanding() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "M - Strategic Execution Operating System | Transform Strategy into 12-Minute Execution",
      description: "Your competitor just launched. Your board meeting is in 3 days. M is the first Strategic Execution Operating System that transforms 72-hour strategic coordination into 12-minute coordinated execution. 166 playbooks, 5 AI modules, 24/7 monitoring, institutional memory—built for Fortune 1000 strategic dominance.",
      ogTitle: "M - When Your Competitor Moves, Will You Be Ready?",
      ogDescription: "The category-defining Strategic Execution Operating System. Limited Q1 2025 pilot: 10 Fortune 1000 design partners. Prepare → Monitor → Execute → Learn.",
    });
  }, []);

  return (
    <div className="page-background min-h-screen">
      <StandardNav onViewDemo={() => setLocation('/demo')} />

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* High-Stakes Competitive Scenario */}
          <div className="mb-8">
            <Badge className="mb-4 bg-red-600 text-white border-0 text-sm px-4 py-1.5 animate-pulse" data-testid="badge-alert">
              ⚡ COMPETITIVE ALERT
            </Badge>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight max-w-6xl mx-auto text-white" data-testid="heading-hero">
              Monday 9:15 AM:<br />
              <span className="text-red-300">Your Competitor Just Launched.</span>
            </h1>
            <div className="max-w-3xl mx-auto mb-6">
              <div className="bg-red-900/30 border-2 border-red-500/50 rounded-lg p-6 mb-4">
                <p className="text-xl md:text-2xl text-white font-semibold mb-3">
                  Their product is 15% cheaper. Social sentiment is tanking. 12 deals worth $2.4M are at risk.
                </p>
                <p className="text-lg text-red-200">
                  Your next board meeting? <span className="font-bold text-white">Thursday 2 PM.</span>
                </p>
              </div>
              <p className="text-xl md:text-2xl text-yellow-200 font-bold">
                By then, you'll have lost market share.<br />
                <span className="text-white">Unless you have M.</span>
              </p>
            </div>
          </div>

          {/* Solution - Category Definition */}
          <div className="mb-10">
            <div className="max-w-5xl mx-auto mb-8">
              <Badge className="mb-4 bg-cyan-500 text-white border-0 text-base px-6 py-2">
                Category-Defining Platform
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">
                The First Strategic Execution Operating System
              </h2>
              <p className="text-xl md:text-2xl text-white mb-4 leading-relaxed">
                Transform 72-hour strategic coordination into <span className="text-cyan-300 font-bold">12-minute coordinated execution</span>
              </p>
              <div className="flex items-center justify-center gap-6 text-lg text-blue-100 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>166 Strategic Playbooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>5 AI Intelligence Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>24/7 Monitoring</span>
                </div>
              </div>
            </div>

            {/* Methodology Card - Rebranded */}
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm border-2 border-blue-400/50">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Prepare → Monitor → Execute → Learn
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Championship-level execution methodology proven at enterprise scale
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-cyan-300 font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Preparation-Driven Execution
                    </div>
                    <p className="text-blue-100 text-sm">
                      Pre-configured playbooks with 80% templates ready. When triggers fire, 
                      stakeholders know exactly what to do—no meetings, no delays.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-cyan-300 font-semibold mb-2 flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Dynamic Strategy Methodology
                    </div>
                    <p className="text-blue-100 text-sm">
                      Living systems that sense market shifts, adapt playbooks, and learn from 
                      every execution—building institutional memory that compounds over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive ROI Calculator */}
          <div className="max-w-4xl mx-auto mb-12">
            <InteractiveROICalculator persona="general" industry="general" />
          </div>

          {/* Urgency & Exclusivity - Pilot Slots */}
          <div className="mb-10 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border-3 border-yellow-400/70 backdrop-blur-sm shadow-2xl" data-testid="card-pilot-urgency">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge className="mb-4 bg-yellow-500 text-black font-bold text-base px-6 py-2 animate-pulse">
                    ⚡ LIMITED AVAILABILITY
                  </Badge>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Q1 2025 Design Partner Program
                  </h3>
                  <p className="text-xl text-yellow-200 mb-6">
                    Join 10 Fortune 1000 companies building the future of executive decision operations
                  </p>
                  
                  {/* Urgency Counter */}
                  <div className="bg-black/40 rounded-lg p-6 mb-6 border-2 border-yellow-500/50">
                    <div className="flex items-center justify-center gap-8 mb-4">
                      <div>
                        <div className="text-5xl font-bold text-red-400">7</div>
                        <div className="text-sm text-gray-300">Slots Filled</div>
                      </div>
                      <div className="text-4xl text-yellow-400">/</div>
                      <div>
                        <div className="text-5xl font-bold text-green-400">10</div>
                        <div className="text-sm text-gray-300">Total Slots</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-yellow-200 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">Only 3 design partner slots remaining</span>
                    </div>
                  </div>

                  {/* What Design Partners Get */}
                  <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <CheckCircle2 className="h-6 w-6 text-green-400 mb-2" />
                      <div className="font-semibold text-white mb-1">90-Day Validation</div>
                      <div className="text-sm text-gray-300">Full platform access with dedicated success team</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <CheckCircle2 className="h-6 w-6 text-green-400 mb-2" />
                      <div className="font-semibold text-white mb-1">Priority Roadmap</div>
                      <div className="text-sm text-gray-300">Shape product features for your industry</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <CheckCircle2 className="h-6 w-6 text-green-400 mb-2" />
                      <div className="font-semibold text-white mb-1">Founding Pricing</div>
                      <div className="text-sm text-gray-300">Lock in lifetime partnership rates</div>
                    </div>
                  </div>

                  {/* Single Exclusive CTA */}
                  <Button 
                    size="lg"
                    onClick={() => setLocation("/contact")}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-xl px-12 py-8 shadow-2xl transform hover:scale-105 transition-all"
                    data-testid="button-design-partner"
                  >
                    <Target className="mr-3 h-6 w-6" />
                    Apply for Design Partner Program
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                  
                  <p className="text-sm text-gray-300 mt-4">
                    Executive intake form • 72-hour response • No commitment required
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prominent Demo and Playbook Links */}
          <div className="text-center mb-8">
            {/* Featured: Live Demo Selector */}
            <div className="mb-6">
              <Button 
                onClick={() => setLocation("/demo/selector")}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-lg px-10 py-6 shadow-2xl transform hover:scale-105 transition-all border-2 border-green-300"
                data-testid="button-live-demo-selector"
              >
                <Radio className="mr-3 h-6 w-6 animate-pulse" />
                Choose Your Live Demo
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <p className="text-xs text-green-300 mt-2 font-semibold">
                🎬 7 Interactive Scenarios • 12-minute live coordination • Perfect for presentations
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <Button 
                onClick={() => setLocation("/industry-demos")}
                variant="outline"
                size="lg"
                className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 font-semibold px-8"
                data-testid="button-view-demos"
              >
                <Rocket className="mr-2 h-5 w-5" />
                View 9 Industry Demos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                onClick={() => setLocation("/playbook-library")}
                variant="outline"
                size="lg"
                className="border-2 border-purple-400 text-purple-300 hover:bg-purple-400/10 font-semibold px-8"
                data-testid="button-view-playbooks"
              >
                <FileText className="mr-2 h-5 w-5" />
                Explore 166 Playbooks
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-sm text-blue-400">
              Or{" "}
              <button 
                onClick={() => setLocation("/demo")}
                className="underline hover:text-cyan-300 transition-colors"
                data-testid="link-watch-demo"
              >
                watch the 12-minute execution demo
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Complete Product Features - All Capabilities */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-base px-6 py-2">
              Complete Platform Access
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Explore All Product Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Complete platform ecosystem for championship-level execution. Click any feature to explore.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* 1. Create Playbook - PROMINENT */}
            <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:shadow-2xl transition-all duration-300 col-span-full lg:col-span-1" data-testid="card-create-playbook">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Create Strategic Playbook
                    </h3>
                    <Badge className="bg-purple-600 text-white mb-3">Start Here</Badge>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Build complete decision operations playbook in 5 phases: Context, Stakeholders, Triggers, Metrics, Review
                    </p>
                  </div>
                </div>
                <CreateScenarioButton organizationId="default-org" className="w-full" />
              </CardContent>
            </Card>

            {/* 2. AI Intelligence (5 Modules) */}
            <Card className="border-2 border-cyan-300 dark:border-cyan-700 hover:shadow-xl transition-all duration-300" data-testid="card-ai-intelligence">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      AI Intelligence Layer
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      5 specialized AI modules: Pulse, Flux, Prism, Echo, Nova for strategic insights
                    </p>
                  </div>
                </div>
                <Button onClick={() => setLocation('/ai')} variant="outline" className="w-full border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20" data-testid="button-ai-intelligence">
                  Explore AI Modules <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 3. 24/7 Monitoring */}
            <Card className="border-2 border-blue-300 dark:border-blue-700 hover:shadow-xl transition-all duration-300" data-testid="card-monitoring">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      24/7 Monitoring System
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Track 12 intelligence signals with AI-powered pattern recognition and proactive alerts
                    </p>
                  </div>
                </div>
                <Button onClick={() => setLocation('/ai-radar')} variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" data-testid="button-monitoring">
                  View AI Radar <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 4. Playbook Library */}
            <Card className="border-2 border-green-300 dark:border-green-700 hover:shadow-xl transition-all duration-300" data-testid="card-scenarios">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Playbook Library
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      166 strategic playbooks across 9 operational domains covering growth, defense, transformation, and AI governance
                    </p>
                  </div>
                </div>
                <Button onClick={() => setLocation('/playbook-library')} variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" data-testid="button-scenarios">
                  Browse Playbooks <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 5. What-If Analyzer */}
            <Card className="border-2 border-orange-300 dark:border-orange-700 hover:shadow-xl transition-all duration-300" data-testid="card-what-if">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      What-If Analyzer
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Test strategic approaches, simulate outcomes, and optimize execution plans
                    </p>
                  </div>
                </div>
                <Button onClick={() => setLocation('/what-if-analyzer')} variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20" data-testid="button-what-if">
                  Run Simulations <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* 6. Command Center */}
            <Card className="border-2 border-red-300 dark:border-red-700 hover:shadow-xl transition-all duration-300" data-testid="card-command-center">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Executive Command Center
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Real-time strategic coordination hub for 12-minute execution
                    </p>
                  </div>
                </div>
                <Button onClick={() => setLocation('/command-center')} variant="outline" className="w-full border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" data-testid="button-command-center">
                  Open War Room <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

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
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
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
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
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
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
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
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-500 text-slate-900 border-0 text-base px-6 py-2" data-testid="badge-framework">
              The Core Workflow
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              IDENTIFY → DETECT → EXECUTE → ADVANCE
            </h2>
            <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              This is the framework that wins championships—whether in Eugene, Oregon or in Fortune 1000 boardrooms. Four phases that transform strategic intent into coordinated organizational execution.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {/* Phase 1: IDENTIFY */}
            <Card className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-2 border-violet-500" data-testid="card-phase-identify">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-violet-500 text-white text-2xl font-bold mb-3">
                    I
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">IDENTIFY</h3>
                  <div className="text-violet-300 text-sm font-semibold mb-4">Build Your Depth Chart</div>
                </div>
                <p className="text-blue-100 text-sm mb-4">
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
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white text-2xl font-bold mb-3">
                    D
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">DETECT</h3>
                  <div className="text-blue-300 text-sm font-semibold mb-4">Monitor Signals</div>
                </div>
                <p className="text-blue-100 text-sm mb-4">
                  AI monitors competitive signals, customer patterns, operational metrics, and market shifts. Pattern recognition spots trigger conditions in real-time.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-blue-200">
                    <CheckCircle2 className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Competitive moves detected</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-200">
                    <CheckCircle2 className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Customer sentiment analyzed</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-200">
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
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500 text-white text-2xl font-bold mb-3">
                    E
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">EXECUTE</h3>
                  <div className="text-emerald-300 text-sm font-semibold mb-4">Execute Response</div>
                </div>
                <p className="text-blue-100 text-sm mb-4">
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
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-500 text-white text-2xl font-bold mb-3">
                    A
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">ADVANCE</h3>
                  <div className="text-amber-300 text-sm font-semibold mb-4">Review the Film</div>
                </div>
                <p className="text-blue-100 text-sm mb-4">
                  Capture what worked. Measure performance across all 12 operating model elements. Refine playbooks. Get better every execution.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-blue-200">
                    <CheckCircle2 className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Decision outcomes documented</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-200">
                    <CheckCircle2 className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Playbooks continuously improved</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-200">
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
                <p className="text-2xl font-bold text-white mb-3">
                  Elite organizations succeed through preparation, not improvisation.
                </p>
                <p className="text-xl text-blue-200">
                  M brings championship-level preparation to Fortune 1000 strategic operations: transforming 72-hour coordination into 12-minute execution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Scenarios Preview */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-blue-900 dark:from-slate-950 dark:to-blue-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-cyan-500 text-white border-0" data-testid="badge-scenarios">
              See It In Action
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              166 Strategic Playbook Library
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Enterprise-ready playbook templates across 9 operational domains. From market dynamics to technology innovation, talent leadership to AI governance—transform any strategic initiative from a 72-hour process into a 12-minute coordinated response.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-green-600/10 border-2 border-green-500" data-testid="card-market-dynamics">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Market Dynamics</h3>
                  <p className="text-green-200 text-xs">Competitive threats & opportunities</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-600/10 border-2 border-emerald-500" data-testid="card-financial-strategy">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Financial Strategy</h3>
                  <p className="text-emerald-200 text-xs">Capital allocation & risk management</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-600/10 border-2 border-blue-500" data-testid="card-operational-excellence">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Shield className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Operational Excellence</h3>
                  <p className="text-blue-200 text-xs">Supply chain & process optimization</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-600/10 border-2 border-purple-500" data-testid="card-technology-innovation">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Zap className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Technology & Innovation</h3>
                  <p className="text-purple-200 text-xs">Digital transformation & AI adoption</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-600/10 border-2 border-amber-500" data-testid="card-talent-leadership">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Users className="h-10 w-10 text-amber-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Talent & Leadership</h3>
                  <p className="text-amber-200 text-xs">Culture, workforce & succession</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-pink-600/10 border-2 border-pink-500" data-testid="card-brand-reputation">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Target className="h-10 w-10 text-pink-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Brand & Reputation</h3>
                  <p className="text-pink-200 text-xs">PR crises & stakeholder trust</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cyan-600/10 border-2 border-cyan-500" data-testid="card-regulatory-compliance">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Shield className="h-10 w-10 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Regulatory & Compliance</h3>
                  <p className="text-cyan-200 text-xs">Legal, regulatory & governance</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-indigo-600/10 border-2 border-indigo-500" data-testid="card-market-opportunities">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <Rocket className="h-10 w-10 text-indigo-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Market Opportunities</h3>
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
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              When your competitor launches a 15% price cut, here's how M coordinates your entire response team in 12 minutes—instead of the 72-hour industry standard.
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
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-lg px-10 py-6"
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
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              The gap between strategic planning and coordinated execution costs enterprises billions annually
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card data-testid="card-stat-coordination-time">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">72 hours</div>
                <div className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Industry Standard</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Average coordination time for strategic initiatives in Fortune 1000 companies
                </div>
                <div className="text-xs text-slate-500 italic">Source: HBR "Why Strategy Execution Unravels" (2015), McKinsey "Decision Making in the Age of Urgency" (2023)</div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-missed-opportunities">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">87%</div>
                <div className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Missed Windows</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Strategic initiatives that miss execution windows due to coordination delays
                </div>
                <div className="text-xs text-slate-500 italic">Source: Bain & Company "The Execution Premium" study (2022)</div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-vexor-target">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">12 min</div>
                <div className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">M Target</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Design goal: Coordinated execution with pre-built playbooks and AI orchestration
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800" data-testid="card-founding-vision">
            <CardContent className="pt-8 pb-8">
              <p className="text-xl italic text-slate-700 dark:text-slate-300 mb-4 text-center max-w-3xl mx-auto">
                "When strategic opportunities emerge, the companies that execute in days beat the companies that plan in weeks. M is purpose-built to close that gap."
              </p>
              <div className="text-center">
                <div className="font-semibold text-slate-900 dark:text-white">M Founding Team</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Bringing championship-level execution to enterprise strategy</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Strategic Execution?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 10 Fortune 1000 pilot companies in Q1 2025. 90-day validation partnership. Risk-free strategic implementation support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setLocation("/contact")}
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-6 font-semibold"
              data-testid="button-cta-contact"
            >
              Request Early Access
            </Button>
            <Button 
              size="lg"
              onClick={() => setLocation("/executive-demo")}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6"
              data-testid="button-cta-demo"
            >
              Experience Full Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
