import { Users, BookOpen, Shield, Award, ChevronRight, ExternalLink, Microscope, Quote } from "lucide-react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

const ADVISORY_BOARD = [
  {
    name: "Kerry Huang",
    title: "Former Chief Strategy Officer, Fortune 50 Healthcare",
    focus: "Protocol architecture validation and enterprise readiness scoring",
    quote: "The 12-minute execution window isn't a product claim — it's a systems design outcome. VaughnMartin built the infrastructure correctly.",
    domain: "Healthcare & Strategy",
  },
  {
    name: "Jayashree Krishnamurthy",
    title: "Former SVP Operations, Global Financial Services",
    focus: "Cross-domain compound threat detection and financial services protocol depth",
    quote: "Every large financial institution has experienced the 30-day mobilization problem. This platform makes it structurally impossible.",
    domain: "Financial Services",
  },
  {
    name: "Zhaohui Chen",
    title: "Director, Enterprise AI Systems Research",
    focus: "Signal ontology validation, AI safety controls, and human-authorization architecture",
    quote: "The executive authorization requirement isn't a constraint — it's the design. Readiness without human decision authority is just automation. This preserves both.",
    domain: "AI Systems",
  },
  {
    name: "Sabina Moretti",
    title: "Former Chief Compliance Officer, Multinational Manufacturing",
    focus: "Regulatory protocol depth, compliance-driven trigger validation",
    quote: "The regulatory calendar integration alone closes a gap that compliance teams have been trying to fill with spreadsheets for decades.",
    domain: "Regulatory & Compliance",
  },
  {
    name: "Kulneet Sharma",
    title: "Partner, Enterprise Technology Advisory",
    focus: "Microsoft ecosystem integration and enterprise deployment architecture",
    quote: "Every enterprise has already purchased the Microsoft stack. VaughnMartin is the operating model that makes the investment usable. That's not positioning — that's the gap in the market.",
    domain: "Enterprise Architecture",
  },
];

const VALIDATION_METHODOLOGY = [
  {
    step: "01",
    title: "Protocol Stress Testing",
    description: "Each of the 170 core Readiness Protocols is tested against historical trigger events from public record — SEC filings, press archives, earnings calls — to validate that the protocol would have reduced mobilization time to under 12 minutes.",
  },
  {
    step: "02",
    title: "Signal Pattern Backtesting",
    description: "The 221 trigger patterns are evaluated against 5 years of news and regulatory data to confirm false-positive rates below 8% and true-positive detection rates above 87% for material enterprise events.",
  },
  {
    step: "03",
    title: "Compound Intelligence Validation",
    description: "Cross-domain compound threat patterns (Protocols 181–184) are validated against documented cases where organizations were blindsided by simultaneous multi-domain triggers — events no single-domain system would have flagged.",
  },
  {
    step: "04",
    title: "Execution Clock Measurement",
    description: "The 12-minute execution window is measured from trigger detection to first stakeholder notification, protocol activation, and executive authorization prompt — with real timing data from Founding Partner activations.",
  },
];

const INVESTOR_LANGUAGE = [
  {
    competitor: "Signal Labs",
    response: "Signal Labs detects signals. We pre-stage the response. Detection without execution infrastructure is an alert system, not a readiness platform. The gap between an alert and a coordinated enterprise response is exactly what we compress.",
  },
  {
    competitor: "ServiceNow",
    response: "ServiceNow automates workflows inside an organization. We pre-stage strategic responses before the trigger fires — across organizational boundaries, with external stakeholder coordination and executive authorization built in. Different problem, different architecture.",
  },
  {
    competitor: "Palantir",
    response: "Palantir builds custom intelligence infrastructure for large government and defense contracts. We deliver a configurable, 170-protocol readiness operating model that a startup to Fortune 500 enterprise deploys in 90 days without a custom build.",
  },
  {
    competitor: "McKinsey",
    response: "McKinsey provides strategic advice after the trigger fires. We encode that strategic advice into pre-staged protocols before the trigger fires. The preparation replaces the retainer — for a fraction of the cost and a fraction of the mobilization time.",
  },
  {
    competitor: "Microsoft Copilot",
    response: "Every enterprise already has Microsoft's AI stack. None have the operating model to use it at speed. Readiness OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator. We make the Copilot investment usable in a crisis.",
  },
];

export default function ResearchFoundation() {
  return (
    <PageLayout>
      <div className="min-h-screen" style={{ backgroundColor: NAVY }}>

        {/* Hero */}
        <div className="border-b" style={{ borderColor: "#1E2D5A" }}>
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-2 mb-4">
              <Microscope className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-xs font-mono tracking-widest" style={{ color: GOLD }}>RESEARCH FOUNDATION</span>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: "white", fontFamily: "Georgia, serif", lineHeight: 1.2 }}>
              The Credibility Architecture Behind Readiness OS
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: IVORY, opacity: 0.8, maxWidth: "680px" }}>
              A platform that compresses 30-day mobilization cycles to 12 minutes carries an evidence burden. This page documents the research foundation, practitioner validation, and advisory board that substantiates every claim.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12 space-y-20">

          {/* Advisory Board */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5" style={{ color: GOLD }} />
              <h2 className="text-2xl font-bold" style={{ color: "white", fontFamily: "Georgia, serif" }}>Advisory Board</h2>
            </div>
            <p className="text-sm mb-8" style={{ color: IVORY, opacity: 0.65, maxWidth: "600px" }}>
              Practitioners who have experienced the 30-day mobilization problem from inside Fortune 500 organizations — and who have validated that the Readiness OS architecture closes it.
            </p>

            <div className="space-y-6">
              {ADVISORY_BOARD.map((advisor, i) => (
                <div key={i} className="rounded-sm border p-6" style={{ borderColor: "#1E2D5A", backgroundColor: "#0A1228" }}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Avatar placeholder */}
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-bold text-xl"
                      style={{ backgroundColor: `${GOLD}20`, color: GOLD, fontFamily: "Georgia, serif" }}>
                      {advisor.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg" style={{ color: "white", fontFamily: "Georgia, serif" }}>{advisor.name}</h3>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${TEAL}20`, color: TEAL }}>
                          {advisor.domain}
                        </span>
                      </div>
                      <p className="text-sm mb-3" style={{ color: GOLD, opacity: 0.8 }}>{advisor.title}</p>
                      <p className="text-sm mb-4" style={{ color: IVORY, opacity: 0.7 }}>
                        <strong style={{ color: IVORY }}>Focus area:</strong> {advisor.focus}
                      </p>
                      <blockquote className="border-l-2 pl-4 italic" style={{ borderColor: GOLD }}>
                        <p className="text-sm leading-relaxed" style={{ color: IVORY, opacity: 0.85 }}>"{advisor.quote}"</p>
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Validation Methodology */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5" style={{ color: TEAL }} />
              <h2 className="text-2xl font-bold" style={{ color: "white", fontFamily: "Georgia, serif" }}>Validation Methodology</h2>
            </div>
            <p className="text-sm mb-8" style={{ color: IVORY, opacity: 0.65, maxWidth: "600px" }}>
              How every protocol, trigger pattern, and execution claim is tested before it enters the platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {VALIDATION_METHODOLOGY.map((item, i) => (
                <div key={i} className="rounded-sm border p-6" style={{ borderColor: "#1E2D5A", backgroundColor: "#0A1228" }}>
                  <div className="text-3xl font-bold mb-3" style={{ color: GOLD, fontFamily: "'Courier New', monospace", opacity: 0.6 }}>
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "white", fontFamily: "Georgia, serif" }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: IVORY, opacity: 0.75 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Competitive Response Matrix */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5" style={{ color: GOLD }} />
              <h2 className="text-2xl font-bold" style={{ color: "white", fontFamily: "Georgia, serif" }}>Competitive Response Matrix</h2>
            </div>
            <p className="text-sm mb-8" style={{ color: IVORY, opacity: 0.65, maxWidth: "640px" }}>
              One paragraph responses to the five most common competitive comparisons — ready for investor and enterprise sales conversations.
            </p>

            <div className="space-y-4">
              {INVESTOR_LANGUAGE.map((item, i) => (
                <div key={i} className="rounded-sm border p-5" style={{ borderColor: "#1E2D5A", backgroundColor: "#0A1228" }}>
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-mono font-bold px-2 py-0.5 rounded-sm shrink-0"
                      style={{ backgroundColor: `${GOLD}18`, color: GOLD }}>
                      vs {item.competitor}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: IVORY, opacity: 0.85 }}>{item.response}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-sm border p-10 text-center" style={{ borderColor: `${GOLD}40`, backgroundColor: "#0A1228" }}>
            <Award className="w-10 h-10 mx-auto mb-4" style={{ color: GOLD }} />
            <h2 className="text-2xl font-bold mb-3" style={{ color: "white", fontFamily: "Georgia, serif" }}>
              Join the Founding Partner Program
            </h2>
            <p className="text-base mb-6 mx-auto" style={{ color: IVORY, opacity: 0.75, maxWidth: "520px" }}>
              A 90-day validation partnership that turns your strategic triggers into pre-staged Readiness Protocols — and adds your organization's learnings to the compounding intelligence architecture.
            </p>
            <Link href="/request-access">
              <a className="inline-flex items-center gap-2 px-8 py-3 font-mono font-bold tracking-wider text-sm"
                style={{ backgroundColor: GOLD, color: NAVY, borderRadius: "0.15rem" }}>
                Apply for Founding Partner Access
                <ChevronRight className="w-4 h-4" />
              </a>
            </Link>
          </section>

        </div>
      </div>
    </PageLayout>
  );
}
