import PageLayout from "@/components/layout/PageLayout";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { Link } from "wouter";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const DM = { fontFamily: "'Barlow', system-ui, sans-serif" };
const BC = { fontFamily: "'Barlow Condensed', 'Barlow', system-ui, sans-serif" };

const partnerModels = [
  {
    type: "Systems Integrator",
    examples: "Deloitte · PwC · KPMG · Accenture",
    fit: "Your clients are our buyers. You implement. We provide the platform and protocol library.",
    economics: "Revenue share on annual licenses. Implementation services owned entirely by the partner.",
    engagement: "Co-sell with your existing enterprise relationships. Readiness OS becomes the platform anchor for your operating model practice.",
    color: GOLD,
  },
  {
    type: "Microsoft Channel Partner",
    examples: "Microsoft CSP · GSI partners · Teams ISVs",
    fit: "Every enterprise has Microsoft's AI stack. None have the operating model to use it. Readiness OS is that layer.",
    economics: "Marketplace listing on Azure. Microsoft co-sell eligible. Integrates natively with Teams, Copilot Studio, Entra, SharePoint.",
    engagement: "Readiness OS extends the Microsoft investment rather than competing with it. Joint go-to-market to shared enterprise accounts.",
    color: TEAL,
  },
  {
    type: "Management Consulting Firm",
    examples: "McKinsey · BCG · Bain · Oliver Wyman",
    fit: "You identify the operating model gap. Readiness OS is the infrastructure that closes it — and makes your recommendations stick.",
    economics: "Licensing referral. The platform produces the measurable evidence your clients need to justify the engagement.",
    engagement: "Position Readiness OS as the coordination infrastructure that operationalizes your strategic recommendations.",
    color: NAVY,
  },
];

const integrations = [
  "Microsoft Teams", "Microsoft Copilot Studio", "Microsoft Entra", "SharePoint",
  "Salesforce", "ServiceNow", "Jira", "Slack", "SAP", "Workday",
];

export default function PartnerBrief() {
  return (
    <PageLayout>
      <div style={{ background: "#fff", minHeight: "100vh" }}>

        {/* Print-optimized header */}
        <div style={{ background: NAVY, padding: "48px 56px 44px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
              <VaughnMartinLogo size="sm" color="light" />
              <div style={{ textAlign: "right" as const }}>
                <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, marginBottom: 4 }}>Channel Partner Brief</div>
                <div style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>vaughnmartin.com · Confidential</div>
              </div>
            </div>
            <div style={{ width: 48, height: 2, background: GOLD, marginBottom: 20 }} />
            <h1 style={{ ...CG, fontSize: "clamp(32px,4vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 16 }}>
              The operating model layer<br /><em style={{ color: GOLD }}>above the Microsoft investment.</em>
            </h1>
            <p style={{ ...DM, fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 640, lineHeight: 1.75 }}>
              Every enterprise has Microsoft's AI stack. None have the coordination infrastructure to act on it decisively. Readiness OS is the operating model that closes that gap — and the channel opportunity that comes with it.
            </p>
            <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: 'rgba(43,138,110,0.12)', borderLeft: '3px solid #2B8A6E', maxWidth: 580 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: 0 }}>
                <strong style={{ color: '#2B8A6E' }}>Independently validated:</strong> Microsoft published its own enterprise AI readiness assessment framework
                (<code style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', padding: '1px 5px' }}>microsoft/m365-copilot-automated-readiness-assessment</code>)
                — then launched Frontier Company, a $2.5B operating business built to close "the gap between technical possibility and measurable value."
                The technology is deployed across your customers. The operating model to use it isn't. That is the conversation Readiness OS already productized.
              </p>
            </div>
          </div>
        </div>

        {/* The Problem */}
        <div style={{ padding: "56px 56px 52px", borderBottom: `1px solid ${IVORY}` }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 24, height: 2, background: GOLD }} />
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>The Problem Worth Solving</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
              <div>
                <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
                  Enterprise work was designed for a world without AI.
                </h2>
                <p style={{ ...DM, fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                  Committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint. But every vendor bolted AI onto the old model — faster spreadsheets, smarter summaries, better notes from the same slow meetings.
                </p>
                <p style={{ ...DM, fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
                  The result: 81% of executives say their organization's decision-making speed is inadequate for the environment they operate in. The bottleneck isn't intelligence anymore — it's coordination infrastructure.
                </p>
              </div>
              <div style={{ display: "grid", gap: 3 }}>
                {[
                  { label: "30 days", sub: "Average mobilization lag when a strategic trigger fires", color: "#DC2626" },
                  { label: "12 minutes", sub: "Readiness OS execution time with pre-staged protocols", color: TEAL },
                  { label: "3,600×", sub: "Execution Head Start — 30 days compressed to 12 minutes", color: GOLD },
                  { label: "81%", sub: "Executives who say decision-making speed is inadequate (McKinsey 2026)", color: NAVY },
                ].map(s => (
                  <div key={s.label} style={{ padding: "16px 20px", background: IVORY, borderLeft: `3px solid ${s.color}` }}>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.label}</div>
                    <div style={{ ...DM, fontSize: 11, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* When Prospects Make the Comparison */}
        <div style={{ padding: "56px 56px 52px", background: IVORY, borderBottom: `1px solid ${IVORY}` }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <div style={{ width: 24, height: 2, background: GOLD }} />
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Conversation Guide</span>
            </div>
            <h2 style={{ ...CG, fontSize: "clamp(22px,2.8vw,34px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 8 }}>
              When prospects make a familiar comparison
            </h2>
            <p style={{ ...DM, fontSize: 14, color: "#4B5563", lineHeight: 1.75, maxWidth: 680, marginBottom: 36 }}>
              Two comparisons come up consistently in early conversations. Both are architecturally correct — and both are conversation openers, not objections. Here is the reframe for each.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              {[
                {
                  trigger: '"It sounds like a runbook."',
                  signal: "They understand pre-staging",
                  response: "Exactly right. A runbook is a pre-staged procedure triggered by a detected event — and that is the architecture. IT teams have proven this model works for decades. DevOps handles incidents in minutes because the response is written before the problem arrives.",
                  pivot: "Readiness OS is the strategic runbook for the entire enterprise — not one team, not one category of incident. 231 situations, every domain, executive-authorized. Same discipline. Whole organization.",
                },
                {
                  trigger: '"It\'s like disaster recovery but with project management."',
                  signal: "They understand preparation discipline",
                  response: "That's the thesis exactly. Every company that navigates catastrophic events well prepared before the event — pre-staged protocols, tested responses, authorized execution chains. Disaster recovery proved that preparation beats reaction every time.",
                  pivot: "DR planning covers two or three categories of risk. Readiness OS applies that same discipline across all 231 strategic situations — M&A, competitive threats, regulatory deadlines, workforce transformation. Not just disasters. Every situation the organization will ever face.",
                },
              ].map(({ trigger, signal, response, pivot }) => (
                <div key={trigger} style={{ background: "#fff", border: `1px solid ${IVORY}`, borderTop: `3px solid ${GOLD}`, padding: "28px 24px" }}>
                  <div style={{ ...CG, fontSize: 16, fontWeight: 700, color: NAVY, fontStyle: "italic", marginBottom: 10, lineHeight: 1.35 }}>{trigger}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, padding: "3px 8px", background: "rgba(43,138,110,0.08)", border: "1px solid rgba(43,138,110,0.2)" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL }}>{signal}</span>
                  </div>
                  <p style={{ ...DM, fontSize: 12, color: "#374151", lineHeight: 1.7, marginBottom: 12 }}>{response}</p>
                  <div style={{ borderTop: `1px solid ${IVORY}`, paddingTop: 12 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>The pivot</div>
                    <p style={{ ...DM, fontSize: 12, color: "#374151", lineHeight: 1.7, margin: 0, fontWeight: 600 }}>{pivot}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "14px 20px", background: NAVY, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, width: 2, height: 36, background: GOLD, marginTop: 2 }} />
              <p style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: "#fff" }}>The pattern to remember:</strong> When a prospect makes either comparison, they have already understood the architecture. The only thing left is scope. Every conversation that starts with "it sounds like..." is a prospect who is ready to hear the full story.
              </p>
            </div>
          </div>
        </div>

        {/* What Readiness OS Does */}
        <div style={{ padding: "56px 56px 52px", background: NAVY, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 24, height: 2, background: GOLD }} />
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>The Platform</span>
            </div>
            <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.2 }}>
              Pre-staged execution. Human authority. 12 minutes.
            </h2>
            <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 640, lineHeight: 1.75, marginBottom: 40 }}>
              Readiness OS coordinates the cross-functional response the moment a strategic situation presents itself — before the stakeholder chaos starts. The system monitors. Executives authorize. Execution is pre-staged.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
              {[
                { label: "180 Readiness Protocols", sub: "Pre-built cross-functional response playbooks covering every major strategic detection threshold category", icon: "◎" },
                { label: "231 Detection Thresholds", sub: "Continuously monitored signals across regulatory, competitive, financial, operational, and cyber domains", icon: "⚡" },
                { label: "12-Minute Execution", sub: "From trigger detection to full stakeholder coordination, budget authorization, and board briefing", icon: "★" },
              ].map(f => (
                <div key={f.label} style={{ background: "rgba(255,255,255,0.04)", padding: "28px 24px", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 20, color: GOLD, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ ...BC, fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.05em", marginBottom: 8 }}>{f.label}</div>
                  <div style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{f.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partner Models */}
        <div style={{ padding: "56px 56px 52px", borderBottom: `1px solid ${IVORY}` }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 24, height: 2, background: TEAL }} />
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: TEAL }}>Partnership Models</span>
            </div>
            <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, color: NAVY, marginBottom: 36, lineHeight: 1.2 }}>
              Three ways to build together.
            </h2>
            <div style={{ display: "grid", gap: 3 }}>
              {partnerModels.map(m => (
                <div key={m.type} style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr", gap: 0, border: `1px solid ${IVORY}` }}>
                  <div style={{ padding: "28px 24px", background: IVORY, borderRight: `3px solid ${m.color}` }}>
                    <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: m.color, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>{m.type}</div>
                    <div style={{ ...DM, fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>{m.examples}</div>
                  </div>
                  <div style={{ padding: "28px 24px", borderRight: `1px solid ${IVORY}` }}>
                    <div style={{ ...DM, fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>Partnership Fit</div>
                    <p style={{ ...DM, fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 12 }}>{m.fit}</p>
                    <p style={{ ...DM, fontSize: 12, color: "#6B7280", lineHeight: 1.65 }}>{m.engagement}</p>
                  </div>
                  <div style={{ padding: "28px 24px" }}>
                    <div style={{ ...DM, fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>Economics</div>
                    <p style={{ ...DM, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{m.economics}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration stack */}
        <div style={{ padding: "48px 56px", background: IVORY, borderBottom: `1px solid #E8E4DC` }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 24, height: 2, background: NAVY }} />
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY }}>Integration Stack</span>
            </div>
            <p style={{ ...DM, fontSize: 14, color: "#374151", lineHeight: 1.75, maxWidth: 600, marginBottom: 24 }}>
              Readiness OS is the orchestration layer above your clients' existing investments. It does not replace their stack — it coordinates it.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {integrations.map(i => (
                <span key={i} style={{ ...BC, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", padding: "6px 14px", background: "#fff", border: `1px solid #D1D5DB`, color: NAVY }}>{i}</span>
              ))}
              <span style={{ ...BC, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", padding: "6px 14px", background: "#fff", border: `1px solid ${TEAL}`, color: TEAL }}>+ Universal Connector →</span>
            </div>
          </div>
        </div>

        {/* Who buys / buyer profile */}
        <div style={{ padding: "56px 56px 52px", borderBottom: `1px solid ${IVORY}` }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 24, height: 2, background: GOLD }} />
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>The Buyer Profile</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
              <div>
                <h2 style={{ ...CG, fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 700, color: NAVY, marginBottom: 20, lineHeight: 1.2 }}>
                  Who owns the coordination problem.
                </h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {[
                    { role: "Chief Operating Officer", context: "Owns mobilization speed and cross-functional execution quality." },
                    { role: "Chief of Staff / Chief Strategy Officer", context: "Manages the coordination infrastructure around the CEO." },
                    { role: "Chief Risk Officer", context: "Owns preparedness for the situations Readiness OS is built around." },
                    { role: "Head of Enterprise PMO", context: "Owns the preparation architecture and protocol governance." },
                  ].map(b => (
                    <div key={b.role} style={{ padding: "14px 18px", borderLeft: `2px solid ${GOLD}`, background: IVORY }}>
                      <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: "0.04em" }}>{b.role}</div>
                      <div style={{ ...DM, fontSize: 12, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>{b.context}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 style={{ ...CG, fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 700, color: NAVY, marginBottom: 20, lineHeight: 1.2 }}>
                  The situations they face.
                </h2>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    "Ransomware / cybersecurity incident response",
                    "Activist investor / proxy campaign response",
                    "Regulatory action or enforcement investigation",
                    "Critical supplier failure or supply chain disruption",
                    "M&A Day 1 integration mobilization",
                    "Product recall or FDA regulatory trigger",
                    "Competitive displacement or market entry threat",
                    "ESG / climate event response",
                  ].map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: TEAL, fontSize: 12, flexShrink: 0, marginTop: 2 }}>→</span>
                      <span style={{ ...DM, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Ask / CTA */}
        <div style={{ padding: "56px 56px 64px", background: NAVY }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 24, height: 2, background: GOLD }} />
                  <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Start the Conversation</span>
                </div>
                <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
                  One conversation to<br />map the opportunity.
                </h2>
                <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>
                  We're looking for channel partners who want to build the operating model practice around the Microsoft AI investment. The right partner has enterprise relationships and the credibility to open the conversation at the COO or CRO level.
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <Link href="/contact" style={{ display: "block", padding: "20px 24px", background: GOLD, textDecoration: "none" }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Schedule a Partnership Conversation →</div>
                  <div style={{ ...DM, fontSize: 11, color: "rgba(10,15,46,0.6)", marginTop: 4 }}>vaughnmartin.com/contact</div>
                </Link>
                <Link href="/executive-brief" style={{ display: "block", padding: "20px 24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", textDecoration: "none" }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Download the Executive Brief →</div>
                  <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Full one-page printable overview</div>
                </Link>
                <Link href="/12-minute-experience" style={{ display: "block", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Run the 12-Minute Test Drive →</div>
                  <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>Show a client how it works in 12 minutes</div>
                </Link>
                <div style={{ padding: "16px 24px", background: "rgba(43,138,110,0.1)", border: "1px solid rgba(43,138,110,0.25)" }}>
                  <div style={{ ...DM, fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.08em", marginBottom: 4 }}>DIRECT CONTACT</div>
                  <div style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Martin Brunke · Founder · martin@vaughnmartin.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
