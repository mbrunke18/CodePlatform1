import { useDemoController } from '@/contexts/DemoController';
import { Clock, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export function CompetitorLagClock() {
  const demoController = useDemoController();
  const [vexorTime, setMTime] = useState(0);
  const [competitorTime, setCompetitorTime] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!demoController.state.isActive) {
      setShow(false);
      setMTime(0);
      setCompetitorTime(0);
      return;
    }

    if (demoController.state.currentExecutiveStep === 1) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(hideTimer);
    } else {
      setShow(false);
      setMTime(0);
      setCompetitorTime(0);
    }
  }, [demoController.state.isActive, demoController.state.currentExecutiveStep]);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setMTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 12) {
          clearInterval(interval);
          return 12;
        }
        return newTime;
      });
      
      setCompetitorTime(prev => Math.min(prev + 6, 72));
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const timeSaved = competitorTime - vexorTime;
  const advantageHours = Math.floor(timeSaved / 60);
  const advantageMinutes = timeSaved % 60;

  return (
    <div className="fixed bottom-6 right-6 z-40" data-testid="competitor-lag-clock">
      <Card className="bg-gradient-to-br from-red-950/90 to-orange-950/90 border-red-500/30 backdrop-blur-sm shadow-2xl">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-red-300 uppercase tracking-wider">
              Decision Velocity
            </div>
            <Clock className="h-4 w-4 text-red-400 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xs text-emerald-400 font-medium mb-1">
                M
              </div>
              <div className="text-3xl font-bold text-emerald-400 tabular-nums">
                {vexorTime}
              </div>
              <div className="text-xs text-emerald-300/70">minutes</div>
            </div>

            <div className="text-center border-l border-red-500/30 pl-4">
              <div className="text-xs text-gray-400 font-medium mb-1">
                COMPETITORS
              </div>
              <div className="text-3xl font-bold text-gray-300 tabular-nums">
                {competitorTime}
              </div>
              <div className="text-xs text-gray-400">minutes</div>
            </div>
          </div>
          
          {/* Time Compression Indicator */}
          <div className="text-center pt-2 border-t border-red-500/20">
            <div className="text-xs text-amber-400/70 font-medium">
              ⚡ Demo Speed: 1 sec = 1 min realtime
            </div>
          </div>

          {timeSaved > 0 && (
            <div className="pt-3 border-t border-red-500/30">
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  {advantageHours}h {advantageMinutes}m Competitive Advantage
                </span>
              </div>
            </div>
          )}

          {vexorTime === 12 && (
            <div className="text-center pt-2">
              <div className="text-xs font-bold text-emerald-400 animate-pulse">
                ✓ CRISIS RESOLVED
              </div>
              <div className="text-xs text-gray-400 mt-1">
                While competitors are still discovering the problem...
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
