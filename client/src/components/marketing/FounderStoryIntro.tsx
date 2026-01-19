import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Volume2, VolumeX, SkipForward, Pause, Building2, Trophy, Briefcase, Clock, Loader2 } from "lucide-react";
import { Link } from "wouter";

const SCENE_NARRATIONS = [
  "Seventy-two hours. That's how long it takes.",
  "That's how long it takes most Fortune 500 companies to respond to a crisis. Conference calls. Scrambling. Waiting on decisions. Meanwhile, the damage compounds. The window closes.",
  "I spent 20 years inside Fortune 500 companies watching this happen. Boyd Gaming, Ford, Lockheed Martin, Vantiv, Eli Lilly. I've watched 50 million dollars evaporate because we couldn't coordinate fast enough.",
  "I kept thinking—in football, we'd never run a play without practicing it first. But in business? We wing it. Every time.",
  "That's why I built ExecuteIQ. 166 playbooks across every scenario you'll face. Crisis Response, Market Entry, M&A Integration, Product Launches.",
  "From signal to coordinated execution. 12 minutes. One click to activate. Roles assigned. Teams moving in parallel.",
  "This isn't about working harder. It's about executing with discipline—the kind that wins championships.",
  "The companies that figure this out first don't just survive. They dominate. Welcome to ExecuteIQ.",
];

function useTTSNarration() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const isMutedRef = useRef(true);

  const fetchAudio = useCallback(async (sceneIndex: number): Promise<string | null> => {
    if (audioCache.current.has(sceneIndex)) {
      return audioCache.current.get(sceneIndex) || null;
    }

    const text = SCENE_NARRATIONS[sceneIndex];
    if (!text) return null;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'onyx', format: 'mp3' }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const audioUrl = `data:audio/mp3;base64,${data.audio}`;
      audioCache.current.set(sceneIndex, audioUrl);
      return audioUrl;
    } catch (error) {
      console.error('TTS fetch error:', error);
      return null;
    }
  }, []);

  const prefetchNext = useCallback(async (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < SCENE_NARRATIONS.length && !audioCache.current.has(nextIndex)) {
      await fetchAudio(nextIndex);
    }
  }, [fetchAudio]);

  const playScene = useCallback(async (sceneIndex: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (isMutedRef.current) return;

    setIsLoading(true);
    const audioUrl = await fetchAudio(sceneIndex);
    setIsLoading(false);

    if (audioUrl && !isMutedRef.current) {
      const audio = new Audio(audioUrl);
      audio.volume = 0.8;
      audioRef.current = audio;
      audio.play().catch(() => {});
      prefetchNext(sceneIndex);
    }
  }, [fetchAudio, prefetchNext]);

  const setMuted = useCallback((muted: boolean) => {
    isMutedRef.current = muted;
    if (audioRef.current) {
      if (muted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return { playScene, setMuted, stop, isLoading };
}

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

interface FounderStoryIntroProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

function useAmbientAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
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

  const setMuted = (muted: boolean) => {
    if (!isInitialized) {
      initAudio();
    }
    
    if (gainNodeRef.current && audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      gainNodeRef.current.gain.setTargetAtTime(
        muted ? 0 : 0.25,
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

  return { setMuted, cleanup, isInitialized };
}

export default function FounderStoryIntro({ onComplete, onSkip }: FounderStoryIntroProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { setMuted: setAmbientMuted, cleanup } = useAmbientAudio();
  const { playScene, stop: stopTTS, isLoading: ttsLoading, setMuted: setTTSMuted } = useTTSNarration();
  
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setAmbientMuted(newMuted);
    setTTSMuted(newMuted);
  };
  
  useEffect(() => {
    return () => {
      cleanup();
      stopTTS();
    };
  }, []);
  
  useEffect(() => {
    if (isPlaying && !isMuted) {
      playScene(currentScene);
    } else {
      stopTTS();
    }
  }, [currentScene, isPlaying, isMuted]);
  
  const scenes = [
    { duration: 5000 },  // Cold open - "Seventy-two hours"
    { duration: 12000 }, // The problem
    { duration: 14000 }, // Your story - Fortune 500 background
    { duration: 12000 }, // Football metaphor
    { duration: 14000 }, // The solution - ExecuteIQ intro
    { duration: 12000 }, // 12 minutes transformation
    { duration: 11000 }, // The vision
    { duration: 10000 }, // CTA
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
    stopTTS();
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
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
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
                  className="mt-4"
                >
                  <span className="text-xl md:text-2xl text-slate-400 italic">
                    "That's how long it takes."
                  </span>
                </motion.div>
              </div>
            </Scene>
          )}

          {/* Scene 1: The Problem */}
          {currentScene === 1 && (
            <Scene key="scene-1">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-6"
                >
                  That's how long it takes most Fortune 500 companies to respond to a crisis.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="flex flex-wrap justify-center gap-4 mb-6"
                >
                  <span className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300">Conference calls</span>
                  <span className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300">Scrambling</span>
                  <span className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300">Waiting on decisions</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="text-2xl md:text-3xl font-bold text-red-400"
                >
                  Meanwhile, the damage compounds. The window closes.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 2: Your Story - Fortune 500 */}
          {currentScene === 2 && (
            <Scene key="scene-2">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-xl md:text-2xl text-slate-300 mb-8"
                >
                  I spent 20 years inside Fortune 500 companies watching this happen.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
                >
                  {[
                    { name: "Boyd Gaming", icon: Building2 },
                    { name: "Ford", icon: Building2 },
                    { name: "Lockheed Martin", icon: Building2 },
                    { name: "Vantiv", icon: Building2 },
                    { name: "Eli Lilly", icon: Building2 },
                  ].map((company, i) => (
                    <motion.div
                      key={company.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1 + i * 0.15 }}
                      className="flex flex-col items-center p-3 bg-slate-800/50 border border-slate-700 rounded-lg"
                    >
                      <company.icon className="h-6 w-6 text-amber-400 mb-2" />
                      <span className="text-sm text-slate-300">{company.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2.5 }}
                  className="text-lg text-amber-300 italic"
                >
                  "I've watched $50 million evaporate because we couldn't coordinate fast enough."
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 3: Football Metaphor */}
          {currentScene === 3 && (
            <Scene key="scene-3">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <Trophy className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-xl md:text-2xl text-slate-300 mb-6"
                >
                  I kept thinking—in football, we'd never run a play without practicing it first.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="text-2xl md:text-4xl font-bold text-white"
                >
                  But in business?
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="text-3xl md:text-5xl font-bold text-red-400 mt-4"
                >
                  We wing it. Every time.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 4: The Solution - ExecuteIQ */}
          {currentScene === 4 && (
            <Scene key="scene-4">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-slate-400 mb-4"
                >
                  That's why I built
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                  className="mb-8"
                >
                  <span className="text-6xl md:text-8xl font-bold text-white">ExecuteIQ</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-xl md:text-2xl text-slate-300 mb-6"
                >
                  166 playbooks across every scenario you'll face
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="flex flex-wrap justify-center gap-3"
                >
                  {["Crisis Response", "Market Entry", "M&A Integration", "Product Launches"].map((item, i) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 1.8 + i * 0.1 }}
                      className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300"
                    >
                      {item}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </Scene>
          )}

          {/* Scene 5: 12 Minutes Transformation */}
          {currentScene === 5 && (
            <Scene key="scene-5">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-3 mb-6"
                >
                  <Clock className="h-8 w-8 text-emerald-400" />
                  <span className="text-xl text-slate-400">From signal to coordinated execution</span>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                  className="mb-8"
                >
                  <span className="text-8xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    12
                  </span>
                  <span className="text-4xl md:text-6xl text-emerald-400 ml-4">
                    MINUTES
                  </span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-lg md:text-xl text-slate-300"
                >
                  One click to activate. Roles assigned. Teams moving in parallel.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 6: The Vision */}
          {currentScene === 6 && (
            <Scene key="scene-6">
              <div className="text-center max-w-4xl">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-xl md:text-2xl text-slate-300 mb-8"
                >
                  This isn't about working harder.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-2xl md:text-4xl font-bold text-white mb-6"
                >
                  It's about executing with discipline—
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                  className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"
                >
                  The kind that wins championships.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 7: CTA */}
          {currentScene === 7 && (
            <Scene key="scene-7">
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-slate-400 mb-6"
                >
                  The companies that figure this out first don't just survive.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                  className="text-4xl md:text-6xl font-bold text-white mb-10"
                >
                  They dominate.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="mb-8"
                >
                  <span className="text-2xl md:text-3xl text-emerald-400 font-semibold">
                    Welcome to ExecuteIQ.
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
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
                  <Link href="/founder-story">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="px-8 py-6 text-lg border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <Briefcase className="mr-2 h-5 w-5" />
                      Full Story
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
                {ttsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
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
