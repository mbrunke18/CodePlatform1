import { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo, type ReactNode } from 'react';

export interface DemoTimelineState {
  elapsedMs: number;
  elapsedSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  progress: number;
  formattedTime: string;
  currentPhase: string;
  speedMultiplier: number;
}

export interface TimelineEvent {
  time: number;
  id: string;
  callback?: () => void;
}

interface DemoTimelineContextType {
  state: DemoTimelineState;
  start: (config?: { duration?: number; speedMultiplier?: number }) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  jumpTo: (ms: number) => void;
  setPhase: (phase: string) => void;
  setSpeedMultiplier: (multiplier: number) => void;
  registerEvent: (event: TimelineEvent) => void;
  unregisterEvent: (eventId: string) => void;
  subscribe: (callback: (state: DemoTimelineState) => void) => () => void;
}

const DemoTimelineContext = createContext<DemoTimelineContextType | null>(null);

export function useDemoTimelineContext() {
  const context = useContext(DemoTimelineContext);
  if (!context) {
    throw new Error('useDemoTimelineContext must be used within a DemoTimelineProvider');
  }
  return context;
}

export function useTimelineSafe() {
  return useContext(DemoTimelineContext);
}

export function useTimelineState() {
  const context = useContext(DemoTimelineContext);
  return context?.state ?? {
    elapsedMs: 0,
    elapsedSeconds: 0,
    isRunning: false,
    isPaused: false,
    isComplete: false,
    progress: 0,
    formattedTime: '00:00',
    currentPhase: 'intro',
    speedMultiplier: 20
  };
}

let isTimelineStarted = false;

export function useTimelineOrchestrator() {
  const context = useContext(DemoTimelineContext);
  
  const startOnce = useCallback((config?: { duration?: number; speedMultiplier?: number }) => {
    if (!context) return;
    if (isTimelineStarted && (context.state.isRunning || context.state.elapsedMs > 0)) {
      return;
    }
    isTimelineStarted = true;
    context.start(config);
  }, [context]);
  
  const resetAll = useCallback(() => {
    if (!context) return;
    isTimelineStarted = false;
    context.reset();
  }, [context]);
  
  return {
    startOnce,
    resetAll,
    pause: context?.pause ?? (() => {}),
    resume: context?.resume ?? (() => {})
  };
}

interface DemoTimelineProviderProps {
  children: React.ReactNode;
  defaultDuration?: number;
  defaultSpeedMultiplier?: number;
}

export function DemoTimelineProvider({ 
  children, 
  defaultDuration = 720000,
  defaultSpeedMultiplier = 12
}: DemoTimelineProviderProps) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [duration, setDuration] = useState(defaultDuration);
  const [speedMultiplier, setSpeedMultiplierState] = useState(defaultSpeedMultiplier);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(0);
  const eventsRef = useRef<Map<string, TimelineEvent>>(new Map());
  const firedEventsRef = useRef<Set<string>>(new Set());
  const subscribersRef = useRef<Set<(state: DemoTimelineState) => void>>(new Set());

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const notifySubscribers = useCallback((state: DemoTimelineState) => {
    subscribersRef.current.forEach(callback => callback(state));
  }, []);

  const checkAndFireEvents = useCallback((currentMs: number) => {
    eventsRef.current.forEach((event, eventId) => {
      if (currentMs >= event.time && !firedEventsRef.current.has(eventId)) {
        firedEventsRef.current.add(eventId);
        event.callback?.();
      }
    });
  }, []);

  const start = useCallback((config?: { duration?: number; speedMultiplier?: number }) => {
    clearTimer();
    
    if (config?.duration) setDuration(config.duration);
    if (config?.speedMultiplier) setSpeedMultiplierState(config.speedMultiplier);
    
    const activeDuration = config?.duration || duration;
    const activeSpeed = config?.speedMultiplier || speedMultiplier;
    
    setElapsedMs(0);
    setIsRunning(true);
    setIsPaused(false);
    setIsComplete(false);
    firedEventsRef.current.clear();
    lastTickRef.current = performance.now();

    intervalRef.current = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTickRef.current) * activeSpeed;
      lastTickRef.current = now;

      setElapsedMs(prev => {
        const newElapsed = Math.min(prev + delta, activeDuration);
        
        checkAndFireEvents(newElapsed);

        if (newElapsed >= activeDuration) {
          clearTimer();
          setIsRunning(false);
          setIsComplete(true);
        }

        return newElapsed;
      });
    }, 50);
  }, [duration, speedMultiplier, clearTimer, checkAndFireEvents]);

  const pause = useCallback(() => {
    clearTimer();
    setIsPaused(true);
    setIsRunning(false);
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (!isPaused || isComplete) return;

    setIsPaused(false);
    setIsRunning(true);
    lastTickRef.current = performance.now();

    intervalRef.current = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTickRef.current) * speedMultiplier;
      lastTickRef.current = now;

      setElapsedMs(prev => {
        const newElapsed = Math.min(prev + delta, duration);
        
        checkAndFireEvents(newElapsed);

        if (newElapsed >= duration) {
          clearTimer();
          setIsRunning(false);
          setIsComplete(true);
        }

        return newElapsed;
      });
    }, 50);
  }, [isPaused, isComplete, duration, speedMultiplier, clearTimer, checkAndFireEvents]);

  const reset = useCallback(() => {
    clearTimer();
    setElapsedMs(0);
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    setCurrentPhase('intro');
    firedEventsRef.current.clear();
  }, [clearTimer]);

  const jumpTo = useCallback((ms: number) => {
    const clampedMs = Math.min(Math.max(0, ms), duration);
    setElapsedMs(clampedMs);

    firedEventsRef.current.clear();
    eventsRef.current.forEach((event, eventId) => {
      if (event.time <= clampedMs) {
        firedEventsRef.current.add(eventId);
      }
    });

    if (clampedMs >= duration) {
      setIsComplete(true);
      setIsRunning(false);
    }
  }, [duration]);

  const setPhase = useCallback((phase: string) => {
    setCurrentPhase(phase);
  }, []);

  const setSpeedMultiplier = useCallback((multiplier: number) => {
    setSpeedMultiplierState(multiplier);
  }, []);

  const registerEvent = useCallback((event: TimelineEvent) => {
    eventsRef.current.set(event.id, event);
    
    if (elapsedMs >= event.time && !firedEventsRef.current.has(event.id)) {
      firedEventsRef.current.add(event.id);
      event.callback?.();
    }
  }, [elapsedMs]);

  const unregisterEvent = useCallback((eventId: string) => {
    eventsRef.current.delete(eventId);
    firedEventsRef.current.delete(eventId);
  }, []);

  const subscribe = useCallback((callback: (state: DemoTimelineState) => void) => {
    subscribersRef.current.add(callback);
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const state = useMemo((): DemoTimelineState => {
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;

    return {
      elapsedMs,
      elapsedSeconds,
      isRunning,
      isPaused,
      isComplete,
      progress: duration > 0 ? (elapsedMs / duration) * 100 : 0,
      formattedTime: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      currentPhase,
      speedMultiplier
    };
  }, [elapsedMs, isRunning, isPaused, isComplete, duration, currentPhase, speedMultiplier]);

  useEffect(() => {
    notifySubscribers(state);
  }, [state, notifySubscribers]);

  const value = useMemo(() => ({
    state,
    start,
    pause,
    resume,
    reset,
    jumpTo,
    setPhase,
    setSpeedMultiplier,
    registerEvent,
    unregisterEvent,
    subscribe
  }), [state, start, pause, resume, reset, jumpTo, setPhase, setSpeedMultiplier, registerEvent, unregisterEvent, subscribe]);

  return (
    <DemoTimelineContext.Provider value={value}>
      {children}
    </DemoTimelineContext.Provider>
  );
}
