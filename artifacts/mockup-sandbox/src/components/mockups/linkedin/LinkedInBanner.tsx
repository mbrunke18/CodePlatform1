const NAVY = "#0A0F2E";
const NAVY2 = "#0C1238";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const TEALL = "#3DBB97";
const IVORY = "#F0EDE4";

export default function LinkedInBanner() {
  return (
    <div style={{
      width: 1584,
      height: 396,
      background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
      display: "flex",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Barlow Condensed', 'Barlow', 'Inter', sans-serif",
    }}>

      {/* ── Subtle gold grid texture ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.035) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      {/* ── Ambient radial glow ── */}
      <div style={{
        position: "absolute",
        top: -120,
        left: -80,
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)",
      }} />

      {/* ── Command Tower screenshot — right 58% ── */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "60%",
        height: "100%",
        overflow: "hidden",
      }}>
        <img
          src="/command-tower.jpg"
          alt="Command Tower"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top left",
            opacity: 0.72,
          }}
        />
        {/* Navy-to-transparent fade so screenshot blends into the left panel */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to right, ${NAVY} 0%, rgba(10,15,46,0.3) 28%, transparent 52%)`,
        }} />
        {/* Top/bottom vignette */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(10,15,46,0.55) 0%, transparent 25%, transparent 72%, rgba(10,15,46,0.65) 100%)`,
        }} />

        {/* ── LIVE SIGNAL ALERT CARD — overlaid on screenshot ── */}
        <div style={{
          position: "absolute",
          top: "50%",
          right: 52,
          transform: "translateY(-50%)",
          width: 310,
          background: "rgba(10,15,46,0.92)",
          border: `1px solid rgba(201,168,76,0.35)`,
          borderLeft: `3px solid ${GOLD}`,
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          {/* Alert header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(201,168,76,0.6)",
            }}>SIGNAL DETECTED · NOW</div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(220,60,50,0.12)",
              border: "1px solid rgba(220,60,50,0.35)",
              padding: "2px 8px",
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#DC3C32" }} />
              <span style={{ fontSize: 7.5, fontWeight: 900, letterSpacing: "0.2em", color: "#DC3C32" }}>CRITICAL</span>
            </div>
          </div>

          {/* Trigger name */}
          <div>
            <div style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "0.04em",
              marginBottom: 3,
            }}>Activist Investor Disclosure</div>
            <div style={{
              fontSize: 9.5,
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.03em",
            }}>8.3% stake reported · Protocol #47 matched · Score 97</div>
          </div>

          {/* Score bar */}
          <div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(201,168,76,0.5)" }}>SIGNAL SCORE</span>
              <span style={{ fontSize: 10, fontWeight: 900, color: GOLD }}>97 / 100</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.07)" }}>
              <div style={{ width: "97%", height: "100%", background: `linear-gradient(to right, ${GOLD}, #DC3C32)` }} />
            </div>
          </div>

          {/* Protocol row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 8,
            borderTop: "1px solid rgba(201,168,76,0.1)",
          }}>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(201,168,76,0.5)", marginBottom: 2 }}>PROTOCOL MATCHED</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Activist Investor Response · #47</div>
            </div>
            <div style={{
              background: TEAL,
              padding: "5px 12px",
              fontSize: 8,
              fontWeight: 900,
              letterSpacing: "0.18em",
              color: "#ffffff",
              textTransform: "uppercase",
            }}>AUTHORIZE</div>
          </div>
        </div>
      </div>

      {/* ── Gold left accent bar ── */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 4,
        height: "100%",
        background: GOLD,
      }} />

      {/* ── Left content panel ── */}
      <div style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 56px 0 44px",
        width: "50%",
        height: "100%",
        gap: 0,
      }}>

        {/* VM seal + wordmark */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
          marginBottom: 22,
        }}>
          {/* Circular seal */}
          <div style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: `1.5px solid ${GOLD}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(201,168,76,0.07)",
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 17,
              color: GOLD,
              letterSpacing: "0.04em",
            }}>VM</span>
          </div>
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: GOLD,
              lineHeight: 1,
              marginBottom: 3,
            }}>VaughnMartin</div>
            <div style={{
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(240,237,228,0.38)",
              lineHeight: 1,
            }}>Readiness OS</div>
          </div>
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: 48,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.0,
          letterSpacing: "-0.015em",
          marginBottom: 9,
        }}>
          Martin Brunke
        </div>

        {/* Title */}
        <div style={{
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: GOLD,
          marginBottom: 16,
        }}>
          Founder & CEO · VaughnMartin
        </div>

        {/* Gold rule */}
        <div style={{
          width: 44,
          height: 1,
          background: `linear-gradient(to right, ${GOLD}, transparent)`,
          marginBottom: 14,
        }} />

        {/* Tagline */}
        <div style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: 15.5,
          fontStyle: "italic",
          fontWeight: 600,
          color: "rgba(240,237,228,0.72)",
          lineHeight: 1.4,
          marginBottom: 8,
          maxWidth: 390,
        }}>
          "The response is ready before the trigger fires."
        </div>

        {/* Sub-tagline */}
        <div style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: `rgba(43,138,110,0.75)`,
          marginBottom: 20,
        }}>
          AI monitors. Executives authorize.
        </div>

        {/* Stat pills */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {[
            { value: "3,600×", label: "Execution Head Start" },
            { value: "170",    label: "Protocols Ready" },
            { value: "12 min", label: "Execution Time" },
          ].map((s) => (
            <div key={s.label} style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 12px",
              border: "1px solid rgba(201,168,76,0.28)",
              background: "rgba(201,168,76,0.06)",
            }}>
              <span style={{
                fontSize: 13,
                fontWeight: 900,
                color: GOLD,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}>{s.value}</span>
              <span style={{
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(240,237,228,0.42)",
                lineHeight: 1,
              }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom watermark ── */}
      <div style={{
        position: "absolute",
        bottom: 16,
        left: 44,
        zIndex: 3,
        fontSize: 8.5,
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(240,237,228,0.22)",
      }}>
        vaughnmartin.com
      </div>
    </div>
  );
}
