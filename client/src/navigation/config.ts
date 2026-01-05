// Centralized navigation types - single source of truth
export type NavigationCategory = 'intelligence' | 'crisis' | 'strategic' | 'system';

export type IconName = 
  | 'LayoutDashboard'
  | 'Brain'
  | 'AlertTriangle'
  | 'Target'
  | 'Building2'
  | 'Settings'
  | 'Activity'
  | 'TrendingUp'
  | 'Users'
  | 'Lightbulb'
  | 'Shield'
  | 'Zap'
  | 'FileText'
  | 'BarChart3'
  | 'MessageSquare'
  | 'Network'
  | 'Layers'
  | 'Rocket'
  | 'Radio'
  | 'PlayCircle'
  | 'Presentation'
  | 'Timer';

export interface NavigationItem {
  id: string;
  label: string;
  icon: IconName;
  path: string;
  badge?: string;
  description: string;
  category: NavigationCategory;
}

// Single source of truth for all navigation items - CONSOLIDATED FOR EXECUTIVES
export const navigationItems: NavigationItem[] = [
  // Executive Dashboard - Unified Command Center
  {
    id: 'executive-dashboard',
    label: 'Executive Dashboard',
    icon: 'LayoutDashboard',
    path: '/executive-dashboard',
    description: 'Unified command center: FRI, velocity, preparedness in one view',
    category: 'intelligence'
  },

  // Playbook Library - PROMOTED TO TOP
  {
    id: 'playbook-library',
    label: 'Playbook Library',
    icon: 'Rocket',
    path: '/playbook-library',
    badge: '166',
    description: '166 strategic playbooks across 9 operational domains',
    category: 'intelligence'
  },

  // AI Intelligence - Consolidated
  {
    id: 'ai-hub',
    label: 'AI Intelligence Hub',
    icon: 'Brain',
    path: '/ai',
    badge: 'AI',
    description: '5 strategic co-pilots: Pulse, Flux, Prism, Echo, Nova',
    category: 'intelligence'
  },
  {
    id: 'ai-radar',
    label: 'Perpetual Foresight Dashboard',
    icon: 'Radio',
    path: '/ai-radar',
    badge: 'LIVE',
    description: '24/7 strategic signal monitoring with AI-powered foresight',
    category: 'intelligence'
  },

  // Strategic Response - Full Suite
  {
    id: 'crisis-response',
    label: 'Strategic Response',
    icon: 'AlertTriangle',
    path: '/crisis',
    badge: 'LIVE',
    description: '12-minute strategic execution vs 72-hour industry standard',
    category: 'strategic'
  },
  {
    id: 'war-room',
    label: 'Situation Room',
    icon: 'Radio',
    path: '/war-room',
    badge: 'LIVE',
    description: 'Real-time collaborative command center',
    category: 'strategic'
  },
  {
    id: 'triggers-management',
    label: 'AI Trigger Monitoring',
    icon: 'Zap',
    path: '/triggers-management',
    badge: '24/7',
    description: 'AI co-pilot monitors triggers and recommends playbooks',
    category: 'strategic'
  },
  {
    id: 'real-time-collab',
    label: 'Team Collaboration',
    icon: 'Users',
    path: '/collaboration',
    badge: 'LIVE',
    description: 'Real-time coordination with WebSocket updates',
    category: 'strategic'
  },
  {
    id: 'preparedness',
    label: 'Strategic Readiness Report',
    icon: 'Shield',
    path: '/preparedness-report',
    description: 'Strategic Readiness Score™ and Dynamic Strategy benchmarking',
    category: 'strategic'
  },
  {
    id: 'drill-tracking',
    label: 'Practice Drills',
    icon: 'Target',
    path: '/drill-tracking',
    badge: 'V2',
    description: 'Quarterly simulations with performance metrics',
    category: 'strategic'
  },

  // Strategic Planning
  {
    id: 'strategic-planning',
    label: 'Strategic Planning',
    icon: 'Target',
    path: '/strategic',
    description: 'Scenario planning and strategic execution tracking',
    category: 'strategic'
  },
  {
    id: 'what-if',
    label: 'What-If Analyzer',
    icon: 'Target',
    path: '/what-if-analyzer',
    badge: 'PRACTICE',
    description: 'Test scenarios before execution, improve your readiness',
    category: 'strategic'
  },
  {
    id: 'decision-velocity',
    label: 'Decision Velocity Dashboard',
    icon: 'Zap',
    path: '/decision-velocity',
    badge: 'NEW',
    description: 'Your competitive advantage metric for Dynamic Strategy execution',
    category: 'strategic'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    path: '/analytics',
    description: 'Performance metrics and decision velocity tracking',
    category: 'strategic'
  },
  {
    id: 'institutional-memory',
    label: 'Institutional Memory',
    icon: 'Brain',
    path: '/institutional-memory',
    badge: 'V2',
    description: 'Learn from past decisions and improve AI recommendations',
    category: 'strategic'
  },
  {
    id: 'board-briefings',
    label: 'Board Briefings',
    icon: 'FileText',
    path: '/board-briefings',
    badge: 'V2',
    description: 'Automated reports with evidence traceability',
    category: 'strategic'
  },

  // System Administration
  {
    id: 'vc-presentations',
    label: 'Investor Demos',
    icon: 'Presentation',
    path: '/vc-presentations',
    description: 'Investor presentation and demo materials',
    category: 'system'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    description: 'Platform settings and configuration',
    category: 'system'
  }
];

// Category metadata for navigation grouping
export interface CategoryConfig {
  label: string;
  icon: IconName;
  color: string;
  borderColor: string;
}

export const categories: Record<NavigationCategory, CategoryConfig> = {
  intelligence: {
    label: 'Intelligence & Insights',
    icon: 'Brain',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500/30'
  },
  crisis: {
    label: 'Strategic Execution',
    icon: 'Shield',
    color: 'from-red-600 to-red-700',
    borderColor: 'border-red-500/30'
  },
  strategic: {
    label: 'Strategic Planning',
    icon: 'Target',
    color: 'from-emerald-600 to-green-600',
    borderColor: 'border-emerald-500/30'
  },
  system: {
    label: 'System',
    icon: 'Settings',
    color: 'from-gray-600 to-slate-600',
    borderColor: 'border-gray-500/30'
  }
};

// Helper functions for working with navigation
export const getItemsByCategory = (category: NavigationCategory) => 
  navigationItems.filter(item => item.category === category);

export const findItemByPath = (path: string) => 
  navigationItems.find(item => item.path === path);

export const findItemById = (id: string) => 
  navigationItems.find(item => item.id === id);
