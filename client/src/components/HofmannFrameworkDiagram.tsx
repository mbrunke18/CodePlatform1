import hofmannImg from "@/assets/hofmann-framework-execution-os.png";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

export default function HofmannFrameworkDiagram() {
  return (
    <div style={{
      background: IVORY,
      border: `1px solid rgba(10,15,46,0.10)`,
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "'Barlow', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: NAVY,
        padding: "24px 32px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
      }}>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10, fontWeight: 600, letterSpacing: "2px",
            textTransform: "uppercase", color: GOLD, marginBottom: 6,
          }}>
            Where Readiness OS Fits in the Enterprise AI Build Stack
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20, fontWeight: 700, color: IVORY, letterSpacing: 0.5,
            lineHeight: 1.2,
          }}>
            How to Build Enterprise AI for Organizations
          </div>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12, color: "rgba(240,237,228,0.55)", marginTop: 6,
            fontStyle: "italic",
          }}>
            Adam Hofmann — Enterprise AI Transformation &amp; Decision Strategy
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {[
            { label: "Step 2", sub: "Decision-Centric AI Design" },
            { label: "Step 6", sub: "Orchestration & Control" },
            { label: "Step 8", sub: "Governance & Security" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(201,168,76,0.15)",
              border: `1px solid rgba(201,168,76,0.35)`,
              borderRadius: 6, padding: "6px 12px", textAlign: "center",
            }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: "1.2px",
                textTransform: "uppercase", color: GOLD,
              }}>{s.label}</div>
              <div style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10, color: IVORY, opacity: 0.75, lineHeight: 1.3,
                maxWidth: 90,
              }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Context strip */}
      <div style={{
        background: TEAL,
        padding: "10px 32px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0,
        }} />
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 11, fontWeight: 500, color: "#fff", letterSpacing: 0.3, margin: 0,
        }}>
          Readiness OS is the only tool in the stack positioned as Coordination Infrastructure — the layer that makes every other AI investment executable at enterprise speed.
        </p>
      </div>

      {/* Image */}
      <div style={{ background: "#fff", padding: "32px" }}>
        <img
          src={hofmannImg}
          alt="Adam Hofmann Enterprise AI Framework — How to Build Enterprise AI for Organizations, with Readiness OS highlighted as coordination infrastructure"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: 6,
          }}
        />
      </div>

      {/* Footer */}
      <div style={{
        background: NAVY,
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 10, color: "rgba(240,237,228,0.4)",
          letterSpacing: "1px", textTransform: "uppercase",
        }}>
          Framework: Adam Hofmann &nbsp;·&nbsp; Coordination Infrastructure: VaughnMartin Readiness OS
        </div>
        <div style={{
          background: "rgba(201,168,76,0.18)",
          border: `1px solid rgba(201,168,76,0.4)`,
          borderRadius: 4, padding: "4px 14px",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 10, fontWeight: 700, color: GOLD,
          letterSpacing: "1.5px", textTransform: "uppercase",
        }}>
          3,600× Execution Head Start
        </div>
      </div>
    </div>
  );
}
