import { type CSSProperties } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const MUTED   = "#6B7280";
const RED     = "#C0392B";
const GEO: CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const DM: CSSProperties  = { fontFamily: "'Inter', system-ui, sans-serif" };
const MONO: CSSProperties = { fontFamily: "'Courier New', Courier, monospace" };

const GoldRule = () => (
  <div style={{ width: 48, height: 2, background: GOLD, margin: "0 auto 28px" }} />
);

const SectionLabel = ({ children, color = GOLD }: { children: string; color?: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
    <div style={{ width: 28, height: 1, background: color }} />
    <span style={{ ...MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color }}>{children}</span>
    <div style={{ width: 28, height: 1, background: color }} />
  </div>
);

export default function ReadinessInfrastructure() {
  return (
    <PageLayout>
      <div style={{ background: "#fff", ...DM }}>

        {/* ── SECTION 1: HERO ─────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "96px 48px 80px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
            <SectionLabel>Category Definition</SectionLabel>

            <h1 style={{ ...GEO, fontSize: "clamp(44px,6vw,72px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 28 }}>
              Readiness<br />
              <em style={{ color: GOLD }}>Infrastructure</em>
            </h1>

            <p style={{ ...GEO, fontSize: "clamp(18px,2.2vw,24px)", color: "rgba(255,255,255,0.88)", lineHeight: 1.65, maxWidth: 720, margin: "0 auto 48px", fontStyle: "italic" }}>
              The preparation architecture that makes organizations fearless in the face of any strategic trigger.
              Built before the trigger fires. Deployed in 12 minutes when it does.
            </p>

            {/* Preparation → Readiness → Fearless arc */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 0, flexWrap: "wrap", marginBottom: 56 }}>
              {[
                { word: "Preparation", time: "Months before", color: GOLD },
                { word: "→", time: "", color: "rgba(255,255,255,0.25)" },
                { word: "Readiness", time: "The infrastructure", color: TEAL },
                { word: "→", time: "", color: "rgba(255,255,255,0.25)" },
                { word: "Fearless", time: "The outcome", color: "#fff" },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: "center", padding: "0 20px" }}>
                  <div style={{ ...GEO, fontSize: item.word === "→" ? 28 : 22, fontWeight: 700, color: item.color, lineHeight: 1, marginBottom: item.time ? 8 : 0 }}>
                    {item.word}
                  </div>
                  {item.time && (
                    <div style={{ ...MONO, fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      {item.time}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 30 days vs 12 minutes contrast */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ ...GEO, fontSize: 52, fontWeight: 700, color: RED, lineHeight: 1, textDecoration: "line-through", opacity: 0.7 }}>30 days</div>
                <div style={{ ...MONO, fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 6 }}>Old mobilization cycle</div>
              </div>
              <div style={{ ...GEO, fontSize: 36, color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>→</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ ...GEO, fontSize: 52, fontWeight: 700, color: TEAL, lineHeight: 1 }}>12 minutes</div>
                <div style={{ ...MONO, fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 6 }}>With Readiness Infrastructure</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: THE GAP ──────────────────────────────────────────── */}
        <div style={{ background: "#fff", padding: "88px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SectionLabel color={NAVY}>The Gap That Has Always Existed</SectionLabel>
              <h2 style={{ ...GEO, fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 24 }}>
                Enterprises do not have a capability problem.<br />
                <em>They have a readiness problem.</em>
              </h2>
              <p style={{ fontSize: 17, color: "#374151", lineHeight: 1.75, maxWidth: 700, margin: "0 auto" }}>
                The technology is the same across every Fortune 1000 organization. Microsoft Copilot, Teams, Azure, ServiceNow — every enterprise has the tools. What is different is whether the readiness infrastructure was built before the trigger fired.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 56 }}>
              {[
                { stat: "30 days", color: RED, label: "Average Fortune 1000 mobilization cycle", sub: "From trigger detection to first coordinated response" },
                { stat: "12 min", color: TEAL, label: "With Readiness Infrastructure deployed", sub: "From trigger detection to full team executing" },
                { stat: "3,600×", color: GOLD, label: "Execution Head Start", sub: "30 days compressed to 12 minutes — every strategic trigger" },
              ].map((item, i) => (
                <div key={i} style={{ background: NAVY, padding: "40px 28px", textAlign: "center" }}>
                  <div style={{ ...GEO, fontSize: "clamp(36px,4vw,54px)", fontWeight: 700, color: item.color, lineHeight: 1, marginBottom: 14 }}>{item.stat}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{item.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 28, maxWidth: 700, margin: "0 auto" }}>
              <p style={{ ...GEO, fontSize: 20, color: NAVY, lineHeight: 1.65, fontStyle: "italic" }}>
                "Enterprises don't need more AI tools. They need the operating model that lets them use the tools they already have when something real fires — risk, opportunity, or transformation."
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: THE ARCHITECTURE ─────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "88px 48px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SectionLabel>The Architecture</SectionLabel>
              <h2 style={{ ...GEO, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
                Five Layers of Readiness Infrastructure
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto" }}>
                Every layer is built in the preparation phase — before any trigger fires.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
              {[
                {
                  phase: "01",
                  label: "Signal Intelligence",
                  desc: "Continuous monitoring across 221 trigger patterns — news feeds, regulatory dockets, SEC filings, threat intelligence, competitive signals. The system detects before humans notice.",
                },
                {
                  phase: "02",
                  label: "Decision Architecture",
                  desc: "170 Readiness Protocols pre-built across three domains. Every trigger is matched to a response before the trigger fires. No scenario without a protocol.",
                },
                {
                  phase: "03",
                  label: "Response Staging",
                  desc: "Tasks pre-assigned. Stakeholders pre-mapped. Communications pre-drafted. Budget authority pre-approved. The entire response is staged and waiting.",
                },
                {
                  phase: "04",
                  label: "Executive Authorization",
                  desc: "No Readiness Protocol activates without executive sign-off. AI monitors and stages. Executives authorize. The decision remains human — the preparation does not.",
                },
                {
                  phase: "05",
                  label: "Learning Encoding",
                  desc: "Every activation closes with a structured debrief. What held. What failed. What the next protocol needs. The infrastructure learns from every trigger it handles.",
                },
              ].map((item) => (
                <div key={item.phase} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "36px 24px" }}>
                  <div style={{ ...MONO, fontSize: 10, color: GOLD, letterSpacing: "0.25em", marginBottom: 16 }}>{item.phase}</div>
                  <div style={{ ...GEO, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, lineHeight: 1.2 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: CATEGORY POSITIONING ─────────────────────────────── */}
        <div style={{ background: IVORY, padding: "88px 48px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <SectionLabel color={NAVY}>Category Positioning</SectionLabel>
              <h2 style={{ ...GEO, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 16 }}>
                Where Readiness OS Sits in the Market
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 580, margin: "0 auto" }}>
                Three legitimate categories. Three different answers to three different questions.
              </p>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", ...DM }}>
                <thead>
                  <tr>
                    {["", "Signal Intelligence Platforms", "Decision Analytics Tools", "Readiness OS"].map((h, i) => (
                      <th key={i} style={{
                        padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        background: i === 3 ? NAVY : i === 0 ? "transparent" : NAVY_BG,
                        color: i === 3 ? GOLD : i === 0 ? NAVY : "rgba(255,255,255,0.6)",
                        borderBottom: `2px solid ${i === 3 ? GOLD : "rgba(255,255,255,0.1)"}`,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dim: "Question answered", sl: "What deserves attention?", gw: "What decision failed?", ro: "Is the response already staged?" },
                    { dim: "Timing", sl: "Real-time signal routing", gw: "Post-decision analysis", ro: "Preparation phase — before the trigger" },
                    { dim: "Buyer", sl: "Chief Information Officer", gw: "Chief Strategy Officer", ro: "CEO, CSO, CRO, Board" },
                    { dim: "Output", sl: "Prioritized attention feed", gw: "Decision quality diagnosis", ro: "Pre-staged response — executes in 12 minutes" },
                    { dim: "What it does not do", sl: "Stage or execute responses", gw: "Stage or execute responses", ro: "Replace executive decision authority" },
                  ].map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : IVORY }}>
                      <td style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: NAVY, borderRight: "1px solid #E5E7EB" }}>{row.dim}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{row.sl}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{row.gw}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: NAVY, background: "rgba(201,168,76,0.06)", borderLeft: `2px solid ${GOLD}` }}>{row.ro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: NAVY, padding: "32px 40px", marginTop: 2, textAlign: "center" }}>
              <p style={{ ...GEO, fontSize: 18, color: "#fff", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                Signal Intelligence Platforms route the signal.{" "}
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Decision Analytics Tools diagnose what failed.</span>{" "}
                <span style={{ color: GOLD }}>Readiness OS had the response staged before the signal arrived.</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 5: WHY THIS CATEGORY NOW ────────────────────────────── */}
        <div style={{ background: "#fff", padding: "88px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SectionLabel color={NAVY}>Why This Category Now</SectionLabel>
              <h2 style={{ ...GEO, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 24 }}>
                AI changed the constraint.<br />
                <em style={{ color: GOLD }}>Not enough organizations have changed the model.</em>
              </h2>
              <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.75, maxWidth: 700, margin: "0 auto" }}>
                Committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI removed that constraint. But every vendor bolted AI onto the old model — faster summaries, smarter notes from the same slow meetings. Readiness Infrastructure rebuilds from first principles. The preparation replaces the mobilization cycle. The response is staged before the trigger fires.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[
                {
                  domain: "RISK & RESILIENCE",
                  color: RED,
                  triggers: [
                    "Ransomware — 3 AM detection",
                    "Activist investor discloses stake",
                    "Supply chain force majeure",
                    "DOJ Civil Investigative Demand",
                    "Brand crisis — viral incident",
                    "Regulatory inquiry opened",
                  ],
                },
                {
                  domain: "GROWTH & POSITIONING",
                  color: TEAL,
                  triggers: [
                    "Competitor product launch",
                    "Market entry window opens",
                    "Regulatory change — new segment",
                    "M&A opportunity surfaces",
                    "Strategic partnership window",
                    "Category leadership moment",
                  ],
                },
                {
                  domain: "TRANSFORMATION",
                  color: GOLD,
                  triggers: [
                    "CTO + VP talent exodus",
                    "Organizational restructuring",
                    "M&A Day 1 integration",
                    "Culture inflection point",
                    "Board leadership change",
                    "Strategic pivot required",
                  ],
                },
              ].map((col) => (
                <div key={col.domain} style={{ border: `1px solid #E5E7EB`, borderTop: `3px solid ${col.color}`, padding: "28px 24px" }}>
                  <div style={{ ...MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: col.color, marginBottom: 20 }}>{col.domain}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {col.triggers.map((t, i) => (
                      <li key={i} style={{ fontSize: 13, color: "#374151", paddingBottom: 10, borderBottom: "1px solid #F3F4F6", marginBottom: 10, lineHeight: 1.4 }}>
                        <span style={{ color: col.color, marginRight: 8, fontSize: 10 }}>◆</span>{t}
                      </li>
                    ))}
                  </ul>
                  <div style={{ ...MONO, fontSize: 10, color: MUTED, marginTop: 8, letterSpacing: "0.1em" }}>Pre-staged response ready</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 6: HOW READINESS OS BUILDS IT ───────────────────────── */}
        <div style={{ background: NAVY, padding: "88px 48px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SectionLabel>How Readiness OS Builds It</SectionLabel>
              <h2 style={{ ...GEO, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
                The IDEA Framework
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto" }}>
                Four phases. Every phase built in sequence. The response is ready before the trigger fires.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 40 }}>
              {[
                {
                  phase: "I — IDENTIFY",
                  color: GOLD,
                  headline: "Define what your organization is watching for",
                  body: "Map your organization's specific trigger universe — the situations you expect to encounter and the situations you have already encountered. Every Readiness Protocol starts here.",
                },
                {
                  phase: "D — DETECT",
                  color: TEAL,
                  headline: "Continuous monitoring across 221 trigger patterns",
                  body: "Real-time signal ingestion from news, regulatory dockets, SEC filings, threat intelligence, and competitive feeds. System-detected, not human-monitored. The signal arrives before the call does.",
                },
                {
                  phase: "E — EXECUTE",
                  color: "#fff",
                  headline: "Pre-staged response deploys in 12 minutes",
                  body: "Tasks assigned. Stakeholders notified. Budget authorized. Execution brief staged. One executive authorization — and the entire protocol activates across the leadership team simultaneously.",
                },
                {
                  phase: "A — ADVANCE",
                  color: GOLD,
                  headline: "Every activation makes the next one stronger",
                  body: "Structured close-out debrief. What held, what failed, what the next protocol needs. The infrastructure encodes the learning. Readiness compounds with every activation.",
                },
              ].map((item) => (
                <div key={item.phase} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "36px 24px" }}>
                  <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color: item.color, letterSpacing: "0.2em", marginBottom: 16 }}>{item.phase}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 12, lineHeight: 1.35 }}>{item.headline}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{item.body}</div>
                </div>
              ))}
            </div>

            {/* Platform metrics strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
              {[
                { n: "170", label: "Readiness Protocols" },
                { n: "221", label: "Monitored Triggers" },
                { n: "12 min", label: "Execution Time" },
                { n: "3,600×", label: "Execution Head Start" },
                { n: "3", label: "Strategic Domains" },
                { n: "6", label: "Industry Protocol Packs" },
              ].map((m) => (
                <div key={m.n} style={{ textAlign: "center", padding: "20px 8px" }}>
                  <div style={{ ...GEO, fontSize: 26, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>{m.n}</div>
                  <div style={{ ...MONO, fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 7: RESEARCH FOUNDATION ──────────────────────────────── */}
        <div style={{ background: IVORY, padding: "88px 48px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SectionLabel color={NAVY}>Research Foundation</SectionLabel>
              <h2 style={{ ...GEO, fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
                The Intellectual Validation Behind the Category
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 560, margin: "0 auto" }}>
                Readiness Infrastructure is not a product claim. It is a structural response to decades of research on why organizations fail to act when the moment demands it.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                {
                  quote: "Architecture creates the conditions where the choice to ignore is no longer invisible. The organization that has built readiness infrastructure cannot pretend the trigger did not fire — the response is already staged, the stakeholders are already mapped, the decision authority is already assigned. Readiness makes inaction visible.",
                  name: "Dr. Kerry Huang",
                  title: "Organizational Readiness Architecture — Institutional Decision Systems",
                },
                {
                  quote: "The 30-day mobilization gap is not a failure of intelligence or intent. It is a structural consequence of organizations that were designed to deliberate, not to execute. The gap closes only when the deliberation is moved to the preparation phase — before the trigger, not after it.",
                  name: "Jayashree Venkataraman",
                  title: "Strategic Trigger Response — Enterprise Coordination Research",
                },
                {
                  quote: "McKinsey analysis of Fortune 1000 crisis responses consistently identifies the same failure mode: not the response itself, but the 72–168 hours spent mobilizing before the response could begin. The organizations that close this gap share a single structural characteristic — they had already decided what to do.",
                  name: "McKinsey & Company",
                  title: "Organizational Resilience Practice — Fortune 1000 Response Analysis",
                },
              ].map((item, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 32, paddingTop: 4, paddingBottom: 4 }}>
                  <p style={{ ...GEO, fontSize: 18, color: NAVY, lineHeight: 1.7, fontStyle: "italic", marginBottom: 14 }}>
                    "{item.quote}"
                  </p>
                  <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.05em" }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 8: CTA ───────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "88px 48px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <GoldRule />
            <h2 style={{ ...GEO, fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
              The response is ready<br />
              <em style={{ color: GOLD }}>before the trigger fires.</em>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 48, maxWidth: 540, margin: "0 auto 48px" }}>
              Readiness Infrastructure is not a product you buy. It is a capability you build — before the ransomware, before the competitor launch, before the activist stake, before the market window closes. The Founding Partner Program is how we build it with you.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <Link href="/founding-partner-program">
                <button style={{
                  background: GOLD, color: NAVY, border: "none", padding: "16px 36px",
                  fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: "pointer", borderRadius: "0.15rem",
                }}>
                  Apply for Founding Partner Access
                </button>
              </Link>
              <Link href="/how-it-executes">
                <button style={{
                  background: "transparent", color: "#fff", border: `1px solid rgba(255,255,255,0.3)`,
                  padding: "16px 36px", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer", borderRadius: "0.15rem",
                }}>
                  See the 12-Minute Execution
                </button>
              </Link>
            </div>

            <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ ...MONO, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                The Category
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                Readiness Infrastructure · VaughnMartin Readiness OS · 170 Protocols · 221 Triggers · 3 Domains · 12 Minutes
              </p>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
