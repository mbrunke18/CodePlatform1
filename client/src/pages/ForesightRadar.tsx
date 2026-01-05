import PageLayout from '@/components/layout/PageLayout';
import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Radio, AlertTriangle, TrendingUp, Eye, Zap, Settings, Database, Grid3X3, Play, Target, Shield, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SignalControlCenter } from '@/components/intelligence/SignalControlCenter';

interface EnhancedWeakSignal {
  id: string;
  title: string;
  description: string;
  source: string;
  confidence: number;
  category: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  timeline: string;
  timestamp: Date;
  suggestedPlaybook?: string;
}

interface EnhancedOraclePattern {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  signals: number;
  trend: string;
  recommendation: string;
}

const demoWeakSignals: EnhancedWeakSignal[] = [
  {
    id: 'ws-1',
    title: 'Competitor Price Movement',
    description: 'Major competitor reduced enterprise pricing by 15% across three product lines. Social sentiment indicates positive market reception.',
    source: 'Market Intelligence',
    confidence: 87,
    category: 'Competitive',
    impact: 'high',
    timeline: '2-4 weeks',
    timestamp: new Date(),
    suggestedPlaybook: 'Competitive Response'
  },
  {
    id: 'ws-2',
    title: 'Key Talent Departure Risk',
    description: 'LinkedIn activity suggests increased recruiter engagement with senior engineering team. Glassdoor sentiment trending negative.',
    source: 'HR Analytics',
    confidence: 72,
    category: 'Talent',
    impact: 'critical',
    timeline: '1-2 weeks',
    timestamp: new Date(),
    suggestedPlaybook: 'Talent Retention'
  },
  {
    id: 'ws-3',
    title: 'Supply Chain Disruption',
    description: 'Port congestion in key shipping routes detected. Similar pattern preceded Q3 2024 delays by 3 weeks.',
    source: 'Operations Intelligence',
    confidence: 68,
    category: 'Operations',
    impact: 'medium',
    timeline: '3-6 weeks',
    timestamp: new Date(),
    suggestedPlaybook: 'Supply Chain Resilience'
  },
  {
    id: 'ws-4',
    title: 'Regulatory Shift Indicator',
    description: 'Congressional committee scheduled hearings on data privacy. Industry lobbyist activity increased 40% in past 30 days.',
    source: 'Regulatory Watch',
    confidence: 65,
    category: 'Regulatory',
    impact: 'high',
    timeline: '4-8 weeks',
    timestamp: new Date(),
    suggestedPlaybook: 'Regulatory Compliance'
  }
];

const demoOraclePatterns: EnhancedOraclePattern[] = [
  {
    id: 'op-1',
    name: 'Market Entry Window',
    description: 'Pattern analysis indicates optimal expansion window opening in European markets. Historical accuracy: 89%.',
    accuracy: 89,
    signals: 12,
    trend: 'Opportunity emerging',
    recommendation: 'Consider accelerating EU market entry by 6-8 weeks'
  },
  {
    id: 'op-2',
    name: 'Customer Churn Predictor',
    description: 'Behavioral patterns match pre-churn signals in enterprise segment. 3 accounts showing early warning signs.',
    accuracy: 92,
    signals: 8,
    trend: 'Risk increasing',
    recommendation: 'Initiate proactive retention outreach within 5 days'
  },
  {
    id: 'op-3',
    name: 'Innovation Cycle Timing',
    description: 'Industry innovation cycles suggest competitor product launches in Q2. Patent filing patterns confirm.',
    accuracy: 78,
    signals: 15,
    trend: 'Cycle accelerating',
    recommendation: 'Accelerate roadmap items to maintain leadership position'
  }
];

export default function ForesightRadar() {
  const { weakSignals: apiSignals, oraclePatterns: apiPatterns, isLoading } = useDynamicStrategy();
  const { isConnected } = useWebSocket();
  const [, setLocation] = useLocation();
  const [selectedSignal, setSelectedSignal] = useState<EnhancedWeakSignal | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<EnhancedOraclePattern | null>(null);
  const [highlightedSignal, setHighlightedSignal] = useState<string | null>(null);

  const weakSignals: EnhancedWeakSignal[] = apiSignals.length > 0 
    ? apiSignals.map(s => ({
        ...s,
        description: s.title + ' - Detected by AI monitoring',
        impact: 'medium' as const,
        timeline: '1-2 weeks'
      }))
    : demoWeakSignals;

  const oraclePatterns: EnhancedOraclePattern[] = apiPatterns.length > 0
    ? apiPatterns.map(p => ({
        ...p,
        description: `Pattern: ${p.name}`,
        recommendation: 'Review pattern details for recommended actions'
      }))
    : demoOraclePatterns;

  const handleInvestigateSignal = (signal: EnhancedWeakSignal) => {
    setSelectedSignal(signal);
  };

  const handleViewPattern = (pattern: EnhancedOraclePattern) => {
    setSelectedPattern(pattern);
  };

  const handleActivatePlaybook = (signal: EnhancedWeakSignal) => {
    setSelectedSignal(null);
    setLocation('/playbook-library');
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="page-background min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Value Proposition */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-3">
              <Radio className="w-10 h-10 text-blue-600 animate-pulse" />
              Foresight Radar
            </h1>
            <div className="flex items-center gap-3">
              <Link href="/intelligence-demo">
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950" data-testid="button-try-demo">
                  <Play className="w-4 h-4 mr-2" />
                  Try Interactive Demo
                </Button>
              </Link>
              <Badge className={`flex items-center gap-1 ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white animate-pulse' : 'bg-white'}`}></div>
                {isConnected ? 'Live Stream Active' : 'Demo Mode'}
              </Badge>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
            AI-powered continuous monitoring detects early signals of threats and opportunities before they become obvious. See what's coming so you can act first, not react late.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="bg-blue-500 rounded-lg p-2">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">16 Signal Categories</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Monitoring competitive, market, regulatory, and operational signals</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="bg-amber-500 rounded-lg p-2">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Early Warning</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Detect weak signals 2-6 weeks before they become obvious threats</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/50 dark:to-violet-900/30 border-violet-200 dark:border-violet-800">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="bg-violet-500 rounded-lg p-2">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">AI Pattern Recognition</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Oracle engine identifies opportunities others miss</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="radar" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-lg">
            <TabsTrigger value="radar" className="flex items-center gap-2" data-testid="tab-radar-view">
              <Eye className="w-4 h-4" />
              Radar View
            </TabsTrigger>
            <TabsTrigger value="signals" className="flex items-center gap-2" data-testid="tab-signal-center">
              <Grid3X3 className="w-4 h-4" />
              Signal Center
            </TabsTrigger>
            <TabsTrigger value="configure" className="flex items-center gap-2" data-testid="tab-configure">
              <Settings className="w-4 h-4" />
              Configure
            </TabsTrigger>
          </TabsList>

          <TabsContent value="radar" className="mt-6">
            {/* Radar Visual Section */}
            <div className="space-y-8">
              {/* Radar Visual Representation */}
              <Card className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-12">
                  <div className="relative w-full aspect-square max-w-2xl mx-auto">
                    {/* Radar Circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full border-4 border-blue-300 dark:border-blue-700 rounded-full opacity-30"></div>
                    </div>
                    <div className="absolute inset-[15%] flex items-center justify-center">
                      <div className="w-full h-full border-4 border-blue-300 dark:border-blue-700 rounded-full opacity-50"></div>
                    </div>
                    <div className="absolute inset-[30%] flex items-center justify-center">
                      <div className="w-full h-full border-4 border-blue-300 dark:border-blue-700 rounded-full opacity-70"></div>
                    </div>
                    
                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-6 shadow-xl">
                        <Eye className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    {/* Weak Signals on Radar */}
                    {weakSignals.slice(0, 8).map((signal, index) => {
                      const angle = (index * 360) / Math.min(weakSignals.length, 8);
                      const distance = 35 + (signal.confidence / 100) * 25;
                      const x = 50 + distance * Math.cos((angle * Math.PI) / 180);
                      const y = 50 + distance * Math.sin((angle * Math.PI) / 180);
                      const isNew = highlightedSignal === signal.id;
                      const impactColor = signal.impact === 'critical' ? 'bg-red-500' : signal.impact === 'high' ? 'bg-amber-500' : 'bg-yellow-400';
                      
                      return (
                        <div
                          key={signal.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all ${isNew ? 'scale-125' : ''}`}
                          style={{ left: `${x}%`, top: `${y}%` }}
                          onClick={() => handleInvestigateSignal(signal)}
                          data-testid={`radar-blip-${signal.id}`}
                        >
                          <div className={`w-4 h-4 rounded-full absolute ${impactColor} animate-ping`}></div>
                          <div className={`w-4 h-4 rounded-full relative ${impactColor}`}></div>
                          
                          {/* Tooltip */}
                          <div className="absolute hidden group-hover:block z-50 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 min-w-64 top-6 left-0">
                            <div className="font-semibold text-sm mb-1">{signal.title}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{signal.description}</div>
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline">{signal.confidence}% confidence</Badge>
                              <Badge variant={signal.impact === 'critical' ? 'destructive' : 'secondary'}>
                                {signal.impact}
                              </Badge>
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Click to investigate →</p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Rotating Scan Line */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                      <div 
                        className="absolute w-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-blue-500 origin-left animate-[spin_4s_linear_infinite]"
                        style={{ left: '50%' }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Signal Cards Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Weak Signals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      Weak Signals Detected
                      <Badge variant="outline" className="ml-2">{weakSignals.length}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Early indicators requiring executive attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {weakSignals.map((signal) => (
                        <div
                          key={signal.id}
                          className={`p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900 hover:shadow-md transition-all cursor-pointer ${
                            highlightedSignal === signal.id ? 'ring-2 ring-blue-500 animate-pulse' : ''
                          }`}
                          onClick={() => handleInvestigateSignal(signal)}
                          data-testid={`weak-signal-card-${signal.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {signal.title}
                            </h4>
                            <Badge variant={signal.impact === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                              {signal.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {signal.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {signal.confidence}% confidence
                            </span>
                            <span>Timeline: {signal.timeline}</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full mt-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInvestigateSignal(signal);
                            }}
                            data-testid={`button-investigate-${signal.id}`}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Investigate Signal
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Oracle Patterns */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-violet-600" />
                      Oracle Pattern Recognition
                      <Badge variant="outline" className="ml-2">{oraclePatterns.length}</Badge>
                    </CardTitle>
                    <CardDescription>
                      AI-identified strategic patterns and predictions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {oraclePatterns.map((pattern) => (
                        <div
                          key={pattern.id}
                          className="p-4 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-900 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewPattern(pattern)}
                          data-testid={`oracle-pattern-card-${pattern.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {pattern.name}
                            </h4>
                            <Badge variant="outline" className="text-xs bg-violet-100 dark:bg-violet-900">
                              {pattern.accuracy}% accurate
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {pattern.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{pattern.trend}</span>
                            </div>
                            <div>
                              {pattern.signals} signals analyzed
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full mt-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPattern(pattern);
                            }}
                            data-testid={`button-view-pattern-${pattern.id}`}
                          >
                            <Lightbulb className="w-4 h-4 mr-2" />
                            View Pattern Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monitoring Status */}
              <Card className="border-2 border-green-500 dark:border-green-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500 rounded-full p-3">
                        <Radio className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          Continuous Monitoring Active
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Scanning 16 intelligence signal categories in real-time
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                          {weakSignals.length}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 uppercase">
                          Weak Signals
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                          {oraclePatterns.length}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 uppercase">
                          Patterns
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="signals" className="mt-6">
            <SignalControlCenter />
          </TabsContent>

          <TabsContent value="configure" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Signal Configuration
                </CardTitle>
                <CardDescription>
                  Configure monitoring thresholds, data sources, and alert settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <Link href="/triggers">
                    <Card className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all" data-testid="config-thresholds">
                      <CardContent className="p-6 text-center">
                        <Database className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                        <h4 className="font-semibold mb-1">Monitoring Thresholds</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Set custom alert thresholds for each signal category
                        </p>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Configure <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/integrations">
                    <Card className="cursor-pointer hover:border-purple-500 hover:shadow-md transition-all" data-testid="config-sources">
                      <CardContent className="p-6 text-center">
                        <Grid3X3 className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                        <h4 className="font-semibold mb-1">Data Sources</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Connect and manage enterprise data sources
                        </p>
                        <Button variant="ghost" size="sm" className="text-purple-600">
                          Configure <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/triggers">
                    <Card className="cursor-pointer hover:border-amber-500 hover:shadow-md transition-all" data-testid="config-notifications">
                      <CardContent className="p-6 text-center">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-amber-600" />
                        <h4 className="font-semibold mb-1">Alert Settings</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Configure notification preferences and escalation
                        </p>
                        <Button variant="ghost" size="sm" className="text-amber-600">
                          Configure <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>

      {/* Signal Investigation Modal */}
      <Dialog open={!!selectedSignal} onOpenChange={() => setSelectedSignal(null)}>
        <DialogContent className="max-w-lg" data-testid="dialog-investigate-signal">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" data-testid="dialog-title-investigate">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Signal Investigation
            </DialogTitle>
            <DialogDescription>
              Review signal details and recommended actions
            </DialogDescription>
          </DialogHeader>
          {selectedSignal && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedSignal.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedSignal.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground uppercase">Confidence</div>
                  <div className="text-xl font-bold text-blue-600">{selectedSignal.confidence}%</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground uppercase">Timeline</div>
                  <div className="text-xl font-bold text-amber-600">{selectedSignal.timeline}</div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-sm">Recommended Action</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedSignal.suggestedPlaybook 
                    ? `Activate the "${selectedSignal.suggestedPlaybook}" playbook to address this signal before it escalates.`
                    : 'Review related playbooks to determine the best response strategy.'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedSignal(null)}>
              Dismiss
            </Button>
            <Button onClick={() => selectedSignal && handleActivatePlaybook(selectedSignal)}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Find Matching Playbook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pattern Details Modal */}
      <Dialog open={!!selectedPattern} onOpenChange={() => setSelectedPattern(null)}>
        <DialogContent className="max-w-lg" data-testid="dialog-pattern-analysis">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" data-testid="dialog-title-pattern">
              <Zap className="w-5 h-5 text-violet-600" />
              Pattern Analysis
            </DialogTitle>
            <DialogDescription>
              AI-identified strategic pattern details
            </DialogDescription>
          </DialogHeader>
          {selectedPattern && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedPattern.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedPattern.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground uppercase">Accuracy</div>
                  <div className="text-xl font-bold text-violet-600">{selectedPattern.accuracy}%</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground uppercase">Signals</div>
                  <div className="text-xl font-bold text-blue-600">{selectedPattern.signals}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground uppercase">Trend</div>
                  <div className="text-sm font-semibold text-green-600">{selectedPattern.trend}</div>
                </div>
              </div>

              <div className="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-violet-600" />
                  <span className="font-semibold text-sm">Oracle Recommendation</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedPattern.recommendation}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedPattern(null)}>
              Close
            </Button>
            <Button onClick={() => {
              setSelectedPattern(null);
              setLocation('/playbook-library');
            }}>
              <Target className="w-4 h-4 mr-2" />
              Explore Related Playbooks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
