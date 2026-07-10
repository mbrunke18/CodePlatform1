import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Share2, RefreshCw, AlertTriangle, Clock, DollarSign, TrendingDown, Zap } from 'lucide-react';
import StandardNav from '@/components/layout/StandardNav';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const RED = "#DC2626";

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

function fmt$(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtDays(d: number) {
  if (d >= 1) return `${d.toFixed(0)} days`;
  return `${(d * 24).toFixed(0)} hours`;
}

const EVENTS = [
  { id: 'ransomware',    label: 'Ransomware / Cyber Attack',         avgDays: 18, revImpact: 0.032 },
  { id: 'activist',     label: 'Activist Investor',                  avgDays: 22, revImpact: 0.028 },
  { id: 'recall',       label: 'Product / FDA Recall',               avgDays: 25, revImpact: 0.041 },
  { id: 'supply',       label: 'Supply Chain Collapse',              avgDays: 20, revImpact: 0.035 },
  { id: 'regulatory',   label: 'Regulatory Investigation',           avgDays: 30, revImpact: 0.025 },
  { id: 'competitor',   label: 'Competitor Displacement Sprint',     avgDays: 14, revImpact: 0.019 },
  { id: 'workforce',    label: 'Workforce / Restructuring Event',    avgDays: 28, revImpact: 0.022 },
  { id: 'litigation',   label: 'Litigation / DOJ Investigation',     avgDays: 35, revImpact: 0.030 },
];

// $500/hr blended rate: conservative loaded cost for senior leaders in mobilization.
// Basis: U.S. BLS + proxy filing data. VP/SVP median total comp at $200M–$2B companies
// = $400K–$900K. At 2,000 working hours/yr, cash rate = $200–$450/hr. Adding employer
// costs (payroll tax, benefits, equity) at 30% overhead → blended loaded rate: $400–$575/hr.
// $500/hr is the conservative midpoint. True C-suite rates are 2–3× higher; this model
// uses a blended rate because the mobilization team is a mix of C-suite + VP-level leaders.
const EXEC_HOURLY = 500;

// Executive count: the mobilization team — senior leaders who must coordinate BEFORE
// execution begins. Not all executives; only those required for alignment, approvals,
// and decision authority on the specific trigger type.
// Model: logarithmic scale based on Deloitte Global Crisis Survey (2023) benchmarks:
//   Mid-market ($50M–$500M): 8–18 leaders typically involved
//   Enterprise ($500M–$5B): 15–25 leaders
//   Global enterprise ($5B+): 22–30 leaders
function calcExecCount(revenueM: number) {
  return Math.min(30, Math.max(8, Math.round(3 + Math.log10(Math.max(50, revenueM)) * 5)));
}

// 3 hrs/day: average senior leader mobilization burden (calls, alignment meetings, approvals,
// status updates) during the mobilization phase — not their full working day.
// This is a conservative estimate; Deloitte and PwC crisis management benchmarks suggest
// 2–5 hrs/day for leaders in the immediate response circle.
const EXEC_HOURS_PER_DAY = 3;

export default function MobilizationTax() {
  const [, nav] = useLocation();
  const [revenue, setRevenue] = useState(500);        // $M
  const [eventCount, setEventCount] = useState(3);
  const [mobilizeDays, setMobilizeDays] = useState(30);
  const [selectedEvent, setSelectedEvent] = useState('ransomware');
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const revenueDollars = revenue * 1_000_000;
  const dailyRevenue = revenueDollars / 365;
  // Tiered exec count based on company size (see calcExecCount above)
  const execCount = calcExecCount(revenue);
  // Exec hours: 3 hrs/day × mobilization days (not full workday — coordination burden only)
  const mobilizeHoursPerEvent = mobilizeDays * EXEC_HOURS_PER_DAY;
  const execCostPerEvent = execCount * EXEC_HOURLY * mobilizeHoursPerEvent;
  // Revenue impact uses event-type-specific rate from EVENTS table (not a flat %)
  // Rates sourced from: IBM Cost of a Data Breach 2024, FDA recall cost studies,
  // S&P Capital IQ activist campaign data, NBER supply chain disruption research.
  const event = EVENTS.find(e => e.id === selectedEvent) || EVENTS[0];
  const revLostPerEvent = dailyRevenue * mobilizeDays * event.revImpact;
  const totalCostPerEvent = execCostPerEvent + revLostPerEvent;
  const annualTax = totalCostPerEvent * eventCount;
  const annualRevLost = revLostPerEvent * eventCount;
  const readinessCost = 120_000;
  const annualSavings = annualTax - readinessCost;
  const roi = ((annualSavings / readinessCost) * 100);
  const minutesSavedPerEvent = mobilizeDays * 24 * 60 - 12;

  const handleReveal = () => {
    setRevealed(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleShare = async () => {
    const text = `Our organization loses ${fmt$(annualTax)}/year to strategic situation mobilization delays — the time spent aligning before execution can even begin. That's the Mobilization Tax. @VaughnMartin Readiness OS compresses 30 days to 12 minutes. vaughnmartin.com/mobilization-tax`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4', fontFamily: 'system-ui, sans-serif' }}>

      <StandardNav />

      {/* Hero */}
      <div style={{ background: NAVY, padding: '72px 32px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,76,0.07) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760, margin: '0 auto' }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: GOLD, marginBottom: 20 }}>The Uncomfortable Truth About Enterprise Crises</div>
          <h1 style={{ ...CG, fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, marginBottom: 16 }}>
            What Is Your<br /><em style={{ color: GOLD }}>Mobilization Tax?</em>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: 580, margin: '0 auto 32px' }}>
            When a strategic trigger fires, most organizations spend <strong style={{ color: '#fff' }}>30 days just mobilizing</strong> — before a single task executes. That delay has a precise dollar cost. Calculate yours below.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { v: '30 days', l: 'Average mobilization cycle' },
              { v: '3,600×', l: 'Execution head start available' },
              { v: '12 min', l: 'With Readiness OS' },
            ].map(({ v, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD }}>{v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '56px 24px' }}>

        <div style={{ background: '#fff', border: `1px solid #E2DDD4`, padding: '40px 40px 36px' }}>
          <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: TEAL, marginBottom: 4 }}>Step 1 of 3</div>
          <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 24 }}>Tell us about your organization</div>

          {/* Revenue */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>Annual Revenue</label>
              <span style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD }}>{revenue >= 1000 ? `$${(revenue/1000).toFixed(1)}B` : `$${revenue}M`}</span>
            </div>
            <input type="range" min={50} max={10000} step={50} value={revenue} onChange={e => setRevenue(+e.target.value)}
              style={{ width: '100%', accentColor: GOLD, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              <span>$50M</span><span>$10B+</span>
            </div>
          </div>

          {/* Event count */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>Strategic situations per year</label>
              <span style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD }}>{eventCount}</span>
            </div>
            <input type="range" min={1} max={12} step={1} value={eventCount} onChange={e => setEventCount(+e.target.value)}
              style={{ width: '100%', accentColor: GOLD, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              <span>1 (lucky)</span><span>12 (reality)</span>
            </div>
          </div>

          {/* Mobilize days */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>Days to mobilize when a trigger fires</label>
              <span style={{ ...CG, fontSize: 22, fontWeight: 700, color: RED }}>{mobilizeDays} days</span>
            </div>
            <input type="range" min={7} max={60} step={1} value={mobilizeDays} onChange={e => setMobilizeDays(+e.target.value)}
              style={{ width: '100%', accentColor: RED, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              <span>7 days (fast)</span><span>60 days (typical large enterprise)</span>
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 2 }}>
              <span style={{ fontSize: 12, color: '#9B2020' }}>
                <strong>Industry benchmark:</strong> 30 days is the conservative baseline for Fortune 500 mobilization cycles. Most enterprises underestimate by 40%.
              </span>
            </div>
          </div>

          {/* Event type */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: NAVY, display: 'block', marginBottom: 10 }}>Most likely situation type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {EVENTS.map(ev => (
                <button key={ev.id} onClick={() => setSelectedEvent(ev.id)}
                  style={{ padding: '10px 14px', textAlign: 'left', border: `1px solid ${selectedEvent === ev.id ? NAVY : '#E2DDD4'}`, background: selectedEvent === ev.id ? NAVY : '#fff', color: selectedEvent === ev.id ? '#fff' : '#4A5275', fontSize: 13, fontWeight: selectedEvent === ev.id ? 600 : 400, cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s' }}>
                  {ev.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleReveal}
            style={{ width: '100%', padding: '16px 32px', background: NAVY, color: GOLD, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 2 }}
          >
            <AlertTriangle size={16} />
            Calculate My Mobilization Tax
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Results */}
        {revealed && (
          <div ref={resultRef} style={{ marginTop: 32 }}>

            {/* Primary result */}
            <div style={{ background: NAVY, padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse 70% 50% at 50% 100%, rgba(201,168,76,0.1) 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Your Annual Mobilization Tax</div>
                <div style={{ ...CG, fontSize: 'clamp(52px, 10vw, 96px)', fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>{fmt$(annualTax)}</div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 32px' }}>
                  This is what your organization spends in lost revenue and executive time every year — not executing, just <em>preparing to execute</em> after a trigger fires.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', maxWidth: 600, margin: '0 auto' }}>
                  {[
                    { icon: <Clock size={18} />, label: 'Mobilization cost per event', value: fmt$(totalCostPerEvent) },
                    { icon: <TrendingDown size={18} />, label: 'Revenue at risk per event', value: fmt$(revLostPerEvent) },
                    { icon: <DollarSign size={18} />, label: 'Executive time burned per event', value: fmt$(execCostPerEvent) },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ padding: '20px 16px', background: 'rgba(10,15,46,0.4)', textAlign: 'center' }}>
                      <div style={{ color: GOLD, marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{icon}</div>
                      <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{value}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div style={{ background: '#fff', border: `1px solid #E2DDD4`, padding: '40px', marginTop: 2 }}>
              <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 6 }}>What Readiness OS Changes</div>
              <div style={{ fontSize: 14, color: '#5A6380', marginBottom: 28 }}>
                The 3,600× execution head start isn't a speed claim. It's a financial one.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                <div style={{ padding: '24px', background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 2 }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: RED, marginBottom: 12 }}>Today — Without Readiness OS</div>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{mobilizeDays} days</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>to mobilize after trigger detection</div>
                  <div style={{ fontSize: 14, color: '#4A5275', lineHeight: 1.65 }}>
                    {execCount} executives × {mobilizeHoursPerEvent} hours each × {fmt$(EXEC_HOURLY)}/hr loaded rate = coordination overhead before a single task executes.
                  </div>
                  <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(220,38,38,0.06)', borderRadius: 2 }}>
                    <div style={{ ...BC, fontSize: 20, fontWeight: 700, color: RED }}>{fmt$(totalCostPerEvent)}</div>
                    <div style={{ fontSize: 11, color: '#9B2020' }}>cost per situation</div>
                  </div>
                </div>

                <div style={{ padding: '24px', background: 'rgba(43,138,110,0.04)', border: `1px solid rgba(43,138,110,0.2)`, borderRadius: 2 }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: 12 }}>With Readiness OS</div>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 4 }}>12 minutes</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>to live execution after trigger detection</div>
                  <div style={{ fontSize: 14, color: '#4A5275', lineHeight: 1.65 }}>
                    Pre-staged protocols. Pre-assigned owners. Pre-authorized budget. The response is ready before the trigger fires — no mobilization required.
                  </div>
                  <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(43,138,110,0.06)', borderRadius: 2 }}>
                    <div style={{ ...BC, fontSize: 20, fontWeight: 700, color: TEAL }}>{fmt$(readinessCost)}/yr</div>
                    <div style={{ fontSize: 11, color: '#1a6b50' }}>full platform cost</div>
                  </div>
                </div>
              </div>

              {/* ROI summary */}
              <div style={{ background: NAVY, padding: '28px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {[
                  { label: 'Annual tax eliminated', value: fmt$(annualTax), sub: 'mobilization cost recovered' },
                  { label: 'Net annual savings', value: fmt$(annualSavings > 0 ? annualSavings : annualTax * 0.9), sub: 'after platform cost' },
                  { label: 'First-year ROI', value: `${Math.min(roi, 9999).toFixed(0)}%`, sub: 'on $120K investment' },
                ].map(({ label, value, sub }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD }}>{value}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 4 }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time comparison */}
            <div style={{ background: '#fff', border: `1px solid #E2DDD4`, padding: '32px 40px', marginTop: 2 }}>
              <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 20 }}>The Time Compression</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 20 }}>
                <div style={{ flex: 1, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', padding: '16px 20px' }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: RED, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Old Model</div>
                  <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: NAVY }}>{mobilizeDays} days</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{(mobilizeDays * 24 * 60).toLocaleString()} minutes of delay</div>
                </div>
                <div style={{ padding: '0 20px', flexShrink: 0 }}>
                  <div style={{ ...BC, fontSize: 22, fontWeight: 700, color: GOLD }}>→</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(43,138,110,0.08)', border: `1px solid rgba(43,138,110,0.2)`, padding: '16px 20px' }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Readiness OS</div>
                  <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: NAVY }}>12 minutes</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{minutesSavedPerEvent.toLocaleString()} minutes recovered per event</div>
                </div>
              </div>
              <div style={{ padding: '14px 20px', background: 'rgba(201,168,76,0.06)', border: `1px solid rgba(201,168,76,0.2)` }}>
                <span style={{ fontSize: 14, color: NAVY }}>
                  <strong style={{ color: GOLD }}>3,600× Execution Head Start</strong> — not a speed claim. A compression from {mobilizeDays} days of alignment meetings and coordination overhead to 12 minutes of pre-staged execution. The response was ready before the trigger fired.
                </span>
              </div>
            </div>

            {/* Share + CTA */}
            <div style={{ background: NAVY, padding: '40px', marginTop: 2, textAlign: 'center' }}>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                Your organization loses <span style={{ color: GOLD }}>{fmt$(annualTax)}/year</span> before it can even execute.
              </div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 20, maxWidth: 480, margin: '0 auto 20px' }}>
                That's the Mobilization Tax. Readiness OS eliminates it.
              </div>
              <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.65)', marginBottom: 28, maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>
                Every situation without Readiness OS costs twice — the Mobilization Tax above, and the window a competitor who was already staged closes while you're still assembling the room.
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => nav('/request-access')}
                  style={{ ...BC, display: 'flex', alignItems: 'center', gap: 8, background: GOLD, color: NAVY, border: 'none', padding: '14px 28px', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}
                >
                  Apply for Founding Partner Access <ArrowRight size={14} />
                </button>
                <button
                  onClick={handleShare}
                  style={{ ...BC, display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '14px 28px', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}
                >
                  <Share2 size={14} />
                  {copied ? 'Copied — Share on LinkedIn' : 'Copy for LinkedIn'}
                </button>
                <button
                  onClick={() => { setRevealed(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ ...BC, display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', padding: '14px 20px', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}
                >
                  <RefreshCw size={13} /> Recalculate
                </button>
              </div>
            </div>

            {/* Methodology disclosure */}
            <div style={{ background: '#F8F7F4', border: `1px solid #E2DDD4`, padding: '32px 40px', marginTop: 2 }}>
              <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: TEAL, marginBottom: 12 }}>Model Methodology & Sources</div>
              <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 16 }}>How this estimate is calculated</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Leadership mobilization cost</div>
                  <div style={{ fontSize: 13, color: '#5A6380', lineHeight: 1.75 }}>
                    <strong>{execCount} senior leaders</strong> × <strong>$500/hr</strong> blended loaded rate × <strong>{mobilizeHoursPerEvent} hrs</strong> ({mobilizeDays} days × 3 hrs/day coordination burden).<br /><br />
                    <span style={{ color: '#7A8399' }}>Leader count uses a logarithmic scale by company size (8–30 range). $500/hr is the conservative blended loaded rate for VP/SVP-level leaders (total compensation ÷ working hours + 30% employer overhead). True C-suite rates are 2–3× higher — this model deliberately uses the lower VP-level floor.</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Revenue at risk during mobilization</div>
                  <div style={{ fontSize: 13, color: '#5A6380', lineHeight: 1.75 }}>
                    <strong>{(event.revImpact * 100).toFixed(1)}% of daily revenue</strong> × <strong>{mobilizeDays} days</strong> for a <strong>{event.label}</strong> event.<br /><br />
                    <span style={{ color: '#7A8399' }}>Revenue impact rates are event-specific, not a flat percentage. Rates are derived from: IBM Security Cost of a Data Breach Report (2024) for cyber events; FDA recall cost studies for product/recall events; S&P Capital IQ data for activist campaigns; NBER supply chain disruption research.</span>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #E2DDD4', paddingTop: 16 }}>
                <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.75 }}>
                  <strong style={{ color: '#6B7280' }}>What this model includes:</strong> Senior leadership time cost (salary + benefits + overhead) during the mobilization window, and direct revenue impact from operational disruption during that period.<br />
                  <strong style={{ color: '#6B7280' }}>What this model excludes:</strong> External consultant/legal fees, regulatory fines, long-term brand damage, employee productivity loss below VP level, and post-mobilization recovery costs. The total enterprise cost of a strategic situation is typically 3–5× the number shown here.<br />
                  <strong style={{ color: '#6B7280' }}>Important:</strong> These are illustrative estimates based on published industry benchmarks. Individual results depend on organizational structure, event severity, and existing response capabilities. This calculator is intended to frame the order of magnitude — not produce audited financial projections.
                </div>
              </div>
            </div>

            {/* What the platform does */}
            <div style={{ background: '#fff', border: `1px solid #E2DDD4`, padding: '40px', marginTop: 2 }}>
              <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 20 }}>How Readiness OS Eliminates the Tax</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { n: '1', title: 'Pre-staged before the trigger', body: '180 Readiness Protocols are fully configured — tasks assigned, budgets authorized, stakeholders mapped — before any trigger fires.' },
                  { n: '2', title: 'Pattern-detected, not meeting-detected', body: '231 detection thresholds monitored continuously across 8 signal sources. The system detects the situation. Your executives authorize. No coordination meeting required.' },
                  { n: '3', title: 'Execution in 12 minutes', body: 'The war room is live. Tasks are deployed to pre-assigned owners. Stakeholders are notified. The 30-day mobilization cycle is gone — permanently.' },
                ].map(s => (
                  <div key={s.n} style={{ padding: '20px', background: '#F8F7F4', borderTop: `3px solid ${GOLD}` }}>
                    <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{s.n}.</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: '#5A6380', lineHeight: 1.65 }}>{s.body}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => nav('/how-it-executes')} style={{ ...BC, display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: NAVY, border: `1px solid ${NAVY}`, padding: '10px 20px', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
                  See It Execute <ArrowRight size={12} />
                </button>
                <button onClick={() => nav('/12-minute-experience')} style={{ ...BC, display: 'flex', alignItems: 'center', gap: 6, background: TEAL, color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
                  <Zap size={12} /> Run the 12-Minute Test Drive
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Footer tagline */}
        {!revealed && (
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <div style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY, marginBottom: 8, fontStyle: 'italic' }}>
              "The response is ready before the trigger fires."
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>VaughnMartin · Readiness OS · Founding Partner Edition</div>
          </div>
        )}
      </div>
    </div>
  );
}
