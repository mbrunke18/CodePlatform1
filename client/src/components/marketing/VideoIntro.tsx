import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Intro } from "@/components/video/Intro";
import { Problem } from "@/components/video/Problem";
import { Solution } from "@/components/video/Solution";
import { IDEAFramework } from "@/components/video/IDEAFramework";
import { StrategicDomains } from "@/components/video/StrategicDomains";
import { SignalDemo } from "@/components/video/SignalDemo";
import { PlaybookDemo } from "@/components/video/PlaybookDemo";
import { ActivationDemo } from "@/components/video/ActivationDemo";
import { IntegrationsDemo } from "@/components/video/IntegrationsDemo";
import { CommandCenterDemo } from "@/components/video/CommandCenterDemo";
import { MetricsDemo } from "@/components/video/MetricsDemo";
import { Outro } from "@/components/video/Outro";

interface VideoIntroProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const SCENES = [
  { id: "intro", component: Intro, duration: 4000 },
  { id: "problem", component: Problem, duration: 5000 },
  { id: "solution", component: Solution, duration: 4000 },
  { id: "idea", component: IDEAFramework, duration: 6000 },
  { id: "domains", component: StrategicDomains, duration: 5000 },
  { id: "signals", component: SignalDemo, duration: 5000 },
  { id: "playbook", component: PlaybookDemo, duration: 5000 },
  { id: "activation", component: ActivationDemo, duration: 5000 },
  { id: "integrations", component: IntegrationsDemo, duration: 5000 },
  { id: "command", component: CommandCenterDemo, duration: 6000 },
  { id: "metrics", component: MetricsDemo, duration: 5000 },
  { id: "outro", component: Outro, duration: 5000 },
];

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showStartScreen, setShowStartScreen] = useState(true);

  const totalDuration = SCENES.reduce((acc, s) => acc + s.duration, 0);

  const nextScene = useCallback(() => {
    if (currentScene < SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  }, [currentScene, onComplete]);

  const startVideo = () => {
    setShowStartScreen(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const scene = SCENES[currentScene];
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 50;
        if (next >= scene.duration) {
          nextScene();
          return 0;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, currentScene, nextScene]);

  const CurrentSceneComponent = SCENES[currentScene].component;
  const sceneProgress = progress / SCENES[currentScene].duration;
  const overallProgress = SCENES.slice(0, currentScene).reduce((acc, s) => acc + s.duration, 0) + progress;
  const overallPercent = (overallProgress / totalDuration) * 100;

  if (showStartScreen) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#1A2B3D] via-[#0f1a26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 60%)",
              "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-[#D4AF37]"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-[#00A8A8]"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-8 rounded-full border border-[#D4AF37]/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#D4AF37]">EIQ</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">ExecuteIQ</h1>
            <p className="text-xl text-[#D4AF37] font-medium mb-2">Strategic Execution OS</p>
            <p className="text-lg text-white/60">for Fortune 1000 Leaders</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={startVideo}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#c9a432] text-black font-bold text-xl px-12 py-8 rounded-full shadow-2xl shadow-[#D4AF37]/30"
            >
              <Play className="w-8 h-8 mr-3" />
              See It In Action
            </Button>
            
            <p className="text-white/40 text-sm mt-6">
              {Math.floor(totalDuration / 1000)} second experience
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <CurrentSceneComponent progress={sceneProgress} isPlaying={isPlaying} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="w-full bg-white/20 rounded-full h-1.5 mb-4">
          <motion.div 
            className="bg-[#D4AF37] h-1.5 rounded-full"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {SCENES.map((scene, idx) => (
              <div
                key={scene.id}
                className={`h-2 rounded-full transition-all ${
                  idx === currentScene ? "bg-[#D4AF37] w-6" : 
                  idx < currentScene ? "bg-[#D4AF37]/60 w-3" : "bg-white/30 w-3"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>

          <div className="text-sm text-white/60 font-mono">
            {Math.floor(overallProgress / 1000)}s / {Math.floor(totalDuration / 1000)}s
          </div>
        </div>
      </div>
    </div>
  );
}
