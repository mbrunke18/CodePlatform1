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
    <div className="relative w-full min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden" data-testid="cinematic-hero">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
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
                  <span className="text-2xl md:text-3xl text-slate-400 font-light tracking-widest">
                    THE WORLD
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mb-4"
                >
                  <span className="text-5xl md:text-7xl text-white font-bold tracking-tight">
                    WON'T WAIT
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <span className="text-2xl md:text-3xl text-slate-400 font-light tracking-widest">
                    FOR YOU.
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
                    <Globe className="h-10 w-10 text-emerald-400 mb-2" />
                    <span className="text-slate-300 text-sm">A market opens.</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex flex-col items-center p-4"
                  >
                    <TrendingUp className="h-10 w-10 text-blue-400 mb-2" />
                    <span className="text-slate-300 text-sm">A competitor moves.</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="flex flex-col items-center p-4"
                  >
                    <Cpu className="h-10 w-10 text-purple-400 mb-2" />
                    <span className="text-slate-300 text-sm">A transformation begins.</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                    className="flex flex-col items-center p-4"
                  >
                    <AlertTriangle className="h-10 w-10 text-red-400 mb-2" />
                    <span className="text-slate-300 text-sm">A crisis strikes.</span>
                  </motion.div>
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="text-lg text-slate-400 mb-4"
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
                  <span className="text-lg md:text-xl text-slate-400 uppercase tracking-widest">
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
                  className="text-slate-400 text-lg mb-4"
                >
                  just to align.
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="flex flex-wrap justify-center gap-4 mb-6"
                >
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="h-5 w-5" />
                    <span>Meetings to schedule</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users className="h-5 w-5" />
                    <span>Stakeholders to brief</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
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
                  72 HOURS. TOO SLOW.
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
                  <span className="text-xl md:text-2xl text-slate-400 uppercase tracking-widest">
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
                  <span className="text-8xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    12
                  </span>
                  <span className="text-4xl md:text-6xl text-emerald-400 ml-4">
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
                  <span className="text-lg text-slate-400">M Platform is the</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8"
                >
                  <span className="text-2xl md:text-4xl font-bold text-white">
                    Strategic Execution Operating System
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-8"
                >
                  <span className="text-lg text-slate-300">
                    166 playbooks across offense, defense, and special teams.
                  </span>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 rounded-xl p-6"
                  >
                    <Sword className="h-10 w-10 text-red-400 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-red-400 mb-2">OFFENSE</h3>
                    <p className="text-slate-300 text-sm mb-2">Market Entry • M&A • Product Launch</p>
                    <p className="text-emerald-400 text-sm font-medium">Seize opportunities before competitors react.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6"
                  >
                    <Shield className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-blue-400 mb-2">DEFENSE</h3>
                    <p className="text-slate-300 text-sm mb-2">Crisis • Cyber • Regulatory</p>
                    <p className="text-emerald-400 text-sm font-medium">Protect value when threats emerge.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6"
                  >
                    <Zap className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-purple-400 mb-2">SPECIAL TEAMS</h3>
                    <p className="text-slate-300 text-sm mb-2">Transformation • AI • Innovation</p>
                    <p className="text-emerald-400 text-sm font-medium">Drive transformation at speed.</p>
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
                  className="mb-4 text-slate-400"
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
                    <div className="text-4xl md:text-6xl font-bold text-red-500 line-through opacity-60">72 hrs</div>
                    <div className="text-sm text-slate-500 mt-1">Before</div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-8 w-8 md:h-12 md:w-12 text-emerald-400" />
                  </motion.div>
                  <div className="text-center">
                    <div className="text-4xl md:text-6xl font-bold text-emerald-400">12 min</div>
                    <div className="text-sm text-emerald-300 mt-1">With M Platform</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-xl text-slate-400 mb-4"
                >
                  While others are still scheduling meetings...
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  <span className="text-3xl md:text-5xl font-bold text-white">
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
                  className="mb-8"
                >
                  <span className="text-xl md:text-2xl text-slate-400">
                    This is the operating system for the age of disruption.
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                    THE STRATEGIC EXECUTION
                  </span>
                  <br />
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    OPERATING SYSTEM
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
                  <span className="text-7xl md:text-9xl font-bold text-white">M</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-4"
                >
                  <span className="text-xl md:text-2xl text-slate-300 tracking-wide">
                    Strategic Execution Operating System
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mb-10"
                >
                  <span className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-semibold uppercase tracking-wider">
                    THE SPEED TO EXECUTE.
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="flex gap-4 justify-center flex-wrap"
                >
                  <Link href="/sandbox">
                    <Button 
                      size="lg" 
                      className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400" 
                      data-testid="button-try-demo"
                      onClick={() => onSkip?.()}
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Try Demo
                    </Button>
                  </Link>
                  
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
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800/50"
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
              className={`w-2 h-2 rounded-full transition-all ${
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
            className="ml-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
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
          className="absolute bottom-8 right-8 text-slate-500 hover:text-white text-sm transition-colors"
          data-testid="button-skip"
        >
          Skip
        </button>
      )}
    </div>
  );
}
