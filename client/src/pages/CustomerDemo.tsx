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
  UserCheck,
  GitBranch,
  Layers,
  Brain,
  Award,
  Timer
} from 'lucide-react';
import { useLocation } from 'wouter';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { BrandStamp } from "@/components/BrandStamp";

const DEMO_DURATION = 180;

const IDEA_STORY = [
  {
    id: 1,
    beat: "THE PROBLEM",
    title: "When Strategic Events Hit, Teams Scramble",
    subtitle: "20-50 hours lost just getting organized",
    phase: "PROBLEM",
    phaseColor: "bg-[#0A0F2E]",
    icon: AlertTriangle,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#0A0F2E]/20",
    time: 0,
    description: "A ransomware attack hits at 2 AM. A competitor announces a major acquisition. A regulatory change requires immediate response. In each case, your team spends the first 20-50 hours figuring out who does what, what documents exist, and what budgets are available.",
    roleWins: [
      { role: "CEO", benefit: "Stop waking up to chaos—know your team has a plan" },
      { role: "COO", benefit: "Eliminate the 'who owns this?' confusion" },
      { role: "CSO", benefit: "Execute strategy faster than competitors can react" }
    ],
    metrics: [
      { label: "Time Lost", value: "20-50 hrs" },
      { label: "Cost per Event", value: "$10K-25K" },
      { label: "Value at Risk", value: "$500K-2M" }
    ],
    smartDefaults: null
  },
  {
    id: 2,
    beat: "IDENTIFY",
    title: "Your Playbooks Are Ready Before You Need Them",
    subtitle: "170 templates customized for your organization",
    phase: "IDENTIFY",
    phaseColor: "bg-[#C9A84C]",
    icon: BookOpen,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/20",
    time: 30,
    description: "M comes with 170 playbooks across 9 domains—from cyber incidents to M&A integration to product launches. Each one pre-configured with smart defaults for your industry. You customize once, then it's ready for instant activation.",
    roleWins: [
      { role: "CISO", benefit: "Cyber playbooks with ISO 27001, SOC2, NIST pre-loaded" },
      { role: "CFO", benefit: "Pre-approved budgets already staged for each scenario" },
      { role: "General Counsel", benefit: "Legal holds, regulatory notifications pre-staged" }
    ],
    metrics: [
      { label: "Ready Playbooks", value: "170" },
      { label: "Domains Covered", value: "9" },
      { label: "Setup Time", value: "2 hours" }
    ],
    smartDefaults: {
      title: "Your Industry, Pre-Configured",
      items: [
        { domain: "Gaming & Hospitality", defaults: "Gaming Commission notifications, patron privacy protocols" },
        { domain: "Healthcare", defaults: "HIPAA breach procedures, patient notification workflows" },
        { domain: "Financial Services", defaults: "SEC/FINRA reporting, customer communication holds" }
      ]
    }
  },
  {
    id: 3,
    beat: "DETECT",
    title: "AI Watches. You Approve.",
    subtitle: "Never miss a signal that matters",
    phase: "DETECT",
    phaseColor: "bg-[#C9A84C]",
    icon: Radar,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/20",
    time: 50,
    description: "M's AI monitors competitive intelligence, regulatory filings, supply chain signals, and internal alerts. When it detects something relevant, it recommends the right playbook. You stay in control—AI recommends, you decide.",
    roleWins: [
      { role: "Chief Strategy Officer", benefit: "Competitive moves flagged before they hit the news" },
      { role: "VP Supply Chain", benefit: "Supplier issues detected before they become crises" },
      { role: "CISO", benefit: "Threat patterns matched to response playbooks" }
    ],
    metrics: [
      { label: "Signals Analyzed", value: "24/7" },
      { label: "Match Confidence", value: "94%" },
      { label: "False Positives", value: "<5%" }
    ],
    smartDefaults: null
  },
  {
    id: 4,
    beat: "PREDICT",
    title: "See The Future. Run What-If Scenarios.",
    subtitle: "Predictive intelligence for proactive leadership",
    phase: "PREDICT",
    phaseColor: "bg-[#C9A84C]",
    icon: TrendingUp,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/20",
    time: 75,
    description: "Execution OS forecasts which triggers are most likely to fire in the next 30, 60, and 90 days. Run what-if scenarios to see how your organization would respond. Get your team aligned BEFORE the crisis—not during it.",
    roleWins: [
      { role: "CEO", benefit: "Board-ready forecasts of strategic risks and opportunities" },
      { role: "CFO", benefit: "Budget impact modeling across multiple scenarios" },
      { role: "Chief Strategy Officer", benefit: "Test strategy resilience before market moves" }
    ],
    metrics: [
      { label: "Forecast Horizon", value: "90 days" },
      { label: "Scenario Planning", value: "Unlimited" },
      { label: "Proactive vs Reactive", value: "10x better" }
    ],
    smartDefaults: {
      title: "What-If Scenario Planning",
      items: [
        { domain: "Risk Modeling", defaults: "See probability changes with different assumptions" },
        { domain: "Resource Planning", defaults: "Test if your teams are ready before you need them" },
        { domain: "Budget Stress-Test", defaults: "Model financial impact across scenarios" }
      ]
    }
  },
  {
    id: 5,
    beat: "EXECUTE",
    title: "One Click. 12 Minutes. Everyone Aligned.",
    subtitle: "Execution OS handles the coordination so you handle the crisis",
    phase: "EXECUTE",
    phaseColor: "bg-[#C9A84C]",
    icon: Zap,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/20",
    time: 120,
    description: "When you activate a playbook, Execution OS instantly notifies all stakeholders, creates tasks in your existing PM tools (Jira, Asana, etc.), stages all documents, and unlocks pre-approved budgets. Your team sees their role-specific dashboard—they know exactly what to do.",
    roleWins: [
      { role: "CEO", benefit: "Board notification happens automatically at thresholds" },
      { role: "COO", benefit: "See all 47 stakeholders acknowledge in real-time" },
      { role: "CTO", benefit: "Technical tasks appear in Jira with full context" }
    ],
    metrics: [
      { label: "Time to Align", value: "12 min" },
      { label: "vs. Traditional", value: "72 hrs" },
      { label: "Faster", value: "360x" }
    ],
    smartDefaults: {
      title: "What Happens in 12 Minutes",
      items: [
        { domain: "Stakeholders", defaults: "47 executives notified, acknowledgments tracked" },
        { domain: "Tasks", defaults: "127 tasks created in Jira with acceptance criteria" },
        { domain: "Budgets", defaults: "$2.5M pre-approved spend unlocked" }
      ]
    }
  },
  {
    id: 6,
    beat: "ADVANCE",
    title: "Every Execution Makes You Stronger",
    subtitle: "Institutional learning that stays with the company",
    phase: "ADVANCE",
    phaseColor: "bg-[#DFC178]",
    icon: Brain,
    color: "text-[#DFC178]",
    bgColor: "bg-[#DFC178]/20",
    time: 160,
    description: "After each execution, Execution OS captures what worked, what didn't, and suggests improvements. This knowledge stays with your organization—not in the head of the executive who might leave. Your playbooks get better every time.",
    roleWins: [
      { role: "CEO", benefit: "Institutional knowledge survives leadership changes" },
      { role: "COO", benefit: "Process improvements captured automatically" },
      { role: "CHRO", benefit: "Onboarding new leaders is faster with documented playbooks" }
    ],
    metrics: [
      { label: "Lessons Captured", value: "Automatic" },
      { label: "Playbook Updates", value: "Suggested" },
      { label: "Next Execution", value: "15% faster" }
    ],
    smartDefaults: null
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

const VALUE_RECOVERED = [
  { icon: Timer, title: "Executive Time", value: "50+ hours", description: "per major event" },
  { icon: DollarSign, title: "Planning Cost", value: "$10K-25K", description: "eliminated" },
  { icon: Shield, title: "Value Protected", value: "$500K-2M", description: "per event" },
  { icon: Award, title: "Response Speed", value: "360x", description: "faster than industry" },
  { icon: TrendingUp, title: "Predictive Power", value: "90 days", description: "forecasting horizon" }
];

export default function CustomerDemo() {
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
    <div className="min-h-screen bg-[#0A0F2E] flex flex-col text-white">
      <StandardNav />
      
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <Badge className="bg-[#C9A84C] text-[#0A0F2E] mb-3">
              Executive Demo — Execution Confidence
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-[#C9A84C] mb-2" data-testid="heading-customer-demo" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Execute Strategy at the Speed of Disruption
            </h1>
            <p className="text-lg text-white/80">
              From strategic event to coordinated response in 12 minutes. Success favors the prepared.
            </p>
          </div>

          {/* Playback Controls */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {!isPlaying ? (
                    <Button
                      onClick={() => { setManualMode(false); setIsPlaying(true); }}
                      className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"
                      data-testid="button-play-demo"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {elapsedTime > 0 ? 'Resume' : 'Auto Play'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsPlaying(false)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
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
                    className={`text-sm ${manualMode ? 'text-[#C9A84C]' : 'text-white/60'}`}
                    data-testid="button-manual-mode"
                  >
                    Manual Mode
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-white/60 hover:text-white"
                    data-testid="button-reset-demo"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">Speed:</span>
                    {[1, 2, 4].map((speed) => (
                      <Button
                        key={speed}
                        variant="ghost"
                        size="sm"
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`text-xs px-2 ${playbackSpeed === speed ? 'text-[#C9A84C] bg-[#C9A84C]/20' : 'text-white/60'}`}
                        data-testid={`button-speed-${speed}x`}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                    <Clock className="h-4 w-4 text-[#C9A84C]" />
                    <span className="text-white font-mono text-sm">
                      {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-white/40 text-xs">/ 3:00</span>
                  </div>
                </div>
              </div>
              <Progress value={(elapsedTime / DEMO_DURATION) * 100} className="h-1 mt-3 bg-white/10" />
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
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  idx === currentStageIndex
                    ? `${stage.phaseColor} text-[#0A0F2E]`
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
                data-testid={`button-stage-${idx}`}
              >
                {stage.beat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${currentStage.phaseColor} text-[#0A0F2E]`}>
                        {currentStage.phase}
                      </Badge>
                      <span className="text-white/60 text-sm">
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
                          className="text-white/60 hover:text-white"
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
                          className="text-white/60 hover:text-white"
                          data-testid="button-skip-to-end"
                        >
                          <SkipForward className="h-4 w-4 mr-1" />
                          Skip
                        </Button>
                      </div>
                    )}
                  </div>
                  <Progress value={progress} className="h-1 mt-4 bg-white/10" />
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
                        <div className={`p-4 rounded-xl ${currentStage.bgColor}`}>
                          <StageIcon className={`h-8 w-8 ${currentStage.color}`} />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {currentStage.title}
                          </h2>
                          <p className={`text-lg ${currentStage.color} mb-3`}>
                            {currentStage.subtitle}
                          </p>
                          <p className="text-white/80 leading-relaxed">
                            {currentStage.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {currentStage.metrics.map((metric, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
                            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                            <div className="text-xs text-white/40">{metric.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Role-Specific Wins */}
                      <div className="bg-[#0A0F2E] border border-[#C9A84C]/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <UserCheck className="h-4 w-4 text-[#C9A84C]" />
                          <span className="font-medium text-white">What This Means For You</span>
                        </div>
                        <div className="space-y-2">
                          {currentStage.roleWins.map((win, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <Badge variant="outline" className="text-xs border-[#C9A84C]/50 text-[#C9A84C] flex-shrink-0">
                                {win.role}
                              </Badge>
                              <span className="text-white/80">{win.benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Smart Defaults Panel */}
                      {currentStage.smartDefaults && (
                        <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <Settings className="h-4 w-4 text-[#DFC178]" />
                            <span className="font-medium text-white">{currentStage.smartDefaults.title}</span>
                          </div>
                          <div className="space-y-3">
                            {currentStage.smartDefaults.items.map((item, idx) => (
                              <div key={idx} className="text-sm">
                                <div className="font-semibold text-white/90">{item.domain}</div>
                                <div className="text-white/60">{item.defaults}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Execution Status Card */}
              <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white">
                      <Zap className="h-4 w-4 text-[#2B8A6E]" />
                      EXECUTION STATUS
                    </CardTitle>
                    {elapsedTime > 120 && (
                      <Badge className="bg-[#2B8A6E] text-white">LIVE</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Stakeholders Notified</span>
                    <span className="text-white font-medium">47 / 47</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Acknowledgments</span>
                    <span className="text-white font-medium">{acknowledgedStakeholders.length} / 47</span>
                  </div>
                  <Progress value={(acknowledgedStakeholders.length / 47) * 100} className="h-1.5 bg-white/10" />
                  
                  <div className="space-y-3 pt-2">
                    <AnimatePresence mode="popLayout">
                      {acknowledgedStakeholders.slice(-4).reverse().map((s, i) => (
                        <motion.div
                          key={s.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 text-xs bg-white/5 p-2 rounded border border-white/10"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#2B8A6E]/20 flex items-center justify-center text-[#2B8A6E]">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="font-medium text-white truncate">{s.name}</div>
                            <div className="text-white/40 truncate">{s.role}</div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>

              {/* Value Realized Card (Only shown at end) */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-[#0A0F2E] border-[#C9A84C] border-2 shadow-lg shadow-[#C9A84C]/10">
                    <CardHeader className="p-4 border-b border-[#C9A84C]/20">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                        <TrendingUp className="h-4 w-4 text-[#C9A84C]" />
                        VALUE RECOVERED
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      {VALUE_RECOVERED.map((val, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="p-2 bg-[#C9A84C]/10 rounded border border-[#C9A84C]/20">
                            <val.icon className="h-4 w-4 text-[#C9A84C]" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{val.value}</div>
                            <div className="text-xs text-white/60">{val.title} {val.description}</div>
                          </div>
                        </div>
                      ))}
                      <Button 
                        className="w-full bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold mt-2"
                        onClick={() => setLocation('/contact')}
                      >
                        Contact for Full Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
