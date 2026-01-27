/**
 * Alert Command Center
 * 
 * Real-time alert queue with prioritization, acknowledgment, and escalation.
 * Provides executives with actionable intelligence and playbook recommendations.
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Play,
  Radio,
  RefreshCw,
  Shield,
  Target,
  TrendingUp,
  X,
  Zap
} from 'lucide-react';

interface StrategicAlert {
  id: string;
  title: string;
  description: string;
  alertType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: string;
  aiConfidence?: string;
  dataSourcesUsed?: any;
  suggestedActions?: any[];
  recommendedScenario?: string;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

interface WeakSignal {
  id: string;
  signalType: string;
  description: string;
  confidence: string;
  timeline: string;
  impact: string;
  source: string;
  status: string;
  detectedAt: string;
}

const SEVERITY_CONFIG = {
  critical: { 
    color: 'bg-red-500', 
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-600 dark:text-red-400',
    label: 'Critical'
  },
  high: { 
    color: 'bg-orange-500', 
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-600 dark:text-orange-400',
    label: 'High'
  },
  medium: { 
    color: 'bg-yellow-500', 
    borderColor: 'border-l-yellow-500',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    label: 'Medium'
  },
  low: { 
    color: 'bg-blue-500', 
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
    label: 'Low'
  }
};

export function AlertCommandCenter() {
  const { toast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<StrategicAlert | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');

  // Fetch alerts
  const { data: alertsResponse, isLoading, refetch } = useQuery<{
    success: boolean;
    data: {
      strategicAlerts: StrategicAlert[];
      weakSignals: WeakSignal[];
    };
  }>({
    queryKey: ['/api/intelligence/alerts'],
    refetchInterval: 30000 // Auto-refresh every 30 seconds
  });

  // Acknowledge alert mutation
  const acknowledgeMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest('POST', `/api/intelligence/alerts/${alertId}/acknowledge`, {});
    },
    onSuccess: () => {
      toast({
        title: 'Alert Acknowledged',
        description: 'The alert has been marked as acknowledged.'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/intelligence/alerts'] });
    }
  });

  // Dismiss alert mutation
  const dismissMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest('POST', `/api/intelligence/alerts/${alertId}/dismiss`, {});
    },
    onSuccess: () => {
      toast({
        title: 'Alert Dismissed',
        description: 'The alert has been dismissed.'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/intelligence/alerts'] });
    }
  });

  const alerts = alertsResponse?.data?.strategicAlerts || [];
  const weakSignals = alertsResponse?.data?.weakSignals || [];

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    return true;
  });

  // Group alerts by severity for the summary
  const alertSummary = {
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    high: alerts.filter(a => a.severity === 'high' && a.status === 'active').length,
    medium: alerts.filter(a => a.severity === 'medium' && a.status === 'active').length,
    low: alerts.filter(a => a.severity === 'low' && a.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary Header */}
      <div className="grid grid-cols-5 gap-4">
        <SummaryCard
          label="Critical"
          count={alertSummary.critical}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="red"
        />
        <SummaryCard
          label="High Priority"
          count={alertSummary.high}
          icon={<Shield className="w-5 h-5" />}
          color="orange"
        />
        <SummaryCard
          label="Medium"
          count={alertSummary.medium}
          icon={<Bell className="w-5 h-5" />}
          color="yellow"
        />
        <SummaryCard
          label="Low"
          count={alertSummary.low}
          icon={<Activity className="w-5 h-5" />}
          color="blue"
        />
        <SummaryCard
          label="Weak Signals"
          count={weakSignals.filter(s => s.status === 'active').length}
          icon={<Radio className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Filters and Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-36" data-testid="filter-severity">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36" data-testid="filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          data-testid="button-refresh-alerts"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Alert List */}
        <div className="col-span-2">
          <Tabs defaultValue="strategic" className="w-full">
            <TabsList>
              <TabsTrigger value="strategic" data-testid="tab-strategic-alerts">
                Strategic Alerts ({filteredAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="weak" data-testid="tab-weak-signals">
                Weak Signals ({weakSignals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="strategic" className="mt-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading alerts...</p>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                    <h4 className="font-semibold mb-2">No Active Alerts</h4>
                    <p className="text-muted-foreground">
                      All systems are operating within normal parameters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3 pr-4">
                    {filteredAlerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        isSelected={selectedAlert?.id === alert.id}
                        onSelect={() => setSelectedAlert(alert)}
                        onAcknowledge={() => acknowledgeMutation.mutate(alert.id)}
                        onDismiss={() => dismissMutation.mutate(alert.id)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="weak" className="mt-4">
              {weakSignals.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="font-semibold mb-2">No Weak Signals Detected</h4>
                    <p className="text-muted-foreground">
                      The AI is continuously scanning for early indicators.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3 pr-4">
                    {weakSignals.map((signal) => (
                      <WeakSignalCard key={signal.id} signal={signal} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Alert Details Panel */}
        <div>
          {selectedAlert ? (
            <AlertDetailPanel
              alert={selectedAlert}
              onAcknowledge={() => acknowledgeMutation.mutate(selectedAlert.id)}
              onDismiss={() => dismissMutation.mutate(selectedAlert.id)}
              onClose={() => setSelectedAlert(null)}
            />
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-semibold mb-2">Select an Alert</h4>
                <p className="text-muted-foreground text-sm">
                  Click on an alert to view details, recommended actions, and playbook suggestions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  label,
  count,
  icon,
  color
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
    yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
  };

  return (
    <Card className={`border ${colorClasses[color]}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Alert Card Component
function AlertCard({
  alert,
  isSelected,
  onSelect,
  onAcknowledge,
  onDismiss
}: {
  alert: StrategicAlert;
  isSelected: boolean;
  onSelect: () => void;
  onAcknowledge: () => void;
  onDismiss: () => void;
}) {
  const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.medium;

  return (
    <Card 
      className={`cursor-pointer transition-all border-l-4 ${config.borderColor} ${
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
      }`}
      onClick={onSelect}
      data-testid={`alert-card-${alert.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className={config.color}>{config.label}</Badge>
            <Badge variant="outline" className="text-xs">{alert.alertType}</Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {alert.createdAt ? formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true }) : 'Recently'}
          </div>
        </div>
        
        <h4 className="font-semibold mb-1">{alert.title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {alert.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {alert.aiConfidence && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Target className="w-3 h-3" />
                {(parseFloat(alert.aiConfidence) * 100).toFixed(0)}% confidence
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {alert.status === 'active' && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onAcknowledge(); }}
                  data-testid={`acknowledge-${alert.id}`}
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                  data-testid={`dismiss-${alert.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Weak Signal Card Component
function WeakSignalCard({ signal }: { signal: WeakSignal }) {
  const impactColors: Record<string, string> = {
    critical: 'border-red-500 bg-red-500/5',
    high: 'border-orange-500 bg-orange-500/5',
    medium: 'border-yellow-500 bg-yellow-500/5',
    low: 'border-blue-500 bg-blue-500/5'
  };

  return (
    <Card className={`border-l-4 ${impactColors[signal.impact] || impactColors.medium}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-500" />
            <Badge variant="outline">{signal.signalType}</Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {signal.detectedAt ? formatDistanceToNow(new Date(signal.detectedAt), { addSuffix: true }) : 'Recently'}
          </div>
        </div>
        
        <p className="text-sm mb-3">{signal.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {signal.confidence}% confidence
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {signal.timeline}
          </span>
          <Badge variant={signal.impact === 'critical' || signal.impact === 'high' ? 'destructive' : 'secondary'}>
            {signal.impact} impact
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Alert Detail Panel
function AlertDetailPanel({
  alert,
  onAcknowledge,
  onDismiss,
  onClose
}: {
  alert: StrategicAlert;
  onAcknowledge: () => void;
  onDismiss: () => void;
  onClose: () => void;
}) {
  const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.medium;

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className={`${config.bgColor} border-b`}>
        <div className="flex items-center justify-between">
          <Badge className={config.color}>{config.label}</Badge>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardTitle className="text-lg">{alert.title}</CardTitle>
        <CardDescription>{alert.description}</CardDescription>
      </CardHeader>
      
      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-6">
          {/* Alert Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Alert Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">{alert.alertType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2">{alert.category || 'General'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Confidence:</span>
                <span className="ml-2">
                  {alert.aiConfidence ? `${(parseFloat(alert.aiConfidence) * 100).toFixed(0)}%` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 capitalize">{alert.status}</span>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          {alert.suggestedActions && alert.suggestedActions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Recommended Actions
              </h4>
              <div className="space-y-2">
                {alert.suggestedActions.map((action: any, idx: number) => (
                  <div 
                    key={idx}
                    className="p-3 bg-muted rounded-lg flex items-center justify-between"
                  >
                    <span className="text-sm">{action.action || action}</span>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Playbook */}
          {alert.recommendedScenario && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Play className="w-4 h-4" />
                Recommended Playbook
              </h4>
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{alert.recommendedScenario}</div>
                      <p className="text-xs text-muted-foreground">
                        Pre-configured response for this alert type
                      </p>
                    </div>
                    <Button size="sm" data-testid="button-activate-playbook">
                      <Zap className="w-4 h-4 mr-1" />
                      Activate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Data Sources */}
          {alert.dataSourcesUsed && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Data Sources</h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(alert.dataSourcesUsed) 
                  ? alert.dataSourcesUsed 
                  : [alert.dataSourcesUsed]
                ).map((source: any, idx: number) => (
                  <Badge key={idx} variant="outline">
                    {typeof source === 'string' ? source : source.name || 'Unknown'}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>

      {/* Actions Footer */}
      {alert.status === 'active' && (
        <div className="p-4 border-t flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onAcknowledge}
            data-testid="button-acknowledge-detail"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Acknowledge
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onDismiss}
            data-testid="button-dismiss-detail"
          >
            <X className="w-4 h-4 mr-2" />
            Dismiss
          </Button>
        </div>
      )}
    </Card>
  );
}

export default AlertCommandCenter;
