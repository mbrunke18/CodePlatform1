import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { updatePageMetadata } from "@/lib/seo";
import { Link } from "wouter";
import { ArrowRight, Shield, Eye, Users, Zap } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const LAYERS = [
  {
    layer: "Logic",
    icon: Shield,
    herName: "Decision clarity and closure",
    whereItBreaks: "Decisions reopened after closure",
    readinessAnswer: "170 pre-staged response architectures. The logic is built before the trigger fires. Every protocol defines the decision structure, the escalation path, and the closure criteria in advance — so the decision does not have to be reconstructed under pressure.",
    color: GOLD,
  },
  {
    layer: "Behavior",
    icon: Eye,
    herName: "System response under pressure",
    whereItBreaks: "System routes around the assigned owner",
    readinessAnswer: "Signal monitoring detects threshold crossings before behavior drift begins. The system makes deviations from expected ownership visible at the moment they occur — not after the situation has already been routed around the person it was assigned to.",
    color: TEAL,
  },
  {
    layer: "Ownership",
    icon: Users,
    herName: "Where decisions actually hold",
    whereItBreaks: "Ownership redistributes quietly",
    readinessAnswer: "Decision rights mapped and ownership confirmed before any trigger fires. The Close-Out Gate encodes what held and what did not — so the next protocol is built around the actual owner, not the assumed one.",
    color: "#7C6FA8",
  },
  {
    layer: "Capacity",
    icon: Zap,
    herName: "Load on decision holders",
    whereItBreaks: "Preparation built around the wrong owner",
    readinessAnswer: "Stakeholder notification, budget allocation, document staging, and task distribution are all pre-built before pressure arrives. The decision holder's cognitive load at trigger time is authorization — not coordination.",
    color: NAVY,
  },
];

export default function DecisionHolding() {
  useEffect(() => {
    updatePageMetadata({
      title: "Decision-Holding Architecture — VaughnMartin Readiness OS",
      description: "How Readiness OS answers Jayashree Venkataraman's four diagnostic layers of governance failure before the trigger fires.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="bg-white min-h-screen">

        {/* Navy hero */}
        <div style={{ background: NAVY, padding: "64px 48px 72px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.25)" }} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)" }}>
                Decision-Holding Architecture
              </span>
            </div>

            {/* Pull quote */}
            <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 28, marginBottom: 40 }}>
              <p style={{ ...CG, fontSize: "clamp(22px,3.5vw,32px)", fontStyle: "italic", color: "#F0EDE4", lineHeight: 1.5, marginBottom: 14 }}>
                "Governance does not fail because decisions are unclear. It fails because it cannot hold decisions where they are made."
              </p>
              <p style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: `${GOLD}99` }}>
                Jayashree Venkataraman — Leadership Systems Advisor, Co-Founder NIYA, 2026
              </p>
            </div>

            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, maxWidth: 640, lineHeight: 1.7 }}>
              Jayashree Venkataraman's governance research identifies four layers where decision-holding fails under pressure. Each layer names a specific failure mode. This page maps each one to the preparation architecture Readiness OS builds before the trigger ever fires.
            </p>
          </div>
        </div>

        {/* Gold rule */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />

        {/* Four-layer diagnostic grid */}
        <div className="max-w-5xl mx-auto px-6 py-16">

          <div style={{ marginBottom: 48 }}>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: GOLD }}>
              The Four Diagnostic Layers
            </span>
            <h2 style={{ ...CG, fontSize: "clamp(26px,4vw,38px)", fontWeight: 600, color: NAVY, marginTop: 10, lineHeight: 1.2 }}>
              Where governance fails — and where preparation answers it
            </h2>
          </div>

          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr 1.4fr", gap: 1, marginBottom: 1 }}>
            {["Her Layer", "What She Names", "Where It Breaks", "Readiness OS Answer"].map(h => (
              <div key={h} style={{ background: NAVY, padding: "10px 16px" }}>
                <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>{h}</span>
              </div>
            ))}
          </div>

          {/* Layer rows */}
          {LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.layer}
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr 1fr 1.4fr",
                  gap: 1,
                  marginBottom: 1,
                }}
              >
                {/* Layer name */}
                <div style={{ background: `${layer.color}08`, borderLeft: `3px solid ${layer.color}`, padding: "20px 16px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon style={{ width: 14, height: 14, color: layer.color }} />
                    <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>{layer.layer}</span>
                  </div>
                </div>

                {/* What she names */}
                <div style={{ background: i % 2 === 0 ? "#FAFAFA" : "#fff", padding: "20px 18px", borderBottom: "1px solid #F0EDE4" }}>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{layer.herName}</p>
                </div>

                {/* Where it breaks */}
                <div style={{ background: i % 2 === 0 ? "#FAFAFA" : "#fff", padding: "20px 18px", borderBottom: "1px solid #F0EDE4" }}>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, fontStyle: "italic" }}>{layer.whereItBreaks}</p>
                </div>

                {/* Readiness OS answer */}
                <div style={{ background: i % 2 === 0 ? "#FAFAFA" : "#fff", padding: "20px 18px", borderBottom: "1px solid #F0EDE4", borderRight: `1px solid #F0EDE4` }}>
                  <p style={{ fontSize: 13, color: NAVY, lineHeight: 1.7, fontWeight: 500 }}>{layer.readinessAnswer}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Source attribution */}
        <div style={{ background: "#F9F7F3", borderTop: "1px solid #E8E4DC", borderBottom: "1px solid #E8E4DC", padding: "24px 48px" }}>
          <div className="max-w-5xl mx-auto">
            <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.7 }}>
              <strong style={{ color: NAVY }}>Source:</strong> Jayashree Venkataraman's article: <em>"Why Decisions Don't Hold. From Governance Design to System Behaviour under Pressure."</em> Her four diagnostic layers — Logic, Behavior, Ownership, Capacity — independently named the failure modes that Readiness OS preparation architecture is designed to pre-empt. DM exchange April 25, 2026. Her exact observation: <em>"The system does not retain the conditions that made the decision hold."</em>
            </p>
          </div>
        </div>

        {/* Closing section */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div style={{ maxWidth: 680 }}>
            <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 24, marginBottom: 40 }}>
              <p style={{ ...CG, fontSize: "clamp(20px,3vw,28px)", fontStyle: "italic", color: NAVY, lineHeight: 1.6 }}>
                "The governance question is not whether the decision was right. It is whether a hold location exists. Readiness OS builds that hold location before the trigger fires."
              </p>
            </div>

            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 12 }}>
              Most governance frameworks assume the decision-holder will be available, informed, and unconstrained at the moment of the trigger. Jayashree Venkataraman's research shows that assumption fails across all four diagnostic layers simultaneously under real pressure.
            </p>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 40 }}>
              Readiness OS does not improve the decision. It builds the hold location — the pre-staged structure of logic, behavior guardrails, ownership clarity, and capacity relief — so that when the trigger fires, the executive's role is authorization, not reconstruction.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/request-access">
                <Button
                  style={{ background: GOLD, color: NAVY, borderRadius: 0, fontWeight: 700, fontSize: 13, padding: "12px 28px" }}
                >
                  Apply for Founding Partner Access
                  <ArrowRight style={{ width: 14, height: 14, marginLeft: 8 }} />
                </Button>
              </Link>
              <Link href="/activation-outcome">
                <Button
                  variant="outline"
                  style={{ borderRadius: 0, border: `1px solid ${NAVY}`, color: NAVY, fontWeight: 600, fontSize: 13, padding: "12px 24px" }}
                >
                  See the Close-Out Gate
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
