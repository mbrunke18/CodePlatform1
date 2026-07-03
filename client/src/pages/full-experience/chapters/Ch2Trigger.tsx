import { useState, useEffect } from "react";
import type { DemoScenario } from "@/pages/demos/scenarioData";
import { GOLD, W, W70, W50, W25, BD, GBG, TEAL, BC, CG, BAR, MONO, LiveDot, ChapterNav, severityColorForRisk } from "../shared";

export default function Ch2Trigger({ sc, chapter, onNext, onBack }: { sc: DemoScenario; chapter: number; onNext: () => void; onBack: () => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 150); return () => clearTimeout(t); }, []);
  const sevColor = severityColorForRisk(sc.riskScore);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 28px 40px", opacity: vis ? 1 : 0, transition: "opacity 0.6s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <LiveDot color={sevColor}/>
        <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: sevColor, textTransform: "uppercase" }}>Chapter 2 — The Situation Arrives</span>
      </div>

      <div style={{ ...BC, fontSize: 56, fontWeight: 900, color: W, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 10 }}>
        {sc.triggerTime.split(" ")[0]}
      </div>
      <div style={{ ...CG, fontSize: 30, fontStyle: "italic", color: GOLD, lineHeight: 1.25, marginBottom: 26 }}>
        The situation you were pre-staged for just fired.
      </div>

      <div style={{ background: `${sevColor}10`, border: `1px solid ${sevColor}50`, padding: "20px 24px", marginBottom: 22, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}><LiveDot color={sevColor}/></div>
        <div>
          <div style={{ ...MONO, fontSize: 9, fontWeight: 700, color: sevColor, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
            {sc.triggerTime} · {sc.company} ({sc.ticker})
          </div>
          <div style={{ ...BC, fontSize: 18, fontWeight: 800, color: W, letterSpacing: "0.02em", lineHeight: 1.3, marginBottom: 8 }}>
            {sc.triggerHeadline}
          </div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: sevColor, background: `${sevColor}18`, border: `1px solid ${sevColor}40`, display: "inline-block", padding: "3px 10px" }}>
            RISK {sc.riskScore}/100 — {sc.riskScore >= 90 ? "CRITICAL" : sc.riskScore >= 75 ? "HIGH" : "ELEVATED"}
          </div>
        </div>
      </div>

      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.7, marginBottom: 14 }}>{sc.triggerContext}</p>

      <div style={{ ...CG, fontSize: 15, fontStyle: "italic", color: W70, lineHeight: 1.6, marginBottom: 24, maxWidth: 620 }}>
        Somewhere in your building, right now, a version of this is already possible. The only open question is whether anyone owns it yet.
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 26 }}>
        <div style={{ flex: 1, padding: "14px 20px", background: "rgba(192,57,43,0.07)", border: "1px solid rgba(192,57,43,0.25)", borderRight: "none" }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: "#E05A4A", textTransform: "uppercase", marginBottom: 5 }}>Traditional Model — T+0:00</div>
          <div style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>Ownership undefined. No brief exists. 30-day mobilization cycle begins now.</div>
        </div>
        <div style={{ flex: 1, padding: "14px 20px", background: `${TEAL}08`, border: `1px solid ${TEAL}35` }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: TEAL, textTransform: "uppercase", marginBottom: 5 }}>Readiness OS — T+0:00</div>
          <div style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>Protocol #{sc.protocolNumber} was already staged in Chapter 1. Detection begins now.</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
        {[
          { label: "Company", value: sc.company, sub: `${sc.ticker} · ${sc.industry}` },
          { label: "Threat Classification", value: sc.category, sub: `Readiness Protocol #${sc.protocolNumber}` },
          { label: "Primary Audience", value: sc.audience, sub: "Roles activated in this protocol" },
          { label: "Cost of the Next 30 Days", value: sc.oldModelCost, sub: "The number that grows every day this stays unowned." },
        ].map(({ label, value, sub }, i) => (
          <div key={i} style={{ background: GBG, border: `1px solid ${BD}`, padding: "18px 20px" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
            <div style={{ ...BC, fontSize: 15, fontWeight: 800, color: W, lineHeight: 1.2, marginBottom: 3 }}>{value}</div>
            <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <ChapterNav chapter={chapter} onNext={onNext} onBack={onBack} nextLabel="Watch Detection Confirm It →" />
    </div>
  );
}
