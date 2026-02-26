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

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

const timelineSteps = [
  {
    time: "0:00",
    headline: "Signal Detected",
    sub: "AI monitoring fires",
    aiRole: [
      "Ingests signal across 24+ enterprise data sources",
      "Pattern-matches against 170 playbook triggers",
      "Scores urgency and compound disruption risk",
      "Identifies affected domains and playbook candidates",
    ],
    humanRole: [
      "Receives instant notification with AI-scored brief",
      "Reviews signal classification",
      "Nothing else required yet",
    ],
    color: TEAL,
    badge: "DETECT",
  },
  {
    time: "1:30",
    headline: "Executive Decision",
    sub: "One-click authorization",
    aiRole: [
      "Surfaces recommended playbooks with rationale",
      "Shows stakeholder map and resource requirements",
      "Estimates budget impact and timeline",
      "Prepares activation queue ready to deploy",
    ],
    humanRole: [
      "Reviews AI-prepared activation summary",
      "Selects which playbooks to activate",
      "Authorizes with a single click",
      "All strategic decision-making authority retained",
    ],
    color: GOLD,
    badge: "AUTHORIZE",
  },
  {
    time: "4:00",
    headline: "Full Deployment",
    sub: "Simultaneous activation",
    aiRole: [
      "Creates structured tasks with role-specific assignments",
      "Notifies all stakeholders with contextual briefs",
      "Stages documents and drafts initial communications",
      "Opens collaboration channels and tracks SLAs",
    ],
    humanRole: [
      "Receives role-specific task list and context",
      "Makes real-time decisions at defined decision gates",
      "Approves external communications before release",
      "Escalates or deprioritizes based on ground truth",
    ],
    color: TEAL,
    badge: "EXECUTE",
  },
  {
    time: "12:00",
    headline: "Response Operational",
    sub: "Organization fully coordinated",
    aiRole: [
      "Generates real-time execution dashboard",
      "Tracks stakeholder response rates and SLAs",
      "Flags at-risk workstreams with recommendations",
      "Prepares executive summary for post-event review",
    ],
    humanRole: [
      "Reviews live execution status",
      "Resolves blockers and escalations",
      "Communicates status to board and leadership",
      "All response now operational — organization coordinated",
    ],
    color: NAVY,
    badge: "ADVANCE",
  },
];

const components = [
  { name: "Signal Intelligence", desc: "24+ source monitoring in 15-min cycles", icon: Globe2 },
  { name: "Playbook Engine", desc: "170 pre-built + custom playbook builder", icon: BookOpen },
  { name: "Execution Orchestrator", desc: "Tasks, comms, docs deployed instantly", icon: Zap },
  { name: "Decision Console", desc: "One-click authorization with AI context", icon: Target },
  { name: "Stakeholder Hub", desc: "Role-based notifications and briefs", icon: Users },
  { name: "AI Radar", desc: "Pattern detection and risk scoring", icon: Brain },
  { name: "Governance Layer", desc: "Decision rights and audit trail", icon: Shield },
  { name: "ADVANCE Analytics", desc: "Outcome tracking and playbook learning", icon: Eye },
];

export default function PlatformOverview() {
  useEffect(() => {
    updatePageMetadata({
      title: "Platform Overview — Execution OS by VaughnMartin",
      description:
        "From signal detection to coordinated organizational response in 12 minutes. Every component of the Execution OS, in one unified platform built for Fortune 1000 speed.",
      ogTitle: "Platform Overview — VaughnMartin Execution OS",
      ogDescription:
        "Signal detected at 0:00. Organization coordinated by 12:00. The complete execution infrastructure layer for Fortune 1000 companies.",
    });
  }, []);

  return (
    <PageLayout>
      <div>
        {/* Hero — white */}
        <section className="bg-white dark:bg-slate-950 pt-24 pb-12 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-0.5" style={{ background: GOLD }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                Platform Overview
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-8">
              <div className="flex-1">
                <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight mb-4" style={{ color: NAVY }}>
                  The Complete<br />
                  <em className="italic" style={{ color: TEAL }}>Execution Infrastructure</em>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                  Every component needed to move from strategic trigger to coordinated organizational response — in under 12 minutes.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  AI handles signal monitoring and execution orchestration
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                  Humans retain all strategic decision authority
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12-Minute Timeline */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-4 h-0.5" style={{ background: GOLD }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                  The 12-Minute Window
                </span>
                <div className="w-4 h-0.5" style={{ background: GOLD }} />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3" style={{ color: NAVY }}>
                What Happens in 12 Minutes
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                From the moment a signal fires to the moment your organization is fully coordinated. Every step powered by AI, every decision made by humans.
              </p>
            </div>

            <div className="space-y-0 relative">
              <div className="absolute left-[23px] md:left-[47px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#2B8A6E] via-[#C9A84C] to-[#0A0F2E] rounded-full" />

              {timelineSteps.map((step, i) => (
                <div key={i} className="relative flex gap-6 md:gap-10 mb-8">
                  <div className="shrink-0 flex flex-col items-center">
                    <div
                      className="w-12 h-12 md:w-24 md:h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0 z-10"
                      style={{ background: step.color === GOLD ? GOLD : step.color, color: step.color === GOLD ? NAVY : "white" }}
                    >
                      {step.time}
                    </div>
                  </div>

                  <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className="text-[10px] font-bold tracking-widest border-0 px-2"
                            style={{
                              background: step.color === GOLD ? `${GOLD}22` : step.color === NAVY ? "#0A0F2E22" : `${TEAL}22`,
                              color: step.color === GOLD ? "#A8822A" : step.color === NAVY ? NAVY : TEAL
                            }}
                          >
                            {step.badge}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: NAVY }}>{step.headline}</h3>
                        <p className="text-sm text-slate-500">{step.sub}</p>
                      </div>
                      <Clock className="h-5 w-5 text-slate-300 shrink-0" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Cpu className="h-3.5 w-3.5" style={{ color: TEAL }} />
                          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: TEAL }}>AI Role</span>
                        </div>
                        <ul className="space-y-2">
                          {step.aiRole.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: TEAL }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <HeartHandshake className="h-3.5 w-3.5" style={{ color: "#A8822A" }} />
                          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#A8822A" }}>Human Role</span>
                        </div>
                        <ul className="space-y-2">
                          {step.humanRole.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Users className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#A8822A" }} />
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
        <section className="py-16 px-6 bg-white dark:bg-slate-950">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-4 h-0.5" style={{ background: GOLD }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>8 Integrated Components</span>
                <div className="w-4 h-0.5" style={{ background: GOLD }} />
              </div>
              <h2 className="font-serif text-3xl font-semibold mb-3" style={{ color: NAVY }}>
                One Platform. Every Component Connected.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {components.map(({ name, desc, icon: Icon }) => (
                <div
                  key={name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${TEAL}18` }}>
                    <Icon className="h-5 w-5" style={{ color: TEAL }} />
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{name}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — dark navy */}
        <section style={{ background: NAVY }} className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-4 h-0.5" style={{ background: GOLD }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>Ready to See It</span>
              <div className="w-4 h-0.5" style={{ background: GOLD }} />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
              Experience the Full Loop
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Watch a live trigger fire, playbooks activate, and stakeholders mobilize — in real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/try-demo">
                <Button
                  size="lg"
                  className="font-semibold px-8"
                  style={{ background: GOLD, color: NAVY }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Try Interactive Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-8 border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  Request Pilot Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
