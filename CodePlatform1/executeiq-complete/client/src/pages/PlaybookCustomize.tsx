import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StandardNav from "@/components/layout/StandardNav";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ArrowLeft, Plus, Trash2, Users, Clock, Target, AlertTriangle, FileText, DollarSign, TrendingUp, Shield, ArrowUpRight, ChevronDown, ChevronUp, Lock, Scale, Megaphone, Link2, Settings, Globe, GraduationCap, Calendar } from "lucide-react";
import type { Playbook } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useCustomer } from "@/contexts/CustomerContext";
import { useToast } from "@/hooks/use-toast";
import { 
  STRATEGIC_DOMAINS_ARRAY, 
  STRATEGIC_CATEGORIES_ARRAY,
  PRIORITY_LEVELS as FRAMEWORK_PRIORITY_LEVELS
} from "@shared/constants/framework";

const DOMAINS = STRATEGIC_DOMAINS_ARRAY.map(d => d.name);

const CATEGORIES = STRATEGIC_CATEGORIES_ARRAY.map(c => ({
  value: c.id,
  label: c.name,
  description: c.description
}));

const PRIORITY_LEVELS = FRAMEWORK_PRIORITY_LEVELS.map(p => ({
  value: p.id,
  label: p.name
}));

const PLAYBOOK_STATUSES = [
  { value: "draft", label: "Draft", description: "Still being configured" },
  { value: "ready", label: "Ready", description: "Complete and ready for activation" },
  { value: "active", label: "Active", description: "Currently in use" },
  { value: "archived", label: "Archived", description: "No longer in use" }
];

const TRIGGER_SOURCES = [
  { value: "manual", label: "Manual Activation" },
  { value: "system", label: "System Detection" },
  { value: "integration", label: "Integration Alert" },
  { value: "market_data", label: "Market Data Signal" },
  { value: "news", label: "News Monitoring" },
  { value: "competitive_intelligence", label: "Competitive Intel" },
  { value: "regulatory", label: "Regulatory Filing" },
  { value: "financial", label: "Financial Threshold" }
];

const TRIGGER_SEVERITY = [
  { value: "informational", label: "Informational" },
  { value: "warning", label: "Warning" },
  { value: "urgent", label: "Urgent" },
  { value: "critical", label: "Critical" }
];

const STAKEHOLDER_ROLES = [
  "CEO", "COO", "CFO", "CLO", "CTO", "CISO", "CMO", "CHRO",
  "General Counsel", "VP Operations", "VP Strategy", "VP Communications",
  "Director of Risk", "Director of Compliance", "Project Manager",
  "Legal Counsel", "HR Director", "IT Director", "Security Lead",
  "Board Liaison", "External Counsel", "PR Agency Lead", "Crisis Consultant"
];

const ESCALATION_TRIGGERS = [
  { value: "no_response", label: "No response within time target" },
  { value: "blocked", label: "Task blocked or at risk" },
  { value: "scope_change", label: "Scope or priority change" },
  { value: "budget_exceeded", label: "Budget threshold exceeded" },
  { value: "executive_decision", label: "Executive decision required" },
  { value: "external_dependency", label: "External dependency failure" }
];

const NOTIFICATION_CHANNELS = [
  { value: "email", label: "Email" },
  { value: "slack", label: "Slack" },
  { value: "teams", label: "Teams" },
  { value: "sms", label: "SMS" },
  { value: "phone", label: "Phone" },
  { value: "in_app", label: "In-App" }
];

const TIME_TARGETS = [
  { value: 5, label: "5 min" }, { value: 10, label: "10 min" },
  { value: 15, label: "15 min" }, { value: 30, label: "30 min" },
  { value: 60, label: "1 hr" }, { value: 120, label: "2 hr" },
  { value: 240, label: "4 hr" }, { value: 480, label: "8 hr" },
  { value: 1440, label: "24 hr" }, { value: 2880, label: "48 hr" }
];

const BUDGET_CATEGORIES = [
  { value: "personnel", label: "Personnel / Overtime" },
  { value: "consulting", label: "External Consulting" },
  { value: "legal", label: "Legal Fees" },
  { value: "technology", label: "Technology / Tools" },
  { value: "communications", label: "Communications / PR" },
  { value: "travel", label: "Travel & Expenses" },
  { value: "contingency", label: "Contingency Reserve" },
  { value: "other", label: "Other" }
];

const APPROVAL_TYPES = [
  { value: "none", label: "No approval needed" },
  { value: "manager", label: "Manager approval" },
  { value: "director", label: "Director approval" },
  { value: "vp", label: "VP approval" },
  { value: "c_suite", label: "C-Suite approval" },
  { value: "board", label: "Board approval" }
];

const IMPACT_TYPES = [
  { value: "revenue_protection", label: "Revenue Protection" },
  { value: "cost_avoidance", label: "Cost Avoidance" },
  { value: "time_savings", label: "Time Savings" },
  { value: "risk_mitigation", label: "Risk Mitigation" },
  { value: "reputation_value", label: "Reputation Value" },
  { value: "compliance_value", label: "Compliance Value" },
  { value: "market_share", label: "Market Share Impact" }
];

const COMPLIANCE_FRAMEWORKS = [
  { value: "sox", label: "SOX (Sarbanes-Oxley)" },
  { value: "gdpr", label: "GDPR" },
  { value: "hipaa", label: "HIPAA" },
  { value: "pci_dss", label: "PCI-DSS" },
  { value: "iso_27001", label: "ISO 27001" },
  { value: "soc2", label: "SOC 2" },
  { value: "ccpa", label: "CCPA" },
  { value: "sec", label: "SEC Regulations" },
  { value: "finra", label: "FINRA" },
  { value: "glba", label: "GLBA" },
  { value: "fcpa", label: "FCPA" },
  { value: "osha", label: "OSHA" },
  { value: "epa", label: "EPA Regulations" },
  { value: "fda", label: "FDA Regulations" },
  { value: "other", label: "Other" }
];

const LEGAL_REVIEW_STATUS = [
  { value: "not_required", label: "Not Required" },
  { value: "pending", label: "Pending Review" },
  { value: "in_review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "approved_with_conditions", label: "Approved with Conditions" },
  { value: "rejected", label: "Rejected" }
];

const RISK_LEVELS = [
  { value: 1, label: "1 - Minimal" },
  { value: 2, label: "2 - Low" },
  { value: 3, label: "3 - Moderate" },
  { value: 4, label: "4 - Significant" },
  { value: 5, label: "5 - High" },
  { value: 6, label: "6 - Very High" },
  { value: 7, label: "7 - Severe" },
  { value: 8, label: "8 - Critical" },
  { value: 9, label: "9 - Extreme" },
  { value: 10, label: "10 - Catastrophic" }
];

const DEPENDENCY_TYPES = [
  { value: "vendor", label: "External Vendor" },
  { value: "partner", label: "Business Partner" },
  { value: "technology", label: "Technology/System" },
  { value: "data", label: "Data/Information" },
  { value: "facility", label: "Facility/Location" },
  { value: "equipment", label: "Equipment" },
  { value: "regulatory", label: "Regulatory Body" },
  { value: "internal_team", label: "Internal Team" }
];

const REGIONS = [
  { value: "global", label: "Global" },
  { value: "north_america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "asia_pacific", label: "Asia Pacific" },
  { value: "latin_america", label: "Latin America" },
  { value: "middle_east", label: "Middle East" },
  { value: "africa", label: "Africa" },
  { value: "uk", label: "United Kingdom" },
  { value: "eu", label: "European Union" },
  { value: "us", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "china", label: "China" },
  { value: "japan", label: "Japan" },
  { value: "australia", label: "Australia" }
];

const REVIEW_FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi_annual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
  { value: "as_needed", label: "As Needed" }
];

interface TriggerCondition { 
  id: string; 
  description: string; 
  source: string; 
  severity: string;
  autoActivate: boolean;
}

interface EscalationPath {
  id: string;
  triggerCondition: string;
  escalateTo: string;
  backupContact: string;
  timeToEscalate: number;
  notificationChannels: string[];
}

interface Stakeholder { 
  role: string; 
  userId?: string; 
  responsibility: string; 
  notificationChannels: string[];
  isBackup: boolean;
  backupFor?: string;
}

interface ExecutionStep { 
  id: string; 
  order: number; 
  title: string; 
  description: string; 
  ownerId?: string; 
  timeTargetMinutes: number; 
  isParallel: boolean;
  dependsOn: string[];
  approvalRequired: string;
  approvalNotes: string;
  deliverables: string;
}

interface BudgetAllocation {
  id: string;
  category: string;
  amount: number;
  preApproved: boolean;
  approvalThreshold: number;
  notes: string;
}

interface BusinessImpact {
  id: string;
  type: string;
  estimatedValue: number;
  valueUnit: string;
  description: string;
  measurementMethod: string;
}

interface SuccessMetrics { 
  responseTimeTarget: number; 
  stakeholdersTarget: number; 
  customMetrics: Array<{ name: string; target: string }>;
}

interface ComplianceRequirement {
  id: string;
  framework: string;
  requirement: string;
  notes: string;
}

interface Dependency {
  id: string;
  type: string;
  name: string;
  contactInfo: string;
  criticality: string;
  notes: string;
}

interface PlaybookFormData {
  name: string;
  description: string;
  domain: string;
  category: string;
  priority: string;
  isActive: boolean;
  status: string;
  triggerConditions: TriggerCondition[];
  escalationPaths: EscalationPath[];
  stakeholders: Stakeholder[];
  executionSteps: ExecutionStep[];
  budgetAllocations: BudgetAllocation[];
  businessImpacts: BusinessImpact[];
  successMetrics: SuccessMetrics;
  totalBudget: number;
  budgetCurrency: string;
  complianceFrameworks: string[];
  complianceRequirements: ComplianceRequirement[];
  legalReviewStatus: string;
  legalReviewApprover: string;
  legalReviewDate: string;
  auditTrailRequired: boolean;
  riskScore: number;
  maxFinancialExposure: number;
  reputationalRiskLevel: string;
  riskNotes: string;
  pressResponseRequired: boolean;
  investorNotificationRequired: boolean;
  investorNotificationThreshold: string;
  boardNotificationRequired: boolean;
  boardNotificationThreshold: string;
  preApprovedMessaging: string;
  dependencies: Dependency[];
  playbookOwner: string;
  playbookOwnerEmail: string;
  nextReviewDate: string;
  reviewFrequency: string;
  versionNotes: string;
  changeApprovalRequired: boolean;
  geographicScope: string[];
  primaryTimezone: string;
  localRegulations: string;
  lastDrillDate: string;
  nextDrillDate: string;
  drillFrequency: string;
  trainingRequirements: string;
  certificationRequirements: string;
}

function generateId() { return Math.random().toString(36).substring(2, 11); }

function getSmartDefaults(domain: string, category: string) {
  const isDefense = category === 'defense';
  const isOffense = category === 'offense';
  
  const complianceByDomain: Record<string, string[]> = {
    'Regulatory & Compliance': ['sox', 'sec', 'gdpr'],
    'Cyber Security': ['iso_27001', 'soc2', 'pci_dss', 'gdpr'],
    'Crisis Response': ['sox', 'sec'],
    'AI Governance': ['gdpr', 'ccpa', 'iso_27001'],
    'M&A Integration': ['sox', 'sec', 'finra'],
    'Product Launch': ['gdpr', 'ccpa'],
    'Environmental Compliance': ['epa', 'osha'],
    'Financial Strategy': ['sox', 'sec', 'finra'],
  };
  
  return {
    priority: isDefense ? 'high' : 'medium',
    riskScore: isDefense ? 7 : 5,
    reputationalRiskLevel: isDefense ? 'high' : 'medium',
    complianceFrameworks: complianceByDomain[domain] || ['sox'],
    auditTrailRequired: isDefense,
    pressResponseRequired: isDefense,
    boardNotificationRequired: isDefense || category === 'special_teams',
    boardNotificationThreshold: isDefense ? 'Material impact, regulatory involvement, or reputational risk' : 'Strategic initiative with significant impact',
    investorNotificationRequired: isOffense,
    investorNotificationThreshold: isOffense ? 'Strategic initiative with material financial impact' : '',
    geographicScope: ['global'],
    reviewFrequency: 'quarterly',
    drillFrequency: isDefense ? 'quarterly' : 'semi_annual',
  };
}

// IDEA Framework phase groupings
const IDEA_PHASES = [
  { 
    id: 'identify', 
    label: 'IDENTIFY', 
    tagline: 'Build Your Depth Chart',
    description: 'Define stakeholders, dependencies, and governance before situations arise',
    color: 'bg-blue-500',
    sections: ['basic', 'stakeholders', 'dependencies', 'governance', 'geographic', 'readiness']
  },
  { 
    id: 'detect', 
    label: 'DETECT', 
    tagline: 'Monitor Signals',
    description: 'Configure triggers and risk thresholds for early warning',
    color: 'bg-amber-500',
    sections: ['triggers', 'risk', 'compliance']
  },
  { 
    id: 'execute', 
    label: 'EXECUTE', 
    tagline: 'Execute Response',
    description: 'Define execution steps, escalation paths, budget, and communications',
    color: 'bg-green-500',
    sections: ['steps', 'escalation', 'budget', 'communications']
  },
  { 
    id: 'advance', 
    label: 'ADVANCE', 
    tagline: 'Review the Film',
    description: 'Track success metrics and capture business impact',
    color: 'bg-purple-500',
    sections: ['metrics', 'impact']
  }
];

const sections = [
  { id: 'basic', label: 'Basic Info', icon: FileText, phase: 'identify' },
  { id: 'stakeholders', label: 'Stakeholders', icon: Users, phase: 'identify' },
  { id: 'dependencies', label: 'Dependencies', icon: Link2, phase: 'identify' },
  { id: 'governance', label: 'Governance', icon: Settings, phase: 'identify' },
  { id: 'geographic', label: 'Geographic Scope', icon: Globe, phase: 'identify' },
  { id: 'readiness', label: 'Readiness', icon: GraduationCap, phase: 'identify' },
  { id: 'triggers', label: 'Triggers', icon: AlertTriangle, phase: 'detect' },
  { id: 'risk', label: 'Risk Assessment', icon: Shield, phase: 'detect' },
  { id: 'compliance', label: 'Compliance', icon: Scale, phase: 'detect' },
  { id: 'steps', label: 'Execution Steps', icon: Clock, phase: 'execute' },
  { id: 'escalation', label: 'Escalation', icon: ArrowUpRight, phase: 'execute' },
  { id: 'budget', label: 'Budget', icon: DollarSign, phase: 'execute' },
  { id: 'communications', label: 'Communications', icon: Megaphone, phase: 'execute' },
  { id: 'metrics', label: 'Success Metrics', icon: Target, phase: 'advance' },
  { id: 'impact', label: 'Business Impact', icon: TrendingUp, phase: 'advance' }
];

export default function PlaybookCustomize() {
  const [, params] = useRoute('/playbooks/:id/customize');
  const [, editParams] = useRoute('/playbooks/:id/edit');
  const [, createParams] = useRoute('/playbooks/create');
  const [, customizeParams] = useRoute('/playbook-customize/:id');
  const [, newParams] = useRoute('/playbook-customize/new');
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState('basic');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true, triggers: true, escalation: false, stakeholders: false, 
    steps: false, budget: false, impact: false, compliance: false,
    risk: false, communications: false, dependencies: false, governance: false,
    geographic: false, readiness: false, metrics: false
  });
  
  const playbookId = params?.id || editParams?.id || (customizeParams?.id !== 'new' ? customizeParams?.id : undefined);
  const isCreateMode = !!createParams || !!newParams || !playbookId;
  
  const { organization } = useCustomer();
  const { toast } = useToast();
  
  const { data: template, isLoading } = useQuery<Playbook>({
    queryKey: ['/api/playbooks', playbookId],
    enabled: !!playbookId,
  });
  
  const defaultValues: PlaybookFormData = {
    name: "", description: "", domain: "", category: "defense", priority: "medium", isActive: true, status: "draft",
    triggerConditions: [], escalationPaths: [], stakeholders: [], executionSteps: [],
    budgetAllocations: [], businessImpacts: [],
    successMetrics: { responseTimeTarget: 12, stakeholdersTarget: 5, customMetrics: [] },
    totalBudget: 0, budgetCurrency: "USD",
    complianceFrameworks: [], complianceRequirements: [],
    legalReviewStatus: "not_required", legalReviewApprover: "", legalReviewDate: "",
    auditTrailRequired: false,
    riskScore: 5, maxFinancialExposure: 0, reputationalRiskLevel: "medium", riskNotes: "",
    pressResponseRequired: false, investorNotificationRequired: false, investorNotificationThreshold: "",
    boardNotificationRequired: false, boardNotificationThreshold: "", preApprovedMessaging: "",
    dependencies: [],
    playbookOwner: "", playbookOwnerEmail: "", nextReviewDate: "", reviewFrequency: "quarterly",
    versionNotes: "", changeApprovalRequired: false,
    geographicScope: [], primaryTimezone: "", localRegulations: "",
    lastDrillDate: "", nextDrillDate: "", drillFrequency: "quarterly",
    trainingRequirements: "", certificationRequirements: ""
  };
  
  const form = useForm<PlaybookFormData>({ defaultValues });
  const { control, register, handleSubmit, reset, watch, formState: { errors } } = form;
  
  const triggersArray = useFieldArray({ control, name: "triggerConditions" });
  const escalationArray = useFieldArray({ control, name: "escalationPaths" });
  const stakeholdersArray = useFieldArray({ control, name: "stakeholders" });
  const stepsArray = useFieldArray({ control, name: "executionSteps" });
  const budgetArray = useFieldArray({ control, name: "budgetAllocations" });
  const impactArray = useFieldArray({ control, name: "businessImpacts" });
  const complianceArray = useFieldArray({ control, name: "complianceRequirements" });
  const dependenciesArray = useFieldArray({ control, name: "dependencies" });
  const customMetricsArray = useFieldArray({ control, name: "successMetrics.customMetrics" });
  
  const watchedSteps = watch("executionSteps");
  const watchedBudget = watch("budgetAllocations");
  
  const totalAllocatedBudget = watchedBudget?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;
  
  useEffect(() => {
    if (template) {
      const t = template as any;
      const domain = template.domain || "";
      const category = template.category || "defense";
      const smartDefaults = getSmartDefaults(domain, category);
      const hasExistingCompliance = t.complianceFrameworks?.length > 0;
      
      reset({
        name: template.name || "",
        description: template.description || "",
        domain: domain,
        category: category,
        priority: t.priority || smartDefaults.priority,
        isActive: template.isActive ?? true,
        status: t.status || "draft",
        triggerConditions: (template.triggerConditions as TriggerCondition[]) || [],
        escalationPaths: t.escalationPaths || [],
        stakeholders: (template.stakeholders as Stakeholder[]) || [],
        executionSteps: (template.executionSteps as ExecutionStep[]) || [],
        budgetAllocations: t.budgetAllocations || [],
        businessImpacts: t.businessImpacts || [],
        successMetrics: (template.successMetrics as SuccessMetrics) || { responseTimeTarget: 12, stakeholdersTarget: 5, customMetrics: [] },
        totalBudget: t.totalBudget || 0,
        budgetCurrency: t.budgetCurrency || "USD",
        complianceFrameworks: hasExistingCompliance ? t.complianceFrameworks : smartDefaults.complianceFrameworks,
        complianceRequirements: t.complianceRequirements || [],
        legalReviewStatus: t.legalReviewStatus || "not_required",
        legalReviewApprover: t.legalReviewApprover || "",
        legalReviewDate: t.legalReviewDate || "",
        auditTrailRequired: t.auditTrailRequired ?? smartDefaults.auditTrailRequired,
        riskScore: t.riskScore || smartDefaults.riskScore,
        maxFinancialExposure: t.maxFinancialExposure || 0,
        reputationalRiskLevel: t.reputationalRiskLevel || smartDefaults.reputationalRiskLevel,
        riskNotes: t.riskNotes || "",
        pressResponseRequired: t.pressResponseRequired ?? smartDefaults.pressResponseRequired,
        investorNotificationRequired: t.investorNotificationRequired ?? smartDefaults.investorNotificationRequired,
        investorNotificationThreshold: t.investorNotificationThreshold || smartDefaults.investorNotificationThreshold,
        boardNotificationRequired: t.boardNotificationRequired ?? smartDefaults.boardNotificationRequired,
        boardNotificationThreshold: t.boardNotificationThreshold || smartDefaults.boardNotificationThreshold,
        preApprovedMessaging: t.preApprovedMessaging || "",
        dependencies: t.dependencies || [],
        playbookOwner: t.playbookOwner || "",
        playbookOwnerEmail: t.playbookOwnerEmail || "",
        nextReviewDate: t.nextReviewDate || "",
        reviewFrequency: t.reviewFrequency || smartDefaults.reviewFrequency,
        versionNotes: t.versionNotes || "",
        changeApprovalRequired: t.changeApprovalRequired || false,
        geographicScope: t.geographicScope?.length > 0 ? t.geographicScope : smartDefaults.geographicScope,
        primaryTimezone: t.primaryTimezone || "",
        localRegulations: t.localRegulations || "",
        lastDrillDate: t.lastDrillDate || "",
        nextDrillDate: t.nextDrillDate || "",
        drillFrequency: t.drillFrequency || smartDefaults.drillFrequency,
        trainingRequirements: t.trainingRequirements || "",
        certificationRequirements: t.certificationRequirements || ""
      });
    }
  }, [template, reset]);
  
  const savePlaybook = useMutation({
    mutationFn: async (data: PlaybookFormData) => {
      const payload = { ...data, sourceType: isCreateMode ? 'custom' : 'customized', templateId: playbookId || null, organizationId: organization?.id || 'demo-org' };
      const res = await apiRequest('POST', '/api/playbooks', payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbooks'] });
      toast({ title: "Playbook saved", description: "Your playbook has been created successfully." });
      setLocation('/playbooks');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to save playbook", variant: "destructive" });
    }
  });
  
  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const PHASE_BADGES: Record<string, { label: string; color: string }> = {
    identify: { label: 'I', color: 'bg-blue-500' },
    detect: { label: 'D', color: 'bg-amber-500' },
    execute: { label: 'E', color: 'bg-green-500' },
    advance: { label: 'A', color: 'bg-purple-500' },
  };
  
  const SECTION_TO_PHASE: Record<string, string> = {
    basic: 'identify', stakeholders: 'identify', dependencies: 'identify', 
    governance: 'identify', geographic: 'identify', readiness: 'identify',
    triggers: 'detect', risk: 'detect', compliance: 'detect',
    steps: 'execute', escalation: 'execute', budget: 'execute', communications: 'execute',
    metrics: 'advance', impact: 'advance',
  };
  
  const SectionHeader = ({ id, title, icon: Icon, description, children }: { id: string; title: string; icon: any; description?: string; children?: React.ReactNode }) => {
    const phase = SECTION_TO_PHASE[id];
    const phaseBadge = phase ? PHASE_BADGES[phase] : null;
    return (
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer flex-1" onClick={() => toggleSection(id)}>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className="h-5 w-5 text-slate-500" />
              {title}
              {phaseBadge && (
                <span className={`ml-2 w-5 h-5 ${phaseBadge.color} text-white text-xs font-bold rounded flex items-center justify-center`}>
                  {phaseBadge.label}
                </span>
              )}
            </CardTitle>
            {description && <CardDescription className="text-sm mt-1">{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {children}
            {expandedSections[id] ? <ChevronUp className="h-5 w-5 text-slate-400 cursor-pointer" onClick={() => toggleSection(id)} /> : <ChevronDown className="h-5 w-5 text-slate-400 cursor-pointer" onClick={() => toggleSection(id)} />}
          </div>
        </div>
      </CardHeader>
    );
  };
  
  if (isLoading && !isCreateMode) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <StandardNav />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-slate-500">Loading template...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <StandardNav />
      
      <div className="pt-20 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setLocation('/playbooks')} data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {template && (
              <Badge variant="outline" className="text-xs">
                Based on: {template.name}
              </Badge>
            )}
          </div>
          
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">
                {isCreateMode ? "Create Playbook" : "Customize Playbook"}
              </h1>
              <p className="text-slate-500 text-sm">
                Comprehensive strategic response configuration
              </p>
            </div>
          </div>
          
          {/* IDEA Phase Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {IDEA_PHASES.map((phase) => {
              const phaseSections = sections.filter(s => s.phase === phase.id);
              // Proper field mapping for each section
              const sectionFieldMap: Record<string, string> = {
                basic: 'name',
                stakeholders: 'stakeholders',
                dependencies: 'dependencies',
                governance: 'playbookOwner',
                geographic: 'geographicScope',
                readiness: 'trainingRequirements',
                triggers: 'triggerConditions',
                risk: 'riskNotes',
                compliance: 'complianceRequirements',
                steps: 'executionSteps',
                escalation: 'escalationPaths',
                budget: 'budgetAllocations',
                communications: 'preApprovedMessaging',
                metrics: 'successMetrics',
                impact: 'businessImpacts'
              };
              const filledCount = phaseSections.filter(s => {
                const fieldName = sectionFieldMap[s.id] || 'name';
                const values = watch(fieldName as any);
                if (Array.isArray(values)) return values.length > 0;
                if (typeof values === 'object' && values !== null) {
                  // For successMetrics, check if it has customMetrics or targets set
                  return Object.values(values).some(v => v && (Array.isArray(v) ? v.length > 0 : true));
                }
                return !!values;
              }).length;
              return (
                <Card key={phase.id} className="border-slate-200 dark:border-slate-800 overflow-hidden" data-testid={`phase-card-${phase.id}`}>
                  <div className={`h-1.5 ${phase.color}`} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm tracking-wide">{phase.label}</h3>
                      <Badge variant="secondary" className="text-xs">{filledCount}/{phaseSections.length}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">{phase.tagline}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{phase.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-8">
            <nav className="w-56 shrink-0">
              <div className="sticky top-24 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                {IDEA_PHASES.map((phase) => (
                  <div key={phase.id} className="mb-4">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1`}>
                      <div className={`w-2 h-2 rounded-full ${phase.color}`} />
                      <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">{phase.label}</span>
                    </div>
                    {sections.filter(s => s.phase === phase.id).map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            setActiveSection(section.id);
                            setExpandedSections(prev => ({ ...prev, [section.id]: true }));
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left text-sm transition-colors ${
                            isActive 
                              ? 'bg-primary text-primary-foreground' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          data-testid={`nav-${section.id}`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="font-medium truncate">{section.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </nav>
            
            <form onSubmit={handleSubmit((data) => savePlaybook.mutate(data))} className="flex-1 space-y-5">
              
              {/* BASIC INFO */}
              <section id="basic" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="basic" title="Basic Information" icon={FileText} />
                  {expandedSections.basic && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label className="text-sm font-medium">Playbook Name</Label>
                          <Input {...register('name', { required: "Required" })} placeholder="e.g., Crisis Communication Response" className="mt-1.5" data-testid="input-name" />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-medium">Description</Label>
                          <Textarea {...register('description')} rows={2} placeholder="Strategic situation this playbook addresses" className="mt-1.5 resize-none" data-testid="input-description" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Domain</Label>
                          <Controller name="domain" control={control} render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="mt-1.5" data-testid="select-domain"><SelectValue placeholder="Select..." /></SelectTrigger>
                              <SelectContent>{DOMAINS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                          )} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Category</Label>
                          <Controller name="category" control={control} render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="mt-1.5" data-testid="select-category"><SelectValue /></SelectTrigger>
                              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                            </Select>
                          )} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Priority</Label>
                          <Controller name="priority" control={control} render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="mt-1.5" data-testid="select-priority"><SelectValue /></SelectTrigger>
                              <SelectContent>{PRIORITY_LEVELS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                            </Select>
                          )} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Status</Label>
                          <Controller name="status" control={control} render={({ field }) => (
                            <Select value={field.value || "draft"} onValueChange={field.onChange}>
                              <SelectTrigger className="mt-1.5" data-testid="select-status">
                                <SelectValue>
                                  <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${
                                      field.value === 'draft' ? 'bg-yellow-500' :
                                      field.value === 'ready' ? 'bg-green-500' :
                                      field.value === 'active' ? 'bg-blue-500' : 'bg-slate-400'
                                    }`} />
                                    <span className={`font-medium ${
                                      field.value === 'draft' ? 'text-yellow-600 dark:text-yellow-400' :
                                      field.value === 'ready' ? 'text-green-600 dark:text-green-400' :
                                      field.value === 'active' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600'
                                    }`}>
                                      {PLAYBOOK_STATUSES.find(s => s.value === field.value)?.label || 'Draft'}
                                    </span>
                                  </span>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {PLAYBOOK_STATUSES.map(s => (
                                  <SelectItem key={s.value} value={s.value}>
                                    <span className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${
                                        s.value === 'draft' ? 'bg-yellow-500' :
                                        s.value === 'ready' ? 'bg-green-500' :
                                        s.value === 'active' ? 'bg-blue-500' : 'bg-slate-400'
                                      }`} />
                                      <span className={`${
                                        s.value === 'draft' ? 'text-yellow-600 dark:text-yellow-400' :
                                        s.value === 'ready' ? 'text-green-600 dark:text-green-400' :
                                        s.value === 'active' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600'
                                      }`}>
                                        {s.label}
                                      </span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )} />
                          <p className="text-xs text-slate-500 mt-1">
                            {PLAYBOOK_STATUSES.find(s => s.value === watch('status'))?.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* TRIGGERS */}
              <section id="triggers" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="triggers" title="Trigger Conditions" icon={AlertTriangle} description="Signals that activate this playbook">
                    <Button type="button" variant="outline" size="sm" onClick={() => triggersArray.append({ id: generateId(), description: "", source: "manual", severity: "warning", autoActivate: false })} data-testid="button-add-trigger">
                      <Plus className="mr-1.5 h-4 w-4" />Add
                    </Button>
                  </SectionHeader>
                  {expandedSections.triggers && (
                    <CardContent>
                      {triggersArray.fields.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed rounded-lg">No triggers defined</div>
                      ) : (
                        <div className="space-y-3">
                          {triggersArray.fields.map((field, index) => (
                            <div key={field.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-3" data-testid={`trigger-item-${index}`}>
                              <div className="flex gap-2">
                                <Input {...register(`triggerConditions.${index}.description`)} placeholder="Trigger description..." className="flex-1" />
                                <Button type="button" variant="ghost" size="sm" onClick={() => triggersArray.remove(index)}><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <Controller name={`triggerConditions.${index}.source`} control={control} render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                                    <SelectContent>{TRIGGER_SOURCES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                                  </Select>
                                )} />
                                <Controller name={`triggerConditions.${index}.severity`} control={control} render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                                    <SelectContent>{TRIGGER_SEVERITY.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                                  </Select>
                                )} />
                                <div className="flex items-center gap-2">
                                  <Controller name={`triggerConditions.${index}.autoActivate`} control={control} render={({ field }) => (
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  )} />
                                  <Label className="text-xs">Auto</Label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* ESCALATION */}
              <section id="escalation" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="escalation" title="Escalation Paths" icon={ArrowUpRight} description="When and how to escalate issues">
                    <Button type="button" variant="outline" size="sm" onClick={() => escalationArray.append({ id: generateId(), triggerCondition: "no_response", escalateTo: "", backupContact: "", timeToEscalate: 30, notificationChannels: ["email", "phone"] })}>
                      <Plus className="mr-1.5 h-4 w-4" />Add
                    </Button>
                  </SectionHeader>
                  {expandedSections.escalation && (
                    <CardContent>
                      {escalationArray.fields.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed rounded-lg">No escalation paths</div>
                      ) : (
                        <div className="space-y-3">
                          {escalationArray.fields.map((field, index) => (
                            <div key={field.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-3">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline">Path {index + 1}</Badge>
                                <Button type="button" variant="ghost" size="sm" onClick={() => escalationArray.remove(index)}><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Controller name={`escalationPaths.${index}.triggerCondition`} control={control} render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="When..." /></SelectTrigger>
                                    <SelectContent>{ESCALATION_TRIGGERS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                                  </Select>
                                )} />
                                <Controller name={`escalationPaths.${index}.timeToEscalate`} control={control} render={({ field }) => (
                                  <Select value={String(field.value)} onValueChange={(v) => field.onChange(parseInt(v))}>
                                    <SelectTrigger><SelectValue placeholder="Time" /></SelectTrigger>
                                    <SelectContent>{TIME_TARGETS.map(t => <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>)}</SelectContent>
                                  </Select>
                                )} />
                                <Controller name={`escalationPaths.${index}.escalateTo`} control={control} render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="Escalate to..." /></SelectTrigger>
                                    <SelectContent>{STAKEHOLDER_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                  </Select>
                                )} />
                                <Controller name={`escalationPaths.${index}.backupContact`} control={control} render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="Backup..." /></SelectTrigger>
                                    <SelectContent>{STAKEHOLDER_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                  </Select>
                                )} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* STAKEHOLDERS */}
              <section id="stakeholders" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="stakeholders" title="Stakeholders" icon={Users} description="Team roles and notifications">
                    <Button type="button" variant="outline" size="sm" onClick={() => stakeholdersArray.append({ role: "", userId: "", responsibility: "", notificationChannels: ["email"], isBackup: false })}>
                      <Plus className="mr-1.5 h-4 w-4" />Add
                    </Button>
                  </SectionHeader>
                  {expandedSections.stakeholders && (
                    <CardContent>
                      {stakeholdersArray.fields.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed rounded-lg">No stakeholders</div>
                      ) : (
                        <div className="space-y-3">
                          {stakeholdersArray.fields.map((field, index) => (
                            <div key={field.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-3">
                              <div className="flex gap-2">
                                <Controller name={`stakeholders.${index}.role`} control={control} render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-40"><SelectValue placeholder="Role..." /></SelectTrigger>
                                    <SelectContent>{STAKEHOLDER_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                  </Select>
                                )} />
                                <Input {...register(`stakeholders.${index}.userId`)} placeholder="Name/email" className="flex-1" />
                                <div className="flex items-center gap-1">
                                  <Controller name={`stakeholders.${index}.isBackup`} control={control} render={({ field }) => (
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  )} />
                                  <Label className="text-xs">Backup</Label>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={() => stakeholdersArray.remove(index)}><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                              </div>
                              <Input {...register(`stakeholders.${index}.responsibility`)} placeholder="Responsibility..." />
                              <div className="flex gap-1 flex-wrap">
                                <Controller name={`stakeholders.${index}.notificationChannels`} control={control} render={({ field }) => (
                                  <>
                                    {NOTIFICATION_CHANNELS.map(ch => {
                                      const channels = field.value || [];
                                      const isSelected = channels.includes(ch.value);
                                      return (
                                        <button key={ch.value} type="button" onClick={() => field.onChange(isSelected ? channels.filter((c: string) => c !== ch.value) : [...channels, ch.value])}
                                          className={`px-2 py-1 text-xs rounded-full border ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>
                                          {ch.label}
                                        </button>
                                      );
                                    })}
                                  </>
                                )} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </section>

              {/* EXECUTION STEPS */}
              <section id="steps" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="steps" title="Execution Steps" icon={Clock} description="Workflow with dependencies and approvals">
                    <Button type="button" variant="outline" size="sm" onClick={() => stepsArray.append({ id: generateId(), order: stepsArray.fields.length + 1, title: "", description: "", ownerId: "", timeTargetMinutes: 30, isParallel: false, dependsOn: [], approvalRequired: "none", approvalNotes: "", deliverables: "" })}>
                      <Plus className="mr-1.5 h-4 w-4" />Add
                    </Button>
                  </SectionHeader>
                  {expandedSections.steps && (
                    <CardContent>
                      {stepsArray.fields.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed rounded-lg">No steps</div>
                      ) : (
                        <div className="space-y-3">
                          {stepsArray.fields.map((field, index) => (
                            <div key={field.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-3">
                              <div className="flex gap-2 items-start">
                                <Badge variant="outline" className="shrink-0 w-7 h-7 flex items-center justify-center">{index + 1}</Badge>
                                <div className="flex-1 space-y-2">
                                  <Input {...register(`executionSteps.${index}.title`)} placeholder="Step title..." className="font-medium" />
                                  <Textarea {...register(`executionSteps.${index}.description`)} placeholder="Instructions..." rows={2} className="resize-none text-sm" />
                                  <div className="grid grid-cols-4 gap-2">
                                    <Controller name={`executionSteps.${index}.timeTargetMinutes`} control={control} render={({ field }) => (
                                      <Select value={String(field.value)} onValueChange={(v) => field.onChange(parseInt(v))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{TIME_TARGETS.map(t => <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>)}</SelectContent>
                                      </Select>
                                    )} />
                                    <Controller name={`executionSteps.${index}.ownerId`} control={control} render={({ field }) => (
                                      <Select value={field.value || ""} onValueChange={field.onChange}>
                                        <SelectTrigger><SelectValue placeholder="Owner" /></SelectTrigger>
                                        <SelectContent>{STAKEHOLDER_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                      </Select>
                                    )} />
                                    <Controller name={`executionSteps.${index}.approvalRequired`} control={control} render={({ field }) => (
                                      <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{APPROVAL_TYPES.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}</SelectContent>
                                      </Select>
                                    )} />
                                    <Controller name={`executionSteps.${index}.dependsOn`} control={control} render={({ field }) => (
                                      <Select value={(field.value || [])[0] || "none"} onValueChange={(v) => field.onChange(v === "none" ? [] : [v])}>
                                        <SelectTrigger><SelectValue placeholder="Depends on" /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="none">None</SelectItem>
                                          {watchedSteps?.slice(0, index).map((step, i) => (
                                            <SelectItem key={step.id} value={step.id}>Step {i + 1}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )} />
                                  </div>
                                  <Input {...register(`executionSteps.${index}.deliverables`)} placeholder="Deliverables..." />
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={() => stepsArray.remove(index)}><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* BUDGET */}
              <section id="budget" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="budget" title="Budget Allocation" icon={DollarSign} description="Pre-approved spending">
                    <Button type="button" variant="outline" size="sm" onClick={() => budgetArray.append({ id: generateId(), category: "personnel", amount: 0, preApproved: false, approvalThreshold: 50000, notes: "" })}>
                      <Plus className="mr-1.5 h-4 w-4" />Add
                    </Button>
                  </SectionHeader>
                  {expandedSections.budget && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <div>
                          <Label className="text-sm">Total Budget</Label>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-slate-400">$</span>
                            <Input type="number" {...register('totalBudget', { valueAsNumber: true })} placeholder="0" />
                          </div>
                        </div>
                        <div className="flex items-end">
                          <p className="text-sm"><span className="text-slate-500">Allocated:</span> <span className="font-semibold">${totalAllocatedBudget.toLocaleString()}</span></p>
                        </div>
                      </div>
                      {budgetArray.fields.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed rounded-lg">No budget lines</div>
                      ) : (
                        <div className="space-y-2">
                          {budgetArray.fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                              <Controller name={`budgetAllocations.${index}.category`} control={control} render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                                  <SelectContent>{BUDGET_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                                </Select>
                              )} />
                              <div className="flex items-center gap-1 w-28">
                                <span className="text-slate-400 text-sm">$</span>
                                <Input type="number" {...register(`budgetAllocations.${index}.amount`, { valueAsNumber: true })} placeholder="Amount" />
                              </div>
                              <div className="flex items-center gap-1">
                                <Controller name={`budgetAllocations.${index}.preApproved`} control={control} render={({ field }) => (
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                )} />
                                <Label className="text-xs flex items-center gap-1"><Lock className="h-3 w-3" />Pre-approved</Label>
                              </div>
                              <Input {...register(`budgetAllocations.${index}.notes`)} placeholder="Notes" className="flex-1" />
                              <Button type="button" variant="ghost" size="sm" onClick={() => budgetArray.remove(index)}><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* BUSINESS IMPACT */}
              <section id="impact" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="impact" title="Business Impact" icon={TrendingUp} description="Expected value from execution">
                    <Button type="button" variant="outline" size="sm" onClick={() => impactArray.append({ id: generateId(), type: "revenue_protection", estimatedValue: 0, valueUnit: "USD", description: "", measurementMethod: "" })}>
                      <Plus className="mr-1.5 h-4 w-4" />Add
                    </Button>
                  </SectionHeader>
                  {expandedSections.impact && (
                    <CardContent>
                      {impactArray.fields.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed rounded-lg">No impact metrics</div>
                      ) : (
                        <div className="space-y-2">
                          {impactArray.fields.map((field, index) => (
                            <div key={field.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2">
                              <div className="flex gap-2">
                                <Controller name={`businessImpacts.${index}.type`} control={control} render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                                    <SelectContent>{IMPACT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                                  </Select>
                                )} />
                                <div className="flex items-center gap-1 w-32">
                                  <span className="text-slate-400">$</span>
                                  <Input type="number" {...register(`businessImpacts.${index}.estimatedValue`, { valueAsNumber: true })} placeholder="Value" />
                                </div>
                                <Input {...register(`businessImpacts.${index}.description`)} placeholder="Description" className="flex-1" />
                                <Button type="button" variant="ghost" size="sm" onClick={() => impactArray.remove(index)}><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                              </div>
                              <Input {...register(`businessImpacts.${index}.measurementMethod`)} placeholder="How will this be measured?" />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* COMPLIANCE */}
              <section id="compliance" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="compliance" title="Compliance & Regulatory" icon={Scale} description="Legal and regulatory requirements">
                    <Button type="button" variant="outline" size="sm" onClick={() => complianceArray.append({ id: generateId(), framework: "", requirement: "", notes: "" })}>
                      <Plus className="mr-1.5 h-4 w-4" />Add Requirement
                    </Button>
                  </SectionHeader>
                  {expandedSections.compliance && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Legal Review Status</Label>
                          <Controller name="legalReviewStatus" control={control} render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                              <SelectContent>{LEGAL_REVIEW_STATUS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                            </Select>
                          )} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Legal Approver</Label>
                          <Input {...register('legalReviewApprover')} placeholder="Name of approver" className="mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Review Date</Label>
                          <Input type="date" {...register('legalReviewDate')} className="mt-1.5" />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                          <Controller name="auditTrailRequired" control={control} render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          )} />
                          <Label className="text-sm">Audit Trail Required</Label>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Compliance Frameworks</Label>
                        <Controller name="complianceFrameworks" control={control} render={({ field }) => (
                          <div className="flex flex-wrap gap-2">
                            {COMPLIANCE_FRAMEWORKS.map(f => {
                              const selected = (field.value || []).includes(f.value);
                              return (
                                <button key={f.value} type="button" onClick={() => field.onChange(selected ? field.value.filter((v: string) => v !== f.value) : [...(field.value || []), f.value])}
                                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${selected ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200'}`}>
                                  {f.label}
                                </button>
                              );
                            })}
                          </div>
                        )} />
                      </div>
                      {complianceArray.fields.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Specific Requirements</Label>
                          {complianceArray.fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                              <Controller name={`complianceRequirements.${index}.framework`} control={control} render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-36"><SelectValue placeholder="Framework" /></SelectTrigger>
                                  <SelectContent>{COMPLIANCE_FRAMEWORKS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                                </Select>
                              )} />
                              <Input {...register(`complianceRequirements.${index}.requirement`)} placeholder="Requirement" className="flex-1" />
                              <Button type="button" variant="ghost" size="sm" onClick={() => complianceArray.remove(index)}><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* RISK ASSESSMENT */}
              <section id="risk" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="risk" title="Risk Assessment" icon={Shield} description="Risk scoring and exposure" />
                  {expandedSections.risk && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Risk Score (1-10)</Label>
                          <Controller name="riskScore" control={control} render={({ field }) => (
                            <Select value={String(field.value)} onValueChange={(v) => field.onChange(parseInt(v))}>
                              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                              <SelectContent>{RISK_LEVELS.map(r => <SelectItem key={r.value} value={String(r.value)}>{r.label}</SelectItem>)}</SelectContent>
                            </Select>
                          )} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Max Financial Exposure</Label>
                          <div className="flex items-center gap-1 mt-1.5">
                            <span className="text-slate-400">$</span>
                            <Input type="number" {...register('maxFinancialExposure', { valueAsNumber: true })} placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Reputational Risk</Label>
                          <Controller name="reputationalRiskLevel" control={control} render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          )} />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Risk Notes</Label>
                        <Textarea {...register('riskNotes')} placeholder="Additional risk considerations..." rows={2} className="mt-1.5 resize-none" />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* EXTERNAL COMMUNICATIONS */}
              <section id="communications" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="communications" title="External Communications" icon={Megaphone} description="Press, investor, and board notifications" />
                  {expandedSections.communications && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <Controller name="pressResponseRequired" control={control} render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          )} />
                          <Label className="text-sm">Press/Media Response Required</Label>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <Controller name="investorNotificationRequired" control={control} render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          )} />
                          <Label className="text-sm">Investor Notification</Label>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <Controller name="boardNotificationRequired" control={control} render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          )} />
                          <Label className="text-sm">Board Notification</Label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Investor Notification Threshold</Label>
                          <Input {...register('investorNotificationThreshold')} placeholder="e.g., Material impact >$10M" className="mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Board Notification Threshold</Label>
                          <Input {...register('boardNotificationThreshold')} placeholder="e.g., Crisis level, >$50M exposure" className="mt-1.5" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Pre-Approved Messaging</Label>
                        <Textarea {...register('preApprovedMessaging')} placeholder="Pre-approved statements or talking points..." rows={3} className="mt-1.5 resize-none" />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* DEPENDENCIES */}
              <section id="dependencies" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="dependencies" title="Dependencies & Resources" icon={Link2} description="External vendors, systems, and resources">
                    <Button type="button" variant="outline" size="sm" onClick={() => dependenciesArray.append({ id: generateId(), type: "vendor", name: "", contactInfo: "", criticality: "medium", notes: "" })}>
                      <Plus className="mr-1.5 h-4 w-4" />Add
                    </Button>
                  </SectionHeader>
                  {expandedSections.dependencies && (
                    <CardContent>
                      {dependenciesArray.fields.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed rounded-lg">No dependencies</div>
                      ) : (
                        <div className="space-y-2">
                          {dependenciesArray.fields.map((field, index) => (
                            <div key={field.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2">
                              <div className="flex gap-2">
                                <Controller name={`dependencies.${index}.type`} control={control} render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                                    <SelectContent>{DEPENDENCY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                                  </Select>
                                )} />
                                <Input {...register(`dependencies.${index}.name`)} placeholder="Name" className="flex-1" />
                                <Controller name={`dependencies.${index}.criticality`} control={control} render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )} />
                                <Button type="button" variant="ghost" size="sm" onClick={() => dependenciesArray.remove(index)}><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Input {...register(`dependencies.${index}.contactInfo`)} placeholder="Contact info" />
                                <Input {...register(`dependencies.${index}.notes`)} placeholder="Notes" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* GOVERNANCE */}
              <section id="governance" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="governance" title="Governance & Versioning" icon={Settings} description="Ownership and review schedule" />
                  {expandedSections.governance && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Playbook Owner</Label>
                          <Input {...register('playbookOwner')} placeholder="Accountable executive" className="mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Owner Email</Label>
                          <Input {...register('playbookOwnerEmail')} type="email" placeholder="email@company.com" className="mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Next Review Date</Label>
                          <Input type="date" {...register('nextReviewDate')} className="mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Review Frequency</Label>
                          <Controller name="reviewFrequency" control={control} render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                              <SelectContent>{REVIEW_FREQUENCIES.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                            </Select>
                          )} />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Version Notes</Label>
                        <Textarea {...register('versionNotes')} placeholder="Changes in this version..." rows={2} className="mt-1.5 resize-none" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Controller name="changeApprovalRequired" control={control} render={({ field }) => (
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )} />
                        <Label className="text-sm">Changes Require Approval</Label>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* GEOGRAPHIC SCOPE */}
              <section id="geographic" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="geographic" title="Geographic Scope" icon={Globe} description="Regions and jurisdictions" />
                  {expandedSections.geographic && (
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Applicable Regions</Label>
                        <Controller name="geographicScope" control={control} render={({ field }) => (
                          <div className="flex flex-wrap gap-2">
                            {REGIONS.map(r => {
                              const selected = (field.value || []).includes(r.value);
                              return (
                                <button key={r.value} type="button" onClick={() => field.onChange(selected ? field.value.filter((v: string) => v !== r.value) : [...(field.value || []), r.value])}
                                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${selected ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200'}`}>
                                  {r.label}
                                </button>
                              );
                            })}
                          </div>
                        )} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Primary Timezone</Label>
                          <Input {...register('primaryTimezone')} placeholder="e.g., America/New_York, UTC" className="mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Local Regulatory Notes</Label>
                          <Input {...register('localRegulations')} placeholder="Jurisdiction-specific considerations" className="mt-1.5" />
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </section>
              
              {/* READINESS & TRAINING */}
              <section id="readiness" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="readiness" title="Readiness & Training" icon={GraduationCap} description="Drills and team preparation" />
                  {expandedSections.readiness && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Last Drill Date</Label>
                          <Input type="date" {...register('lastDrillDate')} className="mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Next Drill Date</Label>
                          <Input type="date" {...register('nextDrillDate')} className="mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Drill Frequency</Label>
                          <Controller name="drillFrequency" control={control} render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                              <SelectContent>{REVIEW_FREQUENCIES.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                            </Select>
                          )} />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Training Requirements</Label>
                        <Textarea {...register('trainingRequirements')} placeholder="Training needed for team members to execute this playbook..." rows={2} className="mt-1.5 resize-none" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Certification Requirements</Label>
                        <Input {...register('certificationRequirements')} placeholder="Required certifications (e.g., PMP, CISSP, legal bar)" className="mt-1.5" />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </section>

              {/* SUCCESS METRICS */}
              <section id="metrics" className="scroll-mt-24">
                <Card className="border-slate-200 dark:border-slate-800">
                  <SectionHeader id="metrics" title="Success Metrics" icon={Target} description="How success will be measured">
                    <Button type="button" variant="outline" size="sm" onClick={() => customMetricsArray.append({ name: "", target: "" })}>
                      <Plus className="mr-1.5 h-4 w-4" />Add Metric
                    </Button>
                  </SectionHeader>
                  {expandedSections.metrics && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Response Time Target (min)</Label>
                          <Input type="number" {...register('successMetrics.responseTimeTarget', { valueAsNumber: true })} className="mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Stakeholder Engagement Target</Label>
                          <Input type="number" {...register('successMetrics.stakeholdersTarget', { valueAsNumber: true })} className="mt-1.5" />
                        </div>
                      </div>
                      {customMetricsArray.fields.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Custom Metrics</Label>
                          {customMetricsArray.fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                              <Input {...register(`successMetrics.customMetrics.${index}.name`)} placeholder="Metric name" className="flex-1" />
                              <Input {...register(`successMetrics.customMetrics.${index}.target`)} placeholder="Target" className="w-32" />
                              <Button type="button" variant="ghost" size="sm" onClick={() => customMetricsArray.remove(index)}><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </section>
              
            </form>
          </div>
        </div>
      </div>
      
      {/* STICKY SAVE BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-6 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {Object.keys(errors).length > 0 && (
              <span className="text-red-500">Please fix errors before saving</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setLocation('/playbooks')} data-testid="button-cancel">Cancel</Button>
            <Button onClick={handleSubmit((data) => savePlaybook.mutate(data))} disabled={savePlaybook.isPending} data-testid="button-save-playbook">
              {savePlaybook.isPending ? "Saving..." : "Save Playbook"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
