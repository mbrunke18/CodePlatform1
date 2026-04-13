import { useState, useEffect } from 'react';
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
import PageLayout from '@/components/layout/PageLayout';

export default function AIRadarDashboard({ embedded }: { embedded?: boolean }) {
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
    <PageLayout embedded={embedded}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="page-title">
              <div className="relative">
                <Radar className="h-10 w-10 text-[#0A0F2E]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#2B8A6E] animate-pulse" />
              </div>
              Threat Radar
            </h1>
            <p className="text-[#6B7280] mt-1">
              Real-time signal monitoring across {SIGNAL_CATEGORIES.length} signal categories and {totalDataPoints} data points
            </p>
          </div>
          <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" onClick={() => setLocation('/signal-intelligence')} data-testid="button-configure-signals">
            <Settings className="h-4 w-4 mr-2" />
            Configure Signals
          </Button>
        </div>

        {/* Live Status Bar */}
        <div className="bg-[#0A0F2E] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2B8A6E] animate-pulse" />
                <span className="text-sm font-medium">LIVE MONITORING</span>
              </div>
              <div className="text-sm text-white/80">
                Now scanning: <span className="text-[#C9A84C] font-medium">{currentCategory?.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-white/60">Active monitors:</span>
                <span className="ml-2 font-mono text-[#2B8A6E]">{triggers.length}</span>
              </div>
              <div>
                <span className="text-white/60">Weak signals:</span>
                <span className="ml-2 font-mono text-[#C9A84C]">{weakSignals.length}</span>
              </div>
              <div>
                <span className="text-white/60">Status:</span>
                <span className="ml-2 font-mono text-[#2B8A6E]">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Visualization */}
          <Card className="lg:col-span-1 bg-white border-[#E8E4DC]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#0A0F2E] text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Signal Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-square max-w-[300px] mx-auto">
                {/* Radar circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full border border-[#E8E4DC]" />
                  <div className="absolute w-3/4 h-3/4 border border-[#E8E4DC]" />
                  <div className="absolute w-1/2 h-1/2 border border-[#E8E4DC]" />
                  <div className="absolute w-1/4 h-1/4 border border-[#E8E4DC]" />
                </div>
                
                {/* Cross lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-[#E8E4DC]/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-full bg-[#E8E4DC]/20" />
                </div>
                
                {/* Radar sweep */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${radarAngle}deg)` }}
                >
                  <div 
                    className="w-1/2 h-1 origin-left"
                    style={{
                      background: 'linear-gradient(90deg, #2B8A6E 0%, transparent 100%)'
                    }}
                  />
                </div>
                
                {/* Sweep trail */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ transform: `rotate(${radarAngle}deg)` }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `conic-gradient(from ${radarAngle}deg, rgba(43, 138, 110, 0.15) 0deg, transparent 60deg)`
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
                      className={`absolute w-3 h-3 ${
                        trigger.currentStatus === 'red' ? 'bg-red-500' : 'bg-[#C9A84C]'
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
                  <div className="w-2 h-2 bg-[#2B8A6E]" />
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex justify-center gap-4 text-xs text-[#0A0F2E]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500" />
                  Critical
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#C9A84C]" />
                  Warning
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#2B8A6E]" />
                  Normal
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Cards */}
          <div className="lg:col-span-2 space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className={`${criticalTriggers.length > 0 ? 'border-red-500 bg-red-50' : 'border-[#2B8A6E]/30 bg-[#F8F7F4]'}`} data-testid="card-threat-level">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#6B7280]">Threat Level</p>
                      <p className={`text-2xl font-bold ${criticalTriggers.length > 0 ? 'text-red-700' : 'text-[#2B8A6E]'}`}>
                        {criticalTriggers.length > 0 ? 'ELEVATED' : 'NORMAL'}
                      </p>
                    </div>
                    <Shield className={`h-8 w-8 ${criticalTriggers.length > 0 ? 'text-red-500' : 'text-[#2B8A6E]'}`} />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-active-monitors" className="bg-white border-[#E8E4DC]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#6B7280]">Active Monitors</p>
                      <p className="text-2xl font-bold text-[#0A0F2E]">{triggers.length}</p>
                    </div>
                    <Eye className="h-8 w-8 text-[#0A0F2E] opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-signals-today" className="bg-white border-[#E8E4DC]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#6B7280]">Weak Signals</p>
                      <p className="text-2xl font-bold text-[#0A0F2E]">{weakSignals.length}</p>
                    </div>
                    <Radio className="h-8 w-8 text-[#C9A84C]" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-response-time" className="bg-white border-[#E8E4DC]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#6B7280]">Avg Response</p>
                      <p className="text-2xl font-bold text-[#2B8A6E]">12m</p>
                    </div>
                    <Zap className="h-8 w-8 text-[#C9A84C]" />
                  </div>
                  <Progress value={85} className="h-1 mt-2 [&>div]:bg-[#C9A84C]" />
                </CardContent>
              </Card>
            </div>

            {/* Active Threats Panel */}
            <Card data-testid="card-active-threats" className="bg-white border-[#E8E4DC]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <AlertTriangle className="h-5 w-5 text-[#C9A84C]" />
                    Active Threat Indicators
                  </CardTitle>
                  <Badge className={activeTriggers.length > 0 ? "bg-red-500 text-white" : "bg-[#F8F7F4] text-[#6B7280]"}>
                    {activeTriggers.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {activeTriggers.length === 0 ? (
                  <div className="text-center py-6 text-[#6B7280]">
                    <CheckCircle className="h-10 w-10 mx-auto mb-2 text-[#2B8A6E]" />
                    <p className="font-medium text-[#0A0F2E]">All Clear</p>
                    <p className="text-sm">No elevated threats detected across {triggers.length} active monitors</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTriggers.slice(0, 5).map((trigger: any) => {
                      const category = SIGNAL_CATEGORIES.find(c => c.id === trigger.category);
                      return (
                        <div 
                          key={trigger.id}
                          className={`flex items-center gap-3 p-3 border ${
                            trigger.currentStatus === 'red' 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-[#C9A84C]/5 border-[#C9A84C]/20'
                          }`}
                          data-testid={`threat-${trigger.id}`}
                        >
                          <div className={`w-3 h-3 ${
                            trigger.currentStatus === 'red' ? 'bg-red-500 animate-pulse' : 'bg-[#C9A84C]'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-[#0A0F2E]">{trigger.name}</p>
                            <p className="text-xs text-[#6B7280]">{category?.name || trigger.category}</p>
                          </div>
                          <Badge className={trigger.currentStatus === 'red' ? 'bg-red-500 text-white' : 'bg-[#C9A84C] text-[#0A0F2E]'}>
                            {trigger.currentStatus === 'red' ? 'Critical' : 'Warning'}
                          </Badge>
                          <Button size="sm" variant="outline" className="border-[#E8E4DC] text-[#0A0F2E]" onClick={() => setLocation('/signal-intelligence')}>
                            View
                          </Button>
                        </div>
                      );
                    })}
                    {activeTriggers.length > 5 && (
                      <Button variant="ghost" className="w-full text-[#0A0F2E] hover:bg-[#0A0F2E]/5" onClick={() => setLocation('/signal-intelligence')}>
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
        <Card data-testid="card-signal-coverage" className="bg-white border-[#E8E4DC]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <BarChart3 className="h-5 w-5 text-[#0A0F2E]" />
                  Signal Coverage
                </CardTitle>
                <CardDescription className="text-[#6B7280]">
                  AI continuously monitors {SIGNAL_CATEGORIES.length} categories with {totalDataPoints} data points
                </CardDescription>
              </div>
              <Button variant="outline" className="border-[#0A0F2E] text-[#0A0F2E]" onClick={() => setLocation('/signal-intelligence')}>
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
                    className={`p-3 border text-center transition-all cursor-pointer hover:border-[#0A0F2E] ${
                      isScanning ? 'border-[#2B8A6E] bg-[#2B8A6E]/5 ring-2 ring-[#2B8A6E]/50' :
                      hasAlert ? 'border-red-400 bg-red-50' :
                      hasTrigger ? 'border-[#0A0F2E] bg-[#0A0F2E]/5' :
                      'border-[#E8E4DC] bg-white'
                    }`}
                    onClick={() => setLocation('/signal-intelligence')}
                    data-testid={`category-${category.id}`}
                  >
                    <div 
                      className="w-8 h-8 mx-auto mb-2 flex items-center justify-center text-lg"
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
                    <p className="text-xs font-medium truncate text-[#0A0F2E]">{category.name}</p>
                    <p className="text-xs text-[#6B7280]">{category.dataPoints.length} signals</p>
                    {isScanning && (
                      <Badge className="mt-1 text-xs bg-[#2B8A6E] text-white">Scanning</Badge>
                    )}
                    {hasAlert && !isScanning && (
                      <Badge className="mt-1 text-xs bg-red-500 text-white">Alert</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="card-live-feed" className="bg-white border-[#E8E4DC]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <Activity className="h-5 w-5 text-[#2B8A6E]" />
                Recent Activity
                <div className="w-2 h-2 bg-[#2B8A6E] animate-pulse ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {(weakSignals.length === 0 && activeAlerts.length === 0 && activeTriggers.length === 0) ? (
                  <div className="text-center py-8 text-[#6B7280]">
                    <Radio className="h-8 w-8 mx-auto mb-2 animate-pulse text-[#C9A84C]" />
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
                            ? 'bg-red-50' 
                            : 'bg-[#C9A84C]/10'
                        }`}
                      >
                        <div className={`w-2 h-2 ${
                          trigger.currentStatus === 'red' ? 'bg-red-500' : 'bg-[#C9A84C]'
                        }`} />
                        <div className="flex-1">
                          <span className="font-medium text-[#0A0F2E]">{trigger.name}</span>
                          <span className="text-[#6B7280]"> · Trigger {trigger.currentStatus === 'red' ? 'Critical' : 'Warning'}</span>
                        </div>
                      </div>
                    ))}
                    {weakSignals.slice(0, 3).map((signal: any) => (
                      <div 
                        key={`weak-${signal.id}`}
                        className="flex items-center gap-3 p-2 rounded bg-[#0A0F2E]/5 text-sm"
                      >
                        <div className="w-2 h-2 bg-[#0A0F2E]" />
                        <div className="flex-1">
                          <span className="font-medium text-[#0A0F2E]">{signal.title || 'Weak Signal'}</span>
                          <span className="text-[#6B7280]"> · Early indicator</span>
                        </div>
                      </div>
                    ))}
                    {activeAlerts.slice(0, 3).map((alert: any) => (
                      <div 
                        key={`alert-${alert.id}`}
                        className="flex items-center gap-3 p-2 rounded bg-[#C9A84C]/10 text-sm"
                      >
                        <div className="w-2 h-2 bg-[#C9A84C]" />
                        <div className="flex-1">
                          <span className="font-medium text-[#0A0F2E]">{alert.title}</span>
                          <span className="text-[#6B7280]"> · Strategic Alert</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Summary */}
          <Card className="bg-[#F8F7F4] border-[#E8E4DC]" data-testid="card-value-protected">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <Shield className="h-5 w-5 text-[#2B8A6E]" />
                Monitoring Summary
              </CardTitle>
              <CardDescription className="text-[#6B7280]">
                Real-time intelligence coverage and readiness status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white border border-[#E8E4DC]">
                  <p className="text-3xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {dynamicStatus?.readinessScore?.toFixed(1) || '—'}%
                  </p>
                  <p className="text-xs text-[#6B7280]">Readiness Score</p>
                </div>
                <div className="text-center p-4 bg-white border border-[#E8E4DC]">
                  <p className="text-3xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{totalDataPoints}</p>
                  <p className="text-xs text-[#6B7280]">Data Points</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[#0A0F2E]">
                  <span>Active Triggers</span>
                  <span className="font-medium">{triggers.length}</span>
                </div>
                <div className="flex justify-between text-sm text-[#0A0F2E]">
                  <span>Elevated Alerts</span>
                  <span className={`font-medium ${activeTriggers.length > 0 ? 'text-[#C9A84C]' : 'text-[#2B8A6E]'}`}>
                    {activeTriggers.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#0A0F2E]">
                  <span>Weak Signals Detected</span>
                  <span className="font-medium">{weakSignals.length}</span>
                </div>
                <div className="flex justify-between text-sm text-[#0A0F2E]">
                  <span>Signal Categories</span>
                  <span className="font-medium">{SIGNAL_CATEGORIES.length}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-[#2B8A6E] hover:bg-[#3BAF8A] text-white"
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
          <Card className="border-2 border-dashed border-[#0A0F2E] bg-[#0A0F2E]/5" data-testid="card-setup-cta">
            <CardContent className="py-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-[#0A0F2E]" />
              <h3 className="text-xl font-semibold mb-2 text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Start Monitoring Your Strategic Signals</h3>
              <p className="text-[#6B7280] mb-4 max-w-md mx-auto">
                Configure triggers across {SIGNAL_CATEGORIES.length} signal categories to detect threats and opportunities before they impact your business.
              </p>
              <Button size="lg" className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" onClick={() => setLocation('/signal-intelligence')} data-testid="button-setup-triggers">
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
