import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Zap, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Bell,
  Settings,
  Play,
  CheckCircle,
  XCircle,
  Minus,
  Shield,
  Brain,
  BookOpen,
  Users,
  BarChart3,
  AlertTriangle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useEffect } from 'react';
import { updatePageMetadata } from '@/lib/seo';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const YES = () => <CheckCircle className="w-5 h-5 mx-auto" style={{ color: TEAL }} />;
const NO = () => <XCircle className="w-5 h-5 mx-auto" style={{ color: "#E5E7EB" }} />;
const PARTIAL = () => <Minus className="w-5 h-5 mx-auto" style={{ color: GOLD }} />;

const comparisonRows = [
  { feature: "Trigger-to-execution in < 12 minutes", execOS: "yes", crisis: "no", pm: "no" },
  { feature: "170+ pre-built strategic prepared responses", execOS: "yes", crisis: "no", pm: "no" },
  { feature: "Continuous signal monitoring (24/7)", execOS: "yes", crisis: "partial", pm: "no" },
  { feature: "Automated task & budget assignment", execOS: "yes", crisis: "no", pm: "partial" },
  { feature: "Executive stakeholder mobilization", execOS: "yes", crisis: "partial", pm: "no" },
  { feature: "Cross-functional coordination layer", execOS: "yes", crisis: "no", pm: "partial" },
  { feature: "Strategic prepared response customization", execOS: "yes", crisis: "no", pm: "no" },
  { feature: "Outcome tracking & ROI measurement", execOS: "yes", crisis: "no", pm: "partial" },
  { feature: "Enterprise SLA guarantees", execOS: "yes", crisis: "yes", pm: "yes" },
  { feature: "Integrates with existing PM tools", execOS: "yes", crisis: "partial", pm: "yes" },
  { feature: "Incident alerting & notification", execOS: "partial", crisis: "yes", pm: "no" },
  { feature: "Task tracking & sprint management", execOS: "partial", crisis: "no", pm: "yes" },
];

const differentiators = [
  {
    icon: BookOpen,
    stat: "170",
    unit: "Prepared responses",
    label: "Ready to Activate",
    description: "The largest library of proven strategic response prepared responses across 9 domains — Competitive, Crisis, M&A, Talent, Supply Chain, Regulatory, Financial, Operational, and Reputational.",
    color: GOLD,
  },
  {
    icon: Zap,
    stat: "12",
    unit: "Minutes",
    label: "Trigger to Execution",
    description: "From detecting a strategic signal to having projects created, tasks assigned, budgets allocated, and stakeholders mobilized. Industry standard is 20-50 hours.",
    color: TEAL,
  },
  {
    icon: Brain,
    stat: "9",
    unit: "Domains",
    label: "Signal Intelligence",
    description: "AI monitors 500+ data points across competitive, market, operational, and macro signals — firing the right prepared response the moment a strategic trigger is detected.",
    color: NAVY,
  },
  {
    icon: BarChart3,
    stat: "$2M",
    unit: "Per Event",
    label: "Value at Stake",
    description: "The average Fortune 1000 company loses $60K–$2M in coordination lag per major strategic event. Readiness OS eliminates that gap entirely.",
    color: GOLD,
  },
];

const categoryComparison = [
  {
    category: "Crisis Notification",
    vendors: "Everbridge, OnSolve, Noggin",
    does: "Sends mass alerts to employees, coordinates emergency communications, tracks incident status",
    doesNot: "Does not create projects, assign strategic tasks, allocate budget, or execute a coordinated organizational response",
    color: "#E5E7EB",
    textColor: MUTED,
  },
  {
    category: "Strategic Readiness Platform",
    vendors: "Readiness OS (Category of One)",
    does: "Detects strategic triggers, fires the right Readiness Protocol, creates projects, assigns tasks by role, allocates budget, mobilizes stakeholders — all within 12 minutes",
    doesNot: "The only platform that bridges signal detection to coordinated organizational execution",
    color: NAVY,
    textColor: "#fff",
    featured: true,
  },
  {
    category: "Project Management",
    vendors: "Jira, Asana, ServiceNow",
    does: "Tracks tasks, manages sprints, provides workflow automation for pre-defined processes",
    doesNot: "Does not detect strategic triggers, does not know what prepared response to run, requires manual setup for every response",
    color: "#E5E7EB",
    textColor: MUTED,
  },
];

const useCases = [
  {
    trigger: "Competitor launches new product",
    without: "Weeks just to assemble the right team and align stakeholders — execution hasn't started",
    with: "Readiness OS detects the launch, fires the Competitive Response Readiness Protocol, creates 24 tasks across Product, Marketing, Sales, and Legal within 12 minutes",
    icon: Target,
  },
  {
    trigger: "Key executive departure announced",
    without: "Weeks of ad-hoc conversations, unclear ownership, reactive talent and communications planning",
    with: "Leadership Continuity prepared response activates instantly — succession, communications, board briefing, and talent sourcing tasks assigned automatically",
    icon: Users,
  },
  {
    trigger: "Regulatory violation surfaces",
    without: "Legal scrambles to understand scope, comms team improvises, executive team lacks a coordinated narrative",
    with: "Regulatory Crisis prepared response fires — legal, compliance, communications, and executive tasks mobilized with pre-approved response templates in 12 minutes",
    icon: Shield,
  },
  {
    trigger: "Activist investor takes position",
    without: "Board is surprised, IR team has no pre-built defense strategy, response is reactive and fragmented",
    with: "Activist Response prepared response activates — investor relations, legal defense, board briefing, and public narrative tasks launched immediately",
    icon: AlertTriangle,
  },
];

export default function CompetitivePositioning() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Competitive Positioning - Readiness OS | Strategic Readiness Platform",
      description: "See how Readiness OS creates a new category between crisis notification tools (Everbridge, OnSolve) and project management (Jira, Asana). The execution layer Fortune 1000 companies need.",
      ogTitle: "Readiness OS vs. Crisis Tools vs. PM Tools | Category of One",
      ogDescription: "Readiness OS isn't competing with Everbridge or Jira. Readiness OS owns the strategic execution layer between them.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="bg-white">

        {/* Hero */}
        <section style={{ background: NAVY, padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Market Position</span>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
            </div>
            <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,60px)", lineHeight: 1.05, color: "#fff", marginBottom: 20 }}>
              The Strategic Readiness Layer<br />
              <em style={{ fontStyle: "italic", color: "#DFC178" }}>Category of One</em>
            </h1>
            <p style={{ fontSize: 20, color: "rgba(255,255,255,0.7)", maxWidth: 680, margin: "0 auto 12px" }}>
              Crisis tools notify. PM tools track. Readiness OS executes.
            </p>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 600, margin: "0 auto 40px" }}>
              We're not competing with Everbridge or Jira — we own the{" "}
              <span style={{ color: "#DFC178", fontWeight: 600 }}>20–50 hours of coordination</span>{" "}
              that happens between alert and action.
            </p>

            {/* Three Category Visual */}
            <div className="flex flex-wrap justify-center gap-0 mb-12 max-w-3xl mx-auto">
              <div style={{ flex: 1, minWidth: 180, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px", borderRight: "none" }}>
                <Bell className="w-5 h-5 mb-3" style={{ color: "rgba(255,255,255,0.3)" }} />
                <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 4 }}>Crisis Notification</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Everbridge · OnSolve · Noggin</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, border: `2px solid ${GOLD}`, padding: "20px 24px", background: `rgba(201,168,76,0.08)`, position: "relative" }}>
                <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: GOLD, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", padding: "3px 12px", textTransform: "uppercase" }}>Category of One</div>
                <Zap className="w-5 h-5 mb-3" style={{ color: GOLD }} />
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 15, marginBottom: 4 }}>Strategic Readiness</div>
                <div style={{ fontSize: 10, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Readiness OS</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px", borderLeft: "none" }}>
                <Settings className="w-5 h-5 mb-3" style={{ color: "rgba(255,255,255,0.3)" }} />
                <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 4 }}>Project Management</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Jira · Asana · ServiceNow</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" style={{ background: GOLD, color: NAVY, fontWeight: 700 }} className="hover:opacity-90" onClick={() => setLocation('/try-demo')}>
                <Play className="w-5 h-5 mr-2" />
                See 12-Minute Activation
              </Button>
              <Button size="lg" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", background: "transparent" }} className="hover:bg-white/10" onClick={() => setLocation('/contact')}>
                Start Pilot Program
              </Button>
            </div>
          </div>
        </section>

        {/* The Gap We Fill — Timeline */}
        <section style={{ padding: "80px 48px", background: "#fff" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>The Cost of Lag</span>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, color: NAVY, marginBottom: 12 }}>
                The $2M Gap Between Alert and Action
              </h2>
              <p style={{ fontSize: 18, color: MUTED, maxWidth: 600, margin: "0 auto" }}>
                When a strategic event hits, organizations spend 20–50 hours getting organized. 
                That's $60K–$2M in lost value per major event. Readiness OS eliminates that gap entirely.
              </p>
            </div>

            <div style={{ border: `1px solid ${BORDER}`, background: "#fff" }}>
              <div className="grid md:grid-cols-2">
                {/* Without */}
                <div style={{ padding: "48px 40px", borderRight: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 24 }}>Without Readiness OS</div>
                  <div className="flex flex-col gap-0">
                    {[
                      { label: "Alert Received", time: "T+0h", note: "Leadership alerted via email" },
                      { label: "Triage & Assessment", time: "+8h", note: "Who owns this? What do we do?" },
                      { label: "Team Assembly", time: "+16h", note: "Calendar invites, scheduling conflicts" },
                      { label: "Planning Meetings", time: "+24h", note: "Define scope, assign owners" },
                      { label: "Coordination Lag", time: "+48h", note: "Budget approvals, stakeholder alignment" },
                      { label: "Execution Begins", time: "+72h", note: "3 full days lost to coordination" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 0, background: i === 0 ? "#D1D5DB" : "#E5E7EB", border: `2px solid ${i === 0 ? "#9CA3AF" : "#D1D5DB"}`, flexShrink: 0 }} />
                          {i < 5 && <div style={{ width: 1, height: 32, background: "#E5E7EB" }} />}
                        </div>
                        <div style={{ paddingBottom: 16 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{step.label}</span>
                            <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>{step.time}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{step.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#DC2626" }}>30 days of mobilization lag = $136K/hour delayed in lost value (IBM)</span>
                  </div>
                </div>

                {/* With */}
                <div style={{ padding: "48px 40px", background: "rgba(43,138,110,0.02)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: TEAL, marginBottom: 24 }}>With Readiness OS</div>
                  <div className="flex flex-col gap-0">
                    {[
                      { label: "Signal Detected", time: "T+0m", note: "AI monitors 500+ data sources 24/7" },
                      { label: "Readiness Protocol Selected", time: "+2m", note: "Best-fit prepared response matched automatically" },
                      { label: "Projects Created", time: "+5m", note: "Tasks, owners, budgets assigned by role" },
                      { label: "Stakeholders Mobilized", time: "+8m", note: "Executive briefs and assignments sent" },
                      { label: "Execution Underway", time: "+12m", note: "Full organizational response activated" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 0, background: TEAL, flexShrink: 0 }} />
                          {i < 4 && <div style={{ width: 1, height: 32, background: `rgba(43,138,110,0.25)` }} />}
                        </div>
                        <div style={{ paddingBottom: 16 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{step.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>{step.time}</span>
                          </div>
                          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{step.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, padding: "12px 16px", background: "rgba(43,138,110,0.08)", border: `1px solid ${TEAL}` }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>99% faster response · Zero coordination lag · Full execution in 12 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Each Category Does */}
        <section style={{ padding: "80px 48px", background: OFF }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Category Map</span>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, color: NAVY, marginBottom: 12 }}>
                What Each Category Actually Does
              </h2>
              <p style={{ fontSize: 17, color: MUTED, maxWidth: 560, margin: "0 auto" }}>
                Three distinct categories serving three distinct moments in the strategic response lifecycle.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-0">
              {categoryComparison.map((cat, i) => (
                <div key={i} style={{
                  background: cat.featured ? NAVY : "#fff",
                  border: cat.featured ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                  padding: "40px 32px",
                  position: "relative",
                  marginTop: cat.featured ? -8 : 0,
                  marginBottom: cat.featured ? -8 : 0,
                  zIndex: cat.featured ? 2 : 1,
                }}>
                  {cat.featured && (
                    <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: GOLD, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", padding: "4px 16px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      Category of One
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: cat.featured ? GOLD : MUTED, marginBottom: 8 }}>
                    {cat.category}
                  </div>
                  <div style={{ fontSize: 12, color: cat.featured ? "rgba(255,255,255,0.4)" : "#9CA3AF", marginBottom: 24, fontStyle: "italic" }}>
                    {cat.vendors}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: cat.featured ? TEAL : TEAL, marginBottom: 10 }}>What it does</div>
                    <p style={{ fontSize: 14, color: cat.featured ? "rgba(255,255,255,0.8)" : "#374151", lineHeight: 1.6 }}>
                      {cat.does}
                    </p>
                  </div>

                  {!cat.featured && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#EF4444", marginBottom: 10 }}>What it doesn't do</div>
                      <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{cat.doesNot}</p>
                    </div>
                  )}
                  {cat.featured && (
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid rgba(255,255,255,0.1)` }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, lineHeight: 1.6 }}>{cat.doesNot}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section style={{ padding: "80px 48px", background: "#fff" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Feature Matrix</span>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, color: NAVY, marginBottom: 12 }}>
                Capability Comparison
              </h2>
              <p style={{ fontSize: 17, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
                A direct comparison of what each category delivers — and where the critical gaps are.
              </p>
            </div>

            <div style={{ border: `1px solid ${BORDER}`, overflow: "hidden" }}>
              {/* Header */}
              <div className="grid grid-cols-4" style={{ background: NAVY }}>
                <div style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                  Capability
                </div>
                {[
                  { label: "Readiness OS", highlight: true },
                  { label: "Crisis Tools", highlight: false },
                  { label: "PM Tools", highlight: false },
                ].map((col, i) => (
                  <div key={i} style={{ padding: "16px 24px", textAlign: "center", borderLeft: `1px solid rgba(255,255,255,0.08)` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col.highlight ? GOLD : "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>{col.label}</div>
                    {col.highlight && (
                      <div style={{ fontSize: 10, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>Category of One</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {comparisonRows.map((row, i) => (
                <div key={i} className="grid grid-cols-4" style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : OFF }}>
                  <div style={{ padding: "14px 24px", fontSize: 14, color: "#374151", fontWeight: 500, display: "flex", alignItems: "center" }}>
                    {row.feature}
                  </div>
                  <div style={{ borderLeft: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 24px", background: "rgba(43,138,110,0.03)" }}>
                    {row.execOS === "yes" ? <YES /> : row.execOS === "partial" ? <PARTIAL /> : <NO />}
                  </div>
                  <div style={{ borderLeft: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 24px" }}>
                    {row.crisis === "yes" ? <YES /> : row.crisis === "partial" ? <PARTIAL /> : <NO />}
                  </div>
                  <div style={{ borderLeft: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 24px" }}>
                    {row.pm === "yes" ? <YES /> : row.pm === "partial" ? <PARTIAL /> : <NO />}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div style={{ padding: "12px 24px", borderTop: `1px solid ${BORDER}`, background: OFF, display: "flex", gap: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle className="w-4 h-4" style={{ color: TEAL }} />
                  <span style={{ fontSize: 11, color: MUTED }}>Full capability</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Minus className="w-4 h-4" style={{ color: GOLD }} />
                  <span style={{ fontSize: 11, color: MUTED }}>Partial / limited</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <XCircle className="w-4 h-4" style={{ color: "#E5E7EB" }} />
                  <span style={{ fontSize: 11, color: MUTED }}>Not available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Differentiators */}
        <section style={{ padding: "80px 48px", background: OFF }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Why We Win</span>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, color: NAVY, marginBottom: 12 }}>
                The Four Unfair Advantages
              </h2>
              <p style={{ fontSize: 17, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
                Built into the infrastructure of Readiness OS — impossible to replicate by adding a feature to Jira or Everbridge.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              {differentiators.map((d, i) => (
                <div key={i} style={{ border: `1px solid ${BORDER}`, padding: "40px 36px", background: "#fff", borderRight: i % 2 === 0 ? "none" : undefined, borderBottom: i < 2 ? "none" : undefined }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                    <div style={{ width: 56, height: 56, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <d.icon className="w-6 h-6" style={{ color: d.color === NAVY ? "#fff" : d.color === TEAL ? "#fff" : NAVY }} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                        <span style={{ ...CG, fontSize: 40, fontWeight: 700, color: d.color, lineHeight: 1 }}>{d.stat}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: d.color }}>{d.unit}</span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>{d.label}</div>
                      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{d.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real-World Use Cases */}
        <section style={{ padding: "80px 48px", background: "#fff" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>In Practice</span>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, color: NAVY, marginBottom: 12 }}>
                Side-by-Side: The Same Event, Two Outcomes
              </h2>
              <p style={{ fontSize: 17, color: MUTED, maxWidth: 540, margin: "0 auto" }}>
                The difference between Readiness OS and everything else isn't theoretical. It shows up in every strategic event.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {useCases.map((uc, i) => (
                <div key={i} style={{ border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <div style={{ background: NAVY, padding: "16px 32px", display: "flex", alignItems: "center", gap: 12 }}>
                    <uc.icon className="w-5 h-5" style={{ color: GOLD, flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{uc.trigger}</span>
                  </div>
                  <div className="grid md:grid-cols-2">
                    <div style={{ padding: "28px 32px", borderRight: `1px solid ${BORDER}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 12 }}>Without Readiness OS</div>
                      <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.65 }}>{uc.without}</p>
                    </div>
                    <div style={{ padding: "28px 32px", background: "rgba(43,138,110,0.03)" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 12 }}>With Readiness OS</div>
                      <p style={{ fontSize: 14, color: "#1F2937", lineHeight: 1.65 }}>{uc.with}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The 170 Prepared responses Section */}
        <section style={{ background: NAVY, padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>The Readiness Protocol Library</span>
                </div>
                <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, color: "#fff", marginBottom: 20 }}>
                  170 Prepared responses No One Else Has
                </h2>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 32 }}>
                  Every prepared response in Readiness OS took years to develop — built from real Fortune 1000 strategic events, refined by operating executives, and continuously improved through outcome data.
                </p>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 40 }}>
                  You can't buy this institutional knowledge off the shelf. You can't build it in a year. And no PM tool or crisis notification vendor has it — because they're solving a different problem.
                </p>
                <Button size="lg" style={{ background: GOLD, color: NAVY, fontWeight: 700 }} className="hover:opacity-90" onClick={() => setLocation('/playbooks')}>
                  Explore the Readiness Protocol Library
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-0">
                {[
                  { domain: "Competitive", count: 22, color: TEAL },
                  { domain: "Crisis", count: 18, color: "#EF4444" },
                  { domain: "M&A", count: 21, color: GOLD },
                  { domain: "Talent", count: 16, color: TEAL },
                  { domain: "Supply Chain", count: 19, color: GOLD },
                  { domain: "Regulatory", count: 20, color: TEAL },
                  { domain: "Financial", count: 18, color: GOLD },
                  { domain: "Operational", count: 17, color: TEAL },
                  { domain: "Reputational", count: 19, color: GOLD },
                ].map((d, i) => (
                  <div key={i} style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "20px 16px", textAlign: "center", background: i === 4 ? "rgba(255,255,255,0.05)" : "transparent" }}>
                    <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: d.color, lineHeight: 1, marginBottom: 4 }}>{d.count}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", lineHeight: 1.3 }}>{d.domain}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: OFF, padding: "80px 48px" }}>
          <div className="max-w-3xl mx-auto text-center">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Get Started</span>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, color: NAVY, marginBottom: 12 }}>
              Stop Managing. Start Executing.
            </h2>
            <p style={{ fontSize: 17, color: MUTED, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
              Join the pilot program and see what a 12-minute strategic response looks like for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" style={{ background: NAVY, color: "#fff", fontWeight: 700 }} className="hover:opacity-90" onClick={() => setLocation('/contact')}>
                Request Pilot Access
              </Button>
              <Button size="lg" style={{ border: `1.5px solid ${BORDER}`, color: NAVY, background: "transparent", fontWeight: 600 }} className="hover:bg-white" onClick={() => setLocation('/try-demo')}>
                Try Interactive Demo
              </Button>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
