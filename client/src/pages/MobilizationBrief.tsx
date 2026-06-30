import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import StandardNav from "@/components/layout/StandardNav";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const MUTED = "#4B5563";

const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BC = { fontFamily: "'Barlow Condensed', sans-serif" };
const BW = { fontFamily: "'Barlow', Arial, sans-serif" };

function GoldRule() {
  return <div style={{ width: 40, height: 2, background: GOLD, margin: "12px 0 20px" }} />;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>
      {children}
    </div>
  );
}

function AlgorithmBlock({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid rgba(10,15,46,0.08)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 20 }}>
        <div style={{ flexShrink: 0, width: 48, height: 48, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ ...BC, fontSize: 14, fontWeight: 800, color: GOLD, letterSpacing: "0.04em" }}>{number}</span>
        </div>
        <div>
          <h2 style={{ ...CG, fontSize: 26, fontWeight: 700, color: NAVY, margin: "0 0 4px", lineHeight: 1.2 }}>{title}</h2>
          <p style={{ ...BW, fontSize: 13, color: MUTED, fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function FormulaBox({ formula, label }: { formula: string; label: string }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column" as const, alignItems: "center", padding: "16px 32px", border: `2px solid ${GOLD}`, background: "rgba(201,168,76,0.05)", margin: "16px 0 20px", gap: 6 }}>
      <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: NAVY, letterSpacing: "-0.01em" }}>{formula}</div>
      <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD }}>{label}</div>
    </div>
  );
}

function DataRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(10,15,46,0.06)" }}>
      <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: MUTED, minWidth: 200, flexShrink: 0 }}>{label}</div>
      <div style={{ ...BW, fontSize: 14, fontWeight: 700, color: NAVY, flex: 1 }}>{value}</div>
      {note && <div style={{ ...BW, fontSize: 12, color: MUTED, fontStyle: "italic" as const }}>{note}</div>}
    </div>
  );
}

function ThresholdBar({ label, range, color, description }: { label: string; range: string; color: string; description: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid rgba(10,15,46,0.06)" }}>
      <div style={{ width: 10, height: 10, background: color, flexShrink: 0 }} />
      <div style={{ ...BC, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" as const, color, minWidth: 80 }}>{label}</div>
      <div style={{ ...BW, fontSize: 13, fontWeight: 700, color: NAVY, minWidth: 100 }}>{range}</div>
      <div style={{ ...BW, fontSize: 13, color: MUTED, fontWeight: 500 }}>{description}</div>
    </div>
  );
}

export default function MobilizationBrief() {
  useEffect(() => {
    updatePageMetadata({
      title: "Mobilization Intelligence Brief | Readiness OS — VaughnMartin",
      description: "Technical specification of the Readiness OS mobilization algorithms: signal detection, risk scoring, trigger matching, and the 12-minute execution chain.",
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Barlow', Arial, sans-serif" }}>
      <StandardNav />

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 0.75in; size: letter; }
        }
        @media screen {
          .brief-container { max-width: 900px; margin: 0 auto; }
        }
      `}</style>

      {/* ── HEADER (navy) ── */}
      <div style={{ background: NAVY, padding: "48px 56px 40px" }}>
        <div className="brief-container">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap" as const }}>
            <div>
              <div style={{ marginBottom: 24 }}>
                <VaughnMartinLogo size="sm" theme="dark" />
              </div>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>
                Technical Intelligence Brief
              </div>
              <h1 style={{ ...CG, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, margin: "0 0 12px" }}>
                Mobilization Intelligence<br />Architecture
              </h1>
              <p style={{ ...BW, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6, maxWidth: 460 }}>
                The algorithmic specification for how Readiness OS detects strategic situations, scores risk, matches Readiness Protocols, and executes a coordinated response in 12 minutes.
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <div style={{ padding: "20px 28px", border: `1px solid rgba(201,168,76,0.3)`, background: "rgba(201,168,76,0.07)" }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.7)", marginBottom: 10 }}>Classification</div>
                {[
                  { label: "Protocols", value: "180" },
                  { label: "Detection Thresholds", value: "231" },
                  { label: "Signal Sources", value: "36 active" },
                  { label: "Target Response", value: "12 minutes" },
                  { label: "Head Start", value: "3,600×" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 6 }}>
                    <span style={{ ...BC, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const }}>{item.label}</span>
                    <span style={{ ...BC, fontSize: 12, fontWeight: 800, color: GOLD }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Print + share bar */}
          <div className="no-print" style={{ marginTop: 32, display: "flex", gap: 12 }}>
            <button
              onClick={() => window.print()}
              style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, padding: "12px 24px", background: GOLD, color: NAVY, border: "none", cursor: "pointer" }}
            >
              Print / Export PDF
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); }}
              style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, padding: "12px 24px", background: "transparent", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* ── GOLD RULE ── */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${GOLD}, ${TEAL})` }} />

      {/* ── BODY ── */}
      <div style={{ padding: "56px 56px 80px", background: "#fff" }}>
        <div className="brief-container">

          {/* ── PREAMBLE ── */}
          <div style={{ marginBottom: 48, padding: "24px 32px", background: IVORY, borderLeft: `4px solid ${GOLD}` }}>
            <SectionLabel>The Mobilization Tax — Defined</SectionLabel>
            <p style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, lineHeight: 1.45, margin: "0 0 12px" }}>
              The Mobilization Tax is the compulsory cost every organization pays between "we know" and "we are executing."
            </p>
            <p style={{ ...BW, fontSize: 14, color: MUTED, lineHeight: 1.7, margin: 0 }}>
              In every uncoordinated enterprise, when a strategic trigger fires — an activist investor, a ransomware attack, a regulatory inquiry, a supply chain collapse — the organization must first spend 30 days mobilizing: assembling the right people, aligning on a plan, establishing authority, sequencing communications, and staging execution. That mobilization cycle is not a time-management problem. It is a structural absence of coordination infrastructure. Readiness OS eliminates the Mobilization Tax by making the response ready before the trigger fires.
            </p>
          </div>

          {/* ── ALGORITHM 01 — SIGNAL DETECTION ── */}
          <AlgorithmBlock
            number="01"
            title="Signal Detection Engine"
            subtitle="Continuous ingestion, normalization, and scoring of strategic intelligence across 36 active sources"
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
              <div>
                <SectionLabel>Ingestion Parameters</SectionLabel>
                <DataRow label="Sources Active" value="36 RSS/API feeds" note="news, regulatory, financial" />
                <DataRow label="Ingestion Cadence" value="Every 15 minutes" note="continuous background scan" />
                <DataRow label="Detection Thresholds" value="231 defined thresholds" note="across all strategic domains" />
                <DataRow label="Scoring Dimensions" value="16 per signal" note="relevance, urgency, source weight" />
                <DataRow label="Cache Depth" value="500 URLs" note="deduplication window" />
              </div>
              <div>
                <SectionLabel>Signal Scoring Factors</SectionLabel>
                {[
                  { factor: "Source Authority Weight", desc: "Tier-1 sources (Reuters, WSJ, FT) score higher than aggregators" },
                  { factor: "Keyword Density Match", desc: "Semantic match against 231 detection threshold vocabularies" },
                  { factor: "Temporal Urgency Decay", desc: "Recency-weighted; signals devalue over 4-hour half-life" },
                  { factor: "Cross-Source Corroboration", desc: "Multi-source confirmation amplifies confidence score" },
                  { factor: "Domain Specificity", desc: "Signals matched to organization's configured trigger domains" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(10,15,46,0.06)" }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: NAVY, marginBottom: 2 }}>{item.factor}</div>
                    <div style={{ ...BW, fontSize: 12, color: MUTED, fontWeight: 500 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "16px 20px", background: "rgba(43,138,110,0.06)", borderLeft: `3px solid ${TEAL}` }}>
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: TEAL }}>Output: </span>
              <span style={{ ...BW, fontSize: 13, color: MUTED, fontWeight: 500 }}>Each ingestion cycle produces a scored signal set. Signals above the confidence threshold enter the active trigger evaluation queue. Signals below threshold are logged but do not activate protocol matching.</span>
            </div>
          </AlgorithmBlock>

          {/* ── ALGORITHM 02 — RISK SCORING ── */}
          <AlgorithmBlock
            number="02"
            title="Risk Scoring Algorithm"
            subtitle="Square-root scaling model that converts signal volume into a normalized 0–100 organizational risk score"
          >
            <div style={{ textAlign: "center" as const, marginBottom: 24 }}>
              <FormulaBox formula="Risk Score = √(signal_count) × 8" label="Core Risk Formula" />
              <p style={{ ...BW, fontSize: 13, color: MUTED, maxWidth: 560, margin: "0 auto 16px", lineHeight: 1.65 }}>
                Square-root scaling prevents linear amplification from signal floods (e.g., media saturation during a known crisis). The ×8 coefficient normalizes the output to the 0–100 range across observed signal volumes of 0–156 correlated signals.
              </p>
            </div>

            <SectionLabel>Risk Classification Thresholds</SectionLabel>
            <ThresholdBar label="LOW" range="Score 0–34" color="#22C55E" description="Monitoring posture. Protocols pre-staged. No activation required." />
            <ThresholdBar label="MEDIUM" range="Score 35–74" color={GOLD} description="Elevated posture. Executive notification triggered. Protocol review recommended." />
            <ThresholdBar label="HIGH" range="Score 75–100" color="#DC3C32" description="Active threat posture. Protocol activation queue surfaced to executive dashboard. 12-minute chain available." />

            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { signals: 1, score: "8", level: "LOW" },
                { signals: 9, score: "24", level: "LOW" },
                { signals: 25, score: "40", level: "MEDIUM" },
                { signals: 49, score: "56", level: "MEDIUM" },
                { signals: 81, score: "72", level: "MEDIUM" },
                { signals: 100, score: "80+", level: "HIGH" },
              ].map((row) => (
                <div key={row.signals} style={{ padding: "12px 16px", border: "1px solid rgba(10,15,46,0.08)", textAlign: "center" as const }}>
                  <div style={{ ...BW, fontSize: 11, color: MUTED, marginBottom: 4 }}>{row.signals} signals</div>
                  <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: NAVY }}>{row.score}</div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: row.level === "HIGH" ? "#DC3C32" : row.level === "MEDIUM" ? GOLD : "#22C55E" }}>{row.level}</div>
                </div>
              ))}
            </div>
          </AlgorithmBlock>

          {/* ── ALGORITHM 03 — TRIGGER MATCHING ── */}
          <AlgorithmBlock
            number="03"
            title="Trigger → Protocol Matching"
            subtitle="Semantic and categorical matching that maps a detected signal cluster to the optimal Readiness Protocol from the 180-protocol library"
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <SectionLabel>Matching Inputs</SectionLabel>
                {[
                  { label: "Signal Cluster", desc: "Grouped signals from the same event horizon (15-min window)" },
                  { label: "Situation Classification", desc: "One of 231 named detection thresholds (ransomware, activist, recall, etc.)" },
                  { label: "Domain Tag", desc: "GROWTH & POSITIONING, RISK & RESILIENCE, or TRANSFORMATION" },
                  { label: "Org Context", desc: "Industry sector, configured trigger domains, historical activations" },
                  { label: "Compound Flag", desc: "Multi-domain triggers activate 2+ protocols simultaneously" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(10,15,46,0.06)" }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: NAVY, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ ...BW, fontSize: 12, color: MUTED, fontWeight: 500 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <div>
                <SectionLabel>Protocol Library Structure</SectionLabel>
                {[
                  { label: "Core Protocols", value: "180", desc: "Cross-industry foundational protocols" },
                  { label: "Compound Protocols", value: "30", desc: "IDs 181–210 — simultaneous multi-domain activations" },
                  { label: "Domain Split", value: "60 / 60 / 60", desc: "Growth / Risk / Transformation" },
                  { label: "Industry Packs", value: "6 sector packs", desc: "Layered on top of core library" },
                  { label: "Match Confidence", value: "0.0–1.0", desc: "Displayed as Signal Confidence in UI" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(10,15,46,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                      <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: NAVY }}>{item.label}</div>
                      <div style={{ ...BC, fontSize: 12, fontWeight: 800, color: GOLD }}>{item.value}</div>
                    </div>
                    <div style={{ ...BW, fontSize: 12, color: MUTED, fontWeight: 500 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(201,168,76,0.05)", borderLeft: `3px solid ${GOLD}` }}>
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD }}>Compound Trigger Logic: </span>
              <span style={{ ...BW, fontSize: 13, color: MUTED, fontWeight: 500 }}>When a signal cluster matches patterns across two or more strategic domains simultaneously, the engine activates a Compound Protocol (IDs 181–210). Example: Activist Investor + Regulatory Inquiry fires both a GROWTH & POSITIONING protocol and a RISK & RESILIENCE protocol in parallel, with a unified stakeholder authorization chain.</span>
            </div>
          </AlgorithmBlock>

          {/* ── ALGORITHM 04 — IDEA FRAMEWORK ── */}
          <AlgorithmBlock
            number="04"
            title="The IDEA Execution Chain"
            subtitle="The 4-phase execution framework that compresses 30 days of mobilization into 12 minutes — the core algorithmic architecture"
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 20 }}>
              {[
                { phase: "I", name: "Identify", time: "0–2 min", color: GOLD, steps: ["Signal detection fires", "Trigger classified", "Risk score computed", "Protocol matched", "Confidence threshold validated"] },
                { phase: "D", name: "Develop", time: "2–5 min", color: TEAL, steps: ["Protocol loaded", "Stakeholder chain staged", "Task tree instantiated", "Budget allocation staged", "Comms templates populated"] },
                { phase: "E", name: "Execute", time: "5–11 min", color: "#DC3C32", steps: ["Executive notified", "Authorization request issued", "Single-decision approval", "Stakeholders activated", "Tasks distributed in parallel"] },
                { phase: "A", name: "Advance", time: "Post-12 min", color: NAVY, steps: ["Activation logged", "Hypothesis generated", "Delta recorded", "Causal learning triggered", "Protocol updated"] },
              ].map((p) => (
                <div key={p.phase} style={{ background: p.color === NAVY ? NAVY : `${p.color}0F`, borderTop: `3px solid ${p.color}`, padding: "20px 16px" }}>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: p.color === NAVY ? GOLD : p.color, lineHeight: 1, marginBottom: 4 }}>{p.phase}</div>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: p.color === NAVY ? "#fff" : NAVY, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 600, color: p.color === NAVY ? "rgba(255,255,255,0.45)" : MUTED, marginBottom: 12, letterSpacing: "0.06em" }}>{p.time}</div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 5 }}>
                    {p.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: p.color === NAVY ? GOLD : p.color, flexShrink: 0, marginTop: 4 }} />
                        <span style={{ ...BW, fontSize: 11, color: p.color === NAVY ? "rgba(255,255,255,0.7)" : MUTED, fontWeight: 500, lineHeight: 1.4 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 20px", background: IVORY, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 4, height: 40, background: GOLD, flexShrink: 0 }} />
              <p style={{ ...BW, fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: NAVY }}>The key algorithmic insight:</strong> phases I, D, and the authorization gateway in E are completed entirely by the system before the executive sees a single notification. By the time the executive receives the authorization request, the full response — stakeholders, tasks, communications, budget — is staged and waiting. The executive authorizes one decision. The 12-minute clock completes.
              </p>
            </div>
          </AlgorithmBlock>

          {/* ── ALGORITHM 05 — VELOCITY SCORING ── */}
          <AlgorithmBlock
            number="05"
            title="Velocity Scoring"
            subtitle="How Readiness OS measures and benchmarks actual response time against the 12-minute standard"
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <SectionLabel>Velocity Score Formula</SectionLabel>
                <DataRow label="Perfect score (≤12 min)" value="100 / 100" />
                <DataRow label="Fast (13–20 min)" value="90 / 100" />
                <DataRow label="Acceptable (21–30 min)" value="80 / 100" />
                <DataRow label="Delayed (31–45 min)" value="70 / 100" />
                <DataRow label="Slow (46–60 min)" value="60 / 100" />
                <DataRow label="Unacceptable (&gt;60 min)" value="40–59 / 100" note="floor: 40" />
              </div>
              <div>
                <SectionLabel>Executive Readiness Score — Composite</SectionLabel>
                <p style={{ ...BW, fontSize: 13, color: MUTED, lineHeight: 1.65, marginBottom: 16 }}>
                  The 0–100 Executive Readiness Score is a weighted composite of four sub-scores derived from live platform data:
                </p>
                {[
                  { label: "Signal Coverage", weight: "25%", desc: "Active signal sources vs. configured domains" },
                  { label: "Protocol Readiness Ratio", weight: "25%", desc: "Ready protocols ÷ total protocols (agility score)" },
                  { label: "Velocity Score", weight: "30%", desc: "Average response time across recent activations" },
                  { label: "Foresight Score", weight: "20%", desc: "60% signal-based + 40% protocol depth composite" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(10,15,46,0.06)" }}>
                    <div style={{ ...BC, fontSize: 11, fontWeight: 800, color: GOLD, minWidth: 36 }}>{item.weight}</div>
                    <div>
                      <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: NAVY }}>{item.label}</div>
                      <div style={{ ...BW, fontSize: 11, color: MUTED, fontWeight: 500 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AlgorithmBlock>

          {/* ── ALGORITHM 06 — ADVANCE 2.0 ── */}
          <AlgorithmBlock
            number="06"
            title="ADVANCE 2.0 — Closed-Loop Causal Learning"
            subtitle="Every activation generates a hypothesis. Every subsequent activation tests it. The system learns what actually makes responses faster."
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
              <div>
                <SectionLabel>Learning Loop Mechanics</SectionLabel>
                {[
                  { step: "1", label: "Activation Close-Out", desc: "applyUpdateWithDelta() mutates protocol record and stores an immutable version delta" },
                  { step: "2", label: "Hypothesis Generation", desc: "Causal hypothesis created: expected outcome expressed as 'expected −N minutes'" },
                  { step: "3", label: "Measurement Trigger", desc: "measureHypothesesForActivation() fires automatically on every close-out completion" },
                  { step: "4", label: "Outcome Classification", desc: "Hypothesis marked proven (delta confirmed) or disproven (no improvement detected)" },
                  { step: "5", label: "Protocol Update Queue", desc: "Low-risk calibrations auto-apply; ownership/protocol changes require executive authorization" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(10,15,46,0.06)" }}>
                    <div style={{ ...BC, fontSize: 11, fontWeight: 800, color: GOLD, flexShrink: 0, minWidth: 20 }}>{item.step}</div>
                    <div>
                      <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: NAVY, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ ...BW, fontSize: 12, color: MUTED, fontWeight: 500 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <SectionLabel>Learning Velocity Index — Metrics</SectionLabel>
                {[
                  { metric: "Updates Applied", desc: "Total protocol mutations from learning loop" },
                  { metric: "Proven Improvements", desc: "Hypotheses confirmed by subsequent activation data" },
                  { metric: "Total Minutes Saved", desc: "Cumulative response time reduction across all proven updates" },
                  { metric: "Evidence Coverage", desc: "% of 180-protocol library with at least one evidence-backed update" },
                  { metric: "Moat Metric", desc: "Months a competitor would need to rebuild equivalent activation history" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(10,15,46,0.06)" }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: NAVY, marginBottom: 2 }}>{item.metric}</div>
                    <div style={{ ...BW, fontSize: 12, color: MUTED, fontWeight: 500 }}>{item.desc}</div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(43,138,110,0.06)", borderLeft: `3px solid ${TEAL}` }}>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 6 }}>Schema</div>
                  <div style={{ ...BW, fontSize: 12, color: MUTED, fontFamily: "'Courier New', monospace" }}>
                    protocol_version_deltas<br />
                    update_hypotheses
                  </div>
                </div>
              </div>
            </div>
          </AlgorithmBlock>

          {/* ── ALGORITHM 07 — THE 3,600× CALCULATION ── */}
          <AlgorithmBlock
            number="07"
            title="The 3,600× Execution Head Start"
            subtitle="The mathematical basis for the canonical metric — not speed, but preparation advantage"
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
              <div>
                <SectionLabel>Calculation</SectionLabel>
                <div style={{ padding: "20px 24px", background: IVORY, marginBottom: 16 }}>
                  <div style={{ ...BW, fontSize: 13, color: MUTED, marginBottom: 12, lineHeight: 1.65 }}>
                    Conservative baseline: 30 days to mobilize a coordinated response from trigger detection to first coordinated action. This is the documented organizational average across Fortune 500 incident reports, not a worst case.
                  </div>
                  <div style={{ ...BW, fontSize: 13, color: MUTED, marginBottom: 12 }}>30 days × 24 hours × 60 minutes = <strong style={{ color: NAVY }}>43,200 minutes</strong></div>
                  <div style={{ ...BW, fontSize: 13, color: MUTED, marginBottom: 16 }}>Readiness OS target: <strong style={{ color: NAVY }}>12 minutes</strong></div>
                  <div style={{ height: 1, background: "rgba(10,15,46,0.12)", marginBottom: 16 }} />
                  <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY }}>43,200 ÷ 12 = <span style={{ color: GOLD }}>3,600×</span></div>
                </div>
                <p style={{ ...BW, fontSize: 12, color: MUTED, lineHeight: 1.65 }}>
                  The 3,600× figure represents preparation advantage — not speed improvement. The response was staged before the trigger fired. The competitor is still assembling the room when Readiness OS is deep into coordinated execution.
                </p>
              </div>
              <div>
                <SectionLabel>Terminology Lock</SectionLabel>
                {[
                  { label: "CANONICAL LABEL", value: "3,600× Execution Head Start", status: "✓ Approved" },
                  { label: "CANONICAL FRAMING", value: "30 days compressed to 12 minutes", status: "✓ Approved" },
                  { label: "RETIRED", value: "340×, 360×, 72 hours", status: "✗ Do not use" },
                  { label: "RETIRED", value: '"speed advantage"', status: "✗ Do not use" },
                  { label: "RETIRED", value: '"faster response"', status: "✗ Do not use" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "9px 0", borderBottom: "1px solid rgba(10,15,46,0.06)" }}>
                    <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: item.status.startsWith("✓") ? TEAL : "#DC3C32", minWidth: 16 }}>{item.status.split(" ")[0]}</div>
                    <div>
                      <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ ...BW, fontSize: 13, color: NAVY, fontWeight: 600 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AlgorithmBlock>

          {/* ── CLOSING ── */}
          <div style={{ padding: "28px 32px", background: NAVY, display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div style={{ width: 4, height: "100%", background: GOLD, flexShrink: 0, alignSelf: "stretch" }} />
            <div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>The Architecture Statement</div>
              <p style={{ ...CG, fontSize: 20, fontWeight: 600, color: "#fff", lineHeight: 1.45, margin: "0 0 10px" }}>
                The algorithms above do not make responses faster.<br />
                <em style={{ color: GOLD }}>They make responses ready — before the trigger fires.</em>
              </p>
              <p style={{ ...BW, fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.65 }}>
                Speed is the evidence. Readiness is the promise. Fearlessness is the outcome.
                Every enterprise that prepares for every situation it expects to encounter is no longer afraid of strategic situations — it is fearless.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 16, paddingTop: 24, borderTop: "1px solid rgba(10,15,46,0.1)" }}>
            <VaughnMartinLogo size="xs" theme="light" />
            <div style={{ ...BC, fontSize: 10, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
              Mobilization Intelligence Architecture · Confidential · VaughnMartin Readiness OS
            </div>
            <div style={{ ...BC, fontSize: 10, color: MUTED, letterSpacing: "0.08em" }}>
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
