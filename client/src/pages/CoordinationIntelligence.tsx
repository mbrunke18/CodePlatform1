import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Activity, Clock, Target, TrendingDown, TrendingUp, Zap, Brain,
  FileText, CheckCircle2, AlertTriangle, ChevronRight, Trophy, BarChart3,
  Users, ArrowRight, Loader2
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const IVORY = '#F8F7F4';
const BORDER = '#E8E4DC';
const MUTED = '#6B7280';
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

const DEMO_ACTIVATIONS = [
  { id: 'd1', activatedAt: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(), activationReason: 'Competitor product launch detected', actualMinutes: 9, targetMet: true, successRating: 96 },
  { id: 'd2', activatedAt: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(), activationReason: 'Key executive departure — CHRO', actualMinutes: 11, targetMet: true, successRating: 91 },
  { id: 'd3', activatedAt: new Date(Date.now() - 9 * 24 * 3600_000).toISOString(), activationReason: 'Regulatory filing deadline — SEC', actualMinutes: 14, targetMet: false, successRating: 83 },
  { id: 'd4', activatedAt: new Date(Date.now() - 14 * 24 * 3600_000).toISOString(), activationReason: 'Supply chain disruption — Tier 1 supplier', actualMinutes: 10, targetMet: true, successRating: 94 },
  { id: 'd5', activatedAt: new Date(Date.now() - 18 * 24 * 3600_000).toISOString(), activationReason: 'M&A acquisition close — Day 1 execution', actualMinutes: 8, targetMet: true, successRating: 98 },
  { id: 'd6', activatedAt: new Date(Date.now() - 25 * 24 * 3600_000).toISOString(), activationReason: 'Cybersecurity incident — Tier 1 alert', actualMinutes: 12, targetMet: true, successRating: 89 },
  { id: 'd7', activatedAt: new Date(Date.now() - 31 * 24 * 3600_000).toISOString(), activationReason: 'Activist investor — board notice received', actualMinutes: 19, targetMet: false, successRating: 77 },
  { id: 'd8', activatedAt: new Date(Date.now() - 38 * 24 * 3600_000).toISOString(), activationReason: 'Key account threat — enterprise RFP loss', actualMinutes: 13, targetMet: false, successRating: 81 },
];

const DEMO_SUMMARY = {
  totalActivations: 8,
  avgMinutes: 12,
  fastestMinutes: 8,
  targetMinutes: 12,
  industryMinutes: 43200,
  targetMetRate: 63,
  speedMultiplier: 3600,
};

const BOTTLENECKS = [
  { category: 'Stakeholder Notification Delay', frequency: 38, impact: 'high', avgDelayMin: 2.1 },
  { category: 'Decision Authority Unclear', frequency: 25, impact: 'critical', avgDelayMin: 4.3 },
  { category: 'Document Access Latency', frequency: 19, impact: 'medium', avgDelayMin: 1.4 },
  { category: 'War Room Assembly Lag', frequency: 18, impact: 'medium', avgDelayMin: 1.8 },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SpeedBar({ minutes, target = 12, max = 60 }: { minutes: number; target?: number; max?: number }) {
  const pct = Math.min((minutes / max) * 100, 100);
  const targetPct = Math.min((target / max) * 100, 100);
  const over = minutes > target;
  return (
    <div className="relative h-2 w-full rounded-full" style={{ background: '#E8E4DC' }}>
      <div style={{ background: over ? '#EF4444' : TEAL, borderRadius: 4, height: '100%', width: `${pct}%`, transition: 'width 0.6s ease' }} />
      <div style={{ position: 'absolute', left: `${targetPct}%`, top: -3, width: 2, height: 16, background: GOLD, borderRadius: 1 }} title="12-min target" />
    </div>
  );
}

export default function CoordinationIntelligence() {
  const { toast } = useToast();
  const [selectedActivationId, setSelectedActivationId] = useState<string | null>(null);
  const [boardBrief, setBoardBrief] = useState<string | null>(null);

  const { data, isLoading } = useQuery<any>({
    queryKey: ['/api/coordination-intelligence'],
    retry: false,
  });

  const briefMutation = useMutation({
    mutationFn: (body: any) => apiRequest('POST', '/api/coordination-intelligence/board-brief', body),
    onSuccess: async (res: any) => {
      const json = await res.json();
      setBoardBrief(json.brief);
      toast({ title: 'Board Brief Generated', description: 'Executive summary is ready.' });
    },
    onError: () => toast({ title: 'Generation failed', description: 'Check AI service configuration.', variant: 'destructive' }),
  });

  const isEmpty = !isLoading && (!data || data.summary?.totalActivations === 0);
  const summary = isEmpty ? DEMO_SUMMARY : (data?.summary ?? DEMO_SUMMARY);
  const activations: any[] = isEmpty ? DEMO_ACTIVATIONS : (data?.activations ?? DEMO_ACTIVATIONS);
  const isDemo = isEmpty;

  const selectedActivation = activations.find(a => a.id === selectedActivationId);

  function handleGenerateBrief(activation: any) {
    setSelectedActivationId(activation.id);
    setBoardBrief(null);
    briefMutation.mutate({
      activationId: activation.id,
      playbookName: activation.activationReason || 'Strategic Response',
      situationSummary: activation.activationReason,
      actualMinutes: activation.actualMinutes,
      targetMet: activation.targetMet,
      stakeholderCount: 6,
      tasksCompleted: Math.round((activation.successRating / 100) * 12),
      totalTasks: 12,
    });
  }

  const maxBar = Math.max(...activations.map(a => a.actualMinutes || 12), 20);

  return (
    <PageLayout>
      <div style={{ background: IVORY, minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ background: NAVY, padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="container mx-auto px-6 relative z-10">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: GOLD }}>Coordination Intelligence</span>
            </div>
            <h1 style={{ ...CG, fontWeight: 700, fontSize: 'clamp(32px,5vw,52px)', color: '#fff', lineHeight: 1.1, marginBottom: 12 }}>
              How Fast Does Your Organization <em style={{ color: GOLD, fontStyle: 'italic' }}>Actually</em> Move?
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, maxWidth: 560, marginBottom: 32 }}>
              Every activation is timed. Every coordination gap is measured. This is where the 3,600× claim becomes your organization's real data.
            </p>
            {isDemo && (
              <Badge style={{ background: 'rgba(201,168,76,0.15)', color: GOLD, border: `1px solid rgba(201,168,76,0.3)`, fontSize: 10, letterSpacing: '0.2em', padding: '4px 12px' }}>
                DEMO DATA — Activate playbooks to see your organization's real coordination record
              </Badge>
            )}
          </div>
        </div>

        <div className="container mx-auto px-6 py-10 max-w-7xl">

          {/* Headline KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0, borderTop: `3px solid ${GOLD}` }}>
              <CardContent className="p-6">
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Avg Coordination Time</div>
                <div style={{ ...CG, fontSize: 48, fontWeight: 700, color: NAVY, lineHeight: 1 }}>
                  {summary.avgMinutes ?? '—'}<span style={{ fontSize: 20, fontWeight: 500, color: MUTED, marginLeft: 4 }}>min</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: TEAL, fontWeight: 600 }}>
                  {summary.avgMinutes && summary.avgMinutes <= 12 ? '✓ At or below 12-min target' : `${summary.avgMinutes ? summary.avgMinutes - 12 : '—'} min above target`}
                </div>
              </CardContent>
            </Card>

            <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0, borderTop: `3px solid ${TEAL}` }}>
              <CardContent className="p-6">
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Target Met Rate</div>
                <div style={{ ...CG, fontSize: 48, fontWeight: 700, color: NAVY, lineHeight: 1 }}>
                  {summary.targetMetRate ?? '—'}<span style={{ fontSize: 20, fontWeight: 500, color: MUTED, marginLeft: 2 }}>%</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Progress value={summary.targetMetRate ?? 0} className="h-1.5" style={{ background: BORDER }} />
                </div>
              </CardContent>
            </Card>

            <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0, borderTop: `3px solid ${NAVY}` }}>
              <CardContent className="p-6">
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Fastest Activation</div>
                <div style={{ ...CG, fontSize: 48, fontWeight: 700, color: NAVY, lineHeight: 1 }}>
                  {summary.fastestMinutes ?? '—'}<span style={{ fontSize: 20, fontWeight: 500, color: MUTED, marginLeft: 4 }}>min</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: MUTED, fontWeight: 600 }}>
                  {summary.totalActivations} total activations tracked
                </div>
              </CardContent>
            </Card>

            <Card style={{ border: `2px solid ${GOLD}`, borderRadius: 0, background: NAVY }}>
              <CardContent className="p-6">
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Your Speed vs. Industry</div>
                <div style={{ ...CG, fontSize: 48, fontWeight: 700, color: GOLD, lineHeight: 1 }}>
                  {summary.speedMultiplier ? `${summary.speedMultiplier.toLocaleString()}×` : '3,600×'}
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
                  30 days compressed to {summary.avgMinutes ?? 12} minutes
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benchmark Comparison */}
          <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0, marginBottom: 32 }}>
            <CardHeader style={{ borderBottom: `1px solid ${BORDER}`, padding: '20px 24px' }}>
              <CardTitle style={{ ...CG, fontSize: 20, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart3 className="w-5 h-5" style={{ color: GOLD }} />
                Coordination Benchmark Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Industry Baseline', subLabel: '30-day alignment cycle', value: '43,200 min', pct: 100, color: '#EF4444', note: 'Committee deliberation + alignment cycles' },
                  { label: 'Your Organization', subLabel: 'Average coordination time', value: `${summary.avgMinutes ?? 12} min`, pct: ((summary.avgMinutes ?? 12) / 43200) * 100, color: NAVY, note: `${summary.targetMetRate ?? 63}% of activations at or below 12-min target` },
                  { label: 'Command OS Target', subLabel: '12-minute execution benchmark', value: '12 min', pct: (12 / 43200) * 100, color: TEAL, note: 'Pre-staged coordination — ready before trigger fires' },
                ].map((row) => (
                  <div key={row.label} style={{ padding: '20px 24px', border: `1px solid ${BORDER}`, background: row.color === NAVY ? '#F0EDE4' : '#fff' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: MUTED, marginBottom: 4 }}>{row.label}</div>
                    <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: row.color, marginBottom: 4 }}>{row.value}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>{row.note}</div>
                    <div style={{ height: 6, background: BORDER, borderRadius: 3 }}>
                      <div style={{ height: '100%', background: row.color, borderRadius: 3, width: `${Math.max(row.pct, 0.2)}%`, minWidth: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

            {/* Activation History */}
            <div className="lg:col-span-2">
              <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0 }}>
                <CardHeader style={{ borderBottom: `1px solid ${BORDER}`, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <CardTitle style={{ ...CG, fontSize: 20, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Activity className="w-5 h-5" style={{ color: GOLD }} />
                      Activation History
                    </CardTitle>
                    <Link href="/live-activation">
                      <Button size="sm" variant="outline" style={{ borderColor: BORDER, color: NAVY, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em' }}>
                        New Activation <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {activations.slice(0, 8).map((a, i) => (
                    <div
                      key={a.id}
                      style={{
                        padding: '16px 24px',
                        borderBottom: i < activations.length - 1 ? `1px solid ${BORDER}` : 'none',
                        background: selectedActivationId === a.id ? '#F0EDE4' : '#fff',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onClick={() => setSelectedActivationId(selectedActivationId === a.id ? null : a.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 2 }}>
                            {a.activationReason || 'Strategic trigger activation'}
                          </div>
                          <div style={{ fontSize: 11, color: MUTED }}>{formatDate(a.activatedAt)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: a.targetMet ? TEAL : '#EF4444', fontFamily: 'monospace' }}>
                              {a.actualMinutes ?? '—'} min
                            </div>
                          </div>
                          {a.targetMet
                            ? <CheckCircle2 className="w-4 h-4" style={{ color: TEAL, flexShrink: 0 }} />
                            : <AlertTriangle className="w-4 h-4" style={{ color: '#EF4444', flexShrink: 0 }} />
                          }
                        </div>
                      </div>
                      <SpeedBar minutes={a.actualMinutes ?? 12} max={maxBar + 4} />

                      {selectedActivationId === a.id && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {a.successRating && (
                              <Badge style={{ background: 'rgba(43,138,110,0.1)', color: TEAL, border: `1px solid rgba(43,138,110,0.2)`, fontSize: 11 }}>
                                {a.successRating}% success rating
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleGenerateBrief(a); }}
                              disabled={briefMutation.isPending && selectedActivationId === a.id}
                              style={{ background: NAVY, color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', height: 32 }}
                            >
                              {briefMutation.isPending && selectedActivationId === a.id
                                ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Generating…</>
                                : <><Brain className="w-3.5 h-3.5 mr-1.5" />Generate Board Brief</>
                              }
                            </Button>
                          </div>
                          {selectedActivationId === a.id && boardBrief && (
                            <div style={{ marginTop: 12, padding: '14px 16px', background: '#fff', border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}` }}>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>AI Board Brief</div>
                              <p style={{ fontSize: 13, color: NAVY, lineHeight: 1.65 }}>{boardBrief}</p>
                              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                                <Link href="/board-briefings">
                                  <Button size="sm" variant="outline" style={{ borderColor: BORDER, color: NAVY, fontSize: 11, fontWeight: 600 }}>
                                    <FileText className="w-3.5 h-3.5 mr-1.5" />View Board Briefings
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Bottleneck Intelligence + Actions */}
            <div className="space-y-6">

              {/* Bottleneck Panel */}
              <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0 }}>
                <CardHeader style={{ borderBottom: `1px solid ${BORDER}`, padding: '20px 24px' }}>
                  <CardTitle style={{ ...CG, fontSize: 18, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle className="w-4 h-4" style={{ color: '#EF4444' }} />
                    Coordination Bottlenecks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {BOTTLENECKS.map((b, i) => (
                    <div key={b.category} style={{ padding: '14px 20px', borderBottom: i < BOTTLENECKS.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, flex: 1, paddingRight: 8 }}>{b.category}</div>
                        <Badge style={{
                          background: b.impact === 'critical' ? 'rgba(239,68,68,0.08)' : b.impact === 'high' ? 'rgba(201,168,76,0.1)' : 'rgba(43,138,110,0.08)',
                          color: b.impact === 'critical' ? '#EF4444' : b.impact === 'high' ? GOLD : TEAL,
                          border: 'none', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em'
                        }}>
                          {b.impact}
                        </Badge>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: BORDER, borderRadius: 2 }}>
                          <div style={{ height: '100%', background: b.impact === 'critical' ? '#EF4444' : b.impact === 'high' ? GOLD : TEAL, borderRadius: 2, width: `${b.frequency}%` }} />
                        </div>
                        <span style={{ fontSize: 11, color: MUTED, fontWeight: 600, whiteSpace: 'nowrap' }}>+{b.avgDelayMin}m avg</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0, background: NAVY }}>
                <CardContent className="p-6">
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>Coordination Actions</div>
                  <div className="space-y-3">
                    {[
                      { label: 'Run Practice Drill', path: '/practice-drills', icon: Zap },
                      { label: 'Open Live Activation', path: '/live-activation', icon: Activity },
                      { label: 'View Board Briefings', path: '/board-briefings', icon: FileText },
                      { label: 'Playbook Library', path: '/playbook-library', icon: BarChart3 },
                    ].map(({ label, path, icon: Icon }) => (
                      <Link key={path} href={path}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon className="w-4 h-4" style={{ color: GOLD }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Speed Proof */}
              <Card style={{ border: `2px solid ${GOLD}`, borderRadius: 0 }}>
                <CardContent className="p-6">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Trophy className="w-4 h-4" style={{ color: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD }}>The 3,600× Head Start</span>
                  </div>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.65 }}>
                    When a strategic trigger fires, competitors spend <strong style={{ color: NAVY }}>30 days</strong> figuring out who needs to be in the room. Your organization is already executing at <strong style={{ color: NAVY }}>minute 12</strong>. That is not a speed advantage. That is a structural head start.
                  </p>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, fontFamily: 'monospace' }}>{summary.avgMinutes ?? 12}<span style={{ fontSize: 11, color: MUTED }}>m</span></div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED }}>Your Org</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#EF4444', fontFamily: 'monospace' }}>30d</div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED }}>Industry</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: GOLD, fontFamily: 'monospace' }}>{summary.speedMultiplier ? `${summary.speedMultiplier.toLocaleString()}×` : '3,600×'}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED }}>Head Start</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Trend Chart */}
          <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0, marginBottom: 32 }}>
            <CardHeader style={{ borderBottom: `1px solid ${BORDER}`, padding: '20px 24px' }}>
              <CardTitle style={{ ...CG, fontSize: 20, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingDown className="w-5 h-5" style={{ color: TEAL }} />
                Coordination Speed — Trend Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                {[...activations].reverse().map((a, i) => {
                  const mins = a.actualMinutes ?? 12;
                  const heightPct = Math.min((mins / (maxBar + 4)) * 100, 100);
                  return (
                    <div key={a.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: a.targetMet ? TEAL : '#EF4444' }}>{mins}m</div>
                      <div style={{ width: '100%', background: a.targetMet ? TEAL : '#EF4444', height: `${heightPct}%`, borderRadius: '2px 2px 0 0', transition: 'height 0.5s ease', opacity: 0.85 }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: MUTED }}>Earliest</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: TEAL }} />
                    <span style={{ fontSize: 11, color: MUTED }}>Target Met (≤12 min)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: '#EF4444' }} />
                    <span style={{ fontSize: 11, color: MUTED }}>Target Missed</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: MUTED }}>Most Recent</span>
              </div>
            </CardContent>
          </Card>

          {/* What This Means */}
          <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0, background: NAVY }}>
            <CardContent className="p-8">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 24, height: 2, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: GOLD }}>What This Data Proves</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Target, label: 'Pre-staged coordination replaces real-time alignment', desc: 'Your organization knows exactly who owns what before the trigger fires. No committee. No discovery. Execution begins in minutes.' },
                  { icon: Users, label: 'Human judgment is preserved — coordination overhead is eliminated', desc: 'The AI coordinates around your executives. The right people get the right information at the right time. Decisions happen faster because preparation happened earlier.' },
                  { icon: TrendingUp, label: 'Every activation improves the playbook', desc: 'Coordination times, bottlenecks, and outcomes are captured after every event. The platform learns. Your organization gets faster.' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Icon className="w-4 h-4" style={{ color: GOLD }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{label}</div>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageLayout>
  );
}
