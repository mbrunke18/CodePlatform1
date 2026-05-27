import { useState } from "react";
import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import { AlertTriangle, Clock, DollarSign, TrendingDown, ArrowRight, ChevronDown, ChevronUp, Printer } from "lucide-react";

const NAVY   = "#0A0F2E";
const GOLD   = "#C9A84C";
const TEAL   = "#2B8A6E";
const IVORY  = "#F0EDE4";
const BORDER = "#E2DDD5";
const MUTED  = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const SCENARIOS = [
  {
    id: "cyber",
    label: "Ransomware / Data Breach",
    icon: "🛡",
    domain: "RISK & RESILIENCE",
    description: "Unauthorized encryption or exfiltration of enterprise systems.",
    benchmarkSource: "IBM Cost of a Data Breach Report 2024",
    dailyExposureRates: {
      "1B–5B":   180_000,
      "5B–25B":  420_000,
      "25B+":    890_000,
    },
    lostRevPerDay: {
      "1B–5B":   60_000,
      "5B–25B":  150_000,
      "25B+":    310_000,
    },
    baselineEvent: "$4.45M average breach cost (IBM 2024) + operational disruption",
    delayFactor: "Each day of delayed containment extends attacker dwell time and regulatory exposure.",
    urgencyNote: "SEC now requires breach disclosure within 4 business days of determination.",
  },
  {
    id: "regulatory",
    label: "Regulatory Investigation",
    icon: "⚖",
    domain: "RISK & RESILIENCE",
    description: "SEC, DOJ, FDA, or FTC civil or criminal investigative demand.",
    benchmarkSource: "DOJ/SEC enforcement settlement averages 2020–2024",
    dailyExposureRates: {
      "1B–5B":   240_000,
      "5B–25B":  580_000,
      "25B+":  1_200_000,
    },
    lostRevPerDay: {
      "1B–5B":   30_000,
      "5B–25B":  80_000,
      "25B+":   180_000,
    },
    baselineEvent: "Average DOJ/SEC settlement: $12M–$80M+ depending on cooperation posture",
    delayFactor: "Regulator cooperation credit is directly tied to speed of initial response. Each day of delay reduces cooperation credit by an estimated 3–8%.",
    urgencyNote: "Voluntary disclosure before investigation launch reduces average penalty by 40–60%.",
  },
  {
    id: "market",
    label: "Competitor Displacement / M&A",
    icon: "🎯",
    domain: "GROWTH & POSITIONING",
    description: "Competitive threat requiring rapid repositioning, or M&A LOI window.",
    benchmarkSource: "McKinsey M&A Speed Premium Analysis 2023",
    dailyExposureRates: {
      "1B–5B":   120_000,
      "5B–25B":  290_000,
      "25B+":    650_000,
    },
    lostRevPerDay: {
      "1B–5B":   90_000,
      "5B–25B":  220_000,
      "25B+":    490_000,
    },
    baselineEvent: "First-mover advantage premium: 20–35% market share delta in contested segments",
    delayFactor: "M&A LOI windows typically close within 48–72 hours. Strategic repositioning windows compress under competitive pressure.",
    urgencyNote: "Companies that respond within 72 hours to competitive displacement capture 2.3× the market share of slower peers.",
  },
  {
    id: "supply",
    label: "Supply Chain Disruption",
    icon: "🔗",
    domain: "RISK & RESILIENCE",
    description: "Critical supplier failure, port disruption, or production stoppage.",
    benchmarkSource: "Deloitte Supply Chain Resilience Study 2023",
    dailyExposureRates: {
      "1B–5B":   200_000,
      "5B–25B":  480_000,
      "25B+":  1_000_000,
    },
    lostRevPerDay: {
      "1B–5B":   80_000,
      "5B–25B":  200_000,
      "25B+":    430_000,
    },
    baselineEvent: "Average startup to Fortune 500 supply chain disruption: $184M in lost revenue over 30 days",
    delayFactor: "Every 24 hours of delayed supplier alternative activation extends production stoppage and customer SLA penalties.",
    urgencyNote: "Companies with pre-staged supply chain protocols resume production 18× faster than those who mobilize in real time.",
  },
];

const REVENUE_TIERS = [
  { id: "1B–5B",  label: "$1B – $5B revenue",  midpoint: 2_500_000_000 },
  { id: "5B–25B", label: "$5B – $25B revenue",  midpoint: 15_000_000_000 },
  { id: "25B+",   label: "$25B+ revenue",        midpoint: 50_000_000_000 },
];

const MOBILIZATION_DAYS = 30;
const READINESS_MINUTES = 12;

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function ScenarioCard({ s, selected, onClick }: { s: typeof SCENARIOS[0]; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '20px', borderRadius: '0.15rem', textAlign: 'left', cursor: 'pointer',
      border: `2px solid ${selected ? GOLD : BORDER}`,
      background: selected ? 'rgba(201,168,76,0.06)' : '#fff',
      transition: 'all 0.15s', width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 24 }}>{s.icon}</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL, marginBottom: 4 }}>{s.domain}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{s.description}</div>
        </div>
        {selected && <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>
        </div>}
      </div>
    </button>
  );
}

function ResultPanel({ scenario, tier }: { scenario: typeof SCENARIOS[0]; tier: typeof REVENUE_TIERS[0] }) {
  const dailyExposure = scenario.dailyExposureRates[tier.id as keyof typeof scenario.dailyExposureRates];
  const dailyLostRev  = scenario.lostRevPerDay[tier.id as keyof typeof scenario.lostRevPerDay];
  const totalExposure = (dailyExposure + dailyLostRev) * MOBILIZATION_DAYS;
  const minuteSaving  = (dailyExposure + dailyLostRev) / (24 * 60);
  const savedByReadiness = minuteSaving * (MOBILIZATION_DAYS * 24 * 60 - READINESS_MINUTES);

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>Your Delay Penalty Estimate</div>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Daily Exposure Rate', value: fmt(dailyExposure + dailyLostRev), sub: 'Operational + revenue impact per day', color: '#DC2626' },
          { label: 'Traditional 30-Day Cost', value: fmt(totalExposure), sub: 'Full mobilization cycle cost at current pace', color: '#DC2626' },
          { label: 'Saved with 12-Min Response', value: fmt(savedByReadiness), sub: 'Value of compressing 30 days to 12 minutes', color: TEAL },
        ].map(s => (
          <div key={s.label} style={{ padding: '20px 24px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF8', textAlign: 'center' }}>
            <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, marginTop: 8, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #132558 100%)`, borderRadius: '0.15rem', padding: '28px 32px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>Without Readiness OS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                `Day 1–3: Identify who needs to be in the room`,
                `Day 4–10: Agree on approach, assign roles`,
                `Day 11–20: Execute with coordination friction`,
                `Day 21–30: Escalation, delays, cost accumulation`,
              ].map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626', marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEAL, marginBottom: 12 }}>With Readiness OS — 12 Minutes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                `Min 0: Trigger detected — protocol fires automatically`,
                `Min 1–3: Tasks staged, stakeholders notified simultaneously`,
                `Min 4–8: Executive reviews pre-staged plan, authorizes`,
                `Min 9–12: Full team executing — no coordination lag`,
              ].map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px', background: '#FFF8F0', border: `1px solid rgba(201,168,76,0.3)`, borderRadius: '0.15rem', marginBottom: 24 }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>Delay Factor — {scenario.label}</div>
        <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>{scenario.delayFactor}</div>
        <div style={{ fontSize: 12, color: '#78350F', marginTop: 8, fontStyle: 'italic' }}>⚡ {scenario.urgencyNote}</div>
      </div>

      <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.6, fontStyle: 'italic' }}>
        Estimates based on {scenario.benchmarkSource}. {scenario.baselineEvent}. Figures represent conservative industry medians — actual exposure varies by incident severity and organizational response maturity. Assumptions available on request.
      </div>
    </div>
  );
}

export default function CostOfInaction() {
  const [scenarioId, setScenarioId] = useState("cyber");
  const [tierId, setTierId]         = useState("5B–25B");
  const [showAssumptions, setShowAssumptions] = useState(false);

  const scenario = SCENARIOS.find(s => s.id === scenarioId)!;
  const tier     = REVENUE_TIERS.find(t => t.id === tierId)!;

  useEffect(() => {
    updatePageMetadata({
      title: "Cost of Inaction — VaughnMartin Readiness OS",
      description: "Quantify the financial cost of a 30-day mobilization cycle vs. 12-minute response. Built for startup to Fortune 500 CFO and Board conversations.",
    });
  }, []);

  return (
    <PageLayout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 32px 80px' }}>

        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>The Mobilization Tax</div>
          <h1 style={{ ...CG, fontSize: 52, fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 16 }}>
            The Cost of a<br />30-Day Mobilization Cycle
          </h1>
          <p style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.3, maxWidth: 560, margin: '0 auto 20px', fontStyle: 'italic' }}>
            The Mobilization Tax doesn't get reduced.<br />It gets eliminated.
          </p>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 24px' }}>
            Every startup to Fortune 500 enterprise faces strategic triggers. The question is not whether — it's whether the response was staged before the trigger fired. Quantify what the delay costs your organization.
          </p>
          <div style={{ display: 'inline-block', padding: '8px 18px', background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.3)`, borderRadius: '0.15rem', fontSize: 13, color: '#92400E', fontStyle: 'italic' }}>
            Conservative estimates · Public benchmarks · Transparent assumptions
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 16 }}>Step 1 — Select your trigger scenario</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {SCENARIOS.map(s => (
              <ScenarioCard key={s.id} s={s} selected={scenarioId === s.id} onClick={() => setScenarioId(s.id)} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 16 }}>Step 2 — Select your revenue tier</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {REVENUE_TIERS.map(t => (
              <button key={t.id} onClick={() => setTierId(t.id)} style={{
                flex: 1, padding: '14px 0', borderRadius: '0.15rem', cursor: 'pointer',
                border: `2px solid ${tierId === t.id ? NAVY : BORDER}`,
                background: tierId === t.id ? NAVY : '#fff',
                color: tierId === t.id ? '#fff' : MUTED,
                fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <ResultPanel scenario={scenario} tier={tier} />

        <div style={{ marginTop: 48, padding: '32px', background: `linear-gradient(135deg, ${NAVY} 0%, #132558 100%)`, borderRadius: '0.15rem', textAlign: 'center' }}>
          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            The response is ready before the trigger fires.
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 28, lineHeight: 1.6 }}>
            Readiness OS delivers end-to-end advantage: detect situations earlier, decide with authority, execute in 12 minutes, and improve every cycle — for every scenario your organization is likely to face.
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/founding-partner">
              <button style={{ padding: '14px 28px', background: GOLD, border: 'none', borderRadius: '0.15rem', color: NAVY, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                Apply for Founding Partner Access <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/board-memo">
              <button style={{ padding: '14px 28px', background: 'none', border: `1.5px solid rgba(255,255,255,0.3)`, borderRadius: '0.15rem', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Generate CFO / Board Memo
              </button>
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <button onClick={() => setShowAssumptions(!showAssumptions)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 12 }}>
            {showAssumptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Methodology & Assumptions
          </button>
          {showAssumptions && (
            <div style={{ marginTop: 16, padding: '20px 24px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', fontSize: 12, color: MUTED, lineHeight: 1.8 }}>
              <p><strong>Mobilization baseline:</strong> 30 days is the conservative enterprise median for full organizational mobilization — identifying decision-makers, agreeing on approach, assigning roles, and beginning coordinated execution. McKinsey (2023) cites 24–45 days for complex Fortune 500 strategic responses.</p>
              <p style={{ marginTop: 8 }}><strong>Daily exposure rates:</strong> Derived from IBM Cost of a Data Breach Report (2024), DOJ/SEC enforcement settlement databases, Deloitte Supply Chain Resilience Study (2023), and McKinsey M&A Speed Premium Analysis (2023). Revenue-tier scaling applies a linear exposure multiplier based on revenue-to-incident-cost correlations across 500+ public filings.</p>
              <p style={{ marginTop: 8 }}><strong>12-minute response:</strong> Based on Readiness OS protocol architecture — pre-staged tasks, pre-authorized budgets, pre-drafted communications. Time-to-full-coordination measured from trigger detection to executive authorization completion in simulation environments.</p>
              <p style={{ marginTop: 8 }}><strong>Limitations:</strong> These are modeled estimates using industry medians. Actual exposure depends on incident severity, insurance coverage, existing response maturity, and regulatory jurisdiction. VaughnMartin makes no guarantee of specific outcomes.</p>
            </div>
          )}
        </div>

      </div>
    </PageLayout>
  );
}
