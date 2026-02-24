import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, SkipForward, RotateCcw } from "lucide-react";
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
import PageLayout from '@/components/layout/PageLayout';

const SCENES = [
  { id: "intro", component: Intro, duration: 4000, label: "Hook" },
  { id: "problem", component: Problem, duration: 5000, label: "Problem" },
  { id: "solution", component: Solution, duration: 4000, label: "Solution" },
  { id: "idea", component: IDEAFramework, duration: 6000, label: "IDEA" },
  { id: "domains", component: StrategicDomains, duration: 5000, label: "Domains" },
  { id: "signals", component: SignalDemo, duration: 5000, label: "Signals" },
  { id: "playbook", component: PlaybookDemo, duration: 5000, label: "Playbooks" },
  { id: "activation", component: ActivationDemo, duration: 5000, label: "Activation" },
  { id: "integrations", component: IntegrationsDemo, duration: 5000, label: "Integrations" },
  { id: "command", component: CommandCenterDemo, duration: 6000, label: "Command" },
  { id: "metrics", component: MetricsDemo, duration: 5000, label: "Results" },
  { id: "outro", component: Outro, duration: 5000, label: "CTA" },
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
    <PageLayout>
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
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-[#D4AF37]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-3 rounded-full border-2 border-[#00A8A8]"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-[#D4AF37]">EIQ</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Execution OS</h2>
                <p className="text-white/60">Strategic Execution OS</p>
              </motion.div>
              
              <Button
                onClick={() => setIsPlaying(true)}
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#c9a432] text-black font-bold text-xl px-12 py-8 rounded-full shadow-2xl"
              >
                <Play className="w-8 h-8 mr-3" />
                Watch Video
              </Button>
              
              <p className="text-white/40 text-sm mt-4">
                {Math.floor(totalDuration / 1000)} seconds • {SCENES.length} scenes
              </p>
            </div>
          </motion.div>
        )}

        <div className="absolute top-4 left-4 z-30">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
            <span className="text-white/60">Scene {currentScene + 1}/{SCENES.length}:</span>
            <span className="text-[#D4AF37] ml-2 font-medium">{SCENES[currentScene].label}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="w-full bg-white/20 rounded-full h-1.5 mb-4">
            <div 
              className="bg-[#D4AF37] h-1.5 rounded-full transition-all duration-100"
              style={{ width: `${overallPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => { setCurrentScene(idx); setProgress(0); }}
                  title={scene.label}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentScene ? "bg-[#D4AF37] w-8" : 
                    idx < currentScene ? "bg-[#D4AF37]/60 w-3" : "bg-white/30 w-3"
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

            <div className="text-sm text-white/60 font-mono min-w-[80px] text-right">
              {Math.floor(overallProgress / 1000)}s / {Math.floor(totalDuration / 1000)}s
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}
