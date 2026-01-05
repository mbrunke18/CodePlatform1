import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import StandardNav from '@/components/layout/StandardNav';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Maximize2,
  Monitor,
  FileText,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  BarChart3,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Eye,
  Settings,
  BookOpen,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: string;
  act: number;
  actName: string;
  title: string;
  subtitle?: string;
  content: 'slide' | 'demo-transition';
  demoTarget?: string;
  notes: string;
  visual: 'title' | 'problem' | 'market' | 'solution' | 'phase' | 'demo' | 'metrics' | 'competitive' | 'financial' | 'cta';
  data?: any;
}

const PRESENTATION_SLIDES: Slide[] = [
  // ACT 1: HOOK (2 min)
  {
    id: 'title',
    act: 1,
    actName: 'Hook',
    title: 'M',
    subtitle: 'Strategic Execution Operating System',
    content: 'slide',
    notes: 'Welcome everyone. Today I want to show you how we\'re transforming strategic execution for Fortune 1000 companies.',
    visual: 'title'
  },
  {
    id: 'mission',
    act: 1,
    actName: 'Hook',
    title: 'Success Favors the Prepared',
    subtitle: 'The Strategic Execution Operating System',
    content: 'slide',
    notes: 'M fundamentally changes how Fortune 1000 leaders work—replacing reactive scrambles with coordinated precision, turning emerging opportunities into decisive action, and transforming risk into competitive advantage.',
    visual: 'title',
    data: {
      tagline: 'From days to minutes.',
      description: 'Born from the split-second discipline that wins championships, built for the moments that define companies.'
    }
  },
  
  // ACT 2: PROBLEM & MARKET (4 min)
  {
    id: 'problem-1',
    act: 2,
    actName: 'Problem & Market',
    title: 'The Problem',
    subtitle: 'Strategic execution is broken',
    content: 'slide',
    notes: 'Right now, when a critical market signal appears—a competitor move, regulatory change, or customer shift—it takes enterprises 72+ hours just to get the information to decision-makers.',
    visual: 'problem',
    data: {
      stats: [
        { value: '72+', unit: 'Hours', label: 'Signal to Decision' },
        { value: '15+', unit: 'Meetings', label: 'To Align Stakeholders' },
        { value: '$10-50M', unit: '', label: 'Annual Revenue at Risk' }
      ]
    }
  },
  {
    id: 'problem-2',
    act: 2,
    actName: 'Problem & Market',
    title: 'The Cost of Slow',
    content: 'slide',
    notes: 'Every hour of delay means lost market share, revenue leakage, and reputation damage. Your competitors who move faster capture the opportunity.',
    visual: 'problem',
    data: {
      consequences: [
        { icon: 'target', text: 'Lost Market Share', desc: 'First-mover advantage goes to faster competitors' },
        { icon: 'dollar', text: 'Revenue Leakage', desc: 'Opportunities expire before you can act' },
        { icon: 'shield', text: 'Reputation Risk', desc: 'Reactive positioning signals weakness' }
      ]
    }
  },
  {
    id: 'market',
    act: 2,
    actName: 'Problem & Market',
    title: 'The Opportunity',
    subtitle: '$45-60 Billion Total Addressable Market',
    content: 'slide',
    notes: 'This is a massive market at the intersection of strategic planning, business intelligence, and workflow automation. No one owns this space yet.',
    visual: 'market',
    data: {
      tam: '$45-60B',
      sam: '$12B',
      som: '$2.4B',
      segments: [
        'Strategic Planning Software',
        'Business Intelligence',
        'Workflow Automation',
        'Decision Intelligence'
      ]
    }
  },
  
  // ACT 3: PRODUCT DEEP DIVE (8 min)
  {
    id: 'solution',
    act: 3,
    actName: 'Product Deep Dive',
    title: 'Introducing M',
    subtitle: 'The Strategic Execution Operating System',
    content: 'slide',
    notes: 'M is the first platform that connects signals to playbooks to execution to learning. A complete closed-loop system.',
    visual: 'solution',
    data: {
      phases: ['IDENTIFY', 'DETECT', 'EXECUTE', 'ADVANCE'],
      velocity: '12 minutes',
      playbooks: '166'
    }
  },
  {
    id: 'phase-identify',
    act: 3,
    actName: 'Product Deep Dive',
    title: 'IDENTIFY',
    subtitle: 'Build Your Depth Chart',
    content: 'slide',
    notes: '166 pre-built playbooks across 9 strategic domains. Customize with your stakeholders, budgets, and approval workflows. Be ready before signals arrive.',
    visual: 'phase',
    data: {
      phase: 'IDENTIFY',
      icon: 'book',
      color: 'violet',
      features: [
        '166 strategic playbooks across 9 domains',
        'Pre-approved budgets and stakeholders',
        'Customizable triggers and conditions',
        'Enterprise integration templates'
      ]
    }
  },
  {
    id: 'phase-detect',
    act: 3,
    actName: 'Product Deep Dive',
    title: 'DETECT',
    subtitle: 'Monitor Signals',
    content: 'slide',
    notes: 'Our AI continuously monitors 12 intelligence signal categories across 92 data points. It detects weak signals before they become crises and recommends the right playbook.',
    visual: 'phase',
    data: {
      phase: 'DETECT',
      icon: 'eye',
      color: 'blue',
      features: [
        '12 intelligence signal categories',
        '92 monitored data points',
        'Weak signal detection',
        'AI-powered playbook recommendations'
      ]
    }
  },
  {
    id: 'phase-execute',
    act: 3,
    actName: 'Product Deep Dive',
    title: 'EXECUTE',
    subtitle: '12-Minute Coordinated Response',
    content: 'slide',
    notes: 'When a playbook activates, M orchestrates everything: notifications, task assignments, approvals, and integrations. From signal to action in 12 minutes.',
    visual: 'phase',
    data: {
      phase: 'EXECUTE',
      icon: 'zap',
      color: 'amber',
      features: [
        'Real-time stakeholder coordination',
        'Automated task orchestration',
        'Pre-approved budget deployment',
        'Enterprise system integration'
      ]
    }
  },
  {
    id: 'phase-advance',
    act: 3,
    actName: 'Product Deep Dive',
    title: 'ADVANCE',
    subtitle: 'Review the Film',
    content: 'slide',
    notes: 'After each execution, M captures outcomes and uses AI to analyze what worked. It suggests playbook refinements that make you smarter every cycle.',
    visual: 'phase',
    data: {
      phase: 'ADVANCE',
      icon: 'brain',
      color: 'amber',
      features: [
        'Outcome tracking and analysis',
        'AI-powered pattern recognition',
        'Playbook optimization suggestions',
        'Institutional knowledge capture'
      ]
    }
  },
  {
    id: 'demo-transition',
    act: 3,
    actName: 'Product Deep Dive',
    title: 'Live Demo',
    subtitle: 'See M in Action',
    content: 'demo-transition',
    demoTarget: '/executive-simulation',
    notes: 'Now let me show you how this works in practice. I\'ll walk you through a real scenario where a competitor announces a major product launch.',
    visual: 'demo'
  },
  
  // ACT 4: PROOF & TRACTION (5 min)
  {
    id: 'metrics',
    act: 4,
    actName: 'Proof & Traction',
    title: 'The Results',
    subtitle: 'Measurable Impact',
    content: 'slide',
    notes: 'Our early customers are seeing dramatic improvements. 3,180 times faster response. From 72 hours to 12 minutes.',
    visual: 'metrics',
    data: {
      primary: { value: '3,180x', label: 'Faster Response' },
      secondary: [
        { value: '12', unit: 'min', label: 'Average Response Time' },
        { value: '84.4%', label: 'Future Readiness Index™' },
        { value: '166', label: 'Strategic Playbooks' }
      ]
    }
  },
  {
    id: 'competitive',
    act: 4,
    actName: 'Proof & Traction',
    title: 'Why M?',
    subtitle: 'The Only Closed-Loop Platform',
    content: 'slide',
    notes: 'Unlike point solutions, M is the only platform that connects all four phases. Palantir does analytics. Anaplan does planning. Dataminr does signals. Only M does execution.',
    visual: 'competitive',
    data: {
      competitors: [
        { name: 'Palantir', has: ['Analytics'], missing: ['Playbooks', 'Execution', 'Learning'] },
        { name: 'Anaplan', has: ['Planning'], missing: ['Signals', 'Execution', 'Learning'] },
        { name: 'Dataminr', has: ['Signals'], missing: ['Playbooks', 'Execution', 'Learning'] },
        { name: 'M', has: ['Signals', 'Playbooks', 'Execution', 'Learning'], missing: [] }
      ]
    }
  },
  {
    id: 'roi',
    act: 4,
    actName: 'Proof & Traction',
    title: 'ROI Calculator',
    subtitle: 'The Business Case',
    content: 'slide',
    notes: 'For a typical Fortune 1000, we estimate $15-40M in annual value from faster response, avoided losses, and captured opportunities.',
    visual: 'metrics',
    data: {
      roi: [
        { category: 'Avoided Revenue Loss', value: '$8-15M', desc: 'Faster threat response' },
        { category: 'Captured Opportunities', value: '$5-20M', desc: 'First-mover advantage' },
        { category: 'Efficiency Gains', value: '$2-5M', desc: 'Reduced coordination time' }
      ],
      total: '$15-40M',
      payback: '< 3 months'
    }
  },
  
  // ACT 5: GROWTH & ASK (6 min)
  {
    id: 'business-model',
    act: 5,
    actName: 'Growth & Ask',
    title: 'Business Model',
    subtitle: 'Enterprise SaaS',
    content: 'slide',
    notes: 'Premium enterprise pricing for Fortune 1000. Three tiers from $250K to $1.5M+ based on company size and deployment scope. Strong land-and-expand motion.',
    visual: 'financial',
    data: {
      pricing: [
        { tier: 'Enterprise', price: '$250K', desc: '3 Business Units, 50 playbooks, Standard integrations' },
        { tier: 'Enterprise Plus', price: '$450K', desc: '10 Business Units, 100 playbooks, Full integration suite' },
        { tier: 'Global', price: '$750K-$1.5M+', desc: 'Unlimited scope, Custom AI, Multi-region' }
      ],
      metrics: [
        { label: 'ACV', value: '$450K' },
        { label: 'Gross Margin', value: '85%' },
        { label: 'NRR Target', value: '130%' }
      ]
    }
  },
  {
    id: 'roadmap',
    act: 5,
    actName: 'Growth & Ask',
    title: 'Growth Path',
    subtitle: '$300M ARR by Year 5',
    content: 'slide',
    notes: 'Land at $250K-$450K, expand to $750K+ as customers add business units. With 130%+ NRR, Year 5 average ACV reaches $750K across 400 enterprise accounts.',
    visual: 'financial',
    data: {
      milestones: [
        { year: 'Year 1', arr: '$12M', customers: 30, focus: 'Product-market fit' },
        { year: 'Year 2', arr: '$40M', customers: 70, focus: 'Scale sales team' },
        { year: 'Year 3', arr: '$100M', customers: 150, focus: 'International expansion' },
        { year: 'Year 5', arr: '$300M', customers: 400, focus: 'Market leadership' }
      ]
    }
  },
  {
    id: 'cta-investors',
    act: 5,
    actName: 'Growth & Ask',
    title: 'For Investors',
    subtitle: 'Join Us in Transforming Strategic Execution',
    content: 'slide',
    notes: 'We\'re raising our Series A to accelerate growth. We\'d love to have you as a partner on this journey.',
    visual: 'cta',
    data: {
      type: 'investor',
      actions: [
        { label: 'Schedule Diligence Session', icon: 'calendar' },
        { label: 'Access Data Room', icon: 'folder' },
        { label: 'Meet the Team', icon: 'users' }
      ]
    }
  },
  {
    id: 'cta-customers',
    act: 5,
    actName: 'Growth & Ask',
    title: 'For Enterprise Leaders',
    subtitle: 'Start Your Strategic Velocity Journey',
    content: 'slide',
    notes: 'For our enterprise customers, we offer a 30-day Strategic Velocity Assessment to prove value before full deployment.',
    visual: 'cta',
    data: {
      type: 'customer',
      actions: [
        { label: '30-Day Strategic Velocity Assessment', icon: 'zap' },
        { label: 'Custom Playbook Configuration', icon: 'settings' },
        { label: 'Executive Workshop', icon: 'presentation' }
      ]
    }
  },
  {
    id: 'closing',
    act: 5,
    actName: 'Growth & Ask',
    title: 'Thank You',
    subtitle: 'Questions?',
    content: 'slide',
    notes: 'Thank you for your time. I\'m happy to answer any questions or dive deeper into any area.',
    visual: 'title',
    data: {
      contact: {
        email: 'hello@m-platform.com',
        website: 'm-platform.com'
      }
    }
  }
];

function InvestorPresentation() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slide = PRESENTATION_SLIDES[currentSlide];
  const totalSlides = PRESENTATION_SLIDES.length;
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  const goToNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, totalSlides]);

  const goToPrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const launchDemo = useCallback(() => {
    if (slide.demoTarget) {
      window.open(slide.demoTarget, '_blank');
    }
  }, [slide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          goToNext();
          break;
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          goToPrev();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'n':
          e.preventDefault();
          setShowNotes(prev => !prev);
          break;
        case 'Escape':
          if (!document.fullscreenElement) {
            setLocation('/');
          }
          break;
        case 'Home':
          e.preventDefault();
          setCurrentSlide(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentSlide(totalSlides - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, toggleFullscreen, setLocation, totalSlides]);

  const renderSlideContent = () => {
    switch (slide.visual) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {slide.id === 'title' && (
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl">
                  <span className="text-6xl font-bold text-white">M</span>
                </div>
              )}
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">{slide.title}</h1>
              {slide.subtitle && (
                <p className="text-2xl md:text-3xl text-slate-300">{slide.subtitle}</p>
              )}
              {slide.data?.tagline && (
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mt-8"
                >
                  {slide.data.tagline}
                </motion.p>
              )}
              {slide.data?.description && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl text-slate-400 mt-4 max-w-2xl"
                >
                  {slide.data.description}
                </motion.p>
              )}
              {slide.data?.contact && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-12 space-y-2"
                >
                  <p className="text-xl text-slate-400">{slide.data.contact.email}</p>
                  <p className="text-lg text-slate-500">{slide.data.contact.website}</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        );

      case 'problem':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4"
            >
              {slide.title}
            </motion.h2>
            {slide.subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl text-slate-400 mb-12"
              >
                {slide.subtitle}
              </motion.p>
            )}
            
            {slide.data?.stats && (
              <div className="grid grid-cols-3 gap-12">
                {slide.data.stats.map((stat: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="text-center"
                  >
                    <div className="w-28 h-28 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                      {i === 0 && <Clock className="w-12 h-12 text-red-400" />}
                      {i === 1 && <Users className="w-12 h-12 text-amber-400" />}
                      {i === 2 && <TrendingUp className="w-12 h-12 text-yellow-400" />}
                    </div>
                    <div className="text-4xl font-bold text-red-400">{stat.value}</div>
                    <div className="text-lg text-slate-400">{stat.unit}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {slide.data?.consequences && (
              <div className="grid grid-cols-3 gap-8 max-w-5xl">
                {slide.data.consequences.map((item: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
                  >
                    <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                      {item.icon === 'target' && <Target className="w-7 h-7 text-red-400" />}
                      {item.icon === 'dollar' && <DollarSign className="w-7 h-7 text-red-400" />}
                      {item.icon === 'shield' && <Shield className="w-7 h-7 text-red-400" />}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.text}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'market':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4"
            >
              {slide.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-400 mb-12"
            >
              {slide.subtitle}
            </motion.p>
            
            <div className="flex items-center gap-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-500/50">
                  <div className="w-56 h-56 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center border border-blue-500/50">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/60 to-purple-500/60 flex items-center justify-center border border-blue-500/50">
                      <span className="text-2xl font-bold text-white">{slide.data?.som}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                  <span className="text-lg font-semibold text-blue-400">{slide.data?.tam}</span>
                  <span className="text-sm text-slate-400 ml-2">TAM</span>
                </div>
                <div className="absolute top-16 -right-4 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                  <span className="text-lg font-semibold text-purple-400">{slide.data?.sam}</span>
                  <span className="text-sm text-slate-400 ml-2">SAM</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Market Segments</h3>
                {slide.data?.segments.map((segment: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-lg text-slate-300">{segment}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        );

      case 'solution':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">M</span>
              </div>
              <h2 className="text-5xl font-bold text-white">{slide.title}</h2>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-400 mb-12"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mb-12"
            >
              {slide.data?.phases.map((phase: string, i: number) => (
                <div key={phase} className="flex items-center">
                  <div className={`px-6 py-3 rounded-xl font-semibold text-lg ${
                    phase === 'IDENTIFY' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
                    phase === 'DETECT' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    phase === 'EXECUTE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {phase}
                  </div>
                  {i < 3 && <ArrowRight className="w-6 h-6 text-slate-500 mx-2" />}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-8"
            >
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {slide.data?.velocity}
                </div>
                <div className="text-slate-400 mt-2">Response Time</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {slide.data?.playbooks}
                </div>
                <div className="text-slate-400 mt-2">Strategic Playbooks</div>
              </div>
            </motion.div>
          </div>
        );

      case 'phase':
        const phaseColors: Record<string, { bg: string, border: string, text: string, icon: string }> = {
          IDENTIFY: { bg: 'bg-violet-500/20', border: 'border-violet-500/30', text: 'text-violet-400', icon: 'text-violet-400' },
          DETECT: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-400' },
          EXECUTE: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'text-emerald-400' },
          ADVANCE: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'text-amber-400' }
        };
        const colors = phaseColors[slide.data?.phase] || phaseColors.IDENTIFY;
        
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`w-24 h-24 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 border ${colors.border}`}
            >
              {slide.data?.phase === 'IDENTIFY' && <BookOpen className={`w-12 h-12 ${colors.icon}`} />}
              {slide.data?.phase === 'DETECT' && <Eye className={`w-12 h-12 ${colors.icon}`} />}
              {slide.data?.phase === 'EXECUTE' && <Zap className={`w-12 h-12 ${colors.icon}`} />}
              {slide.data?.phase === 'ADVANCE' && <Brain className={`w-12 h-12 ${colors.icon}`} />}
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-5xl font-bold ${colors.text} mb-4`}
            >
              {slide.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-400 mb-12"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-6 max-w-3xl"
            >
              {slide.data?.features.map((feature: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className={`w-6 h-6 ${colors.text}`} />
                  <span className="text-lg text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case 'demo':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-8 mx-auto border border-blue-500/30">
                <Play className="w-16 h-16 text-blue-400" />
              </div>
              <h2 className="text-5xl font-bold text-white mb-4">{slide.title}</h2>
              <p className="text-2xl text-slate-400 mb-8">{slide.subtitle}</p>
              <Button 
                size="lg" 
                onClick={launchDemo}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-xl"
                data-testid="button-launch-demo"
              >
                <Play className="w-6 h-6 mr-3" />
                Launch Executive Simulation
              </Button>
              <p className="text-sm text-slate-500 mt-4">Opens in new tab • Return here after demo</p>
            </motion.div>
          </div>
        );

      case 'metrics':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4"
            >
              {slide.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-400 mb-12"
            >
              {slide.subtitle}
            </motion.p>

            {slide.data?.primary && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  {slide.data.primary.value}
                </div>
                <div className="text-2xl text-slate-400">{slide.data.primary.label}</div>
              </motion.div>
            )}

            {slide.data?.secondary && (
              <div className="grid grid-cols-3 gap-8">
                {slide.data.secondary.map((metric: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center"
                  >
                    <div className="text-4xl font-bold text-white">
                      {metric.value}
                      {metric.unit && <span className="text-2xl text-slate-400 ml-1">{metric.unit}</span>}
                    </div>
                    <div className="text-slate-400 mt-2">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {slide.data?.roi && (
              <div className="space-y-6 max-w-2xl w-full">
                {slide.data.roi.map((item: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="flex items-center justify-between bg-slate-800/50 rounded-xl p-5 border border-slate-700"
                  >
                    <div>
                      <div className="text-lg font-semibold text-white">{item.category}</div>
                      <div className="text-sm text-slate-400">{item.desc}</div>
                    </div>
                    <div className="text-2xl font-bold text-green-400">{item.value}</div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-between bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-500/30"
                >
                  <div className="text-xl font-semibold text-white">Total Annual Value</div>
                  <div>
                    <span className="text-3xl font-bold text-green-400">{slide.data.total}</span>
                    <span className="text-slate-400 ml-4">Payback: {slide.data.payback}</span>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        );

      case 'competitive':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4"
            >
              {slide.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-400 mb-12"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-4xl"
            >
              <div className="grid grid-cols-5 gap-4 mb-4 px-4">
                <div></div>
                <div className="text-center text-sm text-slate-400">Signals</div>
                <div className="text-center text-sm text-slate-400">Playbooks</div>
                <div className="text-center text-sm text-slate-400">Execution</div>
                <div className="text-center text-sm text-slate-400">Learning</div>
              </div>
              {slide.data?.competitors.map((comp: any, i: number) => (
                <motion.div
                  key={comp.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`grid grid-cols-5 gap-4 p-4 rounded-xl mb-2 ${
                    comp.name === 'M' 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                      : 'bg-slate-800/50 border border-slate-700'
                  }`}
                >
                  <div className={`font-semibold ${comp.name === 'M' ? 'text-blue-400' : 'text-white'}`}>
                    {comp.name}
                  </div>
                  {['Signals', 'Playbooks', 'Execution', 'Learning'].map((cap) => (
                    <div key={cap} className="flex justify-center">
                      {comp.has.includes(cap) ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case 'financial':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4"
            >
              {slide.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-400 mb-12"
            >
              {slide.subtitle}
            </motion.p>

            {slide.data?.pricing && (
              <div className="grid grid-cols-3 gap-6 mb-8">
                {slide.data.pricing.map((tier: any, i: number) => (
                  <motion.div
                    key={tier.tier}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`bg-slate-800/50 rounded-xl p-6 border ${
                      i === 2 ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-slate-700'
                    }`}
                  >
                    <div className="text-lg font-semibold text-white mb-2">{tier.tier}</div>
                    <div className="text-3xl font-bold text-blue-400 mb-4">{tier.price}<span className="text-sm text-slate-400">/year</span></div>
                    <div className="text-sm text-slate-400">{tier.desc}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {slide.data?.metrics && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-12"
              >
                {slide.data.metrics.map((m: any) => (
                  <div key={m.label} className="text-center">
                    <div className="text-3xl font-bold text-white">{m.value}</div>
                    <div className="text-sm text-slate-400">{m.label}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {slide.data?.milestones && (
              <div className="w-full max-w-4xl">
                <div className="flex items-end justify-between gap-4 mb-8">
                  {slide.data.milestones.map((m: any, i: number) => (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="flex-1"
                    >
                      <div 
                        className="bg-gradient-to-t from-blue-500/40 to-purple-500/40 rounded-t-lg border border-blue-500/30 flex items-end justify-center"
                        style={{ height: `${40 + i * 50}px` }}
                      >
                        <span className="text-white font-bold pb-2">{m.arr}</span>
                      </div>
                      <div className="bg-slate-800 rounded-b-lg p-3 border border-slate-700 border-t-0 text-center">
                        <div className="font-semibold text-white">{m.year}</div>
                        <div className="text-xs text-slate-400">{m.customers} customers</div>
                        <div className="text-xs text-blue-400">{m.focus}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'cta':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4"
            >
              {slide.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-400 mb-12"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {slide.data?.actions.map((action: any, i: number) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-4 bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer min-w-[400px]"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    {action.icon === 'calendar' && <BarChart3 className="w-6 h-6 text-blue-400" />}
                    {action.icon === 'folder' && <FileText className="w-6 h-6 text-blue-400" />}
                    {action.icon === 'users' && <Users className="w-6 h-6 text-blue-400" />}
                    {action.icon === 'zap' && <Zap className="w-6 h-6 text-blue-400" />}
                    {action.icon === 'settings' && <Settings className="w-6 h-6 text-blue-400" />}
                    {action.icon === 'presentation' && <Monitor className="w-6 h-6 text-blue-400" />}
                  </div>
                  <span className="text-lg text-white">{action.label}</span>
                  <ArrowRight className="w-5 h-5 text-slate-400 ml-auto" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col"
      data-testid="page-investor-presentation"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900/80 border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="text-slate-400 hover:text-white"
            data-testid="button-exit"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Exit
          </Button>
          <div className="text-sm text-slate-400">
            Act {slide.act}: <span className="text-white">{slide.actName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            Slide {currentSlide + 1} of {totalSlides}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
            className={showNotes ? 'text-blue-400' : 'text-slate-400'}
            data-testid="button-toggle-notes"
          >
            <FileText className="w-4 h-4 mr-1" />
            Notes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-slate-400 hover:text-white"
            data-testid="button-fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-700">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Slide Content */}
        <div className={`flex-1 p-8 ${showNotes ? 'pr-4' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderSlideContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Notes Panel */}
        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-slate-800/50 border-l border-slate-700 overflow-hidden"
            >
              <div className="p-6 w-80">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Speaker Notes
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {slide.notes}
                </p>

                {slide.content === 'demo-transition' && (
                  <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-400">
                      Click the button to launch the live demo in a new tab.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 py-4 bg-slate-900/80 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          {/* Act indicators */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((act) => {
              const actSlides = PRESENTATION_SLIDES.filter(s => s.act === act);
              const firstIndex = PRESENTATION_SLIDES.findIndex(s => s.act === act);
              const isActive = slide.act === act;
              const actNames = ['Hook', 'Problem', 'Product', 'Proof', 'Ask'];
              
              return (
                <button
                  key={act}
                  onClick={() => goToSlide(firstIndex)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  data-testid={`button-act-${act}`}
                >
                  {actNames[act - 1]}
                </button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={goToPrev}
              disabled={currentSlide === 0}
              className="border-slate-600"
              data-testid="button-prev"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={goToNext}
              disabled={currentSlide === totalSlides - 1}
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="button-next"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-slate-500">
            <span className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">←</span>
            <span className="px-1.5 py-0.5 bg-slate-700 rounded mr-2">→</span>
            navigate
            <span className="px-1.5 py-0.5 bg-slate-700 rounded mx-1 ml-4">F</span>
            fullscreen
            <span className="px-1.5 py-0.5 bg-slate-700 rounded mx-1 ml-4">N</span>
            notes
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap component with navigation
const InvestorPresentationWithNav = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <StandardNav />
      <div className="flex-1">
        <InvestorPresentation />
      </div>
    </div>
  );
};

export default InvestorPresentationWithNav;
