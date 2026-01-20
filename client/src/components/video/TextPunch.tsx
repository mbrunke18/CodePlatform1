import { motion } from "framer-motion";

interface TextPunchProps {
  text: string;
  delay?: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function TextPunch({ text, delay = 0, className = "", size = "lg" }: TextPunchProps) {
  const sizeClasses = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-4xl",
    lg: "text-4xl md:text-6xl",
    xl: "text-5xl md:text-7xl",
    "2xl": "text-6xl md:text-8xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay, 
        duration: 0.4, 
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}
    >
      {text}
    </motion.div>
  );
}

export function TypewriterText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <motion.div className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * 0.03 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function CountUp({ end, duration = 2, delay = 0, suffix = "" }: { end: number; duration?: number; delay?: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
      >
        {end}{suffix}
      </motion.span>
    </motion.span>
  );
}
