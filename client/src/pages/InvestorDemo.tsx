import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  ArrowRight,
  Target,
  Shield,
  TrendingUp,
  DollarSign,
  SkipForward,
  ChevronRight,
  BookOpen,
  FileCheck,
  Radar,
  Settings,
  Globe,
  Scale,
  Building2,
  Briefcase,
  Lock,
  GitBranch,
  Layers,
  Brain,
  LineChart
} from 'lucide-react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { BrandStamp } from "@/components/BrandStamp";

const DEMO_DURATION = 180;

const IDEA_STORY = [
  {
    id: 1,
    beat: "THE GAP",
    title: "The $270M-$900M Problem",
    subtitle: "Why 30% of strategy value is lost in execution",
    phase: "IDENTIFY",
    phaseColor: "bg-[#2B8A6E]",
    icon: AlertTriangle,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    time: 0,
    description: "McKinsey research: Even high-performing companies lose 30% of their strategy's value in execution. For Fortune 500, that's $270M-$900M annually. The gap isn't intelligence—it's coordination. When a strategic event hits, teams spend 20-50 hours just getting organized.",
    investorHighlight: "This is a $15B+ market opportunity. No one owns the execution layer between strategy consulting and project management.",
    metrics: [
      { label: "Value Lost", value: "30%" },
      { label: "Fortune 500 Impact", value: "$270M-$900M" },
      { label: "Time to Organize", value: "20-50 hrs" }
    ],
    smartDefaults: null,
    pmSync: null
  },
  {
    id: 2,
    beat: "IDENTIFY",
    title: "170 Playbooks. Zero Blank Pages.",
    subtitle: "Build your depth chart before the game starts",
    phase: "IDENTIFY",
    phaseColor: "bg-[#2B8A6E]",
    icon: BookOpen,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    time: 30,
    description: "Unlike crisis tools or PM platforms, Readiness OS comes with 170 battle-tested playbooks across 9 domains. OFFENSE (M&A, Market Entry, Product Launch), DEFENSE (Crisis, Cyber, Regulatory), SPECIAL TEAMS (Digital Transformation, Competitive Response, AI Governance).",
    investorHighlight: "This is our moat. 170 playbooks = 20+ years of Fortune 500 execution experience. Competitors would need years to replicate.",
    metrics: [
      { label: "Playbooks", value: "170" },
      { label: "Domains", value: "9" },
      { label: "Categories", value: "3" }
    ],
    smartDefaults: {
      title: "Smart Defaults by Domain",
      items: [
        { domain: "Cyber Incidents", defaults: "ISO 27001, SOC2, NIST frameworks pre-selected" },
        { domain: "M&A Integration", defaults: "Hart-Scott-Rodino, SEC reporting, synergy tracking" },
        { domain: "Crisis Response", defaults: "Media protocols, stakeholder matrices, legal holds" }
      ]
    },
    pmSync: null
  },
  {
    id: 3,
    beat: "DETECT",
    title: "AI Monitors. You Decide.",
    subtitle: "The decision is pre-staged. The executive just authorizes.",
    phase: "DETECT",
    phaseColor: "bg-[#0A0F2E]",
    icon: AlertTriangle,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    time: 50,
    description: "Readiness OS' AI continuously monitors for strategic signals—competitive moves, regulatory changes, supply chain disruptions, cyber threats. When it detects a pattern, it recommends the right playbook with confidence scoring. AI monitors and recommends. Executives decide.",
    investorHighlight: "What makes this sellable to Fortune 1000 C-suites: we don't replace executives — we eliminate the 30-day mobilization cycle that surrounds them. AI monitors and recommends. The human decision is the same. It just arrives in seconds instead of weeks.",
    metrics: [
      { label: "Signals Monitored", value: "2,847" },
      { label: "Pattern Match", value: "94%" },
      { label: "Recommendation", value: "Playbook #018" }
    ],
    smartDefaults: null,
    pmSync: null
  },
  {
    id: 4,
    beat: "PREDICT",
    title: "Predictive Intelligence. Before It Happens.",
    subtitle: "Anaplan PlanIQ-style forecasting for strategic triggers",
    phase: "PREDICT",
    phaseColor: "bg-[#C9A84C]",
    icon: LineChart,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    time: 80,
    description: "Readiness OS doesn't just react—it predicts. Our AI forecasts trigger probabilities at 30, 60, and 90-day horizons. Executives see which threats are accelerating and run what-if scenarios to stress-test playbook readiness. Like Anaplan PlanIQ, but for strategic execution.",
    investorHighlight: "This is our AI differentiation. We're not just workflow—we're predictive intelligence for the C-suite. No competitor has this capability.",
    metrics: [
      { label: "Forecast Accuracy", value: "94%" },
      { label: "Prediction Horizon", value: "90 days" },
      { label: "What-If Scenarios", value: "Unlimited" }
    ],
    smartDefaults: {
      title: "Predictive Capabilities",
      items: [
        { domain: "Trigger Forecasting", defaults: "30/60/90-day probability with confidence scoring" },
        { domain: "What-If Analyzer", defaults: "Stress-test playbooks against multiple scenarios" },
        { domain: "Pre-Activation Preview", defaults: "See impact before you execute" }
      ]
    },
    pmSync: null
  },
  {
    id: 5,
    beat: "EXECUTE",
    title: "12 Minutes. Not 30 Days.",
    subtitle: "One-click activation with 15-section executive data",
    phase: "EXECUTE",
    phaseColor: "bg-[#2B8A6E]",
    icon: Zap,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    time: 120,
    description: "When the CISO approves, Readiness OS auto-creates your Jira project, assigns every task, stages every document, and unlocks pre-approved budgets—all in 12 minutes. 47 stakeholders notified instantly. Teams don't learn Readiness OS—Readiness OS comes to them in tools they already use.",
    investorHighlight: "The integration layer IS the moat. Once 50 playbooks are syncing to Jira with bi-directional updates, switching costs are massive.",
    metrics: [
      { label: "Stakeholders", value: "47" },
      { label: "Tasks Created", value: "127" },
      { label: "Response Time", value: "12 min" }
    ],
    smartDefaults: {
      title: "15 Executive Data Sections",
      items: [
        { domain: "Compliance & Regulatory", defaults: "4 frameworks active, auto-populated" },
        { domain: "Risk Assessment", defaults: "Score: 8/10, mitigation plans staged" },
        { domain: "Geographic Scope", defaults: "Global, 12 regions configured" }
      ]
    },
    pmSync: {
      title: "Real-Time PM Sync",
      platforms: ["Jira", "Asana", "Monday.com", "ServiceNow"],
      actions: [
        "Project created: CYBER-2024-001",
        "127 tasks assigned with acceptance criteria",
        "Dependencies mapped, critical path calculated",
        "Pre-approved budget unlocked: $2.5M"
      ]
    }
  },
  {
    id: 6,
    beat: "ADVANCE",
    title: "Institutional Learning Captured",
    subtitle: "Every execution makes the next one better",
    phase: "ADVANCE",
    phaseColor: "bg-[#C9A84C]",
    icon: Brain,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    time: 160,
    description: "After resolution, Readiness OS captures what worked, what didn't, and suggests playbook refinements. This institutional knowledge stays with the organization—not in someone's head who might leave. The playbook library becomes a strategic asset.",
    investorHighlight: "Historical execution data + playbook refinements = recurring value that compounds. This is how we achieve 150%+ net revenue retention.",
    metrics: [
      { label: "Lessons Captured", value: "23" },
      { label: "Playbook Updates", value: "7" },
      { label: "Time Saved Next", value: "15%" }
    ],
    smartDefaults: null,
    pmSync: null
  }

];

const STAKEHOLDER_ACKNOWLEDGMENTS = [
  { name: "Sarah Chen", role: "Chief Information Security Officer", time: 105 },
  { name: "Michael Rodriguez", role: "VP Infrastructure", time: 108 },
  { name: "Jennifer Park", role: "General Counsel", time: 112 },
  { name: "David Thompson", role: "Chief Communications Officer", time: 115 },
  { name: "Lisa Wang", role: "VP Human Resources", time: 118 },
  { name: "Robert Kim", role: "Chief Financial Officer", time: 122 },
  { name: "Amanda Foster", role: "VP Customer Success", time: 128 },
  { name: "James Mitchell", role: "Chief Operating Officer", time: 135 },
];

const MOAT_COMPONENTS = [
  { icon: BookOpen, title: "170 Playbooks", description: "20+ years encoded" },
  { icon: LineChart, title: "Predictive AI", description: "90-day forecasting" },
  { icon: GitBranch, title: "Integration Layer", description: "Bi-directional PM sync" },
  { icon: Brain, title: "Institutional Data", description: "Execution history" },
  { icon: Lock, title: "Switching Costs", description: "Deep workflow embed" }
];

export default function InvestorDemo() {
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [acknowledgedStakeholders, setAcknowledgedStakeholders] = useState<typeof STAKEHOLDER_ACKNOWLEDGMENTS>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [manualMode, setManualMode] = useState(true);

  useEffect(() => {
    if (!isPlaying || manualMode) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const next = prev + playbackSpeed;
        
        const nextStageIndex = IDEA_STORY.findIndex(s => s.time > next);
        if (nextStageIndex > 0) {
          setCurrentStageIndex(nextStageIndex - 1);
        } else if (nextStageIndex === -1) {
          setCurrentStageIndex(IDEA_STORY.length - 1);
        }
        
        const newAcks = STAKEHOLDER_ACKNOWLEDGMENTS.filter(s => s.time <= next && s.time > prev);
        if (newAcks.length > 0) {
          setAcknowledgedStakeholders(current => [...current, ...newAcks]);
        }
        
        if (next >= DEMO_DURATION) {
          setIsPlaying(false);
          setShowConfetti(true);
          setIsComplete(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
        
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, manualMode]);

  const handleNextStage = () => {
    if (currentStageIndex < IDEA_STORY.length - 1) {
      const nextIndex = currentStageIndex + 1;
      setCurrentStageIndex(nextIndex);
      setElapsedTime(IDEA_STORY[nextIndex].time);
      const newAcks = STAKEHOLDER_ACKNOWLEDGMENTS.filter(s => s.time <= IDEA_STORY[nextIndex].time);
      setAcknowledgedStakeholders(newAcks);
      
      if (nextIndex === IDEA_STORY.length - 1) {
        setIsComplete(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      const prevIndex = currentStageIndex - 1;
      setCurrentStageIndex(prevIndex);
      setElapsedTime(IDEA_STORY[prevIndex].time);
      const newAcks = STAKEHOLDER_ACKNOWLEDGMENTS.filter(s => s.time <= IDEA_STORY[prevIndex].time);
      setAcknowledgedStakeholders(newAcks);
      setIsComplete(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedTime(0);
    setCurrentStageIndex(0);
    setAcknowledgedStakeholders([]);
    setShowConfetti(false);
    setIsComplete(false);
    setPlaybackSpeed(1);
  };

  const currentStage = IDEA_STORY[currentStageIndex];
  const progress = ((currentStageIndex + 1) / IDEA_STORY.length) * 100;
  const StageIcon = currentStage.icon;

  return (
    <PageLayout>
      
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <main className="flex-1 py-8">
        <ExecutionStageGuide variant="compact" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <Badge className="bg-[#0A0F2E] text-white mb-3">
              Investor Demo — Market Creation Story
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2" data-testid="heading-investor-demo">
              Readiness OS: The Strategic Execution Operating System
            </h1>
            <p className="text-lg text-[#0A0F2E]">
              First mover in $15B+ SEOS category. 170 playbooks. 12-minute execution.
            </p>
          </div>

          {/* Playback Controls */}
          <Card className="bg-white border-[#E8E4DC] mb-6 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {!isPlaying ? (
                    <Button
                      onClick={() => { setManualMode(false); setIsPlaying(true); }}
                      className="bg-[#0A0F2E] hover:bg-[#141B45] text-white font-bold"
                      data-testid="button-play-demo"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {elapsedTime > 0 ? 'Resume' : 'Auto Play'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsPlaying(false)}
                      variant="outline"
                      className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white"
                      data-testid="button-pause-demo"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setManualMode(true); setIsPlaying(false); }}
                    className={`text-sm ${manualMode ? 'text-[#C9A84C]' : 'text-[#0A0F2E]'}`}
                    data-testid="button-manual-mode"
                  >
                    Manual Mode
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-[#0A0F2E]"
                    data-testid="button-reset-demo"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#0A0F2E]">Speed:</span>
                    {[1, 2, 4].map((speed) => (
                      <Button
                        key={speed}
                        variant="ghost"
                        size="sm"
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`text-xs px-2 ${playbackSpeed === speed ? 'text-[#2B8A6E] bg-[#2B8A6E]/10' : 'text-[#0A0F2E]'}`}
                        data-testid={`button-speed-${speed}x`}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 bg-[#F8F7F4] px-3 py-1.5 rounded-lg border border-[#E8E4DC] shadow-sm">
                      <Clock className="h-4 w-4 text-[#C9A84C]" />
                      <span className="text-[#0A0F2E] font-mono text-sm font-bold">
                        {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                      </span>
                      <span className="text-[#6B7280] text-xs font-bold">/ 3:00</span>
                    </div>
                </div>
              </div>
              <Progress value={(elapsedTime / DEMO_DURATION) * 100} className="h-1 mt-3" />
            </CardContent>
          </Card>

          {/* Story Beat Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {IDEA_STORY.map((stage, idx) => (
              <button
                key={stage.id}
                onClick={() => {
                  setCurrentStageIndex(idx);
                  setElapsedTime(stage.time);
                  const newAcks = STAKEHOLDER_ACKNOWLEDGMENTS.filter(s => s.time <= stage.time);
                  setAcknowledgedStakeholders(newAcks);
                  setIsComplete(idx === IDEA_STORY.length - 1);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${
                  idx === currentStageIndex
                    ? `${stage.phaseColor} text-white border-transparent`
                    : 'bg-white text-[#6B7280] hover:bg-[#0A0F2E] hover:text-white border-[#E8E4DC]'
                }`}
                data-testid={`button-stage-${idx}`}
              >
                {stage.beat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white border-[#E8E4DC] shadow-sm">
                <CardHeader className="border-b border-[#E8E4DC] pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${currentStage.phaseColor} text-white font-bold`}>
                        {currentStage.phase}
                      </Badge>
                      <span className="text-[#6B7280] text-xs font-bold uppercase tracking-widest">
                        {currentStage.beat} — {currentStageIndex + 1} of {IDEA_STORY.length}
                      </span>
                    </div>
                    {manualMode && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePrevStage}
                          disabled={currentStageIndex === 0}
                          className="text-[#0A0F2E]"
                          data-testid="button-prev-stage"
                        >
                          ← Back
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setElapsedTime(DEMO_DURATION);
                            setCurrentStageIndex(IDEA_STORY.length - 1);
                            setAcknowledgedStakeholders(STAKEHOLDER_ACKNOWLEDGMENTS);
                            setIsComplete(true);
                            setShowConfetti(true);
                            setTimeout(() => setShowConfetti(false), 5000);
                          }}
                          className="text-[#0A0F2E]"
                          data-testid="button-skip-to-end"
                        >
                          <SkipForward className="h-4 w-4 mr-1" />
                          Skip
                        </Button>
                      </div>
                    )}
                  </div>
                  <Progress value={progress} className="h-1 mt-4" />
                </CardHeader>
                
                <CardContent className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`p-4 rounded-xl ${currentStage.bgColor} border border-[#E8E4DC]`}>
                          <StageIcon className={`h-8 w-8 ${currentStage.color}`} />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-[#0A0F2E] mb-1">
                            {currentStage.title}
                          </h2>
                          <p className={`text-lg ${currentStage.color} mb-3 font-semibold`}>
                            {currentStage.subtitle}
                          </p>
                          <p className="text-[#0A0F2E] font-medium leading-relaxed mb-4">
                            {currentStage.description}
                          </p>
                          
                          {/* Investor Highlight */}
                          <div className="bg-[#0A0F2E] border border-[#C9A84C] rounded-lg p-3 shadow-lg">
                            <div className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-[#C9A84C]">
                                <span className="font-bold text-[#C9A84C]">Investor Insight:</span> {currentStage.investorHighlight}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {currentStage.metrics.map((metric, idx) => (
                          <div key={idx} className={`rounded-lg p-4 text-center bg-[#F8F7F4] border border-[#E8E4DC] shadow-sm`}>
                            <div className={`text-2xl font-bold mb-1 text-[#0A0F2E]`}>{metric.value}</div>
                            <div className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">{metric.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Smart Defaults Panel */}
                      {currentStage.smartDefaults && (
                        <div className="bg-[#F8F7F4] rounded-lg p-4 mb-4 border border-[#E8E4DC] shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <Settings className="h-4 w-4 text-[#C9A84C]" />
                            <span className="font-bold text-[#0A0F2E] text-sm uppercase tracking-wider">{currentStage.smartDefaults.title}</span>
                          </div>
                          <div className="space-y-2">
                            {currentStage.smartDefaults.items.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-[#0A0F2E] font-bold">{item.domain}:</span>{' '}
                                  <span className="text-[#0A0F2E]">{item.defaults}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* PM Sync Panel */}
                      {currentStage.pmSync && (
                        <div className="bg-[#0A0F2E]/5 border border-[#0A0F2E]/10 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <GitBranch className="h-4 w-4 text-[#0A0F2E]" />
                            <span className="font-medium text-[#0A0F2E]">{currentStage.pmSync.title}</span>
                            <div className="flex gap-1 ml-auto">
                              {currentStage.pmSync.platforms.map((p, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-[#0A0F2E]/30 text-[#0A0F2E]">
                                  {p}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            {currentStage.pmSync.actions.map((action, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                                <span className="text-[#0A0F2E]">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                          {!isComplete ? (
                        <Button
                          onClick={handleNextStage}
                          className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white py-6 text-lg"
                          data-testid="button-next-stage"
                        >
                          {currentStageIndex === IDEA_STORY.length - 2 ? 'Complete Story' : 'Next Beat'}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-[#2B8A6E]/15 border border-[#2B8A6E]/30 rounded-lg p-4 text-center">
                            <CheckCircle2 className="h-8 w-8 text-[#2B8A6E] mx-auto mb-2" />
                            <p className="text-[#2B8A6E] font-medium">Story Complete</p>
                            <p className="text-[#0A0F2E] text-sm">30 days: still getting the right people aligned. 12 minutes: roles assigned, tasks staged, execution live.</p>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              onClick={() => setLocation('/customer-demo')}
                              className="flex-1 bg-[#0A0F2E] hover:bg-[#141B45] text-white"
                              data-testid="button-customer-demo"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              See Customer Demo
                            </Button>
                            <Button
                              onClick={() => setLocation('/investor-presentation')}
                              variant="outline"
                              className="flex-1 border-[#C9A84C]/50 text-[#C9A84C]"
                              data-testid="button-full-presentation"
                            >
                              Full Deck
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Enterprise Moat */}
              <Card className="bg-gradient-to-br border-[#C9A84C]/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#0A0F2E] flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#C9A84C]" />
                    Enterprise Moat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MOAT_COMPONENTS.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-4 w-4 text-[#C9A84C]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#0A0F2E]">{item.title}</div>
                          <div className="text-xs text-[#0A0F2E]">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stakeholder Response - only show during EXECUTE */}
              {currentStageIndex >= 3 && (
                <Card className="bg-white border-[#E8E4DC]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-[#0A0F2E] flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#0A0F2E]" />
                      Live Stakeholder Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {STAKEHOLDER_ACKNOWLEDGMENTS.map((stakeholder, idx) => {
                        const isAcknowledged = acknowledgedStakeholders.some(s => s.name === stakeholder.name);
                        return (
                          <div 
                            key={idx}
                            className={`p-2 rounded-lg flex items-center gap-2 transition-all ${
                              isAcknowledged ? 'bg-[#2B8A6E]/15' : 'bg-[#F8F7F4]'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${isAcknowledged ? 'bg-[#2B8A6E]' : 'bg-[#6B7280]'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[#0A0F2E] truncate">{stakeholder.name}</div>
                              <div className="text-xs text-[#0A0F2E] truncate">{stakeholder.role}</div>
                            </div>
                            {isAcknowledged && <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E8E4DC]">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#0A0F2E]">Acknowledged</span>
                        <span className="text-[#0A0F2E] font-medium">{acknowledgedStakeholders.length} / {STAKEHOLDER_ACKNOWLEDGMENTS.length}</span>
                      </div>
                      <Progress value={(acknowledgedStakeholders.length / STAKEHOLDER_ACKNOWLEDGMENTS.length) * 100} className="h-2 mt-2" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Investment Metrics */}
              <Card className="bg-white border-[#E8E4DC]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#0A0F2E] flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-[#2B8A6E]" />
                    Investment Thesis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#0A0F2E]">TAM</span>
                      <span className="text-sm font-medium text-[#0A0F2E]">$15B+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#0A0F2E]">Target ACV</span>
                      <span className="text-sm font-medium text-[#0A0F2E]">$250K-$1.5M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#0A0F2E]">Beachhead</span>
                      <span className="text-sm font-medium text-[#0A0F2E]">Gaming & Hospitality</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#0A0F2E]">Category</span>
                      <span className="text-sm font-medium text-[#2B8A6E]">Category Creator</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
    </PageLayout>
  );
}
