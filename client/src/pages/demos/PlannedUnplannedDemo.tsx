import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { updatePageMetadata } from "@/lib/seo";
import PageLayout from "@/components/layout/PageLayout";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const RED   = "#DC2626";
const IVORY = "#F0EDE4";
const MUTED = "#6B7280";
const BD    = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const BAR: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };

type Phase = "identify" | "define" | "execute" | "advance";
const PHASES: { key: Phase; label: string; sub: string }[] = [
  { key: "identify", label: "I — Identify",  sub: "Signal & Pattern" },
  { key: "define",   label: "D — Define",    sub: "Protocol Staging" },
  { key: "execute",  label: "E — Execute",   sub: "Dual-Track War Room" },
  { key: "advance",  label: "A — Advance",   sub: "Learning Loop" },
];

const PLANNED = [
  { id: "#22", name: "GTM Launch Sprint",      domain: "GROWTH & POSITIONING", owner: "Chief Revenue Officer",  week: "Week 6 of 12", pct: 50, tasks: 14, budget: "$1.8M", color: GOLD,
    desc: "6-market simultaneous launch — distribution partners staged, regional leads briefed, revenue pipeline active." },
  { id: "#58", name: "M&A Integration Sprint", domain: "TRANSFORMATION",       owner: "Chief Strategy Officer", week: "Week 3 of 16", pct: 19, tasks: 22, budget: "$4.2M", color: TEAL,
    desc: "Waypoint acquisition integration — legal entity consolidation, systems migration sequenced, leadership aligned." },
  { id: "#89", name: "Product Rollout",         domain: "TRANSFORMATION",       owner: "Chief Product Officer",  week: "Week 1 of 8",  pct: 12, tasks: 11, budget: "$600K", color: TEAL,
    desc: "Enterprise rollout — customer success briefed, implementation partners staged, go-live sequence locked." },
];

const SIGNALS = [
  { t: "04:18:52", src: "SIEM", msg: "Anomalous encryption activity — 7 production servers", score: 42 },
  { t: "04:21:09", src: "SIEM", msg: "Encryption cascade — 23 servers affected, SWIFT integration offline", score: 71 },
  { t: "04:22:44", src: "THREAT-INT", msg: "Ransomware signature matched: LockBit variant detected", score: 88 },
  { t: "04:23:17", src: "PATTERN", msg: "231-trigger library: RANSOMWARE ATTACK — Protocol #31 confidence 97%", score: 94 },
];

const DEFINE_TASKS = [
  { owner: "CISO",           task: "Declare incident. Isolate 23 affected servers. Preserve forensic state.", budget: "In-scope", timing: "T+0:00" },
  { owner: "CEO",            task: "Authorize Protocol #31 — Ransomware Response. Full activation.", budget: "$4.5M released", timing: "T+0:47" },
  { owner: "General Counsel",task: "Notify FBI Cyber Division — pre-authorized contact on file. No research needed.", budget: "In-scope", timing: "T+1:00" },
  { owner: "CFO",            task: "Engage cyber insurer. Release pre-authorized $4.5M response budget.", budget: "$4.5M", timing: "T+1:15" },
  { owner: "Board Chair",    task: "Emergency board call — 6:00 AM brief pre-staged and ready.", budget: "In-scope", timing: "T+2:30" },
  { owner: "CCO",            task: "Customer holding statement — pre-staged. Approve and release.", budget: "In-scope", timing: "T+3:00" },
  { owner: "CTO",            task: "Engage forensic firm — pre-vetted, pre-contracted. Recovery sequence initiated.", budget: "$380K", timing: "T+5:00" },
  { owner: "CEO",            task: "Board briefed before market open. SEC regulatory disclosure filed.", budget: "In-scope", timing: "T+11:30" },
];

const ADVANCE_LEARNINGS = [
  {
    finding: "FBI notification took T+1:15 — protocol expected T+0:45",
    hypothesis: "Pre-authorize FBI Cyber Division contact into protocol activation package — zero research at trigger time",
    impact: "−30 min estimated next activation",
    status: "AUTO-APPLIED",
    protocols: 6,
    statusColor: TEAL,
  },
  {
    finding: "Board brief generated at T+4:00 — target was T+2:30",
    hypothesis: "Stage board brief template during protocol load, not at authorization — 90-second generation vs. 20-minute assembly",
    impact: "−1h 30m estimated next activation",
    status: "EXEC REVIEW",
    protocols: 12,
    statusColor: GOLD,
  },
  {
    finding: "Q3 initiatives: zero resource conflicts detected across 47 active tasks",
    hypothesis: "Continuity confirmed — planned + unplanned resource pools are correctly partitioned",
    impact: "Protocol architecture validated",
    status: "PROVEN",
    protocols: 180,
    statusColor: TEAL,
  },
];

/* ── Utility ── */
function Label({ children, color = GOLD }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color }}>
      {children}
    </span>
  );
}

function GoldRule() {
  return <div style={{ width: 32, height: 1.5, background: GOLD, marginBottom: 12 }} />;
}

/* ── Phase progress bar ── */
function PhaseBar({ active, onSelect }: { active: Phase; onSelect: (p: Phase) => void }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#fff", borderBottom: `1px solid ${BD}`, boxShadow: "0 1px 8px rgba(10,15,46,0.06)" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {PHASES.map((p, i) => {
          const idx = PHASES.findIndex(x => x.key === active);
          const done = i < idx;
          const cur  = p.key === active;
          return (
            <button key={p.key} onClick={() => onSelect(p.key)}
              style={{ padding: "14px 16px", border: "none", borderBottom: `3px solid ${cur ? GOLD : done ? TEAL : "transparent"}`,
                background: cur ? "rgba(201,168,76,0.05)" : "transparent", cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: cur ? NAVY : done ? TEAL : MUTED }}>
                {done ? "✓ " : ""}{p.label}
              </div>
              <div style={{ ...BC, fontSize: 8, color: cur ? GOLD : MUTED, marginTop: 2 }}>{p.sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   IDENTIFY
──────────────────────────────────────────────── */
function PhaseIdentify({ onNext }: { onNext: () => void }) {
  const [visibleSignals, setVisibleSignals] = useState(0);
  const [score, setScore] = useState(0);
  const done = visibleSignals >= SIGNALS.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setVisibleSignals(0);
    setScore(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVisibleSignals(i);
      setScore(SIGNALS[Math.min(i - 1, SIGNALS.length - 1)].score);
      if (i >= SIGNALS.length) clearInterval(t);
    }, 1100);
    timerRef.current = t;
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ padding: "60px 48px", maxWidth: 1040, margin: "0 auto" }}>
      <GoldRule />
      <Label>July 15 · 4:18 AM · System Active</Label>
      <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, color: NAVY, marginTop: 12, marginBottom: 12, lineHeight: 1.1 }}>
        The system sees it before anyone wakes up.
      </h2>
      <p style={{ ...BAR, fontSize: 15, color: "#4B5563", lineHeight: 1.8, maxWidth: 680, marginBottom: 48 }}>
        Continuous monitoring against 231 trigger patterns. When ransomware starts encrypting at 4:18 AM, no one calls an emergency committee. The system identifies the pattern, scores the risk, and matches the protocol — automatically.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        {/* LEFT — Q3 running */}
        <div>
          <div style={{ padding: "16px 20px", background: NAVY, borderTop: `3px solid ${GOLD}`, marginBottom: 2 }}>
            <Label>Planned Track — Q3 Active</Label>
            <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>3 protocols executing on schedule</div>
          </div>
          {PLANNED.map(p => (
            <div key={p.id} style={{ padding: "16px 20px", background: "#fff", border: `1px solid ${BD}`, borderLeft: `3px solid ${p.color}`, marginBottom: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ ...BC, fontSize: 8, color: p.color, fontWeight: 700, letterSpacing: "0.15em" }}>Protocol {p.id}</div>
                  <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: NAVY, marginTop: 2 }}>{p.name}</div>
                </div>
                <span style={{ ...BC, fontSize: 8, color: "#16A34A", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", padding: "3px 8px", fontWeight: 700, letterSpacing: "0.15em" }}>● ON TRACK</span>
              </div>
              <div style={{ height: 4, background: "#F0EDE4", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", width: `${p.pct}%`, background: p.color }} />
              </div>
              <div style={{ ...BAR, fontSize: 10, color: MUTED }}>{p.week} · {p.pct}% · {p.tasks} tasks · {p.budget} pre-staged</div>
            </div>
          ))}
          <div style={{ padding: "14px 20px", background: "rgba(43,138,110,0.06)", border: `1px solid rgba(43,138,110,0.2)` }}>
            <div style={{ ...BC, fontSize: 9, color: TEAL, fontWeight: 700, letterSpacing: "0.15em" }}>MONITORING ACTIVE · 231 TRIGGER PATTERNS · 15-MIN CADENCE</div>
            <div style={{ ...BAR, fontSize: 11, color: "#374151", marginTop: 4 }}>System watches 8 signal feeds continuously while planned work executes.</div>
          </div>
        </div>

        {/* RIGHT — signal feed */}
        <div>
          <div style={{ padding: "16px 20px", background: "#1a0a0a", borderTop: `3px solid ${RED}`, marginBottom: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Label color={RED}>Unplanned Signal Detected</Label>
              {score > 0 && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: score >= 75 ? RED : score >= 35 ? GOLD : "#22C55E", lineHeight: 1 }}>{score}</div>
                  <div style={{ ...BC, fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>RISK SCORE</div>
                </div>
              )}
            </div>
            <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Live signal stream · Pattern matching in progress</div>
          </div>

          <div style={{ background: "#0d0d0d", border: "1px solid rgba(220,38,38,0.2)", padding: "20px", minHeight: 280 }}>
            {SIGNALS.slice(0, visibleSignals).map((s, i) => (
              <div key={i} style={{ marginBottom: 16, padding: "12px 14px", background: i === visibleSignals - 1 ? "rgba(220,38,38,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === visibleSignals - 1 ? "rgba(220,38,38,0.35)" : "rgba(255,255,255,0.06)"}`,
                animation: "fadeUp 0.4s ease" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                  <span style={{ ...BC, fontSize: 8, color: RED, fontWeight: 700, letterSpacing: "0.1em" }}>{s.t}</span>
                  <span style={{ ...BC, fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>{s.src}</span>
                  <span style={{ ...BC, fontSize: 8, color: s.score >= 75 ? RED : GOLD, letterSpacing: "0.1em", marginLeft: "auto" }}>SCORE {s.score}</span>
                </div>
                <div style={{ ...BAR, fontSize: 12, color: i === visibleSignals - 1 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{s.msg}</div>
              </div>
            ))}
            {!done && (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: RED, animation: "pulse 1s infinite" }} />
                <span style={{ ...BC, fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em" }}>SCANNING · {231 - visibleSignals * 57} PATTERNS REMAINING</span>
              </div>
            )}
          </div>

          {done && (
            <div style={{ padding: "18px 20px", background: "#1a0a0a", border: "1px solid rgba(220,38,38,0.4)", borderTop: `3px solid ${RED}`, marginTop: 2 }}>
              <div style={{ ...BC, fontSize: 9, color: RED, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 6 }}>⚡ PATTERN CONFIRMED — 4:23:17 AM</div>
              <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Ransomware Attack · Protocol #31 Match · 97% Confidence</div>
              <div style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>23 servers encrypted · SWIFT offline · $4.5M response budget pre-authorized · Executive Brief assembling</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 40, padding: "28px 36px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
        <div>
          <div style={{ ...BC, fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: "0.25em", marginBottom: 6 }}>WHAT JUST HAPPENED IN IDENTIFY</div>
          <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.7 }}>
            System detected anomalous encryption at 4:18 AM. Pattern-matched against 231 signatures. Risk scored 94/100. Protocol #31 queued. Zero humans woken up for this step — it runs 24/7.
          </p>
        </div>
        {done && (
          <button onClick={onNext} style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, border: "none", padding: "14px 28px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            Define Phase →
          </button>
        )}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   DEFINE
──────────────────────────────────────────────── */
function PhaseDefine({ onNext }: { onNext: () => void }) {
  const [visibleTasks, setVisibleTasks] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const done = visibleTasks >= DEFINE_TASKS.length;

  useEffect(() => {
    setVisibleTasks(0);
    setElapsed(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVisibleTasks(i);
      setElapsed(prev => prev + Math.round(5 + Math.random() * 4));
      if (i >= DEFINE_TASKS.length) clearInterval(t);
    }, 700);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ padding: "60px 48px", maxWidth: 1040, margin: "0 auto" }}>
      <GoldRule />
      <Label>4:23 AM · Protocol Library · 47 Seconds</Label>
      <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, color: NAVY, marginTop: 12, marginBottom: 12, lineHeight: 1.1 }}>
        One track was already defined.<br />The other one assembled itself in 47 seconds.
      </h2>
      <p style={{ ...BAR, fontSize: 15, color: "#4B5563", lineHeight: 1.8, maxWidth: 700, marginBottom: 48 }}>
        The traditional Define phase takes 3–4 weeks: scope the response, hire advisors, map stakeholders, draft the brief, get budget approval. Readiness OS compresses that to 47 seconds for an unplanned trigger — and to zero seconds for planned work, because it was already staged before Q3 started.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 3 }}>
        {/* LEFT — planned already defined */}
        <div>
          <div style={{ padding: "18px 24px", background: "#F8F7F4", border: `1px solid ${BD}`, borderTop: `3px solid ${GOLD}`, marginBottom: 2 }}>
            <Label color={GOLD}>Planned Track — Already Defined</Label>
            <div style={{ ...BAR, fontSize: 12, color: "#374151", marginTop: 8, lineHeight: 1.6 }}>
              Every Q3 initiative was staged before the quarter began. Tasks assigned. Budgets approved. Owners confirmed. Executive authority defined.
            </div>
          </div>
          {PLANNED.map(p => (
            <div key={p.id} style={{ padding: "18px 24px", background: "#fff", border: `1px solid ${BD}`, borderLeft: `3px solid ${p.color}`, marginBottom: 2 }}>
              <div style={{ ...BC, fontSize: 8, color: p.color, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 4 }}>Protocol {p.id} · {p.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { l: "Tasks", v: `${p.tasks} sequenced` },
                  { l: "Owner", v: p.owner.split(" ").pop()! },
                  { l: "Budget", v: `${p.budget} pre-authorized` },
                  { l: "Brief", v: "Staged & ready" },
                ].map(({ l, v }) => (
                  <div key={l} style={{ padding: "8px 10px", background: "#FAFAF9", border: `1px solid ${BD}` }}>
                    <div style={{ ...BC, fontSize: 8, color: MUTED, letterSpacing: "0.1em" }}>{l}</div>
                    <div style={{ ...BAR, fontSize: 11, fontWeight: 700, color: NAVY, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ padding: "14px 24px", background: `rgba(201,168,76,0.06)`, border: `1px solid rgba(201,168,76,0.25)`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 20 }}>⏱</div>
            <div>
              <div style={{ ...BC, fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: "0.15em" }}>Define Time: 0 seconds</div>
              <div style={{ ...BAR, fontSize: 11, color: "#374151" }}>Planned work requires no Define phase at execution time — it was done in advance.</div>
            </div>
          </div>
        </div>

        {/* RIGHT — unplanned defining in real time */}
        <div>
          <div style={{ padding: "18px 24px", background: "#1a0a0a", borderTop: `3px solid ${RED}`, marginBottom: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Label color={RED}>Unplanned Track — Defining Now</Label>
              <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Protocol #31 · Ransomware Response</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: elapsed >= 47 ? "#22C55E" : GOLD, lineHeight: 1 }}>{Math.min(elapsed, 47)}s</div>
              <div style={{ ...BC, fontSize: 7, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>ELAPSED</div>
            </div>
          </div>

          <div style={{ background: "#0d0d0d", border: "1px solid rgba(220,38,38,0.15)", padding: "16px", marginBottom: 2, minHeight: 300 }}>
            <div style={{ ...BC, fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", marginBottom: 12 }}>TASKS ASSEMBLING FROM PROTOCOL LIBRARY —</div>
            {DEFINE_TASKS.slice(0, visibleTasks).map((t, i) => (
              <div key={i} style={{ marginBottom: 8, padding: "10px 12px", background: i === visibleTasks - 1 ? "rgba(43,138,110,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${i === visibleTasks - 1 ? "rgba(43,138,110,0.35)" : "rgba(255,255,255,0.06)"}`,
                animation: "fadeUp 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                  <span style={{ ...BC, fontSize: 8, color: TEAL, fontWeight: 700, letterSpacing: "0.1em" }}>{t.owner}</span>
                  <span style={{ ...BC, fontSize: 8, color: "rgba(255,255,255,0.35)" }}>{t.timing}</span>
                </div>
                <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, marginBottom: 4 }}>{t.task}</div>
                <div style={{ ...BC, fontSize: 8, color: GOLD }}>{t.budget}</div>
              </div>
            ))}
            {!done && (
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, animation: "pulse 0.8s infinite" }} />
                <span style={{ ...BC, fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>PROTOCOL LIBRARY LOADING TASKS…</span>
              </div>
            )}
          </div>

          {done && (
            <div style={{ padding: "14px 20px", background: "rgba(43,138,110,0.08)", border: `1px solid rgba(43,138,110,0.3)` }}>
              <div style={{ ...BC, fontSize: 9, color: TEAL, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 4 }}>✓ DEFINE COMPLETE — 47 SECONDS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
                {[["8", "Tasks"], ["$4.5M", "Budget"], ["6", "Stakeholders"], ["1", "Brief"]].map(([v, l]) => (
                  <div key={l} style={{ padding: "8px", background: "#fff", textAlign: "center" }}>
                    <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: TEAL }}>{v}</div>
                    <div style={{ ...BC, fontSize: 7, color: MUTED, letterSpacing: "0.1em" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...BAR, fontSize: 11, color: "#374151", marginTop: 10 }}>
                Old model: 3–4 weeks. Readiness OS: 47 seconds. Both tracks ready for Execute.
              </div>
            </div>
          )}
        </div>
      </div>

      {done && (
        <div style={{ marginTop: 32, padding: "28px 36px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div>
            <div style={{ ...BC, fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: "0.25em", marginBottom: 6 }}>WHAT JUST HAPPENED IN DEFINE</div>
            <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.7 }}>
              3 planned protocols: zero Define time — staged before Q3 began. 1 unplanned protocol: 47 seconds — 8 tasks, $4.5M budget, 6 stakeholders, executive brief. Both tracks ready for execution. CEO authorization next.
            </p>
          </div>
          <button onClick={onNext} style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, border: "none", padding: "14px 28px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            Open War Room →
          </button>
        </div>
      )}
    </section>
  );
}

/* ────────────────────────────────────────────────
   EXECUTE
──────────────────────────────────────────────── */
function PhaseExecute({ onNext }: { onNext: () => void }) {
  const [authorized, setAuthorized] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (!authorized) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVisibleTasks(i);
      if (i >= DEFINE_TASKS.length) clearInterval(t);
    }, 800);
    const timer = setInterval(() => {
      setMinutes(m => {
        if (m >= 12) { clearInterval(timer); setShowCTA(true); return 12; }
        return m + 1;
      });
    }, 500);
    return () => { clearInterval(t); clearInterval(timer); };
  }, [authorized]);

  return (
    <section style={{ padding: "60px 48px", maxWidth: 1040, margin: "0 auto" }}>
      <GoldRule />
      <Label color={authorized ? TEAL : GOLD}>
        {authorized ? `July 15 · 4:35 AM · Both Tracks Active · ${minutes} min elapsed` : "July 15 · 4:23 AM · Awaiting Authorization"}
      </Label>
      <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, color: NAVY, marginTop: 12, marginBottom: 12, lineHeight: 1.1 }}>
        {authorized ? "The CEO made one decision. Both tracks responded." : "One authorization. Both tracks activate."}
      </h2>
      <p style={{ ...BAR, fontSize: 15, color: "#4B5563", lineHeight: 1.8, maxWidth: 700, marginBottom: 40 }}>
        {authorized
          ? "12 minutes after the trigger. The Q3 roadmap is continuing. The ransomware response is executing. The CEO didn't pause the quarter — the system handled both simultaneously."
          : "The Executive Brief is assembled. The authorization package is ready. One click from the CEO activates the ransomware response — while the Q3 plan continues untouched."}
      </p>

      {/* Authorization moment */}
      {!authorized && (
        <div style={{ padding: "36px 40px", background: NAVY, border: `1px solid rgba(201,168,76,0.3)`, borderLeft: `4px solid ${GOLD}`, marginBottom: 40, maxWidth: 680 }}>
          <div style={{ ...BC, fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: "0.25em", marginBottom: 16 }}>EXECUTIVE AUTHORIZATION — CEO REQUIRED</div>
          <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Protocol #31 — Ransomware Response</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, marginBottom: 24 }}>
            {[["8 Tasks", "Pre-sequenced"], ["$4.5M", "Pre-authorized"], ["6 Stakeholders", "Pre-notified"], ["FBI", "Pre-authorized"]].map(([v, l]) => (
              <div key={v} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ ...CG, fontSize: 16, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 3 }}>{v}</div>
                <div style={{ ...BC, fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ ...BAR, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 24 }}>
            Q3 initiatives are unaffected. Activating this response does not pause, delay, or resource-conflict any planned protocol. Both tracks will run simultaneously.
          </div>
          <button
            onClick={() => setAuthorized(true)}
            style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: NAVY, background: GOLD, border: "none", padding: "16px 40px", cursor: "pointer", fontSize: "13px" }}>
            ⚡ CEO AUTHORIZES — ACTIVATE PROTOCOL #31
          </button>
        </div>
      )}

      {/* Dual war room */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        {/* Planned track */}
        <div>
          <div style={{ padding: "16px 20px", background: NAVY, borderTop: `3px solid ${GOLD}`, marginBottom: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Label>Planned Track — Q3 Continues</Label>
              <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>3 protocols unaffected</div>
            </div>
            <span style={{ ...BC, fontSize: 8, color: "#22C55E", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", padding: "3px 8px", fontWeight: 700 }}>● RUNNING</span>
          </div>
          {PLANNED.map(p => (
            <div key={p.id} style={{ padding: "16px 20px", background: authorized ? "rgba(43,138,110,0.03)" : "#fff", border: `1px solid ${authorized ? "rgba(43,138,110,0.2)" : BD}`, borderLeft: `3px solid ${p.color}`, marginBottom: 2, transition: "all 0.5s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ ...BC, fontSize: 8, color: p.color, fontWeight: 700, letterSpacing: "0.12em" }}>Protocol {p.id}</div>
                  <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: NAVY }}>{p.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...BC, fontSize: 8, color: "#22C55E", fontWeight: 700 }}>● NO CHANGE</div>
                  <div style={{ ...BAR, fontSize: 10, color: MUTED, marginTop: 2 }}>{p.week}</div>
                </div>
              </div>
              <div style={{ height: 4, background: "#F0EDE4", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", width: `${p.pct}%`, background: p.color }} />
              </div>
              <div style={{ ...BAR, fontSize: 10, color: MUTED }}>{p.pct}% · {p.tasks} tasks · {p.budget} pre-staged</div>
            </div>
          ))}
          {authorized && (
            <div style={{ padding: "14px 20px", background: "rgba(43,138,110,0.08)", border: `1px solid rgba(43,138,110,0.25)` }}>
              <div style={{ ...CG, fontSize: 16, fontWeight: 700, color: TEAL }}>Zero disruption to Q3.</div>
              <div style={{ ...BAR, fontSize: 12, color: "#374151", marginTop: 4 }}>47 active tasks across planned protocols — all continuing on original schedule.</div>
            </div>
          )}
        </div>

        {/* Unplanned track */}
        <div>
          <div style={{ padding: "16px 20px", background: "#1a0a0a", borderTop: `3px solid ${authorized ? TEAL : RED}`, marginBottom: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Label color={authorized ? TEAL : RED}>Unplanned Track — Ransomware Response</Label>
              <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Protocol #31 · {authorized ? "CEO Authorized" : "Awaiting Authorization"}</div>
            </div>
            {authorized && (
              <div style={{ textAlign: "right" }}>
                <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: minutes >= 12 ? "#22C55E" : GOLD, lineHeight: 1 }}>{minutes}:00</div>
                <div style={{ ...BC, fontSize: 7, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>MIN ELAPSED</div>
              </div>
            )}
          </div>

          <div style={{ background: "#0d0d0d", border: "1px solid rgba(220,38,38,0.1)", padding: "16px", minHeight: 300 }}>
            {!authorized && (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <div style={{ ...BC, fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em" }}>AWAITING CEO AUTHORIZATION</div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid rgba(201,168,76,0.3)`, margin: "16px auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ ...CG, fontSize: 18, color: GOLD }}>⏳</div>
                </div>
              </div>
            )}
            {authorized && DEFINE_TASKS.slice(0, visibleTasks).map((t, i) => (
              <div key={i} style={{ marginBottom: 8, padding: "10px 12px",
                background: i === visibleTasks - 1 ? "rgba(43,138,110,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${i === visibleTasks - 1 ? "rgba(43,138,110,0.35)" : "rgba(255,255,255,0.05)"}`,
                animation: "fadeUp 0.35s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                  <span style={{ ...BC, fontSize: 8, color: TEAL, fontWeight: 700, letterSpacing: "0.1em" }}>{t.owner}</span>
                  <span style={{ ...BC, fontSize: 8, color: "rgba(255,255,255,0.35)" }}>{t.timing}</span>
                  <span style={{ ...BC, fontSize: 8, color: "#22C55E" }}>✓</span>
                </div>
                <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{t.task}</div>
              </div>
            ))}
          </div>

          {authorized && visibleTasks >= DEFINE_TASKS.length && (
            <div style={{ padding: "14px 20px", background: "rgba(43,138,110,0.08)", border: `1px solid rgba(43,138,110,0.3)` }}>
              <div style={{ ...CG, fontSize: 16, fontWeight: 700, color: TEAL }}>Ransomware contained. 12 minutes.</div>
              <div style={{ ...BAR, fontSize: 12, color: "#374151", marginTop: 4 }}>All 8 response tasks complete. Q3 roadmap never paused.</div>
            </div>
          )}
        </div>
      </div>

      {showCTA && (
        <div style={{ marginTop: 32, padding: "28px 36px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div>
            <div style={{ ...BC, fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: "0.25em", marginBottom: 6 }}>WHAT JUST HAPPENED IN EXECUTE</div>
            <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.7 }}>
              CEO made one decision. Both tracks executed simultaneously. 3 planned protocols: zero disruption. 1 unplanned protocol: contained in 12 minutes. No committee. No delay. No choice between them.
            </p>
          </div>
          <button onClick={onNext} style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, border: "none", padding: "14px 28px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            See What the System Learned →
          </button>
        </div>
      )}
    </section>
  );
}

/* ────────────────────────────────────────────────
   ADVANCE
──────────────────────────────────────────────── */
function PhaseAdvance() {
  return (
    <section style={{ padding: "60px 48px", maxWidth: 1040, margin: "0 auto" }}>
      <GoldRule />
      <Label color={TEAL}>Advance · Learning Loop · Protocol Evolution</Label>
      <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,44px)", fontWeight: 600, color: NAVY, marginTop: 12, marginBottom: 12, lineHeight: 1.1 }}>
        Every activation makes the next one faster.<br />
        <span style={{ color: TEAL }}>This is the moat.</span>
      </h2>
      <p style={{ ...BAR, fontSize: 15, color: "#4B5563", lineHeight: 1.8, maxWidth: 700, marginBottom: 48 }}>
        The Close-Out Gate captures what held and what didn't. ADVANCE 2.0 creates causal hypotheses, auto-applies low-risk calibrations, routes ownership changes to executives, and measures proven improvements against the next activation. Competitors can copy a feature. They cannot copy 18 months of activation intelligence compounding into 180 protocols.
      </p>

      {/* Close-out gate */}
      <div style={{ padding: "28px 32px", background: "#F8F7F4", border: `1px solid ${BD}`, borderTop: `3px solid ${NAVY}`, marginBottom: 3 }}>
        <Label color={NAVY}>Close-Out Gate — Activation #31-07</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 20 }}>
          {[
            { q: "I. What held?", a: "FBI pre-authorization was decisive. Board brief staging eliminated 20-minute assembly. $4.5M budget release took 47 seconds — no negotiation." },
            { q: "II. What did not hold?", a: "FBI notification took T+1:15 vs. target T+0:45. Board brief was assembled at authorization, not during protocol load — 20-minute gap identified." },
            { q: "III. Preparation gap identified", a: "Pre-authorize FBI Cyber Division contact at protocol level (not activation level). Stage board brief template during load, not at CEO authorization." },
            { q: "IV. The one thing to encode", a: "Any financial-sector ransomware protocol must have pre-authorized regulatory contacts and board brief templates before Q1. No exceptions." },
          ].map(({ q, a }) => (
            <div key={q}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: NAVY, letterSpacing: "0.15em", marginBottom: 6 }}>{q}</div>
              <div style={{ ...BAR, fontSize: 13, color: "#374151", lineHeight: 1.65 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ADVANCE learnings */}
      <div style={{ marginBottom: 3 }}>
        <div style={{ padding: "16px 24px", background: NAVY, borderTop: `3px solid ${TEAL}`, marginBottom: 2 }}>
          <Label color={TEAL}>ADVANCE 2.0 — Causal Hypotheses Generated</Label>
          <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>System creates testable hypotheses · Measures against next activation · Classifies as Proven or Disproven</div>
        </div>
        {ADVANCE_LEARNINGS.map((l, i) => (
          <div key={i} style={{ padding: "20px 24px", background: "#fff", border: `1px solid ${BD}`, borderLeft: `3px solid ${l.statusColor}`, marginBottom: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...BC, fontSize: 8, color: MUTED, letterSpacing: "0.12em", marginBottom: 4 }}>FINDING</div>
                <div style={{ ...BAR, fontSize: 13, color: "#4B5563", lineHeight: 1.5 }}>{l.finding}</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: l.statusColor, background: `${l.statusColor}15`, border: `1px solid ${l.statusColor}40`, padding: "4px 10px" }}>{l.status}</span>
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "#FAFAF9", border: `1px solid ${BD}`, marginBottom: 10 }}>
              <div style={{ ...BC, fontSize: 8, color: MUTED, letterSpacing: "0.12em", marginBottom: 4 }}>HYPOTHESIS</div>
              <div style={{ ...BAR, fontSize: 13, color: NAVY, lineHeight: 1.5 }}>{l.hypothesis}</div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <span style={{ ...BC, fontSize: 9, color: TEAL }}>Expected impact: <strong>{l.impact}</strong></span>
              <span style={{ ...BC, fontSize: 9, color: MUTED }}>Protocols updated: <strong style={{ color: NAVY }}>{l.protocols}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Protocol version delta */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 48 }}>
        <div style={{ padding: "24px 28px", background: "#F8F7F4", border: `1px solid ${BD}` }}>
          <Label color={NAVY}>Protocol #31 — Version Delta</Label>
          <div style={{ display: "flex", gap: 20, marginTop: 16, marginBottom: 16 }}>
            <div style={{ textAlign: "center", padding: "12px 20px", background: "#fff", border: `1px solid ${BD}` }}>
              <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: MUTED }}>v2.1</div>
              <div style={{ ...BC, fontSize: 8, color: MUTED, letterSpacing: "0.1em" }}>BEFORE</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: GOLD, ...CG, fontSize: 20 }}>→</div>
            <div style={{ textAlign: "center", padding: "12px 20px", background: "rgba(43,138,110,0.06)", border: `1px solid rgba(43,138,110,0.3)` }}>
              <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: TEAL }}>v2.2</div>
              <div style={{ ...BC, fontSize: 8, color: TEAL, letterSpacing: "0.1em" }}>AFTER</div>
            </div>
          </div>
          {[
            { change: "FBI pre-authorization added to activation package", applied: "Auto-applied" },
            { change: "Board brief template staged at protocol load", applied: "Exec review" },
            { change: "Financial sector contact list pre-populated", applied: "Auto-applied" },
          ].map(({ change, applied }) => (
            <div key={change} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "8px 0", borderBottom: `1px solid ${BD}` }}>
              <div style={{ ...BAR, fontSize: 12, color: "#374151", flex: 1 }}>{change}</div>
              <span style={{ ...BC, fontSize: 8, color: applied === "Auto-applied" ? TEAL : GOLD, flexShrink: 0 }}>{applied}</span>
            </div>
          ))}
          <div style={{ ...BAR, fontSize: 11, color: TEAL, marginTop: 12 }}>Expected improvement next activation: −30 min</div>
        </div>

        {/* Learning Velocity Index */}
        <div style={{ padding: "24px 28px", background: NAVY }}>
          <Label color={GOLD}>Learning Velocity Index</Label>
          <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, marginBottom: 24 }}>Cumulative intelligence across all activations</div>
          {[
            { v: "47", l: "Protocol improvements this quarter", color: GOLD },
            { v: "12", l: "Proven improvements (measured)", color: TEAL },
            { v: "180", l: "Protocols with active hypotheses", color: "#fff" },
            { v: "−342 min", l: "Total minutes saved (proven)", color: TEAL },
          ].map(({ v, l, color }) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ ...CG, fontSize: 24, fontWeight: 700, color, minWidth: 80, lineHeight: 1 }}>{v}</div>
              <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{l}</div>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: "14px 16px", background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.25)` }}>
            <div style={{ ...BC, fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 4 }}>THE MOAT METRIC</div>
            <div style={{ ...BAR, fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>18 months to rebuild this activation intelligence on any competitor platform. That gap widens every quarter.</div>
          </div>
        </div>
      </div>

      {/* Q3 final status */}
      <div style={{ padding: "32px 40px", background: "#F8F7F4", border: `1px solid ${BD}`, borderTop: `3px solid ${GOLD}`, marginBottom: 48 }}>
        <Label>Q3 Final Status — July 15 End of Day</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3, marginTop: 20 }}>
          {[
            { v: "3 of 3", l: "Q3 initiatives on schedule", color: TEAL },
            { v: "0", l: "Days delayed on planned work", color: NAVY },
            { v: "12 min", l: "Ransomware response time", color: NAVY },
            { v: "$0", l: "Reactive advisory fees", color: TEAL },
          ].map(({ v, l, color }) => (
            <div key={l} style={{ padding: "20px", background: "#fff", border: `1px solid ${BD}`, textAlign: "center" }}>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color, lineHeight: 1, marginBottom: 6 }}>{v}</div>
              <div style={{ ...BC, fontSize: 9, color: MUTED, letterSpacing: "0.12em", lineHeight: 1.4 }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY, marginTop: 24, lineHeight: 1.4, maxWidth: 680 }}>
          "The response was ready before the trigger fired. The quarter never stopped. That is what fearless looks like."
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ padding: "48px", background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(to bottom, ${GOLD}, ${TEAL})` }} />
        <div style={{ maxWidth: 660 }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: GOLD, marginBottom: 20 }}>THE COMPLETE OPERATING MODEL</div>
          <h3 style={{ ...CG, fontSize: "clamp(24px,2.5vw,36px)", fontWeight: 600, color: "#fff", lineHeight: 1.25, marginBottom: 16 }}>
            Any system that only covers what you plan for covers half your strategic surface.
          </h3>
          <p style={{ ...BAR, fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 32 }}>
            180 Readiness Protocols. 231 trigger patterns. Planned work and unplanned triggers — one dashboard, one operating model, one system. Readiness OS is the only platform that prepares the enterprise for everything it will face, anticipated or not.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 36 }}>
            {[
              { v: "180", l: "Readiness Protocols", s: "Planned + unplanned" },
              { v: "231", l: "Trigger Patterns", s: "Monitored continuously" },
              { v: "3,600×", l: "Execution Head Start", s: "30 days → 12 minutes" },
            ].map(({ v, l, s }) => (
              <div key={v} style={{ padding: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                <div style={{ ...CG, fontSize: 30, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{v}</div>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", marginBottom: 3 }}>{l}</div>
                <div style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/founding-partner-program">
              <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, padding: "16px 36px", cursor: "pointer", display: "inline-block" }}>
                Apply for Founding Partner Access →
              </div>
            </Link>
            <Link href="/demo-hub">
              <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, background: "transparent", border: `1px solid rgba(201,168,76,0.35)`, padding: "16px 28px", cursor: "pointer", display: "inline-block" }}>
                See All 12 Scenarios
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   ROOT
──────────────────────────────────────────────── */
export default function PlannedUnplannedDemo() {
  const [phase, setPhase] = useState<Phase>("identify");

  useEffect(() => {
    updatePageMetadata({
      title: "Complete Operating Model — Readiness OS",
      description: "The only demo that shows planned quarterly work and an unplanned trigger executing simultaneously through the full IDEA framework: Identify, Define, Execute, Advance.",
    });
  }, []);

  const next = () => {
    const order: Phase[] = ["identify", "define", "execute", "advance"];
    const i = order.indexOf(phase);
    if (i < order.length - 1) { setPhase(order[i + 1]); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  return (
    <PageLayout>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
      <div style={{ background: "#fff", minHeight: "100vh" }}>

        {/* HERO */}
        <section style={{ background: NAVY, padding: "72px 48px 64px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${TEAL}, ${GOLD})` }} />
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid rgba(201,168,76,0.3)`, padding: "6px 14px", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, animation: "pulse 2s infinite" }} />
              <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", color: GOLD }}>COMPLETE OPERATING MODEL · IDENTIFY → DEFINE → EXECUTE → ADVANCE</span>
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(36px,5vw,64px)", fontWeight: 600, color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
              Your Q3 plan is running.<br />
              <span style={{ color: GOLD }}>A trigger fires. Both respond.</span>
            </h1>
            <p style={{ ...BAR, fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 680, marginBottom: 40 }}>
              Every demo in the industry shows what happens when a trigger fires. This is the only one that shows what happens when a trigger fires <em>while your quarterly work is already running</em> — and walks you through the complete IDEA framework that makes both possible simultaneously.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, maxWidth: 680, marginBottom: 40 }}>
              {[
                { v: "3", l: "Planned protocols active" },
                { v: "1", l: "Unplanned trigger fires" },
                { v: "12 min", l: "Full response time" },
                { v: "0", l: "Q3 days lost" },
              ].map(({ v, l }) => (
                <div key={v} style={{ padding: "18px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                  <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{v}</div>
                  <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setPhase("identify"); window.scrollTo({ top: 200, behavior: "smooth" }); }}
                style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, border: "none", padding: "16px 40px", cursor: "pointer" }}>
                Begin the Full Demo →
              </button>
              <span style={{ ...BAR, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>4 phases · Identify · Define · Execute · Advance · No login required</span>
            </div>
          </div>
        </section>

        <PhaseBar active={phase} onSelect={p => { setPhase(p); window.scrollTo({ top: 200, behavior: "smooth" }); }} />

        {phase === "identify" && <PhaseIdentify onNext={next} />}
        {phase === "define"   && <PhaseDefine   onNext={next} />}
        {phase === "execute"  && <PhaseExecute  onNext={next} />}
        {phase === "advance"  && <PhaseAdvance />}

        {/* FOOTER BAR */}
        <div style={{ background: "#F8F7F4", borderTop: `1px solid ${BD}`, padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <VaughnMartinLogo color="dark" height={26} variant="full" noLink />
          <p style={{ ...BAR, fontSize: 13, color: MUTED, margin: 0 }}>The response is ready before the trigger fires — whether you expected it or not.</p>
          <Link href="/founding-partner-program">
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, background: GOLD, padding: "10px 22px", cursor: "pointer" }}>
              Apply for Access →
            </div>
          </Link>
        </div>

      </div>
    </PageLayout>
  );
}
