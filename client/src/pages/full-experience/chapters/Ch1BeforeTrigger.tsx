import type { DemoScenario } from "@/pages/demos/scenarioData";
import { NAVY_BG, GOLD, TEAL, TEAL_LT, W, W70, W50, W25, W10, BD, GBG, BC, CG, BAR, MONO, SLabel, LiveDot, ChapterNav } from "../shared";

export default function Ch1BeforeTrigger({ sc, chapter, onNext, onBack }: { sc: DemoScenario; chapter: number; onNext: () => void; onBack: () => void }) {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={TEAL}>Chapter 1 — Before the Trigger</SLabel>
      <h2 style={{ ...CG, fontSize: 44, fontWeight: 600, color: W, lineHeight: 1.08, letterSpacing: "-0.01em", marginBottom: 8 }}>
        Right now, nothing has happened.<br/><em style={{ color: TEAL_LT }}>Protocol #{sc.protocolNumber} is already staged.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.7, maxWidth: 660, marginBottom: 28 }}>
        This is the part every vendor skips: what the platform is doing before anything goes wrong. {sc.company} hasn't been hit by anything yet. But the moment it is, the response won't need to be built — it just needs to be authorized.
      </p>

      {/* Continuous monitoring strip */}
      <div style={{ background: NAVY_BG, border: `1px solid ${BD}`, padding: "16px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <LiveDot color={TEAL}/>
        <span style={{ ...MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: TEAL, textTransform: "uppercase" }}>
          Continuous Monitoring · 231 Trigger Patterns · 8 Live Sources
        </span>
        <span style={{ ...BAR, fontSize: 12, color: W50, marginLeft: "auto" }}>0 active triggers right now — that's the point.</span>
      </div>

      <div style={{ background: `${TEAL}0a`, border: `1px solid ${TEAL}35`, padding: "26px 26px", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
          <div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: TEAL, textTransform: "uppercase", marginBottom: 5 }}>Pre-Staged Readiness Protocol</div>
            <div style={{ ...BC, fontSize: 24, fontWeight: 900, color: GOLD, lineHeight: 1.15 }}>#{sc.protocolNumber} — {sc.protocolName}</div>
          </div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: TEAL, background: `${TEAL}15`, border: `1px solid ${TEAL}40`, padding: "5px 12px" }}>
            {sc.category}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, borderTop: `1px solid ${TEAL}25`, paddingTop: 18 }}>
          {[
            { val: String(sc.tasks.length), label: "Tasks Staged" },
            { val: String(sc.stakeholders.length), label: "Stakeholders Mapped" },
            { val: String(sc.preAuthorized.length), label: "Resources Pre-Authorized" },
            { val: "Q3 Drill", label: "Last Tested" },
          ].map(({ val, label }, i) => (
            <div key={i} style={{ borderRight: i < 3 ? `1px solid ${TEAL}25` : "none", paddingRight: 16, paddingLeft: i > 0 ? 16 : 0 }}>
              <div style={{ ...BC, fontSize: 24, fontWeight: 900, color: TEAL_LT, lineHeight: 1, marginBottom: 4 }}>{val}</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 600, color: W50, letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 28 }}>
        <div style={{ padding: "18px 20px", background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.22)", borderRight: "none" }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: "#E05A4A", textTransform: "uppercase", marginBottom: 6 }}>Old Model, Today</div>
          <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.6 }}>No brief exists. No owner is named. If this situation fired right now, mobilization would start from zero.</div>
        </div>
        <div style={{ padding: "18px 20px", background: GBG, border: `1px solid ${BD}` }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>Readiness OS, Today</div>
          <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.6 }}>Protocol #{sc.protocolNumber} is written, tested, and waiting. {sc.preAuthorized[0]}</div>
        </div>
      </div>

      <div style={{ background: GBG, border: `1px solid ${GOLD}40`, padding: "20px 24px", marginBottom: 8, textAlign: "center" }}>
        <div style={{ ...CG, fontSize: 20, fontStyle: "italic", color: GOLD, lineHeight: 1.4 }}>
          "When the situation arrives — the response is ready before the trigger fires."
        </div>
      </div>

      <ChapterNav chapter={chapter} onNext={onNext} onBack={onBack} nextLabel="Simulate the Trigger →" />
    </div>
  );
}
