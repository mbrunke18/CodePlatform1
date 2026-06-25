import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import {
  Shield, AlertTriangle, Zap, ArrowRight, CheckCircle2, Target, Clock,
  Settings, ChevronRight, BookOpen, XCircle,
} from "lucide-react";
import { updatePageMetadata } from "@/lib/seo";
import { queryClient, apiRequest } from "@/lib/queryClient";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const DOMAIN_FALLBACKS = [
  { key: "competitive",  label: "Market Dynamics",          playbookName: "Unknown Trigger — Competitive Domain",  description: "Competitor moves, market shifts, positioning threats" },
  { key: "financial",    label: "Financial Strategy",        playbookName: "Unknown Trigger — Financial Domain",    description: "Liquidity events, investor pressure, capital structure" },
  { key: "gtm",          label: "Operational Excellence",    playbookName: "Unknown Trigger — GTM Domain",          description: "Operational disruption, supply chain, process failure" },
  { key: "regulatory",   label: "Regulatory & Compliance",   playbookName: "Unknown Trigger — Regulatory Domain",   description: "Regulatory notice, compliance gap, enforcement risk" },
  { key: "crisis",       label: "Technology & Innovation",   playbookName: "Unknown Trigger — Technology Domain",   description: "System failure, data incident, technology disruption" },
  { key: "strategic",    label: "AI Governance",             playbookName: "Unknown Trigger — Strategic Domain",    description: "AI risk, governance gap, policy exposure" },
  { key: "ma",           label: "Market Opportunities",      playbookName: "Unknown Trigger — M&A Domain",          description: "Acquisition target, partnership, market entry" },
  { key: "technology",   label: "Brand & Reputation",        playbookName: "Unknown Trigger — Brand Domain",        description: "Reputation event, media exposure, brand threat" },
  { key: "talent",       label: "Talent & Leadership",       playbookName: "Unknown Trigger — Talent Domain",       description: "Leadership exit, talent disruption, culture event" },
];

const URGENCY_OPTIONS = [
  { value: "critical", label: "Critical", sub: "Immediate threat — respond now" },
  { value: "high",     label: "High",     sub: "Decision required within 24 hours" },
  { value: "standard", label: "Standard", sub: "Developing situation, 48+ hour window" },
];

function formatBudget(amount: number, currency: string): string {
  if (!amount) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default function ProtocolZeroLaunch() {
  const [description, setDescription] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [urgency, setUrgency] = useState("high");

  useEffect(() => {
    updatePageMetadata(
      "Protocol #0 — Universal Response | Readiness OS",
      "Manually activate Protocol #0 when no specific protocol matches. 12-minute execution chain pre-staged for any situation.",
    );
    const params = new URLSearchParams(window.location.search);
    const d = params.get("domain");
    if (d) setSelectedDomain(d);
  }, []);

  const { data: p0Config } = useQuery<any>({
    queryKey: ["/api/protocol-zero/config"],
  });

  const { data: generatedRaw } = useQuery<any[]>({
    queryKey: ["/api/protocol-zero/generated"],
  });
  const generated = generatedRaw ?? [];

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/protocol-zero/generated/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/protocol-zero/generated"] }),
  });

  const domainMatch = DOMAIN_FALLBACKS.find(d => d.key === selectedDomain);

  const activationHref = (() => {
    const playbookName = domainMatch ? domainMatch.playbookName : "Universal Response Protocol";
    const domainParam  = domainMatch ? selectedDomain : "all";
    const p = new URLSearchParams({ playbookName, domain: domainParam });
    if (description.trim()) p.set("context", description.trim());
    if (urgency !== "high") p.set("urgency", urgency);
    return `/live-activation-center?${p.toString()}`;
  })();

  const isConfigured = !!(p0Config as any)?.primaryAuthorityName;
  const pendingGenerated = generated.filter((g: any) => g.status === "pending_review");
  const promotedGenerated = generated.filter((g: any) => g.status === "promoted");

  return (
    <PageLayout>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "72px 0 52px" }}>
        <div className="max-w-4xl mx-auto px-6">

          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1.5, background: TEAL }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: TEAL }}>
              Universal Response Infrastructure · Protocol #0
            </span>
          </div>

          <h1 style={{ ...CG, color: "#fff", fontSize: 52, fontWeight: 700, lineHeight: 1.08, marginBottom: 16 }}>
            Unknown Situation.<br />
            <em style={{ color: TEAL, fontStyle: "italic" }}>The Response Is Ready.</em>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 16, lineHeight: 1.65, maxWidth: 600, marginBottom: 32 }}>
            When a trigger fires that matches no specific protocol — or when you identify a situation before the system does — Protocol #0 activates immediately. Pre-staged authority, emergency budget, and a 12-minute execution chain, every time.
          </p>

          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[
              { v: "12 min",       l: "Response time" },
              { v: "Protocol #0",  l: "Universal fallback" },
              { v: "9 domains",    l: "Domain-level variants" },
              { v: "Pre-staged",   l: "No mobilization required" },
            ].map(({ v, l }) => (
              <div key={l} style={{ borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: 14 }}>
                <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, ...BC, letterSpacing: "0.04em" }}>{v}</div>
                <div style={{ color: "rgba(255,255,255,0.48)", fontSize: 11 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* ── HOW THIS WORKS (3 steps) ──────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E8E4DC", marginBottom: 28 }}>
          {[
            { n: "01", h: "Identify the situation",  b: "Something is happening. You know it. The system may or may not have detected it yet." },
            { n: "02", h: "Select a domain (optional)", b: "Pick the closest domain to route to the pre-configured authority chain. Or skip — master Protocol #0 covers everything." },
            { n: "03", h: "Authorize activation",    b: "One click. The 12-minute execution chain starts. Stakeholders notified. Budget unlocked. ADVANCE captures the situation permanently." },
          ].map(({ n, h, b }) => (
            <div key={n} style={{ background: "#fff", padding: "20px 22px" }}>
              <div style={{ ...BC, color: GOLD, fontSize: 28, fontWeight: 800, lineHeight: 1, marginBottom: 8 }}>{n}</div>
              <div style={{ ...CG, color: NAVY, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{h}</div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{b}</div>
            </div>
          ))}
        </div>

        {/* ── SITUATION BRIEF FORM ─────────────────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderTop: `3px solid ${TEAL}`, padding: "28px 28px 24px", marginBottom: 24 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <AlertTriangle size={15} color={TEAL} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: TEAL }}>
              Situation Brief
            </span>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>— Optional. Helps route to the right domain protocol.</span>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 7, letterSpacing: "0.03em" }}>
              What's happening?
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Briefly describe the situation — one or two sentences is enough."
              rows={3}
              style={{
                width: "100%", border: "1px solid #E8E4DC", outline: "none",
                padding: "10px 14px", fontSize: 13, color: NAVY, resize: "none",
                fontFamily: "inherit", lineHeight: 1.55, background: "#FAFAF9",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 7 }}>
                Which domain? <span style={{ color: "#9CA3AF", fontWeight: 500 }}>(optional)</span>
              </label>
              <select
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
                style={{ width: "100%", border: "1px solid #E8E4DC", padding: "9px 12px", fontSize: 13, color: NAVY, background: "#FAFAF9", outline: "none", cursor: "pointer" }}
              >
                <option value="">Not sure — use master Protocol #0</option>
                {DOMAIN_FALLBACKS.map(d => (
                  <option key={d.key} value={d.key}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 7 }}>
                Urgency level
              </label>
              <select
                value={urgency}
                onChange={e => setUrgency(e.target.value)}
                style={{ width: "100%", border: "1px solid #E8E4DC", padding: "9px 12px", fontSize: 13, color: NAVY, background: "#FAFAF9", outline: "none", cursor: "pointer" }}
              >
                {URGENCY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label} — {o.sub}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── PRIMARY ACTIVATION CTA ───────────────────────────────── */}
        <div style={{ background: TEAL, padding: "28px 28px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 7 }}>
              {domainMatch
                ? `Domain Protocol #0 · ${domainMatch.label}`
                : "Master Protocol #0 · All 9 Domains"}
            </div>
            <div style={{ ...CG, color: "#fff", fontSize: 26, fontWeight: 700, lineHeight: 1.15, marginBottom: 5 }}>
              {domainMatch
                ? `Activate Universal Response — ${domainMatch.label}`
                : "Activate Universal Response Protocol"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
              12-minute execution chain · Pre-staged authority · Emergency budget unlocked
            </div>
          </div>
          <a
            href={activationHref}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "#fff", color: TEAL, padding: "16px 28px",
              fontWeight: 800, fontSize: 14, textDecoration: "none",
              letterSpacing: "0.04em", flexShrink: 0, whiteSpace: "nowrap",
              ...BC,
            }}
          >
            <Zap size={16} /> ACTIVATE NOW — 12 MIN
          </a>
        </div>

        {/* ── DOMAIN VARIANTS GRID ─────────────────────────────────── */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 20, height: 1.5, background: GOLD }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: NAVY }}>
              Domain-Level Protocol #0 — 9 Variants
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 18, lineHeight: 1.55 }}>
            Select the domain tile that best matches the situation — activates the domain-scoped Universal Response with its pre-configured authority chain and stakeholder set.
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {DOMAIN_FALLBACKS.map(domain => {
              const isSelected = selectedDomain === domain.key;
              return (
                <div
                  key={domain.key}
                  onClick={() => setSelectedDomain(isSelected ? "" : domain.key)}
                  style={{
                    background: isSelected ? "#F0FAF7" : "#fff",
                    border: isSelected ? `1px solid ${TEAL}` : "1px solid #E8E4DC",
                    borderLeft: `3px solid ${isSelected ? TEAL : "#D1D5DB"}`,
                    padding: "16px 18px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: isSelected ? TEAL : "#9CA3AF" }}>
                      Domain #0
                    </span>
                    {isSelected && <CheckCircle2 size={13} color={TEAL} />}
                  </div>
                  <div style={{ ...CG, fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 5, lineHeight: 1.2 }}>{domain.label}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.45, marginBottom: 14 }}>{domain.description}</div>
                  <a
                    href={`/live-activation-center?playbookName=${encodeURIComponent(domain.playbookName)}&domain=${encodeURIComponent(domain.key)}`}
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 10, fontWeight: 700, color: TEAL,
                      textDecoration: "none", ...BC, letterSpacing: "0.06em", textTransform: "uppercase",
                    }}
                  >
                    Activate <ArrowRight size={10} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PRE-STAGING STATUS ────────────────────────────────────── */}
        <div style={{ marginTop: 32, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 20, height: 1.5, background: isConfigured ? TEAL : GOLD }} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: isConfigured ? TEAL : GOLD }}>
                Pre-Staging Status
              </span>
              <span style={{
                ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "2px 8px",
                background: isConfigured ? "rgba(43,138,110,0.08)" : "rgba(201,168,76,0.1)",
                color: isConfigured ? TEAL : GOLD,
                border: `1px solid ${isConfigured ? "rgba(43,138,110,0.25)" : "rgba(201,168,76,0.35)"}`,
              }}>
                {isConfigured ? "CONFIGURED" : "SETUP REQUIRED"}
              </span>
            </div>
            <a href="/protocol-zero-config" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: NAVY, textDecoration: "none", ...BC, letterSpacing: "0.06em" }}>
              <Settings size={12} /> {isConfigured ? "Edit configuration" : "Configure now"}
              <ChevronRight size={11} />
            </a>
          </div>

          <div style={{ background: "#F8F7F4", border: "1px solid #E8E4DC", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {[
              {
                icon: Shield, color: NAVY, label: "Authority chain",
                configured: isConfigured && !!(p0Config as any)?.primaryAuthorityName,
                body: isConfigured && (p0Config as any)?.primaryAuthorityName
                  ? `${(p0Config as any).primaryAuthorityName} (${(p0Config as any).primaryAuthorityRole ?? "Primary"}) · ${(p0Config as any).backupAuthorityName ? (p0Config as any).backupAuthorityName + " (backup)" : "No backup configured"}`
                  : "Not configured — set CEO / COO authority to arm this element.",
              },
              {
                icon: Target, color: GOLD, label: "Emergency budget",
                configured: isConfigured && !!(p0Config as any)?.emergencyBudgetAmount,
                body: isConfigured && (p0Config as any)?.emergencyBudgetAmount
                  ? `${formatBudget((p0Config as any).emergencyBudgetAmount, (p0Config as any).emergencyBudgetCurrency ?? "USD")} pre-approved — unlocks at activation with no committee required.`
                  : "Not configured — set a pre-approved budget envelope.",
              },
              {
                icon: CheckCircle2, color: TEAL, label: "External retainers",
                configured: isConfigured && ((p0Config as any)?.retainers ?? []).length > 0,
                body: isConfigured && ((p0Config as any)?.retainers ?? []).length > 0
                  ? `${(p0Config as any).retainers.length} retainer${(p0Config as any).retainers.length > 1 ? "s" : ""} configured — ${(p0Config as any).retainers.map((r: any) => r.role).filter(Boolean).join(", ") || "available at activation"}.`
                  : "Not configured — add legal, PR, and crisis advisors.",
              },
              {
                icon: Clock, color: NAVY, label: "Notification list",
                configured: isConfigured && ((p0Config as any)?.notificationList ?? []).length > 0,
                body: isConfigured && ((p0Config as any)?.notificationList ?? []).length > 0
                  ? `${(p0Config as any).notificationList.length} executive${(p0Config as any).notificationList.length > 1 ? "s" : ""} on auto-notify — ${(p0Config as any).notificationList.map((n: any) => n.role).filter(Boolean).join(", ") || "notified at activation"}.`
                  : "Not configured — add C-suite and board chair to auto-notify list.",
              },
            ].map(({ icon: Icon, color, label, configured, body }) => (
              <div key={label} style={{ background: "#fff", padding: "18px 20px", borderTop: "1px solid #E8E4DC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                  <Icon size={13} color={configured ? color : "#D1D5DB"} />
                  <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: configured ? color : "#9CA3AF" }}>{label}</span>
                  {configured
                    ? <CheckCircle2 size={11} color={TEAL} />
                    : <span style={{ fontSize: 9, color: GOLD, ...BC, fontWeight: 700, letterSpacing: "0.1em" }}>NEEDS SETUP</span>
                  }
                </div>
                <p style={{ fontSize: 12, color: configured ? "#374151" : "#9CA3AF", lineHeight: 1.55 }}>{body}</p>
              </div>
            ))}
          </div>

          {!isConfigured && (
            <div style={{ marginTop: 12 }}>
              <a href="/protocol-zero-config" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: NAVY, color: "#fff", padding: "12px 24px",
                fontWeight: 800, fontSize: 12, textDecoration: "none",
                ...BC, letterSpacing: "0.08em",
              }}>
                <Settings size={13} /> CONFIGURE PRE-STAGING NOW <ChevronRight size={12} />
              </a>
            </div>
          )}
        </div>

        {/* ── ADVANCE LOOP: GENERATED PROTOCOLS ────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderLeft: `3px solid ${GOLD}`, padding: "22px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Target size={14} color={GOLD} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>ADVANCE Learning Loop</span>
            </div>
            {generated.length > 0 && (
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.08em" }}>
                {promotedGenerated.length} protocol{promotedGenerated.length !== 1 ? "s" : ""} promoted · {pendingGenerated.length} pending review
              </span>
            )}
          </div>

          <p style={{ fontSize: 13, color: NAVY, fontWeight: 600, marginBottom: 5, lineHeight: 1.5 }}>
            Every Protocol #0 activation permanently generates a named protocol.
          </p>
          <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65, marginBottom: pendingGenerated.length > 0 ? 18 : 0 }}>
            After close-out, the system captures this situation as a draft Readiness Protocol. Review and promote to add it permanently to your library — closing the gap so the next similar trigger has a named protocol, not Protocol #0.
          </p>

          {pendingGenerated.length > 0 && (
            <div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: NAVY, marginBottom: 10 }}>
                Pending Executive Review — {pendingGenerated.length} draft{pendingGenerated.length > 1 ? "s" : ""}
              </div>
              {pendingGenerated.map((g: any) => (
                <div key={g.id} style={{ border: "1px solid #E8E4DC", padding: "14px 16px", marginBottom: 8, background: "#FAFAF9" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...CG, fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4, lineHeight: 1.2 }}>
                        {g.situationTitle}
                      </div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {g.domain && <span style={{ fontSize: 11, color: "#6B7280" }}>Domain: {g.domain}</span>}
                        {g.urgency && <span style={{ fontSize: 11, color: "#6B7280" }}>Urgency: {g.urgency}</span>}
                        <span style={{ fontSize: 11, color: "#6B7280" }}>
                          {g.generatedAt ? new Date(g.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => statusMutation.mutate({ id: g.id, status: "promoted" })}
                        disabled={statusMutation.isPending}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          background: TEAL, color: "#fff", border: "none",
                          padding: "7px 14px", cursor: "pointer",
                          fontSize: 10, fontWeight: 700, ...BC, letterSpacing: "0.08em",
                        }}
                      >
                        <BookOpen size={11} /> PROMOTE TO LIBRARY
                      </button>
                      <button
                        onClick={() => statusMutation.mutate({ id: g.id, status: "dismissed" })}
                        disabled={statusMutation.isPending}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          background: "none", color: "#9CA3AF", border: "1px solid #E8E4DC",
                          padding: "7px 12px", cursor: "pointer",
                          fontSize: 10, fontWeight: 700, ...BC, letterSpacing: "0.08em",
                        }}
                      >
                        <XCircle size={11} /> Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {promotedGenerated.length > 0 && pendingGenerated.length === 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 4 }}>
              <CheckCircle2 size={13} color={TEAL} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>
                {promotedGenerated.length} protocol{promotedGenerated.length > 1 ? "s" : ""} promoted to your Readiness Library. The gap is closed.
              </span>
            </div>
          )}
        </div>

      </div>
    </PageLayout>
  );
}
