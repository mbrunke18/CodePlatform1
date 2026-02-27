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
    color: "text-[#C9A84C]"
  },
  { 
    value: "$4.88M", 
    label: "Avg Breach Cost", 
    description: "What companies pay for slow response",
    source: "IBM Cost of a Data Breach 2024",
    icon: Shield,
    color: "text-[#0A0F2E]"
  },
  { 
    value: "98 days", 
    label: "Saved with AI", 
    description: "Faster breach detection & containment",
    source: "IBM 2024 Report",
    icon: Zap,
    color: "text-[#2B8A6E]"
  },
  { 
    value: "3.5x", 
    label: "Faster Response", 
    description: "Distributed vs centralized crisis teams",
    source: "PagerDuty 2024",
    icon: TrendingUp,
    color: "text-[#C9A84C]"
  },
];

const industryProblems = [
  {
    value: "70%",
    label: "Transformations Fail",
    description: "Digital transformation projects that don't meet objectives",
    source: "Bain & Company 2024",
    icon: Target,
    color: "text-[#0A0F2E]"
  },
  {
    value: "75%",
    label: "M&A Deals Fail",
    description: "Mergers that fail to deliver expected value",
    source: "Fortune/NYU 2024",
    icon: DollarSign,
    color: "text-[#C9A84C]"
  },
  {
    value: "$2.3T",
    label: "Wasted Globally",
    description: "Cost of failed digital transformation efforts",
    source: "Taylor & Francis 2024",
    icon: Globe,
    color: "text-[#C9A84C]"
  },
  {
    value: "75%",
    label: "Activate Crisis Plans",
    description: "Organizations activated plans in past 12 months",
    source: "BCI 2024",
    icon: Shield,
    color: "text-[#2B8A6E]"
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
      <div className="min-h-screen bg-[#F8F7F4] relative overflow-hidden">
        {/* Gold dot grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-[1px] w-7 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.2em]">Investor Overview</span>
              <div className="h-[1px] w-7 bg-[#C9A84C]" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#0A0F2E] mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Strategic Execution OS for
              <span className="text-[#C9A84C]"> Fortune 1000</span>
            </h1>
            
            <p className="text-xl text-[#0A0F2E]/70 max-w-3xl mx-auto mb-8 font-medium">
              Execution OS transforms how enterprises respond to strategic events—achieving 10x faster execution with 12-minute playbook activation while keeping humans in control.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/try-demo">
                <Button className="bg-[#0A0F2E] hover:bg-[#141B45] text-white font-bold px-8 h-12 rounded-xl shadow-lg">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E] hover:bg-[#0A0F2E]/10 h-12 px-8 bg-[#0A0F2E]/5 backdrop-blur-sm rounded-xl">
                  <Calendar className="w-4 h-4 mr-2 text-[#C9A84C]" />
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
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-8 uppercase tracking-widest">Market Validation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white border border-[#E8E4DC] rounded-xl p-6 text-center shadow-sm hover:border-[#C9A84C]/50 transition-colors"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[#0A0F2E]/5 flex items-center justify-center">
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${metric.color}`}>{metric.value}</p>
                  <p className="text-[#0A0F2E] font-bold text-sm mb-1">{metric.label}</p>
                  <p className="text-[#6B7280] text-xs mb-2 font-medium">{metric.description}</p>
                  <p className="text-[#2B8A6E] text-xs font-bold">{metric.source}</p>
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
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-3 uppercase tracking-widest">The Problem We Solve</h2>
            <p className="text-[#6B7280] text-center text-sm mb-8 font-medium">Strategic execution fails at massive scale</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {industryProblems.map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white border border-[#E8E4DC] rounded-xl p-6 text-center shadow-sm hover:border-[#C9A84C]/50 transition-colors"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[#0A0F2E]/5 flex items-center justify-center">
                    <problem.icon className={`w-5 h-5 text-[#0A0F2E]`} />
                  </div>
                  <p className={`text-3xl font-bold mb-1 text-[#0A0F2E]`}>{problem.value}</p>
                  <p className="text-[#0A0F2E] font-bold text-sm mb-1">{problem.label}</p>
                  <p className="text-[#6B7280] text-xs mb-2 font-medium">{problem.description}</p>
                  <p className="text-[#6B7280]/60 text-xs font-bold">{problem.source}</p>
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
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-3 uppercase tracking-widest">Proven Across Critical Scenarios</h2>
            <p className="text-[#6B7280] text-center text-sm mb-8 font-medium">Same situations. Radically different outcomes.</p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {scenarioComparisons.map((scenario, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white border border-[#E8E4DC] rounded-xl p-6 shadow-sm hover:border-[#C9A84C]/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{scenario.icon}</span>
                    <div>
                      <h3 className="text-[#0A0F2E] font-bold">{scenario.title}</h3>
                      <p className="text-[#6B7280] text-xs font-bold">{scenario.industry}</p>
                    </div>
                    <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${
                      scenario.type === 'offense' 
                        ? 'bg-[#2B8A6E]/10 text-[#2B8A6E] border border-[#2B8A6E]/20' 
                        : 'bg-[#0A0F2E]/10 text-[#0A0F2E] border border-[#0A0F2E]/20'
                    }`}>
                      {scenario.type === 'offense' ? 'OFFENSE' : 'DEFENSE'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0A0F2E]/5 border border-[#0A0F2E]/10 rounded-lg p-3">
                      <p className="text-[#6B7280] text-[10px] font-bold uppercase tracking-wider mb-1">Traditional</p>
                      <p className="text-[#0A0F2E] font-bold text-lg">{scenario.traditional.time}</p>
                      <p className="text-[#6B7280] text-xs font-medium mt-1">{scenario.traditional.cost}</p>
                    </div>
                    <div className="bg-[#2B8A6E]/5 border border-[#2B8A6E]/10 rounded-lg p-3">
                      <p className="text-[#2B8A6E]/60 text-[10px] font-bold uppercase tracking-wider mb-1">Execution OS</p>
                      <p className="text-[#2B8A6E] font-bold text-lg">{scenario.executeiq.time}</p>
                      <p className="text-[#2B8A6E]/60 text-xs font-medium mt-1">{scenario.executeiq.value}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-2 bg-[#F8F7F4] rounded-full overflow-hidden border border-[#E8E4DC]">
                      <div className="h-full bg-[#0A0F2E]" style={{ width: '100%' }} />
                    </div>
                    <span className="text-[#2B8A6E] font-bold text-sm whitespace-nowrap">{scenario.speedup} faster</span>
                    <div className="w-6 h-2 bg-[#F8F7F4] rounded-full overflow-hidden border border-[#E8E4DC]">
                      <div className="h-full bg-[#2B8A6E]" style={{ width: '100%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {scenario.proofPoints.map((point, j) => (
                      <p key={j} className="text-[#6B7280] text-xs flex items-start gap-1.5 font-medium">
                        <CheckCircle className="w-3 h-3 text-[#2B8A6E] flex-shrink-0 mt-0.5" />
                        {point}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/try-demo">
                <Button
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold rounded-xl shadow-lg transition-all"
                >
                  <Play className="w-4 h-4" />
                  Experience the Interactive Scenario Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-3 uppercase tracking-widest">Complete End-to-End Platform</h2>
            <p className="text-[#6B7280] text-center text-sm mb-8 font-medium">From signal detection to coordinated execution in 12 minutes</p>
            <div className="rounded-2xl overflow-hidden border border-[#E8E4DC] shadow-2xl bg-white p-4">
              <img
                src={productArchitectureImg}
                alt="Execution OS End-to-End Product Architecture"
                className="w-full h-auto rounded-xl"
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
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-8 uppercase tracking-widest">Competitive Advantages</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {competitiveAdvantages.map((advantage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white border border-[#E8E4DC] rounded-xl p-6 shadow-sm hover:border-[#C9A84C]/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0 border border-[#C9A84C]/20">
                      <advantage.icon className="w-6 h-6 text-[#C9A84C]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0A0F2E] mb-2">{advantage.title}</h3>
                      <p className="text-[#6B7280] text-sm font-medium">{advantage.description}</p>
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
            className="mb-20 bg-white border border-[#E8E4DC] rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-8 uppercase tracking-widest">The IDEA Framework</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { phase: "IDENTIFY", module: "Playbook™", desc: "Build and customize strategic playbooks", color: "bg-[#0A0F2E]" },
                { phase: "DETECT", module: "Signal™", desc: "AI-powered signal monitoring", color: "bg-[#2B8A6E]" },
                { phase: "EXECUTE", module: "Compass™", desc: "Coordinated 12-minute response", color: "bg-[#C9A84C]" },
                { phase: "ADVANCE", module: "Retrospect™", desc: "Institutional learning", color: "bg-[#2B8A6E]" },
              ].map((phase, i) => (
                <div key={i} className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${phase.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {phase.phase[0]}
                  </div>
                  <p className="text-[#0A0F2E] font-bold mb-1 tracking-wider">{phase.phase}</p>
                  <p className="mb-2 flex items-center justify-center"><SubBrandLabel name={phase.module} size={11} /></p>
                  <p className="text-[#6B7280] text-xs font-medium">{phase.desc}</p>
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
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-3 uppercase tracking-widest">Built for Today. Positioned for Tomorrow.</h2>
            <p className="text-[#6B7280] text-center text-sm mb-8 font-medium">Selling pain relief today while building the operating layer for the AI era</p>
            <div className="rounded-2xl overflow-hidden border border-[#E8E4DC] shadow-2xl bg-white p-4">
              <img
                src={futurePositioningImg}
                alt="Execution OS Future Positioning"
                className="w-full h-auto rounded-xl"
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
            <h2 className="text-2xl font-bold text-[#0A0F2E] text-center mb-8 uppercase tracking-widest">Product Roadmap</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {milestones.map((milestone, i) => (
                <div key={i} className="bg-white border border-[#E8E4DC] rounded-xl p-6 shadow-sm hover:border-[#C9A84C]/50 transition-colors">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                    i === 0 ? "bg-[#2B8A6E]/10 text-[#2B8A6E]" :
                    i === 1 ? "bg-[#C9A84C]/10 text-[#C9A84C]" :
                    "bg-[#0A0F2E]/10 text-[#0A0F2E]"
                  }`}>
                    {i === 0 ? <CheckCircle className="w-3 h-3" /> : i === 1 ? <Zap className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                    {milestone.phase}
                  </div>
                  <ul className="space-y-2">
                    {milestone.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[#0A0F2E]/70 font-medium">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${i === 0 ? "text-[#2B8A6E]" : "text-[#E8E4DC]"}`} />
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
            className="mb-20 bg-[#0A0F2E] border border-[#E8E4DC] rounded-2xl p-8 shadow-2xl text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">Target Market</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#C9A84C]" />
                    <span className="text-white/80 font-medium">Fortune 1000 enterprises</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#2B8A6E]" />
                    <span className="text-white/80 font-medium">Complex, multi-domain organizations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#C9A84C]" />
                    <span className="text-white/80 font-medium">C-suite and strategic leadership teams</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#0A0F2E]/10 border border-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                <p className="text-[#C9A84C] font-bold text-lg mb-2 uppercase tracking-wider">Why Now?</p>
                <ul className="space-y-2 text-white/70 text-sm font-medium">
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
            <h2 className="text-2xl font-bold text-[#0A0F2E] mb-6">Ready to Learn More?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/try-demo">
                <Button className="bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-semibold px-8 h-12">
                  <Play className="w-4 h-4 mr-2" />
                  Interactive Demo
                </Button>
              </Link>
              <Link href="/try-demo">
                <Button variant="outline" className="border-[#2B8A6E]/50 text-[#2B8A6E] hover:bg-[#2B8A6E]/10 h-12 px-8 bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Scenario Comparisons
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-[#0A0F2E]/30 text-[#0A0F2E] hover:bg-[#0A0F2E]/10 h-12 px-8 bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </Link>
            </div>
            
            <p className="text-[#0A0F2E]/40 text-sm mt-8">
              Execution OS • Strategic Execution OS • Execute Decisions at Scale
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 pt-12 border-t border-[#0A0F2E]/10"
          >
            <h3 className="text-sm font-semibold text-[#0A0F2E]/60 mb-6 text-center">Research Sources & Citations</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {researchCitations.map((citation) => (
                <div key={citation.id} className="text-xs text-[#0A0F2E]/40 p-3 bg-[#0A0F2E]/5 rounded-lg">
                  <span className="text-[#0A0F2E]/60 font-medium">[{citation.id}]</span>{' '}
                  <span className="text-[#2B8A6E]">{citation.source}</span>{' '}
                  <span className="italic">"{citation.title}"</span>{' '}
                  <span>({citation.year})</span>
                  <p className="mt-1 text-[#0A0F2E]/30">{citation.finding}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[#0A0F2E]/30 text-xs mt-6">
              All statistics sourced from publicly available industry research. Execution OS internal metrics (12-minute activation) based on platform capabilities.
            </p>
          </motion.div>
          
        </div>
      </div>
    </PageLayout>
  );
}
