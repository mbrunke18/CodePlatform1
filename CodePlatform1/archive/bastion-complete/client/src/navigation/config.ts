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
  | 'Layers';

export interface NavigationItem {
  id: string;
  label: string;
  icon: IconName;
  path: string;
  badge?: string;
  description: string;
  category: NavigationCategory;
}

// Single source of truth for all navigation items
export const navigationItems: NavigationItem[] = [
  // AI Intelligence Modules
  {
    id: 'command-center',
    label: 'Intelligence Command Center',
    icon: 'LayoutDashboard',
    path: '/',
    description: 'Executive dashboard with real-time organizational intelligence',
    category: 'intelligence'
  },
  {
    id: 'pulse',
    label: 'Pulse Intelligence',
    icon: 'Activity',
    path: '/pulse',
    badge: 'AI',
    description: 'Real-time organizational health and performance metrics',
    category: 'intelligence'
  },
  {
    id: 'flux',
    label: 'Flux Adaptations',
    icon: 'TrendingUp',
    path: '/flux',
    badge: 'AI',
    description: 'Dynamic adaptation strategies and change management intelligence',
    category: 'intelligence'
  },
  {
    id: 'prism',
    label: 'Prism Insights',
    icon: 'Layers',
    path: '/prism',
    badge: 'AI',
    description: 'Multi-dimensional strategic analysis and decision support',
    category: 'intelligence'
  },
  {
    id: 'echo',
    label: 'Echo Cultural Analytics',
    icon: 'Users',
    path: '/echo',
    badge: 'AI',
    description: 'Cultural intelligence and organizational dynamics assessment',
    category: 'intelligence'
  },
  {
    id: 'nova',
    label: 'Nova Innovations',
    icon: 'Lightbulb',
    path: '/nova',
    badge: 'AI',
    description: 'Innovation pipeline and breakthrough opportunity identification',
    category: 'intelligence'
  },

  // Crisis Response & Risk Management
  {
    id: 'crisis-response',
    label: 'Crisis Response Center',
    icon: 'AlertTriangle',
    path: '/crisis',
    badge: 'CRITICAL',
    description: 'Emergency response protocols and crisis management command center',
    category: 'crisis'
  },
  {
    id: 'scenario-templates',
    label: 'Scenario Templates',
    icon: 'FileText',
    path: '/templates',
    badge: 'PRO',
    description: 'Comprehensive crisis response and strategic planning templates',
    category: 'crisis'
  },
  {
    id: 'triggers-management',
    label: 'Triggers Management',
    icon: 'Zap',
    path: '/triggers-management',
    badge: 'LIVE',
    description: 'Real-time scenario monitoring and automated escalation system',
    category: 'crisis'
  },
  {
    id: 'war-room',
    label: 'Executive War Room',
    icon: 'Shield',
    path: '/war-room',
    badge: 'CRISIS',
    description: 'Emergency command center for crisis coordination',
    category: 'crisis'
  },

  // Strategic Management
  {
    id: 'strategic-planning',
    label: 'Strategic Planning',
    icon: 'Target',
    path: '/strategic',
    description: 'Comprehensive scenario planning and strategic execution tracking',
    category: 'strategic'
  },
  {
    id: 'scenarios',
    label: 'Strategic Scenarios',
    icon: 'FileText',
    path: '/scenarios',
    badge: 'PRO',
    description: 'Advanced strategic scenario planning and execution',
    category: 'strategic'
  },
  {
    id: 'organizations',
    label: 'Enterprise Structure',
    icon: 'Building2',
    path: '/organizations',
    description: 'Organizational management and structural optimization',
    category: 'strategic'
  },
  {
    id: 'advanced-analytics',
    label: 'Advanced Analytics',
    icon: 'BarChart3',
    path: '/advanced-analytics',
    badge: 'PRO',
    description: 'Predictive models and business intelligence analytics',
    category: 'strategic'
  },
  {
    id: 'executive-analytics',
    label: 'Executive Analytics',
    icon: 'TrendingUp',
    path: '/executive-analytics-dashboard',
    badge: 'C-SUITE',
    description: 'Executive-level performance and forecasting analytics',
    category: 'strategic'
  },
  {
    id: 'real-time-collaboration',
    label: 'Real-Time Collaboration',
    icon: 'MessageSquare',
    path: '/real-time-collaboration',
    badge: 'LIVE',
    description: 'Live team collaboration and communication center',
    category: 'strategic'
  },
  {
    id: 'executive-demo',
    label: 'Executive Demo',
    icon: 'Target',
    path: '/executive-demo',
    badge: 'LIVE',
    description: 'Interactive Fortune 500 demo scenario for client presentations',
    category: 'strategic'
  },
  {
    id: 'hybrid-demo-navigator',
    label: 'Hybrid Demo Navigator',
    icon: 'Activity',
    path: '/hybrid-demo',
    badge: 'AUTO',
    description: 'Automated guided tour combining executive story with live platform demonstration',
    category: 'strategic'
  },

  // System Administration
  {
    id: 'integration-hub',
    label: 'Integration Hub',
    icon: 'Network',
    path: '/integration-hub',
    badge: 'API',
    description: 'Enterprise system integrations and API management',
    category: 'system'
  },
  {
    id: 'audit-compliance',
    label: 'Audit & Compliance',
    icon: 'Shield',
    path: '/audit-logging-center',
    badge: 'SOX',
    description: 'Audit trails, compliance monitoring, and security logs',
    category: 'system'
  },
  {
    id: 'settings',
    label: 'Platform Configuration',
    icon: 'Settings',
    path: '/settings',
    description: 'Enterprise platform settings and administrative controls',
    category: 'system'
  },
  {
    id: 'uat-admin',
    label: 'UAT Administration',
    icon: 'Settings',
    path: '/uat-admin',
    badge: 'ADMIN',
    description: 'User acceptance testing and quality assurance controls',
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
    label: 'AI Intelligence Suite',
    icon: 'Brain',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500/30'
  },
  crisis: {
    label: 'Crisis Management',
    icon: 'Shield',
    color: 'from-red-600 to-red-700',
    borderColor: 'border-red-500/30'
  },
  strategic: {
    label: 'Strategic Operations',
    icon: 'Target',
    color: 'from-emerald-600 to-green-600',
    borderColor: 'border-emerald-500/30'
  },
  system: {
    label: 'System Administration',
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