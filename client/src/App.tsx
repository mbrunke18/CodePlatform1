import { useEffect, useRef, lazy, Suspense, Component, ReactNode } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryState { hasError: boolean; error: Error | null; }
class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary] Caught:', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#F8F7F4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: 480, width: '100%', padding: '2.5rem', background: '#fff', border: '1px solid #E8E4DC', borderTop: '4px solid #C9A84C', borderRadius: 4, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(201,168,76,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <RefreshCw size={22} color="#C9A84C" />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0F2E', margin: '0 0 0.5rem' }}>Page Encountered an Error</h2>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 0.75rem', lineHeight: 1.6 }}>Something went wrong loading this page.</p>
            {this.state.error && <pre style={{ fontSize: '0.7rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 4, padding: '0.75rem', textAlign: 'left', overflow: 'auto', maxHeight: 120, margin: '0 0 1rem', color: '#374151', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{this.state.error.message}</pre>}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => window.location.href = '/'} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.6rem 1.25rem', background: '#0A0F2E', color: '#fff', border: 'none', borderRadius: 4, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                <Home size={14} /> Return Home
              </button>
              <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.6rem 1.25rem', background: '#fff', color: '#0A0F2E', border: '1px solid #E8E4DC', borderRadius: 4, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                <RefreshCw size={14} /> Reload Page
              </button>
            </div>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#9CA3AF' }}>VaughnMartin Execution OS · Error Recovery</p>
        </div>
      );
    }
    return this.props.children;
  }
}

import NotFound from "@/pages/not-found";
const Homepage = lazy(() => import("./pages/Homepage"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const TryDemo = lazy(() => import("./pages/TryDemo"));
const TwelveMinuteTestDrive = lazy(() => import("./pages/TwelveMinuteTestDrive"));
const IncidentAnalyzer = lazy(() => import("./pages/IncidentAnalyzer"));
const ReadinessAssessment = lazy(() => import("./pages/ReadinessAssessment"));
const WhatIfAnalyzer = lazy(() => import("./pages/WhatIfAnalyzer"));
const PlaybookLibraryV2 = lazy(() => import("./pages/PlaybookLibraryV2"));
const PlaybookDetail = lazy(() => import("./pages/PlaybookDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Investors = lazy(() => import("./pages/Investors"));
const InvestorLanding = lazy(() => import("./pages/InvestorLanding"));
const ExecutiveBrief = lazy(() => import("./pages/ExecutiveBrief"));
const WhyExecutionOS = lazy(() => import("./pages/WhyExecutionOS"));
const ExecutiveDashboard = lazy(() => import("./pages/ExecutiveDashboard"));

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CrisisResponse = lazy(() => import("@/pages/CrisisResponse"));
const BusinessIntelligence = lazy(() => import("@/pages/BusinessIntelligence"));
const VCPresentations = lazy(() => import("@/pages/VCPresentations"));
const Settings = lazy(() => import("@/pages/Settings"));
const CrisisResponseCenter = lazy(() => import("./pages/CrisisResponseCenter"));
const CrisisDetail = lazy(() => import("./pages/CrisisDetail"));
const StrategicPlanningHub = lazy(() => import("./pages/StrategicPlanningHub"));
const ExecutiveAnalyticsDashboard = lazy(() => import("./pages/ExecutiveAnalyticsDashboard"));
const RealTimeCollaboration = lazy(() => import("./pages/RealTimeCollaboration"));
const AuditLoggingCenter = lazy(() => import("./pages/AuditLoggingCenter"));
const IntegrationHub = lazy(() => import("./pages/IntegrationHub"));
const IntegrationsPage = lazy(() => import("./pages/IntegrationsPage"));
const IntegrationConnections = lazy(() => import("./pages/IntegrationConnections"));
const AdvancedAnalytics = lazy(() => import("./pages/AdvancedAnalytics"));
const TriggersManagement = lazy(() => import("./pages/TriggersManagement"));
const SignalConfiguration = lazy(() => import("./pages/SignalConfiguration"));
const PulseIntelligence = lazy(() => import("./pages/PulseIntelligence"));
const FluxAdaptations = lazy(() => import("./pages/FluxAdaptations"));
const PrismInsights = lazy(() => import("./pages/PrismInsights"));
const EchoCulturalAnalytics = lazy(() => import("./pages/EchoCulturalAnalytics"));
const NovaInnovations = lazy(() => import("./pages/NovaInnovations"));
const ExecutiveWarRoomPage = lazy(() => import("./pages/ExecutiveWarRoomPage"));
const UATAdmin = lazy(() => import("./pages/UATAdmin"));
const PlaybookActivationConsole = lazy(() => import("./pages/PlaybookActivationConsole"));
const PreparednessReport = lazy(() => import("./pages/PreparednessReport"));
const PlaybookCommand = lazy(() => import("./pages/PlaybookCommand"));
const PlaybookSettings = lazy(() => import("./pages/PlaybookSettings"));
const PracticeDrills = lazy(() => import("./pages/PracticeDrills"));
const LiveDrillExecution = lazy(() => import("./pages/LiveDrillExecution"));
const ExecutionLearningDashboard = lazy(() => import("./pages/NFLLearningDashboard"));
const RoadshowResources = lazy(() => import("./pages/RoadshowResources"));
const AIIntelligenceHub = lazy(() => import("./pages/AIIntelligenceHub"));
const IntelligenceControlCenter = lazy(() => import("./pages/IntelligenceControlCenter"));
const ExecutiveHub = lazy(() => import("./pages/ExecutiveHub"));
const IntelligenceHub = lazy(() => import("./pages/IntelligenceHub"));
const SettingsHub = lazy(() => import("./pages/SettingsHub"));
const SituationalHub = lazy(() => import("./pages/SituationalHub"));
const ExecutiveScorecard = lazy(() => import("./pages/ExecutiveScorecard"));
const ExecutiveSummaryGenerator = lazy(() => import("./pages/ExecutiveSummaryGenerator"));
const AIRadarDashboard = lazy(() => import("./pages/AIRadarDashboard"));
const SignalIntelligenceHub = lazy(() => import("./pages/SignalIntelligenceHub"));
const LiveDetectionFeed = lazy(() => import("./pages/LiveDetectionFeed"));
const InstitutionalMemory = lazy(() => import("./pages/InstitutionalMemory"));
const DrillTrackingSystem = lazy(() => import("./pages/DrillTrackingSystem"));
const BoardBriefings = lazy(() => import("./pages/BoardBriefings"));
const InvestorResources = lazy(() => import("./pages/InvestorResources"));
const DecisionVelocityPage = lazy(() => import("./pages/DecisionVelocityPage"));
const DecisionVelocityDashboard = lazy(() => import("./pages/DecisionVelocityDashboard"));
const DecisionTreeBuilder = lazy(() => import("./pages/DecisionTreeBuilder"));
const ExecutionCoordination = lazy(() => import("./pages/ExecutionCoordination"));
const OperatingModelAlignment = lazy(() => import("./pages/OperatingModelAlignment"));
const ComprehensiveROIBreakdown = lazy(() => import("./pages/ComprehensiveROIBreakdown"));
const OurStory = lazy(() => import("./pages/OurStory"));
const WhyExecuteIQ = lazy(() => import("./pages/WhyExecuteIQ"));
const Research = lazy(() => import("./pages/Research"));
const PilotMonitoring = lazy(() => import("./pages/PilotMonitoring"));
const CrisisExposureMatrix = lazy(() => import("./pages/CrisisExposureMatrix"));
const CrisisCommunicationsGenerator = lazy(() => import("./pages/CrisisCommunicationsGenerator"));
const FinancialExposureEstimator = lazy(() => import("./pages/FinancialExposureEstimator"));
const ConcurrentSituationBoard = lazy(() => import("./pages/ConcurrentSituationBoard"));
const LuxuryCrisisDemo = lazy(() => import("./pages/LuxuryCrisisDemo"));
const IndustryDemosHub = lazy(() => import("./pages/IndustryDemosHub"));
const FinancialRansomwareDemo = lazy(() => import("./pages/FinancialRansomwareDemo"));
const LVMHMarketEntryDemo = lazy(() => import("./pages/LVMHMarketEntryDemo"));
const SHEINTrendDemo = lazy(() => import("./pages/SHEINTrendDemo"));
const SpaceXLaunchDemo = lazy(() => import("./pages/SpaceXLaunchDemo"));
const PharmaceuticalRecallDemo = lazy(() => import("./pages/PharmaceuticalRecallDemo"));
const ManufacturingSupplierDemo = lazy(() => import("./pages/ManufacturingSupplierDemo"));
const RetailFoodSafetyDemo = lazy(() => import("./pages/RetailFoodSafetyDemo"));
const EnergyGridFailureDemo = lazy(() => import("./pages/EnergyGridFailureDemo"));
const RoleSelector = lazy(() => import("./pages/RoleSelector"));
const McKinseyIntelligenceCenter = lazy(() => import("./pages/mckinsey/McKinseyIntelligenceCenter"));
const StrategyExecutionDashboard = lazy(() => import("./pages/StrategyExecutionDashboard"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const CommandCenter = lazy(() => import("./pages/CommandCenter"));
const CommandLanding = lazy(() => import("./pages/CommandLanding"));
const ExecutionHistory = lazy(() => import("./pages/ExecutionHistory"));
const FutureGym = lazy(() => import("./pages/FutureGym"));
const ForesightRadar = lazy(() => import("./pages/ForesightRadar"));
const LivingPlaybooks = lazy(() => import("./pages/LivingPlaybooks"));
const ContinuousModePage = lazy(() => import("./pages/ContinuousModePage"));
const PlaybookReadinessAudit = lazy(() => import("./pages/PlaybookReadinessAudit"));
const PlatformOverview = lazy(() => import("./pages/PlatformOverview"));
const IDEAFramework = lazy(() => import("./pages/IDEAFramework"));
const InvestorPresentation = lazy(() => import("./pages/InvestorPresentation"));
const MissionControl = lazy(() => import("./pages/MissionControl"));
const CommandTower = lazy(() => import("./pages/CommandTower"));
const WorkspaceHub = lazy(() => import("./pages/WorkspaceHub"));
const WorkspaceIdentify = lazy(() => import("./pages/WorkspaceIdentify"));
const WorkspaceDetect = lazy(() => import("./pages/WorkspaceDetect"));
const WorkspaceExecute = lazy(() => import("./pages/WorkspaceExecute"));
const WorkspaceAdvance = lazy(() => import("./pages/WorkspaceAdvance"));
const CustomerJourney = lazy(() => import("./pages/CustomerJourney"));
const OrganizationSetup = lazy(() => import("./pages/OrganizationSetup"));
const PlaybookCustomization = lazy(() => import("./pages/PlaybookCustomization"));
const PlaybookCustomize = lazy(() => import("./pages/PlaybookCustomize"));
const SuccessMetricsConfiguration = lazy(() => import("./pages/SuccessMetricsConfiguration"));
const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));
const NewUserJourney = lazy(() => import("./pages/NewUserJourney"));
const GuidedStart = lazy(() => import("./pages/GuidedStart"));
const PeerReview = lazy(() => import("./pages/PeerReview"));
const PeerReviewReport = lazy(() => import("./pages/PeerReviewReport"));
const CompetitivePositioning = lazy(() => import("./pages/CompetitivePositioning"));
const PilotProgram = lazy(() => import("./pages/PilotProgram"));
const PilotOnboarding = lazy(() => import("./pages/PilotOnboarding"));
const Growth = lazy(() => import("./pages/Growth"));
const VsConsulting = lazy(() => import("./pages/VsConsulting"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const DemoAccess = lazy(() => import("./pages/DemoAccess"));
const RequestAccess = lazy(() => import("./pages/RequestAccess"));
const TrialAccess = lazy(() => import("./pages/TrialAccess"));
const MagicLogin = lazy(() => import("./pages/MagicLogin"));
const AdminCustomerHealth = lazy(() => import("./pages/AdminCustomerHealth"));
const PilotHealthMonitor = lazy(() => import("./pages/PilotHealthMonitor"));
const ActivationOutcome = lazy(() => import("./pages/ActivationOutcome"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const FounderStory = lazy(() => import("./pages/FounderStory"));
const ExecuteIQVideo = lazy(() => import("./pages/ExecuteIQVideo"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
const AgilityAssessment = lazy(() => import("./pages/AgilityAssessment"));
const FutureReadinessDashboard = lazy(() => import("./pages/FutureReadinessDashboard"));
const BoardExport = lazy(() => import("./pages/BoardExport"));
const VideoLanding = lazy(() => import("./pages/VideoLanding"));
const PlaybookManagement = lazy(() => import("./pages/PlaybookManagement"));
const TaskManagement = lazy(() => import("./pages/TaskManagement"));
const StakeholderManagement = lazy(() => import("./pages/StakeholderManagement"));
const RoleExperience = lazy(() => import("./pages/RoleExperience"));
const IndustryExperience = lazy(() => import("./pages/IndustryExperience"));
const ROIDashboard = lazy(() => import("./pages/ROIDashboard"));
const SimulationStudioPage = lazy(() => import("./pages/SimulationStudio"));
const StrategicRecorder = lazy(() => import("./pages/StrategicRecorder"));
const DemoRouter = lazy(() => import("./pages/DemoRouter"));
const ComprehensiveAIIntelligence = lazy(() => import("./pages/ComprehensiveAIIntelligence"));
const LiveActivationCenter = lazy(() => import("./pages/LiveActivationCenter"));
const EnterpriseMetrics = lazy(() => import("./pages/EnterpriseMetrics"));
const UnifiedEnterprisePlatform = lazy(() => import("./pages/UnifiedEnterprisePlatform"));
const WelcomeBrief = lazy(() => import("./pages/WelcomeBrief"));
const BoardReadiness = lazy(() => import("./pages/BoardReadiness"));

const PlaybooksLibraryPage = lazy(() => import("./pages/identify/PlaybooksLibraryPage"));
const IdentifyTemplatesPage = lazy(() => import("./pages/identify/TemplatesPage"));
const MyPlaybooksPage = lazy(() => import("./pages/identify/MyPlaybooksPage"));
const IdentifyWizardPage = lazy(() => import("./pages/identify/WizardPage"));
const IdentifySLAPage = lazy(() => import("./pages/identify/SLAPage"));
const IdentifyMetricsPage = lazy(() => import("./pages/identify/MetricsPage"));
const SituationIntentsHub = lazy(() => import("./pages/SituationIntentsHub"));
const SituationIntentWizard = lazy(() => import("./pages/SituationIntentWizard"));

const DetectDashboardPage = lazy(() => import("./pages/detect/DashboardPage"));
const DetectAlertsPage = lazy(() => import("./pages/detect/AlertsPage"));
const DetectSignalsPage = lazy(() => import("./pages/detect/SignalsPage"));
const DetectThreatsPage = lazy(() => import("./pages/detect/ThreatsPage"));
const DetectTrendsPage = lazy(() => import("./pages/detect/TrendsPage"));
const DetectHistoryPage = lazy(() => import("./pages/detect/HistoryPage"));

const ExecuteWarRoomPage = lazy(() => import("./pages/execute/WarRoomPage"));
const ExecuteActivationPage = lazy(() => import("./pages/execute/ActivationPage"));
const ExecuteTasksPage = lazy(() => import("./pages/execute/TasksPage"));
const ExecuteTrackingPage = lazy(() => import("./pages/execute/TrackingPage"));
const ExecuteUpdatesPage = lazy(() => import("./pages/execute/UpdatesPage"));
const ExecuteDecisionsPage = lazy(() => import("./pages/execute/DecisionsPage"));

const AdvanceMetricsPage = lazy(() => import("./pages/advance/MetricsPage"));
const AdvanceOutcomesPage = lazy(() => import("./pages/advance/OutcomesPage"));
const AdvanceEffectivenessPage = lazy(() => import("./pages/advance/EffectivenessPage"));
const AdvanceTeamPage = lazy(() => import("./pages/advance/TeamPage"));
const AdvanceLessonsPage = lazy(() => import("./pages/advance/LessonsPage"));
const AdvanceAuditPage = lazy(() => import("./pages/advance/AuditPage"));

const SetupTeamPage = lazy(() => import("./pages/setup/TeamPage"));
const SetupIntegrationsPage = lazy(() => import("./pages/setup/IntegrationsPage"));
const SetupOrgPage = lazy(() => import("./pages/setup/OrgPage"));
const SetupAPIPage = lazy(() => import("./pages/setup/APIPage"));

const LearnQuickDemoPage = lazy(() => import("./pages/learn/QuickDemoPage"));
const LearnRoleDemoPage = lazy(() => import("./pages/learn/RoleDemoPage"));
const LearnDrillsPage = lazy(() => import("./pages/learn/DrillsPage"));
const LearnHelpPage = lazy(() => import("./pages/learn/HelpPage"));

import { DemoControllerProvider } from "./contexts/DemoController";
import { DemoTimelineProvider } from "./contexts/DemoTimelineContext";
import { DynamicStrategyProvider } from "./contexts/DynamicStrategyContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import OnboardingOverlay from "./components/onboarding/OnboardingOverlay";
import { ThemeProvider } from "./components/ThemeProvider";
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

import { useAuth } from "./hooks/useAuth";

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

const WELCOME_BRIEF_KEY = 'vm_welcome_brief_seen';
const WELCOME_BRIEF_BYPASS = ['/welcome-brief', '/onboarding', '/request-access', '/trial-access', '/auth', '/login', '/magic-login'];

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, needsOnboarding, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    // 1. Onboarding takes priority
    if (isAuthenticated && needsOnboarding && location !== "/onboarding" && !hasRedirected.current) {
      hasRedirected.current = true;
      setLocation("/onboarding");
      return;
    }
    if (location === "/onboarding") {
      hasRedirected.current = true;
      return;
    }

    // 2. Welcome Brief gate — show once to authenticated users landing on the platform
    if (
      isAuthenticated &&
      !needsOnboarding &&
      !hasRedirected.current &&
      !localStorage.getItem(WELCOME_BRIEF_KEY) &&
      !WELCOME_BRIEF_BYPASS.some(p => location.startsWith(p)) &&
      (location === '/mission-control' || location === '/command-tower' || location === '/dashboard' || location === '/')
    ) {
      hasRedirected.current = true;
      setLocation("/welcome-brief");
    }
  }, [isAuthenticated, needsOnboarding, isLoading, location, setLocation]);

  if (isLoading) return <PageLoader />;
  
  return <>{children}</>;
}

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation(to); }, [setLocation, to]);
  return null;
}

function renderRoutes(paths: string[], Component: any) {
  return paths.map(path => <Route key={path} path={path} component={Component} />);
}

function renderRedirects(paths: string[], to: string) {
  return paths.map(path => (
    <Route key={path} path={path}>{() => <Redirect to={to} />}</Route>
  ));
}

function Router() {
  return (
    <DemoTimelineProvider defaultDuration={720000} defaultSpeedMultiplier={20}>
      <DemoControllerProvider>
        <ScrollToTop />
        <OnboardingGuard>
          <Suspense fallback={<PageLoader />}>
            <Switch>
            <Route path="/" component={Homepage} />
            <Route path="/home" component={Homepage} />
            <Route path="/mission-control" component={MissionControl} />
            <Route path="/command-tower" component={CommandTower} />
            <Route path="/welcome-brief" component={WelcomeBrief} />
            <Route path="/board-readiness" component={BoardReadiness} />
            <Route path="/workspace" component={WorkspaceHub} />
            <Route path="/workspaces/identify">{() => <Redirect to="/workspace?tab=identify" />}</Route>
            <Route path="/workspaces/detect">{() => <Redirect to="/workspace?tab=detect" />}</Route>
            <Route path="/workspaces/execute">{() => <Redirect to="/workspace?tab=execute" />}</Route>
            <Route path="/workspaces/advance">{() => <Redirect to="/workspace?tab=advance" />}</Route>

        {/* IDENTIFY Phase */}
        <Route path="/identify/playbooks" component={PlaybooksLibraryPage} />
        <Route path="/identify/templates" component={IdentifyTemplatesPage} />
        <Route path="/identify/my-playbooks" component={MyPlaybooksPage} />
        <Route path="/identify/wizard" component={IdentifyWizardPage} />
        <Route path="/identify/sla" component={IdentifySLAPage} />
        <Route path="/identify/metrics" component={IdentifyMetricsPage} />
        <Route path="/identify/playbook-library" component={PlaybookLibraryV2} />
        <Route path="/identify/playbook-command/:id" component={PlaybookCommand} />
        <Route path="/identify/situation-intents" component={SituationIntentsHub} />
        <Route path="/identify/situation-intent/new" component={SituationIntentWizard} />

        {/* DETECT Phase */}
        <Route path="/detect/dashboard" component={DetectDashboardPage} />
        <Route path="/detect/alerts" component={DetectAlertsPage} />
        <Route path="/detect/signals" component={DetectSignalsPage} />
        <Route path="/detect/threats" component={DetectThreatsPage} />
        <Route path="/detect/trends" component={DetectTrendsPage} />
        <Route path="/detect/history" component={DetectHistoryPage} />

        {/* EXECUTE Phase */}
        <Route path="/execute/war-room" component={ExecuteWarRoomPage} />
        <Route path="/execute/activation" component={ExecuteActivationPage} />
        <Route path="/execute/tasks" component={ExecuteTasksPage} />
        <Route path="/execute/tracking" component={ExecuteTrackingPage} />
        <Route path="/execute/updates" component={ExecuteUpdatesPage} />
        <Route path="/execute/decisions" component={ExecuteDecisionsPage} />

        {/* ADVANCE Phase */}
        <Route path="/advance/metrics" component={AdvanceMetricsPage} />
        <Route path="/advance/outcomes" component={AdvanceOutcomesPage} />
        <Route path="/advance/effectiveness" component={AdvanceEffectivenessPage} />
        <Route path="/advance/team" component={AdvanceTeamPage} />
        <Route path="/advance/lessons" component={AdvanceLessonsPage} />
        <Route path="/advance/audit" component={AdvanceAuditPage} />

        {/* SETUP */}
        <Route path="/setup/team" component={SetupTeamPage} />
        <Route path="/setup/integrations" component={SetupIntegrationsPage} />
        <Route path="/setup/organization" component={SetupOrgPage} />
        <Route path="/setup/api" component={SetupAPIPage} />

        {/* LEARN */}
        <Route path="/learn/quick-demo" component={LearnQuickDemoPage} />
        <Route path="/learn/role-demo" component={LearnRoleDemoPage} />
        <Route path="/learn/drills" component={LearnDrillsPage} />
        <Route path="/learn/help" component={LearnHelpPage} />

        {/* Hub Pages */}
        <Route path="/executive-hub" component={ExecutiveHub} />
        <Route path="/intelligence-hub" component={IntelligenceHub} />
        <Route path="/settings-hub" component={SettingsHub} />
        <Route path="/situations-hub" component={SituationalHub} />
        {renderRedirects(["/crisis-hub"], "/situations-hub")}

        {/* Dashboards & Intelligence */}
        <Route path="/executive-dashboard" component={ExecutiveDashboard} />
        <Route path="/strategy-execution" component={StrategyExecutionDashboard} />
        <Route path="/business-intelligence" component={BusinessIntelligence} />
        <Route path="/intelligence" component={IntelligenceControlCenter} />
        <Route path="/intelligence-control-center" component={IntelligenceControlCenter} />
        <Route path="/ai-radar" component={AIRadarDashboard} />
        <Route path="/signal-intelligence" component={SignalIntelligenceHub} />
        {renderRoutes(["/live-detection", "/live-detection-feed"], LiveDetectionFeed)}
        {renderRoutes(["/ai", "/pulse", "/flux", "/prism", "/echo", "/nova"], AIIntelligenceHub)}
        <Route path="/pulse-intelligence" component={PulseIntelligence} />
        <Route path="/flux-adaptations" component={FluxAdaptations} />
        <Route path="/prism-insights" component={PrismInsights} />
        <Route path="/echo-cultural-analytics" component={EchoCulturalAnalytics} />
        <Route path="/workforce-intelligence" component={EchoCulturalAnalytics} />
        <Route path="/nova-innovations" component={NovaInnovations} />
        <Route path="/strategic-innovation" component={NovaInnovations} />
        {renderRoutes(["/mckinsey", "/mckinsey-intelligence"], McKinseyIntelligenceCenter)}

        {/* Strategic Operations */}
        <Route path="/strategic-monitoring" component={CrisisResponseCenter} />
        <Route path="/strategic-monitoring/:id" component={CrisisDetail} />
        <Route path="/command-center">{() => <Redirect to="/mission-control" />}</Route>
        <Route path="/command-center-dynamic">{() => <Redirect to="/mission-control" />}</Route>
        <Route path="/execution-history" component={ExecutionHistory} />
        <Route path="/collaboration" component={RealTimeCollaboration} />
        <Route path="/playbook-activation/:triggerId/:playbookId" component={PlaybookActivationConsole} />

        {/* Strategic Planning */}
        <Route path="/strategic" component={StrategicPlanningHub} />
        <Route path="/strategic-planning-hub" component={StrategicPlanningHub} />
        <Route path="/what-if-analyzer" component={WhatIfAnalyzer} />
        <Route path="/decision-velocity" component={DecisionVelocityPage} />
        <Route path="/decisions" component={DecisionVelocityDashboard} />
        <Route path="/decision-trees" component={DecisionTreeBuilder} />
        <Route path="/execution-coordination" component={ExecutionCoordination} />
        <Route path="/institutional-memory" component={InstitutionalMemory} />
        <Route path="/board-briefings" component={BoardBriefings} />
        <Route path="/operating-model" component={OperatingModelAlignment} />
        <Route path="/roi-breakdown" component={ComprehensiveROIBreakdown} />
        <Route path="/calculator" component={ComprehensiveROIBreakdown} />

        {/* Marketing & Company Pages */}
        <Route path="/our-story" component={OurStory} />
        <Route path="/founder-story" component={FounderStory} />
        <Route path="/execution-os-video" component={ExecuteIQVideo} />
        <Route path="/why-execution-os-legacy" component={WhyExecuteIQ} />
        <Route path="/research" component={Research} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/idea-framework" component={IDEAFramework} />
        <Route path="/pricing" component={Pricing} />
        {renderRoutes(["/investors", "/for-investors"], Investors)}
        <Route path="/competitive-positioning" component={CompetitivePositioning} />
        <Route path="/pilot-program" component={PilotProgram} />
        <Route path="/pilot-onboarding" component={PilotOnboarding} />
        <Route path="/growth" component={Growth} />
        <Route path="/vs-consulting" component={VsConsulting} />
        <Route path="/explore" component={ExplorePage} />
        {renderRoutes(["/contact", "/early-access"], Contact)}

        {/* Playbooks & Triggers */}
        <Route path="/triggers-management" component={TriggersManagement} />
        <Route path="/signal-configuration" component={SignalConfiguration} />
        <Route path="/organization-setup" component={OrganizationSetup} />
        <Route path="/playbook-customization" component={PlaybookCustomization} />
        <Route path="/success-metrics" component={SuccessMetricsConfiguration} />
        <Route path="/get-started" component={GetStarted} />
        <Route path="/demo-access" component={DemoAccess} />
        <Route path="/request-access" component={RequestAccess} />
        <Route path="/trial-access" component={TrialAccess} />
        <Route path="/magic-login" component={MagicLogin} />
        <Route path="/peer-review" component={PeerReview} />
        <Route path="/peer-review-report" component={PeerReviewReport} />
        {renderRoutes(["/onboarding", "/setup"], OnboardingWizard)}
        {renderRoutes(["/new-user-journey", "/welcome", "/journey", "/experience"], NewUserJourney)}
        <Route path="/begin" component={GuidedStart} />
        <Route path="/start" component={GuidedStart} />
        <Route path="/preparedness-report" component={PreparednessReport} />
        <Route path="/drill-tracking" component={DrillTrackingSystem} />
        {renderRoutes(["/playbook-library", "/playbooks", "/business-scenarios"], PlaybookLibraryV2)}
        <Route path="/playbooks/:id/customize" component={PlaybookCustomize} />
        <Route path="/playbooks/:id/preview" component={PlaybookDetail} />
        <Route path="/playbooks/:id/edit" component={PlaybookCustomize} />
        <Route path="/playbooks/create" component={PlaybookCustomize} />
        <Route path="/playbook-management" component={PlaybookManagement} />
        {renderRoutes(["/playbook-customize/new", "/playbook-customize/:id"], PlaybookCustomize)}
        <Route path="/task-management" component={TaskManagement} />
        {renderRoutes(["/stakeholder-management", "/stakeholders"], StakeholderManagement)}
        <Route path="/playbook-library/:id" component={PlaybookDetail} />
        <Route path="/business-scenario/:id" component={PlaybookDetail} />
        <Route path="/playbook-library/:id/settings" component={PlaybookSettings} />
        <Route path="/playbook-command/:id" component={PlaybookCommand} />
        <Route path="/practice-drills/:drillId/live" component={LiveDrillExecution} />
        <Route path="/practice-drills" component={PracticeDrills} />
        <Route path="/crisis-exposure-matrix" component={CrisisExposureMatrix} />
        <Route path="/crisis-communications" component={CrisisCommunicationsGenerator} />
        <Route path="/financial-exposure" component={FinancialExposureEstimator} />
        <Route path="/concurrent-situations" component={ConcurrentSituationBoard} />
        <Route path="/simulation-studio" component={SimulationStudioPage} />
        <Route path="/roi-dashboard" component={ROIDashboard} />
        <Route path="/coordination-intelligence" component={lazy(() => import('./pages/CoordinationIntelligence'))} />
        <Route path="/strategic-recorder" component={StrategicRecorder} />
        <Route path="/execution-learning" component={ExecutionLearningDashboard} />
        {renderRoutes(["/playbook-readiness", "/playbook-audit"], PlaybookReadinessAudit)}
        <Route path="/future-gym" component={FutureGym} />
        <Route path="/foresight-radar" component={ForesightRadar} />
        <Route path="/living-playbooks" component={LivingPlaybooks} />
        <Route path="/continuous-mode" component={ContinuousModePage} />

        {/* Analytics */}
        <Route path="/analytics" component={AdvancedAnalytics} />
        <Route path="/advanced-analytics" component={AdvancedAnalytics} />
        <Route path="/executive-analytics-dashboard" component={ExecutiveAnalyticsDashboard} />
        {renderRoutes(["/executive-summary", "/executive-summary-generator", "/report-generator"], ExecutiveSummaryGenerator)}
        <Route path="/audit-logging-center" component={AuditLoggingCenter} />
        <Route path="/roi-calculator" component={ROICalculator} />
        <Route path="/agility-assessment" component={AgilityAssessment} />
        <Route path="/future-readiness" component={FutureReadinessDashboard} />
        <Route path="/readiness" component={FutureReadinessDashboard} />

        {/* Demo & Sales Tools */}
        {renderRoutes([
          "/live-demo", "/try-demo", "/try-it", "/demo", "/demo-hub",
          "/demo-selector", "/demo/selector", "/transformational-demo",
          "/four-phase-demo", "/4-phase-demo", "/demos",
          "/intelligence-demo", "/signals-demo", "/watch-demo",
          "/executive-demo", "/hybrid-demo", "/executive-demo-walkthrough"
        ], TryDemo)}
        <Route path="/board-export" component={BoardExport} />
        {renderRedirects(["/sandbox-demo", "/sandbox", "/pilot-demo"], "/try-demo")}
        <Route path="/12-minute-experience" component={TwelveMinuteTestDrive} />
        <Route path="/test-drive" component={TwelveMinuteTestDrive} />
        <Route path="/incident-analyzer" component={IncidentAnalyzer} />
        <Route path="/readiness-assessment" component={ReadinessAssessment} />
        {renderRoutes(["/video", "/cinematic", "/sizzle", "/2-minute", "/spots", "/30-second", "/brand-films"], VideoLanding)}

        {/* Integration Hub */}
        <Route path="/integration-hub" component={IntegrationHub} />
        {renderRoutes(["/integrations", "/integration-connections"], IntegrationConnections)}
        <Route path="/integrations-legacy" component={IntegrationsPage} />

        {/* Live Activation & Interactive Demos */}
        {renderRedirects(["/activation", "/demo/activation"], "/try-demo")}
        {renderRoutes(["/role-selector", "/demo/role-selector"], RoleSelector)}
        {renderRedirects([
          "/demo/live-activation", "/demo/ransomware", "/demo/ma-integration",
          "/demo/product-launch", "/demo/supplier-crisis", "/demo/competitive-response",
          "/demo/regulatory-crisis", "/demo/customer-crisis"
        ], "/try-demo")}

        {/* Approval Pages */}
        <Route path="/approval-success" component={lazy(() => import('./pages/ApprovalSuccess'))} />
        <Route path="/approval-error" component={lazy(() => import('./pages/ApprovalError'))} />
        <Route path="/ecosystems" component={lazy(() => import('./pages/ecosystems/EcosystemsHub'))} />
        <Route path="/ecosystem/google" component={lazy(() => import('./pages/ecosystems/GoogleEcosystem'))} />
        <Route path="/ecosystem/salesforce" component={lazy(() => import('./pages/ecosystems/SalesforceEcosystem'))} />
        <Route path="/ecosystem/aws" component={lazy(() => import('./pages/ecosystems/AWSEcosystem'))} />
        <Route path="/ecosystem/sap" component={lazy(() => import('./pages/ecosystems/SAPEcosystem'))} />
        <Route path="/ecosystem/servicenow" component={lazy(() => import('./pages/ecosystems/ServiceNowEcosystem'))} />
        <Route path="/ecosystem/workday" component={lazy(() => import('./pages/ecosystems/WorkdayEcosystem'))} />
        <Route path="/ecosystem" component={lazy(() => import('./pages/EcosystemDiagramPage'))} />

        {/* Additional Pages */}
        <Route path="/demo-router" component={DemoRouter} />
        <Route path="/marketing-landing">{() => { window.location.replace('/'); return null; }}</Route>
        <Route path="/one-click-demo">{() => { window.location.replace('/try-demo'); return null; }}</Route>
        <Route path="/ai-intelligence-suite" component={ComprehensiveAIIntelligence} />
        <Route path="/ai-intelligence">{() => <Redirect to="/ai-intelligence-suite" />}</Route>
        <Route path="/live-activation-center" component={LiveActivationCenter} />
        <Route path="/live-activation">{() => <Redirect to="/live-activation-center" />}</Route>
        <Route path="/enterprise-metrics" component={EnterpriseMetrics} />
        <Route path="/unified-platform" component={UnifiedEnterprisePlatform} />

        {/* Industry Demos */}
        {renderRoutes(["/industry-demos", "/crisis-demos"], IndustryDemosHub)}
        {renderRoutes(["/luxury-demo", "/luxury-crisis-demo"], LuxuryCrisisDemo)}
        <Route path="/financial-demo" component={FinancialRansomwareDemo} />
        <Route path="/pharma-demo" component={PharmaceuticalRecallDemo} />
        <Route path="/manufacturing-demo" component={ManufacturingSupplierDemo} />
        <Route path="/retail-demo" component={RetailFoodSafetyDemo} />
        <Route path="/energy-demo" component={EnergyGridFailureDemo} />
        <Route path="/lvmh-demo" component={LVMHMarketEntryDemo} />
        <Route path="/shein-demo" component={SHEINTrendDemo} />
        <Route path="/spacex-demo" component={SpaceXLaunchDemo} />
        {renderRedirects(["/executive-simulation", "/simulation-demo"], "/try-demo")}
        <Route path="/platform-overview" component={PlatformOverview} />
        {renderRedirects(["/product-tour", "/video-tour"], "/try-demo")}
        {renderRoutes(["/investor-presentation", "/pitch-deck"], InvestorPresentation)}
        {renderRedirects(["/investor-demo", "/customer-demo", "/deal-risk-demo"], "/try-demo")}
        <Route path="/investor-resources" component={InvestorResources} />
        {renderRoutes(["/roadshow-resources", "/roadshow"], RoadshowResources)}
        {renderRedirects(["/demo-gallery", "/keynote", "/trade-show-demo"], "/try-demo")}

        {/* Customer Experience */}
        {renderRoutes(["/north-star", "/customer-journey"], CustomerJourney)}
        <Route path="/experience/:roleId" component={RoleExperience} />
        <Route path="/industry-experience/:industryId" component={IndustryExperience} />

        {/* Settings & Administration */}
        <Route path="/vc-presentations" component={VCPresentations} />
        <Route path="/settings" component={Settings} />
        <Route path="/uat-admin" component={UATAdmin} />
        <Route path="/pilot-monitoring" component={PilotMonitoring} />
        <Route path="/admin/customer-health" component={AdminCustomerHealth} />
        <Route path="/admin/pilot-health" component={PilotHealthMonitor} />
        <Route path="/activation-outcome/:activationId" component={ActivationOutcome} />
        <Route path="/sitemap" component={Sitemap} />
        <Route path="/comprehensive-homepage" component={ExecutiveScorecard} />

        {/* Legacy Redirects */}
        {renderRedirects([
          "/scorecard", "/executive-scorecard", "/executive-suite",
          "/dashboard", "/platform", "/operating-model-health"
        ], "/mission-control")}
        {renderRedirects(["/command-center", "/command-center-dynamic", "/war-room"], "/mission-control")}
        {renderRedirects([
          "/scenarios", "/scenario-library", "/scenario-gallery",
          "/comprehensive-scenarios", "/templates"
        ], "/playbooks")}
        {renderRedirects(["/triggers", "/trigger-dashboard"], "/triggers-management")}
        {renderRedirects(["/interactive-demo", "/interactive-master-demo"], "/how-it-works")}
        {renderRoutes(["/investor-landing", "/executive-access"], InvestorLanding)}
        <Route path="/executive-brief" component={ExecutiveBrief} />
        <Route path="/why-execution-os" component={WhyExecutionOS} />
        {renderRedirects(["/scenario-demo", "/ultimate-demo"], "/try-demo")}
        <Route path="/landing">{() => <Redirect to="/" />}</Route>
        <Route path="/login">{() => <Redirect to="/" />}</Route>
        <Route path="/crisis" component={CrisisResponseCenter} />
        <Route path="/crisis-response-center" component={CrisisResponseCenter} />

        <Route component={NotFound} />
        </Switch>
        </Suspense>
        </OnboardingGuard>
      </DemoControllerProvider>
    </DemoTimelineProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <CustomerProvider>
          <DynamicStrategyProvider>
            <OnboardingProvider>
              <ThemeProvider>
                <TooltipProvider>
                  <Toaster />
                  <OnboardingOverlay />
                  <ErrorBoundary>
                    <Router />
                  </ErrorBoundary>
                </TooltipProvider>
              </ThemeProvider>
            </OnboardingProvider>
          </DynamicStrategyProvider>
        </CustomerProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
