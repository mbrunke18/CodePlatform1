import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Briefcase, ArrowRight, Play, Building2, Sparkles, FileText, TrendingUp, Users } from "lucide-react";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";

export default function DemoRouter() {
  const [, setLocation] = useLocation();

  const demoOptions = [
    {
      id: 'customer',
      title: 'Executive Demo',
      duration: '5 minutes',
      description: 'See how M transforms 72-hour coordination into 12-minute execution. Role-specific wins for CEO, COO, CISO, and more.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/30 hover:border-blue-500',
      iconBg: 'bg-blue-500/20',
      path: '/customer-demo',
      badge: 'For Buyers',
      badgeColor: 'bg-blue-500',
      recommended: true
    },
    {
      id: 'quick',
      title: 'Quick Demo',
      duration: '3 minutes',
      description: 'See a playbook activate and tasks deploy in real-time. Perfect for a quick overview.',
      icon: Zap,
      color: 'from-emerald-500 to-teal-500',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500',
      iconBg: 'bg-emerald-500/20',
      path: '/demo/live-activation',
      badge: 'Quick Start',
      badgeColor: 'bg-emerald-500',
      recommended: false
    },
    {
      id: 'simulation',
      title: 'Full Simulation',
      duration: '12 minutes',
      description: 'Step into the role of a Fortune 500 CSO. Experience signal detection, playbook activation, and coordinated response.',
      icon: Briefcase,
      color: 'from-purple-500 to-violet-500',
      borderColor: 'border-purple-500/30 hover:border-purple-500',
      iconBg: 'bg-purple-500/20',
      path: '/executive-simulation',
      badge: 'Deep Dive',
      badgeColor: 'bg-purple-500',
      recommended: false
    },
    {
      id: 'industry',
      title: 'Industry Demos',
      duration: '10-15 minutes',
      description: 'See M configured for your industry: Financial Services, Healthcare, Manufacturing, Retail, Energy, and Luxury.',
      icon: Building2,
      color: 'from-amber-500 to-orange-500',
      borderColor: 'border-amber-500/30 hover:border-amber-500',
      iconBg: 'bg-amber-500/20',
      path: '/industry-demos',
      badge: '6 Industries',
      badgeColor: 'bg-amber-500',
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <StandardNav />
      
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          {/* Header */}
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              Interactive Experience
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="heading-demo-router">
              Experience M
            </h1>
            <p className="text-xl text-slate-400">
              Choose the demo that fits your schedule
            </p>
          </div>

          {/* Recommended Callout */}
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-950/50 to-cyan-950/50 border border-blue-500/30 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium mb-1">Recommended for executives</p>
                <p className="text-sm text-slate-400 mb-3">
                  See how M delivers 12-minute coordinated response with role-specific wins.
                </p>
                <Button
                  onClick={() => setLocation('/customer-demo')}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-recommended-demo"
                >
                  <Play className="h-4 w-4 mr-1.5" />
                  Start Executive Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Demo Options */}
          <div className="space-y-4 mb-10">
            {demoOptions.map((demo) => {
              const IconComponent = demo.icon;
              return (
                <Card 
                  key={demo.id}
                  className={`bg-slate-900/50 border-2 ${demo.borderColor} cursor-pointer transition-all hover:shadow-xl group`}
                  onClick={() => setLocation(demo.path)}
                  data-testid={`card-demo-${demo.id}`}
                >
                  <CardContent className="p-5 md:p-6 flex items-center gap-4 md:gap-6">
                    {/* Icon */}
                    <div className={`p-3 md:p-4 rounded-2xl bg-gradient-to-br ${demo.color} flex-shrink-0`}>
                      <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {demo.title}
                        </h3>
                        <Badge className={`${demo.badgeColor} text-white text-xs`}>
                          {demo.badge}
                        </Badge>
                      </div>
                      <p className="text-slate-400 mb-2 text-sm md:text-base line-clamp-2">{demo.description}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{demo.duration}</span>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Alternative Path */}
          <div className="text-center mb-10">
            <p className="text-slate-500 mb-4">
              Want to explore on your own?
            </p>
            <Button
              variant="outline"
              onClick={() => setLocation('/playbook-library')}
              className="text-slate-300 border-slate-700 hover:bg-slate-800"
              data-testid="button-explore-playbooks"
            >
              Browse 166 Playbooks →
            </Button>
          </div>

          {/* Investor/Roadshow Resources */}
          <div className="p-5 bg-purple-950/30 border border-purple-500/30 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Investor?</p>
                  <p className="text-sm text-slate-400">Locked demo, FAQ, and roadshow materials</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setLocation('/investor-demo')}
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-950 flex-1 sm:flex-initial"
                  data-testid="button-investor-demo"
                >
                  Investor Demo
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/roadshow-resources')}
                  className="text-purple-300 hover:bg-purple-950 flex-1 sm:flex-initial"
                  data-testid="button-roadshow-resources"
                >
                  Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
