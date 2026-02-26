import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Clock, ArrowLeft, User, Quote } from "lucide-react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import FounderStoryIntro from "@/components/marketing/FounderStoryIntro";
import FounderStoryFull from "@/components/marketing/FounderStoryFull";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function FounderStory() {
  const [activeVideo, setActiveVideo] = useState<"none" | "intro" | "full">("none");

  const handleVideoComplete = () => {
    setActiveVideo("none");
  };

  if (activeVideo === "intro") {
    return (
      <PageLayout>
        <FounderStoryIntro onComplete={handleVideoComplete} onSkip={handleVideoComplete} />
      </PageLayout>
    );
  }

  if (activeVideo === "full") {
    return (
      <PageLayout>
        <FounderStoryFull onComplete={handleVideoComplete} onSkip={handleVideoComplete} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: "#0A0F2E", padding: "80px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background Grid Accent */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(#DFC178 1px, transparent 1px), linear-gradient(90deg, #DFC178 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: "#DFC178", flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#DFC178" }}>Meet the Founder</span>
          </div>
          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#fff", marginBottom: 24 }}>
            The Story Behind <em style={{ fontStyle: "italic", color: "#DFC178" }}>Execution OS</em>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            20 years of Fortune 500 experience. 5 years coaching major college football. One mission: eliminate the chaos between strategy and execution.
          </p>
        </div>
      </section>

      <main className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Video Selection Cards */}
          <div className="grid md:grid-cols-2 gap-12 mb-24">
            {/* 90-Second Intro */}
            <div className="border border-[#E8E4DC] bg-white group hover:border-[#0A0F2E] transition-colors overflow-hidden">
              <div className="aspect-video bg-[#0A0F2E] flex items-center justify-center relative cursor-pointer" onClick={() => setActiveVideo("intro")}>
                <div style={{ width: 64, height: 64, border: "1px solid #DFC178", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play className="h-6 w-6 text-[#DFC178]" />
                </div>
                <div style={{ position: "absolute", bottom: 16, right: 16, fontSize: 10, fontWeight: 700, color: "#DFC178", letterSpacing: "0.1em" }}>90 SECONDS</div>
              </div>
              <div className="p-8">
                <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#0A0F2E", marginBottom: 12 }}>Quick Intro</h3>
                <p className="text-[#6B7280] mb-8">The 72-hour problem, the football insight, and why Execution OS exists. Perfect for a quick overview.</p>
                <Button 
                  onClick={() => setActiveVideo("intro")}
                  style={{ background: "#0A0F2E", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", width: "100%" }}
                >
                  Watch Now
                </Button>
              </div>
            </div>

            {/* Full Story */}
            <div className="border border-[#E8E4DC] bg-white group hover:border-[#0A0F2E] transition-colors overflow-hidden">
              <div className="aspect-video bg-[#0A0F2E] flex items-center justify-center relative cursor-pointer" onClick={() => setActiveVideo("full")}>
                <div style={{ width: 64, height: 64, border: "1px solid #DFC178", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play className="h-6 w-6 text-[#DFC178]" />
                </div>
                <div style={{ position: "absolute", bottom: 16, right: 16, fontSize: 10, fontWeight: 700, color: "#DFC178", letterSpacing: "0.1em" }}>3:30 MINUTES</div>
              </div>
              <div className="p-8">
                <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#0A0F2E", marginBottom: 12 }}>The Full Story</h3>
                <p className="text-[#6B7280] mb-8">The complete narrative: McKinsey research, Fortune 500 experiences, the IDEA framework, and the vision for strategic execution.</p>
                <Button 
                  onClick={() => setActiveVideo("full")}
                  style={{ border: "1.5px solid #0A0F2E", background: "transparent", color: "#0A0F2E", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", width: "100%" }}
                >
                  Watch Full Story
                </Button>
              </div>
            </div>
          </div>

          {/* Founder Bio Section */}
          <div className="grid md:grid-cols-12 gap-12 mb-24 items-start">
            <div className="md:col-span-4">
              <div style={{ width: "100%", aspectRatio: "1/1", background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", color: "#DFC178", fontSize: 48, fontWeight: 700, marginBottom: 24 }}>MB</div>
              <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#0A0F2E" }}>Martin Brunke</h3>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginTop: 4 }}>Founder & CEO</p>
            </div>
            <div className="md:col-span-8">
              <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0A0F2E", marginBottom: 24 }}>Fortune 500 Experience</h4>
              <div className="flex flex-wrap gap-3 mb-12">
                {["Ford", "Toyota", "Lockheed Martin", "Boyd Gaming", "Churchill Downs", "Charles Schwab"].map((company) => (
                  <div key={company} style={{ border: "1px solid #E8E4DC", padding: "8px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0A0F2E" }}>{company}</div>
                ))}
              </div>

              <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0A0F2E", marginBottom: 24 }}>The Unique Perspective</h4>
              <div className="space-y-6 text-lg text-[#6B7280] leading-relaxed">
                <p>After 20 years navigating crises, transformations, and strategic initiatives across gaming, automotive, financial services, aerospace, and pharma—and 5 years coaching major college football—Martin saw a pattern that no one was solving.</p>
                <p><strong style={{ color: "#0A0F2E" }}>The insight:</strong> In football, you'd never run a play without practicing it. But in business, organizations improvise their most critical moments. Execution OS brings the discipline of championship execution to enterprise strategy.</p>
              </div>
            </div>
          </div>

          {/* Quote Section */}
          <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 80, textAlign: "center" }}>
            <Quote className="h-12 w-12 text-[#E8E4DC] mx-auto mb-8" />
            <blockquote style={{ ...CG, fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 500, color: "#0A0F2E", lineHeight: 1.3, fontStyle: "italic", maxWidth: "900px", margin: "0 auto" }}>
              "Strategy is 10% of the work. Execution is 90%. <em style={{ color: "#C9A84C" }}>Execution OS is built for the 90%.</em>"
            </blockquote>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 32 }}>— Martin Brunke</p>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
  );
}
