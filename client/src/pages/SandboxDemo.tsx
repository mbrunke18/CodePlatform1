import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { useLocation } from "wouter";
import { 
  ArrowRight, 
  ArrowLeft, 
  Shield, 
  Target, 
  Zap, 
  Globe, 
  GitMerge, 
  Rocket, 
  AlertTriangle, 
  Scale, 
  Cpu, 
  Brain,
  Clock,
  Users,
  DollarSign,
  CheckCircle2,
  Play,
  TrendingUp,
  Mail,
  MessageSquare,
  Phone,
  Building2,
  Sparkles,
  Timer,
  FileText,
  Award,
  ListChecks,
  GitBranch,
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  Workflow,
  Network,
  Plus,
  Trash2,
  GripVertical,
  Send,
  Plug,
  BarChart3,
  PieChart,
  Link2,
  CircleCheck,
  CircleX
} from "lucide-react";
import { STRATEGIC_DOMAINS_ARRAY, TIMING_BENCHMARKS, IDEA_PHASES } from "@shared/constants/framework";
import { ENTERPRISE_TASK_LIBRARY } from "@shared/constants/taskLibrary";
import Confetti from "react-confetti";

type Step = 'domain' | 'configure' | 'tasks' | 'triggers' | 'simulate' | 'results';

interface PlaybookConfig {
  domain: string;
  domainName: string;
  companyName: string;
  industry: string;
  stakeholders: string[];
  responseTimeTarget: number;
  budgetPreApproved: number;
  notificationChannels: string[];
  aiAssistEnabled: boolean;
  autoEscalation: boolean;
  escalationPath: EscalationLevel[];
  decisionPoints: DecisionPoint[];
  communicationTemplates: CommunicationTemplate[];
}

interface EscalationLevel {
  id: string;
  level: number;
  role: string;
  timeoutMinutes: number;
  action: string;
}

interface DecisionPoint {
  id: string;
  name: string;
  description: string;
  approver: string;
  requiredFor: string;
  autoApproveTimeout: number;
}

interface CommunicationTemplate {
  id: string;
  type: 'initial' | 'update' | 'escalation' | 'completion';
  channel: string;
  subject: string;
  message: string;
}

interface TaskAssignment {
  id: string;
  name: string;
  description: string;
  assignedRole: string;
  estimatedMinutes: number;
  dependencies: string[];
  requiresApproval: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface TriggerConfig {
  triggerType: string;
  severity: string;
  autoActivate: boolean;
  confirmationRequired: boolean;
  signalSources: string[];
  thresholds: TriggerThreshold[];
  detectionCriteria: string[];
}

interface TriggerThreshold {
  id: string;
  metric: string;
  operator: 'greater' | 'less' | 'equals' | 'contains';
  value: string;
  action: 'alert' | 'activate' | 'escalate';
}

interface SimulationEvent {
  time: string;
  event: string;
  type: 'trigger' | 'ai' | 'stakeholder' | 'decision' | 'task' | 'escalation' | 'complete';
  stakeholder?: string;
  explanation?: string;
}

const EVENT_EXPLANATIONS: Record<string, string> = {
  trigger: "M detected this event through connected monitoring systems. In production, this would come from your SIEM, news feeds, or internal alerts.",
  ai: "The AI assistant is processing the situation and taking automated actions based on your pre-configured playbook rules.",
  stakeholder: "Notifications are being sent through your selected channels (Slack, email, SMS) to the right people automatically.",
  decision: "A decision point has been reached. In production, executives receive mobile alerts with pre-staged options to choose from.",
  task: "Tasks are being assigned to team members with clear instructions, deadlines, and dependencies already mapped out.",
  escalation: "The escalation path you configured is now active. If responses aren't received in time, M will automatically escalate.",
  complete: "The coordinated response is complete. All stakeholders were aligned, tasks assigned, and decisions made in record time."
};

const ICON_MAP: Record<string, any> = {
  Globe, GitMerge, Rocket, AlertTriangle, Shield, Scale, Cpu, Target, Brain
};

const INDUSTRIES = [
  "Financial Services", "Healthcare", "Technology", "Manufacturing", 
  "Retail", "Energy", "Pharmaceuticals", "Gaming & Hospitality"
];

const STAKEHOLDER_OPTIONS = [
  { id: "ceo", label: "CEO", icon: Building2, level: 1 },
  { id: "cfo", label: "CFO", icon: DollarSign, level: 2 },
  { id: "ciso", label: "CISO", icon: Shield, level: 2 },
  { id: "clo", label: "General Counsel", icon: Scale, level: 2 },
  { id: "cmo", label: "CMO", icon: Target, level: 2 },
  { id: "coo", label: "COO", icon: Users, level: 2 },
  { id: "hr", label: "HR Director", icon: Users, level: 3 },
  { id: "comms", label: "VP Communications", icon: MessageSquare, level: 3 },
  { id: "ir", label: "Investor Relations", icon: TrendingUp, level: 3 },
  { id: "legal", label: "Senior Legal Counsel", icon: Scale, level: 3 },
];

const NOTIFICATION_OPTIONS = [
  { id: "email", label: "Email", icon: Mail },
  { id: "slack", label: "Slack", icon: MessageSquare },
  { id: "sms", label: "SMS", icon: Phone },
  { id: "teams", label: "Microsoft Teams", icon: Users },
];

const SIGNAL_SOURCES = [
  { id: "siem", label: "SIEM/Security Logs", category: "security" },
  { id: "news", label: "News & Media Monitoring", category: "market" },
  { id: "social", label: "Social Media Signals", category: "market" },
  { id: "regulatory", label: "Regulatory Filings", category: "compliance" },
  { id: "competitor", label: "Competitor Intelligence", category: "market" },
  { id: "internal", label: "Internal Systems", category: "operations" },
  { id: "vendor", label: "Vendor/Supply Chain", category: "operations" },
  { id: "financial", label: "Financial Data Feeds", category: "market" },
];

const ENTERPRISE_INTEGRATIONS = [
  { id: "jira", label: "Jira", category: "project", description: "Auto-create issues & assign tasks", connected: true },
  { id: "servicenow", label: "ServiceNow", category: "itsm", description: "Incident management & workflows", connected: true },
  { id: "slack", label: "Slack", category: "comms", description: "Real-time notifications & channels", connected: true },
  { id: "teams", label: "Microsoft Teams", category: "comms", description: "Team alerts & collaboration", connected: false },
  { id: "salesforce", label: "Salesforce", category: "crm", description: "Customer impact tracking", connected: false },
  { id: "pagerduty", label: "PagerDuty", category: "oncall", description: "Escalation & on-call routing", connected: true },
  { id: "confluence", label: "Confluence", category: "docs", description: "Auto-generate runbooks", connected: true },
  { id: "okta", label: "Okta", category: "identity", description: "Access control & SSO", connected: true },
];

const BUDGET_CATEGORIES = [
  { id: "legal", label: "Legal & Compliance", icon: Scale, defaultPercent: 25 },
  { id: "pr", label: "PR & Communications", icon: MessageSquare, defaultPercent: 20 },
  { id: "consulting", label: "External Consulting", icon: Users, defaultPercent: 15 },
  { id: "operations", label: "Operations & IT", icon: Cpu, defaultPercent: 25 },
  { id: "contingency", label: "Contingency Reserve", icon: Shield, defaultPercent: 15 },
];

const SUCCESS_METRICS = [
  { id: "response_time", label: "Response Time", unit: "minutes", target: 12, description: "Time from trigger to coordinated response" },
  { id: "stakeholder_alignment", label: "Stakeholder Alignment", unit: "%", target: 95, description: "Percentage of stakeholders briefed and aligned" },
  { id: "task_completion", label: "Task Completion Rate", unit: "%", target: 100, description: "Critical tasks completed within target window" },
  { id: "decision_velocity", label: "Decision Velocity", unit: "min/decision", target: 3, description: "Average time per approval gate" },
  { id: "communication_coverage", label: "Communication Coverage", unit: "%", target: 100, description: "Stakeholders receiving timely updates" },
];

const SCENARIO_BRANCHES = [
  { severity: "critical", label: "Critical - Full Activation", color: "bg-red-500", actions: ["Immediate full team mobilization", "All escalation paths active", "Board notification triggered"] },
  { severity: "high", label: "High - Elevated Response", color: "bg-orange-500", actions: ["Core team activation", "Management notification", "External counsel on standby"] },
  { severity: "medium", label: "Medium - Monitoring Mode", color: "bg-yellow-500", actions: ["Primary owner notified", "Situation monitoring enabled", "Escalation paths ready"] },
  { severity: "low", label: "Low - Awareness Only", color: "bg-blue-500", actions: ["Log for tracking", "Weekly digest inclusion", "No immediate action required"] },
];

// Map library task owners to demo stakeholder IDs
const OWNER_TO_STAKEHOLDER: Record<string, string> = {
  'ceo': 'ceo', 'cfo': 'cfo', 'coo': 'coo', 'cmo': 'comms', 'chro': 'hr',
  'cto': 'ciso', 'ciso': 'ciso', 'general counsel': 'clo', 'vp communications': 'comms',
  'vp operations': 'coo', 'vp strategy': 'ceo', 'vp sales': 'cmo',
  'director of risk': 'clo', 'director of compliance': 'clo', 'it director': 'ciso',
  'hr director': 'hr', 'project manager': 'coo', 'finance director': 'cfo',
  'chief of staff': 'ceo',
};

const mapOwnerToStakeholder = (owner: string): string => {
  const lower = owner.toLowerCase();
  for (const [key, value] of Object.entries(OWNER_TO_STAKEHOLDER)) {
    if (lower.includes(key)) return value;
  }
  return 'coo';
};

// Convert Enterprise Task Library templates to demo TaskAssignment format
const getDefaultTasksFromLibrary = (): TaskAssignment[] => {
  // Select critical & high priority tasks from DETECT and EXECUTE phases for demo
  const criticalTasks = ENTERPRISE_TASK_LIBRARY
    .filter(t => (t.priority === 'critical' || t.priority === 'high') && 
                 (t.phase === 'detect' || t.phase === 'execute'))
    .slice(0, 8);
  
  return criticalTasks.map((task, index) => ({
    id: String(index + 1),
    name: task.title,
    description: task.description,
    assignedRole: mapOwnerToStakeholder(task.suggestedOwner),
    estimatedMinutes: task.estimatedMinutes,
    dependencies: index === 0 ? [] : [String(index)],
    requiresApproval: task.approvalRequired !== 'none',
    priority: task.priority,
  }));
};

const DEFAULT_TASKS: TaskAssignment[] = getDefaultTasksFromLibrary();

export default function SandboxDemo() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('domain');
  const [showConfetti, setShowConfetti] = useState(false);
  const [configTab, setConfigTab] = useState('team');
  
  const [config, setConfig] = useState<PlaybookConfig>({
    domain: '',
    domainName: '',
    companyName: '',
    industry: '',
    stakeholders: ['ceo', 'ciso', 'clo'],
    responseTimeTarget: 12,
    budgetPreApproved: 50000,
    notificationChannels: ['email', 'slack'],
    aiAssistEnabled: true,
    autoEscalation: true,
    escalationPath: [
      { id: '1', level: 1, role: 'Primary Owner', timeoutMinutes: 3, action: 'Escalate to backup' },
      { id: '2', level: 2, role: 'Backup Owner', timeoutMinutes: 2, action: 'Escalate to executive' },
      { id: '3', level: 3, role: 'Executive Sponsor', timeoutMinutes: 2, action: 'Auto-activate response' },
    ],
    decisionPoints: [
      { id: '1', name: 'Initial Response Approval', description: 'Approve the initial response strategy', approver: 'ceo', requiredFor: 'Response execution', autoApproveTimeout: 5 },
      { id: '2', name: 'Budget Release', description: 'Authorize emergency budget spend', approver: 'cfo', requiredFor: 'Resource allocation', autoApproveTimeout: 3 },
      { id: '3', name: 'External Communication', description: 'Approve external messaging', approver: 'clo', requiredFor: 'Public statement', autoApproveTimeout: 4 },
    ],
    communicationTemplates: [
      { id: '1', type: 'initial', channel: 'email', subject: 'URGENT: {domain} Alert - Immediate Action Required', message: 'A {severity} {domain} event has been detected. Your immediate attention is required. Click here to view your assigned tasks.' },
      { id: '2', type: 'escalation', channel: 'sms', subject: 'Escalation Alert', message: 'Task "{task}" has not been acknowledged. Escalating to next level.' },
      { id: '3', type: 'completion', channel: 'email', subject: '{domain} Response Complete - {duration} Total', message: 'The coordinated response has been completed. All stakeholders aligned. Summary report attached.' },
    ],
  });

  const [tasks, setTasks] = useState<TaskAssignment[]>(DEFAULT_TASKS);

  const [triggerConfig, setTriggerConfig] = useState<TriggerConfig>({
    triggerType: 'system',
    severity: 'critical',
    autoActivate: false,
    confirmationRequired: true,
    signalSources: ['siem', 'news'],
    thresholds: [
      { id: '1', metric: 'Threat Score', operator: 'greater', value: '85', action: 'activate' },
      { id: '2', metric: 'News Mentions', operator: 'greater', value: '10', action: 'alert' },
    ],
    detectionCriteria: ['Brand mention with negative sentiment', 'Unusual system access patterns', 'Competitor announcement in market'],
  });

  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationEvents, setSimulationEvents] = useState<SimulationEvent[]>([]);
  const [simulationComplete, setSimulationComplete] = useState(false);
  
  const [budgetBreakdown, setBudgetBreakdown] = useState<Record<string, number>>({
    legal: 25, pr: 20, consulting: 15, operations: 25, contingency: 15
  });
  
  const [enabledIntegrations, setEnabledIntegrations] = useState<string[]>(['jira', 'servicenow', 'slack', 'pagerduty', 'confluence', 'okta']);
  
  const [successTargets, setSuccessTargets] = useState<Record<string, number>>({
    response_time: 12, stakeholder_alignment: 95, task_completion: 100, decision_velocity: 3, communication_coverage: 100
  });

  const steps: { id: Step; label: string; icon: any; description: string }[] = [
    { id: 'domain', label: 'Domain', icon: Target, description: 'Select strategic domain' },
    { id: 'configure', label: 'Configure', icon: Users, description: 'Team, decisions, communications' },
    { id: 'tasks', label: 'Tasks', icon: ListChecks, description: 'Assignments & dependencies' },
    { id: 'triggers', label: 'Triggers', icon: Zap, description: 'Detection & activation' },
    { id: 'simulate', label: 'Execute', icon: Play, description: 'Run simulation' },
    { id: 'results', label: 'Results', icon: Award, description: 'ROI & summary' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const generateSimulationEvents = (): SimulationEvent[] => {
    const stakeholderNames = config.stakeholders.map(id => 
      STAKEHOLDER_OPTIONS.find(s => s.id === id)?.label || id
    );
    
    const signalSourceNames = triggerConfig.signalSources.map(id =>
      SIGNAL_SOURCES.find(s => s.id === id)?.label || id
    );

    const initialTemplate = config.communicationTemplates.find(t => t.type === 'initial');
    const completionTemplate = config.communicationTemplates.find(t => t.type === 'completion');
    
    const events: SimulationEvent[] = [
      { time: '0:00', event: `${triggerConfig.severity.toUpperCase()} signal detected from: ${signalSourceNames.slice(0, 2).join(', ')}`, type: 'trigger' },
    ];

    triggerConfig.thresholds.forEach((threshold, i) => {
      const operatorText = 
        threshold.operator === 'greater' ? '>' : 
        threshold.operator === 'less' ? '<' : 
        threshold.operator === 'equals' ? '=' :
        threshold.operator === 'contains' ? 'contains' : threshold.operator;
      events.push({
        time: `0:0${i + 1}`,
        event: `Threshold matched: ${threshold.metric} ${operatorText} ${threshold.value} → ${threshold.action.toUpperCase()}`,
        type: 'ai'
      });
    });

    let minute = triggerConfig.thresholds.length + 1;
    
    events.push({
      time: `0:${String(minute).padStart(2, '0')}`,
      event: `AI matching to ${config.domainName} playbook (${config.aiAssistEnabled ? '98%' : '85%'} confidence)`,
      type: 'ai'
    });
    minute++;

    if (initialTemplate) {
      events.push({
        time: `0:${String(minute).padStart(2, '0')}`,
        event: `Sending via ${initialTemplate.channel.toUpperCase()}: "${initialTemplate.subject.replace('{domain}', config.domainName).replace('{severity}', triggerConfig.severity)}"`,
        type: 'ai'
      });
      minute++;
    }

    events.push({
      time: `0:${String(minute).padStart(2, '0')}`,
      event: `Notifying ${stakeholderNames.length} stakeholders via ${config.notificationChannels.join(', ')}`,
      type: 'ai'
    });
    minute++;

    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.dependencies.length === 0 && b.dependencies.length > 0) return -1;
      if (a.dependencies.length > 0 && b.dependencies.length === 0) return 1;
      return 0;
    });

    sortedTasks.slice(0, 4).forEach((task, i) => {
      const assignee = STAKEHOLDER_OPTIONS.find(s => s.id === task.assignedRole)?.label || task.assignedRole;
      const depText = task.dependencies.length > 0 ? ` (after Task ${task.dependencies.join(', ')})` : '';
      const priorityEmoji = task.priority === 'critical' ? '🔴' : task.priority === 'high' ? '🟠' : '🔵';
      
      events.push({
        time: `0:${String(minute).padStart(2, '0')}`,
        event: `${priorityEmoji} ${assignee}: "${task.name}" (~${task.estimatedMinutes}min)${depText}`,
        type: 'task',
        stakeholder: assignee
      });
      minute++;
      
      if (task.requiresApproval) {
        const decisionPoint = config.decisionPoints.find(dp => dp.requiredFor.toLowerCase().includes(task.name.toLowerCase().split(' ')[0]));
        const approver = decisionPoint 
          ? STAKEHOLDER_OPTIONS.find(s => s.id === decisionPoint.approver)?.label 
          : stakeholderNames[0];
        events.push({
          time: `0:${String(minute).padStart(2, '0')}`,
          event: `⏳ Decision Gate: ${approver} approving "${task.name}"`,
          type: 'decision'
        });
        minute++;
      }
    });

    config.decisionPoints.slice(0, 2).forEach((dp) => {
      const approver = STAKEHOLDER_OPTIONS.find(s => s.id === dp.approver)?.label || dp.approver;
      events.push({
        time: `0:${String(Math.min(minute, config.responseTimeTarget - 3)).padStart(2, '0')}`,
        event: `✅ ${approver} approved: "${dp.name}" (timeout: ${dp.autoApproveTimeout}min)`,
        type: 'decision'
      });
      minute++;
    });

    if (config.autoEscalation && config.escalationPath.length > 0) {
      const firstEscalation = config.escalationPath[0];
      events.push({
        time: `0:${String(Math.min(minute, config.responseTimeTarget - 2)).padStart(2, '0')}`,
        event: `📈 Escalation path active: ${firstEscalation.role} → ${firstEscalation.action} (${firstEscalation.timeoutMinutes}min)`,
        type: 'escalation'
      });
    }

    if (config.budgetPreApproved > 0) {
      events.push({
        time: `0:${String(Math.min(minute + 1, config.responseTimeTarget - 1)).padStart(2, '0')}`,
        event: `💰 $${(config.budgetPreApproved / 1000).toFixed(0)}K pre-approved budget unlocked for response`,
        type: 'ai'
      });
    }

    const completionMsg = completionTemplate 
      ? completionTemplate.subject.replace('{domain}', config.domainName).replace('{duration}', `${config.responseTimeTarget}min`)
      : `${config.domainName} Response Complete`;

    events.push({
      time: `0:${String(config.responseTimeTarget).padStart(2, '0')}`,
      event: `🎯 ${completionMsg} - ${stakeholderNames.length} stakeholders, ${tasks.length} tasks, ${config.decisionPoints.length} decisions`,
      type: 'complete'
    });

    return events;
  };

  const runSimulation = () => {
    const events = generateSimulationEvents();
    setSimulationEvents([]);
    setSimulationProgress(0);
    setSimulationComplete(false);

    events.forEach((event, index) => {
      setTimeout(() => {
        setSimulationEvents(prev => [...prev, event]);
        setSimulationProgress(((index + 1) / events.length) * 100);
        
        if (index === events.length - 1) {
          setSimulationComplete(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          setTimeout(() => setCurrentStep('results'), 2000);
        }
      }, (index + 1) * 1800);
    });
  };

  useEffect(() => {
    if (currentStep === 'simulate' && simulationEvents.length === 0) {
      setTimeout(runSimulation, 500);
    }
  }, [currentStep]);

  const calculateROI = () => {
    const industryResponseMinutes = TIMING_BENCHMARKS.INDUSTRY_AVERAGE.decisionTime * 60;
    const mPlatformMinutes = config.responseTimeTarget;
    const minutesSaved = industryResponseMinutes - mPlatformMinutes;
    const hoursSavedPerEvent = minutesSaved / 60;
    
    const stakeholderHourlyCost = 350;
    const eventsPerYear = 6;
    const coordinationCostSaved = hoursSavedPerEvent * config.stakeholders.length * stakeholderHourlyCost * eventsPerYear;
    
    const revenueAtRiskPerEvent = config.budgetPreApproved * 3;
    const protectionRate = config.aiAssistEnabled ? 0.85 : 0.65;
    const revenueProtected = revenueAtRiskPerEvent * protectionRate * eventsPerYear;
    
    const riskReduction = config.aiAssistEnabled ? 0.65 : 0.45;
    const speedMultiplier = Math.round(industryResponseMinutes / mPlatformMinutes);
    
    return {
      hoursSaved: Math.round(hoursSavedPerEvent),
      coordinationCostSaved: Math.round(coordinationCostSaved),
      revenueProtected: Math.round(revenueProtected),
      riskReduction: Math.round(riskReduction * 100),
      speedMultiplier: speedMultiplier,
      totalValue: Math.round(coordinationCostSaved + revenueProtected * 0.2),
      tasksConfigured: tasks.length,
      decisionPoints: config.decisionPoints.length,
      escalationLevels: config.escalationPath.length
    };
  };

  const renderDomainSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Step 1 of 6: IDENTIFY Phase
        </Badge>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          What strategic challenge do you want to prepare for?
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Select a domain to build your personalized playbook
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {STRATEGIC_DOMAINS_ARRAY.map((domain) => {
          const IconComponent = ICON_MAP[domain.icon] || Target;
          const isSelected = config.domain === domain.id;
          
          return (
            <Card 
              key={domain.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/30' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setConfig({ ...config, domain: domain.id, domainName: domain.name })}
              data-testid={`domain-card-${domain.id}`}
            >
              <CardContent className="p-6 text-center">
                <div 
                  className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${domain.color}20` }}
                >
                  <IconComponent className="h-6 w-6" style={{ color: domain.color }} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{domain.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{domain.description}</p>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: domain.color, color: domain.color }}
                >
                  {domain.category.replace('_', ' ').toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-8">
      <div className="text-center">
        <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          Step 2 of 6: Configure Playbook
        </Badge>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Configure Your {config.domainName} Playbook
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Set up your team, decision tree, escalation paths, and communications
        </p>
      </div>

      <Tabs value={configTab} onValueChange={setConfigTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="team" className="flex items-center gap-1 text-xs">
            <Users className="h-4 w-4" />
            <span className="hidden lg:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-1 text-xs">
            <PieChart className="h-4 w-4" />
            <span className="hidden lg:inline">Budget</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1 text-xs">
            <Plug className="h-4 w-4" />
            <span className="hidden lg:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="decisions" className="flex items-center gap-1 text-xs">
            <GitBranch className="h-4 w-4" />
            <span className="hidden lg:inline">Decisions</span>
          </TabsTrigger>
          <TabsTrigger value="escalation" className="flex items-center gap-1 text-xs">
            <ArrowUpRight className="h-4 w-4" />
            <span className="hidden lg:inline">Escalation</span>
          </TabsTrigger>
          <TabsTrigger value="comms" className="flex items-center gap-1 text-xs">
            <Send className="h-4 w-4" />
            <span className="hidden lg:inline">Comms</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-1 text-xs">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden lg:inline">KPIs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Your Company"
                    value={config.companyName}
                    onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                    data-testid="input-company-name"
                  />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Select 
                    value={config.industry} 
                    onValueChange={(v) => setConfig({ ...config, industry: v })}
                  >
                    <SelectTrigger data-testid="select-industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map(ind => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Pre-Approved Budget</Label>
                    <span className="text-lg font-bold text-green-600">${(config.budgetPreApproved / 1000).toFixed(0)}K</span>
                  </div>
                  <Slider
                    value={[config.budgetPreApproved]}
                    onValueChange={(v) => setConfig({ ...config, budgetPreApproved: v[0] })}
                    min={10000}
                    max={500000}
                    step={10000}
                    className="w-full"
                    data-testid="slider-budget"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Response Timing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Target Response Time</Label>
                    <span className="text-lg font-bold text-amber-600">{config.responseTimeTarget} min</span>
                  </div>
                  <Slider
                    value={[config.responseTimeTarget]}
                    onValueChange={(v) => setConfig({ ...config, responseTimeTarget: v[0] })}
                    min={5}
                    max={60}
                    step={1}
                    className="w-full"
                    data-testid="slider-response-time"
                  />
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>Industry Average:</strong> {TIMING_BENCHMARKS.INDUSTRY_AVERAGE.decisionTime} hours
                  </p>
                  <p className="text-sm font-bold text-amber-600 mt-1">
                    You'll be {Math.round((TIMING_BENCHMARKS.INDUSTRY_AVERAGE.decisionTime * 60) / config.responseTimeTarget)}X faster
                  </p>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <Label className="text-sm">AI-Assisted Drafting</Label>
                    <p className="text-xs text-slate-500">Auto-generate documents</p>
                  </div>
                  <Switch
                    checked={config.aiAssistEnabled}
                    onCheckedChange={(v) => setConfig({ ...config, aiAssistEnabled: v })}
                    data-testid="switch-ai-assist"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Response Team ({config.stakeholders.length} selected)
              </CardTitle>
              <CardDescription>Select stakeholders to include in the coordinated response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {STAKEHOLDER_OPTIONS.map((stakeholder) => {
                  const isSelected = config.stakeholders.includes(stakeholder.id);
                  const Icon = stakeholder.icon;
                  return (
                    <div
                      key={stakeholder.id}
                      className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-purple-50 border-purple-300 dark:bg-purple-950/30 dark:border-purple-700' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => {
                        const newStakeholders = isSelected
                          ? config.stakeholders.filter(s => s !== stakeholder.id)
                          : [...config.stakeholders, stakeholder.id];
                        setConfig({ ...config, stakeholders: newStakeholders });
                      }}
                      data-testid={`stakeholder-${stakeholder.id}`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium text-center">{stakeholder.label}</span>
                      <Badge variant="outline" className="mt-1 text-xs">L{stakeholder.level}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Notification Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {NOTIFICATION_OPTIONS.map((channel) => {
                  const isSelected = config.notificationChannels.includes(channel.id);
                  const Icon = channel.icon;
                  return (
                    <Badge
                      key={channel.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-base ${isSelected ? 'bg-blue-600' : ''}`}
                      onClick={() => {
                        const newChannels = isSelected
                          ? config.notificationChannels.filter(c => c !== channel.id)
                          : [...config.notificationChannels, channel.id];
                        setConfig({ ...config, notificationChannels: newChannels });
                      }}
                      data-testid={`channel-${channel.id}`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {channel.label}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-indigo-600" />
                Decision Tree Configuration
              </CardTitle>
              <CardDescription>Define approval gates and decision points in your playbook</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.decisionPoints.map((dp, index) => (
                <div key={dp.id} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Input
                          value={dp.name}
                          onChange={(e) => {
                            const updated = [...config.decisionPoints];
                            updated[index].name = e.target.value;
                            setConfig({ ...config, decisionPoints: updated });
                          }}
                          className="font-medium mb-2"
                          placeholder="Decision point name"
                          data-testid={`decision-name-${index}`}
                        />
                        <Textarea
                          value={dp.description}
                          onChange={(e) => {
                            const updated = [...config.decisionPoints];
                            updated[index].description = e.target.value;
                            setConfig({ ...config, decisionPoints: updated });
                          }}
                          placeholder="Description of what requires approval"
                          className="text-sm resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label className="text-xs">Approver</Label>
                      <Select 
                        value={dp.approver}
                        onValueChange={(v) => {
                          const updated = [...config.decisionPoints];
                          updated[index].approver = v;
                          setConfig({ ...config, decisionPoints: updated });
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAKEHOLDER_OPTIONS.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Required For</Label>
                      <Input
                        value={dp.requiredFor}
                        onChange={(e) => {
                          const updated = [...config.decisionPoints];
                          updated[index].requiredFor = e.target.value;
                          setConfig({ ...config, decisionPoints: updated });
                        }}
                        className="mt-1"
                        placeholder="e.g., Response execution"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Auto-approve timeout</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          value={dp.autoApproveTimeout}
                          onChange={(e) => {
                            const updated = [...config.decisionPoints];
                            updated[index].autoApproveTimeout = parseInt(e.target.value) || 0;
                            setConfig({ ...config, decisionPoints: updated });
                          }}
                          className="w-20"
                        />
                        <span className="text-sm text-slate-500">min</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setConfig({
                    ...config,
                    decisionPoints: [...config.decisionPoints, {
                      id: String(config.decisionPoints.length + 1),
                      name: 'New Decision Point',
                      description: '',
                      approver: 'ceo',
                      requiredFor: '',
                      autoApproveTimeout: 5
                    }]
                  });
                }}
                className="w-full"
                data-testid="button-add-decision"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Decision Point
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-orange-600" />
                Escalation Path
              </CardTitle>
              <CardDescription>Define what happens when stakeholders don't respond in time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config.escalationPath.map((level, index) => (
                  <div key={level.id} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-green-500' : index === 1 ? 'bg-amber-500' : 'bg-red-500'
                    }`}>
                      L{level.level}
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <Input
                        value={level.role}
                        onChange={(e) => {
                          const updated = [...config.escalationPath];
                          updated[index].role = e.target.value;
                          setConfig({ ...config, escalationPath: updated });
                        }}
                        placeholder="Role name"
                        data-testid={`escalation-role-${index}`}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={level.timeoutMinutes}
                          onChange={(e) => {
                            const updated = [...config.escalationPath];
                            updated[index].timeoutMinutes = parseInt(e.target.value) || 0;
                            setConfig({ ...config, escalationPath: updated });
                          }}
                          className="w-20"
                        />
                        <span className="text-sm text-slate-500">min timeout</span>
                      </div>
                      <Input
                        value={level.action}
                        onChange={(e) => {
                          const updated = [...config.escalationPath];
                          updated[index].action = e.target.value;
                          setConfig({ ...config, escalationPath: updated });
                        }}
                        placeholder="Action if no response"
                      />
                    </div>
                    {index < config.escalationPath.length - 1 && (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-400">
                  <strong>Auto-Escalation:</strong> If enabled, the system automatically escalates when timeouts are reached
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Switch
                    checked={config.autoEscalation}
                    onCheckedChange={(v) => setConfig({ ...config, autoEscalation: v })}
                  />
                  <Label>Enable auto-escalation</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                Communication Templates
              </CardTitle>
              <CardDescription>Pre-configure messages that go out automatically</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.communicationTemplates.map((template, index) => (
                <div key={template.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant={
                      template.type === 'initial' ? 'default' :
                      template.type === 'escalation' ? 'destructive' :
                      template.type === 'completion' ? 'secondary' : 'outline'
                    }>
                      {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                    </Badge>
                    <Select 
                      value={template.channel}
                      onValueChange={(v) => {
                        const updated = [...config.communicationTemplates];
                        updated[index].channel = v;
                        setConfig({ ...config, communicationTemplates: updated });
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NOTIFICATION_OPTIONS.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Subject Line</Label>
                      <Input
                        value={template.subject}
                        onChange={(e) => {
                          const updated = [...config.communicationTemplates];
                          updated[index].subject = e.target.value;
                          setConfig({ ...config, communicationTemplates: updated });
                        }}
                        placeholder="Email subject or notification title"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Message Template</Label>
                      <Textarea
                        value={template.message}
                        onChange={(e) => {
                          const updated = [...config.communicationTemplates];
                          updated[index].message = e.target.value;
                          setConfig({ ...config, communicationTemplates: updated });
                        }}
                        placeholder="Message content. Use {domain}, {severity}, {task}, {duration} as variables."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-sm text-slate-500">
                <strong>Variables:</strong> {'{domain}'}, {'{severity}'}, {'{task}'}, {'{duration}'}, {'{stakeholder}'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Budget Allocation
              </CardTitle>
              <CardDescription>
                Pre-approved budget: ${(config.budgetPreApproved / 1000).toFixed(0)}K - Allocate across response categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {BUDGET_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const amount = Math.round((budgetBreakdown[category.id] / 100) * config.budgetPreApproved);
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <Label className="font-medium">{category.label}</Label>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600">${(amount / 1000).toFixed(0)}K</span>
                        <span className="text-sm text-slate-500 ml-2">({budgetBreakdown[category.id]}%)</span>
                      </div>
                    </div>
                    <Slider
                      value={[budgetBreakdown[category.id]]}
                      onValueChange={(v) => setBudgetBreakdown({ ...budgetBreakdown, [category.id]: v[0] })}
                      min={0}
                      max={50}
                      step={5}
                      className="w-full"
                      data-testid={`slider-budget-${category.id}`}
                    />
                  </div>
                );
              })}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Allocation</span>
                  <span className={`font-bold ${Object.values(budgetBreakdown).reduce((a, b) => a + b, 0) === 100 ? 'text-green-600' : 'text-amber-600'}`}>
                    {Object.values(budgetBreakdown).reduce((a, b) => a + b, 0)}%
                  </span>
                </div>
                {Object.values(budgetBreakdown).reduce((a, b) => a + b, 0) !== 100 && (
                  <p className="text-xs text-amber-600 mt-1">Adjust allocations to total 100%</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-purple-600" />
                Enterprise Integrations
              </CardTitle>
              <CardDescription>Connect M Platform to your existing tools for seamless execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {ENTERPRISE_INTEGRATIONS.map((integration) => {
                  const isEnabled = enabledIntegrations.includes(integration.id);
                  return (
                    <div
                      key={integration.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isEnabled 
                          ? 'bg-purple-50 border-purple-300 dark:bg-purple-950/30 dark:border-purple-700' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => {
                        const newIntegrations = isEnabled
                          ? enabledIntegrations.filter(i => i !== integration.id)
                          : [...enabledIntegrations, integration.id];
                        setEnabledIntegrations(newIntegrations);
                      }}
                      data-testid={`integration-${integration.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{integration.label}</span>
                        {isEnabled ? (
                          <CircleCheck className="h-5 w-5 text-green-600" />
                        ) : (
                          <CircleX className="h-5 w-5 text-slate-300" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{integration.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">{integration.category.toUpperCase()}</Badge>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <strong>{enabledIntegrations.length} integrations enabled.</strong> When triggered, M will automatically create tasks in Jira, send alerts via Slack, and update ServiceNow tickets.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Success Metrics & KPIs
              </CardTitle>
              <CardDescription>Define measurable targets to track playbook effectiveness</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {SUCCESS_METRICS.map((metric) => (
                <div key={metric.id} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{metric.label}</h4>
                      <p className="text-sm text-slate-500">{metric.description}</p>
                    </div>
                    <Badge variant="outline">{metric.unit}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-xs w-16">Target:</Label>
                    <Slider
                      value={[successTargets[metric.id]]}
                      onValueChange={(v) => setSuccessTargets({ ...successTargets, [metric.id]: v[0] })}
                      min={metric.unit === 'minutes' || metric.unit === 'min/decision' ? 1 : 50}
                      max={metric.unit === 'minutes' ? 60 : metric.unit === 'min/decision' ? 15 : 100}
                      step={1}
                      className="flex-1"
                      data-testid={`slider-kpi-${metric.id}`}
                    />
                    <span className="font-bold text-blue-600 w-20 text-right" data-testid={`value-kpi-${metric.id}`}>
                      {successTargets[metric.id]} {metric.unit}
                    </span>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">
                  <strong>Automated Tracking:</strong> M will measure these KPIs in real-time during execution and include them in post-action reports for continuous improvement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderTaskAssignments = () => (
    <div className="space-y-8">
      <div className="text-center">
        <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          Step 3 of 6: EXECUTE Phase Setup
        </Badge>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Configure Task Assignments
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Define tasks, assign roles, and set dependencies for your {config.domainName} response
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-purple-600" />
            Execution Tasks ({tasks.length} configured)
          </CardTitle>
          <CardDescription>Tasks execute in order based on dependencies. Drag to reorder.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <GripVertical className="h-5 w-5 text-slate-400 cursor-move" />
                  <div className={`mt-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    task.priority === 'critical' ? 'bg-red-500' :
                    task.priority === 'high' ? 'bg-orange-500' :
                    task.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Task Name</Label>
                      <Input
                        value={task.name}
                        onChange={(e) => {
                          const updated = [...tasks];
                          updated[index].name = e.target.value;
                          setTasks(updated);
                        }}
                        className="mt-1 font-medium"
                        data-testid={`task-name-${index}`}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Assigned Role</Label>
                      <Select 
                        value={task.assignedRole}
                        onValueChange={(v) => {
                          const updated = [...tasks];
                          updated[index].assignedRole = v;
                          setTasks(updated);
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAKEHOLDER_OPTIONS.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={task.description}
                      onChange={(e) => {
                        const updated = [...tasks];
                        updated[index].description = e.target.value;
                        setTasks(updated);
                      }}
                      className="mt-1 resize-none"
                      rows={2}
                      placeholder="What needs to be done"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-end">
                    <div>
                      <Label className="text-xs">Est. Duration</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          value={task.estimatedMinutes}
                          onChange={(e) => {
                            const updated = [...tasks];
                            updated[index].estimatedMinutes = parseInt(e.target.value) || 0;
                            setTasks(updated);
                          }}
                          className="w-20"
                        />
                        <span className="text-sm text-slate-500">min</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Priority</Label>
                      <Select 
                        value={task.priority}
                        onValueChange={(v: 'critical' | 'high' | 'medium' | 'low') => {
                          const updated = [...tasks];
                          updated[index].priority = v;
                          setTasks(updated);
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Dependencies</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.dependencies.length > 0 ? (
                          task.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs">
                              Task {dep}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs text-slate-400">None</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={task.requiresApproval}
                        onCheckedChange={(v) => {
                          const updated = [...tasks];
                          updated[index].requiresApproval = v as boolean;
                          setTasks(updated);
                        }}
                      />
                      <Label className="text-xs">Requires Approval</Label>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setTasks([...tasks, {
                id: String(tasks.length + 1),
                name: 'New Task',
                description: '',
                assignedRole: 'coo',
                estimatedMinutes: 5,
                dependencies: tasks.length > 0 ? [tasks[tasks.length - 1].id] : [],
                requiresApproval: false,
                priority: 'medium'
              }]);
            }}
            className="w-full"
            data-testid="button-add-task"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Task Flow Preview</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total estimated time: {tasks.reduce((acc, t) => acc + t.estimatedMinutes, 0)} minutes
              </p>
            </div>
            <div className="flex items-center gap-2">
              {tasks.slice(0, 5).map((task, i) => (
                <div key={task.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    task.priority === 'critical' ? 'bg-red-500' :
                    task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {i + 1}
                  </div>
                  {i < Math.min(4, tasks.length - 1) && (
                    <ChevronRight className="h-4 w-4 text-slate-400 mx-1" />
                  )}
                </div>
              ))}
              {tasks.length > 5 && (
                <Badge variant="outline">+{tasks.length - 5} more</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            RACI Matrix
          </CardTitle>
          <CardDescription>Responsibility assignment for each task across stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Task</th>
                  {config.stakeholders.slice(0, 5).map(id => {
                    const s = STAKEHOLDER_OPTIONS.find(opt => opt.id === id);
                    return s ? (
                      <th key={id} className="text-center p-2 font-medium">{s.label}</th>
                    ) : null;
                  })}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, taskIndex) => {
                  const approverStakeholder = config.decisionPoints.find(dp => dp.requiredFor.toLowerCase().includes(task.name.toLowerCase().split(' ')[0]))?.approver;
                  const dependencyRoles = tasks.filter(t => task.dependencies.includes(t.id)).map(t => t.assignedRole);
                  
                  return (
                    <tr key={task.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50" data-testid={`raci-row-${task.id}`}>
                      <td className="p-2 font-medium">{task.name}</td>
                      {config.stakeholders.slice(0, 5).map(id => {
                        const isResponsible = task.assignedRole === id;
                        const isAccountable = task.requiresApproval && approverStakeholder === id;
                        const isConsulted = dependencyRoles.includes(id) && !isResponsible;
                        
                        let badge = null;
                        let role = 'I';
                        if (isResponsible) { badge = <Badge className="bg-blue-500 text-white">R</Badge>; role = 'R'; }
                        else if (isAccountable) { badge = <Badge className="bg-purple-500 text-white">A</Badge>; role = 'A'; }
                        else if (isConsulted) { badge = <Badge className="bg-amber-500 text-white">C</Badge>; role = 'C'; }
                        else badge = <Badge variant="outline" className="text-slate-400">I</Badge>;
                        
                        return (
                          <td key={id} className="text-center p-2" data-testid={`raci-cell-${task.id}-${id}-${role}`}>{badge}</td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4 text-xs text-slate-500">
            <span><Badge className="bg-blue-500 text-white mr-1">R</Badge> Responsible</span>
            <span><Badge className="bg-purple-500 text-white mr-1">A</Badge> Accountable</span>
            <span><Badge className="bg-amber-500 text-white mr-1">C</Badge> Consulted</span>
            <span><Badge variant="outline" className="text-slate-400 mr-1">I</Badge> Informed</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTriggerSetup = () => (
    <div className="space-y-8">
      <div className="text-center">
        <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          Step 4 of 6: DETECT Phase
        </Badge>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Configure Detection & Triggers
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Define signal sources, thresholds, and activation rules for your {config.domainName} playbook
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-blue-600" />
              Signal Sources
            </CardTitle>
            <CardDescription>Where should M Platform monitor for signals?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {SIGNAL_SOURCES.map((source) => {
                const isSelected = triggerConfig.signalSources.includes(source.id);
                return (
                  <div
                    key={source.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-700' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => {
                      const newSources = isSelected
                        ? triggerConfig.signalSources.filter(s => s !== source.id)
                        : [...triggerConfig.signalSources, source.id];
                      setTriggerConfig({ ...triggerConfig, signalSources: newSources });
                    }}
                    data-testid={`signal-${source.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={isSelected} />
                      <span className="text-sm font-medium">{source.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              Trigger Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'system', label: 'AI Detection', desc: 'Automatic pattern recognition' },
                { id: 'manual', label: 'Manual Activation', desc: 'Executive-initiated' },
                { id: 'integration', label: 'External Webhook', desc: 'From connected tools' },
                { id: 'schedule', label: 'Scheduled Check', desc: 'Regular monitoring' },
              ].map((trigger) => (
                <div
                  key={trigger.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    triggerConfig.triggerType === trigger.id
                      ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setTriggerConfig({ ...triggerConfig, triggerType: trigger.id })}
                  data-testid={`trigger-type-${trigger.id}`}
                >
                  <div className="font-medium text-sm">{trigger.label}</div>
                  <div className="text-xs text-slate-500">{trigger.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Threshold Conditions
          </CardTitle>
          <CardDescription>When these conditions are met, the specified action is triggered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {triggerConfig.thresholds.map((threshold, index) => (
            <div key={threshold.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-sm font-medium text-slate-500">When</span>
              <Input
                value={threshold.metric}
                onChange={(e) => {
                  const updated = [...triggerConfig.thresholds];
                  updated[index].metric = e.target.value;
                  setTriggerConfig({ ...triggerConfig, thresholds: updated });
                }}
                className="w-40"
                placeholder="Metric name"
              />
              <Select 
                value={threshold.operator}
                onValueChange={(v: 'greater' | 'less' | 'equals' | 'contains') => {
                  const updated = [...triggerConfig.thresholds];
                  updated[index].operator = v;
                  setTriggerConfig({ ...triggerConfig, thresholds: updated });
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater">is greater than</SelectItem>
                  <SelectItem value="less">is less than</SelectItem>
                  <SelectItem value="equals">equals</SelectItem>
                  <SelectItem value="contains">contains</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={threshold.value}
                onChange={(e) => {
                  const updated = [...triggerConfig.thresholds];
                  updated[index].value = e.target.value;
                  setTriggerConfig({ ...triggerConfig, thresholds: updated });
                }}
                className="w-24"
                placeholder="Value"
              />
              <span className="text-sm font-medium text-slate-500">then</span>
              <Select 
                value={threshold.action}
                onValueChange={(v: 'alert' | 'activate' | 'escalate') => {
                  const updated = [...triggerConfig.thresholds];
                  updated[index].action = v;
                  setTriggerConfig({ ...triggerConfig, thresholds: updated });
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alert">Send Alert</SelectItem>
                  <SelectItem value="activate">Activate Playbook</SelectItem>
                  <SelectItem value="escalate">Escalate</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTriggerConfig({
                    ...triggerConfig,
                    thresholds: triggerConfig.thresholds.filter(t => t.id !== threshold.id)
                  });
                }}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setTriggerConfig({
                ...triggerConfig,
                thresholds: [...triggerConfig.thresholds, {
                  id: String(triggerConfig.thresholds.length + 1),
                  metric: '',
                  operator: 'greater',
                  value: '',
                  action: 'alert'
                }]
              });
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Threshold
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Severity Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'critical', label: 'Critical', color: 'bg-red-500' },
                { id: 'high', label: 'High', color: 'bg-orange-500' },
                { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
                { id: 'low', label: 'Low', color: 'bg-gray-400' },
              ].map((sev) => (
                <div
                  key={sev.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                    triggerConfig.severity === sev.id
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setTriggerConfig({ ...triggerConfig, severity: sev.id })}
                  data-testid={`severity-${sev.id}`}
                >
                  <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${sev.color}`} />
                  <span className="text-sm font-medium">{sev.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Activation Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <Label className="text-sm">Require Confirmation</Label>
                <p className="text-xs text-slate-500">Human must approve activation</p>
              </div>
              <Switch
                checked={triggerConfig.confirmationRequired}
                onCheckedChange={(v) => setTriggerConfig({ ...triggerConfig, confirmationRequired: v })}
                data-testid="switch-confirmation-required"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <Label className="text-sm">Auto-Activate on Timeout</Label>
                <p className="text-xs text-slate-500">If no response in 5 min</p>
              </div>
              <Switch
                checked={triggerConfig.autoActivate}
                onCheckedChange={(v) => setTriggerConfig({ ...triggerConfig, autoActivate: v })}
                data-testid="switch-auto-activate"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-purple-600" />
            Scenario Branching
          </CardTitle>
          <CardDescription>Different response paths based on trigger severity - actions are pre-configured for each level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SCENARIO_BRANCHES.map((branch) => (
              <div 
                key={branch.severity}
                className={`p-4 border rounded-lg transition-all cursor-pointer ${
                  triggerConfig.severity === branch.severity 
                    ? 'ring-2 ring-blue-500 bg-slate-50 dark:bg-slate-800/50' 
                    : 'opacity-60 hover:opacity-80'
                }`}
                onClick={() => setTriggerConfig({ ...triggerConfig, severity: branch.severity })}
                data-testid={`scenario-branch-${branch.severity}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-4 h-4 rounded-full ${branch.color}`} />
                  <span className="font-semibold">{branch.label}</span>
                  {triggerConfig.severity === branch.severity && (
                    <Badge className="bg-blue-500 text-white ml-auto">Active Path</Badge>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-2">
                  {branch.actions.map((action, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`h-4 w-4 ${triggerConfig.severity === branch.severity ? 'text-green-600' : 'text-slate-300'}`} />
                      <span className={triggerConfig.severity === branch.severity ? '' : 'text-slate-400'}>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-400">
              <strong>Dynamic Routing:</strong> M Platform automatically routes to the appropriate response path based on detected signal severity. Change severity above to see different response configurations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSimulation = () => (
    <div className="space-y-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      <div className="text-center">
        <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          Step 5 of 6: Execute Simulation
        </Badge>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {simulationComplete ? 'Response Coordinated!' : 'Running Your Personalized Simulation...'}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {config.companyName || 'Your organization'} responding to {config.domainName} scenario
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Timer className="h-6 w-6 text-purple-600" />
                <span className="text-lg font-semibold">Execution Progress</span>
              </div>
              <Badge variant={simulationComplete ? "default" : "secondary"} className={simulationComplete ? "bg-green-600" : ""}>
                {simulationComplete ? 'Complete' : 'In Progress'}
              </Badge>
            </div>
            <Progress value={simulationProgress} className="h-3 mb-2" />
            <div className="flex justify-between text-sm text-slate-500">
              <span>Target: {config.responseTimeTarget} min</span>
              <span>{Math.round(simulationProgress)}% complete</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{config.stakeholders.length}</div>
              <div className="text-xs text-slate-500">Stakeholders</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
              <div className="text-xs text-slate-500">Tasks</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{config.decisionPoints.length}</div>
              <div className="text-xs text-slate-500">Decisions</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">${(config.budgetPreApproved/1000).toFixed(0)}K</div>
              <div className="text-xs text-slate-500">Budget</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Live Execution Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {simulationEvents.map((event, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg animate-in fade-in slide-in-from-left duration-500 ${
                    event.type === 'complete' 
                      ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                      : event.type === 'trigger'
                      ? 'bg-red-50 dark:bg-red-950/30'
                      : event.type === 'ai'
                      ? 'bg-blue-50 dark:bg-blue-950/30'
                      : event.type === 'decision'
                      ? 'bg-purple-50 dark:bg-purple-950/30'
                      : event.type === 'task'
                      ? 'bg-indigo-50 dark:bg-indigo-950/30'
                      : 'bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <div className="min-w-16 font-mono text-sm font-bold text-slate-600 dark:text-slate-400">
                    {event.time}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {event.type === 'complete' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      {event.type === 'trigger' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {event.type === 'ai' && <Sparkles className="h-4 w-4 text-blue-600" />}
                      {event.type === 'task' && <ListChecks className="h-4 w-4 text-indigo-600" />}
                      {event.type === 'decision' && <GitBranch className="h-4 w-4 text-purple-600" />}
                      {event.type === 'stakeholder' && <Users className="h-4 w-4 text-emerald-600" />}
                      {event.type === 'escalation' && <ArrowUpRight className="h-4 w-4 text-amber-600" />}
                      <span className={`font-medium ${event.type === 'complete' ? 'text-green-700 dark:text-green-400' : ''}`}>
                        {event.event}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                      {EVENT_EXPLANATIONS[event.type]}
                    </p>
                  </div>
                </div>
              ))}
              {simulationEvents.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Timer className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                  <p>Initializing simulation...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderResults = () => {
    const roi = calculateROI();
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Step 6 of 6: Results
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Your Personalized ROI Analysis
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Based on your complete {config.domainName} playbook configuration
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold mb-1">{roi.speedMultiplier}X</div>
              <div className="text-sm opacity-80">Faster Than Industry</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold mb-1">{roi.hoursSaved}</div>
              <div className="text-sm opacity-80">Hours Saved Per Event</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold mb-1">${(roi.coordinationCostSaved / 1000).toFixed(0)}K</div>
              <div className="text-sm opacity-80">Coordination Savings</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold mb-1">{roi.riskReduction}%</div>
              <div className="text-sm opacity-80">Risk Reduction</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="response-team" className="border rounded-lg bg-white dark:bg-slate-900">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Response Team</span>
                  <Badge variant="secondary" className="ml-2">{config.stakeholders.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  {config.stakeholders.map(id => {
                    const s = STAKEHOLDER_OPTIONS.find(opt => opt.id === id);
                    return s ? (
                      <div key={id} className="flex items-center gap-2 text-sm p-2 rounded bg-slate-50 dark:bg-slate-800">
                        <Badge variant="outline" className="text-xs">L{s.level}</Badge>
                        <span>{s.label}</span>
                      </div>
                    ) : null;
                  })}
                  <p className="text-xs text-slate-500 mt-2 italic">
                    All team members will be notified via {config.notificationChannels.join(', ')} when triggered.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="execution-tasks" className="border rounded-lg bg-white dark:bg-slate-900">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">Execution Tasks</span>
                  <Badge variant="secondary" className="ml-2">{tasks.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 text-sm p-2 rounded bg-slate-50 dark:bg-slate-800">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        task.priority === 'critical' ? 'bg-red-500' :
                        task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <span className="flex-1">{task.name}</span>
                      <Badge variant="outline" className="text-xs">{task.estimatedMinutes}m</Badge>
                    </div>
                  ))}
                  <p className="text-xs text-slate-500 mt-2 italic">
                    Tasks are assigned based on role and executed in parallel where dependencies allow.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="trigger-config" className="border rounded-lg bg-white dark:bg-slate-900">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold">Trigger Configuration</span>
                  <Badge variant={triggerConfig.severity === 'critical' ? 'destructive' : 'secondary'} className="ml-2">
                    {triggerConfig.severity.toUpperCase()}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Signal Sources</p>
                    <div className="flex flex-wrap gap-1">
                      {triggerConfig.signalSources.map(source => (
                        <Badge key={source} variant="outline" className="text-xs">{source}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Thresholds</p>
                    <div className="space-y-1">
                      {triggerConfig.thresholds.map((t) => {
                        const opText = t.operator === 'greater' ? '>' : t.operator === 'less' ? '<' : t.operator === 'equals' ? '=' : 'contains';
                        return (
                          <div key={t.id} className="text-sm p-2 rounded bg-slate-50 dark:bg-slate-800">
                            {t.metric} {opText} {t.value} → <Badge variant="outline" className="text-xs">{t.action}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Auto-activate:</span>
                    <Badge variant={triggerConfig.autoActivate ? 'default' : 'secondary'}>
                      {triggerConfig.autoActivate ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-indigo-600" />
                Decision Gates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.decisionPoints.map((dp, i) => {
                const approver = STAKEHOLDER_OPTIONS.find(s => s.id === dp.approver)?.label || dp.approver;
                return (
                  <div key={dp.id} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{dp.name}</div>
                      <div className="text-xs text-slate-500">Approver: {approver} | Timeout: {dp.autoApproveTimeout}min</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-orange-600" />
                Escalation Path
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.escalationPath.map((level, i) => (
                <div key={level.id} className="flex items-center gap-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    i === 0 ? 'bg-green-500' : i === 1 ? 'bg-amber-500' : 'bg-red-500'
                  }`}>
                    L{level.level}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{level.role}</div>
                    <div className="text-xs text-slate-500">{level.timeoutMinutes}min → {level.action}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Complete Configuration Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><strong className="text-blue-300">Domain:</strong> {config.domainName}</p>
                    <p><strong className="text-blue-300">Team Size:</strong> {config.stakeholders.length} stakeholders</p>
                    <p><strong className="text-blue-300">Tasks:</strong> {tasks.length} configured</p>
                    <p><strong className="text-blue-300">Decisions:</strong> {config.decisionPoints.length} gates</p>
                    <p><strong className="text-blue-300">Escalation:</strong> {config.escalationPath.length} levels</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong className="text-green-300">Target Time:</strong> {config.responseTimeTarget} min</p>
                    <p><strong className="text-green-300">Budget:</strong> ${(config.budgetPreApproved / 1000).toFixed(0)}K</p>
                    <p><strong className="text-green-300">Signal Sources:</strong> {triggerConfig.signalSources.length}</p>
                    <p><strong className="text-green-300">Thresholds:</strong> {triggerConfig.thresholds.length} rules</p>
                    <p><strong className="text-green-300">Templates:</strong> {config.communicationTemplates.length} messages</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400 mb-2">
                  ${(roi.totalValue / 1000).toFixed(0)}K+
                </div>
                <div className="text-xl text-slate-300 mb-6">Estimated Annual Value</div>
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-slate-100"
                  onClick={() => setLocation('/contact')}
                  data-testid="button-get-started"
                >
                  Start Your Pilot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Ready to see M Platform with your real scenarios?
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => {
              setCurrentStep('domain');
              setSimulationEvents([]);
              setSimulationComplete(false);
            }} data-testid="button-try-again">
              Try Another Scenario
            </Button>
            <Button onClick={() => setLocation('/pilot-program')} data-testid="button-pilot-programs">
              View Pilot Program
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'domain': return config.domain !== '';
      case 'configure': return config.stakeholders.length > 0;
      case 'tasks': return tasks.length > 0;
      case 'triggers': return triggerConfig.triggerType !== '' && triggerConfig.signalSources.length > 0;
      case 'simulate': return simulationComplete;
      default: return true;
    }
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <StandardNav />

      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12 overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : isComplete 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    <span className="hidden lg:inline text-sm font-medium">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-6 h-0.5 mx-1 ${
                      isComplete ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {currentStep === 'domain' && renderDomainSelection()}
          {currentStep === 'configure' && renderConfiguration()}
          {currentStep === 'tasks' && renderTaskAssignments()}
          {currentStep === 'triggers' && renderTriggerSetup()}
          {currentStep === 'simulate' && renderSimulation()}
          {currentStep === 'results' && renderResults()}

          {currentStep !== 'results' && (
            <div className="flex justify-between mt-12 max-w-3xl mx-auto">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                data-testid="button-back"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-next"
              >
                {currentStep === 'triggers' ? 'Run Simulation' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
