import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Intro } from "@/components/video/Intro";
import { Problem } from "@/components/video/Problem";
import { Solution } from "@/components/video/Solution";
import { PlaybookDemo } from "@/components/video/PlaybookDemo";
import { ActivationDemo } from "@/components/video/ActivationDemo";
import { MetricsDemo } from "@/components/video/MetricsDemo";
import { Outro } from "@/components/video/Outro";

const SCENES = [
  { id: "intro", component: Intro, duration: 4000 },
  { id: "problem", component: Problem, duration: 6000 },
  { id: "solution", component: Solution, duration: 4000 },
  { id: "playbook", component: PlaybookDemo, duration: 6000 },
  { id: "activation", component: ActivationDemo, duration: 6000 },
  { id: "metrics", component: MetricsDemo, duration: 5000 },
  { id: "outro", component: Outro, duration: 5000 },
];

export default function ExecuteIQVideo() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const totalDuration = SCENES.reduce((acc, s) => acc + s.duration, 0);

  const nextScene = useCallback(() => {
    if (currentScene < SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
    }
  }, [currentScene]);

  const prevScene = useCallback(() => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
      setProgress(0);
    }
  }, [currentScene]);

  const restart = useCallback(() => {
    setCurrentScene(0);
    setProgress(0);
    setIsPlaying(true);
  }, []);

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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <div className="relative w-full h-screen">
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

        {!isPlaying && currentScene === 0 && progress === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 z-20"
          >
            <Button
              onClick={() => setIsPlaying(true)}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#c9a432] text-black font-bold text-xl px-12 py-8 rounded-full shadow-2xl"
            >
              <Play className="w-8 h-8 mr-3" />
              Watch Video
            </Button>
          </motion.div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="w-full bg-white/20 rounded-full h-1 mb-4">
            <div 
              className="bg-[#D4AF37] h-1 rounded-full transition-all duration-100"
              style={{ width: `${overallPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => { setCurrentScene(idx); setProgress(0); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentScene ? "bg-[#D4AF37] w-6" : 
                    idx < currentScene ? "bg-[#D4AF37]/60" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={restart}
                className="text-white hover:bg-white/10"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextScene}
                disabled={currentScene >= SCENES.length - 1}
                className="text-white hover:bg-white/10 disabled:opacity-30"
              >
                <SkipForward className="w-5 h-5" />
              </Button>

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
    </div>
  );
}
