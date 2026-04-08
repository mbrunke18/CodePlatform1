import StandardNav from '@/components/layout/StandardNav';
import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, PlayCircle, BarChart3, Clock, Target, Award, AlertTriangle, Users, DollarSign, ArrowRight, TrendingDown, Eye, Shield } from 'lucide-react';
import AIRadarSimulation from '@/components/demo/AIRadarSimulation';
import TwelveMinuteTimer from '@/components/demo/TwelveMinuteTimer';
import ROIComparison from '@/components/demo/ROIComparison';
import DemoNavHeader from '@/components/demo/DemoNavHeader';
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import { crisisScenario, luxuryOrg, playbookTemplate, roiComparisonData, twelveMinuteTimeline } from '@shared/luxury-demo-data';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const luxuryDemoData = { timelineEvents: twelveMinuteTimeline };

type DemoAct = 'intro' | 'detection' | 'coordination' | 'outcome' | 'complete';

const luxuryVulnerabilities = [
  {
    title: "Brand Equity IS the Asset",
    body: "For LVMH or Kering, the brand IS the balance sheet. A Chanel or Hermès crisis doesn't just affect quarterly revenue — it erodes the accumulated trust that took decades to build. Share prices move 3–7% within 24 hours of a major reputational incident.",
    icon: TrendingDown,
    color: "#EF4444",
  },
  {
    title: "Social Media Velocity",
    body: "A luxury crisis reaches 10M social media impressions in 47 minutes (vs. 8 hours in 2018). The coordination window before narrative control is lost has compressed from days to under an hour. Traditional response timelines don't fit.",
    icon: Eye,
    color: GOLD,
  },
  {
    title: "Private Client Relationships",
    body: "Your top 2% of clients generate 40% of revenue. They expect personal, private communication before public announcements. Failure to notify VIP clients before they see it on social media is a relationship-ending event.",
    icon: Users,
    color: TEAL,
  },
];

const luxuryStakeholderCascade = [
  { step: "0:00", action: "AI social monitoring detects reputational trigger — 92% confidence threshold crossed", stakeholder: "Brand Intelligence System", highlight: true },
  { step: "0:45", action: "CEO, CCO, Global Brand Director, General Counsel, Board Chair notified", stakeholder: "Executive Command (5)" },
  { step: "2:00", action: "VIP Client Communication drafted — personal outreach for 847 Tier 1 clients", stakeholder: "Client Relations (847 private clients)" },
  { step: "3:30", action: "Maison brand leads across 75 locations briefed with talking points", stakeholder: "Regional Brand Directors (28 Maisons)" },
  { step: "5:00", action: "Press office receives approved statement and social media response protocol", stakeholder: "Communications & PR" },
  { step: "7:00", action: "Wholesale and retail partners notified — 4,200 points of sale briefed", stakeholder: "Commercial Network (4,200 locations)" },
  { step: "10:00", action: "ESG and governance team prepares board update and investor relations brief", stakeholder: "Governance & Investor Relations" },
  { step: "12:00", action: "All 193 stakeholders coordinated. Narrative controlled. VIP clients already received personal calls.", stakeholder: "Full Organization (193 Stakeholders)", complete: true },
];

const brandEquityMetrics = [
  { metric: "47 min", label: "Time for a luxury crisis to reach 10M social impressions", benchmark: "vs. 8 hours in 2018" },
  { metric: "3–7%", label: "Share price impact within 24 hours of a reputational incident", benchmark: "Luxury sector average" },
  { metric: "40%", label: "Revenue from top 2% of private clients — first to require personal outreach", benchmark: "Internal luxury industry data" },
];

export default function LuxuryCrisisDemo() {
  const [currentAct, setCurrentAct] = useState<DemoAct>('intro');

  const proceedToNextAct = () => {
    const seq: DemoAct[] = ['intro', 'detection', 'coordination', 'outcome', 'complete'];
    const idx = seq.indexOf(currentAct);
    if (idx < seq.length - 1) {
      setCurrentAct(seq[idx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: NAVY }}>
      <DemoNavHeader title="Luxury Brand Reputational Crisis Response" showBackButton={true} />

      {/* Act Navigation */}
      <div className="border-b border-white/10 bg-white/5 pt-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-2">
            {[
              { id: 'intro', label: 'Scenario' },
              { id: 'detection', label: 'Act 1: Detection' },
              { id: 'coordination', label: 'Act 2: Coordination' },
              { id: 'outcome', label: 'Act 3: Outcome' },
            ].map((act, index, arr) => (
              <div key={act.id} className="flex items-center">
                <button
                  onClick={() => setCurrentAct(act.id as DemoAct)}
                  className={`px-4 py-2 text-sm font-semibold border transition-colors ${currentAct === act.id ? "text-[#C9A84C] border-[#C9A84C] bg-white/5" : "text-white/50 border-transparent hover:bg-white/5"}`}
                >
                  {act.label}
                </button>
                {index < arr.length - 1 && <ChevronRight className="h-4 w-4 mx-1 text-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ExecutionStageGuide variant="banner" />
      <div className="container mx-auto px-4 py-12 pt-10 max-w-6xl text-white">

        {/* ── INTRO ACT ──────────────────────────────────── */}
        {currentAct === 'intro' && (
          <div className="space-y-8">

            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 border border-[#C9A84C]/40 text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD, background: "rgba(201,168,76,0.08)" }}>
                Luxury & Premium Goods · Brand & Reputation Domain
              </div>
              <h1 style={{ ...CG, fontSize: "clamp(26px,4vw,48px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
                {crisisScenario.title}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, marginBottom: 0 }}>
                {crisisScenario.subtitle}
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
                Experience how Command OS transforms AI detection into coordinated execution — turning a {crisisScenario.financialImpact} crisis into a strategic advantage in 12 minutes.
              </p>
            </div>

            {/* Brand Equity Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {brandEquityMetrics.map(({ metric, label, benchmark }) => (
                <div key={metric} className="border border-white/10 p-5 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, marginBottom: 6 }}>{metric}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{benchmark}</div>
                </div>
              ))}
            </div>

            {/* Why Luxury Is Uniquely Exposed */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 20, height: 1.5, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Why Luxury Brands Are Uniquely Exposed</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {luxuryVulnerabilities.map(({ title, body, icon: Icon, color }) => (
                  <div key={title} className="border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <Icon className="w-6 h-6 mb-4" style={{ color }} />
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{title}</h4>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organization + Crisis */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 style={{ ...CG, fontWeight: 700, color: "#fff", fontSize: 17, marginBottom: 16 }}>{luxuryOrg.name}</h3>
                <Badge variant="outline" className="mb-4 text-[#C9A84C] border-[#C9A84C]">{luxuryOrg.industry}</Badge>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {[
                    { value: luxuryOrg.marketCap, label: "Market Cap" },
                    { value: luxuryOrg.brands, label: "Maisons" },
                    { value: luxuryOrg.regions, label: "Regions" },
                    { value: `${(luxuryOrg.employees / 1000).toFixed(0)}K`, label: "Employees" },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD }}>{value}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex items-start gap-3 mb-4">
                  <Target className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: GOLD }} />
                  <h3 style={{ ...CG, fontWeight: 700, color: "#fff", fontSize: 17 }}>The Crisis Event</h3>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 16 }}>
                  {crisisScenario.triggerEvent}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Financial Impact", value: crisisScenario.financialImpact },
                    { label: "Response Window", value: crisisScenario.timeWindow },
                    { label: "Stakeholders", value: crisisScenario.stakeholdersInvolved },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/5 p-3 border border-white/10 text-center">
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{label}</div>
                      <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: GOLD }}>{value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Playbook */}
            <Card className="p-6 bg-white/5 border-[#C9A84C]/50 border-2">
              <div className="flex items-start gap-4">
                <div className="p-3" style={{ background: GOLD }}>
                  <Award className="h-6 w-6" style={{ color: NAVY }} />
                </div>
                <div className="flex-1">
                  <h3 style={{ ...CG, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                    Playbook {playbookTemplate.number}: {playbookTemplate.name}
                  </h3>
                  <Badge className="mb-4 text-white" style={{ background: TEAL }}>{playbookTemplate.domain}</Badge>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
                    This playbook is {playbookTemplate.preparedness}% prepared — pre-filled stakeholders, VIP client communication templates, Maison briefing protocols, and execution plans ready to activate.
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {playbookTemplate.sections.slice(0, 4).map(section => (
                      <div key={section.name} className="bg-white/5 p-3 border border-white/10 text-center">
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{section.name}</div>
                        <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: GOLD }}>{section.prefill}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 12-Minute Cascade */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 20, height: 1.5, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Command OS 12-Minute Stakeholder Cascade</span>
              </div>
              <div className="space-y-1.5">
                {luxuryStakeholderCascade.map(({ step, action, stakeholder, highlight, complete }) => (
                  <div key={step + action} className="flex items-start gap-4 p-3 border border-white/8" style={{
                    background: complete ? "rgba(43,138,110,0.06)" : highlight ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)"
                  }}>
                    <div style={{ minWidth: 44, fontSize: 11, fontWeight: 700, color: complete ? TEAL : GOLD }}>{step}</div>
                    <div className="flex-1">
                      <div style={{ fontSize: 12, color: "#fff", marginBottom: 2 }}>{action}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{stakeholder}</div>
                    </div>
                    {complete && <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <Button size="lg" onClick={proceedToNextAct} className="gap-2 bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-10 py-5" data-testid="button-start-demo">
                <PlayCircle className="h-5 w-5" />
                Begin Crisis Simulation
              </Button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>Interactive simulation — AI detects, Command OS coordinates your Maisons and VIP clients simultaneously</p>
            </div>
          </div>
        )}

        {/* ── DETECTION ACT ──────────────────────────────── */}
        {currentAct === 'detection' && (
          <div className="space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 style={{ ...CG, fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Act 1: AI Detection</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 16, lineHeight: 1.7 }}>
                {crisisScenario.narrative.detection}
              </p>
              <Badge variant="outline" className="text-[#C9A84C] border-[#C9A84C]">Watch the AI confidence score climb in real-time</Badge>
            </Card>
            <AIRadarSimulation onTriggerFired={proceedToNextAct} autoStart={true} />
            <div className="text-center" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              The AI will automatically proceed when trigger threshold is reached...
            </div>
          </div>
        )}

        {/* ── COORDINATION ACT ───────────────────────────── */}
        {currentAct === 'coordination' && (
          <div className="space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 style={{ ...CG, fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Act 2: The 12-Minute Coordination</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 16, lineHeight: 1.7 }}>
                {crisisScenario.narrative.coordination}
              </p>
              <Badge variant="outline" className="text-[#C9A84C] border-[#C9A84C]">
                <Clock className="h-3 w-3 mr-1 inline" />
                Watch 193 stakeholders coordinate in real-time
              </Badge>
            </Card>
            <TwelveMinuteTimer timelineEvents={luxuryDemoData.timelineEvents} onComplete={proceedToNextAct} autoStart={true} />
            <div className="text-center" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              The timer will automatically proceed when coordination is complete...
            </div>
          </div>
        )}

        {/* ── OUTCOME ACT ────────────────────────────────── */}
        {currentAct === 'outcome' && (
          <div className="space-y-8">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 style={{ ...CG, fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Act 3: The Outcome</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 16, lineHeight: 1.7 }}>
                {crisisScenario.narrative.outcome}
              </p>
              <Badge variant="outline" className="text-[#2B8A6E] border-[#2B8A6E]">
                <BarChart3 className="h-3 w-3 mr-1 inline" />
                See the ROI comparison
              </Badge>
            </Card>
            <ROIComparison
              traditional={{ label: roiComparisonData.traditional.title, duration: roiComparisonData.traditional.timeline, approach: roiComparisonData.traditional.approach, outcome: roiComparisonData.traditional.outcome, points: roiComparisonData.traditional.points }}
              executionOS={{ label: roiComparisonData.executionOS.title, duration: roiComparisonData.executionOS.timeline, approach: roiComparisonData.executionOS.approach, outcome: roiComparisonData.executionOS.outcome, points: roiComparisonData.executionOS.points }}
              bottomLine={roiComparisonData.bottomLine}
            />
            <div className="text-center">
              <Button size="lg" onClick={proceedToNextAct} className="gap-2 bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]" data-testid="button-see-summary">
                See Final Summary <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── COMPLETE ACT ───────────────────────────────── */}
        {currentAct === 'complete' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <Card className="p-12 bg-white/5 border-white/10 text-center">
              <Award className="h-16 w-16 mx-auto mb-6" style={{ color: TEAL }} />
              <h2 style={{ ...CG, fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Demo Complete</h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 32px" }}>
                You've just experienced how Command OS turns the gap between AI detection and human execution — from weeks of coordination chaos to 12 minutes of orchestrated brand protection.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  { value: "$280M", label: "Brand Value Preserved", color: TEAL },
                  { value: "12 min", label: "Full Coordination", color: GOLD },
                  { value: "193", label: "Stakeholders Aligned", color: GOLD },
                ].map(({ value, label, color }) => (
                  <Card key={label} className="p-6 bg-white/5 border-white/10">
                    <div style={{ ...CG, fontSize: 36, fontWeight: 700, color, marginBottom: 8 }}>{value}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{label}</div>
                  </Card>
                ))}
              </div>

              {/* Luxury-specific insight */}
              <div className="p-6 border-2 border-[#C9A84C]/50 mb-8 text-left" style={{ background: "rgba(201,168,76,0.05)" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>The Strategic Insight for Luxury</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>
                  Luxury brands are spending billions on AI for threat detection and social monitoring. But without Command OS, they're still losing the critical first 12 minutes to coordination chaos — manual phone trees, unclear accountability, and delayed VIP client communication that cannot be undone. Command OS is the missing piece: the operating model layer that turns detection into coordinated protection, before the narrative escapes.
                </p>
              </div>

              <div className="flex gap-4 justify-center flex-wrap mb-6">
                <Button size="lg" onClick={() => setCurrentAct('intro')} variant="outline" className="bg-transparent text-white border-white/20 hover:bg-white/10" data-testid="button-restart-demo">
                  Restart Demo
                </Button>
                <Link href="/request-access">
                  <Button size="lg" className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">
                    Schedule a Pilot Conversation <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" onClick={() => window.location.href = '/playbook-library'} className="bg-transparent border border-white/20 text-white hover:bg-white/10" data-testid="button-explore-playbooks">
                  Explore All 170 Playbooks
                </Button>
              </div>

              <Link href="/executive-brief">
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", cursor: "pointer", textDecoration: "underline" }}>
                  Download executive brief to share with your board →
                </span>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
