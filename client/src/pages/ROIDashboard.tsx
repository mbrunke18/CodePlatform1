import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, DollarSign, Clock, Target, Zap, ChevronRight, Download, BarChart3, Activity } from 'lucide-react';
import { format } from 'date-fns';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function Gauge({ value, max = 100, color, label, sublabel }: { value: number; max?: number; color: string; label: string; sublabel?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct / 100;
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d={`M 10,70 A 60,60 0 0,1 130,70`} fill="none" stroke="#E8E4DC" strokeWidth="10" strokeLinecap="round" />
        <path d={`M 10,70 A 60,60 0 0,1 130,70`} fill="none" stroke={color}
          strokeWidth="10" strokeLinecap="round" strokeDasharray={`${dash * 1.57} 999`} />
        <text x="70" y="65" textAnchor="middle" fill={color} fontSize="22" fontWeight="800">{value}</text>
      </svg>
      <p className="text-[11px] font-bold text-center" style={{ color: NAVY }}>{label}</p>
      {sublabel && <p className="text-[9px] text-gray-400 text-center">{sublabel}</p>}
    </div>
  );
}

function Bar({ label, value, max, color, suffix = 'min' }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-gray-600">{label}</span>
        <span className="text-[11px] font-black" style={{ color }}>{value.toLocaleString()} {suffix}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function ROIDashboard({ embedded }: { embedded?: boolean }) {
  const [view, setView] = useState<'summary' | 'board'>('summary');

  const { data: summaryRaw, isLoading: sumLoading } = useQuery<any>({
    queryKey: ['/api/roi/summary'],
  });
  const { data: boardRaw, isLoading: boardLoading } = useQuery<any>({
    queryKey: ['/api/roi/board-report'],
    enabled: view === 'board',
  });
  const summary = summaryRaw && typeof summaryRaw === 'object' && !summaryRaw.error ? summaryRaw : null;
  const board = boardRaw && typeof boardRaw === 'object' && !boardRaw.error ? boardRaw : null;

  const isLoading = sumLoading || (view === 'board' && boardLoading);

  const s = summary || {};
  const valueM = s.estimatedValuePreservedMillions ?? 0;
  const responseMin = s.avgResponseMinutes ?? 0;
  const benchMin = s.industryBenchmarkMinutes ?? 43200;
  const saved = s.minutesSavedPerEvent ?? 0;
  const targetRate = s.targetMetRate ?? 0;
  const improvement = s.avgResponseVsBenchmark ?? 0;

  return (
    <PageLayout embedded={embedded}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-[#E8E4DC] px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div style={{ width: 48, height: 48, background: TEAL, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: GOLD }}>ADVANCE</span>
                  <ChevronRight className="w-3 h-3" style={{ color: GOLD }} />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: TEAL }}>Value Intelligence</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 700, fontSize: '1.8rem', color: NAVY, lineHeight: 1 }}>Execution ROI Dashboard</h1>
                <p className="text-xs text-gray-400 mt-0.5">Quantified value of faster strategic response</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {['summary', 'board'].map(v => (
                <button key={v} onClick={() => setView(v as any)}
                  className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 transition-colors"
                  style={{ background: view === v ? NAVY : 'transparent', color: view === v ? '#fff' : '#6B7280', border: `1px solid ${view === v ? NAVY : '#E8E4DC'}` }}>
                  {v === 'summary' ? 'Summary' : 'Board Report'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: GOLD }} />
          </div>
        ) : view === 'summary' ? (
          <div className="max-w-6xl mx-auto px-8 py-10">

            {/* Hero metric */}
            <div className="text-center mb-12 py-12 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a2456 100%)` }}>
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-2">Estimated Value Preserved This Period</p>
              <div className="flex items-end justify-center gap-2 mb-2">
                <span style={{ ...CG, fontSize: '5rem', fontWeight: 700, color: GOLD, lineHeight: 1 }}>
                  ${valueM > 0 ? valueM : '—'}
                </span>
                {valueM > 0 && <span className="text-2xl font-bold text-white/60 mb-3">M</span>}
              </div>
              <p className="text-white/60 text-sm max-w-lg mx-auto">
                Based on {s.completedCount ?? 0} completed activations. Calculated against the industry-average 30-day strategic mobilization cycle at Fortune 1000 revenue rates.
              </p>
              {valueM === 0 && (
                <p className="text-white/40 text-xs mt-2">Complete activations to generate ROI data</p>
              )}
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Activations', value: s.activationCount ?? 0, color: NAVY, icon: Zap, suffix: '' },
                { label: 'Avg Response', value: responseMin, color: TEAL, icon: Clock, suffix: ' min' },
                { label: '12-Min Target Rate', value: `${targetRate}%`, color: GOLD, icon: Target, suffix: '' },
                { label: 'Execution Head Start', value: `${improvement}%`, color: '#2B8A6E', icon: TrendingUp, suffix: '' },
              ].map(k => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="p-5 border border-[#E8E4DC]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${k.color}15` }}>
                        <Icon className="w-4 h-4" style={{ color: k.color }} />
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{k.label}</p>
                    </div>
                    <p className="text-2xl font-black" style={{ color: k.color }}>{k.value}{k.suffix}</p>
                  </div>
                );
              })}
            </div>

            {/* Response time comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="p-6 border border-[#E8E4DC]">
                <h3 className="text-sm font-bold mb-4" style={{ color: NAVY }}>Response Time Comparison</h3>
                <Bar label="Industry Average (30-day mobilization)" value={benchMin} max={benchMin} color="#EF4444" suffix="min" />
                <Bar label="Execution OS Average" value={responseMin || 12} max={benchMin} color={TEAL} suffix="min" />
                <div className="mt-4 px-4 py-3 border-l-2" style={{ borderColor: GOLD, background: 'rgba(201,168,76,0.06)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>Time Saved Per Event</p>
                  <p className="text-xl font-black" style={{ color: NAVY }}>{(saved / 60).toFixed(1)} hours</p>
                </div>
              </div>

              <div className="p-6 border border-[#E8E4DC]">
                <h3 className="text-sm font-bold mb-4" style={{ color: NAVY }}>Value Methodology</h3>
                <div className="space-y-3 text-xs text-gray-600">
                  {[
                    { label: 'Industry mobilization baseline', val: '30 days (43,200 min)' },
                    { label: 'Revenue rate assumption', val: '~$5M/day Fortune 1000' },
                    { label: 'Per-minute value', val: '$3,472/min' },
                    { label: 'Formula', val: 'Time Saved × Rate × Events' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between py-2 border-b border-[#F0EDE8]">
                      <span className="text-gray-500">{r.label}</span>
                      <span className="font-bold" style={{ color: NAVY }}>{r.val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-gray-400 mt-3">Estimates based on McKinsey Fortune 1000 crisis impact research. Actual results vary.</p>
              </div>
            </div>

            {/* Board-ready callout */}
            <div className="p-6 border-2" style={{ borderColor: GOLD, background: 'rgba(201,168,76,0.03)' }}>
              <div className="flex items-start gap-4">
                <BarChart3 className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: GOLD }} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: GOLD }}>Board Summary</p>
                  <p style={{ ...CG, fontSize: '1.2rem', fontWeight: 600, color: NAVY }}>
                    Execution OS {improvement > 0 ? `accelerated strategic response by ${improvement}%` : 'is monitoring your strategic landscape'} —
                    preserving an estimated <span style={{ color: GOLD }}>${valueM > 0 ? valueM + 'M' : '—'}</span> in potential revenue leakage
                    across {s.activationCount ?? 0} activation{s.activationCount !== 1 ? 's' : ''} this period.
                  </p>
                  <button onClick={() => setView('board')} className="mt-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: TEAL }}>
                    View Full Board Report <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Board Report view */
          <div className="max-w-4xl mx-auto px-8 py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: GOLD }}>Board Presentation</p>
                <h2 style={{ ...CG, fontSize: '1.6rem', fontWeight: 700, color: NAVY }}>Strategic Execution Report</h2>
                <p className="text-xs text-gray-400">{format(new Date(), 'MMMM yyyy')}</p>
              </div>
              <Button onClick={() => window.print()}
                style={{ background: NAVY, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            </div>

            {/* Board summary block */}
            <div className="p-8 mb-8" style={{ background: NAVY }}>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50 mb-4">Executive Headline</p>
              <p style={{ ...CG, fontSize: '1.5rem', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
                "Execution OS prevented an estimated{' '}
                <span style={{ color: GOLD }}>${valueM > 0 ? valueM + 'M' : '—'}</span>{' '}
                in potential revenue leakage this quarter by accelerating strategic response times by{' '}
                <span style={{ color: GOLD }}>{improvement}%</span> versus industry benchmarks."
              </p>
            </div>

            {/* Event timeline */}
            <h3 className="text-sm font-bold mb-4" style={{ color: NAVY }}>Activation History</h3>
            {board?.events?.length > 0 ? (
              <div className="space-y-3">
                {board.events.map((ev: any, i: number) => (
                  <div key={ev.id} className="flex items-start gap-4 p-4 border border-[#E8E4DC]">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 text-[11px] font-black text-white"
                      style={{ background: ev.targetMet ? TEAL : GOLD }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-400">{ev.activatedAt ? format(new Date(ev.activatedAt), 'MMM d, yyyy') : '—'}</span>
                        <Badge style={{ background: ev.targetMet ? 'rgba(43,138,110,0.1)' : 'rgba(201,168,76,0.1)', color: ev.targetMet ? TEAL : GOLD, fontSize: 8 }}>
                          {ev.targetMet ? '12-MIN TARGET MET' : 'EXTENDED RESPONSE'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-xs">
                        <span><span className="font-bold" style={{ color: NAVY }}>{ev.actualMinutes ?? '—'} min</span> <span className="text-gray-400">response</span></span>
                        <span><span className="font-bold" style={{ color: TEAL }}>{(ev.minutesSaved / 60).toFixed(1)}h</span> <span className="text-gray-400">saved</span></span>
                        <span><span className="font-bold" style={{ color: GOLD }}>${ev.estimatedValueM}M</span> <span className="text-gray-400">preserved</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Activity className="w-8 h-8 mx-auto mb-3" />
                <p className="text-sm">Complete playbook activations to generate board report data</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
