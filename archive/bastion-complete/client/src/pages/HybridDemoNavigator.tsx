import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { useDemoController } from '@/contexts/DemoController';
import DemoConfigPanel from '@/components/demo/DemoConfigPanel';
import DemoWelcomeScreen from '@/components/demo/DemoWelcomeScreen';
import DemoCompletionScreen from '@/components/demo/DemoCompletionScreen';
import DemoShareModal from '@/components/demo/DemoShareModal';
import InteractiveROICalculator from '@/components/demo/InteractiveROICalculator';
import { 
  Play, 
  Rocket, 
  Target,
  Users,
  Brain,
  Activity,
  Shield,
  Zap,
  BarChart3,
  CheckCircle,
  Clock,
  ArrowRight,
  Presentation,
  Settings
} from 'lucide-react';

const phaseIcons = {
  detection: Activity,
  planning: Target,  
  response: Shield,
  execution: Zap,
  measurement: BarChart3
};

const phaseColors = {
  detection: 'from-orange-600 to-red-600',
  planning: 'from-blue-600 to-purple-600',
  response: 'from-red-600 to-pink-600',
  execution: 'from-green-600 to-blue-600',
  measurement: 'from-purple-600 to-indigo-600'
};

export default function HybridDemoNavigator() {
  const { 
    state, 
    allScenes, 
    startDemo, 
    stopDemo, 
    jumpToScene,
    currentSceneData
  } = useDemoController();

  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showROICalculator, setShowROICalculator] = useState(false);

  // Ref to track if autostart has been triggered (prevents duplicate executions)
  const hasAutoStartedRef = useRef(false);

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Show/hide ROI calculator based on current scene
  useEffect(() => {
    if (currentSceneData?.id === 'innovation-pipeline' && state.isActive) {
      const timer = setTimeout(() => setShowROICalculator(true), 2000);
      return () => clearTimeout(timer);
    } else {
      // Hide calculator when leaving innovation pipeline scene or demo stops
      setShowROICalculator(false);
    }
  }, [currentSceneData, state.isActive]);

  // Show completion screen when demo finishes
  useEffect(() => {
    // Check if demo just completed (reached last scene, is still active, not paused, and not already showing completion)
    if (
      state.isActive && 
      !state.isPaused &&
      state.currentScene === state.totalScenes - 1 && 
      state.progress >= 99 &&
      !showCompletionScreen
    ) {
      const timer = setTimeout(() => {
        setShowCompletionScreen(true);
      }, 3000); // Show completion screen 3 seconds after last scene
      return () => clearTimeout(timer);
    }
  }, [state.isActive, state.isPaused, state.currentScene, state.totalScenes, state.progress, showCompletionScreen]);

  // Handle autostart from URL params (prevents duplicate executions with ref)
  useEffect(() => {
    if (hasAutoStartedRef.current) return; // Already triggered, skip
    
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart');
    
    if (autostart === 'true') {
      hasAutoStartedRef.current = true; // Mark as triggered
      // Skip welcome screen and start demo immediately
      startDemo();
    }
  }, [startDemo]);

  const handleShowWelcome = () => {
    setShowWelcomeScreen(true);
  };

  const handleCloseCompletion = () => {
    setShowCompletionScreen(false);
    stopDemo();
  };

  const handleShareFromCompletion = () => {
    setShowCompletionScreen(false);
    setShowShareModal(true);
  };

  return (
    <VeridiusPageLayout>
      <div className="space-y-6 max-w-6xl mx-auto p-6" data-testid="hybrid-demo-navigator">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Presentation className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Hybrid Demo Navigator</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Automated guided tour showcasing NFL coach-level decision velocity with 80+ executive playbooks. 
            Perfect for Fortune 1000 client presentations demonstrating 12-minute execution vs 72-hour industry standard.
          </p>
        </div>

        {/* Demo Status Card */}
        <Card className={`border-2 ${state.isActive ? 'border-green-500 bg-green-950/30' : 'border-blue-500 bg-blue-950/30'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${state.isActive ? 'bg-green-600' : 'bg-blue-600'}`}>
                  {state.isActive ? <Activity className="h-6 w-6 text-white" /> : <Rocket className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <CardTitle className="text-white">
                    {state.isActive ? 'Demo In Progress' : 'Ready to Launch Demo'}
                  </CardTitle>
                  <p className="text-gray-300">
                    {state.isActive 
                      ? `Currently on scene ${state.currentScene + 1} of ${state.totalScenes}`
                      : `Comprehensive ${state.totalScenes}-scene Fortune 1000 demonstration - Executive Playbook Platform in action`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {state.isActive && (
                  <Badge variant="outline" className="bg-green-600/20 text-green-300 border-green-500/50">
                    {Math.round(state.progress)}% Complete
                  </Badge>
                )}
                
                {!state.isActive && (
                  <>
                    <Button 
                      onClick={handleShowWelcome}
                      variant="outline"
                      className="border-purple-500 text-purple-300 hover:bg-purple-600/20"
                      data-testid="preview-demo-btn"
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      Preview Demo
                    </Button>
                    <Button 
                      onClick={() => setShowConfigPanel(true)}
                      variant="outline"
                      className="border-blue-500 text-blue-300 hover:bg-blue-600/20"
                      data-testid="config-demo-btn"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </>
                )}
                
                <Button 
                  onClick={state.isActive ? stopDemo : startDemo}
                  className={state.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                  data-testid={state.isActive ? 'stop-demo-btn' : 'start-demo-btn'}
                >
                  {state.isActive ? (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Stop Demo
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Quick Start
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {state.isActive && (
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>Demo Progress</span>
                  <span>{state.currentScene + 1} / {state.totalScenes} scenes</span>
                </div>
                <Progress value={state.progress} className="w-full" />
                
                {currentSceneData && (
                  <Alert className="bg-blue-950/50 border-blue-500/30">
                    <Activity className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-blue-200">
                      <strong>Current Scene:</strong> {currentSceneData.title} - {currentSceneData.subtitle}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Demo Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-purple-500/30 bg-purple-950/30">
            <CardContent className="p-6 text-center">
              <Brain className="h-10 w-10 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Comprehensive Platform Depth</h3>
              <p className="text-purple-200 text-sm">
                39 detailed scenes covering all 5 AI modules, 80+ executive playbooks with NFL coach velocity, strategic planning, analytics, and enterprise capabilities
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-green-500/30 bg-green-950/30">
            <CardContent className="p-6 text-center">
              <Zap className="h-10 w-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Industry & Persona Customization</h3>
              <p className="text-green-200 text-sm">
                Personalized demos for CEO/COO/CHRO with healthcare, finance, manufacturing, and retail-specific scenarios
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-500/30 bg-blue-950/30">
            <CardContent className="p-6 text-center">
              <Target className="h-10 w-10 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">18-30 Second Deep-Dives</h3>
              <p className="text-blue-200 text-sm">
                Each scene provides comprehensive narration demonstrating business value with no oversimplification
                Professional presentation features with timing control, scene navigation, and presentation mode
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Features Included */}
        <Card className="border-blue-500/50 bg-gradient-to-r from-blue-950/50 to-purple-950/50">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
              Comprehensive Platform Demonstration ({state.totalScenes} Detailed Scenes)
            </CardTitle>
            <p className="text-gray-300 text-sm mt-2">
              This demo showcases Bastion's Executive Playbook Platform - 80+ playbooks enabling NFL coach-level decision velocity. Perfect for Fortune 1000 presentations.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  All 5 AI Intelligence Modules
                </h4>
                <ul className="text-sm text-gray-300 space-y-1 ml-6 list-disc">
                  <li>Pulse Intelligence (health metrics)</li>
                  <li>Flux Adaptations (change management)</li>
                  <li>Prism Insights (strategic analysis)</li>
                  <li>Echo Cultural Analytics (culture health)</li>
                  <li>Nova Innovations (innovation pipeline)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-400" />
                  Executive Playbook System (80+ Playbooks)
                </h4>
                <ul className="text-sm text-gray-300 space-y-1 ml-6 list-disc">
                  <li>One-Click Playbook Execution (NFL Coach Mode)</li>
                  <li>12-Min Avg Execution vs 72-Hr Industry Standard</li>
                  <li>3-Phase Response Management</li>
                  <li>Risk Intelligence & Compliance</li>
                  <li>Regulatory Audit Trails</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  Strategic Planning & Execution
                </h4>
                <ul className="text-sm text-gray-300 space-y-1 ml-6 list-disc">
                  <li>Scenario Management & Portfolio</li>
                  <li>Enterprise Project Tracking</li>
                  <li>Stakeholder Communication</li>
                  <li>Resource & Budget Management</li>
                  <li>Real-Time Progress Visibility</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  Real-Time Collaboration
                </h4>
                <ul className="text-sm text-gray-300 space-y-1 ml-6 list-disc">
                  <li>WebSocket-Powered Live Updates</li>
                  <li>Activity Feeds & Coordination</li>
                  <li>Team Synchronization</li>
                  <li>Instant Status Notifications</li>
                  <li>Zero-Lag Communication</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-yellow-400" />
                  Analytics & Reporting
                </h4>
                <ul className="text-sm text-gray-300 space-y-1 ml-6 list-disc">
                  <li>Performance Analytics Dashboards</li>
                  <li>Data Visualization Suite</li>
                  <li>Executive Reporting Tools</li>
                  <li>Predictive Trend Analysis</li>
                  <li>Benchmark Comparisons</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-cyan-400" />
                  Enterprise Capabilities
                </h4>
                <ul className="text-sm text-gray-300 space-y-1 ml-6 list-disc">
                  <li>Competitive Intelligence Tracking</li>
                  <li>Enterprise System Integrations</li>
                  <li>Bank-Level Security (SOC 2)</li>
                  <li>Mobile & Remote Access (24/7)</li>
                  <li>Training & Customization</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-950/30 border border-green-500/30 rounded-lg">
              <p className="text-green-200 text-sm">
                <strong className="text-green-300">✓ Interactive ROI Calculator:</strong> Real-time business impact calculations with industry-specific metrics, persona-tailored messaging, and quantified value demonstration ($247M market value protection, 1,847% ROI, 85% faster decision velocity - 12 min vs 72 hrs)
              </p>
            </div>

            <div className="mt-4 p-4 bg-purple-950/30 border border-purple-500/30 rounded-lg">
              <p className="text-purple-200 text-sm">
                <strong className="text-purple-300">✓ Personalized Experiences:</strong> CEO/COO/CHRO persona tracks with industry-specific scenarios (Healthcare, Finance, Manufacturing, Retail) - content adapts in real-time to executive role and business sector
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Scenario Overview */}
        <Card className="border-gray-600 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Complete Demo Scenario Walkthrough ({state.totalScenes} Scenes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allScenes.map((scene, index) => {
                const PhaseIcon = phaseIcons[scene.phase as keyof typeof phaseIcons];
                const isActive = state.isActive && index === state.currentScene;
                
                return (
                  <Card 
                    key={scene.id} 
                    className={`transition-all duration-200 ${
                      isActive
                        ? 'border-blue-500 bg-blue-950/30 shadow-lg' 
                        : 'border-gray-600 bg-gray-900/30 hover:bg-gray-800/50'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${phaseColors[scene.phase as keyof typeof phaseColors]}`}>
                              <PhaseIcon className="h-5 w-5 text-white" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Scene {index + 1}
                            </Badge>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-white">
                              {scene.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {scene.subtitle}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {Math.floor(scene.duration / 1000)}s
                              </span>
                              <span className="capitalize">{scene.type}</span>
                              {scene.route && (
                                <span>{scene.route}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <Badge variant="default" className="bg-blue-600 text-white">
                              ACTIVE
                            </Badge>
                          )}
                          {state.isActive && !isActive && index < state.currentScene && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {state.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => jumpToScene(index)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/50"
                              data-testid={`jump-to-scene-${index}`}
                            >
                              Jump To
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 pl-12">
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {scene.narration}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Value Proposition Summary */}
        <Card className="border-green-500/30 bg-green-950/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Demo Value Proposition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-green-300 mb-3">Executive Impact</h4>
                <div className="space-y-2 text-sm text-green-200">
                  <div className="flex justify-between">
                    <span>Market Share Protected</span>
                    <span className="font-bold text-green-400">$247M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Acceleration</span>
                    <span className="font-bold text-green-400">9 Months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform ROI</span>
                    <span className="font-bold text-green-400">1,847%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Probability</span>
                    <span className="font-bold text-green-400">87%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-green-300 mb-3">Demo Features</h4>
                <div className="space-y-2 text-sm text-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Automated navigation between pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Professional presentation controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Real-time platform interactions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Executive-level business storytelling</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start Guide */}
        <Card className="border-blue-500/30 bg-blue-950/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-300 mb-3">For Presentations</h4>
                <div className="space-y-2 text-sm text-blue-200">
                  <div>1. Click "Launch Demo" to begin guided tour</div>
                  <div>2. Use presentation mode for full-screen experience</div>
                  <div>3. Control timing with play/pause/skip controls</div>
                  <div>4. Jump to specific scenes as needed</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-blue-300 mb-3">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm text-blue-200">
                  <div><span className="font-mono bg-blue-900/50 px-1">Space</span> - Play/Pause demo</div>
                  <div><span className="font-mono bg-blue-900/50 px-1">←/→</span> - Previous/Next scene</div>
                  <div><span className="font-mono bg-blue-900/50 px-1">Esc</span> - Exit presentation mode</div>
                  <div><span className="font-mono bg-blue-900/50 px-1">F</span> - Toggle full-screen</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Interactive ROI Calculator - Shows during innovation pipeline scene */}
        {showROICalculator && state.isActive && (
          <div className="fixed bottom-6 right-6 w-96 z-[10001]" data-testid="floating-roi-calculator">
            <InteractiveROICalculator 
              persona={state.selectedPersona}
              industry={state.selectedIndustry}
            />
          </div>
        )}
      </div>

      {/* Welcome Screen */}
      {showWelcomeScreen && (
        <DemoWelcomeScreen 
          onStartDemo={() => {
            setShowWelcomeScreen(false);
            setShowConfigPanel(true);
          }}
          onClose={() => setShowWelcomeScreen(false)}
        />
      )}

      {/* Demo Configuration Panel */}
      {showConfigPanel && (
        <DemoConfigPanel 
          onClose={() => setShowConfigPanel(false)}
          onStartDemo={() => {
            setShowConfigPanel(false);
            startDemo();
          }}
        />
      )}

      {/* Completion Screen */}
      {showCompletionScreen && (
        <DemoCompletionScreen 
          onClose={handleCloseCompletion}
          onShareDemo={handleShareFromCompletion}
          persona={state.selectedPersona}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <DemoShareModal 
          onClose={() => setShowShareModal(false)}
          persona={state.selectedPersona}
          industry={state.selectedIndustry}
        />
      )}
    </VeridiusPageLayout>
  );
}