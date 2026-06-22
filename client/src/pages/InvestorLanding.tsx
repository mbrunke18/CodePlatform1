import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import ProductShowcase from "@/components/marketing/ProductShowcase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  Shield,
  Zap,
  Users,
  Globe,
  Rocket,
  DollarSign,
  BarChart3,
  Lock,
  Network,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Brain,
  Globe2,
  FileText,
  Quote,
  AlertTriangle,
  Mail,
  Calendar
} from "lucide-react";
import { useLocation } from "wouter";
import PageLayout from '@/components/layout/PageLayout';
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// LTV:CAC trend over 5 years
const ltvCacTrendData = [
  { year: 'Y1', ratio: 3.2, ltv: 160, cac: 50 },
  { year: 'Y2', ratio: 5.1, ltv: 280, cac: 55 },
  { year: 'Y3', ratio: 6.8, ltv: 420, cac: 62 },
  { year: 'Y4', ratio: 7.9, ltv: 580, cac: 73 },
  { year: 'Y5', ratio: 8.4, ltv: 756, cac: 90 }
];

// ROI breakdown data
const roiBreakdownData = [
  { name: 'Cost Savings', value: 7.2, color: '#2B8A6E' },
  { name: 'Time Recovery', value: 3.4, color: '#C9A84C' },
  { name: 'Risk Mitigation', value: 1.8, color: '#0A0F2E' }
];

export default function InvestorLanding() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Investor Overview | Readiness OS — Situational Readiness Platform",
      description: "Every enterprise has Microsoft's AI stack. None have the operating model to use it. Readiness OS is the operating model layer. First-mover in a new enterprise software category.",
      ogTitle: "Invest in Readiness OS — The Operating Model Layer for startup to Fortune 500",
      ogDescription: "Enterprises spend 30 days mobilizing for events they could have pre-staged. Readiness OS changes the model. 180 protocols. 12-minute execution. First-mover opportunity.",
    });
  }, []);

  return (
    <PageLayout>

        {/* Hero Section */}
        <section className="py-20 px-6 text-white relative overflow-hidden bg-[#0A0F2E]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMDksMTY4LDc2LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvYXB0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="mb-8 flex justify-center">
              <VaughnMartinLogo color="light" height={44} variant="full" />
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ background: '#C9A84C' }} />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: '#C9A84C' }}>Category-Defining Opportunity</span>
              <div className="w-8 h-px" style={{ background: '#C9A84C' }} />
            </div>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '5px 14px', border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.07)' }}>
              <div style={{ width: 5, height: 5, background: '#C9A84C', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>Coordination Infrastructure</span>
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 700, marginBottom: 16, lineHeight: 1.1, maxWidth: 900, margin: '0 auto 16px', color: '#fff' }} data-testid="heading-hero">
              The Salesforce Moment for Strategic Readiness
            </h1>
            
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, fontStyle: 'italic', color: '#C9A84C', marginBottom: 28 }} data-testid="text-tagline">
              The response is ready before the trigger fires.
            </p>

            {/* Investor CTAs — directly after tagline, visible above fold */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
              <a
                href="mailto:mbrunke@vaughnmartin.com"
                style={{ fontFamily: "'Barlow', sans-serif", textDecoration: 'none', display: 'inline-block', background: '#C9A84C', color: '#0A0F2E', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', padding: '16px 36px', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' }}
              >
                Talk to the Founder →
              </a>
              <a
                href="/demo-experience"
                style={{ fontFamily: "'Barlow', sans-serif", textDecoration: 'none', display: 'inline-block', background: 'transparent', color: '#2B8A6E', border: '1.5px solid #2B8A6E', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', padding: '15px 28px', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' }}
              >
                See the Platform →
              </a>
            </div>

            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(18px,2vw,24px)', fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: 32, maxWidth: 760, margin: '0 auto 32px', lineHeight: 1.55 }}>
              The problem isn't strategy, talent, or AI tools. It's that no enterprise has the coordination infrastructure to make the response ready before the trigger fires. We built it.
            </p>

            {/* VaughnMartin Thesis Block — leads with WHY before the market numbers */}
            <div className="max-w-3xl mx-auto mb-10 border border-[#C9A84C]/30 bg-white/5 backdrop-blur-sm p-8 text-left">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A84C] mb-4">The VaughnMartin Thesis</div>
              <p className="text-base text-white/90 leading-relaxed mb-3 font-medium">
                The way enterprises work was designed for a world without AI. Committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act alone.
              </p>
              <p className="text-base text-white/70 leading-relaxed mb-3">
                AI changed the constraint. But every vendor bolted AI onto the old model — faster spreadsheets, smarter summaries, better notes from the same slow meetings. The bureaucracy stays. The latency stays.
              </p>
              <p className="text-base font-bold leading-relaxed" style={{ color: '#C9A84C' }}>
                VaughnMartin redesigned how work flows from first principles for the AI era. Pre-staged Readiness Protocols replace real-time coordination. Pattern detection replaces committee deliberation. 12-minute execution replaces 30-day alignment cycles.
              </p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm font-bold leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  Readiness OS is the system that allows an enterprise to detect, coordinate, execute, and learn from strategic change faster than its competitors — from startup to Fortune 500.
                </p>
                <p className="text-sm text-white/50 italic">
                  We're not competing with Copilot or other AI tools. We're competing with the way work is organized — the meeting-heavy, alignment-slow operating model startup to Fortune 500s have been running for 40 years.
                </p>
              </div>
            </div>

            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.50)', marginBottom: 36, maxWidth: 760, margin: '0 auto 36px', lineHeight: 1.7 }} data-testid="text-description">
              startup to Fortune 500 companies spend $847B annually on strategic initiatives — 83% fail due to execution gaps. Readiness OS addresses a $5B+ addressable market, delivering a 3,600× Execution Head Start: while rivals are still mobilizing weeks later, the Readiness OS response is already deep into coordinated execution — in 12 minutes.
            </p>

            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={() => window.location.href = 'mailto:mbrunke@vaughnmartin.com'}
                className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold px-12"
                data-testid="button-request-pilot"
              >
                Talk to the Founder →
              </Button>
              <div className="flex flex-wrap justify-center gap-6">
                <button
                  onClick={() => setLocation("/command-tower")}
                  className="text-white/55 text-sm font-medium hover:text-white/80 transition-colors underline underline-offset-4 decoration-white/20"
                  data-testid="button-see-live"
                  style={{ fontFamily: "'Barlow', sans-serif", background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  See the system live →
                </button>
                <span className="text-white/20 text-sm">or</span>
                <button
                  onClick={() => setLocation("/12-minute-experience")}
                  className="text-white/55 text-sm font-medium hover:text-white/80 transition-colors underline underline-offset-4 decoration-white/20"
                  data-testid="button-see-demo"
                  style={{ fontFamily: "'Barlow', sans-serif", background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Take the 12-minute test drive →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Platform Showcase ── */}
        <ProductShowcase
          eyebrow="Platform in Action"
          headline="Enterprises becoming fearless — on live infrastructure."
          subheadline="One interface. Every trigger. Pre-staged before you need it."
          image="/screenshots/new_mission_control.jpg"
          imageAlt="Readiness OS Mission Control — Live Platform"
          urlPath="/mission-control"
          urlTag="LIVE"
          tagColor="#C9A84C"
          features={[
            { color: "#2B8A6E", label: "Signal Intelligence", description: "231 triggers monitored continuously — competitive, regulatory, financial, operational." },
            { color: "#C9A84C", label: "180 Readiness Protocols", description: "Pre-staged execution packages covering every situation your organization will face." },
            { color: "#4A90C4", label: "12-Minute Execution", description: "Signal to full organizational response in 12 minutes. 30 days compressed to a single authorization." },
          ]}
        />

        {/* ── DR. HUANG NAMED ENDORSEMENT ──────────────────────────────────── */}
        <section style={{ background: '#F0EDE4', borderTop: '4px solid #C9A84C', padding: '48px 32px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 120 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#2B8A6E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#fff' }}>KH</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: '#0A0F2E' }}>Dr. Kerry Huang</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#2B8A6E', marginTop: 3 }}>Fortune 50 AVP</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(10,15,46,0.45)', marginTop: 2 }}>ESI Top 1% Researcher</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ height: 1, width: 20, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>Independent Validation · LinkedIn · April 2026</span>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(18px,2.2vw,26px)', fontWeight: 600, color: '#0A0F2E', lineHeight: 1.55, marginBottom: 16 }}>
                "Martin Brunke and VaughnMartin are addressing the infrastructure gap that has defined — and limited — enterprise strategic response for four decades. My research across 408 firms confirms what this platform operationalizes: the coordination layer, not the AI model, is what determines whether an organization moves or stalls when a trigger fires."
              </p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
                {['Forbes Business Council Member', '408-Firm Governance Study', 'Fortune 50 AVP — active role', 'ESI Highly Cited Researcher'].map(c => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 4, height: 4, background: '#2B8A6E', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: 'rgba(10,15,46,0.65)' }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CHALLENGE SECTION ────────────────────────────────────────────── */}
        <section className="px-6 py-16" style={{ background: '#0A0F2E', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="max-w-4xl mx-auto">
            <div style={{ borderLeft: '4px solid #C9A84C', borderTop: '1px solid rgba(201,168,76,0.25)', borderRight: '1px solid rgba(201,168,76,0.25)', borderBottom: '1px solid rgba(201,168,76,0.25)', padding: '40px 48px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 20 }}>The Question That Closes Every Conversation</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', lineHeight: 1.35, marginBottom: 20 }}>
                If a ransomware attack, an activist investor, or a regulatory inquiry hit one of your portfolio companies today — what would happen in the next 12 minutes?
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, marginBottom: 28, maxWidth: 680 }}>
                Who calls who? Where's the brief? Who owns the response? Who authorizes it? Most startup to Fortune 500s spend 30 days figuring that out — while the window closes, the regulator moves, the stock drops, the competitor acts. That gap is the business. Every startup to Fortune 500 has it. None have solved it. The cost per trigger: $50M to $500M.
              </p>
              <a href="/12-minute-experience" style={{ display: 'inline-block', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, padding: '14px 36px', background: '#C9A84C', color: '#0A0F2E', textDecoration: 'none' }}>
                See What 12 Minutes Looks Like →
              </a>
            </div>
          </div>
        </section>

        {/* ── GEOPOLITICAL TRIGGER SURFACE ─────────────────────────────────── */}
        <section className="px-6 py-16" style={{ background: '#0A0F2E', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-6 h-px" style={{ background: '#C9A84C' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>The Trigger Surface Boards Are Now Accountable For</span>
            </div>
            <div className="grid md:grid-cols-2 gap-12 mb-12 items-start">
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 20 }}>
                  Operating model resilience is now a board-level obligation — not an operational one.
                </p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, marginBottom: 14 }}>
                  BCG, McKinsey, and WEF research confirms the same pattern: boards are now accountable for <em style={{ color: 'rgba(255,255,255,0.85)' }}>anticipating</em> strategic triggers, not just responding to them. The consulting engagement maps the scenarios. The question boards are starting to ask: what makes the response ready before the scenario fires?
                </p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>
                  Readiness OS is the install that follows the consulting deck — operationalizing the scenario plan across 231 trigger conditions so the response is pre-staged, not improvised.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                {[
                  { domain: 'Export Control & Technology Restriction', detail: 'BIS entity lists, CHIPS Act exposure, ITAR/EAR compliance triggers — detected before a license violation surfaces' },
                  { domain: 'Foreign Investment Scrutiny (CFIUS)', detail: 'Ownership structure reviews, national security assessments, forced divestiture signals — pre-staged before Treasury moves' },
                  { domain: 'Data Sovereignty & Localization Mandate', detail: 'Cross-border data flow restrictions, adequacy decision changes, cloud sovereignty requirements — protocol ready before enforcement' },
                  { domain: 'Geopolitical Operating Model Disruption', detail: 'US-China decoupling cascades, market exit triggers, friend-shoring mandates — restructuring protocol staged in advance' },
                ].map(({ domain, detail }) => (
                  <div key={domain} style={{ borderLeft: '3px solid rgba(201,168,76,0.4)', paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 4 }}>{domain}</div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.60)', lineHeight: 1.7 }}>{detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' as const }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: 'italic', color: 'rgba(255,255,255,0.70)', lineHeight: 1.55, maxWidth: 600 }}>
                "The firm that survives a geopolitical trigger is not the fastest to respond. It is the one that made the response ready before the trigger fired."
              </p>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#2B8A6E', textAlign: 'right' as const, lineHeight: 1.8 }}>
                231 Trigger Conditions<br />15-Minute Detection Cycle<br />4 Geopolitical Signal Domains
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPETITIVE MOAT SECTION ─────────────────────────────────────── */}
        <section className="py-20 px-6" style={{ background: '#0A0F2E', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="max-w-5xl mx-auto">

            {/* Section label + question */}
            <div className="text-center mb-14">
              <div className="vm-section-label justify-center mb-6" style={{ color: 'rgba(201,168,76,0.7)' }}><span style={{ color: '#C9A84C' }}>Competitive Defensibility</span></div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
                If a well-funded competitor showed up tomorrow —<br />
                <em style={{ color: '#C9A84C' }}>why do we still win?</em>
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>
                A product is not a moat. Features can be rebuilt in 12 months. The moat is what a competitor cannot replicate regardless of funding.
              </p>
            </div>

            {/* Three compounding moats */}
            <div className="grid md:grid-cols-3 gap-px mb-12" style={{ background: 'rgba(201,168,76,0.12)' }}>
              {[
                {
                  n: '01',
                  label: 'Accumulated Decision Logic',
                  accent: '#C9A84C',
                  body: 'A competitor can rebuild the platform layer in 6–12 months. They cannot rebuild 20 years of startup to Fortune 500 operational decision logic — the trigger patterns, stakeholder sequences, and failure modes embedded in 180 Readiness Protocols from two decades of real crisis response.',
                  proof: '20 years of operational experience → not replicable with funding',
                },
                {
                  n: '02',
                  label: 'Organizational Intelligence That Compounds',
                  accent: '#2B8A6E',
                  body: 'Every activation, every debrief, every stakeholder acknowledgment makes the platform more specific to that organization\'s actual failure modes and response patterns. That accumulated intelligence is non-transferable. A competitor starting from zero starts from zero — permanently.',
                  proof: 'Each use deepens specificity → value compounds, not depreciates',
                },
                {
                  n: '03',
                  label: 'Embeddedness as Infrastructure',
                  accent: '#C9A84C',
                  body: 'When Readiness OS becomes the organizational rhythm for strategic readiness — not a tool they open, but the process by which preparation happens — it stops being a vendor. Infrastructure is not replaced at contract renewal. It is built upon. Removing it means dismantling the preparation architecture entirely.',
                  proof: 'Operating rhythm, not software → switching cost measured in years',
                },
              ].map(m => (
                <div key={m.n} style={{ background: '#0A0F2E', padding: '32px 28px' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: m.accent, marginBottom: 12 }}>Moat {m.n}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>{m.label}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, marginBottom: 20 }}>{m.body}</p>
                  <div style={{ borderTop: `1px solid ${m.accent}30`, paddingTop: 16 }}>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: m.accent, letterSpacing: '0.04em', lineHeight: 1.5 }}>{m.proof}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dr. Huang research anchor */}
            <div className="max-w-3xl mx-auto text-center" style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: 40 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(18px,2vw,24px)', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: 12 }}>
                "The competitor can buy the platform. They cannot buy the accumulated decision logic embedded in the preparation phase."
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.88)' }}>
                Dr. Kerry Huang · ESI Top 1% Researcher · 408-Firm Study
              </p>
            </div>

          </div>
        </section>

        {/* ── WHY NOT INCUMBENTS ───────────────────────────────────────────── */}
        <section style={{ background: '#F0EDE4', padding: '80px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ height: 1, width: 24, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>Competitive Reality</span>
                <div style={{ height: 1, width: 24, background: '#C9A84C' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.15, marginBottom: 16 }}>
                Why won't an incumbent just build this?
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: 'rgba(10,15,46,0.68)', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>
                Every investor asks it. Here is the honest answer — four incumbents, four structural reasons the category stays open.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, background: 'rgba(10,15,46,0.08)' }}>
              {[
                {
                  co: 'Microsoft',
                  role: 'Infrastructure layer',
                  why: 'Microsoft builds and sells the AI, compute, and collaboration stack. Readiness OS orchestrates it. Their business model requires customers to buy Microsoft infrastructure — they have no incentive to tell enterprises the infrastructure is insufficient without an operating model above it. Copilot Studio lets enterprises automate tasks; it has no concept of a strategic trigger, a pre-staged response, or executive authorization gates. We are the layer that makes the Microsoft investment fully returnable.',
                  verdict: 'Microsoft is the platform. We are the operating model. They benefit from our existence.',
                  verdictColor: '#2B8A6E',
                },
                {
                  co: 'ServiceNow',
                  role: 'ITSM and workflow automation',
                  why: 'ServiceNow manages IT service tickets and operational workflows. Its entire commercial model and product identity is built on reactive incident management — something happens, a ticket is created, it gets routed. Readiness OS is proactive by design: the response is staged before the trigger fires. Pre-staging is architecturally opposite to the ServiceNow model. Entering this space would require ServiceNow to compete with its own positioning as the reactive-to-proactive workflow company.',
                  verdict: 'ServiceNow manages the ticket after the event. We stage the response before it.',
                  verdictColor: '#C9A84C',
                },
                {
                  co: 'Big 4 Consulting',
                  role: 'Strategy and crisis response',
                  why: 'McKinsey, Deloitte, PwC, and Accenture bill $50K–$200K to build the response in real time after the trigger fires. Readiness OS eliminates the primary revenue event for their strategic advisory practices. They have named the gap publicly — McKinsey\'s 2025 synthesis explicitly identifies the missing "orchestration layer." But productizing the solution destroys their margin structure. Their business model depends on the 30-day mobilization cycle we compress.',
                  verdict: 'Consulting firms profit from the gap we close. They cannot be the ones who close it.',
                  verdictColor: '#2B8A6E',
                },
                {
                  co: 'Salesforce',
                  role: 'CRM and customer data',
                  why: 'Salesforce owns the customer relationship layer. Strategic readiness operates at the organizational governance layer — cross-functional, executive-authorized, cross-domain. Salesforce\'s entire data model, permission structure, and buyer (Chief Revenue Officer) is orthogonal to the COO, CISO, Chief Strategy Officer, and General Counsel who own the strategic readiness budget. The ICP, the workflow architecture, and the organizational entry point are structurally incompatible with Salesforce\'s existing motion.',
                  verdict: 'Salesforce owns the customer layer. We own the strategic coordination layer.',
                  verdictColor: '#C9A84C',
                },
              ].map(({ co, role, why, verdict, verdictColor }) => (
                <div key={co} style={{ background: '#fff', padding: '36px 32px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 48, height: 48, background: '#0A0F2E', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800, color: '#C9A84C', letterSpacing: '0.06em' }}>{co.substring(0,2).toUpperCase()}</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#0A0F2E', lineHeight: 1 }}>{co}</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(10,15,46,0.45)', marginTop: 4 }}>{role}</div>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(10,15,46,0.72)', lineHeight: 1.78, marginBottom: 20 }}>{why}</p>
                  <div style={{ borderTop: `2px solid ${verdictColor}30`, paddingTop: 16 }}>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: verdictColor, lineHeight: 1.5, margin: 0 }}>{verdict}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Three Problems Worth Billions */}
        <section className="py-16 px-6 text-[#0A0F2E]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="vm-section-label justify-center mb-6"><span>Market Problem</span></div>
              <h2 className="text-4xl font-bold mb-4 text-[#0A0F2E]">
              Three Enterprise Problems Worth $847B
            </h2>
            <p className="text-xl text-[#0A0F2E] max-w-4xl mx-auto">
              startup to Fortune 500 companies face these three problems every time a strategic moment hits. No infrastructure existed to solve them—until Readiness OS.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { n: '01', label: 'The Readiness Gap', body: 'Weeks to mobilize — before the response even begins', stat: '$136K/hour delayed (IBM). $5-50M M&A synergy erosion.', metric: '30 days → 12 min', accent: '#0A0F2E' },
              { n: '02', label: 'The Coordination Chaos', body: '50-200+ stakeholders. No system to coordinate them.', stat: '$4.88M avg breach cost. 35% higher without pre-defined teams.', metric: '35% cost reduction', accent: '#C9A84C' },
              { n: '03', label: 'The Institutional Amnesia', body: 'Knowledge walks out the door. Same scramble every time.', stat: '3.5 disruptions per 2 years. Same $4.88M cost repeated.', metric: 'Compounding intelligence', accent: '#2B8A6E' },
            ].map(p => (
              <Card key={p.n} className="bg-white border border-[#E8E4DC] transition-all" style={{ borderTopColor: p.accent, borderTopWidth: 3 }}>
                <CardContent className="p-6">
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, marginBottom: 8, fontFamily: "'Barlow Condensed', sans-serif" }}>Problem {p.n}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A0F2E', marginBottom: 8, lineHeight: 1.2 }}>{p.label}</h3>
                  <p className="text-sm text-[#0A0F2E] mb-2 leading-relaxed">{p.body}</p>
                  <p className="text-xs text-[#6B7280] mb-4">{p.stat}</p>
                  <div className="border-t border-[#E8E4DC] pt-4">
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2B8A6E', marginBottom: 6 }}>Solution</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#2B8A6E' }}>{p.metric}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

            <div className="bg-[#F8F7F4] border border-[#E8E4DC] px-6 py-4 text-center">
              <p className="text-[#0A0F2E]">
                <span className="text-[#0A0F2E] font-semibold">Readiness OS at $150K–$450K+/year</span> vs. one incident costing <span className="text-[#0A0F2E] font-semibold">$5-50M</span>. <span className="text-[#2B8A6E] font-semibold">Payback on first use.</span>
              </p>
            </div>
          </div>
        </section>

        {/* CEO / CFO Executive Frame */}
        <section className="py-16 px-6" style={{ background: "#0A0F2E" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 28, height: 1, background: "#C9A84C" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#C9A84C", fontFamily: "'Barlow Condensed', sans-serif" }}>Executive Value Frame</span>
                <div style={{ width: 28, height: 1, background: "#C9A84C" }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.15 }}>
                Two Conversations. One Platform.
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto" }}>
                Readiness OS closes the CEO's readiness mandate and the CFO's value equation simultaneously.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
              {/* CEO Frame */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "3px solid #C9A84C", padding: "36px 32px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#C9A84C", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 14 }}>CEO Conversation</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
                  "We are taking enterprise readiness from 30-day mobilization to 12 minutes."
                </h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 20 }}>
                  The competitive advantage is the prepared response — not the faster committee. Every startup to Fortune 500 competitor still starts from zero when a trigger fires. Readiness OS starts from pre-staged.
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 18 }}>
                  {[
                    "Pre-staged for every situation the enterprise will face",
                    "Executive authority preserved — no protocol activates without sign-off",
                    "180 Readiness Protocols across 9 strategic domains — plus 30 compound multi-threat scenarios",
                    "Risk and opportunity triggers covered — not just crisis response",
                  ].map(pt => (
                    <div key={pt} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ color: "#C9A84C", fontSize: 12, marginTop: 2, flexShrink: 0 }}>◆</span>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CFO Frame */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "3px solid #2B8A6E", padding: "36px 32px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#2B8A6E", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 14 }}>CFO Conversation</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
                  "This is not a tooling spend. It is a value-protection and value-capture system."
                </h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 20 }}>
                  The 4-Bucket Value Formula — illustrative at $5B enterprise with 6 critical events/year:
                </p>
                <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", marginBottom: 16 }}>
                  {[
                    { n: "①", l: "Loss Avoided", d: "6 events × $750K/day × 2 days eliminated", v: "$9.0M", c: "#C9A84C" },
                    { n: "②", l: "Upside Captured", d: "4 opportunity moments × 3% win-rate lift", v: "$2.4M", c: "#2B8A6E" },
                    { n: "③", l: "Coordination Cost Saved", d: "Executive time reclaimed from mobilization", v: "$0.3M", c: "#fff" },
                    { n: "④", l: "External Spend Displaced", d: "Consulting retainers replaced", v: "$0.5M+", c: "rgba(255,255,255,0.6)" },
                  ].map(b => (
                    <div key={b.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: b.c }}>{b.n} {b.l}</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{b.d}</div>
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: b.c, flexShrink: 0, marginLeft: 16 }}>{b.v}</div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, marginTop: 4 }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: "#C9A84C" }}>Illustrative Annual Value</span>
                    <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: "#C9A84C" }}>$11.9M+</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(43,138,110,0.12)", border: "1px solid rgba(43,138,110,0.3)", padding: "12px 16px" }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#2B8A6E", marginBottom: 2 }}>At $325K/yr Platform Investment</div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Payback on first trigger event</div>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: "#2B8A6E" }}>36× ROI</div>
                </div>
              </div>
            </div>

            {/* Mobilization Gap */}
            <div className="max-w-3xl mx-auto text-center">
              <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: 28 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px,2.5vw,26px)", fontStyle: "italic", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginBottom: 10 }}>
                  "Most enterprises don't fail because they lack ideas or data.<br />
                  They fail in the <span style={{ color: "#C9A84C" }}>mobilization gap</span> — between 'we know' and 'we are executing.'"
                </p>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)" }}>The gap Readiness OS was built to close</div>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Model Layer */}
        <section className="py-16 px-6 text-[#0A0F2E]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="vm-section-label justify-center mb-6"><span>Architectural Thesis</span></div>
              <h2 className="text-4xl font-bold mb-4 text-[#0A0F2E]">
                The Operating Model Layer
              </h2>
              <p className="text-xl text-[#0A0F2E] max-w-3xl mx-auto">
                Every enterprise has Microsoft's AI stack. None have the operating model to use it. Readiness OS is the coordination infrastructure that sits between strategy and execution — and activates in 12 minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-2 items-center max-w-4xl mx-auto mb-12">
              <div className="bg-[#F8F7F4] border border-[#E8E4DC] p-4 text-center">
                <div className="text-xs text-[#6B7280] mb-1">Strategy Layer</div>
                <div className="text-sm font-semibold text-[#0A0F2E]">Board & C-Suite</div>
              </div>
              <div className="text-center text-[#6B7280]">→</div>
              <div className="bg-gradient-to-r from-[#0A0F2E]/20 to-[#2B8A6E]/20 border-2 border-[#C9A84C]/50 p-4 text-center">
                <div className="text-xs text-[#C9A84C] font-semibold mb-1">Readiness Infrastructure Layer</div>
                <div className="text-sm font-bold text-[#0A0F2E]">Readiness OS</div>
              </div>
              <div className="text-center text-[#6B7280]">→</div>
              <div className="bg-[#F8F7F4] border border-[#E8E4DC] p-4 text-center">
                <div className="text-xs text-[#6B7280] mb-1">Workflow Layer</div>
                <div className="text-sm font-semibold text-[#0A0F2E]">Jira, ServiceNow</div>
              </div>
            </div>

          <div className="grid md:grid-cols-5 gap-2 max-w-5xl mx-auto">
            {[
              { n: '01', label: 'Detection Agent', sub: 'Monitors signals across domains', color: '#2B8A6E' },
              { n: '02', label: 'Risk Scoring Agent', sub: 'Classifies severity + urgency', color: '#C9A84C' },
              { n: '03', label: 'Routing Agent', sub: 'Assigns stakeholders + roles', color: '#0A0F2E' },
              { n: '04', label: 'Decision Agent', sub: 'Pre-authorized within policy', color: '#2B8A6E' },
              { n: '05', label: 'Learning Agent', sub: 'Compounds institutional knowledge', color: '#C9A84C' },
            ].map(a => (
              <div key={a.n} className="bg-[#F8F7F4] border border-[#E8E4DC] p-5 text-center" style={{ borderTopColor: a.color, borderTopWidth: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: a.color, marginBottom: 8, fontFamily: "'Barlow Condensed', sans-serif" }}>{a.n}</div>
                <div className="text-sm font-semibold text-[#0A0F2E] mb-1">{a.label}</div>
                <div className="text-xs text-[#6B7280]">{a.sub}</div>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* Independent Market Validation - Moved up for visibility */}
        <section className="py-16 px-6 text-[#0A0F2E]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="vm-section-label justify-center mb-6"><span>2026 Market Validation</span></div>
              <h2 className="text-4xl font-bold mb-4 text-[#0A0F2E]">
                8 Flagship Reports. One Conclusion.
              </h2>
              <p className="text-xl text-[#0A0F2E] max-w-3xl mx-auto mb-6">
                The world's top consulting and technology firms independently confirm the market Readiness OS addresses
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['Harvard Business Review', 'IBM', 'BCG', 'McKinsey', 'Bain', 'Accenture', 'Deloitte', 'PwC', 'Gartner', 'Forrester', 'IDC', 'Microsoft', 'Google Cloud', 'OpenAI', 'Anthropic', 'World Economic Forum'].map((firm) => (
                  <span key={firm} className="bg-[#0A0F2E]/5 border border-[#E8E4DC] px-3 py-1 text-xs font-medium text-[#0A0F2E]">{firm}</span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Brain className="h-5 w-5 text-[#0A0F2E]" />
                    <span className="font-bold text-[#0A0F2E] text-lg">BCG</span>
                  </div>
                  <div className="text-sm text-[#0A0F2E] mb-3">BCG Research 2026</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-1" />
                    <p className="text-[#0A0F2E] text-sm">"AI transformation shifting from CIO-led to CEO-led mandate"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Readiness OS is built for the C-suite</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe2 className="h-5 w-5 text-[#0A0F2E]" />
                    <span className="font-bold text-[#0A0F2E] text-lg">IBM</span>
                  </div>
                  <div className="text-sm text-[#0A0F2E] mb-3">The Enterprise in 2030</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-1" />
                    <p className="text-[#0A0F2E] text-sm">"The smarter enterprise requires new operating models"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Readiness OS IS that operating model</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-5 w-5 text-[#2B8A6E]" />
                    <span className="font-bold text-[#0A0F2E] text-lg">McKinsey</span>
                  </div>
                  <div className="text-sm text-[#2B8A6E] mb-3">Global Tech Agenda 2026</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-1" />
                    <p className="text-[#0A0F2E] text-sm">"CIOs evolving from cost managers to strategy architects"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Our 180 Readiness Protocols give them the execution infrastructure</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Network className="h-5 w-5 text-[#C9A84C]" />
                    <span className="font-bold text-[#0A0F2E] text-lg">Deloitte</span>
                  </div>
                  <div className="text-sm text-[#C9A84C] mb-3">State of AI in the Enterprise 2026</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-1" />
                    <p className="text-[#0A0F2E] text-sm">"Rise of sovereign, agentic, and physical AI"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Readiness OS orchestrates agentic AI with human oversight</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="h-5 w-5 text-[#C9A84C]" />
                    <span className="font-bold text-[#0A0F2E] text-lg">World Economic Forum</span>
                  </div>
                  <div className="text-sm text-[#C9A84C] mb-3">Proof over Promise</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-1" />
                    <p className="text-[#0A0F2E] text-sm">"Organizations scaling AI into outcomes"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Readiness OS delivers measurable execution outcomes</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-5 w-5 text-[#C9A84C]" />
                    <span className="font-bold text-[#0A0F2E] text-lg">Microsoft</span>
                  </div>
                  <div className="text-sm text-[#C9A84C] mb-3">Agents Are Here</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-1" />
                    <p className="text-[#0A0F2E] text-sm">"Readiness requires people, process, culture, governance"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Readiness OS provides all four</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-5 w-5 text-[#C9A84C]" />
                    <span className="font-bold text-[#0A0F2E] text-lg">Google Cloud</span>
                  </div>
                  <div className="text-sm text-[#C9A84C] mb-3">AI Agent Trends 2026</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-1" />
                    <p className="text-[#0A0F2E] text-sm">"AI agents being used across industries"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Our 9 strategic domains cover the enterprise</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-5 w-5 text-[#2B8A6E]" />
                    <span className="font-bold text-[#0A0F2E] text-lg">Accenture</span>
                  </div>
                  <div className="text-sm text-[#2B8A6E] mb-3">New Rules of Platform Strategy</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-1" />
                    <p className="text-[#0A0F2E] text-sm">"Reinventing platform strategy for agentic AI"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Readiness OS is that platform</p>
                </CardContent>
              </Card>

              <Card className="bg-[#FEF2F2] border-[#dc2626]/20 hover:border-[#dc2626]/40 transition-all md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 bg-[#dc2626] shrink-0" />
                        <span className="font-bold text-[#0A0F2E] text-lg">Harvard Business Review</span>
                        <span className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">February 2026</span>
                      </div>
                      <div className="text-sm text-[#dc2626] font-semibold mb-3">AI Doesn't Reduce Work — It Intensifies It</div>
                      <div className="flex items-start gap-2 mb-3">
                        <Quote className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-1" />
                        <p className="text-[#0A0F2E] text-sm italic">"AI tools don't reduce work, they consistently intensify it. Without an AI practice, the natural tendency of AI-assisted work is not contraction but intensification — with implications for burnout, decision quality, and long-term sustainability."</p>
                      </div>
                      <p className="text-[#2B8A6E] text-sm font-semibold">→ Readiness OS is the AI practice at the enterprise coordination layer — pre-staged Readiness Protocols, decision gates, and sequenced execution phases with executive sign-off at every step.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Product Architecture Visual */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-[#0A0F2E]">
                Complete End-to-End Platform
              </h2>
              <p className="text-xl text-[#0A0F2E] max-w-3xl mx-auto">
                From signal detection to coordinated execution in 12 minutes — the full architecture that replaces 30-day mobilization scrambles
              </p>
            </div>
            <div style={{ background: '#0A0F2E', borderRadius: '0.15rem', padding: '36px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr 40px 1fr', gap: 0, alignItems: 'stretch', marginBottom: 24 }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.15rem', padding: 20 }}>
                  <div style={{ color: '#C9A84C', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.12em', fontSize: 11, marginBottom: 14 }}>SIGNAL SOURCES · 231 TRIGGERS</div>
                  {['External Data Feeds & RSS Velocity', 'SEC / Regulatory Filings', 'arXiv Research & Academic Signals', 'Internal Performance Indicators', 'Competitive Intelligence Feeds'].map(s => (
                    <div key={s} style={{ color: 'rgba(255,255,255,0.78)', fontSize: 12, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#C9A84C' }}>→</span>{s}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: 22, fontWeight: 700 }}>→</div>
                <div style={{ background: 'rgba(43,138,110,0.12)', border: '1px solid #2B8A6E', borderRadius: '0.15rem', padding: 20 }}>
                  <div style={{ color: '#C9A84C', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.12em', fontSize: 11, marginBottom: 14 }}>IDEA FRAMEWORK™ ENGINE</div>
                  {[
                    ['I', 'IDENTIFY', 'Pattern recognition · severity scoring'],
                    ['D', 'DETECT', 'Protocol matching · trigger classification'],
                    ['E', 'EXECUTE', 'Pre-staged task orchestration'],
                    ['A', 'ADVANCE', 'Continuous protocol refinement'],
                  ].map(([letter, title, desc]) => (
                    <div key={letter} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(43,138,110,0.2)' }}>
                      <span style={{ color: '#C9A84C', fontWeight: 700, fontSize: 14, minWidth: 16 }}>{letter}</span>
                      <div>
                        <div style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: 22, fontWeight: 700 }}>→</div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.15rem', padding: 20 }}>
                  <div style={{ color: '#C9A84C', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.12em', fontSize: 11, marginBottom: 14 }}>180 READINESS PROTOCOLS · 3 DOMAINS</div>
                  {[
                    ['GROWTH & POSITIONING', 'M&A, Competitor displacement, Market entry'],
                    ['RISK & RESILIENCE', 'Ransomware, Regulatory, Supply chain, Breach'],
                    ['TRANSFORMATION', 'Workforce, Go-to-market, Restructuring'],
                  ].map(([domain, desc]) => (
                    <div key={domain} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ color: '#2B8A6E', fontSize: 11, fontWeight: 700 }}>{domain}</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.12em', fontSize: 10, fontWeight: 700, marginBottom: 12 }}>EXECUTION OUTPUTS — PRE-STAGED BEFORE THE TRIGGER FIRES</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                  {[
                    ['Task Assignment', 'RACI matrix pre-built, zero scramble'],
                    ['Stakeholder Alerts', 'All contacts notified in seconds'],
                    ['Executive Brief', 'Board-ready documentation staged'],
                    ['Budget Framework', 'Pre-authorized spend estimates ready'],
                    ['War Room', 'Live coordination hub activated'],
                  ].map(([title, desc]) => (
                    <div key={title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.15rem', padding: '12px 10px', textAlign: 'center' }}>
                      <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, borderTop: '1px solid rgba(201,168,76,0.25)', paddingTop: 24 }}>
                {[
                  ['12 Minutes', 'Trigger to authorized execution', '#C9A84C'],
                  ['3,600×', 'Execution head start vs. 30-day cycle', '#2B8A6E'],
                  ['180', 'Pre-staged Readiness Protocols', '#C9A84C'],
                  ['231', 'Triggers monitored continuously', '#2B8A6E'],
                ].map(([stat, label, color]) => (
                  <div key={stat} style={{ textAlign: 'center' }}>
                    <div style={{ color, fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{stat}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 6 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#0A0F2E]" data-testid="heading-market">
                Massive Market Opportunity
              </h2>
              <p className="text-xl text-[#0A0F2E] max-w-3xl mx-auto" data-testid="text-market-subtitle">
                Creating a new $5B+ addressable market at the intersection of strategic planning, platform intelligence, and execution automation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2" data-testid="card-tam">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <Globe className="h-6 w-6 text-[#0A0F2E]" />
                    TAM (Total Addressable Market)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#0A0F2E] mb-2" data-testid="text-tam-value">$5B+</div>
                  <p className="text-[#0A0F2E]" data-testid="text-tam-description">
                    ~20,000 enterprises globally × $150K–$200K ACV (startup to Fortune 500 US · Forbes Global 2000 · PE-backed $500M+ revenue)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-sam">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <Target className="h-6 w-6 text-[#C9A84C]" />
                    SAM (Serviceable Addressable)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#C9A84C] mb-2" data-testid="text-sam-value">~$400M</div>
                  <p className="text-[#0A0F2E]" data-testid="text-sam-description">
                    startup to Fortune 500 US + Forbes Global 2000 ex-US · 2,000 enterprises × $200K ACV near-term reachable market
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-som">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <Rocket className="h-6 w-6 text-[#2B8A6E]" />
                    SOM (Serviceable Obtainable)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#2B8A6E] mb-2" data-testid="text-som-value">~$20M</div>
                  <p className="text-[#0A0F2E]" data-testid="text-som-description">
                    Year 5 target: 50 Founding Partners converted to full enterprise contracts at $200K+ ACV — 5% SAM capture
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Market Funnel Visualization */}
            <Card className="border-2 mb-8" data-testid="card-market-funnel">
              <CardHeader>
                <CardTitle className="text-[#0A0F2E]">Market Opportunity Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-4 space-y-5">
                  {[
                    { name: 'TAM — Total Addressable Market', label: '$5B+', barWidth: '100%', color: '#0A0F2E', sub: '~20,000 enterprises globally × $150K–$200K ACV' },
                    { name: 'SAM — Serviceable Addressable', label: '~$400M', barWidth: '62%', color: '#C9A84C', sub: 'Fortune 500 US + Forbes Global 2000 — 2,000 enterprises' },
                    { name: 'SOM — Year 5 Target', label: '~$20M', barWidth: '32%', color: '#2B8A6E', sub: '50 Founding Partners → full enterprise contracts at $200K+ ACV' },
                  ].map(({ name, label, barWidth, color, sub }) => (
                    <div key={name}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#0A0F2E' }}>{name}</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{label}</span>
                      </div>
                      <div style={{ width: barWidth, height: 28, background: color, borderRadius: '0 0.15rem 0.15rem 0' }} />
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 5, lineHeight: 1.4 }}>{sub}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-center text-sm text-[#0A0F2E]">
                  Bottom-up market sizing: $5B+ TAM · ~$400M SAM · ~$20M SOM (Year 5 target)
                </div>
              </CardContent>
            </Card>

            <div style={{ background: '#0A0F2E', border: '1px solid rgba(201,168,76,0.25)', padding: '40px 40px 36px' }} data-testid="card-why-now">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ height: 1, width: 24, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>Why Now — Three Structural Shifts</span>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 32 }} data-testid="heading-why-now">
                The window to own this category is open now — and narrowing.
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(201,168,76,0.1)' }}>
                {[
                  {
                    n: '01',
                    label: 'Microsoft put AI in every enterprise — with no operating model above it',
                    body: 'Every Fortune 500 now has Copilot, Azure OpenAI, and Teams Agents deployed at scale. None have the coordination layer to activate them when a strategic trigger fires. Readiness OS sits directly above the Microsoft stack — not competing with it, orchestrating it. The customer already paid for the infrastructure. We make it executable.',
                    accent: '#C9A84C',
                  },
                  {
                    n: '02',
                    label: 'Post-COVID proved that 30-day mobilization is an existential liability',
                    body: 'Supply chain shocks, regulatory velocity, activist investors, and cyber events compressed decision windows from weeks to hours. Organizations that survived had pre-staged responses. Those that didn\'t lost billions in containable costs. That institutional trauma is now boardroom-level budget authority for any solution that compresses the response cycle.',
                    accent: '#2B8A6E',
                  },
                  {
                    n: '03',
                    label: 'Continuous pattern detection is now economically viable for the first time',
                    body: 'Running 231 trigger patterns across real-time data streams — RSS, regulatory filings, market signals — requires inference at a cost point that didn\'t exist two years ago. The capability gap was never strategic vision; it was compute economics. That constraint lifted in 2024. We built the operating model layer on top of it immediately.',
                    accent: '#C9A84C',
                  },
                ].map(({ n, label, body, accent }) => (
                  <div key={n} style={{ background: '#060B1E', padding: '28px 26px' }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: accent, marginBottom: 14 }}>Shift {n}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: 14 }}>{label}</div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, margin: 0 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MARKET VALIDATION — MICROSOFT IS PROVING THE CATEGORY ────────── */}
        <section style={{ background: '#060B1E', padding: '72px 32px', borderTop: '1px solid rgba(0,120,212,0.2)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18, padding: '5px 18px', border: '1px solid rgba(91,163,232,0.3)', background: 'rgba(91,163,232,0.07)' }}>
                <div style={{ width: 5, height: 5, background: '#5BA3E8' }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: '#5BA3E8', fontWeight: 700 }}>
                  Market Signal · May 2026
                </span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
                Microsoft is proving the category exists.<br />
                <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>The strategic response layer remains unclaimed.</em>
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 680, margin: '0 auto', lineHeight: 1.7 }}>
                Microsoft's move to own the enterprise AI execution control plane — GitHub Copilot CLI, policy gates, approval workflows, cost governance — validates that enterprise execution governance is real budget. The investor thesis: Microsoft is building the floor. VaughnMartin builds the layer above it.
              </p>
            </div>

            {/* Two-column: What Microsoft is building vs. what's left open */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginBottom: 40 }}>
              <div style={{ background: '#0F1C3F', border: '1px solid rgba(0,120,212,0.3)', padding: '32px 28px' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: '#5BA3E8', fontWeight: 700, marginBottom: 16 }}>
                  What Microsoft Is Building
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 14, lineHeight: 1.2 }}>
                  The AI execution control plane for developer work
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                  {[
                    { label: 'GitHub Copilot CLI governance', sub: 'Who can use AI tools, under what policies' },
                    { label: 'Approval gate workflows', sub: 'Request → Policy Check → Authorization → Complete' },
                    { label: 'Cost management & auditability', sub: 'Per-request cost tracking, identity stamping' },
                    { label: 'Enterprise AI control plane', sub: 'Security, compliance, usage oversight' },
                  ].map(({ label, sub }) => (
                    <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 4, height: 4, background: '#5BA3E8', flexShrink: 0, marginTop: 5 }} />
                      <div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{label}</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(91,163,232,0.08)', border: '1px solid rgba(91,163,232,0.2)' }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: '#5BA3E8' }}>
                    Governs: "Can the AI tool run this task?"
                  </span>
                </div>
              </div>

              <div style={{ background: '#0A0F2E', border: '2px solid #C9A84C', padding: '32px 28px' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: '#C9A84C', fontWeight: 700, marginBottom: 16 }}>
                  What Remains Unclaimed — VaughnMartin's Layer
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 14, lineHeight: 1.2 }}>
                  The strategic response layer above the stack
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                  {[
                    { label: '180 Readiness Protocols pre-staged', sub: 'Plus 30 compound multi-threat scenarios — the library grows with every activation' },
                    { label: '231 trigger patterns monitored continuously', sub: 'Signal detected → protocol matched → exec notified' },
                    { label: 'Executive authorization gates', sub: 'AI monitors. Executives authorize. No autonomous action.' },
                    { label: '12-minute coordinated response', sub: '3,600× head start over the 30-day mobilization model' },
                  ].map(({ label, sub }) => (
                    <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 4, height: 4, background: '#C9A84C', flexShrink: 0, marginTop: 5 }} />
                      <div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{label}</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: '#C9A84C' }}>
                    Governs: "When the trigger fires — who does what, in 12 minutes?"
                  </span>
                </div>
              </div>
            </div>

            {/* The investor-framing callout */}
            <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', padding: '28px 36px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
              {[
                { stat: '$13B+', label: "Microsoft's AI infrastructure investment", sub: 'Proving enterprises will spend on execution governance' },
                { stat: '0', label: 'Vendors with a strategic response layer', sub: 'The floor is built. The layer above it is empty.' },
                { stat: '1', label: 'First mover in the unclaimed layer', sub: 'VaughnMartin — the operating model above the stack' },
              ].map(({ stat, label, sub }, i) => (
                <div key={stat} style={{ padding: '0 32px', textAlign: 'center' as const, borderLeft: i > 0 ? '1px solid rgba(201,168,76,0.15)' : 'none' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 700, color: '#C9A84C', lineHeight: 1, marginBottom: 8 }}>{stat}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, fontStyle: 'italic' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agentic AI Convergence */}
        <section className="py-16 px-6 bg-white text-[#0A0F2E]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="vm-section-label justify-center mb-4"><span>Last 6 Months</span></div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-4">
                12 Guides. 9 Firms. One Conclusion.
              </h2>
              <p className="text-lg text-[#0A0F2E] max-w-3xl mx-auto mb-6">
                The entire agentic AI landscape — from McKinsey to AWS to WEF — published in the last 6-8 months, all pointing at the same gap Readiness OS fills.
              </p>
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2B8A6E]">12</div>
                  <div className="text-[#0A0F2E] text-sm">Guides</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2B8A6E]">9</div>
                  <div className="text-[#0A0F2E] text-sm">Firms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2B8A6E]">6 mo</div>
                  <div className="text-[#0A0F2E] text-sm">Published</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2B8A6E]">1</div>
                  <div className="text-[#0A0F2E] text-sm">Conclusion</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#F8F7F4] border border-[#0A0F2E]/30 p-5">
                <div className="text-[#0A0F2E] font-bold text-sm mb-3 uppercase tracking-wider">Strategy</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">McKinsey</span> — State of AI reality check</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">PwC</span> — Making AI agents accretive to P&L</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">McKinsey</span> — The Agentic AI Opportunity</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">Accenture</span> — Six Insights for AI ROI</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8F7F4] border border-[#2B8A6E]/30 p-5">
                <div className="text-[#2B8A6E] font-bold text-sm mb-3 uppercase tracking-wider">Build</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">AWS</span> — Rise of Autonomous Agents</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">Bain</span> — AI's Next Operating Model</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">IBM</span> — Agentic AI Operating Model</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">Deloitte</span> — Agentic Enterprise 2028</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8F7F4] border border-[#C9A84C]/30 p-5">
                <div className="text-[#C9A84C] font-bold text-sm mb-3 uppercase tracking-wider">Leadership</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">BCG</span> — Machines That Manage Themselves</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">McKinsey</span> — The Agentic Organization</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">WEF</span> — AI Agents in Action</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A0F2E]"><span className="text-[#0A0F2E] font-medium">McKinsey</span> — Seizing the Agentic AI Advantage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bain Insight Block */}
            <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #2B8A6E", background: "#F8F7F4", marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                {/* Left — source + quote */}
                <div style={{ padding: "28px 28px 24px", borderRight: "1px solid #E8E4DC" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 20, height: 1.5, background: "#2B8A6E", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#2B8A6E" }}>Bain &amp; Company — AI's Next Operating Model, 2025</span>
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: "#0A0F2E", lineHeight: 1.4, fontStyle: "italic", marginBottom: 12 }}>
                    "Rediscovery is not continuity. A system that must reconstruct the state of the work each time cannot be said to carry the work forward."
                  </p>
                  <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6 }}>
                    Bain's 2025 analysis identifies the core failure of episodic AI: every trigger response requires the organization to re-assemble context, re-align stakeholders, and re-decide what matters — before execution can begin. The 30-day mobilization cycle is the rediscovery tax.
                  </p>
                </div>

                {/* Right — product value + customer value */}
                <div style={{ padding: "28px 28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#2B8A6E", marginBottom: 8 }}>What this means for the product</div>
                    <p style={{ fontSize: 13, color: "#0A0F2E", lineHeight: 1.6 }}>
                      Readiness OS eliminates the rediscovery tax entirely. 180 pre-staged Readiness Protocols mean the context, ownership, and decision logic exist <em>before</em> the trigger fires — not reconstructed after. The platform is the continuity layer Bain describes as missing.
                    </p>
                  </div>
                  <div style={{ width: "100%", height: 1, background: "#E8E4DC" }} />
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 8 }}>What this means for the customer</div>
                    <p style={{ fontSize: 13, color: "#0A0F2E", lineHeight: 1.6 }}>
                      The startup to Fortune 500 customer doesn't spend 30 days mobilizing. They respond in 12 minutes — because the institutional memory, ownership assignments, and execution sequence were built and rehearsed before pressure arrived. Every subsequent deployment compounds that advantage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#2B8A6E]/15 border border-[#2B8A6E]/50 text-center">
              <p className="text-[#2B8A6E] font-semibold mb-1">Every firm is consulting on the problem. Readiness OS built the product.</p>
              <p className="text-[#0A0F2E] text-sm">180 Readiness Protocols, 9 strategic domains, pre-defined governance — ready today.</p>
            </div>
          </div>
        </section>

        {/* Competitive Moat */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#0A0F2E]" data-testid="heading-moat">
                Defensible Competitive Moat
              </h2>
              <p className="text-xl text-[#0A0F2E] max-w-3xl mx-auto" data-testid="text-moat-subtitle">
                Multi-layered advantages that compound over time, creating winner-take-most dynamics
              </p>
            </div>

            <div style={{ background: "rgba(10,15,46,0.03)", border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", padding: "24px 28px", marginBottom: 40, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 12 }}>Research Foundation</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 600, color: "#0A0F2E", lineHeight: 1.45, marginBottom: 10, fontStyle: "italic" }}>
                "The competitor can buy the platform. They cannot buy the accumulated decision logic embedded in the preparation phase — because that logic is built by the organization itself, compounded across every deployment."
              </p>
              <p style={{ fontSize: 12, color: "#4B5563", marginBottom: 0 }}>
                Derived from Dr. Kerry Huang — ESI Top 1% Researcher, Forbes Business Council · 408-firm longitudinal study on governance, capability, and strategic execution. Technology alone has zero statistical relationship with collaboration improvement. Capability and governance compound. The competitor who buys a platform later starts the compounding clock later — permanently.
              </p>
            </div>

            {/* Bain Institutional Memory Callout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
              <div style={{ background: "rgba(43,138,110,0.05)", border: "1px solid #E8E4DC", borderLeft: "3px solid #2B8A6E", padding: "20px 22px" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#2B8A6E", marginBottom: 10 }}>Bain — Product Value</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#0A0F2E", lineHeight: 1.45, fontStyle: "italic", marginBottom: 10 }}>
                  "Organizations must address memory hygiene, permissioning, and knowledge portability — particularly who owns the institutional memory agents accumulate."
                </p>
                <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6 }}>
                  Readiness OS answers this directly: the enterprise owns its preparation history. Every Readiness Protocol rehearsal, every ownership acknowledgment, every challenge-rights exchange is embedded in the organization's preparation record — not locked in a vendor's platform.
                </p>
              </div>
              <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", padding: "20px 22px" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 10 }}>Bain — Customer Value</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#0A0F2E", lineHeight: 1.45, fontStyle: "italic", marginBottom: 10 }}>
                  "The economic logic changes with persistence: measure by context retained, rework eliminated, and institutional knowledge built."
                </p>
                <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6 }}>
                  For the startup to Fortune 500 customer, each deployment doesn't start from zero — it starts from accumulated readiness. The 12-minute response time improves with every trigger handled. The preparation compounds. That's a different ROI conversation than any point solution can offer.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2" data-testid="card-moat-ecosystem">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <Shield className="h-6 w-6 text-[#2B8A6E]" />
                    Complete 7-Component Ecosystem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0A0F2E] mb-4">
                    Competitors offer point solutions (BI tools, project management, chatbots). Readiness OS integrates entire strategic execution workflow—massive switching costs once embedded.
                  </p>
                  <div className="text-sm font-semibold text-[#2B8A6E]" data-testid="text-moat-ecosystem-advantage">
                    Advantage: 18-24 month integration lead vs. competitors
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-moat-memory">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <Lightbulb className="h-6 w-6 text-[#C9A84C]" />
                    Institutional Memory Network Effects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0A0F2E] mb-4">
                    Every activation compounds the organization's preparation record — decision logic, ownership assignments, and challenge history accumulate across every trigger handled. The moat is organizational capability, not platform capability. A competitor who buys the platform later starts the compounding clock later — permanently.
                  </p>
                  <div className="text-sm font-semibold text-[#2B8A6E]" data-testid="text-moat-memory-advantage">
                    Advantage: Preparation compounds — the organization's readiness depth is irreplicable
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-moat-living-system">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <Network className="h-6 w-6 text-[#2B8A6E]" />
                    Living Readiness Protocol System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0A0F2E] mb-4">
                    The entire platform IS the Readiness Protocol system — and it grows through team engagement. The 180 Readiness Protocols are the starting point, not the ceiling. Each activation, ownership acknowledgment, and challenge-rights exchange deepens the record. After 18 months, the organization's preparation intelligence is irreplicable — built from real trigger events, under real pressure, by their actual people.
                  </p>
                  <div className="text-sm font-semibold text-[#2B8A6E]" data-testid="text-moat-living-system-advantage">
                    Advantage: Preparation history compounds — no competitor can buy it retroactively
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-moat-category">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <Rocket className="h-6 w-6 text-[#2B8A6E]" />
                    Category Leadership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0A0F2E] mb-4">
                    First mover defining "Situational Readiness Platform" category (like Salesforce for CRM). Category creators capture 76% of market value (Gartner research).
                  </p>
                  <div className="text-sm font-semibold text-[#2B8A6E]" data-testid="text-moat-category-advantage">
                    Advantage: Brand moat—"Readiness OS" becomes verb for strategic execution
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Practitioners Named It First */}
        <section className="py-16 px-6" style={{ background: '#0A0F2E', position: 'relative', overflow: 'hidden' }}>
          {/* Grid overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
          <div className="max-w-7xl mx-auto" style={{ position: 'relative' }}>
            <div className="text-center mb-12">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 1, background: 'rgba(201,168,76,0.4)' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.8)' }}>Independent Validation</span>
                <div style={{ width: 32, height: 1, background: 'rgba(201,168,76,0.4)' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
                Practitioners Named It First
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                These conclusions were produced organically over a three-week period in April 2026. No one was asked to validate the product. Each arrived at the same structural diagnosis independently, from a different professional direction.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {[
                {
                  quote: "Martin is building the architecture that makes clarity possible before pressure arrives.",
                  name: "Dr. Kerry Huang",
                  title: "Fortune 50 AVP · ESI Top 1% Researcher · Forbes Council · 408-firm governance study",
                  context: "Published publicly on LinkedIn, April 2026 — naming Martin by name, to his full professional audience. Followed an earlier private exchange in which Dr. Huang independently described the platform as: 'That is governance as pre-commitment, not governance as review.'",
                  accent: '#C9A84C',
                },
                {
                  quote: "Speed is structural not technological. The constraint is not the layers. The response was never built before the trigger fired.",
                  name: "Raj Polanki",
                  title: "CIO · Board Member · AI Leadership Coach · NACD Director",
                  context: "A current CIO and NACD board director independently confirmed that organizational speed is an architecture problem, not a technology limitation.",
                  accent: '#2B8A6E',
                },
                {
                  quote: "Most organizations do not have a response-speed problem first. They have a predecision problem. If authority, sequencing, ownership, and fallback paths are not already defined, the trigger event just exposes that the operating model was never built for time-compressed execution.",
                  name: "Scott DeJarnette, PhD",
                  title: "Cybersecurity Strategist · CIO Advisor · Triple CCIE · Incident Response · M&A Integration",
                  context: "A PhD CIO advisor with incident response credentials independently named the predecision architecture problem.",
                  accent: '#C9A84C',
                },
                {
                  quote: "The gap between AI strategy and team execution is not a technology issue. It is an operating model issue.",
                  name: "Zhaohui Feng",
                  title: "Former CIO · 25 Years Enterprise IT · AI Strategy to Execution",
                  context: "Independently confirmed the Microsoft positioning argument: every enterprise has the AI stack, none have the operating model.",
                  accent: '#2B8A6E',
                },
              ].map((v, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `3px solid ${v.accent}`, padding: '28px 28px 24px' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(16px,1.6vw,20px)', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: 20 }}>
                    "{v.quote}"
                  </p>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: v.accent, marginBottom: 4 }}>— {v.name}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.68)', letterSpacing: '0.02em', marginBottom: 10 }}>{v.title}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.68)', lineHeight: 1.55 }}>{v.context}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.25)', borderLeft: '3px solid rgba(201,168,76,0.6)', padding: '36px 40px', maxWidth: 820, margin: '0 auto', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.7)' }}>Reposted Publicly · LinkedIn · April 20, 2026 · Full Post</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.2)' }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(17px,1.6vw,21px)', fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, marginBottom: 18 }}>
                "What four weeks of public intellectual exchange with Martin Brunke surfaced is that AwaCourage — awareness paired with the willingness to act before consensus arrives — and the architecture that makes this capacity possible at scale are two different governance functions. Same mechanism, opposite directions.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(17px,1.6vw,21px)', fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, marginBottom: 18 }}>
                Martin is building the architecture that makes clarity possible before pressure arrives. My research focuses on what determines whether that clarity actually converts into action when the system has not yet confirmed it is safe to move. Neither side replaces the other.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(17px,1.6vw,21px)', fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, marginBottom: 18 }}>
                Architecture creates the conditions where the choice to ignore is no longer invisible. AwaCourage determines whether the person actually moves on what the system has made visible. Both functions have to work, or neither does.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(17px,1.6vw,21px)', fontStyle: 'italic', color: 'rgba(201,168,76,0.95)', lineHeight: 1.75, marginBottom: 24, fontWeight: 600 }}>
                The boundary Martin named — between what architecture can supply and what only human capacity can carry — is where the next decade of governance work sits."
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18 }}>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(201,168,76,0.85)', letterSpacing: '0.06em', marginBottom: 4 }}>Dr. Kerry Huang</p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.68)', margin: 0 }}>Fortune 50 AVP · ESI Top 1% Researcher · Forbes Business Council · Posted to his full professional network, naming Martin Brunke by name</p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Positioning Visual */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-[#0A0F2E]">
                Built for Today. Positioned for Tomorrow.
              </h2>
              <p className="text-xl text-[#0A0F2E] max-w-3xl mx-auto">
                Selling pain relief today while building the operating layer for the AI era — infrastructure that evolves with every customer
              </p>
            </div>
            <div style={{ background: '#0A0F2E', borderRadius: '0.15rem', padding: '36px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', alignItems: 'stretch', marginBottom: 28 }}>
                <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.35)', borderRadius: '0.15rem 0 0 0.15rem', padding: 24 }}>
                  <div style={{ background: '#C9A84C', color: '#0A0F2E', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.12em', fontSize: 11, padding: '4px 12px', display: 'inline-block', marginBottom: 20 }}>PHASE 1: TODAY</div>
                  {[
                    ['The Pain:', '30-day mobilization scramble after every strategic trigger'],
                    ['The Solution:', 'Pre-staged Readiness Protocols — response ready before the trigger fires'],
                    ['The Value:', '12-minute execution. No mobilization cycle. No coordination delay.'],
                    ['The Proof:', '180 protocols · 231 triggers monitored continuously · Executive-authorized'],
                  ].map(([label, value]) => (
                    <div key={label as string} style={{ marginBottom: 16 }}>
                      <div style={{ color: '#C9A84C', fontWeight: 700, fontSize: 13 }}>{label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.5 }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2B8A6E', fontSize: 30 }}>▶</div>
                <div style={{ background: 'rgba(43,138,110,0.08)', border: '1px solid rgba(43,138,110,0.4)', borderRadius: '0 0.15rem 0.15rem 0', padding: 24 }}>
                  <div style={{ background: '#2B8A6E', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.12em', fontSize: 11, padding: '4px 12px', display: 'inline-block', marginBottom: 20 }}>PHASE 2: AS AI TRANSFORMS WORK</div>
                  {[
                    ['The Shift:', 'Every enterprise has Microsoft\'s AI stack. None have the operating model to use it.'],
                    ['The Need:', 'Operating model layer above every AI investment — not a tool, the orchestrator'],
                    ['Our Position:', 'Already embedded in executive governance before competitors recognize the category'],
                    ['The Moat:', 'Every activation deepens institutional memory — competitors start from zero'],
                  ].map(([label, value]) => (
                    <div key={label as string} style={{ marginBottom: 16 }}>
                      <div style={{ color: '#2B8A6E', fontWeight: 700, fontSize: 13 }}>{label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.5 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.12em', fontSize: 10, marginBottom: 12, borderBottom: '1px solid rgba(201,168,76,0.2)', paddingBottom: 10 }}>THE INFRASTRUCTURE BUILT TODAY BECOMES THE OPERATING LAYER TOMORROW</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '0.15rem', overflow: 'hidden' }}>
                  <div style={{ background: '#0A0F2E', padding: '8px 16px', fontWeight: 700, fontSize: 12, color: '#C9A84C' }}>Building Now</div>
                  <div style={{ background: '#0A0F2E', padding: '8px 16px', fontWeight: 700, fontSize: 12, color: '#2B8A6E' }}>Becomes Later</div>
                  {[
                    ['Pre-staged Readiness Protocols', 'Institutional knowledge layer — every activation teaches the next'],
                    ['Executive authorization workflow', 'Autonomous signal-to-execution with full human override'],
                    ['180 cross-industry protocols', 'Continuously refined adaptive protocol library'],
                    ['Pattern detection across 231 triggers', 'Predictive readiness — threats anticipated before they materialize'],
                  ].flatMap(([now, later], i) => [
                    <div key={`now-${i}`} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 16px', fontSize: 13, color: 'rgba(255,255,255,0.8)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>{now}</div>,
                    <div key={`later-${i}`} style={{ background: 'rgba(43,138,110,0.06)', padding: '10px 16px', fontSize: 13, color: 'rgba(255,255,255,0.8)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>{later}</div>,
                  ])}
                </div>
                <div style={{ textAlign: 'center', marginTop: 24, color: '#C9A84C', fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: 'italic', fontWeight: 600 }}>
                  "The response is ready before the trigger fires."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#0A0F2E]" data-testid="heading-model">
                High-Margin SaaS Business Model
              </h2>
              <p className="text-xl text-[#0A0F2E] max-w-3xl mx-auto" data-testid="text-model-subtitle">
                Enterprise pricing with expansion revenue and sticky product-led growth
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-[#E8E4DC] border-2" data-testid="card-pricing-enterprise">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <DollarSign className="h-6 w-6 text-[#2B8A6E]" />
                    Core
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#2B8A6E] mb-2" data-testid="text-price-enterprise">$150K</div>
                  <div className="text-sm text-[#0A0F2E] mb-4">Annual Contract Value</div>
                  <ul className="space-y-2 text-sm text-[#0A0F2E]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                      Full 180-Protocol Library
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                      Standard integrations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                      Dedicated CSM
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-[#E8E4DC] border-2" data-testid="card-pricing-team">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <Users className="h-6 w-6 text-[#0A0F2E]" />
                    Foresight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#0A0F2E] mb-2" data-testid="text-price-team">$250K</div>
                  <div className="text-sm text-[#0A0F2E] mb-4">Annual Contract Value</div>
                  <ul className="space-y-2 text-sm text-[#0A0F2E]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0A0F2E]" />
                      Digital Twin simulation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0A0F2E]" />
                      Predictive foresight alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0A0F2E]" />
                      Priority support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-[#C9A84C] border-2" data-testid="card-pricing-executive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                    <TrendingUp className="h-6 w-6 text-[#C9A84C]" />
                    Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#C9A84C] mb-2" data-testid="text-price-executive">$450K</div>
                  <div className="text-sm text-[#0A0F2E] mb-4">Annual Contract Value</div>
                  <ul className="space-y-2 text-sm text-[#0A0F2E]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" />
                      Multi-region orchestration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" />
                      White-glove implementation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" />
                      Dedicated account team
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#F8F7F4] border-[#E8E4DC] border-2" data-testid="card-expansion">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-[#0A0F2E]" data-testid="heading-expansion">
                  Expansion Revenue Streams
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div data-testid="expansion-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-[#2B8A6E]" />
                      <div className="font-semibold text-[#0A0F2E]">Integration Marketplace</div>
                    </div>
                    <div className="text-[#0A0F2E]">20% rev-share on third-party integrations (Salesforce, Jira, Slack)</div>
                  </div>
                  <div data-testid="expansion-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-[#0A0F2E]" />
                      <div className="font-semibold text-[#0A0F2E]">Premium Templates</div>
                    </div>
                    <div className="text-[#0A0F2E]">Industry-specific Readiness Protocols ($5K-$50K per template pack)</div>
                  </div>
                  <div data-testid="expansion-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-5 w-5 text-[#C9A84C]" />
                      <div className="font-semibold text-[#0A0F2E]">Advisory Services</div>
                    </div>
                    <div className="text-[#0A0F2E]">Strategic workshops ($50K-$200K per engagement)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Unit Economics */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#0A0F2E]" data-testid="heading-economics">
                Enterprise SaaS Unit Economics
              </h2>
              <p className="text-xl text-[#0A0F2E] max-w-3xl mx-auto" data-testid="text-economics-subtitle">
                Infrastructure-category retention with platform-category expansion — the combination that produces durable LTV
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-[#E8E4DC] border-2" data-testid="card-ltv-cac">
                <CardContent className="pt-6">
                  <div className="text-sm text-[#0A0F2E] mb-2">LTV:CAC Ratio</div>
                  <div className="text-4xl font-bold text-[#2B8A6E] mb-1" data-testid="text-ltv-cac">8.4:1</div>
                  <div className="text-xs text-[#0A0F2E]">Target: &gt;3:1 (Exceptional)</div>
                </CardContent>
              </Card>

              <Card className="border-[#E8E4DC] border-2" data-testid="card-payback">
                <CardContent className="pt-6">
                  <div className="text-sm text-[#0A0F2E] mb-2">CAC Payback</div>
                  <div className="text-4xl font-bold text-[#0A0F2E] mb-1" data-testid="text-payback">7 months</div>
                  <div className="text-xs text-[#0A0F2E]">Target: &lt;12mo (Excellent)</div>
                </CardContent>
              </Card>

              <Card className="border-[#E8E4DC] border-2" data-testid="card-ndr">
                <CardContent className="pt-6">
                  <div className="text-sm text-[#0A0F2E] mb-2">Net Dollar Retention</div>
                  <div className="text-4xl font-bold text-[#C9A84C] mb-1" data-testid="text-ndr">142%</div>
                  <div className="text-xs text-[#0A0F2E]">Target: &gt;120% (Infrastructure-tier retention)</div>
                </CardContent>
              </Card>

              <Card className="border-[#E8E4DC] border-2" data-testid="card-gross-margin">
                <CardContent className="pt-6">
                  <div className="text-sm text-[#0A0F2E] mb-2">Gross Margin</div>
                  <div className="text-4xl font-bold text-[#0A0F2E] mb-1" data-testid="text-gross-margin">87%</div>
                  <div className="text-xs text-[#0A0F2E]">Target: &gt;80% (Premium SaaS)</div>
                </CardContent>
              </Card>
            </div>

            {/* LTV:CAC Trend Chart */}
            <Card className="border-[#E8E4DC] border-2 mt-8" data-testid="card-ltv-cac-trend">
              <CardHeader>
                <CardTitle className="text-[#0A0F2E]">LTV:CAC Ratio Growth Trajectory</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={ltvCacTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-[#E8E4DC]" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0F2E', border: 'none', borderRadius: '8px', color: 'white' }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="ratio" stroke="#2B8A6E" strokeWidth={3} name="LTV:CAC Ratio" dot={{ fill: '#2B8A6E', r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="ltv" stroke="#0A0F2E" strokeWidth={2} name="LTV ($K)" />
                    <Line yAxisId="right" type="monotone" dataKey="cac" stroke="#C9A84C" strokeWidth={2} name="CAC ($K)" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center text-sm text-[#0A0F2E]">
                  LTV:CAC improving from 3.2:1 (Y1) to 8.4:1 (Y5) as scale economics kick in
                </div>
              </CardContent>
            </Card>

            {/* ROI Breakdown Chart */}
            <Card className="border-[#E8E4DC] border-2 mt-8" data-testid="card-roi-breakdown">
              <CardHeader>
                <CardTitle className="text-[#0A0F2E]">$12.4M Annual ROI Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={roiBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: $${value}M`}
                          outerRadius={100}
                          fill="#C9A84C"
                          dataKey="value"
                        >
                          {roiBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `$${value}M`}
                          contentStyle={{ backgroundColor: '#0A0F2E', border: 'none', borderRadius: '8px', color: 'white' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-[#2B8A6E]"></div>
                        <div className="font-semibold text-[#0A0F2E]">Cost Savings: $7.2M</div>
                      </div>
                      <div className="text-sm text-[#0A0F2E]">
                        Eliminated coordination delays, reduced strategic initiative failures
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-[#0A0F2E]"></div>
                        <div className="font-semibold text-[#0A0F2E]">Time Recovery: $3.4M</div>
                      </div>
                      <div className="text-sm text-[#0A0F2E]">
                        342 hours saved monthly, valued at executive time rates
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-[#C9A84C]"></div>
                        <div className="font-semibold text-[#0A0F2E]">Risk Mitigation: $1.8M</div>
                      </div>
                      <div className="text-sm text-[#0A0F2E]">
                        Prevented strategic missteps through pre-staged trigger detection — signals surfaced before the mobilization window closed
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Board-Grade Reporting Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="vm-section-label justify-center mb-6"><span>Board-Grade Reporting</span></div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 700, color: '#0A0F2E', marginBottom: 12, lineHeight: 1.1 }}>
                Reporting your board already expects.<br />
                <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Readiness OS produces it automatically.</em>
              </h2>
              <p style={{ fontSize: 16, color: '#4B5563', maxWidth: 580, margin: '0 auto' }}>
                Every activation generates a board-ready evidence package — no manual assembly, no retrospective guesswork.
              </p>
            </div>
            <div className="grid md:grid-cols-5 gap-0 border border-[#E8E4DC] mb-10">
              {[
                { metric: "Activation Timeline", desc: "Timestamped execution record from signal detection through final acknowledgment — audit-ready on demand.", accent: '#0A0F2E' },
                { metric: "Ownership Acknowledgment", desc: "Named stakeholder confirmation log. Who was notified, who confirmed, when — no ambiguity for governance review.", accent: '#2B8A6E' },
                { metric: "Decision Velocity", desc: "Elapsed time from trigger detection to executive authorization. The 12-minute benchmark, measured against your actual result.", accent: '#C9A84C' },
                { metric: "Value Preserved", desc: "Risk avoided and opportunity cost of speed — framed in financial terms your CFO and board will recognize immediately.", accent: '#2B8A6E' },
                { metric: "Audit-Ready Export", desc: "One-click board export. PDF-formatted activation debrief with classification, outcome, and recommended next steps.", accent: '#0A0F2E' },
              ].map((item, i) => (
                <div key={item.metric} style={{ padding: '28px 20px', borderRight: i < 4 ? '1px solid #E8E4DC' : 'none', borderTop: `3px solid ${item.accent}` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: item.accent, marginBottom: 10 }}>0{i + 1}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: '#0A0F2E', marginBottom: 10, lineHeight: 1.3 }}>{item.metric}</div>
                  <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ background: '#0A0F2E', padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                  Make board confidence a product outcome — not a PowerPoint exercise.
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Board Export and Activation Debrief are live features in the Readiness OS platform.</p>
              </div>
              <a href="/executive-brief" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '12px 24px', background: '#C9A84C', color: '#0A0F2E', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
                View Executive Brief →
              </a>
            </div>
          </div>
        </section>

        {/* Founding Partner Program Section */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="vm-section-label justify-center mb-6"><span>Founding Partner Program</span></div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, color: '#0A0F2E', marginBottom: 16, lineHeight: 1.1 }}>
                Two Organizations.<br />90-Day Validation Partnership.
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 17, color: '#4B5563', maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
                We are selecting two organizations to deploy Readiness OS as Founding Partners. This is not a free trial. It is a structured commercial validation with defined milestones, executive involvement, and a conversion conversation at day 90.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Day 30', value: 'Deployed', sub: 'Protocols live · Stakeholders mapped · First trigger monitored', accent: '#0A0F2E' },
                { label: 'Day 60', value: 'Validated', sub: 'Structured progress review · Execution data on the table', accent: '#C9A84C' },
                { label: 'Day 90', value: 'Decision', sub: 'Conversion conversation · Reference commitment regardless of outcome', accent: '#2B8A6E' },
              ].map(m => (
                <div key={m.label} className="text-center py-10 px-6 border border-[#E8E4DC] bg-white" style={{ borderTopColor: m.accent, borderTopWidth: 3 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4vw,48px)', fontWeight: 700, color: m.accent, lineHeight: 1, marginBottom: 8 }}>{m.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#0A0F2E', marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{m.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white border border-[#E8E4DC] p-6">
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#0A0F2E', marginBottom: 16 }}>What the Partner Gets</div>
                {[
                  { item: 'Full platform deployment across your highest-priority triggers', color: '#2B8A6E' },
                  { item: 'Readiness Protocols mapped to your strategic domain and org structure', color: '#2B8A6E' },
                  { item: 'Direct access to the founder throughout the 90-day engagement', color: '#2B8A6E' },
                  { item: 'Founding Partner pricing locked for the life of the contract', color: '#C9A84C' },
                  { item: 'Co-authorship of the category narrative — your activation becomes the proof', color: '#C9A84C' },
                ].map((u, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-[#F0EDE4] last:border-0">
                    <div style={{ width: 3, minHeight: 20, marginTop: 2, background: u.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: '#0A0F2E', fontWeight: 500, lineHeight: 1.5 }}>{u.item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#E8E4DC] p-6">
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#0A0F2E', marginBottom: 16 }}>What We Ask in Return</div>
                {[
                  { mo: '30 days', label: 'Defined onboarding with protocol deployment milestones completed', color: '#2B8A6E' },
                  { mo: '60 days', label: 'Structured progress conversation with executive sponsor present', color: '#C9A84C' },
                  { mo: '90 days', label: 'Conversion conversation — and a reference regardless of outcome', color: '#0A0F2E' },
                ].map(m => (
                  <div key={m.mo} className="flex items-start gap-4 py-4 border-b border-[#F0EDE4] last:border-0">
                    <div style={{ fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: '0.06em', minWidth: 52, paddingTop: 1 }}>{m.mo}</div>
                    <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{m.label}</p>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: '14px 16px', background: '#F0EDE4', borderLeft: '3px solid #C9A84C' }}>
                  <p style={{ fontSize: 13, color: '#0A0F2E', lineHeight: 1.6, margin: 0 }}>
                    This is not free. It is a structured commercial validation with deferred payment — designed so both sides know exactly what success looks like before the contract is signed.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: '#0A0F2E', padding: '36px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' as const }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 6 }}>
                  Two seats. One conversation.
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', maxWidth: 480, lineHeight: 1.6 }}>
                  If your organization faces the kind of strategic triggers Readiness OS was built for — and you want to be the organization that proves the category — this is the conversation to have.
                </div>
              </div>
              <a href="/contact" style={{ flexShrink: 0, display: 'inline-block', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '18px 40px', background: '#C9A84C', color: '#0A0F2E', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
                Apply for Founding Partner Access
              </a>
            </div>
          </div>
        </section>

        {/* ── Product Roadmap: Phase 1 → Phase 2 ── */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="vm-section-label justify-center mb-5"><span>Product Roadmap</span></div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.15, marginBottom: 16 }}>
                Two phases. One thesis. Expanding market.
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 17, color: '#4B5563', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
                The same preparation infrastructure applied first to external triggers, then to internal strategic initiative deployment — the two places where enterprise execution breaks most often.
              </p>
            </div>

            {/* Phase comparison grid */}
            <div className="grid md:grid-cols-2 gap-0 mb-12" style={{ border: '1px solid #E8E4DC' }}>

              {/* Phase 1 */}
              <div style={{ borderRight: '1px solid #E8E4DC', padding: '40px 44px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#2B8A6E', marginBottom: 6 }}>Phase 1 — Now</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#0A0F2E', margin: 0, lineHeight: 1.2 }}>External Trigger Response</h3>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', padding: '4px 10px', background: '#2B8A6E', color: '#fff', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>Live · Pre-Revenue</span>
                </div>

                <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #F0EDE4' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0F2E', marginBottom: 8, letterSpacing: '0.03em' }}>The failure mode this solves:</div>
                  <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.7, margin: 0 }}>
                    A strategic event fires — activist investor, ransomware, regulatory inquiry, competitive disruption. The enterprise spends 30 days just mobilizing: who's in the room, what's the plan, who owns what. Execution hasn't started. The window is already closing.
                  </p>
                </div>

                <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F0EDE4' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#2B8A6E', marginBottom: 8 }}>The fix:</div>
                  <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.7, margin: 0 }}>
                    Pre-stage 180 responses before the trigger fires. When the signal crosses the confidence threshold, the Readiness Protocol is already built, stakeholders pre-assigned, and executive authorization takes 8 minutes — not 30 days.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { n: '231', l: 'Trigger types monitored' },
                    { n: '180', l: 'Pre-staged Readiness Protocols' },
                    { n: '12 min', l: 'Signal to execution' },
                  ].map(s => (
                    <div key={s.n} style={{ textAlign: 'center' as const, padding: '14px 8px', background: '#F8F7F4', border: '1px solid #E8E4DC' }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#2B8A6E', lineHeight: 1 }}>{s.n}</div>
                      <div style={{ fontSize: 10, color: '#6B7280', marginTop: 4, lineHeight: 1.4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: '#0A0F2E' }}>Scenarios covered: </span>
                  Activist investor · Regulatory inquiry · Ransomware · Competitive disruption · Supply chain failure · Leadership transition · M&A event · Market entry
                </div>
              </div>

              {/* Phase 2 */}
              <div style={{ padding: '40px 44px', background: '#FAFAF8' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 6 }}>Phase 2 — 2026–2027</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#0A0F2E', margin: 0, lineHeight: 1.2 }}>Internal Initiative Deployment</h3>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', padding: '4px 10px', background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.35)', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>Roadmap</span>
                </div>

                <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #E8E4DC' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0F2E', marginBottom: 8, letterSpacing: '0.03em' }}>The failure mode this solves:</div>
                  <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.7, margin: 0 }}>
                    Months of strategy work. SVP sign-off. GTM fully built — campaigns, training, enablement, field communication. Launch happens. Six weeks later: adoption is 40% of projection. The strategy didn't fail. GTM didn't fail. Execution broke at the handoff between what was approved and what changed at the frontline.
                  </p>
                </div>

                <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #E8E4DC' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#C9A84C', marginBottom: 8 }}>The fix:</div>
                  <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.7, margin: 0 }}>
                    Same preparation thesis applied inward. Before the SVP signs off, pre-stage what changes in the rep's day, how it shows up in comp, what managers reinforce in 1:1s, and what gets deprioritized. Ownership is built in the preparation phase — not assumed at launch.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { n: '10–25', l: 'Major initiatives per enterprise per year' },
                    { n: '40%', l: 'Average adoption gap at 90 days' },
                    { n: '10×', l: 'Larger market than external triggers alone' },
                  ].map(s => (
                    <div key={s.n} style={{ textAlign: 'center' as const, padding: '14px 8px', background: '#fff', border: '1px solid #E8E4DC' }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>{s.n}</div>
                      <div style={{ fontSize: 10, color: '#6B7280', marginTop: 4, lineHeight: 1.4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: '#0A0F2E' }}>Scenarios covered: </span>
                  Product launch · Pricing change · M&A integration · Org restructuring · New market entry · Sales model shift · Platform migration · Culture initiative
                </div>
              </div>
            </div>

            {/* Connecting thesis line */}
            <div style={{ background: '#0A0F2E', padding: '32px 44px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' as const }}>
              <div style={{ width: 3, height: 56, background: '#C9A84C', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.6)', marginBottom: 10 }}>The unifying thesis</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px,2vw,24px)', fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.5, fontStyle: 'italic' as const }}>
                  "Same platform. Same preparation thesis. The failure mode is identical — the handoff between what was approved and what actually executed at the front line."
                </p>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' as const }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.68)', marginBottom: 6 }}>Total addressable expansion</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>$5B+</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Total addressable market</div>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Questions, Answered */}
        <section className="py-20 px-6 bg-[#F8F7F4]">
          <div className="max-w-4xl mx-auto">
            <div className="vm-section-label justify-center mb-6"><span>Due Diligence</span></div>
            <h2 className="text-center mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px,4vw,44px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2 }}>
              Executive Questions, Answered
            </h2>
            <p className="text-center mb-14" style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>
              The questions serious investors and enterprise buyers ask — before they move.
            </p>
            <div style={{ display: 'grid', gap: 2 }}>
              {[
                {
                  q: "What problem are you solving?",
                  a: "Organizations can detect a strategic situation in seconds. They still take 30 days to mobilize a coordinated response. Not because they lack intelligence or talent. Because the mobilization architecture doesn't exist. Who owns the response. Who authorizes the first action. What the sequence is. What gets communicated and when. That gap destroys value every time a situation demands speed.",
                  proof: "30-day mobilization cycle compressed to 12 minutes.",
                },
                {
                  q: "Why is it a must-solve?",
                  a: "Every day of mobilization delay has a cost. Regulatory exposure compounds. The narrative moves to someone else. The competitive window closes. The activist controls the story before the board has a briefing. This is not a nice-to-have. Every organization in the Fortune 500 has experienced this loss. Most have accepted it as unavoidable. It isn't.",
                  proof: "The cost compounds daily. The window that closes rarely reopens.",
                },
                {
                  q: "Why your product?",
                  a: "Because Readiness OS is built specifically for the mobilization gap — not retrofitted onto it. The system monitors continuously. It matches situations to pre-staged Readiness Protocols. It stages the stakeholder chain, the authority path, the communications. The executive authorizes in one decision. Execution is live in 12 minutes. The response was built before the moment arrived. No other platform is designed around that sequence.",
                  proof: "Not competing with Copilot. Competing with the 40-year-old meeting-heavy operating model itself.",
                },
                {
                  q: "How does it solve it?",
                  a: "The system ingests signals across eight sources, 231 patterns, every 15 minutes. When a situation crosses threshold it matches to a pre-staged Readiness Protocol — stakeholders assigned, budget pre-approved, communications ready. The executive sees the brief and authorizes. War room is live. Twelve minutes. Every activation encodes what held and what didn't into institutional memory, so the next response is faster and more precise.",
                  proof: "3,600× Execution Head Start. The gap before any competitor has aligned stakeholders.",
                },
                {
                  q: "What about competitors?",
                  a: "We sit above the existing stack, not inside it. ServiceNow routes tasks after people agree on what to do. We stage the alignment before the situation arrives. Microsoft Copilot produces intelligence. We produce the operating model that acts on it. Incident management consultants arrive after the call. We were ready before the first email was sent. The real competitor isn't a software vendor. It's the status quo — email threads, war room meetings, and retainer consultants who arrive after the fact.",
                  proof: "Every enterprise has Microsoft's AI stack. None have the operating model to use it.",
                },
                {
                  q: "Is this replacing our current stack?",
                  a: "No. Readiness OS is the operating model layer above your existing systems — Microsoft, Jira, ServiceNow, collaboration tools. No rip-and-replace required. Value is demonstrable before deep integration begins.",
                  proof: "Overlay architecture, not replacement architecture. Deployment risk is low.",
                },
                {
                  q: "Is the system making decisions for us?",
                  a: "No. The system monitors signals and prepares context. Executives authorize activation. Authority stays human at every step — governance and decision authority are explicit, auditable, and pre-staged. No Readiness Protocol activates without executive sign-off.",
                  proof: "AI monitors. Executives authorize. Executive authority preserved at every step.",
                },
                {
                  q: "How do we evaluate this before committing?",
                  a: "Qualified prospects receive a 48-hour guided evaluation workspace — pre-seeded with realistic data, core workflow enabled, executive authorization simulation live. You run a full Activist Investor or Ransomware response from signal to war room in 12 minutes inside the evaluation environment. By the time you apply for a Founding Partner seat, you've already experienced the product.",
                  proof: "180 pre-staged Readiness Protocols. Activation, acknowledgment, and debrief loops — all measurable inside the evaluation.",
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderTop: i === 0 ? '1px solid #E8E4DC' : 'none', borderBottom: '1px solid #E8E4DC', borderLeft: '1px solid #E8E4DC', borderRight: '1px solid #E8E4DC' }}>
                  <div style={{ padding: '28px 28px', borderRight: '1px solid #E8E4DC', background: '#fff' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 10 }}>Q{String(i + 1).padStart(2, '0')}</div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: '#0A0F2E', lineHeight: 1.45, margin: 0 }}>{item.q}</p>
                  </div>
                  <div style={{ padding: '28px 32px', background: '#FAFAF8' }}>
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, marginBottom: 14 }}>{item.a}</p>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ width: 16, height: 1.5, background: '#C9A84C', marginTop: 8, flexShrink: 0 }} />
                      <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>{item.proof}</p>
                    </div>
                    {(i === 2 || i === 7) && (
                      <div style={{ marginTop: 20 }}>
                        <a href="/request-access" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2B8A6E', textDecoration: 'none', borderBottom: '1px solid rgba(43,138,110,0.3)', paddingBottom: 2 }}>
                          Apply for Founding Partner Access →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40, padding: '32px 40px', background: '#0A0F2E', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
                The response is ready before the trigger fires.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 24, letterSpacing: '0.06em' }}>
                AI monitors · Executives authorize · Execution pre-staged
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/contact" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '12px 28px', background: '#C9A84C', color: '#0A0F2E', textDecoration: 'none', display: 'inline-block' }}>
                  Schedule a Conversation →
                </a>
                <a href="/12-minute-experience" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '12px 28px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', display: 'inline-block' }}>
                  See It Execute in 12 Minutes →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Category Window Urgency */}
        <section style={{ background: '#0A0F2E', borderTop: '1px solid rgba(201,168,76,0.15)', padding: '72px 32px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: 'rgba(201,168,76,0.5)' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.8)' }}>Category Window</span>
              <div style={{ width: 28, height: 1, background: 'rgba(201,168,76,0.5)' }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
              The category is open.<br />
              <em style={{ color: '#C9A84C' }}>It will not stay open.</em>
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(240,237,228,0.65)', lineHeight: 1.75, maxWidth: 700, marginBottom: 48 }}>
              ServiceNow, Microsoft, and Salesforce are each one product decision away from naming this layer. The enterprise coordination gap is real, board-visible, and expensive — every platform vendor knows it. What they don't have yet is an operating model purpose-built for it. That is the window. The organization that names "readiness infrastructure" first — and proves it at scale — captures category economics that compound for a decade.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {[
                {
                  label: 'What incumbents have',
                  items: ['Detection tools (SIEM, monitoring)', 'Task routing (ServiceNow, Jira)', 'AI intelligence (Copilot, Claude)', 'Dashboards and reporting'],
                  verdict: 'They detect. They route. They summarize.',
                  verdictColor: 'rgba(192,57,43,0.8)',
                },
                {
                  label: 'What incumbents are missing',
                  items: ['Pre-staged ownership by trigger', 'Authority chains pre-approved', 'Budget pre-authorized by scenario', 'Institutional memory across activations'],
                  verdict: 'No one owns the mobilization layer.',
                  verdictColor: '#C9A84C',
                },
                {
                  label: 'What moves first mover wins',
                  items: ['Category name recognition', 'Institutional memory moat', 'Executive-level brand trust', 'Protocol library network effects'],
                  verdict: 'Category creators capture 76% of market value.',
                  verdictColor: '#2B8A6E',
                },
              ].map((col, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '28px 24px', borderTop: `2px solid ${i === 1 ? '#C9A84C' : 'rgba(255,255,255,0.1)'}` }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.6)', marginBottom: 18 }}>{col.label}</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 20 }}>
                    {col.items.map(item => (
                      <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, flexShrink: 0, marginTop: 1 }}>→</span>
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: col.verdictColor, lineHeight: 1.4 }}>
                    {col.verdict}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, padding: '20px 28px', background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#C9A84C', flexShrink: 0 }}>The thesis:</span>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(240,237,228,0.8)', lineHeight: 1.6 }}>Every enterprise already bought the detection stack. Every enterprise already bought the AI stack. None have the operating model that acts on them. Readiness OS is that layer — and the first organization to own "readiness infrastructure" as a category will hold it the way Salesforce held CRM.</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-[#0A0F2E] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A84C] mb-4">Ready to Move Forward</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="heading-cta">
              Let's Build This Together
            </h2>
            <p className="text-xl mb-4 text-white/80" data-testid="text-cta-description">
              Readiness OS is defining the Situational Readiness Platform category — a $5B+ addressable market with winner-take-most dynamics. Early investors gain exposure to category creation with defensible moats and exceptional unit economics.
            </p>
            <p className="text-base mb-10 text-white/60">
              Schedule a conversation with the VaughnMartin founding team to review our full investment deck, pipeline metrics, and strategic roadmap.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Button
                size="lg"
                onClick={() => setLocation("/contact")}
                className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold"
                data-testid="button-cta-schedule"
              >
                Schedule a Conversation
              </Button>
              <Button
                size="lg"
                onClick={() => setLocation("/executive-demo-walkthrough")}
                className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
                data-testid="button-cta-demo"
              >
                Experience the Platform
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/investor-resources")}
                className="border-white/20 text-white hover:bg-white/10"
                data-testid="button-cta-resources"
              >
                Investor Resources
              </Button>
              <a
                href="/product-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#C9A84C]/30 text-[#C9A84C]/85 hover:border-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors px-6 py-3 text-sm font-bold tracking-widest uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", textDecoration: 'none' }}
                data-testid="button-download-overview"
              >
                ↓ Product Overview
              </a>
            </div>
            <p className="text-sm text-white/40">
              VaughnMartin · Situational Readiness Platform · <span className="text-[#C9A84C]">info@vaughnmartin.com</span>
            </p>
          </div>
        </section>
    </PageLayout>
  );
}
