import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { CheckCircle2 } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const firms = [
  { name: "IBM", color: "#3b82f6" },
  { name: "BCG", color: "#818cf8" },
  { name: "McKinsey", color: "#06b6d4" },
  { name: "Bain", color: "#f43f5e" },
  { name: "Accenture", color: "#8b5cf6" },
  { name: "Deloitte", color: "#a855f7" },
  { name: "PwC", color: "#f59e0b" },
  { name: "Gartner", color: "#10b981" },
  { name: "Forrester", color: "#14b8a6" },
  { name: "IDC", color: "#6366f1" },
  { name: "Microsoft", color: "#38bdf8" },
  { name: "Google Cloud", color: "#34d399" },
  { name: "OpenAI", color: "#a3e635" },
  { name: "Anthropic", color: "#d4a037" },
  { name: "World Economic Forum", color: "#60a5fa" },
];

const quotes = [
  { firm: "BCG", quote: "AI transformation shifting from CIO-led to CEO-led mandate" },
  { firm: "IBM", quote: "The smarter enterprise requires new operating models" },
  { firm: "McKinsey", quote: "CIOs evolving from cost managers to strategy architects" },
];

export function Validation({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0a14] flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{
          background: [
            "radial-gradient(circle at 30% 40%, #6366f1 0%, transparent 50%)",
            "radial-gradient(circle at 70% 60%, #6366f1 0%, transparent 50%)",
            "radial-gradient(circle at 50% 30%, #6366f1 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-3"
        >
          <CheckCircle2 className="w-5 h-5 text-indigo-400" />
          <span className="text-indigo-400 text-sm font-semibold tracking-wide uppercase">2026 Market Validation</span>
        </motion.div>

        <TextPunch
          text="15 Firms. One Conclusion."
          size="xl"
          className="text-white mb-2 text-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base md:text-lg text-white/60 text-center mb-6 max-w-2xl mx-auto"
        >
          The world's top consulting and technology firms independently confirm the problem ExecuteIQ solves.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {firms.map((firm, i) => (
            <motion.span
              key={firm.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.06 }}
              className="rounded-full px-3 py-1.5 text-xs font-medium border"
              style={{
                backgroundColor: `${firm.color}15`,
                borderColor: `${firm.color}40`,
                color: firm.color,
              }}
            >
              {firm.name}
            </motion.span>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + i * 0.25 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="text-indigo-400 font-bold text-sm mb-2">{q.firm}</div>
              <p className="text-white/70 text-xs italic leading-relaxed">"{q.quote}"</p>
              <div className="mt-2 text-emerald-400 text-xs">→ ExecuteIQ delivers this</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-sm text-white/50 text-center mt-6"
        >
          From <span className="text-indigo-400 font-semibold">8 flagship reports</span> across consulting, technology, and research.
        </motion.p>
      </div>

      <NarrationBox
        headline="15 Firms. One Conclusion."
        description="BCG, IBM, McKinsey, Deloitte, Accenture, Microsoft, Google Cloud, World Economic Forum and more — all independently confirm enterprises need execution infrastructure. ExecuteIQ is that infrastructure."
        delay={0.5}
      />
    </div>
  );
}
