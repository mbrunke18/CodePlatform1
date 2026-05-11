const NAVY    = "#0A0F2E";
const NAVY2   = "#0D1535";
const GOLD    = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL    = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const WHITE   = "#FDFCFA";
const MUTED   = "rgba(253,252,250,0.55)";
const BORDER  = "rgba(201,168,76,0.18)";

const GEO = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;
const DM  = { fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" } as const;
const MONO = { fontFamily: "'Courier New', monospace" } as const;

function GoldRule({ my = 16 }: { my?: number }) {
  return <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.35, margin: `${my}px 0` }} />;
}

function SealIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id="mg-bg" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1a2860"/>
          <stop offset="100%" stopColor={NAVY}/>
        </radialGradient>
        <linearGradient id="mg-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GOLD_LT}/>
          <stop offset="50%" stopColor={GOLD}/>
          <stop offset="100%" stopColor="#8B6212"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="86" fill="url(#mg-bg)"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.85"/>
      <circle cx="100" cy="100" r="83" fill="none" stroke={GOLD} strokeWidth="0.4" opacity="0.3"/>
      {[0,90,180,270].map(a => {
        const rad = (a - 90) * Math.PI / 180;
        const dx = 100 + 92 * Math.cos(rad);
        const dy = 100 + 92 * Math.sin(rad);
        return <polygon key={a} points={`${dx},${dy-4} ${dx+4},${dy} ${dx},${dy+4} ${dx-4},${dy}`} fill="url(#mg-gold)"/>;
      })}
      <text x="100" y="114" textAnchor="middle" fontFamily="Georgia,serif" fontSize="52" fontWeight="700" fill="url(#mg-gold)" letterSpacing="-2">VM</text>
      <path id="mg-ta" d="M 29.5,100 A 70.5,70.5 0 0,1 170.5,100" fill="none"/>
      <text fontFamily="'Courier New',monospace" fontSize="11" fill={GOLD} opacity="0.85" textAnchor="middle">
        <textPath href="#mg-ta" startOffset="50%">VAUGHNMARTIN · READINESS OS</textPath>
      </text>
      <path id="mg-ba" d="M 36.6,100 A 63.4,63.4 0 0,0 163.4,100" fill="none"/>
      <text fontFamily="'Courier New',monospace" fontSize="9.5" fill={TEAL_LT} opacity="0.7" textAnchor="middle">
        <textPath href="#mg-ba" startOffset="50%">ANTE IGNEM PARATUS</textPath>
      </text>
    </svg>
  );
}

const PROBLEMS = [
  { icon: "⏳", label: "30-Day Mobilization Cycles" },
  { icon: "🏛", label: "Committee-Driven Decisions" },
  { icon: "📋", label: "Reactive, Not Pre-Staged" },
  { icon: "🔀", label: "Fragmented Coordination" },
  { icon: "📉", label: "Missed Strategic Windows" },
  { icon: "🔇", label: "No Signal Detection Layer" },
];

const FEATURES = [
  "170 Readiness Protocols pre-staged",
  "221 triggers continuously monitored",
  "12-minute execution head start",
  "Executive authority preserved",
  "Sits above the Microsoft AI stack",
  "Pre-staged before the trigger fires",
];

const INVESTOR = [
  { icon: "📈", title: "Massive Market", body: "Fortune 1000 operational coordination — trillions in addressable enterprise spend" },
  { icon: "🏗", title: "Platform Economics", body: "Protocol library + 6 industry packs create compounding lock-in" },
  { icon: "🪟", title: "Microsoft Orchestrator", body: "Every enterprise has the AI stack. None have the operating model to use it" },
  { icon: "🤝", title: "Founding Partner Program", body: "First cohort forming now. Selective by design — Fortune 1000 only" },
];

export default function MarketingInfographic() {
  return (
    <div style={{ background: "#080C22", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 16px 80px" }}>
      <div style={{
        width: 430,
        background: NAVY,
        border: `1px solid ${BORDER}`,
        boxShadow: `0 0 80px rgba(201,168,76,0.08), 0 0 0 1px rgba(201,168,76,0.12)`,
        overflow: "hidden",
      }}>

        {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
        <div style={{ padding: "32px 28px 28px", background: `linear-gradient(160deg, #0D1535 0%, ${NAVY} 60%)`, position: "relative", overflow: "hidden" }}>

          {/* Grid texture */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke={GOLD} strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>

          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <SealIcon size={48}/>
              <div style={{ whiteSpace: "nowrap" }}>
                <div style={{ ...GEO, color: WHITE, fontSize: 17, fontWeight: 600, letterSpacing: "0.01em", lineHeight: 1 }}>VaughnMartin</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                  <div style={{ width: 16, height: 1, background: GOLD, flexShrink: 0 }}/>
                  <div style={{ ...DM, color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Readiness OS</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...MONO, color: GOLD, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1.6 }}>
                A NEW OPERATING MODEL<br/>FOR A NEW ERA<br/>
                <span style={{ color: TEAL_LT }}>INTELLIGENT · PRE-STAGED · FEARLESS</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ ...GEO, color: WHITE, fontSize: 34, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em" }}>
              Welcome to the<br/>execution first.
            </div>
            <div style={{ ...GEO, color: GOLD, fontSize: 34, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em" }}>
              Readiness OS™
            </div>
          </div>

          <div style={{ ...DM, color: MUTED, fontSize: 14, fontWeight: 500, lineHeight: 1.45, marginBottom: 20 }}>
            The Operating Model for the Fortune 1000.<br/>
            <span style={{ color: "rgba(253,252,250,0.38)", fontSize: 12 }}>Built for the age of AI. Replacing the 40-year-old coordination model.</span>
          </div>

          <GoldRule my={20}/>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 0 }}>
            <div style={{ flex: 1, borderRight: `1px solid ${BORDER}`, paddingRight: 20 }}>
              <div style={{ ...GEO, color: GOLD, fontSize: 30, fontWeight: 700, lineHeight: 1 }}>3,600×</div>
              <div style={{ ...DM, color: MUTED, fontSize: 11, fontWeight: 500, marginTop: 4, lineHeight: 1.3 }}>Execution Head Start<br/><span style={{ color: GOLD, opacity: 0.7 }}>30 days → 12 minutes</span></div>
            </div>
            <div style={{ flex: 1, paddingLeft: 20 }}>
              <div style={{ ...GEO, color: WHITE, fontSize: 30, fontWeight: 700, lineHeight: 1 }}>$1T+</div>
              <div style={{ ...DM, color: MUTED, fontSize: 11, fontWeight: 500, marginTop: 4, lineHeight: 1.3 }}>Enterprise Coordination<br/><span style={{ color: MUTED }}>Global Market Opportunity</span></div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: THE OLD MODEL ─────────────────────────────────── */}
        <div style={{ background: "#070B1E", padding: "22px 28px" }}>
          <div style={{ ...DM, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4 }}>
            THE OLD MODEL. YEAR AFTER YEAR.
          </div>
          <div style={{ ...DM, color: MUTED, fontSize: 11, marginBottom: 16 }}>
            Enterprise work was designed for a world without AI. Committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {PROBLEMS.map((p, i) => (
              <div key={i} style={{
                background: "rgba(201,168,76,0.04)",
                border: `1px solid rgba(201,168,76,0.12)`,
                padding: "12px 10px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{p.icon}</div>
                <div style={{ ...DM, color: MUTED, fontSize: 10, fontWeight: 600, lineHeight: 1.35 }}>{p.label}</div>
              </div>
            ))}
          </div>

          <div style={{ ...DM, color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textAlign: "center", marginTop: 14, opacity: 0.6 }}>
            WEEKS TO MOBILIZE. MONTHS TO EXECUTE. BILLIONS IN MISSED OPPORTUNITY.
          </div>
        </div>

        {/* ── SECTION 3: SOLUTION + INVESTOR ────────────────────────────── */}
        <div style={{ display: "flex", borderTop: `1px solid ${BORDER}` }}>

          {/* Left: Solution */}
          <div style={{ flex: 1, padding: "22px 18px 22px 28px", borderRight: `1px solid ${BORDER}` }}>
            <div style={{ ...DM, color: TEAL_LT, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
              ONE READINESS OS
            </div>
            <div style={{ ...GEO, color: WHITE, fontSize: 16, fontWeight: 700, lineHeight: 1.2, marginBottom: 14 }}>
              The Full Readiness Cycle.<br/>
              <span style={{ color: GOLD }}>Pre-staged. Always ready.</span>
            </div>

            {/* Cycle diagram */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="50" fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.2"/>
                <circle cx="55" cy="55" r="38" fill="none" stroke={TEAL} strokeWidth="0.4" strokeDasharray="4 8" opacity="0.3"/>
                {[
                  { label: "DETECT", angle: -90 },
                  { label: "STAGE", angle: -18 },
                  { label: "EXECUTE", angle: 54 },
                  { label: "DEBRIEF", angle: 126 },
                  { label: "PREPARE", angle: 198 },
                ].map(({ label, angle }) => {
                  const rad = angle * Math.PI / 180;
                  const x = 55 + 42 * Math.cos(rad);
                  const y = 55 + 42 * Math.sin(rad);
                  return (
                    <g key={label}>
                      <circle cx={x} cy={y} r="8" fill={NAVY2} stroke={GOLD} strokeWidth="0.8" opacity="0.9"/>
                      <text x={x} y={y + 0.8} textAnchor="middle" dominantBaseline="middle" fontFamily="'Courier New',monospace" fontSize="4" fill={GOLD} fontWeight="700">{label}</text>
                    </g>
                  );
                })}
                <text x="55" y="52" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" fill={GOLD} fontWeight="700">Readiness</text>
                <text x="55" y="62" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" fill={GOLD} fontWeight="700">OS</text>
              </svg>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, flexShrink: 0, marginTop: 4 }}/>
                  <div style={{ ...DM, color: MUTED, fontSize: 11, fontWeight: 500, lineHeight: 1.35 }}>{f}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Investor */}
          <div style={{ flex: 1, padding: "22px 28px 22px 18px", background: "rgba(43,138,110,0.04)" }}>
            <div style={{ ...DM, color: TEAL_LT, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
              BUILT FOR INVESTORS
            </div>
            <div style={{ ...GEO, color: WHITE, fontSize: 16, fontWeight: 700, lineHeight: 1.2, marginBottom: 14 }}>
              Built for the<br/>
              <span style={{ color: TEAL_LT }}>Future.</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {INVESTOR.map((item, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 13 }}>{item.icon}</span>
                    <div style={{ ...DM, color: GOLD, fontSize: 11, fontWeight: 700 }}>{item.title}</div>
                  </div>
                  <div style={{ ...DM, color: MUTED, fontSize: 10, fontWeight: 500, lineHeight: 1.4, paddingLeft: 19 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: FOOTER ────────────────────────────────────────── */}
        <div style={{ background: "#070B1E", padding: "22px 28px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ ...GEO, color: GOLD, fontSize: 13, fontStyle: "italic", marginBottom: 4 }}>
                "The response is ready before the trigger fires."
              </div>
              <div style={{ ...DM, color: MUTED, fontSize: 10 }}>A new category. A 3,600× execution head start.</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...MONO, color: TEAL_LT, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em" }}>WE ARE JUST</div>
              <div style={{ ...MONO, color: TEAL_LT, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em" }}>GETTING STARTED.</div>
              <div style={{ ...MONO, color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", marginTop: 2 }}>JOIN US.</div>
            </div>
          </div>

          <GoldRule my={18}/>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SealIcon size={28}/>
              <div>
                <div style={{ ...GEO, color: WHITE, fontSize: 12, fontWeight: 600 }}>VaughnMartin</div>
                <div style={{ ...DM, color: GOLD, fontSize: 8, fontWeight: 700, letterSpacing: "0.25em" }}>READINESS OS</div>
              </div>
            </div>
            <div style={{ ...DM, color: MUTED, fontSize: 9, textAlign: "right", lineHeight: 1.5 }}>
              vaughnmartin.com<br/>
              <span style={{ color: GOLD, opacity: 0.7 }}>Founding Partner Access Now Open</span>
            </div>
          </div>
        </div>

        {/* Screenshot tip */}
        <div style={{ background: "#040712", padding: "10px 28px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ ...MONO, color: "rgba(255,255,255,0.2)", fontSize: 9, textAlign: "center" }}>
            Screenshot this card · 430px wide · optimized for LinkedIn
          </div>
        </div>

      </div>
    </div>
  );
}
