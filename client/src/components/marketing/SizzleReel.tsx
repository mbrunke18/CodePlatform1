import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sword, Shield, Zap, Play, ArrowRight, RotateCcw, Calendar, Mail, Users, Clock, CheckCircle, Target, Brain, GitBranch, Bell, BarChart3 } from "lucide-react";
import { Link } from "wouter";

interface SceneProps {
  children: React.ReactNode;
}

function Scene({ children }: SceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}

export default function SizzleReel() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const scenes = [
    { duration: 5000 },
    { duration: 8000 },
    { duration: 6000 },
    { duration: 8000 },
    { duration: 10000 },
    { duration: 6000 },
    { duration: 5000 },
    { duration: 6000 },
  ];
  const totalScenes = scenes.length;

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => {
      if (currentScene < totalScenes - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setHasCompleted(true);
      }
    }, scenes[currentScene].duration);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  const restart = () => {
    setCurrentScene(0);
    setIsPlaying(true);
    setHasCompleted(false);
  };

  return (
    <div className="relative w-full min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden" data-testid="sizzle-reel">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative h-[600px] md:h-[700px] flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <Scene key="scene-0">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <span className="text-lg md:text-xl text-slate-400 uppercase tracking-widest">
                    The Moment Arrives
                  </span>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-xl md:text-2xl text-slate-300 mb-8"
                >
                  A competitor is acquiring your target. A new market is opening.
                  <br />A transformation must begin. A threat has emerged.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-xl text-slate-400 mb-4"
                >
                  The question isn't whether you have the right strategy.
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                >
                  <span className="text-2xl md:text-4xl font-bold text-white">
                    THE QUESTION IS:
                  </span>
                  <br />
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    HOW FAST CAN YOU EXECUTE IT?
                  </span>
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 1 && (
            <Scene key="scene-1">
              <div className="text-center max-w-5xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <span className="text-lg text-slate-400 uppercase tracking-widest">
                    Anatomy of 72 Hours
                  </span>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                  >
                    <div className="text-3xl font-bold text-red-400 mb-2">Day 1</div>
                    <Calendar className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      Recognizing the opportunity. Debating priorities. Getting leadership aligned.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                  >
                    <div className="text-3xl font-bold text-red-400 mb-2">Day 2</div>
                    <Users className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      Assembling stakeholders. Briefing teams. Assigning workstreams.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                  >
                    <div className="text-3xl font-bold text-red-400 mb-2">Day 3</div>
                    <GitBranch className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      Clarifying ownership. Discovering dependencies. Reworking the plan.
                    </p>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-lg text-slate-400 mb-4"
                >
                  Seventy-two hours later... you're ready to start.
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="text-2xl font-bold text-red-400"
                >
                  Meanwhile, the window didn't wait.
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 2 && (
            <Scene key="scene-2">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <span className="text-xl text-slate-400">But there's another way.</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mb-8"
                >
                  <p className="text-lg text-slate-300 mb-4">
                    An NFL coach makes eighty decisions in a three-hour game. Forty seconds between plays.
                  </p>
                  <p className="text-lg text-slate-300">
                    Offense. Defense. Special teams. Everyone knows their assignment before the call comes.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="text-xl text-slate-400 mb-4"
                >
                  How?
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    PREPARATION ENABLES SPEED.
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="text-lg text-slate-400 mt-6"
                >
                  They don't create plays during the game. They call plays they built all week.
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 3 && (
            <Scene key="scene-3">
              <div className="text-center max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4"
                >
                  <span className="text-lg text-slate-400">M Platform brings that methodology to the enterprise.</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-8"
                >
                  <span className="text-xl md:text-2xl text-slate-300">
                    166 pre-built playbooks across three strategic categories.
                  </span>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 rounded-xl p-6"
                  >
                    <Sword className="h-10 w-10 text-red-400 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-red-400 mb-3">OFFENSE</h3>
                    <p className="text-slate-300 text-sm">
                      Market entry. M&A integration. Product launch. Competitive moves.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6"
                  >
                    <Shield className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-blue-400 mb-3">DEFENSE</h3>
                    <p className="text-slate-300 text-sm">
                      Crisis response. Cyber incidents. Regulatory compliance. Reputation protection.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6"
                  >
                    <Zap className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-purple-400 mb-3">SPECIAL TEAMS</h3>
                    <p className="text-slate-300 text-sm">
                      Digital transformation. AI governance. Innovation initiatives. Game-changing moves.
                    </p>
                  </motion.div>
                </div>
              </div>
            </Scene>
          )}

          {currentScene === 4 && (
            <Scene key="scene-4">
              <div className="text-center max-w-5xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <span className="text-lg text-slate-400 uppercase tracking-widest">
                    How It Works
                  </span>
                </motion.div>
                
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                  >
                    <Users className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-white font-semibold text-sm mb-1">Stakeholders Mapped</p>
                    <p className="text-slate-400 text-xs">Every role defined before situations occur</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                  >
                    <Brain className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-white font-semibold text-sm mb-1">Decisions Pre-staged</p>
                    <p className="text-slate-400 text-xs">Options analyzed. Criteria defined.</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                  >
                    <Bell className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-white font-semibold text-sm mb-1">Instant Activation</p>
                    <p className="text-slate-400 text-xs">Stakeholders notified instantly</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                  >
                    <BarChart3 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-white font-semibold text-sm mb-1">Parallel Execution</p>
                    <p className="text-slate-400 text-xs">Progress tracked in real-time</p>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  className="flex items-center justify-center gap-8 mb-6"
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-400">47</div>
                    <div className="text-sm text-slate-400">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-400">12</div>
                    <div className="text-sm text-slate-400">Stakeholders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-400">12</div>
                    <div className="text-sm text-slate-400">Minutes</div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 2.2 }}
                  className="flex items-center justify-center gap-4"
                >
                  <span className="text-4xl font-bold text-red-500 line-through opacity-60">72 hrs</span>
                  <ArrowRight className="h-8 w-8 text-emerald-400" />
                  <span className="text-4xl font-bold text-emerald-400">12 min</span>
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 5 && (
            <Scene key="scene-5">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <span className="text-lg text-slate-400">Every organization has systems for what matters.</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex justify-center gap-6 mb-8"
                >
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-slate-500">CRM</div>
                    <div className="text-xs text-slate-600">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-slate-500">ERP</div>
                    <div className="text-xs text-slate-600">Resources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-slate-500">PM</div>
                    <div className="text-xs text-slate-600">Projects</div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-lg text-slate-400 mb-6"
                >
                  But nothing for the moments that define success or failure.
                  <br />Strategic execution at speed.
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  className="text-xl text-emerald-400 font-semibold mb-4"
                >
                  Until now.
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                >
                  <span className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                    THE STRATEGIC EXECUTION
                  </span>
                  <br />
                  <span className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    OPERATING SYSTEM
                  </span>
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 6 && (
            <Scene key="scene-6">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <span className="text-lg text-slate-400">
                    AI is accelerating everything. Opportunities emerge and close in days.
                    <br />Competitive windows shrink.
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mb-8"
                >
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    The organizations that execute at speed
                    <br />will define the next decade.
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    Will you be ready?
                  </span>
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 7 && (
            <Scene key="scene-7">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <span className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    PREPARED TO EXECUTE.
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                  className="mb-6"
                >
                  <span className="text-7xl md:text-9xl font-bold text-white">M</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mb-10"
                >
                  <span className="text-xl md:text-2xl text-slate-300 tracking-wide">
                    Strategic Execution Operating System
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="flex gap-4 justify-center flex-wrap"
                >
                  <Link href="/sandbox">
                    <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400" data-testid="button-see-it-action">
                      <Play className="mr-2 h-5 w-5" />
                      See It In Action
                    </Button>
                  </Link>
                  
                  <Link href="/how-it-works">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="px-8 py-6 text-lg border-slate-600 hover:bg-slate-800"
                      data-testid="button-learn-more-sizzle"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </Scene>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
        <div className="flex gap-2">
          {Array.from({ length: totalScenes }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentScene(i);
                setIsPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentScene 
                  ? "w-8 bg-white" 
                  : i < currentScene 
                    ? "bg-white/60" 
                    : "bg-white/30"
              }`}
              data-testid={`sizzle-scene-indicator-${i}`}
            />
          ))}
        </div>
        
        {hasCompleted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={restart}
            className="ml-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            data-testid="button-replay-sizzle"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">Replay</span>
          </motion.button>
        )}
      </div>

      {isPlaying && currentScene < totalScenes - 1 && (
        <button
          onClick={() => {
            setIsPlaying(false);
            setCurrentScene(totalScenes - 1);
            setHasCompleted(true);
          }}
          className="absolute bottom-8 right-8 text-slate-500 hover:text-white text-sm transition-colors"
          data-testid="button-skip-sizzle"
        >
          Skip
        </button>
      )}
      
      <div className="absolute top-4 left-4 text-slate-500 text-sm">
        2-Minute Sizzle Reel
      </div>
    </div>
  );
}
