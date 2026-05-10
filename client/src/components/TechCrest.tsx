import { useState, useEffect, useId } from "react";

const B = {
  navy:      "#0A0F2E",
  navyBg:    "#0D1535",
  gold:      "#C9A84C",
  goldLt:    "#DFC178",
  teal:      "#2B8A6E",
  tealLt:    "#3BAF8A",
  signal:    "#00E5C4",
  ivory:     "#F8F7F4",
  warn:      "#C0392B",
};

interface TechCrestProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export function TechCrest({ size = 440, animated = true, className }: TechCrestProps) {
  const [tick, setTick] = useState(0);
  const [scanAngle, setScanAngle] = useState(0);
  const [pulse, setPulse] = useState(0);
  const uid = useId().replace(/:/g, "s");

  useEffect(() => {
    if (!animated) return;
    const t = setInterval(() => {
      setTick(n => n + 1);
      setScanAngle(a => (a + 2) % 360);
      setPulse(p => (p + 1) % 100);
    }, 50);
    return () => clearInterval(t);
  }, [animated]);

  const cx = 220, cy = 220;
  const scanRad = (scanAngle - 90) * Math.PI / 180;
  const scanX2  = cx + Math.cos(scanRad) * 130;
  const scanY2  = cy + Math.sin(scanRad) * 130;
  const pulseOpacity = 0.4 + 0.6 * Math.sin(pulse * Math.PI / 50);

  const signals = [
    { x: 138, y: 152, active: true,  domain: "RISK"      },
    { x: 202, y: 141, active: true,  domain: "GROWTH"    },
    { x: 173, y: 179, active: false, domain: "TRANSFORM" },
    { x: 122, y: 192, active: true,  domain: "RISK"      },
    { x: 218, y: 195, active: false, domain: "GROWTH"    },
  ];

  const g1 = `${uid}goldG`;
  const sf = `${uid}sf`;
  const gw1 = `${uid}gw1`;
  const gw2 = `${uid}gw2`;
  const sg  = `${uid}sg`;
  const sc  = `${uid}sc`;
  const hp  = `${uid}hp`;
  const cp  = `${uid}cp`;

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 440 440"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
      className={className}
    >
      <defs>
        <radialGradient id={sf} cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#1a2860"/>
          <stop offset="60%"  stopColor="#0D1535"/>
          <stop offset="100%" stopColor="#080C22"/>
        </radialGradient>
        <linearGradient id={g1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={B.goldLt}/>
          <stop offset="50%"  stopColor={B.gold}/>
          <stop offset="100%" stopColor="#8B6212"/>
        </linearGradient>
        <filter id={gw1}>
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={gw2}>
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={sg}>
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <clipPath id={sc}>
          <path d="M90,60 L90,240 C90,320 220,380 220,380 C220,380 350,320 350,240 L350,60 Z"/>
        </clipPath>
        <pattern id={hp} x="0" y="0" width="20" height="23" patternUnits="userSpaceOnUse">
          <polygon points="10,1 19,6 19,16 10,21 1,16 1,6"
            fill="none" stroke={B.signal} strokeWidth="0.4" opacity="0.12"/>
        </pattern>
        <pattern id={cp} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0,20 L10,20 L10,10 L20,10 L20,20 L30,20"
            fill="none" stroke={B.gold} strokeWidth="0.5" opacity="0.08"/>
          <circle cx="10" cy="10" r="1.5" fill={B.gold} opacity="0.1"/>
          <circle cx="20" cy="20" r="1.5" fill={B.gold} opacity="0.1"/>
          <path d="M0,30 L15,30 L15,40"
            fill="none" stroke={B.teal} strokeWidth="0.5" opacity="0.06"/>
        </pattern>
      </defs>

      {/* ── OUTER HUD RING ── */}
      <circle cx={cx} cy={cy} r="210" fill="none" stroke={B.gold}   strokeWidth="1"   opacity="0.5"/>
      <circle cx={cx} cy={cy} r="207" fill="none" stroke={B.signal} strokeWidth="0.5" opacity="0.2"/>
      <circle cx={cx} cy={cy} r="200" fill="none" stroke={B.gold}   strokeWidth="0.4" opacity="0.15"/>

      {/* HUD tick marks — 72 around the ring */}
      {Array.from({ length: 72 }, (_, i) => {
        const angle = (i * 5 - 90) * Math.PI / 180;
        const r1 = 210;
        const r2 = i % 6 === 0 ? 198 : i % 2 === 0 ? 205 : 208;
        return (
          <line key={i}
            x1={cx + r1 * Math.cos(angle)} y1={cy + r1 * Math.sin(angle)}
            x2={cx + r2 * Math.cos(angle)} y2={cy + r2 * Math.sin(angle)}
            stroke={i % 6 === 0 ? B.gold : B.signal}
            strokeWidth={i % 6 === 0 ? 1.5 : 0.6}
            opacity={i % 6 === 0 ? 0.7 : 0.25}/>
        );
      })}

      {/* Cardinal degree labels */}
      {([[0,"000°"],[90,"090°"],[180,"180°"],[270,"270°"]] as [number,string][]).map(([a, label]) => {
        const rad = (a - 90) * Math.PI / 180;
        return (
          <text key={a}
            x={cx + 195 * Math.cos(rad)} y={cy + 195 * Math.sin(rad) + 4}
            textAnchor="middle" fontFamily="'Courier New', monospace"
            fontSize="8" fill={B.signal} opacity="0.5" letterSpacing="1">
            {label}
          </text>
        );
      })}

      {/* Corner HUD brackets */}
      {([-1, 1] as const).flatMap(sx => ([-1, 1] as const).map(sy => (
        <g key={`${sx}${sy}`}>
          <line x1={cx + sx*180} y1={cy + sy*180} x2={cx + sx*180} y2={cy + sy*155}
            stroke={B.signal} strokeWidth="1.5" opacity="0.4"/>
          <line x1={cx + sx*180} y1={cy + sy*180} x2={cx + sx*155} y2={cy + sy*180}
            stroke={B.signal} strokeWidth="1.5" opacity="0.4"/>
        </g>
      )))}


      {/* ── RADAR SWEEP ── */}
      {animated && (
        <g opacity="0.6">
          <line x1={cx} y1={cy} x2={scanX2} y2={scanY2}
            stroke={B.signal} strokeWidth="1.5" opacity="0.5" filter={`url(#${sg})`}/>
          {[15, 30, 45, 60, 75].map((offset, i) => {
            const trailRad = ((scanAngle - offset - 90) * Math.PI / 180);
            const tx = cx + Math.cos(trailRad) * 130;
            const ty = cy + Math.sin(trailRad) * 130;
            return (
              <line key={i} x1={cx} y1={cy} x2={tx} y2={ty}
                stroke={B.signal}
                strokeWidth={1 - i * 0.15}
                opacity={Math.max(0, 0.3 - i * 0.05)}/>
            );
          })}
        </g>
      )}

      {/* Radar range circles */}
      {[130, 100, 70, 40].map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          fill="none" stroke={B.signal} strokeWidth="0.4"
          opacity={0.1 - i * 0.02} strokeDasharray="4 4"/>
      ))}

      {/* ── SIGNAL NODES ── */}
      {signals.map((sig, i) => {
        const col = sig.active ? B.signal : B.warn;
        return (
          <g key={i}>
            {sig.active && animated && (
              <circle
                cx={sig.x} cy={sig.y}
                r={8 + (tick * 0.3 + i * 15) % 12}
                fill="none" stroke={col} strokeWidth="0.8"
                opacity={Math.max(0, 0.4 - ((tick * 0.3 + i * 15) % 12) / 30)}/>
            )}
            <circle cx={sig.x} cy={sig.y} r="3"
              fill={col} opacity={sig.active ? 0.9 : 0.7} filter={`url(#${gw1})`}/>
            <text x={sig.x + 6} y={sig.y + 4}
              fontFamily="'Courier New', monospace" fontSize="6.5"
              fill={col} opacity="0.7" letterSpacing="0.5">
              {sig.domain}
            </text>
          </g>
        );
      })}

      {/* Signal connection lines */}
      {signals.slice(0, -1).map((sig, i) => (
        <line key={i}
          x1={sig.x} y1={sig.y}
          x2={signals[i + 1].x} y2={signals[i + 1].y}
          stroke={B.signal} strokeWidth="0.5" opacity="0.2" strokeDasharray="3 3"/>
      ))}

      {/* ── SHIELD ── */}
      {/* Glow shadow */}
      <path d="M90,60 L90,240 C90,320 220,380 220,380 C220,380 350,320 350,240 L350,60 Z"
        fill="none" stroke={B.signal} strokeWidth="3" opacity="0.06" filter={`url(#${gw2})`}/>
      {/* Gold outer border */}
      <path d="M88,58 L88,241 C88,322 220,382 220,382 C220,382 352,322 352,241 L352,58 Z"
        fill={`url(#${g1})`} filter={`url(#${gw1})`}/>
      {/* Main fill */}
      <path d="M92,62 L92,239 C92,318 220,378 220,378 C220,378 348,318 348,239 L348,62 Z"
        fill={`url(#${sf})`}/>

      {/* Shield interior — hex + circuit patterns */}
      <g clipPath={`url(#${sc})`}>
        <rect x="90" y="60" width="260" height="320" fill={`url(#${hp})`}/>
        <rect x="90" y="60" width="260" height="320" fill={`url(#${cp})`}/>
      </g>

      {/* Inner accent border */}
      <path d="M100,70 L100,237 C100,312 220,368 220,368 C220,368 340,312 340,237 L340,70 Z"
        fill="none" stroke={B.gold} strokeWidth="0.6" opacity="0.2"/>

      {/* ── TORCH / SIGNAL BEACON ── */}
      <rect x="217" y="5" width="6" height="52" fill={`url(#${g1})`} rx="1.5"/>
      <ellipse cx={cx} cy="58" rx="12" ry="5" fill={`url(#${g1})`}/>
      <ellipse cx={cx} cy="35"
        rx={animated ? 18 + pulseOpacity * 4 : 18}
        ry={animated ? 28 + pulseOpacity * 6 : 28}
        fill={B.signal}
        opacity={animated ? 0.08 + pulseOpacity * 0.06 : 0.1}
        filter={`url(#${gw2})`}/>
      {/* Flame layers */}
      <path d="M220,8 C208,20 204,34 207,44 C210,52 216,56 220,54 C224,56 230,52 233,44 C236,34 232,20 220,8 Z"
        fill={B.gold} opacity="0.4" filter={`url(#${gw1})`}/>
      <path d="M220,13 C211,23 208,35 211,44 C213,50 217,53 220,52 C223,53 227,50 229,44 C232,35 229,23 220,13 Z"
        fill={B.goldLt} opacity="0.8"/>
      <path d="M220,18 C214,26 212,36 215,44 C217,48 219,50 220,50 C221,50 223,48 225,44 C228,36 226,26 220,18 Z"
        fill={B.signal}
        opacity={animated ? pulseOpacity * 0.9 : 0.7}
        filter={`url(#${sg})`}/>
      <path d="M220,24 C216,30 215,38 217,44 C218,47 219,48 220,48 C221,48 222,47 223,44 C225,38 224,30 220,24 Z"
        fill="rgba(255,255,255,0.85)"/>

      {/* Torch pulse rings */}
      {animated && [1, 2, 3].map(i => (
        <circle key={i} cx={cx} cy="35"
          r={(pulse * 0.8 + i * 25) % 80}
          fill="none" stroke={B.signal} strokeWidth="0.6"
          opacity={Math.max(0, 0.3 - ((pulse * 0.8 + i * 25) % 80) / 80 * 0.3)}/>
      ))}

      {/* ── VM MONOGRAM ── */}
      <text x={cx} y={cx - 10} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize="88" fontWeight="700"
        fill={`url(#${g1})`} filter={`url(#${gw1})`} letterSpacing="-3">
        VM
      </text>
      <text x={cx} y={cx - 10} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize="88" fontWeight="700"
        fill={B.signal} letterSpacing="-3"
        opacity={animated ? 0.04 + pulseOpacity * 0.04 : 0.06}>
        VM
      </text>

      {/* Horizontal data trace line */}
      <line x1="105" y1="255" x2="335" y2="255"
        stroke={B.gold} strokeWidth="0.6" opacity="0.25"/>
      {animated && (
        <line
          x1={105 + (tick * 3) % 230} y1="255"
          x2={Math.min(105 + (tick * 3) % 230 + 40, 335)} y2="255"
          stroke={B.signal} strokeWidth="1" opacity="0.6" filter={`url(#${gw1})`}/>
      )}

      {/* ── 9 DOMAIN STARS ── */}
      {Array.from({ length: 9 }, (_, i) => {
        const a  = (i * 40 - 90) * Math.PI / 180;
        const sr = 22;
        const sx = cx + sr * Math.cos(a);
        const sy = 265 + sr * Math.sin(a) * 0.4;
        const isLit = animated && i === tick % 9;
        return (
          <g key={i}>
            {i < 8 && (
              <line
                x1={sx} y1={sy}
                x2={cx + sr * Math.cos(((i + 1) * 40 - 90) * Math.PI / 180)}
                y2={265 + sr * Math.sin(((i + 1) * 40 - 90) * Math.PI / 180) * 0.4}
                stroke={B.signal} strokeWidth="0.4" opacity="0.2"/>
            )}
            <circle cx={sx} cy={sy} r="2"
              fill={isLit ? B.signal : B.gold}
              opacity={isLit ? 1 : 0.5}
              filter={isLit ? `url(#${gw1})` : "none"}/>
          </g>
        );
      })}

      {/* READINESS OS label */}
      <text x={cx} y="292" textAnchor="middle"
        fontFamily="'Courier New', monospace" fontSize="10.5"
        fill={B.tealLt} letterSpacing="5" opacity="0.95">
        READINESS OS
      </text>

      {/* Status indicator */}
      <circle cx={cx - 48} cy="309" r="3"
        fill={B.signal} opacity={animated ? pulseOpacity : 0.8} filter={`url(#${gw1})`}/>
      <text x={cx - 40} y="313"
        fontFamily="'Courier New', monospace" fontSize="8"
        fill={B.signal} opacity="0.7" letterSpacing="1">
        SIG.MON.ACTIVE
      </text>

      {/* EST. MMXXIII */}
      <text x={cx} y="335" textAnchor="middle"
        fontFamily="'Courier New', monospace" fontSize="8"
        fill={B.gold} letterSpacing="4" opacity="0.5">
        EST. MMXXIII
      </text>

      {/* ── CIRCUIT LAURELS ── */}
      {/* Left laurel spine */}
      <path d="M88,80 C72,120 64,175 70,235 C74,275 82,305 88,325"
        fill="none" stroke={B.gold} strokeWidth="1.2" opacity="0.3"/>
      {[75,95,115,135,155,175,195,215,235,255,275,295].map((y, i) => {
        const x = 68 + Math.sin(i * 0.8) * 8;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="8" ry="4"
              transform={`rotate(${-60 + i * 2},${x},${y})`}
              fill={i % 3 === 0 ? B.signal : B.gold}
              opacity={i % 3 === 0 ? 0.3 : 0.4}/>
            {i % 3 === 0 && (
              <circle cx={x} cy={y} r="1.5"
                fill={B.signal} opacity="0.5" filter={`url(#${sg})`}/>
            )}
          </g>
        );
      })}
      {/* Right laurel spine */}
      <path d="M352,80 C368,120 376,175 370,235 C366,275 358,305 352,325"
        fill="none" stroke={B.gold} strokeWidth="1.2" opacity="0.3"/>
      {[75,95,115,135,155,175,195,215,235,255,275,295].map((y, i) => {
        const x = 372 - Math.sin(i * 0.8) * 8;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="8" ry="4"
              transform={`rotate(${60 - i * 2},${x},${y})`}
              fill={i % 3 === 0 ? B.signal : B.gold}
              opacity={i % 3 === 0 ? 0.3 : 0.4}/>
            {i % 3 === 0 && (
              <circle cx={x} cy={y} r="1.5"
                fill={B.signal} opacity="0.5" filter={`url(#${sg})`}/>
            )}
          </g>
        );
      })}

      {/* ── MOTTO RIBBON ── */}
      <path d="M60,415 L60,440 L90,436 L90,428 Z"  fill="#6B4A0A" opacity="0.85"/>
      <path d="M380,415 L380,440 L350,436 L350,428 Z" fill="#6B4A0A" opacity="0.85"/>
      <path d="M86,408 L354,408 L354,440 L86,440 Z" fill={`url(#${g1})`}/>
      <line x1="86" y1="410" x2="354" y2="410" stroke="#8B6212" strokeWidth="0.8" opacity="0.5"/>
      <line x1="86" y1="438" x2="354" y2="438" stroke="#8B6212" strokeWidth="0.8" opacity="0.5"/>
      <text x={cx} y="429" textAnchor="middle"
        fontFamily="Georgia, serif" fontSize="13.5" fontWeight="700"
        fill={B.navy} letterSpacing="4.5">
        ANTE IGNEM PARATUS
      </text>
      {/* Data scanline on ribbon */}
      {animated && (
        <rect
          x={86 + (tick * 2) % 268} y="408" width="30" height="32"
          fill={B.signal} opacity="0.06" rx="1"/>
      )}
      {/* Corner rivets */}
      {([[86,408],[354,408],[86,440],[354,440]] as [number,number][]).map(([rx, ry], i) => (
        <circle key={i} cx={rx} cy={ry} r="4" fill={`url(#${g1})`}/>
      ))}

      {/* Founder's four words */}
      <text x={cx} y="458" textAnchor="middle"
        fontFamily="'Courier New', monospace" fontSize="7"
        fill={B.signal} opacity="0.45" letterSpacing="2">
        PREPARE · PRACTICE · PERFORM FEARLESS · NEVER GIVE UP
      </text>
    </svg>
  );
}

export default TechCrest;
