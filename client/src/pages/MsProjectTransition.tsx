import { useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Check, X, ArrowRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const COMPARISON_ROWS = [
  { dimension: "Primary Goal", them: "Administrative governance", us: "Strategic velocity & fearless execution" },
  { dimension: "Microsoft Relation", them: "A replacement for MS Project data storage", us: "The operating model layer above the entire MS stack" },
  { dimension: "Response Time", them: "Days to weeks of planning after a trigger", us: "12 minutes — response is ready before the trigger fires" },
  { dimension: "Mobilization Lag", them: "30-day cycle (same as MS Project — tool changed, model didn't)", us: "Eliminated — 180 Readiness Protocols pre-staged and ready" },
  { dimension: "Core Value Metric", them: "End-to-end visibility", us: "3,600× Execution Head Start" },
  { dimension: "Budget Source", them: "IT Operations (cost center)", us: "CEO / Board Strategic Fund (growth center)" },
  { dimension: "AI Integration", them: "Reports and dashboards on top of data", us: "AI monitors, executives authorize, execution coordinated in 12 min" },
  { dimension: "Readiness Protocols", them: "Custom templates — weeks to configure", us: "170 pre-built, battle-tested readiness Readiness Protocols" },
  { dimension: "Signal Detection", them: "Not included", us: "248+ data points continuously monitored across 9 domains" },
  { dimension: "ROI Metric", them: "System consolidation", us: "$3,472 per minute of strategic advantage preserved" },
  { dimension: "Core Message", them: "Better governance", us: "Enterprises become fearless" },
];

export default function MsProjectTransition() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "MS Project End of Life — Don't Just Migrate. Evolve. | VaughnMartin Readiness OS",
      description: "Microsoft Project is retiring. ServiceNow wants to migrate your lag to a new database. Readiness OS eliminates the 30-day mobilization cycle entirely — 170 pre-staged Readiness Protocols, 12-minute execution, and the operating model startup to Fortune 500 boards actually need.",
      ogTitle: "Microsoft Project EOL: Migration vs. Evolution",
      ogDescription: "While others migrate their static plans to ServiceNow, Readiness OS users are already executing. 30 days compressed to 12 minutes.",
    });
  }, []);

  return (
    <PageLayout>

      {/* ── HERO ── */}
      <section style={{ background: NAVY, padding: "88px 48px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,168,76,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.07) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
        <div style={{ position: "absolute", left: -120, top: -160, width: 700, height: 700, background: "radial-gradient(circle, rgba(43,138,110,0.16) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", right: -80, bottom: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(201,168,76,0.13) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "6px 16px", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)" }}>
            <div style={{ width: 6, height: 6, background: "#EF4444", borderRadius: "50%" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.7)" }}>
              Microsoft Project End of Life
            </span>
          </div>

          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(36px,5vw,60px)", color: "#F0EDE4", lineHeight: 1.05, marginBottom: 24 }}>
            Don't just migrate your lag<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>to a new database.</em>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(240,237,228,0.65)", maxWidth: 660, margin: "0 auto 16px", lineHeight: 1.65 }}>
            Microsoft Project is retiring. ServiceNow is selling a better place to store your static project data. Elite enterprise leaders are using this moment to eliminate the 30-day mobilization cycle — forever.
          </p>

          <p style={{ fontSize: 15, color: GOLD, fontWeight: 600, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.5, fontStyle: "italic" }}>
            "The response is ready before the trigger fires."
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/12-minute-experience")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 32px", border: "none", cursor: "pointer" }}
            >
              See the 12-Minute Difference <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setLocation("/pilot-program")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 32px", border: "1px solid rgba(240,237,228,0.2)", cursor: "pointer" }}
            >
              Apply for Founding Partner Access
            </button>
          </div>
        </div>
      </section>

      {/* ── THE MIGRATION TRAP ── */}
      <section style={{ background: "#fff", padding: "80px 48px", borderBottom: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ width: 32, height: 2, background: "#EF4444" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#EF4444" }}>The Migration Trap</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

            {/* What ServiceNow sells */}
            <div>
              <div style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 16, lineHeight: 1.2 }}>
                What ServiceNow is selling:
              </div>
              <div style={{ border: `1px solid #E8E4DC`, overflow: "hidden" }}>
                {[
                  { label: "End-to-end visibility", note: "You can see your projects — you still can't act in 12 minutes" },
                  { label: "Stronger governance", note: "More hurdles, not less. The same committees, now in a cloud dashboard" },
                  { label: "Informed investment prioritization", note: "Still prioritizing while competitors are already executing" },
                  { label: "Better MS Project migration", note: "Same 30-day mobilization lag — just a newer interface" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "16px 20px", borderBottom: i < 3 ? `1px solid #F3F4F6` : "none", background: i % 2 === 0 ? "#fff" : "#FAFAF9", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <X style={{ width: 14, height: 14, color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", fontStyle: "italic" }}>{item.note}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "16px 20px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#DC2626", margin: 0 }}>
                  Visibility is not velocity. If it takes 30 days to mobilize after you "see" the problem — the visibility was wasted.
                </p>
              </div>
            </div>

            {/* What the board is actually asking */}
            <div>
              <div style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 16, lineHeight: 1.2 }}>
                What your board is asking:
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {[
                  "When a competitor launches an AI product tomorrow, how long until we respond?",
                  "When a cyberattack hits at 2am, what happens in the first 12 minutes?",
                  "When a key executive departs, how long until the rest of the organization knows what to do?",
                  "Are we ready — or are we still the kind of organization that takes 30 days to mobilize?",
                ].map((q, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", background: OFF, border: `1px solid #E8E4DC` }}>
                    <div style={{ width: 3, height: 40, background: GOLD, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{q}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "16px 20px", background: "rgba(43,138,110,0.05)", border: "1px solid rgba(43,138,110,0.15)" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: TEAL, margin: 0 }}>
                  ServiceNow answers the IT department's question.<br />
                  Readiness OS answers the board's question.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE MICROSOFT ANGLE ── */}
      <section style={{ background: OFF, padding: "80px 48px", borderBottom: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 32, height: 2, background: NAVY }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY }}>The Microsoft Positioning</span>
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,3.5vw,42px)", color: NAVY, lineHeight: 1.15, marginBottom: 20 }}>
                Every enterprise has Microsoft's AI stack.<br />
                <em style={{ color: GOLD, fontStyle: "italic" }}>None have the operating model to use it.</em>
              </h2>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.7, marginBottom: 20 }}>
                Microsoft is retiring MS Project because they're building something bigger — Azure AI Foundry, Copilot Studio, Teams-native workflows. They're building the engine. ServiceNow is trying to replace the old dashboard.
              </p>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.7, marginBottom: 28 }}>
                Readiness OS is the transmission. When a high-stakes situation presents itself, the coordinated response deploys inside Teams, Azure AI, and M365 in 12 minutes — with the workflow architecture that turns AI capability into AI action.
              </p>
              <div style={{ padding: "20px 24px", background: NAVY, border: `2px solid ${GOLD}` }}>
                <p style={{ ...CG, fontSize: 22, fontWeight: 600, color: "#F0EDE4", margin: "0 0 6px", lineHeight: 1.3 }}>
                  "The engine is Microsoft.
                </p>
                <p style={{ ...CG, fontSize: 22, fontWeight: 600, color: GOLD, margin: 0, lineHeight: 1.3 }}>
                  The transmission is Readiness OS."
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
              {[
                { phase: "01", title: "Microsoft provides the AI engine", body: "Azure AI Foundry, Copilot Studio, Teams, M365 — your organization already has this infrastructure." },
                { phase: "02", title: "Readiness OS is the operating model layer", body: "Pre-staged Readiness Protocols, role assignments, decision rights, and execution coordination — activated in 12 minutes above your existing Microsoft stack." },
                { phase: "03", title: "Every Microsoft customer is a Readiness OS prospect", body: "For investors: the total addressable market is every startup to Fortune 500 Microsoft enterprise account — a $847B strategic spend already committed." },
              ].map((item) => (
                <div key={item.phase} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "24px", background: "#fff", border: `1px solid #E8E4DC` }}>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1, flexShrink: 0 }}>{item.phase}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ background: "#fff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: NAVY }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY }}>Side by Side</span>
              <div style={{ width: 24, height: 2, background: NAVY }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              ServiceNow SPM vs. Readiness OS
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 520, margin: "0 auto" }}>
              One manages the administrative aftermath of the Microsoft transition. The other eliminates the problem the transition was supposed to solve.
            </p>
          </div>

          <div style={{ background: "#fff", border: `1px solid #E8E4DC`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: NAVY }}>
              <div style={{ padding: "16px 24px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.4)" }}>Dimension</span>
              </div>
              <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,237,228,0.1)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(239,68,68,0.7)" }}>ServiceNow SPM</span>
              </div>
              <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,237,228,0.1)", background: "rgba(201,168,76,0.08)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD }}>Readiness OS</span>
              </div>
            </div>

            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < COMPARISON_ROWS.length - 1 ? `1px solid #F3F4F6` : "none", background: i % 2 === 0 ? "#fff" : "#FAFAF9" }}
              >
                <div style={{ padding: "16px 24px" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{row.dimension}</span>
                </div>
                <div style={{ padding: "16px 24px", borderLeft: "1px solid #F3F4F6", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <X style={{ width: 13, height: 13, color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{row.them}</span>
                </div>
                <div style={{ padding: "16px 24px", borderLeft: "1px solid #F3F4F6", display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(201,168,76,0.03)" }}>
                  <Check style={{ width: 13, height: 13, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{row.us}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE EVOLUTION CHOICE ── */}
      <section style={{ background: OFF, padding: "80px 48px", borderTop: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              Two decisions. Same moment.
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 480, margin: "0 auto" }}>
              Microsoft Project is retiring right now. Your organization is at a fork.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Migration path */}
            <div style={{ border: `1px solid rgba(239,68,68,0.2)`, padding: "40px 36px", background: "rgba(239,68,68,0.02)", textAlign: "center" as const }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#EF4444", marginBottom: 20 }}>The Migration Path</div>
              <div style={{ ...CG, fontSize: 36, fontWeight: 600, color: "#DC2626", marginBottom: 12, lineHeight: 1.1 }}>Move to ServiceNow</div>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, lineHeight: 1.6 }}>
                Migrate your project data to a new cloud database. Keep the same 30-day mobilization cycle. Pay an IT operations budget to manage the transition. Get a better dashboard for the same slow process.
              </p>
              <div style={{ padding: "16px 20px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0, fontStyle: "italic" }}>
                  You've migrated the tool. You haven't changed the model. The mobilization gap remains.
                </p>
              </div>
            </div>

            {/* Evolution path */}
            <div style={{ border: `2px solid ${GOLD}`, padding: "40px 36px", background: "rgba(201,168,76,0.03)", textAlign: "center" as const }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>The Evolution Path</div>
              <div style={{ ...CG, fontSize: 36, fontWeight: 600, color: NAVY, marginBottom: 12, lineHeight: 1.1 }}>Upgrade to Readiness OS</div>
              <p style={{ fontSize: 14, color: "#4B5563", marginBottom: 24, lineHeight: 1.6 }}>
                Use the Microsoft transition as the catalyst to eliminate the mobilization cycle entirely. Deploy 170 pre-staged Readiness Protocols. 248+ signal monitors. Executive-authorized execution in 12 minutes. CEO/Board budget — not IT.
              </p>
              <div style={{ padding: "16px 20px", background: "rgba(43,138,110,0.06)", border: "1px solid rgba(43,138,110,0.15)" }}>
                <p style={{ fontSize: 13, color: "#374151", margin: 0, fontWeight: 600 }}>
                  You haven't migrated a tool. You've eliminated the operating model that made the tool necessary in the first place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALSO IN THIS SERIES ── */}
      <section style={{ background: "#fff", padding: "40px 48px", borderTop: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1.5, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#6B7280" }}>Also in This Series</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {[
              { label: "Why Not Consulting?", sub: "McKinsey charges $300K–$500K for Readiness Protocols that sit on a shelf. We deliver infrastructure that executes.", path: "/vs-consulting", tag: "Management Consulting vs. Readiness OS" },
              { label: "Platform Reality", sub: "Every conference keynote and framework proves the problem. None of them shipped the solution. We did.", path: "/platform-reality", tag: "They Described It. We Built It." },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                style={{ padding: "20px 24px", background: "#F8F7F4", border: `1px solid #E8E4DC`, textAlign: "left" as const, cursor: "pointer", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>{item.tag}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 5 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{item.sub}</div>
                </div>
                <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: NAVY, padding: "80px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>The Readiness OS Difference</span>
            <div style={{ width: 28, height: 2, background: GOLD }} />
          </div>

          <p style={{ ...CG, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 600, color: "#F0EDE4", lineHeight: 1.2, margin: "0 0 12px" }}>
            While others move their static plans to ServiceNow,
          </p>
          <p style={{ ...CG, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 600, color: GOLD, lineHeight: 1.2, margin: "0 0 32px", fontStyle: "italic" }}>
            Readiness OS users are already executing.
          </p>
          <p style={{ fontSize: 15, color: "rgba(240,237,228,0.55)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.65 }}>
            The Microsoft Project transition window is open now. Elite leaders are using it to make the leap from static tracking to organizational readiness. 30 days compressed to 12 minutes. Preparation → Readiness → Fearless.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/pilot-program")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 36px", border: "none", cursor: "pointer" }}
            >
              Apply for Founding Partner Access <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setLocation("/12-minute-experience")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 36px", border: "1px solid rgba(240,237,228,0.2)", cursor: "pointer" }}
            >
              See the 12-Minute Test Drive
            </button>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
