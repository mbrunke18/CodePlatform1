import { useDemoController } from '@/contexts/DemoController';
import { useTimelineState } from '@/contexts/DemoTimelineContext';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState, useMemo } from 'react';
import { demoData } from '@/lib/demoData';

export function LiveROICounter() {
  const demoController = useDemoController();
  const timelineState = useTimelineState();
  
  const [show, setShow] = useState(false);

  const targetAmount = demoData.roi.totalCostSavings;
  const targetHours = demoData.roi.hoursRecovered;

  const isActive = demoController.state.isActive;
  const currentStep = demoController.state.currentExecutiveStep;
  
  const elapsedSeconds = timelineState.elapsedSeconds;
  const isSharedTimelineRunning = timelineState.isRunning;

  useEffect(() => {
    if (!isActive) {
      setShow(false);
      return;
    }

    if (currentStep === 4 || (isSharedTimelineRunning && elapsedSeconds >= 300)) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(hideTimer);
    } else {
      setShow(false);
    }
  }, [isActive, currentStep, isSharedTimelineRunning, elapsedSeconds]);

  const { savedAmount, timeSavedHours } = useMemo(() => {
    if (!show) {
      return { savedAmount: 0, timeSavedHours: 0 };
    }

    if (timelineState.isRunning || timelineState.isComplete) {
      const progress = Math.min(timelineState.progress / 100, 1);
      return {
        savedAmount: targetAmount * progress,
        timeSavedHours: targetHours * progress
      };
    }

    const progress = Math.min(elapsedSeconds / 720, 1);
    return {
      savedAmount: targetAmount * progress,
      timeSavedHours: targetHours * progress
    };
  }, [show, timelineState, elapsedSeconds, targetAmount, targetHours]);

  if (!show) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isComplete = savedAmount >= targetAmount;

  return (
    <div className="fixed top-20 left-6 z-40" data-testid="live-roi-counter">
      <Card className="bg-gradient-to-br from-emerald-950/90 to-green-950/90 border-emerald-500/30 backdrop-blur-sm shadow-2xl">
        <div className="p-4 space-y-3 min-w-[280px]">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Live ROI Calculation
            </div>
            <DollarSign className="h-4 w-4 text-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="text-center">
              <div className="text-xs text-emerald-400/70 font-medium mb-1">
                Revenue Protected
              </div>
              <div className="text-4xl font-bold text-emerald-400 tabular-nums tracking-tight" data-testid="text-roi-amount">
                {formatCurrency(savedAmount)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-500/20">
              <div className="text-center">
                <div className="text-xs text-emerald-300/70 mb-1">
                  Time Saved
                </div>
                <div className="text-xl font-bold text-emerald-300 tabular-nums" data-testid="text-time-saved">
                  {Math.floor(timeSavedHours)}h {Math.floor((timeSavedHours % 1) * 60)}m
                </div>
              </div>
              
              <div className="text-center border-l border-emerald-500/20">
                <div className="text-xs text-emerald-300/70 mb-1">
                  Cost/Hour
                </div>
                <div className="text-xl font-bold text-emerald-300 tabular-nums">
                  {formatCurrency(targetAmount / targetHours)}
                </div>
              </div>
            </div>
          </div>

          {isComplete && (
            <div className="pt-3 border-t border-emerald-500/30">
              <div className="flex items-center justify-center gap-2 text-emerald-400 animate-pulse">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-bold">
                  ✓ Full Crisis Value Protected!
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
