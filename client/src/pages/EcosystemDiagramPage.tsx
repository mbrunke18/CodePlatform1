import PageLayout from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import ExecutionOSMicrosoftDiagram from "@/components/ExecutionOSMicrosoftDiagram";
import { useLocation } from "wouter";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

export default function EcosystemDiagramPage() {
  const [, setLocation] = useLocation();

  return (
    <PageLayout>
      <h1 className="sr-only">Platform Ecosystem Architecture — Readiness OS</h1>
      <PageHero
        eyebrow="Architecture Overview"
        title="Readiness OS in the Microsoft Ecosystem"
        subtitle="Readiness OS sits as the strategic command layer above the Microsoft Full Stack AI ecosystem — orchestrating models, agents, and productivity tools into a 12-minute execution response."
        size="md"
      />

      {/* Main Diagram */}
      <section style={{ background: "#060B1E", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <ExecutionOSMicrosoftDiagram />
        </div>
      </section>

      {/* Two-Layer Architecture Clarity */}
      <section style={{ background: "#F8F7F4", padding: "72px 24px", borderTop: `1px solid rgba(201,168,76,0.15)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "5px 16px", border: `1px solid rgba(201,168,76,0.3)`, background: "rgba(201,168,76,0.07)" }}>
              <div style={{ width: 5, height: 5, background: GOLD }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, fontWeight: 700 }}>
                Two layers. One enterprise.
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 600, color: NAVY, marginBottom: 16, lineHeight: 1.2 }}>
              Microsoft governs the AI tools layer.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Readiness OS governs the response layer.</em>
            </h2>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: "#4B5563", maxWidth: 640, margin: "0 auto", lineHeight: 1.7 }}>
              Microsoft is building the enterprise control plane for AI-assisted developer work — who can use Copilot, what policies apply, how much it costs. That layer and Readiness OS sit on completely different floors of the same building.
            </p>
          </div>

          {/* Layer stack diagram */}
          <div style={{ maxWidth: 720, margin: "0 auto 48px", display: "flex", flexDirection: "column" as const, gap: 3 }}>
            {/* Top: Readiness OS */}
            <div style={{ background: NAVY, border: `2px solid ${GOLD}`, padding: "28px 36px", position: "relative" as const }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD, fontWeight: 700, marginBottom: 8 }}>
                    LAYER 2 — STRATEGIC RESPONSE
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#F0EDE4", marginBottom: 6 }}>
                    Readiness OS
                  </div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "rgba(240,237,228,0.65)", lineHeight: 1.5 }}>
                    When a trigger fires — who does what, authorized by whom, executed in 12 minutes. 180 Readiness Protocols pre-staged before the signal appears.
                  </div>
                </div>
                <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: GOLD }}>12</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "rgba(240,237,228,0.45)", textTransform: "uppercase" as const }}>minutes</div>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                {["Trigger Detection", "Protocol Matching", "Executive Authorization", "12-Min Execution", "Institutional Memory"].map(tag => (
                  <span key={tag} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "3px 10px", border: `1px solid rgba(201,168,76,0.3)`, color: GOLD }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Connector arrow */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: "8px 0" }}>
              <div style={{ height: 1, flex: 1, background: "rgba(10,15,46,0.12)" }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#9CA3AF", textTransform: "uppercase" as const }}>Orchestrates ↕ Sits above</span>
              <div style={{ height: 1, flex: 1, background: "rgba(10,15,46,0.12)" }} />
            </div>

            {/* Middle: Microsoft AI Execution Layer */}
            <div style={{ background: "#132558", padding: "24px 36px", border: "1px solid rgba(0,120,212,0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#5BA3E8", fontWeight: 700, marginBottom: 8 }}>
                    LAYER 1 — AI EXECUTION CONTROL (MICROSOFT)
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "#F0EDE4", marginBottom: 6 }}>
                    GitHub Copilot CLI · Copilot Studio · Entra · Policy Engine
                  </div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "rgba(240,237,228,0.55)", lineHeight: 1.5 }}>
                    Governs AI-assisted developer work — who can use Copilot, what policies apply, cost control, auditability. The control plane for AI tools usage.
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.15em", color: "#5BA3E8", padding: "4px 10px", border: "1px solid rgba(91,163,232,0.3)" }}>
                    Complementary
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                {["Policy Check", "Approval Gates", "Cost Control", "Auditability", "Identity Governance"].map(tag => (
                  <span key={tag} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "3px 10px", border: "1px solid rgba(91,163,232,0.2)", color: "rgba(91,163,232,0.8)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Connector */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: "8px 0" }}>
              <div style={{ height: 1, flex: 1, background: "rgba(10,15,46,0.12)" }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#9CA3AF", textTransform: "uppercase" as const }}>Built on top of</span>
              <div style={{ height: 1, flex: 1, background: "rgba(10,15,46,0.12)" }} />
            </div>

            {/* Bottom: Microsoft Full Stack */}
            <div style={{ background: "#0F1C3F", padding: "20px 36px", border: "1px solid rgba(0,120,212,0.2)", opacity: 0.9 }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(91,163,232,0.6)", fontWeight: 700, marginBottom: 8 }}>
                LAYER 0 — MICROSOFT FULL STACK
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                {["Azure OpenAI", "Microsoft Teams", "SharePoint", "Microsoft Entra", "Power Platform", "Microsoft 365"].map(t => (
                  <span key={t} style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: "rgba(240,237,228,0.4)", fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Key distinction callout */}
          <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <div style={{ padding: "24px 28px", background: "#132558", border: "1px solid rgba(0,120,212,0.2)" }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#5BA3E8", marginBottom: 10, fontWeight: 700 }}>Microsoft's Layer Governs</div>
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "rgba(240,237,228,0.65)", lineHeight: 1.6, margin: 0 }}>
                <em>"Can the AI tool run this task?"</em> — policy, approval, cost, audit for developer AI workflows.
              </p>
            </div>
            <div style={{ padding: "24px 28px", background: NAVY, border: `1px solid rgba(201,168,76,0.25)` }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10, fontWeight: 700 }}>Readiness OS Governs</div>
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "rgba(240,237,228,0.65)", lineHeight: 1.6, margin: 0 }}>
                <em>"When the trigger fires — who does what, in what order, authorized by whom, executed in 12 minutes?"</em>
              </p>
            </div>
          </div>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#6B7280", textAlign: "center" as const, marginTop: 20, fontStyle: "italic" }}>
            Different layer. Different stakes. Same enterprise. No procurement conflict.
          </p>
        </div>
      </section>

      {/* Three-point explanation */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            textAlign: "center",
            fontFamily: "'DM Mono',monospace",
            fontSize: 10, letterSpacing: 4, color: GOLD,
            textTransform: "uppercase", marginBottom: 14,
          }}>
            How the layers work together
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(28px,4vw,44px)", fontWeight: 600,
            color: NAVY, textAlign: "center", marginBottom: 24, lineHeight: 1.2,
          }}>
            A command layer, not a replacement.
          </h2>

          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: "#374151", lineHeight: 1.8, maxWidth: 720, margin: "0 auto 48px", textAlign: "center" }}>
            Technology amplifies whatever system it is applied to. If the coordination architecture does not exist before the trigger fires, AI accelerates the gap, not the response. The operating model layer has to be built before the signal appears.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              {
                phase: "01",
                title: "Microsoft provides the AI infrastructure",
                body: "Azure OpenAI, Semantic Kernel, Copilot Studio, and 248+ data integrations form the technology foundation — models, agents, and cloud services your enterprise already pays for.",
                color: "#0078D4",
              },
              {
                phase: "02",
                title: "Readiness OS provides the strategic layer",
                body: "Sitting above the Microsoft stack, Readiness OS monitors 221 executive triggers, maps them to 180 pre-staged Readiness Protocols, and fires coordinated responses in 12 minutes — inside Teams, M365, and Azure.",
                color: TEAL,
              },
              {
                phase: "03",
                title: "Humans retain all decision authority",
                body: "AI handles monitoring and recommendation. Every Readiness Protocol activation is a human decision. Readiness OS makes those decisions faster, more informed, and pre-coordinated — not autonomous.",
                color: GOLD,
              },
            ].map(({ phase, title, body, color }) => (
              <div key={phase} style={{
                padding: 32, borderRadius: 0,
                border: `1px solid ${color}22`,
                background: `${color}06`,
              }}>
                <div style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 10, letterSpacing: 3, color, fontWeight: 700,
                  marginBottom: 12,
                }}>
                  STEP {phase}
                </div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 22, fontWeight: 600, color: NAVY,
                  lineHeight: 1.3, marginBottom: 12,
                }}>
                  {title}
                </h3>
                <p style={{
                  fontFamily: "'Barlow',sans-serif",
                  fontSize: 14, color: "#374151", lineHeight: 1.7, fontWeight: 400,
                }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration callouts */}
      <section style={{ background: "#F8F7F4", padding: "56px 24px", borderTop: `1px solid ${GOLD}18` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(24px,3vw,36px)", fontWeight: 600,
            color: NAVY, textAlign: "center", marginBottom: 36,
          }}>
            Five Microsoft integrations. One execution system.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {[
              { name: "Azure AI", role: "Runs the 4-agent IDEA Framework in parallel — IDENTIFY · DETECT · EXECUTE · ADVANCE", icon: "◈", color: "#0078D4" },
              { name: "Microsoft Teams", role: "Fires war room notifications to executives on Readiness Protocol activation — no separate tool required", icon: "⬡", color: "#6264A7" },
              { name: "Copilot Studio", role: "Custom connector lets execs query Readiness Protocols and briefings directly from Microsoft 365 Copilot", icon: "◉", color: "#5BA3E8" },
              { name: "Microsoft Entra", role: "Stamps every AI agent action with an identity audit trail — full governance and SSO", icon: "◎", color: "#107C10" },
              { name: "Power Platform", role: "Webhook hooks route trigger alerts into existing Power Automate flows and enterprise workflows", icon: "◆", color: "#742774" },
            ].map(({ name, role, icon, color }) => (
              <div key={name} style={{
                padding: "24px 20px", borderRadius: 0, background: "#fff",
                border: `1px solid ${color}25`,
                boxShadow: `0 2px 12px ${color}10`,
              }}>
                <div style={{ fontSize: 24, color, marginBottom: 10 }}>{icon}</div>
                <div style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: 13, fontWeight: 700, color: NAVY,
                  letterSpacing: 0.5, marginBottom: 8,
                }}>
                  {name}
                </div>
                <p style={{
                  fontFamily: "'Barlow',sans-serif",
                  fontSize: 12, color: "#6B7280", lineHeight: 1.6, fontWeight: 400,
                }}>
                  {role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: NAVY, padding: "64px 24px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 10, letterSpacing: 4, color: GOLD,
          textTransform: "uppercase", marginBottom: 16,
        }}>
          Ready to deploy
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(28px,4vw,48px)", fontWeight: 600,
          color: IVORY, lineHeight: 1.2, marginBottom: 24,
        }}>
          Activate Readiness OS on your Microsoft stack.
        </h2>
        <p style={{
          fontFamily: "'Barlow',sans-serif",
          fontSize: 15, color: "rgba(240,237,228,0.55)",
          maxWidth: 520, margin: "0 auto 36px",
        }}>
          We deploy inside your existing Microsoft environment. No migration. No new portals.
          The strategic layer your enterprise is missing.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setLocation("/founding-partner-program")}
            style={{
              background: GOLD, color: NAVY, border: "none",
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "14px 36px", borderRadius: 0,
              cursor: "pointer",
            }}
          >
            Request Founding Partner Access
          </button>
          <button
            onClick={() => setLocation("/integrations")}
            style={{
              background: "transparent", color: IVORY,
              border: `1px solid rgba(240,237,228,0.25)`,
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 13, padding: "14px 28px", borderRadius: 0,
              cursor: "pointer",
            }}
          >
            View All Integrations
          </button>
        </div>
      </section>
    </PageLayout>
  );
}
