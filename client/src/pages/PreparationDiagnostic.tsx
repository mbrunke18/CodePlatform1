import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import {
  ArrowRight, ChevronRight, CheckCircle2, AlertTriangle,
  Shield, Zap, TrendingUp, RotateCcw, ExternalLink,
  Building2, Target, Layers, BarChart3, Clock, Users,
} from "lucide-react";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const MUTED   = "#6B7280";
const BORDER  = "#E8E4DC";
const RED     = "#DC2626";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

/* ─── Types ─────────────────────────────────────────────────── */
interface DiagnosticAnswers {
  industry: string;
  size: string;
  triggerCategories: string[];
  priorityDomains: string[];
  urgency: string;
}

interface Protocol {
  id?: number | string;
  playbookNumber?: number;
  name: string;
  description?: string;
  strategicCategory?: string;
  industryVertical?: string;
  severityScore?: number;
  activationFrequencyTier?: string;
  primaryExecutiveRole?: string;
  timeSensitivity?: number;
}

interface ScoredProtocol extends Protocol {
  diagnosticScore: number;
}

/* ─── Constants ─────────────────────────────────────────────── */

const INDUSTRIES = [
  { key: "Technology",          label: "Technology",           icon: Zap },
  { key: "Healthcare",          label: "Healthcare",           icon: Shield },
  { key: "Financial Services",  label: "Financial Services",   icon: BarChart3 },
  { key: "Manufacturing",       label: "Manufacturing",        icon: Building2 },
  { key: "Retail",              label: "Retail / Consumer",    icon: TrendingUp },
  { key: "Energy",              label: "Energy / Utilities",   icon: Target },
  { key: "Government",          label: "Government / Public",  icon: Layers },
  { key: "General",             label: "Other / Cross-sector", icon: Users },
];

const SIZES = [
  { key: "under_500",    label: "Under 500",    sub: "Startup to mid-market" },
  { key: "500_5000",     label: "500 – 5,000",  sub: "Mid-market" },
  { key: "5000_25000",   label: "5,000 – 25,000", sub: "Enterprise" },
  { key: "25000_plus",   label: "25,000+",      sub: "Global enterprise" },
];

const TRIGGER_CATEGORIES = [
  { key: "cyber",        label: "Cybersecurity / Data Breach",      keywords: ["cyber","ransomware","breach","security","data","hack","phishing","incident"] },
  { key: "regulatory",   label: "Regulatory / Compliance",           keywords: ["regulatory","compliance","fda","sec","doj","legal","audit","investigation","enforcement"] },
  { key: "ma",           label: "M&A / Activist Investor",           keywords: ["acquisition","merger","activist","investor","takeover","ipo","deal","loi","shareholder"] },
  { key: "supply_chain", label: "Supply Chain Disruption",           keywords: ["supply chain","supplier","vendor","logistics","procurement","shortag","sourcing"] },
  { key: "competitive",  label: "Market / Competitive Threat",       keywords: ["competitive","competitor","market entry","market share","displacement","pricing","rival"] },
  { key: "workforce",    label: "Workforce / Executive Transition",  keywords: ["workforce","talent","departure","executive","reorg","layoff","culture","succession"] },
  { key: "financial",    label: "Financial / Capital Pressure",      keywords: ["financial","budget","capital","liquidity","credit","cash","covenant","debt"] },
  { key: "reputational", label: "Reputational / Brand Crisis",       keywords: ["reputation","brand","media","crisis","public","recall","pr ","recall","scandal"] },
  { key: "geopolitical", label: "Geopolitical / Trade Risk",         keywords: ["geopolitical","political","tariff","trade","sanctions","international","conflict"] },
];

const DOMAIN_OPTIONS = [
  { key: "offense",       label: "GROWTH & POSITIONING", color: TEAL,    sub: "Market entry, competitive response, M&A, product launch" },
  { key: "defense",       label: "RISK & RESILIENCE",    color: RED,     sub: "Cyber, regulatory, supply chain, financial, reputational" },
  { key: "special_teams", label: "TRANSFORMATION",       color: "#7C3AED", sub: "Workforce, culture, restructuring, go-to-market pivots" },
];

const URGENCY_OPTIONS = [
  { key: "trigger_imminent",  label: "A trigger is likely in the next 90 days" },
  { key: "building_posture",  label: "Building proactive readiness before any trigger fires" },
  { key: "partner_validation",label: "Validating readiness architecture as a Founding Partner" },
  { key: "board_request",     label: "Board or executive mandate to demonstrate readiness" },
];

/* ─── Scoring ───────────────────────────────────────────────── */

function scoreProtocols(playbooks: Protocol[], answers: DiagnosticAnswers): ScoredProtocol[] {
  return playbooks
    .map(p => {
      let score = 0;
      const text = ((p.name || "") + " " + (p.description || "")).toLowerCase();

      // Industry match
      if (p.industryVertical && p.industryVertical.toLowerCase() === answers.industry.toLowerCase()) score += 6;
      if (!p.industryVertical || p.industryVertical.toLowerCase() === "general") score += 2;

      // Domain priority
      if (answers.priorityDomains.includes(p.strategicCategory || "")) score += 4;

      // Trigger category keyword match
      answers.triggerCategories.forEach(catKey => {
        const cat = TRIGGER_CATEGORIES.find(c => c.key === catKey);
        if (!cat) return;
        cat.keywords.forEach(kw => {
          if (text.includes(kw.toLowerCase())) score += 2;
        });
      });

      // Severity boost
      const sev = p.severityScore ?? 0;
      if (sev >= 85) score += 4;
      else if (sev >= 70) score += 2;
      else if (sev >= 55) score += 1;

      // Frequency boost
      if (["High", "Medium"].includes(p.activationFrequencyTier || "")) score += 2;

      return { ...p, diagnosticScore: score } as ScoredProtocol;
    })
    .filter(p => p.diagnosticScore >= 2)
    .sort((a, b) => b.diagnosticScore - a.diagnosticScore)
    .slice(0, 24);
}

/* ─── Step 1: Industry Profile ──────────────────────────────── */

function StepProfile({ answers, onChange }: { answers: DiagnosticAnswers; onChange: (k: keyof DiagnosticAnswers, v: string | string[]) => void }) {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <EyebrowLabel>Step 1 of 3 · Organization Profile</EyebrowLabel>
        <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, margin: "12px 0 12px" }}>
          Tell us about your organization.
        </h2>
        <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>
          The system will match your profile to the most relevant preparation architecture from the 180-protocol library.
        </p>
      </div>

      {/* Industry */}
      <div style={{ marginBottom: 36 }}>
        <FieldLabel>Primary industry</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {INDUSTRIES.map(({ key, label, icon: Icon }) => {
            const selected = answers.industry === key;
            return (
              <button
                key={key}
                onClick={() => onChange("industry", key)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "14px 16px",
                  background: selected ? NAVY : "#fff",
                  border: `2px solid ${selected ? GOLD : BORDER}`,
                  borderRadius: "0.15rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={15} color={selected ? GOLD : MUTED} style={{ flexShrink: 0 }} />
                <span style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: selected ? "#fff" : NAVY }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size */}
      <div>
        <FieldLabel>Organization size</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {SIZES.map(({ key, label, sub }) => {
            const selected = answers.size === key;
            return (
              <button
                key={key}
                onClick={() => onChange("size", key)}
                style={{
                  padding: "16px 18px", textAlign: "left",
                  background: selected ? NAVY : "#fff",
                  border: `2px solid ${selected ? GOLD : BORDER}`,
                  borderRadius: "0.15rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: selected ? GOLD : NAVY, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, color: selected ? "rgba(255,255,255,0.55)" : MUTED }}>{sub}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Risk Exposure ─────────────────────────────────── */

function StepExposure({ answers, onChange }: { answers: DiagnosticAnswers; onChange: (k: keyof DiagnosticAnswers, v: string | string[]) => void }) {
  const toggle = (key: string) => {
    const current = answers.triggerCategories;
    const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
    onChange("triggerCategories", next);
  };

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <EyebrowLabel>Step 2 of 3 · Risk Exposure</EyebrowLabel>
        <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, margin: "12px 0 12px" }}>
          Which situations apply to your organization?
        </h2>
        <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>
          Select every trigger category that has affected your organization in the last 5 years, or that you consider high-priority. Select all that apply.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
        {TRIGGER_CATEGORIES.map(({ key, label }) => {
          const selected = answers.triggerCategories.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "16px 18px", textAlign: "left",
                background: selected ? "rgba(10,15,46,0.04)" : "#fff",
                border: `2px solid ${selected ? TEAL : BORDER}`,
                borderLeft: `4px solid ${selected ? TEAL : BORDER}`,
                borderRadius: "0.15rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 2, flexShrink: 0,
                background: selected ? TEAL : "#fff",
                border: `2px solid ${selected ? TEAL : BORDER}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {selected && <CheckCircle2 size={13} color="#fff" />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{label}</span>
            </button>
          );
        })}
      </div>

      {answers.triggerCategories.length === 0 && (
        <p style={{ marginTop: 16, fontSize: 13, color: MUTED, fontStyle: "italic" }}>
          Select at least one trigger category to continue.
        </p>
      )}
    </div>
  );
}

/* ─── Step 3: Domain Priorities ─────────────────────────────── */

function StepPriorities({ answers, onChange }: { answers: DiagnosticAnswers; onChange: (k: keyof DiagnosticAnswers, v: string | string[]) => void }) {
  const toggleDomain = (key: string) => {
    const current = answers.priorityDomains;
    const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
    onChange("priorityDomains", next);
  };

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <EyebrowLabel>Step 3 of 3 · Strategic Priorities</EyebrowLabel>
        <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, margin: "12px 0 12px" }}>
          Where do you need to be ready first?
        </h2>
        <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>
          Select the strategic domains where preparation is most urgent. The architecture will front-load these in your setup path.
        </p>
      </div>

      {/* Domain cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 40 }}>
        {DOMAIN_OPTIONS.map(({ key, label, color, sub }) => {
          const selected = answers.priorityDomains.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleDomain(key)}
              style={{
                padding: "22px 20px", textAlign: "left",
                background: selected ? NAVY : "#fff",
                border: `2px solid ${selected ? color : BORDER}`,
                borderTop: `4px solid ${selected ? color : BORDER}`,
                borderRadius: "0.15rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: selected ? color : MUTED, marginBottom: 8 }}>
                {label}
              </div>
              <div style={{ fontSize: 13, color: selected ? "rgba(255,255,255,0.65)" : "#374151", lineHeight: 1.6 }}>{sub}</div>
              {selected && (
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={13} color={color} />
                  <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color }}>Priority</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Urgency */}
      <div>
        <FieldLabel>What best describes your situation right now?</FieldLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {URGENCY_OPTIONS.map(({ key, label }) => {
            const selected = answers.urgency === key;
            return (
              <button
                key={key}
                onClick={() => onChange("urgency", key)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 18px", textAlign: "left",
                  background: selected ? IVORY : "#fff",
                  border: `2px solid ${selected ? GOLD : BORDER}`,
                  borderRadius: "0.15rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                  background: selected ? GOLD : "#fff",
                  border: `2px solid ${selected ? GOLD : BORDER}`,
                }} />
                <span style={{ fontSize: 13, fontWeight: selected ? 600 : 400, color: NAVY, lineHeight: 1.4 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Results ───────────────────────────────────────────────── */

function DiagnosticResults({
  recommendations,
  answers,
  onReset,
}: {
  recommendations: ScoredProtocol[];
  answers: DiagnosticAnswers;
  onReset: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"all" | "offense" | "defense" | "special_teams">("all");

  const byDomain = {
    offense:       recommendations.filter(p => p.strategicCategory === "offense"),
    defense:       recommendations.filter(p => p.strategicCategory === "defense"),
    special_teams: recommendations.filter(p => p.strategicCategory === "special_teams"),
  };

  const critical = recommendations.filter(p => (p.severityScore ?? 0) >= 75);
  const displayed = activeTab === "all" ? recommendations : byDomain[activeTab] ?? [];

  const industryLabel = INDUSTRIES.find(i => i.key === answers.industry)?.label ?? answers.industry;
  const triggerLabels = answers.triggerCategories.map(k => TRIGGER_CATEGORIES.find(c => c.key === k)?.label ?? k);

  const domainLabel: Record<string, string> = {
    offense: "GROWTH & POSITIONING",
    defense: "RISK & RESILIENCE",
    special_teams: "TRANSFORMATION",
  };
  const domainColor: Record<string, string> = {
    offense: TEAL,
    defense: RED,
    special_teams: "#7C3AED",
  };

  const setupTime = answers.size === "under_500" ? "21" : answers.size === "500_5000" ? "28" : "35";

  return (
    <div>
      {/* Results Hero */}
      <div style={{ background: NAVY, padding: "56px 48px 48px", marginBottom: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: GOLD }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
              Preparation Architecture · System-Detected
            </span>
          </div>
          <h1 style={{ ...CG, fontSize: "clamp(32px,4vw,50px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
            Your Readiness Architecture<br />
            <em style={{ color: GOLD }}>is ready to configure.</em>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 620, marginBottom: 32 }}>
            Based on your profile — {industryLabel} · {triggerLabels.length} risk exposure{triggerLabels.length !== 1 ? "s" : ""} · {answers.priorityDomains.length} priority domain{answers.priorityDomains.length !== 1 ? "s" : ""} — the system has matched {recommendations.length} protocols from the 180-protocol library. {critical.length > 0 && `${critical.length} are classified as critical preparation gaps.`}
          </p>

          {/* Stat row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 580 }}>
            {[
              { stat: `${recommendations.length}`, label: "Protocols Matched", sub: "from 180-protocol library" },
              { stat: `${critical.length}`, label: "Critical Gaps", sub: "severity score ≥ 75", alert: critical.length > 0 },
              { stat: `~${setupTime} days`, label: "Est. Setup Window", sub: "to full readiness posture" },
            ].map(({ stat, label, sub, alert }) => (
              <div key={label} style={{ borderTop: `3px solid ${alert ? RED : GOLD}`, paddingTop: 12 }}>
                <div style={{ ...CG, fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: alert ? "#FCA5A5" : GOLD, lineHeight: 1 }}>{stat}</div>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "4px 0 2px" }}>{label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical gaps banner */}
      {critical.length > 0 && (
        <div style={{ background: "rgba(220,38,38,0.06)", borderBottom: `1px solid rgba(220,38,38,0.2)`, padding: "18px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 14 }}>
            <AlertTriangle size={18} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: RED }}>
                {critical.length} critical preparation gap{critical.length !== 1 ? "s" : ""} detected.&nbsp;
              </span>
              <span style={{ fontSize: 13, color: "#374151" }}>
                These protocols have a severity score of 75+ and should be configured in Phase 1 of your setup path. Each one represents a situation your organization could face without a pre-staged response.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Protocol list */}
      <div style={{ background: "#fff", padding: "56px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: `1px solid ${BORDER}` }}>
            {[
              { key: "all", label: `All Protocols (${recommendations.length})` },
              { key: "defense", label: `Risk & Resilience (${byDomain.defense.length})` },
              { key: "offense", label: `Growth & Positioning (${byDomain.offense.length})` },
              { key: "special_teams", label: `Transformation (${byDomain.special_teams.length})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                style={{
                  ...BC,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "10px 18px",
                  background: "none", border: "none",
                  borderBottom: `3px solid ${activeTab === key ? GOLD : "transparent"}`,
                  color: activeTab === key ? NAVY : MUTED,
                  cursor: "pointer",
                  marginBottom: -1,
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Protocol cards */}
          {displayed.length === 0 ? (
            <p style={{ fontSize: 14, color: MUTED, fontStyle: "italic" }}>No protocols matched in this domain for your profile.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {displayed.map((p, i) => {
                const isCritical = (p.severityScore ?? 0) >= 75;
                const domain = p.strategicCategory ?? "defense";
                const dColor = domainColor[domain] ?? TEAL;
                const dLabel = domainLabel[domain] ?? domain;
                return (
                  <div
                    key={p.id ?? i}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 20px",
                      background: isCritical ? "rgba(220,38,38,0.03)" : "#FAFAF8",
                      border: `1px solid ${isCritical ? "rgba(220,38,38,0.2)" : BORDER}`,
                      borderLeft: `4px solid ${isCritical ? RED : dColor}`,
                      borderRadius: "0 0.15rem 0.15rem 0",
                    }}
                  >
                    <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: MUTED, minWidth: 28, textAlign: "center" }}>
                      #{p.playbookNumber ?? i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: NAVY, lineHeight: 1.3 }}>{p.name}</span>
                        {isCritical && (
                          <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", background: RED, color: "#fff", padding: "2px 7px", borderRadius: 2 }}>Critical</span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: dColor }}>{dLabel}</span>
                        {p.primaryExecutiveRole && (
                          <span style={{ fontSize: 11, color: MUTED }}>· {p.primaryExecutiveRole}</span>
                        )}
                        {p.timeSensitivity && (
                          <span style={{ fontSize: 11, color: MUTED }}>· {p.timeSensitivity}h window</span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/playbooks/${p.id ?? ""}`}
                      style={{
                        ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                        color: TEAL, textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      View <ExternalLink size={10} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 30-day setup path */}
      <div style={{ background: IVORY, padding: "56px 48px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <EyebrowLabel>Your 30-Day Setup Path</EyebrowLabel>
            <h2 style={{ ...CG, fontSize: "clamp(26px,3vw,38px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, marginTop: 10, marginBottom: 12 }}>
              From first login to live signal detection.
            </h2>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>
              This is the sequenced path for your Preparation Architect. Each phase builds on the last — the goal is a fully staged response architecture before any trigger fires.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                phase: "Phase 1",
                timing: "Week 1",
                title: "Foundation — Critical Gaps First",
                tasks: [
                  `Configure your ${critical.length > 0 ? critical.length : "top"} critical protocols — severity-scored 75+ — with full stakeholder mapping`,
                  "Map C-suite authorization chains for each domain",
                  "Set pre-approved budget thresholds for emergency response",
                ],
                color: RED,
              },
              {
                phase: "Phase 2",
                timing: "Week 1–2",
                title: "Domain Build-Out",
                tasks: [
                  `Stage remaining ${Math.max(0, recommendations.length - (critical.length || 5))} matched protocols across your ${answers.priorityDomains.length} priority domain${answers.priorityDomains.length !== 1 ? "s" : ""}`,
                  "Assign named execution owners to each protocol",
                  "Connect your communication stack for stakeholder notification",
                ],
                color: GOLD,
              },
              {
                phase: "Phase 3",
                timing: "Week 2–3",
                title: "First Drill — Governance Validated",
                tasks: [
                  "Select one high-priority protocol for your first practice drill",
                  "Simulate the trigger — walk through authorization flow end-to-end",
                  "Complete the post-drill debrief and accept the ADVANCE loop improvement",
                ],
                color: TEAL,
              },
              {
                phase: "Phase 4",
                timing: `Week 3–${answers.size === "under_500" ? "3" : answers.size === "500_5000" ? "4" : "5"}`,
                title: "Live Signal Detection — Go Live",
                tasks: [
                  "Activate live monitoring across all 231 trigger categories",
                  "Review Readiness Score — resolve any protocols below threshold",
                  "Brief your C-suite on authorization flow and mobile access",
                ],
                color: NAVY_BG,
              },
            ].map((phase, i, arr) => (
              <div key={phase.phase} style={{ display: "flex", gap: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 44, flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, background: phase.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: "#fff" }}>{i + 1}</span>
                  </div>
                  {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: BORDER, minHeight: 24, marginTop: 4 }} />}
                </div>
                <div style={{ flex: 1, paddingLeft: 20, paddingBottom: i < arr.length - 1 ? 32 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, marginBottom: 4 }}>
                    <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD }}>{phase.phase}</span>
                    <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>{phase.timing}</span>
                  </div>
                  <h3 style={{ ...CG, fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 12, lineHeight: 1.2 }}>{phase.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {phase.tasks.map((task, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", background: "#fff", border: `1px solid ${BORDER}` }}>
                        <CheckCircle2 size={13} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ background: NAVY, padding: "56px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ width: 40, height: 1, background: GOLD, margin: "0 auto 16px" }} />
          <h2 style={{ ...CG, fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 14 }}>
            The architecture is mapped.<br />
            <em style={{ color: GOLD }}>Now stage it before the trigger fires.</em>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>
            Your Preparation Architect has a clear path. Begin configuration now — or open the full protocol library to explore the matched protocols in detail.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            <Link
              href="/getting-started"
              style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", textDecoration: "none", borderRadius: "0.15rem" }}
            >
              Begin Configuration <ArrowRight size={14} />
            </Link>
            <Link
              href="/playbook-library"
              style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "0.15rem" }}
            >
              Open Protocol Library <ChevronRight size={14} />
            </Link>
          </div>
          <button
            onClick={onReset}
            style={{ ...BC, background: "none", border: "none", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <RotateCcw size={11} /> Run diagnostic again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Small shared sub-components ───────────────────────────── */

function EyebrowLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 24, height: 1, background: GOLD }} />
      <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD }}>{children}</span>
    </div>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>{children}</div>
  );
}

/* ─── Progress bar ───────────────────────────────────────────── */

function ProgressBar({ step }: { step: number }) {
  const labels = ["Organization Profile", "Risk Exposure", "Strategic Priorities"];
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 48 }}>
      {labels.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} style={{ flex: 1, paddingRight: i < labels.length - 1 ? 8 : 0 }}>
            <div style={{ height: 3, background: done || active ? GOLD : BORDER, marginBottom: 8, borderRadius: 1 }} />
            <div style={{ ...BC, fontSize: 10, fontWeight: done || active ? 700 : 400, letterSpacing: "0.12em", textTransform: "uppercase", color: done || active ? NAVY : MUTED }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */

const BLANK: DiagnosticAnswers = {
  industry: "",
  size: "",
  triggerCategories: [],
  priorityDomains: [],
  urgency: "",
};

export default function PreparationDiagnostic() {
  const [step, setStep] = useState(0); // 0,1,2 = wizard steps; 3 = results
  const [answers, setAnswers] = useState<DiagnosticAnswers>({ ...BLANK });

  const { data: libraryData, isLoading } = useQuery<{ playbooks: Protocol[] }>({
    queryKey: ["/api/playbook-library"],
  });

  const recommendations = useMemo(() => {
    if (step < 3 || !libraryData?.playbooks) return [];
    return scoreProtocols(libraryData.playbooks, answers);
  }, [step, libraryData, answers]);

  const onChange = (key: keyof DiagnosticAnswers, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const canAdvance = [
    answers.industry !== "" && answers.size !== "",
    answers.triggerCategories.length > 0,
    answers.priorityDomains.length > 0,
  ][step] ?? false;

  const handleNext = () => {
    if (step < 2) setStep(s => s + 1);
    else setStep(3);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({ ...BLANK });
  };

  if (step === 3) {
    return (
      <PageLayout>
        <div style={{ background: "#fff", fontFamily: "'Barlow', sans-serif" }}>
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
              <div>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 12, textAlign: "center" }}>
                  Analyzing protocol library…
                </div>
                <div style={{ width: 240, height: 3, background: BORDER, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: GOLD, width: "60%", animation: "pulse 1.5s ease-in-out infinite" }} />
                </div>
              </div>
            </div>
          ) : (
            <DiagnosticResults
              recommendations={recommendations}
              answers={answers}
              onReset={handleReset}
            />
          )}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={{ background: "#fff", fontFamily: "'Barlow', sans-serif" }}>

        {/* Hero bar */}
        <div style={{ background: NAVY, padding: "48px 48px 40px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 24, height: 1, background: GOLD }} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
                Preparation Architecture Diagnostic
              </span>
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>
              Map your readiness architecture<br />
              <em style={{ color: GOLD }}>before the trigger fires.</em>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 620, lineHeight: 1.7 }}>
              3 questions. The system matches your organization's profile against 180 Readiness Protocols and returns a prioritized setup architecture for your Preparation Architect to configure.
            </p>
          </div>
        </div>

        {/* Wizard body */}
        <div style={{ padding: "56px 48px", maxWidth: 900, margin: "0 auto" }}>
          <ProgressBar step={step} />

          {step === 0 && <StepProfile answers={answers} onChange={onChange} />}
          {step === 1 && <StepExposure answers={answers} onChange={onChange} />}
          {step === 2 && <StepPriorities answers={answers} onChange={onChange} />}

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 48, paddingTop: 32, borderTop: `1px solid ${BORDER}` }}>
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              style={{
                ...BC, background: "none", border: `1px solid ${BORDER}`,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                color: step === 0 ? BORDER : MUTED,
                padding: "11px 22px", borderRadius: "0.15rem", cursor: step === 0 ? "default" : "pointer",
              }}
              disabled={step === 0}
            >
              Back
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {!canAdvance && (
                <span style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>
                  {step === 0 ? "Select an industry and size to continue" :
                   step === 1 ? "Select at least one risk category" :
                   "Select at least one priority domain"}
                </span>
              )}
              <button
                onClick={handleNext}
                disabled={!canAdvance}
                style={{
                  ...BC,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: canAdvance ? NAVY : BORDER,
                  color: canAdvance ? "#fff" : MUTED,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  padding: "13px 28px", borderRadius: "0.15rem", border: "none",
                  cursor: canAdvance ? "pointer" : "default",
                  transition: "background 0.15s",
                }}
              >
                {step === 2 ? "Generate Architecture" : "Continue"}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom context */}
        <div style={{ background: IVORY, borderTop: `1px solid ${BORDER}`, padding: "20px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={12} color={MUTED} />
              <span style={{ fontSize: 12, color: MUTED }}>Takes ~2 minutes</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={12} color={MUTED} />
              <span style={{ fontSize: 12, color: MUTED }}>Pattern-matched against 180 protocols</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Target size={12} color={MUTED} />
              <span style={{ fontSize: 12, color: MUTED }}>No data stored — results generated in-session</span>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
