import { useState, useEffect, useRef, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { ArrowRight, Clock, CheckCircle, XCircle, TrendingDown, DollarSign, Shield } from 'lucide-react';

const NAVY   = "#0A0F2E";
const NAVY2  = "#0d1322";
const GOLD   = "#C9A84C";
const TEAL   = "#2B8A6E";
const IVORY  = "#F0EDE4";
const BORDER = "#E8E4DC";
const MUTED  = "#6B7280";
const RED    = "#EF4444";
const DARK_RED = "#1a0a0a";
const DARK_TEAL = "#071a13";

const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

function fmtD(n: number) { return '$' + Math.round(n).toLocaleString(); }
function fmtM(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
function fmtB(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
  return fmtM(n);
}
function daysLabel(days: number): string {
  if (days < 1 / 24) return 'moments ago';
  if (days < 1)      return 'earlier today';
  if (days < 2)      return '1 day ago';
  return `${Math.floor(days)} days ago`;
}

// ─── Scenario data ────────────────────────────────────────────────────────────
interface TimelineStep { time: string; event: string; cost?: string; }
interface Scenario {
  id: string;
  name: string;
  protocol: string;
  domain: string;
  situationCost: string;
  mobilizationCost: number;     // your org's coordination overhead per event
  without: TimelineStep[];
  with: TimelineStep[];
  verdict: string;
}

const scenarios: Scenario[] = [
  {
    id: 'ransomware',
    name: 'Ransomware Detection',
    protocol: 'Protocol #47',
    domain: 'RISK & RESILIENCE',
    situationCost: '$4.5M avg direct cost',
    mobilizationCost: 504000,
    without: [
      { time: '3:17 AM', event: 'Log alert fires. On-call engineer sees it.' },
      { time: '6:00 AM', event: 'CISO finally reached — 3 hours of uncoordinated activity.' },
      { time: 'Day 1',   event: 'Legal notified. Outside counsel engaged at emergency rates.', cost: '+$40K' },
      { time: 'Day 2',   event: 'Board informed — separately, by different people, with different facts.', cost: '+$85K' },
      { time: 'Day 7',   event: 'Team finally aligned on customer notification language.', cost: '+$210K' },
      { time: 'Day 11',  event: 'Public statement released. Narrative already set without you.', cost: '+$315K' },
      { time: 'Day 30',  event: 'Full response coordinated. $504K in mobilization cost. Separate from the breach itself.', cost: '+$504K total' },
    ],
    with: [
      { time: 'Minute 0',  event: 'Signal detected automatically — CISA KEV feed, ransomware indicators.' },
      { time: 'Minute 2',  event: 'Protocol #47 staged — 22 tasks, named owners, communication templates pre-loaded.' },
      { time: 'Minute 5',  event: 'CISO, Legal, Board, IR firm — all notified simultaneously with the same brief.' },
      { time: 'Minute 8',  event: 'Outside counsel already briefed on your protocols. No emergency rate negotiation.' },
      { time: 'Minute 12', event: 'Executive authorizes. Full coordinated response already in motion.' },
      { time: 'Hour 2',    event: 'Customer notification decision already made. Narrative owned from the start.' },
    ],
    verdict: 'The breach cost is fixed. The mobilization cost — $504K — is entirely preventable.',
  },
  {
    id: 'activist',
    name: 'Activist Investor Filing',
    protocol: 'Protocol #31',
    domain: 'GROWTH & POSITIONING',
    situationCost: '$3.2M avg direct cost',
    mobilizationCost: 378000,
    without: [
      { time: 'Day 0',   event: '13D filing hits SEC EDGAR at 5:52 PM Friday.' },
      { time: 'Day 2',   event: 'IR team discovers it Monday morning. Two days without a response posture.', cost: '+$25K' },
      { time: 'Day 5',   event: 'CEO briefed. Three executives have already spoken to media separately.', cost: '+$60K' },
      { time: 'Day 7',   event: 'Emergency board meeting called. No unified brief exists.', cost: '+$140K' },
      { time: 'Day 14',  event: 'Response strategy finally drafted. Investor relations fractured.', cost: '+$250K' },
      { time: 'Day 21',  event: 'Public response issued. Activist has had 3 weeks to set the narrative.', cost: '+$378K total' },
    ],
    with: [
      { time: 'Minute 0',  event: 'SEC EDGAR 13D filing detected automatically — continuous monitoring.' },
      { time: 'Minute 2',  event: 'Protocol #31 staged — board brief, IR response, legal defense, proxy defense pre-loaded.' },
      { time: 'Minute 6',  event: 'CEO, Board Chair, General Counsel, IR — all receive the same brief simultaneously.' },
      { time: 'Minute 10', event: 'Proxy defense counsel already briefed. Activist investor playbook matched.' },
      { time: 'Minute 12', event: 'Executive authorizes. Coordinated response owns the narrative from hour one.' },
    ],
    verdict: 'The activist had a 3-week head start without Readiness OS. That gap is the cost.',
  },
  {
    id: 'regulatory',
    name: 'Regulatory Enforcement Inquiry',
    protocol: 'Protocol #78',
    domain: 'RISK & RESILIENCE',
    situationCost: '$8M–$60M exposure',
    mobilizationCost: 630000,
    without: [
      { time: 'Day 0',   event: 'Enforcement notice arrives without warning.' },
      { time: 'Day 1',   event: 'General counsel calls outside counsel. Outside counsel says say nothing.', cost: '+$35K' },
      { time: 'Day 3',   event: 'Every stakeholder goes quiet separately. No unified position.', cost: '+$90K' },
      { time: 'Day 8',   event: 'Response strategy still being debated. Regulatory clock running.', cost: '+$190K' },
      { time: 'Day 14',  event: 'Board finally aligned. Story already written by reporters.', cost: '+$380K' },
      { time: 'Day 30',  event: 'Full response coordinated. $630K mobilization cost. Regulatory exposure unaffected.', cost: '+$630K total' },
    ],
    with: [
      { time: 'Minute 0',  event: 'Enforcement notice pattern detected — Federal Register and regulatory feeds.' },
      { time: 'Minute 2',  event: 'Protocol #78 staged — disclosure requirements mapped, response timelines pre-built.' },
      { time: 'Minute 5',  event: 'General Counsel, CEO, Board, outside counsel — unified brief, one voice.' },
      { time: 'Minute 9',  event: 'Regulatory timeline obligations already defined. No guessing under pressure.' },
      { time: 'Minute 12', event: 'Executive authorizes. Coordinated, legally sound response in motion from hour one.' },
    ],
    verdict: 'Regulatory exposure is determined by the facts. The mobilization cost is determined by your preparation.',
  },
  {
    id: 'cfo',
    name: 'CFO Sudden Departure',
    protocol: 'Protocol #15',
    domain: 'RISK & RESILIENCE',
    situationCost: '$10M–$45M investor impact',
    mobilizationCost: 441000,
    without: [
      { time: 'Monday 8 AM', event: 'CFO resignation letter on the CEO desk. No succession brief exists.' },
      { time: 'Hour 2',      event: 'Legal, IR, HR, the Board each get a separate phone call. No unified narrative.', cost: '+$30K' },
      { time: 'Day 1',       event: 'Investors call before you have a statement. Narrative fractures.', cost: '+$85K' },
      { time: 'Day 3',       event: 'Board convenes emergency meeting. Interim CFO question unresolved.', cost: '+$160K' },
      { time: 'Day 7',       event: 'Media picks up contradictory statements from different executives.', cost: '+$280K' },
      { time: 'Day 21',      event: 'Unified response finally in place. Stock down. $441K mobilization cost.', cost: '+$441K total' },
    ],
    with: [
      { time: 'Minute 0',  event: 'Signal pattern detected — executive departure indicators and filing triggers.' },
      { time: 'Minute 2',  event: 'Protocol #15 staged — succession brief, IR statement, board notification, search brief pre-loaded.' },
      { time: 'Minute 5',  event: 'Board, Legal, HR, IR — all receive the same brief. One narrative from the start.' },
      { time: 'Minute 9',  event: 'Investor statement drafted and staged. No improvisation under pressure.' },
      { time: 'Minute 12', event: 'Executive authorizes. Coordinated response in motion before investors call.' },
    ],
    verdict: 'You cannot prevent a CFO from resigning. You can prevent the mobilization chaos that follows.',
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Collapse',
    protocol: 'Protocol #62',
    domain: 'RISK & RESILIENCE',
    situationCost: '15–30% of revenue at risk',
    mobilizationCost: 567000,
    without: [
      { time: 'Day 0',   event: 'Primary supplier announces force majeure. Operations team notified.' },
      { time: 'Day 2',   event: 'CEO learns from a board member who heard from a customer. No internal brief.', cost: '+$40K' },
      { time: 'Day 4',   event: 'Procurement scrambles for alternatives with no pre-vetted supplier list.', cost: '+$120K' },
      { time: 'Day 7',   event: 'Customers start calling. Sales team has no approved talking points.', cost: '+$220K' },
      { time: 'Day 14',  event: 'Alternative suppliers engaged at premium rates — negotiations from zero.', cost: '+$380K' },
      { time: 'Day 30',  event: 'Supply chain stabilized. $567K mobilization cost. Revenue impact ongoing.', cost: '+$567K total' },
    ],
    with: [
      { time: 'Minute 0',  event: 'Force majeure signal detected — trade feeds and supplier monitoring.' },
      { time: 'Minute 2',  event: 'Protocol #62 staged — pre-vetted alternative suppliers, customer comms, procurement brief.' },
      { time: 'Minute 5',  event: 'CEO, Procurement, Sales, Customer Success — briefed simultaneously.' },
      { time: 'Minute 9',  event: 'Alternative suppliers already on retainer agreement. No premium negotiation.' },
      { time: 'Minute 12', event: 'Executive authorizes. Customer comms, procurement pivot, board brief — all in motion.' },
    ],
    verdict: 'The supply chain event is the trigger. The 30-day response is the cost you chose not to prevent.',
  },
  {
    id: 'brand',
    name: 'Brand Crisis — Viral Event',
    protocol: 'Protocol #89',
    domain: 'GROWTH & POSITIONING',
    situationCost: '$3M–$25M brand and revenue impact',
    mobilizationCost: 315000,
    without: [
      { time: '7:43 AM',  event: 'Post crosses 200,000 shares. PR lead sees it on personal feed.' },
      { time: '9:00 AM',  event: 'Legal finally reachable. CEO is on a flight. No response posture exists.', cost: '+$20K' },
      { time: '10:30 AM', event: 'Three outlets pick up the story. Narrative set without your voice.', cost: '+$65K' },
      { time: 'Noon',     event: 'Competing statements from PR and Legal create second story.', cost: '+$130K' },
      { time: 'Day 2',    event: 'Approved response finally issued. 26 hours too late.', cost: '+$210K' },
      { time: 'Day 7',    event: 'Damage assessment complete. $315K mobilization cost. Brand impact ongoing.', cost: '+$315K total' },
    ],
    with: [
      { time: 'Minute 0',  event: 'Velocity signal detected — news velocity feed, 200K share threshold crossed.' },
      { time: 'Minute 2',  event: 'Protocol #89 staged — approved holding statement, legal review brief, platform strategy.' },
      { time: 'Minute 5',  event: 'PR, Legal, CEO (mobile brief), Social — all on the same statement simultaneously.' },
      { time: 'Minute 9',  event: 'Response approved. Narrative owned before the third outlet picks it up.' },
      { time: 'Minute 12', event: 'Executive authorizes. Coordinated response live within the first hour.' },
    ],
    verdict: 'The first two hours of a brand crisis determine the narrative. Readiness OS owns those two hours.',
  },
];

// ─── Default cost profile (mid-market enterprise) ────────────────────────────
const EXEC = 6, RATE = 500, TRIGGERS = 8, DAYS = 21;
const ANNUAL_TAX    = EXEC * RATE * (DAYS * 8) * TRIGGERS;  // ~$4.03M
const COST_PER_SEC  = ANNUAL_TAX / (365 * 24 * 3600);
const READINESS_COST = 150_000;
const NET_SAVING     = ANNUAL_TAX - READINESS_COST;
const DAILY_COST     = ANNUAL_TAX / 365;
const COST_PER_EVENT = ANNUAL_TAX / TRIGGERS;

// ─── Industry baseline (Fortune 1000 + mid-market) ───────────────────────────
const INDUSTRY_ANNUAL  = 200_000_000_000;
const INDUSTRY_PER_SEC = INDUSTRY_ANNUAL / (365 * 24 * 3600);
const YEAR_START_MS    = new Date(new Date().getFullYear(), 0, 1).getTime();
const FIRST_VISIT_KEY  = 'vm_first_visit';

export default function TheCostOfWaiting() {
  const [, nav] = useLocation();
  const [selected, setSelected] = useState(0);
  const [secs, setSecs] = useState(0);
  const [nowMs, setNowMs] = useState(Date.now());
  const [firstVisitMs, setFirstVisitMs] = useState<number | null>(null);
  const t0 = useRef(Date.now());

  useEffect(() => {
    updatePageMetadata({
      title: 'The Cost of Not Being Ready — VaughnMartin Readiness OS',
      description: 'Every moment your organization is not a Readiness OS customer, mobilization costs accumulate. See the live cost, pick a situation, watch the two paths diverge.',
      ogTitle: 'The Cost of Waiting — Readiness OS',
      ogDescription: 'Live cost of your mobilization gap. Side-by-side execution — with and without Readiness OS. The math ends the conversation.',
    });
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FIRST_VISIT_KEY);
      if (stored) {
        setFirstVisitMs(parseInt(stored, 10));
      } else {
        const ts = Date.now();
        localStorage.setItem(FIRST_VISIT_KEY, String(ts));
        setFirstVisitMs(ts);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const now = Date.now();
      setSecs(Math.round((now - t0.current) / 1000));
      setNowMs(now);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const liveCost = Math.round(COST_PER_SEC * secs);
  const mins = Math.floor(secs / 60);
  const rem  = secs % 60;
  const sc   = scenarios[selected];

  const industryYTD = Math.round(INDUSTRY_PER_SEC * (nowMs - YEAR_START_MS) / 1000);
  const daysSinceFirst = firstVisitMs ? (nowMs - firstVisitMs) / (1000 * 60 * 60 * 24) : 0;
  const isReturnVisitor = daysSinceFirst > 0.04;
  const personalCumulativeCost = Math.round(DAILY_COST * daysSinceFirst);
  const thirtyDayBenchmark = Math.round(DAILY_COST * 30);

  return (
    <PageLayout>

      {/* ── HERO ── */}
      <section style={{ background: NAVY, padding: '88px 0 0', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px', position: 'relative' }}>
          <p style={{ ...BC, color: RED, fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: RED, boxShadow: `0 0 8px ${RED}`, animation: 'pulse 1.5s infinite' }} />
            The Cost of Not Being Ready
          </p>
          <h1 style={{ ...CG, color: '#fff', fontSize: 'clamp(38px,5vw,64px)', fontWeight: 600, lineHeight: 1.08, marginBottom: 20, maxWidth: 860 }}>
            Every moment you're not a customer,<br />
            <em style={{ color: GOLD }}>your organization is paying for it.</em>
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: 17, lineHeight: 1.75, maxWidth: 620, marginBottom: 56 }}>
            Not hypothetically — in measurable, real-time mobilization cost. Below: what it's
            costing right now, what you're losing per situation, and what one year of membership actually buys.
          </p>
        </div>

        {/* ── INDUSTRY BASELINE — full width ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.45)', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <p style={{ ...BC, color: 'rgba(239,68,68,0.6)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 6 }}>
              Since January 1, {new Date().getFullYear()} — enterprise market without Readiness OS
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: 700, color: RED, fontFamily: 'monospace', lineHeight: 1 }}>
                {fmtB(industryYTD)}
              </span>
              <span style={{ color: 'rgba(239,68,68,0.45)', fontSize: 13 }}>and climbing every second</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, marginTop: 5 }}>
              Estimated avoidable mobilization cost across Fortune 1000 + mid-market enterprises this year alone.
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ ...BC, color: 'rgba(239,68,68,0.45)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>Industry rate</p>
            <p style={{ color: RED, fontFamily: 'monospace', fontSize: 20, fontWeight: 700, margin: 0 }}>{fmtM(Math.round(INDUSTRY_PER_SEC * 3600))}/hr</p>
            <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10, marginTop: 3 }}>across all enterprises · continuously</p>
          </div>
        </div>

        {/* ── DUAL PANELS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

          {/* Without — personal cumulative on return visits, session + benchmark on first visit */}
          <div style={{ background: DARK_RED, padding: '40px 48px 44px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            {isReturnVisitor ? (
              <>
                <p style={{ ...BC, color: 'rgba(239,68,68,0.7)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Your organization's accumulated gap
                </p>
                <p style={{ color: 'rgba(239,68,68,0.45)', fontSize: 12, marginBottom: 14 }}>
                  Since you first discovered Readiness OS —{' '}
                  <strong style={{ color: 'rgba(239,68,68,0.75)' }}>{daysLabel(daysSinceFirst)}</strong>
                </p>
                <div style={{ fontSize: 'clamp(36px,4.5vw,58px)', fontWeight: 700, color: RED, fontFamily: 'monospace', lineHeight: 1, marginBottom: 10 }}>
                  {fmtM(personalCumulativeCost)}
                </div>
                <p style={{ color: 'rgba(239,68,68,0.55)', fontSize: 13, lineHeight: 1.5 }}>
                  Estimated mobilization cost accrued since you first became aware of this problem.<br />
                  <span style={{ fontSize: 11 }}>{fmtM(Math.round(DAILY_COST))}/day · {fmtM(Math.round(ANNUAL_TAX))}/year — default enterprise profile</span>
                </p>
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ ...BC, color: 'rgba(239,68,68,0.4)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>On this page today</p>
                  <p style={{ color: 'rgba(239,68,68,0.65)', fontFamily: 'monospace', fontSize: 18, fontWeight: 700, margin: 0 }}>{fmtD(liveCost)}</p>
                </div>
              </>
            ) : (
              <>
                <p style={{ ...BC, color: 'rgba(239,68,68,0.7)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14 }}>
                  Without Readiness OS — right now
                </p>
                <div style={{ fontSize: 'clamp(36px,4.5vw,58px)', fontWeight: 700, color: RED, fontFamily: 'monospace', lineHeight: 1, marginBottom: 10 }}>
                  {fmtD(liveCost)}
                </div>
                <p style={{ color: 'rgba(239,68,68,0.55)', fontSize: 13, lineHeight: 1.5 }}>
                  {mins > 0 ? `${mins}m ${rem}s` : `${rem}s`} of mobilization cost since you opened this page.<br />
                  <span style={{ fontSize: 11 }}>{fmtM(Math.round(DAILY_COST))}/day · {fmtM(Math.round(ANNUAL_TAX))}/year — default enterprise profile</span>
                </p>
                <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '0.15rem' }}>
                  <p style={{ ...BC, color: 'rgba(239,68,68,0.6)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 6px' }}>30-Day Inaction Benchmark</p>
                  <p style={{ color: RED, fontFamily: 'monospace', fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>{fmtM(thirtyDayBenchmark)}</p>
                  <p style={{ color: 'rgba(239,68,68,0.4)', fontSize: 11, margin: 0 }}>If you've been aware of this gap for 30 days, that's already accrued.</p>
                </div>
              </>
            )}
          </div>

          {/* With */}
          <div style={{ background: DARK_TEAL, padding: '40px 48px 44px' }}>
            <p style={{ ...BC, color: 'rgba(43,138,110,0.8)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14 }}>
              With Readiness OS — your mobilization cost
            </p>
            <div style={{ fontSize: 'clamp(36px,4.5vw,58px)', fontWeight: 700, color: TEAL, fontFamily: 'monospace', lineHeight: 1, marginBottom: 10 }}>
              $0
            </div>
            <p style={{ color: 'rgba(43,138,110,0.6)', fontSize: 13, lineHeight: 1.5 }}>
              Mobilization cost is zero. Pre-staged protocols, pre-authorized budgets, pre-assembled teams.<br />
              <span style={{ fontSize: 11 }}>$150K/year flat · Break-even at first activation · Savings start immediately</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── SCENARIO PICKER ── */}
      <section style={{ background: NAVY2, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 0 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 12 }}>Pick a Situation</p>
            <h2 style={{ ...CG, color: '#fff', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 600, lineHeight: 1.15, marginBottom: 10 }}>
              Watch the two paths diverge — in real time.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 520, margin: '0 auto' }}>
              Same situation. Two organizations. The only variable: whether the response was pre-staged.
            </p>
          </div>

          {/* Scenario pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
            {scenarios.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSelected(i)}
                style={{
                  ...BC,
                  padding: '10px 18px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: selected === i ? `1.5px solid ${GOLD}` : '1.5px solid rgba(255,255,255,0.12)',
                  background: selected === i ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: selected === i ? GOLD : 'rgba(255,255,255,0.55)',
                  borderRadius: '0.15rem',
                  transition: 'all 0.15s',
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Side-by-side timelines */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: 'rgba(255,255,255,0.05)', borderRadius: '0.15rem', overflow: 'hidden' }}>

            {/* WITHOUT */}
            <div style={{ background: 'rgba(239,68,68,0.04)', padding: '32px 28px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <XCircle style={{ width: 18, height: 18, color: RED, flexShrink: 0 }} />
                <div>
                  <p style={{ ...BC, color: RED, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Without Readiness OS</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0' }}>{sc.situationCost} exposure · +{fmtM(sc.mobilizationCost)} mobilization cost</p>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 1, background: 'rgba(239,68,68,0.2)' }} />
                {sc.without.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < sc.without.length - 1 ? 20 : 0, position: 'relative' }}>
                    <div style={{ width: 13, height: 13, borderRadius: '50%', background: i === sc.without.length - 1 ? RED : 'rgba(239,68,68,0.3)', border: `1.5px solid ${RED}`, flexShrink: 0, marginTop: 3, zIndex: 1 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ ...BC, color: RED, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 3px' }}>{step.time}</p>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.55, margin: 0 }}>{step.event}</p>
                      {step.cost && (
                        <p style={{ ...BC, color: 'rgba(239,68,68,0.8)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', margin: '4px 0 0' }}>{step.cost}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WITH */}
            <div style={{ background: 'rgba(43,138,110,0.04)', padding: '32px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <CheckCircle style={{ width: 18, height: 18, color: TEAL, flexShrink: 0 }} />
                <div>
                  <p style={{ ...BC, color: TEAL, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>With Readiness OS · {sc.protocol}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0' }}>Mobilization cost: $0 · {sc.domain}</p>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 1, background: 'rgba(43,138,110,0.25)' }} />
                {sc.with.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < sc.with.length - 1 ? 20 : 0, position: 'relative' }}>
                    <div style={{ width: 13, height: 13, borderRadius: '50%', background: i === sc.with.length - 1 ? TEAL : 'rgba(43,138,110,0.35)', border: `1.5px solid ${TEAL}`, flexShrink: 0, marginTop: 3, zIndex: 1 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ ...BC, color: TEAL, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 3px' }}>{step.time}</p>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.55, margin: 0 }}>{step.event}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verdict */}
              <div style={{ marginTop: 24, padding: '14px 16px', background: 'rgba(43,138,110,0.12)', borderLeft: `3px solid ${TEAL}` }}>
                <p style={{ color: TEAL, fontSize: 13, lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>{sc.verdict}</p>
              </div>
            </div>
          </div>

          {/* Cost gap bar */}
          <div style={{ marginTop: 2, padding: '18px 28px', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <p style={{ ...BC, color: 'rgba(239,68,68,0.7)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 2px' }}>Without</p>
                <p style={{ color: RED, fontFamily: 'monospace', fontSize: 18, fontWeight: 700, margin: 0 }}>{fmtM(sc.mobilizationCost)}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: '2px 0 0' }}>mobilization cost per event</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.15)' }} />
                <TrendingDown style={{ width: 16, height: 16, color: GOLD, margin: '0 8px' }} />
                <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              </div>
              <div>
                <p style={{ ...BC, color: 'rgba(43,138,110,0.7)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 2px' }}>With Readiness OS</p>
                <p style={{ color: TEAL, fontFamily: 'monospace', fontSize: 18, fontWeight: 700, margin: 0 }}>$0</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: '2px 0 0' }}>mobilization cost per event</p>
              </div>
              <div>
                <p style={{ ...BC, color: 'rgba(201,168,76,0.7)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 2px' }}>You Keep</p>
                <p style={{ color: GOLD, fontFamily: 'monospace', fontSize: 18, fontWeight: 700, margin: 0 }}>{fmtM(sc.mobilizationCost)}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: '2px 0 0' }}>per situation, every time</p>
              </div>
            </div>
            <p style={{ ...BC, color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', maxWidth: 260, lineHeight: 1.4 }}>
              At {TRIGGERS} situations/year — that's {fmtM(sc.mobilizationCost * TRIGGERS)} in avoidable cost
            </p>
          </div>
        </div>
      </section>

      {/* ── THE MEMBERSHIP MATH ── */}
      <section style={{ background: IVORY, borderTop: `3px solid ${GOLD}`, padding: '80px 0 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 12 }}>The Membership Math</p>
            <h2 style={{ ...CG, color: NAVY, fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 600, lineHeight: 1.15 }}>
              One situation pays for years of membership.
            </h2>
          </div>

          {/* Main comparison grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: BORDER, marginBottom: 32 }}>
            {[
              { label: 'Cost per situation', without: fmtM(COST_PER_EVENT), with: '$0', sub: 'mobilization cost per event', flip: true },
              { label: 'Annual mobilization tax', without: fmtM(ANNUAL_TAX), with: '$150K', sub: 'Readiness OS Core, flat annual', flip: true },
              { label: 'Net annual saving', without: '—', with: fmtM(NET_SAVING), sub: 'what you keep every year', flip: false },
            ].map((row) => (
              <div key={row.label} style={{ background: '#fff', padding: '28px 24px' }}>
                <p style={{ ...BC, color: MUTED, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>{row.label}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ textAlign: 'center', padding: '16px 12px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                    <p style={{ ...BC, color: 'rgba(239,68,68,0.6)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 6px' }}>Without</p>
                    <p style={{ color: row.flip ? RED : MUTED, fontFamily: 'monospace', fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1 }}>{row.without}</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px 12px', background: 'rgba(43,138,110,0.04)', border: '1px solid rgba(43,138,110,0.15)' }}>
                    <p style={{ ...BC, color: 'rgba(43,138,110,0.7)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 6px' }}>With</p>
                    <p style={{ color: TEAL, fontFamily: 'monospace', fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1 }}>{row.with}</p>
                  </div>
                </div>
                <p style={{ color: MUTED, fontSize: 11, margin: '12px 0 0', textAlign: 'center' }}>{row.sub}</p>
              </div>
            ))}
          </div>

          {/* Proof statements */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {[
              { icon: Clock,       stat: '1st',          label: 'First activation',    sub: 'break-even point — one situation pays for the full year' },
              { icon: DollarSign,  stat: `${(COST_PER_EVENT / 150000).toFixed(1)}×`,  label: 'return on first event', sub: `at ${fmtM(COST_PER_EVENT)} avg mobilization cost per situation` },
              { icon: Shield,      stat: '30 days',      label: 'compressed to 12 min',sub: '3,600× execution head start — every time a situation fires' },
              { icon: TrendingDown,stat: fmtM(NET_SAVING),label: 'net annual saving',  sub: `at ${TRIGGERS} situations/year vs. ${fmtM(ANNUAL_TAX)} unmanaged cost` },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} style={{ padding: '24px 20px', background: '#fff', border: `1px solid ${BORDER}`, textAlign: 'center' }}>
                  <Icon style={{ width: 20, height: 20, color: GOLD, margin: '0 auto 12px' }} />
                  <p style={{ ...BC, color: NAVY, fontSize: 26, fontWeight: 800, lineHeight: 1, margin: '0 0 4px' }}>{item.stat}</p>
                  <p style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 6px' }}>{item.label}</p>
                  <p style={{ color: MUTED, fontSize: 11, lineHeight: 1.5, margin: 0 }}>{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── THE ACCUMULATION ── */}
      <section style={{ background: '#fff', borderTop: `1px solid ${BORDER}`, padding: '72px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={{ ...BC, color: RED, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14 }}>What "Not Yet" Actually Costs</p>
              <h2 style={{ ...CG, color: NAVY, fontSize: 'clamp(26px,3vw,38px)', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
                Every day in evaluation is a day of unprotected mobilization.
              </h2>
              <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.75, marginBottom: 20 }}>
                The 90-day evaluation window is itself a risk event. Most organizations experience
                at least one strategic situation during their evaluation cycle — and handle it from zero.
                That one event typically costs more than a full year of Readiness OS Core.
              </p>
              <p style={{ color: NAVY, fontSize: 15, lineHeight: 1.75, fontWeight: 600 }}>
                The math doesn't ask you to believe in the platform. It asks you to look at what you're already paying.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: BORDER }}>
              {[
                { period: 'Every day without Readiness OS', cost: Math.round(DAILY_COST), color: RED },
                { period: 'Every week without Readiness OS', cost: Math.round(DAILY_COST * 7), color: RED },
                { period: 'Every month without Readiness OS', cost: Math.round(DAILY_COST * 30), color: RED },
                { period: '90-day evaluation window', cost: Math.round(DAILY_COST * 90), color: '#D97706' },
                { period: 'One year without Readiness OS', cost: ANNUAL_TAX, color: RED },
                { period: 'Readiness OS Core — full year', cost: READINESS_COST, color: TEAL },
                { period: 'You keep — net annual', cost: NET_SAVING, color: TEAL },
              ].map((row, i) => (
                <div key={i} style={{ background: '#fff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: MUTED, fontSize: 13 }}>{row.period}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 800, color: row.color }}>{fmtM(row.cost)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: NAVY, padding: '88px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 32px', position: 'relative' }}>

          {/* Live counter in CTA — personal cumulative for return visitors */}
          <div style={{ display: 'inline-block', padding: '12px 28px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 32 }}>
            {isReturnVisitor ? (
              <>
                <p style={{ ...BC, color: 'rgba(239,68,68,0.7)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                  Accumulated since you first found us — {daysLabel(daysSinceFirst)}
                </p>
                <p style={{ color: RED, fontFamily: 'monospace', fontSize: 28, fontWeight: 700, margin: 0 }}>{fmtM(personalCumulativeCost)}</p>
              </>
            ) : (
              <>
                <p style={{ ...BC, color: 'rgba(239,68,68,0.7)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 4px' }}>Your cost since opening this page</p>
                <p style={{ color: RED, fontFamily: 'monospace', fontSize: 28, fontWeight: 700, margin: 0 }}>{fmtD(liveCost)}</p>
              </>
            )}
          </div>

          <h2 style={{ ...CG, color: '#fff', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, lineHeight: 1.15, marginBottom: 16 }}>
            The cost of waiting is real.<br />
            <em style={{ color: GOLD }}>The cost of Readiness OS is fixed.</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.75, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            2 seats. 90-day validated partnership. $75K — 100% credited at close.
            One situation during your evaluation costs more than three years of membership.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('/request-access')}
              style={{ ...BC, background: GOLD, color: NAVY, border: 'none', padding: '16px 36px', fontSize: 12, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              Apply for Founding Partner Access <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
            <button onClick={() => nav('/the-gap')}
              style={{ ...BC, background: 'transparent', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.15)', padding: '16px 36px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem' }}>
              See the Full 12-Gap Analysis
            </button>
          </div>

          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {['2 Founding Partner seats', '90-day validated partnership', 'Direct founder involvement', '$75K · 100% credited at close'].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle style={{ width: 13, height: 13, color: TEAL, flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </PageLayout>
  );
}
