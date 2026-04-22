import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updatePageMetadata } from "@/lib/seo";
import {
  Play, ArrowRight, CheckCircle2, Clock, Users, Cpu, HeartHandshake,
  Zap, Brain, Target, Eye, Shield, BookOpen, Globe2, ChevronRight
} from "lucide-react";


const timelineSteps = [
  {
    time: "Pre-Staged",
    headline: "Identify",
    sub: "Preparation before the trigger fires",
    aiRole: [
      "170 prepared responses built and staged across 9 strategic domains",
      "221 triggers defined and mapped to response protocols",
      "Stakeholder roles, decision rights, and escalation paths configured",
      "Monitoring parameters set — continuous signal detection active",
    ],
    humanRole: [
      "Prepared responses reviewed and customized to your organization",
      "Executive authorization protocols established in advance",
      "No action required when the trigger fires — preparation is already done",
    ],
    color: "#C9A84C",
    badge: "I · IDENTIFY",
  },
  {
    time: "0:00",
    headline: "Detect",
    sub: "Signal fires — system responds instantly",
    aiRole: [
      "Ingests signal across 24+ enterprise data sources",
      "Pattern-matches against 221 trigger definitions",
      "Scores urgency and compound disruption risk",
      "Surfaces the right prepared response with rationale and stakeholder map",
    ],
    humanRole: [
      "Receives instant notification with a scored, context-ready brief",
      "Reviews the signal classification and recommended prepared response",
      "Nothing else required yet — the response is already staged",
    ],
    color: "#2B8A6E",
    badge: "D · DETECT",
  },
  {
    time: "1:30",
    headline: "Execute",
    sub: "One executive decision. Full organizational deployment.",
    aiRole: [
      "Creates role-specific tasks for every stakeholder simultaneously",
      "Notifies all parties with contextual briefs and instructions",
      "Stages documents and drafts audience-specific communications",
      "Opens coordination channels and begins SLA tracking",
    ],
    humanRole: [
      "Authorizes the response with a single click — authority fully retained",
      "Receives role-specific task list and decision context",
      "Approves external communications before release",
      "Makes real-time decisions at defined escalation gates",
    ],
    color: "#0A0F2E",
    badge: "E · EXECUTE",
  },
  {
    time: "12:00",
    headline: "Advance",
    sub: "Organization coordinated. Learning captured.",
    aiRole: [
      "Generates live execution dashboard with full status visibility",
      "Tracks stakeholder response rates and flags at-risk workstreams",
      "Prepares executive debrief and post-event summary",
      "Updates the prepared response with decisions made under real pressure",
    ],
    humanRole: [
      "Reviews live execution status and resolves blockers",
      "Communicates coordinated status to board and leadership",
      "Captures institutional lessons — making the next response faster",
      "Closes the loop: every event makes the organization more prepared",
    ],
    color: "#2B8A6E",
    badge: "A · ADVANCE",
  },
];

const components = [
  { name: "Signal Intelligence", desc: "24+ source monitoring in 15-min cycles", icon: Globe2 },
  { name: "Prepared response Engine", desc: "170 pre-built + custom prepared response builder", icon: BookOpen },
  { name: "Execution Orchestrator", desc: "Tasks, comms, docs deployed instantly", icon: Zap },
  { name: "Decision Console", desc: "One-click authorization with AI context", icon: Target },
  { name: "Stakeholder Hub", desc: "Role-based notifications and briefs", icon: Users },
  { name: "Signal Radar", desc: "Pattern detection and risk scoring", icon: Brain },
  { name: "Governance Layer", desc: "Decision rights and audit trail", icon: Shield },
  { name: "Outcome Tracking", desc: "Outcome tracking and prepared response learning", icon: Eye },
];

export default function PlatformOverview() {
  useEffect(() => {
    updatePageMetadata({
      title: "Platform Overview — Readiness OS by VaughnMartin",
      description:
        "From signal detection to coordinated organizational response in 12 minutes. Every component of the Readiness OS, in one unified platform built for Fortune 1000 speed.",
      ogTitle: "Platform Overview — VaughnMartin Readiness OS",
      ogDescription:
        "Signal detected at 0:00. Organization coordinated by 12:00. The complete execution infrastructure layer for Fortune 1000 companies.",
    });
  }, []);

  return (
    <PageLayout>
      <div>
        {/* Hero — white */}
        <section style={{ background: "#fff", borderBottom: "1px solid #E8E4DC", padding: "64px 48px", minHeight: 260 }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Readiness OS · Platform Architecture</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-8">
              <div className="flex-1">
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#0A0F2E", marginBottom: 16 }}>
                  The Complete<br />
                  <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Readiness Infrastructure</em>
                </h1>
                <p className="text-lg text-[#6B7280] max-w-xl leading-relaxed">
                  Every component needed to move from strategic trigger to coordinated organizational response — in under 12 minutes.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                  <span className="w-2 h-2 bg-[#0A0F2E]" />
                  AI handles signal monitoring and execution orchestration
                </div>
                <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                  <span className="w-2 h-2" style={{ background: "#C9A84C" }} />
                  Humans retain all strategic decision authority
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12-Minute Timeline */}
        <section style={{ background: "#F8F7F4", padding: "64px 48px" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>The 12-Minute Window</span>
                <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E", marginBottom: 12 }}>
                What Happens in 12 Minutes
              </h2>
              <p className="text-[#6B7280] max-w-2xl mx-auto">
                From the moment a signal fires to the moment your organization is fully coordinated. Every step powered by AI, every decision made by humans.
              </p>
            </div>

            <div className="space-y-0 relative">
            <div className="absolute left-[23px] md:left-[47px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#0A0F2E] via-[#C9A84C] to-[#2B8A6E]" />

              {timelineSteps.map((step, i) => (
                <div key={i} className="relative flex gap-6 md:gap-10 mb-8">
                  <div className="shrink-0 flex flex-col items-center">
                    <div
                      className="w-12 h-12 md:w-24 md:h-12 flex items-center justify-center font-serif font-bold text-sm shrink-0 z-10"
                      style={{ background: "#0A0F2E", color: "#C9A84C" }}
                    >
                      {step.time}
                    </div>
                  </div>

                  <div className="flex-1 bg-white border border-[#E8E4DC] p-6">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                          <div style={{ width: 20, height: 1.5, background: step.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: step.color }}>{step.badge}</span>
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: "#0A0F2E" }}>{step.headline}</h3>
                        <p className="text-sm text-[#6B7280]">{step.sub}</p>
                      </div>
                      <Clock className="h-5 w-5 text-[#E8E4DC] shrink-0" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Cpu className="h-3.5 w-3.5" style={{ color: "#0A0F2E" }} />
                          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#0A0F2E" }}>AI Role</span>
                        </div>
                        <ul className="space-y-2">
                          {step.aiRole.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-[#6B7280]">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#2B8A6E" }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-3.5 w-3.5" style={{ color: "#C9A84C" }} />
                          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#C9A84C" }}>Human Role</span>
                        </div>
                        <ul className="space-y-2">
                          {step.humanRole.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-[#6B7280]">
                              <Users className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#C9A84C" }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8 Platform Components */}
        <section className="py-16 px-12 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>8 Integrated Components</span>
                <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E", marginBottom: 12 }}>
                One Platform. Every Component Connected.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {components.map(({ name, desc, icon: Icon }) => (
                <div
                  key={name}
                  className="border border-[#E8E4DC] bg-white p-6 hover:border-[#0A0F2E] transition-colors"
                >
                  <div style={{ width: 32, height: 32, background: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon className="h-4 w-4 text-[#0A0F2E]" />
                  </div>
                  <div className="text-sm font-semibold text-[#0A0F2E] mb-1">{name}</div>
                  <div className="text-xs text-[#6B7280] leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — dark navy */}
        <section style={{ background: "#0A0F2E", padding: "64px 48px" }}>
          <div className="max-w-3xl mx-auto text-center">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Ready to See It</span>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#fff", marginBottom: 16 }}>
              Experience the Full Loop
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Watch a live trigger fire, prepared responses activate, and stakeholders mobilize — in real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/request-access">
                <Button
                  size="lg"
                  className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8"
                >
                  Request a Pilot
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/12-minute-experience">
                <Button
                  size="lg"
                  className="border border-white/30 text-white hover:bg-white/10 bg-transparent px-8"
                >
                  <Play className="mr-2 h-4 w-4" />
                  See It Live
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
