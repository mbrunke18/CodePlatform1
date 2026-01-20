import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { FakeRoleAssignment } from "./FakeRoleAssignment";
import { Zap, CheckCircle2 } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const assignments = [
  { name: "Sarah Chen", role: "CMO", task: "Prepare competitive response messaging", avatar: "SC", status: "acknowledged" as const },
  { name: "Marcus Johnson", role: "CISO", task: "Assess security implications", avatar: "MJ", status: "notified" as const },
  { name: "Emily Rodriguez", role: "VP Sales", task: "Brief sales team on positioning", avatar: "ER", status: "acknowledged" as const },
  { name: "David Kim", role: "Legal", task: "Review competitive claims", avatar: "DK", status: "assigned" as const },
];

export function ActivationDemo({ progress }: SceneProps) {
  const timelineProgress = Math.min(progress * 1.2, 1);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-[#00A8A8]/20 rounded-xl flex items-center justify-center"
          >
            <Zap className="w-6 h-6 text-[#00A8A8]" />
          </motion.div>
          <TextPunch text="Instant Activation" size="lg" className="text-white" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/60 text-lg mb-4"
        >
          One click deploys the entire response team
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
            <p className="text-white/50 text-xs">Stakeholders notified</p>
            <p className="text-[#00A8A8] font-bold text-lg">Automatically</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
            <p className="text-white/50 text-xs">Tasks assigned</p>
            <p className="text-[#D4AF37] font-bold text-lg">By Role</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
            <p className="text-white/50 text-xs">Budgets unlocked</p>
            <p className="text-green-400 font-bold text-lg">Pre-approved</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
            <p className="text-white/50 text-xs">Documents staged</p>
            <p className="text-purple-400 font-bold text-lg">Ready to send</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Team Assignments
            </h3>
            {assignments.map((assignment, i) => (
              <FakeRoleAssignment
                key={i}
                {...assignment}
                delay={0.5 + i * 0.2}
              />
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-medium mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Execution Timeline
            </h3>
            
            <div className="space-y-4">
              {[
                { time: "0:00", event: "Trigger detected", done: timelineProgress > 0.1 },
                { time: "0:15", event: "Playbook activated", done: timelineProgress > 0.25 },
                { time: "0:30", event: "Teams notified", done: timelineProgress > 0.4 },
                { time: "2:00", event: "Tasks assigned", done: timelineProgress > 0.55 },
                { time: "5:00", event: "Budget unlocked", done: timelineProgress > 0.7 },
                { time: "12:00", event: "Full execution", done: timelineProgress > 0.85 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-[#D4AF37] font-mono text-sm w-12">{item.time}</span>
                  <motion.div
                    className={`w-3 h-3 rounded-full border-2 ${
                      item.done ? "bg-green-400 border-green-400" : "border-white/30"
                    }`}
                    animate={item.done ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  />
                  <span className={item.done ? "text-white" : "text-white/40"}>{item.event}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
