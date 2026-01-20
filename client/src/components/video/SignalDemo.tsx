import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { Radar, AlertCircle, TrendingUp, Globe, Zap, Clock, DollarSign } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const signals = [
  { source: "SEC Filing", message: "Competitor XYZ filed 8-K: Major acquisition announced", severity: "high", time: "2 min ago", impact: "$2.4B deal" },
  { source: "News Wire", message: "Industry regulation change proposed in EU Parliament", severity: "medium", time: "5 min ago", impact: "Q2 deadline" },
  { source: "Social", message: "Trending: Customer complaints about competitor product", severity: "low", time: "8 min ago", impact: "Market opportunity" },
  { source: "Market Data", message: "Unusual trading volume detected in sector", severity: "medium", time: "12 min ago", impact: "Potential M&A" },
];

export function SignalDemo({ progress }: SceneProps) {
  const detectedCount = Math.min(Math.floor(progress * 5), 4);
  const showTrigger = progress > 0.7;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-[600px] h-[600px] rounded-full border border-[#00A8A8]/20" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        <div className="w-[400px] h-[400px] rounded-full border border-[#00A8A8]/30" />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-8 mb-6 bg-white/5 rounded-xl p-3"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-white/70 text-sm">Without ExecuteIQ:</span>
            <span className="text-red-400 font-bold">72+ hours to notice</span>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00A8A8]" />
            <span className="text-white/70 text-sm">With ExecuteIQ:</span>
            <span className="text-[#00A8A8] font-bold">Real-time detection</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-[#00A8A8]/20 rounded-xl flex items-center justify-center"
              >
                <Radar className="w-5 h-5 text-[#00A8A8]" />
              </motion.div>
              <div>
                <TextPunch text="Signal Intelligence" size="sm" className="text-white" />
                <p className="text-[#00A8A8] text-xs">Monitoring 50+ data sources</p>
              </div>
            </div>

            <div className="space-y-3">
              {signals.map((signal, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: i < detectedCount ? 1 : 0, x: i < detectedCount ? 0 : -30 }}
                  transition={{ delay: 0.3 + i * 0.3 }}
                  className={`bg-white/5 border rounded-lg p-3 ${
                    signal.severity === "high" ? "border-red-500/50" :
                    signal.severity === "medium" ? "border-amber-500/50" : "border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-white/40 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#00A8A8]">{signal.source}</span>
                        <span className="text-xs text-white/40">{signal.time}</span>
                      </div>
                      <p className="text-white text-xs mt-1 truncate">{signal.message}</p>
                      <span className="text-[#D4AF37] text-xs font-medium">{signal.impact}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <AnimatePresence>
              {showTrigger && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-red-500/20 to-red-600/10 border-2 border-red-500 rounded-2xl p-8 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-red-400 font-bold text-xl mb-2">TRIGGER DETECTED</p>
                  <p className="text-white text-sm mb-4">Competitor acquisition matches playbook criteria</p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 text-[#D4AF37]"
                  >
                    <Zap className="w-5 h-5" />
                    <span className="font-bold">Playbook Ready to Activate</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence } from "framer-motion";
