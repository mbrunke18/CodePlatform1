import StandardNav from '@/components/layout/StandardNav';
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pill, Heart, AlertTriangle, CheckCircle, Clock, Users, DollarSign, ShieldAlert, ArrowLeft, Play } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { pharmaDemoData } from "@shared/pharma-demo-data";

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

export default function PharmaceuticalRecallDemo() {
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
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-900">
      <DemoNavHeader title="Pharmaceutical Recall Demo" showBackButton={true} />

      {/* Act Navigation */}
      <div className="border-b border-red-800/20 bg-slate-950/30 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {[
              { id: "intro", label: "1. Introduction", icon: Play },
              { id: "detection", label: "2. AI Detection @ 92%", icon: ShieldAlert },
              { id: "coordination", label: "3. 12-Min Coordination", icon: Clock },
              { id: "outcome", label: "4. Life Saved", icon: Heart }
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => setCurrentAct(act.id as DemoAct)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentAct === act.id
                    ? "bg-red-600 text-white"
                    : "text-red-300 hover:bg-red-950/50"
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
            <Card className="p-8 bg-slate-900/50 border-red-800/30">
              <div className="text-center mb-8">
                <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-3">{pharmaDemoData.crisis.title}</h2>
                <p className="text-xl text-red-200">{pharmaDemoData.crisis.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-red-950/30 rounded-lg border border-red-800/30">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    The Crisis
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-red-300 mb-1">Organization</div>
                      <div className="text-white font-semibold">Glenmark Pharmaceuticals</div>
                    </div>
                    <div>
                      <div className="text-red-300 mb-1">Product</div>
                      <div className="text-white">Potassium Chloride Capsules</div>
                    </div>
                    <div>
                      <div className="text-red-300 mb-1">Defect</div>
                      <div className="text-white">Capsules failed to dissolve - potentially deadly</div>
                    </div>
                    <div>
                      <div className="text-red-300 mb-1">Scale</div>
                      <div className="text-white font-bold">47 Million Units Recalled</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50 rounded-lg border border-red-800/30">
                  <h3 className="font-bold text-white mb-4">What Happened (May-June 2024)</h3>
                  <ul className="space-y-2 text-sm text-red-200">
                    <li>• Week 1-3: Internal investigation</li>
                    <li>• Week 4 (May): Quietly notified wholesalers only</li>
                    <li className="text-red-400 font-semibold">• Week 5: 91-year-old patient takes defective capsules</li>
                    <li className="text-red-400 font-bold">• Week 5: Patient dies from lethal potassium levels</li>
                    <li>• Week 6 (June): Public announcement</li>
                    <li className="text-red-300">• Family learns weeks later medication killed their loved one</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-950/50 to-rose-950/50 border border-red-700 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">The Detection-Execution Gap</h3>
                    <p className="text-red-100 leading-relaxed">
                      Glenmark had the technology to detect the dissolution problem. But coordinating 2,052 stakeholders 
                      across FDA, wholesalers, pharmacies, and patients took <strong>6 weeks</strong>. In that gap, 
                      a patient died. This demo shows how M would have compressed that 6-week coordination into 12 minutes,
                      ensuring the patient <strong>never received the deadly capsules</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => setCurrentAct("detection")}
                  className="bg-red-600 hover:bg-red-700 text-white px-8"
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
            <Card className="p-8 bg-slate-900/50 border-red-800/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-red-400" />
                AI Quality Monitoring Detects Critical Failure
              </h2>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-red-200">AI Confidence Level</span>
                  <span className="text-2xl font-bold text-red-400">{detectionProgress}%</span>
                </div>
                <Progress value={detectionProgress} className="h-3" />
                {detectionProgress >= 92 && (
                  <div className="mt-4 p-4 bg-red-950/50 border border-red-600 rounded-lg">
                    <p className="text-red-200 font-semibold">
                      ⚠️ ALERT: Class I recall criteria detected - Reasonable probability of serious adverse health consequences or death
                    </p>
                  </div>
                )}
              </div>

              <AIRadarSimulation
                dataStreams={pharmaDemoData.aiDataStreams}
                title="Quality Intelligence Signals"
                playbookId="#095"
                playbookName="Product Recall (Class I)"
                autoStart={true}
              />

              {detectionProgress >= 92 && (
                <div className="mt-8 text-center">
                  <Button
                    size="lg"
                    onClick={() => setCurrentAct("coordination")}
                    className="bg-red-600 hover:bg-red-700 text-white px-8"
                    data-testid="button-activate-playbook"
                  >
                    Activate Playbook #095 - Product Recall
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ACT 3: 12-MINUTE COORDINATION */}
        {currentAct === "coordination" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-red-800/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="w-8 h-8 text-red-400" />
                12-Minute Coordinated Response Across 2,052 Stakeholders
              </h2>

              <TwelveMinuteTimer
                timelineEvents={pharmaDemoData.timelineEvents}
                stakeholderTiers={pharmaDemoData.stakeholderTiers}
                onComplete={() => setCoordinationComplete(true)}
                autoStart={true}
              />

              {coordinationComplete && (
                <div className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {pharmaDemoData.stakeholderTiers && (
                      <>
                        <Card className="p-6 bg-red-950/30 border-red-700">
                          <div className="text-red-300 text-sm mb-2">Tier 1: Decision Makers</div>
                          <div className="text-3xl font-bold text-white mb-3">{pharmaDemoData.stakeholderTiers.tier1.count}</div>
                          <div className="text-xs text-red-200">
                            {pharmaDemoData.stakeholderTiers.tier1.members.join(", ")}
                          </div>
                        </Card>
                        <Card className="p-6 bg-red-950/30 border-red-700">
                          <div className="text-red-300 text-sm mb-2">Tier 2: Execution Teams</div>
                          <div className="text-3xl font-bold text-white mb-3">{pharmaDemoData.stakeholderTiers.tier2.count}</div>
                          <div className="text-xs text-red-200">
                            {pharmaDemoData.stakeholderTiers.tier2.members.join(", ")}
                          </div>
                        </Card>
                        <Card className="p-6 bg-red-950/30 border-red-700">
                          <div className="text-red-300 text-sm mb-2">Tier 3: Public Notification</div>
                          <div className="text-3xl font-bold text-white mb-3">{pharmaDemoData.stakeholderTiers.tier3.count}</div>
                          <div className="text-xs text-red-200">
                            {pharmaDemoData.stakeholderTiers.tier3.members.join(", ")}
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
                      <Heart className="w-5 h-5 ml-2" />
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
                <Heart className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-3">A Life Saved</h2>
                <p className="text-xl text-green-200">The patient never received the deadly capsules</p>
              </div>

              <ROIComparison
                traditional={pharmaDemoData.roiComparison.traditional}
                vexor={pharmaDemoData.roiComparison.vexor}
                bottomLine={pharmaDemoData.roiComparison.bottomLine}
              />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-green-950/30 border-green-800">
                  <div className="text-green-300 text-sm mb-1">Lives Saved</div>
                  <div className="text-2xl font-bold text-green-400">1+</div>
                </Card>
                <Card className="p-4 bg-blue-950/30 border-blue-800">
                  <div className="text-blue-300 text-sm mb-1">Liability Avoided</div>
                  <div className="text-2xl font-bold text-blue-400">$50M+</div>
                </Card>
                <Card className="p-4 bg-purple-950/30 border-purple-800">
                  <div className="text-purple-300 text-sm mb-1">Stakeholders Coordinated</div>
                  <div className="text-2xl font-bold text-purple-400">2,052</div>
                </Card>
                <Card className="p-4 bg-orange-950/30 border-orange-800">
                  <div className="text-orange-300 text-sm mb-1">Coordination Time</div>
                  <div className="text-2xl font-bold text-orange-400">12 min</div>
                </Card>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={resetDemo}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-950/50"
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
