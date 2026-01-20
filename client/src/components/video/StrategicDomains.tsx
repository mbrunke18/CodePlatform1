import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { 
  Target, Building, Rocket, AlertTriangle, Shield, 
  Scale, Cpu, Swords, Brain 
} from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const domains = [
  { name: "Market Entry", icon: Target, category: "OFFENSE", color: "#10B981" },
  { name: "M&A", icon: Building, category: "OFFENSE", color: "#10B981" },
  { name: "Product Launch", icon: Rocket, category: "OFFENSE", color: "#10B981" },
  { name: "Crisis Management", icon: AlertTriangle, category: "DEFENSE", color: "#EF4444" },
  { name: "Cyber Security", icon: Shield, category: "DEFENSE", color: "#EF4444" },
  { name: "Regulatory", icon: Scale, category: "DEFENSE", color: "#EF4444" },
  { name: "Digital Transform", icon: Cpu, category: "SPECIAL", color: "#8B5CF6" },
  { name: "Competitive Response", icon: Swords, category: "SPECIAL", color: "#8B5CF6" },
  { name: "AI Governance", icon: Brain, category: "SPECIAL", color: "#8B5CF6" },
];

export function StrategicDomains({ progress }: SceneProps) {
  const visibleCount = Math.min(Math.floor(progress * 10) + 1, 9);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
        <div className="text-center mb-10">
          <TextPunch text="9 Strategic Domains" size="xl" className="text-white mb-4" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-lg"
          >
            Complete coverage across offense, defense, and special operations
          </motion.p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <p className="text-green-400 font-bold text-sm mb-3">OFFENSE</p>
            <div className="space-y-3">
              {domains.filter(d => d.category === "OFFENSE").map((domain, i) => (
                <motion.div
                  key={domain.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: i < visibleCount ? 1 : 0.2, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-3"
                >
                  <domain.icon className="w-5 h-5 text-green-400" />
                  <span className="text-white text-sm">{domain.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-red-400 font-bold text-sm mb-3">DEFENSE</p>
            <div className="space-y-3">
              {domains.filter(d => d.category === "DEFENSE").map((domain, i) => (
                <motion.div
                  key={domain.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: i + 3 < visibleCount ? 1 : 0.2, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-3"
                >
                  <domain.icon className="w-5 h-5 text-red-400" />
                  <span className="text-white text-sm">{domain.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-purple-400 font-bold text-sm mb-3">SPECIAL TEAMS</p>
            <div className="space-y-3">
              {domains.filter(d => d.category === "SPECIAL").map((domain, i) => (
                <motion.div
                  key={domain.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: i + 6 < visibleCount ? 1 : 0.2, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.1 }}
                  className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 flex items-center gap-3"
                >
                  <domain.icon className="w-5 h-5 text-purple-400" />
                  <span className="text-white text-sm">{domain.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-4"
        >
          <p className="text-[#D4AF37] font-bold text-xl">166 Pre-Built Playbooks</p>
          <p className="text-white/60 text-sm">Ready to customize and deploy in minutes</p>
        </motion.div>
      </div>
      
      <NarrationBox 
        headline="Complete Strategic Coverage"
        description="Nine domains across Offense, Defense, and Special Teams ensure you're prepared for any scenario."
        delay={0.5}
      />
    </div>
  );
}
