import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";

interface FakeRoleAssignmentProps {
  name: string;
  role: string;
  task: string;
  avatar: string;
  delay?: number;
  status?: "assigned" | "notified" | "acknowledged";
}

export function FakeRoleAssignment({ name, role, task, avatar, delay = 0, status = "assigned" }: FakeRoleAssignmentProps) {
  const statusColors = {
    assigned: "bg-[#0A0F2E]",
    notified: "bg-amber-500",
    acknowledged: "bg-green-500",
  };

  const statusText = {
    assigned: "Assigned",
    notified: "Notified",
    acknowledged: "Acknowledged",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-gray-50 border border-gray-200 p-4 flex items-center gap-4"
    >
      <div className="relative">
        <div className="w-12 h-12 bg-poise-navy flex items-center justify-center text-lg font-bold text-white">
          {avatar}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3 }}
          className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusColors[status]} flex items-center justify-center`}
        >
          {status === "acknowledged" ? (
            <Check className="w-3 h-3 text-gray-900" />
          ) : (
            <Clock className="w-3 h-3 text-gray-900" />
          )}
        </motion.div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-gray-900 font-medium text-sm">{name}</h4>
          <span className="text-[#D4AF37] text-xs">{role}</span>
        </div>
        <p className="text-gray-700 text-xs truncate">{task}</p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
        className={`px-2 py-1 rounded text-xs font-medium ${
          status === "acknowledged" ? "bg-green-500/20 text-green-400" :
          status === "notified" ? "bg-amber-500/20 text-amber-400" :
          "bg-[#0A0F2E]/20 text-[#0A0F2E]"
        }`}
      >
        {statusText[status]}
      </motion.div>
    </motion.div>
  );
}
