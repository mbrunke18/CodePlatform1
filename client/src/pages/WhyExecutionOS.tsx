import { useEffect, useState } from "react";
import { Link } from "wouter";
import ProductShowcase from "@/components/marketing/ProductShowcase";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updatePageMetadata } from "@/lib/seo";
import {
  ArrowRight, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp,
  Zap, Clock, Users, Shield, BookOpen, Globe, TrendingUp, DollarSign, Brain, Target
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

interface Competitor {
  name: string;
  category: string;
  claim: string;
  whatTheyDo: string;
  whereTheyStop: string;
  theGap: string;
  oneLiner: string;
  isComplementary?: boolean;
}

const competitors: Competitor[] = [
  {
    name: "Microsoft Copilot & Azure OpenAI",
    category: "AI Intelligence Layer",
    claim: "AI that works alongside your people — drafting, summarizing, and analyzing across your Microsoft stack.",
    whatTheyDo: "Microsoft bolted AI onto the existing operating model. Copilot makes meetings faster to document. It generates better analysis, better summaries, smarter search. It is genuinely excellent at what it does — and 75%+ of large enterprises have already deployed it.",
    whereTheyStop: "When a strategic trigger fires — a ransomware attack, a supply disruption, a regulatory deadline — Copilot has no answer to: Who needs to be in the room? Who owns which task? Which lawyer do we call first? It summarizes the chaos faster. It does not replace the chaos. The 30-day mobilization cycle is completely intact.",
    theGap: "Every startup to Fortune 500 already has Microsoft's AI stack. Their response times haven't reflected a 3,600× improvement because the operating model underneath Copilot hasn't changed. Intelligence without coordination is expensive analysis sitting in a meeting room.",
    oneLiner: "You've already bought the engine. Readiness OS is the transmission.",
    isComplementary: true,
  },
  {
    name: "ServiceNow",
    category: "Enterprise Workflow Automation",
    claim: "The platform for digital transformation — enterprise workflow automation across IT, HR, security, and operations.",
    whatTheyDo: "ServiceNow is extraordinary at digitizing known, repeatable, internally-documented processes. IT service management, employee workflows, change management — if the process is defined and stable, ServiceNow executes it efficiently and at scale.",
    whereTheyStop: "ServiceNow requires 6–18 months of custom implementation for every new use case. When a supply chain collapses, a competitor acquires a key customer, or an activist investor takes a position — there is no pre-staged ServiceNow response. The workflow must be built manually, under pressure, which takes the same 30 days the old model took — just with better ticketing.",
    theGap: "ServiceNow automates execution of known processes. Readiness OS orchestrates mobilization for unexpected strategic events. These are genuinely different problems. ServiceNow manages your work after someone decides what work to do. Readiness OS decides what work starts and who starts it the moment a trigger fires.",
    oneLiner: "ServiceNow manages your work. Readiness OS deploys your people.",
    isComplementary: true,
  },
  {
    name: "Palantir AIP",
    category: "Enterprise-Grade Data Intelligence",
    claim: "Decision intelligence for enterprise and government — ontology-based data integration with AI agents on top.",
    whatTheyDo: "Palantir is architecturally sophisticated and genuinely impressive, particularly in defense, intelligence, and manufacturing. AIP allows enterprises to build AI agents on top of their data with ontology-based reasoning. For organizations with significant data science teams, it provides deep intelligence capability.",
    whereTheyStop: "Palantir tells you what is happening with extraordinary sophistication. It does not then automatically assign tasks, notify your General Counsel, route your CISO to the right response protocol, or activate a pre-staged Readiness Protocol. The gap from intelligence to coordinated human execution remains entirely manual. Deployment typically takes 6–24 months and requires dedicated data engineers.",
    theGap: "Palantir can feed signals into Readiness OS. They are complementary, not competing. Palantir is data infrastructure; Readiness OS is execution infrastructure. The honest message: Palantir will tell you what's happening with unmatched depth. Readiness OS ensures what's happening gets acted on in 12 minutes.",
    oneLiner: "Palantir tells you. Readiness OS deploys you.",
    isComplementary: true,
  },
  {
    name: "Everbridge",
    category: "Critical Event Management & Mass Notification",
    claim: "Reach the right people with the right message at the right time during a critical event.",
    whatTheyDo: "Everbridge is the market leader in mass notification ($400M+ revenue, publicly traded). When something happens, Everbridge sends alerts — to employees, customers, and executives — through SMS, email, voice, and app. It is a mature, well-executed communication routing engine.",
    whereTheyStop: "Notification is not coordination. Everbridge tells people something happened. It does not assign them tasks. It does not activate a pre-staged Readiness Protocol. It does not connect the alert to a timeline, a decision gate, a war room, or an accountability system. After the alert goes out, you're back to the same phone tree, the same emergency meeting, and the same 30-day mobilization cycle — just with better message delivery.",
    theGap: "Every Everbridge customer has already accepted that crisis coordination is a problem worth paying for. They bought half the solution. The market leader in alerting has $400M in revenue and the response time problem is completely unsolved. That is the market signal that Readiness OS addresses.",
    oneLiner: "Everbridge tells your people. Readiness OS deploys them.",
  },
  {
    name: "Archer / GRC Platforms",
    category: "Governance, Risk & Compliance",
    claim: "Know your risks, document your controls, and demonstrate compliance to regulators and boards.",
    whatTheyDo: "GRC platforms — Archer, OneTrust, LogicGate, and others — are documentation and audit trail systems. They record what risks exist, what controls are in place, and generate reports for regulators. For audit, compliance, and governance functions, they are genuinely valuable.",
    whereTheyStop: "GRC platforms are retrospective by design. They document what happened and whether controls existed. When a trigger fires — a ransomware attack, a product recall, a regulatory inquiry — your GRC platform generates a record of your controls. It does not mobilize your response. The CISO, GC, and CFO still need to be called. The Readiness Protocol still needs to be found. Coordination still takes 30 days.",
    theGap: "enterprise organizations spend hundreds of thousands annually on GRC platforms to prove they have a plan. Readiness OS is what actually executes the plan when it matters. GRC satisfies auditors. Readiness OS protects the business.",
    oneLiner: "Your GRC platform proves you had a plan. Readiness OS proves the plan worked — in 12 minutes.",
  },
  {
    name: "Noggin / Veoci / Resolver",
    category: "Incident & Crisis Management Software",
    claim: "Coordinate responses, track actions, and document outcomes during incidents and crises.",
    whatTheyDo: "These platforms provide a structured digital workspace for crisis management — incident logging, task assignment, communication tracking, and post-incident reporting. They represent a meaningful improvement over spreadsheets and email chains as a coordination workspace.",
    whereTheyStop: "These platforms are reactive. A crisis must be manually declared. Tasks must be manually assigned. Stakeholders must be manually identified. There are no pre-staged Readiness Protocols tied to specific trigger signatures. No signal monitoring for trigger conditions. No automated cascade. The response is as slow as the humans running it — the platform is a tracking tool, not an execution engine.",
    theGap: "These platforms primarily serve public sector, hospitals, and mid-market. They are not designed for startup to Fortune 500 strategic triggers across 9 domains. The distinction: a crisis management binder, digitized — vs. strategic execution infrastructure.",
    oneLiner: "That is a digital emergency binder. This is strategic execution infrastructure.",
  },
  {
    name: "Monday.com / Asana / Jira",
    category: "Work Management & Project Tracking",
    claim: "Plan, track, and deliver work across your organization. Manage projects, tasks, and team collaboration at scale.",
    whatTheyDo: "These are where work gets recorded after someone has decided what work to do. They are task and project tracking systems — genuinely excellent at their core function, and used by 94% of Fortune 500 companies in some capacity.",
    whereTheyStop: "These tools do not detect triggers. They do not activate Readiness Protocols. They do not coordinate stakeholders. They are execution recording systems, not execution coordination systems. When a supply chain collapses, your Jira board has no response — because no one has created the tickets yet.",
    theGap: "Readiness OS integrates with all of them. When Readiness OS activates a Readiness Protocol, it pushes tasks directly into your existing Jira or Asana. These tools are the destination for the work Readiness OS initiates — not a competitor.",
    oneLiner: "Jira tracks tasks after someone creates them. Readiness OS creates the right tasks and fires them in 12 minutes — before anyone has had a meeting.",
    isComplementary: true,
  },
  {
    name: "McKinsey / BCG / Bain Digital",
    category: "Consulting-Led Digital Platforms",
    claim: "Strategy and transformation platforms — proprietary models, deep data science, and transformation programs backed by top-tier consulting expertise.",
    whatTheyDo: "These consulting firms have built digital products — McKinsey Quantum Black, BCG X, Bain's digital ventures — that combine proprietary AI with multi-year transformation engagements. For organizations with the budget and patience, they deliver sophisticated strategic analysis.",
    whereTheyStop: "These are consulting-led digital products. The product is often inseparable from the consulting relationship. Implementation is measured in years. Cost is measured in millions. And when a supply chain collapses at 2 AM on a Sunday, McKinsey Quantum Black does not automatically notify your CPO and alternative suppliers. It has a partner who will analyze the situation next week.",
    theGap: "McKinsey will analyze your execution gap after the situation resolves. Readiness OS closes it before the situation arrives — continuously, automatically, at a fraction of the cost. A $75K Founding Partner engagement vs. a $3M+ consulting retainer is not the same conversation. Readiness OS runs 24/7, not episodically.",
    oneLiner: "McKinsey analyzes your execution gap after the situation resolves. Readiness OS closes it before.",
  },
];

const fiveReasons = [
  {
    icon: BookOpen,
    title: "Pre-staged beats reactive — every time",
    body: "Every competitor reacts to triggers. Readiness OS is already staged before the trigger fires. 180 Readiness Protocols across 9 domains. 231 configured trigger signatures. When the trigger fires, your organization is not starting from zero — it is executing from a pre-positioned stance. No competitor offers this.",
    metric: "180 Readiness Protocols pre-staged",
  },
  {
    icon: Clock,
    title: "12 minutes is a different category, not a speed improvement",
    body: "The 3,600× Execution Head Start is not about being faster at the old process. It is about replacing the old process entirely. Coordination that took 30 days of emergency meetings now takes 12 minutes — because the operating model itself is different. This is architectural, not incremental.",
    metric: "3,600× execution head start",
  },
  {
    icon: Zap,
    title: "The operating model layer no one else provides",
    body: "Microsoft sells intelligence. ServiceNow sells process automation. Palantir sells data integration. Everbridge sells notification. None of them sell the operating model that sits above all of these and coordinates humans at AI speed. Readiness OS is that layer — and it works with every tool your organization already has.",
    metric: "Works with your existing stack",
  },
  {
    icon: Shield,
    title: "Human authority is preserved — AI handles orchestration",
    body: "Every board's fear about AI is loss of control. Readiness OS is explicitly built on the principle that humans decide and AI deploys. Your executives retain all decision authority. The AI monitors, recommends, and coordinates — but no activation happens without executive approval. This is not a limitation; it is the design.",
    metric: "Executive authority preserved",
  },
  {
    icon: Target,
    title: "The Founding Partner program eliminates risk",
    body: "$75K flat. 90 days. 100% credited to the enterprise contract. At least one live activation with a measured 12-minute response, or the data shows why not. No competitor offers this because no competitor is confident enough in their outcome to structure an engagement this way. Readiness OS does.",
    metric: "$75K Founding Partner · 100% credited",
  },
];

export default function WhyExecutionOS() {
  const [openCard, setOpenCard] = useState<string | null>(null);

  useEffect(() => {
    updatePageMetadata({
      title: "Why Readiness OS — The Competitive Landscape | VaughnMartin",
      description: "Why Readiness OS wins against Microsoft Copilot, ServiceNow, Palantir, Everbridge, and every other enterprise platform. The operating model layer no one else provides.",
      ogTitle: "Why Readiness OS? Honest Competitive Analysis",
      ogDescription: "Every competitor solves an adjacent problem. None solve the 30-day mobilization gap. Here's why — category by category.",
    });
  }, []);

  return (
    <PageLayout>
      <div style={{ background: "#F8F7F4" }}>

        {/* ── HERO ──────────────────────────────────────── */}
        <section style={{ background: NAVY, padding: "80px 48px 64px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "20%", right: "10%", width: 600, height: 600, borderRadius: 0, background: "radial-gradient(circle, rgba(43,138,110,0.12), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-[#C9A84C]/40 text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD, background: "rgba(201,168,76,0.08)" }}>
              Honest Competitive Analysis · Enterprise Positioning
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
              "Why not just use<br />
              <em style={{ color: GOLD }}>what we already have?"</em>
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 680, margin: "0 auto 32px", lineHeight: 1.75 }}>
              It's the first question every startup to Fortune 500 executive asks. Here is the honest answer — competitor by competitor, category by category.
            </p>

            {/* The category problem — 2 columns */}
            <div className="grid md:grid-cols-2 gap-0 max-w-3xl mx-auto mt-10 text-left border border-white/10">
              <div style={{ background: "rgba(255,255,255,0.04)", padding: "28px 28px", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: 14 }}>What the market has built</div>
                {["AI tools that detect and analyze", "Workflow tools that track tasks", "Notification tools that alert people", "GRC tools that document risk", "Consulting tools that analyze gaps"].map(item => (
                  <div key={item} className="flex items-center gap-3 mb-3">
                    <XCircle style={{ width: 14, height: 14, color: "#EF4444", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(201,168,76,0.06)", padding: "28px 28px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 14 }}>What no one built — until now</div>
                {["The operating model that coordinates humans at AI speed", "Pre-staged Readiness Protocols that fire before the trigger", "12-minute stakeholder cascade — fully automated", "Trigger-to-execution without a single meeting", "Infrastructure that runs 24/7, not episodically"].map(item => (
                  <div key={item} className="flex items-center gap-3 mb-3">
                    <CheckCircle2 style={{ width: 14, height: 14, color: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Platform Showcase ── */}
        <ProductShowcase
          eyebrow="The Operating Model Layer"
          headline="Every enterprise has the AI. None have the operating model to use it."
          image="/screenshots/deck_signals.jpg"
          imageAlt="Readiness OS Signal Intelligence — 231 Live Triggers"
          urlPath="/signal-detection"
          urlTag="MONITORING"
          tagColor="#2B8A6E"
          features={[
            { color: "#2B8A6E", label: "Continuous Signal Detection", description: "231 triggers monitored across competitive, regulatory, financial, and operational domains — before any human could act." },
            { color: "#C9A84C", label: "Pre-Staged Protocols", description: "180 Readiness Protocols fully built, approved, and staged before any trigger fires. No assembly required." },
            { color: "#4A90C4", label: "Executive Authority Preserved", description: "No Readiness Protocol activates without executive sign-off. Preparation compresses mobilization; the decision remains human." },
          ]}
        />

        {/* ── DECISION RIGHTS FRAMING ───────────────────── */}
        <section style={{ background: "#F8F7F4", padding: "64px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 700, color: NAVY, lineHeight: 1.3, marginBottom: 28 }}>
              Decision rights migrate quietly.
            </p>
            <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.8, marginBottom: 20 }}>
              The executive layer still owned authority by org chart. The systems owned authority by workflow. Nobody said that out loud because nobody was tracking the migration as a single phenomenon.
            </p>
            <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.8, marginBottom: 20 }}>
              AI is now accelerating this pattern. Outputs become defaults. Defaults become actions. By the time someone asks who approved this, it is already done.
            </p>
            <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.8, marginBottom: 20 }}>
              AI does not create the gap. It removes the time buffer that used to hide it. Organizations were always unready. AI just accelerated the moment of exposure. The coordination architecture had to be built before the signal appeared. Most organizations discover it was never built at the worst possible moment.
            </p>
            <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 24, marginBottom: 28 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: NAVY, lineHeight: 1.7, margin: 0 }}>
                This is not an AI problem. It is an operating model problem that AI is making faster and more visible. The fix is putting executive authorization back into the architecture as a required threshold the system cannot cross without it.
              </p>
            </div>
            <div style={{ background: "#0A0F2E", padding: "20px 24px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>BCG · AI-First Org & Operating Model Study · 2026</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 10 }}>
                "Most companies are layering AI onto operating models built for a purely human workforce — predefined processes, fixed handoffs, and decision bottlenecks. 95% are piloting. 5% are capturing real value at scale. The difference is the operating model."
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", lineHeight: 1.5 }}>
                startup to Fortune 500 client research across multiple industries and geographies. Published 2026.
              </p>
            </div>
          </div>
        </section>

        {/* ── THE SINGLE INSIGHT ────────────────────────── */}
        <section style={{ background: "#fff", padding: "56px 48px", borderBottom: "2px solid #E8E4DC" }}>
          <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>The insight every competitor missed</p>
            <h2 style={{ ...CG, fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
              For 40 years, the enterprise bought tools that made the <em>inputs</em> to coordination better. Nobody built the coordination itself into the infrastructure.
            </h2>
            <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8 }}>
              Better data. Better analysis. Better summaries. Better notifications. Better task tracking. The gap between "we know this is happening" and "every relevant person has their task, is accountable, and is executing" remained entirely human-dependent, meeting-dependent, and slow. That gap is 30 days. Readiness OS is the first platform that closes it — not by making the inputs faster, but by replacing the coordination model itself.
            </p>
          </div>
        </section>

        {/* ── COMPETITOR DEEP-DIVE ─────────────────────── */}
        <section style={{ background: "#F8F7F4", padding: "64px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>Platform by Platform</p>
              <h2 style={{ ...CG, fontSize: 38, fontWeight: 700, color: NAVY, marginBottom: 8 }}>The honest comparison</h2>
              <p style={{ fontSize: 15, color: "#6B7280" }}>We respect every platform below. We also know exactly what they don't do.</p>
            </div>

            <div className="space-y-3">
              {competitors.map((c) => {
                const isOpen = openCard === c.name;
                return (
                  <div
                    key={c.name}
                    style={{ background: "#fff", border: `1px solid ${isOpen ? GOLD : "#E8E4DC"}`, transition: "border-color 0.2s" }}
                  >
                    {/* Header — always visible */}
                    <button
                      onClick={() => setOpenCard(isOpen ? null : c.name)}
                      className="w-full text-left"
                      style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{c.name}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF", padding: "2px 8px", border: "1px solid #E8E4DC" }}>{c.category}</span>
                          {c.isComplementary && (
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL, padding: "2px 8px", border: `1px solid ${TEAL}`, background: "rgba(43,138,110,0.05)" }}>Complementary</span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: "#6B7280", fontStyle: "italic" }}>"{c.claim}"</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, fontStyle: "italic", maxWidth: 220, textAlign: "right", display: isOpen ? "none" : "block" }}>
                          {c.oneLiner}
                        </div>
                        {isOpen ? (
                          <ChevronUp style={{ width: 18, height: 18, color: GOLD, flexShrink: 0 }} />
                        ) : (
                          <ChevronDown style={{ width: 18, height: 18, color: "#9CA3AF", flexShrink: 0 }} />
                        )}
                      </div>
                    </button>

                    {/* Expanded body */}
                    {isOpen && (
                      <div style={{ padding: "0 24px 24px", borderTop: "1px solid #F3F4F6" }}>
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                          <div style={{ padding: "16px", background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B7280", marginBottom: 8 }}>What they do</div>
                            <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>{c.whatTheyDo}</p>
                          </div>
                          <div style={{ padding: "16px", background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.15)" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#EF4444", marginBottom: 8 }}>Where they stop</div>
                            <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>{c.whereTheyStop}</p>
                          </div>
                          <div style={{ padding: "16px", background: "rgba(201,168,76,0.04)", border: `1px solid ${GOLD}` }}>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>The Readiness OS advantage</div>
                            <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>{c.theGap}</p>
                          </div>
                        </div>
                        <div style={{ marginTop: 16, padding: "14px 20px", background: NAVY, display: "inline-block" }}>
                          <span style={{ ...CG, fontSize: 15, fontWeight: 700, color: GOLD, fontStyle: "italic" }}>"{c.oneLiner}"</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── THE 5 REASONS ────────────────────────────── */}
        <section style={{ background: NAVY, padding: "72px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 900px 700px at 20% 60%, rgba(43,138,110,0.1), transparent)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>The Unified Win</p>
              <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                5 reasons Readiness OS<br />wins every comparison
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>These are not marketing claims. They are structural advantages that no competitor can replicate without rebuilding from scratch.</p>
            </div>

            <div className="space-y-4">
              {fiveReasons.map((r, i) => (
                <div key={r.title} style={{ display: "flex", gap: 24, padding: "24px 28px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, background: "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <r.icon style={{ width: 18, height: 18, color: GOLD }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                        <span style={{ color: GOLD, marginRight: 8 }}>{i + 1}.</span>{r.title}
                      </h3>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: TEAL, padding: "3px 10px", border: `1px solid ${TEAL}`, whiteSpace: "nowrap" }}>{r.metric}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.75 }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE SINGLE SENTENCE ───────────────────────── */}
        <section style={{ background: "#fff", padding: "64px 48px", borderTop: "2px solid #E8E4DC" }}>
          <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>The competitive position in one sentence</p>
            <blockquote style={{ ...CG, fontSize: "clamp(22px,3vw,34px)", fontWeight: 700, color: NAVY, lineHeight: 1.3, fontStyle: "italic", marginBottom: 24, borderLeft: `4px solid ${GOLD}`, paddingLeft: 24, textAlign: "left" }}>
              "Every enterprise has tools that tell them what's happening. None have the organizational readiness infrastructure that deploys their people when it does. That is Readiness OS."
            </blockquote>

            {/* Board accountability hook */}
            <div style={{ maxWidth: 640, margin: "0 auto 32px", padding: "24px 28px", background: "#F8F7F4", border: "1px solid #E8E4DC", borderLeft: `4px solid ${NAVY}`, textAlign: "left" }}>
              <p style={{ ...CG, fontSize: "clamp(16px,2vw,20px)", fontWeight: 700, color: NAVY, lineHeight: 1.5, fontStyle: "italic", marginBottom: 10 }}>
                "No executive wants to be explaining to the board why they were still aligning stakeholders while the crisis escalated — or the opportunity closed."
              </p>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.65 }}>
                Readiness OS exists precisely for that moment. When the trigger fires, the answer is never "we were figuring out who needed to be in the room." The response was already staged. The team already knows their role. The executive authorizes — not assembles.
              </p>
            </div>

            <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px" }}>
              In the next 12 months, your organization will face at least 3–5 strategic triggers requiring cross-domain coordination. For each one, you currently spend weeks mobilizing before execution begins. Readiness OS pre-stages the response to each one before it fires. The question is not whether you can afford this infrastructure. The question is how many of those events you can afford to handle the old way.
            </p>

            {/* Proof bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { v: "180", l: "Pre-staged Readiness Protocols" },
                { v: "231", l: "Trigger signatures" },
                { v: "12 min", l: "Trigger to coordination" },
                { v: "3,600×", l: "Execution head start" },
              ].map(({ v, l }) => (
                <div key={v} style={{ padding: "20px 16px", border: "1px solid #E8E4DC", background: "#F8F7F4", textAlign: "center" }}>
                  <div style={{ ...CG, fontSize: 30, fontWeight: 700, color: GOLD, marginBottom: 4 }}>{v}</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Must-have sector validation */}
            <div style={{ maxWidth: 640, margin: "0 auto 40px", padding: "18px 22px", background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 12 }}>Organizational readiness infrastructure — must-have for:</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                {["Financial Services", "Healthcare & Life Sciences", "Energy & Utilities", "Manufacturing", "Technology", "Government & Defense"].map(sector => (
                  <span key={sector} style={{ display: "inline-block", padding: "6px 14px", border: "1px solid #E8E4DC", background: "#fff", fontSize: 11, fontWeight: 600, color: NAVY }}>
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/request-access">
                <Button size="lg" style={{ background: NAVY, color: "#fff", fontWeight: 700, padding: "0 36px" }}>
                  Request Founding Partner Access <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/readiness-benchmark">
                <Button size="lg" variant="outline" style={{ borderColor: GOLD, color: NAVY, fontWeight: 700 }}>
                  Score Your Readiness — Free
                </Button>
              </Link>
              <Link href="/demo-hub">
                <Button size="lg" variant="outline" style={{ borderColor: "#E8E4DC", color: NAVY }}>
                  Watch the 12-Minute Demo
                </Button>
              </Link>
              <Link href="/executive-brief">
                <Button size="lg" variant="outline" style={{ borderColor: "#E8E4DC", color: NAVY }}>
                  Download Executive Brief
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
