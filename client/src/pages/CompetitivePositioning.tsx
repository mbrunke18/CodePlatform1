import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Zap, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Bell,
  Settings,
  Play
} from 'lucide-react';
import { useEffect } from 'react';
import { updatePageMetadata } from '@/lib/seo';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

export default function CompetitivePositioning() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Competitive Positioning - Execution OS | Strategic Execution OS",
      description: "See how Execution OS creates a new category between crisis notification tools (Everbridge, OnSolve) and project management (Jira, Asana). The execution layer Fortune 1000 companies need.",
      ogTitle: "Execution OS vs. Crisis Tools vs. PM Tools | Category of One",
      ogDescription: "Execution OS isn't competing with Everbridge or Jira. Execution OS owns the strategic execution layer between them.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="bg-white">
        
        {/* Hero Section */}
        <section style={{ background: "#0A0F2E", padding: "64px 48px", position: "relative", overflow: "hidden", minHeight: 320 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Market Position</span>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
              The Strategic Execution Layer <em style={{ fontStyle: "italic", color: "#DFC178" }}>Category of One</em>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Crisis tools notify. PM tools track. Execution OS executes. We're not competing with Everbridge or Jira—we own the 
              <span className="text-[#DFC178] font-semibold"> 20-50 hours of coordination </span> 
              that happens between alert and action.
            </p>
            
            {/* Three Category Visual */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <Bell className="w-5 h-5 text-white/40 inline mr-2" />
                <span className="text-white/60 font-medium">Crisis Notification</span>
                <div className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">Everbridge, OnSolve, Noggin</div>
              </div>
              <div style={{ border: "1px solid #C9A84C", padding: "16px 24px", background: "rgba(201,168,76,0.1)" }} className="rounded-lg">
                <Zap className="w-5 h-5 text-[#DFC178] inline mr-2" />
                <span className="text-white font-bold">Strategic Execution</span>
                <div className="text-[10px] text-[#DFC178] mt-1 uppercase tracking-wider font-bold">Execution OS (Category of One)</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <Settings className="w-5 h-5 text-white/40 inline mr-2" />
                <span className="text-white/60 font-medium">Project Management</span>
                <div className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">Jira, Asana, ServiceNow</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
                onClick={() => setLocation('/try-demo')}
              >
                <Play className="w-5 h-5 mr-2" />
                See 12-Minute Activation
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border border-white/20 text-white/60 bg-transparent hover:bg-white/10"
                onClick={() => setLocation('/contact')}
              >
                Start Pilot Program
              </Button>
            </div>
          </div>
        </section>

        {/* The Gap We Fill */}
        <section className="py-16 px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E", marginBottom: 12 }}>
                The $2M Gap Between Alert and Action
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                When a strategic event hits, organizations spend 20-50 hours getting organized. 
                That's $60K-$2M in lost value per major event. Execution OS eliminates that gap entirely.
              </p>
            </div>

            {/* Visual Timeline */}
            <div className="border border-[#E8E4DC] bg-white p-8 hover:border-[#0A0F2E] transition-colors mb-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Without Execution OS */}
                <div className="flex-1 text-center">
                  <div className="text-[#C9A84C] font-bold text-lg mb-4 uppercase tracking-widest">Without Execution OS</div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <div className="p-3 text-center" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Alert</div>
                      <div className="font-bold text-slate-900">T+0</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="p-3 text-center" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Triage</div>
                      <div className="font-bold text-slate-900">+8h</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="p-3 text-center" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Planning</div>
                      <div className="font-bold text-slate-900">+24h</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="p-3 text-center" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Coordination</div>
                      <div className="font-bold text-slate-900">+48h</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="p-3 text-center" style={{ background: "#F8F7F4", border: "1px solid #E8E4DC" }}>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Execution</div>
                      <div className="font-bold text-slate-900">+72h</div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-24 bg-[#E8E4DC]"></div>
                <div className="md:hidden h-px w-full bg-[#E8E4DC]"></div>

                {/* With Execution OS */}
                <div className="flex-1 text-center">
                  <div className="text-teal-600 font-bold text-lg mb-4 uppercase tracking-widest">With Execution OS</div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <div className="p-3 text-center" style={{ background: "rgba(43,138,110,0.05)", border: "1px solid rgba(43,138,110,0.2)" }}>
                      <div className="text-[10px] text-teal-600 uppercase font-bold tracking-tighter">Alert</div>
                      <div className="font-bold text-teal-700">T+0</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-teal-400" />
                    <div className="p-3 text-center" style={{ background: "rgba(43,138,110,0.1)", border: "2px solid #2B8A6E" }}>
                      <div className="text-[10px] text-teal-600 uppercase font-bold tracking-tighter">Execution</div>
                      <div className="font-bold text-teal-700">T+12m</div>
                    </div>
                  </div>
                  <div className="mt-4 text-teal-600 font-bold text-sm">99% Faster Response</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#F8F7F4", padding: "64px 48px" }}>
          <div className="max-w-3xl mx-auto text-center">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Get Started</span>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E", marginBottom: 12 }}>
              Stop Managing. Start Executing.
            </h2>
            <p className="text-slate-600 mb-8">
              Join the pilot program and move your organization to Execution OS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"
                onClick={() => setLocation('/contact')}
              >
                Request Pilot Access
              </Button>
              <Button 
                size="lg" 
                style={{ border: "1.5px solid #E8E4DC", color: "#0A0F2E", background: "transparent" }}
                onClick={() => setLocation('/try-demo')}
              >
                Try Interactive Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
