import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, TrendingUp, Zap, Target, Clock, Award } from 'lucide-react';

interface DecisionVelocityData {
  velocityScore: number; // 0-100
  averageResponseTime: number; // in minutes
  industryStandard: number; // in minutes
  competitiveAdvantage: number; // in days
  eventsProcessed: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  quarterlyMetrics: {
    totalEvents: number;
    avgDecisionTime: number;
    velocityImprovement: number;
  };
}

export default function DecisionVelocityDashboard({ organizationId }: { organizationId: string }) {
  // Demo data showing Decision Velocity metrics
  const velocityData: DecisionVelocityData = {
    velocityScore: 92,
    averageResponseTime: 12, // 12 minutes
    industryStandard: 4320, // 72 hours = 4320 minutes
    competitiveAdvantage: 5, // 5 days ahead
    eventsProcessed: 47,
    trend: 'up',
    trendPercentage: 23,
    quarterlyMetrics: {
      totalEvents: 142,
      avgDecisionTime: 15,
      velocityImprovement: 85
    }
  };

  const velocityColor = 
    velocityData.velocityScore >= 80 ? 'text-green-600 dark:text-green-400' :
    velocityData.velocityScore >= 60 ? 'text-blue-600 dark:text-blue-400' :
    'text-yellow-600 dark:text-yellow-400';

  const velocityBgColor = 
    velocityData.velocityScore >= 80 ? 'bg-green-100 dark:bg-green-900/20' :
    velocityData.velocityScore >= 60 ? 'bg-blue-100 dark:bg-blue-900/20' :
    'bg-yellow-100 dark:bg-yellow-900/20';

  const timesSaved = Math.floor(velocityData.industryStandard / velocityData.averageResponseTime);

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-lg border-2" data-testid="decision-velocity-dashboard">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                Decision Velocity Dashboard™
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Your competitive advantage metric for Dynamic Strategy execution
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
              Dynamic Strategy
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Velocity Score */}
          <div className={`${velocityBgColor} rounded-xl p-6 text-center`}>
            <div className="flex items-center justify-center gap-3">
              <div className={`text-6xl font-bold ${velocityColor}`} data-testid="velocity-score">
                {velocityData.velocityScore}
              </div>
              <div className="text-left">
                <div className={`text-sm font-medium ${velocityColor}`}>/100</div>
                <Badge variant="default" className="mt-1 bg-green-600">
                  Excellent
                </Badge>
              </div>
            </div>

            {/* Trend */}
            <div className="flex items-center justify-center gap-1 mt-3" data-testid="velocity-trend">
              {velocityData.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <span className={`text-sm font-medium ${velocityData.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {velocityData.trendPercentage}% improvement
              </span>
              <span className="text-xs text-muted-foreground">this quarter</span>
            </div>
          </div>

          {/* Competitive Advantage Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4" data-testid="response-time">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Avg Response Time</span>
              </div>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {velocityData.averageResponseTime} min
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                vs {Math.floor(velocityData.industryStandard / 60)}hr industry standard
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs bg-blue-600/10 text-blue-700 dark:text-blue-300">
                  {timesSaved}x faster
                </Badge>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4" data-testid="competitive-advantage">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Competitive Edge</span>
              </div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {velocityData.competitiveAdvantage} days
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ahead per strategic move
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs bg-green-600/10 text-green-700 dark:text-green-300">
                  Category leader
                </Badge>
              </div>
            </div>
          </div>

          {/* Quarterly Impact */}
          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4" data-testid="quarterly-impact">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Quarterly Impact</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {velocityData.quarterlyMetrics.totalEvents}
                </div>
                <div className="text-xs text-muted-foreground">Strategic events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {velocityData.quarterlyMetrics.avgDecisionTime}m
                </div>
                <div className="text-xs text-muted-foreground">Avg decision time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {velocityData.quarterlyMetrics.velocityImprovement}%
                </div>
                <div className="text-xs text-muted-foreground">Velocity improvement</div>
              </div>
            </div>
          </div>

          {/* Decision Velocity Premium Calculation */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-700" data-testid="velocity-premium">
            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Decision Velocity Premium™
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Your velocity:</span>
                <span className="font-medium">{velocityData.averageResponseTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Competitor velocity:</span>
                <span className="font-medium">{Math.floor(velocityData.industryStandard / 60)} hours</span>
              </div>
              <div className="flex justify-between">
                <span>Your advantage:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{velocityData.competitiveAdvantage} days per move</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span>× {velocityData.eventsProcessed} events this quarter</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{velocityData.competitiveAdvantage * velocityData.eventsProcessed} days total advantage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Board-Ready Messaging */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white" data-testid="board-message">
            <div className="text-sm font-semibold mb-2">Board Presentation Language:</div>
            <div className="text-xs italic">
              "We've operationalized Dynamic Strategy through M. Decision velocity improved {velocityData.quarterlyMetrics.velocityImprovement}%, 
              averaging {velocityData.competitiveAdvantage} days ahead of competitors per strategic initiative. This contributed to our 
              competitive positioning and operational excellence this quarter."
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full" variant="default" data-testid="button-view-detailed-velocity">
            <Target className="h-4 w-4 mr-2" />
            View Detailed Velocity Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
