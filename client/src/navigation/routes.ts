import { ComponentType } from 'react';
import { navigationItems } from './config';

// Route definitions - must match navigation paths
export interface RouteDefinition {
  id: string;
  path: string;
  component: ComponentType;
}

// Import all page components - CONSOLIDATED
import ExecutiveDashboard from '../pages/ExecutiveDashboard';
import AIIntelligenceHub from '../pages/AIIntelligenceHub';
import CrisisResponseCenter from '../pages/CrisisResponseCenter';
import StrategicPlanningHub from '../pages/StrategicPlanningHub';
import PlaybookLibrary from '../pages/PlaybookLibrary';
import WhatIfAnalyzer from '../pages/WhatIfAnalyzer';
import AdvancedAnalytics from '../pages/AdvancedAnalytics';
import UnifiedDemoHub from '../pages/UnifiedDemoHub';
import IntelligenceControlCenter from '../pages/IntelligenceControlCenter';
import Settings from '../pages/Settings';
import NotFound from '../pages/not-found';

// Central route registry - maps navigation items to their components
export const routes: RouteDefinition[] = [
  { id: 'executive-dashboard', path: '/executive-dashboard', component: ExecutiveDashboard },
  { id: 'intelligence', path: '/intelligence', component: IntelligenceControlCenter },
  { id: 'ai-hub', path: '/ai', component: AIIntelligenceHub },
  { id: 'crisis-response', path: '/crisis', component: CrisisResponseCenter },
  { id: 'strategic-planning', path: '/strategic', component: StrategicPlanningHub },
  { id: 'scenarios', path: '/playbook-library', component: PlaybookLibrary },
  { id: 'what-if', path: '/what-if-analyzer', component: WhatIfAnalyzer },
  { id: 'analytics', path: '/analytics', component: AdvancedAnalytics },
  { id: 'demo-hub', path: '/demo-hub', component: UnifiedDemoHub },
  { id: 'settings', path: '/settings', component: Settings }
];

// TypeScript validation: ensure all navigation items have corresponding routes
const navigationPaths = new Set(navigationItems.map(item => item.path));
const routePaths = new Set(routes.map(route => route.path));

// Check for missing routes
const missingRoutes = navigationItems.filter(nav => !routePaths.has(nav.path));
const orphanedRoutes = routes.filter(route => !navigationPaths.has(route.path));

if (missingRoutes.length > 0) {
  console.warn('Navigation items without routes:', missingRoutes.map(item => item.id));
}

if (orphanedRoutes.length > 0) {
  console.warn('Routes without navigation items:', orphanedRoutes.map(route => route.id));
}

// Helper to get route by path
export const findRouteByPath = (path: string) => 
  routes.find(route => route.path === path);

// Helper to get route by nav item id
export const findRouteByNavId = (navId: string) => {
  const navItem = navigationItems.find(item => item.id === navId);
  return navItem ? findRouteByPath(navItem.path) : undefined;
};
