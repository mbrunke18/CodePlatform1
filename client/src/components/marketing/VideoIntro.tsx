import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Intro } from "@/components/video/Intro";
import { Problem } from "@/components/video/Problem";
import { Validation } from "@/components/video/Validation";
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
  { id: "intro", component: Intro, duration: 6000 },
  { id: "problem", component: Problem, duration: 10000 },
  { id: "validation", component: Validation, duration: 9000 },
  { id: "solution", component: Solution, duration: 6000 },
  { id: "idea", component: IDEAFramework, duration: 9000 },
  { id: "domains", component: StrategicDomains, duration: 8000 },
  { id: "signals", component: SignalDemo, duration: 8000 },
  { id: "playbook", component: PlaybookDemo, duration: 8000 },
  { id: "activation", component: ActivationDemo, duration: 8000 },
  { id: "integrations", component: IntegrationsDemo, duration: 8000 },
  { id: "command", component: CommandCenterDemo, duration: 9000 },
  { id: "metrics", component: MetricsDemo, duration: 8000 },
  { id: "outro", component: Outro, duration: 8000 },
];

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const totalDuration = SCENES.reduce((acc, s) => acc + s.duration, 0);
  const elapsed = useRef(0);

  const nextScene = useCallback(() => {
    elapsed.current = 0;
    if (currentScene < SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  }, [currentScene, onComplete]);

  useEffect(() => {
    if (!isPlaying) return;

    const scene = SCENES[currentScene];
    elapsed.current = 0;

    const interval = setInterval(() => {
      elapsed.current += 50;
      if (elapsed.current >= scene.duration) {
        clearInterval(interval);
        nextScene();
      } else {
        setProgress(elapsed.current);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, currentScene, nextScene]);

  const CurrentSceneComponent = SCENES[currentScene].component;
  const sceneProgress = progress / SCENES[currentScene].duration;
  const overallProgress = SCENES.slice(0, currentScene).reduce((acc, s) => acc + s.duration, 0) + progress;
  const overallPercent = (overallProgress / totalDuration) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-white text-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-white">
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
      </div>

      <Button
        onClick={onSkip}
        variant="ghost"
        size="lg"
        className="fixed top-6 right-6 z-[110] text-gray-700 hover:text-gray-900 hover:bg-gray-100 gap-2 text-lg"
      >
        <SkipForward className="w-5 h-5" />
        Skip to Site
      </Button>

      {/* Minimal progress indicator - bottom left corner */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-0.5">
          {SCENES.map((scene, idx) => (
            <div
              key={scene.id}
              className={`h-1 rounded-full transition-all ${
                idx === currentScene ? "bg-[#D4AF37] w-4" : 
                idx < currentScene ? "bg-[#D4AF37]/50 w-1.5" : "bg-gray-100 w-1.5"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-600 font-mono ml-1">
          {Math.floor(overallProgress / 1000)}s
        </span>
      </div>

      {/* Mute button - bottom right corner */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-4 right-4 z-30 text-gray-600 hover:text-gray-900 hover:bg-gray-100 opacity-40 hover:opacity-100 transition-opacity h-8 w-8 p-0"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}
