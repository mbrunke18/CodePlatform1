import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingDown, Shield, Users, Zap, ChevronRight,
  Radio, Activity, AlertTriangle, CheckCircle2, ArrowRight, Lock
} from 'lucide-react';

const NAVY_BG  = "#132558";
const MID_NAVY = "#141B45";
const NAVY_INK = "#0A0F2E";
const GOLD     = "#C9A84C";
const TEAL     = "#2B8A6E";
const RED      = "#EF4444";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

interface Scenario {
  id: string;
  icon: any;
  urgency: string;
  urgencyColor: string;
  headline: string;
  subline: string;
  domain: string;
  detectSignals: string[];
  allSignals: string[];
  triggerName: string;
  playbookKeyword: string;
  stakes: string;
  stakesLabel: string;
  window: string;
  windowLabel: string;
  stakeMetrics: { label: string; value: string; color: string }[];
  whatHappensNext: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'competitive',
    icon: TrendingDown,
    urgency: 'MARKET INTELLIGENCE ALERT',
    urgencyColor: GOLD,
    headline: 'A major competitor just closed a $2.1B acquisition in your core market.',
    subline: 'Market position at risk. Board expects a strategic response within 24 hours.',
    domain: 'Market Dynamics',
    detectSignals: ['Market Dynamics', 'Competitive Intelligence', 'Revenue Impact', 'Strategic Positioning'],
    allSignals: [
      'Competitive Intelligence', 'Market Share Analysis', 'Revenue Impact Modeling',
      'Account Risk Scoring', 'Board Communication Protocol', 'Pricing Strategy Review',
      'Customer Retention Signals', 'Media Sentiment Tracking',
    ],
    triggerName: 'Competitive Acquisition Threat — Priority Response Required',
    playbookKeyword: 'competitive',
    stakes: '$340M',
    stakesLabel: 'Revenue at Risk',
    window: '24h',
    windowLabel: 'Board Response Window',
    stakeMetrics: [
      { label: 'Competitor Deal Size',   value: '$2.1B',   color: RED  },
      { label: 'Revenue at Risk',        value: '$340M',   color: GOLD },
      { label: 'Accounts Exposed',       value: '47',      color: GOLD },
      { label: 'Board Response Window',  value: '24 hrs',  color: TEAL },
    ],
    whatHappensNext: [
      'AI generates a Commander Brief with competitive response options',
      'Sales and marketing task force auto-assigned and briefed',
      'Top 47 at-risk accounts flagged for immediate retention outreach',
      '12-minute countdown tracks your board-ready response velocity',
      'Post-execution debrief shows ROI and decision velocity vs. 72-hr benchmark',
    ],
  },
  {
    id: 'regulatory',
    icon: Shield,
    urgency: 'REGULATORY CRISIS DETECTED',
    urgencyColor: RED,
    headline: 'New federal regulation threatens $180M in annual revenue.',
    subline: '90-day compliance window. Legal exposure escalating. Regulatory response required now.',
    domain: 'Regulatory & Compliance',
    detectSignals: ['Regulatory Compliance', 'Legal Exposure', 'Financial Risk', 'Government Affairs'],
    allSignals: [
      'Regulatory Compliance', 'Legal Exposure Modeling', 'Financial Impact Assessment',
      'Government Affairs Signals', 'Board Disclosure Obligations', 'Litigation Hold Protocol',
      'Cross-Jurisdictional Risk', 'Media & Stakeholder Risk',
    ],
    triggerName: 'Regulatory Compliance Crisis — Mandatory Executive Response',
    playbookKeyword: 'regulatory',
    stakes: '$180M',
    stakesLabel: 'Revenue Exposure',
    window: '90 days',
    windowLabel: 'Compliance Window',
    stakeMetrics: [
      { label: 'Revenue Threatened',    value: '$180M',    color: RED  },
      { label: 'Legal Exposure',        value: 'High',     color: RED  },
      { label: 'Compliance Deadline',   value: '90 days',  color: GOLD },
      { label: 'Regulatory Agencies',   value: '3',        color: TEAL },
    ],
    whatHappensNext: [
      'AI Commander Brief maps legal exposure and disclosure obligations',
      'Legal, compliance, and government affairs task force activated',
      'Board audit committee notified with disclosure timeline',
      '12-minute clock establishes your response posture on record',
      'Debrief generates a board-ready compliance response summary',
    ],
  },
  {
    id: 'leadership',
    icon: Users,
    urgency: 'LEADERSHIP CONTINUITY ALERT',
    urgencyColor: TEAL,
    headline: 'Chief Revenue Officer resigned effective immediately.',
    subline: 'Board meeting in 48 hours. $340M revenue pipeline at risk. Succession protocol required.',
    domain: 'Talent & Leadership',
    detectSignals: ['Leadership Continuity', 'Talent Management', 'Stakeholder Impact', 'Revenue Risk'],
    allSignals: [
      'Leadership Continuity Signals', 'Revenue Pipeline Risk', 'Succession Readiness',
      'Culture & Sentiment Monitoring', 'Board Communication Protocol', 'Executive Search Triggers',
      'Client Relationship Risk', 'Employee Retention Risk',
    ],
    triggerName: 'C-Suite Leadership Gap — Immediate Succession Protocol',
    playbookKeyword: 'leadership',
    stakes: '$340M',
    stakesLabel: 'Pipeline at Risk',
    window: '48h',
    windowLabel: 'Board Briefing Deadline',
    stakeMetrics: [
      { label: 'Revenue Pipeline',       value: '$340M',   color: RED  },
      { label: 'Key Accounts at Risk',   value: '23',      color: GOLD },
      { label: 'Board Meeting',          value: '48 hrs',  color: GOLD },
      { label: 'Succession Readiness',   value: 'Low',     color: RED  },
    ],
    whatHappensNext: [
      'AI Commander Brief identifies succession options and pipeline stabilization',
      'CHRO, board, and executive search activated simultaneously',
      'Top 23 at-risk client accounts flagged for executive relationship coverage',
      '12-minute response establishes board briefing posture before the meeting',
      'Debrief scores your succession velocity against industry standard',
    ],
  },
];

const BASE_DETECT_STEPS = [
  { label: 'Scanning 248+ data points across 20 signal categories', duration: 1600 },
  { label: 'Signal threshold breach confirmed', duration: 1200 },
  { label: 'Cross-referencing 221 executive trigger conditions', duration: 1400 },
  { label: 'TRIGGER DETECTED', duration: 1100, highlight: true },
  { label: 'Matching against 170 strategic playbooks', duration: 1300 },
  { label: 'AI Commander Brief generating', duration: 1500 },
  { label: 'Execution protocol ready', duration: 900, highlight: true },
];

type Phase = 'select' | 'detect' | 'ready';

function AnimatedCounter({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
}

export default function GuidedStart() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>('select');
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [detectStep, setDetectStep] = useState(0);
  const [playbookId, setPlaybookId] = useState<string | null>(null);
  const [signalCount, setSignalCount] = useState(0);

  const { data: playbookResponse } = useQuery<any>({
    queryKey: ['/api/playbook-library'],
    queryFn: () => fetch('/api/playbook-library?limit=50', { credentials: 'include' }).then(r => r.ok ? r.json() : []),
  });

  const playbookList: any[] = (() => {
    if (!playbookResponse) return [];
    if (Array.isArray(playbookResponse)) return playbookResponse;
    if (Array.isArray(playbookResponse?.playbooks)) return playbookResponse.playbooks;
    if (Array.isArray(playbookResponse?.data)) return playbookResponse.data;
    return [];
  })();

  function findPlaybook(scenario: Scenario): string | null {
    if (playbookList.length === 0) return null;
    const keyword = scenario.playbookKeyword.toLowerCase();
    const domainWord = scenario.domain.toLowerCase().split(' ')[0];
    const byKeyword = playbookList.find(p =>
      p.name?.toLowerCase().includes(keyword) ||
      p.domain?.toLowerCase().includes(domainWord) ||
      p.category?.toLowerCase().includes(domainWord)
    );
    return byKeyword?.id || playbookList[0]?.id || null;
  }

  function handleScenarioSelect(scenario: Scenario) {
    setSelected(scenario);
    setPhase('detect');
    setDetectStep(0);
    setSignalCount(0);
    const pid = findPlaybook(scenario);
    setPlaybookId(pid);
  }

  useEffect(() => {
    if (selected && !playbookId && playbookList.length > 0) {
      setPlaybookId(findPlaybook(selected));
    }
  }, [playbookList, selected]);

  // Detect step progression
  useEffect(() => {
    if (phase !== 'detect' || !selected) return;
    let step = 0;
    function advance() {
      step++;
      setDetectStep(step);
      if (step < BASE_DETECT_STEPS.length - 1) {
        setTimeout(advance, BASE_DETECT_STEPS[step].duration);
      } else {
        setTimeout(() => setPhase('ready'), 1100);
      }
    }
    const timer = setTimeout(advance, BASE_DETECT_STEPS[0].duration);
    return () => clearTimeout(timer);
  }, [phase, selected]);

  // Signal counter during detect
  useEffect(() => {
    if (phase !== 'detect') return;
    let count = 0;
    const target = 248;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 7) + 3;
      if (count >= target) { setSignalCount(target); clearInterval(interval); }
      else setSignalCount(count);
    }, 60);
    return () => clearInterval(interval);
  }, [phase]);

  function handleActivate() {
    if (!selected) return;
    let pid = playbookId || findPlaybook(selected) || (playbookList[0]?.id ?? null);
    if (pid) setLocation(`/playbook-activation/manual/${pid}`);
  }

  // ─── PHASE: SELECT ────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div style={{ minHeight: '100vh', background: NAVY_BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.09) 1px,transparent 1px)`, backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,138,110,0.14) 0%, transparent 68%)', pointerEvents: 'none' }} />

        <div className="relative z-10 w-full max-w-5xl">
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>VaughnMartin · Execution OS</span>
            </div>
            <h1 style={{ ...CG, fontSize: 'clamp(30px,5vw,54px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 14 }}>
              One trigger. One playbook.<br />
              <em style={{ fontStyle: 'italic', color: GOLD }}>Twelve minutes.</em>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 540, margin: '0 auto 12px' }}>
              Pick a scenario below and experience the full IDEA execution cycle live — no login required.
            </p>
            {/* Live stats strip */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
              {[
                { val: '248+', label: 'Live signals monitored' },
                { val: '170',  label: 'Playbooks ready' },
                { val: '12m',  label: 'Target response time' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD }}>{s.val}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20, marginBottom: 40 }}>
            {SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderTop: `3px solid ${scenario.urgencyColor}`,
                    padding: '0',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  {/* Card header */}
                  <div style={{ padding: '22px 22px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                      <div style={{ padding: '9px', background: `${scenario.urgencyColor}18`, borderRadius: 2 }}>
                        <Icon style={{ width: 20, height: 20, color: scenario.urgencyColor }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: scenario.urgencyColor, paddingTop: 3 }}>
                        {scenario.urgency}
                      </span>
                    </div>
                    <p style={{ ...CG, fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1.35, marginBottom: 8 }}>
                      {scenario.headline}
                    </p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                      {scenario.subline}
                    </p>
                  </div>

                  {/* Stakes metrics */}
                  <div style={{ padding: '14px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {scenario.stakeMetrics.map((m) => (
                      <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div style={{ padding: '12px 22px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                      {scenario.domain}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: scenario.urgencyColor }}>
                      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>Execute scenario</span>
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Lock style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
              No login required · Full simulation · Results in under 12 minutes
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ─── PHASE: DETECT ────────────────────────────────────────────────────────
  if (phase === 'detect' && selected) {
    const Icon = selected.icon;
    return (
      <div style={{ minHeight: '100vh', background: MID_NAVY, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />
        {/* Scan beam */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`, animation: 'scanBeam 2s linear infinite', opacity: 0.6 }} />

        <div className="relative z-10 w-full max-w-2xl">
          {/* Phase label */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(43,138,110,0.12)', border: '1px solid rgba(43,138,110,0.3)', padding: '6px 18px', marginBottom: 24 }}>
              <Radio style={{ width: 12, height: 12, color: TEAL }} className="animate-pulse" />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>DETECT Phase Active</span>
            </div>

            {/* Live signal counter */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 28 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...CG, fontSize: 44, fontWeight: 700, color: TEAL, lineHeight: 1 }}>{signalCount}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Data points scanned</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...CG, fontSize: 44, fontWeight: 700, color: GOLD, lineHeight: 1 }}>
                  {detectStep >= 3 ? '1' : '0'}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Trigger confirmed</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...CG, fontSize: 44, fontWeight: 700, color: detectStep >= 5 ? '#fff' : 'rgba(255,255,255,0.2)', lineHeight: 1 }}>
                  {detectStep >= 5 ? '1' : '0'}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Playbook matched</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
              <Icon style={{ width: 16, height: 16, color: selected.urgencyColor }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 460 }}>{selected.headline}</span>
            </div>
          </div>

          {/* Two column: steps + signals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            {/* Detection steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>System Scan Progress</div>
              {BASE_DETECT_STEPS.map((step, i) => {
                const isComplete = i < detectStep;
                const isActive = i === detectStep;
                const isPending = i > detectStep;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: isPending ? 0.2 : 1, transition: 'opacity 0.4s' }}>
                    <div style={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isComplete ? (
                        <CheckCircle2 style={{ width: 16, height: 16, color: TEAL }} />
                      ) : isActive ? (
                        <Activity style={{ width: 14, height: 14, color: GOLD }} className="animate-pulse" />
                      ) : (
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: step.highlight ? 12 : 11,
                      fontWeight: step.highlight ? 700 : 400,
                      color: step.highlight && (isComplete || isActive) ? GOLD
                        : isComplete ? 'rgba(255,255,255,0.65)'
                        : isActive ? '#fff'
                        : 'rgba(255,255,255,0.3)',
                      letterSpacing: step.highlight ? '0.06em' : 'normal',
                      textTransform: step.highlight ? 'uppercase' as const : 'none' as const,
                      transition: 'color 0.4s',
                    }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Signal categories */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Domain Signal Categories</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {selected.allSignals.map((sig, i) => (
                  <span key={sig} style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '5px 9px',
                    background: detectStep > i ? 'rgba(43,138,110,0.18)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${detectStep > i ? 'rgba(43,138,110,0.45)' : 'rgba(255,255,255,0.08)'}`,
                    color: detectStep > i ? TEAL : 'rgba(255,255,255,0.25)',
                    transition: 'all 0.4s',
                  }}>
                    {detectStep > i ? '✓ ' : ''}{sig}
                  </span>
                ))}
              </div>

              {/* Threat level indicator */}
              {detectStep >= 3 && (
                <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <AlertTriangle style={{ width: 13, height: 13, color: RED }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: RED }}>Trigger Confirmed</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{selected.triggerName}</div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <div>
                      <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: selected.urgencyColor }}>{selected.stakes}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{selected.stakesLabel}</div>
                    </div>
                    <div>
                      <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: TEAL }}>{selected.window}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{selected.windowLabel}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── PHASE: READY ─────────────────────────────────────────────────────────
  if (phase === 'ready' && selected) {
    const Icon = selected.icon;
    return (
      <div style={{ minHeight: '100vh', background: NAVY_BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.09) 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', bottom: '-5%', left: '50%', transform: 'translateX(-50%)', width: 1000, height: 600, borderRadius: '50% 50% 0 0', background: 'radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 68%)' }} />

        <div className="relative z-10 w-full max-w-3xl">
          {/* TRIGGER CONFIRMED */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', padding: '6px 18px', marginBottom: 24 }}>
              <AlertTriangle style={{ width: 12, height: 12, color: RED }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: RED }}>Executive Trigger Confirmed — Protocol Ready</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, justifyContent: 'center' }}>
              <Icon style={{ width: 20, height: 20, color: selected.urgencyColor }} />
              <h2 style={{ ...CG, fontSize: 'clamp(18px,2.8vw,28px)', fontWeight: 600, color: '#fff' }}>
                {selected.triggerName}
              </h2>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 520, lineHeight: 1.6 }}>
              {selected.headline} Your execution protocol is staged and ready.
              The <strong style={{ color: GOLD }}>12-minute clock</strong> starts when you activate.
            </p>
          </div>

          {/* Stakes + What Happens — side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            {/* What's at stake */}
            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderTop: `3px solid ${selected.urgencyColor}`, padding: '20px 22px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: selected.urgencyColor, marginBottom: 16 }}>What's at Stake</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selected.stakeMetrics.map(m => (
                  <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
                    <span style={{ ...CG, fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What happens next */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderTop: `3px solid ${TEAL}`, padding: '20px 22px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: 16 }}>What Happens Next</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selected.whatHappensNext.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle2 style={{ width: 14, height: 14, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activate */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleActivate}
              disabled={playbookList.length === 0}
              style={{
                background: playbookList.length === 0 ? 'rgba(201,168,76,0.35)' : GOLD,
                color: NAVY_INK, border: 'none', padding: '18px 56px',
                fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: playbookList.length === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 12, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (playbookList.length > 0) { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Zap style={{ width: 18, height: 18 }} />
              {playbookList.length === 0 ? 'Staging Protocol...' : 'Activate Execution Protocol'}
              <ArrowRight style={{ width: 18, height: 18 }} />
            </button>

            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 16 }}>
              Simulation only · No real data affected · No login required
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
