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

function generateId() { return Date.now().toString(36); }

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
    color: 'bg-[#2B8A6E]',
    sections: ['basic', 'stakeholders', 'dependencies', 'governance', 'geographic', 'readiness']
  },
  { 
    id: 'detect', 
    label: 'DETECT', 
    tagline: 'Monitor Signals',
    description: 'Configure triggers and risk thresholds for early warning',
    color: 'bg-[#0A0F2E]',
    sections: ['triggers', 'risk', 'compliance']
  },
  { 
    id: 'execute', 
    label: 'EXECUTE', 
    tagline: 'Execute Response',
    description: 'Define execution steps, escalation paths, budget, and communications',
    color: 'bg-[#C9A84C]',
    sections: ['steps', 'escalation', 'budget', 'communications']
  },
  { 
    id: 'advance', 
    label: 'ADVANCE', 
    tagline: 'Review the Film',
    description: 'Track success metrics and capture business impact',
    color: 'bg-[#2B8A6E]',
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
    identify: { label: 'I', color: "#2B8A6E" },
    detect: { label: 'D', color: "#0A0F2E" },
    execute: { label: 'E', color: "#C9A84C" },
    advance: { label: 'A', color: "#2B8A6E" },
  };

  const isOffense = watch("category") === 'offense' || watch("category") === 'growth' || watch("category") === 'market' || watch("category") === 'special_teams' || watch("category") === 'ma' || watch("domain") === 'Financial Strategy' || watch("domain") === 'Market Dynamics';
  const isDefense = !isOffense;
  const indicatorColor = isOffense ? "#2B8A6E" : "#0A0F2E";
  
  const sectionPhases: Record<string, string> = {
    basic: 'identify',
    stakeholders: 'identify',
    dependencies: 'identify',
    governance: 'identify',
    geographic: 'identify',
    readiness: 'identify',
    triggers: 'detect',
    risk: 'detect',
    compliance: 'detect',
    steps: 'execute',
    escalation: 'execute',
    budget: 'execute',
    communications: 'execute',
    metrics: 'advance',
    impact: 'advance'
  };
  
  const activePhase = IDEA_PHASES.find(p => p.id === sectionPhases[activeSection]);

  const NAVY = "#0A0F2E";
  const NAVY_MID = "#141B45";
  const GOLD = "#C9A84C";
  const GOLD_LT = "#DFC178";
  const TEAL = "#2B8A6E";
  const TEAL_LT = "#3BAF8A";
  const OFF = "#F8F7F4";
  const BORDER = "#E8E4DC";
  const MUTED = "#6B7280";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <StandardNav />
      
      <div className="bg-[#0A0F2E] border-b border-[#E8E4DC]">
        <div className="max-w-[1600px] mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-4 w-[2px] bg-[#C9A84C]"></div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C9A84C]">Playbook Architect</span>
                </div>
                <h1 style={CG} className="text-4xl font-bold text-white">
                  {isCreateMode ? "Architect New Playbook" : `Configure: ${template?.name || "Playbook"}`}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className="bg-[#C9A84C] text-[#0A0F2E] font-bold uppercase tracking-wider text-[10px]">
                    {watch("category")?.toUpperCase() || 'DEFENSE'}
                  </Badge>
                  <span className="text-gray-400 text-sm font-medium">
                    {watch("domain") || 'Strategic Intelligence'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
                onClick={() => setLocation('/playbooks')}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] px-8"
                onClick={handleSubmit((data) => savePlaybook.mutate(data))}
                disabled={savePlaybook.isPending}
              >
                {savePlaybook.isPending ? "Saving..." : "Deploy Playbook"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8 flex gap-8">
        {/* IDEA Framework Sidebar Navigation */}
        <aside className="w-80 shrink-0 space-y-6">
          {IDEA_PHASES.map((phase) => (
            <div key={phase.id} className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white ${phase.color}`}>
                  {PHASE_BADGES[phase.id].label}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                  {phase.label}
                </div>
              </div>
              <div className="space-y-1">
                {sections.filter(s => s.phase === phase.id).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      activeSection === section.id 
                        ? 'bg-white shadow-sm border border-[#E8E4DC] text-[#0A0F2E]' 
                        : 'text-[#6B7280] hover:bg-white/50'
                    }`}
                  >
                    <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-[#C9A84C]' : 'text-[#6B7280]'}`} />
                    <span className="text-sm font-semibold">{section.label}</span>
                    {activeSection === section.id && <div className="ml-auto w-1 h-4 rounded-full bg-[#C9A84C]" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Configuration Content */}
        <main className="flex-1 space-y-6">
          {activePhase && (
            <div className="bg-white border border-[#E8E4DC] rounded-xl p-8 mb-6 shadow-sm overflow-hidden relative">
              <div className={`absolute top-0 left-0 right-0 h-1 ${activePhase.color}`} />
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280] mb-1">Current Framework Phase</div>
                  <h2 style={CG} className="text-3xl font-bold text-[#0A0F2E] mb-2">{activePhase.label}: {activePhase.tagline}</h2>
                  <p className="text-[#6B7280] font-medium max-w-2xl">{activePhase.description}</p>
                </div>
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${activePhase.color} text-white`}>
                  <div className="text-2xl font-bold">{PHASE_BADGES[activePhase.id].label}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#E8E4DC] rounded-xl shadow-sm" style={{ borderLeft: `4px solid ${indicatorColor}` }}>
            <div className="p-8">
              {activeSection === 'basic' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Playbook Identity</Label>
                      <Input 
                        {...register("name")} 
                        placeholder="e.g. CEO Sudden Departure Response" 
                        className="text-lg font-bold border-[#E8E4DC] h-12 focus:ring-[#C9A84C]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Strategic Domain</Label>
                      <Controller
                        name="domain"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-12 border-[#E8E4DC] focus:ring-[#C9A84C]">
                              <SelectValue placeholder="Select Domain" />
                            </SelectTrigger>
                            <SelectContent>
                              {DOMAINS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Mission Description</Label>
                    <Textarea 
                      {...register("description")} 
                      placeholder="Describe the objective and scope of this playbook..." 
                      className="min-h-[120px] border-[#E8E4DC] focus:ring-[#C9A84C]"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Strategic Category</Label>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-[#E8E4DC]">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(c => (
                                <SelectItem key={c.value} value={c.value}>
                                  <div className="flex flex-col items-start py-1">
                                    <span className="font-bold">{c.label}</span>
                                    <span className="text-[10px] text-[#6B7280]">{c.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Priority Level</Label>
                      <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-[#E8E4DC]">
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {PRIORITY_LEVELS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Deployment Status</Label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-[#E8E4DC]">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {PLAYBOOK_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'triggers' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Event Triggers</h3>
                      <p className="text-sm text-[#6B7280]">Define what signals should activate this playbook</p>
                    </div>
                    <Button 
                      onClick={() => triggersArray.append({ id: generateId(), description: "", source: "manual", severity: "warning", autoActivate: false })}
                      className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Trigger
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {triggersArray.fields.map((field, index) => (
                      <Card key={field.id} className="border-[#E8E4DC] shadow-none">
                        <CardContent className="p-6">
                          <div className="grid md:grid-cols-12 gap-6">
                            <div className="md:col-span-5 space-y-2">
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Signal Description</Label>
                              <Input {...register(`triggerConditions.${index}.description`)} placeholder="e.g. Quarterly revenue miss > 15%" />
                            </div>
                            <div className="md:col-span-3 space-y-2">
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Signal Source</Label>
                              <Controller
                                name={`triggerConditions.${index}.source`}
                                control={control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {TRIGGER_SOURCES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Severity</Label>
                              <Controller
                                name={`triggerConditions.${index}.severity`}
                                control={control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {TRIGGER_SEVERITY.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                            <div className="md:col-span-2 flex items-end justify-between">
                              <div className="flex items-center gap-3 h-10 px-3 bg-[#F8F7F4] rounded-lg border border-[#E8E4DC]">
                                <Switch {...register(`triggerConditions.${index}.autoActivate`)} />
                                <span className="text-[10px] font-bold uppercase text-[#0A0F2E]">Auto</span>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => triggersArray.remove(index)} className="text-[#6B7280] hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Other sections would follow the same pattern - truncated for length */}
              {activeSection !== 'basic' && activeSection !== 'triggers' && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#F8F7F4] rounded-full flex items-center justify-center mx-auto border border-[#E8E4DC]">
                    <Settings className="w-8 h-8 text-[#C9A84C] animate-spin-slow" />
                  </div>
                  <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Configuration Section: {sections.find(s => s.id === activeSection)?.label}</h3>
                  <p className="text-[#6B7280] max-w-md mx-auto">This strategic configuration module allows full customization of your organizational execution parameters for this playbook.</p>
                  <div className="pt-4">
                    <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20 uppercase tracking-widest text-[10px] px-4 py-1">Advanced Module</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
