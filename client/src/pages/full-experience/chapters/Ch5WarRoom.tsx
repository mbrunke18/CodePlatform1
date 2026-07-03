import { useState, useEffect } from "react";
import type { DemoScenario } from "@/pages/demos/scenarioData";
import { GOLD, TEAL, TEAL_LT, W, W70, W50, W25, W10, BD, GBG, BC, CG, BAR, LiveDot, CatColor, ChapterNav, useSequential, ProductScreenPanel } from "../shared";

const STAKEHOLDER_STATUSES = ["STANDBY", "NOTIFYING", "SENT", "DELIVERED", "ACKNOWLEDGED"] as const;

export default function Ch5WarRoom({ sc, chapter, onNext, onBack }: { sc: DemoScenario; chapter: number; onNext: () => void; onBack: () => void }) {
  const [tab, setTab] = useState<"tasks" | "stakeholders">("tasks");
  const taskCount = useSequential(sc.tasks.length, 340, true);
  const [stStatuses, setStStatuses] = useState<number[]>(sc.stakeholders.map(() => 0));

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    sc.stakeholders.forEach((_, i) => {
      const baseDelay = i * 380;
      STAKEHOLDER_STATUSES.forEach((_, si) => {
        if (si === 0) return;
        timeouts.push(setTimeout(() => setStStatuses(prev => { const n = [...prev]; n[i] = si; return n; }), baseDelay + si * 600));
      });
    });
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allDone = taskCount >= sc.tasks.length && stStatuses.every(s => s >= 4);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "52px 28px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <LiveDot color={TEAL}/>
        <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: TEAL, textTransform: "uppercase" }}>Chapter 5 — War Room & Mobilization</span>
      </div>
      <h2 style={{ ...CG, fontSize: 42, fontWeight: 600, color: W, lineHeight: 1.08, letterSpacing: "-0.01em", marginBottom: 6 }}>
        {sc.tasks.length} tasks staging. {sc.stakeholders.length} stakeholders activating.<br/>
        <em style={{ color: TEAL_LT }}>Seconds from authorization.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 640, marginBottom: 26 }}>
        The war room doesn't assemble — it activates. Every task has a pre-assigned owner. Every stakeholder receives a precise brief. No one wonders what they should be doing.
      </p>

      <div style={{ display: "flex", gap: 0, marginBottom: 18, borderBottom: `1px solid ${BD}` }}>
        {(["tasks", "stakeholders"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} data-testid={`button-tab-${t}`} style={{ ...BC, background: "transparent", border: "none", borderBottom: tab === t ? `2px solid ${GOLD}` : "2px solid transparent", color: tab === t ? GOLD : W50, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "12px 20px", cursor: "pointer", marginBottom: -1 }}>
            {t === "tasks" ? `${taskCount} / ${sc.tasks.length} Tasks` : `${stStatuses.filter(s => s >= 4).length} / ${sc.stakeholders.length} Acknowledged`}
          </button>
        ))}
      </div>

      {tab === "tasks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 22 }}>
          {sc.tasks.map((t, i) => {
            const visible = i < taskCount;
            const color = CatColor(t.category);
            return (
              <div key={t.id} style={{ background: GBG, border: "1px solid rgba(255,255,255,0.07)", padding: "11px 15px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", opacity: visible ? 1 : 0.08, transition: "opacity 0.4s" }}>
                <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: W25, width: 22, flexShrink: 0 }}>#{t.id}</span>
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: W25, width: 58, flexShrink: 0, letterSpacing: "0.1em" }}>{t.timing}</span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: W, letterSpacing: "0.02em", marginBottom: 1 }}>{t.task}</div>
                  <div style={{ ...BAR, fontSize: 11, color: W50 }}>{t.owner} — {t.name}</div>
                </div>
                <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color, opacity: 0.85 }}>{t.category}</span>
                {visible && <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: TEAL, background: `${TEAL}12`, border: `1px solid ${TEAL}30`, padding: "2px 8px" }}>STAGED</span>}
              </div>
            );
          })}
        </div>
      )}

      {tab === "stakeholders" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
          {sc.stakeholders.map((s, i) => {
            const status = STAKEHOLDER_STATUSES[stStatuses[i]];
            const isDone = stStatuses[i] >= 4;
            const statusColor = isDone ? TEAL : stStatuses[i] >= 2 ? GOLD : W50;
            return (
              <div key={i} style={{ background: GBG, border: `1px solid ${isDone ? TEAL + "40" : BD}`, padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: 12, transition: "border-color 0.5s" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${isDone ? TEAL : GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 0.5s" }}>
                  <span style={{ ...BC, fontSize: 11, fontWeight: 800, color: isDone ? TEAL : GOLD }}>{s.initials}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...BC, fontSize: 14, fontWeight: 800, color: W, marginBottom: 1 }}>{s.name}</div>
                  <div style={{ ...BAR, fontSize: 11, color: W50, marginBottom: 9, lineHeight: 1.4 }}>{s.title}</div>
                  <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: statusColor, letterSpacing: "0.15em" }}>{status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BD}`, padding: "16px 22px", marginBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "Tasks Staged", value: `${taskCount} / ${sc.tasks.length}`, color: TEAL },
            { label: "Stakeholders Acknowledged", value: `${stStatuses.filter(s => s >= 4).length} / ${sc.stakeholders.length}`, color: TEAL },
            { label: "Time Elapsed", value: "1m 30s", color: GOLD },
          ].map(({ label, value, color }, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ ...BC, fontSize: 22, fontWeight: 900, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", color: W50, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <ProductScreenPanel
        collapsible
        eyebrow="See It In The Platform — Live Activation Center"
        image="/screenshots/deck_activation.jpg"
        alt="Live Activation Center showing task and stakeholder tracking during an activation"
        route="/live-activation-center"
        callouts={[
          { title: "Every task and owner in one console", text: "The task list and stakeholder grid above are what your team works from during a real activation — not a spreadsheet." },
          { title: "Status updates in real time", text: "STANDBY → NOTIFYING → DELIVERED → ACKNOWLEDGED, tracked automatically — no status-update meetings required." },
        ]}
      />

      <ChapterNav chapter={chapter} onNext={onNext} onBack={onBack} nextLabel="Run the 12-Minute Clock →" disabled={!allDone} />
    </div>
  );
}
