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
          text="72 Hours" 
          size="2xl" 
          delay={0.5}
          className="text-white mb-4"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-xl md:text-2xl text-white/70 max-w-xl mx-auto"
        >
          That's how long it takes Fortune 1000 companies to coordinate a strategic response.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8"
        >
          <p className="text-[#D4AF37] text-2xl font-bold">We do it in 12 minutes.</p>
          <p className="text-white/50 text-sm mt-2">That's a 340x improvement.</p>
        </motion.div>
      </div>
      
      <NarrationBox 
        headline="The Speed Gap"
        description="Fortune 1000 companies take 72 hours to coordinate strategic responses. ExecuteIQ does it in 12 minutes."
        delay={0.5}
      />
    </div>
  );
}
