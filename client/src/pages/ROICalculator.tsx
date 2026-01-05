import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowRight,
  Building2,
  Zap,
  Target,
  Shield,
  Download,
  Send
} from 'lucide-react';
import { useLocation } from 'wouter';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';

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
    const companyData = COMPANY_SIZES[inputs.companySize];
    
    // Current state calculations
    const hourlyExecutiveCost = inputs.avgExecutiveSalary / 2080; // Annual salary / working hours
    const currentCoordinationHoursPerEvent = inputs.avgResponseTimeHours;
    const currentTotalExecutiveHoursPerYear = currentCoordinationHoursPerEvent * inputs.executivesInvolved * inputs.strategicEventsPerYear;
    const currentCoordinationCostPerYear = currentTotalExecutiveHoursPerYear * hourlyExecutiveCost;
    
    // Revenue at risk from slow response (percentage of annual revenue)
    const revenueAtRiskPercentage = 0.005 * industryData.riskMultiplier; // 0.5% base, adjusted by industry
    const revenueAtRiskPerEvent = inputs.annualRevenue * revenueAtRiskPercentage / inputs.strategicEventsPerYear;
    
    // Regulatory/compliance risk cost
    const complianceRiskCost = inputs.annualRevenue * 0.001 * industryData.regulatoryFactor;
    
    // With M Platform (12-minute decision, 90-minute full execution)
    const mResponseTimeHours = 0.2 + 1.5; // 12 min decision + 90 min execution = ~1.7 hours
    const mTotalExecutiveHoursPerYear = mResponseTimeHours * inputs.executivesInvolved * inputs.strategicEventsPerYear;
    const mCoordinationCostPerYear = mTotalExecutiveHoursPerYear * hourlyExecutiveCost;
    
    // Savings calculations
    const coordinationCostSavings = currentCoordinationCostPerYear - mCoordinationCostPerYear;
    const timeSavedHoursPerYear = currentTotalExecutiveHoursPerYear - mTotalExecutiveHoursPerYear;
    const revenueProtected = revenueAtRiskPerEvent * inputs.strategicEventsPerYear * 0.7; // 70% of at-risk revenue protected
    const complianceRiskReduction = complianceRiskCost * 0.6; // 60% reduction in compliance risk
    
    // Total annual value
    const totalAnnualValue = coordinationCostSavings + revenueProtected + complianceRiskReduction;
    
    // Platform investment assumption
    const assumedAnnualInvestment = 500000; // $500K annual platform cost
    const roi = ((totalAnnualValue - assumedAnnualInvestment) / assumedAnnualInvestment) * 100;
    const paybackMonths = (assumedAnnualInvestment / totalAnnualValue) * 12;
    
    // Time metrics
    const speedImprovement = Math.round(inputs.avgResponseTimeHours / mResponseTimeHours);
    
    return {
      // Current state
      currentCoordinationCostPerYear,
      currentTotalExecutiveHoursPerYear,
      revenueAtRiskPerEvent,
      
      // With M
      mCoordinationCostPerYear,
      mTotalExecutiveHoursPerYear,
      
      // Savings
      coordinationCostSavings,
      timeSavedHoursPerYear,
      revenueProtected,
      complianceRiskReduction,
      totalAnnualValue,
      
      // ROI
      roi,
      paybackMonths,
      speedImprovement,
      
      // Raw
      hourlyExecutiveCost,
    };
  }, [inputs]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <StandardNav />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
              <Calculator className="h-4 w-4 mr-2" />
              ROI Calculator
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">
              Calculate Your Strategic Velocity ROI
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
              See how M Platform transforms coordination time from 72 hours to 12 minutes—and what that means for your bottom line.
            </p>
            
            {/* BAI Report Stat Highlight */}
            <Card className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-emerald-500/30 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-8 flex-wrap">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400">10.3%</div>
                    <p className="text-sm text-slate-400">Revenue/Employee Growth</p>
                    <p className="text-xs text-slate-500">Organizations that improved agility</p>
                  </div>
                  <div className="text-2xl text-slate-500">vs</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">3.5%</div>
                    <p className="text-sm text-slate-400">Revenue/Employee Growth</p>
                    <p className="text-xs text-slate-500">Organizations that didn't improve</p>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-400 mt-4">
                  Source: 2025 Business Agility Report (244 organizations)
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    Your Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Company Size</Label>
                    <Select 
                      value={inputs.companySize} 
                      onValueChange={(v) => setInputs({...inputs, companySize: v})}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white" data-testid="select-company-size">
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
                    <Label className="text-slate-300">Industry</Label>
                    <Select 
                      value={inputs.industry} 
                      onValueChange={(v) => setInputs({...inputs, industry: v})}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white" data-testid="select-industry">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(INDUSTRY_MULTIPLIERS).map(([key, data]) => (
                          <SelectItem key={key} value={key}>{data.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Annual Revenue</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[Math.log10(inputs.annualRevenue)]}
                        onValueChange={([v]) => setInputs({...inputs, annualRevenue: Math.pow(10, v)})}
                        min={8} // $100M
                        max={11} // $100B
                        step={0.1}
                        className="flex-1"
                        data-testid="slider-revenue"
                      />
                      <span className="text-white font-mono w-20 text-right">
                        {formatCurrency(inputs.annualRevenue)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    Current State
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Strategic Events per Year</Label>
                    <div className="text-xs text-slate-500 mb-2">
                      Crises, competitive responses, market entries, M&A, regulatory changes
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[inputs.strategicEventsPerYear]}
                        onValueChange={([v]) => setInputs({...inputs, strategicEventsPerYear: v})}
                        min={4}
                        max={100}
                        step={1}
                        className="flex-1"
                        data-testid="slider-events"
                      />
                      <span className="text-white font-mono w-16 text-right">
                        {inputs.strategicEventsPerYear}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Average Response Time (Hours)</Label>
                    <div className="text-xs text-slate-500 mb-2">
                      Time from event detection to coordinated response execution
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[inputs.avgResponseTimeHours]}
                        onValueChange={([v]) => setInputs({...inputs, avgResponseTimeHours: v})}
                        min={24}
                        max={408} // 17 days
                        step={1}
                        className="flex-1"
                        data-testid="slider-response-time"
                      />
                      <span className="text-white font-mono w-20 text-right">
                        {inputs.avgResponseTimeHours}h
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Executives Involved per Event</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[inputs.executivesInvolved]}
                        onValueChange={([v]) => setInputs({...inputs, executivesInvolved: v})}
                        min={3}
                        max={20}
                        step={1}
                        className="flex-1"
                        data-testid="slider-executives"
                      />
                      <span className="text-white font-mono w-16 text-right">
                        {inputs.executivesInvolved}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Average Executive Compensation</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[inputs.avgExecutiveSalary]}
                        onValueChange={([v]) => setInputs({...inputs, avgExecutiveSalary: v})}
                        min={200000}
                        max={1000000}
                        step={25000}
                        className="flex-1"
                        data-testid="slider-salary"
                      />
                      <span className="text-white font-mono w-20 text-right">
                        {formatCurrency(inputs.avgExecutiveSalary)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* ROI Summary Card */}
              <Card className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 border-green-500/30">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-green-400 mb-2">
                      {calculations.roi.toFixed(0)}%
                    </div>
                    <div className="text-xl text-slate-300">Annual ROI</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(calculations.totalAnnualValue)}
                      </div>
                      <div className="text-sm text-slate-400">Total Annual Value</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {calculations.paybackMonths.toFixed(1)} mo
                      </div>
                      <div className="text-sm text-slate-400">Payback Period</div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={() => setLocation('/contact')}
                      data-testid="button-get-proposal"
                    >
                      Get Custom Proposal
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Speed Improvement */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-400" />
                      Speed Improvement
                    </h3>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-lg px-4">
                      {calculations.speedImprovement}X Faster
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-950/30 rounded-lg p-4 border border-red-500/20">
                      <div className="text-sm text-red-400 mb-1">Current Response</div>
                      <div className="text-2xl font-bold text-white">{inputs.avgResponseTimeHours} hours</div>
                    </div>
                    <div className="bg-green-950/30 rounded-lg p-4 border border-green-500/20">
                      <div className="text-sm text-green-400 mb-1">With M Platform</div>
                      <div className="text-2xl font-bold text-white">~2 hours</div>
                      <div className="text-xs text-slate-500">12 min decision + 90 min execution</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Value Breakdown */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Value Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-400" />
                      <div>
                        <div className="text-white">Executive Time Saved</div>
                        <div className="text-xs text-slate-500">
                          {formatNumber(Math.round(calculations.timeSavedHoursPerYear))} hours/year
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-400">
                      {formatCurrency(calculations.coordinationCostSavings)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <div>
                        <div className="text-white">Revenue Protected</div>
                        <div className="text-xs text-slate-500">
                          From faster competitive response
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-400">
                      {formatCurrency(calculations.revenueProtected)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-amber-400" />
                      <div>
                        <div className="text-white">Compliance Risk Reduction</div>
                        <div className="text-xs text-slate-500">
                          Faster regulatory response
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-400">
                      {formatCurrency(calculations.complianceRiskReduction)}
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-lg text-white font-semibold">Total Annual Value</div>
                      <div className="text-2xl font-bold text-green-400">
                        {formatCurrency(calculations.totalAnnualValue)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <div className="text-xs text-slate-500 text-center">
                * Calculations are estimates based on industry benchmarks and your inputs.
                Actual results may vary. Contact us for a detailed analysis.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
