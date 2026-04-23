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
      
      <Card className="relative w-[950px] border-slate-500/50 p-8 animate-in zoom-in-95 duration-500">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Quote className="h-8 w-8 text-gray-800" />
              <h2 className="text-2xl font-bold text-gray-800">The Cost of Unpreparedness</h2>
            </div>
            <p className="text-gray-800 text-sm">Illustrative Scenario: Before vs After Readiness OS Methodology (Sample Data)</p>
          </div>

          {/* Testimonial Content */}
          <div className="relative min-h-[280px]">
            {/* Before */}
            <div className={`absolute inset-0 transition-all duration-700 ${
              phase === 'before' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
            }`}>
              <div className="bg-red-950/40 p-6 border border-red-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-600/30">
                    <Quote className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-sm text-red-400 font-semibold uppercase tracking-wide">
                      Without Preparation Framework
                    </p>
                    <blockquote className="text-xl text-red-500 leading-relaxed">
                      Traditional ad-hoc approach: When crisis hits, executives scramble to coordinate response. 
                      No Readiness Protocols, no rehearsed roles, no pre-built execution plans.
                    </blockquote>
                    <div className="space-y-2 pt-2">
                      <p className="text-red-700/80 italic">• Typical result: 30-day mobilization cycle</p>
                      <p className="text-red-700/80 italic">• Common outcome: Missed execution windows</p>
                      <p className="text-red-700/80 italic">• Industry standard: Reactive vs anticipatory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* After */}
            <div className={`absolute inset-0 transition-all duration-700 ${
              phase === 'after' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}>
              <div className="bg-[#2B8A6E]/15 p-6 border border-[#2B8A6E]/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#2B8A6E]/30">
                    <Sparkles className="h-6 w-6 text-[#2B8A6E]" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-sm text-[#2B8A6E] font-semibold uppercase tracking-wide">
                      With Readiness OS Methodology
                    </p>
                    <blockquote className="text-xl text-[#2B8A6E] leading-relaxed">
                      Execution infrastructure approach: Pre-built prepared responses with governance pre-defined. 
                      Signal monitoring for early warning. Coordinated execution with clear decision rights when trigger fires.
                    </blockquote>
                    <div className="space-y-2 pt-2">
                      <p className="text-[#2B8A6E]/80 italic">✓ Design goal: 12-minute execution from trigger</p>
                      <p className="text-[#2B8A6E]/80 italic">✓ Projected outcome: Capture windows competitors miss</p>
                      <p className="text-[#2B8A6E]/80 italic">✓ System capability: Preparation-driven velocity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transition Arrow */}
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              phase === 'after' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}>
              <div className="p-4 bg-gradient-to-r from-red-600 to-[#256B56]">
                <ArrowRight className="h-8 w-8 text-gray-900" />
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className=" p-5 border border-slate-600/40">
            <p className="text-center text-gray-800 text-lg">
              {phase === 'before' ? (
                <span className="text-red-300">The question isn't IF a crisis will hit—it's whether you'll be prepared.</span>
              ) : (
                <span className="text-[#2B8A6E] font-semibold">Readiness OS turns strategic preparation into your competitive advantage.</span>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
