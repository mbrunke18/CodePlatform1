import PageLayout from '@/components/layout/PageLayout';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Radio, 
  CheckCircle, 
  BookOpen,
  ArrowRight,
  Clock,
  Zap,
  Brain,
  Users,
  Shield,
  TrendingUp,
  Play,
  Check
} from "lucide-react";
import { useLocation, Link } from "wouter";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function HowItWorks() {
  const [, setLocation] = useLocation();

  const phases = [
    {
      number: "I",
      name: "IDENTIFY",
      moduleName: "Playbook™",
      tagline: "Infrastructure Built in Advance",
      icon: Target,
      color: "#2B8A6E",
      description: "170 playbooks across 9 strategic domains. Governance defined. Decision rights mapped. Roles assigned. All before the situation hits. This is what McKinsey means by 'real-time, embedded governance.' It's ready before you need it.",
      capabilities: [
        "170 pre-built playbooks across 9 strategic domains",
        "Decision rights mapped and roles assigned in advance",
        "Stakeholders, approval chains, and resources locked",
        "Real-time, embedded governance ready to activate"
      ],
      outcome: "Your execution infrastructure is built, tested, and ready—before the moment arrives."
    },
    {
      number: "D",
      name: "DETECT",
      moduleName: "Signal™",
      tagline: "Situation Triggers Response",
      icon: Radio,
      color: "#0A0F2E",
      description: "A strategic moment hits—M&A, crisis, competitive threat. The infrastructure activates. The right playbook engages based on situational awareness. No meetings to figure out what to do. The infrastructure already knows.",
      capabilities: [
        "Strategic moments detected instantly—M&A, crisis, threats",
        "Infrastructure activates automatically on situational awareness",
        "The right playbook engages without meetings or manual triage",
        "Configurable triggers ensure response to what matters"
      ],
      outcome: "When a situation hits, the infrastructure already knows what to do—no scrambling required."
    },
    {
      number: "E",
      name: "EXECUTE",
      moduleName: "Compass™",
      tagline: "Coordination in 12 Minutes",
      icon: CheckCircle,
      color: "#2B8A6E",
      description: "Stakeholders notified. Tasks assigned with owners. Decision rights clear. Execution begins—not planning, execution. This is the operating model IBM says 78% of executives know they need.",
      capabilities: [
        "Stakeholders notified and tasks assigned in minutes",
        "Decision rights are clear—no ambiguity, no bottlenecks",
        "Execution begins immediately—not planning, execution",
        "The operating model 78% of executives know they need"
      ],
      outcome: "Coordinated execution in 12 minutes—not 6-8 weeks of planning and alignment."
    },
    {
      number: "A",
      name: "ADVANCE",
      moduleName: "Retrospect™",
      tagline: "Infrastructure Gets Smarter",
      icon: BookOpen,
      color: "#C9A84C",
      description: "Every execution generates proprietary intelligence. AI analyzes outcomes, detects patterns across playbooks, benchmarks against industry standards, and refines your infrastructure automatically.",
      capabilities: [
        "Every execution generates actionable performance data",
        "AI-powered pattern detection identifies what worked and why",
        "Cross-playbook learning transfers insights across domains",
        "Outcome benchmarking scores each execution vs industry"
      ],
      outcome: "Your execution data becomes your competitive moat—each activation makes the entire infrastructure smarter."
    }
  ];

  return (
    <PageLayout>
      <PageHero
        eyebrow="The IDEA Framework™"
        title="From Situation to Execution in 12 Minutes"
        subtitle="In a world where disruptions compound and cascade across domains simultaneously, the only advantage is execution infrastructure built before the moment arrives."
        size="lg"
      />

      {/* Phase Navigation / Summary Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#F8F7F4", borderBottom: "1px solid #E8E4DC" }}>
        {phases.map((phase, i) => (
          <div key={phase.name} style={{ padding: 24, borderRight: i < 3 ? "1px solid #E8E4DC" : "none", textAlign: "center" }}>
            <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <phase.icon className="h-4 w-4 text-white" />
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0A0F2E" }}>{phase.name}</div>
          </div>
        ))}
      </div>

      {/* Phase Details - Alternating Backgrounds */}
      {phases.map((phase, index) => (
        <section key={phase.name} style={{ background: index % 2 === 1 ? "#F8F7F4" : "#fff", padding: "100px 48px" }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 24, height: 1, background: phase.color }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: phase.color }}>Phase {phase.number}: {phase.name}</span>
                </div>
                <h2 style={{ ...CG, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: "#0A0F2E", marginBottom: 16 }}>{phase.tagline}</h2>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0A0F2E", color: "#DFC178", padding: "4px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>
                   {phase.moduleName}
                </div>
                <p className="text-xl text-[#6B7280] leading-relaxed mb-8">{phase.description}</p>
                
                <div className="space-y-4 mb-10">
                  {phase.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#2B8A6E] shrink-0 mt-0.5" />
                      <span className="text-[#0A0F2E]">{cap}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderLeft: `3px solid ${phase.color}`, paddingLeft: 24, background: index % 2 === 1 ? "#fff" : "#F8F7F4", padding: 24 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: phase.color, marginBottom: 8 }}>Impact Outcome</div>
                  <p className="font-medium text-[#0A0F2E]">{phase.outcome}</p>
                </div>
              </div>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                 <div style={{ width: "100%", aspectRatio: "4/3", background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(#DFC178 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <phase.icon className="h-24 w-24 text-[#DFC178] opacity-20" />
                 </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* 12-Minute Timeline Breakdown */}
      <section style={{ background: "#0A0F2E", padding: "100px 48px" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "#DFC178", flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#DFC178" }}>The 12-Minute Proof Point</span>
            </div>
            <h2 style={{ ...CG, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: "#fff" }}>From Trigger to Coordinated Execution</h2>
          </div>

          <div className="relative">
            <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.1)" }} />
            {[
              { time: "0:00", label: "Trigger Detected", desc: "AI signal or human activation identifies a strategic moment — M&A announcement, cyber breach, competitive threat." },
              { time: "1:00", label: "Stakeholder Notification", desc: "All relevant stakeholders receive coordinated notifications via Slack, Teams, or email instantly." },
              { time: "5:00", label: "Tasks Assigned", desc: "Every task has a named owner, a deadline, and a decision-rights framework. No ambiguity." },
              { time: "12:00", label: "Full Coordinated Execution", desc: "All workstreams active. Cross-functional teams executing in parallel. Real-time tracking across every task." }
            ].map((step, i) => (
              <div key={i} className="relative pl-12 pb-16 last:pb-0">
                <div style={{ position: "absolute", left: 4, top: 8, width: 8, height: 8, background: "#DFC178", borderRadius: "50%" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                   <span style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#DFC178" }}>{step.time}</span>
                   <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>{step.label}</span>
                </div>
                <p className="text-white/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: "#fff", padding: "100px 48px", textAlign: "center" }}>
        <h2 style={{ ...CG, fontSize: 40, fontWeight: 600, color: "#0A0F2E", marginBottom: 16 }}>Ready to See the Framework in Action?</h2>
        <p className="text-[#6B7280] mb-8 max-w-xl mx-auto">Explore our pre-built playbooks or launch a live activation demo today.</p>
        <div className="flex justify-center gap-4">
          <Link href="/demo-selector">
            <Button style={{ background: "#0A0F2E", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px" }}>
              Watch Demo
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" style={{ border: "1.5px solid #0A0F2E", color: "#0A0F2E", background: "transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px" }}>
              Contact Sales
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
