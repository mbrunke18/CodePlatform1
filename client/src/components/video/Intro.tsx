import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

export function Intro({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37]/20"
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
              className="absolute inset-0 border-4 border-[#D4AF37]"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 border-2 border-[#00A8A8]"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-8 border border-[#D4AF37]/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <ExecuteIQLogo variant="icon-only" width={40} color="navy" />
            </div>
          </div>
        </motion.div>

        <TextPunch 
          text="Readiness OS" 
          size="2xl" 
          delay={0.5}
          className="text-gray-900 mb-4"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-xl md:text-2xl text-gray-800 max-w-xl mx-auto"
        >
          17 independent reports from 15 major firms confirm: execution infrastructure is the enterprise bottleneck.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-lg md:text-xl text-[#D4AF37] max-w-xl mx-auto mt-4"
        >
          Trigger-to-Execution Orchestration: from strategic trigger to coordinated execution in 12 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 flex flex-wrap justify-center gap-3 text-xs"
        >
          <span className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700">
            M&A Integration
          </span>
          <span className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700">
            Crisis Response
          </span>
          <span className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700">
            Compound Disruption
          </span>
          <span className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700">
            Competitive Moves
          </span>
          <span className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700">
            Regulatory Changes
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-[#D4AF37] text-2xl font-bold">Trigger to Execution in 12 Minutes</p>
          <p className="text-[#00A8A8] text-sm mt-2">180 Readiness Protocols • 9 strategic domains • 50-200+ stakeholders coordinated</p>
        </motion.div>
      </div>
      
      <NarrationBox 
        headline="Trigger-to-Execution Orchestration"
        description="17 independent reports confirm: enterprises need execution infrastructure. Readiness OS coordinates 50-200+ stakeholders from trigger to full execution in 12 minutes—across 9 strategic domains."
        delay={0.5}
      />
    </div>
  );
}
