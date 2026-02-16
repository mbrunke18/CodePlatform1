import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Copy,
  Download,
  Upload,
  TrendingDown,
  MapPin,
  Calendar,
  UserCheck,
  Package,
  Settings,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import ScenarioVarianceAlert from '@/components/predictive/ScenarioVarianceAlert';

interface TestCondition {
  id: string;
  label: string;
  operator: 'greater' | 'less' | 'equals' | 'between';
  value: number | string;
  value2?: number | string; // For 'between' operator
  unit?: string;
  category: 'market' | 'operational' | 'financial' | 'regulatory' | 'environmental';
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
    downtimeEstimate: number; // hours
  };
  reputational: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    stakeholderConcerns: string[];
  };
  timeline: {
    detectionToResponse: number; // minutes
    fullResolution: number; // hours
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

function AIQuickAnalysis() {
  const [scenario, setScenario] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'all' | 'offense' | 'defense' | 'special_teams'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

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

  const allScenarios = selectedDomain === 'all'
    ? Object.values(domainPresets).flatMap(d => d.scenarios.slice(0, 2))
    : domainPresets[selectedDomain]?.scenarios || [];

  const domainStyles: Record<string, { border: string; bg: string; text: string; iconText: string; btnClass: string }> = {
    all: { border: 'border-teal-200 dark:border-teal-800', bg: 'bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-slate-900', text: 'text-teal-600', iconText: 'text-teal-600', btnClass: 'bg-teal-600 hover:bg-teal-700 text-white' },
    offense: { border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900', text: 'text-emerald-600', iconText: 'text-emerald-600', btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
    defense: { border: 'border-red-200 dark:border-red-800', bg: 'bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-slate-900', text: 'text-red-600', iconText: 'text-red-600', btnClass: 'bg-red-600 hover:bg-red-700 text-white' },
    special_teams: { border: 'border-purple-200 dark:border-purple-800', bg: 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900', text: 'text-purple-600', iconText: 'text-purple-600', btnClass: 'bg-purple-600 hover:bg-purple-700 text-white' },
  };
  const style = domainStyles[selectedDomain] || domainStyles.all;

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
      <div className="flex gap-2 flex-wrap">
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className={`h-5 w-5 ${style.iconText}`} />
            AI-Powered What-If Analysis
          </CardTitle>
          <CardDescription>
            {selectedDomain === 'all'
              ? 'Select a domain or describe any strategic scenario for AI impact analysis.'
              : `Analyze ${domainPresets[selectedDomain]?.label} scenarios — AI will assess impact on execution timing and readiness.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {allScenarios.map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setScenario(s)}
              >
                {s.length > 55 ? s.substring(0, 55) + '...' : s}
              </Button>
            ))}
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
            className={style.btnClass}
          >
            {isAnalyzing ? (
              <><Activity className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
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
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Impact Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <Clock className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <div className="text-sm text-green-600 dark:text-green-400">Original Time</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{result.original_time}</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                <Clock className="h-5 w-5 text-red-600 mx-auto mb-1" />
                <div className="text-sm text-red-600 dark:text-red-400">Modified Time</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{result.modified_time}</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
                <TrendingUp className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <div className="text-sm text-amber-600 dark:text-amber-400">Impact</div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{result.impact}</div>
              </div>
            </div>

            <div className={`rounded-lg p-4 mb-4 ${
              result.recommendation?.includes('Not recommended') 
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : result.recommendation?.includes('Conditionally')
                ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            }`}>
              <div className="flex items-start gap-2">
                {result.recommendation?.includes('Not recommended') ? (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                ) : result.recommendation?.includes('Conditionally') ? (
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">Recommendation</div>
                  <p className="text-slate-600 dark:text-slate-300">{result.recommendation}</p>
                </div>
              </div>
            </div>

            {result.risk_assessment && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-white">Risk Assessment</div>
                    <p className="text-slate-600 dark:text-slate-300">{result.risk_assessment}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function WhatIfAnalyzer() {
  const { toast } = useToast();
  
  // Basic Info
  const [analysisName, setAnalysisName] = useState('');
  const [analysisDescription, setAnalysisDescription] = useState('');
  const [scenarioType, setScenarioType] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  
  // Test Conditions
  const [conditions, setConditions] = useState<TestCondition[]>([]);
  const [newCondition, setNewCondition] = useState<{
    label: string;
    operator: 'greater' | 'less' | 'equals' | 'between';
    value: string;
    value2: string;
    unit: string;
    category: 'market' | 'operational' | 'financial' | 'regulatory' | 'environmental';
  }>({
    label: '',
    operator: 'greater',
    value: '',
    value2: '',
    unit: '',
    category: 'market',
  });

  // Impact Assessment
  const [impactAssessment, setImpactAssessment] = useState<ImpactAssessment>({
    financial: {
      estimatedCost: 0,
      revenueImpact: 0,
      budgetAllocation: 0,
    },
    operational: {
      affectedDepartments: [],
      affectedRegions: [],
      downtimeEstimate: 0,
    },
    reputational: {
      riskLevel: 'medium',
      stakeholderConcerns: [],
    },
    timeline: {
      detectionToResponse: 12,
      fullResolution: 24,
    },
  });

  // Resources & Stakeholders
  const [resources, setResources] = useState<ResourceRequirement[]>([]);
  const [stakeholders, setStakeholders] = useState<StakeholderGroup[]>([]);
  
  // Analysis Results
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Fetch organizations for activity tracking
  const { data: organizations = [] } = useQuery<any[]>({
    queryKey: ['/api/organizations'],
  });
  const organizationId = organizations[0]?.id || '95b97862-8e9d-4c4c-8609-7d8f37b68d36';

  // Fetch available triggers
  const { data: triggers = [] } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  // Fetch available playbooks
  const { data: playbooks = [] } = useQuery<any[]>({
    queryKey: ['/api/scenarios'],
  });

  // Fetch scenario templates
  const { data: scenarioTemplates = [] } = useQuery<any[]>({
    queryKey: ['/api/scenario-templates'],
  });

  // Fetch saved what-if scenarios
  const { data: savedScenarios = [] } = useQuery<any[]>({
    queryKey: ['/api/what-if-scenarios'],
  });

  const loadTemplate = (templateId: string) => {
    const template = scenarioTemplates.find(t => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(templateId);
    setAnalysisName(template.name || '');
    setAnalysisDescription(template.description || '');
    setScenarioType(template.category || '');
    setIndustry(template.industry || '');

    // Load template conditions if available
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

    toast({
      title: "Template Loaded",
      description: `Loaded scenario: ${template.name}`,
    });
  };

  const addCondition = () => {
    if (!newCondition.label || !newCondition.value) {
      toast({
        title: "Missing Information",
        description: "Please provide both a condition label and value",
        variant: "destructive"
      });
      return;
    }

    const condition: TestCondition = {
      id: `cond_${Date.now()}`,
      label: newCondition.label,
      operator: newCondition.operator,
      value: parseFloat(newCondition.value) || newCondition.value,
      value2: newCondition.value2 ? (parseFloat(newCondition.value2) || newCondition.value2) : undefined,
      unit: newCondition.unit,
      category: newCondition.category,
    };

    setConditions([...conditions, condition]);
    setNewCondition({ label: '', operator: 'greater', value: '', value2: '', unit: '', category: 'market' });
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const addResource = () => {
    const newResource: ResourceRequirement = {
      id: `res_${Date.now()}`,
      type: 'personnel',
      name: '',
      quantity: 1,
      estimatedCost: 0,
      availability: 'available',
    };
    setResources([...resources, newResource]);
  };

  const updateResource = (id: string, field: keyof ResourceRequirement, value: any) => {
    setResources(resources.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const addStakeholder = () => {
    const newStakeholder: StakeholderGroup = {
      id: `stake_${Date.now()}`,
      name: '',
      role: '',
      priority: 'medium',
      communicationChannel: 'email',
    };
    setStakeholders([...stakeholders, newStakeholder]);
  };

  const updateStakeholder = (id: string, field: keyof StakeholderGroup, value: any) => {
    setStakeholders(stakeholders.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  const runAnalysis = async () => {
    if (conditions.length === 0) {
      toast({
        title: "No Conditions",
        description: "Add at least one test condition to run the analysis",
        variant: "destructive"
      });
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
              const playbook = playbooks.find(p => p.id === pbId);
              if (playbook && !recommendedPlaybooksList.find(p => p.id === pbId)) {
                recommendedPlaybooksList.push({
                  id: playbook.id,
                  name: playbook.name || playbook.title,
                  executionTime: playbook.averageExecutionTime || 12,
                  readinessState: playbook.readinessState || 'green',
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
            alerts: [{ name: `${scenarioLabel} — Threat Detected`, severity: 'high' }, { name: 'Anomalous Activity Alert', severity: 'medium' }, { name: 'Compliance Deviation Warning', severity: 'medium' }],
            playbooks: [{ name: 'Cyber Incident Response', time: 12, coverage: 82 }, { name: 'Crisis Communications Protocol', time: 8, coverage: 70 }, { name: 'Regulatory Notification Sequence', time: 15, coverage: 65 }],
            teams: ['Cybersecurity Operations', 'Executive Leadership', 'Legal & Compliance', 'Corporate Communications'],
          },
          market: {
            alerts: [{ name: `${scenarioLabel} — Market Signal`, severity: 'high' }, { name: 'Competitive Intelligence Alert', severity: 'medium' }],
            playbooks: [{ name: 'Market Entry Acceleration', time: 10, coverage: 78 }, { name: 'Competitive Response Framework', time: 14, coverage: 72 }, { name: 'Go-to-Market Sprint Playbook', time: 8, coverage: 85 }],
            teams: ['Strategy & Growth', 'Executive Leadership', 'Sales Operations', 'Product Management'],
          },
          operational: {
            alerts: [{ name: `${scenarioLabel} — Operational Risk`, severity: 'high' }, { name: 'Supply Chain Disruption Alert', severity: 'medium' }, { name: 'Quality Assurance Warning', severity: 'low' }],
            playbooks: [{ name: 'Operational Continuity Plan', time: 11, coverage: 75 }, { name: 'Stakeholder Communication Protocol', time: 6, coverage: 80 }],
            teams: ['Operations Center', 'Executive Leadership', 'Quality Assurance', 'Supply Chain Management'],
          },
          strategic: {
            alerts: [{ name: `${scenarioLabel} — Strategic Trigger`, severity: 'high' }, { name: 'Integration Readiness Alert', severity: 'medium' }],
            playbooks: [{ name: 'M&A Integration Playbook', time: 14, coverage: 70 }, { name: 'Cultural Alignment Framework', time: 10, coverage: 68 }, { name: 'Systems Consolidation Sprint', time: 12, coverage: 74 }],
            teams: ['M&A Integration Office', 'Executive Leadership', 'HR & Culture', 'IT Infrastructure'],
          },
          regulatory: {
            alerts: [{ name: `${scenarioLabel} — Regulatory Signal`, severity: 'high' }, { name: 'Compliance Framework Change', severity: 'medium' }],
            playbooks: [{ name: 'Regulatory Compliance Sprint', time: 10, coverage: 76 }, { name: 'AI Governance Implementation', time: 13, coverage: 72 }, { name: 'Policy Update Protocol', time: 7, coverage: 80 }],
            teams: ['Legal & Compliance', 'Executive Leadership', 'AI Ethics Board', 'Risk Management'],
          },
          financial: {
            alerts: [{ name: `${scenarioLabel} — Financial Risk`, severity: 'high' }, { name: 'Budget Variance Alert', severity: 'medium' }],
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

      // Calculate impact score (0-100)
      const financialImpact = Math.min(100, (impactAssessment.financial.estimatedCost / 1000000) * 10);
      const operationalImpact = impactAssessment.operational.affectedDepartments.length * 10;
      const reputationalImpact = impactAssessment.reputational.riskLevel === 'critical' ? 40 : 
                                  impactAssessment.reputational.riskLevel === 'high' ? 30 :
                                  impactAssessment.reputational.riskLevel === 'medium' ? 20 : 10;
      const impactScore = Math.min(100, Math.round((financialImpact + operationalImpact + reputationalImpact) / 3));

      // Calculate confidence level based on data completeness
      const dataCompleteness = [
        conditions.length > 0,
        impactAssessment.financial.estimatedCost > 0,
        impactAssessment.operational.affectedDepartments.length > 0,
        resources.length > 0,
        stakeholders.length > 0,
      ].filter(Boolean).length;
      const confidenceLevel = Math.round((dataCompleteness / 5) * 100);

      const result: AnalysisResult = {
        triggeredAlerts,
        recommendedPlaybooks: recommendedPlaybooksList,
        projectedExecutionTime: totalExecutionTime,
        teamsInvolved: Array.from(teamsSet).map(name => ({ name, role: 'Response Team' })),
        decisionVelocityMetrics: {
          ourTime: totalExecutionTime,
          industryAverage: industryAvg,
          timeSaved,
          percentageFaster
        },
        impactScore,
        confidenceLevel,
      };

      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${triggeredAlerts.length} triggers and ${recommendedPlaybooksList.length} recommended playbooks`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete the scenario analysis",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveScenario = async () => {
    if (!analysisName) {
      toast({
        title: "Missing Name",
        description: "Please provide a name for this scenario analysis",
        variant: "destructive"
      });
      return;
    }

    if (!analysisResult) {
      toast({
        title: "No Results",
        description: "Run the analysis first before saving",
        variant: "destructive"
      });
      return;
    }

    try {
      const testConditions: any = {};
      conditions.forEach(cond => {
        testConditions[cond.label] = {
          operator: cond.operator,
          value: cond.value,
          value2: cond.value2,
          unit: cond.unit,
          category: cond.category,
        };
      });

      await apiRequest('POST', '/api/what-if-scenarios', {
        name: analysisName,
        description: analysisDescription,
        scenarioType,
        industry,
        testConditions,
        impactAssessment,
        resources: resources.map(r => ({
          type: r.type,
          name: r.name,
          quantity: r.quantity,
          estimatedCost: r.estimatedCost,
          availability: r.availability,
        })),
        stakeholders: stakeholders.map(s => ({
          name: s.name,
          role: s.role,
          priority: s.priority,
          communicationChannel: s.communicationChannel,
        })),
        triggeredAlerts: analysisResult.triggeredAlerts.map(a => a.id),
        recommendedPlaybooks: analysisResult.recommendedPlaybooks.map(p => p.id),
        projectedExecutionTime: analysisResult.projectedExecutionTime,
        teamsInvolved: analysisResult.teamsInvolved,
        decisionVelocityMetrics: analysisResult.decisionVelocityMetrics,
        impactScore: analysisResult.impactScore,
        confidenceLevel: analysisResult.confidenceLevel,
        tags: ['what-if-analysis', scenarioType, industry].filter(Boolean)
      });

      queryClient.invalidateQueries({ queryKey: ['/api/what-if-scenarios'] });

      // Log preparedness activity
      try {
        await apiRequest('POST', '/api/preparedness/activities', {
          organizationId,
          activityType: 'scenario_practice',
          description: `Completed what-if analysis: ${analysisName}`,
          metadata: {
            scenarioType,
            industry,
            impactScore: analysisResult.impactScore,
            confidenceLevel: analysisResult.confidenceLevel,
          }
        });
        queryClient.invalidateQueries({ queryKey: [`/api/preparedness/score?organizationId=${organizationId}`] });
      } catch (activityError) {
        console.error('Activity logging failed:', activityError);
      }

      toast({
        title: "Scenario Saved",
        description: "Your what-if analysis has been saved for future reference"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save the scenario analysis",
        variant: "destructive"
      });
    }
  };

  const saveAsTemplate = async () => {
    if (!analysisName) {
      toast({
        title: "Missing Name",
        description: "Please provide a name for this template",
        variant: "destructive"
      });
      return;
    }

    try {
      const triggerConditions: any = {};
      conditions.forEach(cond => {
        triggerConditions[cond.label] = {
          operator: cond.operator,
          threshold: cond.value,
          value: cond.value,
          unit: cond.unit,
          category: cond.category,
        };
      });

      await apiRequest('POST', '/api/scenario-templates', {
        name: analysisName,
        category: scenarioType,
        description: analysisDescription,
        industry,
        isTemplate: true,
        templateCategory: 'custom',
        likelihood: 0.5,
        impact: 'moderate',
        triggerConditions,
        responseStrategy: {
          impactAssessment,
          resources: resources.map(r => ({
            type: r.type,
            name: r.name,
            quantity: r.quantity,
            estimatedCost: r.estimatedCost,
          })),
          stakeholders: stakeholders.map(s => ({
            name: s.name,
            role: s.role,
            priority: s.priority,
          })),
        },
        requiredDataPoints: conditions.map(c => c.label),
        criticalDecisionPoints: stakeholders.filter(s => s.priority === 'high').map(s => `${s.name} approval required`),
        stakeholderMapping: stakeholders.map(s => ({
          group: s.name,
          role: s.role,
          communicationChannel: s.communicationChannel,
        })),
        resourceRequirements: resources.map(r => ({
          type: r.type,
          resource: r.name,
          quantity: r.quantity,
          cost: r.estimatedCost,
        })),
      });

      queryClient.invalidateQueries({ queryKey: ['/api/scenario-templates'] });

      // Log preparedness activity
      try {
        await apiRequest('POST', '/api/preparedness/activities', {
          organizationId,
          activityType: 'scenario_practice',
          description: `Created custom scenario template: ${analysisName}`,
          metadata: {
            scenarioType,
            industry,
            templateType: 'custom',
          }
        });
        queryClient.invalidateQueries({ queryKey: [`/api/preparedness/score?organizationId=${organizationId}`] });
      } catch (activityError) {
        console.error('Activity logging failed:', activityError);
      }

      toast({
        title: "Template Created",
        description: "Your scenario has been saved as a reusable template"
      });
    } catch (error) {
      console.error('Template save error:', error);
      toast({
        title: "Template Save Failed",
        description: "Unable to create the scenario template",
        variant: "destructive"
      });
    }
  };

  return (
    <PageLayout>
      <div className="flex-1 page-background overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <FlaskConical className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      What-If Analyzer
                    </h1>
                    <OnboardingTrigger pageId="what-if-analyzer" autoStart={true} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Model any business situation beyond our 166 templates. Unlimited scenario testing.
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              <Sparkles className="h-3 w-3 mr-1" />
              Unlimited Scenarios
            </Badge>
          </div>

          {/* Quick Start Templates - Tier 2 Enhancement */}
          <Alert className="border-blue-400 bg-blue-50 dark:bg-blue-950/20" data-testid="alert-quick-start">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <div className="ml-2">
              <div className="font-semibold text-blue-900 dark:text-blue-100">Quick Start: Popular Scenarios</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Select a template to get started in seconds, or create your own custom scenario below.</div>
            </div>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="quick-start-templates">
            <Card 
              className="cursor-pointer hover:border-emerald-400 hover:shadow-lg transition-all border-2 border-transparent"
              onClick={() => {
                setAnalysisName('Market Entry Analysis');
                setAnalysisDescription('Evaluate the strategic implications, competitive response, and resource requirements for entering a new market or launching a new product line.');
                setScenarioType('market');
                setIndustry('general');
                toast({ title: "Template Loaded", description: "Market Entry Analysis loaded" });
              }}
              data-testid="template-market-entry"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Market Entry</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">OFFENSE</div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-emerald-400 hover:shadow-lg transition-all border-2 border-transparent"
              onClick={() => {
                setAnalysisName('M&A Integration');
                setAnalysisDescription('Plan the integration of an acquired company including culture alignment, systems consolidation, and talent retention strategies.');
                setScenarioType('strategic');
                setIndustry('general');
                toast({ title: "Template Loaded", description: "M&A Integration loaded" });
              }}
              data-testid="template-ma-integration"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">M&A Integration</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">OFFENSE</div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-red-400 hover:shadow-lg transition-all border-2 border-transparent"
              onClick={() => {
                setAnalysisName('Product Recall Scenario');
                setAnalysisDescription('Model the impact of a potential product recall including supply chain disruption, customer communication, and regulatory response.');
                setScenarioType('operational');
                setIndustry('manufacturing');
                toast({ title: "Template Loaded", description: "Product Recall Scenario loaded" });
              }}
              data-testid="template-product-recall"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Product Recall</div>
                  <div className="text-xs text-red-600 dark:text-red-400 font-semibold">DEFENSE</div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-red-400 hover:shadow-lg transition-all border-2 border-transparent"
              onClick={() => {
                setAnalysisName('Cybersecurity Incident');
                setAnalysisDescription('Model response to a data breach or ransomware attack including containment, stakeholder communication, and recovery procedures.');
                setScenarioType('security');
                setIndustry('technology');
                toast({ title: "Template Loaded", description: "Cybersecurity Incident loaded" });
              }}
              data-testid="template-cybersecurity"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Cyber Incident</div>
                  <div className="text-xs text-red-600 dark:text-red-400 font-semibold">DEFENSE</div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all border-2 border-transparent"
              onClick={() => {
                setAnalysisName('Digital Transformation Sprint');
                setAnalysisDescription('Analyze the impact of accelerating digital transformation initiatives including cloud migration, process automation, and organizational change management.');
                setScenarioType('strategic');
                setIndustry('general');
                toast({ title: "Template Loaded", description: "Digital Transformation Sprint loaded" });
              }}
              data-testid="template-digital-transformation"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Digital Transformation</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">SPECIAL TEAMS</div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all border-2 border-transparent"
              onClick={() => {
                setAnalysisName('AI Governance Framework');
                setAnalysisDescription('Assess the operational and compliance impact of implementing AI governance policies including ethics review boards, model auditing, and deployment approval workflows.');
                setScenarioType('regulatory');
                setIndustry('general');
                toast({ title: "Template Loaded", description: "AI Governance Framework loaded" });
              }}
              data-testid="template-ai-governance"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">AI Governance</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">SPECIAL TEAMS</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="ai-quick" className="space-y-6">
            <TabsList className="bg-white dark:bg-slate-800">
              <TabsTrigger value="ai-quick" data-testid="tab-ai-quick">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Quick Analysis
              </TabsTrigger>
              <TabsTrigger value="analyzer" data-testid="tab-analyzer">
                <FlaskConical className="h-4 w-4 mr-2" />
                Scenario Analyzer
              </TabsTrigger>
              <TabsTrigger value="saved" data-testid="tab-saved">
                <Save className="h-4 w-4 mr-2" />
                Saved Scenarios ({savedScenarios.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-quick" className="space-y-6">
              <AIQuickAnalysis />
            </TabsContent>

            <TabsContent value="analyzer" className="space-y-6">
              {/* Load Template Section */}
              <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Load Existing Scenario Template
                  </CardTitle>
                  <CardDescription>
                    Start with a pre-configured playbook or create a new scenario from scratch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={selectedTemplate} onValueChange={loadTemplate}>
                      <SelectTrigger data-testid="select-template">
                        <SelectValue placeholder="Select a scenario template..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Create New Scenario</SelectItem>
                        {scenarioTemplates.map((template: any) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} - {template.category || template.industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedTemplate('');
                        setConditions([]);
                        setAnalysisName('');
                        setAnalysisDescription('');
                      }}
                      data-testid="button-clear-template"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Configuration */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Scenario Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="scenario-name">Scenario Name</Label>
                        <Input
                          id="scenario-name"
                          placeholder="e.g., Oil Price Spike Q4 2026"
                          value={analysisName}
                          onChange={(e) => setAnalysisName(e.target.value)}
                          data-testid="input-scenario-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="scenario-description">Description</Label>
                        <Textarea
                          id="scenario-description"
                          placeholder="Describe the scenario and key assumptions..."
                          value={analysisDescription}
                          onChange={(e) => setAnalysisDescription(e.target.value)}
                          rows={3}
                          data-testid="input-scenario-description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="scenario-type">Type</Label>
                        <Select value={scenarioType} onValueChange={setScenarioType}>
                          <SelectTrigger data-testid="select-scenario-type">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="supply-chain">Supply Chain</SelectItem>
                            <SelectItem value="operational">Operational</SelectItem>
                            <SelectItem value="regulatory">Regulatory</SelectItem>
                            <SelectItem value="strategic">Strategic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger data-testid="select-industry">
                            <SelectValue placeholder="Select industry..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Financial Services">Financial Services</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Energy">Energy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Conditions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Test Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="condition-label">Condition</Label>
                          <Input
                            id="condition-label"
                            placeholder="e.g., Oil price, Market volatility"
                            value={newCondition.label}
                            onChange={(e) => setNewCondition({ ...newCondition, label: e.target.value })}
                            data-testid="input-condition-label"
                          />
                        </div>

                        <div>
                          <Label htmlFor="condition-category">Category</Label>
                          <Select
                            value={newCondition.category}
                            onValueChange={(value: any) => setNewCondition({ ...newCondition, category: value })}
                          >
                            <SelectTrigger data-testid="select-condition-category">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="market">Market</SelectItem>
                              <SelectItem value="operational">Operational</SelectItem>
                              <SelectItem value="financial">Financial</SelectItem>
                              <SelectItem value="regulatory">Regulatory</SelectItem>
                              <SelectItem value="environmental">Environmental</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="condition-operator">Operator</Label>
                          <Select
                            value={newCondition.operator}
                            onValueChange={(value: any) => setNewCondition({ ...newCondition, operator: value })}
                          >
                            <SelectTrigger data-testid="select-condition-operator">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="greater">Greater than (&gt;)</SelectItem>
                              <SelectItem value="less">Less than (&lt;)</SelectItem>
                              <SelectItem value="equals">Equals (=)</SelectItem>
                              <SelectItem value="between">Between</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="condition-value">Value</Label>
                            <Input
                              id="condition-value"
                              type="number"
                              placeholder="120"
                              value={newCondition.value}
                              onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                              data-testid="input-condition-value"
                            />
                          </div>
                          {newCondition.operator === 'between' && (
                            <div>
                              <Label htmlFor="condition-value2">Max Value</Label>
                              <Input
                                id="condition-value2"
                                type="number"
                                placeholder="150"
                                value={newCondition.value2}
                                onChange={(e) => setNewCondition({ ...newCondition, value2: e.target.value })}
                                data-testid="input-condition-value2"
                              />
                            </div>
                          )}
                          <div className={newCondition.operator === 'between' ? '' : 'col-span-1'}>
                            <Label htmlFor="condition-unit">Unit</Label>
                            <Input
                              id="condition-unit"
                              placeholder="$/barrel"
                              value={newCondition.unit}
                              onChange={(e) => setNewCondition({ ...newCondition, unit: e.target.value })}
                              data-testid="input-condition-unit"
                            />
                          </div>
                        </div>

                        <Button onClick={addCondition} className="w-full" data-testid="button-add-condition">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Condition
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Active Conditions ({conditions.length})</Label>
                        {conditions.length === 0 ? (
                          <p className="text-sm text-gray-500">No conditions added yet</p>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {conditions.map(condition => (
                              <div
                                key={condition.id}
                                className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                                data-testid={`condition-${condition.id}`}
                              >
                                <div className="text-sm flex-1">
                                  <Badge variant="outline" className="mb-1 text-xs">
                                    {condition.category}
                                  </Badge>
                                  <div>
                                    <span className="font-medium">{condition.label}</span>
                                    <span className="text-gray-600 dark:text-gray-400"> {condition.operator} </span>
                                    <span className="font-medium">{condition.value}</span>
                                    {condition.value2 && <span className="font-medium"> - {condition.value2}</span>}
                                    {condition.unit && <span className="text-gray-600 dark:text-gray-400"> {condition.unit}</span>}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCondition(condition.id)}
                                  data-testid={`button-remove-${condition.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={runAnalysis}
                        disabled={isAnalyzing || conditions.length === 0}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        data-testid="button-run-analysis"
                      >
                        {isAnalyzing ? (
                          <>
                            <Activity className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Run Analysis
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Middle Panel - Impact & Resources */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Impact Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Impact Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Financial Impact
                        </h4>
                        <div>
                          <Label htmlFor="estimated-cost">Estimated Cost ($)</Label>
                          <Input
                            id="estimated-cost"
                            type="number"
                            placeholder="500000"
                            value={impactAssessment.financial.estimatedCost}
                            onChange={(e) => setImpactAssessment({
                              ...impactAssessment,
                              financial: { ...impactAssessment.financial, estimatedCost: parseFloat(e.target.value) || 0 }
                            })}
                            data-testid="input-estimated-cost"
                          />
                        </div>
                        <div>
                          <Label htmlFor="revenue-impact">Revenue Impact ($)</Label>
                          <Input
                            id="revenue-impact"
                            type="number"
                            placeholder="100000"
                            value={impactAssessment.financial.revenueImpact}
                            onChange={(e) => setImpactAssessment({
                              ...impactAssessment,
                              financial: { ...impactAssessment.financial, revenueImpact: parseFloat(e.target.value) || 0 }
                            })}
                            data-testid="input-revenue-impact"
                          />
                        </div>
                        <div>
                          <Label htmlFor="budget-allocation">Budget Allocation ($)</Label>
                          <Input
                            id="budget-allocation"
                            type="number"
                            placeholder="250000"
                            value={impactAssessment.financial.budgetAllocation}
                            onChange={(e) => setImpactAssessment({
                              ...impactAssessment,
                              financial: { ...impactAssessment.financial, budgetAllocation: parseFloat(e.target.value) || 0 }
                            })}
                            data-testid="input-budget-allocation"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Operational Impact
                        </h4>
                        <div>
                          <Label htmlFor="affected-departments">Affected Departments</Label>
                          <Textarea
                            id="affected-departments"
                            placeholder="IT, Operations, Finance (comma-separated)"
                            value={impactAssessment.operational.affectedDepartments.join(', ')}
                            onChange={(e) => setImpactAssessment({
                              ...impactAssessment,
                              operational: {
                                ...impactAssessment.operational,
                                affectedDepartments: e.target.value.split(',').map(d => d.trim()).filter(Boolean)
                              }
                            })}
                            rows={2}
                            data-testid="input-affected-departments"
                          />
                        </div>
                        <div>
                          <Label htmlFor="affected-regions">Affected Regions</Label>
                          <Textarea
                            id="affected-regions"
                            placeholder="North America, Europe (comma-separated)"
                            value={impactAssessment.operational.affectedRegions.join(', ')}
                            onChange={(e) => setImpactAssessment({
                              ...impactAssessment,
                              operational: {
                                ...impactAssessment.operational,
                                affectedRegions: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                              }
                            })}
                            rows={2}
                            data-testid="input-affected-regions"
                          />
                        </div>
                        <div>
                          <Label htmlFor="downtime-estimate">Estimated Downtime (hours)</Label>
                          <Input
                            id="downtime-estimate"
                            type="number"
                            placeholder="4"
                            value={impactAssessment.operational.downtimeEstimate}
                            onChange={(e) => setImpactAssessment({
                              ...impactAssessment,
                              operational: { ...impactAssessment.operational, downtimeEstimate: parseFloat(e.target.value) || 0 }
                            })}
                            data-testid="input-downtime-estimate"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Reputational Impact
                        </h4>
                        <div>
                          <Label htmlFor="risk-level">Risk Level</Label>
                          <Select
                            value={impactAssessment.reputational.riskLevel}
                            onValueChange={(value: any) => setImpactAssessment({
                              ...impactAssessment,
                              reputational: { ...impactAssessment.reputational, riskLevel: value }
                            })}
                          >
                            <SelectTrigger data-testid="select-risk-level">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="stakeholder-concerns">Stakeholder Concerns</Label>
                          <Textarea
                            id="stakeholder-concerns"
                            placeholder="Media exposure, Customer trust (comma-separated)"
                            value={impactAssessment.reputational.stakeholderConcerns.join(', ')}
                            onChange={(e) => setImpactAssessment({
                              ...impactAssessment,
                              reputational: {
                                ...impactAssessment.reputational,
                                stakeholderConcerns: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                              }
                            })}
                            rows={2}
                            data-testid="input-stakeholder-concerns"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Timeline
                        </h4>
                        <div>
                          <Label htmlFor="detection-response">Detection to Response (minutes)</Label>
                          <Input
                            id="detection-response"
                            type="number"
                            placeholder="12"
                            value={impactAssessment.timeline.detectionToResponse}
                            onChange={(e) => setImpactAssessment({
                              ...impactAssessment,
                              timeline: { ...impactAssessment.timeline, detectionToResponse: parseFloat(e.target.value) || 0 }
                            })}
                            data-testid="input-detection-response"
                          />
                        </div>
                        <div>
                          <Label htmlFor="full-resolution">Full Resolution (hours)</Label>
                          <Input
                            id="full-resolution"
                            type="number"
                            placeholder="24"
                            value={impactAssessment.timeline.fullResolution}
                            onChange={(e) => setImpactAssessment({
                              ...impactAssessment,
                              timeline: { ...impactAssessment.timeline, fullResolution: parseFloat(e.target.value) || 0 }
                            })}
                            data-testid="input-full-resolution"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resource Requirements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Resource Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {resources.map((resource) => (
                        <div key={resource.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded border space-y-2">
                          <div className="flex items-center justify-between">
                            <Select
                              value={resource.type}
                              onValueChange={(value: any) => updateResource(resource.id, 'type', value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="personnel">Personnel</SelectItem>
                                <SelectItem value="budget">Budget</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="external">External</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeResource(resource.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Resource name"
                            value={resource.name}
                            onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              placeholder="Quantity"
                              value={resource.quantity}
                              onChange={(e) => updateResource(resource.id, 'quantity', parseInt(e.target.value) || 0)}
                            />
                            <Input
                              type="number"
                              placeholder="Cost ($)"
                              value={resource.estimatedCost}
                              onChange={(e) => updateResource(resource.id, 'estimatedCost', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      ))}
                      <Button onClick={addResource} variant="outline" className="w-full" data-testid="button-add-resource">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Stakeholders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        Key Stakeholders
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {stakeholders.map((stakeholder) => (
                        <div key={stakeholder.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded border space-y-2">
                          <div className="flex items-center justify-between">
                            <Input
                              placeholder="Stakeholder name"
                              value={stakeholder.name}
                              onChange={(e) => updateStakeholder(stakeholder.id, 'name', e.target.value)}
                              className="flex-1 mr-2"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStakeholder(stakeholder.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Role"
                            value={stakeholder.role}
                            onChange={(e) => updateStakeholder(stakeholder.id, 'role', e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={stakeholder.priority}
                              onValueChange={(value: any) => updateStakeholder(stakeholder.id, 'priority', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High Priority</SelectItem>
                                <SelectItem value="medium">Medium Priority</SelectItem>
                                <SelectItem value="low">Low Priority</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Channel (email, slack)"
                              value={stakeholder.communicationChannel}
                              onChange={(e) => updateStakeholder(stakeholder.id, 'communicationChannel', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                      <Button onClick={addStakeholder} variant="outline" className="w-full" data-testid="button-add-stakeholder">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Stakeholder
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel - Results */}
                <div className="lg:col-span-1 space-y-4">
                  {!analysisResult ? (
                    <Card className="h-full flex items-center justify-center min-h-[500px]">
                      <CardContent className="text-center p-12">
                        <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Ready to Analyze
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                          Configure your scenario with test conditions, impact assessment, resources, and stakeholders, then run the analysis
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Target className="h-4 w-4" />
                          <ArrowRight className="h-4 w-4" />
                          <AlertTriangle className="h-4 w-4" />
                          <ArrowRight className="h-4 w-4" />
                          <Rocket className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {/* Save Controls */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Button onClick={saveScenario} className="flex-1" data-testid="button-save-scenario">
                                <Save className="h-4 w-4 mr-2" />
                                Save Analysis
                              </Button>
                              <Button onClick={saveAsTemplate} variant="outline" className="flex-1" data-testid="button-save-template">
                                <FileText className="h-4 w-4 mr-2" />
                                Save as Template
                              </Button>
                            </div>
                            <Alert>
                              <AlertDescription className="text-xs">
                                Save as Analysis for reference, or as Template for reusable scenarios
                              </AlertDescription>
                            </Alert>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Scenario Variance Alerts */}
                      <ScenarioVarianceAlert analysisResult={analysisResult} />

                      {/* Analysis Confidence */}
                      <Card className="border-2 border-blue-200 dark:border-blue-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 justify-between">
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              Analysis Confidence
                            </span>
                            <Badge variant="outline" className="text-blue-600">
                              {analysisResult.confidenceLevel}%
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Impact Score:</span>
                              <span className="font-bold text-orange-600">{analysisResult.impactScore}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${analysisResult.confidenceLevel}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600">
                              Based on data completeness and scenario depth
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Decision Velocity Metrics */}
                      <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-green-600" />
                            Decision Velocity Advantage
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-blue-600">
                                {analysisResult.decisionVelocityMetrics.ourTime} min
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Your Response Time</div>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                              <Activity className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-gray-600">
                                {Math.round(analysisResult.decisionVelocityMetrics.industryAverage / 60)} hrs
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Industry Average</div>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-green-600">
                                {analysisResult.decisionVelocityMetrics.percentageFaster}%
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Faster</div>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-purple-600">
                                {Math.round(analysisResult.decisionVelocityMetrics.timeSaved / 60)} hrs
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Time Saved</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Triggered Alerts */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Triggered Alerts ({analysisResult.triggeredAlerts.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {analysisResult.triggeredAlerts.length === 0 ? (
                            <p className="text-gray-500">No triggers would fire under these conditions</p>
                          ) : (
                            <div className="space-y-2">
                              {analysisResult.triggeredAlerts.map(alert => (
                                <div
                                  key={alert.id}
                                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800"
                                  data-testid={`alert-${alert.id}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    <span className="font-medium text-sm">{alert.name}</span>
                                  </div>
                                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                                    {alert.severity}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recommended Playbooks */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Rocket className="h-5 w-5 text-blue-600" />
                            Recommended Playbooks ({analysisResult.recommendedPlaybooks.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {analysisResult.recommendedPlaybooks.length === 0 ? (
                            <p className="text-gray-500">No playbooks recommended</p>
                          ) : (
                            <div className="space-y-2">
                              {analysisResult.recommendedPlaybooks.map(playbook => (
                                <div
                                  key={playbook.id}
                                  className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                                  data-testid={`playbook-${playbook.id}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">{playbook.name}</span>
                                    <Badge
                                      variant={playbook.readinessState === 'green' ? 'default' : 'secondary'}
                                      className={playbook.readinessState === 'green' ? 'bg-green-600' : ''}
                                    >
                                      {playbook.readinessState}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {playbook.executionTime} min
                                    </span>
                                    {playbook.automationCoverage && (
                                      <span className="flex items-center gap-1">
                                        <Zap className="h-3 w-3" />
                                        {playbook.automationCoverage}% automated
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Teams Involved */}
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
                              <Badge key={idx} variant="outline" className="text-purple-600 border-purple-300">
                                {team.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedScenarios.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="text-center p-12">
                      <Save className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No Saved Scenarios
                      </h3>
                      <p className="text-gray-500">
                        Run an analysis and save it to build your scenario library
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  savedScenarios.map((scenario: any) => (
                    <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{scenario.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{scenario.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Impact Score:</span>
                            <Badge variant="outline">{scenario.impactScore || 'N/A'}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Response Time:</span>
                            <span className="font-medium">{scenario.projectedExecutionTime || 0} min</span>
                          </div>
                          {scenario.tags && scenario.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {scenario.tags.slice(0, 3).map((tag: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
