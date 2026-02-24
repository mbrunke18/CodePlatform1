import type { FC } from 'react';

interface VaughnMartinLogoProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon-only';
  className?: string;
  color?: 'dark' | 'light';
}

export const VaughnMartinLogo: FC<VaughnMartinLogoProps> = ({
  width,
  height = 48,
  variant = 'full',
  className = '',
  color = 'dark',
}) => {
  const isDark = color === 'dark';

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
          <linearGradient id="vm-v-grad1" x1="26" y1="52" x2="26" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#F5EBC4" />
          </linearGradient>
          <linearGradient id="vm-v-grad2" x1="26" y1="52" x2="26" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EDD98A" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path d="M6 8 L26 44 L46 8"  stroke="url(#vm-v-grad1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 8 L26 34 L38 8" stroke="url(#vm-v-grad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="26" cy="5" r="3" fill="url(#vm-v-grad1)" />
      </svg>
    );
  }

  const svgH = height;
  const svgW = width ?? Math.round(svgH * (320 / 54));
  const scale = svgH / 54;
  const iconSize = Math.round(52 * scale);
  const textX = iconSize + Math.round(14 * scale);
  const name_y    = Math.round(34 * scale);
  const tagline_y = Math.round(49 * scale);
  const nameFontSize    = Math.round(26 * scale);
  const taglineFontSize = Math.round(9  * scale);

  const nameColor    = isDark ? '#F0EDE4' : '#0A0F2E';
  const taglineColor = isDark ? '#EDD98A' : '#C9A84C';

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="vm-full-grad1" x1="0" y1={iconSize} x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor={isDark ? '#F5EBC4' : '#C9A84C'} />
        </linearGradient>
        <linearGradient id="vm-full-grad2" x1="0" y1={iconSize} x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
          <stop offset="100%" stopColor={isDark ? '#EDD98A' : '#C9A84C'} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <g transform={`scale(${scale})`}>
        <path d="M6 8 L26 44 L46 8"  stroke="url(#vm-full-grad1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 8 L26 34 L38 8" stroke="url(#vm-full-grad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="26" cy="5" r="3" fill="url(#vm-full-grad1)" />
      </g>

      <text
        x={textX}
        y={name_y}
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize={nameFontSize}
        fontWeight="600"
        letterSpacing={Math.round(nameFontSize * 0.08)}
        fill={nameColor}
      >VaughnMartin</text>

      <text
        x={textX}
        y={tagline_y}
        fontFamily="'Barlow', sans-serif"
        fontSize={taglineFontSize}
        fontWeight="400"
        letterSpacing={Math.round(taglineFontSize * 0.30)}
        fill={taglineColor}
      >STRATEGIC EXECUTION · ELITE METHODOLOGY</text>
    </svg>
  );
};

export default VaughnMartinLogo;
