import { useId } from 'react';
import type { FC } from 'react';

interface VaughnMartinLogoProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon-only' | 'text-only';
  showTagline?: boolean;
  className?: string;
  color?: 'navy' | 'gold' | 'teal' | 'white';
}

const NAVY     = '#0A0F2E';
const GOLD     = '#C9A84C';
const GOLD_LT  = '#DFC178';
const TEAL     = '#2B8A6E';
const TEAL_LT  = '#3BAF8A';
const OFF_WHITE = '#FDFCFA';

const VaughnMartinSeal: FC<{ size: number; color: string }> = ({ size, color }) => {
  const uid = useId().replace(/:/g, 's');

  const onDark  = color === 'white' || color === 'teal';
  const onGold  = color === 'gold';

  const ring    = onGold ? 'rgba(10,15,46,0.55)' : GOLD_LT;
  const mark    = onGold ? NAVY : GOLD;
  const sub     = onDark ? TEAL_LT : onGold ? 'rgba(10,15,46,0.55)' : TEAL;
  const bgStop1 = onDark ? '#1a2860' : onGold ? '#DFC178' : '#F0EDE4';
  const bgStop2 = onDark ? NAVY      : onGold ? '#C9A84C' : '#F8F7F4';

  const gradId1  = `${uid}rg`;
  const gradId2  = `${uid}ig`;
  const glowId   = `${uid}glow`;
  const topArcId = `${uid}ta`;
  const botArcId = `${uid}ba`;

  const cardinalTicks = [0, 90, 180, 270].map(a => {
    const r1 = 94, r2 = 80, rad = a * Math.PI / 180;
    return { x1: 100 + r1 * Math.sin(rad), y1: 100 - r1 * Math.cos(rad),
             x2: 100 + r2 * Math.sin(rad), y2: 100 - r2 * Math.cos(rad) };
  });

  const diagonalTicks = [45, 135, 225, 315].map(a => {
    const r1 = 93, r2 = 84, rad = a * Math.PI / 180;
    return { x1: 100 + r1 * Math.sin(rad), y1: 100 - r1 * Math.cos(rad),
             x2: 100 + r2 * Math.sin(rad), y2: 100 - r2 * Math.cos(rad) };
  });

  const minorTicks = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(a => {
    const r1 = 92, r2 = 87, rad = a * Math.PI / 180;
    return { x1: 100 + r1 * Math.sin(rad), y1: 100 - r1 * Math.cos(rad),
             x2: 100 + r2 * Math.sin(rad), y2: 100 - r2 * Math.cos(rad) };
  });

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id={gradId1} cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor={GOLD_LT} />
          <stop offset="50%"  stopColor={GOLD} />
          <stop offset="100%" stopColor="#A07830" />
        </radialGradient>
        <radialGradient id={gradId2} cx="50%" cy="20%" r="80%">
          <stop offset="0%"   stopColor={bgStop1} />
          <stop offset="100%" stopColor={bgStop2} />
        </radialGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer ring glow */}
      <circle cx="100" cy="100" r="98" stroke={ring} strokeWidth="0.5" opacity="0.3"/>
      {/* Main outer ring — gradient */}
      <circle cx="100" cy="100" r="94" stroke={`url(#${gradId1})`} strokeWidth="2.5"/>
      {/* Second ring */}
      <circle cx="100" cy="100" r="88" stroke={ring} strokeWidth="0.8" opacity="0.4"/>
      {/* Third ring */}
      <circle cx="100" cy="100" r="82" stroke={ring} strokeWidth="0.4" opacity="0.3"/>
      {/* Interior fill */}
      <circle cx="100" cy="100" r="80" fill={`url(#${gradId2})`}/>
      {/* Inner accent ring */}
      <circle cx="100" cy="100" r="74" stroke={ring} strokeWidth="0.5" opacity="0.25"/>

      {/* Cardinal tick marks */}
      {cardinalTicks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={ring} strokeWidth="3" strokeLinecap="round"/>
      ))}
      {/* Diagonal tick marks */}
      {diagonalTicks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={ring} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      ))}
      {/* Minor tick marks */}
      {minorTicks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={ring} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
      ))}

      {/* Diamond accents — N S E W */}
      <polygon points="100,3 103.5,8 100,13 96.5,8"   fill={ring}/>
      <polygon points="100,187 103.5,192 100,197 96.5,192" fill={ring}/>
      <polygon points="3,100 8,96.5 13,100 8,103.5"   fill={ring}/>
      <polygon points="187,100 192,96.5 197,100 192,103.5" fill={ring}/>

      {/* Arc text — top: VAUGHNMARTIN · EST. 2023 */}
      <path id={topArcId} d="M 24,100 A 76,76 0 0,1 176,100" fill="none"/>
      <text fontFamily="'Barlow Condensed', sans-serif" fontSize="9" fontWeight="700"
        letterSpacing="4" fill={mark} opacity="0.8" textAnchor="middle">
        <textPath href={`#${topArcId}`} startOffset="50%">VAUGHNMARTIN · EST. 2023</textPath>
      </text>

      {/* Arc text — bottom: READINESS OS (locked) */}
      <path id={botArcId} d="M 30,100 A 70,70 0 0,0 170,100" fill="none"/>
      <text fontFamily="'Barlow Condensed', sans-serif" fontSize="8.5" fontWeight="700"
        letterSpacing="5" fill={sub} opacity="0.85" textAnchor="middle">
        <textPath href={`#${botArcId}`} startOffset="50%">READINESS  OS</textPath>
      </text>

      {/* VM Monogram */}
      <text x="100" y="96" textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="34" fontWeight="700" fill={mark} letterSpacing="3"
        filter={`url(#${glowId})`}>
        VM
      </text>

      {/* Horizontal rule flanking VM */}
      <line x1="60" y1="103" x2="138" y2="103" stroke={ring} strokeWidth="1" opacity="0.5"/>

      {/* READINESS OS — center sub-label */}
      <text x="100" y="118" textAnchor="middle"
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="8.5" fontWeight="700" fill={sub} letterSpacing="5">
        READINESS OS
      </text>
    </svg>
  );
};

export const VaughnMartinLogo: FC<VaughnMartinLogoProps> = ({
  width,
  height = 48,
  variant = 'full',
  className = '',
  color = 'navy',
}) => {
  const onDark = color === 'white' || color === 'teal';
  const onGold = color === 'gold';

  const wordmarkColor = onDark ? OFF_WHITE : NAVY;
  const osColor       = onGold ? 'rgba(10,15,46,0.65)' : onDark ? GOLD_LT : GOLD;
  const ruleColor     = onGold ? 'rgba(10,15,46,0.35)' : onDark ? GOLD_LT : GOLD;

  const sealSize   = width ?? height;
  const iconSz     = Math.round(height * 0.88);
  const wordmarkSz = 26;
  const productSz  = 10.5;
  const gap        = 16;

  if (variant === 'icon-only') {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <VaughnMartinSeal size={sealSize} color={color} />
      </span>
    );
  }

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
            Readiness OS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: `${gap}px` }}>
      <VaughnMartinSeal size={iconSz} color={color} />
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
            Readiness OS
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExecuteIQLogo = VaughnMartinLogo;
export default ExecuteIQLogo;
