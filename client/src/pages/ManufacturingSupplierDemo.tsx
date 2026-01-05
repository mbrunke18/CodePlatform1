import StandardNav from '@/components/layout/StandardNav';
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Factory, Cpu, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign, ShieldAlert, ArrowLeft, Play } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { manufacturingDemoData } from "@shared/manufacturing-demo-data";

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

export default function ManufacturingSupplierDemo() {
  const [currentAct, setCurrentAct] = useState<DemoAct>("intro");
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [coordinationComplete, setCoordinationComplete] = useState(false);

  // Auto-progress detection
  useEffect(() => {
    if (currentAct === "detection" && detectionProgress < 100) {
      const interval = setInterval(() => {
        setDetectionProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentAct, detectionProgress]);

  const resetDemo = () => {
    setCurrentAct("intro");
    setDetectionProgress(0);
    setCoordinationComplete(false);
  };

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-950 via-orange-950 to-slate-900">
      <DemoNavHeader title="Manufacturing Supplier Demo" showBackButton={true} />

      {/* Act Navigation */}
      <div className="border-b border-orange-800/20 bg-slate-950/30 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {[
              { id: "intro", label: "1. Introduction", icon: Play },
              { id: "detection", label: "2. AI Detection @ 89%", icon: ShieldAlert },
              { id: "coordination", label: "3. 4-Hour Response", icon: Clock },
              { id: "outcome", label: "4. $450M Saved", icon: DollarSign }
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => setCurrentAct(act.id as DemoAct)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentAct === act.id
                    ? "bg-orange-600 text-white"
                    : "text-orange-300 hover:bg-orange-950/50"
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
            <Card className="p-8 bg-slate-900/50 border-orange-800/30">
              <div className="text-center mb-8">
                <Cpu className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-3">{manufacturingDemoData.crisis.title}</h2>
                <p className="text-xl text-orange-200">{manufacturingDemoData.crisis.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-orange-950/30 rounded-lg border border-orange-800/30">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    The Crisis
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-orange-300 mb-1">Organization</div>
                      <div className="text-white font-semibold">Toyota Motor Corporation</div>
                    </div>
                    <div>
                      <div className="text-orange-300 mb-1">Component</div>
                      <div className="text-white">Critical Semiconductor Chips</div>
                    </div>
                    <div>
                      <div className="text-orange-300 mb-1">Impact</div>
                      <div className="text-white">50,000 chip shortage discovered</div>
                    </div>
                    <div>
                      <div className="text-orange-300 mb-1">At Risk</div>
                      <div className="text-white font-bold">10,000 vehicles ($500M production)</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50 rounded-lg border border-orange-800/30">
                  <h3 className="font-bold text-white mb-4">Traditional Response (30 Days)</h3>
                  <ul className="space-y-2 text-sm text-orange-200">
                    <li>• Day 1-2: Assess which suppliers affected</li>
                    <li>• Day 3: Discover 50,000 chip shortage</li>
                    <li>• Day 4-5: Emergency meetings to find alternatives</li>
                    <li>• Week 2: Alternative supplier can't meet quality specs</li>
                    <li>• Week 3: Engineering scrambles to re-qualify parts</li>
                    <li className="text-orange-400 font-semibold">• Week 4: Production lines shut down</li>
                    <li className="text-orange-400 font-bold">• Month 2: Customers buying from competitors</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-950/50 to-amber-950/50 border border-orange-700 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="w-8 h-8 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Just-In-Time Manufacturing Needs Just-In-Time Coordination</h3>
                    <p className="text-orange-100 leading-relaxed">
                      Toyota pioneered Just-In-Time manufacturing to eliminate waste. But when suppliers fail, coordination still takes 
                      <strong> 30 days</strong> of meetings, emails, and qualification delays. M brings Just-In-Time principles to 
                      crisis coordination: pre-vetted backup suppliers, pre-negotiated contracts, pre-approved budgets. Result: 
                      <strong> 4-hour response</strong> instead of 30-day production halt.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => setCurrentAct("detection")}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                  data-testid="button-start-demo"
                >
                  Begin Crisis Simulation
                  <Play className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* ACT 2: AI DETECTION */}
        {currentAct === "detection" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-orange-800/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-orange-400" />
                Supply Chain AI Detects Critical Supplier Failure
              </h2>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-orange-200">AI Confidence Level</span>
                  <span className="text-2xl font-bold text-orange-400">{detectionProgress}%</span>
                </div>
                <Progress value={detectionProgress} className="h-3" />
                {detectionProgress >= 89 && (
                  <div className="mt-4 p-4 bg-orange-950/50 border border-orange-600 rounded-lg">
                    <p className="text-orange-200 font-semibold">
                      ⚠️ ALERT: Critical supplier failure detected - 10,000 vehicle production at risk ($500M)
                    </p>
                  </div>
                )}
              </div>

              <AIRadarSimulation
                dataStreams={manufacturingDemoData.aiDataStreams}
                title="Supply Chain Intelligence Signals"
                playbookId="#019"
                playbookName="Supplier Failure Response"
                autoStart={true}
              />

              {detectionProgress >= 89 && (
                <div className="mt-8 text-center">
                  <Button
                    size="lg"
                    onClick={() => setCurrentAct("coordination")}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                    data-testid="button-activate-playbook"
                  >
                    Activate Playbook #019 - Supplier Failure
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ACT 3: 4-HOUR COORDINATION */}
        {currentAct === "coordination" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-orange-800/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-400" />
                4-Hour Coordinated Response Across 158 Stakeholders
              </h2>

              <TwelveMinuteTimer
                timelineEvents={manufacturingDemoData.timelineEvents}
                stakeholderTiers={manufacturingDemoData.stakeholderTiers}
                onComplete={() => setCoordinationComplete(true)}
                autoStart={true}
              />

              {coordinationComplete && (
                <div className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {manufacturingDemoData.stakeholderTiers && (
                      <>
                        <Card className="p-6 bg-orange-950/30 border-orange-700">
                          <div className="text-orange-300 text-sm mb-2">Tier 1: Decision Makers</div>
                          <div className="text-3xl font-bold text-white mb-3">{manufacturingDemoData.stakeholderTiers.tier1.count}</div>
                          <div className="text-xs text-orange-200">
                            {manufacturingDemoData.stakeholderTiers.tier1.members.join(", ")}
                          </div>
                        </Card>
                        <Card className="p-6 bg-orange-950/30 border-orange-700">
                          <div className="text-orange-300 text-sm mb-2">Tier 2: Execution Teams</div>
                          <div className="text-3xl font-bold text-white mb-3">{manufacturingDemoData.stakeholderTiers.tier2.count}</div>
                          <div className="text-xs text-orange-200">
                            {manufacturingDemoData.stakeholderTiers.tier2.members.join(", ")}
                          </div>
                        </Card>
                        <Card className="p-6 bg-orange-950/30 border-orange-700">
                          <div className="text-orange-300 text-sm mb-2">Tier 3: External Partners</div>
                          <div className="text-3xl font-bold text-white mb-3">{manufacturingDemoData.stakeholderTiers.tier3.count}</div>
                          <div className="text-xs text-orange-200">
                            {manufacturingDemoData.stakeholderTiers.tier3.members.join(", ")}
                          </div>
                        </Card>
                      </>
                    )}
                  </div>

                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={() => setCurrentAct("outcome")}
                      className="bg-green-600 hover:bg-green-700 text-white px-8"
                      data-testid="button-view-outcome"
                    >
                      View Impact & ROI
                      <DollarSign className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ACT 4: ROI OUTCOME */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-green-800/30">
              <div className="text-center mb-8">
                <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-3">$450M Production Saved</h2>
                <p className="text-xl text-green-200">2-day pause vs 30-day production halt</p>
              </div>

              <ROIComparison
                traditional={manufacturingDemoData.roiComparison.traditional}
                vexor={manufacturingDemoData.roiComparison.vexor}
                bottomLine={manufacturingDemoData.roiComparison.bottomLine}
              />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-green-950/30 border-green-800">
                  <div className="text-green-300 text-sm mb-1">Production Saved</div>
                  <div className="text-2xl font-bold text-green-400">$450M</div>
                </Card>
                <Card className="p-4 bg-blue-950/30 border-blue-800">
                  <div className="text-blue-300 text-sm mb-1">Response Time</div>
                  <div className="text-2xl font-bold text-blue-400">4 hours</div>
                </Card>
                <Card className="p-4 bg-purple-950/30 border-purple-800">
                  <div className="text-purple-300 text-sm mb-1">Vehicles Protected</div>
                  <div className="text-2xl font-bold text-purple-400">10,000</div>
                </Card>
                <Card className="p-4 bg-orange-950/30 border-orange-800">
                  <div className="text-orange-300 text-sm mb-1">Production Pause</div>
                  <div className="text-2xl font-bold text-orange-400">2 days</div>
                </Card>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={resetDemo}
                  variant="outline"
                  className="border-orange-500 text-orange-400 hover:bg-orange-950/50"
                  data-testid="button-replay-demo"
                >
                  Replay Demo
                </Button>
                <Link href="/industry-demos">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700" data-testid="button-explore-more">
                    Explore More Industry Demos
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
