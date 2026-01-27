import { useDemoController } from '@/contexts/DemoController';
import { Calendar, ArrowRight, Shield, Zap, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function PowerfulCTA() {
  const demoController = useDemoController();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!demoController.state.isActive) {
      setShow(false);
      return;
    }

    if (demoController.state.currentExecutiveStep === 5) {
      const showTimer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(showTimer);
    } else {
      setShow(false);
    }
  }, [demoController.state.isActive, demoController.state.currentExecutiveStep]);

  if (!show) return null;

  const urgencyPoints = [
    { icon: Zap, text: 'Your competitors are seeing this demo too', color: 'text-amber-400' },
    { icon: Shield, text: 'Every day without M = increased crisis risk', color: 'text-red-400' },
    { icon: Users, text: '23 Fortune 1000 CEOs activated last month', color: 'text-emerald-400' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" data-testid="powerful-cta">
      <Card className="bg-gradient-to-r from-blue-950 via-purple-950 to-indigo-950 border-blue-500 shadow-2xl backdrop-blur-sm">
        <div className="p-6 space-y-4 max-w-3xl">
          {/* Main CTA */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-white">
              Ready to Transform Your Crisis Response?
            </h3>
            <p className="text-lg text-blue-200">
              Schedule your personalized war room workshop and activate your executive triggers within 48 hours
            </p>
          </div>

          {/* Urgency Points */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-blue-500/30">
            {urgencyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${point.color}`} />
                  <span className="text-sm text-blue-100">{point.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-200"
              data-testid="cta-schedule-workshop"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule War Room Workshop
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-blue-500 text-blue-200 hover:bg-blue-900/50 px-8 py-6 text-lg"
              data-testid="cta-contact-sales"
            >
              Contact Executive Sales
            </Button>
          </div>

          {/* Value Props */}
          <div className="flex items-center justify-center gap-8 pt-4 text-sm text-blue-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>48-hour activation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>White-glove onboarding</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Board-ready ROI in 30 days</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center pt-4 border-t border-blue-500/30">
            <p className="text-sm text-blue-300">
              Trusted by <span className="font-bold text-blue-200">127 Fortune 1000 companies</span> protecting 
              <span className="font-bold text-emerald-400"> $47B</span> in combined annual revenue
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
