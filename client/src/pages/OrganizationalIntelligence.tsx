import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Shield, TrendingUp, Clock, Users, AlertTriangle, CheckCircle, Lock, ChevronRight, Zap, BarChart3, Database, Award, ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

interface CompoundScore {
  score: number;
  totalCloseOuts: number;
  totalUpdatesGenerated: number;
  totalUpdatesApplied: number;
  signalCalibrationsApplied: number;
  ownershipAssignmentsApplied: number;
  protocolSuggestionsGenerated: number;
  monthsToRebuildOnCompetitor: number;
  encodingTimeline: { date: string; event: string; scoreDelta: number }[];
  calculatedAt: string;
}

interface PreparationUpdate {
  id: string;
  updateType: "signal_calibration" | "ownership_assignment" | "protocol_suggestion";
  suggestionTitle: string;
  suggestionDetail: string;
  suggestionPriority: string;
  status: string;
  createdAt: string;
}

interface CompoundThreat {
  id: string;
  domains: string[];
  threatType: string;
  confidence: number;
  compoundScore: number;
  aiHypothesis: string;
  historicalMatch: string;
  status: string;
  detectedAt: string;
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const color = score >= 70 ? TEAL : score >= 40 ? GOLD : "#C05050";

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background arc */}
        <path
          d={`M 20 100 A 80 80 0 0 1 180 100`}
          fill="none" stroke="#1A2558" strokeWidth="16" strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d={`M 20 100 A 80 80 0 0 1 180 100`}
          fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 251.2} 251.2`}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x="100" y="90" textAnchor="middle" fill="white" fontSize="36" fontWeight="700" fontFamily="Georgia, serif">
          {score}
        </text>
        <text x="100" y="108" textAnchor="middle" fill={GOLD} fontSize="11" fontFamily="'Courier New', monospace" letterSpacing="2">
          / 100
        </text>
      </svg>
      <p className="text-xs font-mono tracking-widest mt-1" style={{ color: GOLD }}>COMPOUND DEPTH SCORE</p>
    </div>
  );
}

function UpdateCard({ update, onApply }: { update: PreparationUpdate; onApply: (id: string) => void }) {
  const typeColors: Record<string, string> = {
    signal_calibration: TEAL,
    ownership_assignment: GOLD,
    protocol_suggestion: "#6B8CFF",
  };
  const typeLabels: Record<string, string> = {
    signal_calibration: "SIGNAL CALIBRATION",
    ownership_assignment: "OWNERSHIP ASSIGNMENT",
    protocol_suggestion: "PROTOCOL UPDATE",
  };
  const priorityColors: Record<string, string> = {
    high: "#C05050",
    medium: GOLD,
    low: TEAL,
  };

  return (
    <div className="rounded border p-4" style={{ borderColor: "#1E2D5A", backgroundColor: "#0D1540" }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold tracking-widest px-2 py-0.5 rounded-sm"
            style={{ color: typeColors[update.updateType] ?? GOLD, backgroundColor: `${typeColors[update.updateType] ?? GOLD}18` }}>
            {typeLabels[update.updateType] ?? update.updateType.toUpperCase()}
          </span>
          {update.suggestionPriority && (
            <span className="text-xs font-mono tracking-wider px-2 py-0.5 rounded-sm"
              style={{ color: priorityColors[update.suggestionPriority] ?? GOLD, backgroundColor: `${priorityColors[update.suggestionPriority] ?? GOLD}18` }}>
              {update.suggestionPriority.toUpperCase()} PRIORITY
            </span>
          )}
        </div>
        {update.status === "pending" && (
          <button
            onClick={() => onApply(update.id)}
            className="text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-sm shrink-0"
            style={{ backgroundColor: TEAL, color: "white" }}>
            APPLY
          </button>
        )}
        {update.status === "applied" && (
          <span className="text-xs font-mono tracking-wider flex items-center gap-1" style={{ color: TEAL }}>
            <CheckCircle className="w-3 h-3" /> APPLIED
          </span>
        )}
      </div>
      <p className="font-semibold mb-1" style={{ color: "white", fontFamily: "Georgia, serif" }}>{update.suggestionTitle}</p>
      <p className="text-sm leading-relaxed" style={{ color: IVORY, opacity: 0.8 }}>{update.suggestionDetail}</p>
      <p className="text-xs font-mono mt-2" style={{ color: GOLD, opacity: 0.6 }}>
        {new Date(update.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

export default function OrganizationalIntelligence() {
  const { user } = useAuth();
  const orgId = (user as any)?.organizationId;
  const qc = useQueryClient();

  const { data: compoundScore, isLoading: scoreLoading } = useQuery<CompoundScore>({
    queryKey: ["/api/organizations", orgId, "compound-score"],
    enabled: !!orgId,
  });

  const { data: updates = [], isLoading: updatesLoading } = useQuery<PreparationUpdate[]>({
    queryKey: ["/api/organizations", orgId, "preparation-updates"],
    enabled: !!orgId,
  });

  const { data: compoundThreats = [] } = useQuery<CompoundThreat[]>({
    queryKey: ["/api/organizations", orgId, "compound-threats"],
    enabled: !!orgId,
  });

  const applyUpdate = useMutation({
    mutationFn: (updateId: string) =>
      apiRequest("PATCH", `/api/preparation-updates/${updateId}/apply-v2`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/organizations", orgId, "preparation-updates"] });
      qc.invalidateQueries({ queryKey: ["/api/organizations", orgId, "compound-score"] });
    },
  });

  const score = compoundScore?.score ?? 0;
  const months = compoundScore?.monthsToRebuildOnCompetitor ?? 0;
  const timeline = (compoundScore?.encodingTimeline as any[]) ?? [];

  const pendingUpdates = updates.filter(u => u.status === "pending");
  const appliedUpdates = updates.filter(u => u.status === "applied");

  return (
    <PageLayout>
      <div className="min-h-screen" style={{ backgroundColor: NAVY }}>
        {/* Header */}
        <div className="border-b" style={{ borderColor: "#1E2D5A" }}>
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5" style={{ color: GOLD }} />
              <span className="text-xs font-mono tracking-widest" style={{ color: GOLD }}>ORGANIZATIONAL INTELLIGENCE</span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "white", fontFamily: "Georgia, serif" }}>
              Preparation Compound Score
            </h1>
            <p className="text-base" style={{ color: IVORY, opacity: 0.75, maxWidth: "640px" }}>
              Every activation that completes the Close-Out Gate encodes institutional intelligence into your preparation architecture. This score measures how deeply your organization has compounded that advantage.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

          {/* Top row: Score + Switching Cost + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Compound Score Gauge */}
            <div className="rounded-sm border p-6 flex flex-col items-center" style={{ borderColor: "#1E2D5A", backgroundColor: "#0A1228" }}>
              {scoreLoading ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: GOLD }} />
                </div>
              ) : (
                <ScoreGauge score={score} />
              )}
              <div className="mt-4 text-center">
                <p className="text-sm" style={{ color: IVORY, opacity: 0.7 }}>
                  {score < 20 ? "Beginning to compound" : score < 50 ? "Building institutional depth" : score < 80 ? "Strong preparation compounding" : "Maximum competitive moat"}
                </p>
              </div>
            </div>

            {/* Switching Cost */}
            <div className="rounded-sm border p-6" style={{ borderColor: "#1E2D5A", backgroundColor: "#0A1228" }}>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4" style={{ color: TEAL }} />
                <span className="text-xs font-mono tracking-widest" style={{ color: TEAL }}>SWITCHING COST</span>
              </div>
              <div className="text-5xl font-bold mb-1" style={{ color: "white", fontFamily: "Georgia, serif" }}>
                {months}
              </div>
              <p className="text-sm font-mono mb-4" style={{ color: GOLD }}>months to rebuild on any competitor platform</p>
              <p className="text-xs leading-relaxed" style={{ color: IVORY, opacity: 0.65 }}>
                This represents the institutional intelligence encoded across {compoundScore?.totalCloseOuts ?? 0} activations — signal calibrations, ownership confirmations, and protocol learnings that exist only in your Readiness OS.
              </p>
            </div>

            {/* Stats breakdown */}
            <div className="rounded-sm border p-6 space-y-4" style={{ borderColor: "#1E2D5A", backgroundColor: "#0A1228" }}>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4" style={{ color: GOLD }} />
                <span className="text-xs font-mono tracking-widest" style={{ color: GOLD }}>INTELLIGENCE DEPTH</span>
              </div>
              {[
                { label: "Close-Out Gates Completed", value: compoundScore?.totalCloseOuts ?? 0, color: "white" },
                { label: "Signal Calibrations Applied", value: compoundScore?.signalCalibrationsApplied ?? 0, color: TEAL },
                { label: "Protocol Updates Generated", value: compoundScore?.protocolSuggestionsGenerated ?? 0, color: GOLD },
                { label: "Total Updates Applied", value: compoundScore?.totalUpdatesApplied ?? 0, color: "#6B8CFF" },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: IVORY, opacity: 0.7 }}>{stat.label}</span>
                  <span className="text-xl font-bold" style={{ color: stat.color, fontFamily: "Georgia, serif" }}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compound Threat Alerts (Moat 4) */}
          {compoundThreats.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-4 h-4" style={{ color: "#C05050" }} />
                <h2 className="text-lg font-bold" style={{ color: "white", fontFamily: "Georgia, serif" }}>
                  Cross-Domain Compound Threats
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm" style={{ backgroundColor: "#C0505020", color: "#C05050" }}>
                  {compoundThreats.length} ACTIVE
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: IVORY, opacity: 0.65 }}>
                Sub-threshold signals detected across multiple strategic domains. Each signal is below the individual trigger threshold, but together they indicate a compound threat pattern — typically visible 48 hours before any individual threshold fires.
              </p>
              <div className="space-y-4">
                {compoundThreats.map(threat => (
                  <div key={threat.id} className="rounded-sm border p-5" style={{ borderColor: "#C0505030", backgroundColor: "#0D0A1A" }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-bold mb-1" style={{ color: "white", fontFamily: "Georgia, serif" }}>{threat.threatType}</h3>
                        <div className="flex flex-wrap gap-2">
                          {(threat.domains ?? []).map(d => (
                            <span key={d} className="text-xs font-mono px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${GOLD}18`, color: GOLD }}>
                              {d.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-bold" style={{ color: "#C05050", fontFamily: "'Courier New', monospace" }}>
                          {threat.compoundScore ?? threat.confidence}%
                        </div>
                        <div className="text-xs font-mono" style={{ color: IVORY, opacity: 0.5 }}>COMPOUND SCORE</div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: IVORY, opacity: 0.8 }}>{threat.aiHypothesis}</p>
                    {threat.historicalMatch && (
                      <p className="text-xs font-mono" style={{ color: TEAL }}>
                        ↳ {threat.historicalMatch}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Preparation Updates (Moat 1) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4" style={{ color: GOLD }} />
                <h2 className="text-lg font-bold" style={{ color: "white", fontFamily: "Georgia, serif" }}>
                  Preparation Updates
                </h2>
              </div>
              {pendingUpdates.length > 0 && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${GOLD}20`, color: GOLD }}>
                  {pendingUpdates.length} PENDING APPLICATION
                </span>
              )}
            </div>
            <p className="text-sm mb-5" style={{ color: IVORY, opacity: 0.65 }}>
              Generated automatically from completed Close-Out Gates. Each update feeds back into your preparation architecture — making protocols more precise, signal detection more accurate, and ownership clearer before the next situation presents itself.
            </p>

            {updatesLoading ? (
              <div className="h-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: GOLD }} />
              </div>
            ) : updates.length === 0 ? (
              <div className="rounded-sm border p-8 text-center" style={{ borderColor: "#1E2D5A", backgroundColor: "#0A1228" }}>
                <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: GOLD, opacity: 0.4 }} />
                <p className="font-semibold mb-1" style={{ color: "white" }}>No updates yet</p>
                <p className="text-sm" style={{ color: IVORY, opacity: 0.55 }}>
                  Complete your first activation and Close-Out Gate to begin compounding preparation intelligence.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUpdates.map(u => (
                  <UpdateCard key={u.id} update={u} onApply={(id) => applyUpdate.mutate(id)} />
                ))}
                {appliedUpdates.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-px flex-1" style={{ backgroundColor: "#1E2D5A" }} />
                      <span className="text-xs font-mono tracking-widest" style={{ color: IVORY, opacity: 0.4 }}>APPLIED</span>
                      <div className="h-px flex-1" style={{ backgroundColor: "#1E2D5A" }} />
                    </div>
                    {appliedUpdates.map(u => (
                      <UpdateCard key={u.id} update={u} onApply={(id) => applyUpdate.mutate(id)} />
                    ))}
                  </>
                )}
              </div>
            )}
          </section>

          {/* Encoding Timeline (Moat 7) */}
          {timeline.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-4 h-4" style={{ color: TEAL }} />
                <h2 className="text-lg font-bold" style={{ color: "white", fontFamily: "Georgia, serif" }}>
                  Encoding Timeline
                </h2>
              </div>
              <p className="text-sm mb-5" style={{ color: IVORY, opacity: 0.65 }}>
                Every Close-Out Gate is a permanent encoding event. This timeline shows exactly when institutional intelligence was encoded into your system — and the compound score impact of each event.
              </p>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px" style={{ backgroundColor: "#1E2D5A" }} />
                <div className="space-y-4 pl-10">
                  {[...timeline].reverse().map((event: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-6 w-3 h-3 rounded-full border-2 mt-1" style={{ backgroundColor: NAVY, borderColor: GOLD }} />
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "white" }}>{event.event}</p>
                          <p className="text-xs font-mono mt-0.5" style={{ color: IVORY, opacity: 0.5 }}>
                            {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <span className="text-sm font-mono font-bold shrink-0" style={{ color: TEAL }}>
                          +{event.scoreDelta} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Switching Cost Statement (Moat 7) */}
          <section className="rounded-sm border p-8" style={{ borderColor: `${GOLD}40`, backgroundColor: "#0A1228" }}>
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 shrink-0 mt-1" style={{ color: GOLD }} />
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ color: "white", fontFamily: "Georgia, serif" }}>
                  The Compounding Advantage
                </h2>
                <p className="text-base leading-relaxed mb-4" style={{ color: IVORY, opacity: 0.85 }}>
                  Your organization has encoded <strong style={{ color: GOLD }}>{compoundScore?.totalCloseOuts ?? 0} activation learnings</strong> into its preparation architecture. This intelligence — signal calibrations tuned to your exact trigger patterns, ownership assignments confirmed under live conditions, and protocol updates drawn from real execution — does not transfer to any other platform.
                </p>
                <p className="text-base font-bold" style={{ color: "white", fontFamily: "Georgia, serif" }}>
                  Estimated time to rebuild this intelligence on a competitor platform:{" "}
                  <span style={{ color: GOLD }}>{months} months.</span>
                </p>
                <p className="text-sm mt-3" style={{ color: IVORY, opacity: 0.6 }}>
                  This estimate increases with every Close-Out Gate completed. The response does not just get faster — it gets smarter. The preparation compounds.
                </p>
              </div>
            </div>
          </section>

          {/* ADVANCE 2.0 Link Panel */}
          <Link href="/advance-intelligence">
            <section className="rounded-sm border p-6 cursor-pointer group transition-all hover:border-teal-600" style={{ borderColor: `${TEAL}40`, backgroundColor: "#071020" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Zap className="w-6 h-6 shrink-0" style={{ color: TEAL }} />
                  <div>
                    <div className="text-xs font-mono tracking-widest mb-1" style={{ color: TEAL }}>ADVANCE 2.0</div>
                    <h3 className="text-base font-bold" style={{ color: "white", fontFamily: "Georgia, serif" }}>
                      Closed-Loop Causal Learning
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: IVORY, opacity: 0.6 }}>
                      View proven protocol improvements, the Learning Velocity Index, and your competitive moat in months.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: TEAL }} />
              </div>
            </section>
          </Link>

        </div>
      </div>
    </PageLayout>
  );
}
