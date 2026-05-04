import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLocation, Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { AlertTriangle, Clock, TrendingUp, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const INDUSTRY_SCENARIOS: Record<string, Array<{ title: string; trigger: string; without: string; with: string; cost: string }>> = {
  financial_services: [
    { title: "Regulatory Inquiry Response", trigger: "SEC enforcement letter received 9 AM", without: "Weeks to organize legal, compliance, and communications teams — market speculation drives 4% stock decline", with: "Full response team assembled with pre-staged regulatory Readiness Protocol in 12 minutes. Investor relations notified before markets open.", cost: "$2.1M–$8.4M prevented" },
    { title: "Competitor Product Launch", trigger: "Major rival announces competing product", without: "3 days to convene product, sales, and marketing. Customers field calls with no unified message.", with: "Competitive response Readiness Protocol activates. Sales talking points, retention offers, and PR strategy deployed before EOD.", cost: "$4.2M retained" },
    { title: "Ransomware Incident", trigger: "Critical systems encrypted 3 AM", without: "20+ hours of ad-hoc crisis management. Board unaware until media reports. Regulatory filing missed.", with: "Crisis Readiness Protocol activates. CISO, General Counsel, Board Chair, and regulators notified with coordinated comms in 12 minutes.", cost: "$18M exposure reduced" },
  ],
  healthcare: [
    { title: "Product Recall Event", trigger: "FDA adverse event report triggers recall threshold", without: "4 days to coordinate legal, supply chain, patient safety, and communications — regulatory penalties compound", with: "Recall Readiness Protocol stages physician notifications, supply chain holds, and FDA response in parallel — 12 minutes to full coordination", cost: "$6.8M–$22M prevented" },
    { title: "Clinical Trial Result", trigger: "Phase 3 trial data released — mixed results", without: "Weeks of internal debate before investor and partner communications. Stock drops 18% on uncertainty.", with: "IR, medical affairs, and legal aligned in 12 minutes with pre-cleared messaging templates and board briefing staged.", cost: "$31M market cap protected" },
    { title: "Supply Chain Disruption", trigger: "Critical API supplier halts production", without: "3-week delay in identifying alternates. Manufacturing paused. Patient supply at risk.", with: "Supplier backup Readiness Protocol activates. 4 qualified alternates contacted with pre-approved qualification protocols within hours.", cost: "$9.2M revenue protected" },
  ],
  technology: [
    { title: "Platform Outage", trigger: "Tier-1 production outage 2 AM", without: "2 hours to assemble incident response. Customer trust erodes. SLA penalties accumulate.", with: "Incident response Readiness Protocol fires. Engineering leads, customer success, and communications coordinated within minutes.", cost: "$1.8M SLA penalties avoided" },
    { title: "Competitive Feature Launch", trigger: "Competitor ships major AI feature", without: "5 days to align product, engineering, sales, and marketing on counter-strategy.", with: "Competitive response Readiness Protocol activates. Roadmap acceleration options, customer retention campaign, and partner briefing in 12 minutes.", cost: "$7.1M churn prevented" },
    { title: "Data Breach Discovery", trigger: "Security team confirms unauthorized access", without: "8+ hours before legal and comms engaged. Notification SLA window missed in 3 states.", with: "Breach response Readiness Protocol coordinates legal, security, comms, and regulators simultaneously — notification requirements met.", cost: "$14M regulatory exposure reduced" },
  ],
  manufacturing: [
    { title: "Supplier Failure", trigger: "Tier-1 supplier declares force majeure", without: "1 week to identify and qualify alternates. Production line halts. Customer penalties trigger.", with: "Supply chain resilience Readiness Protocol activates 6 pre-qualified backup suppliers simultaneously. Production continuity maintained.", cost: "$3.4M production loss prevented" },
    { title: "Product Quality Alert", trigger: "Field failure rate spike detected", without: "4 days to convene quality, legal, supply chain, and sales. Recall decision delayed.", with: "Quality response Readiness Protocol coordinates containment, root cause analysis, and customer communications in 12 minutes.", cost: "$8.7M liability reduced" },
    { title: "Labor Action Signal", trigger: "Union organizing activity detected at 2 plants", without: "2 weeks of internal debate. External consultants delayed. Employee relations deteriorate.", with: "Labor relations Readiness Protocol stages leadership communications, HR protocols, and legal briefing before situation escalates.", cost: "$5.1M operational risk reduced" },
  ],
  energy: [
    { title: "Grid Failure Event", trigger: "Regional grid instability alert received", without: "Hours to mobilize operations, regulatory affairs, and communications. Public criticism mounts.", with: "Grid response Readiness Protocol coordinates operations, regulators, and public communications in 12 minutes. Restoration timeline published.", cost: "$11.2M regulatory exposure reduced" },
    { title: "ESG Activist Campaign", trigger: "Major ESG fund announces divestment campaign", without: "3 days to align investor relations, sustainability, and legal on response strategy.", with: "ESG response Readiness Protocol activates. Board briefing, investor FAQs, and sustainability data package prepared in 12 minutes.", cost: "$890M market cap protected" },
    { title: "Regulatory Change", trigger: "FERC issues new compliance requirement", without: "Compliance assessment takes 6 weeks. Operations exposed during analysis gap.", with: "Regulatory response Readiness Protocol stages compliance gap analysis, legal review, and operational adjustments simultaneously.", cost: "$4.6M compliance risk reduced" },
  ],
  retail: [
    { title: "Food Safety Alert", trigger: "Supplier contamination warning received", without: "3 days to pull product, notify customers, and coordinate with FDA. Brand damage compounds.", with: "Food safety Readiness Protocol coordinates product withdrawal, customer notifications, and FDA response in 12 minutes.", cost: "$5.8M brand protection" },
    { title: "Inventory Crisis", trigger: "Key holiday product out-of-stock at 40% of locations", without: "Week-long internal coordination before customer-facing solutions deployed. Competitor gains share.", with: "Supply Readiness Protocol redirects inventory, updates digital channels, and activates customer messaging simultaneously.", cost: "$12.3M revenue saved" },
    { title: "Reputational Crisis", trigger: "Viral social media incident surfaces", without: "6–18 hours to approve communications. Social narrative set by competitors and media.", with: "Crisis communications Readiness Protocol gives comms team pre-approved response frameworks and executive approval in 12 minutes.", cost: "$3.2M brand equity protected" },
  ],
  other: [
    { title: "Competitive Disruption", trigger: "Market disruptor announces aggressive expansion", without: "3+ days to align leadership and deploy counter-strategy across functions.", with: "Competitive response Readiness Protocol stages cross-functional coordination, messaging, and customer retention in 12 minutes.", cost: "$4.1M revenue protected" },
    { title: "Regulatory Change", trigger: "New compliance requirement announced", without: "Weeks of ad-hoc assessment before coordinated action. Exposure window extends.", with: "Regulatory Readiness Protocol coordinates legal, operations, and communications simultaneously for compliant response.", cost: "$6.2M risk reduced" },
    { title: "Leadership Transition", trigger: "C-suite departure announced unexpectedly", without: "Days of uncertainty before stakeholder communications and succession protocols activate.", with: "Leadership transition Readiness Protocol coordinates board, investors, employees, and customers with single coordinated message.", cost: "$9.8M stakeholder confidence preserved" },
  ],
  telecommunications: [
    { title: "Network Outage", trigger: "Major metropolitan outage affects 2M customers", without: "4+ hours to coordinate network ops, customer service, regulatory affairs, and communications.", with: "Outage response Readiness Protocol coordinates all stakeholders simultaneously. Status page, regulator notification, and media brief in 12 minutes.", cost: "$7.4M SLA exposure reduced" },
    { title: "Regulatory Investigation", trigger: "FCC opens data privacy investigation", without: "2 weeks to assemble legal and compliance response. Regulatory relationship deteriorates.", with: "Regulatory response Readiness Protocol stages legal defense, compliance documentation, and executive engagement in 12 minutes.", cost: "$18M exposure reduced" },
    { title: "Security Breach", trigger: "Customer data exposure confirmed", without: "8+ hours before unified response. Notification deadlines missed in multiple jurisdictions.", with: "Breach Readiness Protocol coordinates simultaneous legal, security, notification, and executive response across all jurisdictions.", cost: "$23M regulatory exposure reduced" },
  ],
};

interface ROIInputs {
  companySize: string;
  industry: string;
  annualRevenue: number;
  strategicEventsPerYear: number;
  avgResponseTimeHours: number;
  executivesInvolved: number;
  avgExecutiveSalary: number;
}

const INDUSTRY_MULTIPLIERS: Record<string, { riskMultiplier: number; regulatoryFactor: number; label: string }> = {
  financial_services: { riskMultiplier: 1.5, regulatoryFactor: 1.4, label: 'Financial Services' },
  healthcare: { riskMultiplier: 1.4, regulatoryFactor: 1.5, label: 'Healthcare & Life Sciences' },
  technology: { riskMultiplier: 1.2, regulatoryFactor: 1.1, label: 'Technology' },
  manufacturing: { riskMultiplier: 1.1, regulatoryFactor: 1.2, label: 'Manufacturing' },
  retail: { riskMultiplier: 1.0, regulatoryFactor: 1.0, label: 'Retail & Consumer' },
  energy: { riskMultiplier: 1.3, regulatoryFactor: 1.4, label: 'Energy & Utilities' },
  telecommunications: { riskMultiplier: 1.2, regulatoryFactor: 1.3, label: 'Telecommunications' },
  other: { riskMultiplier: 1.0, regulatoryFactor: 1.0, label: 'Other' },
};

const COMPANY_SIZES: Record<string, { employees: number; label: string }> = {
  mid_market: { employees: 2500, label: 'Mid-Market (1K-5K employees)' },
  enterprise: { employees: 15000, label: 'Enterprise (5K-25K employees)' },
  large_enterprise: { employees: 50000, label: 'Large Enterprise (25K-100K employees)' },
  fortune_500: { employees: 100000, label: 'Fortune 500 (100K+ employees)' },
};

// ── Personalized Execution ROI Calculator ────────────────────────────────────
const RC_NAVY = "#0A0F2E";
const RC_GOLD = "#C9A84C";
const RC_TEAL = "#2B8A6E";
const RC_MID_NAVY = "#0D1640";
const RC_MUTED = "rgba(240,237,228,0.55)";
const RC_GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const RC_DM: React.CSSProperties = { fontFamily: "'DM Sans', system-ui, sans-serif" };
const RC_CONTAINER: React.CSSProperties = { maxWidth: 1160, margin: "0 auto", padding: "0 32px" };
const RC_REV_BRACKETS = [
  { label: '$1B – $5B', execRate: 650, revenueRiskPct: 0.003 },
  { label: '$5B – $25B', execRate: 900, revenueRiskPct: 0.0035 },
  { label: '$25B – $100B', execRate: 1200, revenueRiskPct: 0.004 },
  { label: '$100B+', execRate: 1800, revenueRiskPct: 0.005 },
];
const RC_INDUSTRIES = ['Financial Services', 'Healthcare / Pharma', 'Technology', 'Manufacturing', 'Retail / Consumer', 'Energy & Utilities', 'Industrials', 'Aerospace & Defense'];
const RC_EXEC_COUNTS = [{ label: '50–200 executives', val: 125 }, { label: '200–500 executives', val: 350 }, { label: '500–1,000 executives', val: 750 }, { label: '1,000+ executives', val: 1200 }];
const RC_SCENARIO_COUNTS = [{ label: '2–5 / year', val: 3.5 }, { label: '5–12 / year', val: 8.5 }, { label: '12–25 / year', val: 18 }, { label: '25+ / year', val: 32 }];
function rcFmt(n: number) { if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`; if (n >= 1e6) return `$${Math.round(n / 1e6)}M`; return `$${Math.round(n / 1e3)}K`; }

function ExecutionROISection() {
  const ref = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);
  const [revIdx, setRevIdx] = useState(1);
  const [industry, setIndustry] = useState(RC_INDUSTRIES[0]);
  const [execIdx, setExecIdx] = useState(1);
  const [scenIdx, setScenIdx] = useState(1);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  const rb = RC_REV_BRACKETS[revIdx];
  const execCount = RC_EXEC_COUNTS[execIdx].val;
  const scenYear = RC_SCENARIO_COUNTS[scenIdx].val;
  const execsPerCrisis = Math.min(12, Math.round(execCount * 0.025));
  const hoursSaved = execsPerCrisis * 18 - execsPerCrisis * 0.25;
  const execTimeSavedPerScen = hoursSaved * rb.execRate;
  const revAtRisk = (revIdx === 0 ? 2e9 : revIdx === 1 ? 12e9 : revIdx === 2 ? 50e9 : 200e9) * rb.revenueRiskPct;
  const revProtected = revAtRisk * 0.68;
  const valPerScen = execTimeSavedPerScen + revProtected;
  const annualVal = valPerScen * scenYear;

  const sel = (active: boolean): React.CSSProperties => ({
    fontSize: 12, fontWeight: active ? 700 : 500, padding: "8px 16px", cursor: "pointer",
    background: active ? RC_GOLD : "rgba(255,255,255,0.06)",
    color: active ? RC_NAVY : RC_MUTED,
    border: `1px solid ${active ? RC_GOLD : "rgba(255,255,255,0.12)"}`,
    transition: "all 0.18s ease",
  });

  return (
    <section ref={ref} style={{ background: RC_MID_NAVY, padding: "88px 0", borderTop: `1px solid rgba(201,168,76,0.15)` }}>
      <div style={RC_CONTAINER}>
        <div style={{ textAlign: "center", marginBottom: 52, opacity: animated ? 1 : 0, transition: "opacity 0.7s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 24, height: 1, background: RC_GOLD }} />
            <span style={{ ...RC_DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: RC_GOLD }}>Quick Execution ROI Estimator</span>
            <div style={{ width: 24, height: 1, background: RC_GOLD }} />
          </div>
          <h2 style={{ ...RC_GEO, fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
            What Is Slow Execution<br /><em style={{ color: RC_GOLD }}>Costing Your Organization?</em>
          </h2>
          <p style={{ ...RC_DM, fontSize: 15, color: RC_MUTED, maxWidth: 500, margin: "0 auto" }}>
            Configure your profile and see your personalized annual value from 12-minute execution.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, opacity: animated ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }}>
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 28 }}>
            <div>
              <div style={{ ...RC_DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: RC_GOLD, marginBottom: 10 }}>Annual Revenue</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {RC_REV_BRACKETS.map((r, i) => <button key={r.label} onClick={() => setRevIdx(i)} style={sel(revIdx === i)}>{r.label}</button>)}
              </div>
            </div>
            <div>
              <div style={{ ...RC_DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: RC_GOLD, marginBottom: 10 }}>Industry</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {RC_INDUSTRIES.map(ind => <button key={ind} onClick={() => setIndustry(ind)} style={sel(industry === ind)}>{ind}</button>)}
              </div>
            </div>
            <div>
              <div style={{ ...RC_DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: RC_GOLD, marginBottom: 10 }}>Executive Population</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {RC_EXEC_COUNTS.map((e, i) => <button key={e.label} onClick={() => setExecIdx(i)} style={sel(execIdx === i)}>{e.label}</button>)}
              </div>
            </div>
            <div>
              <div style={{ ...RC_DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: RC_GOLD, marginBottom: 10 }}>Critical Scenarios / Year</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {RC_SCENARIO_COUNTS.map((s, i) => <button key={s.label} onClick={() => setScenIdx(i)} style={sel(scenIdx === i)}>{s.label}</button>)}
              </div>
            </div>
          </div>
          {/* Output */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            <div style={{ padding: "24px 28px", background: "rgba(201,168,76,0.08)", border: `1px solid ${RC_GOLD}`, borderTop: `3px solid ${RC_GOLD}` }}>
              <div style={{ ...RC_DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: RC_GOLD, marginBottom: 8 }}>Annual Value — {industry}</div>
              <div style={{ ...RC_GEO, fontSize: "clamp(40px,6vw,64px)", fontWeight: 700, color: "#fff", lineHeight: 1, marginBottom: 4 }}>{rcFmt(annualVal)}</div>
              <div style={{ ...RC_DM, fontSize: 12, color: RC_MUTED }}>estimated annual value from 12-minute execution across {Math.round(scenYear)} scenarios</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Executive Time Saved", value: rcFmt(execTimeSavedPerScen * scenYear), sub: `${Math.round(hoursSaved * scenYear).toLocaleString()} exec-hours/yr`, color: RC_TEAL },
                { label: "Revenue Protected", value: rcFmt(revProtected * scenYear), sub: "68% faster containment", color: RC_TEAL },
                { label: "Execution Head Start", value: "3,600×", sub: "vs. reactive organizations", color: RC_GOLD },
                { label: "Value Per Scenario", value: rcFmt(valPerScen), sub: "per critical event response", color: RC_GOLD },
              ].map(({ label, value, sub, color }) => (
                <div key={label} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ ...RC_DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color, marginBottom: 6 }}>{label}</div>
                  <div style={{ ...RC_GEO, fontSize: 28, fontWeight: 700, color: "#fff" }}>{value}</div>
                  <div style={{ ...RC_DM, fontSize: 11, color: RC_MUTED, marginTop: 4 }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", paddingTop: 8 }}>
              <a href="/request-access" style={{ display: "inline-block", ...RC_DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "11px 28px", background: RC_GOLD, color: RC_NAVY, textDecoration: "none" }}>
                Build My Full Business Case →
              </a>
            </div>
          </div>
        </div>
        {/* $250M Decision Tax strip */}
        <div style={{ marginTop: 48, padding: "24px 32px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: `3px solid ${RC_GOLD}`, display: "flex", alignItems: "flex-start", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...RC_DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: RC_GOLD, marginBottom: 6 }}>McKinsey Research — Decision Tax Benchmark</div>
            <div style={{ ...RC_DM, fontSize: 15, color: "#fff", fontWeight: 600, lineHeight: 1.5, marginBottom: 6 }}>
              58% of executive decision time is used ineffectively — costing the average Fortune 500 an estimated <span style={{ color: RC_GOLD }}>$250M annually</span> before a trigger ever fires.
            </div>
            <div style={{ ...RC_DM, fontSize: 12, color: RC_MUTED, lineHeight: 1.6 }}>
              Readiness OS bypasses the high-pressure decision moment entirely. The 12-minute window is a <strong style={{ color: "#fff" }}>cognitive preservation strategy</strong>: pre-staged context eliminates the mobilization bottleneck so the right decision is made by the right person with the right information — in the first twelve minutes.
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <div style={{ ...RC_GEO, fontSize: 36, fontWeight: 700, color: RC_GOLD, lineHeight: 1 }}>$250M</div>
            <div style={{ ...RC_DM, fontSize: 10, color: RC_MUTED, marginTop: 4 }}>annual decision tax</div>
            <div style={{ ...RC_DM, fontSize: 11, color: RC_MUTED, marginTop: 2, letterSpacing: "0.05em" }}>Fortune 500 avg · McKinsey</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ROICalculator() {
  const [, setLocation] = useLocation();
  const [platformCost, setPlatformCost] = useState(120000);
  
  const [inputs, setInputs] = useState<ROIInputs>({
    companySize: 'enterprise',
    industry: 'financial_services',
    annualRevenue: 5000000000, // $5B
    strategicEventsPerYear: 24,
    avgResponseTimeHours: 720,
    executivesInvolved: 8,
    avgExecutiveSalary: 400000,
  });

  const calculations = useMemo(() => {
    const industryData = INDUSTRY_MULTIPLIERS[inputs.industry];
    
    // Current state calculations
    const hourlyExecutiveCost = inputs.avgExecutiveSalary / 2080;
    const currentCoordinationHoursPerEvent = inputs.avgResponseTimeHours;
    const currentTotalExecutiveHoursPerYear = currentCoordinationHoursPerEvent * inputs.executivesInvolved * inputs.strategicEventsPerYear;
    const currentCoordinationCostPerYear = currentTotalExecutiveHoursPerYear * hourlyExecutiveCost;
    
    // Revenue at risk from slow response
    const revenueAtRiskPercentage = 0.005 * industryData.riskMultiplier;
    const revenueAtRiskPerEvent = inputs.annualRevenue * revenueAtRiskPercentage / inputs.strategicEventsPerYear;
    
    // Regulatory/compliance risk cost
    const complianceRiskCost = inputs.annualRevenue * 0.001 * industryData.regulatoryFactor;
    
    // With Readiness OS
    const mResponseTimeHours = 0.2 + 1.5; 
    const mTotalExecutiveHoursPerYear = mResponseTimeHours * inputs.executivesInvolved * inputs.strategicEventsPerYear;
    
    // Savings calculations
    const coordinationCostSavings = currentCoordinationCostPerYear - (mTotalExecutiveHoursPerYear * hourlyExecutiveCost);
    const revenueProtected = revenueAtRiskPerEvent * inputs.strategicEventsPerYear * 0.7;
    const complianceRiskReduction = complianceRiskCost * 0.6;
    
    const totalAnnualValue = coordinationCostSavings + revenueProtected + complianceRiskReduction;
    const speedImprovement = Math.round(inputs.avgResponseTimeHours / mResponseTimeHours);

    // Enhanced metrics
    const netAnnualValue = totalAnnualValue - platformCost;
    const roiPct = Math.round((netAnnualValue / platformCost) * 100);
    const threeYearValue = totalAnnualValue * 3 - platformCost * 3;
    const valuePerEvent = totalAnnualValue / inputs.strategicEventsPerYear;
    // Break-even: events needed so cumulative value covers platform cost
    const breakEvenEvents = Math.ceil(platformCost / valuePerEvent);
    // Break-even in days (assuming events spread evenly)
    const daysPerEvent = 365 / inputs.strategicEventsPerYear;
    const breakEvenDays = Math.round(breakEvenEvents * daysPerEvent);
    // Consulting retainer (McKinsey retainer + per-incident fees)
    const consultingAnnual = 350000 + inputs.strategicEventsPerYear * 60000;
    
    return {
      totalAnnualValue,
      speedImprovement,
      coordinationCostSavings,
      revenueProtected,
      complianceRiskReduction,
      netAnnualValue,
      roiPct,
      threeYearValue,
      breakEvenDays,
      valuePerEvent,
      consultingAnnual,
    };
  }, [inputs, platformCost]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section style={{ background: "#0A0F2E", padding: "64px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Value Engineering</span>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
              The Competitive Window <em style={{ fontStyle: "italic", color: "#C9A84C" }}>You're Leaving Open</em>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Every hour between signal detection and execution is a window your competitor can use. Quantify exactly what closing that gap — from 30 days to 12 minutes — means for your enterprise.
            </p>
          </div>
        </section>

        <section className="py-16 px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Calculator Inputs */}
              <div className="lg:col-span-7 space-y-8">
                <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", padding: "32px", background: "#fff" }}>
                  <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider">Organizational Profile</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-gray-800">Company Size</Label>
                      <Select 
                        value={inputs.companySize} 
                        onValueChange={(v) => setInputs({...inputs, companySize: v})}
                      >
                        <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(COMPANY_SIZES).map(([key, data]) => (
                            <SelectItem key={key} value={key}>{data.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-800">Industry</Label>
                      <Select 
                        value={inputs.industry} 
                        onValueChange={(v) => setInputs({...inputs, industry: v})}
                      >
                        <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(INDUSTRY_MULTIPLIERS).map(([key, data]) => (
                            <SelectItem key={key} value={key}>{data.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-slate-700 font-semibold uppercase tracking-tighter text-xs">Annual Revenue (USD)</Label>
                        <span className="font-mono text-slate-900">{formatCurrency(inputs.annualRevenue)}</span>
                      </div>
                      <Slider
                        value={[Math.log10(inputs.annualRevenue)]}
                        onValueChange={([v]) => setInputs({...inputs, annualRevenue: Math.pow(10, v)})}
                        min={8} // $100M
                        max={11} // $100B
                        step={0.1}
                        className="py-4"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #2B8A6E", padding: "32px", background: "#fff" }}>
                  <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider">Execution Variables</h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-slate-700 font-semibold uppercase tracking-tighter text-xs">Events Per Year</Label>
                        <span className="font-mono text-slate-900">{inputs.strategicEventsPerYear}</span>
                      </div>
                      <Slider
                        value={[inputs.strategicEventsPerYear]}
                        onValueChange={([v]) => setInputs({...inputs, strategicEventsPerYear: v})}
                        min={4}
                        max={100}
                        step={1}
                        className="py-4"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-slate-700 font-semibold uppercase tracking-tighter text-xs">Current Response Time (Hours)</Label>
                        <span className="font-mono text-slate-900">{inputs.avgResponseTimeHours}h</span>
                      </div>
                      <Slider
                        value={[inputs.avgResponseTimeHours]}
                        onValueChange={([v]) => setInputs({...inputs, avgResponseTimeHours: v})}
                        min={24}
                        max={408} // 17 days
                        step={1}
                        className="py-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Sidebar */}
              <div className="lg:col-span-5">
                <div style={{ background: "#0A0F2E", padding: "32px", position: "sticky", top: "24px" }} className="text-white">

                  {/* Primary output */}
                  <div className="text-center mb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 24 }}>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Annual Value</p>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>
                      {formatCurrency(calculations.totalAnnualValue)}
                    </div>
                    <p className="text-teal-400 text-xs font-bold mt-2 uppercase tracking-widest">
                      30 days → 12 min · {calculations.speedImprovement}× compression
                    </p>
                  </div>

                  {/* Value breakdown */}
                  <div className="space-y-2 mb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 20 }}>
                    {[
                      { l: "Coordination Efficiency", v: formatCurrency(calculations.coordinationCostSavings) },
                      { l: "Revenue Risk Protected", v: formatCurrency(calculations.revenueProtected) },
                      { l: "Compliance Risk Reduced", v: formatCurrency(calculations.complianceRiskReduction) },
                    ].map(r => (
                      <div key={r.l} className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60 text-sm">{r.l}</span>
                        <span className="font-mono text-white font-semibold">{r.v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Platform cost input */}
                  <div className="mb-5" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Platform Investment</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{formatCurrency(platformCost)}/yr</span>
                    </div>
                    <input
                      type="range"
                      min={60000} max={240000} step={5000}
                      value={platformCost}
                      onChange={e => setPlatformCost(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#C9A84C", cursor: "pointer" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                      <span>$60K</span><span>$240K</span>
                    </div>
                  </div>

                  {/* Enhanced metrics */}
                  <div className="space-y-2 mb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 20 }}>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60 text-sm">Net Annual Value</span>
                      <span className="font-mono font-bold" style={{ color: "#2B8A6E" }}>{formatCurrency(calculations.netAnnualValue)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60 text-sm">First-Year ROI</span>
                      <span className="font-mono font-bold" style={{ color: "#2B8A6E" }}>{calculations.roiPct.toLocaleString()}%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60 text-sm">Break-Even</span>
                      <span className="font-mono text-white font-semibold">
                        {calculations.breakEvenDays < 30
                          ? `${calculations.breakEvenDays} days`
                          : `${Math.round(calculations.breakEvenDays / 30)} months`}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-white/60 text-sm">3-Year Net Value</span>
                      <span className="font-mono font-bold" style={{ color: "#C9A84C" }}>{formatCurrency(calculations.threeYearValue)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-white/60 text-sm">Response Time</span>
                      <span className="font-mono font-bold" style={{ color: "#2B8A6E" }}>30 days → 12 min</span>
                    </div>
                  </div>

                  {/* Consulting comparison */}
                  <div className="mb-5" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#F87171", marginBottom: 8 }}>vs. Consulting Alternative</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Retainer + per-event fees</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#F87171", fontFamily: "monospace" }}>{formatCurrency(calculations.consultingAnnual)}/yr</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Readiness OS</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2B8A6E", fontFamily: "monospace" }}>{formatCurrency(platformCost)}/yr</span>
                    </div>
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(239,68,68,0.2)", fontSize: 11, color: "#F87171", fontWeight: 600 }}>
                      Consulting costs {formatCurrency(calculations.consultingAnnual - platformCost)} more — and doesn't give you pre-staged execution.
                    </div>
                  </div>

                  <Button className="w-full bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] py-5" onClick={() => setLocation('/request-access')}>
                    Apply for Founding Partner Access →
                  </Button>
                  <p className="text-center text-white/30 text-[10px] mt-3 leading-relaxed uppercase tracking-tighter">
                    ROI based on industry productivity costs & revenue-at-risk benchmarks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Industry Scenario Comparison ─────────────────────────── */}
        <section style={{ background: "#F8F7F4", padding: "80px 48px" }}>
          <div className="max-w-6xl mx-auto">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 1, background: "#C9A84C" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>{INDUSTRY_MULTIPLIERS[inputs.industry]?.label || "Your Industry"} · Real-World Scenarios</span>
                <div style={{ width: 28, height: 1, background: "#C9A84C" }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "clamp(28px,3.5vw,42px)", color: "#0A0F2E", marginBottom: 12 }}>
                What 30 Days of Hesitation Costs Your Industry
              </h2>
              <p style={{ color: "#6B7280", fontSize: 16, maxWidth: 580, margin: "0 auto", fontWeight: 500 }}>
                Three scenarios your peers have faced — and the difference execution speed makes.
              </p>
            </div>

            <div style={{ display: "grid", gap: 24 }}>
              {(INDUSTRY_SCENARIOS[inputs.industry] || INDUSTRY_SCENARIOS.other).map((s, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E8E4DC", borderLeft: "3px solid #C9A84C", overflow: "hidden" }}>
                  <div style={{ padding: "20px 28px", borderBottom: "1px solid #F0EDE8", display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 32, height: 32, background: "rgba(201,168,76,0.1)", borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <AlertTriangle style={{ width: 16, height: 16, color: "#C9A84C" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 4 }}>Trigger Event</div>
                      <div style={{ fontWeight: 700, color: "#0A0F2E", fontSize: 15 }}>{s.title}</div>
                      <div style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>{s.trigger}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                    <div style={{ padding: "24px 28px", borderRight: "1px solid #F0EDE8", background: "#FFF8F8" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <Clock style={{ width: 13, height: 13, color: "#EF4444" }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#EF4444" }}>Without Readiness OS</span>
                      </div>
                      <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.6 }}>{s.without}</p>
                    </div>
                    <div style={{ padding: "24px 28px", background: "#F0FAF6" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <CheckCircle2 style={{ width: 13, height: 13, color: "#2B8A6E" }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#2B8A6E" }}>With Readiness OS · 12 Minutes</span>
                      </div>
                      <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{s.with}</p>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(43,138,110,0.1)", padding: "4px 12px", borderRadius: 0 }}>
                        <Shield style={{ width: 11, height: 11, color: "#2B8A6E" }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#2B8A6E" }}>{s.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ExecutionROISection />

        {/* ── Research Validation Strip ─────────────────────────────── */}
        <section style={{ background: "#0A0F2E", padding: "48px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.6)" }}>Research Validation</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#fff", marginTop: 8 }}>
                15 independent firms reached the same conclusion
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.05)" }}>
              {[
                { firm: "McKinsey & Company", finding: "Organizations lacking execution infrastructure capture only 30% of expected strategy value" },
                { firm: "IBM Institute", finding: "60% of AI transformation failures traced to execution infrastructure gaps, not technology" },
                { firm: "World Economic Forum", finding: "Coordination lag — not capital — is the #1 barrier to strategic agility for large enterprises" },
              ].map(r => (
                <div key={r.firm} style={{ padding: "28px 24px", background: "#0A0F2E" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 10 }}>{r.firm}</div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, fontStyle: "italic" }}>"{r.finding}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <section style={{ background: "#fff", padding: "72px 48px", borderTop: "1px solid #E8E4DC" }}>
          <div className="max-w-4xl mx-auto" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: "#C9A84C" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Take the Next Step</span>
              <div style={{ width: 28, height: 1, background: "#C9A84C" }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "clamp(28px,3.5vw,44px)", color: "#0A0F2E", marginBottom: 16 }}>
              Every hour of delay is a quantifiable risk
            </h2>
            <p style={{ color: "#6B7280", fontSize: 16, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.65 }}>
              Your customized ROI estimate is a starting point. Our team builds a fully evidenced business case specific to your organization's risk profile and strategic calendar.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}>
              <Button style={{ background: "#0A0F2E", color: "#fff", fontWeight: 700, padding: "16px 36px", fontSize: 15, borderRadius: 0 }} onClick={() => setLocation('/contact')}>
                Request Full Business Case
              </Button>
              <Link href="/12-minute-experience">
                <Button variant="outline" style={{ borderColor: "#E8E4DC", color: "#0A0F2E", fontWeight: 700, padding: "16px 36px", fontSize: 15, borderRadius: 0 }}>
                  Experience the 12-Minute Test Drive
                </Button>
              </Link>
            </div>
            <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 40 }}>
              {[
                { value: "3,600×", label: "Execution Head Start" },
                { value: "170", label: "Pre-Built Readiness Protocols" },
                { value: "12 min", label: "Guaranteed Response Time" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#C9A84C" }}>{s.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.15em", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
