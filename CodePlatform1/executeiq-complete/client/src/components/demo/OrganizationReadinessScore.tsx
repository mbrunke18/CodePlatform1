import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  BookOpen,
  Radio,
  Calendar,
  Building2,
  ChevronRight
} from 'lucide-react';

type Industry = 
  | 'technology' 
  | 'financial_services' 
  | 'healthcare' 
  | 'manufacturing' 
  | 'retail' 
  | 'energy'
  | 'pharmaceuticals'
  | 'telecommunications';

interface OrganizationReadinessScoreProps {
  companyName: string;
  industry: Industry;
  employeeCount?: number;
  annualRevenue?: number;
  onScheduleCall: () => void;
  onStartTrial?: () => void;
}

interface ReadinessMetric {
  name: string;
  currentScore: number;
  industryAverage: number;
  topPerformers: number;
  icon: typeof Shield;
  description: string;
}

interface TransformationMilestone {
  day: number;
  title: string;
  description: string;
  impact: string;
}

const INDUSTRY_BENCHMARKS: Record<Industry, {
  avgReadinessScore: number;
  topQuartileScore: number;
  avgResponseTime: number; // hours
  riskMultiplier: number;
  typicalEvents: number; // per year
}> = {
  technology: { avgReadinessScore: 34, topQuartileScore: 82, avgResponseTime: 3.2, riskMultiplier: 1.4, typicalEvents: 14 },
  financial_services: { avgReadinessScore: 41, topQuartileScore: 88, avgResponseTime: 2.8, riskMultiplier: 1.8, typicalEvents: 18 },
  healthcare: { avgReadinessScore: 29, topQuartileScore: 76, avgResponseTime: 4.5, riskMultiplier: 1.6, typicalEvents: 12 },
  manufacturing: { avgReadinessScore: 26, topQuartileScore: 72, avgResponseTime: 5.1, riskMultiplier: 1.3, typicalEvents: 10 },
  retail: { avgReadinessScore: 31, topQuartileScore: 74, avgResponseTime: 3.8, riskMultiplier: 1.2, typicalEvents: 16 },
  energy: { avgReadinessScore: 38, topQuartileScore: 81, avgResponseTime: 3.5, riskMultiplier: 2.0, typicalEvents: 8 },
  pharmaceuticals: { avgReadinessScore: 35, topQuartileScore: 84, avgResponseTime: 3.0, riskMultiplier: 1.9, typicalEvents: 11 },
  telecommunications: { avgReadinessScore: 37, topQuartileScore: 79, avgResponseTime: 2.5, riskMultiplier: 1.5, typicalEvents: 15 },
};

const INDUSTRY_LABELS: Record<Industry, string> = {
  technology: 'Technology',
  financial_services: 'Financial Services',
  healthcare: 'Healthcare',
  manufacturing: 'Manufacturing',
  retail: 'Retail',
  energy: 'Energy',
  pharmaceuticals: 'Pharmaceuticals',
  telecommunications: 'Telecommunications',
};

export function OrganizationReadinessScore({
  companyName,
  industry,
  employeeCount = 5000,
  annualRevenue = 2000000000,
  onScheduleCall,
  onStartTrial
}: OrganizationReadinessScoreProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  const benchmarks = INDUSTRY_BENCHMARKS[industry];
  
  // Calculate score only once when component mounts or industry changes
  const currentScore = useMemo(() => {
    return Math.max(15, benchmarks.avgReadinessScore - 8 + Math.floor(Math.random() * 10));
  }, [benchmarks.avgReadinessScore]);
  
  const scoreGap = benchmarks.topQuartileScore - currentScore;
  
  const riskExposure = Math.round(
    (annualRevenue * 0.03) * 
    (scoreGap / 100) * 
    benchmarks.riskMultiplier
  );
  
  const executiveTimeWasted = Math.round(
    benchmarks.avgResponseTime * 
    benchmarks.typicalEvents * 
    (100 - currentScore) / 100 * 
    12
  );
  
  useEffect(() => {
    if (!isAnimating) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = currentScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= currentScore) {
        setDisplayedScore(currentScore);
        setIsAnimating(false);
        setTimeout(() => setShowDetails(true), 500);
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [currentScore, isAnimating]);
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 30) return 'text-orange-400';
    return 'text-red-400';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };
  
  const readinessMetrics: ReadinessMetric[] = [
    {
      name: 'Playbook Coverage',
      currentScore: Math.round(currentScore * 0.7),
      industryAverage: benchmarks.avgReadinessScore,
      topPerformers: benchmarks.topQuartileScore,
      icon: BookOpen,
      description: 'Percentage of critical scenarios with prepared playbooks'
    },
    {
      name: 'Coordination Speed',
      currentScore: Math.round(currentScore * 0.6),
      industryAverage: benchmarks.avgReadinessScore - 5,
      topPerformers: benchmarks.topQuartileScore - 5,
      icon: Zap,
      description: 'Ability to align stakeholders in minutes vs hours'
    },
    {
      name: 'Signal Detection',
      currentScore: Math.round(currentScore * 0.5),
      industryAverage: benchmarks.avgReadinessScore - 10,
      topPerformers: benchmarks.topQuartileScore - 8,
      icon: Radio,
      description: 'Early warning detection before events become crises'
    },
    {
      name: 'Resource Staging',
      currentScore: Math.round(currentScore * 0.65),
      industryAverage: benchmarks.avgReadinessScore - 8,
      topPerformers: benchmarks.topQuartileScore - 6,
      icon: Users,
      description: 'Pre-approved budgets and pre-assigned stakeholders'
    },
  ];
  
  const transformationTimeline: TransformationMilestone[] = [
    {
      day: 7,
      title: 'Core Playbooks Active',
      description: 'Top 10 critical scenarios customized and stakeholders assigned',
      impact: '40% risk reduction on priority scenarios'
    },
    {
      day: 30,
      title: 'Signal Network Live',
      description: 'AI monitoring active across 16 intelligence categories',
      impact: '47-minute early warning advantage'
    },
    {
      day: 60,
      title: 'Full Coordination',
      description: 'Enterprise integrations connected, drill system operational',
      impact: '12-minute response capability achieved'
    },
    {
      day: 90,
      title: 'Learning Loop Active',
      description: 'Institutional memory capturing, playbooks self-improving',
      impact: 'Continuous readiness optimization'
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-8" data-testid="readiness-score-container">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="bg-blue-600 text-white mb-4 px-4 py-1">
            Organizational Readiness Assessment
          </Badge>
          <h2 className="text-3xl font-bold text-white mb-2">
            {companyName} Readiness Profile
          </h2>
          <p className="text-slate-400">
            Based on {INDUSTRY_LABELS[industry]} industry benchmarks
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="relative inline-block mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-slate-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${(displayedScore / 100) * 352} 352`}
                    strokeLinecap="round"
                    className={getScoreColor(displayedScore).replace('text-', 'stroke-').replace('-400', '-500')}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(displayedScore)}`}>
                    {displayedScore}%
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Current Readiness</h3>
              <p className="text-slate-400 text-sm">
                Industry average: {benchmarks.avgReadinessScore}%
              </p>
              <p className="text-slate-400 text-sm">
                Top performers: {benchmarks.topQuartileScore}%
              </p>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 md:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 mb-1">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">Annual Risk Exposure</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(riskExposure)}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Based on {scoreGap}% readiness gap
                  </p>
                </div>
                
                <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
                  <div className="flex items-center gap-2 text-orange-400 mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Executive Hours Wasted</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{executiveTimeWasted} hrs/year</p>
                  <p className="text-xs text-slate-400 mt-1">
                    On uncoordinated responses
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300 font-medium">Your Position vs Industry</span>
                  <span className="text-slate-400 text-sm">
                    {currentScore < benchmarks.avgReadinessScore ? 'Below Average' : 'Above Average'}
                  </span>
                </div>
                <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${getProgressColor(currentScore)} transition-all duration-1000`}
                    style={{ width: `${currentScore}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-yellow-400"
                    style={{ left: `${benchmarks.avgReadinessScore}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-green-400"
                    style={{ left: `${benchmarks.topQuartileScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>0%</span>
                  <span className="text-yellow-400">Industry Avg ({benchmarks.avgReadinessScore}%)</span>
                  <span className="text-green-400">Top Quartile ({benchmarks.topQuartileScore}%)</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {showDetails && (
          <div className="animate-in fade-in slide-in-from-bottom duration-500">
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Capability Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {readinessMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-400" />
                            <span className="text-white font-medium">{metric.name}</span>
                          </div>
                          <span className={getScoreColor(metric.currentScore)}>
                            {metric.currentScore}%
                          </span>
                        </div>
                        <Progress 
                          value={metric.currentScore} 
                          className="h-2 bg-slate-700"
                        />
                        <p className="text-xs text-slate-500">{metric.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  90-Day Transformation Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700" />
                  
                  <div className="space-y-6">
                    {transformationTimeline.map((milestone, index) => (
                      <div key={index} className="relative flex gap-6 pl-12">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 bg-slate-900/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{milestone.title}</h4>
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              Day {milestone.day}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{milestone.description}</p>
                          <p className="text-green-400 text-sm font-medium">{milestone.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-900/50 to-blue-800/30 border-blue-500/30">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Close the {scoreGap}% Gap
                    </h3>
                    <p className="text-slate-300">
                      Join {INDUSTRY_LABELS[industry]} leaders achieving {benchmarks.topQuartileScore}%+ readiness.
                      <br />
                      <span className="text-blue-400 font-medium">
                        First playbook live in under 3 weeks.
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {onStartTrial && (
                      <Button 
                        variant="outline"
                        size="lg"
                        onClick={onStartTrial}
                        className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        data-testid="button-start-trial"
                      >
                        Start Free Trial
                      </Button>
                    )}
                    <Button 
                      size="lg"
                      onClick={onScheduleCall}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="button-schedule-call"
                    >
                      Schedule Strategy Call
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizationReadinessScore;
