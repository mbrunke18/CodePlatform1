import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  AlertTriangle, CheckCircle, Clock, TrendingDown, Activity,
  Shield, BarChart3, Zap, RefreshCw, ChevronRight, BookOpen
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

// ── Demo health data ──────────────────────────────────────────────────────────

const DEMO_SUMMARY = {
  healthy: 112,
  aging: 38,
  stale: 14,
  critical: 6,
  platformReadinessScore: 74,
  topRisks: [
    { protocolId: "p1", name: "Supply Chain Disruption — Multi-Tier Failure", healthState: "CRITICAL" as const, overallScore: 18, topWarning: "No drill or activation on record — protocol has never been exercised." },
    { protocolId: "p2", name: "Regulatory Investigation — DOJ / FTC", healthState: "CRITICAL" as const, overallScore: 24, topWarning: "Last exercise was 412 days ago — preparation decay likely." },
    { protocolId: "p3", name: "Data Breach — Customer PII Exposure", healthState: "CRITICAL" as const, overallScore: 31, topWarning: "Only 33% of activations hit the 12-minute target — execution speed needs improvement." },
    { protocolId: "p4", name: "CFO Sudden Departure — Succession Gap", healthState: "STALE" as const, overallScore: 38, topWarning: "Stakeholders have limited engagement with this protocol — response coordination risk." },
    { protocolId: "p5", name: "Enterprise Ransomware — Production Systems", healthState: "STALE" as const, overallScore: 42, topWarning: "Last exercise was 210 days ago — preparation decay likely." },
  ],
};

const DEMO_PROTOCOLS = [
  { protocolId: "p1", protocolNumber: 12, protocolName: "Supply Chain Disruption — Multi-Tier Failure", domain: "Risk & Resilience", strategicCategory: "defense", freshnessScore: 10, signalAlignmentScore: 65, stakeholderFamiliarityScore: 30, velocityScore: 60, overallScore: 18, healthState: "CRITICAL" as const, daysSinceLastDrill: null, daysSinceLastActivation: null, totalDrillCount: 0, totalActivationCount: 0, recentTriggerHits: 3, stakeholderEngagementDays: null, targetMetRate: 0, warnings: ["No drill or activation on record — protocol has never been exercised.", "Stakeholders have limited engagement with this protocol."], recommendations: ["Schedule a tabletop drill within 30 days to refresh team readiness.", "Add this protocol to the next quarterly stakeholder briefing.", "PRIORITY: This protocol requires immediate attention before the next trigger event."] },
  { protocolId: "p2", protocolNumber: 47, protocolName: "Regulatory Investigation — DOJ / FTC", domain: "Risk & Resilience", strategicCategory: "defense", freshnessScore: 10, signalAlignmentScore: 80, stakeholderFamiliarityScore: 25, velocityScore: 60, overallScore: 24, healthState: "CRITICAL" as const, daysSinceLastDrill: 412, daysSinceLastActivation: 412, totalDrillCount: 1, totalActivationCount: 0, recentTriggerHits: 5, stakeholderEngagementDays: 412, targetMetRate: 0, warnings: ["Last exercise was 412 days ago — preparation decay likely.", "No recent signal detections for this domain."], recommendations: ["Schedule a tabletop drill within 30 days.", "Verify signal monitoring is configured for this protocol's trigger domain."] },
  { protocolId: "p3", protocolNumber: 23, protocolName: "Data Breach — Customer PII Exposure", domain: "Risk & Resilience", strategicCategory: "defense", freshnessScore: 50, signalAlignmentScore: 95, stakeholderFamiliarityScore: 45, velocityScore: 30, overallScore: 31, healthState: "CRITICAL" as const, daysSinceLastDrill: 95, daysSinceLastActivation: 95, totalDrillCount: 2, totalActivationCount: 3, recentTriggerHits: 8, stakeholderEngagementDays: 95, targetMetRate: 33, warnings: ["Only 33% of activations hit the 12-minute target.", "Stakeholders have limited engagement."], recommendations: ["Review task sequencing to compress execution time toward 12-minute benchmark.", "Schedule a surprise drill to test current readiness."] },
  { protocolId: "p4", protocolNumber: 89, protocolName: "CFO Sudden Departure — Succession Gap", domain: "Transformation", strategicCategory: "special_teams", freshnessScore: 30, signalAlignmentScore: 40, stakeholderFamiliarityScore: 35, velocityScore: 65, overallScore: 38, healthState: "STALE" as const, daysSinceLastDrill: 210, daysSinceLastActivation: null, totalDrillCount: 1, totalActivationCount: 0, recentTriggerHits: 1, stakeholderEngagementDays: 210, targetMetRate: 0, warnings: ["Stakeholders have limited engagement.", "Last exercise was 210 days ago."], recommendations: ["Schedule a tabletop drill within 30 days.", "Add to next quarterly briefing."] },
  { protocolId: "p5", protocolNumber: 31, protocolName: "Enterprise Ransomware — Production Systems", domain: "Risk & Resilience", strategicCategory: "defense", freshnessScore: 30, signalAlignmentScore: 95, stakeholderFamiliarityScore: 60, velocityScore: 55, overallScore: 42, healthState: "STALE" as const, daysSinceLastDrill: 210, daysSinceLastActivation: 90, totalDrillCount: 3, totalActivationCount: 2, recentTriggerHits: 7, stakeholderEngagementDays: 90, targetMetRate: 50, warnings: ["Last exercise was 210 days ago — preparation decay likely.", "50% target met rate needs improvement."], recommendations: ["Schedule a drill within 60 days.", "Review bottleneck task steps."] },
  { protocolId: "p6", protocolNumber: 1, protocolName: "Competitor Enters Core Market Segment", domain: "Growth & Positioning", strategicCategory: "offense", freshnessScore: 85, signalAlignmentScore: 95, stakeholderFamiliarityScore: 90, velocityScore: 100, overallScore: 91, healthState: "HEALTHY" as const, daysSinceLastDrill: 28, daysSinceLastActivation: 14, totalDrillCount: 6, totalActivationCount: 4, recentTriggerHits: 12, stakeholderEngagementDays: 14, targetMetRate: 100, warnings: [], recommendations: [] },
  { protocolId: "p7", protocolNumber: 8, protocolName: "Key Executive Departure — CEO / C-Suite", domain: "Transformation", strategicCategory: "special_teams", freshnessScore: 100, signalAlignmentScore: 65, stakeholderFamiliarityScore: 95, velocityScore: 85, overallScore: 88, healthState: "HEALTHY" as const, daysSinceLastDrill: 15, daysSinceLastActivation: 60, totalDrillCount: 8, totalActivationCount: 3, recentTriggerHits: 2, stakeholderEngagementDays: 15, targetMetRate: 67, warnings: [], recommendations: ["Review task sequencing to improve from 67% target-met rate."] },
];

const DEMO_FEEDBACK = {
  protocolName: "Data Breach — Customer PII Exposure",
  debriefCount: 3,
  activationCount: 3,
  targetMetRate: 33,
  debriefClassification: "RECOVERING" as const,
  classificationReason: "Only 33% of activations hit the 12-minute target. Protocol requires structural improvement before the next activation.",
  topThingsThatHeld: ["Legal notification template", "Forensic vendor engagement", "Executive communication"],
  topThingsThatFailed: ["Internal IT coordination", "Customer disclosure timing", "Regulatory filing process"],
  topGaps: ["Third-party vendor notification", "Media inquiry protocol", "International data authority contacts"],
  encodedLessons: [
    "Pre-stage the GDPR notification template separately from the US breach template — they have different 72-hour clocks.",
    "Forensic vendor needs a designated internal liaison who knows the system architecture before activation, not during.",
    "Customer disclosure should be drafted in parallel with the technical containment — not sequentially.",
  ],
  proposals: [
    { type: "timing_update", priority: "HIGH" as const, title: 'Update estimated duration for "Notify regulatory authorities"', description: "This task consistently takes 8 minutes — 6 minutes over its 2-minute estimate.", evidence: "8 min actual vs 2 min estimated across 3 activations.", before: "Estimated: 2 min", after: "Recommended estimate: 8 min", estimatedImpactMinutes: -3 },
    { type: "task_reorder", priority: "CRITICAL" as const, title: "Reorder tasks to hit 12-minute target more consistently", description: "Only 33% of activations hit the 12-minute mobilization target. Parallelizing non-dependent steps is the highest leverage change.", evidence: "67% miss rate on the 12-minute benchmark.", before: "Target met: 33% of activations", after: "Target: 90%+ after task sequencing improvements.", estimatedImpactMinutes: 3 },
    { type: "add_step", priority: "MEDIUM" as const, title: "Add preparation step for recurring gap themes", description: "Recurring gaps: third-party vendor notification, media inquiry protocol. These were anticipated in debriefs but not covered in the pre-staged protocol.", evidence: "Appeared in close-out gate 'preparationGap' field across 3 debriefs.", before: "Gap scenario not covered in pre-staged tasks.", after: "Add contingency task block covering identified gap patterns.", estimatedImpactMinutes: 2 },
    { type: "task_reassign", priority: "HIGH" as const, title: 'Clarify ownership for "Internal IT system isolation"', description: "Only 33% completion rate. Frequently skipped — usually a sign of ownership ambiguity.", evidence: "67% skip rate across activations.", before: "Owner: CISO — completion rate: 33%", after: "Assign named backup owner and add binary completion criterion.", estimatedImpactMinutes: 1 },
  ],
};

// ── Helper components ─────────────────────────────────────────────────────────

const HEALTH_CONFIG = {
  HEALTHY:  { color: TEAL,     bg: `${TEAL}15`,     label: "HEALTHY",  icon: "✓" },
  AGING:    { color: GOLD,     bg: `${GOLD}15`,     label: "AGING",    icon: "↓" },
  STALE:    { color: "#f97316", bg: "#fff7ed",       label: "STALE",    icon: "!" },
  CRITICAL: { color: "#ef4444", bg: "#fef2f2",       label: "CRITICAL", icon: "✗" },
};

function HealthBadge({ state }: { state: keyof typeof HEALTH_CONFIG }) {
  const c = HEALTH_CONFIG[state];
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", padding: "3px 12px", textTransform: "uppercase" }}>
      {c.label}
    </span>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="flex justify-between items-center mb-2">
        <span style={{ fontSize: 11, color: "#6B7280" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: 4, background: "#F3F4F6", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function PriorityDot({ priority }: { priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" }) {
  const colors = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: GOLD, LOW: TEAL };
  return <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[priority], flexShrink: 0 }} />;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProtocolHealthDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("health");
  const [selectedProtocol, setSelectedProtocol] = useState(DEMO_PROTOCOLS[2]);
  const [healthFilter, setHealthFilter] = useState<string>("all");

  const filteredProtocols = healthFilter === "all"
    ? DEMO_PROTOCOLS
    : DEMO_PROTOCOLS.filter(p => p.healthState === healthFilter.toUpperCase());

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: "64px 0 48px" }}>
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-start justify-between gap-8 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 32, height: 2, background: GOLD }} />
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Protocol Intelligence</span>
              </div>
              <h1 style={{ ...CG, fontSize: "clamp(38px,4.5vw,56px)", fontWeight: 600, color: "#fff", lineHeight: 1.1, maxWidth: 680 }}>
                Know Which Protocols<br />
                <em style={{ color: "#DFC178" }}>Are Ready Before the Trigger</em>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 16, fontSize: 15, maxWidth: 560, lineHeight: 1.7 }}>
                Every Readiness Protocol gets a live health score across four dimensions. A protocol that's never been drilled is not preparation — it's a liability waiting for a trigger.
              </p>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Platform Readiness", value: `${DEMO_SUMMARY.platformReadinessScore}`, unit: "/100", color: GOLD },
                { label: "Protocols Healthy", value: `${DEMO_SUMMARY.healthy}`, unit: "", color: TEAL },
                { label: "Aging / Stale", value: `${DEMO_SUMMARY.aging + DEMO_SUMMARY.stale}`, unit: "", color: "#f97316" },
                { label: "Critical — Act Now", value: `${DEMO_SUMMARY.critical}`, unit: "", color: "#ef4444" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "20px 24px", minWidth: 140 }}>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}<span style={{ fontSize: 16 }}>{s.unit}</span></div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={{ background: "transparent", borderBottom: "1px solid #E8E4DC", width: "100%", justifyContent: "flex-start", borderRadius: 0, height: "auto", padding: 0, marginBottom: 48 }}>
            {[
              { id: "health",    label: "Protocol Health Scores",   sub: "All 170 protocols scored" },
              { id: "critical",  label: "Critical Protocols",        sub: "Act before the trigger" },
              { id: "feedback",  label: "Debrief Feedback Loop",     sub: "Protocol improvement proposals" },
            ].map(t => (
              <TabsTrigger key={t.id} value={t.id} style={{ borderRadius: 0, padding: "16px 32px", borderBottom: activeTab === t.id ? `3px solid ${NAVY}` : "3px solid transparent", fontWeight: activeTab === t.id ? 700 : 400, color: activeTab === t.id ? NAVY : "#6B7280", background: "transparent", fontSize: 13 }}>
                <div>
                  <div>{t.label}</div>
                  <div style={{ fontSize: 10, fontWeight: 400, color: "#9CA3AF" }}>{t.sub}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab: Protocol Health Scores */}
          <TabsContent value="health">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                {/* Filter bar */}
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  {[
                    { id: "all", label: "All Protocols", count: DEMO_PROTOCOLS.length },
                    { id: "critical", label: "Critical", count: DEMO_SUMMARY.critical, color: "#ef4444" },
                    { id: "stale", label: "Stale", count: DEMO_SUMMARY.stale, color: "#f97316" },
                    { id: "aging", label: "Aging", count: DEMO_SUMMARY.aging, color: GOLD },
                    { id: "healthy", label: "Healthy", count: DEMO_SUMMARY.healthy, color: TEAL },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setHealthFilter(f.id)}
                      style={{ padding: "6px 16px", border: `1px solid ${healthFilter === f.id ? NAVY : "#E8E4DC"}`, background: healthFilter === f.id ? NAVY : "#fff", color: healthFilter === f.id ? "#fff" : "#6B7280", fontSize: 12, fontWeight: healthFilter === f.id ? 700 : 400, cursor: "pointer", borderRadius: 0 }}
                    >
                      {f.label} <span style={{ opacity: 0.6 }}>({f.count})</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredProtocols.map(p => {
                    const hc = HEALTH_CONFIG[p.healthState];
                    const isSelected = selectedProtocol.protocolId === p.protocolId;
                    return (
                      <div
                        key={p.protocolId}
                        onClick={() => setSelectedProtocol(p)}
                        style={{ background: "#fff", border: isSelected ? `2px solid ${NAVY}` : "1px solid #E8E4DC", borderLeft: `4px solid ${hc.color}`, padding: "20px 24px", cursor: "pointer", transition: "all 0.15s" }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <HealthBadge state={p.healthState} />
                              <span style={{ ...BC, fontSize: 10, color: "#9CA3AF", letterSpacing: "0.1em" }}>#{p.protocolNumber} · {p.domain}</span>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 8 }}>{p.protocolName}</div>
                            <div className="flex items-center gap-4 flex-wrap">
                              <span style={{ fontSize: 11, color: "#6B7280" }}>
                                Last drill: <strong style={{ color: p.daysSinceLastDrill === null ? "#ef4444" : p.daysSinceLastDrill > 180 ? "#f97316" : NAVY }}>
                                  {p.daysSinceLastDrill === null ? "Never" : `${p.daysSinceLastDrill}d ago`}
                                </strong>
                              </span>
                              <span style={{ fontSize: 11, color: "#6B7280" }}>
                                Activations: <strong style={{ color: NAVY }}>{p.totalActivationCount}</strong>
                              </span>
                              {p.totalActivationCount > 0 && (
                                <span style={{ fontSize: 11, color: "#6B7280" }}>
                                  12-min rate: <strong style={{ color: p.targetMetRate >= 75 ? TEAL : p.targetMetRate >= 50 ? GOLD : "#ef4444" }}>{p.targetMetRate}%</strong>
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: hc.color, lineHeight: 1 }}>{p.overallScore}</div>
                            <div style={{ ...BC, fontSize: 9, color: "#9CA3AF", letterSpacing: "0.1em" }}>HEALTH SCORE</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Detail panel */}
              <div className="space-y-4">
                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "28px 24px" }}>
                  <div className="flex items-start justify-between mb-4">
                    <HealthBadge state={selectedProtocol.healthState} />
                    <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: HEALTH_CONFIG[selectedProtocol.healthState].color }}>{selectedProtocol.overallScore}</div>
                  </div>
                  <h3 style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY, marginBottom: 20, lineHeight: 1.3 }}>{selectedProtocol.protocolName}</h3>

                  <ScoreBar label="Freshness" score={selectedProtocol.freshnessScore} color={selectedProtocol.freshnessScore >= 70 ? TEAL : selectedProtocol.freshnessScore >= 40 ? GOLD : "#ef4444"} />
                  <ScoreBar label="Signal Alignment" score={selectedProtocol.signalAlignmentScore} color={TEAL} />
                  <ScoreBar label="Stakeholder Familiarity" score={selectedProtocol.stakeholderFamiliarityScore} color={selectedProtocol.stakeholderFamiliarityScore >= 70 ? TEAL : GOLD} />
                  <ScoreBar label="Execution Velocity" score={selectedProtocol.velocityScore} color={selectedProtocol.velocityScore >= 70 ? TEAL : selectedProtocol.velocityScore >= 50 ? GOLD : "#ef4444"} />
                </div>

                {selectedProtocol.warnings.length > 0 && (
                  <div style={{ background: "#FFF8F0", border: "1px solid #F5E6CC", padding: "20px 24px" }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.2em", marginBottom: 12, textTransform: "uppercase" }}>Decay Warnings</div>
                    <div className="space-y-3">
                      {selectedProtocol.warnings.map((w, i) => (
                        <div key={i} className="flex gap-2">
                          <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-1" style={{ color: GOLD }} />
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{w}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProtocol.recommendations.length > 0 && (
                  <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", padding: "20px 24px" }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.2em", marginBottom: 12, textTransform: "uppercase" }}>Recommended Actions</div>
                    <div className="space-y-3">
                      {selectedProtocol.recommendations.map((r, i) => (
                        <div key={i} className="flex gap-2">
                          <ChevronRight className="h-3 w-3 flex-shrink-0 mt-1" style={{ color: TEAL }} />
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProtocol.warnings.length === 0 && (
                  <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "20px 24px", textAlign: "center" }}>
                    <CheckCircle className="h-8 w-8 mx-auto mb-3" style={{ color: TEAL }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>Protocol is healthy</div>
                    <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>No decay warnings — continue current drill cadence.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tab: Critical Protocols */}
          <TabsContent value="critical">
            <div className="mb-8">
              <div style={{ background: "#fef2f2", border: "1px solid #ef444430", padding: "20px 28px", marginBottom: 32 }}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5" style={{ color: "#ef4444" }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>{DEMO_SUMMARY.critical} protocols are classified CRITICAL</div>
                    <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                      These protocols have never been exercised or haven't been drilled in over a year. A trigger hitting any one of them would catch the organization unprepared — the opposite of fearless.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {DEMO_SUMMARY.topRisks.map((risk, i) => {
                  const hc = HEALTH_CONFIG[risk.healthState];
                  return (
                    <div key={risk.protocolId} style={{ background: "#fff", border: `1px solid ${hc.color}30`, borderLeft: `4px solid ${hc.color}`, padding: "28px 32px" }}>
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: hc.color, lineHeight: 1, minWidth: 48 }}>{i + 1}</div>
                            <div>
                              <HealthBadge state={risk.healthState} />
                            </div>
                          </div>
                          <h3 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 8 }}>{risk.name}</h3>
                          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{risk.topWarning}</p>
                        </div>
                        <div style={{ textAlign: "center", flexShrink: 0 }}>
                          <div style={{ ...CG, fontSize: 48, fontWeight: 700, color: hc.color, lineHeight: 1 }}>{risk.overallScore}</div>
                          <div style={{ ...BC, fontSize: 9, color: "#9CA3AF", letterSpacing: "0.1em", marginTop: 4 }}>HEALTH SCORE</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-6 flex-wrap">
                        <Button size="sm" style={{ background: NAVY, color: "#fff", borderRadius: 0, fontSize: 11, fontWeight: 700 }}>
                          Schedule Drill
                        </Button>
                        <Button size="sm" variant="outline" style={{ borderRadius: 0, fontSize: 11, border: "1px solid #E8E4DC" }}>
                          View Protocol
                        </Button>
                        <Button size="sm" variant="outline" style={{ borderRadius: 0, fontSize: 11, border: "1px solid #E8E4DC" }} onClick={() => { setActiveTab("feedback"); }}>
                          View Improvement Plan
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Tab: Debrief Feedback Loop */}
          <TabsContent value="feedback">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
                {/* Classification */}
                <div style={{ background: DEMO_FEEDBACK.debriefClassification === "RECOVERING" ? "#fef2f2" : DEMO_FEEDBACK.debriefClassification === "OPTIMIZING" ? "#F0FDF4" : "#fffbeb", border: `1px solid ${DEMO_FEEDBACK.debriefClassification === "RECOVERING" ? "#ef444430" : DEMO_FEEDBACK.debriefClassification === "OPTIMIZING" ? "#BBF7D0" : "#F5E6CC"}`, padding: "24px 28px" }}>
                  <div className="flex items-start gap-4">
                    <div style={{ fontSize: 32 }}>
                      {DEMO_FEEDBACK.debriefClassification === "RECOVERING" ? "⚠" : DEMO_FEEDBACK.debriefClassification === "OPTIMIZING" ? "✓" : "~"}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{DEMO_FEEDBACK.protocolName} — {DEMO_FEEDBACK.debriefClassification}</div>
                      <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4, lineHeight: 1.6 }}>{DEMO_FEEDBACK.classificationReason}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: DEMO_FEEDBACK.targetMetRate >= 75 ? TEAL : DEMO_FEEDBACK.targetMetRate >= 50 ? GOLD : "#ef4444" }}>{DEMO_FEEDBACK.targetMetRate}%</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>12-min target met</div>
                    </div>
                  </div>
                </div>

                {/* Improvement proposals */}
                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "32px 36px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 24 }}>Improvement Proposals — {DEMO_FEEDBACK.proposals.length} identified</div>
                  <div className="space-y-4">
                    {DEMO_FEEDBACK.proposals.map((p, i) => (
                      <div key={i} style={{ border: "1px solid #E8E4DC", padding: "20px 24px" }}>
                        <div className="flex items-start gap-3 mb-3">
                          <PriorityDot priority={p.priority} />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <span style={{ fontSize: 10, fontWeight: 800, color: p.priority === "CRITICAL" ? "#ef4444" : p.priority === "HIGH" ? "#f97316" : GOLD, letterSpacing: "0.15em" }}>{p.priority}</span>
                              <span style={{ ...BC, fontSize: 10, color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.type.replace(/_/g, " ")}</span>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{p.title}</div>
                          </div>
                          {p.estimatedImpactMinutes < 0 && (
                            <div style={{ flexShrink: 0, textAlign: "right" }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: TEAL }}>−{Math.abs(p.estimatedImpactMinutes)}m</div>
                              <div style={{ fontSize: 10, color: "#9CA3AF" }}>time saved</div>
                            </div>
                          )}
                          {p.estimatedImpactMinutes > 0 && (
                            <div style={{ flexShrink: 0, textAlign: "right" }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: TEAL }}>+{p.estimatedImpactMinutes}m</div>
                              <div style={{ fontSize: 10, color: "#9CA3AF" }}>time recovered</div>
                            </div>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 12 }}>{p.description}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div style={{ background: "#fef2f2", padding: "10px 14px" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>BEFORE</div>
                            <div style={{ fontSize: 12, color: "#374151" }}>{p.before}</div>
                          </div>
                          <div style={{ background: "#F0FDF4", padding: "10px 14px" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, marginBottom: 4 }}>AFTER</div>
                            <div style={{ fontSize: 12, color: "#374151" }}>{p.after}</div>
                          </div>
                        </div>
                        <div style={{ marginTop: 12, fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>Evidence: {p.evidence}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Lessons */}
              <div className="space-y-4">
                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: TEAL, marginBottom: 16, textTransform: "uppercase" }}>What Worked</div>
                  <div className="space-y-3">
                    {DEMO_FEEDBACK.topThingsThatHeld.map((t, i) => (
                      <div key={i} className="flex gap-2">
                        <CheckCircle className="h-3 w-3 flex-shrink-0 mt-1" style={{ color: TEAL }} />
                        <span style={{ fontSize: 12, color: "#374151" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#ef4444", marginBottom: 16, textTransform: "uppercase" }}>What Failed</div>
                  <div className="space-y-3">
                    {DEMO_FEEDBACK.topThingsThatFailed.map((t, i) => (
                      <div key={i} className="flex gap-2">
                        <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-1" style={{ color: "#ef4444" }} />
                        <span style={{ fontSize: 12, color: "#374151" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: NAVY, padding: "24px" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, marginBottom: 16, textTransform: "uppercase" }}>Encoded Lessons</div>
                  <div className="space-y-4">
                    {DEMO_FEEDBACK.encodedLessons.map((l, i) => (
                      <div key={i} style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 12 }}>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontStyle: "italic" }}>"{l}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: IVORY, border: "1px solid #E8E4DC", padding: "20px 24px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 8 }}>The self-improving protocol</div>
                  <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>
                    Every close-out gate submission feeds directly into protocol improvement proposals. The more the platform is used, the better the protocols get. That's the moat.
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
