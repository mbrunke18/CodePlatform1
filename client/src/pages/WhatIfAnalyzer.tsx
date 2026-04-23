import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageLayout from '@/components/layout/PageLayout';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import {
  FlaskConical,
  TrendingUp,
  AlertTriangle,
  Target,
  Clock,
  Users,
  Zap,
  ArrowRight,
  Play,
  Save,
  Sparkles,
  CheckCircle2,
  XCircle,
  Activity,
  BarChart3,
  Rocket,
  Shield,
  DollarSign,
  Building2,
  FileText,
  Plus,
  Trash2,
  TrendingDown,
  UserCheck,
  Package,
  Settings,
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  Layers,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import ScenarioVarianceAlert from '@/components/predictive/ScenarioVarianceAlert';

interface StrategicVariable {
  id: string;
  label: string;
  category: 'market' | 'operational' | 'financial' | 'regulatory' | 'environmental';
  unit: string;
  defaultOperator: 'greater' | 'less' | 'equals' | 'between' | 'increases_by' | 'decreases_by' | 'changes_to';
  defaultValue: string;
  placeholder: string;
  scenarioTypes: string[];
}

const strategicVariables: StrategicVariable[] = [
  { id: 'market_share', label: 'Market Share', category: 'market', unit: '%', defaultOperator: 'changes_to', defaultValue: '', placeholder: '25', scenarioTypes: ['market', 'strategic', 'operational', 'financial'] },
  { id: 'revenue_change', label: 'Revenue', category: 'financial', unit: '%', defaultOperator: 'decreases_by', defaultValue: '', placeholder: '15', scenarioTypes: ['market', 'financial', 'strategic', 'operational', 'security', 'supply-chain', 'regulatory'] },
  { id: 'competitor_pricing', label: 'Competitor Pricing', category: 'market', unit: '% lower', defaultOperator: 'changes_to', defaultValue: '', placeholder: '30', scenarioTypes: ['market', 'strategic', 'operational'] },
  { id: 'time_to_market', label: 'Time to Market', category: 'operational', unit: 'months', defaultOperator: 'changes_to', defaultValue: '', placeholder: '3', scenarioTypes: ['market', 'strategic', 'operational'] },
  { id: 'budget_available', label: 'Available Budget', category: 'financial', unit: '$M', defaultOperator: 'changes_to', defaultValue: '', placeholder: '5', scenarioTypes: ['market', 'financial', 'strategic', 'operational', 'security', 'supply-chain', 'regulatory'] },
  { id: 'team_headcount', label: 'Team Size', category: 'operational', unit: 'people', defaultOperator: 'changes_to', defaultValue: '', placeholder: '50', scenarioTypes: ['market', 'strategic', 'operational', 'security'] },
  { id: 'response_time', label: 'Response Time', category: 'operational', unit: 'minutes', defaultOperator: 'changes_to', defaultValue: '', placeholder: '12', scenarioTypes: ['security', 'operational', 'supply-chain', 'regulatory'] },
  { id: 'downtime_duration', label: 'System Downtime', category: 'operational', unit: 'hours', defaultOperator: 'changes_to', defaultValue: '', placeholder: '4', scenarioTypes: ['security', 'operational', 'supply-chain'] },
  { id: 'records_affected', label: 'Records Affected', category: 'operational', unit: 'records', defaultOperator: 'changes_to', defaultValue: '', placeholder: '500000', scenarioTypes: ['security', 'regulatory'] },
  { id: 'compliance_deadline', label: 'Compliance Deadline', category: 'regulatory', unit: 'days', defaultOperator: 'changes_to', defaultValue: '', placeholder: '30', scenarioTypes: ['regulatory', 'security', 'strategic'] },
  { id: 'supply_chain_delay', label: 'Supply Chain Delay', category: 'operational', unit: 'weeks', defaultOperator: 'increases_by', defaultValue: '', placeholder: '6', scenarioTypes: ['supply-chain', 'operational', 'market'] },
  { id: 'customer_churn', label: 'Customer Churn Rate', category: 'market', unit: '%', defaultOperator: 'increases_by', defaultValue: '', placeholder: '8', scenarioTypes: ['market', 'strategic', 'operational', 'financial'] },
  { id: 'cost_of_capital', label: 'Cost of Capital', category: 'financial', unit: '%', defaultOperator: 'increases_by', defaultValue: '', placeholder: '2.5', scenarioTypes: ['financial', 'strategic', 'market'] },
  { id: 'regulatory_fine', label: 'Potential Regulatory Fine', category: 'regulatory', unit: '$M', defaultOperator: 'changes_to', defaultValue: '', placeholder: '10', scenarioTypes: ['regulatory', 'security', 'financial'] },
  { id: 'staff_availability', label: 'Key Staff Availability', category: 'operational', unit: '%', defaultOperator: 'decreases_by', defaultValue: '', placeholder: '40', scenarioTypes: ['operational', 'security', 'strategic', 'supply-chain'] },
  { id: 'integration_timeline', label: 'Integration Timeline', category: 'operational', unit: 'days', defaultOperator: 'changes_to', defaultValue: '', placeholder: '60', scenarioTypes: ['strategic', 'market', 'operational'] },
  { id: 'oil_price', label: 'Oil Price', category: 'environmental', unit: '$/barrel', defaultOperator: 'greater', defaultValue: '', placeholder: '120', scenarioTypes: ['financial', 'supply-chain', 'operational', 'market'] },
  { id: 'interest_rate', label: 'Interest Rate', category: 'financial', unit: '%', defaultOperator: 'increases_by', defaultValue: '', placeholder: '1.5', scenarioTypes: ['financial', 'strategic', 'market'] },
  { id: 'adoption_rate', label: 'Technology Adoption Rate', category: 'operational', unit: '%', defaultOperator: 'changes_to', defaultValue: '', placeholder: '60', scenarioTypes: ['strategic', 'market', 'operational', 'security'] },
  { id: 'reputation_score', label: 'Brand Reputation Score', category: 'market', unit: 'points (0-100)', defaultOperator: 'decreases_by', defaultValue: '', placeholder: '20', scenarioTypes: ['market', 'strategic', 'security', 'regulatory'] },
];

const operatorLabels: Record<string, string> = {
  greater: 'is greater than',
  less: 'is less than',
  equals: 'equals',
  between: 'is between',
  increases_by: 'increases by',
  decreases_by: 'decreases by',
  changes_to: 'changes to',
};

interface TestCondition {
  id: string;
  label: string;
  operator: 'greater' | 'less' | 'equals' | 'between' | 'increases_by' | 'decreases_by' | 'changes_to';
  value: number | string;
  value2?: number | string;
  unit?: string;
  category: 'market' | 'operational' | 'financial' | 'regulatory' | 'environmental';
  variableId?: string;
}

interface ImpactAssessment {
  financial: {
    estimatedCost: number;
    revenueImpact: number;
    budgetAllocation: number;
  };
  operational: {
    affectedDepartments: string[];
    affectedRegions: string[];
    downtimeEstimate: number;
  };
  reputational: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    stakeholderConcerns: string[];
  };
  timeline: {
    detectionToResponse: number;
    fullResolution: number;
  };
}

interface ResourceRequirement {
  id: string;
  type: 'personnel' | 'budget' | 'technology' | 'external';
  name: string;
  quantity: number;
  estimatedCost: number;
  availability: 'available' | 'limited' | 'unavailable';
}

interface StakeholderGroup {
  id: string;
  name: string;
  role: string;
  priority: 'high' | 'medium' | 'low';
  communicationChannel: string;
}

interface AnalysisResult {
  triggeredAlerts: Array<{ id: string; name: string; severity: string }>;
  recommendedPlaybooks: Array<{ 
    id: string; 
    name: string; 
    executionTime: number; 
    readinessState: string;
    automationCoverage?: number;
  }>;
  projectedExecutionTime: number;
  teamsInvolved: Array<{ name: string; role: string }>;
  decisionVelocityMetrics: {
    ourTime: number;
    industryAverage: number;
    timeSaved: number;
    percentageFaster: number;
  };
  impactScore: number;
  confidenceLevel: number;
}

type ViewMode = 'choose' | 'quick' | 'builder';

const domainPresets: Record<string, { label: string; color: string; icon: any; scenarios: string[] }> = {
  offense: {
    label: 'GROWTH & POSITIONING',
    color: 'teal',
    icon: Rocket,
    scenarios: [
      "What if we accelerate the market entry timeline from 6 months to 6 weeks?",
      "What if a competitor launches in our target market before us?",
      "What if we require dual board approval for M&A deals over $50M?",
    ],
  },
  defense: {
    label: 'RISK & RESILIENCE',
    color: 'navy',
    icon: Shield,
    scenarios: [
      "What if the CISO is unavailable during a ransomware attack?",
      "What if a regulatory deadline changes from 90 days to 30 days?",
      "What if we add mandatory legal review before all external crisis communications?",
    ],
  },
  special_teams: {
    label: 'TRANSFORMATION',
    color: 'gold',
    icon: Settings,
    scenarios: [
      "What if the digital transformation timeline is cut by 50%?",
      "What if we need to integrate an acquired company's AI systems within 60 days?",
      "What if we require AI ethics review for every new model deployment?",
    ],
  },
};

const domainStyleMap: Record<string, { border: string; bg: string; text: string; iconText: string; btnClass: string }> = {
  all: { border: 'border-[#2B8A6E]/30 dark:border-[#2B8A6E]/50', bg: 'bg-[#2B8A6E]/5 dark:bg-[#2B8A6E]/10', text: 'text-[#2B8A6E]', iconText: 'text-[#2B8A6E]', btnClass: 'bg-[#0A0F2E] hover:bg-[#141B45] text-white' },
  offense: { border: 'border-[#2B8A6E]/30 dark:border-[#2B8A6E]/50', bg: 'bg-[#2B8A6E]/5 dark:bg-[#2B8A6E]/10', text: 'text-[#2B8A6E]', iconText: 'text-[#2B8A6E]', btnClass: 'bg-[#0A0F2E] hover:bg-[#141B45] text-white' },
  defense: { border: 'border-[#C9A84C]/30 dark:border-[#C9A84C]/50', bg: 'bg-[#C9A84C]/5 dark:bg-[#C9A84C]/10', text: 'text-[#C9A84C]', iconText: 'text-[#C9A84C]', btnClass: 'bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E]' },
  special_teams: { border: 'border-[#C9A84C]/30 dark:border-[#C9A84C]/50', bg: 'bg-[#C9A84C]/5 dark:bg-[#C9A84C]/10', text: 'text-[#C9A84C]', iconText: 'text-[#C9A84C]', btnClass: 'bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E]' },
};

function QuickAnalysis({ onBack, onSwitchToBuilder }: { onBack: () => void; onSwitchToBuilder: () => void }) {
  const [scenario, setScenario] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'all' | 'offense' | 'defense' | 'special_teams'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const allScenarios = selectedDomain === 'all'
    ? Object.values(domainPresets).flatMap(d => d.scenarios.slice(0, 2))
    : domainPresets[selectedDomain]?.scenarios || [];

  const style = domainStyleMap[selectedDomain] || domainStyleMap.all;

  const runAnalysis = async () => {
    if (!scenario.trim()) return;
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    const domainLabel = selectedDomain === 'all' ? 'Strategic' : domainPresets[selectedDomain]?.label || 'Strategic';

    try {
      const response = await fetch('/api/incidents/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          domain: selectedDomain === 'all' ? undefined : selectedDomain,
          playbook: { name: `${domainLabel} Response Readiness Protocol`, tasks: Array(8).fill(null), stakeholders: Array(6).fill(null) },
        }),
      });
      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-[#0A0F2E] hover:text-[#0A0F2E] dark:hover:text-[#C9A84C] -ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to options
      </Button>

      <div className="text-center max-w-2xl mx-auto mb-2">
        <h2 className="text-2xl font-bold text-[#0A0F2E] dark:text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Quick What-If Analysis</h2>
        <p className="text-[#6B7280] dark:text-[#E8E4DC]">
          Describe a scenario in plain language and get an instant Signal-based impact assessment.
          See how long it would take to respond, what risks are involved, and whether to proceed.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {[
          { key: 'all', label: 'All Domains', icon: Sparkles, borderColor: 'border-[#2B8A6E]', textColor: 'text-[#2B8A6E]', bgColor: 'bg-[#2B8A6E]/10' },
          { key: 'offense', label: 'GROWTH & POSITIONING', icon: Rocket, borderColor: 'border-[#2B8A6E]', textColor: 'text-[#2B8A6E]', bgColor: 'bg-[#2B8A6E]/10' },
          { key: 'defense', label: 'RISK & RESILIENCE', icon: Shield, borderColor: 'border-[#C9A84C]', textColor: 'text-[#C9A84C]', bgColor: 'bg-[#C9A84C]/10' },
          { key: 'special_teams', label: 'TRANSFORMATION', icon: Settings, borderColor: 'border-[#C9A84C]', textColor: 'text-[#C9A84C]', bgColor: 'bg-[#C9A84C]/10' },
        ].map(({ key, label, icon: Icon, borderColor, textColor, bgColor }) => (
          <Button
            key={key}
            variant={selectedDomain === key ? 'default' : 'outline'}
            size="sm"
            className={selectedDomain === key ? `${bgColor} ${textColor} border-2 ${borderColor}` : 'border-[#E8E4DC] text-[#6B7280]'}
            onClick={() => setSelectedDomain(key as any)}
          >
            <Icon className="h-4 w-4 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      <Card className={`${style.border} ${style.bg}`}>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-semibold text-[#0A0F2E] dark:text-[#E8E4DC] mb-2 block">
              Pick a sample scenario or type your own:
            </Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {allScenarios.map((s, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className={`text-xs transition-all border-[#E8E4DC] text-[#6B7280] ${scenario === s ? 'ring-2 ring-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]' : ''}`}
                  onClick={() => setScenario(s)}
                >
                  {s.length > 60 ? s.substring(0, 60) + '...' : s}
                </Button>
              ))}
            </div>
          </div>

          <Textarea
            value={scenario}
            onChange={(e: any) => setScenario(e.target.value)}
            placeholder={selectedDomain === 'all'
              ? "Describe any strategic what-if scenario... e.g., 'What if a competitor enters our market with 30% lower pricing?'"
              : selectedDomain === 'offense'
              ? "Describe an offensive scenario... e.g., 'What if we fast-track the product launch by 3 months?'"
              : selectedDomain === 'defense'
              ? "Describe a defensive scenario... e.g., 'What if a data breach affects 1M customer records?'"
              : "Describe a transformation scenario... e.g., 'What if we mandate AI governance review for all deployments?'"}
            className="min-h-[80px]"
          />

          <Button
            onClick={runAnalysis}
            disabled={isAnalyzing || !scenario.trim()}
            className={`w-full sm:w-auto ${style.btnClass}`}
            size="lg"
          >
            {isAnalyzing ? (
              <><Activity className="h-4 w-4 mr-2 animate-spin" /> Analyzing Impact...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Analyze Impact</>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (() => {
        const isNotRecommended = result.recommendation?.toLowerCase().includes('not recommended');
        const isConditional = result.recommendation?.toLowerCase().includes('conditionally');
        const isRecommended = !isNotRecommended && !isConditional;
        const verdictConfig = isNotRecommended
          ? { icon: XCircle, label: 'Not Recommended', color: 'navy', bg: 'bg-[#0A0F2E]/10 dark:bg-[#0A0F2E]/20', border: 'border-[#0A0F2E]/30 dark:border-[#0A0F2E]/50', text: 'text-[#0A0F2E] dark:text-[#C9A84C]', iconColor: 'text-[#0A0F2E] dark:text-[#C9A84C]', badgeBg: 'bg-[#0A0F2E]' }
          : isConditional
          ? { icon: AlertTriangle, label: 'Proceed with Caution', color: 'gold', bg: 'bg-[#C9A84C]/10 dark:bg-[#C9A84C]/5', border: 'border-[#C9A84C]/30 dark:border-[#C9A84C]/50', text: 'text-[#C9A84C]', iconColor: 'text-[#C9A84C]', badgeBg: 'bg-[#C9A84C]' }
          : { icon: CheckCircle2, label: 'Recommended', color: 'teal', bg: 'bg-[#2B8A6E]/10 dark:bg-[#2B8A6E]/5', border: 'border-[#2B8A6E]/30 dark:border-[#2B8A6E]/50', text: 'text-[#2B8A6E]', iconColor: 'text-[#2B8A6E]', badgeBg: 'bg-[#2B8A6E]' };
        const VerdictIcon = verdictConfig.icon;
        return (
        <div className="space-y-6 animate-in fade-in duration-500">

          <Card className={`${verdictConfig.border} ${verdictConfig.bg} border-2`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 ${verdictConfig.bg}`}>
                  <VerdictIcon className={`h-8 w-8 ${verdictConfig.iconColor}`} />
                </div>
                <div>
                  <Badge className={`${verdictConfig.badgeBg} text-white mb-1`}>{verdictConfig.label}</Badge>
                  <h3 className="text-xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {isRecommended ? 'This change improves your execution speed'
                      : isConditional ? 'This change requires careful planning'
                      : 'This change would slow down your response'}
                  </h3>
                </div>
              </div>
              <p className="text-[#6B7280] dark:text-[#E8E4DC] text-sm leading-relaxed">{result.recommendation}</p>
            </CardContent>
          </Card>

          <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <Clock className="h-5 w-5 text-[#0A0F2E] dark:text-[#C9A84C]" />
                Coordination Timeline Comparison
              </CardTitle>
              <CardDescription className="text-[#6B7280]">How this change affects the time from trigger to full stakeholder coordination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-[#6B7280] dark:text-[#E8E4DC] text-right flex-shrink-0">Current Readiness Protocol</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-[#2B8A6E]/10 dark:bg-[#2B8A6E]/20 h-8 flex items-center px-4">
                        <span className="text-sm font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{result.original_time}</span>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-[#2B8A6E] flex-shrink-0" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-[#6B7280] dark:text-[#E8E4DC] text-right flex-shrink-0">With This Change</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`flex-1 ${isNotRecommended ? 'bg-[#0A0F2E]/10 dark:bg-[#0A0F2E]/30' : isConditional ? 'bg-[#C9A84C]/10 dark:bg-[#C9A84C]/20' : 'bg-[#2B8A6E]/10 dark:bg-[#2B8A6E]/20'} h-8 flex items-center px-4`}>
                        <span className={`text-sm font-bold ${isNotRecommended ? 'text-[#0A0F2E]' : isConditional ? 'text-[#C9A84C]' : 'text-[#2B8A6E]'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{result.modified_time}</span>
                      </div>
                      {isNotRecommended ? <TrendingDown className="h-5 w-5 text-[#0A0F2E] flex-shrink-0" /> : isConditional ? <AlertTriangle className="h-5 w-5 text-[#C9A84C] flex-shrink-0" /> : <TrendingUp className="h-5 w-5 text-[#2B8A6E] flex-shrink-0" />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-[#E8E4DC] dark:border-white/10">
                  <div className="w-32 text-sm font-semibold text-[#0A0F2E] dark:text-white text-right flex-shrink-0">Net Impact</div>
                  <div className="flex-1">
                    <span className={`text-lg font-bold ${isNotRecommended ? 'text-[#0A0F2E]' : isConditional ? 'text-[#C9A84C]' : 'text-[#2B8A6E]'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{result.impact}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.risk_assessment && (
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <Shield className="h-5 w-5 text-[#2B8A6E]" />
                  What You Should Know
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B7280] dark:text-[#E8E4DC] text-sm leading-relaxed">{result.risk_assessment}</p>
              </CardContent>
            </Card>
          )}

          <Card className="border-[#2B8A6E]/30 dark:border-[#2B8A6E]/50 bg-gradient-to-br from-[#2B8A6E]/10 to-white dark:from-[#2B8A6E]/20 dark:to-[#0A0F2E]">
            <CardHeader className="pb-3 border-b border-[#E8E4DC] dark:border-white/10">
              <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <Shield className="h-5 w-5 text-[#2B8A6E]" />
                Readiness Protocol Activation Readiness
              </CardTitle>
              <CardDescription>
                {isRecommended
                  ? 'With this change in place, here is how Readiness OS orchestrates the response'
                  : isConditional
                  ? 'If you proceed with safeguards, Readiness OS can orchestrate the adjusted response'
                  : 'Even without this change, Readiness OS keeps your current coordination at peak speed'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-[#2B8A6E]/10 dark:bg-[#2B8A6E]/20 flex-shrink-0">
                    <Target className="h-4 w-4 text-[#2B8A6E]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0A0F2E] dark:text-white">Auto-Detect Trigger</div>
                    <p className="text-xs text-[#6B7280] mt-0.5">AI agents continuously monitor for this scenario pattern and activate the right Readiness Protocol instantly</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-[#2B8A6E]/10 dark:bg-[#2B8A6E]/20 flex-shrink-0">
                    <Users className="h-4 w-4 text-[#2B8A6E]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0A0F2E] dark:text-white">Coordinate Stakeholders</div>
                    <p className="text-xs text-[#6B7280] mt-0.5">Notify 50-200+ stakeholders simultaneously with role-specific instructions and acknowledgment tracking</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-[#2B8A6E]/10 dark:bg-[#2B8A6E]/20 flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-[#2B8A6E]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0A0F2E] dark:text-white">Execute in {isRecommended ? (result.modified_time || result.original_time || '12 minutes') : (result.original_time || '12 minutes')}</div>
                    <p className="text-xs text-[#6B7280] mt-0.5">Pre-authorized budgets release, tasks assign, and documents stage — all within the coordination window</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button onClick={onSwitchToBuilder} variant="outline" className="gap-2">
              <Layers className="h-4 w-4" /> Build Detailed Scenario Model
            </Button>
            <Button onClick={() => setResult(null)} variant="ghost" className="text-gray-700 gap-2">
              <FlaskConical className="h-4 w-4" /> Test Another Scenario
            </Button>
          </div>
        </div>
        );
      })()}
    </div>
  );
}

function ScenarioBuilder({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
  const [wizardStep, setWizardStep] = useState(1);
  const totalSteps = 4;

  const [analysisName, setAnalysisName] = useState('');
  const [analysisDescription, setAnalysisDescription] = useState('');
  const [scenarioType, setScenarioType] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [conditions, setConditions] = useState<TestCondition[]>([]);
  const [selectedVariableId, setSelectedVariableId] = useState<string>('');
  const [conditionOperator, setConditionOperator] = useState<string>('');
  const [conditionValue, setConditionValue] = useState('');
  const [conditionValue2, setConditionValue2] = useState('');
  const [showCustomVariable, setShowCustomVariable] = useState(false);
  const [showAllVariables, setShowAllVariables] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [customCategory, setCustomCategory] = useState<'market' | 'operational' | 'financial' | 'regulatory' | 'environmental'>('market');
  const [impactAssessment, setImpactAssessment] = useState<ImpactAssessment>({
    financial: { estimatedCost: 0, revenueImpact: 0, budgetAllocation: 0 },
    operational: { affectedDepartments: [], affectedRegions: [], downtimeEstimate: 0 },
    reputational: { riskLevel: 'medium', stakeholderConcerns: [] },
    timeline: { detectionToResponse: 12, fullResolution: 24 },
  });
  const [resources, setResources] = useState<ResourceRequirement[]>([]);
  const [stakeholders, setStakeholders] = useState<StakeholderGroup[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: organizationsRaw } = useQuery<any[]>({ queryKey: ['/api/organizations'] });
  const organizations = Array.isArray(organizationsRaw) ? organizationsRaw : [];
  const organizationId = organizations[0]?.id || '95b97862-8e9d-4c4c-8609-7d8f37b68d36';
  const { data: triggersRaw } = useQuery<any[]>({ queryKey: ['/api/executive-triggers'] });
  const triggers = Array.isArray(triggersRaw) ? triggersRaw : [];
  const { data: playbooksRaw } = useQuery<any[]>({ queryKey: ['/api/scenarios'] });
  const playbooks = Array.isArray(playbooksRaw) ? playbooksRaw : [];
  const { data: scenarioTemplatesRaw } = useQuery<any[]>({ queryKey: ['/api/scenario-templates'] });
  const scenarioTemplates = Array.isArray(scenarioTemplatesRaw) ? scenarioTemplatesRaw : [];

  const loadTemplate = (key: string) => {
    const templates: Record<string, { name: string; desc: string; type: string; industry: string }> = {
      'market-entry': { name: 'Market Entry Analysis', desc: 'Evaluate the strategic implications, competitive response, and resource requirements for entering a new market or launching a new product line.', type: 'market', industry: 'general' },
      'ma-integration': { name: 'M&A Integration', desc: 'Plan the integration of an acquired company including culture alignment, systems consolidation, and talent retention strategies.', type: 'strategic', industry: 'general' },
      'product-recall': { name: 'Product Recall Scenario', desc: 'Model the impact of a potential product recall including supply chain disruption, customer communication, and regulatory response.', type: 'operational', industry: 'manufacturing' },
      'cyber-incident': { name: 'Cybersecurity Incident', desc: 'Model response to a data breach or ransomware attack including containment, stakeholder communication, and recovery procedures.', type: 'security', industry: 'technology' },
      'digital-transform': { name: 'Digital Transformation Sprint', desc: 'Analyze the impact of accelerating digital transformation initiatives including cloud migration, process automation, and organizational change management.', type: 'strategic', industry: 'general' },
      'ai-governance': { name: 'AI Governance Framework', desc: 'Assess the operational and compliance impact of implementing AI governance policies including ethics review boards, model auditing, and deployment approval workflows.', type: 'regulatory', industry: 'general' },
    };
    const t = templates[key];
    if (t) {
      setAnalysisName(t.name);
      setAnalysisDescription(t.desc);
      setScenarioType(t.type);
      setIndustry(t.industry);
      toast({ title: "Template Loaded", description: `${t.name} loaded - continue to add test conditions` });
    }
  };

  const loadDbTemplate = (templateId: string) => {
    const template = scenarioTemplates.find((t: any) => t.id === templateId);
    if (!template) return;
    setAnalysisName(template.name || '');
    setAnalysisDescription(template.description || '');
    setScenarioType(template.category || '');
    setIndustry(template.industry || '');
    if (template.triggerConditions) {
      const templateConditions: TestCondition[] = [];
      Object.entries(template.triggerConditions).forEach(([key, value]: [string, any], index) => {
        templateConditions.push({
          id: `cond_${Date.now()}_${index}`,
          label: key,
          operator: value.operator || 'greater',
          value: value.value || value.threshold || '',
          unit: value.unit || '',
          category: value.category || 'market',
        });
      });
      setConditions(templateConditions);
    }
    toast({ title: "Template Loaded", description: `Loaded scenario: ${template.name}` });
  };

  const selectedVariable = strategicVariables.find(v => v.id === selectedVariableId);

  const relevantVariables = scenarioType
    ? strategicVariables.filter(v => v.scenarioTypes.includes(scenarioType))
    : strategicVariables;

  const alreadyAddedIds = new Set(conditions.map(c => c.variableId).filter(Boolean));

  const handleSelectVariable = (varId: string) => {
    const variable = strategicVariables.find(v => v.id === varId);
    if (variable) {
      setSelectedVariableId(varId);
      setConditionOperator(variable.defaultOperator);
      setConditionValue('');
      setConditionValue2('');
      setShowCustomVariable(false);
    }
  };

  const addCondition = () => {
    if (showCustomVariable) {
      if (!customLabel.trim() || !conditionValue.trim()) {
        toast({ title: "Missing Information", description: "Please provide a variable name and value", variant: "destructive" });
        return;
      }
      const customOp = conditionOperator || 'changes_to';
      if (customOp === 'between' && !conditionValue2.trim()) {
        toast({ title: "Missing Range", description: "Please enter both a minimum and maximum value for the 'between' range", variant: "destructive" });
        return;
      }
      const condition: TestCondition = {
        id: `cond_${Date.now()}`,
        label: customLabel,
        operator: (conditionOperator || 'changes_to') as any,
        value: parseFloat(conditionValue) || conditionValue,
        value2: conditionValue2 ? (parseFloat(conditionValue2) || conditionValue2) : undefined,
        unit: customUnit,
        category: customCategory,
      };
      setConditions([...conditions, condition]);
      setCustomLabel('');
      setCustomUnit('');
      setConditionValue('');
      setConditionValue2('');
      setConditionOperator('');
      setShowCustomVariable(false);
      return;
    }

    if (!selectedVariable || !conditionValue.trim()) {
      toast({ title: "Missing Information", description: "Please select a variable and enter a value", variant: "destructive" });
      return;
    }
    const op = conditionOperator || selectedVariable.defaultOperator;
    if (op === 'between' && !conditionValue2.trim()) {
      toast({ title: "Missing Range", description: "Please enter both a minimum and maximum value for the 'between' range", variant: "destructive" });
      return;
    }
    const condition: TestCondition = {
      id: `cond_${Date.now()}`,
      label: selectedVariable.label,
      operator: op as any,
      value: parseFloat(conditionValue) || conditionValue,
      value2: conditionValue2 ? (parseFloat(conditionValue2) || conditionValue2) : undefined,
      unit: selectedVariable.unit,
      category: selectedVariable.category,
      variableId: selectedVariable.id,
    };
    setConditions([...conditions, condition]);
    setSelectedVariableId('');
    setConditionOperator('');
    setConditionValue('');
    setConditionValue2('');
  };

  const removeCondition = (id: string) => setConditions(conditions.filter(c => c.id !== id));

  const addResource = () => {
    setResources([...resources, {
      id: `res_${Date.now()}`, type: 'personnel', name: '', quantity: 1, estimatedCost: 0, availability: 'available',
    }]);
  };
  const updateResource = (id: string, field: keyof ResourceRequirement, value: any) => {
    setResources(resources.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  const removeResource = (id: string) => setResources(resources.filter(r => r.id !== id));

  const addStakeholder = () => {
    setStakeholders([...stakeholders, {
      id: `stake_${Date.now()}`, name: '', role: '', priority: 'medium', communicationChannel: 'email',
    }]);
  };
  const updateStakeholder = (id: string, field: keyof StakeholderGroup, value: any) => {
    setStakeholders(stakeholders.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const removeStakeholder = (id: string) => setStakeholders(stakeholders.filter(s => s.id !== id));

  const runAnalysis = async () => {
    if (conditions.length === 0) {
      toast({ title: "No Conditions", description: "Add at least one test condition to run the analysis", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    try {
      const triggeredAlerts: any[] = [];
      const recommendedPlaybooksList: any[] = [];
      const teamsSet = new Set<string>();

      triggers.forEach((trigger: any) => {
        const shouldTrigger = conditions.some(cond => {
          if (trigger.name?.toLowerCase().includes(cond.label.toLowerCase())) return true;
          if (trigger.dataSource?.toLowerCase().includes(cond.label.toLowerCase())) return true;
          return false;
        });
        if (shouldTrigger) {
          triggeredAlerts.push({ id: trigger.id, name: trigger.name, severity: trigger.severity || 'medium' });
          if (trigger.recommendedPlaybooks && Array.isArray(trigger.recommendedPlaybooks)) {
            trigger.recommendedPlaybooks.forEach((pbId: string) => {
              const playbook = playbooks.find((p: any) => p.id === pbId);
              if (playbook && !recommendedPlaybooksList.find(p => p.id === pbId)) {
                recommendedPlaybooksList.push({
                  id: playbook.id, name: playbook.name || playbook.title,
                  executionTime: playbook.averageExecutionTime || 12, readinessState: playbook.readinessState || 'teal',
                  automationCoverage: playbook.automationCoverage || 75,
                });
                teamsSet.add('Crisis Response Team');
                teamsSet.add('Executive Leadership');
                impactAssessment.operational.affectedDepartments.forEach(dept => teamsSet.add(dept));
              }
            });
          }
        }
      });

      if (triggeredAlerts.length === 0) {
        const scenarioLabel = analysisName || analysisDescription || conditions[0]?.label || 'Scenario';
        const typeMap: Record<string, { alerts: { name: string; severity: string }[]; playbooks: { name: string; time: number; coverage: number }[]; teams: string[] }> = {
          security: {
            alerts: [{ name: `${scenarioLabel} - Threat Detected`, severity: 'high' }, { name: 'Anomalous Activity Alert', severity: 'medium' }, { name: 'Compliance Deviation Warning', severity: 'medium' }],
            playbooks: [{ name: 'Cyber Incident Response', time: 12, coverage: 82 }, { name: 'Crisis Communications Protocol', time: 8, coverage: 70 }, { name: 'Regulatory Notification Sequence', time: 15, coverage: 65 }],
            teams: ['Cybersecurity Operations', 'Executive Leadership', 'Legal & Compliance', 'Corporate Communications'],
          },
          market: {
            alerts: [{ name: `${scenarioLabel} - Market Signal`, severity: 'high' }, { name: 'Competitive Intelligence Alert', severity: 'medium' }],
            playbooks: [{ name: 'Market Entry Acceleration', time: 10, coverage: 78 }, { name: 'Competitive Response Framework', time: 14, coverage: 72 }, { name: 'Go-to-Market Sprint Readiness Protocol', time: 8, coverage: 85 }],
            teams: ['Strategy & Growth', 'Executive Leadership', 'Sales Operations', 'Product Management'],
          },
          operational: {
            alerts: [{ name: `${scenarioLabel} - Operational Risk`, severity: 'high' }, { name: 'Supply Chain Disruption Alert', severity: 'medium' }, { name: 'Quality Assurance Warning', severity: 'low' }],
            playbooks: [{ name: 'Operational Continuity Plan', time: 11, coverage: 75 }, { name: 'Stakeholder Communication Protocol', time: 6, coverage: 80 }],
            teams: ['Operations Center', 'Executive Leadership', 'Quality Assurance', 'Supply Chain Management'],
          },
          strategic: {
            alerts: [{ name: `${scenarioLabel} - Strategic Trigger`, severity: 'high' }, { name: 'Integration Readiness Alert', severity: 'medium' }],
            playbooks: [{ name: 'M&A Integration Readiness Protocol', time: 14, coverage: 70 }, { name: 'Cultural Alignment Framework', time: 10, coverage: 68 }, { name: 'Systems Consolidation Sprint', time: 12, coverage: 74 }],
            teams: ['M&A Integration Office', 'Executive Leadership', 'HR & Culture', 'IT Infrastructure'],
          },
          regulatory: {
            alerts: [{ name: `${scenarioLabel} - Regulatory Signal`, severity: 'high' }, { name: 'Compliance Framework Change', severity: 'medium' }],
            playbooks: [{ name: 'Regulatory Compliance Sprint', time: 10, coverage: 76 }, { name: 'AI Governance Implementation', time: 13, coverage: 72 }, { name: 'Policy Update Protocol', time: 7, coverage: 80 }],
            teams: ['Legal & Compliance', 'Executive Leadership', 'AI Ethics Board', 'Risk Management'],
          },
          financial: {
            alerts: [{ name: `${scenarioLabel} - Financial Risk`, severity: 'high' }, { name: 'Budget Variance Alert', severity: 'medium' }],
            playbooks: [{ name: 'Financial Risk Mitigation', time: 9, coverage: 78 }, { name: 'Cost Containment Protocol', time: 11, coverage: 73 }],
            teams: ['Finance Operations', 'Executive Leadership', 'Treasury', 'Investor Relations'],
          },
        };
        const demo = typeMap[scenarioType] || typeMap['operational'];
        demo.alerts.forEach((a, i) => triggeredAlerts.push({ id: `demo-alert-${i}`, name: a.name, severity: a.severity }));
        demo.playbooks.forEach((p, i) => recommendedPlaybooksList.push({ id: `demo-pb-${i}`, name: p.name, executionTime: p.time, readinessState: 'teal', automationCoverage: p.coverage }));
        demo.teams.forEach(t => teamsSet.add(t));
        impactAssessment.operational.affectedDepartments.forEach(dept => teamsSet.add(dept));
      }

      const totalExecutionTime = recommendedPlaybooksList.reduce((sum, pb) => sum + pb.executionTime, 0) || 34;
      const industryAvg = 4320;
      const timeSaved = industryAvg - totalExecutionTime;
      const percentageFaster = Math.round((timeSaved / industryAvg) * 100);
      const financialImpact = Math.min(100, (impactAssessment.financial.estimatedCost / 1000000) * 10);
      const operationalImpact = impactAssessment.operational.affectedDepartments.length * 10;
      const reputationalImpact = impactAssessment.reputational.riskLevel === 'critical' ? 40 : impactAssessment.reputational.riskLevel === 'high' ? 30 : impactAssessment.reputational.riskLevel === 'medium' ? 20 : 10;
      const impactScore = Math.min(100, Math.round((financialImpact + operationalImpact + reputationalImpact) / 3));
      const dataCompleteness = [conditions.length > 0, impactAssessment.financial.estimatedCost > 0, impactAssessment.operational.affectedDepartments.length > 0, resources.length > 0, stakeholders.length > 0].filter(Boolean).length;
      const confidenceLevel = Math.round((dataCompleteness / 5) * 100);

      const result: AnalysisResult = {
        triggeredAlerts, recommendedPlaybooks: recommendedPlaybooksList,
        projectedExecutionTime: totalExecutionTime,
        teamsInvolved: Array.from(teamsSet).map(name => ({ name, role: 'Response Team' })),
        decisionVelocityMetrics: { ourTime: totalExecutionTime, industryAverage: industryAvg, timeSaved, percentageFaster },
        impactScore, confidenceLevel,
      };
      setAnalysisResult(result);
      setWizardStep(totalSteps);
      toast({ title: "Analysis Complete", description: `Found ${triggeredAlerts.length} triggers and ${recommendedPlaybooksList.length} recommended Readiness Protocols` });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({ title: "Analysis Failed", description: "Unable to complete the scenario analysis", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveScenario = async () => {
    if (!analysisName) { toast({ title: "Missing Name", description: "Please provide a name for this scenario analysis", variant: "destructive" }); return; }
    if (!analysisResult) { toast({ title: "No Results", description: "Run the analysis first before saving", variant: "destructive" }); return; }
    try {
      const testConditions: any = {};
      conditions.forEach(cond => { testConditions[cond.label] = { operator: cond.operator, value: cond.value, value2: cond.value2, unit: cond.unit, category: cond.category }; });
      await apiRequest('POST', '/api/what-if-scenarios', {
        name: analysisName, description: analysisDescription, scenarioType, industry, testConditions, impactAssessment,
        resources: resources.map(r => ({ type: r.type, name: r.name, quantity: r.quantity, estimatedCost: r.estimatedCost, availability: r.availability })),
        stakeholders: stakeholders.map(s => ({ name: s.name, role: s.role, priority: s.priority, communicationChannel: s.communicationChannel })),
        triggeredAlerts: analysisResult.triggeredAlerts.map(a => a.id),
        recommendedPlaybooks: analysisResult.recommendedPlaybooks.map(p => p.id),
        projectedExecutionTime: analysisResult.projectedExecutionTime,
        teamsInvolved: analysisResult.teamsInvolved,
        decisionVelocityMetrics: analysisResult.decisionVelocityMetrics,
        impactScore: analysisResult.impactScore, confidenceLevel: analysisResult.confidenceLevel,
        tags: ['what-if-analysis', scenarioType, industry].filter(Boolean)
      });
      queryClient.invalidateQueries({ queryKey: ['/api/what-if-scenarios'] });
      try {
        await apiRequest('POST', '/api/preparedness/activities', { organizationId, activityType: 'scenario_practice', description: `Completed what-if analysis: ${analysisName}`, metadata: { scenarioType, industry, impactScore: analysisResult.impactScore, confidenceLevel: analysisResult.confidenceLevel } });
        queryClient.invalidateQueries({ queryKey: [`/api/preparedness/score?organizationId=${organizationId}`] });
      } catch (e) { console.error('Activity logging failed:', e); }
      toast({ title: "Scenario Saved", description: "Your what-if analysis has been saved for future reference" });
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: "Save Failed", description: "Unable to save the scenario analysis", variant: "destructive" });
    }
  };

  const saveAsTemplate = async () => {
    if (!analysisName) { toast({ title: "Missing Name", description: "Please provide a name for this template", variant: "destructive" }); return; }
    try {
      const triggerConditions: any = {};
      conditions.forEach(cond => { triggerConditions[cond.label] = { operator: cond.operator, threshold: cond.value, value: cond.value, unit: cond.unit, category: cond.category }; });
      await apiRequest('POST', '/api/scenario-templates', {
        name: analysisName, category: scenarioType, description: analysisDescription, industry, isTemplate: true, templateCategory: 'custom', likelihood: 0.5, impact: 'moderate', triggerConditions,
        responseStrategy: { impactAssessment, resources: resources.map(r => ({ type: r.type, name: r.name, quantity: r.quantity, estimatedCost: r.estimatedCost })), stakeholders: stakeholders.map(s => ({ name: s.name, role: s.role, priority: s.priority })) },
        requiredDataPoints: conditions.map(c => c.label),
        criticalDecisionPoints: stakeholders.filter(s => s.priority === 'high').map(s => `${s.name} approval required`),
        stakeholderMapping: stakeholders.map(s => ({ group: s.name, role: s.role, communicationChannel: s.communicationChannel })),
        resourceRequirements: resources.map(r => ({ type: r.type, resource: r.name, quantity: r.quantity, cost: r.estimatedCost })),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scenario-templates'] });
      try {
        await apiRequest('POST', '/api/preparedness/activities', { organizationId, activityType: 'scenario_practice', description: `Created custom scenario template: ${analysisName}`, metadata: { scenarioType, industry, templateType: 'custom' } });
        queryClient.invalidateQueries({ queryKey: [`/api/preparedness/score?organizationId=${organizationId}`] });
      } catch (e) { console.error('Activity logging failed:', e); }
      toast({ title: "Template Created", description: "Your scenario has been saved as a reusable template" });
    } catch (error) {
      console.error('Template save error:', error);
      toast({ title: "Template Save Failed", description: "Unable to create the scenario template", variant: "destructive" });
    }
  };

  const stepLabels = ['Define Scenario', 'Set Assumptions', 'Impact & Resources', 'Results'];

  const canAdvance = () => {
    if (wizardStep === 1) return !!analysisName.trim() && !!scenarioType;
    if (wizardStep === 2) return conditions.length > 0;
    return true;
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-700 hover:text-slate-700 dark:hover:text-slate-300 -ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to options
      </Button>

      <div className="text-center max-w-2xl mx-auto mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Deep Scenario Builder</h2>
        <p className="text-gray-700 dark:text-slate-400">
          Build a detailed scenario model step by step. Define conditions, assess impact, and see exactly which
          Readiness Protocols and teams would activate.
        </p>
      </div>

      <div className="flex items-center justify-center gap-0 mb-6">
        {stepLabels.map((label, i) => {
          const step = i + 1;
          const isActive = wizardStep === step;
          const isComplete = wizardStep > step;
          return (
            <div key={step} className="flex items-center">
              {i > 0 && (
                <div className={`w-8 sm:w-12 h-0.5 ${isComplete ? 'bg-[#2B8A6E]' : 'bg-slate-200 dark:bg-[#141B45]'}`} />
              )}
              <button
                onClick={() => { if (isComplete) setWizardStep(step); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive ? 'bg-[#0A0F2E] text-white' :
                  isComplete ? 'bg-[#2B8A6E] text-white border-[#2B8A6E]' :
                  'bg-slate-100 text-gray-800 dark:bg-[#141B45] dark:text-slate-500'
                }`}
              >
                {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span>{step}</span>}
                <span className="hidden sm:inline">{label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {wizardStep === 1 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Start with a Template or Build from Scratch
              </CardTitle>
              <CardDescription>Pick a common scenario template to get started quickly, or fill in the details below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'market-entry', label: 'Market Entry', icon: TrendingUp, domain: 'GROWTH & POSITIONING', color: 'teal' },
                  { key: 'ma-integration', label: 'M&A Integration', icon: Building2, domain: 'GROWTH & POSITIONING', color: 'teal' },
                  { key: 'product-recall', label: 'Product Recall', icon: AlertTriangle, domain: 'RISK & RESILIENCE', color: 'red' },
                  { key: 'cyber-incident', label: 'Cyber Incident', icon: Shield, domain: 'RISK & RESILIENCE', color: 'red' },
                  { key: 'digital-transform', label: 'Digital Transform', icon: Zap, domain: 'TRANSFORMATION', color: 'gold' },
                  { key: 'ai-governance', label: 'AI Governance', icon: FileText, domain: 'TRANSFORMATION', color: 'gold' },
                ].map(({ key, label, icon: Icon, domain, color }) => {
                  const isActive = analysisName === { 'market-entry': 'Market Entry Analysis', 'ma-integration': 'M&A Integration', 'product-recall': 'Product Recall Scenario', 'cyber-incident': 'Cybersecurity Incident', 'digital-transform': 'Digital Transformation Sprint', 'ai-governance': 'AI Governance Framework' }[key];
                  const borderMap: Record<string, string> = { teal: 'border-teal-400 bg-teal-50 dark:bg-teal-900/20', red: 'border-red-400 bg-red-50 dark:bg-red-900/20', gold: 'border-gold-400 bg-gold-50 dark:bg-gold-900/20' };
                  const iconBg: Record<string, string> = { teal: 'bg-teal-100 dark:bg-teal-900/30', red: 'bg-red-100 dark:bg-red-900/30', gold: 'bg-gold-100 dark:bg-gold-900/30' };
                  const iconColor: Record<string, string> = { teal: 'text-teal-700', red: 'text-red-700', gold: 'text-[#C9A84C]' };
                  const domainColor: Record<string, string> = { teal: 'text-teal-700 dark:text-teal-400', red: 'text-red-700 dark:text-red-400', gold: 'text-[#C9A84C] dark:text-gold-400' };
                  return (
                    <button
                      key={key}
                      onClick={() => loadTemplate(key)}
                      className={`p-3 border-2 text-left transition-all ${isActive ? borderMap[color] : 'border-transparent bg-slate-50 dark:bg-[#141B45] hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                      <div className={`p-1.5 ${iconBg[color]} rounded-none inline-block mb-1.5`}>
                        <Icon className={`h-4 w-4 ${iconColor[color]}`} />
                      </div>
                      <div className="text-sm font-medium text-slate-800 dark:text-white">{label}</div>
                      <div className={`text-[10px] font-bold ${domainColor[color]}`}>{domain}</div>
                    </button>
                  );
                })}
              </div>

              {scenarioTemplates.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block">Or load from your saved templates:</Label>
                  <Select onValueChange={loadDbTemplate}>
                    <SelectTrigger><SelectValue placeholder="Select a saved template..." /></SelectTrigger>
                    <SelectContent>
                      {scenarioTemplates.map((template: any) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} - {template.category || template.industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <div>
                  <Label htmlFor="scenario-name">Scenario Name *</Label>
                  <Input id="scenario-name" placeholder="e.g., Oil Price Spike Q4 2026" value={analysisName} onChange={(e) => setAnalysisName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="scenario-description">Description</Label>
                  <Textarea id="scenario-description" placeholder="Describe the scenario and key assumptions..." value={analysisDescription} onChange={(e) => setAnalysisDescription(e.target.value)} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type *</Label>
                    <Select value={scenarioType} onValueChange={setScenarioType}>
                      <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="supply-chain">Supply Chain</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="regulatory">Regulatory</SelectItem>
                        <SelectItem value="strategic">Strategic</SelectItem>
                        <SelectItem value="market">Market</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger><SelectValue placeholder="Select industry..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="financial-services">Financial Services</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {wizardStep === 2 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#2B8A6E]" />
                Define Scenario Assumptions
              </CardTitle>
              <CardDescription>
                What conditions or changes are you modeling? Pick strategic variables relevant to your scenario, 
                set their values, and build a complete picture of the "what if."
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {!showCustomVariable && !selectedVariableId && (
                <div>
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 block">
                    {scenarioType ? 'Recommended for this scenario type' : 'Choose a strategic variable'}
                  </Label>
                  {(() => {
                    const available = relevantVariables.filter(v => !alreadyAddedIds.has(v.id));
                    const displayed = showAllVariables ? available : available.slice(0, 8);
                    const hasMore = available.length > 8 && !showAllVariables;
                    return (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {displayed.map(variable => {
                            const catColors: Record<string, { bg: string; text: string; border: string }> = {
                              market: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
                              operational: { bg: 'bg-navy-50 dark:bg-navy-900/20', text: 'text-[#2B8A6E] dark:text-navy-300', border: 'border-navy-200 dark:border-navy-800' },
                              financial: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-[#C9A84C] dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
                              regulatory: { bg: 'bg-gold-50 dark:bg-gold-900/20', text: 'text-gold-700 dark:text-gold-300', border: 'border-gold-200 dark:border-gold-800' },
                              environmental: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
                            };
                            const colors = catColors[variable.category] || catColors.market;
                            return (
                              <button
                                key={variable.id}
                                onClick={() => handleSelectVariable(variable.id)}
                                className={`flex items-center gap-3 p-3 border ${colors.border} ${colors.bg} text-left transition-all hover:scale-[1.01]`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-800 dark:text-white">{variable.label}</div>
                                  <div className={`text-xs ${colors.text}`}>{variable.category} · {variable.unit}</div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-800 flex-shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                        {hasMore && (
                          <div className="text-center mt-2">
                            <Button variant="ghost" size="sm" className="text-[#2B8A6E] dark:text-navy-400" onClick={() => setShowAllVariables(true)}>
                              Show {available.length - 8} more variables
                            </Button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                  <div className="mt-3 text-center">
                    <Button variant="ghost" size="sm" className="text-gray-700" onClick={() => setShowCustomVariable(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Add a custom variable
                    </Button>
                  </div>
                </div>
              )}

              {selectedVariableId && selectedVariable && (
                <div className="p-4 bg-navy-50 dark:bg-navy-900/10 space-y-4 border border-navy-200 dark:border-navy-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedVariable.label}</div>
                      <div className="text-xs text-gray-700">{selectedVariable.category} variable · measured in {selectedVariable.unit}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedVariableId(''); setConditionValue(''); setConditionValue2(''); }}>
                      <ArrowLeft className="h-3 w-3 mr-1" /> Change
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-slate-300 bg-white dark:bg-[#141B45] p-3 rounded-none border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-800 dark:text-white">{selectedVariable.label}</span>
                    <Select value={conditionOperator} onValueChange={setConditionOperator}>
                      <SelectTrigger className="w-44 h-8 text-xs">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="changes_to">changes to</SelectItem>
                        <SelectItem value="increases_by">increases by</SelectItem>
                        <SelectItem value="decreases_by">decreases by</SelectItem>
                        <SelectItem value="greater">is greater than</SelectItem>
                        <SelectItem value="less">is less than</SelectItem>
                        <SelectItem value="equals">equals</SelectItem>
                        <SelectItem value="between">is between</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder={selectedVariable.placeholder}
                      value={conditionValue}
                      onChange={(e) => setConditionValue(e.target.value)}
                      className="w-28 h-8 text-sm"
                    />
                    {conditionOperator === 'between' && (
                      <>
                        <span className="text-gray-800">and</span>
                        <Input
                          type="number"
                          placeholder="max"
                          value={conditionValue2}
                          onChange={(e) => setConditionValue2(e.target.value)}
                          className="w-28 h-8 text-sm"
                        />
                      </>
                    )}
                    <span className="text-gray-700 text-xs whitespace-nowrap">{selectedVariable.unit}</span>
                  </div>

                  {conditionValue && (
                    <div className="text-xs text-gray-700 dark:text-slate-400 italic pl-1">
                      Preview: "{selectedVariable.label} {operatorLabels[conditionOperator] || conditionOperator} {conditionValue}{conditionOperator === 'between' && conditionValue2 ? ` and ${conditionValue2}` : ''} {selectedVariable.unit}"
                    </div>
                  )}

                  <Button onClick={addCondition} disabled={!conditionValue.trim() || (conditionOperator === 'between' && !conditionValue2.trim())} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add This Assumption
                  </Button>
                </div>
              )}

              {showCustomVariable && (
                <div className="p-4 bg-slate-50 dark:bg-[#141B45]/50 space-y-3 border border-dashed border-slate-300 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-sm font-semibold">Custom Variable</Label>
                    <Button variant="ghost" size="sm" onClick={() => setShowCustomVariable(false)}>
                      <ArrowLeft className="h-3 w-3 mr-1" /> Back to presets
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Variable Name *</Label>
                      <Input placeholder="e.g., Oil Price, Attrition Rate" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Category</Label>
                      <Select value={customCategory} onValueChange={(v: any) => setCustomCategory(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market</SelectItem>
                          <SelectItem value="operational">Operational</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="regulatory">Regulatory</SelectItem>
                          <SelectItem value="environmental">Environmental</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Behavior</Label>
                      <Select value={conditionOperator || 'changes_to'} onValueChange={setConditionOperator}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="changes_to">changes to</SelectItem>
                          <SelectItem value="increases_by">increases by</SelectItem>
                          <SelectItem value="decreases_by">decreases by</SelectItem>
                          <SelectItem value="greater">is greater than</SelectItem>
                          <SelectItem value="less">is less than</SelectItem>
                          <SelectItem value="between">is between</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Value *</Label>
                      <Input type="number" placeholder="e.g., 120" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)} />
                    </div>
                    {(conditionOperator || 'changes_to') === 'between' ? (
                      <div>
                        <Label className="text-xs">Max Value *</Label>
                        <Input type="number" placeholder="e.g., 200" value={conditionValue2} onChange={(e) => setConditionValue2(e.target.value)} />
                      </div>
                    ) : (
                      <div>
                        <Label className="text-xs">Unit</Label>
                        <Input placeholder="e.g., $/barrel, %" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} />
                      </div>
                    )}
                  </div>
                  {(conditionOperator || 'changes_to') === 'between' && (
                    <div>
                      <Label className="text-xs">Unit</Label>
                      <Input placeholder="e.g., $/barrel, %" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} />
                    </div>
                  )}
                  <Button onClick={addCondition} disabled={!customLabel.trim() || !conditionValue.trim() || ((conditionOperator || 'changes_to') === 'between' && !conditionValue2.trim())} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add This Assumption
                  </Button>
                </div>
              )}

              {conditions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Scenario Assumptions ({conditions.length})</Label>
                  {conditions.map(condition => {
                    const catBadgeColors: Record<string, string> = {
                      market: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
                      operational: 'bg-navy-100 text-[#2B8A6E] dark:bg-navy-900/30 dark:text-navy-300',
                      financial: 'bg-amber-100 text-[#C9A84C] dark:bg-amber-900/30 dark:text-amber-300',
                      regulatory: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300',
                      environmental: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
                    };
                    return (
                      <div key={condition.id} className="flex items-center justify-between p-3 bg-navy-50 dark:bg-navy-900/20 border border-navy-200 dark:border-navy-800">
                        <div className="text-sm flex-1">
                          <Badge className={`mb-1 text-[10px] border-0 ${catBadgeColors[condition.category] || ''}`}>{condition.category}</Badge>
                          <div className="text-slate-800 dark:text-white">
                            <span className="font-medium">{condition.label}</span>
                            <span className="text-gray-700"> {operatorLabels[condition.operator] || condition.operator} </span>
                            <span className="font-semibold">{condition.value}</span>
                            {condition.value2 && <span className="font-semibold"> and {condition.value2}</span>}
                            {condition.unit && <span className="text-gray-700 ml-1">{condition.unit}</span>}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeCondition(condition.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {wizardStep === 3 && (() => {
        const commonDepartments = ['IT & Security', 'Operations', 'Finance', 'Legal & Compliance', 'HR', 'Executive Leadership', 'Sales', 'Marketing', 'Engineering', 'Supply Chain', 'Customer Support', 'Risk Management'];
        const toggleDepartment = (dept: string) => {
          const current = impactAssessment.operational.affectedDepartments;
          const updated = current.includes(dept) ? current.filter(d => d !== dept) : [...current, dept];
          setImpactAssessment({ ...impactAssessment, operational: { ...impactAssessment.operational, affectedDepartments: updated } });
        };
        const resourcePresets: { name: string; type: 'personnel' | 'budget' | 'technology' | 'external' }[] = [
          { name: 'Incident Response Team', type: 'personnel' },
          { name: 'External Legal Counsel', type: 'external' },
          { name: 'Crisis Communications Firm', type: 'external' },
          { name: 'Emergency Budget Reserve', type: 'budget' },
          { name: 'Security Operations Center', type: 'technology' },
          { name: 'Project Management Office', type: 'personnel' },
        ];
        const addPresetResource = (preset: typeof resourcePresets[0]) => {
          if (resources.some(r => r.name === preset.name)) return;
          setResources([...resources, { id: `res_${Date.now()}`, type: preset.type, name: preset.name, quantity: 1, estimatedCost: 0, availability: 'available' }]);
        };
        const stakeholderPresets = [
          { name: 'CEO / Managing Director', role: 'Executive Sponsor', priority: 'high' as const },
          { name: 'CFO', role: 'Budget Authority', priority: 'high' as const },
          { name: 'CISO / CTO', role: 'Technical Lead', priority: 'high' as const },
          { name: 'General Counsel', role: 'Legal Oversight', priority: 'high' as const },
          { name: 'VP of Operations', role: 'Operational Lead', priority: 'medium' as const },
          { name: 'Head of Communications', role: 'External Messaging', priority: 'medium' as const },
        ];
        const addPresetStakeholder = (preset: typeof stakeholderPresets[0]) => {
          if (stakeholders.some(s => s.name === preset.name)) return;
          setStakeholders([...stakeholders, { id: `stake_${Date.now()}`, name: preset.name, role: preset.role, priority: preset.priority, communicationChannel: 'email' }]);
        };
        return (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-5 w-5 text-teal-500" />
                  Financial & Operational Impact
                </CardTitle>
                <CardDescription className="text-xs">Optional - adds depth to your analysis and increases confidence score.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Estimated Cost ($)</Label>
                  <Input type="number" placeholder="500000" value={impactAssessment.financial.estimatedCost || ''} onChange={(e) => setImpactAssessment({ ...impactAssessment, financial: { ...impactAssessment.financial, estimatedCost: parseFloat(e.target.value) || 0 } })} />
                </div>
                <div>
                  <Label className="text-xs">Revenue Impact ($)</Label>
                  <Input type="number" placeholder="100000" value={impactAssessment.financial.revenueImpact || ''} onChange={(e) => setImpactAssessment({ ...impactAssessment, financial: { ...impactAssessment.financial, revenueImpact: parseFloat(e.target.value) || 0 } })} />
                </div>
                <div>
                  <Label className="text-xs mb-2 block">Affected Departments</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {commonDepartments.map(dept => {
                      const isSelected = impactAssessment.operational.affectedDepartments.includes(dept);
                      return (
                        <button
                          key={dept}
                          onClick={() => toggleDepartment(dept)}
                          className={`px-2.5 py-1 text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-[#0A0F2E] text-white'
                              : 'bg-slate-100 dark:bg-[#141B45] text-gray-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#141B45]'
                          }`}
                        >
                          {isSelected && <span className="mr-1">✓</span>}
                          {dept}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Reputational Risk</Label>
                  <Select value={impactAssessment.reputational.riskLevel} onValueChange={(value: any) => setImpactAssessment({ ...impactAssessment, reputational: { ...impactAssessment.reputational, riskLevel: value } })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Package className="h-5 w-5 text-amber-500" />
                    Resources Needed
                  </CardTitle>
                  <CardDescription className="text-xs">Optional - tap common resources or add your own.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {resourcePresets.filter(p => !resources.some(r => r.name === p.name)).map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => addPresetResource(preset)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-[#C9A84C] dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all"
                      >
                        <Plus className="h-3 w-3" /> {preset.name}
                      </button>
                    ))}
                  </div>
                  {resources.map((resource) => (
                    <div key={resource.id} className="p-3 bg-slate-50 dark:bg-[#141B45] rounded border space-y-2">
                      <div className="flex items-center justify-between">
                        <Select value={resource.type} onValueChange={(value: any) => updateResource(resource.id, 'type', value)}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personnel">Personnel</SelectItem>
                            <SelectItem value="budget">Budget</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" onClick={() => removeResource(resource.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                      <Input placeholder="Resource name" value={resource.name} onChange={(e) => updateResource(resource.id, 'name', e.target.value)} />
                    </div>
                  ))}
                  <Button onClick={addResource} variant="outline" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Custom Resource
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserCheck className="h-5 w-5 text-[#2B8A6E]" />
                    Key Stakeholders
                  </CardTitle>
                  <CardDescription className="text-xs">Optional - tap common roles or add your own.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {stakeholderPresets.filter(p => !stakeholders.some(s => s.name === p.name)).map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => addPresetStakeholder(preset)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-navy-50 dark:bg-navy-900/20 text-[#2B8A6E] dark:text-navy-300 border border-navy-200 dark:border-navy-800 hover:bg-navy-100 dark:hover:bg-navy-900/40 transition-all"
                      >
                        <Plus className="h-3 w-3" /> {preset.name}
                      </button>
                    ))}
                  </div>
                  {stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="p-3 bg-slate-50 dark:bg-[#141B45] rounded border space-y-2">
                      <div className="flex items-center gap-2">
                        <Input placeholder="Name" value={stakeholder.name} onChange={(e) => updateStakeholder(stakeholder.id, 'name', e.target.value)} className="flex-1" />
                        <Button variant="ghost" size="sm" onClick={() => removeStakeholder(stakeholder.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Role" value={stakeholder.role} onChange={(e) => updateStakeholder(stakeholder.id, 'role', e.target.value)} />
                        <Select value={stakeholder.priority} onValueChange={(value: any) => updateStakeholder(stakeholder.id, 'priority', value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addStakeholder} variant="outline" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Custom Stakeholder
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        );
      })()}

      {wizardStep === 4 && analysisResult && (() => {
        const impactLevel = analysisResult.impactScore >= 70 ? 'high' : analysisResult.impactScore >= 40 ? 'moderate' : 'low';
        const impactConfig = {
          high: { label: 'High Impact Scenario', color: 'text-red-700', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: AlertTriangle, iconColor: 'text-red-700' },
          moderate: { label: 'Moderate Impact Scenario', color: 'text-[#C9A84C]', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: AlertTriangle, iconColor: 'text-[#C9A84C]' },
          low: { label: 'Low Impact Scenario', color: 'text-teal-700', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800', icon: CheckCircle2, iconColor: 'text-teal-700' },
        }[impactLevel];
        const ImpactIcon = impactConfig.icon;
        const industryHrs = Math.round(analysisResult.decisionVelocityMetrics.industryAverage / 60);
        return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">

          <Card className={`${impactConfig.border} ${impactConfig.bg} border-2`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 ${impactConfig.bg} flex-shrink-0`}>
                  <ImpactIcon className={`h-7 w-7 ${impactConfig.iconColor}`} />
                </div>
                <div className="flex-1">
                  <Badge className={`mb-2 ${impactLevel === 'high' ? 'bg-red-600' : impactLevel === 'moderate' ? 'bg-amber-600' : 'bg-teal-600'} text-white`}>
                    {impactConfig.label} — Score: {analysisResult.impactScore}/100
                  </Badge>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                    {analysisResult.triggeredAlerts.length} alert{analysisResult.triggeredAlerts.length !== 1 ? 's' : ''} detected, {analysisResult.recommendedPlaybooks.length} Readiness Protocol{analysisResult.recommendedPlaybooks.length !== 1 ? 's' : ''} ready to activate
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-slate-300">
                    If this scenario occurs, Readiness OS would coordinate your response in <strong>{analysisResult.decisionVelocityMetrics.ourTime} minutes</strong> — {analysisResult.decisionVelocityMetrics.percentageFaster}% faster than the industry average of {industryHrs} hours. {analysisResult.teamsInvolved.length} teams would be mobilized simultaneously.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <ScenarioVarianceAlert analysisResult={analysisResult} />

          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#2B8A6E]" />
                  Your Speed vs. Industry
                </CardTitle>
                <CardDescription>Time from trigger detection to full coordination</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-teal-600">With Readiness OS</span>
                      <span className="text-sm font-bold text-teal-600">{analysisResult.decisionVelocityMetrics.ourTime} min</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-[#141B45] h-3">
                      <div className="bg-teal-500 h-3" style={{ width: `${Math.max(5, (analysisResult.decisionVelocityMetrics.ourTime / analysisResult.decisionVelocityMetrics.industryAverage) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-800">Industry Average</span>
                      <span className="text-sm font-bold text-gray-800">{industryHrs} hours</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-[#141B45] h-3">
                      <div className="bg-slate-300 dark:bg-[#6B7280] h-3 w-full" />
                    </div>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-3 text-center">
                    <span className="text-2xl font-bold text-teal-600">{analysisResult.decisionVelocityMetrics.percentageFaster}%</span>
                    <span className="text-sm text-teal-600 ml-1">faster response</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  What Gets Triggered
                </CardTitle>
                <CardDescription>Alerts that fire when this scenario is detected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResult.triggeredAlerts.map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#141B45]">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-[#2B8A6E]'}`} />
                        <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{alert.name}</span>
                      </div>
                      <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">{alert.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-teal-200 dark:border-teal-800 bg-gradient-to-br from-[#2B8A6E]/50 to-white dark:from-[#2B8A6E]/10 dark:to-[#0A0F2E]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5 text-teal-600" />
                What Readiness OS Would Do
              </CardTitle>
              <CardDescription>The Readiness Protocols and teams that activate automatically when this scenario triggers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Readiness Protocols That Activate</div>
                <div className="space-y-2">
                  {analysisResult.recommendedPlaybooks.map((playbook, idx) => (
                    <div key={playbook.id} className="flex items-center gap-3 p-3 bg-white dark:bg-[#141B45] border border-teal-100 dark:border-teal-900/30">
                      <div className="w-7 h-7 bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-teal-600">{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 dark:text-white">{playbook.name}</div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-700 flex items-center gap-1"><Clock className="h-3 w-3" /> {playbook.executionTime} min</span>
                          {playbook.automationCoverage && (
                            <span className="text-xs text-teal-600 flex items-center gap-1"><Zap className="h-3 w-3" /> {playbook.automationCoverage}% automated</span>
                          )}
                        </div>
                      </div>
                      <Badge className={`${playbook.readinessState === 'teal' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' : 'bg-amber-100 text-[#C9A84C] dark:bg-amber-900/30 dark:text-amber-400'} text-[10px]`}>
                        {playbook.readinessState === 'teal' ? 'Ready' : 'Setup Needed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Teams Mobilized Simultaneously</div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.teamsInvolved.map((team, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#141B45] border border-slate-200 dark:border-slate-700">
                      <Users className="h-3 w-3 text-[#C9A84C]" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{team.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Orchestration Steps</div>
                <div className="grid sm:grid-cols-4 gap-3">
                  {[
                    { time: '0:00', label: 'Trigger Detected', desc: 'AI agents identify the scenario pattern', icon: Target },
                    { time: '0:30', label: 'Readiness Protocols Matched', desc: `${analysisResult.recommendedPlaybooks.length} Readiness Protocol${analysisResult.recommendedPlaybooks.length !== 1 ? 's' : ''} auto-selected`, icon: Rocket },
                    { time: '1:00', label: 'Teams Notified', desc: `${analysisResult.teamsInvolved.length} teams receive role-specific instructions`, icon: Users },
                    { time: `${analysisResult.decisionVelocityMetrics.ourTime}:00`, label: 'Fully Coordinated', desc: 'Tasks assigned, budgets released, execution underway', icon: CheckCircle2 },
                  ].map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={i} className="relative text-center">
                        {i > 0 && <div className="absolute left-0 top-5 -translate-x-1/2 w-full h-px bg-teal-200 dark:bg-teal-800 hidden sm:block" style={{ left: '-50%', width: '100%' }} />}
                        <div className="relative z-10 w-10 h-10 flex items-center justify-center mx-auto mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: '#2B8A6E' }}>
                          {i + 1}
                        </div>
                        <div className="text-xs font-bold text-teal-600 mb-0.5">{step.time}</div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-white">{step.label}</div>
                        <div className="text-[10px] text-gray-700 mt-0.5">{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#2B8A6E]" />
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">Analysis Confidence</span>
                </div>
                <Badge variant="outline" className="text-[#2B8A6E]">{analysisResult.confidenceLevel}%</Badge>
              </div>
              <div className="w-full bg-slate-200 dark:bg-[#141B45] h-2">
                <div className="bg-[#0A0F2E] h-2 transition-all" style={{ width: `${analysisResult.confidenceLevel}%` }} />
              </div>
              <p className="text-xs text-gray-700 mt-1.5">
                {analysisResult.confidenceLevel < 60
                  ? 'Go back and add financial impact, resources, or stakeholders to increase confidence and get more precise results.'
                  : analysisResult.confidenceLevel < 80
                  ? 'Good baseline. Adding more resources or stakeholders would sharpen the analysis further.'
                  : 'Strong confidence level. This analysis is well-supported by the data you provided.'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-navy-200 dark:border-navy-800">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={saveScenario} className="flex-1 min-w-[140px]">
                  <Save className="h-4 w-4 mr-2" /> Save This Analysis
                </Button>
                <Button onClick={saveAsTemplate} variant="outline" className="flex-1 min-w-[140px]">
                  <FileText className="h-4 w-4 mr-2" /> Save as Reusable Template
                </Button>
              </div>
              <p className="text-xs text-gray-700 text-center mt-2">Saved analyses appear in your scenario library and can be re-run anytime</p>
            </CardContent>
          </Card>
        </div>
        );
      })()}

      {wizardStep < totalSteps && (
        <div className="max-w-2xl mx-auto flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={() => setWizardStep(Math.max(1, wizardStep - 1))} disabled={wizardStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          {wizardStep === 3 ? (
            <Button onClick={runAnalysis} disabled={isAnalyzing || conditions.length === 0} className="bg-gradient-to-r from-gold-600 to-navy-600 hover:from-gold-700 hover:to-navy-700">
              {isAnalyzing ? <><Activity className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</> : <><Play className="h-4 w-4 mr-2" /> Run Analysis</>}
            </Button>
          ) : (
            <Button onClick={() => setWizardStep(wizardStep + 1)} disabled={!canAdvance()}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function WhatIfAnalyzer() {
  const [viewMode, setViewMode] = useState<ViewMode>('choose');

  const { data: savedScenariosRaw } = useQuery<any[]>({ queryKey: ['/api/what-if-scenarios'] });
  const savedScenarios = Array.isArray(savedScenariosRaw) ? savedScenariosRaw : [];

  return (
    <PageLayout>
      <div className="flex-1 page-background overflow-auto bg-gradient-to-br from-slate-50 to-navy-50 dark:from-[#0A0F2E] dark:to-[#141B45] p-6 sm:p-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {viewMode === 'choose' && (
            <>
              <div className="text-center max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-gold-500 to-navy-600">
                    <FlaskConical className="h-7 w-7 text-gray-900" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-navy-600 bg-clip-text text-transparent">
                        What-If Analyzer
                      </h1>
                      <OnboardingTrigger pageId="what-if-analyzer" autoStart={true} />
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-slate-400 text-lg">
                  Test any strategic scenario before it happens. See how your organization would respond,
                  which Readiness Protocols activate, and how fast you'd coordinate.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <button
                  onClick={() => setViewMode('quick')}
                  className="group text-left p-6 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141B45]/50 hover:border-navy-400 dark:hover:border-navy-500 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-navy-100 dark:bg-navy-900/30 group-hover:bg-navy-200 dark:group-hover:bg-navy-900/50 transition-colors">
                      <Sparkles className="h-6 w-6 text-[#2B8A6E]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick Analysis</h3>
                      <Badge className="bg-navy-100 text-[#2B8A6E] dark:bg-navy-900/30 dark:text-navy-300 text-[10px]">RECOMMENDED FOR FIRST TIME</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-slate-400 mb-4">
                    Describe a "what if" scenario in plain language and get an instant Signal-based impact assessment
                    with a go/no-go recommendation.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />
                      <span>Type a scenario in plain English</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />
                      <span>AI analyzes timing impact and risks</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />
                      <span>Get a clear recommendation in seconds</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-[#2B8A6E] group-hover:gap-2 transition-all">
                    Start Quick Analysis <ArrowRight className="h-4 w-4" />
                  </div>
                </button>

                <button
                  onClick={() => setViewMode('builder')}
                  className="group text-left p-6 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141B45]/50 hover:border-gold-400 dark:hover:border-gold-500 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gold-100 dark:bg-gold-900/30 group-hover:bg-gold-200 dark:group-hover:bg-gold-900/50 transition-colors">
                      <Layers className="h-6 w-6 text-[#C9A84C]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Deep Scenario Builder</h3>
                      <Badge className="bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300 text-[10px]">DETAILED MODELING</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-slate-400 mb-4">
                    Build a thorough scenario model with measurable conditions, impact assessment, resources,
                    and stakeholders. Save and reuse as templates.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />
                      <span>Guided 4-step wizard walks you through</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />
                      <span>See which Readiness Protocols and teams activate</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />
                      <span>Save scenarios and create reusable templates</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-[#C9A84C] group-hover:gap-2 transition-all">
                    Open Scenario Builder <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              </div>

              {savedScenarios.length > 0 && (
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Save className="h-4 w-4" /> Your Saved Scenarios ({savedScenarios.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedScenarios.slice(0, 6).map((scenario: any) => (
                      <Card key={scenario.id} className=" ">
                        <CardContent className="p-4">
                          <div className="font-medium text-sm text-slate-800 dark:text-white mb-1">{scenario.name}</div>
                          <div className="text-xs text-gray-700 line-clamp-2 mb-2">{scenario.description}</div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-800">Impact: <span className="font-semibold text-orange-600">{scenario.impactScore || 'N/A'}</span></span>
                            <span className="text-gray-800">{scenario.projectedExecutionTime || 0} min</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {viewMode === 'quick' && (
            <QuickAnalysis onBack={() => setViewMode('choose')} onSwitchToBuilder={() => setViewMode('builder')} />
          )}

          {viewMode === 'builder' && (
            <ScenarioBuilder onBack={() => setViewMode('choose')} />
          )}

        </div>
      </div>
    </PageLayout>
  );
}
