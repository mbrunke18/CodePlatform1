import { useState, useEffect } from "react";
import type { DemoScenario } from "@/pages/demos/scenarioData";
import { GOLD, TEAL, TEAL_LT, RED, AMB, W, W70, W50, W25, W10, BD, GBG, NAVY_BG, BC, CG, BAR, MONO, SLabel, LiveDot, SeverityColor, ChapterNav, useSequential, useCountUp } from "../shared";

export default function Ch3Detection({ sc, chapter, onNext, onBack }: { sc: DemoScenario; chapter: number; onNext: () => void; onBack: () => void }) {
  const revealed = useSequential(sc.signals.length, 1200, true);
  const allRevealed = revealed >= sc.signals.length;
  const riskVal = useCountUp(sc.riskScore, 1800, allRevealed);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (allRevealed) {
      const t = setTimeout(() => setLocked(true), 1000);
      return () => clearTimeout(t);
    }
  }, [allRevealed]);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={RED}>Chapter 3 — Detection & Protocol Lock-On</SLabel>
      <h2 style={{ ...CG, fontSize: 42, fontWeight: 600, color: W, lineHeight: 1.08, letterSpacing: "-0.01em", marginBottom: 8 }}>
        {sc.signals.length} signals detected.<br/><em style={{ color: GOLD }}>Confirming the protocol you saw in Chapter 1.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 620, marginBottom: 26 }}>
        Readiness OS continuously monitors 231 detection thresholds across regulatory feeds, newswires, financial intelligence, and social signals. {sc.signals.length} corroborating signals were detected and scored simultaneously — in seconds, not meetings.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 28 }}>
        {sc.signals.map((s, i) => {
          const col = SeverityColor(s.severity);
          const visible = i < revealed;
          return (
            <div key={i} style={{ background: GBG, border: `1px solid ${visible ? col + "50" : BD}`, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start", opacity: visible ? 1 : 0.06, transition: "opacity 0.5s, border-color 0.5s" }}>
              <div style={{ flexShrink: 0, width: 34 }}>
                <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: col, letterSpacing: "0.1em" }}>S.{String(i + 1).padStart(2, "0")}</div>
                <div style={{ ...MONO, fontSize: 7, color: W25, marginTop: 3 }}>{s.time}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                  <div>
                    <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.25em", color: col, textTransform: "uppercase", marginBottom: 3 }}>{s.source}</div>
                    <div style={{ ...BC, fontSize: 14, fontWeight: 800, color: W, letterSpacing: "0.02em" }}>{s.headline}</div>
                  </div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: col, letterSpacing: "0.15em", background: `${col}15`, border: `1px solid ${col}40`, padding: "3px 10px", flexShrink: 0 }}>
                    {s.severity.toUpperCase()} · {s.score}
                  </div>
                </div>
                <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.5 }}>{s.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {allRevealed && (
        <div style={{ background: NAVY_BG, border: `1px solid ${locked ? GOLD + "60" : BD}`, padding: "24px 22px", marginBottom: 8, transition: "border-color 0.5s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <LiveDot color={locked ? TEAL : GOLD}/>
            <span style={{ ...MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: locked ? TEAL : GOLD, textTransform: "uppercase" }}>
              {locked ? `MATCH CONFIRMED — Protocol #${sc.protocolNumber}` : "CROSS-REFERENCING STAGED PROTOCOL…"}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: locked ? 16 : 0 }}>
            <div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: RED, textTransform: "uppercase", marginBottom: 6 }}>Composite Risk Score</div>
              <div style={{ ...BC, fontSize: 30, fontWeight: 900, color: RED, lineHeight: 1 }}>{riskVal}<span style={{ fontSize: 14 }}>/100</span></div>
            </div>
            <div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>Detection Speed</div>
              <div style={{ ...BC, fontSize: 30, fontWeight: 900, color: GOLD, lineHeight: 1 }}>22<span style={{ fontSize: 14 }}> sec</span></div>
            </div>
            <div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: TEAL, textTransform: "uppercase", marginBottom: 6 }}>Protocol Match</div>
              <div style={{ ...BC, fontSize: 22, fontWeight: 900, color: TEAL, lineHeight: 1 }}>#{sc.protocolNumber}</div>
            </div>
          </div>
          {locked && (
            <div style={{ borderTop: `1px solid ${BD}`, marginTop: 16, paddingTop: 16 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>Pre-Authorized Resources — Activated on Trigger</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {sc.preAuthorized.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: TEAL, fontSize: 9, flexShrink: 0, marginTop: 3 }}>◆</span>
                    <span style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.45 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ChapterNav chapter={chapter} onNext={onNext} onBack={onBack} nextLabel="Deliver Executive Brief →" disabled={!locked} />
    </div>
  );
}
