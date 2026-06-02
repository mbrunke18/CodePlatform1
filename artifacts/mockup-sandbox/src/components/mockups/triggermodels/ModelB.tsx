export default function ModelB() {
  const NAVY = '#0A0F2E';
  const GOLD = '#C9A84C';
  const TEAL = '#2B8A6E';
  const IVORY = '#F0EDE4';
  const RED = '#DC2626';
  const AMBER = '#CA8A04';
  const GREEN = '#22C55E';

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#fff', minHeight: '100vh', padding: '40px 36px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 4, height: 28, background: TEAL }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL }}>Model B — Proposed</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>Situation-First / Simplified</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', marginLeft: 14, borderLeft: `2px solid ${TEAL}30`, paddingLeft: 12 }}>
          A Trigger IS the named situation. You select which signals to watch inside it. When enough cross thresholds, the protocol fires. One concept, one wizard.
        </p>
      </div>

      {/* The wizard flow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Step 1 */}
        <div style={{ background: IVORY, border: `1px solid ${GOLD}40`, padding: '18px 20px', borderRadius: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>1</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: NAVY }}>Name the Situation</div>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${NAVY}20`, padding: '10px 14px', borderRadius: 2, marginLeft: 34 }}>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>What strategic situation are you preparing for?</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Customer Churn Risk</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 34, marginTop: 8 }}>
            {['Competitor Price Cut', 'Key Executive Departure', 'Supply Chain Disruption', 'Regulatory Mandate', 'Cybersecurity Incident', 'Market Share Decline'].map(s => (
              <div key={s} style={{ background: '#fff', border: `1px solid ${NAVY}20`, padding: '3px 8px', borderRadius: 2, fontSize: 9, fontWeight: 600, color: '#6B7280' }}>{s}</div>
            ))}
            <div style={{ padding: '3px 8px', borderRadius: 2, fontSize: 9, fontWeight: 600, color: '#9CA3AF', fontStyle: 'italic' }}>or describe your own →</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
          <div style={{ width: 1, height: 28, background: `${TEAL}40` }} />
        </div>

        {/* Step 2 */}
        <div style={{ background: '#F0FDF9', border: `1px solid ${TEAL}40`, padding: '18px 20px', borderRadius: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>2</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: NAVY }}>Select the Signals to Watch</div>
            <div style={{ fontSize: 10, color: '#6B7280', fontStyle: 'italic' }}>— system pre-selects the most relevant ones</div>
          </div>
          <div style={{ marginLeft: 34 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: TEAL, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Recommended for "Customer Churn Risk"</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { name: 'NPS Score', type: 'score', checked: true, alert: 'drops by 10+' },
                { name: 'Churn Risk Score', type: 'count', checked: true, alert: '≥ 1 account at risk' },
                { name: 'CSAT %', type: 'percentage', checked: true, alert: 'drops below 75%' },
                { name: 'Support Ticket Volume', type: 'count', checked: true, alert: 'spikes by 50%' },
                { name: 'Social Sentiment', type: 'score', checked: true, alert: 'drops by 25%' },
                { name: 'Renewal Pipeline Health', type: 'currency', checked: true, alert: '≥ $500K at risk' },
                { name: 'Review Ratings', type: 'score', checked: false, alert: 'drops below 4.0' },
                { name: 'Customer Advocacy Score', type: 'percentage', checked: false, alert: 'drops by 15%' },
              ].map(dp => (
                <div key={dp.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#fff', border: `1px solid ${dp.checked ? TEAL : '#E5E7EB'}`, padding: '7px 10px', borderRadius: 2, opacity: dp.checked ? 1 : 0.55 }}>
                  <div style={{ width: 14, height: 14, border: `2px solid ${dp.checked ? TEAL : '#D1D5DB'}`, background: dp.checked ? TEAL : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0, marginTop: 1 }}>
                    {dp.checked && <span style={{ color: '#fff', fontSize: 9, fontWeight: 800 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>{dp.name}</div>
                    <div style={{ fontSize: 9, color: '#6B7280', marginTop: 1 }}>Alert when: <span style={{ color: dp.checked ? TEAL : '#9CA3AF', fontWeight: 600 }}>{dp.alert}</span></div>
                    <div style={{ fontSize: 8, color: '#9CA3AF', marginTop: 1, fontStyle: 'italic' }}>{dp.type}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: '#9CA3AF', fontStyle: 'italic' }}>+ 6 more signals available — or adjust any threshold above</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
          <div style={{ width: 1, height: 28, background: `${TEAL}40` }} />
        </div>

        {/* Step 3 */}
        <div style={{ background: '#F8F9FF', border: `1px solid #3B82F640`, padding: '18px 20px', borderRadius: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>3</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: NAVY }}>Link the Readiness Protocol</div>
          </div>
          <div style={{ marginLeft: 34 }}>
            <div style={{ background: '#fff', border: `2px solid ${TEAL}`, padding: '12px 16px', borderRadius: 2, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>89</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Customer Churn Response Protocol</div>
                <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>47 tasks · 6 owners · pre-staged and ready</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: TEAL }}>✓ LINKED</div>
            </div>
            <div style={{ fontSize: 10, color: '#9CA3AF', fontStyle: 'italic', marginTop: 6 }}>System recommends based on situation name — you can swap or add others</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
          <div style={{ width: 1, height: 28, background: `${TEAL}40` }} />
        </div>

        {/* Step 4: Done */}
        <div style={{ background: `${NAVY}`, border: `1px solid ${NAVY}`, padding: '18px 20px', borderRadius: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD }}>Trigger Active — Monitoring 6 Signals</div>
          </div>
          <div style={{ marginLeft: 34, fontSize: 12, color: '#D1D5DB', lineHeight: 1.7 }}>
            <span style={{ color: GOLD, fontWeight: 700 }}>Customer Churn Risk</span> is now live. When 3 or more selected signals breach their thresholds, the system notifies your executive team and the <span style={{ color: TEAL, fontWeight: 700 }}>Customer Churn Response Protocol (#89)</span> surfaces for authorization — pre-staged and ready in 12 minutes.
          </div>
        </div>
      </div>

      {/* Board Assessment */}
      <div style={{ marginTop: 28, padding: '16px 20px', background: NAVY, borderRadius: 2 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>Board Assessment — Model B</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: GREEN, marginBottom: 6 }}>✓ Strengths</div>
            {[
              '"What situation?" is the right first question for an executive',
              'System does the heavy lifting — pre-selects signals',
              '3 steps vs 5 steps; one concept (Trigger) not four layers',
              'Threshold logic still fully configurable — power preserved',
              'Maps directly to the product thesis: Preparation → Readiness → Fearless',
            ].map(s => <div key={s} style={{ fontSize: 10, color: '#D1D5DB', marginBottom: 4, paddingLeft: 10, borderLeft: `2px solid ${GREEN}40` }}>{s}</div>)}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: RED, marginBottom: 6 }}>✗ Risks</div>
            {[
              'Requires rebuilding the wizard (1–2 day engineering effort)',
              'Need to decide: how many signals must fire before trigger activates?',
              'Loses per-rule severity granularity — must roll up differently',
              'Existing saved rules need migration to new "situation" model',
            ].map(s => <div key={s} style={{ fontSize: 10, color: '#D1D5DB', marginBottom: 4, paddingLeft: 10, borderLeft: `2px solid ${RED}40` }}>{s}</div>)}
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '10px 14px', background: `${GOLD}15`, borderLeft: `3px solid ${GOLD}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, marginBottom: 4 }}>Board Verdict — Gates / Buffett / Blakely aligned</div>
          <div style={{ fontSize: 11, color: '#E5E7EB', lineHeight: 1.6 }}>
            This is the correct model for the product thesis. "What situation are you preparing for?" is an executive question. "Which metric threshold should I configure?" is an IT question. The platform sells readiness — the experience must feel like readiness from step one. Model B is the right long-term direction. The question is timing: pre-Wayne Roye call or post?
          </div>
        </div>
      </div>
    </div>
  );
}
