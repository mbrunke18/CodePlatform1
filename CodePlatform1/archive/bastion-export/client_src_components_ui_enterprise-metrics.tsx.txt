import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  PieChart, 
  Target, 
  Zap,
  Brain,
  Users,
  Shield
} from 'lucide-react';

interface EnterpriseMetric {
  id: string;
  category: string;
  name: string;
  value: number;
  displayValue: string;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  benchmarkPercentile: number;
  confidence: number;
  lastUpdate: Date;
  metadata: Record<string, any>;
}

interface LiveMetricsProps {
  organizationId?: string;
  className?: string;
}

export function LiveEnterpriseMetrics({ organizationId = "demo", className = "" }: LiveMetricsProps) {
  const [metrics, setMetrics] = useState<EnterpriseMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/pulse/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organizationId })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.metrics) {
            const enterpriseMetrics: EnterpriseMetric[] = data.metrics.map((m: any) => ({
              id: m.id,
              category: m.category,
              name: m.metricName,
              value: parseFloat(m.value),
              displayValue: m.value,
              unit: m.unit,
              change: Math.random() * 5 - 2.5, // Simulated change for demo
              trend: Math.random() > 0.3 ? 'up' : 'down',
              benchmarkPercentile: m.metadata?.benchmarkPercentile || 85,
              confidence: m.metadata?.confidence || 0.9,
              lastUpdate: new Date(m.timestamp),
              metadata: m.metadata || {}
            }));
            setMetrics(enterpriseMetrics);
            setLastUpdate(new Date());
          }
        }
      } catch (error) {
        console.error('Error fetching enterprise metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [organizationId]);

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'performance': return <BarChart3 className="w-5 h-5" />;
      case 'productivity': return <TrendingUp className="w-5 h-5" />;
      case 'innovation': return <Zap className="w-5 h-5" />;
      case 'culture': return <Users className="w-5 h-5" />;
      case 'strategy': return <Target className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getColorByCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'performance': return { bg: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400' };
      case 'productivity': return { bg: 'from-green-500/20 to-emerald-500/20', text: 'text-green-400' };
      case 'innovation': return { bg: 'from-yellow-500/20 to-orange-500/20', text: 'text-yellow-400' };
      case 'culture': return { bg: 'from-purple-500/20 to-indigo-500/20', text: 'text-purple-400' };
      case 'strategy': return { bg: 'from-red-500/20 to-pink-500/20', text: 'text-red-400' };
      default: return { bg: 'from-gray-500/20 to-slate-500/20', text: 'text-gray-400' };
    }
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-black/40 border-gray-700/50 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-600/50 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-600/50 rounded" />
                  <div className="h-3 w-16 bg-gray-600/50 rounded" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-8 w-20 bg-gray-600/50 rounded" />
                <div className="h-2 w-full bg-gray-600/50 rounded" />
                <div className="h-3 w-32 bg-gray-600/50 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const colors = getColorByCategory(metric.category);
          const icon = getIcon(metric.category);
          
          return (
            <Card key={metric.id} className="bg-black/40 border-gray-700/50 backdrop-blur-sm hover:bg-black/60 transition-all duration-500 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${colors.bg} group-hover:scale-105 transition-transform duration-300`}>
                    <div className={colors.text}>
                      {icon}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-yellow-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-400' : 
                        metric.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-white text-lg">{metric.name}</h3>
                  
                  <div className={`text-3xl font-bold ${colors.text} mb-2`}>
                    {metric.displayValue}
                    <span className="text-sm text-gray-400 font-normal ml-2">{metric.unit}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Benchmark Percentile</span>
                      <span className="text-gray-300">{metric.benchmarkPercentile}th</span>
                    </div>
                    <Progress 
                      value={metric.benchmarkPercentile} 
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
                    <Badge variant="outline" className={`${colors.text} border-gray-600/50 text-xs`}>
                      {metric.category}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      Confidence: {(metric.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Last Update Info */}
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center">
          <Activity className="w-4 h-4 mr-2 text-green-400" />
          Live Metrics
        </div>
        <div className="w-1 h-1 bg-gray-600 rounded-full" />
        <div>Last updated: {lastUpdate.toLocaleTimeString()}</div>
        <div className="w-1 h-1 bg-gray-600 rounded-full" />
        <div className="flex items-center">
          <Brain className="w-4 h-4 mr-2 text-purple-400" />
          AI Generated
        </div>
      </div>
    </div>
  );
}