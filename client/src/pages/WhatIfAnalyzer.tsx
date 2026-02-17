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
    label: 'OFFENSE',
    color: 'emerald',
    icon: Rocket,
    scenarios: [
      "What if we accelerate the market entry timeline from 6 months to 6 weeks?",
      "What if a competitor launches in our target market before us?",
      "What if we require dual board approval for M&A deals over $50M?",
    ],
  },
  defense: {
    label: 'DEFENSE',
    color: 'red',
    icon: Shield,
    scenarios: [
      "What if the CISO is unavailable during a ransomware attack?",
      "What if a regulatory deadline changes from 90 days to 30 days?",
      "What if we add mandatory legal review before all external crisis communications?",
    ],
  },
  special_teams: {
    label: 'SPECIAL TEAMS',
    color: 'purple',
    icon: Settings,
    scenarios: [
      "What if the digital transformation timeline is cut by 50%?",
      "What if we need to integrate an acquired company's AI systems within 60 days?",
      "What if we require AI ethics review for every new model deployment?",
    ],
  },
};

const domainStyleMap: Record<string, { border: string; bg: string; text: string; iconText: string; btnClass: string }> = {
  all: { border: 'border-teal-200 dark:border-teal-800', bg: 'bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-slate-900', text: 'text-teal-600', iconText: 'text-teal-600', btnClass: 'bg-teal-600 hover:bg-teal-700 text-white' },
  offense: { border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900', text: 'text-emerald-600', iconText: 'text-emerald-600', btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  defense: { border: 'border-red-200 dark:border-red-800', bg: 'bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-slate-900', text: 'text-red-600', iconText: 'text-red-600', btnClass: 'bg-red-600 hover:bg-red-700 text-white' },
  special_teams: { border: 'border-purple-200 dark:border-purple-800', bg: 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900', text: 'text-purple-600', iconText: 'text-purple-600', btnClass: 'bg-purple-600 hover:bg-purple-700 text-white' },
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
          playbook: { name: `${domainLabel} Response Playbook`, tasks: Array(8).fill(null), stakeholders: Array(6).fill(null) },
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
      <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 -ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to options
      </Button>

      <div className="text-center max-w-2xl mx-auto mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Quick What-If Analysis</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Describe a scenario in plain language and get an instant AI-powered impact assessment.
          See how long it would take to respond, what risks are involved, and whether to proceed.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {[
          { key: 'all', label: 'All Domains', icon: Sparkles, borderColor: 'border-teal-500', textColor: 'text-teal-700 dark:text-teal-300', bgColor: 'bg-teal-50 dark:bg-teal-900/20' },
          { key: 'offense', label: 'OFFENSE', icon: Rocket, borderColor: 'border-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-300', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { key: 'defense', label: 'DEFENSE', icon: Shield, borderColor: 'border-red-500', textColor: 'text-red-700 dark:text-red-300', bgColor: 'bg-red-50 dark:bg-red-900/20' },
          { key: 'special_teams', label: 'SPECIAL TEAMS', icon: Settings, borderColor: 'border-purple-500', textColor: 'text-purple-700 dark:text-purple-300', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(({ key, label, icon: Icon, borderColor, textColor, bgColor }) => (
          <Button
            key={key}
            variant={selectedDomain === key ? 'default' : 'outline'}
            size="sm"
            className={selectedDomain === key ? `${bgColor} ${textColor} border-2 ${borderColor}` : ''}
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
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block">
              Pick a sample scenario or type your own:
            </Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {allScenarios.map((s, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className={`text-xs transition-all ${scenario === s ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/30' : ''}`}
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

      {result && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="text-center">
            <Badge className="bg-blue-600 text-white px-4 py-1 text-sm">Analysis Complete</Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
              <CardContent className="p-5 text-center">
                <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">Original Response Time</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{result.original_time}</div>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
              <CardContent className="p-5 text-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-1">With This Change</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{result.modified_time}</div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
              <CardContent className="p-5 text-center">
                <TrendingUp className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">Net Impact</div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{result.impact}</div>
              </CardContent>
            </Card>
          </div>

          <Card className={`${
            result.recommendation?.includes('Not recommended') 
              ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10'
              : result.recommendation?.includes('Conditionally')
              ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10'
              : 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
          }`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                {result.recommendation?.includes('Not recommended') ? (
                  <XCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                ) : result.recommendation?.includes('Conditionally') ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold text-slate-800 dark:text-white text-lg mb-1">Recommendation</div>
                  <p className="text-slate-600 dark:text-slate-300">{result.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.risk_assessment && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white text-lg mb-1">Risk Assessment</div>
                    <p className="text-slate-600 dark:text-slate-300">{result.risk_assessment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Want to model this scenario in more detail?</p>
            <Button variant="outline" onClick={onSwitchToBuilder}>
              <Layers className="h-4 w-4 mr-2" /> Open in Deep Scenario Builder
            </Button>
          </div>
        </div>
      )}
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

  const { data: organizations = [] } = useQuery<any[]>({ queryKey: ['/api/organizations'] });
  const organizationId = organizations[0]?.id || '95b97862-8e9d-4c4c-8609-7d8f37b68d36';
  const { data: triggers = [] } = useQuery<any[]>({ queryKey: ['/api/executive-triggers'] });
  const { data: playbooks = [] } = useQuery<any[]>({ queryKey: ['/api/scenarios'] });
  const { data: scenarioTemplates = [] } = useQuery<any[]>({ queryKey: ['/api/scenario-templates'] });

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
                  executionTime: playbook.averageExecutionTime || 12, readinessState: playbook.readinessState || 'green',
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
            playbooks: [{ name: 'Market Entry Acceleration', time: 10, coverage: 78 }, { name: 'Competitive Response Framework', time: 14, coverage: 72 }, { name: 'Go-to-Market Sprint Playbook', time: 8, coverage: 85 }],
            teams: ['Strategy & Growth', 'Executive Leadership', 'Sales Operations', 'Product Management'],
          },
          operational: {
            alerts: [{ name: `${scenarioLabel} - Operational Risk`, severity: 'high' }, { name: 'Supply Chain Disruption Alert', severity: 'medium' }, { name: 'Quality Assurance Warning', severity: 'low' }],
            playbooks: [{ name: 'Operational Continuity Plan', time: 11, coverage: 75 }, { name: 'Stakeholder Communication Protocol', time: 6, coverage: 80 }],
            teams: ['Operations Center', 'Executive Leadership', 'Quality Assurance', 'Supply Chain Management'],
          },
          strategic: {
            alerts: [{ name: `${scenarioLabel} - Strategic Trigger`, severity: 'high' }, { name: 'Integration Readiness Alert', severity: 'medium' }],
            playbooks: [{ name: 'M&A Integration Playbook', time: 14, coverage: 70 }, { name: 'Cultural Alignment Framework', time: 10, coverage: 68 }, { name: 'Systems Consolidation Sprint', time: 12, coverage: 74 }],
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
        demo.playbooks.forEach((p, i) => recommendedPlaybooksList.push({ id: `demo-pb-${i}`, name: p.name, executionTime: p.time, readinessState: 'green', automationCoverage: p.coverage }));
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
      toast({ title: "Analysis Complete", description: `Found ${triggeredAlerts.length} triggers and ${recommendedPlaybooksList.length} recommended playbooks` });
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
      <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 -ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to options
      </Button>

      <div className="text-center max-w-2xl mx-auto mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Deep Scenario Builder</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Build a detailed scenario model step by step. Define conditions, assess impact, and see exactly which
          playbooks and teams would activate.
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
                <div className={`w-8 sm:w-12 h-0.5 ${isComplete ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
              <button
                onClick={() => { if (isComplete) setWizardStep(step); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-md' :
                  isComplete ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50' :
                  'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
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
                  { key: 'market-entry', label: 'Market Entry', icon: TrendingUp, domain: 'OFFENSE', color: 'emerald' },
                  { key: 'ma-integration', label: 'M&A Integration', icon: Building2, domain: 'OFFENSE', color: 'emerald' },
                  { key: 'product-recall', label: 'Product Recall', icon: AlertTriangle, domain: 'DEFENSE', color: 'red' },
                  { key: 'cyber-incident', label: 'Cyber Incident', icon: Shield, domain: 'DEFENSE', color: 'red' },
                  { key: 'digital-transform', label: 'Digital Transform', icon: Zap, domain: 'SPECIAL TEAMS', color: 'purple' },
                  { key: 'ai-governance', label: 'AI Governance', icon: FileText, domain: 'SPECIAL TEAMS', color: 'purple' },
                ].map(({ key, label, icon: Icon, domain, color }) => {
                  const isActive = analysisName === { 'market-entry': 'Market Entry Analysis', 'ma-integration': 'M&A Integration', 'product-recall': 'Product Recall Scenario', 'cyber-incident': 'Cybersecurity Incident', 'digital-transform': 'Digital Transformation Sprint', 'ai-governance': 'AI Governance Framework' }[key];
                  const borderMap: Record<string, string> = { emerald: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20', red: 'border-red-400 bg-red-50 dark:bg-red-900/20', purple: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' };
                  const iconBg: Record<string, string> = { emerald: 'bg-emerald-100 dark:bg-emerald-900/30', red: 'bg-red-100 dark:bg-red-900/30', purple: 'bg-purple-100 dark:bg-purple-900/30' };
                  const iconColor: Record<string, string> = { emerald: 'text-emerald-600', red: 'text-red-600', purple: 'text-purple-600' };
                  const domainColor: Record<string, string> = { emerald: 'text-emerald-600 dark:text-emerald-400', red: 'text-red-600 dark:text-red-400', purple: 'text-purple-600 dark:text-purple-400' };
                  return (
                    <button
                      key={key}
                      onClick={() => loadTemplate(key)}
                      className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${isActive ? borderMap[color] : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                      <div className={`p-1.5 ${iconBg[color]} rounded-md inline-block mb-1.5`}>
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
                  <Label className="text-xs text-slate-500 mb-1 block">Or load from your saved templates:</Label>
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
                <Target className="h-5 w-5 text-blue-500" />
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
                              market: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
                              operational: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
                              financial: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
                              regulatory: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
                              environmental: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
                            };
                            const colors = catColors[variable.category] || catColors.market;
                            return (
                              <button
                                key={variable.id}
                                onClick={() => handleSelectVariable(variable.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg} text-left transition-all hover:shadow-md hover:scale-[1.01]`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-800 dark:text-white">{variable.label}</div>
                                  <div className={`text-xs ${colors.text}`}>{variable.category} · {variable.unit}</div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                        {hasMore && (
                          <div className="text-center mt-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400" onClick={() => setShowAllVariables(true)}>
                              Show {available.length - 8} more variables
                            </Button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                  <div className="mt-3 text-center">
                    <Button variant="ghost" size="sm" className="text-slate-500" onClick={() => setShowCustomVariable(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Add a custom variable
                    </Button>
                  </div>
                </div>
              )}

              {selectedVariableId && selectedVariable && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg space-y-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedVariable.label}</div>
                      <div className="text-xs text-slate-500">{selectedVariable.category} variable · measured in {selectedVariable.unit}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedVariableId(''); setConditionValue(''); setConditionValue2(''); }}>
                      <ArrowLeft className="h-3 w-3 mr-1" /> Change
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
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
                        <span className="text-slate-400">and</span>
                        <Input
                          type="number"
                          placeholder="max"
                          value={conditionValue2}
                          onChange={(e) => setConditionValue2(e.target.value)}
                          className="w-28 h-8 text-sm"
                        />
                      </>
                    )}
                    <span className="text-slate-500 text-xs whitespace-nowrap">{selectedVariable.unit}</span>
                  </div>

                  {conditionValue && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 italic pl-1">
                      Preview: "{selectedVariable.label} {operatorLabels[conditionOperator] || conditionOperator} {conditionValue}{conditionOperator === 'between' && conditionValue2 ? ` and ${conditionValue2}` : ''} {selectedVariable.unit}"
                    </div>
                  )}

                  <Button onClick={addCondition} disabled={!conditionValue.trim() || (conditionOperator === 'between' && !conditionValue2.trim())} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add This Assumption
                  </Button>
                </div>
              )}

              {showCustomVariable && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-3 border border-dashed border-slate-300 dark:border-slate-600">
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
                      market: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                      operational: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                      financial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
                      regulatory: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
                      environmental: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
                    };
                    return (
                      <div key={condition.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-sm flex-1">
                          <Badge className={`mb-1 text-[10px] border-0 ${catBadgeColors[condition.category] || ''}`}>{condition.category}</Badge>
                          <div className="text-slate-800 dark:text-white">
                            <span className="font-medium">{condition.label}</span>
                            <span className="text-slate-500"> {operatorLabels[condition.operator] || condition.operator} </span>
                            <span className="font-semibold">{condition.value}</span>
                            {condition.value2 && <span className="font-semibold"> and {condition.value2}</span>}
                            {condition.unit && <span className="text-slate-500 ml-1">{condition.unit}</span>}
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
                  <DollarSign className="h-5 w-5 text-green-500" />
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
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all"
                      >
                        <Plus className="h-3 w-3" /> {preset.name}
                      </button>
                    ))}
                  </div>
                  {resources.map((resource) => (
                    <div key={resource.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded border space-y-2">
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
                    <UserCheck className="h-5 w-5 text-blue-500" />
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
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
                      >
                        <Plus className="h-3 w-3" /> {preset.name}
                      </button>
                    ))}
                  </div>
                  {stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded border space-y-2">
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

      {wizardStep === 4 && analysisResult && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={saveScenario} className="flex-1 min-w-[140px]">
                  <Save className="h-4 w-4 mr-2" /> Save Analysis
                </Button>
                <Button onClick={saveAsTemplate} variant="outline" className="flex-1 min-w-[140px]">
                  <FileText className="h-4 w-4 mr-2" /> Save as Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <ScenarioVarianceAlert analysisResult={analysisResult} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-blue-600">{analysisResult.decisionVelocityMetrics.ourTime} min</div>
                <div className="text-xs text-blue-600/70 font-medium">Your Response</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/30 dark:to-slate-700/10 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4 text-center">
                <Activity className="h-5 w-5 text-slate-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-slate-500">{Math.round(analysisResult.decisionVelocityMetrics.industryAverage / 60)} hrs</div>
                <div className="text-xs text-slate-500/70 font-medium">Industry Avg</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-green-600">{analysisResult.decisionVelocityMetrics.percentageFaster}%</div>
                <div className="text-xs text-green-600/70 font-medium">Faster</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-orange-600">{analysisResult.impactScore}/100</div>
                <div className="text-xs text-orange-600/70 font-medium">Impact Score</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Triggered Alerts ({analysisResult.triggeredAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.triggeredAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-sm">{alert.name}</span>
                    </div>
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>{alert.severity}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-600" />
                Recommended Playbooks ({analysisResult.recommendedPlaybooks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.recommendedPlaybooks.map(playbook => (
                  <div key={playbook.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{playbook.name}</span>
                      <Badge variant={playbook.readinessState === 'green' ? 'default' : 'secondary'} className={playbook.readinessState === 'green' ? 'bg-green-600' : ''}>{playbook.readinessState}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{playbook.executionTime} min</span>
                      {playbook.automationCoverage && <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{playbook.automationCoverage}% automated</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Teams Mobilized ({analysisResult.teamsInvolved.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysisResult.teamsInvolved.map((team, idx) => (
                  <Badge key={idx} variant="outline" className="text-purple-600 border-purple-300">{team.name}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-sm">Analysis Confidence</span>
                </div>
                <Badge variant="outline" className="text-blue-600">{analysisResult.confidenceLevel}%</Badge>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${analysisResult.confidenceLevel}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-1">Add more detail (impact, resources, stakeholders) to increase confidence.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {wizardStep < totalSteps && (
        <div className="max-w-2xl mx-auto flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={() => setWizardStep(Math.max(1, wizardStep - 1))} disabled={wizardStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          {wizardStep === 3 ? (
            <Button onClick={runAnalysis} disabled={isAnalyzing || conditions.length === 0} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
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

  const { data: savedScenarios = [] } = useQuery<any[]>({ queryKey: ['/api/what-if-scenarios'] });

  return (
    <PageLayout>
      <div className="flex-1 page-background overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {viewMode === 'choose' && (
            <>
              <div className="text-center max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                    <FlaskConical className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        What-If Analyzer
                      </h1>
                      <OnboardingTrigger pageId="what-if-analyzer" autoStart={true} />
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                  Test any strategic scenario before it happens. See how your organization would respond,
                  which playbooks activate, and how fast you'd coordinate.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <button
                  onClick={() => setViewMode('quick')}
                  className="group text-left p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Sparkles className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick Analysis</h3>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px]">RECOMMENDED FOR FIRST TIME</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Describe a "what if" scenario in plain language and get an instant AI-powered impact assessment
                    with a go/no-go recommendation.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span>Type a scenario in plain English</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span>AI analyzes timing impact and risks</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span>Get a clear recommendation in seconds</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                    Start Quick Analysis <ArrowRight className="h-4 w-4" />
                  </div>
                </button>

                <button
                  onClick={() => setViewMode('builder')}
                  className="group text-left p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                      <Layers className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Deep Scenario Builder</h3>
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-[10px]">DETAILED MODELING</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Build a thorough scenario model with measurable conditions, impact assessment, resources,
                    and stakeholders. Save and reuse as templates.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span>Guided 4-step wizard walks you through</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span>See which playbooks and teams activate</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span>Save scenarios and create reusable templates</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-purple-600 group-hover:gap-2 transition-all">
                    Open Scenario Builder <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              </div>

              {savedScenarios.length > 0 && (
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Save className="h-4 w-4" /> Your Saved Scenarios ({savedScenarios.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedScenarios.slice(0, 6).map((scenario: any) => (
                      <Card key={scenario.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="font-medium text-sm text-slate-800 dark:text-white mb-1">{scenario.name}</div>
                          <div className="text-xs text-slate-500 line-clamp-2 mb-2">{scenario.description}</div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Impact: <span className="font-semibold text-orange-600">{scenario.impactScore || 'N/A'}</span></span>
                            <span className="text-slate-400">{scenario.projectedExecutionTime || 0} min</span>
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
