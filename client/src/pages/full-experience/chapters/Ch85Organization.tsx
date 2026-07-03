import type { DemoScenario } from "@/pages/demos/scenarioData";
import { roleConfigs, CATEGORY_LABELS, type RoleCategory } from "@/data/roleConfigs";
import { GOLD, TEAL, TEAL_LT, RED, W, W70, W50, W25, BD, GBG, NAVY_BG, BC, CG, BAR, SLabel, ChapterNav } from "../shared";

const CATEGORY_ACCENT: Record<RoleCategory, string> = {
  OFFENSE: TEAL_LT,
  DEFENSE: RED,
  "SPECIAL TEAMS": GOLD,
};

export default function Ch85Organization({ sc, chapter, onNext, onBack }: { sc: DemoScenario; chapter: number; onNext: () => void; onBack: () => void }) {
  const categories: RoleCategory[] = ["OFFENSE", "DEFENSE", "SPECIAL TEAMS"];

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={GOLD}>Chapter 9 — One Organization</SLabel>
      <h2 style={{ ...CG, fontSize: 42, fontWeight: 600, color: W, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 8 }}>
        While you watched {sc.company}'s one seat,<br/><em style={{ color: GOLD }}>thirteen others were already staged.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.7, maxWidth: 700, marginBottom: 30 }}>
        You just lived through one Readiness Protocol, for one situation, from one seat. But a real enterprise doesn't face one situation a year — it faces this constantly, in every function, at the same time. Readiness OS doesn't cover a single scenario. It covers all 14 C-suite roles, simultaneously, as one system. This is what "the organization" actually means here — not 14 disconnected point solutions, but one coordinated readiness posture.
      </p>

      {categories.map(cat => {
        const roles = roleConfigs.filter(r => r.category === cat);
        const accent = CATEGORY_ACCENT[cat];
        return (
          <div key={cat} style={{ marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }}/>
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: accent, textTransform: "uppercase" }}>{CATEGORY_LABELS[cat]}</span>
              <div style={{ flex: 1, height: 1, background: BD }}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {roles.map(r => {
                const Icon = r.icon;
                return (
                  <div key={r.id} style={{ background: GBG, border: `1px solid ${accent}30`, padding: "14px 15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Icon size={13} style={{ color: accent, flexShrink: 0 }} />
                      <span style={{ ...BC, fontSize: 11, fontWeight: 800, color: W, letterSpacing: "0.02em" }}>{r.title}</span>
                    </div>
                    <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.45, marginBottom: 10, minHeight: 32 }}>{r.situationLine}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                      <span style={{ ...BC, fontSize: 9, color: W25, letterSpacing: "0.05em" }}>{r.metricBefore} → {r.metricAfter}</span>
                      <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: TEAL, background: `${TEAL}12`, border: `1px solid ${TEAL}30`, padding: "2px 7px", flexShrink: 0 }}>STAGED</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div style={{ background: NAVY_BG, border: `1px solid ${GOLD}40`, padding: "22px 24px", textAlign: "center" }}>
        <div style={{ ...CG, fontSize: 19, fontStyle: "italic", color: W, lineHeight: 1.5 }}>
          14 roles. 14 situations. <span style={{ color: GOLD }}>One organization.</span> Every one of them pre-staged — none of them waiting on the others.
        </div>
      </div>

      <ChapterNav chapter={chapter} onNext={onNext} onBack={onBack} nextLabel="See the Full Recap →" />
    </div>
  );
}
