const NAVY = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

export function BestOutcome() {
  return (
    <div style={{ fontFamily: "'Barlow', 'Inter', sans-serif", background: NAVY, minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px 56px",
        background: "linear-gradient(to bottom, rgba(10,15,46,0.9) 0%, transparent 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: GOLD, fontSize: 12, fontWeight: 800, letterSpacing: "0.05em" }}>VM</span>
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", lineHeight: 1 }}>VAUGHNMARTIN</div>
            <div style={{ color: `${GOLD}99`, fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>Readiness OS</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Platform", "Prepared Responses", "Industries", "Investors"].map(item => (
            <span key={item} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a style={{ color: GOLD, border: `1px solid ${GOLD}66`, padding: "10px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em", cursor: "pointer" }}>
            See It Live
          </a>
          <a style={{ background: GOLD, color: NAVY, padding: "10px 24px", fontSize: 13, fontWeight: 800, textDecoration: "none", letterSpacing: "0.04em", cursor: "pointer" }}>
            Request Access
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: 600, display: "flex", alignItems: "center", overflow: "hidden", background: NAVY_BG }}>

        {/* Gold grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GOLD}0d 1px, transparent 1px), linear-gradient(90deg, ${GOLD}0d 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />

        {/* Cinematic radial depth */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 65% 80% at 78% 50%, ${TEAL}2e 0%, transparent 60%), radial-gradient(ellipse 45% 55% at 88% 15%, ${GOLD}1a 0%, transparent 55%), radial-gradient(ellipse 35% 50% at 20% 80%, ${TEAL}14 0%, transparent 55%)` }} />

        {/* Flowing network lines */}
        <div style={{ position: "absolute", right: "4%",  top: "22%", width: "40%", height: 1, background: `linear-gradient(to right, transparent, ${TEAL}99, transparent)` }} />
        <div style={{ position: "absolute", right: "10%", top: "38%", width: "32%", height: 1, background: `linear-gradient(to right, transparent, ${GOLD}88, transparent)` }} />
        <div style={{ position: "absolute", right: "2%",  top: "55%", width: "44%", height: 1, background: `linear-gradient(to right, transparent, ${TEAL}77, transparent)` }} />
        <div style={{ position: "absolute", right: "16%", top: "70%", width: "26%", height: 1, background: `linear-gradient(to right, transparent, ${GOLD}66, transparent)` }} />

        {/* Glowing nodes */}
        {[
          { l: "60%", t: "25%", c: TEAL,  s: 8 }, { l: "72%", t: "40%", c: GOLD,  s: 6 },
          { l: "57%", t: "57%", c: TEAL,  s: 5 }, { l: "80%", t: "32%", c: GOLD,  s: 7 },
          { l: "68%", t: "68%", c: TEAL,  s: 5 }, { l: "86%", t: "52%", c: GOLD,  s: 6 },
          { l: "76%", t: "20%", c: TEAL,  s: 4 }, { l: "64%", t: "75%", c: GOLD,  s: 4 },
        ].map((n, i) => (
          <div key={i} style={{ position: "absolute", left: n.l, top: n.t, width: n.s, height: n.s, borderRadius: "50%", background: n.c, boxShadow: `0 0 14px ${n.c}` }} />
        ))}

        {/* Hero copy */}
        <div style={{ position: "relative", zIndex: 2, padding: "130px 56px 80px", maxWidth: 700 }}>

          {/* Live status badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", padding: "6px 16px", marginBottom: 36 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
            <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Live — 221 Triggers Monitored Continuously</span>
          </div>

          {/* Locked headline */}
          <h1 style={{ color: "#fff", fontSize: 60, fontWeight: 800, lineHeight: 1.05, margin: "0 0 0" }}>
            The Response Is Ready
          </h1>
          <h1 style={{ color: GOLD, fontSize: 60, fontWeight: 800, lineHeight: 1.05, margin: "0 0 28px" }}>
            Before the Trigger Fires.
          </h1>

          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 18, lineHeight: 1.75, maxWidth: 540, margin: "0 0 44px" }}>
            30 days of mobilization compressed to 12 minutes. 170 Prepared Responses pre-staged and executive-authorized — not after the trigger, before it.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <a style={{ background: GOLD, color: NAVY, padding: "16px 36px", fontSize: 14, fontWeight: 800, textDecoration: "none", letterSpacing: "0.06em", cursor: "pointer" }}>
              Activate a Response →
            </a>
            <a style={{ background: "transparent", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.2)", padding: "16px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>
              12-Minute Experience
            </a>
          </div>

          {/* Inline proof line */}
          <div style={{ display: "flex", gap: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[
              { n: "12 min", l: "Trigger to execution" },
              { n: "3,600×", l: "Execution head start" },
              { n: "170", l: "Prepared Responses" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ color: GOLD, fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{s.n}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 4, letterSpacing: "0.04em" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCENARIO CARDS (Work4Flow pattern) ── */}
      <div style={{ background: NAVY, borderTop: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { label: "Geopolitical Risk Response",    sub: "Trade disruption, sanctions, supply chain exposure",  tag: "RISK & RESILIENCE" },
            { label: "M&A Day 1 Integration",          sub: "Pre-staged execution from day one of close",           tag: "GROWTH & POSITIONING" },
            { label: "Cybersecurity Breach",           sub: "Containment, notification, recovery — 12 minutes",    tag: "RISK & RESILIENCE" },
            { label: "Regulatory Compliance Sprint",   sub: "Policy activation before the deadline hits",          tag: "TRANSFORMATION" },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "28px 28px 24px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              borderTop: `3px solid ${i % 2 === 0 ? TEAL : GOLD}`,
              background: "rgba(255,255,255,0.015)",
              cursor: "pointer",
              transition: "background 0.2s",
            }}>
              <div style={{ color: i % 2 === 0 ? TEAL : GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>{item.tag}</div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{item.label}</div>
              <div style={{ color: "rgba(255,255,255,0.42)", fontSize: 12, lineHeight: 1.55, marginBottom: 16 }}>{item.sub}</div>
              <span style={{ color: i % 2 === 0 ? TEAL : GOLD, fontSize: 12, fontWeight: 600 }}>Activate response →</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── THESIS BAR ── */}
      <div style={{ background: `${NAVY}`, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "18px 56px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <span style={{ color: `${GOLD}88`, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Preparation</span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>→</span>
        <span style={{ color: `${GOLD}88`, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Readiness</span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>→</span>
        <span style={{ color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>Fearless</span>
        <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 14, margin: "0 8px" }}>|</span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>The Readiness Infrastructure Fortune 1000 Enterprises Are Missing</span>
      </div>
    </div>
  );
}
