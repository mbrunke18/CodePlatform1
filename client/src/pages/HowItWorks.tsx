import StandardNav from '@/components/layout/StandardNav';
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
      tagline: "Build Your Depth Chart",
      icon: Target,
      color: "violet",
      bgGradient: "from-violet-500 to-purple-600",
      borderColor: "border-violet-500",
      bgLight: "bg-violet-50 dark:bg-violet-950/30",
      textColor: "text-violet-600 dark:text-violet-400",
      description: "Create and customize playbooks from our library of 166 battle-tested strategic responses across 9 domains.",
      capabilities: [
        "Access 166 pre-built playbooks covering crisis, competition, opportunity, AI governance, and more",
        "Customize response sequences for your organization's structure",
        "Define stakeholders, approval chains, and resource allocations",
        "Set up trigger conditions that activate each playbook"
      ],
      outcome: "Your organization has a ready response for any strategic scenario before it happens."
    },
    {
      number: "D",
      name: "DETECT",
      tagline: "Monitor Signals",
      icon: Radio,
      color: "blue",
      bgGradient: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500",
      bgLight: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-600 dark:text-blue-400",
      description: "Continuous AI monitoring across 16 intelligence categories and 92 data points to detect threats and opportunities.",
      capabilities: [
        "Real-time monitoring of market signals, competitor moves, and industry shifts",
        "AI pattern recognition identifies weak signals before they become crises",
        "Automatic trigger detection matches events to relevant playbooks",
        "Configurable alert thresholds and escalation paths"
      ],
      outcome: "You're always first to know—and first to act—on strategic developments."
    },
    {
      number: "E",
      name: "EXECUTE",
      tagline: "Execute Response",
      icon: CheckCircle,
      color: "emerald",
      bgGradient: "from-emerald-500 to-green-500",
      borderColor: "border-emerald-500",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
      description: "When triggers fire, M orchestrates your entire response—stakeholders, resources, and communications—in minutes, not weeks.",
      capabilities: [
        "Automatic stakeholder notification and task assignment",
        "Pre-approved budget release for rapid resource deployment",
        "Real-time coordination dashboard tracks execution progress",
        "Integration with enterprise tools (Slack, Jira, email, calendars)"
      ],
      outcome: "Your organization responds with the speed and precision of a championship team."
    },
    {
      number: "A",
      name: "ADVANCE",
      tagline: "Review the Film",
      icon: BookOpen,
      color: "amber",
      bgGradient: "from-amber-500 to-orange-500",
      borderColor: "border-amber-500",
      bgLight: "bg-amber-50 dark:bg-amber-950/30",
      textColor: "text-amber-600 dark:text-amber-400",
      description: "Every execution feeds back into the system, making your playbooks smarter and your organization more prepared.",
      capabilities: [
        "Automatic outcome capture and performance analysis",
        "AI-powered playbook refinement suggestions",
        "Institutional memory preserves lessons learned",
        "Board-ready briefings generated from execution data"
      ],
      outcome: "Your strategic capability compounds over time—every response makes the next one better."
    }
  ];

  const differentiators = [
    {
      icon: Clock,
      title: "12-Minute Execution",
      description: "Industry average: 6-8 weeks. M delivers coordinated response in 12 minutes."
    },
    {
      icon: Brain,
      title: "Human-AI Partnership",
      description: "AI monitors and recommends. Executives decide. The best of both worlds."
    },
    {
      icon: Shield,
      title: "Pre-Approved Response",
      description: "Budgets, stakeholders, and actions pre-defined—no bottlenecks when speed matters."
    },
    {
      icon: TrendingUp,
      title: "Compounding Advantage",
      description: "Every execution makes your playbooks smarter and your team faster."
    }
  ];

  return (
    <div className="page-background min-h-screen">
      <StandardNav />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm px-4 py-2">
              The 4-Phase Methodology
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How M Works
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              A continuous cycle that transforms how Fortune 1000 companies detect, decide, and execute on strategic opportunities and threats.
            </p>
            
            {/* Visual Phase Flow */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mt-12 flex-wrap">
              {phases.map((phase, index) => (
                <div key={phase.name} className="flex items-center">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${phase.bgGradient} flex items-center justify-center shadow-lg`}>
                    <phase.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  {index < phases.length - 1 && (
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-slate-500 mx-1 md:mx-2" />
                  )}
                </div>
              ))}
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-slate-500 mx-1 md:mx-2 rotate-180 hidden md:block" />
            </div>
            <p className="text-sm text-slate-400 mt-4">Continuous cycle — ADVANCE feeds back into IDENTIFY</p>
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
                      <div className="text-white/70 text-sm font-medium">Phase {phase.number}</div>
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
                        <span className="text-slate-600 dark:text-slate-400">{capability}</span>
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
      </div>

      {/* Differentiators Section */}
      <div className="bg-slate-100 dark:bg-slate-800/50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                What Makes This Different
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                M isn't just another planning tool. It's a complete operating system for strategic execution.
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
                      <p className="text-slate-600 dark:text-slate-400">{diff.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to See It in Action?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Watch how M transforms a competitive threat into a coordinated 12-minute response.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => setLocation("/demo/live-activation")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              data-testid="button-watch-demo"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Live Demo
            </Button>
            <Button 
              onClick={() => setLocation("/playbook-library")}
              variant="outline"
              className="border-slate-300 dark:border-slate-600 px-8 py-6 text-lg"
              data-testid="button-explore-playbooks"
            >
              Explore 166 Playbooks
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-lg">Strategic Execution OS</span>
          </div>
          <p className="text-slate-400">
            Transforming how Fortune 1000 companies execute strategy.
          </p>
        </div>
      </footer>
    </div>
  );
}
