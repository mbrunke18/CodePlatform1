import { useState } from 'react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";

const DECISIONS = [
  {
    id: 'run',
    label: 'Run as built',
    sub: 'Execute the pre-staged protocol exactly as designed. All tasks deploy on the system-recommended sequence with pre-authorized ownership.',
    recommended: true,
  },
  {
    id: 'audible',
    label: 'Audible to different',
    sub: 'Switch to an alternate Readiness Protocol for this trigger. System surfaces the next-best matched protocol before execution begins.',
    recommended: false,
  },
  {
    id: 'customize',
    label: 'Customize on the fly',
    sub: 'Adjust task owners, priorities, or authorization thresholds before execution begins. Protocol structure holds; specifics are yours to modify.',
    recommended: false,
  },
  {
    id: 'hold',
    label: 'Do nothing',
    sub: 'Continue monitoring. No tasks deploy. System maintains situational awareness and re-presents at next escalation threshold.',
    recommended: false,
  },
];

interface ExecutiveDecisionPanelProps {
  onProceed: () => void;
}

export function ExecutiveDecisionPanel({ onProceed }: ExecutiveDecisionPanelProps) {
  const [selected, setSelected] = useState('run');

  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 20, height: 1, background: GOLD }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: GOLD }}>
          Executive Decision Required
        </span>
      </div>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 20, lineHeight: 1.6 }}>
        The response is pre-staged. The decision is yours. Choose how to execute.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 28 }}>
        {DECISIONS.map(d => {
          const isSelected = selected === d.id;
          const borderColor = isSelected
            ? (d.recommended ? GOLD : 'rgba(255,255,255,0.45)')
            : 'rgba(255,255,255,0.1)';
          return (
            <button
              key={d.id}
              onClick={() => setSelected(d.id)}
              style={{
                background: isSelected
                  ? (d.recommended ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.06)')
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${borderColor}`,
                borderLeft: `4px solid ${borderColor}`,
                padding: '18px 20px',
                textAlign: 'left' as const,
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: isSelected ? (d.recommended ? GOLD : '#fff') : 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.02em',
                }}>
                  {d.label}
                </span>
                {d.recommended && (
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, padding: '2px 8px', background: 'rgba(201,168,76,0.18)', color: GOLD, border: '1px solid rgba(201,168,76,0.4)', whiteSpace: 'nowrap' as const }}>
                    RECOMMENDED
                  </span>
                )}
                {isSelected && !d.recommended && (
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '2px 8px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap' as const }}>
                    SELECTED
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12, color: isSelected ? 'rgba(255,255,255,0.68)' : 'rgba(255,255,255,0.32)', lineHeight: 1.55, margin: 0 }}>
                {d.sub}
              </p>
            </button>
          );
        })}
      </div>
      <div style={{ textAlign: 'center' as const }}>
        <button
          onClick={onProceed}
          style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '14px 48px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}
        >
          Authorize &amp; Execute →
        </button>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', marginTop: 12, letterSpacing: '0.04em' }}>
          No execution begins until you authorize. Executive authority preserved at every step.
        </p>
      </div>
    </div>
  );
}
