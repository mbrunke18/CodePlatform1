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
  triggerName: string;
  playbookKeyword: string;
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
    triggerName: 'Competitive Acquisition Threat — Priority Response Required',
    playbookKeyword: 'competitive',
  },
  {
    id: 'regulatory',
    icon: Shield,
    urgency: 'REGULATORY CRISIS DETECTED',
    urgencyColor: '#EF4444',
    headline: 'New federal regulation threatens $180M in annual revenue.',
    subline: '90-day compliance window. Legal exposure escalating. Regulatory response required now.',
    domain: 'Regulatory & Compliance',
    detectSignals: ['Regulatory Compliance', 'Legal Exposure', 'Financial Risk', 'Government Affairs'],
    triggerName: 'Regulatory Compliance Crisis — Mandatory Executive Response',
    playbookKeyword: 'regulatory',
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
    triggerName: 'C-Suite Leadership Gap — Immediate Succession Protocol',
    playbookKeyword: 'leadership',
  },
];

const DETECT_STEPS = [
  { label: 'Scanning 248+ data points across 20 signal categories', duration: 1800 },
  { label: 'Signal threshold breach confirmed', duration: 1400 },
  { label: 'Cross-referencing 221 executive trigger conditions', duration: 1600 },
  { label: 'TRIGGER DETECTED', duration: 1200, highlight: true },
  { label: 'Matching against 170 strategic playbooks', duration: 1400 },
  { label: 'AI Commander Brief generating', duration: 1600 },
  { label: 'Execution protocol ready', duration: 1000, highlight: true },
];

type Phase = 'select' | 'detect' | 'ready';

export default function GuidedStart() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>('select');
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [detectStep, setDetectStep] = useState(0);
  const [playbookId, setPlaybookId] = useState<string | null>(null);

  const { data: playbookResponse } = useQuery<any>({
    queryKey: ['/api/playbooks'],
    queryFn: () => fetch('/api/playbooks?limit=50', { credentials: 'include' }).then(r => r.ok ? r.json() : { data: [] }),
  });

  const playbookList: any[] = Array.isArray(playbookResponse?.data)
    ? playbookResponse.data
    : Array.isArray(playbookResponse) ? playbookResponse : [];

  function findPlaybook(scenario: Scenario): string | null {
    if (playbookList.length === 0) return null;
    const byKeyword = playbookList.find(p =>
      p.name?.toLowerCase().includes(scenario.playbookKeyword) ||
      p.domain?.toLowerCase().includes(scenario.domain.toLowerCase().split(' ')[0])
    );
    return byKeyword?.id || playbookList[0]?.id || null;
  }

  function handleScenarioSelect(scenario: Scenario) {
    setSelected(scenario);
    setPhase('detect');
    setDetectStep(0);
    const pid = findPlaybook(scenario);
    setPlaybookId(pid);
  }

  useEffect(() => {
    if (selected && !playbookId && playbookList) {
      setPlaybookId(findPlaybook(selected));
    }
  }, [playbookList, selected]);

  useEffect(() => {
    if (phase !== 'detect' || !selected) return;
    let step = 0;
    function advance() {
      step++;
      setDetectStep(step);
      if (step < DETECT_STEPS.length - 1) {
        const next = DETECT_STEPS[step];
        setTimeout(advance, next.duration);
      } else {
        setTimeout(() => setPhase('ready'), 1200);
      }
    }
    const timer = setTimeout(advance, DETECT_STEPS[0].duration);
    return () => clearTimeout(timer);
  }, [phase, selected]);

  function handleActivate() {
    if (!selected) return;
    let pid = playbookId;
    if (!pid) {
      pid = findPlaybook(selected);
    }
    if (!pid) {
      const list = Array.isArray(playbookList) ? playbookList : [];
      pid = list[0]?.id || null;
    }
    if (pid) {
      setLocation(`/playbook-activation/manual/${pid}`);
    }
  }

  if (phase === 'select') {
    return (
      <div style={{ minHeight: '100vh', background: NAVY_BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.09) 1px,transparent 1px)`, backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        {/* Orb */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,138,110,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="relative z-10 w-full max-w-5xl">
          {/* Logo / back link */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>VaughnMartin · Execution OS</span>
            </div>
            <h1 style={{ ...CG, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              One trigger. One playbook.<br />
              <em style={{ fontStyle: 'italic', color: GOLD }}>Twelve minutes.</em>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 520, margin: '0 auto' }}>
              Pick a scenario below and experience the full IDEA execution cycle live — no login required.
            </p>
          </div>

          {/* Scenario cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
            {SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderTop: `3px solid ${scenario.urgencyColor}`,
                    padding: '28px 24px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = `${scenario.urgencyColor}`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderTopColor = scenario.urgencyColor; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ padding: '10px', background: `${scenario.urgencyColor}18`, borderRadius: 2 }}>
                      <Icon style={{ width: 22, height: 22, color: scenario.urgencyColor }} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: scenario.urgencyColor, paddingTop: 2 }}>
                      {scenario.urgency}
                    </span>
                  </div>
                  <div>
                    <p style={{ ...CG, fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.35, marginBottom: 8 }}>
                      {scenario.headline}
                    </p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                      {scenario.subline}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                      {scenario.domain}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: scenario.urgencyColor }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Execute scenario</span>
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Trust note */}
          <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Lock style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              No login required · Full simulation · Results in under 12 minutes
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'detect' && selected) {
    const Icon = selected.icon;
    return (
      <div style={{ minHeight: '100vh', background: MID_NAVY, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.07) 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />

        <div className="relative z-10 w-full max-w-xl" style={{ textAlign: 'center' }}>
          {/* Phase label */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(43,138,110,0.15)', border: '1px solid rgba(43,138,110,0.3)', padding: '6px 16px', marginBottom: 40 }}>
            <Radio style={{ width: 12, height: 12, color: TEAL }} className="animate-pulse" />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>DETECT Phase Active</span>
          </div>

          {/* Scenario reminder */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 48 }}>
            <Icon style={{ width: 18, height: 18, color: selected.urgencyColor }} />
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 400 }}>{selected.headline}</span>
          </div>

          {/* Detection steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48, textAlign: 'left' }}>
            {DETECT_STEPS.map((step, i) => {
              const isComplete = i < detectStep;
              const isActive = i === detectStep;
              const isPending = i > detectStep;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: isPending ? 0.25 : 1, transition: 'opacity 0.4s' }}>
                  <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isComplete ? (
                      <CheckCircle2 style={{ width: 18, height: 18, color: TEAL }} />
                    ) : isActive ? (
                      <Activity style={{ width: 16, height: 16, color: GOLD }} className="animate-pulse" />
                    ) : (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: step.highlight ? 15 : 13,
                    fontWeight: step.highlight ? 700 : 400,
                    color: step.highlight && (isComplete || isActive) ? GOLD : isComplete ? 'rgba(255,255,255,0.7)' : isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                    letterSpacing: step.highlight ? '0.08em' : 'normal',
                    textTransform: step.highlight ? 'uppercase' as const : 'none' as const,
                    transition: 'color 0.4s',
                  }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Signal categories scanning */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {selected.detectSignals.map((sig, i) => (
              <span key={sig} style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '4px 10px',
                background: detectStep > i ? 'rgba(43,138,110,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${detectStep > i ? 'rgba(43,138,110,0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: detectStep > i ? TEAL : 'rgba(255,255,255,0.3)',
                transition: 'all 0.5s',
              }}>
                {sig}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'ready' && selected) {
    const Icon = selected.icon;
    return (
      <div style={{ minHeight: '100vh', background: NAVY_BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.09) 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 900, height: 500, borderRadius: '50% 50% 0 0', background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)' }} />

        <div className="relative z-10 w-full max-w-2xl" style={{ textAlign: 'center' }}>
          {/* TRIGGER CONFIRMED badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', padding: '6px 18px', marginBottom: 32 }}>
            <AlertTriangle style={{ width: 12, height: 12, color: '#EF4444' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EF4444' }}>Executive Trigger Confirmed</span>
          </div>

          {/* Trigger name */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <Icon style={{ width: 22, height: 22, color: selected.urgencyColor }} />
            <h2 style={{ ...CG, fontSize: 'clamp(20px,3vw,30px)', fontWeight: 600, color: '#fff' }}>
              {selected.triggerName}
            </h2>
          </div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto 40px' }}>
            {selected.headline} Your execution protocol is ready. The 12-minute clock starts when you activate.
          </p>

          {/* What happens next */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px 28px', marginBottom: 36, textAlign: 'left' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>What happens next</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'AI generates a Commander Brief specific to this scenario',
                'Domain-specific tasks auto-populate and begin executing',
                '12-minute countdown timer tracks your response velocity',
                'Post-execution debrief shows your performance score and estimated ROI',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <CheckCircle2 style={{ width: 16, height: 16, color: TEAL, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activate button */}
          <button
            onClick={handleActivate}
            disabled={playbookList.length === 0}
            style={{
              background: playbookList.length === 0 ? 'rgba(201,168,76,0.4)' : GOLD,
              color: NAVY_INK, border: 'none', padding: '16px 48px',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: playbookList.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { if (playbookList.length > 0) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Zap style={{ width: 16, height: 16 }} />
            {playbookList.length === 0 ? 'Preparing Protocol...' : 'Activate Execution Protocol'}
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 20 }}>
            Simulation only · No real data affected · No login required
          </p>
        </div>
      </div>
    );
  }

  return null;
}
