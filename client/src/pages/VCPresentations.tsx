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
      description: "Comprehensive pitch presentation for Seed funding round",
      slides: 24,
      duration: "18 min",
      status: "Ready",
      type: "Primary Deck",
      icon: <Presentation className="w-6 h-6 text-[#C9A84C]" />
    },
    {
      title: "Financial Projections Model",
      description: "5-year financial model with revenue projections and market analysis",
      slides: 12,
      duration: "8 min", 
      status: "Updated",
      type: "Financial",
      icon: <BarChart3 className="w-6 h-6 text-[#2B8A6E]" />
    },
    {
      title: "Product Demo Presentation",
      description: "Live platform demonstration showcasing continuous signal monitoring and strategic execution",
      slides: 16,
      duration: "12 min",
      status: "Live Demo",
      type: "Product",
      icon: <Play className="w-6 h-6 text-[#C9A84C]" />
    },
    {
      title: "Competitive Analysis Deep Dive",
      description: "Comprehensive competitive landscape and differentiation strategy",
      slides: 20,
      duration: "15 min",
      status: "Ready",
      type: "Market Analysis",
      icon: <Target className="w-6 h-6 text-[#0A0F2E]" />
    },
    {
      title: "Technology Architecture Overview",
      description: "Platform scalability, security architecture, and technical roadmap",
      slides: 18,
      duration: "14 min",
      status: "Ready",
      type: "Technical",
      icon: <Building2 className="w-6 h-6 text-[#2B8A6E]" />
    },
    {
      title: "Market Expansion Strategy",
      description: "Go-to-market strategy and international expansion plans",
      slides: 14,
      duration: "10 min",
      status: "In Review",
      type: "Growth Strategy",
      icon: <Globe className="w-6 h-6 text-[#C9A84C]" />
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
                  <div key={index} className="flex items-center justify-between p-5 bg-white border border-[#E8E4DC] group hover:border-[#C9A84C] transition-colors">
                    <div className="flex items-center space-x-4">
                      <div style={{ width: 4, alignSelf: 'stretch', background: material.status === 'Ready' ? '#2B8A6E' : '#C9A84C', flexShrink: 0 }} />
                      <div>
                        <h4 className="font-bold text-[#0A0F2E]">{material.title}</h4>
                        <p className="text-sm text-[#6B7280]">{material.description}</p>
                        <div className="flex items-center space-x-4 text-[10px] uppercase tracking-wider text-[#6B7280] mt-2 font-bold">
                          <span>{material.slides} SLIDES</span>
                          <span className="w-1 h-1 bg-[#E8E4DC]"></span>
                          <span>{material.duration}</span>
                          <span className="w-1 h-1 bg-[#E8E4DC]"></span>
                          <span className="text-[#C9A84C]">{material.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={`rounded-none px-3 border-[#E8E4DC] ${material.status === 'Ready' ? 'text-[#2B8A6E]' : 'text-[#C9A84C]'}`}>
                        {material.status}
                      </Badge>
                      <Button size="icon" variant="ghost" className="text-[#0A0F2E] hover:bg-[#F8F7F4]" data-testid={`button-download-${material.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] rounded-none h-12" data-testid="button-full-investor-package">
                      <Crown className="w-4 h-4 mr-2" />
                      Download Package
                    </Button>
                    <Button variant="outline" className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none h-12" data-testid="button-schedule-presentation">
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule Presentation
                    </Button>
                  </div>

                  <div className="mt-10 p-6 bg-[#2B8A6E]/5 border-l-4 border-[#2B8A6E]">
                    <div className="flex items-center text-[#2B8A6E] mb-2">
                      <TrendingUp className="w-5 h-5 mr-3" />
                      <span className="text-lg font-bold" style={CG}>Investment Readiness: 96/100</span>
                    </div>
                    <p className="text-sm text-[#141B45] italic opacity-80 leading-relaxed">
                      "Platform demonstrates clear market leadership with unprecedented competitive advantages in continuous signal monitoring and strategic execution velocity."
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