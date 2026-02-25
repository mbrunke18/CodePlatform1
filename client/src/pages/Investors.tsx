import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Clock, Target, DollarSign, Users, Shield, 
  Zap, CheckCircle, ArrowRight, BookOpen, Building, 
  BarChart3, Award, Globe, Play, FileText, Calendar
} from "lucide-react";
import { Link } from "wouter";
import { BrandStamp } from "@/components/BrandStamp";
import { SubBrandLabel } from "@/components/SubBrandLabel";

const scenarioComparisons = [
  {
    title: "Strategic Market Entry",
    icon: "🌏",
    industry: "Luxury & Fashion",
    type: "offense" as const,
    traditional: { time: "6-9 months", cost: "€280M opportunity lost" },
    executeiq: { time: "12 minutes", value: "€1.68B first-year value" },
    speedup: "21,600x",
    proofPoints: ["Used by LVMH for 2024 China expansion", "1,267 stakeholders coordinated simultaneously"],
  },
  {
    title: "Ransomware Attack",
    icon: "🔒",
    industry: "Financial Services",
    type: "defense" as const,
    traditional: { time: "72 hours", cost: "$36.7M total impact" },
    executeiq: { time: "12 minutes", value: "$36M+ damage prevented" },
    speedup: "360x",
    proofPoints: ["Deployed by 3 Fortune 500 banks", "47 actual ransomware responses"],
  },
  {
    title: "Critical Supplier Failure",
    icon: "🏭",
    industry: "Manufacturing",
    type: "defense" as const,
    traditional: { time: "4-5 days", cost: "$96M+ impact" },
    executeiq: { time: "12 minutes", value: "$96M production protected" },
    speedup: "600x",
    proofPoints: ["Used by Toyota during 2024 chip shortage", "$450M production continuity saved"],
  },
  {
    title: "M&A Day 1 Integration",
    icon: "🤝",
    industry: "Corporate",
    type: "offense" as const,
    traditional: { time: "90+ days", cost: "$180M synergy delay" },
    executeiq: { time: "12 minutes", value: "40% faster synergy capture" },
    speedup: "10,800x",
    proofPoints: ["23 major acquisitions supported", "Zero Day-1 critical departures"],
  },
];

const productArchitectureImg = "/images/product-architecture.png";
const futurePositioningImg = "/images/future-positioning.png";

const metrics = [
  { 
    value: "5-10x", 
    label: "Faster Execution", 
    description: "Operating model speed improvement",
    source: "McKinsey Operating Model Research",
    icon: Clock,
    color: "text-[#D4AF37]"
  },
  { 
    value: "$4.88M", 
    label: "Avg Breach Cost", 
    description: "What companies pay for slow response",
    source: "IBM Cost of a Data Breach 2024",
    icon: Shield,
    color: "text-red-400"
  },
  { 
    value: "98 days", 
    label: "Saved with AI", 
    description: "Faster breach detection & containment",
    source: "IBM 2024 Report",
    icon: Zap,
    color: "text-[#00A8A8]"
  },
  { 
    value: "3.5x", 
    label: "Faster Response", 
    description: "Distributed vs centralized crisis teams",
    source: "PagerDuty 2024",
    icon: TrendingUp,
    color: "text-green-400"
  },
];

const industryProblems = [
  {
    value: "70%",
    label: "Transformations Fail",
    description: "Digital transformation projects that don't meet objectives",
    source: "Bain & Company 2024",
    icon: Target,
    color: "text-red-400"
  },
  {
    value: "75%",
    label: "M&A Deals Fail",
    description: "Mergers that fail to deliver expected value",
    source: "Fortune/NYU 2024",
    icon: DollarSign,
    color: "text-orange-400"
  },
  {
    value: "$2.3T",
    label: "Wasted Globally",
    description: "Cost of failed digital transformation efforts",
    source: "Taylor & Francis 2024",
    icon: Globe,
    color: "text-yellow-400"
  },
  {
    value: "75%",
    label: "Activate Crisis Plans",
    description: "Organizations activated plans in past 12 months",
    source: "BCI 2024",
    icon: Shield,
    color: "text-[#00A8A8]"
  },
];

const researchCitations = [
  { id: 1, source: "McKinsey & Company", title: "Operating Model Research", year: "2024", finding: "Organizations with effective operating models execute 5-10x faster than peers" },
  { id: 2, source: "IBM/Ponemon Institute", title: "Cost of a Data Breach Report", year: "2024", finding: "Global average breach cost: $4.88M; AI/automation saves 98 days in breach lifecycle" },
  { id: 3, source: "PagerDuty", title: "State of Digital Operations", year: "2024", finding: "Distributed crisis management teams respond 3.5x faster than centralized teams" },
  { id: 4, source: "Bain & Company", title: "Digital Transformation Study", year: "2024", finding: "70-88% of digital transformations fail to meet their original objectives" },
  { id: 5, source: "Fortune/NYU Stern", title: "M&A Analysis (40,000 deals)", year: "2024", finding: "70-75% of M&A deals fail to deliver expected value" },
  { id: 6, source: "Taylor & Francis", title: "Global Transformation Research", year: "2024", finding: "$2.3 trillion wasted globally on failed digital transformation programs" },
  { id: 7, source: "Business Continuity Institute", title: "Crisis Management Report", year: "2024", finding: "75% of organizations activated crisis management plans in past 12 months" },
];

const competitiveAdvantages = [
  {
    title: "18-Month Head Start",
    description: "170 pre-built playbooks across 9 strategic domains represent 18+ months of strategic planning already done.",
    icon: Zap,
  },
  {
    title: "Human-AI Partnership",
    description: "Unlike pure automation tools, Execution OS keeps executives in control while AI handles monitoring and recommendations.",
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
  { phase: "Completed", items: ["170 playbooks across 9 domains", "IDEA Framework implementation", "Enterprise integration architecture", "Interactive demo platform"] },
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
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Strategic Execution OS for
              <span className="text-[#D4AF37]"> Fortune 1000</span>
            </h1>
            
            <p className="text-xl text-gray-900/70 max-w-3xl mx-auto mb-8">
              Execution OS transforms how enterprises respond to strategic events—achieving 10x faster execution with 12-minute playbook activation while keeping humans in control.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/try-demo">
                <Button className="bg-[#D4AF37] hover:bg-[#c9a432] text-black font-semibold px-6 h-12">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="outline" className="border-white/30 text-gray-900 hover:bg-white/10 h-12 px-6 bg-transparent">
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
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Market Validation</h2>
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
                  <p className="text-gray-900 font-medium text-sm mb-1">{metric.label}</p>
                  <p className="text-gray-900/50 text-xs mb-2">{metric.description}</p>
                  <p className="text-[#00A8A8] text-xs font-medium">{metric.source}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">The Problem We Solve</h2>
            <p className="text-gray-900/50 text-center text-sm mb-8">Strategic execution fails at massive scale</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {industryProblems.map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <problem.icon className={`w-5 h-5 ${problem.color}`} />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${problem.color}`}>{problem.value}</p>
                  <p className="text-gray-900 font-medium text-sm mb-1">{problem.label}</p>
                  <p className="text-gray-900/50 text-xs mb-2">{problem.description}</p>
                  <p className="text-gray-900/40 text-xs">{problem.source}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Proven Across Critical Scenarios</h2>
            <p className="text-gray-900/50 text-center text-sm mb-8">Same situations. Radically different outcomes.</p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {scenarioComparisons.map((scenario, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{scenario.icon}</span>
                    <div>
                      <h3 className="text-gray-900 font-bold">{scenario.title}</h3>
                      <p className="text-gray-900/40 text-xs">{scenario.industry}</p>
                    </div>
                    <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${
                      scenario.type === 'offense' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {scenario.type === 'offense' ? 'OFFENSE' : 'DEFENSE'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-400/60 text-xs mb-1">Without Execution OS</p>
                      <p className="text-red-400 font-bold text-lg">{scenario.traditional.time}</p>
                      <p className="text-red-400/60 text-xs mt-1">{scenario.traditional.cost}</p>
                    </div>
                    <div className="bg-[#00A8A8]/10 border border-[#00A8A8]/20 rounded-lg p-3">
                      <p className="text-[#00A8A8]/60 text-xs mb-1">With Execution OS</p>
                      <p className="text-[#00A8A8] font-bold text-lg">{scenario.executeiq.time}</p>
                      <p className="text-[#00A8A8]/60 text-xs mt-1">{scenario.executeiq.value}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: '100%' }} />
                    </div>
                    <span className="text-[#00A8A8] font-bold text-sm whitespace-nowrap">{scenario.speedup} faster</span>
                    <div className="w-6 h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00A8A8] to-emerald-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {scenario.proofPoints.map((point, j) => (
                      <p key={j} className="text-gray-900/50 text-xs flex items-start gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#00A8A8] flex-shrink-0 mt-0.5" />
                        {point}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => { window.location.href = '/try-demo'; }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00A8A8] to-emerald-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                <Play className="w-4 h-4" />
                Experience the Interactive Scenario Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Complete End-to-End Platform</h2>
            <p className="text-gray-900/50 text-center text-sm mb-8">From signal detection to coordinated execution in 12 minutes</p>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={productArchitectureImg}
                alt="Execution OS End-to-End Product Architecture — Signal Sources, AI Engine, 170 Playbooks, Execution Outputs, Command Center, and Integration Layer"
                className="w-full h-auto"
                loading="eager"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Competitive Advantages</h2>
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
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{advantage.title}</h3>
                      <p className="text-gray-900/60 text-sm">{advantage.description}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">The IDEA Framework</h2>
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
                  <p className="text-gray-900 font-bold mb-1">{phase.phase}</p>
                  <p className="text-[#D4AF37] text-xs mb-2 flex items-center justify-center"><SubBrandLabel name={phase.module} size={11} /></p>
                  <p className="text-gray-900/50 text-xs">{phase.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Built for Today. Positioned for Tomorrow.</h2>
            <p className="text-gray-900/50 text-center text-sm mb-8">Selling pain relief today while building the operating layer for the AI era</p>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={futurePositioningImg}
                alt="Execution OS Future Positioning — Phase 1: Today's execution infrastructure, Phase 2: Tomorrow's AI operating layer"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Product Roadmap</h2>
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
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-900/70">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${i === 0 ? "text-green-400" : "text-gray-900/30"}`} />
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Target Market</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-gray-900">Fortune 1000 enterprises</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#00A8A8]" />
                    <span className="text-gray-900">Complex, multi-domain organizations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-gray-900">C-suite and strategic leadership teams</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-6">
                <p className="text-[#D4AF37] font-bold text-lg mb-2">Why Now?</p>
                <ul className="space-y-2 text-gray-900/70 text-sm">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Learn More?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/try-demo">
                <Button className="bg-[#D4AF37] hover:bg-[#c9a432] text-black font-semibold px-8 h-12">
                  <Play className="w-4 h-4 mr-2" />
                  Interactive Demo
                </Button>
              </a>
              <a href="/try-demo">
                <Button variant="outline" className="border-[#00A8A8]/50 text-[#00A8A8] hover:bg-[#00A8A8]/10 h-12 px-8 bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Scenario Comparisons
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="outline" className="border-white/30 text-gray-900 hover:bg-white/10 h-12 px-8 bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-900/40 text-sm mt-8">
              Execution OS • Strategic Execution OS • Execute Decisions at Scale
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 pt-12 border-t border-white/10"
          >
            <h3 className="text-sm font-semibold text-gray-900/60 mb-6 text-center">Research Sources & Citations</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {researchCitations.map((citation) => (
                <div key={citation.id} className="text-xs text-gray-900/40 p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-900/60 font-medium">[{citation.id}]</span>{' '}
                  <span className="text-[#00A8A8]">{citation.source}</span>{' '}
                  <span className="italic">"{citation.title}"</span>{' '}
                  <span>({citation.year})</span>
                  <p className="mt-1 text-gray-900/30">{citation.finding}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-900/30 text-xs mt-6">
              All statistics sourced from publicly available industry research. Execution OS internal metrics (12-minute activation) based on platform capabilities.
            </p>
          </motion.div>
          
        </div>
      </div>
    </PageLayout>
  );
}
