import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
  AlertTriangle,
  FileText,
  Calendar,
  MessageSquare,
  BarChart3,
  Layers,
  Eye,
  Bot,
  Network,
} from "lucide-react";
import {
  SiSlack,
  SiJira,
  SiSalesforce,
  SiAsana,
} from "react-icons/si";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.4, ease: "easeOut" },
  }),
};

export default function PlatformVisual() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const beforeItems = [
    { text: "Who owns this?", icon: AlertTriangle },
    { text: "Let's schedule a meeting", icon: Calendar },
    { text: "Where's the playbook?", icon: FileText },
    { text: "Who needs to know?", icon: Users },
    { text: "What's the status?", icon: Clock },
  ];

  const afterItems = [
    { text: "Playbook activated", icon: CheckCircle },
    { text: "Roles assigned", icon: Users },
    { text: "Teams notified", icon: MessageSquare },
    { text: "Tasks created", icon: Layers },
    { text: "Docs ready", icon: FileText },
    { text: "Tracking live", icon: Eye },
  ];

  const ideaPhases = [
    {
      letter: "I",
      name: "IDENTIFY",
      subtitle: "AI Pattern Recognition",
      color: "from-violet-500 to-purple-600",
      borderColor: "border-violet-500",
      bgColor: "bg-violet-500",
      items: ["Signal detected", "Context analyzed", "Severity scored", "Routed instantly"],
    },
    {
      letter: "D",
      name: "DETECT",
      subtitle: "AI Playbook Matching",
      color: "from-blue-500 to-cyan-600",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-500",
      items: ["166 playbooks scanned", "Best fit selected", "Customized to context", "Dependencies mapped"],
    },
    {
      letter: "E",
      name: "EXECUTE",
      subtitle: "AI Coordination",
      color: "from-emerald-500 to-teal-600",
      borderColor: "border-emerald-500",
      bgColor: "bg-emerald-500",
      items: ["RACI auto-assigned", "Teams notified", "Tasks created", "Parallel execution"],
    },
    {
      letter: "A",
      name: "ADVANCE",
      subtitle: "AI Learning Loop",
      color: "from-amber-500 to-orange-600",
      borderColor: "border-amber-500",
      bgColor: "bg-amber-500",
      items: ["Outcomes tracked", "Patterns learned", "Playbooks optimized", "Benchmarks updated"],
    },
  ];

  const executionOutputs = [
    { title: "Role Assignment", icon: Users, items: ["RACI auto-generated", "Skills-based routing", "Backup assignees ready"] },
    { title: "Communications", icon: MessageSquare, items: ["Slack channels created", "Teams notifications sent", "Email sequences triggered"] },
    { title: "Task Management", icon: Layers, items: ["Jira epics/tickets created", "ServiceNow workflows", "Due dates auto-set"] },
    { title: "Documentation", icon: FileText, items: ["Runbook activated", "Templates pre-filled", "Status page drafted"] },
    { title: "Meetings", icon: Calendar, items: ["Calendar holds sent", "Zoom/Teams links created", "Agendas pre-populated"] },
  ];

  const integrations = [
    { name: "Slack", icon: SiSlack },
    { name: "Teams", icon: MessageSquare },
    { name: "Jira", icon: SiJira },
    { name: "ServiceNow", icon: Network },
    { name: "Asana", icon: SiAsana },
    { name: "Salesforce", icon: SiSalesforce },
    { name: "SAP", icon: BarChart3 },
    { name: "Email", icon: MessageSquare },
    { name: "Workday", icon: Users },
  ];

  const valueMetrics = [
    { value: "72→12", label: "min response", suffix: "" },
    { value: "166", label: "playbooks ready", suffix: "" },
    { value: "100%", label: "role clarity", suffix: "" },
    { value: "Real-time", label: "AI visibility", suffix: "" },
  ];

  const customerJourney = [
    { step: 1, title: "Connect", desc: "Link your systems" },
    { step: 2, title: "Configure", desc: "Customize playbooks" },
    { step: 3, title: "Simulate", desc: "Test with chaos scenarios" },
    { step: 4, title: "Go Live", desc: "Activate monitoring" },
    { step: 5, title: "Respond", desc: "12-min execution" },
    { step: 6, title: "Learn", desc: "AI optimizes playbooks" },
  ];

  const domains = [
    "Crisis Management", "M&A Execution", "Market Response",
    "Regulatory", "Digital Transformation", "Supply Chain",
    "Customer", "Talent", "AI Governance",
  ];

  return (
    <section ref={ref} className="py-20 px-6 overflow-hidden bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">

        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-3">
            72 Hours <span className="text-poise-teal">→</span> 12 Minutes
          </h2>
          <p className="text-xl text-poise-teal font-medium">
            The Execution Infrastructure Powered by AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-6 items-start mb-16">

          <motion.div
            className="space-y-3"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">Before</span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">The 72-Hour Scramble</p>
            </div>
            {beforeItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i + 1}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50"
              >
                <item.icon className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-700 dark:text-red-300 font-medium">"{item.text}"</span>
              </motion.div>
            ))}
            <motion.p
              variants={fadeUp}
              custom={7}
              className="text-center text-xs font-bold text-red-500 mt-4 italic"
            >
              Lost time. Lost money.<br />Lost opportunity.
            </motion.p>
          </motion.div>

          <motion.div
            className="rounded-2xl border-2 border-poise-teal/30 bg-white dark:bg-slate-900 p-6 shadow-xl shadow-poise-teal/5"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={scaleIn}
            custom={2}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">EXECUTEIQ</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">IDEA Framework™</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ideaPhases.map((phase, i) => (
                <motion.div
                  key={phase.letter}
                  variants={scaleIn}
                  custom={i + 3}
                  className={`rounded-xl border ${phase.borderColor} bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-4 relative overflow-hidden`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phase.color}`} />
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-7 h-7 rounded-lg ${phase.bgColor} text-white flex items-center justify-center text-sm font-bold`}>
                      {phase.letter}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                      {phase.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Bot className="h-3 w-3 text-poise-teal" />
                    <span className="text-xs text-poise-teal font-medium">AI</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 ml-1">{phase.subtitle}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-slate-700 dark:text-slate-300 leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              custom={8}
              className="mt-6 text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-poise-gold/10 border border-poise-gold/30">
                <BookOpen className="h-4 w-4 text-poise-gold" />
                <span className="text-sm font-bold text-poise-gold">166 PLAYBOOKS</span>
                <span className="text-xs text-slate-600 dark:text-slate-300">•</span>
                <span className="text-sm font-bold text-poise-gold">9 DOMAINS</span>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">After</span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">12-Minute Execution</p>
            </div>
            {afterItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i + 4}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50"
              >
                <item.icon className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{item.text}</span>
              </motion.div>
            ))}
            <motion.p
              variants={fadeUp}
              custom={11}
              className="text-center text-xs font-bold text-emerald-500 mt-4 italic"
            >
              Coordinated. Accountable.<br />Executing.
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={9}
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-6 uppercase tracking-wide">
            Execution Outputs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {executionOutputs.map((output, i) => (
              <motion.div
                key={output.title}
                variants={scaleIn}
                custom={i + 10}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <output.icon className="h-4 w-4 text-poise-teal" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{output.title}</span>
                </div>
                <ul className="space-y-1">
                  {output.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-1.5">
                      <CheckCircle className="h-2.5 w-2.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-slate-600 dark:text-slate-300 leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={12}
          >
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Connects to Your Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {integrations.map((integration) => (
                <span
                  key={integration.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                >
                  <integration.icon className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{integration.name}</span>
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-xl border-2 border-poise-teal/30 bg-gradient-to-br from-poise-navy to-slate-900 p-6"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={13}
          >
            <h4 className="text-sm font-bold text-poise-teal mb-4 uppercase tracking-wide">
              The Value
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {valueMetrics.map((metric) => (
                <div key={metric.label}>
                  <div className="text-xl font-bold text-white">{metric.value}</div>
                  <div className="text-xs text-slate-300">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={14}
          >
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              166 Playbooks • 9 Domains
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {domains.map((domain) => (
                <span
                  key={domain}
                  className="text-xs px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-600/30 font-medium"
                >
                  {domain}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="rounded-xl bg-gradient-to-r from-poise-teal/5 via-transparent to-poise-teal/5 border border-poise-teal/20 p-6 mb-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={15}
        >
          <div className="flex items-center gap-2 mb-2 justify-center">
            <Brain className="h-4 w-4 text-poise-teal" />
            <h4 className="text-sm font-bold text-poise-teal uppercase tracking-wide">
              AI That Evolves With Every Execution
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {[
              { title: "Pattern Recognition", desc: "Classifies signals in milliseconds" },
              { title: "Playbook Matching", desc: "Learns which playbooks work best" },
              { title: "Smart Routing", desc: "Optimizes role assignment over time" },
              { title: "Outcome Learning", desc: "Improves recommendations from results" },
              { title: "Predictive Alerts", desc: "Anticipates issues before they escalate" },
            ].map((capability, i) => (
              <div key={capability.title} className="text-center">
                <Zap className="h-4 w-4 text-poise-teal mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">{capability.title}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{capability.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={16}
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-6 uppercase tracking-wide">
            Customer Journey
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
            {customerJourney.map((step, i) => (
              <div key={step.step} className="flex items-center">
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="w-6 h-6 rounded-full bg-poise-teal text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {step.step}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">{step.desc}</div>
                  </div>
                </div>
                {i < customerJourney.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500 mx-1 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={17}
        >
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            ExecuteIQ: The Execution Infrastructure Enterprises Are Missing
          </p>
          <a
            href="https://www.executeiq.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-poise-teal hover:underline font-medium mt-2 inline-block"
          >
            executeiq.io
          </a>
        </motion.div>
      </div>
    </section>
  );
}
