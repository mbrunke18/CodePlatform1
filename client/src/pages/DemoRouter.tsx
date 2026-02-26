import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Briefcase, ArrowRight, Play, Building2, Sparkles, FileText, TrendingUp, Users } from "lucide-react";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { BrandStamp } from "@/components/BrandStamp";

export default function DemoRouter() {
  const [, setLocation] = useLocation();

  const demoOptions = [
    {
      id: 'customer',
      title: 'Executive Demo',
      duration: '6 minutes',
      description: 'See predictive AI, what-if scenarios, and 12-minute execution. Role-specific wins for CEO, COO, CISO, and more.',
      icon: Users,
      color: 'from-[#0A0F2E] to-[#2B8A6E]',
      borderColor: 'border-[#0A0F2E]/30 hover:border-[#0A0F2E]',
      iconBg: 'bg-[#0A0F2E]/20',
      path: '/customer-demo',
      badge: 'For Buyers',
      badgeColor: 'bg-[#0A0F2E]',
      recommended: true
    },
    {
      id: 'quick',
      title: 'Quick Demo',
      duration: '3 minutes',
      description: 'See a playbook activate and tasks deploy in real-time. Perfect for a quick overview.',
      icon: Zap,
      color: 'from-[#2B8A6E] to-[#DFC178]',
      borderColor: 'border-[#2B8A6E]/30 hover:border-[#2B8A6E]',
      iconBg: 'bg-[#2B8A6E]/20',
      path: '/demo/live-activation',
      badge: 'Quick Start',
      badgeColor: 'bg-[#2B8A6E]',
      recommended: false
    },
    {
      id: 'simulation',
      title: 'Full Simulation',
      duration: '12 minutes',
      description: 'Step into the role of a Fortune 500 CSO. Experience signal detection, playbook activation, and coordinated response.',
      icon: Briefcase,
      color: 'from-[#0A0F2E] to-[#141B45]',
      borderColor: 'border-[#C9A84C]/30 hover:border-[#C9A84C]',
      iconBg: 'bg-[#C9A84C]/20',
      path: '/executive-simulation',
      badge: 'Deep Dive',
      badgeColor: 'bg-[#0A0F2E]',
      recommended: false
    },
    {
      id: 'industry',
      title: 'Industry Demos',
      duration: '10-15 minutes',
      description: 'See Execution OS configured for your industry: Financial Services, Healthcare, Manufacturing, Retail, Energy, and Luxury.',
      icon: Building2,
      color: 'from-[#0A0F2E] to-[#C9A84C]',
      borderColor: 'border-[#C9A84C]/30 hover:border-[#C9A84C]',
      iconBg: 'bg-[#C9A84C]/20',
      path: '/industry-demos',
      badge: '6 Industries',
      badgeColor: 'bg-[#C9A84C]',
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StandardNav />
      
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          {/* Header */}
          <div className="text-center mb-10">
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <Badge className="mb-4 bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">
              Interactive Experience
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-testid="heading-demo-router">
              Experience Execution OS
            </h1>
            <p className="text-xl text-gray-800">
              Choose the demo that fits your schedule
            </p>
          </div>

          {/* Recommended Callout */}
          <div className="mb-8 p-4 bg-[#0A0F2E]/5 border border-[#0A0F2E]/30 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#0A0F2E]/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-[#0A0F2E]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-1">Recommended for executives</p>
                <p className="text-sm text-gray-800 mb-3">
                  See how Execution OS delivers 12-minute coordinated response with predictive AI and role-specific wins.
                </p>
                <Button
                  onClick={() => setLocation('/customer-demo')}
                  size="sm"
                  className="bg-[#0A0F2E] hover:bg-[#141B45] text-white"
                  data-testid="button-recommended-demo"
                >
                  <Play className="h-4 w-4 mr-1.5" />
                  Start Executive Demo
                </Button>
              </div>
            </div>
          </div>

          {/* AI-Native Differentiator */}
          <div className="mb-8 p-4 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#C9A84C]/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-1">NEW: Predictive Intelligence</p>
                <p className="text-sm text-gray-800">
                  Execution OS forecasts trigger probabilities 90 days out. Run what-if scenarios. Know which playbooks you'll need before you need them.
                </p>
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
                  className={`bg-white border-2 ${demo.borderColor} cursor-pointer transition-all hover:shadow-xl group`}
                  onClick={() => setLocation(demo.path)}
                  data-testid={`card-demo-${demo.id}`}
                >
                  <CardContent className="p-5 md:p-6 flex items-center gap-4 md:gap-6">
                    {/* Icon */}
                    <div className={`p-3 md:p-4 rounded-2xl bg-[#0A0F2E] flex-shrink-0`}>
                      <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#2B8A6E] transition-colors">
                          {demo.title}
                        </h3>
                        <Badge className={`${demo.badgeColor} text-white text-xs`}>
                          {demo.badge}
                        </Badge>
                      </div>
                      <p className="text-gray-800 mb-2 text-sm md:text-base line-clamp-2">{demo.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-800">
                        <Clock className="h-4 w-4" />
                        <span>{demo.duration}</span>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800 group-hover:text-[#0A0F2E] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Alternative Path */}
          <div className="text-center mb-10">
            <p className="text-gray-800 mb-4">
              Want to explore on your own?
            </p>
            <Button
              variant="outline"
              onClick={() => setLocation('/playbook-library')}
              className="text-gray-800 border-gray-200 hover:bg-[#141B45] hover:text-white"
              data-testid="button-explore-playbooks"
            >
              Browse 170 Playbooks →
            </Button>
          </div>

          {/* Investor/Roadshow Resources */}
          <div className="p-5 bg-[#C9A84C]/30 border border-[#C9A84C]/30 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#C9A84C]/20 rounded-lg">
                  <FileText className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Investor?</p>
                  <p className="text-sm text-gray-800">Locked demo, FAQ, and roadshow materials</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setLocation('/investor-demo')}
                  className="border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#0A0F2E] flex-1 sm:flex-initial"
                  data-testid="button-investor-demo"
                >
                  Investor Demo
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/roadshow-resources')}
                  className="text-[#C9A84C] hover:bg-[#0A0F2E] flex-1 sm:flex-initial"
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
