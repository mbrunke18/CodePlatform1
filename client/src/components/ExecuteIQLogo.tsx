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

export const ExecuteIQLogo: FC<ExecuteIQLogoProps> = ({
  width,
  height = 48,
  variant = 'full',
  showTagline = false,
  className = '',
  color = 'navy',
}) => {
  const isDark = color === 'white';

  const wordExecColor = isDark ? '#F0EDE4' : '#0A0F2E';
  const wordOsColor  = isDark ? '#EDD98A' : '#C9A84C';

  if (variant === 'icon-only') {
    const size = width ?? height;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="exos-arrow-grad" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isDark ? '#F5EBC4' : '#0A0F2E'} />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
          <linearGradient id="exos-trail-grad" x1="0" y1="26" x2="52" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <line x1="4"  y1="18" x2="32" y2="18" stroke="url(#exos-trail-grad)" strokeWidth="2" />
        <line x1="8"  y1="26" x2="36" y2="26" stroke="url(#exos-trail-grad)" strokeWidth="1.5" opacity="0.7" />
        <line x1="4"  y1="34" x2="32" y2="34" stroke="url(#exos-trail-grad)" strokeWidth="2" />
        <path d="M28 10 L48 26 L28 42" stroke="url(#exos-arrow-grad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 10 L40 26 L20 42" stroke="url(#exos-arrow-grad)" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      </svg>
    );
  }

  if (variant === 'text-only') {
    const h = height;
    return (
      <div className={className} style={{ lineHeight: 1 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', 'Montserrat', sans-serif",
          fontSize: `${h * 0.55}px`,
          fontWeight: 800,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: wordExecColor,
        }}>
          EXECUTION
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: `${h * 0.24}px`,
          fontWeight: 400,
          letterSpacing: '0.30em',
          textTransform: 'uppercase',
          color: wordOsColor,
          marginTop: '2px',
        }}>
          OPERATING SYSTEM
        </div>
        {showTagline && (
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: `${h * 0.16}px`,
            fontWeight: 300,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginTop: '6px',
          }}>
            Prepared to Respond.
          </div>
        )}
      </div>
    );
  }

  const svgH = height;
  const svgW = width ?? Math.round(svgH * (300 / 54));
  const scale = svgH / 54;
  const iconSize = Math.round(52 * scale);
  const textX = iconSize + Math.round(14 * scale);
  const exec_y = Math.round(34 * scale);
  const os_y   = Math.round(50 * scale);
  const execFontSize = Math.round(28 * scale);
  const osFontSize   = Math.round(13 * scale);

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="exos-full-arrow" x1="0" y1="0" x2={iconSize} y2={iconSize} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? '#F5EBC4' : '#0A0F2E'} />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
        <linearGradient id="exos-full-trail" x1="0" y1={iconSize / 2} x2={iconSize} y2={iconSize / 2} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g transform={`scale(${scale})`}>
        <line x1="4"  y1="18" x2="32" y2="18" stroke="url(#exos-full-trail)" strokeWidth="2" />
        <line x1="8"  y1="26" x2="36" y2="26" stroke="url(#exos-full-trail)" strokeWidth="1.5" opacity="0.7" />
        <line x1="4"  y1="34" x2="32" y2="34" stroke="url(#exos-full-trail)" strokeWidth="2" />
        <path d="M28 10 L48 26 L28 42" stroke="url(#exos-full-arrow)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M20 10 L40 26 L20 42" stroke="url(#exos-full-arrow)" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
      </g>

      <text
        x={textX}
        y={exec_y}
        fontFamily="'Barlow Condensed', 'Montserrat', sans-serif"
        fontSize={execFontSize}
        fontWeight="800"
        letterSpacing={Math.round(execFontSize * 0.10)}
        fill={wordExecColor}
      >EXECUTION</text>

      <text
        x={textX}
        y={os_y}
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize={osFontSize}
        fontWeight="400"
        letterSpacing={Math.round(osFontSize * 0.35)}
        fill={wordOsColor}
      >OPERATING SYSTEM</text>
    </svg>
  );
};

export default ExecuteIQLogo;
