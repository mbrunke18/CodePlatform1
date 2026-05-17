import { useEffect } from "react";
import { motion } from "framer-motion";
import { ExecutionGapDiagram } from "@/components/ExecutionGapDiagram";
import PageLayout from "@/components/layout/PageLayout";
import boardroomImg from "@/assets/images/investors-boardroom.png";
import { Button } from "@/components/ui/button";
import { updatePageMetadata } from "@/lib/seo";
import { 
  TrendingUp, Clock, Target, DollarSign, Users, Shield, 
  Zap, CheckCircle, ArrowRight, Building, 
  Award, Globe, Play, FileText, Calendar, ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { SubBrandLabel } from "@/components/SubBrandLabel";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

const scenarioComparisons = [
  {
    title: "Strategic Market Entry",
    icon: "🌏",
    industry: "Luxury & Fashion",
    type: "offense" as const,
    traditional: { time: "6-9 months", cost: "€280M opportunity lost" },
    execution: { time: "12 minutes", value: "First-mover advantage secured" },
    speedup: "3,600×",
    context: "Readiness Protocol activates the moment market signals confirm the window. Stakeholders aligned, budgets staged, comms drafted — before competitors react.",
  },
  {
    title: "Ransomware Attack",
    icon: "🔒",
    industry: "Financial Services",
    type: "defense" as const,
    traditional: { time: "30 days", cost: "$36.7M average impact" },
    execution: { time: "12 minutes", value: "$36M+ impact contained" },
    speedup: "3,600×",
    context: "The Readiness Protocol activates on detection. Containment steps, legal holds, regulator notifications, and board briefing all coordinate in parallel — not sequence.",
  },
  {
    title: "Critical Supplier Failure",
    icon: "🏭",
    industry: "Manufacturing",
    type: "defense" as const,
    traditional: { time: "4-5 days", cost: "$96M+ production impact" },
    execution: { time: "12 minutes", value: "Continuity protocols active" },
    speedup: "3,600×",
    context: "Alternate supplier lists, logistics rerouting, and customer communication templates are pre-staged in the Readiness Protocol and deploy the moment the signal triggers.",
  },
  {
    title: "M&A Day 1 Integration",
    icon: "🤝",
    industry: "Corporate Strategy",
    type: "offense" as const,
    traditional: { time: "90+ days", cost: "$180M synergy delay" },
    execution: { time: "12 minutes", value: "40% faster synergy capture" },
    speedup: "3,600×",
    context: "Integration Readiness Protocols are built pre-close. Day 1 launches with every stakeholder assigned, every workstream active, every communication sent simultaneously.",
  },
];

const metrics = [
  { 
    value: "5-10x", 
    label: "Operating Model Lift", 
    description: "Speed improvement in enterprises that redesigned their operating model — not just their tools",
    source: "McKinsey Operating Model Research",
    icon: Clock,
    color: `text-[${GOLD}]`
  },
  { 
    value: "$4.88M", 
    label: "Avg Breach Cost", 
    description: "What companies pay for slow response",
    source: "IBM Cost of a Data Breach 2024",
    icon: Shield,
    color: `text-[${NAVY}]`
  },
  { 
    value: "98 days", 
    label: "Saved with AI", 
    description: "Faster breach detection & containment",
    source: "IBM 2024 Report",
    icon: Zap,
    color: `text-[${TEAL}]`
  },
  { 
    value: "3.5x", 
    label: "Faster Response", 
    description: "Distributed vs centralized response teams",
    source: "PagerDuty 2024",
    icon: TrendingUp,
    color: `text-[${GOLD}]`
  },
];

const industryProblems = [
  {
    value: "70%",
    label: "Transformations Fail",
    description: "Digital transformation projects that don't meet objectives",
    source: "Bain & Company 2024",
    icon: Target,
  },
  {
    value: "75%",
    label: "M&A Deals Fail",
    description: "Mergers that fail to deliver expected value",
    source: "Fortune/NYU 2024",
    icon: DollarSign,
  },
  {
    value: "$2.3T",
    label: "Wasted Globally",
    description: "Cost of failed digital transformation efforts",
    source: "Taylor & Francis 2024",
    icon: Globe,
  },
  {
    value: "75%",
    label: "Activate Response Plans",
    description: "Organizations activated strategic plans in past 12 months",
    source: "BCI 2024",
    icon: Shield,
  },
];

const competitiveAdvantages = [
  {
    title: "18-Month Head Start",
    description: "170 pre-built Readiness Protocols across 9 strategic domains represent 18+ months of strategic planning already pre-staged for Fortune 1000 enterprises.",
    icon: Zap,
  },
  {
    title: "Executive Authority Preserved",
    description: "No Readiness Protocol activates without executive authorization. The system monitors, scores, and recommends. Humans decide. The preparation just means that decision takes seconds — not 30 days.",
    icon: Users,
  },
  {
    title: "Enterprise-Ready Platform",
    description: "Built for Fortune 1000 complexity with integrations to Jira, Slack, Salesforce, ServiceNow, and more.",
    icon: Building,
  },
  {
    title: "Research-Validated Approach",
    description: "Built on established frameworks from McKinsey, IBM, and Harvard Business Review research.",
    icon: Award,
  },
];

const milestones = [
  { phase: "Completed", items: ["170 Readiness Protocols across 9 domains", "IDEA Framework™ — full 4-phase implementation", "Live signal detection — 8 RSS sources, 221 triggers", "12-minute execution engine + war room infrastructure", "Enterprise integration architecture (Microsoft, Jira, ServiceNow, Slack)", "Interactive 12-Minute Test Drive demo platform"] },
  { phase: "Current — Founding Partner", items: ["Founding Partner Program now enrolling (90-day validation)", "Protocol Builder — custom protocol co-design with partners", "Signal detection refinement across 248+ data points", "Industry Protocol Packs — 6 verticals in development", "Enterprise partnership discussions underway"] },
  { phase: "Phase 2 — Authorized Automation", items: ["Authorized Automation layer within EXECUTE phase", "Dual-track execution: human workstreams + approved automations run in parallel", "Task execution modes: Human-only · Automation-only · Dual-track", "Policy gates per action — who authorizes, what systems, what limits", "Connectors: Jira, Asana, ServiceNow, Teams, Slack — automated ticket creation, war room setup, briefing distribution", "Full audit trail: every authorized automation logged, every override captured"] },
];

const researchCitations = [
  { id: 0, source: "Harvard Business Review", title: "AI Doesn't Reduce Work — It Intensifies It", year: "February 2026", finding: "8-month study of 200-person enterprise: AI tools don't reduce work, they consistently intensify it. Workers expanded scope, blurred work/life boundaries, and juggled more simultaneously — raising expectations for speed without reducing pressure. The fix: an 'AI practice' — intentional norms, decision gates, and sequenced phases. Readiness OS is that AI practice at the enterprise coordination layer." },
  { id: 1, source: "McKinsey & Company", title: "Enterprise Architecture Synthesis", year: "2025–2026", finding: "65% of enterprises still piloting AI — only 1% fully mature. Leaders, not employees, are the bottleneck. $4.4T AI productivity potential locked behind a missing coordination layer: the 'orchestration layer · coordination fabric · shared source of truth' Readiness OS provides." },
  { id: 2, source: "IBM/Ponemon Institute", title: "Cost of a Data Breach Report", year: "2024", finding: "Global average breach cost: $4.88M; AI/automation saves 98 days in breach lifecycle" },
  { id: 3, source: "PagerDuty", title: "State of Digital Operations", year: "2024", finding: "Distributed response management teams respond 3.5x faster than centralized teams" },
  { id: 4, source: "Bain & Company", title: "Digital Transformation Study", year: "2024", finding: "70-88% of digital transformations fail to meet their original objectives" },
  { id: 5, source: "Fortune/NYU Stern", title: "M&A Analysis (40,000 deals)", year: "2024", finding: "70-75% of M&A deals fail to deliver expected value" },
  { id: 6, source: "Taylor & Francis", title: "Global Transformation Research", year: "2024", finding: "$2.3 trillion wasted globally on failed digital transformation programs" },
  { id: 7, source: "Business Continuity Institute", title: "Resilience Report", year: "2024", finding: "75% of organizations activated strategic response plans in past 12 months" },
  { id: 8, source: "Gartner", title: "AI Technology Stack", year: "2026", finding: "Nine layers of enterprise AI investment mapped — from infrastructure to solutions — with no operating model layer identified to orchestrate execution. That gap is the market Readiness OS serves." },
  { id: 9, source: "BCG", title: "AI-First Org & Operating Model Study", year: "2026", finding: "95% of companies are piloting AI. Only 5% are capturing real value at scale. The difference is not the technology — it is the operating model. Becoming AI-first is 30% technology, 70% people and organization. Fortune 1000 client research across multiple industries." },
];

function PlatformArchitectureDiagram() {
  const steps = [
    {
      phase: "DETECT",
      label: "Signal Intelligence",
      sub: "20 categories · 248+ data points",
      items: ["Market shifts", "Competitive moves", "Regulatory changes", "Operational disruptions"],
      color: TEAL,
      bg: "#EBF5F1",
      border: `${TEAL}40`,
    },
    {
      phase: "IDENTIFY",
      label: "Signal Engine",
      sub: "Pattern-detection analysis",
      items: ["Threat synthesis", "Trigger matching", "Risk scoring", "Readiness Protocol recommendation"],
      color: NAVY,
      bg: "#EEF0F7",
      border: `${NAVY}40`,
    },
    {
      phase: "EXECUTE",
      label: "170 Readiness Protocols",
      sub: "9 strategic domains",
      items: ["Pre-staged tasks", "Role assignments", "Communication templates", "Decision trees"],
      color: GOLD,
      bg: "#FBF6E9",
      border: `${GOLD}60`,
    },
    {
      phase: "ADVANCE",
      label: "Coordinated Response",
      sub: "12-minute activation",
      items: ["Stakeholder alerts", "Task deployment", "Progress tracking", "Outcome capture"],
      color: TEAL,
      bg: "#EBF5F1",
      border: `${TEAL}40`,
    },
  ];

  return (
    <div className="bg-white border border-[#E8E4DC] p-8">
      <div className="grid grid-cols-4 gap-0 relative">
        {steps.map((step, i) => (
          <div key={i} className="flex items-stretch">
            <div className="flex-1 flex flex-col">
              <div
                className="rounded-none p-5 flex-1 border-2"
                style={{ background: step.bg, borderColor: step.border }}
              >
                <div
                  className="inline-block text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 mb-3"
                  style={{ background: step.color, color: "#fff" }}
                >
                  {step.phase}
                </div>
                <p className="font-bold text-[#0A0F2E] text-sm mb-0.5">{step.label}</p>
                <p className="text-[10px] font-semibold mb-3" style={{ color: step.color }}>{step.sub}</p>
                <ul className="space-y-1">
                  {step.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-1.5 text-[11px] text-[#0A0F2E]/60 font-medium">
                      <span className="w-1 h-1 flex-shrink-0" style={{ background: step.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center justify-center w-8 flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-[#C9A84C]" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-[#E8E4DC] flex items-center justify-between">
        <div className="flex items-center gap-6">
          {[
            { label: "Signal Categories", value: "20" },
            { label: "Data Points", value: "248+" },
            { label: "Readiness Protocols", value: "170" },
            { label: "Strategic Domains", value: "9" },
            { label: "Executive Triggers", value: "221" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-black" style={{ color: NAVY }}>{stat.value}</p>
              <p className="text-[9px] font-semibold text-[#6B7280] uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: GOLD }}>12 min</p>
          <p className="text-[9px] font-semibold text-[#6B7280] uppercase tracking-wider">Signal to Action</p>
        </div>
      </div>
    </div>
  );
}

function FuturePositioningDiagram() {
  return (
    <div className="bg-white border border-[#E8E4DC] p-8">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-none border-2 border-[#E8E4DC] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{ background: NAVY, transform: "translate(30%, -30%)" }} />
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 bg-[#0A0F2E]/10 text-[#0A0F2E]">
            <CheckCircle className="w-3 h-3" />
            Today — Selling Pain Relief
          </div>
          <h3 className="text-lg font-bold text-[#0A0F2E] mb-3">Readiness Infrastructure</h3>
          <p className="text-sm text-[#6B7280] font-medium mb-4">Immediate ROI: enterprises stop losing $36M+ on slow strategic response. The platform pays for itself on the first activation.</p>
          <ul className="space-y-2">
            {[
              "170 pre-built Readiness Protocols ready to deploy",
              "12 min to full execution — others spend weeks just to mobilize",
              "3,600× Execution Head Start while competitors still plan",
              "Human executives retain full decision authority",
              "Enterprise integrations (Jira, Slack, ServiceNow)",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#0A0F2E]/70 font-medium">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#2B8A6E]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-none border-2 p-6 relative overflow-hidden" style={{ borderColor: `${GOLD}60`, background: "#FBF8F0" }}>
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10" style={{ background: GOLD, transform: "translate(30%, -30%)" }} />
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4" style={{ background: `${GOLD}20`, color: GOLD }}>
            <Zap className="w-3 h-3" />
            Tomorrow — The AI Operating Layer
          </div>
          <h3 className="text-lg font-bold text-[#0A0F2E] mb-3">Authorized Automation + Strategic Intelligence Platform</h3>
          <p className="text-sm text-[#6B7280] font-medium mb-4">Phase 2 introduces Authorized Automation — a second execution track where policy-gated automations run in parallel with human teams. Executive authority preserved. No automation fires without pre-authorized policy gates.</p>
          <ul className="space-y-2">
            {[
              "Authorized Automation — approved automations parallel to human workstreams",
              "Dual-track EXECUTE phase: human teams + automated workflows simultaneously",
              "Policy gates per action — authorization scope, system limits, and override controls",
              "Continuous signal detection at scale across 248+ data points",
              "Institutional memory of every strategic decision and activation outcome",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#0A0F2E]/70 font-medium">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E8E4DC] pt-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-4">Competitive Moat Grows Over Time</p>
        <div className="flex items-center gap-0">
          {[
            { label: "Platform Built", sub: "170 Readiness Protocols, IDEA Framework", color: NAVY },
            { label: "Founding Partner Contracts", sub: "Design partners, real use cases", color: NAVY },
            { label: "Data Network Effect", sub: "Every activation improves the system", color: TEAL },
            { label: "Category Leader", sub: "Strategic Readiness Platform standard", color: GOLD },
          ].map((stage, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex-1">
                <div className="h-2 rounded-l-full" style={{ background: stage.color, borderRadius: i === 0 ? "9999px 0 0 9999px" : i === 3 ? "0 9999px 9999px 0" : "0" }} />
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-[#0A0F2E]">{stage.label}</p>
                  <p className="text-[10px] text-[#6B7280] font-medium">{stage.sub}</p>
                </div>
              </div>
              {i < 3 && <ArrowRight className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mx-1 -mt-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Investors() {
  useEffect(() => {
    updatePageMetadata({
      title: "Investor Overview — VaughnMartin Readiness OS",
      description: "The Strategic Readiness Platform for Fortune 1000. 3,600× Execution Head Start. 30 days compressed to 12 minutes. Category-defining opportunity in enterprise operating infrastructure.",
      ogTitle: "Investor Overview — VaughnMartin Readiness OS",
      ogDescription: "The operating model layer Fortune 1000s are missing. Pre-staged execution replaces 30-day mobilization cycles. 170 Readiness Protocols. 12-minute response.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-[1px] w-7 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.2em]">Investor Overview</span>
              <div className="h-[1px] w-7 bg-[#C9A84C]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0A0F2E] mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Strategic Readiness Platform for
              <span className="text-[#C9A84C]"> Fortune 1000</span>
            </h1>
            <p className="text-xl text-[#0A0F2E]/70 max-w-3xl mx-auto mb-8 font-medium">
              Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays that exist because humans couldn't process information fast enough to act decisively. Every vendor bolted AI onto that old model. We rebuilt from first principles. The category didn't exist. We built it.
            </p>
            <p className="text-base text-[#0A0F2E]/55 max-w-2xl mx-auto mb-8">
              When a strategic trigger fires, competitors spend 30 days just mobilizing. Readiness OS compresses that to 12 minutes — because the response was staged before the trigger fired.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/try-demo">
                <button style={{ display: 'inline-flex', alignItems: 'center', background: '#0A0F2E', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px 32px', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Watch the Platform
                </button>
              </Link>
              <Link href="/contact">
                <button style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', color: '#0A0F2E', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '14px 32px', border: '1px solid rgba(10,15,46,0.3)', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Schedule a Conversation
                </button>
              </Link>
            </div>
          </motion.div>

          {/* ── Category Manifesto ─────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-20">
            <div style={{ background: '#0A0F2E', padding: '72px 56px', position: 'relative', overflow: 'hidden' }}>
              {/* Boardroom photography — editorial, low opacity */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${boardroomImg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.14, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
              <div style={{ position: 'absolute', top: -120, right: -80, width: 700, height: 700, background: 'radial-gradient(ellipse,rgba(43,138,110,0.12) 0%,transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -80, left: -60, width: 500, height: 500, background: 'radial-gradient(ellipse,rgba(201,168,76,0.09) 0%,transparent 60%)', pointerEvents: 'none' }} />

              <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
                  <div style={{ height: 1, width: 32, background: '#C9A84C' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#C9A84C' }}>The Category Argument</span>
                  <div style={{ height: 1, flex: 1, background: 'rgba(201,168,76,0.2)' }} />
                </div>

                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(34px,4vw,52px)', fontWeight: 600, color: '#fff', lineHeight: 1.08, marginBottom: 32, letterSpacing: '-0.01em' }}>
                  Enterprise work was designed for a world without AI. Nobody redesigned it.
                </h2>

                <div style={{ borderLeft: '2px solid rgba(201,168,76,0.4)', paddingLeft: 28, marginBottom: 36 }}>
                  <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, fontWeight: 500 }}>
                    Committees exist because humans couldn't process information fast enough to act alone. Alignment cycles exist because coordination was expensive. 30-day response times exist because that's how long it took to get the right people in the right room with the right context.
                  </p>
                </div>

                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, fontWeight: 500, marginBottom: 24 }}>
                  AI changed the constraint. But every vendor bolted AI onto the old model — faster spreadsheets, smarter summaries, better notes from the same slow meetings. The bureaucracy stays. The latency stays. The 30-day window closes anyway. We're not competing with Copilot or other AI tools. We're competing with the way work is organized — the meeting-heavy, alignment-slow, committee-bound operating model Fortune 1000s have been running for 40 years.
                </p>

                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, fontWeight: 600, marginBottom: 40 }}>
                  VaughnMartin rebuilt how work flows from first principles. Pre-staged Readiness Protocols replace real-time coordination. Pattern detection replaces committee deliberation. This is a new category — and Readiness OS is the first system built for the AI-native enterprise.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                  {[
                    { sys: 'ERP', owns: 'Financial operations', missing: 'Strategic response' },
                    { sys: 'CRM', owns: 'Customer relationships', missing: 'Competitive reaction' },
                    { sys: 'ITSM', owns: 'Technology incidents', missing: 'Enterprise coordination' },
                  ].map(({ sys, owns, missing }) => (
                    <div key={sys} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.12)', padding: '20px 24px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>{sys}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500, marginBottom: 6 }}>Owns: <span style={{ color: 'rgba(255,255,255,0.8)' }}>{owns}</span></div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Gap: <span style={{ color: '#C9A84C' }}>{missing}</span></div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 36, paddingTop: 32, borderTop: '1px solid rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: '#C9A84C', letterSpacing: '0.02em', flexShrink: 0 }}>Readiness OS</div>
                  <div style={{ height: 1, flex: 1, background: 'rgba(201,168,76,0.2)' }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>The new operating model for AI-native enterprises.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Microsoft Ecosystem — Go-to-Market Fit */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }} className="mb-20">
            <div style={{ background: '#0A0F2E', borderRadius: 0, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
              <div style={{ position: 'absolute', top: -80, right: -40, width: 500, height: 400, background: 'radial-gradient(ellipse,rgba(0,120,212,0.1) 0%,transparent 65%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -60, left: -20, width: 400, height: 300, background: 'radial-gradient(ellipse,rgba(201,168,76,0.08) 0%,transparent 65%)', pointerEvents: 'none' }} />
              <div style={{ padding: '56px 48px', position: 'relative', zIndex: 2 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                  <div style={{ height: 1, width: 28, background: '#C9A84C' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>Go-to-Market Fit</span>
                  <div style={{ height: 1, flex: 1, background: 'rgba(201,168,76,0.2)' }} />
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 600, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
                  Every Microsoft enterprise customer<br />is an <em style={{ color: '#C9A84C' }}>immediately addressable</em> prospect.
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 680, lineHeight: 1.7, marginBottom: 36, fontWeight: 500 }}>
                  Readiness OS deploys <em>above</em> the Microsoft stack — not alongside it, not in competition with it.
                  It orchestrates Azure AI, Teams, Copilot Studio, Entra, and M365 inside a single 12-minute response motion.
                  No rip-and-replace. No migration. No change management. This is the fastest enterprise sales motion in the category.
                </p>
                {/* 5 Integration tiles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 12, marginBottom: 36 }}>
                  {[
                    { name: 'Azure AI', color: '#0078D4', detail: 'Azure OpenAI + 4 IDEA agents' },
                    { name: 'Microsoft Teams', color: '#6264A7', detail: 'War room + notifications' },
                    { name: 'Copilot Studio', color: '#5BA3E8', detail: 'Custom Readiness OS agent' },
                    { name: 'Microsoft Entra', color: '#107C10', detail: 'RBAC + identity governance' },
                    { name: 'Power Platform', color: '#742774', detail: 'Workflow automation' },
                  ].map(({ name, color, detail }) => (
                    <div key={name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderTop: `2px solid ${color}`, borderRadius: 0, padding: '14px 16px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{detail}</div>
                    </div>
                  ))}
                </div>
                {/* Investor stat strip */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, paddingTop: 28, borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                  {[
                    { stat: '1B+', label: 'Microsoft 365 monthly active users' },
                    { stat: '~95%', label: 'Fortune 500 use Microsoft products' },
                    { stat: '0', label: 'competing products in this specific layer' },
                    { stat: '12 min', label: 'to full strategic response — no other vendor claims this' },
                  ].map(({ stat, label }) => (
                    <div key={stat} style={{ flex: '1 1 160px' }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>{stat}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.5, fontWeight: 500 }}>{label}</div>
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <div style={{ marginTop: 32 }}>
                  <Link href="/ecosystem">
                    <button style={{ background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', padding: '10px 24px', borderRadius: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, cursor: 'pointer' }}>
                      View Full Architecture Diagram →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Market Validation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-20">
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-8 uppercase tracking-widest">Market Validation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E8E4DC]">
              {metrics.map((metric, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white p-8">
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1, marginBottom: 8 }}>{metric.value}</p>
                  <div style={{ width: 24, height: 1, background: '#C9A84C', marginBottom: 8 }} />
                  <p className="text-[#0A0F2E] font-bold text-xs mb-1 uppercase tracking-widest">{metric.label}</p>
                  <p className="text-[#6B7280] text-xs font-medium leading-relaxed">{metric.description}</p>
                  <p className="text-[#2B8A6E] text-[10px] font-bold mt-2 uppercase tracking-wide">{metric.source}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* McKinsey Independent Validation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-20">
            <div className="bg-[#0A0F2E] overflow-hidden">
              <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-1">Independent Analyst Validation</p>
                  <p className="text-white font-bold text-xl">McKinsey Named the Gap. We Built the Infrastructure.</p>
                </div>
                <div className="text-right shrink-0 ml-6">
                  <div className="text-[#C9A84C] font-black text-lg tracking-wide">McKINSEY</div>
                  <div className="text-white/40 text-xs">2025–2026 Enterprise Architecture Synthesis</div>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-white/10">
                {[
                  { stat: "65%", label: "Still Piloting", sub: "Not yet scaling AI across the enterprise — Readiness OS closes this gap", color: "text-[#C9A84C]" },
                  { stat: "1%", label: "Fully Mature", sub: "Leaders — not employees — are the bottleneck. 221 executive triggers solve this.", color: "text-[#2B8A6E]" },
                  { stat: "$4.4T", label: "AI Productivity Potential", sub: "Locked behind the missing coordination layer — the layer Readiness OS provides", color: "text-[#3BAF8A]" },
                ].map((s) => (
                  <div key={s.stat} className="px-8 py-6">
                    <div className={`text-4xl font-black mb-1 ${s.color}`}>{s.stat}</div>
                    <div className="text-white font-bold text-sm mb-2">{s.label}</div>
                    <div className="text-white/45 text-xs leading-relaxed">{s.sub}</div>
                  </div>
                ))}
              </div>
              <div className="px-8 py-4 bg-white/[0.03] border-t border-white/10">
                <p className="text-white/35 text-xs">"Orchestration layer · coordination fabric · shared source of truth" — McKinsey's label for the infrastructure layer at the center of every enterprise AI stack. They named it. We built it.</p>
              </div>
            </div>
          </motion.div>

          {/* Three-Source Research Convergence */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.175 }} className="mb-20">
            <div className="text-center mb-8">
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-2">Independent Research Convergence</p>
              <h2 className="text-2xl font-bold text-[#0A0F2E] mb-3">Three Research Organizations. One Structural Conclusion.</h2>
              <p className="text-[#6B7280] text-sm max-w-2xl mx-auto">McKinsey, BCG, and MIT Sloan arrived at the same finding independently — from different datasets, different methodologies, different client bases. The operating model is the constraint.</p>
            </div>
            <div className="grid grid-cols-3 gap-px bg-[#E8E4DC]">
              {[
                {
                  firm: "McKinsey & Company",
                  year: "2025–2026",
                  headline: "The coordination layer is missing.",
                  finding: "65% of enterprises still piloting AI — only 1% fully mature. Leaders are the bottleneck. $4.4T in AI productivity potential is locked behind a missing orchestration layer.",
                  color: "#0A0F2E",
                },
                {
                  firm: "BCG",
                  year: "2026",
                  headline: "95% piloting. 5% capturing value.",
                  finding: "Fortune 1000 client study: 95% of companies are piloting AI. Only 5% are capturing real value at scale. The difference is not the technology — it is the operating model.",
                  color: "#C9A84C",
                },
                {
                  firm: "MIT Sloan",
                  year: "2025",
                  headline: "The execution gap is the defining challenge.",
                  finding: "The gap between strategy and delivery is the defining organizational challenge of the decade. Enterprises that close it outperform peers by measurable margins across every studied sector.",
                  color: "#2B8A6E",
                },
              ].map((s) => (
                <div key={s.firm} className="bg-white p-8">
                  <div style={{ width: 24, height: 2, background: s.color, marginBottom: 16 }} />
                  <p className="text-[#0A0F2E] font-black text-sm uppercase tracking-widest mb-1">{s.firm}</p>
                  <p className="text-[#6B7280] text-xs mb-4">{s.year}</p>
                  <p className="text-[#0A0F2E] font-bold text-base mb-3">{s.headline}</p>
                  <p className="text-[#6B7280] text-xs leading-relaxed">{s.finding}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#0A0F2E] p-6 text-center">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                Three of the world's leading research organizations arrived at the same structural conclusion independently. The operating model is the constraint. Readiness OS is the coordination infrastructure built to close it.
              </p>
            </div>
          </motion.div>

          {/* The Problem */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-20">
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-3 uppercase tracking-widest">The Problem We Solve</h2>
            <p className="text-[#6B7280] text-center text-sm mb-8 font-medium">Strategic execution fails at massive scale</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E8E4DC]">
              {industryProblems.map((problem, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white p-8">
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1, marginBottom: 8 }}>{problem.value}</p>
                  <div style={{ width: 24, height: 1, background: '#C9A84C', marginBottom: 8 }} />
                  <p className="text-[#0A0F2E] font-bold text-xs mb-1 uppercase tracking-widest">{problem.label}</p>
                  <p className="text-[#6B7280] text-xs font-medium leading-relaxed">{problem.description}</p>
                  <p className="text-[#6B7280]/60 text-[10px] font-bold mt-2 uppercase tracking-wide">{problem.source}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Execution Gap Diagram */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mb-20">
            <div className="text-center mb-8">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-3">THE ARCHITECTURE</p>
              <h2 className="text-2xl font-bold text-[#0A0F2E] uppercase tracking-widest mb-2">30 Days to Still Be Planning. 12 Minutes to Live Execution.</h2>
              <p className="text-[#6B7280] text-sm font-medium max-w-2xl mx-auto">Traditional enterprises spend 30 days just getting the right people in the room — roles unassigned, tasks undefined, communications not sent. Readiness OS delivers a fully deployed organization in 12 minutes. Execution is already underway before competitors have scheduled their first call.</p>
            </div>
            <ExecutionGapDiagram className="border border-[#E8E4DC]" />
          </motion.div>

          {/* Scenarios */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-20">
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-3 uppercase tracking-widest">Proven Across Critical Scenarios</h2>
            <p className="text-[#6B7280] text-center text-sm mb-8 font-medium">Same situations. Radically different outcomes.</p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {scenarioComparisons.map((scenario, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white border border-[#E8E4DC] p-6 hover:border-[#C9A84C]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <h3 className="text-[#0A0F2E] font-bold">{scenario.title}</h3>
                      <p className="text-[#6B7280] text-xs font-bold">{scenario.industry}</p>
                    </div>
                    <span className={`ml-auto text-xs font-bold px-3 py-1 ${
                      scenario.type === 'offense' 
                        ? 'bg-[#2B8A6E]/10 text-[#2B8A6E] border border-[#2B8A6E]/20' 
                        : 'bg-[#0A0F2E]/10 text-[#0A0F2E] border border-[#0A0F2E]/20'
                    }`}>
                      {scenario.type === 'offense' ? 'GROWTH & POSITIONING' : 'RISK & RESILIENCE'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0A0F2E]/5 border border-[#0A0F2E]/10 p-3">
                      <p className="text-[#6B7280] text-[10px] font-bold uppercase tracking-wider mb-1">Traditional</p>
                      <p className="text-[#0A0F2E] font-bold text-lg">{scenario.traditional.time}</p>
                      <p className="text-[#6B7280] text-xs font-medium mt-1">{scenario.traditional.cost}</p>
                    </div>
                    <div className="bg-[#2B8A6E]/5 border border-[#2B8A6E]/10 p-3">
                      <p className="text-[#2B8A6E]/60 text-[10px] font-bold uppercase tracking-wider mb-1">Readiness OS</p>
                      <p className="text-[#2B8A6E] font-bold text-lg">{scenario.execution.time}</p>
                      <p className="text-[#2B8A6E]/60 text-xs font-medium mt-1">{scenario.execution.value}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-2 bg-[#F8F7F4] overflow-hidden border border-[#E8E4DC]">
                      <div className="h-full bg-[#0A0F2E]" style={{ width: '100%' }} />
                    </div>
                    <span className="text-[#2B8A6E] font-bold text-sm whitespace-nowrap">{scenario.speedup} Execution Head Start</span>
                    <div className="w-6 h-2 bg-[#F8F7F4] overflow-hidden border border-[#E8E4DC]">
                      <div className="h-full bg-[#2B8A6E]" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <p className="text-[#6B7280] text-xs font-medium leading-relaxed">{scenario.context}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/try-demo">
                <Button className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold transition-all">
                  <Play className="w-4 h-4" />
                  Experience the Interactive Scenario Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Platform Architecture — code-built */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-20">
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-3 uppercase tracking-widest">Complete End-to-End Platform</h2>
            <p className="text-[#6B7280] text-center text-sm mb-8 font-medium">From signal detection to coordinated execution in 12 minutes</p>
            <PlatformArchitectureDiagram />
          </motion.div>

          {/* Competitive Advantages */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-20">
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-8 uppercase tracking-widest">Competitive Advantages</h2>
            <div className="grid md:grid-cols-2 gap-px bg-[#E8E4DC]">
              {competitiveAdvantages.map((advantage, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white p-8" style={{ borderLeft: '3px solid #C9A84C' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 10 }}>Advantage {String(i + 1).padStart(2, '0')}</div>
                  <h3 className="text-lg font-bold text-[#0A0F2E] mb-3">{advantage.title}</h3>
                  <p className="text-[#6B7280] text-sm font-medium leading-relaxed">{advantage.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* IDEA Framework */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mb-20 bg-white border border-[#E8E4DC] p-8">
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-8 uppercase tracking-widest">The IDEA Framework™</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { phase: "IDENTIFY", module: "Readiness Protocol™", desc: "Build and customize strategic Readiness Protocols", color: "bg-[#0A0F2E]" },
                { phase: "DETECT", module: "Signal™", desc: "Continuous signal monitoring", color: "bg-[#2B8A6E]" },
                { phase: "EXECUTE", module: "Compass™", desc: "Coordinated 12-minute response", color: "bg-[#C9A84C]" },
                { phase: "ADVANCE", module: "Retrospect™", desc: "Institutional learning", color: "bg-[#2B8A6E]" },
              ].map((phase, i) => (
                <div key={i} className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 ${phase.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {phase.phase[0]}
                  </div>
                  <p className="text-[#0A0F2E] font-bold mb-1 tracking-wider">{phase.phase}</p>
                  <p className="mb-2 flex items-center justify-center"><SubBrandLabel name={phase.module} size={11} /></p>
                  <p className="text-[#6B7280] text-xs font-medium">{phase.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Authorized Automation — Phase 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }} className="mb-20">
            <div className="bg-white border border-[#E8E4DC] p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 flex-shrink-0" style={{ background: GOLD }} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] mb-0.5" style={{ color: GOLD }}>Phase 2 Roadmap</div>
                  <h2 className="text-2xl font-bold text-[#0A0F2E] uppercase tracking-widest">Authorized Automation</h2>
                </div>
              </div>
              <p className="text-sm font-medium mb-8 ml-5" style={{ color: '#6B7280' }}>
                The Founding Partner phase proves the model. Phase 2 adds a second execution track alongside the human workstream —<br />
                automations that were pre-authorized by executives before the trigger fired, running in parallel, within locked policy gates.
              </p>

              <div className="grid md:grid-cols-3 gap-0 border border-[#E8E4DC] mb-8">
                {[
                  {
                    label: "Phase 1 — Today",
                    heading: "Human-Orchestrated Execution",
                    color: TEAL,
                    bg: "#EBF5F1",
                    items: [
                      "Trigger detected → Readiness Protocol activated",
                      "Tasks staged and assigned to named executives",
                      "Executive authorizes — war room launches in 12 minutes",
                      "Human teams execute the pre-staged protocol",
                      "Outcome captured → institutional memory built",
                    ],
                  },
                  {
                    label: "Phase 2 — Authorized Automation",
                    heading: "Dual-Track Execution",
                    color: GOLD,
                    bg: "#FBF8F0",
                    items: [
                      "Same trigger detection · same 12-minute activation",
                      "Track 1: Human workstream executes as before",
                      "Track 2: Approved automations fire in parallel",
                      "Policy gates define: who authorized · what systems · what limits",
                      "Every automation logged — every override captured",
                    ],
                  },
                  {
                    label: "Phase 2 — Connectors",
                    heading: "Automation Targets",
                    color: NAVY,
                    bg: "#F0F1F7",
                    items: [
                      "Jira / Asana — automated ticket creation",
                      "Microsoft Teams — war room setup + briefing distribution",
                      "Slack — stakeholder alert dispatch",
                      "ServiceNow — incident record and workflow trigger",
                      "Executive audit trail: every action, timestamped",
                    ],
                  },
                ].map((col, i) => (
                  <div key={i} className="p-6" style={{ background: col.bg, borderRight: i < 2 ? '1px solid #E8E4DC' : 'none', borderTop: `3px solid ${col.color}` }}>
                    <div className="text-[9px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: col.color }}>{col.label}</div>
                    <p className="text-sm font-bold text-[#0A0F2E] mb-4">{col.heading}</p>
                    <ul className="space-y-2">
                      {col.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-[#0A0F2E]/65 font-medium">
                          <span className="w-1 h-1 flex-shrink-0 mt-1.5" style={{ background: col.color, display: 'inline-block' }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-[#E8E4DC] p-5">
                  <div className="text-[9px] font-black uppercase tracking-[0.18em] mb-2" style={{ color: NAVY }}>The Non-Negotiable</div>
                  <p className="text-sm font-bold text-[#0A0F2E] mb-2">Executive authority preserved at every step</p>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: '#6B7280' }}>
                    No automation fires without pre-authorized policy gates. The executive approves the automation scope before the trigger — not during it. When the trigger fires, the authorization is already in place. The decision was made when there was time to make it carefully.
                  </p>
                </div>
                <div className="border p-5" style={{ borderColor: `${GOLD}60`, background: '#FBF8F0' }}>
                  <div className="text-[9px] font-black uppercase tracking-[0.22em] mb-2" style={{ color: GOLD }}>The Market Opportunity</div>
                  <p className="text-sm font-bold text-[#0A0F2E] mb-2">Every enterprise has the tools. None have the model.</p>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: '#6B7280' }}>
                    Microsoft, Jira, ServiceNow, and Slack are already deployed. Authorized Automation turns those investments into a coordinated, pre-staged execution machine — with the operating model to govern it. Readiness OS is the orchestration layer they are missing.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Future Positioning — code-built */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mb-20">
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-3 uppercase tracking-widest">Built for Today. Positioned for Tomorrow.</h2>
            <p className="text-[#6B7280] text-center text-sm mb-8 font-medium">Selling pain relief today while building the operating layer for the AI era</p>
            <FuturePositioningDiagram />
          </motion.div>

          {/* Product Roadmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-20">
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-8 uppercase tracking-widest">Product Roadmap</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {milestones.map((milestone, i) => (
                <div key={i} className="bg-white border border-[#E8E4DC] p-6 hover:border-[#C9A84C]/50 transition-colors">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 ${
                    i === 0 ? "bg-[#2B8A6E]/10 text-[#2B8A6E]" :
                    i === 1 ? "bg-[#C9A84C]/10 text-[#C9A84C]" :
                    "bg-[#0A0F2E]/10 text-[#0A0F2E]"
                  }`}>
                    {i === 0 ? <CheckCircle className="w-3 h-3" /> : i === 1 ? <Zap className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                    {milestone.phase}
                  </div>
                  <ul className="space-y-2">
                    {milestone.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[#0A0F2E]/70 font-medium">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${i === 0 ? "text-[#2B8A6E]" : "text-[#E8E4DC]"}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Target Market */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="mb-20 bg-[#0A0F2E] border border-[#E8E4DC] p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">Target Market</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#C9A84C]" />
                    <span className="text-white/80 font-medium">Fortune 1000 enterprises</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#2B8A6E]" />
                    <span className="text-white/80 font-medium">Complex, multi-domain organizations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#C9A84C]" />
                    <span className="text-white/80 font-medium">C-suite and strategic leadership teams</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#0A0F2E]/30 border border-white/10 backdrop-blur-sm p-6">
                <p className="text-[#C9A84C] font-bold text-lg mb-2 uppercase tracking-wider">Why Now?</p>
                <ul className="space-y-2 text-white/70 text-sm font-medium">
                  <li>• AI disruption accelerating strategic uncertainty</li>
                  <li>• Regulatory windows shrinking globally</li>
                  <li>• Remote work fragmented institutional knowledge</li>
                  <li>• Competitors moving faster than ever</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-center">
            <h2 className="text-2xl font-bold text-[#0A0F2E] mb-3">Ready to take the next step?</h2>
            <p className="text-[#6B7280] text-sm mb-8 max-w-lg mx-auto">Join the Fortune 1000 executives rethinking how strategic work flows. Founding Partner validation runs in 90 days.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/founding-partner-program">
                <Button className="bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold px-8 h-12 rounded-none tracking-wide">
                  Request Founding Partner Access
                </Button>
              </Link>
              <Link href="/investor-resources">
                <Button variant="outline" className="border-[#2B8A6E]/50 text-[#2B8A6E] hover:bg-[#2B8A6E]/10 h-12 px-8 bg-transparent rounded-none">
                  <FileText className="w-4 h-4 mr-2" />
                  Investor Resources
                </Button>
              </Link>
              <Link href="/try-demo">
                <Button variant="outline" className="border-[#0A0F2E]/30 text-[#0A0F2E] hover:bg-[#0A0F2E]/10 h-12 px-8 bg-transparent rounded-none">
                  <Play className="w-4 h-4 mr-2" />
                  See It Live
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Research Citations */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="mt-20 pt-12 border-t border-[#0A0F2E]/10">
            <h3 className="text-sm font-semibold text-[#0A0F2E]/60 mb-6 text-center">Research Sources & Citations</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {researchCitations.map((citation) => (
                <div key={citation.id} className="text-xs text-[#0A0F2E]/40 p-3 bg-[#0A0F2E]/5">
                  <span className="text-[#0A0F2E]/60 font-medium">[{citation.id}]</span>{' '}
                  <span className="text-[#2B8A6E]">{citation.source}</span>{' '}
                  <span className="italic">"{citation.title}"</span>{' '}
                  <span>({citation.year})</span>
                  <p className="mt-1 text-[#0A0F2E]/30">{citation.finding}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[#0A0F2E]/30 text-xs mt-6">
              All statistics sourced from publicly available industry research. Readiness OS internal metrics (12-minute activation) based on platform capabilities.
            </p>
          </motion.div>
          
        </div>
      </div>
    </PageLayout>
  );
}
