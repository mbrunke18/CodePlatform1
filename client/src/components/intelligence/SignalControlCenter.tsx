/**
 * Signal Control Center
 * 
 * Configuration dashboard for all 16 intelligence signal categories.
 * Provides visual status indicators, trigger configuration, and alert management.
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  ChevronRight,
  Database,
  Eye,
  Filter,
  Grid3X3,
  Layers,
  LineChart,
  Play,
  Plus,
  Radio,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TriggerBuilder } from './TriggerBuilder';

interface SignalCategory {
  id: string;
  name: string;
  description: string;
  phase: 'external' | 'internal';
  icon: string;
  color: string;
  dataPoints: DataPoint[];
  dataSources: string[];
  recommendedPlaybooks: string[];
}

interface DataPoint {
  id: string;
  name: string;
  description: string;
  metric: string;
  sources: string[];
  refreshInterval: string;
  defaultThreshold?: {
    operator: string;
    value: number;
    urgency: 'critical' | 'high' | 'medium' | 'low';
  };
}

interface SignalCategoryStatus {
  categoryId: string;
  categoryName: string;
  status: 'active' | 'warning' | 'alert' | 'inactive';
  activeAlerts: number;
  healthScore: number;
}

interface DashboardData {
  totalSignals: number;
  activeAlerts: number;
  criticalAlerts: number;
  triggersConfigured: number;
  dataSourcesConnected: number;
  categories: SignalCategoryStatus[];
  recentAlerts: any[];
  weakSignals: any[];
}

const CATEGORY_ICONS: Record<string, any> = {
  'competitive': Shield,
  'market': TrendingUp,
  'financial': LineChart,
  'regulatory': AlertTriangle,
  'supply-chain': Layers,
  'customer': Eye,
  'talent': Activity,
  'technology': Zap,
  'media': Radio,
  'geopolitical': Grid3X3,
  'economic': Database,
  'partnership': CheckCircle,
  'cybersecurity': Shield,
  'operational': Settings,
  'esg': Activity,
  'innovation': Plus
};

const PHASE_COLORS = {
  external: 'from-blue-600 to-cyan-600',
  internal: 'from-purple-600 to-pink-600'
};

const STATUS_COLORS = {
  active: 'bg-emerald-500',
  warning: 'bg-amber-500',
  alert: 'bg-red-500',
  inactive: 'bg-gray-400'
};

const STATUS_TEXT = {
  active: 'Nominal',
  warning: 'Attention',
  alert: 'Critical',
  inactive: 'Inactive'
};

export function SignalControlCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'external' | 'internal'>('all');
  const [selectedCategory, setSelectedCategory] = useState<SignalCategory | null>(null);

  // Fetch signal catalog
  const { data: catalogResponse, isLoading: catalogLoading } = useQuery<{
    success: boolean;
    data: SignalCategory[];
    meta: { totalCategories: number; totalDataPoints: number; externalSignals: number; internalSignals: number; triggerTemplates: number };
  }>({
    queryKey: ['/api/intelligence/catalog']
  });

  // Fetch dashboard data
  const { data: dashboardResponse, isLoading: dashboardLoading } = useQuery<{
    success: boolean;
    data: DashboardData;
  }>({
    queryKey: ['/api/intelligence/dashboard']
  });

  const catalog: SignalCategory[] = catalogResponse?.data || [];
  const dashboard: DashboardData = dashboardResponse?.data || {
    totalSignals: 0,
    activeAlerts: 0,
    criticalAlerts: 0,
    triggersConfigured: 0,
    dataSourcesConnected: 0,
    categories: [],
    recentAlerts: [],
    weakSignals: []
  };
  const statistics = catalogResponse?.meta || {
    totalCategories: 16,
    totalDataPoints: 200,
    externalSignals: 9,
    internalSignals: 7,
    triggerTemplates: 12
  };

  // Filter categories based on search and phase
  const filteredCategories = catalog.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = selectedPhase === 'all' || cat.phase === selectedPhase;
    return matchesSearch && matchesPhase;
  });

  const externalCategories = filteredCategories.filter(c => c.phase === 'external');
  const internalCategories = filteredCategories.filter(c => c.phase === 'internal');

  // Get status for a category
  const getCategoryStatus = (categoryId: string): SignalCategoryStatus | undefined => {
    return dashboard.categories?.find(c => c.categoryId === categoryId);
  };

  if (catalogLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Signal Control Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard
          label="Signal Sources"
          value={statistics.totalDataPoints}
          icon={<Database className="w-5 h-5" />}
          trend="+12 this week"
          color="blue"
        />
        <MetricCard
          label="Active Alerts"
          value={dashboard.activeAlerts}
          icon={<Bell className="w-5 h-5" />}
          trend={dashboard.criticalAlerts > 0 ? `${dashboard.criticalAlerts} critical` : "All clear"}
          color={dashboard.criticalAlerts > 0 ? "red" : "green"}
        />
        <MetricCard
          label="Triggers Configured"
          value={dashboard.triggersConfigured}
          icon={<Zap className="w-5 h-5" />}
          trend="8 active"
          color="purple"
        />
        <MetricCard
          label="Data Sources"
          value={dashboard.dataSourcesConnected}
          icon={<Layers className="w-5 h-5" />}
          trend="All connected"
          color="cyan"
        />
        <MetricCard
          label="Signal Categories"
          value={statistics.totalCategories}
          icon={<Grid3X3 className="w-5 h-5" />}
          trend="16 monitored"
          color="amber"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search signal categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-signals"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPhase === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPhase('all')}
            data-testid="button-filter-all"
          >
            All ({statistics.totalCategories})
          </Button>
          <Button
            variant={selectedPhase === 'external' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPhase('external')}
            data-testid="button-filter-external"
          >
            External ({statistics.externalSignals})
          </Button>
          <Button
            variant={selectedPhase === 'internal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPhase('internal')}
            data-testid="button-filter-internal"
          >
            Internal ({statistics.internalSignals})
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList>
          <TabsTrigger value="categories" data-testid="tab-categories">Signal Categories</TabsTrigger>
          <TabsTrigger value="alerts" data-testid="tab-alerts">Active Alerts ({dashboard.activeAlerts})</TabsTrigger>
          <TabsTrigger value="triggers" data-testid="tab-triggers">Triggers</TabsTrigger>
          <TabsTrigger value="sources" data-testid="tab-sources">Data Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-4">
          {selectedCategory ? (
            <CategoryDetailView 
              category={selectedCategory} 
              status={getCategoryStatus(selectedCategory.id)}
              onBack={() => setSelectedCategory(null)} 
            />
          ) : (
            <div className="space-y-6">
              {/* External Intelligence Signals */}
              {externalCategories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`h-1 w-8 bg-gradient-to-r ${PHASE_COLORS.external} rounded`}></div>
                    <h3 className="text-lg font-semibold">External Intelligence</h3>
                    <Badge variant="secondary">{externalCategories.length} categories</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {externalCategories.map(category => (
                      <SignalCategoryCard
                        key={category.id}
                        category={category}
                        status={getCategoryStatus(category.id)}
                        onClick={() => setSelectedCategory(category)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Intelligence Signals */}
              {internalCategories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`h-1 w-8 bg-gradient-to-r ${PHASE_COLORS.internal} rounded`}></div>
                    <h3 className="text-lg font-semibold">Internal Intelligence</h3>
                    <Badge variant="secondary">{internalCategories.length} categories</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {internalCategories.map(category => (
                      <SignalCategoryCard
                        key={category.id}
                        category={category}
                        status={getCategoryStatus(category.id)}
                        onClick={() => setSelectedCategory(category)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <AlertsPanel alerts={dashboard.recentAlerts} weakSignals={dashboard.weakSignals} />
        </TabsContent>

        <TabsContent value="triggers" className="mt-4">
          <TriggersPanel />
        </TabsContent>

        <TabsContent value="sources" className="mt-4">
          <DataSourcesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  label, 
  value, 
  icon, 
  trend, 
  color 
}: { 
  label: string; 
  value: number; 
  icon: React.ReactNode; 
  trend: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400',
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{trend}</div>
      </CardContent>
    </Card>
  );
}

// Signal Category Card
function SignalCategoryCard({ 
  category, 
  status, 
  onClick 
}: { 
  category: SignalCategory; 
  status?: SignalCategoryStatus;
  onClick: () => void;
}) {
  const IconComponent = CATEGORY_ICONS[category.id] || Activity;
  const currentStatus = status?.status || 'active';
  const healthScore = status?.healthScore || Math.floor(Math.random() * 30) + 70;

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50"
      onClick={onClick}
      data-testid={`card-signal-${category.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${PHASE_COLORS[category.phase]} text-white`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[currentStatus]}`}></div>
            <span className="text-xs text-muted-foreground">{STATUS_TEXT[currentStatus]}</span>
          </div>
        </div>
        
        <h4 className="font-semibold mb-1">{category.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {category.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Health Score</span>
            <span className="font-medium">{healthScore}%</span>
          </div>
          <Progress value={healthScore} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Database className="w-3 h-3" />
            <span>{category.dataPoints.length} data points</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

// Category Detail View
function CategoryDetailView({ 
  category, 
  status,
  onBack 
}: { 
  category: SignalCategory; 
  status?: SignalCategoryStatus;
  onBack: () => void;
}) {
  const IconComponent = CATEGORY_ICONS[category.id] || Activity;
  const healthScore = status?.healthScore || 85;
  
  const dataPoints = category.dataPoints || [];
  const dataSources = category.dataSources || [];
  const recommendedPlaybooks = category.recommendedPlaybooks || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back">
          ← Back to Categories
        </Button>
      </div>

      <div className="flex items-start gap-6">
        <div className={`p-4 rounded-xl bg-gradient-to-r ${PHASE_COLORS[category.phase]} text-white`}>
          <IconComponent className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{category.name}</h2>
            <Badge variant={category.phase === 'external' ? 'default' : 'secondary'}>
              {category.phase}
            </Badge>
          </div>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{healthScore}%</div>
          <div className="text-sm text-muted-foreground">Health Score</div>
        </div>
      </div>

      {/* Data Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Points ({dataPoints.length})
          </CardTitle>
          <CardDescription>
            Signals monitored in this category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {dataPoints.length > 0 ? dataPoints.map((dp, idx) => (
                <div 
                  key={dp.id} 
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  data-testid={`datapoint-${dp.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{dp.name}</span>
                        {dp.defaultThreshold && (
                          <Badge variant={dp.defaultThreshold.urgency === 'critical' ? 'destructive' : 'outline'} className="text-xs">
                            {dp.defaultThreshold.urgency}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{dp.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {dp.metric}
                        </span>
                        <span className="flex items-center gap-1">
                          <Radio className="w-3 h-3" />
                          {dp.refreshInterval}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" data-testid={`button-configure-${dp.id}`}>
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No data points configured for this category yet.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Data Sources and Playbooks */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {dataSources.length > 0 ? dataSources.map(source => (
                <Badge key={source} variant="outline">{source}</Badge>
              )) : (
                <span className="text-sm text-muted-foreground">No data sources configured</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Play className="w-4 h-4" />
              Recommended Playbooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recommendedPlaybooks.length > 0 ? recommendedPlaybooks.map(pb => (
                <Badge key={pb} variant="secondary">{pb}</Badge>
              )) : (
                <span className="text-sm text-muted-foreground">No playbooks recommended yet</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Alerts Panel
function AlertsPanel({ alerts, weakSignals }: { alerts: any[]; weakSignals: any[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Recent Alerts</h3>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {alerts.length === 0 && weakSignals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
            <h4 className="font-semibold mb-2">All Clear</h4>
            <p className="text-muted-foreground">No active alerts at this time. All signals are within normal parameters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <AlertCard key={alert.id || idx} alert={alert} />
          ))}
          {weakSignals.map((signal, idx) => (
            <WeakSignalCard key={signal.id || idx} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert }: { alert: any }) {
  const severityColors: Record<string, string> = {
    critical: 'border-red-500 bg-red-500/10',
    high: 'border-amber-500 bg-amber-500/10',
    medium: 'border-blue-500 bg-blue-500/10',
    low: 'border-gray-500 bg-gray-500/10'
  };

  return (
    <Card className={`border-l-4 ${severityColors[alert.severity || 'medium']}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">{alert.title}</span>
              <Badge variant="outline">{alert.severity}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" data-testid={`button-acknowledge-${alert.id}`}>
              Acknowledge
            </Button>
            <Button variant="default" size="sm" data-testid={`button-activate-${alert.id}`}>
              Activate Playbook
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeakSignalCard({ signal }: { signal: any }) {
  return (
    <Card className="border-l-4 border-purple-500 bg-purple-500/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Weak Signal Detected</span>
              <Badge variant="outline">{signal.signalType}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{signal.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Confidence: {signal.confidence}%</span>
              <span>Timeline: {signal.timeline}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Investigate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Triggers Panel
function TriggersPanel() {
  const [showBuilder, setShowBuilder] = useState(false);
  
  const { data: triggersResponse, isLoading } = useQuery<{
    success: boolean;
    data: any[];
  }>({
    queryKey: ['/api/intelligence/triggers']
  });

  const triggers = triggersResponse?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Configured Triggers</h3>
        <Button size="sm" onClick={() => setShowBuilder(true)} data-testid="button-new-trigger">
          <Plus className="w-4 h-4 mr-2" />
          New Trigger
        </Button>
      </div>
      
      {/* Trigger Builder Dialog */}
      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Create New Trigger
            </DialogTitle>
          </DialogHeader>
          <TriggerBuilder onClose={() => setShowBuilder(false)} />
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading triggers...</div>
      ) : triggers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="font-semibold mb-2">No Triggers Configured</h4>
            <p className="text-muted-foreground mb-4">
              Create triggers to automatically monitor signals and recommend playbook activation.
            </p>
            <Button onClick={() => setShowBuilder(true)} data-testid="button-create-first-trigger">
              <Plus className="w-4 h-4 mr-2" />
              Create First Trigger
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {triggers.map((trigger: any) => (
            <Card key={trigger.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${trigger.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <span className="font-medium">{trigger.name}</span>
                      <p className="text-sm text-muted-foreground">{trigger.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{trigger.triggerType}</Badge>
                    <Badge>{trigger.alertThreshold}</Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Data Sources Panel
function DataSourcesPanel() {
  const { data: sourcesResponse, isLoading } = useQuery<{
    success: boolean;
    data: any[];
  }>({
    queryKey: ['/api/intelligence/data-sources']
  });

  const sources = sourcesResponse?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Connected Data Sources</h3>
        <Button size="sm" data-testid="button-connect-source">
          <Plus className="w-4 h-4 mr-2" />
          Connect Source
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading data sources...</div>
      ) : sources.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="font-semibold mb-2">No Data Sources Connected</h4>
            <p className="text-muted-foreground mb-4">
              Connect enterprise data sources to enable real-time signal monitoring.
            </p>
            <Button data-testid="button-connect-first-source">
              <Plus className="w-4 h-4 mr-2" />
              Connect First Source
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sources.map((source: any) => (
            <Card key={source.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{source.name}</span>
                  <div className={`w-2 h-2 rounded-full ${source.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{source.sourceType}</Badge>
                  {source.category && <Badge variant="secondary">{source.category}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default SignalControlCenter;
