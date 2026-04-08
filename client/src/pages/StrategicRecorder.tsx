import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Mic, Loader2, BookOpen, Users, Clock, Zap, ChevronRight, History, Plus, Check, Upload, FileText, Mail, ClipboardList, AlertTriangle, Brain, Shield, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const BORDER = '#E8E4DC';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const DOMAIN_COLORS: Record<string, string> = {
  financial: GOLD, operational: TEAL, market: '#8B5CF6', technology: '#3B82F6',
  regulatory: '#F97316', talent: '#EC4899', crisis: '#EF4444', competitive: NAVY, esg: '#10B981',
};

const DOC_TYPES = [
  {
    id: 'postmortem',
    icon: ClipboardList,
    label: 'Post-Mortem Report',
    description: 'After-action reviews, incident retrospectives',
    placeholder: 'Paste your post-mortem or after-action review. Include what happened, what failed, what worked, key timelines, and lessons learned. The more detail the better — AI will extract decision patterns and convert them to structured playbook phases...',
    example: "Post-Mortem: Q3 Ransomware Incident (2023)\n\nIncident: Ransomware detected at 2:14 AM on September 14. IT discovered encrypted files across 3 APAC servers at 6:30 AM. CISO was not notified until 9:00 AM — 6.5 hours after detection.\n\nWhat failed: No 24/7 SOC monitoring. Notification chain was manual. Legal team wasn't looped in until Day 2. PR found out from a reporter before internal comms went out. CFO approval for emergency IR retainer took 3 days.\n\nWhat worked: Once IR firm was engaged, containment took 18 hours. Communication templates existed but weren't pre-approved.\n\nKey lessons: Need automated CISO alert at detection. Legal and PR must be in first notification. CFO pre-approval for IR spend up to $500K needed. All hands playbook needed with pre-assigned roles.",
  },
  {
    id: 'email',
    icon: Mail,
    label: 'Email / Slack Thread',
    description: 'Crisis communication chains, response threads',
    placeholder: 'Paste the email or Slack thread from a past incident. Include the full chain — who was involved, what decisions were made, what was escalated and when. AI will reconstruct the decision flow and identify what should have been pre-staged...',
    example: "From: CISO (Sarah Chen) — Sept 14, 9:02 AM\nTo: CTO, CLO, CFO\nSubject: URGENT — Ransomware detected APAC\n\nWe have an active ransomware incident. 3 servers encrypted. Need IR firm engaged today.\n\nFrom: CFO (James Kovach) — Sept 14, 11:30 AM\nWho has authority to approve the IR retainer? Need legal sign-off first.\n\nFrom: CLO (Elena Vasquez) — Sept 14, 2:45 PM\nI'm reviewing the contract now. Give me until EOD.\n\nFrom: CEO (David Park) — Sept 14, 4:00 PM\nWhy haven't we engaged IR yet? This has been 14 hours. What's the hold-up?",
  },
  {
    id: 'boardminutes',
    icon: FileText,
    label: 'Board / Executive Minutes',
    description: 'Board meeting notes, executive briefing summaries',
    placeholder: 'Paste board minutes or executive briefing notes from a past crisis or strategic event. AI will identify governance gaps, decision rights that were unclear, and escalation paths that broke down...',
    example: "Board Meeting — Emergency Session Sept 16\n\nAgenda Item 1: Ransomware Status Update\nCSIO presented: 3 servers affected, IR firm engaged Day 3. Estimated exposure $4M-$8M.\nBoard concern: Why was board not notified until Day 2?\nAction Item: Board notification protocol to be defined. CEO to present plan at next meeting.\n\nAgenda Item 2: PR exposure\nHead of Comms: Bloomberg reporter inquired before internal announcement. Need pre-approved holding statement.\nBoard concern: Who authorizes external communications?\nAction: CLO, CMO, and CEO must sign off simultaneously. CLO to draft pre-approved template.",
  },
  {
    id: 'incident',
    icon: AlertTriangle,
    label: 'Incident Report',
    description: 'Formal incident logs, regulatory filings, event records',
    placeholder: 'Paste a formal incident report, regulatory filing, or structured event record. Include timeline, affected systems or stakeholders, actions taken, and outcomes. AI will extract the response pattern and convert it to a repeatable playbook...',
    example: "Incident Report #2023-047\nClassification: Critical — Tier 1\nDate: September 14, 2023\nDetected: 2:14 AM\nNotification of CISO: 9:00 AM (+6.8 hours)\nIR firm engaged: September 16 (+48 hours from detection)\nContainment complete: September 17, 6:00 PM (+63 hours)\n\nRoot cause: Phishing attack on VPN credentials 72 hours prior.\nRegulatory deadline: SEC Form 8-K required within 72 hours of material determination.\n8-K filed: September 17 (within deadline, but 48 hours after material determination).\n\nFinancial impact: $4.2M direct IR costs + $2.1M operational downtime.",
  },
  {
    id: 'notes',
    icon: Brain,
    label: 'Tribal Knowledge Notes',
    description: 'Expert memory, informal notes, spoken recollections',
    placeholder: 'Paste informal notes, a spoken recollection typed out, or institutional knowledge from your most experienced leaders. This is the knowledge that exists in people\'s heads but has never been written down. AI will structure it into an executable playbook...',
    example: "Notes from conversation with former CLO (retired):\n\nEvery time we had a regulatory inquiry, the same thing happened: legal would spend the first week just figuring out who needs to know. My advice — pre-define the first 48 hours completely. Who gets called, in what order, who has authority to produce documents, who speaks to regulators. We lost 10 days on the 2018 SEC inquiry just on that.\n\nThe CFO always needs to be in the room from Day 1 on anything financial. We made the mistake of briefing him on Day 3 once and he was furious — rightly so. Pre-approved spend authorities for response costs. Don't make the CFO approve an IR retainer in the middle of an incident.",
  },
];

const FRESH_INPUTS = [
  "In Q3 2024, we faced a major supply chain disruption when our primary semiconductor supplier in Taiwan halted production due to a typhoon. The CFO called an emergency meeting. We scrambled to find alternative suppliers over 3 weeks, lost $40M in delayed orders. Key lessons: we needed pre-approved backup suppliers, finance needed a faster approval process for emergency POs, and procurement should have had a shortlist ready.",
  "During the 2023 product recall crisis, our CTO discovered a software defect in firmware version 2.1 affecting 50,000 units. We had no clear escalation path. The PR team found out from Twitter before internal comms. CEO had to fly back from Davos. Regulatory filing was delayed 48 hours. We need a crisis playbook that gets legal, PR, regulatory, and engineering into a single war room within 60 minutes.",
];

type TabId = 'analyze' | 'historical';

export default function StrategicRecorder({ embedded }: { embedded?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabId>('analyze');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [selectedDocType, setSelectedDocType] = useState<string>('postmortem');
  const [historicalText, setHistoricalText] = useState('');
  const [historicalResult, setHistoricalResult] = useState<any>(null);
  const { toast } = useToast();

  const { data: historyRaw } = useQuery<any[]>({ queryKey: ['/api/strategic-recordings'] });
  const history = Array.isArray(historyRaw) ? historyRaw : [];

  const selectedType = DOC_TYPES.find(d => d.id === selectedDocType) || DOC_TYPES[0];

  const analyzeMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/strategic-recorder/analyze', { inputText }),
    onSuccess: (data: any) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/strategic-recordings'] });
      toast({ title: `${data.generatedPlaybooks?.length ?? 0} playbooks generated`, description: 'Your knowledge has been captured and structured.' });
    },
    onError: (error: any) => {
      if (error?.message?.startsWith('401')) {
        toast({ title: 'Sign in required', description: 'Please sign in to analyze recordings.', variant: 'destructive' });
        setTimeout(() => { window.location.href = '/api/login'; }, 1500);
      } else {
        toast({ title: 'Analysis failed', description: 'An error occurred. Please try again.', variant: 'destructive' });
      }
    },
  });

  const historicalMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/strategic-recorder/analyze', { inputText: historicalText }),
    onSuccess: (data: any) => {
      setHistoricalResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/strategic-recordings'] });
      toast({ title: `${data.generatedPlaybooks?.length ?? 0} playbooks encoded`, description: 'Historical knowledge has been converted to structured playbooks.' });
    },
    onError: (error: any) => {
      if (error?.message?.startsWith('401')) {
        toast({ title: 'Sign in required', description: 'Please sign in to encode documents.', variant: 'destructive' });
        setTimeout(() => { window.location.href = '/api/login'; }, 1500);
      } else {
        toast({ title: 'Encoding failed', description: 'An error occurred. Please try again.', variant: 'destructive' });
      }
    },
  });

  const canAnalyze = inputText.trim().length >= 50 && !analyzeMutation.isPending;
  const canEncodeHistorical = historicalText.trim().length >= 50 && !historicalMutation.isPending;
  const tribalKnowledgeScore = Math.min(100, (history.length * 18) + (history.reduce((s: number, r: any) => s + (r.generatedPlaybooks?.length || 0), 0) * 7));

  const tabStyle = (id: TabId): React.CSSProperties => ({
    padding: '10px 20px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    border: 'none',
    cursor: 'pointer',
    background: activeTab === id ? NAVY : 'transparent',
    color: activeTab === id ? '#fff' : '#9CA3AF',
    borderBottom: activeTab === id ? `2px solid ${GOLD}` : '2px solid transparent',
    transition: 'all 0.15s',
  });

  return (
    <PageLayout embedded={embedded}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div style={{ background: NAVY, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mic style={{ width: 22, height: 22, color: GOLD }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD }}>IDENTIFY</span>
                <ChevronRight style={{ width: 10, height: 10, color: GOLD }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: TEAL }}>AI Playbook Generator</span>
              </div>
              <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1 }}>Strategic Recorder</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>
                Convert crisis notes, post-mortems, and historical documents into structured readiness playbooks
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, display: 'flex', background: '#FAFAF9' }}>
          <button style={tabStyle('analyze')} onClick={() => setActiveTab('analyze')}>
            <Mic style={{ width: 12, height: 12, display: 'inline', marginRight: 6 }} />
            Paste & Analyze
          </button>
          <button style={tabStyle('historical')} onClick={() => setActiveTab('historical')}>
            <Upload style={{ width: 12, height: 12, display: 'inline', marginRight: 6 }} />
            Historical Ingestion
          </button>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>

          {/* ─── Tab: Paste & Analyze ─── */}
          {activeTab === 'analyze' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { icon: History, label: '48-Hour Onboarding', desc: 'vs 2–4 weeks manual setup' },
                  { icon: BookOpen, label: 'Tribal Knowledge Captured', desc: 'From meeting notes & emails' },
                  { icon: Zap, label: 'Custom Playbooks Generated', desc: 'Tailored to your history' },
                ].map(v => {
                  const Icon = v.icon;
                  return (
                    <div key={v.label} style={{ padding: '14px', border: `1px solid ${BORDER}`, textAlign: 'center' }}>
                      <Icon style={{ width: 18, height: 18, color: GOLD, margin: '0 auto 8px' }} />
                      <div style={{ fontSize: 10, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{v.label}</div>
                      <div style={{ fontSize: 9, color: '#9CA3AF' }}>{v.desc}</div>
                    </div>
                  );
                })}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY }}>
                    Paste Crisis Notes, Meeting Transcripts, or Incident Reports
                  </label>
                  <span style={{ fontSize: 9, color: '#9CA3AF' }}>{inputText.length} chars {inputText.length < 50 ? '(min 50)' : '✓'}</span>
                </div>
                <Textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Paste your crisis meeting notes, incident post-mortem, email threads, or any text describing how your organization responded to past events..."
                  style={{ minHeight: 200, fontSize: 13, border: `1px solid ${BORDER}`, resize: 'none' }}
                />
              </div>

              {!inputText && (
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9CA3AF', marginBottom: 8 }}>Try an example:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {FRESH_INPUTS.map((ex, i) => (
                      <button key={i} onClick={() => setInputText(ex)}
                        style={{ textAlign: 'left', fontSize: 10, color: '#6B7280', padding: '10px 12px', border: `1px solid ${BORDER}`, background: '#FAFAF9', cursor: 'pointer', lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 700, color: GOLD }}>Example {i + 1}: </span>{ex.slice(0, 120)}...
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={() => analyzeMutation.mutate()} disabled={!canAnalyze}
                style={{ background: canAnalyze ? NAVY : '#D1D5DB', color: '#fff', borderRadius: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '14px' }}>
                {analyzeMutation.isPending
                  ? <><Loader2 style={{ width: 15, height: 15, marginRight: 8, animation: 'spin 1s linear infinite' }} /> Generating Playbooks...</>
                  : <><Zap style={{ width: 15, height: 15, marginRight: 8 }} /> Generate Custom Playbooks</>}
              </Button>

              {result?.generatedPlaybooks?.length > 0 && <PlaybookResults playbooks={result.generatedPlaybooks} savedIds={savedIds} setSavedIds={setSavedIds} />}
            </div>
          )}

          {/* ─── Tab: Historical Ingestion ─── */}
          {activeTab === 'historical' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Value prop banner */}
              <div style={{ background: `${NAVY}05`, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GOLD}`, padding: '16px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Upload your last 3 incident reports — we'll pre-build your first playbooks</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
                  Every organization has institutional knowledge trapped in documents, email chains, and the heads of experienced leaders. Select the document type below and paste the content — AI reconstructs the decision pattern and converts it to a structured, repeatable playbook your team can deploy in 12 minutes next time.
                </div>
              </div>

              {/* Document type selector */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY, marginBottom: 10 }}>Document Type</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {DOC_TYPES.map(dt => {
                    const Icon = dt.icon;
                    const isSelected = selectedDocType === dt.id;
                    return (
                      <button key={dt.id} onClick={() => { setSelectedDocType(dt.id); setHistoricalText(''); }}
                        style={{ padding: '12px 8px', border: `1px solid ${isSelected ? GOLD : BORDER}`, background: isSelected ? `${GOLD}10` : '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                        <Icon style={{ width: 16, height: 16, color: isSelected ? GOLD : '#9CA3AF', margin: '0 auto 6px' }} />
                        <div style={{ fontSize: 9, fontWeight: 700, color: isSelected ? NAVY : '#6B7280', lineHeight: 1.3 }}>{dt.label}</div>
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>{selectedType.description}</div>
              </div>

              {/* Input area */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY }}>
                    {selectedType.label} Content
                  </label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => setHistoricalText(selectedType.example)}
                      style={{ fontSize: 9, color: GOLD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'none', border: `1px solid ${GOLD}40`, padding: '3px 8px', cursor: 'pointer' }}>
                      Load Example
                    </button>
                    <span style={{ fontSize: 9, color: '#9CA3AF' }}>{historicalText.length} chars {historicalText.length < 50 ? '(min 50)' : '✓'}</span>
                  </div>
                </div>
                <Textarea
                  value={historicalText}
                  onChange={e => setHistoricalText(e.target.value)}
                  placeholder={selectedType.placeholder}
                  style={{ minHeight: 240, fontSize: 13, border: `1px solid ${BORDER}`, resize: 'none' }}
                />
              </div>

              <Button onClick={() => historicalMutation.mutate()} disabled={!canEncodeHistorical}
                style={{ background: canEncodeHistorical ? NAVY : '#D1D5DB', color: '#fff', borderRadius: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '14px' }}>
                {historicalMutation.isPending
                  ? <><Loader2 style={{ width: 15, height: 15, marginRight: 8 }} /> Encoding to Playbooks...</>
                  : <><Shield style={{ width: 15, height: 15, marginRight: 8 }} /> Encode Historical Knowledge to Playbooks</>}
              </Button>

              {historicalResult?.generatedPlaybooks?.length > 0 && (
                <div style={{ padding: '12px 16px', background: `${TEAL}08`, border: `1px solid ${TEAL}25`, borderLeft: `4px solid ${TEAL}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, marginBottom: 4 }}>
                    {historicalResult.generatedPlaybooks.length} playbooks encoded from historical knowledge
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>
                    Your institutional knowledge is now part of your Readiness Infrastructure. These playbooks will be available for deployment the next time a matching trigger fires.
                  </div>
                </div>
              )}
              {historicalResult?.generatedPlaybooks?.length > 0 && (
                <PlaybookResults playbooks={historicalResult.generatedPlaybooks} savedIds={savedIds} setSavedIds={setSavedIds} />
              )}
            </div>
          )}

          {/* ─── Right Panel ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Tribal Knowledge Score */}
            <div style={{ background: NAVY, padding: '20px', color: '#fff' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>Tribal Knowledge Score</div>
              <div style={{ ...CG, fontSize: 44, fontWeight: 700, color: history.length > 0 ? GOLD : 'rgba(255,255,255,0.2)', lineHeight: 1, marginBottom: 4 }}>
                {history.length > 0 ? tribalKnowledgeScore : 0}
                <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.3)' }}>/100</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
                {history.length === 0
                  ? 'No institutional knowledge encoded yet'
                  : tribalKnowledgeScore >= 70 ? 'Strong institutional foundation'
                  : tribalKnowledgeScore >= 40 ? 'Growing knowledge base'
                  : 'Early stage — keep encoding'}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', height: 4, marginBottom: 12 }}>
                <div style={{ height: '100%', background: GOLD, width: `${history.length > 0 ? tribalKnowledgeScore : 0}%`, transition: 'width 0.4s' }} />
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                {history.length} recording{history.length !== 1 ? 's' : ''} · {history.reduce((s: number, r: any) => s + (r.generatedPlaybooks?.length || 0), 0)} playbooks encoded
              </div>
            </div>

            {/* Past Recordings */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <History style={{ width: 14, height: 14, color: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: NAVY }}>Past Recordings</span>
              </div>
              {history.length === 0 ? (
                <div style={{ border: `1px dashed ${BORDER}`, padding: '24px', textAlign: 'center' }}>
                  <TrendingUp style={{ width: 20, height: 20, color: '#D1D5DB', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>No recordings yet</div>
                  <div style={{ fontSize: 9, color: '#D1D5DB', marginTop: 4 }}>Your AI-generated playbooks will appear here</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {history.map((rec: any) => (
                    <div key={rec.id}
                      style={{ padding: '12px', border: `1px solid ${BORDER}`, cursor: 'pointer', background: '#FAFAF9' }}
                      onClick={() => { setResult(rec); setActiveTab('analyze'); }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '1px 6px', background: rec.status === 'complete' ? `${TEAL}15` : `${GOLD}15`, color: rec.status === 'complete' ? TEAL : GOLD }}>{rec.status}</span>
                        <span style={{ fontSize: 9, color: '#9CA3AF' }}>{rec.createdAt ? format(new Date(rec.createdAt), 'MMM d') : ''}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{rec.inputText?.slice(0, 80)}...</div>
                      {rec.generatedPlaybooks?.length > 0 && (
                        <div style={{ fontSize: 9, fontWeight: 700, color: TEAL, marginTop: 4 }}>{rec.generatedPlaybooks.length} playbooks encoded</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function PlaybookResults({ playbooks, savedIds, setSavedIds }: { playbooks: any[]; savedIds: Set<number>; setSavedIds: (fn: (prev: Set<number>) => Set<number>) => void }) {
  const NAVY = '#0A0F2E';
  const GOLD = '#C9A84C';
  const TEAL = '#2B8A6E';
  const BORDER = '#E8E4DC';
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
  const DOMAIN_COLORS: Record<string, string> = {
    financial: GOLD, operational: TEAL, market: '#8B5CF6', technology: '#3B82F6',
    regulatory: '#F97316', talent: '#EC4899', crisis: '#EF4444', competitive: NAVY, esg: '#10B981',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 20, height: 2, background: GOLD }} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD }}>{playbooks.length} Playbooks Generated</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {playbooks.map((pb: any, i: number) => {
          const domainColor = DOMAIN_COLORS[pb.domain] || NAVY;
          const saved = savedIds.has(i);
          return (
            <div key={i} style={{ padding: '20px', border: `1px solid ${BORDER}`, borderLeft: `3px solid ${domainColor}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', background: `${domainColor}15`, color: domainColor, display: 'inline-block', marginBottom: 6 }}>{pb.domain}</span>
                  <div style={{ ...CG, fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{pb.name}</div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>{pb.valueProposition}</div>
                </div>
                <button onClick={() => setSavedIds(s => new Set([...Array.from(s), i]))} disabled={saved}
                  style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '6px 12px', background: saved ? `${TEAL}15` : NAVY, color: saved ? TEAL : '#fff', border: 'none', cursor: saved ? 'default' : 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {saved ? <><Check style={{ width: 11, height: 11 }} /> Saved</> : <><Plus style={{ width: 11, height: 11 }} /> Save</>}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: `${domainColor}08`, border: `1px solid ${domainColor}20`, marginBottom: 10 }}>
                <Zap style={{ width: 11, height: 11, color: domainColor, flexShrink: 0 }} />
                <span style={{ fontSize: 10 }}><strong style={{ color: NAVY }}>Trigger: </strong><span style={{ color: '#6B7280' }}>{pb.trigger}</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Users style={{ width: 11, height: 11, color: '#9CA3AF' }} />
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {(pb.stakeholders || []).map((s: string) => (
                    <span key={s} style={{ fontSize: 8, fontWeight: 700, padding: '1px 6px', background: '#F3F4F6', color: '#6B7280' }}>{s}</span>
                  ))}
                </div>
              </div>
              {(pb.phases || []).map((phase: any, pi: number) => (
                <div key={pi} style={{ paddingLeft: 12, borderLeft: `1px solid ${BORDER}`, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: domainColor }}>{phase.name}</span>
                    {phase.duration && <span style={{ fontSize: 8, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 3 }}><Clock style={{ width: 9, height: 9 }} />{phase.duration}</span>}
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {(phase.tasks || []).map((task: string, ti: number) => (
                      <li key={ti} style={{ fontSize: 10, color: '#6B7280', display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 2 }}>
                        <span style={{ color: '#D1D5DB', flexShrink: 0, marginTop: 1 }}>›</span>{task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
