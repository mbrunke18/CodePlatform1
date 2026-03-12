import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface TimelineEvent {
  time: number;
  id: string;
  callback?: () => void;
}

export interface DemoTimelineConfig {
  duration: number;
  tickInterval?: number;
  speedMultiplier?: number;
  autoStart?: boolean;
  events?: TimelineEvent[];
  onComplete?: () => void;
  onTick?: (elapsedMs: number) => void;
  onPhaseChange?: (phase: string) => void;
}

export interface DemoTimelineState {
  elapsedMs: number;
  elapsedSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  progress: number;
  currentPhase: string;
  formattedTime: string;
}

export interface DemoTimelineControls {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  jumpTo: (ms: number) => void;
  setPhase: (phase: string) => void;
}

export function useDemoTimeline(config: DemoTimelineConfig): [DemoTimelineState, DemoTimelineControls] {
  const {
    duration,
    tickInterval = 100,
    speedMultiplier = 1,
    autoStart = false,
    events = [],
    onComplete,
    onTick,
    onPhaseChange
  } = config;

  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('intro');
  
  const firedEventsRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setElapsedMs(0);
    setIsRunning(true);
    setIsPaused(false);
    setIsComplete(false);
    firedEventsRef.current.clear();
    lastTickRef.current = performance.now();
    
    intervalRef.current = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTickRef.current) * speedMultiplier;
      lastTickRef.current = now;
      
      setElapsedMs(prev => {
        const newElapsed = prev + delta;
        
        if (newElapsed >= duration) {
          clearTimer();
          setIsRunning(false);
          setIsComplete(true);
          onComplete?.();
          return duration;
        }
        
        onTick?.(newElapsed);
        return newElapsed;
      });
    }, tickInterval);
  }, [duration, tickInterval, speedMultiplier, onComplete, onTick, clearTimer]);

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
        const newElapsed = prev + delta;
        
        if (newElapsed >= duration) {
          clearTimer();
          setIsRunning(false);
          setIsComplete(true);
          onComplete?.();
          return duration;
        }
        
        onTick?.(newElapsed);
        return newElapsed;
      });
    }, tickInterval);
  }, [isPaused, isComplete, duration, tickInterval, speedMultiplier, onComplete, onTick, clearTimer]);

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
    
    events.forEach(event => {
      if (event.time <= clampedMs) {
        firedEventsRef.current.add(event.id);
      } else {
        firedEventsRef.current.delete(event.id);
      }
    });
    
    if (clampedMs >= duration) {
      setIsComplete(true);
      setIsRunning(false);
    }
  }, [duration, events]);

  const setPhase = useCallback((phase: string) => {
    setCurrentPhase(phase);
    onPhaseChange?.(phase);
  }, [onPhaseChange]);

  useEffect(() => {
    events.forEach(event => {
      if (elapsedMs >= event.time && !firedEventsRef.current.has(event.id)) {
        firedEventsRef.current.add(event.id);
        event.callback?.();
      }
    });
  }, [elapsedMs, events]);

  useEffect(() => {
    if (autoStart) {
      start();
    }
    return clearTimer;
  }, [autoStart, start, clearTimer]);

  const state: DemoTimelineState = useMemo(() => {
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
      currentPhase,
      formattedTime: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    };
  }, [elapsedMs, isRunning, isPaused, isComplete, duration, currentPhase]);

  const controls: DemoTimelineControls = useMemo(() => ({
    start,
    pause,
    resume,
    reset,
    jumpTo,
    setPhase
  }), [start, pause, resume, reset, jumpTo, setPhase]);

  return [state, controls];
}

export function formatDemoTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}
