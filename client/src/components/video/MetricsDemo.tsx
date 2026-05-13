import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { TrendingUp, Clock, Target, DollarSign, ArrowRight } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const metrics = [
  { icon: Clock, label: "Execution Speed", value: "10x", subtext: "faster (McKinsey)", color: "#D4AF37" },
  { icon: Target, label: "Time Saved", value: "98 days", subtext: "with AI automation", color: "#00A8A8" },
  { icon: DollarSign, label: "Cost Avoided", value: "$2.2M", subtext: "per breach (IBM)", color: "#22c55e" },
  { icon: TrendingUp, label: "Crisis Response", value: "3.5x", subtext: "faster coordination", color: "#2B8A6E" },
];

export function MetricsDemo({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center overflow-hidden">
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
        <TextPunch text="Measurable Results" size="xl" className="text-gray-900 text-center mb-6" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          <div className="text-center">
            <p className="text-red-400 text-4xl font-bold line-through opacity-60">Days</p>
            <p className="text-gray-600 text-sm">Traditional Response</p>
          </div>
          <ArrowRight className="w-8 h-8 text-[#D4AF37]" />
          <div className="text-center">
            <p className="text-[#D4AF37] text-4xl font-bold">Minutes</p>
            <p className="text-gray-600 text-sm">With Readiness OS</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="bg-gray-50 border border-gray-200 p-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                className="w-12 h-12 mx-auto mb-3 flex items-center justify-center"
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
              
              <p className="text-gray-900 font-medium text-xs mb-1">{metric.label}</p>
              <p className="text-gray-600 text-xs">{metric.subtext}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-700 text-sm mb-2">Validated by 17 independent reports from 15 leading firms</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-[#D4AF37] font-medium">McKinsey</span>
            <span className="text-gray-600">•</span>
            <span className="text-[#00A8A8] font-medium">IBM</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-900 font-medium">BCG</span>
            <span className="text-gray-600">•</span>
            <span className="text-[#C9A84C] font-medium">Deloitte</span>
            <span className="text-gray-600">•</span>
            <span className="text-sky-400 font-medium">Microsoft</span>
            <span className="text-gray-600">•</span>
            <span className="text-[#2B8A6E] font-medium">Google Cloud</span>
            <span className="text-gray-600">•</span>
            <span className="text-amber-400 font-medium">+ 9 more</span>
          </div>
        </motion.div>
      </div>
      
      <NarrationBox 
        headline="Research-Validated Results"
        description="10x faster execution (McKinsey), 98 days saved with AI (IBM), $2.2M cost avoided per breach. Validated by 17 independent reports from 15 leading firms including BCG, Deloitte, Microsoft, and Google Cloud."
        delay={0.5}
      />
    </div>
  );
}
