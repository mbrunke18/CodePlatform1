import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle,
  Shield, Zap, TrendingUp, Building2, Target, Layers, BarChart3,
  Users, Plus, X, Edit3, Lock, Radio, Rocket, RotateCcw,
  ExternalLink, Settings, MapPin,
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
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

/* ─── Types ─────────────────────────────────────────────────── */
type StudioMode = "landing" | "setup" | "customize";

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
  { key: "offense",       label: "GROWTH & POSITIONING", color: TEAL,       sub: "Market entry, competitive response, M&A, product launch" },
  { key: "defense",       label: "RISK & RESILIENCE",    color: RED,        sub: "Cyber, regulatory, supply chain, financial, reputational" },
  { key: "special_teams", label: "TRANSFORMATION",       color: "#7C3AED",  sub: "Workforce, culture, restructuring, go-to-market pivots" },
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

/* ─── Studio Landing ─────────────────────────────────────────── */
function StudioLanding({ onMode, onDemo }: { onMode: (m: StudioMode) => void; onDemo: (industry: string) => void }) {
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
                style={{
                  marginTop: 20, display: "flex", alignItems: "center", gap: 8, padding: "11px 22px",
                  background: NAVY, color: "#fff", border: "none", cursor: "pointer",
                  ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "0.15rem",
                }}
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
                style={{
                  marginTop: 20, display: "flex", alignItems: "center", gap: 8, padding: "11px 22px",
                  background: TEAL, color: "#fff", border: "none", cursor: "pointer",
                  ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "0.15rem",
                }}
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
                style={{
                  marginTop: 20, display: "flex", alignItems: "center", gap: 8, padding: "11px 22px",
                  background: "transparent", color: NAVY, border: `2px solid ${NAVY}`, cursor: "pointer",
                  ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "0.15rem",
                }}
              >
                Customize Protocols <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Demo quick-start */}
          <div style={{ background: IVORY, border: `1px solid ${BORDER}`, padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <Radio size={16} color={TEAL} />
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>Demo Quick-Start</div>
            </div>
            <p style={{ fontSize: 13, color: NAVY, fontWeight: 600, marginBottom: 12 }}>
              Running a demo? Select an industry to see a live architecture preview instantly.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Financial Services", "Healthcare", "Technology", "Manufacturing", "Energy"].map(ind => (
                <button
                  key={ind}
                  onClick={() => onDemo(ind)}
                  style={{
                    ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "7px 14px", background: "#fff", border: `1px solid ${BORDER}`,
                    color: NAVY, cursor: "pointer", borderRadius: "0.15rem",
                  }}
                >
                  {ind}
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
  mode, orgName, execSponsor, selectedCount, customizationCount, customTriggerCount,
  onReset,
}: {
  mode: StudioMode; orgName: string; execSponsor: string;
  selectedCount: number; customizationCount: number; customTriggerCount: number;
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, margin: "36px 0 40px" }}>
            {[
              { stat: String(selectedCount), label: "Protocols Staged", sub: "matched and configured" },
              { stat: String(customizationCount), label: "Customized", sub: "tailored to your org" },
              { stat: customTriggerCount > 0 ? String(customTriggerCount) : "231", label: customTriggerCount > 0 ? "Custom Triggers" : "Triggers Monitored", sub: customTriggerCount > 0 ? "organization-specific" : "continuously" },
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
              <button onClick={() => nav("/command-tower")} style={{
                ...BC, display: "inline-flex", alignItems: "center", gap: 8,
                background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px",
                border: "none", cursor: "pointer", borderRadius: "0.15rem",
              }}>
                Enter Command Tower <ArrowRight size={14} />
              </button>
            )}
            <button onClick={() => nav("/playbook-library")} style={{
              ...BC, display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px",
              border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", borderRadius: "0.15rem",
            }}>
              View Protocol Library <ChevronRight size={14} />
            </button>
            {isSetup && (
              <button onClick={() => nav("/practice-drills")} style={{
                ...BC, display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px",
                border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", borderRadius: "0.15rem",
              }}>
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
  const [mode, setMode] = useState<StudioMode>("landing");
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

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
  const [orgName, setOrgName]     = useState("");
  const [execSponsor, setExecSponsor] = useState("");
  const [execRole, setExecRole]   = useState("");
  const [pmoLead, setPmoLead]     = useState("");
  const [domainOwners, setDomainOwners] = useState(
    AUTH_SLOTS.map(s => ({ domain: s.domain, owner: "", role: "", email: "", mobile: "" }))
  );

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

  const domainLabel: Record<string, string>  = { offense: "GROWTH & POSITIONING", defense: "RISK & RESILIENCE", special_teams: "TRANSFORMATION" };
  const domainColor: Record<string, string>  = { offense: TEAL, defense: RED, special_teams: "#7C3AED" };

  /* ── Step config ── */
  const SETUP_LABELS    = ["Profile", "Risk & Triggers", "Priorities", "Protocols", "Authorization", "Activate"];
  const CUSTOMIZE_LABELS = ["Profile", "Risk & Triggers", "Priorities", "Protocols"];
  const stepLabels      = mode === "customize" ? CUSTOMIZE_LABELS : SETUP_LABELS;
  const totalSteps      = stepLabels.length;
  const isLastStep      = step === totalSteps - 1;

  const canAdvance = (() => {
    if (step === 0) return !!industry && !!size;
    if (step === 1) return triggerCategories.length > 0;
    if (step === 2) return priorityDomains.length > 0;
    if (step === 3) return selectedProtocols.size >= 1;
    if (step === 4) return !!execSponsor;
    return true;
  })();

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
      return { success: true };
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/organizations"] }); setIsComplete(true); },
    onError:   () => setIsComplete(true),
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
    onSuccess: () => setIsComplete(true),
    onError:   () => setIsComplete(true),
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
    setIndustry(ind);
    setMode("setup");
    setStep(0);
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
        onReset={() => { setIsComplete(false); setMode("landing"); setStep(0); }}
      />
    );
  }

  /* ── Landing ── */
  if (mode === "landing") {
    return <StudioLanding onMode={m => { setMode(m); setStep(0); }} onDemo={handleDemoQuickStart} />;
  }

  /* ── Wizard ── */
  const isMutating = activateMutation.isPending || customizeMutation.isPending;
  const stepSize = INDUSTRIES.find(i => i.key === size)?.label ?? "";

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
          <EyebrowLabel>{mode === "setup" ? "Readiness Architecture Studio · Full Setup" : "Readiness Architecture Studio · Customization"}</EyebrowLabel>
          <h1 style={{ ...CG, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "14px 0 14px" }}>
            {step === 0 && "Map your readiness architecture"}
            {step === 1 && "Define your risk exposure and triggers."}
            {step === 2 && "Set your strategic priorities."}
            {step === 3 && "Select and customize your protocols."}
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
              {/* Stats bar */}
              <div style={{ background: NAVY, padding: "20px 28px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 28 }}>
                  {[
                    { v: scored.length, l: "Protocols Matched" },
                    { v: critical.length, l: "Critical Gaps", alert: true },
                    { v: selectedProtocols.size, l: "Selected" },
                  ].map(({ v, l, alert }) => (
                    <div key={l}>
                      <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: alert && v > 0 ? "#FCA5A5" : GOLD, lineHeight: 1 }}>{v}</div>
                      <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <a href="/protocol-builder" style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, textDecoration: "none" }}>
                  <Plus size={12} /> Build Custom Protocol
                </a>
              </div>

              {critical.length > 0 && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", background: "rgba(220,38,38,0.05)", border: `1px solid rgba(220,38,38,0.2)`, borderLeft: `4px solid ${RED}`, marginBottom: 20 }}>
                  <AlertTriangle size={15} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                    <strong style={{ color: RED }}>{critical.length} critical gap{critical.length !== 1 ? "s" : ""} detected.</strong> These protocols have a severity score of 75+ and should be configured in Phase 1 of your setup path.
                  </span>
                </div>
              )}

              <p style={{ fontSize: 14, color: MUTED, marginBottom: 20, lineHeight: 1.6 }}>
                Select the protocols to configure first. Expand any protocol to customize the name, description, trigger condition, or execution owner for your organization.
              </p>

              {/* Domain tabs */}
              <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 24 }}>
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
                      {/* Card header row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleProtocol(p.id ?? p.name)}
                          style={{ width: 22, height: 22, borderRadius: 3, flexShrink: 0, background: sel ? NAVY : "#fff", border: `2px solid ${sel ? NAVY : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        >
                          {sel && <CheckCircle2 size={14} color={GOLD} />}
                        </button>

                        {/* Protocol number */}
                        <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: MUTED, minWidth: 26, textAlign: "center" }}>#{p.playbookNumber ?? i + 1}</div>

                        {/* Name + meta */}
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

                        {/* Customize toggle */}
                        <button
                          onClick={() => setExpandedProtocol(expand ? null : pid)}
                          style={{ ...BC, display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: expand ? NAVY : MUTED, background: expand ? "#F3F0E8" : "none", border: `1px solid ${expand ? GOLD : BORDER}`, padding: "5px 10px", cursor: "pointer", borderRadius: "0.15rem", flexShrink: 0 }}
                        >
                          <Edit3 size={11} /> Customize
                        </button>
                      </div>

                      {/* Expand: customization panel */}
                      {expand && (
                        <div style={{ borderTop: `1px solid ${BORDER}`, background: "#FAFAF8", padding: "18px 20px 18px 56px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                            <div>
                              <FieldLabel>Custom Protocol Name</FieldLabel>
                              <input
                                type="text"
                                value={custom.customName ?? p.name}
                                onChange={e => updateCustomization(pid, "customName", e.target.value)}
                                placeholder={p.name}
                                style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, fontSize: 12, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }}
                              />
                            </div>
                            <div>
                              <FieldLabel>Execution Owner</FieldLabel>
                              <input
                                type="text"
                                value={custom.executionOwner ?? ""}
                                onChange={e => updateCustomization(pid, "executionOwner", e.target.value)}
                                placeholder="e.g. CFO, VP Operations"
                                style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, fontSize: 12, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }}
                              />
                            </div>
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <FieldLabel>Custom Description</FieldLabel>
                            <textarea
                              value={custom.customDescription ?? (p.description ?? "")}
                              onChange={e => updateCustomization(pid, "customDescription", e.target.value)}
                              placeholder={p.description || "Describe what this protocol covers for your organization..."}
                              rows={2}
                              style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, fontSize: 12, color: NAVY, outline: "none", resize: "vertical", borderRadius: "0.15rem", boxSizing: "border-box" }}
                            />
                          </div>
                          <div>
                            <FieldLabel>Custom Trigger Condition</FieldLabel>
                            <input
                              type="text"
                              value={custom.customTrigger ?? ""}
                              onChange={e => updateCustomization(pid, "customTrigger", e.target.value)}
                              placeholder="e.g. Ransomware detection on ERP system — SIEM alert Level 3+"
                              style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, fontSize: 12, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }}
                            />
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
                  <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{selectedProtocols.size} protocol{selectedProtocols.size !== 1 ? "s" : ""} selected — {Object.keys(customizations).length > 0 ? `${Object.keys(customizations).length} customized` : "continue to configure"}</span>
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
                  <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>No Readiness Protocol activates without executive sign-off. The authorization chain defines who in each domain has authority to activate. Mobile is required for the 12-minute window.</div>
                </div>
              </div>

              <div style={{ marginBottom: 36 }}>
                <FieldLabel>Organization name</FieldLabel>
                <input
                  type="text"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  placeholder="Your organization's name"
                  style={{ width: "100%", maxWidth: 440, padding: "10px 14px", border: `1px solid ${BORDER}`, fontSize: 13, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
                <div>
                  <FieldLabel>Executive Sponsor *</FieldLabel>
                  <input
                    type="text"
                    value={execSponsor}
                    onChange={e => setExecSponsor(e.target.value)}
                    placeholder="Name of sponsoring executive"
                    style={{ width: "100%", padding: "10px 14px", border: `2px solid ${execSponsor ? TEAL : BORDER}`, fontSize: 13, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <FieldLabel>Title / Role</FieldLabel>
                  <input
                    type="text"
                    value={execRole}
                    onChange={e => setExecRole(e.target.value)}
                    placeholder="e.g. CEO, President, COO"
                    style={{ width: "100%", padding: "10px 14px", border: `1px solid ${BORDER}`, fontSize: 13, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 36 }}>
                <FieldLabel>Preparation Architect (PMO lead)</FieldLabel>
                <input
                  type="text"
                  value={pmoLead}
                  onChange={e => setPmoLead(e.target.value)}
                  placeholder="Name of your Preparation Architect"
                  style={{ width: "100%", maxWidth: 440, padding: "10px 14px", border: `1px solid ${BORDER}`, fontSize: 13, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }}
                />
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
                        { field: "email",  label: "Email",           ph: "name@company.com" },
                        { field: "mobile", label: "Mobile ★",        ph: "+1 555 000 0000" },
                      ].map(({ field, label, ph }) => (
                        <div key={field}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
                          <input
                            type={field === "email" ? "email" : field === "mobile" ? "tel" : "text"}
                            value={(owner as any)[field]}
                            onChange={e => updateOwner(i, field, e.target.value)}
                            placeholder={ph}
                            style={{ width: "100%", padding: "8px 12px", border: `1px solid ${field === "mobile" && owner.mobile ? TEAL : BORDER}`, fontSize: 12, color: NAVY, outline: "none", borderRadius: "0.15rem", boxSizing: "border-box" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: MUTED, display: "flex", alignItems: "center", gap: 6 }}>
                <Shield size={11} color={MUTED} />
                ★ Mobile number required for 12-minute activation window — executives receive protocol authorization requests via mobile.
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
                    items: domainOwners.filter(d => d.owner).map(d => `${d.domain}: ${d.owner}${d.role ? ` (${d.role})` : ""}`),
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
