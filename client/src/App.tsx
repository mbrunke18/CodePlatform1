import { useEffect, useRef, lazy, Suspense, Component, ReactNode } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, RefreshCw, Home } from "lucide-react";
import RoleIndustryCaptureModal from "@/components/RoleIndustryCaptureModal";
import QuickActions from "@/components/QuickActions";
import EvalBanner from "@/components/EvalBanner";
import BoardReviewPanel from "@/components/BoardReviewPanel";

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
            <div style={{ marginBottom: '1.25rem' }}>
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
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#9CA3AF' }}>VaughnMartin Readiness OS · Error Recovery</p>
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
const SituationScanner = lazy(() => import("./pages/SituationScanner"));
const IncidentAnalyzer = lazy(() => import("./pages/IncidentAnalyzer"));
const ReadinessAssessment = lazy(() => import("./pages/ReadinessAssessment"));
const WhatIfAnalyzer = lazy(() => import("./pages/WhatIfAnalyzer"));
const ProtocolLibrary = lazy(() => import("./pages/ProtocolLibrary"));
const ProtocolDetail = lazy(() => import("./pages/ProtocolDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Investors = lazy(() => import("./pages/Investors"));
const InvestorLanding = lazy(() => import("./pages/InvestorLanding"));
const ExecutiveBrief = lazy(() => import("./pages/ExecutiveBrief"));
const ProductOverview = lazy(() => import("./pages/ProductOverview"));
const AuthorizationPrecedentRegistry = lazy(() => import("./pages/AuthorizationPrecedentRegistry"));
const MobilizationBrief = lazy(() => import("./pages/MobilizationBrief"));
const ExecutiveScenarioSuite = lazy(() => import("./pages/ExecutiveScenarioSuite"));
const ProspectBrief = lazy(() => import("./pages/ProspectBrief"));
const ProspectDemo = lazy(() => import("./pages/ProspectDemo"));
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
const ProtocolActivationConsole = lazy(() => import("./pages/ProtocolActivationConsole"));
const PreparednessReport = lazy(() => import("./pages/PreparednessReport"));
const ProtocolCommand = lazy(() => import("./pages/ProtocolCommand"));
const ProtocolSettings = lazy(() => import("./pages/ProtocolSettings"));
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
const SignalConnectors = lazy(() => import("./pages/SignalConnectors"));
const ActivationIntelligencePage = lazy(() => import("./pages/ActivationIntelligencePage"));
const ProtocolHealthDashboard = lazy(() => import("./pages/ProtocolHealthDashboard"));
const LiveDetectionFeed = lazy(() => import("./pages/LiveDetectionFeed"));
const InstitutionalMemory = lazy(() => import("./pages/InstitutionalMemory"));
const SignalAccountability = lazy(() => import("./pages/SignalAccountability"));
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
const ResearchFoundation = lazy(() => import("./pages/ResearchFoundation"));
const OrganizationalIntelligence = lazy(() => import("./pages/OrganizationalIntelligence"));
const DecisionHolding = lazy(() => import("./pages/DecisionHolding"));
const FoundingPartnerMonitoring = lazy(() => import("./pages/FoundingPartnerMonitoring"));
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
const ReadinessOracle = lazy(() => import("./pages/ReadinessOracle"));
const ReadinessBenchmark = lazy(() => import("./pages/ReadinessBenchmark"));
const LivingProtocols = lazy(() => import("./pages/LivingProtocols"));
const ContinuousModePage = lazy(() => import("./pages/ContinuousModePage"));
const ProtocolReadinessAudit = lazy(() => import("./pages/ProtocolReadinessAudit"));
const PlatformOverview = lazy(() => import("./pages/PlatformOverview"));
const PlatformCapabilities = lazy(() => import("./pages/PlatformCapabilities"));
const IDEAFramework = lazy(() => import("./pages/IDEAFramework"));
const InvestorPresentation = lazy(() => import("./pages/InvestorPresentation"));
const PodcastPrep = lazy(() => import("./pages/PodcastPrep"));
const MissionControl = lazy(() => import("./pages/MissionControl"));
const CommandTower = lazy(() => import("./pages/CommandTower"));
const WorkspaceHub = lazy(() => import("./pages/WorkspaceHub"));
const WorkspaceIdentify = lazy(() => import("./pages/WorkspaceIdentify"));
const WorkspaceDetect = lazy(() => import("./pages/WorkspaceDetect"));
const WorkspaceExecute = lazy(() => import("./pages/WorkspaceExecute"));
const WorkspaceAdvance = lazy(() => import("./pages/WorkspaceAdvance"));
const CustomerJourney = lazy(() => import("./pages/CustomerJourney"));
const OrganizationSetup = lazy(() => import("./pages/OrganizationSetup"));
const ProtocolCustomization = lazy(() => import("./pages/ProtocolCustomization"));
const ProtocolCustomize = lazy(() => import("./pages/ProtocolCustomize"));
const SuccessMetricsConfiguration = lazy(() => import("./pages/SuccessMetricsConfiguration"));
const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));
const GettingStarted = lazy(() => import("./pages/GettingStarted"));
const PMOOnboarding = lazy(() => import("./pages/PMOOnboarding"));
const NewUserJourney = lazy(() => import("./pages/NewUserJourney"));
const GuidedStart = lazy(() => import("./pages/GuidedStart"));
const InteractiveOnboarding = lazy(() => import("./pages/InteractiveOnboarding"));
const PeerReview = lazy(() => import("./pages/PeerReview"));
const PeerReviewReport = lazy(() => import("./pages/PeerReviewReport"));
const CompetitivePositioning = lazy(() => import("./pages/CompetitivePositioning"));
const FoundingPartnerProgram = lazy(() => import("./pages/FoundingPartnerProgram"));
const FoundingPartnerPage = lazy(() => import("./pages/FoundingPartnerPage"));
const FoundingPartnerBrief = lazy(() => import("./pages/FoundingPartnerBrief"));
const ReadinessRhythm = lazy(() => import("./pages/ReadinessRhythm"));
const StartHere = lazy(() => import("./pages/StartHere"));
const CostOfInaction = lazy(() => import("./pages/CostOfInaction"));
const FirstNinetyDays = lazy(() => import("./pages/FirstNinetyDays"));
const BoardMemo = lazy(() => import("./pages/BoardMemo"));
const DesignLogic = lazy(() => import("./pages/DesignLogic"));
const BuyerDecisionPacket = lazy(() => import("./pages/BuyerDecisionPacket"));
const FoundingPartnerOnboarding = lazy(() => import("./pages/FoundingPartnerOnboarding"));
const ProtocolBuilder = lazy(() => import("./pages/ProtocolBuilder"));
const ProtocolsHub = lazy(() => import("./pages/ProtocolsHub"));
const CompoundProtocolBuilder = lazy(() => import("./pages/CompoundProtocolBuilder"));
const ProtocolSituationMatrixBuilder = lazy(() => import("./pages/ProtocolSituationMatrixBuilder"));
const BuildProtocolRouter = lazy(() => import("./pages/BuildProtocolRouter"));
const PreparationArc = lazy(() => import("./pages/PreparationArc"));
const TheCase = lazy(() => import("./pages/TheCase"));
const Growth = lazy(() => import("./pages/Growth"));
const VsConsulting = lazy(() => import("./pages/VsConsulting"));
const VsBCP = lazy(() => import("./pages/VsBCP"));
const MsProjectTransition = lazy(() => import("./pages/MsProjectTransition"));
const PlatformReality = lazy(() => import("./pages/PlatformReality"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const DemoAccess = lazy(() => import("./pages/DemoAccess"));
const RequestAccess = lazy(() => import("./pages/RequestAccess"));
const TrialAccess = lazy(() => import("./pages/TrialAccess"));
const MagicLogin = lazy(() => import("./pages/MagicLogin"));
const AdminCustomerHealth = lazy(() => import("./pages/AdminCustomerHealth"));
const AdminQuickLink = lazy(() => import("./pages/AdminQuickLink"));
const AdminProspectBriefs = lazy(() => import("./pages/AdminProspectBriefs"));
const AdminLinkedInPosts = lazy(() => import("./pages/AdminLinkedInPosts"));
const FoundingPartnerHealthMonitor = lazy(() => import("./pages/FoundingPartnerHealthMonitor"));
const ActivationOutcome = lazy(() => import("./pages/ActivationOutcome"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const FounderStory = lazy(() => import("./pages/FounderStory"));
const About = lazy(() => import("./pages/About"));
const Team = lazy(() => import("./pages/Team"));
const ExecuteIQVideo = lazy(() => import("./pages/ExecuteIQVideo"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
const HowItExecutes = lazy(() => import("./pages/HowItExecutes"));
const ProofStory = lazy(() => import("./pages/ProofStory"));
const SectorBriefing = lazy(() => import("./pages/SectorBriefing"));
const CostOfDelay = lazy(() => import("./pages/CostOfDelay"));
const BrunkeSistersCaseStudy = lazy(() => import("./pages/BrunkeSistersCaseStudy"));
const UserGuide = lazy(() => import("./pages/UserGuide"));
const MobilizationTax = lazy(() => import("./pages/MobilizationTax"));
const AgilityAssessment = lazy(() => import("./pages/AgilityAssessment"));
const FutureReadinessDashboard = lazy(() => import("./pages/FutureReadinessDashboard"));
const BoardExport = lazy(() => import("./pages/BoardExport"));
const VideoLanding = lazy(() => import("./pages/VideoLanding"));
const ProtocolManagement = lazy(() => import("./pages/ProtocolManagement"));
const TaskManagement = lazy(() => import("./pages/TaskManagement"));
const StakeholderManagement = lazy(() => import("./pages/StakeholderManagement"));
const RoleExperience = lazy(() => import("./pages/RoleExperience"));
const IndustryExperience = lazy(() => import("./pages/IndustryExperience"));
const IndustryPacksHub = lazy(() => import("./pages/IndustryPacksHub"));
const IndustryPackDetail = lazy(() => import("./pages/IndustryPackDetail"));
const IndustryDemoLibrary = lazy(() => import("./pages/IndustryDemoLibrary"));
const IndustryDemoDetail = lazy(() => import("./pages/IndustryDemoDetail"));
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
const RegulatoryCalendar = lazy(() => import("./pages/RegulatoryCalendar"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const OnboardingGuide = lazy(() => import("./pages/OnboardingGuide"));
const BrandKit = lazy(() => import("./pages/BrandKit"));
const PlanningGap = lazy(() => import("./pages/PlanningGap"));
const InternalCase = lazy(() => import("./pages/InternalCase"));
const DeviationMetric = lazy(() => import("./pages/DeviationMetric"));
const AuthorizationRecord = lazy(() => import("./pages/AuthorizationRecord"));

const ProtocolsLibraryPage = lazy(() => import("./pages/identify/ProtocolsLibraryPage"));
const IdentifyTemplatesPage = lazy(() => import("./pages/identify/TemplatesPage"));
const MyProtocolsPage = lazy(() => import("./pages/identify/MyProtocolsPage"));
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

const AdvanceIntelligence = lazy(() => import("./pages/AdvanceIntelligence"));
const PredictiveSignalIntelligence = lazy(() => import("./pages/PredictiveSignalIntelligence"));
const OrganizationalTendencyIntelligence = lazy(() => import("./pages/OrganizationalTendencyIntelligence"));
const SectorIntelligenceLibrary = lazy(() => import("./pages/SectorIntelligenceLibrary"));
const MicrosoftConnectors = lazy(() => import("./pages/MicrosoftConnectors"));
const CertificationProgram = lazy(() => import("./pages/CertificationProgram"));
const BoardReview = lazy(() => import("./pages/BoardReview"));
const BoardAdmin = lazy(() => import("./pages/BoardAdmin"));
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

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  return <>{children}</>;
}

const WELCOME_SEEN_KEY = 'vm_welcome_brief_seen';
const PUBLIC_PATH_PREFIXES = [
  '/welcome-brief', '/home', '/demo', '/master-demo', '/the-proof',
  '/how-it-works', '/how-it-executes', '/readiness-infrastructure', '/platform-overview',
  '/12-minute-experience', '/roi-calculator', '/cost-of-delay', '/sector-briefing',
  '/executive-brief', '/founding-partner', '/contact', '/request-access',
  '/trial-access', '/demo-access', '/proof-story', '/research', '/vs-',
  '/ms-project', '/platform-reality', '/investor', '/pitch-deck', '/capabilities',
  '/founder-story', '/about', '/team', '/roadmap', '/entry', '/new-user-journey',
  '/readiness-benchmark', '/mobilization-tax', '/pricing', '/growth', '/industry',
  '/sitemap', '/user-guide', '/access-denied', '/situation-scanner', '/getting-started',
  '/readiness-rhythm', '/onboarding-guide', '/ecosystems', '/idea-framework',
  '/protocol-browser', '/industry-demo-library', '/security-compliance',
  '/planning-gap', '/making-the-case',
];

function WelcomeBriefRedirect() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(WELCOME_SEEN_KEY)) return;
    const isPublic = location === '/' || PUBLIC_PATH_PREFIXES.some(prefix => location.startsWith(prefix));
    if (!isPublic) {
      setLocation('/welcome-brief');
    }
  }, [isAuthenticated, isLoading, location, setLocation]);
  return null;
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

function CanonicalUpdater() {
  const [location] = useLocation();
  useEffect(() => {
    const base = "https://vaughnmartin.com";
    const canonical = location === "/" || location === "" ? base + "/" : base + location.split("?")[0];
    const link = document.getElementById("canonical-url") as HTMLLinkElement | null;
    if (link) link.href = canonical;
  }, [location]);
  return null;
}

function Router() {
  return (
    <DemoTimelineProvider defaultDuration={720000} defaultSpeedMultiplier={20}>
      <DemoControllerProvider>
        <ScrollToTop />
        <CanonicalUpdater />
        <OnboardingGuard>
          <WelcomeBriefRedirect />
          <Suspense fallback={<PageLoader />}>
            <Switch>
            <Route path="/" component={Homepage} />
            <Route path="/home" component={Homepage} />
            <Route path="/mission-control" component={MissionControl} />
            <Route path="/command-tower" component={CommandTower} />
            <Route path="/welcome-brief" component={WelcomeBrief} />
            <Route path="/board-readiness" component={BoardReadiness} />
            <Route path="/regulatory-calendar" component={RegulatoryCalendar} />
            <Route path="/roadmap" component={Roadmap} />
            <Route path="/onboarding-guide" component={OnboardingGuide} />
            <Route path="/workspace" component={WorkspaceHub} />
            <Route path="/workspaces/identify">{() => <Redirect to="/workspace?tab=identify" />}</Route>
            <Route path="/workspaces/detect">{() => <Redirect to="/workspace?tab=detect" />}</Route>
            <Route path="/workspaces/execute">{() => <Redirect to="/workspace?tab=execute" />}</Route>
            <Route path="/workspaces/advance">{() => <Redirect to="/workspace?tab=advance" />}</Route>

        {/* IDENTIFY Phase */}
        <Route path="/identify/playbooks" component={ProtocolsLibraryPage} />
        <Route path="/identify/templates" component={IdentifyTemplatesPage} />
        <Route path="/identify/my-playbooks" component={MyProtocolsPage} />
        <Route path="/identify/wizard" component={IdentifyWizardPage} />
        <Route path="/identify/sla" component={IdentifySLAPage} />
        <Route path="/identify/metrics" component={IdentifyMetricsPage} />
        <Route path="/identify/playbook-library">{() => <ProtocolLibrary />}</Route>
        <Route path="/identify/playbook-command/:id" component={ProtocolCommand} />
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

        {/* Board Priorities */}
        <Route path="/microsoft-connectors" component={MicrosoftConnectors} />
        <Route path="/certification" component={CertificationProgram} />

        {/* Board Review System */}
        <Route path="/board-review" component={BoardReview} />
        <Route path="/board-admin" component={BoardAdmin} />

        {/* Intelligence Engine — Predictive, Tendency, Sector */}
        <Route path="/predictive-intelligence" component={PredictiveSignalIntelligence} />
        <Route path="/tendency-intelligence" component={OrganizationalTendencyIntelligence} />
        <Route path="/sector-intelligence" component={SectorIntelligenceLibrary} />

        {/* ADVANCE Phase */}
        <Route path="/advance-intelligence" component={AdvanceIntelligence} />
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
        <Route path="/ai-radar">{() => <AIRadarDashboard />}</Route>
        <Route path="/signal-intelligence" component={SignalIntelligenceHub} />
        <Route path="/signal-connectors" component={SignalConnectors} />
        <Route path="/activation-intelligence" component={ActivationIntelligencePage} />
        <Route path="/protocol-health" component={ProtocolHealthDashboard} />
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
        <Route path="/collaboration">{() => <RealTimeCollaboration />}</Route>
        <Route path="/playbook-activation/:triggerId/:playbookId" component={ProtocolActivationConsole} />

        {/* Strategic Planning */}
        <Route path="/strategic" component={StrategicPlanningHub} />
        <Route path="/strategic-planning-hub" component={StrategicPlanningHub} />
        <Route path="/what-if-analyzer" component={WhatIfAnalyzer} />
        <Route path="/decision-velocity">{() => <DecisionVelocityPage />}</Route>
        <Route path="/decisions">{() => <DecisionVelocityDashboard />}</Route>
        <Route path="/decision-trees" component={DecisionTreeBuilder} />
        <Route path="/execution-coordination">{() => <ExecutionCoordination />}</Route>
        <Route path="/institutional-memory">{() => <InstitutionalMemory />}</Route>
        <Route path="/signal-accountability" component={SignalAccountability} />
        <Route path="/board-briefings">{() => <BoardBriefings />}</Route>
        <Route path="/operating-model">{() => <OperatingModelAlignment />}</Route>
        <Route path="/roi-breakdown">{() => <ComprehensiveROIBreakdown />}</Route>
        <Route path="/calculator">{() => <ComprehensiveROIBreakdown />}</Route>

        {/* Marketing & Company Pages */}
        <Route path="/our-story" component={OurStory} />
        <Route path="/about" component={About} />
        <Route path="/founder-story" component={FounderStory} />
        <Route path="/team" component={Team} />
        {renderRoutes(["/execution-os-video", "/readiness-video", "/platform-video"], ExecuteIQVideo)}
        <Route path="/why-execution-os-legacy" component={WhyExecuteIQ} />
        <Route path="/research" component={Research} />
        <Route path="/research-foundation" component={ResearchFoundation} />
        <Route path="/organizational-intelligence" component={OrganizationalIntelligence} />
        <Route path="/decision-holding" component={DecisionHolding} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/idea-framework" component={IDEAFramework} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/sector-briefing" component={SectorBriefing} />
        <Route path="/cost-of-delay" component={CostOfDelay} />
        <Route path="/terms" component={TermsOfService} />
        {renderRoutes(["/investors", "/for-investors"], Investors)}
        <Route path="/competitive-positioning" component={CompetitivePositioning} />
        {renderRoutes(["/pilot-program", "/founding-partner-program"], FoundingPartnerProgram)}
        <Route path="/brand-kit" component={BrandKit} />
        <Route path="/prospect-brief" component={ProspectBrief} />
        <Route path="/prospect-demo" component={ProspectDemo} />
        {renderRoutes(["/pilot-onboarding", "/founding-partner-onboarding"], FoundingPartnerOnboarding)}
        <Route path="/growth" component={Growth} />
        <Route path="/vs-consulting" component={VsConsulting} />
        <Route path="/vs-bcp" component={VsBCP} />
        {renderRoutes(["/ms-project", "/ms-project-transition", "/vs-servicenow", "/migration"], MsProjectTransition)}
        {renderRoutes(["/platform-reality", "/vs-theory", "/the-execution-gap", "/thought-leadership-trap"], PlatformReality)}
        <Route path="/planning-gap" component={PlanningGap} />
        <Route path="/making-the-case" component={InternalCase} />
        <Route path="/deviation-metric" component={DeviationMetric} />
        <Route path="/authorization-record" component={AuthorizationRecord} />
        <Route path="/explore" component={ExplorePage} />
        {renderRoutes(["/contact", "/early-access"], Contact)}

        {/* Playbooks & Triggers */}
        <Route path="/triggers-management">{() => <TriggersManagement />}</Route>
        <Route path="/signal-configuration" component={SignalConfiguration} />
        <Route path="/organization-setup">{() => <OrganizationSetup />}</Route>
        <Route path="/playbook-customization">{() => <ProtocolCustomization />}</Route>
        <Route path="/success-metrics">{() => <SuccessMetricsConfiguration />}</Route>
        <Route path="/get-started">{() => <GetStarted />}</Route>
        <Route path="/demo-access" component={DemoAccess} />
        <Route path="/request-access" component={RequestAccess} />
        <Route path="/trial-access" component={TrialAccess} />
        <Route path="/magic-login" component={MagicLogin} />
        <Route path="/peer-review" component={PeerReview} />
        <Route path="/peer-review-report" component={PeerReviewReport} />
        {renderRoutes(["/onboarding", "/setup", "/onboarding-wizard"], OnboardingWizard)}
        <Route path="/getting-started" component={GettingStarted} />
        <Route path="/pmo-onboarding" component={PMOOnboarding} />
        <Route path="/user-guide" component={UserGuide} />
        <Route path="/mobilization-tax" component={MobilizationTax} />
        {renderRoutes(["/new-user-journey", "/welcome", "/journey", "/experience"], NewUserJourney)}
        <Route path="/begin" component={GuidedStart} />
        <Route path="/start" component={GuidedStart} />
        <Route path="/onboard" component={InteractiveOnboarding} />
        <Route path="/preparedness-report">{() => <PreparednessReport />}</Route>
        <Route path="/drill-tracking" component={DrillTrackingSystem} />
        {renderRoutes(["/protocols", "/playbook-library", "/playbooks", "/business-scenarios"], ProtocolLibrary)}
        <Route path="/playbooks/:id/customize" component={ProtocolCustomize} />
        <Route path="/playbooks/:id/preview" component={ProtocolDetail} />
        <Route path="/playbooks/:id/edit" component={ProtocolCustomize} />
        <Route path="/playbooks/create" component={ProtocolCustomize} />
        <Route path="/playbook-management" component={ProtocolManagement} />
        {renderRoutes(["/playbook-customize/new", "/playbook-customize/:id"], ProtocolCustomize)}
        <Route path="/task-management">{() => <TaskManagement />}</Route>
        {renderRoutes(["/stakeholder-management", "/stakeholders"], StakeholderManagement)}
        <Route path="/playbook-library/:id" component={ProtocolDetail} />
        <Route path="/business-scenario/:id" component={ProtocolDetail} />
        <Route path="/playbook-library/:id/settings" component={ProtocolSettings} />
        <Route path="/playbook-command/:id" component={ProtocolCommand} />
        <Route path="/practice-drills/:drillId/live" component={LiveDrillExecution} />
        <Route path="/practice-drills">{() => <PracticeDrills />}</Route>
        <Route path="/crisis-exposure-matrix" component={CrisisExposureMatrix} />
        <Route path="/crisis-communications" component={CrisisCommunicationsGenerator} />
        <Route path="/financial-exposure" component={FinancialExposureEstimator} />
        <Route path="/concurrent-situations" component={ConcurrentSituationBoard} />
        <Route path="/simulation-studio">{() => <SimulationStudioPage />}</Route>
        <Route path="/roi-dashboard">{() => <ROIDashboard />}</Route>
        <Route path="/coordination-intelligence" component={lazy(() => import('./pages/CoordinationIntelligence'))} />
        <Route path="/strategic-recorder">{() => <StrategicRecorder />}</Route>
        <Route path="/execution-learning" component={ExecutionLearningDashboard} />
        {renderRoutes(["/playbook-readiness", "/playbook-audit"], ProtocolReadinessAudit)}
        <Route path="/future-gym" component={FutureGym} />
        <Route path="/foresight-radar">{() => <ForesightRadar />}</Route>
        <Route path="/readiness-oracle" component={ReadinessOracle} />
        <Route path="/readiness-benchmark" component={ReadinessBenchmark} />
        <Route path="/living-playbooks" component={LivingProtocols} />
        <Route path="/continuous-mode" component={ContinuousModePage} />

        {/* Analytics */}
        <Route path="/analytics" component={AdvancedAnalytics} />
        <Route path="/advanced-analytics" component={AdvancedAnalytics} />
        <Route path="/executive-analytics-dashboard" component={ExecutiveAnalyticsDashboard} />
        {renderRoutes(["/executive-summary", "/executive-summary-generator", "/report-generator"], ExecutiveSummaryGenerator)}
        <Route path="/audit-logging-center">{() => <AuditLoggingCenter />}</Route>
        <Route path="/roi-calculator" component={ROICalculator} />
        <Route path="/how-it-executes" component={HowItExecutes} />
        <Route path="/execution-data-fabric" component={lazy(() => import("./pages/ExecutionDataFabric"))} />
        <Route path="/institutional-memory-engine" component={lazy(() => import("./pages/InstitutionalMemoryEngine"))} />
        <Route path="/platform-integrations" component={lazy(() => import("./pages/PlatformIntegrations"))} />
        <Route path="/proof-story" component={ProofStory} />
        <Route path="/case-study/rochester-pm" component={BrunkeSistersCaseStudy} />
        <Route path="/agility-assessment" component={AgilityAssessment} />
        <Route path="/future-readiness" component={FutureReadinessDashboard} />
        <Route path="/readiness" component={FutureReadinessDashboard} />

        {/* Demo & Sales Tools */}
        <Route path="/try-demo" component={TryDemo} />
        {renderRedirects([
          "/live-demo", "/try-it",
          "/demo-selector", "/demo/selector", "/transformational-demo",
          "/four-phase-demo", "/4-phase-demo",
          "/intelligence-demo", "/signals-demo", "/watch-demo",
          "/executive-demo", "/hybrid-demo", "/executive-demo-walkthrough",
          "/sandbox-demo", "/sandbox", "/pilot-demo", "/one-click-demo"
        ], "/industry-demos")}
        <Route path="/board-export" component={BoardExport} />
        <Route path="/12-minute-experience" component={TwelveMinuteTestDrive} />
        <Route path="/test-drive" component={TwelveMinuteTestDrive} />
        <Route path="/situation-scanner" component={SituationScanner} />
        <Route path="/protocol-builder" component={ProtocolBuilder} />
        <Route path="/compound-protocol-builder" component={CompoundProtocolBuilder} />
        <Route path="/situation-matrix-builder" component={ProtocolSituationMatrixBuilder} />
        <Route path="/build-protocol" component={BuildProtocolRouter} />
        <Route path="/preparation-arc" component={PreparationArc} />
        <Route path="/the-case" component={TheCase} />
        <Route path="/my-protocols" component={ProtocolsHub} />
        <Route path="/executive-scenarios" component={ExecutiveScenarioSuite} />
        <Route path="/incident-analyzer" component={IncidentAnalyzer} />
        <Route path="/readiness-assessment" component={ReadinessAssessment} />
        {renderRoutes(["/video", "/cinematic", "/spots", "/30-second", "/brand-films"], VideoLanding)}
        {renderRedirects(["/sizzle", "/2-minute"], "/12-minute-experience")}

        {/* Integration Hub */}
        <Route path="/integration-hub">{() => <IntegrationHub />}</Route>
        {renderRoutes(["/integrations", "/integration-connections"], IntegrationConnections)}
        <Route path="/integrations-legacy" component={IntegrationsPage} />

        {/* Live Activation & Interactive Demos */}
        {renderRedirects(["/activation", "/demo/activation"], "/industry-demos")}
        {renderRoutes(["/role-selector", "/demo/role-selector"], RoleSelector)}

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
        <Route path="/one-click-demo">{() => { window.location.replace('/industry-demos'); return null; }}</Route>
        <Route path="/ai-intelligence-suite" component={ComprehensiveAIIntelligence} />
        <Route path="/ai-intelligence">{() => <Redirect to="/ai-intelligence-suite" />}</Route>
        <Route path="/live-activation-center" component={LiveActivationCenter} />
        <Route path="/live-activation">{() => <Redirect to="/live-activation-center" />}</Route>
        <Route path="/enterprise-metrics">{() => <EnterpriseMetrics />}</Route>
        <Route path="/unified-platform" component={UnifiedEnterprisePlatform} />

        {/* Industry Demos */}
        {renderRoutes(["/industry-demos", "/crisis-demos"], IndustryDemosHub)}
        {renderRoutes(["/luxury-demo", "/luxury-crisis-demo"], LuxuryCrisisDemo)}
        {renderRoutes(["/financial-demo", "/financial-ransomware-demo", "/financial-crisis-demo"], FinancialRansomwareDemo)}
        {renderRoutes(["/pharma-demo", "/pharmaceutical-recall-demo", "/pharma-recall-demo"], PharmaceuticalRecallDemo)}
        {renderRoutes(["/manufacturing-demo", "/manufacturing-supplier-demo", "/demo/hvacr-supplier"], ManufacturingSupplierDemo)}
        {renderRoutes(["/retail-demo", "/retail-food-demo", "/retail-food-safety-demo"], RetailFoodSafetyDemo)}
        {renderRoutes(["/energy-demo", "/energy-grid-demo", "/energy-grid-failure-demo"], EnergyGridFailureDemo)}
        <Route path="/lvmh-demo" component={LVMHMarketEntryDemo} />
        <Route path="/shein-demo" component={SHEINTrendDemo} />
        <Route path="/spacex-demo" component={SpaceXLaunchDemo} />
        {renderRedirects(["/executive-simulation", "/simulation-demo"], "/industry-demos")}
        <Route path="/executive-departure" component={lazy(() => import('./pages/ExecutiveDepartureBrief'))} />
        <Route path="/platform-overview" component={PlatformOverview} />
        <Route path="/capabilities" component={PlatformCapabilities} />
        {renderRedirects(["/product-tour", "/video-tour"], "/industry-demos")}
        <Route path="/investor-presentation" component={InvestorPresentation} />
        {renderRedirects(["/pitch-deck"], "/investor-presentation")}
        <Route path="/podcast-prep" component={PodcastPrep} />
        {renderRedirects(["/investor-demo", "/customer-demo", "/deal-risk-demo"], "/industry-demos")}
        <Route path="/investor-resources" component={InvestorResources} />
        {renderRoutes(["/roadshow-resources", "/roadshow"], RoadshowResources)}
        {renderRedirects(["/demo-gallery", "/keynote", "/trade-show-demo"], "/industry-demos")}

        {/* Customer Experience */}
        {renderRoutes(["/north-star", "/customer-journey"], CustomerJourney)}
        <Route path="/experience/:roleId" component={RoleExperience} />
        <Route path="/industry-experience/:industryId" component={IndustryExperience} />
        <Route path="/industry" component={IndustryPacksHub} />
        <Route path="/industry/:verticalKey" component={IndustryPackDetail} />
        {renderRoutes(["/industry-demo-library", "/industry-scenarios"], IndustryDemoLibrary)}
        <Route path="/industry-demo/:industrySlug" component={IndustryDemoDetail} />

        {/* Settings & Administration */}
        <Route path="/vc-presentations" component={VCPresentations} />
        <Route path="/settings" component={Settings} />
        <Route path="/uat-admin" component={UATAdmin} />
        <Route path="/pilot-monitoring" component={FoundingPartnerMonitoring} />
        <Route path="/admin/customer-health" component={AdminCustomerHealth} />
        <Route path="/admin/pilot-health" component={FoundingPartnerHealthMonitor} />
        <Route path="/admin/quick-link" component={AdminQuickLink} />
        <Route path="/admin/users" component={lazy(() => import("./pages/AdminPanel"))} />
        <Route path="/admin/prospect-briefs" component={AdminProspectBriefs} />
        <Route path="/admin/linkedin-posts" component={AdminLinkedInPosts} />
        <Route path="/access-denied" component={lazy(() => import("./pages/AccessDenied"))} />
        <Route path="/activation-outcome/:activationId" component={ActivationOutcome} />
        <Route path="/sitemap" component={Sitemap} />
        <Route path="/marketing-infographic" component={lazy(() => import("./pages/MarketingInfographic"))} />
        <Route path="/master-demo" component={lazy(() => import("./pages/MasterDemo"))} />
        <Route path="/demo/:scenarioId" component={lazy(() => import("./pages/MasterDemo"))} />
        <Route path="/protocol-browser" component={lazy(() => import("./pages/ProtocolCoverageBrowser"))} />
        <Route path="/demo-hub" component={lazy(() => import("./pages/DemoHub"))} />
        {renderRedirects(["/full-demo", "/platform-demo", "/guided-demo", "/demo-experience"], "/master-demo")}
        {renderRedirects(["/demos", "/scenario-hub", "/demo-center", "/experience-center"], "/demo-hub")}
        <Route path="/comprehensive-homepage" component={ExecutiveScorecard} />

        {/* Legacy Redirects */}
        {renderRedirects([
          "/scorecard", "/executive-scorecard", "/executive-suite",
          "/dashboard", "/platform", "/operating-model-health"
        ], "/mission-control")}
        {renderRedirects(["/command-center", "/command-center-dynamic"], "/mission-control")}
        <Route path="/war-room">{() => <ExecutiveWarRoomPage />}</Route>
        {renderRedirects([
          "/scenarios", "/scenario-library", "/scenario-gallery",
          "/comprehensive-scenarios", "/templates"
        ], "/playbooks")}
        {renderRedirects(["/triggers", "/trigger-dashboard"], "/triggers-management")}
        {renderRedirects(["/interactive-demo", "/interactive-master-demo"], "/how-it-works")}
        {renderRoutes(["/investor-landing", "/executive-access"], InvestorLanding)}
        <Route path="/readiness-infrastructure" component={lazy(() => import("./pages/ReadinessInfrastructure"))} />
        <Route path="/executive-brief" component={ExecutiveBrief} />
        <Route path="/product-overview" component={ProductOverview} />
        <Route path="/authorization-precedents" component={AuthorizationPrecedentRegistry} />
        <Route path="/mobilization-brief" component={MobilizationBrief} />
        <Route path="/founding-partner-brief" component={FoundingPartnerBrief} />
        <Route path="/readiness-rhythm" component={ReadinessRhythm} />
        <Route path="/entry" component={StartHere} />
        <Route path="/security-compliance" component={lazy(() => import("./pages/SecurityCompliance"))} />
        <Route path="/technical-architecture" component={lazy(() => import("./pages/TechnicalArchitecture"))} />
        <Route path="/technical-onboarding" component={lazy(() => import("./pages/TechnicalOnboarding"))} />
        <Route path="/universal-connector" component={lazy(() => import("./pages/UniversalConnector"))} />
        <Route path="/ai-stack" component={lazy(() => import("./pages/AIStackPositioning"))} />
        <Route path="/founding-partner" component={FoundingPartnerPage} />
        <Route path="/cost-of-inaction" component={CostOfInaction} />
        <Route path="/first-90-days" component={FirstNinetyDays} />
        <Route path="/board-memo" component={BoardMemo} />
        <Route path="/design-logic" component={DesignLogic} />
        <Route path="/buyer-decision-packet" component={BuyerDecisionPacket} />
        {renderRoutes(["/why-execution-os", "/the-proof", "/why-readiness-os"], WhyExecutionOS)}
        {renderRedirects(["/scenario-demo", "/ultimate-demo"], "/industry-demos")}
        <Route path="/landing">{() => <Redirect to="/" />}</Route>
        <Route path="/login">{() => <Redirect to="/" />}</Route>
        {renderRedirects(["/crisis", "/crisis-response-center"], "/strategic-monitoring")}
        <Route path="/request-evaluation" component={lazy(() => import('./pages/RequestEvaluation'))} />
        <Route path="/readiness-ad" component={lazy(() => import('./pages/ReadinessAd'))} />
        <Route path="/commercial">{() => { window.location.replace('/commercial.html'); return null; }}</Route>
        <Route path="/comparison-view">{() => { window.location.replace('/comparison.html'); return null; }}</Route>

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
                  <EvalBanner />
                  <OnboardingOverlay />
                  <RoleIndustryCaptureModal />
                  <a
                    href="/comparison.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      position: 'fixed', bottom: 24, left: 20, zIndex: 9998,
                      background: '#C9A84C', color: '#0A0F2E',
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: 800, fontSize: 12, letterSpacing: '0.06em',
                      textTransform: 'uppercase', textDecoration: 'none',
                      padding: '10px 18px', borderRadius: 3,
                      boxShadow: '0 3px 14px rgba(0,0,0,0.30)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    View Comparison
                  </a>
                  <QuickActions />
                  <ErrorBoundary>
                    <Router />
                  </ErrorBoundary>
                  <BoardReviewPanel />
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
