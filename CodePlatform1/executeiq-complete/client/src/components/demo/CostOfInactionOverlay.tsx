import { useDemoController } from '@/contexts/DemoController';
import { useEffect, useState } from 'react';
import { TrendingDown, Clock, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function CostOfInactionOverlay() {
  const demoController = useDemoController();
  const [show, setShow] = useState(false);
  const [elapsedDays, setElapsedDays] = useState(0);

  useEffect(() => {
    if (demoController.state.currentExecutiveStep === 1) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 7000);
      return () => clearTimeout(hideTimer);
    } else {
      setShow(false);
    }
  }, [demoController.state.currentExecutiveStep]);

  useEffect(() => {
    if (!show) {
      setElapsedDays(0);
      return;
    }
    
    const interval = setInterval(() => {
      setElapsedDays(prev => Math.min(prev + 1, 90));
    }, 50);
    
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const dailyLosses = {
    revenue: 847000,
    marketShare: 0.3,
    competitiveAdvantage: 12,
    executiveHours: 47
  };

  const totalRevenueLost = (dailyLosses.revenue * elapsedDays).toLocaleString();
  const totalMarketShareLost = (dailyLosses.marketShare * elapsedDays).toFixed(1);
  const totalHoursWasted = (dailyLosses.executiveHours * elapsedDays).toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />
      
      <Card className="relative w-[900px] bg-gradient-to-br from-red-950/95 via-red-900/95 to-orange-950/95 border-red-500/50 p-8 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-red-600/30 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-400 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-red-100">Every Day You Wait...</h2>
            </div>
            <p className="text-xl text-red-200/90">The cost of traditional crisis response adds up</p>
          </div>

          {/* Counter */}
          <div className="bg-black/40 rounded-lg p-4 border border-red-500/30">
            <div className="text-center">
              <p className="text-red-300 text-sm mb-2">Days Without M</p>
              <div className="text-6xl font-bold text-red-400 tabular-nums">
                {elapsedDays}
              </div>
            </div>
          </div>

          {/* Loss Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-600/20 rounded">
                  <DollarSign className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-red-300 text-sm">Revenue at Risk</p>
                  <p className="text-2xl font-bold text-red-100">${totalRevenueLost}</p>
                  <p className="text-xs text-red-400 mt-1">From delayed crisis responses</p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-600/20 rounded">
                  <TrendingDown className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-red-300 text-sm">Market Share Lost</p>
                  <p className="text-2xl font-bold text-red-100">{totalMarketShareLost}%</p>
                  <p className="text-xs text-red-400 mt-1">To faster-moving competitors</p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-600/20 rounded">
                  <Clock className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-red-300 text-sm">Executive Hours Wasted</p>
                  <p className="text-2xl font-bold text-red-100">{totalHoursWasted}</p>
                  <p className="text-xs text-red-400 mt-1">In reactive crisis coordination</p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-600/20 rounded">
                  <Users className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-red-300 text-sm">Opportunities Missed</p>
                  <p className="text-2xl font-bold text-red-100">{elapsedDays * 3}</p>
                  <p className="text-xs text-red-400 mt-1">Competitive advantages lost forever</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="bg-red-600/20 rounded-lg p-4 border border-red-500/30">
            <p className="text-center text-red-100 text-lg font-semibold">
              Your competitors aren't waiting. Neither should you.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
