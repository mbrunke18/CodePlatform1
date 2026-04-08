import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, Target, CheckCircle, Users, DollarSign, Play, Rocket } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import { sheinTrendDemoData } from "@shared/shein-trend-data";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

export default function SHEINTrendDemo() {
  const [currentAct, setCurrentAct] = useState<DemoAct>("intro");
  const [coordinationComplete, setCoordinationComplete] = useState(false);

  const goToAct = (act: DemoAct) => {
    setCurrentAct(act);
    if (act === "intro") setCoordinationComplete(false);
  };

  const resetDemo = () => {
    setCurrentAct("intro");
    setCoordinationComplete(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: NAVY }}>
      <DemoNavHeader title="SHEIN Trend Demo" showBackButton={true} />

      {/* Act Navigation */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingTop: 80 }}>
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {[
              { id: "intro", label: "1. Introduction", icon: Play },
              { id: "detection", label: "2. AI Detection @ 96%", icon: Target },
              { id: "coordination", label: "3. 12-Minute Response", icon: Zap },
              { id: "outcome", label: "4. First-Mover Win", icon: TrendingUp }
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => goToAct(act.id as DemoAct)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 16px", borderRadius: 6, transition: "all 0.2s",
                  background: currentAct === act.id ? GOLD : "transparent",
                  color: currentAct === act.id ? NAVY : "rgba(240,237,228,0.6)",
                  border: currentAct === act.id ? "none" : "1px solid rgba(255,255,255,0.12)",
                  cursor: "pointer", fontWeight: 700, fontSize: 12, letterSpacing: "0.04em"
                }}
                data-testid={`button-act-${act.id}`}
              >
                <act.icon style={{ width: 14, height: 14 }} />
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ExecutionStageGuide variant="banner" />
      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">

        {/* ACT 1: INTRODUCTION */}
        {currentAct === "intro" && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 32 }}>
              <div className="text-center mb-8">
                <TrendingUp style={{ width: 56, height: 56, color: GOLD, margin: "0 auto 16px" }} />
                <h2 style={{ fontSize: 28, fontWeight: 700, color: IVORY, marginBottom: 12, fontFamily: "'Cormorant Garamond', serif" }}>
                  {sheinTrendDemoData.crisis.title}
                </h2>
                <p style={{ fontSize: 18, color: "rgba(240,237,228,0.7)" }}>{sheinTrendDemoData.crisis.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div style={{ padding: 24, background: "rgba(43,138,110,0.08)", border: "1px solid rgba(43,138,110,0.25)", borderRadius: 10 }}>
                  <h3 style={{ fontWeight: 700, color: IVORY, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                    <TrendingUp style={{ width: 16, height: 16, color: TEAL }} />
                    The Opportunity
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      ["Viral Trend", "Cottage Core Renaissance — 47M TikTok views in 18 hours"],
                      ["Market Opportunity", "$180M revenue, 21-day lifecycle"],
                      ["Strategic Move", "200 SKUs · 5,000 suppliers · 7-day launch"],
                      ["First-Mover Advantage", "65% market share if launched in 7 days"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: TEAL, marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 13, color: IVORY, fontWeight: 600 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}>
                  <h3 style={{ fontWeight: 700, color: IVORY, marginBottom: 16, fontSize: 14 }}>Traditional Coordination Timeline</h3>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                    <li style={{ color: "rgba(240,237,228,0.65)" }}>• Day 1-2: Design teams start planning independently</li>
                    <li style={{ color: "rgba(240,237,228,0.65)" }}>• Day 2-3: Supplier coordination meetings drag on</li>
                    <li style={{ color: "#FCD34D", fontWeight: 600 }}>• During gap: Zara and H&M detect same trend</li>
                    <li style={{ color: "#F87171", fontWeight: 700 }}>• During gap: Launch delayed to day 10</li>
                    <li style={{ color: "rgba(240,237,228,0.65)" }}>• Day 10+: Launch alongside competitors (not first)</li>
                    <li style={{ color: TEAL }}>• Result: 40% market share instead of 65% ($72M vs $180M)</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: `3px solid ${GOLD}`, borderRadius: 10, padding: 24, marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <Target style={{ width: 28, height: 28, color: GOLD, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 style={{ fontWeight: 700, color: IVORY, marginBottom: 8, fontSize: 15 }}>Speed = Market Share in Fast Fashion</h3>
                    <p style={{ color: "rgba(240,237,228,0.7)", lineHeight: 1.6, fontSize: 13 }}>
                      SHEIN's AI detected the Cottage Core trend instantly. But coordinating 5,847 stakeholders (180 designers,
                      5,000 suppliers, logistics, marketing) traditionally takes <strong style={{ color: IVORY }}>48-72 hours</strong> — enough time for
                      Zara and H&M to respond. In fast fashion, first-mover captures 65% of revenue. Command OS compresses coordination
                      to <strong style={{ color: GOLD }}>12 minutes</strong>, enabling 7-day launch before competitors detect the trend.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Users, value: "5,847", label: "Stakeholders Coordinated" },
                  { icon: Zap, value: "12 Minutes", label: "Full Coordination" },
                  { icon: DollarSign, value: "$108M", label: "Additional Revenue" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} style={{ padding: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, textAlign: "center" }}>
                    <Icon style={{ width: 28, height: 28, color: GOLD, margin: "0 auto 10px" }} />
                    <div style={{ fontSize: 24, fontWeight: 700, color: IVORY, marginBottom: 4 }}>{value}</div>
                    <div style={{ fontSize: 11, color: "rgba(240,237,228,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => goToAct("detection")}
                  style={{ background: GOLD, color: NAVY, padding: "20px 40px", fontSize: 16, fontWeight: 700, letterSpacing: "0.04em" }}
                  data-testid="button-begin-simulation"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Begin Trend Simulation
                </Button>
                <p style={{ fontSize: 12, color: "rgba(240,237,228,0.4)", marginTop: 12 }}>Experience first-mover coordination velocity</p>
              </div>
            </div>
          </div>
        )}

        {/* ACT 2: AI DETECTION */}
        {currentAct === "detection" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: IVORY, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <Target style={{ width: 28, height: 28, color: GOLD }} />
                Act 2: AI Trend Detection
              </h2>
              <p style={{ fontSize: 15, color: "rgba(240,237,228,0.7)", marginBottom: 16, lineHeight: 1.6 }}>
                11:00 AM EST — SHEIN AI detects viral trend: "Cottage Core Renaissance" explodes on TikTok with 47M views in 18 hours.
                2,300 influencers posting, 850% search spike. Trend lifecycle: 21 days. Window to capture 65% market share: 7 days.
              </p>
              <div style={{ marginTop: 20, padding: 16, background: "rgba(43,138,110,0.1)", border: "1px solid rgba(43,138,110,0.3)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckCircle style={{ width: 20, height: 20, color: TEAL }} />
                  <div>
                    <p style={{ fontWeight: 700, color: IVORY, margin: 0 }}>Viral Trend Criteria Met</p>
                    <p style={{ fontSize: 12, color: "rgba(240,237,228,0.55)", margin: "4px 0 0" }}>
                      First-mover window open — Playbook #146 (Trend Capitalization) recommended
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <AIRadarSimulation
              dataStreams={sheinTrendDemoData.aiDataStreams}
              title="Trend Intelligence Signals"
              playbookId="#146"
              playbookName="Trend Capitalization"
              autoStart={true}
            />

            <div className="text-center mt-8">
              <Button
                size="lg"
                onClick={() => goToAct("coordination")}
                style={{ background: GOLD, color: NAVY, fontWeight: 700, padding: "14px 32px" }}
                data-testid="button-activate-playbook"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Activate Playbook #146 — Trend Capitalization
              </Button>
              <p style={{ fontSize: 12, color: "rgba(240,237,228,0.5)", marginTop: 8 }}>CEO approves — Launch 200 SKUs in 7 days</p>
            </div>
          </div>
        )}

        {/* ACT 3: COORDINATED RESPONSE */}
        {currentAct === "coordination" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: IVORY, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <Zap style={{ width: 28, height: 28, color: GOLD }} />
                Act 3: 12-Minute Coordinated Execution
              </h2>
              <p style={{ fontSize: 15, color: "rgba(240,237,228,0.7)", marginBottom: 24, lineHeight: 1.6 }}>
                Command OS coordinates all 5,847 stakeholders in 12 minutes. CEO decision triggers instant alignment across designers,
                production coordinators, 5,000 suppliers, and marketing teams — enabling 7-day launch before Zara/H&M respond.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { n: "1", title: "Design Teams", desc: "180 designers begin creating 200 SKUs using AI trend insights", stat: "180 Designers" },
                  { n: "2", title: "Supplier Network", desc: "5,000 suppliers receive production orders, 3,200 begin manufacturing", stat: "5,000 Suppliers" },
                  { n: "3", title: "Marketing Launch", desc: "2,300 TikTok influencers engaged, campaign ready for day-7 launch", stat: "667 Specialists" },
                ].map(({ n, title, desc, stat }) => (
                  <div key={n} style={{ padding: 24, background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", color: NAVY, fontWeight: 700, fontSize: 15 }}>{n}</div>
                      <h3 style={{ fontWeight: 700, color: IVORY, margin: 0 }}>{title}</h3>
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(240,237,228,0.65)", marginBottom: 12 }}>{desc}</p>
                    <div style={{ fontSize: 20, fontWeight: 700, color: GOLD }}>{stat}</div>
                  </div>
                ))}
              </div>
            </div>

            <TwelveMinuteTimer
              timelineEvents={sheinTrendDemoData.timelineEvents}
              onComplete={() => setCoordinationComplete(true)}
              autoStart={true}
            />

            {coordinationComplete && (
              <div className="text-center animate-in fade-in duration-500">
                <Button
                  size="lg"
                  onClick={() => goToAct("outcome")}
                  style={{ background: GOLD, color: NAVY, fontWeight: 700, padding: "14px 32px" }}
                  data-testid="button-view-outcome"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  View First-Mover Outcome
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ACT 4: ROI OUTCOME */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderTop: `3px solid ${GOLD}`, borderRadius: 12, padding: 40, textAlign: "center" }}>
              <TrendingUp style={{ width: 56, height: 56, color: GOLD, margin: "0 auto 20px" }} />
              <h2 style={{ fontSize: 28, fontWeight: 700, color: IVORY, marginBottom: 12, fontFamily: "'Cormorant Garamond', serif" }}>
                $108M Additional Revenue Through First-Mover Velocity
              </h2>
              <p style={{ fontSize: 16, color: "rgba(240,237,228,0.7)", marginBottom: 32, maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.6 }}>
                SHEIN coordinates 5,847 stakeholders in 12 minutes, launches 200 SKUs on day 7 — capturing 65% market
                share and $180M revenue while Zara/H&M are still planning.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  { value: "$108M", label: "Additional Revenue vs Late Launch" },
                  { value: "12 Min", label: "vs 48-72 Hours Traditional" },
                  { value: "65%", label: "Market Share Captured" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ padding: 20, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10 }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 6 }}>{value}</div>
                    <div style={{ fontSize: 11, color: "rgba(240,237,228,0.55)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Primary CTA */}
              <div style={{ marginBottom: 24 }}>
                <Link href="/request-access">
                  <Button size="lg" style={{ background: GOLD, color: NAVY, padding: "18px 48px", fontSize: 16, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 8 }}>
                    <Rocket className="h-5 w-5 mr-2" />
                    Join the Pilot Program
                  </Button>
                </Link>
                <p style={{ fontSize: 12, color: "rgba(240,237,228,0.4)", marginTop: 10 }}>Deploy Command OS across your organization</p>
              </div>
            </div>

            <ROIComparison
              traditional={sheinTrendDemoData.roiComparisonData.traditional}
              executionOS={sheinTrendDemoData.roiComparisonData.vexor}
              bottomLine={sheinTrendDemoData.roiComparisonData.bottomLine}
            />

            <div className="flex justify-center gap-4">
              <Button onClick={resetDemo} variant="outline" style={{ background: "transparent", borderColor: "rgba(240,237,228,0.3)", color: IVORY }} data-testid="button-replay">
                Replay Demo
              </Button>
              <Link href="/industry-demos">
                <Button style={{ background: "rgba(255,255,255,0.08)", color: IVORY, border: "1px solid rgba(255,255,255,0.15)" }} data-testid="button-all-demos">
                  View All Industry Scenarios
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
