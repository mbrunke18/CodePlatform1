import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sword, Shield, Zap, Play, ArrowRight, RotateCcw } from "lucide-react";
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
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}

type SpotVersion = "offense-defense" | "first-mover" | "360x-faster";

interface ThirtySecondSpotProps {
  version?: SpotVersion;
}

export default function ThirtySecondSpot({ version = "offense-defense" }: ThirtySecondSpotProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const getScenes = () => {
    switch (version) {
      case "first-mover":
        return [
          { duration: 3500 },
          { duration: 4000 },
          { duration: 4000 },
          { duration: 5000 },
        ];
      case "360x-faster":
        return [
          { duration: 3500 },
          { duration: 3500 },
          { duration: 4000 },
          { duration: 5000 },
        ];
      default:
        return [
          { duration: 2500 },
          { duration: 2500 },
          { duration: 4000 },
          { duration: 3000 },
          { duration: 4000 },
        ];
    }
  };
  
  const scenes = getScenes();
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
  }, [currentScene, isPlaying, totalScenes]);

  const restart = () => {
    setCurrentScene(0);
    setIsPlaying(true);
    setHasCompleted(false);
  };

  const renderOffenseDefenseSpot = () => (
    <>
      {currentScene === 0 && (
        <Scene key="scene-0">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl md:text-2xl text-slate-300"
            >
              A market opens. A threat emerges. A transformation begins.
            </motion.p>
          </div>
        </Scene>
      )}

      {currentScene === 1 && (
        <Scene key="scene-1">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-lg text-slate-400 mb-4"
            >
              Most organizations?
            </motion.p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <span className="text-4xl md:text-6xl font-bold text-red-500">72 HOURS</span>
              <span className="text-xl text-red-400 ml-3">TOO SLOW.</span>
            </motion.div>
          </div>
        </Scene>
      )}

      {currentScene === 2 && (
        <Scene key="scene-2">
          <div className="text-center max-w-4xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-lg text-slate-400 mb-6"
            >
              M Platform: 166 playbooks for offense, defense, and special teams.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex justify-center gap-8 mb-6"
            >
              <div className="flex items-center gap-2">
                <Sword className="h-6 w-6 text-red-400" />
                <span className="text-red-400 font-semibold">OFFENSE</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-blue-400 font-semibold">DEFENSE</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-400" />
                <span className="text-purple-400 font-semibold">SPECIAL TEAMS</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <span className="text-4xl md:text-6xl font-bold text-emerald-400">12 MINUTES.</span>
            </motion.div>
          </div>
        </Scene>
      )}

      {currentScene === 3 && (
        <Scene key="scene-3">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl text-slate-300"
            >
              Seize opportunities. Protect value. Drive transformation.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-2xl font-bold text-emerald-400 mt-2"
            >
              At speed.
            </motion.p>
          </div>
        </Scene>
      )}

      {currentScene === 4 && (
        <Scene key="scene-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-4"
            >
              <span className="text-6xl md:text-8xl font-bold text-white">M</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mb-6"
            >
              <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-semibold">
                THE SPEED TO EXECUTE.
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Link href="/sandbox">
                <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500" data-testid="button-try-now-30s">
                  <Play className="mr-2 h-5 w-5" />
                  Try It Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </Scene>
      )}
    </>
  );

  const renderFirstMoverSpot = () => (
    <>
      {currentScene === 0 && (
        <Scene key="scene-0">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl md:text-2xl text-slate-300 mb-6"
            >
              Two companies. Same opportunity.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center justify-center gap-8"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500">72 hrs</div>
                <div className="text-sm text-slate-500">Company A</div>
              </div>
              <div className="text-slate-600">vs</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400">?</div>
                <div className="text-sm text-slate-500">Company B</div>
              </div>
            </motion.div>
          </div>
        </Scene>
      )}

      {currentScene === 1 && (
        <Scene key="scene-1">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-8"
            >
              <div className="text-center opacity-50">
                <div className="text-4xl font-bold text-red-500 line-through">72 hrs</div>
                <div className="text-sm text-slate-500">Still scheduling</div>
              </div>
              <ArrowRight className="h-8 w-8 text-emerald-400" />
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400">12 min</div>
                <div className="text-sm text-emerald-300">With M Platform</div>
              </div>
            </motion.div>
          </div>
        </Scene>
      )}

      {currentScene === 2 && (
        <Scene key="scene-2">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl text-slate-400 mb-4"
            >
              First movers don't wait for meetings.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <span className="text-3xl md:text-5xl font-bold text-white">They execute.</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="mt-6"
            >
              <span className="text-2xl font-bold text-emerald-400">SPEED WINS.</span>
            </motion.div>
          </div>
        </Scene>
      )}

      {currentScene === 3 && (
        <Scene key="scene-3">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-4"
            >
              <span className="text-6xl md:text-8xl font-bold text-white">M</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mb-6"
            >
              <span className="text-lg text-slate-300">
                The Strategic Execution Operating System.
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Link href="/sandbox">
                <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500" data-testid="button-try-now-first-mover">
                  <Play className="mr-2 h-5 w-5" />
                  Try It Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </Scene>
      )}
    </>
  );

  const render360xSpot = () => (
    <>
      {currentScene === 0 && (
        <Scene key="scene-0">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-6xl md:text-8xl font-bold text-red-500">72</span>
              <span className="text-3xl md:text-4xl text-red-400 ml-3">HOURS</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="text-lg text-slate-400 mt-4"
            >
              Average time to coordinate a strategic response.
            </motion.p>
          </div>
        </Scene>
      )}

      {currentScene === 1 && (
        <Scene key="scene-1">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <span className="text-6xl md:text-8xl font-bold text-emerald-400">12</span>
              <span className="text-3xl md:text-4xl text-emerald-300 ml-3">MINUTES</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="text-lg text-slate-400 mt-4"
            >
              M Platform.
            </motion.p>
          </div>
        </Scene>
      )}

      {currentScene === 2 && (
        <Scene key="scene-2">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-6"
            >
              <span className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                360X
              </span>
              <br />
              <span className="text-3xl md:text-4xl font-bold text-white">FASTER</span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="text-lg text-slate-400"
            >
              166 playbooks. Instant coordination.
              <br />Whether you're playing offense, defense, or changing the game.
            </motion.p>
          </div>
        </Scene>
      )}

      {currentScene === 3 && (
        <Scene key="scene-3">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-4"
            >
              <span className="text-6xl md:text-8xl font-bold text-white">M</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mb-2"
            >
              <span className="text-lg text-slate-300 uppercase tracking-widest">
                Strategic Execution
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mb-6"
            >
              <span className="text-lg text-slate-300 uppercase tracking-widest">
                Operating System
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <Link href="/sandbox">
                <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500" data-testid="button-try-now-360x">
                  <Play className="mr-2 h-5 w-5" />
                  Try It Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </Scene>
      )}
    </>
  );

  const renderSpot = () => {
    switch (version) {
      case "first-mover":
        return renderFirstMoverSpot();
      case "360x-faster":
        return render360xSpot();
      default:
        return renderOffenseDefenseSpot();
    }
  };

  const getTitle = () => {
    switch (version) {
      case "first-mover":
        return "The First Mover";
      case "360x-faster":
        return "360X Faster";
      default:
        return "Offense, Defense, Special Teams";
    }
  };

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[600px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden" data-testid={`thirty-second-spot-${version}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative h-[500px] md:h-[600px] flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {renderSpot()}
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
                  ? "w-6 bg-white" 
                  : i < currentScene 
                    ? "bg-white/60" 
                    : "bg-white/30"
              }`}
              data-testid={`spot-scene-indicator-${version}-${i}`}
            />
          ))}
        </div>
        
        {hasCompleted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={restart}
            className="ml-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            data-testid={`button-replay-${version}`}
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
          data-testid={`button-skip-${version}`}
        >
          Skip
        </button>
      )}
      
      <div className="absolute top-4 left-4 text-slate-500 text-sm">
        30-Second Spot: {getTitle()}
      </div>
    </div>
  );
}
