const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

export function BestOutcome() {
  return (
    <div style={{ fontFamily: "'Barlow', 'Inter', sans-serif", background: NAVY, minHeight: "100vh", color: "#fff" }}>

      {/* ── NAVIGATION ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 56px", height: 68,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: `1.5px solid ${GOLD}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>VM</span>
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", lineHeight: 1 }}>VAUGHNMARTIN</div>
            <div style={{ color: `${GOLD}80`, fontSize: 8.5, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>Readiness OS</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["Platform", "Readiness Protocols", "Industries", "Investors"].map(item => (
            <span key={item} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500, letterSpacing: "0.03em", cursor: "pointer" }}>{item}</span>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ background: "transparent", color: GOLD, border: `1px solid ${GOLD}55`, padding: "9px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer" }}>
            See It Live
          </button>
          <button style={{ background: GOLD, color: NAVY, border: "none", padding: "9px 22px", fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer" }}>
            Request Access
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>

        {/* Subtle background: very fine grid only, no glow, no particles */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }} />

        {/* Single clean geometric accent — right column, vertical rule */}
        <div style={{ position: "absolute", right: "38%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* Gold horizontal accent line — one, deliberate */}
        <div style={{ position: "absolute", right: 0, top: 148, width: "62%", height: 1, background: `linear-gradient(to left, transparent 0%, ${GOLD}55 40%, ${GOLD}33 100%)` }} />

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 38%", minHeight: 560 }}>

          {/* LEFT: Copy */}
          <div style={{ padding: "88px 64px 72px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            {/* System status — minimal badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                System Active — 221 Triggers Monitored
              </span>
            </div>

            {/* Headline — Cormorant Garamond editorial weight */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.06,
              margin: "0 0 6px",
              color: "#fff",
              letterSpacing: "-0.01em",
            }}>
              The Response Is Ready
            </h1>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.06,
              margin: "0 0 36px",
              color: GOLD,
              letterSpacing: "-0.01em",
            }}>
              Before the Trigger Fires.
            </h1>

            {/* Sub */}
            <p style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 480,
              margin: "0 0 48px",
              fontWeight: 400,
            }}>
              30 days of mobilization compressed to 12 minutes. 170 Readiness Protocols pre-staged and executive-authorized — not after the trigger, before it.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 64 }}>
              <button style={{ background: GOLD, color: NAVY, border: "none", padding: "15px 36px", fontSize: 13, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer" }}>
                Activate a Response →
              </button>
              <button style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)", padding: "15px 28px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                12-Minute Experience
              </button>
            </div>

            {/* Inline metrics — editorial row */}
            <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
              {[
                { n: "12 min", l: "Trigger to execution" },
                { n: "3,600×", l: "Execution head start" },
                { n: "170", l: "Readiness Protocols" },
                { n: "221", l: "Trigger patterns" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, paddingRight: 24, marginRight: 24, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                  <div style={{ color: GOLD, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, marginTop: 6, letterSpacing: "0.04em", fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Live intelligence panel — editorial card */}
          <div style={{
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            padding: "88px 40px 72px 44px",
            display: "flex", flexDirection: "column", justifyContent: "center",
            gap: 0,
          }}>
            <div style={{ color: GOLD, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>
              Live Signal Feed
            </div>

            {/* Signal items — clean editorial list */}
            {[
              { tag: "GEOPOLITICAL", text: "Trade policy shift — USMCA amendment detected", time: "4 min ago", domain: "RISK & RESILIENCE" },
              { tag: "REGULATORY",   text: "SEC Rule 14e-8 compliance deadline approaching",   time: "12 min ago", domain: "TRANSFORMATION" },
              { tag: "COMPETITIVE",  text: "Competitor M&A announcement filed",                time: "31 min ago", domain: "GROWTH & POSITIONING" },
              { tag: "SUPPLY CHAIN", text: "Port congestion index exceeds threshold",          time: "1 hr ago", domain: "RISK & RESILIENCE" },
            ].map((item, i) => (
              <div key={i} style={{
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                padding: "18px 0",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: TEAL, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em" }}>{item.tag}</span>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10.5, fontWeight: 500 }}>{item.time}</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 13, fontWeight: 500, lineHeight: 1.45, marginBottom: 6 }}>{item.text}</div>
                <div style={{ color: GOLD, fontSize: 10.5, fontWeight: 600, cursor: "pointer" }}>Readiness Protocol ready →</div>
              </div>
            ))}

            <div style={{ marginTop: 24, padding: "16px 20px", border: `1px solid ${GOLD}33`, background: `${GOLD}08` }}>
              <div style={{ color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Response Confidence</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>94%</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>match across active scenarios</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── SCENARIO CARDS ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { domain: "RISK & RESILIENCE",     label: "Geopolitical Risk Response",   sub: "Trade disruption, sanctions, supply chain exposure",      accent: TEAL },
            { domain: "GROWTH & POSITIONING",  label: "M&A Day 1 Integration",         sub: "Pre-staged execution from the moment of close",           accent: GOLD },
            { domain: "RISK & RESILIENCE",     label: "Cybersecurity Breach",          sub: "Containment, notification and recovery in 12 minutes",    accent: TEAL },
            { domain: "TRANSFORMATION",        label: "Regulatory Compliance Sprint",  sub: "Policy activation deployed before the deadline arrives",  accent: GOLD },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "28px 28px 26px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
              borderTop: `2px solid ${item.accent}`,
              cursor: "pointer",
            }}>
              <div style={{ color: item.accent, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                {item.domain}
              </div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>
                {item.label}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
                {item.sub}
              </div>
              <span style={{ color: item.accent, fontSize: 12, fontWeight: 600 }}>Activate response →</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── THESIS BAR ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>Preparation</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>→</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>Readiness</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>→</span>
          <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Fearless</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 11, fontWeight: 500 }}>
          The Readiness Infrastructure Fortune 1000 Enterprises Are Missing
        </span>
      </div>

    </div>
  );
}
