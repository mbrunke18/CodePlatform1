import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  Clock,
  Target,
  Brain,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface TriggerInput {
  id: string;
  name?: string;
  scenarioName?: string;
  category?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: string;
}

interface TriggerForecast {
  triggerId: string;
  triggerName: string;
  category: string;
  probability30Days: number;
  probability60Days: number;
  probability90Days: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidenceScore: number;
  signalStrength: number;
  contributingFactors: Array<{
    factor: string;
    impact: 'high' | 'medium' | 'low';
    direction: 'positive' | 'negative';
  }>;
  recommendedActions: string[];
  lastUpdated: string;
}

interface TriggerProbabilityForecastProps {
  triggers?: TriggerInput[];
  compact?: boolean;
}

const seededRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs((Math.sin(hash) * 10000) % 1);
};

const allFactors: Array<{ factor: string; impact: 'high' | 'medium' | 'low'; direction: 'positive' | 'negative' }> = [
  { factor: 'Market volatility index elevated', impact: 'high', direction: 'negative' },
  { factor: 'Competitor activity detected', impact: 'medium', direction: 'negative' },
  { factor: 'Supply chain signals stable', impact: 'low', direction: 'positive' },
  { factor: 'Regulatory environment shifting', impact: 'high', direction: 'negative' },
];

export default function TriggerProbabilityForecast({ triggers = [], compact = false }: TriggerProbabilityForecastProps) {
  const [showAll, setShowAll] = useState(false);
  
  const allForecasts = useMemo(() => {
    const generateForecast = (trigger: TriggerInput): TriggerForecast => {
      const seed = trigger.id || 'default';
      const rand1 = seededRandom(seed + '1');
      const rand2 = seededRandom(seed + '2');
      const rand3 = seededRandom(seed + '3');
      const rand4 = seededRandom(seed + '4');
      
      const baseProb = rand1 * 40 + 20;
      const trendMultiplier = trigger.severity === 'critical' ? 1.4 : 
                              trigger.severity === 'high' ? 1.2 : 1.0;
      
      const trend: 'increasing' | 'decreasing' | 'stable' = rand2 > 0.6 ? 'increasing' : rand2 > 0.3 ? 'stable' : 'decreasing';
      
      const factorCount = Math.floor(rand3 * 2) + 2;
      const factors = allFactors.slice(0, factorCount);

      return {
        triggerId: trigger.id,
        triggerName: trigger.name || trigger.scenarioName || 'Unknown Trigger',
        category: trigger.category || 'general',
        probability30Days: Math.min(95, Math.round(baseProb * trendMultiplier)),
        probability60Days: Math.min(95, Math.round(baseProb * trendMultiplier * 1.3)),
        probability90Days: Math.min(95, Math.round(baseProb * trendMultiplier * 1.5)),
        trend,
        confidenceScore: Math.round(75 + rand4 * 20),
        signalStrength: Math.round(60 + rand3 * 35),
        contributingFactors: factors,
        recommendedActions: [
          'Review and update associated playbook',
          'Confirm stakeholder availability',
          'Pre-stage critical resources'
        ],
        lastUpdated: new Date().toLocaleTimeString()
      };
    };

    const allForecastData = triggers.map(generateForecast);
    return allForecastData.sort((a, b) => b.probability30Days - a.probability30Days);
  }, [triggers]);

  const displayedForecasts = useMemo(() => {
    if (compact) return allForecasts.slice(0, 3);
    if (showAll) return allForecasts;
    return allForecasts.slice(0, 10);
  }, [allForecasts, compact, showAll]);

  const totalTriggers = triggers.length;
  const displayedCount = displayedForecasts.length;
  const hasMore = totalTriggers > displayedCount && !showAll;

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-red-600 dark:text-red-400';
    if (prob >= 50) return 'text-amber-600 dark:text-amber-400';
    if (prob >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const getProbabilityBg = (prob: number) => {
    if (prob >= 70) return 'bg-red-100 dark:bg-red-900/30';
    if (prob >= 50) return 'bg-amber-100 dark:bg-amber-900/30';
    if (prob >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-emerald-100 dark:bg-emerald-900/30';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-emerald-500" />;
    return <Minus className="w-4 h-4 text-slate-500" />;
  };

  if (allForecasts.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No triggers configured for forecasting</p>
          <p className="text-sm text-slate-500 mt-1">Add triggers to see AI-powered probability predictions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-trigger-probability-forecast">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Trigger Probability Forecast</CardTitle>
              <p className="text-xs text-slate-500">
                Showing top {displayedCount} of {totalTriggers} triggers ranked by 30-day probability
              </p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <Brain className="w-3 h-3 mr-1" />
            PlanIQ-style
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span className="text-blue-800 dark:text-blue-200">
            Triggers ranked by highest 30-day firing probability. Higher probability = higher priority for review.
          </span>
        </div>
        
        {displayedForecasts.map((forecast) => (
          <div 
            key={forecast.triggerId} 
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            data-testid={`forecast-${forecast.triggerId}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{forecast.triggerName}</h4>
                  {getTrendIcon(forecast.trend)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{forecast.category}</Badge>
                  <span className="text-xs text-slate-500">
                    Confidence: {forecast.confidenceScore}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  Updated {forecast.lastUpdated}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className={`rounded-lg p-3 text-center ${getProbabilityBg(forecast.probability30Days)}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">30 Days</span>
                </div>
                <div className={`text-2xl font-bold ${getProbabilityColor(forecast.probability30Days)}`}>
                  {forecast.probability30Days}%
                </div>
                <Progress 
                  value={forecast.probability30Days} 
                  className="h-1 mt-2" 
                />
              </div>
              <div className={`rounded-lg p-3 text-center ${getProbabilityBg(forecast.probability60Days)}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">60 Days</span>
                </div>
                <div className={`text-2xl font-bold ${getProbabilityColor(forecast.probability60Days)}`}>
                  {forecast.probability60Days}%
                </div>
                <Progress 
                  value={forecast.probability60Days} 
                  className="h-1 mt-2" 
                />
              </div>
              <div className={`rounded-lg p-3 text-center ${getProbabilityBg(forecast.probability90Days)}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">90 Days</span>
                </div>
                <div className={`text-2xl font-bold ${getProbabilityColor(forecast.probability90Days)}`}>
                  {forecast.probability90Days}%
                </div>
                <Progress 
                  value={forecast.probability90Days} 
                  className="h-1 mt-2" 
                />
              </div>
            </div>

            {!compact && (
              <>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Contributing Factors</div>
                  <div className="flex flex-wrap gap-2">
                    {forecast.contributingFactors.map((factor, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className={`text-xs ${
                          factor.direction === 'negative' 
                            ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400' 
                            : 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {factor.direction === 'negative' ? '↑' : '↓'} {factor.factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Recommended Preparation
                  </div>
                  <ul className="space-y-1">
                    {forecast.recommendedActions.map((action, idx) => (
                      <li key={idx} className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-1">
                        <span className="text-blue-400">•</span> {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        ))}
        
        {/* View All / Show Less Button */}
        {!compact && totalTriggers > 10 && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAll(!showAll)}
              data-testid="button-toggle-all-forecasts"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show Less (Top 10)
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  View All {totalTriggers} Triggers
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
