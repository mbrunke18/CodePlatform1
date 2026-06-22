
export default function VMHero() {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: "#0A0F2E", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>

      {/* NAV */}
      <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 44px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid #C9A84C", background: "radial-gradient(circle at 40% 40%, #1a2860 0%, #0A0F2E 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#C9A84C", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 11 }}>VM</span>
          </div>
          <div>
            <div style={{ color: "#fff", fontFamily: "Georgia, 'Cormorant Garamond', serif", fontWeight: 600, fontSize: 14, lineHeight: 1.1 }}>VaughnMartin</div>
            <div style={{ color: "#C9A84C", fontWeight: 700, fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", marginTop: 1 }}>READINESS OS</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {["Platform", "How It Works", "Proof", "Investors"].map(item => (
            <span key={item} style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, fontWeight: 500, cursor: "pointer", letterSpacing: "0.02em" }}>{item}</span>
          ))}
          <button style={{ background: "#C9A84C", color: "#0A0F2E", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", padding: "10px 22px", border: "none", cursor: "pointer", textTransform: "uppercase" }}>
            Apply for Access
          </button>
        </div>
      </nav>

      {/* SPLIT BODY */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* ── LEFT PANEL — navy, grid, headline at bottom ── */}
        <div style={{ width: "50%", position: "relative", background: "linear-gradient(155deg, #0C1235 0%, #060A1C 100%)", overflow: "hidden" }}>

          {/* Subtle gold grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />

          {/* Faint radial glow bottom-left */}
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Right-edge vertical divider */}
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.25) 40%, rgba(201,168,76,0.25) 60%, transparent 100%)" }} />

          {/* HEADLINE BLOCK — pinned to bottom-left */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "52px 52px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
              <div style={{ width: 22, height: 1, background: "#C9A84C" }} />
              <span style={{ color: "#C9A84C", fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" }}>Readiness OS · Readiness Infrastructure</span>
            </div>

            <h1 style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(32px, 3.5vw, 50px)", lineHeight: 1.1, color: "#fff", margin: "0 0 6px 0" }}>
              Whatever your<br />organization faces next,
            </h1>
            <h1 style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(32px, 3.5vw, 50px)", lineHeight: 1.1, color: "#C9A84C", fontStyle: "italic", margin: "0 0 30px 0" }}>
              the response is<br />already waiting.
            </h1>

            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.65, marginBottom: 38, maxWidth: 360 }}>
              180 Readiness Protocols. Pre-staged before the trigger fires.<br />30 days of mobilization, compressed to 12 minutes.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={{ background: "#C9A84C", color: "#0A0F2E", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", padding: "13px 28px", border: "none", cursor: "pointer", textTransform: "uppercase" }}>
                Apply for Founding Partner Access
              </button>
              <button style={{ background: "transparent", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 12, padding: "13px 24px", border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer" }}>
                Watch a Full Activation →
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — dark warm, executive silhouette, proof at bottom ── */}
        <div style={{ width: "50%", position: "relative", background: "linear-gradient(155deg, #09080f 0%, #0c0a14 50%, #060408 100%)", overflow: "hidden" }}>

          {/* Warm ambient glow center */}
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,20,50,0.6) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* EXECUTIVE SILHOUETTE */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 160 }}>
            <svg viewBox="0 0 360 560" style={{ width: "62%", maxWidth: 280 }}>
              <defs>
                <linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#09080f" stopOpacity="0" />
                  <stop offset="100%" stopColor="#060408" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Window frame — vertical lines suggesting glass panels */}
              <line x1="180" y1="10" x2="180" y2="420" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <line x1="90" y1="10" x2="90" y2="420" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="270" y1="10" x2="270" y2="420" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="10" y1="160" x2="350" y2="160" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="10" y1="280" x2="350" y2="280" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* City skyline silhouette */}
              <rect x="10"  y="310" width="22" height="110" fill="rgba(255,255,255,0.035)" />
              <rect x="36"  y="275" width="32" height="145" fill="rgba(255,255,255,0.045)" />
              <rect x="72"  y="295" width="18" height="125" fill="rgba(255,255,255,0.03)" />
              <rect x="94"  y="250" width="42" height="170" fill="rgba(255,255,255,0.055)" />
              <rect x="140" y="268" width="28" height="152" fill="rgba(255,255,255,0.04)" />
              <rect x="172" y="235" width="50" height="185" fill="rgba(255,255,255,0.06)" />
              <rect x="226" y="262" width="26" height="158" fill="rgba(255,255,255,0.04)" />
              <rect x="256" y="240" width="40" height="180" fill="rgba(255,255,255,0.05)" />
              <rect x="300" y="285" width="30" height="135" fill="rgba(255,255,255,0.035)" />
              <rect x="334" y="305" width="16" height="115" fill="rgba(255,255,255,0.03)" />

              {/* City light dots — warm gold */}
              {([
                [50,290],[62,305],[100,268],[115,278],[150,258],[160,270],
                [195,248],[210,258],[240,275],[268,252],[278,268],[305,290],
                [318,300],[108,310],[185,285],[235,245]
              ] as [number,number][]).map(([cx,cy],i) => (
                <circle key={i} cx={cx} cy={cy} r={1.5} fill="rgba(201,168,76,0.45)" />
              ))}
              {([
                [45,315],[75,300],[130,274],[175,260],[222,278],[295,295],[340,310]
              ] as [number,number][]).map(([cx,cy],i) => (
                <circle key={i} cx={cx} cy={cy} r={1} fill="rgba(255,255,255,0.25)" />
              ))}

              {/* Executive silhouette — person standing, back to viewer, looking at city */}
              {/* Shadow on floor */}
              <ellipse cx="180" cy="550" rx="55" ry="8" fill="rgba(0,0,0,0.4)" />
              {/* Legs */}
              <rect x="163" y="460" width="16" height="90" rx="2" fill="#06040a" />
              <rect x="181" y="460" width="16" height="90" rx="2" fill="#06040a" />
              {/* Body / suit */}
              <path d="M152 350 Q155 440 163 460 L197 460 Q205 440 208 350 Z" fill="#06040a" />
              {/* Shoulders width */}
              <path d="M142 360 Q155 340 180 336 Q205 340 218 360 L208 368 Q197 350 180 347 Q163 350 152 368 Z" fill="#06040a" />
              {/* Head */}
              <ellipse cx="180" cy="322" rx="16" ry="20" fill="#06040a" />
              {/* Neck */}
              <rect x="174" y="338" width="12" height="10" fill="#06040a" />
              {/* Left arm — slight natural hang */}
              <path d="M150 368 Q138 400 136 430 L141 432 Q143 403 154 374 Z" fill="#06040a" />
              {/* Right arm */}
              <path d="M210 368 Q222 400 224 430 L219 432 Q217 403 206 374 Z" fill="#06040a" />

              {/* Floor fade overlay */}
              <rect x="0" y="400" width="360" height="160" fill="url(#floorFade)" />
            </svg>
          </div>

          {/* PROOF PANEL — pinned to bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            {/* Gradient fade */}
            <div style={{ height: 80, background: "linear-gradient(to bottom, transparent, rgba(6,4,8,0.95))" }} />
            <div style={{ background: "rgba(6,4,8,0.97)", padding: "24px 44px 40px" }}>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 22 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>What the market is saying</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", fontStyle: "italic", lineHeight: 1.55, marginBottom: 10 }}>
                  "Be relentlessly protocol-focused for interoperability — enterprises need a composable glue layer linking internal systems, data, and workflows with AI agent ecosystems."
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 16, height: 1, background: "rgba(201,168,76,0.5)" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.38)", textTransform: "uppercase" }}>McKinsey & Company · Enterprise Agentic Architecture, 2026</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
