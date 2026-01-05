// Workflow-based navigation configuration for guided user journeys

import { IconName } from './config';

export type WorkflowPhase = 'detection' | 'planning' | 'response' | 'execution' | 'measurement';

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  icon: IconName;
  route: string;
  phase: WorkflowPhase;
  stepNumber: number;
  estimatedDuration?: string;
  badge?: string;
}

export interface PhaseConfig {
  id: WorkflowPhase;
  label: string;
  description: string;
  icon: IconName;
  color: string;
  orderNumber: number;
}

// 5-Phase workflow structure
export const workflowPhases: Record<WorkflowPhase, PhaseConfig> = {
  detection: {
    id: 'detection',
    label: 'Phase 1: Threat Detection',
    description: 'Identify and assess strategic threats and opportunities',
    icon: 'AlertTriangle',
    color: 'from-orange-600 to-red-600',
    orderNumber: 1
  },
  planning: {
    id: 'planning',
    label: 'Phase 2: Strategic Planning',
    description: 'Develop response strategies and action plans',
    icon: 'Target',
    color: 'from-blue-600 to-purple-600',
    orderNumber: 2
  },
  response: {
    id: 'response',
    label: 'Phase 3: Crisis Response',
    description: 'Activate and coordinate immediate response protocols',
    icon: 'Shield',
    color: 'from-red-600 to-pink-600',
    orderNumber: 3
  },
  execution: {
    id: 'execution',
    label: 'Phase 4: Execution & Operations',
    description: 'Execute strategic initiatives with AI intelligence',
    icon: 'Zap',
    color: 'from-green-600 to-emerald-600',
    orderNumber: 4
  },
  measurement: {
    id: 'measurement',
    label: 'Phase 5: Analysis & Optimization',
    description: 'Measure outcomes and optimize future strategies',
    icon: 'BarChart3',
    color: 'from-purple-600 to-indigo-600',
    orderNumber: 5
  }
};

// Workflow steps organized by phase
export const workflowSteps: WorkflowStep[] = [
  // Phase 1: Detection
  {
    id: 'start-dashboard',
    label: 'Intelligence Command Center',
    description: 'Start here: View organizational intelligence and alerts',
    icon: 'LayoutDashboard',
    route: '/',
    phase: 'detection',
    stepNumber: 1,
    estimatedDuration: '2-3 min'
  },
  {
    id: 'crisis-center',
    label: 'Crisis Response Center',
    description: 'Monitor active threats and crisis situations',
    icon: 'AlertTriangle',
    route: '/crisis',
    phase: 'detection',
    stepNumber: 2,
    estimatedDuration: '3-5 min',
    badge: 'CRITICAL'
  },
  {
    id: 'pulse-intel',
    label: 'Pulse Intelligence',
    description: 'Check organizational health metrics',
    icon: 'Activity',
    route: '/pulse',
    phase: 'detection',
    stepNumber: 3,
    estimatedDuration: '2-3 min',
    badge: 'AI'
  },

  // Phase 2: Planning
  {
    id: 'scenario-templates',
    label: 'Scenario Templates',
    description: 'Select crisis response templates',
    icon: 'FileText',
    route: '/templates',
    phase: 'planning',
    stepNumber: 4,
    estimatedDuration: '3-4 min',
    badge: 'PRO'
  },
  {
    id: 'strategic-planning',
    label: 'Strategic Planning Hub',
    description: 'Create and manage strategic scenarios',
    icon: 'Target',
    route: '/strategic',
    phase: 'planning',
    stepNumber: 5,
    estimatedDuration: '5-7 min'
  },
  {
    id: 'prism-insights',
    label: 'Prism Insights',
    description: 'Multi-dimensional scenario analysis',
    icon: 'Layers',
    route: '/prism',
    phase: 'planning',
    stepNumber: 6,
    estimatedDuration: '4-5 min',
    badge: 'AI'
  },

  // Phase 3: Response
  {
    id: 'war-room',
    label: 'Executive War Room',
    description: 'Activate emergency response protocols',
    icon: 'Shield',
    route: '/war-room',
    phase: 'response',
    stepNumber: 7,
    estimatedDuration: '5-10 min',
    badge: 'CRISIS'
  },
  {
    id: 'triggers',
    label: 'Triggers Management',
    description: 'Monitor and manage response triggers',
    icon: 'Zap',
    route: '/triggers-management',
    phase: 'response',
    stepNumber: 8,
    estimatedDuration: '2-3 min',
    badge: 'LIVE'
  },
  {
    id: 'collaboration',
    label: 'Real-Time Collaboration',
    description: 'Coordinate with teams in real-time',
    icon: 'MessageSquare',
    route: '/real-time-collaboration',
    phase: 'response',
    stepNumber: 9,
    estimatedDuration: '3-5 min',
    badge: 'LIVE'
  },

  // Phase 4: Execution
  {
    id: 'scenarios-exec',
    label: 'Execute Strategic Scenarios',
    description: 'Implement and track strategic initiatives',
    icon: 'Target',
    route: '/scenarios',
    phase: 'execution',
    stepNumber: 10,
    estimatedDuration: '5-7 min',
    badge: 'PRO'
  },
  {
    id: 'flux-adapt',
    label: 'Flux Adaptations',
    description: 'Manage organizational change',
    icon: 'TrendingUp',
    route: '/flux',
    phase: 'execution',
    stepNumber: 11,
    estimatedDuration: '3-4 min',
    badge: 'AI'
  },
  {
    id: 'echo-culture',
    label: 'Echo Cultural Analytics',
    description: 'Monitor team dynamics during execution',
    icon: 'Users',
    route: '/echo',
    phase: 'execution',
    stepNumber: 12,
    estimatedDuration: '3-4 min',
    badge: 'AI'
  },
  {
    id: 'nova-innovation',
    label: 'Nova Innovations',
    description: 'Track innovation pipeline progress',
    icon: 'Lightbulb',
    route: '/nova',
    phase: 'execution',
    stepNumber: 13,
    estimatedDuration: '3-4 min',
    badge: 'AI'
  },

  // Phase 5: Measurement
  {
    id: 'exec-analytics',
    label: 'Executive Analytics Dashboard',
    description: 'Review performance metrics and KPIs',
    icon: 'TrendingUp',
    route: '/executive-analytics-dashboard',
    phase: 'measurement',
    stepNumber: 14,
    estimatedDuration: '5-7 min',
    badge: 'C-SUITE'
  },
  {
    id: 'advanced-analytics',
    label: 'Advanced Analytics',
    description: 'Deep-dive analysis and predictions',
    icon: 'BarChart3',
    route: '/advanced-analytics',
    phase: 'measurement',
    stepNumber: 15,
    estimatedDuration: '4-6 min',
    badge: 'PRO'
  },
  {
    id: 'audit-compliance',
    label: 'Audit & Compliance',
    description: 'Review audit trails and compliance reports',
    icon: 'Shield',
    route: '/audit-logging-center',
    phase: 'measurement',
    stepNumber: 16,
    estimatedDuration: '3-5 min',
    badge: 'SOX'
  }
];

// Helper functions
export const getStepsByPhase = (phase: WorkflowPhase) => 
  workflowSteps.filter(step => step.phase === phase);

export const getPhaseByRoute = (route: string): WorkflowPhase | null => {
  const step = workflowSteps.find(s => s.route === route);
  return step?.phase || null;
};

export const getNextStep = (currentRoute: string): WorkflowStep | null => {
  const currentIndex = workflowSteps.findIndex(s => s.route === currentRoute);
  return currentIndex >= 0 && currentIndex < workflowSteps.length - 1
    ? workflowSteps[currentIndex + 1]
    : null;
};

export const getCurrentStepNumber = (route: string): number => {
  const step = workflowSteps.find(s => s.route === route);
  return step?.stepNumber || 0;
};

export const getTotalSteps = () => workflowSteps.length;

export const getProgressPercentage = (route: string): number => {
  const currentStep = getCurrentStepNumber(route);
  return Math.round((currentStep / getTotalSteps()) * 100);
};
