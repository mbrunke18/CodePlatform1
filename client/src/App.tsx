import { useEffect, lazy } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CrisisResponse from "@/pages/CrisisResponse";
// ScenarioTemplates consolidated into PlaybookLibrary
import UnifiedEnterprisePlatform from "@/pages/UnifiedEnterprisePlatform";
import ExecutiveSuite from "@/pages/ExecutiveSuite";
import AIIntelligence from "@/pages/AIIntelligence";
import BusinessIntelligence from "@/pages/BusinessIntelligence";
import VCPresentations from "@/pages/VCPresentations";
// ComprehensiveScenarios consolidated into PlaybookLibrary
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
import IntegrationsPage from "./pages/IntegrationsPage";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import TriggersManagement from "./pages/TriggersManagement";
import PulseIntelligence from "./pages/PulseIntelligence";
import FluxAdaptations from "./pages/FluxAdaptations";
import PrismInsights from "./pages/PrismInsights";
import EchoCulturalAnalytics from "./pages/EchoCulturalAnalytics";
import NovaInnovations from "./pages/NovaInnovations";
import ExecutiveWarRoomPage from "./pages/ExecutiveWarRoomPage";
import UATAdmin from "./pages/UATAdmin";
import PlaybookActivationConsole from "./pages/PlaybookActivationConsole";
import WhatIfAnalyzer from "./pages/WhatIfAnalyzer";
import PreparednessReport from "./pages/PreparednessReport";
import PlaybookLibraryV2 from "./pages/PlaybookLibraryV2";
import PlaybookDetail from "./pages/PlaybookDetail";
import PlaybookCommand from "./pages/PlaybookCommand";
import PlaybookSettings from "./pages/PlaybookSettings";
import PracticeDrills from "./pages/PracticeDrills";
import LiveDrillExecution from "./pages/LiveDrillExecution";
import NFLLearningDashboard from "./pages/NFLLearningDashboard";
import DemoRouter from "./pages/DemoRouter";
import InvestorDemo from "./pages/InvestorDemo";
import CustomerDemo from "./pages/CustomerDemo";
import RoadshowResources from "./pages/RoadshowResources";
import AIIntelligenceHub from "./pages/AIIntelligenceHub";
import IntelligenceControlCenter from "./pages/IntelligenceControlCenter";
import ExecutiveScorecard from "./pages/ExecutiveScorecard";
import AIRadarDashboard from "./pages/AIRadarDashboard";
import SignalIntelligenceHub from "./pages/SignalIntelligenceHub";
import InstitutionalMemory from "./pages/InstitutionalMemory";
import DrillTrackingSystem from "./pages/DrillTrackingSystem";
import BoardBriefings from "./pages/BoardBriefings";
import MarketingLanding from "./pages/MarketingLanding";
// ScenarioGallery consolidated into PlaybookLibrary
import InvestorLanding from "./pages/InvestorLanding";
import InvestorResources from "./pages/InvestorResources";
import DecisionVelocityPage from "./pages/DecisionVelocityPage";
import DecisionVelocityDashboard from "./pages/DecisionVelocityDashboard";
import DecisionTreeBuilder from "./pages/DecisionTreeBuilder";
import ExecutionCoordination from "./pages/ExecutionCoordination";
import OperatingModelHealthReport from "./pages/OperatingModelHealthReport";
import OperatingModelAlignment from "./pages/OperatingModelAlignment";
import ComprehensiveROIBreakdown from "./pages/ComprehensiveROIBreakdown";
import OurStory from "./pages/OurStory";
import WhyM from "./pages/WhyM";
import Research from "./pages/Research";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import PilotMonitoring from "./pages/PilotMonitoring";
import CrisisExposureMatrix from "./pages/CrisisExposureMatrix";
import SimulationStudio from "./pages/SimulationStudio";
import LuxuryCrisisDemo from "./pages/LuxuryCrisisDemo";
import IndustryDemosHub from "./pages/IndustryDemosHub";
import FinancialRansomwareDemo from "./pages/FinancialRansomwareDemo";
import LVMHMarketEntryDemo from "./pages/LVMHMarketEntryDemo";
import SHEINTrendDemo from "./pages/SHEINTrendDemo";
import SpaceXLaunchDemo from "./pages/SpaceXLaunchDemo";
import PharmaceuticalRecallDemo from "./pages/PharmaceuticalRecallDemo";
import ManufacturingSupplierDemo from "./pages/ManufacturingSupplierDemo";
import RetailFoodSafetyDemo from "./pages/RetailFoodSafetyDemo";
import EnergyGridFailureDemo from "./pages/EnergyGridFailureDemo";
import DemoLiveActivation from "./pages/DemoLiveActivation";
import RoleSelector from "./pages/RoleSelector";
import Homepage from "./pages/Homepage";
import McKinseyIntelligenceCenter from "./pages/mckinsey/McKinseyIntelligenceCenter";
import FutureReadinessDashboard from "./pages/FutureReadinessDashboard";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import Sitemap from "./pages/Sitemap";
import CommandCenter from "./pages/CommandCenter";
// ScenarioLibraryPage consolidated into PlaybookLibrary
import FutureGym from "./pages/FutureGym";
import ForesightRadar from "./pages/ForesightRadar";
import LivingPlaybooks from "./pages/LivingPlaybooks";
import ContinuousModePage from "./pages/ContinuousModePage";
import PlaybookReadinessAudit from "./pages/PlaybookReadinessAudit";
import ExecutiveSimulationDemo from "./pages/ExecutiveSimulationDemo";
import ProductTour from "./pages/ProductTour";
import InvestorPresentation from "./pages/InvestorPresentation";
import OrganizationSetup from "./pages/OrganizationSetup";
import PlaybookCustomization from "./pages/PlaybookCustomization";
import PlaybookCustomize from "./pages/PlaybookCustomize";
import SuccessMetricsConfiguration from "./pages/SuccessMetricsConfiguration";
import OnboardingWizard from "./pages/OnboardingWizard";
import NewUserJourney from "./pages/NewUserJourney";
import CompetitivePositioning from "./pages/CompetitivePositioning";
import PilotProgram from "./pages/PilotProgram";
import HowItWorks from "./pages/HowItWorks";
import OneClickDemo from "./pages/OneClickDemo";
import ROICalculator from "./pages/ROICalculator";
import BoardExport from "./pages/BoardExport";
import SandboxDemo from "./pages/SandboxDemo";
import VideoLanding from "./pages/VideoLanding";
import PlaybookManagement from "./pages/PlaybookManagement";
import TaskManagement from "./pages/TaskManagement";
import StakeholderManagement from "./pages/StakeholderManagement";
import { DemoControllerProvider } from "./contexts/DemoController";
import { DemoTimelineProvider } from "./contexts/DemoTimelineContext";
import { DynamicStrategyProvider } from "./contexts/DynamicStrategyContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import OnboardingOverlay from "./components/onboarding/OnboardingOverlay";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuth } from "./hooks/useAuth";
import GuidedOverlay from "./components/demo/GuidedOverlay";
import { HeroMetricsOverlay } from "./components/demo/HeroMetricsOverlay";
import { CrisisResolvedCelebration } from "./components/demo/CrisisResolvedCelebration";
import { PowerfulCTA } from "./components/demo/PowerfulCTA";
import { CostOfInactionOverlay } from "./components/demo/CostOfInactionOverlay";
import { PersonalReputationRiskOverlay } from "./components/demo/PersonalReputationRiskOverlay";
import { PeerAdoptionOverlay } from "./components/demo/PeerAdoptionOverlay";
import { ExecutiveTestimonialOverlay } from "./components/demo/ExecutiveTestimonialOverlay";
import { SplitScreenComparison } from "./components/demo/SplitScreenComparison";
import { ScrollToTop } from "./components/ScrollToTop";

function HomeRoute() {
  // Show new professional homepage for everyone - no authentication required
  return <Homepage />;
}

// Redirect component for deprecated routes
function RedirectToScenarios() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/business-scenarios');
  }, [setLocation]);
  
  return null;
}

// Redirect all legacy scenario/template pages to unified Playbooks page
function RedirectToPlaybookLibrary() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/playbooks');
  }, [setLocation]);
  
  return null;
}

// Redirect all demo routes to the unified How It Works page
function RedirectToHowItWorks() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/how-it-works');
  }, [setLocation]);
  
  return null;
}

// Redirect all legacy dashboard pages to unified Executive Dashboard
function RedirectToExecutiveDashboard() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/executive-dashboard');
  }, [setLocation]);
  
  return null;
}

// Redirect all legacy demo pages to unified Demo Hub
function RedirectToDemoHub() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/demo-hub');
  }, [setLocation]);
  
  return null;
}

// Redirect all legacy intelligence pages to Intelligence Control Center
function RedirectToIntelligence() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/intelligence');
  }, [setLocation]);
  
  return null;
}

// Redirect legacy trigger routes to triggers management
function RedirectToTriggersManagement() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/triggers-management');
  }, [setLocation]);
  
  return null;
}

function Router() {
  const [location] = useLocation();
  
  return (
    <DemoTimelineProvider defaultDuration={720000} defaultSpeedMultiplier={20}>
      <DemoControllerProvider>
        <ScrollToTop />
        <Switch>
        {/* Primary Routes - Simplified Executive Experience */}
        <Route path="/" component={Homepage} />
        <Route path="/home" component={Homepage} />
        <Route path="/executive-dashboard" component={ExecutiveDashboard} />
        <Route path="/scorecard" component={RedirectToExecutiveDashboard} />
        <Route path="/executive-scorecard" component={RedirectToExecutiveDashboard} />
        <Route path="/executive-suite" component={RedirectToExecutiveDashboard} />
        <Route path="/dashboard" component={RedirectToExecutiveDashboard} />
        <Route path="/platform" component={RedirectToExecutiveDashboard} />
        <Route path="/business-intelligence" component={BusinessIntelligence} />
        
        {/* Strategic Operations */}
        <Route path="/strategic-monitoring" component={CrisisResponseCenter} />
        <Route path="/strategic-monitoring/:id" component={CrisisDetail} />
        <Route path="/command-center" component={ExecutiveWarRoomPage} />
        <Route path="/collaboration" component={RealTimeCollaboration} />
        <Route path="/playbook-activation/:triggerId/:playbookId" component={PlaybookActivationConsole} />
        
        {/* Strategic Planning */}
        <Route path="/strategic" component={StrategicPlanningHub} />
        <Route path="/what-if-analyzer" component={WhatIfAnalyzer} />
        <Route path="/decision-velocity" component={DecisionVelocityPage} />
        <Route path="/decisions" component={DecisionVelocityDashboard} />
        <Route path="/decision-trees" component={DecisionTreeBuilder} />
        <Route path="/execution-coordination" component={ExecutionCoordination} />
        <Route path="/scenarios" component={RedirectToPlaybookLibrary} />
        <Route path="/institutional-memory" component={InstitutionalMemory} />
        <Route path="/board-briefings" component={BoardBriefings} />
        <Route path="/operating-model" component={OperatingModelAlignment} />
        <Route path="/operating-model-health" component={RedirectToExecutiveDashboard} />
        <Route path="/roi-breakdown" component={ComprehensiveROIBreakdown} />
        <Route path="/our-story" component={OurStory} />
        <Route path="/why-m" component={WhyM} />
        <Route path="/research" component={Research} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/competitive-positioning" component={CompetitivePositioning} />
        <Route path="/pilot-program" component={PilotProgram} />
        <Route path="/contact" component={Contact} />
        <Route path="/early-access" component={Contact} />
        
        {/* Intelligence Control Center - Unified Entry Point */}
        <Route path="/intelligence" component={IntelligenceControlCenter} />
        <Route path="/intelligence-control-center" component={IntelligenceControlCenter} />
        
        {/* AI Intelligence - Consolidated Hub */}
        <Route path="/ai" component={AIIntelligenceHub} />
        <Route path="/ai-radar" component={AIRadarDashboard} />
        <Route path="/signal-intelligence" component={SignalIntelligenceHub} />
        <Route path="/pulse" component={AIIntelligenceHub} />
        <Route path="/flux" component={AIIntelligenceHub} />
        <Route path="/prism" component={AIIntelligenceHub} />
        <Route path="/echo" component={AIIntelligenceHub} />
        <Route path="/nova" component={AIIntelligenceHub} />
        
        {/* AI Intelligence - Individual Module Pages */}
        <Route path="/pulse-intelligence" component={PulseIntelligence} />
        <Route path="/flux-adaptations" component={FluxAdaptations} />
        <Route path="/prism-insights" component={PrismInsights} />
        <Route path="/echo-cultural-analytics" component={EchoCulturalAnalytics} />
        <Route path="/nova-innovations" component={NovaInnovations} />
        
        {/* Dynamic Strategy - Future Readiness (redirected to Executive Dashboard) */}
        <Route path="/future-readiness" component={RedirectToExecutiveDashboard} />
        <Route path="/readiness" component={RedirectToExecutiveDashboard} />
        <Route path="/command-center-dynamic" component={CommandCenter} />
        <Route path="/scenario-library" component={RedirectToPlaybookLibrary} />
        <Route path="/scenario-gallery" component={RedirectToPlaybookLibrary} />
        <Route path="/comprehensive-scenarios" component={RedirectToPlaybookLibrary} />
        <Route path="/triggers" component={RedirectToTriggersManagement} />
        <Route path="/trigger-dashboard" component={RedirectToTriggersManagement} />
        <Route path="/playbook-readiness" component={PlaybookReadinessAudit} />
        <Route path="/playbook-audit" component={PlaybookReadinessAudit} />
        <Route path="/future-gym" component={FutureGym} />
        <Route path="/foresight-radar" component={ForesightRadar} />
        <Route path="/living-playbooks" component={LivingPlaybooks} />
        <Route path="/continuous-mode" component={ContinuousModePage} />
        
        {/* McKinsey Intelligence Center */}
        <Route path="/mckinsey" component={McKinseyIntelligenceCenter} />
        <Route path="/mckinsey-intelligence" component={McKinseyIntelligenceCenter} />
        
        {/* Triggers & Preparedness */}
        <Route path="/triggers-management" component={TriggersManagement} />
        <Route path="/organization-setup" component={OrganizationSetup} />
        <Route path="/playbook-customization" component={PlaybookCustomization} />
        <Route path="/success-metrics" component={SuccessMetricsConfiguration} />
        <Route path="/onboarding" component={OnboardingWizard} />
        <Route path="/setup" component={OnboardingWizard} />
        <Route path="/get-started" component={OnboardingWizard} />
        <Route path="/new-user-journey" component={NewUserJourney} />
        <Route path="/start" component={NewUserJourney} />
        <Route path="/welcome" component={NewUserJourney} />
        <Route path="/journey" component={NewUserJourney} />
        <Route path="/experience" component={NewUserJourney} />
        <Route path="/preparedness-report" component={PreparednessReport} />
        <Route path="/drill-tracking" component={DrillTrackingSystem} />
        <Route path="/playbook-library" component={PlaybookLibraryV2} />
        <Route path="/identify/playbook-library" component={PlaybookLibraryV2} />
        <Route path="/identify/playbook-command/:id" component={PlaybookCommand} />
        <Route path="/playbooks" component={PlaybookLibraryV2} />
        <Route path="/playbooks/:id/customize" component={PlaybookCustomize} />
        <Route path="/playbooks/:id/preview" component={PlaybookDetail} />
        <Route path="/playbooks/:id/edit" component={PlaybookCustomize} />
        <Route path="/playbooks/create" component={PlaybookCustomize} />
        <Route path="/playbook-management" component={PlaybookManagement} />
        <Route path="/playbook-customize/new" component={PlaybookCustomize} />
        <Route path="/playbook-customize/:id" component={PlaybookCustomize} />
        <Route path="/task-management" component={TaskManagement} />
        <Route path="/stakeholder-management" component={StakeholderManagement} />
        <Route path="/stakeholders" component={StakeholderManagement} />
        <Route path="/playbook-library/:id" component={PlaybookDetail} />
        <Route path="/playbook-library/:id/settings" component={PlaybookSettings} />
        <Route path="/playbook-command/:id" component={PlaybookCommand} />
        <Route path="/practice-drills/:drillId/live" component={LiveDrillExecution} />
        <Route path="/practice-drills" component={PracticeDrills} />
        <Route path="/crisis-exposure-matrix" component={CrisisExposureMatrix} />
        <Route path="/simulation-studio" component={SimulationStudio} />
        <Route path="/nfl-learning" component={NFLLearningDashboard} />
        
        {/* Analytics */}
        <Route path="/analytics" component={AdvancedAnalytics} />
        <Route path="/executive-analytics-dashboard" component={ExecutiveAnalyticsDashboard} />
        <Route path="/audit-logging-center" component={AuditLoggingCenter} />
        <Route path="/calculator" component={ComprehensiveROIBreakdown} />
        <Route path="/roi-calculator" component={ROICalculator} />
        
        {/* Sales & Demo Tools */}
        <Route path="/live-demo" component={OneClickDemo} />
        <Route path="/board-export" component={BoardExport} />
        <Route path="/sandbox-demo" component={SandboxDemo} />
        <Route path="/try-it" component={SandboxDemo} />
        <Route path="/video" component={VideoLanding} />
        <Route path="/cinematic" component={VideoLanding} />
        <Route path="/sizzle" component={VideoLanding} />
        <Route path="/2-minute" component={VideoLanding} />
        <Route path="/spots" component={VideoLanding} />
        <Route path="/30-second" component={VideoLanding} />
        <Route path="/brand-films" component={VideoLanding} />
        
        {/* Integration Hub */}
        <Route path="/integration-hub" component={IntegrationHub} />
        <Route path="/integrations" component={IntegrationsPage} />
        
        {/* Demo Entry Point - Single clear path */}
        <Route path="/demo" component={DemoRouter} />
        <Route path="/demo-hub" component={DemoRouter} />
        <Route path="/demo-selector" component={DemoRouter} />
        <Route path="/demo/selector" component={DemoRouter} />
        <Route path="/transformational-demo" component={DemoRouter} />
        <Route path="/four-phase-demo" component={DemoRouter} />
        <Route path="/4-phase-demo" component={DemoRouter} />
        
        {/* Live Interactive Demos - All 7 demos now use unified DemoLiveActivation component */}
        <Route path="/role-selector" component={RoleSelector} />
        <Route path="/demo/role-selector" component={RoleSelector} />
        <Route path="/demo/live-activation" component={DemoLiveActivation} />
        <Route path="/demo/ransomware" component={DemoLiveActivation} />
        <Route path="/demo/ma-integration" component={DemoLiveActivation} />
        <Route path="/demo/product-launch" component={DemoLiveActivation} />
        <Route path="/demo/supplier-crisis" component={DemoLiveActivation} />
        <Route path="/demo/competitive-response" component={DemoLiveActivation} />
        <Route path="/demo/regulatory-crisis" component={DemoLiveActivation} />
        <Route path="/demo/customer-crisis" component={DemoLiveActivation} />
        
        {/* Approval Pages - Magic Link Approvals */}
        <Route path="/approval-success" component={lazy(() => import('./pages/ApprovalSuccess'))} />
        <Route path="/approval-error" component={lazy(() => import('./pages/ApprovalError'))} />
        
        {/* Industry Demos Hub - Centralized Demo Access */}
        <Route path="/industry-demos" component={IndustryDemosHub} />
        <Route path="/crisis-demos" component={IndustryDemosHub} />
        
        {/* Industry-Specific Crisis Demos */}
        <Route path="/luxury-demo" component={LuxuryCrisisDemo} />
        <Route path="/luxury-crisis-demo" component={LuxuryCrisisDemo} />
        <Route path="/financial-demo" component={FinancialRansomwareDemo} />
        <Route path="/pharma-demo" component={PharmaceuticalRecallDemo} />
        <Route path="/manufacturing-demo" component={ManufacturingSupplierDemo} />
        <Route path="/retail-demo" component={RetailFoodSafetyDemo} />
        <Route path="/energy-demo" component={EnergyGridFailureDemo} />
        
        {/* Strategic Opportunity Demos (Offensive Coordination) */}
        <Route path="/lvmh-demo" component={LVMHMarketEntryDemo} />
        <Route path="/shein-demo" component={SHEINTrendDemo} />
        <Route path="/spacex-demo" component={SpaceXLaunchDemo} />
        
        {/* Additional Demo Experiences */}
        <Route path="/demos" component={DemoRouter} />
        <Route path="/intelligence-demo" component={DemoRouter} />
        <Route path="/signals-demo" component={DemoRouter} />
        <Route path="/executive-simulation" component={ExecutiveSimulationDemo} />
        <Route path="/simulation-demo" component={ExecutiveSimulationDemo} />
        <Route path="/product-tour" component={ProductTour} />
        <Route path="/video-tour" component={ProductTour} />
        <Route path="/investor-presentation" component={InvestorPresentation} />
        <Route path="/investor-demo" component={InvestorDemo} />
        <Route path="/customer-demo" component={CustomerDemo} />
        <Route path="/investor-resources" component={InvestorResources} />
        <Route path="/roadshow-resources" component={RoadshowResources} />
        <Route path="/roadshow" component={RoadshowResources} />
        <Route path="/pitch-deck" component={InvestorPresentation} />
        
        {/* Legacy demos - redirect to main demo paths */}
        <Route path="/watch-demo" component={DemoRouter} />
        <Route path="/trade-show-demo" component={DemoRouter} />
        <Route path="/executive-demo" component={DemoRouter} />
        <Route path="/hybrid-demo" component={DemoRouter} />
        <Route path="/executive-demo-walkthrough" component={DemoRouter} />
        
        {/* Legacy Routes */}
        <Route path="/interactive-demo" component={RedirectToHowItWorks} />
        <Route path="/interactive-master-demo" component={RedirectToHowItWorks} />
        <Route path="/investor-landing" component={RedirectToHowItWorks} />
        
        {/* Playbook Library - 166 Strategic Playbooks */}
        <Route path="/business-scenarios" component={PlaybookLibraryV2} />
        <Route path="/business-scenario/:id" component={PlaybookDetail} />
        
        {/* Settings & Administration */}
        <Route path="/vc-presentations" component={VCPresentations} />
        <Route path="/settings" component={Settings} />
        <Route path="/uat-admin" component={UATAdmin} />
        <Route path="/pilot-monitoring" component={PilotMonitoring} />
        <Route path="/sitemap" component={Sitemap} />
        
        {/* Landing Page */}
        <Route path="/landing" component={Landing} />
        
        {/* Legacy Routes - Redirects for backwards compatibility */}
        <Route path="/login" component={Landing} />
        <Route path="/comprehensive-homepage" component={ExecutiveScorecard} />
        <Route path="/templates" component={RedirectToPlaybookLibrary} />
        <Route path="/crisis" component={CrisisResponseCenter} />
        <Route path="/crisis/:id" component={CrisisDetail} />
        <Route path="/war-room" component={ExecutiveWarRoomPage} />
        <Route path="/crisis-response-center" component={CrisisResponseCenter} />
        <Route path="/strategic-planning-hub" component={StrategicPlanningHub} />
        <Route path="/advanced-analytics" component={AdvancedAnalytics} />
        
          <Route component={NotFound} />
        </Switch>
      </DemoControllerProvider>
    </DemoTimelineProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerProvider>
        <DynamicStrategyProvider>
          <OnboardingProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <OnboardingOverlay />
                <Router />
              </TooltipProvider>
            </ThemeProvider>
          </OnboardingProvider>
        </DynamicStrategyProvider>
      </CustomerProvider>
    </QueryClientProvider>
  );
}

export default App;
