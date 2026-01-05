import { useState, useRef, useEffect } from 'react';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  AlertTriangle,
  TrendingUp,
  Target,
  Users,
  Brain,
  Activity,
  Layers,
  Zap,
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Settings,
  Globe,
  TrendingDown,
  Minus
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  phase: 'detection' | 'planning' | 'response' | 'execution' | 'measurement';
  capabilities: string[];
  metrics: Array<{
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    critical?: boolean;
  }>;
  actions: string[];
  timeline: string;
}

const demoSteps: DemoStep[] = [
  {
    id: 'signal-detection',
    title: 'Strategic Signal Detection',
    subtitle: 'AI competitor breakthrough detected',
    description: 'Pulse Intelligence module identifies convergence of competitive threats and market disruption signals across multiple data streams.',
    phase: 'detection',
    capabilities: ['Pulse Intelligence', 'Pattern Recognition', 'Threat Assessment', 'Real-time Monitoring'],
    metrics: [
      { label: 'Competitor AI Patents', value: '847%', trend: 'up', critical: true },
      { label: 'Customer AI Inquiries', value: '312%', trend: 'up', critical: true },
      { label: 'Industry Cost Advantage', value: '40%', trend: 'up', critical: true },
      { label: 'Media Sentiment Shift', value: '-23%', trend: 'down', critical: true }
    ],
    actions: [
      'Automated competitive intelligence gathering',
      'Cross-reference customer inquiry patterns',
      'Industry benchmark analysis activation',
      'Executive alert notification sent'
    ],
    timeline: '0-2 hours'
  },
  {
    id: 'trigger-activation',
    title: 'Automated Trigger Activation',
    subtitle: 'Threshold breach - Crisis protocol initiated',
    description: 'Pre-configured triggers automatically activate when competitor AI capabilities exceed defined thresholds, launching comprehensive response protocols.',
    phase: 'detection',
    capabilities: ['Triggers Management', 'Automated Escalation', 'Crisis Response Templates', 'Stakeholder Notification'],
    metrics: [
      { label: 'Response Speed', value: '8.3 min', trend: 'down' },
      { label: 'Stakeholders Notified', value: '47', trend: 'up' },
      { label: 'Crisis Template Match', value: '98%', trend: 'stable' },
      { label: 'Escalation Level', value: 'Critical', trend: 'up', critical: true }
    ],
    actions: [
      'Executive war room assembly initiated',
      'Emergency budget authorization triggered',
      'Competitive technology disruption template activated',
      'Multi-department coordination protocols launched'
    ],
    timeline: '8 minutes'
  },
  {
    id: 'scenario-planning',
    title: 'Strategic Scenario Planning',
    subtitle: 'AI Transformation Initiative mapped',
    description: 'Nova Innovation module generates comprehensive strategic scenarios with resource requirements, stakeholder mapping, and success metrics for competitive response.',
    phase: 'planning',
    capabilities: ['Nova Innovations', 'Scenario Templates', 'Resource Planning', 'Stakeholder Mapping'],
    metrics: [
      { label: 'Investment Required', value: '$50M', trend: 'stable' },
      { label: 'Timeline to Parity', value: '18 months', trend: 'down' },
      { label: 'Success Probability', value: '87%', trend: 'up' },
      { label: 'Market Share Protection', value: '92%', trend: 'up' }
    ],
    actions: [
      'Three AI implementation pathways identified',
      'Resource requirements calculated ($50M, 120-person team)',
      'Critical decision milestones mapped (12 go/no-go points)',
      'Technology partner assessment completed'
    ],
    timeline: '2-6 hours'
  },
  {
    id: 'crisis-response',
    title: 'Crisis Response Execution',
    subtitle: 'Multi-phase competitive response activated',
    description: 'Comprehensive crisis response template executes immediate, short-term, and long-term strategies with role-specific actions across 47 stakeholders.',
    phase: 'response',
    capabilities: ['Crisis Response Center', 'Executive War Room', 'Communication Protocols', 'Resource Mobilization'],
    metrics: [
      { label: 'Response Teams Active', value: '8', trend: 'up' },
      { label: 'Budget Mobilized', value: '$12M', trend: 'up' },
      { label: 'Media Response Time', value: '2.4 hrs', trend: 'down' },
      { label: 'Customer Retention Risk', value: '15%', trend: 'down' }
    ],
    actions: [
      'Immediate: Executive assembly, competitive intelligence, PR strategy',
      'Short-term: AI partner acquisition, capability assessment, market positioning',
      'Long-term: Full transformation, market defense, innovation ecosystem',
      'Continuous: Real-time monitoring and strategy adjustments'
    ],
    timeline: '0-48 hours'
  },
  {
    id: 'intelligence-coordination',
    title: 'AI Intelligence Coordination',
    subtitle: 'Multi-dimensional strategic analysis active',
    description: 'All five AI intelligence modules working in coordination to provide comprehensive strategic guidance and real-time adaptation capabilities.',
    phase: 'execution',
    capabilities: ['Prism Insights', 'Echo Cultural Analytics', 'Flux Adaptations', 'Multi-dimensional Analysis'],
    metrics: [
      { label: 'Strategic Options Analyzed', value: '156', trend: 'up' },
      { label: 'Team Readiness Score', value: '74%', trend: 'up' },
      { label: 'Cultural Adaptation Index', value: '82%', trend: 'up' },
      { label: 'Change Management Risk', value: '28%', trend: 'down' }
    ],
    actions: [
      'Prism: Multi-dimensional competitive analysis and ROI modeling',
      'Echo: Team readiness assessment and change management strategy',
      'Flux: Dynamic strategy adjustments based on competitor moves',
      'Continuous intelligence updates and optimization recommendations'
    ],
    timeline: 'Ongoing'
  },
  {
    id: 'roi-measurement',
    title: 'ROI Measurement & Optimization',
    subtitle: 'Strategic value quantification active',
    description: 'Comprehensive ROI tracking demonstrates platform value: $200M+ market share protection, 6-12 month competitive advantage acceleration.',
    phase: 'measurement',
    capabilities: ['ROI Dashboard', 'Value Measurement', 'Competitive Intelligence', 'Strategic Optimization'],
    metrics: [
      { label: 'Market Share Protected', value: '$247M', trend: 'up' },
      { label: 'Response Acceleration', value: '9 months', trend: 'up' },
      { label: 'Platform ROI', value: '1,847%', trend: 'up' },
      { label: 'Competitive Advantage', value: '+12 months', trend: 'up' }
    ],
    actions: [
      'Proactive positioning saved 6-12 months response time',
      'Early threat detection prevented $200M+ market share loss',
      'Coordinated response achieved 87% success probability',
      'Platform investment ROI: $247M protection on $13.4M platform cost'
    ],
    timeline: 'Measured over 18 months'
  }
];

const phaseColors = {
  detection: 'bg-gradient-to-r from-orange-600 to-red-600',
  planning: 'bg-gradient-to-r from-blue-600 to-purple-600',
  response: 'bg-gradient-to-r from-red-600 to-pink-600',
  execution: 'bg-gradient-to-r from-green-600 to-blue-600',
  measurement: 'bg-gradient-to-r from-purple-600 to-indigo-600'
};

const phaseIcons = {
  detection: Activity,
  planning: Target,
  response: Shield,
  execution: Zap,
  measurement: BarChart3
};

export default function ExecutiveDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const step = demoSteps[currentStep];
  const PhaseIcon = phaseIcons[step.phase];
  const progressPercent = ((currentStep + 1) / demoSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const playDemo = () => {
    if (isPlaying) {
      // Pause - clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Play - start interval
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= demoSteps.length - 1) {
            setIsPlaying(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return prev;
          }
          return prev + 1;
        });
      }, 8000); // 8 seconds for better pacing
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Add keyboard shortcuts for presentations
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevStep();
      } else if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === ' ') {
        e.preventDefault();
        playDemo();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, isPlaying]);

  return (
    <VeridiusPageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-white">Executive Demo Presentation</h1>
          <p className="text-xl text-gray-300">AI Revolution Disruption Response - Fortune 500 TechCorp Industries</p>
        </div>
        {/* Demo Controls */}
        <Card className="border-blue-500/30 bg-blue-950/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Live Enterprise Demo</CardTitle>
                  <p className="text-blue-200">Fortune 500 Strategic Intelligence Platform Walkthrough</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} data-testid="demo-prev-step">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={playDemo} 
                  disabled={currentStep === demoSteps.length - 1 && !isPlaying}
                  data-testid="demo-play-pause"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button variant="outline" onClick={nextStep} disabled={currentStep === demoSteps.length - 1} data-testid="demo-next-step">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-200">Demo Progress</span>
                <span className="text-sm text-blue-200">Step {currentStep + 1} of {demoSteps.length}</span>
              </div>
              <Progress value={progressPercent} className="w-full" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Clock className="h-4 w-4" />
                  Timeline: {step.timeline}
                </div>
                <div className="text-xs text-blue-300">
                  Use ← → arrow keys or spacebar to control demo
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className={`border-2 ${phaseColors[step.phase]} text-white`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <PhaseIcon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                  <p className="text-lg opacity-90">{step.subtitle}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white text-lg px-4 py-2">
                {step.phase.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg opacity-90 mb-6">{step.description}</p>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10">
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="capabilities" className="text-white data-[state=active]:bg-white/20" data-testid="tab-capabilities">Capabilities</TabsTrigger>
                <TabsTrigger value="metrics" className="text-white data-[state=active]:bg-white/20" data-testid="tab-metrics">Metrics</TabsTrigger>
                <TabsTrigger value="actions" className="text-white data-[state=active]:bg-white/20" data-testid="tab-actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Alert className="bg-white/10 border-white/20 text-white">
                  <AlertTriangle className="h-4 w-4 text-white" />
                  <AlertDescription className="text-white">
                    <strong>Executive Scenario:</strong> Major competitor announces breakthrough AI manufacturing technology 
                    that could disrupt 40% of market share. Platform automatically detects threat convergence and 
                    activates coordinated strategic response across entire organization.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="capabilities" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  {step.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="font-medium">{capability}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  {step.metrics.map((metric, index) => (
                    <Card key={index} className={`bg-white/10 border-white/20 ${metric.critical ? 'border-red-400 bg-red-950/30' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/80">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">{metric.value}</span>
                            {metric.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-400" />
                            ) : metric.trend === 'down' ? (
                              <TrendingDown className="h-4 w-4 text-red-400" />
                            ) : (
                              <Minus className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="actions" className="mt-6">
                <div className="space-y-3">
                  {step.actions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
                      <ArrowRight className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white">{action}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Steps Overview */}
        <Card className="border-gray-600 bg-gray-950/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Complete Demo Walkthrough
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoSteps.map((demoStep, index) => {
                const StepIcon = phaseIcons[demoStep.phase];
                return (
                  <Card 
                    key={demoStep.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      index === currentStep 
                        ? 'border-blue-500 bg-blue-950/30' 
                        : 'border-gray-600 bg-gray-900/30 hover:bg-gray-800/50'
                    }`}
                    onClick={() => setCurrentStep(index)}
                    data-testid={`demo-step-${index}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${phaseColors[demoStep.phase]}`}>
                          <StepIcon className="h-4 w-4 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1">{demoStep.title}</h3>
                      <p className="text-xs text-gray-400 mb-2">{demoStep.subtitle}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {demoStep.timeline}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Platform Value Summary */}
        <Card className="border-green-500/30 bg-green-950/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Executive Value Proposition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">$247M</div>
                <div className="text-sm text-green-200">Market Share Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">9 Months</div>
                <div className="text-sm text-green-200">Faster Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">1,847%</div>
                <div className="text-sm text-green-200">Platform ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">87%</div>
                <div className="text-sm text-green-200">Success Probability</div>
              </div>
            </div>
            <Separator className="my-4" />
            <p className="text-green-200 text-center">
              <strong>Bottom Line:</strong> Bastion enables proactive strategic positioning, 
              preventing massive market share losses while accelerating competitive response capabilities 
              by 6-12 months. Platform investment of $13.4M delivers $247M in protected market value.
            </p>
          </CardContent>
        </Card>
      </div>
    </VeridiusPageLayout>
  );
}