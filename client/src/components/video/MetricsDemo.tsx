import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { TrendingUp, Clock, Target, DollarSign, ArrowRight } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const metrics = [
  { icon: Clock, label: "Response Time", value: "340x", subtext: "faster than industry", color: "#D4AF37" },
  { icon: Target, label: "Execution Rate", value: "94%", subtext: "task completion", color: "#00A8A8" },
  { icon: DollarSign, label: "Revenue Impact", value: "10.3%", subtext: "growth improvement", color: "#22c55e" },
  { icon: TrendingUp, label: "First Year ROI", value: "847%", subtext: "validated return", color: "#8b5cf6" },
];

export function MetricsDemo({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent"
            style={{
              left: `${(i / 50) * 100}%`,
              height: "100%",
            }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, delay: i * 0.05, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
        <TextPunch text="Measurable Results" size="xl" className="text-white text-center mb-6" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          <div className="text-center">
            <p className="text-red-400 text-4xl font-bold line-through opacity-60">72 hours</p>
            <p className="text-white/40 text-sm">Industry Standard</p>
          </div>
          <ArrowRight className="w-8 h-8 text-[#D4AF37]" />
          <div className="text-center">
            <p className="text-[#D4AF37] text-4xl font-bold">12 minutes</p>
            <p className="text-white/40 text-sm">With ExecuteIQ</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${metric.color}20` }}
              >
                <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="text-3xl font-bold mb-1"
                style={{ color: metric.color }}
              >
                {metric.value}
              </motion.p>
              
              <p className="text-white font-medium text-xs mb-1">{metric.label}</p>
              <p className="text-white/40 text-xs">{metric.subtext}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-center"
        >
          <p className="text-white/50 text-sm mb-2">Research-backed by</p>
          <div className="flex items-center justify-center gap-6">
            <span className="text-[#D4AF37] font-medium">McKinsey</span>
            <span className="text-white/30">•</span>
            <span className="text-[#00A8A8] font-medium">IBM/Ponemon</span>
            <span className="text-white/30">•</span>
            <span className="text-white font-medium">BAI 2025</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
