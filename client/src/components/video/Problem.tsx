import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { AlertTriangle, Clock, Users, DollarSign } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const problems = [
  { icon: Clock, text: "20-50 hours getting organized", color: "#ef4444" },
  { icon: Users, text: "Teams working in silos", color: "#f97316" },
  { icon: DollarSign, text: "$4.88M average breach cost", color: "#eab308" },
  { icon: AlertTriangle, text: "Competitors move faster", color: "#dc2626" },
];

export function Problem({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1a0a0a] via-[#0f0505] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
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

      <div className="relative z-10 max-w-4xl mx-auto px-8">
        <TextPunch 
          text="The Problem" 
          size="xl" 
          className="text-red-500 mb-12 text-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl md:text-3xl text-white/80 text-center mb-12"
        >
          When a strategic event hits, organizations <span className="text-red-400 font-bold">scramble</span>.
        </motion.p>

        <div className="grid grid-cols-2 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.3 }}
              className="bg-white/5 border border-red-500/20 rounded-xl p-6 flex items-center gap-4"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${problem.color}20` }}
              >
                <problem.icon className="w-6 h-6" style={{ color: problem.color }} />
              </div>
              <p className="text-white/90 text-lg font-medium">{problem.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-xl text-white/60 text-center mt-12"
        >
          Strategy-execution gap costs Fortune 500 companies <span className="text-red-400">$900B annually</span>.
        </motion.p>
      </div>
    </div>
  );
}
