import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { updatePageMetadata } from "@/lib/seo";
import { Link } from "wouter";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Shield,
  Eye,
  Layers,
  TrendingUp,
  FileText,
  Activity,
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const HOLDING_SCENARIOS = [
  {
    id: 1,
    title: "Board authorization pending",
    description: "Executive has flagged the situation. Protocol is staged. Authorization checkpoint reached — the decision gate is open, waiting for the sign-off that triggers execution.",
    urgency: "HIGH",
    hoursHeld: 2.5,
    protocol: "Investor Communications Protocol",
    domain: "Market Dynamics",
    icon: Shield,
    color: GOLD,
  },
  {
    id: 2,
    title: "Parallel situation in progress",
    description: "A Ransomware Response Protocol is already running. The supply chain disruption signal was detected simultaneously. Execution is staged; team capacity determines sequencing.",
    urgency: "CRITICAL",
    hoursHeld: 0.5,
    protocol: "Supply Chain Disruption Response",
    domain: "Operational Risk",
    icon: AlertTriangle,
    color: "#EF4444",
  },
  {
    id: 3,
    title: "Additional intelligence requested",
    description: "The executive authorized a 24-hour monitoring hold. The system continues to collect corroborating signals before the Regulatory Compliance Sprint is activated.",
    urgency: "MONITORING",
    hoursHeld: 18,
    protocol: "Regulatory Compliance Sprint",
    domain: "Regulatory & Compliance",
    icon: Eye,
    color: TEAL,
  },
];

function HoldCard({ scenario }: { scenario: typeof HOLDING_SCENARIOS[0] }) {
  const Icon = scenario.icon;
  const urgencyStyles = {
    CRITICAL: { bg: "rgba(239,68,68,0.08)", border: "#EF444430", left: "#EF4444", label: "CRITICAL HOLD" },
    HIGH: { bg: "rgba(201,168,76,0.06)", border: `${GOLD}30`, left: GOLD, label: "HOLDING — AUTHORIZATION PENDING" },
    MONITORING: { bg: "rgba(43,138,110,0.05)", border: `${TEAL}20`, left: TEAL, label: "MONITORING HOLD" },
  }[scenario.urgency] ?? { bg: "#F8F7F4", border: "#E8E4DC", left: NAVY, label: "HOLDING" };

  return (
    <div style={{
      background: urgencyStyles.bg,
      border: `1px solid ${urgencyStyles.border}`,
      borderLeft: `4px solid ${urgencyStyles.left}`,
      padding: "24px 28px",
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase",
              color: urgencyStyles.left, background: `${urgencyStyles.left}12`, padding: "2px 10px",
            }}>
              {urgencyStyles.label}
            </span>
            <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {scenario.domain}
            </span>
          </div>
          <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY, marginBottom: 6 }}>{scenario.title}</h3>
          <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.65, marginBottom: 16, maxWidth: 680 }}>
            {scenario.description}
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#6B7280" }}>
              Protocol: <strong style={{ color: NAVY }}>{scenario.protocol}</strong>
            </span>
            <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
              <Clock style={{ width: 10, height: 10 }} />
              Held <strong style={{ color: scenario.hoursHeld >= 4 ? "#EF4444" : GOLD }}>
                {scenario.hoursHeld < 1 ? `${Math.round(scenario.hoursHeld * 60)}m` : `${scenario.hoursHeld}h`}
              </strong>
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <Button
            style={{ background: NAVY, color: "#fff", borderRadius: 0, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}
          >
            <CheckCircle2 style={{ width: 12, height: 12, marginRight: 6 }} />
            Authorize Execution
          </Button>
          <Button
            variant="outline"
            style={{ borderRadius: 0, border: "1px solid #E8E4DC", fontSize: 11, whiteSpace: "nowrap" }}
          >
            <Eye style={{ width: 12, height: 12, marginRight: 6 }} />
            Review Protocol
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DecisionHolding() {
  const [activeFilter, setActiveFilter] = useState<"all" | "critical" | "monitoring">("all");

  useEffect(() => {
    updatePageMetadata({
      title: "Decision Holding Queue — VaughnMartin Readiness OS",
      description: "Protocols staged and ready — awaiting executive authorization. The response is pre-staged; the decision gate is open.",
    });
  }, []);

  const filtered = HOLDING_SCENARIOS.filter(s => {
    if (activeFilter === "critical") return s.urgency === "CRITICAL";
    if (activeFilter === "monitoring") return s.urgency === "MONITORING";
    return true;
  });

  const criticalCount = HOLDING_SCENARIOS.filter(s => s.urgency === "CRITICAL").length;
  const holdingCount = HOLDING_SCENARIOS.filter(s => s.urgency === "HIGH").length;
  const monitoringCount = HOLDING_SCENARIOS.filter(s => s.urgency === "MONITORING").length;

  return (
    <PageLayout>
      <div className="bg-white min-h-screen">

        {/* Navy header */}
        <div style={{ background: NAVY, padding: "56px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="relative z-10 max-w-5xl mx-auto">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.3)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                Execution Gateway
              </span>
            </div>
            <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(36px,5vw,52px)", color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
              Decision <em style={{ color: "#DFC178", fontStyle: "italic" }}>Holding Queue</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, maxWidth: 620, lineHeight: 1.65, marginBottom: 32 }}>
              These Readiness Protocols are fully staged and ready to execute. Each one is waiting at the decision gate — prepared, authorized to proceed the moment the executive confirms. The work is done. The decision is the only remaining step.
            </p>
            <div className="flex items-center gap-8">
              {[
                { label: "CRITICAL HOLDS", value: criticalCount, color: "#EF4444" },
                { label: "AWAITING AUTH", value: holdingCount, color: GOLD },
                { label: "MONITORING", value: monitoringCount, color: TEAL },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ ...CG, fontSize: 28, fontWeight: 600, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctrine callout */}
        <div style={{ background: `${GOLD}08`, borderBottom: `1px solid ${GOLD}20`, padding: "18px 48px" }}>
          <div className="max-w-5xl mx-auto flex items-start gap-4">
            <Layers style={{ width: 16, height: 16, color: GOLD, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.65 }}>
              <strong style={{ color: NAVY }}>The response is ready before the trigger fires.</strong>
              {" "}This queue is not a backlog — it is a staging gate. Every protocol listed here has been pre-staged, verified, and positioned for immediate execution. The executive's role is authorization, not planning. Planning happened weeks ago.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            {[
              { key: "all", label: `All (${HOLDING_SCENARIOS.length})` },
              { key: "critical", label: `Critical (${criticalCount})` },
              { key: "monitoring", label: `Monitoring (${monitoringCount})` },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key as typeof activeFilter)}
                style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "8px 20px",
                  background: activeFilter === f.key ? NAVY : "transparent",
                  color: activeFilter === f.key ? "#fff" : "#6B7280",
                  border: `1px solid ${activeFilter === f.key ? NAVY : "#E8E4DC"}`,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Hold cards */}
          {filtered.map(s => <HoldCard key={s.id} scenario={s} />)}

          {/* Escalation principle */}
          <div style={{ marginTop: 48, padding: "24px 28px", background: `${NAVY}04`, borderLeft: `3px solid ${GOLD}`, border: `1px solid ${NAVY}12` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <TrendingUp style={{ width: 14, height: 14, color: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>Escalation Principle</span>
            </div>
            <p style={{ ...CG, fontSize: 18, fontWeight: 500, color: NAVY, lineHeight: 1.7, fontStyle: "italic", marginBottom: 10 }}>
              "Holding without a decision is still a decision — it is the choice to let time pass while the situation develops. The governance chain records both the hold and its duration."
            </p>
            <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 16, lineHeight: 1.6 }}>
              Protocols held beyond 4 hours without authorization are automatically escalated to the board-level governance chain. Every unacted hold is a recorded governance decision with a timestamp.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/signal-accountability">
                <Button
                  variant="outline"
                  style={{ borderRadius: 0, border: "1px solid #E8E4DC", fontSize: 11, fontWeight: 700 }}
                >
                  <FileText style={{ width: 12, height: 12, marginRight: 6 }} />
                  View Accountability Report
                </Button>
              </Link>
              <Link href="/live-activation-center">
                <Button
                  style={{ background: NAVY, color: "#fff", borderRadius: 0, fontSize: 11, fontWeight: 700 }}
                >
                  <Activity style={{ width: 12, height: 12, marginRight: 6 }} />
                  Live Activation Center
                  <ArrowRight style={{ width: 12, height: 12, marginLeft: 6 }} />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
