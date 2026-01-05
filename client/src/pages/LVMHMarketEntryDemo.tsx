import StandardNav from '@/components/layout/StandardNav';
import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Target, TrendingUp, Globe, CheckCircle, Users, DollarSign, ArrowLeft, Play } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { lvmhMarketEntryDemoData } from "@shared/lvmh-market-entry-data";

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

export default function LVMHMarketEntryDemo() {
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
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <DemoNavHeader title="LVMH Market Entry Demo" showBackButton={true} />

      {/* Act Navigation */}
      <div className="border-b border-purple-800/20 bg-slate-950/30 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {[
              { id: "intro", label: "1. Introduction", icon: Play },
              { id: "detection", label: "2. AI Detection @ 91%", icon: Target },
              { id: "coordination", label: "3. 12-Minute Response", icon: TrendingUp },
              { id: "outcome", label: "4. Market Leadership", icon: Crown }
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => goToAct(act.id as DemoAct)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentAct === act.id
                    ? "bg-purple-600 text-white"
                    : "text-purple-300 hover:bg-purple-950/50"
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
            <Card className="p-8 bg-slate-900/50 border-purple-800/30">
              <div className="text-center mb-8">
                <Crown className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-3">{lvmhMarketEntryDemoData.crisis.title}</h2>
                <p className="text-xl text-purple-200">{lvmhMarketEntryDemoData.crisis.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-purple-950/30 rounded-lg border border-purple-800/30">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    The Opportunity
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-purple-300 mb-1">Organization</div>
                      <div className="text-white font-semibold">{lvmhMarketEntryDemoData.organization.name}</div>
                    </div>
                    <div>
                      <div className="text-purple-300 mb-1">Opportunity</div>
                      <div className="text-white">China luxury market +47% rebound</div>
                    </div>
                    <div>
                      <div className="text-purple-300 mb-1">Strategic Move</div>
                      <div className="text-white">10 brands • 15 cities • 47 retail locations</div>
                    </div>
                    <div>
                      <div className="text-purple-300 mb-1">Investment</div>
                      <div className="text-white font-bold">€580M capex • €1.68B value creation</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50 rounded-lg border border-purple-800/30">
                  <h3 className="font-bold text-white mb-4">Traditional Coordination Timeline</h3>
                  <ul className="space-y-2 text-sm text-purple-200">
                    <li>• Month 1-2: Sequential brand planning (10 brands independently)</li>
                    <li>• Month 3-4: Real estate negotiations drag out</li>
                    <li className="text-amber-400 font-semibold">• During gap: Kering and Hermès capture premium locations</li>
                    <li className="text-red-400 font-bold">• During gap: Golden Week launch window missed</li>
                    <li>• Month 5-6: Fragmented launches begin</li>
                    <li className="text-purple-300">• Result: €420M opportunity cost + market leadership lost</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border border-purple-700 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Target className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Strategic Execution, Not Crisis Response</h3>
                    <p className="text-purple-100 leading-relaxed">
                      This isn't a crisis—it's a strategic offensive move. China's luxury market rebounds 47%, creating 
                      a 90-day window to capture market leadership. But coordinating 10 brands (Louis Vuitton, Dior, Fendi, 
                      Givenchy, Celine, Loewe, Loro Piana, Rimowa, Berluti, Kenzo) across 15 cities traditionally takes 
                      <strong> 6-9 months</strong>. M compresses coordination to <strong>12 minutes</strong>, enabling 
                      simultaneous launch during Golden Week while competitors are still planning.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-800/30 text-center">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">1,267</div>
                  <div className="text-sm text-purple-300">Stakeholders Coordinated</div>
                </div>
                <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-800/30 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">12 Minutes</div>
                  <div className="text-sm text-purple-300">Full Coordination</div>
                </div>
                <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-800/30 text-center">
                  <DollarSign className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">€1.68B</div>
                  <div className="text-sm text-purple-300">Value Created</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => goToAct("detection")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
                  data-testid="button-begin-simulation"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Begin Opportunity Simulation
                </Button>
                <p className="text-sm text-purple-400 mt-3">Experience how M enables strategic velocity</p>
              </div>
            </Card>
          </div>
        )}

        {/* ACT 2: AI DETECTION */}
        {currentAct === "detection" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-purple-800/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-8 h-8 text-purple-400" />
                Act 2: AI Market Intelligence Detection
              </h2>
              <p className="text-lg text-purple-200 mb-4">
                9:00 AM Paris - LVMH AI Intelligence detects massive luxury market opportunity: China consumer spending surges 47%. 
                Competitive window: 90 days before Kering and Hermès respond. Six AI systems recommend Playbook #145 activation.
              </p>
              <div className="mt-6 p-4 bg-purple-900/50 border border-purple-500 rounded">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-purple-400 animate-pulse" />
                  <div>
                    <p className="font-bold text-white">Strategic Opportunity Criteria Met</p>
                    <p className="text-sm text-purple-200">
                      Market conditions optimal - Playbook #145 (Strategic Market Entry) recommended
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <AIRadarSimulation
              dataStreams={lvmhMarketEntryDemoData.aiDataStreams}
              title="Market Intelligence Signals"
              playbookId="#145"
              playbookName="Strategic Market Entry"
              autoStart={true}
            />

            <div className="text-center mt-8">
              <Button
                size="lg"
                onClick={() => goToAct("coordination")}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="button-activate-playbook"
              >
                <Crown className="h-5 w-5" />
                Activate Playbook #145 - Market Entry
              </Button>
              <p className="text-sm text-purple-300 mt-2">
                Bernard Arnault approves - Execute coordinated launch
              </p>
            </div>
          </div>
        )}

        {/* ACT 3: COORDINATED RESPONSE */}
        {currentAct === "coordination" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-purple-800/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                Act 3: 12-Minute Coordinated Execution
              </h2>
              <p className="text-lg text-purple-200 mb-6">
                M coordinates all 1,267 stakeholders in 12 minutes. Bernard Arnault's decision triggers instant alignment across 
                28 executives, 347 operational specialists, and 892 external partners—enabling simultaneous 10-brand launch.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-purple-950/30 rounded-lg border border-purple-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="font-bold text-white">Executive Leadership</h3>
                  </div>
                  <p className="text-sm text-purple-200 mb-2">28 executives receive unified brief and approve €580M investment in 4 minutes</p>
                  <div className="text-2xl font-bold text-purple-400">28 Leaders</div>
                </div>
                <div className="p-6 bg-purple-950/30 rounded-lg border border-purple-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="font-bold text-white">Operations Teams</h3>
                  </div>
                  <p className="text-sm text-purple-200 mb-2">Real estate, legal, supply chain, marketing, HR executing simultaneously</p>
                  <div className="text-2xl font-bold text-purple-400">347 Specialists</div>
                </div>
                <div className="p-6 bg-purple-950/30 rounded-lg border border-purple-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">3</div>
                    <h3 className="font-bold text-white">External Partners</h3>
                  </div>
                  <p className="text-sm text-purple-200 mb-2">Developers, contractors, agencies, logistics—all activated</p>
                  <div className="text-2xl font-bold text-purple-400">892 Partners</div>
                </div>
              </div>
            </Card>

            <TwelveMinuteTimer
              timelineEvents={lvmhMarketEntryDemoData.timelineEvents}
              onComplete={() => setCoordinationComplete(true)}
              autoStart={true}
            />

            {coordinationComplete && (
              <div className="text-center animate-in fade-in duration-500">
                <Button
                  size="lg"
                  onClick={() => goToAct("outcome")}
                  className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid="button-view-outcome"
                >
                  <Crown className="h-5 w-5" />
                  View Strategic Outcome
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ACT 4: ROI OUTCOME */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-purple-800/30 text-center">
              <Crown className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">
                €1.68B Value Creation Through Strategic Velocity
              </h2>
              <p className="text-xl text-purple-200 mb-6">
                LVMH coordinates 10-brand simultaneous launch in 12 minutes, captures Golden Week timing, 
                secures 47 premium locations, and establishes market leadership before Kering/Hermès respond.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-purple-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400 mb-2">€1.68B</div>
                  <div className="text-sm text-purple-300">Total Value Creation</div>
                </div>
                <div className="p-4 bg-purple-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400 mb-2">12 Min</div>
                  <div className="text-sm text-purple-300">vs 6-9 Months Traditional</div>
                </div>
                <div className="p-4 bg-purple-950/30 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400 mb-2">1,267</div>
                  <div className="text-sm text-purple-300">Stakeholders Aligned</div>
                </div>
              </div>
            </Card>

            <ROIComparison
              traditional={lvmhMarketEntryDemoData.roiComparisonData.traditional}
              vexor={lvmhMarketEntryDemoData.roiComparisonData.vexor}
              bottomLine={lvmhMarketEntryDemoData.roiComparisonData.bottomLine}
            />

            <div className="flex justify-center gap-4">
              <Button onClick={resetDemo} variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-950" data-testid="button-replay">
                Replay Demo
              </Button>
              <Link href="/industry-demos">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" data-testid="button-all-demos">
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
