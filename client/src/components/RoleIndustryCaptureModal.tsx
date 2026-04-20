import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

const EXECUTIVE_ROLES = [
  "CEO — Chief Executive Officer",
  "CFO — Chief Financial Officer",
  "COO — Chief Operating Officer",
  "CIO — Chief Information Officer",
  "CHRO — Chief Human Resources Officer",
  "CLO — Chief Legal Officer",
  "CMO — Chief Marketing Officer",
  "CSO — Chief Strategy Officer",
  "Board Director",
  "Division President",
  "EVP / SVP",
];

const INDUSTRY_VERTICALS = [
  "Financial Services & Banking",
  "Healthcare & Life Sciences",
  "Retail & Consumer Goods",
  "Manufacturing & Industrial",
  "Technology & Software",
  "Energy & Utilities",
  "Pharmaceuticals & Biotech",
  "Insurance",
  "Telecommunications",
  "Government & Public Sector",
  "Media & Entertainment",
  "Real Estate & Infrastructure",
];

export default function RoleIndustryCaptureModal() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const effectiveRole = role === "Other" ? customRole.trim() : role;
  const effectiveIndustry = industry === "Other" ? customIndustry.trim() : industry;
  const canSubmit = effectiveRole && effectiveIndustry;

  const saveMutation = useMutation({
    mutationFn: () =>
      apiRequest("PATCH", "/api/user/profile", {
        executiveRole: effectiveRole,
        industryVertical: effectiveIndustry,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setSubmitted(true);
    },
  });

  if (
    isLoading ||
    !isAuthenticated ||
    submitted ||
    (user as any)?.executiveRole ||
    (user as any)?.industryVertical
  ) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10,15,46,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          maxWidth: 540,
          width: "100%",
          borderTop: `4px solid ${GOLD}`,
          padding: "0",
          position: "relative",
          boxShadow: "0 24px 80px rgba(10,15,46,0.3)",
        }}
      >
        {/* Header */}
        <div style={{ background: NAVY, padding: "36px 40px 28px" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 10,
            }}
          >
            Readiness OS · Platform Calibration
          </div>
          <h2
            style={{
              ...CG,
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            Tell us who you are.
            <br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>
              We'll make this yours.
            </em>
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Two fields. We use them to surface the triggers, playbooks, and
            dollar figures that match your function — not generic defaults.
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "32px 40px 36px" }}>
          {/* Role */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: NAVY,
                marginBottom: 8,
              }}
            >
              Your Role
            </label>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setCustomRole(""); }}
              style={{
                width: "100%",
                border: `1.5px solid ${role ? TEAL : BORDER}`,
                borderRadius: 0,
                padding: "12px 14px",
                fontSize: 14,
                color: role ? NAVY : MUTED,
                background: "#fff",
                outline: "none",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
            >
              <option value="" disabled>Select your executive role</option>
              {EXECUTIVE_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="Other">Other — write in my role</option>
            </select>
            {role === "Other" && (
              <input
                autoFocus
                type="text"
                placeholder="e.g. Chief Transformation Officer, Managing Director..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 8,
                  border: `1.5px solid ${customRole.trim() ? TEAL : GOLD}`,
                  borderRadius: 0,
                  padding: "11px 14px",
                  fontSize: 13,
                  color: NAVY,
                  background: "#FFFDF7",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>

          {/* Industry */}
          <div style={{ marginBottom: 32 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: NAVY,
                marginBottom: 8,
              }}
            >
              Your Industry
            </label>
            <select
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); setCustomIndustry(""); }}
              style={{
                width: "100%",
                border: `1.5px solid ${industry ? TEAL : BORDER}`,
                borderRadius: 0,
                padding: "12px 14px",
                fontSize: 14,
                color: industry ? NAVY : MUTED,
                background: "#fff",
                outline: "none",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
            >
              <option value="" disabled>Select your industry</option>
              {INDUSTRY_VERTICALS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
              <option value="Other">Other — write in my sector</option>
            </select>
            {industry === "Other" && (
              <input
                type="text"
                placeholder="e.g. Aerospace & Defense, Private Equity, Higher Education..."
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 8,
                  border: `1.5px solid ${customIndustry.trim() ? TEAL : GOLD}`,
                  borderRadius: 0,
                  padding: "11px 14px",
                  fontSize: 13,
                  color: NAVY,
                  background: "#FFFDF7",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>

          <button
            onClick={() => saveMutation.mutate()}
            disabled={!canSubmit || saveMutation.isPending}
            style={{
              width: "100%",
              background: canSubmit ? NAVY : "#D1D5DB",
              color: canSubmit ? "#fff" : "#9CA3AF",
              border: "none",
              padding: "15px 24px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "background 0.2s",
              borderRadius: 0,
            }}
          >
            {saveMutation.isPending
              ? "Saving…"
              : "Calibrate My Platform →"}
          </button>

          {saveMutation.isError && (
            <p
              style={{
                fontSize: 12,
                color: "#dc2626",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Something went wrong. Please try again.
            </p>
          )}

          <p
            style={{
              fontSize: 11,
              color: MUTED,
              textAlign: "center",
              marginTop: 16,
              lineHeight: 1.5,
            }}
          >
            Used only to personalize your trigger view and playbook
            recommendations. Never shared.
          </p>
        </div>
      </div>
    </div>
  );
}
