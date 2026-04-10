import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLayout from "@/components/layout/PageLayout";
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
    sections: ['metrics', 'impact', 'ownership']
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
  { id: 'impact', label: 'Business Impact', icon: TrendingUp, phase: 'advance' },
  { id: 'ownership', label: 'Challenge Rights', icon: Lock, phase: 'advance' }
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
    geographic: false, readiness: false, metrics: false, ownership: false
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

  const isOffense = watch("category") === 'OFFENSE' || watch("category") === 'GROWTH' || watch("category") === 'MARKET' || watch("category") === 'SPECIAL_TEAMS' || watch("category") === 'MA' || watch("domain") === 'Financial Strategy' || watch("domain") === 'Market Dynamics';
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
    impact: 'advance',
    ownership: 'advance'
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
    <PageLayout>
      
      <div className="bg-[#0A0F2E] border-b border-[#E8E4DC]">
        <div className="max-w-[1600px] mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
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
                  <span className="text-[#6B7280] text-sm font-medium">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left ${
                      activeSection === section.id 
                        ? 'bg-white border border-[#E8E4DC] text-[#0A0F2E]' 
                        : 'text-[#6B7280] hover:bg-white/50'
                    }`}
                  >
                    <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-[#C9A84C]' : 'text-[#6B7280]'}`} />
                    <span className="text-sm font-semibold">{section.label}</span>
                    {activeSection === section.id && <div className="ml-auto w-1 h-4 bg-[#C9A84C]" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Configuration Content */}
        <main className="flex-1 space-y-6">
          {activePhase && (
            <div className="bg-white border border-[#E8E4DC] p-8 mb-6 overflow-hidden relative">
              <div className={`absolute top-0 left-0 right-0 h-1 ${activePhase.color}`} />
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280] mb-1">Current Framework Phase</div>
                  <h2 style={CG} className="text-3xl font-bold text-[#0A0F2E] mb-2">{activePhase.label}: {activePhase.tagline}</h2>
                  <p className="text-[#6B7280] font-medium max-w-2xl">{activePhase.description}</p>
                </div>
                <div className={`w-16 h-16 flex items-center justify-center shrink-0 ${activePhase.color} text-white`}>
                  <div className="text-2xl font-bold">{PHASE_BADGES[activePhase.id].label}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#E8E4DC]" style={{ borderLeft: `4px solid ${indicatorColor}` }}>
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
                              <div className="flex items-center gap-3 h-10 px-3 bg-[#F8F7F4] border border-[#E8E4DC]">
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

              {/* ── STAKEHOLDERS ─────────────────────────────────── */}
              {activeSection === 'stakeholders' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Stakeholder Roster</h3>
                      <p className="text-sm text-[#6B7280]">Define roles, responsibilities, and notification paths</p></div>
                    <Button onClick={() => stakeholdersArray.append({ role: '', responsibility: '', notificationChannels: [], isBackup: false })} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><Plus className="w-4 h-4 mr-2" />Add Stakeholder</Button>
                  </div>
                  {stakeholdersArray.fields.length === 0 && <div className="py-12 text-center border-2 border-dashed border-[#E8E4DC]"><Users className="w-10 h-10 text-[#C9A84C] mx-auto mb-3" /><p className="text-[#6B7280] font-medium">No stakeholders added yet. Click "Add Stakeholder" to begin.</p></div>}
                  <div className="space-y-4">
                    {stakeholdersArray.fields.map((field, index) => (
                      <Card key={field.id} className="border-[#E8E4DC] shadow-none">
                        <CardContent className="p-6 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Role / Title</Label><Input {...register(`stakeholders.${index}.role`)} placeholder="e.g. Chief Communications Officer" /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Responsibility</Label><Input {...register(`stakeholders.${index}.responsibility`)} placeholder="e.g. Lead external communications" /></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 px-3 py-2 bg-[#F8F7F4] border border-[#E8E4DC]">
                              <Controller name={`stakeholders.${index}.isBackup`} control={control} render={({ field: f }) => <Switch checked={!!f.value} onCheckedChange={f.onChange} />} />
                              <span className="text-xs font-bold uppercase tracking-wider text-[#0A0F2E]">Backup Role</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => stakeholdersArray.remove(index)} className="text-[#6B7280] hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ── DEPENDENCIES ─────────────────────────────────── */}
              {activeSection === 'dependencies' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">External Dependencies</h3>
                      <p className="text-sm text-[#6B7280]">Vendors, systems, and partners required for execution</p></div>
                    <Button onClick={() => dependenciesArray.append({ id: generateId(), type: 'vendor', name: '', contactInfo: '', criticality: 'high', notes: '' })} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><Plus className="w-4 h-4 mr-2" />Add Dependency</Button>
                  </div>
                  {dependenciesArray.fields.length === 0 && <div className="py-12 text-center border-2 border-dashed border-[#E8E4DC]"><Link2 className="w-10 h-10 text-[#C9A84C] mx-auto mb-3" /><p className="text-[#6B7280] font-medium">No dependencies defined. Click "Add Dependency" to document what you rely on.</p></div>}
                  <div className="space-y-4">
                    {dependenciesArray.fields.map((field, index) => (
                      <Card key={field.id} className="border-[#E8E4DC] shadow-none">
                        <CardContent className="p-6 space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Type</Label>
                              <Controller name={`dependencies.${index}.type`} control={control} render={({ field: f }) => (
                                <Select onValueChange={f.onChange} value={f.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DEPENDENCY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select>
                              )} /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Name</Label><Input {...register(`dependencies.${index}.name`)} placeholder="e.g. AWS CloudFront, Legal Counsel" /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Criticality</Label>
                              <Controller name={`dependencies.${index}.criticality`} control={control} render={({ field: f }) => (
                                <Select onValueChange={f.onChange} value={f.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select>
                              )} /></div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Contact Info</Label><Input {...register(`dependencies.${index}.contactInfo`)} placeholder="Email, phone, or escalation path" /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Notes</Label><Input {...register(`dependencies.${index}.notes`)} placeholder="SLA, backup options, or contingency" /></div>
                          </div>
                          <div className="flex justify-end"><Button variant="ghost" size="icon" onClick={() => dependenciesArray.remove(index)} className="text-[#6B7280] hover:text-red-600"><Trash2 className="w-4 h-4" /></Button></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ── GOVERNANCE ─────────────────────────────────── */}
              {activeSection === 'governance' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Governance & Ownership</h3>
                    <p className="text-sm text-[#6B7280]">Define accountability, review cadence, and change control</p></div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Playbook Owner</Label><Input {...register('playbookOwner')} placeholder="e.g. VP of Strategy" /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Owner Email</Label><Input {...register('playbookOwnerEmail')} type="email" placeholder="owner@company.com" /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Next Review Date</Label><Input {...register('nextReviewDate')} type="date" /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Review Frequency</Label>
                      <Controller name="reviewFrequency" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{REVIEW_FREQUENCIES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent></Select>
                      )} /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Version Notes</Label><Textarea {...register('versionNotes')} placeholder="What changed in this version and why..." className="min-h-[100px]" /></div>
                  <div className="flex items-center gap-4 p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <Controller name="changeApprovalRequired" control={control} render={({ field: f }) => <Switch checked={!!f.value} onCheckedChange={f.onChange} />} />
                    <div><p className="text-sm font-bold text-[#0A0F2E]">Require Change Approval</p><p className="text-xs text-[#6B7280]">Any modification to this playbook requires executive sign-off before saving</p></div>
                  </div>
                </div>
              )}

              {/* ── GEOGRAPHIC ─────────────────────────────────── */}
              {activeSection === 'geographic' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Geographic Scope</h3>
                    <p className="text-sm text-[#6B7280]">Define regions, jurisdictions, and regulatory considerations</p></div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Active Regions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {REGIONS.map(region => {
                        const scope = watch('geographicScope') || [];
                        const isActive = scope.includes(region.value);
                        return (
                          <button key={region.value} type="button"
                            onClick={() => { const cur = watch('geographicScope') || []; const next = isActive ? cur.filter((r: string) => r !== region.value) : [...cur, region.value]; form.setValue('geographicScope', next); }}
                            className={`px-3 py-2 border text-xs font-bold text-left transition-all ${isActive ? 'bg-[#0A0F2E] text-white border-[#0A0F2E]' : 'bg-white text-[#6B7280] border-[#E8E4DC] hover:border-[#0A0F2E]'}`}>
                            {region.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Primary Timezone</Label><Input {...register('primaryTimezone')} placeholder="e.g. America/New_York, UTC, Europe/London" /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Local Regulations</Label><Input {...register('localRegulations')} placeholder="e.g. GDPR (EU), CCPA (California), FSA (UK)" /></div>
                  </div>
                </div>
              )}

              {/* ── READINESS ─────────────────────────────────── */}
              {activeSection === 'readiness' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Readiness & Drill Schedule</h3>
                    <p className="text-sm text-[#6B7280]">Practice makes perfect — schedule drills, training, and certification requirements</p></div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Last Drill Date</Label><Input {...register('lastDrillDate')} type="date" /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Next Drill Date</Label><Input {...register('nextDrillDate')} type="date" /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Drill Frequency</Label>
                      <Controller name="drillFrequency" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{REVIEW_FREQUENCIES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent></Select>
                      )} /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Training Requirements</Label><Textarea {...register('trainingRequirements')} placeholder="Required training courses, certifications, or briefings team members must complete..." className="min-h-[100px]" /></div>
                  <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Certification Requirements</Label><Textarea {...register('certificationRequirements')} placeholder="Specific certifications, clearance levels, or qualifications required to execute this playbook..." className="min-h-[100px]" /></div>
                </div>
              )}

              {/* ── RISK ─────────────────────────────────── */}
              {activeSection === 'risk' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Risk Assessment</h3>
                    <p className="text-sm text-[#6B7280]">Quantify the risk profile before execution begins</p></div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Risk Score (1–10)</Label>
                      <Controller name="riskScore" control={control} render={({ field }) => (
                        <Select onValueChange={v => field.onChange(Number(v))} value={String(field.value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{RISK_LEVELS.map(r => <SelectItem key={r.value} value={String(r.value)}>{r.label}</SelectItem>)}</SelectContent></Select>
                      )} /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Max Financial Exposure ($)</Label><Input {...register('maxFinancialExposure', { valueAsNumber: true })} type="number" placeholder="0" /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Reputational Risk Level</Label>
                      <Controller name="reputationalRiskLevel" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select>
                      )} /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Risk Notes</Label><Textarea {...register('riskNotes')} placeholder="Describe specific risks, mitigations, and contingency considerations..." className="min-h-[120px]" /></div>
                </div>
              )}

              {/* ── COMPLIANCE ─────────────────────────────────── */}
              {activeSection === 'compliance' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Compliance & Legal</h3>
                    <p className="text-sm text-[#6B7280]">Regulatory frameworks, legal review, and audit trail requirements</p></div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Applicable Frameworks</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {COMPLIANCE_FRAMEWORKS.map(fw => {
                        const cur = watch('complianceFrameworks') || [];
                        const isActive = cur.includes(fw.value);
                        return (
                          <button key={fw.value} type="button"
                            onClick={() => { const next = isActive ? cur.filter((f: string) => f !== fw.value) : [...cur, fw.value]; form.setValue('complianceFrameworks', next); }}
                            className={`px-3 py-2 border text-xs font-bold text-left transition-all ${isActive ? 'bg-[#0A0F2E] text-white border-[#0A0F2E]' : 'bg-white text-[#6B7280] border-[#E8E4DC] hover:border-[#0A0F2E]'}`}>
                            {fw.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Legal Review Status</Label>
                      <Controller name="legalReviewStatus" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{LEGAL_REVIEW_STATUS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select>
                      )} /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Legal Approver</Label><Input {...register('legalReviewApprover')} placeholder="General Counsel, outside firm..." /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Review Date</Label><Input {...register('legalReviewDate')} type="date" /></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <Controller name="auditTrailRequired" control={control} render={({ field: f }) => <Switch checked={!!f.value} onCheckedChange={f.onChange} />} />
                    <div><p className="text-sm font-bold text-[#0A0F2E]">Audit Trail Required</p><p className="text-xs text-[#6B7280]">Every action during this playbook's execution will be logged for compliance review</p></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Specific Compliance Requirements</Label>
                      <Button size="sm" onClick={() => complianceArray.append({ id: generateId(), framework: 'sox', requirement: '', notes: '' })} className="bg-[#0A0F2E] text-white hover:bg-[#141B45] text-xs"><Plus className="w-3 h-3 mr-1" />Add</Button>
                    </div>
                    {complianceArray.fields.map((field, index) => (
                      <div key={field.id} className="grid md:grid-cols-12 gap-3 items-end">
                        <div className="md:col-span-3 space-y-1"><Label className="text-[9px] uppercase tracking-widest font-bold text-[#6B7280]">Framework</Label>
                          <Controller name={`complianceRequirements.${index}.framework`} control={control} render={({ field: f }) => (
                            <Select onValueChange={f.onChange} value={f.value}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{COMPLIANCE_FRAMEWORKS.map(fw => <SelectItem key={fw.value} value={fw.value}>{fw.label}</SelectItem>)}</SelectContent></Select>
                          )} /></div>
                        <div className="md:col-span-5 space-y-1"><Label className="text-[9px] uppercase tracking-widest font-bold text-[#6B7280]">Requirement</Label><Input {...register(`complianceRequirements.${index}.requirement`)} className="h-9 text-xs" placeholder="Specific obligation or control..." /></div>
                        <div className="md:col-span-3 space-y-1"><Label className="text-[9px] uppercase tracking-widest font-bold text-[#6B7280]">Notes</Label><Input {...register(`complianceRequirements.${index}.notes`)} className="h-9 text-xs" placeholder="Evidence, references..." /></div>
                        <div className="md:col-span-1"><Button variant="ghost" size="icon" onClick={() => complianceArray.remove(index)} className="text-[#6B7280] hover:text-red-600 h-9 w-9"><Trash2 className="w-3 h-3" /></Button></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── EXECUTION STEPS ─────────────────────────────────── */}
              {activeSection === 'steps' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Execution Steps</h3>
                      <p className="text-sm text-[#6B7280]">Define the sequence of actions from trigger to resolution</p></div>
                    <Button onClick={() => stepsArray.append({ id: generateId(), order: stepsArray.fields.length + 1, title: '', description: '', timeTargetMinutes: 30, isParallel: false, dependsOn: [], approvalRequired: 'none', approvalNotes: '', deliverables: '' })} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><Plus className="w-4 h-4 mr-2" />Add Step</Button>
                  </div>
                  {stepsArray.fields.length === 0 && <div className="py-12 text-center border-2 border-dashed border-[#E8E4DC]"><Clock className="w-10 h-10 text-[#C9A84C] mx-auto mb-3" /><p className="text-[#6B7280] font-medium">No steps defined yet. Click "Add Step" to build your execution sequence.</p></div>}
                  <div className="space-y-4">
                    {stepsArray.fields.map((field, index) => (
                      <Card key={field.id} className="border-[#E8E4DC] shadow-none">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-[#0A0F2E] text-white flex items-center justify-center text-sm font-bold shrink-0">{index + 1}</div>
                            <Input {...register(`executionSteps.${index}.title`)} placeholder="Step title — e.g. Activate crisis communications team" className="font-bold text-base border-0 border-b border-[#E8E4DC] rounded-none px-0 focus-visible:ring-0" />
                            <Button variant="ghost" size="icon" onClick={() => stepsArray.remove(index)} className="text-[#6B7280] hover:text-red-600 shrink-0"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                          <Textarea {...register(`executionSteps.${index}.description`)} placeholder="Detailed instructions for this step..." className="min-h-[80px] text-sm" />
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Time Target (min)</Label><Input {...register(`executionSteps.${index}.timeTargetMinutes`, { valueAsNumber: true })} type="number" placeholder="30" /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Approval Required</Label>
                              <Controller name={`executionSteps.${index}.approvalRequired`} control={control} render={({ field: f }) => (
                                <Select onValueChange={f.onChange} value={f.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{APPROVAL_TYPES.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}</SelectContent></Select>
                              )} /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Deliverable</Label><Input {...register(`executionSteps.${index}.deliverables`)} placeholder="What this step produces" /></div>
                          </div>
                          <div className="flex items-center gap-3 px-3 py-2 bg-[#F8F7F4] border border-[#E8E4DC] w-fit">
                            <Controller name={`executionSteps.${index}.isParallel`} control={control} render={({ field: f }) => <Switch checked={!!f.value} onCheckedChange={f.onChange} />} />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0A0F2E]">Run in Parallel</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ESCALATION ─────────────────────────────────── */}
              {activeSection === 'escalation' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Escalation Paths</h3>
                      <p className="text-sm text-[#6B7280]">Define when and how situations escalate to senior leadership</p></div>
                    <Button onClick={() => escalationArray.append({ id: generateId(), triggerCondition: '', escalateTo: '', backupContact: '', timeToEscalate: 60, notificationChannels: [] })} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><Plus className="w-4 h-4 mr-2" />Add Path</Button>
                  </div>
                  {escalationArray.fields.length === 0 && <div className="py-12 text-center border-2 border-dashed border-[#E8E4DC]"><ArrowUpRight className="w-10 h-10 text-[#C9A84C] mx-auto mb-3" /><p className="text-[#6B7280] font-medium">No escalation paths defined. Every serious playbook needs one.</p></div>}
                  <div className="space-y-4">
                    {escalationArray.fields.map((field, index) => (
                      <Card key={field.id} className="border-[#E8E4DC] shadow-none">
                        <CardContent className="p-6 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Trigger Condition</Label><Input {...register(`escalationPaths.${index}.triggerCondition`)} placeholder="e.g. No resolution within 2 hours" /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Escalate To</Label><Input {...register(`escalationPaths.${index}.escalateTo`)} placeholder="e.g. CEO, Board Chair, General Counsel" /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Backup Contact</Label><Input {...register(`escalationPaths.${index}.backupContact`)} placeholder="Alternate if primary unavailable" /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Time to Escalate (min)</Label><Input {...register(`escalationPaths.${index}.timeToEscalate`, { valueAsNumber: true })} type="number" placeholder="60" /></div>
                          </div>
                          <div className="flex justify-end"><Button variant="ghost" size="icon" onClick={() => escalationArray.remove(index)} className="text-[#6B7280] hover:text-red-600"><Trash2 className="w-4 h-4" /></Button></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ── BUDGET ─────────────────────────────────── */}
              {activeSection === 'budget' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Budget Allocation</h3>
                      <p className="text-sm text-[#6B7280]">Pre-authorize spending categories so execution is never delayed by budget approval</p></div>
                    <Button onClick={() => budgetArray.append({ id: generateId(), category: 'personnel', amount: 0, preApproved: false, approvalThreshold: 0, notes: '' })} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><Plus className="w-4 h-4 mr-2" />Add Line Item</Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 p-6 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Total Pre-Approved Budget</Label><Input {...register('totalBudget', { valueAsNumber: true })} type="number" placeholder="0" className="text-2xl font-bold h-14" /></div>
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Currency</Label>
                      <Controller name="budgetCurrency" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger className="h-14"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD — US Dollar</SelectItem><SelectItem value="EUR">EUR — Euro</SelectItem><SelectItem value="GBP">GBP — British Pound</SelectItem><SelectItem value="CAD">CAD — Canadian Dollar</SelectItem><SelectItem value="AUD">AUD — Australian Dollar</SelectItem></SelectContent></Select>
                      )} /></div>
                  </div>
                  {totalAllocatedBudget > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-[#C9A84C]/10 border border-[#C9A84C]/30">
                      <span className="text-sm font-bold text-[#0A0F2E]">Total Allocated Across Categories</span>
                      <span className="text-lg font-bold text-[#C9A84C]">{watch('budgetCurrency')} {totalAllocatedBudget.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="space-y-4">
                    {budgetArray.fields.map((field, index) => (
                      <Card key={field.id} className="border-[#E8E4DC] shadow-none">
                        <CardContent className="p-5">
                          <div className="grid md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-3 space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Category</Label>
                              <Controller name={`budgetAllocations.${index}.category`} control={control} render={({ field: f }) => (
                                <Select onValueChange={f.onChange} value={f.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{BUDGET_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select>
                              )} /></div>
                            <div className="md:col-span-2 space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Amount</Label><Input {...register(`budgetAllocations.${index}.amount`, { valueAsNumber: true })} type="number" placeholder="0" /></div>
                            <div className="md:col-span-2 space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Approval Above</Label><Input {...register(`budgetAllocations.${index}.approvalThreshold`, { valueAsNumber: true })} type="number" placeholder="0" /></div>
                            <div className="md:col-span-4 space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Notes</Label><Input {...register(`budgetAllocations.${index}.notes`)} placeholder="Vendor, purpose, or conditions..." /></div>
                            <div className="md:col-span-1 flex items-center gap-2">
                              <Controller name={`budgetAllocations.${index}.preApproved`} control={control} render={({ field: f }) => <Switch checked={!!f.value} onCheckedChange={f.onChange} />} />
                              <Button variant="ghost" size="icon" onClick={() => budgetArray.remove(index)} className="text-[#6B7280] hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {budgetArray.fields.length === 0 && <div className="py-10 text-center border-2 border-dashed border-[#E8E4DC]"><DollarSign className="w-10 h-10 text-[#C9A84C] mx-auto mb-3" /><p className="text-[#6B7280] font-medium">No budget line items. Pre-authorized spending eliminates approval delays during execution.</p></div>}
                  </div>
                </div>
              )}

              {/* ── COMMUNICATIONS ─────────────────────────────────── */}
              {activeSection === 'communications' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Communications Protocol</h3>
                    <p className="text-sm text-[#6B7280]">Pre-define notification thresholds for press, investors, and the board</p></div>
                  <div className="space-y-6">
                    {[
                      { switchName: 'pressResponseRequired' as const, label: 'Press Response Required', desc: 'This situation requires coordinated external communications and media management' },
                      { switchName: 'investorNotificationRequired' as const, label: 'Investor Notification Required', desc: 'Material event requiring timely investor disclosure' },
                      { switchName: 'boardNotificationRequired' as const, label: 'Board Notification Required', desc: 'Board must be briefed as part of this playbook execution' },
                    ].map(({ switchName, label, desc }) => (
                      <div key={switchName} className="flex items-center gap-4 p-5 bg-[#F8F7F4] border border-[#E8E4DC]">
                        <Controller name={switchName} control={control} render={({ field: f }) => <Switch checked={!!f.value} onCheckedChange={f.onChange} />} />
                        <div><p className="text-sm font-bold text-[#0A0F2E]">{label}</p><p className="text-xs text-[#6B7280]">{desc}</p></div>
                      </div>
                    ))}
                  </div>
                  {watch('investorNotificationRequired') && (
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Investor Notification Threshold</Label><Input {...register('investorNotificationThreshold')} placeholder="e.g. Material financial impact above $10M, regulatory action..." /></div>
                  )}
                  {watch('boardNotificationRequired') && (
                    <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Board Notification Threshold</Label><Input {...register('boardNotificationThreshold')} placeholder="e.g. Reputational risk, regulatory involvement, C-suite departure..." /></div>
                  )}
                  <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Pre-Approved Messaging</Label><Textarea {...register('preApprovedMessaging')} placeholder="Key messages, approved statements, or holding lines that can be used immediately upon activation..." className="min-h-[140px]" /></div>
                </div>
              )}

              {/* ── SUCCESS METRICS ─────────────────────────────────── */}
              {activeSection === 'metrics' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Success Metrics</h3>
                    <p className="text-sm text-[#6B7280]">Define what "winning" looks like — measurable targets for execution performance</p></div>
                  <div className="grid md:grid-cols-2 gap-8 p-6 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Response Time Target (minutes)</Label>
                      <Input {...register('successMetrics.responseTimeTarget', { valueAsNumber: true })} type="number" placeholder="12" className="text-3xl font-bold h-16 text-[#C9A84C]" />
                      <p className="text-xs text-[#6B7280]">Target: 12 minutes — the VaughnMartin Execution Standard</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Stakeholders to Activate</Label>
                      <Input {...register('successMetrics.stakeholdersTarget', { valueAsNumber: true })} type="number" placeholder="5" className="text-3xl font-bold h-16" />
                      <p className="text-xs text-[#6B7280]">Number of stakeholders who must acknowledge and engage</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Custom Success Metrics</Label>
                      <Button size="sm" onClick={() => customMetricsArray.append({ name: '', target: '' })} className="bg-[#0A0F2E] text-white hover:bg-[#141B45] text-xs"><Plus className="w-3 h-3 mr-1" />Add Metric</Button>
                    </div>
                    {customMetricsArray.fields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-end">
                        <div className="flex-1 space-y-1"><Label className="text-[9px] uppercase tracking-widest font-bold text-[#6B7280]">Metric Name</Label><Input {...register(`successMetrics.customMetrics.${index}.name`)} placeholder="e.g. Media coverage contained, Revenue impact limited" /></div>
                        <div className="flex-1 space-y-1"><Label className="text-[9px] uppercase tracking-widest font-bold text-[#6B7280]">Target</Label><Input {...register(`successMetrics.customMetrics.${index}.target`)} placeholder="e.g. Zero negative headlines, &lt;$2M exposure" /></div>
                        <Button variant="ghost" size="icon" onClick={() => customMetricsArray.remove(index)} className="text-[#6B7280] hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── BUSINESS IMPACT ─────────────────────────────────── */}
              {activeSection === 'impact' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div><h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Business Impact</h3>
                      <p className="text-sm text-[#6B7280]">Quantify the value this playbook delivers when executed effectively</p></div>
                    <Button onClick={() => impactArray.append({ id: generateId(), type: 'revenue_protection', estimatedValue: 0, valueUnit: 'USD', description: '', measurementMethod: '' })} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"><Plus className="w-4 h-4 mr-2" />Add Impact</Button>
                  </div>
                  {impactArray.fields.length === 0 && <div className="py-12 text-center border-2 border-dashed border-[#E8E4DC]"><TrendingUp className="w-10 h-10 text-[#C9A84C] mx-auto mb-3" /><p className="text-[#6B7280] font-medium">Define the measurable business value this playbook protects or creates.</p></div>}
                  <div className="space-y-4">
                    {impactArray.fields.map((field, index) => (
                      <Card key={field.id} className="border-[#E8E4DC] shadow-none">
                        <CardContent className="p-6 space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Impact Type</Label>
                              <Controller name={`businessImpacts.${index}.type`} control={control} render={({ field: f }) => (
                                <Select onValueChange={f.onChange} value={f.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{IMPACT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select>
                              )} /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Estimated Value</Label><Input {...register(`businessImpacts.${index}.estimatedValue`, { valueAsNumber: true })} type="number" placeholder="0" /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Unit</Label>
                              <Controller name={`businessImpacts.${index}.valueUnit`} control={control} render={({ field: f }) => (
                                <Select onValueChange={f.onChange} value={f.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem><SelectItem value="hours">Hours</SelectItem><SelectItem value="percentage">Percentage</SelectItem></SelectContent></Select>
                              )} /></div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Description</Label><Textarea {...register(`businessImpacts.${index}.description`)} placeholder="Explain what value is protected or created..." className="min-h-[80px]" /></div>
                            <div className="space-y-2"><Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Measurement Method</Label><Textarea {...register(`businessImpacts.${index}.measurementMethod`)} placeholder="How will you measure and validate this impact post-execution?" className="min-h-[80px]" /></div>
                          </div>
                          <div className="flex justify-end"><Button variant="ghost" size="icon" onClick={() => impactArray.remove(index)} className="text-[#6B7280] hover:text-red-600"><Trash2 className="w-4 h-4" /></Button></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CHALLENGE RIGHTS / OWNERSHIP ──────────────────────── */}
              {activeSection === 'ownership' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div>
                    <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E]">Challenge Rights</h3>
                    <p className="text-sm text-[#6B7280] mt-1">The operational moat. The executive who activates this playbook must have been in the room building it — not receiving it.</p>
                  </div>

                  {/* Principle callout */}
                  <div style={{ borderLeft: "3px solid #C9A84C", background: "#F8F7F4", padding: "24px 24px 24px 28px" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: 12 }}>Design Principle</div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#0A0F2E", lineHeight: 1.6, fontStyle: "italic", marginBottom: 12 }}>
                      "Preparation that produces compliance looks identical to preparation that produces commitment. The three criteria that separate them: participation in construction, the right to challenge any assumption, and a plan that reflects the owner's specific judgment."
                    </p>
                    <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
                      This section is where the playbook owner formally exercises their challenge rights — before the trigger fires, not after.
                    </div>
                  </div>

                  {/* Ownership confirmation */}
                  <div className="p-6 border border-[#E8E4DC] space-y-4">
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#0A0F2E", marginBottom: 4 }}>Ownership Confirmation</div>
                    <p className="text-sm text-[#6B7280]">The owner of this playbook was involved in its construction, not just its receipt.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Playbook Owner</Label>
                        <Input {...register('playbookOwner')} placeholder="Name of the executive who will activate this" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Owner Email</Label>
                        <Input {...register('playbookOwnerEmail')} type="email" placeholder="owner@company.com" />
                      </div>
                    </div>
                  </div>

                  {/* Challenge log */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Challenges & Flagged Assumptions</Label>
                      <p className="text-xs text-[#6B7280] mt-1">Document any assumption you question, gap you've identified, or condition where this playbook would fail. These become the basis for the next revision cycle.</p>
                    </div>
                    <Textarea
                      {...register('versionNotes')}
                      placeholder={`Example challenges:\n— "This assumes Legal can turn a response in 2 hours. In Q4 that's not realistic."\n— "The supply chain step skips our Southeast Asia suppliers — they have a different escalation path."\n— "Step 4 requires CFO sign-off but doesn't account for board travel schedules."`}
                      className="min-h-[180px] font-mono text-sm"
                    />
                    <div className="flex items-start gap-3 p-4" style={{ background: "rgba(43,138,110,0.06)", border: "1px solid rgba(43,138,110,0.2)" }}>
                      <div style={{ width: 6, height: 6, background: "#2B8A6E", flexShrink: 0, marginTop: 5 }} />
                      <p className="text-xs" style={{ color: "#2B8A6E", lineHeight: 1.6 }}>
                        Challenge rights are permanent. Any assumption documented here creates a mandatory review obligation before this playbook activates in a live scenario. The record stays with the playbook through every revision.
                      </p>
                    </div>
                  </div>

                  {/* Commitment vs compliance indicator */}
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <div className="p-5 border-2 border-[#E8E4DC] space-y-3">
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#9CA3AF" }}>Compliance</div>
                      <div className="space-y-2">
                        {["Playbook was received and reviewed", "Owner acknowledged the document", "No formal challenge mechanism", "Template defaults accepted as-is"].map(item => (
                          <div key={item} className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                            <div style={{ width: 4, height: 4, background: "#D1D5DB", flexShrink: 0 }} />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 space-y-3" style={{ border: "2px solid #C9A84C", background: "rgba(201,168,76,0.03)" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Commitment</div>
                      <div className="space-y-2">
                        {["Owner participated in construction", "Assumptions formally challenged", "Owner's judgment embedded in the plan", "Artifact — not a document received"].map(item => (
                          <div key={item} className="flex items-center gap-2 text-xs font-medium text-[#0A0F2E]">
                            <div style={{ width: 4, height: 4, background: "#C9A84C", flexShrink: 0 }} />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
