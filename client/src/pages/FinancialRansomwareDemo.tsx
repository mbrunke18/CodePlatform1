import StandardNav from '@/components/layout/StandardNav';
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Shield,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Library
} from "lucide-react";
import { financialDemoData } from "@shared/financial-demo-data";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";

type Act = "introduction" | "ai-detection" | "coordination" | "outcome" | "summary";

export default function FinancialRansomwareDemo() {
  const [currentAct, setCurrentAct] = useState<Act>("introduction");

  const handleStartDemo = () => {
    setCurrentAct("ai-detection");
  };

  const handleTriggerFired = () => {
    setCurrentAct("coordination");
  };

  const handleCoordinationComplete = () => {
    setCurrentAct("outcome");
  };

  const handleSeeSummary = () => {
    setCurrentAct("summary");
  };

  const handleRestart = () => {
    setCurrentAct("introduction");
  };

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <DemoNavHeader title="Financial Ransomware Demo" showBackButton={true} />

      {/* Progress Indicator */}
      <div className="border-b border-blue-800/20 bg-slate-950/30 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-4 text-sm">
            <div className={`flex items-center gap-2 ${currentAct === "introduction" ? "text-blue-400" : "text-blue-600"}`}>
              <div className={`w-2 h-2 rounded-full ${currentAct === "introduction" ? "bg-blue-400" : "bg-blue-800"}`} />
              Introduction
            </div>
            <div className="flex-1 page-background h-px bg-blue-900" />
            <div className={`flex items-center gap-2 ${currentAct === "ai-detection" ? "text-blue-400" : "text-blue-600"}`}>
              <div className={`w-2 h-2 rounded-full ${currentAct === "ai-detection" ? "bg-blue-400" : "bg-blue-800"}`} />
              AI Detection
            </div>
            <div className="flex-1 page-background h-px bg-blue-900" />
            <div className={`flex items-center gap-2 ${currentAct === "coordination" ? "text-blue-400" : "text-blue-600"}`}>
              <div className={`w-2 h-2 rounded-full ${currentAct === "coordination" ? "bg-blue-400" : "bg-blue-800"}`} />
              Coordination
            </div>
            <div className="flex-1 page-background h-px bg-blue-900" />
            <div className={`flex items-center gap-2 ${currentAct === "outcome" || currentAct === "summary" ? "text-blue-400" : "text-blue-600"}`}>
              <div className={`w-2 h-2 rounded-full ${currentAct === "outcome" || currentAct === "summary" ? "bg-blue-400" : "bg-blue-800"}`} />
              Outcome
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Introduction Act */}
        {currentAct === "introduction" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">{financialDemoData.crisis.title}</h2>
              <p className="text-xl text-blue-200">{financialDemoData.crisis.subtitle}</p>
            </div>

            {/* Organization Info */}
            <Card className="bg-slate-900/50 border-blue-800/30 p-6">
              <div className="flex items-start gap-4 mb-4">
                <Building2 className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{financialDemoData.organization.name}</h3>
                  <p className="text-blue-200 mb-4">{financialDemoData.organization.type}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(financialDemoData.organization.stats).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-2xl font-bold text-blue-400">{value}</div>
                        <div className="text-sm text-blue-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Crisis Scenario */}
            <Card className="bg-slate-900/50 border-red-800/50 p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
                <div className="flex-1 page-background">
                  <h3 className="text-lg font-semibold text-white mb-3">The Crisis Scenario</h3>
                  <p className="text-blue-100 mb-4 leading-relaxed">{financialDemoData.crisis.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-red-800/30">
                      <DollarSign className="w-5 h-5 text-red-400 mb-2" />
                      <div className="text-xl font-bold text-white">{financialDemoData.crisis.impactMetrics.financialImpact}</div>
                      <div className="text-sm text-red-300">At Risk</div>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-blue-800/30">
                      <Clock className="w-5 h-5 text-blue-400 mb-2" />
                      <div className="text-xl font-bold text-white">{financialDemoData.crisis.impactMetrics.timeWindow}</div>
                      <div className="text-sm text-blue-300">Response Window</div>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-blue-800/30">
                      <Users className="w-5 h-5 text-blue-400 mb-2" />
                      <div className="text-xl font-bold text-white">{financialDemoData.crisis.impactMetrics.stakeholders}</div>
                      <div className="text-sm text-blue-300">Stakeholders</div>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-red-800/30">
                      <AlertTriangle className="w-5 h-5 text-red-400 mb-2" />
                      <div className="text-xl font-bold text-white">{financialDemoData.crisis.impactMetrics.affectedCustomers}</div>
                      <div className="text-sm text-red-300">Affected Customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Playbook Info */}
            <Card className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-blue-800/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">M Playbook: {financialDemoData.playbook.id} - {financialDemoData.playbook.name}</h3>
              <div className="flex items-center gap-6 mb-4">
                <div className="text-sm text-blue-200">Domain: <span className="text-white font-semibold">{financialDemoData.playbook.domain}</span></div>
                <div className="text-sm text-blue-200">Sections: <span className="text-white font-semibold">{financialDemoData.playbook.sections}</span></div>
                <div className="text-sm text-blue-200">
                  Preparedness: <span className="text-green-400 font-semibold">{financialDemoData.playbook.preparedness}%</span>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleStartDemo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                data-testid="button-start-demo"
              >
                Begin Crisis Simulation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Act 1: AI Detection */}
        {currentAct === "ai-detection" && (
          <div className="max-w-5xl mx-auto">
            <AIRadarSimulation
              title="AI Ransomware Detection System"
              subtitle="Real-time threat monitoring across banking infrastructure"
              dataStreams={financialDemoData.aiDataStreams}
              playbookId={financialDemoData.playbook.id}
              playbookName={financialDemoData.playbook.name}
              onTriggerFired={handleTriggerFired}
            />
          </div>
        )}

        {/* Act 2: 12-Minute Coordination */}
        {currentAct === "coordination" && (
          <div className="max-w-5xl mx-auto">
            <TwelveMinuteTimer
              title="12-Minute Coordinated Response"
              subtitle="Ransomware containment and recovery protocol executing"
              timelineEvents={financialDemoData.timelineEvents}
              onComplete={handleCoordinationComplete}
            />
          </div>
        )}

        {/* Act 3: ROI Outcome */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Crisis Contained</h2>
              <p className="text-xl text-blue-200">Compare the traditional approach vs. M's coordinated response</p>
            </div>

            <ROIComparison
              traditional={financialDemoData.roiComparison.traditional}
              vexor={financialDemoData.roiComparison.vexor}
              bottomLine={financialDemoData.roiComparison.bottomLine}
            />

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleSeeSummary}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                data-testid="button-see-summary"
              >
                See Final Summary
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Final Summary */}
        {currentAct === "summary" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Demo Complete</h2>
              <p className="text-xl text-blue-200">Financial Services Ransomware Response</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/50 border-green-800/30 p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{financialDemoData.roiComparison.bottomLine.value}</div>
                <div className="text-sm text-green-300">Value Preserved</div>
              </Card>

              <Card className="bg-slate-900/50 border-blue-800/30 p-6 text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">12 min</div>
                <div className="text-sm text-blue-300">Full Coordination</div>
              </Card>

              <Card className="bg-slate-900/50 border-purple-800/30 p-6 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{financialDemoData.crisis.impactMetrics.stakeholders}</div>
                <div className="text-sm text-purple-300">Stakeholders Aligned</div>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-blue-800/30 p-8">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">The M Difference</h3>
              <p className="text-blue-100 text-center leading-relaxed max-w-3xl mx-auto">
                Your AI detected the ransomware in milliseconds. But without M, coordinating your CEO, CISO, CTO, CFO, legal counsel, Board, and regulators would take 48-72 hours of email chains and emergency meetings. In that window, a $1M incident becomes a $27M disaster. M turns instant detection into 12-minute coordinated response—we're not replacing your AI, we're the execution layer that makes it deliver ROI.
              </p>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={handleRestart}
                className="border-blue-600 text-blue-400 hover:bg-blue-950"
                data-testid="button-restart-demo"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Restart Demo
              </Button>
              <Link href="/playbook-library">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-explore-playbooks"
                >
                  <Library className="w-5 h-5 mr-2" />
                  Explore All 166 Playbooks
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
