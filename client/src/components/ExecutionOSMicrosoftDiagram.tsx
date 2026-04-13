/**
 * ExecutionOSMicrosoftDiagram
 * Architecture diagram showing Readiness OS as the strategic command layer
 * sitting above and orchestrating the Microsoft Full Stack AI Ecosystem.
 */

const NAVY   = "#0A0F2E";
const GOLD   = "#C9A84C";
const GOLD_L = "#DFC178";
const TEAL   = "#2B8A6E";
const TEAL_L = "#3BAF8A";
const IVORY  = "#F0EDE4";
const MS_BLUE = "#0078D4";

/* ── tiny helpers ────────────────────────────────────────────────── */
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

function Badge({ x, y, w, h, label, sub, icon, color = TEAL, rx = 10 }: {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string; icon?: string; color?: string; rx?: number;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill={`${color}18`} stroke={color} strokeWidth={1.5} strokeOpacity={0.6}
      />
      {icon && <text x={cx - (sub ? w / 2 - 14 : 0)} y={y + h / 2 + (sub ? -6 : 5)} textAnchor={sub ? "start" : "middle"}
        fontSize={sub ? 18 : 20} dominantBaseline="middle">{icon}</text>}
      <text x={cx} y={y + h / 2 + (sub ? -7 : 0)} textAnchor="middle"
        fill={IVORY} fontSize={12} fontWeight={600}
        fontFamily="'Barlow Condensed','DM Mono',sans-serif" letterSpacing={0.5}>
        {label}
      </text>
      {sub && <text x={cx} y={y + h / 2 + 9} textAnchor="middle"
        fill={IVORY} fontSize={9} fontWeight={400} opacity={0.5}
        fontFamily="'DM Mono',monospace" letterSpacing={0.5}>
        {sub}
      </text>}
    </g>
  );
}

/* ── Microsoft tile ──────────────────────────────────────────────── */
function MsTile({ x, y, w, h, label, items }: {
  x: number; y: number; w: number; h: number; label: string; items: string[];
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8}
        fill="rgba(255,255,255,0.04)" stroke={`${MS_BLUE}44`} strokeWidth={1.2}
      />
      <rect x={x} y={y} width={w} height={22} rx={8}
        fill={`${MS_BLUE}22`}
      />
      <rect x={x} y={y + 14} width={w} height={8}
        fill={`${MS_BLUE}22`}
      />
      <text x={x + w / 2} y={y + 13} textAnchor="middle"
        fill="#60BBFF" fontSize={9.5} fontWeight={700}
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

/* ── Main component ──────────────────────────────────────────────── */
export default function ExecutionOSMicrosoftDiagram() {
  const W = 1200, H = 730;

  // EOS block bounds
  const eosX = 160, eosY = 32, eosW = 880, eosH = 184;

  // Integration connector row
  const connY = 264, connH = 68;
  const connectors = [
    { label: "Azure AI", sub: "Enterprise LLMs", icon: "◈", color: MS_BLUE, cx: 180 },
    { label: "Teams", sub: "War room alerts", icon: "⬡", color: "#6264A7", cx: 368 },
    { label: "Copilot Studio", sub: "M365 connector", icon: "◉", color: "#5BA3E8", cx: 556 },
    { label: "Microsoft Entra", sub: "Agent identity", icon: "◎", color: "#107C10", cx: 744 },
    { label: "Power Platform", sub: "Workflow hooks", icon: "◆", color: "#742774", cx: 932 },
  ];
  const connW = 152;

  // Microsoft ecosystem tiles (bottom section)
  const tileY = 386, tileH = 102;
  const tiles = [
    { label: "Models",      items: ["Azure OpenAI", "GPT-4o", "Phi-4", "MAI-1"],         x:  40 },
    { label: "Frameworks",  items: ["Semantic Kernel", "Magentic-One", "AutoGen"],        x: 230 },
    { label: "AI Agents",   items: ["Copilot Studio", "SharePoint AI", "Dynamics 365"],   x: 420 },
    { label: "Cloud",       items: ["Azure AI Services", "Azure Fabric", "Blob Storage"],  x: 610 },
    { label: "Productivity",items: ["Microsoft 365", "Teams", "Loop", "Outlook"],         x: 800 },
    { label: "Coding",      items: ["GitHub Copilot", "VS Code AI", "Azure Skills"],      x: 990 },
  ];
  const tileW = 160;

  // connector bottom anchors (connected to MS tiles)
  const connectorMsAnchors = [420 + tileW / 2, 40 + tileW / 2, 230 + tileW / 2, 610 + tileW / 2, 800 + tileW / 2];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W, display: "block", margin: "0 auto", fontFamily: "inherit" }}
      aria-label="Readiness OS positioned above the Microsoft Full Stack AI Ecosystem"
    >
      <defs>
        {/* Background gradient */}
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060B1E" />
          <stop offset="100%" stopColor="#0D1530" />
        </linearGradient>
        {/* EOS block gradient */}
        <linearGradient id="eosGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#111740" />
          <stop offset="100%" stopColor="#0A0F2E" />
        </linearGradient>
        {/* Gold glow filter */}
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Soft shadow */}
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.35" />
        </filter>
        {/* MS layer gradient */}
        <linearGradient id="msLayerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0078D422" />
          <stop offset="100%" stopColor="#0078D408" />
        </linearGradient>
        <linearGradient id="eosRingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD} />
          <stop offset="50%" stopColor={GOLD_L} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>

      {/* ── Background ── */}
      <rect width={W} height={H} fill="url(#bgGrad)" />

      {/* Gold grid overlay */}
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth={0.5} strokeOpacity={0.06} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid)" />

      {/* ── Teal orb top-right ── */}
      <ellipse cx={1080} cy={60} rx={280} ry={200} fill={TEAL} opacity={0.07} />
      {/* ── Gold orb bottom-left ── */}
      <ellipse cx={120} cy={620} rx={200} ry={160} fill={GOLD} opacity={0.05} />

      {/* ══ MICROSOFT LAYER ══════════════════════════════════════════ */}
      {/* Layer background */}
      <rect x={20} y={360} width={W - 40} height={280} rx={14}
        fill="url(#msLayerGrad)" stroke={`${MS_BLUE}30`} strokeWidth={1.5}
      />

      {/* MS layer header */}
      <text x={W / 2} y={348} textAnchor="middle"
        fill={`${MS_BLUE}88`} fontSize={9} fontWeight={700}
        fontFamily="'Barlow Condensed',sans-serif" letterSpacing={2.5}>
        MICROSOFT FULL STACK AI ECOSYSTEM — INFRASTRUCTURE LAYER
      </text>

      {/* MS logo mark */}
      {[["#F25022", 0, 0], ["#7FBA00", 1, 0], ["#00A4EF", 0, 1], ["#FFB900", 1, 1]].map(([color, ci, ri], idx) => (
        <rect key={idx}
          x={W / 2 - 20 + (ci as number) * 11}
          y={357 + (ri as number) * 11}
          width={9} height={9} rx={1}
          fill={color as string} opacity={0.55}
        />
      ))}

      {/* Microsoft tiles */}
      {tiles.map((tile) => (
        <MsTile key={tile.label} {...tile} y={tileY} h={tileH} w={tileW} />
      ))}

      {/* "Responsible AI" strip at bottom */}
      <rect x={40} y={500} width={W - 80} height={28} rx={6}
        fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth={1}
      />
      {["Azure Confidential Computing", "Microsoft Purview", "Azure AI Content Safety", "Microsoft Entra Agent ID", "Responsible AI Framework"].map((item, i) => (
        <text key={i} x={80 + i * 224} y={518} textAnchor="start"
          fill={IVORY} fontSize={8.5} opacity={0.38}
          fontFamily="'Barlow Condensed',sans-serif" letterSpacing={0.5}>
          ◦ {item}
        </text>
      ))}

      {/* Connectivity lines — MS tiles up to connector row */}
      {connectorMsAnchors.map((msX, i) => {
        const conX = connectors[i].cx;
        return (
          <GlowLine key={i}
            x1={conX} y1={connY + connH}
            x2={msX} y2={tileY}
            color={connectors[i].color as string}
            opacity={0.4}
          />
        );
      })}

      {/* ══ INTEGRATION CONNECTOR ROW ════════════════════════════════ */}
      <text x={W / 2} y={252} textAnchor="middle"
        fill={GOLD} fontSize={9} fontWeight={700}
        fontFamily="'DM Mono',monospace" letterSpacing={2.5} opacity={0.8}>
        READINESS OS INTEGRATION TOUCHPOINTS
      </text>

      {connectors.map((c) => (
        <Badge key={c.label}
          x={c.cx - connW / 2} y={connY}
          w={connW} h={connH}
          label={c.label} sub={c.sub} icon={c.icon}
          color={c.color as string}
        />
      ))}

      {/* Lines: EOS bottom → connectors */}
      {connectors.map((c) => (
        <GlowLine key={c.label + "-up"}
          x1={eosX + eosW * ((c.cx - eosX) / eosW)}
          y1={eosY + eosH}
          x2={c.cx} y2={connY}
          color={GOLD} opacity={0.5}
        />
      ))}

      {/* ══ READINESS OS BLOCK ═══════════════════════════════════════ */}
      {/* Outer glow ring */}
      <rect x={eosX - 3} y={eosY - 3} width={eosW + 6} height={eosH + 6} rx={17}
        fill="none" stroke={GOLD} strokeWidth={1} strokeOpacity={0.25} filter="url(#goldGlow)"
      />
      {/* Main block */}
      <rect x={eosX} y={eosY} width={eosW} height={eosH} rx={14}
        fill="url(#eosGrad)" stroke="url(#eosRingGrad)" strokeWidth={2}
        filter="url(#shadow)"
      />

      {/* EOS inner grid */}
      <defs>
        <clipPath id="eosClip">
          <rect x={eosX} y={eosY} width={eosW} height={eosH} rx={14} />
        </clipPath>
      </defs>
      <rect x={eosX} y={eosY} width={eosW} height={eosH} rx={14}
        fill="url(#grid)" clipPath="url(#eosClip)" opacity={0.8}
      />

      {/* Teal top-right orb inside EOS */}
      <ellipse cx={eosX + eosW - 80} cy={eosY + 40} rx={120} ry={80}
        fill={TEAL} opacity={0.1} clipPath="url(#eosClip)"
      />

      {/* "THE STRATEGIC COMMAND LAYER" overline */}
      <text x={eosX + eosW / 2} y={eosY + 28} textAnchor="middle"
        fill={GOLD} fontSize={9} fontWeight={700}
        fontFamily="'DM Mono',monospace" letterSpacing={3.5} opacity={0.9}>
        THE STRATEGIC COMMAND LAYER ABOVE THE MICROSOFT AGENTIC STACK
      </text>

      {/* READINESS OS wordmark */}
      <text x={eosX + eosW / 2} y={eosY + 62} textAnchor="middle"
        fill={IVORY} fontSize={34} fontWeight={700}
        fontFamily="'Barlow Condensed','Cormorant Garamond',serif" letterSpacing={4}>
        READINESS OS
      </text>
      <text x={eosX + eosW / 2} y={eosY + 82} textAnchor="middle"
        fill={GOLD} fontSize={11} fontWeight={500}
        fontFamily="'Cormorant Garamond',serif" letterSpacing={1} fontStyle="italic">
        by VaughnMartin — We Make Enterprises Fearless
      </text>

      {/* IDEA phase chips — width 148, spaced to leave clear room for 3,600× box */}
      {[
        { label: "IDENTIFY", sub: "Triggers · Signals",  color: GOLD, x: eosX + 48 },
        { label: "DETECT",   sub: "AI Radar · 248+ pts", color: TEAL, x: eosX + 210 },
        { label: "EXECUTE",  sub: "Playbooks · War Room", color: TEAL, x: eosX + 372 },
        { label: "ADVANCE",  sub: "ROI · Analytics",     color: GOLD, x: eosX + 534 },
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

      {/* EOS key metrics strip */}
      {[
        { v: "12 min", l: "to execution" },
        { v: "170", l: "playbooks" },
        { v: "221", l: "triggers" },
        { v: "3,600×", l: "head start" },
      ].map((m, i) => (
        <g key={m.l}>
          <text x={eosX + 895 + i * 0} y={eosY + 0} textAnchor="middle" fill={IVORY} fontSize={0} />
        </g>
      ))}

      {/* Right-side metric column */}
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

      {/* ── Layer label arrows ── */}
      {/* EOS layer arrow */}
      <text x={36} y={eosY + eosH / 2} textAnchor="middle"
        fill={GOLD} fontSize={8} fontWeight={700} opacity={0.7}
        fontFamily="'DM Mono',monospace" letterSpacing={2}
        transform={`rotate(-90, 36, ${eosY + eosH / 2})`}>
        EXECUTION LAYER
      </text>
      {/* Integration layer arrow */}
      <text x={36} y={connY + connH / 2} textAnchor="middle"
        fill={TEAL} fontSize={8} fontWeight={700} opacity={0.7}
        fontFamily="'DM Mono',monospace" letterSpacing={2}
        transform={`rotate(-90, 36, ${connY + connH / 2})`}>
        INTEGRATION
      </text>
      {/* MS layer arrow */}
      <text x={36} y={tileY + tileH / 2} textAnchor="middle"
        fill={`${MS_BLUE}99`} fontSize={8} fontWeight={700} opacity={0.9}
        fontFamily="'DM Mono',monospace" letterSpacing={2}
        transform={`rotate(-90, 36, ${tileY + tileH / 2})`}>
        MICROSOFT STACK
      </text>

      {/* ── "Readiness OS orchestrates" annotation ── */}
      <text x={W / 2} y={H - 18} textAnchor="middle"
        fill={IVORY} fontSize={10} opacity={0.3}
        fontFamily="'DM Mono',monospace" letterSpacing={1}>
        Readiness OS orchestrates the Microsoft agentic stack — it doesn't replace it. Human executives retain all decision authority.
      </text>

      {/* ── Gold top border line ── */}
      <line x1={0} y1={0} x2={W} y2={0}
        stroke={GOLD} strokeWidth={2.5} opacity={0.6}
      />
    </svg>
  );
}
