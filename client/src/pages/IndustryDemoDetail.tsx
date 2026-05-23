import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import { getBlueprintBySlug } from "@/data/industryDemoBlueprints";
import {
  ArrowLeft, Shield, TrendingUp, RefreshCw, CheckCircle,
  Clock, AlertTriangle, ChevronRight, Play, RotateCcw,
  Zap, Lock, Radio, Activity, Users
} from "lucide-react";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E2DDD5";
const RED   = "#B91C1C";

const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BAR: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };
const BRC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

type SimPhase = "idle" | "scanning" | "staged" | "authorizing" | "authorized" | "executing" | "complete";

const PHASES: { key: SimPhase; label: string }[] = [
  { key: "scanning",   label: "DETECT"    },
  { key: "staged",     label: "STAGE"     },
  { key: "authorizing",label: "AUTHORIZE" },
  { key: "executing",  label: "EXECUTE"   },
  { key: "complete",   label: "COMPLETE"  },
];

function phaseIndex(p: SimPhase) {
  const map: Record<SimPhase, number> = {
    idle: -1, scanning: 0, staged: 1, authorizing: 2,
    authorized: 2, executing: 3, complete: 4,
  };
  return map[p];
}

function domainColor(d: string) {
  if (d === "GROWTH & POSITIONING") return GOLD;
  if (d === "RISK & RESILIENCE") return TEAL;
  return "#8B6FBF";
}
function DomainIcon({ domain, size = 13 }: { domain: string; size?: number }) {
  if (domain === "GROWTH & POSITIONING") return <TrendingUp size={size} />;
  if (domain === "RISK & RESILIENCE") return <Shield size={size} />;
  return <RefreshCw size={size} />;
}

function parseTargetRisk(steps: { action: string }[]): number {
  for (const s of steps) {
    const m = s.action.match(/risk score\s*(\d+)\/100/i);
    if (m) return parseInt(m[1]);
  }
  return 88;
}

function SimulationEngine({ blueprint }: { blueprint: ReturnType<typeof getBlueprintBySlug> }) {
  if (!blueprint) return null;
  const [phase, setPhase] = useState<SimPhase>("idle");
  const [visSignals, setVisSignals] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);
  const [simTime, setSimTime] = useState("0:00");
  const [showAuthFlash, setShowAuthFlash] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const start = () => {
    clearAll();
    setPhase("scanning");
    setVisSignals(0);
    setRiskScore(0);
    setActiveStep(-1);
    setSimTime("0:00");
    setShowAuthFlash(false);

    const sigs = blueprint.signalsMonitored.length;
    for (let i = 0; i < sigs; i++) {
      after(() => setVisSignals(v => v + 1), 300 + i * 480);
    }
    const target = parseTargetRisk(blueprint.executionSteps);
    for (let s = 1; s <= target; s++) {
      after(() => setRiskScore(s), 1200 + s * 22);
    }
    after(() => {
      setPhase("staged");
      setSimTime(blueprint.executionSteps[1]?.minute ?? "0:08");
    }, 3800);
    after(() => setPhase("authorizing"), 6000);
    after(() => {
      setPhase("authorized");
      setShowAuthFlash(true);
      setSimTime(blueprint.executionSteps[2]?.minute ?? "1:20");
    }, 8400);
    after(() => setShowAuthFlash(false), 10600);
    after(() => { setPhase("executing"); setActiveStep(0); setSimTime(blueprint.executionSteps[0].minute); }, 10200);

    blueprint.executionSteps.forEach((step, i) => {
      after(() => { setActiveStep(i); setSimTime(step.minute); }, 10200 + i * 3800);
    });

    const done = 10200 + blueprint.executionSteps.length * 3800 + 1200;
    after(() => { setPhase("complete"); setSimTime("12:00"); }, done);
  };

  const reset = () => { clearAll(); setPhase("idle"); setVisSignals(0); setRiskScore(0); setActiveStep(-1); setSimTime("0:00"); setShowAuthFlash(false); };
  useEffect(() => () => clearAll(), []);

  const pi = phaseIndex(phase);
  const riskColor = riskScore < 50 ? TEAL : riskScore < 75 ? GOLD : RED;
  const stepsTotal = blueprint.executionSteps.length;
  const stepsComplete = activeStep + 1;

  return (
    <div style={{ background: NAVY, border: `1px solid rgba(201,168,76,0.18)` }}>

      {/* Phase progress bar */}
      <div style={{ padding: "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 0 }}>
        {PHASES.map((p, i) => {
          const done = pi > i;
          const active = pi === i;
          const color = done ? TEAL : active ? GOLD : "rgba(255,255,255,0.18)";
          return (
            <div key={p.key} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: "0 0 auto" }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: color,
                  boxShadow: active ? `0 0 10px ${GOLD}` : "none",
                  transition: "all 0.4s",
                }} />
                <span style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color, whiteSpace: "nowrap" }}>{p.label}</span>
              </div>
              {i < PHASES.length - 1 && (
                <div style={{ flex: 1, height: 1, background: done ? TEAL : "rgba(255,255,255,0.1)", margin: "0 6px", marginBottom: 16, transition: "background 0.6s" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Simulation body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", minHeight: 480 }}>

        {/* LEFT — phase content */}
        <div style={{ padding: "36px 32px", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", justifyContent: "center" }}>

          {/* IDLE */}
          {phase === "idle" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={22} color={GOLD} />
              </div>
              <div>
                <div style={{ ...GEO, fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                  Run the Live Simulation
                </div>
                <p style={{ ...BAR, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 28px" }}>
                  Watch the full 12-minute execution sequence for <strong style={{ color: "rgba(255,255,255,0.8)" }}>{blueprint.industry}</strong>. Signal detection, protocol staging, executive authorization, task deployment — live.
                </p>
                <button
                  onClick={start}
                  style={{ ...BRC, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", background: GOLD, color: NAVY, border: "none", padding: "16px 40px", cursor: "pointer" }}
                >
                  ▶ &nbsp; Begin Simulation
                </button>
              </div>
            </div>
          )}

          {/* SCANNING */}
          {phase === "scanning" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: RED, display: "inline-block", animation: "pulse 1s infinite" }} />
                <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: RED }}>SIGNAL DETECTION ACTIVE</span>
              </div>
              <div style={{ ...GEO, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 20 }}>
                Monitoring {blueprint.signalsMonitored.length} signal categories — trigger detected.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
                {blueprint.signalsMonitored.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    background: i < visSignals ? "rgba(43,138,110,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i < visSignals ? "rgba(43,138,110,0.3)" : "rgba(255,255,255,0.06)"}`,
                    transition: "all 0.4s",
                    opacity: i < visSignals ? 1 : 0.25,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: i < visSignals ? TEAL : "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    <span style={{ ...BAR, fontSize: 12, color: i < visSignals ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}>{s}</span>
                    {i < visSignals && <span style={{ marginLeft: "auto", ...BRC, fontSize: 8, fontWeight: 700, color: TEAL }}>ACTIVE</span>}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div>
                  <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>RISK SCORE</div>
                  <div style={{ ...BAR, fontSize: 52, fontWeight: 700, color: riskColor, lineHeight: 1, transition: "color 0.3s" }}>
                    {riskScore}
                    <span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }}>/100</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${riskScore}%`, background: riskColor, transition: "width 0.1s, background 0.3s" }} />
                  </div>
                  <div style={{ ...BRC, fontSize: 8, marginTop: 6, color: riskColor, fontWeight: 700 }}>
                    {riskScore < 50 ? "MONITORING" : riskScore < 75 ? "ELEVATED — REVIEWING" : "CRITICAL — PROTOCOL STAGING"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGED */}
          {phase === "staged" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Zap size={12} color={GOLD} />
                <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: GOLD }}>READINESS PROTOCOL STAGED</span>
              </div>
              <div style={{ ...GEO, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 24 }}>
                Response pre-staged. Authorization brief delivered.
              </div>
              <div style={{ background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.3)`, padding: "20px 22px", marginBottom: 16 }}>
                <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: GOLD, marginBottom: 10 }}>PROTOCOL STAGED</div>
                {blueprint.starterProtocols.slice(0, 1).map((p) => (
                  <div key={p.number} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                    <span style={{ ...GEO, fontSize: 28, fontWeight: 700, color: GOLD }}>{p.number}</span>
                    <span style={{ ...BAR, fontSize: 15, fontWeight: 600, color: "#fff" }}>{p.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {blueprint.authorizationChain.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ width: 18, height: 18, background: i === 0 ? GOLD : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...BRC, fontSize: 8, fontWeight: 700, color: i === 0 ? NAVY : "rgba(255,255,255,0.5)" }}>{i + 1}</span>
                    </div>
                    <span style={{ ...BAR, fontSize: 12, color: i === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, animation: "pulse 1s infinite" }} />
                <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: GOLD }}>AWAITING AUTHORIZATION — {blueprint.executiveRole}</span>
              </div>
            </div>
          )}

          {/* AUTHORIZING */}
          {phase === "authorizing" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <Lock size={28} color={GOLD} style={{ marginBottom: 20 }} />
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, marginBottom: 8 }}>AUTHORIZATION REQUEST SENT</div>
              <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{blueprint.executiveRole}</div>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>
                Reviewing impact brief, budget authority, and pre-staged execution sequence.
              </p>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 32 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, opacity: 0.4 + i * 0.3 }} />
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", padding: "16px 28px", textAlign: "left", width: "100%", maxWidth: 440 }}>
                <div style={{ ...BRC, fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", marginBottom: 8 }}>AUTHORIZATION BRIEF INCLUDES</div>
                {["Full impact assessment with financial exposure", "Pre-staged execution sequence — all 47 task owners", "Budget authority pre-approved, ready to unlock", "Legal & regulatory posture confirmed"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <CheckCircle size={11} color={TEAL} style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUTHORIZED */}
          {(phase === "authorized") && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "100%", padding: "32px 0",
                background: showAuthFlash ? "rgba(201,168,76,0.15)" : "transparent",
                border: showAuthFlash ? `1px solid rgba(201,168,76,0.4)` : "1px solid transparent",
                transition: "all 0.3s",
                marginBottom: 24,
              }}>
                <div>
                  <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: GOLD, marginBottom: 12 }}>AUTHORIZATION GRANTED</div>
                  <div style={{ ...GEO, fontSize: 52, fontWeight: 700, color: GOLD, lineHeight: 1 }}>✓</div>
                  <div style={{ ...BAR, fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 8 }}>{blueprint.executiveRole}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...BAR, fontSize: 22, fontWeight: 700, color: TEAL }}>Active</div>
                  <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}>WAR ROOM</div>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...BAR, fontSize: 22, fontWeight: 700, color: GOLD }}>Unlocked</div>
                  <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}>BUDGET</div>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...BAR, fontSize: 22, fontWeight: 700, color: "#fff" }}>All</div>
                  <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}>OWNERS NOTIFIED</div>
                </div>
              </div>
            </div>
          )}

          {/* EXECUTING */}
          {phase === "executing" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Activity size={12} color={TEAL} />
                <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: TEAL }}>EXECUTION IN PROGRESS</span>
              </div>
              <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 20 }}>
                {activeStep >= 0 && activeStep < blueprint.executionSteps.length
                  ? blueprint.executionSteps[activeStep].action
                  : "Deploying task sequence..."}
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)" }}>TASKS DEPLOYED</span>
                  <span style={{ ...BAR, fontSize: 12, fontWeight: 700, color: TEAL }}>{stepsComplete} / {stepsTotal}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.08)" }}>
                  <div style={{ height: "100%", width: `${(stepsComplete / stepsTotal) * 100}%`, background: TEAL, transition: "width 0.8s ease" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {blueprint.keyMetrics.map((m, i) => (
                  <div key={i} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{m.label}</div>
                    <div style={{ ...BAR, fontSize: 16, fontWeight: 700, color: "#fff" }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPLETE */}
          {phase === "complete" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <CheckCircle size={14} color={TEAL} />
                <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: TEAL }}>EXECUTION COMPLETE — 12 MINUTES</span>
              </div>
              <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 20 }}>{blueprint.readinessOutcome}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 20 }}>
                <div style={{ padding: "16px 18px", background: "rgba(185,28,28,0.1)", border: "1px solid rgba(185,28,28,0.25)", borderTop: `2px solid ${RED}` }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10 }}>
                    <AlertTriangle size={11} color={RED} />
                    <span style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: RED }}>TRADITIONAL</span>
                  </div>
                  <div style={{ ...BAR, fontSize: 15, fontWeight: 700, color: RED, marginBottom: 6 }}>{blueprint.traditionalTime}</div>
                  <p style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>{blueprint.traditionalOutcome}</p>
                </div>
                <div style={{ padding: "16px 18px", background: "rgba(43,138,110,0.1)", border: "1px solid rgba(43,138,110,0.3)", borderTop: `2px solid ${TEAL}` }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10 }}>
                    <CheckCircle size={11} color={TEAL} />
                    <span style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: TEAL }}>READINESS OS</span>
                  </div>
                  <div style={{ ...BAR, fontSize: 15, fontWeight: 700, color: TEAL, marginBottom: 6 }}>{blueprint.readinessTime}</div>
                  <p style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{blueprint.readinessOutcome}</p>
                </div>
              </div>
              <div style={{ padding: "14px 18px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ ...BAR, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{blueprint.businessValue}</span>
                <span style={{ ...GEO, fontSize: 22, fontWeight: 700, color: GOLD }}>{blueprint.heroStat}</span>
              </div>
              <button
                onClick={reset}
                style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", padding: "10px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <RotateCcw size={11} /> Replay Simulation
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — execution timeline + clock */}
        <div style={{ padding: "28px 22px", borderLeft: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" }}>
          {/* Clock */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Clock size={14} color={phase === "complete" ? TEAL : GOLD} />
            <div>
              <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>EXECUTION CLOCK</div>
              <div style={{ ...BAR, fontSize: 22, fontWeight: 700, color: phase === "complete" ? TEAL : phase === "idle" ? "rgba(255,255,255,0.2)" : "#fff", transition: "color 0.3s" }}>
                {simTime}
              </div>
            </div>
            {phase === "complete" && <CheckCircle size={14} color={TEAL} style={{ marginLeft: "auto" }} />}
          </div>

          {/* Execution steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
            {blueprint.executionSteps.map((step, i) => {
              const done = i <= activeStep && (phase === "executing" || phase === "complete");
              const current = i === activeStep && phase === "executing";
              const isAuth = step.owner !== "System" && (
                step.owner.includes("CRO") || step.owner.includes("CEO") || step.owner.includes("CMO") ||
                step.owner.includes("GC") || step.owner.includes("CDO") || step.owner.includes("CSO") ||
                step.owner.includes("CTO") || step.owner.includes("COO") || step.owner.includes("MP")
              );
              const dotColor = done ? (isAuth ? GOLD : TEAL) : "rgba(255,255,255,0.12)";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex", gap: 10, padding: "8px 10px",
                    background: current ? "rgba(201,168,76,0.1)" : done ? "rgba(255,255,255,0.03)" : "transparent",
                    border: `1px solid ${current ? "rgba(201,168,76,0.25)" : done ? "rgba(255,255,255,0.07)" : "transparent"}`,
                    transition: "all 0.5s",
                    opacity: done || current ? 1 : phase === "idle" ? 0.3 : 0.2,
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, flexShrink: 0, marginTop: 5, boxShadow: current ? `0 0 6px ${GOLD}` : "none", transition: "all 0.4s" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...BRC, fontSize: 8, fontWeight: 700, color: done ? (isAuth ? GOLD : TEAL) : "rgba(255,255,255,0.2)", marginBottom: 2 }}>
                      {step.minute} · {step.owner}
                    </div>
                    <div style={{ ...BAR, fontSize: 10.5, color: done ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.25)", lineHeight: 1.4, transition: "color 0.4s" }}>
                      {step.action}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {phase === "idle" && (
            <div style={{ marginTop: 16, padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
                {blueprint.executionSteps.length} STEPS PRE-STAGED
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar — always visible */}
      {phase !== "idle" && (
        <div style={{ padding: "12px 28px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 24 }}>
            <span style={{ ...BAR, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              <strong style={{ color: "rgba(255,255,255,0.6)" }}>{blueprint.industry}</strong>
            </span>
            <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)" }}>
              {blueprint.executionSteps.length} TASKS · {blueprint.signalsMonitored.length} SIGNALS · {blueprint.starterProtocols.length} PROTOCOLS
            </span>
          </div>
          {(phase !== "complete") && (
            <button onClick={reset} style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", cursor: "pointer", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
              <RotateCcw size={9} /> Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function IndustryDemoDetail() {
  const params = useParams<{ industrySlug: string }>();
  const blueprint = params.industrySlug ? getBlueprintBySlug(params.industrySlug) : undefined;

  useEffect(() => {
    if (blueprint) {
      updatePageMetadata({
        title: `${blueprint.industry} — Live Simulation | VaughnMartin Readiness OS`,
        description: `See how Readiness OS executes in 12 minutes for ${blueprint.industry}: ${blueprint.triggerEvent}`,
      });
    }
  }, [blueprint]);

  if (!blueprint) {
    return (
      <PageLayout>
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 40 }}>
          <div style={{ ...GEO, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 12 }}>Industry Not Found</div>
          <p style={{ ...BAR, fontSize: 14, color: "rgba(10,15,46,0.5)", marginBottom: 28 }}>That industry demo doesn't exist or the URL may be incorrect.</p>
          <Link href="/industry-demo-library" style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: NAVY, color: "#fff", padding: "12px 28px", textDecoration: "none" }}>
            View All Industries
          </Link>
        </div>
      </PageLayout>
    );
  }

  const dc = domainColor(blueprint.domain);

  return (
    <PageLayout>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>

      {/* Back nav */}
      <div style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: "14px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Link href="/industry-demo-library" style={{ display: "inline-flex", alignItems: "center", gap: 6, ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(10,15,46,0.5)", textDecoration: "none" }}>
            <ArrowLeft size={11} /> Industry Demo Library
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: NAVY, padding: "48px 32px 36px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: dc, padding: "4px 10px", border: `1px solid ${dc === GOLD ? "rgba(201,168,76,0.4)" : dc === TEAL ? "rgba(43,138,110,0.4)" : "rgba(255,255,255,0.2)"}`, background: dc === GOLD ? "rgba(201,168,76,0.1)" : dc === TEAL ? "rgba(43,138,110,0.1)" : "rgba(255,255,255,0.06)" }}>
              <DomainIcon domain={blueprint.domain} size={10} />
              {blueprint.domain}
            </span>
            <ChevronRight size={11} color="rgba(255,255,255,0.2)" />
            <span style={{ ...BRC, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{blueprint.sector}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h1 style={{ ...GEO, fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
                {blueprint.industry}
              </h1>
              <div style={{ width: 40, height: 2, background: GOLD, marginBottom: 14 }} />
              <p style={{ ...BAR, fontSize: 14, fontWeight: 600, color: GOLD, lineHeight: 1.5, marginBottom: 8 }}>
                {blueprint.triggerEvent}
              </p>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                {blueprint.triggerContext}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, width: 280, flexShrink: 0 }}>
              {blueprint.keyMetrics.map((m, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px 12px" }}>
                  <div style={{ ...BRC, fontSize: 7, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 5 }}>{m.label}</div>
                  <div style={{ ...BAR, fontSize: 14, fontWeight: 700, color: "#fff" }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation engine */}
      <div style={{ background: "#0D1235", padding: "0 32px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <SimulationEngine blueprint={blueprint} />
        </div>
      </div>

      {/* Static detail */}
      <div style={{ background: "#fff", padding: "64px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }}>
          <div>

            {/* Signals */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>Continuous Signal Monitoring</div>
              <h2 style={{ ...GEO, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 6 }}>What the system watches — always.</h2>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(10,15,46,0.55)", lineHeight: 1.8, marginBottom: 18 }}>
                Before any trigger fires, Readiness OS continuously monitors these signal categories across {blueprint.industry}. Pattern detection runs 24/7.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {blueprint.signalsMonitored.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 14px", background: "rgba(43,138,110,0.03)", border: "1px solid rgba(43,138,110,0.10)", borderLeft: `3px solid ${TEAL}` }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ ...BAR, fontSize: 13, color: NAVY, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Authorization chain */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>Executive Authorization</div>
              <h2 style={{ ...GEO, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 6 }}>System monitors. Executives authorize.</h2>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(10,15,46,0.55)", lineHeight: 1.8, marginBottom: 18 }}>
                No Readiness Protocol activates without executive sign-off. The <strong>{blueprint.executiveRole}</strong> receives a full impact brief before authorizing execution.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {blueprint.authorizationChain.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "13px 14px", background: i === 0 ? "rgba(201,168,76,0.05)" : "#fff", border: `1px solid ${i === 0 ? "rgba(201,168,76,0.22)" : BORDER}` }}>
                    <div style={{ ...BRC, fontSize: 9, fontWeight: 700, width: 20, height: 20, background: i === 0 ? GOLD : NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      {i + 1}
                    </div>
                    <span style={{ ...BAR, fontSize: 13, color: NAVY, lineHeight: 1.55 }}>{step}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Execution timeline */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>12-Minute Execution Sequence</div>
              <h2 style={{ ...GEO, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Every task, owner, and handoff — pre-staged.</h2>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(10,15,46,0.55)", lineHeight: 1.8, marginBottom: 18 }}>When the trigger fires, the sequence executes — not in days, not in hours.</p>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 1, background: "rgba(10,15,46,0.07)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {blueprint.executionSteps.map((step, i) => {
                    const isLast = i === blueprint.executionSteps.length - 1;
                    const isAuth = step.owner !== "System" && (step.owner.includes("CRO") || step.owner.includes("CEO") || step.owner.includes("CMO") || step.owner.includes("GC") || step.owner.includes("CDO") || step.owner.includes("COO") || step.owner.includes("CTO") || step.owner.includes("MP") || step.owner.includes("CSO"));
                    const isSystem = step.owner === "System";
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 2, position: "relative" }}>
                        <div style={{ width: 56, flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingRight: 12, paddingTop: 12, ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: isLast ? TEAL : "rgba(10,15,46,0.3)" }}>
                          {step.minute}
                        </div>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: isLast ? TEAL : isAuth ? GOLD : isSystem ? "rgba(10,15,46,0.2)" : NAVY, flexShrink: 0, marginTop: 14, zIndex: 1 }} />
                        <div style={{ flex: 1, padding: "10px 14px", background: isLast ? "rgba(43,138,110,0.05)" : isAuth ? "rgba(201,168,76,0.04)" : isSystem ? "rgba(10,15,46,0.02)" : "#fff", border: `1px solid ${isLast ? "rgba(43,138,110,0.18)" : isAuth ? "rgba(201,168,76,0.18)" : BORDER}`, marginBottom: 2 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <span style={{ ...BAR, fontSize: 13, color: NAVY, lineHeight: 1.5, fontWeight: isLast || isAuth ? 600 : 400 }}>{step.action}</span>
                            <span style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", flexShrink: 0, color: isAuth ? GOLD : isSystem ? "rgba(10,15,46,0.3)" : TEAL, padding: "2px 7px", border: `1px solid ${isAuth ? "rgba(201,168,76,0.22)" : isSystem ? "rgba(10,15,46,0.08)" : "rgba(43,138,110,0.18)"}`, background: isAuth ? "rgba(201,168,76,0.05)" : "transparent" }}>
                              {step.owner}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Pre-staged protocols */}
            <section>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 8 }}>Pre-Staged Protocols</div>
              <h2 style={{ ...GEO, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Ready before the trigger fires.</h2>
              <p style={{ ...BAR, fontSize: 13, color: "rgba(10,15,46,0.55)", lineHeight: 1.8, marginBottom: 18 }}>Included in the core library and available to all Founding Partners — pre-staged with stakeholder assignments, budget authorities, and communication templates.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {blueprint.starterProtocols.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 14px", background: "#fff", border: `1px solid ${BORDER}` }}>
                    <span style={{ ...BRC, fontSize: 9, fontWeight: 700, color: GOLD, minWidth: 36 }}>{p.number}</span>
                    <span style={{ ...BAR, fontSize: 13, color: NAVY, fontWeight: 500 }}>{p.name}</span>
                    <div style={{ marginLeft: "auto", ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: TEAL }}>Pre-staged</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ background: NAVY, padding: "24px 22px", marginBottom: 3 }}>
              <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>3,600× Execution Head Start</div>
              <div style={{ ...GEO, fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{blueprint.heroStat}</div>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>{blueprint.heroLabel}</div>
              <div style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
                30 days compressed to 12 minutes. The response was ready before the trigger fired.
              </div>
            </div>
            <div style={{ background: IVORY, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.5)" }}>Traditional mobilization</span>
                <span style={{ ...BAR, fontSize: 12, fontWeight: 700, color: RED }}>{blueprint.traditionalTime.split("–")[0].trim()}</span>
              </div>
              <div style={{ height: 4, background: "rgba(10,15,46,0.07)", position: "relative", marginBottom: 10 }}>
                <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "99%", background: "rgba(185,28,28,0.2)" }} />
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "0.4%", background: TEAL }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.5)" }}>Readiness OS</span>
                <span style={{ ...BAR, fontSize: 12, fontWeight: 700, color: TEAL }}>12 minutes</span>
              </div>
            </div>
            <div style={{ border: `1px solid ${BORDER}`, padding: "22px 20px", marginBottom: 3 }}>
              <div style={{ ...GEO, fontSize: 17, fontWeight: 600, color: NAVY, lineHeight: 1.35, marginBottom: 8 }}>Deploy this blueprint in your organization.</div>
              <p style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.55)", lineHeight: 1.75, marginBottom: 18 }}>Founding Partners receive all 170 Readiness Protocols pre-configured for their industry and executive structure. Go live in 4 weeks.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <a href="/founding-partner-program" style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: NAVY, color: "#fff", padding: "13px 16px", textDecoration: "none", display: "block", textAlign: "center" }}>
                  Apply for Founding Partner Access
                </a>
                <a href="/12-minute-experience" style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY, padding: "13px 16px", textDecoration: "none", display: "block", textAlign: "center", border: `1px solid ${BORDER}` }}>
                  Try the 12-Minute Experience →
                </a>
              </div>
            </div>
            <div style={{ border: `1px solid ${BORDER}`, padding: "16px 18px" }}>
              <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 10 }}>Explore More Industries</div>
              <Link href="/industry-demo-library" style={{ display: "inline-flex", alignItems: "center", gap: 6, ...BAR, fontSize: 12, color: NAVY, fontWeight: 600, textDecoration: "none" }}>
                View All 19 Industry Blueprints <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Proof bar */}
      <div style={{ background: IVORY, borderTop: `1px solid ${BORDER}`, padding: "28px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 40, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Readiness Protocols", value: "170" },
            { label: "Strategic Triggers", value: "221" },
            { label: "Industries Covered",  value: "19"  },
            { label: "Execution Head Start", value: "3,600×" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ ...GEO, fontSize: 26, fontWeight: 700, color: NAVY }}>{s.value}</div>
              <div style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </PageLayout>
  );
}
