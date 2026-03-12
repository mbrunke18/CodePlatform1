import { useEffect, useState } from 'react';
import { dynamicStrategySimulator } from '@/services/dynamicStrategySimulator';

export function useDynamicStrategySimulator(autoStart: boolean = false) {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(dynamicStrategySimulator.getStatus());

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }

    const interval = setInterval(() => {
      setStatus(dynamicStrategySimulator.getStatus());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [autoStart]);

  const handleStart = () => {
    dynamicStrategySimulator.start();
    setIsRunning(true);
  };

  const handleStop = () => {
    dynamicStrategySimulator.stop();
    setIsRunning(false);
  };

  const launchScenario = (scenarioId: string, scenarioName: string) => {
    dynamicStrategySimulator.launchScenario(scenarioId, scenarioName);
  };

  return {
    isRunning,
    status,
    start: handleStart,
    stop: handleStop,
    launchScenario
  };
}
