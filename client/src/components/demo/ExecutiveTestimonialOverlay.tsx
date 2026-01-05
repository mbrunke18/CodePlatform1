import { useDemoController } from '@/contexts/DemoController';
import { useEffect, useState } from 'react';
import { Quote, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ExecutiveTestimonialOverlay() {
  const demoController = useDemoController();
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<'before' | 'after'>('before');

  useEffect(() => {
    if (demoController.state.currentExecutiveStep === 4) {
      setShow(true);
      
      const phaseTimer = setTimeout(() => {
        setPhase('after');
      }, 3500);
      
      const hideTimer = setTimeout(() => setShow(false), 8000);
      
      return () => {
        clearTimeout(phaseTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShow(false);
      setPhase('before');
    }
  }, [demoController.state.currentExecutiveStep]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300" />
      
      <Card className="relative w-[950px] bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 border-slate-500/50 p-8 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Quote className="h-8 w-8 text-slate-400" />
              <h2 className="text-2xl font-bold text-slate-200">The Cost of Unpreparedness</h2>
            </div>
            <p className="text-slate-400 text-sm">Illustrative Scenario: Before vs After M Methodology (Sample Data)</p>
          </div>

          {/* Testimonial Content */}
          <div className="relative min-h-[280px]">
            {/* Before */}
            <div className={`absolute inset-0 transition-all duration-700 ${
              phase === 'before' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
            }`}>
              <div className="bg-red-950/40 rounded-lg p-6 border border-red-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-600/30 rounded-full">
                    <Quote className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-sm text-red-400 font-semibold uppercase tracking-wide">
                      Without Preparation Framework
                    </p>
                    <blockquote className="text-xl text-red-100 leading-relaxed">
                      Traditional ad-hoc approach: When crisis hits, executives scramble to coordinate response. 
                      No playbooks, no rehearsed roles, no pre-built execution plans.
                    </blockquote>
                    <div className="space-y-2 pt-2">
                      <p className="text-red-200/80 italic">• Typical result: 72-hour coordination delay</p>
                      <p className="text-red-200/80 italic">• Common outcome: Missed execution windows</p>
                      <p className="text-red-200/80 italic">• Industry standard: Reactive vs anticipatory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* After */}
            <div className={`absolute inset-0 transition-all duration-700 ${
              phase === 'after' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}>
              <div className="bg-emerald-950/40 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-600/30 rounded-full">
                    <Sparkles className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-sm text-emerald-400 font-semibold uppercase tracking-wide">
                      With M Methodology
                    </p>
                    <blockquote className="text-xl text-emerald-100 leading-relaxed">
                      NFL-inspired approach: Pre-built playbooks for every scenario. Roles rehearsed. 
                      AI monitoring for early warning. One-click coordinated execution when trigger fires.
                    </blockquote>
                    <div className="space-y-2 pt-2">
                      <p className="text-emerald-200/80 italic">✓ Design goal: 12-minute execution from trigger</p>
                      <p className="text-emerald-200/80 italic">✓ Projected outcome: Capture windows competitors miss</p>
                      <p className="text-emerald-200/80 italic">✓ System capability: Preparation-driven velocity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transition Arrow */}
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              phase === 'after' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}>
              <div className="p-4 bg-gradient-to-r from-red-600 to-emerald-600 rounded-full">
                <ArrowRight className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-5 border border-slate-600/40">
            <p className="text-center text-slate-200 text-lg">
              {phase === 'before' ? (
                <span className="text-red-300">The question isn't IF a crisis will hit—it's whether you'll be prepared.</span>
              ) : (
                <span className="text-emerald-300 font-semibold">M turns strategic preparation into your competitive advantage.</span>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
