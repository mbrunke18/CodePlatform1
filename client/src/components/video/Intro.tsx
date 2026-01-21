import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

export function Intro({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37]/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              scale: 0
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="relative w-32 h-32 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-[#D4AF37]"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-[#00A8A8]"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border border-[#D4AF37]/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#D4AF37]">EIQ</span>
            </div>
          </div>
        </motion.div>

        <TextPunch 
          text="70% of Transformations Fail" 
          size="2xl" 
          delay={0.5}
          className="text-red-400 mb-4"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-xl md:text-2xl text-white/70 max-w-xl mx-auto"
        >
          $2.3 trillion wasted globally on failed strategic execution.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 flex flex-wrap justify-center gap-4 text-sm"
        >
          <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400">
            75% M&A deals fail
          </span>
          <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400">
            Days to coordinate
          </span>
          <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400">
            Knowledge lost
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 pt-6 border-t border-white/10"
        >
          <p className="text-[#D4AF37] text-2xl font-bold">ExecuteIQ: 12-Minute Playbook Activation</p>
          <p className="text-[#00A8A8] text-sm mt-2">10x faster execution • Research-validated results</p>
        </motion.div>
      </div>
      
      <NarrationBox 
        headline="The $2.3 Trillion Problem"
        description="Strategic initiatives fail because coordination takes days. ExecuteIQ activates playbooks in 12 minutes."
        delay={0.5}
      />
    </div>
  );
}
