import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Play, RotateCcw, Volume2, VolumeX, SkipForward, Pause, 
  Building2, Trophy, Clock, Target, Zap, Shield, Sword,
  TrendingUp, AlertTriangle, CheckCircle, Users, BookOpen,
  Radar, BarChart3, ArrowRight, Brain, Loader2
} from "lucide-react";
import { Link } from "wouter";

const SCENE_NARRATIONS = [
  "Every Fortune 1000 company faces an average of 4 to 6 major strategic events per year.",
  "Companies that respond decisively within the first 24 hours are 340 times more likely to achieve their desired outcome than those who wait.",
  "Seventy-two hours. That's how long it takes most Fortune 500 companies just to mobilize — before a single task is assigned, before a single document is staged, before execution begins. Conference calls. Slack messages flying. Three days figuring out who owns what.",
  "What does delay cost? In M&A, $1.3 million in value erosion per day. In crisis response, $4.88 million average breach cost. In competitive response, market windows that close forever.",
  "The reason? Companies improvise. Every time something hits, they start from zero. No playbook. No pre-assigned roles. Just scrambling.",
  "I'm Martin Brunke. I spent 20 years inside Fortune 500 companies watching this happen.",
  "Ford, Toyota, Lockheed Martin, Boyd Gaming, Churchill Downs, Charles Schwab. I lived it. I've watched 50 million dollars evaporate because we couldn't coordinate fast enough.",
  "Before all that? Football coach. 5 years. What I learned: you never run a play in a game without practicing it first. You have a playbook. Everyone knows their role. When the whistle blows, you execute.",
  "But in business? We wing it. Every single time. It's insane when you think about it.",
  "So I built Execution OS. The Strategic Execution Operating System.",
  "170 playbooks across 9 strategic domains. Market entry, M&A, competitive response, crisis management, product launches, regulatory compliance, digital transformation, AI governance, and cybersecurity.",
  "The IDEA Framework. Identify, Detect, Execute, Advance. AI monitors for signals. Pre-built playbooks ready to activate. Coordinated execution with your team. Then capture what worked for next time.",
  "One click to activate a playbook. Tasks auto-assigned. Stakeholders notified. Documents staged. Budgets unlocked. Everyone knows their role.",
  "From signal detection to coordinated execution. 12 minutes. While competitors spend 72 hours just figuring out who needs to be in the room, what work is needed, and what plan to put together — you're already 72 hours deep into actual execution. That's the 340× head start.",
  "The stakes have never been higher. 73% of executives report facing more strategic events than 5 years ago. AI is accelerating everything. Your competitors are moving faster.",
  "This isn't just about defense. It's about offense too. Market opportunities that require speed. M&A integrations that need precision. Product launches that demand coordination.",
  "In a world where everyone has access to AI tools, execution becomes the competitive advantage. The companies that can move decisively will dominate.",
  "We're creating a new category. Strategic Execution Software. Gartner estimates this will be a $10 billion market by 2030.",
  "Execution OS has an 18-month head start. 170 playbooks built. Platform validated with enterprise customers. The moat widens every day.",
  "The companies that figure this out first don't just survive. They dominate. Welcome to Execution OS. Let's execute decisions at scale.",
];

function useTTSNarration() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const isMutedRef = useRef(true);
  const userInteractedRef = useRef(false);

  const fetchAudio = useCallback(async (sceneIndex: number, retryCount = 0): Promise<string | null> => {
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

      if (response.status === 429 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchAudio(sceneIndex, retryCount + 1);
      }

      if (!response.ok) return null;

      const data = await response.json();
      const byteString = atob(data.audio);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);
      audioCache.current.set(sceneIndex, blobUrl);
      return blobUrl;
    } catch (error) {
      console.error('TTS fetch error:', error);
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchAudio(sceneIndex, retryCount + 1);
      }
      return null;
    }
  }, []);

  const prefetchNext = useCallback(async (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < SCENE_NARRATIONS.length && !audioCache.current.has(nextIndex)) {
      fetchAudio(nextIndex);
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

    if (audioUrl && !isMutedRef.current && userInteractedRef.current) {
      const audio = new Audio(audioUrl);
      audio.volume = 0.8;
      audioRef.current = audio;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          prefetchNext(sceneIndex);
        }).catch((err) => {
          console.error('TTS playback error:', err.name, err.message);
        });
      }
    }
  }, [fetchAudio, prefetchNext]);

  const enableAudio = useCallback(() => {
    userInteractedRef.current = true;
    isMutedRef.current = false;
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    isMutedRef.current = muted;
    if (!muted) {
      userInteractedRef.current = true;
    }
    if (audioRef.current) {
      if (muted) {
        audioRef.current.pause();
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

  return { playScene, setMuted, stop, isLoading, enableAudio };
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

interface FounderStoryFullProps {
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

export default function FounderStoryFull({ onComplete, onSkip }: FounderStoryFullProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { setMuted: setAmbientMuted, cleanup } = useAmbientAudio();
  const { playScene, stop: stopTTS, isLoading: ttsLoading, setMuted: setTTSMuted, enableAudio } = useTTSNarration();
  
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setAmbientMuted(newMuted);
    setTTSMuted(newMuted);
    if (!newMuted) {
      enableAudio();
      if (isPlaying) {
        playScene(currentScene);
      }
    }
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
    { duration: 8000 },   // 0: Cold open
    { duration: 10000 },  // 1: McKinsey stat
    { duration: 12000 },  // 2: 72 hours problem
    { duration: 10000 },  // 3: Cost of delay
    { duration: 9000 },   // 4: The reason - improvising
    { duration: 12000 },  // 5: Your story - Fortune 500
    { duration: 11000 },  // 6: Companies worked at
    { duration: 11000 },  // 7: Football coaching
    { duration: 9000 },   // 8: Business winging it
    { duration: 9000 },   // 9: So I built Execution OS
    { duration: 12000 },  // 10: 170 playbooks / 9 domains
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
    <div className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]  via-transparent to-transparent" />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2B8A6E]/10 rounded-full blur-3xl animate-pulse delay-1000" />
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
                  className="text-xl md:text-2xl text-gray-800 mb-6"
                >
                  Let me tell you something every executive knows—
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-xl md:text-2xl text-gray-800 mb-8"
                >
                  but nobody wants to admit.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 2 }}
                  className="text-3xl md:text-5xl font-bold text-gray-900"
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
                  <span className="text-sm uppercase tracking-widest text-gray-800">McKinsey Research</span>
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
                  className="text-xl md:text-2xl text-gray-800"
                >
                  of strategy execution happens <span className="text-gray-900 font-semibold">outside</span> the strategy room.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="text-lg text-gray-800 mt-4"
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
                  className="text-lg text-gray-800 mb-4"
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
                  <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">Conference calls</span>
                  <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">Scrambling</span>
                  <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">Waiting on decisions</span>
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
                  <span className="text-lg text-gray-800">Every hour of delay costs</span>
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
                  className="text-xl text-gray-800"
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
                  className="text-xl md:text-2xl text-gray-800 mb-8"
                >
                  It's not because people aren't smart.
                  <br />It's not because they don't care.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
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
                  className="text-xl md:text-2xl text-gray-800 mb-8"
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
                  className="text-xl text-gray-800"
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
                    { name: "Ford", industry: "Automotive" },
                    { name: "Toyota", industry: "Automotive" },
                    { name: "Lockheed Martin", industry: "Aerospace & Defense" },
                    { name: "Boyd Gaming", industry: "Gaming" },
                    { name: "Churchill Downs", industry: "Entertainment" },
                    { name: "Charles Schwab", industry: "Financial Services" },
                  ].map((company, i) => (
                    <motion.div
                      key={company.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
                      className="flex flex-col items-center p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    >
                      <Building2 className="h-8 w-8 text-amber-400 mb-2" />
                      <span className="text-lg font-medium text-gray-900">{company.name}</span>
                      <span className="text-sm text-gray-800">{company.industry}</span>
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
                  className="text-xl md:text-2xl text-gray-800 mb-4"
                >
                  I coached major college football for 5 years.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-xl md:text-2xl text-gray-900"
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
                  className="text-2xl md:text-4xl font-bold text-gray-900 mb-6"
                >
                  But in business?
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-xl md:text-2xl text-gray-800 mb-6"
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
                  className="text-xl text-gray-800 mb-4"
                >
                  I got tired of watching it happen. So I built
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5, type: "spring" }}
                >
                  <span className="text-7xl md:text-9xl font-bold text-gray-900">Execution OS</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-xl text-[#2B8A6E] mt-6"
                >
                  The Strategic Execution Operating System
                </motion.p>
              </div>
            </Scene>
          )}

          {/* Scene 10: 170 playbooks */}
          {currentScene === 10 && (
            <Scene key="scene-10">
              <div className="text-center max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mb-8"
                >
                  <span className="text-6xl md:text-8xl font-bold text-[#2B8A6E]">170</span>
                  <span className="text-2xl md:text-4xl text-gray-800 ml-4">PLAYBOOKS</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-lg text-gray-800 mb-6"
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
                      className="px-3 py-1.5 bg-[#2B8A6E]/20 border border-[#2B8A6E]/30 rounded-full text-[#2B8A6E] text-sm"
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
                  className="text-lg text-gray-800 mb-8"
                >
                  Powered by the IDEA Framework
                </motion.p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { letter: "I", name: "Identify", icon: BookOpen, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/20", border: "border-[#C9A84C]/30" },
                    { letter: "D", name: "Detect", icon: Radar, color: "text-[#0A0F2E]", bg: "bg-[#0A0F2E]/20", border: "border-[#2B8A6E]/30" },
                    { letter: "E", name: "Execute", icon: Zap, color: "text-[#2B8A6E]", bg: "bg-[#2B8A6E]/20", border: "border-[#2B8A6E]/30" },
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
                      <p className="text-gray-800 text-sm mt-1">{phase.name}</p>
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
                  <span className="text-5xl md:text-7xl font-bold text-gray-900">ONE CLICK</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex flex-wrap justify-center gap-4 mb-6"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#2B8A6E]/20 border border-[#2B8A6E]/30 rounded-lg text-[#2B8A6E]">
                    <CheckCircle className="h-5 w-5" />
                    <span>Roles assigned instantly</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#2B8A6E]/20 border border-[#2B8A6E]/30 rounded-lg text-[#2B8A6E]">
                    <Users className="h-5 w-5" />
                    <span>Teams in parallel</span>
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-xl text-gray-800"
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
                  <Clock className="h-8 w-8 text-[#2B8A6E]" />
                  <span className="text-xl text-gray-800">From signal to full coordinated execution</span>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                  className="mb-6"
                >
                  <span className="text-8xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2B8A6E] to-[#3BAF8A]">12</span>
                  <span className="text-4xl md:text-6xl text-[#2B8A6E] ml-4">MINUTES</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-2xl font-bold text-amber-400"
                >
                  That's a 340× Execution Head Start.
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
                  className="text-xl md:text-2xl text-gray-800 mb-8"
                >
                  Think about what's happening now.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-2xl md:text-4xl font-bold text-gray-900 mb-6"
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
                  className="text-xl text-gray-800 mb-6"
                >
                  But here's what people miss—
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-3xl md:text-5xl font-bold text-gray-900 mb-8"
                >
                  This isn't just defense.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  className="grid md:grid-cols-3 gap-6"
                >
                  <div className="bg-[#2B8A6E]/10 border border-[#2B8A6E]/30 rounded-xl p-4">
                    <TrendingUp className="h-8 w-8 text-[#2B8A6E] mx-auto mb-2" />
                    <p className="text-gray-800">Launch in 4 months vs 18</p>
                    <p className="text-[#2B8A6E] text-sm mt-1">Capture the revenue</p>
                  </div>
                  <div className="bg-[#0A0F2E]/10 border border-[#2B8A6E]/30 rounded-xl p-4">
                    <Target className="h-8 w-8 text-[#0A0F2E] mx-auto mb-2" />
                    <p className="text-gray-800">Integrate in 6 months vs 24</p>
                    <p className="text-[#0A0F2E] text-sm mt-1">Capture synergies</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <Zap className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-gray-800">Move in days vs weeks</p>
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
                  className="text-xl text-gray-800 mb-6"
                >
                  Execution speed isn't risk mitigation.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <span className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#256B56]">
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
                  className="text-xl text-gray-800 mb-6"
                >
                  We're not building another dashboard.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-xl text-gray-800 mb-8"
                >
                  We're creating a new category.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  <span className="text-3xl md:text-5xl font-bold text-gray-900">THE STRATEGIC EXECUTION</span>
                  <br />
                  <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2B8A6E] to-[#3BAF8A]">
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
                  className="text-xl text-gray-800 mb-6"
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
                  <span className="text-2xl md:text-4xl text-gray-800 ml-4">MONTH HEAD START</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-lg text-gray-800"
                >
                  170 playbooks, AI signal detection, the IDEA methodology—
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
                  className="text-lg text-gray-800 mb-6"
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
                  <p className="text-xl md:text-2xl text-gray-800 mb-2">Strategy is 10%. Execution is 90%.</p>
                  <p className="text-3xl md:text-4xl font-bold text-[#2B8A6E]">
                    Execution OS is built for the 90%.
                  </p>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  className="text-2xl text-gray-900 mb-10"
                >
                  Welcome. Let's get to work.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2.5 }}
                  className="flex gap-4 justify-center flex-wrap"
                >
                  <a href="/try-demo">
                    <Button 
                      size="lg" 
                      className="px-8 py-6 text-lg bg-gradient-to-r from-[#2B8A6E] to-[#3BAF8A] hover:from-[#2B8A6E] hover:to-[#3BAF8A]"
                      onClick={() => onSkip?.()}
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Try Demo
                    </Button>
                  </a>
                  <Link href="/playbook-library">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="px-8 py-6 text-lg border-slate-600 text-gray-800 hover:bg-slate-800"
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
          <div className="h-1 bg-gray-50 rounded-full mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-[#256B56]"
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
                className="text-gray-800 hover:text-white"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={restart}
                className="text-gray-800 hover:text-white"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                variant={isMuted ? "default" : "ghost"}
                size="sm"
                onClick={toggleMute}
                className={isMuted ? "bg-amber-500 hover:bg-amber-400 text-black animate-pulse" : "text-gray-800 hover:text-white"}
              >
                {ttsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isMuted ? (
                  <>
                    <VolumeX className="h-5 w-5 mr-2" />
                    <span className="text-sm">Enable Audio</span>
                  </>
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
            </div>

            <div className="text-gray-800 text-sm">
              {currentScene + 1} / {totalScenes}
            </div>

            {onSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-gray-800 hover:text-white gap-2"
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
