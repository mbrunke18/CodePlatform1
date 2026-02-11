import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Bell,
  Eye,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Send
} from 'lucide-react';

interface VarianceAlert {
  id: string;
  scenarioName: string;
  metric: string;
  baseline: number;
  current: number;
  variance: number;
  direction: 'above' | 'below';
  severity: 'warning' | 'critical';
  detectedAt: string;
  affectedPlaybooks: string[];
  suggestedAction: string;
  escalatedTo?: string[];
  acknowledged: boolean;
}

interface AnalysisResultInput {
  impactScore?: number;
  projectedExecutionTime?: number;
  confidenceLevel?: number;
  recommendedPlaybooks?: Array<{ id?: string; name?: string }>;
}

interface ScenarioVarianceAlertProps {
  analysisResult?: AnalysisResultInput;
  baseline?: { impactScore?: number; executionTime?: number; confidenceLevel?: number };
  onEscalate?: (alertId: string) => void;
  onAcknowledge?: (alertId: string) => void;
}

export default function ScenarioVarianceAlert({ 
  analysisResult, 
  baseline,
  onEscalate,
  onAcknowledge 
}: ScenarioVarianceAlertProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const [escalatedAlerts, setEscalatedAlerts] = useState<Record<string, string[]>>({});

  const alerts = useMemo((): VarianceAlert[] => {
    const generatedAlerts: VarianceAlert[] = [];
    const timestamp = new Date().toLocaleTimeString();
    const baselineImpact = baseline?.impactScore || 40;
    const baselineExecTime = baseline?.executionTime || 12;
    const baselineConfidence = baseline?.confidenceLevel || 85;
    
    if (analysisResult) {
      if (analysisResult.impactScore && analysisResult.impactScore > 60) {
        const variance = Math.round(((analysisResult.impactScore - baselineImpact) / baselineImpact) * 100);
        if (variance > 20) {
          generatedAlerts.push({
            id: 'var-impact-1',
            scenarioName: 'Current Analysis',
            metric: 'Impact Score',
            baseline: baselineImpact,
            current: analysisResult.impactScore,
            variance,
            direction: 'above',
            severity: analysisResult.impactScore > 80 ? 'critical' : 'warning',
            detectedAt: timestamp,
            affectedPlaybooks: analysisResult.recommendedPlaybooks?.map((p) => p.name || 'Unknown').filter(Boolean) as string[] || [],
            suggestedAction: 'Escalate to executive team for immediate review',
            acknowledged: false
          });
        }
      }

      if (analysisResult.projectedExecutionTime && analysisResult.projectedExecutionTime > 20) {
        const variance = Math.round(((analysisResult.projectedExecutionTime - baselineExecTime) / baselineExecTime) * 100);
        if (variance > 20) {
          generatedAlerts.push({
            id: 'var-time-1',
            scenarioName: 'Current Analysis',
            metric: 'Execution Time',
            baseline: baselineExecTime,
            current: analysisResult.projectedExecutionTime,
            variance,
            direction: 'above',
            severity: analysisResult.projectedExecutionTime > 30 ? 'critical' : 'warning',
            detectedAt: timestamp,
            affectedPlaybooks: ['Primary Response Playbook'],
            suggestedAction: 'Review playbook tasks for optimization opportunities',
            acknowledged: false
          });
        }
      }

      if (analysisResult.confidenceLevel && analysisResult.confidenceLevel < 70) {
        const variance = Math.round(((baselineConfidence - analysisResult.confidenceLevel) / baselineConfidence) * 100);
        if (variance > 20) {
          generatedAlerts.push({
            id: 'var-confidence-1',
            scenarioName: 'Current Analysis',
            metric: 'Analysis Confidence',
            baseline: baselineConfidence,
            current: analysisResult.confidenceLevel,
            variance,
            direction: 'below',
            severity: analysisResult.confidenceLevel < 50 ? 'critical' : 'warning',
            detectedAt: timestamp,
            affectedPlaybooks: [],
            suggestedAction: 'Add more data points to improve analysis accuracy',
            acknowledged: false
          });
        }
      }
    }

    return generatedAlerts;
  }, [analysisResult, baseline]);

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts(prev => new Set(prev).add(alertId));
    onAcknowledge?.(alertId);
  };

  const handleDismiss = (alertId: string) => {
    setDismissed(prev => new Set(prev).add(alertId));
  };

  const handleEscalate = (alert: VarianceAlert) => {
    setEscalatedAlerts(prev => ({ ...prev, [alert.id]: ['CEO', 'COO', 'CFO'] }));
    setAcknowledgedAlerts(prev => new Set(prev).add(alert.id));
    onEscalate?.(alert.id);
  };

  const visibleAlerts = alerts
    .filter(a => !dismissed.has(a.id))
    .map(a => ({
      ...a,
      acknowledged: acknowledgedAlerts.has(a.id),
      escalatedTo: escalatedAlerts[a.id]
    }));
  const criticalCount = visibleAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = visibleAlerts.filter(a => a.severity === 'warning').length;

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-amber-400 dark:border-amber-600" data-testid="card-variance-alerts">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500 animate-pulse">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Scenario Variance Alerts
                {criticalCount > 0 && (
                  <Badge className="bg-red-500 text-white">{criticalCount} Critical</Badge>
                )}
                {warningCount > 0 && (
                  <Badge className="bg-amber-500 text-white">{warningCount} Warning</Badge>
                )}
              </CardTitle>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Significant deviations from baseline detected
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {visibleAlerts.map((alert) => (
          <Alert 
            key={alert.id}
            className={`
              ${alert.severity === 'critical' 
                ? 'border-red-400 bg-red-50 dark:bg-red-900/20' 
                : 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
              }
              ${alert.acknowledged ? 'opacity-75' : ''}
            `}
          >
            <div className="flex items-start gap-3 w-full">
              {alert.direction === 'above' 
                ? <TrendingUp className={`h-5 w-5 ${alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
                : <TrendingDown className={`h-5 w-5 ${alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
              }
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {alert.metric}
                    </span>
                    <Badge variant="outline" className={
                      alert.severity === 'critical' 
                        ? 'border-red-400 text-red-700' 
                        : 'border-amber-400 text-amber-700'
                    }>
                      {alert.variance > 0 ? '+' : ''}{alert.variance}% variance
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {alert.detectedAt}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-slate-500">Baseline:</span>
                    <span className="ml-2 font-medium">{alert.baseline}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Current:</span>
                    <span className={`ml-2 font-medium ${
                      alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {alert.current}
                    </span>
                  </div>
                </div>

                {alert.affectedPlaybooks.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-slate-500">Affected Playbooks: </span>
                    <span className="text-xs font-medium">{alert.affectedPlaybooks.join(', ')}</span>
                  </div>
                )}

                <div className="bg-white/50 dark:bg-slate-800/50 rounded p-2 mb-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Suggested Action: </span>
                    {alert.suggestedAction}
                  </p>
                </div>

                {alert.escalatedTo && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 mb-2">
                    <Send className="w-4 h-4" />
                    Escalated to: {alert.escalatedTo.join(', ')}
                  </div>
                )}

                <div className="flex gap-2">
                  {!alert.acknowledged && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                        data-testid={`button-acknowledge-${alert.id}`}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Acknowledge
                      </Button>
                      {alert.severity === 'critical' && !alert.escalatedTo && (
                        <Button 
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleEscalate(alert)}
                          data-testid={`button-escalate-${alert.id}`}
                        >
                          <Users className="w-3 h-3 mr-1" />
                          Escalate to Executives
                        </Button>
                      )}
                    </>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDismiss(alert.id)}
                    className="ml-auto"
                    data-testid={`button-dismiss-${alert.id}`}
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
