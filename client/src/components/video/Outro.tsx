import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { ArrowRight, Calendar } from "lucide-react";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import { Link } from "wouter";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

export function Outro({ progress }: SceneProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center overflow-hidden">
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
              className="absolute inset-0 border-4 border-[#D4AF37]"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-3 border-2 border-[#00A8A8]"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <ExecuteIQLogo variant="icon-only" width={36} color="navy" />
            </div>
          </div>
        </motion.div>

        <TextPunch 
          text="Readiness OS" 
          size="2xl" 
          delay={0.3}
          className="text-gray-900 mb-4"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl text-[#D4AF37] font-medium mb-2"
        >
          Trigger-to-Execution Orchestration
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-gray-700 mb-4"
        >
          From strategic trigger to coordinated execution in 12 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-3 text-xs mb-10"
        >
          <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
            AI-Powered Signal Detection
          </span>
          <span className="px-3 py-1 bg-[#00A8A8]/10 border border-[#00A8A8]/30 text-[#00A8A8]">
            Executive Summary Generator
          </span>
          <span className="px-3 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">
            What-If Analyzer
          </span>
          <span className="px-3 py-1 bg-[#0A0F2E]/10 border border-[#2B8A6E]/30 text-[#0A0F2E]">
            Readiness Assessment
          </span>
        </motion.div>

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
              className="bg-[#D4AF37] hover:bg-[#c9a432] text-black font-bold px-8 py-4 flex items-center gap-3 shadow-[#D4AF37]/30"
            >
              Try Demo
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </a>
          
          <Link href="/pricing">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-8 py-4 flex items-center gap-3 border border-gray-200"
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
          className="mt-10 pt-6 border-t border-gray-200"
        >
          <p className="text-gray-700 text-xs uppercase tracking-wider mb-3">Investor Ready</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="text-[#D4AF37]">18-month head start</span>
            <span className="text-gray-600">•</span>
            <span className="text-[#00A8A8]">170 prepared responses</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-900">17 reports validate the gap</span>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            $13-20B TAM • Fortune 1000 target • Compound disruption ready
          </p>
        </motion.div>
      </div>
      
      <NarrationBox 
        headline="The Infrastructure Enterprises Are Missing"
        description="Trigger-to-Execution Orchestration for Fortune 1000. 170 Prepared Responses, Signal-based monitoring, executive intelligence, and compound disruption response—all in 12 minutes."
        delay={0.5}
      />
    </div>
  );
}
