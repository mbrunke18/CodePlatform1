export default function ModelA() {
  const NAVY = '#0A0F2E';
  const GOLD = '#C9A84C';
  const TEAL = '#2B8A6E';
  const IVORY = '#F0EDE4';
  const RED = '#DC2626';
  const AMBER = '#CA8A04';
  const BLUE = '#3B82F6';

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#fff', minHeight: '100vh', padding: '40px 36px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 4, height: 28, background: GOLD }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD }}>Model A — Current</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>Granular / Rules-Based</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', marginLeft: 14, borderLeft: `2px solid ${GOLD}30`, paddingLeft: 12 }}>
          Monitoring rules are configured individually per metric. Multiple rules roll up into a category proximity score. The score drives protocol activation.
        </p>
      </div>

      {/* Flow diagram */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Layer 1: Signal Categories */}
        <div style={{ background: IVORY, border: `1px solid ${GOLD}30`, padding: '16px 20px', borderRadius: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>Layer 1 — Signal Categories (11 domains)</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Financial & Investment','Competitive Movement','Market Dynamics','Internal Execution','ESG & Sustainability','Customer Sentiment','Technology & Security','Regulatory','Talent & Workforce','Brand & Reputation','Geopolitical'].map(c => (
              <div key={c} style={{ background: '#fff', border: `1px solid ${NAVY}20`, padding: '4px 8px', fontSize: 10, fontWeight: 600, color: NAVY, borderRadius: 2 }}>{c}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: 1, height: 16, background: '#D1D5DB' }} />
            <div style={{ fontSize: 9, color: '#9CA3AF', letterSpacing: '0.1em' }}>CONTAINS</div>
            <div style={{ width: 1, height: 16, background: '#D1D5DB' }} />
          </div>
        </div>

        {/* Layer 2: Data Points */}
        <div style={{ background: '#F8F9FF', border: `1px solid ${BLUE}30`, padding: '16px 20px', borderRadius: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: BLUE, marginBottom: 10 }}>Layer 2 — Metric Types / Data Points (14 per category example)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {['NPS Score','Churn Risk Score','CSAT %','Support Ticket Volume','Social Sentiment','Review Ratings','Renewal Pipeline Health','Customer Advocacy Score','Executive Changes at Accounts','Support Response Time','Expansion Revenue Trend','Feature Request Volume','Implementation Health','Critical Tickets %'].map((dp, i) => (
              <div key={dp} style={{ background: '#fff', border: `1px solid ${BLUE}25`, padding: '5px 8px', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, background: BLUE, borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#374151', fontWeight: 500 }}>{dp}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: 1, height: 16, background: '#D1D5DB' }} />
            <div style={{ fontSize: 9, color: '#9CA3AF', letterSpacing: '0.1em' }}>EACH GETS</div>
            <div style={{ width: 1, height: 16, background: '#D1D5DB' }} />
          </div>
        </div>

        {/* Layer 3: Individual Rules */}
        <div style={{ background: '#FFF8F0', border: `1px solid ${AMBER}40`, padding: '16px 20px', borderRadius: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: AMBER, marginBottom: 10 }}>Layer 3 — Individual Monitoring Rules (17 rules for Customer Sentiment)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { rule: 'NPS drops by more than 10 points', sev: 'CRITICAL', dp: 'NPS Score' },
              { rule: 'NPS drops below 40', sev: 'HIGH', dp: 'NPS Score' },
              { rule: 'CSAT drops below 75%', sev: 'CRITICAL', dp: 'CSAT %' },
              { rule: 'Churn risk accounts ≥ 1', sev: 'CRITICAL', dp: 'Churn Risk Score' },
              { rule: 'Support tickets spike by 50%', sev: 'HIGH', dp: 'Support Ticket Volume' },
              { rule: '...12 more rules', sev: '', dp: '' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${AMBER}20`, padding: '6px 10px', borderRadius: 2 }}>
                <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600, minWidth: 18 }}>{i < 5 ? String(i+1).padStart(2,'0') : ''}</div>
                {r.dp && <div style={{ fontSize: 9, color: BLUE, fontWeight: 600, background: `${BLUE}10`, padding: '2px 6px', borderRadius: 2, whiteSpace: 'nowrap' }}>{r.dp}</div>}
                <div style={{ fontSize: 11, color: NAVY, fontWeight: r.dp ? 500 : 400, flex: 1, fontStyle: r.dp ? 'normal' : 'italic', color: r.dp ? NAVY : '#9CA3AF' }}>{r.rule}</div>
                {r.sev && <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 2, background: r.sev === 'CRITICAL' ? `${RED}15` : `${AMBER}15`, color: r.sev === 'CRITICAL' ? RED : AMBER }}>{r.sev}</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: 1, height: 16, background: '#D1D5DB' }} />
            <div style={{ fontSize: 9, color: '#9CA3AF', letterSpacing: '0.1em' }}>ROLL UP TO</div>
            <div style={{ width: 1, height: 16, background: '#D1D5DB' }} />
          </div>
        </div>

        {/* Layer 4: Proximity Score */}
        <div style={{ background: '#FFF5F5', border: `1px solid ${RED}30`, padding: '16px 20px', borderRadius: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: RED, marginBottom: 10 }}>Layer 4 — Category Proximity Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, background: '#fff', border: `1px solid ${RED}20`, padding: '10px 14px', borderRadius: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>Customer Sentiment</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: RED, background: `${RED}10`, padding: '2px 8px', borderRadius: 2 }}>IMMINENT</span>
              </div>
              <div style={{ background: '#F3F4F6', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: RED }} />
              </div>
              <div style={{ fontSize: 10, color: RED, fontWeight: 700, textAlign: 'right', marginTop: 4 }}>98% proximity</div>
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', maxWidth: 200, lineHeight: 1.5 }}>
              Proximity = weighted average of all rules firing across the category's data points
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: 1, height: 16, background: '#D1D5DB' }} />
            <div style={{ fontSize: 9, color: '#9CA3AF', letterSpacing: '0.1em' }}>ACTIVATES</div>
            <div style={{ width: 1, height: 16, background: '#D1D5DB' }} />
          </div>
        </div>

        {/* Layer 5: Protocol */}
        <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}40`, padding: '16px 20px', borderRadius: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: 10 }}>Layer 5 — Readiness Protocol (pre-staged response)</div>
          <div style={{ background: '#fff', border: `1px solid ${TEAL}25`, padding: '10px 14px', borderRadius: 2, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>89</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>Customer Churn Response Protocol</div>
              <div style={{ fontSize: 10, color: '#6B7280' }}>47 tasks · 6 owners · pre-staged</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: TEAL }}>READY TO ACTIVATE →</div>
          </div>
        </div>
      </div>

      {/* Board Assessment */}
      <div style={{ marginTop: 28, padding: '16px 20px', background: NAVY, borderRadius: 2 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>Board Assessment — Model A</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#22C55E', marginBottom: 6 }}>✓ Strengths</div>
            {[
              'Maximum precision — each metric has its own threshold',
              'Granular enough for Fortune 500 compliance requirements',
              'Weighted scoring gives nuanced proximity signal',
              'Supports complex multi-condition rule logic',
            ].map(s => <div key={s} style={{ fontSize: 10, color: '#D1D5DB', marginBottom: 4, paddingLeft: 10, borderLeft: '2px solid #22C55E40' }}>{s}</div>)}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: RED, marginBottom: 6 }}>✗ Risks</div>
            {[
              'User must configure rules one at a time — high friction',
              'The "layer" abstraction obscures the simple story',
              '"17 rules on 14 metric types" needs explanation',
              'Feels like IT configuration, not strategic preparation',
            ].map(s => <div key={s} style={{ fontSize: 10, color: '#D1D5DB', marginBottom: 4, paddingLeft: 10, borderLeft: `2px solid ${RED}40` }}>{s}</div>)}
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '10px 14px', background: `${GOLD}15`, borderLeft: `3px solid ${GOLD}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, marginBottom: 4 }}>Board Verdict</div>
          <div style={{ fontSize: 11, color: '#E5E7EB', lineHeight: 1.6 }}>
            Right model for enterprise compliance and auditing. Wrong experience for a first-time Founding Partner who should be thinking "what situation am I preparing for?" — not "which metric threshold should I configure?" The power is real; the interface hides it behind complexity.
          </div>
        </div>
      </div>
    </div>
  );
}
