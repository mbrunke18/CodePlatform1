import type { DemoScenario } from "@/pages/demos/scenarioData";
import { getAdvanceDataForCategory } from "../advanceData";
import { GOLD, TEAL, TEAL_LT, W, W70, W50, BD, GBG, NAVY_BG, BC, CG, BAR, SLabel, ChapterNav, ProductScreenPanel } from "../shared";

export default function Ch8Advance({ sc, chapter, onNext, onBack }: { sc: DemoScenario; chapter: number; onNext: () => void; onBack: () => void }) {
  const data = getAdvanceDataForCategory(sc.category);
  const provenColor = data.provenStatus === "Proven" ? TEAL : GOLD;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={GOLD}>Chapter 8 — ADVANCE 2.0: The Compounding Advantage</SLabel>
      <h2 style={{ ...CG, fontSize: 40, fontWeight: 600, color: W, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 8 }}>
        This activation already made<br/><em style={{ color: GOLD }}>the next one faster.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 640, marginBottom: 26 }}>
        Every activation close-out generates preparation updates. Readiness OS doesn't just execute the protocol — it measures the protocol against itself, applies evidence-backed improvements, and tracks whether each one actually worked.
      </p>

      <div style={{ background: NAVY_BG, border: `1px solid ${BD}`, padding: "22px 22px", marginBottom: 18 }}>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: W50, textTransform: "uppercase", marginBottom: 8 }}>From a Prior Activation of This Protocol Category</div>
        <div style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.6 }}>{data.priorActivation}</div>
      </div>

      <div style={{ background: GBG, border: `1px solid ${GOLD}45`, padding: "22px 22px", marginBottom: 18 }}>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 8 }}>Update Applied</div>
        <div style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.6, marginBottom: 14 }}>{data.updateApplied}</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: W50, textTransform: "uppercase", marginBottom: 3 }}>Causal Hypothesis</div>
            <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.5, maxWidth: 460 }}>{data.hypothesis}</div>
          </div>
          <div style={{ ...BC, fontSize: 26, fontWeight: 900, color: GOLD, marginLeft: "auto" }}>{data.expectedDelta}</div>
        </div>
      </div>

      <div style={{ background: `${provenColor}0a`, border: `1px solid ${provenColor}45`, padding: "22px 22px", marginBottom: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: provenColor, letterSpacing: "0.2em", background: `${provenColor}18`, border: `1px solid ${provenColor}40`, padding: "3px 10px" }}>
            {data.provenStatus.toUpperCase()}
          </span>
          <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: W50, textTransform: "uppercase" }}>Hypothesis Measurement</span>
        </div>
        <div style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.6 }}>{data.measuredResult}</div>
      </div>

      <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: TEAL_LT, textTransform: "uppercase", marginBottom: 14 }}>Learning Velocity Index — Platform-Wide</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 0, border: `1px solid ${BD}`, marginBottom: 8 }}>
        {[
          { val: String(data.learningVelocity.updatesApplied), label: "Updates Applied" },
          { val: String(data.learningVelocity.provenImprovements), label: "Proven Improvements" },
          { val: String(data.learningVelocity.minutesSaved), label: "Minutes Saved" },
          { val: `${data.learningVelocity.pctLibraryEvidenceBacked}%`, label: "Library Evidence-Backed" },
          { val: data.learningVelocity.moatMonths, label: "Moat vs. New Entrant" },
        ].map(({ val, label }, i) => (
          <div key={i} style={{ padding: "16px 12px", borderRight: i < 4 ? `1px solid ${BD}` : "none", textAlign: "center" }}>
            <div style={{ ...BC, fontSize: 19, fontWeight: 900, color: GOLD, lineHeight: 1, marginBottom: 5 }}>{val}</div>
            <div style={{ ...BC, fontSize: 8, fontWeight: 600, color: W50, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.35 }}>{label}</div>
          </div>
        ))}
      </div>

      <ProductScreenPanel
        eyebrow="See It In The Platform — ADVANCE 2.0"
        image="/screenshots/fresh_advance_intelligence.jpg"
        alt="ADVANCE 2.0 Learning Velocity Index dashboard"
        route="/advance-intelligence"
        callouts={[
          { title: "Every update tracked and measured", text: "The hypothesis you just saw measured is one of hundreds — proven or disproven, never just assumed." },
          { title: "The moat metric", text: "How many months it would take a competitor to rebuild this library from scratch — the number keeps growing with every activation." },
        ]}
      />

      <ChapterNav chapter={chapter} onNext={onNext} onBack={onBack} nextLabel="See the Full Platform →" />
    </div>
  );
}
