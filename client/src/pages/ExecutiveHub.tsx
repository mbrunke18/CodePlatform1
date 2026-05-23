import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DecisionVelocityDashboard from '@/pages/DecisionVelocityDashboard';
import {
  BarChart3, TrendingUp, Activity, Target, Brain, Eye, Zap, Shield,
  ChevronRight, RefreshCw, ArrowRight, CheckCircle, AlertTriangle,
  Clock, Trophy, Users, ExternalLink, ArrowUpRight, Layers
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const TABS = [
  { id: 'overview',   label: 'OVERVIEW',   icon: BarChart3,   color: TEAL },
  { id: 'velocity',   label: 'VELOCITY',   icon: Zap,         color: GOLD },
  { id: 'readiness',  label: 'READINESS',  icon: Target,      color: TEAL },
  { id: 'analytics',  label: 'ANALYTICS',  icon: Activity,    color: NAVY },
  { id: 'framework',  label: 'FRAMEWORK',  icon: Brain,       color: GOLD },
];

const IDEA_PHASES = [
  { letter: 'I', name: 'IDENTIFY', color: TEAL, metric: '180 Readiness Protocols', tagline: 'Know your triggers before they become crises.', aiRole: 'System-Automated', humanRole: 'Human-Configured', aiActions: ['Pattern-match trigger signals across all 9 domains', 'Score Readiness Protocol relevance for incoming scenarios', 'Surface coverage gaps in your strategic library', 'Recommend Readiness Protocols based on historical outcomes'], humanActions: ['Configure which triggers activate which Readiness Protocols', 'Set decision rights and stakeholder ownership', 'Define success metrics and risk tolerance', 'Customize governance rules for your organization'], icon: Eye },
  { letter: 'D', name: 'DETECT', color: NAVY, metric: '15min cycles', tagline: 'Real-time signal monitoring across 39 enterprise systems.', aiRole: 'System-Automated', humanRole: 'Human-Supervised', aiActions: ['Monitor 39 enterprise data sources in real time', 'Detect compound disruptions across multiple domains', 'Match incoming signals to relevant Readiness Protocols', 'Assess urgency and recommended response timeline'], humanActions: ['Review and approve trigger classification', 'Adjust signal sensitivity thresholds', 'Escalate or suppress low-priority signals', 'Set monitoring rules per domain and region'], icon: Zap },
  { letter: 'E', name: 'EXECUTE', color: GOLD, metric: '12min execution', tagline: 'From signal to coordinated action in under 12 minutes.', aiRole: 'System-Orchestrated', humanRole: 'Human-Authorized', aiActions: ['Generate task structures with role-specific assignments', 'Send stakeholder notifications with contextual briefs', 'Stage documents and draft initial communications', 'Track execution status across all active workstreams'], humanActions: ['Authorize Readiness Protocol activation with one click', 'Make real-time strategic decisions at decision gates', 'Escalate or deprioritize based on ground truth', 'Approve communications before external release'], icon: Target },
  { letter: 'A', name: 'ADVANCE', color: TEAL, metric: '↑ Compound', tagline: 'Every execution makes the organization stronger.', aiRole: 'System-Analyzed', humanRole: 'Human-Decided', aiActions: ['Generate post-activation executive summaries', 'Score stakeholder response rates and SLA adherence', 'Recommend Readiness Protocol updates based on outcomes', 'Track execution velocity trends over time'], humanActions: ['Review performance against strategic objectives', 'Approve Readiness Protocol updates and governance changes', 'Share learnings with board and leadership team', 'Set improvement targets for next activation'], icon: Brain },
];

export default function ExecutiveHub() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: readiness } = useQuery<any>({ queryKey: ['/api/dynamic-strategy/readiness'] });
  const { data: dynamicStatus } = useQuery<any>({ queryKey: ['/api/dynamic-strategy/status'] });
  const { data: decisionsRaw } = useQuery<any[]>({ queryKey: ['/api/decision-outcomes'], enabled: activeTab === 'velocity' || activeTab === 'overview' });
  const { data: execRunsRaw } = useQuery<any[]>({ queryKey: ['/api/execution-runs'] });
  const { data: triggersRaw } = useQuery<any[]>({ queryKey: ['/api/triggers'] });
  const { data: analyticsRaw } = useQuery<any>({ queryKey: ['/api/executive-analytics'], enabled: activeTab === 'analytics' });

  const decisions = Array.isArray(decisionsRaw) ? decisionsRaw : [];
  const execRuns = Array.isArray(execRunsRaw) ? execRunsRaw : [];
  const triggers = Array.isArray(triggersRaw) ? triggersRaw : [];

  const friScore = readiness?.overallScore || dynamicStatus?.readinessScore || 84.5;
  const velocityScore = readiness?.velocityScore || 92;
  const agilityScore = readiness?.agilityScore || 85;
  const successRate = decisions.length > 0
    ? Math.round((decisions.filter((d: any) => d.actualOutcome === 'successful').length / decisions.length) * 100) : 0;
  const activeTriggers = triggers.filter((t: any) => t.status === 'active').length || 12;

  const getScoreColor = (s: number) => s >= 80 ? 'text-[#2B8A6E]' : s >= 60 ? 'text-[#C9A84C]' : 'text-red-500';
  const getScoreBg = (s: number) => s >= 80 ? 'bg-[#2B8A6E]' : s >= 60 ? 'bg-[#C9A84C]' : 'bg-red-500';

  const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4]">

        {/* ─── Tab Bar ─────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-[#E8E4DC] sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-5 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all border-b-2"
                    style={{ color: isActive ? tab.color : '#9CA3AF', borderBottomColor: isActive ? tab.color : 'transparent', background: 'transparent' }}>
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ─── OVERVIEW ──────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#2B8A6E] shadow-[#2B8A6E]/30">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>Executive Hub</h1>
                      <Badge className="bg-[#2B8A6E] text-white border-none px-3 py-1 font-bold uppercase tracking-wider">LIVE</Badge>
                    </div>
                    <p className="text-[#6B7280] mt-1">Unified view of organizational gravity, velocity, and readiness</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/command-center"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><ExternalLink className="h-4 w-4 mr-2" />Full Dashboard</Button></Link>
                </div>
              </div>

              {/* Hero KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Future Readiness Index™", value: `${friScore.toFixed(1)}%`, desc: "Strategic preparedness score", icon: Target, color: getScoreColor(friScore), link: '/future-readiness' },
                  { label: "Decision Velocity", value: `${velocityScore}%`, desc: "Execution speed vs. baseline", icon: Zap, color: getScoreColor(velocityScore), link: '/decision-velocity' },
                  { label: "Organizational Agility", value: `${agilityScore}%`, desc: "Cross-functional response score", icon: Activity, color: getScoreColor(agilityScore), link: '/agility-assessment' },
                  { label: "Active Triggers", value: String(activeTriggers), desc: "Signals being monitored", icon: Eye, color: 'text-[#0A0F2E]', link: '/triggers-management' },
                ].map(kpi => (
                  <Link key={kpi.label} href={kpi.link}>
                    <Card className="border-[#E8E4DC] bg-white transition-all cursor-pointer group">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 bg-[#0A0F2E]/5"><kpi.icon className={`h-5 w-5 ${kpi.color}`} /></div>
                          <ArrowUpRight className="h-4 w-4 text-[#6B7280] group-hover:text-[#C9A84C] transition-colors" />
                        </div>
                        <p className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{kpi.value}</p>
                        <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mt-1">{kpi.label}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{kpi.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Readiness Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-[#E8E4DC] bg-white">
                  <CardHeader className="pb-4"><CardTitle className="text-lg text-[#0A0F2E] flex items-center gap-2" style={CG}><Target className="h-5 w-5 text-[#C9A84C]" />Readiness Dimensions</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Readiness Protocol Maturity", value: readiness?.playbookMaturity || 78 },
                      { label: "Signal Detection", value: readiness?.signalDetection || 86 },
                      { label: "Execution Velocity", value: velocityScore },
                      { label: "Learning Rate", value: readiness?.learningScore || 78 },
                      { label: "Adaptability", value: readiness?.adaptabilityScore || 83 },
                    ].map(dim => (
                      <div key={dim.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-[#0A0F2E]">{dim.label}</span>
                          <span className={`font-bold ${getScoreColor(dim.value)}`}>{dim.value}%</span>
                        </div>
                        <Progress value={dim.value} className="h-1.5 bg-[#E8E4DC]" />
                      </div>
                    ))}
                    <Link href="/future-readiness"><Button size="sm" variant="outline" className="w-full mt-2 border-[#0A0F2E]/20 text-[#0A0F2E]">Full Readiness Report <ChevronRight className="h-3.5 w-3.5 ml-1" /></Button></Link>
                  </CardContent>
                </Card>

                <Card className="border-[#E8E4DC] bg-white">
                  <CardHeader className="pb-4"><CardTitle className="text-lg text-[#0A0F2E] flex items-center gap-2" style={CG}><Activity className="h-5 w-5 text-[#C9A84C]" />Execution Pulse</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {[
                        { label: "Active Runs", value: execRuns.filter((r: any) => r.status === 'running').length || 2, icon: Activity, color: TEAL },
                        { label: "Decisions Tracked", value: decisions.length || 0, icon: Trophy, color: GOLD },
                        { label: "Decision Success Rate", value: `${successRate}%`, icon: CheckCircle, color: TEAL },
                        { label: "Avg Response Time", value: "12 min", icon: Clock, color: NAVY },
                      ].map(m => (
                        <div key={m.label} className="flex items-center justify-between p-3 bg-[#F8F7F4]">
                          <div className="flex items-center gap-3"><m.icon className="h-4 w-4" style={{ color: m.color }} /><span className="text-sm font-medium text-[#0A0F2E]">{m.label}</span></div>
                          <span className="font-bold text-[#0A0F2E]" style={CG}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/analytics"><Button size="sm" variant="outline" className="w-full border-[#0A0F2E]/20 text-[#0A0F2E]">Full Analytics <ChevronRight className="h-3.5 w-3.5 ml-1" /></Button></Link>
                  </CardContent>
                </Card>
              </div>

              {/* Section Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Decision Velocity Dashboard", desc: "Track how fast your executives decide", path: "/decision-velocity", icon: Zap, tab: 'velocity', color: GOLD },
                  { title: "Future Readiness Index", desc: "Strategic preparedness deep-dive", path: "/future-readiness", icon: Target, tab: 'readiness', color: TEAL },
                  { title: "Executive Analytics", desc: "Readiness Protocol performance & ROI", path: "/analytics", icon: BarChart3, tab: 'analytics', color: NAVY },
                  { title: "IDEA Framework", desc: "The operating model explained", path: "/idea-framework", icon: Brain, tab: 'framework', color: GOLD },
                ].map(item => (
                  <Card key={item.title} onClick={() => setActiveTab(item.tab)} className="border-[#E8E4DC] bg-white transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="p-2.5 w-fit mb-3" style={{ background: `${item.color}15` }}><item.icon className="h-5 w-5" style={{ color: item.color }} /></div>
                      <h3 className="font-bold text-[#0A0F2E] group-hover:text-[#C9A84C] transition-colors mb-1">{item.title}</h3>
                      <p className="text-sm text-[#6B7280]">{item.desc}</p>
                      <div className="flex items-center gap-1 mt-3 text-xs font-bold uppercase tracking-wider" style={{ color: item.color }}>Open Tab <ChevronRight className="h-3 w-3" /></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ─── VELOCITY ────────────────────────────────────────────────── */}
          {activeTab === 'velocity' && (
            <div className="-mx-4 sm:-mx-6 lg:-mx-8">
              <DecisionVelocityDashboard embedded={true} />
            </div>
          )}

          {/* ─── READINESS ───────────────────────────────────────────────── */}
          {activeTab === 'readiness' && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#2B8A6E] shadow-[#2B8A6E]/30"><Target className="h-8 w-8 text-white" /></div>
                  <div>
                    <div className="flex items-center gap-3"><h1 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>Future Readiness Index™</h1><Badge className="bg-[#2B8A6E] text-white border-none px-3 py-1 font-bold uppercase tracking-wider">LIVE</Badge></div>
                    <p className="text-[#6B7280] mt-1">Real-time strategic preparedness across 180 Readiness Protocols</p>
                  </div>
                </div>
                <Link href="/future-readiness"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><ExternalLink className="h-4 w-4 mr-2" />Full Readiness Report</Button></Link>
              </div>

              {/* Score Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="border-[#E8E4DC] bg-[#0A0F2E] col-span-1">
                  <CardContent className="p-8 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Overall Readiness Score</p>
                    <p className="text-8xl font-bold mb-2" style={{ ...CG, color: GOLD }}>{Math.round(friScore)}</p>
                    <div className={`text-xs font-bold uppercase tracking-widest ${friScore >= 80 ? 'text-[#2B8A6E]' : 'text-[#C9A84C]'}`}>
                      {friScore >= 80 ? '● HEALTHY' : '● ATTENTION REQUIRED'}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-[#E8E4DC] bg-white lg:col-span-2">
                  <CardContent className="p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-5">Dimension Breakdown</p>
                    <div className="space-y-4">
                      {[
                        { label: "Readiness Protocol Maturity", value: readiness?.playbookMaturity || 78, target: 90 },
                        { label: "Signal Detection", value: readiness?.signalDetection || 86, target: 90 },
                        { label: "Execution Velocity", value: velocityScore, target: 95 },
                        { label: "Learning Rate", value: readiness?.learningScore || 78, target: 85 },
                        { label: "Adaptability", value: readiness?.adaptabilityScore || 83, target: 90 },
                      ].map(d => (
                        <div key={d.label}>
                          <div className="flex justify-between text-sm mb-1.5"><span className="font-medium text-[#0A0F2E]">{d.label}</span><div className="flex items-center gap-3"><span className={`font-bold text-sm ${getScoreColor(d.value)}`}>{d.value}%</span><span className="text-xs text-[#6B7280]">Target: {d.target}%</span></div></div>
                          <div className="relative h-2 bg-[#E8E4DC] overflow-hidden"><div className="h-full" style={{ width: `${d.value}%`, background: d.value >= 80 ? TEAL : GOLD }} /><div className="absolute top-0 bottom-0 w-0.5 bg-[#0A0F2E]/30" style={{ left: `${d.target}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Readiness Insights */}
              <h2 className="text-xl font-bold text-[#0A0F2E] mb-4" style={CG}>Strategic Readiness Signals</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { title: "Readiness Protocols Ready", value: `${readiness?.playbooksReady || 134} / 170`, status: "good", icon: CheckCircle, desc: "Pre-staged for activation" },
                  { title: "Weak Signals Detected", value: String(readiness?.weakSignalsDetected || 23), status: "warning", icon: Eye, desc: "Early warning indicators" },
                  { title: "Avg Response Time", value: "12 min", status: "good", icon: Clock, desc: "Trigger to activation" },
                ].map(item => (
                  <Card key={item.title} className="border-[#E8E4DC] bg-white">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3"><item.icon className={`h-6 w-6 ${item.status === 'good' ? 'text-[#2B8A6E]' : 'text-[#C9A84C]'}`} /><Badge className={item.status === 'good' ? 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20' : 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20'}>{item.status === 'good' ? 'Healthy' : 'Monitor'}</Badge></div>
                      <p className="text-2xl font-bold text-[#0A0F2E] mb-1" style={CG}>{item.value}</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">{item.title}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30"><CardContent className="p-6"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="p-3 bg-white/10"><Target className="h-6 w-6 text-[#C9A84C]" /></div><div><h3 className="font-semibold text-white">Want the full readiness breakdown?</h3><p className="text-sm text-white/60">See historical trends, benchmarks, and improvement recommendations</p></div></div><Link href="/future-readiness"><Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">Full Readiness Report <ArrowRight className="h-4 w-4 ml-2" /></Button></Link></div></CardContent></Card>
            </>
          )}

          {/* ─── ANALYTICS ───────────────────────────────────────────────── */}
          {activeTab === 'analytics' && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#0A0F2E] shadow-[#0A0F2E]/30"><Activity className="h-8 w-8 text-[#C9A84C]" /></div>
                  <div>
                    <div className="flex items-center gap-3"><h1 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>Executive Analytics</h1><Badge className="bg-[#0A0F2E] text-white border-none px-3 py-1 font-bold uppercase tracking-wider">ANALYTICS</Badge></div>
                    <p className="text-[#6B7280] mt-1">Readiness Protocol performance, ROI, and organizational metrics</p>
                  </div>
                </div>
                <Link href="/analytics"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><ExternalLink className="h-4 w-4 mr-2" />Full Analytics Suite</Button></Link>
              </div>

              {/* Analytics KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Readiness Protocol Activations", value: "47", trend: "+12%", icon: Layers, color: TEAL },
                  { label: "Avg Execution Time", value: "11.4m", trend: "-8%", icon: Clock, color: GOLD },
                  { label: "Stakeholders Reached", value: "1,240", trend: "+23%", icon: Users, color: TEAL },
                  { label: "Target Met Rate", value: "78%", trend: "+5%", icon: CheckCircle, color: NAVY },
                ].map(m => (
                  <Card key={m.label} className="border-[#E8E4DC] bg-white ">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3"><m.icon className="h-5 w-5" style={{ color: m.color }} /><Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20 text-xs font-bold">{m.trend}</Badge></div>
                      <p className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{m.value}</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mt-1">{m.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Domain Performance */}
              <h2 className="text-xl font-bold text-[#0A0F2E] mb-4" style={CG}>Readiness Protocol Performance by Domain</h2>
              <div className="space-y-3 mb-8">
                {[
                  { domain: "M&A & Integration", activations: 12, successRate: 83, avgTime: "10.2m" },
                  { domain: "Crisis Response", activations: 8, successRate: 91, avgTime: "9.8m" },
                  { domain: "Regulatory Compliance", activations: 7, successRate: 86, avgTime: "13.1m" },
                  { domain: "Competitive Response", activations: 6, successRate: 75, avgTime: "12.4m" },
                  { domain: "Digital Transformation", activations: 5, successRate: 80, avgTime: "15.2m" },
                ].map(d => (
                  <Card key={d.domain} className="border-[#E8E4DC] bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1"><div className="flex items-center justify-between mb-2"><span className="font-semibold text-[#0A0F2E] text-sm">{d.domain}</span><div className="flex items-center gap-4 text-sm text-[#6B7280]"><span>{d.activations} activations</span><span>{d.avgTime} avg</span><span className={`font-bold ${getScoreColor(d.successRate)}`}>{d.successRate}% success</span></div></div><Progress value={d.successRate} className="h-1.5 bg-[#E8E4DC]" /></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Board Narrative */}
              <Card className="border-[#C9A84C]/30 mb-6" style={{ background: NAVY }}>
                <CardContent className="p-8">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(201,168,76,0.6)' }}>Board-Ready Headline</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
                    "Readiness OS delivered a <span style={{ color: GOLD }}>78% target-met rate</span> across{' '}
                    <span style={{ color: GOLD }}>47 activations</span> this period, with an average response time of{' '}
                    <span style={{ color: GOLD }}>11.4 minutes</span> — a <span style={{ color: GOLD }}>3,600× Execution Head Start</span>{' '}
                    over the industry baseline. No strategic trigger went unaddressed."
                  </p>
                  <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/10">
                    {[
                      { v: '47', l: 'Activations' },
                      { v: '11.4m', l: 'Avg Response' },
                      { v: '1,240', l: 'Stakeholders Coordinated' },
                      { v: '78%', l: 'Target Met Rate' },
                    ].map(s => (
                      <div key={s.l} className="text-center">
                        <div className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}>{s.v}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.68)' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30"><CardContent className="p-6"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="p-3 bg-white/10"><BarChart3 className="h-6 w-6 text-[#C9A84C]" /></div><div><h3 className="font-semibold text-white">See the full analytics suite</h3><p className="text-sm text-white/60">Department breakdowns, ROI dashboard, and historical trends</p></div></div><Link href="/analytics"><Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">Full Analytics <ArrowRight className="h-4 w-4 ml-2" /></Button></Link></div></CardContent></Card>
            </>
          )}

          {/* ─── FRAMEWORK ───────────────────────────────────────────────── */}
          {activeTab === 'framework' && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#C9A84C] shadow-[#C9A84C]/30"><Brain className="h-8 w-8 text-[#0A0F2E]" /></div>
                  <div>
                    <div className="flex items-center gap-3"><h1 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>The IDEA Framework™</h1><Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none px-3 py-1 font-bold uppercase tracking-wider">AI-Monitored</Badge></div>
                    <p className="text-[#6B7280] mt-1">The operating model powering 12-minute strategic execution</p>
                  </div>
                </div>
                <Link href="/idea-framework"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><ExternalLink className="h-4 w-4 mr-2" />Full Framework Page</Button></Link>
              </div>

              {/* IDEA Phases */}
              <div className="space-y-6 mb-8">
                {IDEA_PHASES.map((phase, i) => {
                  const Icon = phase.icon;
                  return (
                    <Card key={phase.letter} className="border-[#E8E4DC] bg-white overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr] gap-0">
                        {/* Phase Letter */}
                        <div className="p-6 flex flex-col items-center justify-center min-w-[80px] lg:border-r border-[#E8E4DC]" style={{ background: `${phase.color}08` }}>
                          <div className="text-5xl font-bold mb-1" style={{ ...CG, color: phase.color }}>{phase.letter}</div>
                          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: phase.color }}>{phase.name}</div>
                          <Badge className="mt-2 text-[10px] font-bold" style={{ background: `${phase.color}15`, color: phase.color, border: 'none' }}>{phase.metric}</Badge>
                        </div>
                        {/* AI Role */}
                        <div className="p-5 border-b lg:border-b-0 lg:border-r border-[#E8E4DC]">
                          <div className="flex items-center gap-2 mb-3"><div className="w-3 h-0.5 bg-[#2B8A6E]" /><span className="text-[10px] font-bold uppercase tracking-widest text-[#2B8A6E]">{phase.aiRole}</span></div>
                          <ul className="space-y-2">{phase.aiActions.map(a => <li key={a} className="flex items-start gap-2 text-sm text-[#6B7280]"><CheckCircle className="h-3.5 w-3.5 text-[#2B8A6E] flex-shrink-0 mt-0.5" />{a}</li>)}</ul>
                        </div>
                        {/* Human Role */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3"><div className="w-3 h-0.5 bg-[#C9A84C]" /><span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C]">{phase.humanRole}</span></div>
                          <ul className="space-y-2">{phase.humanActions.map(a => <li key={a} className="flex items-start gap-2 text-sm text-[#6B7280]"><Shield className="h-3.5 w-3.5 text-[#C9A84C] flex-shrink-0 mt-0.5" />{a}</li>)}</ul>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Philosophy */}
              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30 mb-6">
                <CardContent className="p-8">
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4"><div className="w-6 h-0.5 bg-[#C9A84C]" /><span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Design Philosophy</span><div className="w-6 h-0.5 bg-[#C9A84C]" /></div>
                    <h2 className="text-3xl font-bold text-white mb-4" style={CG}>AI handles complexity. Humans retain authority.</h2>
                    <p className="text-white/70 leading-relaxed">The IDEA Framework is built on a fundamental principle: AI is extraordinarily good at monitoring, pattern recognition, and orchestration — but strategic decisions require human judgment, organizational context, and accountability. We never let AI make strategy decisions.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {[{ v: '180', l: 'Readiness Protocols' }, { v: '12min', l: 'Response SLA' }, { v: '248', l: 'Data Points' }, { v: '3,600×', l: 'Head Start' }].map(s => (
                        <div key={s.l} className="text-center"><div className="text-3xl font-bold text-[#C9A84C]" style={CG}>{s.v}</div><div className="text-xs font-bold uppercase tracking-widest text-white/50 mt-1">{s.l}</div></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Link href="/workspace?tab=identify"><Button className="bg-[#2B8A6E] text-white font-bold hover:bg-[#3BAF8A]"><Layers className="h-4 w-4 mr-2" />Start with IDENTIFY</Button></Link>
                <Link href="/idea-framework"><Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E]">Full Framework Deep-Dive <ExternalLink className="h-4 w-4 ml-2" /></Button></Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
