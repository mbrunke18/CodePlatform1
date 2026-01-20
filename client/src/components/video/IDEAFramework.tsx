import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { ClipboardList, Radar, Play, TrendingUp, ArrowRight } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const phases = [
  { 
    id: "identify", 
    name: "IDENTIFY", 
    module: "ExecuteIQ Playbook™",
    icon: ClipboardList, 
    color: "#3B82F6",
    description: "Build your playbook library"
  },
  { 
    id: "detect", 
    name: "DETECT", 
    module: "ExecuteIQ Signal™",
    icon: Radar, 
    color: "#10B981",
    description: "AI monitors for triggers"
  },
  { 
    id: "execute", 
    name: "EXECUTE", 
    module: "ExecuteIQ Compass™",
    icon: Play, 
    color: "#F59E0B",
    description: "12-minute coordinated response"
  },
  { 
    id: "advance", 
    name: "ADVANCE", 
    module: "ExecuteIQ Retrospect™",
    icon: TrendingUp, 
    color: "#8B5CF6",
    description: "Capture institutional learning"
  },
];

export function IDEAFramework({ progress }: SceneProps) {
  const activePhase = Math.min(Math.floor(progress * 4), 3);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] text-lg font-medium mb-2"
          >
            The IDEA Framework™
          </motion.p>
          <TextPunch text="Four Phases. One System." size="lg" className="text-white" />
        </div>

        <div className="flex items-center justify-center gap-4">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
              className="flex items-center"
            >
              <motion.div
                className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                  i <= activePhase 
                    ? "bg-white/10 border-opacity-100" 
                    : "bg-white/5 border-opacity-30"
                }`}
                style={{ borderColor: i <= activePhase ? phase.color : "rgba(255,255,255,0.1)" }}
                animate={i === activePhase ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 mx-auto"
                  style={{ backgroundColor: `${phase.color}20` }}
                >
                  <phase.icon className="w-7 h-7" style={{ color: phase.color }} />
                </div>
                <p className="text-white font-bold text-lg text-center">{phase.name}</p>
                <p className="text-xs text-center mt-1" style={{ color: phase.color }}>{phase.module}</p>
                <p className="text-white/50 text-xs text-center mt-2 max-w-[120px]">{phase.description}</p>
              </motion.div>
              
              {i < phases.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i < activePhase ? 1 : 0.3 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="mx-2"
                >
                  <ArrowRight className="w-6 h-6 text-[#D4AF37]" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center text-white/60 text-lg mt-12"
        >
          "That's the <span className="text-[#D4AF37] font-bold">IDEA</span>."
        </motion.p>
      </div>
    </div>
  );
}
