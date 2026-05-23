import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sword, Shield, Zap, Play, ArrowRight, RotateCcw, Globe, TrendingUp, Cpu, AlertTriangle, Calendar, Mail, Users, Clock, CheckCircle, Volume2, VolumeX } from "lucide-react";
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

interface CinematicHeroProps {
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
      oscGain.gain.value = 0.15 - (i * 0.03);
      
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
        newMuted ? 0 : 0.3,
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

export default function CinematicHero({ onComplete, onSkip }: CinematicHeroProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const { isMuted, toggleMute, cleanup } = useAmbientAudio();
  
  useEffect(() => {
    return () => cleanup();
  }, []);
  
  const scenes = [
    { duration: 4000 },
    { duration: 5000 },
    { duration: 5000 },
    { duration: 4000 },
    { duration: 8000 },
    { duration: 5000 },
    { duration: 4000 },
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
    <div className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden" data-testid="cinematic-hero">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]  via-transparent to-transparent" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0A0F2E]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C9A84C]/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative h-[600px] md:h-[700px] flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <Scene key="scene-0">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4"
                >
                  <span className="text-2xl md:text-3xl text-gray-800 font-light tracking-widest">
                    DISRUPTION
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mb-4"
                >
                  <span className="text-5xl md:text-7xl text-gray-900 font-bold tracking-tight">
                    WON'T WAIT
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <span className="text-2xl md:text-3xl text-gray-800 font-light tracking-widest">
                    FOR YOUR PROCESS.
                  </span>
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 1 && (
            <Scene key="scene-1">
              <div className="text-center max-w-4xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0 }}
                    className="flex flex-col items-center p-4"
                  >
                    <Globe className="h-10 w-10 text-[#2B8A6E] mb-2" />
                    <span className="text-gray-800 text-sm">A market opens.</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex flex-col items-center p-4"
                  >
                    <TrendingUp className="h-10 w-10 text-[#0A0F2E] mb-2" />
                    <span className="text-gray-800 text-sm">A competitor moves.</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="flex flex-col items-center p-4"
                  >
                    <Cpu className="h-10 w-10 text-[#C9A84C] mb-2" />
                    <span className="text-gray-800 text-sm">A transformation begins.</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                    className="flex flex-col items-center p-4"
                  >
                    <AlertTriangle className="h-10 w-10 text-red-400 mb-2" />
                    <span className="text-gray-800 text-sm">A crisis strikes.</span>
                  </motion.div>
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="text-lg text-gray-800 mb-4"
                >
                  In these moments, one thing decides everything.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    HOW FAST CAN YOU EXECUTE?
                  </span>
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
                  <span className="text-lg md:text-xl text-gray-800 uppercase tracking-widest">
                    Most organizations take
                  </span>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mb-6"
                >
                  <span className="text-8xl md:text-[10rem] font-bold text-red-500">
                    72
                  </span>
                  <span className="text-4xl md:text-6xl text-red-400 ml-4">
                    HOURS
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-gray-800 text-lg mb-4"
                >
                  just to align.
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="flex flex-wrap justify-center gap-4 mb-6"
                >
                  <div className="flex items-center gap-2 text-gray-800">
                    <Calendar className="h-5 w-5" />
                    <span>Meetings to schedule</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-800">
                    <Users className="h-5 w-5" />
                    <span>Stakeholders to brief</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-800">
                    <Mail className="h-5 w-5" />
                    <span>Tasks to assign</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  className="text-2xl md:text-3xl font-bold text-red-400"
                >
                  30 DAYS. TOO SLOW.
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 3 && (
            <Scene key="scene-3">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <span className="text-xl md:text-2xl text-gray-800 uppercase tracking-widest">
                    What if you could execute in
                  </span>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="mb-6"
                >
                  <span className="text-8xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2B8A6E] to-[#3BAF8A]">
                    12
                  </span>
                  <span className="text-4xl md:text-6xl text-[#2B8A6E] ml-4">
                    MINUTES?
                  </span>
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 4 && (
            <Scene key="scene-4">
              <div className="text-center max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4"
                >
                  <span className="text-lg text-gray-800">Readiness OS is the</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8"
                >
                  <span className="text-2xl md:text-4xl font-bold text-gray-900">
                    VaughnMartin Readiness OS
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-8"
                >
                  <span className="text-lg text-gray-800">
                    180 Readiness Protocols across growth, risk resilience, and transformation.
                  </span>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 p-6"
                  >
                    <Sword className="h-10 w-10 text-red-400 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-red-400 mb-2">GROWTH & POSITIONING</h3>
                    <p className="text-gray-800 text-sm mb-2">Market Entry • M&A • Product Launch</p>
                    <p className="text-[#2B8A6E] text-sm font-medium">Seize opportunities before competitors react.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="bg-gradient-to-br from-[#0A0F2E]/20 to-[#3BAF8A]/10 border border-[#2B8A6E]/30 p-6"
                  >
                    <Shield className="h-10 w-10 text-[#0A0F2E] mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-[#0A0F2E] mb-2">RISK & RESILIENCE</h3>
                    <p className="text-gray-800 text-sm mb-2">Crisis • Cyber • Regulatory</p>
                    <p className="text-[#2B8A6E] text-sm font-medium">Protect value when threats emerge.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="bg-gradient-to-br from-[#0A0F2E]/20 to-pink-500/10 border border-[#C9A84C]/30 p-6"
                  >
                    <Zap className="h-10 w-10 text-[#C9A84C] mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-[#C9A84C] mb-2">TRANSFORMATION</h3>
                    <p className="text-gray-800 text-sm mb-2">Transformation • AI • Innovation</p>
                    <p className="text-[#2B8A6E] text-sm font-medium">Drive transformation at speed.</p>
                  </motion.div>
                </div>
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
                  className="mb-4 text-gray-800"
                >
                  Stakeholders mapped. Decisions pre-staged. Execution coordinated in real-time.
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-center justify-center gap-4 md:gap-8 mb-8"
                >
                  <div className="text-center">
                    <div className="text-4xl md:text-6xl font-bold text-red-500 line-through opacity-60">30 days</div>
                    <div className="text-sm text-gray-800 mt-1">Before</div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-8 w-8 md:h-12 md:w-12 text-[#2B8A6E]" />
                  </motion.div>
                  <div className="text-center">
                    <div className="text-4xl md:text-6xl font-bold text-[#2B8A6E]">12 min</div>
                    <div className="text-sm text-[#2B8A6E] mt-1">With Readiness OS</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-xl text-gray-800 mb-4"
                >
                  While others are still scheduling meetings...
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  <span className="text-3xl md:text-5xl font-bold text-gray-900">
                    You've already won.
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
                  className="mb-4"
                >
                  <span className="text-xl md:text-2xl text-gray-800">
                    17 independent reports confirm: this is the infrastructure enterprises are missing.
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-8"
                >
                  <span className="text-lg text-[#2B8A6E]/80">
                    By design, not by default.
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                    TRIGGER-TO-EXECUTION
                  </span>
                  <br />
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2B8A6E] to-[#3BAF8A]">
                    ORCHESTRATION
                  </span>
                </motion.div>
              </div>
            </Scene>
          )}

          {currentScene === 7 && (
            <Scene key="scene-7">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="mb-6"
                >
                  <span className="text-7xl md:text-9xl font-bold text-gray-900">Readiness OS</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-4"
                >
                  <span className="text-xl md:text-2xl text-gray-800 tracking-wide">
                    Readiness OS — Coordination Infrastructure for the startup to Fortune 500
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mb-10"
                >
                  <span className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#2B8A6E] to-[#3BAF8A] font-semibold uppercase tracking-wider">
                    TRIGGER TO EXECUTION IN 12 MINUTES.
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="flex gap-4 justify-center flex-wrap"
                >
                  <a href="/try-demo">
                    <Button 
                      size="lg" 
                      className="px-8 py-6 text-lg bg-gradient-to-r from-[#2B8A6E] to-[#3BAF8A] hover:from-[#2B8A6E] hover:to-[#3BAF8A]" 
                      data-testid="button-try-demo"
                      onClick={() => onSkip?.()}
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Try Demo
                    </Button>
                  </a>
                  
                  {onSkip && (
                    <Button 
                      size="lg"
                      variant="outline"
                      className="px-8 py-6 text-lg border-slate-600 hover:bg-slate-800"
                      data-testid="button-continue-to-site"
                      onClick={onSkip}
                    >
                      Continue to Site
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                  
                  {!onSkip && (
                    <Link href="/new-user-journey">
                      <Button 
                        size="lg"
                        variant="outline"
                        className="px-8 py-6 text-lg border-slate-600 hover:bg-slate-800"
                        data-testid="button-get-started-cinematic"
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </motion.div>
              </div>
            </Scene>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 text-gray-800 hover:text-white transition-colors px-3 py-2 hover:bg-slate-800/50"
          data-testid="button-toggle-sound"
          title={isMuted ? "Enable ambient sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          <span className="text-sm hidden sm:inline">{isMuted ? "Sound Off" : "Sound On"}</span>
        </button>
        
        <div className="flex gap-2">
          {Array.from({ length: totalScenes }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentScene(i);
                setIsPlaying(false);
              }}
              className={`w-2 h-2 transition-all ${
                i === currentScene 
                  ? "w-8 bg-white" 
                  : i < currentScene 
                    ? "bg-white/60" 
                    : "bg-white/30"
              }`}
              data-testid={`scene-indicator-${i}`}
            />
          ))}
        </div>
        
        {hasCompleted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={restart}
            className="ml-4 flex items-center gap-2 text-gray-800 hover:text-white transition-colors"
            data-testid="button-replay"
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
          className="absolute bottom-8 right-8 text-gray-800 hover:text-white text-sm transition-colors"
          data-testid="button-skip"
        >
          Skip
        </button>
      )}
    </div>
  );
}
