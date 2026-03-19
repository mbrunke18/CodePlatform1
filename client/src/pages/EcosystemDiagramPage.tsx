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
      <PageHero
        eyebrow="Architecture Overview"
        title="Execution OS in the Microsoft Ecosystem"
        subtitle="Execution OS sits as the strategic command layer above the Microsoft Full Stack AI ecosystem — orchestrating models, agents, and productivity tools into a 12-minute execution response."
        size="md"
      />

      {/* Main Diagram */}
      <section style={{ background: "#060B1E", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <ExecutionOSMicrosoftDiagram />
        </div>
      </section>

      {/* Three-point explanation */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            textAlign: "center",
            fontFamily: "'DM Mono',monospace",
            fontSize: 9, letterSpacing: 4, color: GOLD,
            textTransform: "uppercase", marginBottom: 14,
          }}>
            How the layers work together
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(28px,4vw,44px)", fontWeight: 600,
            color: NAVY, textAlign: "center", marginBottom: 48, lineHeight: 1.2,
          }}>
            A command layer, not a replacement.
          </h2>

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
                title: "Execution OS provides the strategic layer",
                body: "Sitting above the Microsoft stack, Execution OS monitors 221 executive triggers, maps them to 170 pre-staged playbooks, and fires coordinated responses in 12 minutes — inside Teams, M365, and Azure.",
                color: TEAL,
              },
              {
                phase: "03",
                title: "Humans retain all decision authority",
                body: "AI handles monitoring and recommendation. Every playbook activation is a human decision. Execution OS makes those decisions faster, more informed, and pre-coordinated — not autonomous.",
                color: GOLD,
              },
            ].map(({ phase, title, body, color }) => (
              <div key={phase} style={{
                padding: 32, borderRadius: 12,
                border: `1px solid ${color}22`,
                background: `${color}06`,
              }}>
                <div style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 9, letterSpacing: 3, color, fontWeight: 700,
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
                  fontFamily: "'Inter',sans-serif",
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
              { name: "Microsoft Teams", role: "Fires war room notifications to executives on playbook activation — no separate tool required", icon: "⬡", color: "#6264A7" },
              { name: "Copilot Studio", role: "Custom connector lets execs query playbooks and briefings directly from Microsoft 365 Copilot", icon: "◉", color: "#5BA3E8" },
              { name: "Microsoft Entra", role: "Stamps every AI agent action with an identity audit trail — full governance and SSO", icon: "◎", color: "#107C10" },
              { name: "Power Platform", role: "Webhook hooks route trigger alerts into existing Power Automate flows and enterprise workflows", icon: "◆", color: "#742774" },
            ].map(({ name, role, icon, color }) => (
              <div key={name} style={{
                padding: "24px 20px", borderRadius: 10, background: "#fff",
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
                  fontFamily: "'Inter',sans-serif",
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
          fontSize: 9, letterSpacing: 4, color: GOLD,
          textTransform: "uppercase", marginBottom: 16,
        }}>
          Ready to deploy
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(28px,4vw,48px)", fontWeight: 600,
          color: IVORY, lineHeight: 1.2, marginBottom: 24,
        }}>
          Activate Execution OS on your Microsoft stack.
        </h2>
        <p style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: 15, color: "rgba(240,237,228,0.55)",
          maxWidth: 520, margin: "0 auto 36px",
        }}>
          We deploy inside your existing Microsoft environment. No migration. No new portals.
          The strategic layer your enterprise is missing.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setLocation("/pilot-program")}
            style={{
              background: GOLD, color: NAVY, border: "none",
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "14px 36px", borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Request a Pilot
          </button>
          <button
            onClick={() => setLocation("/integrations")}
            style={{
              background: "transparent", color: IVORY,
              border: `1px solid rgba(240,237,228,0.25)`,
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 13, padding: "14px 28px", borderRadius: 6,
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
