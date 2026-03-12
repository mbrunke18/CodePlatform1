import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import Header from "@/components/Header";
import MetricsCards from "@/components/MetricsCards";
import ScenariosSection from "@/components/ScenariosSection";
import AICopilotPanel from "@/components/AICopilotPanel";
import ActivityFeed from "@/components/ActivityFeed";
import TaskPanel from "@/components/TaskPanel";
import OrganizationsOverview from "@/components/OrganizationsOverview";
import PerformanceAnalytics from "@/components/PerformanceAnalytics";
import PulseMetricsPanel from "@/components/PulseMetricsPanel";
import StrategicInsightsPanel from "@/components/StrategicInsightsPanel";
import CulturalAnalyticsPanel from "@/components/CulturalAnalyticsPanel";
import InnovationPipelinePanel from "@/components/InnovationPipelinePanel";
import IntelligenceReportsPanel from "@/components/IntelligenceReportsPanel";
import ScenarioTemplateLibrary from "@/components/ScenarioTemplateLibrary";
import CrisisResponseDashboard from "@/components/CrisisResponseDashboard";
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const { isConnected } = useWebSocket();
  
  // Fetch organizations to get the correct organization ID
  const { data: organizations = [] } = useQuery<any[]>({ queryKey: ['/api/organizations'] });
  const organizationId = organizations[0]?.id || '95b97862-8e9d-4c4c-8609-7d8f37b68d36'; // fallback to known UUID

  // Authentication temporarily disabled for development access

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto">
        <Header isConnected={isConnected} />
        
        <div className="p-6 space-y-8">
          {/* Executive Overview */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Enterprise Intelligence Command Center
                </h1>
                <p className="text-lg text-muted-foreground">
                  Comprehensive organizational intelligence and strategic insights
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Live Intelligence Active</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            <MetricsCards />
          </div>
          
          {/* Primary Intelligence Modules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">AI Intelligence Modules</h2>
              <div className="text-sm text-muted-foreground">Real-time organizational analytics</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <PulseMetricsPanel />
              <StrategicInsightsPanel />
              <CulturalAnalyticsPanel />
            </div>
          </div>

          {/* Innovation & Intelligence */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Innovation Intelligence</h2>
              <div className="text-sm text-muted-foreground">Pipeline insights & breakthrough opportunities</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InnovationPipelinePanel />
              <IntelligenceReportsPanel />
            </div>
          </div>

          {/* Scenarios & AI Copilot */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Strategic Operations</h2>
              <div className="text-sm text-muted-foreground">Scenario planning & task coordination</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <ScenariosSection />
              <AICopilotPanel />
              <TaskPanel />
            </div>
          </div>

          {/* Activity & Performance */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Performance Analytics</h2>
              <div className="text-sm text-muted-foreground">Real-time activity monitoring & insights</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed />
              <PerformanceAnalytics />
            </div>
          </div>

          {/* Crisis Response & Templates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Crisis Management Center</h2>
              <div className="text-sm text-muted-foreground">Emergency response & scenario templates</div>
            </div>
            <CrisisResponseDashboard organizationId={organizationId} />
          </div>
          
          {/* Comprehensive Scenario Templates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Scenario Template Library</h2>
              <div className="text-sm text-muted-foreground">Professional crisis response frameworks</div>
            </div>
            <ScenarioTemplateLibrary organizationId={organizationId} />
          </div>

          {/* Organizations Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Enterprise Overview</h2>
              <div className="text-sm text-muted-foreground">Organizational structure & insights</div>
            </div>
            <OrganizationsOverview />
          </div>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}
