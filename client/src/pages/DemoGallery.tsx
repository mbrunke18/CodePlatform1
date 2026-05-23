import { useState } from 'react';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Rocket,
  Users, 
  Building2,
  Briefcase,
  ChevronRight,
  ArrowRight,
  Clock,
  Star,
  Zap,
  Eye,
  Target,
  Shield,
  Globe
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";

const demos = [
  {
    id: "pilot-demo",
    title: "Founding Partner Demo",
    description: "Experience a full trigger-to-execution cycle with real-time coordination",
    path: "/pilot-demo",
    duration: "5 min",
    category: "interactive",
    audience: "prospects",
    icon: Rocket,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    featured: true,
    tags: ["Full Experience", "Live Execution"],
    journeyPhase: "Discovery"
  },
  {
    id: "executive-simulation",
    title: "Executive Simulation",
    description: "Step into the CEO's shoes during a strategic crisis scenario",
    path: "/executive-simulation",
    duration: "10 min",
    category: "interactive",
    audience: "executives",
    icon: Briefcase,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    featured: true,
    tags: ["Decision Making", "Crisis Response"],
    journeyPhase: "EXECUTE"
  },
  {
    id: "sandbox",
    title: "Interactive Sandbox",
    description: "Explore Readiness OS features at your own pace in a guided environment",
    path: "/sandbox-demo",
    duration: "Self-paced",
    category: "interactive",
    audience: "prospects",
    icon: Zap,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    tags: ["Self-Guided", "Exploration"],
    journeyPhase: "Onboarding"
  },
  {
    id: "investor-demo",
    title: "Investor Demo",
    description: "Comprehensive overview of Readiness OS value proposition and market opportunity",
    path: "/investor-demo",
    duration: "15 min",
    category: "presentation",
    audience: "investors",
    icon: Building2,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    tags: ["Market Size", "ROI Metrics"],
    journeyPhase: "Discovery"
  },
  {
    id: "product-tour",
    title: "Product Tour",
    description: "Guided walkthrough of all Readiness OS modules and capabilities",
    path: "/product-tour",
    duration: "8 min",
    category: "presentation",
    audience: "prospects",
    icon: Eye,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    tags: ["Feature Overview", "Modules"],
    journeyPhase: "IDENTIFY"
  },
  {
    id: "live-demo",
    title: "One-Click Live Demo",
    description: "Instantly launch a pre-configured demo environment",
    path: "/live-demo",
    duration: "3 min",
    category: "interactive",
    audience: "prospects",
    icon: Play,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    tags: ["Quick Start", "No Setup"],
    journeyPhase: "Discovery"
  }
];

const industryDemos = [
  {
    id: "luxury-crisis",
    title: "Luxury Brand Crisis",
    description: "Hermès-style response to counterfeit scandal",
    path: "/industry-demos",
    industry: "Luxury & Retail",
    icon: Star,
    color: "text-[#C9A84C]"
  },
  {
    id: "financial-ransomware",
    title: "Financial Ransomware",
    description: "Coordinated response to cyber attack on banking systems",
    path: "/industry-demos",
    industry: "Financial Services",
    icon: Shield,
    color: "text-[#C9A84C]"
  },
  {
    id: "market-entry",
    title: "Market Entry Blitz",
    description: "LVMH-style rapid market expansion strategy",
    path: "/industry-demos",
    industry: "Consumer Goods",
    icon: Globe,
    color: "text-[#0A0F2E]"
  },
  {
    id: "pharma-recall",
    title: "Pharmaceutical Recall",
    description: "FDA compliance and public safety response",
    path: "/industry-demos",
    industry: "Healthcare",
    icon: Target,
    color: "text-[#C9A84C]"
  }
];

export default function DemoGallery() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredDemos = activeTab === "all" 
    ? demos 
    : demos.filter(d => d.category === activeTab || d.audience === activeTab);

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">

        {/* ─── Dark Command Deck ─────────────────────────────────────────── */}
        <div style={{ background: "#0A0F2E", padding: "36px 0 0" }}>
          <style>{`
            @keyframes dg-fadeup { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
            .dg-tile-1{animation:dg-fadeup 0.45s ease 0.04s both}
            .dg-tile-2{animation:dg-fadeup 0.45s ease 0.13s both}
            .dg-tile-3{animation:dg-fadeup 0.45s ease 0.22s both}
            .dg-tile-4{animation:dg-fadeup 0.45s ease 0.31s both}
            .dg-stat-1{animation:dg-fadeup 0.45s ease 0.18s both}
            .dg-stat-2{animation:dg-fadeup 0.45s ease 0.24s both}
            .dg-stat-3{animation:dg-fadeup 0.45s ease 0.3s both}
            .dg-stat-4{animation:dg-fadeup 0.45s ease 0.36s both}
          `}</style>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9A84C" }}>Experience Center</span>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: "#F0EDE4", marginBottom: 8 }}>
              Demo <em style={{ color: "#C9A84C" }}>Gallery</em>
            </div>
            <div style={{ fontSize: 13, color: "rgba(240,237,228,0.5)", maxWidth: 540, marginBottom: 28, lineHeight: 1.5 }}>
              Interactive simulations, guided tours, industry scenarios. Start anywhere — every path leads to 12-minute execution.
            </div>

            {/* Featured Demo Tiles — 2 large */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 1 }}>
              {demos.filter(d => d.featured).map((demo, i) => {
                const accent = i === 0 ? "#2B8A6E" : "#C9A84C";
                const accentBg = i === 0 ? "rgba(43,138,110,0.08)" : "rgba(201,168,76,0.06)";
                const accentBorder = i === 0 ? "rgba(43,138,110,0.25)" : "rgba(201,168,76,0.2)";
                return (
                  <Link key={demo.id} href={demo.path}>
                    <div
                      className={i === 0 ? "dg-tile-1" : "dg-tile-2"}
                      style={{ background: accentBg, borderTop: `1px solid ${accentBorder}`, borderLeft: `1px solid ${accentBorder}`, borderRight: `1px solid ${accentBorder}`, borderBottom: `3px solid ${accent}`, padding: "22px 24px", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <demo.icon style={{ width: 18, height: 18, color: accent }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: accent }}>FEATURED</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: accent, border: `1px solid ${accentBorder}`, padding: "2px 8px" }}>{demo.duration}</span>
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#F0EDE4", marginBottom: 6 }}>{demo.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(240,237,228,0.5)", marginBottom: 16, lineHeight: 1.5 }}>{demo.description}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const, marginBottom: 14 }}>
                        {demo.tags.map(tag => (
                          <span key={tag} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: accent, border: `1px solid ${accentBorder}`, padding: "2px 8px" }}>{tag}</span>
                        ))}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(240,237,228,0.4)" }}>LAUNCH DEMO →</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Stats Strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {[
                { label: "Demo Experiences", value: "8", anim: "dg-stat-1" },
                { label: "Execution Time", value: "12 min", anim: "dg-stat-2" },
                { label: "Industries Covered", value: "7+", anim: "dg-stat-3" },
                { label: "Execution Head Start", value: "3,600×", anim: "dg-stat-4" },
              ].map(s => (
                <div key={s.label} className={s.anim} style={{ padding: "14px 18px" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "rgba(240,237,228,0.45)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-[#0A0F2E]/5">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">All Demos</TabsTrigger>
              <TabsTrigger value="interactive" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Interactive</TabsTrigger>
              <TabsTrigger value="presentation" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Presentations</TabsTrigger>
              <TabsTrigger value="executives" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">For Executives</TabsTrigger>
              <TabsTrigger value="investors" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">For Investors</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* All Demos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filteredDemos.filter(d => !d.featured).map((demo) => (
              <Link key={demo.id} href={demo.path}>
                <Card className="h-full transition-all cursor-pointer group border border-[#E8E4DC]">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 ${demo.bgColor}`}>
                        <demo.icon className={`h-6 w-6 ${demo.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#0A0F2E] group-hover:text-[#2B8A6E] transition-colors">
                            {demo.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-[#6B7280] group-hover:text-[#2B8A6E] transition-colors" />
                        </div>
                        <p className="text-sm text-gray-800 mt-1 mb-3">
                          {demo.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs border-[#E8E4DC] text-[#6B7280]">
                            <Clock className="h-3 w-3 mr-1" />
                            {demo.duration}
                          </Badge>
                          {(demo as any).journeyPhase && (
                            <Badge className="text-xs bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">
                              {(demo as any).journeyPhase}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Industry-Specific Demos */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0A0F2E] mb-2">Industry Scenarios</h2>
            <p className="text-gray-800 mb-6">
              See Readiness OS in action with scenarios tailored to your industry
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {industryDemos.map((demo) => (
                <Link key={demo.id} href={demo.path}>
                  <Card className="h-full transition-all cursor-pointer group border border-[#E8E4DC]">
                    <CardContent className="p-6">
                      <demo.icon className={`h-8 w-8 ${demo.color} mb-4`} />
                      <h3 className="font-semibold text-[#0A0F2E] group-hover:text-[#2B8A6E] transition-colors mb-1">
                        {demo.title}
                      </h3>
                      <p className="text-xs text-gray-800 mb-2">{demo.industry}</p>
                      <p className="text-sm text-gray-800">
                        {demo.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA - Unified Conversion Funnel: Try Demo + Start Pilot */}
          <Card className="bg-white border border-[#E8E4DC]">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-[#0A0F2E]">Ready to Transform Your Strategic Readiness?</h3>
              <p className="text-gray-800 mb-6 max-w-xl mx-auto">
                Join enterprise organizations achieving live execution in 12 minutes — roles assigned, tasks staged, teams already moving
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link href="/pilot-demo">
                  <Button size="lg" className="bg-[#2B8A6E] hover:bg-[#3BAF8A] text-white font-semibold">
                    <Play className="h-4 w-4 mr-2" />
                    Try Interactive Demo
                  </Button>
                </Link>
                <Link href="/request-access">
                  <Button size="lg" className="bg-[#0A0F2E] hover:bg-[#141B45] text-white font-semibold border-2 border-[#C9A84C]/30">
                    Apply for Founding Partner Access
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-[#6B7280] mt-4">
                Founding Partner Program • 90-day validation • $75K (100% credited to Year 1)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
