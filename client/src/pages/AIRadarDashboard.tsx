import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  CheckCircle, 
  Radar,
  Shield,
  Eye,
  Zap,
  ArrowRight,
  Radio,
  Target,
  DollarSign,
  Users,
  Globe,
  Building2,
  BarChart3,
  Settings
} from 'lucide-react';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';

export default function AIRadarDashboard() {
  const [, setLocation] = useLocation();
  const [radarAngle, setRadarAngle] = useState(0);
  const [scanningCategory, setScanningCategory] = useState(0);

  const { data: triggersData } = useQuery<any[]>({
    queryKey: ['/api/triggers'],
  });

  const { data: alertsData } = useQuery<any[]>({
    queryKey: ['/api/strategic-alerts'],
  });

  const { data: weakSignalsData } = useQuery<any[]>({
    queryKey: ['/api/dynamic-strategy/weak-signals'],
    refetchInterval: 30000,
  });

  const { data: dynamicStatus } = useQuery<any>({
    queryKey: ['/api/dynamic-strategy/status'],
    refetchInterval: 10000,
  });

  const triggers = triggersData ?? [];
  const alerts = alertsData ?? [];
  const weakSignals = weakSignalsData ?? [];
  const activeTriggers = triggers.filter((t: any) => t.currentStatus === 'red' || t.currentStatus === 'yellow');
  const criticalTriggers = triggers.filter((t: any) => t.currentStatus === 'red');
  const activeAlerts = alerts.filter((a: any) => a.status === 'active');
  const totalDataPoints = SIGNAL_CATEGORIES.reduce((acc, cat) => acc + cat.dataPoints.length, 0);

  // Radar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Cycle through categories for visual scanning effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanningCategory(prev => (prev + 1) % SIGNAL_CATEGORIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentCategory = SIGNAL_CATEGORIES[scanningCategory];

  return (
    <PageLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="page-title">
              <div className="relative">
                <Radar className="h-10 w-10 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              Threat Radar
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time AI monitoring across {SIGNAL_CATEGORIES.length} signal categories and {totalDataPoints} data points
            </p>
          </div>
          <Button onClick={() => setLocation('/signal-intelligence')} data-testid="button-configure-signals">
            <Settings className="h-4 w-4 mr-2" />
            Configure Signals
          </Button>
        </div>

        {/* Live Status Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">LIVE MONITORING</span>
              </div>
              <div className="text-sm text-slate-400">
                Now scanning: <span className="text-blue-400 font-medium">{currentCategory?.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-slate-400">Active monitors:</span>
                <span className="ml-2 font-mono text-green-400">{triggers.length}</span>
              </div>
              <div>
                <span className="text-slate-400">Weak signals:</span>
                <span className="ml-2 font-mono text-amber-400">{weakSignals.length}</span>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>
                <span className="ml-2 font-mono text-blue-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Visualization */}
          <Card className="lg:col-span-1 bg-slate-950 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Signal Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-square max-w-[300px] mx-auto">
                {/* Radar circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-slate-700" />
                  <div className="absolute w-3/4 h-3/4 rounded-full border border-slate-700" />
                  <div className="absolute w-1/2 h-1/2 rounded-full border border-slate-700" />
                  <div className="absolute w-1/4 h-1/4 rounded-full border border-slate-700" />
                </div>
                
                {/* Cross lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-slate-700" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-full bg-slate-700" />
                </div>
                
                {/* Radar sweep */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${radarAngle}deg)` }}
                >
                  <div 
                    className="w-1/2 h-1 origin-left"
                    style={{
                      background: 'linear-gradient(90deg, rgba(34,197,94,0.8) 0%, rgba(34,197,94,0) 100%)'
                    }}
                  />
                </div>
                
                {/* Sweep trail */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ transform: `rotate(${radarAngle}deg)` }}
                >
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from ${radarAngle}deg, rgba(34,197,94,0.15) 0deg, transparent 60deg)`
                    }}
                  />
                </div>

                {/* Signal blips */}
                {activeTriggers.map((trigger: any, idx: number) => {
                  const angle = (idx * 137.5) % 360;
                  const distance = 30 + (idx % 3) * 25;
                  const x = Math.cos(angle * Math.PI / 180) * distance;
                  const y = Math.sin(angle * Math.PI / 180) * distance;
                  return (
                    <div
                      key={trigger.id}
                      className={`absolute w-3 h-3 rounded-full ${
                        trigger.currentStatus === 'red' ? 'bg-red-500' : 'bg-amber-500'
                      } animate-pulse`}
                      style={{
                        left: `calc(50% + ${x}%)`,
                        top: `calc(50% + ${y}%)`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      title={trigger.name}
                    />
                  );
                })}

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex justify-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  Critical
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  Warning
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Normal
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Cards */}
          <div className="lg:col-span-2 space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className={`${criticalTriggers.length > 0 ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-green-500 bg-green-50 dark:bg-green-950/20'}`} data-testid="card-threat-level">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Threat Level</p>
                      <p className={`text-2xl font-bold ${criticalTriggers.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {criticalTriggers.length > 0 ? 'ELEVATED' : 'NORMAL'}
                      </p>
                    </div>
                    <Shield className={`h-8 w-8 ${criticalTriggers.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-active-monitors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Monitors</p>
                      <p className="text-2xl font-bold">{triggers.length}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-signals-today">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Weak Signals</p>
                      <p className="text-2xl font-bold">{weakSignals.length}</p>
                    </div>
                    <Radio className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-response-time">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Response</p>
                      <p className="text-2xl font-bold text-green-600">12m</p>
                    </div>
                    <Zap className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Threats Panel */}
            <Card data-testid="card-active-threats">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Active Threat Indicators
                  </CardTitle>
                  <Badge variant={activeTriggers.length > 0 ? "destructive" : "secondary"}>
                    {activeTriggers.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {activeTriggers.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
                    <p className="font-medium">All Clear</p>
                    <p className="text-sm">No elevated threats detected across {triggers.length} active monitors</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTriggers.slice(0, 5).map((trigger: any) => {
                      const category = SIGNAL_CATEGORIES.find(c => c.id === trigger.category);
                      return (
                        <div 
                          key={trigger.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            trigger.currentStatus === 'red' 
                              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                              : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                          }`}
                          data-testid={`threat-${trigger.id}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${
                            trigger.currentStatus === 'red' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium">{trigger.name}</p>
                            <p className="text-xs text-muted-foreground">{category?.name || trigger.category}</p>
                          </div>
                          <Badge variant={trigger.currentStatus === 'red' ? 'destructive' : 'default'}>
                            {trigger.currentStatus === 'red' ? 'Critical' : 'Warning'}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => setLocation('/signal-intelligence')}>
                            View
                          </Button>
                        </div>
                      );
                    })}
                    {activeTriggers.length > 5 && (
                      <Button variant="ghost" className="w-full" onClick={() => setLocation('/signal-intelligence')}>
                        View all {activeTriggers.length} active threats
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Signal Categories Being Monitored */}
        <Card data-testid="card-signal-coverage">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Signal Coverage
                </CardTitle>
                <CardDescription>
                  AI continuously monitors {SIGNAL_CATEGORIES.length} categories with {totalDataPoints} data points
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setLocation('/signal-intelligence')}>
                Configure Triggers
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {SIGNAL_CATEGORIES.slice(0, 16).map((category, idx) => {
                const isScanning = idx === scanningCategory;
                const hasTrigger = triggers.some((t: any) => t.category === category.id);
                const hasAlert = triggers.some((t: any) => t.category === category.id && (t.currentStatus === 'red' || t.currentStatus === 'yellow'));
                
                return (
                  <div 
                    key={category.id}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer hover:border-blue-400 ${
                      isScanning ? 'border-green-500 bg-green-50 dark:bg-green-950/20 ring-2 ring-green-500/50' :
                      hasAlert ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/20' :
                      hasTrigger ? 'border-blue-300 bg-blue-50 dark:bg-blue-950/20' :
                      'border-slate-200 dark:border-slate-700'
                    }`}
                    onClick={() => setLocation('/signal-intelligence')}
                    data-testid={`category-${category.id}`}
                  >
                    <div 
                      className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon === 'TrendingUp' && <TrendingUp className="h-4 w-4" style={{ color: category.color }} />}
                      {category.icon === 'Users' && <Users className="h-4 w-4" style={{ color: category.color }} />}
                      {category.icon === 'DollarSign' && <DollarSign className="h-4 w-4" style={{ color: category.color }} />}
                      {category.icon === 'Globe' && <Globe className="h-4 w-4" style={{ color: category.color }} />}
                      {category.icon === 'Building2' && <Building2 className="h-4 w-4" style={{ color: category.color }} />}
                      {category.icon === 'Shield' && <Shield className="h-4 w-4" style={{ color: category.color }} />}
                      {category.icon === 'Target' && <Target className="h-4 w-4" style={{ color: category.color }} />}
                      {category.icon === 'Activity' && <Activity className="h-4 w-4" style={{ color: category.color }} />}
                      {!['TrendingUp', 'Users', 'DollarSign', 'Globe', 'Building2', 'Shield', 'Target', 'Activity'].includes(category.icon) && 
                        <Radio className="h-4 w-4" style={{ color: category.color }} />
                      }
                    </div>
                    <p className="text-xs font-medium truncate">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.dataPoints.length} signals</p>
                    {isScanning && (
                      <Badge className="mt-1 text-[10px] bg-green-500">Scanning</Badge>
                    )}
                    {hasAlert && !isScanning && (
                      <Badge className="mt-1 text-[10px]" variant="destructive">Alert</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="card-live-feed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Recent Activity
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {(weakSignals.length === 0 && activeAlerts.length === 0 && activeTriggers.length === 0) ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Radio className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm">Monitoring for signals...</p>
                    <p className="text-xs mt-1">No recent activity detected</p>
                  </div>
                ) : (
                  <>
                    {activeTriggers.slice(0, 3).map((trigger: any) => (
                      <div 
                        key={`trigger-${trigger.id}`}
                        className={`flex items-center gap-3 p-2 rounded text-sm ${
                          trigger.currentStatus === 'red' 
                            ? 'bg-red-50 dark:bg-red-950/30' 
                            : 'bg-amber-50 dark:bg-amber-950/30'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          trigger.currentStatus === 'red' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        <div className="flex-1">
                          <span className="font-medium">{trigger.name}</span>
                          <span className="text-muted-foreground"> · Trigger {trigger.currentStatus === 'red' ? 'Critical' : 'Warning'}</span>
                        </div>
                      </div>
                    ))}
                    {weakSignals.slice(0, 3).map((signal: any) => (
                      <div 
                        key={`weak-${signal.id}`}
                        className="flex items-center gap-3 p-2 rounded bg-purple-50 dark:bg-purple-950/30 text-sm"
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <div className="flex-1">
                          <span className="font-medium">{signal.title || 'Weak Signal'}</span>
                          <span className="text-muted-foreground"> · Early indicator</span>
                        </div>
                      </div>
                    ))}
                    {activeAlerts.slice(0, 3).map((alert: any) => (
                      <div 
                        key={`alert-${alert.id}`}
                        className="flex items-center gap-3 p-2 rounded bg-blue-50 dark:bg-blue-950/30 text-sm"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <span className="font-medium">{alert.title}</span>
                          <span className="text-muted-foreground"> · Strategic Alert</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Summary */}
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20" data-testid="card-value-protected">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Shield className="h-5 w-5" />
                Monitoring Summary
              </CardTitle>
              <CardDescription>
                Real-time intelligence coverage and readiness status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-600">
                    {dynamicStatus?.readinessScore?.toFixed(1) || '—'}%
                  </p>
                  <p className="text-xs text-muted-foreground">Readiness Score</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{totalDataPoints}</p>
                  <p className="text-xs text-muted-foreground">Data Points</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Triggers</span>
                  <span className="font-medium">{triggers.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Elevated Alerts</span>
                  <span className={`font-medium ${activeTriggers.length > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    {activeTriggers.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Weak Signals Detected</span>
                  <span className="font-medium">{weakSignals.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Signal Categories</span>
                  <span className="font-medium">{SIGNAL_CATEGORIES.length}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setLocation('/analytics')}
              >
                View Full Analytics
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        {triggers.length === 0 && (
          <Card className="border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20" data-testid="card-setup-cta">
            <CardContent className="py-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Start Monitoring Your Strategic Signals</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Configure triggers across {SIGNAL_CATEGORIES.length} signal categories to detect threats and opportunities before they impact your business.
              </p>
              <Button size="lg" onClick={() => setLocation('/signal-intelligence')} data-testid="button-setup-triggers">
                <Settings className="h-4 w-4 mr-2" />
                Configure Signal Triggers
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
