import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { ArrowRight, Clock, Target, TrendingDown, Calculator } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F0EDE4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG = { fontFamily: "'Cormorant Garamond', serif" } as const;

function formatDollars(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function PlanningGap() {
  const [, setLocation] = useLocation();
  const [planningWeeks, setPlanningWeeks] = useState(8);
  const [participants, setParticipants] = useState(12);
  const [percentIntended, setPercentIntended] = useState(97);
  const [situationsFired, setSituationsFired] = useState(4);
  const [avgResponseDays, setAvgResponseDays] = useState(28);

  useEffect(() => {
    document.title = "The Planning Gap Calculator — Readiness OS by VaughnMartin";
  }, []);

  const totalPlanningHours = planningWeeks * 40 * participants;
  const hoursOnUnintended = Math.round(totalPlanningHours * (1 - percentIntended / 100));
  const redirectHours = Math.round(totalPlanningHours * 0.15);
  const costPerUnhandledSituation = avgResponseDays * 8 * participants * 500;
  const totalAnnualGapCost = situationsFired * costPerUnhandledSituation;
  const redirectedBudget = redirectHours * 500;

  const sliders = [
    { label: "Planning cycle length (weeks)", value: planningWeeks, min: 2, max: 20, step: 1, display: `${planningWeeks} weeks`, set: setPlanningWeeks },
    { label: "Participants in planning sessions", value: participants, min: 3, max: 60, step: 1, display: `${participants} people`, set: setParticipants },
    { label: "% of planning time on intended outcomes (roadmap, initiatives, targets)", value: percentIntended, min: 50, max: 100, step: 1, display: `${percentIntended}%`, set: setPercentIntended },
    { label: "Unintended situations that fired last year (off-roadmap)", value: situationsFired, min: 0, max: 25, step: 1, display: situationsFired === 0 ? "None recorded" : `${situationsFired} situations`, set: setSituationsFired },
    { label: "Average days to mobilize per unintended situation", value: avgResponseDays, min: 5, max: 60, step: 1, display: `${avgResponseDays} days`, set: setAvgResponseDays },
  ];

  const results = [
    {
      icon: Clock,
      label: "Planning hours on unintended situations",
      value: hoursOnUnintended === 0 ? "0 hours" : `${hoursOnUnintended.toLocaleString()} hrs`,
      sub: `Out of ${totalPlanningHours.toLocaleString()} total planning hours`,
      variant: hoursOnUnintended === 0 ? "alert" : "neutral",
    },
    {
      icon: Target,
      label: "Hours freed by redirecting 15% of existing planning time",
      value: `${redirectHours.toLocaleString()} hrs`,
      sub: "Available to pre-stage unintended situations — no new calendar additions",
      variant: "good",
    },
    {
      icon: TrendingDown,
      label: "Estimated mobilization cost — unhandled situations",
      value: situationsFired === 0 ? "$0" : formatDollars(totalAnnualGapCost),
      sub: `${situationsFired} situations × ${avgResponseDays}-day mobilization at $500/hr loaded rate`,
      variant: situationsFired > 0 ? "alert" : "neutral",
    },
    {
      icon: Calculator,
      label: "Budget redirected (not added) to close the gap",
      value: formatDollars(redirectedBudget),
      sub: "Existing planning budget. Not new spend.",
      variant: "good",
    },
  ];

  function variantStyles(v: string) {
    if (v === "good") return { bg: "rgba(43,138,110,0.05)", border: "rgba(43,138,110,0.2)", accent: TEAL };
    if (v === "alert") return { bg: "rgba(239,68,68,0.04)", border: "rgba(239,68,68,0.15)", accent: "#EF4444" };
    return { bg: OFF, border: BORDER, accent: "#D1D5DB" };
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: NAVY, padding: "72px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <VaughnMartinLogo color="light" height={36} variant="full" />
          <div style={{ marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>The Planning Gap Calculator</span>
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(30px,5vw,52px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
              How much of your planning cycle<br />
              <em style={{ color: GOLD }}>addresses the situations that weren't on the plan?</em>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 640, lineHeight: 1.75 }}>
              Organizations spend weeks in annual planning. Almost none of that time pre-stages responses to strategic triggers that will fire regardless of the roadmap. Enter your numbers. See your gap.
            </p>
          </div>
        </div>
      </section>

      {/* The Opener Question */}
      <section style={{ background: "#fff", padding: "48px 48px 0", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ background: OFF, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GOLD}`, padding: "28px 32px", marginBottom: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>The Question That Starts Every Honest Planning Conversation</div>
            <p style={{ ...CG, fontSize: "clamp(17px,2.5vw,26px)", fontStyle: "italic", color: NAVY, lineHeight: 1.45, margin: 0 }}>
              "In your last annual planning cycle, how much time was spent preparing for situations that were not on your roadmap — the ones that arrived anyway?"
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ background: "#fff", padding: "56px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>

            {/* Inputs */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 28 }}>Your Planning Cycle</div>
              {sliders.map(({ label, value, min, max, step, display, set }) => (
                <div key={label} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, maxWidth: "73%", lineHeight: 1.4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{display}</div>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={e => set(Number(e.target.value))}
                    style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: MUTED, marginTop: 3 }}>
                    <span>{min}</span><span>{max}</span>
                  </div>
                </div>
              ))}
              <div style={{ background: OFF, border: `1px solid ${BORDER}`, padding: "16px 18px", marginTop: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 6 }}>Assumptions</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.65 }}>Fully-loaded rate: $500/hr · Planning intensity: 40 hrs/week · Mobilization cost = days × 8 hrs × participants × rate</div>
              </div>
            </div>

            {/* Results */}
            <div style={{ position: "sticky", top: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>Your Planning Gap</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {results.map(({ icon: Icon, label, value, sub, variant }) => {
                  const s = variantStyles(variant);
                  return (
                    <div key={label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.accent}`, padding: "18px 20px" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 32, height: 32, background: `${s.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={14} color={s.accent} />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{label}</div>
                          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: variant === "alert" && value !== "$0" ? "#DC2626" : variant === "good" ? TEAL : NAVY, lineHeight: 1 }}>{value}</div>
                          <div style={{ fontSize: 11, color: MUTED, marginTop: 5, lineHeight: 1.5 }}>{sub}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: NAVY, padding: "22px 22px", marginTop: 16 }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 14 }}>
                  {hoursOnUnintended === 0
                    ? "Your planning cycle currently allocates zero hours to the situations that arrive off-roadmap. Readiness OS proposes redirecting 15% of your existing window — no new budget, no new calendar — to close that gap before the next trigger fires."
                    : `Your planning cycle allocates ${hoursOnUnintended} hours to unintended situations. Redirecting ${redirectHours} additional hours from the existing window pre-stages the responses that currently assemble reactively.`}
                </p>
                <button
                  onClick={() => setLocation("/request-access")}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "14px 0", border: "none", cursor: "pointer" }}
                >
                  Apply for Founding Partner Access <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Redirect Framing */}
      <section style={{ background: OFF, padding: "72px 48px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>What the Redirect Looks Like in Practice</span>
            <div style={{ width: 28, height: 2, background: GOLD }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { week: "Weeks 1–2", label: "Map Your Unintended Situations", desc: "Identify the 10–15 strategic triggers most likely to fire this fiscal year that are not on your roadmap. The 221-trigger library is your starting point." },
              { week: "Weeks 3–5", label: "Configure Priority Protocols", desc: "Select and configure the 5–10 most critical Readiness Protocols for your org structure, decision rights, and stakeholder roster." },
              { week: "Weeks 6–8", label: "Run and Certify", desc: "Activate each protocol against a practice trigger. Confirm your readiness score and baseline response time before the year begins." },
            ].map(({ week, label, desc }) => (
              <div key={week} style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "24px 22px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>{week}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: NAVY, padding: "64px 48px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" as const }}>
          <p style={{ ...CG, fontSize: "clamp(22px,3vw,34px)", fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>
            The offseason already exists.
          </p>
          <p style={{ ...CG, fontSize: "clamp(22px,3vw,34px)", fontWeight: 600, color: GOLD, lineHeight: 1.2, marginBottom: 28, fontStyle: "italic" }}>
            You just haven't used it for this yet.
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.65 }}>
            The 90-day Founding Partner Program starts with your planning cycle. Redirecting 15–20% of the annual planning window toward pre-staging is how the Readiness Planning Sprint fits without new budget or new time.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}>
            <button
              onClick={() => setLocation("/request-access")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 36px", border: "none", cursor: "pointer" }}
            >
              Apply for Founding Partner Access <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setLocation("/making-the-case")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 36px", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
            >
              Build the Internal Case
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
