import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "wouter";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

export function Outro({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.25) 0%, transparent 60%)",
            "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="relative w-24 h-24 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-[#D4AF37]"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-3 rounded-full border-2 border-[#00A8A8]"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-[#D4AF37]">EIQ</span>
            </div>
          </div>
        </motion.div>

        <TextPunch 
          text="ExecuteIQ" 
          size="2xl" 
          delay={0.3}
          className="text-white mb-4"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl text-[#D4AF37] font-medium mb-2"
        >
          Execute Decisions at Scale
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-white/60 mb-12"
        >
          Detect Early. Execute Precisely. Advance Strategy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="/try-demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#D4AF37] hover:bg-[#c9a432] text-black font-bold px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl shadow-[#D4AF37]/30"
            >
              Try Demo
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </a>
          
          <Link href="/pricing">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-full flex items-center gap-3 border border-white/20"
            >
              <Calendar className="w-5 h-5" />
              Start Pilot
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-10 pt-6 border-t border-white/10"
        >
          <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Investor Ready</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="text-[#D4AF37]">18-month head start</span>
            <span className="text-white/30">•</span>
            <span className="text-[#00A8A8]">170 playbooks built</span>
            <span className="text-white/30">•</span>
            <span className="text-white">Platform validated</span>
          </div>
          <p className="text-white/40 text-xs mt-4">
            $900B market opportunity • Fortune 1000 target customers
          </p>
        </motion.div>
      </div>
      
      <NarrationBox 
        headline="Ready to Transform Your Execution?"
        description="Try the demo or start a pilot program to see ExecuteIQ in action for your organization."
        delay={0.5}
      />
    </div>
  );
}
