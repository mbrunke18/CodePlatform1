import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Mic, Loader2, BookOpen, Users, Clock, Zap, ChevronRight, History, Plus, Check } from 'lucide-react';
import { format } from 'date-fns';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const DOMAIN_COLORS: Record<string, string> = {
  financial: GOLD, operational: TEAL, market: '#8B5CF6', technology: '#3B82F6',
  regulatory: '#F97316', talent: '#EC4899', crisis: '#EF4444', competitive: NAVY, esg: '#10B981',
};

const EXAMPLE_INPUTS = [
  "In Q3 2024, we faced a major supply chain disruption when our primary semiconductor supplier in Taiwan halted production due to a typhoon. The CFO called an emergency meeting. We scrambled to find alternative suppliers over 3 weeks, lost $40M in delayed orders. Key lessons: we needed pre-approved backup suppliers, finance needed a faster approval process for emergency POs, and procurement should have had a shortlist ready.",
  "During the 2023 product recall crisis, our CTO discovered a software defect in firmware version 2.1 affecting 50,000 units. We had no clear escalation path. The PR team found out from Twitter before internal comms. CEO had to fly back from Davos. Regulatory filing was delayed 48 hours. We need a crisis playbook that gets legal, PR, regulatory, and engineering into a single war room within 60 minutes.",
];

export default function StrategicRecorder({ embedded }: { embedded?: boolean }) {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const { data: historyRaw } = useQuery<any[]>({ queryKey: ['/api/strategic-recordings'] });
  const history = Array.isArray(historyRaw) ? historyRaw : [];

  const analyzeMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/strategic-recorder/analyze', { inputText }),
    onSuccess: (data: any) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/strategic-recordings'] });
      toast({ title: `${data.generatedPlaybooks?.length ?? 0} playbooks generated`, description: 'Your tribal knowledge has been captured.' });
    },
    onError: () => toast({ title: 'Analysis failed', variant: 'destructive' }),
  });

  const canAnalyze = inputText.trim().length >= 50 && !analyzeMutation.isPending;

  return (
    <PageLayout embedded={embedded}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-[#E8E4DC] px-8 py-6">
          <div className="flex items-center gap-4">
            <div style={{ width: 48, height: 48, background: NAVY, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: GOLD }}>IDENTIFY</span>
                <ChevronRight className="w-3 h-3" style={{ color: GOLD }} />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: TEAL }}>AI Playbook Generator</span>
              </div>
              <h1 style={{ ...CG, fontWeight: 700, fontSize: '1.8rem', color: NAVY, lineHeight: 1 }}>Strategic Recorder</h1>
              <p className="text-xs text-gray-400 mt-0.5">Paste past crisis notes, emails, or meeting summaries — AI builds custom playbooks in minutes</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Value prop */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: History, label: '48-Hour Onboarding', desc: 'vs 2-4 weeks manual process' },
                { icon: BookOpen, label: 'Tribal Knowledge Captured', desc: 'From meeting notes & emails' },
                { icon: Zap, label: 'Custom Playbooks Generated', desc: 'Tailored to your history' },
              ].map(v => {
                const Icon = v.icon;
                return (
                  <div key={v.label} className="p-4 border border-[#E8E4DC] text-center">
                    <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: GOLD }} />
                    <p className="text-[10px] font-bold" style={{ color: NAVY }}>{v.label}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{v.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Input area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black uppercase tracking-wider" style={{ color: NAVY }}>
                  Paste Crisis Notes, Meeting Transcripts, or Incident Reports
                </label>
                <span className="text-[9px] text-gray-400">{inputText.length} chars {inputText.length < 50 ? `(min 50)` : '✓'}</span>
              </div>
              <Textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Paste your crisis meeting notes, incident post-mortem, email threads, or any text describing how your organization responded to past events..."
                className="min-h-[220px] text-sm resize-none border-[#E8E4DC] focus:ring-0 focus:border-[#0A0F2E]"
              />
            </div>

            {/* Example triggers */}
            {!inputText && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Try an example:</p>
                <div className="space-y-2">
                  {EXAMPLE_INPUTS.map((ex, i) => (
                    <button key={i} onClick={() => setInputText(ex)}
                      className="w-full text-left text-[10px] text-gray-500 p-3 border border-[#E8E4DC] hover:border-[#C9A84C] hover:bg-[#FAFAF9] transition-colors line-clamp-2">
                      <span className="font-bold" style={{ color: GOLD }}>Example {i + 1}: </span>{ex.slice(0, 120)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => analyzeMutation.mutate()}
              disabled={!canAnalyze}
              className="w-full py-4 text-sm font-bold uppercase tracking-widest"
              style={{ background: canAnalyze ? NAVY : '#D1D5DB', color: '#fff' }}
            >
              {analyzeMutation.isPending
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Playbooks...</>
                : <><Zap className="w-4 h-4 mr-2" /> Generate Custom Playbooks</>}
            </Button>

            {/* Results */}
            {result?.generatedPlaybooks?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ width: 20, height: 2, background: GOLD }} />
                  <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                    {result.generatedPlaybooks.length} Playbooks Generated
                  </p>
                </div>
                <div className="space-y-4">
                  {result.generatedPlaybooks.map((pb: any, i: number) => {
                    const domainColor = DOMAIN_COLORS[pb.domain] || NAVY;
                    const saved = savedIds.has(i);
                    return (
                      <div key={i} className="p-5 border border-[#E8E4DC]" style={{ borderLeft: `3px solid ${domainColor}` }}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5"
                                style={{ background: `${domainColor}15`, color: domainColor }}>
                                {pb.domain}
                              </span>
                            </div>
                            <h3 className="text-[15px] font-bold" style={{ color: NAVY }}>{pb.name}</h3>
                            <p className="text-[10px] text-gray-500 mt-0.5">{pb.valueProposition}</p>
                          </div>
                          <button
                            onClick={() => setSavedIds(s => new Set([...s, i]))}
                            disabled={saved}
                            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 flex-shrink-0"
                            style={{ background: saved ? `${TEAL}15` : NAVY, color: saved ? TEAL : '#fff' }}>
                            {saved ? <><Check className="w-3 h-3" /> Saved</> : <><Plus className="w-3 h-3" /> Save</>}
                          </button>
                        </div>

                        {/* Trigger */}
                        <div className="flex items-center gap-2 px-3 py-1.5 mb-3" style={{ background: `${domainColor}08`, border: `1px solid ${domainColor}20` }}>
                          <Zap className="w-3 h-3 flex-shrink-0" style={{ color: domainColor }} />
                          <p className="text-[10px]"><span className="font-bold" style={{ color: NAVY }}>Trigger: </span><span className="text-gray-600">{pb.trigger}</span></p>
                        </div>

                        {/* Stakeholders */}
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-3 h-3 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {(pb.stakeholders || []).map((s: string) => (
                              <span key={s} className="text-[8px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600">{s}</span>
                            ))}
                          </div>
                        </div>

                        {/* Phases */}
                        {(pb.phases || []).length > 0 && (
                          <div className="space-y-2">
                            {pb.phases.map((phase: any, pi: number) => (
                              <div key={pi} className="pl-3 border-l border-[#E8E4DC]">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: domainColor }}>
                                    {phase.name}
                                  </span>
                                  {phase.duration && (
                                    <span className="text-[8px] text-gray-400 flex items-center gap-1">
                                      <Clock className="w-2.5 h-2.5" />{phase.duration}
                                    </span>
                                  )}
                                </div>
                                <ul className="space-y-0.5">
                                  {(phase.tasks || []).map((task: string, ti: number) => (
                                    <li key={ti} className="text-[10px] text-gray-600 flex items-start gap-1.5">
                                      <span className="text-gray-300 flex-shrink-0 mt-0.5">›</span>{task}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4" style={{ color: GOLD }} />
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: NAVY }}>Past Recordings</p>
            </div>
            {history.length === 0 ? (
              <div className="border border-dashed border-[#E8E4DC] p-6 text-center">
                <p className="text-[11px] text-gray-400">No recordings yet</p>
                <p className="text-[9px] text-gray-300 mt-1">Your AI-generated playbooks will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((rec: any) => (
                  <div key={rec.id} className="p-3 border border-[#E8E4DC] hover:bg-[#FAFAF9] cursor-pointer transition-colors"
                    onClick={() => setResult(rec)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                        style={{ background: rec.status === 'complete' ? `${TEAL}15` : `${GOLD}15`, color: rec.status === 'complete' ? TEAL : GOLD }}>
                        {rec.status}
                      </span>
                      <span className="text-[9px] text-gray-400">{rec.createdAt ? format(new Date(rec.createdAt), 'MMM d') : ''}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 line-clamp-2">{rec.inputText?.slice(0, 80)}...</p>
                    {rec.generatedPlaybooks?.length > 0 && (
                      <p className="text-[9px] font-bold mt-1" style={{ color: TEAL }}>
                        {rec.generatedPlaybooks.length} playbooks
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
