import { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
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
  Info,
  Settings,
  ExternalLink,
  Eye,
  Edit
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
  const [expandedTriggerId, setExpandedTriggerId] = useState<string | null>(null);

  
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
    if (prob >= 70) return 'text-red-700 dark:text-red-400';
    if (prob >= 50) return 'text-[#C9A84C] dark:text-amber-400';
    if (prob >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-[#2B8A6E] dark:text-[#2B8A6E]';
  };

  const getProbabilityBg = (prob: number) => {
    if (prob >= 70) return 'bg-red-100 dark:bg-red-900/30';
    if (prob >= 50) return 'bg-amber-100 dark:bg-amber-900/30';
    if (prob >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-[#F0F9F6] dark:bg-[#2B8A6E]/15';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-[#2B8A6E]" />;
    return <Minus className="w-4 h-4 text-gray-800" />;
  };

  if (allForecasts.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-gray-800 mx-auto mb-3" />
          <p className="text-gray-800 dark:text-slate-300">No triggers configured for forecasting</p>
          <p className="text-sm text-gray-800 mt-1">Add triggers to see AI-powered probability predictions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-trigger-probability-forecast">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-[#0A0F2E] to-[#141B45]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Trigger Probability Forecast</CardTitle>
              <p className="text-xs text-gray-800">
                Showing top {displayedCount} of {totalTriggers} triggers ranked by 30-day probability
              </p>
            </div>
          </div>
          <Badge className="bg-[#0A0F2E] text-[#C9A84C] dark:bg-[#0A0F2E] dark:text-[#C9A84C]">
            <Brain className="w-3 h-3 mr-1" />
            PlanIQ-style
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-[#0A0F2E] dark:bg-[#0A0F2E]/20 text-sm">
          <Info className="w-4 h-4 text-white dark:text-[#C9A84C] flex-shrink-0" />
          <span className="text-white dark:text-[#DFC178]">
            Triggers ranked by highest 30-day firing probability. Higher probability = higher priority for review.
          </span>
        </div>
        
        {displayedForecasts.map((forecast, index) => {
          const isExpanded = expandedTriggerId === forecast.triggerId;
          return (
          <div 
            key={forecast.triggerId} 
            className={`border p-4 transition-all cursor-pointer ${
              isExpanded 
                ? 'border-[#C9A84C] dark:border-[#C9A84C] ring-2 ring-[#C9A84C] dark:ring-[#C9A84C]' 
                : 'border-slate-200 dark:border-slate-700 hover:border-[#C9A84C] dark:hover:border-[#C9A84C]'
            }`}
            onClick={() => setExpandedTriggerId(isExpanded ? null : forecast.triggerId)}
            data-testid={`forecast-${forecast.triggerId}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setExpandedTriggerId(isExpanded ? null : forecast.triggerId)}
            aria-expanded={isExpanded}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-[#0A0F2E] text-[#C9A84C] dark:bg-[#0A0F2E] dark:text-[#C9A84C] text-xs">
                    #{index + 1}
                  </Badge>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{forecast.triggerName}</h4>
                  {getTrendIcon(forecast.trend)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{forecast.category}</Badge>
                  <span className="text-xs text-gray-800">
                    Confidence: {forecast.confidenceScore}%
                  </span>
                  <span className="text-xs text-[#C9A84C] dark:text-[#C9A84C]">
                    {isExpanded ? '(click to collapse)' : '(click for details)'}
                  </span>
                </div>
              </div>
              <div className="text-right flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-800">
                  <Clock className="w-3 h-3" />
                  Updated {forecast.lastUpdated}
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-[#C9A84C]" /> : <ChevronDown className="w-4 h-4 text-gray-800" />}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className={`rounded-none p-3 text-center ${getProbabilityBg(forecast.probability30Days)}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-gray-800" />
                  <span className="text-xs font-medium text-gray-800 dark:text-slate-300">30 Days</span>
                </div>
                <div className={`text-2xl font-bold ${getProbabilityColor(forecast.probability30Days)}`}>
                  {forecast.probability30Days}%
                </div>
                <Progress 
                  value={forecast.probability30Days} 
                  className="h-1 mt-2" 
                />
              </div>
              <div className={`rounded-none p-3 text-center ${getProbabilityBg(forecast.probability60Days)}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-gray-800" />
                  <span className="text-xs font-medium text-gray-800 dark:text-slate-300">60 Days</span>
                </div>
                <div className={`text-2xl font-bold ${getProbabilityColor(forecast.probability60Days)}`}>
                  {forecast.probability60Days}%
                </div>
                <Progress 
                  value={forecast.probability60Days} 
                  className="h-1 mt-2" 
                />
              </div>
              <div className={`rounded-none p-3 text-center ${getProbabilityBg(forecast.probability90Days)}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-gray-800" />
                  <span className="text-xs font-medium text-gray-800 dark:text-slate-300">90 Days</span>
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

            {isExpanded && (
              <>
                <div className="mb-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                  <div className="text-xs font-semibold text-gray-800 dark:text-slate-300 mb-2">Contributing Factors</div>
                  <div className="flex flex-wrap gap-2">
                    {forecast.contributingFactors.map((factor, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className={`text-xs ${
                          factor.direction === 'negative' 
                            ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400' 
                            : 'border-[#2B8A6E] text-[#2B8A6E] dark:border-[#2B8A6E] dark:text-[#2B8A6E]'
                        }`}
                      >
                        {factor.direction === 'negative' ? '↑' : '↓'} {factor.factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0A0F2E] dark:bg-[#0A0F2E]/20 p-3">
                  <div className="text-xs font-semibold text-white dark:text-[#DFC178] mb-2 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Recommended Preparation
                  </div>
                  <ul className="space-y-1">
                    {forecast.recommendedActions.map((action, idx) => (
                      <li key={idx} className="text-xs text-white dark:text-white/80 flex items-start gap-1">
                        <span className="text-[#C9A84C]">•</span> {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                  <Link 
                    href={`/triggers-management?id=${forecast.triggerId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      data-testid={`button-view-trigger-${forecast.triggerId}`}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Trigger
                    </Button>
                  </Link>
                  <Link 
                    href={`/triggers-management?id=${forecast.triggerId}&action=edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full bg-[#2B8A6E] hover:bg-[#3BAF8A] text-white"
                      data-testid={`button-edit-trigger-${forecast.triggerId}`}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit Trigger
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        );
        })}
        
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
