import { motion } from "framer-motion";
import { ArrowRight, Clock, CheckCircle2, Target } from "lucide-react";
import { Link } from "wouter";

export function StrategyReality() {
  const workBlocks = [
    {
      label: "WORK AROUND",
      description: "Executive Buy-in, Stakeholder Negotiations",
      blocks: 10,
      color: "bg-slate-700",
    },
    {
      label: "WORK BEFORE",
      description: "Competitive Analysis, Research, Interviews",
      blocks: 6,
      color: "bg-slate-600",
    },
    {
      label: "WORK TO ALIGN",
      description: "Managing Politics, Storytelling, Agreement",
      blocks: 4,
      color: "bg-slate-600",
    },
    {
      label: "THE STRATEGY",
      description: "Frameworks, Priorities, OKRs, Choices",
      blocks: 1,
      color: "bg-gradient-to-r from-rose-500 to-pink-500",
      highlight: true,
    },
    {
      label: "WORK TO SHARE",
      description: "Translating to Teams, Clarifying Meaning",
      blocks: 4,
      color: "bg-slate-600",
    },
    {
      label: "WORK TO IMPLEMENT",
      description: "Roadmaps, Resources, Projects, Tradeoffs",
      blocks: 7,
      color: "bg-slate-600",
    },
    {
      label: "WORK BEYOND",
      description: "Repetition, Coordination, Iteration",
      blocks: 12,
      color: "bg-slate-700",
    },
    {
      label: "WORK AFTER",
      description: "Tracking Outcomes, KPIs, Feedback, Retros",
      blocks: 10,
      color: "bg-slate-700",
    },
  ];

  return (
    <section className="py-20 px-4 bg-slate-950" data-testid="strategy-reality-section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why It's Never Just{" "}
            <span className="relative">
              <span className="text-pink-500">"The Strategy"</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
              >
                <path
                  d="M1 5.5C47.6667 2.16667 141 -2.4 199 5.5"
                  stroke="#ec4899"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            The Strategic Execution Reality
          </p>
        </motion.div>

        <div className="space-y-4 mb-16">
          {workBlocks.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                item.highlight ? "bg-slate-900/50 border border-pink-500/30" : "bg-slate-900/30"
              }`}
              data-testid={`work-block-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="w-48 shrink-0">
                <span
                  className={`text-sm font-bold ${
                    item.highlight ? "text-pink-500" : "text-slate-300"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              <div className="flex gap-1 flex-1">
                {Array.from({ length: item.blocks }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + i * 0.03 }}
                    className={`h-10 w-10 rounded ${item.color} ${
                      item.highlight ? "shadow-lg shadow-pink-500/20" : ""
                    }`}
                  />
                ))}
              </div>

              <div className="w-64 shrink-0 text-right hidden md:block">
                <span className="text-sm text-slate-300">{item.description}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl px-8 py-6">
            <div className="text-left">
              <p className="text-3xl font-bold text-white mb-1">
                The strategy is <span className="text-pink-500">5%</span> of the work.
              </p>
              <p className="text-xl text-slate-300">
                The ecosystem around it is{" "}
                <span className="text-white font-semibold">95%</span>.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white">The 72-Hour Problem</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Every time a strategic situation emerges—competitive threat, M&A opportunity, 
              crisis, transformation—organizations lose <span className="text-white font-semibold">72 hours</span> in 
              the "work around the strategy."
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Scheduling meetings across calendars</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Getting stakeholders aligned</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Clarifying ownership and tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Coordinating across functions</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-emerald-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Target className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white">ExecuteIQ: 12 Minutes</h3>
            </div>
            <p className="text-slate-300 mb-6">
              ExecuteIQ pre-stages the ecosystem <span className="text-white font-semibold">before</span> situations 
              occur. When triggers fire, everyone knows their role and executes immediately.
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <span>166 pre-built playbooks across 9 domains</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <span>Stakeholders mapped before situations occur</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <span>Tasks execute in parallel, not serial</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <span>Real-time coordination, instant alignment</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-300 mb-6 text-lg">
            Don't optimize for the perfect strategy document.
            <br />
            <span className="text-white font-semibold">
              Optimize for the execution ecosystem around it.
            </span>
          </p>
          <Link href="/how-it-works" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors" data-testid="link-see-how-it-works">
            See How ExecuteIQ Works
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function StrategyRealityCompact() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" data-testid="strategy-reality-compact">
      <h3 className="text-lg font-bold text-white mb-4">
        Why It's Never Just "The Strategy"
      </h3>
      
      <div className="space-y-2 mb-6">
        {[
          { label: "Work Around", width: "w-full", color: "bg-slate-700" },
          { label: "Work Before", width: "w-3/5", color: "bg-slate-600" },
          { label: "Work to Align", width: "w-2/5", color: "bg-slate-600" },
          { label: "Strategy", width: "w-1/6", color: "bg-pink-500", highlight: true },
          { label: "Work to Share", width: "w-2/5", color: "bg-slate-600" },
          { label: "Work to Implement", width: "w-4/5", color: "bg-slate-600" },
          { label: "Work Beyond", width: "w-full", color: "bg-slate-700" },
          { label: "Work After", width: "w-4/5", color: "bg-slate-700" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className={`text-xs ${item.highlight ? 'text-pink-500' : 'text-slate-300'} w-24`}>
              {item.label}
            </span>
            <div className={`h-4 ${item.width} ${item.color} rounded`} />
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 pt-4">
        <p className="text-sm text-slate-300">
          <span className="text-pink-500 font-bold">5%</span> strategy.{" "}
          <span className="text-white font-bold">95%</span> execution ecosystem.
        </p>
        <p className="text-sm text-slate-300 mt-1">
          That's the 72 hours ExecuteIQ compresses to 12 minutes.
        </p>
      </div>
    </div>
  );
}

export function StrategyRealityHero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-20" data-testid="strategy-reality-hero">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Strategy is{" "}
          <span className="text-pink-500">5%</span>
          <br />
          of the Work
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto"
        >
          The other 95%—alignment, coordination, execution—is where organizations 
          lose <span className="text-white">72 hours</span> every time a strategic situation emerges.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <div className="flex gap-1">
            {Array.from({ length: 19 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-12 md:w-6 md:h-16 bg-slate-700 rounded"
              />
            ))}
          </div>
          
          <div className="w-4 h-12 md:w-6 md:h-16 bg-gradient-to-b from-rose-500 to-pink-500 rounded shadow-lg shadow-pink-500/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-6 mb-12"
        >
          <div className="text-right">
            <p className="text-4xl md:text-5xl font-bold text-red-500">72h</p>
            <p className="text-slate-300 text-sm">Industry Average</p>
          </div>
          
          <ArrowRight className="w-8 h-8 text-slate-400" />
          
          <div className="text-left">
            <p className="text-4xl md:text-5xl font-bold text-emerald-500">12m</p>
            <p className="text-slate-300 text-sm">With ExecuteIQ</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/how-it-works" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg" data-testid="button-see-how-it-works">
            See How It Works
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="/try-demo" className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium px-8 py-4 transition-colors" data-testid="link-watch-demo">
            Watch Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function StrategyToIDEA() {
  const mapping = [
    {
      phase: "IDENTIFY",
      color: "bg-blue-500",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/30",
      traditionalWork: ["Work AROUND", "Work BEFORE"],
      mPlatform: "Pre-built playbooks, stakeholder mapping, decision workflows staged before situations occur",
    },
    {
      phase: "DETECT",
      color: "bg-amber-500",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/30",
      traditionalWork: ["Work BEFORE"],
      mPlatform: "AI-powered signal monitoring, competitive intelligence, trigger system",
    },
    {
      phase: "EXECUTE",
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      borderColor: "border-emerald-500/30",
      traditionalWork: ["Work to ALIGN", "Work to SHARE", "Work to IMPLEMENT", "Work BEYOND"],
      mPlatform: "Instant stakeholder notification, parallel task execution, real-time coordination",
    },
    {
      phase: "ADVANCE",
      color: "bg-purple-500",
      textColor: "text-purple-500",
      borderColor: "border-purple-500/30",
      traditionalWork: ["Work AFTER"],
      mPlatform: "Automated debriefs, lessons learned capture, playbook refinement",
    },
  ];

  return (
    <section className="py-20 px-4 bg-slate-950" data-testid="strategy-to-idea-section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How ExecuteIQ Handles the 95%
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            The IDEA Framework maps directly to the hidden work around every strategy
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {mapping.map((item, index) => (
            <motion.div
              key={item.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-900 border ${item.borderColor} rounded-2xl p-6`}
              data-testid={`idea-phase-${item.phase.toLowerCase()}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-xl">{item.phase[0]}</span>
                </div>
                <div>
                  <h3 className={`font-bold ${item.textColor}`}>{item.phase}</h3>
                  <p className="text-sm text-slate-300">IDEA Phase {index + 1}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-300 uppercase tracking-wide mb-2">
                  Traditional "Hidden Work"
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.traditionalWork.map((work) => (
                    <span
                      key={work}
                      className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded"
                    >
                      {work}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-300 uppercase tracking-wide mb-2">
                  ExecuteIQ Solution
                </p>
                <p className="text-sm text-slate-300">{item.mPlatform}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StrategyRealityPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <StrategyRealityHero />
      <StrategyReality />
      <StrategyToIDEA />
    </div>
  );
}
