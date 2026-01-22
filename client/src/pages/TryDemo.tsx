import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';
import { useLocation } from 'wouter';
import {
  BookOpen,
  Radar,
  Radio,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  DollarSign,
  Users,
  Zap,
  RefreshCw,
  Play,
  ChevronRight,
  Lightbulb,
  Target,
  TrendingUp,
  Brain,
  Shield,
  Clock,
  ArrowUpRight,
  Sparkles,
  Building2,
  Rocket
} from 'lucide-react';

type Phase = 'select' | 'identify' | 'detect' | 'execute' | 'advance';

interface Scenario {
  id: string;
  name: string;
  industry: string;
  icon: any;
  color: string;
  borderColor: string;
  trigger: string;
  playbook: string;
  dealValue: number;
  stakeholders: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'deal-risk',
    name: 'Deal at Risk',
    industry: 'Sales & Revenue',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/50',
    trigger: 'Customer requests accelerated timeline on $5M deal',
    playbook: 'Deal Risk Response',
    dealValue: 5000000,
    stakeholders: 6,
  },
  {
    id: 'ransomware',
    name: 'Ransomware Attack',
    industry: 'Cybersecurity',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    borderColor: 'border-red-500/50',
    trigger: 'Unusual network activity detected at 2:47 AM',
    playbook: 'Cyber Incident Response',
    dealValue: 4880000,
    stakeholders: 12,
  },
  {
    id: 'competitor',
    name: 'Competitor Launch',
    industry: 'Competitive Response',
    icon: Target,
    color: 'from-purple-500 to-violet-500',
    borderColor: 'border-purple-500/50',
    trigger: 'Major competitor announces product in your category',
    playbook: 'Competitive Response',
    dealValue: 15000000,
    stakeholders: 8,
  },
  {
    id: 'regulatory',
    name: 'Regulatory Change',
    industry: 'Compliance',
    icon: Building2,
    color: 'from-amber-500 to-yellow-500',
    borderColor: 'border-amber-500/50',
    trigger: 'New SEC disclosure requirements announced',
    playbook: 'Regulatory Compliance',
    dealValue: 2500000,
    stakeholders: 10,
  },
];

const PHASES = [
  { id: 'identify' as Phase, name: 'IDENTIFY', icon: BookOpen, color: 'violet', description: 'Playbook ready' },
  { id: 'detect' as Phase, name: 'DETECT', icon: Radar, color: 'blue', description: 'Signal detected' },
  { id: 'execute' as Phase, name: 'EXECUTE', icon: Radio, color: 'emerald', description: 'Coordinate response' },
  { id: 'advance' as Phase, name: 'ADVANCE', icon: BarChart3, color: 'amber', description: 'Capture learnings' },
];

export default function TryDemo() {
  const [, setLocation] = useLocation();
  const [currentPhase, setCurrentPhase] = useState<Phase>('select');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [completedPhases, setCompletedPhases] = useState<Phase[]>([]);
  const [executionSteps, setExecutionSteps] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [learnings, setLearnings] = useState<any>(null);

  const startDemo = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentPhase('identify');
    setCompletedPhases([]);
    setExecutionSteps([]);
    setLearnings(null);
  };

  const resetDemo = () => {
    setCurrentPhase('select');
    setSelectedScenario(null);
    setCompletedPhases([]);
    setExecutionSteps([]);
    setLearnings(null);
  };

  const completeIdentify = () => {
    setCompletedPhases(prev => [...prev, 'identify']);
    setCurrentPhase('detect');
  };

  const completeDetect = () => {
    setCompletedPhases(prev => [...prev, 'detect']);
    setCurrentPhase('execute');
    simulateExecution();
  };

  const simulateExecution = () => {
    setIsExecuting(true);
    const steps = [
      { id: 1, title: 'Playbook Activated', description: 'Deal Risk Response playbook triggered', icon: Zap, delay: 0 },
      { id: 2, title: 'Stakeholders Notified', description: '6 team members alerted via Slack', icon: Users, delay: 2000 },
      { id: 3, title: 'Tasks Created', description: '12 tasks auto-created in Jira', icon: CheckCircle2, delay: 4000 },
      { id: 4, title: 'Documents Staged', description: 'Response templates ready for review', icon: BookOpen, delay: 6000 },
      { id: 5, title: 'Budget Released', description: '$50K pre-approved budget unlocked', icon: DollarSign, delay: 8000 },
      { id: 6, title: 'Execution Complete', description: 'Coordinated response in 12 minutes', icon: CheckCircle2, delay: 10000 },
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setExecutionSteps(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setIsExecuting(false);
          setCompletedPhases(prev => [...prev, 'execute']);
          setCurrentPhase('advance');
        }
      }, step.delay);
    });
  };

  const completeAdvance = () => {
    const scenario = selectedScenario;
    setLearnings({
      dealContext: {
        dealName: scenario?.name || 'Strategic Event',
        dealAmount: scenario?.dealValue || 5000000,
      },
      successPatterns: [
        { category: 'Early Detection', insight: 'Signal detected 3 weeks before traditional discovery', impact: 'Proactive vs reactive response', icon: 'radar' },
        { category: 'Stakeholder Alignment', insight: `${scenario?.stakeholders || 6} stakeholders aligned in 12 minutes`, impact: 'Prevented conflicting communications', icon: 'users' },
        { category: 'Decision Velocity', insight: 'Executive sponsor briefed before escalation', impact: 'Maintained trust and momentum', icon: 'zap' },
      ],
      playbookImprovements: [
        { type: 'trigger', title: 'Add Competitive Intelligence Trigger', description: 'For deals over $3M, add competitor mention trigger', priority: 'high', estimatedImpact: 'Detect threats 2 weeks earlier' },
        { type: 'stakeholder', title: 'Include CFO in Budget Delays', description: 'Auto-loop CFO when approval >7 days', priority: 'medium', estimatedImpact: 'Reduce cycle by 4 days' },
      ],
      institutionalKnowledge: [
        { pattern: 'Timeline Compression Pattern', frequency: 'Occurs in 34% of enterprise deals', bestResponse: 'Proactive scope negotiation within 24 hours' },
      ],
      metrics: {
        dealValueProtected: scenario?.dealValue || 5000000,
        hoursRecovered: 20,
        costOfDelay: Math.round((scenario?.dealValue || 5000000) * 0.15),
      },
      nextExecutionRecommendations: [
        'Apply improved playbook to similar scenarios in pipeline',
        'Schedule quarterly playbook review with leadership',
        'Train team on early signal recognition',
      ],
    });
    setCompletedPhases(prev => [...prev, 'advance']);
  };

  const getPhaseProgress = () => {
    const phaseIndex = PHASES.findIndex(p => p.id === currentPhase);
    if (currentPhase === 'select') return 0;
    return ((phaseIndex + 1) / PHASES.length) * 100;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <StandardNav />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              Interactive Demo
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Experience ExecuteIQ
            </h1>
            <p className="text-lg text-slate-400">
              See how Fortune 1000 leaders execute strategic decisions in 12 minutes
            </p>
          </div>

          {/* Scenario Selection */}
          {currentPhase === 'select' && (
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-slate-400 mb-6">
                Choose a scenario to see ExecuteIQ in action:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {SCENARIOS.map((scenario) => {
                  const IconComponent = scenario.icon;
                  return (
                    <Card 
                      key={scenario.id}
                      className={`bg-slate-900/50 border-2 ${scenario.borderColor} cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group`}
                      onClick={() => startDemo(scenario)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${scenario.color}`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
                              {scenario.name}
                            </h3>
                            <p className="text-sm text-slate-500 mb-2">{scenario.industry}</p>
                            <p className="text-sm text-slate-400 mb-3">{scenario.trigger}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {scenario.stakeholders} stakeholders
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                12 min response
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm mb-4">
                  All scenarios demonstrate the complete IDEA Framework
                </p>
              </div>
            </div>
          )}

          {/* Active Demo */}
          {currentPhase !== 'select' && selectedScenario && (
            <>
              {/* Phase Navigation */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className={`bg-gradient-to-r ${selectedScenario.color} text-white`}>
                    {selectedScenario.name}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    ${(selectedScenario.dealValue / 1000000).toFixed(1)}M at stake
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={resetDemo} className="text-slate-400 hover:text-white">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Change Scenario
                </Button>
              </div>

              {/* Phase Indicators */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {PHASES.map((phase, index) => {
                  const isCompleted = completedPhases.includes(phase.id);
                  const isCurrent = currentPhase === phase.id;
                  const IconComponent = phase.icon;
                  
                  return (
                    <div 
                      key={phase.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isCurrent 
                          ? `bg-${phase.color}-500/20 border-${phase.color}-500` 
                          : isCompleted 
                            ? 'bg-slate-800/50 border-emerald-500/50' 
                            : 'bg-slate-900/30 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <IconComponent className={`h-4 w-4 ${isCurrent ? `text-${phase.color}-400` : 'text-slate-500'}`} />
                        )}
                        <span className={`text-xs font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                          {phase.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Progress value={getPhaseProgress()} className="mb-8 h-2" />

              {/* Phase Content */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Main Phase Card */}
                <div>
                  {currentPhase === 'identify' && (
                    <Card className="bg-slate-900 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-violet-400" />
                          IDENTIFY: Playbook Ready
                        </CardTitle>
                        <CardDescription>
                          Your {selectedScenario.playbook} playbook is pre-configured
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Playbook: {selectedScenario.playbook}</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              12 pre-configured tasks
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              {selectedScenario.stakeholders} stakeholders mapped
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              Response templates staged
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              Budget pre-approved
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-sm text-slate-400">
                            <span className="text-emerald-400 font-medium">Industry average:</span> 20-50 hours to coordinate a response team and find relevant documents.
                          </p>
                        </div>

                        <Button 
                          className="w-full bg-violet-600 hover:bg-violet-700"
                          onClick={completeIdentify}
                        >
                          Playbook Ready - Continue to Detection
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {currentPhase === 'detect' && (
                    <Card className="bg-slate-900 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Radar className="h-5 w-5 text-blue-400" />
                          DETECT: Signal Received
                        </CardTitle>
                        <CardDescription>
                          AI identified a trigger matching your playbook
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-red-400 mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="font-medium">Trigger Detected</span>
                          </div>
                          <p className="text-white">{selectedScenario.trigger}</p>
                          <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${(selectedScenario.dealValue / 1000000).toFixed(1)}M at risk
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Detected just now
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <Brain className="h-5 w-5" />
                            <span className="font-medium">AI Recommendation</span>
                          </div>
                          <p className="text-sm text-slate-300">
                            Activate <span className="text-white font-medium">{selectedScenario.playbook}</span> playbook. 
                            Match confidence: <span className="text-emerald-400">94%</span>
                          </p>
                        </div>

                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={completeDetect}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Activate Playbook
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {currentPhase === 'execute' && (
                    <Card className="bg-slate-900 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Radio className="h-5 w-5 text-emerald-400" />
                          EXECUTE: Coordinating Response
                        </CardTitle>
                        <CardDescription>
                          Watch ExecuteIQ orchestrate your response in real-time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {executionSteps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                              <div 
                                key={step.id}
                                className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border-l-2 border-emerald-500 animate-in slide-in-from-left"
                              >
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                  <IconComponent className="h-4 w-4 text-emerald-400" />
                                </div>
                                <div>
                                  <p className="text-white font-medium text-sm">{step.title}</p>
                                  <p className="text-slate-400 text-xs">{step.description}</p>
                                </div>
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto" />
                              </div>
                            );
                          })}
                          
                          {isExecuting && (
                            <div className="flex items-center justify-center p-4 text-slate-400">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent mr-2" />
                              Orchestrating response...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {currentPhase === 'advance' && (
                    <Card className="bg-slate-900 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-amber-400" />
                          ADVANCE: Capture Learnings
                        </CardTitle>
                        <CardDescription>
                          Turn this execution into institutional knowledge
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {!learnings ? (
                          <div className="space-y-4">
                            <p className="text-slate-400">
                              ExecuteIQ captures what worked and suggests playbook improvements for next time.
                            </p>
                            <Button 
                              className="w-full bg-amber-600 hover:bg-amber-700"
                              onClick={completeAdvance}
                            >
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generate Insights
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="font-medium text-sm">Execution Complete</span>
                              </div>
                              <p className="text-xs text-slate-400">
                                ${((learnings.metrics?.dealValueProtected || 0) / 1000000).toFixed(1)}M protected
                              </p>
                            </div>

                            <div>
                              <h4 className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                What Worked
                              </h4>
                              {learnings.successPatterns?.slice(0, 2).map((pattern: any, i: number) => (
                                <div key={i} className="p-2 bg-slate-800/50 rounded mb-1 text-xs">
                                  <span className="text-white">{pattern.category}:</span>
                                  <span className="text-slate-400 ml-1">{pattern.insight}</span>
                                </div>
                              ))}
                            </div>

                            <div>
                              <h4 className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1">
                                <Lightbulb className="h-3 w-3" />
                                Playbook Improvements
                              </h4>
                              {learnings.playbookImprovements?.map((imp: any, i: number) => (
                                <div key={i} className="p-2 bg-slate-800/50 rounded mb-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white text-xs">{imp.title}</span>
                                    <Badge className={imp.priority === 'high' ? 'bg-red-500/20 text-red-400 text-xs' : 'bg-amber-500/20 text-amber-400 text-xs'}>
                                      {imp.priority}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="p-3 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 rounded-lg border border-amber-500/30">
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                  <div className="text-lg font-bold text-emerald-400">
                                    ${((learnings.metrics?.dealValueProtected || 0) / 1000000).toFixed(1)}M
                                  </div>
                                  <p className="text-xs text-slate-400">Protected</p>
                                </div>
                                <div>
                                  <div className="text-lg font-bold text-amber-400">20h</div>
                                  <p className="text-xs text-slate-400">Saved</p>
                                </div>
                                <div>
                                  <div className="text-lg font-bold text-blue-400">12 min</div>
                                  <p className="text-xs text-slate-400">Response</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Side - Context */}
                <div className="space-y-4">
                  <Card className="bg-slate-900 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm">The IDEA Framework</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {PHASES.map((phase) => {
                          const isCompleted = completedPhases.includes(phase.id);
                          const isCurrent = currentPhase === phase.id;
                          const IconComponent = phase.icon;
                          
                          return (
                            <div 
                              key={phase.id}
                              className={`flex items-center gap-3 p-2 rounded-lg ${
                                isCurrent ? 'bg-slate-800' : ''
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <IconComponent className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-slate-500'}`} />
                              )}
                              <div className="flex-1">
                                <p className={`text-sm ${isCurrent ? 'text-white font-medium' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {phase.name}
                                </p>
                                <p className="text-xs text-slate-500">{phase.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Value Comparison */}
                  <Card className="bg-slate-900 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm">ExecuteIQ vs Traditional</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                          <p className="text-xs text-red-400 mb-1">Without ExecuteIQ</p>
                          <p className="text-lg font-bold text-white">20-50 hrs</p>
                          <p className="text-xs text-slate-500">to coordinate</p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
                          <p className="text-xs text-emerald-400 mb-1">With ExecuteIQ</p>
                          <p className="text-lg font-bold text-white">12 min</p>
                          <p className="text-xs text-slate-500">to coordinate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA after completion */}
                  {completedPhases.includes('advance') && learnings && (
                    <Card className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-500/50">
                      <CardContent className="p-6 text-center">
                        <Rocket className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          Ready to See It Live?
                        </h3>
                        <p className="text-slate-300 text-sm mb-4">
                          Start a 2-week pilot with your own scenarios and integrations
                        </p>
                        <Button 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 mb-2"
                          onClick={() => setLocation('/pilot-demo')}
                        >
                          Start Pilot
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full text-slate-400 hover:text-white"
                          onClick={() => setLocation('/contact')}
                        >
                          Talk to Sales
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
