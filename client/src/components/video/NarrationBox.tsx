import { motion } from "framer-motion";

interface NarrationBoxProps {
  headline: string;
  description: string;
  delay?: number;
}

export function NarrationBox({ headline, description, delay = 0.3 }: NarrationBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="absolute top-4 left-4 z-20 max-w-xs"
    >
      <div className="bg-white/95 backdrop-blur-sm border-l-2 border-[#D4AF37] shadow-lg rounded-r-lg px-3 py-2">
        <p className="text-[#D4AF37] font-semibold text-xs mb-0.5">{headline}</p>
        <p className="text-gray-800 text-xs leading-tight">{description}</p>
      </div>
    </motion.div>
  );
}
