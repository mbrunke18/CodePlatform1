import { Shield, Mail, ArrowLeft } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";

export default function AccessDenied() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8F7F4",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      padding: "2rem",
    }}>
      <div style={{
        maxWidth: 480,
        width: "100%",
        background: "#fff",
        border: "1px solid #E8E4DC",
        borderTop: `4px solid ${GOLD}`,
        borderRadius: 4,
        padding: "2.5rem",
        textAlign: "center",
      }}>
        <div style={{
          width: 56,
          height: 56,
          background: "#FBF8F0",
          border: `1px solid ${GOLD}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
        }}>
          <Shield size={24} color={GOLD} />
        </div>

        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: NAVY, margin: "0 0 0.5rem" }}>
          Access Restricted
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "#4B5563", lineHeight: 1.65, margin: "0 0 1.75rem" }}>
          This platform is currently in a controlled Founding Partner Program.
          Your account is not on the authorized access list.
        </p>

        <div style={{
          background: "#F8F7F4",
          border: "1px solid #E8E4DC",
          borderRadius: 4,
          padding: "1rem 1.25rem",
          marginBottom: "1.75rem",
          textAlign: "left",
        }}>
          <p style={{ fontSize: "0.8125rem", color: "#6B7280", margin: 0, lineHeight: 1.6 }}>
            If you believe you should have access, contact the VaughnMartin team
            to request Founding Partner access. Include your email address so we
            can add you to the authorized list.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <a
            href="/founding-partner-program"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "0.7rem 1.5rem",
              background: NAVY,
              color: "#fff",
              borderRadius: 4,
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Mail size={15} />
            Apply for Founding Partner Access
          </a>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "0.7rem 1.5rem",
              background: "#fff",
              color: NAVY,
              border: "1px solid #E8E4DC",
              borderRadius: 4,
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={15} />
            Return to Homepage
          </a>
        </div>
      </div>

      <p style={{ marginTop: "1.25rem", fontSize: "0.75rem", color: "#9CA3AF" }}>
        VaughnMartin Readiness OS · Founding Partner Program
      </p>
    </div>
  );
}
