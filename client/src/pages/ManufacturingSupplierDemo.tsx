import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Factory, Cpu, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign, ShieldAlert, ArrowLeft, Play, ArrowRight, Layers, Globe, Users } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { manufacturingDemoData } from "@shared/manufacturing-demo-data";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

const supplyChainStats = [
  { stat: "94%", label: "Fortune 500 manufacturers disrupted by supply chain failure in the last 2 years", source: "McKinsey Global Institute, 2024" },
  { stat: "$4.2M", label: "Average cost per hour of automotive production downtime", source: "Anderson Economic Group" },
  { stat: "8–16 wks", label: "Time to qualify an alternative supplier without pre-vetting", source: "Deloitte Supply Chain Report" },
];

const jitParadox = [
  { label: "JIT annual savings", value: "$220B", detail: "Eliminated from global manufacturing through efficiency gains", positive: true },
  { label: "Annual supply disruption losses", value: "$455B", detail: "Created by the single-source dependencies JIT requires", positive: false },
];

const preVettedSupplierNetwork = [
  { tier: "Primary", supplier: "TSMC — Primary semiconductor supplier", status: "Active", lead: "Standard" },
  { tier: "Alternative A", supplier: "Samsung Semiconductor — Pre-vetted, pre-qualified", status: "Ready", lead: "2 days" },
  { tier: "Alternative B", supplier: "GlobalFoundries — Pre-negotiated emergency pricing", status: "Ready", lead: "4 days" },
  { tier: "Alternative C", supplier: "SK Hynix — Pre-approved qualification package", status: "Standby", lead: "7 days" },
];

const coordinationCascade = [
  { step: "0:00", action: "AI supply chain monitoring detects 50,000 chip shortage at TSMC", stakeholder: "Supply Chain Intelligence System", highlight: true },
  { step: "1:00", action: "CEO, COO, CPO, CFO, Head of Supply Chain notified with full context", stakeholder: "Executive Team (5)" },
  { step: "2:30", action: "Alternative supplier Samsung contacted — pre-negotiated terms invoked", stakeholder: "Procurement (8)" },
  { step: "4:00", action: "Pre-approved quality specs sent to Samsung — qualification bypass activated", stakeholder: "Quality Engineering (12)" },
  { step: "6:00", action: "10 assembly plants notified with production adjustment schedules", stakeholder: "Operations Managers (10 plants)" },
  { step: "8:00", action: "Dealer network briefed — delivery adjustment communications staged", stakeholder: "Commercial Operations (847 dealers)" },
  { step: "10:00", action: "Customer communications prepared and queued for approval", stakeholder: "Customer Relations (10,000+ customers)" },
  { step: "12:00", action: "Full response operational — 2-day production pause confirmed vs 30-day halt", stakeholder: "All 158 Stakeholders Aligned", complete: true },
];

export default function ManufacturingSupplierDemo() {
  const [currentAct, setCurrentAct] = useState<DemoAct>("intro");
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [coordinationComplete, setCoordinationComplete] = useState(false);

  useEffect(() => {
    if (currentAct === "detection" && detectionProgress < 100) {
      const interval = setInterval(() => {
        setDetectionProgress(prev => {
          if (prev >= 100) { clearInterval(interval); return 100; }
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
    <div style={{ minHeight: "100vh", background: NAVY }}>
      <DemoNavHeader title="Manufacturing Supply Chain Crisis — Supplier Failure Response" showBackButton={true} />

      {/* Act Navigation */}
      <div className="border-b border-white/10 bg-white/5 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {[
              { id: "intro", label: "1. Scenario", icon: Play },
              { id: "detection", label: "2. AI Detection @ 89%", icon: ShieldAlert },
              { id: "coordination", label: "3. 4-Hour Response", icon: Clock },
              { id: "outcome", label: "4. $450M Saved", icon: DollarSign }
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => setCurrentAct(act.id as DemoAct)}
                className={`flex items-center gap-2 px-4 py-2 transition-colors border ${currentAct === act.id ? "text-[#C9A84C] border-[#C9A84C] bg-white/5" : "text-white/50 border-transparent hover:bg-white/5"}`}
                data-testid={`button-act-${act.id}`}
              >
                <act.icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{act.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 text-white">

        {/* ── INTRO ACT ──────────────────────────────────── */}
        {currentAct === "intro" && (
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 border border-[#C9A84C]/40 text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD, background: "rgba(201,168,76,0.08)" }}>
                Industrial Manufacturing · Supply Chain Domain
              </div>
              <h1 style={{ ...CG, fontSize: "clamp(26px,4vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
                {manufacturingDemoData.crisis.title}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17 }}>
                {manufacturingDemoData.crisis.subtitle}
              </p>
            </div>

            {/* Industry Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supplyChainStats.map(({ stat, label, source }) => (
                <div key={stat} className="border border-white/10 p-5 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, marginBottom: 6 }}>{stat}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{source}</div>
                </div>
              ))}
            </div>

            {/* The JIT Paradox */}
            <div className="border border-[#C9A84C]/40 p-6" style={{ background: "rgba(201,168,76,0.05)" }}>
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: GOLD }} />
                <div>
                  <h3 style={{ ...CG, fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 8 }}>The Just-In-Time Paradox</h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontSize: 14, marginBottom: 14 }}>
                    Toyota pioneered Just-In-Time manufacturing to eliminate waste — removing buffer inventory, reducing lead times, and maximizing efficiency. It works brilliantly in stable conditions. But JIT creates a structural fragility: single-source dependencies. When a critical supplier fails, there is no buffer. The entire production chain stops — and the traditional coordination model (emergency meetings, supplier qualification cycles, contractual negotiations) was never designed to move at JIT speed.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {jitParadox.map(({ label, value, detail, positive }) => (
                      <div key={label} className="p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{label}</div>
                        <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: positive ? TEAL : "#EF4444", marginBottom: 4 }}>{value}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* The Crisis */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-white/10">
                <h3 style={{ ...CG, fontWeight: 700, color: "#fff", fontSize: 17, marginBottom: 16 }} className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: GOLD }} />
                  The Crisis
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Organization", value: "Toyota Motor Corporation" },
                    { label: "Component", value: "Critical Semiconductor Chips" },
                    { label: "Shortage", value: "50,000 chips — production gap detected" },
                    { label: "At Risk", value: "10,000 vehicles ($500M production)", highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label}>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 2 }}>{label}</div>
                      <div style={{ color: highlight ? GOLD : "#fff", fontWeight: highlight ? 700 : 500 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white/5 border border-white/10">
                <h3 style={{ ...CG, fontWeight: 700, color: "#fff", fontSize: 17, marginBottom: 16 }}>Traditional Response (30 Days)</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { text: "Day 1–2: Assess which suppliers are affected", high: false },
                    { text: "Day 3: Discover the full 50,000 chip shortage", high: false },
                    { text: "Day 4–5: Emergency meetings to find alternatives", high: false },
                    { text: "Week 2: Alternative supplier can't meet quality specs", high: false },
                    { text: "Week 3: Engineering scrambles to re-qualify parts", high: true },
                    { text: "Week 4: Production lines shut down", high: true },
                    { text: "Month 2: Customers defecting to competitors", high: true },
                  ].map(({ text, high }) => (
                    <li key={text} style={{ color: high ? GOLD : "rgba(255,255,255,0.55)", fontWeight: high ? 600 : 400 }}>• {text}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pre-Vetted Supplier Network */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 20, height: 1.5, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Execution OS — Pre-Staged Supplier Network</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
                The 8–16 week qualification delay is eliminated because Execution OS pre-vets alternative suppliers before a crisis fires. Contracts pre-negotiated. Quality specs pre-approved. Authorization pre-staged.
              </p>
              <div className="space-y-2">
                {preVettedSupplierNetwork.map(({ tier, supplier, status, lead }) => (
                  <div key={tier} className="flex items-center gap-4 p-3 border border-white/10" style={{ background: status === "Active" ? "rgba(43,138,110,0.05)" : status === "Ready" ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.02)" }}>
                    <div style={{ minWidth: 110, fontSize: 11, fontWeight: 700, color: status === "Active" ? TEAL : status === "Ready" ? GOLD : "rgba(255,255,255,0.4)" }}>{tier}</div>
                    <div style={{ flex: 1, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{supplier}</div>
                    <div style={{ minWidth: 80, fontSize: 11, color: "rgba(255,255,255,0.5)", textAlign: "right" }}>Lead: {lead}</div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: status === "Active" ? TEAL : status === "Ready" ? GOLD : "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* 12-Minute Cascade */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 20, height: 1.5, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Execution OS 12-Minute Coordination Cascade</span>
              </div>
              <div className="space-y-1.5">
                {coordinationCascade.map(({ step, action, stakeholder, highlight, complete }) => (
                  <div key={step + action} className="flex items-start gap-4 p-3 border border-white/8" style={{
                    background: complete ? "rgba(43,138,110,0.06)" : highlight ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)"
                  }}>
                    <div style={{ minWidth: 44, fontSize: 11, fontWeight: 700, color: complete ? TEAL : GOLD }}>{step}</div>
                    <div className="flex-1">
                      <div style={{ fontSize: 12, color: "#fff", marginBottom: 2 }}>{action}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{stakeholder}</div>
                    </div>
                    {complete && <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <Button size="lg" onClick={() => setCurrentAct("detection")} className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-10 py-5" data-testid="button-start-demo">
                Begin Crisis Simulation
                <Play className="w-5 h-5 ml-2" />
              </Button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>Interactive simulation — AI detects the shortage, Execution OS activates the pre-staged supplier network</p>
            </div>
          </div>
        )}

        {/* ── DETECTION ACT ──────────────────────────────── */}
        {currentAct === "detection" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 style={{ ...CG, fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 20 }} className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8" style={{ color: GOLD }} />
                Supply Chain AI Detects Critical Supplier Failure
              </h2>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>AI Confidence Level</span>
                  <span style={{ ...CG, fontSize: 24, fontWeight: 700, color: GOLD }}>{detectionProgress}%</span>
                </div>
                <Progress value={detectionProgress} className="h-3 bg-white/10 [&>div]:bg-[#C9A84C]" />
                {detectionProgress >= 89 && (
                  <div className="mt-4 p-4 border border-[#C9A84C]" style={{ background: "rgba(201,168,76,0.08)" }}>
                    <p style={{ color: GOLD, fontWeight: 700, fontSize: 13 }}>
                      ⚠️ ALERT: Critical supplier failure detected — 10,000 vehicle production at risk ($500M)
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
                  <Button size="lg" onClick={() => setCurrentAct("coordination")} className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8" data-testid="button-activate-playbook">
                    Activate Playbook #019 — Supplier Failure
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── COORDINATION ACT ───────────────────────────── */}
        {currentAct === "coordination" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 style={{ ...CG, fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 20 }} className="flex items-center gap-3">
                <Clock className="w-8 h-8" style={{ color: GOLD }} />
                4-Hour Coordinated Response Across 158 Stakeholders
              </h2>
              <TwelveMinuteTimer
                timelineEvents={manufacturingDemoData.timelineEvents}
                onComplete={() => setCoordinationComplete(true)}
                autoStart={true}
              />
              {coordinationComplete && (
                <div className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {manufacturingDemoData.stakeholderTiers && (
                      <>
                        <Card className="p-6 bg-white/5 border-white/10">
                          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 6 }}>Tier 1: Decision Makers</div>
                          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{manufacturingDemoData.stakeholderTiers.tier1.count}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{manufacturingDemoData.stakeholderTiers.tier1.members.join(", ")}</div>
                        </Card>
                        <Card className="p-6 bg-white/5 border-white/10">
                          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 6 }}>Tier 2: Execution Teams</div>
                          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{manufacturingDemoData.stakeholderTiers.tier2.count}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{manufacturingDemoData.stakeholderTiers.tier2.members.join(", ")}</div>
                        </Card>
                        <Card className="p-6 bg-white/5 border-white/10">
                          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 6 }}>Tier 3: External Partners</div>
                          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: TEAL, marginBottom: 8 }}>{manufacturingDemoData.stakeholderTiers.tier3.count}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{manufacturingDemoData.stakeholderTiers.tier3.members.join(", ")}</div>
                        </Card>
                      </>
                    )}
                  </div>
                  <div className="text-center">
                    <Button size="lg" onClick={() => setCurrentAct("outcome")} className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8" data-testid="button-view-outcome">
                      View Impact & ROI <DollarSign className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── OUTCOME ACT ────────────────────────────────── */}
        {currentAct === "outcome" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <div className="text-center mb-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4" style={{ color: TEAL }} />
                <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 6 }}>$450M Production Saved</h2>
                <p style={{ fontSize: 16, color: TEAL }}>2-day pause vs. 30-day production halt</p>
              </div>

              <ROIComparison
                traditional={manufacturingDemoData.roiComparison.traditional}
                executionOS={manufacturingDemoData.roiComparison.executionOS}
                bottomLine={manufacturingDemoData.roiComparison.bottomLine}
              />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Production Saved", value: "$450M", color: TEAL },
                  { label: "Response Time", value: "4 hours", color: GOLD },
                  { label: "Vehicles Protected", value: "10,000", color: GOLD },
                  { label: "Production Pause", value: "2 days", color: GOLD },
                ].map(({ label, value, color }) => (
                  <Card key={label} className="p-4 bg-white/5 border-white/10 text-center">
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginBottom: 6 }}>{label}</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 700, color }}>{value}</div>
                  </Card>
                ))}
              </div>

              {/* Manufacturing-specific Execution OS framing */}
              <div className="mt-8 border border-[#C9A84C]/40 p-6" style={{ background: "rgba(201,168,76,0.05)" }}>
                <h3 style={{ ...CG, fontSize: 18, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 10 }}>
                  What This Means for Your Organization
                </h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.75, textAlign: "center", maxWidth: 580, margin: "0 auto" }}>
                  You adopted JIT principles to eliminate waste from your production system. Execution OS brings that same logic to your crisis coordination — eliminating the waste of reactive emergency meetings, duplicated qualification processes, and redundant supplier negotiations. Pre-stage your alternative network once. Activate it in minutes when the trigger fires. The same discipline that made your production floor efficient now applies to your entire response infrastructure.
                </p>
              </div>

              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Button size="lg" onClick={resetDemo} variant="outline" className="border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10" data-testid="button-replay-demo">
                  Replay Demo
                </Button>
                <Link href="/request-access">
                  <Button size="lg" className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">
                    Schedule a Pilot Conversation <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/industry-demos">
                  <Button size="lg" className="bg-transparent border border-white/20 text-white hover:bg-white/10" data-testid="button-explore-more">
                    Explore More Industry Demos
                  </Button>
                </Link>
              </div>

              <div className="text-center mt-6">
                <Link href="/executive-brief">
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", cursor: "pointer", textDecoration: "underline" }}>
                    Download executive brief to share with your board →
                  </span>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
