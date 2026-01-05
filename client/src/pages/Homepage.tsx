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
  SkipForward
} from "lucide-react";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import CinematicHero from "@/components/marketing/CinematicHero";

const INTRO_SEEN_KEY = "m_platform_intro_seen";

const ROTATING_TAGLINES = [
  "Adapt at the Speed of Change.",
  "Quarters, not years.",
  "The playbook for pressure.",
  "Prepared response beats reactive scramble.",
  "166 playbooks. 12-minute activation.",
  "Business agility, operationalized."
];

export default function Homepage() {
  const [, setLocation] = useLocation();
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem(INTRO_SEEN_KEY);
  });
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % ROTATING_TAGLINES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSkipIntro = () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    setShowIntro(false);
  };

  const handleIntroComplete = () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <div className="relative min-h-screen bg-slate-950" data-testid="cinematic-intro">
        <StandardNav />
        <CinematicHero onSkip={handleSkipIntro} />
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleSkipIntro}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50 gap-2"
            data-testid="button-skip-intro"
          >
            <SkipForward className="h-5 w-5" />
            Skip to Site
          </Button>
        </div>
      </div>
    );
  }

  const phases = [
    {
      id: 'identify',
      phase: 'I',
      phaseName: 'Identify',
      title: 'Build Your Depth Chart',
      description: 'Map your operating model to 166 pre-staged playbooks across 9 strategic domains. Know every scenario before it happens.',
      aiPositioning: 'AI that pre-stages responses—the training data for every strategic scenario.',
      icon: BookOpen,
      color: 'from-violet-500 to-purple-600',
      borderColor: 'border-violet-200 hover:border-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/20',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      iconColor: 'text-violet-600 dark:text-violet-400',
      features: ['Operating Model Alignment', '166 Pre-built Playbooks', 'Stakeholder Accountability Mapping', 'Readiness Scoring'],
      primaryLink: '/playbook-library',
      primaryLabel: 'Browse Playbooks',
      mindsetQuote: 'Know every scenario before it happens.'
    },
    {
      id: 'detect',
      phase: 'D',
      phaseName: 'Detect',
      title: 'Monitor Signals',
      description: 'AI matches signals to playbooks and triggers execution. Not just analysis—action triggers that connect intelligence to execution.',
      aiPositioning: "AI that identifies which playbook to execute—not just what's happening.",
      icon: Radar,
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-200 hover:border-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      features: ['AI Signal-to-Playbook Matching', 'Competitive Intelligence Aggregation', 'Early Warning Dashboards', 'Human-Triggered Activation'],
      primaryLink: '/foresight-radar',
      primaryLabel: 'View Radar',
      mindsetQuote: 'See it coming before it arrives.'
    },
    {
      id: 'execute',
      phase: 'E',
      phaseName: 'Execute',
      title: 'Execute Response',
      description: 'AI orchestrates cross-functional coordination. Decision in 12 minutes, full execution of 47 tasks in 90 minutes. Autonomous blocker resolution.',
      aiPositioning: 'AI that orchestrates coordination—not just assists individual work.',
      icon: Radio,
      color: 'from-emerald-500 to-green-600',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      features: ['AI Cross-Functional Orchestration', 'Autonomous Blocker Resolution', 'Real-time Play Clock', 'Two-Minute Drill Mode'],
      primaryLink: '/command-center',
      primaryLabel: 'Launch Command Center',
      mindsetQuote: 'No thinking. Just execution.'
    },
    {
      id: 'advance',
      phase: 'A',
      phaseName: 'Advance',
      title: 'Review the Film',
      description: 'AI captures lessons and auto-refines playbooks. Insights propagate across related playbooks. Get smarter every execution.',
      aiPositioning: 'AI that gets smarter every time you execute.',
      icon: BarChart3,
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-200 hover:border-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      features: ['AI Playbook Refinement', 'Cross-Playbook Learning', 'Performance Benchmarking', 'Autonomous Improvement'],
      primaryLink: '/executive-dashboard',
      primaryLabel: 'View Dashboard',
      mindsetQuote: 'Get better every time.'
    }
  ];
  
  const executionTimeline = [
    { time: '0:00', event: 'CEO selects Option A: Immediate Public Disclosure', type: 'decision' },
    { time: '0:01', event: 'Triggering 47 tasks across 12 stakeholders', type: 'ai' },
    { time: '0:02', event: 'Auto-populating breach disclosure template with incident data', type: 'ai' },
    { time: '0:05', event: 'Legal reviewing draft - AI detected blocker: missing breach scope', type: 'blocker' },
    { time: '0:06', event: 'AI auto-requested missing data from Security team', type: 'ai' },
    { time: '0:09', event: 'Security provided scope - Legal unblocked', type: 'resolved' },
    { time: '0:12', event: 'Legal approved disclosure', type: 'approval' },
    { time: '0:15', event: 'Comms reviewing AI-drafted statement', type: 'progress' },
    { time: '0:18', event: 'CFO approved budget allocation', type: 'approval' },
    { time: '0:20', event: 'AI detected: Media inquiry - adjusting timeline', type: 'ai' },
    { time: '0:27', event: 'CEO final approval on statement', type: 'decision' },
    { time: '0:28', event: 'Statement published', type: 'complete' },
    { time: '0:30', event: 'Regulatory notification sent', type: 'complete' },
    { time: '0:45', event: '45,000 customer emails sent (AI-personalized)', type: 'ai' },
    { time: '1:30', event: 'All 47 tasks complete', type: 'complete' }
  ];

  const stats = [
    { value: '12 min', label: 'Avg Decision Time', icon: Clock },
    { value: '340X', label: 'Faster Than Industry', icon: Zap },
    { value: '166', label: 'Pre-Staged Playbooks', icon: BookOpen },
    { value: '94%', label: 'On-Time Rate', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <StandardNav />
      
      {/* Hero Section - Survival-Level Stakes */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Urgency Badge */}
          <div className="mb-8 inline-block">
            <Badge className="text-lg px-6 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-2 border-red-300 dark:border-red-700 animate-pulse" data-testid="badge-urgency">
              The pace of change is accelerating
            </Badge>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="heading-mindset">
            The World Won't Wait
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              for You to Coordinate.
            </span>
          </h1>
          
          {/* Subheadline - Three Pain Points */}
          <div className="space-y-4 text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto" data-testid="text-pain-points">
            <p>Markets shift while you're aligning stakeholders.</p>
            <p>Crises spread while you're scheduling meetings.</p>
            <p>Opportunities close while you're coordinating via email.</p>
          </div>
          
          {/* The Fatal Gap */}
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-3xl mx-auto mb-12" data-testid="fatal-gap">
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              The pace of change is accelerating. Your coordination speed isn't.
            </p>
            <p className="text-lg text-red-600 dark:text-red-400 font-semibold">
              That gap is fatal.
            </p>
          </div>
          
          {/* Solution Statement */}
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto" data-testid="text-hero-description">
            <span className="font-bold text-slate-900 dark:text-white">
              M Platform closes it—
            </span>
            giving you pre-staged responses for every strategic scenario.
            <br /><br />
            When change hits (and it will), you adapt at the speed it happens.
            <br />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Not because you predicted it. Because you prepared for it.
            </span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => setLocation('/video')}
              className="text-lg px-8 py-6 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
              data-testid="button-watch-video"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Video
            </Button>
            <Button 
              size="lg" 
              onClick={() => setLocation('/sandbox')}
              className="text-lg px-8 py-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              data-testid="button-try-demo"
            >
              Try Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setLocation('/how-it-works')}
              className="text-lg px-8 py-6 border-slate-300 dark:border-slate-600"
              data-testid="button-how-it-works"
            >
              How It Works
            </Button>
          </div>
          
          {/* The Three Scenarios with Speed Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12" data-testid="speed-scenarios">
            
            {/* Crisis */}
            <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20" data-testid="scenario-crisis">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-red-600 text-white">CRISIS</Badge>
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">When Crisis Hits</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded">
                    <div className="text-sm text-slate-500 mb-1">World moves at:</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">Minutes</div>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded">
                    <div className="text-sm text-red-700 dark:text-red-400 mb-1">You respond in:</div>
                    <div className="text-2xl font-bold text-red-600">17 Days</div>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                    <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">With M Platform:</div>
                    <div className="text-2xl font-bold text-emerald-600">90 Minutes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Opportunity */}
            <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20" data-testid="scenario-opportunity">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-emerald-600 text-white">OPPORTUNITY</Badge>
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">When Opportunity Appears</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded">
                    <div className="text-sm text-slate-500 mb-1">Window closes in:</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">Days</div>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded">
                    <div className="text-sm text-red-700 dark:text-red-400 mb-1">You mobilize in:</div>
                    <div className="text-2xl font-bold text-red-600">6 Weeks</div>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                    <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">With M Platform:</div>
                    <div className="text-2xl font-bold text-emerald-600">1 Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Innovation */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20" data-testid="scenario-innovation">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-purple-600 text-white">INNOVATION</Badge>
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">When Change Disrupts</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded">
                    <div className="text-sm text-slate-500 mb-1">Competitors deploy in:</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">Weeks</div>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded">
                    <div className="text-sm text-red-700 dark:text-red-400 mb-1">You deploy in:</div>
                    <div className="text-2xl font-bold text-red-600">9 Months</div>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                    <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">With M Platform:</div>
                    <div className="text-2xl font-bold text-emerald-600">6 Weeks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* The Closing Punch with Rotating Tagline */}
          <Card className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 border-2 border-slate-700 max-w-4xl mx-auto" data-testid="closing-punch">
            <div className="text-center space-y-4">
              <p className="text-3xl font-bold text-white">
                Adaptive Execution Is No Longer Optional.
              </p>
              <p className="text-xl text-slate-300">
                It's the difference between companies that survive disruption
                <br />
                and companies that become case studies of what not to do.
              </p>
              <div className="pt-4">
                <p 
                  className="text-2xl font-bold text-emerald-400 mb-2 transition-opacity duration-500"
                  data-testid="rotating-tagline"
                >
                  M Platform. {ROTATING_TAGLINES[taglineIndex]}
                </p>
                <p className="text-slate-400">
                  166 pre-staged playbooks • 9 strategic domains • Execution in days, not months
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2025 Business Agility Report Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" data-testid="bai-report-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30" data-testid="badge-bai-report">
              2025 Business Agility Report
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Industry Is Moving Slowly.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                You Don't Have To.
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Data from 244 organizations reveals the gap between agile leaders and laggards.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Time to Improve */}
            <Card className="bg-slate-800/50 border-slate-700 text-center" data-testid="bai-stat-time">
              <CardContent className="p-8">
                <div className="text-5xl font-bold text-red-400 mb-2">3.8 Years</div>
                <p className="text-slate-400 mb-4">Industry average to see just 10% agility improvement</p>
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <div className="text-2xl font-bold text-emerald-400">Quarters</div>
                  <p className="text-sm text-slate-500">With M Platform</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Revenue Growth */}
            <Card className="bg-slate-800/50 border-slate-700 text-center" data-testid="bai-stat-revenue">
              <CardContent className="p-8">
                <div className="text-5xl font-bold text-emerald-400 mb-2">10.3%</div>
                <p className="text-slate-400 mb-4">Revenue per employee growth for organizations that improved</p>
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <div className="text-2xl font-bold text-red-400">3.5%</div>
                  <p className="text-sm text-slate-500">Those that didn't improve</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Governance Gap */}
            <Card className="bg-slate-800/50 border-slate-700 text-center" data-testid="bai-stat-governance">
              <CardContent className="p-8">
                <div className="text-5xl font-bold text-amber-400 mb-2">22%</div>
                <p className="text-slate-400 mb-4">Have governance that actually supports speed</p>
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <div className="text-2xl font-bold text-emerald-400">100%</div>
                  <p className="text-sm text-slate-500">M Platform embeds governance into execution</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-500/30" data-testid="bai-insight-card">
            <CardContent className="p-8 text-center">
              <p className="text-2xl font-bold text-white mb-4">
                "Pressure exposes cracks in the system."
              </p>
              <p className="text-lg text-slate-300 mb-6">
                The question isn't "how do we avoid pressure?" It's "how do we build systems that perform UNDER pressure?"
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  onClick={() => setLocation('/agility-assessment')}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  data-testid="button-take-assessment"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Take the Agility Assessment
                </Button>
                <Button 
                  onClick={() => setLocation('/roi-calculator')}
                  variant="outline"
                  className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  data-testid="button-calculate-roi"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Calculate Your ROI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Coordination Gap Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30" data-testid="ai-coordination-gap">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-700" data-testid="badge-ai-era">
                The AI Era Reality
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6" data-testid="heading-ai-gap">
                Your Employees Have AI.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                  Your Organization Doesn't.
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                AI gave your team superhuman speed for individual tasks.
                But your organization still coordinates at meeting speed.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Individual Work - Solved */}
              <Card className="border-2 border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900" data-testid="ai-gap-individual">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                    <Bot className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Individual Work</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-emerald-600">10X Faster</span>
                    <p className="text-sm text-slate-500">with AI assistants</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-600">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">SOLVED</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Organizational Coordination - Broken */}
              <Card className="border-2 border-red-300 dark:border-red-700 bg-white dark:bg-slate-900" data-testid="ai-gap-coordination">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                    <Network className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Organizational Coordination</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-red-600">Same Speed</span>
                    <p className="text-sm text-slate-500">as before AI</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <X className="h-5 w-5" />
                    <span className="font-semibold">STILL BROKEN</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* M Platform - Now Solved */}
              <Card className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50" data-testid="ai-gap-m-platform">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">M Platform</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">AI Speed</span>
                    <p className="text-sm text-slate-500">for coordination</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-purple-600">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">NOW SOLVED</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="p-8 bg-slate-900 dark:bg-black border-2 border-slate-700" data-testid="ai-bottleneck-insight">
              <div className="text-center">
                <p className="text-2xl font-bold text-white mb-4">
                  AI made the work faster.
                </p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                  M Platform makes the COORDINATION faster.
                </p>
                <p className="text-xl text-slate-400">
                  That's where 95% of the time is wasted.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Survival Question Section */}
      <section className="py-20 bg-slate-900 dark:bg-black text-white" data-testid="survival-section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            
            <h2 className="text-4xl font-bold mb-6" data-testid="heading-survival">
              The Question Isn't "Do We Need This?"
            </h2>
            <p className="text-3xl font-bold text-red-400 mb-8">
              The Question Is "Can We Survive Without It?"
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12 text-left">
              
              {/* Without */}
              <div className="p-6 bg-red-950/30 border-2 border-red-800 rounded-lg" data-testid="without-m">
                <h3 className="text-xl font-bold text-red-400 mb-4">
                  Without M Platform
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Markets shift while you align stakeholders (6 weeks)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Crises spread while you coordinate response (17 days)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Competitors capture opportunities while you schedule meetings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Innovation stalls in coordination hell (9 months)</span>
                  </li>
                </ul>
              </div>
              
              {/* With */}
              <div className="p-6 bg-emerald-950/30 border-2 border-emerald-800 rounded-lg" data-testid="with-m">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">
                  With M Platform
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Execute market moves in 1 week (pre-staged playbooks)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Resolve crises in 90 minutes (automated coordination)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Capture opportunities before competitors see them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Deploy innovation in 6 weeks (coordinated rollout)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl" data-testid="survival-cta">
              <p className="text-2xl font-bold mb-4">
                The answer gets clearer every day the world moves faster
                <br />
                and your organization still coordinates at the speed of meetings.
              </p>
              <Button 
                size="lg" 
                onClick={() => setLocation('/how-it-works')}
                className="text-lg px-8 py-4 bg-white text-slate-900 hover:bg-slate-100"
                data-testid="button-adaptation-proof-2"
              >
                Make Your Organization Adaptation-Proof
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Phase Navigation Grid */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600" data-testid="badge-methodology">
              The Methodology
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-phases">
              The IDEA Framework™
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
              The preparation mindset of elite teams, systematized for enterprise execution.
            </p>
            <div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-6">
              <p className="text-lg font-semibold text-slate-900 dark:text-white italic">
                "Comfortable and confident that we are prepared to execute. No matter the situation."
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xl font-bold">
              <span className="text-violet-600 dark:text-violet-400">I</span>
              <span className="text-slate-400">·</span>
              <span className="text-blue-600 dark:text-blue-400">D</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-600 dark:text-emerald-400">E</span>
              <span className="text-slate-400">·</span>
              <span className="text-amber-600 dark:text-amber-400">A</span>
            </div>
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
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {phase.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
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
          
          {/* IDEA Tagline */}
          <div className="mt-12 text-center">
            <Card className="inline-block p-6 md:p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 border-blue-300 dark:border-blue-700">
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2" data-testid="idea-tagline">
                That's the <span className="bg-gradient-to-r from-violet-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">IDEA</span>.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Prepare with precision. Execute with confidence.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Offense / Defense / Special Teams */}
      <section className="py-20 px-6 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-slate-700 text-slate-300 border-slate-600" data-testid="badge-coverage">
              Complete Coverage
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="heading-coverage">
              Offense. Defense. Special Teams.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Great football programs are prepared for every situation before the game starts. 
              M brings this same complete preparedness to business leadership.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Offense */}
            <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-700/50 hover:border-emerald-500/50 transition-all" data-testid="card-offense">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Offense</h3>
                    <p className="text-sm text-emerald-400">Seize Opportunities</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  M&A targets, market expansion, competitive moves—playbooks ready to capitalize.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Market Entry & Expansion</span>
                    <span className="text-emerald-400 font-medium">22</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">M&A Integration</span>
                    <span className="text-emerald-400 font-medium">16</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Product Launch</span>
                    <span className="text-emerald-400 font-medium">20</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-emerald-700/50">
                  <p className="text-2xl font-bold text-emerald-400">58 <span className="text-sm font-normal text-slate-400">playbooks</span></p>
                </div>
              </CardContent>
            </Card>

            {/* Defense */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50 hover:border-blue-500/50 transition-all" data-testid="card-defense">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Defense</h3>
                    <p className="text-sm text-blue-400">Protect Value</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  Regulatory changes, supply chain disruptions, cyber incidents—responses pre-staged.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Crisis Response</span>
                    <span className="text-blue-400 font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Cyber Incidents</span>
                    <span className="text-blue-400 font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Regulatory Compliance</span>
                    <span className="text-blue-400 font-medium">14</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-700/50">
                  <p className="text-2xl font-bold text-blue-400">56 <span className="text-sm font-normal text-slate-400">playbooks</span></p>
                </div>
              </CardContent>
            </Card>

            {/* Special Teams */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50 hover:border-purple-500/50 transition-all" data-testid="card-special-teams">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Special Teams</h3>
                    <p className="text-sm text-purple-400">Change the Game</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  AI governance, ESG mandates, workforce transformation—emerging plays ready.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Digital Transformation</span>
                    <span className="text-purple-400 font-medium">16</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Competitive Response</span>
                    <span className="text-purple-400 font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">AI Governance</span>
                    <span className="text-purple-400 font-medium">18</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-purple-700/50">
                  <p className="text-2xl font-bold text-purple-400">52 <span className="text-sm font-normal text-slate-400">playbooks</span></p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-slate-400">
              No matter the situation, executives using M are prepared to execute 
              <span className="text-white font-semibold"> swiftly, efficiently, and effectively.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Full Execution Timeline Demo */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30" data-testid="execution-timeline-demo">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700" data-testid="badge-demo">
              Full Execution Demo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-timeline">
              Data Breach Response: Complete in 90 Minutes
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Coordination starts in 12 minutes. Full execution of 47 tasks across 12 stakeholders completes in 90 minutes. Industry average: 17 days.
            </p>
          </div>
          
          <Card className="p-6 bg-slate-900 dark:bg-black border-2 border-slate-700" data-testid="timeline-container">
            <div className="flex justify-between items-center mb-6 text-sm text-slate-400">
              <span>AI COORDINATION LOG</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-500 rounded-full"></span> AI Action</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Human Decision</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Completed</span>
              </div>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {executionTimeline.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-4 p-3 rounded-lg transition-all ${
                    item.type === 'ai' ? 'bg-purple-900/30 border-l-4 border-purple-500' :
                    item.type === 'decision' ? 'bg-blue-900/30 border-l-4 border-blue-500' :
                    item.type === 'blocker' ? 'bg-red-900/30 border-l-4 border-red-500' :
                    item.type === 'resolved' ? 'bg-amber-900/30 border-l-4 border-amber-500' :
                    item.type === 'approval' ? 'bg-cyan-900/30 border-l-4 border-cyan-500' :
                    item.type === 'complete' ? 'bg-emerald-900/30 border-l-4 border-emerald-500' :
                    'bg-slate-800/50 border-l-4 border-slate-600'
                  }`}
                  data-testid={`timeline-item-${index}`}
                >
                  <span className="text-slate-400 font-mono text-sm min-w-[45px]">[{item.time}]</span>
                  <span className={`text-sm ${
                    item.type === 'ai' ? 'text-purple-300' :
                    item.type === 'decision' ? 'text-blue-300' :
                    item.type === 'blocker' ? 'text-red-300' :
                    item.type === 'resolved' ? 'text-amber-300' :
                    item.type === 'approval' ? 'text-cyan-300' :
                    item.type === 'complete' ? 'text-emerald-300' :
                    'text-slate-300'
                  }`}>
                    {item.event}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-400">90 min</p>
                <p className="text-sm text-slate-400">Total Time</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">8</p>
                <p className="text-sm text-slate-400">Human Decisions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">12</p>
                <p className="text-sm text-slate-400">AI Blockers Resolved</p>
              </div>
            </div>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
              <span className="font-bold text-slate-900 dark:text-white">Decision in 12 minutes. Full execution in 90 minutes.</span> Industry average: 17 days.
            </p>
            <Button 
              size="lg"
              onClick={() => setLocation('/executive-simulation')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              data-testid="button-try-simulation"
            >
              Try the Full Simulation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Three Corporate AI Angles */}
      <section className="py-20 px-6 bg-white dark:bg-slate-950" data-testid="corporate-ai-angles">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700" data-testid="badge-ai-angles">
              AI-Era Positioning
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-ai-angles">
              Three Angles for the AI-Hungry Enterprise
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Every Fortune 500 is deploying AI. Here's why M Platform is the missing piece.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Governance Angle */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 hover:shadow-xl transition-all" data-testid="angle-governance">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                  <Shield className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Governance</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-4">18 Pre-Built Playbooks</p>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Every company is deploying AI. None have governance frameworks that can keep pace.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Model deployment approval</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">6 weeks → 3 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Bias incident response</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">2 weeks → 90 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Vendor risk assessment</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">2 months → 5 days</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Your AI governance moves at the speed your AI team does.
                </p>
              </CardContent>
            </Card>
            
            {/* AI Productivity Gap Angle */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 hover:shadow-xl transition-all" data-testid="angle-productivity">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Productivity Gap</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-4">Unlock Your AI Investment</p>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  You spent $5M on Copilot licenses. Your employees are 10X more productive. But strategic execution is still slow.
                </p>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg mb-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">The Missing Piece</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Individual AI speed → Organizational AI speed
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  M Platform is the coordination layer that makes your AI investment pay off.
                </p>
              </CardContent>
            </Card>
            
            {/* AI-Native Operations Angle */}
            <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 hover:shadow-xl transition-all" data-testid="angle-native">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                  <Brain className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI-Native Operations</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-4">Operate at Machine Speed</p>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  AI-native companies don't just use AI for tasks. They use AI for coordination. That's why they move 10X faster.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">Pre-staged playbooks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">AI-powered coordination</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">Execution at machine speed</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  M Platform makes you AI-native—where AI doesn't just assist, it orchestrates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition - The Solution */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" data-testid="badge-solution">
            The Solution
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-value">
            M Platform: The Execution Layer
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            The first Strategic Execution Operating System—software that turns operating model design into coordinated action.
          </p>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-4">Consultants Design</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <span className="w-2 h-2 mt-2 bg-slate-400 rounded-full flex-shrink-0"></span>
                    12 operating model elements
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <span className="w-2 h-2 mt-2 bg-slate-400 rounded-full flex-shrink-0"></span>
                    Fingerprint on paper
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <span className="w-2 h-2 mt-2 bg-slate-400 rounded-full flex-shrink-0"></span>
                    "Here's what to build"
                  </li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-4">M Platform Executes</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                    <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-500 flex-shrink-0" />
                    166 pre-staged playbooks
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                    <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-500 flex-shrink-0" />
                    Fingerprint in software
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                    <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-500 flex-shrink-0" />
                    "Here's how to run it"
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-lg font-medium text-slate-700 dark:text-slate-300">
              McKinsey gives you the blueprint. <span className="text-emerald-600 dark:text-emerald-400 font-bold">M Platform builds the house.</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="value-speed">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">72 Hours → 12 Minutes</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Coordinated response vs. industry average. Speed is strategy.
              </p>
            </div>
            
            <div className="text-center" data-testid="value-playbooks">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">9 Strategic Domains</h3>
              <p className="text-slate-600 dark:text-slate-400">
                From market dynamics to AI governance. Offense and defense covered.
              </p>
            </div>
            
            <div className="text-center" data-testid="value-ai">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Human-AI Partnership</h3>
              <p className="text-slate-600 dark:text-slate-400">
                AI monitors and recommends. Executives decide and execute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Model Alignment Feature */}
      <section className="py-12 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
        <div className="max-w-5xl mx-auto">
          <Card 
            className="border-0 bg-white/10 backdrop-blur-sm cursor-pointer transition-all hover:bg-white/20 group"
            onClick={() => setLocation('/operating-model')}
            data-testid="card-operating-model-featured"
          >
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                <Layers className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <Badge className="mb-2 bg-white/20 text-white border-white/30">McKinsey Framework</Badge>
                <h3 className="text-2xl font-bold text-white mb-2">Operating Model Alignment</h3>
                <p className="text-white/80">
                  Map your organization's structure to M's 166 playbooks using McKinsey's "Organize to Value" 12-element framework. Get personalized playbook recommendations based on your unique operating model fingerprint.
                </p>
              </div>
              <Button 
                size="lg"
                className="bg-white text-indigo-600 hover:bg-white/90 font-semibold"
                data-testid="button-start-assessment"
              >
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured: Executive Simulation Demo */}
      <section className="py-12 px-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500">
        <div className="max-w-5xl mx-auto">
          <Card 
            className="border-0 bg-white/10 backdrop-blur-sm cursor-pointer transition-all hover:bg-white/20 group"
            onClick={() => setLocation('/executive-simulation')}
            data-testid="card-simulation-demo-featured"
          >
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                <Briefcase className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <Badge className="mb-2 bg-white/20 text-white border-white/30">Interactive Experience</Badge>
                <h3 className="text-2xl font-bold text-white mb-2">Executive Simulation Demo</h3>
                <p className="text-white/80">
                  Step into the shoes of a Fortune 500 CSO. Experience real-time signal detection, playbook activation, and rapid coordinated response across your executive team. This is exactly how M works in production.
                </p>
              </div>
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                data-testid="button-try-simulation-featured"
              >
                Start Simulation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Sandbox Demo CTA */}
      <section className="py-12 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        <div className="max-w-5xl mx-auto">
          <Card 
            className="border-0 bg-white/10 backdrop-blur-sm cursor-pointer transition-all hover:bg-white/20 group"
            onClick={() => setLocation('/sandbox-demo')}
            data-testid="card-sandbox-demo-featured"
          >
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                <Play className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <Badge className="mb-2 bg-white/20 text-white border-white/30">Try It Yourself</Badge>
                <h3 className="text-2xl font-bold text-white mb-2">Interactive Sandbox Demo</h3>
                <p className="text-white/80">
                  Configure your own playbook, set triggers, define stakeholders, and watch your personalized scenario execute in real-time. See exactly how M Platform would work for your organization.
                </p>
              </div>
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                data-testid="button-try-sandbox"
              >
                Try It Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sales Toolkit Section */}
      <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" data-testid="badge-sales-tools">
              Sales Toolkit
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Tools to Close Deals Faster
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Interactive demos, ROI calculators, and board-ready exports—everything you need to demonstrate value.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Live Demo */}
            <Card 
              className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
              onClick={() => setLocation('/live-demo')}
              data-testid="card-live-demo"
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Zap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">One-Click Live Demo</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Watch a data breach get contained in 12 minutes. Real-time task cascade, stakeholder coordination, and resolution.
                </p>
                <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
                  15-Second Interactive Demo
                </Badge>
              </CardContent>
            </Card>

            {/* ROI Calculator */}
            <Card 
              className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
              onClick={() => setLocation('/roi-calculator')}
              data-testid="card-roi-calculator"
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">ROI Calculator</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Input company size, industry, and incident frequency. Get personalized time/cost savings projections.
                </p>
                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                  Personalized ROI Analysis
                </Badge>
              </CardContent>
            </Card>

            {/* Board Export */}
            <Card 
              className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
              onClick={() => setLocation('/board-export')}
              data-testid="card-board-export"
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Briefcase className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Board-Ready Export</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Generate executive briefings with one click. Active scenarios, response metrics, and financial summary.
                </p>
                <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
                  PDF / PPTX / DOCX
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" data-testid="badge-origin">
                The Origin
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                From Sideline to Boardroom
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                Before enterprise software, I spent 5 years coordinating elite athletes under pressure—as a major college football coach.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                When a play breaks down, you don't have 72 hours. You have 40 seconds. What makes that possible isn't superhuman speed—it's <strong className="text-slate-900 dark:text-white">preparation</strong>.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                I spent 20+ years at Ford, Toyota, Lockheed Martin, Eli Lilly, and Churchill Downs asking the same question:
              </p>
              <blockquote className="border-l-4 border-amber-500 pl-4 py-2 mb-6">
                <p className="text-xl font-medium text-slate-800 dark:text-slate-200 italic">
                  "Why can't the boardroom execute like the sideline?"
                </p>
              </blockquote>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                M Platform is the answer. <span className="text-amber-600 dark:text-amber-400">That's the IDEA.</span>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 text-center" data-testid="origin-stat-1">
                <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">5</span>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Years coaching major college football</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 text-center" data-testid="origin-stat-2">
                <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">20+</span>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Years Fortune 500 experience</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 text-center" data-testid="origin-stat-3">
                <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">7</span>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Enterprise transformations led</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" data-testid="heading-cta">
            Ready to Close the Execution Gap?
          </h2>
          <p className="text-lg text-emerald-400 font-semibold mb-2">Success Favors the Prepared</p>
          <p className="text-xl text-slate-300 mb-8">
            Start with a 90-day pilot. See M Platform coordinate your first strategic response in 12 minutes instead of 72 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => setLocation('/contact')}
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 text-lg"
              data-testid="button-request-access"
            >
              Request Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setLocation('/our-story')}
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
