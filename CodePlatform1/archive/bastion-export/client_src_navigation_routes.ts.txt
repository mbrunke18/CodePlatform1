import { ComponentType } from 'react';
import { navigationItems } from './config';

// Route definitions - must match navigation paths
export interface RouteDefinition {
  id: string;
  path: string;
  component: ComponentType;
}

// Import all page components
import Dashboard from '../pages/Dashboard';
import UnifiedEnterprisePlatform from '../pages/UnifiedEnterprisePlatform';
import PulseIntelligence from '../pages/PulseIntelligence';
import FluxAdaptations from '../pages/FluxAdaptations';
import PrismInsights from '../pages/PrismInsights';
import EchoCulturalAnalytics from '../pages/EchoCulturalAnalytics';
import NovaInnovations from '../pages/NovaInnovations';
import CrisisResponse from '../pages/CrisisResponse';
import CrisisResponseCenter from '../pages/CrisisResponseCenter';
import ScenarioTemplates from '../pages/ScenarioTemplates';
import TriggersManagement from '../pages/TriggersManagement';
import ExecutiveWarRoomPage from '../pages/ExecutiveWarRoomPage';
import StrategicPlanningHub from '../pages/StrategicPlanningHub';
import ComprehensiveScenarios from '../pages/ComprehensiveScenarios';
import AdvancedAnalytics from '../pages/AdvancedAnalytics';
import ExecutiveAnalyticsDashboard from '../pages/ExecutiveAnalyticsDashboard';
import RealTimeCollaboration from '../pages/RealTimeCollaboration';
import ExecutiveDemo from '../pages/ExecutiveDemo';
import IntegrationHub from '../pages/IntegrationHub';
import AuditLoggingCenter from '../pages/AuditLoggingCenter';
import Settings from '../pages/Settings';
import UATAdmin from '../pages/UATAdmin';
import NotFound from '../pages/not-found';

// Central route registry - maps navigation items to their components
export const routes: RouteDefinition[] = [
  { id: 'command-center', path: '/', component: Dashboard },
  { id: 'pulse', path: '/pulse', component: PulseIntelligence },
  { id: 'flux', path: '/flux', component: FluxAdaptations },
  { id: 'prism', path: '/prism', component: PrismInsights },
  { id: 'echo', path: '/echo', component: EchoCulturalAnalytics },
  { id: 'nova', path: '/nova', component: NovaInnovations },
  { id: 'crisis-response', path: '/crisis', component: CrisisResponseCenter },
  { id: 'scenario-templates', path: '/templates', component: ScenarioTemplates },
  { id: 'triggers-management', path: '/triggers-management', component: TriggersManagement },
  { id: 'war-room', path: '/war-room', component: ExecutiveWarRoomPage },
  { id: 'strategic-planning', path: '/strategic', component: StrategicPlanningHub },
  { id: 'scenarios', path: '/scenarios', component: ComprehensiveScenarios },
  { id: 'organizations', path: '/organizations', component: Dashboard },
  { id: 'advanced-analytics', path: '/advanced-analytics', component: AdvancedAnalytics },
  { id: 'executive-analytics', path: '/executive-analytics-dashboard', component: ExecutiveAnalyticsDashboard },
  { id: 'real-time-collaboration', path: '/real-time-collaboration', component: RealTimeCollaboration },
  { id: 'executive-demo', path: '/executive-demo', component: ExecutiveDemo },
  { id: 'integration-hub', path: '/integration-hub', component: IntegrationHub },
  { id: 'audit-compliance', path: '/audit-logging-center', component: AuditLoggingCenter },
  { id: 'settings', path: '/settings', component: Settings },
  { id: 'uat-admin', path: '/uat-admin', component: UATAdmin }
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