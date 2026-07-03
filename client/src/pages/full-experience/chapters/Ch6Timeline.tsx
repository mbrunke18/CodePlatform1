import type { DemoScenario } from "@/pages/demos/scenarioData";
import { GOLD, TEAL, RED, W, W70, W50, W10, BD, GBG, BC, CG, BAR, SLabel, ChapterNav, useSimClock } from "../shared";

export default function Ch6Timeline({ sc, chapter, onNext, onBack }: { sc: DemoScenario; chapter: number; onNext: () => void; onBack: () => void }) {
  const { simSec, done } = useSimClock(720, 14000, true);
  const mm = Math.floor(simSec / 60);
  const ss = String(simSec % 60).padStart(2, "0");

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={TEAL}>Chapter 6 — 12 Minutes vs. 30 Days</SLabel>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ ...BC, fontSize: 82, fontWeight: 900, color: done ? TEAL : GOLD, lineHeight: 1, letterSpacing: "-0.04em", transition: "color 0.5s" }}>
          {mm}:{ss}
        </div>
        <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.3em", color: done ? TEAL : GOLD, textTransform: "uppercase", marginTop: 4 }}>
          {done ? "ACTIVATION COMPLETE" : "ACTIVATING — READINESS OS"}
        </div>
        <div style={{ width: "100%", maxWidth: 460, height: 4, background: W10, borderRadius: 2, overflow: "hidden", margin: "16px auto 0" }}>
          <div style={{ width: `${(simSec / 720) * 100}%`, height: "100%", background: done ? TEAL : GOLD, transition: "width 0.1s, background 0.5s" }}/>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 28 }}>
        <div style={{ background: `${TEAL}06`, border: `1px solid ${TEAL}35`, padding: "22px 20px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, color: TEAL, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>◆ With Readiness OS</div>
          {sc.timeline.map((ev, i) => {
            const active = ev.simSeconds <= simSec;
            return (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start", opacity: active ? 1 : 0.15, transition: "opacity 0.4s" }}>
                <span style={{ color: active ? TEAL : W50, fontSize: 12, flexShrink: 0, marginTop: 1 }}>{active ? "✓" : "○"}</span>
                <span style={{ ...BAR, fontSize: 12, color: active ? W70 : W50, lineHeight: 1.45 }}>{ev.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: `${RED}05`, border: `1px solid ${RED}25`, padding: "22px 20px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, color: RED, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>✕ Old Model — No Readiness OS</div>
          {sc.oldModel.map(({ day, event }, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: RED, width: 58, flexShrink: 0 }}>{day}</span>
              <span style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.45 }}>{event}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${RED}30`, marginTop: 10, paddingTop: 10 }}>
            <div style={{ ...BC, fontSize: 13, fontWeight: 800, color: RED }}>{sc.oldModelCost}</div>
          </div>
        </div>
      </div>

      {done && (
        <div style={{ background: GBG, border: `1px solid ${GOLD}60`, padding: "26px 26px", textAlign: "center", marginBottom: 8 }}>
          <div style={{ ...BC, fontSize: 62, fontWeight: 900, color: GOLD, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8 }}>3,600×</div>
          <div style={{ ...BC, fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: W, marginBottom: 8 }}>Execution Head Start</div>
          <div style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            30 days compressed to 12 minutes. Not faster execution — earlier positioning. When your competitors are still assembling their teams, you have already set the narrative, engaged advisors, and scheduled your board.
          </div>
        </div>
      )}

      <ChapterNav chapter={chapter} onNext={onNext} onBack={onBack} nextLabel="See the Debrief →" disabled={!done} />
    </div>
  );
}
