import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function DemoAccess() {
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const returnTo = params.get("returnTo") || "/mission-control";

    if (!token) {
      setStatus("error");
      return;
    }

    const target = `/api/demo-access?token=${encodeURIComponent(token)}&returnTo=${encodeURIComponent(returnTo)}`;
    window.location.href = target;
  }, []);

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";

  if (status === "error") {
    return (
      <div style={{
        background: NAVY, minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>
            VaughnMartin · Readiness OS
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
            Access Token Required
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 360, margin: "0 auto 32px" }}>
            This link requires a valid access token. Contact your VaughnMartin representative for demo access.
          </p>
          <a
            href="/request-access"
            style={{
              display: "inline-block", background: GOLD, color: NAVY,
              fontWeight: 700, fontSize: 13, padding: "12px 28px",
              textDecoration: "none", letterSpacing: "0.05em",
            }}
          >
            Request Pilot Access
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: NAVY, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 32 }}>
          VaughnMartin · Readiness OS
        </div>

        {/* Animated ring */}
        <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 32px" }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: `2px solid rgba(201,168,76,0.2)`,
          }} />
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: `2px solid transparent`,
            borderTopColor: GOLD,
            animation: "spin 1s linear infinite",
          }} />
          <div style={{
            position: "absolute", inset: 8, borderRadius: "50%",
            background: `radial-gradient(ellipse, rgba(43,138,110,0.3) 0%, transparent 70%)`,
          }} />
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 600,
          color: "#fff", lineHeight: 1.2, marginBottom: 12,
        }}>
          Preparing your executive access
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
          Signing you in to the Readiness OS platform…
        </p>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
