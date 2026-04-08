import PageLayout from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { useLocation } from "wouter";
import EnterpriseAIFrameworkDiagram from "@/components/EnterpriseAIFrameworkDiagram";
import HofmannFrameworkDiagram from "@/components/HofmannFrameworkDiagram";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const IVORY = "#F0EDE4";

const ecosystems = [
  {
    name: "Microsoft",
    tagline: "Every enterprise has Microsoft's AI stack. None have the operating model to use it.",
    color: "#0078D4",
    path: "/ecosystem",
    tools: ["Azure OpenAI", "Teams", "Copilot Studio", "Microsoft Entra", "Power Platform"],
    gap: "AI stack deployed. Strategic coordination layer: missing.",
  },
  {
    name: "Google Cloud & Workspace",
    tagline: "AI everywhere, coordination nowhere.",
    color: "#4285F4",
    path: "/ecosystem/google",
    tools: ["Gemini", "Vertex AI", "BigQuery", "Workspace", "Pub/Sub"],
    gap: "World-class AI models. No crisis mobilization layer.",
  },
  {
    name: "Salesforce",
    tagline: "Every department automated, nobody orchestrated.",
    color: "#00A1E0",
    path: "/ecosystem/salesforce",
    tools: ["Einstein GPT", "Flow", "MuleSoft", "Slack", "Tableau"],
    gap: "Departments siloed. Cross-functional execution still broken.",
  },
  {
    name: "AWS",
    tagline: "Infinite infrastructure, zero strategic coordination.",
    color: "#FF9900",
    path: "/ecosystem/aws",
    tools: ["Bedrock", "EventBridge", "Step Functions", "SNS", "Cognito"],
    gap: "Cloud-native everything. Executives still coordinate by email.",
  },
  {
    name: "SAP / Oracle ERP",
    tagline: "Runs the business, can't run the response.",
    color: "#0070B8",
    path: "/ecosystem/sap",
    tools: ["S/4HANA", "Oracle Cloud ERP", "Ariba", "SuccessFactors", "SAP BTP"],
    gap: "Every transaction captured. No executive mobilization capability.",
  },
  {
    name: "ServiceNow",
    tagline: "Workflows for IT, not strategy.",
    color: "#00B89C",
    path: "/ecosystem/servicenow",
    tools: ["Flow Designer", "Integration Hub", "Now Assist", "CMDB", "SecOps"],
    gap: "IT tickets resolved fast. Strategic crises still run on meetings.",
  },
  {
    name: "Workday / HR Tech",
    tagline: "Manages your people, can't mobilize them.",
    color: "#FA6400",
    path: "/ecosystem/workday",
    tools: ["HCM", "People Analytics", "Orchestrate", "Adaptive Planning", "Prism"],
    gap: "Full workforce visibility. Zero cross-functional crisis mobilization.",
  },
];

export default function EcosystemsHub() {
  const [, setLocation] = useLocation();

  return (
    <PageLayout>
      <PageHero
        eyebrow="Enterprise Ecosystem Architecture"
        title="Every major stack. One missing layer."
        subtitle="Every enterprise has invested billions in AI infrastructure. Microsoft, Google, Salesforce, AWS, SAP, ServiceNow, Workday — none of them built the coordination layer that turns AI capabilities into strategic action in 12 minutes."
        size="lg"
      />

      {/* Thesis strip */}
      <section style={{ background: NAVY, padding: "32px 24px", textAlign: "center" }}>
        <p style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 600,
          color: IVORY, lineHeight: 1.4, maxWidth: 820, margin: "0 auto",
        }}>
          "You bought the stack. Nobody redesigned how work flows through it."
        </p>
        <div style={{
          marginTop: 16, fontFamily: "'DM Mono',monospace",
          fontSize: 10, letterSpacing: "0.22em", color: GOLD,
          textTransform: "uppercase", opacity: 0.8,
        }}>
          Command OS — The operating model layer above every enterprise stack
        </div>
      </section>

      {/* Enterprise AI Framework Diagram */}
      <section style={{ background: "#F8F7F4", padding: "56px 24px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            textAlign: "center", marginBottom: 28,
            fontFamily: "'DM Mono',monospace", fontSize: 10,
            letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase",
          }}>
            The coordination layer all 7 stacks are missing
          </div>
          <EnterpriseAIFrameworkDiagram />
        </div>
      </section>

      {/* Ecosystem cards grid */}
      <section style={{ background: "#F8F7F4", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            textAlign: "center", marginBottom: 48,
            fontFamily: "'DM Mono',monospace", fontSize: 10,
            letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase",
          }}>
            Select your enterprise stack
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}>
            {ecosystems.map((eco) => (
              <div
                key={eco.name}
                onClick={() => setLocation(eco.path)}
                style={{
                  background: "#fff",
                  border: `1px solid ${eco.color}22`,
                  borderTop: `3px solid ${eco.color}`,
                  borderRadius: 12,
                  padding: 28,
                  cursor: "pointer",
                  transition: "box-shadow 0.18s, transform 0.18s",
                  boxShadow: `0 2px 12px ${eco.color}0A`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${eco.color}22`;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 12px ${eco.color}0A`;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                      color: eco.color, textTransform: "uppercase", marginBottom: 6,
                    }}>
                      Ecosystem
                    </div>
                    <h3 style={{
                      fontFamily: "'Barlow Condensed',sans-serif",
                      fontSize: 22, fontWeight: 700, color: NAVY,
                      letterSpacing: 0.3, margin: 0, lineHeight: 1.1,
                    }}>
                      {eco.name}
                    </h3>
                  </div>
                  <div style={{
                    background: `${eco.color}14`, border: `1px solid ${eco.color}33`,
                    borderRadius: 6, padding: "4px 10px",
                    fontFamily: "'DM Mono',monospace", fontSize: 10,
                    color: eco.color, fontWeight: 700, letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                  }}>
                    View Diagram →
                  </div>
                </div>

                {/* Tagline */}
                <p style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 16, fontWeight: 600, color: NAVY,
                  lineHeight: 1.4, marginBottom: 16, fontStyle: "italic",
                }}>
                  "{eco.tagline}"
                </p>

                {/* Gap */}
                <div style={{
                  background: `${eco.color}08`,
                  border: `1px solid ${eco.color}20`,
                  borderRadius: 6, padding: "10px 14px", marginBottom: 16,
                }}>
                  <span style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 10, fontWeight: 700, color: eco.color,
                    textTransform: "uppercase", letterSpacing: "0.12em",
                  }}>
                    The Gap:{" "}
                  </span>
                  <span style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: 12, color: "#374151", lineHeight: 1.5,
                  }}>
                    {eco.gap}
                  </span>
                </div>

                {/* Tool chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {eco.tools.map((tool) => (
                    <span key={tool} style={{
                      fontFamily: "'Barlow Condensed',sans-serif",
                      fontSize: 11, fontWeight: 600, color: "#6B7280",
                      background: "#F3F4F6", borderRadius: 4,
                      padding: "3px 8px", letterSpacing: 0.3,
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Command OS fits */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            fontFamily: "'DM Mono',monospace", fontSize: 10,
            letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase", marginBottom: 14,
          }}>
            The pattern is identical across every stack
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(26px,4vw,40px)", fontWeight: 600,
            color: NAVY, lineHeight: 1.2, marginBottom: 32,
          }}>
            The infrastructure exists. The operating model doesn't.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { num: "170", label: "Pre-staged playbooks", sub: "Ready before the trigger fires" },
              { num: "12 min", label: "To full execution", sub: "vs. 30 days of alignment cycles" },
              { num: "3,600×", label: "Execution head start", sub: "30 days compressed to 12 minutes" },
            ].map(({ num, label, sub }) => (
              <div key={label} style={{
                padding: 28, borderRadius: 10,
                border: `1px solid ${GOLD}22`, background: `${GOLD}05`,
              }}>
                <div style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1,
                  marginBottom: 8,
                }}>
                  {num}
                </div>
                <div style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 4,
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 11, color: "#6B7280", lineHeight: 1.5,
                }}>
                  {sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hofmann Framework Diagram */}
      <section style={{ background: "#F8F7F4", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            textAlign: "center", marginBottom: 28,
            fontFamily: "'DM Mono',monospace", fontSize: 10,
            letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase",
          }}>
            The build stack — and the one missing layer
          </div>
          <HofmannFrameworkDiagram />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: NAVY, padding: "64px 24px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 10, letterSpacing: "0.22em", color: GOLD,
          textTransform: "uppercase", marginBottom: 16,
        }}>
          Works with your existing stack
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(28px,4vw,44px)", fontWeight: 600,
          color: IVORY, lineHeight: 1.2, marginBottom: 24,
        }}>
          No migration. No replacement.<br />The command layer above what you already own.
        </h2>
        <p style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: 15, color: "rgba(240,237,228,0.55)",
          maxWidth: 520, margin: "0 auto 36px",
        }}>
          Command OS deploys inside your existing enterprise environment — Microsoft, Google, Salesforce, AWS, SAP, ServiceNow, or Workday. We don't compete with your stack. We make it execute.
        </p>
        <button
          onClick={() => setLocation("/request-access")}
          style={{
            background: GOLD, color: NAVY, border: "none",
            fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "14px 40px", borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Request a Pilot
        </button>
      </section>
    </PageLayout>
  );
}
