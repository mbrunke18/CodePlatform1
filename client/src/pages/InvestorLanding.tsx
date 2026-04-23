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
const productArchitectureImg = "/images/product-architecture.png";
const futurePositioningImg = "/images/future-positioning.png";
import { 
  BarChart, 
  Bar, 
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

// Market funnel data
const marketFunnelData = [
  { name: 'TAM', value: 127, label: '$127B', color: '#0A0F2E' },
  { name: 'SAM', value: 38, label: '$38B', color: '#C9A84C' },
  { name: 'SOM', value: 1.9, label: '$1.9B', color: '#2B8A6E' }
];

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
            
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 700, marginBottom: 16, lineHeight: 1.1, maxWidth: 900, margin: '0 auto 16px', color: '#fff' }} data-testid="heading-hero">
              The Salesforce Moment for Strategic Readiness
            </h1>
            
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, fontStyle: 'italic', color: '#C9A84C', marginBottom: 20 }} data-testid="text-tagline">
              The response is ready before the trigger fires.
            </p>
            
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(18px,2vw,24px)', fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: 16, maxWidth: 760, margin: '0 auto 16px', lineHeight: 1.55 }}>
              The problem isn't strategy, talent, or AI tools. It's that no enterprise has the infrastructure to make the response ready before the trigger fires. We built it.
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.60)', marginBottom: 36, maxWidth: 760, margin: '0 auto 36px', lineHeight: 1.7 }} data-testid="text-description">
              Fortune 1000 companies spend $847B annually on strategic initiatives — 83% fail due to execution gaps. Readiness OS creates a new software category worth $127B TAM, delivering a 3,600× Execution Head Start: while rivals are still mobilizing weeks later, Readiness OS customers are already deep into coordinated response — in 12 minutes.
            </p>

            {/* VaughnMartin Thesis Block */}
            <div className="max-w-3xl mx-auto mb-10 border border-[#C9A84C]/30 bg-white/5 backdrop-blur-sm p-8 text-left">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A84C] mb-4">The VaughnMartin Thesis</div>
              <p className="text-base text-white/90 leading-relaxed mb-3 font-medium">
                The way enterprises work was designed for a world without AI. Committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act alone.
              </p>
              <p className="text-base text-white/70 leading-relaxed mb-3">
                AI changed the constraint. But every vendor bolted AI onto the old model — faster spreadsheets, smarter summaries, better notes from the same slow meetings. The bureaucracy stays. The latency stays.
              </p>
              <p className="text-base font-bold leading-relaxed" style={{ color: '#C9A84C' }}>
                VaughnMartin redesigned how work flows from first principles for the AI era. Pre-staged prepared responses replace real-time coordination. Pattern detection replaces committee deliberation. 12-minute execution replaces 30-day alignment cycles.
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/50 italic">
                We're not competing with Copilot or other AI tools. We're competing with the way work is organized — the meeting-heavy, alignment-slow operating model Fortune 1000s have been running for 40 years.
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={() => window.location.href = 'mailto:mbrunke@vaughnmartin.com'}
                className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold"
                data-testid="button-request-pilot"
              >
                Talk to the Founder →
              </Button>
              <Button
                size="lg"
                onClick={() => setLocation("/command-tower")}
                className="bg-[#0A0F2E] text-white border border-white/20 hover:bg-[#141B45]"
                data-testid="button-see-live"
              >
                See the System Live →
              </Button>
              <Button
                size="lg"
                onClick={() => setLocation("/12-minute-experience")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                data-testid="button-see-demo"
              >
                12-Minute Test Drive
              </Button>
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
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 28, maxWidth: 680 }}>
                Who calls who? Where's the brief? Who owns the response? Who authorizes it? Most Fortune 1000s spend 30 days figuring that out — while the window closes, the regulator moves, the stock drops, the competitor acts. That gap is the business. Every Fortune 1000 has it. None have solved it. The cost per trigger: $50M to $500M.
              </p>
              <a href="/12-minute-experience" style={{ display: 'inline-block', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, padding: '14px 36px', background: '#C9A84C', color: '#0A0F2E', textDecoration: 'none' }}>
                See What 12 Minutes Looks Like →
              </a>
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
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>
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
                  body: 'A competitor can rebuild the platform layer in 6–12 months. They cannot rebuild 20 years of Fortune 1000 operational decision logic — the trigger patterns, stakeholder sequences, and failure modes embedded in 170 prepared responses from two decades of real crisis response.',
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
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: m.accent, marginBottom: 12 }}>Moat {m.n}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>{m.label}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 20 }}>{m.body}</p>
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
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.6)' }}>
                Dr. Kerry Huang · ESI Top 1% Researcher · 408-Firm Study
              </p>
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
              Fortune 1000 companies face these three problems every time a strategic moment hits. No infrastructure existed to solve them—until Readiness OS.
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
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, marginBottom: 8, fontFamily: "'Barlow Condensed', sans-serif" }}>Problem {p.n}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A0F2E', marginBottom: 8, lineHeight: 1.2 }}>{p.label}</h3>
                  <p className="text-sm text-[#0A0F2E] mb-2 leading-relaxed">{p.body}</p>
                  <p className="text-xs text-[#6B7280] mb-4">{p.stat}</p>
                  <div className="border-t border-[#E8E4DC] pt-4">
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2B8A6E', marginBottom: 6 }}>Solution</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#2B8A6E' }}>{p.metric}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

            <div className="bg-[#F8F7F4] border border-[#E8E4DC] px-6 py-4 text-center">
              <p className="text-[#0A0F2E]">
                <span className="text-[#0A0F2E] font-semibold">Readiness OS at $250K-$750K/year</span> vs. one incident costing <span className="text-[#0A0F2E] font-semibold">$5-50M</span>. <span className="text-[#2B8A6E] font-semibold">Payback on first use.</span>
              </p>
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
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', color: a.color, marginBottom: 8, fontFamily: "'Barlow Condensed', sans-serif" }}>{a.n}</div>
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
                  <p className="text-[#2B8A6E] text-sm italic">→ Our 170 prepared responses give them the execution infrastructure</p>
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
                      <p className="text-[#2B8A6E] text-sm font-semibold">→ Readiness OS is the AI practice at the enterprise coordination layer — pre-staged prepared responses, decision gates, and sequenced execution phases with executive sign-off at every step.</p>
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
            <div className="overflow-hidden border border-[#E8E4DC]">
              <img
                src={productArchitectureImg}
                alt="Readiness OS End-to-End Product Architecture — Signal Sources, AI Engine, 170 Prepared responses, Execution Outputs, Command Center, and Integration Layer"
                className="w-full h-auto"
                loading="eager"
              />
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
                Creating a new $127B software category at the intersection of strategic planning, platform intelligence, and execution automation
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
                  <div className="text-4xl font-bold text-[#0A0F2E] mb-2" data-testid="text-tam-value">$127B</div>
                  <p className="text-[#0A0F2E]" data-testid="text-tam-description">
                    Fortune 1000 strategic execution software spend (15% of $847B total strategic initiatives budget)
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
                  <div className="text-4xl font-bold text-[#C9A84C] mb-2" data-testid="text-sam-value">$38B</div>
                  <p className="text-[#0A0F2E]" data-testid="text-sam-description">
                    Fortune 500 + high-growth enterprises with $1B+ revenue requiring executive decision velocity
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
                  <div className="text-4xl font-bold text-[#2B8A6E] mb-2" data-testid="text-som-value">$1.9B</div>
                  <p className="text-[#0A0F2E]" data-testid="text-som-description">
                    5% market capture in Year 5 (50 Fortune 500 + 200 mid-market at $250K-$1.5M ACV)
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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketFunnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-[#E8E4DC]" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip 
                      formatter={(value: number) => `$${value}B`}
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: 'white' }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {marketFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center text-sm text-[#0A0F2E]">
                  Progressive market capture: $127B TAM → $38B SAM → $1.9B SOM (Year 5)
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br .section-background border-2" data-testid="card-why-now">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-[#0A0F2E]" data-testid="heading-why-now">
                  Why Now? Perfect Market Timing
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3" data-testid="reason-1">
                    <CheckCircle2 className="h-6 w-6 text-[#2B8A6E] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-[#0A0F2E] mb-1">AI Maturity Reached</div>
                      <div className="text-[#0A0F2E]">LLMs enable real-time strategic intelligence at scale (GPT-4, Claude, Gemini)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="reason-2">
                    <CheckCircle2 className="h-6 w-6 text-[#2B8A6E] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-[#0A0F2E] mb-1">Execution Crisis</div>
                      <div className="text-[#0A0F2E]">87% of strategic initiatives fail—executives desperate for execution velocity</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="reason-3">
                    <CheckCircle2 className="h-6 w-6 text-[#2B8A6E] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-[#0A0F2E] mb-1">Remote Work Complexity</div>
                      <div className="text-[#0A0F2E]">Distributed teams make coordination harder—need automated orchestration</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="reason-4">
                    <CheckCircle2 className="h-6 w-6 text-[#2B8A6E] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-[#0A0F2E] mb-1">Competitive Velocity</div>
                      <div className="text-[#0A0F2E]">Market windows shrinking from months to days—speed is survival</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#2B8A6E" }}>Bain &amp; Company — AI's Next Operating Model, 2025</span>
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
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#2B8A6E", marginBottom: 8 }}>What this means for the product</div>
                    <p style={{ fontSize: 13, color: "#0A0F2E", lineHeight: 1.6 }}>
                      Readiness OS eliminates the rediscovery tax entirely. 170 pre-staged prepared responses mean the context, ownership, and decision logic exist <em>before</em> the trigger fires — not reconstructed after. The platform is the continuity layer Bain describes as missing.
                    </p>
                  </div>
                  <div style={{ width: "100%", height: 1, background: "#E8E4DC" }} />
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 8 }}>What this means for the customer</div>
                    <p style={{ fontSize: 13, color: "#0A0F2E", lineHeight: 1.6 }}>
                      The Fortune 1000 customer doesn't spend 30 days mobilizing. They respond in 12 minutes — because the institutional memory, ownership assignments, and execution sequence were built and rehearsed before pressure arrived. Every subsequent deployment compounds that advantage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#2B8A6E]/15 border border-[#2B8A6E]/50 text-center">
              <p className="text-[#2B8A6E] font-semibold mb-1">Every firm is consulting on the problem. Readiness OS built the product.</p>
              <p className="text-[#0A0F2E] text-sm">170 prepared responses, 9 strategic domains, pre-defined governance — ready today.</p>
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
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 12 }}>Research Foundation</div>
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
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#2B8A6E", marginBottom: 10 }}>Bain — Product Value</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#0A0F2E", lineHeight: 1.45, fontStyle: "italic", marginBottom: 10 }}>
                  "Organizations must address memory hygiene, permissioning, and knowledge portability — particularly who owns the institutional memory agents accumulate."
                </p>
                <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6 }}>
                  Readiness OS answers this directly: the enterprise owns its preparation history. Every prepared response rehearsal, every ownership acknowledgment, every challenge-rights exchange is embedded in the organization's preparation record — not locked in a vendor's platform.
                </p>
              </div>
              <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", padding: "20px 22px" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 10 }}>Bain — Customer Value</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#0A0F2E", lineHeight: 1.45, fontStyle: "italic", marginBottom: 10 }}>
                  "The economic logic changes with persistence: measure by context retained, rework eliminated, and institutional knowledge built."
                </p>
                <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6 }}>
                  For the Fortune 1000 customer, each deployment doesn't start from zero — it starts from accumulated readiness. The 12-minute response time improves with every trigger handled. The preparation compounds. That's a different ROI conversation than any point solution can offer.
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
                    The entire platform IS the Readiness Protocol system — and it grows through team engagement. The 170 Readiness Protocols are the starting point, not the ceiling. Each activation, ownership acknowledgment, and challenge-rights exchange deepens the record. After 18 months, the organization's preparation intelligence is irreplicable — built from real trigger events, under real pressure, by their actual people.
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
                    First mover defining "Strategic Readiness Platform" category (like Salesforce for CRM). Category creators capture 76% of market value (Gartner research).
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
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em', marginBottom: 10 }}>{v.title}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55 }}>{v.context}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.25)', borderLeft: '3px solid rgba(201,168,76,0.6)', padding: '36px 40px', maxWidth: 820, margin: '0 auto', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.7)' }}>Reposted Publicly · LinkedIn · April 20, 2026 · Full Post</span>
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
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Fortune 50 AVP · ESI Top 1% Researcher · Forbes Business Council · Posted to his full professional network, naming Martin Brunke by name</p>
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
            <div className="overflow-hidden border border-[#E8E4DC]">
              <img
                src={futurePositioningImg}
                alt="Readiness OS Future Positioning — Phase 1: Today's execution infrastructure, Phase 2: Tomorrow's AI operating layer"
                className="w-full h-auto"
                loading="lazy"
              />
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
                    Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#2B8A6E] mb-2" data-testid="text-price-enterprise">$250K</div>
                  <div className="text-sm text-[#0A0F2E] mb-4">Annual Contract Value</div>
                  <ul className="space-y-2 text-sm text-[#0A0F2E]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                      Single domain
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
                    Enterprise Plus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#0A0F2E] mb-2" data-testid="text-price-team">$450K</div>
                  <div className="text-sm text-[#0A0F2E] mb-4">Annual Contract Value</div>
                  <ul className="space-y-2 text-sm text-[#0A0F2E]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0A0F2E]" />
                      Multi-domain
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0A0F2E]" />
                      Full integration suite
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
                    Global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#C9A84C] mb-2" data-testid="text-price-executive">$750K-$1.5M</div>
                  <div className="text-sm text-[#0A0F2E] mb-4">Custom Annual Contract</div>
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
                    <div className="text-[#0A0F2E]">Industry-specific prepared responses ($5K-$50K per template pack)</div>
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

        {/* Investment Ask Section */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="vm-section-label justify-center mb-6"><span>The Ask</span></div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, color: '#0A0F2E', marginBottom: 12, lineHeight: 1.1 }}>
                $2.5M Seed Round
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 17, color: '#4B5563', maxWidth: 560, margin: '0 auto' }}>
                18-month runway to $3.75M ARR — three Fortune 1000 pilots converting to annual contracts.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Seed Round', value: '$2.5M', sub: 'SAFE at $12M cap', accent: '#0A0F2E' },
                { label: 'ARR Target', value: '$3.75M', sub: '18-month milestone', accent: '#C9A84C' },
                { label: 'Runway', value: '18 mo', sub: 'To Series A inflection', accent: '#2B8A6E' },
              ].map(m => (
                <div key={m.label} className="text-center py-10 px-6 border border-[#E8E4DC] bg-white" style={{ borderTopColor: m.accent, borderTopWidth: 3 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px,6vw,64px)', fontWeight: 700, color: m.accent, lineHeight: 1, marginBottom: 8 }}>{m.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0A0F2E', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>{m.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E8E4DC] p-6">
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0A0F2E', marginBottom: 16 }}>Use of Proceeds</div>
                {[
                  { label: 'Pilot Execution & Customer Success', pct: '40%', color: '#2B8A6E' },
                  { label: 'Product & Engineering', pct: '30%', color: '#0A0F2E' },
                  { label: 'Sales & GTM Infrastructure', pct: '20%', color: '#C9A84C' },
                  { label: 'Operations & Legal', pct: '10%', color: '#6B7280' },
                ].map(u => (
                  <div key={u.label} className="flex items-center justify-between py-3 border-b border-[#F0EDE4] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8" style={{ background: u.color }} />
                      <span style={{ fontSize: 14, color: '#0A0F2E', fontWeight: 500 }}>{u.label}</span>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: u.color, fontFamily: "'Barlow Condensed', sans-serif" }}>{u.pct}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#E8E4DC] p-6">
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0A0F2E', marginBottom: 16 }}>18-Month Milestones</div>
                {[
                  { mo: 'M1–3', label: 'HPE, Target, Clorox pilots live — 3 paid LOIs', color: '#2B8A6E' },
                  { mo: 'M4–6', label: 'First 3 pilots convert to $250K+ annual contracts', color: '#2B8A6E' },
                  { mo: 'M6–12', label: 'Expand to 8 enterprise accounts — $1.5M ARR', color: '#C9A84C' },
                  { mo: 'M12–18', label: '$3.75M ARR — Series A raise initiated', color: '#0A0F2E' },
                ].map(m => (
                  <div key={m.mo} className="flex items-start gap-4 py-3 border-b border-[#F0EDE4] last:border-0">
                    <div style={{ fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: '0.08em', minWidth: 44, paddingTop: 1 }}>{m.mo}</div>
                    <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{m.label}</p>
                  </div>
                ))}
              </div>
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
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#2B8A6E', marginBottom: 6 }}>Phase 1 — Now</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#0A0F2E', margin: 0, lineHeight: 1.2 }}>External Trigger Response</h3>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', padding: '4px 10px', background: '#2B8A6E', color: '#fff', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>Live · Revenue</span>
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
                    Pre-stage 170 responses before the trigger fires. When the signal crosses the confidence threshold, the prepared response is already built, stakeholders pre-assigned, and executive authorization takes 8 minutes — not 30 days.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { n: '221', l: 'Trigger types monitored' },
                    { n: '170', l: 'Pre-staged prepared responses' },
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
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 6 }}>Phase 2 — 2026–2027</div>
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
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.6)', marginBottom: 10 }}>The unifying thesis</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px,2vw,24px)', fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.5, fontStyle: 'italic' as const }}>
                  "Same platform. Same preparation thesis. The failure mode is identical — the handoff between what was approved and what actually executed at the front line."
                </p>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' as const }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>Total addressable expansion</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>$127B+</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Execution infrastructure market</div>
              </div>
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
              Readiness OS is defining the Strategic Readiness Platform category — a $127B market opportunity with winner-take-most dynamics. Early investors gain exposure to category creation with defensible moats and exceptional unit economics.
            </p>
            <p className="text-base mb-10 text-white/60">
              Schedule a conversation with the VaughnMartin founding team to review our full investment deck, pipeline metrics, and strategic roadmap.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Button
                size="lg"
                onClick={() => setLocation("/request-access")}
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
            </div>
            <p className="text-sm text-white/40">
              VaughnMartin · Strategic Readiness Platform · <span className="text-[#C9A84C]">info@vaughnmartin.com</span>
            </p>
          </div>
        </section>
    </PageLayout>
  );
}
