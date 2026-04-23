const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

export function VariantA() {
  return (
    <div style={{ fontFamily: "'Barlow', 'Inter', sans-serif", background: "#f8f7f4", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: GOLD, fontSize: 13, fontWeight: 800 }}>VM</span>
          </div>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "0.04em" }}>VAUGHNMARTIN</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 22px", fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.04em" }}>
            See It Live
          </a>
          <a style={{ background: GOLD, color: NAVY, padding: "10px 22px", fontSize: 13, fontWeight: 800, textDecoration: "none", letterSpacing: "0.04em" }}>
            Request Access
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", background: "#132558", minHeight: 580, display: "flex", alignItems: "center", overflow: "hidden" }}>

        {/* Gold grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.08) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        {/* Cinematic orbs */}
        <div style={{ position: "absolute", right: -100, top: -100, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.22) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", right: 200, bottom: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", left: -100, top: 50, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.1) 0%, transparent 65%)" }} />

        {/* Glowing line accent */}
        <div style={{ position: "absolute", right: 0, top: "30%", width: "45%", height: 1, background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4))" }} />
        <div style={{ position: "absolute", right: 0, top: "30%", transform: "translateY(-40px)", width: "35%", height: 1, background: "linear-gradient(to right, transparent, rgba(43,138,110,0.3))" }} />

        <div style={{ position: "relative", maxWidth: 900, padding: "120px 48px 80px", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", padding: "6px 16px", marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
            <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Live Monitoring Active — 8 Sources</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: 54, fontWeight: 800, lineHeight: 1.1, margin: "0 0 12px", maxWidth: 740 }}>
            The Response Is Ready
          </h1>
          <h1 style={{ color: GOLD, fontSize: 54, fontWeight: 800, lineHeight: 1.1, margin: "0 0 28px", maxWidth: 740 }}>
            Before the Trigger Fires.
          </h1>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, lineHeight: 1.7, maxWidth: 560, margin: "0 0 40px" }}>
            VaughnMartin compresses 30 days of mobilization into 12 minutes. 170 Readiness Protocols. Pre-staged. Executive-authorized. Ready before you need them.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a style={{ background: GOLD, color: NAVY, padding: "16px 36px", fontSize: 14, fontWeight: 800, textDecoration: "none", letterSpacing: "0.06em" }}>
              Activate a Response →
            </a>
            <a style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", padding: "16px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              See the 12-Minute Experience
            </a>
          </div>
        </div>
      </div>

      {/* Stat cards anchored at bottom of hero */}
      <div style={{ background: NAVY, borderTop: `2px solid ${GOLD}33` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {[
            { stat: "12 min", label: "Execution Head Start", sub: "From trigger to live execution" },
            { stat: "3,600×", label: "Faster Than 30 Days", sub: "Mobilization compressed" },
            { stat: "170", label: "Readiness Protocols", sub: "Pre-staged before trigger fires" },
            { stat: "221", label: "Trigger Patterns", sub: "Monitored continuously" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "28px 32px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none", textAlign: "center" }}>
              <div style={{ color: GOLD, fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{item.stat}</div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "8px 0 4px", letterSpacing: "0.04em" }}>{item.label}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Thesis bar */}
      <div style={{ background: "#f0ede4", padding: "20px 48px", textAlign: "center" }}>
        <p style={{ color: NAVY, fontSize: 14, fontWeight: 600, margin: 0, letterSpacing: "0.03em" }}>
          "Preparation → Readiness → <strong>Fearless.</strong>" — The enterprise that prepares for every situation it will face is no longer afraid of strategic triggers.
        </p>
      </div>
    </div>
  );
}
