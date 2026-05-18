import { Info } from 'lucide-react';

const NAVY  = '#0A0F2E';
const TEAL  = '#2B8A6E';
const GOLD  = '#C9A84C';

interface WhyThisMattersProps {
  eyebrow?: string;
  headline: string;
  body: string;
  metric?: { value: string; label: string };
  dark?: boolean;
}

export default function WhyThisMatters({
  eyebrow = 'Why this matters',
  headline,
  body,
  metric,
  dark = false,
}: WhyThisMattersProps) {
  if (dark) {
    return (
      <div style={{
        borderLeft: `3px solid ${TEAL}`,
        padding: '10px 20px',
        background: 'rgba(43,138,110,0.10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: 2 }}>{eyebrow}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{headline}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{body}</div>
        </div>
        {metric && (
          <div style={{ textAlign: 'center', flexShrink: 0, border: `1px solid rgba(43,138,110,0.3)`, padding: '8px 16px', background: 'rgba(43,138,110,0.08)' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: TEAL, fontFamily: "'Cormorant Garamond', serif" }}>{metric.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>{metric.label}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(43,138,110,0.05)',
      borderLeft: `3px solid ${TEAL}`,
      padding: '11px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Info size={14} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: 2 }}>{eyebrow}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 1 }}>{headline}</div>
          <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.55 }}>{body}</div>
        </div>
      </div>
      {metric && (
        <div style={{ textAlign: 'center', flexShrink: 0, background: '#fff', border: `1px solid rgba(43,138,110,0.2)`, padding: '6px 14px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: TEAL, fontFamily: "'Cormorant Garamond', serif" }}>{metric.value}</div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF' }}>{metric.label}</div>
        </div>
      )}
    </div>
  );
}
