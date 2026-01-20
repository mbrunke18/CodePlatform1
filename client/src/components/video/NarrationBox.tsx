import { motion } from "framer-motion";

interface NarrationBoxProps {
  headline: string;
  description: string;
  delay?: number;
}

export function NarrationBox({ headline, description, delay = 0.3 }: NarrationBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 max-w-2xl w-full px-4"
    >
      <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 text-center">
        <p className="text-[#D4AF37] font-semibold text-sm mb-1">{headline}</p>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}
