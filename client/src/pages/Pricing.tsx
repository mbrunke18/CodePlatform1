import { useEffect, useState, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, X, ChevronDown, ChevronUp } from "lucide-react";

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
    anchor: "Starting at $5,000 / month",
    annual: "$60,000 / year",
    sub: "Full platform. Full readiness. 180 Protocols ready before the trigger fires.",
    tag: null,
    dark: false,
    features: [
      "Full 180-Protocol Library — every strategic domain",
      "Continuous signal monitoring — 221 trigger patterns",
      "12-minute response orchestration",
      "Standard integrations (Slack, Jira, Teams, Email)",
      "Dedicated Customer Success Manager",
      "Quarterly strategy sessions",
      "Board-ready activation reports",
      "99.9% uptime SLA",
    ],
    valueCase: {
      headline: "One activation pays for 35 years of Core.",
      lines: [
        { label: "Avg. cost of ONE prevented mobilization delay", value: "$2.1M–$8.4M" },
        { label: "Annual Core subscription", value: "$60K" },
        { label: "Break-even", value: "First activation" },
        { label: "Exec time saved (5 senior leaders × 8hrs/trigger × 6 triggers/yr)", value: "$480K/yr" },
        { label: "Consulting retainer equivalent", value: "$300K–$800K/yr" },
      ],
      punch: "You're not buying software. You're replacing a coordination model that costs you millions every time a trigger fires.",
    },
    objections: [
      { q: "We already have consultants.", a: "Consultants bill $300K–$800K annually and show up after the trigger fires. Core costs $60K and responds in 12 minutes. Every trigger." },
      { q: "We can coordinate this ourselves.", a: "Your team currently takes 30 days to mobilize. That coordination gap costs $847B annually across enterprises. Core replaces the gap — not the people." },
      { q: "It's not in this year's budget.", a: "The average enterprise loses $2.1M per delayed trigger response. One prevented incident funds Core for 35 years." },
    ],
    cta: "Contact Sales",
  },
  {
    id: "foresight",
    tier: "Tier 2",
    name: "Foresight",
    anchor: "Starting at $10,000 / month",
    annual: "$120,000 / year",
    sub: "Predictive foresight + Digital Twin simulation. See the trigger coming before it fires.",
    tag: "Most Selected",
    dark: true,
    features: [
      "Everything in Core",
      "Digital Twin activation simulation — rehearse before you respond",
      "Predictive foresight alerts — advance warning before signals peak",
      "3 custom Readiness Protocol builds per year",
      "Monthly strategy sessions",
      "Advanced integrations (Salesforce, ServiceNow, SAP)",
      "Priority support — 2-hour SLA",
      "Sector-level signal benchmarking",
    ],
    valueCase: {
      headline: "Foresight pays for itself before the first alert.",
      lines: [
        { label: "Avg. cost of one mis-activation (wrong protocol, wrong team)", value: "$50K–$200K" },
        { label: "Digital Twin prevents mis-activations (estimated)", value: "8–12 per year" },
        { label: "Custom protocol build (consulting equivalent)", value: "$25K–$75K each" },
        { label: "3 included builds vs. consultant cost", value: "$75K–$225K value" },
        { label: "Annual Foresight subscription", value: "$120K" },
      ],
      punch: "Predictive alerts mean you're acting 48–72 hours before competitors even know the trigger fired. That window is where markets are won.",
    },
    objections: [
      { q: "The base tier seems enough.", a: "Core responds in 12 minutes. Foresight means you've already started responding 48 hours earlier. The Digital Twin alone prevents costly mis-activations worth $50K–$200K each." },
      { q: "What's the ROI on simulation?", a: "Healthcare clients using Digital Twin rehearsal reduce their protocol execution errors by 60%. Manufacturing clients prevent an average of $3.4M in production losses per trigger." },
      { q: "The custom protocol builds — do we really need them?", a: "A single bespoke Readiness Protocol from a consulting firm costs $25K–$75K. You get 3 per year included. That's $75K–$225K in value before you count anything else." },
    ],
    cta: "Contact Sales",
  },
  {
    id: "enterprise",
    tier: "Tier 3",
    name: "Enterprise",
    anchor: "Custom — scoped to your org",
    annual: "Typically $200,000–$400,000 / year",
    sub: "The full network. Protocols that evolve. A dedicated team. Built for Fortune 500 scale.",
    tag: "Fortune 500",
    dark: false,
    features: [
      "Everything in Foresight",
      "Autonomous protocol evolution network — every activation improves every protocol",
      "Unlimited custom Readiness Protocol development",
      "Dedicated account team (4 specialists)",
      "On-site executive advisory visits",
      "Multi-region / on-premise deployment",
      "Full Microsoft ecosystem depth (Copilot, Teams, Entra, Azure)",
      "Executive Advisory Board access",
      "Custom SLA agreements",
    ],
    valueCase: {
      headline: "For a Fortune 500, Enterprise costs less than one bad quarter of inaction.",
      lines: [
        { label: "2 FTE strategic coordinators (equivalent personnel replaced)", value: "$300K/yr" },
        { label: "Unlimited protocol builds vs. consulting cost", value: "$1M+ value" },
        { label: "Network learning — protocols improve across all Enterprise clients", value: "Compounding" },
        { label: "Typical Enterprise subscription", value: "$200K–$400K" },
        { label: "Enterprise ROI (3-year, conservative)", value: "12×–40×" },
      ],
      punch: "Enterprise is the only tier where your protocols improve every time any client activates them. The network learns for you. Every activation across the entire Enterprise client base makes your readiness sharper.",
    },
    objections: [
      { q: "The custom price makes it hard to budget.", a: "We scope Enterprise to your org size and strategic exposure. Most Fortune 500 clients find the total cost of NOT being ready — $50M–$200M in reactive losses per major trigger — makes Enterprise pricing look like infrastructure, not software." },
      { q: "We have an internal team for this.", a: "Enterprise includes a dedicated VaughnMartin account team alongside your internal team. We're the infrastructure layer. Your people make the decisions — we make sure the coordination is already done." },
      { q: "How do we justify this to the board?", a: "We provide a board-ready activation report with every engagement showing exactly which triggers were detected, how fast coordination happened, and what the estimated exposure would have been without Readiness OS. The ROI is documented, not estimated." },
    ],
    cta: "Contact Sales",
  },
];

const OBJECTIONS_GLOBAL = [
  {
    q: "Isn't this expensive for what it does?",
    a: "The question isn't whether $60K–$400K is expensive. The question is whether the mobilization delay it replaces is expensive. Research from McKinsey, Gartner, and PwC shows enterprises spend 30 days just getting organized when a strategic trigger fires. At a $1B company, that 30-day delay typically costs $2M–$10M in competitive exposure, regulatory risk, and wasted executive time. Readiness OS replaces that cost with a 12-minute response. One trigger. One activation. Subscription paid.",
  },
  {
    q: "We've managed fine without this.",
    a: "Managed doesn't mean optimized. Every enterprise manages — they mobilize slowly, use committees, call meetings, and eventually execute. Readiness OS doesn't replace 'managed.' It replaces the 30-day gap between trigger detection and execution-ready coordination. That gap is where strategic windows close, competitors capitalize, and boards get uncomfortable. You've been absorbing that cost silently. Now you can see it — and eliminate it.",
  },
  {
    q: "Can't we build this internally?",
    a: "You could. The average cost to build and maintain a coordination infrastructure with 180 protocols, 221 trigger patterns, continuous signal monitoring, and an executive authorization layer is $2M–$4M in internal engineering, plus 18–24 months before it's operational. And you'd maintain it forever. Readiness OS is live in 90 days. The build-vs-buy math is not close.",
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
  { label: "Readiness OS Core", cost: "$60K/yr", speed: "12 minutes", available: "24/7 continuous", protocols: "180 pre-staged", learns: "Yes (ADVANCE)" },
  { label: "Readiness OS Foresight", cost: "$120K/yr", speed: "12 min + 48hr advance", available: "24/7 + predictive", protocols: "180 + Digital Twin", learns: "Yes + compounding" },
];

function TierCard({ tier, open, onToggle }: { tier: typeof TIERS[0]; open: string | null; onToggle: (id: string) => void }) {
  const [, setLocation] = useLocation();
  const isOpen = open === tier.id;

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
          <div style={{ fontSize: 12, color: tier.dark ? "rgba(255,255,255,0.4)" : MUTED, marginTop: 2 }}>{tier.annual} · billed annually</div>
        </div>

        {/* Tagline */}
        <p style={{ fontSize: 13, color: tier.dark ? "rgba(255,255,255,0.6)" : MUTED, lineHeight: 1.6, marginBottom: 24, borderTop: `1px solid ${tier.dark ? "rgba(255,255,255,0.1)" : BORDER}`, paddingTop: 16 }}>{tier.sub}</p>

        {/* Features */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          {tier.features.map((f) => (
            <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: tier.dark ? "rgba(255,255,255,0.75)" : "#374151", lineHeight: 1.4 }}>
              <Check style={{ width: 14, height: 14, color: tier.dark ? GOLD : TEAL, flexShrink: 0, marginTop: 1 }} />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
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

      {/* Value case toggle */}
      <div style={{ borderTop: `1px solid ${tier.dark ? "rgba(255,255,255,0.1)" : BORDER}` }}>
        <button
          onClick={() => onToggle(tier.id)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 32px", background: "transparent", border: "none", cursor: "pointer",
            fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase",
            color: tier.dark ? GOLD : TEAL, ...BC,
          }}
        >
          Why This Price Is Actually Cheap
          {isOpen ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
        </button>

        {isOpen && (
          <div style={{ padding: "0 32px 28px", background: tier.dark ? "rgba(255,255,255,0.04)" : OFF }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: tier.dark ? "#fff" : NAVY, marginBottom: 16, lineHeight: 1.4 }}>
              {tier.valueCase.headline}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {tier.valueCase.lines.map((line) => (
                <div key={line.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, borderBottom: `1px solid ${tier.dark ? "rgba(255,255,255,0.06)" : BORDER}`, paddingBottom: 6 }}>
                  <span style={{ fontSize: 11, color: tier.dark ? "rgba(255,255,255,0.55)" : MUTED, lineHeight: 1.4, flex: 1 }}>{line.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: tier.dark ? GOLD : NAVY, flexShrink: 0, ...BC }}>{line.value}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: tier.dark ? "rgba(255,255,255,0.5)" : MUTED, lineHeight: 1.6, fontStyle: "italic" }}>
              {tier.valueCase.punch}
            </p>

            {/* Per-tier objections */}
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: tier.dark ? "rgba(255,255,255,0.35)" : "#9CA3AF", textTransform: "uppercase", ...BC }}>Common Questions</div>
              {tier.objections.map((obj) => (
                <div key={obj.q} style={{ borderLeft: `2px solid ${tier.dark ? GOLD : TEAL}`, paddingLeft: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: tier.dark ? "rgba(255,255,255,0.8)" : NAVY, marginBottom: 4 }}>"{obj.q}"</div>
                  <div style={{ fontSize: 11, color: tier.dark ? "rgba(255,255,255,0.5)" : MUTED, lineHeight: 1.5 }}>{obj.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [openTier, setOpenTier] = useState<string | null>(null);
  const [openObjIdx, setOpenObjIdx] = useState<number | null>(null);

  useEffect(() => {
    updatePageMetadata({
      title: "Platform Tiers & Pricing — Readiness OS | Strategic Readiness Platform",
      description: "Three tiers of enterprise strategic readiness: Core ($60K/yr), Foresight ($120K/yr), and Enterprise (custom). Full platform access — 180 Readiness Protocols, continuous signal monitoring, 12-minute response orchestration.",
      ogTitle: "Readiness OS — Core · Foresight · Enterprise Pricing",
      ogDescription: "Built for startup to Fortune 500. Starting at $5,000/month. One activation pays for the annual subscription. See the value case for each tier.",
    });
  }, []);

  const toggleTier = (id: string) => setOpenTier(openTier === id ? null : id);

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
              onClick={() => setLocation("/contact")}
              variant="outline"
              style={{ border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", background: "transparent", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px 32px", ...BC }}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

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
                  "Subscription cost: $60K–$400K/yr",
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
              Every tier includes the full 180-Protocol Library. Price scales with prediction depth, integration breadth, and how fast the system learns. Click "Why This Price Is Actually Cheap" under any tier to see the value case.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start" }}>
            {TIERS.map((tier) => (
              <TierCard key={tier.id} tier={tier} open={openTier} onToggle={toggleTier} />
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: MUTED, marginTop: 24 }}>
            All tiers billed annually. Multi-year agreements available at preferred pricing. Founding Partner program fee is 100% credited to Year 1 subscription.
          </p>
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
              <span style={{ color: GOLD, fontWeight: 700 }}>The consulting retainer covers one crisis.</span> Readiness OS covers 221 trigger patterns, 180 protocols, and every future trigger your organization faces — for the same price or less. And unlike a consulting retainer, it's ready before the crisis starts.
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
                { name: "Core", price: "$60K/yr", dark: false },
                { name: "Foresight", price: "$120K/yr", dark: true },
                { name: "Enterprise", price: "Custom", dark: false },
              ].map((t, i) => (
                <div key={t.name} style={{ padding: "16px", background: i === 1 ? NAVY : "#132558", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: i === 1 ? GOLD : "rgba(255,255,255,0.85)", letterSpacing: "0.08em", textTransform: "uppercase", ...BC }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: i === 1 ? "rgba(201,168,76,0.7)" : "rgba(255,255,255,0.4)", marginTop: 3 }}>{t.price}</div>
                </div>
              ))}
              {[
                { feature: "Full 180-Protocol Library", c: "✓", f: "✓", e: "✓" },
                { feature: "221 trigger patterns monitored", c: "✓", f: "✓", e: "✓" },
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
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3.5vw,38px)", color: NAVY, marginBottom: 12 }}>Join Before the Price Increases.</h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 640, margin: "0 auto" }}>
              We're selecting 10 organizations for a 90-day validation partnership. Full platform access. Dedicated implementation. And 100% of the program fee credited toward your Year 1 annual subscription.
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
                    <span style={{ color: GOLD, fontWeight: 700 }}>Spots remaining: limited to 10 organizations.</span> Founding Partners lock in pre-commercial pricing before the platform's full launch pricing takes effect.
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
            The response is ready before the trigger fires.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 32, lineHeight: 1.7 }}>
            Every enterprise faces strategic triggers. The only question is whether your response is already staged when the trigger fires — or whether you're still in the first committee meeting three weeks later.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              onClick={() => setLocation("/roi-calculator")}
              style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "18px 36px", ...BC }}
            >
              Calculate Your ROI <ArrowRight style={{ marginLeft: 6, width: 14, height: 14 }} />
            </Button>
            <Button
              onClick={() => setLocation("/contact")}
              variant="outline"
              style={{ border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", background: "transparent", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 36px", ...BC }}
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
