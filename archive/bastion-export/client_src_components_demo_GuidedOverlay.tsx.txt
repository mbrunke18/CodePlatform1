import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDemoController } from '@/contexts/DemoController';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Maximize, 
  Minimize,
  Volume2,
  Settings
} from 'lucide-react';

interface HighlightedElement {
  element: HTMLElement;
  originalStyle: {
    zIndex: string;
    position: string;
    boxShadow: string;
    border: string;
  };
}

export default function GuidedOverlay() {
  const { 
    state, 
    currentSceneData, 
    pauseDemo, 
    resumeDemo, 
    nextScene, 
    prevScene, 
    stopDemo, 
    togglePresentationMode,
    jumpToScene,
    makeDecision
  } = useDemoController();
  
  const [highlightedElements, setHighlightedElements] = useState<HighlightedElement[]>([]);
  const [narrationVisible, setNarrationVisible] = useState(true);

  // Highlight target elements
  const highlightElements = useCallback((targetIds: string[]) => {
    // Clear previous highlights
    setHighlightedElements(prev => {
      prev.forEach(({ element, originalStyle }) => {
        element.style.zIndex = originalStyle.zIndex;
        element.style.position = originalStyle.position;
        element.style.boxShadow = originalStyle.boxShadow;
        element.style.border = originalStyle.border;
      });
      return [];
    });

    const newHighlighted: HighlightedElement[] = [];

    targetIds.forEach(targetId => {
      const element = document.querySelector(`[data-testid="${targetId}"]`) as HTMLElement;
      if (element) {
        const originalStyle = {
          zIndex: element.style.zIndex || '',
          position: element.style.position || '',
          boxShadow: element.style.boxShadow || '',
          border: element.style.border || ''
        };

        // Apply highlight styling
        element.style.zIndex = '9999';
        element.style.position = 'relative';
        element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4)';
        element.style.border = '2px solid rgb(59, 130, 246)';
        
        newHighlighted.push({ element, originalStyle });
      }
    });

    setHighlightedElements(newHighlighted);
  }, []);

  // Clear highlights when demo stops or scene changes
  useEffect(() => {
    if (!state.isActive) {
      setHighlightedElements(prev => {
        prev.forEach(({ element, originalStyle }) => {
          element.style.zIndex = originalStyle.zIndex;
          element.style.position = originalStyle.position;
          element.style.boxShadow = originalStyle.boxShadow;
          element.style.border = originalStyle.border;
        });
        return [];
      });
      return;
    }

    if (currentSceneData?.targetElements) {
      // Small delay to ensure page is rendered
      const timer = setTimeout(() => {
        highlightElements(currentSceneData.targetElements || []);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [state.isActive, currentSceneData?.id, highlightElements]);

  // Execute scene actions
  useEffect(() => {
    if (!currentSceneData?.actions || !state.isActive || state.isPaused) return;

    const executeActions = async () => {
      if (!currentSceneData.actions) return;
      
      for (const action of currentSceneData.actions) {
        if (action.delay) {
          await new Promise(resolve => setTimeout(resolve, action.delay));
        }

        const targetElement = action.target 
          ? document.querySelector(`[data-testid="${action.target}"]`) as HTMLElement
          : null;

        switch (action.type) {
          case 'click':
            if (targetElement) {
              targetElement.click();
            }
            break;
          case 'hover':
            if (targetElement) {
              targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            }
            break;
          case 'scroll':
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            break;
          case 'wait':
            // Just wait, already handled by delay
            break;
        }
      }
    };

    executeActions();
  }, [currentSceneData, state.isActive, state.isPaused, state.currentScene]);

  if (!state.isActive || !currentSceneData) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return createPortal(
    <>
      {/* Backdrop for presentation mode */}
      {state.presentationMode && (
        <div className="fixed inset-0 bg-black/50 z-[9998]" data-testid="demo-backdrop" />
      )}

      {/* Floating Control Bar */}
      <div 
        className={`fixed top-4 right-4 z-[10000] ${state.presentationMode ? 'top-6 right-6' : ''}`}
        data-testid="demo-control-bar"
      >
        <Card className="bg-gray-900/95 border-blue-500/50 shadow-2xl backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Demo Info */}
              <div className="flex items-center gap-2 text-white">
                <Badge variant="outline" className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                  LIVE DEMO
                </Badge>
                <span className="text-sm">
                  {state.currentScene + 1} / {state.totalScenes}
                </span>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={prevScene}
                  disabled={state.currentScene === 0}
                  className="text-white hover:bg-white/10"
                  data-testid="demo-prev-btn"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={state.isPaused ? resumeDemo : pauseDemo}
                  className="text-white hover:bg-white/10"
                  data-testid="demo-play-pause-btn"
                >
                  {state.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={nextScene}
                  disabled={state.currentScene >= state.totalScenes - 1}
                  className="text-white hover:bg-white/10"
                  data-testid="demo-next-btn"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Additional Controls */}
              <div className="flex items-center gap-1">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={togglePresentationMode}
                  className="text-white hover:bg-white/10"
                  data-testid="demo-presentation-mode-btn"
                >
                  {state.presentationMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setNarrationVisible(!narrationVisible)}
                  className="text-white hover:bg-white/10"
                  data-testid="demo-narration-toggle-btn"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={stopDemo}
                  className="text-white hover:bg-white/10 hover:text-red-400"
                  data-testid="demo-stop-btn"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 w-full bg-gray-700/50 rounded-full h-1">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-1000"
                style={{ width: `${state.progress}%` }}
              />
            </div>

            {/* Time Display */}
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>Scene: {formatTime(currentSceneData.duration)}</span>
              <span>{Math.round(state.progress)}% Complete</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Narration Card - Compact bottom-right corner with full text */}
      {narrationVisible && !currentSceneData.isDecisionPoint && (
        <div 
          className={`fixed bottom-4 right-4 z-[10000] max-w-lg ${state.presentationMode ? 'bottom-6 right-6' : ''}`}
          data-testid="demo-narration-card"
        >
          <Card className="bg-gray-900/90 border-blue-500/40 shadow-xl backdrop-blur-sm max-h-64 overflow-hidden flex flex-col">
            <CardContent className="p-3 overflow-y-auto">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600/80 rounded-md flex items-center justify-center">
                    <Volume2 className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-white">
                      {currentSceneData.title}
                    </h3>
                  </div>
                  
                  <p className="text-white/90 text-xs leading-relaxed">
                    {currentSceneData.narration}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Decision Point Card - Interactive persona selection */}
      {currentSceneData.isDecisionPoint && currentSceneData.decisionOptions && (
        <div 
          className={`fixed inset-4 z-[10001] flex items-center justify-center ${state.presentationMode ? 'inset-6' : ''}`}
          data-testid="demo-decision-card"
        >
          <Card className="bg-gray-900/98 border-blue-500/70 shadow-2xl backdrop-blur-lg max-w-2xl w-full">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentSceneData.title}
                </h2>
                <p className="text-gray-300 text-base">
                  {currentSceneData.narration}
                </p>
              </div>
              
              <div className="space-y-3">
                {currentSceneData.decisionOptions.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => makeDecision(option.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white p-6 h-auto text-left justify-start transition-all duration-300 transform hover:scale-105"
                    data-testid={`decision-option-${option.id}`}
                  >
                    <div className="space-y-2 w-full">
                      <div className="font-bold text-lg">{option.label}</div>
                      <div className="text-sm text-blue-100 opacity-90 leading-relaxed">
                        {option.description}
                      </div>
                      <div className="text-xs text-blue-200 opacity-75 font-medium">
                        Click to continue with {option.focus} focus →
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scene Preview Sidebar (in presentation mode) */}
      {state.presentationMode && (
        <div 
          className="fixed left-6 top-1/2 transform -translate-y-1/2 z-[10000] w-64"
          data-testid="demo-scene-preview"
        >
          <Card className="bg-gray-900/95 border-blue-500/50 shadow-2xl backdrop-blur-md">
            <CardContent className="p-4">
              <h4 className="text-white font-semibold mb-3">Demo Scenes</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {hybridDemoScenarios.map((scene, index) => (
                  <Button
                    key={scene.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => jumpToScene(index)}
                    className={`w-full justify-start text-left h-auto p-2 ${
                      index === state.currentScene
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    data-testid={`demo-scene-${index}`}
                  >
                    <div>
                      <div className="text-xs font-medium">
                        {index + 1}. {scene.title}
                      </div>
                      <div className="text-xs opacity-70">
                        {scene.subtitle}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>,
    document.body
  );
}

// Import hybridDemoScenarios for the scene preview
import { hybridDemoScenarios } from '@/contexts/DemoController';