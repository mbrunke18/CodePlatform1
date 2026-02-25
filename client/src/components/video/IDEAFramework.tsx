import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { ClipboardList, Radar, Play, TrendingUp, ArrowRight, LayoutDashboard } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const phases = [
  { 
    id: "identify", 
    name: "IDENTIFY", 
    module: "Execution OS Playbook™",
    icon: ClipboardList, 
    color: "#3B82F6",
    description: "Build your playbook library",
    outcome: "170 playbooks ready"
  },
  { 
    id: "detect", 
    name: "DETECT", 
    module: "Execution OS Signal™",
    icon: Radar, 
    color: "#10B981",
    description: "AI detects triggers",
    outcome: "72h early warning"
  },
  { 
    id: "execute", 
    name: "EXECUTE", 
    module: "Execution OS Compass™",
    icon: Play, 
    color: "#F59E0B",
    description: "Coordinated response",
    outcome: "12-min activation"
  },
  { 
    id: "advance", 
    name: "ADVANCE", 
    module: "Execution OS Retrospect™",
    icon: TrendingUp, 
    color: "#8B5CF6",
    description: "Capture learning",
    outcome: "Continuous improvement"
  },
];

export function IDEAFramework({ progress }: SceneProps) {
  const activePhase = Math.min(Math.floor(progress * 4), 3);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] text-lg font-medium mb-2"
          >
            The IDEA Framework™
          </motion.p>
          <TextPunch text="Four Phases. One System." size="lg" className="text-gray-900" />
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
                    ? "bg-gray-100 border-opacity-100" 
                    : "bg-gray-50 border-opacity-30"
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
                <p className="text-gray-900 font-bold text-lg text-center">{phase.name}</p>
                <p className="text-xs text-center mt-1" style={{ color: phase.color }}>{phase.module}</p>
                <p className="text-gray-500 text-xs text-center mt-2 max-w-[120px]">{phase.description}</p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i <= activePhase ? 1 : 0 }}
                  className="text-xs text-center mt-2 font-semibold px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${phase.color}30`, color: phase.color }}
                >
                  {phase.outcome}
                </motion.p>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-10 flex flex-col items-center"
        >
          <div className="flex items-center gap-3 bg-gray-50 border border-[#D4AF37]/30 rounded-xl px-5 py-3">
            <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <p className="text-gray-900 text-sm font-medium">Execution OS One™</p>
              <p className="text-gray-500 text-xs">Unified command center for all 4 phases</p>
            </div>
          </div>
          <p className="text-center text-gray-500 text-lg mt-4">
            "That's the <span className="text-[#D4AF37] font-bold">IDEA</span>."
          </p>
        </motion.div>
      </div>
      
      <NarrationBox 
        headline="The IDEA Framework"
        description="Four phases work together: Identify playbooks, Detect triggers, Execute responses, and Advance through learning."
        delay={0.5}
      />
    </div>
  );
}
