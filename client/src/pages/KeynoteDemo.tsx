import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle, Brain, Shield, Zap, Target, TrendingUp,
  Clock, Users, DollarSign, CheckCircle2, ChevronRight,
  ChevronLeft, Activity, BarChart3, Globe, ArrowRight,
  Radio, BookOpen, Play, Building2, Lightbulb, Award,
  FileText, MessageSquare, Lock, Layers, Eye, Rocket,
  Timer, Crosshair, PieChart, Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FeedItem {
  id: string;
  signalCategory: string;
  signalName: string;
  severity: string;
  aiConfidence: number;
  summary: string;
  aiAnalysis: {
    keyInsights: string[];
    dataPointsAnalyzed: number;
    confidenceScore: number;
    recommendedPlaybook: string;
    playbookNumber: string;
    urgencyLevel: string;
  };
  costOfInaction: {
    revenueAtRisk: string;
    pipelineImpact: string;
    timeDecay: string;
    competitorAdvantage: string;
  };
  source: string;
  detectedAt: string;
}

const STAGES = [
  { id: 'opening', label: 'The Problem' },
  { id: 'cost', label: 'Cost of Inaction' },
  { id: 'introducing', label: 'ExecuteIQ' },
  { id: 'signal', label: 'Signal Detection' },
  { id: 'analysis', label: 'AI Analysis' },
  { id: 'playbook', label: 'Playbook Match' },
  { id: 'decision', label: 'Executive Decision' },
  { id: 'activation', label: '12-Min Activation' },
  { id: 'idea', label: 'IDEA Framework' },
  { id: 'outcomes', label: 'Outcomes & ROI' },
  { id: 'cta', label: 'Start Pilot' },
];

function CountUp({ end, duration = 2000, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{prefix}{started ? value.toLocaleString() : '0'}{suffix}</span>;
}

function ActivationTimeline() {
  const [step, setStep] = useState(0);
  const steps = [
    { time: '0:00', label: 'Signal Detected', detail: 'AI identifies competitive threat', icon: Radio, color: 'text-red-400' },
    { time: '0:30', label: 'Playbook Matched', detail: 'Competitive Response #47 selected', icon: BookOpen, color: 'text-amber-400' },
    { time: '1:00', label: 'Stakeholders Notified', detail: '28 executives via Slack, Email, Teams', icon: Users, color: 'text-blue-400' },
    { time: '2:00', label: 'War Room Created', detail: '#war-room-competitive-2024 live', icon: Shield, color: 'text-purple-400' },
    { time: '3:30', label: 'Tasks Auto-Created', detail: '24 tasks across Jira, ServiceNow', icon: FileText, color: 'text-cyan-400' },
    { time: '5:00', label: 'Budget Pre-Approved', detail: '$250K emergency allocation released', icon: DollarSign, color: 'text-green-400' },
    { time: '7:00', label: 'First Decisions Made', detail: 'CEO approves counter-strategy', icon: CheckCircle2, color: 'text-emerald-400' },
    { time: '9:00', label: 'Documents Staged', detail: 'Press releases, board briefs ready', icon: MessageSquare, color: 'text-indigo-400' },
    { time: '11:00', label: '80% Coordinated', detail: '24 of 28 stakeholders aligned', icon: Target, color: 'text-orange-400' },
    { time: '11:47', label: 'EXECUTION COMPLETE', detail: 'Full organizational response active', icon: Zap, color: 'text-yellow-400' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const isActive = i <= step;
        const isCurrent = i === step;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: isActive ? 1 : 0.2, x: isActive ? 0 : -40 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all ${isCurrent ? 'bg-white/10 ring-1 ring-white/20 scale-[1.02]' : ''}`}
          >
            <div className="w-16 text-right font-mono text-sm text-slate-400">{s.time}</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-white/10' : 'bg-white/5'}`}>
              <Icon className={`h-5 w-5 ${isActive ? s.color : 'text-slate-600'}`} />
            </div>
            <div className="flex-1">
              <div className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-600'}`}>{s.label}</div>
              <div className={`text-xs ${isActive ? 'text-slate-400' : 'text-slate-700'}`}>{s.detail}</div>
            </div>
            {isCurrent && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-3 h-3 rounded-full bg-green-500"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function KeynoteDemo() {
  const [stage, setStage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlTimeout = useRef<ReturnType<typeof setTimeout>>();

  const { data: feedData } = useQuery<{ feed: FeedItem[] }>({
    queryKey: ['/api/pulse/intelligence-feed'],
  });

  const signal = feedData?.feed?.[0];

  const next = useCallback(() => {
    setStage(prev => Math.min(prev + 1, STAGES.length - 1));
  }, []);

  const prev = useCallback(() => {
    setStage(prev => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlTimeout.current) clearTimeout(controlTimeout.current);
    controlTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    controlTimeout.current = setTimeout(() => setShowControls(false), 5000);
    return () => { if (controlTimeout.current) clearTimeout(controlTimeout.current); };
  }, []);

  const stageContent: Record<string, JSX.Element> = {
    opening: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <AlertTriangle className="h-20 w-20 text-red-500 mx-auto mb-8" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Strategic Execution Is <span className="text-red-500">Broken</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-3 gap-12 mt-12 max-w-5xl"
        >
          <div className="text-center">
            <div className="text-6xl font-bold text-red-400 mb-3"><CountUp end={72} suffix="+" /></div>
            <div className="text-xl text-slate-400">Hours for critical signals to reach decision-makers</div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-amber-400 mb-3"><CountUp end={67} suffix="%" /></div>
            <div className="text-xl text-slate-400">Of strategic initiatives fail due to poor execution</div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-orange-400 mb-3"><CountUp end={23} suffix="%" /></div>
            <div className="text-xl text-slate-400">Of executive time wasted getting organized</div>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-2xl text-slate-500 mt-16 max-w-3xl"
        >
          Fortune 1000 companies lose billions every year because they can't move fast enough when it matters most.
        </motion.p>
      </div>
    ),

    cost: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <DollarSign className="h-20 w-20 text-red-500 mx-auto mb-8" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-7xl font-bold text-white mb-4 tracking-tight"
        >
          The <span className="text-red-500">$4.7 Trillion</span> Problem
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-2xl text-slate-400 mb-16 max-w-3xl"
        >
          Annual cost of failed strategic execution across Fortune 1000 companies
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-4 gap-8 max-w-6xl"
        >
          {[
            { icon: Clock, value: '3-5 days', label: 'Average response time to competitive threats', color: 'text-red-400', bg: 'bg-red-500/10' },
            { icon: Users, value: '30+', label: 'Stakeholders to coordinate per strategic event', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: FileText, value: '47', label: 'Documents manually created per activation', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: DollarSign, value: '$2.4M', label: 'Average cost per day of delayed response', color: 'text-green-400', bg: 'bg-green-500/10' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.2, duration: 0.6 }}
              className={`${item.bg} border border-white/5 rounded-2xl p-8 text-center`}
            >
              <item.icon className={`h-10 w-10 ${item.color} mx-auto mb-4`} />
              <div className={`text-4xl font-bold ${item.color} mb-2`}>{item.value}</div>
              <div className="text-sm text-slate-400">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    ),

    introducing: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: 'spring' }}
          className="mb-8"
        >
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center">
              <Layers className="h-14 w-14 text-white" />
            </div>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-8xl font-bold text-white mb-4 tracking-tight"
        >
          ExecuteIQ
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500" />
          <span className="text-2xl text-indigo-400 font-light tracking-widest uppercase">Strategic Execution OS</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-500" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-2xl text-slate-400 max-w-4xl mb-16 leading-relaxed"
        >
          From signal detection to full organizational response in <span className="text-white font-semibold">12 minutes</span> — not 72 hours.
          <br />166 pre-built playbooks. 9 strategic domains. AI-powered execution.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex gap-8"
        >
          {[
            { value: '166', label: 'Strategic Playbooks', icon: BookOpen },
            { value: '9', label: 'Strategic Domains', icon: Globe },
            { value: '<12min', label: 'Signal to Action', icon: Timer },
            { value: '30+', label: 'Enterprise Integrations', icon: Workflow },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <item.icon className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{item.value}</div>
              <div className="text-sm text-slate-500">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    ),

    signal: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-red-500" />
            LIVE SIGNAL DETECTED
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">Signal Intelligence Feed</h2>
          <p className="text-xl text-slate-400">Real-time monitoring across 16 categories and 100+ data points</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-5xl"
        >
          <div className="bg-slate-900/80 border border-red-500/30 rounded-2xl overflow-hidden">
            <div className="bg-red-950/50 border-b border-red-500/20 px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Radio className="h-6 w-6 text-red-500" />
                </motion.div>
                <span className="text-red-400 font-semibold text-lg">CRITICAL SIGNAL</span>
                <span className="text-slate-500 mx-2">|</span>
                <span className="text-slate-400 text-sm">
                  {signal ? new Date(signal.detectedAt).toLocaleString() : 'Just Now'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">SEVERITY</span>
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">CRITICAL</span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-white mb-3">
                {signal?.signalName || 'Competitor Product Launch Detected'}
              </h3>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                {signal?.summary || 'Major competitor has announced a product launch that directly competes with our flagship offering. Market positioning and revenue protection required.'}
              </p>
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Category', value: signal?.signalCategory?.toUpperCase() || 'COMPETITIVE', icon: Crosshair, color: 'text-blue-400' },
                  { label: 'AI Confidence', value: `${signal?.aiConfidence || 94}%`, icon: Brain, color: 'text-purple-400' },
                  { label: 'Revenue at Risk', value: signal?.costOfInaction?.revenueAtRisk || '$12.5M', icon: DollarSign, color: 'text-red-400' },
                  { label: 'Source', value: signal?.source || 'Market Intelligence', icon: Eye, color: 'text-cyan-400' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
                    className="bg-white/5 rounded-xl p-4 text-center"
                  >
                    <item.icon className={`h-6 w-6 ${item.color} mx-auto mb-2`} />
                    <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    ),

    analysis: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            AI ANALYSIS ENGINE
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">AI Analyzes the Threat</h2>
          <p className="text-xl text-slate-400">GPT-4o processes the signal against your organizational context</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-5xl grid grid-cols-2 gap-6"
        >
          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="h-8 w-8 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Key Insights</h3>
            </div>
            <div className="space-y-4">
              {(signal?.aiAnalysis?.keyInsights || [
                'Competitor pricing 15% below market, targeting our enterprise segment',
                'Launch timing coincides with Q3 renewal cycle for 340 accounts',
                'Product feature overlap: 78% with our core offering',
                'Competitor has secured 3 strategic partnerships in target verticals'
              ]).map((insight: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.3, duration: 0.5 }}
                  className="flex items-start gap-3 bg-white/5 rounded-lg p-4"
                >
                  <Lightbulb className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300 text-sm">{insight}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">AI Confidence Score</h3>
              <div className="flex items-end gap-4">
                <div className="text-6xl font-bold text-purple-400">
                  <CountUp end={signal?.aiConfidence || 94} suffix="%" />
                </div>
                <div className="text-slate-400 pb-2 text-sm">
                  Based on {signal?.aiAnalysis?.dataPointsAnalyzed || 847} data points analyzed
                </div>
              </div>
              <div className="mt-4 h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${signal?.aiConfidence || 94}%` }}
                  transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Cost of Inaction</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Revenue at Risk', value: signal?.costOfInaction?.revenueAtRisk || '$12.5M', color: 'text-red-400' },
                  { label: 'Pipeline Impact', value: signal?.costOfInaction?.pipelineImpact || '$34.2M', color: 'text-amber-400' },
                  { label: 'Time Decay', value: signal?.costOfInaction?.timeDecay || '-$420K/day', color: 'text-orange-400' },
                  { label: 'Competitor Edge', value: signal?.costOfInaction?.competitorAdvantage || '18 months', color: 'text-rose-400' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                    <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    ),

    playbook: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            PLAYBOOK MATCHED
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">The Right Playbook, Instantly</h2>
          <p className="text-xl text-slate-400">AI selects from 166 pre-built playbooks across 9 strategic domains</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-5xl"
        >
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-950/50 to-indigo-950/50 border-b border-cyan-500/20 px-8 py-5 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 text-sm font-medium">RECOMMENDED PLAYBOOK</span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {signal?.aiAnalysis?.recommendedPlaybook || 'Competitive Response - Product Counter-Strategy'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-xs">PLAYBOOK</span>
                <div className="text-3xl font-bold text-cyan-400">#{signal?.aiAnalysis?.playbookNumber || '47'}</div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                  <h4 className="text-sm text-slate-500 mb-3 uppercase tracking-wider">Pre-Configured Actions</h4>
                  <div className="space-y-2">
                    {['Competitive analysis brief', 'Pricing adjustment proposal', 'Customer retention outreach', 'Product roadmap acceleration', 'Sales enablement update', 'Partner communication plan'].map((action, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {action}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 mb-3 uppercase tracking-wider">Stakeholders Auto-Notified</h4>
                  <div className="space-y-2">
                    {['CEO - Jennifer Park', 'CMO - Lisa Anderson', 'VP Sales - Ryan Davis', 'VP Product - Laura Lewis', 'Head of Strategy - Patricia Wright', 'Director of Pricing - Amanda Jackson'].map((person, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <Users className="h-4 w-4 text-blue-400" />
                        {person}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 mb-3 uppercase tracking-wider">Enterprise Integrations</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Jira - 24 tasks auto-created', icon: '📋' },
                      { name: 'Slack - War room channel live', icon: '💬' },
                      { name: 'ServiceNow - Ticket INC-2024', icon: '🎫' },
                      { name: 'Salesforce - 340 accounts flagged', icon: '☁️' },
                      { name: 'Teams - Briefing scheduled', icon: '📅' },
                      { name: 'Google Workspace - Docs staged', icon: '📄' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <span>{item.icon}</span>
                        {item.name}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                {[
                  { label: 'Strategic Domain', value: 'COMPETITIVE RESPONSE', color: 'text-cyan-400' },
                  { label: 'Pre-Approved Budget', value: '$250,000', color: 'text-green-400' },
                  { label: 'Target Completion', value: '< 12 Minutes', color: 'text-amber-400' },
                ].map((item, i) => (
                  <div key={i} className="text-center bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                    <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    ),

    decision: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            HUMAN-AI PARTNERSHIP
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">AI Recommends. You Decide.</h2>
          <p className="text-xl text-slate-400">The executive retains full decision authority. Always.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Recommendation</h3>
                <p className="text-slate-400">Based on analysis of 847 data points</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-4xl font-bold text-green-400">94%</div>
                <div className="text-xs text-slate-500">Confidence</div>
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/10 rounded-xl p-6 mb-8">
              <p className="text-lg text-slate-300 leading-relaxed">
                "Activate <span className="text-white font-semibold">Competitive Response Playbook #47</span> immediately.
                Delay beyond 48 hours increases revenue exposure from $12.5M to $28.3M.
                Pre-approved budget of $250K covers initial counter-strategy. 28 stakeholders
                identified and ready for notification."
              </p>
            </div>

            <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-semibold text-lg">JP</div>
                <div>
                  <div className="text-white font-semibold">Jennifer Park, CEO</div>
                  <div className="text-slate-400 text-sm">Decision Authority</div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-3 rounded-xl font-semibold text-lg">
                  <CheckCircle2 className="h-6 w-6" />
                  APPROVED — Activate Playbook
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-lg text-slate-500 mt-8 max-w-2xl text-center"
        >
          Every playbook activation requires human approval. AI accelerates the process — humans make the final call.
        </motion.p>
      </div>
    ),

    activation: (
      <div className="flex items-center justify-center min-h-screen px-8">
        <div className="w-full max-w-6xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              LIVE ACTIVATION
            </div>
            <h2 className="text-5xl font-bold text-white mb-3">12-Minute Execution</h2>
            <p className="text-lg text-slate-400">Watch the full organizational response unfold in real-time</p>
          </motion.div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-slate-900/80 border border-green-500/20 rounded-2xl p-6 h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Execution Timeline</h3>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-green-400 text-sm font-medium">LIVE</span>
                  </div>
                </div>
                <ActivationTimeline />
              </motion.div>
            </div>

            <div className="col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-slate-900/80 border border-blue-500/20 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Coordination Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Stakeholders', value: '28/30', color: 'text-blue-400' },
                    { label: 'Tasks Created', value: '24', color: 'text-cyan-400' },
                    { label: 'Channels Active', value: '6', color: 'text-purple-400' },
                    { label: 'Docs Staged', value: '12', color: 'text-amber-400' },
                  ].map((m, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                      <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                      <div className="text-xs text-slate-500">{m.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Integration Activity</h3>
                <div className="space-y-3">
                  {[
                    { tool: 'Jira', status: '24 tasks created', color: 'text-blue-400' },
                    { tool: 'Slack', status: 'War room active', color: 'text-purple-400' },
                    { tool: 'ServiceNow', status: 'INC-2024-47291', color: 'text-green-400' },
                    { tool: 'Salesforce', status: '340 accounts flagged', color: 'text-cyan-400' },
                    { tool: 'Microsoft Teams', status: 'Briefing live', color: 'text-indigo-400' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-sm text-white font-medium">{item.tool}</span>
                      <span className={`text-xs ${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    ),

    idea: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">The IDEA Framework</h2>
          <p className="text-xl text-slate-400">Four phases of continuous strategic execution</p>
        </motion.div>

        <div className="grid grid-cols-4 gap-6 max-w-6xl w-full">
          {[
            { phase: 'IDENTIFY', subtitle: 'ExecuteIQ Playbook', icon: BookOpen, color: 'from-blue-600 to-blue-800', border: 'border-blue-500/30', items: ['166 strategic playbooks', '9 domains: Offense, Defense, Special Teams', 'Customizable task sequences', 'Pre-approved budget allocation', 'Role-based stakeholder mapping'] },
            { phase: 'DETECT', subtitle: 'ExecuteIQ Signal', icon: Radio, color: 'from-amber-600 to-amber-800', border: 'border-amber-500/30', items: ['AI-powered signal monitoring', '100+ data points tracked', 'Pattern recognition engine', 'Early warning dashboard', 'Human-triggered activation'] },
            { phase: 'EXECUTE', subtitle: 'ExecuteIQ Compass', icon: Zap, color: 'from-green-600 to-green-800', border: 'border-green-500/30', items: ['12-minute coordination', '30+ enterprise integrations', 'Automated task creation', 'War room orchestration', 'Real-time stakeholder tracking'] },
            { phase: 'ADVANCE', subtitle: 'ExecuteIQ Retrospect', icon: TrendingUp, color: 'from-purple-600 to-purple-800', border: 'border-purple-500/30', items: ['Institutional learning', 'AI-powered outcome analysis', 'Playbook refinement', 'Performance benchmarking', 'Continuous improvement loop'] },
          ].map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
              className={`bg-slate-900/80 ${phase.border} border rounded-2xl overflow-hidden`}
            >
              <div className={`bg-gradient-to-br ${phase.color} p-6 text-center`}>
                <phase.icon className="h-10 w-10 text-white mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white">{phase.phase}</h3>
                <p className="text-white/70 text-sm">{phase.subtitle}</p>
              </div>
              <div className="p-5 space-y-2">
                {phase.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center gap-3 mt-10"
        >
          {['IDENTIFY', 'DETECT', 'EXECUTE', 'ADVANCE'].map((phase, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-white/10 rounded-full px-4 py-2 text-sm text-white font-medium">{phase}</div>
              {i < 3 && <ArrowRight className="h-4 w-4 text-slate-500" />}
            </div>
          ))}
        </motion.div>
      </div>
    ),

    outcomes: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="h-4 w-4" />
            PROVEN RESULTS
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">The Transformation</h2>
          <p className="text-xl text-slate-400">Before ExecuteIQ vs. After ExecuteIQ</p>
        </motion.div>

        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-red-950/20 border border-red-500/20 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                <AlertTriangle className="h-7 w-7" />
                WITHOUT ExecuteIQ
              </h3>
              <div className="space-y-4">
                {[
                  { metric: 'Response Time', value: '72+ hours', detail: 'Signals buried in email chains' },
                  { metric: 'Stakeholder Alignment', value: '3-5 days', detail: 'Manual coordination via meetings' },
                  { metric: 'Document Preparation', value: '2 weeks', detail: 'Created from scratch each time' },
                  { metric: 'Budget Approval', value: '5-10 days', detail: 'Multi-layer approval process' },
                  { metric: 'Full Execution', value: '30-90 days', detail: 'If it happens at all' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-red-950/30 rounded-lg p-4">
                    <div>
                      <div className="text-white font-medium">{item.metric}</div>
                      <div className="text-red-300/60 text-xs">{item.detail}</div>
                    </div>
                    <div className="text-red-400 font-bold text-lg">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-green-950/20 border border-green-500/20 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
                <CheckCircle2 className="h-7 w-7" />
                WITH ExecuteIQ
              </h3>
              <div className="space-y-4">
                {[
                  { metric: 'Response Time', value: '< 2 minutes', detail: 'AI detects and alerts instantly' },
                  { metric: 'Stakeholder Alignment', value: '< 12 minutes', detail: '28+ stakeholders auto-coordinated' },
                  { metric: 'Document Preparation', value: 'Instant', detail: 'Pre-staged from playbook templates' },
                  { metric: 'Budget Approval', value: 'Pre-approved', detail: 'Built into playbook configuration' },
                  { metric: 'Full Execution', value: '< 12 minutes', detail: 'Signal to action, every time' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-green-950/30 rounded-lg p-4">
                    <div>
                      <div className="text-white font-medium">{item.metric}</div>
                      <div className="text-green-300/60 text-xs">{item.detail}</div>
                    </div>
                    <div className="text-green-400 font-bold text-lg">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="grid grid-cols-4 gap-6"
          >
            {[
              { label: 'Response Speed', value: '360x', detail: 'faster', color: 'text-green-400' },
              { label: 'Coordination', value: '95%', detail: 'automated', color: 'text-blue-400' },
              { label: 'Cost Savings', value: '$2.4M', detail: 'per incident', color: 'text-amber-400' },
              { label: 'Executive Time', value: '23%', detail: 'reclaimed', color: 'text-purple-400' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className={`text-4xl font-bold ${item.color} mb-1`}>{item.value}</div>
                <div className="text-white text-sm font-medium">{item.detail}</div>
                <div className="text-slate-500 text-xs mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    ),

    cta: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8"
        >
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 w-36 h-36 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 blur-3xl opacity-30 animate-pulse" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center">
              <Rocket className="h-16 w-16 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Ready to Execute?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-2xl text-slate-400 max-w-3xl mb-12 leading-relaxed"
        >
          Start a 30-day pilot with your organization. See the full signal-to-action pipeline
          running on your strategic priorities within the first week.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex gap-6"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-10 py-7 text-xl rounded-xl shadow-lg shadow-indigo-500/20"
            onClick={() => window.open('/pilot-program', '_blank')}
          >
            <Rocket className="h-6 w-6 mr-3" />
            Start Pilot Program
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-10 py-7 text-xl rounded-xl"
            onClick={() => window.open('/try-demo', '_blank')}
          >
            <Play className="h-6 w-6 mr-3" />
            Try Live Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-3xl"
        >
          {[
            { icon: Lock, label: 'Enterprise-Grade Security', detail: 'SOC 2 Type II Ready' },
            { icon: Building2, label: 'Fortune 1000 Ready', detail: '30+ integrations' },
            { icon: Shield, label: 'Human-AI Partnership', detail: 'AI recommends, you decide' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <item.icon className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
              <div className="text-white text-sm font-medium">{item.label}</div>
              <div className="text-slate-500 text-xs">{item.detail}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-12 flex items-center gap-3"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-600" />
          <span className="text-slate-600 text-sm">executeiq.io</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-600" />
        </motion.div>
      </div>
    ),
  };

  const currentStage = STAGES[stage];

  return (
    <div
      className="relative min-h-screen bg-slate-950 overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
      onClick={next}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {stageContent[currentStage.id]}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-6 px-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-1 mb-4">
                  {STAGES.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={(e) => { e.stopPropagation(); setStage(i); }}
                      className={`flex-1 h-1.5 rounded-full transition-all cursor-pointer ${i <= stage ? 'bg-indigo-500' : 'bg-white/10'} ${i === stage ? 'h-2' : ''}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); prev(); }}
                      className="text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-white/70 text-sm font-medium">
                      {stage + 1} / {STAGES.length} — {currentStage.label}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); next(); }}
                      className="text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-white/40 text-xs">
                    <span>Click or → to advance</span>
                    <span>← to go back</span>
                    <span>F for fullscreen</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}