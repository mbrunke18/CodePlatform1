import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import AIRadarDashboard from '@/pages/AIRadarDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Radio, Brain, Activity, Zap, Target, Shield, Eye, BarChart3,
  TrendingUp, AlertTriangle, CheckCircle, ChevronRight, ExternalLink,
  ArrowRight, Clock, Layers, Globe, Cpu, Database
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const TABS = [
  { id: 'overview',  label: 'OVERVIEW',   icon: BarChart3, color: TEAL },
  { id: 'radar',     label: 'AI RADAR',   icon: Radio,     color: GOLD },
  { id: 'signals',   label: 'SIGNALS',    icon: Zap,       color: TEAL },
  { id: 'compound',  label: 'COMPOUND',   icon: Brain,     color: NAVY },
  { id: 'audit',     label: 'AUDIT',      icon: Shield,    color: NAVY },
];

const SIGNAL_DOMAINS = [
  { domain: 'Financial Markets', signals: 28, active: 12, severity: 'high', icon: TrendingUp },
  { domain: 'Regulatory & Compliance', signals: 22, active: 8, severity: 'medium', icon: Shield },
  { domain: 'Competitive Intelligence', signals: 31, active: 15, severity: 'high', icon: Target },
  { domain: 'Macroeconomic', signals: 19, active: 5, severity: 'low', icon: Globe },
  { domain: 'Technology Disruption', signals: 24, active: 10, severity: 'medium', icon: Cpu },
  { domain: 'Supply Chain', signals: 17, active: 7, severity: 'medium', icon: Layers },
  { domain: 'Human Capital', signals: 15, active: 4, severity: 'low', icon: Activity },
  { domain: 'Cybersecurity', signals: 21, active: 9, severity: 'high', icon: Database },
];

const COMPOUND_THREATS = [
  { title: "Regulatory + Competitive Convergence", domains: ['Regulatory', 'Competitive'], severity: 'critical', confidence: 87, desc: "New compliance requirements coincide with a competitor market expansion. Combined impact may compress margins 12–18%." },
  { title: "Financial Stress + Supply Chain Strain", domains: ['Financial', 'Supply Chain'], severity: 'high', confidence: 79, desc: "Credit tightening signals align with key supplier instability indicators. Procurement disruption risk elevated." },
  { title: "Talent Attrition + Tech Disruption", domains: ['Human Capital', 'Technology'], severity: 'medium', confidence: 71, desc: "AI adoption acceleration coincides with senior talent exit patterns. Execution gap risk in next 90 days." },
];

export default function IntelligenceHub() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: dynamicStatus } = useQuery<any>({ queryKey: ['/api/dynamic-strategy/status'] });
  const { data: triggersRaw } = useQuery<any[]>({ queryKey: ['/api/triggers'] });
  const { data: signalMonitoring } = useQuery<any>({ queryKey: ['/api/signal-monitoring/status'] });

  const triggers = Array.isArray(triggersRaw) ? triggersRaw : [];
  const activeTriggers = triggers.filter((t: any) => t.status === 'active').length || 21;
  const weakSignals = dynamicStatus?.weakSignalsDetected || 34;
  const oraclePatterns = dynamicStatus?.oraclePatternsActive || 7;
  const readinessScore = dynamicStatus?.readinessScore || 84;

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4]">

        {/* ─── Header Banner ─── */}
        <div style={{ background: NAVY, padding: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5" style={{ background: GOLD }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Strategic Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={CG}>
                Intelligence <em style={{ color: GOLD, fontStyle: 'italic' }}>Command Center</em>
              </h1>
              <p className="text-white/60 max-w-xl">
                248+ data points. 20 signal categories. Real-time AI pattern detection. 15-minute monitoring cycles.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: 'Active Signals', value: String(activeTriggers), color: GOLD },
                { label: 'Weak Signals', value: String(weakSignals), color: TEAL },
                { label: 'Oracle Patterns', value: String(oraclePatterns), color: '#8B5CF6' },
              ].map(b => (
                <div key={b.label} className="px-4 py-3 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
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
              {/* KPI Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Signal Categories', value: '20', desc: 'Enterprise domains monitored', icon: Layers, color: TEAL },
                  { label: 'Data Points', value: '248+', desc: 'Tracked in real time', icon: Database, color: GOLD },
                  { label: 'Active Triggers', value: String(activeTriggers), desc: 'Currently firing', icon: Zap, color: TEAL },
                  { label: 'AI Patterns', value: String(oraclePatterns), desc: 'Cross-domain correlations', icon: Brain, color: NAVY },
                ].map(kpi => (
                  <Card key={kpi.label} className="border-[#E8E4DC] bg-white">
                    <CardContent className="p-5">
                      <div className="p-2.5 rounded-lg w-fit mb-3" style={{ background: `${kpi.color}12` }}><kpi.icon className="h-5 w-5" style={{ color: kpi.color }} /></div>
                      <p className="text-3xl font-bold text-[#0A0F2E]" style={CG}>{kpi.value}</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mt-1">{kpi.label}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{kpi.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Signal Domain Grid */}
              <h2 className="text-xl font-bold text-[#0A0F2E] mb-4" style={CG}>Signal Domains — Live Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {SIGNAL_DOMAINS.map(d => {
                  const sevColor = d.severity === 'high' ? '#dc2626' : d.severity === 'medium' ? GOLD : TEAL;
                  const Icon = d.icon;
                  return (
                    <Card key={d.domain} className="border-[#E8E4DC] bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('signals')}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Icon className="h-5 w-5" style={{ color: NAVY }} />
                          <Badge className="text-[10px] font-bold capitalize" style={{ background: `${sevColor}15`, color: sevColor, border: 'none' }}>{d.severity}</Badge>
                        </div>
                        <h3 className="font-semibold text-[#0A0F2E] text-sm mb-1">{d.domain}</h3>
                        <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
                          <span>{d.signals} signals</span>
                          <span className="font-bold" style={{ color: sevColor }}>{d.active} active</span>
                        </div>
                        <Progress value={(d.active / d.signals) * 100} className="h-1.5 bg-[#E8E4DC]" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'AI Radar Dashboard', desc: 'Real-time AI signal detection and pattern analysis', path: '/ai-radar', tab: 'radar', icon: Radio, color: GOLD },
                  { title: 'Signal Intelligence', desc: '248 data points across 20 categories', path: '/signal-intelligence', tab: 'signals', icon: Zap, color: TEAL },
                  { title: 'Compound Threats', desc: 'Cross-domain disruption synthesis', path: '/intelligence', tab: 'compound', icon: Brain, color: NAVY },
                ].map(item => (
                  <Card key={item.title} onClick={() => setActiveTab(item.tab)} className="border-[#E8E4DC] bg-white hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="p-2.5 rounded-xl w-fit mb-3" style={{ background: `${item.color}15` }}><item.icon className="h-5 w-5" style={{ color: item.color }} /></div>
                      <h3 className="font-bold text-[#0A0F2E] group-hover:text-[#C9A84C] transition-colors mb-1">{item.title}</h3>
                      <p className="text-sm text-[#6B7280]">{item.desc}</p>
                      <div className="flex items-center gap-1 mt-3 text-xs font-bold uppercase tracking-wider" style={{ color: item.color }}>Open <ChevronRight className="h-3 w-3" /></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ─── AI RADAR ─── */}
          {activeTab === 'radar' && (
            <div className="-mx-4 sm:-mx-6 lg:-mx-8">
              <AIRadarDashboard embedded={true} />
            </div>
          )}

          {/* ─── SIGNALS ─── */}
          {activeTab === 'signals' && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3"><h1 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>Signal Intelligence Dashboard</h1><Badge className="bg-[#2B8A6E] text-white border-none px-3 py-1 font-bold uppercase tracking-wider">LIVE</Badge></div>
                  <p className="text-[#6B7280] mt-1">248 data points monitored across 20 enterprise domains</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/signal-intelligence"><Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E]"><ExternalLink className="h-4 w-4 mr-2" />Full Signal Hub</Button></Link>
                  <Link href="/triggers-management"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">Manage Triggers <ChevronRight className="h-4 w-4 ml-2" /></Button></Link>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {SIGNAL_DOMAINS.map(d => {
                  const Icon = d.icon;
                  const sevColor = d.severity === 'high' ? '#dc2626' : d.severity === 'medium' ? GOLD : TEAL;
                  const actPct = Math.round((d.active / d.signals) * 100);
                  return (
                    <Card key={d.domain} className="border-[#E8E4DC] bg-white hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg flex-shrink-0" style={{ background: `${NAVY}08` }}><Icon className="h-5 w-5" style={{ color: NAVY }} /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-[#0A0F2E]">{d.domain}</h3>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-[#6B7280]">{d.signals} data points</span>
                                <Badge className="text-[10px] font-bold capitalize" style={{ background: `${sevColor}15`, color: sevColor, border: 'none' }}>{d.active} active</Badge>
                                <Badge className="text-[10px] font-bold capitalize" style={{ background: `${sevColor}15`, color: sevColor, border: 'none' }}>{d.severity}</Badge>
                              </div>
                            </div>
                            <Progress value={actPct} className="h-1.5 bg-[#E8E4DC]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30"><CardContent className="p-6"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-white/10"><Zap className="h-6 w-6 text-[#C9A84C]" /></div><div><h3 className="font-semibold text-white">Configure monitoring thresholds</h3><p className="text-sm text-white/60">Set sensitivity levels and notification rules for each domain</p></div></div><Link href="/signal-configuration"><Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">Signal Config <ArrowRight className="h-4 w-4 ml-2" /></Button></Link></div></CardContent></Card>
            </>
          )}

          {/* ─── COMPOUND THREATS ─── */}
          {activeTab === 'compound' && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3"><h1 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>Compound Threat Intelligence</h1><Badge className="bg-[#8B5CF6] text-white border-none px-3 py-1 font-bold uppercase tracking-wider">GPT-4o</Badge></div>
                  <p className="text-[#6B7280] mt-1">Cross-domain disruption synthesis — when multiple weak signals converge into an acute threat</p>
                </div>
                <Link href="/intelligence-control-center"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><ExternalLink className="h-4 w-4 mr-2" />Intelligence Center</Button></Link>
              </div>

              <div className="space-y-4 mb-8">
                {COMPOUND_THREATS.map((threat, i) => {
                  const sevColor = threat.severity === 'critical' ? '#dc2626' : threat.severity === 'high' ? GOLD : TEAL;
                  return (
                    <Card key={i} className="border-[#E8E4DC] bg-white overflow-hidden">
                      <div className="flex">
                        <div className="w-1 flex-shrink-0" style={{ background: sevColor }} />
                        <CardContent className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="capitalize text-[10px] font-bold" style={{ background: `${sevColor}15`, color: sevColor, border: 'none' }}>{threat.severity}</Badge>
                                {threat.domains.map(d => <Badge key={d} variant="outline" className="text-[10px] border-[#E8E4DC] text-[#6B7280]">{d}</Badge>)}
                              </div>
                              <h3 className="text-lg font-bold text-[#0A0F2E] mb-2" style={CG}>{threat.title}</h3>
                              <p className="text-sm text-[#6B7280]">{threat.desc}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <div className="text-right"><div className="text-2xl font-bold" style={{ ...CG, color: sevColor }}>{threat.confidence}%</div><div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Confidence</div></div>
                              <Link href={`/workspace?tab=execute`}><Button size="sm" className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">Activate Playbook <ChevronRight className="h-3.5 w-3.5 ml-1" /></Button></Link>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* How Compound Intelligence Works */}
              <Card className="border-[#E8E4DC] bg-white mb-6">
                <CardHeader><CardTitle className="text-xl text-[#0A0F2E]" style={CG}>How Compound Intelligence Works</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { step: '01', title: 'Weak Signal Aggregation', desc: 'GPT-4o reads signals across all 20 domains simultaneously, identifying patterns invisible to domain-specific analysis.' },
                      { step: '02', title: 'Cross-Domain Correlation', desc: 'The AI identifies when signals from multiple domains show convergent patterns that amplify total risk.' },
                      { step: '03', title: 'Threat Synthesis', desc: 'A compound threat card is generated with severity score, confidence rating, and recommended response playbooks.' },
                    ].map(s => (
                      <div key={s.step}>
                        <div className="text-4xl font-bold mb-3 text-[#E8E4DC]" style={CG}>{s.step}</div>
                        <h4 className="font-bold text-[#0A0F2E] mb-2">{s.title}</h4>
                        <p className="text-sm text-[#6B7280]">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* ─── AUDIT ─── */}
          {activeTab === 'audit' && (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3"><h1 className="text-3xl font-bold text-[#0A0F2E]" style={CG}>Audit & Compliance Log</h1><Badge className="bg-[#0A0F2E] text-white border-none px-3 py-1 font-bold uppercase tracking-wider">SOC 2</Badge></div>
                  <p className="text-[#6B7280] mt-1">Complete record of all platform actions, decisions, and AI recommendations</p>
                </div>
                <Link href="/audit-logging-center"><Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><ExternalLink className="h-4 w-4 mr-2" />Full Audit Log</Button></Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Events', value: '4,821', desc: 'Logged this month', icon: Database, color: NAVY },
                  { label: 'Compliance Score', value: '98%', desc: 'SOC 2 adherence', icon: Shield, color: TEAL },
                  { label: 'Avg Response Time', value: '11.8m', desc: 'Trigger to resolution', icon: Clock, color: GOLD },
                ].map(m => (
                  <Card key={m.label} className="border-[#E8E4DC] bg-white">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3"><m.icon className="h-6 w-6" style={{ color: m.color }} /><Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-none text-xs font-bold">Healthy</Badge></div>
                      <p className="text-3xl font-bold text-[#0A0F2E] mb-1" style={CG}>{m.value}</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">{m.label}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{m.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-[#E8E4DC] bg-white mb-6">
                <CardHeader className="border-b border-[#E8E4DC]"><CardTitle className="text-base text-[#0A0F2E] flex items-center gap-2" style={CG}><Activity className="h-4 w-4 text-[#C9A84C]" />Recent Audit Events</CardTitle></CardHeader>
                <CardContent className="p-0">
                  {[
                    { action: 'Playbook Activated', detail: 'M&A Integration Protocol v3 — authorized by CEO', time: '2 min ago', type: 'execute', color: TEAL },
                    { action: 'Trigger Threshold Changed', detail: 'Competitive Intelligence: sensitivity raised from Medium to High', time: '14 min ago', type: 'config', color: GOLD },
                    { action: 'AI Brief Generated', detail: 'Supply Chain Disruption Brief — Crisis Response playbook', time: '31 min ago', type: 'ai', color: '#8B5CF6' },
                    { action: 'Role Assignment Updated', detail: 'CFO added to Financial Markets trigger notification list', time: '1 hr ago', type: 'config', color: NAVY },
                    { action: 'Playbook Performance Logged', detail: 'Regulatory Response — 78% target met rate recorded', time: '2 hr ago', type: 'outcome', color: TEAL },
                  ].map((e, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-b border-[#E8E4DC] last:border-0 hover:bg-[#F8F7F4] transition-colors">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#0A0F2E]">{e.action}</div>
                        <div className="text-xs text-[#6B7280] mt-0.5 truncate">{e.detail}</div>
                      </div>
                      <div className="text-xs text-[#6B7280] flex-shrink-0">{e.time}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-[#0A0F2E] border-[#C9A84C]/30"><CardContent className="p-6"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-white/10"><Shield className="h-6 w-6 text-[#C9A84C]" /></div><div><h3 className="font-semibold text-white">Full compliance audit trail</h3><p className="text-sm text-white/60">Export logs, filter by event type, and generate compliance reports</p></div></div><Link href="/audit-logging-center"><Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">Audit Center <ArrowRight className="h-4 w-4 ml-2" /></Button></Link></div></CardContent></Card>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
