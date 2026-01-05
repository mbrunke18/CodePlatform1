import { useDemoController } from '@/contexts/DemoController';
import { CheckCircle, Trophy, Zap, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export function CrisisResolvedCelebration() {
  const demoController = useDemoController();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!demoController.state.isActive) {
      setShow(false);
      return;
    }

    if (demoController.state.currentExecutiveStep === 5) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(hideTimer);
    } else {
      setShow(false);
    }
  }, [demoController.state.isActive, demoController.state.currentExecutiveStep]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500" data-testid="crisis-resolved-celebration">
      <Card className="bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 border-emerald-500 shadow-2xl max-w-2xl animate-in zoom-in duration-500">
        <div className="p-8 space-y-6 text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white">
              Crisis Resolved!
            </h2>
            <p className="text-xl text-emerald-300">
              12-Minute Coordinated Response Complete
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-emerald-500/30">
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-amber-400 mx-auto" />
              <div className="text-3xl font-bold text-white">12min</div>
              <div className="text-sm text-emerald-300">Response Time</div>
            </div>
            
            <div className="space-y-2 border-x border-emerald-500/30">
              <Trophy className="h-8 w-8 text-amber-400 mx-auto" />
              <div className="text-3xl font-bold text-white">$12M</div>
              <div className="text-sm text-emerald-300">Value Protected</div>
            </div>
            
            <div className="space-y-2">
              <TrendingUp className="h-8 w-8 text-amber-400 mx-auto" />
              <div className="text-3xl font-bold text-white">71hrs</div>
              <div className="text-sm text-emerald-300">Time Saved</div>
            </div>
          </div>

          {/* Competitive Advantage */}
          <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
            <div className="text-amber-400 font-bold text-lg mb-2">
              ⚡ Competitive Advantage Secured
            </div>
            <p className="text-amber-100 text-sm">
              While your competitors are still discovering this crisis through news alerts 
              (3 days behind), you've already resolved it, protected revenue, and maintained 
              stakeholder confidence. This is executive leadership in the AI era.
            </p>
          </div>

          {/* Preparedness Score Increase */}
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-purple-300">Executive Preparedness Score™</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-400">85</span>
                <span className="text-emerald-400 font-bold">+8</span>
              </div>
              <span className="text-purple-300">→</span>
              <span className="text-3xl font-bold text-purple-400">93</span>
            </div>
            <div className="text-sm text-purple-300 mt-2">
              You're now in the Top 1% of Fortune 1000 CEOs for crisis preparedness
            </div>
          </div>

          {/* Fireworks Effect */}
          <div className="text-6xl animate-bounce">
            🎉
          </div>
        </div>
      </Card>
    </div>
  );
}
