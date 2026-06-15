import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { CheckCircle2, Clock, Circle, ChevronRight, Zap, Calendar, Users, BarChart3, FileText, Shield, TrendingUp, Layers } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG = { fontFamily: "'Cormorant Garamond', serif" };

type Status = "live" | "building" | "planned";

interface RoadmapItem {
  title: string;
  description: string;
  value: string;
  status: Status;
  eta?: string;
  icon: any;
}

interface RoadmapRound {
  round: string;
  theme: string;
  description: string;
  items: RoadmapItem[];
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string; Icon: any }> = {
  live:     { label: "Live",     color: TEAL,      bg: "rgba(43,138,110,0.08)",  border: TEAL,      Icon: CheckCircle2 },
  building: { label: "Building", color: GOLD,      bg: "rgba(201,168,76,0.08)",  border: GOLD,      Icon: Clock },
  planned:  { label: "Planned",  color: "#6B7280", bg: "rgba(107,114,128,0.06)", border: "#D1D5DB", Icon: Circle },
};

const ROUNDS: RoadmapRound[] = [
  {
    round: "Round 1",
    theme: "Platform Breadth",
    description: "Four additive features that expand what Readiness OS can show an executive in a single session — score, sector, compliance, and post-activation proof.",
    items: [
      {
        title: "Executive Readiness Score",
        description: "A 0–100 score computed from live signal coverage, trigger monitoring, Readiness Protocol deployment, and activation history. Gauges organizational readiness at a glance — with a tier rating (CRITICAL / DEVELOPING / READY / ELITE) and a specific next-step recommendation.",
        value: "Gives the CISO or COO a single number to bring to the board before a trigger fires.",
        status: "live",
        icon: Shield,
      },
      {
        title: "Industry Sector Readiness Protocol Packs",
        description: "Readiness Protocol Library now filters by industry sector — Healthcare, Financial Services, Technology, Manufacturing, Retail, Energy. Each sector pack surfaces the Readiness Protocols most relevant to that industry's dominant risk profile.",
        value: "A healthcare COO sees FDA recall and HIPAA breach Readiness Protocols first. A manufacturing COO sees supply chain and tariff Readiness Protocols first.",
        status: "live",
        icon: Layers,
      },
      {
        title: "Regulatory Calendar",
        description: "Live compliance deadline tracker showing upcoming regulatory windows (SEC, GDPR, SOX, FDA, OSHA, FTC, EEO-1, CCPA) with exact countdown timers, regulatory body attribution, and direct links to the pre-staged Readiness Protocols that respond to each obligation.",
        value: "The response to a regulatory deadline is pre-staged before the deadline appears on anyone's calendar.",
        status: "live",
        icon: Calendar,
      },
      {
        title: "Board-Ready Activation Report",
        description: "Auto-generated one-page report produced at the close of every Readiness Protocol activation. Shows: trigger that fired, Readiness Protocol deployed, executive who authorized, time to full deployment, stakeholders notified, estimated value preserved, and recommended next steps.",
        value: "The post-activation debrief arrives pre-formatted for the board packet — zero assembly required.",
        status: "live",
        icon: FileText,
      },
    ],
  },
  {
    round: "Round 2",
    theme: "Founding Partner Retention",
    description: "Features that deepen daily engagement for Founding Partner organizations — turning Readiness OS from a one-time demo into an always-on operating model.",
    items: [
      {
        title: "Drill Scheduler",
        description: "Calendar-based scheduling for practice drills with recommended cadence based on domain criticality. Sends reminder notifications via email. Shows drill history and tracks preparation frequency over time.",
        value: "Organizations that rehearse respond 3× faster. The scheduler makes rehearsal automatic — not a calendar negotiation.",
        status: "building",
        eta: "Q2 2026",
        icon: Calendar,
      },
      {
        title: "Stakeholder Heat Map",
        description: "Visual grid of all stakeholders mapped by domain and last-tested date. Surfaces contacts who have never been activated — 'cold' stakeholders who are readiness liabilities. Drives targeted drill assignments.",
        value: "Silence at acknowledgment is the earliest signal that preparation didn't transfer. The heat map identifies who hasn't been tested before the pressure exists.",
        status: "building",
        eta: "Q2 2026",
        icon: Users,
      },
      {
        title: "Compound Threat Scoring",
        description: "When two or more triggers co-fire in overlapping domains (e.g., a cyber incident coinciding with an SEC disclosure window), the system calculates a compound severity score and surfaces the combined Readiness Protocol response set automatically.",
        value: "The most dangerous situations are compound. This is the feature that makes Readiness OS irreplaceable when two crises arrive simultaneously.",
        status: "planned",
        eta: "Q3 2026",
        icon: Zap,
      },
      {
        title: "Readiness Protocol Version History",
        description: "Every change to a customized Readiness Protocol is logged — who changed what, when, and what the previous version contained. Enables organizational learning and accountability across preparation cycles.",
        value: "Ownership is built during preparation, not declared after the fact. Version history makes it visible and auditable.",
        status: "planned",
        eta: "Q3 2026",
        icon: FileText,
      },
    ],
  },
  {
    round: "Round 3",
    theme: "Investor & Sales Proof",
    description: "Features designed for the Founding Partner review meeting, the board packet, and the Series A narrative — quantifying the value Readiness OS delivers in a language finance understands.",
    items: [
      {
        title: "Founding Partner ROI Snapshot",
        description: "One-click page showing the full value delivered during a Founding Partner engagement: activations completed, total time saved vs. 30-day mobilization baseline, estimated dollar value preserved, and readiness score trajectory over the engagement period.",
        value: "The number that closes the enterprise contract — denominated in dollars, minutes, and decisions made.",
        status: "planned",
        eta: "Q3 2026",
        icon: TrendingUp,
      },
      {
        title: "Live Benchmark Comparison",
        description: "Side-by-side comparison of the organization's readiness posture vs. startup to Fortune 500 averages across readiness score, time-to-deploy, trigger coverage, and domain depth. Benchmarks driven by industry and company size.",
        value: "Every executive wants to know where they stand relative to peers. This answers that question with real data.",
        status: "planned",
        eta: "Q3 2026",
        icon: BarChart3,
      },
      {
        title: "Executive One-Pager Export",
        description: "PDF-quality print view of the organization's complete readiness posture — score, tier, top 3 risks, Readiness Protocols deployed, activation history, and next recommended actions. Formatted for the board packet or investor update.",
        value: "One button. One page. Board-ready.",
        status: "planned",
        eta: "Q4 2026",
        icon: FileText,
      },
    ],
  },
];

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.Icon;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <Icon style={{ width: 10, height: 10, color: cfg.color }} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const Icon = item.icon;
  const cfg = STATUS_CONFIG[item.status];
  return (
    <div style={{ background: "#fff", border: `1px solid #E8E4DC`, borderLeft: `4px solid ${cfg.border}`, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `${cfg.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon style={{ width: 14, height: 14, color: cfg.color }} />
          </div>
          <h3 style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY, margin: 0 }}>{item.title}</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {item.eta && <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>{item.eta}</span>}
          <StatusBadge status={item.status} />
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>{item.description}</p>
      <div style={{ padding: "10px 14px", background: "rgba(201,168,76,0.05)", borderLeft: `3px solid ${GOLD}` }}>
        <span style={{ fontSize: 11, color: NAVY, fontWeight: 600, fontStyle: "italic" }}>{item.value}</span>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const [, setLocation] = useLocation();

  const liveCount = ROUNDS.flatMap(r => r.items).filter(i => i.status === "live").length;
  const buildingCount = ROUNDS.flatMap(r => r.items).filter(i => i.status === "building").length;
  const plannedCount = ROUNDS.flatMap(r => r.items).filter(i => i.status === "planned").length;

  return (
    <PageLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 1, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Readiness OS · Product Roadmap</span>
          </div>
          <h1 style={{ ...CG, fontSize: "clamp(32px,4vw,52px)", fontWeight: 600, color: NAVY, margin: "0 0 16px", lineHeight: 1.15 }}>
            What We're Building
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.8, maxWidth: 640, margin: "0 0 32px" }}>
            Every feature on this roadmap serves one thesis: the response is ready before the trigger fires. We build capability in rounds — each round deepening the platform's value to the organizations that depend on it.
          </p>

          {/* Status legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {([
              { status: "live" as Status, count: liveCount, desc: "deployed and active" },
              { status: "building" as Status, count: buildingCount, desc: "in active development" },
              { status: "planned" as Status, count: plannedCount, desc: "roadmapped with specs" },
            ]).map(({ status, count, desc }) => {
              const cfg = STATUS_CONFIG[status];
              const Icon = cfg.Icon;
              return (
                <div key={status} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <Icon style={{ width: 14, height: 14, color: cfg.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{count}</span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rounds */}
        {ROUNDS.map((round, ri) => (
          <div key={round.round} style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
              <div style={{ flexShrink: 0, paddingTop: 4 }}>
                <div style={{ width: 1, height: "100%", minHeight: 48, background: "#E8E4DC", position: "relative", left: 19 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 0, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", top: 0, left: -20 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>{`R${ri + 1}`}</span>
                  </div>
                </div>
              </div>
              <div style={{ paddingLeft: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>{round.round}</span>
                  <div style={{ width: 1, height: 12, background: "#D1D5DB" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF" }}>{round.theme}</span>
                </div>
                <h2 style={{ ...CG, fontSize: 26, fontWeight: 600, color: NAVY, margin: "0 0 6px" }}>{round.theme}</h2>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.6, maxWidth: 580 }}>{round.description}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0 }}>
              {round.items.map(item => (
                <RoadmapCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* Footer CTA */}
        <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ ...CG, fontSize: 20, fontWeight: 500, color: NAVY, margin: 0, fontStyle: "italic" }}>
            "The competitor can buy the platform. They cannot buy the accumulated decision logic embedded in the preparation phase."
          </p>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>— Dr. Kerry Huang, ESI Top 1% Researcher · 408-firm study</p>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              onClick={() => setLocation("/request-access")}
              style={{ padding: "10px 24px", background: NAVY, color: "#fff", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}
            >
              Apply for Founding Partner Access
            </button>
            <button
              onClick={() => setLocation("/playbooks")}
              style={{ padding: "10px 24px", background: "transparent", color: NAVY, border: `1px solid ${NAVY}`, cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}
            >
              Explore Readiness Protocols <ChevronRight style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
