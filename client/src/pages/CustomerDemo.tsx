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

const DEMO_DURATION = 180;

const IDEA_STORY = [
  {
    id: 1,
    beat: "THE PROBLEM",
    title: "When Strategic Events Hit, Teams Scramble",
    subtitle: "20-50 hours lost just getting organized",
    phase: "PROBLEM",
    phaseColor: "bg-red-500",
    icon: AlertTriangle,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
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
    subtitle: "166 templates customized for your organization",
    phase: "IDENTIFY",
    phaseColor: "bg-violet-500",
    icon: BookOpen,
    color: "text-violet-400",
    bgColor: "bg-violet-500/20",
    time: 30,
    description: "M comes with 166 playbooks across 9 domains—from cyber incidents to M&A integration to product launches. Each one pre-configured with smart defaults for your industry. You customize once, then it's ready for instant activation.",
    roleWins: [
      { role: "CISO", benefit: "Cyber playbooks with ISO 27001, SOC2, NIST pre-loaded" },
      { role: "CFO", benefit: "Pre-approved budgets already staged for each scenario" },
      { role: "General Counsel", benefit: "Legal holds, regulatory notifications pre-staged" }
    ],
    metrics: [
      { label: "Ready Playbooks", value: "166" },
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
    phaseColor: "bg-blue-500",
    icon: Radar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    time: 60,
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
    beat: "EXECUTE",
    title: "One Click. 12 Minutes. Everyone Aligned.",
    subtitle: "M handles the coordination so you handle the crisis",
    phase: "EXECUTE",
    phaseColor: "bg-emerald-500",
    icon: Zap,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    time: 100,
    description: "When you activate a playbook, M instantly notifies all stakeholders, creates tasks in your existing PM tools (Jira, Asana, etc.), stages all documents, and unlocks pre-approved budgets. Your team sees their role-specific dashboard—they know exactly what to do.",
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
    id: 5,
    beat: "ADVANCE",
    title: "Every Execution Makes You Stronger",
    subtitle: "Institutional learning that stays with the company",
    phase: "ADVANCE",
    phaseColor: "bg-amber-500",
    icon: Brain,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    time: 150,
    description: "After each execution, M captures what worked, what didn't, and suggests improvements. This knowledge stays with your organization—not in the head of the executive who might leave. Your playbooks get better every time.",
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
  { icon: Award, title: "Response Speed", value: "360x", description: "faster than industry" }
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <StandardNav />
      
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <Badge className="bg-blue-500 text-white mb-3">
              Executive Demo — Execution Confidence
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" data-testid="heading-customer-demo">
              Execute Strategy at the Speed of Disruption
            </h1>
            <p className="text-lg text-slate-400">
              From strategic event to coordinated response in 12 minutes. Success favors the prepared.
            </p>
          </div>

          {/* Playback Controls */}
          <Card className="bg-slate-900/80 border-slate-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {!isPlaying ? (
                    <Button
                      onClick={() => { setManualMode(false); setIsPlaying(true); }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      data-testid="button-play-demo"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {elapsedTime > 0 ? 'Resume' : 'Auto Play'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsPlaying(false)}
                      variant="outline"
                      className="border-slate-600"
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
                    className={`text-sm ${manualMode ? 'text-emerald-400' : 'text-slate-400'}`}
                    data-testid="button-manual-mode"
                  >
                    Manual Mode
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-slate-400"
                    data-testid="button-reset-demo"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Speed:</span>
                    {[1, 2, 4].map((speed) => (
                      <Button
                        key={speed}
                        variant="ghost"
                        size="sm"
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`text-xs px-2 ${playbackSpeed === speed ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-400'}`}
                        data-testid={`button-speed-${speed}x`}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-white font-mono text-sm">
                      {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-slate-500 text-xs">/ 3:00</span>
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
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  idx === currentStageIndex
                    ? `${stage.phaseColor} text-white`
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
                data-testid={`button-stage-${idx}`}
              >
                {stage.beat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="border-b border-slate-700 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${currentStage.phaseColor} text-white`}>
                        {currentStage.phase}
                      </Badge>
                      <span className="text-slate-400 text-sm">
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
                          className="text-slate-400"
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
                          className="text-slate-400"
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
                        <div className={`p-4 rounded-xl ${currentStage.bgColor}`}>
                          <StageIcon className={`h-8 w-8 ${currentStage.color}`} />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white mb-1">
                            {currentStage.title}
                          </h2>
                          <p className={`text-lg ${currentStage.color} mb-3`}>
                            {currentStage.subtitle}
                          </p>
                          <p className="text-slate-400 leading-relaxed">
                            {currentStage.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {currentStage.metrics.map((metric, idx) => (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                            <div className="text-xs text-slate-400">{metric.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Role-Specific Wins */}
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <UserCheck className="h-4 w-4 text-blue-400" />
                          <span className="font-medium text-white">What This Means For You</span>
                        </div>
                        <div className="space-y-2">
                          {currentStage.roleWins.map((win, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-300 flex-shrink-0">
                                {win.role}
                              </Badge>
                              <span className="text-slate-300">{win.benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Smart Defaults Panel */}
                      {currentStage.smartDefaults && (
                        <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Settings className="h-4 w-4 text-violet-400" />
                            <span className="font-medium text-white">{currentStage.smartDefaults.title}</span>
                          </div>
                          <div className="space-y-2">
                            {currentStage.smartDefaults.items.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-white">{item.domain}:</span>{' '}
                                  <span className="text-slate-400">{item.defaults}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {!isComplete ? (
                        <Button
                          onClick={handleNextStage}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
                          data-testid="button-next-stage"
                        >
                          {currentStageIndex === IDEA_STORY.length - 2 ? 'See the Result' : 'Continue'}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4 text-center">
                            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                            <p className="text-emerald-400 font-medium text-lg">Success Favors the Prepared</p>
                            <p className="text-slate-400 text-sm">From signal to coordinated action: 12 minutes vs 72 hours</p>
                          </div>
                          
                          {/* Pilot Program Options */}
                          <div className="bg-slate-800/50 rounded-lg p-4">
                            <p className="text-white font-medium mb-3">Start With a Pilot</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                                <div className="text-sm font-medium text-white mb-1">90-Day POC</div>
                                <div className="text-xs text-slate-400 mb-2">Single domain, 20 playbooks</div>
                                <div className="text-emerald-400 text-sm font-medium">$125K</div>
                              </div>
                              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                                <div className="text-sm font-medium text-white mb-1">Domain Pilot</div>
                                <div className="text-xs text-slate-400 mb-2">Full domain, 3 executions</div>
                                <div className="text-emerald-400 text-sm font-medium">$250K</div>
                              </div>
                              <div className="p-3 bg-violet-900/30 rounded-lg border border-violet-500/30">
                                <div className="text-sm font-medium text-white mb-1">Enterprise</div>
                                <div className="text-xs text-slate-400 mb-2">All 166 playbooks</div>
                                <div className="text-violet-400 text-sm font-medium">$500K</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button
                              onClick={() => setLocation('/contact')}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              data-testid="button-schedule-pilot"
                            >
                              <Target className="mr-2 h-4 w-4" />
                              Schedule a Conversation
                            </Button>
                            <Button
                              onClick={() => setLocation('/playbook-library')}
                              variant="outline"
                              className="flex-1 border-slate-600 text-slate-300"
                              data-testid="button-explore-playbooks"
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              Explore Playbooks
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
              {/* Value Recovered */}
              <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border-emerald-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    Value Recovered Per Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {VALUE_RECOVERED.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{item.title}: <span className="text-emerald-400">{item.value}</span></div>
                          <div className="text-xs text-slate-400">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stakeholder Response - only show during EXECUTE */}
              {currentStageIndex >= 3 && (
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
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
                              isAcknowledged ? 'bg-emerald-900/30' : 'bg-slate-800/30'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${isAcknowledged ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">{stakeholder.name}</div>
                              <div className="text-xs text-slate-400 truncate">{stakeholder.role}</div>
                            </div>
                            {isAcknowledged && <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Acknowledged</span>
                        <span className="text-white font-medium">{acknowledgedStakeholders.length} / {STAKEHOLDER_ACKNOWLEDGMENTS.length}</span>
                      </div>
                      <Progress value={(acknowledgedStakeholders.length / STAKEHOLDER_ACKNOWLEDGMENTS.length) * 100} className="h-2 mt-2" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pilot Options */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-400" />
                    Start With a Pilot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-sm font-medium text-white mb-1">90-Day Proof of Concept</div>
                      <div className="text-xs text-slate-400">Single domain, 20 playbooks, 1 live execution</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-sm font-medium text-white mb-1">Domain Pilot</div>
                      <div className="text-xs text-slate-400">Full domain, all playbooks, 3 live executions</div>
                    </div>
                    <div className="p-3 bg-violet-900/30 border border-violet-500/30 rounded-lg">
                      <div className="text-sm font-medium text-white mb-1">Enterprise Pilot</div>
                      <div className="text-xs text-slate-400">All 166 playbooks, dedicated success manager</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
