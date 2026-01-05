// M Strategic Execution Operating System Navigation
// Based on 7-Component Ecosystem

import { IconName } from './config';

export interface NavSection {
  id: string;
  label: string;
  description: string;
  icon: IconName;
  items: NavItem[];
  priority?: 'high' | 'medium' | 'low'; // For visual hierarchy
}

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon: IconName;
  badge?: string;
  description?: string;
}

// Quick Access - Most-used pages for one-click access (Streamlined to 3 core items)
export const quickAccessItems: NavItem[] = [
  {
    id: 'quick-dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'LayoutDashboard',
    description: 'Strategic operations center'
  },
  {
    id: 'quick-triggers',
    label: 'Playbook Activation',
    route: '/triggers-management',
    icon: 'Zap',
    description: 'Execute strategic playbooks'
  },
  {
    id: 'quick-ai-radar',
    label: 'AI Radar (Live)',
    route: '/ai-radar',
    icon: 'Radio',
    badge: 'LIVE'
  }
];

// M's IDEA Framework Navigation (Streamlined from 7 sections)
// Aligned to: IDENTIFY → DETECT → EXECUTE → ADVANCE
export const mNavigation: NavSection[] = [
  // 1. IDENTIFY - Strategic Preparation
  {
    id: 'identify',
    label: 'IDENTIFY',
    description: 'Build your depth chart',
    icon: 'Target',
    priority: 'high',
    items: [
      {
        id: 'playbook-library',
        label: 'Playbook Library',
        route: '/playbook-library',
        icon: 'Shield',
        description: '166 strategic templates',
        badge: '166'
      },
      {
        id: 'scenarios',
        label: 'Custom Scenarios',
        route: '/scenarios',
        icon: 'FileText',
        description: 'Organization-specific playbooks'
      },
      {
        id: 'what-if',
        label: 'What-If Analyzer',
        route: '/what-if-analyzer',
        icon: 'Layers',
        description: 'Test strategic approaches'
      },
      {
        id: 'practice-drills',
        label: 'Practice Drills',
        route: '/practice-drills',
        icon: 'Target',
        description: 'Scenario simulations & war games'
      }
    ]
  },

  // 2. DETECT - AI Intelligence & 24/7 Monitoring (Consolidated)
  {
    id: 'detect',
    label: 'DETECT',
    description: 'Monitor signals',
    icon: 'Radio',
    priority: 'high',
    items: [
      {
        id: 'ai-radar',
        label: 'AI Radar Dashboard',
        route: '/ai-radar',
        icon: 'Radio',
        badge: 'LIVE'
      },
      {
        id: 'strategic-monitoring',
        label: 'Strategic Monitoring',
        route: '/strategic-monitoring',
        icon: 'Shield',
        description: 'Opportunity & threat tracking'
      },
      {
        id: 'pulse',
        label: 'Pulse Intelligence',
        route: '/pulse',
        icon: 'Activity',
        description: 'Organizational health metrics'
      },
      {
        id: 'flux',
        label: 'Flux Adaptations',
        route: '/flux',
        icon: 'TrendingUp',
        description: 'Change management signals'
      },
      {
        id: 'prism',
        label: 'Prism Insights',
        route: '/prism',
        icon: 'Layers',
        description: 'Multi-dimensional analysis'
      },
      {
        id: 'echo',
        label: 'Echo Cultural',
        route: '/echo',
        icon: 'Users',
        description: 'Team sentiment & culture'
      }
    ]
  },

  // 3. EXECUTE - Execution Framework
  {
    id: 'execute',
    label: 'EXECUTE',
    description: 'Execute response',
    icon: 'Zap',
    priority: 'high',
    items: [
      {
        id: 'command-center',
        label: 'Command Center',
        route: '/command-center',
        icon: 'Shield',
        description: 'Strategic coordination hub'
      },
      {
        id: 'triggers',
        label: 'Playbook Activation',
        route: '/triggers-management',
        icon: 'Zap',
        description: 'Activate & monitor playbooks'
      },
      {
        id: 'collaboration',
        label: 'Team Coordination',
        route: '/collaboration',
        icon: 'MessageSquare',
        description: 'Real-time collaboration'
      },
      {
        id: 'integrations',
        label: 'Integrations',
        route: '/integrations',
        icon: 'Network',
        description: 'Connect Jira, Slack, Calendar'
      }
    ]
  },

  // 4. ADVANCE - Institutional Memory & Executive Intelligence (Consolidated)
  {
    id: 'advance',
    label: 'ADVANCE',
    description: 'Review the film',
    icon: 'Brain',
    priority: 'high',
    items: [
      {
        id: 'preparedness',
        label: 'Preparedness Report',
        route: '/preparedness-report',
        icon: 'Shield',
        description: 'Executive Preparedness Score™'
      },
      {
        id: 'institutional-memory',
        label: 'Institutional Memory',
        route: '/institutional-memory',
        icon: 'FileText',
        description: 'Decision outcomes & learnings'
      },
      {
        id: 'board-briefings',
        label: 'Board Briefings',
        route: '/board-briefings',
        icon: 'FileText',
        description: 'Executive reports'
      },
      {
        id: 'analytics',
        label: 'Advanced Analytics',
        route: '/analytics',
        icon: 'BarChart3',
        description: 'Deep insights & trends'
      },
      {
        id: 'nova',
        label: 'Innovation Pipeline',
        route: '/nova',
        icon: 'Lightbulb',
        description: 'Track innovation initiatives'
      }
    ]
  }
];

// Helper to get current section by route (handles dynamic routes)
export const getSectionByRoute = (route: string): NavSection | null => {
  for (const section of mNavigation) {
    const item = section.items.find(item => {
      // Exact match
      if (item.route === route) return true;
      // Handle dynamic routes (e.g., /strategic-monitoring/:id matches /strategic-monitoring)
      if (route.startsWith(item.route + '/')) return true;
      return false;
    });
    if (item) return section;
  }
  return null;
};

// Helper to get all routes
export const getAllRoutes = (): string[] => {
  return mNavigation.flatMap(section => 
    section.items.map(item => item.route)
  );
};
