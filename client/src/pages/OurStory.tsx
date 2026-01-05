import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import StandardNav from '@/components/layout/StandardNav';
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Building2, 
  TrendingDown, 
  Lightbulb, 
  Rocket,
  ArrowRight,
  Play,
  Quote
} from "lucide-react";
import { useLocation } from "wouter";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PullQuote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <div className="relative my-16 py-8">
      <Quote className="absolute -top-2 left-0 h-12 w-12 text-blue-200 dark:text-blue-800" />
      <blockquote className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-200 italic pl-8 md:pl-12 leading-relaxed">
        {children}
      </blockquote>
      {author && (
        <p className="mt-4 pl-8 md:pl-12 text-slate-500 dark:text-slate-400 font-medium">— {author}</p>
      )}
    </div>
  );
}

function TimelineChapter({ 
  number, 
  title, 
  color,
  children 
}: { 
  number: string; 
  title: string; 
  color: string;
  children: React.ReactNode;
}) {
  const colorClasses: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    amber: { bg: "bg-amber-500", border: "border-amber-500", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
    green: { bg: "bg-green-500", border: "border-green-500", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
    red: { bg: "bg-red-500", border: "border-red-500", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
    orange: { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500" },
    blue: { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
    purple: { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500" },
  };

  const c = colorClasses[color] || colorClasses.blue;

  return (
    <AnimatedSection className="mb-20">
      <div className="relative pl-8 md:pl-16 pb-8 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
        {/* Timeline dot */}
        <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full ${c.dot} ring-4 ring-white dark:ring-slate-900`} />
        
        {/* Chapter header */}
        <div className="mb-6">
          <span className={`text-sm font-bold uppercase tracking-widest ${c.text}`}>
            {number}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1">
            {title}
          </h2>
        </div>
        
        {/* Chapter content */}
        <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {children}
        </div>
      </div>
    </AnimatedSection>
  );
}

function MetricCard({ value, label, color = "blue" }: { value: string; label: string; color?: string }) {
  const colorClasses: Record<string, string> = {
    green: "from-green-500 to-emerald-600",
    red: "from-red-500 to-rose-600",
    orange: "from-orange-500 to-amber-600",
    blue: "from-blue-500 to-indigo-600",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white text-center`}>
      <div className="text-4xl md:text-5xl font-bold">{value}</div>
      <div className="text-sm md:text-base opacity-90 mt-1">{label}</div>
    </div>
  );
}

export default function OurStory() {
  const [, setLocation] = useLocation();
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 600;
      setShowStickyCta(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="page-background min-h-screen overflow-x-hidden">
      <StandardNav />
      
      {/* Hero Section - Clean and Impactful */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
        
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-blue-400 font-medium tracking-wide mb-4">THE ORIGIN STORY</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              40-Second Decisions.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Years of Preparation.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              How one coach's championship methodology became the execution engine for Fortune 1000 companies.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto relative">
          {/* Timeline line - removed absolute positioning that was causing scroll issues */}

          {/* Prologue */}
          <TimelineChapter number="Prologue" title="The Moment Everything Changed" color="amber">
            <p className="font-semibold text-slate-800 dark:text-white text-xl">
              Saturday afternoon. Eugene, Oregon. 2001.
            </p>
            <p>
              Down by 14 points. Ten minutes remaining. 80,000 fans watching. 
              National television cameras rolling.
            </p>
            <p>
              I'm in the coaches' box when my head coach says two words over the headset:
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-6 rounded-r-xl my-8">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 italic">
                "Momentum change."
              </p>
            </div>

            <p className="font-semibold text-slate-800 dark:text-white">
              In the next 40 seconds, we made a critical decision and executed:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• We had practiced this exact scenario dozens of times</li>
              <li>• The trigger fired—everyone knew their play</li>
              <li>• 11 players received the signal and adjusted instantly</li>
              <li>• No huddle. No meeting. No debate. Just execution.</li>
            </ul>

            <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-6 rounded-r-xl my-8">
              <p className="font-semibold text-green-800 dark:text-green-200">
                Blocked punt. Immediate score. Onside kick recovery. Another touchdown. 
                Defensive interception. <span className="font-bold">Game won.</span>
              </p>
            </div>
          </TimelineChapter>

          <PullQuote>
            This wasn't luck. This was preparation meeting opportunity—practiced plays ready to execute the instant the trigger fired.
          </PullQuote>

          {/* The Contrast */}
          <TimelineChapter number="Chapter 1" title="The Monday Morning Paradox" color="red">
            <p className="font-semibold text-slate-800 dark:text-white text-xl">
              Same week. Fortune 500 boardroom. Same type of crisis.
            </p>
            
            <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-6 rounded-r-xl my-8">
              <p className="text-lg mb-2">"Our competitor just launched a similar product."</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300 italic">
                "Let me schedule a meeting to discuss our response."
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                That meeting was scheduled three days later.
              </p>
            </div>

            {/* The Comparison */}
            <div className="grid md:grid-cols-2 gap-6 my-12">
              <MetricCard value="40 sec" label="Saturday Crisis Response" color="green" />
              <MetricCard value="72 hrs" label="Monday Crisis Response" color="red" />
            </div>

            <p className="text-xl font-medium text-slate-800 dark:text-white">
              Same competitive threat. Same need for coordinated action. 
              <span className="text-orange-600 dark:text-orange-400"> Vastly different outcomes.</span>
            </p>
          </TimelineChapter>

          <PullQuote>
            Why do Fortune 1000 enterprises take 72 hours for decisions that championship teams make in 40 seconds?
          </PullQuote>

          {/* The Problem */}
          <TimelineChapter number="Chapter 2" title="The 10,000x Speed Gap" color="orange">
            <p>
              We spent years studying this gap. The data was staggering:
            </p>

            <div className="grid grid-cols-3 gap-4 my-8">
              <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <div className="text-3xl font-bold text-orange-600">$144M</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Annual Value Gap</div>
              </div>
              <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <div className="text-3xl font-bold text-orange-600">87%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Transformations Fail</div>
              </div>
              <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <div className="text-3xl font-bold text-orange-600">10,000x</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Speed Difference</div>
              </div>
            </div>

            <p>
              While competitors moved at game speed, enterprises were stuck in quarterly planning cycles, 
              endless alignment meetings, and reactive crisis management.
            </p>
          </TimelineChapter>

          {/* The Solution */}
          <TimelineChapter number="Chapter 3" title="Reverse-Engineering the Playbook" color="blue">
            <p>
              We studied what makes NFL coaches so effective. Four principles emerged:
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              {[
                { icon: Trophy, title: "Pre-Game Preparation", desc: "Every scenario pre-planned. No improvisation under pressure." },
                { icon: Building2, title: "24/7 Monitoring", desc: "Film study. Pattern recognition. Triggers identified before game day." },
                { icon: TrendingDown, title: "One-Click Execution", desc: "Everyone knows their role. Execute immediately on signal." },
                { icon: Lightbulb, title: "Institutional Memory", desc: "Learn from every play. Refine playbooks. Get better every season." },
              ].map((item, i) => (
                <div key={i} className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5">
                  <item.icon className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <p>
              These weren't just coaching techniques. They were the foundation of a 
              new operating model for strategic execution.
            </p>
          </TimelineChapter>

          {/* The Vision */}
          <TimelineChapter number="Chapter 4" title="M Was Born" color="purple">
            <p>
              We translated 15 years of research into a platform that gives every 
              Fortune 1000 executive the same strategic advantage as an NFL coach:
            </p>

            <ul className="space-y-3 my-8">
              <li className="flex items-start gap-3">
                <Rocket className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <span><strong>166 battle-tested playbooks</strong> across 9 strategic domains</span>
              </li>
              <li className="flex items-start gap-3">
                <Rocket className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <span><strong>AI-powered monitoring</strong> across 92 intelligence signals</span>
              </li>
              <li className="flex items-start gap-3">
                <Rocket className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <span><strong>12-minute coordinated response</strong> when triggers fire</span>
              </li>
              <li className="flex items-start gap-3">
                <Rocket className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <span><strong>Institutional memory</strong> that makes every response smarter</span>
              </li>
            </ul>
          </TimelineChapter>

          {/* Enterprise Validation */}
          <TimelineChapter number="Chapter 5" title="Built on Proven Methodology" color="green">
            <p>
              M isn't theoretical. It's built on <strong>Dynamic Strategy</strong>—the methodology 
              trusted by the world's most demanding organizations:
            </p>

            {/* Enterprise Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-10">
              {[
                { name: "Microsoft", desc: "Azure strategic ops" },
                { name: "Amazon", desc: "AWS incident response" },
                { name: "DBS Bank", desc: "Digital transformation" },
                { name: "Salesforce", desc: "Enterprise adoption" },
              ].map((company, i) => (
                <div key={i} className="text-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{company.name}</div>
                  <div className="text-xs text-slate-500">{company.desc}</div>
                </div>
              ))}
            </div>

            <p className="font-medium text-slate-800 dark:text-white">
              Dynamic Strategy's 10 principles operationalized into software:
            </p>

            <div className="grid md:grid-cols-2 gap-3 my-6">
              {[
                "Sense, Adapt, Learn: AI monitors 12 intelligence signals 24/7",
                "Pre-Committed Resources: Budgets pre-approved for rapid deployment",
                "Distributed Decision Rights: Right people empowered to act instantly",
                "Scenario-Based Planning: 166 playbooks covering strategic landscape",
                "Continuous Calibration: Learning loops refine every response",
                "Modular Execution: Plug-and-play components for any situation"
              ].map((principle, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{principle}</span>
                </div>
              ))}
            </div>

            {/* Research Validation */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border border-green-200 dark:border-green-800 my-8">
              <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Research Foundation</div>
              <p className="text-slate-700 dark:text-slate-300">
                Validated through McKinsey research on strategic agility, MIT Sloan studies on 
                organizational decision-making, and 15+ years of real-world implementation 
                across Fortune 500 companies.
              </p>
            </div>
          </TimelineChapter>

          <PullQuote author="The M Philosophy">
            Championship teams don't improvise under pressure. They execute prepared playbooks at competitive speed.
          </PullQuote>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Success Favors the Prepared.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mt-2">
                Are You?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-10">
              Replace reactive scrambles with coordinated precision. See how M transforms 
              strategic response from 72 hours to 12 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => setLocation("/demo/live-activation")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg w-full sm:w-auto"
                data-testid="button-watch-demo"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Live Demo
              </Button>
              <Button 
                onClick={() => setLocation("/how-it-works")}
                variant="outline"
                className="border-slate-500 text-white hover:bg-slate-800 px-8 py-6 text-lg w-full sm:w-auto"
                data-testid="button-how-it-works"
              >
                See How It Works
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-lg">Strategic Execution OS</span>
          </div>
          <p className="text-slate-400">
            From the sidelines to the boardroom.
          </p>
        </div>
      </footer>

      {/* Sticky CTA - appears after scrolling */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={showStickyCta ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          onClick={() => setLocation("/contact")}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/25 px-6 py-3 rounded-full"
          data-testid="button-sticky-cta"
        >
          Request Demo
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
