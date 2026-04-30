const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BORDER = "#E8E4DC";

const GARTNER_LAYERS = [
  { label: "AI Solutions", sub: "Horizontal · Industry vertical · Enterprise domain" },
  { label: "AI Industries", sub: "Finance · Manufacturing · Healthcare · Government" },
  { label: "AI Services", sub: "Advisory · Service platforms · Model services" },
  { label: "AI Cybersecurity", sub: "Cyber deception · Security platforms · Disinformation" },
  { label: "AI Models & Agentic", sub: "Large models · Domain models · Edge models · Agentic AI" },
  { label: "AI Platforms", sub: "Operations & governance · Resource management" },
  { label: "AI Engineering", sub: "Plan/design · Dev/test · Deploy/scale · Monitor" },
  { label: "AI Data", sub: "Integration & ingestion · Governance · Synthetic data" },
  { label: "AI Infrastructure", sub: "Semiconductors · IaaS · AI devices · Connectivity" },
];

export default function GartnerStackDiagram() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "0 auto" }}>

      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>
          Strategic Positioning
        </span>
      </div>
      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: NAVY, textAlign: "center", marginBottom: 20 }}>
        Where Readiness OS Sits
      </h4>

      {/* The 10th Layer — Readiness OS */}
      <div style={{
        background: NAVY,
        border: `2px solid ${GOLD}`,
        padding: "16px 20px",
        position: "relative",
        marginBottom: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 4, height: 40, background: GOLD, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 3 }}>
                Layer 10 — The Missing Orchestration Layer
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>
                EXECUTION OPERATING MODEL
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                VaughnMartin Readiness OS · Trigger → Readiness Protocol → 12-minute response
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)", padding: "4px 10px" }}>
            <div style={{ width: 6, height: 6, borderRadius: 0, background: TEAL }} className="animate-pulse" />
            <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Not in Gartner's Stack</span>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div style={{ position: "relative", margin: "0 0 0 0", padding: "10px 0" }}>
        <div style={{ borderTop: `1.5px dashed ${GOLD}`, opacity: 0.4 }} />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#F8F7F4",
          padding: "2px 12px",
          border: `1px solid ${BORDER}`,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF" }}>
            Gartner AI Technology Stack · 2026
          </span>
        </div>
      </div>

      {/* Gartner's 9 Layers */}
      <div style={{ border: `1px solid ${BORDER}` }}>
        {GARTNER_LAYERS.map((layer, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              background: i % 2 === 0 ? "#fff" : "#FAFAF8",
              borderBottom: i < GARTNER_LAYERS.length - 1 ? `1px solid ${BORDER}` : "none",
            }}
          >
            <div style={{ width: 3, height: 28, background: "rgba(10,15,46,0.12)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, opacity: 0.65 }}>{layer.label}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{layer.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
        <span style={{ fontSize: 10, color: "#9CA3AF" }}>
          Adapted from Gartner AI Technology Stack, 2026. © Gartner, Inc.
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Readiness OS completes the stack
        </span>
      </div>
    </div>
  );
}
