import { useState, useEffect, useId } from 'react';
import type { FC } from 'react';

interface VaughnMartinLogoProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon-only' | 'text-only';
  showTagline?: boolean;
  className?: string;
  color?: 'navy' | 'gold' | 'teal' | 'white';
  animated?: boolean;
}

const NAVY    = '#0A0F2E';
const GOLD    = '#C9A84C';
const GOLD_LT = '#DFC178';
const TEAL    = '#2B8A6E';
const TEAL_LT = '#3BAF8A';
const SIGNAL  = '#00E5C4';
const OFF_WHITE = '#FDFCFA';

// ── TechSeal — animated intelligence seal ─────────────────────────────────────
const TechSeal: FC<{ size: number; color: string; animated?: boolean }> = ({
  size,
  animated = false,
}) => {
  const uid = useId().replace(/:/g, 's');
  const [tick, setTick] = useState(0);
  const [scan, setScan] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const t = setInterval(() => {
      setTick(n => n + 1);
      setScan(a => (a + 1.5) % 360);
    }, 50);
    return () => clearInterval(t);
  }, [animated]);

  // Fixed 200×200 internal coordinate system — scales cleanly to any rendered size
  const VB = 200;
  const cx = 100, cy = 100, r = 86;
  const scanRad = (scan - 90) * Math.PI / 180;
  const pulse   = 0.4 + 0.6 * Math.sin(tick * 0.12);

  const gradId  = `${uid}grad`;
  const goldG   = `${uid}goldG`;
  const glowId  = `${uid}glow`;
  const topArc  = `${uid}ta`;
  const botArc  = `${uid}ba`;

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${VB} ${VB}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#1a2860"/>
          <stop offset="100%" stopColor={NAVY}/>
        </radialGradient>
        <linearGradient id={goldG} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={GOLD_LT}/>
          <stop offset="50%"  stopColor={GOLD}/>
          <stop offset="100%" stopColor="#8B6212"/>
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="1.2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background fill */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId})`}/>

      {/* Outer rings */}
      <circle cx={cx} cy={cy} r={r + 2}   fill="none" stroke={GOLD}   strokeWidth="1"   opacity="0.85"/>
      <circle cx={cx} cy={cy} r={r - 2}   fill="none" stroke={SIGNAL} strokeWidth="0.6" opacity="0.25"/>
      <circle cx={cx} cy={cy} r={r - 5}   fill="none" stroke={GOLD}   strokeWidth="0.4" opacity="0.2"/>

      {/* Dashed inner accent ring */}
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke={SIGNAL}
        strokeWidth="0.4" strokeDasharray="10 30" opacity="0.1"/>

      {/* Live radar scan line */}
      {animated && (
        <line
          x1={cx} y1={cy}
          x2={cx + Math.cos(scanRad) * r * 0.9}
          y2={cy + Math.sin(scanRad) * r * 0.9}
          stroke={SIGNAL} strokeWidth="1.2" opacity="0.55"
          filter={`url(#${glowId})`}/>
      )}

      {/* Tick marks — 36 around the ring */}
      {Array.from({ length: 36 }, (_, i) => {
        const a  = (i * 10 - 90) * Math.PI / 180;
        const r1 = r + 2;
        const r2 = i % 9 === 0 ? r - 6 : r - 3;
        return (
          <line key={i}
            x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
            x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
            stroke={i % 9 === 0 ? GOLD : SIGNAL}
            strokeWidth={i % 9 === 0 ? 1.5 : 0.6}
            opacity={i % 9 === 0 ? 0.85 : 0.22}/>
        );
      })}

      {/* Cardinal diamonds at N S E W — kept inside viewBox (r+6+d = 96 < 100) */}
      {[0, 90, 180, 270].map(a => {
        const rad = (a - 90) * Math.PI / 180;
        const dx  = cx + (r + 6) * Math.cos(rad);
        const dy  = cy + (r + 6) * Math.sin(rad);
        const d   = 4;
        return (
          <polygon key={a}
            points={`${dx},${dy - d} ${dx + d},${dy} ${dx},${dy + d} ${dx - d},${dy}`}
            fill={`url(#${goldG})`}/>
        );
      })}

      {/* VM monogram */}
      <text x={cx} y={cy + 14} textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="52" fontWeight="700"
        fill={`url(#${goldG})`}
        filter={`url(#${glowId})`}
        letterSpacing="-2">
        VM
      </text>

      {/* Signal pulse dot */}
      <circle cx={cx} cy={cy + 56} r="3.6"
        fill={SIGNAL}
        opacity={animated ? pulse : 0.8}
        filter={`url(#${glowId})`}/>

      {/* Top arc: VAUGHNMARTIN · READINESS OS — centered at 12 o'clock */}
      <path id={topArc}
        d={`M ${cx - r * 0.82},${cy} A ${r * 0.82},${r * 0.82} 0 0,1 ${cx + r * 0.82},${cy}`}
        fill="none"/>
      <text fontFamily="'Courier New', monospace" fontSize="11" fill={GOLD} opacity="0.85" textAnchor="middle">
        <textPath href={`#${topArc}`} startOffset="50%">VAUGHNMARTIN · READINESS OS</textPath>
      </text>

      {/* Bottom arc: ANTE IGNEM PARATUS — centered at 6 o'clock */}
      <path id={botArc}
        d={`M ${cx - r * 0.74},${cy} A ${r * 0.74},${r * 0.74} 0 0,0 ${cx + r * 0.74},${cy}`}
        fill="none"/>
      <text fontFamily="'Courier New', monospace" fontSize="9.5" fill={TEAL_LT} opacity="0.7" textAnchor="middle">
        <textPath href={`#${botArc}`} startOffset="50%">ANTE IGNEM PARATUS</textPath>
      </text>
    </svg>
  );
};

// ── VaughnMartinLogo — full lockup (seal + wordmark) or variants ───────────────
export const VaughnMartinLogo: FC<VaughnMartinLogoProps> = ({
  width,
  height = 48,
  variant = 'full',
  className = '',
  color = 'navy',
  animated = false,
}) => {
  const onDark  = color === 'white' || color === 'teal';
  const onGold  = color === 'gold';

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
        <TechSeal size={sealSize} color={color} animated={animated}/>
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
          <div style={{ width: '22px', height: '1px', background: ruleColor, flexShrink: 0 }}/>
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
      <TechSeal size={iconSz} color={color} animated={animated}/>
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
          <div style={{ width: '22px', height: '1px', background: ruleColor, flexShrink: 0 }}/>
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
