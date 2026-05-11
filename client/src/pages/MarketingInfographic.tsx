const NAVY    = "#0A0F2E";
const NAVY2   = "#0D1535";
const GOLD    = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL    = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const WHITE   = "#FDFCFA";
const MUTED   = "rgba(253,252,250,0.55)";
const MUTED2  = "rgba(253,252,250,0.35)";
const BORDER  = "rgba(201,168,76,0.18)";
const BORDER2 = "rgba(201,168,76,0.08)";

const GEO  = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;
const DM   = { fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" } as const;
const MONO = { fontFamily: "'Courier New', monospace" } as const;

function GoldRule({ my = 16, opacity = 0.28 }: { my?: number; opacity?: number }) {
  return (
    <div style={{
      width: "100%", height: 1,
      background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      opacity, margin: `${my}px 0`,
    }} />
  );
}

// Clean geometric SVG icon — no emojis
function GeoIcon({ shape, size = 20 }: { shape: "triangle-down" | "diamond" | "square" | "hexagon" | "circle" | "cross" | "wave"; size?: number }) {
  const c = size / 2;
  const s = size;
  const stroke = GOLD;
  const sw = "1";
  const fill = "none";
  const op = "0.7";

  const paths: Record<string, JSX.Element> = {
    "triangle-down": <polygon points={`${c},${s * 0.85} ${s * 0.1},${s * 0.2} ${s * 0.9},${s * 0.2}`} stroke={stroke} strokeWidth={sw} fill={fill} opacity={op}/>,
    "diamond": <polygon points={`${c},${s*0.08} ${s*0.92},${c} ${c},${s*0.92} ${s*0.08},${c}`} stroke={stroke} strokeWidth={sw} fill={fill} opacity={op}/>,
    "square": <rect x={s*0.15} y={s*0.15} width={s*0.7} height={s*0.7} stroke={stroke} strokeWidth={sw} fill={fill} opacity={op}/>,
    "hexagon": <polygon points={`${c},${s*0.08} ${s*0.88},${s*0.27} ${s*0.88},${s*0.73} ${c},${s*0.92} ${s*0.12},${s*0.73} ${s*0.12},${s*0.27}`} stroke={stroke} strokeWidth={sw} fill={fill} opacity={op}/>,
    "circle": <circle cx={c} cy={c} r={c*0.78} stroke={stroke} strokeWidth={sw} fill={fill} opacity={op}/>,
    "cross": <><line x1={c} y1={s*0.1} x2={c} y2={s*0.9} stroke={stroke} strokeWidth={sw} opacity={op}/><line x1={s*0.1} y1={c} x2={s*0.9} y2={c} stroke={stroke} strokeWidth={sw} opacity={op}/></>,
    "wave": <path d={`M${s*0.1},${c} Q${s*0.3},${s*0.2} ${c},${c} Q${s*0.7},${s*0.8} ${s*0.9},${c}`} stroke={stroke} strokeWidth={sw} fill={fill} opacity={op}/>,
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${s} ${s}`} style={{ flexShrink: 0 }}>
      {paths[shape]}
    </svg>
  );
}

function SealIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id="mi-bg" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1a2860"/>
          <stop offset="100%" stopColor={NAVY}/>
        </radialGradient>
        <linearGradient id="mi-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GOLD_LT}/>
          <stop offset="50%" stopColor={GOLD}/>
          <stop offset="100%" stopColor="#8B6212"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="86" fill="url(#mi-bg)"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.85"/>
      <circle cx="100" cy="100" r="83" fill="none" stroke={GOLD} strokeWidth="0.4" opacity="0.25"/>
      {[0,90,180,270].map(a => {
        const rad = (a - 90) * Math.PI / 180;
        const dx = 100 + 92 * Math.cos(rad);
        const dy = 100 + 92 * Math.sin(rad);
        return <polygon key={a} points={`${dx},${dy-4} ${dx+4},${dy} ${dx},${dy+4} ${dx-4},${dy}`} fill="url(#mi-gold)"/>;
      })}
      <text x="100" y="114" textAnchor="middle" fontFamily="Georgia,serif" fontSize="52" fontWeight="700" fill="url(#mi-gold)" letterSpacing="-2">VM</text>
      <path id="mi-ta" d="M 29.5,100 A 70.5,70.5 0 0,1 170.5,100" fill="none"/>
      <text fontFamily="'Courier New',monospace" fontSize="11" fill={GOLD} opacity="0.85" textAnchor="middle">
        <textPath href="#mi-ta" startOffset="50%">VAUGHNMARTIN · READINESS OS</textPath>
      </text>
      <path id="mi-ba" d="M 36.6,100 A 63.4,63.4 0 0,0 163.4,100" fill="none"/>
      <text fontFamily="'Courier New',monospace" fontSize="9.5" fill={TEAL_LT} opacity="0.7" textAnchor="middle">
        <textPath href="#mi-ba" startOffset="50%">ANTE IGNEM PARATUS</textPath>
      </text>
    </svg>
  );
}

// IDEA Framework cycle — matches actual platform architecture
function IDEACycle() {
  const cx = 55, cy = 55, r = 42;
  const steps = [
    { label: "IDENTIFY", sub: "signals", angle: -90, color: GOLD },
    { label: "DEVELOP", sub: "protocols", angle: -18, color: GOLD_LT },
    { label: "EXECUTE", sub: "12 min", angle: 54, color: TEAL_LT },
    { label: "ASSESS", sub: "debrief", angle: 126, color: GOLD_LT },
    { label: "PREPARE", sub: "always", angle: 198, color: GOLD },
  ];
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <defs>
        <linearGradient id="cy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GOLD_LT}/>
          <stop offset="100%" stopColor={GOLD}/>
        </linearGradient>
      </defs>
      {/* Outer guide ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={GOLD} strokeWidth="0.4" strokeDasharray="2 6" opacity="0.2"/>
      {/* Connecting arcs between nodes */}
      {steps.map((s, i) => {
        const next = steps[(i + 1) % steps.length];
        const a1 = (s.angle + 8) * Math.PI / 180;
        const a2 = (next.angle - 8) * Math.PI / 180;
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
        const large = Math.abs(next.angle - s.angle) > 180 ? 1 : 0;
        return <path key={i} d={`M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2}`} fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.25"/>;
      })}
      {/* Center */}
      <circle cx={cx} cy={cy} r="14" fill={NAVY2} stroke={GOLD} strokeWidth="0.6" opacity="0.6"/>
      <text x={cx} y={cy - 2} textAnchor="middle" fontFamily="Georgia,serif" fontSize="6.5" fill={GOLD} fontWeight="700">IDEA</text>
      <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="4.5" fill={MUTED}>Framework</text>
      {/* Stage nodes */}
      {steps.map(({ label, sub, angle, color }) => {
        const rad = angle * Math.PI / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <g key={label}>
            <circle cx={x} cy={y} r="9" fill={NAVY2} stroke={color} strokeWidth="0.8" opacity="0.9"/>
            <text x={x} y={y - 1} textAnchor="middle" dominantBaseline="middle" fontFamily="'Courier New',monospace" fontSize="3.5" fill={color} fontWeight="700">{label}</text>
            <text x={x} y={y + 4.5} textAnchor="middle" dominantBaseline="middle" fontFamily="'Courier New',monospace" fontSize="3" fill={MUTED}>{sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

const PROBLEMS: { shape: "triangle-down" | "diamond" | "square" | "hexagon" | "circle" | "cross" | "wave"; label: string; sub: string }[] = [
  { shape: "wave",          label: "30-Day Mobilization", sub: "before execution even begins" },
  { shape: "circle",        label: "Committee Deliberation", sub: "replacing pattern detection" },
  { shape: "square",        label: "Reactive Posture", sub: "assembling after the trigger fires" },
  { shape: "diamond",       label: "Stakeholder Alignment", sub: "weeks of coordination overhead" },
  { shape: "triangle-down", label: "No Signal Layer", sub: "blind to strategic triggers" },
  { shape: "cross",         label: "Execution Delays", sub: "30-day response to 12-min problems" },
];

const FEATURES: { text: string; verified: boolean }[] = [
  { text: "170 Readiness Protocols pre-staged", verified: true },
  { text: "221 strategic triggers monitored", verified: true },
  { text: "12-minute execution design target", verified: true },
  { text: "Executive authority at every stage", verified: true },
  { text: "Orchestrates your Microsoft AI stack", verified: true },
  { text: "Pre-staged before the trigger fires", verified: true },
];

const INVESTOR: { shape: "diamond" | "hexagon" | "square" | "circle"; title: string; body: string }[] = [
  {
    shape: "diamond",
    title: "Category Creation",
    body: "Readiness OS is a new layer — not competing with Copilot, SAP, or Workday. It sits above them as the operating model they don't provide.",
  },
  {
    shape: "hexagon",
    title: "Platform Economics",
    body: "170 core protocols + 6 industry packs + 12 compound protocols. Compounding value with every activation.",
  },
  {
    shape: "square",
    title: "Microsoft Stack Amplifier",
    body: "Every Fortune 1000 has invested in Microsoft AI. None have the operating model to use it when it counts.",
  },
  {
    shape: "circle",
    title: "Founding Partner Program",
    body: "First cohort forming now. Selective by design — validating with Fortune 1000 enterprises, not the mid-market.",
  },
];

export default function MarketingInfographic() {
  return (
    <div style={{ background: "#06091A", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 16px 80px" }}>
      <div style={{
        width: 430,
        background: NAVY,
        border: `1px solid ${BORDER}`,
        boxShadow: `0 0 100px rgba(201,168,76,0.06), 0 0 0 1px rgba(201,168,76,0.1)`,
        overflow: "hidden",
      }}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <div style={{ padding: "32px 28px 26px", background: `linear-gradient(155deg, #0D1535 0%, ${NAVY} 55%)`, position: "relative", overflow: "hidden" }}>

          {/* Subtle grid texture */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.035, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mi-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke={GOLD} strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mi-grid)"/>
          </svg>

          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <SealIcon size={50}/>
              <div style={{ whiteSpace: "nowrap" }}>
                <div style={{ ...GEO, color: WHITE, fontSize: 18, fontWeight: 600, letterSpacing: "0.01em", lineHeight: 1 }}>VaughnMartin</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <div style={{ width: 18, height: 1, background: GOLD, flexShrink: 0 }}/>
                  <div style={{ ...DM, color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}>Readiness OS</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...MONO, color: GOLD, fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", lineHeight: 1.8, opacity: 0.9 }}>
                A NEW CATEGORY<br/>FOR A NEW ERA
              </div>
              <div style={{ ...MONO, color: TEAL_LT, fontSize: 7, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.6, opacity: 0.75 }}>
                PRE-STAGED · ALWAYS READY
              </div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ ...GEO, color: WHITE, fontSize: 36, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.01em" }}>
              Welcome to the<br/>execution first.
            </div>
            <div style={{ ...GEO, color: GOLD, fontSize: 36, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.01em" }}>
              Readiness OS™
            </div>
          </div>

          <div style={{ ...DM, color: MUTED, fontSize: 14, fontWeight: 500, lineHeight: 1.5, marginBottom: 22 }}>
            The Operating Model for the Fortune 1000.
            <div style={{ color: MUTED2, fontSize: 12, marginTop: 3, lineHeight: 1.45 }}>
              Every vendor bolted AI onto the old model. We replaced the model.
              Preparation replaces real-time coordination. Pattern detection
              replaces committee deliberation. 12 minutes replaces 30 days.
            </div>
          </div>

          <GoldRule my={20}/>

          {/* Three-stat row — all product truths, no market guesses */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
            {[
              { num: "3,600×", label: "Execution Head Start", sub: "30 days → 12 minutes" },
              { num: "170",    label: "Readiness Protocols", sub: "pre-staged, not assembled" },
              { num: "221",    label: "Strategic Triggers", sub: "continuously monitored" },
            ].map(({ num, label, sub }, i) => (
              <div key={i} style={{
                borderRight: i < 2 ? `1px solid ${BORDER}` : "none",
                padding: i === 0 ? "0 16px 0 0" : i === 2 ? "0 0 0 16px" : "0 16px",
                textAlign: i === 1 ? "center" : i === 2 ? "right" : "left",
              }}>
                <div style={{ ...GEO, color: i === 0 ? GOLD : WHITE, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{num}</div>
                <div style={{ ...DM, color: MUTED, fontSize: 10, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{label}</div>
                <div style={{ ...MONO, color: GOLD, fontSize: 8, opacity: 0.65, marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE OLD MODEL ────────────────────────────────────────────── */}
        <div style={{ background: "#070B1E", padding: "22px 28px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 22, height: 1, background: GOLD, opacity: 0.5 }}/>
            <div style={{ ...DM, color: GOLD, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              The Old Model. Year After Year.
            </div>
          </div>
          <div style={{ ...DM, color: MUTED2, fontSize: 11.5, lineHeight: 1.55, marginBottom: 16 }}>
            Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. <span style={{ color: MUTED }}>AI changed the constraint. The operating model didn't.</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {PROBLEMS.map((p, i) => (
              <div key={i} style={{
                background: BORDER2,
                border: `1px solid rgba(201,168,76,0.1)`,
                padding: "11px 10px",
                textAlign: "center",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 7 }}>
                  <GeoIcon shape={p.shape} size={20}/>
                </div>
                <div style={{ ...DM, color: "rgba(253,252,250,0.7)", fontSize: 10, fontWeight: 700, lineHeight: 1.3, marginBottom: 2 }}>{p.label}</div>
                <div style={{ ...MONO, color: MUTED2, fontSize: 7.5, lineHeight: 1.3 }}>{p.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ ...DM, color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textAlign: "center", marginTop: 14, opacity: 0.5, textTransform: "uppercase" }}>
            Weeks to mobilize · Months to execute · Strategic windows missed
          </div>
        </div>

        {/* ── SOLUTION + INVESTOR ──────────────────────────────────────── */}
        <div style={{ display: "flex", borderTop: `1px solid ${BORDER}` }}>

          {/* Left: What it does */}
          <div style={{ flex: 1, padding: "20px 16px 20px 28px", borderRight: `1px solid ${BORDER}` }}>
            <div style={{ ...MONO, color: TEAL_LT, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
              One Readiness OS
            </div>
            <div style={{ ...GEO, color: WHITE, fontSize: 15, fontWeight: 700, lineHeight: 1.25, marginBottom: 14 }}>
              The full readiness cycle.<br/>
              <span style={{ color: GOLD }}>Pre-staged. Always ready.</span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <IDEACycle/>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{
                    width: 4, height: 4,
                    background: f.verified ? TEAL : GOLD,
                    flexShrink: 0, marginTop: 5,
                    transform: "rotate(45deg)",
                  }}/>
                  <div style={{ ...DM, color: MUTED, fontSize: 11, fontWeight: 500, lineHeight: 1.4 }}>{f.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Why it matters for investors */}
          <div style={{ flex: 1, padding: "20px 28px 20px 16px", background: "rgba(43,138,110,0.03)" }}>
            <div style={{ ...MONO, color: TEAL_LT, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
              Built for Investors
            </div>
            <div style={{ ...GEO, color: WHITE, fontSize: 15, fontWeight: 700, lineHeight: 1.25, marginBottom: 14 }}>
              Built for<br/>
              <span style={{ color: TEAL_LT }}>the future.</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {INVESTOR.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ marginTop: 1, flexShrink: 0 }}>
                    <GeoIcon shape={item.shape} size={16}/>
                  </div>
                  <div>
                    <div style={{ ...DM, color: GOLD, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ ...DM, color: MUTED2, fontSize: 10, fontWeight: 500, lineHeight: 1.45 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <div style={{ background: "#070B1E", padding: "20px 28px 22px", borderTop: `1px solid ${BORDER}` }}>

          {/* Canonical tagline */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ ...GEO, color: GOLD_LT, fontSize: 15, fontStyle: "italic", lineHeight: 1.4, marginBottom: 4 }}>
              "The response is ready before the trigger fires."
            </div>
            <div style={{ ...DM, color: MUTED2, fontSize: 10, letterSpacing: "0.08em" }}>
              Preparation → Readiness → Fearless
            </div>
          </div>

          <GoldRule my={16} opacity={0.22}/>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SealIcon size={30}/>
              <div>
                <div style={{ ...GEO, color: WHITE, fontSize: 13, fontWeight: 600, lineHeight: 1 }}>VaughnMartin</div>
                <div style={{ ...DM, color: GOLD, fontSize: 8, fontWeight: 700, letterSpacing: "0.28em", marginTop: 2 }}>READINESS OS</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...MONO, color: TEAL_LT, fontSize: 8, letterSpacing: "0.1em", lineHeight: 1.7, textTransform: "uppercase" }}>
                Founding Partner Access<br/>
                <span style={{ color: GOLD }}>Now Forming — Apply Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot guide */}
        <div style={{ background: "#040810", padding: "8px 28px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ ...MONO, color: "rgba(255,255,255,0.15)", fontSize: 8.5, textAlign: "center" }}>
            Screenshot this card · 430 × optimized for LinkedIn
          </div>
        </div>

      </div>
    </div>
  );
}
