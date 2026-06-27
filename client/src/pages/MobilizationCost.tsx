import { useLocation } from "wouter";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F0EDE4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const scenarios = [
  {
    id: "ransomware",
    trigger: "Ransomware / Cyberattack",
    cost: "$4.5M",
    costLabel: "Average incident cost",
    mobilization: "6–8 weeks",
    mobilizationLabel: "Before coordinated response",
    color: "#DC2626",
    what: "Systems encrypted at 3am. By morning, leadership is on calls trying to figure out who owns the response. Legal, IT, Communications, Operations — no one has a pre-defined role. The CISO is making decisions they were never authorized to make. The board wants answers no one has. Six weeks later, you have a response. The window for containment closed in week one.",
    costs: [
      { label: "Incident remediation", value: "$1.2M avg" },
      { label: "Business disruption", value: "$2.1M avg" },
      { label: "Regulatory exposure", value: "$800K avg" },
      { label: "Reputational recovery", value: "12–18 months" },
    ],
    source: "IBM Cost of a Data Breach Report 2024 · Ponemon Institute · $4.88M global average (2024); $4.45M (2023). Components: detection/escalation, notification, post-breach response, lost business. Figure represents mid-market enterprise profile.",
  },
  {
    id: "activist",
    trigger: "Activist Investor Campaign",
    cost: "$3.2M",
    costLabel: "Average advisory & response cost",
    mobilization: "4–6 weeks",
    mobilizationLabel: "Before unified response",
    color: GOLD,
    what: "A 13D filing hits at 6am. Investment bankers, legal counsel, IR, communications, and the board all need to align — immediately. No one has a pre-approved response framework. Four weeks of emergency meetings, advisor fees, and board calls later, you have a coordinated position. The activist has spent that month building their coalition. Your window to control the narrative closed before you found your footing.",
    costs: [
      { label: "Investment banking fees", value: "$800K–1.4M" },
      { label: "Legal & advisory", value: "$600K–900K" },
      { label: "Management distraction", value: "1 full quarter" },
      { label: "Stock impact during mobilization", value: "−8% avg" },
    ],
    source: "Lazard Shareholder Advisory Annual Review · ISS Institutional Shareholder Services Research · Harvard Law School Forum on Corporate Governance. Advisory fee benchmarks for mid-cap activist defense campaigns. Stock impact sourced from Lazard 2023 Activism Review of campaigns >$500M market cap.",
  },
  {
    id: "regulatory",
    trigger: "Regulatory / DOJ Investigation",
    cost: "$5.8M",
    costLabel: "Average legal & operational cost",
    mobilization: "8–12 weeks",
    mobilizationLabel: "Before aligned response posture",
    color: TEAL,
    what: "A civil investigative demand arrives. The general counsel calls an all-hands. Who is the response owner? What is the document preservation protocol? Who speaks to regulators, and with what authority? Eight weeks of legal-led alignment, spiraling fees, and executive distraction — while the investigation proceeds on the regulator's timeline, not yours. Every week of delay in establishing your posture is a week they have to set the narrative.",
    costs: [
      { label: "Legal defense fees", value: "$2.1M avg" },
      { label: "Compliance remediation", value: "$1.4M avg" },
      { label: "Executive time (lost productivity)", value: "$900K avg" },
      { label: "Reputational & stock impact", value: "Material" },
    ],
    source: "PwC Global Crisis & Resilience Survey 2023 (1,812 organizations, 42 countries) · Deloitte Regulatory Enforcement Response Cost Benchmarks · DOJ/SEC/HHS documented enforcement cost data. Legal and compliance figures represent median Fortune 1000 regulatory response, excluding any resulting fines.",
  },
];

export default function MobilizationCost() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "The Cost of One Unprepared Trigger | VaughnMartin Readiness OS",
      description: "What one strategic situation costs an unprepared organization — in dollars, weeks, and windows that close while you're still mobilizing.",
    });
  }, []);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* MINIMAL NAV */}
      <nav style={{ background: NAVY, padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => setLocation("/")}
          style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}
        >
          <div style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid #C9A84C", background: "radial-gradient(circle at 40% 40%, #1a2860 0%, #0A0F2E 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#C9A84C", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 10 }}>VM</span>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 13, lineHeight: 1 }}>VaughnMartin</div>
            <div style={{ color: GOLD, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}>READINESS OS</div>
          </div>
        </button>
        <Button
          onClick={() => setLocation("/request-access")}
          style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 12, letterSpacing: "0.06em" }}
        >
          Apply for Founding Partner Access
        </Button>
      </nav>

      {/* HERO — consequence first, no product */}
      <section style={{ background: NAVY, padding: "80px 48px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ width: 24, height: 1, background: GOLD }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD }}>Before any platform conversation</span>
            <div style={{ width: 24, height: 1, background: GOLD }} />
          </div>

          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(36px,5vw,60px)", lineHeight: 1.08, color: "#fff", marginBottom: 20 }}>
            What one unprepared trigger<br />costs your organization.
          </h1>

          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 0" }}>
            Not the event. The mobilization — the weeks spent figuring out who's in charge, what the plan is, and who needs to be in the room. That's where the real cost accumulates.
          </p>
        </div>
      </section>

      {/* THREE SCENARIO COST BLOCKS */}
      <section style={{ background: OFF, padding: "72px 48px" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {scenarios.map((s) => (
              <div key={s.id} style={{ background: "#fff", border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                {/* Header bar */}
                <div style={{ background: NAVY, padding: "18px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>{s.trigger}</span>
                  </div>
                  <div style={{ display: "flex", gap: 32 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.cost}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>{s.costLabel}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>{s.mobilization}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>{s.mobilizationLabel}</div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="grid md:grid-cols-3 gap-0">
                  {/* What actually happens */}
                  <div style={{ gridColumn: "span 2", padding: "28px 36px", borderRight: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>What actually happens during mobilization</div>
                    <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75 }}>{s.what}</p>
                  </div>

                  {/* Cost breakdown */}
                  <div style={{ padding: "28px 32px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 16 }}>Cost breakdown</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {s.costs.map((c) => (
                        <div key={c.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` }}>
                          <span style={{ fontSize: 12, color: MUTED, lineHeight: 1.4, flex: 1 }}>{c.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, flexShrink: 0 }}>{c.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Source citation */}
                <div style={{ padding: "12px 36px", borderTop: `1px solid ${BORDER}`, background: "#FAFAF9", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: TEAL, flexShrink: 0, marginTop: 1 }}>Source</span>
                  <span style={{ fontSize: 10, color: MUTED, lineHeight: 1.6 }}>{s.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE MOBILIZATION TAX — the common thread */}
      <section style={{ background: "#fff", padding: "80px 48px", borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>The Common Thread</span>
          </div>

          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,3.5vw,42px)", lineHeight: 1.15, color: NAVY, marginBottom: 24, maxWidth: 700 }}>
            In every case, the most expensive weeks weren't the response. They were the mobilization.
          </h2>

          <p style={{ fontSize: 17, color: "#374151", lineHeight: 1.8, marginBottom: 28, maxWidth: 680 }}>
            Figuring out who needs to be in the room. Agreeing on a plan. Aligning stakeholders who don't normally work together, under pressure, while the window closes. That cycle — in every organization from startup to Fortune 500 — takes 30 days before execution even begins.
          </p>

          <p style={{ fontSize: 17, color: "#374151", lineHeight: 1.8, marginBottom: 52, maxWidth: 680 }}>
            It isn't a people problem. It isn't a leadership problem. It's a structural problem: the response was never built before it was needed.
          </p>

          {/* The Question */}
          <div style={{ background: NAVY, padding: "40px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: GOLD }} />
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>The question worth sitting with</div>
            <p style={{ ...CG, fontWeight: 600, fontSize: "clamp(22px,2.8vw,32px)", lineHeight: 1.3, color: "#fff", margin: 0 }}>
              How long did your last unprepared trigger take to mobilize a coordinated response — and what did those weeks cost you?
            </p>
          </div>
        </div>
      </section>

      {/* THE PIVOT — product enters here for the first time */}
      <section style={{ background: OFF, padding: "80px 48px", borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <div style={{ width: 28, height: 2, background: TEAL }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL }}>What if the mobilization already happened</span>
          </div>

          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,3.5vw,42px)", lineHeight: 1.15, color: NAVY, marginBottom: 24 }}>
            What if the response was already built<br />before the trigger fired?
          </h2>

          <p style={{ fontSize: 17, color: "#374151", lineHeight: 1.8, marginBottom: 48, maxWidth: 660 }}>
            Readiness OS pre-stages the response before the trigger fires — protocols built, roles assigned, tasks seeded, executive authorization defined. When the trigger fires, execution begins in 12 minutes. The mobilization already happened.
          </p>

          {/* 30 days vs 12 minutes */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 56, maxWidth: 600 }}>
            <div style={{ flex: 1, background: "#fff", border: `1px solid ${BORDER}`, padding: "32px 36px", textAlign: "center" }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>Without Readiness OS</div>
              <div style={{ ...CG, fontSize: 52, fontWeight: 700, color: "#9CA3AF", lineHeight: 1, textDecoration: "line-through", marginBottom: 8 }}>30 days</div>
              <div style={{ fontSize: 12, color: MUTED }}>Mobilization before execution begins</div>
            </div>
            <div style={{ padding: "0 24px", flexShrink: 0 }}>
              <ArrowRight style={{ color: GOLD, width: 28, height: 28 }} />
            </div>
            <div style={{ flex: 1, background: NAVY, padding: "32px 36px", textAlign: "center" }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>With Readiness OS</div>
              <div style={{ ...CG, fontSize: 52, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>12 min</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Trigger to execution underway</div>
            </div>
          </div>

          {/* Three proof points */}
          <div className="grid md:grid-cols-3 gap-px" style={{ background: BORDER, border: `1px solid ${BORDER}`, marginBottom: 48 }}>
            {[
              { stat: "180", label: "Readiness Protocols", sub: "Pre-staged across every strategic domain" },
              { stat: "3,600×", label: "Execution Head Start", sub: "30 days compressed to 12 minutes" },
              { stat: "231", label: "Detection Thresholds", sub: "Monitored continuously, 24/7" },
            ].map((p) => (
              <div key={p.stat} style={{ background: "#fff", padding: "32px 28px", textAlign: "center" }}>
                <div style={{ ...CG, fontSize: 40, fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 6 }}>{p.stat}</div>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: NAVY, marginBottom: 6 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: NAVY, padding: "80px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>See It In Your Context</span>
            <div style={{ width: 28, height: 2, background: GOLD }} />
          </div>

          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,3.5vw,44px)", lineHeight: 1.1, color: "#fff", marginBottom: 16 }}>
            See what a pre-staged response looks like.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
            Watch a full activation — signal detection to executive authorization to execution — for the scenario closest to your organization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation("/demo-experience")}
              style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 14 }}
              className="hover:opacity-90"
            >
              Watch a Full Activation
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              onClick={() => setLocation("/request-access")}
              style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", fontWeight: 600 }}
              className="hover:bg-white hover:text-navy"
            >
              Apply for Founding Partner Access
            </Button>
          </div>

          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 32 }}>
            90-day structured validation. No subscription fee during the program. Two organizations selected.
          </p>
        </div>
      </section>

    </div>
  );
}
