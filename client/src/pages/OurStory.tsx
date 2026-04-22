import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Building2, 
  TrendingDown, 
  Lightbulb, 
  Rocket,
  ArrowRight,
  Play,
  Quote,
  Check
} from "lucide-react";
import { useLocation, Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PullQuote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <div className="relative my-24 py-12 border-y border-[#E8E4DC]">
      <Quote className="absolute -top-6 left-0 h-12 w-12 text-[#E8E4DC]" />
      <blockquote style={{ ...CG, fontSize: "clamp(24px, 4vw, 32px)", lineHeight: 1.4, color: "#0A0F2E", fontStyle: "italic", paddingLeft: "48px" }}>
        {children}
      </blockquote>
      {author && (
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 24, paddingLeft: "48px" }}>— {author}</p>
      )}
    </div>
  );
}

function TimelineChapter({ 
  number, 
  title, 
  color,
  children 
}: { 
  number: string; 
  title: string; 
  color: "navy" | "gold" | "teal";
  children: React.ReactNode;
}) {
  const colors = {
    navy: "#0A0F2E",
    gold: "#C9A84C",
    teal: "#2B8A6E"
  };

  return (
    <AnimatedSection className="mb-24">
      <div className="relative pl-12 md:pl-20 pb-12 border-l border-[#E8E4DC] ml-4">
        {/* Timeline dot */}
        <div style={{ position: "absolute", left: -6, top: 8, width: 12, height: 12, background: colors[color], borderRadius: 0 }} />
        
        {/* Chapter header */}
        <div className="mb-8">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 24, height: 1, background: colors[color] }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: colors[color] }}>
              {number}
            </span>
          </div>
          <h2 style={{ ...CG, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, color: "#0A0F2E" }}>
            {title}
          </h2>
        </div>
        
        {/* Chapter content */}
        <div className="space-y-6 text-lg text-[#6B7280] leading-relaxed">
          {children}
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function OurStory() {
  const [, setLocation] = useLocation();

  return (
    <PageLayout>
      <PageHero
        eyebrow="The Origin Story"
        title="40-Second Decisions. Years of Preparation."
        subtitle="How one coach's championship methodology became the execution engine for Fortune 1000 companies."
        size="lg"
      />

      {/* Name Origin */}
      <div style={{ background: "#F8F7F4", borderBottom: "1px solid #E8E4DC", padding: "72px 48px" }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>The Name</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 style={{ ...CG, fontSize: "clamp(28px,4vw,42px)", fontWeight: 600, color: "#0A0F2E", lineHeight: 1.15, marginBottom: 20 }}>
                VaughnMartin is named after my father.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "#6B7280", marginBottom: 16 }}>
                He taught me that preparation isn't about knowing what will happen — it's about being ready when it does. That philosophy shaped how I coached. It shaped how I ran transformation programs inside Fortune 500 companies. And it's the foundation of every prepared response in this system.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "#6B7280" }}>
                I built Readiness OS because I spent five years on the football sideline and twenty years in Fortune 500 boardrooms — and I couldn't unsee the gap between how two groups of equally talented people handled the exact same problem.
              </p>
            </div>
            <div style={{ background: "#0A0F2E", padding: "48px 40px" }}>
              <blockquote style={{ ...CG, fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 500, fontStyle: "italic", lineHeight: 1.5, color: "#fff", marginBottom: 24 }}>
                "The gap isn't talent. It's the infrastructure talent operates inside of."
              </blockquote>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)", marginBottom: 20 }} />
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C" }}>
                Martin Brunke — Founder, VaughnMartin
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
                5 years college football · 20+ years Fortune 500 transformation
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Prologue */}
          <TimelineChapter number="Prologue" title="The Moment Everything Changed" color="gold">
            <p className="font-semibold text-[#0A0F2E] text-xl">
              Saturday afternoon. Eugene, Oregon. 2001.
            </p>
            <p>
              Down by 14 points. Ten minutes remaining. 80,000 fans watching. 
              National television cameras rolling. I'm in the coaches' box when my head coach says two words over the headset:
            </p>
            
            <div style={{ background: "#F8F7F4", borderLeft: "4px solid #C9A84C", padding: "32px", margin: "32px 0" }}>
              <p style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#0A0F2E", fontStyle: "italic" }}>
                "Momentum change."
              </p>
            </div>

            <p className="font-semibold text-[#0A0F2E]">
              In the next 40 seconds, we made a critical decision and executed:
            </p>
            <ul className="space-y-3">
              {[
                "We had practiced this exact scenario dozens of times",
                "The trigger fired—everyone knew their play",
                "11 players received the signal and adjusted instantly",
                "No huddle. No meeting. No debate. Just execution."
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#2B8A6E] shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ background: "#F8F7F4", borderLeft: "4px solid #2B8A6E", padding: "32px", margin: "32px 0" }}>
              <p className="font-semibold text-[#0A0F2E]">
                Blocked punt. Immediate score. Onside kick recovery. Another touchdown. 
                Defensive interception. <span style={{ color: "#2B8A6E" }}>Game won.</span>
              </p>
            </div>
          </TimelineChapter>

          <PullQuote>
            This wasn't luck. This was preparation meeting opportunity—practiced plays ready to execute the instant the trigger fired.
          </PullQuote>

          {/* Chapter 1 */}
          <TimelineChapter number="Chapter 1" title="The Monday Morning Paradox" color="navy">
            <p className="font-semibold text-[#0A0F2E] text-xl">
              Same week. Fortune 500 boardroom. Same type of crisis.
            </p>
            
            <div style={{ background: "#F8F7F4", borderLeft: "4px solid #0A0F2E", padding: "32px", margin: "32px 0" }}>
              <p className="text-lg mb-2 text-[#6B7280]">"Our competitor just launched a similar product."</p>
              <p style={{ ...CG, fontSize: 28, fontWeight: 600, color: "#0A0F2E", fontStyle: "italic" }}>
                "Let me schedule a meeting to discuss our response."
              </p>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", marginTop: 16 }}>
                That meeting was scheduled three days later.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div style={{ background: "#F8F7F4", padding: "32px", textAlign: "center", border: "1px solid #E8E4DC" }}>
                <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: "#2B8A6E", lineHeight: 1 }}>40 sec</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Saturday Crisis Response</div>
              </div>
              <div style={{ background: "#F8F7F4", padding: "32px", textAlign: "center", border: "1px solid #E8E4DC" }}>
                <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>30 days</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Traditional Mobilization Cycle</div>
              </div>
            </div>

            <p className="text-xl font-medium text-[#0A0F2E]">
              Same competitive threat. Same need for coordinated action. 
              <span style={{ color: "#C9A84C" }}> Vastly different outcomes.</span>
            </p>
          </TimelineChapter>

          <PullQuote author="The Readiness OS Philosophy">
            Why do Fortune 1000 enterprises take 30 days for decisions that championship teams make in 40 seconds?
          </PullQuote>

          {/* Chapter 2 */}
          <TimelineChapter number="Chapter 2" title="The 10,000x Speed Gap" color="gold">
            <p>We spent years studying this gap. The data was staggering:</p>

            <div className="grid grid-cols-3 gap-4 my-12">
              {[
                { val: "$144M", label: "Value Gap" },
                { val: "87%", label: "Fail Rate" },
                { val: "10,000x", label: "Speed Gap" }
              ].map(item => (
                <div key={item.label} style={{ background: "#F8F7F4", padding: "24px 16px", textAlign: "center", border: "1px solid #E8E4DC" }}>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>{item.val}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>{item.label}</div>
                </div>
              ))}
            </div>

            <p>
              While competitors moved at game speed, enterprises were stuck in quarterly planning cycles, 
              endless alignment meetings, and reactive crisis management.
            </p>
          </TimelineChapter>

          {/* Chapter 3 */}
          <TimelineChapter number="Chapter 3" title="Building the Infrastructure" color="teal">
            <p>We studied what makes elite execution systems effective. Four principles emerged:</p>

            <div className="grid md:grid-cols-2 gap-6 my-12">
              {[
                { icon: Trophy, title: "Pre-Defined Governance" },
                { icon: Building2, title: "24/7 Monitoring" },
                { icon: TrendingDown, title: "Instant Coordination" },
                { icon: Lightbulb, title: "Institutional Memory" },
              ].map((item, i) => (
                <div key={i} style={{ border: "1px solid #E8E4DC", padding: "24px", background: "#F8F7F4" }}>
                  <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <h4 style={{ ...CG, fontSize: 20, fontWeight: 600, color: "#0A0F2E", marginBottom: 8 }}>{item.title}</h4>
                  <p style={{ fontSize: 14, color: "#6B7280" }}>Infrastructure that identifies patterns and identifies triggers before you need them.</p>
                </div>
              ))}
            </div>
          </TimelineChapter>

          {/* Chapter 4 */}
          <TimelineChapter number="Chapter 4" title="Readiness OS Was Born" color="navy">
            <p>
              We translated 20 years of experience into the execution infrastructure 
              Fortune 1000 executives have been missing:
            </p>

            <ul className="space-y-4 my-12">
              {[
                "170 battle-tested prepared responses across 9 strategic domains",
                "Continuous monitoring across 248+ intelligence signals",
                "12-minute coordinated response when triggers fire",
                "Institutional memory that makes every response smarter"
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <div style={{ width: 24, height: 24, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-[#0A0F2E] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </TimelineChapter>

          {/* Chapter 5 */}
          <TimelineChapter number="Chapter 5" title="Built on Proven Methodology" color="gold">
            <p>
              Readiness OS isn't theoretical. It's built on <strong>Dynamic Strategy</strong>—the methodology 
              trusted by the world's most demanding organizations.
            </p>

            <div style={{ background: "#0A0F2E", padding: "48px", margin: "48px 0", textAlign: "center" }}>
              <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Ready to See the Infrastructure?</h3>
              <p className="text-white/60 mb-8">Replace reactive scrambles with coordinated precision.</p>
              <div className="flex justify-center gap-4">
                <Link href="/demo-selector">
                  <Button style={{ background: "#C9A84C", color: "#0A0F2E", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px", border: "none" }}>
                    Watch Demo
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff", background: "transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px" }}>
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </TimelineChapter>
        </div>
      </section>
    </PageLayout>
  );
}
