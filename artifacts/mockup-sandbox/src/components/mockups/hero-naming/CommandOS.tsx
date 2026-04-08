const NAVY = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

function Seal() {
  return (
    <div style={{ width: 72, height: 72, position: "relative", margin: "0 auto 28px" }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: `conic-gradient(${GOLD}, #e8d08a, ${GOLD}, #a07828, ${GOLD})`,
        padding: 2, boxSizing: "border-box"
      }}>
        <div style={{
          width: "100%", height: "100%", borderRadius: "50%",
          background: NAVY_BG,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: GOLD, letterSpacing: "0.04em"
          }}>VM</span>
        </div>
      </div>
    </div>
  );
}

function MetricPill({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "14px 24px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(201,168,76,0.25)",
      borderRadius: 4
    }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: GOLD, letterSpacing: "-0.01em", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

export function CommandOS() {
  return (
    <div style={{
      minHeight: "100vh",
      background: NAVY_BG,
      fontFamily: "'Inter', system-ui, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)`,
        backgroundSize: "48px 48px"
      }} />
      {/* Radial orbs */}
      <div style={{ position: "absolute", top: -200, left: "60%", width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, rgba(43,138,110,0.15) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 100, left: -200, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Nav strip */}
      <div style={{ position: "relative", zIndex: 10, padding: "16px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: "white", letterSpacing: "0.02em" }}>VaughnMartin</span>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Platform", "Playbooks", "Investors", "Resources"].map(item => (
            <span key={item} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", cursor: "pointer" }}>{item}</span>
          ))}
          <div style={{ padding: "8px 18px", background: GOLD, borderRadius: 3, fontSize: 13, fontWeight: 600, color: NAVY, cursor: "pointer" }}>Request Access</div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "72px 48px 64px", maxWidth: 900, margin: "0 auto" }}>
        <Seal />

        {/* Eyebrow */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "6px 16px", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
          <span style={{ fontSize: 12, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>CommandOS · Enterprise Platform</span>
        </div>

        <h1 style={{ fontSize: 52, fontWeight: 700, color: "white", lineHeight: 1.1, margin: "0 0 10px", fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.02em" }}>
          CommandOS
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", margin: "0 0 20px", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
          by VaughnMartin
        </p>
        <p style={{ fontSize: 20, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
          Coordination infrastructure for the Fortune 1000.
        </p>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: "0 0 48px", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
          30 days compressed to 12 minutes. AI monitors. Executives command.<br />
          The command infrastructure enterprises are missing.
        </p>

        {/* Metrics */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
          <MetricPill value="12 min" label="Command Head Start" />
          <MetricPill value="3,600×" label="vs. 30-Day Standard" />
          <MetricPill value="170" label="Pre-Staged Playbooks" />
          <MetricPill value="221" label="Trigger Patterns" />
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <div style={{ padding: "14px 32px", background: GOLD, borderRadius: 3, fontSize: 14, fontWeight: 600, color: NAVY, cursor: "pointer", letterSpacing: "0.03em" }}>
            Request Access
          </div>
          <div style={{ padding: "14px 32px", background: "transparent", border: `1px solid rgba(255,255,255,0.25)`, borderRadius: 3, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>
            Investor Resources →
          </div>
        </div>

        {/* Microsoft framing strip */}
        <div style={{ marginTop: 56, padding: "18px 28px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, textAlign: "left", maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>
            <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>Every enterprise has Microsoft's AI stack.</span>{" "}
            None have the operating model to use it. CommandOS is that operating model.
          </p>
        </div>
      </div>
    </div>
  );
}
