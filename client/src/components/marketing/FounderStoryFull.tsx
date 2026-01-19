import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Play, RotateCcw, Volume2, VolumeX, SkipForward, Pause, 
  Building2, Trophy, Clock, Target, Zap, Shield, Sword,
  TrendingUp, AlertTriangle, CheckCircle, Users, BookOpen,
  Radar, BarChart3, ArrowRight, Brain
} from "lucide-react";
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

interface FounderStoryFullProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

function useAmbientAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const initAudio = () => {
    if (audioContextRef.current) return;
    
    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    const frequencies = [55, 82.5, 110, 165];
    const oscillators: OscillatorNode[] = [];
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.12 - (i * 0.02);
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      oscillators.push(osc);
    });
    
    oscillatorsRef.current = oscillators;
    setIsInitialized(true);
  };

  const toggleMute = () => {
    if (!isInitialized) {
      initAudio();
    }
    
    if (gainNodeRef.current && audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      
      gainNodeRef.current.gain.setTargetAtTime(
        newMuted ? 0 : 0.25,
        audioContextRef.current.currentTime,
        0.5
      );
    }
  };

  const cleanup = () => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  return { isMuted, toggleMute, cleanup, isInitialized };
}

export default function FounderStoryFull({ onComplete, onSkip }: FounderStoryFullProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const { isMuted, toggleMute, cleanup } = useAmbientAudio();
  
  useEffect(() => {
    return () => cleanup();
  }, []);
  
  const scenes = [
    { duration: 8000 },   // 0: Cold open
    { duration: 10000 },  // 1: McKinsey stat
    { duration: 12000 },  // 2: 72 hours problem
    { duration: 10000 },  // 3: Cost of delay
    { duration: 9000 },   // 4: The reason - improvising
    { duration: 12000 },  // 5: Your story - Fortune 500
    { duration: 11000 },  // 6: Companies worked at
    { duration: 11000 },  // 7: Football coaching
    { duration: 9000 },   // 8: Business winging it
    { duration: 9000 },   // 9: So I built ExecuteIQ
    { duration: 12000 },  // 10: 166 playbooks / 9 domains
    { duration: 11000 },  // 11: IDEA framework
    { duration: 9000 },   // 12: One click activation
    { duration: 9000 },   // 13: 12 minutes / 340x
    { duration: 11000 },  // 14: Stakes - crisis frequency
    { duration: 11000 },  // 15: Not just defense
    { duration: 9000 },   // 16: Execution = competitive advantage
    { duration: 10000 },  // 17: New category
    { duration: 10000 },  // 18: 18-month head start
    { duration: 12000 },  // 19: Final CTA
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
        onComplete?.();
      }
    }, scenes[currentScene].duration);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  const restart = () => {
    setCurrentScene(0);
    setIsPlaying(true);
    setHasCompleted(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const progress = ((currentScene + 1) / totalScenes) * 100;

  return (
    <div className="relative w-full min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative h-[600px] md:h-[700px] flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {/* Scene 0: Cold Open */}
          {currentScene === 0 && (
            <Scene key="scene-0">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-xl md:text-2xl text-slate-400 mb-6"
                >
                  Let me tell you something every executive knows—
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-xl md:text-2xl text-slate-400 mb-8"
                >
                  but nobody wants to admit.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 2 }}
                  className="text-3xl md:text-5xl font-bold text-white"
                >
                  Your strategy isn't the problem.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2.8 }}
                  className="text-3xl md:text-5xl font-bold text-red-400 mt-4"
                >
                  Your execution is.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 1: McKinsey stat */}
          {currentScene === 1 && (
            <Scene key="scene-1">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <span className="text-sm uppercase tracking-widest text-slate-500">McKinsey Research</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-6"
                >
                  <span className="text-7xl md:text-9xl font-bold text-amber-400">95%</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-xl md:text-2xl text-slate-300"
                >
                  of strategy execution happens <span className="text-white font-semibold">outside</span> the strategy room.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="text-lg text-slate-400 mt-4"
                >
                  That's where the real work is. That's where companies bleed money.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 2: 72 Hours */}
          {currentScene === 2 && (
            <Scene key="scene-2">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg text-slate-400 mb-4"
                >
                  The industry average for coordinating a crisis response:
                </motion.p>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mb-6"
                >
                  <span className="text-8xl md:text-[10rem] font-bold text-red-500">72</span>
                  <span className="text-4xl md:text-6xl text-red-400 ml-4">HOURS</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <span className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">Conference calls</span>
                  <span className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">Scrambling</span>
                  <span className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">Waiting on decisions</span>
                </motion.div>
              </div>
            </Scene>
          )}

          {/* Scene 3: Cost of delay */}
          {currentScene === 3 && (
            <Scene key="scene-3">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-3 mb-6"
                >
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                  <span className="text-lg text-slate-400">Every hour of delay costs</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mb-8"
                >
                  <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                    $5-50 MILLION
                  </span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-xl text-slate-300"
                >
                  Market opportunities vanish. Competitors move.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 4: The reason */}
          {currentScene === 4 && (
            <Scene key="scene-4">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-xl md:text-2xl text-slate-300 mb-8"
                >
                  It's not because people aren't smart.
                  <br />It's not because they don't care.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-3xl md:text-5xl font-bold text-white mb-6"
                >
                  It's because they're improvising.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="flex flex-wrap justify-center gap-4 text-red-300"
                >
                  <span className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">No playbooks</span>
                  <span className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">No pre-staged coordination</span>
                  <span className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">Reinventing under pressure</span>
                </motion.div>
              </div>
            </Scene>
          )}

          {/* Scene 5: Your story intro */}
          {currentScene === 5 && (
            <Scene key="scene-5">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-xl md:text-2xl text-slate-300 mb-8"
                >
                  I've been in those rooms.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mb-8"
                >
                  <span className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                    20 YEARS
                  </span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  className="text-xl text-slate-400"
                >
                  across Fortune 500 companies watching this happen.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 6: Companies */}
          {currentScene === 6 && (
            <Scene key="scene-6">
              <div className="text-center max-w-5xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
                >
                  {[
                    { name: "Boyd Gaming", industry: "Gaming" },
                    { name: "Ford & Toyota", industry: "Automotive" },
                    { name: "Vantiv", industry: "Financial Services" },
                    { name: "Lockheed Martin", industry: "Aerospace" },
                    { name: "Eli Lilly", industry: "Pharma" },
                    { name: "Energy Sector", industry: "Energy" },
                  ].map((company, i) => (
                    <motion.div
                      key={company.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
                      className="flex flex-col items-center p-4 bg-slate-800/50 border border-slate-700 rounded-xl"
                    >
                      <Building2 className="h-8 w-8 text-amber-400 mb-2" />
                      <span className="text-lg font-medium text-white">{company.name}</span>
                      <span className="text-sm text-slate-400">{company.industry}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-lg text-amber-300 italic"
                >
                  "I've watched $50 million disappear because we couldn't coordinate fast enough."
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 7: Football coaching */}
          {currentScene === 7 && (
            <Scene key="scene-7">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <Trophy className="h-20 w-20 text-amber-400 mx-auto" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-xl md:text-2xl text-slate-300 mb-4"
                >
                  I coached major college football for 5 years.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-xl md:text-2xl text-white"
                >
                  We'd never run a play without practicing it.
                  <br />Never send a team out without knowing who blocks, who catches, who makes the read.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 8: Business winging it */}
          {currentScene === 8 && (
            <Scene key="scene-8">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl md:text-4xl font-bold text-white mb-6"
                >
                  But in business?
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-xl md:text-2xl text-slate-300 mb-6"
                >
                  We call it "strategic planning"—
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                  className="text-4xl md:text-6xl font-bold text-red-400"
                >
                  Then we wing the execution.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 9: So I built */}
          {currentScene === 9 && (
            <Scene key="scene-9">
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-slate-400 mb-4"
                >
                  I got tired of watching it happen. So I built
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5, type: "spring" }}
                >
                  <span className="text-7xl md:text-9xl font-bold text-white">ExecuteIQ</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-xl text-emerald-400 mt-6"
                >
                  The Strategic Execution Operating System
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 10: 166 playbooks */}
          {currentScene === 10 && (
            <Scene key="scene-10">
              <div className="text-center max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mb-8"
                >
                  <span className="text-6xl md:text-8xl font-bold text-emerald-400">166</span>
                  <span className="text-2xl md:text-4xl text-slate-300 ml-4">PLAYBOOKS</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-lg text-slate-400 mb-6"
                >
                  across 9 strategic domains
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="flex flex-wrap justify-center gap-3"
                >
                  {["Crisis", "Market Entry", "M&A", "Product Launch", "Digital Transformation", "AI Governance", "Regulatory", "Cyber", "Competitive"].map((domain, i) => (
                    <motion.span
                      key={domain}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 1.5 + i * 0.08 }}
                      className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm"
                    >
                      {domain}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </Scene>
          )}

          {/* Scene 11: IDEA framework */}
          {currentScene === 11 && (
            <Scene key="scene-11">
              <div className="text-center max-w-5xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg text-slate-400 mb-8"
                >
                  Powered by the IDEA Framework
                </motion.p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { letter: "I", name: "Identify", icon: BookOpen, color: "text-violet-400", bg: "bg-violet-500/20", border: "border-violet-500/30" },
                    { letter: "D", name: "Detect", icon: Radar, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
                    { letter: "E", name: "Execute", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
                    { letter: "A", name: "Advance", icon: BarChart3, color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
                  ].map((phase, i) => (
                    <motion.div
                      key={phase.letter}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                      className={`${phase.bg} ${phase.border} border rounded-xl p-4`}
                    >
                      <phase.icon className={`h-8 w-8 ${phase.color} mx-auto mb-2`} />
                      <span className={`text-3xl font-bold ${phase.color}`}>{phase.letter}</span>
                      <p className="text-slate-300 text-sm mt-1">{phase.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Scene>
          )}

          {/* Scene 12: One click */}
          {currentScene === 12 && (
            <Scene key="scene-12">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="mb-8"
                >
                  <span className="text-5xl md:text-7xl font-bold text-white">ONE CLICK</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex flex-wrap justify-center gap-4 mb-6"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300">
                    <CheckCircle className="h-5 w-5" />
                    <span>Roles assigned instantly</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300">
                    <Users className="h-5 w-5" />
                    <span>Teams in parallel</span>
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-xl text-slate-300"
                >
                  Real-time visibility. Everyone knows exactly what they own.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 13: 12 minutes / 340x */}
          {currentScene === 13 && (
            <Scene key="scene-13">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-3 mb-6"
                >
                  <Clock className="h-8 w-8 text-emerald-400" />
                  <span className="text-xl text-slate-400">From signal to full coordinated execution</span>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                  className="mb-6"
                >
                  <span className="text-8xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">12</span>
                  <span className="text-4xl md:text-6xl text-emerald-400 ml-4">MINUTES</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-2xl font-bold text-amber-400"
                >
                  That's 340x faster.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 14: Crisis frequency */}
          {currentScene === 14 && (
            <Scene key="scene-14">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl md:text-2xl text-slate-300 mb-8"
                >
                  Think about what's happening now.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-2xl md:text-4xl font-bold text-white mb-6"
                >
                  Crisis frequency is exploding.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  {["Cyber attacks", "Supply chain", "Regulatory pressure", "Reputational risks"].map((item, i) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 1.8 + i * 0.1 }}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300"
                    >
                      {item}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </Scene>
          )}

          {/* Scene 15: Not just defense */}
          {currentScene === 15 && (
            <Scene key="scene-15">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-slate-400 mb-6"
                >
                  But here's what people miss—
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-3xl md:text-5xl font-bold text-white mb-8"
                >
                  This isn't just defense.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  className="grid md:grid-cols-3 gap-6"
                >
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                    <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-slate-300">Launch in 4 months vs 18</p>
                    <p className="text-emerald-400 text-sm mt-1">Capture the revenue</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-slate-300">Integrate in 6 months vs 24</p>
                    <p className="text-blue-400 text-sm mt-1">Capture synergies</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <Zap className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-slate-300">Move in days vs weeks</p>
                    <p className="text-amber-400 text-sm mt-1">Win the market</p>
                  </div>
                </motion.div>
              </div>
            </Scene>
          )}

          {/* Scene 16: Execution = advantage */}
          {currentScene === 16 && (
            <Scene key="scene-16">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-slate-400 mb-6"
                >
                  Execution speed isn't risk mitigation.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <span className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
                    It's competitive advantage.
                  </span>
                </motion.div>
              </div>
            </Scene>
          )}

          {/* Scene 17: New category */}
          {currentScene === 17 && (
            <Scene key="scene-17">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-slate-400 mb-6"
                >
                  We're not building another dashboard.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-xl text-slate-400 mb-8"
                >
                  We're creating a new category.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  <span className="text-3xl md:text-5xl font-bold text-white">THE STRATEGIC EXECUTION</span>
                  <br />
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    OPERATING SYSTEM
                  </span>
                </motion.div>
              </div>
            </Scene>
          )}

          {/* Scene 18: 18-month head start */}
          {currentScene === 18 && (
            <Scene key="scene-18">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-slate-400 mb-6"
                >
                  Companies that adopt this first get
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mb-8"
                >
                  <span className="text-6xl md:text-8xl font-bold text-amber-400">18</span>
                  <span className="text-2xl md:text-4xl text-slate-300 ml-4">MONTH HEAD START</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-lg text-slate-400"
                >
                  166 playbooks, AI signal detection, the IDEA methodology—
                  <br />that can't be copied overnight.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 19: Final CTA */}
          {currentScene === 19 && (
            <Scene key="scene-19">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg text-slate-400 mb-6"
                >
                  20 years inside Fortune 500 execution. I've lived the failures. Felt the frustration.
                  <br />Built the solution I wish I'd had.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mb-8"
                >
                  <p className="text-xl md:text-2xl text-slate-300 mb-2">Strategy is 10%. Execution is 90%.</p>
                  <p className="text-3xl md:text-4xl font-bold text-emerald-400">
                    ExecuteIQ is built for the 90%.
                  </p>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  className="text-2xl text-white mb-10"
                >
                  Welcome. Let's get to work.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2.5 }}
                  className="flex gap-4 justify-center flex-wrap"
                >
                  <Link href="/sandbox">
                    <Button 
                      size="lg" 
                      className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400"
                      onClick={() => onSkip?.()}
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Try Demo
                    </Button>
                  </Link>
                  <Link href="/playbook-library">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="px-8 py-6 text-lg border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Browse Playbooks
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </Scene>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress bar */}
          <div className="h-1 bg-slate-800 rounded-full mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="text-slate-400 hover:text-white"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={restart}
                className="text-slate-400 hover:text-white"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-slate-400 hover:text-white"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>

            <div className="text-slate-500 text-sm">
              {currentScene + 1} / {totalScenes}
            </div>

            {onSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-slate-400 hover:text-white gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
