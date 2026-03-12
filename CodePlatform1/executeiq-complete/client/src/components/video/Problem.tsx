import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { AlertTriangle, Clock, Users, DollarSign, Zap, Scale } from "lucide-react";

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

const whyNow = [
  { icon: Zap, text: "AI disruption accelerating", color: "#a855f7" },
  { icon: Scale, text: "Regulatory windows shrinking", color: "#3b82f6" },
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

      <div className="relative z-10 max-w-5xl mx-auto px-8">
        <TextPunch 
          text="The Problem" 
          size="xl" 
          className="text-red-500 mb-6 text-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-white/80 text-center mb-8"
        >
          When a strategic event hits, organizations <span className="text-red-400 font-bold">scramble</span>.
        </motion.p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="bg-white/5 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${problem.color}20` }}
              >
                <problem.icon className="w-5 h-5" style={{ color: problem.color }} />
              </div>
              <p className="text-white/90 text-sm font-medium">{problem.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="border-t border-white/10 pt-6"
        >
          <p className="text-center text-white/50 text-sm mb-4 uppercase tracking-wider">Why This Matters Now</p>
          <div className="flex justify-center gap-6">
            {whyNow.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 + i * 0.2 }}
                className="flex items-center gap-2"
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                <span className="text-white/70 text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3 }}
          className="text-lg text-white/60 text-center mt-6"
        >
          Strategy-execution gap costs Fortune 500 companies <span className="text-red-400 font-bold">$900B annually</span>.
        </motion.p>
      </div>
      
      <NarrationBox 
        headline="The Coordination Crisis"
        description="When strategic events hit, organizations spend 20-50 hours just getting organized. That delay costs money and market position."
        delay={0.5}
      />
    </div>
  );
}
