import { useDemoController } from '@/contexts/DemoController';
import { X, Check, Clock, Users, Mail, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export function BeforeAfterComparison() {
  const demoController = useDemoController();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!demoController.state.isActive) {
      setShow(false);
      return;
    }

    if (demoController.state.currentExecutiveStep === 3) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(hideTimer);
    } else {
      setShow(false);
    }
  }, [demoController.state.isActive, demoController.state.currentExecutiveStep]);

  if (!show) return null;

  const traditionalApproach = [
    { icon: Clock, text: '72 hours to coordinate', bad: true },
    { icon: Mail, text: 'Sequential email chains', bad: true },
    { icon: Phone, text: '47 individual phone calls', bad: true },
    { icon: Users, text: 'Conflicting instructions', bad: true },
    { icon: X, text: 'Departments out of sync', bad: true },
  ];

  const vexorCoordination = [
    { icon: Clock, text: '12 minutes full coordination', bad: false },
    { icon: Check, text: 'Parallel playbook distribution', bad: false },
    { icon: Users, text: 'Everyone knows their role', bad: false },
    { icon: Check, text: 'Real-time task tracking', bad: false },
    { icon: Check, text: 'Automated stakeholder sync', bad: false },
  ];

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none" data-testid="before-after-comparison">
      <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md shadow-2xl max-w-4xl">
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Traditional Response vs M
            </h3>
            <p className="text-slate-400">Same crisis. Radically different outcomes.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Traditional Approach */}
            <div className="space-y-4">
              <div className="text-center pb-3 border-b border-red-500/30">
                <div className="text-lg font-bold text-red-400">Traditional Approach</div>
                <div className="text-sm text-red-300/70">72-Hour Coordination Process</div>
              </div>
              
              <div className="space-y-3">
                {traditionalApproach.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 bg-red-950/30 border border-red-500/20 rounded-lg p-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-red-400" />
                      </div>
                      <span className="text-sm text-red-200">{item.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-3 border-t border-red-500/30">
                <div className="text-3xl font-bold text-red-400">72hrs</div>
                <div className="text-xs text-red-300/70">Average Response Time</div>
              </div>
            </div>

            {/* M Coordination */}
            <div className="space-y-4">
              <div className="text-center pb-3 border-b border-emerald-500/30">
                <div className="text-lg font-bold text-emerald-400">M Platform</div>
                <div className="text-sm text-emerald-300/70">12-Minute Orchestrated Response</div>
              </div>
              
              <div className="space-y-3">
                {vexorCoordination.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="text-sm text-emerald-200">{item.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-3 border-t border-emerald-500/30">
                <div className="text-3xl font-bold text-emerald-400">12min</div>
                <div className="text-xs text-emerald-300/70">M Response Time</div>
              </div>
            </div>
          </div>

          {/* Bottom Impact Line */}
          <div className="mt-6 pt-4 border-t border-slate-700 text-center">
            <div className="text-amber-400 font-bold text-lg">
              6,000% Faster Response Time
            </div>
            <div className="text-slate-400 text-sm mt-1">
              This is the competitive advantage Fortune 1000 executives demand
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
