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
      title: "M - Strategic Execution Operating System | 72 Hours → 12 Minutes",
      description: "Watch how M transforms strategic coordination from 72 hours to 12 minutes. Pre-staged playbooks, coordinated stakeholders, instant activation for Fortune 1000 companies.",
      ogTitle: "M Platform - The Speed to Execute",
      ogDescription: "166 playbooks. 12 minutes to coordinated execution. The Strategic Execution Operating System.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950" data-testid="page-video-landing">
      <StandardNav />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/">
                <Button variant="ghost" className="text-slate-400 hover:text-white mb-4" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" data-testid="heading-video-hub">
                M Platform Brand Films
              </h1>
              <p className="text-slate-400">
                Cinematic presentations for trade shows, conferences, and broadcast
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-slate-800/50 mb-8" data-testid="video-tabs">
              <TabsTrigger 
                value="90-second" 
                className="data-[state=active]:bg-emerald-600"
                data-testid="tab-90-second"
              >
                <Clock className="h-4 w-4 mr-2" />
                90 Seconds
              </TabsTrigger>
              <TabsTrigger 
                value="2-minute" 
                className="data-[state=active]:bg-emerald-600"
                data-testid="tab-2-minute"
              >
                <Clock className="h-4 w-4 mr-2" />
                2 Minutes
              </TabsTrigger>
              <TabsTrigger 
                value="30-second" 
                className="data-[state=active]:bg-emerald-600"
                data-testid="tab-30-second"
              >
                <Clock className="h-4 w-4 mr-2" />
                30 Seconds
              </TabsTrigger>
            </TabsList>

            <TabsContent value="90-second" className="mt-0">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2" data-testid="heading-90-second">
                  "The Speed to Execute" - 90 Second Brand Film
                </h2>
                <p className="text-slate-400 text-sm">
                  Purpose: Trade show booth loop, conference opener, website hero, investor meetings
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-800">
                <CinematicHero />
              </div>
            </TabsContent>

            <TabsContent value="2-minute" className="mt-0">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2" data-testid="heading-2-minute">
                  "Prepared to Execute" - 2 Minute Sizzle Reel
                </h2>
                <p className="text-slate-400 text-sm">
                  Purpose: Conference sessions, investor presentations, sales meetings, website
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-800">
                <SizzleReel />
              </div>
            </TabsContent>

            <TabsContent value="30-second" className="mt-0">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2" data-testid="heading-30-second">
                  30-Second Spots - Three Versions
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  Purpose: Social media, LinkedIn, brand awareness, performance marketing
                </p>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3" data-testid="heading-spot-1">
                    Version 1: "Offense, Defense, Special Teams"
                  </h3>
                  <p className="text-slate-500 text-sm mb-3">Best for: Trade shows, LinkedIn, brand awareness</p>
                  <div className="rounded-xl overflow-hidden border border-slate-800">
                    <ThirtySecondSpot version="offense-defense" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-3" data-testid="heading-spot-2">
                    Version 2: "The First Mover"
                  </h3>
                  <p className="text-slate-500 text-sm mb-3">Best for: Competitive positioning, executive audience</p>
                  <div className="rounded-xl overflow-hidden border border-slate-800">
                    <ThirtySecondSpot version="first-mover" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-3" data-testid="heading-spot-3">
                    Version 3: "360X Faster"
                  </h3>
                  <p className="text-slate-500 text-sm mb-3">Best for: Metric-driven audiences, performance marketing</p>
                  <div className="rounded-xl overflow-hidden border border-slate-800">
                    <ThirtySecondSpot version="360x-faster" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <section className="py-20 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              The M Advantage
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Fortune 1000 Leaders Choose M
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Transform how your organization responds to the moments that matter
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6">
                <Clock className="h-10 w-10 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">12-Minute Execution</h3>
                <p className="text-slate-400">
                  Pre-staged playbooks with predetermined stakeholders and tasks. No meetings. No delays.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Coordinated Response</h3>
                <p className="text-slate-400">
                  Every stakeholder knows their role before the call comes. Parallel execution across teams.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-6">
                <Zap className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">AI-Powered Monitoring</h3>
                <p className="text-slate-400">
                  Continuous intelligence scanning. Automatic trigger detection. Real-time alerts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Execute at the Speed of Change?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join Fortune 1000 leaders who have transformed their strategic response capability
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sandbox">
              <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400" data-testid="button-try-demo-bottom">
                <Play className="mr-2 h-5 w-5" />
                Try Interactive Demo
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-slate-600 text-white hover:bg-slate-800"
                data-testid="button-contact"
              >
                Contact Sales
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            M Platform - Strategic Execution Operating System
          </p>
        </div>
      </footer>
    </div>
  );
}
