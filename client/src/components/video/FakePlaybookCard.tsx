import { motion } from "framer-motion";
import { Shield, Target, Rocket, AlertTriangle, Building, Users } from "lucide-react";

const icons = {
  crisis: AlertTriangle,
  market: Target,
  launch: Rocket,
  cyber: Shield,
  ma: Building,
  regulatory: Users,
};

const colors = {
  crisis: { bg: "from-red-500/20 to-red-600/10", border: "border-red-500/30", text: "text-red-400" },
  market: { bg: "from-[#0A0F2E]/20 to-[#141B45]/10", border: "border-[#2B8A6E]/30", text: "text-[#0A0F2E]" },
  launch: { bg: "from-green-500/20 to-green-600/10", border: "border-green-500/30", text: "text-green-400" },
  cyber: { bg: "from-[#0A0F2E]/20 to-[#141B45]/10", border: "border-[#C9A84C]/30", text: "text-[#C9A84C]" },
  ma: { bg: "from-amber-500/20 to-amber-600/10", border: "border-amber-500/30", text: "text-amber-400" },
  regulatory: { bg: "from-teal-500/20 to-teal-600/10", border: "border-teal-500/30", text: "text-teal-400" },
};

interface FakePlaybookCardProps {
  title: string;
  domain: string;
  tasks: number;
  type: keyof typeof icons;
  delay?: number;
  isActive?: boolean;
}

export function FakePlaybookCard({ title, domain, tasks, type, delay = 0, isActive = false }: FakePlaybookCardProps) {
  const Icon = icons[type];
  const color = colors[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`
        relative bg-gradient-to-br ${color.bg} ${color.border} border rounded-xl p-4
        ${isActive ? "ring-2 ring-[#D4AF37] shadow-lg shadow-[#D4AF37]/20" : ""}
      `}
    >
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center"
        >
          <span className="text-black text-xs font-bold">✓</span>
        </motion.div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${color.text}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-gray-900 font-medium text-sm truncate">{title}</h4>
          <p className="text-gray-700 text-xs">{domain}</p>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-gray-600">{tasks} tasks</span>
        <span className={color.text}>Ready</span>
      </div>
    </motion.div>
  );
}
