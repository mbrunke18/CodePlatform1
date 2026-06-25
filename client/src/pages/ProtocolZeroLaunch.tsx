import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import {
  Shield, AlertTriangle, Zap, ArrowRight, CheckCircle2, Target, Clock
} from "lucide-react";
import { updatePageMetadata } from "@/lib/seo";

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

  const domainMatch = DOMAIN_FALLBACKS.find(d => d.key === selectedDomain);

  const activationHref = (() => {
    const playbookName = domainMatch ? domainMatch.playbookName : "Universal Response Protocol";
    const domainParam  = domainMatch ? selectedDomain : "all";
    const p = new URLSearchParams({ playbookName, domain: domainParam });
    if (description.trim()) p.set("context", description.trim());
    if (urgency !== "high") p.set("urgency", urgency);
    return `/live-activation-center?${p.toString()}`;
  })();

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

        {/* ── HOW THIS WORKS (3 steps, fast read) ──────────────────── */}
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
            Select the domain tile that best matches the situation — activates the domain-scoped Universal Response with its pre-configured authority chain and stakeholder set. Click a tile to select it, then use the activation button above.
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

        {/* ── PRE-STAGING REMINDER ─────────────────────────────────── */}
        <div style={{ background: "#F8F7F4", border: "1px solid #E8E4DC", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, marginBottom: 24, marginTop: 28 }}>
          {[
            { icon: Shield,        c: NAVY, label: "Authority chain",      body: "CEO / COO authority pre-configured during onboarding. Protocol #0 always has an authorized executive." },
            { icon: Target,        c: GOLD, label: "Emergency budget",     body: "A pre-approved envelope the CFO sets once. No committee required. Unlocked at activation." },
            { icon: CheckCircle2,  c: TEAL, label: "External retainers",   body: "Legal counsel, PR firm, and crisis advisors engaged on retainer — available in 12 minutes." },
            { icon: Clock,         c: NAVY, label: "Notification list",    body: "C-suite + board chair notified automatically at activation. Pre-configured in org setup." },
          ].map(({ icon: Icon, c, label, body }) => (
            <div key={label} style={{ background: "#fff", padding: "18px 20px", borderTop: "1px solid #E8E4DC" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                <Icon size={13} color={c} />
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: c }}>{label}</span>
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* ── ADVANCE LOOP NOTE ────────────────────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderLeft: `3px solid ${GOLD}`, padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
            <Target size={14} color={GOLD} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>ADVANCE Learning Loop</span>
          </div>
          <p style={{ fontSize: 13, color: NAVY, fontWeight: 600, marginBottom: 5, lineHeight: 1.5 }}>
            Every Protocol #0 activation permanently generates a named protocol.
          </p>
          <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65 }}>
            After close-out, the system captures this situation as a permanent named Readiness Protocol. The next time a similar trigger fires, a specific protocol is ready — not Protocol #0. The gap closes after first use. The protocol library grows with every activation.
          </p>
        </div>

      </div>
    </PageLayout>
  );
}
