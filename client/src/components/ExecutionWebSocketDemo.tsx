import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useExecutionWebSocket } from "@/hooks/useExecutionWebSocket";
import { CheckCircle2, Clock, Users, Wifi, WifiOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ExecutionWebSocketDemoProps {
  executionInstanceId: string;
}

/**
 * Demonstration component showing real-time WebSocket updates
 * for execution coordination tracking
 */
export default function ExecutionWebSocketDemo({
  executionInstanceId,
}: ExecutionWebSocketDemoProps) {
  const {
    acknowledgments,
    isComplete,
    metrics,
    isConnected,
    error,
  } = useExecutionWebSocket(executionInstanceId);

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className="border-l-4" style={{ borderLeftColor: isConnected ? '#10b981' : '#ef4444' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                WebSocket Connected
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-600" />
                WebSocket Disconnected
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {isConnected ? (
              <span className="text-green-600">
                Receiving live updates for execution {executionInstanceId.substring(0, 8)}...
              </span>
            ) : error ? (
              <span className="text-red-600">Error: {error}</span>
            ) : (
              <span className="text-gray-600">Connecting...</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Acknowledgments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Live Acknowledgments
            <Badge variant="secondary" className="ml-2">
              {acknowledgments.length} received
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {acknowledgments.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              Waiting for stakeholder acknowledgments...
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {acknowledgments.map((ack, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900 animate-in fade-in slide-in-from-top-2 duration-500"
                  data-testid={`ack-${index}`}
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{ack.stakeholderName}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Response time: {ack.responseTimeMinutes.toFixed(1)} min
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(ack.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coordination Complete */}
      {isComplete && metrics && (
        <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20 animate-in zoom-in duration-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-6 w-6" />
              🎉 Coordination Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.coordinationTimeMinutes.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.acknowledgedCount}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Acknowledged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.totalStakeholders}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Total Stakeholders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.acknowledgmentRate.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">Response Rate</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-center text-muted-foreground">
              Completed {formatDistanceToNow(new Date(metrics.timestamp), { addSuffix: true })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
