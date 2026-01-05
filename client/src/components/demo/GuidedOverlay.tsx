import { useEffect, useState, useCallback, useRef } from 'react';
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
  VolumeX,
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
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  // Text-to-Speech functions
  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakNarration = useCallback((text: string) => {
    if (!window.speechSynthesis || !speechEnabled) return;

    // Stop any ongoing speech
    stopSpeech();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [speechEnabled, stopSpeech]);

  const toggleSpeech = useCallback(() => {
    if (speechEnabled) {
      stopSpeech();
      setSpeechEnabled(false);
    } else {
      setSpeechEnabled(true);
      // Start speaking current narration if available
      if (currentSceneData?.narration) {
        speakNarration(currentSceneData.narration);
      }
    }
  }, [speechEnabled, stopSpeech, currentSceneData, speakNarration]);

  // Speak narration when scene changes (if speech is enabled)
  useEffect(() => {
    if (speechEnabled && currentSceneData?.narration && !state.isPaused) {
      speakNarration(currentSceneData.narration);
    }
    return () => stopSpeech();
  }, [currentSceneData?.id, speechEnabled, state.isPaused, speakNarration, stopSpeech]);

  // Stop speech when demo pauses or stops
  useEffect(() => {
    if (state.isPaused || !state.isActive) {
      stopSpeech();
    }
  }, [state.isPaused, state.isActive, stopSpeech]);

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

  // Only show GuidedOverlay during HybridDemoNavigator, not ExecutiveDemo
  if (!state.isActive || !currentSceneData || window.location.pathname === '/executive-demo') return null;

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
                  onClick={toggleSpeech}
                  className={`text-white hover:bg-white/10 ${speechEnabled ? 'bg-blue-600/30' : ''}`}
                  data-testid="demo-speech-toggle-btn"
                  title={speechEnabled ? 'Disable narration audio' : 'Enable narration audio'}
                >
                  {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
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

            {/* Progress Display */}
            <div className="mt-1 text-center text-xs text-gray-400">
              <span>{Math.round(state.progress)}% Complete</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Narration Card - Positioned above split-screen comparison */}
      {narrationVisible && !currentSceneData.isDecisionPoint && (
        <div 
          className={`fixed right-4 z-[10000] max-w-lg ${state.presentationMode ? 'right-6' : ''}`}
          style={{ bottom: state.presentationMode ? '44vh' : '42vh' }}
          data-testid="demo-narration-card"
        >
          <Card className="bg-gray-900/95 border-blue-500/50 shadow-2xl backdrop-blur-sm max-h-64 overflow-hidden flex flex-col">
            <CardContent className="p-4 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${isSpeaking && speechEnabled ? 'bg-blue-600 animate-pulse' : 'bg-blue-600/60'}`}>
                    <Volume2 className={`h-5 w-5 text-white ${isSpeaking && speechEnabled ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">
                      {currentSceneData.title}
                    </h3>
                    {speechEnabled && (
                      <Badge className="bg-green-600/80 text-white text-xs">
                        🔊 Audio On
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-white text-sm leading-relaxed">
                    {currentSceneData.narration}
                  </p>
                  
                  {!speechEnabled && (
                    <p className="text-blue-300 text-xs mt-2 italic">
                      💡 Tip: Click the volume icon in the control bar to enable audio narration
                    </p>
                  )}
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
          <Card className="bg-gray-900/98 border-blue-500/70 shadow-2xl backdrop-blur-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <CardContent className="p-8 overflow-y-auto max-h-[90vh]">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentSceneData.decisionOptions.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => makeDecision(option.id)}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white p-4 h-auto text-left justify-start transition-all duration-300 transform hover:scale-105"
                    data-testid={`decision-option-${option.id}`}
                  >
                    <div className="space-y-1.5 w-full">
                      <div className="font-bold text-base">{option.label}</div>
                      <div className="text-xs text-blue-100 opacity-90 leading-snug">
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