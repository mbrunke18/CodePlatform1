import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';

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
    avgResponseTimeHours: 72,
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
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Value Engineering</span>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
              Quantify the <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Cost of Inaction</em>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Calculate the potential savings by compressing your organization's response time from 
              industry average (72 hours) to Execution OS standard (12 minutes).
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
                      <span className="font-mono text-teal-400 font-bold">72h → 12m</span>
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
      </div>
    </PageLayout>
  );
}
