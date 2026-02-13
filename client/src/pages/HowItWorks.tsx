import PageLayout from '@/components/layout/PageLayout';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Radio, 
  CheckCircle, 
  BookOpen,
  ArrowRight,
  Clock,
  Zap,
  Brain,
  Users,
  Shield,
  TrendingUp,
  Play
} from "lucide-react";
import { useLocation } from "wouter";

export default function HowItWorks() {
  const [, setLocation] = useLocation();

  const phases = [
    {
      number: "I",
      name: "IDENTIFY",
      moduleName: "ExecuteIQ Playbook™",
      tagline: "Infrastructure Built in Advance",
      icon: Target,
      color: "violet",
      bgGradient: "from-violet-500 to-purple-600",
      borderColor: "border-violet-500",
      bgLight: "bg-violet-50 dark:bg-violet-950/30",
      textColor: "text-violet-600 dark:text-violet-400",
      description: "166 playbooks across 9 strategic domains. Governance defined. Decision rights mapped. Roles assigned. All before the situation hits. This is what McKinsey means by 'real-time, embedded governance.' It's ready before you need it.",
      capabilities: [
        "166 pre-built playbooks across 9 strategic domains with governance pre-defined",
        "Decision rights mapped and roles assigned before the situation arrives",
        "Stakeholders, approval chains, and resource allocations locked in advance",
        "Real-time, embedded governance ready to activate on demand"
      ],
      outcome: "Your execution infrastructure is built, tested, and ready—before the moment arrives."
    },
    {
      number: "D",
      name: "DETECT",
      moduleName: "ExecuteIQ Signal™",
      tagline: "Situation Triggers Response",
      icon: Radio,
      color: "blue",
      bgGradient: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500",
      bgLight: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-600 dark:text-blue-400",
      description: "A strategic moment hits—M&A, crisis, competitive threat. The infrastructure activates. The right playbook engages based on situational awareness. No meetings to figure out what to do. The infrastructure already knows.",
      capabilities: [
        "Strategic moments detected instantly—M&A activity, crises, competitive threats",
        "Infrastructure activates automatically based on situational awareness",
        "The right playbook engages without meetings or manual triage",
        "Configurable triggers ensure the infrastructure responds to what matters"
      ],
      outcome: "When a situation hits, the infrastructure already knows what to do—no scrambling required."
    },
    {
      number: "E",
      name: "EXECUTE",
      moduleName: "ExecuteIQ Compass™",
      tagline: "Coordination in 12 Minutes",
      icon: CheckCircle,
      color: "emerald",
      bgGradient: "from-emerald-500 to-green-500",
      borderColor: "border-emerald-500",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
      description: "Stakeholders notified. Tasks assigned with owners. Decision rights clear. Execution begins—not planning, execution. This is the operating model IBM says 78% of executives know they need.",
      capabilities: [
        "Stakeholders notified and tasks assigned with clear owners in minutes",
        "Decision rights are clear—no ambiguity, no bottlenecks",
        "Execution begins immediately—not planning, execution",
        "The operating model 78% of executives know they need (IBM)"
      ],
      outcome: "Coordinated execution in 12 minutes—not 6-8 weeks of planning and alignment."
    },
    {
      number: "A",
      name: "ADVANCE",
      moduleName: "ExecuteIQ Retrospect™",
      tagline: "Infrastructure Gets Smarter",
      icon: BookOpen,
      color: "amber",
      bgGradient: "from-amber-500 to-orange-500",
      borderColor: "border-amber-500",
      bgLight: "bg-amber-50 dark:bg-amber-950/30",
      textColor: "text-amber-600 dark:text-amber-400",
      description: "Every execution generates data. What worked? Where were the bottlenecks? The infrastructure learns and improves. Your execution capability compounds over time.",
      capabilities: [
        "Every execution generates actionable performance data",
        "Bottlenecks identified and addressed automatically",
        "Infrastructure learns and improves with each activation",
        "Execution capability compounds—each response makes the next one faster"
      ],
      outcome: "Your execution infrastructure gets smarter with every use—compounding advantage over time."
    }
  ];

  const differentiators = [
    {
      icon: Clock,
      title: "12-Minute Execution",
      description: "Industry average: 6-8 weeks. ExecuteIQ's execution infrastructure delivers coordinated response in 12 minutes."
    },
    {
      icon: Brain,
      title: "Human-AI Partnership",
      description: "AI powers the execution infrastructure. Executives make the decisions. The infrastructure handles coordination."
    },
    {
      icon: Shield,
      title: "Pre-Built Infrastructure",
      description: "Governance, decision rights, and response protocols defined in advance—the infrastructure is ready before the situation hits."
    },
    {
      icon: TrendingUp,
      title: "Compounding Advantage",
      description: "Every execution makes the infrastructure smarter. Your execution capability compounds over time."
    }
  ];

  return (
    <PageLayout>
      <div className="page-background">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-poise-navy via-poise-dark-gray to-poise-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,168,168,0.08),transparent_50%)]" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-poise-gold/20 text-poise-gold border-poise-gold/40 text-sm px-4 py-2">
              The IDEA Framework™
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              From Situation to Execution in 12 Minutes
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Execution infrastructure works because it's ready before the moment arrives—just like the playbooks elite sports teams build before the season starts.
            </p>
            
            {/* Visual Phase Flow */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mt-12 flex-wrap">
              {phases.map((phase, index) => (
                <div key={phase.name} className="flex items-center">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${phase.bgGradient} flex items-center justify-center shadow-lg`}>
                    <phase.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  {index < phases.length - 1 && (
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-slate-300 mx-1 md:mx-2" />
                  )}
                </div>
              ))}
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-slate-300 mx-1 md:mx-2 rotate-180 hidden md:block" />
            </div>
            <p className="text-sm text-slate-300 mt-4">Continuous cycle — ADVANCE feeds back into IDENTIFY</p>
          </div>
        </div>
      </div>

      {/* Phase Details */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto space-y-16">
          {phases.map((phase, index) => (
            <div 
              key={phase.name}
              className={`relative ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              data-testid={`phase-${phase.name.toLowerCase()}`}
            >
              {/* Phase Card */}
              <div className={`rounded-2xl border-2 ${phase.borderColor} overflow-hidden bg-white dark:bg-slate-900 shadow-xl`}>
                {/* Phase Header */}
                <div className={`bg-gradient-to-r ${phase.bgGradient} p-6 md:p-8`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <phase.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white/70 text-sm font-medium">Phase {phase.number}</span>
                        <Badge className="bg-white/20 text-white border-white/30 text-xs font-semibold">
                          {phase.moduleName}
                        </Badge>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{phase.name}</h2>
                      <p className="text-white/90 text-lg">{phase.tagline}</p>
                    </div>
                  </div>
                </div>
                
                {/* Phase Content */}
                <div className="p-6 md:p-8">
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                    {phase.description}
                  </p>
                  
                  {/* Capabilities */}
                  <div className="space-y-3 mb-6">
                    {phase.capabilities.map((capability, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full ${phase.bgLight} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <CheckCircle className={`h-4 w-4 ${phase.textColor}`} />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{capability}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Outcome */}
                  <div className={`${phase.bgLight} rounded-xl p-4 border-l-4 ${phase.borderColor}`}>
                    <div className={`text-sm font-semibold ${phase.textColor} mb-1`}>Outcome</div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{phase.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* North Star CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-poise-teal/10 via-cyan-500/10 to-poise-gold/10 rounded-2xl p-8 border border-poise-teal/30">
            <Badge className="mb-4 bg-poise-teal/20 text-poise-teal border-poise-teal/30">
              ExecuteIQ North Star™
            </Badge>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Your Complete Implementation Roadmap
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-6 max-w-xl mx-auto">
              Follow our 7-phase journey from discovery to continuous strategic excellence—with detailed milestones, timelines, and success metrics for every step.
            </p>
            <Button 
              onClick={() => setLocation("/north-star")}
              className="bg-gradient-to-r from-poise-teal to-cyan-500 hover:from-cyan-500 hover:to-poise-teal text-white px-8 py-3 text-lg shadow-lg shadow-poise-teal/30"
              data-testid="button-north-star"
            >
              Launch ExecuteIQ North Star™
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Differentiators Section */}
      <div className="bg-slate-100 dark:bg-slate-800/50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                What Makes This Different
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                ExecuteIQ isn't just another planning tool. It's execution infrastructure—built in advance, activated in the moment.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {differentiators.map((diff, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                  data-testid={`differentiator-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <diff.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{diff.title}</h3>
                      <p className="text-slate-700 dark:text-slate-300">{diff.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Unified Conversion Funnel */}
      <div className="container mx-auto px-6 py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to See It in Action?
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Experience how ExecuteIQ transforms a competitive threat into a coordinated 12-minute response.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => { window.location.href = '/scenario-demo'; }}
              className="bg-poise-teal hover:bg-cyan-600 text-white px-8 py-6 text-lg"
              data-testid="button-try-demo"
            >
              <Play className="h-5 w-5 mr-2" />
              Try Interactive Demo
            </Button>
            <Button 
              onClick={() => setLocation("/contact")}
              className="bg-poise-gold hover:bg-amber-500 text-poise-navy px-8 py-6 text-lg"
              data-testid="button-start-pilot"
            >
              Start Pilot Program
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-6">
            Q1 2026 Founding Partner Program • 90-day validation • $75K (100% credited to Year 1)
          </p>
        </div>
      </div>

      </div>
    </PageLayout>
  );
}
