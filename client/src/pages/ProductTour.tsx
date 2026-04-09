import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  Clock,
  Users,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Brain,
  Timer,
  DollarSign,
  BookOpen,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";

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
    title: 'Readiness OS',
    subtitle: 'Strategic Readiness Platform',
    narration: 'Welcome to Readiness OS — the coordination infrastructure that prepares Fortune 1000 companies for any strategic situation they\'ll face.',
    visual: 'solution'
  },
  {
    id: 'problem-1',
    type: 'cinematic',
    duration: 7000,
    title: 'The Problem',
    subtitle: 'Strategic readiness is missing',
    narration: 'Today, enterprises spend 30 days just mobilizing before the response even begins. Competitive threats go undetected until revenue is already lost.',
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
    subtitle: 'Compress 30 days into 12 minutes',
    narration: 'Readiness OS connects intelligence signals directly to pre-built playbooks, enabling coordinated response in minutes — not days.',
    visual: 'solution'
  },
  {
    id: 'phase-identify',
    type: 'phase',
    duration: 8000,
    title: 'IDENTIFY',
    subtitle: 'Build Your Depth Chart',
    narration: 'Build your strategic arsenal. 170 pre-built playbooks across 9 domains — ready to deploy instantly when needed.',
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
    narration: 'When signals fire, Readiness OS orchestrates your entire organization. Stakeholders align in parallel, not sequence.',
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
    narration: 'Experience Readiness OS through the eyes of Sarah Chen, Chief Strategy Officer at Meridian Industries.',
    visual: 'execute'
  },
  {
    id: 'demo-signal',
    type: 'demo',
    duration: 7000,
    title: 'Critical Signal Detected',
    subtitle: 'Competitor Acquisition',
    narration: 'A competitor announces a major acquisition. Readiness OS detects it instantly and recommends immediate response.',
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
    subtitle: '3,600× Execution Head Start',
    narration: 'What traditionally takes 30 days to mobilize, Readiness OS coordinates in 12 minutes. That\'s strategic velocity.',
    visual: 'metrics'
  },
  {
    id: 'comparison',
    type: 'proof',
    duration: 8000,
    title: 'Why Readiness OS?',
    subtitle: 'The Only Closed-Loop Platform',
    narration: 'Unlike Palantir, Anaplan, or Dataminr — Readiness OS connects signals to playbooks to execution to learning. One platform.',
    visual: 'comparison'
  },
  {
    id: 'cta',
    type: 'cta',
    duration: 10000,
    title: 'Ready to Transform Your Strategic Readiness?',
    narration: 'Request a custom demo configured with your industry, competitive landscape, and strategic priorities.',
    visual: 'cta'
  }
];

export default function ProductTour() {
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
          <p className="text-2xl font-bold text-[#0A0F2E]">30 Days</p>
          <p className="text-[#0A0F2E] font-medium">To Mobilize a Response</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-[#0A0F2E]">15+ Meetings</p>
          <p className="text-[#0A0F2E] font-medium">To Align Stakeholders</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-[#0A0F2E]">$10-50M</p>
          <p className="text-[#0A0F2E] font-medium">Annual Revenue at Risk</p>
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
          className="w-32 h-32 mx-auto mb-8 bg-[#0A0F2E] rounded-none flex items-center justify-center"
          animate={{ 
            boxShadow: ['0 0 20px rgba(201, 168, 76, 0.3)', '0 0 60px rgba(201, 168, 76, 0.5)', '0 0 20px rgba(201, 168, 76, 0.3)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Readiness OS</span>
        </motion.div>
        <div className="flex items-center justify-center gap-8 mt-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-4xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12</p>
            <p className="text-[#6B7280] uppercase tracking-widest text-[10px] font-bold">Minutes</p>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Zap className="w-12 h-12 text-[#2B8A6E]" />
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <p className="text-4xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>170</p>
            <p className="text-[#6B7280] uppercase tracking-widest text-[10px] font-bold">Playbooks</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const renderPhaseVisual = (phase: string) => {
    const phaseConfig: Record<string, { icon: typeof Shield; hex: string; items: string[] }> = {
      identify: {
        icon: BookOpen,
        hex: '#2B8A6E',
        items: ['170 Strategic Playbooks', '9 Strategic Domains', 'Pre-approved Budgets', 'Stakeholder Assignments']
      },
      detect: {
        icon: Radio,
        hex: '#0A0F2E',
        items: ['20 Signal Categories', '248+ Data Points', '24/7 AI Monitoring', 'Real-time Alerts']
      },
      execute: {
        icon: Zap,
        hex: '#C9A84C',
        items: ['12-Minute Coordination', 'Parallel Execution', 'Live Progress Tracking', 'Automatic Notifications']
      },
      advance: {
        icon: Brain,
        hex: '#2B8A6E',
        items: ['Outcome Analysis', 'AI Recommendations', 'Playbook Refinement', 'Future Readiness Index']
      }
    };

    const config = phaseConfig[phase] || phaseConfig.identify;
    const Icon = config.icon;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center gap-16 max-w-5xl">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="w-48 h-48 rounded-none flex items-center justify-center"
            style={{ backgroundColor: `${config.hex}15` }}
          >
            <div className="w-32 h-32 rounded-none flex items-center justify-center" style={{ backgroundColor: config.hex }}>
              <Icon className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.items.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  className="flex items-center gap-3 bg-white border border-[#E8E4DC] rounded-none p-4"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: config.hex }} />
                  <span className="text-[#0A0F2E] font-bold text-xs uppercase tracking-widest">{item}</span>
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
        <Card className="bg-white border-[#E8E4DC] rounded-none overflow-hidden">
          <div className="bg-[#0A0F2E] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-none flex items-center justify-center">
                  <span className="font-bold text-white">SC</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Sarah Chen</p>
                  <p className="text-sm text-white/60 uppercase tracking-widest text-[9px] font-bold">Chief Strategy Officer</p>
                </div>
              </div>
              <BrandStamp variant="dual" size="md" />
          <Badge className="bg-red-600 text-white animate-pulse rounded-none border-0 uppercase text-[9px] tracking-widest font-bold px-3 py-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                CRITICAL SIGNAL
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-[#F8F7F4] border border-red-100 rounded-none">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-900 uppercase tracking-wide">Competitor Acquisition Announced</p>
                  <p className="text-red-800 text-sm">TitanTech acquires Precision Components for $890M</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['CFO', 'CMO', 'Legal', 'Ops', 'Sales', 'Strategy'].map((role, i) => (
                  <motion.div
                    key={role}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="flex items-center gap-2 bg-[#F8F7F4] border border-[#E8E4DC] rounded-none p-3"
                  >
                    <div className="w-8 h-8 bg-[#C9A84C]/5 border border-[#E8E4DC] rounded-none flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#2B8A6E]" />
                    </div>
                    <span className="text-sm text-[#0A0F2E] font-bold uppercase tracking-widest text-[9px]">{role}</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto bg-[#2B8A6E] rounded-none flex items-center justify-center mb-4">
            <Timer className="w-12 h-12 text-white" />
          </div>
          <p className="text-5xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3,600×</p>
          <p className="text-[#0A0F2E] font-bold uppercase tracking-widest text-[10px] mt-2">Execution Head Start</p>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto bg-[#C9A84C] rounded-none flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-[#0A0F2E]" />
          </div>
          <p className="text-5xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>6</p>
          <p className="text-[#0A0F2E] font-bold uppercase tracking-widest text-[10px] mt-2">Stakeholders Aligned</p>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto bg-[#C9A84C] rounded-none flex items-center justify-center mb-4">
            <DollarSign className="w-12 h-12 text-[#0A0F2E]" />
          </div>
          <p className="text-5xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>$50M+</p>
          <p className="text-[#0A0F2E] font-bold uppercase tracking-widest text-[10px] mt-2">Revenue Protected</p>
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
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center p-3 bg-white border border-[#E8E4DC] rounded-none">
            <p className="text-[#0A0F2E] font-bold text-[9px] uppercase tracking-widest">Palantir</p>
          </motion.div>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-center p-3 bg-white border border-[#E8E4DC] rounded-none">
            <p className="text-[#0A0F2E] font-bold text-[9px] uppercase tracking-widest">Anaplan</p>
          </motion.div>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-center p-3 bg-[#0A0F2E]/10 rounded-none">
            <p className="text-[#C9A84C] font-bold text-[9px] uppercase tracking-widest">Readiness OS</p>
          </motion.div>
          
          {[
            { label: 'Signal Detection', scores: ['Custom Build', 'No', '✓ 16 Categories'] },
            { label: 'Pre-built Playbooks', scores: ['No', 'No', '✓ 170 Ready'] },
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
              <div className="p-3 bg-white border border-[#E8E4DC] rounded-none flex items-center">
                <p className="text-[#0A0F2E] font-bold text-[9px] uppercase tracking-widest">{row.label}</p>
              </div>
              {row.scores.map((score, j) => (
                <div key={j} className={`p-3 border border-[#E8E4DC] rounded-none flex items-center justify-center ${j === 2 ? 'bg-[#2B8A6E]/5 border-[#2B8A6E]/20' : 'bg-white'}`}>
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${j === 2 ? 'text-[#2B8A6E]' : 'text-slate-400'}`}>{score}</p>
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
          className="w-24 h-24 mx-auto mb-8 bg-[#0A0F2E] rounded-none flex items-center justify-center"
        >
          <span className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Readiness OS</span>
        </motion.div>
        <div className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-[#0A0F2E] hover:bg-[#141B45] text-white px-12 py-8 rounded-none font-bold uppercase tracking-[0.2em] text-xs transition-all"
              onClick={() => setLocation('/try-demo')}
            >
              <Play className="mr-3 h-5 w-5" />
              Try Interactive Demo
            </Button>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              variant="outline" 
              size="lg"
              className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none px-8 py-6 uppercase tracking-widest text-[10px] font-bold transition-all"
              onClick={() => setLocation('/playbook-library')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Explore Playbooks
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none px-8 py-6 uppercase tracking-widest text-[10px] font-bold transition-all"
              onClick={() => setLocation('/contact')}
            >
              Contact Sales
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
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
      className="fixed inset-0 bg-white overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      data-testid="page-product-tour"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2B8A6E]/10 blur-3xl" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 text-[#0A0F2E]/40 hover:text-[#0A0F2E] hover:bg-[#0A0F2E]/5 rounded-none"
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
              className="text-center mb-12"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>Scene {currentSceneIndex + 1} of {TOUR_SCENES.length}</span>
                <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-[#0A0F2E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {currentScene.title}
              </h1>
              {currentScene.subtitle && (
                <p className="text-xl text-slate-500 uppercase tracking-[0.2em] font-bold">{currentScene.subtitle}</p>
              )}
            </motion.div>
          )}

          <div className="flex-1 w-full max-w-6xl flex items-center justify-center mb-12">
            {renderVisual()}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-32 max-w-3xl text-center bg-[#F8F7F4] p-8 border border-[#E8E4DC]"
          >
            <p className="text-xl md:text-2xl text-[#0A0F2E] leading-relaxed font-medium">
              {currentScene.narration}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showControls ? 0 : 100 }}
        className="absolute bottom-0 left-0 right-0 bg-[#0A0F2E] p-6 border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Progress value={progress} className="h-0.5 bg-white/10" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevScene}
                disabled={currentSceneIndex === 0}
                className="text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 rounded-none"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12 text-white bg-white/10 hover:bg-white/20 rounded-none"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextScene}
                disabled={currentSceneIndex === TOUR_SCENES.length - 1}
                className="text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 rounded-none"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-none"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>

            <div className="flex items-center gap-3 text-white/40 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-[#C9A84C]">{getCurrentTime()}</span>
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
                  className={`w-2 h-2 rounded-none transition-all ${
                    index === currentSceneIndex 
                      ? 'bg-[#C9A84C] w-6' 
                      : index < currentSceneIndex 
                        ? 'bg-[#C9A84C]/40' 
                        : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
