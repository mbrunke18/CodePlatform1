import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Globe,
  ArrowRight,
  Download,
  Play,
  FileText,
  BarChart3,
  Presentation,
  Building2,
  Rocket,
  Crown,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function VCPresentations() {
  const investmentHighlights = [
    {
      title: "Market Opportunity",
      value: "$847B",
      subtitle: "Enterprise intelligence market size",
      growth: "+18.2% CAGR",
      color: "text-[#C9A84C]"
    },
    {
      title: "Platform Depth",
      value: "180",
      subtitle: "Pre-built Readiness Protocols across 9 strategic domains",
      growth: "231 executive triggers mapped",
      color: "text-[#2B8A6E]"
    },
    {
      title: "Competitive Advantage",
      value: "12 min",
      subtitle: "vs weeks of mobilization in the traditional enterprise",
      growth: "3,600× Execution Head Start",
      color: "text-[#0A0F2E]"
    },
    {
      title: "Readiness Protocol Precision",
      value: "85-92%",
      subtitle: "Readiness signal detection accuracy",
      growth: "Industry leading",
      color: "text-[#C9A84C]"
    }
  ];

  const pitchMaterials = [
    {
      title: "Seed Round Executive Deck",
      description: "Comprehensive pitch presentation for Seed funding round — current as of June 30, 2026",
      slides: 24,
      duration: "18 min",
      status: "Ready",
      type: "Primary Deck",
      icon: <Presentation className="w-6 h-6 text-[#C9A84C]" />,
      href: "/VaughnMartin_ReadinessOS_PitchDeck.pdf",
      download: true,
    },
    {
      title: "Financial Projections Model",
      description: "ROI calculator — quantify exactly what the 30-day → 12-minute compression means for your enterprise",
      slides: 12,
      duration: "8 min",
      status: "Live",
      type: "Financial",
      icon: <BarChart3 className="w-6 h-6 text-[#2B8A6E]" />,
      href: "/roi-calculator",
      download: false,
    },
    {
      title: "Product Demo — 12-Minute Execution Chain",
      description: "Live platform walkthrough — Activist Investor scenario, 7-phase complete execution",
      slides: 16,
      duration: "12 min",
      status: "Live Demo",
      type: "Product",
      icon: <Play className="w-6 h-6 text-[#C9A84C]" />,
      href: "/master-demo",
      download: false,
    },
    {
      title: "Competitive Analysis — 12 Gap Matrix",
      description: "The 12 mobilization failures every alternative leaves open. Readiness OS closes all 12 before the trigger fires.",
      slides: 20,
      duration: "15 min",
      status: "Ready",
      type: "Market Analysis",
      icon: <Target className="w-6 h-6 text-[#0A0F2E]" />,
      href: "/mobilization-gap",
      download: false,
    },
    {
      title: "Platform Architecture — How It Executes",
      description: "Animated signal → protocol → authorization → 12-minute execution chain with compound scenario support",
      slides: 18,
      duration: "14 min",
      status: "Ready",
      type: "Technical",
      icon: <Building2 className="w-6 h-6 text-[#2B8A6E]" />,
      href: "/how-it-executes",
      download: false,
    },
    {
      title: "Proof Story — Same Situation. Two Outcomes.",
      description: "Ransomware, Activist Investor, Supply Chain Collapse — side-by-side timelines with specific financial outcomes",
      slides: 14,
      duration: "10 min",
      status: "Ready",
      type: "Proof",
      icon: <Globe className="w-6 h-6 text-[#C9A84C]" />,
      href: "/proof-story",
      download: false,
    }
  ];

  const keyInvestmentThesis = [
    "We redesign how work flows in the age of AI — not another AI tool bolted onto the old model",
    "Enterprise work was built for a world without AI: committees, alignment cycles, 30-day delays were the best humans could do. AI changed the constraint — we changed the operating model",
    "3,600× Execution Head Start: 30 days of mobilization compressed to 12 minutes — before rivals have scheduled their first alignment call",
    "180 pre-staged Readiness Protocols replace real-time coordination — the broadest strategic readiness coverage available",
    "We're not competing with Copilot. We're competing with the meeting-heavy, committee-bound operating model startup to Fortune 500s have run for 40 years"
  ];

  return (
    <PageLayout>
      <div className="flex-1 page-background overflow-auto bg-[#F8F7F4]">
        {/* Navy Hero Section */}
        <div className="py-16 px-8 text-white relative overflow-hidden" style={{ background: "#0A0F2E" }}>
          {/* Gold dot grid overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-[1px] bg-[#C9A84C]"></div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">VaughnMartin Executive Presentation</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white" style={CG}>Investor Relations Center</h1>
                <p className="text-[#DFC178] text-lg max-w-xl font-medium">Seed Round Presentation Materials & Investment Thesis</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-[#C9A84C] border-[#C9A84C]/50 px-4 py-1">
                  <Star className="w-3 h-3 mr-2" />
                  Seed Round Ready
                </Badge>
                <Badge className="bg-[#C9A84C] text-[#0A0F2E] font-bold px-4 py-1">
                  Investment Grade
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Investment Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 -mt-16 relative z-20">
            {investmentHighlights.map((highlight, index) => (
              <Card key={index} className="bg-white border-[#E8E4DC] rounded-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs uppercase tracking-widest font-bold text-[#6B7280]">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-light mb-1" style={{ ...CG, color: highlight.color.includes('[') ? highlight.color.split('-')[1].replace('[', '').replace(']', '') : undefined }}>{highlight.value}</div>
                  <div className="text-sm text-[#6B7280] mb-2 font-medium">{highlight.subtitle}</div>
                  <div className={`text-sm font-bold ${highlight.color}`}>{highlight.growth}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Pitch Materials Library */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-[1px] bg-[#C9A84C]"></div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Documentation</span>
              </div>
              <h2 className="text-3xl font-light text-[#0A0F2E]" style={CG}>Seed Round Presentation Materials</h2>
              
              <div className="space-y-4">
                {pitchMaterials.map((material, index) => (
                  <a
                    key={index}
                    href={material.href}
                    target={material.download ? '_blank' : '_self'}
                    download={material.download ? 'VaughnMartin_ReadinessOS_PitchDeck.pdf' : undefined}
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="flex items-center justify-between p-5 bg-white border border-[#E8E4DC] group hover:border-[#C9A84C] transition-colors cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div style={{ width: 4, alignSelf: 'stretch', background: material.status === 'Ready' || material.status === 'Live' ? '#2B8A6E' : '#C9A84C', flexShrink: 0 }} />
                        <div>
                          <h4 className="font-bold text-[#0A0F2E]">{material.title}</h4>
                          <p className="text-sm text-[#6B7280]">{material.description}</p>
                          <div className="flex items-center space-x-4 text-[10px] uppercase tracking-wider text-[#6B7280] mt-2 font-bold">
                            <span>{material.duration}</span>
                            <span className="w-1 h-1 bg-[#E8E4DC] rounded-full inline-block"></span>
                            <span className="text-[#C9A84C]">{material.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={`rounded-none px-3 border-[#E8E4DC] ${material.status === 'Ready' || material.status === 'Live' ? 'text-[#2B8A6E]' : 'text-[#C9A84C]'}`}>
                          {material.status}
                        </Badge>
                        {material.download
                          ? <Download className="w-4 h-4 text-[#0A0F2E]" />
                          : <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
                        }
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Investment Thesis */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-[1px] bg-[#C9A84C]"></div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Value Proposition</span>
              </div>
              <h2 className="text-3xl font-light text-[#0A0F2E]" style={CG}>Investment Thesis</h2>
              
              <Card className="bg-white border-[#E8E4DC] rounded-none">
                <CardContent className="p-8">
                  <div className="space-y-5 mb-10">
                    {keyInvestmentThesis.map((point, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-[#2B8A6E]" />
                        </div>
                        <span className="text-[#141B45] leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Seed Round — $500K */}
                  <div className="mb-8 border-2 border-[#C9A84C] bg-[#FBF8F0]">
                    <div className="flex items-center gap-3 px-6 pt-5 pb-3 border-b border-[#E8E4DC]">
                      <div style={{ width: 4, height: 4, background: '#C9A84C', flexShrink: 0 }} />
                      <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#C9A84C]">Current Raise — Seed Round</span>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-[#E8E4DC]">
                      <div className="px-6 py-5">
                        <div className="text-[42px] font-bold leading-none text-[#0A0F2E] mb-1" style={CG}>$500K</div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Seed Round</div>
                        <div className="text-[10px] text-[#6B7280] mt-2">Pre-revenue · Founding Partner stage</div>
                      </div>
                      <div className="px-6 py-5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#0A0F2E] mb-3">Use of Funds</div>
                        <div className="space-y-2">
                          {[
                            { label: "Product & Infrastructure", amount: "$200K", pct: "40%" },
                            { label: "GTM / Founding Partner Acquisition", amount: "$175K", pct: "35%" },
                            { label: "Operations & Runway", amount: "$125K", pct: "25%" },
                          ].map(row => (
                            <div key={row.label} className="flex justify-between items-center text-[11px]">
                              <span className="text-[#6B7280]">{row.label}</span>
                              <span className="font-bold text-[#0A0F2E] ml-2 shrink-0">{row.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-6 py-5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#0A0F2E] mb-3">Round Achieves</div>
                        <div className="space-y-2">
                          {[
                            "3 signed Founding Partners",
                            "First $450K–$750K ARR",
                            "12-month product roadmap funded",
                          ].map(item => (
                            <div key={item} className="flex items-start gap-2 text-[11px] text-[#374151]">
                              <span className="text-[#2B8A6E] font-bold mt-0.5 shrink-0">✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="/VaughnMartin_ReadinessOS_PitchDeck.pdf" download="VaughnMartin_ReadinessOS_PitchDeck.pdf" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] rounded-none h-12 w-full" data-testid="button-full-investor-package">
                        <Crown className="w-4 h-4 mr-2" />
                        Download Pitch Deck
                      </Button>
                    </a>
                    <a href="/request-access" style={{ textDecoration: 'none' }}>
                      <Button variant="outline" className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none h-12 w-full" data-testid="button-schedule-presentation">
                        <Clock className="w-4 h-4 mr-2" />
                        Request a Conversation
                      </Button>
                    </a>
                  </div>

                  <div className="mt-10 p-6 bg-[#0A0F2E]/4 border-l-4 border-[#C9A84C]">
                    <div className="flex items-center text-[#0A0F2E] mb-3">
                      <TrendingUp className="w-5 h-5 mr-3 text-[#C9A84C]" />
                      <span className="text-sm font-bold tracking-widest uppercase" style={{ letterSpacing: '0.14em', color: '#0A0F2E' }}>The Moat — ADVANCE 2.0</span>
                    </div>
                    <p className="text-sm text-[#141B45] leading-relaxed mb-3">
                      Every activation close-out generates preparation updates. Each protocol is refined with evidence-backed changes. After 3 activations, improvements are classified as proven or disproven.
                    </p>
                    <p className="text-sm font-bold text-[#0A0F2E]">
                      The system gets harder to compete with after every deployment. The longer a customer runs it, the further ahead they are — and the further behind any competitor who starts later.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}