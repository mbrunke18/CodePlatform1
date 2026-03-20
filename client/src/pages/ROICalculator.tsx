import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLocation, Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { AlertTriangle, Clock, TrendingUp, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const INDUSTRY_SCENARIOS: Record<string, Array<{ title: string; trigger: string; without: string; with: string; cost: string }>> = {
  financial_services: [
    { title: "Regulatory Inquiry Response", trigger: "SEC enforcement letter received 9 AM", without: "Weeks to organize legal, compliance, and communications teams — market speculation drives 4% stock decline", with: "Full response team assembled with pre-staged regulatory playbook in 12 minutes. Investor relations notified before markets open.", cost: "$2.1M–$8.4M prevented" },
    { title: "Competitor Product Launch", trigger: "Major rival announces competing product", without: "3 days to convene product, sales, and marketing. Customers field calls with no unified message.", with: "Competitive response playbook activates. Sales talking points, retention offers, and PR strategy deployed before EOD.", cost: "$4.2M retained" },
    { title: "Ransomware Incident", trigger: "Critical systems encrypted 3 AM", without: "20+ hours of ad-hoc crisis management. Board unaware until media reports. Regulatory filing missed.", with: "Crisis playbook activates. CISO, General Counsel, Board Chair, and regulators notified with coordinated comms in 12 minutes.", cost: "$18M exposure reduced" },
  ],
  healthcare: [
    { title: "Product Recall Event", trigger: "FDA adverse event report triggers recall threshold", without: "4 days to coordinate legal, supply chain, patient safety, and communications — regulatory penalties compound", with: "Recall playbook stages physician notifications, supply chain holds, and FDA response in parallel — 12 minutes to full coordination", cost: "$6.8M–$22M prevented" },
    { title: "Clinical Trial Result", trigger: "Phase 3 trial data released — mixed results", without: "Weeks of internal debate before investor and partner communications. Stock drops 18% on uncertainty.", with: "IR, medical affairs, and legal aligned in 12 minutes with pre-cleared messaging templates and board briefing staged.", cost: "$31M market cap protected" },
    { title: "Supply Chain Disruption", trigger: "Critical API supplier halts production", without: "3-week delay in identifying alternates. Manufacturing paused. Patient supply at risk.", with: "Supplier backup playbook activates. 4 qualified alternates contacted with pre-approved qualification protocols within hours.", cost: "$9.2M revenue protected" },
  ],
  technology: [
    { title: "Platform Outage", trigger: "Tier-1 production outage 2 AM", without: "2 hours to assemble incident response. Customer trust erodes. SLA penalties accumulate.", with: "Incident response playbook fires. Engineering leads, customer success, and communications coordinated within minutes.", cost: "$1.8M SLA penalties avoided" },
    { title: "Competitive Feature Launch", trigger: "Competitor ships major AI feature", without: "5 days to align product, engineering, sales, and marketing on counter-strategy.", with: "Competitive response playbook activates. Roadmap acceleration options, customer retention campaign, and partner briefing in 12 minutes.", cost: "$7.1M churn prevented" },
    { title: "Data Breach Discovery", trigger: "Security team confirms unauthorized access", without: "8+ hours before legal and comms engaged. Notification SLA window missed in 3 states.", with: "Breach response playbook coordinates legal, security, comms, and regulators simultaneously — notification requirements met.", cost: "$14M regulatory exposure reduced" },
  ],
  manufacturing: [
    { title: "Supplier Failure", trigger: "Tier-1 supplier declares force majeure", without: "1 week to identify and qualify alternates. Production line halts. Customer penalties trigger.", with: "Supply chain resilience playbook activates 6 pre-qualified backup suppliers simultaneously. Production continuity maintained.", cost: "$3.4M production loss prevented" },
    { title: "Product Quality Alert", trigger: "Field failure rate spike detected", without: "4 days to convene quality, legal, supply chain, and sales. Recall decision delayed.", with: "Quality response playbook coordinates containment, root cause analysis, and customer communications in 12 minutes.", cost: "$8.7M liability reduced" },
    { title: "Labor Action Signal", trigger: "Union organizing activity detected at 2 plants", without: "2 weeks of internal debate. External consultants delayed. Employee relations deteriorate.", with: "Labor relations playbook stages leadership communications, HR protocols, and legal briefing before situation escalates.", cost: "$5.1M operational risk reduced" },
  ],
  energy: [
    { title: "Grid Failure Event", trigger: "Regional grid instability alert received", without: "Hours to mobilize operations, regulatory affairs, and communications. Public criticism mounts.", with: "Grid response playbook coordinates operations, regulators, and public communications in 12 minutes. Restoration timeline published.", cost: "$11.2M regulatory exposure reduced" },
    { title: "ESG Activist Campaign", trigger: "Major ESG fund announces divestment campaign", without: "3 days to align investor relations, sustainability, and legal on response strategy.", with: "ESG response playbook activates. Board briefing, investor FAQs, and sustainability data package prepared in 12 minutes.", cost: "$890M market cap protected" },
    { title: "Regulatory Change", trigger: "FERC issues new compliance requirement", without: "Compliance assessment takes 6 weeks. Operations exposed during analysis gap.", with: "Regulatory response playbook stages compliance gap analysis, legal review, and operational adjustments simultaneously.", cost: "$4.6M compliance risk reduced" },
  ],
  retail: [
    { title: "Food Safety Alert", trigger: "Supplier contamination warning received", without: "3 days to pull product, notify customers, and coordinate with FDA. Brand damage compounds.", with: "Food safety playbook coordinates product withdrawal, customer notifications, and FDA response in 12 minutes.", cost: "$5.8M brand protection" },
    { title: "Inventory Crisis", trigger: "Key holiday product out-of-stock at 40% of locations", without: "Week-long internal coordination before customer-facing solutions deployed. Competitor gains share.", with: "Supply playbook redirects inventory, updates digital channels, and activates customer messaging simultaneously.", cost: "$12.3M revenue saved" },
    { title: "Reputational Crisis", trigger: "Viral social media incident surfaces", without: "6–18 hours to approve communications. Social narrative set by competitors and media.", with: "Crisis communications playbook gives comms team pre-approved response frameworks and executive approval in 12 minutes.", cost: "$3.2M brand equity protected" },
  ],
  other: [
    { title: "Competitive Disruption", trigger: "Market disruptor announces aggressive expansion", without: "3+ days to align leadership and deploy counter-strategy across functions.", with: "Competitive response playbook stages cross-functional coordination, messaging, and customer retention in 12 minutes.", cost: "$4.1M revenue protected" },
    { title: "Regulatory Change", trigger: "New compliance requirement announced", without: "Weeks of ad-hoc assessment before coordinated action. Exposure window extends.", with: "Regulatory playbook coordinates legal, operations, and communications simultaneously for compliant response.", cost: "$6.2M risk reduced" },
    { title: "Leadership Transition", trigger: "C-suite departure announced unexpectedly", without: "Days of uncertainty before stakeholder communications and succession protocols activate.", with: "Leadership transition playbook coordinates board, investors, employees, and customers with single coordinated message.", cost: "$9.8M stakeholder confidence preserved" },
  ],
  telecommunications: [
    { title: "Network Outage", trigger: "Major metropolitan outage affects 2M customers", without: "4+ hours to coordinate network ops, customer service, regulatory affairs, and communications.", with: "Outage response playbook coordinates all stakeholders simultaneously. Status page, regulator notification, and media brief in 12 minutes.", cost: "$7.4M SLA exposure reduced" },
    { title: "Regulatory Investigation", trigger: "FCC opens data privacy investigation", without: "2 weeks to assemble legal and compliance response. Regulatory relationship deteriorates.", with: "Regulatory response playbook stages legal defense, compliance documentation, and executive engagement in 12 minutes.", cost: "$18M exposure reduced" },
    { title: "Security Breach", trigger: "Customer data exposure confirmed", without: "8+ hours before unified response. Notification deadlines missed in multiple jurisdictions.", with: "Breach playbook coordinates simultaneous legal, security, notification, and executive response across all jurisdictions.", cost: "$23M regulatory exposure reduced" },
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

export default function ROICalculator() {
  const [, setLocation] = useLocation();
  
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
    
    // With Execution OS
    const mResponseTimeHours = 0.2 + 1.5; 
    const mTotalExecutiveHoursPerYear = mResponseTimeHours * inputs.executivesInvolved * inputs.strategicEventsPerYear;
    
    // Savings calculations
    const coordinationCostSavings = currentCoordinationCostPerYear - (mTotalExecutiveHoursPerYear * hourlyExecutiveCost);
    const revenueProtected = revenueAtRiskPerEvent * inputs.strategicEventsPerYear * 0.7;
    const complianceRiskReduction = complianceRiskCost * 0.6;
    
    const totalAnnualValue = coordinationCostSavings + revenueProtected + complianceRiskReduction;
    const speedImprovement = Math.round(inputs.avgResponseTimeHours / mResponseTimeHours);
    
    return {
      totalAnnualValue,
      speedImprovement,
      coordinationCostSavings,
      revenueProtected,
      complianceRiskReduction
    };
  }, [inputs]);

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
              Every hour between when AI detects a signal and when your organization executes is a window your competitor can use. Quantify exactly what closing that gap — from 30 days to 12 minutes — means for your enterprise.
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
                <div style={{ background: "#0A0F2E", padding: "40px", position: "sticky", top: "24px" }} className="text-white">
                  <div className="text-center mb-8">
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Annual Value</p>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>
                      {formatCurrency(calculations.totalAnnualValue)}
                    </div>
                    <p className="text-teal-400 text-xs font-bold mt-2 uppercase tracking-widest">
                      Through {calculations.speedImprovement}X Response Compression
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-white/60 text-sm">Coordination Efficiency</span>
                      <span className="font-mono text-white">{formatCurrency(calculations.coordinationCostSavings)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-white/60 text-sm">Revenue Risk Protected</span>
                      <span className="font-mono text-white">{formatCurrency(calculations.revenueProtected)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-white/60 text-sm">Compliance Risk Reduced</span>
                      <span className="font-mono text-white">{formatCurrency(calculations.complianceRiskReduction)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-white/60 text-sm">Response Time Reduction</span>
                      <span className="font-mono text-teal-400 font-bold">30 days → 12 min</span>
                    </div>
                  </div>

                  <Button className="w-full bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] py-6 text-lg" onClick={() => setLocation('/contact')}>
                    Request Full ROI Analysis
                  </Button>
                  <p className="text-center text-white/30 text-[10px] mt-4 leading-relaxed uppercase tracking-tighter">
                    ROI based on industry standard productivity costs and revenue-at-risk models.
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
                    <div style={{ width: 32, height: 32, background: "rgba(201,168,76,0.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
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
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#EF4444" }}>Without Execution OS</span>
                      </div>
                      <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.6 }}>{s.without}</p>
                    </div>
                    <div style={{ padding: "24px 28px", background: "#F0FAF6" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <CheckCircle2 style={{ width: 13, height: 13, color: "#2B8A6E" }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#2B8A6E" }}>With Execution OS · 12 Minutes</span>
                      </div>
                      <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{s.with}</p>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(43,138,110,0.1)", padding: "4px 12px", borderRadius: 2 }}>
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
              <Button style={{ background: "#0A0F2E", color: "#fff", fontWeight: 700, padding: "16px 36px", fontSize: 15, borderRadius: 2 }} onClick={() => setLocation('/contact')}>
                Request Full Business Case
              </Button>
              <Link href="/12-minute-experience">
                <Button variant="outline" style={{ borderColor: "#E8E4DC", color: "#0A0F2E", fontWeight: 700, padding: "16px 36px", fontSize: 15, borderRadius: 2 }}>
                  Experience the 12-Minute Test Drive
                </Button>
              </Link>
            </div>
            <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 40 }}>
              {[
                { value: "3,600×", label: "Execution Head Start" },
                { value: "170", label: "Pre-Built Playbooks" },
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
