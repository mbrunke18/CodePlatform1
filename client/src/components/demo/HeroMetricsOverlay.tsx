import { useDemoController } from '@/contexts/DemoController';
import { Shield, Zap, Target, Dumbbell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export function HeroMetricsOverlay() {
  const demoController = useDemoController();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!demoController.state.isActive) {
      setShow(false);
      return;
    }

    if (demoController.state.currentExecutiveStep === 0) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(hideTimer);
    } else {
      setShow(false);
    }
  }, [demoController.state.isActive, demoController.state.currentExecutiveStep]);

  const metrics = [
    {
      icon: Zap,
      label: 'Decision Velocity',
      value: '12 min',
      comparison: 'vs 72 hrs',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30'
    },
    {
      icon: Shield,
      label: 'Preparedness Score™',
      value: '85',
      comparison: 'Top 3%',
      color: 'text-[#0A0F2E]',
      bgColor: 'bg-[#0A0F2E]/10',
      borderColor: 'border-[#2B8A6E]/30'
    },
    {
      icon: Target,
      label: 'Active Triggers',
      value: '24/7',
      comparison: 'AI Monitoring',
      color: 'text-[#C9A84C]',
      bgColor: 'bg-[#C9A84C]/10',
      borderColor: 'border-[#C9A84C]/30'
    },
    {
      icon: Dumbbell,
      label: 'Practice Mode',
      value: 'Live',
      comparison: 'What-If Ready',
      color: 'text-[#2B8A6E]',
      bgColor: 'bg-[#2B8A6E]/10',
      borderColor: 'border-[#2B8A6E]/30'
    }
  ];

  if (!show) return null;

  return (
    <div className="fixed top-20 right-6 z-40 space-y-2" data-testid="hero-metrics-overlay">
      <div className="text-xs font-semibold text-gray-900/60 text-right mb-2">
        YOUR COMPETITIVE ADVANTAGE
      </div>
      
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={index}
            className={`${metric.bgColor} ${metric.borderColor} border backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            style={{
              animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="p-3 flex items-center gap-3">
              <div className={`${metric.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-900/70 font-medium truncate">
                  {metric.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-lg font-bold ${metric.color}`}>
                    {metric.value}
                  </span>
                  <span className="text-xs text-gray-900/50">
                    {metric.comparison}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
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
