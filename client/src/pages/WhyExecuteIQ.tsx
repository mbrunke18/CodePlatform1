import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Quote, 
  Lightbulb, 
  Target, 
  Clock, 
  CheckCircle2,
  XCircle,
  Zap,
  BookOpen,
  Radio,
  Shield,
  Users,
  Brain,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Globe2,
  Play,
  Building2,
  Timer,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function WhyExecutionOS() {
  useEffect(() => {
    updatePageMetadata({
      title: "Why Readiness OS - The Infrastructure 15 Firms Say Is Missing",
      description: "McKinsey, IBM, BCG, Deloitte, Accenture, Microsoft, Google Cloud, and the World Economic Forum all concluded: organizations fail at AI because they lack execution infrastructure. Readiness OS provides it.",
      ogTitle: "The Infrastructure 15 Firms Say Is Missing | Readiness OS",
      ogDescription: "Fifteen major firms independently concluded that execution infrastructure—governance, decision rights, and coordination systems—is the missing layer for AI adoption.",
    });
  }, []);

  return (
    <PageLayout>
      <PageHero
        eyebrow="2026 Research Consensus"
        title="The Infrastructure 15 Firms Say Is Missing"
        subtitle="McKinsey. IBM. BCG. Deloitte. Accenture. Microsoft. Google Cloud. WEF. Bain. Anthropic. OpenAI. PwC. Gartner. Forrester. IDC. Fifteen firms, one conclusion: enterprises need execution infrastructure."
        size="lg"
        actions={<>
          <Link href="/try-demo">
            <Button size="lg" style={{ background: "#C9A84C", color: "#0A0F2E", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px", border: "none" }}>
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </Link>
          <Link href="/research">
            <Button size="lg" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff", background: "transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px" }}>
              View Research
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </>}
      />

      {/* Quick Stats Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: "#F8F7F4", borderBottom: "1px solid #E8E4DC" }}>
        <div style={{ padding: 32, borderRight: "1px solid #E8E4DC", textAlign: "center" }}>
          <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>15</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Major Firms Agree</div>
        </div>
        <div style={{ padding: 32, borderRight: "1px solid #E8E4DC", textAlign: "center" }}>
          <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>170</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Pre-Built Playbooks</div>
        </div>
        <div style={{ padding: 32, textAlign: "center" }}>
          <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>12m</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Trigger-to-Execution</div>
        </div>
      </div>

      {/* The Core Claim */}
      <div style={{ background: "#fff", padding: "80px 48px", borderBottom: "1px solid #E8E4DC" }}>
        <div className="max-w-4xl mx-auto text-center">
          <blockquote style={{ ...CG, fontSize: "clamp(28px,4vw,48px)", fontWeight: 500, fontStyle: "italic", lineHeight: 1.3, color: "#0A0F2E", marginBottom: 28 }}>
            "You can't automate what hasn't been made explicit."
          </blockquote>
          <div style={{ width: 48, height: 2, background: "#C9A84C", margin: "0 auto 28px" }} />
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 640, margin: "0 auto", lineHeight: 1.85 }}>
            AI doesn't transform your organization — it exposes it. Every fuzzy decision right, every undefined role, every coordination gap that slowed you down before AI will become a breaking point after. Readiness OS makes your coordination logic explicit, so AI has something real to act on.
          </p>
        </div>
      </div>

      {/* Section 1: The Consensus */}
      <section className="py-20 px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>The Consensus</span>
          </div>
          <h2 className="text-center mb-16" style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E" }}>
            What 15 Major Firms All Concluded
          </h2>

          <div className="border border-[#E8E4DC] bg-white p-12 text-center">
            <p className="text-xl text-[#0A0F2E] leading-relaxed mb-12 max-w-4xl mx-auto">
              From 2025 into 2026, fifteen major consulting and technology firms independently published research on AI adoption. They all arrived at the same conclusion: Organizations aren't failing at AI because of technology. They're failing because they lack execution infrastructure—governance, decision rights, and coordination systems.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {["McKinsey", "IBM", "BCG", "Deloitte", "Accenture", "Microsoft", "Google Cloud", "WEF", "Bain", "Anthropic", "OpenAI", "PwC", "Gartner", "Forrester", "IDC"].map((firm) => (
                <div key={firm} className="px-6 py-3 bg-[#F8F7F4] border border-[#E8E4DC]">
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0A0F2E" }}>{firm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Gap */}
      <section style={{ background: "#F8F7F4", padding: "80px 48px" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>The Gap</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E" }}>
              The Missing Infrastructure Layer
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #2B8A6E", padding: "40px", background: "#fff" }}>
              <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#0A0F2E", marginBottom: 24 }}>What Enterprises Have</h3>
              <ul className="space-y-4">
                {["AI Tools & Models", "Talented Teams", "Strategic Ambition"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#2B8A6E] shrink-0 mt-0.5" />
                    <span className="text-lg text-[#0A0F2E]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", padding: "40px", background: "#fff" }}>
              <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#0A0F2E", marginBottom: 24 }}>What They Lack</h3>
              <ul className="space-y-4">
                {["Pre-defined Governance", "Clear Decision Rights", "Coordination Systems"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <span className="text-lg text-[#0A0F2E]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ background: "#0A0F2E", padding: "48px", textAlign: "center" }}>
            <p style={{ ...CG, fontSize: 32, color: "#fff", marginBottom: 16 }}>
              Result: 30 days to mobilize what should take <em style={{ fontStyle: "italic", color: "#DFC178" }}>minutes</em>.
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>
              Without execution infrastructure, every strategic moment is handled ad-hoc—no matter how talented the team.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: The Solution */}
      <section className="py-20 px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "#2B8A6E", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#2B8A6E" }}>The Solution</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E" }}>
              Readiness OS Provides the Infrastructure
            </h2>
          </div>

          <div className="border border-[#E8E4DC] bg-[#F8F7F4] p-12 mb-12">
            <p className="text-xl text-[#0A0F2E] leading-relaxed mb-12">
              Readiness OS is the execution infrastructure layer: 170 playbooks with governance, decision rights, and workflows pre-defined. Customizable to your organization. Build your own for unique situations. 12 minutes from trigger to execution.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, val: "170", label: "Pre-built playbooks", color: "#0A0F2E" },
                { icon: Shield, val: "Built-in", label: "Governance", color: "#2B8A6E" },
                { icon: Target, val: "Custom", label: "Build your own", color: "#C9A84C" },
                { icon: Timer, val: "12 min", label: "Trigger-to-Execution", color: "#0A0F2E" }
              ].map((item, i) => (
                <div key={i} className="text-center p-6 bg-white border border-[#E8E4DC]">
                  <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: item.color, lineHeight: 1 }}>{item.val}</div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Section: The Readiness Coordination Layer */}
      <section style={{ background: "#0A0F2E", padding: "80px 48px" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>The Agentic Layer</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#fff", marginBottom: 16 }}>
              Agentic Readiness Infrastructure
            </h2>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              Readiness OS isn't another tool in the stack. It's the readiness coordination layer — where AI prepares and stages the enterprise response before the trigger fires, and executives authorize every action.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/5 border border-white/10 p-8">
              <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 24 }}>Workflow Tools</h3>
              <ul className="space-y-4">
                {[
                  "Route tickets based on static rules",
                  "Require manual escalation",
                  "No cross-functional coordination"
                ].map(text => (
                  <li key={text} className="flex items-start gap-3 text-white/60">
                    <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 p-8">
              <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#DFC178", marginBottom: 24 }}>AI-Coordinated Execution</h3>
              <ul className="space-y-4">
                {[
                  "Agents detect signals and activate playbooks",
                  "Pre-authorized decisions within thresholds",
                  "Cross-enterprise coordination in 12 minutes"
                ].map(text => (
                  <li key={text} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2 className="h-5 w-5 text-[#3BAF8A] shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Founder Story */}
      <section className="py-20 px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>The Founder</span>
          </div>
          <h2 className="text-center mb-16" style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E" }}>
            Built by Someone Who Lived the Problem
          </h2>

          <div className="border border-[#E8E4DC] p-12 bg-white relative">
            <Quote className="absolute top-8 left-8 h-12 w-12 text-[#E8E4DC]" />
            <div className="relative z-10">
              <blockquote style={{ ...CG, fontSize: 24, fontWeight: 500, color: "#0A0F2E", lineHeight: 1.5, fontStyle: "italic", marginBottom: 32 }}>
                "I coached college football for 5 years. Every 40 seconds—read the situation, call the play, execute. Then I spent 20 years inside Fortune 500 companies. Same caliber of people. No playbooks. Every strategic moment handled ad-hoc. I built the infrastructure I wish I'd had."
              </blockquote>
              <div className="flex items-center gap-4">
                <div style={{ width: 48, height: 48, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", color: "#DFC178", fontWeight: 700 }}>MB</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0A0F2E" }}>Martin Brunke</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>Founder & CEO, Readiness OS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: "#0A0F2E", padding: "80px 48px", textAlign: "center" }}>
        <h2 style={{ ...CG, fontSize: 40, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Ready to See the Infrastructure?</h2>
        <p className="text-white/60 mb-8 max-w-xl mx-auto">See how Readiness OS closes the gap between AI investment and AI results.</p>
        <div className="flex justify-center gap-4">
          <Link href="/demo-selector">
            <Button style={{ background: "#C9A84C", color: "#0A0F2E", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px", border: "none" }}>
              <Play className="mr-2 h-4 w-4" /> Watch Demo
            </Button>
          </Link>
          <Link href="/contact">
            <Button style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff", background: "transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px" }}>
              Contact Sales
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
