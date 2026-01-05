import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CrisisResponse from "@/pages/CrisisResponse";
import ScenarioTemplates from "@/pages/ScenarioTemplates";
import UnifiedEnterprisePlatform from "@/pages/UnifiedEnterprisePlatform";
import ExecutiveSuite from "@/pages/ExecutiveSuite";
import AIIntelligence from "@/pages/AIIntelligence";
import BusinessIntelligence from "@/pages/BusinessIntelligence";
import VCPresentations from "@/pages/VCPresentations";
import ComprehensiveScenarios from "@/pages/ComprehensiveScenarios";
import AIIntelligenceDemo from "@/pages/AIIntelligenceDemo";
import EnterpriseMetrics from "@/pages/EnterpriseMetrics";
import Settings from "@/pages/Settings";
import CrisisResponseCenter from "./pages/CrisisResponseCenter";
import CrisisDetail from "./pages/CrisisDetail";
import StrategicPlanningHub from "./pages/StrategicPlanningHub";
import ExecutiveAnalyticsDashboard from "./pages/ExecutiveAnalyticsDashboard";
import ComprehensiveAIIntelligence from "./pages/ComprehensiveAIIntelligence";
import RealTimeCollaboration from "./pages/RealTimeCollaboration";
import AuditLoggingCenter from "./pages/AuditLoggingCenter";
import IntegrationHub from "./pages/IntegrationHub";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import TriggersManagement from "./pages/TriggersManagement";
import PulseIntelligence from "./pages/PulseIntelligence";
import FluxAdaptations from "./pages/FluxAdaptations";
import PrismInsights from "./pages/PrismInsights";
import EchoCulturalAnalytics from "./pages/EchoCulturalAnalytics";
import NovaInnovations from "./pages/NovaInnovations";
import ExecutiveWarRoomPage from "./pages/ExecutiveWarRoomPage";
import UATAdmin from "./pages/UATAdmin";
import ExecutiveDemo from "./pages/ExecutiveDemo";
import HybridDemoNavigator from "./pages/HybridDemoNavigator";
import PlaybookActivationConsole from "./pages/PlaybookActivationConsole";
import WhatIfAnalyzer from "./pages/WhatIfAnalyzer";
import { DemoControllerProvider } from "./contexts/DemoController";
import GuidedOverlay from "./components/demo/GuidedOverlay";

function Router() {
  return (
    <Switch>
      <Route path="/" component={UnifiedEnterprisePlatform} />
      <Route path="/login" component={Landing} />
      <Route path="/dashboard" component={UnifiedEnterprisePlatform} />
      <Route path="/comprehensive-homepage" component={Dashboard} />
      <Route path="/crisis" component={CrisisResponse} />
      <Route path="/crisis/:id" component={CrisisDetail} />
      <Route path="/templates" component={ScenarioTemplates} />
      <Route path="/executive-suite" component={ExecutiveSuite} />
      <Route path="/ai-intelligence" component={AIIntelligence} />
      <Route path="/business-intelligence" component={BusinessIntelligence} />
      <Route path="/vc-presentations" component={VCPresentations} />
      <Route path="/comprehensive-scenarios" component={ComprehensiveScenarios} />
      <Route path="/ai-intelligence-demo" component={AIIntelligenceDemo} />
      <Route path="/enterprise-metrics" component={EnterpriseMetrics} />
      <Route path="/settings" component={Settings} />
      <Route path="/landing" component={Landing} />
      <Route path="/crisis-response-center" component={CrisisResponseCenter} />
      <Route path="/strategic-planning-hub" component={StrategicPlanningHub} />
      <Route path="/executive-analytics-dashboard" component={ExecutiveAnalyticsDashboard} />
      <Route path="/comprehensive-ai-intelligence" component={ComprehensiveAIIntelligence} />
      <Route path="/real-time-collaboration" component={RealTimeCollaboration} />
      <Route path="/audit-logging-center" component={AuditLoggingCenter} />
      <Route path="/integration-hub" component={IntegrationHub} />
      <Route path="/advanced-analytics" component={AdvancedAnalytics} />
      <Route path="/triggers-management" component={TriggersManagement} />
      <Route path="/what-if-analyzer" component={WhatIfAnalyzer} />
      <Route path="/playbook-activation/:triggerId/:playbookId" component={PlaybookActivationConsole} />
      {/* AI Intelligence Module Routes */}
      <Route path="/pulse" component={PulseIntelligence} />
      <Route path="/flux" component={FluxAdaptations} />
      <Route path="/prism" component={PrismInsights} />
      <Route path="/echo" component={EchoCulturalAnalytics} />
      <Route path="/nova" component={NovaInnovations} />
      {/* Strategic Enhancement Routes */}
      <Route path="/war-room" component={ExecutiveWarRoomPage} />
      {/* UAT Administration */}
      <Route path="/uat-admin" component={UATAdmin} />
      {/* Executive Demo */}
      <Route path="/executive-demo" component={ExecutiveDemo} />
      {/* Hybrid Demo Navigator */}
      <Route path="/hybrid-demo" component={HybridDemoNavigator} />
      {/* Management Routes */}
      <Route path="/scenarios" component={ComprehensiveScenarios} />
      <Route path="/organizations" component={Dashboard} />
      <Route path="/strategic" component={StrategicPlanningHub} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoControllerProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <GuidedOverlay />
        </TooltipProvider>
      </DemoControllerProvider>
    </QueryClientProvider>
  );
}

export default App;
