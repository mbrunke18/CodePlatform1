import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Target, Shield, Zap, Brain, Activity, Clock, ChevronRight,
  ExternalLink, ArrowRight, CheckCircle, TrendingUp, Users,
  Eye, Layers, Database, Building2, Globe, RefreshCw, AlertTriangle
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const TABS = [
  { id: 'overview',    label: 'OVERVIEW',     icon: Layers,    color: NAVY  },
  { id: 'exposure',    label: 'EXPOSURE',     icon: Eye,       color: GOLD  },
  { id: 'drills',      label: 'DRILLS',       icon: Zap,       color: TEAL  },
  { id: 'coordination',label: 'COORDINATION', icon: Users,     color: NAVY  },
];

const PILLARS = [
  {
    id: 'growth',
    name: 'GROWTH & POSITIONING',
    icon: TrendingUp,
    color: GOLD,
    tagline: 'The opportunities worth moving on before someone else does',
  },
  {
    id: 'risk',
    name: 'RISK & RESILIENCE',
    icon: Shield,
    color: '#B43C32',
    tagline: 'The threats every organization eventually has to answer',
  },
  {
    id: 'transformation',
    name: 'TRANSFORMATION',
    icon: Zap,
    color: TEAL,
    tagline: 'The planned shifts that still need to move faster than committees allow',
  },
];

const SCENARIO_DOMAINS = [
  { name: 'M&A & Integration',        domain: 'M&A',          exposure: 62, playbooks: 24, lastDrill: '7 days ago',  icon: Building2,    level: 'high',   color: GOLD, pillar: 'growth',        nature: 'Planned',   frequency: 'Infrequent', type: 'Opportunity' },
  { name: 'Competitive Response',      domain: 'Competitive',  exposure: 78, playbooks: 21, lastDrill: '4 days ago',  icon: TrendingUp,   level: 'high',   color: GOLD, pillar: 'growth',        nature: 'Unplanned', frequency: 'Frequent',   type: 'Opportunity' },
  { name: 'Market Entry & Expansion', domain: 'Market',       exposure: 52, playbooks: 16, lastDrill: '18 days ago', icon: Globe,        level: 'medium', color: TEAL, pillar: 'growth',        nature: 'Planned',   frequency: 'Infrequent', type: 'Opportunity' },
  { name: 'Regulatory Compliance',     domain: 'Regulatory',   exposure: 55, playbooks: 18, lastDrill: '14 days ago', icon: Shield,       level: 'medium', color: TEAL, pillar: 'risk',          nature: 'Planned',   frequency: 'Frequent',   type: 'Threat' },
  { name: 'Supply Chain Disruption',  domain: 'Supply',       exposure: 65, playbooks: 15, lastDrill: '10 days ago', icon: Database,     level: 'high',   color: GOLD, pillar: 'risk',          nature: 'Unplanned', frequency: 'Frequent',   type: 'Threat' },
  { name: 'Emergency & Risk Events',  domain: 'Risk',         exposure: 71, playbooks: 14, lastDrill: '3 days ago',  icon: AlertTriangle,level: 'high',   color: GOLD, pillar: 'risk',          nature: 'Unplanned', frequency: 'Infrequent', type: 'Threat' },
  { name: 'Digital Transformation',   domain: 'Digital',      exposure: 48, playbooks: 17, lastDrill: '21 days ago', icon: Zap,          level: 'medium', color: TEAL, pillar: 'transformation',nature: 'Planned',   frequency: 'Infrequent', type: 'Opportunity' },
  { name: 'Leadership Transitions',   domain: 'Leadership',   exposure: 38, playbooks: 12, lastDrill: '30 days ago', icon: Users,        level: 'low',    color: TEAL, pillar: 'transformation',nature: 'Unplanned', frequency: 'Infrequent', type: 'Opportunity' },
  { name: 'Talent & Workforce',       domain: 'Talent',       exposure: 41, playbooks: 11, lastDrill: '25 days ago', icon: Activity,     level: 'low',    color: TEAL, pillar: 'transformation',nature: 'Planned',   frequency: 'Frequent',   type: 'Opportunity' },
];

const ACTIVE_DRILLS = [
  { name: 'Market Entry — Competitive Response Drill', status: 'in_progress', phase: 'EXECUTE', participants: 8, score: null, playbook: 'Competitive Response Protocol', domain: 'Competitive' },
  { name: 'M&A Integration Walkthrough', status: 'scheduled', phase: 'IDENTIFY', participants: 5, score: null, playbook: 'M&A Integration Protocol v3', domain: 'M&A' },
  { name: 'Regulatory Inquiry Simulation', status: 'completed', phase: 'ADVANCE', participants: 12, score: 94, playbook: 'Regulatory Response Readiness Protocol', domain: 'Regulatory' },
  { name: 'Digital Transformation Scenario', status: 'completed', phase: 'ADVANCE', participants: 7, score: 87, playbook: 'Digital Acceleration Readiness Protocol', domain: 'Digital' },
];

const getLevelColor = (level: string) => level === 'high' ? GOLD : level === 'medium' ? TEAL : '#9CA3AF';
const getStatusColor = (s: string) => s === 'in_progress' ? GOLD : s === 'completed' ? TEAL : '#9CA3AF';

export default function SituationalHub() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: triggersRaw } = useQuery<any[]>({ queryKey: ['/api/triggers'] });
  const { data: execRunsRaw } = useQuery<any[]>({ queryKey: ['/api/execution-runs'] });

  const triggers = Array.isArray(triggersRaw) ? triggersRaw : [];
  const execRuns = Array.isArray(execRunsRaw) ? execRunsRaw : [];

  const activeTriggers = triggers.filter((t: any) => t.status === 'active').length || 21;
  const activeDrills = ACTIVE_DRILLS.filter(d => d.status === 'in_progress').length;
  const overallExposure = Math.round(SCENARIO_DOMAINS.reduce((s, c) => s + c.exposure, 0) / SCENARIO_DOMAINS.length);
  const totalPlaybooks = SCENARIO_DOMAINS.reduce((s, c) => s + c.playbooks, 0);

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4]">

        {/* ─── Header ─── */}
        <div style={{ background: NAVY, padding: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5" style={{ background: GOLD }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Platform · Strategic Domains</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={CG}>
                9-Domain <em style={{ color: GOLD, fontStyle: 'italic' }}>Coverage Board</em>
              </h1>
              <p className="text-white/60 max-w-xl">
                Not just crisis. Every situation an organization will face — <span className="text-white/85 font-medium">planned and unplanned, frequent and rare, threat and opportunity</span> — pre-staged across all 9 domains and 3 strategic pillars: Growth &amp; Positioning, Risk &amp; Resilience, and Transformation.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: 'Active Triggers', value: String(activeTriggers), color: GOLD },
                { label: 'Active Drills',   value: String(activeDrills),   color: TEAL },
                { label: 'Staged Readiness Protocols',value: String(totalPlaybooks), color: '#fff' },
              ].map(b => (
                <div key={b.label} className="px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div className="text-2xl font-bold" style={{ ...CG, color: b.color }}>{b.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-0.5">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tab Bar ─── */}
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

          {/* ─── OVERVIEW ─── */}
          {activeTab === 'overview' && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Strategic Domains',  value: '9',               desc: 'Fully covered scenario areas', icon: Layers,     color: TEAL  },
                  { label: 'Staged Readiness Protocols',   value: String(totalPlaybooks), desc: 'Ready for activation',   icon: Target,     color: GOLD  },
                  { label: 'Avg Activation',     value: '11m',             desc: 'Trigger to response SLA',     icon: Clock,      color: TEAL  },
                  { label: 'Drills Completed',   value: '23',              desc: 'This quarter',                icon: CheckCircle,color: NAVY  },
                ].map(kpi => (
                  <Card key={kpi.label} className="border-[#E8E4DC] bg-white">
                    <CardContent className="p-5">
                      <div className="p-2.5 w-fit mb-3" style={{ background: `${kpi.color}12` }}><kpi.icon className="h-5 w-5" style={{ color: kpi.color }} /></div>
                      <p className="text-3xl font-bold text-[#0A0F2E]" style={CG}>{kpi.value}</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mt-1">{kpi.label}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{kpi.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Full Spectrum Coverage */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#0A0F2E]" style={CG}>Every Situation, Covered — Not Just Crisis</h2>
                <div className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                  <span>Planned <span className="text-[#0A0F2E]/30">/</span> Unplanned</span>
                  <span className="text-[#E8E4DC]">·</span>
                  <span>Frequent <span className="text-[#0A0F2E]/30">/</span> Infrequent</span>
                  <span className="text-[#E8E4DC]">·</span>
                  <span>Threat <span className="text-[#0A0F2E]/30">/</span> Opportunity</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {PILLARS.map(p => {
                  const Icon = p.icon;
                  const domainsInPillar = SCENARIO_DOMAINS.filter(d => d.pillar === p.id);
                  return (
                    <Card key={p.id} className="border-[#E8E4DC] bg-white">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="p-2" style={{ background: `${p.color}15` }}><Icon className="h-4 w-4" style={{ color: p.color }} /></div>
                          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.name}</h3>
                        </div>
                        <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">{p.tagline}</p>
                        <div className="space-y-2">
                          {domainsInPillar.map(d => (
                            <div key={d.name} className="flex items-center justify-between text-xs border-t border-[#F0EDE4] pt-2 first:border-0 first:pt-0">
                              <span className="font-medium text-[#0A0F2E]">{d.name}</span>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF] whitespace-nowrap ml-2">{d.nature} · {d.frequency}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Domain Grid */}
              <h2 className="text-xl font-bold text-[#0A0F2E] mb-4" style={CG}>Coverage Across All 9 Strategic Domains</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {SCENARIO_DOMAINS.map(d => {
                  const lc = getLevelColor(d.level);
                  const Icon = d.icon;
                  const pillar = PILLARS.find(p => p.id === d.pillar)!;
                  return (
                    <Card key={d.name} className="border-[#E8E4DC] bg-white transition-all cursor-pointer" onClick={() => setActiveTab('exposure')}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <Icon className="h-5 w-5 text-[#0A0F2E]" />
                          <Badge className="capitalize text-[10px] font-bold" style={{ background: `${lc}15`, color: lc, border: 'none' }}>
                            {d.level === 'high' ? 'High Readiness' : d.level === 'medium' ? 'Building' : 'Baseline'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-[#0A0F2E] mb-1 text-sm leading-tight">{d.name}</h3>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: pillar.color }}>{pillar.name}</span>
                          <span className="text-[9px] text-[#9CA3AF]">· {d.nature} · {d.frequency} · {d.type}</span>
                        </div>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between text-xs text-[#6B7280]">
                            <span>Readiness</span>
                            <span className="font-bold" style={{ color: lc }}>{d.exposure}%</span>
                          </div>
                          <Progress value={d.exposure} className="h-1.5 bg-[#E8E4DC]" />
                          <div className="flex justify-between text-xs text-[#6B7280] pt-0.5">
                            <span>{d.playbooks} Readiness Protocols staged</span>
                            <span>Last drill: {d.lastDrill}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Calls to Action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Readiness Exposure', desc: 'Understand where your response readiness is strongest and where gaps exist', tab: 'exposure', icon: Eye, color: GOLD },
                  { title: 'Practice Drills',     desc: 'Run live simulations against any of the 180 Readiness Protocols before an event occurs', tab: 'drills', icon: Zap, color: TEAL },
                  { title: 'Coordinate Response', desc: 'Pre-define escalation paths, stakeholder roles, and decision gates', tab: 'coordination', icon: Users, color: NAVY },
                ].map(item => (
                  <Card key={item.title} onClick={() => setActiveTab(item.tab)} className="border-[#E8E4DC] bg-white transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="p-2.5 w-fit mb-3" style={{ background: `${item.color}15` }}><item.icon className="h-5 w-5" style={{ color: item.color }} /></div>
                      <h3 className="font-bold text-[#0A0F2E] group-hover:text-[#C9A84C] transition-colors mb-1">{item.title}</h3>
                      <p className="text-sm text-[#6B7280]">{item.desc}</p>
                      <div className="flex items-center gap-1 mt-3 text-xs font-bold uppercase tracking-wider" style={{ color: item.color }}>Open <ChevronRight className="h-3 w-3" /></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ─── EXPOSURE ─── */}
          {activeTab === 'exposure' && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>Readiness Exposure Matrix</h2>
                    <Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none font-bold uppercase tracking-wider">9 Domains</Badge>
                  </div>
                  <p className="text-[#6B7280] mt-1">Understand your organization's readiness across all strategic scenario types</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/crisis-exposure-matrix"><Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E]"><ExternalLink className="h-4 w-4 mr-2" />Full Matrix</Button></Link>
                  <Link href="/playbooks"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">Browse Readiness Protocols <ChevronRight className="h-4 w-4 ml-2" /></Button></Link>
                </div>
              </div>

              {/* Overall Score + Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-[#0A0F2E] border-[#C9A84C]/20">
                  <CardContent className="p-8 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Overall Readiness Score</p>
                    <p className="text-8xl font-bold mb-2" style={{ ...CG, color: GOLD }}>{overallExposure}%</p>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">● BUILDING STRENGTH</div>
                    <p className="text-xs text-white/40 mt-3 leading-relaxed">Across all 9 strategic domains, {totalPlaybooks} Readiness Protocols staged and ready</p>
                  </CardContent>
                </Card>
                <Card className="border-[#E8E4DC] bg-white lg:col-span-2">
                  <CardContent className="p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-5">Readiness by Domain</p>
                    <div className="space-y-4">
                      {SCENARIO_DOMAINS.map(d => {
                        const lc = getLevelColor(d.level);
                        return (
                          <div key={d.name}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-medium text-[#0A0F2E] truncate mr-4">{d.name}</span>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="font-bold" style={{ color: lc }}>{d.exposure}%</span>
                                <Badge className="text-[10px]" style={{ background: `${lc}12`, color: lc, border: 'none' }}>{d.playbooks} staged</Badge>
                              </div>
                            </div>
                            <div className="relative h-1.5 bg-[#E8E4DC] overflow-hidden">
                              <div className="h-full transition-all" style={{ width: `${d.exposure}%`, background: `linear-gradient(90deg, ${lc}99, ${lc})` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Readiness Insights */}
              <h2 className="text-lg font-bold text-[#0A0F2E] mb-4" style={CG}>Where to Focus Next</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {SCENARIO_DOMAINS.filter(d => d.exposure < 60).map(d => {
                  const Icon = d.icon;
                  return (
                    <Card key={d.name} className="border-[#E8E4DC] bg-white">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="p-2 flex-shrink-0" style={{ background: `${GOLD}12` }}><Icon className="h-4 w-4" style={{ color: GOLD }} /></div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#0A0F2E] text-sm">{d.name}</h4>
                            <p className="text-xs text-[#6B7280] mt-0.5">Readiness at {d.exposure}% — {d.playbooks} Readiness Protocols available, last drill {d.lastDrill}</p>
                            <Button size="sm" onClick={() => setActiveTab('drills')} className="mt-2 h-7 text-xs bg-[#0A0F2E] text-white hover:bg-[#141B45]">Schedule Drill <ChevronRight className="h-3 w-3 ml-1" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {/* ─── DRILLS ─── */}
          {activeTab === 'drills' && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>Practice Drills</h2>
                    <Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none font-bold uppercase tracking-wider">{activeDrills} Active</Badge>
                  </div>
                  <p className="text-[#6B7280] mt-1">Rehearse your response to any strategic scenario before it happens</p>
                </div>
                <Link href="/practice-drills"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><ExternalLink className="h-4 w-4 mr-2" />Drills Center</Button></Link>
              </div>

              <div className="space-y-4 mb-8">
                {ACTIVE_DRILLS.map((drill, i) => {
                  const sc = getStatusColor(drill.status);
                  return (
                    <Card key={i} className="border-[#E8E4DC] bg-white ">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="text-[10px] font-bold capitalize" style={{ background: `${sc}15`, color: sc, border: 'none' }}>
                                {drill.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] border-[#E8E4DC] text-[#6B7280]">{drill.phase}</Badge>
                              <Badge variant="outline" className="text-[10px] border-[#E8E4DC] text-[#6B7280]">{drill.domain}</Badge>
                            </div>
                            <h3 className="font-bold text-[#0A0F2E]">{drill.name}</h3>
                            <p className="text-sm text-[#6B7280] mt-0.5">{drill.playbook} · {drill.participants} participants</p>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            {drill.score != null && (
                              <div className="text-right">
                                <div className="text-2xl font-bold" style={{ ...CG, color: drill.score >= 80 ? TEAL : GOLD }}>{drill.score}%</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Score</div>
                              </div>
                            )}
                            <Link href="/practice-drills">
                              <Button size="sm" style={{
                                background: drill.status === 'in_progress' ? NAVY : drill.status === 'scheduled' ? GOLD : TEAL,
                                color: drill.status === 'scheduled' ? NAVY : '#fff'
                              }}>
                                {drill.status === 'in_progress' ? 'Resume' : drill.status === 'scheduled' ? 'Start Now' : 'Review'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Drill by Domain */}
              <h2 className="text-lg font-bold text-[#0A0F2E] mb-4" style={CG}>Start a New Drill — By Domain</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                {SCENARIO_DOMAINS.map(d => {
                  const Icon = d.icon;
                  return (
                    <Link key={d.name} href="/practice-drills">
                      <Card className="border-[#E8E4DC] bg-white transition-all cursor-pointer hover:border-[#C9A84C] group">
                        <CardContent className="p-4 text-center">
                          <Icon className="h-5 w-5 mx-auto mb-2 text-[#6B7280] group-hover:text-[#C9A84C] transition-colors" />
                          <p className="text-xs font-semibold text-[#0A0F2E] leading-tight">{d.name}</p>
                          <p className="text-[10px] text-[#6B7280] mt-1">{d.playbooks} Readiness Protocols</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10"><Zap className="h-6 w-6 text-[#C9A84C]" /></div>
                      <div>
                        <h3 className="font-semibold text-white">The best time to practice is before an event</h3>
                        <p className="text-sm text-white/60">All 180 Readiness Protocols are available as full simulation drills</p>
                      </div>
                    </div>
                    <Link href="/practice-drills"><Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] whitespace-nowrap">Browse All Drills <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* ─── COORDINATION ─── */}
          {activeTab === 'coordination' && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>Response Coordination</h2>
                    <Badge className="bg-[#0A0F2E] text-white border-none font-bold uppercase tracking-wider">Pre-Staged</Badge>
                  </div>
                  <p className="text-[#6B7280] mt-1">Pre-defined escalation paths, stakeholder roles, and decision gates — configured before the situation arises</p>
                </div>
                <Link href="/execution-coordination"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><ExternalLink className="h-4 w-4 mr-2" />Full Coordination</Button></Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Escalation Paths */}
                <Card className="border-[#E8E4DC] bg-white">
                  <CardHeader className="border-b border-[#E8E4DC]"><CardTitle className="text-lg text-[#0A0F2E]" style={CG}>Escalation Paths</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    {[
                      { from: 'Operator / Analyst', to: 'Strategist / Director', trigger: 'Task overdue > 60 min', color: TEAL },
                      { from: 'Strategist / Director', to: 'CFO / COO', trigger: 'Financial impact threshold exceeded', color: GOLD },
                      { from: 'CFO / COO', to: 'CEO + Board', trigger: 'Situation severity: Critical or Existential', color: NAVY },
                    ].map((path, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 border-b border-[#E8E4DC] last:border-0 hover:bg-[#F8F7F4] transition-colors">
                        <div className="w-2 h-2 flex-shrink-0" style={{ background: path.color }} />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-[#0A0F2E]">{path.from} → {path.to}</div>
                          <div className="text-xs text-[#6B7280] mt-0.5">{path.trigger}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Decision Gates */}
                <Card className="border-[#E8E4DC] bg-white">
                  <CardHeader className="border-b border-[#E8E4DC]"><CardTitle className="text-lg text-[#0A0F2E]" style={CG}>Decision Gates</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    {[
                      { gate: 'Initial Authorization',     role: 'C-Suite Executive',   sla: '5 min',  status: 'configured' },
                      { gate: 'External Communications',   role: 'CEO + Legal',          sla: '10 min', status: 'configured' },
                      { gate: 'Budget Reallocation',       role: 'CFO',                  sla: '15 min', status: 'configured' },
                      { gate: 'Board Notification',        role: 'CEO + Board Chair',    sla: '30 min', status: 'configured' },
                      { gate: 'Regulatory Disclosure',     role: 'General Counsel',      sla: '60 min', status: 'pending' },
                    ].map((gate, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 border-b border-[#E8E4DC] last:border-0 hover:bg-[#F8F7F4] transition-colors">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: gate.status === 'configured' ? TEAL : GOLD }} />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-[#0A0F2E]">{gate.gate}</div>
                          <div className="text-xs text-[#6B7280] mt-0.5">{gate.role} · SLA: {gate.sla}</div>
                        </div>
                        <Badge className="text-[10px]" style={{ background: gate.status === 'configured' ? `${TEAL}12` : `${GOLD}12`, color: gate.status === 'configured' ? TEAL : GOLD, border: 'none' }}>{gate.status}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Why Pre-Staging Matters */}
              <Card className="border-[#E8E4DC] bg-white mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-[#C9A84C] mb-2" style={CG}>80+</div>
                      <p className="text-sm font-semibold text-[#0A0F2E] mb-1">Decisions in 3 hours</p>
                      <p className="text-xs text-[#6B7280]">Head coaches can make this many decisions because they pre-staged decision trees before the game. Your executives can do the same.</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#2B8A6E] mb-2" style={CG}>12 min</div>
                      <p className="text-sm font-semibold text-[#0A0F2E] mb-1">Trigger to full activation</p>
                      <p className="text-xs text-[#6B7280]">When coordination is pre-staged, stakeholders receive role-specific briefs, tasks are auto-assigned, and documents are staged within minutes.</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#0A0F2E] mb-2" style={CG}>3,600×</div>
                      <p className="text-sm font-semibold text-[#0A0F2E] mb-1">Execution Head Start</p>
                      <p className="text-xs text-[#6B7280]">Organizations with pre-staged coordination protocols enter live execution in 12 minutes — while others spend weeks building coordination structures during the event.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10"><Users className="h-6 w-6 text-[#C9A84C]" /></div>
                      <div>
                        <h3 className="font-semibold text-white">Pre-stage your coordination protocols</h3>
                        <p className="text-sm text-white/60">Define escalation paths and decision gates for every domain before you need them</p>
                      </div>
                    </div>
                    <Link href="/execution-coordination"><Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] whitespace-nowrap">Coordination Hub <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
