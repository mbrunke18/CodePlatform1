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
  Library,
  TrendingUp,
  Zap,
  Lock,
  FileText,
  Globe,
  ChevronRight
} from "lucide-react";
import { financialDemoData } from "@shared/financial-demo-data";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

type Act = "introduction" | "ai-detection" | "coordination" | "outcome" | "summary";

const regulatoryTiers = [
  {
    tier: "Tier 1 — Internal Command",
    members: ["CEO", "CISO", "CFO", "General Counsel", "CTO"],
    timeline: "Minutes 1–3",
    color: GOLD,
  },
  {
    tier: "Tier 2 — Operational Response",
    members: ["SOC Team", "IT Recovery", "Public Relations", "Investor Relations", "Compliance"],
    timeline: "Minutes 3–7",
    color: TEAL,
  },
  {
    tier: "Tier 3 — Regulatory & External",
    members: ["Federal Reserve", "SEC", "OCC", "FDIC", "Affected Customers", "Card Networks"],
    timeline: "Minutes 7–12",
    color: "#6B7280",
  },
];

const regulatoryDeadlines = [
  { window: "72 hours", requirement: "SEC Form 8-K cyber disclosure required", severity: "critical" },
  { window: "4 days", requirement: "SEC cybersecurity incident disclosure", severity: "critical" },
  { window: "30 days", requirement: "Federal Reserve banking supervisor notification", severity: "high" },
  { window: "72 hours", requirement: "Card network breach notification (Visa/Mastercard)", severity: "high" },
  { window: "Immediately", requirement: "OCC notification if safety/soundness threatened", severity: "critical" },
];

export default function FinancialRansomwareDemo() {
  const [currentAct, setCurrentAct] = useState<Act>("introduction");

  const handleStartDemo = () => setCurrentAct("ai-detection");
  const handleTriggerFired = () => setCurrentAct("coordination");
  const handleCoordinationComplete = () => setCurrentAct("outcome");
  const handleSeeSummary = () => setCurrentAct("summary");
  const handleRestart = () => setCurrentAct("introduction");

  return (
    <div style={{ minHeight: "100vh", background: NAVY }}>
      <DemoNavHeader title="Financial Services Ransomware Response" showBackButton={true} />

      {/* Progress Indicator */}
      <div className="border-b border-white/10 bg-white/5 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-4 text-sm">
            {[
              { id: "introduction", label: "Scenario" },
              { id: "ai-detection", label: "AI Detection" },
              { id: "coordination", label: "Coordination" },
              { id: "outcome", label: "Outcome" },
              { id: "summary", label: "Summary" },
            ].map((step, i, arr) => (
              <div key={step.id} className="flex items-center gap-4 flex-1">
                <div className={`flex items-center gap-2 ${currentAct === step.id ? "text-[#C9A84C]" : "text-white/40"}`}>
                  <div className={`w-2 h-2 rounded-full border ${currentAct === step.id ? "bg-[#C9A84C] border-[#C9A84C]" : "border-white/30"}`} />
                  <span className="text-xs font-semibold whitespace-nowrap">{step.label}</span>
                </div>
                {i < arr.length - 1 && <div className="flex-1 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 text-white">

        {/* ── INTRODUCTION ACT ─────────────────────────────── */}
        {currentAct === "introduction" && (
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Industry Context Header */}
            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-[#C9A84C]/40 text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD, background: "rgba(201,168,76,0.08)" }}>
                Financial Services · Cyber Domain
              </div>
              <h1 style={{ ...CG, fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>
                {financialDemoData.crisis.title}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, marginBottom: 0 }}>
                {financialDemoData.crisis.subtitle}
              </p>
            </div>

            {/* Industry Stakes Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { stat: "$4.35M", label: "Average financial sector breach cost", source: "IBM Cost of Data Breach 2024" },
                { stat: "8.5 mo", label: "Average detection-to-containment window", source: "Ponemon Institute 2024" },
                { stat: "$1.4B", label: "Ransomware paid by financial firms in 2023", source: "FBI Internet Crime Report" },
              ].map(({ stat, label, source }) => (
                <div key={stat} className="border border-white/10 p-5 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: GOLD, marginBottom: 6 }}>{stat}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{source}</div>
                </div>
              ))}
            </div>

            {/* The Coordination Gap */}
            <div className="border border-[#C9A84C]/40 p-6" style={{ background: "rgba(201,168,76,0.05)" }}>
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: GOLD }} />
                <div>
                  <h3 style={{ ...CG, fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                    The Detection–Coordination Gap
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontSize: 14 }}>
                    Your AI and SOC team can detect a ransomware attack in <strong style={{ color: GOLD }}>minutes</strong>. But coordinating your CEO, CISO, CFO, General Counsel, CTO, Federal Reserve liaison, SEC disclosure team, and card network contacts takes <strong style={{ color: GOLD }}>weeks of emergency meetings, email chains, and phone trees</strong> — while the clock on your regulatory deadlines is already running. In that window, a contained $1M incident becomes a $27M regulatory and reputational disaster. Execution OS closes that gap. Every stakeholder notified. Every task assigned. Every regulatory deadline pre-staged. In 12 minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Regulatory Deadlines */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 20, height: 1.5, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Regulatory Clock Starts at Breach Detection</span>
              </div>
              <div className="space-y-2">
                {regulatoryDeadlines.map(({ window, requirement, severity }) => (
                  <div key={window + requirement} className="flex items-center gap-4 p-3 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ minWidth: 80, fontSize: 12, fontWeight: 700, color: severity === "critical" ? "#EF4444" : GOLD }}>{window}</div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: severity === "critical" ? "#EF4444" : GOLD, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{requirement}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>Without Execution OS, meeting these deadlines requires a coordination sprint most organizations aren't built for.</p>
            </div>

            {/* Stakeholder Cascade */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 20, height: 1.5, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>12-Minute Stakeholder Cascade</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {regulatoryTiers.map(({ tier, members, timeline, color }) => (
                  <div key={tier} className="border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color, marginBottom: 6 }}>{timeline}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{tier}</div>
                    <div className="space-y-1.5">
                      {members.map(m => (
                        <div key={m} className="flex items-center gap-2">
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organization + Crisis Cards */}
            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-start gap-4 mb-4">
                <Building2 className="w-6 h-6 text-[#C9A84C] mt-1" />
                <div className="flex-1">
                  <h3 style={{ ...CG, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{financialDemoData.organization.name}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 16 }}>{financialDemoData.organization.type}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(financialDemoData.organization.stats).map(([key, value]) => (
                      <div key={key}>
                        <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD }}>{value}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-[#C9A84C] mt-1" />
                <div className="flex-1">
                  <h3 style={{ ...CG, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>The Crisis Scenario</h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{financialDemoData.crisis.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: DollarSign, value: financialDemoData.crisis.impactMetrics.financialImpact, label: "At Risk" },
                      { icon: Clock, value: financialDemoData.crisis.impactMetrics.timeWindow, label: "Response Window" },
                      { icon: Users, value: financialDemoData.crisis.impactMetrics.stakeholders, label: "Stakeholders" },
                      { icon: AlertTriangle, value: financialDemoData.crisis.impactMetrics.affectedCustomers, label: "Affected Customers" },
                    ].map(({ icon: Icon, value, label }) => (
                      <div key={label} className="bg-white/5 p-4 border border-white/10">
                        <Icon className="w-5 h-5 mb-2" style={{ color: GOLD }} />
                        <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: "#fff" }}>{value}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 border-[#C9A84C]/50 border-2 p-6">
              <h3 style={{ ...CG, fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                Playbook: {financialDemoData.playbook.id} — {financialDemoData.playbook.name}
              </h3>
              <div className="flex items-center gap-6 mb-2">
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Domain: <span style={{ color: "#fff", fontWeight: 700 }}>{financialDemoData.playbook.domain}</span></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Sections: <span style={{ color: "#fff", fontWeight: 700 }}>{financialDemoData.playbook.sections}</span></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Preparedness: <span style={{ color: TEAL, fontWeight: 700 }}>{financialDemoData.playbook.preparedness}%</span></div>
              </div>
            </Card>

            <div className="text-center pt-2">
              <Button size="lg" onClick={handleStartDemo} className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-10 py-6 text-base" data-testid="button-start-demo">
                Begin Crisis Simulation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>Interactive simulation — AI detects, Execution OS coordinates</p>
            </div>
          </div>
        )}

        {/* ── AI DETECTION ACT ─────────────────────────────── */}
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

        {/* ── COORDINATION ACT ─────────────────────────────── */}
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

        {/* ── OUTCOME ACT ──────────────────────────────────── */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8 text-white">
            <div className="text-center mb-8">
              <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Crisis Contained</h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Traditional approach vs. Execution OS — live execution in 12 minutes</p>
            </div>
            <ROIComparison
              traditional={financialDemoData.roiComparison.traditional}
              executionOS={financialDemoData.roiComparison.executionOS}
              bottomLine={financialDemoData.roiComparison.bottomLine}
            />
            <div className="text-center">
              <Button size="lg" onClick={handleSeeSummary} className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8" data-testid="button-see-summary">
                See Final Summary <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ── SUMMARY ACT ──────────────────────────────────── */}
        {currentAct === "summary" && (
          <div className="max-w-4xl mx-auto space-y-8 text-white">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: "rgba(43,138,110,0.2)" }}>
                <CheckCircle2 className="w-10 h-10" style={{ color: TEAL }} />
              </div>
              <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Demo Complete</h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Financial Services Ransomware Response</p>
            </div>

            {/* Key outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: DollarSign, value: financialDemoData.roiComparison.bottomLine.value, label: "Value Preserved", color: TEAL },
                { icon: Clock, value: "12 min", label: "Full Coordination", color: GOLD },
                { icon: Users, value: financialDemoData.crisis.impactMetrics.stakeholders, label: "Stakeholders Aligned", color: GOLD },
              ].map(({ icon: Icon, value, label, color }) => (
                <Card key={label} className="bg-white/5 border-white/10 p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3" style={{ color }} />
                  <div style={{ ...CG, fontSize: 28, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{label}</div>
                </Card>
              ))}
            </div>

            {/* The execution gap insight */}
            <Card className="bg-white/5 border-[#C9A84C]/50 border-2 p-8">
              <h3 style={{ ...CG, fontSize: 20, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 12 }}>
                The Execution OS Difference for Financial Services
              </h3>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontSize: 14, textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
                Your AI detected the ransomware in milliseconds. But without Execution OS, coordinating your CEO, CISO, CTO, CFO, legal counsel, board, and regulators — while meeting SEC, Federal Reserve, OCC, and card network deadlines simultaneously — takes weeks of emergency calls. In that window, a $1M incident becomes a $27M regulatory and reputational disaster. Execution OS turns instant detection into live execution in 12 minutes. Every role assigned. Every regulator pre-staged. Every deadline already in the task queue.
              </p>
            </Card>

            {/* Microsoft framing */}
            <div className="border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-start gap-4">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0, marginTop: 6 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Already invested in Microsoft Copilot or Azure OpenAI?</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                    Every financial institution has Microsoft's AI stack. None have the operating model to execute with it. Execution OS is the coordination layer that sits above your existing Microsoft investment — not a replacement, an orchestrator. Your AI detects. Execution OS deploys your people.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" variant="outline" onClick={handleRestart} className="text-white border-white/20 hover:bg-white/10" data-testid="button-restart-demo">
                <RotateCcw className="w-5 h-5 mr-2" />Restart Demo
              </Button>
              <Link href="/request-access">
                <Button size="lg" className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">
                  Schedule a Pilot Conversation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/playbook-library">
                <Button size="lg" className="border border-white/20 text-white hover:bg-white/10 bg-transparent" data-testid="button-explore-playbooks">
                  <Library className="w-5 h-5 mr-2" />Explore All 170 Playbooks
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <Link href="/executive-brief">
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer", textDecoration: "underline" }}>
                  Download executive brief to share with your board →
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
