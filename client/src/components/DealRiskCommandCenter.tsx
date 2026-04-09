import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  MessageSquare,
  ListTodo,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface TimelineEvent {
  timestamp: string;
  action: string;
  system: string;
  status: 'pending' | 'in-progress' | 'completed';
  duration: number;
}

interface ExecutionResult {
  executionId: string;
  dealId: string;
  dealName: string;
  accountName: string;
  amount: number;
  riskScore: number;
  startTime: string;
  endTime: string;
  totalDuration: number;
  timeline: TimelineEvent[];
  results: {
    slack: { sent: boolean; channel: string };
    jira: { created: boolean; taskCount: number };
    calendar: { scheduled: boolean; attendees: string[] };
  };
  comparisonMetrics: {
    responseTime: number;
    industryAverage: number;
    timeSaved: number;
    efficiency: string;
  };
}

interface DealRiskCommandCenterProps {
  execution: ExecutionResult | null;
  isAnimating?: boolean;
}

export function DealRiskCommandCenter({ execution, isAnimating = false }: DealRiskCommandCenterProps) {
  const [visibleEvents, setVisibleEvents] = useState<number>(0);

  useEffect(() => {
    if (execution && isAnimating) {
      setVisibleEvents(0);
      const interval = setInterval(() => {
        setVisibleEvents(prev => {
          if (prev >= execution.timeline.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    } else if (execution) {
      setVisibleEvents(execution.timeline.length);
    }
  }, [execution, isAnimating]);

  if (!execution) {
    return (
      <Card className="bg-white border-gray-200">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">No active execution. Trigger a playbook to see the Command Center in action.</p>
        </CardContent>
      </Card>
    );
  }

  const getSystemIcon = (system: string) => {
    switch (system.toLowerCase()) {
      case 'slack': return <MessageSquare className="h-4 w-4" />;
      case 'jira': return <ListTodo className="h-4 w-4" />;
      case 'google calendar': return <Calendar className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getSystemColor = (system: string) => {
    switch (system.toLowerCase()) {
      case 'slack': return 'bg-[#0A0F2E]';
      case 'jira': return 'bg-[#0A0F2E]';
      case 'google calendar': return 'bg-green-500';
      case 'salesforce': return 'bg-[#2B8A6E]';
      default: return 'bg-amber-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className=" border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              Command Center
            </CardTitle>
            <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">
              Live Execution
            </Badge>
          </div>
          <div className="mt-2 p-3 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Deal:</span>
              <span className="text-white font-medium">{execution.dealName}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Value:</span>
              <span className="text-[#2B8A6E] font-medium">
                ${(execution.amount / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Risk Score:</span>
              <span className="text-red-400 font-medium">{execution.riskScore}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {execution.timeline.slice(0, visibleEvents).map((event, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <div className={`p-2 ${getSystemColor(event.system)} text-white`}>
                  {getSystemIcon(event.system)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-mono">{event.timestamp}</span>
                    <Badge variant="outline" className="bg-transparent text-xs border-slate-600 text-gray-600">
                      {event.system}
                    </Badge>
                  </div>
                  <p className="text-sm text-white mt-1">{event.action}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-[#2B8A6E] flex-shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-[#2B8A6E]" />
              <span className="text-3xl font-bold text-[#2B8A6E]">
                {execution.comparisonMetrics.responseTime} min
              </span>
            </div>
            <p className="text-sm text-gray-600">Readiness OS Response Time</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-amber-400" />
              <span className="text-3xl font-bold text-amber-400">
                {execution.comparisonMetrics.efficiency}
              </span>
            </div>
            <p className="text-sm text-gray-600">vs. Industry Average ({execution.comparisonMetrics.industryAverage} min)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Execution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#C9A84C]">1</div>
              <p className="text-xs text-gray-600">Slack Alert</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0A0F2E]">
                {execution.results.jira.taskCount}
              </div>
              <p className="text-xs text-gray-600">Jira Tasks</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {execution.results.calendar.attendees.length}
              </div>
              <p className="text-xs text-gray-600">Attendees</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#2B8A6E]">4</div>
              <p className="text-xs text-gray-600">Systems</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DealRiskCommandCenter;
