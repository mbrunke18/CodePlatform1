import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Clock, TrendingDown, Target, Award, ChevronRight,
  CheckCircle2, XCircle, BarChart3, Zap, ArrowLeft,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { ExecutionStageGuide } from "@/components/ExecutionStageGuide";

const NAVY   = "#0A0F2E";
const GOLD   = "#C9A84C";
const TEAL   = "#2B8A6E";
const MUTED  = "#6B7280";
const BORDER = "#E5E7EB";

type ActivationRow = {
  id: string;
  playbookName: string;
  domain?: string;
  actualExecutionTime: number;
  successRating: number;
  targetMet: boolean;
  activatedAt: string | Date;
  completedAt?: string | Date;
};

type HistorySummary = {
  total: number;
  avgTime: number | null;
  targetMetCount: number;
  avgScore: number | null;
  timeSaved: number;
  isDemo?: boolean;
};

type HistoryResponse = {
  summary: HistorySummary;
  activations: ActivationRow[];
};

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function scoreColor(score: number) {
  if (score >= 90) return TEAL;
  if (score >= 75) return "#2563EB";
  if (score >= 60) return GOLD;
  return "#EF4444";
}

function scoreLabel(score: number) {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Strong";
  if (score >= 60) return "On Track";
  return "Needs Review";
}

function timeBadgeColor(minutes: number) {
  if (minutes <= 12) return TEAL;
  if (minutes <= 20) return GOLD;
  return "#EF4444";
}

export default function ExecutionHistory() {
  const { data, isLoading } = useQuery<HistoryResponse>({
    queryKey: ["/api/execution-history"],
  });

  const activations = data?.activations ?? [];
  const summary = data?.summary;
  const isDemo = summary?.isDemo;

  const chartData = [...activations]
    .reverse()
    .map((a, i) => ({
      label: `#${i + 1}`,
      minutes: a.actualExecutionTime,
      score: a.successRating,
      name: (a.playbookName || "").split(" ").slice(0, 2).join(" "),
    }));

  const kpis = [
    {
      label: "Total Activations",
      value: summary?.total ?? 0,
      unit: "",
      icon: <BarChart3 className="h-5 w-5" />,
      color: NAVY,
    },
    {
      label: "Avg Response Time",
      value: summary?.avgTime ?? "—",
      unit: summary?.avgTime ? " min" : "",
      icon: <Clock className="h-5 w-5" />,
      color: summary?.avgTime && summary.avgTime <= 12 ? TEAL : GOLD,
      note: "Target: 12 min",
    },
    {
      label: "Avg Performance Score",
      value: summary?.avgScore ?? "—",
      unit: summary?.avgScore ? "/100" : "",
      icon: <Award className="h-5 w-5" />,
      color: summary?.avgScore ? scoreColor(summary.avgScore) : NAVY,
    },
    {
      label: "Hours Preserved",
      value: summary?.timeSaved ? Math.round(summary.timeSaved / 60) : "—",
      unit: summary?.timeSaved ? " hrs" : "",
      icon: <Zap className="h-5 w-5" />,
      color: GOLD,
      note: "vs. 30-day baseline",
    },
  ];

  return (
    <PageLayout>
      <div style={{ background: "#F8F9FC", minHeight: "100vh", paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ background: NAVY, borderBottom: `3px solid ${GOLD}`, paddingTop: 48, paddingBottom: 40, paddingLeft: 32, paddingRight: 32 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Link href="/command-center">
              <button style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", marginBottom: 20 }}>
                <ArrowLeft className="h-3 w-3" /> Back to Command Center
              </button>
            </Link>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                  ADVANCE PHASE — EXECUTION INTELLIGENCE
                </div>
                <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                  Execution History
                </h1>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, marginTop: 8, maxWidth: 520 }}>
                  Every activation logged. Response times tracked. Your trajectory toward 12-minute execution — made visible.
                </p>
              </div>
              {isDemo && (
                <div style={{ background: "rgba(43,138,110,0.15)", border: `1px solid ${TEAL}`, borderRadius: 0, padding: "8px 16px", color: TEAL, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>
                  CONCEPT SIMULATION — Evidence of Execution Trajectory
                </div>
              )}
            </div>
          </div>
        </div>

        <ExecutionStageGuide variant="compact" />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: MUTED }}>
              <Clock className="h-8 w-8 mx-auto mb-3" style={{ color: GOLD }} />
              <p style={{ fontWeight: 600 }}>Loading execution history…</p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
                {kpis.map((k) => (
                  <div key={k.label} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${k.color}`, borderRadius: 0, padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ color: k.color }}>{k.icon}</div>
                      {k.note && <span style={{ fontSize: 10, color: MUTED, fontWeight: 600, letterSpacing: "0.06em" }}>{k.note}</span>}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: k.color, lineHeight: 1 }}>
                      {k.value}{k.unit}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {k.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trend Chart */}
              {chartData.length > 0 && (
                <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 0, padding: "28px 28px 20px", marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div>
                      <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, margin: 0 }}>Response Time Trajectory</h2>
                      <p style={{ fontSize: 12, color: MUTED, margin: "4px 0 0" }}>Minutes per activation — trending toward your 12-minute target</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: TEAL, fontWeight: 600 }}>
                        <div style={{ width: 12, height: 3, background: TEAL, borderRadius: 0 }} />
                        Response Time
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#EF4444", fontWeight: 600 }}>
                        <div style={{ width: 12, height: 2, background: "#EF4444", borderRadius: 0, borderTop: "1px dashed #EF4444" }} />
                        12-min target
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={TEAL} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={TEAL} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: MUTED }} />
                      <YAxis tick={{ fontSize: 11, fill: MUTED }} domain={[0, 'auto']} />
                      <Tooltip
                        contentStyle={{ border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 12 }}
                        formatter={(v: number) => [`${v} min`, "Response Time"]}
                      />
                      <Area type="monotone" dataKey="minutes" stroke={TEAL} strokeWidth={2.5} fill="url(#timeGrad)" dot={{ fill: TEAL, r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                  {/* 12-min target line label */}
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 1, background: "#EF4444", opacity: 0.4, borderTop: "1px dashed #EF4444" }} />
                    <span style={{ fontSize: 10, color: "#EF4444", fontWeight: 700, letterSpacing: "0.1em" }}>12-MINUTE TARGET</span>
                    <div style={{ flex: 1, height: 1, background: "#EF4444", opacity: 0.4, borderTop: "1px dashed #EF4444" }} />
                  </div>
                </div>
              )}

              {/* Activation Table */}
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 0, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, margin: 0 }}>Activation Log</h2>
                  <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>{activations.length} activations recorded</span>
                </div>
                {activations.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
                    <Target className="h-8 w-8 mx-auto mb-3" style={{ color: GOLD }} />
                    <p style={{ fontWeight: 600, fontSize: 15 }}>No activations recorded yet</p>
                    <p style={{ fontSize: 13, marginTop: 4 }}>Activate your first Readiness Protocol to start tracking execution history</p>
                    <Link href="/identify/Readiness Protocols">
                      <button style={{ marginTop: 20, background: NAVY, color: "#fff", border: "none", borderRadius: 0, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                        Browse Readiness Protocols
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    {/* Table header */}
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 120px 120px 100px 40px", gap: 0, padding: "10px 24px", background: "#F9FAFB", borderBottom: `1px solid ${BORDER}` }}>
                      {["Readiness Protocol", "Date", "Response Time", "Score", "Target", ""].map((h) => (
                        <div key={h} style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</div>
                      ))}
                    </div>
                    {activations.map((a, i) => (
                      <div
                        key={a.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1fr 120px 120px 100px 40px",
                          gap: 0,
                          padding: "16px 24px",
                          borderBottom: i < activations.length - 1 ? `1px solid ${BORDER}` : "none",
                          alignItems: "center",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>{a.playbookName || "—"}</div>
                          {a.domain && <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{a.domain}</div>}
                        </div>
                        <div style={{ fontSize: 13, color: MUTED }}>{formatDate(a.activatedAt)}</div>
                        <div>
                          <span style={{
                            fontSize: 15, fontWeight: 800,
                            color: timeBadgeColor(a.actualExecutionTime),
                          }}>
                            {a.actualExecutionTime} min
                          </span>
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 60, height: 6, background: BORDER, borderRadius: 0, overflow: "hidden" }}>
                              <div style={{ width: `${a.successRating}%`, height: "100%", background: scoreColor(a.successRating), borderRadius: 0 }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(a.successRating) }}>{a.successRating}</span>
                          </div>
                          <div style={{ fontSize: 10, color: scoreColor(a.successRating), fontWeight: 600, marginTop: 2 }}>{scoreLabel(a.successRating)}</div>
                        </div>
                        <div>
                          {a.targetMet ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 5, color: TEAL }}>
                              <CheckCircle2 className="h-4 w-4" />
                              <span style={{ fontSize: 11, fontWeight: 700 }}>Met</span>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 5, color: MUTED }}>
                              <XCircle className="h-4 w-4" />
                              <span style={{ fontSize: 11, fontWeight: 600 }}>Missed</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <ChevronRight className="h-4 w-4" style={{ color: BORDER }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Progress narrative */}
              {activations.length >= 3 && (
                <div style={{ marginTop: 24, background: `rgba(43,138,110,0.05)`, border: `1px solid ${TEAL}`, borderRadius: 0, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <TrendingDown className="h-6 w-6 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                  <div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: 14, marginBottom: 4 }}>Execution Velocity Trend</div>
                    <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.6 }}>
                      Your organization's response time has improved from <strong style={{ color: NAVY }}>{activations[activations.length - 1]?.actualExecutionTime} minutes</strong> on first activation to <strong style={{ color: TEAL }}>{activations[0]?.actualExecutionTime} minutes</strong> most recently — a <strong style={{ color: TEAL }}>{Math.round((1 - activations[0]?.actualExecutionTime / activations[activations.length - 1]?.actualExecutionTime) * 100)}% improvement</strong>. Every activation builds institutional muscle memory. The 12-minute benchmark is within reach.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
