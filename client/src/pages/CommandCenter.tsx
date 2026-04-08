import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'wouter';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import ReactConfetti from 'react-confetti';
import { 
  Activity, 
  Zap, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  PlayCircle,
  Pause,
  Radio,
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowRight,
  Bell,
  Shield,
  Radar,
  Rocket,
  Timer,
  Sparkles,
  FastForward,
  Trophy,
  Brain,
  FileCheck,
  Send,
  Wallet,
  Calendar,
  X,
  ChevronRight
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { BrandStamp } from "@/components/BrandStamp";
import { SubBrandLabel } from "@/components/SubBrandLabel";

interface CoordinationEvent {
  id: string;
  time: string;
  team: string;
  action: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface SignalAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  source: string;
  time: string;
}

const EXECUTION_PHASES = [
  { id: 'immediate', name: 'Immediate Response', duration: 180, icon: '⚡' },
  { id: 'coordinate', name: 'Team Coordination', duration: 240, icon: '👥' },
  { id: 'resolve', name: 'Issue Resolution', duration: 240, icon: '🎯' },
  { id: 'close', name: 'Closure & Learning', duration: 60, icon: '✅' },
];

interface DemoTask {
  id: string;
  time: number;
  team: string;
  action: string;
  type: 'task' | 'document' | 'communication' | 'budget' | 'integration';
  value: number;
}

const DEMO_TASKS: DemoTask[] = [
  { id: 't1', time: 15, team: 'Executive', action: 'Execution team mobilized', type: 'task', value: 5000 },
  { id: 't2', time: 30, team: 'Legal', action: 'NDA template staged', type: 'document', value: 2500 },
  { id: 't3', time: 45, team: 'Communications', action: 'Press statement drafted', type: 'communication', value: 8000 },
  { id: 't4', time: 60, team: 'Finance', action: '$500K emergency budget unlocked', type: 'budget', value: 12000 },
  { id: 't5', time: 90, team: 'IT Security', action: 'System isolation protocol started', type: 'task', value: 3500 },
  { id: 't6', time: 120, team: 'Operations', action: 'Backup suppliers notified', type: 'communication', value: 4200 },
  { id: 't7', time: 150, team: 'HR', action: 'Employee communication ready', type: 'document', value: 2800 },
  { id: 't8', time: 180, team: 'Jira', action: 'Project synced - 24 tasks created', type: 'integration', value: 6500 },
  { id: 't9', time: 210, team: 'Legal', action: 'Contract review initiated', type: 'task', value: 5500 },
  { id: 't10', time: 240, team: 'Board', action: 'Emergency meeting scheduled', type: 'task', value: 15000 },
  { id: 't11', time: 280, team: 'ServiceNow', action: 'Incident ticket auto-created', type: 'integration', value: 3200 },
  { id: 't12', time: 320, team: 'Investors', action: 'IR statement approved', type: 'communication', value: 25000 },
  { id: 't13', time: 360, team: 'Risk', action: 'Impact assessment complete', type: 'document', value: 8500 },
  { id: 't14', time: 400, team: 'Operations', action: 'Contingency plan activated', type: 'task', value: 11000 },
  { id: 't15', time: 450, team: 'Slack', action: 'War room channel created', type: 'integration', value: 1500 },
  { id: 't16', time: 500, team: 'Procurement', action: 'Emergency vendor contracts staged', type: 'document', value: 7200 },
  { id: 't17', time: 540, team: 'Strategy', action: 'Competitive response brief ready', type: 'document', value: 9000 },
  { id: 't18', time: 600, team: 'CEO', action: 'Executive briefing delivered', type: 'communication', value: 15000 },
  { id: 't19', time: 660, team: 'Finance', action: 'Financial impact model completed', type: 'document', value: 20000 },
  { id: 't20', time: 700, team: 'All Teams', action: 'Execution complete - Learning captured', type: 'task', value: 8600 },
];

const DEMO_SPEEDS = [
  { label: '1x', value: 1, icon: '▶' },
  { label: '2x', value: 2, icon: '⏩' },
  { label: '5x', value: 5, icon: '⏭' },
  { label: '10x', value: 10, icon: '🚀' },
];

const SIGNAL_PLAYBOOK_MAP: Array<{ keywords: string[]; playbook: string; domain: string; urgency: string; domainParam: string }> = [
  { keywords: ['acquisition', 'merger', 'm&a', 'bid'], playbook: 'Activist Investor Defense', domain: 'Financial Strategy', urgency: 'CRITICAL — 12-min window', domainParam: 'financial' },
  { keywords: ['ransomware', 'cyber', 'malware', 'breach', 'lateral movement'], playbook: 'Cyber Incident Response', domain: 'Technology & Innovation', urgency: 'CRITICAL — immediate action', domainParam: 'crisis' },
  { keywords: ['supply chain', 'port', 'supplier', 'logistics'], playbook: 'Supply Chain Disruption Response', domain: 'Operational Excellence', urgency: 'HIGH — 2-hr window', domainParam: 'gtm' },
  { keywords: ['executive departure', 'c-suite', 'ceo', 'cfo', 'talent', 'resigned', 'attrition'], playbook: 'Leadership Continuity Protocol', domain: 'Talent & Leadership', urgency: 'HIGH — board notification required', domainParam: 'talent' },
  { keywords: ['sec', 'disclosure', 'inquiry', 'regulatory', 'compliance'], playbook: 'SEC Disclosure Filing', domain: 'Regulatory & Compliance', urgency: 'HIGH — legal deadline', domainParam: 'regulatory' },
  { keywords: ['sentiment', 'brand', 'reputation', 'social', 'media'], playbook: 'Brand Crisis Response', domain: 'Brand & Reputation', urgency: 'MEDIUM — monitor & respond', domainParam: 'technology' },
  { keywords: ['activist investor', 'institutional', 'position', 'shareholder'], playbook: 'Activist Investor Defense', domain: 'Financial Strategy', urgency: 'CRITICAL — 48-hr window', domainParam: 'financial' },
  { keywords: ['recall', 'fda', 'product', 'safety'], playbook: 'Product Recall Management', domain: 'Operational Excellence', urgency: 'CRITICAL — FDA 48-hr requirement', domainParam: 'gtm' },
  { keywords: ['integration', 'synergy', 'friction', 'm&a'], playbook: 'M&A Integration Playbook', domain: 'Market Opportunities', urgency: 'HIGH — 30-day milestone at risk', domainParam: 'ma' },
  { keywords: ['esg', 'carbon', 'sustainability', 'climate'], playbook: 'ESG Crisis Response', domain: 'Regulatory & Compliance', urgency: 'MEDIUM — investor reporting deadline', domainParam: 'regulatory' },
  { keywords: ['geopolitical', 'trade', 'emea', 'sanctions'], playbook: 'Geopolitical Risk Protocol', domain: 'Market Opportunities', urgency: 'HIGH — cross-border exposure', domainParam: 'ma' },
  { keywords: ['fraud', 'financial', 'anomaly', 'disbursement'], playbook: 'Financial Fraud Detection Response', domain: 'Financial Strategy', urgency: 'CRITICAL — forensic audit triggered', domainParam: 'financial' },
  { keywords: ['ai governance', 'ai', 'compliance', 'deployment'], playbook: 'AI Governance Compliance', domain: 'AI Governance', urgency: 'MEDIUM — regulatory exposure', domainParam: 'strategic' },
  { keywords: ['churn', 'customer', 'retention', 'velocity'], playbook: 'Customer Retention Rapid Response', domain: 'Market Opportunities', urgency: 'HIGH — revenue protection window', domainParam: 'ma' },
  { keywords: ['board', 'legal counsel', 'governance'], playbook: 'Board Crisis Protocol', domain: 'Financial Strategy', urgency: 'CRITICAL — fiduciary trigger', domainParam: 'financial' },
  { keywords: ['ipo', 'pricing', 'capital markets', 'window'], playbook: 'IPO Market Disruption Response', domain: 'Financial Strategy', urgency: 'CRITICAL — window closing', domainParam: 'financial' },
  { keywords: ['competitor', 'pricing', 'market', 'disruption'], playbook: 'Aggressive Pricing Disruption', domain: 'Market Dynamics', urgency: 'HIGH — competitive response window', domainParam: 'competitive' },
];

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function CommandCenter({ embedded }: { embedded?: boolean }) {
  const { 
    readiness, 
    activeScenarios, 
    weakSignals, 
    oraclePatterns,
    continuousMode,
    teamsCoordinating,
    percentOnTrack,
    isLoading
  } = useDynamicStrategy();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [demoSpeed, setDemoSpeed] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastTickTime, setLastTickTime] = useState<number>(0);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [continuousModeLocal, setContinuousModeLocal] = useState(continuousMode.enabled);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [showScenarioLauncher, setShowScenarioLauncher] = useState(false);
  const executionViewRef = useRef<HTMLDivElement>(null);
  const [demoExecution, setDemoExecution] = useState<{
    active: boolean;
    startTime: number;
    elapsedSeconds: number;
    phase: number;
    scenario: string;
    completedTasks: string[];
    accumulatedValue: number;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (demoExecution?.active) {
      const interval = setInterval(() => {
        const now = Date.now();
        const deltaRealMs = now - lastTickTime;
        const deltaScaledSeconds = (deltaRealMs / 1000) * demoSpeed;
        setLastTickTime(now);
        
        setDemoExecution(prev => {
          if (!prev) return null;
          const newElapsed = Math.min(720, prev.elapsedSeconds + deltaScaledSeconds);
          
          let currentPhase = 0;
          let accumulated = 0;
          for (let i = 0; i < EXECUTION_PHASES.length; i++) {
            accumulated += EXECUTION_PHASES[i].duration;
            if (newElapsed < accumulated) {
              currentPhase = i;
              break;
            }
            if (i === EXECUTION_PHASES.length - 1) currentPhase = i;
          }
          
          const newCompletedTasks = DEMO_TASKS
            .filter(t => t.time <= newElapsed)
            .map(t => t.id);
          
          const newValue = DEMO_TASKS
            .filter(t => t.time <= newElapsed)
            .reduce((sum, t) => sum + t.value, 0);
          
          if (newElapsed >= 720) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 8000);
            return { ...prev, active: false, elapsedSeconds: 720, phase: 4, completedTasks: newCompletedTasks, accumulatedValue: newValue };
          }
          
          return { ...prev, elapsedSeconds: newElapsed, phase: currentPhase, completedTasks: newCompletedTasks, accumulatedValue: newValue };
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [demoExecution?.active, demoSpeed, lastTickTime]);

  const launchDemoExecution = useCallback((scenarioName?: string) => {
    setShowConfetti(false);
    setLastTickTime(Date.now());
    setSelectedScenario(null);
    setDemoExecution({
      active: true,
      startTime: Date.now(),
      elapsedSeconds: 0,
      phase: 0,
      scenario: scenarioName || 'Competitor Acquisition Response',
      completedTasks: [],
      accumulatedValue: 0,
    });
    setTimeout(() => {
      executionViewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const recentTasks = useMemo(() => {
    if (!demoExecution) return [];
    return DEMO_TASKS
      .filter(t => demoExecution.completedTasks.includes(t.id))
      .slice(-5)
      .reverse();
  }, [demoExecution?.completedTasks]);

  const getTaskIcon = (type: DemoTask['type']) => {
    switch (type) {
      case 'task': return <CheckCircle2 className="w-4 h-4 text-[#2B8A6E]" />;
      case 'document': return <FileCheck className="w-4 h-4 text-[#0A0F2E]" />;
      case 'communication': return <Send className="w-4 h-4 text-[#C9A84C]" />;
      case 'budget': return <Wallet className="w-4 h-4 text-[#C9A84C]" />;
      case 'integration': return <Zap className="w-4 h-4 text-[#0A0F2E]" />;
    }
  };

  const formatTime = (seconds: number, countdown: boolean = false) => {
    const displaySeconds = countdown ? Math.max(0, 720 - seconds) : seconds;
    const mins = Math.floor(displaySeconds / 60);
    const secs = Math.floor(displaySeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Live trigger detections from the real ingestion engine
  const { user } = useAuth();
  const _liveOrgId = user?.organizationId || 'system';
  const { data: liveDetectionsData } = useQuery<{ success: boolean; detections: any[] }>({
    queryKey: ['/api/detections', _liveOrgId],
    queryFn: () => fetch(`/api/detections?organizationId=${_liveOrgId}`).then(r => r.json()),
    refetchInterval: 60000,
  });

  const ALL_SIGNALS: SignalAlert[] = [
    { id: 's1',  severity: 'critical', title: 'Competitor announces $2.4B acquisition bid',     source: 'Reuters / Bloomberg Feed',       time: '1 min ago' },
    { id: 's2',  severity: 'critical', title: 'Ransomware alert: lateral movement detected',    source: 'CrowdStrike / SIEM Integration', time: '3 min ago' },
    { id: 's3',  severity: 'high',     title: 'Supply chain disruption — APAC ports offline',  source: 'Operations Monitor',             time: '7 min ago' },
    { id: 's4',  severity: 'high',     title: 'Key executive departure signal — C-suite',       source: 'LinkedIn Pulse / HR Intel',      time: '11 min ago' },
    { id: 's5',  severity: 'high',     title: 'SEC inquiry flagged — disclosure window open',   source: 'Compliance Radar',               time: '14 min ago' },
    { id: 's6',  severity: 'medium',   title: 'Social sentiment decline — brand score -18pt',  source: 'Echo Cultural Analytics',        time: '22 min ago' },
    { id: 's7',  severity: 'medium',   title: 'Activist investor building 5% position',         source: 'Institutional Monitor',          time: '29 min ago' },
    { id: 's8',  severity: 'medium',   title: 'Product recall risk: FDA preliminary notice',    source: 'Regulatory Watch',               time: '35 min ago' },
    { id: 's9',  severity: 'high',     title: 'M&A integration friction — 3 synergies at risk', source: 'Integration Tracker',            time: '41 min ago' },
    { id: 's10', severity: 'low',      title: 'ESG reporting deadline in 14 days',              source: 'Compliance Watch',               time: '52 min ago' },
    { id: 's11', severity: 'critical', title: 'Geopolitical escalation — EMEA trade route',    source: 'Global Risk Feed',               time: '2 min ago' },
    { id: 's12', severity: 'high',     title: 'Financial fraud anomaly — AP disbursements',    source: 'Finance AI Monitor',             time: '8 min ago' },
    { id: 's13', severity: 'medium',   title: 'AI governance gap detected in new deployment',  source: 'Tech Compliance Scanner',        time: '18 min ago' },
    { id: 's14', severity: 'high',     title: 'Talent exodus: 4 senior engineers resigned',    source: 'HR Signal Engine',               time: '26 min ago' },
    { id: 's15', severity: 'low',      title: 'GDPR amendment — new consent requirements',     source: 'EU Regulatory Feed',             time: '1 hr ago' },
    { id: 's16', severity: 'critical', title: 'IPO pricing window narrowing — market shift',   source: 'Capital Markets Desk',           time: '4 min ago' },
    { id: 's17', severity: 'medium',   title: 'Customer churn velocity up 23% this quarter',   source: 'CRM Insight Engine',             time: '33 min ago' },
    { id: 's18', severity: 'high',     title: 'Board member seeks independent legal counsel',  source: 'Governance Monitor',             time: '19 min ago' },
    { id: 's19', severity: 'low',      title: 'Competitor pricing move — 12% discount launch', source: 'Market Intel',                   time: '48 min ago' },
    { id: 's20', severity: 'medium',   title: 'Carbon disclosure audit triggered by investor', source: 'ESG Signal Feed',                time: '37 min ago' },
  ];

  const signalAlerts = useMemo(() => {
    // Prepend any real live detections so they always surface first
    const liveSignals: SignalAlert[] = (liveDetectionsData?.detections || [])
      .filter((d: any) => d.status !== 'acknowledged')
      .slice(0, 3)
      .map((d: any) => {
        const score = d.confidenceScore as number;
        const severity: SignalAlert['severity'] = score >= 85 ? 'critical' : score >= 75 ? 'high' : 'medium';
        const mins = Math.round((Date.now() - new Date(d.detectedAt).getTime()) / 60000);
        const time = mins < 1 ? 'Just now' : mins < 60 ? `${mins} min ago` : `${Math.floor(mins / 60)} hr ago`;
        return { id: `live-${d.id}`, severity, title: `${d.triggerName} — ${score}% confidence`, source: `Live Detection · ${d.signalSource}`, time };
      });
    const offset = (currentTime.getHours() * 4 + Math.floor(currentTime.getMinutes() / 5)) % ALL_SIGNALS.length;
    const staticPool = [...ALL_SIGNALS.slice(offset), ...ALL_SIGNALS.slice(0, offset)];
    return [...liveSignals, ...staticPool].slice(0, 6);
  }, [currentTime, liveDetectionsData]);

  const ALL_COORDINATION: CoordinationEvent[] = [
    { id: 'c1', time: '1 min ago',  team: 'Legal',         action: 'Approved crisis communication draft',       status: 'completed' },
    { id: 'c2', time: '3 min ago',  team: 'Communications', action: 'Drafting stakeholder notification message', status: 'in-progress' },
    { id: 'c3', time: '6 min ago',  team: 'Operations',    action: 'Activated supply chain contingency plan',   status: 'completed' },
    { id: 'c4', time: '9 min ago',  team: 'Executive',     action: 'CEO briefing deck staged and reviewed',     status: 'pending' },
    { id: 'c5', time: '11 min ago', team: 'IT Security',   action: 'System isolation and containment complete', status: 'completed' },
    { id: 'c6', time: '2 min ago',  team: 'Finance',       action: '$500K emergency budget authority granted',  status: 'completed' },
    { id: 'c7', time: '4 min ago',  team: 'Board',         action: 'Emergency meeting invite dispatched',       status: 'in-progress' },
    { id: 'c8', time: '7 min ago',  team: 'HR',            action: 'All-hands communication drafted',           status: 'completed' },
    { id: 'c9', time: '10 min ago', team: 'Strategy',      action: 'Competitive response brief completed',      status: 'completed' },
    { id: 'c10', time: '13 min ago', team: 'Risk',         action: 'Impact assessment matrix finalized',        status: 'pending' },
  ];

  const coordinationTimeline = useMemo(() => {
    const offset = (currentTime.getHours() * 2 + Math.floor(currentTime.getMinutes() / 10)) % ALL_COORDINATION.length;
    const pool = [...ALL_COORDINATION.slice(offset), ...ALL_COORDINATION.slice(0, offset)];
    return pool.slice(0, 5);
  }, [currentTime.getHours(), Math.floor(currentTime.getMinutes() / 10)]);

  const severityColors = {
    critical: 'bg-red-500 text-white',
    high: 'bg-[#C9A84C] text-[#0A0F2E]',
    medium: 'bg-[#2B8A6E] text-white',
    low: 'bg-[#0A0F2E] text-white'
  };

  const ideaRecommendation = useMemo(() => {
    const topSignal = signalAlerts.find(a => a.severity === 'critical') || signalAlerts.find(a => a.severity === 'high') || signalAlerts[0];
    if (!topSignal) return null;
    const title = topSignal.title.toLowerCase();
    for (const entry of SIGNAL_PLAYBOOK_MAP) {
      if (entry.keywords.some(kw => title.includes(kw))) {
        return { ...entry, signal: topSignal };
      }
    }
    return { playbook: 'Strategic Response Protocol', domain: 'Market Dynamics', urgency: 'HIGH — review recommended', domainParam: 'competitive', signal: topSignal };
  }, [signalAlerts]);

  // Fetch ROI metrics
  const { data: roiReport } = useQuery<any>({
    queryKey: ['/api/roi/report'],
  });

  // Compound Threat Intelligence
  const { data: compoundThreats, refetch: refetchThreats } = useQuery<any[]>({
    queryKey: ['/api/compound-threats'],
  });
  const [compoundAnalysisResult, setCompoundAnalysisResult] = useState<any>(null);
  const compoundAnalyzeMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/compound-threats/analyze', { triggerIds: [] }),
    onSuccess: async (res) => {
      const data = await res.json();
      setCompoundAnalysisResult(data);
      refetchThreats();
    },
  });

  if (isLoading) {
    return (
      <PageLayout embedded={embedded}>
      <div className="min-h-screen bg-[#F8F7F4] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-[#E8E4DC] rounded"></div>
            <div className="h-64 bg-[#E8E4DC] rounded"></div>
          </div>
        </div>
      </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout embedded={embedded}>
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={['#0A0F2E', '#C9A84C', '#2B8A6E', '#DFC178', '#3BAF8A']}
        />
      )}

      {/* ZONE 1: Hero Header */}
      <div className="bg-white border-b border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>Command Center · Compass™</span>
              </div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,5vw,48px)", color: NAVY, marginBottom: 16 }}>
                Command <em style={{ fontStyle: "italic", color: GOLD }}>Center</em>
              </h1>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                When a trigger fires, Readiness OS coordinates your full response — tasks, teams, documents, budgets — in 12 minutes. Not days.
              </p>
              <OnboardingTrigger pageId="command-center" autoStart={true} />
            </div>
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              <div style={{ padding: 16, border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", background: "#fff", textAlign: "center" }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY }}>
                  {activeScenarios.length}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>
                  Active Scenarios
                </div>
              </div>
              <div style={{ padding: 16, border: "1px solid #E8E4DC", borderLeft: "3px solid #2B8A6E", background: "#fff", textAlign: "center" }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY }}>
                  {teamsCoordinating}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>
                  Teams Ready
                </div>
              </div>
              <div style={{ padding: 16, border: "1px solid #E8E4DC", borderLeft: "3px solid #0A0F2E", background: "#fff", textAlign: "center" }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY }}>
                  {percentOnTrack}%
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>
                  On Track
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 1b: Compound Threat Intelligence Panel */}
      <div style={{ background: "#F8F7F4", borderBottom: "1px solid #E8E4DC", padding: "32px 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD }}>Compound Signal Intelligence · GPT-4o</span>
            </div>
            <Button
              onClick={() => compoundAnalyzeMutation.mutate()}
              disabled={compoundAnalyzeMutation.isPending}
              style={{ background: NAVY, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, padding: "8px 18px", display: "flex", alignItems: "center", gap: 8 }}
            >
              <Brain className="h-4 w-4" />
              {compoundAnalyzeMutation.isPending ? 'Analyzing...' : 'Run AI Analysis'}
            </Button>
          </div>

          {compoundAnalysisResult ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div style={{ padding: "20px 24px", background: "#fff", border: "1px solid #E8E4DC", borderLeft: `3px solid ${GOLD}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>Compound Risk Score</div>
                <div style={{ fontSize: 40, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{compoundAnalysisResult.compoundRiskScore || compoundAnalysisResult.riskScore || 72}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>/ 100 — AI-assessed exposure</div>
              </div>
              <div style={{ padding: "20px 24px", background: "#fff", border: "1px solid #E8E4DC", borderLeft: "3px solid #2B8A6E" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#2B8A6E", marginBottom: 8 }}>Recommended Playbooks</div>
                <div className="space-y-2">
                  {(compoundAnalysisResult.recommendedPlaybooks || compoundAnalysisResult.playbooks || []).slice(0, 3).map((p: string, i: number) => (
                    <div key={i} style={{ fontSize: 12, color: NAVY, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "20px 24px", background: "#fff", border: "1px solid #E8E4DC", borderLeft: `3px solid ${NAVY}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#6B7280", marginBottom: 8 }}>Executive Assessment</div>
                <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{compoundAnalysisResult.executiveSummary || compoundAnalysisResult.analysis || 'Analysis complete. Review recommended playbooks and initiate response protocol.'}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(compoundThreats && compoundThreats.length > 0 ? compoundThreats.slice(0, 3) : [
                { name: 'Multi-Vector Market Disruption', severity: 'critical', triggersCount: 4, domains: ['market', 'competitive'] },
                { name: 'Regulatory + Talent Crisis Convergence', severity: 'high', triggersCount: 3, domains: ['regulatory', 'talent'] },
                { name: 'Supply Chain + Cyber Compound Threat', severity: 'high', triggersCount: 2, domains: ['operational', 'cyber'] },
              ]).map((threat: any, i: number) => (
                <div key={i} style={{ padding: "16px 20px", background: "#fff", border: "1px solid #E8E4DC", borderLeft: `3px solid ${threat.severity === 'critical' ? '#C0392B' : GOLD}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: threat.severity === 'critical' ? '#C0392B' : GOLD }}>
                      {threat.severity}
                    </div>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>{threat.triggersCount || 2} triggers</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, lineHeight: 1.4, marginBottom: 8 }}>{threat.name}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
                    {(threat.domains || []).map((d: string) => (
                      <span key={d} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", background: "#F3F4F6", color: "#374151", textTransform: "capitalize" as const }}>{d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #E8E4DC" }}>
            <span style={{ fontSize: 11, color: "#6B7280" }}>Showing top 3 priority situations · {92 + (liveDetectionsData?.detections?.filter((d: any) => d.status !== 'acknowledged').length || 0)} total signals monitored</span>
            <Link href="/advanced-analytics">
              <button style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0A0F2E", display: "flex", alignItems: "center", gap: 4 }} className="hover:opacity-70 transition-opacity">
                Deep-dive analysis <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ZONE 2: Live Execution View */}
      <div ref={executionViewRef} />
      {demoExecution && (
        <div style={{ background: NAVY, padding: "48px 0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative shrink-0">
                  <div style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="text-center">
                      <div style={{ ...CG, fontSize: 28, fontWeight: 600, color: "#fff" }} data-testid="text-countdown-time">
                        {formatTime(demoExecution.elapsedSeconds, true)}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>remaining</div>
                    </div>
                  </div>
                  {demoExecution.active && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#3BAF8A] rounded-full animate-pulse border-2 border-[#0A0F2E]"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>LIVE EXECUTION</span>
                    </div>
                  </div>
                  <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
                    {demoExecution.scenario}
                  </h2>
                  <div className="flex items-center gap-2">
                    {demoExecution.active ? (
                      <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(43,138,110,0.12)", color:"#3BAF8A", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"3px 10px" }}>LIVE</div>
                    ) : (
                      <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(0,0,0,0.2)", color:"#fff", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"3px 10px" }}>COMPLETED</div>
                    )}
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                      Phase: {EXECUTION_PHASES[demoExecution.phase]?.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6">
                <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-4">
                  <div style={{ padding: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center", minWidth: 80 }}>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#fff" }}>{demoExecution.completedTasks.length}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Tasks</div>
                  </div>
                  <div style={{ padding: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center", minWidth: 80 }}>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: GOLD_LT }} data-testid="text-roi-value">
                      ${(demoExecution.accumulatedValue / 1000).toFixed(0)}K
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Value</div>
                  </div>
                  <div style={{ padding: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center", minWidth: 80 }}>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#fff" }}>8</div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Teams</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {DEMO_SPEEDS.map((speed) => (
                    <Button
                      key={speed.value}
                      size="sm"
                      variant="ghost"
                      style={{ border: demoSpeed === speed.value ? "1px solid #C9A84C" : "1px solid rgba(255,255,255,0.1)", color: demoSpeed === speed.value ? "#C9A84C" : "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700 }}
                      onClick={() => setDemoSpeed(speed.value)}
                      data-testid={`button-speed-${speed.value}x`}
                    >
                      {speed.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 sm:flex gap-4">
              {EXECUTION_PHASES.map((phase, idx) => {
                const phaseStart = EXECUTION_PHASES.slice(0, idx).reduce((a, p) => a + p.duration, 0);
                const phaseProgress = demoExecution.elapsedSeconds >= phaseStart + phase.duration 
                  ? 100 
                  : demoExecution.elapsedSeconds <= phaseStart 
                    ? 0 
                    : ((demoExecution.elapsedSeconds - phaseStart) / phase.duration) * 100;
                const isActive = demoExecution.phase === idx && demoExecution.active;
                const isComplete = demoExecution.elapsedSeconds >= phaseStart + phase.duration;
                
                return (
                  <div key={phase.id} className="flex-1" data-testid={`phase-progress-${phase.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isActive ? "#fff" : "rgba(255,255,255,0.45)" }}>
                        {phase.icon} {phase.name}
                      </span>
                      {isComplete && <CheckCircle2 className="w-3 h-3 text-[#3BAF8A]" />}
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isComplete ? 'bg-[#3BAF8A]' : isActive ? 'bg-[#C9A84C] animate-pulse' : 'bg-white/20'
                        }`}
                        style={{ width: `${phaseProgress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {demoExecution.completedTasks.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#C9A84C]" />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Live Activity Feed</span>
                  </div>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{demoExecution.completedTasks.length} of 20 tasks</span>
                </div>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {DEMO_TASKS
                      .filter(t => demoExecution.completedTasks.includes(t.id))
                      .reverse()
                      .map((task, idx) => (
                      <div 
                        key={task.id}
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: 20, display: "flex", alignItems: "center", gap: 8 }}
                        className={idx === 0 ? 'animate-pulse ring-1 ring-[#C9A84C]/50' : ''}
                        data-testid={`live-task-${task.id}`}
                      >
                        {getTaskIcon(task.type)}
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{task.team}:</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }} className="max-w-[150px] truncate">{task.action}</span>
                        <span style={{ fontSize: 10, color: "#DFC178" }}>+${(task.value/1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Celebration */}
      {demoExecution && !demoExecution.active && demoExecution.elapsedSeconds >= 720 && (
        <div style={{ background: "#F8F7F4", borderBottom: "1px solid #E8E4DC", padding: "48px 0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div style={{ width: 64, height: 64, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 2, background: "#2B8A6E", flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2B8A6E" }}>EXECUTION SUCCESSFUL</span>
                  </div>
                  <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY }}>
                    Execution Complete
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {demoExecution.scenario} — coordinated response delivered in under 12 minutes
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div style={{ padding: 16, background: "#fff", border: "1px solid #E8E4DC", textAlign: "center", minWidth: 100 }}>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY }}>{demoExecution.completedTasks.length}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280" }}>Tasks</div>
                </div>
                <div style={{ padding: 16, background: "#fff", border: "1px solid #E8E4DC", textAlign: "center", minWidth: 100 }}>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#2B8A6E" }}>$154K</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280" }}>Value Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZONE 3: Management Grid */}
      <div className="bg-[#F8F7F4] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Signals & Alerts */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="border border-[#E8E4DC] bg-white">
                <CardHeader className="border-b border-[#E8E4DC]">
                  <div className="flex items-center justify-between">
                    <CardTitle style={{ ...CG, color: NAVY }}>Intelligence Signals</CardTitle>
                    <Badge variant="outline" className="text-xs">{signalAlerts.length} Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[#E8E4DC]">
                    {signalAlerts.slice(0, 4).map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`p-4 transition-colors cursor-pointer hover:bg-[#F8F7F4] ${selectedSignal === alert.id ? 'bg-[#F8F7F4]' : ''}`}
                        onClick={() => setSelectedSignal(alert.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 shrink-0 w-2 h-2 rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-500' : 
                            alert.severity === 'high' ? 'bg-orange-400' : 
                            alert.severity === 'medium' ? 'bg-amber-300' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p style={{ color: NAVY, fontSize: 14, fontWeight: 600 }}>{alert.title}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span style={{ color: "#6B7280", fontSize: 11 }}>{alert.source}</span>
                              <span style={{ color: "#6B7280", fontSize: 11 }}>{alert.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#E8E4DC] px-4 py-3 flex items-center justify-between">
                    <span style={{ fontSize: 11, color: "#6B7280" }}>Showing 4 of {92 + (liveDetectionsData?.detections?.filter((d: any) => d.status !== 'acknowledged').length || 0)} active signals</span>
                    <Link href="/ai-radar">
                      <button style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, display: "flex", alignItems: "center", gap: 4 }} className="hover:opacity-70 transition-opacity">
                        View all signals <ChevronRight style={{ width: 13, height: 13 }} />
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {ideaRecommendation && (
                <Card className="border border-[#E8E4DC] bg-[#0A0F2E] text-white overflow-hidden">
                  <CardContent className="p-0">
                    {/* IDEA Framework header */}
                    <div style={{ background: "rgba(201,168,76,0.15)", borderBottom: "1px solid rgba(201,168,76,0.25)", padding: "10px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {['I','D','E','A'].map((letter, i) => (
                            <span key={letter} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: i === 1 ? '#C9A84C' : "rgba(255,255,255,0.4)", padding: "1px 6px", background: i === 1 ? "rgba(201,168,76,0.2)" : "transparent", border: i === 1 ? "1px solid rgba(201,168,76,0.4)" : "none" }}>{letter}</span>
                          ))}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>DETECT — Signal Fired</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Signal that fired */}
                      <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", padding: "10px 14px" }}>
                        <div className="flex items-center gap-2 mb-1">
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} className="animate-pulse" />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(239,68,68,0.9)" }}>LIVE TRIGGER</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{ideaRecommendation.signal.title}</p>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginTop: 2 }}>{ideaRecommendation.signal.source} · {ideaRecommendation.signal.time}</p>
                      </div>

                      {/* Recommended playbook */}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>EXECUTE — Recommended Playbook</div>
                        <h3 style={{ ...CG, fontSize: 18, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }}>{ideaRecommendation.playbook}</h3>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#C9A84C", background: "rgba(201,168,76,0.15)", padding: "2px 8px", border: "1px solid rgba(201,168,76,0.3)" }}>{ideaRecommendation.domain}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(239,68,68,0.9)" }}>{ideaRecommendation.urgency}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2">
                        <Link href={`/playbook-library?domain=${ideaRecommendation.domainParam}`}>
                          <Button className="w-full bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] text-xs uppercase tracking-wider">
                            <Zap className="h-3.5 w-3.5 mr-1.5" />
                            Activate Playbook Now
                          </Button>
                        </Link>
                        <Link href="/playbook-library">
                          <Button variant="outline" className="w-full border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs uppercase tracking-wider bg-transparent">
                            Browse All 170 Playbooks
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Middle Column: Coordination & Timeline */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border border-[#E8E4DC] bg-white">
                <CardHeader className="border-b border-[#E8E4DC]">
                  <div className="flex items-center justify-between">
                    <CardTitle style={{ ...CG, color: NAVY }}>Execution Coordination</CardTitle>
                    <div className="flex items-center gap-2">
                      <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(43,138,110,0.12)", color:"#3BAF8A", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"3px 10px" }}>
                        Synced
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {coordinationTimeline.map((event, idx) => (
                      <div key={event.id} className="relative pl-8">
                        {idx !== coordinationTimeline.length - 1 && (
                          <div className="absolute left-3 top-6 bottom-0 w-[1px] bg-[#E8E4DC]"></div>
                        )}
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${
                          event.status === 'completed' ? 'border-[#3BAF8A]' : 
                          event.status === 'in-progress' ? 'border-[#C9A84C] animate-pulse' : 'border-[#E8E4DC]'
                        }`}>
                          {event.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-[#3BAF8A]" />}
                          {event.status === 'in-progress' && <Clock className="w-3 h-3 text-[#C9A84C]" />}
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p style={{ color: NAVY, fontSize: 14, fontWeight: 600 }}>{event.team}: {event.action}</p>
                            <p style={{ color: "#6B7280", fontSize: 12 }}>{event.time}</p>
                          </div>
                          <Badge variant="outline" style={{ fontSize: 10, color: "#6B7280" }}>
                            {event.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-[#E8E4DC] hover:border-[#0A0F2E] transition-colors bg-[#F8F7F4]">
                  <CardContent className="p-6">
                    <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <h3 style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Launch Response</h3>
                    <p className="text-sm text-gray-600 mb-4">Execute a pre-configured playbook for active signals.</p>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      style={{ border:"1.5px solid #E8E4DC", color: NAVY, fontSize: 10, fontWeight: 700 }}
                      onClick={() => setShowScenarioLauncher(true)}
                    >
                      VIEW SCENARIOS
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-[#E8E4DC] hover:border-[#0A0F2E] transition-colors bg-white">
                  <CardContent className="p-6">
                    <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <Radio className="w-4 h-4 text-white" />
                    </div>
                    <h3 style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Signal Settings</h3>
                    <p className="text-sm text-gray-600 mb-4">Configure custom trigger thresholds and team alerts.</p>
                    <Button variant="outline" className="w-full" style={{ border:"1.5px solid #E8E4DC", color: NAVY, fontSize: 10, fontWeight: 700 }}>
                      MANAGE TRIGGERS
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-[#C9A84C]/40 hover:border-[#C9A84C] transition-colors bg-white">
                  <CardContent className="p-6">
                    <div style={{ width: 32, height: 32, background: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <h3 style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Execution History</h3>
                    <p className="text-sm text-gray-600 mb-4">Track response time trajectory and performance scores across all activations.</p>
                    <Link href="/execution-history">
                      <Button className="w-full" style={{ background: "#0A0F2E", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>
                        VIEW TRAJECTORY
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Launcher Modal */}
      {showScenarioLauncher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg border border-[#E8E4DC] bg-white shadow-2xl">
            <CardHeader className="border-b border-[#E8E4DC]">
              <div className="flex items-center justify-between">
                <CardTitle style={{ ...CG, color: NAVY }}>Launch Execution Scenario</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowScenarioLauncher(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Select a scenario to simulate organization-wide execution coordination.</p>
              <div className="space-y-3">
                {[
                  { name: 'Competitor Acquisition Response', Icon: Target },
                  { name: 'Ransomware Protocol Activation', Icon: Shield },
                  { name: 'Supply Chain Disruption APAC', Icon: Activity },
                  { name: 'Hostile Takeover Defense', Icon: AlertTriangle },
                ].map((scenario) => (
                  <div 
                    key={scenario.name}
                    className="p-4 border border-[#E8E4DC] hover:border-[#0A0F2E] cursor-pointer bg-[#F8F7F4] flex items-center gap-4 transition-colors group"
                    onClick={() => {
                      launchDemoExecution(scenario.name);
                      setShowScenarioLauncher(false);
                    }}
                  >
                    <div style={{ width: 32, height: 32, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <scenario.Icon className="w-4 h-4 text-white" />
                    </div>
                    <span style={{ color: NAVY, fontWeight: 600 }}>{scenario.name}</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: NAVY }} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
