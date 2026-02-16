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
  ExternalLink
} from "lucide-react";
import { useLocation, Link } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import VideoIntro from "@/components/marketing/VideoIntro";
import PlatformVisual from "@/components/marketing/PlatformVisual";

const INTRO_SEEN_KEY = "executeiq_intro_seen_session";

export default function Homepage() {
  const [, setLocation] = useLocation();
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
      description: 'Every execution generates data. What worked? Where were the bottlenecks? The infrastructure learns and improves. Your execution capability compounds over time.',
      icon: BarChart3,
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-200 hover:border-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      features: ['AI Playbook Refinement', 'Cross-Playbook Learning', 'Performance Benchmarking', 'Compounding Improvement'],
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
    },
    {
      quote: "AI-native enterprises outperform peers by 3.5x on strategic execution speed.",
      source: "Forrester",
      report: "The AI-Native Enterprise 2026",
      color: "text-lime-400",
      borderColor: "border-lime-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <StandardNav />
      
      {/* Hero Section - Execution Infrastructure */}
      <section className="relative py-16 md:py-28 px-6 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#00A8A8]/20 border border-[#D4AF37]/30 mb-8">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium">The Execution Infrastructure Layer</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight" data-testid="heading-main">
              The Execution Infrastructure<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#00A8A8] to-emerald-400">
                Enterprises Are Missing
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed" data-testid="text-insight">
              15 major firms just concluded: organizations aren't failing at AI because of technology—they're failing because they lack <span className="text-white font-semibold">governance, decision rights, and coordination systems</span>. ExecuteIQ provides that infrastructure.
            </p>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-8">
              <span className="text-[#D4AF37] font-semibold">166 playbooks to start.</span> Customize them. Build your own.
              Pre-defined governance, clear decision rights, coordinated execution.
              <span className="text-emerald-400 font-semibold"> In 12 minutes, execution begins—not planning, execution.</span>
            </p>
          </div>

          {/* Stats Bar - Research Validation */}
          <div className="bg-slate-800/50 rounded-2xl p-6 max-w-4xl mx-auto mb-10" data-testid="trust-bar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">78%</div>
                <div className="text-sm text-slate-300">of executives say AI requires a new operating model</div>
                <div className="text-xs text-slate-600 dark:text-slate-200 mt-1">IBM 2025</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">70%</div>
                <div className="text-sm text-slate-300">of AI transformation is people and processes</div>
                <div className="text-xs text-slate-600 dark:text-slate-200 mt-1">Bain 2025</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">69%</div>
                <div className="text-sm text-slate-300">agree AI requires new management approaches</div>
                <div className="text-xs text-slate-600 dark:text-slate-200 mt-1">BCG 2025</div>
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
              Try the Incident Analyzer
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
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
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
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      When a strategic moment hits—M&A, crisis, competitive threat—companies spend <span className="text-red-400 font-semibold">20-72 hours</span> just figuring out who needs to be involved and getting meetings scheduled. Execution hasn't even started.
                    </p>
                    <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-red-400 mb-2">Financial Impact:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300"><span className="text-red-400 font-bold">$136K/hour</span> — cost of delayed ransomware response (IBM)</p>
                        <p className="text-sm text-slate-300"><span className="text-red-400 font-bold">$5-50M</span> — M&A synergy erosion per delayed integration</p>
                        <p className="text-sm text-slate-300"><span className="text-red-400 font-bold">24 hours</span> — before crisis causes market cap damage</p>
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
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      Pre-built infrastructure activates in <span className="text-emerald-400 font-semibold">12 minutes</span>. Governance, decision rights, and playbooks are ready <span className="text-white font-semibold">before</span> the moment arrives. No scrambling. No ad-hoc meetings. Execution starts immediately.
                    </p>
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-emerald-400 mb-2">Value Delivered:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">72 hours → 12 minutes</span> — from trigger to execution</p>
                        <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">$9.8M saved</span> — per ransomware incident avoided</p>
                        <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">166 playbooks</span> — ready to deploy on day one</p>
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
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      A single strategic response can involve <span className="text-amber-400 font-semibold">50-200+ stakeholders</span> across legal, finance, operations, communications, and IT. Without a coordination system, teams work in silos, duplicate effort, and miss critical handoffs.
                    </p>
                    <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-amber-400 mb-2">Financial Impact:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300"><span className="text-amber-400 font-bold">$4.88M</span> — average cost per data breach without coordination (IBM)</p>
                        <p className="text-sm text-slate-300"><span className="text-amber-400 font-bold">35% higher costs</span> — without pre-defined response teams</p>
                        <p className="text-sm text-slate-300"><span className="text-amber-400 font-bold">$2.2M more</span> — per incident vs. automated orchestration</p>
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
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      Every playbook has <span className="text-emerald-400 font-semibold">pre-mapped stakeholder accountability</span>, instant notification, task assignment with clear owners, and real-time execution tracking. Everyone knows their assignment before the moment hits.
                    </p>
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-emerald-400 mb-2">Value Delivered:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">Instant coordination</span> — across 50-200+ stakeholders simultaneously</p>
                        <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">35% cost reduction</span> — with pre-defined response teams</p>
                        <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">Zero ownership confusion</span> — decision rights mapped in advance</p>
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
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      Companies handle crises, integrations, and competitive responses—then the knowledge <span className="text-purple-400 font-semibold">walks out the door</span>. The next time a similar situation hits, they start from scratch. The same 72-hour scramble. Every single time.
                    </p>
                    <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-purple-400 mb-2">Financial Impact:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300"><span className="text-purple-400 font-bold">3.5 disruptions</span> — every two years per organization (PwC)</p>
                        <p className="text-sm text-slate-300"><span className="text-purple-400 font-bold">$4.88M repeated</span> — same cost, same scramble, every time</p>
                        <p className="text-sm text-slate-300"><span className="text-purple-400 font-bold">Zero improvement</span> — 10th response as slow as the 1st</p>
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
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      The ADVANCE phase captures outcomes from every execution, conducts <span className="text-emerald-400 font-semibold">AI-powered analysis</span>, suggests playbook refinements, and builds institutional intelligence that <span className="text-white font-semibold">compounds over time</span>. Your organization gets smarter with every execution.
                    </p>
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-emerald-400 mb-2">Value Delivered:</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">Compounding intelligence</span> — every execution makes the next one faster</p>
                        <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">AI-powered refinement</span> — playbooks improve automatically</p>
                        <p className="text-sm text-slate-300"><span className="text-emerald-400 font-bold">Institutional memory</span> — knowledge stays, even when people leave</p>
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
            <p className="text-lg text-slate-300 mb-4">
              Payback on first use. Protection that compounds with every execution after.
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

      {/* Validation Section - What 15 Major Firms Are Saying */}
      <section className="py-20 bg-white dark:bg-slate-950" data-testid="validation-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Industry Consensus
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What 15 Major Firms Are Saying
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-6">
              These aren't our claims. This is what the world's top consulting, technology, and research firms independently concluded.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['IBM', 'BCG', 'McKinsey', 'Bain', 'Accenture', 'Deloitte', 'PwC', 'Gartner', 'Forrester', 'IDC', 'Microsoft', 'Google Cloud', 'OpenAI', 'Anthropic', 'World Economic Forum'].map((firm) => (
                <span key={firm} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">{firm}</span>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {validationQuotes.map((item, index) => (
              <Card key={index} className={`border ${item.borderColor} bg-slate-50 dark:bg-slate-900/50 hover:shadow-lg transition-all`} data-testid={`validation-quote-${index}`}>
                <CardContent className="p-6">
                  <Quote className={`h-6 w-6 ${item.color} mb-3 opacity-60`} />
                  <p className="text-slate-700 dark:text-slate-300 mb-4 italic leading-relaxed">
                    "{item.quote}"
                  </p>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className={`font-bold ${item.color}`}>{item.source}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{item.report}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              They're all describing what ExecuteIQ provides.
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
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
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
                <p className="text-slate-300 mb-4 leading-relaxed">
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
                <p className="text-slate-300 mb-4 leading-relaxed">
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
                <p className="text-slate-300 mb-4 leading-relaxed">
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
            <p className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-4">Sources: 8 Flagship Reports</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['BCG', 'IBM', 'McKinsey', 'Deloitte', 'World Economic Forum', 'Microsoft', 'Google Cloud', 'Accenture'].map((firm) => (
              <div key={firm} className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2">
                <span className="text-sm text-slate-300 font-medium">{firm}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section - A Platform, Not a Fixed Product */}
      <section className="py-20 bg-white dark:bg-slate-950" data-testid="platform-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">
              Platform, Not Product
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              A Platform, Not a Fixed Product
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
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
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  166 playbooks across 9 strategic domains—M&A, crisis, competitive response, digital transformation, and more. Built from 25 years of Fortune 500 execution experience. Ready to deploy on day one.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all hover:shadow-xl" data-testid="platform-card-customize">
              <CardContent className="p-8">
                <div className="w-14 h-14 mb-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Layers className="h-7 w-7 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Make Them Yours</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
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
                <p className="text-slate-700 dark:text-slate-300 mb-4">
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
            <Badge className="mb-4 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600" data-testid="badge-methodology">
              The IDEA Framework™
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-phases">
              From Situation to Execution in 12 Minutes
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
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
                  
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    {phase.description}
                  </p>
                  
                  <ul className="space-y-2 mb-4">
                    {phase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
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

      {/* Industry Consensus */}
      <section className="py-12 px-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950">
        <div className="max-w-5xl mx-auto">
          <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Agentic AI Convergence</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              In the last 6 months, <span className="text-emerald-400">12 major guides</span> from <span className="text-emerald-400">9 leading firms</span> have confirmed this gap.
            </h3>
            <p className="text-slate-300 max-w-3xl mx-auto mb-4">
              McKinsey, IBM, BCG, Bain, PwC, Accenture, Deloitte, AWS, and World Economic Forum — all independently published research pointing at the same conclusion: enterprises need execution infrastructure to operationalize AI.
            </p>
            <p className="text-emerald-400 font-semibold">
              Every firm is consulting on the problem. ExecuteIQ built the product.
            </p>
            <div className="mt-4">
              <Link href="/research">
                <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 bg-transparent">
                  See the Full Research
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
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
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                I coached college football for 5 years. Every game, 60-80 plays. Every 40 seconds—read the situation, call the play, execute. The speed comes from preparation. Playbooks built before the season. Everyone knows their assignment before the moment.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Then I spent 20 years inside Fortune 500 companies—Ford, Toyota, Lockheed Martin, Eli Lilly, Boyd Gaming, Churchill Downs. Same caliber of people. No playbooks. Every strategic moment handled ad-hoc.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
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
                  <p className="font-bold text-white text-lg">Marty Brunke</p>
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
            <Badge className="mb-4 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600" data-testid="badge-coverage">
              Complete Coverage
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-coverage">
              9 Strategic Domains. 166 Playbooks.
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
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
                    <span className="text-slate-700 dark:text-slate-300">Market Entry & Expansion</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">22</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">M&A Integration</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">16</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">Product Launch</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">20</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-emerald-200 dark:border-emerald-700/50">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">58 <span className="text-sm font-normal text-slate-600 dark:text-slate-300">playbooks</span></p>
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
                    <span className="text-slate-700 dark:text-slate-300">Crisis Response</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">Cyber Incidents</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">Regulatory Compliance</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">14</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-200 dark:border-blue-700/50">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">56 <span className="text-sm font-normal text-slate-600 dark:text-slate-300">playbooks</span></p>
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
                    <span className="text-slate-700 dark:text-slate-300">Digital Transformation</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">20</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">Competitive Response</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">14</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">AI Governance</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">18</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-purple-200 dark:border-purple-700/50">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">52 <span className="text-sm font-normal text-slate-600 dark:text-slate-300">playbooks</span></p>
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

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to See It in Action?
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Experience how ExecuteIQ transforms a strategic moment into coordinated 12-minute execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => { window.location.href = '/scenario-demo'; }}
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
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-6">
            Q1 2026 Founding Partner Program
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}