import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Printer, ChevronRight, Zap, Shield, TrendingUp, Eye, Activity, BarChart3, ArrowLeft } from "lucide-react";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const MUTED = "#6B7280";
const BORDER = "#E8E4DC";
const OFF = "#F8F7F4";

const DOMAINS = [
  "Financial Strategy",
  "Market Dynamics",
  "Operational Excellence",
  "Technology & Innovation",
  "AI Governance",
  "Brand & Reputation",
  "Regulatory & Compliance",
  "Talent & Leadership",
];

const DOMAIN_PLAYBOOK_COUNTS: Record<string, number> = {
  "Financial Strategy": 24,
  "Market Dynamics": 22,
  "Operational Excellence": 21,
  "Technology & Innovation": 20,
  "AI Governance": 19,
  "Market Opportunities": 18,
  "Brand & Reputation": 17,
  "Regulatory & Compliance": 15,
  "Talent & Leadership": 14,
};

const DOMAIN_ROI: Record<string, { rate: number; baseline: number; events: number; label: string }> = {
  "Financial Strategy":     { rate: 850,  baseline: 45, events: 5, label: "regulatory & capital events" },
  "Market Dynamics":        { rate: 700,  baseline: 30, events: 6, label: "competitive response events" },
  "Operational Excellence": { rate: 650,  baseline: 21, events: 8, label: "operational disruption events" },
  "Technology & Innovation":{ rate: 780,  baseline: 30, events: 5, label: "technology disruption events" },
  "AI Governance":          { rate: 900,  baseline: 60, events: 4, label: "governance & compliance events" },
  "Brand & Reputation":     { rate: 1050, baseline: 7,  events: 6, label: "reputational crisis events" },
  "Regulatory & Compliance":{ rate: 820,  baseline: 45, events: 5, label: "regulatory response events" },
  "Talent & Leadership":    { rate: 620,  baseline: 45, events: 4, label: "leadership disruption events" },
};

const DOMAIN_TRIGGERS: Record<string, string[]> = {
  "Financial Strategy":     ["Federal Reserve Policy Shift", "Credit Market Disruption", "Capital Adequacy Breach"],
  "Market Dynamics":        ["Competitor Product Launch", "Pricing Disruption Signal", "Customer Consolidation"],
  "Operational Excellence": ["Tier-1 Supplier Failure", "Production Capacity Crisis", "Logistics Network Disruption"],
  "Technology & Innovation":["AI Competitive Disruption", "Cybersecurity Breach Signal", "Digital Infrastructure Failure"],
  "AI Governance":          ["AI Regulatory Framework Change", "Model Risk Governance Gap", "Algorithmic Bias Detection"],
  "Brand & Reputation":     ["Reputational Crisis Signal", "Social Media Velocity Spike", "Executive Misconduct Signal"],
  "Regulatory & Compliance":["SEC Investigation Notice", "Regulatory Audit Trigger", "Compliance Deadline Breach"],
  "Talent & Leadership":    ["C-Suite Departure Signal", "Talent Exodus Pattern", "Board Composition Risk"],
};

const IDEA_PHASES = [
  { letter: "I", name: "IDENTIFY", desc: "170 Readiness Protocols pre-built and staged across 9 domains. Nothing improvised. Everything ready before the trigger fires." },
  { letter: "D", name: "DETECT", desc: "248+ data points monitored every 15 minutes across 25 pre-configured signal sources — news, regulatory, SEC, cybersecurity, economic indicators, and government enforcement. 221 trigger patterns armed and ready." },
  { letter: "E", name: "EXECUTE", desc: "12-minute response from trigger detection to full execution in flight. No alignment call. No mobilization delay." },
  { letter: "A", name: "ADVANCE", desc: "Every execution improves the next. Institutional memory compounds. Response time and accuracy improve continuously." },
];

interface FormData {
  company: string;
  contactName: string;
  contactTitle: string;
  industry: string;
  concern: string;
}

export default function ProspectBrief() {
  const [, setLocation] = useLocation();
  const [stage, setStage] = useState<"form" | "brief">("form");
  const [form, setForm] = useState<FormData>({
    company: "",
    contactName: "",
    contactTitle: "",
    industry: "Financial Strategy",
    concern: "",
  });

  const { data: playbooksRaw } = useQuery<any>({
    queryKey: ["/api/playbook-library"],
    enabled: stage === "brief",
  });
  const allPlaybooks = Array.isArray(playbooksRaw?.playbooks) ? playbooksRaw.playbooks : [];
  const domainPlaybooks = allPlaybooks.filter((p: any) => p.domain === form.industry).slice(0, 5);

  const roi = DOMAIN_ROI[form.industry] || DOMAIN_ROI["Financial Strategy"];
  const annualValue = roi.rate * (roi.baseline * 5) * roi.events;
  const perEventValue = roi.rate * roi.baseline * 5;
  const playbookCount = DOMAIN_PLAYBOOK_COUNTS[form.industry] || 20;
  const triggers = DOMAIN_TRIGGERS[form.industry] || [];
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const handleSubmit = () => {
    if (!form.company.trim()) return;
    setStage("brief");
  };

  if (stage === "form") {
    return (
      <div style={{ minHeight: "100vh", background: OFF, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 560 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <VaughnMartinLogo height={72} variant="full" color="dark" />
          </div>

          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `4px solid ${GOLD}`, padding: "40px 40px 36px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 12, textAlign: "center" }}>
              Executive Briefing Generator
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: NAVY, textAlign: "center", marginBottom: 8, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.3 }}>
              Generate a Prospect-Specific Executive Brief
            </h1>
            <p style={{ fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 32, lineHeight: 1.6 }}>
              A printable 2-page document showing exactly how Readiness OS would deploy for this organization — specific Readiness Protocols, triggers, and ROI.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 6 }}>Company Name *</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="Acme Corporation"
                  style={{ width: "100%", padding: "11px 14px", border: `1px solid ${BORDER}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: NAVY }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 6 }}>Contact Name</label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                  placeholder="Jane Smith"
                  style={{ width: "100%", padding: "11px 14px", border: `1px solid ${BORDER}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: NAVY }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 6 }}>Title / Role</label>
                <input
                  type="text"
                  value={form.contactTitle}
                  onChange={e => setForm(f => ({ ...f, contactTitle: e.target.value }))}
                  placeholder="Chief Strategy Officer"
                  style={{ width: "100%", padding: "11px 14px", border: `1px solid ${BORDER}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: NAVY }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 6 }}>Primary Domain</label>
                <select
                  value={form.industry}
                  onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", border: `1px solid ${BORDER}`, fontSize: 13, outline: "none", cursor: "pointer", boxSizing: "border-box", color: NAVY, background: "#fff" }}
                >
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 6 }}>Top Strategic Concern (optional)</label>
              <input
                type="text"
                value={form.concern}
                onChange={e => setForm(f => ({ ...f, concern: e.target.value }))}
                placeholder="e.g. Competitor entering our core market next quarter"
                style={{ width: "100%", padding: "11px 14px", border: `1px solid ${BORDER}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: NAVY }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!form.company.trim()}
              style={{ width: "100%", padding: "16px", background: form.company.trim() ? NAVY : "#9CA3AF", color: "#fff", border: "none", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", cursor: form.company.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <Printer size={14} />
              Generate Executive Brief
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: MUTED }}>
            No login required · Print or save as PDF · Ready in seconds
          </p>
        </div>

        <style>{`@media print { body { -webkit-print-color-adjust: exact; } }`}</style>
      </div>
    );
  }

  // Brief view
  return (
    <div style={{ background: OFF, minHeight: "100vh" }}>
      {/* Screen-only toolbar */}
      <div className="no-print" style={{ background: NAVY, padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <button
          onClick={() => setStage("form")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
        >
          <ArrowLeft size={14} /> Edit Details
        </button>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setLocation("/prospect-demo?company=" + encodeURIComponent(form.company) + "&industry=" + encodeURIComponent(form.industry))}
            style={{ padding: "8px 20px", background: "transparent", border: `1px solid rgba(255,255,255,0.2)`, color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" }}
          >
            Run Live Demo
          </button>
          <button
            onClick={() => window.print()}
            style={{ padding: "8px 20px", background: GOLD, color: NAVY, border: "none", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Printer size={13} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Brief document */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 40px", background: "#fff" }} className="brief-doc">

        {/* PAGE 1 HEADER */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingBottom: 24, borderBottom: `2px solid ${NAVY}`, marginBottom: 32 }}>
          <div>
            <VaughnMartinLogo height={64} variant="full" color="dark" />
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Executive Briefing</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>
              {form.contactName ? `Prepared for ${form.contactName}` : `Prepared for ${form.company}`}
            </div>
            {form.contactTitle && <div style={{ fontSize: 12, color: MUTED }}>{form.contactTitle}</div>}
            <div style={{ fontSize: 12, color: MUTED }}>{form.company} · {today}</div>
          </div>
        </div>

        {/* Opening thesis */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>The Question for {form.company}</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.3, margin: "0 0 16px", fontFamily: "'Cormorant Garamond', serif" }}>
            When the next high-stakes situation presents itself — how many days will it take your organization to mobilize?
          </h1>
          {form.concern && (
            <div style={{ padding: "14px 18px", background: OFF, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>Stated concern: </span>
              <span style={{ fontSize: 13, color: NAVY }}>{form.concern}</span>
            </div>
          )}
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>
            enterprise organizations spend an average of <strong>30 days</strong> just to mobilize when a high-stakes situation presents itself — identifying stakeholders, aligning on a response, getting into the room. That coordination delay is not a talent problem. It is a structural problem built into the operating model.
            Readiness OS eliminates it. The decision is the same. The mobilization cycle is pre-staged. Response begins in <strong>12 minutes</strong>.
          </p>
        </div>

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: BORDER, marginBottom: 36, border: `1px solid ${BORDER}` }}>
          {[
            { label: "Execution Head Start", value: "3,600×", sub: "vs. 30-day mobilization" },
            { label: "Time to Live Execution", value: "12 min", sub: "from trigger detection" },
            { label: "Readiness Protocols Armed", value: `${playbookCount}`, sub: `in ${form.industry}` },
            { label: "Triggers Monitored", value: "221", sub: "across 9 domains" },
          ].map(m => (
            <div key={m.label} style={{ background: "#fff", padding: "20px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY, fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: MUTED }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Readiness Protocols for their domain */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 24, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {form.company}'s Domain — {form.industry}
            </span>
          </div>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.6 }}>
            {playbookCount} Readiness Protocols are pre-built and staged in {form.industry}. The following are immediately relevant based on your domain and concern:
          </p>

          {domainPlaybooks.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {domainPlaybooks.map((p: any, i: number) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: i === 0 ? `rgba(201,168,76,0.06)` : OFF, border: `1px solid ${BORDER}`, borderLeft: i === 0 ? `3px solid ${GOLD}` : `3px solid transparent` }}>
                  <div style={{ width: 24, height: 24, background: i === 0 ? "rgba(201,168,76,0.15)" : "rgba(10,15,46,0.06)", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Zap size={12} color={i === 0 ? GOLD : MUTED} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: MUTED, marginLeft: 12 }}>{p.strategicCategory}</span>
                  </div>
                  {i === 0 && <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.08em" }}>Most Relevant</span>}
                  <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase" }}>Ready</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[`${form.industry} Disruption Response`, `Competitor Response — ${form.industry}`, `Regulatory Change — ${form.industry}`, `Crisis Management — ${form.industry}`, `Executive Communication — ${form.industry}`].map((name, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: i === 0 ? `rgba(201,168,76,0.06)` : OFF, border: `1px solid ${BORDER}`, borderLeft: i === 0 ? `3px solid ${GOLD}` : `3px solid transparent` }}>
                  <Zap size={13} color={i === 0 ? GOLD : MUTED} />
                  <span style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 500, color: NAVY, flex: 1 }}>{name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase" }}>Ready</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Triggers being monitored */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>Triggers Monitored — {form.industry}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {triggers.map((t, i) => (
              <div key={i} style={{ padding: "14px 16px", background: OFF, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
                <Activity size={13} color={TEAL} />
                <span style={{ fontSize: 12, fontWeight: 500, color: NAVY, lineHeight: 1.4 }}>{t}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: MUTED, marginTop: 10 }}>
            Monitored every 15 minutes across 25 pre-configured signal sources — news, SEC EDGAR, CISA, FDA, FTC, DOJ, OSHA, EPA, FINRA, Federal Reserve, WHO, State Dept, and more. Alert sent to stakeholders within 12 minutes of threshold crossing.
          </p>
        </div>

        {/* PAGE BREAK */}
        <div style={{ borderBottom: `1px dashed ${BORDER}`, margin: "40px 0", pageBreakAfter: "always" }} className="no-print" />

        {/* ROI section — PAGE 2 */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 24, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>ROI Projection — {form.company}</span>
          </div>

          <div style={{ background: NAVY, padding: "28px 32px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, borderRadius: 0, background: "radial-gradient(circle, rgba(201,168,76,0.12), transparent)", transform: "translate(60px, -60px)" }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.68)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Estimated Annual Value Preserved</div>
            <div style={{ fontSize: 48, fontWeight: 700, color: GOLD, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1, marginBottom: 8 }}>
              ${(annualValue / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              Based on {roi.events} {roi.label}/year · {roi.baseline}-day mobilization baseline · ${roi.rate}/hr executive time
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Per Event Value", value: `$${(perEventValue / 1000).toFixed(0)}K`, icon: BarChart3, sub: `${roi.baseline}-day cycle eliminated` },
              { label: "Executive Hours Saved", value: `${roi.baseline * 5 * roi.events}`, icon: TrendingUp, sub: `per year at ${roi.events} events` },
              { label: "Time to First Value", value: "12 min", icon: Zap, sub: "from first trigger detection" },
            ].map(m => (
              <div key={m.label} style={{ padding: "18px", background: OFF, border: `1px solid ${BORDER}`, textAlign: "center" }}>
                <m.icon size={18} color={GOLD} style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{m.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: "14px 18px", background: OFF, border: `1px solid ${BORDER}`, marginTop: 14, fontSize: 11, color: MUTED, lineHeight: 1.6 }}>
            <strong style={{ color: NAVY }}>Methodology:</strong> Executive time at ${roi.rate}/hr · 5 avg exec-hours/day in mobilization · {roi.baseline}-day mobilization baseline · {roi.events} trigger events/year.
            Conservative estimate. Excludes revenue protected and reputational impact avoided.
          </div>
        </div>

        {/* IDEA Framework */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 24, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>The IDEA Framework™ — How It Works for {form.company}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {IDEA_PHASES.map(p => (
              <div key={p.letter} style={{ padding: "18px 20px", background: OFF, border: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>{p.letter}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.name}</span>
                </div>
                <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Microsoft positioning */}
        <div style={{ marginBottom: 36, padding: "20px 24px", background: "rgba(10,15,46,0.04)", border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Microsoft Ecosystem Fit</div>
          <p style={{ fontSize: 13, color: NAVY, lineHeight: 1.7, margin: 0 }}>
            <strong>{form.company} already owns Microsoft's AI stack.</strong> Azure AI, Copilot Studio, Teams, Entra — the infrastructure investment is made.
            Readiness OS is the operating model layer above it. Not a replacement. An orchestrator that makes the Microsoft investment immediately executable at a strategic level.
          </p>
        </div>

        {/* CTA */}
        <div style={{ background: NAVY, padding: "32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10 }}>Next Step for {form.company}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 12px", fontFamily: "'Cormorant Garamond', serif" }}>
              Request a 2-Week Pilot — $75,000 Flat Fee, Zero Integration Risk
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 20px", lineHeight: 1.6 }}>
              Deployable in 2 weeks. {playbookCount} Readiness Protocols pre-built for {form.industry}. Your triggers armed from day one. No rip-and-replace — sits above your existing Microsoft infrastructure.
            </p>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "10px 24px", background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>vaughnmartin.com/founding-partner-program</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.68)" }}>pilot@vaughnmartin.com</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, marginTop: 24, borderTop: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 11, color: MUTED }}>© {new Date().getFullYear()} VaughnMartin, LLC · Confidential · Prepared exclusively for {form.company}</span>
          <span style={{ fontSize: 11, color: MUTED }}>vaughnmartin.com</span>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .brief-doc { padding: 0 !important; max-width: 100% !important; }
          body { background: #fff !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}
