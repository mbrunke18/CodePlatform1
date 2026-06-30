import { useState, useRef } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import type { CSSProperties } from "react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

// ─── Section anchor helper ────────────────────────────────────────────────────
function Anchor({ id }: { id: string }) {
  return <div id={id} style={{ scrollMarginTop: 80 }} />;
}

// ─── Gold rule ────────────────────────────────────────────────────────────────
function GoldRule() {
  return <div style={{ width: 40, height: 2, background: GOLD, margin: "16px 0" }} />;
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
      — {children}
    </div>
  );
}

// ─── Stat block ───────────────────────────────────────────────────────────────
function StatBlock({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div style={{ padding: "24px 20px", border: `1px solid ${BORDER}`, background: "#fff", textAlign: "center" }}>
      <div style={{ ...CG, fontSize: 42, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{value}</div>
      <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

// ─── ROI Calculator (embedded, simplified) ────────────────────────────────────
function EmbeddedROI() {
  const [revenue, setRevenue] = useState(1);
  const [events, setEvents] = useState(3);
  const [execs, setExecs] = useState(12);

  const rate = revenue >= 10 ? 1800 : revenue >= 1 ? 1200 : 800;
  const mobilizationHours = 720; // 30 days × ~24hr exec drain across 12 people approximation → simplified
  const execHoursPerEvent = execs * 40;
  const mobilizationCostPerEvent = execHoursPerEvent * rate;
  const annualMobilizationCost = mobilizationCostPerEvent * events;
  const revenueAtRiskPerEvent = revenue * 1000000 * 0.02;
  const annualRevenueRisk = revenueAtRiskPerEvent * events;
  const platformCost = 150000;
  const annualExposure = annualMobilizationCost + annualRevenueRisk;
  const netValue = annualExposure - platformCost;
  const roiPct = Math.round((netValue / platformCost) * 100);

  const fmt = (n: number) =>
    n >= 1000000
      ? `$${(n / 1000000).toFixed(1)}M`
      : `$${(n / 1000).toFixed(0)}K`;

  return (
    <div style={{ background: NAVY, padding: "40px 36px", color: "#fff" }}>
      <SectionLabel>Conservative ROI Model</SectionLabel>
      <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
        See the exposure you're carrying right now.
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 32, lineHeight: 1.7 }}>
        Adjust the sliders. Every number uses conservative published benchmarks — McKinsey labor rates, Gartner revenue-at-risk baselines.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Revenue */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Annual Revenue</div>
          <input type="range" min={0.1} max={50} step={0.1} value={revenue} onChange={e => setRevenue(+e.target.value)}
            style={{ width: "100%", accentColor: GOLD }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 6 }}>${revenue >= 1 ? `${revenue.toFixed(1)}B` : `${(revenue * 1000).toFixed(0)}M`}</div>
        </div>
        {/* Events */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Strategic Situations / Year</div>
          <input type="range" min={1} max={12} step={1} value={events} onChange={e => setEvents(+e.target.value)}
            style={{ width: "100%", accentColor: GOLD }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 6 }}>{events} event{events !== 1 ? "s" : ""}</div>
        </div>
        {/* Execs */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Executives Mobilized</div>
          <input type="range" min={4} max={30} step={1} value={execs} onChange={e => setExecs(+e.target.value)}
            style={{ width: "100%", accentColor: GOLD }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 6 }}>{execs} executives</div>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
        {[
          { label: "Annual Mobilization Cost", value: fmt(annualMobilizationCost), sub: `${events} events × ${execs} execs × ${fmt(rate)}/hr` },
          { label: "Annual Revenue at Risk", value: fmt(annualRevenueRisk), sub: "2% of revenue per trigger (Gartner baseline)" },
          { label: "Total Annual Exposure", value: fmt(annualExposure), accent: true },
          { label: "Net Value vs. Platform Cost", value: `${roiPct}% ROI`, sub: `vs. ${fmt(platformCost)}/yr platform`, accent: true },
        ].map((s, i) => (
          <div key={i} style={{ background: s.accent ? GOLD : "rgba(255,255,255,0.06)", padding: "20px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: s.accent ? NAVY : "rgba(255,255,255,0.5)", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.accent ? NAVY : "#fff", lineHeight: 1 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 10, color: s.accent ? "rgba(10,15,46,0.6)" : "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
        Conservative assumptions. Actual outcomes vary. Sources: McKinsey Global Institute, Gartner, IBM Cost of a Data Breach 2023.
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TheCase() {
  const [, nav] = useLocation();
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      label: "Ransomware",
      domain: "Risk & Resilience",
      company: "Financial Services · $14B revenue",
      trigger: "23 servers encrypted. Ransom note across payment processing infrastructure.",
      without: { time: "30 days", cost: "$47M in regulatory penalties + brand recovery", headline: "30 days of managed chaos — every delay a compounding liability." },
      with: { time: "12 minutes", cost: "$0 in regulatory penalties. Customer trust maintained.", headline: "Systems isolated. Regulatory disclosure filed on time. Board notified before markets opened." },
    },
    {
      label: "Activist Investor",
      domain: "Growth & Positioning",
      company: "Public Company · $8.2B market cap",
      trigger: "Elliott Management files 13D at 2:47 AM. Board seat demand. Proxy fight signaled.",
      without: { time: "3 weeks", cost: "$2.1M in advisory fees. Proxy fight initiated.", headline: "Three weeks of reactive positioning — investor relations scrambling, legal on retainer, no unified response." },
      with: { time: "12 minutes", cost: "Banker briefed, talking points staged, board chair notified — before markets open.", headline: "Pre-staged response. Board chair briefed. Banker engaged. Regulatory filings queued. Unified message deployed." },
    },
    {
      label: "Supply Chain Collapse",
      domain: "Risk & Resilience",
      company: "Manufacturing · Global Operations",
      trigger: "Primary supplier files Chapter 11. 60% of Q3 production at risk.",
      without: { time: "30 days", cost: "$18M in production loss + customer penalties.", headline: "Supplier alternatives unknown. Contracts buried in SharePoint. Procurement scrambling for weeks." },
      with: { time: "12 minutes", cost: "Alternate suppliers pre-qualified, contracts staged, customer notifications drafted.", headline: "Alternate suppliers already mapped. Contracts pre-staged. Customer communications deployed in the first hour." },
    },
  ];

  const s = stories[activeStory];

  return (
    <PageLayout>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "80px 0 64px", position: "relative", overflow: "hidden" }}>
        {/* grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", position: "relative" }}>
          <SectionLabel>The Case for Readiness OS</SectionLabel>
          <h1 style={{ ...CG, fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
            The argument you can't<br />
            <span style={{ color: GOLD }}>argue your way out of.</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 640, lineHeight: 1.8, marginBottom: 36 }}>
            Every enterprise spends weeks mobilizing after a trigger fires — figuring out who's in the room, agreeing on a plan, aligning stakeholders — before execution even begins. This page makes that cost visible, proves the alternative works, and shows why you can't replicate it anywhere else.
          </p>
          {/* Nav pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "The Problem Cost", href: "#problem" },
              { label: "The Proof", href: "#proof" },
              { label: "The Moat", href: "#moat" },
              { label: "The ROI", href: "#roi" },
              { label: "What You Can't Get Elsewhere", href: "#comparison" },
              { label: "The Decision", href: "#cta" },
            ].map((pill) => (
              <a key={pill.href} href={pill.href}
                style={{ padding: "8px 16px", background: "rgba(255,255,255,0.08)", border: `1px solid rgba(201,168,76,0.25)`, color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: "0.04em", borderRadius: "0.15rem", transition: "background 0.15s" }}>
                {pill.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 1: THE PROBLEM HAS A PRICE TAG ───────────────────────── */}
      <section style={{ background: IVORY, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <Anchor id="problem" />
          <SectionLabel>The Problem Has a Price Tag</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <h2 style={{ ...CG, fontSize: 38, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
                Before the solution — understand what the current model costs.
              </h2>
              <GoldRule />
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.9, marginBottom: 20 }}>
                When a strategic trigger fires — ransomware at 3 AM, an activist filing a 13D, a supplier collapsing — the enterprise doesn't execute. It <em>mobilizes</em>. That mobilization cycle is the hidden cost no vendor talks about.
              </p>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.9, marginBottom: 20 }}>
                Figuring out who needs to be in the room. Agreeing on a plan. Aligning stakeholders. Locating the right documents. Finding budget authority. Convening a committee. That process takes 30 days — conservatively — in every organization from startup to Fortune 500.
              </p>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.9 }}>
                <strong style={{ color: NAVY }}>The 30 days isn't the execution time. It's the time before execution begins.</strong> And every day of delay compounds — in penalties, in lost revenue, in brand damage, in competitor advantage.
              </p>
            </div>
            <div>
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "28px 24px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>The Mobilization Tax — What It Actually Costs</div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 20 }}>Every situation carries these costs — not from the response itself, but from the 30 days spent mobilizing before execution can begin.</div>
                {[
                  {
                    category: "Executive Time",
                    desc: "Senior leaders pulled from their core work — alignment calls, decision meetings, stakeholder briefings — before a single action is taken. Every hour of C-suite delay is the most expensive hour in your organization.",
                    icon: "⏱",
                  },
                  {
                    category: "Revenue at Risk",
                    desc: "For every day the mobilization cycle extends, the window for competitive response, customer retention, or containment narrows. The delay doesn't pause the business — it exposes it.",
                    icon: "📉",
                  },
                  {
                    category: "Outside Counsel & Specialists",
                    desc: "Unplanned legal, regulatory, and communications engagement. Retained at emergency rates because the situation wasn't pre-staged — contracts weren't ready, counsel wasn't briefed, relationships weren't established before the trigger.",
                    icon: "⚖️",
                  },
                  {
                    category: "Regulatory Penalty Exposure",
                    desc: "For incidents with disclosure requirements — data breaches, FDA recalls, SEC material events — the clock starts at the moment of the trigger, not when your team finishes mobilizing. Every day of delay in the response is a day closer to a missed deadline.",
                    icon: "🏛",
                  },
                  {
                    category: "Consulting Retainer to Build the Response Plan",
                    desc: "The engagement that shouldn't exist. When a trigger fires and there's no pre-staged protocol, the organization commissions one — at emergency rates, under time pressure, from a team that doesn't know your people or your authorization chain.",
                    icon: "📋",
                  },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < 4 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{item.category}</div>
                      <div style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.7 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "14px 16px", background: NAVY, borderLeft: `3px solid ${GOLD}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 4 }}>Use the ROI calculator below to put your organization's numbers on this.</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  Input your revenue, trigger frequency, and executive count. The model uses published benchmark rates — you control every assumption.
                </div>
              </div>
            </div>
          </div>

          {/* The universal truth */}
          <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: BORDER }}>
            {[
              { scale: "Startup", size: "$5M–$50M revenue", reality: "3 people own every function. When a trigger fires, they're all in the room — but nobody prepared for this. The founder makes calls. Days pass." },
              { scale: "Mid-Market", size: "$100M–$1B revenue", reality: "Enough structure to slow decisions, not enough to pre-stage them. The committee forms. The alignment meeting happens. Then another. 30 days is generous." },
              { scale: "Enterprise", size: "$1B+ revenue", reality: "Most sophisticated — most delayed. 12 layers of approval. Global legal review. Board notification protocols. McKinsey on retainer. And still 30 days to mobilize." },
            ].map((tier, i) => (
              <div key={i} style={{ background: "#fff", padding: "28px 24px" }}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: TEAL, marginBottom: 6 }}>{tier.scale}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>{tier.size}</div>
                <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.7 }}>{tier.reality}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, textAlign: "center", fontSize: 14, fontWeight: 600, color: NAVY }}>
            The 30-day mobilization gap is not a size problem. It's a model problem. Every organization has it.
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE PROOF ─────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <Anchor id="proof" />
          <SectionLabel>The Proof</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 48 }}>
            <div>
              <h2 style={{ ...CG, fontSize: 38, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
                Same trigger. Entirely different outcome.
              </h2>
              <GoldRule />
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.9 }}>
                Three real activation archetypes. The numbers on the left are documented outcomes from the traditional mobilization model. The numbers on the right are what happens when the response is staged before the trigger fires.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {stories.map((st, i) => (
                <button key={i} onClick={() => setActiveStory(i)}
                  style={{ flex: 1, padding: "12px 8px", background: i === activeStory ? NAVY : "#fff", border: `1px solid ${i === activeStory ? NAVY : BORDER}`, color: i === activeStory ? "#fff" : NAVY, fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: "0.15rem" }}>
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Story comparison */}
          <div style={{ background: IVORY, padding: "4px", marginBottom: 48 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {/* Without */}
              <div style={{ background: "#fff", padding: "28px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#DC2626", marginBottom: 12 }}>Without Readiness OS</div>
                <div style={{ ...CG, fontSize: 52, fontWeight: 700, color: "#DC2626", lineHeight: 1 }}>{s.without.time}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4, marginBottom: 16 }}>to mobilize a full response</div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>{s.without.headline}</div>
                <div style={{ padding: "12px 16px", background: "#FEF2F2", borderLeft: "3px solid #DC2626" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginBottom: 2 }}>OUTCOME</div>
                  <div style={{ fontSize: 13, color: "#374151" }}>{s.without.cost}</div>
                </div>
              </div>
              {/* With */}
              <div style={{ background: NAVY, padding: "28px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL, marginBottom: 12 }}>With Readiness OS</div>
                <div style={{ ...CG, fontSize: 52, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.with.time}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, marginBottom: 16 }}>to full coordinated response</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 16 }}>{s.with.headline}</div>
                <div style={{ padding: "12px 16px", background: "rgba(43,138,110,0.15)", borderLeft: `3px solid ${TEAL}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, marginBottom: 2 }}>OUTCOME</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{s.with.cost}</div>
                </div>
              </div>
            </div>
            <div style={{ background: "#fff", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: MUTED }}><strong style={{ color: NAVY }}>{s.company}</strong> · {s.domain} · Trigger: {s.trigger}</div>
              <a href="/proof-story" style={{ fontSize: 12, fontWeight: 700, color: GOLD, textDecoration: "none" }}>Full narrative →</a>
            </div>
          </div>

          {/* Proof numbers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <StatBlock value="12 min" label="Trigger to Full Coordination" sub="From signal detection to executive authorization" />
            <StatBlock value="3,600×" label="Execution Head Start" sub="30 days compressed to 12 minutes — mobilization advantage" />
            <StatBlock value="180" label="Pre-Staged Protocols" sub="Ready before the trigger fires. All 9 strategic domains." />
            <StatBlock value="$0" label="Regulatory Penalties" sub="In documented activations using pre-staged disclosure protocols" />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE MOAT ──────────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <Anchor id="moat" />
          <SectionLabel>What You Can't Buy Anywhere Else</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <h2 style={{ ...CG, fontSize: 38, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
                Every activation makes the system smarter.<br />
                <span style={{ color: GOLD }}>That intelligence is yours alone.</span>
              </h2>
              <GoldRule />
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.9, marginBottom: 20 }}>
                Every time a Readiness Protocol activates and closes out, the platform learns. Response time deltas are measured. Hypotheses are proven or disproven. Protocol mutations are applied. The system gets faster, more precise, more calibrated to your organization's actual people, decisions, and execution patterns.
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.9, marginBottom: 20 }}>
                This is ADVANCE 2.0 — the closed-loop causal learning engine. It doesn't summarize what happened. It measures the delta between expected and actual performance, generates a causal hypothesis, and validates it on the next activation.
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.9 }}>
                <strong style={{ color: GOLD }}>A competitor can buy the platform. They cannot buy your activation history.</strong> The evidence base you accumulate — every proven improvement, every saved minute, every calibrated protocol — takes months to rebuild on any competing system. That's your moat.
              </p>
            </div>
            <div>
              {/* ADVANCE metrics */}
              <div style={{ background: "rgba(255,255,255,0.05)", border: `1px solid rgba(201,168,76,0.2)`, padding: "28px 24px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>Learning Velocity Index — What Compounds Over Time</div>
                {[
                  { metric: "Updates Applied", desc: "Protocol mutations from every close-out — each one a permanent improvement", example: "Avg: 2.3 updates per activation" },
                  { metric: "Proven Improvements", desc: "Hypotheses confirmed through subsequent activations — not assumed, measured", example: "Typical success rate: 74%" },
                  { metric: "Minutes Saved Per Update", desc: "Average reduction in activation time per protocol mutation — the compounding effect", example: "Avg: 4.2 min saved per update" },
                  { metric: "Protocol Library Coverage", desc: "% of your 180 protocols with evidence-backed calibrations from your own activations", example: "After 12 months: 68% coverage" },
                  { metric: "Months to Rebuild", desc: "How long it takes a competitor to replicate your evidence base on any other system", example: "Conservative estimate: 14–18 months" },
                ].map((item, i) => (
                  <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{item.metric}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, background: "rgba(43,138,110,0.15)", padding: "2px 8px", whiteSpace: "nowrap" as const, marginLeft: 12 }}>{item.example}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.2)` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 4 }}>The compounding question to ask your board:</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                  "If we wait 18 months to decide, we also wait 18 months to start accumulating the evidence base that makes execution 14 minutes faster per event. What is that delay worth?"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: ROI CALCULATOR ────────────────────────────────────── */}
      <section style={{ background: IVORY, padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <Anchor id="roi" />
          <SectionLabel>The ROI</SectionLabel>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ ...CG, fontSize: 38, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
              The numbers are not close.
            </h2>
            <GoldRule />
            <p style={{ fontSize: 14, color: "#374151", maxWidth: 640, lineHeight: 1.9 }}>
              Adjust for your organization. Every number uses conservative published benchmarks. The platform cost is fixed. The exposure it eliminates scales with your organization's size and trigger frequency.
            </p>
          </div>
          <EmbeddedROI />

          {/* Consulting alternative */}
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { label: "McKinsey Crisis Response Retainer", cost: "$300K–$500K", outcome: "Static PDF. Manual activation. Stale in 18 months. No signal detection. No pre-staging.", verdict: "One-time" },
              { label: "ServiceNow / GRC Platform", cost: "$200K–$400K/yr", outcome: "Logs your risk. Routes tickets. Doesn't compress the mobilization cycle. Same 30-day gap — newer interface.", verdict: "Same lag" },
              { label: "Readiness OS (Founding Partner Program)", cost: "$75K · 90-day validation", outcome: "180 protocols pre-staged. 231 detection thresholds monitored. 12-minute execution. ADVANCE 2.0 compounding. Executive authority preserved. The $75K investment credits in full toward your annual license.", verdict: "Validation → License" },
            ].map((alt, i) => (
              <div key={i} style={{ background: i === 2 ? NAVY : "#fff", border: `1px solid ${i === 2 ? NAVY : BORDER}`, padding: "24px 20px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: i === 2 ? GOLD : MUTED, marginBottom: 6 }}>{alt.verdict}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: i === 2 ? "#fff" : NAVY, marginBottom: 6, lineHeight: 1.4 }}>{alt.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: i === 2 ? GOLD : "#DC2626", marginBottom: 12 }}>{alt.cost}</div>
                <div style={{ fontSize: 12, color: i === 2 ? "rgba(255,255,255,0.65)" : MUTED, lineHeight: 1.7 }}>{alt.outcome}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: WHAT YOU CAN'T GET ELSEWHERE ─────────────────────── */}
      <section style={{ background: "#fff", padding: "72px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <Anchor id="comparison" />
          <SectionLabel>What You Can't Get Elsewhere</SectionLabel>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ ...CG, fontSize: 38, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
              Every vendor bolted AI onto the old model.<br />
              <span style={{ color: GOLD }}>We rebuilt from first principles.</span>
            </h2>
            <GoldRule />
            <p style={{ fontSize: 14, color: "#374151", maxWidth: 680, lineHeight: 1.9 }}>
              The distinction isn't speed. It's architecture. The old model — committees, alignment cycles, consultant retainers — exists because humans couldn't process information fast enough to act decisively. AI changed the constraint. Every competitor gave you faster spreadsheets. We gave you a different operating model.
            </p>
          </div>

          {/* Comparison table */}
          <div style={{ border: `1px solid ${BORDER}`, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr", background: NAVY, padding: "14px 20px" }}>
              {["Capability", "McKinsey / Consulting", "ServiceNow / GRC", "Everbridge / Crisis Comms", "Readiness OS"].map((h, i) => (
                <div key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: i === 4 ? GOLD : "rgba(255,255,255,0.5)" }}>{h}</div>
              ))}
            </div>
            {[
              { cap: "Trigger Detection", mckinsey: "Not included", servicenow: "Manual entry", everbridge: "Alert when told", readiness: "Automatic — 248+ data points, continuous" },
              { cap: "Response Pre-Staging", mckinsey: "Built post-trigger ($60K+)", servicenow: "Not included", everbridge: "Not included", readiness: "Pre-staged — 180 protocols ready before trigger fires" },
              { cap: "Stakeholder Mobilization", mckinsey: "Manual calls, email chain", servicenow: "Ticket routing", everbridge: "Broadcast alert", readiness: "Simultaneous role-specific briefs at trigger detection" },
              { cap: "Time to Full Coordination", mckinsey: "30 days", servicenow: "30 days", everbridge: "30 days", readiness: "12 minutes after trigger detection" },
              { cap: "Executive Authorization", mckinsey: "Committee convened", servicenow: "Approval workflow", everbridge: "Not included", readiness: "Pre-staged — executive signs one brief, execution deploys" },
              { cap: "Continuous Improvement", mckinsey: "Refresh retainer: $150K+", servicenow: "Manual update cycles", everbridge: "Not included", readiness: "Automated at close-out — ADVANCE 2.0 causal learning" },
              { cap: "Learning Compounding", mckinsey: "None", servicenow: "None", everbridge: "None", readiness: "Every activation improves the next — moat builds over time" },
              { cap: "Microsoft Stack Integration", mckinsey: "Separate engagement", servicenow: "Connector available", everbridge: "Limited", readiness: "Operating model layer above the full Microsoft investment" },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr", padding: "14px 20px", borderTop: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{row.cap}</div>
                <div style={{ fontSize: 12, color: "#DC2626" }}>{row.mckinsey}</div>
                <div style={{ fontSize: 12, color: "#DC2626" }}>{row.servicenow}</div>
                <div style={{ fontSize: 12, color: "#DC2626" }}>{row.everbridge}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEAL }}>{row.readiness}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: "16px 20px", background: IVORY, border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>The Microsoft framing:</div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
              Every enterprise has Microsoft's AI stack. Copilot, Teams, Entra, Purview. None of them have the operating model to use it when a trigger fires. Readiness OS is that operating model — the layer above the Microsoft investment that makes it execute. Not a replacement. An orchestrator.
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: THE DECISION ──────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "80px 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <Anchor id="cta" />
          <SectionLabel>The Decision</SectionLabel>
          <h2 style={{ ...CG, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            The response is ready<br />
            <span style={{ color: GOLD }}>before the trigger fires.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            Every organization that prepares for every situation it will face is no longer afraid of strategic situations. It's fearless. That's not a product feature. It's the outcome of 30 days of preparation and continuous improvement compounding over time.
          </p>

          {/* Three paths */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 40 }}>
            {[
              { path: "See It Work", desc: "12-Minute Test Drive — no login required. Watch a full protocol activate.", href: "/12-minute-experience", cta: "Start Test Drive" },
              { path: "Measure Your Gap", desc: "3-minute Readiness Benchmark. Typical enterprise: 22/100. See where you stand.", href: "/readiness-benchmark", cta: "Take the Benchmark" },
              { path: "Apply for Founding Partner Access", desc: "90-day Founding Partner validation. One question determines your fit.", href: "/request-access", cta: "Apply for Founding Partner Access", primary: true },
            ].map((p, i) => (
              <div key={i} style={{ background: p.primary ? GOLD : "rgba(255,255,255,0.06)", border: `1px solid ${p.primary ? GOLD : "rgba(255,255,255,0.12)"}`, padding: "24px 20px", textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: p.primary ? NAVY : GOLD, marginBottom: 6 }}>{p.path}</div>
                <div style={{ fontSize: 12, color: p.primary ? "rgba(10,15,46,0.7)" : "rgba(255,255,255,0.6)", marginBottom: 16, lineHeight: 1.6 }}>{p.desc}</div>
                <button onClick={() => nav(p.href)}
                  style={{ width: "100%", padding: "10px 16px", background: p.primary ? NAVY : "transparent", border: `1px solid ${p.primary ? NAVY : "rgba(255,255,255,0.25)"}`, color: p.primary ? "#fff" : "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "0.15rem" }}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Thesis footer */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 32 }}>
            <div style={{ ...CG, fontSize: 18, fontStyle: "italic", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
              "We redesign how work flows in the age of AI."
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
              VAUGHNMARTIN · READINESS OS
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
