const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

export function VariantB() {
  return (
    <div style={{ fontFamily: "'Barlow', 'Inter', sans-serif", background: NAVY, minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: GOLD, fontSize: 13, fontWeight: 800 }}>VM</span>
          </div>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "0.04em" }}>VAUGHNMARTIN</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {["Platform", "Readiness Protocols", "Industries", "Investors"].map(item => (
            <span key={item} style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a style={{ color: GOLD, border: `1px solid ${GOLD}55`, padding: "10px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
            See It Live
          </a>
          <a style={{ background: GOLD, color: NAVY, padding: "10px 22px", fontSize: 13, fontWeight: 800, textDecoration: "none", letterSpacing: "0.04em" }}>
            Request Access
          </a>
        </div>
      </nav>

      {/* Hero — full bleed dark with particle network feel */}
      <div style={{ position: "relative", minHeight: 520, display: "flex", alignItems: "center", overflow: "hidden" }}>

        {/* Particle/network background via layered radials */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(43,138,110,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 20%, rgba(201,168,76,0.12) 0%, transparent 55%), radial-gradient(ellipse 40% 60% at 90% 80%, rgba(43,138,110,0.1) 0%, transparent 50%)" }} />

        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

        {/* Flowing accent lines — simulating network flow */}
        <div style={{ position: "absolute", right: "5%", top: "25%", width: "38%", height: 1, background: "linear-gradient(to right, transparent, rgba(43,138,110,0.6), transparent)" }} />
        <div style={{ position: "absolute", right: "10%", top: "40%", width: "30%", height: 1, background: "linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent)" }} />
        <div style={{ position: "absolute", right: "3%", top: "60%", width: "42%", height: 1, background: "linear-gradient(to right, transparent, rgba(43,138,110,0.4), transparent)" }} />
        <div style={{ position: "absolute", right: "15%", top: "72%", width: "22%", height: 1, background: "linear-gradient(to right, transparent, rgba(201,168,76,0.35), transparent)" }} />

        {/* Glowing node dots */}
        {[
          { x: "62%", y: "28%", c: TEAL }, { x: "74%", y: "44%", c: GOLD },
          { x: "58%", y: "62%", c: TEAL }, { x: "82%", y: "35%", c: GOLD },
          { x: "70%", y: "70%", c: TEAL }, { x: "88%", y: "55%", c: GOLD },
        ].map((dot, i) => (
          <div key={i} style={{ position: "absolute", left: dot.x, top: dot.y, width: 6, height: 6, borderRadius: "50%", background: dot.c, boxShadow: `0 0 12px ${dot.c}` }} />
        ))}

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "80px 48px", width: "100%", zIndex: 2 }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(43,138,110,0.15)", border: "1px solid rgba(43,138,110,0.35)", padding: "6px 16px", marginBottom: 32 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
              <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>221 Triggers Monitored — System Active</span>
            </div>

            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#fff", fontSize: 58, fontWeight: 800, lineHeight: 1.05 }}>We Redesign</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#fff", fontSize: 58, fontWeight: 800, lineHeight: 1.05 }}>How Work Flows</span>
            </div>
            <div style={{ marginBottom: 32 }}>
              <span style={{ color: GOLD, fontSize: 58, fontWeight: 800, lineHeight: 1.05 }}>In the Age of AI.</span>
            </div>

            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 17, lineHeight: 1.75, margin: "0 0 44px", maxWidth: 520 }}>
              30 days of mobilization compressed to 12 minutes. 170 Readiness Protocols pre-staged and executive-authorized — before the trigger fires.
            </p>

            <div style={{ display: "flex", gap: 14 }}>
              <a style={{ background: GOLD, color: NAVY, padding: "16px 36px", fontSize: 14, fontWeight: 800, textDecoration: "none", letterSpacing: "0.06em" }}>
                Activate a Response →
              </a>
              <a style={{ background: "transparent", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.2)", padding: "16px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                12-Minute Experience
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards — Work4Flow pattern */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "0 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {[
            { label: "Geopolitical Risk Response", sub: "Pre-staged before the trigger fires", accent: TEAL },
            { label: "M&A Day 1 Integration", sub: "170 Readiness Protocols ready to activate", accent: GOLD },
            { label: "Cybersecurity Breach", sub: "12-minute mobilization from signal to execution", accent: TEAL },
            { label: "Regulatory Sprint", sub: "Automated at trigger point — executive authorized", accent: GOLD },
          ].map((item, i) => (
            <div key={i} style={{ padding: "28px 24px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", borderTop: "2px solid transparent", background: "rgba(255,255,255,0.02)", cursor: "pointer" }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{item.label}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>{item.sub}</div>
              <span style={{ color: item.accent, fontSize: 12, fontWeight: 600 }}>Activate response →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 48px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
          The Readiness Infrastructure Fortune 1000 Enterprises Are Missing
        </p>
      </div>
    </div>
  );
}
