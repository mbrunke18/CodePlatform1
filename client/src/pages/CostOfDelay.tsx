import { useState, useEffect, useRef, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown, Clock, DollarSign, Users } from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const OFF = "#F8F7F4";
const RED = "#EF4444";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

function fmtFull(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}

interface Inputs {
  execCount: number;
  execHourlyRate: number;
  triggersPerYear: number;
  mobilizationDays: number;
  companyRevenue: number;
}

function calculate(inputs: Inputs, evaluationSeconds: number) {
  const hoursPerMobilization = inputs.mobilizationDays * 8;
  const costPerTrigger = inputs.execCount * inputs.execHourlyRate * hoursPerMobilization;
  const annualMobilizationTax = costPerTrigger * inputs.triggersPerYear;

  const readinessCoreAnnual = 150000;
  const readinessForesightAnnual = 250000;

  const netSavingsCore = annualMobilizationTax - readinessCoreAnnual;
  const roiCore = readinessCoreAnnual > 0 ? Math.round((netSavingsCore / readinessCoreAnnual) * 100) : 0;

  const costPerDay = annualMobilizationTax / 365;
  const costPerHour = costPerDay / 24;
  const costPerSecond = costPerHour / 3600;
  const evaluationCost = costPerSecond * evaluationSeconds;

  const breakEvenTriggers = readinessCoreAnnual / costPerTrigger;

  return {
    costPerTrigger,
    annualMobilizationTax,
    netSavingsCore,
    roiCore,
    costPerDay,
    evaluationCost,
    breakEvenTriggers,
    readinessCoreAnnual,
  };
}

function Slider({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: GOLD, fontFamily: "monospace" }}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: MUTED, marginTop: 3 }}>
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function CostOfDelay() {
  const [, setLocation] = useLocation();
  const [inputs, setInputs] = useState<Inputs>({
    execCount: 6,
    execHourlyRate: 500,
    triggersPerYear: 6,
    mobilizationDays: 21,
    companyRevenue: 1000,
  });

  const [evaluationSeconds, setEvaluationSeconds] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    updatePageMetadata({
      title: "Cost of Delay Calculator — Readiness OS | What Your Mobilization Gap Costs",
      description: "Calculate exactly what your current 30-day mobilization cycle is costing your organization per year — in executive time, delayed decisions, and strategic exposure.",
      ogTitle: "Cost of Delay — Readiness OS",
      ogDescription: "See what your coordination gap costs while you read this page. The counter is running.",
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvaluationSeconds(Math.round((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calc = calculate(inputs, evaluationSeconds);

  const set = (key: keyof Inputs) => (v: number) => setInputs(prev => ({ ...prev, [key]: v }));

  const evaluationMinutes = Math.floor(evaluationSeconds / 60);
  const evalSecs = evaluationSeconds % 60;

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: NAVY, padding: "72px 48px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 28, height: 2, background: RED }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: RED, ...BC }}>The Cost of Waiting</span>
            <div style={{ width: 28, height: 2, background: RED }} />
          </div>
          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(34px,5vw,52px)", color: "#fff", lineHeight: 1.08, marginBottom: 18 }}>
            What is your current mobilization<br />
            <em style={{ color: GOLD }}>model costing you right now?</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 580, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Most enterprises don't know their coordination gap has a price tag. It does. Adjust the inputs below to see yours.
          </p>

          {/* Live ticking counter */}
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", padding: "20px 32px", display: "inline-block" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", color: RED, ...BC, marginBottom: 6, textTransform: "uppercase" as const }}>
              Your mobilization cost while you've been on this page
            </div>
            <div style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, color: RED, fontFamily: "monospace", lineHeight: 1 }}>
              {fmtFull(calc.evaluationCost)}
            </div>
            <div style={{ fontSize: 12, color: "rgba(239,68,68,0.6)", marginTop: 4 }}>
              {evaluationMinutes > 0 ? `${evaluationMinutes}m ${evalSecs}s` : `${evalSecs}s`} elapsed · ${Math.round(calc.costPerDay / 24).toLocaleString()}/hour at your current model
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ background: OFF, padding: "64px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 400px", gap: 40, alignItems: "start" }}>

          {/* Left: Inputs */}
          <div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, ...BC, marginBottom: 8 }}>Your Organization</div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(22px,2.8vw,32px)", color: NAVY, marginBottom: 6 }}>Tell us about your mobilization model</h2>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
                Adjust the sliders to match your organization. The cost calculation updates in real time.
              </p>
            </div>

            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "32px 28px" }}>
              <Slider
                label="Senior executives involved in a major trigger response"
                value={inputs.execCount}
                min={3} max={20} step={1}
                format={v => `${v} executives`}
                onChange={set("execCount")}
              />
              <Slider
                label="Average senior executive all-in cost per hour"
                value={inputs.execHourlyRate}
                min={250} max={1500} step={50}
                format={v => `$${v}/hr`}
                onChange={set("execHourlyRate")}
              />
              <Slider
                label="Significant strategic triggers per year"
                value={inputs.triggersPerYear}
                min={2} max={24} step={1}
                format={v => `${v} per year`}
                onChange={set("triggersPerYear")}
              />
              <Slider
                label="Current mobilization time — trigger to coordinated action"
                value={inputs.mobilizationDays}
                min={3} max={60} step={1}
                format={v => v === 1 ? "1 day" : `${v} days`}
                onChange={set("mobilizationDays")}
              />

              <div style={{ marginTop: 8, padding: "12px 16px", background: OFF, borderLeft: `3px solid ${TEAL}` }}>
                <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>
                  <strong style={{ color: NAVY }}>What counts as mobilization time?</strong> The days between when a strategic trigger is first detected and when your organization has a coordinated, authorized response in motion — including stakeholder alignment, brief preparation, and executive authorization.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>

            {/* Primary cost */}
            <div style={{ background: NAVY, padding: "28px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: TEAL, ...BC, marginBottom: 16, textTransform: "uppercase" as const }}>Your Annual Mobilization Tax</div>
              <div style={{ fontSize: "clamp(36px,5vw,52px)", fontWeight: 700, color: RED, fontFamily: "monospace", lineHeight: 1, marginBottom: 8 }}>
                {fmt(calc.annualMobilizationTax)}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                {inputs.execCount} executives × ${inputs.execHourlyRate}/hr × {inputs.mobilizationDays * 8} hrs × {inputs.triggersPerYear} triggers/yr
              </div>
            </div>

            {/* Per-trigger breakdown */}
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: NAVY, ...BC, marginBottom: 14, textTransform: "uppercase" as const }}>Cost Breakdown</div>
              {[
                { label: "Cost per situation", value: fmtFull(calc.costPerTrigger), color: RED },
                { label: "Cost per mobilization day", value: fmtFull(calc.costPerDay), color: MUTED },
                { label: "Annual mobilization tax", value: fmt(calc.annualMobilizationTax), color: RED },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none" }}>
                  <span style={{ fontSize: 12, color: MUTED }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: row.color, fontFamily: "monospace" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Comparison */}
            <div style={{ background: "#fff", border: `2px solid ${TEAL}`, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: TEAL, ...BC, marginBottom: 14, textTransform: "uppercase" as const }}>vs. Readiness OS Core</div>
              {[
                { label: "Your current annual cost", value: fmt(calc.annualMobilizationTax), color: RED },
                { label: "Readiness OS Core", value: "$150K/yr", color: TEAL },
                { label: "Net annual saving", value: calc.netSavingsCore > 0 ? fmt(calc.netSavingsCore) : "See below", color: calc.netSavingsCore > 0 ? TEAL : MUTED },
                { label: "First-year ROI", value: `${calc.roiCore.toLocaleString()}%`, color: NAVY },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${BORDER}` : "none" }}>
                  <span style={{ fontSize: 12, color: MUTED }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: row.color, fontFamily: "monospace" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: "10px 12px", background: TEAL }}>
                <div style={{ fontSize: 12, color: "#fff", fontWeight: 700, textAlign: "center" as const }}>
                  Break-even: {calc.breakEvenTriggers < 0.5 ? "less than 1 trigger" : calc.breakEvenTriggers < 1 ? "first activation" : `${calc.breakEvenTriggers.toFixed(1)} triggers`}
                </div>
              </div>
            </div>

            {/* The real-time counter callout */}
            <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: RED, ...BC, marginBottom: 6, textTransform: "uppercase" as const }}>While you read this</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: RED, fontFamily: "monospace" }}>{fmtFull(calc.evaluationCost)}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>accumulated in mobilization cost equivalent since you opened this page</div>
            </div>

            <Button
              onClick={() => setLocation("/request-access")}
              style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const, width: "100%", padding: "18px", ...BC }}
            >
              Apply for Founding Partner Access <ArrowRight style={{ marginLeft: 6, width: 13, height: 13 }} />
            </Button>
          </div>
        </div>
      </section>

      {/* "While you were evaluating" section */}
      <section style={{ background: "#fff", padding: "64px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: RED }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: RED, ...BC }}>While You Were Evaluating</span>
              <div style={{ width: 28, height: 2, background: RED }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(22px,3vw,34px)", color: NAVY, marginBottom: 10 }}>
              In a typical 90-day evaluation cycle, this happens.
            </h2>
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 560, margin: "0 auto" }}>
              This is not hypothetical. These are the types of triggers that fired for enterprises in active evaluation cycles in the past 12 months.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                day: "Day 8",
                title: "Your CFO resigns without notice on a Monday morning",
                who: "Every organization",
                cost: "$10M–$45M",
                outcome: "Legal, IR, HR, the board, and the CEO each get a separate phone call. No unified brief exists. The narrative fractures before 10 AM. Investors call before you have a statement.",
                color: RED,
              },
              {
                day: "Day 19",
                title: "Ransomware indicators appear in log monitoring at 3:17 AM",
                who: "Every organization",
                cost: "$4.5M avg + operational disruption",
                outcome: "The on-call engineer can't reach the CISO until 6 AM. Legal doesn't know until Day 2. The breach was contained in hours. The decision about whether to notify customers took 11 days — and that's where the real cost was.",
                color: RED,
              },
              {
                day: "Day 33",
                title: "Regulatory enforcement inquiry notice arrives without warning",
                who: "Any company with regulatory exposure",
                cost: "$8M–$60M in fees and operational disruption",
                outcome: "General counsel calls outside counsel. Outside counsel says don't talk to anyone. So they say nothing — separately. Every stakeholder goes quiet on their own terms. The story gets written without you, by reporters talking to each other.",
                color: "#D97706",
              },
              {
                day: "Day 46",
                title: "Your largest customer signals they won't renew",
                who: "Any B2B company",
                cost: "15–30% of annual revenue at risk",
                outcome: "Account team escalates to the CSO. CSO calls the CEO. CEO schedules a meeting. Two weeks pass before a retention brief reaches the board — by then the customer has already taken a meeting with your competitor. Buyers talk. The other meetings are already scheduled.",
                color: "#D97706",
              },
              {
                day: "Day 58",
                title: "A senior leader is credibly accused of serious workplace misconduct",
                who: "Every organization",
                cost: "$5M–$50M in liability, turnover, and brand damage",
                outcome: "HR calls legal. Legal calls outside counsel. The CEO learns from a board member who learned from a reporter. No unified response exists. Every hour without a coordinated statement is another hour the narrative sets without you.",
                color: RED,
              },
              {
                day: "Day 72",
                title: "A post about your company crosses 200,000 shares before 8 AM",
                who: "Any organization with brand exposure",
                cost: "$3M–$25M in brand damage and lost revenue",
                outcome: "Your PR lead sees it at 7:43 AM. Legal isn't reachable until 9. The CEO is in a flight. By the time a response is approved, the story has been picked up by three outlets and the narrative is set — without your voice in it.",
                color: RED,
              },
            ].map((event, i) => (
              <div key={i} style={{ border: `1px solid ${BORDER}`, padding: "20px 18px", background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: event.color, ...BC, whiteSpace: "nowrap" as const }}>{event.day} OF EVALUATION</span>
                  <span style={{ fontSize: 8, color: MUTED, ...BC, letterSpacing: "0.08em", textAlign: "right" as const, lineHeight: 1.3 }}>{event.who.toUpperCase()}</span>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8, lineHeight: 1.4 }}>{event.title}</h3>
                <div style={{ fontSize: 10, fontWeight: 800, color: event.color, letterSpacing: "0.08em", marginBottom: 8, ...BC }}>EXPOSURE: {event.cost}</div>
                <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.6, margin: 0 }}>{event.outcome}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: "24px 32px", background: NAVY, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>The 90-day evaluation window is itself a risk event.</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Based on trigger frequency data across enterprise clients and public regulatory filings.</div>
            </div>
            <Button
              onClick={() => setLocation("/request-access")}
              style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "14px 28px", ...BC, flexShrink: 0 }}
            >
              End the Evaluation Cycle <ArrowRight style={{ marginLeft: 6, width: 13, height: 13 }} />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: NAVY, padding: "64px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3.5vw,40px)", color: "#fff", marginBottom: 14, lineHeight: 1.15 }}>
            The cost of delay is real.<br />
            <em style={{ color: GOLD }}>The cost of Readiness OS is fixed.</em>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 32, lineHeight: 1.7 }}>
            Every day you're evaluating, the counter runs. One situation during your evaluation window costs more than a full year of Core. The math ends the conversation.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
            <Button
              onClick={() => setLocation("/request-access")}
              style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 32px", ...BC }}
            >
              Apply for Founding Partner Access <ArrowRight style={{ marginLeft: 6, width: 13, height: 13 }} />
            </Button>
            <Button
              onClick={() => setLocation("/sector-briefing")}
              variant="outline"
              style={{ border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", background: "transparent", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "16px 32px", ...BC }}
            >
              See Your Sector Briefing
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
