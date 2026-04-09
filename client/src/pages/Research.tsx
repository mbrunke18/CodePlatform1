import PageLayout from "@/components/layout/PageLayout";
import GartnerStackDiagram from "@/components/GartnerStackDiagram";
import { Button } from "@/components/ui/button";
import gartnerAIStack from "@/assets/gartner-ai-stack-2026.png";
import { 
  ArrowRight, 
  Clock, 
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Shield,
  Users,
  Zap,
  Building2,
  CheckCircle2,
  Cpu,
  Layers,
} from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

export default function Research() {
  useEffect(() => {
    updatePageMetadata({
      title: "Research Behind Readiness OS | Crisis Response Statistics & Industry Data",
      description: "Readiness OS was built on a foundation of industry research from McKinsey, PwC, IBM, and Ponemon Institute. See the data that proves faster response saves millions.",
      ogTitle: "The Research Behind Readiness OS - Industry Data & Statistics",
      ogDescription: "IBM, McKinsey, PwC research proves the cost of slow response. See how Readiness OS compresses 30 days to 12 minutes.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-white text-foreground">
        {/* Hero Section */}
        <section style={{ background: "#F8F7F4", borderBottom: "1px solid #E8E4DC", padding: "64px 48px", minHeight: 260 }}>
          <div className="max-w-5xl mx-auto text-center">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Research & Intelligence</span>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
            </div>
            
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#0A0F2E", marginBottom: 16 }}>
              The Research Behind <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Readiness OS</em>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: NAVY }}>
              Readiness OS was built on a foundation of industry research and 20+ years of Fortune 500 
              operational experience. Here's the data that shaped our platform.
            </p>
          </div>
        </section>

        {/* The Problem Is Well-Documented */}
        <section className="py-16 px-12 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E", marginBottom: 12 }}>
                The Problem is Well-Documented
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Leading institutions have quantified the cost of slow, uncoordinated response. 
                Readiness OS was designed to solve these exact challenges.
              </p>
            </div>

            {/* Response Time Section */}
            <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", padding: "20px 24px", background: "#fff" }} className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Response Time</h3>
                  <p className="text-muted-foreground">
                    McKinsey's crisis response framework focuses on "the first 72 hours" as the 
                    critical window for organizational response. Most companies struggle to get 
                    aligned within this timeframe.
                  </p>
                </div>
              </div>
              
              <div style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }} className="p-6 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-center">
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>30 days</div>
                    <p className="text-sm text-muted-foreground">Traditional mobilization baseline</p>
                    <p className="text-xs text-muted-foreground mt-1">just to align stakeholders before execution begins</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <ArrowRight className="h-8 w-8" style={{ color: NAVY }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1, textTransform: 'uppercase' }}>3,600× Head Start</span>
                  </div>
                  <div className="text-center">
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 600, color: TEAL, lineHeight: 1 }}>12 min</div>
                    <p className="text-sm text-muted-foreground">Readiness OS activation</p>
                    <p className="text-xs text-muted-foreground mt-1">playbooks pre-staged before the trigger fires</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Source: McKinsey & Company — Crisis Response Framework · MGI "Skill Partnerships in the Age of AI" (Nov 2025): 77% of executives cite mobilization speed as their primary execution barrier
              </p>
            </div>

            {/* Disruption Frequency Section */}
            <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", padding: "20px 24px", background: "#fff" }} className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Disruption is Constant</h3>
                  <p className="text-muted-foreground">
                    PwC's 2023 Global Crisis Survey found that 91% of organizations have experienced 
                    at least one major disruption beyond the pandemic, with companies averaging 3.5 
                    significant disruptions every two years.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>91%</div>
                  <p className="text-xs text-muted-foreground">Experienced major disruption</p>
                </div>
                <div className="text-center p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>3.5</div>
                  <p className="text-xs text-muted-foreground">Disruptions per 2 years</p>
                </div>
                <div className="text-center p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>89%</div>
                  <p className="text-xs text-muted-foreground">Prioritize resilience</p>
                </div>
                <div className="text-center p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>70%</div>
                  <p className="text-xs text-muted-foreground">Report significant impact</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Source: PwC Global Crisis and Resilience Survey 2023 — 1,812 organizations, 42 countries
              </p>
            </div>

            {/* Speed Saves Money Section */}
            <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #2B8A6E", padding: "20px 24px", background: "#fff" }} className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Speed Saves Money</h3>
                  <p className="text-muted-foreground">
                    IBM's 2024 Cost of Data Breach study proves what we've seen in practice: faster 
                    response = lower costs. Readiness OS provides all of these capabilities in a single platform.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: TEAL }} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: TEAL, lineHeight: 1 }}>$1.76M</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Saved by containing incidents within 30 days</p>
                </div>
                <div className="p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: TEAL }} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: TEAL, lineHeight: 1 }}>35%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Cost reduction with pre-defined response teams</p>
                </div>
                <div className="p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: TEAL }} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: TEAL, lineHeight: 1 }}>$2.2M</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Saved per incident with automation</p>
                </div>
                <div className="p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: TEAL }} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: TEAL, lineHeight: 1 }}>98 days</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Faster response with AI-powered tools</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Source: IBM/Ponemon Institute — Cost of a Data Breach Report 2024 — 604 organizations studied
              </p>
            </div>

            {/* HBR Section */}
            <div style={{ border: "1px solid #fecaca", borderLeft: "3px solid #dc2626", padding: "20px 24px", background: "#fff" }} className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div style={{ width: 32, height: 32, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-foreground">AI Intensifies Work Without an Operating Model</h3>
                    <span style={{ background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "2px 8px" }}>HBR · Feb 2026</span>
                  </div>
                  <p className="text-muted-foreground">
                    Harvard Business Review's 8-month study of a 200-person enterprise found AI expanded workloads — not reduced them. The solution is not a better model. It is a pre-staged operating model that governs AI at scale.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="p-4" style={{ background: "#FEF2F2", border: "1px solid #fecaca" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#dc2626", lineHeight: 1 }}>+47%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Expansion in individual task scope after AI deployment — work grew, not shrank</p>
                </div>
                <div className="p-4" style={{ background: "#FEF2F2", border: "1px solid #fecaca" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#dc2626", lineHeight: 1 }}>+32%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Increase in multitasking and context-switching as AI surfaced more decisions simultaneously</p>
                </div>
                <div className="p-4" style={{ background: "#FEF2F2", border: "1px solid #fecaca" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#dc2626", lineHeight: 1 }}>Blurred</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Role boundaries across all 200 participants — AI created coordination gaps faster than teams could close them</p>
                </div>
              </div>

              <div style={{ background: "#FEF2F2", border: "1px solid #fecaca", padding: "14px 18px", marginBottom: 12 }}>
                <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>The HBR Prescription — and what Readiness OS delivers:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  "Organizations need an AI practice at the enterprise coordination layer — pre-staged playbooks, decision gates, and sequenced execution with executive sign-off." That is precisely the architecture of Readiness OS: 170 playbooks pre-staged, 221 triggers monitored, and no action taken without executive authorization.
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Source: Harvard Business Review — "How AI Changes Work" · Feb 2026 · 8-month study · 200-person enterprise
              </p>
            </div>
          </div>
        </section>

        {/* Industry-Specific Data */}
        <section style={{ background: "#F8F7F4", padding: "64px 48px" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E", marginBottom: 12 }}>
                Industry-Specific Impact
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The stakes are even higher in regulated industries where compliance, reputation, 
                and customer trust are on the line.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Financial Services */}
              <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #0A0F2E", padding: "20px 24px", background: "#fff" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 40, height: 40, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">Financial Services</h3>
                    <p className="text-sm text-muted-foreground">Higher Stakes, Higher Costs</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="p-3" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>$6.08M</div>
                    <p className="text-[10px] text-muted-foreground">Avg breach cost</p>
                  </div>
                  <div className="p-3" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>168</div>
                    <p className="text-[10px] text-muted-foreground">Days to identify</p>
                  </div>
                  <div className="p-3" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>51</div>
                    <p className="text-[10px] text-muted-foreground">Days to contain</p>
                  </div>
                </div>
                
                <div className="p-4 mb-4" style={{ background: "rgba(10,15,46,0.05)", border: "1px solid rgba(10,15,46,0.1)" }}>
                  <p className="text-sm text-foreground font-medium">
                    22% above global average cost. Readiness OS cuts this timeline to minutes.
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Source: IBM Cost of Data Breach 2024 - Financial Industry
                </p>
              </div>

              {/* Healthcare */}
              <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #0A0F2E", padding: "20px 24px", background: "#fff" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 40, height: 40, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">Healthcare</h3>
                    <p className="text-sm text-muted-foreground">The Costliest Industry</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="p-3" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>$9.77M</div>
                    <p className="text-[10px] text-muted-foreground">Avg breach cost</p>
                  </div>
                  <div className="p-3" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>213</div>
                    <p className="text-[10px] text-muted-foreground">Days to discover</p>
                  </div>
                  <div className="p-3" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>14</div>
                    <p className="text-[10px] text-muted-foreground">Years as #1</p>
                  </div>
                </div>
                
                <div className="p-4 mb-4" style={{ background: "rgba(10,15,46,0.05)", border: "1px solid rgba(10,15,46,0.1)" }}>
                  <p className="text-sm text-foreground font-medium">
                    Highest regulatory scrutiny of any industry. Readiness OS ensures you're ready before the next incident.
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Source: IBM Cost of Data Breach 2024
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Business Agility Research */}
        <section className="py-16 px-12 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E", marginBottom: 12 }}>
                Business Agility is No Longer Optional
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Business Agility Institute research proves that organizations with stronger agility 
                capabilities significantly outperform their peers—especially under pressure.
              </p>
            </div>

            <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", padding: "20px 24px", background: "#fff" }} className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Agility Drives Revenue</h3>
                  <p className="text-muted-foreground">
                    Organizations that measurably improved their business agility saw dramatically 
                    higher financial performance compared to those that didn't prioritize adaptability.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>10.3%</div>
                  <p className="text-sm text-muted-foreground">Revenue increase per employee for agile organizations</p>
                </div>
                <div className="text-center p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>3x</div>
                  <p className="text-sm text-muted-foreground">Better performance vs non-agile peers (3.5% increase)</p>
                </div>
                <div className="text-center p-4" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>5.4</div>
                  <p className="text-sm text-muted-foreground">Global agility maturity rating (resilient despite headwinds)</p>
                </div>
              </div>

              <div className="p-4 mb-4" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.1)" }}>
                <p className="text-sm text-foreground font-medium italic">
                  "AI does not create an advantage on its own. It amplifies the organization in which 
                  it is embedded. In companies with strong business agility, AI accelerates learning, 
                  innovation, and value creation. In those without it, AI exposes structural friction, 
                  leadership gaps, and brittle decision systems at speed."
                </p>
                <p className="text-xs text-muted-foreground mt-2">— Ahmed Sidky, President, Business Agility Institute</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Source: Business Agility Institute — Business Agility Report
              </p>
            </div>

            {/* Gartner AI Stack Section */}
            <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", padding: "20px 24px", background: "#fff" }} className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">The Missing Layer in Every AI Stack</h3>
                  <p className="text-muted-foreground">
                    Gartner has catalogued nine layers of enterprise AI investment — from semiconductors and infrastructure all the way up to AI solutions and industry verticals. Every layer has vendors. Every layer has budget. But look at what is absent from the entire stack.
                  </p>
                </div>
              </div>

              <div className="mb-6 flex justify-center">
                <img
                  src={gartnerAIStack}
                  alt="Gartner AI Technology Stack 2026 — nine layers from AI infrastructure to AI solutions"
                  className="w-full max-w-xl border border-[#E8E4DC]"
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div className="p-4 mb-6" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)" }}>
                <p className="text-sm font-bold text-[#0A0F2E] mb-2 uppercase tracking-wider">What Gartner's stack doesn't show:</p>
                <p className="text-sm text-foreground leading-relaxed">
                  There is no layer for the operating model that <em>orchestrates</em> all of this technology into actual strategic execution. Enterprises have invested in every row of this diagram. None of them have the layer above it — the one that tells the organization what to do, when to do it, and how to move in 12 minutes when a trigger fires.
                </p>
              </div>

              {/* "The 10th Layer" positioning diagram */}
              <div className="my-8 py-6 px-2" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                <GartnerStackDiagram />
              </div>

              <div className="p-4 mb-4" style={{ background: "rgba(10,15,46,0.03)", border: "1px solid #E8E4DC" }}>
                <p className="text-sm text-foreground font-medium italic">
                  "Winning the AI vendor race isn't just about speed. Tech vendors must balance agility with clear direction, proactive risk management, and data-driven decisions."
                </p>
                <p className="text-xs text-muted-foreground mt-2">— Gartner, AI Vendor Race Research, 2026</p>
              </div>

              <p className="text-sm text-muted-foreground">
                Source: Gartner — AI Technology Stack &amp; AI Vendor Race Research, 2026
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-[#E8E4DC] bg-white p-6 hover:border-[#0A0F2E] transition-colors text-center">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-bold text-foreground mb-2">Balance Governance & Risk</h4>
                <p className="text-sm text-muted-foreground">
                  Give people autonomy while maintaining safeguards. Readiness OS' pre-approved resources do exactly this.
                </p>
              </div>
              <div className="border border-[#E8E4DC] bg-white p-6 hover:border-[#0A0F2E] transition-colors text-center">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Users className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-bold text-foreground mb-2">Empower with Accountability</h4>
                <p className="text-sm text-muted-foreground">
                  Clear task ownership with defined acceptance criteria. Readiness OS' playbooks assign both.
                </p>
              </div>
              <div className="border border-[#E8E4DC] bg-white p-6 hover:border-[#0A0F2E] transition-colors text-center">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-bold text-foreground mb-2">Fund Work Dynamically</h4>
                <p className="text-sm text-muted-foreground">
                  Shift resources to high-value activities without bureaucracy. Readiness OS unlocks pre-approved budgets instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How Readiness OS Addresses These Findings */}
        <section style={{ background: "#F8F7F4", padding: "64px 48px" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E", marginBottom: 12 }}>
                How Readiness OS Addresses These Findings
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every feature in Readiness OS was designed to address a specific research finding about 
                what makes organizations faster and more resilient.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E8E4DC] p-6 hover:border-[#0A0F2E] transition-colors">
                <div className="flex items-start gap-4">
                  <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Pre-Defined Response Teams</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      IBM found 35% cost reduction with pre-assigned teams. Readiness OS' playbooks 
                      include pre-assigned stakeholders for every scenario.
                    </p>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(0,0,0,0.05)", color:"#6B7280", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>170 Playbooks Ready</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E4DC] p-6 hover:border-[#0A0F2E] transition-colors">
                <div className="flex items-start gap-4">
                  <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Automated Orchestration</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      $2.2M saved per incident with automation. Readiness OS auto-creates Jira projects, 
                      notifies via Slack, and orchestrates execution.
                    </p>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(0,0,0,0.05)", color:"#6B7280", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>Enterprise Integrations</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E4DC] p-6 hover:border-[#0A0F2E] transition-colors">
                <div className="flex items-start gap-4">
                  <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Faster Containment</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      $1.76M saved by containing within 30 days. Readiness OS' pre-staged playbooks 
                      get your organization into live execution in minutes — roles assigned, tasks staged, teams already moving.
                    </p>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(0,0,0,0.05)", color:"#6B7280", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>12-Minute Activation</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E4DC] p-6 hover:border-[#0A0F2E] transition-colors">
                <div className="flex items-start gap-4">
                  <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">AI-Powered Detection</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      98 days faster with AI. Readiness OS' continuous monitoring detects weak signals 
                      before they become crises.
                    </p>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(0,0,0,0.05)", color:"#6B7280", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>24/7 Monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Reality Callout */}
        <section style={{ background: "#F8F7F4", padding: "64px 48px", borderTop: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 2, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#6B7280" }}>The Research → Reality Gap</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(24px,3.5vw,36px)", color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
                Every firm cited on this page agrees the problem is real.<br />
                <em style={{ color: GOLD, fontStyle: "italic" }}>None of them built the solution.</em>
              </h2>
              <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, marginBottom: 24 }}>
                McKinsey, HBR, Gartner, PwC, IBM — the research is irrefutable. The mobilization gap exists. The 30-day response cycle costs Fortune 1000 enterprises $847B in strategic spend annually. The consultants named the problem. The framework sellers sold approaches. Nobody built the coordination infrastructure.
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, lineHeight: 1.5 }}>
                Readiness OS is the only platform that turns this research into a timestamp on a deployed playbook.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
              {[
                { firm: "McKinsey & Company", claim: "Named the execution gap. Sold the engagement.", result: "Same 30-day mobilization cycle — with a custom PDF." },
                { firm: "Harvard Business Review", claim: "Proved AI intensifies work without an operating model.", result: "Published the insight. Didn't build the operating model." },
                { firm: "Gartner Research", claim: "Cited organizational readiness as the #1 AI barrier.", result: "Framework provided. Infrastructure not included." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "20px", background: "#fff", border: "1px solid #E8E4DC" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 6 }}>{item.firm}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{item.claim}</div>
                  <div style={{ fontSize: 12, color: "#DC2626", fontStyle: "italic" }}>{item.result}</div>
                </div>
              ))}
              <div style={{ padding: "16px 20px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 4 }}>Readiness OS</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F0EDE4" }}>Shipped the infrastructure.</div>
                </div>
                <Link href="/platform-reality">
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: GOLD, cursor: "pointer", whiteSpace: "nowrap" as const }}>See how →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Enterprise AI Landscape - converted to Navy CTA style */}
        <section style={{ background: "#0A0F2E", padding: "64px 48px" }}>
          <div className="max-w-5xl mx-auto text-center">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>2026 Research Landscape</span>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            </div>
            
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#fff", marginBottom: 16 }}>
              The 2026 Enterprise AI Inflection Point
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Experience the research-backed speed of Readiness OS today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/try-demo">
                <Button
                  size="lg"
                  className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8"
                >
                  Try Interactive Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="border border-white/20 text-white/60 bg-transparent hover:bg-white/10 px-8"
                >
                  Request Pilot Access
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
