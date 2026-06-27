import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import { Printer, ArrowRight, ChevronDown } from "lucide-react";

const NAVY   = "#0A0F2E";
const GOLD   = "#C9A84C";
const TEAL   = "#2B8A6E";
const BORDER = "#E2DDD5";
const MUTED  = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const SCENARIOS = [
  { id: "ransomware", label: "Ransomware / Data Breach", domain: "RISK & RESILIENCE", urgency: "Immediate — active system compromise", exposure30d: { "1B": "$5.2M", "5B": "$12.1M", "25B": "$26M" } },
  { id: "regulatory", label: "Regulatory Investigation (SEC / DOJ / FDA)", domain: "RISK & RESILIENCE", urgency: "High — cooperation window closing", exposure30d: { "1B": "$7.8M", "5B": "$18.4M", "25B": "$42M" } },
  { id: "activist", label: "Activist Investor Campaign", domain: "RISK & RESILIENCE", urgency: "High — public narrative forming", exposure30d: { "1B": "$4.5M", "5B": "$11.2M", "25B": "$24M" } },
  { id: "supply", label: "Supply Chain Disruption", domain: "RISK & RESILIENCE", urgency: "Immediate — production at risk", exposure30d: { "1B": "$6.1M", "5B": "$14.9M", "25B": "$32M" } },
  { id: "competitor", label: "Competitor Displacement / Market Entry", domain: "GROWTH & POSITIONING", urgency: "Moderate — window compressing daily", exposure30d: { "1B": "$3.6M", "5B": "$8.7M", "25B": "$19M" } },
  { id: "ma", label: "M&A Rapid Response", domain: "GROWTH & POSITIONING", urgency: "Critical — LOI window 48–72 hours", exposure30d: { "1B": "$9.2M", "5B": "$22M", "25B": "$47M" } },
];

const REVENUE_TIERS = [
  { id: "1B",  label: "$1B – $5B" },
  { id: "5B",  label: "$5B – $25B" },
  { id: "25B", label: "$25B+" },
];

const TODAY = new Date();
const FMT_DATE = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const ADD_DAYS = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`,
  borderRadius: '0.15rem', fontSize: 14, color: NAVY,
  outline: 'none', boxSizing: 'border-box', background: '#fff',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: MUTED, marginBottom: 6,
};

interface FormState {
  companyName: string;
  championName: string;
  championTitle: string;
  scenarioId: string;
  revenueTier: string;
  decisionDeadline: string;
  requestedAmount: string;
}

function MemoDocument({ form }: { form: FormState }) {
  const scenario = SCENARIOS.find(s => s.id === form.scenarioId) || SCENARIOS[0];
  const tier = form.revenueTier || "5B";
  const exposure = scenario.exposure30d[tier as keyof typeof scenario.exposure30d] || "—";
  const deadline = form.decisionDeadline ? FMT_DATE(new Date(form.decisionDeadline + 'T12:00:00')) : FMT_DATE(ADD_DAYS(TODAY, 7));
  const company = form.companyName || "[COMPANY NAME]";
  const champion = form.championName || "[CHAMPION NAME]";
  const title = form.championTitle || "[TITLE]";
  const amount = form.requestedAmount ? `$${parseInt(form.requestedAmount.replace(/\D/g,'')).toLocaleString()}` : "$120,000";

  return (
    <div id="memo-document" style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', padding: '48px 56px', fontFamily: '"Barlow", sans-serif' }}>

      {/* Letterhead */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, paddingBottom: 24, borderBottom: `2px solid ${NAVY}` }}>
        <div>
          <div style={{ ...BC, fontSize: 14, fontWeight: 800, color: NAVY, letterSpacing: '0.1em', textTransform: 'uppercase' }}>CONFIDENTIAL INTERNAL MEMORANDUM</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Not for external distribution</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...BC, fontSize: 11, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{company}</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{FMT_DATE(TODAY)}</div>
        </div>
      </div>

      {/* To/From/Re */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '6px 16px', marginBottom: 32, fontSize: 13 }}>
        {[
          ['TO:', 'Board of Directors / Chief Financial Officer'],
          ['FROM:', `${champion}, ${title}`],
          ['RE:', `Strategic Operating Model Investment — Readiness OS`],
          ['SUBJECT:', `30-Day Mobilization Risk + 90-Day Mitigation Path`],
          ['PRIORITY:', scenario.urgency],
        ].map(([k, v]) => [
          <div key={`k-${k}`} style={{ fontWeight: 700, color: NAVY, paddingTop: 2 }}>{k}</div>,
          <div key={`v-${k}`} style={{ color: k === 'PRIORITY:' ? '#DC2626' : NAVY, fontWeight: k === 'PRIORITY:' ? 700 : 400 }}>{v}</div>,
        ])}
      </div>

      <div style={{ width: '100%', height: 1, background: BORDER, marginBottom: 28 }} />

      {/* Problem */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: NAVY, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>
          01 — THE PROBLEM
        </div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
          {company} currently operates on a traditional mobilization model: when a high-stakes situation presents itself — such as a {scenario.label.toLowerCase()} — we require approximately 30 days to identify decision-makers, align on approach, assign roles, and begin coordinated execution. This is the industry norm. It is also a structural liability.
        </p>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8, marginTop: 10 }}>
          During that 30-day window, costs accumulate, regulatory exposure compounds, and competitive or operational damage extends unchecked. The mobilization delay is not a people problem — it is an operating model problem. We were never designed to move faster because human coordination was the bottleneck. AI changes that constraint.
        </p>
      </div>

      {/* Financial Exposure */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: NAVY, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>
          02 — FINANCIAL EXPOSURE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: '30-Day Exposure Estimate', value: exposure, sub: 'Conservative median for our revenue tier', color: '#DC2626' },
            { label: 'Response Window', value: '12 min', sub: 'With pre-staged Readiness Protocols', color: TEAL },
            { label: 'Execution Head Start', value: '3,600×', sub: '30 days compressed to 12 minutes', color: GOLD },
          ].map(s => (
            <div key={s.label} style={{ padding: '14px 16px', background: '#F9FAFB', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', textAlign: 'center' }}>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: NAVY, marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 3, lineHeight: 1.4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: MUTED, fontStyle: 'italic', lineHeight: 1.6 }}>
          Exposure estimate based on industry benchmarks for {scenario.label.toLowerCase()} events at {REVENUE_TIERS.find(t => t.id === tier)?.label} revenue tier (IBM, DOJ/SEC settlement data, McKinsey 2023). Conservative median — actual exposure depends on incident severity.
        </p>
      </div>

      {/* Why Now */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: NAVY, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>
          03 — WHY NOW
        </div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
          We do not face a shortage of strategic triggers — we face a shortage of pre-staged responses. The {scenario.label.toLowerCase()} scenario is not hypothetical; it is a documented risk category for organizations at our scale. {scenario.urgency}.
        </p>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8, marginTop: 10 }}>
          Every day we operate without pre-staged Readiness Protocols is a day we are betting that no trigger fires before we are ready. That is not a risk posture — it is an absence of one. The opportunity to prepare is now, before a trigger fires under pressure.
        </p>
      </div>

      {/* Why This Approach */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: NAVY, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>
          04 — WHY THIS APPROACH
        </div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
          Readiness OS is not a technology tool — it is an operating model. It pre-stages execution for every scenario we are likely to face: tasks sequenced, budgets pre-authorized, executives mapped, and stakeholder communications pre-drafted. When a situation presents itself, the response is already prepared. Executives authorize; the platform orchestrates. Human authority is preserved; coordination lag is eliminated.
        </p>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8, marginTop: 10 }}>
          Readiness OS is the operating model layer above the technology stack — not a tool that automates tasks, but a system that allows an enterprise to detect, coordinate, execute, and learn from strategic change faster than its competitors. The platform stages end-to-end response architecture — scenarios, trigger logic, authority gates, budgets, and communications — so leadership can authorize action at speed with full accountability. This creates both earlier situational awareness and faster coordinated execution without compromising control.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 14 }}>
          {[
            '180 Readiness Protocols — pre-staged across 9 strategic domains',
            '231 detection thresholds monitoring for strategic events',
            'Pre-authorized budget envelopes — no finance approval delay under pressure',
            'Executive authorization preserved — no autonomous AI action',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: '#374151' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: TEAL, marginTop: 6, flexShrink: 0 }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* What Is Being Requested */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: NAVY, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>
          05 — WHAT IS BEING REQUESTED
        </div>
        <div style={{ padding: '16px 20px', background: 'rgba(201,168,76,0.07)', border: `1px solid rgba(201,168,76,0.3)`, borderRadius: '0.15rem', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 6 }}>
            Approval for a 90-Day Founding Partner Engagement — {amount}
          </div>
          <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
            This is a structured validation partnership — not a technology purchase. The full engagement fee is credited to Year 1 subscription cost if we proceed. If the Day 60 success criteria are not met, a partial refund is available. We make the renewal decision at Day 90 with complete data.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { checkpoint: 'Day 30', item: '5 protocols staged · First drill complete' },
            { checkpoint: 'Day 60', item: 'Live shadow activations · ROI draft' },
            { checkpoint: 'Day 90', item: 'Full business case · Renewal decision' },
          ].map(c => (
            <div key={c.checkpoint} style={{ padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#F9FAFB', fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: GOLD, marginBottom: 4 }}>{c.checkpoint}</div>
              <div style={{ color: '#374151' }}>{c.item}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision */}
      <div style={{ padding: '20px 24px', background: NAVY, borderRadius: '0.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>Decision Requested</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Approval to proceed with Founding Partner engagement</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Investment: {amount} · 90-day structured validation · Fee credited to Year 1</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Decision Deadline</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{deadline}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${BORDER}`, fontSize: 11, color: MUTED, lineHeight: 1.6 }}>
        Prepared by {champion}, {title} · {FMT_DATE(TODAY)} · {company} · Confidential — Not for external distribution<br />
        VaughnMartin Readiness OS · Security & Compliance documentation available at /security-compliance<br />
        <em>Readiness OS supports executive decision-making and execution orchestration; final decision authority remains with designated human leaders.</em>
      </div>
    </div>
  );
}

export default function BoardMemo() {
  const [form, setForm] = useState<FormState>({
    companyName: '',
    championName: '',
    championTitle: '',
    scenarioId: 'ransomware',
    revenueTier: '5B',
    decisionDeadline: '',
    requestedAmount: '120,000',
  });
  const [previewing, setPreviewing] = useState(false);

  const upd = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    updatePageMetadata({
      title: "Board Memo Generator — VaughnMartin Readiness OS",
      description: "Generate a CFO and Board-ready investment memo in minutes. Give your internal champion something they can forward today.",
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageLayout>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 32px 80px' }}>

        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Internal Champion Tool</div>
          <h1 style={{ ...CG, fontSize: 52, fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 20 }}>
            CFO / Board Memo<br />Generator
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            Your champion needs something they can forward. Fill in four fields — get a print-ready executive memo they can send to the CFO or board today.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 32, alignItems: 'start' }}>

          {/* Form */}
          <div style={{ background: '#FAFAF8', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', padding: '28px 24px', position: 'sticky', top: 24 }}>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 20 }}>Fill in your details</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Company Name</label>
                <input style={inputStyle} placeholder="Acme Corporation" value={form.companyName} onChange={e => upd('companyName', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Your Name (Champion)</label>
                <input style={inputStyle} placeholder="Sarah Chen" value={form.championName} onChange={e => upd('championName', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Your Title</label>
                <input style={inputStyle} placeholder="Chief Risk Officer" value={form.championTitle} onChange={e => upd('championTitle', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Primary Trigger Scenario</label>
                <select style={inputStyle} value={form.scenarioId} onChange={e => upd('scenarioId', e.target.value)}>
                  {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Revenue Tier</label>
                <select style={inputStyle} value={form.revenueTier} onChange={e => upd('revenueTier', e.target.value)}>
                  {REVENUE_TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Decision Deadline (optional)</label>
                <input type="date" style={inputStyle} value={form.decisionDeadline} onChange={e => upd('decisionDeadline', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Requested Amount (optional)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 14, color: MUTED, fontWeight: 600 }}>$</span>
                  <input style={{ ...inputStyle, paddingLeft: 26 }} placeholder="120,000" value={form.requestedAmount} onChange={e => upd('requestedAmount', e.target.value)} />
                </div>
              </div>
            </div>

            <button onClick={handlePrint} style={{
              marginTop: 24, width: '100%', padding: '13px', background: GOLD, border: 'none',
              borderRadius: '0.15rem', color: NAVY, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Printer size={16} /> Print / Save as PDF
            </button>

            <div style={{ marginTop: 12, fontSize: 11, color: MUTED, textAlign: 'center', lineHeight: 1.5 }}>
              Use browser Print → Save as PDF for a clean one-page document.
            </div>
          </div>

          {/* Live memo preview */}
          <div>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 16 }}>Live Preview — updates as you type</div>
            <MemoDocument form={form} />
          </div>

        </div>

        {/* Bottom CTAs */}
        <div style={{ marginTop: 48, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/founding-partner">
            <button style={{ padding: '14px 28px', background: NAVY, border: 'none', borderRadius: '0.15rem', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              View Founding Partner Terms <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/first-90-days">
            <button style={{ padding: '14px 28px', background: 'none', border: `1.5px solid ${BORDER}`, borderRadius: '0.15rem', color: NAVY, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              View First 90 Days Plan
            </button>
          </Link>
          <Link href="/cost-of-inaction">
            <button style={{ padding: '14px 28px', background: 'none', border: `1.5px solid ${BORDER}`, borderRadius: '0.15rem', color: NAVY, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Model Cost of Inaction
            </button>
          </Link>
        </div>

      </div>

      <style>{`
        @media print {
          body > * { display: none !important; }
          #memo-document { display: block !important; }
          #memo-document { position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </PageLayout>
  );
}
