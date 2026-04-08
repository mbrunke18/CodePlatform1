import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Target, Zap, Satellite, CheckCircle, Users, DollarSign, Play } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import { spacexLaunchDemoData } from "@shared/spacex-launch-data";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

export default function SpaceXLaunchDemo() {
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
      <DemoNavHeader title="SpaceX Launch Demo" showBackButton={true} />

      {/* Act Navigation */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingTop: 80 }}>
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {[
              { id: "intro", label: "1. Introduction", icon: Play },
              { id: "detection", label: "2. AI Detection @ 94%", icon: Target },
              { id: "coordination", label: "3. 12-Minute Response", icon: Zap },
              { id: "outcome", label: "4. Window Captured", icon: Rocket }
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
                <Satellite style={{ width: 56, height: 56, color: GOLD, margin: "0 auto 16px" }} />
                <h2 style={{ fontSize: 28, fontWeight: 700, color: IVORY, marginBottom: 12, fontFamily: "'Cormorant Garamond', serif" }}>
                  {spacexLaunchDemoData.crisis.title}
                </h2>
                <p style={{ fontSize: 18, color: "rgba(240,237,228,0.7)" }}>{spacexLaunchDemoData.crisis.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div style={{ padding: 24, background: "rgba(43,138,110,0.08)", border: "1px solid rgba(43,138,110,0.25)", borderRadius: 10 }}>
                  <h3 style={{ fontWeight: 700, color: IVORY, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                    <Target style={{ width: 16, height: 16, color: TEAL }} />
                    The Opportunity
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      ["Mission", "Starlink Group 7-8 • 23 satellites • Falcon 9 Block 5"],
                      ["Orbital Window", "Opens 3 days early (April 15 vs April 18)"],
                      ["Strategic Value", "Optimal geometry + vacant slot from ULA delay"],
                      ["Revenue Impact", "$47M acceleration + 2-week service expansion"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: TEAL, marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 13, color: IVORY, fontWeight: 600 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}>
                  <h3 style={{ fontWeight: 700, color: IVORY, marginBottom: 16, fontSize: 14 }}>Traditional Aerospace Coordination</h3>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                    <li style={{ color: "rgba(240,237,228,0.65)" }}>• Day 1-2: Engineering reviews sequential approvals</li>
                    <li style={{ color: "rgba(240,237,228,0.65)" }}>• Day 3-4: FAA license modification (standard 7-10 days)</li>
                    <li style={{ color: "#FCD34D", fontWeight: 600 }}>• During gap: Favorable window closes</li>
                    <li style={{ color: "#F87171", fontWeight: 700 }}>• During gap: ULA reschedules, reclaims slot</li>
                    <li style={{ color: "rgba(240,237,228,0.65)" }}>• Day 5-7: Coordination finally complete — too late</li>
                    <li style={{ color: TEAL }}>• Result: Launch April 18 on original date (opportunity missed)</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: `3px solid ${GOLD}`, borderRadius: 10, padding: 24, marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <Zap style={{ width: 28, height: 28, color: GOLD, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 style={{ fontWeight: 700, color: IVORY, marginBottom: 8, fontSize: 15 }}>When Elon Calls the Play, Everyone Executes</h3>
                    <p style={{ color: "rgba(240,237,228,0.7)", lineHeight: 1.6, fontSize: 13 }}>
                      SpaceX already moves faster than traditional aerospace — but even SpaceX faces coordination bottlenecks.
                      When a favorable orbital window opens, coordinating 1,847 stakeholders traditionally takes <strong style={{ color: IVORY }}>5-7 days</strong>.
                      Command OS compresses it to <strong style={{ color: GOLD }}>12 minutes</strong> — enabling SpaceX to capture time-sensitive launch opportunities competitors cannot match.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Users, value: "1,847", label: "Stakeholders Coordinated" },
                  { icon: Zap, value: "12 Minutes", label: "Full Coordination" },
                  { icon: DollarSign, value: "$47M", label: "Revenue Accelerated" },
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
                  Begin Launch Simulation
                </Button>
                <p style={{ fontSize: 12, color: "rgba(240,237,228,0.4)", marginTop: 12 }}>Experience aerospace coordination velocity</p>
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
                Act 2: Orbital Dynamics Detection
              </h2>
              <p style={{ fontSize: 15, color: "rgba(240,237,228,0.7)", marginBottom: 16, lineHeight: 1.6 }}>
                9:00 AM PT — SpaceX trajectory analysis identifies rare orbital window opening 3 days early. Favorable
                atmospheric conditions + ULA delay = vacant April 15 slot. Moving launch forward unlocks $47M revenue + optimal constellation geometry.
              </p>
              <div style={{ marginTop: 20, padding: 16, background: "rgba(43,138,110,0.1)", border: "1px solid rgba(43,138,110,0.3)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckCircle style={{ width: 20, height: 20, color: TEAL }} />
                  <div>
                    <p style={{ fontWeight: 700, color: IVORY, margin: 0 }}>Orbital Window Criteria Met</p>
                    <p style={{ fontSize: 12, color: "rgba(240,237,228,0.55)", margin: "4px 0 0" }}>
                      Favorable conditions confirmed — Playbook #155 (Launch Acceleration) recommended
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <AIRadarSimulation
              dataStreams={spacexLaunchDemoData.aiDataStreams}
              title="Launch Intelligence Signals"
              playbookId="#155"
              playbookName="Launch Schedule Acceleration"
              autoStart={true}
            />

            <div className="text-center mt-8">
              <Button
                size="lg"
                onClick={() => goToAct("coordination")}
                style={{ background: GOLD, color: NAVY, fontWeight: 700, padding: "14px 32px" }}
                data-testid="button-activate-playbook"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Activate Playbook #155 — Launch Acceleration
              </Button>
              <p style={{ fontSize: 12, color: "rgba(240,237,228,0.5)", marginTop: 8 }}>Elon approves — Move launch to April 15</p>
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
                Command OS coordinates all 1,847 stakeholders in 12 minutes. Elon's decision triggers instant alignment across
                34 executives, 813 operations teams, and 1,000 external partners (FAA, Space Force, Range Control).
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { n: "1", title: "Mission Leadership", desc: "34 executives approve 3-day acceleration, initiate FAA expedited review", stat: "34 Leaders" },
                  { n: "2", title: "Operations Teams", desc: "Ground crews, vehicle processing, payload, fueling — all accelerated by 72 hours", stat: "813 Specialists" },
                  { n: "3", title: "External Partners", desc: "FAA, Space Force, Range Control, airspace — all coordinated", stat: "1,000 Partners" },
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
              timelineEvents={spacexLaunchDemoData.timelineEvents}
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
                  <Rocket className="h-5 w-5 mr-2" />
                  View Launch Outcome
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ACT 4: ROI OUTCOME */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderTop: `3px solid ${GOLD}`, borderRadius: 12, padding: 40, textAlign: "center" }}>
              <Rocket style={{ width: 56, height: 56, color: GOLD, margin: "0 auto 20px" }} />
              <h2 style={{ fontSize: 28, fontWeight: 700, color: IVORY, marginBottom: 12, fontFamily: "'Cormorant Garamond', serif" }}>
                $47M Revenue + Strategic Orbital Position
              </h2>
              <p style={{ fontSize: 16, color: "rgba(240,237,228,0.7)", marginBottom: 32, maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.6 }}>
                SpaceX coordinates 1,847 stakeholders in 12 minutes, moves launch forward 3 days, captures April 15
                optimal window — accelerating Starlink expansion while competitors scramble.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  { value: "$47M", label: "Revenue Accelerated" },
                  { value: "12 Min", label: "vs 5-7 Days Traditional" },
                  { value: "72 Hrs", label: "Vehicle Turnaround" },
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
              traditional={spacexLaunchDemoData.roiComparisonData.traditional}
              executionOS={spacexLaunchDemoData.roiComparisonData.vexor}
              bottomLine={spacexLaunchDemoData.roiComparisonData.bottomLine}
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
