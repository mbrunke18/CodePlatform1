import { useEffect, useState } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { updatePageMetadata } from "@/lib/seo";
import { ArrowRight, CheckCircle2, Clock, Shield, Users, BookOpen, TrendingUp, Zap, Globe, Mail, Phone, Link2, Send } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const comparisonRows = [
  {
    category: "Trigger Detection",
    traditional: "Manual monitoring — someone notices, escalates by email",
    executionOS: "Automatic — continuous signal monitoring across 248+ data points",
  },
  {
    category: "Time to Mobilization",
    traditional: "30 days to align stakeholders, agree on approach, assign roles",
    executionOS: "12 minutes after trigger detection — full coordination live",
  },
  {
    category: "Readiness Protocol Readiness",
    traditional: "Built in real time during the crisis under pressure",
    executionOS: "Pre-staged — 170 Readiness Protocols ready before the trigger fires",
  },
  {
    category: "Stakeholder Coordination",
    traditional: "Email chains, emergency calls, duplicate status meetings",
    executionOS: "Automated at trigger point — every role assigned simultaneously",
  },
  {
    category: "Decision Authority",
    traditional: "Consensus-driven — committees slow every decision",
    executionOS: "Human executives retain all authority — AI handles orchestration",
  },
  {
    category: "Learning & Improvement",
    traditional: "Post-mortems that rarely change behavior",
    executionOS: "Automated debrief after every activation — Readiness Protocols improve continuously",
  },
];

const proofNumbers = [
  { value: "170", label: "Pre-staged Readiness Protocols across 9 strategic domains" },
  { value: "221", label: "Trigger configurations monitoring for strategic events" },
  { value: "248+", label: "Enterprise data points monitored continuously" },
  { value: "12 min", label: "Trigger to full organizational coordination" },
  { value: "3,600×", label: "Execution head start vs. traditional mobilization" },
  { value: "30 days", label: "Conservative baseline for traditional enterprise mobilization" },
];

const pilotIncludes = [
  "Full Readiness OS platform access for up to 25 users",
  "5 customizable Readiness Protocols from the 170 library",
  "Live signal monitoring across 3 intelligence categories",
  "Microsoft Teams + Jira/Asana integration",
  "Dedicated Customer Success Manager",
  "3 facilitated tabletop exercises",
  "Executive readout with documented ROI at Day 90",
  "100% pilot investment credits to enterprise contract",
];

const roiCase = [
  { metric: "Executive time saved per event", value: "$10K–$25K", basis: "20–50 hrs × $500/hr executive rate" },
  { metric: "Revenue protected per major event", value: "$500K–$2M", basis: "Faster response reduces revenue loss window" },
  { metric: "C-suite recovery per event", value: "$45K+", basis: "45 hrs × $1,000/hr executive time" },
  { metric: "Annual tool consolidation", value: "$50K–$100K", basis: "Reduced point solution licensing" },
];

export default function ExecutiveBrief() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    updatePageMetadata({
      title: "Executive Brief — Readiness OS by VaughnMartin",
      description: "A shareable executive summary of the Readiness OS thesis, proof numbers, ROI case, and Founding Partner Program. Built for Fortune 1000 board-level conversations.",
      ogTitle: "Executive Brief — VaughnMartin Readiness OS",
      ogDescription: "30 days compressed to 12 minutes. 3,600× execution head start. The strategic readiness platform built for large enterprises.",
    });
  }, []);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleForwardToBoard() {
    const url = window.location.href;
    const subject = encodeURIComponent("Strategic Briefing: VaughnMartin Readiness OS — 3,600× Execution Head Start");
    const body = encodeURIComponent(
      `Hi,\n\nSharing this for board consideration.\n\nVaughnMartin's Readiness OS compresses the 30-day enterprise mobilization cycle to 12 minutes — a 3,600× execution head start over traditional operating models.\n\nThe full executive brief is here: ${url}\n\nKey headline: 170 pre-staged Readiness Protocols, continuous signal monitoring across 248+ signals, and full war-room coordination in under 12 minutes after a trigger fires.\n\nHappy to discuss at your convenience.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <PageLayout>
      <div style={{ background: "#F8F7F4" }}>

        {/* Print-friendly header */}
        <section style={{ background: NAVY, padding: "56px 48px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap", marginBottom: 40 }}>
              <VaughnMartinLogo color="light" height={44} variant="full" />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Executive Brief</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.68)" }}>Confidential — For Internal Circulation</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.68)" }}>vaughnmartin.com</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Strategic Readiness Platform · Fortune 1000</span>
            </div>

            <h1 style={{ ...CG, fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 16 }}>
              We Redesign How Work Flows<br />
              <em style={{ color: GOLD }}>in the Age of AI.</em>
            </h1>

            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 640, lineHeight: 1.75, marginBottom: 32 }}>
              Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint. VaughnMartin rebuilds from first principles.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/request-access">
                <Button style={{ background: GOLD, color: NAVY, fontWeight: 700 }} size="lg">
                  Schedule a Conversation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/try-demo">
                <Button variant="outline" size="lg" style={{ borderColor: "rgba(255,255,255,0.25)", color: "#fff", background: "transparent" }}>
                  Watch the 12-Minute Demo
                </Button>
              </Link>
              <Button
                onClick={handleForwardToBoard}
                variant="outline"
                size="lg"
                style={{ borderColor: "rgba(201,168,76,0.45)", color: GOLD, background: "rgba(201,168,76,0.08)" }}
              >
                <Send className="w-4 h-4 mr-2" /> Forward to Board
              </Button>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="lg"
                style={{ borderColor: "rgba(255,255,255,0.15)", color: copied ? TEAL : "rgba(255,255,255,0.55)", background: "transparent", transition: "color 0.2s" }}
              >
                <Link2 className="w-4 h-4 mr-2" />
                {copied ? "Link Copied" : "Copy Link"}
              </Button>
            </div>
          </div>
        </section>

        {/* The Core Thesis */}
        <section style={{ background: "#fff", padding: "56px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 24, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>The Thesis</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: NAVY, lineHeight: 1.6, marginBottom: 16 }}>
                  Thirty days is not a performance problem. It is an architecture problem.
                </p>
                <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.8, marginBottom: 16 }}>
                  The executive layer still owned authority by org chart. The systems owned authority by workflow. The decision rights migrated one approval threshold at a time until what was true on paper no longer matched what was true in practice.
                </p>
                <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.8, marginBottom: 20 }}>
                  AI is accelerating this pattern. The fix is putting executive authorization back into the architecture as a required threshold the system cannot cross without it.
                </p>
                <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 16 }}>
                  Every AI vendor bolted intelligence onto the old model.
                </h2>
                <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8 }}>
                  Faster spreadsheets. Smarter summaries. Better notes from the same slow meetings. The 30-day mobilization cycle — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — remained completely untouched.
                </p>
                <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginTop: 12 }}>
                  Readiness OS doesn't bolt intelligence onto that model. It replaces it. Pre-staged Readiness Protocols replace real-time coordination. Pattern detection replaces committee deliberation. 12-minute execution replaces 30-day alignment cycles.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Pre-staged Readiness Protocols", detail: "Replace real-time coordination", icon: BookOpen },
                  { label: "Pattern detection", detail: "Replaces committee deliberation", icon: Globe },
                  { label: "12-minute execution", detail: "Replaces 30-day alignment cycles", icon: Clock },
                  { label: "AI monitors, executives authorize", detail: "AI orchestrates. Humans decide.", icon: Users },
                ].map(({ label, detail, icon: Icon }) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon style={{ width: 16, height: 16, color: GOLD }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Proof Numbers */}
        <section style={{ background: "#F8F7F4", padding: "56px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <div style={{ width: 24, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Platform at a Glance</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {proofNumbers.map(({ value, label }) => (
                <div key={value} style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px 20px" }}>
                  <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: GOLD, marginBottom: 6 }}>{value}</div>
                  <div style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The 3,600× Metric */}
        <section style={{ background: NAVY, padding: "56px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 800px 600px at 70% 50%, rgba(201,168,76,0.08), transparent)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>The 3,600× Execution Head Start</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
              <div>
                <h2 style={{ ...CG, fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
                  30 days compressed<br />to <em style={{ color: GOLD }}>12 minutes.</em>
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 20 }}>
                  This is not a timing improvement. It is a structural change in how enterprises mobilize. In a Fortune 1000, when a strategic trigger fires, the organization spends weeks just to mobilize — figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders — before execution even begins. Readiness OS compresses that entire cycle to 12 minutes.
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: "italic", color: GOLD, lineHeight: 1.55, borderLeft: `3px solid ${GOLD}`, paddingLeft: 16, margin: 0 }}>
                  "The twelve minutes is not about speed. It is about clarity built ahead of time."
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Traditional enterprise mobilization", value: "30 days", color: "#EF4444", sub: "Conservative baseline — before any execution begins" },
                  { label: "Readiness OS trigger to coordination", value: "12 min", color: TEAL, sub: "Full stakeholder cascade, tasks assigned, roles live" },
                  { label: "Execution head start", value: "3,600×", color: GOLD, sub: "Not faster — a different category of response" },
                ].map(({ label, value, color, sub }) => (
                  <div key={label} style={{ border: "1px solid rgba(255,255,255,0.1)", padding: "16px 20px", background: "rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>{label}</div>
                    <div style={{ ...CG, fontSize: 28, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", fontStyle: "italic" }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section style={{ background: "#fff", padding: "56px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <div style={{ width: 24, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Side-by-Side Comparison</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #E8E4DC" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, width: "25%" }}>Category</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", width: "37.5%" }}>Traditional Enterprise Model</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: NAVY, width: "37.5%" }}>Readiness OS</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(({ category, traditional, executionOS }, i) => (
                    <tr key={category} style={{ borderBottom: "1px solid #E8E4DC", background: i % 2 === 0 ? "#fff" : "#F8F7F4" }}>
                      <td style={{ padding: "14px 16px", fontSize: 12, fontWeight: 700, color: NAVY }}>{category}</td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{traditional}</td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: NAVY, fontWeight: 600, lineHeight: 1.6 }}>{executionOS}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ROI Case */}
        <section style={{ background: "#F8F7F4", padding: "56px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <div style={{ width: 24, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>The ROI Case</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {roiCase.map(({ metric, value, basis }) => (
                <div key={metric} style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px 20px" }}>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>{metric}</div>
                  <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: TEAL, marginBottom: 6 }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>{basis}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "16px 20px", border: "1px solid #E8E4DC", background: "#fff" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Program Investment Payback Window</div>
              <div style={{ fontSize: 13, color: "#4B5563" }}>
                At 2–3 strategic activations per quarter, the typical Fortune 1000 organization recovers its $75K program investment within the first activation cycle. Enterprise agreement pricing available upon program completion.
              </div>
            </div>
          </div>
        </section>

        {/* Validated Outcomes — Before & After */}
        <section style={{ background: "#fff", padding: "56px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 24, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Validated Outcomes</span>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
              Before and after Readiness OS — in the decisions that matter most
            </h3>
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24, lineHeight: 1.7 }}>
              These are not projected outcomes. They are the difference between the mobilization cycle that existed before and the execution arc that Readiness OS produces.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
              {[
                {
                  domain: "RISK & RESILIENCE",
                  trigger: "Ransomware — Regional Bank",
                  before: "18 days to full containment. $4.2M in unplanned outside counsel and forensic consulting fees. Board briefed at Day 14.",
                  after: "Containment decision reached in 11 minutes. FBI and cyber insurer engaged in the same executive session. Board briefed the same hour.",
                  outcome: "$4.2M consulting avoided",
                  color: TEAL,
                },
                {
                  domain: "GROWTH & POSITIONING",
                  trigger: "Activist Investor — Industrial Manufacturer",
                  before: "23 days to align board, retain defense advisors, and deliver first institutional narrative. Activist held first investor call unchallenged.",
                  after: "Defense counsel retained, board convened, and institutional counter-narrative deployed — all within 12 minutes of the 13D filing.",
                  outcome: "23-day mobilization → 12 minutes",
                  color: GOLD,
                },
                {
                  domain: "TRANSFORMATION",
                  trigger: "Supply Chain Collapse — Consumer Goods",
                  before: "31 days to identify qualified alternates and issue emergency POs. Three customer shipments missed. $9.2M revenue at risk.",
                  after: "4 pre-qualified backup suppliers contacted simultaneously. Emergency POs issued before any customer shipments were at risk.",
                  outcome: "$9.2M revenue protected",
                  color: TEAL,
                },
              ].map(p => (
                <div key={p.domain} style={{ padding: "20px 22px", borderTop: `3px solid ${p.color}`, border: "1px solid #E8E4DC", borderTopWidth: 3 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: p.color, marginBottom: 6 }}>{p.domain}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 14, lineHeight: 1.4 }}>{p.trigger}</div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C0392B", marginBottom: 4 }}>Before</div>
                    <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.65, margin: 0 }}>{p.before}</p>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: p.color, marginBottom: 4 }}>With Readiness OS</div>
                    <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.65, margin: 0 }}>{p.after}</p>
                  </div>
                  <div style={{ padding: "5px 10px", background: p.color === TEAL ? "rgba(43,138,110,0.08)" : "rgba(201,168,76,0.08)", border: `1px solid ${p.color}40`, display: "inline-block" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: p.color, letterSpacing: "0.06em" }}>{p.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Microsoft Framing */}
        <section style={{ background: "#fff", padding: "56px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Enterprise Stack Positioning</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
              <div>
                <h3 style={{ ...CG, fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 12 }}>
                  "Every enterprise has Microsoft's AI stack. None have the operating model to use it."
                </h3>
                <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.8 }}>
                  Readiness OS is not a replacement for Copilot, Azure OpenAI, or Teams. It is the operating model layer that sits above your existing Microsoft investment. Your AI tools detect and summarize. Readiness OS deploys your people — the coordination infrastructure that makes detection actionable.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { layer: "Readiness OS", role: "Operating model — coordinates humans at trigger speed", yours: false },
                  { layer: "Microsoft Copilot", role: "AI assistance — summaries, drafts, search", yours: true },
                  { layer: "Azure OpenAI", role: "Foundation model infrastructure", yours: true },
                  { layer: "Microsoft Teams", role: "Communication and collaboration", yours: true },
                ].map(({ layer, role, yours }) => (
                  <div key={layer} style={{ border: `1px solid ${yours ? "#E8E4DC" : GOLD}`, padding: "12px 16px", background: yours ? "#F8F7F4" : "rgba(201,168,76,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{layer}</span>
                      {!yours && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>Readiness OS</span>}
                      {yours && <span style={{ fontSize: 10, color: "#9CA3AF" }}>Already invested</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pilot Program */}
        <section style={{ background: "#F8F7F4", padding: "56px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Founding Partner Program</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
              <div>
                <h3 style={{ ...CG, fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 12 }}>
                  90-Day Validation Partnership.<br />$75,000 flat. 100% credits to enterprise contract.
                </h3>
                <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.8, marginBottom: 20 }}>
                  A structured 90-day engagement to prove Readiness OS' 12-minute coordination claim with live activations in your environment. Measurable outcomes. Clear conversion path.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {["Phase 0 (Wks 1–2): Readiness & setup", "Phase 1 (Wks 3–6): Dry runs & training", "Phase 2 (Wks 7–10): Live activation", "Phase 3 (Wks 11–12): Executive readout & expansion plan"].map(phase => (
                    <div key={phase} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13, color: "#4B5563" }}>{phase}</span>
                    </div>
                  ))}
                </div>
                <Link href="/founding-partner-program">
                  <Button style={{ background: NAVY, color: "#fff", fontWeight: 700 }}>
                    View Founding Partner Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>What's Included</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {pilotIncludes.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <CheckCircle2 style={{ width: 13, height: 13, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 12, color: "#374151" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Next Steps */}
        <section style={{ background: NAVY, padding: "56px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 24, height: 1.5, background: GOLD }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Schedule a Conversation</span>
                </div>
                <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
                  Ready to see it in your environment?
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 24 }}>
                  A 45-minute executive briefing walks your team through a live industry-specific scenario, answers the "why not existing tools" questions directly, and outlines a clear pilot engagement path.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Mail style={{ width: 14, height: 14, color: GOLD }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>pilot@vaughnmartin.com</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Globe style={{ width: 14, height: 14, color: GOLD }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>vaughnmartin.com</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/request-access">
                    <Button style={{ background: GOLD, color: NAVY, fontWeight: 700 }} size="lg">
                      Schedule a Conversation <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/try-demo">
                    <Button variant="outline" size="lg" style={{ borderColor: "rgba(255,255,255,0.25)", color: "#fff", background: "transparent" }}>
                      Watch 12-Minute Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div>
                <div style={{ border: "1px solid rgba(255,255,255,0.1)", padding: "28px", background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Ideal Founding Partner Candidates</div>
                  {[
                    "Fortune 1000 or equivalent ($1B+ revenue)",
                    "C-level or SVP executive sponsor with budget authority",
                    "Active Jira, Asana, or Monday.com deployment",
                    "Strategic events requiring 4+ departments to coordinate",
                    "Recent slow response pain in the last 12 months",
                  ].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: 0, background: GOLD, flexShrink: 0, marginTop: 6 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{item}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 11, color: "rgba(255,255,255,0.68)", fontStyle: "italic" }}>
                    Limited to 5 design partners per cohort. Priority given to organizations with recent strategic event pain.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer mark */}
        <section style={{ background: "#F8F7F4", padding: "20px 48px", borderTop: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <VaughnMartinLogo color="dark" height={28} variant="full" />
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>
              © VaughnMartin · Confidential — For Internal Circulation Only · vaughnmartin.com
            </div>
            <Link href="/request-access">
              <span style={{ fontSize: 12, color: GOLD, fontWeight: 600, cursor: "pointer" }}>Schedule a Conversation →</span>
            </Link>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
