import { useEffect } from "react";
import { useLocation } from "wouter";
import VaughnMartinLogo from "@/components/VaughnMartinLogo";
import StandardNav from "@/components/layout/StandardNav";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

const PRINT_STYLE = `
@media print {
  .no-print { display: none !important; }
  body { background: #fff !important; }
  .print-page { background: #fff !important; color: #0A0F2E !important; }
  .print-section { page-break-inside: avoid; }
  a { color: inherit !important; text-decoration: none !important; }
}
@page {
  margin: 0.75in 0.65in;
  size: letter;
}
`;

function Rule({ gold = false }: { gold?: boolean }) {
  return (
    <div style={{
      height: 1,
      background: gold ? `linear-gradient(90deg, ${GOLD}, transparent)` : "rgba(10,15,46,0.10)",
      margin: "0",
    }} />
  );
}

function SectionTag({ children }: { children: string }) {
  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: GOLD,
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: 26,
      fontWeight: 700,
      color: NAVY,
      margin: "0 0 8px",
      lineHeight: 1.2,
    }}>
      {children}
    </h2>
  );
}

function Body({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <p style={{
      fontFamily: "'Barlow', sans-serif",
      fontSize: 13.5,
      fontWeight: muted ? 400 : 500,
      color: muted ? "rgba(10,15,46,0.58)" : "rgba(10,15,46,0.82)",
      lineHeight: 1.7,
      margin: "0 0 12px",
    }}>
      {children}
    </p>
  );
}

function StatBlock({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div style={{
      borderLeft: `2px solid ${GOLD}`,
      paddingLeft: 14,
      flex: "1 1 140px",
    }}>
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 28,
        fontWeight: 800,
        color: NAVY,
        lineHeight: 1,
        letterSpacing: "-0.01em",
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: GOLD,
        marginTop: 3,
      }}>
        {label}
      </div>
      {sub && (
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 11,
          color: "rgba(10,15,46,0.5)",
          marginTop: 2,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function ProductOverview() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = PRINT_STYLE;
    document.head.appendChild(style);
    document.title = "Product Overview — VaughnMartin Readiness OS";
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="print-page" style={{ minHeight: "100vh", background: IVORY, fontFamily: "'Barlow', sans-serif" }}>
      <StandardNav />
      {/* Top nav bar — hidden on print */}
      <div className="no-print" style={{
        background: NAVY,
        borderBottom: `1px solid ${GOLD}22`,
        padding: "12px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <button
          onClick={() => setLocation("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <VaughnMartinLogo size={32} />
        </button>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => window.print()}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: GOLD,
              color: NAVY,
              border: "none",
              padding: "9px 24px",
              cursor: "pointer",
              borderRadius: "0.15rem",
            }}
          >
            ↓ Save as PDF
          </button>
          <button
            onClick={() => setLocation("/request-access")}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: "transparent",
              color: "rgba(240,237,228,0.7)",
              border: "1px solid rgba(255,255,255,0.18)",
              padding: "9px 24px",
              cursor: "pointer",
              borderRadius: "0.15rem",
            }}
          >
            Founding Partner Program →
          </button>
        </div>
      </div>

      {/* Document body */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 40px 80px" }}>

        {/* Header */}
        <div className="print-section" style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 28 }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: TEAL,
                marginBottom: 10,
              }}>
                Product Overview · 2026
              </div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 40,
                fontWeight: 700,
                color: NAVY,
                margin: "0 0 12px",
                lineHeight: 1.1,
              }}>
                VaughnMartin<br />Readiness OS
              </h1>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(10,15,46,0.5)",
                marginBottom: 20,
              }}>
                Enterprise Readiness Infrastructure
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 19,
                fontStyle: "italic",
                color: NAVY,
                borderLeft: `3px solid ${GOLD}`,
                paddingLeft: 16,
                lineHeight: 1.5,
                maxWidth: 480,
              }}>
                "The response is ready before the trigger fires."
              </div>
            </div>
            <div style={{ flexShrink: 0, paddingTop: 4 }}>
              <VaughnMartinLogo size={72} />
            </div>
          </div>
          <Rule gold />
        </div>

        {/* §01 — The Problem */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 01 — The Operating Model Problem</SectionTag>
          <Heading>Enterprise work was designed without AI.</Heading>
          <Body>
            Committees, alignment cycles, and coordination delays exist because humans could not process information fast enough to act decisively. AI changed the constraint. Yet every vendor bolted AI onto the old model — faster spreadsheets, smarter summaries, better notes from the same slow meetings.
          </Body>
          <Body>
            VaughnMartin rebuilds from first principles. When a strategic trigger fires — a competitor moves, a regulator acts, a supply chain collapses — the average enterprise spends <strong>weeks to months</strong> just to mobilize: figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders. Execution has not even begun.
          </Body>
          <div style={{
            background: NAVY,
            color: "#fff",
            padding: "20px 24px",
            marginTop: 20,
            borderRadius: "0.15rem",
          }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 8,
            }}>
              The Thesis
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 18,
              fontStyle: "italic",
              lineHeight: 1.5,
            }}>
              Pre-staged Readiness Protocols replace real-time coordination.<br />
              Pattern detection replaces committee deliberation.<br />
              12-minute execution replaces 30-day alignment cycles.
            </div>
          </div>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §02 — The Platform */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 02 — Platform Overview</SectionTag>
          <Heading>180 Readiness Protocols. Pre-staged before the trigger fires.</Heading>
          <Body>
            Readiness OS is the coordination layer enterprises are missing. It continuously monitors signals across 39 live data sources, matches patterns against 231 strategic triggers, and stages execution assets before any trigger fires. When the moment hits, the response is already built.
          </Body>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, margin: "24px 0" }}>
            <StatBlock value="180" label="Readiness Protocols" sub="Core cross-industry library" />
            <StatBlock value="231" label="Detection Thresholds" sub="Continuously monitored" />
            <StatBlock value="12 min" label="Execution Head Start" sub="vs. 30-day mobilization" />
            <StatBlock value="3,600×" label="Execution Advantage" sub="30 days → 12 minutes" />
          </div>
          <Body muted>
            The 3,600× metric reflects a direct comparison: weeks to months (30 days conservative baseline) to mobilize after a trigger, versus 12 minutes when Readiness Protocols are pre-staged. This is not a speed advantage — it is a mobilization elimination advantage.
          </Body>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §03 — Three Domains */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 03 — Three Strategic Domains</SectionTag>
          <Heading>Every strategic situation maps to one of three domains.</Heading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
            {[
              {
                domain: "Growth & Positioning",
                count: 70,
                color: GOLD,
                description: "Market entry, competitive displacement, M&A response, partnership activation, brand positioning under pressure.",
                protocols: ["Competitor Displacement Sprint", "M&A Rapid Response", "Market Entry Acceleration", "Partnership Activation", "Brand Crisis Response"],
              },
              {
                domain: "Risk & Resilience",
                count: 71,
                color: TEAL,
                description: "Ransomware, regulatory action, supply chain disruption, energy grid failure, data breach, DOJ investigation, food safety recall.",
                protocols: ["Ransomware Response", "FDA Recall Protocol", "Supply Chain Collapse", "Data Breach Response", "DOJ Investigation Response"],
              },
              {
                domain: "Transformation",
                count: 39,
                color: "#7B9BC4",
                description: "Go-to-market acceleration, workforce transformation, operational model restructuring, technology platform migration.",
                protocols: ["GTM Acceleration Sprint", "Workforce Transformation", "Platform Migration", "Operating Model Redesign", "Digital Transformation"],
              },
            ].map((d) => (
              <div key={d.domain} style={{
                border: `1px solid rgba(10,15,46,0.10)`,
                borderTop: `3px solid ${d.color}`,
                padding: "18px 16px",
                background: "#fff",
                borderRadius: "0.15rem",
              }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: d.color,
                  marginBottom: 4,
                }}>
                  {d.domain}
                </div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: NAVY,
                  marginBottom: 8,
                }}>
                  {d.count} Protocols
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12,
                  color: "rgba(10,15,46,0.65)",
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}>
                  {d.description}
                </div>
                <div style={{ borderTop: `1px solid rgba(10,15,46,0.07)`, paddingTop: 10 }}>
                  {d.protocols.map((p) => (
                    <div key={p} style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 11,
                      color: "rgba(10,15,46,0.55)",
                      lineHeight: 1.7,
                    }}>
                      · {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Body muted style={{ marginTop: 12 }}>
            21 Compound Protocols (IDs 181–210 in the extended library) cover simultaneous multi-domain triggers — an activist investor campaign coinciding with a regulatory inquiry, a supply chain collapse triggering both operational and market positioning responses.
          </Body>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §04 — IDEA Framework */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 04 — The IDEA Framework</SectionTag>
          <Heading>Four phases. One continuous loop.</Heading>
          <Body>
            Every activation — from signal detection to close-out — runs through the IDEA chain. The framework is not a methodology. It is an operating sequence that replaces the ad hoc coordination that typically consumes the first 30 days after a trigger fires.
          </Body>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(10,15,46,0.08)", border: "1px solid rgba(10,15,46,0.08)", marginTop: 20 }}>
            {[
              { letter: "I", phase: "Identify", detail: "Signal detection across 39 live sources. 231 detection thresholds scored in real time. Continuous monitoring — no manual triage." },
              { letter: "D", phase: "Design", detail: "Protocol recommendation engine maps detected triggers to pre-staged Readiness Protocols. Compound threat analysis for multi-domain triggers." },
              { letter: "E", phase: "Execute", detail: "Tasks pre-assigned to stakeholders. Documents pre-drafted. War Room staged. Executive authorization required before activation proceeds." },
              { letter: "A", phase: "Advance", detail: "ADVANCE 2.0 closes the loop: every activation generates preparation updates. Causal hypotheses proven or disproven after the next activation." },
            ].map((item) => (
              <div key={item.letter} style={{ background: "#fff", padding: "20px 16px" }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: GOLD,
                  lineHeight: 1,
                  marginBottom: 4,
                }}>
                  {item.letter}
                </div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: NAVY,
                  marginBottom: 8,
                }}>
                  {item.phase}
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12,
                  color: "rgba(10,15,46,0.65)",
                  lineHeight: 1.65,
                }}>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §05 — How It Executes */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 05 — Execution Sequence</SectionTag>
          <Heading>From trigger detection to authorized execution in 12 minutes.</Heading>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 1 }}>
            {[
              { t: "T+0:00", label: "Signal Detected", body: "System-detected event matches a detection threshold. Continuous monitoring against 231 thresholds — no human triage required." },
              { t: "T+0:30", label: "Protocol Matched", body: "The relevant Readiness Protocol is identified and staged. All pre-built assets are surfaced: tasks, stakeholders, documents, escalation paths." },
              { t: "T+2:00", label: "Tasks Pre-Assigned", body: "Role-based task distribution to named stakeholders. Dependencies mapped. No coordination meeting needed — assignments are pre-staged." },
              { t: "T+5:00", label: "Stakeholders Notified", body: "Automated briefings dispatched. Each stakeholder receives context, their specific tasks, and escalation authority — before the executive authorizes." },
              { t: "T+10:00", label: "Executive Review", body: "The War Room is staged. The executive reviews the pre-built response plan, modifies if needed, and authorizes execution. Human authority preserved at every step." },
              { t: "T+12:00", label: "Execution Authorized", body: "Full execution begins. The 3,600× head start over traditional mobilization is now locked in. Competing enterprises are still scheduling their first alignment meeting." },
            ].map((step, i) => (
              <div key={step.t} style={{
                display: "flex",
                gap: 20,
                background: i % 2 === 0 ? "#fff" : "#FAFAF8",
                padding: "14px 18px",
                borderLeft: `3px solid ${i === 5 ? TEAL : i === 4 ? GOLD : "rgba(10,15,46,0.12)"}`,
              }}>
                <div style={{ flexShrink: 0, width: 64 }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: i >= 4 ? GOLD : "rgba(10,15,46,0.35)",
                  }}>
                    {step.t}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: NAVY,
                    marginBottom: 3,
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 12.5,
                    color: "rgba(10,15,46,0.65)",
                    lineHeight: 1.6,
                  }}>
                    {step.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §06 — ADVANCE Loop */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 06 — ADVANCE 2.0: Closed-Loop Learning</SectionTag>
          <Heading>Every activation makes the next one faster.</Heading>
          <Body>
            ADVANCE 2.0 is the compounding moat. Every close-out generates preparation updates with a causal hypothesis — a specific, measurable prediction about the next activation. After the next activation, the system classifies each hypothesis as proven or disproven. Over time, the protocol library accumulates evidence-backed improvements no competitor can replicate without the activation history.
          </Body>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
            {[
              { label: "Learning Velocity Index", body: "Tracks protocol improvements applied, hypotheses proven, and total minutes saved across the entire activation history." },
              { label: "Causal Classification", body: "Each hypothesis is classified as proven, disproven, or pending. Only proven improvements become permanent protocol updates." },
              { label: "Auto-Apply Queue", body: "Low-risk calibrations (signal thresholds, timing adjustments) apply automatically. Ownership and protocol changes require executive authorization." },
              { label: "Moat Metric", body: "Months required for a competitor to rebuild equivalent evidence — calculated from activation volume and hypothesis confirmation rate." },
            ].map((item) => (
              <div key={item.label} style={{
                background: "#fff",
                border: `1px solid rgba(10,15,46,0.08)`,
                borderLeft: `3px solid ${TEAL}`,
                padding: "16px 18px",
              }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: TEAL,
                  marginBottom: 6,
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12.5,
                  color: "rgba(10,15,46,0.7)",
                  lineHeight: 1.6,
                }}>
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §07 — Microsoft Positioning */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 07 — Microsoft Ecosystem Positioning</SectionTag>
          <Heading>Every enterprise has Microsoft's AI stack. None have the operating model to use it.</Heading>
          <Body>
            Microsoft 365 Copilot, Azure OpenAI, Teams, and Entra are table-stakes in every enterprise. Readiness OS is the coordination layer above that investment — not a replacement, an orchestrator. It provides the pre-staged protocols that tell the Microsoft stack <em>what</em> to do and <em>when</em> to do it at the moment a strategic trigger fires.
          </Body>
          <div style={{
            background: NAVY,
            padding: "22px 24px",
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            borderRadius: "0.15rem",
          }}>
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.7)",
                marginBottom: 10,
              }}>
                What Microsoft Provides
              </div>
              {["Microsoft 365 Copilot", "Azure OpenAI Service", "Microsoft Teams", "Microsoft Entra (Identity)", "Copilot Studio"].map((item) => (
                <div key={item} style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12.5,
                  color: "rgba(240,237,228,0.75)",
                  lineHeight: 1.8,
                }}>
                  · {item}
                </div>
              ))}
            </div>
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(43,138,110,0.9)",
                marginBottom: 10,
              }}>
                What Readiness OS Adds
              </div>
              {[
                "180 pre-staged Readiness Protocols",
                "231 detection threshold library",
                "Executive authorization layer",
                "Closed-loop ADVANCE learning",
                "12-minute execution sequence",
              ].map((item) => (
                <div key={item} style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12.5,
                  color: "rgba(240,237,228,0.75)",
                  lineHeight: 1.8,
                }}>
                  · {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §08 — Comparison */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 08 — Old Model vs. Readiness OS</SectionTag>
          <Heading>The 30-day mobilization cycle, eliminated.</Heading>
          <div style={{ marginTop: 20, border: "1px solid rgba(10,15,46,0.10)", overflow: "hidden", borderRadius: "0.15rem" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              background: NAVY,
              padding: "10px 16px",
              gap: 16,
            }}>
              {["Capability", "Traditional Enterprise", "Readiness OS"].map((h) => (
                <div key={h} style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: h === "Readiness OS" ? GOLD : "rgba(240,237,228,0.55)",
                }}>
                  {h}
                </div>
              ))}
            </div>
            {[
              ["Trigger monitoring", "Manual / periodic", "Automatic — continuous monitoring"],
              ["Protocol readiness", "Built after trigger fires", "Pre-staged before the trigger fires"],
              ["Task assignment", "First alignment meeting", "Pre-staged — 180 Readiness Protocols ready"],
              ["Stakeholder notification", "Email chains, days later", "Automated at trigger point"],
              ["Executive authorization", "Days to weeks", "12 minutes after trigger detection"],
              ["Post-activation learning", "Informal, undocumented", "Causal loop — proven improvements"],
              ["Mobilization time", "30 days (conservative)", "12 minutes"],
            ].map(([cap, old, rOS], i) => (
              <div key={cap} style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                padding: "11px 16px",
                gap: 16,
                background: i % 2 === 0 ? "#fff" : "#FAFAF8",
                borderTop: "1px solid rgba(10,15,46,0.06)",
              }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12.5, fontWeight: 600, color: NAVY }}>{cap}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(10,15,46,0.45)" }}>{old}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: TEAL }}>{rOS}</div>
              </div>
            ))}
          </div>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §09 — Pricing */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 09 — Platform Tiers</SectionTag>
          <Heading>Three deployment scales. One operating model.</Heading>
          <Body muted>
            All tiers include the full 180-protocol library, continuous signal monitoring, the ADVANCE learning loop, and executive authorization controls. Tiers differ by organizational scale, customization depth, and dedicated support commitment.
          </Body>

          <div style={{ marginTop: 20 }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(10,15,46,0.4)",
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: "1px solid rgba(10,15,46,0.08)",
            }}>
              Enterprise Scale
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
              {[
                { name: "Core", price: "$150,000", period: "/ year", note: "Full protocol library · Up to 5 activations/year · Standard onboarding" },
                { name: "Foresight", price: "$250,000", period: "/ year", note: "Core + predictive scoring · Up to 15 activations/year · Dedicated CSM", highlight: true },
                { name: "Enterprise", price: "$450,000", period: "/ year", note: "Full platform · Unlimited activations · Custom protocol development · SLA" },
              ].map((tier) => (
                <div key={tier.name} style={{
                  background: tier.highlight ? NAVY : "#fff",
                  border: `1px solid ${tier.highlight ? "transparent" : "rgba(10,15,46,0.10)"}`,
                  padding: "18px 16px",
                  borderRadius: "0.15rem",
                }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: tier.highlight ? GOLD : "rgba(10,15,46,0.45)",
                    marginBottom: 6,
                  }}>
                    {tier.name}
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 26,
                    fontWeight: 700,
                    color: tier.highlight ? "#fff" : NAVY,
                    lineHeight: 1,
                  }}>
                    {tier.price}
                    <span style={{ fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: tier.highlight ? "rgba(240,237,228,0.5)" : "rgba(10,15,46,0.4)", marginLeft: 4 }}>{tier.period}</span>
                  </div>
                  <div style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 11.5,
                    color: tier.highlight ? "rgba(240,237,228,0.65)" : "rgba(10,15,46,0.55)",
                    marginTop: 10,
                    lineHeight: 1.55,
                  }}>
                    {tier.note}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(10,15,46,0.4)",
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: "1px solid rgba(10,15,46,0.08)",
            }}>
              Growth Scale
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { name: "Ready", price: "$75,000", period: "/ year", note: "Up to 50 users · Core library · 3 activations/year" },
                { name: "Responsive", price: "$150,000", period: "/ year", note: "Up to 200 users · Full library · 8 activations/year" },
                { name: "Orchestrated", price: "$250,000", period: "/ year", note: "Up to 500 users · Custom protocols · 15 activations/year" },
              ].map((tier) => (
                <div key={tier.name} style={{
                  background: "#fff",
                  border: "1px solid rgba(10,15,46,0.10)",
                  padding: "16px 16px",
                  borderRadius: "0.15rem",
                }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(10,15,46,0.45)",
                    marginBottom: 6,
                  }}>
                    {tier.name}
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: NAVY,
                    lineHeight: 1,
                  }}>
                    {tier.price}
                    <span style={{ fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 500, color: "rgba(10,15,46,0.4)", marginLeft: 4 }}>{tier.period}</span>
                  </div>
                  <div style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 11.5,
                    color: "rgba(10,15,46,0.55)",
                    marginTop: 8,
                    lineHeight: 1.55,
                  }}>
                    {tier.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Founding Partner */}
            <div style={{
              border: `1px solid ${GOLD}55`,
              background: `${GOLD}08`,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              borderRadius: "0.15rem",
            }}>
              <div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: GOLD,
                  marginBottom: 4,
                }}>
                  Founding Partner Program · 2026 Cohort
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12.5,
                  color: "rgba(10,15,46,0.7)",
                  lineHeight: 1.6,
                  maxWidth: 480,
                }}>
                  90-day structured validation partnership. Deferred platform fee. In exchange for defined onboarding milestones, a day-60 progress conversation, and a day-90 conversion conversation plus a reference regardless of conversion. Two organizations. 2026 cohort.
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: NAVY,
                }}>
                  $75,000
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 11,
                  color: "rgba(10,15,46,0.45)",
                }}>
                  deferred · 90 days
                </div>
              </div>
            </div>
          </div>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §10 — Technology */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 10 — Technology Stack</SectionTag>
          <Heading>Enterprise-grade infrastructure. Production-deployed.</Heading>
          <Body>
            Readiness OS is not a prototype. The platform has been in active development and is production-deployed at vaughnmartin.com. The technology stack reflects enterprise deployment requirements: cloud-native, secure, scalable.
          </Body>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            {[
              { cat: "Frontend", items: ["React 18 · TypeScript · Vite", "TanStack Query v5 · Framer Motion", "Radix UI · shadcn/ui · Tailwind CSS"] },
              { cat: "Backend", items: ["Node.js · Express.js · TypeScript", "PostgreSQL (Neon serverless) · Drizzle ORM", "Socket.IO WebSocket · Background job queue"] },
              { cat: "AI Services", items: ["Azure OpenAI (primary)", "OpenAI GPT-4o (fallback)", "Multi-agent IDEA Framework orchestration"] },
              { cat: "Infrastructure", items: ["Replit enterprise-grade cloud deployment", "Replit OIDC + Passport.js authentication", "Role-based access control · Email allowlist gating"] },
            ].map((block) => (
              <div key={block.cat} style={{
                background: "#fff",
                border: "1px solid rgba(10,15,46,0.08)",
                padding: "16px 18px",
                borderRadius: "0.15rem",
              }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(10,15,46,0.4)",
                  marginBottom: 10,
                }}>
                  {block.cat}
                </div>
                {block.items.map((item) => (
                  <div key={item} style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 12.5,
                    color: "rgba(10,15,46,0.72)",
                    lineHeight: 1.8,
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §11 — The Guarantee */}
        <div className="print-section" style={{ marginBottom: 44 }}>
          <SectionTag>§ 11 — The Performance Guarantee</SectionTag>
          <Heading>If we can't prove the claim in your environment, you don't pay.</Heading>
          <Body>
            The first live activation is measured. If the first Readiness Protocol execution exceeds 20 minutes, the engagement is extended at no additional charge until the 12-minute target is achieved — or the program fee is refunded in full.
          </Body>
          <Body>
            This guarantee exists because the claim is measurable and the infrastructure is production-ready. The response is either ready before the trigger fires or it is not. We are confident it will be.
          </Body>
        </div>

        <Rule />
        <div style={{ marginBottom: 44 }} />

        {/* §12 — CTA */}
        <div className="print-section" style={{
          background: NAVY,
          padding: "36px 32px",
          borderRadius: "0.15rem",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 10,
          }}>
            Apply for Founding Partner Access
          </div>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            color: "rgba(240,237,228,0.65)",
            marginBottom: 24,
            lineHeight: 1.7,
            maxWidth: 500,
            margin: "0 auto 24px",
          }}>
            Two Founding Partner positions are available for the 2026 cohort. 90-day structured validation. The 12-minute target is guaranteed or the program fee is refunded.
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: GOLD,
          }}>
            vaughnmartin.com · info@vaughnmartin.com
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 48,
          paddingTop: 20,
          borderTop: "1px solid rgba(10,15,46,0.10)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 11,
            color: "rgba(10,15,46,0.35)",
          }}>
            VaughnMartin · Readiness OS · Confidential — For Authorized Recipients Only
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(10,15,46,0.3)",
          }}>
            2026 Product Overview
          </div>
        </div>

      </div>
    </div>
  );
}
