const NAVY   = "#0A0F2E";
const GOLD   = "#C9A84C";
const GOLD_L = "#DFC178";
const TEAL   = "#2B8A6E";
const IVORY  = "#F0EDE4";

function GlowLine({ x1, y1, x2, y2, color = GOLD, opacity = 0.55 }: {
  x1: number; y1: number; x2: number; y2: number; color?: string; opacity?: number;
}) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={2.5} strokeOpacity={opacity}
        strokeDasharray="6 4"
      />
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={8} strokeOpacity={opacity * 0.18}
      />
    </>
  );
}

function EcoTile({ x, y, w, h, label, items, ecoColor }: {
  x: number; y: number; w: number; h: number;
  label: string; items: string[]; ecoColor: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8}
        fill="rgba(255,255,255,0.04)" stroke={`${ecoColor}44`} strokeWidth={1.2}
      />
      <rect x={x} y={y} width={w} height={22} rx={8} fill={`${ecoColor}22`} />
      <rect x={x} y={y + 14} width={w} height={8} fill={`${ecoColor}22`} />
      <text x={x + w / 2} y={y + 13} textAnchor="middle"
        fill={ecoColor} fontSize={9.5} fontWeight={700}
        fontFamily="'Barlow Condensed',sans-serif" letterSpacing={1.2}>
        {label.toUpperCase()}
      </text>
      {items.map((item, i) => (
        <text key={i} x={x + 10} y={y + 32 + i * 14} textAnchor="start"
          fill={IVORY} fontSize={9} fontWeight={400} opacity={0.65}
          fontFamily="'Barlow Condensed',sans-serif">
          · {item}
        </text>
      ))}
    </g>
  );
}

function ConnectorBadge({ x, y, w, h, label, sub, icon, color = TEAL }: {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string; icon?: string; color?: string;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10}
        fill={`${color}18`} stroke={color} strokeWidth={1.5} strokeOpacity={0.6}
      />
      {icon && (
        <text x={cx - (sub ? w / 2 - 14 : 0)} y={y + h / 2 + (sub ? -6 : 5)} textAnchor={sub ? "start" : "middle"}
          fontSize={sub ? 18 : 20} dominantBaseline="middle">{icon}</text>
      )}
      <text x={cx} y={y + h / 2 + (sub ? -7 : 0)} textAnchor="middle"
        fill={IVORY} fontSize={12} fontWeight={600}
        fontFamily="'Barlow Condensed','DM Mono',sans-serif" letterSpacing={0.5}>
        {label}
      </text>
      {sub && (
        <text x={cx} y={y + h / 2 + 9} textAnchor="middle"
          fill={IVORY} fontSize={9} fontWeight={400} opacity={0.5}
          fontFamily="'DM Mono',monospace" letterSpacing={0.5}>
          {sub}
        </text>
      )}
    </g>
  );
}

export interface EcoTileData { label: string; items: string[] }
export interface EcoConnector { label: string; sub: string; icon: string; color: string }

interface Props {
  ecoName: string;
  ecoLayerLabel: string;
  ecoColor: string;
  overlineText: string;
  tiles: EcoTileData[];
  connectors: EcoConnector[];
  footerItems: string[];
}

export default function EcosystemDiagram({
  ecoName, ecoLayerLabel, ecoColor, overlineText, tiles, connectors, footerItems,
}: Props) {
  const W = 1200, H = 730;

  const eosX = 160, eosY = 32, eosW = 880, eosH = 184;
  const connY = 264, connH = 68;
  const connW = 152;
  const tileY = 386, tileH = 102;
  const tileW = 160;
  const tileXs = [40, 230, 420, 610, 800, 990];
  const connCXs = [180, 368, 556, 744, 932];
  const tileCenters = tileXs.map(x => x + tileW / 2);
  const connToTileMap = [0, 1, 2, 3, 4];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W, display: "block", margin: "0 auto", fontFamily: "inherit" }}
      aria-label={`Readiness OS positioned above the ${ecoName}`}
    >
      <defs>
        <linearGradient id={`bgGrad-${ecoName}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060B1E" />
          <stop offset="100%" stopColor="#0D1530" />
        </linearGradient>
        <linearGradient id={`eosGrad-${ecoName}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#111740" />
          <stop offset="100%" stopColor="#0A0F2E" />
        </linearGradient>
        <linearGradient id={`ecoLayerGrad-${ecoName}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`${ecoColor}22`} />
          <stop offset="100%" stopColor={`${ecoColor}08`} />
        </linearGradient>
        <linearGradient id={`eosRingGrad-${ecoName}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD} />
          <stop offset="50%" stopColor={GOLD_L} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
        <filter id={`goldGlow-${ecoName}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id={`shadow-${ecoName}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.35" />
        </filter>
        <pattern id={`grid-${ecoName}`} width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth={0.5} strokeOpacity={0.06} />
        </pattern>
        <clipPath id={`eosClip-${ecoName}`}>
          <rect x={eosX} y={eosY} width={eosW} height={eosH} rx={14} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill={`url(#bgGrad-${ecoName})`} />
      <rect width={W} height={H} fill={`url(#grid-${ecoName})`} />

      <ellipse cx={1080} cy={60} rx={280} ry={200} fill={TEAL} opacity={0.07} />
      <ellipse cx={120} cy={620} rx={200} ry={160} fill={GOLD} opacity={0.05} />

      {/* Ecosystem infrastructure layer */}
      <rect x={20} y={360} width={W - 40} height={280} rx={14}
        fill={`url(#ecoLayerGrad-${ecoName})`} stroke={`${ecoColor}30`} strokeWidth={1.5}
      />
      <text x={W / 2} y={348} textAnchor="middle"
        fill={`${ecoColor}88`} fontSize={9} fontWeight={700}
        fontFamily="'Barlow Condensed',sans-serif" letterSpacing={2.5}>
        {ecoName.toUpperCase()} — INFRASTRUCTURE LAYER
      </text>

      {/* Eco tiles */}
      {tiles.slice(0, 6).map((tile, i) => (
        <EcoTile key={tile.label}
          x={tileXs[i]} y={tileY} w={tileW} h={tileH}
          label={tile.label} items={tile.items} ecoColor={ecoColor}
        />
      ))}

      {/* Bottom governance strip */}
      <rect x={40} y={500} width={W - 80} height={28} rx={6}
        fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth={1}
      />
      {footerItems.slice(0, 5).map((item, i) => (
        <text key={i} x={80 + i * 224} y={518} textAnchor="start"
          fill={IVORY} fontSize={8.5} opacity={0.38}
          fontFamily="'Barlow Condensed',sans-serif" letterSpacing={0.5}>
          ◦ {item}
        </text>
      ))}

      {/* Connector → tile lines */}
      {connToTileMap.map((tileIdx, i) => (
        <GlowLine key={i}
          x1={connCXs[i]} y1={connY + connH}
          x2={tileCenters[tileIdx]} y2={tileY}
          color={connectors[i]?.color || ecoColor}
          opacity={0.4}
        />
      ))}

      {/* Integration touchpoints label */}
      <text x={W / 2} y={252} textAnchor="middle"
        fill={GOLD} fontSize={9} fontWeight={700}
        fontFamily="'DM Mono',monospace" letterSpacing={2.5} opacity={0.8}>
        EXECUTION OS INTEGRATION TOUCHPOINTS
      </text>

      {/* Connector badges */}
      {connectors.slice(0, 5).map((c, i) => (
        <ConnectorBadge key={c.label}
          x={connCXs[i] - connW / 2} y={connY}
          w={connW} h={connH}
          label={c.label} sub={c.sub} icon={c.icon}
          color={c.color}
        />
      ))}

      {/* EOS block → connector lines */}
      {connCXs.map((cx, i) => (
        <GlowLine key={i}
          x1={eosX + eosW * ((cx - eosX) / eosW)}
          y1={eosY + eosH}
          x2={cx} y2={connY}
          color={GOLD} opacity={0.5}
        />
      ))}

      {/* EOS Block */}
      <rect x={eosX - 3} y={eosY - 3} width={eosW + 6} height={eosH + 6} rx={17}
        fill="none" stroke={GOLD} strokeWidth={1} strokeOpacity={0.25}
        filter={`url(#goldGlow-${ecoName})`}
      />
      <rect x={eosX} y={eosY} width={eosW} height={eosH} rx={14}
        fill={`url(#eosGrad-${ecoName})`} stroke={`url(#eosRingGrad-${ecoName})`} strokeWidth={2}
        filter={`url(#shadow-${ecoName})`}
      />
      <rect x={eosX} y={eosY} width={eosW} height={eosH} rx={14}
        fill={`url(#grid-${ecoName})`} clipPath={`url(#eosClip-${ecoName})`} opacity={0.8}
      />
      <ellipse cx={eosX + eosW - 80} cy={eosY + 40} rx={120} ry={80}
        fill={TEAL} opacity={0.1} clipPath={`url(#eosClip-${ecoName})`}
      />

      <text x={eosX + eosW / 2} y={eosY + 28} textAnchor="middle"
        fill={GOLD} fontSize={9} fontWeight={700}
        fontFamily="'DM Mono',monospace" letterSpacing={3.5} opacity={0.9}>
        {overlineText}
      </text>
      <text x={eosX + eosW / 2} y={eosY + 62} textAnchor="middle"
        fill={IVORY} fontSize={34} fontWeight={700}
        fontFamily="'Barlow Condensed','Cormorant Garamond',serif" letterSpacing={4}>
        EXECUTION OS
      </text>
      <text x={eosX + eosW / 2} y={eosY + 82} textAnchor="middle"
        fill={GOLD} fontSize={11} fontWeight={500}
        fontFamily="'Cormorant Garamond',serif" letterSpacing={1} fontStyle="italic">
        by VaughnMartin — We Make Enterprises Fearless
      </text>

      {/* IDEA phase chips */}
      {[
        { label: "IDENTIFY", sub: "Triggers · Signals",   color: GOLD, x: eosX + 48 },
        { label: "DETECT",   sub: "AI Radar · 248+ pts",  color: TEAL, x: eosX + 210 },
        { label: "EXECUTE",  sub: "Playbooks · War Room", color: TEAL, x: eosX + 372 },
        { label: "ADVANCE",  sub: "ROI · Analytics",      color: GOLD, x: eosX + 534 },
      ].map((phase) => (
        <g key={phase.label}>
          <rect x={phase.x} y={eosY + 104} width={148} height={58} rx={8}
            fill={`${phase.color}14`} stroke={phase.color} strokeWidth={1.5} strokeOpacity={0.5}
          />
          <text x={phase.x + 74} y={eosY + 128} textAnchor="middle"
            fill={phase.color} fontSize={13} fontWeight={700}
            fontFamily="'Barlow Condensed',sans-serif" letterSpacing={2.5}>
            {phase.label}
          </text>
          <text x={phase.x + 74} y={eosY + 146} textAnchor="middle"
            fill={IVORY} fontSize={9} fontWeight={400} opacity={0.55}
            fontFamily="'DM Mono',monospace">
            {phase.sub}
          </text>
        </g>
      ))}

      {/* 3,600× metric box */}
      <rect x={eosX + eosW - 115} y={eosY + 104} width={105} height={58} rx={8}
        fill={`${GOLD}0C`} stroke={`${GOLD}40`} strokeWidth={1}
      />
      <text x={eosX + eosW - 63} y={eosY + 121} textAnchor="middle"
        fill={GOLD} fontSize={16} fontWeight={700}
        fontFamily="'Barlow Condensed',sans-serif">
        3,600×
      </text>
      <text x={eosX + eosW - 63} y={eosY + 136} textAnchor="middle"
        fill={IVORY} fontSize={8} opacity={0.55}
        fontFamily="'DM Mono',monospace">
        HEAD START
      </text>
      <text x={eosX + eosW - 63} y={eosY + 149} textAnchor="middle"
        fill={TEAL} fontSize={7.5} fontWeight={600}
        fontFamily="'DM Mono',monospace">
        in execution while
      </text>
      <text x={eosX + eosW - 63} y={eosY + 159} textAnchor="middle"
        fill={TEAL} fontSize={7.5} fontWeight={600}
        fontFamily="'DM Mono',monospace">
        others still mobilize
      </text>

      {/* Layer labels */}
      <text x={36} y={eosY + eosH / 2} textAnchor="middle"
        fill={GOLD} fontSize={8} fontWeight={700} opacity={0.7}
        fontFamily="'DM Mono',monospace" letterSpacing={2}
        transform={`rotate(-90, 36, ${eosY + eosH / 2})`}>
        EXECUTION LAYER
      </text>
      <text x={36} y={connY + connH / 2} textAnchor="middle"
        fill={TEAL} fontSize={8} fontWeight={700} opacity={0.7}
        fontFamily="'DM Mono',monospace" letterSpacing={2}
        transform={`rotate(-90, 36, ${connY + connH / 2})`}>
        INTEGRATION
      </text>
      <text x={36} y={tileY + tileH / 2} textAnchor="middle"
        fill={`${ecoColor}99`} fontSize={8} fontWeight={700} opacity={0.9}
        fontFamily="'DM Mono',monospace" letterSpacing={2}
        transform={`rotate(-90, 36, ${tileY + tileH / 2})`}>
        {ecoLayerLabel}
      </text>

      {/* Footer annotation */}
      <text x={W / 2} y={H - 18} textAnchor="middle"
        fill={IVORY} fontSize={10} opacity={0.3}
        fontFamily="'DM Mono',monospace" letterSpacing={1}>
        Readiness OS orchestrates the {ecoName} — it doesn't replace it. Human executives retain all decision authority.
      </text>

      <line x1={0} y1={0} x2={W} y2={0} stroke={GOLD} strokeWidth={2.5} opacity={0.6} />
    </svg>
  );
}
