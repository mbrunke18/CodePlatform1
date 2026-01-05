import StandardNav from '@/components/layout/StandardNav';
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Heart, AlertTriangle, CheckCircle, Clock, Users, DollarSign, ShieldAlert, ArrowLeft, Play, Store } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { retailDemoData } from "@shared/retail-demo-data";

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

export default function RetailFoodSafetyDemo() {
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
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
      <DemoNavHeader title="Retail Food Safety Demo" showBackButton={true} />

      {/* Act Navigation */}
      <div className="border-b border-emerald-800/20 bg-slate-950/30 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {[
              { id: "intro", label: "1. Introduction", icon: Play },
              { id: "detection", label: "2. AI Detection @ 88%", icon: ShieldAlert },
              { id: "coordination", label: "3. 1-Hour Response", icon: Clock },
              { id: "outcome", label: "4. Lives Saved", icon: Heart }
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => setCurrentAct(act.id as DemoAct)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentAct === act.id
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-300 hover:bg-emerald-950/50"
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
            <Card className="p-8 bg-slate-900/50 border-emerald-800/30">
              <div className="text-center mb-8">
                <ShoppingCart className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-3">{retailDemoData.crisis.title}</h2>
                <p className="text-xl text-emerald-200">{retailDemoData.crisis.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-emerald-950/30 rounded-lg border border-emerald-800/30">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-emerald-400" />
                    The Crisis
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-emerald-300 mb-1">Organization</div>
                      <div className="text-white font-semibold">{retailDemoData.organization.name}</div>
                    </div>
                    <div>
                      <div className="text-emerald-300 mb-1">Contaminated Product</div>
                      <div className="text-white">Bagged Lettuce (Batch #47382)</div>
                    </div>
                    <div>
                      <div className="text-emerald-300 mb-1">Detection</div>
                      <div className="text-white">Salmonella - exceeds FDA threshold</div>
                    </div>
                    <div>
                      <div className="text-emerald-300 mb-1">Scale</div>
                      <div className="text-white font-bold">847 stores • 23 states • 12,847 customers</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50 rounded-lg border border-emerald-800/30">
                  <h3 className="font-bold text-white mb-4">Traditional Recall Timeline</h3>
                  <ul className="space-y-2 text-sm text-emerald-200">
                    <li>• Week 1: QA detects contamination, internal investigation</li>
                    <li>• Week 1 End: Quietly notify wholesalers only</li>
                    <li className="text-amber-400 font-semibold">• During gap: 50+ customers consume contaminated lettuce</li>
                    <li className="text-red-400 font-bold">• During gap: Hospitalizations begin</li>
                    <li>• Week 2: Public recall finally announced</li>
                    <li className="text-emerald-300">• Month 1-2: $200M in lawsuits, FDA warning letter</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-950/50 to-green-950/50 border border-emerald-700 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">The Detection-Execution Gap</h3>
                    <p className="text-emerald-100 leading-relaxed">
                      Walmart's AI supply chain saved $20M+ in transportation costs. Their QA testing detected the salmonella 
                      immediately. But coordinating 5,000 stakeholders across 847 stores, 12,847 customers, FDA, CDC, and 
                      23 state health departments took <strong>7 days</strong>. In that gap, 50+ people were hospitalized. 
                      This demo shows how M compresses that 7-day coordination into <strong>1 hour</strong>, ensuring 
                      zero customers consume contaminated product after detection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-800/30 text-center">
                  <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">5,000+</div>
                  <div className="text-sm text-emerald-300">Stakeholders Coordinated</div>
                </div>
                <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-800/30 text-center">
                  <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">1 Hour</div>
                  <div className="text-sm text-emerald-300">Full Coordination</div>
                </div>
                <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-800/30 text-center">
                  <DollarSign className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">$240M+</div>
                  <div className="text-sm text-emerald-300">Value Preserved</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => setCurrentAct("detection")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
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
            <Card className="p-8 bg-slate-900/50 border-emerald-800/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-emerald-400" />
                AI Quality Control Detects Food Safety Crisis
              </h2>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-emerald-200">AI Confidence Level</span>
                  <span className="text-2xl font-bold text-emerald-400">{detectionProgress}%</span>
                </div>
                <Progress value={detectionProgress} className="h-3" />
                {detectionProgress >= 88 && (
                  <div className="mt-4 p-4 bg-emerald-950/50 border border-emerald-600 rounded-lg">
                    <p className="text-emerald-200 font-semibold">
                      ⚠️ ALERT: Class I recall criteria detected - Food contamination + wide distribution = immediate action required
                    </p>
                  </div>
                )}
              </div>

              <AIRadarSimulation
                dataStreams={retailDemoData.aiDataStreams}
                title="Food Safety Intelligence Signals"
                playbookId="#095"
                playbookName="Food Product Recall (Class I)"
                autoStart={true}
              />

              {detectionProgress >= 88 && (
                <div className="mt-8 text-center">
                  <Button
                    size="lg"
                    onClick={() => setCurrentAct("coordination")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                    data-testid="button-activate-playbook"
                  >
                    Activate Playbook #095 - Food Recall
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ACT 3: COORDINATED RESPONSE */}
        {currentAct === "coordination" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-emerald-800/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="w-8 h-8 text-emerald-400" />
                1-Hour Coordinated Response Across 5,000 Stakeholders
              </h2>

              <TwelveMinuteTimer
                timelineEvents={retailDemoData.timelineEvents}
                onComplete={() => setCoordinationComplete(true)}
                title="1-Hour Crisis Response Timeline"
                subtitle="From detection to full coordination across 5,000 stakeholders"
                autoStart={true}
              />

              {coordinationComplete && (
                <div className="mt-8">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 bg-emerald-950/30 border-emerald-800/30">
                      <div className="text-center">
                        <Users className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-1">
                          {retailDemoData.stakeholderTiers.tier1.count}
                        </div>
                        <div className="text-sm text-emerald-300 mb-4">{retailDemoData.stakeholderTiers.tier1.title}</div>
                        <ul className="text-xs text-emerald-200 space-y-1 text-left">
                          <li>• CEO, COO, CFO</li>
                          <li>• General Counsel</li>
                          <li>• FDA Liaison, CDC</li>
                          <li>• Crisis PR, Insurance</li>
                        </ul>
                      </div>
                    </Card>

                    <Card className="p-6 bg-emerald-950/30 border-emerald-800/30">
                      <div className="text-center">
                        <Users className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-1">
                          {retailDemoData.stakeholderTiers.tier2.count}
                        </div>
                        <div className="text-sm text-emerald-300 mb-4">{retailDemoData.stakeholderTiers.tier2.title}</div>
                        <ul className="text-xs text-emerald-200 space-y-1 text-left">
                          <li>• 847 store managers</li>
                          <li>• Supply chain team</li>
                          <li>• Customer care (50)</li>
                          <li>• Communications (15)</li>
                        </ul>
                      </div>
                    </Card>

                    <Card className="p-6 bg-emerald-950/30 border-emerald-800/30">
                      <div className="text-center">
                        <Users className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-1">
                          {retailDemoData.stakeholderTiers.tier3.count}+
                        </div>
                        <div className="text-sm text-emerald-300 mb-4">{retailDemoData.stakeholderTiers.tier3.title}</div>
                        <ul className="text-xs text-emerald-200 space-y-1 text-left">
                          <li>• 12,847 customers</li>
                          <li>• All store employees</li>
                          <li>• Board members</li>
                          <li>• Media, investors</li>
                        </ul>
                      </div>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={() => setCurrentAct("outcome")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                      data-testid="button-view-outcome"
                    >
                      View ROI Outcome
                      <DollarSign className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ACT 4: OUTCOME */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900/50 border-emerald-800/30">
              <div className="text-center mb-8">
                <Heart className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-3">Lives Saved Through Rapid Coordination</h2>
                <p className="text-xl text-emerald-200">
                  Zero customers consume contaminated lettuce after 2:00 PM detection
                </p>
              </div>

              <ROIComparison
                traditional={{
                  label: retailDemoData.roiComparison.traditional.title,
                  duration: retailDemoData.roiComparison.traditional.timeline,
                  approach: retailDemoData.roiComparison.traditional.approach,
                  outcome: retailDemoData.roiComparison.traditional.outcome,
                  points: retailDemoData.roiComparison.traditional.points,
                  details: retailDemoData.roiComparison.traditional.details
                }}
                vexor={{
                  label: retailDemoData.roiComparison.vexor.title,
                  duration: retailDemoData.roiComparison.vexor.timeline,
                  approach: retailDemoData.roiComparison.vexor.approach,
                  outcome: retailDemoData.roiComparison.vexor.outcome,
                  points: retailDemoData.roiComparison.vexor.points,
                  details: retailDemoData.roiComparison.vexor.details
                }}
                bottomLine={{
                  value: "$240M+ Value Preserved",
                  metric: "Lives saved + lawsuits prevented + brand trust reinforced"
                }}
              />

              <div className="mt-8 p-6 bg-gradient-to-r from-emerald-950/50 to-green-950/50 border border-emerald-600 rounded-lg">
                <h3 className="font-bold text-white mb-4 text-center text-xl">The M Difference</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-emerald-300 mb-3">Traditional Crisis Response</h4>
                    <ul className="space-y-2 text-sm text-emerald-100">
                      <li>• 7 days of email chains and staged notifications</li>
                      <li>• 50+ customers hospitalized</li>
                      <li>• $200M in lawsuit settlements</li>
                      <li>• Congressional hearing, FDA warning letter</li>
                      <li>• "Walmart knew for a week" - brand damage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-300 mb-3">M Coordinated Response</h4>
                    <ul className="space-y-2 text-sm text-emerald-100">
                      <li>• 1-hour orchestrated execution across 5,000 stakeholders</li>
                      <li>• 0 hospitalizations after detection</li>
                      <li>• $5M total cost (only pre-detection cases)</li>
                      <li>• FDA commendation for "exemplary response"</li>
                      <li>• "Industry leader in food safety" - trust reinforced</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center space-x-4">
                <Button
                  variant="outline"
                  onClick={resetDemo}
                  className="border-emerald-600 text-emerald-400 hover:bg-emerald-950/50"
                  data-testid="button-replay-demo"
                >
                  Replay Demo
                </Button>
                <Link href="/industry-demos">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" data-testid="button-view-all-demos">
                    View All Industry Demos
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
