const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

export interface SectionLabelProps {
  overline: string;
  heading: string;
  headingSize?: string;
  dark?: boolean;
  centered?: boolean;
  className?: string;
}

export function SectionLabel({ overline, heading, headingSize = 'clamp(28px,4vw,40px)', dark = false, centered = false, className = '' }: SectionLabelProps) {
  return (
    <div className={className} style={{ textAlign: centered ? 'center' : 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, justifyContent: centered ? 'center' : 'flex-start' }}>
        <div style={{ width: 20, height: 1.5, background: '#C9A84C', flexShrink: 0 }} />
        <span style={{ ...BC, fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: dark ? 'rgba(201,168,76,0.88)' : '#C9A84C' }}>
          {overline}
        </span>
        {centered && <div style={{ width: 20, height: 1.5, background: '#C9A84C', flexShrink: 0 }} />}
      </div>
      <h2 style={{ ...CG, fontSize: headingSize, fontWeight: 700, color: dark ? '#fff' : '#0A0F2E', lineHeight: 1.2, margin: 0 }}>
        {heading}
      </h2>
    </div>
  );
}

export interface EditorialStatProps {
  value: string;
  label: string;
  sub?: string;
  color?: string;
  dark?: boolean;
}

export function EditorialStat({ value, label, sub, color = '#C9A84C', dark = false }: EditorialStatProps) {
  return (
    <div>
      <div style={{ ...CG, fontSize: 40, fontWeight: 700, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ width: 20, height: 1, background: `${color}55`, margin: '8px 0 6px' }} />
      <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.72)' : '#6B7280' }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.58)' : '#6B7280', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export interface GoldRuleProps {
  style?: React.CSSProperties;
  className?: string;
  dark?: boolean;
  width?: string | number;
  centered?: boolean;
}

export function GoldRule({ style, className, dark = false, width = '100%', centered = false }: GoldRuleProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height: 1,
        background: dark ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.3)',
        margin: centered ? '0 auto' : undefined,
        ...style,
      }}
    />
  );
}
