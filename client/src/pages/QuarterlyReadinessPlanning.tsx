import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Link } from "wouter";
import {
  ChevronRight, Plus, Trash2, CheckCircle2, Circle,
  Target, Shield, Zap, ArrowRight, Calendar, DollarSign,
  User, BookOpen, AlertTriangle, BarChart3, Download,
} from "lucide-react";

const NAVY   = "#0A0F2E";
const NAVY_B = "#132558";
const GOLD   = "#C9A84C";
const TEAL   = "#2B8A6E";
const IVORY  = "#F0EDE4";
const BORDER = "#E8E4DC";
const MUTED  = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const BR = { borderRadius: "0.15rem" };

type Domain = "growth" | "resilience" | "transformation";
type QLabel = "Q1" | "Q2" | "Q3" | "Q4";

interface DefensiveCoverage {
  id: string;
  scenario: string;
  protocol: string;
}

interface Initiative {
  id: string;
  domain: Domain;
  title: string;
  description: string;
  owner: string;
  targetDate: string;
  budget: string;
  activationProtocol: string;
  defensiveCoverage: DefensiveCoverage[];
  drillScheduled: boolean;
  drillDate: string;
}

const DOMAIN_CONFIG = {
  growth: {
    label: "GROWTH & POSITIONING",
    color: TEAL,
    bg: "rgba(43,138,110,0.08)",
    border: "rgba(43,138,110,0.3)",
    icon: Target,
    hint: "Market entries, competitive responses, M&A mobilization, product launches.",
    protocols: [
      "Competitor Displacement Sprint (Protocol #31)",
      "M&A Rapid Response (Protocol #58)",
      "Market Entry Acceleration (Protocol #12)",
      "Competitive Intelligence Response (Protocol #24)",
      "Strategic Partnership Activation (Protocol #47)",
      "Product Launch Mobilization (Protocol #89)",
      "Customer Retention Emergency (Protocol #33)",
      "Revenue Recovery Sprint (Protocol #19)",
    ],
  },
  resilience: {
    label: "RISK & RESILIENCE",
    color: "#C0392B",
    bg: "rgba(192,57,43,0.07)",
    border: "rgba(192,57,43,0.25)",
    icon: Shield,
    hint: "Ransomware, regulatory action, supply chain disruption, reputational events.",
    protocols: [
      "Ransomware Response (Protocol #67)",
      "FDA / Regulatory Recall Response (Protocol #72)",
      "Supply Chain Collapse Protocol (Protocol #81)",
      "Data Breach Containment (Protocol #63)",
      "DOJ Investigation Response (Protocol #77)",
      "Executive Leadership Departure (Protocol #44)",
      "Activist Investor Response (Protocol #59)",
      "Energy / Infrastructure Failure (Protocol #85)",
    ],
  },
  transformation: {
    label: "TRANSFORMATION",
    color: GOLD,
    bg: "rgba(201,168,76,0.08)",
    border: "rgba(201,168,76,0.3)",
    icon: Zap,
    hint: "Workforce shifts, technology transitions, operating model changes, restructuring.",
    protocols: [
      "Workforce Transformation (Protocol #112)",
      "Digital Transformation Acceleration (Protocol #98)",
      "Operating Model Redesign (Protocol #104)",
      "Go-To-Market Acceleration (Protocol #89)",
      "Post-Merger Integration (Protocol #61)",
      "Technology Platform Migration (Protocol #116)",
      "Organizational Restructure (Protocol #92)",
      "Cost Transformation Sprint (Protocol #107)",
    ],
  },
};

const DEFENSIVE_SCENARIOS = [
  "Competitor responds to our move",
  "Regulatory scrutiny triggered",
  "Key stakeholder departure mid-initiative",
  "Budget constraint or freeze",
  "Supply chain disruption impacts execution",
  "Reputational event during initiative window",
  "Technology failure / system outage",
  "Legal or compliance challenge",
  "Executive authorization delay",
  "Market conditions shift",
];

const ALL_DEFENSIVE = [
  ...DOMAIN_CONFIG.resilience.protocols,
  ...DOMAIN_CONFIG.growth.protocols.slice(0, 4),
  ...DOMAIN_CONFIG.transformation.protocols.slice(0, 3),
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR + 1];
const QUARTERS: QLabel[] = ["Q1", "Q2", "Q3", "Q4"];

function uid() { return Math.random().toString(36).slice(2, 9); }

function domainBadge(d: Domain) {
  const cfg = DOMAIN_CONFIG[d];
  return (
    <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: "3px 10px", ...BR }}>
      {cfg.label}
    </span>
  );
}

function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 28, height: 28, ...BR, border: `2px solid ${done ? TEAL : active ? GOLD : BORDER}`, background: done ? TEAL : active ? "rgba(201,168,76,0.15)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s" }}>
        {done ? <CheckCircle2 size={14} color="#fff" /> : <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: active ? GOLD : MUTED }}>{n}</span>}
      </div>
    </div>
  );
}

export default function QuarterlyReadinessPlanning() {
  const [step, setStep] = useState(1);
  const [quarter, setQuarter] = useState<QLabel>("Q3");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [themes, setThemes] = useState<string[]>(["", "", ""]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [activeDomain, setActiveDomain] = useState<Domain>("growth");
  const [newInit, setNewInit] = useState<Partial<Initiative>>({ domain: "growth", defensiveCoverage: [], drillScheduled: false, drillDate: "" });
  const [addingDefense, setAddingDefense] = useState<string | null>(null);
  const [newDef, setNewDef] = useState<Partial<DefensiveCoverage>>({});

  const { data: templateData } = useQuery<any[]>({ queryKey: ["/api/playbooks/templates"] });

  const byDomain = useMemo(() => ({
    growth: initiatives.filter(i => i.domain === "growth"),
    resilience: initiatives.filter(i => i.domain === "resilience"),
    transformation: initiatives.filter(i => i.domain === "transformation"),
  }), [initiatives]);

  const totalDrills = initiatives.filter(i => i.drillScheduled).length;
  const totalDefensive = initiatives.reduce((s, i) => s + i.defensiveCoverage.length, 0);
  const coverageScore = initiatives.length === 0 ? 0 : Math.round(
    (initiatives.filter(i => i.activationProtocol && i.defensiveCoverage.length > 0 && i.drillScheduled).length / initiatives.length) * 100
  );

  function addInitiative() {
    if (!newInit.title?.trim() || !newInit.owner?.trim() || !newInit.activationProtocol) return;
    const init: Initiative = {
      id: uid(),
      domain: newInit.domain as Domain ?? "growth",
      title: newInit.title!,
      description: newInit.description ?? "",
      owner: newInit.owner!,
      targetDate: newInit.targetDate ?? "",
      budget: newInit.budget ?? "",
      activationProtocol: newInit.activationProtocol!,
      defensiveCoverage: [],
      drillScheduled: false,
      drillDate: "",
    };
    setInitiatives(prev => [...prev, init]);
    setNewInit({ domain: activeDomain, defensiveCoverage: [], drillScheduled: false, drillDate: "" });
  }

  function removeInitiative(id: string) { setInitiatives(prev => prev.filter(i => i.id !== id)); }

  function addDefensiveCoverage(initId: string) {
    if (!newDef.scenario || !newDef.protocol) return;
    setInitiatives(prev => prev.map(i => i.id === initId ? {
      ...i, defensiveCoverage: [...i.defensiveCoverage, { id: uid(), scenario: newDef.scenario!, protocol: newDef.protocol! }]
    } : i));
    setNewDef({});
    setAddingDefense(null);
  }

  function removeDefense(initId: string, defId: string) {
    setInitiatives(prev => prev.map(i => i.id === initId ? { ...i, defensiveCoverage: i.defensiveCoverage.filter(d => d.id !== defId) } : i));
  }

  function toggleDrill(initId: string, date: string) {
    setInitiatives(prev => prev.map(i => i.id === initId ? { ...i, drillScheduled: !i.drillScheduled, drillDate: date } : i));
  }

  const SL = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 24, height: 1.5, background: GOLD }} />
      <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: GOLD }}>{children}</span>
    </div>
  );

  return (
    <PageLayout>
      <div style={{ background: "#fff", fontFamily: "'Barlow', sans-serif" }}>

        {/* ── Hero ── */}
        <div style={{ background: NAVY_B, padding: "64px 48px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />
          <div style={{ position: "absolute", top: -80, right: -40, width: 500, height: 500, background: "radial-gradient(ellipse,rgba(43,138,110,0.16) 0%,transparent 65%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <SL>Quarterly Readiness Planning</SL>
            <h1 style={{ ...CG, fontSize: "clamp(36px,4.5vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 16, maxWidth: 720 }}>
              This quarter, prepare for what's planned<br />
              <em style={{ color: GOLD }}>and what's not.</em>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              A prepared organization does not improvise. Every initiative — planned or triggered — gets a pre-staged protocol, protective coverage, and a situational drill before the quarter starts. That is what readiness looks like.
            </p>
            {/* Step Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {[
                { n: 1, label: "Quarter Setup" },
                { n: 2, label: "Stage Initiatives" },
                { n: 3, label: "Risk Coverage" },
                { n: 4, label: "Q Readiness Brief" },
              ].map(({ n, label }, idx) => (
                <div key={n} style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => n < step || n === step ? null : null}
                    style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "default", padding: "8px 12px", opacity: n > step ? 0.45 : 1 }}
                  >
                    <StepDot n={n} active={step === n} done={step > n} />
                    <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: step === n ? GOLD : step > n ? TEAL : "rgba(255,255,255,0.45)" }}>
                      {label}
                    </span>
                  </button>
                  {idx < 3 && <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.15)" }} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 32px 96px" }}>

          {/* ── STEP 1: Quarter Setup ── */}
          {step === 1 && (
            <div>
              <SL>Step 1 of 4</SL>
              <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: NAVY, marginBottom: 8, lineHeight: 1.1 }}>
                Set your quarter.
              </h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 48, maxWidth: 560 }}>
                Name the period and the 3 strategic themes that define it. Every protocol staged this session will be anchored to this quarter's context.
              </p>

              {/* Quarter + Year */}
              <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
                {QUARTERS.map(q => (
                  <button key={q} onClick={() => setQuarter(q)} style={{ ...BC, ...BR, padding: "12px 28px", fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", border: `2px solid ${quarter === q ? GOLD : BORDER}`, background: quarter === q ? "rgba(201,168,76,0.1)" : "#fff", color: quarter === q ? GOLD : NAVY, cursor: "pointer", transition: "all 0.18s" }}>
                    {q}
                  </button>
                ))}
                <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ ...BC, ...BR, padding: "12px 20px", fontSize: 15, fontWeight: 700, border: `2px solid ${BORDER}`, color: NAVY, cursor: "pointer", background: "#fff" }}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Strategic themes */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                  Strategic Themes — {quarter} {year}
                </div>
                <p style={{ fontSize: 14, color: MUTED, marginBottom: 20, lineHeight: 1.6 }}>
                  What are the 2–3 strategic priorities this organization is pursuing this quarter? These anchor every protocol you stage.
                </p>
                {themes.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD, width: 20, textAlign: "center" }}>{i + 1}</div>
                    <input
                      value={t}
                      onChange={e => setThemes(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                      placeholder={["e.g. Accelerate market share in financial services", "e.g. Reduce supply chain concentration risk", "e.g. Complete ERP modernization"][i]}
                      style={{ flex: 1, ...BR, border: `1px solid ${BORDER}`, padding: "12px 16px", fontSize: 14, color: NAVY, outline: "none", fontFamily: "inherit" }}
                    />
                  </div>
                ))}
              </div>

              {/* Preparation mandate callout */}
              <div style={{ background: IVORY, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, padding: "24px 28px", marginBottom: 48 }}>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>Your Preparation Mandate</div>
                <p style={{ fontSize: 14, color: NAVY, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                  In the next three steps you will stage every initiative this quarter — planned and unplanned. For each planned initiative, you will select the activation protocol and pre-stage the protective coverage for what could disrupt it. Then schedule the drills. At the end, your <strong>{quarter} {year}</strong> is fully staged — planned initiatives and unplanned scenarios — ready before the quarter starts.
                </p>
              </div>

              <button onClick={() => setStep(2)} style={{ ...BC, ...BR, display: "inline-flex", alignItems: "center", gap: 10, background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "14px 32px", border: "none", cursor: "pointer" }}>
                Stage Initiatives <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Stage Initiatives ── */}
          {step === 2 && (
            <div>
              <SL>Step 2 of 4 — {quarter} {year}</SL>
              <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: NAVY, marginBottom: 8, lineHeight: 1.1 }}>
                Stage your planned initiatives.
              </h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 36, maxWidth: 600 }}>
                For each initiative this quarter, select the Readiness Protocol that activates it. Planned work runs through the same protocol infrastructure as unplanned triggers — same stakeholders, same task assignments, same authorization flow.
              </p>

              {/* Domain tabs */}
              <div style={{ display: "flex", gap: 0, marginBottom: 36, borderBottom: `1px solid ${BORDER}` }}>
                {(["growth", "resilience", "transformation"] as Domain[]).map(d => {
                  const cfg = DOMAIN_CONFIG[d];
                  const count = byDomain[d].length;
                  return (
                    <button key={d} onClick={() => { setActiveDomain(d); setNewInit({ domain: d, defensiveCoverage: [], drillScheduled: false, drillDate: "" }); }}
                      style={{ ...BC, padding: "12px 20px", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", border: "none", borderBottom: activeDomain === d ? `2px solid ${cfg.color}` : "2px solid transparent", background: "none", color: activeDomain === d ? cfg.color : MUTED, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: -1 }}>
                      {cfg.label}
                      {count > 0 && <span style={{ background: cfg.color, color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{count}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Existing initiatives for this domain */}
              {byDomain[activeDomain].length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  {byDomain[activeDomain].map(init => (
                    <div key={init.id} style={{ border: `1px solid ${DOMAIN_CONFIG[init.domain].border}`, background: DOMAIN_CONFIG[init.domain].bg, ...BR, padding: "20px 24px", marginBottom: 12, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>{domainBadge(init.domain)}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{init.title}</div>
                        <div style={{ fontSize: 12, color: MUTED, display: "flex", gap: 20, flexWrap: "wrap" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><User size={11} />{init.owner}</span>
                          {init.targetDate && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Calendar size={11} />{init.targetDate}</span>}
                          {init.budget && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><DollarSign size={11} />{init.budget}</span>}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 12, color: TEAL, display: "flex", alignItems: "center", gap: 6 }}>
                          <BookOpen size={11} />{init.activationProtocol}
                        </div>
                      </div>
                      <button onClick={() => removeInitiative(init.id)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new initiative */}
              <div style={{ border: `1px solid ${BORDER}`, ...BR, padding: "28px 24px", background: "#fafafa" }}>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: DOMAIN_CONFIG[activeDomain].color, marginBottom: 16 }}>
                  <Plus size={12} style={{ display: "inline", marginRight: 6 }} />Add Initiative — {DOMAIN_CONFIG[activeDomain].label}
                </div>
                <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, lineHeight: 1.6 }}>{DOMAIN_CONFIG[activeDomain].hint}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, display: "block", marginBottom: 6 }}>Initiative Title *</label>
                    <input value={newInit.title ?? ""} onChange={e => setNewInit(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Southeast Asia Market Entry" style={{ width: "100%", ...BR, border: `1px solid ${BORDER}`, padding: "10px 12px", fontSize: 13, color: NAVY, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, display: "block", marginBottom: 6 }}>Initiative Owner *</label>
                    <input value={newInit.owner ?? ""} onChange={e => setNewInit(p => ({ ...p, owner: e.target.value }))} placeholder="e.g. Chief Strategy Officer" style={{ width: "100%", ...BR, border: `1px solid ${BORDER}`, padding: "10px 12px", fontSize: 13, color: NAVY, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, display: "block", marginBottom: 6 }}>Target Date</label>
                    <input type="month" value={newInit.targetDate ?? ""} onChange={e => setNewInit(p => ({ ...p, targetDate: e.target.value }))} style={{ width: "100%", ...BR, border: `1px solid ${BORDER}`, padding: "10px 12px", fontSize: 13, color: NAVY, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, display: "block", marginBottom: 6 }}>Budget Allocation</label>
                    <input value={newInit.budget ?? ""} onChange={e => setNewInit(p => ({ ...p, budget: e.target.value }))} placeholder="e.g. $2.4M" style={{ width: "100%", ...BR, border: `1px solid ${BORDER}`, padding: "10px 12px", fontSize: 13, color: NAVY, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, display: "block", marginBottom: 6 }}>Activation Protocol *</label>
                  <select value={newInit.activationProtocol ?? ""} onChange={e => setNewInit(p => ({ ...p, activationProtocol: e.target.value }))} style={{ width: "100%", ...BR, border: `1px solid ${BORDER}`, padding: "10px 12px", fontSize: 13, color: newInit.activationProtocol ? NAVY : MUTED, outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}>
                    <option value="">Select the Readiness Protocol for this initiative…</option>
                    {DOMAIN_CONFIG[activeDomain].protocols.map(p => <option key={p} value={p}>{p}</option>)}
                    <option value="Custom Protocol">Custom Protocol (configure in Protocol Library)</option>
                  </select>
                </div>

                <button
                  onClick={addInitiative}
                  disabled={!newInit.title?.trim() || !newInit.owner?.trim() || !newInit.activationProtocol}
                  style={{ ...BC, ...BR, display: "inline-flex", alignItems: "center", gap: 8, background: newInit.title?.trim() && newInit.owner?.trim() && newInit.activationProtocol ? DOMAIN_CONFIG[activeDomain].color : BORDER, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "11px 24px", border: "none", cursor: newInit.title?.trim() && newInit.owner?.trim() && newInit.activationProtocol ? "pointer" : "not-allowed" }}>
                  <Plus size={13} /> Stage Initiative
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40 }}>
                <button onClick={() => setStep(1)} style={{ ...BC, ...BR, background: "none", border: `1px solid ${BORDER}`, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "11px 24px", cursor: "pointer" }}>← Back</button>
                <button onClick={() => { if (initiatives.length > 0) setStep(3); }} disabled={initiatives.length === 0} style={{ ...BC, ...BR, display: "inline-flex", alignItems: "center", gap: 10, background: initiatives.length > 0 ? GOLD : BORDER, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "14px 32px", border: "none", cursor: initiatives.length > 0 ? "pointer" : "not-allowed" }}>
                  Add Risk Coverage <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Defensive Coverage ── */}
          {step === 3 && (
            <div>
              <SL>Step 3 of 4 — {quarter} {year}</SL>
              <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: NAVY, marginBottom: 8, lineHeight: 1.1 }}>
                Pre-stage your risk coverage.
              </h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 16, maxWidth: 640 }}>
                For each planned initiative, identify what could disrupt it and pre-stage the protective protocol. Disruptions do not announce themselves — they are pre-empted by organizations that prepare before the trigger fires.
              </p>
              <div style={{ background: IVORY, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`, padding: "16px 20px", marginBottom: 40, ...BR }}>
                <span style={{ fontSize: 13, color: NAVY, lineHeight: 1.6, fontWeight: 500 }}>
                  Schedule a situational drill for each initiative before <strong>{quarter} {year}</strong> starts. A drill validates your response is truly staged — not just documented.
                </span>
              </div>

              {initiatives.map(init => {
                const cfg = DOMAIN_CONFIG[init.domain];
                const isAddingDef = addingDefense === init.id;
                return (
                  <div key={init.id} style={{ border: `1px solid ${cfg.border}`, ...BR, marginBottom: 24, overflow: "hidden" }}>
                    {/* Initiative header */}
                    <div style={{ background: cfg.bg, padding: "18px 24px", borderBottom: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ marginBottom: 4 }}>{domainBadge(init.domain)}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{init.title}</div>
                        <div style={{ fontSize: 12, color: TEAL, marginTop: 4 }}><BookOpen size={11} style={{ display: "inline", marginRight: 4 }} />{init.activationProtocol}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {init.drillScheduled
                          ? <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, background: "rgba(43,138,110,0.1)", border: `1px solid rgba(43,138,110,0.3)`, padding: "4px 10px", ...BR }}>✓ Drill Staged</span>
                          : <button onClick={() => { const d = prompt("Drill date (e.g. 2026-07-15):"); if (d) toggleDrill(init.id, d); }} style={{ ...BC, ...BR, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", border: `1px solid ${GOLD}`, color: GOLD, background: "none", padding: "4px 12px", cursor: "pointer" }}>Schedule Drill</button>
                        }
                      </div>
                    </div>

                    <div style={{ padding: "20px 24px" }}>
                      {/* Existing defensive coverage */}
                      {init.defensiveCoverage.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          {init.defensiveCoverage.map(d => (
                            <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(192,57,43,0.05)", border: "1px solid rgba(192,57,43,0.15)", ...BR, marginBottom: 8 }}>
                              <div>
                                <div style={{ fontSize: 12, color: "#C0392B", fontWeight: 700, marginBottom: 2 }}><AlertTriangle size={11} style={{ display: "inline", marginRight: 5 }} />{d.scenario}</div>
                                <div style={{ fontSize: 11, color: MUTED }}><Shield size={10} style={{ display: "inline", marginRight: 4 }} />{d.protocol}</div>
                              </div>
                              <button onClick={() => removeDefense(init.id, d.id)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2 }}><Trash2 size={12} /></button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add defensive coverage */}
                      {isAddingDef ? (
                        <div style={{ border: `1px solid ${BORDER}`, ...BR, padding: "16px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                            <div>
                              <label style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, display: "block", marginBottom: 6 }}>Disruption Scenario</label>
                              <select value={newDef.scenario ?? ""} onChange={e => setNewDef(p => ({ ...p, scenario: e.target.value }))} style={{ width: "100%", ...BR, border: `1px solid ${BORDER}`, padding: "9px 12px", fontSize: 13, color: newDef.scenario ? NAVY : MUTED, background: "#fff", fontFamily: "inherit", boxSizing: "border-box" }}>
                                <option value="">Select scenario…</option>
                                {DEFENSIVE_SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, display: "block", marginBottom: 6 }}>Protective Protocol</label>
                              <select value={newDef.protocol ?? ""} onChange={e => setNewDef(p => ({ ...p, protocol: e.target.value }))} style={{ width: "100%", ...BR, border: `1px solid ${BORDER}`, padding: "9px 12px", fontSize: 13, color: newDef.protocol ? NAVY : MUTED, background: "#fff", fontFamily: "inherit", boxSizing: "border-box" }}>
                                <option value="">Select protocol…</option>
                                {ALL_DEFENSIVE.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => addDefensiveCoverage(init.id)} disabled={!newDef.scenario || !newDef.protocol} style={{ ...BC, ...BR, background: newDef.scenario && newDef.protocol ? "#C0392B" : BORDER, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "9px 20px", border: "none", cursor: newDef.scenario && newDef.protocol ? "pointer" : "not-allowed" }}>Add Coverage</button>
                            <button onClick={() => { setAddingDefense(null); setNewDef({}); }} style={{ ...BC, ...BR, background: "none", border: `1px solid ${BORDER}`, color: MUTED, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "9px 20px", cursor: "pointer" }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => { setAddingDefense(init.id); setNewDef({}); }} style={{ ...BC, ...BR, display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: `1px dashed ${BORDER}`, color: MUTED, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "9px 20px", cursor: "pointer" }}>
                          <Plus size={12} /> Add Disruption Scenario
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40 }}>
                <button onClick={() => setStep(2)} style={{ ...BC, ...BR, background: "none", border: `1px solid ${BORDER}`, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "11px 24px", cursor: "pointer" }}>← Back</button>
                <button onClick={() => setStep(4)} style={{ ...BC, ...BR, display: "inline-flex", alignItems: "center", gap: 10, background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "14px 32px", border: "none", cursor: "pointer" }}>
                  Generate Q Brief <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Q Readiness Brief ── */}
          {step === 4 && (
            <div>
              <SL>Q Readiness Brief — {quarter} {year}</SL>
              <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: NAVY, marginBottom: 8, lineHeight: 1.1 }}>
                Your quarter is staged.
              </h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 40, maxWidth: 600 }}>
                Both planned and unplanned. Protocols assigned. Risk coverage pre-staged. The response is ready before the trigger fires.
              </p>

              {/* Coverage score */}
              <div style={{ background: NAVY, padding: "40px 48px", ...BR, marginBottom: 40, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)`, backgroundSize: "32px 32px" }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>Readiness Coverage Score — {quarter} {year}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
                    {[
                      { v: initiatives.length, l: "Initiatives Staged", s: "planned + unplanned" },
                      { v: totalDefensive, l: "Risk Protocols", s: "pre-staged" },
                      { v: totalDrills, l: "Drills Scheduled", s: "before Q starts" },
                      { v: `${coverageScore}%`, l: "Full Coverage", s: "protocol + risk coverage + drill" },
                    ].map(({ v, l, s }) => (
                      <div key={l}>
                        <div style={{ ...CG, fontSize: "clamp(32px,4vw,48px)", fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 6 }}>{v}</div>
                        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#fff", marginBottom: 4 }}>{l}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Themes */}
              {themes.some(t => t.trim()) && (
                <div style={{ marginBottom: 40 }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Strategic Themes — {quarter} {year}</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {themes.filter(t => t.trim()).map((t, i) => (
                      <div key={i} style={{ background: IVORY, border: `1px solid ${BORDER}`, ...BR, padding: "10px 18px", fontSize: 13, color: NAVY, fontWeight: 500 }}>{t}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Initiatives by domain */}
              {(["growth", "resilience", "transformation"] as Domain[]).map(d => {
                const items = byDomain[d];
                if (items.length === 0) return null;
                const cfg = DOMAIN_CONFIG[d];
                const Icon = cfg.icon;
                return (
                  <div key={d} style={{ marginBottom: 36 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <Icon size={16} color={cfg.color} />
                      <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: cfg.color }}>{cfg.label}</span>
                      <div style={{ flex: 1, height: 1, background: BORDER }} />
                      <span style={{ ...BC, fontSize: 10, color: MUTED }}>{items.length} initiative{items.length > 1 ? "s" : ""}</span>
                    </div>
                    {items.map(init => (
                      <div key={init.id} style={{ border: `1px solid ${BORDER}`, ...BR, padding: "20px 24px", marginBottom: 12, background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{init.title}</div>
                            <div style={{ fontSize: 12, color: MUTED, display: "flex", gap: 20, flexWrap: "wrap" }}>
                              {init.owner && <span><User size={10} style={{ display: "inline", marginRight: 3 }} />{init.owner}</span>}
                              {init.targetDate && <span><Calendar size={10} style={{ display: "inline", marginRight: 3 }} />{init.targetDate}</span>}
                              {init.budget && <span><DollarSign size={10} style={{ display: "inline", marginRight: 3 }} />{init.budget}</span>}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, background: "rgba(43,138,110,0.1)", border: "1px solid rgba(43,138,110,0.25)", padding: "3px 8px", ...BR }}>✓ Protocol Staged</span>
                            {init.defensiveCoverage.length > 0 && <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C0392B", background: "rgba(192,57,43,0.07)", border: "1px solid rgba(192,57,43,0.2)", padding: "3px 8px", ...BR }}>{init.defensiveCoverage.length} Risk Protocol{init.defensiveCoverage.length > 1 ? "s" : ""}</span>}
                            {init.drillScheduled && <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", padding: "3px 8px", ...BR }}>✓ Drill Set</span>}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: TEAL, marginBottom: init.defensiveCoverage.length > 0 ? 10 : 0 }}>
                          <BookOpen size={11} style={{ display: "inline", marginRight: 5 }} />{init.activationProtocol}
                        </div>
                        {init.defensiveCoverage.length > 0 && (
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {init.defensiveCoverage.map(def => (
                              <div key={def.id} style={{ fontSize: 11, color: "#C0392B", background: "rgba(192,57,43,0.05)", border: "1px solid rgba(192,57,43,0.15)", padding: "4px 10px", ...BR }}>
                                <AlertTriangle size={10} style={{ display: "inline", marginRight: 4 }} />{def.scenario}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Final quote + CTAs */}
              <div style={{ background: NAVY, padding: "40px 48px", ...BR, marginTop: 48, marginBottom: 40 }}>
                <p style={{ ...CG, fontSize: "clamp(20px,2.5vw,28px)", fontStyle: "italic", color: "#fff", lineHeight: 1.55, margin: "0 0 16px", maxWidth: 640 }}>
                  "The response is ready before the trigger fires. That is not a promise about the future — it is a statement about what you just built."
                </p>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>
                  {quarter} {year} · {initiatives.length} Initiatives Staged · Readiness OS
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/playbook-library" style={{ ...BC, ...BR, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", textDecoration: "none" }}>
                  Open Protocol Library <ArrowRight size={14} />
                </Link>
                <Link href="/practice-drills" style={{ ...BC, ...BR, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", textDecoration: "none", border: `1px solid ${BORDER}` }}>
                  Schedule Drills <Calendar size={14} />
                </Link>
                <button onClick={() => { setStep(1); setInitiatives([]); setThemes(["","",""]); }} style={{ ...BC, ...BR, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: MUTED, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", border: `1px solid ${BORDER}`, cursor: "pointer" }}>
                  Plan Next Quarter <BarChart3 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
