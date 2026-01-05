import { useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Send, Phone, DollarSign, AlertCircle, Users } from 'lucide-react';
import { twelveMinuteTimeline, DemoTimelineEvent } from '@shared/luxury-demo-data';
import { useTimelineState, useTimelineOrchestrator } from '@/contexts/DemoTimelineContext';

interface TwelveMinuteTimerProps {
  title?: string;
  subtitle?: string;
  timelineEvents?: any[];
  onComplete?: () => void;
  autoStart?: boolean;
  useSharedTimeline?: boolean;
}

export default function TwelveMinuteTimer({ 
  title = "Rapid Response Coordination",
  subtitle = "Initiating parallel execution across all stakeholders",
  timelineEvents,
  onComplete, 
  autoStart = false
}: TwelveMinuteTimerProps) {
  const timelineState = useTimelineState();
  const orchestrator = useTimelineOrchestrator();
  const completedCallbackRef = useRef(false);
  
  const currentSecond = timelineState.elapsedSeconds;
  const isRunning = timelineState.isRunning;
  const completed = timelineState.isComplete;
  
  const normalizeTimelineEvents = (events: any[]): DemoTimelineEvent[] => {
    return events.map(event => {
      let timeInSeconds = 0;
      if (typeof event.time === 'string') {
        const [mins, secs] = event.time.split(':').map(Number);
        timeInSeconds = mins * 60 + (secs || 0);
      } else {
        timeInSeconds = event.time;
      }
      
      return {
        time: timeInSeconds,
        label: event.label || event.title || `T+${event.time}`,
        description: event.description,
        icon: (event.icon || 'alert').toLowerCase() as any,
        stakeholderCount: event.stakeholderCount
      };
    });
  };
  
  const timeline = timelineEvents 
    ? normalizeTimelineEvents(timelineEvents)
    : twelveMinuteTimeline;

  const handleStart = useCallback(() => {
    orchestrator.startOnce({ duration: 720000, speedMultiplier: 20 });
  }, [orchestrator]);

  useEffect(() => {
    if (autoStart && !isRunning && !completed) {
      handleStart();
    }
  }, [autoStart, isRunning, completed, handleStart]);

  useEffect(() => {
    if (!completed && timelineState.elapsedMs === 0) {
      completedCallbackRef.current = false;
    }
  }, [completed, timelineState.elapsedMs]);

  useEffect(() => {
    if (completed && onComplete && !completedCallbackRef.current) {
      completedCallbackRef.current = true;
      onComplete();
    }
  }, [completed, onComplete]);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'check': return <CheckCircle2 className="h-4 w-4" />;
      case 'dollar': return <DollarSign className="h-4 w-4" />;
      case 'send': return <Send className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-xl text-blue-200">{subtitle}</p>
      </div>

      <Card className="p-4 bg-gradient-to-br from-blue-950 to-indigo-950 border-blue-800/30 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-4">
          <Clock className={`h-5 w-5 text-blue-400 ${isRunning ? 'animate-pulse' : ''}`} />
          <div className="text-4xl font-bold text-white" data-testid="text-timer">
            {timelineState.formattedTime}
          </div>
          <span className="text-sm text-blue-200">
            {completed ? '✓ Complete' : 'Coordinating...'}
          </span>
        </div>
      </Card>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-green-500" />

        <div className="space-y-4">
          {timeline.map((event, index) => {
            const isActive = currentSecond >= event.time;
            const isLast = index === timeline.length - 1;

            return (
              <div
                key={event.time}
                className={`relative pl-16 transition-all duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-30'
                }`}
                data-testid={`timeline-event-${event.time}`}
              >
                <div className={`absolute left-4 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive 
                    ? isLast 
                      ? 'bg-green-500 ring-4 ring-green-200 dark:ring-green-800' 
                      : 'bg-blue-500 ring-4 ring-blue-200 dark:ring-blue-800'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}>
                  {isActive && (
                    <div className="text-white">
                      {getIcon(event.icon)}
                    </div>
                  )}
                </div>

                <Card className={`p-4 ${isActive ? 'border-blue-500 border-2' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant={isActive ? 'default' : 'outline'} className="mb-2">
                        {event.label}
                      </Badge>
                      <p className="font-semibold text-sm">{event.description}</p>
                    </div>
                    {event.stakeholderCount && isActive && (
                      <Badge variant="secondary" className="ml-2">
                        {event.stakeholderCount} people
                      </Badge>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {completed && (
        <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-500 border-2" data-testid="card-completion">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">12:00</div>
              <div className="text-xs text-muted-foreground">Total Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">193</div>
              <div className="text-xs text-muted-foreground">Stakeholders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">$50M</div>
              <div className="text-xs text-muted-foreground">Budget Activated</div>
            </div>
          </div>
        </Card>
      )}

      {!isRunning && !completed && (
        <button
          onClick={handleStart}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
          data-testid="button-start-timer"
        >
          Start Response Coordination
        </button>
      )}
    </div>
  );
}
