import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Settings, Building2, Users, Target, Shield, Puzzle,
  ChevronRight, ExternalLink, Bell, Key, Globe, Activity,
  CheckCircle, Clock, ArrowRight, CreditCard, Zap, Database, Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const SECTIONS = [
  { id: 'overview',      label: 'Overview',               icon: Settings,   color: NAVY },
  { id: 'organization',  label: 'Organization',           icon: Building2,  color: TEAL },
  { id: 'stakeholders',  label: 'Stakeholders',           icon: Users,      color: GOLD },
  { id: 'metrics',       label: 'Success Metrics',        icon: Target,     color: TEAL },
  { id: 'roles',         label: 'Roles & Permissions',    icon: Shield,     color: NAVY },
  { id: 'integrations',  label: 'Integrations',           icon: Puzzle,     color: GOLD },
  { id: 'notifications', label: 'Notifications',          icon: Bell,       color: NAVY },
];

export default function SettingsHub() {
  const [activeSection, setActiveSection] = useState('overview');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: orgsRaw } = useQuery<any[]>({ queryKey: ['/api/organizations'] });
  const { data: stakeholdersRaw } = useQuery<any[]>({ queryKey: ['/api/stakeholders'] });
  const { data: metricsRaw } = useQuery<any[]>({ queryKey: ['/api/success-metrics'] });

  const org = Array.isArray(orgsRaw) ? orgsRaw[0] : null;
  const stakeholders = Array.isArray(stakeholdersRaw) ? stakeholdersRaw : [];
  const metrics = Array.isArray(metricsRaw) ? metricsRaw : [];

  const activeData = SECTIONS.find(s => s.id === activeSection)!;

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4]">

        {/* ─── Page Header ─── */}
        <div style={{ background: NAVY, padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
          <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-0.5" style={{ background: GOLD }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Platform Configuration</span>
              </div>
              <h1 className="text-4xl font-bold text-white" style={CG}>
                Settings & <em style={{ color: GOLD, fontStyle: 'italic' }}>Configuration</em>
              </h1>
              <p className="text-white/50 mt-2 text-sm">Manage your organization, stakeholders, integrations, and platform preferences</p>
            </div>
            {user && <div className="flex items-center gap-3 bg-white/10 px-5 py-3 border border-white/10">
              <div className="w-8 h-8 bg-[#C9A84C] flex items-center justify-center text-sm font-bold text-[#0A0F2E]">{(user as any).firstName?.[0] || 'U'}</div>
              <div><div className="text-white font-semibold text-sm">{(user as any).firstName} {(user as any).lastName}</div><div className="text-white/40 text-xs">{org?.name || 'Organization Admin'}</div></div>
            </div>}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ─── Sidebar Nav ─── */}
            <div className="lg:w-60 flex-shrink-0">
              <nav className="space-y-1 sticky top-8">
                {SECTIONS.map(s => {
                  const Icon = s.icon;
                  const isActive = activeSection === s.id;
                  return (
                    <button key={s.id} onClick={() => setActiveSection(s.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left"
                      style={{
                        background: isActive ? `${s.color}12` : 'transparent',
                        color: isActive ? s.color : '#6B7280',
                        border: isActive ? `1px solid ${s.color}25` : '1px solid transparent',
                      }}>
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {s.label}
                      {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ─── Content Area ─── */}
            <div className="flex-1 min-w-0">

              {/* ── OVERVIEW ── */}
              {activeSection === 'overview' && (() => {
                const SECTION_META: Record<string, { desc: string; stat: string; statSub: string; accent: string }> = {
                  organization: { desc: 'Company name, industry, pilot parameters, and response window.', stat: org?.name ? '1 Org' : 'Pending', statSub: 'configuration', accent: TEAL },
                  stakeholders: { desc: 'Manage who gets notified for each prepared response activation and trigger.', stat: `${stakeholders.length}`, statSub: 'stakeholders configured', accent: GOLD },
                  metrics: { desc: 'Define success criteria and KPIs for all execution outcomes.', stat: `${metrics.length}`, statSub: 'metrics tracked', accent: TEAL },
                  roles: { desc: 'Control who can authorize prepared response activation and view intel.', stat: '4', statSub: 'permission levels', accent: '#7C9DB5' },
                  integrations: { desc: 'Connect enterprise systems — Teams, Copilot, Azure, Entra.', stat: '10+', statSub: 'connectors available', accent: GOLD },
                  notifications: { desc: 'Alert preferences and delivery settings for the 12-min window.', stat: 'Live', statSub: 'alert system', accent: TEAL },
                };
                return (
                  <div>
                    <style>{`
                      @keyframes sh-fadeup { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
                      .sh-tile-1{animation:sh-fadeup 0.38s ease 0.04s both}
                      .sh-tile-2{animation:sh-fadeup 0.38s ease 0.09s both}
                      .sh-tile-3{animation:sh-fadeup 0.38s ease 0.14s both}
                      .sh-tile-4{animation:sh-fadeup 0.38s ease 0.19s both}
                      .sh-tile-5{animation:sh-fadeup 0.38s ease 0.24s both}
                      .sh-tile-6{animation:sh-fadeup 0.38s ease 0.29s both}
                    `}</style>

                    {/* Status strip */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: NAVY, marginBottom: 20 }}>
                      {[
                        { label: 'Organization', value: org?.name || 'Not configured', status: org ? 'good' : 'warn', icon: Building2, action: () => setActiveSection('organization') },
                        { label: 'Stakeholders', value: `${stakeholders.length} configured`, status: stakeholders.length > 0 ? 'good' : 'warn', icon: Users, action: () => setActiveSection('stakeholders') },
                        { label: 'Success Metrics', value: `${metrics.length} tracked`, status: metrics.length > 0 ? 'good' : 'warn', icon: Target, action: () => setActiveSection('metrics') },
                      ].map(item => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} onClick={item.action} style={{ background: 'rgba(255,255,255,0.04)', padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <Icon style={{ width: 14, height: 14, color: GOLD }} />
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#F0EDE4' }}>{item.label}</div>
                                <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.4)' }}>{item.value}</div>
                              </div>
                            </div>
                            {item.status === 'good'
                              ? <CheckCircle style={{ width: 14, height: 14, color: TEAL }} />
                              : <div style={{ width: 7, height: 7, borderRadius: 0, background: GOLD }} />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Section Tiles */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                      {SECTIONS.slice(1).map((s, i) => {
                        const Icon = s.icon;
                        const meta = SECTION_META[s.id];
                        return (
                          <div
                            key={s.id}
                            className={`sh-tile-${i + 1}`}
                            onClick={() => setActiveSection(s.id)}
                            style={{
                              background: NAVY,
                              border: `1px solid rgba(255,255,255,0.07)`,
                              borderBottom: `3px solid ${meta.accent}`,
                              padding: '18px 20px',
                              cursor: 'pointer',
                              transition: 'all 0.18s ease',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                              <div style={{ width: 34, height: 34, background: `${meta.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon style={{ width: 16, height: 16, color: meta.accent }} />
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: meta.accent, lineHeight: 1 }}>{meta.stat}</div>
                                <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.45)', marginTop: 2 }}>{meta.statSub}</div>
                              </div>
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: '#F0EDE4', marginBottom: 4 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: 'rgba(240,237,228,0.45)', lineHeight: 1.4, marginBottom: 12 }}>{meta.desc}</div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(240,237,228,0.4)' }}>CONFIGURE →</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* ── ORGANIZATION ── */}
              {activeSection === 'organization' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold text-[#0A0F2E]" style={CG}>Organization Settings</h2><p className="text-[#6B7280] mt-1">Configure your company profile and pilot parameters</p></div><Link href="/organization-setup"><Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E]"><ExternalLink className="h-4 w-4 mr-2" />Full Setup Page</Button></Link></div>

                  <Card className="border-[#E8E4DC] bg-white">
                    <CardHeader className="border-b border-[#E8E4DC]"><CardTitle className="text-lg text-[#0A0F2E]" style={CG}>Organization Profile</CardTitle></CardHeader>
                    <CardContent className="p-6 space-y-5">
                      {[
                        { label: 'Organization Name', value: org?.name || 'Innovate Dynamics', type: 'text' },
                        { label: 'Industry', value: org?.industry || 'Enterprise Technology', type: 'text' },
                        { label: 'Company Size', value: org?.size || '1,000–5,000 employees', type: 'text' },
                        { label: 'Headquarters', value: org?.location || 'New York, NY', type: 'text' },
                      ].map(f => (
                        <div key={f.label}><Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">{f.label}</Label><Input className="mt-1.5 border-[#E8E4DC]" defaultValue={f.value} readOnly /></div>
                      ))}
                      <div className="flex items-center justify-between pt-2"><div><p className="font-medium text-[#0A0F2E] text-sm">Pilot Mode</p><p className="text-xs text-[#6B7280] mt-0.5">Restrict activation to authorized pilot users only</p></div><Switch defaultChecked /></div>
                      <Link href="/organization-setup"><Button className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45]">Edit Organization Settings <ChevronRight className="h-4 w-4 ml-2" /></Button></Link>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ── STAKEHOLDERS ── */}
              {activeSection === 'stakeholders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold text-[#0A0F2E]" style={CG}>Stakeholder Management</h2><p className="text-[#6B7280] mt-1">Configure who is notified for each prepared response activation</p></div><Link href="/stakeholder-management"><Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E]"><ExternalLink className="h-4 w-4 mr-2" />Full Management Page</Button></Link></div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[{ label: 'Total Stakeholders', value: String(stakeholders.length || 12), icon: Users, color: TEAL },
                      { label: 'Executive Level', value: String(stakeholders.filter((s: any) => s.role?.includes('C') || s.role?.includes('President')).length || 4), icon: Shield, color: NAVY },
                      { label: 'Avg Response Rate', value: '94%', icon: Activity, color: GOLD }
                    ].map(m => (
                      <Card key={m.label} className="border-[#E8E4DC] bg-white">
                        <CardContent className="p-5">
                          <div className="p-2.5 w-fit mb-3" style={{ background: `${m.color}12` }}><m.icon className="h-5 w-5" style={{ color: m.color }} /></div>
                          <p className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{m.value}</p>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mt-1">{m.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="border-[#E8E4DC] bg-white">
                    <CardHeader className="border-b border-[#E8E4DC] flex flex-row items-center justify-between">
                      <CardTitle className="text-lg text-[#0A0F2E]" style={CG}>Stakeholder Roster</CardTitle>
                      <Link href="/stakeholder-management"><Button size="sm" className="bg-[#0A0F2E] text-white">Manage Stakeholders</Button></Link>
                    </CardHeader>
                    <CardContent className="p-0">
                      {(stakeholders.length > 0 ? stakeholders.slice(0, 6) : [
                        { firstName: 'James', lastName: 'Richardson', role: 'CEO', department: 'Executive', notificationLevel: 'all' },
                        { firstName: 'Sarah', lastName: 'Chen', role: 'CFO', department: 'Finance', notificationLevel: 'critical' },
                        { firstName: 'Marcus', lastName: 'Williams', role: 'COO', department: 'Operations', notificationLevel: 'all' },
                        { firstName: 'Priya', lastName: 'Sharma', role: 'CTO', department: 'Technology', notificationLevel: 'high' },
                      ]).map((s: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-[#E8E4DC] last:border-0 hover:bg-[#F8F7F4] transition-colors">
                          <div className="w-9 h-9 flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: NAVY }}>{s.firstName?.[0]}{s.lastName?.[0]}</div>
                          <div className="flex-1"><p className="font-semibold text-[#0A0F2E] text-sm">{s.firstName} {s.lastName}</p><p className="text-xs text-[#6B7280]">{s.role} · {s.department}</p></div>
                          <Badge className="text-[10px] font-bold capitalize" style={{ background: `${TEAL}15`, color: TEAL, border: 'none' }}>{s.notificationLevel || 'active'}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ── SUCCESS METRICS ── */}
              {activeSection === 'metrics' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold text-[#0A0F2E]" style={CG}>Success Metrics</h2><p className="text-[#6B7280] mt-1">Define how you measure execution success</p></div><Link href="/success-metrics"><Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E]"><ExternalLink className="h-4 w-4 mr-2" />Full Config Page</Button></Link></div>

                  <Card className="border-[#E8E4DC] bg-white">
                    <CardHeader className="border-b border-[#E8E4DC]"><CardTitle className="text-lg text-[#0A0F2E]" style={CG}>Active Metrics</CardTitle></CardHeader>
                    <CardContent className="p-0">
                      {(metrics.length > 0 ? metrics.slice(0, 5) : [
                        { name: 'Time to Activation', target: '12 minutes', current: '11.4 minutes', unit: 'min', status: 'good' },
                        { name: 'Stakeholder Response Rate', target: '90%', current: '94%', unit: '%', status: 'good' },
                        { name: 'Task Completion Rate', target: '85%', current: '78%', unit: '%', status: 'warn' },
                        { name: 'Decision Confidence Score', target: '80%', current: '82%', unit: '%', status: 'good' },
                        { name: 'Prepared response Coverage', target: '95%', current: '89%', unit: '%', status: 'warn' },
                      ]).map((m: any, i: number) => {
                        const isGood = m.status === 'good';
                        return (
                          <div key={i} className="flex items-center gap-4 p-4 border-b border-[#E8E4DC] last:border-0 hover:bg-[#F8F7F4] transition-colors">
                            <div className="flex-1"><p className="font-semibold text-[#0A0F2E] text-sm">{m.name}</p><p className="text-xs text-[#6B7280] mt-0.5">Target: {m.target}</p></div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-sm" style={{ color: isGood ? TEAL : GOLD }}>{m.current}</span>
                              {isGood ? <CheckCircle className="h-4 w-4 text-[#2B8A6E]" /> : <Clock className="h-4 w-4 text-[#C9A84C]" />}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                  <Link href="/success-metrics"><Button className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45]">Configure Success Metrics <ChevronRight className="h-4 w-4 ml-2" /></Button></Link>
                </div>
              )}

              {/* ── ROLES ── */}
              {activeSection === 'roles' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold text-[#0A0F2E]" style={CG}>Roles & Permissions</h2><p className="text-[#6B7280] mt-1">Control access levels for prepared response activation and trigger management</p></div></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { role: 'Executive', desc: 'Full authorization — can activate all prepared responses', permissions: ['Activate prepared responses', 'Approve escalations', 'View all data', 'Modify triggers'], color: GOLD },
                      { role: 'Strategist', desc: 'Can configure prepared responses and view intelligence', permissions: ['View all data', 'Configure triggers', 'Prepare prepared responses', 'Draft briefs'], color: TEAL },
                      { role: 'Operator', desc: 'Execute assigned tasks within active prepared responses', permissions: ['View assigned tasks', 'Update task status', 'Receive notifications'], color: NAVY },
                      { role: 'Observer', desc: 'Read-only access for board members and auditors', permissions: ['View dashboards', 'Access audit log', 'Export reports'], color: '#6B7280' },
                    ].map(r => (
                      <Card key={r.role} className="border-[#E8E4DC] bg-white">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3"><Badge className="font-bold uppercase tracking-wider" style={{ background: `${r.color}15`, color: r.color, border: 'none' }}>{r.role}</Badge></div>
                          <p className="text-sm text-[#6B7280] mb-4">{r.desc}</p>
                          <ul className="space-y-1.5">{r.permissions.map(p => <li key={p} className="flex items-center gap-2 text-sm text-[#0A0F2E]"><CheckCircle className="h-3.5 w-3.5 text-[#2B8A6E] flex-shrink-0" />{p}</li>)}</ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card className="bg-[#0A0F2E] border-[#C9A84C]/30"><CardContent className="p-5"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center gap-3"><Shield className="h-6 w-6 text-[#C9A84C]" /><div><h3 className="font-semibold text-white text-sm">Role availability signals</h3><p className="text-xs text-white/50">Set flags when key roles are unavailable for the 12-minute response window</p></div></div><Link href="/settings"><Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] text-sm">Manage Role Availability <ArrowRight className="h-4 w-4 ml-2" /></Button></Link></div></CardContent></Card>
                </div>
              )}

              {/* ── INTEGRATIONS ── */}
              {activeSection === 'integrations' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold text-[#0A0F2E]" style={CG}>Integrations</h2><p className="text-[#6B7280] mt-1">Connect your enterprise systems to Readiness OS</p></div><Link href="/integration-hub"><Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E]"><ExternalLink className="h-4 w-4 mr-2" />Integration Hub</Button></Link></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Salesforce CRM', category: 'CRM', status: 'connected', icon: Database, color: '#1DB954' },
                      { name: 'Microsoft Teams', category: 'Communications', status: 'connected', icon: Globe, color: '#6264A7' },
                      { name: 'Jira', category: 'Project Management', status: 'connected', icon: Zap, color: '#0052CC' },
                      { name: 'Slack', category: 'Communications', status: 'pending', icon: Bell, color: '#4A154B' },
                      { name: 'Workday HCM', category: 'HR Systems', status: 'available', icon: Users, color: TEAL },
                      { name: 'ServiceNow', category: 'ITSM', status: 'available', icon: Key, color: GOLD },
                    ].map(integ => (
                      <Card key={integ.name} className="border-[#E8E4DC] bg-white ">
                        <CardContent className="p-5 flex items-center gap-4">
                          <div className="p-3 flex-shrink-0" style={{ background: `${integ.color}15` }}><integ.icon className="h-5 w-5" style={{ color: integ.color }} /></div>
                          <div className="flex-1 min-w-0"><p className="font-semibold text-[#0A0F2E] text-sm">{integ.name}</p><p className="text-xs text-[#6B7280] mt-0.5">{integ.category}</p></div>
                          <Badge className="capitalize text-[10px] font-bold" style={{
                            background: integ.status === 'connected' ? `${TEAL}15` : integ.status === 'pending' ? `${GOLD}15` : '#E8E4DC',
                            color: integ.status === 'connected' ? TEAL : integ.status === 'pending' ? GOLD : '#6B7280',
                            border: 'none'
                          }}>{integ.status}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Link href="/integration-hub"><Button className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45]">Manage All Integrations <ChevronRight className="h-4 w-4 ml-2" /></Button></Link>
                </div>
              )}

              {/* ── NOTIFICATIONS ── */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-bold text-[#0A0F2E]" style={CG}>Notification Preferences</h2><p className="text-[#6B7280] mt-1">Control when and how you receive alerts</p></div>

                  <Card className="border-[#E8E4DC] bg-white">
                    <CardHeader className="border-b border-[#E8E4DC]"><CardTitle className="text-base text-[#0A0F2E]" style={CG}>Alert Channels</CardTitle></CardHeader>
                    <CardContent className="p-6 space-y-5">
                      {[
                        { label: 'Email Notifications', desc: 'Receive alerts for high-priority triggers', icon: Bell, enabled: true },
                        { label: 'Slack Integration', desc: 'Post activation alerts to your Slack channel', icon: Globe, enabled: true },
                        { label: 'SMS Alerts', desc: 'Critical-only notifications via SMS', icon: Bell, enabled: false },
                        { label: 'In-App Notifications', desc: 'Real-time alerts within the platform', icon: Eye, enabled: true },
                      ].map(n => (
                        <div key={n.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-3"><n.icon className="h-5 w-5 text-[#6B7280]" /><div><p className="font-medium text-[#0A0F2E] text-sm">{n.label}</p><p className="text-xs text-[#6B7280]">{n.desc}</p></div></div>
                          <Switch defaultChecked={n.enabled} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-[#E8E4DC] bg-white">
                    <CardHeader className="border-b border-[#E8E4DC]"><CardTitle className="text-base text-[#0A0F2E]" style={CG}>Alert Severity Thresholds</CardTitle></CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {[
                        { level: 'Critical', desc: 'Immediate — fires immediately, always', color: '#dc2626' },
                        { level: 'High', desc: 'Fires within 5 minutes during business hours', color: GOLD },
                        { level: 'Medium', desc: 'Batched every 30 minutes', color: TEAL },
                        { level: 'Low', desc: 'Daily digest only', color: '#6B7280' },
                      ].map(t => (
                        <div key={t.level} className="flex items-center justify-between p-3" style={{ background: `${t.color}08` }}>
                          <div className="flex items-center gap-3"><div className="w-2.5 h-2.5" style={{ background: t.color }} /><div><p className="font-semibold text-[#0A0F2E] text-sm">{t.level}</p><p className="text-xs text-[#6B7280]">{t.desc}</p></div></div>
                          <Switch defaultChecked={t.level !== 'Low'} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Button className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45]">Save Notification Preferences <CheckCircle className="h-4 w-4 ml-2" /></Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
