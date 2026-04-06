import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updatePageMetadata } from "@/lib/seo";
import {
  ArrowRight, Brain, Users, Eye, Zap, Shield, Target, Clock,
  CheckCircle2, ChevronRight, Play, Cpu, HeartHandshake, TrendingUp, Activity, Wifi
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
        "The operating model that turns AI signal detection into 12-minute organizational execution. AI monitors, scores, and recommends. Executives authorize. The decision was already pre-staged.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="bg-white min-h-screen">
        {/* Hero Section — Navy with Grid */}
        <section style={{ background: "#0A0F2E", padding: "120px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-6 h-0.5" style={{ background: "#C9A84C" }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A84C" }}>
                The Execution Framework
              </span>
              <div className="w-6 h-0.5" style={{ background: "#C9A84C" }} />
            </div>

            <h1
              className="font-serif font-semibold leading-none mb-8"
              style={{ fontSize: "clamp(80px, 15vw, 160px)", color: "white", letterSpacing: "-0.02em" }}
            >
              I · D · E · A
            </h1>

            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed">
              Four phases. One operating model. Built for the <em style={{ fontStyle: "italic", color: "#C9A84C" }}>12-minute window</em> between a strategic trigger and coordinated organizational response.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
              <Badge className="px-6 py-3 text-sm font-semibold border-0 rounded-none h-14" style={{ background: "rgba(43,138,110,0.15)", color: "#2B8A6E" }}>
                <Cpu className="w-5 h-5 mr-3" />
                AI handles monitoring & orchestration
              </Badge>
              <Badge className="px-6 py-3 text-sm font-semibold border-0 rounded-none h-14" style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
                <HeartHandshake className="w-5 h-5 mr-3" />
                Humans retain all strategic authority
              </Badge>
            </div>
          </div>
        </section>

        {/* Platform Stats Bar */}
        <section style={{ background: "#F8F7F4", borderBottom: "1px solid #E8E4DC" }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {[
              { value: "170", label: "Strategic Playbooks", sublabel: "Across 9 Domains", color: NAVY },
              { value: "221", label: "Executive Triggers", sublabel: "Pre-Configured", color: TEAL },
              { value: "248+", label: "Live Data Points", sublabel: "Continuously Monitored", color: GOLD },
              { value: "12m", label: "Response Window", sublabel: "Signal → Execution", color: NAVY },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center py-8 px-6 border-r border-[#E8E4DC] last:border-r-0" style={{ textAlign: "center" }}>
                <div className="font-serif font-bold text-4xl mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#0A0F2E] mb-0.5">{stat.label}</div>
                <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">{stat.sublabel}</div>
              </div>
            ))}
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
                  style={{ color: (phase.name === 'IDENTIFY' || phase.name === 'ADVANCE') ? TEAL : (phase.name === 'DETECT' ? NAVY : GOLD) }}
                >
                  {phase.letter}
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-[#6B7280]">{phase.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Coaching Model Analogy ─────────────────────────────────────── */}
        <section style={{ background: "#F8F7F4", padding: "72px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: TEAL, marginBottom: 12 }}>The Operating Model Origin</div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
                Built on the same model elite coaches use to win.
              </h2>
              <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 600, margin: "0 auto", lineHeight: 1.75 }}>
                Elite NFL and college programs make 60–80 strategic decisions per 3-hour game — each one under 40 seconds. The preparation happens before the game begins. The IDEA Framework brings the same operating model to the enterprise.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "#E8E4DC", border: "1px solid #E8E4DC" }}>
              {[
                { phase: "IDENTIFY", sport: "Pre-Season Game Planning", icon: "🏈", sportLine: "Coaches define every situation before the season begins.", execLine: "170 playbooks across 9 domains — pre-built before the trigger fires.", color: TEAL },
                { phase: "DETECT", sport: "Reading the Defense", icon: "📡", sportLine: "Live reads of the field. Data points line up. The situation is confirmed.", execLine: "248+ signals monitored continuously. Trigger surfaces in seconds.", color: GOLD },
                { phase: "EXECUTE", sport: "The Play Call", icon: "⚡", sportLine: "Under 40 seconds. Everyone already knows their role. No committee needed.", execLine: "Executive authorizes. 12 minutes to full organizational execution.", color: NAVY },
                { phase: "ADVANCE", sport: "Film Study", icon: "📊", sportLine: "After the game: what worked, what failed, what to refine next time.", execLine: "Post-Activation Debrief. Every execution sharpens the next.", color: TEAL_LT },
              ].map(item => (
                <div key={item.phase} style={{ background: "#fff", padding: "28px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: item.color }}>{item.phase}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginTop: 1 }}>{item.sport}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginBottom: 12 }}>{item.sportLine}</p>
                  <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 12 }}>
                    <p style={{ fontSize: 12, color: NAVY, fontWeight: 600, lineHeight: 1.6 }}>{item.execLine}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: "20px 28px", background: NAVY, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, flexShrink: 0 }}>Executive Authority</div>
              <p style={{ fontSize: 14, color: "#C8D4E8", lineHeight: 1.6, margin: 0, flex: 1 }}>
                In both models, the coach — the executive — makes every call. The preparation eliminates the mobilization delay. The authority remains with the human who holds it.
                <strong style={{ color: GOLD }}> AI monitors. Executives authorize. Execution pre-staged.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Phase Deep-Dives */}
        {phases.map((phase, i) => {
          const Icon = phase.icon;
          const isEven = i % 2 === 0;
          const phaseColorMap = {
            'IDENTIFY': "#2B8A6E",
            'DETECT': "#0A0F2E",
            'EXECUTE': "#C9A84C",
            'ADVANCE': "#2B8A6E"
          };
          const accentColor = (phaseColorMap as any)[phase.name] || (isEven ? NAVY : TEAL);

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
                      style={{ fontSize: 80, color: accentColor }}
                    >
                      {phase.letter}
                    </div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                      {phase.name}
                    </div>
                    <p className="text-sm font-medium text-[#374151] leading-snug mb-4">
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
                      <div className="font-serif text-3xl font-bold" style={{ color: accentColor }}>
                        {phase.metric.value}
                      </div>
                      <div className="text-xs text-[#6B7280] font-medium mt-0.5">{phase.metric.label}</div>
                    </div>
                  </div>

                  {/* Right — description + two columns */}
                  <div className="flex-1">
                    <p className="text-base text-[#4B5563] leading-relaxed mb-8">
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
                            <li key={j} className="flex items-start gap-2.5 text-sm text-[#374151]">
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
                            <li key={j} className="flex items-start gap-2.5 text-sm text-[#374151]">
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

        {/* NFL Coaching Analogy */}
        <section style={{ background: OFF, borderTop: `3px solid ${GOLD}` }} className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-0.5" style={{ background: GOLD }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>The Operating Model — In Plain Language</span>
              <div className="w-6 h-0.5" style={{ background: GOLD }} />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-2 leading-snug" style={{ color: NAVY }}>
              Think of It Like NFL Coaching.
            </h2>
            <p className="text-center text-sm mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: MUTED }}>
              Great coaches don't improvise under pressure — they call the play they already built. The IDEA Framework works the same way.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  phase: "IDENTIFY",
                  sport: "Game Planning",
                  icon: "🏈",
                  sportDesc: "Before the season, coaches catalog every situation they may face. Plays are built before any opponent is studied.",
                  execDesc: "Executives define every strategic trigger across 9 domains. All 170 playbooks are pre-built before any trigger fires.",
                  color: TEAL,
                },
                {
                  phase: "DETECT",
                  sport: "Reading the Field",
                  icon: "📡",
                  sportDesc: "The offense reads the defense formation in real time. Data points align. The situation is now — not hypothetical.",
                  execDesc: "248+ live data points monitored continuously. When signals align, the trigger surfaces in seconds — AI reads the field.",
                  color: GOLD,
                },
                {
                  phase: "EXECUTE",
                  sport: "The Play Call",
                  icon: "⚡",
                  sportDesc: "Under 40 seconds. The coach calls the play. Everyone knows their assignment. No committee. Preparation did the work.",
                  execDesc: "Executive authorizes. 12 minutes later, the full organizational response is coordinated. Every role already pre-defined.",
                  color: NAVY,
                },
                {
                  phase: "ADVANCE",
                  sport: "Film Study",
                  icon: "📊",
                  sportDesc: "After every game, coaches review what worked and update the playbook. The system learns and improves continuously.",
                  execDesc: "Every execution feeds the intelligence loop. The system strengthens with each activation — permanently.",
                  color: TEAL,
                },
              ].map(({ phase, sport, icon, sportDesc, execDesc, color }) => (
                <div key={phase} className="border bg-white p-5" style={{ borderTop: `3px solid ${color}`, borderColor: BORDER }}>
                  <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color }}>{phase}</div>
                  <div className="text-lg mb-3">{icon} <span className="font-semibold text-sm" style={{ color: NAVY }}>{sport}</span></div>
                  <div className="text-xs leading-relaxed mb-3 pb-3" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>{sportDesc}</div>
                  <div className="text-xs leading-relaxed font-medium" style={{ color: NAVY }}>{execDesc}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs mt-8 italic" style={{ color: MUTED }}>
              The preparation compresses the mobilization cycle. The decision remains human. No playbook activates without executive sign-off.
            </p>
          </div>
        </section>

        {/* Compound Execution Flywheel */}
        <section style={{ background: "#F8F7F4" }} className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-0.5" style={{ background: GOLD }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                  The Compounding Advantage
                </span>
                <div className="w-6 h-0.5" style={{ background: GOLD }} />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold leading-snug" style={{ color: NAVY }}>
                Every activation makes the next one faster.
              </h2>
              <p className="mt-4 text-base leading-relaxed max-w-2xl mx-auto" style={{ color: MUTED }}>
                The IDEA loop is not linear — it's a flywheel. ADVANCE feeds IDENTIFY with institutional memory. IDENTIFY feeds DETECT with sharper pattern libraries. DETECT feeds EXECUTE with faster trigger matching. Each cycle compresses the next response.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border rounded-sm overflow-hidden" style={{ borderColor: "#E8E4DC" }}>
              {[
                { phase: "ADVANCE", color: GOLD, arrow: true, body: "AI generates the post-activation debrief. Playbooks self-update. Every execution writes institutional memory forward.", metric: "↑ Institutional IQ" },
                { phase: "IDENTIFY", color: TEAL, arrow: true, body: "Updated playbooks sharpen positioning. The next trigger finds a better-staged, more precisely scoped response.", metric: "↑ Pre-staged precision" },
                { phase: "DETECT", color: GOLD, arrow: true, body: "Signal pattern library grows with each activation. False positives fall. Trigger confidence scores rise.", metric: "↑ Detection accuracy" },
                { phase: "EXECUTE", color: TEAL, arrow: false, body: "Faster matching, cleaner role distribution, earlier clock start. The 12-minute window tightens with each cycle.", metric: "↓ Mobilization time" },
              ].map(({ phase, color, arrow, body, metric }) => (
                <div key={phase} className="p-6 border-r last:border-r-0 relative bg-white" style={{ borderColor: "#E8E4DC", borderTop: `3px solid ${color}` }}>
                  {arrow && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-lg font-bold" style={{ color: GOLD }}>→</div>
                  )}
                  <div className="text-xs font-black tracking-widest uppercase mb-3" style={{ color }}>{phase}</div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#555" }}>{body}</p>
                  <div className="text-xs font-bold" style={{ color }}>{metric}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs mt-6 italic" style={{ color: MUTED }}>
              The loop closes back to ADVANCE — organizational execution intelligence compounds with every activation.
            </p>
          </div>
        </section>

        {/* Governing Principle — Executive Authority */}
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
            {/* Live IDEA Phase Confidence Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { phase: "IDENTIFY", score: 98, status: "170 playbooks staged", icon: Eye },
                { phase: "DETECT", score: 94, status: "221 triggers live", icon: Activity },
                { phase: "EXECUTE", score: 99, status: "12-min deployment ready", icon: Zap },
                { phase: "ADVANCE", score: 91, status: "Learning loop active", icon: TrendingUp },
              ].map(({ phase, score, status, icon: Icon }) => (
                <div key={phase} className="rounded-none border border-white/10 bg-white/5 p-4 text-center">
                  <Icon className="h-4 w-4 mx-auto mb-2" style={{ color: GOLD }} />
                  <div className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1">{phase}</div>
                  <div className="text-3xl font-bold mb-1" style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>{score}%</div>
                  <div className="text-[9px] text-white/40 uppercase tracking-widest">{status}</div>
                </div>
              ))}
            </div>

            {/* System Status Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10 p-4 bg-white/5 border border-white/10 rounded-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2B8A6E] animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-white/60">248+ Data Points Monitored</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Wifi className="w-3 h-3" style={{ color: TEAL_LT }} />
                <span className="text-[10px] uppercase tracking-widest text-white/60">8 Enterprise Systems Connected</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3" style={{ color: GOLD }} />
                <span className="text-[10px] uppercase tracking-widest text-white/60">AI Agents Running Continuously</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" style={{ color: GOLD_LT }} />
                <span className="text-[10px] uppercase tracking-widest text-white/60">Human Executive Approves Every Action</span>
              </div>
            </div>

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
                  style={{ background: "#C9A84C", color: "#0A0F2E" }}
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
