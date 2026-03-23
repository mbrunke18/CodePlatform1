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

function ScoreGauge({ score, label, color, description }: { score: number; label: string; color: string; description: string }) {
  const r = 70;
  const circ = Math.PI * r;
  const dashVal = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center p-6 border border-[#E8E4DC] flex-1">
      <svg width="180" height="100" viewBox="0 0 180 100" className="mb-2">
        <path d="M 20,90 A 70,70 0 0,1 160,90" fill="none" stroke="#E8E4DC" strokeWidth="12" strokeLinecap="round" />
        <path d="M 20,90 A 70,70 0 0,1 160,90" fill="none" stroke={color}
          strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${dashVal} 999`} />
        <text x="90" y="78" textAnchor="middle" fill={color} fontSize="30" fontWeight="900">{score}</text>
        <text x="90" y="94" textAnchor="middle" fill="#9CA3AF" fontSize="10">/100</text>
      </svg>
      <p className="text-[13px] font-bold text-center" style={{ color: NAVY }}>{label}</p>
      <p className="text-[10px] text-gray-400 text-center mt-1 max-w-[140px]">{description}</p>
    </div>
  );
}

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
      toast({ title: 'Simulation complete', description: `Survive: ${data.surviveScore} · Thrive: ${data.thriveScore}` });
    },
    onError: (error: any) => {
      if (error?.message?.startsWith('401')) {
        toast({ title: 'Sign in required', description: 'Please sign in to run simulations.', variant: 'destructive' });
        setTimeout(() => { window.location.href = '/api/login'; }, 1500);
      } else {
        toast({ title: 'Simulation failed', description: 'An error occurred. Please try again.', variant: 'destructive' });
      }
    },
  });

  const canRun = scenario.trim().length >= 10 && !analyzeMutation.isPending;

  const surviveColor = (result?.surviveScore ?? 0) >= 70 ? TEAL : (result?.surviveScore ?? 0) >= 45 ? GOLD : '#EF4444';
  const thriveColor = (result?.thriveScore ?? 0) >= 60 ? TEAL : (result?.thriveScore ?? 0) >= 35 ? GOLD : '#EF4444';

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
                  Validate your response before committing resources — AI scores your Survive and Thrive probability across every relevant playbook.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.12)', color: '#3BAF8A', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '5px 14px', border: '1px solid rgba(43,138,110,0.3)' }}>
                  <span style={{ width: 6, height: 6, background: '#3BAF8A', borderRadius: '50%', display: 'inline-block' }} />
                  AI Simulator Active
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

                  <div className="flex gap-4">
                    <ScoreGauge score={result.surviveScore} label="Survive Probability" color={surviveColor} description="Probability of avoiding major damage" />
                    <ScoreGauge score={result.thriveScore} label="Thrive Probability" color={thriveColor} description="Probability of competitive advantage" />
                  </div>

                  <div className="p-5 border border-[#E8E4DC]" style={{ borderLeft: `4px solid ${surviveColor}` }}>
                    <p className="text-[9px] font-black uppercase tracking-wider mb-2" style={{ color: GOLD }}>Executive Analysis</p>
                    <p className="text-[13px] text-gray-700 leading-relaxed">{result.aiAnalysis}</p>
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
                  {(history as any[]).map((sim: any) => {
                    const sc = sim.surviveScore ?? 0;
                    const tc = sim.thriveScore ?? 0;
                    const sC = sc >= 70 ? TEAL : sc >= 45 ? GOLD : '#EF4444';
                    const tC = tc >= 60 ? TEAL : tc >= 35 ? GOLD : '#EF4444';
                    return (
                      <button key={sim.id} onClick={() => setResult(sim)}
                        className="w-full text-left p-4 border border-[#E8E4DC] hover:bg-[#FAFAF9] transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black" style={{ color: sC }}>S:{sc}</span>
                            <span className="text-[10px] font-black" style={{ color: tC }}>T:{tc}</span>
                          </div>
                          <span className="text-[9px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {sim.createdAt ? format(new Date(sim.createdAt), 'MMM d') : ''}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 line-clamp-2">{sim.scenarioText}</p>
                      </button>
                    );
                  })}
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
