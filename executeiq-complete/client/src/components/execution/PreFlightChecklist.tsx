import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Shield, Users, Clock, Link2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PreFlightWarning {
  severity: 'info' | 'warning' | 'critical' | 'blocking';
  category: 'resource' | 'compliance' | 'timing' | 'dependencies';
  title: string;
  message: string;
  affectedTasks: string[];
  suggestedAction: string;
  estimatedDelay?: number;
}

interface PreFlightCheckResult {
  canProceed: boolean;
  warnings: PreFlightWarning[];
  readinessScore: number;
  estimatedCompletionTime: number;
  criticalIssues: number;
  metadata: {
    totalTasks: number;
    rolesRequired: number;
    rolesAvailable: number;
    complianceIssues: number;
  };
}

interface PreFlightChecklistProps {
  executionPlanId: string;
  organizationId: string;
  onReadyChange?: (canProceed: boolean, score: number) => void;
}

const severityConfig = {
  blocking: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", badge: "destructive" as const },
  critical: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10", badge: "destructive" as const },
  warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10", badge: "secondary" as const },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", badge: "outline" as const },
};

const categoryConfig = {
  resource: { icon: Users, label: "Resource" },
  compliance: { icon: Shield, label: "Compliance" },
  timing: { icon: Clock, label: "Timing" },
  dependencies: { icon: Link2, label: "Dependencies" },
};

export function PreFlightChecklist({ executionPlanId, organizationId, onReadyChange }: PreFlightChecklistProps) {
  const { data: result, isLoading, error } = useQuery<PreFlightCheckResult>({
    queryKey: ['/api/execution/preflight', executionPlanId],
    enabled: !!executionPlanId && !!organizationId,
    refetchInterval: 30000,
  });

  if (result && onReadyChange) {
    onReadyChange(result.canProceed, result.readinessScore);
  }

  if (isLoading) {
    return (
      <Card data-testid="preflight-loading">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="preflight-error">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load pre-flight check results</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const scoreColor = result.readinessScore >= 80 
    ? "text-green-500" 
    : result.readinessScore >= 50 
      ? "text-yellow-500" 
      : "text-red-500";

  const groupedWarnings = result.warnings.reduce((acc, warning) => {
    if (!acc[warning.category]) {
      acc[warning.category] = [];
    }
    acc[warning.category].push(warning);
    return acc;
  }, {} as Record<string, PreFlightWarning[]>);

  return (
    <Card data-testid="preflight-checklist">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Pre-Flight Check
            </CardTitle>
            <CardDescription>
              Verifying readiness for activation
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${scoreColor}`} data-testid="readiness-score">
              {result.readinessScore}%
            </div>
            <div className="text-sm text-muted-foreground">Readiness Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress 
          value={result.readinessScore} 
          className="h-2"
          data-testid="readiness-progress"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50" data-testid="stat-tasks">
            <div className="text-2xl font-semibold">{result.metadata.totalTasks}</div>
            <div className="text-xs text-muted-foreground">Total Tasks</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50" data-testid="stat-roles">
            <div className="text-2xl font-semibold">
              {result.metadata.rolesAvailable}/{result.metadata.rolesRequired}
            </div>
            <div className="text-xs text-muted-foreground">Roles Ready</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50" data-testid="stat-time">
            <div className="text-2xl font-semibold">{result.estimatedCompletionTime}</div>
            <div className="text-xs text-muted-foreground">Est. Minutes</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50" data-testid="stat-issues">
            <div className={`text-2xl font-semibold ${result.criticalIssues > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {result.criticalIssues}
            </div>
            <div className="text-xs text-muted-foreground">Critical Issues</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: result.canProceed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
          {result.canProceed ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-700 dark:text-green-400" data-testid="status-ready">
                Ready for Activation
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-700 dark:text-red-400" data-testid="status-blocked">
                Activation Blocked - Resolve Issues Below
              </span>
            </>
          )}
        </div>

        {result.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Issues & Warnings ({result.warnings.length})
            </h4>
            <Accordion type="multiple" className="space-y-2">
              {Object.entries(groupedWarnings).map(([category, warnings]) => {
                const config = categoryConfig[category as keyof typeof categoryConfig];
                const CategoryIcon = config?.icon || AlertTriangle;
                return (
                  <AccordionItem 
                    key={category} 
                    value={category}
                    className="border rounded-lg px-4"
                    data-testid={`warning-category-${category}`}
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4" />
                        <span>{config?.label || category}</span>
                        <Badge variant="secondary" className="ml-2">
                          {warnings.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {warnings.map((warning, idx) => {
                          const sevConfig = severityConfig[warning.severity];
                          const SeverityIcon = sevConfig.icon;
                          return (
                            <div 
                              key={idx} 
                              className={`p-3 rounded-lg ${sevConfig.bg}`}
                              data-testid={`warning-item-${category}-${idx}`}
                            >
                              <div className="flex items-start gap-2">
                                <SeverityIcon className={`h-4 w-4 mt-0.5 ${sevConfig.color}`} />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{warning.title}</span>
                                    <Badge variant={sevConfig.badge} className="text-xs">
                                      {warning.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {warning.message}
                                  </p>
                                  {warning.suggestedAction && (
                                    <p className="text-sm mt-2 font-medium">
                                      Suggested: {warning.suggestedAction}
                                    </p>
                                  )}
                                  {warning.affectedTasks.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {warning.affectedTasks.map((task, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {task}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}

        {result.warnings.length === 0 && (
          <div className="text-center py-4 text-muted-foreground" data-testid="no-warnings">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>All pre-flight checks passed</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
