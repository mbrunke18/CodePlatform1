import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Play,
  Clock,
  Target,
  Zap,
  BookOpen,
  Radar,
  Radio,
  BarChart3,
  Shield,
  Users,
  CheckCircle,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Layers,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Bot,
  Brain,
  Network,
  Activity,
  Check,
  X,
  Quote,
  Building2,
  Scale,
  UserCheck,
  Globe2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import VideoIntro from "@/components/marketing/VideoIntro";
import PlatformVisual from "@/components/marketing/PlatformVisual";

const INTRO_SEEN_KEY = "executeiq_intro_seen_session";

export default function Homepage() {
  const [, setLocation] = useLocation();
  const [showAllQuotes, setShowAllQuotes] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return true;
    const hasSeenIntro = sessionStorage.getItem(INTRO_SEEN_KEY);
    if (!hasSeenIntro) {
      sessionStorage.setItem(INTRO_SEEN_KEY, "true");
      return true;
    }
    return false;
  });

  const handleSkipIntro = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <VideoIntro onComplete={handleSkipIntro} onSkip={handleSkipIntro} />;
  }

  const phases = [
    {
      id: 'identify',
      phase: 'I',
      phaseName: 'Identify',
      title: 'Infrastructure Built in Advance',
      description: '166 playbooks across 9 strategic domains. Governance defined. Decision rights mapped. Roles assigned. All before the situation hits.',
      icon: BookOpen,
      color: 'from-violet-500 to-purple-600',
      borderColor: 'border-violet-200 hover:border-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/20',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      iconColor: 'text-violet-600 dark:text-violet-400',
      features: ['Pre-defined governance & decision rights', '166 Pre-built Playbooks', 'Stakeholder Accountability Mapping', 'Readiness Scoring'],
      primaryLink: '/playbook-library',
      primaryLabel: 'Browse Playbooks',
      stat: '"Governance must become real-time, embedded" — McKinsey'
    },
    {
      id: 'detect',
      phase: 'D',
      phaseName: 'Detect',
      title: 'Situation Triggers Response',
      description: 'A strategic moment hits—M&A, crisis, competitive threat. The infrastructure activates. The right playbook engages based on situational awareness.',
      icon: Radar,
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-200 hover:border-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      features: ['AI Signal-to-Playbook Matching', 'Competitive Intelligence Aggregation', 'Early Warning Dashboards', 'Human-Triggered Activation'],
      primaryLink: '/foresight-radar',
      primaryLabel: 'View Radar',
      stat: '"70% of AI transformation is people and processes" — Bain'
    },
    {
      id: 'execute',
      phase: 'E',
      phaseName: 'Execute',
      title: 'Coordination in 12 Minutes',
      description: 'Stakeholders notified. Tasks assigned with owners. Decision rights clear. Execution begins—not planning, execution.',
      icon: Radio,
      color: 'from-emerald-500 to-green-600',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      features: ['Pre-defined Decision Rights', 'Instant Stakeholder Coordination', 'Pre-approved Budget Release', 'Real-time Execution Tracking'],
      primaryLink: '/command-center',
      primaryLabel: 'Launch Command Center',
      stat: '"78% say AI requires a new operating model" — IBM'
    },
    {
      id: 'advance',
      phase: 'A',
      phaseName: 'Advance',
      title: 'Infrastructure Gets Smarter',
      description: 'Every execution builds proprietary intelligence. AI detects patterns, benchmarks outcomes, and refines playbooks automatically. Your execution capability compounds into an institutional advantage.',
      icon: BarChart3,
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-200 hover:border-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      features: ['Proprietary Intelligence Layer', 'Cross-Domain Pattern Detection', 'Outcome Benchmarking vs. Industry', 'Compounding Competitive Moat'],
      primaryLink: '/executive-dashboard',
      primaryLabel: 'View Dashboard',
      stat: '"Companies aligning AI + platforms achieve 2.2x growth" — Accenture'
    }
  ];

  const validationQuotes = [
    {
      quote: "78% of executives say achieving maximum benefit from agentic AI requires a new operating model.",
      source: "IBM",
      report: "Agentic AI Operating Model Report",
      color: "text-blue-400",
      borderColor: "border-blue-500/30"
    },
    {
      quote: "70% of AI transformation is people and processes—not technology.",
      source: "Bain",
      report: "Technology Report 2025",
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30"
    },
    {
      quote: "69% of executives agree: agentic AI requires fundamentally new management approaches.",
      source: "BCG",
      report: "Leading in the Age of AI Agents",
      color: "text-purple-400",
      borderColor: "border-purple-500/30"
    },
    {
      quote: "Governance must become real-time, data-driven, and embedded.",
      source: "McKinsey",
      report: "The Agentic Organization",
      color: "text-amber-400",
      borderColor: "border-amber-500/30"
    },
    {
      quote: "Companies that align AI, platforms, and business strategies achieve 2.2x revenue growth.",
      source: "Accenture",
      report: "Platform Strategy in the Age of Agentic AI",
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30"
    },
    {
      quote: "AI-native enterprises outperform peers by 3.5x on strategic execution speed.",
      source: "Forrester",
      report: "The AI-Native Enterprise 2026",
      color: "text-lime-400",
      borderColor: "border-lime-500/30"
    },
    {
      quote: "The limiting factors are now integration and governance, not capability.",
      source: "Anthropic",
      report: "State of AI Agents 2026",
      color: "text-rose-400",
      borderColor: "border-rose-500/30"
    },
    {
      quote: "The divide is between organizations that treat AI as workflow infrastructure and those that leave it as a side tool.",
      source: "OpenAI",
      report: "State of Enterprise AI",
      color: "text-indigo-400",
      borderColor: "border-indigo-500/30"
    },
    {
      quote: "AI transformation is shifting from CIO-led to CEO-led mandate across enterprises.",
      source: "Deloitte",
      report: "State of AI in the Enterprise 2026",
      color: "text-teal-400",
      borderColor: "border-teal-500/30"
    },
    {
      quote: "Readiness requires people, process, culture, and governance—not just technology.",
      source: "Microsoft",
      report: "Agents Are Here",
      color: "text-sky-400",
      borderColor: "border-sky-500/30"
    },
    {
      quote: "AI agents are being deployed across industries—but orchestration infrastructure determines outcomes.",
      source: "Google Cloud",
      report: "AI Agent Trends 2026",
      color: "text-green-400",
      borderColor: "border-green-500/30"
    },
    {
      quote: "Organizations must move from AI proof-of-concept to AI proof-of-impact at enterprise scale.",
      source: "World Economic Forum",
      report: "Proof over Promise 2026",
      color: "text-blue-300",
      borderColor: "border-blue-400/30"
    },
    {
      quote: "91% of organizations experienced major disruption—speed of coordinated response is the differentiator.",
      source: "PwC",
      report: "Global Crisis & Resilience Survey",
      color: "text-orange-400",
      borderColor: "border-orange-500/30"
    },
    {
      quote: "By 2027, 40% of enterprises will use AI orchestration platforms to coordinate cross-functional execution.",
      source: "Gartner",
      report: "Strategic Technology Trends 2026",
      color: "text-violet-400",
      borderColor: "border-violet-500/30"
    },
    {
      quote: "Enterprise AI spending will reach $632B by 2028—but ROI depends on operational infrastructure.",
      source: "IDC",
      report: "Worldwide AI Spending Guide 2026",
      color: "text-pink-400",
      borderColor: "border-pink-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <StandardNav />
      
      {/* Hero Section - Execution Infrastructure */}
      <section className="relative py-16 md:py-28 px-6 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#00A8A8]/20 border border-[#D4AF37]/30 mb-8">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium">Trigger-to-Execution Orchestration</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight" data-testid="heading-main">
              From Trigger to Coordinated Execution<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#00A8A8] to-emerald-400">
                In 12 Minutes
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-4 leading-relaxed" data-testid="text-insight">
              A strategic event hits—M&A, crisis, competitive threat. ExecuteIQ activates pre-built infrastructure: stakeholders notified, tasks assigned, decision rights clear, execution underway. Not in weeks. <span className="text-white font-semibold">In 12 minutes.</span>
            </p>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto mb-4">
              <span className="text-[#D4AF37] font-semibold">166 playbooks to start.</span> Pre-built governance. Clear decision rights. Coordinated execution across 50-200+ stakeholders.
              <span className="text-emerald-400 font-semibold"> From trigger to execution—not trigger to planning.</span>
            </p>
            <p className="text-base text-slate-300 max-w-2xl mx-auto mb-8 italic">
              Powered by AI that detects signals, matches playbooks, orchestrates responses, and learns from every execution.
            </p>
          </div>

          {/* Stats Bar - Research Validation */}
          <div className="bg-slate-800/50 rounded-2xl p-6 max-w-4xl mx-auto mb-10" data-testid="trust-bar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">78%</div>
                <div className="text-sm text-slate-200">of executives say AI requires a new operating model</div>
                <div className="text-xs text-slate-600 dark:text-slate-200 mt-1">IBM 2025</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">70%</div>
                <div className="text-sm text-slate-200">of AI transformation is people and processes</div>
                <div className="text-xs text-slate-600 dark:text-slate-200 mt-1">Bain 2025</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">69%</div>
                <div className="text-sm text-slate-200">agree AI requires new management approaches</div>
                <div className="text-xs text-slate-600 dark:text-slate-200 mt-1">BCG 2025</div>
              </div>
            </div>
            <div className="border-t border-slate-700 mt-4 pt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">72 hrs → 12 min</div>
                <div className="text-xs text-slate-300">Trigger to execution</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">70%</div>
                <div className="text-xs text-slate-300">Faster mobilization</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">50%</div>
                <div className="text-xs text-slate-300">Less decision latency</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">$2.4M</div>
                <div className="text-xs text-slate-300">Avg savings per transformation</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg" 
              onClick={() => setLocation('/how-it-works')}
              className="text-lg px-10 py-7 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 shadow-lg shadow-emerald-500/25"
              data-testid="button-try-demo"
            >
              <Play className="mr-2 h-5 w-5" />
              See How It Works
            </Button>
            <Button 
              size="lg" 
              onClick={() => setLocation('/playbook-library')}
              variant="outline"
              className="text-lg px-10 py-7 border-slate-500 text-white hover:bg-slate-800 bg-transparent"
              data-testid="button-explore"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Explore Playbooks
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button 
              size="lg" 
              onClick={() => setLocation('/incident-analyzer')}
              className="text-lg px-8 py-6 bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-amber-600 hover:to-[#D4AF37] shadow-lg shadow-amber-500/25 text-white"
              data-testid="button-incident-analyzer"
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              Try the Strategic Analyzer
            </Button>
            <Button 
              size="lg" 
              onClick={() => setLocation('/readiness-assessment')}
              variant="outline"
              className="text-lg px-8 py-6 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 bg-transparent"
              data-testid="button-readiness-assessment"
            >
              <Shield className="mr-2 h-5 w-5" />
              Check Your Readiness
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Visual - End-to-End Overview */}
      <section>
        <PlatformVisual />
      </section>

      {/* AI Intelligence Engine - How the AI Works */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-950/40 via-slate-950 to-emerald-950/40" data-testid="ai-engine-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-[#00A8A8]/20 text-[#00A8A8] border-[#00A8A8]/30">
              <Brain className="w-4 h-4 mr-2" />
              AI Intelligence Engine
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Intelligence That Compounds With Every Execution
            </h2>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto">
              ExecuteIQ's AI doesn't just automate — it detects, reasons, orchestrates, and learns. Every execution makes the next one faster and smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            <div className="hidden md:block absolute top-1/2 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-violet-500 via-blue-500 via-emerald-500 to-amber-500 -translate-y-1/2 z-0" />
            
            {[
              { icon: Radar, label: 'DETECT', desc: 'AI monitors signals across competitive, regulatory, and market landscapes', color: 'from-violet-500 to-purple-600', dotColor: 'bg-violet-500', phase: 'D' },
              { icon: Target, label: 'MATCH', desc: 'Pattern recognition maps signals to the right playbook from 166 options', color: 'from-blue-500 to-cyan-600', dotColor: 'bg-blue-500', phase: 'I' },
              { icon: Network, label: 'ORCHESTRATE', desc: 'AI coordinates stakeholders, assigns tasks, and triggers execution flows', color: 'from-emerald-500 to-green-600', dotColor: 'bg-emerald-500', phase: 'E' },
              { icon: Brain, label: 'LEARN', desc: 'Every outcome refines playbooks, building proprietary intelligence over time', color: 'from-amber-500 to-orange-600', dotColor: 'bg-amber-500', phase: 'A' },
            ].map((step, i) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center text-center px-4 py-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-xs font-bold text-slate-400 tracking-widest mb-1">{step.phase}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.label}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                {i < 3 && <ArrowRight className="md:hidden h-5 w-5 text-slate-600 mt-4" />}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-400">
              This is the <span className="text-[#00A8A8] font-semibold">IDEA Framework</span> — the continuous intelligence loop that powers every ExecuteIQ execution.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Problems Section - Pain → Cost → Solution → Value */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" data-testid="three-problems-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30" data-testid="badge-problems">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Three Problems. Billions Lost.
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Three Problems ExecuteIQ Was Built to Solve
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Every Fortune 1000 company faces these three problems. Until now, no infrastructure existed to solve them.
            </p>
          </div>

          <div className="space-y-8">
            {/* Problem 1: The Execution Gap */}
            <Card className="bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-red-500/40 transition-all" data-testid="problem-execution-gap">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Problem 1</Badge>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">The Execution Gap</h3>
                    <p className="text-slate-200 mb-4 leading-relaxed">
                      When a strategic moment hits—M&A, crisis, competitive threat—companies spend <span className="text-red-400 font-semibold">20-72 hours</span> just figuring out who needs to be involved and getting meetings scheduled. Execution hasn't even started.
                    </p>
                    <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-red-400 mb-2">Financial Impact:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-200"><span className="text-red-400 font-bold">$136K/hour</span> — cost of delayed ransomware response (IBM)</p>
                        <p className="text-sm text-slate-200"><span className="text-red-400 font-bold">$5-50M</span> — M&A synergy erosion per delayed integration</p>
                        <p className="text-sm text-slate-200"><span className="text-red-400 font-bold">24 hours</span> — before crisis causes market cap damage</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 lg:p-10 bg-emerald-950/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">How ExecuteIQ Solves It</Badge>
                      </div>
                    </div>
                    <p className="text-slate-200 mb-4 leading-relaxed">
                      Pre-built infrastructure activates in <span className="text-emerald-400 font-semibold">12 minutes</span>. Governance, decision rights, and playbooks are ready <span className="text-white font-semibold">before</span> the moment arrives. No scrambling. No ad-hoc meetings. Execution starts immediately.
                    </p>
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-emerald-400 mb-2">Value Delivered:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-200"><span className="text-emerald-400 font-bold">72 hours → 12 minutes</span> — from trigger to execution</p>
                        <p className="text-sm text-slate-200"><span className="text-emerald-400 font-bold">$9.8M saved</span> — per ransomware incident avoided</p>
                        <p className="text-sm text-slate-200"><span className="text-emerald-400 font-bold">166 playbooks</span> — ready to deploy on day one</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem 2: The Coordination Chaos */}
            <Card className="bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-amber-500/40 transition-all" data-testid="problem-coordination-chaos">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Problem 2</Badge>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">The Coordination Chaos</h3>
                    <p className="text-slate-200 mb-4 leading-relaxed">
                      A single strategic response can involve <span className="text-amber-400 font-semibold">50-200+ stakeholders</span> across legal, finance, operations, communications, and IT. Without a coordination system, teams work in silos, duplicate effort, and miss critical handoffs.
                    </p>
                    <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-amber-400 mb-2">Financial Impact:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-200"><span className="text-amber-400 font-bold">$4.88M</span> — average cost per data breach without coordination (IBM)</p>
                        <p className="text-sm text-slate-200"><span className="text-amber-400 font-bold">35% higher costs</span> — without pre-defined response teams</p>
                        <p className="text-sm text-slate-200"><span className="text-amber-400 font-bold">$2.2M more</span> — per incident vs. automated orchestration</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 lg:p-10 bg-emerald-950/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">How ExecuteIQ Solves It</Badge>
                      </div>
                    </div>
                    <p className="text-slate-200 mb-4 leading-relaxed">
                      Every playbook has <span className="text-emerald-400 font-semibold">pre-mapped stakeholder accountability</span>, instant notification, task assignment with clear owners, and real-time execution tracking. Everyone knows their assignment before the moment hits.
                    </p>
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-emerald-400 mb-2">Value Delivered:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-200"><span className="text-emerald-400 font-bold">Instant coordination</span> — across 50-200+ stakeholders simultaneously</p>
                        <p className="text-sm text-slate-200"><span className="text-emerald-400 font-bold">35% cost reduction</span> — with pre-defined response teams</p>
                        <p className="text-sm text-slate-200"><span className="text-emerald-400 font-bold">Zero ownership confusion</span> — decision rights mapped in advance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem 3: The Institutional Amnesia */}
            <Card className="bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-purple-500/40 transition-all" data-testid="problem-institutional-amnesia">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Brain className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">Problem 3</Badge>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">The Institutional Amnesia</h3>
                    <p className="text-slate-200 mb-4 leading-relaxed">
                      Companies handle crises, integrations, and competitive responses—then the knowledge <span className="text-purple-400 font-semibold">walks out the door</span>. The next time a similar situation hits, they start from scratch. The same 72-hour scramble. Every single time.
                    </p>
                    <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-purple-400 mb-2">Financial Impact:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-200"><span className="text-purple-400 font-bold">3.5 disruptions</span> — every two years per organization (PwC)</p>
                        <p className="text-sm text-slate-200"><span className="text-purple-400 font-bold">$4.88M repeated</span> — same cost, same scramble, every time</p>
                        <p className="text-sm text-slate-200"><span className="text-purple-400 font-bold">Zero improvement</span> — 10th response as slow as the 1st</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 lg:p-10 bg-emerald-950/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">How ExecuteIQ Solves It</Badge>
                      </div>
                    </div>
                    <p className="text-slate-200 mb-4 leading-relaxed">
                      The ADVANCE phase captures outcomes from every execution, conducts <span className="text-emerald-400 font-semibold">AI-powered analysis</span>, suggests playbook refinements, and builds institutional intelligence that <span className="text-white font-semibold">compounds over time</span>. Your organization gets smarter with every execution.
                    </p>
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-emerald-400 mb-2">Value Delivered:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-200"><span className="text-emerald-400 font-bold">Compounding intelligence</span> — every execution makes the next one faster</p>
                        <p className="text-sm text-slate-200"><span className="text-emerald-400 font-bold">AI-powered refinement</span> — playbooks improve automatically</p>
                        <p className="text-sm text-slate-200"><span className="text-emerald-400 font-bold">Institutional memory</span> — knowledge stays, even when people leave</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payback Summary */}
          <div className="mt-12 text-center bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-2xl p-8 border border-emerald-500/30" data-testid="payback-summary">
            <p className="text-2xl text-white mb-2 font-bold">
              <span className="text-emerald-400">ExecuteIQ at $250K-$750K/year</span> vs. one incident costing <span className="text-red-400">$5-50M</span>.
            </p>
            <p className="text-lg text-slate-200 mb-4">
              Payback on first use. Protection that compounds with every execution after.
            </p>
            <p className="text-sm text-slate-300 mt-2">
              12 minutes = trigger-to-coordinated-execution. Deploy ExecuteIQ itself in weeks, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button 
                size="lg" 
                onClick={() => setLocation('/how-it-works')}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
              >
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
              <Button 
                size="lg" 
                onClick={() => setLocation('/research')}
                variant="outline"
                className="border-slate-500 text-white hover:bg-slate-800 bg-transparent"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                View the Research
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Validation Section - Industry Research */}
      <section className="py-20 bg-white dark:bg-background" data-testid="validation-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Industry Consensus
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What the Research Says
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-200 max-w-3xl mx-auto mb-6">
              These aren't our claims. This is what the world's top consulting, technology, and research firms independently concluded.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['IBM', 'BCG', 'McKinsey', 'Bain', 'Accenture', 'Deloitte', 'PwC', 'Gartner', 'Forrester', 'IDC', 'Microsoft', 'Google Cloud', 'OpenAI', 'Anthropic', 'World Economic Forum'].map((firm) => (
                <span key={firm} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">{firm}</span>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {validationQuotes.slice(0, 6).map((item, index) => (
              <Card key={index} className={`border ${item.borderColor} bg-slate-50 dark:bg-slate-900/50 hover:shadow-lg transition-all`} data-testid={`validation-quote-${index}`}>
                <CardContent className="p-6">
                  <Quote className={`h-6 w-6 ${item.color} mb-3 opacity-60`} />
                  <p className="text-slate-700 dark:text-slate-200 mb-4 italic leading-relaxed">
                    "{item.quote}"
                  </p>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className={`font-bold ${item.color}`}>{item.source}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-200">{item.report}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {showAllQuotes && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
              {validationQuotes.slice(6).map((item, index) => (
                <Card key={index + 6} className={`border ${item.borderColor} bg-slate-50 dark:bg-slate-900/50 hover:shadow-lg transition-all`} data-testid={`validation-quote-${index + 6}`}>
                  <CardContent className="p-6">
                    <Quote className={`h-6 w-6 ${item.color} mb-3 opacity-60`} />
                    <p className="text-slate-700 dark:text-slate-200 mb-4 italic leading-relaxed">
                      "{item.quote}"
                    </p>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className={`font-bold ${item.color}`}>{item.source}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-200">{item.report}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mb-6">
            <Button
              variant="outline"
              onClick={() => setShowAllQuotes(!showAllQuotes)}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {showAllQuotes ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  See All 15 Research Findings
                </>
              )}
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              15 independent reports. One conclusion: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">ExecuteIQ is what they're describing.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Why 2026 Is Different - Research Validation */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
              2026 Research Consensus
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              2026: The Year AI Became Enterprise Infrastructure
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              8 flagship reports from the world's top consulting firms converge on 3 signals that validate ExecuteIQ's thesis: the bottleneck isn't AI capability—it's execution infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            <Card className="bg-slate-900/80 border-blue-500/30 hover:border-blue-400/60 transition-all">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-4 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <Brain className="h-7 w-7 text-blue-400" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">Signal 1</Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Agentic AI → Enterprise Infrastructure</h3>
                <p className="text-slate-200 mb-4 leading-relaxed">
                  Every major firm now agrees: AI agents are moving from experimentation to core enterprise infrastructure. But 78% of executives say this shift requires an entirely new operating model.
                </p>
                <div className="p-3 bg-slate-800/80 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-400">
                    <span className="font-semibold">ExecuteIQ Connection:</span> We provide the operating model—governance, decision rights, and coordination—that makes agentic AI operational, not experimental.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-emerald-500/30 hover:border-emerald-400/60 transition-all">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-4 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Network className="h-7 w-7 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">Signal 2</Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Redesign Work, Not Layer Automation</h3>
                <p className="text-slate-200 mb-4 leading-relaxed">
                  McKinsey and Deloitte conclude that layering AI on existing workflows fails. The winners are redesigning how work gets done—rebuilding processes from the ground up around speed and coordination.
                </p>
                <div className="p-3 bg-slate-800/80 rounded-lg border border-emerald-500/20">
                  <p className="text-sm text-emerald-400">
                    <span className="font-semibold">ExecuteIQ Connection:</span> Our 12-minute execution model doesn't automate the old 72-hour process. It replaces it with pre-built infrastructure that activates instantly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-amber-500/30 hover:border-amber-400/60 transition-all">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-4 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                  <Shield className="h-7 w-7 text-amber-400" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">Signal 3</Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Data Foundations & Governance Enable Speed</h3>
                <p className="text-slate-200 mb-4 leading-relaxed">
                  Google Cloud, IBM, and the World Economic Forum all emphasize: without governance frameworks and data foundations in place, AI deployments stall. Speed requires structure.
                </p>
                <div className="p-3 bg-slate-800/80 rounded-lg border border-amber-500/20">
                  <p className="text-sm text-amber-400">
                    <span className="font-semibold">ExecuteIQ Connection:</span> The IDEA Framework (Identify → Detect → Execute → Advance) embeds governance, accountability, and learning into every execution cycle.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-slate-300 uppercase tracking-wider font-medium mb-4">Sources: 8 Flagship Reports</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['BCG', 'IBM', 'McKinsey', 'Deloitte', 'World Economic Forum', 'Microsoft', 'Google Cloud', 'Accenture'].map((firm) => (
              <div key={firm} className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2">
                <span className="text-sm text-slate-200 font-medium">{firm}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section - A Platform, Not a Fixed Product */}
      <section className="py-20 bg-white dark:bg-background" data-testid="platform-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">
              Platform, Not Product
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              A Platform, Not a Fixed Product
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">
              ExecuteIQ isn't a rigid system. It's infrastructure you can adapt.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <Card className="border-2 border-slate-200 dark:border-slate-700 hover:border-[#D4AF37]/50 transition-all hover:shadow-xl" data-testid="platform-card-start">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-4 bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Don't Start From Scratch</h3>
                <p className="text-slate-700 dark:text-slate-200 mb-4">
                  166 playbooks across 9 strategic domains—M&A, crisis, competitive response, digital transformation, and more. Built from 20 years of Fortune 500 execution experience. Ready to deploy on day one.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all hover:shadow-xl" data-testid="platform-card-customize">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Layers className="h-7 w-7 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Make Them Yours</h3>
                <p className="text-slate-700 dark:text-slate-200 mb-4">
                  Every playbook is fully customizable. Adjust roles. Modify sequences. Change triggers. Your organization is unique. Your infrastructure should be too.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-xl" data-testid="platform-card-build">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-4 bg-purple-500/10 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="h-7 w-7 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create From Scratch</h3>
                <p className="text-slate-700 dark:text-slate-200 mb-4">
                  Face a situation we haven't covered? Build your own playbook. Your institutional knowledge, encoded into executable infrastructure—ready to activate when that situation hits again.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              The playbooks are the accelerant. <span className="text-[#D4AF37]">The platform is the product.</span>
            </p>
          </div>
        </div>
      </section>


      {/* IDEA Framework Section */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600" data-testid="badge-methodology">
              The IDEA Framework™
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-phases">
              From Situation to Execution in 12 Minutes
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">
              Execution infrastructure works because it's ready before the moment arrives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((phase) => (
              <Card 
                key={phase.id}
                className={`${phase.borderColor} ${phase.bgColor} cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}
                onClick={() => setLocation(phase.primaryLink)}
                data-testid={`card-phase-${phase.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${phase.iconBg} flex items-center justify-center`}>
                      <span className={`text-xl font-bold ${phase.iconColor}`}>{phase.phase}</span>
                    </div>
                    <div>
                      <Badge variant="outline" className={`${phase.iconColor} border-current text-xs font-bold`}>
                        {phase.phaseName}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-600 dark:text-slate-200 transition-colors">
                    {phase.title}
                  </h3>
                  
                  <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">
                    {phase.description}
                  </p>
                  
                  <ul className="space-y-2 mb-4">
                    {phase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <CheckCircle className={`h-4 w-4 ${phase.iconColor}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-between ${phase.iconColor} hover:bg-white/50 dark:hover:bg-slate-800/50`}
                  >
                    {phase.primaryLabel}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" data-testid="founder-section">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
              The Founder
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built by Someone Who's Lived Both Worlds
            </h2>
          </div>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 md:p-10">
              <p className="text-lg text-slate-200 leading-relaxed mb-6">
                I coached college football for 5 years. Every game, 60-80 plays. Every 40 seconds—read the situation, call the play, execute. The speed comes from preparation. Playbooks built before the season. Everyone knows their assignment before the moment.
              </p>
              <p className="text-lg text-slate-200 leading-relaxed mb-6">
                Then I spent 20 years inside Fortune 500 companies—Ford, Toyota, Lockheed Martin, Boyd Gaming, Churchill Downs, Charles Schwab. Same caliber of people. No playbooks. Every strategic moment handled ad-hoc.
              </p>
              <p className="text-lg text-slate-200 leading-relaxed mb-6">
                I watched the same pattern every time: <span className="text-red-400 font-medium">72 hours getting meetings on calendars, still defining who owns what.</span> After 72 hours—maybe a plan. Execution hasn't started.
              </p>
              <p className="text-lg text-white font-semibold mb-6">
                15 major firms just said execution infrastructure is the bottleneck. I built the infrastructure I wish I'd had.
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-slate-700">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                  MB
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Martin Brunke</p>
                  <p className="text-amber-400 text-sm">Founder & CEO</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 9 Strategic Domains */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600" data-testid="badge-coverage">
              Complete Coverage
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-coverage">
              9 Strategic Domains. 166 Playbooks.
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">
              Pre-defined governance, clear decision rights, and coordination pre-built for every strategic scenario your organization will face.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700/50 hover:shadow-xl transition-all" data-testid="card-offense">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Offense</h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Seize Opportunities</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">Market Entry & Expansion</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">22</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">M&A Integration</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">16</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">Product Launch</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">20</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-emerald-200 dark:border-emerald-700/50">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">58 <span className="text-sm font-normal text-slate-600 dark:text-slate-200">playbooks</span></p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-700/50 hover:shadow-xl transition-all" data-testid="card-defense">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Defense</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Protect Value</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">Crisis Response</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">Cyber Incidents</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">Regulatory Compliance</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">14</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-200 dark:border-blue-700/50">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">56 <span className="text-sm font-normal text-slate-600 dark:text-slate-200">playbooks</span></p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200 dark:border-purple-700/50 hover:shadow-xl transition-all" data-testid="card-special-teams">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Special Teams</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Change the Game</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">Digital Transformation</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">20</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">Competitive Response</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">14</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">AI Governance</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">18</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-purple-200 dark:border-purple-700/50">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">52 <span className="text-sm font-normal text-slate-600 dark:text-slate-200">playbooks</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              size="lg"
              onClick={() => setLocation('/playbook-library')}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-lg px-8 py-6"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Explore All 166 Playbooks
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enterprise Integration Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" data-testid="enterprise-integration-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Network className="w-4 h-4 mr-2" />
              Enterprise Integration
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Connects to What You Already Use
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              ExecuteIQ doesn't replace your tools. It orchestrates them. Your teams keep working where they already work—ExecuteIQ makes them move faster and in coordination.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-slate-900/80 border-slate-700 hover:border-cyan-500/40 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-4 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Identity & Access</h3>
                <p className="text-sm text-slate-200 mb-3">
                  SSO via your existing identity provider. When a playbook says "notify Legal," the system already knows who that is—pulled from your directory.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Active Directory', 'Azure AD', 'Okta', 'SAML/OIDC'].map(tool => (
                    <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">{tool}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 hover:border-cyan-500/40 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-4 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Project Management</h3>
                <p className="text-sm text-slate-200 mb-3">
                  When a playbook executes, tasks are created in your team's existing tools—not ours. ExecuteIQ orchestrates; your teams execute where they already live.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Jira', 'Azure DevOps', 'Monday.com', 'Asana', 'ServiceNow'].map(tool => (
                    <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{tool}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 hover:border-cyan-500/40 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Communication</h3>
                <p className="text-sm text-slate-200 mb-3">
                  Notifications and escalations go through existing channels. The 12-minute execution window works because you're not asking people to check a new tool.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Slack', 'Microsoft Teams', 'Outlook', 'Google Workspace'].map(tool => (
                    <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">{tool}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 hover:border-cyan-500/40 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-4 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Security & Monitoring</h3>
                <p className="text-sm text-slate-200 mb-3">
                  Your SIEM alerts and monitoring tools become trigger sources for the DETECT phase. A security event feeds directly into signal detection—no manual input required.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Splunk', 'CloudWatch', 'Datadog', 'CrowdStrike'].map(tool => (
                    <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">{tool}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 hover:border-cyan-500/40 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-4 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">CRM & ERP</h3>
                <p className="text-sm text-slate-200 mb-3">
                  Customer impact data, deal intelligence, and operational metrics feed into playbook decisions—connecting strategic execution to business reality.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Salesforce', 'HubSpot', 'SAP', 'Workday'].map(tool => (
                    <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">{tool}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 hover:border-cyan-500/40 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-4 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <Globe2 className="h-6 w-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Document & Knowledge</h3>
                <p className="text-sm text-slate-200 mb-3">
                  Playbook templates, post-incident reports, and board communications are staged in your company's existing document system—nothing to migrate.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['SharePoint', 'Google Drive', 'Confluence', 'Box'].map(tool => (
                    <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">{tool}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 hover:border-cyan-500/40 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-4 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Enterprise SSO & IAM</h3>
                <p className="text-sm text-slate-200 mb-3">
                  Enterprise-grade authentication through your existing identity provider. Single sign-on means your teams access ExecuteIQ through the same credentials they use for everything else.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Azure AD', 'Okta', 'Ping Identity', 'SAML 2.0', 'OIDC'].map(tool => (
                    <span key={tool} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{tool}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-cyan-900/30 via-blue-900/20 to-cyan-900/30 rounded-2xl p-8 border border-cyan-500/20 text-center">
            <h3 className="text-xl font-bold text-white mb-3">Zero Behavior Change Required</h3>
            <p className="text-slate-200 max-w-2xl mx-auto mb-4">
              IT connects your tools once during onboarding. From that point, ExecuteIQ auto-syncs your org chart from Active Directory, routes tasks to Jira, sends alerts through Slack, and stages documents in SharePoint. Your people keep using their existing tools—ExecuteIQ just makes those tools move faster and in coordination.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span className="text-slate-200">One-time IT setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span className="text-slate-200">Auto directory sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span className="text-slate-200">OAuth2 secured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agentic Integration Architecture */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
              <Bot className="w-4 h-4 mr-2" />
              Agentic Execution Architecture
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Coordination Layer for the Agentic Enterprise
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              AI agents are getting faster. Human coordination isn't. ExecuteIQ bridges the gap—activating playbooks when AI detects strategic moments, coordinating human decisions in minutes, and orchestrating execution across AI and human roles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="relative bg-gradient-to-br from-blue-900/40 to-slate-900/80 rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/20">AVAILABLE NOW</span>
              </div>
              <div className="w-12 h-12 mb-4 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI-Triggered Playbooks</h3>
              <p className="text-sm text-slate-200 mb-4">
                External AI systems—security tools, market monitors, ERP alerts—trigger ExecuteIQ playbooks automatically. No manual detection. No delayed response.
              </p>
              <div className="space-y-2 mb-4">
                {[
                  'CrowdStrike detects anomaly → Ransomware Response activates',
                  'Market monitor spots price shift → Competitive Response activates',
                  'Regulatory filing detected → Compliance playbook activates'
                ].map((example, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                    <span>{example}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Webhooks', 'Event API', '400+ Connectors'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">{tag}</span>
                ))}
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-purple-900/40 to-slate-900/80 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20">IN DEVELOPMENT</span>
              </div>
              <div className="w-12 h-12 mb-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI-Assisted Coordination</h3>
              <p className="text-sm text-slate-200 mb-4">
                AI agents embedded within ExecuteIQ handle preparation work—context gathering, communication drafting, blocker detection—so humans focus purely on decisions.
              </p>
              <div className="space-y-2 mb-4">
                {[
                  'AI summarizes situation context from multiple sources',
                  'AI drafts stakeholder communications for human approval',
                  'AI monitors execution and flags delays in real-time'
                ].map((example, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <ArrowRight className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                    <span>{example}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Context Engine', 'Smart Drafting', 'Blocker Detection'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">{tag}</span>
                ))}
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-amber-900/40 to-slate-900/80 rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/20">VISION</span>
              </div>
              <div className="w-12 h-12 mb-4 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Human-AI Hybrid Playbooks</h3>
              <p className="text-sm text-slate-200 mb-4">
                The first execution platform where AI agents and human leaders run the same playbook. AI handles research, analysis, and drafting. Humans own decisions and approvals.
              </p>
              <div className="space-y-2 mb-4">
                {[
                  'AI Agent: Pull docs, summarize risks, draft communications',
                  'Human (CFO): Approve integration priorities and budgets',
                  'AI Agent: Generate access requests, track completion'
                ].map((example, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <ArrowRight className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                    <span>{example}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Multi-Agent', 'Human-in-Loop', 'Decision Authority'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-indigo-900/30 rounded-2xl p-8 border border-indigo-500/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">The Agentic Execution Layer</h3>
                <p className="text-slate-200 mb-4">
                  ExecuteIQ sits between AI systems and human decision-makers—the coordination layer the agentic enterprise is missing. As AI capabilities accelerate, the bottleneck shifts to human alignment and action. That's the problem we solve.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-slate-900/60 rounded-xl border border-slate-700">
                    <Bot className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">AI Agents</div>
                    <div className="text-[10px] text-slate-400">Detect & Prepare</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-900/40 rounded-xl border border-indigo-500/30">
                    <Layers className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-indigo-300">ExecuteIQ</div>
                    <div className="text-[10px] text-slate-400">Orchestrate & Coordinate</div>
                  </div>
                  <div className="text-center p-3 bg-slate-900/60 rounded-xl border border-slate-700">
                    <UserCheck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">Human Leaders</div>
                    <div className="text-[10px] text-slate-400">Decide & Own</div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  {[
                    { current: 'Execution infrastructure for humans', enhanced: 'Execution infrastructure for the agentic enterprise' },
                    { current: '72 hrs → 12 min (human coordination)', enhanced: 'AI detects in seconds, humans decide in minutes' },
                    { current: '166 playbooks', enhanced: '166 playbooks with AI + human roles' },
                    { current: 'Competes with: consultants, ServiceNow', enhanced: 'New category: no direct competitor' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 text-xs text-slate-500 line-through">{row.current}</div>
                      <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                      <div className="flex-1 text-xs text-indigo-300 font-medium">{row.enhanced}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to See It in Action?
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-200 mb-8 max-w-2xl mx-auto">
            Experience how ExecuteIQ transforms a strategic moment into coordinated 12-minute execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => setLocation('/try-demo')}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
              data-testid="button-try-demo-cta"
            >
              <Play className="h-5 w-5 mr-2" />
              Try Interactive Demo
            </Button>
            <Button 
              onClick={() => setLocation('/contact')}
              className="bg-[#D4AF37] hover:bg-amber-500 text-slate-900 px-8 py-6 text-lg"
              data-testid="button-start-pilot"
            >
              Start Pilot Program
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-200 mt-6">
            Q1 2026 Founding Partner Program
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}