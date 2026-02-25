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
  { firm: "IBM", quote: "The operating model required to run AI at scale" },
  { firm: "Deloitte", quote: "95% of CSOs say AI will reshape priorities—but only 16% are reimagining lines of business" },
  { firm: "McKinsey", quote: "Organization design and work change with agents—the agentic organization requires new infrastructure" },
];

export function Validation({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-50 to-white flex items-center justify-center overflow-hidden">
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
          text="17 Reports. One Conclusion."
          size="xl"
          className="text-white mb-2 text-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base md:text-lg text-gray-500 text-center mb-2 max-w-2xl mx-auto"
        >
          The world's top consulting and technology firms all confirm the same gap.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-400 text-center mb-6"
        >
          17 independent reports from 15 firms. One conclusion: enterprises need execution infrastructure to operationalize AI.
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
              className="bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div className="text-indigo-400 font-bold text-sm mb-2">{q.firm}</div>
              <p className="text-gray-600 text-xs italic leading-relaxed">"{q.quote}"</p>
              <div className="mt-2 text-emerald-400 text-xs">→ Execution OS delivers this</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-sm text-gray-500 text-center mt-6"
        >
          <span className="text-indigo-400 font-semibold">15 firms. 17 reports.</span> Every one points at the gap Execution OS fills.
        </motion.p>
      </div>

      <NarrationBox
        headline="17 Reports. One Conclusion."
        description="17 independent reports from 15 firms—McKinsey, IBM, BCG, Bain, Deloitte, PwC, Accenture, Microsoft, Google Cloud, and more—all confirm enterprises need execution infrastructure. 95% of CSOs say AI will reshape priorities, but only 16% are acting. Execution OS built the missing layer."
        delay={0.5}
      />
    </div>
  );
}
