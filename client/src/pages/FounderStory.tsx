import { useState } from "react";
import { Play } from "lucide-react";
import executiveDecisionImg from "@/assets/images/executive-decision.png";
import PageLayout from "@/components/layout/PageLayout";
import FounderStoryIntro from "@/components/marketing/FounderStoryIntro";
import FounderStoryFull from "@/components/marketing/FounderStoryFull";
import { Link } from "wouter";

const NAVY = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#DFC178";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function RomanDivider({ num }: { num: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD }}>— {num} —</span>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 28, margin: "40px 0", maxWidth: 640 }}>
      <p style={{ ...CG, fontSize: 22, fontWeight: 500, color: NAVY, lineHeight: 1.5, fontStyle: "italic" }}>{children}</p>
    </div>
  );
}

function Body({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 17, lineHeight: 1.85, color: "#374151", marginBottom: 24, fontWeight: 400, ...style }}>{children}</p>
  );
}

export default function FounderStory() {
  const [activeVideo, setActiveVideo] = useState<"none" | "intro" | "full">("none");

  const handleVideoComplete = () => setActiveVideo("none");

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

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY_BG, padding: "96px 48px 80px", textAlign: "center", position: "relative", overflow: "hidden", backgroundImage: `url(${executiveDecisionImg})`, backgroundSize: "cover", backgroundPosition: "center top" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,15,46,0.85)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.09) 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", top: -100, right: -60, width: 700, height: 700, background: "radial-gradient(ellipse,rgba(43,138,110,0.15) 0%,transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 600, height: 600, background: "radial-gradient(ellipse,rgba(201,168,76,0.10) 0%,transparent 60%)", pointerEvents: "none" }} />

        <div className="max-w-4xl mx-auto relative" style={{ zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", padding: "8px 20px", marginBottom: 28, backdropFilter: "blur(4px)" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD_LIGHT }}>THE MANIFESTO</span>
          </div>
          <h1 style={{ ...CG, fontSize: "clamp(42px,5.5vw,64px)", fontWeight: 600, color: "#fff", lineHeight: 1.05, marginBottom: 24 }}>
            We Make Enterprises <em style={{ color: GOLD_LIGHT, fontStyle: "italic" }}>Fearless</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", fontWeight: 500 }}>
            Martin Brunke · Founder, VaughnMartin · 2023
          </p>
        </div>
      </section>

      {/* ── Reader Orientation ─────────────────────────────────────────────── */}
      <div style={{ background: "#F8F7F4", borderBottom: "1px solid #E8E4DC", padding: "16px 48px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Long Read</span>
          <span style={{ fontSize: 12, color: "#6B7280" }}>The full thesis — the research, the 20-year observation, and the belief behind VaughnMartin. Estimated 12–15 minutes.</span>
        </div>
      </div>

      {/* ── Manifesto Body ────────────────────────────────────────────────── */}
      <main style={{ background: "#fff" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "80px 32px" }}>

          {/* ── Origin — The Father's Words ───────────────────────────────── */}
          <div style={{ paddingBottom: 64, marginBottom: 56, borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <div style={{ width: 20, height: 1.5, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>The Origin</span>
            </div>
            <Body>
              My father put me in shoulder pads for the first time in the third grade. On the first day, he looked at me and said four things: <em>prepare</em>, <em>practice</em>, <em>perform fearless</em> — and never give up. I was eight years old. I did not fully understand what he meant. But I felt the weight of it. He was not giving me tips for a game. He was handing me an operating model for a life.
            </Body>
            <Body>
              I carried those four words from a third-grade football field through twenty years inside Fortune 1000 companies. Into every boardroom, every sideline, every organization that was either ready when the moment came or scrambling to build the response after the signal had already fired. The pattern was the same everywhere I looked: the organizations that had prepared in advance moved without fear. The ones that had not were still aligning when the window closed.
            </Body>
            <Body>
              When I built this company and named it for the family that gave me that framework, I named it because this platform is the same idea applied at enterprise scale. Prepare the response before the trigger fires. Practice the prepared response before the pressure arrives. Perform without hesitation when the moment comes. And when the first activation is imperfect, never stop — the system advances, the library compounds, and the next response is faster than the last.
            </Body>
            <PullQuote>
              "Every enterprise that prepares for every situation it will face is no longer afraid of what comes next. That is not a product feature. That is the point."
            </PullQuote>
            <Body style={{ fontStyle: "italic", color: MUTED }}>
              The arc from my father's words to this platform is not a metaphor. Preparation produces readiness. Readiness produces fearlessness. The sequence he named on a football field is the operating logic of every prepared response in this system.
            </Body>
          </div>

          {/* I */}
          <RomanDivider num="I" />
          <Body>
            I stood on a sideline for five years — major college football — watching something most people never see up close.
          </Body>
          <Body>
            Sixty to eighty decisions in three hours. Each one made in forty seconds or less. Offense on the field to score. Defense on the field to stop. Special teams on the field to change field position. Three distinct units, each with eleven players, each with completely different assignments, each drawn from a roster of over a hundred who all have to know their role the moment their number is called. In front of a hundred thousand people. On national television. With every coordinator on both sidelines watching for the same vulnerability to exploit.
          </Body>
          <Body>
            It is the same system that runs every NFL franchise — the most operationally complex, most financially scrutinized, most publicly accountable organizations in American sport. Billion-dollar businesses built entirely around the ability to make the right coordinated decision in forty seconds. The same infrastructure principle. The same forty-second window. The same consequence for getting it wrong in front of everyone watching.
          </Body>
          <Body>
            And then it gets harder. The play gets called. The team breaks the huddle. They line up. And the defense shifts. What the coaches saw from the booth is no longer what the quarterback sees at the line. The entire response has to change — instantly, without a timeout, without a meeting, without anyone asking for clarification. The quarterback reads the new situation, makes the call, and eleven people pivot to a completely different assignment in the same forty seconds.
          </Body>
          <PullQuote>
            "That is coordination infrastructure performing under the highest pressure I have ever witnessed."
          </PullQuote>
          <Body>
            Not because the players were exceptional — though many were. Because the system was built before the game started. The prepared response wasn't assembled on the sideline. Every scenario had already been prepared for. Every role had already been defined. Every pivot had already been rehearsed. When the situation changed at the line of scrimmage, nobody panicked. They already knew what to do next.
          </Body>
          <Body>
            I loved that. The clarity of it. The way preparation collapsed the distance between a changing situation and a perfectly coordinated response to almost nothing.
          </Body>
          <Body style={{ fontWeight: 600, color: NAVY }}>
            Then I walked into corporate America.
          </Body>

          {/* II */}
          <RomanDivider num="II" />
          <Body>
            The first time I watched a Fortune 500 company respond to a strategic event, I thought I was seeing an anomaly. A competitor moved. A regulation shifted. A market signal fired that demanded immediate response. And the organization — a sophisticated, well-resourced, deeply talented organization — spent three days figuring out who should be in the room.
          </Body>
          <Body style={{ fontWeight: 600, color: NAVY }}>
            Not responding. Not executing. Aligning.
          </Body>
          <Body>
            I watched it happen again at the next company. And the one after that. Ford. Lockheed Martin. Toyota. Charles Schwab. Vantiv. Boyd Gaming. Churchill Downs. Across industries, across market positions, across leadership styles and organizational structures and cultures — the same failure repeated itself with remarkable consistency.
          </Body>
          <Body>
            A signal fires. The enterprise stirs. Emails go out. Calendars get checked. Decks get built to explain the situation to people who need to be briefed before anyone can decide anything. Thirty days later — sometimes more — the organization is finally aligned enough to begin moving. By which point the moment has often passed, the competitor has established position, or the window for advantage has closed.
          </Body>
          <Body>
            What struck me most was not the lag itself. It was the resignation around it. Intelligent, capable people treating thirty days as the unavoidable cost of organizational complexity — as if coordination delay were a law of physics rather than a solvable infrastructure problem. Nobody said it was good. Everyone said it was inevitable.
          </Body>
          <Body style={{ fontWeight: 600, color: NAVY }}>
            After the third company I stopped being surprised. After the fifth I stopped being patient.
          </Body>
          <PullQuote>
            "That acceptance is the real problem. Not the lag. The belief that the lag is permanent."
          </PullQuote>
          <Body>
            I want to be precise about that. The people I worked alongside at every one of those companies were smart, committed, and often genuinely excellent at their jobs. The failure was not human. The failure was architectural.
          </Body>
          <Body>
            There was no coordination layer. No pre-staged response infrastructure. No system that had already answered the question — when this signal fires, here is exactly what happens next — before the signal fired. Every response had to be built from scratch, in real time, under pressure, by people who had other jobs to do.
          </Body>
          <Body style={{ fontWeight: 600, color: NAVY }}>
            The football team never had to build the play in the huddle. The enterprise always did.
          </Body>
          <Body>
            I spent twenty years watching this. And every time I watched it, I thought the same thing: I know what the answer is. I have seen it work. I have stood on the sideline where forty seconds was enough. Why has no one built this for the boardroom?
          </Body>

          {/* III */}
          <RomanDivider num="III" />
          <Body>
            The honest answer is that people tried. Just not correctly.
          </Body>
          <Body>
            The enterprise software industry — and the strategy consulting industry alongside it — built tools for every layer of organizational life except the one that actually matters when a strategic event fires. We have ERP for financial operations. CRM for customer relationships. ITSM for technology incidents. Project management platforms, collaboration tools, data warehouses, and business intelligence suites that can tell you in extraordinary detail what is happening. What we do not have — what has never existed as a dedicated infrastructure layer — is a system whose sole purpose is to compress the distance between strategic signal and coordinated execution.
          </Body>
          <PullQuote>
            "The gap between strategy and results isn't capability. It's coordination."
          </PullQuote>
          <Body>
            That sentence took me twenty years to arrive at. It sounds simple. It is not. The implication of it is that most of what organizations call an execution problem is actually a coordination infrastructure problem. The people can execute. The strategy is often sound. The gap is in the layer between them — the layer that takes a strategic decision and translates it instantly into simultaneous coordinated action across six workstreams at once.
          </Body>
          <Body>
            That layer does not exist in most enterprises. It has never existed. Every response has been improvised. And every time it has been improvised, something was lost — speed, position, advantage, sometimes the window entirely.
          </Body>
          <Body style={{ fontWeight: 700, color: NAVY, fontSize: 18 }}>
            Until now.
          </Body>

          {/* ── The Layer Nobody Built — manifesto anchor ───────────────────── */}
          <div style={{ margin: "56px -32px", background: NAVY, padding: "64px 56px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
            <div style={{ position: "absolute", top: -80, right: -60, width: 500, height: 500, background: "radial-gradient(ellipse,rgba(43,138,110,0.14) 0%,transparent 60%)", pointerEvents: "none" }} />
            <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginBottom: 32 }}>
                <div style={{ height: 1, width: 28, background: "rgba(201,168,76,0.4)" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: GOLD_LIGHT }}>Category Statement</span>
                <div style={{ height: 1, width: 28, background: "rgba(201,168,76,0.4)" }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px,4.5vw,54px)", fontWeight: 600, color: "#fff", lineHeight: 1.05, marginBottom: 28, letterSpacing: "-0.01em" }}>
                The layer nobody built.
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontWeight: 500, marginBottom: 20 }}>
                Organizations systematized finance. Customers. Tickets. Supply chains. Every layer of operational life became dedicated infrastructure. Purpose-built. Institutionalized.
              </p>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontWeight: 500, marginBottom: 36 }}>
                But never the layer that determines whether strategy actually happens. Never the system whose sole purpose is to compress the distance between a strategic signal and full organizational response. That layer — the coordination infrastructure between decision and execution — was left to improvisation. Every time. Until now.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", padding: "14px 28px" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600, color: GOLD_LIGHT, letterSpacing: "0.04em" }}>VaughnMartin</span>
                <span style={{ width: 1, height: 16, background: "rgba(201,168,76,0.3)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)" }}>The Readiness Infrastructure Enterprises Are Missing</span>
              </div>
            </div>
          </div>

          {/* IV */}
          <RomanDivider num="IV" />
          <Body>
            I built Readiness OS because I could not stop seeing the gap.
          </Body>
          <Body>
            I was not an outsider who spotted a market opportunity. I was inside these organizations for twenty years watching the same failure repeat. Role after role. Company after company. I knew what the solution looked like because I had watched the version of it work in real time under conditions that would embarrass most enterprise response timelines.
          </Body>
          <Body style={{ fontWeight: 600, color: NAVY }}>
            Sixty to eighty decisions. Forty seconds each. Three units. Over a hundred people ready to execute the moment their number is called. And a system built to pivot in real time when the situation changes at the line.
          </Body>
          <Body>
            The pre-staged Readiness Protocol. The shared coordination infrastructure. The response already built before the signal fires. That is not a football concept. It is how elite execution works anywhere the cost of lag is high. Which is everywhere. Every industry. Every scale.
          </Body>
          <Body>
            I spent twenty years knowing that and watching organizations that could afford to fix it choose not to — not out of stubbornness, but because no one had ever built the infrastructure that made it fixable. So I built it.
          </Body>

          {/* IDEA Framework */}
          <div style={{ background: NAVY, padding: "48px 40px", margin: "48px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              {[
                { letter: "I", word: "IDENTIFY", desc: "248+ signals across 9 strategic domains. Every 15 minutes. Before you ask." },
                { letter: "D", word: "DETECT", desc: "Pattern recognition fires before the crisis peaks. Not after." },
                { letter: "E", word: "EXECUTE", desc: "170 pre-built prepared responses deploy simultaneously. Twelve minutes." },
                { letter: "A", word: "ADVANCE", desc: "Every activation makes the next one smarter. The library compounds." },
              ].map(({ letter, word, desc }) => (
                <div key={letter} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1, flexShrink: 0, width: 36 }}>{letter}</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>{word}</div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Body>
            IDENTIFY means the system is already watching. 248+ data points across 9 strategic domains, every fifteen minutes. The organization is not waiting to be surprised. It knows what is moving before anyone calls a meeting about it.
          </Body>
          <Body>
            DETECT means pattern recognition fires before the crisis peaks. Not after the call comes in. Not after someone builds a deck to explain what is happening. The system reads cross-domain signal combinations that human analysts miss because they are watching one domain at a time.
          </Body>
          <Body>
            EXECUTE means when the signal fires, the response is already staged. One hundred and seventy pre-built prepared responses deploy simultaneously. Not sequentially. Not after alignment. Simultaneously. From trigger to full execution in twelve minutes.
          </Body>
          <Body>
            ADVANCE means it learns. Every activation generates outcome data. Every execution makes the next one smarter. The library compounds with use.
          </Body>
          <Body style={{ fontWeight: 600, color: NAVY }}>
            That is not a feature list. That is what organizational readiness looks like when it is built as infrastructure instead of improvised under pressure.
          </Body>

          {/* V */}
          <RomanDivider num="V" />
          <Body>
            I need to address AI directly because it is impossible to bring a platform like this to market in 2023 without people asking the question.
          </Body>
          <Body style={{ fontWeight: 700, color: NAVY, fontSize: 18 }}>
            AI does not transform organizations. AI exposes them.
          </Body>
          <Body>
            Give a well-coordinated organization more intelligence and it executes faster. Give a poorly-coordinated organization more intelligence and it generates more options it cannot act on. The lag does not shrink. The confusion accelerates. I have sat in rooms where a platform just deployed told leadership exactly what was happening in real time — and the organization still took three days to respond because nobody knew who was supposed to move first. I have watched this happen. The intelligence was not the problem. The infrastructure was the problem.
          </Body>
          <PullQuote>
            "The answer was never more intelligence. It was better infrastructure for acting on what you already know."
          </PullQuote>
          <Body>
            Readiness OS uses AI across five coordination surfaces — not to generate strategy but to compress coordination. Compound Threat Intelligence detects cross-domain patterns before either domain crosses its threshold alone. The Shadow Strategy Simulator runs a dry-run before commitment. The Strategic Recorder converts institutional knowledge directly into executable playbooks. AI doing the work it should be doing — closing the coordination gap, not widening it.
          </Body>

          {/* ── Built vs. Received — unnumbered interstitial ────────── */}
          <div style={{ margin: "56px -32px", background: "#F8F7F4", padding: "56px 56px", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, position: "relative" }}>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
                <div style={{ width: 20, height: 1.5, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>Design Principle</span>
              </div>
              <p style={{ ...CG, fontSize: "clamp(26px,3.2vw,38px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, marginBottom: 32, letterSpacing: "-0.01em" }}>
                Built looks identical to received — until the trigger fires.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.85, color: "#374151", fontWeight: 400, marginBottom: 24 }}>
                Most organizations treat preparation as a document delivery exercise. A brief gets generated. Stakeholders receive it. They are asked to acknowledge it — to sign off that they have reviewed it, understood it, and are ready to execute it. This looks like preparation. It is not the same thing.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.85, color: "#374151", fontWeight: 400, marginBottom: 24 }}>
                The football quarterback was not handed the prepared response and asked to acknowledge it. He was in the room when it was built. He challenged the assumptions. He tested it against the defensive tendencies he had studied. His judgment was in the response before the game started. That is not an administrative distinction. That is the difference between a document someone received and a decision someone constructed.
              </p>
              <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 28, margin: "40px 0" }}>
                <p style={{ ...CG, fontSize: 22, fontWeight: 500, color: NAVY, lineHeight: 1.5, fontStyle: "italic" }}>
                  "When the trigger fires, the question that determines whether the next twelve minutes succeed is not 'did they read this?' It is 'were they in the room when we built it?'"
                </p>
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.85, color: "#374151", fontWeight: 400, marginBottom: 24 }}>
                Three things define the difference. The executive participated in constructing the response — not receiving it. They had the formal right to challenge any assumption in it — not to rubber-stamp a template. And the plan reflects their specific judgment about their specific situation — not a committee average, not a default. These three criteria are the difference between compliance and commitment.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.85, color: "#374151", fontWeight: 400, marginBottom: 0 }}>
                Readiness OS was designed around this distinction from the first line of code. The preparation phase is not brief delivery. It is construction, not delivery. The executive who activates the prepared response at trigger point is activating something they built. That changes what the next twelve minutes feel like. That changes who they are in the room when it matters.
              </p>
            </div>
          </div>

          {/* ── Research Anchor — Dr. Kerry Huang ────────────────────────── */}
          <div style={{ background: "#F0EDE4", border: "1px solid #E8E4DC", borderLeft: `3px solid ${NAVY}`, padding: "32px 36px", margin: "48px 0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 20 }}>External Research Validation</div>
            <p style={{ ...CG, fontSize: "clamp(18px,2.2vw,22px)", fontWeight: 600, color: NAVY, lineHeight: 1.45, marginBottom: 12, fontStyle: "italic" }}>
              "Technology adoption alone has zero statistical relationship with supply chain collaboration improvement. Zero. Not weak. Not marginal. Zero. Technology doesn't build a moat. Capability and governance do."
            </p>
            <div style={{ fontSize: 12, color: MUTED, fontWeight: 500, marginBottom: 20 }}>
              Dr. Kerry Huang — ESI Top 1% Researcher, Forbes Business Council · Study of 408 firms across manufacturing industries
            </div>
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 12 }}>
                This is the most rigorous academic foundation for why Readiness OS exists. What makes the difference is not which organizations deployed the most sophisticated systems — it is which organizations built the decision-making capability before the system arrived. The Siemens Amberg model: operators had real decision rights before the technology was installed. The Lidl model: $580 million and seven years — then they walked away, because the governance was never built.
              </p>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, fontWeight: 600 }}>
                What Readiness OS installs is the preparation infrastructure that builds the organizational capability. That capability compounds. A competitor can buy the platform. They cannot buy the accumulated decision logic embedded in the preparation phase.
              </p>
            </div>
          </div>

          {/* ── Dr. Kerry Huang Public Repost ─────────────────────────────── */}
          <div style={{ background: NAVY, borderLeft: `3px solid ${GOLD}`, padding: "32px 36px", margin: "32px 0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.6)", marginBottom: 20 }}>Reposted Publicly · LinkedIn · April 20, 2026</div>
            <p style={{ ...CG, fontSize: "clamp(17px,2vw,21px)", fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1.75, marginBottom: 16 }}>
              "What four weeks of public intellectual exchange with Martin Brunke surfaced is that AwaCourage — awareness paired with the willingness to act before consensus arrives — and the architecture that makes this capacity possible at scale are two different governance functions. Same mechanism, opposite directions.
            </p>
            <p style={{ ...CG, fontSize: "clamp(17px,2vw,21px)", fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1.75, marginBottom: 16 }}>
              Martin is building the architecture that makes clarity possible before pressure arrives. My research focuses on what determines whether that clarity actually converts into action when the system has not yet confirmed it is safe to move. Neither side replaces the other.
            </p>
            <p style={{ ...CG, fontSize: "clamp(17px,2vw,21px)", fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1.75, marginBottom: 16 }}>
              Architecture creates the conditions where the choice to ignore is no longer invisible. AwaCourage determines whether the person actually moves on what the system has made visible. Both functions have to work, or neither does.
            </p>
            <p style={{ ...CG, fontSize: "clamp(17px,2vw,21px)", fontStyle: "italic", color: GOLD, lineHeight: 1.75, marginBottom: 24, fontWeight: 600 }}>
              The boundary Martin named — between what architecture can supply and what only human capacity can carry — is where the next decade of governance work sits."
            </p>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              Dr. Kerry Huang · Fortune 50 AVP · ESI Top 1% Researcher · Forbes Business Council · Posted to his full professional network
            </div>
          </div>

          {/* Jayashree Venkataraman — Peer Research Exchange */}
          <div style={{
            background: "rgba(201,168,76,0.08)",
            borderLeft: "3px solid rgba(201,168,76,0.4)",
            padding: "24px 28px",
            marginTop: "32px",
            marginBottom: "32px"
          }}>
            <div style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 12, fontWeight: 700 }}>
              April 2026 · Peer Research Exchange
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,1.8vw,20px)", color: "#0A0F2E", fontStyle: "italic", lineHeight: 1.75, margin: "0 0 12px" }}>
              "Preparation and system response start aligning consistently enough that decisions don't just get assigned — they stay held."
            </p>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              — Jayashree Venkataraman, Leadership Systems Advisor
            </div>
          </div>

          {/* VI */}
          <RomanDivider num="VI" />
          <Body>
            Here is what I believe, and why I am willing to put my name on it.
          </Body>
          <Body>
            Every organization that reads this and feels a moment of recognition — <em>'yes, that is exactly what happens here'</em> — is already losing ground to the version of itself that operates differently. That gap is not getting smaller on its own. And every quarter it does not close, a competitor who closes it first is building an advantage that compounds.
          </Body>
          <Body>
            Twelve-minute execution is not a faster version of thirty days. It is a different organizational capability entirely. The team that walks into every strategic event with pre-staged responses and shared coordination infrastructure does not just move faster. It moves without fear. Because it has already answered the question that freezes everyone else: when this happens, what do we do?
          </Body>
          <Body style={{ fontWeight: 700, color: NAVY, fontSize: 18 }}>
            They already know.
          </Body>
          <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 28, margin: "40px 0", maxWidth: 640 }}>
            <p style={{ ...CG, fontSize: 22, fontWeight: 500, color: NAVY, lineHeight: 1.5, fontStyle: "italic" }}>
              "That is the readiness thesis stated at its deepest level. Not 12 minutes. Not 3,600×. Preparation building ownership that holds under pressure."
            </p>
          </div>
          <Body>
            The first time an organization activates a pre-staged prepared response against a real event, something changes. The second time, it changes further. By the tenth time, the anxiety that surrounds most enterprise crises is gone — not because the events are less serious, but because the organization has stopped improvising and started executing. That shift is not incremental. It changes how leadership teams carry themselves. It changes what they are willing to take on. It makes them fearless.
          </Body>
          <Body>
            I spent five years on a sideline watching what it looks like when a team walks into competition already knowing. It is not arrogance. It is not complacency. It is a calm that comes specifically from having done the work before the moment arrived. From having built the infrastructure that makes the moment manageable before it becomes a crisis.
          </Body>
          <PullQuote>
            "The team that prepared walks in fearless."
          </PullQuote>
          <Body>
            That is what Readiness OS is for. Not to make enterprises smarter. Not to make them faster in isolation. To make them the kind of organization that walks into every strategic event having already done the work. Having already built the coordination infrastructure. Having already answered the question.
          </Body>
          <Body style={{ fontWeight: 600, color: NAVY }}>
            What coordination capability do we have? What prepared responses are staged? What signals are we watching? What happens when they fire?
          </Body>
          <Body>
            Most enterprises cannot answer those questions today. They could. That is the gap. That is what we close.
          </Body>

          {/* VII */}
          <RomanDivider num="VII" />
          <Body>
            VaughnMartin exists because of a name. My father's name was Vaughn. The company carries it because this work carries his standard: do it right, do it completely, and do not accept that things have to stay broken simply because they have always been broken.
          </Body>
          <Body>
            Readiness OS is the product built around that name. Not because it is technically impressive — though it is. Not because the market is large — though it is. Because it is the answer to a problem I could not stop seeing, a problem I knew was solvable, and a problem I finally stopped waiting for someone else to solve.
          </Body>
          <Body>
            I have worked inside some of the most sophisticated organizations in American business. I have watched them fail at coordination in ways that would end a football program in a single season. Watched the thirty days happen again and again, carrying the knowledge that forty seconds was enough when the infrastructure was right.
          </Body>
          <Body>
            That knowledge does not transfer through a consulting engagement. It does not get hired in. It requires infrastructure. Built. Staged. Ready to activate.
          </Body>
          <Body style={{ fontWeight: 600, color: NAVY }}>
            That infrastructure exists now. It is live. It is working.
          </Body>

          {/* Closing */}
          <div style={{ textAlign: "center", padding: "48px 0 0" }}>
            <p style={{ ...CG, fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, color: NAVY, letterSpacing: "-0.01em", marginBottom: 48 }}>
              This is it.
            </p>
            <div style={{ width: 48, height: 1, background: GOLD, margin: "0 auto 40px" }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
              We Make Enterprises Fearless.
            </p>
            <p style={{ fontSize: 13, color: MUTED, letterSpacing: "0.06em" }}>
              Martin Brunke · Founder, VaughnMartin · <a href="https://vaughnmartin.com" style={{ color: GOLD, textDecoration: "none" }}>vaughnmartin.com</a>
            </p>
          </div>
        </div>
      </main>

      {/* ── Video + Bio ───────────────────────────────────────────────────── */}
      <section style={{ background: OFF, padding: "80px 32px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Hear It Directly</div>
            <h2 style={{ ...CG, fontSize: 36, fontWeight: 600, color: NAVY }}>The Story in Martin's Own Words</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 64 }}>
            {[
              { label: "90 SECONDS", title: "Quick Intro", desc: "The 30-day problem, the football insight, and why Readiness OS exists.", type: "intro" as const, cta: "Watch Now" },
              { label: "3:30 MINUTES", title: "The Full Story", desc: "The complete narrative: Fortune 500 experience, the IDEA framework, and the vision.", type: "full" as const, cta: "Watch Full Story" },
            ].map(({ label, title, desc, type, cta }) => (
              <div key={type} style={{ background: "#fff", border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <div style={{ background: NAVY, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }} onClick={() => setActiveVideo(type)}>
                  <div style={{ width: 56, height: 56, border: `1px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Play style={{ width: 20, height: 20, color: GOLD }} />
                  </div>
                  <div style={{ position: "absolute", bottom: 14, right: 14, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.15em" }}>{label}</div>
                </div>
                <div style={{ padding: "28px 28px 32px" }}>
                  <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>{desc}</p>
                  <button onClick={() => setActiveVideo(type)} style={{ background: NAVY, color: "#fff", border: "none", padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", width: "100%" }}>
                    {cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bio strip */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start", padding: "40px 0", borderTop: `1px solid ${BORDER}` }}>
            <div style={{ width: 80, height: 80, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD_LIGHT }}>MB</span>
            </div>
            <div>
              <h3 style={{ ...CG, fontSize: 26, fontWeight: 600, color: NAVY, marginBottom: 4 }}>Martin Brunke</h3>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Founder & CEO, VaughnMartin</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Ford", "Lockheed Martin", "Toyota", "Charles Schwab", "Vantiv", "Boyd Gaming", "Churchill Downs"].map(c => (
                  <span key={c} style={{ border: `1px solid ${BORDER}`, padding: "5px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "72px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#fff", lineHeight: 1.3, marginBottom: 32 }}>
            Ready to close the coordination gap?
          </p>
          <Link href="/request-access">
            <button style={{ background: GOLD, color: NAVY, border: "none", padding: "18px 40px", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
              Apply for Founding Partner Access
            </button>
          </Link>
        </div>
      </section>

    </PageLayout>
  );
}
