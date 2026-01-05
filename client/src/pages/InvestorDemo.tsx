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
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const DEMO_DURATION = 180;

const IDEA_STORY = [
  {
    id: 1,
    beat: "THE GAP",
    title: "The $270M-$900M Problem",
    subtitle: "Why 30% of strategy value is lost in execution",
    phase: "PROBLEM",
    phaseColor: "bg-red-500",
    icon: AlertTriangle,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
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
    title: "166 Playbooks. Zero Blank Pages.",
    subtitle: "Build your depth chart before the game starts",
    phase: "IDENTIFY",
    phaseColor: "bg-violet-500",
    icon: BookOpen,
    color: "text-violet-400",
    bgColor: "bg-violet-500/20",
    time: 30,
    description: "Unlike crisis tools or PM platforms, M comes with 166 battle-tested playbooks across 9 domains. OFFENSE (M&A, Market Entry, Product Launch), DEFENSE (Crisis, Cyber, Regulatory), SPECIAL TEAMS (Digital Transformation, Competitive Response, AI Governance).",
    investorHighlight: "This is our moat. 166 playbooks = 20+ years of Fortune 500 execution experience. Competitors would need years to replicate.",
    metrics: [
      { label: "Playbooks", value: "166" },
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
    subtitle: "Human-AI partnership for strategic velocity",
    phase: "DETECT",
    phaseColor: "bg-blue-500",
    icon: Radar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    time: 60,
    description: "M's AI continuously monitors for strategic signals—competitive moves, regulatory changes, supply chain disruptions, cyber threats. When it detects a pattern, it recommends the right playbook with confidence scoring. AI monitors and recommends. Executives decide.",
    investorHighlight: "The human-AI partnership is key to enterprise adoption. We augment executives, we don't replace them. This is how you sell to Fortune 1000 C-suites.",
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
    beat: "EXECUTE",
    title: "12 Minutes. Not 72 Hours.",
    subtitle: "One-click activation with 15-section executive data",
    phase: "EXECUTE",
    phaseColor: "bg-emerald-500",
    icon: Zap,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    time: 100,
    description: "When the CISO approves, M auto-creates your Jira project, assigns every task, stages every document, and unlocks pre-approved budgets—all in 12 minutes. 47 stakeholders notified instantly. Teams don't learn M—M comes to them in tools they already use.",
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
    id: 5,
    beat: "ADVANCE",
    title: "Institutional Learning Captured",
    subtitle: "Every execution makes the next one better",
    phase: "ADVANCE",
    phaseColor: "bg-amber-500",
    icon: Brain,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    time: 150,
    description: "After resolution, M captures what worked, what didn't, and suggests playbook refinements. This institutional knowledge stays with the organization—not in someone's head who might leave. The playbook library becomes a strategic asset.",
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
  { icon: BookOpen, title: "166 Playbooks", description: "20+ years encoded" },
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <StandardNav />
      
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <Badge className="bg-purple-500 text-white mb-3">
              Investor Demo — Market Creation Story
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" data-testid="heading-investor-demo">
              M: The Strategic Execution Operating System
            </h1>
            <p className="text-lg text-slate-400">
              First mover in $15B+ SEOS category. 166 playbooks. 12-minute execution.
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
                          <p className="text-slate-400 leading-relaxed mb-4">
                            {currentStage.description}
                          </p>
                          
                          {/* Investor Highlight */}
                          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-purple-200">
                                <span className="font-medium text-purple-400">Investor Insight:</span> {currentStage.investorHighlight}
                              </p>
                            </div>
                          </div>
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

                      {/* PM Sync Panel */}
                      {currentStage.pmSync && (
                        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <GitBranch className="h-4 w-4 text-emerald-400" />
                            <span className="font-medium text-white">{currentStage.pmSync.title}</span>
                            <div className="flex gap-1 ml-auto">
                              {currentStage.pmSync.platforms.map((p, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-emerald-500/50 text-emerald-300">
                                  {p}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            {currentStage.pmSync.actions.map((action, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="text-slate-300">{action}</span>
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
                          {currentStageIndex === IDEA_STORY.length - 2 ? 'Complete Story' : 'Next Beat'}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4 text-center">
                            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                            <p className="text-emerald-400 font-medium">Story Complete</p>
                            <p className="text-slate-400 text-sm">From signal to coordinated action: 12 minutes vs 72 hours</p>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              onClick={() => setLocation('/customer-demo')}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              data-testid="button-customer-demo"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              See Customer Demo
                            </Button>
                            <Button
                              onClick={() => setLocation('/investor-presentation')}
                              variant="outline"
                              className="flex-1 border-purple-500/50 text-purple-300"
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
              <Card className="bg-gradient-to-br from-purple-900/40 to-slate-900 border-purple-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-purple-400" />
                    Enterprise Moat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MOAT_COMPONENTS.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{item.title}</div>
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

              {/* Investment Metrics */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-emerald-400" />
                    Investment Thesis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">TAM</span>
                      <span className="text-sm font-medium text-white">$15B+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Target ACV</span>
                      <span className="text-sm font-medium text-white">$500K-$2M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Beachhead</span>
                      <span className="text-sm font-medium text-white">Gaming & Hospitality</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Category</span>
                      <span className="text-sm font-medium text-emerald-400">Category Creator</span>
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
