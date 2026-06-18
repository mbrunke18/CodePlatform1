import { useEffect, useState, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import ProductShowcase from '@/components/marketing/ProductShowcase';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, X, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const TIERS = [
  {
    id: "core",
    tier: "Tier 1",
    name: "Core",
    anchor: "$150,000 / year",
    annual: "$12,500 / month · billed annually",
    escalator: "Year 2: +8%  ·  Year 3: +12%  ·  Pricing scales with institutional value delivered.",
    sub: "Full platform. Full readiness. 180 Protocols ready before the trigger fires.",
    tag: null,
    dark: false,
    features: [
      "Full 180-Protocol Library — every strategic domain",
      "Continuous signal monitoring — 231 trigger patterns",
      "12-minute response orchestration",
      "Standard integrations (Slack, Jira, Teams, Email)",
      "ADVANCE phase — institutional memory built every activation",
      "Dedicated Customer Success Manager",
      "Quarterly strategy sessions",
      "Board-ready activation reports",
      "99.9% uptime SLA",
    ],
    valueCase: {
      headline: "One activation pays for Core. Every one after that is pure upside.",
      lines: [
        { label: "Avg. cost of ONE prevented mobilization delay", value: "$2.1M–$8.4M" },
        { label: "Annual Core subscription", value: "$150K" },
        { label: "Break-even", value: "First activation" },
        { label: "Exec time saved (5 leaders × 8hrs × 6 triggers/yr @ $500/hr)", value: "$120K/yr" },
        { label: "Consulting retainer equivalent (reactive)", value: "$300K–$800K/yr" },
        { label: "Institutional memory built: Year 3 vs. Year 1 response speed", value: "40–60% faster" },
      ],
      punch: "You're not buying software. You're replacing a coordination model that costs millions per trigger — and building organizational intelligence that compounds every year you're on the platform.",
    },
    objections: [
      { q: "That's more than we expected.", a: "The average enterprise loses $2.1M–$8.4M per delayed trigger response. Core at $150K costs less than 10% of the average single incident it prevents. The math runs in your favor on the first activation." },
      { q: "We already have consultants.", a: "Consultants bill $300K–$800K annually and show up after the trigger fires. Core costs $150K and responds in 12 minutes — every trigger, including the ones that happen at 2 AM on a Sunday." },
      { q: "We can coordinate this ourselves.", a: "Your team currently takes 30 days to mobilize. That gap costs $847B annually across enterprises. Core replaces the coordination delay — not the people making the decisions." },
    ],
    cta: "Apply for Founding Partner Access",
  },
  {
    id: "foresight",
    tier: "Tier 2",
    name: "Foresight",
    anchor: "$250,000 / year",
    annual: "$20,800 / month · billed annually",
    escalator: "Year 2: +8%  ·  Year 3: +12%  ·  Pricing scales with institutional value delivered.",
    sub: "Predictive foresight + Digital Twin simulation. See the trigger coming before it fires.",
    tag: "Recommended",
    demoNote: "Demo available by appointment",
    dark: true,
    features: [
      "Everything in Core",
      "Digital Twin activation simulation — rehearse before you respond",
      "Predictive foresight alerts — 48–72hr advance warning before signals peak",
      "3 custom Readiness Protocol builds per year",
      "Monthly strategy sessions",
      "Advanced integrations (Salesforce, ServiceNow, SAP)",
      "Priority support — 2-hour SLA",
      "Sector-level signal benchmarking",
      "ADVANCE phase — causal learning loop with hypothesis validation",
    ],
    valueCase: {
      headline: "Foresight is where the compounding begins.",
      lines: [
        { label: "Avg. cost of one mis-activation (wrong protocol, wrong team)", value: "$50K–$200K" },
        { label: "Digital Twin prevents mis-activations per year (est.)", value: "8–12" },
        { label: "Custom protocol build — consulting equivalent", value: "$25K–$75K each" },
        { label: "3 included builds value vs. consulting", value: "$75K–$225K" },
        { label: "Annual Foresight subscription", value: "$250K" },
        { label: "Institutional memory ROI — Year 3 vs Year 1", value: "3× faster activation" },
      ],
      punch: "Predictive alerts mean you've already started responding 48–72 hours before competitors know the trigger fired. The Digital Twin lets you rehearse before the real thing. And the ADVANCE phase means every activation teaches the platform — so your 10th response is measurably sharper than your first.",
    },
    objections: [
      { q: "Core seems sufficient — why step up?", a: "Core responds in 12 minutes. Foresight means you've already begun responding 48–72 hours earlier via predictive alerts. That early window is where competitive advantages are built and protected." },
      { q: "What's the ROI on the Digital Twin?", a: "In modeled scenarios using simulation rehearsal, protocol execution error rates are projected to decrease by 40–60%. In manufacturing contexts, pre-staged production disruption protocols project $3M+ in preserved output per trigger event. Each prevented mis-activation — estimated at $50K–$200K — covers a significant portion of the annual subscription." },
      { q: "The causal learning — what does that actually mean?", a: "Every activation generates a hypothesis: 'This protocol change should reduce response time by X minutes.' After the next activation, the system measures whether it was right. Over time, your protocols are tuned by evidence — not by opinion. No competitor can replicate that history." },
    ],
    cta: "Apply for Founding Partner Access",
  },
  {
    id: "enterprise",
    tier: "Tier 3",
    name: "Enterprise",
    anchor: "$450,000 / year",
    annual: "$37,500 / month · billed annually · scales with deployment scope",
    escalator: "Structured escalators by agreement  ·  Anchored to your deployment scope and SLA.",
    sub: "The full network. Protocols that evolve across every activation. Built for Fortune 500 scale.",
    tag: "Fortune 500",
    demoNote: "Demo available by appointment",
    dark: false,
    features: [
      "Everything in Foresight",
      "ADVANCE learning network — every activation refines your protocols, automatically",
      "Unlimited custom Readiness Protocol development",
      "Full institutional memory — deep org knowledge encoded in protocols",
      "Dedicated account team (4 specialists)",
      "On-site executive advisory visits",
      "Multi-region / on-premise deployment",
      "Full Microsoft ecosystem depth (Copilot, Teams, Entra, Azure)",
      "Executive Advisory Board access",
      "Custom SLA agreements",
    ],
    valueCase: {
      headline: "At Fortune 500 scale, $450K is the cost of two weeks of uncertainty.",
      lines: [
        { label: "2 FTE strategic coordinators (personnel equivalent)", value: "$300K–$400K/yr" },
        { label: "Unlimited protocol builds vs. consulting equivalent", value: "$1M+ value" },
        { label: "Network learning — every Enterprise activation improves your protocols", value: "Compounding" },
        { label: "Institutional memory moat — months to rebuild on any competitor", value: "12–36 months" },
        { label: "Enterprise ROI (3-year, conservative)", value: "15×–50×" },
      ],
      punch: "Enterprise is where institutional memory becomes a moat. Every activation your organization survives is encoded into your protocols. When a key executive leaves, the knowledge stays. When the same trigger fires 18 months later, your response is already faster. No competitor can buy that history — they have to live it.",
    },
    objections: [
      { q: "How do we justify this to the board?", a: "Frame it as infrastructure, not software. A Fortune 500 that faces one major strategic trigger per quarter — and each delayed response costs $5M–$50M in exposure — is spending $450K to protect $20M–$200M annually. The board-ready activation report documents this in real numbers after every event." },
      { q: "We have an internal team for coordination.", a: "Enterprise supplements your team — it doesn't replace it. Your executives still authorize every response. What changes is that the coordination is pre-staged before they walk into the room. Your people spend their time on decisions, not logistics." },
      { q: "What's the institutional memory value over time?", a: "In Year 1, the platform responds in 12 minutes. By Year 3, the ADVANCE phase has encoded evidence from every activation into your protocols. Your responses are 40–60% faster. Your stakeholder map is current. Your budget allocations are pre-approved. That infrastructure took 3 years to build — and no competitor can buy it tomorrow." },
    ],
    cta: "Apply for Founding Partner Access",
  },
];

const OBJECTIONS_GLOBAL = [
  {
    q: "Isn't this expensive for what it does?",
    a: "The question isn't whether $150K–$450K+ is expensive. The question is whether the mobilization delay it replaces is expensive. McKinsey's published research on enterprise mobilization costs — the source of the $847B annual figure — shows organizations spend 30 days just getting organized when a strategic trigger fires. At a $1B company, that 30-day delay typically costs $2M–$10M in competitive exposure, regulatory risk, and wasted executive time. Readiness OS replaces that cost with a 12-minute response. One trigger. One activation. Subscription paid.",
  },
  {
    q: "We've managed fine without this.",
    a: "Managed doesn't mean optimized. Every enterprise manages — they mobilize slowly, use committees, call meetings, and eventually execute. Readiness OS doesn't replace 'managed.' It replaces the 30-day gap between trigger detection and execution-ready coordination. That gap is where strategic windows close, competitors capitalize, and boards get uncomfortable. You've been absorbing that cost silently. Now you can see it — and eliminate it.",
  },
  {
    q: "Can't we build this internally?",
    a: "You could. The average cost to build and maintain a coordination infrastructure with 180 protocols, 231 trigger patterns, continuous signal monitoring, and an executive authorization layer is $2M–$4M in internal engineering, plus 18–24 months before it's operational. And you'd maintain it forever. Readiness OS is live in 90 days. The build-vs-buy math is not close.",
  },
  {
    q: "We already have Microsoft. Why do we need Readiness OS?",
    a: "Microsoft gives you the AI stack. Readiness OS gives you the operating model to use it. Every enterprise has Copilot, Teams, and Azure. None of them have the coordination layer that tells those tools which Readiness Protocol to activate, which stakeholders to notify, and which budget to unlock — in 12 minutes. Readiness OS is the operating model above the Microsoft investment. It's not a replacement. It's the activation layer.",
  },
  {
    q: "How do we know the ROI numbers are real?",
    a: "Every Readiness OS activation generates a board-ready report documenting: trigger detected, protocol activated, time-to-coordination, stakeholders notified, tasks deployed, budget unlocked, and estimated exposure prevented. We don't estimate ROI retroactively — we measure it in real time, per activation. Your board sees the numbers. Every time.",
  },
  {
    q: "What if we sign up and don't use it much?",
    a: "Two answers. First: continuous signal monitoring runs 24/7 whether you activate a protocol or not — you're protected even when you're not watching. Second: clients who say they 'don't use it much' typically haven't faced a major trigger yet. When the SEC letter arrives at 9 AM or the Tier-1 supplier declares force majeure, the question won't be 'do we use this' — it'll be 'thank god we have this.'",
  },
];

const ALT_COMPARE = [
  { label: "McKinsey crisis retainer", cost: "$300K–$800K/yr", speed: "Days to weeks", available: "On-call (not 24/7)", protocols: "Built per engagement", learns: "No" },
  { label: "Internal coordination team", cost: "$400K–$700K/yr", speed: "Days to weeks", available: "Business hours", protocols: "Ad-hoc", learns: "Slowly" },
  { label: "Readiness OS Core", cost: "$150K/yr", speed: "12 minutes", available: "24/7 continuous", protocols: "180 pre-staged", learns: "Yes — every activation" },
  { label: "Readiness OS Foresight", cost: "$250K/yr", speed: "12 min + 48hr advance", available: "24/7 + predictive", protocols: "180 + Digital Twin", learns: "Yes + causal validation" },
  { label: "Readiness OS Enterprise", cost: "$450K/yr", speed: "12 min + 72hr foresight", available: "24/7 + dedicated team", protocols: "180 + unlimited custom", learns: "Yes + cross-client network" },
];

function TierCard({ tier }: { tier: typeof TIERS[0] }) {
  const [, setLocation] = useLocation();
  const [objOpen, setObjOpen] = useState(false);

  return (
    <div
      data-testid={`card-tier-${tier.id}`}
      style={{
        background: tier.dark ? NAVY : "#fff",
        border: tier.dark ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {tier.tag && (
        <div style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: GOLD, color: NAVY, fontSize: 9, fontWeight: 800,
          letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 16px",
          ...BC,
        }}>{tier.tag}</div>
      )}

      <div style={{ padding: "40px 32px 24px" }}>
        {/* Tier label */}
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: tier.dark ? "rgba(255,255,255,0.45)" : MUTED, marginBottom: 8, ...BC }}>{tier.tier}</div>

        {/* Name */}
        <h3 style={{ ...CG, fontSize: 38, fontWeight: 600, color: tier.dark ? "#fff" : NAVY, marginBottom: 6, lineHeight: 1 }}>{tier.name}</h3>

        {/* Price anchor */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: tier.dark ? GOLD : NAVY, fontFamily: "'Barlow', sans-serif", lineHeight: 1.1 }}>{tier.anchor}</div>
          <div style={{ fontSize: 12, color: tier.dark ? "rgba(255,255,255,0.4)" : MUTED, marginTop: 2 }}>{tier.annual}</div>
        </div>

        {/* Demo availability note */}
        {(tier as any).demoNote && (
          <a href="/tier-comparison" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: tier.dark ? "rgba(201,168,76,0.75)" : TEAL, marginBottom: 10, padding: "3px 8px", border: `1px solid ${tier.dark ? "rgba(201,168,76,0.25)" : "rgba(43,138,110,0.3)"}`, textDecoration: "none", cursor: "pointer", background: tier.dark ? "rgba(201,168,76,0.06)" : "rgba(43,138,110,0.05)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: tier.dark ? "rgba(201,168,76,0.5)" : TEAL, flexShrink: 0 }} />
            See tier demo →
          </a>
        )}

        {/* Williams — 12-minute SLA guarantee */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
          background: tier.dark ? "rgba(43,138,110,0.15)" : "rgba(43,138,110,0.07)",
          border: `1px solid ${tier.dark ? "rgba(43,138,110,0.3)" : "rgba(43,138,110,0.2)"}`,
          marginBottom: 12,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.08em", ...BC }}>
            12-MINUTE RESPONSE TARGET
          </span>
        </div>

        {/* Buffett — contract escalator */}
        <div style={{ fontSize: 10, color: tier.dark ? "rgba(255,255,255,0.3)" : "#9CA3AF", marginBottom: 14, lineHeight: 1.5, letterSpacing: "0.02em" }}>
          {tier.escalator}
        </div>

        {/* Tagline */}
        <p style={{ fontSize: 13, color: tier.dark ? "rgba(255,255,255,0.6)" : MUTED, lineHeight: 1.6, marginBottom: 20, borderTop: `1px solid ${tier.dark ? "rgba(255,255,255,0.1)" : BORDER}`, paddingTop: 16 }}>{tier.sub}</p>

        {/* Features */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          {tier.features.map((f) => (
            <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: tier.dark ? "rgba(255,255,255,0.75)" : "#374151", lineHeight: 1.4 }}>
              <Check style={{ width: 14, height: 14, color: tier.dark ? GOLD : TEAL, flexShrink: 0, marginTop: 1 }} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Value ROI — always visible */}
      <div style={{
        borderTop: `1px solid ${tier.dark ? "rgba(255,255,255,0.1)" : BORDER}`,
        background: tier.dark ? "rgba(201,168,76,0.06)" : OFF,
        padding: "24px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <TrendingUp style={{ width: 13, height: 13, color: tier.dark ? GOLD : TEAL, flexShrink: 0 }} />
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: tier.dark ? GOLD : TEAL, textTransform: "uppercase", ...BC }}>
            The Return on Readiness
          </span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: tier.dark ? "#fff" : NAVY, marginBottom: 14, lineHeight: 1.4 }}>
          {tier.valueCase.headline}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
          {tier.valueCase.lines.map((line) => (
            <div key={line.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, borderBottom: `1px solid ${tier.dark ? "rgba(255,255,255,0.06)" : BORDER}`, paddingBottom: 6 }}>
              <span style={{ fontSize: 11, color: tier.dark ? "rgba(255,255,255,0.55)" : MUTED, lineHeight: 1.4, flex: 1 }}>{line.label}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: tier.dark ? GOLD : NAVY, flexShrink: 0, ...BC }}>{line.value}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: tier.dark ? "rgba(255,255,255,0.55)" : "#374151", lineHeight: 1.65, borderLeft: `3px solid ${tier.dark ? GOLD : TEAL}`, paddingLeft: 12, margin: 0 }}>
          {tier.valueCase.punch}
        </p>
      </div>

      {/* CTA */}
      <div style={{ padding: "24px 32px" }}>
        <Button
          onClick={() => setLocation("/contact")}
          style={{
            width: "100%",
            background: tier.dark ? GOLD : NAVY,
            color: tier.dark ? NAVY : "#fff",
            fontSize: 10, fontWeight: 800, letterSpacing: "0.15em",
            textTransform: "uppercase", padding: "16px", border: "none",
            ...BC,
          }}
        >
          {tier.cta} <ArrowRight style={{ marginLeft: 6, width: 14, height: 14 }} />
        </Button>
      </div>

      {/* Objections — collapsible */}
      <div style={{ borderTop: `1px solid ${tier.dark ? "rgba(255,255,255,0.08)" : BORDER}` }}>
        <button
          onClick={() => setObjOpen(!objOpen)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 32px", background: "transparent", border: "none", cursor: "pointer",
            fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase",
            color: tier.dark ? "rgba(255,255,255,0.35)" : "#9CA3AF", ...BC,
          }}
        >
          Common Questions
          {objOpen ? <ChevronUp style={{ width: 13, height: 13 }} /> : <ChevronDown style={{ width: 13, height: 13 }} />}
        </button>
        {objOpen && (
          <div style={{ padding: "0 32px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {tier.objections.map((obj) => (
              <div key={obj.q} style={{ borderLeft: `2px solid ${tier.dark ? GOLD : TEAL}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: tier.dark ? "rgba(255,255,255,0.8)" : NAVY, marginBottom: 4 }}>"{obj.q}"</div>
                <div style={{ fontSize: 11, color: tier.dark ? "rgba(255,255,255,0.5)" : MUTED, lineHeight: 1.55 }}>{obj.a}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [openObjIdx, setOpenObjIdx] = useState<number | null>(null);

  useEffect(() => {
    updatePageMetadata({
      title: "Platform Tiers & Pricing — Readiness OS | Strategic Readiness Platform",
      description: "Three tiers of enterprise strategic readiness: Core ($150K/yr), Foresight ($250K/yr), and Enterprise ($450K+/yr). 180 Readiness Protocols, continuous signal monitoring, 12-minute response orchestration, and institutional memory that compounds with every activation.",
      ogTitle: "Readiness OS — Core · Foresight · Enterprise Pricing",
      ogDescription: "Built for startup to Fortune 500. Starting at $150,000/year. One activation pays for the annual subscription. Institutional memory compounds with every trigger survived.",
    });
  }, []);


  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: NAVY, padding: "80px 48px 72px", textAlign: "center" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD, ...BC }}>Platform Tiers & Pricing</span>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
          </div>
          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(36px,5vw,58px)", lineHeight: 1.05, color: "#fff", marginBottom: 20 }}>
            The response is ready before the trigger fires.<br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>Here's what that's worth.</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 680, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Enterprise strategic readiness. Three tiers. One operating model. The question isn't whether this is expensive — it's whether your current 30-day mobilization cycle is.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              onClick={() => setLocation("/roi-calculator")}
              style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", ...BC }}
            >
              Calculate Your ROI <ArrowRight style={{ marginLeft: 6, width: 14, height: 14 }} />
            </Button>
            <Button
              onClick={() => setLocation("/12-minute-experience")}
              style={{ background: TEAL, color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", ...BC }}
            >
              See It Execute First <ArrowRight style={{ marginLeft: 6, width: 14, height: 14 }} />
            </Button>
            <Button
              onClick={() => setLocation("/contact")}
              variant="outline"
              style={{ border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", background: "transparent", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px 32px", ...BC }}
            >
              Apply for Founding Partner Access
            </Button>
          </div>
        </div>
      </section>

      {/* ── Platform Showcase ── */}
      <ProductShowcase
        eyebrow="What You're Investing In"
        headline="180 Readiness Protocols. Everything your organization needs. Pre-staged."
        image="/screenshots/new_protocol_library.jpg"
        imageAlt="Readiness OS Protocol Library — 180 Pre-Staged Protocols"
        urlPath="/protocol-library"
        urlTag="180 PROTOCOLS"
        tagColor="#C9A84C"
        features={[
          { color: "#C9A84C", label: "180 Protocols Included", description: "Every protocol covers all 3 strategic domains — Growth & Positioning, Risk & Resilience, and Transformation." },
          { color: "#2B8A6E", label: "231 Triggers Monitored", description: "Continuous signal detection across competitive, regulatory, financial, and operational domains — included in every tier." },
          { color: "#4A90C4", label: "Unlimited Activations", description: "No per-activation fees. No usage caps. Every trigger, every response, every domain — included." },
        ]}
      />

      {/* The math at a glance */}
      <section style={{ background: GOLD, padding: "0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { stat: "35×", label: "Return on first activation", sub: "Average prevented delay cost vs. Core subscription" },
            { stat: "$847B", label: "Annual mobilization tax", sub: "What enterprises lose to coordination delays (McKinsey)" },
            { stat: "12 min", label: "Your response time", sub: "vs. 30 days without Readiness OS" },
            { stat: "3,600×", label: "Execution head start", sub: "30 days compressed to 12 minutes" },
          ].map((s, i) => (
            <div key={s.stat} style={{ padding: "28px 24px", borderRight: i < 3 ? `1px solid rgba(10,15,46,0.15)` : "none", textAlign: "center" }}>
              <div style={{ ...CG, fontSize: 38, fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 4 }}>{s.stat}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, letterSpacing: "0.05em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "rgba(10,15,46,0.6)", lineHeight: 1.4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* "What you're actually buying" framing */}
      <section style={{ background: "#fff", padding: "64px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL, ...BC }}>What You're Actually Buying</span>
          </div>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(26px,3.5vw,40px)", color: NAVY, marginBottom: 20, lineHeight: 1.15 }}>
            You're not buying software. You're replacing a coordination model that costs you millions every time a strategic trigger fires.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                icon: "⏱",
                label: "Before Readiness OS",
                color: "#EF4444",
                points: [
                  "30 days to mobilize on a major trigger",
                  "Committees, alignment meetings, delayed decisions",
                  "Strategic windows close while you organize",
                  "Board learns about crises from the news",
                  "Executives billing $500/hr to coordinate logistics",
                ],
                dark: false,
              },
              {
                icon: "✓",
                label: "With Readiness OS",
                color: TEAL,
                points: [
                  "12-minute full mobilization from trigger to authorization",
                  "Stakeholders notified, tasks staged, budget unlocked",
                  "Executives authorize — system coordinates",
                  "Board briefed before markets open",
                  "Senior leaders back to strategy in minutes",
                ],
                dark: true,
              },
              {
                icon: "$",
                label: "The Value of the Gap",
                color: GOLD,
                points: [
                  "Average prevented delay cost: $2.1M–$8.4M",
                  "Consulting retainer replaced: $300K–$800K/yr",
                  "Exec coordination time recovered: $480K/yr",
                  "Regulatory exposure reduced: $6M–$23M/trigger",
                  "Subscription cost: $150K–$450K/yr",
                ],
                dark: false,
              },
            ].map((col) => (
              <div key={col.label} style={{
                background: col.dark ? NAVY : OFF,
                border: `1px solid ${col.dark ? NAVY : BORDER}`,
                padding: "28px 24px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: col.color, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12, ...BC }}>{col.label}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
                  {col.points.map((p) => (
                    <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: col.dark ? "rgba(255,255,255,0.7)" : "#374151", lineHeight: 1.4 }}>
                      <span style={{ color: col.color, flexShrink: 0, fontSize: 12, fontWeight: 700 }}>{col.dark ? "✓" : col.icon === "$" ? "›" : "✗"}</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier Cards */}
      <section style={{ background: OFF, padding: "80px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, ...BC }}>Annual Subscription</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,44px)", color: NAVY, marginBottom: 12 }}>Three Layers of Readiness.</h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 600, margin: "0 auto" }}>
              Every tier includes the full 180-Protocol Library. Price scales with prediction depth, integration breadth, and how fast the system learns.
            </p>
          </div>

          {/* Founding Partner entry ramp — Blakely: visible entry point before the annual commitment */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24,
              background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `4px solid ${TEAL}`,
              padding: "28px 36px", marginBottom: 36,
            }}
          >
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: TEAL, marginBottom: 8, ...BC }}>
                Founding Partner Program · Limited to 12 Seats
              </div>
              <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY, marginBottom: 6, lineHeight: 1.2 }}>
                Start with a 90-Day Validation Partnership
              </h3>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>
                Not ready for a full annual commitment? The Founding Partner Program is a 90-day live validation — real protocols, real signals, real activations. The full $75,000 fee is credited 100% toward your Year 1 subscription.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: "'Barlow', sans-serif", lineHeight: 1 }}>$75,000</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>90-day · 100% credited to Year 1</div>
              </div>
              <Button
                onClick={() => setLocation("/founding-partner")}
                style={{
                  background: TEAL, color: "#fff", fontSize: 10, fontWeight: 800,
                  letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px 24px",
                  border: "none", ...BC, whiteSpace: "nowrap",
                }}
              >
                Apply for Founding Partner Access <ArrowRight style={{ marginLeft: 6, width: 13, height: 13 }} />
              </Button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start" }}>
            {TIERS.map((tier) => (
              <TierCard key={tier.id} tier={tier} />
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: MUTED, marginTop: 24 }}>
            All tiers billed annually. Multi-year agreements available at preferred pricing. Founding Partner program fee is 100% credited to Year 1 subscription.
          </p>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <button onClick={() => setLocation("/security-compliance")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "0.08em", textDecoration: "underline", ...BC }}>Security & Compliance Documentation →</button>
            <button onClick={() => setLocation("/executive-brief")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "0.08em", textDecoration: "underline", ...BC }}>Download Executive Brief →</button>
            <button onClick={() => setLocation("/proof-story")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "0.08em", textDecoration: "underline", ...BC }}>See Real Activation Outcomes →</button>
          </div>
        </div>
      </section>

      {/* Expansion Journey */}
      <section style={{ background: "#fff", padding: "56px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD, ...BC }}>Your Growth Path</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(22px,3vw,34px)", color: NAVY, marginBottom: 10 }}>Most organizations start at Core. Most expand.</h2>
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 560, margin: "0 auto" }}>
              Expansion is driven by what you encounter — not by sales pressure. Here's what typically triggers each step up.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr 40px 1fr", alignItems: "start", gap: 0 }}>
            {[
              {
                tier: "Core", price: "$150K", color: NAVY,
                starts: "Organizations running 3–6 strategic triggers per year across 1–2 domains.",
                upgrades: [
                  "Trigger frequency exceeds 6/year across multiple domains",
                  "A high-stakes event reveals the value of early warning",
                  "Board requests simulation-based preparedness evidence",
                  "Competitor response gap reveals need for predictive lead time",
                ],
                label: "Typical Year 1 starting point for mid-market and high-growth companies.",
              },
              {
                tier: "Foresight", price: "$250K", color: TEAL,
                starts: "Organizations that survived one major trigger on Core and want to be ahead of the next one.",
                upgrades: [
                  "Scale exceeds 10,000+ employees or multi-geography operations",
                  "Microsoft enterprise deployment requires dedicated integration team",
                  "Executive team requires on-site advisory and custom protocol architecture",
                  "Board mandates zero-latency response capability enterprise-wide",
                ],
                label: "Most common expansion path. Typically triggered after the first major activation.",
              },
              {
                tier: "Enterprise", price: "$450K", color: GOLD,
                starts: "Fortune 500 organizations or PE-backed companies with complex multi-jurisdiction exposure.",
                upgrades: [],
                label: "The full operating model. Unlimited scale, dedicated team, full Microsoft ecosystem depth.",
              },
            ].map((node, i) => (
              i % 2 === 1
                ? <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 48 }}>
                    <div style={{ fontSize: 20, color: GOLD, fontWeight: 700 }}>→</div>
                  </div>
                : <div key={i} style={{ border: `1px solid ${BORDER}`, padding: "24px 20px" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: node.color, marginBottom: 6, ...BC }}>{node.tier} · {node.price}/yr</div>
                    <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.55, marginBottom: 14 }}>{node.starts}</p>
                    {node.upgrades.length > 0 && (
                      <>
                        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 8, ...BC }}>Typically upgrades when:</div>
                        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "flex", flexDirection: "column" as const, gap: 6 }}>
                          {node.upgrades.map((u) => (
                            <li key={u} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
                              <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0 }}>›</span>{u}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    <div style={{ fontSize: 10, color: node.color, fontWeight: 600, fontStyle: "italic", lineHeight: 1.4 }}>{node.label}</div>
                  </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gates — The Strategic Jump: Core → Foresight */}
      <section style={{ background: IVORY, padding: "56px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: TEAL, ...BC }}>The Strategic Jump</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3vw,38px)", color: NAVY, marginBottom: 12 }}>
              Core responds in 12 minutes.<br />
              <span style={{ color: TEAL }}>Foresight starts responding 48–72 hours earlier.</span>
            </h2>
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 600, margin: "0 auto" }}>
              Core and Foresight share the same 180-protocol foundation. The difference is when the response begins — and how much of the strategic window you capture before anyone else knows the trigger fired.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
            {[
              {
                label: "Core", price: "$150K/yr", color: NAVY, bg: "#fff",
                items: [
                  { icon: "✓", text: "180 Protocols pre-staged and ready" },
                  { icon: "✓", text: "12-minute response from trigger detection" },
                  { icon: "✓", text: "231 continuous signal patterns monitored" },
                  { icon: "✓", text: "Standard integrations: Slack, Jira, Teams" },
                  { icon: "✓", text: "Quarterly strategy sessions" },
                  { icon: "✓", text: "24-hour support SLA" },
                  { icon: "—", text: "No predictive advance warning window", dim: true },
                  { icon: "—", text: "No Digital Twin simulation capability", dim: true },
                  { icon: "—", text: "No advanced enterprise integrations", dim: true },
                ],
              },
              {
                label: "Foresight", price: "$250K/yr", color: TEAL, bg: NAVY,
                items: [
                  { icon: "✓", text: "Everything in Core" },
                  { icon: "✓", text: "48–72hr predictive alert window before trigger peaks", bold: true },
                  { icon: "✓", text: "Digital Twin: rehearse before you respond", bold: true },
                  { icon: "✓", text: "Advanced integrations: Salesforce, ServiceNow, SAP", bold: true },
                  { icon: "✓", text: "3 custom Readiness Protocol builds per year", bold: true },
                  { icon: "✓", text: "Monthly strategy sessions (vs. quarterly)" },
                  { icon: "✓", text: "2-hour support SLA (vs. 24-hour)" },
                  { icon: "✓", text: "Sector-level signal benchmarking" },
                  { icon: "✓", text: "ADVANCE causal learning loop + hypothesis validation", bold: true },
                ],
              },
            ].map((col) => (
              <div key={col.label} style={{ background: col.bg, padding: "32px 28px" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: col.color, ...BC, marginBottom: 4 }}>{col.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: col.label === "Foresight" ? GOLD : NAVY, fontFamily: "'Barlow', sans-serif" }}>{col.price}</div>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" as const, gap: 9 }}>
                  {col.items.map((item) => (
                    <li key={item.text} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, lineHeight: 1.45 }}>
                      <span style={{ fontWeight: 700, color: item.icon === "—" ? "#D1D5DB" : col.color, flexShrink: 0, fontSize: 13 }}>{item.icon}</span>
                      <span style={{
                        color: item.icon === "—" ? "#9CA3AF" : col.label === "Foresight" ? (item.bold ? "#fff" : "rgba(255,255,255,0.65)") : (item.bold ? NAVY : "#4B5563"),
                        fontWeight: item.bold ? 700 : 400,
                      }}>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "16px 24px", background: NAVY, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 3, height: 48, background: GOLD, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.65 }}>
              <span style={{ color: GOLD, fontWeight: 700 }}>The $100K gap buys a 48–72 hour head start.</span> In most strategic scenarios — a competitor filing, a regulatory development, a supply chain signal — the organizations that see the trigger coming have already begun responding before it's publicly visible. That lead is worth more than the incremental subscription cost in a single activation.
            </p>
          </div>
        </div>
      </section>

      {/* ADVANCE — Institutional Memory Value */}
      <section style={{ background: NAVY, padding: "72px 48px", borderBottom: `1px solid rgba(201,168,76,0.15)` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: TEAL, ...BC }}>ADVANCE Phase · Included in Every Tier</span>
              <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(26px,3.2vw,42px)", color: "#fff", marginBottom: 16 }}>
              The longer you're on the platform,<br />
              <span style={{ color: GOLD }}>the wider the gap becomes.</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 640, margin: "0 auto", lineHeight: 1.7 }}>
              Every other vendor charges you the same price for the same software forever. Readiness OS compounds. Every activation your organization survives is encoded into your protocols — building institutional memory no competitor can replicate without your history.
            </p>
          </div>

          {/* How ADVANCE works */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 48, background: "rgba(255,255,255,0.06)" }}>
            {[
              { step: "01", label: "Trigger Detected", desc: "Signal monitoring identifies a strategic event. Protocol pre-staged. Executive notified.", icon: "◎" },
              { step: "02", label: "Activation Executed", desc: "12-minute response. Tasks assigned. Stakeholders coordinated. Executive authorizes.", icon: "⚡" },
              { step: "03", label: "Close-Out Learning", desc: "Every activation generates improvement hypotheses — timing, stakeholders, budget pre-approvals.", icon: "⟳" },
              { step: "04", label: "Protocol Evolves", desc: "Proven improvements are encoded. Your next similar trigger is handled faster. Automatically.", icon: "↑" },
            ].map((s, i) => (
              <div key={i} style={{ background: i === 2 ? "rgba(43,138,110,0.12)" : "rgba(10,15,46,0.6)", padding: "28px 24px", borderLeft: i === 2 ? `2px solid ${TEAL}` : "none" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", color: TEAL, ...BC, marginBottom: 8 }}>STEP {s.step}</div>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8, ...BC, letterSpacing: "0.04em" }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Value statements */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 48 }}>
            {[
              {
                headline: "Your 10th activation is faster than your 1st.",
                body: "Causal learning tracks what changed, what it predicted, and whether it delivered. By Year 2, your protocols are tuned by evidence — not by opinion.",
                metric: "40–60% faster", label: "response speed, Year 3 vs. Year 1",
              },
              {
                headline: "Knowledge survives when people don't.",
                body: "When a CISO leaves, the institutional memory stays. Stakeholder maps, escalation chains, budget pre-approvals — encoded in protocols, not in someone's head.",
                metric: "100%", label: "of institutional knowledge retained through personnel changes",
              },
              {
                headline: "No competitor can buy your history.",
                body: "A competitor could license the same platform tomorrow. They cannot buy the 36 months of activation data that made your protocols yours. That gap is the moat.",
                metric: "12–36 mo", label: "estimated rebuild time on any competing platform",
              },
            ].map((v, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "28px 24px" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: GOLD, fontFamily: "monospace", marginBottom: 4 }}>{v.metric}</div>
                <div style={{ fontSize: 10, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const, ...BC, marginBottom: 16 }}>{v.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>{v.headline}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{v.body}</div>
              </div>
            ))}
          </div>

          {/* Pricing implication */}
          <div style={{ background: "rgba(201,168,76,0.07)", border: `1px solid rgba(201,168,76,0.2)`, padding: "28px 32px", display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ flexShrink: 0, width: 4, height: 64, background: GOLD }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase" as const, ...BC, marginBottom: 10 }}>What This Means for Pricing</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
                At $150K/year, you are not paying for access to 180 protocols. You are paying to begin building the institutional memory that makes those protocols <em>yours</em>. By Year 3, the compounded value of your activation history — faster responses, refined stakeholder maps, proven hypotheses — is worth multiples of the annual subscription. The price is fixed. The value compounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative cost comparison */}
      <section style={{ background: "#fff", padding: "64px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, ...BC }}>Vs. The Alternative</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3vw,36px)", color: NAVY, marginBottom: 12 }}>What Does "Not Buying This" Actually Cost?</h2>
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 560, margin: "0 auto" }}>Every enterprise has a coordination approach. Here's how Readiness OS compares to the most common alternatives.</p>
          </div>

          <div style={{ border: `1px solid ${BORDER}`, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 1fr", background: NAVY }}>
              {["Option", "Annual Cost", "Response Speed", "Availability", "Protocol Depth", "Gets Smarter"].map((h, i) => (
                <div key={h} style={{ padding: "12px 16px", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: i === 0 ? GOLD : "rgba(255,255,255,0.55)", borderRight: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none", ...BC }}>{h}</div>
              ))}
            </div>
            {ALT_COMPARE.map((row, i) => {
              const isReadiness = row.label.startsWith("Readiness OS");
              return (
                <div key={row.label} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 1fr", background: isReadiness ? (i === 2 ? `${TEAL}12` : `${TEAL}08`) : (i % 2 === 0 ? "#fff" : OFF), borderTop: `1px solid ${BORDER}` }}>
                  {[row.label, row.cost, row.speed, row.available, row.protocols, row.learns].map((val, j) => (
                    <div key={j} style={{
                      padding: "12px 16px", fontSize: 12,
                      color: j === 0 ? (isReadiness ? TEAL : NAVY) : (isReadiness ? TEAL : MUTED),
                      fontWeight: j === 0 || isReadiness ? 600 : 400,
                      borderRight: j < 5 ? `1px solid ${BORDER}` : "none",
                      lineHeight: 1.4,
                    }}>
                      {val}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, padding: "16px 24px", background: NAVY, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 3, height: 40, background: GOLD, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
              <span style={{ color: GOLD, fontWeight: 700 }}>The consulting retainer covers one crisis.</span> Readiness OS covers 231 trigger patterns, 180 protocols, and every future trigger your organization faces — for the same price or less. And unlike a consulting retainer, it's ready before the crisis starts.
            </p>
          </div>
        </div>
      </section>

      {/* Global objection-crusher */}
      <section style={{ background: OFF, padding: "64px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL, ...BC }}>We Hear This A Lot</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3vw,36px)", color: NAVY, marginBottom: 8 }}>Every Pricing Objection, Answered.</h2>
            <p style={{ fontSize: 14, color: MUTED }}>The math works. Here's the evidence.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {OBJECTIONS_GLOBAL.map((obj, idx) => {
              const isOpen = openObjIdx === idx;
              return (
                <div key={obj.q} style={{ background: "#fff", border: `1px solid ${isOpen ? TEAL : BORDER}` }}>
                  <button
                    onClick={() => setOpenObjIdx(isOpen ? null : idx)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "18px 24px", background: "transparent", border: "none", cursor: "pointer",
                      textAlign: "left", gap: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${isOpen ? TEAL : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isOpen
                          ? <ChevronUp style={{ width: 12, height: 12, color: TEAL }} />
                          : <ChevronDown style={{ width: 12, height: 12, color: MUTED }} />}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>"{obj.q}"</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 24px 20px 60px" }}>
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0, borderLeft: `3px solid ${TEAL}`, paddingLeft: 16 }}>{obj.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ background: "#fff", padding: "64px 48px 0", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, ...BC }}>What Changes Across Tiers</span>
            </div>
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 560, margin: "0 auto" }}>Core delivers the full readiness platform. Foresight adds prediction. Enterprise adds network-wide evolution and unlimited scale.</p>
          </div>

          <div style={{ border: `1px solid ${BORDER}`, background: "#fff", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr" }}>
              <div style={{ padding: "14px 20px", background: NAVY, borderRight: "1px solid rgba(255,255,255,0.08)" }} />
              {[
                { name: "Core", price: "$150K/yr", dark: false },
                { name: "Foresight", price: "$250K/yr", dark: true },
                { name: "Enterprise", price: "$450K/yr", dark: false },
              ].map((t, i) => (
                <div key={t.name} style={{ padding: "16px", background: i === 1 ? NAVY : "#132558", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: i === 1 ? GOLD : "rgba(255,255,255,0.85)", letterSpacing: "0.08em", textTransform: "uppercase", ...BC }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: i === 1 ? "rgba(201,168,76,0.7)" : "rgba(255,255,255,0.4)", marginTop: 3 }}>{t.price}</div>
                </div>
              ))}
              {[
                { feature: "Full 180-Protocol Library", c: "✓", f: "✓", e: "✓" },
                { feature: "231 trigger patterns monitored", c: "✓", f: "✓", e: "✓" },
                { feature: "12-minute response orchestration", c: "✓", f: "✓", e: "✓" },
                { feature: "Standard integrations (Slack, Jira, Email)", c: "✓", f: "✓", e: "✓" },
                { feature: "Advanced integrations (Salesforce, ServiceNow, SAP)", c: "—", f: "✓", e: "✓" },
                { feature: "Digital Twin activation simulation", c: "—", f: "✓", e: "✓" },
                { feature: "Predictive foresight alerts (48–72hr advance warning)", c: "—", f: "✓", e: "✓" },
                { feature: "Custom protocol builds per year", c: "—", f: "3", e: "Unlimited" },
                { feature: "Strategy sessions", c: "Quarterly", f: "Monthly", e: "Dedicated team" },
                { feature: "Support SLA", c: "24-hour", f: "2-hour", e: "Custom" },
                { feature: "Autonomous protocol evolution network", c: "—", f: "—", e: "✓" },
                { feature: "Multi-region / on-premise deployment", c: "—", f: "—", e: "✓" },
                { feature: "Full Microsoft ecosystem depth", c: "—", f: "—", e: "✓" },
                { feature: "Founding Partner credit eligible", c: "✓", f: "✓", e: "✓" },
              ].map((row, i) => (
                <div key={row.feature} style={{ display: "contents" }}>
                  <div style={{ padding: "11px 20px", background: i % 2 === 0 ? "#fff" : OFF, borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, fontSize: 12, color: NAVY, fontWeight: 500 }}>{row.feature}</div>
                  {[row.c, row.f, row.e].map((val, j) => (
                    <div key={j} style={{ padding: "11px 16px", background: i % 2 === 0 ? (j === 1 ? `${NAVY}06` : "#fff") : (j === 1 ? `${NAVY}09` : OFF), borderBottom: `1px solid ${BORDER}`, borderRight: j < 2 ? `1px solid ${BORDER}` : "none", textAlign: "center", fontSize: 12, fontWeight: val === "✓" ? 700 : 500, color: val === "✓" ? TEAL : val === "—" ? "#D1D5DB" : NAVY }}>
                      {val}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Protocol Packs */}
      <section style={{ background: OFF, padding: "64px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL, ...BC }}>Industry Protocol Packs</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(22px,3vw,32px)", color: NAVY, marginBottom: 10 }}>Platform Core + Industry Depth</h2>
            <p style={{ fontSize: 14, color: MUTED, maxWidth: 560, margin: "0 auto" }}>
              The 180-Protocol Core Library covers every strategic domain. Industry Packs add 30 sector-specific protocols tuned to your regulators, triggers, and stakeholders. Add-on to any tier.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { sector: "Financial Services", protocols: "30 protocols", triggers: "SEC enforcement, activist investors, M&A windows, liquidity events, regulatory examinations" },
              { sector: "Healthcare & Life Sciences", protocols: "30 protocols", triggers: "FDA recalls, CMS audits, clinical trial events, formulary changes, patient safety triggers" },
              { sector: "Energy & Utilities", protocols: "30 protocols", triggers: "Grid disruptions, FERC filings, environmental incidents, pipeline events, rate cases" },
              { sector: "Manufacturing & Supply Chain", protocols: "30 protocols", triggers: "Supplier failures, production disruptions, product recalls, tariff shifts, labor actions" },
              { sector: "Consumer & Retail", protocols: "30 protocols", triggers: "Product safety events, social media crises, competitor launches, seasonal demand surges" },
              { sector: "Technology & SaaS", protocols: "30 protocols", triggers: "Data breaches, outages, competitive threats, M&A defense, regulatory inquiry" },
            ].map((pack) => (
              <div key={pack.sector} style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "22px 20px" }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: TEAL, marginBottom: 6, ...BC }}>{pack.protocols}</div>
                <h3 style={{ ...CG, fontSize: 19, fontWeight: 600, color: NAVY, marginBottom: 6 }}>{pack.sector}</h3>
                <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.6, marginBottom: 12 }}>{pack.triggers}</p>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>Add-on to any tier · contact for pricing</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "14px 24px", background: NAVY, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0 }}>
              <span style={{ color: GOLD, fontWeight: 700 }}>Founding Partners receive one Industry Pack included</span> — selected during onboarding based on your primary sector.
            </p>
          </div>
        </div>
      </section>

      {/* Founding Partner Program */}
      <section style={{ background: "#fff", padding: "64px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL, ...BC }}>Founding Partner Program</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3.5vw,38px)", color: NAVY, marginBottom: 12 }}>A 90-Day Structured Validation Partnership.</h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 640, margin: "0 auto" }}>
              We're selectively onboarding organizations whose strategic landscape aligns with our validation objectives. Full platform access, dedicated implementation, defined milestones at Day 30 and Day 60, and 100% of the program fee credited toward Year 1.
            </p>
          </div>

          <div style={{ border: `1px solid ${BORDER}`, background: IVORY, padding: "40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, marginBottom: 14, ...BC }}>What's Included</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    "Full platform access — 180 Readiness Protocols",
                    "Dedicated implementation team",
                    "3 custom Readiness Protocol builds",
                    "Weekly strategy sessions",
                    "ROI measurement & board-ready documentation",
                    "Day 60 go / no-go review — no lock-in",
                    "One Industry Protocol Pack included",
                    "100% fee credited to Year 1 subscription",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151" }}>
                      <Check style={{ width: 14, height: 14, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, marginBottom: 14, ...BC }}>The Math</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Program fee", value: "Scoped per org size" },
                    { label: "Custom protocol builds included", value: "$75K–$225K value" },
                    { label: "Industry Pack included", value: "$15K–$40K value" },
                    { label: "Implementation team", value: "Included" },
                    { label: "Fee credited to Year 1", value: "100%" },
                    { label: "Net new cost", value: "$0 extra" },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, paddingBottom: 8, fontSize: 12 }}>
                      <span style={{ color: MUTED }}>{row.label}</span>
                      <span style={{ fontWeight: 700, color: NAVY }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: "12px 16px", background: NAVY }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>
                    <span style={{ color: GOLD, fontWeight: 700 }}>Selective program.</span> Founding Partners work directly with the founding team, shape the development roadmap, and receive a dedicated reference documentation package regardless of whether they convert to an annual subscription.
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setLocation("/contact")}
              data-testid="button-apply-early-access"
              style={{ background: NAVY, color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", width: "100%", padding: "20px", ...BC }}
            >
              Apply for Founding Partner Access <ArrowRight style={{ marginLeft: 6, width: 14, height: 14 }} />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: NAVY, padding: "72px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(26px,4vw,42px)", color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Fearless organizations don't get surprised by strategic triggers.<br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>They're waiting for them.</em>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 32, lineHeight: 1.7 }}>
            The response is ready before the trigger fires. That's not a tagline — it's the operating model. Every protocol pre-staged. Every stakeholder pre-mapped. Every budget pre-approved. The only thing left when the trigger fires is the decision — which remains yours.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              onClick={() => setLocation("/roi-calculator")}
              style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "18px 36px", ...BC }}
            >
              Calculate Your ROI <ArrowRight style={{ marginLeft: 6, width: 14, height: 14 }} />
            </Button>
            <Button
              onClick={() => setLocation("/12-minute-experience")}
              style={{ background: TEAL, color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "18px 36px", ...BC }}
            >
              Experience 12 Minutes <ArrowRight style={{ marginLeft: 6, width: 14, height: 14 }} />
            </Button>
            <Button
              onClick={() => setLocation("/contact")}
              variant="outline"
              style={{ border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", background: "transparent", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 36px", ...BC }}
            >
              Apply for Founding Partner Access
            </Button>
          </div>
          <div style={{ marginTop: 24 }}>
            <a
              href="/comparison.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)", textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.3)", paddingBottom: 2 }}
            >
              View Full Comparison Table →
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
