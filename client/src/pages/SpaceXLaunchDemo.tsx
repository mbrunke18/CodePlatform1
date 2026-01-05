import StandardNav from '@/components/layout/StandardNav';
import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Target, Zap, Satellite, CheckCircle, Users, DollarSign, ArrowLeft, Play } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { spacexLaunchDemoData } from "@shared/spacex-launch-data";

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

export default function SpaceXLaunchDemo() {
  const [currentAct, setCurrentAct] = useState<DemoAct>("intro");
  const [coordinationComplete, setCoordinationComplete] = useState(false);

  const goToAct = (act: DemoAct) => {
    setCurrentAct(act);
    if (act === "intro") {
      setCoordinationComplete(false);
    }
  };

  const resetDemo = () => {
    setCurrentAct("intro");
    setCoordinationComplete(false);
  };

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <DemoNavHeader title="SpaceX Launch Demo" showBackButton={true} />

      {/* Act Navigation */}
      <div className="border-b border-blue-800/20 bg-slate-950/30 pt-20">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentAct === act.id
                    ? "bg-blue-600 text-white"
                    : "text-blue-300 hover:bg-blue-950/50"
                }`}
                data-testid={`button-act-${act.id}`}
              >
                <act.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{act.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* ACT 1: INTRODUCTION */}
        {currentAct === "intro" && (
          <div className="max-w-5xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-blue-800/30">
              <div className="text-center mb-8">
                <Satellite className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-3">{spacexLaunchDemoData.crisis.title}</h2>
                <p className="text-xl text-blue-200">{spacexLaunchDemoData.crisis.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-blue-950/30 rounded-lg border border-blue-800/30">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    The Opportunity
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-blue-300 mb-1">Mission</div>
                      <div className="text-white font-semibold">Starlink Group 7-8 • 23 satellites • Falcon 9 Block 5</div>
                    </div>
                    <div>
                      <div className="text-blue-300 mb-1">Orbital Window</div>
                      <div className="text-white">Opens 3 days early (April 15 vs April 18)</div>
                    </div>
                    <div>
                      <div className="text-blue-300 mb-1">Strategic Value</div>
                      <div className="text-white">Optimal geometry + vacant slot from ULA delay</div>
                    </div>
                    <div>
                      <div className="text-blue-300 mb-1">Revenue Impact</div>
                      <div className="text-white font-bold">$47M acceleration + 2-week service expansion</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50 rounded-lg border border-blue-800/30">
                  <h3 className="font-bold text-white mb-4">Traditional Aerospace Coordination</h3>
                  <ul className="space-y-2 text-sm text-blue-200">
                    <li>• Day 1-2: Engineering reviews sequential approvals</li>
                    <li>• Day 3-4: FAA license modification (standard 7-10 days)</li>
                    <li className="text-amber-400 font-semibold">• During gap: Favorable window closes</li>
                    <li className="text-red-400 font-bold">• During gap: ULA reschedules, reclaims slot</li>
                    <li>• Day 5-7: Coordination finally complete—too late</li>
                    <li className="text-blue-300">• Result: Launch April 18 on original date (opportunity missed)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-700 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">When Elon Calls the Play, Everyone Executes</h3>
                    <p className="text-blue-100 leading-relaxed">
                      SpaceX already moves faster than traditional aerospace—but even SpaceX faces coordination bottlenecks. 
                      When a favorable orbital window opens, coordinating 1,847 stakeholders (ground crews, FAA, Space Force, 
                      payload teams, weather, range safety) traditionally takes <strong>5-7 days</strong>. M compresses 
                      it to <strong>12 minutes</strong>—enabling SpaceX to capture time-sensitive launch opportunities competitors cannot match.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-800/30 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">1,847</div>
                  <div className="text-sm text-blue-300">Stakeholders Coordinated</div>
                </div>
                <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-800/30 text-center">
                  <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">12 Minutes</div>
                  <div className="text-sm text-blue-300">Full Coordination</div>
                </div>
                <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-800/30 text-center">
                  <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">$47M</div>
                  <div className="text-sm text-blue-300">Revenue Accelerated</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => goToAct("detection")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                  data-testid="button-begin-simulation"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Begin Launch Simulation
                </Button>
                <p className="text-sm text-blue-400 mt-3">Experience aerospace coordination velocity</p>
              </div>
            </Card>
          </div>
        )}

        {/* ACT 2: AI DETECTION */}
        {currentAct === "detection" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-blue-800/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-400" />
                Act 2: Orbital Dynamics Detection
              </h2>
              <p className="text-lg text-blue-200 mb-4">
                9:00 AM PT - SpaceX trajectory analysis identifies rare orbital window opening 3 days early. Favorable 
                atmospheric conditions + ULA delay = vacant April 15 slot. Moving launch forward unlocks $47M revenue + optimal constellation geometry.
              </p>
              <div className="mt-6 p-4 bg-blue-900/50 border border-blue-500 rounded">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-400 animate-pulse" />
                  <div>
                    <p className="font-bold text-white">Orbital Window Criteria Met</p>
                    <p className="text-sm text-blue-200">
                      Favorable conditions confirmed - Playbook #155 (Launch Acceleration) recommended
                    </p>
                  </div>
                </div>
              </div>
            </Card>

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
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-activate-playbook"
              >
                <Rocket className="h-5 w-5" />
                Activate Playbook #155 - Launch Acceleration
              </Button>
              <p className="text-sm text-blue-300 mt-2">
                Elon approves - Move launch to April 15
              </p>
            </div>
          </div>
        )}

        {/* ACT 3: COORDINATED RESPONSE */}
        {currentAct === "coordination" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-blue-800/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-400" />
                Act 3: 12-Minute Coordinated Execution
              </h2>
              <p className="text-lg text-blue-200 mb-6">
                M coordinates all 1,847 stakeholders in 12 minutes. Elon's decision triggers instant alignment across 
                34 executives, 813 operations teams, and 1,000 external partners (FAA, Space Force, Range Control).
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-blue-950/30 rounded-lg border border-blue-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="font-bold text-white">Mission Leadership</h3>
                  </div>
                  <p className="text-sm text-blue-200 mb-2">34 executives approve 3-day acceleration, initiate FAA expedited review</p>
                  <div className="text-2xl font-bold text-blue-400">34 Leaders</div>
                </div>
                <div className="p-6 bg-blue-950/30 rounded-lg border border-blue-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="font-bold text-white">Operations Teams</h3>
                  </div>
                  <p className="text-sm text-blue-200 mb-2">Ground crews, vehicle processing, payload, fueling—all accelerated by 72 hours</p>
                  <div className="text-2xl font-bold text-blue-400">813 Specialists</div>
                </div>
                <div className="p-6 bg-blue-950/30 rounded-lg border border-blue-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">3</div>
                    <h3 className="font-bold text-white">External Partners</h3>
                  </div>
                  <p className="text-sm text-blue-200 mb-2">FAA, Space Force, Range Control, airspace—all coordinated</p>
                  <div className="text-2xl font-bold text-blue-400">1,000 Partners</div>
                </div>
              </div>
            </Card>

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
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-view-outcome"
                >
                  <Rocket className="h-5 w-5" />
                  View Launch Outcome
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ACT 4: ROI OUTCOME */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-blue-800/30 text-center">
              <Rocket className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">
                $47M Revenue + Strategic Orbital Position Through Coordination Velocity
              </h2>
              <p className="text-xl text-blue-200 mb-6">
                SpaceX coordinates 1,847 stakeholders in 12 minutes, moves launch forward 3 days, captures April 15 
                optimal window—accelerating Starlink expansion and demonstrating coordination velocity traditional aerospace cannot match.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400 mb-2">$47M</div>
                  <div className="text-sm text-blue-300">Revenue Accelerated</div>
                </div>
                <div className="p-4 bg-blue-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400 mb-2">12 Min</div>
                  <div className="text-sm text-blue-300">vs 5-7 Days Traditional</div>
                </div>
                <div className="p-4 bg-blue-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400 mb-2">72 Hrs</div>
                  <div className="text-sm text-blue-300">Vehicle Turnaround Achieved</div>
                </div>
              </div>
            </Card>

            <ROIComparison
              traditional={spacexLaunchDemoData.roiComparisonData.traditional}
              vexor={spacexLaunchDemoData.roiComparisonData.vexor}
              bottomLine={spacexLaunchDemoData.roiComparisonData.bottomLine}
            />

            <div className="flex justify-center gap-4">
              <Button onClick={resetDemo} variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-950" data-testid="button-replay">
                Replay Demo
              </Button>
              <Link href="/industry-demos">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-all-demos">
                  View All Industry Demos
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
