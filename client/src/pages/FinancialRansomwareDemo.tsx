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
    <div className="page-background min-h-screen" style={{ background: "#0A0F2E" }}>
      <DemoNavHeader title="Financial Ransomware Demo" showBackButton={true} />

      {/* Progress Indicator */}
      <div className="border-b border-white/10 bg-white/5 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-4 text-sm">
            <div className={`flex items-center gap-2 ${currentAct === "introduction" ? "text-[#C9A84C]" : "text-white/60"}`}>
              <div className={`w-2 h-2 rounded-full border border-[#C9A84C] ${currentAct === "introduction" ? "bg-[#C9A84C]" : "bg-transparent"}`} />
              Introduction
            </div>
            <div className="flex-1 h-px bg-white/10" />
            <div className={`flex items-center gap-2 ${currentAct === "ai-detection" ? "text-[#C9A84C]" : "text-white/60"}`}>
              <div className={`w-2 h-2 rounded-full border border-[#C9A84C] ${currentAct === "ai-detection" ? "bg-[#C9A84C]" : "bg-transparent"}`} />
              AI Detection
            </div>
            <div className="flex-1 h-px bg-white/10" />
            <div className={`flex items-center gap-2 ${currentAct === "coordination" ? "text-[#C9A84C]" : "text-white/60"}`}>
              <div className={`w-2 h-2 rounded-full border border-[#C9A84C] ${currentAct === "coordination" ? "bg-[#C9A84C]" : "bg-transparent"}`} />
              Coordination
            </div>
            <div className="flex-1 h-px bg-white/10" />
            <div className={`flex items-center gap-2 ${currentAct === "outcome" || currentAct === "summary" ? "text-[#C9A84C]" : "text-white/60"}`}>
              <div className={`w-2 h-2 rounded-full border border-[#C9A84C] ${currentAct === "outcome" || currentAct === "summary" ? "bg-[#C9A84C]" : "bg-transparent"}`} />
              Outcome
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 text-white">
        {/* Introduction Act */}
        {currentAct === "introduction" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{financialDemoData.crisis.title}</h2>
              <p className="text-xl text-[#DFC178]">{financialDemoData.crisis.subtitle}</p>
            </div>

            {/* Organization Info */}
            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-start gap-4 mb-4">
                <Building2 className="w-6 h-6 text-[#C9A84C] mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{financialDemoData.organization.name}</h3>
                  <p className="text-white/60 mb-4">{financialDemoData.organization.type}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(financialDemoData.organization.stats).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value}</div>
                        <div className="text-sm text-white/40 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Crisis Scenario */}
            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-[#C9A84C] mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>The Crisis Scenario</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{financialDemoData.crisis.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <DollarSign className="w-5 h-5 text-[#C9A84C] mb-2" />
                      <div className="text-xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{financialDemoData.crisis.impactMetrics.financialImpact}</div>
                      <div className="text-sm text-white/40">At Risk</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <Clock className="w-5 h-5 text-[#DFC178] mb-2" />
                      <div className="text-xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{financialDemoData.crisis.impactMetrics.timeWindow}</div>
                      <div className="text-sm text-white/40">Response Window</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <Users className="w-5 h-5 text-[#C9A84C] mb-2" />
                      <div className="text-xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{financialDemoData.crisis.impactMetrics.stakeholders}</div>
                      <div className="text-sm text-white/40">Stakeholders</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <AlertTriangle className="w-5 h-5 text-[#C9A84C] mb-2" />
                      <div className="text-xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{financialDemoData.crisis.impactMetrics.affectedCustomers}</div>
                      <div className="text-sm text-white/40">Affected Customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Playbook Info */}
            <Card className="bg-white/5 border-[#C9A84C]/50 border-2 p-6">
              <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Playbook: {financialDemoData.playbook.id} - {financialDemoData.playbook.name}</h3>
              <div className="flex items-center gap-6 mb-4">
                <div className="text-sm text-white/60">Domain: <span className="text-white font-semibold">{financialDemoData.playbook.domain}</span></div>
                <div className="text-sm text-white/60">Sections: <span className="text-white font-semibold">{financialDemoData.playbook.sections}</span></div>
                <div className="text-sm text-white/60">
                  Preparedness: <span className="text-[#2B8A6E] font-semibold">{financialDemoData.playbook.preparedness}%</span>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleStartDemo}
                className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8 py-6 text-lg"
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
              autoStart={true}
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
              autoStart={true}
            />
          </div>
        )}

        {/* Act 3: ROI Outcome */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Crisis Contained</h2>
              <p className="text-xl text-white/60">Compare the traditional approach vs. Execution OS' coordinated response</p>
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
                className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8"
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
          <div className="max-w-4xl mx-auto space-y-8 text-white">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2B8A6E]/20 mb-4">
                <CheckCircle2 className="w-10 h-10 text-[#2B8A6E]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Demo Complete</h2>
              <p className="text-xl text-white/60">Financial Services Ransomware Response</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10 p-6 text-center">
                <DollarSign className="w-8 h-8 text-[#2B8A6E] mx-auto mb-3" />
                <div className="text-3xl font-bold text-[#2B8A6E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{financialDemoData.roiComparison.bottomLine.value}</div>
                <div className="text-sm text-white/40">Value Preserved</div>
              </Card>

              <Card className="bg-white/5 border-white/10 p-6 text-center">
                <Clock className="w-8 h-8 text-[#C9A84C] mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12 min</div>
                <div className="text-sm text-white/40">Full Coordination</div>
              </Card>

              <Card className="bg-white/5 border-white/10 p-6 text-center">
                <Users className="w-8 h-8 text-[#C9A84C] mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{financialDemoData.crisis.impactMetrics.stakeholders}</div>
                <div className="text-sm text-white/40">Stakeholders Aligned</div>
              </Card>
            </div>

            <Card className="bg-white/5 border-[#C9A84C]/50 border-2 p-8">
              <h3 className="text-xl font-semibold text-white mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>The Execution OS Difference</h3>
              <p className="text-white/80 text-center leading-relaxed max-w-3xl mx-auto">
                Your AI detected the ransomware in milliseconds. But without Execution OS, coordinating your CEO, CISO, CTO, CFO, legal counsel, Board, and regulators would take 48-72 hours of email chains and emergency meetings. In that window, a $1M incident becomes a $27M disaster. Execution OS turns instant detection into 12-minute coordinated response—we're not replacing your AI, we're the execution layer that makes it deliver ROI.
              </p>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={handleRestart}
                className="text-white border-white/20 hover:bg-white/10"
                data-testid="button-restart-demo"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Restart Demo
              </Button>
              <Link href="/playbook-library">
                <Button
                  size="lg"
                  className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
                  data-testid="button-explore-playbooks"
                >
                  <Library className="w-5 h-5 mr-2" />
                  Explore All 170 Playbooks
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
