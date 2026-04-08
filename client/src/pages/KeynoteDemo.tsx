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
import { BrandStamp } from "@/components/BrandStamp";
import { SubBrandLabel } from "@/components/SubBrandLabel";

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
  { id: 'introducing', label: 'Command OS' },
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
    { time: '0:00', label: 'Signal Detected', detail: 'AI identifies competitive threat', icon: Radio, color: 'text-[#0A0F2E]' },
    { time: '0:30', label: 'Playbook Matched', detail: 'Competitive Response #47 selected', icon: BookOpen, color: 'text-[#C9A84C]' },
    { time: '1:00', label: 'Stakeholders Notified', detail: '28 executives via Slack, Email, Teams', icon: Users, color: 'text-[#0A0F2E]' },
    { time: '2:00', label: 'War Room Created', detail: '#war-room-competitive-2024 live', icon: Shield, color: 'text-[#0A0F2E]' },
    { time: '3:30', label: 'Tasks Auto-Created', detail: '24 tasks across Jira, ServiceNow', icon: FileText, color: 'text-[#0A0F2E]' },
    { time: '5:00', label: 'Budget Pre-Approved', detail: '$250K emergency allocation released', icon: DollarSign, color: 'text-[#2B8A6E]' },
    { time: '7:00', label: 'First Decisions Made', detail: 'CEO approves counter-strategy', icon: CheckCircle2, color: 'text-[#2B8A6E]' },
    { time: '9:00', label: 'Documents Staged', detail: 'Press releases, board briefs ready', icon: MessageSquare, color: 'text-[#0A0F2E]' },
    { time: '11:00', label: '80% Coordinated', detail: '24 of 28 stakeholders aligned', icon: Target, color: 'text-[#C9A84C]' },
    { time: '11:47', label: 'EXECUTION COMPLETE', detail: 'Full organizational response active', icon: Zap, color: 'text-[#C9A84C]' },
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
            className={`flex items-center gap-4 p-3 rounded-lg transition-all ${isCurrent ? 'bg-[#F8F7F4] ring-1 ring-[#E8E4DC] scale-[1.02]' : ''}`}
          >
            <div className="w-16 text-right font-mono text-xs text-[#6B7280]">{s.time}</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-white shadow-sm' : 'bg-[#0A0F2E]/5'}`}>
              <Icon className={`h-5 w-5 ${isActive ? s.color : 'text-[#6B7280]'}`} />
            </div>
            <div className="flex-1">
              <div className={`font-bold text-sm ${isActive ? 'text-[#0A0F2E]' : 'text-[#6B7280]'}`}>{s.label}</div>
              <div className={`text-xs ${isActive ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>{s.detail}</div>
            </div>
            {isCurrent && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-3 h-3 rounded-full bg-[#2B8A6E]"
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

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  const stageContent: Record<string, JSX.Element> = {
    opening: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-8 bg-[#F8F7F4]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <AlertTriangle className="h-20 w-20 text-[#0A0F2E] mx-auto mb-8" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-7xl font-bold text-[#0A0F2E] mb-6 tracking-tight"
          style={CG}
        >
          Strategic Execution Is <span className="text-[#C9A84C]">Broken</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-3 gap-12 mt-12 max-w-5xl"
        >
          <div className="text-center">
            <div className="text-6xl font-bold text-[#C9A84C] mb-3" style={CG}><CountUp end={72} suffix="+" /></div>
            <div className="text-sm font-bold text-[#6B7280] uppercase tracking-widest">Hours for critical signals</div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-[#C9A84C] mb-3" style={CG}><CountUp end={67} suffix="%" /></div>
            <div className="text-sm font-bold text-[#6B7280] uppercase tracking-widest">Execution Failure Rate</div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-[#C9A84C] mb-3" style={CG}><CountUp end={23} suffix="%" /></div>
            <div className="text-sm font-bold text-[#6B7280] uppercase tracking-widest">Executive Time Wasted</div>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-2xl text-[#0A0F2E] mt-16 max-w-3xl font-medium"
        >
          Fortune 1000 companies lose billions every year because they can't move fast enough when it matters most.
        </motion.p>
      </div>
    ),

    cost: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-8 bg-[#F8F7F4]">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <DollarSign className="h-20 w-20 text-[#0A0F2E] mx-auto mb-8" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-7xl font-bold text-[#0A0F2E] mb-4 tracking-tight"
          style={CG}
        >
          The <span className="text-[#C9A84C]">$4.7 Trillion</span> Problem
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-2xl text-[#0A0F2E] mb-16 max-w-3xl font-medium"
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
            { icon: Clock, value: '3-5 days', label: 'Response time to threats', color: 'text-[#0A0F2E]', bg: 'bg-white' },
            { icon: Users, value: '30+', label: 'Stakeholders per event', color: 'text-[#0A0F2E]', bg: 'bg-white' },
            { icon: FileText, value: '47', label: 'Documents manually created', color: 'text-[#C9A84C]', bg: 'bg-white' },
            { icon: DollarSign, value: '$2.4M', label: 'Daily delay cost', color: 'text-[#2B8A6E]', bg: 'bg-white' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.2, duration: 0.6 }}
              className={`${item.bg} border border-[#E8E4DC] rounded-2xl p-8 text-center shadow-sm`}
            >
              <item.icon className={`h-10 w-10 ${item.color} mx-auto mb-4`} />
              <div className={`text-4xl font-bold ${item.color} mb-2`} style={CG}>{item.value}</div>
              <div className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    ),

    introducing: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-8 bg-[#0A0F2E] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${GOLD} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: 'spring' }}
          className="mb-8 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-[#C9A84C] blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-28 h-28 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-xl">
              <Layers className="h-14 w-14 text-[#0A0F2E]" />
            </div>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-8xl font-bold text-white mb-4 tracking-tight relative z-10"
          style={CG}
        >
          Command OS
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex items-center gap-3 mb-8 relative z-10"
        >
          <div className="h-px w-16 bg-[#C9A84C]" />
          <span className="text-2xl text-[#C9A84C] font-light tracking-widest uppercase">Strategic Execution Platform</span>
          <div className="h-px w-16 bg-[#C9A84C]" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-2xl text-white/80 max-w-4xl mb-16 leading-relaxed relative z-10"
        >
          From signal detection to full organizational response in <span className="text-[#C9A84C] font-semibold">12 minutes</span> — not 30 days.
          <br />170 pre-built playbooks. 9 strategic domains. AI-powered execution.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex gap-8 relative z-10"
        >
          {[
            { value: '170', label: 'Strategic Playbooks', icon: BookOpen },
            { value: '9', label: 'Strategic Domains', icon: Globe },
            { value: '<12min', label: 'Signal to Action', icon: Timer },
            { value: '30+', label: 'Enterprise Integrations', icon: Workflow },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <item.icon className="h-8 w-8 text-[#C9A84C] mx-auto mb-2" />
              <div className="text-3xl font-bold text-white" style={CG}>{item.value}</div>
              <div className="text-sm text-white/60">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    ),

    signal: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 bg-[#F8F7F4]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#0A0F2E]/10 text-[#0A0F2E] border border-[#0A0F2E]/20 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-[#0A0F2E]" />
            LIVE SIGNAL DETECTED
          </div>
          <h2 className="text-5xl font-bold text-[#0A0F2E] mb-4" style={CG}>Signal Intelligence Feed</h2>
          <p className="text-xl text-[#6B7280]">Real-time monitoring across 20 categories and 248+ data points</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-5xl"
        >
          <div className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-[#0A0F2E] border-b border-white/10 px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Radio className="h-6 w-6 text-[#C9A84C]" />
                </motion.div>
                <span className="text-[#C9A84C] font-semibold text-lg uppercase tracking-wider">Critical Signal</span>
                <span className="text-white/20 mx-2">|</span>
                <span className="text-white/60 text-sm">
                  {signal ? new Date(signal.detectedAt).toLocaleString() : 'Just Now'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60 uppercase tracking-widest">Severity</span>
                <span className="bg-[#0A0F2E] text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">CRITICAL</span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-[#0A0F2E] mb-3" style={CG}>
                {signal?.signalName || 'Competitor Product Launch Detected'}
              </h3>
              <p className="text-lg text-[#6B7280] mb-8 leading-relaxed">
                {signal?.summary || 'Major competitor has announced a product launch that directly competes with our flagship offering. Market positioning and revenue protection required.'}
              </p>
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Category', value: signal?.signalCategory?.toUpperCase() || 'COMPETITIVE', icon: Crosshair, color: 'text-[#0A0F2E]' },
                  { label: 'AI Confidence', value: `${signal?.aiConfidence || 94}%`, icon: Brain, color: 'text-[#C9A84C]' },
                  { label: 'Revenue at Risk', value: signal?.costOfInaction?.revenueAtRisk || '$12.5M', icon: DollarSign, color: 'text-[#0A0F2E]' },
                  { label: 'Source', value: signal?.source || 'Market Intelligence', icon: Eye, color: 'text-[#2B8A6E]' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
                    className="bg-[#0A0F2E]/5 rounded-xl p-4 text-center border border-[#0A0F2E]/5"
                  >
                    <item.icon className={`h-6 w-6 ${item.color} mx-auto mb-2`} />
                    <div className={`text-xl font-bold ${item.color}`} style={CG}>{item.value}</div>
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-widest font-bold mt-1">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    ),

    analysis: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 bg-white">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            AI ANALYSIS ENGINE
          </div>
          <h2 className="text-5xl font-bold text-[#0A0F2E] mb-4" style={CG}>AI Analyzes the Threat</h2>
          <p className="text-xl text-[#0A0F2E]">GPT-4o processes the signal against your organizational context</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-5xl grid grid-cols-2 gap-6"
        >
          <div className="bg-white border border-[#E8E4DC] rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#0A0F2E] flex items-center justify-center">
                <Brain className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <h3 className="text-xl font-bold text-[#0A0F2E]" style={CG}>Key Insights</h3>
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
                  className="flex items-start gap-3 bg-[#F8F7F4] rounded-lg p-4 border border-[#E8E4DC]"
                >
                  <Lightbulb className="h-5 w-5 text-[#C9A84C] mt-0.5 shrink-0" />
                  <span className="text-[#0A0F2E] text-sm font-medium">{insight}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-[#0A0F2E] border border-white/10 rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">AI Confidence Score</h3>
              <div className="flex items-end gap-4">
                <div className="text-6xl font-bold text-[#C9A84C]" style={CG}>
                  <CountUp end={signal?.aiConfidence || 94} suffix="%" />
                </div>
                <div className="text-white/60 pb-2 text-sm">
                  Based on {signal?.aiAnalysis?.dataPointsAnalyzed || 847} data points analyzed
                </div>
              </div>
              <div className="mt-4 h-2 bg-[#0A0F2E]/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${signal?.aiConfidence || 94}%` }}
                  transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-[#C9A84C] rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="bg-white border border-[#E8E4DC] rounded-2xl p-8 shadow-sm"
            >
              <h3 className="text-sm font-bold text-[#0A0F2E]/60 uppercase tracking-widest mb-4">Cost of Inaction</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Revenue at Risk', value: signal?.costOfInaction?.revenueAtRisk || '$12.5M', color: 'text-[#0A0F2E]' },
                  { label: 'Pipeline Impact', value: signal?.costOfInaction?.pipelineImpact || '$34.2M', color: 'text-[#0A0F2E]' },
                  { label: 'Time Decay', value: signal?.costOfInaction?.timeDecay || '-$420K/day', color: 'text-[#C9A84C]' },
                  { label: 'Competitor Edge', value: signal?.costOfInaction?.competitorAdvantage || '18 months', color: 'text-[#2B8A6E]' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#F8F7F4] border border-[#E8E4DC] rounded-lg p-3 text-center">
                    <div className={`text-xl font-bold ${item.color}`} style={CG}>{item.value}</div>
                    <div className="text-[10px] text-[#6B7280] uppercase font-bold tracking-tighter">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    ),

    playbook: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 bg-[#F8F7F4]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#2B8A6E]/10 text-[#2B8A6E] border border-[#2B8A6E]/20 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <BookOpen className="h-4 w-4" />
            PLAYBOOK MATCHED
          </div>
          <h2 className="text-5xl font-bold text-[#0A0F2E] mb-4" style={CG}>The Right Playbook, Instantly</h2>
          <p className="text-xl text-[#0A0F2E]">AI selects from 170 pre-built playbooks across 9 strategic domains</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-5xl"
        >
          <div className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-[#2B8A6E] border-b border-white/10 px-8 py-5 flex items-center justify-between">
              <div>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Recommended Playbook</span>
                <h3 className="text-2xl font-bold text-white mt-1" style={CG}>
                  {signal?.aiAnalysis?.recommendedPlaybook || 'Competitive Response - Product Counter-Strategy'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Playbook</span>
                <div className="text-3xl font-bold text-white" style={CG}>#{signal?.aiAnalysis?.playbookNumber || '47'}</div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                  <h4 className="text-[10px] font-bold text-[#6B7280] mb-4 uppercase tracking-[0.2em]">Pre-Configured Actions</h4>
                  <div className="space-y-3">
                    {['Competitive analysis brief', 'Pricing adjustment proposal', 'Customer retention outreach', 'Product roadmap acceleration', 'Sales enablement update', 'Partner communication plan'].map((action, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-[#0A0F2E] font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                        {action}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#6B7280] mb-4 uppercase tracking-[0.2em]">Stakeholders Notified</h4>
                  <div className="space-y-3">
                    {['CEO - Jennifer Park', 'CMO - Lisa Anderson', 'VP Sales - Ryan Davis', 'VP Product - Laura Lewis', 'Head of Strategy - Patricia Wright', 'Director of Pricing - Amanda Jackson'].map((person, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-[#0A0F2E] font-medium"
                      >
                        <Users className="h-4 w-4 text-[#0A0F2E]" />
                        {person}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#6B7280] mb-4 uppercase tracking-[0.2em]">Enterprise Integrations</h4>
                  <div className="space-y-3">
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
                        className="flex items-center gap-2 text-sm text-[#0A0F2E] font-medium"
                      >
                        <span className="text-lg">{item.icon}</span>
                        {item.name}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8E4DC]">
                {[
                  { label: 'Strategic Domain', value: 'COMPETITIVE RESPONSE', color: 'text-[#0A0F2E]' },
                  { label: 'Pre-Approved Budget', value: '$250,000', color: 'text-[#2B8A6E]' },
                  { label: 'Target Completion', value: '< 12 Minutes', color: 'text-[#C9A84C]' },
                ].map((item, i) => (
                  <div key={i} className="text-center bg-[#F8F7F4] border border-[#E8E4DC] rounded-xl p-4">
                    <div className="text-[10px] font-bold text-[#6B7280] mb-1 uppercase tracking-widest">{item.label}</div>
                    <div className={`text-lg font-bold ${item.color}`} style={CG}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    ),

    decision: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 bg-white">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#0A0F2E]/5 text-[#0A0F2E] border border-[#0A0F2E]/10 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Shield className="h-4 w-4" />
            AI MONITORS — EXECUTIVES AUTHORIZE
          </div>
          <h2 className="text-5xl font-bold text-[#0A0F2E] mb-4" style={CG}>AI Recommends. You Decide.</h2>
          <p className="text-xl text-[#6B7280]">The executive retains full decision authority. Always.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-white border border-[#E8E4DC] rounded-2xl p-10 shadow-xl">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#0A0F2E] flex items-center justify-center shadow-lg">
                <Brain className="h-8 w-8 text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0A0F2E]" style={CG}>AI Recommendation</h3>
                <p className="text-[#6B7280]">Based on analysis of 847 data points</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-4xl font-bold text-[#2B8A6E]" style={CG}>94%</div>
                <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Confidence</div>
              </div>
            </div>

            <div className="bg-[#F8F7F4] border border-[#E8E4DC] rounded-xl p-6 mb-8 italic">
              <p className="text-lg text-[#0A0F2E] leading-relaxed">
                "Activate <span className="text-[#0A0F2E] font-bold not-italic underline decoration-[#C9A84C] decoration-2">Competitive Response Playbook #47</span> immediately.
                Delay beyond 48 hours increases revenue exposure from $12.5M to $28.3M.
                Pre-approved budget of $250K covers initial counter-strategy. 28 stakeholders
                identified and ready for notification."
              </p>
            </div>

            <div className="flex items-center justify-between p-6 bg-[#0A0F2E]/5 border border-[#0A0F2E]/10 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0A0F2E] flex items-center justify-center text-[#C9A84C] font-bold text-lg border border-[#C9A84C] shadow-sm">JP</div>
                <div>
                  <div className="text-[#0A0F2E] font-bold">Jennifer Park, CEO</div>
                  <div className="text-[#6B7280] text-xs font-bold uppercase tracking-wider">Decision Authority</div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 bg-[#2B8A6E] text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
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
          className="text-lg text-[#6B7280] mt-8 max-w-2xl text-center font-medium"
        >
          Every playbook activation requires human approval. AI accelerates the process — humans make the final call.
        </motion.p>
      </div>
    ),

    activation: (
      <div className="flex items-center justify-center min-h-screen px-8 bg-[#F8F7F4]">
        <div className="w-full max-w-6xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#2B8A6E]/10 text-[#2B8A6E] border border-[#2B8A6E]/20 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
              <Zap className="h-4 w-4" />
              LIVE ACTIVATION
            </div>
            <h2 className="text-5xl font-bold text-[#0A0F2E] mb-3" style={CG}>12-Minute Execution</h2>
            <p className="text-lg text-[#0A0F2E]">Watch the full organizational response unfold in real-time</p>
          </motion.div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white border border-[#E8E4DC] rounded-2xl p-6 h-full shadow-sm"
              >
                <div className="flex items-center justify-between mb-6 border-b border-[#E8E4DC] pb-4">
                  <h3 className="text-lg font-bold text-[#0A0F2E]" style={CG}>Execution Timeline</h3>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-[#2B8A6E]" />
                    <span className="text-[#2B8A6E] text-xs font-bold uppercase tracking-widest">Live Activity</span>
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
                className="bg-[#0A0F2E] border border-white/10 rounded-2xl p-6 text-white shadow-xl"
              >
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6">Coordination Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Stakeholders', value: '28/30', color: 'text-white' },
                    { label: 'Tasks Created', value: '24', color: 'text-[#C9A84C]' },
                    { label: 'Channels Active', value: '6', color: 'text-[#2B8A6E]' },
                    { label: 'Docs Staged', value: '12', color: 'text-white/80' },
                  ].map((m, i) => (
                    <div key={i} className="bg-[#0A0F2E]/20 rounded-lg p-4 text-center border border-white/5">
                      <div className={`text-2xl font-bold ${m.color}`} style={CG}>{m.value}</div>
                      <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{m.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-sm font-bold text-[#0A0F2E]/60 uppercase tracking-widest mb-6">Integration Activity</h3>
                <div className="space-y-3">
                  {[
                    { tool: 'Jira', status: '24 tasks created', color: 'text-[#0A0F2E]' },
                    { tool: 'Slack', status: 'War room active', color: 'text-[#2B8A6E]' },
                    { tool: 'ServiceNow', status: 'INC-2024-47291', color: 'text-[#0A0F2E]' },
                    { tool: 'Salesforce', status: '340 accounts flagged', color: 'text-[#C9A84C]' },
                    { tool: 'Microsoft Teams', status: 'Briefing live', color: 'text-[#0A0F2E]' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#F8F7F4] border border-[#E8E4DC] rounded-lg p-3 shadow-sm">
                      <span className="text-sm text-[#0A0F2E] font-bold">{item.tool}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-tight ${item.color}`}>{item.status}</span>
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
      <div className="flex flex-col items-center justify-center min-h-screen px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${NAVY} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12 relative z-10">
          <h2 className="text-5xl font-bold text-[#0A0F2E] mb-4" style={CG}>The IDEA Framework</h2>
          <p className="text-xl text-[#0A0F2E]">Four phases of continuous strategic execution</p>
        </motion.div>

        <div className="grid grid-cols-4 gap-6 max-w-6xl w-full relative z-10">
          {[
            { phase: 'IDENTIFY', subtitle: 'Playbook™', icon: BookOpen, color: 'bg-[#2B8A6E]', border: 'border-[#2B8A6E]/20', items: ['170 strategic playbooks', '9 domains: Offense, Defense, Special Teams', 'Customizable task sequences', 'Pre-approved budget allocation', 'Role-based stakeholder mapping'] },
            { phase: 'DETECT', subtitle: 'Signal™', icon: Radio, color: 'bg-[#0A0F2E]', border: 'border-[#0A0F2E]/20', items: ['AI-powered signal monitoring', '248+ data points tracked', 'Pattern recognition engine', 'Early warning dashboard', 'Human-triggered activation'] },
            { phase: 'EXECUTE', subtitle: 'Compass™', icon: Zap, color: 'bg-[#C9A84C]', border: 'border-[#C9A84C]/20', items: ['12-minute coordination', '30+ enterprise integrations', 'Automated task creation', 'War room orchestration', 'Real-time stakeholder tracking'] },
            { phase: 'ADVANCE', subtitle: 'Retrospect™', icon: TrendingUp, color: 'bg-[#2B8A6E]', border: 'border-[#2B8A6E]/20', items: ['Institutional learning', 'AI-powered outcome analysis', 'Playbook refinement', 'Performance benchmarking', 'Continuous improvement loop'] },
          ].map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
              className={`bg-white ${phase.border} border rounded-2xl overflow-hidden shadow-lg`}
            >
              <div className={`${phase.color} p-6 text-center text-white shadow-inner`}>
                <phase.icon className="h-10 w-10 mx-auto mb-3" />
                <h3 className="text-2xl font-bold" style={CG}>{phase.phase}</h3>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">{phase.subtitle}</p>
              </div>
              <div className="p-5 space-y-3">
                {phase.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-[#0A0F2E] font-medium leading-tight">
                    <CheckCircle2 className="h-3 w-3 text-[#2B8A6E] shrink-0" />
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
          className="flex items-center gap-4 mt-16 relative z-10"
        >
          {['IDENTIFY', 'DETECT', 'EXECUTE', 'ADVANCE'].map((phase, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="bg-[#0A0F2E] text-white rounded-full px-6 py-2 text-xs font-bold tracking-widest uppercase border border-[#C9A84C]/30 shadow-md">{phase}</div>
              {i < 3 && <ArrowRight className="h-4 w-4 text-[#0A0F2E]/30" />}
            </div>
          ))}
        </motion.div>
      </div>
    ),

    outcomes: (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 bg-[#F8F7F4]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Award className="h-4 w-4" />
            PROVEN RESULTS
          </div>
          <h2 className="text-5xl font-bold text-[#0A0F2E] mb-4" style={CG}>The Transformation</h2>
          <p className="text-xl text-[#0A0F2E]">Strategic maturity reimagined</p>
        </motion.div>

        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white border border-red-100 rounded-2xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-3" style={CG}>
                <AlertTriangle className="h-6 w-6" />
                Legacy Operations
              </h3>
              <div className="space-y-4">
                {[
                  { metric: 'Response Time', value: '72+ hours', detail: 'Signals buried in email chains' },
                  { metric: 'Stakeholder Alignment', value: '3-5 days', detail: 'Manual coordination via meetings' },
                  { metric: 'Document Preparation', value: '2 weeks', detail: 'Created from scratch each time' },
                  { metric: 'Budget Approval', value: '5-10 days', detail: 'Multi-layer approval process' },
                  { metric: 'Full Execution', value: '30-90 days', detail: 'If it happens at all' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-red-50/50 border border-red-50 rounded-lg p-4">
                    <div>
                      <div className="text-[#0A0F2E] font-bold text-sm">{item.metric}</div>
                      <div className="text-red-600/60 text-[10px] font-bold uppercase tracking-wider">{item.detail}</div>
                    </div>
                    <div className="text-red-600 font-bold text-lg" style={CG}>{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-[#0A0F2E] border border-white/10 rounded-2xl p-8 shadow-xl text-white"
            >
              <h3 className="text-xl font-bold text-[#C9A84C] mb-6 flex items-center gap-3" style={CG}>
                <CheckCircle2 className="h-6 w-6" />
                Command OS Powered
              </h3>
              <div className="space-y-4">
                {[
                  { metric: 'Response Time', value: '< 2 minutes', detail: 'AI detects and alerts instantly' },
                  { metric: 'Stakeholder Alignment', value: '< 12 minutes', detail: '28+ stakeholders auto-coordinated' },
                  { metric: 'Document Preparation', value: 'Instant', detail: 'Pre-staged from playbook templates' },
                  { metric: 'Budget Approval', value: 'Pre-approved', detail: 'Built into playbook configuration' },
                  { metric: 'Full Execution', value: '< 12 minutes', detail: 'Signal to action, every time' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0A0F2E]/20 border border-white/10 rounded-lg p-4">
                    <div>
                      <div className="text-white font-bold text-sm">{item.metric}</div>
                      <div className="text-[#C9A84C]/60 text-[10px] font-bold uppercase tracking-wider">{item.detail}</div>
                    </div>
                    <div className="text-[#C9A84C] font-bold text-lg" style={CG}>{item.value}</div>
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
              { label: 'Response Speed', value: '360x', detail: 'faster', color: 'text-[#2B8A6E]' },
              { label: 'Coordination', value: '95%', detail: 'automated', color: 'text-[#0A0F2E]' },
              { label: 'Cost Savings', value: '$2.4M', detail: 'per incident', color: 'text-[#C9A84C]' },
              { label: 'Executive Time', value: '23%', detail: 'reclaimed', color: 'text-[#2B8A6E]' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[#E8E4DC] rounded-2xl p-6 text-center shadow-sm">
                <div className={`text-4xl font-bold ${item.color} mb-1`} style={CG}>{item.value}</div>
                <div className="text-[#0A0F2E] text-xs font-bold uppercase tracking-widest">{item.detail}</div>
                <div className="text-[#6B7280] text-[10px] uppercase font-medium mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    ),

    cta: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-8 bg-[#0A0F2E] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${GOLD} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 w-36 h-36 rounded-full bg-[#C9A84C] blur-3xl opacity-20 animate-pulse" />
            <div className="relative w-32 h-32 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-2xl">
              <Rocket className="h-16 w-16 text-[#0A0F2E]" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-7xl font-bold text-white mb-6 tracking-tight relative z-10"
          style={CG}
        >
          Ready to Execute?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-2xl text-white/70 max-w-3xl mb-12 leading-relaxed relative z-10"
        >
          Start a 30-day pilot with your organization. See the full signal-to-action pipeline
          running on your strategic priorities within the first week.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 relative z-10"
        >
          <Button
            size="lg"
            className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] px-10 py-7 text-xl font-bold rounded-xl shadow-2xl"
          >
            Schedule Onboarding
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-[#0A0F2E]/30 px-10 py-7 text-xl rounded-xl bg-transparent"
          >
            Download Deck
          </Button>
        </motion.div>
      </div>
    ),
  };

  return (
    <div 
      className="min-h-screen bg-white text-[#0A0F2E] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={STAGES[stage].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {stageContent[STAGES[stage].id]}
        </motion.div>
      </AnimatePresence>

      {/* Progress & Controls */}
      <motion.div 
        animate={{ opacity: showControls ? 1 : 0 }}
        className="fixed bottom-0 left-0 right-0 p-8 z-50 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prev} 
                disabled={stage === 0}
                className="bg-black/5 border-black/10 hover:bg-black/10 text-[#0A0F2E] pointer-events-auto"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={next} 
                disabled={stage === STAGES.length - 1}
                className="bg-black/5 border-black/10 hover:bg-black/10 text-[#0A0F2E] pointer-events-auto"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="text-xs font-bold text-[#6B7280] uppercase tracking-[0.2em]">
              Slide {stage + 1} of {STAGES.length}: {STAGES[stage].label}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-64">
              <Progress 
                value={((stage + 1) / STAGES.length) * 100} 
                className="h-1 bg-[#0A0F2E]/30"
              />
            </div>
            <div className="flex items-center gap-3">
              <BrandStamp size="sm" variant="dual" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Presentation Mode Info */}
      <div className="fixed top-6 right-8 text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.3em] opacity-40">
        [Space/Arrows] to navigate • [F] for fullscreen
      </div>
    </div>
  );
}
