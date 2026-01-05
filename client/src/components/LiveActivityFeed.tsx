import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, AlertTriangle, CheckCircle, Info, Zap, Brain, Eye, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityEvent {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  severity: string;
  createdAt: string;
  relatedEntityType: string | null;
}

const eventIcons: Record<string, any> = {
  'weak_signal_detected': Eye,
  'playbook_activated': Zap,
  'oracle_pattern_detected': Brain,
  'readiness_score_updated': TrendingUp,
  'scenario_triggered': AlertTriangle,
  'execution_completed': CheckCircle,
  'default': Activity
};

const severityColors: Record<string, { badge: string; border: string }> = {
  'critical': { badge: 'bg-red-500 text-white', border: 'border-red-500/20' },
  'high': { badge: 'bg-orange-500 text-white', border: 'border-orange-500/20' },
  'medium': { badge: 'bg-yellow-500 text-white', border: 'border-yellow-500/20' },
  'low': { badge: 'bg-blue-500 text-white', border: 'border-blue-500/20' },
  'info': { badge: 'bg-slate-500 text-white', border: 'border-slate-500/20' }
};

export default function LiveActivityFeed({ organizationId }: { organizationId: string }) {
  const { data: events = [] } = useQuery<ActivityEvent[]>({
    queryKey: ['/api/dynamic-strategy/activity-feed', organizationId],
    refetchInterval: 15000,
  });

  const recentEvents = events.slice(0, 10);

  return (
    <Card data-testid="card-live-activity-feed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg">Live Activity Feed</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time system intelligence and events
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground mt-1">Events will appear here in real-time</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event, index) => {
                const Icon = eventIcons[event.eventType] || eventIcons.default;
                const colors = severityColors[event.severity] || severityColors.info;
                
                return (
                  <div 
                    key={event.id}
                    className={`flex gap-3 p-3 rounded-lg border ${colors.border} bg-slate-50/50 dark:bg-slate-900/50 transition-all hover:shadow-sm`}
                    style={{ 
                      animation: index === 0 ? 'slideIn 0.5s ease-out' : 'none' 
                    }}
                    data-testid={`activity-event-${event.id}`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-foreground leading-tight">
                          {event.title}
                        </h4>
                        <Badge className={`${colors.badge} text-xs flex-shrink-0`}>
                          {event.severity.toUpperCase()}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                        </span>
                        {event.relatedEntityType && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{event.relatedEntityType}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
