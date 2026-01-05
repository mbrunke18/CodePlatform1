import { useDemoController } from '@/contexts/DemoController';
import { useEffect, useState } from 'react';
import { UserX, TrendingDown, AlertCircle, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function PersonalReputationRiskOverlay() {
  const demoController = useDemoController();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (demoController.state.currentExecutiveStep === 2) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 7000);
      return () => clearTimeout(hideTimer);
    } else {
      setShow(false);
    }
  }, [demoController.state.currentExecutiveStep]);

  if (!show) return null;

  const scenarios = [
    {
      icon: MessageSquare,
      stakeholder: 'Board Member',
      quote: '"Why did our competitors respond 3 days faster than us?"',
      impact: 'Credibility questioned',
      color: 'from-orange-600 to-red-600'
    },
    {
      icon: TrendingDown,
      stakeholder: 'Activist Investor',
      quote: '"$12M lost because leadership was unprepared?"',
      impact: 'Competence challenged',
      color: 'from-red-600 to-pink-600'
    },
    {
      icon: AlertCircle,
      stakeholder: 'Major Shareholder',
      quote: '"Other Fortune 1000s had playbooks ready. Why didn\'t we?"',
      impact: 'Leadership effectiveness disputed',
      color: 'from-pink-600 to-purple-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />
      
      <Card className="relative w-[950px] bg-gradient-to-br from-slate-950/95 via-red-950/95 to-slate-950/95 border-red-500/50 p-8 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-red-600/30 rounded-lg">
                <UserX className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-3xl font-bold text-red-100">What They'll Ask You</h2>
            </div>
            <p className="text-xl text-red-200/90">72 hours later, when the damage is done</p>
          </div>

          {/* Scenarios */}
          <div className="space-y-4">
            {scenarios.map((scenario, idx) => {
              const Icon = scenario.icon;
              return (
                <div 
                  key={idx}
                  className="bg-black/40 rounded-lg p-5 border border-red-500/30 hover:border-red-500/50 transition-all"
                  style={{
                    animation: `slideIn 0.5s ease-out ${idx * 0.2}s backwards`
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-gradient-to-br ${scenario.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-red-300 font-semibold">{scenario.stakeholder}</p>
                        <span className="text-xs text-red-400 bg-red-600/20 px-2 py-1 rounded">
                          {scenario.impact}
                        </span>
                      </div>
                      <blockquote className="text-lg text-red-100 italic border-l-2 border-red-500/50 pl-4">
                        {scenario.quote}
                      </blockquote>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Warning */}
          <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-lg p-5 border border-red-500/40">
            <div className="text-center space-y-2">
              <p className="text-red-100 text-xl font-bold">
                Your Reputation Takes Decades to Build
              </p>
              <p className="text-red-200/80 text-lg">
                One 72-hour delay can destroy it
              </p>
            </div>
          </div>

          {/* CTA Hint */}
          <div className="text-center">
            <p className="text-red-300/70 text-sm">
              M executives answer these questions with data, not excuses
            </p>
          </div>
        </div>
      </Card>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
