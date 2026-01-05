import { useDemoController } from '@/contexts/DemoController';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Users,
  MessageSquare,
  Shield,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ComparisonMetric {
  traditional: {
    value: string;
    sublabel: string;
    trend: 'danger' | 'warning';
  };
  m: {
    value: string;
    sublabel: string;
    trend: 'success';
  };
}

interface StepData {
  title: string;
  traditionalState: string;
  mState: string;
  metrics: ComparisonMetric[];
  executivePressure: {
    traditional: string[];
    m: string[];
  };
}

const stepData: Record<number, StepData> = {
  0: {
    title: 'Signal Detection',
    traditionalState: 'Unaware - Crisis brewing',
    mState: 'Alert triggered - AI detected',
    metrics: [
      {
        traditional: { value: '0 hours', sublabel: 'No awareness yet', trend: 'danger' },
        m: { value: '2 min', sublabel: 'Threat identified', trend: 'success' }
      },
      {
        traditional: { value: '$0', sublabel: 'Unknown risk exposure', trend: 'danger' },
        m: { value: '$50M', sublabel: 'Risk quantified', trend: 'success' }
      }
    ],
    executivePressure: {
      traditional: [
        '❌ Leadership unaware of competitive threat',
        '❌ No crisis protocols activated',
        '❌ Competitors gaining advantage silently'
      ],
      m: [
        '✅ CEO notified instantly',
        '✅ War room protocol ready',
        '✅ 72-hour head start vs competitors'
      ]
    }
  },
  1: {
    title: 'Trigger Activation',
    traditionalState: 'Day 1 - Teams scrambling',
    mState: '8 min - Response launched',
    metrics: [
      {
        traditional: { value: '24 hours', sublabel: 'To assemble team', trend: 'danger' },
        m: { value: '8 min', sublabel: 'Team assembled', trend: 'success' }
      },
      {
        traditional: { value: '$847K', sublabel: 'Revenue bleeding daily', trend: 'danger' },
        m: { value: '$0', sublabel: 'Losses prevented', trend: 'success' }
      },
      {
        traditional: { value: '0%', sublabel: 'Plan completion', trend: 'danger' },
        m: { value: '100%', sublabel: 'Playbook activated', trend: 'success' }
      }
    ],
    executivePressure: {
      traditional: [
        '❌ Board calling for emergency session',
        '❌ No clear response plan yet',
        '❌ Media starting to notice',
        '❌ Customer inquiries spiking'
      ],
      m: [
        '✅ Board briefed with action plan',
        '✅ 47 stakeholders coordinated',
        '✅ PR strategy deployed',
        '✅ Customer comms ready'
      ]
    }
  },
  2: {
    title: 'Scenario Planning',
    traditionalState: 'Day 2 - Still planning',
    mState: '10 min - Strategy set',
    metrics: [
      {
        traditional: { value: '48 hours', sublabel: 'To create plan', trend: 'danger' },
        m: { value: '10 min', sublabel: 'Strategy deployed', trend: 'success' }
      },
      {
        traditional: { value: '2.7%', sublabel: 'Market share lost', trend: 'danger' },
        m: { value: '0%', sublabel: 'Position protected', trend: 'success' }
      },
      {
        traditional: { value: '94 hrs', sublabel: 'Executive time wasted', trend: 'danger' },
        m: { value: '2 hrs', sublabel: 'Executive oversight', trend: 'success' }
      }
    ],
    executivePressure: {
      traditional: [
        '❌ Investors demanding answers',
        '❌ Strategy still being debated',
        '❌ Competitors announced response',
        '❌ Stock price dropping'
      ],
      m: [
        '✅ Investors briefed and confident',
        '✅ 3 strategic pathways mapped',
        '✅ Ahead of competitor response',
        '✅ Market confidence maintained'
      ]
    }
  },
  3: {
    title: 'Crisis Response',
    traditionalState: 'Day 3 - Executing slowly',
    mState: '11 min - Fully coordinated',
    metrics: [
      {
        traditional: { value: '72 hours', sublabel: 'Response time', trend: 'danger' },
        m: { value: '11 min', sublabel: 'Full deployment', trend: 'success' }
      },
      {
        traditional: { value: '$2.5M', sublabel: 'Lost revenue', trend: 'danger' },
        m: { value: '$2.5M', sublabel: 'Revenue protected', trend: 'success' }
      },
      {
        traditional: { value: '23%', sublabel: 'Employee confidence', trend: 'danger' },
        m: { value: '94%', sublabel: 'Team confidence', trend: 'success' }
      }
    ],
    executivePressure: {
      traditional: [
        '❌ Reputation damage accelerating',
        '❌ Key employees nervous',
        '❌ Analyst downgrades expected',
        '❌ Crisis fatigue setting in'
      ],
      m: [
        '✅ Reputation intact',
        '✅ Team morale high',
        '✅ Analyst confidence strong',
        '✅ Leadership viewed as decisive'
      ]
    }
  },
  4: {
    title: 'Intelligence Coordination',
    traditionalState: 'Day 3 - Data gaps remain',
    mState: '11.5 min - Full visibility',
    metrics: [
      {
        traditional: { value: '37%', sublabel: 'Information complete', trend: 'danger' },
        m: { value: '100%', sublabel: 'AI-powered intel', trend: 'success' }
      },
      {
        traditional: { value: '8', sublabel: 'Departments siloed', trend: 'danger' },
        m: { value: '1', sublabel: 'Unified command center', trend: 'success' }
      }
    ],
    executivePressure: {
      traditional: [
        '❌ Still missing critical data',
        '❌ Teams working in silos',
        '❌ Duplicate effort waste',
        '❌ Decision delays continue'
      ],
      m: [
        '✅ Complete intelligence picture',
        '✅ Cross-functional coordination',
        '✅ AI insights delivered',
        '✅ Confident decision-making'
      ]
    }
  },
  5: {
    title: 'Resolution & Results',
    traditionalState: 'Day 3 - CRISIS UNRESOLVED',
    mState: '12 min - CRISIS RESOLVED ✓',
    metrics: [
      {
        traditional: { value: '72+ hrs', sublabel: 'Still responding', trend: 'danger' },
        m: { value: '12 min', sublabel: 'Crisis resolved', trend: 'success' }
      },
      {
        traditional: { value: '$2.5M', sublabel: 'Revenue lost', trend: 'danger' },
        m: { value: '$2.5M', sublabel: 'Revenue saved', trend: 'success' }
      },
      {
        traditional: { value: '141 hrs', sublabel: 'Executive time burned', trend: 'danger' },
        m: { value: '3 hrs', sublabel: 'Strategic oversight', trend: 'success' }
      }
    ],
    executivePressure: {
      traditional: [
        '❌ Crisis continues into next week',
        '❌ Permanent reputation damage',
        '❌ Board confidence shaken',
        '❌ "How did this happen?" questions'
      ],
      m: [
        '✅ Crisis contained and resolved',
        '✅ Reputation as decisive leader',
        '✅ Board impressed with response',
        '✅ "How did we do this so fast?" praise'
      ]
    }
  }
};

export function SplitScreenComparison() {
  const { state } = useDemoController();
  const [location] = useLocation();
  const [show, setShow] = useState(false);
  
  // Use currentExecutiveStep for Executive Demo, currentScene for Hybrid Demo
  const currentStep = location === '/executive-demo' 
    ? state.currentExecutiveStep 
    : Math.min(state.currentScene, 5); // Cap at 5 since we have 6 steps (0-5)
  
  const data = stepData[currentStep] || stepData[0];

  useEffect(() => {
    // Only show split screen on demo pages AND when demo is active
    const isDemoPage = location === '/executive-demo' || location === '/hybrid-demo';
    
    // Show if on Executive Demo page AND user has advanced past step 0
    // OR if on Hybrid Demo page AND demo is active
    const shouldShow = (location === '/executive-demo' && currentStep > 0) ||
                       (location === '/hybrid-demo' && state.isActive);
    
    if (isDemoPage && shouldShow) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [currentStep, location, state.isActive, state.currentScene]);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-in slide-in-from-bottom duration-700 h-[40vh]">
      <Card className="rounded-t-xl rounded-b-none border-t-2 border-x-0 border-b-0 border-blue-500/50 bg-gray-950/98 backdrop-blur-xl shadow-2xl h-full overflow-y-auto">
        <div className="grid grid-cols-2 divide-x divide-gray-700">
          {/* TRADITIONAL SIDE - PAIN */}
          <div className="p-6 bg-gradient-to-br from-red-950/40 to-orange-950/40">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="bg-red-600/20 text-red-300 border-red-500/50">
                    Traditional Response
                  </Badge>
                  <h3 className="text-lg font-bold text-red-100 mt-2">{data.traditionalState}</h3>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400 animate-pulse" />
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                {data.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-black/30 rounded-lg p-3 border border-red-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-red-100">{metric.traditional.value}</p>
                        <p className="text-xs text-red-300">{metric.traditional.sublabel}</p>
                      </div>
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Executive Pressure */}
              <div className="bg-red-950/30 rounded-lg p-3 border border-red-500/30">
                <p className="text-xs font-semibold text-red-300 mb-2">Executive Pressure</p>
                <div className="space-y-1">
                  {data.executivePressure.traditional.map((item, idx) => (
                    <p key={idx} className="text-xs text-red-200/90">{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* M SIDE - POWER */}
          <div className="p-6 bg-gradient-to-br from-blue-950/40 to-teal-950/40">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                    M Response
                  </Badge>
                  <h3 className="text-lg font-bold text-blue-100 mt-2">{data.mState}</h3>
                </div>
                {currentStep === 5 ? (
                  <CheckCircle className="h-8 w-8 text-green-400 animate-pulse" />
                ) : (
                  <Zap className="h-8 w-8 text-blue-400 animate-pulse" />
                )}
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                {data.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-black/30 rounded-lg p-3 border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-100">{metric.m.value}</p>
                        <p className="text-xs text-blue-300">{metric.m.sublabel}</p>
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Executive Confidence */}
              <div className="bg-blue-950/30 rounded-lg p-3 border border-blue-500/30">
                <p className="text-xs font-semibold text-blue-300 mb-2">Executive Confidence</p>
                <div className="space-y-1">
                  {data.executivePressure.m.map((item, idx) => (
                    <p key={idx} className="text-xs text-blue-200/90">{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="px-6 py-3 bg-gray-900/50 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Crisis Response Progress: {data.title}</p>
            <p className="text-xs font-mono text-gray-400">Step {currentStep + 1} / 6</p>
          </div>
          <Progress value={((currentStep + 1) / 6) * 100} className="h-1" />
        </div>
      </Card>
    </div>
  );
}
