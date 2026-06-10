import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { ArrowRight, Send, Copy, CheckCircle } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F0EDE4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG = { fontFamily: "'Cormorant Garamond', serif" } as const;

const STAKEHOLDERS = [
  {
    audience: "CFO",
    color: GOLD,
    title: "Frame it as a budget redirect, not a new spend request",
    body: "Every dollar currently allocated to annual planning, strategic consulting, and risk management is already funding the intended. None of it funds the unintended — the situations that arrive regardless of the plan. Readiness OS proposes redirecting 15–20% of the existing planning window. No new headcount. No new budget line. A redirect of preparation capacity toward the category that currently receives zero pre-staged coverage.",
    proof: "The Founding Partner Program entry is $75K — fully credited toward a full platform subscription. The mobilization cost of a single unhandled 30-day response cycle — stakeholder time, coordination overhead, delayed decisions — routinely exceeds that figure.",
  },
  {
    audience: "CEO",
    color: TEAL,
    title: "Frame it as a structural competitive advantage that compounds",
    body: "If a competitor redirects 15% of their annual planning cycle toward pre-staging unintended situations and you do not, you enter the next fiscal year structurally behind on every trigger not on the roadmap. Not slower — unreadied before the year begins. That gap is structural. It compounds. Every planning cycle your competitor runs with Readiness OS deepens the institutional knowledge advantage that cannot be replicated from outside.",
    proof: "The 3,600× Execution Head Start is not a speed metric. It is the difference between a pre-staged organizational response and a 30-day mobilization cycle assembled under pressure. The moat is the accumulated decision logic — three years of proven protocol improvements encoded from real activations cannot be rebuilt from scratch.",
  },
  {
    audience: "Board",
    color: NAVY,
    title: "Frame it as closing the governance gap the risk framework assumes is already closed",
    body: "Your risk framework describes what the organization should do when strategic triggers fire. It assumes the response infrastructure exists. In almost every enterprise, that assumption is wrong. When a trigger fires the organization assembles its response during the mobilization cycle — 30 days before any execution begins. Readiness OS is the governance infrastructure your risk framework has assumed was in place. 180 pre-staged protocols, 231 monitored trigger configurations, continuous signal detection, and executive-authorized execution operating before the event, not after.",
    proof: "The authorization model preserves full executive decision rights. No protocol activates without explicit executive sign-off. Four options at the point of trigger: execute exactly as built, adjust before executing, choose a different protocol, or stand down with a governance record. AI monitors. Executives authorize.",
  },
  {
    audience: "COO",
    color: GOLD,
    title: "Frame it as finishing what annual planning started",
    body: "Annual planning addresses what the organization intends to happen: growth initiatives, product roadmaps, headcount targets. What it does not address is what happens regardless of the plan. Ask your team: in the last planning cycle, how many hours were allocated specifically to pre-staging responses to the situations not on the roadmap — the ones that arrived anyway? The answer is almost always zero. Not because the organization is negligent. Because the planning process was never designed for it. Readiness OS fills the gap the planning cycle leaves open.",
    proof: "The Readiness Planning Sprint maps directly onto your existing Q4 planning window. It is a redirect of sessions that already occur — not an addition to the calendar. Four sessions across 6–8 weeks: map unintended situations, configure priority protocols, simulate activation, certify readiness.",
  },
];

export default function InternalCase() {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Making the Internal Case — Readiness OS by VaughnMartin";
  }, []);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleForwardEmail() {
    const url = window.location.href;
    const subject = encodeURIComponent("Internal Proposal: Readiness OS — Redirecting Our Planning Cycle, Not Adding to It");
    const body = encodeURIComponent(
      `Team,\n\nI've been reviewing Readiness OS and believe it addresses a gap in how we use our annual planning cycle.\n\nThe core proposal: redirect 15–20% of our existing planning budget toward pre-staging organizational responses to strategic situations that aren't on our roadmap — the ones that arrive regardless of the plan.\n\nThis is not a request for new spending. It is a redirect of existing preparation capacity.\n\nThe internal brief with CFO, CEO, Board, and COO framing is here: ${url}\n\nHappy to walk through it at your convenience.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: NAVY, padding: "64px 48px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const, marginBottom: 40 }}>
            <VaughnMartinLogo color="light" height={36} variant="full" />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleForwardEmail} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.12)", color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "10px 18px", border: `1px solid rgba(201,168,76,0.25)`, cursor: "pointer" }}>
                <Send size={12} /> Forward Internally
              </button>
              <button onClick={handleCopyLink} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", color: copied ? TEAL : "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "10px 18px", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", transition: "color 0.2s" }}>
                {copied ? <><CheckCircle size={12} /> Copied</> : <><Copy size={12} /> Copy Link</>}
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1.5, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>Internal Champion Brief</span>
          </div>
          <h1 style={{ ...CG, fontSize: "clamp(28px,4.5vw,50px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
            This is not a request for new budget.<br />
            <em style={{ color: GOLD }}>It is a proposal to redirect what already exists.</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 620, lineHeight: 1.75 }}>
            How to frame Readiness OS to your CFO, CEO, Board, and COO — using the planning cycle that already exists as the foundation, not as a reason to ask for more.
          </p>
        </div>
      </section>

      {/* The Core Argument */}
      <section style={{ background: "#fff", padding: "56px 48px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>The Core Argument</div>
              <h2 style={{ ...CG, fontSize: "clamp(22px,3vw,34px)", fontWeight: 600, color: NAVY, lineHeight: 1.2, marginBottom: 20 }}>
                Your organization already has the offseason.<br />It just isn't using it for this.
              </h2>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginBottom: 16 }}>
                Annual planning cycles exist to prepare the organization for what's coming. They budget. They roadmap. They align. The calendar, the executive attention, and the preparation investment are already allocated — typically for 4–10 weeks every year.
              </p>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginBottom: 16 }}>
                None of that time currently addresses the situations that arrive regardless of the plan. Not because the organization is negligent — because the planning process was never designed for it. Every planning cycle ends with a roadmap for what the organization intends to happen. None ends with a pre-staged response for what happens anyway.
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: NAVY, lineHeight: 1.65 }}>
                Readiness OS proposes redirecting 15–20% of that window. Not new time. Not new budget. A redirect of existing preparation capacity toward the category that currently gets zero.
              </p>
            </div>
            <div style={{ background: OFF, border: `1px solid ${BORDER}`, padding: "32px 28px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>What This Looks Like in Budget Terms</div>
              {[
                { label: "Existing planning cycle investment", value: "100%", sub: "Already allocated — no new asks", color: NAVY },
                { label: "Currently on intended outcomes", value: "~97%", sub: "Roadmap, initiatives, growth targets", color: MUTED },
                { label: "Currently on unintended situations", value: "~0–3%", sub: "Situations not on the roadmap", color: "#EF4444" },
                { label: "Proposed redirect for pre-staging", value: "15–20%", sub: "The Readiness Planning Sprint", color: TEAL },
              ].map(({ label, value, sub, color }, i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{label}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{sub}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color, flexShrink: 0, marginLeft: 16 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Frames */}
      <section style={{ background: OFF, padding: "72px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>How to Frame It for Each Stakeholder</div>
            <h2 style={{ ...CG, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 600, color: NAVY, lineHeight: 1.2 }}>
              The same proposal — four different conversations.
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {STAKEHOLDERS.map(({ audience, color, title, body, proof }) => (
              <div key={audience} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `4px solid ${color}`, padding: "32px 36px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 24, alignItems: "start" }}>
                  <div style={{ width: 56, height: 56, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{audience}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12 }}>{title}</div>
                    <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.8, marginBottom: 16 }}>{body}</p>
                    <div style={{ background: OFF, border: `1px solid ${BORDER}`, padding: "12px 16px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 6 }}>Supporting Proof Point</div>
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, margin: 0 }}>{proof}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Conversation Opener + Next Steps */}
      <section style={{ background: "#fff", padding: "64px 48px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Open With This</div>
              <p style={{ ...CG, fontSize: "clamp(17px,2.5vw,26px)", fontStyle: "italic", color: NAVY, lineHeight: 1.45, marginBottom: 20 }}>
                "In our last planning cycle, how much time did we allocate specifically to preparing for situations that weren't on the roadmap — the ones that arrived anyway?"
              </p>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginBottom: 16 }}>
                This question is the framing. Every executive who has lived through a strategic trigger that arrived off-roadmap knows the answer. Zero. And they know the cost of that zero — the mobilization delay, the coordination overhead, the decisions made under pressure that would have been made better with more time.
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>
                Readiness OS is how you ensure that answer changes — without asking for new budget to change it.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: NAVY, padding: "28px 24px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Next Steps for the Internal Champion</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Run the Planning Gap Calculator", href: "/planning-gap", desc: "Quantify the gap in your specific org — enter your numbers" },
                    { label: "Share the Executive Brief", href: "/executive-brief", desc: "Full printable 1-pager with proof numbers and ROI case" },
                    { label: "Request a Founding Partner Conversation", href: "/request-access", desc: "90-day validation partnership — $75K entry, 100% credited" },
                  ].map(({ label, href, desc }) => (
                    <button key={label} onClick={() => setLocation(href)} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px 14px", cursor: "pointer", textAlign: "left" as const, width: "100%" }}>
                      <ArrowRight size={12} color={GOLD} style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleForwardEmail}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 0", border: "none", cursor: "pointer" }}
              >
                <Send size={14} /> Forward This Brief to Your Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
