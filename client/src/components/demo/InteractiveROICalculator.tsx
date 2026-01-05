import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, DollarSign, Users, Clock, Target } from 'lucide-react';

interface ROICalculatorProps {
  persona?: 'ceo' | 'coo' | 'chro' | 'cto' | 'cio' | 'cdo' | 'ciso' | 'cfo' | 'general';
  industry?: 'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general';
}

export default function InteractiveROICalculator({ persona = 'general', industry = 'general' }: ROICalculatorProps) {
  const [companySize, setCompanySize] = useState(5000);
  const [currentCrisisResponse, setCurrentCrisisResponse] = useState(72);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Industry-specific multipliers and metrics
  const industryMetrics = {
    healthcare: {
      name: 'Healthcare & Life Sciences',
      costPerHour: 12500,
      complianceRisk: 0.35,
      reputationImpact: 0.45
    },
    finance: {
      name: 'Financial Services',
      costPerHour: 25000,
      complianceRisk: 0.50,
      reputationImpact: 0.40
    },
    manufacturing: {
      name: 'Manufacturing',
      costPerHour: 8500,
      complianceRisk: 0.20,
      reputationImpact: 0.30
    },
    retail: {
      name: 'Retail & E-Commerce',
      costPerHour: 6000,
      complianceRisk: 0.15,
      reputationImpact: 0.35
    },
    general: {
      name: 'Enterprise',
      costPerHour: 10000,
      complianceRisk: 0.25,
      reputationImpact: 0.35
    }
  };

  const metrics = industryMetrics[industry];

  // Calculate improvements with M - 12 MINUTE average execution
  const mResponseMinutes = 12; // Our core value proposition: 12 minutes
  const mResponseHours = mResponseMinutes / 60; // Convert to hours for calculations
  const timeSaved = currentCrisisResponse - mResponseHours;
  const improvementPercentage = ((timeSaved / currentCrisisResponse) * 100);
  
  // Financial calculations
  const hoursSavedPerCrisis = timeSaved;
  const costSavingsPerCrisis = hoursSavedPerCrisis * metrics.costPerHour;
  const averageCrisesPerYear = Math.floor(companySize / 1000) + 2; // More crises for larger companies
  const annualTimeSavings = hoursSavedPerCrisis * averageCrisesPerYear;
  const annualCostSavings = costSavingsPerCrisis * averageCrisesPerYear;
  
  // Risk reduction
  const complianceRiskReduction = metrics.complianceRisk * 0.75; // 75% reduction
  const reputationProtection = metrics.reputationImpact * 0.80; // 80% improvement
  
  // Total ROI calculation
  const platformCost = 120000; // Annual platform cost
  const roi = ((annualCostSavings - platformCost) / platformCost) * 100;
  const paybackMonths = (platformCost / (annualCostSavings / 12));

  // Persona-specific messaging
  const personaMessages: Record<NonNullable<typeof persona>, {primary: string; secondary: string; focus: string}> = {
    ceo: {
      primary: 'Shareholder Value Impact',
      secondary: 'Strategic advantage through faster crisis response',
      focus: 'ROI & Competitive Position'
    },
    coo: {
      primary: 'Operational Efficiency Gains',
      secondary: 'Reduced downtime and improved process execution',
      focus: 'Cost Savings & Productivity'
    },
    chro: {
      primary: 'Workforce Stability',
      secondary: 'Protected jobs and improved employee confidence',
      focus: 'People Impact & Retention'
    },
    cto: {
      primary: 'Technical Resilience',
      secondary: 'Architecture stability and innovation velocity',
      focus: 'System Reliability & Innovation'
    },
    cio: {
      primary: 'Digital Continuity',
      secondary: 'IT compliance and operational reliability',
      focus: 'Compliance & Uptime'
    },
    cdo: {
      primary: 'Data Governance Value',
      secondary: 'Data integrity and analytics acceleration',
      focus: 'Data Quality & Insights'
    },
    ciso: {
      primary: 'Security Posture',
      secondary: 'Threat mitigation and risk reduction',
      focus: 'Cybersecurity & Risk'
    },
    cfo: {
      primary: 'Financial Stability',
      secondary: 'Liquidity protection and cost optimization',
      focus: 'Financial Risk & ROI'
    },
    general: {
      primary: 'Enterprise Value Creation',
      secondary: 'Comprehensive risk mitigation and performance improvement',
      focus: 'Total Business Impact'
    }
  };

  const message = personaMessages[persona];

  return (
    <div 
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      data-testid="roi-calculator"
    >
      <Card className="bg-gradient-to-br from-gray-900 to-blue-900/30 border-blue-500/50 shadow-2xl">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">{message.primary}</h3>
            </div>
            <p className="text-blue-200 text-sm">{message.secondary}</p>
            <Badge variant="outline" className="bg-blue-600/20 text-blue-300 border-blue-500/50">
              {metrics.name} | {message.focus}
            </Badge>
          </div>

          {/* Interactive Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Company Size (Employees)</span>
                <span className="text-white font-semibold">{companySize.toLocaleString()}</span>
              </div>
              <Slider
                value={[companySize]}
                onValueChange={(value) => setCompanySize(value[0])}
                min={1000}
                max={50000}
                step={1000}
                className="cursor-pointer"
                data-testid="slider-company-size"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Current Crisis Response Time (Hours)</span>
                <span className="text-white font-semibold">{currentCrisisResponse}h</span>
              </div>
              <Slider
                value={[currentCrisisResponse]}
                onValueChange={(value) => setCurrentCrisisResponse(value[0])}
                min={12}
                max={168}
                step={6}
                className="cursor-pointer"
                data-testid="slider-response-time"
              />
            </div>
          </div>

          {/* Coordination Time Savings Highlight */}
          <div className="bg-gradient-to-r from-green-950/70 to-emerald-950/70 rounded-lg p-4 border-2 border-green-500/50">
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-300 font-medium">Coordination Time Savings</div>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <div className="text-sm text-gray-400">Industry Standard</div>
                  <div className="text-3xl font-bold text-red-400">72 hours</div>
                </div>
                <div className="text-2xl text-gray-500">→</div>
                <div>
                  <div className="text-sm text-gray-400">M Execution</div>
                  <div className="text-3xl font-bold text-green-400">12 minutes</div>
                </div>
              </div>
              <div className="pt-2 border-t border-green-500/30">
                <div className="text-2xl font-bold text-white">360x Faster</div>
                <div className="text-xs text-green-300">99.7% time reduction</div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-gray-400">Decision Velocity</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{mResponseMinutes} min</div>
              <div className="text-xs text-blue-300 mt-1">
                vs {currentCrisisResponse}h industry avg ({improvementPercentage.toFixed(0)}% faster)
              </div>
            </div>

            <div className="bg-green-950/50 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-400">Annual Savings</span>
              </div>
              <div className="text-2xl font-bold text-white">
                ${(annualCostSavings / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-green-300 mt-1">
                ${(costSavingsPerCrisis / 1000).toFixed(0)}K per crisis
              </div>
            </div>

            <div className="bg-purple-950/50 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-gray-400">ROI</span>
              </div>
              <div className="text-2xl font-bold text-white">{roi.toFixed(0)}%</div>
              <div className="text-xs text-purple-300 mt-1">
                {paybackMonths.toFixed(1)} month payback
              </div>
            </div>

            <div className="bg-orange-950/50 rounded-lg p-4 border border-orange-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-gray-400">Risk Reduction</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(complianceRiskReduction * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-orange-300 mt-1">
                Compliance & reputation
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-600/20 to-teal-600/20 rounded-lg p-4 border border-blue-500/30">
            <h4 className="text-white font-semibold mb-2 text-sm">🏈 Championship Execution Through Preparation</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• <strong className="text-green-400">{mResponseMinutes}-minute playbook execution</strong> vs {currentCrisisResponse}-hour industry standard</li>
              <li>• {annualTimeSavings.toFixed(0)} hours saved annually across {averageCrisesPerYear} scenarios</li>
              <li>• ${(annualCostSavings / 1000000).toFixed(2)}M cost avoidance from rapid decision velocity</li>
              <li>• {(reputationProtection * 100).toFixed(0)}% improvement in brand protection with pre-configured playbooks</li>
              <li>• <strong className="text-purple-400">{paybackMonths.toFixed(1)}-month payback</strong> with {roi.toFixed(0)}% annual ROI</li>
            </ul>
          </div>

          {/* CTA */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold"
            data-testid="roi-schedule-demo-btn"
          >
            Schedule Custom ROI Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
