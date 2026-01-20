import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Clock, Target, DollarSign, Users, Shield, 
  Zap, CheckCircle, ArrowRight, BookOpen, Building, 
  BarChart3, Award, Globe, Play, FileText, Calendar
} from "lucide-react";
import { Link } from "wouter";

const metrics = [
  { 
    value: "340x", 
    label: "Faster Response", 
    description: "72 hours → 12 minutes",
    source: "McKinsey Research",
    icon: Clock,
    color: "text-[#D4AF37]"
  },
  { 
    value: "$4.88M", 
    label: "Avg Breach Cost", 
    description: "What companies pay for slow response",
    source: "IBM/Ponemon 2024",
    icon: Shield,
    color: "text-red-400"
  },
  { 
    value: "10.3%", 
    label: "Revenue Growth", 
    description: "For companies with strategic agility",
    source: "BAI 2025 Report",
    icon: TrendingUp,
    color: "text-green-400"
  },
  { 
    value: "$900B", 
    label: "Market Opportunity", 
    description: "Strategy-execution gap costs annually",
    source: "Fortune 500 Analysis",
    icon: DollarSign,
    color: "text-[#00A8A8]"
  },
];

const competitiveAdvantages = [
  {
    title: "18-Month Head Start",
    description: "166 pre-built playbooks across 9 strategic domains represent 18+ months of strategic planning already done.",
    icon: Zap,
  },
  {
    title: "Human-AI Partnership",
    description: "Unlike pure automation tools, ExecuteIQ keeps executives in control while AI handles monitoring and recommendations.",
    icon: Users,
  },
  {
    title: "Enterprise-Ready Platform",
    description: "Built for Fortune 1000 complexity with integrations to Jira, Slack, Salesforce, ServiceNow, and more.",
    icon: Building,
  },
  {
    title: "Research-Validated Approach",
    description: "Built on established frameworks from McKinsey, IBM, and Harvard Business Review research.",
    icon: Award,
  },
];

const milestones = [
  { phase: "Completed", items: ["166 playbooks across 9 domains", "IDEA Framework implementation", "Enterprise integration architecture", "Interactive demo platform"] },
  { phase: "Current", items: ["Customer pilot programs", "AI signal detection refinement", "Enterprise partnership discussions"] },
  { phase: "Next 12 Months", items: ["First enterprise contracts", "Expanded playbook library (250+)", "Industry-specific vertical solutions"] },
];

export default function Investors() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4 py-16">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-2 mb-6">
              <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium">Investor Overview</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              The Strategic Execution OS for
              <span className="text-[#D4AF37]"> Fortune 1000</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              ExecuteIQ transforms how enterprises respond to strategic events—reducing coordination time from 72 hours to 12 minutes while keeping humans in control.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pilot-demo">
                <Button className="bg-[#D4AF37] hover:bg-[#c9a432] text-black font-semibold px-6 h-12">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">Market Validation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-white/5 flex items-center justify-center">
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${metric.color}`}>{metric.value}</p>
                  <p className="text-white font-medium text-sm mb-1">{metric.label}</p>
                  <p className="text-white/50 text-xs mb-2">{metric.description}</p>
                  <p className="text-[#00A8A8] text-xs font-medium">{metric.source}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">Competitive Advantages</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {competitiveAdvantages.map((advantage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <advantage.icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{advantage.title}</h3>
                      <p className="text-white/60 text-sm">{advantage.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-20 bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">The IDEA Framework</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { phase: "IDENTIFY", module: "Playbook™", desc: "Build and customize strategic playbooks", color: "bg-[#D4AF37]" },
                { phase: "DETECT", module: "Signal™", desc: "AI-powered signal monitoring", color: "bg-[#00A8A8]" },
                { phase: "EXECUTE", module: "Compass™", desc: "Coordinated 12-minute response", color: "bg-[#00A8A8]" },
                { phase: "ADVANCE", module: "Retrospect™", desc: "Institutional learning", color: "bg-[#D4AF37]" },
              ].map((phase, i) => (
                <div key={i} className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${phase.color} flex items-center justify-center text-black font-bold text-lg`}>
                    {phase.phase[0]}
                  </div>
                  <p className="text-white font-bold mb-1">{phase.phase}</p>
                  <p className="text-[#D4AF37] text-xs mb-2">{phase.module}</p>
                  <p className="text-white/50 text-xs">{phase.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">Product Roadmap</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {milestones.map((milestone, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    i === 0 ? "bg-green-500/20 text-green-400" :
                    i === 1 ? "bg-[#D4AF37]/20 text-[#D4AF37]" :
                    "bg-[#00A8A8]/20 text-[#00A8A8]"
                  }`}>
                    {i === 0 ? <CheckCircle className="w-3 h-3" /> : i === 1 ? <Zap className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                    {milestone.phase}
                  </div>
                  <ul className="space-y-2">
                    {milestone.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${i === 0 ? "text-green-400" : "text-white/30"}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-20 bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Target Market</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-white">Fortune 1000 enterprises</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#00A8A8]" />
                    <span className="text-white">Complex, multi-domain organizations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-white">C-suite and strategic leadership teams</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-6">
                <p className="text-[#D4AF37] font-bold text-lg mb-2">Why Now?</p>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• AI disruption accelerating strategic uncertainty</li>
                  <li>• Regulatory windows shrinking globally</li>
                  <li>• Remote work fragmented institutional knowledge</li>
                  <li>• Competitors moving faster than ever</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Ready to Learn More?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pilot-demo">
                <Button className="bg-[#D4AF37] hover:bg-[#c9a432] text-black font-semibold px-8 h-12">
                  <Play className="w-4 h-4 mr-2" />
                  Interactive Demo
                </Button>
              </Link>
              <Link href="/investor-demo">
                <Button variant="outline" className="border-[#00A8A8]/50 text-[#00A8A8] hover:bg-[#00A8A8]/10 h-12 px-8">
                  <FileText className="w-4 h-4 mr-2" />
                  Investor Presentation
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </Link>
            </div>
            
            <p className="text-white/40 text-sm mt-8">
              ExecuteIQ • Strategic Execution OS • Execute Decisions at Scale
            </p>
          </motion.div>
          
        </div>
      </div>
    </PageLayout>
  );
}
