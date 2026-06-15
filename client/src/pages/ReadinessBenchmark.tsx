import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const BW: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };

interface Question {
  id: number;
  text: string;
  subtext: string;
  options: { label: string; sub: string; points: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How long did your last major strategic mobilization take — from trigger to full team executing?",
    subtext: "Think of a real event: ransomware, activist investor, supply disruption, regulatory inquiry.",
    options: [
      { label: "Less than 24 hours", sub: "Protocol was pre-staged and authority was pre-assigned", points: 20 },
      { label: "2–7 days", sub: "We moved quickly but needed to convene and align first", points: 13 },
      { label: "1–4 weeks", sub: "Significant time spent on stakeholder alignment before execution", points: 6 },
      { label: "More than 30 days", sub: "Mobilization itself was the primary challenge", points: 0 },
    ],
  },
  {
    id: 2,
    text: "How does your organization currently monitor for strategic risks and emerging signals?",
    subtext: "Across domains: competitive, regulatory, operational, reputational, financial.",
    options: [
      { label: "Continuous automated monitoring", sub: "Multiple domains tracked in real time, 24/7", points: 20 },
      { label: "Dedicated team with regular reporting", sub: "Weekly or monthly briefings from a risk/intelligence function", points: 13 },
      { label: "Ad-hoc scanning when concerns arise", sub: "Someone checks when a situation is flagged", points: 5 },
      { label: "Primarily reactive", sub: "We typically learn about situations after they've surfaced publicly", points: 0 },
    ],
  },
  {
    id: 3,
    text: "How many of your top 10 high-stakes scenarios have a fully pre-staged response plan today?",
    subtext: "Pre-staged means: assigned owners, specific tasks, budget authority, communication templates.",
    options: [
      { label: "All 10 — with owners, tasks, and budgets", sub: "Fully documented and rehearsed", points: 20 },
      { label: "6–9 — with partial documentation", sub: "Most scenarios covered, some gaps", points: 14 },
      { label: "1–5 — high-level plans only", sub: "Frameworks exist but execution details are missing", points: 7 },
      { label: "None — we build plans when situations arise", sub: "Fully ad-hoc response model", points: 0 },
    ],
  },
  {
    id: 4,
    text: "When a strategic trigger fires, how long does it take to get the right decision-makers aligned and actively executing?",
    subtext: "Not just informed — actually coordinated and moving.",
    options: [
      { label: "Under 30 minutes", sub: "Authority is pre-assigned, everyone knows their role", points: 20 },
      { label: "2–4 hours", sub: "We convene quickly and move fast once assembled", points: 13 },
      { label: "Same day", sub: "Multiple calls required to reach alignment", points: 6 },
      { label: "Multiple days", sub: "Getting everyone aligned is itself a significant effort", points: 0 },
    ],
  },
  {
    id: 5,
    text: "After a major activation or crisis, how does your organization improve its response protocols?",
    subtext: "The question is whether learning compounds — or each event is handled independently.",
    options: [
      { label: "Formally — lessons update protocols immediately", sub: "Post-activation debriefs feed directly back into pre-staged plans", points: 20 },
      { label: "Informally — we discuss and update over weeks", sub: "Improvement happens but isn't systematized", points: 12 },
      { label: "Occasionally — when the same type repeats", sub: "Some institutional memory but mostly reactive refinement", points: 4 },
      { label: "Rarely — each event is handled independently", sub: "Limited protocol learning across events", points: 0 },
    ],
  },
];

type ScoreTier = "critical" | "developing" | "capable" | "advanced";

function getScoreTier(score: number): ScoreTier {
  if (score < 26) return "critical";
  if (score < 51) return "developing";
  if (score < 76) return "capable";
  return "advanced";
}

const TIER_DATA: Record<ScoreTier, { label: string; color: string; icon: React.ReactNode; headline: string; body: string }> = {
  critical: {
    label: "Critical Readiness Gap",
    color: "#DC2626",
    icon: <AlertCircle className="w-6 h-6" />,
    headline: "Your organization is mobilizing reactively.",
    body: "When a strategic trigger fires, you're spending weeks on coordination before execution begins. The first 30 days of any major situation is consumed by alignment — figuring out who owns what, who decides, what sequence activates. That window is where value is lost and damage compounds.",
  },
  developing: {
    label: "Developing Readiness",
    color: "#D97706",
    icon: <AlertTriangle className="w-6 h-6" />,
    headline: "You have some readiness infrastructure — but significant gaps remain.",
    body: "Monitoring and basic plans exist, but pre-staging and automated coordination are missing. When a trigger fires, you're faster than average but still spending days on mobilization before execution begins. The 12-minute execution window requires every element pre-staged before the situation arrives.",
  },
  capable: {
    label: "Capable — Execution Gaps Remain",
    color: GOLD,
    icon: <TrendingUp className="w-6 h-6" />,
    headline: "Strong foundations. The gap is in pre-staging and automated coordination.",
    body: "Your organization responds faster than most peers. The remaining gap is systematic: responses are still assembled when situations arise rather than pre-staged before they do. Readiness OS closes this by pre-building every protocol with assigned owners, staged tasks, and authorized budgets — so execution begins in minutes, not hours.",
  },
  advanced: {
    label: "Advanced Readiness",
    color: TEAL,
    icon: <CheckCircle2 className="w-6 h-6" />,
    headline: "Your organization executes faster than most. The frontier is predictive.",
    body: "You have real readiness infrastructure. The next frontier is predictive — shifting from 'the response is ready before the trigger fires' to 'the response is ready before the trigger is even a pattern.' That's the Readiness Oracle: autonomous war gaming, living organizational digital twin, and collective intelligence across the customer base.",
  },
};

export default function ReadinessBenchmark() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [phase, setPhase] = useState<"questions" | "results">("questions");

  const answered = Object.keys(answers).length;
  const allAnswered = answered === QUESTIONS.length;

  const rawScore = Object.values(answers).reduce((s, v) => s + v, 0);
  const score = Math.round((rawScore / 100) * 100);
  const tier = getScoreTier(score);
  const tierData = TIER_DATA[tier];

  const questionScores = QUESTIONS.map(q => ({
    label: q.text.split(" ").slice(0, 6).join(" ") + "…",
    shortLabel: ["Mobilization Speed", "Signal Monitoring", "Protocol Pre-Staging", "Stakeholder Alignment", "Compounding Learning"][q.id - 1],
    earned: answers[q.id] ?? 0,
    max: 20,
  }));

  return (
    <PageLayout
      title="Organizational Readiness Benchmark | VaughnMartin Readiness OS"
      description="5 questions. Immediate score. See exactly where your organization's strategic readiness stands — and what the gap costs when a trigger fires."
    >
      <div style={{ background: "#fff", minHeight: "100vh" }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section style={{ background: NAVY, padding: "64px 48px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 20 }}>
              <div style={{ width: 24, height: 1, background: GOLD }} />
              <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>5 Questions · 3 Minutes · Immediate Score</span>
              <div style={{ width: 24, height: 1, background: GOLD }} />
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(30px,4.5vw,52px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
              How ready is your organization<br /><em style={{ color: GOLD }}>before the next trigger fires?</em>
            </h1>
            <p style={{ ...BW, fontSize: 14, color: "rgba(240,237,228,0.65)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>
              Most organizations discover their readiness gap in the middle of a situation. This benchmark takes 3 minutes and shows you exactly where you stand — before it matters.
            </p>
          </div>
        </section>

        {/* ── BENCHMARK STATS BAR ──────────────────────────────────────────── */}
        <div style={{ background: "#F8F7F4", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 780, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
            {[
              { v: "22", l: "Typical enterprise score", sub: "Before Readiness OS" },
              { v: "87", l: "Founding Partner avg.", sub: "After 90-day engagement" },
              { v: "30 days", l: "Mobilization gap", sub: "What this benchmark measures" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "18px 24px", borderRight: i < 2 ? "1px solid #E8E4DC" : "none", textAlign: "center" }}>
                <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: i === 0 ? "#DC2626" : i === 1 ? TEAL : GOLD, lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: NAVY, letterSpacing: "0.04em", marginBottom: 2 }}>{s.l}</div>
                <div style={{ ...BW, fontSize: 10, color: "#9CA3AF" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {phase === "questions" ? (
          <section style={{ padding: "56px 48px 80px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              {/* Progress */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
                <div style={{ flex: 1, height: 3, background: "#E8E4DC", position: "relative" as const, overflow: "hidden" }}>
                  <div style={{ position: "absolute" as const, left: 0, top: 0, height: "100%", width: `${(answered / QUESTIONS.length) * 100}%`, background: GOLD, transition: "width 0.3s ease" }} />
                </div>
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#9CA3AF", flexShrink: 0 }}>{answered}/{QUESTIONS.length} answered</span>
              </div>

              {QUESTIONS.map((q, qi) => (
                <div key={q.id} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: qi < QUESTIONS.length - 1 ? "1px solid #E8E4DC" : "none" }}>
                  <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, background: answers[q.id] !== undefined ? GOLD : "#F0EDE4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                      <span style={{ ...BC, fontSize: 12, fontWeight: 800, color: answers[q.id] !== undefined ? NAVY : "#9CA3AF" }}>Q{q.id}</span>
                    </div>
                    <div>
                      <p style={{ ...CG, fontSize: "clamp(16px,2vw,19px)", fontWeight: 700, color: NAVY, lineHeight: 1.4, margin: "0 0 4px" }}>{q.text}</p>
                      <p style={{ ...BW, fontSize: 12, color: "#9CA3AF", margin: 0 }}>{q.subtext}</p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingLeft: 48 }}>
                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt.points;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.points }))}
                          style={{
                            textAlign: "left" as const,
                            padding: "14px 16px",
                            border: `1.5px solid ${selected ? GOLD : "#E8E4DC"}`,
                            background: selected ? "rgba(201,168,76,0.06)" : "#fff",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: selected ? NAVY : "#4B5563", marginBottom: 3, letterSpacing: "0.02em" }}>{opt.label}</div>
                          <div style={{ ...BW, fontSize: 11, color: selected ? "#6B7280" : "#9CA3AF", lineHeight: 1.4 }}>{opt.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: "center" as const, paddingTop: 8 }}>
                <button
                  disabled={!allAnswered}
                  onClick={() => setPhase("results")}
                  style={{
                    ...BC, fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                    padding: "16px 48px",
                    background: allAnswered ? NAVY : "#E8E4DC",
                    color: allAnswered ? "#fff" : "#9CA3AF",
                    border: "none", cursor: allAnswered ? "pointer" : "not-allowed",
                    display: "inline-flex", alignItems: "center", gap: 10,
                    transition: "all 0.2s ease",
                  }}
                >
                  {allAnswered ? "See My Readiness Score" : `Answer all ${QUESTIONS.length - answered} remaining questions`}
                  {allAnswered && <ArrowRight className="w-4 h-4" />}
                </button>
                {!allAnswered && (
                  <p style={{ ...BW, fontSize: 11, color: "#9CA3AF", marginTop: 10 }}>Answer all 5 questions to generate your score</p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section style={{ padding: "56px 48px 80px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>

              {/* Score display */}
              <div style={{ textAlign: "center" as const, marginBottom: 48, padding: "40px 32px", border: `2px solid ${tierData.color}`, background: "#F8F7F4" }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: tierData.color, marginBottom: 12 }}>Your Organizational Readiness Score</div>
                <div style={{ ...CG, fontSize: "clamp(64px,10vw,96px)", fontWeight: 700, color: tierData.color, lineHeight: 1, marginBottom: 4 }}>{score}</div>
                <div style={{ ...BW, fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>out of 100</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: `${tierData.color}15`, border: `1px solid ${tierData.color}40`, color: tierData.color }}>
                  {tierData.icon}
                  <span style={{ ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{tierData.label}</span>
                </div>
              </div>

              {/* Peer comparison bar */}
              <div style={{ marginBottom: 40, padding: "24px 28px", border: "1px solid #E8E4DC", background: "#fff" }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 16 }}>Peer Comparison</div>
                {[
                  { label: "Your score", value: score, color: tierData.color },
                  { label: "Typical enterprise (pre-Readiness OS)", value: 22, color: "#DC262650" },
                  { label: "Readiness OS Founding Partners", value: 87, color: TEAL },
                ].map((row) => (
                  <div key={row.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ ...BW, fontSize: 12, color: "#4B5563", fontWeight: row.label === "Your score" ? 700 : 400 }}>{row.label}</span>
                      <span style={{ ...BC, fontSize: 12, fontWeight: 800, color: row.color }}>{row.value}</span>
                    </div>
                    <div style={{ height: 6, background: "#E8E4DC", position: "relative" as const, overflow: "hidden" }}>
                      <div style={{ position: "absolute" as const, left: 0, top: 0, height: "100%", width: `${row.value}%`, background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Key finding */}
              <div style={{ marginBottom: 40, padding: "28px 32px", borderLeft: `4px solid ${tierData.color}`, background: "#F8F7F4" }}>
                <p style={{ ...CG, fontSize: 18, fontWeight: 700, color: NAVY, lineHeight: 1.45, marginBottom: 10 }}>{tierData.headline}</p>
                <p style={{ ...BW, fontSize: 13, color: "#4B5563", margin: 0, lineHeight: 1.75 }}>{tierData.body}</p>
              </div>

              {/* Dimension breakdown */}
              <div style={{ marginBottom: 40 }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 16 }}>Score by Dimension</div>
                {questionScores.map((qs, i) => {
                  const pct = (qs.earned / qs.max) * 100;
                  const barColor = pct >= 75 ? TEAL : pct >= 50 ? GOLD : pct >= 25 ? "#D97706" : "#DC2626";
                  return (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ ...BW, fontSize: 12, color: "#4B5563" }}>{qs.shortLabel}</span>
                        <span style={{ ...BC, fontSize: 12, fontWeight: 800, color: barColor }}>{qs.earned}/{qs.max}</span>
                      </div>
                      <div style={{ height: 6, background: "#E8E4DC", position: "relative" as const, overflow: "hidden" }}>
                        <div style={{ position: "absolute" as const, left: 0, top: 0, height: "100%", width: `${pct}%`, background: barColor, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* What this means */}
              <div style={{ marginBottom: 40, padding: "24px 28px", background: NAVY, color: "#fff" }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.7)", marginBottom: 14 }}>What Readiness OS Closes</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { gap: "Weeks of mobilization", fix: "Pre-staged before the trigger" },
                    { gap: "Ad-hoc signal monitoring", fix: "248+ sources, every 15 minutes" },
                    { gap: "Plans built when crisis hits", fix: "180 protocols pre-staged and ready" },
                    { gap: "Days to align stakeholders", fix: "Simultaneous briefs in under 3 min" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ ...BW, fontSize: 11, color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>{row.gap}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 6, height: 6, background: TEAL, flexShrink: 0, display: "inline-block" }} />
                        <span style={{ ...BW, fontSize: 11, color: "rgba(255,255,255,0.85)" }}>{row.fix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div style={{ textAlign: "center" as const }}>
                <p style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Founding Partner Program — Selective Cohort · 2026</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: 20 }}>
                  <Link href="/request-access">
                    <span style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "14px 28px", cursor: "pointer", textDecoration: "none" }}>
                      Apply for Founding Partner Access <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                  <Link href="/how-it-executes">
                    <span style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: NAVY, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "14px 28px", border: "1px solid #E8E4DC", cursor: "pointer", textDecoration: "none" }}>
                      See How 12 Minutes Works
                    </span>
                  </Link>
                </div>
                <button
                  onClick={() => { setAnswers({}); setPhase("questions"); }}
                  style={{ ...BW, fontSize: 11, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Retake the benchmark
                </button>
              </div>

            </div>
          </section>
        )}

      </div>
    </PageLayout>
  );
}
