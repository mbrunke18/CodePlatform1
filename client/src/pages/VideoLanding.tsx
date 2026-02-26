import { useState, useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Play, Users, Zap, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import CinematicHero from "@/components/marketing/CinematicHero";
import SizzleReel from "@/components/marketing/SizzleReel";
import ThirtySecondSpot from "@/components/marketing/ThirtySecondSpot";

function getInitialTab(loc: string): string {
  if (loc === "/sizzle" || loc === "/2-minute") return "2-minute";
  if (loc === "/spots" || loc === "/30-second") return "30-second";
  return "90-second";
}

export default function VideoLanding() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState(() => getInitialTab(location));

  useEffect(() => {
    setActiveTab(getInitialTab(location));
  }, [location]);

  useEffect(() => {
    updatePageMetadata({
      title: "Execution OS - Strategic Execution Operating System | 72 Hours → 12 Minutes",
      description: "Watch how Execution OS transforms strategic coordination from 72 hours to 12 minutes. Pre-staged playbooks, coordinated stakeholders, instant activation for Fortune 1000 companies.",
      ogTitle: "Execution OS - The Speed to Execute",
      ogDescription: "170 playbooks. 12 minutes to coordinated execution. The Strategic Execution Operating System.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white" data-testid="page-video-landing">
      <StandardNav />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Link href="/">
                <Button variant="ghost" className="text-[#6B7280] hover:text-[#0A0F2E] mb-4 p-0" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Executive Resources</span>
              </div>
              <h1 className="text-5xl font-bold text-[#0A0F2E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="heading-video-hub">
                Brand Films & <em className="italic text-[#C9A84C]">Sizzle Reels</em>
              </h1>
              <p className="text-xl text-[#6B7280] max-w-2xl leading-relaxed">
                Cinematic presentations for trade shows, conferences, and broadcast. Experience the speed of Execution OS.
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white border border-[#E8E4DC] p-1 rounded-none mb-12" data-testid="video-tabs">
              <TabsTrigger 
                value="90-second" 
                className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-none font-bold uppercase text-[9px] tracking-widest py-3 text-[#6B7280]"
                data-testid="tab-90-second"
              >
                <Clock className="h-3 w-3 mr-2" />
                90 Seconds
              </TabsTrigger>
              <TabsTrigger 
                value="2-minute" 
                className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-none font-bold uppercase text-[9px] tracking-widest py-3 text-[#6B7280]"
                data-testid="tab-2-minute"
              >
                <Clock className="h-3 w-3 mr-2" />
                2 Minutes
              </TabsTrigger>
              <TabsTrigger 
                value="30-second" 
                className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-none font-bold uppercase text-[9px] tracking-widest py-3 text-[#6B7280]"
                data-testid="tab-30-second"
              >
                <Clock className="h-3 w-3 mr-2" />
                30 Seconds
              </TabsTrigger>
            </TabsList>

            <TabsContent value="90-second" className="mt-0">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-[#2B8A6E] text-white rounded-none uppercase text-[9px] font-bold tracking-widest px-3 py-1 border-0">Primary</Badge>
                  <h2 className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="heading-90-second">
                    "The Speed to Execute" - 90 Second Brand Film
                  </h2>
                </div>
                <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">
                  Purpose: Trade show booth loop · conference opener · website hero · investor meetings
                </p>
              </div>
              <div className="rounded-none overflow-hidden border border-[#E8E4DC] shadow-xl">
                <CinematicHero />
              </div>
            </TabsContent>

            <TabsContent value="2-minute" className="mt-0">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-[#C9A84C] text-[#0A0F2E] rounded-none uppercase text-[9px] font-bold tracking-widest px-3 py-1 border-0">Extended</Badge>
                  <h2 className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="heading-2-minute">
                    "Prepared to Execute" - 2 Minute Sizzle Reel
                  </h2>
                </div>
                <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">
                  Purpose: Conference sessions · investor presentations · sales meetings · website
                </p>
              </div>
              <div className="rounded-none overflow-hidden border border-[#E8E4DC] shadow-xl">
                <SizzleReel />
              </div>
            </TabsContent>

            <TabsContent value="30-second" className="mt-0">
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#0A0F2E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="heading-30-second">
                  30-Second Spots - Three Versions
                </h2>
                <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">
                  Purpose: Social media · LinkedIn · brand awareness · performance marketing
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="h-1 w-12 bg-[#C9A84C]" />
                  <h3 className="text-lg font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="heading-spot-1">
                    Version 1: "Offense, Defense, Special Teams"
                  </h3>
                  <div className="rounded-none overflow-hidden border border-[#E8E4DC] shadow-lg">
                    <ThirtySecondSpot version="offense-defense" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-1 w-12 bg-[#2B8A6E]" />
                  <h3 className="text-lg font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="heading-spot-2">
                    Version 2: "The First Mover"
                  </h3>
                  <div className="rounded-none overflow-hidden border border-[#E8E4DC] shadow-lg">
                    <ThirtySecondSpot version="first-mover" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-1 w-12 bg-[#0A0F2E]" />
                  <h3 className="text-lg font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="heading-spot-3">
                    Version 3: "360X Faster"
                  </h3>
                  <div className="rounded-none overflow-hidden border border-[#E8E4DC] shadow-lg">
                    <ThirtySecondSpot version="360x-faster" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <section className="py-24 px-6 bg-[#F8F7F4] border-y border-[#E8E4DC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>The Advantage</span>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Why Fortune 1000 Leaders Choose <em className="italic text-[#C9A84C]">Execution OS</em>
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto font-light leading-relaxed">
              Transform how your organization responds to the moments that matter
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-[#E8E4DC] rounded-none hover:border-[#0A0F2E] transition-all duration-300 shadow-none">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#0A0F2E] flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A0F2E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12-Minute Execution</h3>
                <p className="text-[#6B7280] leading-relaxed font-light">
                  Pre-staged playbooks with predetermined stakeholders and tasks. No meetings. No delays.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E8E4DC] rounded-none hover:border-[#2B8A6E] transition-all duration-300 shadow-none">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#2B8A6E] flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A0F2E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Coordinated Response</h3>
                <p className="text-[#6B7280] leading-relaxed font-light">
                  Every stakeholder knows their role before the call comes. Parallel execution across teams.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E8E4DC] rounded-none hover:border-[#C9A84C] transition-all duration-300 shadow-none">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#C9A84C] flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-[#0A0F2E]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A0F2E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>AI-Powered Monitoring</h3>
                <p className="text-[#6B7280] leading-relaxed font-light">
                  Continuous intelligence scanning. Automatic trigger detection. Real-time alerts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#0A0F2E] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMDAsMTcwLDc2LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Get Started</span>
            <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to Execute at the <em className="italic text-[#C9A84C]">Speed of Change?</em>
          </h2>
          <p className="text-xl text-white/60 mb-12 font-light leading-relaxed">
            Join Fortune 1000 leaders who have transformed their strategic response capability
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/try-demo">
              <Button size="lg" className="px-10 py-8 text-lg bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] rounded-none font-bold uppercase tracking-widest" data-testid="button-try-demo-bottom">
                <Play className="mr-3 h-5 w-5" />
                Try Interactive Demo
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button 
                size="lg"
                variant="outline"
                className="px-10 py-8 text-lg border-white/20 text-white hover:bg-white/10 rounded-none font-bold uppercase tracking-widest"
                data-testid="button-contact"
              >
                Contact Sales
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-white border-t border-[#E8E4DC]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">
            Execution OS — Strategic Execution Operating System by VaughnMartin
          </p>
        </div>
      </footer>
    </div>
  );
}
