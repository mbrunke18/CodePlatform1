import PageLayout from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import EcosystemDiagram, { EcoTileData, EcoConnector } from "@/components/EcosystemDiagram";
import { useLocation } from "wouter";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const IVORY = "#F0EDE4";

export interface EcosystemPageData {
  headline: string;
  tagline: string;
  gapMessage: string;
  ecoColor: string;
  ecoName: string;
  ecoLayerLabel: string;
  overlineText: string;
  tiles: EcoTileData[];
  connectors: EcoConnector[];
  footerItems: string[];
  step1Title: string;
  step1Body: string;
  step1Color: string;
  integrationsHeading: string;
  ctaHeading: string;
  ctaBody: string;
}

export default function EcosystemPageTemplate({ data }: { data: EcosystemPageData }) {
  const [, setLocation] = useLocation();
  const { ecoColor } = data;

  return (
    <PageLayout>
      <PageHero
        eyebrow="Ecosystem Architecture"
        title={data.headline}
        subtitle={data.tagline}
        size="md"
      />

      {/* Gap callout */}
      <section style={{ background: `${ecoColor}08`, borderTop: `2px solid ${ecoColor}30`, borderBottom: `1px solid ${ecoColor}18`, padding: "28px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            background: `${ecoColor}18`, border: `1px solid ${ecoColor}44`,
            borderRadius: 0, padding: "8px 16px", whiteSpace: "nowrap",
            fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.18em", color: ecoColor, textTransform: "uppercase",
          }}>
            The Gap
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(16px,2vw,20px)", color: NAVY,
            fontWeight: 600, lineHeight: 1.4, margin: 0,
          }}>
            {data.gapMessage}
          </p>
        </div>
      </section>

      {/* Diagram */}
      <section style={{ background: "#060B1E", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <EcosystemDiagram
            ecoName={data.ecoName}
            ecoLayerLabel={data.ecoLayerLabel}
            ecoColor={data.ecoColor}
            overlineText={data.overlineText}
            tiles={data.tiles}
            connectors={data.connectors}
            footerItems={data.footerItems}
          />
        </div>
      </section>

      {/* 3-step explanation */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            textAlign: "center", fontFamily: "'DM Mono',monospace",
            fontSize: 10, letterSpacing: 4, color: GOLD,
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
                title: data.step1Title,
                body: data.step1Body,
                color: data.step1Color,
              },
              {
                phase: "02",
                title: "Readiness OS provides the strategic layer",
                body: "Sitting above the stack, Readiness OS monitors 221 executive triggers, maps them to 170 pre-staged Readiness Protocols, and fires coordinated responses in 12 minutes — without waiting for committees, emails, or alignment cycles.",
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

      {/* Integration touchpoints */}
      <section style={{ background: "#F8F7F4", padding: "56px 24px", borderTop: `1px solid ${GOLD}18` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(24px,3vw,36px)", fontWeight: 600,
            color: NAVY, textAlign: "center", marginBottom: 36,
          }}>
            {data.integrationsHeading}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {data.connectors.map(({ label, sub, icon, color }) => (
              <div key={label} style={{
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
                  {label}
                </div>
                <p style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 12, color: "#6B7280", lineHeight: 1.6, fontWeight: 400,
                }}>
                  {sub}
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
          {data.ctaHeading}
        </h2>
        <p style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: 15, color: "rgba(240,237,228,0.55)",
          maxWidth: 520, margin: "0 auto 36px",
        }}>
          {data.ctaBody}
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setLocation("/request-access")}
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
