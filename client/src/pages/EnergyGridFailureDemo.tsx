import StandardNav from '@/components/layout/StandardNav';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, AlertTriangle, CheckCircle, Clock, Users, DollarSign, ShieldAlert, ArrowLeft, Play, Activity } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { energyDemoData } from "@shared/energy-demo-data";

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

export default function EnergyGridFailureDemo() {
  const [currentAct, setCurrentAct] = useState<DemoAct>("intro");
  const [coordinationComplete, setCoordinationComplete] = useState(false);

  const goToAct = (act: DemoAct) => {
    setCurrentAct(act);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderActNavigation = () => {
    const acts: { id: DemoAct; label: string }[] = [
      { id: "intro", label: "Introduction" },
      { id: "detection", label: "Act 1: Detection" },
      { id: "coordination", label: "Act 2: Coordination" },
      { id: "outcome", label: "Act 3: Outcome" }
    ];

    return (
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {acts.map((act) => (
          <Button
            key={act.id}
            variant={currentAct === act.id ? "default" : "outline"}
            size="sm"
            onClick={() => goToAct(act.id)}
            data-testid={`button-act-${act.id}`}
            className={currentAct === act.id ? "bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178]" : "text-white/60 border-white/20 hover:bg-white/10"}
          >
            {act.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="page-background min-h-screen" style={{ background: "#0A0F2E" }}>
      <DemoNavHeader title="Energy Grid Crisis Demo" showBackButton={true} />
      <div className="container mx-auto px-4 py-12 pt-24 max-w-6xl text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-[#C9A84C] text-[#0A0F2E]" data-testid="badge-demo-type">
            Interactive Demo
          </Badge>
          <h1 className="text-5xl font-bold mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Energy Grid Crisis Demo
          </h1>
          <p className="text-xl text-[#DFC178] mb-2">
            {energyDemoData.crisis.subtitle}
          </p>
          <p className="text-sm text-white/60 max-w-3xl mx-auto">
            Experience how Execution OS prevents catastrophic infrastructure failure through coordinated response—
            transforming a potential 3-5 day blackout affecting 8.2M customers into controlled 3-hour stabilization.
          </p>
        </div>

        {renderActNavigation()}

        {/* ACT: Introduction */}
        {currentAct === "intro" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Organization Card */}
            <Card className="p-8 bg-white/5 border-white/10">
              <div className="text-center mb-6">
                <Zap className="h-16 w-16 mx-auto mb-4 text-[#C9A84C]" />
                <h2 className="text-3xl font-bold mb-2 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{energyDemoData.organization.name}</h2>
                <Badge variant="outline" className="mb-4 text-[#C9A84C] border-[#C9A84C]">
                  {energyDemoData.organization.industry}
                </Badge>
                <p className="text-white/80 mb-6">{energyDemoData.organization.description}</p>
                <div className="grid md:grid-cols-4 gap-6 mt-6">
                  <div>
                    <div className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{energyDemoData.organization.stats.revenue}</div>
                    <div className="text-sm text-white/60">Annual Revenue</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#DFC178]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{energyDemoData.organization.stats.customers}</div>
                    <div className="text-sm text-white/60">Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{energyDemoData.organization.stats.coverage}</div>
                    <div className="text-sm text-white/60">Coverage Area</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-400" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{energyDemoData.organization.stats.facilities}</div>
                    <div className="text-sm text-white/60">Substations</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Crisis Event */}
            <Card className="p-8 bg-white/5 border-white/10 border-red-500/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-900/50 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>The Crisis Event</h3>
                  <p className="text-lg text-white/80 mb-4">{energyDemoData.crisis.description}</p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/5 p-4 rounded border border-white/10">
                      <Users className="h-5 w-5 text-[#C9A84C] mb-2" />
                      <div className="text-sm text-white/60 mb-1">Scope</div>
                      <div className="text-lg font-bold text-white">{energyDemoData.crisis.impactMetrics.scope}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded border border-white/10">
                      <Clock className="h-5 w-5 text-[#DFC178] mb-2" />
                      <div className="text-sm text-white/60 mb-1">Response Window</div>
                      <div className="text-lg font-bold text-white">{energyDemoData.crisis.impactMetrics.timeWindow}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded border border-white/10">
                      <DollarSign className="h-5 w-5 text-red-400 mb-2" />
                      <div className="text-sm text-white/60 mb-1">Financial Impact</div>
                      <div className="text-lg font-bold text-white">{energyDemoData.crisis.impactMetrics.financialImpact}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Playbook */}
            <Card className="p-8 bg-[#0A0F2E] border-[#C9A84C] border-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#C9A84C] rounded-full">
                  <ShieldAlert className="h-6 w-6 text-[#0A0F2E]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-[#C9A84C] text-[#0A0F2E]" data-testid="badge-playbook-id">
                      Playbook {energyDemoData.playbook.id}
                    </Badge>
                    <Badge className="bg-[#DFC178] text-[#0A0F2E]" data-testid="badge-playbook-domain">
                      {energyDemoData.playbook.domain}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {energyDemoData.playbook.name}
                  </h3>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                Pre-configured emergency response coordinating federal agencies (DoE, FEMA, DHS), 247 substations, 
                47 critical hospitals, and 2,500 field personnel for rapid grid stabilization.
              </p>
              <div className="bg-white/5 p-4 rounded border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Preparedness Score</span>
                  <span className="text-2xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{energyDemoData.playbook.preparednessScore}%</span>
                </div>
                <Progress value={energyDemoData.playbook.preparednessScore} className="mt-2 h-2 bg-white/10" indicatorClassName="bg-[#2B8A6E]" />
              </div>
            </Card>

            <div className="text-center space-y-4">
              <Button
                size="lg"
                onClick={() => goToAct("detection")}
                className="gap-2 bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
                data-testid="button-start-demo"
              >
                <Play className="h-5 w-5" />
                Begin Crisis Simulation
              </Button>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/industry-demos")}
                  className="gap-2 text-white border-white/20 hover:bg-white/10"
                  data-testid="button-back-to-hub"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Demos
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ACT 1: AI Detection */}
        {currentAct === "detection" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-8 bg-white/5 border-white/10 border-red-500/50">
              <Activity className="h-12 w-12 text-red-400 mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                AI Grid Monitoring Detects Cascading Failure Risk
              </h2>
              <p className="text-lg text-white/80 mb-4">
                2:15 PM - Multiple AI intelligence systems detect heat wave triggering transformer stress across 247 substations. 
                Pattern recognition identifies cascading failure risk at 96% confidence.
              </p>
              <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-400 animate-pulse" />
                  <div>
                    <p className="font-bold text-white">NERC Category 3 Emergency Criteria Met</p>
                    <p className="text-sm text-white/60">
                      Cascading failures imminent - Playbook #082 activation recommended
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <AIRadarSimulation
              dataStreams={energyDemoData.aiDataStreams}
              title="Grid Intelligence Signals"
              playbookId="#082"
              playbookName="Grid Emergency Response"
              autoStart={true}
            />

            <div className="text-center mt-8">
              <Button
                size="lg"
                onClick={() => goToAct("coordination")}
                className="gap-2 bg-red-600 hover:bg-red-700 text-white font-bold"
                data-testid="button-activate-playbook"
              >
                <ShieldAlert className="h-5 w-5" />
                Activate Playbook #082 - Grid Emergency
              </Button>
              <p className="text-sm text-[#DFC178] mt-2">
                Trigger threshold reached - Immediate action required
              </p>
            </div>
          </div>
        )}

        {/* ACT 2: Coordinated Response */}
        {currentAct === "coordination" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-8 bg-white/5 border-white/10">
              <Zap className="h-12 w-12 text-[#C9A84C] mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                3-Hour Coordinated Response Across 2,500 Stakeholders
              </h2>
              <p className="text-lg text-white/80 mb-4">
                Watch Execution OS orchestrate grid stabilization across 247 substations, 47 hospitals, federal agencies, 
                and 2,500 field personnel—executing load shedding and emergency repairs in parallel.
              </p>
              <div className="bg-white/5 p-4 rounded border border-white/10 grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-white/60 mb-1">Critical Facilities</div>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>47 Hospitals</div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Substations Coordinated</div>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>247 Sites</div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Total Stakeholders</div>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2,500</div>
                </div>
              </div>
            </Card>

            <TwelveMinuteTimer
              timelineEvents={energyDemoData.timelineEvents}
              onComplete={() => setCoordinationComplete(true)}
              title="3-Hour Grid Stabilization Timeline"
              subtitle="From crisis detection to full grid recovery across 247 substations"
              autoStart={true}
            />

            {coordinationComplete && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <Card className="p-6 bg-white/5 border-white/10 border-[#2B8A6E]/50">
                  <CheckCircle className="h-12 w-12 text-[#2B8A6E] mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold text-center mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Grid Stabilized - Crisis Resolved
                  </h3>
                  <p className="text-center text-white/80 mb-6">
                    All 247 substations stable • 47 hospitals uninterrupted • Zero casualties • 
                    $450M infrastructure preserved through coordinated response
                  </p>
                </Card>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-6 bg-white/5 border-white/10 border-[#C9A84C]/30">
                    <div className="text-center">
                      <Users className="h-8 w-8 text-[#C9A84C] mx-auto mb-2" />
                      <div className="text-sm text-white/60 mb-1">Tier 1: Crisis Command</div>
                      <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{energyDemoData.stakeholderTiers.tier1.count}</div>
                      <div className="text-xs text-white/40 mt-2">{energyDemoData.stakeholderTiers.tier1.description}</div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white/5 border-white/10 border-[#DFC178]/30">
                    <div className="text-center">
                      <Activity className="h-8 w-8 text-[#DFC178] mx-auto mb-2" />
                      <div className="text-sm text-white/60 mb-1">Tier 2: Field Execution</div>
                      <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{energyDemoData.stakeholderTiers.tier2.count}</div>
                      <div className="text-xs text-white/40 mt-2">{energyDemoData.stakeholderTiers.tier2.description}</div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white/5 border-white/10 border-red-500/30">
                    <div className="text-center">
                      <ShieldAlert className="h-8 w-8 text-red-400 mx-auto mb-2" />
                      <div className="text-sm text-white/60 mb-1">Tier 3: Network</div>
                      <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{energyDemoData.stakeholderTiers.tier3.count}+</div>
                      <div className="text-xs text-white/40 mt-2">{energyDemoData.stakeholderTiers.tier3.description}</div>
                    </div>
                  </Card>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={() => goToAct("outcome")}
                    className="gap-2 bg-[#2B8A6E] text-white hover:bg-[#3BAF8A]"
                    data-testid="button-view-outcome"
                  >
                    View ROI Outcome
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACT 3: Outcome */}
        {currentAct === "outcome" && (
          <div className="space-y-8 animate-in fade-in duration-500 text-white">
            <Card className="p-8 bg-white/5 border-white/10 border-[#2B8A6E]/50">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-[#2B8A6E] mx-auto mb-4" />
                <h2 className="text-4xl font-bold mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  $2.5B Economic Loss Prevented + Lives Saved
                </h2>
                <p className="text-xl text-[#2B8A6E]">
                  Zero uncontrolled outages • All hospitals protected • Grid stabilized in 3 hours vs 3-5 day blackout
                </p>
              </div>
            </Card>

            <ROIComparison
              traditional={{
                label: energyDemoData.roiComparison.traditional.title,
                duration: energyDemoData.roiComparison.traditional.timeline,
                approach: energyDemoData.roiComparison.traditional.approach,
                outcome: energyDemoData.roiComparison.traditional.outcome,
                points: energyDemoData.roiComparison.traditional.points
              }}
              vexor={{
                label: energyDemoData.roiComparison.vexor.title,
                duration: energyDemoData.roiComparison.vexor.timeline,
                approach: energyDemoData.roiComparison.vexor.approach,
                outcome: energyDemoData.roiComparison.vexor.outcome,
                points: energyDemoData.roiComparison.vexor.points
              }}
              bottomLine={energyDemoData.roiComparison.bottomLine}
            />

            <Card className="p-8 bg-[#0A0F2E] border-[#C9A84C] border-2">
              <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>The Execution OS Difference</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-400 mb-2">❌ Traditional Coordination</h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    <li>• 3-5 days of sequential phone trees and approvals</li>
                    <li>• Grid cascades into uncontrolled blackout during delays</li>
                    <li>• 8.2M customers without power for 36-72 hours</li>
                    <li>• 12 preventable deaths from hospital backup failures</li>
                    <li>• $2.5B total economic loss + regulatory consequences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#2B8A6E] mb-2">✓ Execution OS Coordination</h4>
                  <ul className="text-sm text-white/60 space-y-1">
                    <li>• 3-hour coordinated response across 2,500 stakeholders</li>
                    <li>• Controlled load shedding prevents cascading failures</li>
                    <li>• Zero uncontrolled outages - managed rotating schedule</li>
                    <li>• All 47 hospitals protected throughout crisis</li>
                    <li>• $2.5B saved + Federal commendation as model response</li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="text-center space-y-4">
              <Button
                size="lg"
                onClick={() => goToAct("intro")}
                variant="outline"
                className="gap-2 text-white border-white/20 hover:bg-white/10"
                data-testid="button-replay-demo"
              >
                Replay Demo
              </Button>
              <div>
                <Button
                  variant="default"
                  onClick={() => (window.location.href = "/industry-demos")}
                  className="gap-2 bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
                  data-testid="button-view-all-demos"
                >
                  View All Industry Demos
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
