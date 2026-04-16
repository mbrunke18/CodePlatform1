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
  Scale,
  Play,
  Settings,
  PlusCircle,
  BarChart3,
  PieChart,
  Rocket,
  UserCheck
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";

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

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const urgencyConfig: Record<string, { color: string; bg: string; border: string; icon: JSX.Element }> = {
  critical: { color: 'text-red-500', bg: 'bg-red-500/12', border: 'border-red-500/30', icon: <AlertTriangle className="h-4 w-4" /> },
  high: { color: `text-[${GOLD}]`, bg: `bg-[${GOLD}]/12`, border: `border-[${GOLD}]/30`, icon: <Zap className="h-4 w-4" /> },
  medium: { color: `text-[${TEAL}]`, bg: `bg-[${TEAL}]/12`, border: `border-[${TEAL}]/30`, icon: <Activity className="h-4 w-4" /> },
  low: { color: 'text-gray-500', bg: 'bg-gray-500/12', border: 'border-gray-500/30', icon: <Eye className="h-4 w-4" /> },
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
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-16 w-16 text-gray-800 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Intelligence Feed Unavailable</h2>
            <p className="text-gray-800">Unable to load signal intelligence data. Please try again shortly.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-white min-h-screen">
        {/* ROI Value Context */}
        <div className="max-w-[1600px] mx-auto px-6 pt-6">
          <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${TEAL}`, padding: "20px 24px", background: "#fff" }} data-testid="pulse-roi-context">
            <div className="flex items-center gap-4">
              <div style={{ width:32, height:32, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>How Pulse Saves You Money</div>
                <div style={{ fontSize: 14, color: "#6B7280" }}>Detects market shifts and competitive threats 4 weeks ahead, preventing $1.5M+ in missed strategic windows</div>
              </div>
            </div>
          </div>
        </div>

        {/* Command Center Header */}
        <div style={{ background: NAVY, padding: "48px", position: "relative", overflow: "hidden", margin: "24px", borderRadius: 0 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div style={{ width:64, height:64, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Brain className="h-10 w-10 text-[#C9A84C]" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Signal Intelligence</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,48px)", color: "#fff", lineHeight: 1.1 }}>
                  Signal-to-Action <em style={{ fontStyle: "italic", color: "#DFC178" }}>Intelligence</em>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Continuous signal monitoring, pattern analysis, and strategic response orchestration</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(43,138,110,0.12)", color:TEAL, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px", border:"1px solid rgba(43,138,110,0.3)" }}>
                SCANNING {summary?.dataPointsMonitored || 0} DATA POINTS
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(201,168,76,0.12)", color:GOLD, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px", border:"1px solid rgba(201,168,76,0.3)" }}>
                {summary?.signalCategories || 0} CATEGORIES
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Bar */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", background:"#F8F7F4", borderBottom:"1px solid #E8E4DC", margin: "0 24px" }}>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize:32, fontWeight:600, color:"#ef4444", lineHeight:1 }}>{summary?.criticalSignals || 0}</div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B7280", marginTop:4 }}>Critical</div>
          </div>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize:32, fontWeight:600, color:GOLD, lineHeight:1 }}>{summary?.pendingDecisions || 0}</div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B7280", marginTop:4 }}>Pending</div>
          </div>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize:32, fontWeight:600, color:TEAL, lineHeight:1 }}>{summary?.approvedActions || 0}</div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B7280", marginTop:4 }}>Approved</div>
          </div>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize:32, fontWeight:600, color:"#ef4444", lineHeight:1 }}>{formatCurrency(summary?.totalRevenueAtRisk || 0)}</div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B7280", marginTop:4 }}>At Risk</div>
          </div>
          <div style={{ padding:24 }}>
            <div style={{ ...CG, fontSize:32, fontWeight:600, color:NAVY, lineHeight:1 }}>{Math.round((summary?.avgConfidence || 0) * 100)}%</div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B7280", marginTop:4 }}>Confidence</div>
          </div>
        </div>

        {/* Three-Panel Layout */}
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8 min-h-[700px]">

            {/* LEFT: Signal Feed */}
            <div className="col-span-3 space-y-4">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Live Signals</span>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                {feed.map((item) => {
                  const urg = urgencyConfig[item.urgency] || urgencyConfig.medium;
                  const isSelected = (selected?.id === item.id);
                  const status = getDecisionStatus(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSignal(item.id)}
                      className={`w-full text-left p-4 border transition-all ${
                        isSelected 
                          ? `bg-[#F8F7F4] border-[${NAVY}]` 
                          : 'bg-white border-[#E8E4DC] hover:border-[#6B7280]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div style={{ width:32, height:32, background: isSelected ? NAVY : "#F8F7F4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink: 0 }}>
                          <div className={isSelected ? "text-white" : "text-[#0A0F2E]"}>
                            {categoryIcons[item.signalCategory] || <Activity className="h-5 w-5" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span style={{ display:"inline-flex", alignItems:"center", background: item.urgency === 'critical' ? 'rgba(239,68,68,0.12)' : 'rgba(201,168,76,0.12)', color: item.urgency === 'critical' ? '#ef4444' : GOLD, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                              {item.urgency}
                            </span>
                            {status === 'approved' && (
                              <span style={{ display:"inline-flex", alignItems:"center", background: "rgba(43,138,110,0.12)", color: TEAL, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                                APPROVED
                              </span>
                            )}
                          </div>
                          <h3 style={{ ...CG, fontSize: 16, fontWeight: 600, color: NAVY }}>{item.signalName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span style={{ fontSize: 10, color: "#6B7280" }}>{timeAgo(item.detectedAt)}</span>
                            <span style={{ fontSize: 10, color: "#E8E4DC" }}>|</span>
                            <span style={{ fontSize: 10, color: "#6B7280" }} className="truncate">{item.signalSource.split('+')[0].trim()}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CENTER: Signal Analysis */}
            <div className="col-span-5 space-y-6">
              {selected && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Signal Analysis</span>
                  </div>

                  {/* Signal Detail */}
                  <div style={{ border: "1px solid #E8E4DC", padding: 32, background: "#fff" }}>
                    <div className="flex items-center gap-6 mb-8">
                      <div style={{ width:64, height:64, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div className="text-white">
                          {categoryIcons[selected.signalCategory] || <Activity className="h-8 w-8" />}
                        </div>
                      </div>
                      <div>
                        <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY }}>{selected.signalName}</h2>
                        <div className="flex items-center gap-4 mt-2">
                          <span style={{ fontSize: 12, color: "#6B7280" }}>Source: {selected.signalSource}</span>
                          <span style={{ fontSize: 12, color: "#E8E4DC" }}>|</span>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>Detected {timeAgo(selected.detectedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {selected.dataPoints.map((dp, i) => (
                        <div key={i} style={{ padding: 16, background: OFF, border: "1px solid #E8E4DC" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#6B7280", marginBottom: 4 }}>{dp.label}</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: NAVY }}>{dp.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div style={{ background: NAVY, padding: 32, border: "1px solid #E8E4DC" }}>
                    <div className="flex items-start gap-6">
                      <div style={{ width:40, height:40, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Brain className="h-5 w-5 text-[#C9A84C]" />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)" }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>AI Assessment</span>
                        </div>
                        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, ...CG }}>{selected.aiAnalysis.summary}</p>
                        <div style={{ marginTop: 24, padding: 20, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
                          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Key Strategic Insight</p>
                          <p style={{ fontSize: 15, color: "#DFC178", fontStyle: "italic" }}>{selected.aiAnalysis.keyInsight}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT: Decision & Playbook */}
            <div className="col-span-4 space-y-6">
              {selected && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Action Required</span>
                  </div>

                  {/* Cost of Inaction */}
                  <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #ef4444", padding: 24, background: "#fff" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ef4444" }}>Cost of Inaction</span>
                    </div>
                    <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: "#ef4444", lineHeight: 1 }}>{formatCurrency(selected.costOfInaction.revenueAtRisk)}</div>
                    <p style={{ fontSize: 12, color: "#6B7280", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Revenue At Risk · {selected.costOfInaction.timeDecay} Decay</p>
                  </div>

                  {/* Recommended Playbook */}
                  <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${TEAL}`, padding: 24, background: "#fff" }}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-[#2B8A6E]" />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL }}>Recommended Playbook</span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>{selected.recommendedPlaybook.estimatedDuration}</span>
                    </div>
                    <h4 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY }}>{selected.recommendedPlaybook.name}</h4>
                    <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{selected.recommendedPlaybook.domain} • {selected.recommendedPlaybook.tasksCount} Automated Tasks</p>
                    
                    <div className="mt-6 space-y-3">
                      {selected.recommendedPlaybook.keyActions.map((action, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div style={{ width: 16, height: 16, background: NAVY, color: GOLD, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, flexShrink: 0 }}>{i + 1}</div>
                          <span style={{ fontSize: 13, color: "#4B5563" }}>{action}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex gap-3">
                      <Button className="flex-1 bg-[#0A0F2E] text-white hover:bg-[#141B45]" onClick={() => handleDecision(selected.id, 'approved')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Authorize
                      </Button>
                      <Button variant="outline" className="flex-1 border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]" onClick={() => handleDecision(selected.id, 'dismissed')}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
