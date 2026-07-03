import { useState, useEffect, useRef } from "react";
import type { DemoScenario } from "@/pages/demos/scenarioData";
import ConsequencePreview from "@/components/ConsequencePreview";
import type { ConsequenceChoice } from "@/components/ConsequencePreview";
import { GOLD, TEAL, W, W70, W50, W25, BD, GBG, BC, CG, BAR, MONO, SLabel, LiveDot, ChapterNav, severityColorForRisk } from "../shared";

export default function Ch4Authorization({ sc, chapter, onNext, onBack }: { sc: DemoScenario; chapter: number; onNext: () => void; onBack: () => void }) {
  const [authorized, setAuthorized] = useState(false);
  const [choiceMade, setChoiceMade] = useState<ConsequenceChoice | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ceo = sc.stakeholders[0];
  const sevColor = severityColorForRisk(sc.riskScore);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleAuth = (choice: ConsequenceChoice) => {
    setChoiceMade(choice);
    setAuthorized(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const mm = Math.floor(elapsed / 60);
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={GOLD}>Chapter 4 — Executive Authorization</SLabel>
      <h2 style={{ ...CG, fontSize: 42, fontWeight: 600, color: W, lineHeight: 1.08, letterSpacing: "-0.01em", marginBottom: 6 }}>
        {ceo.name} receives the brief.<br/><em style={{ color: GOLD }}>One decision. Full authority.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 620, marginBottom: 22 }}>
        No committee. No alignment cycle. The executive brief summarizes every element already staged. Every resource pre-authorized. Every question already answered. The only decision remaining: authorize or hold. System monitors — executives authorize.
      </p>

      <div style={{ background: `${sevColor}0d`, border: `1px solid ${sevColor}40`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 26, flexWrap: "wrap" }}>
        <LiveDot color={authorized ? TEAL : sevColor}/>
        <div style={{ ...MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: authorized ? TEAL : sevColor, textTransform: "uppercase" }}>
          {authorized ? "AUTHORIZED · ACTIVATING ALL TASKS" : "MISSION CLOCK"}
        </div>
        {!authorized && <div style={{ ...BC, fontSize: 22, fontWeight: 900, color: sevColor }}>{mm}:{ss}</div>}
        {authorized && <div style={{ ...BC, fontSize: 13, fontWeight: 800, color: TEAL, letterSpacing: "0.1em" }}>✓ AUTHORIZED BY {ceo.name.toUpperCase()} · {ceo.title.toUpperCase()}</div>}
      </div>

      <div style={{ background: GBG, border: `1px solid ${GOLD}60`, padding: "26px 26px", marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${BD}` }}>
          <div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase", marginBottom: 4 }}>Executive Authorization Brief · CONFIDENTIAL</div>
            <div style={{ ...BC, fontSize: 19, fontWeight: 900, color: W }}>{sc.name}</div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 600, color: W50, letterSpacing: "0.12em", marginTop: 3 }}>For: {ceo.name}, {ceo.title} · {sc.company} · {sc.triggerTime}</div>
          </div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: sevColor, background: `${sevColor}15`, border: `1px solid ${sevColor}50`, padding: "5px 12px" }}>
            RISK {sc.riskScore}/100
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
          {[
            { heading: "Situation", body: sc.triggerHeadline + ". " + sc.triggerContext.split(".")[0] + "." },
            { heading: "Protocol Activated", body: `Protocol #${sc.protocolNumber} — ${sc.protocolName}. ${sc.tasks.length} tasks pre-staged. ${sc.stakeholders.length} stakeholders notified.` },
            { heading: "Resources — Pre-Authorized", body: sc.preAuthorized.slice(0, 3).join("; ") + "." },
            { heading: "Time to Full Activation", body: "Protocol completes in 12 minutes from trigger detection. All tasks activate simultaneously upon your authorization." },
          ].map(({ heading, body }, i) => (
            <div key={i} style={{ borderLeft: `2px solid ${GOLD}40`, paddingLeft: 14 }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 5 }}>{heading}</div>
              <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.55 }}>{body}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 18 }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: W, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Decision Required — Choose Your Response</div>
          {authorized ? (
            <div style={{ padding: "16px 20px", background: `${TEAL}18`, border: `1px solid ${TEAL}50`, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
              <div style={{ ...BC, fontSize: 13, fontWeight: 800, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                ✓ {choiceMade === "run_as_built" ? "Running as Built" : choiceMade === "audible" ? "Audible Called — Adjusted Protocol Activating" : choiceMade === "customize" ? "Customized — Activating Modified Protocol" : "Response Held — Stand-Down Logged"} · All Tasks Activating
              </div>
            </div>
          ) : (
            <ConsequencePreview
              triggerName={sc.triggerHeadline}
              playbookName={`Protocol #${sc.protocolNumber} — ${sc.protocolName}`}
              taskCount={sc.tasks.length}
              onConfirm={(choice: ConsequenceChoice) => handleAuth(choice)}
            />
          )}
          <div style={{ ...BAR, fontSize: 11, color: W25, marginTop: 12, lineHeight: 1.5 }}>
            Authorization is logged, timestamped, and attributed to your executive profile. No decision rights transfer without your sign-off.
          </div>
        </div>
      </div>

      <ChapterNav chapter={chapter} onNext={onNext} onBack={onBack} nextLabel="Open the War Room →" disabled={!authorized} />
    </div>
  );
}
