import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Shield,
  DollarSign,
  ArrowRight,
  Radio,
  Target,
  Eye,
  ChevronRight,
  XCircle,
  Timer,
  Radar,
  Globe,
  Building2,
  Users,
  Cpu,
  Scale
} from 'lucide-react';

interface FeedItem {
  id: string;
  signalCategory: string;
  signalName: string;
  signalSource: string;
  detectedAt: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  dataPoints: { label: string; value: string }[];
  aiAnalysis: {
    summary: string;
    confidence: number;
    riskLevel: string;
    timeToImpact: string;
    keyInsight: string;
  };
  recommendedPlaybook: {
    id: string;
    name: string;
    domain: string;
    tasksCount: number;
    estimatedDuration: string;
    keyActions: string[];
  };
  costOfInaction: {
    revenueAtRisk: number;
    pipelineImpact: string;
    timeDecay: string;
    competitorAdvantage: string;
  };
  decisionStatus: string;
  slaDeadline: string;
}

interface FeedSummary {
  totalSignals: number;
  criticalSignals: number;
  pendingDecisions: number;
  approvedActions: number;
  totalRevenueAtRisk: number;
  avgConfidence: number;
  signalCategories: number;
  dataPointsMonitored: number;
  lastScanTime: string;
  nextScanTime: string;
}

const urgencyConfig: Record<string, { color: string; bg: string; border: string; icon: JSX.Element }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: <AlertTriangle className="h-4 w-4" /> },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: <Zap className="h-4 w-4" /> },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: <Activity className="h-4 w-4" /> },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: <Eye className="h-4 w-4" /> },
};

const categoryIcons: Record<string, JSX.Element> = {
  competitive: <Target className="h-5 w-5" />,
  regulatory: <Scale className="h-5 w-5" />,
  market: <TrendingUp className="h-5 w-5" />,
  cybersecurity: <Shield className="h-5 w-5" />,
  talent: <Users className="h-5 w-5" />,
  financial: <DollarSign className="h-5 w-5" />,
  technology: <Cpu className="h-5 w-5" />,
  supply_chain: <Globe className="h-5 w-5" />,
};

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function timeUntil(dateString: string): string {
  const diff = new Date(dateString).getTime() - Date.now();
  if (diff <= 0) return 'OVERDUE';
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff / 60000)}m`;
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function PulseIntelligence() {
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Record<string, string>>({});

  const { data, isLoading, isError } = useQuery<{ feed: FeedItem[]; summary: FeedSummary }>({
    queryKey: ['/api/pulse/intelligence-feed'],
    refetchInterval: 30000,
  });

  const feed = data?.feed || [];
  const summary = data?.summary;
  const selected = feed.length > 0 ? (feed.find(f => f.id === selectedSignal) || feed[0]) : null;

  const handleDecision = (signalId: string, decision: string) => {
    setDecisions(prev => ({ ...prev, [signalId]: decision }));
  };

  const getDecisionStatus = (item: FeedItem) => {
    return decisions[item.id] || item.decisionStatus;
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-20" />)}
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-[600px]" />
            <Skeleton className="h-[600px]" />
            <Skeleton className="h-[600px]" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (isError || (!isLoading && feed.length === 0)) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Intelligence Feed Unavailable</h2>
            <p className="text-slate-200">Unable to load signal intelligence data. Please try again shortly.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen">
        {/* ROI Value Context */}
        <div className="max-w-[1600px] mx-auto px-6 pt-6">
          <Card className="bg-indigo-50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-700" data-testid="pulse-roi-context">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Brain className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-semibold text-indigo-900 dark:text-indigo-100 text-sm">How Pulse Saves You Money</div>
                <div className="text-xs text-indigo-700 dark:text-indigo-300">Detects market shifts and competitive threats 4 weeks ahead, preventing $1.5M+ in missed strategic windows</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Command Center Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-indigo-500/20">
          <div className="max-w-[1600px] mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Signal-to-Action Intelligence</h1>
                  <p className="text-slate-200 text-sm">AI-powered threat detection, analysis, and strategic response orchestration</p>
                </div>
                <OnboardingTrigger pageId="pulse-intelligence" autoStart={true} className="bg-white/10 border-white/30 text-white hover:bg-white/20" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                  <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-400">SCANNING {summary?.dataPointsMonitored || 0} DATA POINTS</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
                  <Radar className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-xs font-medium text-indigo-400">{summary?.signalCategories || 0} SIGNAL CATEGORIES</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Bar */}
        <div className="border-b border-slate-800/50">
          <div className="max-w-[1600px] mx-auto px-6 py-3">
            <div className="grid grid-cols-5 gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-red-500/5 border border-red-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-xl font-bold text-red-400">{summary?.criticalSignals || 0}</div>
                  <div className="text-[10px] uppercase tracking-wider text-red-400/70">Critical Signals</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-amber-400" />
                <div>
                  <div className="text-xl font-bold text-amber-400">{summary?.pendingDecisions || 0}</div>
                  <div className="text-[10px] uppercase tracking-wider text-amber-400/70">Awaiting Decision</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="text-xl font-bold text-emerald-400">{summary?.approvedActions || 0}</div>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-400/70">Actions Approved</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-rose-400" />
                <div>
                  <div className="text-xl font-bold text-rose-400">{formatCurrency(summary?.totalRevenueAtRisk || 0)}</div>
                  <div className="text-[10px] uppercase tracking-wider text-rose-400/70">Revenue at Risk</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <Brain className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-xl font-bold text-blue-400">{Math.round((summary?.avgConfidence || 0) * 100)}%</div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-400/70">AI Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three-Panel Layout: Signal Feed | AI Analysis | Decision & Cost */}
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <div className="grid grid-cols-12 gap-5 min-h-[700px]">

            {/* LEFT: Signal Feed */}
            <div className="col-span-3 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Live Signal Feed</h2>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                  {feed.length} Active
                </Badge>
              </div>
              <div className="space-y-2 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
                {feed.map((item) => {
                  const urg = urgencyConfig[item.urgency] || urgencyConfig.medium;
                  const isSelected = (selected?.id === item.id);
                  const status = getDecisionStatus(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSignal(item.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/20' 
                          : 'bg-slate-900/50 border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded-md ${urg.bg} ${urg.color} mt-0.5 flex-shrink-0`}>
                          {categoryIcons[item.signalCategory] || <Activity className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`${urg.bg} ${urg.color} ${urg.border} text-[9px] px-1.5 py-0`}>
                              {item.urgency.toUpperCase()}
                            </Badge>
                            {status === 'approved' && (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] px-1.5 py-0">
                                APPROVED
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-sm font-medium text-white truncate">{item.signalName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-300">{timeAgo(item.detectedAt)}</span>
                            <span className="text-[10px] text-slate-400">·</span>
                            <span className="text-[10px] text-slate-300 truncate">{item.signalSource.split('+')[0].trim()}</span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <DollarSign className="h-3 w-3 text-rose-400/70" />
                            <span className="text-[11px] text-rose-400/70 font-medium">{formatCurrency(item.costOfInaction.revenueAtRisk)} at risk</span>
                          </div>
                        </div>
                        <ChevronRight className={`h-4 w-4 flex-shrink-0 mt-1 transition-colors ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CENTER: AI Analysis */}
            <div className="col-span-5 space-y-4">
              {selected && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">AI Analysis</h2>
                    <div className="flex items-center gap-2">
                      <Brain className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-xs text-indigo-400 font-medium">{Math.round(selected.aiAnalysis.confidence * 100)}% confidence</span>
                    </div>
                  </div>

                  {/* Signal Detail */}
                  <Card className="bg-slate-900/60 border-slate-800/60">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${urgencyConfig[selected.urgency]?.bg} ${urgencyConfig[selected.urgency]?.color}`}>
                          {categoryIcons[selected.signalCategory] || <Activity className="h-6 w-6" />}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">{selected.signalName}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-200">{selected.signalSource}</span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-200">Detected {timeAgo(selected.detectedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {selected.dataPoints.map((dp, i) => (
                          <div key={i} className="p-2.5 bg-slate-800/40 rounded-md border border-slate-700/30">
                            <div className="text-[10px] text-slate-300 uppercase tracking-wider">{dp.label}</div>
                            <div className="text-sm text-white font-medium mt-0.5">{dp.value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Summary */}
                  <Card className="bg-indigo-950/30 border-indigo-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg flex-shrink-0">
                          <Brain className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5">AI Assessment</div>
                          <p className="text-sm text-slate-300 leading-relaxed">{selected.aiAnalysis.summary}</p>
                          <div className="mt-3 p-2.5 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                              <span className="text-xs font-semibold text-indigo-300">KEY INSIGHT:</span>
                            </div>
                            <p className="text-sm text-indigo-200 mt-1">{selected.aiAnalysis.keyInsight}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5">
                              <Timer className="h-3.5 w-3.5 text-amber-400" />
                              <span className="text-xs text-amber-300">{selected.aiAnalysis.timeToImpact}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Activity className="h-3.5 w-3.5 text-slate-200" />
                              <span className="text-xs text-slate-200">Risk: {selected.aiAnalysis.riskLevel}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended Playbook */}
                  <Card className="bg-emerald-950/20 border-emerald-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Recommended Playbook</span>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                          {selected.recommendedPlaybook.estimatedDuration}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                          <Building2 className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{selected.recommendedPlaybook.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-200">{selected.recommendedPlaybook.domain}</span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-200">{selected.recommendedPlaybook.tasksCount} pre-configured tasks</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {selected.recommendedPlaybook.keyActions.map((action, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] text-emerald-400 font-bold">{i + 1}</span>
                            </div>
                            <span className="text-slate-300">{action}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* RIGHT: Cost of Inaction & Decision Panel */}
            <div className="col-span-4 space-y-4">
              {selected && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Executive Decision</h2>
                    <div className="flex items-center gap-1.5">
                      <Timer className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs text-amber-400 font-medium">SLA: {timeUntil(selected.slaDeadline)}</span>
                    </div>
                  </div>

                  {/* Cost of Inaction */}
                  <Card className="bg-rose-950/20 border-rose-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Cost of Inaction
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 text-center">
                        <div className="text-3xl font-bold text-rose-400">{formatCurrency(selected.costOfInaction.revenueAtRisk)}</div>
                        <div className="text-xs text-rose-300/70 uppercase tracking-wider mt-1">Revenue at Risk</div>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2.5 bg-slate-800/40 rounded-md border border-slate-700/30">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-3.5 w-3.5 text-rose-400" />
                            <span className="text-[10px] text-rose-300/70 uppercase tracking-wider">Pipeline Impact</span>
                          </div>
                          <p className="text-sm text-white">{selected.costOfInaction.pipelineImpact}</p>
                        </div>
                        <div className="p-2.5 bg-slate-800/40 rounded-md border border-slate-700/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-3.5 w-3.5 text-amber-400" />
                            <span className="text-[10px] text-amber-300/70 uppercase tracking-wider">Time Decay</span>
                          </div>
                          <p className="text-sm text-white">{selected.costOfInaction.timeDecay}</p>
                        </div>
                        <div className="p-2.5 bg-slate-800/40 rounded-md border border-slate-700/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="h-3.5 w-3.5 text-orange-400" />
                            <span className="text-[10px] text-orange-300/70 uppercase tracking-wider">Competitor Advantage</span>
                          </div>
                          <p className="text-sm text-white">{selected.costOfInaction.competitorAdvantage}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Signal Flow Visualization */}
                  <Card className="bg-slate-900/40 border-slate-800/50">
                    <CardContent className="p-4">
                      <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Signal-to-Action Flow</div>
                      <div className="space-y-0">
                        {[
                          { label: 'Signal Detected', detail: timeAgo(selected.detectedAt), icon: <Radio className="h-3.5 w-3.5" />, color: 'text-blue-400', bgColor: 'bg-blue-500/20', done: true },
                          { label: 'AI Analysis Complete', detail: `${Math.round(selected.aiAnalysis.confidence * 100)}% confidence`, icon: <Brain className="h-3.5 w-3.5" />, color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', done: true },
                          { label: 'Playbook Matched', detail: selected.recommendedPlaybook.name, icon: <Target className="h-3.5 w-3.5" />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', done: true },
                          { label: 'Executive Decision', detail: getDecisionStatus(selected) === 'approved' ? 'Approved' : 'Awaiting approval', icon: <Shield className="h-3.5 w-3.5" />, color: getDecisionStatus(selected) === 'approved' ? 'text-emerald-400' : 'text-amber-400', bgColor: getDecisionStatus(selected) === 'approved' ? 'bg-emerald-500/20' : 'bg-amber-500/20', done: getDecisionStatus(selected) === 'approved' },
                          { label: 'Execution Started', detail: getDecisionStatus(selected) === 'approved' ? 'In progress' : 'Pending decision', icon: <Zap className="h-3.5 w-3.5" />, color: getDecisionStatus(selected) === 'approved' ? 'text-emerald-400' : 'text-slate-300', bgColor: getDecisionStatus(selected) === 'approved' ? 'bg-emerald-500/20' : 'bg-slate-800', done: getDecisionStatus(selected) === 'approved' },
                        ].map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full ${step.bgColor} flex items-center justify-center ${step.color}`}>
                                {step.done ? <CheckCircle className="h-3.5 w-3.5" /> : step.icon}
                              </div>
                              {i < 4 && <div className={`w-0.5 h-6 ${step.done ? 'bg-emerald-500/30' : 'bg-slate-700/50'}`} />}
                            </div>
                            <div className="pb-4">
                              <div className={`text-xs font-medium ${step.done ? 'text-white' : 'text-slate-200'}`}>{step.label}</div>
                              <div className="text-[10px] text-slate-300">{step.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Decision Buttons */}
                  <Card className={`border ${getDecisionStatus(selected) === 'approved' ? 'bg-emerald-950/20 border-emerald-500/30' : getDecisionStatus(selected) === 'rejected' ? 'bg-slate-900/40 border-slate-700/30' : 'bg-amber-950/20 border-amber-500/30'}`}>
                    <CardContent className="p-4">
                      {getDecisionStatus(selected) === 'approved' ? (
                        <div className="text-center py-2">
                          <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                          <div className="text-sm font-semibold text-emerald-300">Playbook Activated</div>
                          <div className="text-xs text-emerald-400/70 mt-1">Execution in progress - {selected.recommendedPlaybook.tasksCount} tasks deployed</div>
                          <Link to="/execute/tasks">
                            <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white">
                              View Execution Progress <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                            </Button>
                          </Link>
                        </div>
                      ) : getDecisionStatus(selected) === 'rejected' ? (
                        <div className="text-center py-2">
                          <XCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                          <div className="text-sm font-semibold text-slate-200">Action Declined</div>
                          <div className="text-xs text-slate-300 mt-1">Signal monitored - no playbook activation</div>
                          <Button size="sm" variant="outline" className="mt-3 border-slate-700 text-slate-200" onClick={() => handleDecision(selected.id, 'pending')}>
                            Reconsider
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3 text-center">Decision Required</div>
                          <div className="grid grid-cols-2 gap-3">
                            <Button 
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                              onClick={() => handleDecision(selected.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate Playbook
                            </Button>
                            <Button 
                              variant="outline" 
                              className="border-slate-600 text-slate-300 hover:bg-slate-800"
                              onClick={() => handleDecision(selected.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                          <p className="text-[10px] text-amber-400/50 text-center mt-2">
                            Human-AI Partnership: AI recommends, you decide
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          {/* Bottom: Value Proposition Bar */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-indigo-950/40 border border-indigo-500/20 rounded-xl">
            <div className="grid grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{summary?.dataPointsMonitored || 0}+</div>
                <div className="text-xs text-slate-200">Data Points Monitored 24/7</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">12 min</div>
                <div className="text-xs text-slate-200">Signal to Execution</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">170</div>
                <div className="text-xs text-slate-200">Pre-Built Strategic Playbooks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">{formatCurrency(summary?.totalRevenueAtRisk || 0)}</div>
                <div className="text-xs text-slate-200">Revenue Protected This Quarter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
