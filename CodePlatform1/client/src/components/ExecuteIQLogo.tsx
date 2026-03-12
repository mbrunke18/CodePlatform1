import type { FC } from 'react';

interface ExecuteIQLogoProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon-only' | 'text-only';
  showTagline?: boolean;
  className?: string;
  color?: 'navy' | 'gold' | 'teal' | 'white';
  animate?: boolean;
}

const NAVY     = '#0A0F2E';
const GOLD     = '#C9A84C';
const GOLD_LT  = '#DFC178';
const OFF_WHITE = '#FDFCFA';

export const ExecuteIQLogo: FC<ExecuteIQLogoProps> = ({
  width,
  height = 48,
  variant = 'full',
  showTagline = false,
  className = '',
  color = 'navy',
}) => {
  const onDark = color === 'white' || color === 'teal';
  const onGold = color === 'gold';

  const markStroke    = onGold ? NAVY      : GOLD;
  const markBg        = onGold ? 'rgba(10,15,46,0.08)'  : onDark ? 'rgba(201,168,76,0.10)' : 'rgba(201,168,76,0.07)';
  const markBorder    = onGold ? 'rgba(10,15,46,0.15)'  : onDark ? 'rgba(201,168,76,0.22)' : 'rgba(201,168,76,0.22)';
  const innerStroke   = onGold ? 'rgba(10,15,46,0.20)'  : 'rgba(201,168,76,0.28)';
  const dotFill       = onGold ? NAVY      : GOLD;
  const wordmarkColor = onDark ? OFF_WHITE : NAVY;
  const osColor       = onGold ? 'rgba(10,15,46,0.65)' : onDark ? GOLD_LT : GOLD;
  const ruleColor     = onGold ? 'rgba(10,15,46,0.35)' : onDark ? GOLD_LT : GOLD;

  const iconSVG = (size: number) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect width="64" height="64" rx="5" fill={markBg} />
      <rect width="64" height="64" rx="5" stroke={markBorder} strokeWidth="1" fill="none" />
      <path
        d="M12 16 L32 52 L52 16"
        stroke={markStroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M22 16 L32 36 L42 16"
        stroke={innerStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="11" r="3" fill={dotFill} />
    </svg>
  );

  if (variant === 'icon-only') {
    const sz = width ?? height;
    return (
      <div className={className}>
        {iconSVG(sz)}
      </div>
    );
  }

  const iconSz      = Math.round(height * 0.68);
  const wordmarkSz  = Math.round(height * 0.44);
  const productSz   = Math.round(height * 0.175);
  const gap         = Math.round(height * 0.25);

  if (variant === 'text-only') {
    return (
      <div className={className} style={{ lineHeight: 1 }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: `${wordmarkSz}px`,
          fontWeight: 600,
          letterSpacing: '0.015em',
          color: wordmarkColor,
          lineHeight: 1,
        }}>
          VaughnMartin
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '4px' }}>
          <div style={{ width: '22px', height: '1px', background: ruleColor, flexShrink: 0 }} />
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: `${productSz}px`,
            fontWeight: 700,
            letterSpacing: '0.34em',
            textTransform: 'uppercase' as const,
            color: osColor,
          }}>
            Execution OS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: `${gap}px` }}
    >
      {iconSVG(iconSz)}
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: `${wordmarkSz}px`,
          fontWeight: 600,
          letterSpacing: '0.015em',
          color: wordmarkColor,
          lineHeight: 1,
        }}>
          VaughnMartin
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '3px' }}>
          <div style={{ width: '22px', height: '1px', background: ruleColor, flexShrink: 0 }} />
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: `${productSz}px`,
            fontWeight: 700,
            letterSpacing: '0.34em',
            textTransform: 'uppercase' as const,
            color: osColor,
          }}>
            Execution OS
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecuteIQLogo;
