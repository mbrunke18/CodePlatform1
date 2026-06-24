import { useState, useEffect } from "react";
import { Link } from "wouter";
import { updatePageMetadata } from "@/lib/seo";
import PageLayout from "@/components/layout/PageLayout";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const IVORY = "#F0EDE4";
const MUTED = "#6B7280";
const BD    = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const BAR: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };

const PLANNED_INITIATIVES = [
  {
    protocol: "#22",
    name: "GTM Launch Sprint",
    domain: "GROWTH & POSITIONING",
    color: GOLD,
    owner: "Chief Revenue Officer",
    week: "Week 6 of 12",
    progress: 50,
    tasks: 14,
    status: "ON TRACK",
    budget: "$1.8M pre-staged",
    description: "6-market simultaneous launch — distribution partners staged, regional leads briefed, revenue pipeline active.",
  },
  {
    protocol: "#58",
    name: "M&A Integration Sprint",
    domain: "TRANSFORMATION",
    color: TEAL,
    owner: "Chief Strategy Officer",
    week: "Week 3 of 16",
    progress: 19,
    tasks: 22,
    status: "ON TRACK",
    budget: "$4.2M pre-staged",
    description: "Waypoint acquisition integration — legal entity consolidation, systems migration sequenced, leadership alignment complete.",
  },
  {
    protocol: "#89",
    name: "Product Rollout",
    domain: "TRANSFORMATION",
    color: TEAL,
    owner: "Chief Product Officer",
    week: "Week 1 of 8",
    progress: 12,
    tasks: 11,
    status: "STAGING",
    budget: "$600K pre-staged",
    description: "Enterprise product rollout — customer success briefed, implementation partners staged, go-live sequence locked.",
  },
];

const UNPLANNED_TASKS = [
  { id: 1, owner: "CISO",           task: "Declare incident. Isolate affected segments — 23 servers quarantined.", timing: "T+0:45", done: true },
  { id: 2, owner: "CEO",            task: "Authorize Protocol #31. Ransomware Response activated.", timing: "T+1:10", done: true },
  { id: 3, owner: "General Counsel",task: "Notify FBI Cyber Division (pre-authorized contact on file).", timing: "T+2:00", done: true },
  { id: 4, owner: "CFO",            task: "Engage cyber insurer. Pre-authorized $4.5M response budget released.", timing: "T+2:30", done: true },
  { id: 5, owner: "Board Chair",    task: "Emergency board call convened — 6:00 AM brief staged.", timing: "T+4:00", done: true },
  { id: 6, owner: "CCO",            task: "Holding statement drafted. Customer comms pre-staged.", timing: "T+5:00", done: true },
  { id: 7, owner: "CTO",            task: "Forensic firm engaged. Recovery sequence initiated.", timing: "T+7:00", done: false },
  { id: 8, owner: "CEO",            task: "Board briefed before market open. Regulatory disclosure filed.", timing: "T+11:30", done: false },
];

const OLD_MODEL_DAYS = [
  { day: "Day 1–3", event: "Q3 roadmap halted. Leadership pulled into crisis response. GTM Launch paused." },
  { day: "Day 4–10", event: "IR firm, legal counsel, forensic team — all hired reactively. Fee negotiations mid-crisis." },
  { day: "Day 11–20", event: "Board briefed at Day 14. Regulatory filing missed. Customer calls go unanswered." },
  { day: "Day 21–30", event: "Response posture finally established. Q3 initiatives now 4–6 weeks behind." },
  { day: "Week 8+", event: "GTM Launch delayed to Q4. M&A integration stalled. $3.2M in reactive consulting fees." },
];

export default function PlannedUnplannedDemo() {
  const [activeAct, setActiveAct] = useState<1 | 2 | 3 | 4>(1);
  const [activatedTask, setActivatedTask] = useState(0);
  const [triggerFired, setTriggerFired] = useState(false);
  const [showBothTracks, setShowBothTracks] = useState(false);

  useEffect(() => {
    updatePageMetadata({
      title: "The Complete Operating Model Demo — Readiness OS",
      description: "The only demo that shows planned and unplanned work executing simultaneously. Q3 initiatives continue while a ransomware trigger activates in 12 minutes. One system. Both tracks.",
    });
  }, []);

  useEffect(() => {
    if (activeAct !== 3) return;
    setTriggerFired(true);
    setShowBothTracks(false);
    const t1 = setTimeout(() => setShowBothTracks(true), 800);
    let task = 0;
    const interval = setInterval(() => {
      task++;
      setActivatedTask(task);
      if (task >= UNPLANNED_TASKS.length) clearInterval(interval);
    }, 900);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, [activeAct]);

  return (
    <PageLayout>
      <div style={{ background: "#fff", minHeight: "100vh" }}>

        {/* HERO */}
        <section style={{ background: NAVY, padding: "72px 48px 64px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${TEAL}, ${GOLD})` }} />
          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <div style={{ width: 24, height: 1, background: GOLD }} />
              <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD }}>Complete Operating Model · Planned + Unplanned</span>
              <div style={{ width: 24, height: 1, background: GOLD }} />
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(34px,4.5vw,58px)", fontWeight: 600, color: "#fff", lineHeight: 1.07, marginBottom: 20 }}>
              Your Q3 plan is running.<br />
              <span style={{ color: GOLD }}>A trigger fires. Both respond.</span>
            </h1>
            <p style={{ ...BAR, fontSize: 17, color: "rgba(255,255,255,0.62)", lineHeight: 1.75, maxWidth: 640, marginBottom: 40 }}>
              Every demo in the industry shows what happens when a trigger fires. This is the only one that shows what happens when a trigger fires <em>while your quarterly work is already running</em> — and neither one stops.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, maxWidth: 600 }}>
              {[
                { v: "3", l: "Planned initiatives running" },
                { v: "1", l: "Unplanned trigger fires" },
                { v: "12 min", l: "Response without stopping Q3" },
              ].map(({ v, l }) => (
                <div key={v} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{v}</div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACT NAVIGATION */}
        <div style={{ background: "#F8F7F4", borderBottom: `1px solid ${BD}`, position: "sticky", top: 0, zIndex: 20 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex" }}>
            {([
              { act: 1 as const, label: "01 — The Quarter Begins", short: "Q3 Staged" },
              { act: 2 as const, label: "02 — The Trigger Fires", short: "4:23 AM" },
              { act: 3 as const, label: "03 — Both Tracks Run", short: "Dual Active" },
              { act: 4 as const, label: "04 — The Model", short: "The Close" },
            ] as const).map(({ act, label }) => (
              <button
                key={act}
                onClick={() => setActiveAct(act)}
                style={{
                  flex: 1, padding: "14px 12px", border: "none", borderBottom: `2px solid ${activeAct === act ? GOLD : "transparent"}`,
                  background: activeAct === act ? "rgba(201,168,76,0.06)" : "transparent",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: activeAct === act ? NAVY : MUTED }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ACT 1 — THE QUARTER BEGINS */}
        {activeAct === 1 && (
          <section style={{ padding: "64px 48px" }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 20, height: 1.5, background: GOLD }} />
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD }}>June 1 · Q3 Begins</span>
              </div>
              <h2 style={{ ...CG, fontSize: 36, fontWeight: 600, color: NAVY, marginBottom: 12, lineHeight: 1.15 }}>
                Leadership stages the quarter.<br />Three initiatives. All pre-built.
              </h2>
              <p style={{ ...BAR, fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginBottom: 40, maxWidth: 620 }}>
                Before Q3 begins, every initiative is pre-staged in Readiness OS — owners assigned, budgets approved, tasks sequenced, executive authority defined. The quarter doesn't start with a planning meeting. It starts with execution already underway.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {PLANNED_INITIATIVES.map(p => (
                  <div key={p.protocol} style={{ background: "#fff", border: `1px solid ${BD}`, borderLeft: `3px solid ${p.color}`, overflow: "hidden" }}>
                    <div style={{ padding: "20px 28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}40`, padding: "2px 8px" }}>{p.domain}</span>
                          <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: MUTED }}>Protocol {p.protocol}</span>
                        </div>
                        <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{p.name}</div>
                        <p style={{ ...BAR, fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>{p.description}</p>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: "right", minWidth: 140 }}>
                        <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 8 }}>● {p.status}</div>
                        <div style={{ ...BAR, fontSize: 12, color: MUTED, marginBottom: 4 }}>{p.owner}</div>
                        <div style={{ ...BAR, fontSize: 12, color: MUTED, marginBottom: 12 }}>{p.week} · {p.tasks} tasks</div>
                        <div style={{ height: 4, background: "#F0EDE4", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${p.progress}%`, background: p.color, transition: "width 1s ease" }} />
                        </div>
                        <div style={{ ...BAR, fontSize: 10, color: MUTED, marginTop: 4 }}>{p.progress}% complete</div>
                      </div>
                    </div>
                    <div style={{ padding: "10px 28px", background: "#FAFAF9", borderTop: `1px solid ${BD}`, display: "flex", gap: 24 }}>
                      <span style={{ ...BC, fontSize: 9, color: MUTED }}>Budget: <strong style={{ color: NAVY }}>{p.budget}</strong></span>
                      <span style={{ ...BC, fontSize: 9, color: MUTED }}>Pre-authorized · No approvals needed at activation</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 36, padding: "20px 28px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                  These initiatives continue on this schedule — unless something interrupts them.
                </p>
                <button
                  onClick={() => setActiveAct(2)}
                  style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, border: "none", padding: "12px 24px", cursor: "pointer" }}
                >
                  See What Interrupts → 
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ACT 2 — THE TRIGGER */}
        {activeAct === 2 && (
          <section style={{ padding: "64px 48px" }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 20, height: 1.5, background: "#DC2626" }} />
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#DC2626" }}>July 15 · Week 6 · 4:23 AM</span>
              </div>
              <h2 style={{ ...CG, fontSize: 36, fontWeight: 600, color: NAVY, marginBottom: 12, lineHeight: 1.15 }}>
                The trigger that wasn't<br />on any roadmap.
              </h2>
              <p style={{ ...BAR, fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginBottom: 40, maxWidth: 620 }}>
                Week 6 of Q3. The GTM Launch is 50% staged. M&A integration is underway. Then: ransomware. 23 servers encrypted. SWIFT offline. Not planned. Not scheduled. Not on anyone's Q3 roadmap.
              </p>

              {/* Trigger signal */}
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderLeft: "4px solid #DC2626", padding: "24px 28px", marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626", animation: "pulse 1.5s infinite" }} />
                  <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: "#DC2626" }}>CRITICAL ALERT — 4:23:17 AM EST</span>
                </div>
                <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Ransomware Detected — 23 Servers Encrypted</div>
                <p style={{ ...BAR, fontSize: 13, color: "#6B7280", lineHeight: 1.65, margin: 0 }}>
                  SIEM Alert: 23 production servers encrypted across payment processing infrastructure. Ransom note detected. SWIFT integration offline. Data exfiltration indicator flagged. Risk score: 94/100 (CRITICAL). Protocol #31 — Ransomware Response matched. This event was not in any quarterly plan.
                </p>
              </div>

              {/* Old model vs new model */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 40 }}>
                <div style={{ padding: "28px", background: "#FEF2F2", border: "1px solid #FECACA" }}>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#DC2626", marginBottom: 16 }}>Without Readiness OS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {OLD_MODEL_DAYS.map(d => (
                      <div key={d.day} style={{ display: "flex", gap: 12 }}>
                        <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#DC2626", flexShrink: 0, width: 60 }}>{d.day}</span>
                        <span style={{ ...BAR, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{d.event}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, padding: "12px", background: "#fff", border: "1px solid #FECACA" }}>
                    <div style={{ ...CG, fontSize: 16, fontWeight: 700, color: "#DC2626" }}>Q3 initiatives lost 4–6 weeks.</div>
                    <div style={{ ...BAR, fontSize: 11, color: MUTED, marginTop: 2 }}>$3.2M in reactive advisory fees. GTM Launch delayed to Q4.</div>
                  </div>
                </div>
                <div style={{ padding: "28px", background: "rgba(43,138,110,0.04)", border: "1px solid rgba(43,138,110,0.25)" }}>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>With Readiness OS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { t: "T+0:45", e: "Protocol #31 matched. 8 tasks assigned. Advisors on standby." },
                      { t: "T+1:10", e: "CEO authorizes. Response track activated alongside Q3 work." },
                      { t: "T+2:00", e: "FBI Cyber Division notified. Pre-authorized contact on file." },
                      { t: "T+4:30", e: "Board briefed. GTM Launch and M&A Integration: unaffected." },
                      { t: "T+12:00", e: "Ransomware contained. Q3 roadmap resumes on original schedule." },
                    ].map(d => (
                      <div key={d.t} style={{ display: "flex", gap: 12 }}>
                        <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: TEAL, flexShrink: 0, width: 60 }}>{d.t}</span>
                        <span style={{ ...BAR, fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{d.e}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, padding: "12px", background: "#fff", border: `1px solid rgba(43,138,110,0.25)` }}>
                    <div style={{ ...CG, fontSize: 16, fontWeight: 700, color: TEAL }}>Q3 initiatives: zero disruption.</div>
                    <div style={{ ...BAR, fontSize: 11, color: MUTED, marginTop: 2 }}>Both tracks ran simultaneously. Neither stalled.</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveAct(3)}
                style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: NAVY, border: "none", padding: "14px 32px", cursor: "pointer" }}
              >
                See Both Tracks Running →
              </button>
            </div>
          </section>
        )}

        {/* ACT 3 — BOTH TRACKS */}
        {activeAct === 3 && (
          <section style={{ padding: "64px 48px" }}>
            <div style={{ maxWidth: 920, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 20, height: 1.5, background: TEAL }} />
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: TEAL }}>July 15 · 4:35 AM · Both Tracks Active</span>
              </div>
              <h2 style={{ ...CG, fontSize: 36, fontWeight: 600, color: NAVY, marginBottom: 12, lineHeight: 1.15 }}>
                The CEO didn't have to choose.
              </h2>
              <p style={{ ...BAR, fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginBottom: 36, maxWidth: 660 }}>
                12 minutes after the trigger. The ransomware response is active. The Q3 roadmap is still running. The executive authorized one response — the system handled both tracks.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 3 }}>
                {/* PLANNED TRACK */}
                <div style={{ background: NAVY, border: `1px solid rgba(201,168,76,0.3)`, borderTop: `3px solid ${GOLD}`, padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E88" }} />
                    <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>Planned Track — Q3 Initiatives</span>
                  </div>
                  {PLANNED_INITIATIVES.map(p => (
                    <div key={p.protocol} style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid rgba(201,168,76,0.15)`, borderLeft: `2px solid ${p.color}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: p.color, textTransform: "uppercase", marginBottom: 3 }}>Protocol {p.protocol}</div>
                          <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.name}</div>
                        </div>
                        <span style={{ ...BC, fontSize: 7, fontWeight: 800, letterSpacing: "0.2em", color: "#22C55E", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", padding: "2px 7px" }}>● ON TRACK</span>
                      </div>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${p.progress}%`, background: p.color }} />
                      </div>
                      <div style={{ ...BAR, fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 5 }}>{p.week} · {p.progress}% complete</div>
                    </div>
                  ))}
                </div>

                {/* UNPLANNED TRACK */}
                <div style={{ background: NAVY, border: "1px solid rgba(220,38,38,0.3)", borderTop: "3px solid #DC2626", padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#DC2626", boxShadow: "0 0 6px rgba(220,38,38,0.6)" }} />
                    <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#DC2626" }}>Unplanned Track — Ransomware Response</span>
                  </div>
                  <div style={{ marginBottom: 16, padding: "10px 14px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}>
                    <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: "#DC2626", textTransform: "uppercase", marginBottom: 2 }}>Protocol #31 — Ransomware Response · CEO Authorized</div>
                    <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.55)" }}>8 tasks · $4.5M pre-authorized · FBI on standby</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {UNPLANNED_TASKS.map((t, i) => {
                      const visible = showBothTracks && i < activatedTask;
                      return (
                        <div
                          key={t.id}
                          style={{
                            padding: "10px 14px",
                            background: visible ? (t.done ? "rgba(43,138,110,0.12)" : "rgba(255,255,255,0.04)") : "rgba(255,255,255,0.02)",
                            border: `1px solid ${visible ? (t.done ? "rgba(43,138,110,0.3)" : "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.05)"}`,
                            transition: "all 0.5s ease",
                            opacity: visible ? 1 : 0.3,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ ...BC, fontSize: 8, fontWeight: 700, color: TEAL, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>{t.owner} · {t.timing}</div>
                              <div style={{ ...BAR, fontSize: 11, color: visible ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>{t.task}</div>
                            </div>
                            {visible && <div style={{ ...BC, fontSize: 9, color: t.done ? "#22C55E" : GOLD, flexShrink: 0 }}>{t.done ? "✓" : "⟳"}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* The key insight bar */}
              <div style={{ padding: "28px 36px", background: `linear-gradient(135deg, ${NAVY}, #1a2860)`, border: `1px solid rgba(201,168,76,0.3)`, display: "flex", alignItems: "center", gap: 32 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>The complete operating model — both tracks. One system.</div>
                  <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.7 }}>
                    3 planned initiatives continued on schedule. 1 unplanned trigger activated in 12 minutes. The CEO made one decision. Readiness OS ran both tracks simultaneously — no committee, no delay, no choice between them.
                  </p>
                </div>
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <div style={{ ...CG, fontSize: 42, fontWeight: 700, color: GOLD, lineHeight: 1 }}>4</div>
                  <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: 4 }}>Active Protocols</div>
                  <div style={{ ...BC, fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>3 planned · 1 unplanned</div>
                </div>
              </div>

              <div style={{ marginTop: 32, textAlign: "center" }}>
                <button
                  onClick={() => setActiveAct(4)}
                  style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, border: "none", padding: "14px 36px", cursor: "pointer" }}
                >
                  See the Complete Model →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ACT 4 — THE CLOSE */}
        {activeAct === 4 && (
          <section style={{ padding: "64px 48px" }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 20, height: 1.5, background: TEAL }} />
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: TEAL }}>The Complete Operating Model</span>
              </div>
              <h2 style={{ ...CG, fontSize: 36, fontWeight: 600, color: NAVY, marginBottom: 20, lineHeight: 1.15 }}>
                Any system that covers only what you plan for<br />covers half your strategic surface.
              </h2>
              <p style={{ ...BAR, fontSize: 16, color: "#4B5563", lineHeight: 1.85, marginBottom: 48, maxWidth: 680 }}>
                Every enterprise has a planning process. Quarterly reviews, strategic roadmaps, annual plans. None of them cover the 231 trigger patterns that arrive regardless of the roadmap. Most enterprise losses in the last decade didn't come from bad plans — they came from situations that <em>interrupted</em> the plan.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 48 }}>
                {[
                  { label: "What you plan for", items: ["GTM launches", "M&A integrations", "Product rollouts", "Workforce transformations", "Regulatory filings", "Board initiatives"], color: GOLD, icon: "📋" },
                  { label: "What arrives anyway", items: ["Activist investor at 2:47 AM", "Ransomware at 4:23 AM", "FDA recall at 7 PM", "DOJ inquiry on a Tuesday", "Supply chain collapse", "Competitor announcement"], color: "#DC2626", icon: "⚡" },
                ].map(({ label, items, color, icon }) => (
                  <div key={label} style={{ padding: "32px 28px", background: "#fff", border: `1px solid ${BD}`, borderTop: `3px solid ${color}` }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                    <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color, marginBottom: 16 }}>{label}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {items.map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 4, height: 4, background: color, flexShrink: 0 }} />
                          <span style={{ ...BAR, fontSize: 13, color: "#374151" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "40px 48px", background: NAVY, position: "relative", overflow: "hidden", marginBottom: 48 }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: GOLD }} />
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>The Only System That Covers Both</div>
                <p style={{ ...CG, fontSize: 28, fontWeight: 600, color: "#fff", lineHeight: 1.35, marginBottom: 16 }}>
                  "The response is ready before the trigger fires — whether you expected it or not."
                </p>
                <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.75, maxWidth: 600, margin: 0 }}>
                  Readiness OS pre-stages both your planned strategic work and your unplanned trigger responses in the same system. One dashboard. One authorization. One operating model for everything your organization will face — anticipated or not.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 48 }}>
                {[
                  { v: "180", l: "Readiness Protocols", sub: "Covering planned and unplanned" },
                  { v: "231", l: "Trigger Patterns", sub: "Monitored continuously" },
                  { v: "3,600×", l: "Execution Head Start", sub: "30 days → 12 minutes" },
                ].map(({ v, l, sub }) => (
                  <div key={v} style={{ padding: "28px 24px", background: "#fff", border: `1px solid ${BD}`, textAlign: "center" }}>
                    <div style={{ ...CG, fontSize: 40, fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 6 }}>{v}</div>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: NAVY, marginBottom: 4 }}>{l}</div>
                    <div style={{ ...BAR, fontSize: 11, color: MUTED }}>{sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/request-access">
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, padding: "16px 36px", cursor: "pointer", display: "inline-block" }}>
                    Apply for Founding Partner Access →
                  </div>
                </Link>
                <Link href="/demo-hub">
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: "transparent", border: `1px solid ${BD}`, padding: "16px 36px", cursor: "pointer", display: "inline-block" }}>
                    See All 12 Scenarios
                  </div>
                </Link>
                <Link href="/how-it-executes">
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: TEAL, background: "transparent", border: `1px solid rgba(43,138,110,0.3)`, padding: "16px 36px", cursor: "pointer", display: "inline-block" }}>
                    Watch the Execution Chain
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* STICKY CTA BOTTOM */}
        <div style={{ background: "#F8F7F4", borderTop: `1px solid ${BD}`, padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <VaughnMartinLogo color="dark" height={26} variant="full" />
          <p style={{ ...BAR, fontSize: 13, color: MUTED, margin: 0 }}>
            The response is ready before the trigger fires — whether you expected it or not.
          </p>
          <Link href="/request-access">
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, padding: "10px 22px", cursor: "pointer" }}>
              Apply for Access →
            </div>
          </Link>
        </div>

      </div>
    </PageLayout>
  );
}
