import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import StandardNav from '@/components/layout/StandardNav';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  X,
  ChevronRight,
  Clock,
  Users,
  Shield,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Building2,
  Globe,
  ArrowRight,
  BookOpen,
  Radio,
  Activity,
  Brain,
  Lightbulb,
  Award,
  Timer,
  DollarSign,
  FileText,
  MessageSquare
} from 'lucide-react';

interface Scene {
  id: string;
  type: 'cinematic' | 'stats' | 'phase' | 'demo' | 'proof' | 'cta';
  duration: number;
  title?: string;
  subtitle?: string;
  narration: string;
  visual?: 'problem' | 'solution' | 'identify' | 'detect' | 'execute' | 'advance' | 'metrics' | 'comparison' | 'cta';
}

const TOUR_SCENES: Scene[] = [
  {
    id: 'intro',
    type: 'cinematic',
    duration: 6000,
    title: 'M',
    subtitle: 'Strategic Execution Operating System',
    narration: 'Welcome to M — the operating system that transforms how Fortune 1000 companies execute strategy.',
    visual: 'solution'
  },
  {
    id: 'problem-1',
    type: 'cinematic',
    duration: 7000,
    title: 'The Problem',
    subtitle: 'Strategic execution is broken',
    narration: 'Today, critical market signals take 72+ hours to reach decision-makers. Competitive threats go undetected until revenue is lost.',
    visual: 'problem'
  },
  {
    id: 'problem-2',
    type: 'stats',
    duration: 6000,
    narration: 'The cost of slow response: lost market share, revenue leakage, and reputation damage from reactive positioning.',
    visual: 'problem'
  },
  {
    id: 'solution',
    type: 'cinematic',
    duration: 6000,
    title: 'The Solution',
    subtitle: 'Compress 72 hours into 12 minutes',
    narration: 'M connects intelligence signals directly to pre-built playbooks, enabling coordinated response in minutes — not days.',
    visual: 'solution'
  },
  {
    id: 'phase-identify',
    type: 'phase',
    duration: 8000,
    title: 'IDENTIFY',
    subtitle: 'Build Your Depth Chart',
    narration: 'Build your strategic arsenal. 166 pre-built playbooks across 9 domains — ready to deploy instantly when needed.',
    visual: 'identify'
  },
  {
    id: 'phase-detect',
    type: 'phase',
    duration: 8000,
    title: 'DETECT',
    subtitle: 'Monitor Signals',
    narration: 'Human insight amplified by AI-powered pattern matching. We help you spot what matters—and ignore what doesn\'t.',
    visual: 'detect'
  },
  {
    id: 'phase-execute',
    type: 'phase',
    duration: 8000,
    title: 'EXECUTE',
    subtitle: 'Execute Response',
    narration: 'When signals fire, M orchestrates your entire organization. Stakeholders align in parallel, not sequence.',
    visual: 'execute'
  },
  {
    id: 'phase-advance',
    type: 'phase',
    duration: 7000,
    title: 'ADVANCE',
    subtitle: 'Review the Film',
    narration: 'Every execution feeds back into your playbooks. AI suggests refinements. Your organization gets smarter.',
    visual: 'advance'
  },
  {
    id: 'demo-intro',
    type: 'demo',
    duration: 6000,
    title: 'See It In Action',
    subtitle: 'Executive Simulation',
    narration: 'Experience M through the eyes of Sarah Chen, Chief Strategy Officer at Meridian Industries.',
    visual: 'execute'
  },
  {
    id: 'demo-signal',
    type: 'demo',
    duration: 7000,
    title: 'Critical Signal Detected',
    subtitle: 'Competitor Acquisition',
    narration: 'A competitor announces a major acquisition. M detects it instantly and recommends immediate response.',
    visual: 'detect'
  },
  {
    id: 'demo-response',
    type: 'demo',
    duration: 7000,
    title: 'Coordinated Response',
    subtitle: '6 Stakeholders, 12 Minutes',
    narration: 'One click activates your playbook. CFO, CMO, Legal, Ops, Sales — all moving in parallel.',
    visual: 'execute'
  },
  {
    id: 'proof',
    type: 'proof',
    duration: 8000,
    title: 'The Results',
    subtitle: '3,180x Faster Response',
    narration: 'What traditionally takes 72 hours, M coordinates in under 2 minutes. That\'s strategic velocity.',
    visual: 'metrics'
  },
  {
    id: 'comparison',
    type: 'proof',
    duration: 8000,
    title: 'Why M?',
    subtitle: 'The Only Closed-Loop Platform',
    narration: 'Unlike Palantir, Anaplan, or Dataminr — M connects signals to playbooks to execution to learning. One platform.',
    visual: 'comparison'
  },
  {
    id: 'cta',
    type: 'cta',
    duration: 10000,
    title: 'Ready to Transform Your Strategic Execution?',
    narration: 'Request a custom demo configured with your industry, competitive landscape, and strategic priorities.',
    visual: 'cta'
  }
];

function ProductTour() {
  const [, setLocation] = useLocation();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const currentScene = TOUR_SCENES[currentSceneIndex];
  const totalDuration = TOUR_SCENES.reduce((acc, s) => acc + s.duration, 0);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const goToNextScene = useCallback(() => {
    if (currentSceneIndex < TOUR_SCENES.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setSceneProgress(0);
    } else {
      setIsPlaying(false);
    }
  }, [currentSceneIndex]);

  const goToPrevScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
      setSceneProgress(0);
    }
  }, [currentSceneIndex]);

  useEffect(() => {
    if (!isPlaying) {
      clearTimers();
      return;
    }

    const scene = TOUR_SCENES[currentSceneIndex];
    
    progressRef.current = setInterval(() => {
      setSceneProgress(prev => {
        const newProgress = prev + (100 / (scene.duration / 100));
        return Math.min(newProgress, 100);
      });
    }, 100);

    timerRef.current = setTimeout(() => {
      goToNextScene();
    }, scene.duration);

    return () => clearTimers();
  }, [isPlaying, currentSceneIndex, goToNextScene, clearTimers]);

  useEffect(() => {
    const completedDuration = TOUR_SCENES.slice(0, currentSceneIndex).reduce((acc, s) => acc + s.duration, 0);
    const currentSceneDuration = (sceneProgress / 100) * TOUR_SCENES[currentSceneIndex].duration;
    const totalProgress = ((completedDuration + currentSceneDuration) / totalDuration) * 100;
    setProgress(totalProgress);
  }, [currentSceneIndex, sceneProgress, totalDuration]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      clearTimers();
    }
    setIsPlaying(prev => !prev);
  }, [isPlaying, clearTimers]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    const completedDuration = TOUR_SCENES.slice(0, currentSceneIndex).reduce((acc, s) => acc + s.duration, 0);
    const currentSceneDuration = (sceneProgress / 100) * TOUR_SCENES[currentSceneIndex].duration;
    return formatTime(completedDuration + currentSceneDuration);
  };

  const renderProblemVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-3 gap-8 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-12 h-12 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">72+ Hours</p>
          <p className="text-slate-400">Signal to Decision</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-orange-400">15+ Meetings</p>
          <p className="text-slate-400">To Align Stakeholders</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-12 h-12 text-yellow-400 rotate-180" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">$10-50M</p>
          <p className="text-slate-400">Annual Revenue at Risk</p>
        </motion.div>
      </div>
    </div>
  );

  const renderSolutionVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div 
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center"
          animate={{ 
            boxShadow: ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 60px rgba(59, 130, 246, 0.8)', '0 0 20px rgba(59, 130, 246, 0.5)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-6xl font-bold text-white">M</span>
        </motion.div>
        <div className="flex items-center justify-center gap-8 mt-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-4xl font-bold text-blue-400">12</p>
            <p className="text-slate-400">Minutes</p>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Zap className="w-12 h-12 text-teal-400" />
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <p className="text-4xl font-bold text-teal-400">166</p>
            <p className="text-slate-400">Playbooks</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const renderPhaseVisual = (phase: string) => {
    const phaseConfig: Record<string, { icon: typeof Shield; color: string; items: string[] }> = {
      prepare: {
        icon: BookOpen,
        color: 'blue',
        items: ['166 Strategic Playbooks', '9 Strategic Domains', 'Pre-approved Budgets', 'Stakeholder Assignments']
      },
      monitor: {
        icon: Radio,
        color: 'purple',
        items: ['16 Signal Categories', '92 Data Points', '24/7 AI Monitoring', 'Real-time Alerts']
      },
      execute: {
        icon: Zap,
        color: 'teal',
        items: ['12-Minute Coordination', 'Parallel Execution', 'Live Progress Tracking', 'Automatic Notifications']
      },
      learn: {
        icon: Brain,
        color: 'amber',
        items: ['Outcome Analysis', 'AI Recommendations', 'Playbook Refinement', 'Future Readiness Index']
      }
    };

    const config = phaseConfig[phase] || phaseConfig.prepare;
    const Icon = config.icon;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="flex items-center gap-16 max-w-5xl">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className={`w-48 h-48 rounded-full bg-${config.color}-500/20 flex items-center justify-center`}
            style={{ backgroundColor: `rgba(var(--${config.color}-500), 0.2)` }}
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-${config.color}-400 to-${config.color}-600 flex items-center justify-center`}>
              <Icon className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {config.items.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-4"
                >
                  <CheckCircle2 className={`w-5 h-5 text-${config.color}-400`} />
                  <span className="text-white font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDemoVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-slate-800/80 border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white">SC</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Sarah Chen</p>
                  <p className="text-sm text-white/80">Chief Strategy Officer</p>
                </div>
              </div>
              <Badge className="bg-red-500 text-white animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                CRITICAL SIGNAL
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Competitor Acquisition Announced</p>
                  <p className="text-slate-400 text-sm">TitanTech acquires Precision Components for $890M</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {['CFO', 'CMO', 'Legal', 'Ops', 'Sales', 'Strategy'].map((role, i) => (
                  <motion.div
                    key={role}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-3"
                  >
                    <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-sm text-white">{role}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderMetricsVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-3 gap-12 max-w-4xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mb-4">
            <Timer className="w-16 h-16 text-white" />
          </div>
          <p className="text-5xl font-bold text-teal-400">3,180x</p>
          <p className="text-slate-400 mt-2">Faster Response</p>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Users className="w-16 h-16 text-white" />
          </div>
          <p className="text-5xl font-bold text-blue-400">6</p>
          <p className="text-slate-400 mt-2">Stakeholders Aligned</p>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="w-16 h-16 text-white" />
          </div>
          <p className="text-5xl font-bold text-purple-400">$50M+</p>
          <p className="text-slate-400 mt-2">Revenue Protected</p>
        </motion.div>
      </div>
    </div>
  );

  const renderComparisonVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl"
      >
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1"></div>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center p-3 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-sm">Palantir</p>
          </motion.div>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-center p-3 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-sm">Anaplan</p>
          </motion.div>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-center p-3 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg">
            <p className="text-white font-bold text-sm">M</p>
          </motion.div>
          
          {[
            { label: 'Signal Detection', scores: ['Custom Build', 'No', '✓ 16 Categories'] },
            { label: 'Pre-built Playbooks', scores: ['No', 'No', '✓ 166 Ready'] },
            { label: 'Execution Engine', scores: ['No', 'No', '✓ 12-Minute'] },
            { label: 'Closed-Loop Learning', scores: ['Manual', 'Manual', '✓ AI-Powered'] }
          ].map((row, i) => (
            <motion.div 
              key={row.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="contents"
            >
              <div className="p-3 bg-slate-800/50 rounded-lg flex items-center">
                <p className="text-white text-sm">{row.label}</p>
              </div>
              {row.scores.map((score, j) => (
                <div key={j} className={`p-3 rounded-lg flex items-center justify-center ${j === 2 ? 'bg-teal-500/20' : 'bg-slate-800/30'}`}>
                  <p className={`text-sm ${j === 2 ? 'text-teal-400 font-medium' : 'text-slate-500'}`}>{score}</p>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderCTAVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-2xl"
      >
        <motion.div 
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center"
        >
          <span className="text-5xl font-bold text-white">M</span>
        </motion.div>
        <div className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-6 text-lg"
              onClick={() => setLocation('/executive-simulation')}
              data-testid="button-try-simulation"
            >
              <Play className="w-5 h-5 mr-2" />
              Try Executive Simulation
            </Button>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4"
          >
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setLocation('/scenario-library')}
              data-testid="button-explore-playbooks"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore 166 Playbooks
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setLocation('/foresight-radar')}
              data-testid="button-see-radar"
            >
              <Radio className="w-5 h-5 mr-2" />
              See Intelligence Radar
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-slate-400 text-sm"
          >
            Request a custom demo configured for your industry
          </motion.p>
        </div>
      </motion.div>
    </div>
  );

  const renderVisual = () => {
    switch (currentScene.visual) {
      case 'problem':
        return renderProblemVisual();
      case 'solution':
        return renderSolutionVisual();
      case 'identify':
      case 'detect':
      case 'execute':
      case 'advance':
        return renderPhaseVisual(currentScene.visual);
      case 'metrics':
        return renderMetricsVisual();
      case 'comparison':
        return renderComparisonVisual();
      case 'cta':
        return renderCTAVisual();
      default:
        return renderDemoVisual();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950 overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      data-testid="page-product-tour"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 text-white/70 hover:text-white hover:bg-white/10"
        onClick={() => setLocation('/')}
        data-testid="button-close-tour"
      >
        <X className="w-6 h-6" />
      </Button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center px-8"
        >
          {currentScene.title && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <Badge 
                className={`mb-4 ${
                  currentScene.visual === 'problem' ? 'bg-red-500/20 text-red-400' :
                  currentScene.type === 'phase' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-teal-500/20 text-teal-400'
                }`}
              >
                Scene {currentSceneIndex + 1} of {TOUR_SCENES.length}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                {currentScene.title}
              </h1>
              {currentScene.subtitle && (
                <p className="text-2xl text-slate-400">{currentScene.subtitle}</p>
              )}
            </motion.div>
          )}

          <div className="flex-1 w-full max-w-6xl flex items-center justify-center">
            {renderVisual()}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-32 max-w-3xl text-center"
          >
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
              {currentScene.narration}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showControls ? 0 : 100 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Progress value={progress} className="h-1 bg-slate-700" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevScene}
                disabled={currentSceneIndex === 0}
                className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                data-testid="button-prev-scene"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12 text-white hover:bg-white/10 rounded-full"
                data-testid="button-play-pause"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextScene}
                disabled={currentSceneIndex === TOUR_SCENES.length - 1}
                className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                data-testid="button-next-scene"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white/70 hover:text-white hover:bg-white/10"
                data-testid="button-mute"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span>{getCurrentTime()}</span>
              <span>/</span>
              <span>{formatTime(totalDuration)}</span>
            </div>

            <div className="flex items-center gap-2">
              {TOUR_SCENES.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    setCurrentSceneIndex(index);
                    setSceneProgress(0);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSceneIndex 
                      ? 'bg-teal-400 w-6' 
                      : index < currentSceneIndex 
                        ? 'bg-teal-400/50' 
                        : 'bg-slate-600'
                  }`}
                  data-testid={`button-scene-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Wrap component with navigation
const ProductTourWithNav = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <StandardNav />
      <div className="flex-1 bg-slate-950">
        <ProductTour />
      </div>
    </div>
  );
};

export default ProductTourWithNav;
