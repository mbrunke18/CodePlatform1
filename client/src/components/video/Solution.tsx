import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { Zap } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

export function Solution({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/10 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 60%)",
            "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.2) 0%, transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 60%)",
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#D4AF37] to-[#c9a432] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#D4AF37]/30"
        >
          <Zap className="w-12 h-12 text-[#1A2B3D]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-[#D4AF37] font-medium mb-4"
        >
          Introducing
        </motion.p>

        <TextPunch 
          text="ExecuteIQ" 
          size="2xl" 
          delay={0.5}
          className="text-white mb-6"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-2"
        >
          <p className="text-2xl md:text-3xl text-white/90 font-light">
            The Strategic Execution OS
          </p>
          <p className="text-lg text-[#00A8A8]">
            for Fortune 1000 Leaders
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 inline-flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-6 py-3"
        >
          <span className="text-[#D4AF37] font-bold text-xl">12 minutes</span>
          <span className="text-white/70">from trigger to execution</span>
        </motion.div>
      </div>
    </div>
  );
}
