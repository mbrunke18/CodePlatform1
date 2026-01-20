import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { FakePlaybookCard } from "./FakePlaybookCard";
import { BookOpen } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const playbooks = [
  { title: "Competitor Product Launch", domain: "Competitive Response", tasks: 24, type: "market" as const },
  { title: "Data Breach Response", domain: "Crisis Management", tasks: 32, type: "crisis" as const },
  { title: "M&A Integration", domain: "M&A", tasks: 48, type: "ma" as const },
  { title: "Regulatory Change", domain: "Regulatory", tasks: 18, type: "regulatory" as const },
  { title: "Product Launch", domain: "Product Launch", tasks: 36, type: "launch" as const },
  { title: "Cyber Incident", domain: "Cyber Security", tasks: 28, type: "cyber" as const },
];

export function PlaybookDemo({ progress }: SceneProps) {
  const activeIndex = Math.floor(progress * 6);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
        <div className="flex items-center justify-center gap-4 mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center"
          >
            <BookOpen className="w-6 h-6 text-[#D4AF37]" />
          </motion.div>
          <TextPunch text="166 Pre-Built Playbooks" size="lg" className="text-white" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/60 text-lg mb-8"
        >
          Across 9 strategic domains. Ready to deploy in seconds.
        </motion.p>

        <div className="grid grid-cols-3 gap-4">
          {playbooks.map((playbook, i) => (
            <FakePlaybookCard
              key={i}
              {...playbook}
              delay={0.5 + i * 0.15}
              isActive={i <= activeIndex}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-white/5 rounded-xl px-8 py-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#D4AF37]">166</p>
              <p className="text-xs text-white/50">Playbooks</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[#00A8A8]">9</p>
              <p className="text-xs text-white/50">Domains</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">2,400+</p>
              <p className="text-xs text-white/50">Pre-built Tasks</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
