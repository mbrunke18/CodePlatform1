import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { Zap, Users, Brain, DollarSign } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const threeProblems = [
  {
    icon: Zap,
    title: "The Execution Gap",
    pain: "20-72 hours to even begin acting when strategic moments hit",
    cost: "$136K/hour delayed response",
    costDetail: "$5-50M M&A synergy erosion",
    color: "#ef4444",
    borderColor: "rgba(239,68,68,0.3)",
  },
  {
    icon: Users,
    title: "The Coordination Chaos",
    pain: "50-200+ stakeholders with no system to coordinate them",
    cost: "$4.88M avg breach cost",
    costDetail: "35% higher without pre-defined teams",
    color: "#f59e0b",
    borderColor: "rgba(245,158,11,0.3)",
  },
  {
    icon: Brain,
    title: "The Institutional Amnesia",
    pain: "Knowledge walks out the door. Same scramble every time.",
    cost: "3.5 high-stakes situations every 2 years",
    costDetail: "Same $4.88M cost repeated each time",
    color: "#2B8A6E",
    borderColor: "rgba(168,85,247,0.3)",
  },
];

export function Problem({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-white flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #ef4444 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, #ef4444 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, #ef4444 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-8">
        <TextPunch 
          text="Three Problems. Billions Lost." 
          size="xl" 
          className="text-red-500 mb-3 text-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-gray-800 text-center mb-8"
        >
          Every startup to Fortune 500 company faces these problems. No infrastructure existed to solve them.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {threeProblems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.3 }}
              className="bg-gray-50 p-5 flex flex-col"
              style={{ borderLeft: `3px solid ${problem.color}` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${problem.color}20` }}
                >
                  <problem.icon className="w-5 h-5" style={{ color: problem.color }} />
                </div>
                <h3 className="text-gray-900 font-bold text-sm">{problem.title}</h3>
              </div>
              <p className="text-gray-800 text-xs leading-relaxed mb-3">{problem.pain}</p>
              <div 
                className="mt-auto p-3"
                style={{ backgroundColor: `${problem.color}10`, border: `1px solid ${problem.borderColor}` }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-3.5 h-3.5" style={{ color: problem.color }} />
                  <span className="text-xs font-bold" style={{ color: problem.color }}>{problem.cost}</span>
                </div>
                <p className="text-gray-700 text-xs">{problem.costDetail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-lg text-gray-700 text-center"
        >
          Strategy-execution gap costs Fortune 500 companies <span className="text-red-400 font-bold">$900B annually</span>.
        </motion.p>
      </div>
      
      <NarrationBox 
        headline="Three Problems. Billions Lost."
        description="The Execution Gap: 20-72 hours to act. The Coordination Chaos: 50-200+ stakeholders, no system. The Institutional Amnesia: knowledge lost, same cost repeated. Together, they cost enterprises billions."
        delay={0.5}
      />
    </div>
  );
}
