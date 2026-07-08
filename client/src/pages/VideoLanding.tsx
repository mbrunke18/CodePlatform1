import { useState, useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Play, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import PageLayout from '@/components/layout/PageLayout';
import CinematicHero from "@/components/marketing/CinematicHero";
import ThirtySecondSpot from "@/components/marketing/ThirtySecondSpot";

type SpotVersion = "offense-defense" | "first-mover" | "360x-faster";

const SPOTS: { version: SpotVersion; label: string; subtitle: string; accent: string }[] = [
  {
    version: "offense-defense",
    label: "Version 1",
    subtitle: "Growth, Resilience & Transformation",
    accent: "#C9A84C",
  },
  {
    version: "first-mover",
    label: "Version 2",
    subtitle: "The First Mover",
    accent: "#2B8A6E",
  },
  {
    version: "360x-faster",
    label: "Version 3",
    subtitle: "3,600× Execution Head Start",
    accent: "#0A0F2E",
  },
];

function SpotSelector() {
  const [active, setActive] = useState<SpotVersion>("offense-defense");
  const [spotKey, setSpotKey] = useState(0);

  const selectVersion = (v: SpotVersion) => {
    setActive(v);
    setSpotKey((k) => k + 1);
  };

  return (
    <div>
      {/* Version selector */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {SPOTS.map((s) => {
          const isActive = active === s.version;
          return (
            <button
              key={s.version}
              onClick={() => selectVersion(s.version)}
              data-testid={`spot-select-${s.version}`}
              style={{
                color: isActive ? s.accent : "#6B7280",
                background: "none",
                border: "none",
                borderBottom: isActive ? `2px solid ${s.accent}` : "2px solid transparent",
                padding: "10px 20px 8px",
                cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                transition: "all 0.15s",
              }}
            >
              <span style={{ display: "block", fontSize: 9, opacity: 0.6, marginBottom: 2 }}>
                {s.label}
              </span>
              {s.subtitle}
            </button>
          );
        })}
      </div>

      {/* Full-width spot display */}
      <div className="border border-[#E8E4DC] bg-white" style={{ minHeight: 540 }}>
        <ThirtySecondSpot key={spotKey} version={active} />
      </div>
    </div>
  );
}

function getInitialTab(loc: string): string {
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
      title: "Watch the Demo - Readiness OS | 30 Days → 12 Minutes",
      description:
        "Watch the full narrated Readiness OS platform demo — sourced financial figures, real activation scenarios, and how strategic mobilization compresses from 30 days to 12 minutes.",
      ogTitle: "Readiness OS - The Speed to Execute",
      ogDescription:
        "180 Readiness Protocols. 12 minutes to live execution — roles assigned, tasks staged, teams moving. The Readiness Infrastructure.",
    });
  }, []);

  return (
    <PageLayout>
      <h1 className="sr-only">Platform Overview Video — Readiness OS</h1>
      <div className="pt-20">
        {/* Dark Hero */}
        <div
          style={{
            background: "#0A0F2E",
            padding: "40px 0 36px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)",
              backgroundSize: "44px 44px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 24px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Link href="/">
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(240,237,228,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                data-testid="button-back-home"
              >
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back to Home
              </button>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                }}
              >
                Executive Resources
              </span>
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 30,
                fontWeight: 700,
                color: "#F0EDE4",
                marginBottom: 10,
                lineHeight: 1.1,
              }}
              data-testid="heading-video-hub"
            >
              The Full Demo, <em style={{ color: "#C9A84C" }}>Brand Films & Spots</em>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(240,237,228,0.55)",
                maxWidth: 560,
                lineHeight: 1.6,
              }}
            >
              Watch the full narrated platform walkthrough, or browse the cinematic cutdowns built
              for trade shows, conferences, and broadcast.
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList
              className="grid w-full max-w-2xl grid-cols-2 bg-white border border-[#E8E4DC] p-1 rounded-none mb-12"
              data-testid="video-tabs"
            >
              <TabsTrigger
                value="90-second"
                className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-none font-bold uppercase text-[9px] tracking-widest py-3 text-[#6B7280]"
                data-testid="tab-90-second"
              >
                <Clock className="h-3 w-3 mr-2" />
                90 Seconds
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

            {/* ── 90-Second Cinematic ── */}
            <TabsContent value="90-second" className="mt-0">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-[#2B8A6E] text-white rounded-none uppercase text-[9px] font-bold tracking-widest px-3 py-1 border-0">
                    Primary
                  </Badge>
                  <h2
                    className="text-2xl font-bold text-[#0A0F2E]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    data-testid="heading-90-second"
                  >
                    "The Speed to Execute" — 90-Second Brand Film
                  </h2>
                </div>
                <p className="text-[#6B7280] text-sm uppercase tracking-widest font-bold">
                  Purpose: Trade show booth loop · conference opener · website hero · investor
                  meetings
                </p>
              </div>
              <div className="rounded-none overflow-hidden border border-[#E8E4DC]">
                <CinematicHero />
              </div>
            </TabsContent>

            {/* ── 30-Second Spots ── */}
            <TabsContent value="30-second" className="mt-0">
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold text-[#0A0F2E] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  data-testid="heading-30-second"
                >
                  30-Second Spots — Three Versions
                </h2>
                <p className="text-[#6B7280] text-sm uppercase tracking-widest font-bold">
                  Purpose: Social media · LinkedIn · brand awareness · performance marketing
                </p>
              </div>
              <SpotSelector />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── Why Leaders Choose Readiness OS ── */}
      <section className="py-24 px-6 bg-[#F8F7F4] border-y border-[#E8E4DC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                }}
              >
                The Advantage
              </span>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Why startup to Fortune 500 Leaders Choose{" "}
              <em className="italic text-[#C9A84C]">Readiness OS</em>
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto font-light leading-relaxed">
              Transform how your organization responds to the moments that matter
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-[#E8E4DC] rounded-none hover:border-[#0A0F2E] transition-all duration-300 shadow-none">
              <CardContent className="p-8">
                <h3
                  className="text-2xl font-bold text-[#0A0F2E] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  12-Minute Execution
                </h3>
                <p className="text-[#6B7280] leading-relaxed font-light">
                  Pre-staged Readiness Protocols with predetermined stakeholders and tasks. No
                  meetings. No delays.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E8E4DC] rounded-none hover:border-[#0A0F2E] transition-all duration-300 shadow-none">
              <CardContent className="p-8">
                <h3
                  className="text-2xl font-bold text-[#0A0F2E] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Coordinated Response
                </h3>
                <p className="text-[#6B7280] leading-relaxed font-light">
                  Every stakeholder knows their role before the call comes. Parallel execution
                  across teams.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E8E4DC] rounded-none hover:border-[#0A0F2E] transition-all duration-300 shadow-none">
              <CardContent className="p-8">
                <h3
                  className="text-2xl font-bold text-[#0A0F2E] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Continuous Signal Monitoring
                </h3>
                <p className="text-[#6B7280] leading-relaxed font-light">
                  Continuous intelligence scanning. Automatic trigger detection. Real-time alerts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-[#0A0F2E] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='g' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M10 0L0 0 0 10' fill='none' stroke='rgba(200,170,76,0.1)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{ width: 28, height: 2, background: "rgba(255,255,255,0.3)", flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C9A84C",
              }}
            >
              Get Started
            </span>
            <div
              style={{ width: 28, height: 2, background: "rgba(255,255,255,0.3)", flexShrink: 0 }}
            />
          </div>
          <h2
            className="text-4xl md:text-6xl font-bold text-white mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Ready to Execute at the{" "}
            <em className="italic text-[#C9A84C]">Speed of Change?</em>
          </h2>
          <p className="text-xl text-white/60 mb-12 font-light leading-relaxed">
            Join enterprise leaders who have transformed their strategic response capability
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/demo-hub">
              <Button
                size="lg"
                className="px-10 py-8 text-lg bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] rounded-none font-bold uppercase tracking-widest"
                data-testid="button-try-demo-bottom"
              >
                <Play className="mr-3 h-5 w-5" />
                Full Platform Demo
              </Button>
            </Link>

            <Link href="/request-access">
              <Button
                size="lg"
                variant="outline"
                className="px-10 py-8 text-lg border-white/20 text-white hover:bg-white/10 rounded-none font-bold uppercase tracking-widest"
                data-testid="button-contact"
              >
                Apply for Founding Partner Access
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-white border-t border-[#E8E4DC]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#6B7280] text-xs font-bold uppercase tracking-[0.3em]">
            Readiness OS — Readiness Infrastructure by VaughnMartin
          </p>
        </div>
      </footer>
    </PageLayout>
  );
}
