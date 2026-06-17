import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { Link } from "wouter";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const DM = { fontFamily: "'Barlow', system-ui, sans-serif" };

const emails = [
  {
    num: "01",
    timing: "Day 1 — Cold Open",
    subject: "The 30-day problem at [Company]",
    preview: "The observation that opens the conversation.",
    body: `Hi [First Name],

Most organizations I talk to have the same pattern: when a strategic trigger fires — a competitor move, a regulatory action, a supply chain disruption — the first 30 days aren't spent executing. They're spent figuring out who needs to be in the room.

That's not a people problem. It's an infrastructure problem. The response wasn't built before the trigger fired.

I built Readiness OS after 20 years watching this play out at the intersection of governance and execution — in companies from startup to Fortune 500. The architecture is different: 180 Readiness Protocols pre-staged, 231 trigger patterns continuously monitored, full stakeholder and budget authority mapped before anything happens. When a trigger fires, execution begins in 12 minutes — not 30 days.

Would it be useful to see how three organizations comparable to [Company] use this today?

Martin Brunke
Founder, VaughnMartin
vaughnmartin.com`,
    notes: "Personalize [Company] and [First Name]. Keep the tone observational, not pitch-forward. The goal is a reply, not a sale.",
    color: NAVY,
  },
  {
    num: "02",
    timing: "Day 4 — The Insight",
    subject: "What your response infrastructure is actually costing you",
    preview: "Introduce Readiness Debt before you introduce the product.",
    body: `Hi [First Name],

There's a concept I call Readiness Debt — the accumulated cost of not having prepared responses for situations you know you'll eventually face.

Every organization has a set of strategic triggers that are predictable: an activist investor, a ransomware attack, a supplier failure, a regulatory action, a competitor displacement move. Most organizations know these situations are coming. Few have pre-staged responses for them. So when the trigger fires, they spend the first 30 days building the response they should have built before the signal appeared.

The McKinsey 2026 operating model research put a number on it: 81% of executives say their organization's speed of decision-making is inadequate for the environment they operate in. The bottleneck isn't intelligence — it's coordination infrastructure. The data was available. The response wasn't ready.

Readiness OS closes that gap. The response is built before the trigger fires. Executive authority is preserved at every step — no protocol activates without sign-off. The preparation compresses the mobilization cycle. The decision stays human.

Worth a 20-minute conversation?

Martin`,
    notes: "This email plants the 'Readiness Debt' concept. Don't over-explain. The goal is to get them nodding before you ask for time.",
    color: TEAL,
  },
  {
    num: "03",
    timing: "Day 8 — The Proof",
    subject: "12 minutes vs. 30 days — not a concept, an architecture",
    preview: "Make it concrete with one scenario that matches their industry.",
    body: `Hi [First Name],

I want to make this specific.

[Choose the scenario that fits their industry — see notes below]

RANSOMWARE (Financial Services / Healthcare / Manufacturing):
When EHR systems lock, the average enterprise spends the first 72 hours in stakeholder chaos — who owns what, who talks to regulators, who authorizes the ransom decision, who briefs the board. With a pre-staged Readiness Protocol, all of that is already mapped. Legal holds trigger automatically. Regulator notification templates are pre-cleared. The board briefing is staged before anyone picks up the phone. Execution begins in 12 minutes.

ACTIVIST INVESTOR (Public Companies / PE-backed):
The 13D filing hits on a Tuesday morning. Without preparation, the next 30 days are alignment — investment bankers, legal counsel, board prep, communications strategy, proxy advisors. With a pre-staged protocol, the response is already sequenced. Every stakeholder knows their role. The board brief goes out in minutes, not days. The enterprise responds from a position of readiness, not reaction.

SUPPLY CHAIN (Manufacturing / Retail / CPG):
A Tier 1 supplier goes dark. The traditional response: emergency calls, manual supplier list review, logistics rerouting negotiations, customer communication firefight — all sequential. The pre-staged protocol: alternate suppliers pre-qualified, logistics reroutes mapped, customer communications templated. Execution begins before the supplier's next business day starts.

The 3,600× Execution Head Start isn't a marketing number — it's the arithmetic of 30 days compressed to 12 minutes. That compression exists because the response was built before the trigger fired.

I can walk you through the full architecture in 20 minutes. No deck required.

Martin`,
    notes: "Pick ONE scenario from the three based on their industry. Delete the others. The specificity is what makes this land.",
    color: GOLD,
  },
  {
    num: "04",
    timing: "Day 14 — The Ask",
    subject: "One conversation before [Q3/Q4] planning",
    preview: "Direct ask. Founding Partner framing. 20 minutes.",
    body: `Hi [First Name],

Direct ask: 20 minutes before your [Q3/Q4] planning cycle closes.

I'm not going to walk you through a slide deck. I want to understand your current response infrastructure — specifically, which strategic triggers you expect to face in the next 12 months and whether the response architecture exists before those triggers fire.

If the answer is that you're building responses in real time when situations present themselves, there's a structured path to change that. The Founding Partner Program is a 90-day validation partnership — three to five organizations that want to move from reactive coordination to pre-staged execution. The program is designed to produce measurable evidence: actual activation time, actual mobilization cycle compression, actual executive hours recovered.

If the timing isn't right, I understand. But the 30-day problem will still be there next quarter.

If it is: [Calendar link or reply to this email]

Martin Brunke
Founder, VaughnMartin
vaughnmartin.com/founding-partner-program`,
    notes: "Replace [Q3/Q4] with the relevant planning cycle. Add your calendar link. This is the ask email — be direct, don't hedge.",
    color: NAVY,
  },
  {
    num: "05",
    timing: "Day 21 — Final Touch",
    subject: "Leaving this here",
    preview: "Short. No pressure. Leave the door open with an asset.",
    body: `Hi [First Name],

I'll keep this brief.

I'm attaching the Executive Brief — it's a one-page summary of the architecture, the proof numbers, and the Founding Partner Program structure. If the timing isn't right now, it'll be there when it is.

The 30-day mobilization problem tends to become urgent the day after a trigger fires. I'd rather have this conversation before that day.

If anything changes: martin@vaughnmartin.com or vaughnmartin.com/request-access.

Martin

—
Executive Brief: vaughnmartin.com/executive-brief`,
    notes: "This is a leave-behind, not a follow-up pitch. Short is correct. The link to the Executive Brief does the work.",
    color: TEAL,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      style={{ ...DM, display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: copied ? TEAL : "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", padding: "6px 0", textTransform: "uppercase" as const }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}

function EmailCard({ email, index }: { email: typeof emails[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{ border: `1px solid rgba(255,255,255,0.08)`, marginBottom: 2 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px", background: open ? "rgba(255,255,255,0.04)" : "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ ...DM, fontSize: 11, fontWeight: 800, color: email.color, letterSpacing: "0.2em", minWidth: 28 }}>{email.num}</div>
          <div>
            <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{email.subject}</div>
            <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>{email.timing}</div>
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 28px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: email.color, marginBottom: 6 }}>Subject Line</div>
              <div style={{ ...CG, fontSize: 18, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{email.subject}</div>
            </div>
            <CopyButton text={`Subject: ${email.subject}\n\n${email.body}`} />
          </div>

          <div style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, whiteSpace: "pre-wrap" as const, background: "rgba(0,0,0,0.2)", padding: "20px 24px", borderLeft: `3px solid ${email.color}`, marginBottom: 20 }}>
            {email.body}
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 18px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <span style={{ ...DM, fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase" as const, flexShrink: 0, marginTop: 1 }}>Note</span>
            <span style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{email.notes}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FoundingPartnerOutreachKit() {
  return (
    <PageLayout>
      <div style={{ background: NAVY, minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "48px 48px 40px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
              <VaughnMartinLogo size="sm" color="light" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: GOLD }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Internal Sales Resource</span>
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
              Founding Partner<br /><em style={{ color: GOLD }}>Outreach Sequence</em>
            </h1>
            <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 560, lineHeight: 1.75, marginBottom: 24 }}>
              Five emails. Twenty-one days. One objective: get the 20-minute conversation with the executive who owns the coordination problem. Copy each email, personalize the name and company, and send.
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
              {[
                { label: "5 emails", sub: "Full sequence" },
                { label: "21 days", sub: "Recommended cadence" },
                { label: "1 ask", sub: "20-minute conversation" },
              ].map(s => (
                <div key={s.label} style={{ borderLeft: `2px solid rgba(201,168,76,0.3)`, paddingLeft: 12 }}>
                  <div style={{ ...DM, fontSize: 16, fontWeight: 800, color: GOLD }}>{s.label}</div>
                  <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div style={{ padding: "36px 48px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {[
              { step: "1", title: "Identify the right person", body: "Head of Strategy, COO, Chief of Staff, or Chief Risk Officer. They own the coordination problem. Not IT, not procurement." },
              { step: "2", title: "Personalize each email", body: "Replace [First Name], [Company], and [Q3/Q4]. For Email 3, pick the scenario that fits their industry and delete the others." },
              { step: "3", title: "Send, don't follow up in the same thread", body: "Each email is a fresh send, not a reply chain. One email at a time. Let the sequence breathe." },
            ].map(s => (
              <div key={s.step} style={{ padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ ...DM, fontSize: 28, fontWeight: 800, color: "rgba(201,168,76,0.2)", marginBottom: 8 }}>{s.step}</div>
                <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.title}</div>
                <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Sequence */}
        <div style={{ padding: "48px 48px 80px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)" }}>The Five-Email Sequence</span>
            </div>
            {emails.map((email, i) => (
              <EmailCard key={email.num} email={email} index={i} />
            ))}

            {/* Supporting assets */}
            <div style={{ marginTop: 48, padding: "28px 32px", background: "rgba(43,138,110,0.07)", border: "1px solid rgba(43,138,110,0.2)" }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 16 }}>Supporting Assets — Share These</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Executive Brief", desc: "One-page printable pitch. Attach to Email 5.", href: "/executive-brief" },
                  { label: "12-Minute Test Drive", desc: "Interactive simulation. Link in any email.", href: "/12-minute-experience" },
                  { label: "Proof Story", desc: "Three full activation narratives. Link after interest.", href: "/proof-story" },
                ].map(a => (
                  <Link key={a.label} href={a.href} style={{ display: "block", padding: "16px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", textDecoration: "none" }}>
                    <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{a.label}</div>
                    <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{a.desc}</div>
                    <div style={{ ...DM, fontSize: 10, color: TEAL, marginTop: 8, fontWeight: 600 }}>Open page →</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
