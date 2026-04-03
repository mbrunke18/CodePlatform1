import { useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, Clock, Send, Phone, DollarSign, AlertCircle, Users } from 'lucide-react';
import { twelveMinuteTimeline, DemoTimelineEvent } from '@shared/luxury-demo-data';
import { useTimelineState, useTimelineOrchestrator } from '@/contexts/DemoTimelineContext';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";

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
  autoStart = false,
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
        stakeholderCount: event.stakeholderCount,
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
    if (autoStart && !isRunning && !completed) handleStart();
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
    const style = { width: 14, height: 14, color: '#fff' };
    switch (iconType) {
      case 'alert': return <AlertCircle style={style} />;
      case 'user': return <Users style={style} />;
      case 'check': return <CheckCircle2 style={style} />;
      case 'dollar': return <DollarSign style={style} />;
      case 'send': return <Send style={style} />;
      case 'phone': return <Phone style={style} />;
      default: return <Clock style={style} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>{title}</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{subtitle}</p>
      </div>

      {/* Timer display */}
      <div style={{
        borderRadius: 10,
        border: `1px solid rgba(43,138,110,0.3)`,
        background: 'rgba(43,138,110,0.07)',
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        maxWidth: 340,
        margin: '0 auto',
        width: '100%',
      }}>
        <Clock style={{ width: 18, height: 18, color: TEAL_LT }}
          className={isRunning ? 'animate-pulse' : ''} />
        <span style={{ fontSize: 38, fontWeight: 700, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}
          data-testid="text-timer">
          {timelineState.formattedTime}
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
          {completed ? '✓ Complete' : 'Coordinating...'}
        </span>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 22, top: 0, bottom: 0, width: 1,
          background: `linear-gradient(to bottom, ${TEAL_LT}, rgba(255,255,255,0.08))`,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {timeline.map((event, index) => {
            const isActive = currentSecond >= event.time;
            const isLast = index === timeline.length - 1;

            return (
              <div
                key={event.time}
                style={{
                  position: 'relative',
                  paddingLeft: 56,
                  opacity: isActive ? 1 : 0.3,
                  transition: 'opacity 0.5s',
                }}
                data-testid={`timeline-event-${event.time}`}
              >
                <div style={{
                  position: 'absolute', left: 14, width: 18, height: 18, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive
                    ? isLast ? TEAL_LT : NAVY
                    : 'rgba(255,255,255,0.15)',
                  boxShadow: isActive ? `0 0 0 4px ${isLast ? 'rgba(59,175,138,0.25)' : 'rgba(201,168,76,0.25)'}` : 'none',
                  transition: 'all 0.5s',
                }}>
                  {isActive && getIcon(event.icon)}
                </div>

                <div style={{
                  borderRadius: 8,
                  border: isActive ? `1px solid ${isLast ? `${TEAL_LT}40` : 'rgba(201,168,76,0.2)'}` : '1px solid rgba(255,255,255,0.06)',
                  background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                  padding: '10px 14px',
                  transition: 'all 0.5s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                      background: isActive ? (isLast ? `${TEAL_LT}20` : 'rgba(201,168,76,0.12)') : 'rgba(255,255,255,0.06)',
                      color: isActive ? (isLast ? TEAL_LT : GOLD) : 'rgba(255,255,255,0.3)',
                      border: `1px solid ${isActive ? (isLast ? `${TEAL_LT}30` : 'rgba(201,168,76,0.2)') : 'rgba(255,255,255,0.06)'}`,
                    }}>
                      {event.label}
                    </span>
                    {event.stakeholderCount && isActive && (
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: 'rgba(255,255,255,0.4)',
                        whiteSpace: 'nowrap',
                      }}>
                        {event.stakeholderCount} people
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)', margin: 0, lineHeight: 1.5 }}>
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion summary */}
      {completed && (
        <div style={{
          borderRadius: 10,
          border: `2px solid ${TEAL_LT}40`,
          background: 'rgba(59,175,138,0.07)',
          padding: '20px 22px',
        }} data-testid="card-completion">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: TEAL_LT }}>12:00</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Total Time</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: TEAL_LT }}>193</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Stakeholders</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: TEAL_LT }}>$50M</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Budget Activated</div>
            </div>
          </div>
        </div>
      )}

      {!isRunning && !completed && (
        <button
          onClick={handleStart}
          style={{
            width: '100%', padding: '12px 0',
            background: GOLD, color: NAVY,
            borderRadius: 8, fontWeight: 700, fontSize: 14,
            border: 'none', cursor: 'pointer',
          }}
          className="hover:opacity-90 transition-opacity"
          data-testid="button-start-timer"
        >
          Start Response Coordination
        </button>
      )}
    </div>
  );
}
