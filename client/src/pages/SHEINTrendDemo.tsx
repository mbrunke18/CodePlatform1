import StandardNav from '@/components/layout/StandardNav';
import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Target, ShoppingBag, CheckCircle, Users, DollarSign, ArrowLeft, Play } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { sheinTrendDemoData } from "@shared/shein-trend-data";

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

export default function SHEINTrendDemo() {
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
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-950 via-pink-950 to-slate-900">
      <DemoNavHeader title="SHEIN Trend Demo" showBackButton={true} />

      {/* Act Navigation */}
      <div className="border-b border-pink-800/20 bg-slate-950/30 pt-20">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentAct === act.id
                    ? "bg-pink-600 text-white"
                    : "text-pink-300 hover:bg-pink-950/50"
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
            <Card className="p-8 bg-slate-900/50 border-pink-800/30">
              <div className="text-center mb-8">
                <TrendingUp className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-3">{sheinTrendDemoData.crisis.title}</h2>
                <p className="text-xl text-pink-200">{sheinTrendDemoData.crisis.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-pink-950/30 rounded-lg border border-pink-800/30">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                    The Opportunity
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-pink-300 mb-1">Viral Trend</div>
                      <div className="text-white font-semibold">Cottage Core Renaissance - 47M TikTok views in 18 hours</div>
                    </div>
                    <div>
                      <div className="text-pink-300 mb-1">Market Opportunity</div>
                      <div className="text-white">$180M revenue, 21-day lifecycle</div>
                    </div>
                    <div>
                      <div className="text-pink-300 mb-1">Strategic Move</div>
                      <div className="text-white">200 SKUs • 5,000 suppliers • 7-day launch</div>
                    </div>
                    <div>
                      <div className="text-pink-300 mb-1">First-Mover Advantage</div>
                      <div className="text-white font-bold">65% market share if launched in 7 days</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50 rounded-lg border border-pink-800/30">
                  <h3 className="font-bold text-white mb-4">Traditional Coordination Timeline</h3>
                  <ul className="space-y-2 text-sm text-pink-200">
                    <li>• Day 1-2: Design teams start planning independently</li>
                    <li>• Day 2-3: Supplier coordination meetings drag on</li>
                    <li className="text-amber-400 font-semibold">• During gap: Zara and H&M detect same trend</li>
                    <li className="text-red-400 font-bold">• During gap: Launch delayed to day 10</li>
                    <li>• Day 10+: Launch alongside competitors (not first)</li>
                    <li className="text-pink-300">• Result: 40% market share instead of 65% ($72M vs $180M)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-950/50 to-rose-950/50 border border-pink-700 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Target className="w-8 h-8 text-pink-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Speed = Market Share in Fast Fashion</h3>
                    <p className="text-pink-100 leading-relaxed">
                      SHEIN's AI detected the Cottage Core trend instantly. But coordinating 5,847 stakeholders (180 designers, 
                      5,000 suppliers, logistics, marketing) traditionally takes <strong>48-72 hours</strong>—enough time for 
                      Zara and H&M to respond. In fast fashion, first-mover captures 65% of revenue. M compresses coordination 
                      to <strong>12 minutes</strong>, enabling 7-day launch before competitors detect the trend.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-pink-950/30 rounded-lg border border-pink-800/30 text-center">
                  <Users className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">5,847</div>
                  <div className="text-sm text-pink-300">Stakeholders Coordinated</div>
                </div>
                <div className="p-4 bg-pink-950/30 rounded-lg border border-pink-800/30 text-center">
                  <Zap className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">12 Minutes</div>
                  <div className="text-sm text-pink-300">Full Coordination</div>
                </div>
                <div className="p-4 bg-pink-950/30 rounded-lg border border-pink-800/30 text-center">
                  <DollarSign className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">$108M</div>
                  <div className="text-sm text-pink-300">Additional Revenue</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => goToAct("detection")}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg"
                  data-testid="button-begin-simulation"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Begin Trend Simulation
                </Button>
                <p className="text-sm text-pink-400 mt-3">Experience first-mover coordination velocity</p>
              </div>
            </Card>
          </div>
        )}

        {/* ACT 2: AI DETECTION */}
        {currentAct === "detection" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-pink-800/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-8 h-8 text-pink-400" />
                Act 2: AI Trend Detection
              </h2>
              <p className="text-lg text-pink-200 mb-4">
                11:00 AM EST - SHEIN AI detects viral trend: "Cottage Core Renaissance" explodes on TikTok with 47M views in 18 hours. 
                2,300 influencers posting, 850% search spike. Trend lifecycle: 21 days. Window to capture 65% market share: 7 days.
              </p>
              <div className="mt-6 p-4 bg-pink-900/50 border border-pink-500 rounded">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-pink-400 animate-pulse" />
                  <div>
                    <p className="font-bold text-white">Viral Trend Criteria Met</p>
                    <p className="text-sm text-pink-200">
                      First-mover window open - Playbook #146 (Trend Capitalization) recommended
                    </p>
                  </div>
                </div>
              </div>
            </Card>

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
                className="gap-2 bg-pink-600 hover:bg-pink-700 text-white"
                data-testid="button-activate-playbook"
              >
                <TrendingUp className="h-5 w-5" />
                Activate Playbook #146 - Trend Capitalization
              </Button>
              <p className="text-sm text-pink-300 mt-2">
                CEO approves - Launch 200 SKUs in 7 days
              </p>
            </div>
          </div>
        )}

        {/* ACT 3: COORDINATED RESPONSE */}
        {currentAct === "coordination" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-pink-800/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Zap className="w-8 h-8 text-pink-400" />
                Act 3: 12-Minute Coordinated Execution
              </h2>
              <p className="text-lg text-pink-200 mb-6">
                M coordinates all 5,847 stakeholders in 12 minutes. CEO decision triggers instant alignment across designers, 
                production coordinators, 5,000 suppliers, and marketing teams—enabling 7-day launch before Zara/H&M respond.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-pink-950/30 rounded-lg border border-pink-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="font-bold text-white">Design Teams</h3>
                  </div>
                  <p className="text-sm text-pink-200 mb-2">180 designers begin creating 200 SKUs using AI trend insights</p>
                  <div className="text-2xl font-bold text-pink-400">180 Designers</div>
                </div>
                <div className="p-6 bg-pink-950/30 rounded-lg border border-pink-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="font-bold text-white">Supplier Network</h3>
                  </div>
                  <p className="text-sm text-pink-200 mb-2">5,000 suppliers receive production orders, 3,200 begin manufacturing</p>
                  <div className="text-2xl font-bold text-pink-400">5,000 Suppliers</div>
                </div>
                <div className="p-6 bg-pink-950/30 rounded-lg border border-pink-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">3</div>
                    <h3 className="font-bold text-white">Marketing Launch</h3>
                  </div>
                  <p className="text-sm text-pink-200 mb-2">2,300 TikTok influencers engaged, campaign ready for day-7 launch</p>
                  <div className="text-2xl font-bold text-pink-400">667 Specialists</div>
                </div>
              </div>
            </Card>

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
                  className="gap-2 bg-pink-600 hover:bg-pink-700 text-white"
                  data-testid="button-view-outcome"
                >
                  <TrendingUp className="h-5 w-5" />
                  View First-Mover Outcome
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ACT 4: ROI OUTCOME */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-pink-800/30 text-center">
              <TrendingUp className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">
                $108M Additional Revenue Through First-Mover Velocity
              </h2>
              <p className="text-xl text-pink-200 mb-6">
                SHEIN coordinates 5,847 stakeholders in 12 minutes, launches 200 SKUs on day 7—capturing 65% market 
                share and $180M revenue while Zara/H&M are still planning.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-pink-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-pink-400 mb-2">$108M</div>
                  <div className="text-sm text-pink-300">Additional Revenue vs Late Launch</div>
                </div>
                <div className="p-4 bg-pink-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-pink-400 mb-2">12 Min</div>
                  <div className="text-sm text-pink-300">vs 48-72 Hours Traditional</div>
                </div>
                <div className="p-4 bg-pink-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-pink-400 mb-2">65%</div>
                  <div className="text-sm text-pink-300">Market Share Captured</div>
                </div>
              </div>
            </Card>

            <ROIComparison
              traditional={sheinTrendDemoData.roiComparisonData.traditional}
              vexor={sheinTrendDemoData.roiComparisonData.vexor}
              bottomLine={sheinTrendDemoData.roiComparisonData.bottomLine}
            />

            <div className="flex justify-center gap-4">
              <Button onClick={resetDemo} variant="outline" className="border-pink-500 text-pink-300 hover:bg-pink-950" data-testid="button-replay">
                Replay Demo
              </Button>
              <Link href="/industry-demos">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white" data-testid="button-all-demos">
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
