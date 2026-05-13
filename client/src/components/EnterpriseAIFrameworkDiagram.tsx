import type { ReactNode, CSSProperties } from "react";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL2 = "#1D9E75";
const TEAL3 = "#085041";
const IVORY = "#F0EDE4";

function VerticalLabel({ text }: { text: string }) {
  return (
    <div style={{
      width: 72, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "flex-end",
      paddingRight: 12,
    }}>
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 10, fontWeight: 600, letterSpacing: "1.4px",
        textTransform: "uppercase", color: NAVY, opacity: 0.4,
        writingMode: "vertical-rl" as const,
        transform: "rotate(180deg)",
        whiteSpace: "nowrap",
      }}>{text}</span>
    </div>
  );
}

function TierBox({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: TEAL2, color: "#E1F5EE",
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 12, fontWeight: 500, padding: "7px 16px",
      borderRadius: 0, textAlign: "center", letterSpacing: 0.3,
      ...style,
    }}>{children}</div>
  );
}

export default function EnterpriseAIFrameworkDiagram() {
  const pillars = [
    {
      num: "①", head: "Use Case Prioritization",
      items: ["How BUs propose AI use cases", "Value & feasibility evaluation", "Portfolio balancing"],
    },
    {
      num: "②", head: "Lifecycle Ownership",
      items: ["Model monitoring in production", "Accountability for drift", "Updates as markets evolve"],
    },
    {
      num: "③", head: "Governance Integration",
      items: ["Use case approval", "Development & testing", "Validation & risk", "Production monitoring"],
    },
    {
      num: "④", head: "Business Access & Collaboration",
      items: ["Pathways to propose opportunities", "Collaboration with AI teams", "Hub-and-spoke execution"],
    },
  ];

  return (
    <div style={{
      background: IVORY,
      border: `1px solid rgba(10,15,46,0.10)`,
      borderRadius: 0,
      padding: "36px 28px",
      fontFamily: "'Barlow', sans-serif",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 10, fontWeight: 600, letterSpacing: "2px",
          textTransform: "uppercase", color: TEAL2, marginBottom: 6,
        }}>
          Where Readiness OS Fits in the Enterprise AI Stack
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, fontWeight: 700, color: NAVY, letterSpacing: 0.5,
          marginBottom: 6,
        }}>
          Enterprise AI Operating Model for Scalable Governance
        </div>
        <div style={{ width: 48, height: 1, background: GOLD, margin: "0 auto" }} />
      </div>

      {/* AI Strategy */}
      <div style={{ display: "flex", marginBottom: 6 }}>
        <VerticalLabel text="AI Strategy" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TierBox style={{ width: 200, background: "#0F6E56" }}>AI Vision &amp; Strategic Objectives</TierBox>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TierBox style={{ width: "55%" }}>AI Use Case Portfolio</TierBox>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
            <TierBox style={{ width: "34%" }}>Value &amp; Feasibility Assessment</TierBox>
            <TierBox style={{ width: "34%" }}>Risk &amp; Compliance Appetite</TierBox>
          </div>
          <TierBox style={{ background: TEAL3, color: "#9FE1CB", fontSize: 13 }}>Enterprise AI Lifecycle</TierBox>
        </div>
      </div>

      {/* Target Operating Model */}
      <div style={{ display: "flex", marginBottom: 6, marginTop: 4 }}>
        <VerticalLabel text="Target Operating Model" />
        <div style={{ flex: 1, border: `1.5px dashed ${GOLD}`, borderRadius: 0, padding: 10, background: `rgba(201,168,76,0.03)` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {pillars.map((p) => (
              <div key={p.head} style={{ background: "#fff", border: `0.5px solid ${TEAL2}`, borderRadius: 0, overflow: "hidden" }}>
                <div style={{
                  background: TEAL2, color: "#E1F5EE",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11, fontWeight: 600,
                  padding: "7px 9px", lineHeight: 1.3, minHeight: 40,
                  display: "flex", alignItems: "center",
                }}>
                  {p.num} {p.head}
                </div>
                <div style={{ padding: "8px 9px" }}>
                  {p.items.map((item) => (
                    <div key={item} style={{
                      fontSize: 10, color: "#3d3d3a", lineHeight: 1.5,
                      paddingLeft: 10, position: "relative", marginBottom: 2,
                      fontFamily: "'Barlow', sans-serif",
                    }}>
                      <span style={{ position: "absolute", left: 0, color: TEAL2, fontSize: 11 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connector */}
      <div style={{ display: "flex", marginBottom: 0 }}>
        <div style={{ width: 72, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{
            textAlign: "center",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11, letterSpacing: "1.5px", color: GOLD,
            textTransform: "uppercase", marginBottom: 2,
          }}>
            All four pillars route through the coordination layer
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "0 60px" }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 1, height: 12, background: GOLD }} />
                <div style={{ width: 0, height: 0, borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderTop: `4px solid ${GOLD}` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Readiness OS */}
      <div style={{ display: "flex", marginTop: 2, marginBottom: 16 }}>
        <VerticalLabel text="Coordination Layer" />
        <div style={{ flex: 1, background: NAVY, border: `1.5px solid ${GOLD}`, borderRadius: 0, padding: "16px 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(201,168,76,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 3,
          }}>
            Readiness OS &nbsp;by VaughnMartin
          </div>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 11, color: IVORY, opacity: 0.72, marginBottom: 12, fontStyle: "italic",
          }}>
            The coordination infrastructure the operating model assumes but doesn't draw
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {["170 Readiness Protocols", "IDEA Framework", "9 Strategic Domains", "12-Minute Execution Cycles", "Large Enterprise"].map((c) => (
              <span key={c} style={{
                background: "rgba(201,168,76,0.14)", border: `0.5px solid rgba(201,168,76,0.38)`,
                borderRadius: 0, padding: "3px 10px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 10, fontWeight: 500, color: GOLD, letterSpacing: 0.5,
              }}>{c}</span>
            ))}
            <span style={{
              background: "rgba(201,168,76,0.28)", border: `1px solid ${GOLD}`,
              borderRadius: 0, padding: "3px 10px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: 0.5,
            }}>3,600× Execution Head Start</span>
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 12, fontWeight: 500, color: TEAL2,
            borderTop: `0.5px solid rgba(201,168,76,0.22)`, paddingTop: 9,
          }}>
            Compresses{" "}
            <strong style={{ color: GOLD }}>30-day mobilization cycles</strong>
            {" "}into{" "}
            <strong style={{ color: GOLD }}>12-minute coordinated action</strong>
            {" "}— across all four pillars simultaneously.
          </div>
        </div>
      </div>

      {/* Foundation */}
      <div style={{ display: "flex", marginBottom: 20 }}>
        <VerticalLabel text="Foundation" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {["Decision Rights & Accountability", "Enterprise AI Talent Stack", "Culture, Trust & AI Literacy"].map((bar) => (
            <div key={bar} style={{
              background: TEAL3, color: "#9FE1CB",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12, fontWeight: 500, padding: "8px 16px",
              borderRadius: 0, letterSpacing: 0.3,
            }}>{bar}</div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        border: `0.5px solid rgba(10,15,46,0.12)`, borderRadius: 0,
        padding: "16px 20px", background: "#fff",
        display: "flex", gap: 28,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10, fontWeight: 600, letterSpacing: "1.5px",
            textTransform: "uppercase", color: NAVY, opacity: 0.45, marginBottom: 8,
          }}>Framework Origin</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 11, height: 11, background: TEAL2, borderRadius: 0, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 10, color: "#3d3d3a", lineHeight: 1.5, fontFamily: "'Barlow', sans-serif" }}>
              <strong style={{ color: NAVY, fontWeight: 500 }}>Greeshma M. Neglur's framework</strong> — governance architecture & AI operating model design. Defines what decisions get made and who owns them.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ width: 11, height: 11, background: NAVY, border: `1px solid ${GOLD}`, borderRadius: 0, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 10, color: "#3d3d3a", lineHeight: 1.5, fontFamily: "'Barlow', sans-serif" }}>
              <strong style={{ color: NAVY, fontWeight: 500 }}>Readiness OS by VaughnMartin</strong> — the missing coordination layer. Ensures those decisions compress from 30-day mobilization cycles into 12-minute coordinated action — a 3,600× Execution Head Start.
            </p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10, fontWeight: 600, letterSpacing: "1.5px",
            textTransform: "uppercase", color: NAVY, opacity: 0.45, marginBottom: 8,
          }}>The Key Distinction</div>
          <p style={{
            fontStyle: "italic", color: NAVY, lineHeight: 1.6,
            fontSize: 11, fontFamily: "'Barlow', sans-serif",
          }}>
            "A well-designed operating model tells you <strong>what</strong> to decide and <strong>who</strong> decides it. Readiness OS is what makes those decisions move — compressing the 30-day mobilization cycle into <strong>12 minutes of coordinated action</strong>. That is the 3,600× Execution Head Start."
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 14, textAlign: "center",
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 10, color: NAVY, opacity: 0.3,
        letterSpacing: "1px", textTransform: "uppercase",
      }}>
        VaughnMartin &nbsp;·&nbsp; Readiness OS &nbsp;·&nbsp; We Make Enterprises Fearless.
      </div>
    </div>
  );
}
