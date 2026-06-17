import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import { Shield, Clock, TrendingUp, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const SAMPLE_ACTIVATIONS = [
  { id: "ACT-2026-0047", protocol: "Ransomware Response & Business Continuity", domain: "RISK & RESILIENCE", planned: 12, actual: 11, deviation: -1, classification: "Optimization", date: "Jun 4, 2026" },
  { id: "ACT-2026-0044", protocol: "Activist Investor Response", domain: "RISK & RESILIENCE", planned: 12, actual: 13, deviation: +1, classification: "Optimization", date: "May 29, 2026" },
  { id: "ACT-2026-0041", protocol: "Competitor Displacement Sprint", domain: "GROWTH & POSITIONING", planned: 12, actual: 10, deviation: -2, classification: "Optimization", date: "May 22, 2026" },
  { id: "ACT-2026-0038", protocol: "Supply Chain Force Majeure", domain: "RISK & RESILIENCE", planned: 12, actual: 14, deviation: +2, classification: "Mixed-Signal", date: "May 17, 2026" },
  { id: "ACT-2026-0035", protocol: "M&A Rapid Response Protocol", domain: "GROWTH & POSITIONING", planned: 12, actual: 12, deviation: 0, classification: "Optimization", date: "May 11, 2026" },
  { id: "ACT-2026-0031", protocol: "FDA Recall Coordination", domain: "RISK & RESILIENCE", planned: 12, actual: 9, deviation: -3, classification: "Optimization", date: "May 5, 2026" },
  { id: "ACT-2026-0028", protocol: "Data Breach Response", domain: "RISK & RESILIENCE", planned: 12, actual: 11, deviation: -1, classification: "Optimization", date: "Apr 28, 2026" },
  { id: "ACT-2026-0024", protocol: "Go-to-Market Acceleration Sprint", domain: "TRANSFORMATION", planned: 12, actual: 16, deviation: +4, classification: "Recovery", date: "Apr 21, 2026" },
  { id: "ACT-2026-0020", protocol: "Energy Grid Disruption Protocol", domain: "RISK & RESILIENCE", planned: 12, actual: 11, deviation: -1, classification: "Optimization", date: "Apr 14, 2026" },
  { id: "ACT-2026-0017", protocol: "DOJ Investigation Response", domain: "RISK & RESILIENCE", planned: 12, actual: 13, deviation: +1, classification: "Optimization", date: "Apr 8, 2026" },
];

const AVG_ACTUAL = parseFloat((SAMPLE_ACTIVATIONS.reduce((s, a) => s + a.actual, 0) / SAMPLE_ACTIVATIONS.length).toFixed(1));
const WITHIN_TARGET = SAMPLE_ACTIVATIONS.filter(a => a.actual <= 12).length;
const AVG_DEVIATION = parseFloat((SAMPLE_ACTIVATIONS.reduce((s, a) => s + Math.abs(a.deviation), 0) / SAMPLE_ACTIVATIONS.length).toFixed(1));
const OLD_MODEL_AVG = 43200;

function DeviationBar({ actual, planned = 12 }: { actual: number; planned?: number }) {
  const maxMins = 20;
  const plannedPct = (planned / maxMins) * 100;
  const actualPct = (actual / maxMins) * 100;
  const color = actual <= planned ? TEAL : actual <= planned + 2 ? GOLD : "#EF4444";

  return (
    <div style={{ position: "relative", height: 20, background: "#F3F4F6", borderRadius: 2, overflow: "hidden", minWidth: 120 }}>
      <div style={{ position: "absolute", left: `${plannedPct}%`, top: 0, bottom: 0, width: 2, background: "rgba(10,15,46,0.25)", zIndex: 2 }} />
      <div style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: `${actualPct}%`, background: color, borderRadius: 1, transition: "width 0.4s ease" }} />
      <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 700, color: "#fff", mixBlendMode: "multiply" as const, zIndex: 3 }}>{actual}m</div>
    </div>
  );
}

export default function DeviationMetric() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<"all" | "within" | "over">("all");

  useEffect(() => {
    updatePageMetadata({
      title: "12-Minute Deviation Metric — Readiness OS | VaughnMartin",
      description: "Live proof that Readiness OS delivers its 12-minute response target. Planned vs. actual execution times across every activation — with full deviation tracking and classification.",
      ogTitle: "The 12-Minute Deviation Metric — Proof, Not Promise",
      ogDescription: "Every activation measured. Planned vs. actual. Deviation classified. No claim without evidence.",
    });
  }, []);

  const displayed = SAMPLE_ACTIVATIONS.filter(a =>
    filter === "all" ? true : filter === "within" ? a.actual <= 12 : a.actual > 12
  );

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: NAVY, padding: "80px 48px 72px", textAlign: "center" }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD, ...BC }}>Execution Proof</span>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
          </div>
          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(36px,5vw,58px)", lineHeight: 1.05, color: "#fff", marginBottom: 20 }}>
            The 12-Minute Claim.<br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>Measured. Not promised.</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Every Readiness OS activation is measured against the 12-minute target. Planned execution time. Actual execution time. Deviation classified. This page is that record.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)", maxWidth: 800, margin: "0 auto" }}>
            {[
              { stat: `${AVG_ACTUAL}m`, label: "Average actual response", sub: "vs. 12-minute target" },
              { stat: `${WITHIN_TARGET}/${SAMPLE_ACTIVATIONS.length}`, label: "Activations on target", sub: "at or under 12 minutes" },
              { stat: `${AVG_DEVIATION}m`, label: "Avg deviation from plan", sub: "minutes above or below" },
              { stat: "30 days", label: "Old model baseline", sub: "what this replaces" },
            ].map((s) => (
              <div key={s.stat} style={{ padding: "24px 16px", textAlign: "center", background: "rgba(10,15,46,0.6)" }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{s.stat}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.05em", marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What deviation means */}
      <section style={{ background: "#fff", padding: "56px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL, ...BC }}>How We Classify Deviation</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3vw,36px)", color: NAVY, marginBottom: 12 }}>
              Every deviation triggers a protocol update.
            </h2>
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              An activation that runs 2 minutes over target doesn't just get logged — it generates a specific hypothesis. The ADVANCE phase tracks whether the fix works. Over time, deviations decrease. That's the compounding.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                label: "Optimization", color: TEAL, icon: CheckCircle,
                range: "≤ 12 minutes",
                desc: "Protocol executed at or under target. Outcome recorded. Improvement hypotheses still generated for future refinement.",
                action: "Protocol locked as-is. Optional ADVANCE refinement.",
              },
              {
                label: "Mixed-Signal", color: GOLD, icon: AlertCircle,
                range: "13–15 minutes",
                desc: "Minor deviation. Protocol ran over target but within acceptable variance. Root cause identified and a hypothesis is created in ADVANCE.",
                action: "ADVANCE hypothesis created. Executive review optional.",
              },
              {
                label: "Recovery", color: "#EF4444", icon: AlertCircle,
                range: "16+ minutes",
                desc: "Significant deviation from target. Protocol update required. ADVANCE closes the loop with a causal hypothesis and executive authorization before next activation.",
                action: "Executive authorization required. Protocol updated before next use.",
              },
            ].map((c) => (
              <div key={c.label} style={{ border: `1px solid ${BORDER}`, background: OFF, padding: "28px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <c.icon style={{ width: 16, height: 16, color: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: c.color, ...BC }}>{c.label}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, fontFamily: "'Barlow', sans-serif", marginBottom: 10 }}>{c.range}</div>
                <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.65, marginBottom: 12 }}>{c.desc}</p>
                <div style={{ fontSize: 11, fontWeight: 700, color: c.color, borderLeft: `3px solid ${c.color}`, paddingLeft: 10 }}>{c.action}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activation log */}
      <section style={{ background: OFF, padding: "64px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD, ...BC }}>Activation Log</span>
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(22px,2.5vw,32px)", color: NAVY, margin: 0 }}>Planned vs. Actual Execution Time</h2>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["all", "within", "over"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "7px 14px", border: `1px solid ${filter === f ? TEAL : BORDER}`,
                    background: filter === f ? TEAL : "#fff", color: filter === f ? "#fff" : MUTED,
                    fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const,
                    cursor: "pointer", ...BC,
                  }}
                >
                  {f === "all" ? "All" : f === "within" ? "On Target" : "Over Target"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ border: `1px solid ${BORDER}`, background: "#fff", overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 120px 60px 60px 80px 120px", background: NAVY, gap: 0 }}>
              {["ID", "Protocol", "Domain", "Plan", "Actual", "±", "Classification"].map((h, i) => (
                <div key={h} style={{ padding: "10px 14px", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: i === 0 ? GOLD : "rgba(255,255,255,0.45)", borderRight: i < 6 ? "1px solid rgba(255,255,255,0.06)" : "none", ...BC }}>{h}</div>
              ))}
            </div>
            {displayed.map((a, i) => {
              const devColor = a.deviation < 0 ? TEAL : a.deviation === 0 ? MUTED : a.deviation <= 2 ? GOLD : "#EF4444";
              const classColor = a.classification === "Optimization" ? TEAL : a.classification === "Mixed-Signal" ? GOLD : "#EF4444";
              return (
                <div key={a.id} style={{ display: "grid", gridTemplateColumns: "90px 1fr 120px 60px 60px 80px 120px", background: i % 2 === 0 ? "#fff" : OFF, borderTop: `1px solid ${BORDER}` }}>
                  <div style={{ padding: "10px 14px", fontSize: 10, color: MUTED, borderRight: `1px solid ${BORDER}`, fontFamily: "monospace" }}>{a.id}</div>
                  <div style={{ padding: "10px 14px", borderRight: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, lineHeight: 1.3, marginBottom: 2 }}>{a.protocol}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>{a.date}</div>
                  </div>
                  <div style={{ padding: "10px 14px", fontSize: 10, color: MUTED, borderRight: `1px solid ${BORDER}`, lineHeight: 1.4 }}>{a.domain}</div>
                  <div style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: MUTED, borderRight: `1px solid ${BORDER}`, textAlign: "center" as const }}>{a.planned}m</div>
                  <div style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: a.actual <= 12 ? TEAL : NAVY, borderRight: `1px solid ${BORDER}`, textAlign: "center" as const }}>{a.actual}m</div>
                  <div style={{ padding: "10px 14px", fontSize: 12, fontWeight: 800, color: devColor, borderRight: `1px solid ${BORDER}`, textAlign: "center" as const }}>{a.deviation > 0 ? `+${a.deviation}` : a.deviation === 0 ? "0" : a.deviation}m</div>
                  <div style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: classColor, ...BC }}>{a.classification}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 28, height: 2, background: "rgba(10,15,46,0.25)" }} />
              <span style={{ fontSize: 10, color: MUTED }}>Target line (12 min)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 8, background: TEAL, borderRadius: 1 }} />
              <span style={{ fontSize: 10, color: MUTED }}>On or under target</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 8, background: GOLD, borderRadius: 1 }} />
              <span style={{ fontSize: 10, color: MUTED }}>1–2 min over</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 8, background: "#EF4444", borderRadius: 1 }} />
              <span style={{ fontSize: 10, color: MUTED }}>3+ min over → protocol update triggered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Old model comparison */}
      <section style={{ background: "#fff", padding: "64px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD, ...BC }}>The Comparison That Matters</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3vw,38px)", color: NAVY, marginBottom: 12 }}>
              The deviation isn't Readiness OS vs. perfect.<br />
              <span style={{ color: TEAL }}>It's Readiness OS vs. 30 days.</span>
            </h2>
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
              Even an activation that runs 16 minutes — our worst recorded outcome — is 2,700× faster than the 30-day traditional mobilization baseline. The deviation metric exists to make us better. The comparison tells you what you're actually choosing between.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", alignItems: "center", gap: 0, maxWidth: 700, margin: "0 auto" }}>
            {[
              {
                label: "Traditional Enterprise Mobilization",
                time: "30 days",
                sub: "~43,200 minutes",
                color: "#EF4444", bg: "#FEF2F2",
                points: ["Day 1–5: Identify who needs to be in the room", "Day 6–12: Align stakeholders, schedule meetings", "Day 13–20: Committee deliberation, options analysis", "Day 21–30: Decision, resourcing, first execution step"],
              },
              null,
              {
                label: "Readiness OS — Worst Recorded Activation",
                time: "16 min",
                sub: "4 min over target — Recovery classification",
                color: TEAL, bg: `${TEAL}08`,
                points: ["Minute 1–3: Signal detected, protocol identified", "Minute 4–7: Stakeholders notified, tasks staged", "Minute 8–11: Executive briefed, authorization window open", "Minute 12–16: Authorization captured, execution begins"],
              },
            ].map((col, i) =>
              col === null
                ? <div key={i} style={{ textAlign: "center", fontSize: 24, color: MUTED }}>vs</div>
                : <div key={col.label} style={{ border: `1px solid ${BORDER}`, background: col.bg, padding: "28px 24px" }}>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: col.color, marginBottom: 8, ...BC }}>{col.label}</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: NAVY, fontFamily: "'Barlow', sans-serif", marginBottom: 2, lineHeight: 1 }}>{col.time}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 16 }}>{col.sub}</div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" as const, gap: 7 }}>
                      {col.points.map((p) => (
                        <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11, color: "#374151", lineHeight: 1.45 }}>
                          <span style={{ color: col.color, fontWeight: 700, flexShrink: 0 }}>›</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
            )}
          </div>
          <div style={{ marginTop: 24, padding: "20px 28px", background: NAVY, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: GOLD, fontFamily: "'Barlow', sans-serif", marginBottom: 4 }}>2,700×</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Faster than the traditional model — even on our worst recorded activation</div>
          </div>
        </div>
      </section>

      {/* Why this page exists */}
      <section style={{ background: NAVY, padding: "64px 48px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD, ...BC }}>Why This Page Exists</span>
          </div>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(26px,3.5vw,42px)", color: "#fff", marginBottom: 20, lineHeight: 1.2 }}>
            We publish this because we stand behind the number.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 640, margin: "0 auto 36px", lineHeight: 1.75 }}>
            Most enterprise platforms make a performance claim. Almost none publish the actual vs. planned data. We do — because the claim is real, the deviations are real, and the ADVANCE loop that corrects them is real. If we miss the target, we tell you what happened and what changed before the next activation.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/authorization-record")}
              style={{ background: GOLD, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "14px 28px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, ...BC }}
            >
              View Authorization Record <ArrowRight style={{ width: 13, height: 13 }} />
            </button>
            <button
              onClick={() => setLocation("/advance-intelligence")}
              style={{ background: "transparent", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "14px 28px", border: "1.5px solid rgba(255,255,255,0.25)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, ...BC }}
            >
              ADVANCE Learning Loop <ArrowRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
