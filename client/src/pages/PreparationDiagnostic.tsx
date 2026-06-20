import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle,
  Shield, Zap, TrendingUp, Building2, Target, Layers, BarChart3,
  Users, Plus, X, Edit3, Lock, Radio, Rocket, RotateCcw,
  ExternalLink, Settings, MapPin, LayoutGrid, List, RotateCw,
} from "lucide-react";

/* ─── Style tokens ───────────────────────────────────────────── */
const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const MUTED   = "#6B7280";
const BORDER  = "#E8E4DC";
const RED     = "#DC2626";
const BLUE    = "#1E3A5F";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

/* ─── Types ─────────────────────────────────────────────────── */
type StudioMode = "landing" | "setup" | "customize";
type ViewMode   = "architecture" | "list";

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
interface ScoredProtocol extends Protocol { diagnosticScore: number; }

interface ProtocolCustomization {
  customName?: string;
  customDescription?: string;
  customTrigger?: string;
  executionOwner?: string;
}

interface DraftState {
  mode: StudioMode;
  step: number;
  industry: string;
  size: string;
  triggerCategories: string[];
  customTriggers: string[];
  priorityDomains: string[];
  urgency: string;
  selectedProtocols: (string | number)[];
  customizations: Record<string, ProtocolCustomization>;
  orgName: string;
  execSponsor: string;
  execRole: string;
  pmoLead: string;
  domainOwners: { domain: string; owner: string; role: string; email: string; mobile: string }[];
  isDemoMode: boolean;
}

/* ─── Draft persistence ──────────────────────────────────────── */
const DRAFT_KEY = "vm_studio_draft";
function saveDraft(data: DraftState) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch {}
}
function loadDraft(): DraftState | null {
  try {
    const d = localStorage.getItem(DRAFT_KEY);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}
function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

/* ─── Demo presets ───────────────────────────────────────────── */
const DEMO_PRESETS: Record<string, { triggers: string[]; domains: string[]; size: string; urgency: string }> = {
  "Financial Services": {
    triggers: ["cyber", "regulatory", "ma", "financial"],
    domains:  ["defense", "offense"],
    size:     "5000_25000",
    urgency:  "trigger_imminent",
  },
  "Healthcare": {
    triggers: ["regulatory", "cyber", "supply_chain", "reputational"],
    domains:  ["defense", "special_teams"],
    size:     "5000_25000",
    urgency:  "building_posture",
  },
  "Technology": {
    triggers: ["competitive", "cyber", "workforce", "ma"],
    domains:  ["offense", "defense"],
    size:     "500_5000",
    urgency:  "trigger_imminent",
  },
  "Manufacturing": {
    triggers: ["supply_chain", "regulatory", "workforce", "financial"],
    domains:  ["defense", "special_teams"],
    size:     "5000_25000",
    urgency:  "building_posture",
  },
  "Energy": {
    triggers: ["geopolitical", "regulatory", "cyber", "supply_chain"],
    domains:  ["defense"],
    size:     "25000_plus",
    urgency:  "board_request",
  },
};

/* ─── Data constants ─────────────────────────────────────────── */
const INDUSTRIES = [
  { key: "Technology",         label: "Technology",           icon: Zap },
  { key: "Healthcare",         label: "Healthcare",           icon: Shield },
  { key: "Financial Services", label: "Financial Services",   icon: BarChart3 },
  { key: "Manufacturing",      label: "Manufacturing",        icon: Building2 },
  { key: "Retail",             label: "Retail / Consumer",    icon: TrendingUp },
  { key: "Energy",             label: "Energy / Utilities",   icon: Target },
  { key: "Government",         label: "Government / Public",  icon: Layers },
  { key: "General",            label: "Other / Cross-sector", icon: Users },
];

const SIZES = [
  { key: "under_500",  label: "Under 500",     sub: "Startup to mid-market" },
  { key: "500_5000",   label: "500 – 5,000",   sub: "Mid-market" },
  { key: "5000_25000", label: "5,000 – 25,000", sub: "Enterprise" },
  { key: "25000_plus", label: "25,000+",        sub: "Global enterprise" },
];

const TRIGGER_CATEGORIES = [
  { key: "cyber",        label: "Cybersecurity / Data Breach",     keywords: ["cyber","ransomware","breach","security","data","hack","phishing","incident"] },
  { key: "regulatory",   label: "Regulatory / Compliance",          keywords: ["regulatory","compliance","fda","sec","doj","legal","audit","investigation","enforcement"] },
  { key: "ma",           label: "M&A / Activist Investor",          keywords: ["acquisition","merger","activist","investor","takeover","ipo","deal","loi","shareholder"] },
  { key: "supply_chain", label: "Supply Chain Disruption",          keywords: ["supply chain","supplier","vendor","logistics","procurement","shortag","sourcing"] },
  { key: "competitive",  label: "Market / Competitive Threat",      keywords: ["competitive","competitor","market entry","market share","displacement","pricing","rival"] },
  { key: "workforce",    label: "Workforce / Executive Transition", keywords: ["workforce","talent","departure","executive","reorg","layoff","culture","succession"] },
  { key: "financial",    label: "Financial / Capital Pressure",     keywords: ["financial","budget","capital","liquidity","credit","cash","covenant","debt"] },
  { key: "reputational", label: "Reputational / Brand Crisis",      keywords: ["reputation","brand","media","crisis","public","recall","pr ","scandal"] },
  { key: "geopolitical", label: "Geopolitical / Trade Risk",        keywords: ["geopolitical","political","tariff","trade","sanctions","international","conflict"] },
];

const DOMAIN_OPTIONS = [
  { key: "offense",       label: "GROWTH & POSITIONING", color: TEAL, sub: "Market entry, competitive response, M&A, product launch" },
  { key: "defense",       label: "RISK & RESILIENCE",    color: RED,  sub: "Cyber, regulatory, supply chain, financial, reputational" },
  { key: "special_teams", label: "TRANSFORMATION",       color: BLUE, sub: "Workforce, culture, restructuring, go-to-market pivots" },
];

const URGENCY_OPTIONS = [
  { key: "trigger_imminent",   label: "A trigger is likely in the next 90 days" },
  { key: "building_posture",   label: "Building proactive readiness before any trigger fires" },
  { key: "partner_validation", label: "Validating readiness architecture as a Founding Partner" },
  { key: "board_request",      label: "Board or executive mandate to demonstrate readiness" },
];

const AUTH_SLOTS = [
  { domain: "Financial Response",      placeholder: "e.g. CFO, VP Finance" },
  { domain: "Risk & Compliance",       placeholder: "e.g. General Counsel, CCO" },
  { domain: "Crisis & Communications", placeholder: "e.g. COO, VP Communications" },
];

const SIZE_INT: Record<string, number> = {
  under_500: 250, "500_5000": 2500, "5000_25000": 15000, "25000_plus": 50000,
};

/* ─── Scoring ───────────────────────────────────────────────── */
function scoreProtocols(
  playbooks: Protocol[],
  args: { industry: string; triggerCategories: string[]; priorityDomains: string[] },
): ScoredProtocol[] {
  return playbooks
    .map(p => {
      let score = 0;
      const text = ((p.name || "") + " " + (p.description || "")).toLowerCase();
      if (p.industryVertical && p.industryVertical.toLowerCase() === args.industry.toLowerCase()) score += 6;
      if (!p.industryVertical || p.industryVertical.toLowerCase() === "general") score += 2;
      if (args.priorityDomains.includes(p.strategicCategory || "")) score += 4;
      args.triggerCategories.forEach(catKey => {
        const cat = TRIGGER_CATEGORIES.find(c => c.key === catKey);
        if (!cat) return;
        cat.keywords.forEach(kw => { if (text.includes(kw)) score += 2; });
      });
      const sev = p.severityScore ?? 0;
      if (sev >= 85) score += 4;
      else if (sev >= 70) score += 2;
      else if (sev >= 55) score += 1;
      if (["High", "Medium"].includes(p.activationFrequencyTier || "")) score += 2;
      return { ...p, diagnosticScore: score } as ScoredProtocol;
    })
    .filter(p => p.diagnosticScore >= 2)
    .sort((a, b) => b.diagnosticScore - a.diagnosticScore)
    .slice(0, 30);
}

/* ─── Readiness score ────────────────────────────────────────── */
function computeReadinessScore(selected: Set<string | number>, scored: ScoredProtocol[]): number {
  if (scored.length === 0 || selected.size === 0) return 0;
  const critical = scored.filter(p => (p.severityScore ?? 0) >= 75);
  const critSel  = critical.filter(p => selected.has(p.id ?? p.name)).length;
  const regSel   = scored.filter(p => (p.severityScore ?? 0) < 75 && selected.has(p.id ?? p.name)).length;
  const totalPossible = critical.length * 2 + (scored.length - critical.length);
  if (totalPossible === 0) return 0;
  return Math.min(95, Math.round((critSel * 2 + regSel) / totalPossible * 100));
}

/* ─── Shared sub-components ──────────────────────────────────── */
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

/* ─── Architecture View ──────────────────────────────────────── */
function ArchitectureView({
  scored, byDomain, domainLabel, domainColor,
  selectedProtocols, toggleProtocol, customizations, readinessScore,
}: {
  scored: ScoredProtocol[];
  byDomain: Record<string, ScoredProtocol[]>;
  domainLabel: Record<string, string>;
  domainColor: Record<string, string>;
  selectedProtocols: Set<string | number>;
  toggleProtocol: (id: string | number) => void;
  customizations: Record<string, ProtocolCustomization>;
  readinessScore: number;
}) {
  const domains = ["defense", "offense", "special_teams"];
  const criticalCount = scored.filter(p => (p.severityScore ?? 0) >= 75).length;
  const scoreColor = readinessScore > 60 ? TEAL : readinessScore > 30 ? GOLD : "#FCA5A5";

  return (
    <div>
      {/* Architecture Score Bar */}
      <div style={{ background: NAVY, padding: "22px 28px", marginBottom: 20, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
        {/* Score */}
        <div style={{ flex: "none" }}>
          <div style={{ ...CG, fontSize: 52, fontWeight: 700, color: readinessScore === 0 ? "rgba(255,255,255,0.25)" : scoreColor, lineHeight: 1 }}>
            {readinessScore === 0 ? "—" : `${readinessScore}%`}
          </div>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            Architecture Coverage
          </div>
        </div>

        <div style={{ width: 1, height: 52, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

        {/* Stats */}
        {[
          { v: scored.length,         l: "Protocols Matched",  alert: false },
          { v: criticalCount,         l: "Critical Gaps",      alert: criticalCount > 0 },
          { v: selectedProtocols.size, l: "Configured",         alert: false },
        ].map(({ v, l, alert }) => (
          <div key={l}>
            <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: alert ? "#FCA5A5" : GOLD, lineHeight: 1 }}>{v}</div>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{l}</div>
          </div>
        ))}

        <div style={{ flex: 1 }} />

        {/* Progress guidance */}
        <div style={{ textAlign: "right" }}>
          {readinessScore === 0 ? (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
              Select protocols below<br />to configure your architecture
            </div>
          ) : readinessScore < 87 ? (
            <div style={{ fontSize: 12, color: TEAL, lineHeight: 1.5 }}>
              <strong style={{ color: GOLD }}>{87 - readinessScore}%</strong> remaining to reach target coverage<br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>Target: 87% architecture coverage</span>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: TEAL }}>
              <CheckCircle2 size={12} style={{ display: "inline", marginRight: 4 }} />
              Target coverage reached
            </div>
          )}
        </div>
      </div>

      {/* 3-column domain layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {domains.map(domain => {
          const protocols = byDomain[domain] ?? [];
          const selInDomain = protocols.filter(p => selectedProtocols.has(p.id ?? p.name));
          const critInDomain = protocols.filter(p => (p.severityScore ?? 0) >= 75);
          const color = domainColor[domain];
          const label = domainLabel[domain];
          const coverage = protocols.length > 0 ? Math.round(selInDomain.length / protocols.length * 100) : 0;

          return (
            <div key={domain} style={{ border: `1px solid ${BORDER}`, borderTop: `4px solid ${color}`, background: "#fff" }}>
              {/* Domain header */}
              <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${BORDER}`, background: "#FAFAF8" }}>
                <div style={{ ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color, marginBottom: 6 }}>{label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                  <span style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY }}>{selInDomain.length}</span>
                  <span style={{ fontSize: 11, color: MUTED }}>of {protocols.length} configured</span>
                  {critInDomain.length > 0 && (
                    <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: RED, marginLeft: 4 }}>
                      {critInDomain.length} critical
                    </span>
                  )}
                </div>
                {/* Coverage bar */}
                <div style={{ height: 3, background: BORDER, borderRadius: 2 }}>
                  <div style={{ height: "100%", background: color, width: `${coverage}%`, borderRadius: 2, transition: "width 0.4s ease" }} />
                </div>
              </div>

              {/* Protocol rows */}
              <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 3, minHeight: 160 }}>
                {protocols.length === 0 ? (
                  <div style={{ padding: "24px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>No protocols matched</div>
                    <a href="/protocol-builder" style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, textDecoration: "none" }}>
                      Build custom protocol →
                    </a>
                  </div>
                ) : (
                  protocols.slice(0, 7).map(p => {
                    const pid  = String(p.id ?? p.name);
                    const sel  = selectedProtocols.has(p.id ?? p.name);
                    const crit = (p.severityScore ?? 0) >= 75;
                    const custom = customizations[pid] ?? {};

                    return (
                      <button
                        key={pid}
                        onClick={() => toggleProtocol(p.id ?? p.name)}
                        style={{
                          display: "flex", alignItems: "center", gap: 8, padding: "7px 8px",
                          background: sel ? `rgba(${domain === "defense" ? "220,38,38" : domain === "offense" ? "43,138,110" : "30,58,95"},0.06)` : "#fff",
                          border: `1px solid ${sel ? color : BORDER}`,
                          borderLeft: `3px solid ${sel ? color : crit ? RED : "transparent"}`,
                          cursor: "pointer", textAlign: "left", borderRadius: "0.15rem",
                          transition: "all 0.15s",
                        }}
                      >
                        <div style={{
                          width: 15, height: 15, borderRadius: 2, flexShrink: 0,
                          background: sel ? color : "#fff", border: `2px solid ${sel ? color : BORDER}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {sel && <CheckCircle2 size={9} color="#fff" />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: sel ? 600 : 400, color: NAVY, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {custom.customName || p.name}
                          </div>
                          {crit && (
                            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: RED, lineHeight: 1 }}>Critical</div>
                          )}
                        </div>
                        {p.timeSensitivity && (
                          <span style={{ ...BC, fontSize: 8, fontWeight: 600, color: MUTED, flexShrink: 0 }}>{p.timeSensitivity}h</span>
                        )}
                      </button>
                    );
                  })
                )}
                {protocols.length > 7 && (
                  <div style={{ padding: "5px 8px", fontSize: 10, color: MUTED, textAlign: "center", fontStyle: "italic" }}>
                    +{protocols.length - 7} more — switch to List View
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedProtocols.size > 0 && (
        <div style={{ margin: "16px 0 0", padding: "12px 18px", background: "rgba(43,138,110,0.06)", border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle2 size={14} color={TEAL} />
          <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>
            {selectedProtocols.size} protocol{selectedProtocols.size !== 1 ? "s" : ""} configured across{" "}
            {domains.filter(d => (byDomain[d] ?? []).some(p => selectedProtocols.has(p.id ?? p.name))).length} domains — use List View to customize names, owners, and trigger conditions
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Studio Landing ─────────────────────────────────────────── */
function StudioLanding({
  onMode, onDemo, draft, onResume, onClearDraft,
}: {
  onMode: (m: StudioMode) => void;
  onDemo: (industry: string) => void;
  draft: DraftState | null;
  onResume: () => void;
  onClearDraft: () => void;
}) {
  const [, nav] = useLocation();
  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: "72px 48px 56px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <EyebrowLabel>Readiness Architecture Studio</EyebrowLabel>
          <h1 style={{ ...CG, fontSize: "clamp(36px,5vw,58px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, margin: "16px 0 18px" }}>
            Configure. Build. Customize.<br />
            <em style={{ color: GOLD }}>Every response ready before the trigger fires.</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 580 }}>
            A single studio to map your readiness architecture, build custom protocols, define your own triggers, and configure your full authorization chain — end to end.
          </p>
        </div>
      </div>

      {/* Resume banner */}
      {draft && draft.mode !== "landing" && (
        <div style={{ background: "rgba(201,168,76,0.08)", borderBottom: `1px solid rgba(201,168,76,0.25)`, padding: "14px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
            <RotateCw size={14} color={GOLD} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>You have an in-progress setup. </span>
              <span style={{ fontSize: 13, color: MUTED }}>
                {draft.industry && `${draft.industry} · `}Step {draft.step + 1} of {draft.mode === "customize" ? 4 : 6}
              </span>
            </div>
            <button
              onClick={onResume}
              style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "7px 16px", background: GOLD, color: NAVY, border: "none", cursor: "pointer", borderRadius: "0.15rem" }}
            >
              Resume
            </button>
            <button
              onClick={onClearDraft}
              style={{ ...BC, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 14px", background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, cursor: "pointer", borderRadius: "0.15rem" }}
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Mode cards */}
      <div style={{ background: "#fff", padding: "56px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <EyebrowLabel>Choose Your Path</EyebrowLabel>
            <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, color: NAVY, marginTop: 10, marginBottom: 8 }}>
              What do you want to do today?
            </h2>
            <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>
              The studio works for new setup, demo presentations, protocol customization, and trigger configuration.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 48 }}>
            {/* Mode 1: Full Setup */}
            <div style={{ border: `2px solid ${GOLD}`, borderTop: `4px solid ${GOLD}`, padding: "28px 24px", background: "#FEFDF9" }}>
              <div style={{ width: 40, height: 40, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Rocket size={18} color={GOLD} />
              </div>
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Full Setup</div>
              <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 10 }}>Map & Configure Your Architecture</div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>
                Profile your organization, get matched protocols, customize them, configure your authorization chain, and activate your live platform — end to end.
              </p>
              <div style={{ marginBottom: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {["6-step guided setup", "Protocol matching from 180-protocol library", "Authorization chain configuration", "Live platform activation"].map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <CheckCircle2 size={12} color={TEAL} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#374151" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onMode("setup")}
                style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: NAVY, color: "#fff", border: "none", cursor: "pointer", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "0.15rem" }}
              >
                Configure Architecture <ArrowRight size={13} />
              </button>
            </div>

            {/* Mode 2: Build Protocol */}
            <div style={{ border: `2px solid ${BORDER}`, borderTop: `4px solid ${TEAL}`, padding: "28px 24px", background: "#fff" }}>
              <div style={{ width: 40, height: 40, background: `rgba(43,138,110,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Plus size={18} color={TEAL} />
              </div>
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: TEAL, marginBottom: 8 }}>Protocol Studio</div>
              <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 10 }}>Build a Custom Protocol</div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>
                Design a protocol from scratch for your organization's unique scenarios. Define tasks, triggers, stakeholders, and response timelines — then add it to your library.
              </p>
              <div style={{ marginBottom: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {["Custom trigger conditions", "Task sequencing with owners", "Stakeholder notification chain", "Severity and timeline configuration"].map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <CheckCircle2 size={12} color={TEAL} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#374151" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => nav("/protocol-builder")}
                style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: TEAL, color: "#fff", border: "none", cursor: "pointer", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "0.15rem" }}
              >
                Open Protocol Builder <ExternalLink size={13} />
              </button>
            </div>

            {/* Mode 3: Customize Library */}
            <div style={{ border: `2px solid ${BORDER}`, borderTop: `4px solid ${NAVY_BG}`, padding: "28px 24px", background: "#fff" }}>
              <div style={{ width: 40, height: 40, background: `rgba(10,15,46,0.06)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Settings size={18} color={NAVY} />
              </div>
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: NAVY, marginBottom: 8 }}>Customization</div>
              <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 10 }}>Customize Existing Protocols</div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>
                Profile your organization, see matched protocols from the 180-protocol library, and adapt them — custom names, descriptions, trigger conditions, and execution owners.
              </p>
              <div style={{ marginBottom: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {["Organization-specific protocol names", "Custom trigger definitions", "Execution owner assignment", "Custom response conditions"].map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <CheckCircle2 size={12} color={TEAL} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#374151" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onMode("customize")}
                style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "transparent", color: NAVY, border: `2px solid ${NAVY}`, cursor: "pointer", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "0.15rem" }}
              >
                Customize Protocols <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Demo quick-start */}
          <div style={{ background: IVORY, border: `1px solid ${BORDER}`, padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <Radio size={16} color={TEAL} />
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>Demo Quick-Start</div>
            </div>
            <p style={{ fontSize: 13, color: NAVY, fontWeight: 600, marginBottom: 4 }}>
              Running a demo? Select an industry to see a live readiness architecture instantly — no setup steps.
            </p>
            <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, lineHeight: 1.5 }}>
              Pre-fills a realistic trigger profile and jumps directly to the visual architecture view. The matched protocols appear in under 10 seconds.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.keys(DEMO_PRESETS).map(ind => (
                <button
                  key={ind}
                  onClick={() => onDemo(ind)}
                  style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 16px", background: NAVY, border: `1px solid ${NAVY}`, color: "#fff", cursor: "pointer", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 6 }}
                >
                  {ind} <ArrowRight size={11} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

/* ─── Complete screen ─────────────────────────────────────────── */
function CompleteScreen({
  mode, orgName, execSponsor, selectedCount, customizationCount, customTriggerCount, stakeholderCount,
  onReset,
}: {
  mode: StudioMode; orgName: string; execSponsor: string;
  selectedCount: number; customizationCount: number; customTriggerCount: number;
  stakeholderCount: number;
  onReset: () => void;
}) {
  const [, nav] = useLocation();
  const isSetup = mode === "setup";
  return (
    <PageLayout>
      <div style={{ background: NAVY, minHeight: "60vh", padding: "80px 48px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 700, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, background: TEAL, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle2 size={28} color="#fff" />
          </div>
          <EyebrowLabel>{isSetup ? "Architecture Activated" : "Customizations Saved"}</EyebrowLabel>
          <h1 style={{ ...CG, fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "16px 0 18px" }}>
            {isSetup ? (
              <>Your Architecture Is Live.<br /><em style={{ color: GOLD }}>The response is ready before the trigger fires.</em></>
            ) : (
              <>Protocol Library Updated.<br /><em style={{ color: GOLD }}>Your customizations are staged and ready.</em></>
            )}
          </h1>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isSetup && stakeholderCount > 0 ? 4 : 3}, 1fr)`, gap: 16, margin: "36px 0 40px" }}>
            {[
              { stat: String(selectedCount),      label: "Protocols Staged",   sub: "matched and configured" },
              { stat: String(customizationCount), label: "Customized",          sub: "tailored to your org" },
              { stat: customTriggerCount > 0 ? String(customTriggerCount) : "231", label: customTriggerCount > 0 ? "Custom Triggers" : "Triggers Monitored", sub: customTriggerCount > 0 ? "organization-specific" : "continuously" },
              ...(isSetup && stakeholderCount > 0 ? [{ stat: String(stakeholderCount), label: "Contacts Created", sub: "ready for notifications" }] : []),
            ].map(({ stat, label, sub }) => (
              <div key={label} style={{ borderTop: `3px solid ${GOLD}`, paddingTop: 14, textAlign: "left" }}>
                <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{stat}</div>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", margin: "4px 0 2px" }}>{label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{sub}</div>
              </div>
            ))}
          </div>

          {execSponsor && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", marginBottom: 32 }}>
              <CheckCircle2 size={12} color={TEAL} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>Executive Sponsor: {execSponsor}{orgName ? ` · ${orgName}` : ""}</span>
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {isSetup && (
              <button onClick={() => nav("/command-tower")} style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", border: "none", cursor: "pointer", borderRadius: "0.15rem" }}>
                Enter Command Tower <ArrowRight size={14} />
              </button>
            )}
            <button onClick={() => nav("/playbook-library")} style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", borderRadius: "0.15rem" }}>
              View Protocol Library <ChevronRight size={14} />
            </button>
            {isSetup && (
              <button onClick={() => nav("/practice-drills")} style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", borderRadius: "0.15rem" }}>
                Run First Drill <ChevronRight size={14} />
              </button>
            )}
          </div>
          <button
            onClick={onReset}
            style={{ ...BC, background: "none", border: "none", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", cursor: "pointer", marginTop: 28, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <RotateCcw size={11} /> Return to Studio
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function PreparationDiagnostic() {
  const { toast } = useToast();
  const [, nav] = useLocation();

  /* ── Mode / step ── */
  const [mode, setMode]         = useState<StudioMode>("landing");
  const [step, setStep]         = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [protocolViewMode, setProtocolViewMode] = useState<ViewMode>("architecture");

  /* ── Step 0: Profile ── */
  const [industry, setIndustry] = useState("");
  const [size, setSize]         = useState("");

  /* ── Step 1: Risk + Custom Triggers ── */
  const [triggerCategories, setTriggerCategories] = useState<string[]>([]);
  const [customTriggers, setCustomTriggers]       = useState<string[]>([]);
  const [customTriggerInput, setCustomTriggerInput] = useState("");

  /* ── Step 2: Priorities ── */
  const [priorityDomains, setPriorityDomains] = useState<string[]>([]);
  const [urgency, setUrgency]                 = useState("");

  /* ── Step 3: Protocol Selection + Customization ── */
  const [selectedProtocols, setSelectedProtocols] = useState<Set<string | number>>(new Set());
  const [customizations, setCustomizations]       = useState<Record<string, ProtocolCustomization>>({});
  const [expandedProtocol, setExpandedProtocol]   = useState<string | null>(null);
  const [protocolTab, setProtocolTab]             = useState<"all" | "defense" | "offense" | "special_teams">("all");

  /* ── Step 4: Auth Chain + Org ── */
  const [orgName, setOrgName]         = useState("");
  const [execSponsor, setExecSponsor] = useState("");
  const [execRole, setExecRole]       = useState("");
  const [pmoLead, setPmoLead]         = useState("");
  const [domainOwners, setDomainOwners] = useState(
    AUTH_SLOTS.map(s => ({ domain: s.domain, owner: "", role: "", email: "", mobile: "" }))
  );
  const [stakeholderCount, setStakeholderCount] = useState(0);

  /* ── Draft ── */
  const [draft, setDraft] = useState<DraftState | null>(() => loadDraft());

  /* ── Data ── */
  const { data: rawPlaybooks = [] } = useQuery<Protocol[]>({ queryKey: ["/api/playbook-library"] });
  const { data: user }              = useQuery<any>({ queryKey: ["/api/auth/user"] });
  const isAuthenticated             = !!user?.id;

  const scored = useMemo(() => {
    const safe = Array.isArray(rawPlaybooks) ? rawPlaybooks : [];
    return scoreProtocols(safe as Protocol[], { industry, triggerCategories, priorityDomains });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawPlaybooks, industry, triggerCategories.join(","), priorityDomains.join(",")]);

  const critical       = scored.filter(p => (p.severityScore ?? 0) >= 75);
  const byDomain: Record<string, ScoredProtocol[]> = {
    offense:       scored.filter(p => p.strategicCategory === "offense"),
    defense:       scored.filter(p => p.strategicCategory === "defense"),
    special_teams: scored.filter(p => p.strategicCategory === "special_teams"),
  };
  const displayed = protocolTab === "all" ? scored : byDomain[protocolTab] ?? [];

  const domainLabel: Record<string, string> = { offense: "GROWTH & POSITIONING", defense: "RISK & RESILIENCE", special_teams: "TRANSFORMATION" };
  const domainColor: Record<string, string> = { offense: TEAL, defense: RED, special_teams: BLUE };

  const readinessScore = useMemo(
    () => computeReadinessScore(selectedProtocols, scored),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProtocols.size, scored.length],
  );

  /* ── Step config ── */
  const SETUP_LABELS     = ["Profile", "Risk & Triggers", "Priorities", "Protocols", "Authorization", "Activate"];
  const CUSTOMIZE_LABELS = ["Profile", "Risk & Triggers", "Priorities", "Protocols"];
  const stepLabels       = mode === "customize" ? CUSTOMIZE_LABELS : SETUP_LABELS;
  const totalSteps       = stepLabels.length;
  const isLastStep       = step === totalSteps - 1;

  const canAdvance = (() => {
    if (step === 0) return !!industry && !!size;
    if (step === 1) return triggerCategories.length > 0;
    if (step === 2) return priorityDomains.length > 0;
    if (step === 3) return selectedProtocols.size >= 1;
    if (step === 4) return !!execSponsor;
    return true;
  })();

  /* ── Auto-save draft ── */
  useEffect(() => {
    if (mode === "landing") return;
    const data: DraftState = {
      mode, step, industry, size,
      triggerCategories, customTriggers,
      priorityDomains, urgency,
      selectedProtocols: [...selectedProtocols],
      customizations, orgName, execSponsor, execRole, pmoLead,
      domainOwners, isDemoMode,
    };
    saveDraft(data);
    setDraft(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, step, industry, size, triggerCategories.join(","), customTriggers.join(","), priorityDomains.join(","), urgency, selectedProtocols.size, JSON.stringify(customizations), orgName, execSponsor, execRole, pmoLead, JSON.stringify(domainOwners)]);

  /* ── Resume draft ── */
  const resumeDraft = (d: DraftState) => {
    setMode(d.mode);
    setStep(d.step);
    setIndustry(d.industry);
    setSize(d.size);
    setTriggerCategories(d.triggerCategories);
    setCustomTriggers(d.customTriggers);
    setPriorityDomains(d.priorityDomains);
    setUrgency(d.urgency);
    setSelectedProtocols(new Set(d.selectedProtocols));
    setCustomizations(d.customizations);
    setOrgName(d.orgName);
    setExecSponsor(d.execSponsor);
    setExecRole(d.execRole);
    setPmoLead(d.pmoLead);
    setDomainOwners(d.domainOwners);
    setIsDemoMode(d.isDemoMode);
    setProtocolViewMode(d.isDemoMode ? "architecture" : "architecture");
  };

  /* ── Mutations ── */
  const buildPayload = () => {
    const selectedNames = [...selectedProtocols].map(id => {
      const k = String(id);
      const p = scored.find(s => String(s.id ?? s.name) === k);
      return customizations[k]?.customName || p?.name || k;
    });
    return {
      name: orgName || undefined,
      industry,
      size: SIZE_INT[size] || 0,
      settings: {
        playbooks: { selected: selectedNames, triggerAlerts: true, autoEscalation: true },
        ideaConfig: {
          executiveSponsor: `${execSponsor}${execRole ? ` (${execRole})` : ""}`,
          pmoContact: pmoLead,
          responseTarget: "12",
          domainOwners: domainOwners.map(d => ({ domain: d.domain, owner: d.owner, email: d.email, mobile: d.mobile, backup: "" })),
          approvalRequired: true,
          budgetThreshold: "100000",
          customTriggers,
          protocolCustomizations: customizations,
        },
        orgProfile: { companyType: "", primaryMarkets: [] },
      },
    };
  };

  const activateMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/organizations/current", buildPayload()).catch(() => {});
      await apiRequest("POST", "/api/onboarding/complete", {}).catch(() => {});
      /* Create stakeholder contacts for domain owners who have email addresses */
      let created = 0;
      for (const owner of domainOwners) {
        if (owner.email && owner.owner) {
          const res = await apiRequest("POST", "/api/stakeholder-contacts", {
            name: owner.owner,
            role: owner.role || owner.domain,
            email: owner.email,
            phone: owner.mobile || "",
            triggerDomains: [owner.domain],
            preferredChannel: owner.mobile ? "sms" : "email",
            isActive: true,
          }).catch(() => null);
          if (res) created++;
        }
      }
      return { success: true, contactsCreated: created };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/organizations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stakeholder-contacts"] });
      setStakeholderCount((data as any).contactsCreated ?? 0);
      clearDraft();
      setDraft(null);
      setIsComplete(true);
    },
    onError: () => { clearDraft(); setDraft(null); setIsComplete(true); },
  });

  const customizeMutation = useMutation({
    mutationFn: async () => {
      const selectedNames = [...selectedProtocols].map(id => {
        const k = String(id);
        const p = scored.find(s => String(s.id ?? s.name) === k);
        return customizations[k]?.customName || p?.name || k;
      });
      await apiRequest("PATCH", "/api/organizations/current", {
        settings: {
          playbooks: { selected: selectedNames, triggerAlerts: true, autoEscalation: true },
          ideaConfig: { customTriggers, protocolCustomizations: customizations },
        },
      }).catch(() => {});
      return { success: true };
    },
    onSuccess: () => { clearDraft(); setDraft(null); setIsComplete(true); },
    onError:   () => { clearDraft(); setDraft(null); setIsComplete(true); },
  });

  /* ── Handlers ── */
  const advance = () => {
    if (isLastStep) {
      if (!isAuthenticated) { toast({ title: "Sign in to activate", description: "Create an account to save your architecture." }); return; }
      mode === "customize" ? customizeMutation.mutate() : activateMutation.mutate();
    } else {
      setStep(s => s + 1);
    }
  };

  const addCustomTrigger = () => {
    const t = customTriggerInput.trim();
    if (t && !customTriggers.includes(t)) { setCustomTriggers(prev => [...prev, t]); setCustomTriggerInput(""); }
  };

  const toggleProtocol = (id: string | number) => {
    setSelectedProtocols(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const updateCustomization = (id: string, field: keyof ProtocolCustomization, value: string) => {
    setCustomizations(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const updateOwner = (index: number, field: string, value: string) => {
    setDomainOwners(prev => prev.map((o, i) => i === index ? { ...o, [field]: value } : o));
  };

  const handleDemoQuickStart = (ind: string) => {
    const preset = DEMO_PRESETS[ind] ?? { triggers: ["cyber", "regulatory"], domains: ["defense"], size: "5000_25000", urgency: "trigger_imminent" };
    setIndustry(ind);
    setTriggerCategories(preset.triggers);
    setPriorityDomains(preset.domains);
    setSize(preset.size);
    setUrgency(preset.urgency);
    setIsDemoMode(true);
    setProtocolViewMode("architecture");
    setMode("setup");
    setStep(3); // Jump directly to visual architecture
  };

  const resetAll = () => {
    clearDraft();
    setDraft(null);
    setIsComplete(false);
    setMode("landing");
    setStep(0);
    setIsDemoMode(false);
    setIndustry(""); setSize("");
    setTriggerCategories([]); setCustomTriggers([]); setCustomTriggerInput("");
    setPriorityDomains([]); setUrgency("");
    setSelectedProtocols(new Set()); setCustomizations({});
    setOrgName(""); setExecSponsor(""); setExecRole(""); setPmoLead("");
    setDomainOwners(AUTH_SLOTS.map(s => ({ domain: s.domain, owner: "", role: "", email: "", mobile: "" })));
    setStakeholderCount(0);
  };

  /* ── Complete ── */
  if (isComplete) {
    return (
      <CompleteScreen
        mode={mode}
        orgName={orgName}
        execSponsor={execSponsor}
        selectedCount={selectedProtocols.size}
        customizationCount={Object.keys(customizations).length}
        customTriggerCount={customTriggers.length}
        stakeholderCount={stakeholderCount}
        onReset={resetAll}
      />
    );
  }

  /* ── Landing ── */
  if (mode === "landing") {
    return (
      <StudioLanding
        onMode={m => { setMode(m); setStep(0); }}
        onDemo={handleDemoQuickStart}
        draft={draft}
        onResume={() => draft && resumeDraft(draft)}
        onClearDraft={() => { clearDraft(); setDraft(null); }}
      />
    );
  }

  /* ── Wizard ── */
  const isMutating = activateMutation.isPending || customizeMutation.isPending;

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: "56px 48px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button
            onClick={() => { if (step === 0) setMode("landing"); else setStep(s => s - 1); }}
            style={{ ...BC, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 20, padding: 0 }}
          >
            <ChevronLeft size={14} /> {step === 0 ? "Back to Studio" : "Back"}
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <EyebrowLabel>
                {mode === "setup"
                  ? isDemoMode ? "Readiness Architecture Studio · Demo View" : "Readiness Architecture Studio · Full Setup"
                  : "Readiness Architecture Studio · Customization"}
              </EyebrowLabel>
              <h1 style={{ ...CG, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "14px 0 14px" }}>
                {step === 0 && "Map your readiness architecture"}
                {step === 1 && "Define your risk exposure and triggers."}
                {step === 2 && "Set your strategic priorities."}
                {step === 3 && "Select and configure your protocols."}
                {step === 4 && "Configure your authorization chain."}
                {step === 5 && "Review and activate."}
                {step < 3 && <><br /><em style={{ color: GOLD }}>before the trigger fires.</em></>}
              </h1>
              {step < 3 && (
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
                  {step === 0 && "The system matches your organization's profile against 180 Readiness Protocols and returns a prioritized architecture for your Preparation Architect to configure."}
                  {step === 1 && "Select every trigger category relevant to your organization. Add custom triggers unique to your situation."}
                  {step === 2 && "Identify where preparation is most urgent. The architecture will front-load these in your setup path."}
                </p>
              )}
            </div>
            {isDemoMode && (
              <div style={{ padding: "8px 14px", background: "rgba(43,138,110,0.2)", border: "1px solid rgba(43,138,110,0.35)", display: "flex", alignItems: "center", gap: 8 }}>
                <Radio size={12} color={TEAL} />
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: TEAL }}>Demo Mode · {industry}</span>
              </div>
            )}
          </div>

          {!isAuthenticated && step >= 3 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", marginTop: 12 }}>
              <Lock size={12} color={GOLD} />
              <span style={{ fontSize: 12, color: GOLD }}>Viewing as demo — sign in to save your architecture</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "24px 48px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 0 }}>
          {stepLabels.map((label, i) => {
            const done   = i < step;
            const active = i === step;
            return (
              <div key={label} style={{ flex: 1, paddingRight: i < stepLabels.length - 1 ? 10 : 0 }}>
                <div style={{ height: 3, background: done ? TEAL : active ? GOLD : BORDER, marginBottom: 10, transition: "background 0.3s" }} />
                <div style={{ ...BC, fontSize: 9, fontWeight: done || active ? 700 : 400, letterSpacing: "0.12em", textTransform: "uppercase", color: done ? TEAL : active ? NAVY : MUTED, paddingBottom: 14, whiteSpace: "nowrap" }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div style={{ background: step >= 3 ? "#FAFAF8" : "#fff", padding: "48px 48px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* ── STEP 0: Profile ── */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 36 }}>
                <FieldLabel>Primary industry</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                  {INDUSTRIES.map(({ key, label, icon: Icon }) => {
                    const sel = industry === key;
                    return (
                      <button key={key} onClick={() => setIndustry(key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: sel ? NAVY : "#fff", border: `2px solid ${sel ? GOLD : BORDER}`, borderRadius: "0.15rem", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                        <Icon size={14} color={sel ? GOLD : MUTED} style={{ flexShrink: 0 }} />
                        <span style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: sel ? "#fff" : NAVY }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <FieldLabel>Organization size</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                  {SIZES.map(({ key, label, sub }) => {
                    const sel = size === key;
                    return (
                      <button key={key} onClick={() => setSize(key)} style={{ padding: "16px 18px", textAlign: "left", background: sel ? NAVY : "#fff", border: `2px solid ${sel ? GOLD : BORDER}`, borderRadius: "0.15rem", cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: sel ? GOLD : NAVY, marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 12, color: sel ? "rgba(255,255,255,0.5)" : MUTED }}>{sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Risk + Custom Triggers ── */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 40 }}>
                <FieldLabel>Select all trigger categories that apply to your organization</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10, marginBottom: 32 }}>
                  {TRIGGER_CATEGORIES.map(({ key, label }) => {
                    const sel = triggerCategories.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => setTriggerCategories(prev => sel ? prev.filter(k => k !== key) : [...prev, key])}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", textAlign: "left", background: sel ? "rgba(10,15,46,0.04)" : "#fff", border: `2px solid ${sel ? TEAL : BORDER}`, borderLeft: `4px solid ${sel ? TEAL : BORDER}`, borderRadius: "0.15rem", cursor: "pointer", transition: "all 0.15s" }}
                      >
                        <div style={{ width: 18, height: 18, borderRadius: 2, flexShrink: 0, background: sel ? TEAL : "#fff", border: `2px solid ${sel ? TEAL : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {sel && <CheckCircle2 size={12} color="#fff" />}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom triggers */}
                <div style={{ background: IVORY, border: `1px solid ${BORDER}`, padding: "24px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Plus size={14} color={GOLD} />
                    <FieldLabel>Define custom triggers unique to your organization</FieldLabel>
                  </div>
                  <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, lineHeight: 1.5 }}>
                    Add specific situations not covered by the categories above — e.g. "Board director resignation," "Flagship product recall," "Major contract termination."
                  </p>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <input
                      type="text"
                      value={customTriggerInput}
                      onChange={e => setCustomTriggerInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addCustomTrigger()}
                      placeholder="e.g. Board director resignation"
                      style={{ flex: 1, padding: "10px 14px", border: `1px solid ${BORDER}`, fontSize: 13, color: NAVY, outline: "none", borderRadius: "0.15rem" }}
                    />
                    <button
                      onClick={addCustomTrigger}
                      style={{ ...BC, padding: "10px 18px", background: NAVY, color: "#fff", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "0.15rem" }}
                    >
                      Add
                    </button>
                  </div>
                  {customTriggers.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {customTriggers.map(t => (
                        <div key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 12px", background: "#fff", border: `1px solid ${GOLD}`, borderRadius: "0.15rem" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{t}</span>
                          <button onClick={() => setCustomTriggers(prev => prev.filter(x => x !== t))} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 0, display: "flex", alignItems: "center" }}>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Domain Priorities ── */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 40 }}>
                <FieldLabel>Where do you need to be ready first?</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 36 }}>
                  {DOMAIN_OPTIONS.map(({ key, label, color, sub }) => {
                    const sel = priorityDomains.includes(key);
                    return (
                      <button key={key} onClick={() => setPriorityDomains(prev => sel ? prev.filter(k => k !== key) : [...prev, key])} style={{ padding: "22px 20px", textAlign: "left", background: sel ? NAVY : "#fff", border: `2px solid ${sel ? color : BORDER}`, borderTop: `4px solid ${sel ? color : BORDER}`, borderRadius: "0.15rem", cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: sel ? color : MUTED, marginBottom: 8 }}>{label}</div>
                        <div style={{ fontSize: 13, color: sel ? "rgba(255,255,255,0.65)" : "#374151", lineHeight: 1.6 }}>{sub}</div>
                        {sel && <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={12} color={color} /><span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color }}>Priority</span></div>}
                      </button>
                    );
                  })}
                </div>
                <FieldLabel>What best describes your situation right now?</FieldLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {URGENCY_OPTIONS.map(({ key, label }) => {
                    const sel = urgency === key;
                    return (
                      <button key={key} onClick={() => setUrgency(key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", textAlign: "left", background: sel ? IVORY : "#fff", border: `2px solid ${sel ? GOLD : BORDER}`, borderRadius: "0.15rem", cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, background: sel ? GOLD : "#fff", border: `2px solid ${sel ? GOLD : BORDER}` }} />
                        <span style={{ fontSize: 13, fontWeight: sel ? 600 : 400, color: NAVY, lineHeight: 1.4 }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Protocol Selection + Customization ── */}
          {step === 3 && (
            <div>
              {/* Critical gap alert */}
              {critical.length > 0 && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", background: "rgba(220,38,38,0.05)", border: `1px solid rgba(220,38,38,0.2)`, borderLeft: `4px solid ${RED}`, marginBottom: 20 }}>
                  <AlertTriangle size={15} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                    <strong style={{ color: RED }}>{critical.length} critical gap{critical.length !== 1 ? "s" : ""} detected.</strong> These protocols have a severity score of 75+ — configure them in Phase 1 of your setup path.
                  </span>
                </div>
              )}

              {/* View mode toggle + actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: MUTED, margin: 0, flex: 1, lineHeight: 1.5 }}>
                  {protocolViewMode === "architecture"
                    ? "Select protocols to configure your architecture. Switch to List View to customize names, owners, and trigger conditions."
                    : "Select and expand protocols to customize names, trigger conditions, and execution owners."}
                </p>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => setProtocolViewMode("architecture")}
                    style={{ ...BC, display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 12px", cursor: "pointer", borderRadius: "0.15rem", background: protocolViewMode === "architecture" ? NAVY : "transparent", color: protocolViewMode === "architecture" ? "#fff" : MUTED, border: `1px solid ${protocolViewMode === "architecture" ? NAVY : BORDER}`, transition: "all 0.15s" }}
                  >
                    <LayoutGrid size={11} /> Architecture
                  </button>
                  <button
                    onClick={() => setProtocolViewMode("list")}
                    style={{ ...BC, display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 12px", cursor: "pointer", borderRadius: "0.15rem", background: protocolViewMode === "list" ? NAVY : "transparent", color: protocolViewMode === "list" ? "#fff" : MUTED, border: `1px solid ${protocolViewMode === "list" ? NAVY : BORDER}`, transition: "all 0.15s" }}
                  >
                    <List size={11} /> List
                  </button>
                  <a href="/protocol-builder" style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 12px", background: "transparent", border: `1px solid ${BORDER}`, color: TEAL, textDecoration: "none", borderRadius: "0.15rem" }}>
                    <Plus size={11} /> Build Custom
                  </a>
                </div>
              </div>

              {/* ── Architecture View ── */}
              {protocolViewMode === "architecture" && (
                <ArchitectureView
                  scored={scored}
                  byDomain={byDomain}
                  domainLabel={domainLabel}
                  domainColor={domainColor}
                  selectedProtocols={selectedProtocols}
                  toggleProtocol={toggleProtocol}
                  customizations={customizations}
                  readinessScore={readinessScore}
                />
              )}

              {/* ── List View ── */}
              {protocolViewMode === "list" && (
                <div>
                  {/* Stats bar */}
                  <div style={{ background: NAVY, padding: "20px 28px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", gap: 28 }}>
                      {[
                        { v: scored.length,         l: "Protocols Matched",  alert: false },
                        { v: critical.length,        l: "Critical Gaps",      alert: critical.length > 0 },
                        { v: selectedProtocols.size, l: "Selected",           alert: false },
                        { v: readinessScore,         l: "Coverage",           alert: false, suffix: "%" },
                      ].map(({ v, l, alert, suffix }) => (
                        <div key={l}>
                          <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: alert ? "#FCA5A5" : GOLD, lineHeight: 1 }}>{v}{suffix ?? ""}</div>
                          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Domain tabs */}
                  <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
                    {[
                      { key: "all",          label: `All (${scored.length})` },
                      { key: "defense",      label: `Risk & Resilience (${byDomain.defense.length})` },
                      { key: "offense",      label: `Growth & Positioning (${byDomain.offense.length})` },
                      { key: "special_teams", label: `Transformation (${byDomain.special_teams.length})` },
                    ].map(({ key, label }) => (
                      <button key={key} onClick={() => setProtocolTab(key as typeof protocolTab)} style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 16px", background: "none", border: "none", borderBottom: `3px solid ${protocolTab === key ? GOLD : "transparent"}`, color: protocolTab === key ? NAVY : MUTED, cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap" }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Protocol cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {displayed.map((p, i) => {
                      const pid    = String(p.id ?? p.name);
                      const sel    = selectedProtocols.has(p.id ?? p.name);
                      const expand = expandedProtocol === pid;
                      const custom = customizations[pid] ?? {};
                      const isCrit = (p.severityScore ?? 0) >= 75;
                      const domain = p.strategicCategory ?? "defense";
                      const dColor = domainColor[domain] ?? TEAL;
                      const dLabel = domainLabel[domain] ?? domain;
                      const hasCustom = !!(custom.customName || custom.customDescription || custom.customTrigger || custom.executionOwner);

                      return (
                        <div key={pid} style={{ border: `1px solid ${sel ? GOLD : isCrit ? "rgba(220,38,38,0.2)" : BORDER}`, borderLeft: `4px solid ${sel ? GOLD : isCrit ? RED : dColor}`, background: sel ? "#FEFDF9" : "#fff", transition: "all 0.15s" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
                            <button
                              onClick={() => toggleProtocol(p.id ?? p.name)}
                              style={{ width: 22, height: 22, borderRadius: 3, flexShrink: 0, background: sel ? NAVY : "#fff", border: `2px solid ${sel ? NAVY : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                            >
                              {sel && <CheckCircle2 size={14} color={GOLD} />}
                            </button>
                            <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: MUTED, minWidth: 26, textAlign: "center" }}>#{p.playbookNumber ?? i + 1}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{custom.customName || p.name}</span>
                                {custom.customName && <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, background: "rgba(201,168,76,0.1)", padding: "2px 6px" }}>Custom</span>}
                                {isCrit && <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: RED, color: "#fff", padding: "2px 6px" }}>Critical</span>}
                                {hasCustom && !custom.customName && <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL }}>Customized</span>}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: dColor }}>{dLabel}</span>
                                {p.primaryExecutiveRole && <span style={{ fontSize: 11, color: MUTED }}>· {p.primaryExecutiveRole}</span>}
                                {p.timeSensitivity && <span style={{ fontSize: 11, color: MUTED }}>· {p.timeSensitivity}h window</span>}
                              </div>
                            </div>
                            <button
                              onClick={() => setExpandedProtocol(expand ? null : pid)}
                              style={{ ...BC, display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: expand ? NAVY : MUTED, background: expand ? "#F3F0E8" : "none", border: `1px solid ${expand ? GOLD : BORDER}`, padding: "5px 10px", cursor: "pointer", borderRadius: "0.15rem", flexShrink: 0 }}
                            >
                              <Edit3 size={11} /> Customize
                            </button>
                          </div>

                          {expand && (
                            <div style={{ borderTop: `1px solid ${BORDER}`, background: "#FAFAF8", padding: "18px 20px 18px 56px" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                                <div>
                                  <FieldLabel>Custom Protocol Name</FieldLabel>
                                  <input type="text" value={custom.customName ?? p.name} onChange={e => updateCustomization(pid, "customName", e.target.value)} placeholder={p.name} style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, fontSize: 12, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                  <FieldLabel>Execution Owner</FieldLabel>
                                  <input type="text" value={custom.executionOwner ?? ""} onChange={e => updateCustomization(pid, "executionOwner", e.target.value)} placeholder="e.g. CFO, VP Operations" style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, fontSize: 12, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }} />
                                </div>
                              </div>
                              <div style={{ marginBottom: 12 }}>
                                <FieldLabel>Custom Description</FieldLabel>
                                <textarea value={custom.customDescription ?? (p.description ?? "")} onChange={e => updateCustomization(pid, "customDescription", e.target.value)} placeholder={p.description || "Describe what this protocol covers for your organization..."} rows={2} style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, fontSize: 12, color: NAVY, outline: "none", resize: "vertical", borderRadius: "0.15rem", boxSizing: "border-box" }} />
                              </div>
                              <div>
                                <FieldLabel>Custom Trigger Condition</FieldLabel>
                                <input type="text" value={custom.customTrigger ?? ""} onChange={e => updateCustomization(pid, "customTrigger", e.target.value)} placeholder="e.g. Ransomware detection on ERP system — SIEM alert Level 3+" style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, fontSize: 12, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }} />
                                <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>The specific signal or condition that fires this protocol in your organization.</div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {displayed.length === 0 && (
                    <div style={{ padding: "40px 0", textAlign: "center" }}>
                      <p style={{ fontSize: 14, color: MUTED, marginBottom: 16 }}>No protocols matched in this domain for your profile.</p>
                      <a href="/protocol-builder" style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL, textDecoration: "none" }}>
                        <Plus size={13} /> Build a custom protocol for this domain
                      </a>
                    </div>
                  )}

                  {selectedProtocols.size > 0 && (
                    <div style={{ margin: "20px 0 0", padding: "12px 18px", background: "rgba(43,138,110,0.06)", border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", gap: 10 }}>
                      <CheckCircle2 size={14} color={TEAL} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{selectedProtocols.size} protocol{selectedProtocols.size !== 1 ? "s" : ""} selected — {Object.keys(customizations).length > 0 ? `${Object.keys(customizations).length} customized` : "continue to configure authorization chain"}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: Authorization Chain ── */}
          {step === 4 && (
            <div>
              <div style={{ background: "rgba(10,15,46,0.04)", border: `1px solid ${BORDER}`, padding: "16px 20px", marginBottom: 32, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <MapPin size={15} color={GOLD} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 2 }}>Why authorization chain matters</div>
                  <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>No Readiness Protocol activates without executive sign-off. The authorization chain defines who in each domain has authority to activate. Mobile is required for the 12-minute window. Domain owners entered here will be created as live contacts in your notification system.</div>
                </div>
              </div>

              <div style={{ marginBottom: 36 }}>
                <FieldLabel>Organization name</FieldLabel>
                <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Your organization's name" style={{ width: "100%", maxWidth: 440, padding: "10px 14px", border: `1px solid ${BORDER}`, fontSize: 13, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
                <div>
                  <FieldLabel>Executive Sponsor *</FieldLabel>
                  <input type="text" value={execSponsor} onChange={e => setExecSponsor(e.target.value)} placeholder="Name of sponsoring executive" style={{ width: "100%", padding: "10px 14px", border: `2px solid ${execSponsor ? TEAL : BORDER}`, fontSize: 13, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }} />
                </div>
                <div>
                  <FieldLabel>Title / Role</FieldLabel>
                  <input type="text" value={execRole} onChange={e => setExecRole(e.target.value)} placeholder="e.g. CEO, President, COO" style={{ width: "100%", padding: "10px 14px", border: `1px solid ${BORDER}`, fontSize: 13, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ marginBottom: 36 }}>
                <FieldLabel>Preparation Architect (PMO lead)</FieldLabel>
                <input type="text" value={pmoLead} onChange={e => setPmoLead(e.target.value)} placeholder="Name of your Preparation Architect" style={{ width: "100%", maxWidth: 440, padding: "10px 14px", border: `1px solid ${BORDER}`, fontSize: 13, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }} />
              </div>

              <FieldLabel>Domain Authorization Owners</FieldLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 12 }}>
                {domainOwners.map((owner, i) => (
                  <div key={owner.domain} style={{ border: `1px solid ${BORDER}`, borderTop: i === 0 ? `1px solid ${BORDER}` : "none", padding: "18px 20px" }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: NAVY, marginBottom: 12 }}>{owner.domain}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                      {[
                        { field: "owner",  label: "Name",            ph: AUTH_SLOTS[i].placeholder },
                        { field: "role",   label: "Role / Title",    ph: "e.g. CFO" },
                        { field: "email",  label: "Email ★",         ph: "name@company.com" },
                        { field: "mobile", label: "Mobile ★★",       ph: "+1 555 000 0000" },
                      ].map(({ field, label, ph }) => (
                        <div key={field}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
                          <input
                            type={field === "email" ? "email" : field === "mobile" ? "tel" : "text"}
                            value={(owner as any)[field]}
                            onChange={e => updateOwner(i, field, e.target.value)}
                            placeholder={ph}
                            style={{ width: "100%", padding: "8px 12px", border: `1px solid ${field === "email" && owner.email ? TEAL : field === "mobile" && owner.mobile ? TEAL : BORDER}`, fontSize: 12, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: MUTED, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Shield size={11} color={MUTED} />
                  ★ Email creates a live notification contact — domain owner will receive trigger alerts automatically.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Shield size={11} color={MUTED} />
                  ★★ Mobile required for 12-minute activation window — executives receive protocol authorization requests via mobile.
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Review & Activate ── */}
          {step === 5 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                {[
                  {
                    title: "Organization",
                    items: [
                      orgName ? `Name: ${orgName}` : "Organization name not set",
                      `Industry: ${INDUSTRIES.find(i => i.key === industry)?.label ?? industry}`,
                      `Size: ${SIZES.find(s => s.key === size)?.label ?? size}`,
                      execSponsor ? `Sponsor: ${execSponsor}${execRole ? ` (${execRole})` : ""}` : "Executive sponsor not set",
                      pmoLead ? `Preparation Architect: ${pmoLead}` : "PMO lead not set",
                    ],
                  },
                  {
                    title: "Protocols",
                    items: [
                      `${selectedProtocols.size} protocol${selectedProtocols.size !== 1 ? "s" : ""} selected`,
                      `${Object.keys(customizations).length} customized for your organization`,
                      `${critical.length} critical gap${critical.length !== 1 ? "s" : ""} identified`,
                      triggerCategories.length > 0 ? `${triggerCategories.length} trigger categories` : "",
                      customTriggers.length > 0 ? `${customTriggers.length} custom trigger${customTriggers.length !== 1 ? "s" : ""} defined` : "",
                      `Architecture coverage: ${readinessScore}%`,
                    ].filter(Boolean),
                  },
                  {
                    title: "Risk Exposure",
                    items: [
                      ...triggerCategories.map(k => TRIGGER_CATEGORIES.find(c => c.key === k)?.label ?? k),
                      ...customTriggers.map(t => `Custom: ${t}`),
                    ],
                  },
                  {
                    title: "Authorization Chain",
                    items: [
                      ...domainOwners.filter(d => d.owner).map(d => `${d.domain}: ${d.owner}${d.role ? ` (${d.role})` : ""}${d.email ? " · contact ready" : ""}`),
                      domainOwners.filter(d => d.email).length > 0 ? `${domainOwners.filter(d => d.email).length} stakeholder contact${domainOwners.filter(d => d.email).length !== 1 ? "s" : ""} will be created` : "",
                    ].filter(Boolean),
                  },
                ].map(({ title, items }) => (
                  <div key={title} style={{ border: `1px solid ${BORDER}`, padding: "20px 22px", background: "#fff" }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 14 }}>{title}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {items.length === 0
                        ? <div style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>Not configured</div>
                        : items.map((item, j) => (
                            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <CheckCircle2 size={12} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} />
                              <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{item}</span>
                            </div>
                          ))
                      }
                    </div>
                  </div>
                ))}
              </div>

              {!isAuthenticated ? (
                <div style={{ border: `2px solid ${GOLD}`, padding: "24px 28px", background: "rgba(201,168,76,0.05)", display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
                  <Lock size={18} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Sign in to activate your architecture</div>
                    <div style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>Your readiness architecture is fully mapped. Create an account or sign in to save your protocols, configure your authorization chain, and activate live signal monitoring.</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <a href="/api/auth/login" style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", background: NAVY, color: "#fff", textDecoration: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "0.15rem" }}>Sign In <ArrowRight size={12} /></a>
                      <a href="/request-access" style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", background: "transparent", color: NAVY, textDecoration: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>Apply for Founding Partner Access</a>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: "rgba(43,138,110,0.06)", border: `1px solid ${TEAL}`, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                  <Radio size={14} color={TEAL} />
                  <span style={{ fontSize: 13, color: NAVY, fontWeight: 600 }}>Ready to activate — signal monitoring will begin immediately after activation.</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Navigation bar */}
      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, padding: "24px 48px", marginTop: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => step === 0 ? setMode("landing") : setStep(s => s - 1)}
            style={{ ...BC, display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "0.15rem" }}
          >
            <ChevronLeft size={13} /> {step === 0 ? "Back to Studio" : "Back"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 12, color: MUTED }}>Step {step + 1} of {totalSteps}</span>
            <button
              onClick={advance}
              disabled={!canAdvance || isMutating}
              style={{
                ...BC, display: "flex", alignItems: "center", gap: 8, padding: "12px 28px",
                background: canAdvance && !isMutating ? (isLastStep ? TEAL : NAVY) : "#E5E7EB",
                color: canAdvance && !isMutating ? "#fff" : MUTED,
                border: "none", cursor: canAdvance && !isMutating ? "pointer" : "not-allowed",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                borderRadius: "0.15rem", transition: "all 0.2s",
              }}
            >
              {isMutating ? "Activating..." : isLastStep ? (isAuthenticated ? (mode === "customize" ? "Save Customizations" : "Activate Architecture") : "Sign In to Activate") : "Continue"}
              {!isMutating && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
