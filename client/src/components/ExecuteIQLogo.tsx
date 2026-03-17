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
const OFF_WHITE = '#FDFCFA';

const VaughnMartinSeal: FC<{ size: number; color: string }> = ({ size, color }) => {
  const uid = useId().replace(/:/g, 's');

  const onDark  = color === 'white' || color === 'teal'; // dark bg → gold elements
  const onGold  = color === 'gold';                      // gold bg → navy elements
  const onLight = color === 'navy';                      // white/light bg → navy elements, gold dot accent

  const gradId1   = `${uid}g1`;
  const gradId2   = `${uid}g2`;
  const topArcId  = `${uid}ta`;
  const botArcId  = `${uid}ba`;

  // Light bg (navy): dark navy elements — maximum contrast on white
  // Dark bg (white/teal): gold elements — glows against navy
  // Gold bg (gold): navy elements
  const ringStroke  = onLight ? 'rgba(10,15,46,0.70)' : onGold ? NAVY  : `url(#${gradId1})`;
  const ringStroke2 = onLight ? 'rgba(10,15,46,0.18)' : onGold ? 'rgba(10,15,46,0.18)' : 'rgba(201,168,76,0.35)';
  const tickMain    = onLight ? NAVY   : onGold ? NAVY  : GOLD;
  const tickMainOp  = onLight ? 0.65  : onGold ? 0.60  : 1;
  const tickDiag    = onLight ? 'rgba(10,15,46,0.22)' : onGold ? 'rgba(10,15,46,0.25)' : 'rgba(201,168,76,0.6)';
  const interior    = onLight ? 'transparent'         : onGold ? 'rgba(10,15,46,0.12)' : 'rgba(8,10,30,0.60)';
  const vmStroke    = onLight ? 'rgba(10,15,46,0.82)' : onGold ? NAVY  : `url(#${gradId2})`;
  const vmInner     = onLight ? 'rgba(10,15,46,0.14)' : onGold ? 'rgba(10,15,46,0.18)' : 'rgba(201,168,76,0.22)';
  const topText     = onLight ? NAVY   : onGold ? NAVY  : GOLD;
  const topTextOp   = onLight ? 0.78  : onGold ? 0.75  : 1;
  const botText     = onLight ? '#2B8A6E'              : onGold ? 'rgba(10,15,46,0.55)' : 'rgba(201,168,76,0.60)';
  const line1       = onLight ? 'rgba(10,15,46,0.14)' : onGold ? 'rgba(10,15,46,0.18)' : 'rgba(201,168,76,0.35)';
  const line2       = onLight ? 'rgba(10,15,46,0.09)' : onGold ? 'rgba(10,15,46,0.12)' : 'rgba(201,168,76,0.22)';
  const dotFill     = GOLD; // gold dot is always the accent — never changes
  const diaFill     = onLight ? GOLD   : onGold ? NAVY  : GOLD;
  const botDot      = onLight ? 'rgba(201,168,76,0.70)' : onGold ? 'rgba(10,15,46,0.4)' : 'rgba(201,168,76,0.65)';

  const defs = (
    <defs>
      <linearGradient id={gradId1} x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#EDD98A"/>
        <stop offset="45%"  stopColor="#C9A84C"/>
        <stop offset="100%" stopColor="#8A6E30"/>
      </linearGradient>
      <linearGradient id={gradId2} x1="0" y1="200" x2="200" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#8A6E30"/>
        <stop offset="55%"  stopColor="#C9A84C"/>
        <stop offset="100%" stopColor="#EDD98A"/>
      </linearGradient>
    </defs>
  );

  /* ── Simplified seal for small sizes (< 60px) ────────────────────────
     Below 60px the arc text and fine detail become sub-pixel.
     Show only: bold outer ring, inner ring, 4 cardinal ticks, VM monogram, gold dot.
  ──────────────────────────────────────────────────────────────────────── */
  if (size < 60) {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        {defs}
        <circle cx="100" cy="100" r="95" stroke={ringStroke}  strokeWidth="5.5" fill="none"/>
        <circle cx="100" cy="100" r="84" stroke={ringStroke2} strokeWidth="1.5" fill="none"/>
        <circle cx="100" cy="100" r="83" fill={interior}/>
        <line x1="100" y1="5"   x2="100" y2="17"  stroke={tickMain} strokeWidth="4" strokeLinecap="round" opacity={tickMainOp}/>
        <line x1="100" y1="183" x2="100" y2="195" stroke={tickMain} strokeWidth="4" strokeLinecap="round" opacity={tickMainOp}/>
        <line x1="5"   y1="100" x2="17"  y2="100" stroke={tickMain} strokeWidth="4" strokeLinecap="round" opacity={tickMainOp}/>
        <line x1="183" y1="100" x2="195" y2="100" stroke={tickMain} strokeWidth="4" strokeLinecap="round" opacity={tickMainOp}/>
        <path d="M 66 72 L 100 122 L 134 72" stroke={vmStroke} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="100" cy="66" r="6" fill={dotFill}/>
      </svg>
    );
  }

  /* ── Full-detail seal for larger sizes ──────────────────────────────── */
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {defs}

      {/* Outer ring — gold gradient or navy */}
      <circle cx="100" cy="100" r="95" stroke={ringStroke} strokeWidth="3.5" fill="none"/>
      {/* Inner ring — breathing room */}
      <circle cx="100" cy="100" r="86" stroke={ringStroke2} strokeWidth="1" fill="none"/>

      {/* Cardinal tick marks — N S E W */}
      <line x1="100" y1="7"   x2="100" y2="16"  stroke={tickMain} strokeWidth="2.5" strokeLinecap="round" opacity={tickMainOp}/>
      <line x1="100" y1="184" x2="100" y2="193" stroke={tickMain} strokeWidth="2.5" strokeLinecap="round" opacity={tickMainOp}/>
      <line x1="7"   y1="100" x2="16"  y2="100" stroke={tickMain} strokeWidth="2.5" strokeLinecap="round" opacity={tickMainOp}/>
      <line x1="184" y1="100" x2="193" y2="100" stroke={tickMain} strokeWidth="2.5" strokeLinecap="round" opacity={tickMainOp}/>

      {/* Diagonal tick marks — corners */}
      <line x1="27"  y1="27"  x2="33"  y2="33"  stroke={tickDiag} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="173" y1="27"  x2="167" y2="33"  stroke={tickDiag} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="27"  y1="173" x2="33"  y2="167" stroke={tickDiag} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="173" y1="173" x2="167" y2="167" stroke={tickDiag} strokeWidth="1.5" strokeLinecap="round"/>

      {/* Interior field */}
      <circle cx="100" cy="100" r="85" fill={interior}/>

      {/* Arc text — VAUGHNMARTIN on top */}
      <path id={topArcId} d="M 22,100 A 78,78 0 0,1 178,100" fill="none"/>
      <text fontFamily="'Barlow Condensed', sans-serif" fontSize="13" fontWeight="700" letterSpacing="5" fill={topText} textAnchor="middle" opacity={topTextOp}>
        <textPath href={`#${topArcId}`} startOffset="50%">VAUGHNMARTIN</textPath>
      </text>

      {/* Arc text — EXECUTION OS on bottom */}
      <path id={botArcId} d="M 28,108 A 78,78 0 0,0 172,108" fill="none"/>
      <text fontFamily="'Barlow Condensed', sans-serif" fontSize="10.5" fontWeight="700" letterSpacing="5.5" fill={botText} textAnchor="middle">
        <textPath href={`#${botArcId}`} startOffset="50%">EXECUTION  OS</textPath>
      </text>

      {/* Horizontal dividers flanking VM */}
      <line x1="28"  y1="93"  x2="70"  y2="93"  stroke={line1} strokeWidth="0.75"/>
      <line x1="130" y1="93"  x2="172" y2="93"  stroke={line1} strokeWidth="0.75"/>
      <line x1="28"  y1="120" x2="68"  y2="120" stroke={line2} strokeWidth="0.75"/>
      <line x1="132" y1="120" x2="172" y2="120" stroke={line2} strokeWidth="0.75"/>

      {/* VM monogram — outer stroke */}
      <path d="M 72 78 L 100 118 L 128 78" stroke={vmStroke} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* VM monogram — inner echo */}
      <path d="M 82 78 L 100 108 L 118 78" stroke={vmInner} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

      {/* Gold dot — the fearless moment */}
      <circle cx="100" cy="73" r="4" fill={dotFill}/>
      <line x1="100" y1="65" x2="100" y2="62" stroke="rgba(201,168,76,0.5)" strokeWidth="1" strokeLinecap="round"/>
      <line x1="106" y1="67" x2="108" y2="64" stroke="rgba(201,168,76,0.35)" strokeWidth="1" strokeLinecap="round"/>
      <line x1="94"  y1="67" x2="92"  y2="64" stroke="rgba(201,168,76,0.35)" strokeWidth="1" strokeLinecap="round"/>

      {/* Diamond ornaments */}
      <path d="M 52 106 L 56 100 L 52 94 L 48 100 Z" fill={diaFill} opacity="0.7"/>
      <path d="M 148 106 L 152 100 L 148 94 L 144 100 Z" fill={diaFill} opacity="0.7"/>

      {/* Bottom ornament */}
      <line x1="60"  y1="132" x2="95"  y2="132" stroke="rgba(201,168,76,0.4)" strokeWidth="0.75"/>
      <line x1="105" y1="132" x2="140" y2="132" stroke="rgba(201,168,76,0.4)" strokeWidth="0.75"/>
      <circle cx="100" cy="132" r="2.5" fill={botDot}/>

      {/* Outer ring depth overlay */}
      <circle cx="100" cy="100" r="95" stroke="rgba(237,217,138,0.12)" strokeWidth="1" fill="none"/>
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

  const sealSize    = width ?? height;
  const iconSz      = Math.round(height * 0.80);
  const wordmarkSz  = Math.round(height * 0.44);
  const productSz   = Math.round(height * 0.175);
  const gap         = Math.round(height * 0.28);

  if (variant === 'icon-only') {
    return (
      <div className={className}>
        <VaughnMartinSeal size={sealSize} color={color} />
      </div>
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
            Execution OS
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
            Execution OS
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExecuteIQLogo = VaughnMartinLogo;
export default ExecuteIQLogo;
