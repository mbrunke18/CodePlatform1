import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChevronDown, RefreshCw } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";

export const EXEC_ROLES = [
  "CEO — Chief Executive Officer",
  "CFO — Chief Financial Officer",
  "COO — Chief Operating Officer",
  "CRO — Chief Risk Officer",
  "CISO — Chief Information Security Officer",
  "CTO — Chief Technology Officer",
  "CMO — Chief Marketing Officer",
  "CLO — Chief Legal Officer",
  "CHRO — Chief Human Resources Officer",
  "Chief of Staff",
  "EVP / SVP Strategy",
  "Board Director",
  "Other",
];

export const INDUSTRIES = [
  "Manufacturing & Industrial",
  "Financial Services & Banking",
  "Healthcare & Life Sciences",
  "Retail & Consumer Goods",
  "Energy & Utilities",
  "Technology & Software",
  "Defense & Government",
  "Pharmaceutical & Biotech",
  "Logistics & Supply Chain",
  "Luxury & Premium Brands",
  "Other",
];

export function shortRole(role: string | null | undefined): string {
  if (!role) return "";
  const dash = role.indexOf(" — ");
  return dash > -1 ? role.slice(0, dash) : role;
}

interface PerspectiveSwitcherProps {
  currentRole?: string | null;
  currentIndustry?: string | null;
}

export default function PerspectiveSwitcher({ currentRole, currentIndustry }: PerspectiveSwitcherProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(currentRole || "");
  const [industry, setIndustry] = useState(currentIndustry || "");
  const [customRole, setCustomRole] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");

  const effectiveRole = role === "Other" ? customRole.trim() : role;
  const effectiveIndustry = industry === "Other" ? customIndustry.trim() : industry;
  const canSave = !!effectiveRole && !!effectiveIndustry;

  const saveMutation = useMutation({
    mutationFn: () =>
      apiRequest("PATCH", "/api/user/profile", {
        executiveRole: effectiveRole,
        industryVertical: effectiveIndustry,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setOpen(false);
    },
  });

  const displayRole = shortRole(currentRole) || "Set role";
  const displayIndustry = currentIndustry
    ? currentIndustry.split(" & ")[0].split(" (")[0]
    : "Set industry";
  const isSet = !!(currentRole && currentIndustry);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => {
          setRole(currentRole || "");
          setIndustry(currentIndustry || "");
          setCustomRole("");
          setCustomIndustry("");
          setOpen(!open);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: isSet ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.07)",
          border: `1px solid ${isSet ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.18)"}`,
          color: isSet ? GOLD : "rgba(255,255,255,0.6)",
          padding: "6px 14px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          borderRadius: 2,
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        <RefreshCw size={11} />
        <span>
          {isSet ? `${displayRole} · ${displayIndustry}` : "Set your perspective →"}
        </span>
        <ChevronDown
          size={11}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              zIndex: 50,
              background: NAVY,
              border: "1px solid rgba(201,168,76,0.3)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              width: 360,
              padding: "24px",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 16, height: 1, background: GOLD }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD }}>
                  Switch Perspective
                </span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: 0 }}>
                See the platform from any seat in the C-suite. The response is calibrated to the role.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
                Executive Role
              </label>
              <select
                value={role}
                onChange={e => { setRole(e.target.value); setCustomRole(""); }}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: role ? "#fff" : "rgba(255,255,255,0.4)", padding: "10px 12px", fontSize: 13, borderRadius: 2, outline: "none" }}
              >
                <option value="" style={{ background: NAVY }}>Select a role…</option>
                {EXEC_ROLES.map(r => (
                  <option key={r} value={r} style={{ background: NAVY }}>{r}</option>
                ))}
              </select>
              {role === "Other" && (
                <input
                  autoFocus
                  value={customRole}
                  onChange={e => setCustomRole(e.target.value)}
                  placeholder="e.g. Chief Transformation Officer"
                  style={{ width: "100%", marginTop: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,168,76,0.4)", color: "#fff", padding: "10px 12px", fontSize: 13, borderRadius: 2, outline: "none", boxSizing: "border-box" }}
                />
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
                Industry Sector
              </label>
              <select
                value={industry}
                onChange={e => { setIndustry(e.target.value); setCustomIndustry(""); }}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: industry ? "#fff" : "rgba(255,255,255,0.4)", padding: "10px 12px", fontSize: 13, borderRadius: 2, outline: "none" }}
              >
                <option value="" style={{ background: NAVY }}>Select a sector…</option>
                {INDUSTRIES.map(i => (
                  <option key={i} value={i} style={{ background: NAVY }}>{i}</option>
                ))}
              </select>
              {industry === "Other" && (
                <input
                  autoFocus
                  value={customIndustry}
                  onChange={e => setCustomIndustry(e.target.value)}
                  placeholder="e.g. Professional Services"
                  style={{ width: "100%", marginTop: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,168,76,0.4)", color: "#fff", padding: "10px 12px", fontSize: 13, borderRadius: 2, outline: "none", boxSizing: "border-box" }}
                />
              )}
            </div>

            <button
              onClick={() => saveMutation.mutate()}
              disabled={!canSave || saveMutation.isPending}
              style={{
                width: "100%",
                background: canSave ? GOLD : "rgba(255,255,255,0.08)",
                color: canSave ? NAVY : "rgba(255,255,255,0.3)",
                border: "none",
                padding: "12px 20px",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: canSave ? "pointer" : "not-allowed",
                borderRadius: 2,
                transition: "all 0.15s",
              }}
            >
              {saveMutation.isPending ? "Switching…" : "Apply Perspective →"}
            </button>

            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              This calibrates your dashboard framing and prepared response context.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
