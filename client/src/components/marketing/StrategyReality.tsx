import { motion } from "framer-motion";
import { ArrowRight, Clock, CheckCircle2, Target } from "lucide-react";
import { Link } from "wouter";

export function StrategyReality() {
  const workBlocks = [
    {
      label: "WORK AROUND",
      description: "Executive Buy-in, Stakeholder Negotiations",
      blocks: 10,
      color: "bg-gray-50",
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
      color: "bg-gray-50",
    },
    {
      label: "WORK AFTER",
      description: "Tracking Outcomes, KPIs, Feedback, Retros",
      blocks: 10,
      color: "bg-gray-50",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white" data-testid="strategy-reality-section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
          <p className="text-xl text-gray-800 max-w-2xl mx-auto">
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
              className={`flex items-center gap-4 p-4 ${
                item.highlight ? "bg-white border border-pink-500/30" : "bg-white"
              }`}
              data-testid={`work-block-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="w-48 shrink-0">
                <span
                  className={`text-sm font-bold ${
                    item.highlight ? "text-pink-500" : "text-gray-800"
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
                <span className="text-sm text-gray-800">{item.description}</span>
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
          <div className="inline-flex items-center gap-4 bg-white border border-gray-200 px-8 py-6">
            <div className="text-left">
              <p className="text-3xl font-bold text-gray-900 mb-1">
                The strategy is <span className="text-pink-500">5%</span> of the work.
              </p>
              <p className="text-xl text-gray-800">
                The ecosystem around it is{" "}
                <span className="text-gray-900 font-semibold">95%</span>.
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
          <div className="bg-white border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10">
                <Clock className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">The Mobilization Problem</h3>
            </div>
            <p className="text-gray-800 mb-6">
              Every time a strategic situation emerges—competitive threat, M&A opportunity, 
              crisis, transformation—organizations lose <span className="text-gray-900 font-semibold">weeks</span> in 
              the "work around the strategy."
            </p>
            <ul className="space-y-3 text-gray-800">
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

          <div className=" border border-[#2B8A6E]/30 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#2B8A6E]/10">
                <Target className="w-6 h-6 text-[#2B8A6E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Readiness OS: 12 Minutes</h3>
            </div>
            <p className="text-gray-800 mb-6">
              Readiness OS pre-stages the ecosystem <span className="text-gray-900 font-semibold">before</span> situations 
              occur. When triggers fire, everyone knows their role and executes immediately.
            </p>
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 shrink-0" />
                <span>170 pre-built prepared responses across 9 domains</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 shrink-0" />
                <span>Stakeholders mapped before situations occur</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 shrink-0" />
                <span>Tasks execute in parallel, not serial</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 shrink-0" />
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
          <p className="text-gray-800 mb-6 text-lg">
            Don't optimize for the perfect strategy document.
            <br />
            <span className="text-gray-900 font-semibold">
              Optimize for the execution ecosystem around it.
            </span>
          </p>
          <Link href="/how-it-works" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-gray-900 font-semibold px-8 py-4 transition-colors" data-testid="link-see-how-it-works">
            See How Readiness OS Works
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function StrategyRealityCompact() {
  return (
    <div className="bg-white border border-gray-200 p-6" data-testid="strategy-reality-compact">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Why It's Never Just "The Strategy"
      </h3>
      
      <div className="space-y-2 mb-6">
        {[
          { label: "Work Around", width: "w-full", color: "bg-gray-50" },
          { label: "Work Before", width: "w-3/5", color: "bg-slate-600" },
          { label: "Work to Align", width: "w-2/5", color: "bg-slate-600" },
          { label: "Strategy", width: "w-1/6", color: "bg-pink-500", highlight: true },
          { label: "Work to Share", width: "w-2/5", color: "bg-slate-600" },
          { label: "Work to Implement", width: "w-4/5", color: "bg-slate-600" },
          { label: "Work Beyond", width: "w-full", color: "bg-gray-50" },
          { label: "Work After", width: "w-4/5", color: "bg-gray-50" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className={`text-xs ${item.highlight ? 'text-pink-500' : 'text-gray-800'} w-24`}>
              {item.label}
            </span>
            <div className={`h-4 ${item.width} ${item.color} rounded`} />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-800">
          <span className="text-pink-500 font-bold">5%</span> strategy.{" "}
          <span className="text-gray-900 font-bold">95%</span> execution ecosystem.
        </p>
        <p className="text-sm text-gray-800 mt-1">
          That's the weeks of mobilization Readiness OS compresses to 12 minutes.
        </p>
      </div>
    </div>
  );
}

export function StrategyRealityHero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4 py-20" data-testid="strategy-reality-hero">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
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
          className="text-xl md:text-2xl text-gray-800 mb-12 max-w-2xl mx-auto"
        >
          The other 95%—alignment, coordination, execution—is where organizations 
          lose <span className="text-gray-900">weeks</span> every time a strategic situation emerges.
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
                className="w-4 h-12 md:w-6 md:h-16 bg-gray-50 rounded"
              />
            ))}
          </div>
          
          <div className="w-4 h-12 md:w-6 md:h-16 bg-gradient-to-b from-rose-500 to-pink-500 rounded shadow-pink-500/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-6 mb-12"
        >
          <div className="text-right">
            <p className="text-4xl md:text-5xl font-bold text-red-500">72h</p>
            <p className="text-gray-800 text-sm">Industry Average</p>
          </div>
          
          <ArrowRight className="w-8 h-8 text-gray-800" />
          
          <div className="text-left">
            <p className="text-4xl md:text-5xl font-bold text-[#2B8A6E]">12m</p>
            <p className="text-gray-800 text-sm">With Readiness OS</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/how-it-works" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-gray-900 font-semibold px-8 py-4 transition-colors text-lg" data-testid="button-see-how-it-works">
            See How It Works
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="/try-demo" className="inline-flex items-center gap-2 text-gray-800 hover:text-white font-medium px-8 py-4 transition-colors" data-testid="link-watch-demo">
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
      color: "bg-[#0A0F2E]",
      textColor: "text-[#0A0F2E]",
      borderColor: "border-[#2B8A6E]/30",
      traditionalWork: ["Work AROUND", "Work BEFORE"],
      mPlatform: "Pre-staged Readiness Protocols, stakeholder mapping, decision workflows staged before situations occur",
    },
    {
      phase: "DETECT",
      color: "bg-amber-500",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/30",
      traditionalWork: ["Work BEFORE"],
      mPlatform: "System-detected signal monitoring, competitive intelligence, trigger system",
    },
    {
      phase: "EXECUTE",
      color: "bg-[#2B8A6E]",
      textColor: "text-[#2B8A6E]",
      borderColor: "border-[#2B8A6E]/30",
      traditionalWork: ["Work to ALIGN", "Work to SHARE", "Work to IMPLEMENT", "Work BEYOND"],
      mPlatform: "Instant stakeholder notification, parallel task execution, real-time coordination",
    },
    {
      phase: "ADVANCE",
      color: "bg-[#0A0F2E]",
      textColor: "text-[#C9A84C]",
      borderColor: "border-[#C9A84C]/30",
      traditionalWork: ["Work AFTER"],
      mPlatform: "Automated debriefs, lessons learned capture, prepared response refinement",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white" data-testid="strategy-to-idea-section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Readiness OS Handles the 95%
          </h2>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto">
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
              className={`bg-white border ${item.borderColor} p-6`}
              data-testid={`idea-phase-${item.phase.toLowerCase()}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${item.color} flex items-center justify-center`}>
                  <span className="text-gray-900 font-bold text-xl">{item.phase[0]}</span>
                </div>
                <div>
                  <h3 className={`font-bold ${item.textColor}`}>{item.phase}</h3>
                  <p className="text-sm text-gray-800">IDEA Phase {index + 1}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-800 uppercase tracking-wide mb-2">
                  Traditional "Hidden Work"
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.traditionalWork.map((work) => (
                    <span
                      key={work}
                      className="text-xs bg-gray-50 text-gray-800 px-2 py-1 rounded"
                    >
                      {work}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-800 uppercase tracking-wide mb-2">
                  Readiness OS Solution
                </p>
                <p className="text-sm text-gray-800">{item.mPlatform}</p>
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
    <div className="bg-white min-h-screen">
      <StrategyRealityHero />
      <StrategyReality />
      <StrategyToIDEA />
    </div>
  );
}
