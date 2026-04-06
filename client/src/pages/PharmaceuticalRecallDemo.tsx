import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pill, Heart, AlertTriangle, CheckCircle, Clock, Users, DollarSign, ShieldAlert, ArrowLeft, Play, ArrowRight, FileText, ChevronRight } from "lucide-react";
import AIRadarSimulation from "@/components/demo/AIRadarSimulation";
import TwelveMinuteTimer from "@/components/demo/TwelveMinuteTimer";
import ROIComparison from "@/components/demo/ROIComparison";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import { pharmaDemoData } from "@shared/pharma-demo-data";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

type DemoAct = "intro" | "detection" | "coordination" | "outcome";

const fdaClassifications = [
  { class: "Class I", description: "Reasonable probability of serious adverse health consequences or death", color: "#EF4444" },
  { class: "Class II", description: "May cause temporary adverse health consequences", color: GOLD },
  { class: "Class III", description: "Not likely to cause adverse health consequences", color: TEAL },
];

const notificationCascade = [
  { step: "0:00", action: "AI detects dissolution failure in quality monitoring", stakeholder: "Quality Control System", severity: "trigger" },
  { step: "0:30", action: "Execution OS classifies as Class I recall criteria", stakeholder: "Compliance AI", severity: "critical" },
  { step: "1:00", action: "VP Quality, CMO, General Counsel, CEO notified simultaneously", stakeholder: "Executive Team (4)", severity: "critical" },
  { step: "2:00", action: "FDA MedWatch notification drafted and queued for approval", stakeholder: "Regulatory Affairs", severity: "high" },
  { step: "3:00", action: "47M unit traceability report generated — lot numbers, dates, distribution network", stakeholder: "Supply Chain (12)", severity: "high" },
  { step: "5:00", action: "Wholesaler and pharmacy notification templates sent — 847 distribution points", stakeholder: "Commercial Operations (847)", severity: "high" },
  { step: "7:00", action: "Healthcare provider alerts staged — 1,189 prescribing physicians notified", stakeholder: "Medical Affairs (1,189)", severity: "medium" },
  { step: "12:00", action: "All 2,052 stakeholders coordinated. FDA filing submitted. Patient exposure window closed.", stakeholder: "Full Organization (2,052)", severity: "complete" },
];

export default function PharmaceuticalRecallDemo() {
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
      <DemoNavHeader title="Pharmaceutical Recall — Class I Response" showBackButton={true} />

      {/* Act Navigation */}
      <div className="border-b border-white/10 bg-white/5 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {[
              { id: "intro", label: "1. Scenario", icon: Play },
              { id: "detection", label: "2. AI Detection @ 92%", icon: ShieldAlert },
              { id: "coordination", label: "3. 12-Min Coordination", icon: Clock },
              { id: "outcome", label: "4. Life Saved", icon: Heart }
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

      <ExecutionStageGuide variant="banner" />
      <div className="container mx-auto px-6 py-12 text-white">

        {/* ── INTRO ACT ──────────────────────────────────── */}
        {currentAct === "intro" && (
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 border border-[#C9A84C]/40 text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD, background: "rgba(201,168,76,0.08)" }}>
                Pharmaceutical & Life Sciences · Product Safety Domain
              </div>
              <h1 style={{ ...CG, fontSize: "clamp(26px,4vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
                {pharmaDemoData.crisis.title}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17 }}>
                {pharmaDemoData.crisis.subtitle}
              </p>
            </div>

            {/* Industry Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { stat: "2,052", label: "Stakeholders requiring notification in a Class I recall", source: "FDA 21 CFR 7.40–7.49" },
                { stat: "6 weeks", label: "Industry average coordination time without automation", source: "Glenmark Recall, May–June 2024" },
                { stat: "$50M+", label: "Average liability exposure per delayed patient notification day", source: "FDA enforcement data" },
              ].map(({ stat, label, source }) => (
                <div key={stat} className="border border-white/10 p-5 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ ...CG, fontSize: 34, fontWeight: 700, color: GOLD, marginBottom: 6 }}>{stat}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{source}</div>
                </div>
              ))}
            </div>

            {/* FDA Classifications */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 20, height: 1.5, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>FDA Recall Classification System</span>
              </div>
              <div className="space-y-2">
                {fdaClassifications.map(({ class: cls, description, color }) => (
                  <div key={cls} className="flex items-center gap-4 p-3 border border-white/10" style={{ background: cls === "Class I" ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.03)" }}>
                    <div style={{ minWidth: 70, fontSize: 12, fontWeight: 700, color }}>{cls}</div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{description}</div>
                    {cls === "Class I" && <Badge className="ml-auto text-[10px] bg-red-500/20 text-red-400 border-red-500/30">This Scenario</Badge>}
                  </div>
                ))}
              </div>
            </div>

            {/* The Real Case */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-white/10">
                <h3 style={{ ...CG, fontWeight: 700, color: "#fff", fontSize: 17, marginBottom: 16 }} className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: GOLD }} />
                  The Crisis
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Organization", value: "Glenmark Pharmaceuticals" },
                    { label: "Product", value: "Potassium Chloride Capsules" },
                    { label: "Defect", value: "Capsules failed to dissolve — potentially deadly" },
                    { label: "Scale", value: "47 Million Units Recalled", highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label}>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 2 }}>{label}</div>
                      <div style={{ color: highlight ? GOLD : "#fff", fontWeight: highlight ? 700 : 500 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white/5 border border-white/10">
                <h3 style={{ ...CG, fontWeight: 700, color: "#fff", fontSize: 17, marginBottom: 16 }}>What Happened (May–June 2024)</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { text: "Weeks 1–3: Internal investigation", highlight: false },
                    { text: "Week 4 (May): Quietly notified wholesalers only", highlight: false },
                    { text: "Week 5: 91-year-old patient takes defective capsules", highlight: true },
                    { text: "Week 5: Patient dies from lethal potassium levels", highlight: true },
                    { text: "Week 6 (June): Public announcement", highlight: false },
                    { text: "Family learns weeks later medication caused the death", highlight: false, dim: true },
                  ].map(({ text, highlight, dim }) => (
                    <li key={text} style={{ color: highlight ? GOLD : dim ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.6)", fontWeight: highlight ? 700 : 400 }}>
                      • {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* The Detection-Execution Gap */}
            <div className="border border-[#C9A84C]/40 p-6" style={{ background: "rgba(201,168,76,0.05)" }}>
              <div className="flex items-start gap-4">
                <ShieldAlert className="w-7 h-7 flex-shrink-0 mt-1" style={{ color: GOLD }} />
                <div>
                  <h3 style={{ ...CG, fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                    The Detection–Coordination Gap That Cost a Life
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontSize: 14 }}>
                    Glenmark had the technology to detect the dissolution problem. But coordinating 2,052 stakeholders across FDA, wholesalers, pharmacies, and patients took <strong style={{ color: GOLD }}>6 weeks</strong>. In that gap, a patient died. This demo shows how Execution OS compresses that 6-week coordination into 12 minutes — ensuring the patient <strong style={{ color: GOLD }}>never received the deadly capsules</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* 12-Minute Notification Cascade */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 20, height: 1.5, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Execution OS 12-Minute Notification Cascade</span>
              </div>
              <div className="space-y-1.5">
                {notificationCascade.map(({ step, action, stakeholder, severity }) => (
                  <div key={step + action} className="flex items-start gap-4 p-3 border border-white/8" style={{
                    background: severity === "trigger" ? "rgba(201,168,76,0.06)" : severity === "complete" ? "rgba(43,138,110,0.06)" : "rgba(255,255,255,0.02)"
                  }}>
                    <div style={{ minWidth: 44, fontSize: 11, fontWeight: 700, color: severity === "complete" ? TEAL : GOLD }}>{step}</div>
                    <div className="flex-1">
                      <div style={{ fontSize: 12, color: "#fff", marginBottom: 2 }}>{action}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{stakeholder}</div>
                    </div>
                    {severity === "complete" && <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <Button size="lg" onClick={() => setCurrentAct("detection")} className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-10 py-5" data-testid="button-start-demo">
                Begin Crisis Simulation
                <Play className="w-5 h-5 ml-2" />
              </Button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>Interactive simulation — AI detects the defect, Execution OS coordinates the recall</p>
            </div>
          </div>
        )}

        {/* ── DETECTION ACT ──────────────────────────────── */}
        {currentAct === "detection" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 style={{ ...CG, fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 20 }} className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8" style={{ color: GOLD }} />
                AI Quality Monitoring Detects Critical Failure
              </h2>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>AI Confidence Level</span>
                  <span style={{ ...CG, fontSize: 24, fontWeight: 700, color: GOLD }}>{detectionProgress}%</span>
                </div>
                <Progress value={detectionProgress} className="h-3 bg-white/10 [&>div]:bg-[#C9A84C]" />
                {detectionProgress >= 92 && (
                  <div className="mt-4 p-4 border border-[#C9A84C]" style={{ background: "rgba(201,168,76,0.08)" }}>
                    <p style={{ color: GOLD, fontWeight: 700, fontSize: 13 }}>
                      ⚠️ ALERT: Class I recall criteria detected — Reasonable probability of serious adverse health consequences or death
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
                  <Button size="lg" onClick={() => setCurrentAct("coordination")} className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8" data-testid="button-activate-playbook">
                    Activate Playbook #095 — Product Recall
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
                12-Minute Coordinated Response Across 2,052 Stakeholders
              </h2>
              <TwelveMinuteTimer
                timelineEvents={pharmaDemoData.timelineEvents}
                onComplete={() => setCoordinationComplete(true)}
                autoStart={true}
              />
              {coordinationComplete && (
                <div className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {pharmaDemoData.stakeholderTiers && (
                      <>
                        <Card className="p-6 bg-white/5 border-white/10">
                          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 6 }}>Tier 1: Decision Makers</div>
                          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{pharmaDemoData.stakeholderTiers.tier1.count}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{pharmaDemoData.stakeholderTiers.tier1.members.join(", ")}</div>
                        </Card>
                        <Card className="p-6 bg-white/5 border-white/10">
                          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 6 }}>Tier 2: Execution Teams</div>
                          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{pharmaDemoData.stakeholderTiers.tier2.count}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{pharmaDemoData.stakeholderTiers.tier2.members.join(", ")}</div>
                        </Card>
                        <Card className="p-6 bg-white/5 border-white/10">
                          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 6 }}>Tier 3: Public Notification</div>
                          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: TEAL, marginBottom: 8 }}>{pharmaDemoData.stakeholderTiers.tier3.count}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{pharmaDemoData.stakeholderTiers.tier3.members.join(", ")}</div>
                        </Card>
                      </>
                    )}
                  </div>
                  <div className="text-center">
                    <Button size="lg" onClick={() => setCurrentAct("outcome")} className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8" data-testid="button-view-outcome">
                      View Impact & ROI <Heart className="w-5 h-5 ml-2" />
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
                <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: TEAL }} />
                <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 6 }}>A Life Saved</h2>
                <p style={{ fontSize: 16, color: TEAL }}>The patient never received the deadly capsules</p>
              </div>

              <ROIComparison
                traditional={pharmaDemoData.roiComparison.traditional}
                executionOS={pharmaDemoData.roiComparison.executionOS}
                bottomLine={pharmaDemoData.roiComparison.bottomLine}
              />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Lives Saved", value: "1+", color: TEAL },
                  { label: "Liability Avoided", value: "$50M+", color: GOLD },
                  { label: "Stakeholders Coordinated", value: "2,052", color: GOLD },
                  { label: "Coordination Time", value: "12 min", color: GOLD },
                ].map(({ label, value, color }) => (
                  <Card key={label} className="p-4 bg-white/5 border-white/10 text-center">
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginBottom: 6 }}>{label}</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 700, color }}>{value}</div>
                  </Card>
                ))}
              </div>

              {/* Pharma-specific Execution OS framing */}
              <div className="mt-8 border border-[#C9A84C]/40 p-6" style={{ background: "rgba(201,168,76,0.05)" }}>
                <h3 style={{ ...CG, fontSize: 18, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 10 }}>
                  What This Means for Your Organization
                </h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.75, textAlign: "center", maxWidth: 580, margin: "0 auto" }}>
                  Life sciences companies carry the highest accountability of any industry — FDA oversight, patient safety obligations, and public trust. Your quality systems detect problems in real time. But your coordination model was designed for a world without AI. Execution OS pre-stages your entire notification cascade — FDA, wholesalers, pharmacies, physicians, and patients — before a recall is ever triggered. When detection fires, execution is already in motion.
                </p>
              </div>

              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Button size="lg" onClick={resetDemo} variant="outline" className="bg-transparent border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10" data-testid="button-replay-demo">
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
