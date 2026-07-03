import type { DemoScenario } from "@/pages/demos/scenarioData";
import { GOLD, TEAL, TEAL_LT, RED, W, W70, W50, BD, GBG, BC, CG, BAR, SLabel, ChapterNav, useSequential } from "../shared";

export default function Ch7Debrief({ sc, chapter, onNext, onBack }: { sc: DemoScenario; chapter: number; onNext: () => void; onBack: () => void }) {
  const delivCount = useSequential(sc.outcome.deliverables.length, 450, true);
  const intelCount = useSequential(sc.outcome.intelligence.length, 620, true);
  const classColor = sc.outcome.classification === "OPTIMIZATION" ? TEAL : sc.outcome.classification === "MIXED-SIGNAL" ? GOLD : RED;
  const allShown = delivCount >= sc.outcome.deliverables.length && intelCount >= sc.outcome.intelligence.length;

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={TEAL}>Chapter 7 — Post-Activation Debrief & ROI</SLabel>

      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.4em", color: TEAL, textTransform: "uppercase", marginBottom: 12 }}>Activation Status · {sc.company}</div>
        <div style={{ ...CG, fontSize: 44, fontWeight: 600, color: TEAL_LT, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: 8 }}>Activation Complete</div>
        <div style={{ ...CG, fontSize: 21, fontStyle: "italic", color: GOLD, lineHeight: 1.3 }}>{sc.outcome.headline}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 26 }}>
        {[
          { label: "Tasks Activated", value: `${sc.tasks.length} / ${sc.tasks.length}`, color: TEAL },
          { label: "Activation Time", value: "12:00", color: GOLD },
          { label: "Debrief Classification", value: sc.outcome.classification, color: classColor },
        ].map(({ label, value, color }, i) => (
          <div key={i} style={{ background: GBG, border: `1px solid ${BD}`, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: W50, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
            <div style={{ ...BC, fontSize: 19, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 26 }}>
        <div style={{ background: GBG, border: `1px solid ${BD}`, padding: "22px 20px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 14 }}>Deliverables Generated</div>
          {sc.outcome.deliverables.map(({ label, sub }, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start", opacity: i < delivCount ? 1 : 0.08, transition: "opacity 0.4s" }}>
              <span style={{ color: TEAL, fontSize: 10, flexShrink: 0, marginTop: 2 }}>◆</span>
              <div>
                <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: W, letterSpacing: "0.03em", marginBottom: 1 }}>{label}</div>
                <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.4 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: `${TEAL}06`, border: `1px solid ${TEAL}30`, padding: "22px 20px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: TEAL, textTransform: "uppercase", marginBottom: 14 }}>Post-Activation Intelligence</div>
          {sc.outcome.intelligence.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "flex-start", opacity: i < intelCount ? 1 : 0.08, transition: "opacity 0.4s" }}>
              <span style={{ color: TEAL, fontSize: 9, flexShrink: 0, marginTop: 3 }}>→</span>
              <span style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${TEAL}25`, marginTop: 10, paddingTop: 10 }}>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>Financial Impact</div>
            <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.5 }}>{sc.outcome.impact}</div>
          </div>
        </div>
      </div>

      <div style={{ background: `${GOLD}0a`, border: `1px solid ${GOLD}35`, padding: "18px 22px", marginBottom: 8 }}>
        <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.6 }}>
          Every task completed was a decision made before the pressure arrived — that's the ROI Dashboard's job in the real platform: it logs actual cost avoided against every activation, not estimated.
        </div>
      </div>

      <ChapterNav chapter={chapter} onNext={onNext} onBack={onBack} nextLabel="See ADVANCE 2.0 →" disabled={!allShown} />
    </div>
  );
}
