import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Shield, Zap, Users, Clock, CheckCircle, AlertTriangle, TrendingUp,
  ChevronRight, Target, Activity, BarChart3, ArrowRight, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG    = { fontFamily: "'Cormorant Garamond', serif" };
const BC    = { fontFamily: "'Barlow Condensed', sans-serif" };

// ── Demo data: shown when no live activation is selected ──────────────────────

const DEMO_BRIEF = {
  protocolName: "Activist Investor — Board Intervention Required",
  triggerSummary: "Signal cluster: 3 SEC 13D filings detected in past 72 hours. Activist hedge fund has crossed 5% ownership threshold in peer company. Pattern consistent with pre-campaign accumulation.",
  riskLevel: "CRITICAL" as const,
  riskRationale: "This protocol carries an 88/100 severity rating. Your organization has activated this protocol 4 times — 75% hit the 12-minute target.",
  recommendedAction: "Activate pre-staged board defense protocol. Convene Tier 1 stakeholders immediately. Engage outside counsel and IR firm under pre-negotiated retainer.",
  expectedOutcome: "Mobilized response within 12 minutes. 12 minutes to mobilize, 30–60 days to stabilize activist situation.",
  timeToStabilize: "12 minutes to mobilize, 30–60 days to stabilize",
  budgetRequired: "$2,500,000 pre-approved",
  keyDecisions: [
    { decision: "Authorize protocol activation and budget release", owner: "CEO", deadline: "T+0 minutes" },
    { decision: "Confirm external communications posture", owner: "General Counsel", deadline: "T+3 minutes" },
    { decision: "Assign execution ownership and escalation path", owner: "CFO", deadline: "T+6 minutes" },
  ],
  successProbability: 87,
  priorActivationCount: 4,
  priorTargetMetRate: 75,
};

const DEMO_WAR_ROOM = {
  protocolName: "Activist Investor — Board Intervention Required",
  compositionConfidence: 84,
  totalRequired: 8,
  tier1: [
    { rank: 1, role: "CEO", name: "James Whitfield", tier: 1, raciType: "accountable", readinessScore: 94, avgResponseTimeSeconds: 38, activationCount: 4, isRequired: true, recommendedChannel: "Slack", lastSeenAt: new Date(Date.now() - 5 * 86400000) },
    { rank: 2, role: "General Counsel", name: "Maria Santos", tier: 1, raciType: "accountable", readinessScore: 89, avgResponseTimeSeconds: 52, activationCount: 3, isRequired: true, recommendedChannel: "Slack", lastSeenAt: new Date(Date.now() - 12 * 86400000) },
    { rank: 3, role: "CFO", name: "David Park", tier: 1, raciType: "accountable", readinessScore: 91, avgResponseTimeSeconds: 44, activationCount: 4, isRequired: true, recommendedChannel: "Email", lastSeenAt: new Date(Date.now() - 3 * 86400000) },
    { rank: 4, role: "Board Chair", name: "Patricia Nguyen", tier: 1, raciType: "accountable", readinessScore: 72, avgResponseTimeSeconds: 180, activationCount: 1, isRequired: true, recommendedChannel: "Phone", lastSeenAt: new Date(Date.now() - 45 * 86400000) },
  ],
  tier2: [
    { rank: 1, role: "Head of IR", name: "Thomas Reed", tier: 2, raciType: "responsible", readinessScore: 88, avgResponseTimeSeconds: 65, activationCount: 3, isRequired: false, recommendedChannel: "Slack", lastSeenAt: new Date(Date.now() - 8 * 86400000) },
    { rank: 2, role: "VP Communications", name: "Ashley Kim", tier: 2, raciType: "responsible", readinessScore: 85, avgResponseTimeSeconds: 71, activationCount: 2, isRequired: false, recommendedChannel: "Slack", lastSeenAt: new Date(Date.now() - 15 * 86400000) },
    { rank: 3, role: "Deputy General Counsel", name: null, tier: 2, raciType: "responsible", readinessScore: 45, avgResponseTimeSeconds: null, activationCount: 0, isRequired: false, recommendedChannel: "Email", lastSeenAt: null },
  ],
  tier3Roles: ["All-Hands Legal", "Board Members", "External IR Firm", "Outside Counsel"],
};

const DEMO_SCORECARD = {
  activationId: "demo-activation-001",
  elapsedSeconds: 487,
  velocityScore: 91,
  stakeholderResponseRate: 75,
  taskCompletionRate: 62,
  projectedCompletionMinute: 11,
  onTrack: true,
  summary: "On track — 7/10 milestones met. 62% tasks complete.",
  milestones: [
    { milestone: "Protocol staged & decision brief delivered", targetMinute: 0, status: "hit" as const, actualMinute: 0, delta: 0 },
    { milestone: "Tier 1 stakeholders notified", targetMinute: 1, status: "hit" as const, actualMinute: 1, delta: 0 },
    { milestone: "Executive authorization received", targetMinute: 3, status: "hit" as const, actualMinute: 2, delta: -1 },
    { milestone: "50% of Tier 1 stakeholders acknowledged", targetMinute: 4, status: "hit" as const, actualMinute: 4, delta: 0 },
    { milestone: "Critical tasks assigned and in progress", targetMinute: 5, status: "hit" as const, actualMinute: 5, delta: 0 },
    { milestone: "All Tier 1 stakeholders acknowledged", targetMinute: 6, status: "at_risk" as const, actualMinute: null, delta: 2 },
    { milestone: "Initial situation assessment complete", targetMinute: 7, status: "hit" as const, actualMinute: 7, delta: 0 },
    { milestone: "75% of critical tasks complete", targetMinute: 9, status: "pending" as const, actualMinute: null, delta: null },
    { milestone: "External communications sent (if required)", targetMinute: 10, status: "pending" as const, actualMinute: null, delta: null },
    { milestone: "Full mobilization complete — 12-minute target", targetMinute: 12, status: "pending" as const, actualMinute: null, delta: null },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" }) {
  const colors = {
    CRITICAL: { bg: "#fef2f2", border: "#ef4444", text: "#ef4444" },
    HIGH:     { bg: "#fff7ed", border: "#f97316", text: "#f97316" },
    MEDIUM:   { bg: "#fffbeb", border: GOLD,      text: GOLD },
    LOW:      { bg: "#f0fdf4", border: TEAL,      text: TEAL },
  };
  const c = colors[level];
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", padding: "3px 12px", textTransform: "uppercase" }}>
      {level} RISK
    </span>
  );
}

function MilestoneRow({ m, index }: { m: typeof DEMO_SCORECARD["milestones"][0]; index: number }) {
  const statusConfig = {
    hit:     { color: TEAL,     icon: "✓", label: "HIT" },
    missed:  { color: "#ef4444", icon: "✗", label: "MISSED" },
    at_risk: { color: GOLD,     icon: "!", label: "AT RISK" },
    pending: { color: "#9CA3AF", icon: "·", label: "PENDING" },
  };
  const s = statusConfig[m.status];
  return (
    <div className="flex items-center gap-4" style={{ padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: m.status === "pending" ? "#F3F4F6" : `${s.color}15`, border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: s.color, flexShrink: 0 }}>
        {s.icon}
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 13, color: m.status === "pending" ? "#9CA3AF" : NAVY, fontWeight: m.status === "hit" ? 600 : 400 }}>{m.milestone}</div>
      </div>
      <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
        <span style={{ ...BC, fontSize: 11, color: "#9CA3AF" }}>T+{m.targetMinute}m</span>
        <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: s.color, background: `${s.color}12`, padding: "2px 8px" }}>{s.label}</span>
        {m.delta !== null && m.delta < 0 && (
          <span style={{ fontSize: 10, color: TEAL, fontWeight: 700 }}>{Math.abs(m.delta)}m ahead</span>
        )}
      </div>
    </div>
  );
}

function StatBlock({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px 28px" }}>
      <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: color ?? NAVY, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ActivationIntelligencePage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("brief");

  const elapsedMin = Math.floor(DEMO_SCORECARD.elapsedSeconds / 60);
  const elapsedSec = DEMO_SCORECARD.elapsedSeconds % 60;

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: "64px 0 48px" }}>
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-start justify-between gap-8 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 32, height: 2, background: GOLD }} />
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Activation Intelligence</span>
              </div>
              <h1 style={{ ...CG, fontSize: "clamp(38px,4.5vw,56px)", fontWeight: 600, color: "#fff", lineHeight: 1.1, maxWidth: 700 }}>
                The War Room is Ready<br />
                <em style={{ color: "#DFC178" }}>Before the Trigger Fires</em>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 16, fontSize: 15, maxWidth: 580, lineHeight: 1.7 }}>
                Executive decision brief in under 60 seconds. Auto-composed war room ranked by performance history.
                12-minute milestone tracking from the moment of activation.
              </p>
            </div>
            <div className="flex gap-6 flex-wrap">
              <StatBlock label="Activation Speed" value="T+0:00" sub="Brief ready on activation" color={GOLD} />
              <StatBlock label="Avg Authorization" value="44s" sub="CEO median response" color={TEAL} />
              <StatBlock label="Target Met Rate" value="75%" sub="12-minute benchmark" color="#fff" />
            </div>
          </div>
        </div>
      </div>

      {/* Activation banner */}
      <div style={{ background: "#ef444415", borderBottom: "1px solid #ef444440", padding: "14px 0" }}>
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />
            <span style={{ ...BC, fontSize: 12, fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em" }}>LIVE ACTIVATION · PROTOCOL 47 · ACTIVIST INVESTOR</span>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Activated {elapsedMin}m {elapsedSec}s ago</span>
          </div>
          <div className="flex items-center gap-4">
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>
              Velocity Score: {DEMO_SCORECARD.velocityScore}/100 · On Track
            </div>
            <Button size="sm" style={{ background: "#ef4444", color: "#fff", borderRadius: 0, fontSize: 11, fontWeight: 700 }}>
              Open War Room
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={{ background: "transparent", borderBottom: "1px solid #E8E4DC", width: "100%", justifyContent: "flex-start", borderRadius: 0, height: "auto", padding: 0, marginBottom: 48 }}>
            {[
              { id: "brief",    label: "Decision Brief",     sub: "60-second executive view" },
              { id: "warroom",  label: "War Room Composition", sub: "Ranked by readiness" },
              { id: "scorecard", label: "12-Minute Scorecard", sub: "Live milestone tracking" },
            ].map(t => (
              <TabsTrigger key={t.id} value={t.id} style={{ borderRadius: 0, padding: "16px 32px", borderBottom: activeTab === t.id ? `3px solid ${NAVY}` : "3px solid transparent", fontWeight: activeTab === t.id ? 700 : 400, color: activeTab === t.id ? NAVY : "#6B7280", background: "transparent", fontSize: 13 }}>
                <div>
                  <div>{t.label}</div>
                  <div style={{ fontSize: 10, fontWeight: 400, color: "#9CA3AF" }}>{t.sub}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab: Decision Brief */}
          <TabsContent value="brief">
            <div className="grid grid-cols-3 gap-8">
              {/* Left: Main brief */}
              <div className="col-span-2 space-y-6">
                {/* Header */}
                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "32px 36px" }}>
                  <div className="flex items-start justify-between gap-6 mb-6 flex-wrap">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <RiskBadge level={DEMO_BRIEF.riskLevel} />
                        <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em" }}>PROTOCOL 47</span>
                      </div>
                      <h2 style={{ ...CG, fontSize: 26, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}>{DEMO_BRIEF.protocolName}</h2>
                    </div>
                    <div style={{ background: NAVY, padding: "16px 24px", textAlign: "center", flexShrink: 0 }}>
                      <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{DEMO_BRIEF.successProbability}%</div>
                      <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>Success Probability</div>
                    </div>
                  </div>

                  <div style={{ background: "#FFF8F0", border: "1px solid #F5E6CC", padding: "16px 20px", marginBottom: 20 }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.2em", marginBottom: 6 }}>TRIGGER SUMMARY</div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{DEMO_BRIEF.triggerSummary}</p>
                  </div>

                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 20 }}>{DEMO_BRIEF.riskRationale}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div style={{ background: "#F8F7F4", padding: "16px 20px" }}>
                      <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.2em", marginBottom: 8, textTransform: "uppercase" }}>Recommended Action</div>
                      <p style={{ fontSize: 13, color: NAVY, lineHeight: 1.6, fontWeight: 500 }}>{DEMO_BRIEF.recommendedAction}</p>
                    </div>
                    <div style={{ background: "#F8F7F4", padding: "16px 20px" }}>
                      <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.2em", marginBottom: 8, textTransform: "uppercase" }}>Expected Outcome</div>
                      <p style={{ fontSize: 13, color: NAVY, lineHeight: 1.6, fontWeight: 500 }}>{DEMO_BRIEF.expectedOutcome}</p>
                    </div>
                  </div>
                </div>

                {/* Key decisions */}
                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "28px 36px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 20 }}>Key Decisions Required</div>
                  <div className="space-y-3">
                    {DEMO_BRIEF.keyDecisions.map((d, i) => (
                      <div key={i} className="flex items-center gap-4" style={{ padding: "16px 20px", border: "1px solid #E8E4DC", background: "#F8F7F4" }}>
                        <div style={{ width: 28, height: 28, background: NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <div className="flex-1">
                          <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{d.decision}</div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Owner: <strong>{d.owner}</strong></div>
                        </div>
                        <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{d.deadline}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Meta stats */}
              <div className="space-y-4">
                <div style={{ background: NAVY, padding: "28px 24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 16, textTransform: "uppercase" }}>Budget Authority</div>
                  <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD, marginBottom: 4 }}>{DEMO_BRIEF.budgetRequired}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>No board approval required</div>
                  <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.1)", margin: "20px 0" }} />
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 12, textTransform: "uppercase" }}>Time to Stabilize</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{DEMO_BRIEF.timeToStabilize}</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase" }}>Activation History</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: 12, color: "#6B7280" }}>Prior activations</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{DEMO_BRIEF.priorActivationCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: 12, color: "#6B7280" }}>12-min target met</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: TEAL }}>{DEMO_BRIEF.priorTargetMetRate}%</span>
                    </div>
                    <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${DEMO_BRIEF.priorTargetMetRate}%`, background: TEAL, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase" }}>Authorization</div>
                  <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginBottom: 16 }}>
                    No Readiness Protocol activates without executive sign-off. The preparation compresses the mobilization cycle; the decision remains human.
                  </p>
                  <Button className="w-full" style={{ background: NAVY, color: "#fff", borderRadius: 0, fontWeight: 700, fontSize: 13 }}>
                    <Lock className="h-3 w-3 mr-2" />
                    Authorize Activation
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab: War Room Composition */}
          <TabsContent value="warroom">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "32px 36px", marginBottom: 24 }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY }}>Tier 1 — Decision Makers</h3>
                      <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Accountable for authorization and strategic direction. Required to acknowledge within 3 minutes.</p>
                    </div>
                    <div style={{ background: NAVY, padding: "10px 20px", textAlign: "center" }}>
                      <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: GOLD }}>{DEMO_WAR_ROOM.compositionConfidence}%</div>
                      <div style={{ ...BC, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>COMPOSITION CONFIDENCE</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {DEMO_WAR_ROOM.tier1.map(p => (
                      <div key={p.role} className="flex items-center gap-4" style={{ padding: "16px 20px", border: `1px solid ${p.readinessScore >= 80 ? TEAL + "30" : p.readinessScore >= 60 ? GOLD + "30" : "#ef444430"}`, background: "#F8F7F4" }}>
                        <div style={{ width: 40, height: 40, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                          {(p.name ?? p.role).split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{p.name ?? <em style={{ color: "#9CA3AF" }}>Not mapped</em>}</div>
                          <div style={{ fontSize: 11, color: "#6B7280" }}>{p.role} · {p.recommendedChannel}</div>
                        </div>
                        <div className="flex items-center gap-6">
                          {p.avgResponseTimeSeconds && (
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{p.avgResponseTimeSeconds}s</div>
                              <div style={{ fontSize: 10, color: "#9CA3AF" }}>avg response</div>
                            </div>
                          )}
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: p.readinessScore >= 80 ? TEAL : p.readinessScore >= 60 ? GOLD : "#ef4444" }}>{p.readinessScore}</div>
                            <div style={{ fontSize: 10, color: "#9CA3AF" }}>readiness</div>
                          </div>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.readinessScore >= 80 ? TEAL : p.readinessScore >= 60 ? GOLD : "#ef4444" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "32px 36px" }}>
                  <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Tier 2 — Execution Team</h3>
                  <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 24 }}>Responsible for carrying out protocol tasks. Must acknowledge within 5 minutes.</p>
                  <div className="space-y-3">
                    {DEMO_WAR_ROOM.tier2.map(p => (
                      <div key={p.role} className="flex items-center gap-4" style={{ padding: "14px 20px", border: "1px solid #E8E4DC", background: p.name ? "#fff" : "#FFF8F8" }}>
                        <div style={{ width: 36, height: 36, background: p.name ? "#E8E4DC" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", color: p.name ? "#6B7280" : "#ef4444", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {p.name ? p.name.split(" ").map(w => w[0]).join("").slice(0, 2) : "?"}
                        </div>
                        <div className="flex-1">
                          <div style={{ fontSize: 13, fontWeight: 600, color: p.name ? NAVY : "#ef4444" }}>{p.name ?? "Role not mapped"}</div>
                          <div style={{ fontSize: 11, color: "#6B7280" }}>{p.role}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: p.readinessScore >= 70 ? TEAL : "#ef4444" }}>{p.readinessScore}</div>
                          <div style={{ fontSize: 10, color: "#9CA3AF" }}>readiness</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-4">
                <div style={{ background: NAVY, padding: "24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 12, textTransform: "uppercase" }}>Tier 3 — Notification Groups</div>
                  <div className="space-y-2">
                    {DEMO_WAR_ROOM.tier3Roles.map(role => (
                      <div key={role} className="flex items-center gap-2" style={{ padding: "8px 12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase" }}>Composition Quality</div>
                  <div className="space-y-4">
                    {[
                      { label: "Contacts mapped", value: `${DEMO_WAR_ROOM.tier1.filter(p => p.name).length + DEMO_WAR_ROOM.tier2.filter(p => p.name).length}/${DEMO_WAR_ROOM.totalRequired}`, color: NAVY },
                      { label: "Avg Tier 1 readiness", value: `${Math.round(DEMO_WAR_ROOM.tier1.reduce((s, p) => s + p.readinessScore, 0) / DEMO_WAR_ROOM.tier1.length)}`, color: TEAL },
                      { label: "Unfilled roles", value: `${DEMO_WAR_ROOM.tier2.filter(p => !p.name).length}`, color: "#ef4444" },
                    ].map(stat => (
                      <div key={stat.label} className="flex justify-between items-center">
                        <span style={{ fontSize: 12, color: "#6B7280" }}>{stat.label}</span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: stat.color }}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Button className="w-full" variant="outline" style={{ borderRadius: 0, fontSize: 11, border: "1px solid #E8E4DC" }} onClick={() => setLocation("/stakeholder-management")}>
                      Map Missing Contacts
                    </Button>
                  </div>
                </div>

                <div style={{ background: IVORY, border: "1px solid #E8E4DC", padding: "20px 24px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Why ranked by readiness?</div>
                  <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>
                    Participants are ranked by their historical authorization speed and engagement score — not just by role title. The fastest authorizers appear first so the war room fills with capable people, not just the right titles.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab: 12-Minute Scorecard */}
          <TabsContent value="scorecard">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                {/* Live clock */}
                <div style={{ background: DEMO_SCORECARD.onTrack ? NAVY : "#7f1d1d", padding: "28px 36px", marginBottom: 24 }}>
                  <div className="flex items-center justify-between flex-wrap gap-6">
                    <div>
                      <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>ELAPSED TIME</div>
                      <div style={{ ...CG, fontSize: 56, fontWeight: 700, color: DEMO_SCORECARD.onTrack ? GOLD : "#f87171", lineHeight: 1 }}>
                        {String(elapsedMin).padStart(2, "0")}:{String(elapsedSec).padStart(2, "0")}
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>of 12:00 target · Protocol 47</div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { label: "Velocity Score", value: `${DEMO_SCORECARD.velocityScore}`, unit: "/100", color: GOLD },
                        { label: "Stakeholder Ack", value: `${DEMO_SCORECARD.stakeholderResponseRate}%`, color: TEAL },
                        { label: "Tasks Complete", value: `${DEMO_SCORECARD.taskCompletionRate}%`, color: "#fff" },
                      ].map(s => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                          <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}<span style={{ fontSize: 14 }}>{s.unit}</span></div>
                          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginTop: 4, textTransform: "uppercase" }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Milestone list */}
                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "28px 36px" }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY }}>Milestone Progress</h3>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 12, color: TEAL }}>✓ {DEMO_SCORECARD.milestones.filter(m => m.status === "hit").length} hit</span>
                      <span style={{ fontSize: 12, color: GOLD }}>! {DEMO_SCORECARD.milestones.filter(m => m.status === "at_risk").length} at risk</span>
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>· {DEMO_SCORECARD.milestones.filter(m => m.status === "pending").length} pending</span>
                    </div>
                  </div>
                  {DEMO_SCORECARD.milestones.map((m, i) => (
                    <MilestoneRow key={i} m={m} index={i} />
                  ))}
                </div>
              </div>

              {/* Right: Projection */}
              <div className="space-y-4">
                <div style={{ background: TEAL, padding: "28px 24px", textAlign: "center" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)", marginBottom: 12, textTransform: "uppercase" }}>Projected Completion</div>
                  <div style={{ ...CG, fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{DEMO_SCORECARD.projectedCompletionMinute}:00</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>1 minute ahead of target</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase" }}>Live Status</div>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, fontWeight: 500 }}>{DEMO_SCORECARD.summary}</p>
                </div>

                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase" }}>Legend</div>
                  {[
                    { color: TEAL, icon: "✓", label: "Milestone hit on time" },
                    { color: GOLD, icon: "!", label: "At risk — past target" },
                    { color: "#ef4444", icon: "✗", label: "Missed — more than 2m over" },
                    { color: "#9CA3AF", icon: "·", label: "Pending — not yet due" },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-3 mb-3">
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${l.color}15`, border: `2px solid ${l.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: l.color, flexShrink: 0 }}>{l.icon}</div>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>{l.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: IVORY, border: "1px solid #E8E4DC", padding: "20px 24px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 8 }}>What the scorecard proves</div>
                  <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>
                    The 12-minute milestone tracker shows prospects exactly what "30 days compressed to 12 minutes" looks like in real execution — not as a claim, but as a live data feed.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
