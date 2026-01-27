// Workflow-based navigation configuration for guided user journeys

import { IconName } from './config';

export type WorkflowPhase = 'demo' | 'detection' | 'planning' | 'response' | 'execution' | 'measurement';

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

// 6-Phase workflow structure (including Demo)
export const workflowPhases: Record<WorkflowPhase, PhaseConfig> = {
  demo: {
    id: 'demo',
    label: 'Interactive Demo',
    description: 'Experience the Strategic Execution Operating System',
    icon: 'Brain',
    color: 'from-blue-600 to-cyan-600',
    orderNumber: 0
  },
  detection: {
    id: 'detection',
    label: 'Intelligence & Insights',
    description: 'Monitor strategic signals and market intelligence',
    icon: 'Radio',
    color: 'from-blue-600 to-indigo-600',
    orderNumber: 1
  },
  planning: {
    id: 'planning',
    label: 'Strategy & Preparation',
    description: 'Build playbooks and strategic readiness',
    icon: 'Target',
    color: 'from-indigo-600 to-purple-600',
    orderNumber: 2
  },
  response: {
    id: 'response',
    label: 'Execution & Coordination',
    description: 'Activate playbooks and coordinate teams',
    icon: 'Zap',
    color: 'from-amber-600 to-orange-600',
    orderNumber: 3
  },
  execution: {
    id: 'execution',
    label: 'Operations & Performance',
    description: 'Track execution and optimize performance',
    icon: 'Activity',
    color: 'from-green-600 to-emerald-600',
    orderNumber: 4
  },
  measurement: {
    id: 'measurement',
    label: 'Analytics & Intelligence',
    description: 'Measure impact and refine strategies',
    icon: 'BarChart3',
    color: 'from-purple-600 to-violet-600',
    orderNumber: 5
  }
};

// Workflow steps organized by phase
export const workflowSteps: WorkflowStep[] = [
  // Demo Phase
  {
    id: 'executive-demo',
    label: 'Executive Demo',
    description: '8 C-Suite personas with personalized playbooks',
    icon: 'Brain',
    route: '/hybrid-demo',
    phase: 'demo',
    stepNumber: 1,
    estimatedDuration: '5-10 min',
    badge: 'LIVE'
  },
  {
    id: 'what-if-analyzer',
    label: 'What-If Scenario Analyzer',
    description: 'Stress test triggers before they happen',
    icon: 'Layers',
    route: '/what-if-analyzer',
    phase: 'demo',
    stepNumber: 2,
    estimatedDuration: '3-5 min',
    badge: 'AI'
  },
  
  // Intelligence & Insights
  {
    id: 'start-dashboard',
    label: 'Executive Dashboard',
    description: 'Your strategic command center and intelligence hub',
    icon: 'LayoutDashboard',
    route: '/',
    phase: 'detection',
    stepNumber: 3,
    estimatedDuration: '2-3 min'
  },
  {
    id: 'strategic-monitoring',
    label: 'Strategic Monitoring',
    description: 'Monitor opportunities and emerging scenarios',
    icon: 'Radio',
    route: '/strategic-monitoring',
    phase: 'detection',
    stepNumber: 4,
    estimatedDuration: '3-5 min',
    badge: 'LIVE'
  },
  {
    id: 'pulse-intel',
    label: 'Pulse Intelligence',
    description: 'Monitor organizational health and performance',
    icon: 'Activity',
    route: '/pulse',
    phase: 'detection',
    stepNumber: 5,
    estimatedDuration: '2-3 min',
    badge: 'AI'
  },

  // Strategy & Preparation
  {
    id: 'playbook-templates',
    label: 'Playbook Library',
    description: '166 strategic playbooks across 9 domains',
    icon: 'FileText',
    route: '/playbook-library',
    phase: 'planning',
    stepNumber: 6,
    estimatedDuration: '3-4 min',
    badge: 'PRO'
  },
  {
    id: 'strategic-planning',
    label: 'Strategy Builder',
    description: 'Build and customize your strategic playbooks',
    icon: 'Target',
    route: '/strategic',
    phase: 'planning',
    stepNumber: 7,
    estimatedDuration: '5-7 min'
  },
  {
    id: 'prism-insights',
    label: 'Prism Insights',
    description: 'Multi-dimensional scenario analysis',
    icon: 'Layers',
    route: '/prism',
    phase: 'planning',
    stepNumber: 8,
    estimatedDuration: '4-5 min',
    badge: 'AI'
  },

  // Execution & Coordination
  {
    id: 'command-center',
    label: 'Command Center',
    description: 'Activate and coordinate strategic playbooks',
    icon: 'Shield',
    route: '/command-center',
    phase: 'response',
    stepNumber: 9,
    estimatedDuration: '5-10 min',
    badge: 'ACTIVE'
  },
  {
    id: 'triggers',
    label: 'Playbook Activation',
    description: 'Monitor and activate strategic playbooks',
    icon: 'Zap',
    route: '/triggers-management',
    phase: 'response',
    stepNumber: 10,
    estimatedDuration: '2-3 min',
    badge: 'LIVE'
  },
  {
    id: 'collaboration',
    label: 'Team Coordination',
    description: 'Coordinate execution across teams',
    icon: 'MessageSquare',
    route: '/collaboration',
    phase: 'response',
    stepNumber: 11,
    estimatedDuration: '3-5 min',
    badge: 'LIVE'
  },

  // Operations & Performance
  {
    id: 'playbook-library',
    label: 'Playbook Library',
    description: '166 strategic playbooks across 9 domains',
    icon: 'Target',
    route: '/playbook-library',
    phase: 'execution',
    stepNumber: 12,
    estimatedDuration: '5-7 min',
    badge: 'PRO'
  },
  {
    id: 'flux-adapt',
    label: 'Flux Adaptations',
    description: 'Monitor organizational change and adaptation',
    icon: 'TrendingUp',
    route: '/flux',
    phase: 'execution',
    stepNumber: 13,
    estimatedDuration: '3-4 min',
    badge: 'AI'
  },
  {
    id: 'echo-culture',
    label: 'Echo Cultural Analytics',
    description: 'Track team sentiment and performance',
    icon: 'Users',
    route: '/echo',
    phase: 'execution',
    stepNumber: 14,
    estimatedDuration: '3-4 min',
    badge: 'AI'
  },
  {
    id: 'nova-innovation',
    label: 'Nova Innovations',
    description: 'Monitor innovation pipeline and opportunities',
    icon: 'Lightbulb',
    route: '/nova',
    phase: 'execution',
    stepNumber: 15,
    estimatedDuration: '3-4 min',
    badge: 'AI'
  },

  // Analytics & Intelligence
  {
    id: 'exec-analytics',
    label: 'Executive Dashboard',
    description: 'Strategic performance metrics and insights',
    icon: 'TrendingUp',
    route: '/executive-analytics-dashboard',
    phase: 'measurement',
    stepNumber: 16,
    estimatedDuration: '5-7 min',
    badge: 'C-SUITE'
  },
  {
    id: 'advanced-analytics',
    label: 'Advanced Intelligence',
    description: 'Deep analysis and predictive insights',
    icon: 'BarChart3',
    route: '/advanced-analytics',
    phase: 'measurement',
    stepNumber: 17,
    estimatedDuration: '4-6 min',
    badge: 'PRO'
  },
  {
    id: 'audit-compliance',
    label: 'Governance & Compliance',
    description: 'Audit trails and compliance reporting',
    icon: 'Shield',
    route: '/audit-logging-center',
    phase: 'measurement',
    stepNumber: 18,
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
