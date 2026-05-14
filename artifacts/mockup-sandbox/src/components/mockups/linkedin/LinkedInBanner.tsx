const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const IVORY = "#F0EDE4";

export default function LinkedInBanner() {
  return (
    <div style={{
      width: 1584,
      height: 396,
      background: NAVY,
      display: "flex",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Barlow', 'Inter', sans-serif",
    }}>

      {/* ── Command Tower screenshot — right 55% ── */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "62%",
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
            opacity: 0.55,
          }}
        />
        {/* Left-to-right fade so screenshot blends into the navy left panel */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to right, ${NAVY} 0%, transparent 35%)`,
        }} />
        {/* Subtle dark vignette top/bottom for polish */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(10,15,46,0.4) 0%, transparent 30%, transparent 70%, rgba(10,15,46,0.5) 100%)`,
        }} />
      </div>

      {/* ── Gold left accent bar ── */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 5,
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
        padding: "0 52px 0 44px",
        width: "52%",
        height: "100%",
        gap: 0,
      }}>

        {/* VM seal + READINESS OS wordmark */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
        }}>
          {/* Circular seal */}
          <div style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: `2px solid ${GOLD}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(201,168,76,0.08)",
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: "'Barlow Condensed', 'Barlow', sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: GOLD,
              letterSpacing: "0.05em",
            }}>VM</span>
          </div>
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: GOLD,
              lineHeight: 1,
              marginBottom: 3,
            }}>VaughnMartin</div>
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(240,237,228,0.45)",
              lineHeight: 1,
            }}>Readiness OS</div>
          </div>
        </div>

        {/* Name — large, serif */}
        <div style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: 46,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          marginBottom: 10,
        }}>
          Your Name
        </div>

        {/* Title */}
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: GOLD,
          marginBottom: 18,
        }}>
          Founder &amp; CEO · VaughnMartin
        </div>

        {/* Gold rule */}
        <div style={{
          width: 48,
          height: 1,
          background: `linear-gradient(to right, ${GOLD}, transparent)`,
          marginBottom: 16,
        }} />

        {/* Tagline */}
        <div style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: 16,
          fontStyle: "italic",
          fontWeight: 500,
          color: "rgba(240,237,228,0.75)",
          lineHeight: 1.45,
          marginBottom: 22,
          maxWidth: 420,
        }}>
          "The response is ready before the trigger fires."
        </div>

        {/* Stat pills */}
        <div style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}>
          {[
            { value: "221", label: "Triggers Armed" },
            { value: "170", label: "Protocols Ready" },
            { value: "12 min", label: "Execution Time" },
          ].map((s) => (
            <div key={s.label} style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 12px",
              border: "1px solid rgba(201,168,76,0.3)",
              background: "rgba(201,168,76,0.07)",
            }}>
              <span style={{
                fontSize: 14,
                fontWeight: 800,
                color: GOLD,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}>{s.value}</span>
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(240,237,228,0.5)",
                lineHeight: 1,
              }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom-right watermark ── */}
      <div style={{
        position: "absolute",
        bottom: 18,
        right: 24,
        zIndex: 3,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(240,237,228,0.3)",
      }}>
        readinessos.com
      </div>
    </div>
  );
}
