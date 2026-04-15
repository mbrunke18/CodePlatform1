import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Shield, TrendingUp, Loader2, ChevronRight, History, Zap, AlertTriangle, CheckCircle, Target, BookOpen, Clock } from 'lucide-react';
import { format } from 'date-fns';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const SCENARIO_EXAMPLES = [
  '20% tariff increase on all imported goods from Asia',
  'Top competitor announces merger with our second-largest rival',
  'Ransomware attack disables 40% of our manufacturing systems for 72 hours',
  'Key regulator signals new EU data compliance deadline in 90 days',
  'CFO and two board members resign simultaneously amid investor pressure',
];

const DOMAIN_ICONS: Record<string, string> = {
  financial: '💰', market: '📈', operational: '⚙️', technology: '💻',
  regulatory: '📋', talent: '👥', competitive: '⚔️', esg: '🌿', cyber: '🛡️', brand: '📣',
};

export default function SimulationStudio({ embedded }: { embedded?: boolean }) {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const { data: historyRaw } = useQuery<any[]>({ queryKey: ['/api/simulation-analyses'] });
  const history = Array.isArray(historyRaw) ? historyRaw : [];

  const analyzeMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/simulation/analyze', { scenarioText: scenario }),
    onSuccess: (data: any) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/simulation-analyses'] });
      toast({ title: 'Coverage brief ready', description: 'System analysis complete — pre-staged playbooks mapped.' });
    },
    onError: (error: any) => {
      if (error?.message?.startsWith('401')) {
        toast({ title: 'Access required', description: 'Requesting access to run simulations.', variant: 'destructive' });
        setTimeout(() => { window.location.href = '/request-access'; }, 1500);
      } else {
        toast({ title: 'Simulation failed', description: 'An error occurred. Please try again.', variant: 'destructive' });
      }
    },
  });

  const canRun = scenario.trim().length >= 10 && !analyzeMutation.isPending;


  return (
    <PageLayout embedded={embedded}>
      <div className="min-h-screen bg-[#F8F7F4]">
        {/* ─── Dark Hero ─────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: '36px 0 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Execute Phase · Pre-Deployment Dry-Run</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: '#F0EDE4', marginBottom: 8, lineHeight: 1.1 }}>
                  Shadow Strategy <em style={{ color: GOLD }}>Simulator</em>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.55)', maxWidth: 560, lineHeight: 1.6 }}>
                  Validate your response before committing resources. The system maps your coverage readiness across every relevant playbook — giving the board a pre-approved confidence benchmark before a single dollar moves.
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Executive Use', desc: 'Test scenarios before authorization' },
                    { label: 'Board Governance', desc: 'Coverage analysis as board confidence instrument' },
                    { label: 'Audit Trail', desc: 'Every simulation logged — full decision record' },
                  ].map(({ label, desc }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 5, height: 5, borderRadius: 0, background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: 'rgba(240,237,228,0.45)' }}>
                        <span style={{ fontWeight: 700, color: 'rgba(240,237,228,0.75)' }}>{label}</span> — {desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.12)', color: '#3BAF8A', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '5px 14px', border: '1px solid rgba(43,138,110,0.3)' }}>
                  <span style={{ width: 6, height: 6, background: '#3BAF8A', borderRadius: 0, display: 'inline-block' }} />
                  Simulator Active
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Input + Results */}
            <div className="lg:col-span-2 space-y-8">

              {/* Scenario input */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider block mb-2" style={{ color: NAVY }}>
                  Describe the Scenario to Simulate
                </label>
                <Textarea
                  value={scenario}
                  onChange={e => setScenario(e.target.value)}
                  placeholder="e.g. '20% tariff increase on all imported goods' or 'Top competitor announces merger with our second-largest rival'..."
                  className="min-h-[120px] text-sm resize-none border-[#E8E4DC] focus:ring-0 focus:border-[#0A0F2E]"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {SCENARIO_EXAMPLES.map(s => (
                    <button key={s} onClick={() => setScenario(s)}
                      className="text-[9px] font-semibold px-2 py-1 border border-[#E8E4DC] hover:border-[#C9A84C] text-gray-500 transition-colors">
                      {s.slice(0, 35)}...
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => analyzeMutation.mutate()}
                disabled={!canRun}
                className="w-full py-4 text-sm font-bold uppercase tracking-widest"
                style={{ background: canRun ? NAVY : '#D1D5DB', color: '#fff' }}>
                {analyzeMutation.isPending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running Simulation...</>
                  : <><Zap className="w-4 h-4 mr-2" /> Run Shadow Simulation</>}
              </Button>

              {/* Results */}
              {result && (
                <div className="space-y-6">
                  <div className="px-4 py-3 border-l-4" style={{ borderColor: GOLD, background: `${GOLD}06` }}>
                    <p className="text-[9px] font-black uppercase tracking-wider mb-1" style={{ color: GOLD }}>Simulated Scenario</p>
                    <p className="text-sm font-semibold" style={{ color: NAVY }}>{result.scenarioText}</p>
                  </div>

                  <div style={{ padding: '12px 20px', background: `${GOLD}08`, borderTop: `1px solid ${GOLD}40`, borderBottom: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: GOLD }}>Coverage Brief</div>
                      <div style={{ width: 1, height: 12, background: `${GOLD}40` }} />
                      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF' }}>Pre-Staged · System-Analyzed</div>
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: TEAL }}>● Analysis Complete</div>
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider mb-2" style={{ color: '#9CA3AF', letterSpacing: '0.2em' }}>Situation Assessment</p>
                    <div className="p-5 border border-[#E8E4DC]" style={{ borderLeft: `4px solid ${GOLD}` }}>
                      <p className="text-[13px] text-gray-700 leading-relaxed">{result.aiAnalysis}</p>
                    </div>
                  </div>

                  {result.activatedDomains?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: NAVY }}>Domains Activated</p>
                      <div className="flex flex-wrap gap-2">
                        {result.activatedDomains.map((d: string) => (
                          <span key={d} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E4DC] text-[11px] font-bold" style={{ color: NAVY }}>
                            <span>{DOMAIN_ICONS[d] || '📌'}</span> {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.recommendedPlaybooks?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4" style={{ color: TEAL }} />
                        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: TEAL }}>Playbooks That Would Activate</p>
                      </div>
                      <div className="space-y-2">
                        {result.recommendedPlaybooks.map((pb: string) => (
                          <div key={pb} className="flex items-center gap-3 px-3 py-2 border border-[#E8E4DC]">
                            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />
                            <span className="text-[11px] font-semibold" style={{ color: NAVY }}>{pb}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.coverageGaps?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4" style={{ color: '#EF4444' }} />
                        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#EF4444' }}>Coverage Gaps Detected</p>
                      </div>
                      <div className="space-y-2">
                        {result.coverageGaps.map((gap: string) => (
                          <div key={gap} className="flex items-start gap-3 px-3 py-2" style={{ background: 'rgba(239,68,68,0.03)', borderLeft: '3px solid #EF4444' }}>
                            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5 text-red-400" />
                            <span className="text-[11px] text-gray-600">{gap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {result && (
                <div style={{ marginTop: 20, padding: '16px 20px', background: NAVY, borderTop: `3px solid ${GOLD}` }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                    Want these 170 playbooks armed and ready before the trigger fires?
                  </p>
                  <a
                    href="/request-access"
                    style={{
                      display: 'inline-block', background: GOLD, color: NAVY,
                      padding: '9px 22px', fontSize: 10, fontWeight: 800,
                      textTransform: 'uppercase' as const, letterSpacing: '0.15em',
                      textDecoration: 'none',
                    }}
                  >
                    Request Pilot Access →
                  </a>
                </div>
              )}
            </div>

            {/* Right: History + How it works */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4" style={{ color: GOLD }} />
                <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: NAVY }}>Simulation History</p>
              </div>

              {history.length === 0 ? (
                <div className="border border-dashed border-[#E8E4DC] p-6 text-center mb-6">
                  <Target className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                  <p className="text-[11px] text-gray-400">No simulations yet</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {(history as any[]).map((sim: any) => (
                    <button key={sim.id} onClick={() => setResult(sim)}
                      className="w-full text-left p-4 border border-[#E8E4DC] hover:bg-[#FAFAF9] transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>Simulation</span>
                        <span className="text-[9px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {sim.createdAt ? format(new Date(sim.createdAt), 'MMM d') : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-2">{sim.scenarioText}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="p-4 border border-[#E8E4DC]" style={{ background: `${NAVY}04` }}>
                <p className="text-[9px] font-black uppercase tracking-wider mb-3" style={{ color: NAVY }}>How Scoring Works</p>
                <div className="space-y-2 text-[10px] text-gray-500">
                  {[
                    { icon: Shield, label: 'Survive', desc: 'Playbook coverage for damage containment' },
                    { icon: TrendingUp, label: 'Thrive', desc: 'Offensive playbooks & competitive gaps' },
                    { icon: AlertTriangle, label: 'Gaps', desc: 'Scenarios your library doesn\'t cover' },
                  ].map(h => {
                    const Icon = h.icon;
                    return (
                      <div key={h.label} className="flex items-start gap-2">
                        <Icon className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                        <div><span className="font-bold" style={{ color: NAVY }}>{h.label}: </span>{h.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
