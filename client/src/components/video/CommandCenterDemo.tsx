import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { Activity, Users, Clock, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const tasks = [
  { name: "Brief executive team", owner: "CEO", status: "complete", time: "0:45" },
  { name: "Draft press statement", owner: "Comms", status: "complete", time: "2:30" },
  { name: "Assess customer impact", owner: "Sales VP", status: "active", time: "4:15" },
  { name: "Review legal implications", owner: "Legal", status: "pending", time: "-" },
  { name: "Update board deck", owner: "Strategy", status: "pending", time: "-" },
];

const teamMembers = [
  { name: "Sarah C.", role: "CMO", status: "online", avatar: "SC" },
  { name: "Marcus J.", role: "CISO", status: "online", avatar: "MJ" },
  { name: "Emily R.", role: "VP Sales", status: "busy", avatar: "ER" },
  { name: "David K.", role: "Legal", status: "online", avatar: "DK" },
];

export function CommandCenterDemo({ progress }: SceneProps) {
  const completedTasks = Math.min(Math.floor(progress * 4), 3);
  const elapsedTime = Math.floor(progress * 720);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-red-500"
            />
            <TextPunch text="Command Center" size="md" className="text-gray-900" />
            <span className="text-red-400 text-sm font-medium">LIVE</span>
          </div>
          
          <motion.div
            className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-2"
          >
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-mono font-bold">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-gray-700 text-sm">/ 12:00</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-6 mb-4 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 p-2"
        >
          <p className="text-gray-800 text-sm">Real-time visibility:</p>
          <span className="text-green-400 text-sm font-medium">Every stakeholder • Every task • Every decision</span>
          <p className="text-gray-700 text-sm">|</p>
          <span className="text-[#D4AF37] text-sm font-medium">No more "who's doing what?"</span>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-gray-50 border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00A8A8]" />
                Execution Tasks
              </h3>
              <span className="text-gray-700 text-sm">{completedTasks}/5 complete</span>
            </div>
            
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex items-center gap-3 p-3 ${
                    i < completedTasks ? "bg-green-500/10" :
                    i === completedTasks ? "bg-amber-500/10 border border-amber-500/30" :
                    "bg-gray-50"
                  }`}
                >
                  <div className={`w-6 h-6 flex items-center justify-center ${
                    i < completedTasks ? "bg-green-500" :
                    i === completedTasks ? "bg-amber-500" : "bg-gray-100"
                  }`}>
                    {i < completedTasks ? (
                      <CheckCircle2 className="w-4 h-4 text-gray-900" />
                    ) : i === completedTasks ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-3 h-3 border-2 border-white border-t-transparent"
                      />
                    ) : (
                      <span className="text-gray-600 text-xs">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={i < completedTasks ? "text-gray-700 line-through" : "text-gray-900"}>
                      {task.name}
                    </p>
                  </div>
                  <span className="text-gray-600 text-xs">{task.owner}</span>
                  <span className={`text-xs font-mono ${
                    i < completedTasks ? "text-green-400" : "text-gray-600"
                  }`}>
                    {task.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="text-gray-900 font-medium flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                Active Team
              </h3>
              <div className="space-y-2">
                {teamMembers.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-poise-navy flex items-center justify-center text-xs font-bold text-white">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-[#0f1a26] ${
                        member.status === "online" ? "bg-green-400" : "bg-amber-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">{member.name}</p>
                      <p className="text-gray-600 text-xs">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-amber-500/10 border border-amber-500/30 p-4"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-amber-400 text-sm font-medium">Decision Required</p>
                  <p className="text-gray-700 text-xs mt-1">Approve customer communication?</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <NarrationBox 
        headline="Real-Time Command Center"
        description="Track every stakeholder, every task, and every decision in real-time. No more wondering 'who's doing what?'"
        delay={0.5}
      />
    </div>
  );
}
