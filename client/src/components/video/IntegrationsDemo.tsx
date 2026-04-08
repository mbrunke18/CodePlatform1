import { motion } from "framer-motion";
import { TextPunch } from "./TextPunch";
import { NarrationBox } from "./NarrationBox";
import { SiSlack, SiJira, SiSalesforce } from "react-icons/si";
import { Mail, Calendar, FileText, Users, CheckCircle, MessageSquare, Wrench } from "lucide-react";

interface SceneProps {
  progress: number;
  isPlaying: boolean;
}

const integrations = [
  { name: "Jira", icon: SiJira, color: "#0052CC", action: "Creating project & tasks..." },
  { name: "Slack", icon: SiSlack, color: "#4A154B", action: "Notifying #crisis-response..." },
  { name: "MS Teams", icon: MessageSquare, color: "#6264A7", action: "Setting up war room..." },
  { name: "Salesforce", icon: SiSalesforce, color: "#00A1E0", action: "Logging customer impact..." },
  { name: "ServiceNow", icon: Wrench, color: "#81B5A1", action: "Creating incident ticket..." },
];

const actions = [
  { icon: FileText, text: "Documents staged", delay: 0.5 },
  { icon: Calendar, text: "Meetings scheduled", delay: 0.8 },
  { icon: Users, text: "Teams notified", delay: 1.1 },
  { icon: Mail, text: "Stakeholders briefed", delay: 1.4 },
];

export function IntegrationsDemo({ progress }: SceneProps) {
  const activeIntegration = Math.min(Math.floor(progress * 6), 5);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
        <div className="text-center mb-10">
          <TextPunch text="Seamless Integration" size="lg" className="text-gray-900 mb-4" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 text-lg"
          >
            Command OS connects to your existing tools
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-gray-700 text-sm font-medium mb-4">ENTERPRISE INTEGRATIONS</p>
            <div className="space-y-3">
              {integrations.map((integration, i) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className={`flex items-center gap-4 bg-gray-50 border rounded-lg p-4 transition-all ${
                    i < activeIntegration ? "border-green-500/50" : "border-gray-200"
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${integration.color}20` }}
                  >
                    <integration.icon className="w-5 h-5" style={{ color: integration.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{integration.name}</p>
                    {i < activeIntegration && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-400 text-xs"
                      >
                        {integration.action}
                      </motion.p>
                    )}
                  </div>
                  {i < activeIntegration && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-gray-50 border border-[#D4AF37]/30 rounded-xl p-6">
              <p className="text-[#D4AF37] font-bold text-lg mb-4">Automatic Actions</p>
              <div className="space-y-4">
                {actions.map((action, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: progress > action.delay ? 1 : 0.3, x: 0 }}
                    transition={{ delay: action.delay }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      progress > action.delay ? "bg-green-500/20" : "bg-gray-100"
                    }`}>
                      <action.icon className={`w-4 h-4 ${
                        progress > action.delay ? "text-green-400" : "text-gray-600"
                      }`} />
                    </div>
                    <span className={progress > action.delay ? "text-gray-900" : "text-gray-600"}>
                      {action.text}
                    </span>
                    {progress > action.delay && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-400 text-xs ml-auto"
                      >
                        ✓ Complete
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-center text-gray-700 text-sm mt-6"
            >
              All automated. All in <span className="text-[#D4AF37] font-bold">12 minutes</span>.
            </motion.p>
          </div>
        </div>
      </div>
      
      <NarrationBox 
        headline="Seamless Enterprise Integration"
        description="Command OS connects to Jira, Slack, Teams, Salesforce, and more—automatically creating tasks and notifying teams."
        delay={0.5}
      />
    </div>
  );
}
