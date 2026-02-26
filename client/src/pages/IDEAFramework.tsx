import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updatePageMetadata } from "@/lib/seo";
import {
  ArrowRight, Brain, Users, Eye, Zap, Shield, Target, Clock,
  CheckCircle2, ChevronRight, Play, Cpu, HeartHandshake
} from "lucide-react";

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";

const phases = [
  {
    letter: "I",
    name: "IDENTIFY",
    tagline: "Know your triggers before they become crises.",
    aiRole: "AI-Powered",
    humanRole: "Human-Configured",
    aiColor: "#2B8A6E",
    humanColor: "#C9A84C",
    description:
      "170 pre-built strategic playbooks covering 9 domains. Your team configures which triggers matter, which stakeholders own each response, and what outcomes define success. AI maps dependencies and surfaces gaps in coverage.",
    aiActions: [
      "Pattern-match trigger signals across all 9 domains",
      "Score playbook relevance for incoming scenarios",
      "Surface coverage gaps in your strategic library",
      "Recommend playbooks based on historical outcomes",
    ],
    humanActions: [
      "Configure which triggers activate which playbooks",
      "Set decision rights and stakeholder ownership",
      "Define success metrics and risk tolerance",
      "Customize governance rules for your organization",
    ],
    metric: { value: "170", label: "pre-built playbooks" },
    icon: Eye,
  },
  {
    letter: "D",
    name: "DETECT",
    tagline: "Real-time signal monitoring across 24 enterprise systems.",
    aiRole: "AI-Powered",
    humanRole: "Human-Supervised",
    aiColor: "#2B8A6E",
    humanColor: "#C9A84C",
    description:
      "AI monitors signals in 15-minute cycles across financial markets, competitive moves, regulatory changes, social media, and operational systems. When a trigger fires, AI matches it to your playbook library and queues the activation decision — in seconds.",
    aiActions: [
      "Monitor 24+ enterprise data sources in real time",
      "Detect compound disruptions across multiple domains",
      "Match incoming signals to relevant playbooks",
      "Assess urgency and recommended response timeline",
    ],
    humanActions: [
      "Review and approve trigger classification",
      "Adjust signal sensitivity thresholds",
      "Escalate or suppress low-priority signals",
      "Set monitoring rules per domain and region",
    ],
    metric: { value: "15min", label: "signal cycles" },
    icon: Zap,
  },
  {
    letter: "E",
    name: "EXECUTE",
    tagline: "From signal to coordinated action in under 12 minutes.",
    aiRole: "AI-Orchestrated",
    humanRole: "Human-Authorized",
    aiColor: "#2B8A6E",
    humanColor: "#C9A84C",
    description:
      "When an executive authorizes activation, the system simultaneously creates structured tasks, notifies stakeholders with role-specific briefs, stages documents, allocates budget, and opens collaboration channels. Every action has a pre-defined owner and SLA.",
    aiActions: [
      "Generate task structures with role-specific assignments",
      "Send stakeholder notifications with contextual briefs",
      "Stage documents and draft initial communications",
      "Track execution status across all active workstreams",
    ],
    humanActions: [
      "Authorize playbook activation with one click",
      "Make real-time strategic decisions at decision gates",
      "Escalate or deprioritize based on ground truth",
      "Approve communications before external release",
    ],
    metric: { value: "12min", label: "trigger to execution" },
    icon: Target,
  },
  {
    letter: "A",
    name: "ADVANCE",
    tagline: "Every execution makes the organization stronger.",
    aiRole: "AI-Analyzed",
    humanRole: "Human-Decided",
    aiColor: "#2B8A6E",
    humanColor: "#C9A84C",
    description:
      "After each activation, AI generates an executive summary capturing what happened, decision timing, stakeholder response rates, and outcome metrics. Playbooks are automatically updated based on what worked. Over time, your organization's execution speed and precision compound.",
    aiActions: [
      "Generate post-activation executive summaries",
      "Score stakeholder response rates and SLA adherence",
      "Recommend playbook updates based on outcomes",
      "Track execution velocity trends over time",
    ],
    humanActions: [
      "Review performance against strategic objectives",
      "Approve playbook updates and governance changes",
      "Share learnings with board and leadership team",
      "Set improvement targets for next activation",
    ],
    metric: { value: "↑", label: "compound improvement" },
    icon: Brain,
  },
];

export default function IDEAFramework() {
  useEffect(() => {
    updatePageMetadata({
      title: "The IDEA Framework — Execution OS by VaughnMartin",
      description:
        "IDENTIFY triggers. DETECT signals. EXECUTE playbooks. ADVANCE the organization. The IDEA Framework is the operating model that powers 12-minute strategic execution.",
      ogTitle: "The IDEA Framework — VaughnMartin Execution OS",
      ogDescription:
        "A human-AI partnership model for Fortune 1000 strategic execution. AI handles monitoring and orchestration. Humans retain all strategic authority.",
    });
  }, []);

  return (
    <PageLayout>
      <div>
        {/* Hero — dark navy */}
        <section style={{ background: NAVY, position: "relative" }} className="pt-24 pb-16 px-6">
          <div style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.1) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-0.5" style={{ background: GOLD }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                The Execution Framework
              </span>
              <div className="w-6 h-0.5" style={{ background: GOLD }} />
            </div>

            <h1
              className="font-serif font-semibold leading-none mb-6"
              style={{ fontSize: "clamp(72px, 12vw, 120px)", color: "white", letterSpacing: "-0.02em" }}
            >
              I · D · E · A
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-3 leading-relaxed">
              Four phases. One operating model. Built for the 12-minute window between a strategic trigger and coordinated organizational response.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Badge className="px-4 py-2 text-sm font-semibold border-0 rounded-none" style={{ background: `${TEAL}22`, color: TEAL_LT }}>
                <Cpu className="w-4 h-4 mr-2" />
                AI handles monitoring & orchestration
              </Badge>
              <Badge className="px-4 py-2 text-sm font-semibold border-0 rounded-none" style={{ background: `${GOLD}22`, color: GOLD_LT }}>
                <HeartHandshake className="w-4 h-4 mr-2" />
                Humans retain all strategic authority
              </Badge>
            </div>
          </div>
        </section>

        {/* 4 Phase Strip — phase overview */}
        <section className="border-b border-[#E8E4DC] bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-4">
            {phases.map((phase, i) => (
              <a
                key={phase.letter}
                href={`#phase-${phase.letter}`}
                className="group flex flex-col items-center py-6 px-4 border-r border-[#E8E4DC] last:border-r-0 hover:bg-[#F8F7F4] transition-colors"
              >
                <span
                  className="font-serif font-bold text-5xl leading-none mb-2 group-hover:opacity-80 transition-opacity"
                  style={{ color: i % 2 === 0 ? NAVY : TEAL }}
                >
                  {phase.letter}
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">{phase.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Phase Deep-Dives */}
        {phases.map((phase, i) => {
          const Icon = phase.icon;
          const isEven = i % 2 === 0;
          return (
            <section
              key={phase.letter}
              id={`phase-${phase.letter}`}
              className={`py-16 px-6 ${isEven ? "bg-white" : "bg-[#F8F7F4]"}`}
            >
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                  {/* Left — letter + meta */}
                  <div className="md:w-56 shrink-0">
                    <div
                      className="font-serif font-bold leading-none mb-3"
                      style={{ fontSize: 80, color: isEven ? NAVY : TEAL }}
                    >
                      {phase.letter}
                    </div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                      {phase.name}
                    </div>
                    <p className="text-sm font-medium text-gray-700 leading-snug mb-4">
                      {phase.tagline}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Badge
                        className="self-start px-3 py-1 text-xs font-semibold border-0 rounded-none"
                        style={{ background: `${TEAL}22`, color: TEAL }}
                      >
                        <Cpu className="w-3 h-3 mr-1.5" />
                        {phase.aiRole}
                      </Badge>
                      <Badge
                        className="self-start px-3 py-1 text-xs font-semibold border-0 rounded-none"
                        style={{ background: `${GOLD}22`, color: GOLD }}
                      >
                        <HeartHandshake className="w-3 h-3 mr-1.5" />
                        {phase.humanRole}
                      </Badge>
                    </div>
                    <div className="mt-6 text-center p-4 border rounded-none bg-white border-[#E8E4DC]">
                      <div className="font-serif text-3xl font-bold" style={{ color: isEven ? NAVY : TEAL }}>
                        {phase.metric.value}
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">{phase.metric.label}</div>
                    </div>
                  </div>

                  {/* Right — description + two columns */}
                  <div className="flex-1">
                    <p className="text-base text-gray-600 leading-relaxed mb-8">
                      {phase.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* AI Role */}
                      <div className="rounded-none border border-[#2B8A6E]/20 bg-[#2B8A6E]/5 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Cpu className="h-4 w-4" style={{ color: TEAL }} />
                          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: TEAL }}>
                            AI Role
                          </span>
                        </div>
                        <ul className="space-y-3">
                          {phase.aiActions.map((action, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: TEAL }} />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Human Role */}
                      <div className="rounded-none border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <HeartHandshake className="h-4 w-4" style={{ color: GOLD }} />
                          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                            Human Role
                          </span>
                        </div>
                        <ul className="space-y-3">
                          {phase.humanActions.map((action, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <Users className="h-4 w-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* Human-AI Partnership Principle */}
        <section style={{ background: NAVY }} className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-0.5" style={{ background: GOLD }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                The Governing Principle
              </span>
              <div className="w-6 h-0.5" style={{ background: GOLD }} />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-6 leading-snug">
              AI accelerates. Humans decide.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              The IDEA Framework is not workflow automation. It is an agentic execution layer — AI agents coordinate the enterprise response in real time, and executives make every strategic call.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Clock, label: "12-Minute Target", desc: "From trigger detection to full organizational response" },
                { icon: Shield, label: "Human Authority", desc: "Every playbook activation requires executive authorization" },
                { icon: Brain, label: "AI Execution", desc: "Tasks, notifications, documents, and budgets deployed instantly" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="rounded-none border border-white/10 bg-white/5 p-5">
                  <Icon className="h-5 w-5 mb-3" style={{ color: GOLD }} />
                  <div className="text-sm font-semibold text-white mb-1">{label}</div>
                  <div className="text-xs text-white/50 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/try-demo">
                <Button
                  size="lg"
                  className="font-semibold px-8 rounded-none"
                  style={{ background: GOLD, color: NAVY }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  See It in Action
                </Button>
              </Link>
              <Link href="/playbooks">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-8 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none"
                >
                  Browse 170 Playbooks
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
