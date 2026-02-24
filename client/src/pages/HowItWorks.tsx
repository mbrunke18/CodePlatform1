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
      moduleName: "Execution OS Playbook™",
      tagline: "Infrastructure Built in Advance",
      icon: Target,
      color: "violet",
      bgGradient: "from-violet-500 to-purple-600",
      borderColor: "border-violet-500",
      bgLight: "bg-violet-50 dark:bg-violet-950/30",
      textColor: "text-violet-600 dark:text-violet-400",
      description: "170 playbooks across 9 strategic domains. Governance defined. Decision rights mapped. Roles assigned. All before the situation hits. This is what McKinsey means by 'real-time, embedded governance.' It's ready before you need it.",
      capabilities: [
        "170 pre-built playbooks across 9 strategic domains with governance pre-defined",
        "Decision rights mapped and roles assigned before the situation arrives",
        "Stakeholders, approval chains, and resource allocations locked in advance",
        "Real-time, embedded governance ready to activate on demand"
      ],
      outcome: "Your execution infrastructure is built, tested, and ready—before the moment arrives."
    },
    {
      number: "D",
      name: "DETECT",
      moduleName: "Execution OS Signal™",
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
      moduleName: "Execution OS Compass™",
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
      moduleName: "Execution OS Retrospect™",
      tagline: "Infrastructure Gets Smarter",
      icon: BookOpen,
      color: "amber",
      bgGradient: "from-amber-500 to-orange-500",
      borderColor: "border-amber-500",
      bgLight: "bg-amber-50 dark:bg-amber-950/30",
      textColor: "text-amber-600 dark:text-amber-400",
      description: "Every execution generates proprietary intelligence. AI analyzes outcomes, detects patterns across playbooks, benchmarks against industry standards, and refines your infrastructure automatically. Your execution capability doesn't just improve—it compounds into an institutional advantage.",
      capabilities: [
        "Every execution generates actionable performance data—building your proprietary intelligence layer",
        "AI-powered pattern detection identifies what worked, what didn't, and why across all executions",
        "Cross-playbook learning transfers insights from one domain to improve all others",
        "Outcome benchmarking scores each execution against industry standards and your own history"
      ],
      outcome: "Your execution data becomes your competitive moat—each activation makes the entire infrastructure smarter, creating compounding advantage competitors can't replicate."
    }
  ];

  const differentiators = [
    {
      icon: Clock,
      title: "12-Minute Execution",
      description: "Industry average: 6-8 weeks. Execution OS' execution infrastructure delivers coordinated response in 12 minutes."
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
    },
    {
      icon: Zap,
      title: "Zero-Disruption Integration",
      description: "Connects to Active Directory, Jira, Slack, SharePoint, and more. Your people keep using their existing tools—Execution OS orchestrates them."
    },
    {
      icon: Users,
      title: "Enterprise-Grade Security",
      description: "SSO via Azure AD, Okta, and Ping Identity. SAML/OIDC authentication. SOC 2 compliance roadmap. Your data stays in your control."
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
            <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              In a world where disruptions compound and cascade across domains simultaneously, the only advantage is execution infrastructure built before the moment arrives.
            </p>
            
            {/* Visual Phase Flow */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mt-12 flex-wrap">
              {phases.map((phase, index) => (
                <div key={phase.name} className="flex items-center">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${phase.bgGradient} flex items-center justify-center shadow-lg`}>
                    <phase.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  {index < phases.length - 1 && (
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-slate-200 mx-1 md:mx-2" />
                  )}
                </div>
              ))}
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-slate-200 mx-1 md:mx-2 rotate-180 hidden md:block" />
            </div>
            <p className="text-sm text-slate-200 mt-4">Continuous cycle — ADVANCE feeds back into IDENTIFY</p>
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

        {/* 12-Minute Timeline Breakdown */}
        <div className="max-w-4xl mx-auto mt-20 mb-16">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
              The 12-Minute Proof Point
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              From Trigger to Coordinated Execution
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Here's exactly what happens in those 12 minutes — and why it takes others 72+ hours.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-amber-500" />
            
            {[
              { time: "0:00", label: "Trigger Detected", description: "AI signal or human activation identifies a strategic moment — M&A announcement, cyber breach, competitive threat.", color: "emerald", icon: "signal" },
              { time: "0:30", label: "Playbook Matched & Loaded", description: "The right playbook from 170 options is matched to the situation. Governance structure, decision rights, and task templates load instantly.", color: "emerald", icon: "match" },
              { time: "1:00", label: "Stakeholder Notification Sent", description: "All relevant stakeholders — 50 to 200+ across legal, finance, ops, comms — receive coordinated notifications via Slack, Teams, or email.", color: "blue", icon: "notify" },
              { time: "3:00", label: "Stakeholders Acknowledged", description: "Response confirmations tracked in real-time. Escalation protocols activate for any non-responses. Full visibility in Command Center.", color: "blue", icon: "confirm" },
              { time: "5:00", label: "Tasks Assigned with Clear Owners", description: "Every task has a named owner, a deadline, and a decision-rights framework. No ambiguity. No duplication. Everyone knows their assignment.", color: "violet", icon: "assign" },
              { time: "8:00", label: "Decision Rights Confirmed, Budget Released", description: "Pre-approved budget thresholds activate. Spending authority delegated per playbook. Executive sign-off required only for exceptions.", color: "amber", icon: "budget" },
              { time: "12:00", label: "Full Coordinated Execution Underway", description: "All workstreams active. Cross-functional teams executing in parallel. Real-time tracking across every task, every stakeholder, every deadline.", color: "emerald", icon: "execute" },
            ].map((step, index) => {
              const colorMap: Record<string, { dot: string; time: string; bg: string }> = {
                emerald: { dot: "bg-emerald-500", time: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
                blue: { dot: "bg-blue-500", time: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/20" },
                violet: { dot: "bg-violet-500", time: "text-violet-500 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/20" },
                amber: { dot: "bg-amber-500", time: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/20" },
              };
              const colors = colorMap[step.color];
              return (
                <div key={index} className="relative pl-16 md:pl-20 pb-8 last:pb-0">
                  <div className={`absolute left-4 md:left-6 w-4 h-4 md:w-5 md:h-5 rounded-full ${colors.dot} border-4 border-white dark:border-slate-900 z-10`} style={{ top: '4px' }} />
                  <div className={`${colors.bg} rounded-xl p-5 border border-slate-200 dark:border-slate-700`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-lg md:text-xl font-bold font-mono ${colors.time}`}>{step.time}</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{step.label}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-gradient-to-r dark:from-red-950/30 dark:to-slate-800/50 rounded-xl p-6 border border-red-500/20 text-center">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              <span className="text-red-400 font-bold">Without Execution OS:</span> At the 12-minute mark, most organizations are still trying to figure out who to call.
            </p>
          </div>
        </div>

        {/* Agentic Execution Layer - Stack Positioning */}
        <div className="max-w-4xl mx-auto mt-20 mb-8">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-purple-600/20 text-purple-400 border-purple-500/30">
              Where Execution OS Sits
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              The Agentic Execution Layer
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Execution OS occupies a distinct layer in the enterprise stack — between strategy and operational tools. Agents don't just generate answers. They coordinate enterprises.
            </p>
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <div className="rounded-xl p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Strategy Layer</div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">Board decisions, strategic plans, market analysis</div>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-gray-600 rotate-90" />
            </div>
            <div className="rounded-xl p-5 bg-gradient-to-r from-poise-teal/10 via-cyan-500/10 to-purple-500/10 border-2 border-poise-teal/50 text-center relative overflow-hidden">
              <div className="absolute top-2 right-3 text-[10px] font-bold text-poise-teal uppercase tracking-wider">You Are Here</div>
              <div className="text-sm text-poise-teal font-semibold mb-1">Agentic Execution Layer</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">Execution OS — Strategic Execution OS</div>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-poise-teal/10 text-poise-teal border border-poise-teal/20">Signal Detection Agents</span>
                <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">Routing Agents</span>
                <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Decision Agents</span>
                <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">Learning Agents</span>
              </div>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-gray-600 rotate-90" />
            </div>
            <div className="rounded-xl p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Workflow & Task Systems</div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">Jira, ServiceNow, Asana, Monday.com</div>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-gray-600 rotate-90" />
            </div>
            <div className="rounded-xl p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Operational Systems</div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">ERP, CRM, HRIS, Cloud Infrastructure</div>
            </div>
          </div>
        </div>

        {/* North Star CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-poise-teal/10 via-cyan-500/10 to-poise-gold/10 rounded-2xl p-8 border border-poise-teal/30">
            <Badge className="mb-4 bg-poise-teal/20 text-poise-teal border-poise-teal/30">
              Execution OS North Star™
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
              Launch Execution OS North Star™
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
                Execution OS isn't just another planning tool. It's execution infrastructure—built in advance, activated in the moment.
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

      {/* Built for Compound Disruption */}
      <div className=" py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30">
                Built for Compound Disruption
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                When Disruptions Don't Come One at a Time
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Compound disruptions — multidimensional, self-reinforcing events that cascade across domains — are the new normal. A cyber breach triggers regulatory action. A tariff war disrupts supply chains. Execution OS is built for coordinated, cross-domain response.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                { scenario: 'Cyber + Regulatory', example: 'Data breach triggers GDPR penalties and SEC disclosure requirements simultaneously', response: 'Multi-domain coordination across legal, security, compliance, and communications', color: 'border-red-500/30', iconColor: 'text-red-400' },
                { scenario: 'Geopolitical + Supply Chain', example: 'Tariff escalation impacts critical supplier in affected region', response: 'Cross-functional response coordinating procurement, operations, and finance', color: 'border-amber-500/30', iconColor: 'text-amber-400' },
                { scenario: 'Climate + Operations', example: 'Weather event causes facility shutdown with cascading customer impact', response: 'Parallel workstreams across facilities, logistics, customer success, and PR', color: 'border-blue-500/30', iconColor: 'text-blue-400' },
                { scenario: 'AI + Workforce', example: 'Automation announcement triggers union response and media attention', response: 'Integrated stakeholder management across HR, legal, communications, and executive team', color: 'border-purple-500/30', iconColor: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className={`bg-white border ${item.color} rounded-xl p-6`}>
                  <h3 className={`font-bold ${item.iconColor} mb-2`}>{item.scenario}</h3>
                  <p className="text-slate-300 text-sm mb-3">{item.example}</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wider">Execution OS Response</p>
                    <p className="text-emerald-400 text-sm">{item.response}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-6">The IDEA Framework Operationalizes Strategic Foresight</h3>
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                  { principle: 'Signal-First', idea: 'IDENTIFY', desc: 'AI-powered signal detection spots compound disruption patterns before they cascade', color: 'bg-violet-500/10 border-violet-500/30', textColor: 'text-violet-400' },
                  { principle: 'Rapid Coordination', idea: 'DETECT + EXECUTE', desc: '12-minute coordination with pre-defined decision rights — no time lost to improvisation', color: 'bg-emerald-500/10 border-emerald-500/30', textColor: 'text-emerald-400' },
                  { principle: 'Adaptive Intelligence', idea: 'ADVANCE', desc: 'Every execution strengthens future response — your organization grows stronger from each disruption', color: 'bg-amber-500/10 border-amber-500/30', textColor: 'text-amber-400' },
                ].map((item, i) => (
                  <div key={i} className={`${item.color} border rounded-xl p-5`}>
                    <div className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">{item.principle}</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <ArrowRight className="h-3 w-3 text-gray-500" />
                      <span className={`font-bold ${item.textColor}`}>{item.idea}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-6 italic">
                The IDEA Framework™ — signal-first detection, rapid coordination, and adaptive intelligence built into executable infrastructure.
              </p>
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
            Experience how Execution OS transforms a competitive threat into a coordinated 12-minute response.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => { window.location.href = '/try-demo'; }}
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
