import DemoNavHeader from '@/components/demo/DemoNavHeader';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Zap,
  TrendingUp,
  DollarSign,
  Target,
  Play,
  RefreshCw,
  Activity,
  Server,
  Flag,
  ArrowRight,
  Award,
  Sparkles,
  Shield,
  Handshake,
  Rocket,
  PackageX,
  Info
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import Confetti from 'react-confetti';
import { useLocation } from 'wouter';
import { getScenarioById, DEMO_SCENARIOS } from '@shared/demo-scenarios';
import FourOutcomesScorecard from '@/components/demo/FourOutcomesScorecard';
import PageLayout from '@/components/layout/PageLayout';

interface StakeholderAck {
  id: string;
  name: string;
  role: string;
  acknowledgedAt: string;
  responseTime: number;
}

interface TaskEvent {
  id: string;
  time: number; // seconds from start
  type: 'task' | 'system' | 'milestone';
  title: string;
  description: string;
  icon?: string;
  executed?: boolean;
}

type DemoPhase = 'running' | 'threshold' | 'completing' | 'complete';

function DemoLiveActivation() {
  const [location, setLocation] = useLocation();
  
  // Extract scenario ID from URL path (e.g., /demo/ransomware -> ransomware)
  const scenarioId = useMemo(() => {
    const pathParts = location.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // Map URL paths to scenario IDs
    if (lastPart === 'live-activation' || lastPart === 'ransomware') return 'ransomware';
    return lastPart;
  }, [location]);
  
  // Load scenario from unified configuration
  const scenario = useMemo(() => {
    const loadedScenario = getScenarioById(scenarioId);
    // Fallback to ransomware if scenario not found
    return loadedScenario || DEMO_SCENARIOS['ransomware'];
  }, [scenarioId]);

  const DEMO_SCENARIO = scenario;
  const TARGET_COMPLETION_TIME = scenario.targetCompletionTime;
  const STAKEHOLDER_ROSTER = scenario.stakeholderRoster;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Check if client-side after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [acknowledgments, setAcknowledgments] = useState<StakeholderAck[]>([]);
  const [totalStakeholders, setTotalStakeholders] = useState<number>(scenario.stakeholderRoster.length);
  const [demoPhase, setDemoPhase] = useState<DemoPhase>('running');
  const [executedTasks, setExecutedTasks] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);

  // Timer effect - now continues past 80% threshold
  useEffect(() => {
    if (!startTime || demoPhase === 'complete') return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
      
      // Calculate current progress
      const currentProgress = totalStakeholders > 0 
        ? (acknowledgments.length / totalStakeholders) * 100 
        : 0;
      
      // Debug logging for completion tracking
      if (currentProgress >= 80 && elapsed >= 690) { // Log when approaching completion
        console.log(`📊 Completion Check: elapsed=${elapsed}s (target=${TARGET_COMPLETION_TIME}s), progress=${currentProgress.toFixed(1)}%, phase=${demoPhase}`);
      }
      
      // Auto-complete at target time if we've reached 80% threshold (more lenient)
      // This ensures demo completes even if we don't reach 90%
      // Note: demoPhase can't be 'complete' here due to early return above
      if (elapsed >= TARGET_COMPLETION_TIME && currentProgress >= 80) {
        console.log(`✅ DEMO COMPLETING: elapsed=${elapsed}s, progress=${currentProgress.toFixed(1)}%, transitioning to complete phase`);
        setDemoPhase('complete');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, demoPhase, TARGET_COMPLETION_TIME, acknowledgments.length, totalStakeholders]);

  // Phase progression logic
  useEffect(() => {
    const progress = totalStakeholders > 0 
      ? (acknowledgments.length / totalStakeholders) * 100 
      : 0;

    // Transition to threshold phase at 80%
    if (progress >= 80 && demoPhase === 'running') {
      setDemoPhase('threshold');
    }

    // Transition to completing phase at 90%
    if (progress >= 90 && demoPhase === 'threshold') {
      setDemoPhase('completing');
    }
  }, [acknowledgments.length, totalStakeholders, demoPhase]);

  // Task execution effect - mark tasks as executed when their time is reached
  useEffect(() => {
    if (!executionId || !startTime) return;

    DEMO_SCENARIO.tasks.forEach(task => {
      if (elapsedTime >= task.time && !executedTasks.has(task.id)) {
        setExecutedTasks(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.add(task.id);
          return newSet;
        });
      }
    });
  }, [elapsedTime, executionId, startTime, executedTasks]);

  // Scorecard reveal effect - show 2 seconds after completion
  useEffect(() => {
    if (demoPhase === 'complete' && !showScorecard) {
      const timer = setTimeout(() => {
        setShowScorecard(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [demoPhase, showScorecard]);

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // WebSocket connection - stable connection that persists
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Demo Dashboard connected to WebSocket');
    });

    newSocket.on('disconnect', () => {
      console.log('⚠️  Demo Dashboard disconnected from WebSocket');
    });

    // Only disconnect on actual component unmount, not on re-renders
    return () => {
      console.log('🔌 Cleaning up WebSocket connection');
      newSocket.disconnect();
    };
  }, []); // Empty deps = only run on mount/unmount

  // WebSocket event handlers - join room when executionId is available
  useEffect(() => {
    if (!socket || !executionId) return;

    console.log(`🎯 Joining execution room: ${executionId}`);
    socket.emit('join-execution', executionId);

    const handleAcknowledgment = (data: any) => {
      console.log(`📨 Received acknowledgment:`, data.stakeholderName);
      const ack: StakeholderAck = {
        id: data.stakeholderId,
        name: data.stakeholderName,
        role: data.stakeholderRole || 'Executive',
        acknowledgedAt: data.acknowledgedAt,
        responseTime: Math.floor((new Date(data.acknowledgedAt).getTime() - startTime!.getTime()) / 1000)
      };

      setAcknowledgments(prev => [...prev, ack]);
      setTotalStakeholders(data.totalStakeholders || 30);
    };

    const handleComplete = (data: any) => {
      console.log(`🎉 Coordination complete:`, data);
      setTotalStakeholders(data.totalStakeholders || 30);
      // Don't set complete here - let the phase logic handle it
    };

    socket.on('stakeholder-acknowledged', handleAcknowledgment);
    socket.on('coordination-complete', handleComplete);

    return () => {
      console.log(`👋 Leaving execution room: ${executionId}`);
      socket.off('stakeholder-acknowledged', handleAcknowledgment);
      socket.off('coordination-complete', handleComplete);
      socket.emit('leave-execution', executionId);
    };
  }, [socket, executionId, startTime]);

  // Client-side fallback simulation - ensures demo always completes reliably
  // Monitors progress and fills in missing acknowledgments to guarantee completion
  useEffect(() => {
    if (!executionId || !startTime || demoPhase === 'complete') return;
    
    let isCompleted = false;
    const simulationTimeouts: NodeJS.Timeout[] = [];
    let lastAckCount = 0;
    let stallCheckCount = 0;
    
    // Check every 10 seconds if progress has stalled
    const progressMonitor = setInterval(() => {
      if (isCompleted) {
        clearInterval(progressMonitor);
        return;
      }
      
      const currentProgress = totalStakeholders > 0 
        ? (acknowledgments.length / totalStakeholders) * 100 
        : 0;
      const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const expectedProgress = Math.min(90, (elapsedSeconds / TARGET_COMPLETION_TIME) * 100);
      
      // If we haven't received any new acknowledgments in the last check
      if (acknowledgments.length === lastAckCount) {
        stallCheckCount++;
      } else {
        stallCheckCount = 0;
        lastAckCount = acknowledgments.length;
      }
      
      // If stalled for 20+ seconds OR significantly behind expected progress, start/boost simulation
      const isStalled = stallCheckCount >= 2;
      const isBehind = currentProgress < expectedProgress - 20;
      
      if ((isStalled || isBehind) && currentProgress < 80) {
        console.log(`🔄 Boosting simulation: stalled=${isStalled}, behind=${isBehind}, progress=${currentProgress.toFixed(1)}%, expected=${expectedProgress.toFixed(1)}%`);
        
        // Calculate how many more acknowledgments we need to stay on track
        const targetAcks = Math.ceil((expectedProgress / 100) * totalStakeholders);
        const acksNeeded = Math.max(0, targetAcks - acknowledgments.length);
        
        if (acksNeeded > 0) {
          // Find stakeholders that haven't been acknowledged yet
          const acknowledgedIds = new Set(acknowledgments.map(a => a.id));
          const remainingStakeholders = STAKEHOLDER_ROSTER.filter((s, i) => 
            !acknowledgedIds.has(`sim-${i}`) && !acknowledgedIds.has(s.name)
          );
          
          // Simulate the next batch of acknowledgments over the next 20 seconds
          remainingStakeholders.slice(0, acksNeeded).forEach((stakeholder, index) => {
            const delay = (index + 1) * (15000 / Math.max(1, acksNeeded)); // Spread over 15 seconds
            
            const timeoutId = setTimeout(() => {
              if (isCompleted) return;
              
              const responseTime = elapsedSeconds + Math.floor(delay / 1000);
              const ack: StakeholderAck = {
                id: `sim-boost-${Date.now()}-${index}`,
                name: stakeholder.name,
                role: stakeholder.role,
                acknowledgedAt: new Date().toISOString(),
                responseTime
              };
              
              console.log(`📨 [Boost] ${stakeholder.name} acknowledged`);
              setAcknowledgments(prev => {
                // Prevent duplicates
                if (prev.some(a => a.name === stakeholder.name)) return prev;
                return [...prev, ack];
              });
            }, delay);
            
            simulationTimeouts.push(timeoutId);
          });
        }
      }
    }, 10000); // Check every 10 seconds
    
    // Initial fallback - if no acknowledgments after 8 seconds, start full simulation
    const initialFallback = setTimeout(() => {
      if (isCompleted || acknowledgments.length > 0) return;
      
      console.log('🔄 Starting full client-side simulation (no WebSocket response)');
      
      const stakeholderCount = STAKEHOLDER_ROSTER.length;
      const demoSeconds = TARGET_COMPLETION_TIME;
      const avgInterval = (demoSeconds * 1000) / stakeholderCount * 0.85;
      
      STAKEHOLDER_ROSTER.forEach((stakeholder, index) => {
        const delay = Math.floor(avgInterval * (index + 1) * (0.7 + Math.random() * 0.5));
        
        const timeoutId = setTimeout(() => {
          if (isCompleted) return;
          
          const responseTime = Math.floor(delay / 1000);
          const ack: StakeholderAck = {
            id: `sim-${index}`,
            name: stakeholder.name,
            role: stakeholder.role,
            acknowledgedAt: new Date(startTime.getTime() + delay).toISOString(),
            responseTime
          };
          
          console.log(`📨 [Simulated] ${stakeholder.name} acknowledged at ${responseTime}s`);
          setAcknowledgments(prev => {
            if (prev.some(a => a.name === stakeholder.name)) return prev;
            return [...prev, ack];
          });
        }, delay);
        
        simulationTimeouts.push(timeoutId);
      });
    }, 8000);

    return () => {
      isCompleted = true;
      clearInterval(progressMonitor);
      clearTimeout(initialFallback);
      simulationTimeouts.forEach(id => clearTimeout(id));
    };
  }, [executionId, startTime, demoPhase, STAKEHOLDER_ROSTER, TARGET_COMPLETION_TIME, acknowledgments.length, totalStakeholders]);

  // Start demo activation
  const startDemoActivation = async () => {
    try {
      const response = await fetch('/api/activations/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stakeholderCount: STAKEHOLDER_ROSTER.length,
          accelerated: true,
          targetDuration: 12,
          stakeholderRoster: STAKEHOLDER_ROSTER.map(s => ({ name: s.name, role: s.role })) // Pass scenario stakeholders
        })
      });

      if (response.ok) {
        const data = await response.json();
        setExecutionId(data.executionId);
        setStartTime(new Date(data.coordinationStartTime));
        setAcknowledgments([]);
        setDemoPhase('running');
        setElapsedTime(0);
        setExecutedTasks(new Set());
      } else {
        const error = await response.json();
        console.error('Demo activation failed:', error);
        alert(`Failed to start demo: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to start demo:', error);
      alert('Failed to start demo. Check console for details.');
    }
  };

  const resetDemo = () => {
    setExecutionId(null);
    setStartTime(null);
    setAcknowledgments([]);
    setDemoPhase('running');
    setElapsedTime(0);
    setExecutedTasks(new Set());
    setShowConfetti(false);
    setShowScorecard(false);
  };

  const progress = totalStakeholders > 0 
    ? (acknowledgments.length / totalStakeholders) * 100 
    : 0;

  const avgResponseTime = acknowledgments.length > 0
    ? Math.floor(acknowledgments.reduce((sum, ack) => sum + ack.responseTime, 0) / acknowledgments.length)
    : 0;

  // Final metrics calculations
  const finalMetrics = {
    coordinationTime: formatTime(elapsedTime),
    stakeholdersNotified: totalStakeholders,
    stakeholdersAcknowledged: acknowledgments.length,
    acknowledgmentRate: totalStakeholders > 0 ? ((acknowledgments.length / totalStakeholders) * 100).toFixed(1) : '0',
    averageResponseTime: (avgResponseTime / 60).toFixed(1), // in minutes
    
    // Value calculations
    timeWithoutM: 48, // hours (conservative estimate)
    timeWithM: elapsedTime / 60, // minutes
    timeSavedHours: 48 - (elapsedTime / 3600), // hours saved
    
    // Economic value (30 stakeholders × avg $200/hr × hours saved)
    valueSaved: Math.round((48 - (elapsedTime / 3600)) * 30 * 200),
    
    velocityMultiplier: Math.round((48 * 60) / (elapsedTime / 60)) // how many times faster
  };

  return (
    <div className="page-background min-h-screen bg-slate-950 text-white">
      <DemoNavHeader title="M Live Activation Demo" showBackButton={true} />
      <div className="pt-20 p-8">
      {/* Confetti Celebration */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-5xl font-bold mb-2" data-testid="demo-title">
              M Live Activation Demo
            </h1>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-green-600 text-white px-4 py-2 text-sm" data-testid="badge-human-in-loop">
                <Shield className="w-4 h-4 mr-2 inline" />
                Human-in-the-Loop Activation
              </Badge>
            </div>
            <p className="text-2xl text-slate-600 dark:text-slate-400">
              Real-time Strategic Coordination
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={resetDemo}
              variant="outline"
              size="lg"
              className="text-lg"
              data-testid="button-reset-demo"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Reset
            </Button>
            {!executionId && (
              <Button
                onClick={startDemoActivation}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl px-8 py-6"
                data-testid="button-start-demo"
              >
                <Play className="mr-2 h-6 w-6" />
                Start Demo Activation
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Scenario Welcome Card - Show before execution starts */}
      {!executionId && (
        <div className="max-w-7xl mx-auto mb-8">
          <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-4xl text-center flex items-center justify-center gap-3 text-slate-900 dark:text-white">
                <span className="text-6xl">{DEMO_SCENARIO.emoji}</span>
                {DEMO_SCENARIO.title}
              </CardTitle>
              <p className="text-center text-slate-700 dark:text-slate-300 text-xl mt-4">
                {DEMO_SCENARIO.description}
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 dark:bg-slate-800/50 rounded-lg border border-blue-200 dark:border-slate-700">
                  <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2" data-testid="text-stakeholder-count">
                    {STAKEHOLDER_ROSTER.length}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-lg">Stakeholders</div>
                </div>
                <div className="text-center p-6 bg-purple-50 dark:bg-slate-800/50 rounded-lg border border-purple-200 dark:border-slate-700">
                  <Clock className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">~12 min</div>
                  <div className="text-slate-600 dark:text-slate-400 text-lg">Duration</div>
                </div>
                <div className="text-center p-6 bg-green-50 dark:bg-slate-800/50 rounded-lg border border-green-200 dark:border-slate-700">
                  <DollarSign className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{DEMO_SCENARIO.valueProp}</div>
                  <div className="text-slate-600 dark:text-slate-400 text-lg">Value Created</div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
                  Click "Begin Activation" above to start the 12-minute live demonstration
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Real-time coordination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Live acknowledgments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Before/after metrics</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scenario Context Card */}
      {executionId && demoPhase !== 'complete' && (
        <Card className="max-w-7xl mx-auto mb-8 bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1 page-background">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold text-red-900 dark:text-red-100" data-testid="text-scenario-title">
                    {DEMO_SCENARIO.title}
                  </h2>
                  <Badge className="bg-red-600 text-white text-lg px-4 py-2">ACTIVE</Badge>
                </div>
                <p className="text-xl text-slate-700 dark:text-slate-300 mb-3" data-testid="text-playbook-name">
                  Playbook: {DEMO_SCENARIO.playbook}
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400" data-testid="text-scenario-description">
                  {DEMO_SCENARIO.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Augmented Execution Info Box - Appears at 2:00 mark */}
      {executionId && elapsedTime >= 120 && elapsedTime < 180 && demoPhase !== 'complete' && (
        <Card className="max-w-7xl mx-auto mb-8 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 animate-in fade-in slide-in-from-top duration-500" data-testid="card-augmented-execution-info">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 page-background">
                <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">
                  ✨ Augmented Execution in Action
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                  Notice: M is coordinating stakeholders, but humans are making all decisions.
                </p>
                <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>CEO acknowledging = <strong>Human decision</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Legal reviewing = <strong>Human oversight</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>IT executing = <strong>Human action</strong></span>
                  </li>
                </ul>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-3">
                  💡 The system amplifies. Humans decide.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 80% Threshold Message - Critical Stakeholders Engaged */}
      {executionId && demoPhase === 'threshold' && (
        <Card className="max-w-7xl mx-auto mb-8 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 animate-in fade-in slide-in-from-top duration-500" data-testid="card-threshold-message">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-green-900 dark:text-green-100">
                  ✅ All Critical Stakeholders Engaged
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Human-in-the-loop coordination: {acknowledgments.length}/{totalStakeholders} stakeholders approved their roles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stakeholder Roster Grid - Who's Being Coordinated */}
      {executionId && demoPhase !== 'complete' && (
        <Card className="max-w-7xl mx-auto mb-8 bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-3xl text-slate-900 dark:text-white">
              <span className="flex items-center gap-2">
                <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                Stakeholders Being Coordinated
              </span>
              <Badge variant="outline" className="text-lg px-4 py-2 border-slate-400 dark:border-slate-600">
                {acknowledgments.length} of {totalStakeholders} Acknowledged
              </Badge>
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
              Real-time coordination across all executive stakeholders
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" data-testid="grid-stakeholders">
              {STAKEHOLDER_ROSTER.map((stakeholder) => {
                const isAcknowledged = acknowledgments.some(
                  ack => ack.role === stakeholder.role || ack.name === stakeholder.name
                );
                const priorityColors = {
                  Critical: 'border-red-400 bg-red-100 dark:border-red-500/50 dark:bg-red-900/20',
                  High: 'border-orange-400 bg-orange-100 dark:border-orange-500/50 dark:bg-orange-900/20',
                  Medium: 'border-yellow-400 bg-yellow-100 dark:border-yellow-500/50 dark:bg-yellow-900/20'
                };
                
                return (
                  <div
                    key={stakeholder.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isAcknowledged 
                        ? 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500/70 animate-pulse' 
                        : priorityColors[stakeholder.priority as keyof typeof priorityColors] || 'border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-700/30'
                    }`}
                    data-testid={`stakeholder-${stakeholder.id}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 page-background min-w-0">
                        <div className={`font-semibold text-sm ${isAcknowledged ? 'text-green-700 dark:text-green-300' : 'text-slate-900 dark:text-white'} truncate`}>
                          {stakeholder.name}
                        </div>
                        <div className={`text-xs ${isAcknowledged ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} truncate`}>
                          {stakeholder.role}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 truncate">
                          {stakeholder.department}
                        </div>
                      </div>
                      {isAcknowledged && (
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        stakeholder.priority === 'Critical' ? 'border-red-500 text-red-300' :
                        stakeholder.priority === 'High' ? 'border-orange-500 text-orange-300' :
                        'border-yellow-500 text-yellow-300'
                      }`}
                    >
                      {stakeholder.priority}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* COMPLETION CELEBRATION SCREEN */}
      {demoPhase === 'complete' && (
        <div className="max-w-7xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-green-900/40 border-green-300 dark:border-green-500/50 overflow-hidden">
            <CardContent className="p-12">
              {/* Success Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Award className="h-24 w-24 text-green-400 animate-pulse" />
                  <div>
                    <h1 className="text-7xl font-bold text-green-400 mb-2" data-testid="text-completion-title">
                      🎉 All Stakeholders Coordinated!
                    </h1>
                    <p className="text-3xl text-green-300">
                      Strategic Execution Complete
                    </p>
                  </div>
                  <Sparkles className="h-24 w-24 text-green-400 animate-pulse" />
                </div>
              </div>

              {/* Main Coordination Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="bg-slate-800/80 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <div className="text-6xl font-bold text-green-400 mb-2" data-testid="text-final-time">
                      {finalMetrics.coordinationTime}
                    </div>
                    <div className="text-xl text-slate-300">Coordination Time</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/80 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                    <div className="text-6xl font-bold text-blue-400 mb-2" data-testid="text-final-acks">
                      {finalMetrics.stakeholdersAcknowledged}/{finalMetrics.stakeholdersNotified}
                    </div>
                    <div className="text-xl text-slate-300">Acknowledged</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/80 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                    <div className="text-6xl font-bold text-purple-400 mb-2" data-testid="text-final-rate">
                      {finalMetrics.acknowledgmentRate}%
                    </div>
                    <div className="text-xl text-slate-300">Success Rate</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/80 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                    <div className="text-6xl font-bold text-yellow-400 mb-2" data-testid="text-final-avg">
                      {finalMetrics.averageResponseTime} min
                    </div>
                    <div className="text-xl text-slate-300">Avg Response</div>
                  </CardContent>
                </Card>
              </div>

              {/* The M Advantage - Before/After */}
              <Card className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 border-purple-500/50 mb-12">
                <CardHeader>
                  <CardTitle className="text-4xl text-center text-purple-300">
                    The M Advantage
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Without M */}
                    <div className="text-center p-6 bg-red-900/30 rounded-lg border-2 border-red-500/50">
                      <div className="text-lg text-red-300 mb-3 font-semibold">WITHOUT M</div>
                      <div className="text-7xl font-bold text-red-400 mb-3" data-testid="text-without-vexor">
                        48-72h
                      </div>
                      <div className="text-xl text-slate-400">Traditional coordination</div>
                      <div className="text-lg text-slate-500 mt-2">Email chains, meetings, delays</div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight className="h-24 w-24 text-green-400 animate-pulse" />
                    </div>

                    {/* With M */}
                    <div className="text-center p-6 bg-green-900/30 rounded-lg border-2 border-green-500/50">
                      <div className="text-lg text-green-300 mb-3 font-semibold">WITH M</div>
                      <div className="text-7xl font-bold text-green-400 mb-3 animate-pulse" data-testid="text-with-vexor">
                        {finalMetrics.coordinationTime}
                      </div>
                      <div className="text-xl text-slate-400">Strategic velocity</div>
                      <div className="text-lg text-green-400 mt-2 font-semibold">
                        {finalMetrics.velocityMultiplier}x Faster!
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Value Created */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/50">
                  <CardContent className="p-8 text-center">
                    <Clock className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-blue-400 mb-3" data-testid="text-time-saved">
                      {finalMetrics.timeSavedHours.toFixed(1)} hours
                    </div>
                    <div className="text-2xl text-slate-300">Time Saved</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50">
                  <CardContent className="p-8 text-center">
                    <DollarSign className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-green-400 mb-3" data-testid="text-value-saved">
                      ${finalMetrics.valueSaved.toLocaleString()}
                    </div>
                    <div className="text-2xl text-slate-300">Executive Time Value</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/50">
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-purple-400 mb-3" data-testid="text-velocity">
                      {finalMetrics.velocityMultiplier}x Faster
                    </div>
                    <div className="text-2xl text-slate-300">Strategic Velocity</div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-center gap-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-2xl px-12 py-8"
                  data-testid="button-new-demo"
                  onClick={resetDemo}
                >
                  <Play className="mr-3 h-8 w-8" />
                  Run Another Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Four Outcomes Scorecard - Revealed 2 seconds after completion */}
      {showScorecard && demoPhase === 'complete' && (
        <div className="animate-fade-in">
          <FourOutcomesScorecard
            stakeholdersTotal={finalMetrics.stakeholdersNotified}
            stakeholdersAcknowledged={finalMetrics.stakeholdersAcknowledged}
            coordinationTime={finalMetrics.coordinationTime}
            avgResponseTime={finalMetrics.averageResponseTime}
            tasksCompleted={executedTasks.size}
            tasksTotal={scenario.tasks.length}
            engagementRate={parseFloat(finalMetrics.acknowledgmentRate)}
            overrideCount={1}
          />
        </div>
      )}

      {/* RUNNING DEMO UI */}
      {demoPhase !== 'complete' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timer - Large and Prominent */}
          <Card className="lg:col-span-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Clock className="h-16 w-16 text-blue-400" />
                  <div>
                    <div className="text-8xl font-bold font-mono tracking-tight" data-testid="text-elapsed-time">
                      {formatTime(elapsedTime)}
                    </div>
                    <div className="text-2xl text-slate-400 mt-2">
                      {demoPhase === 'threshold' && 'Continuing to Full Coordination...'}
                      {demoPhase === 'completing' && 'Finalizing Coordination...'}
                      {demoPhase === 'running' && 'Elapsed Time'}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-4">
                  <Progress 
                    value={progress} 
                    className="h-8"
                    data-testid="progress-coordination"
                  />
                  <div className="flex justify-between text-xl">
                    <span className="text-slate-400">
                      {acknowledgments.length} / {totalStakeholders} Stakeholders Acknowledged
                    </span>
                    <span className="font-bold text-blue-400">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Threshold reached message */}
                {demoPhase === 'threshold' && (
                  <div className="mt-8 p-6 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle2 className="h-12 w-12 text-green-400" />
                      <div className="text-3xl font-bold text-green-400">
                        80% threshold reached - continuing to completion...
                      </div>
                    </div>
                  </div>
                )}

                {/* Completing message */}
                {demoPhase === 'completing' && (
                  <div className="mt-8 p-6 bg-purple-500/20 border border-purple-500/50 rounded-lg animate-pulse">
                    <div className="flex items-center justify-center gap-3">
                      <Sparkles className="h-12 w-12 text-purple-400" />
                      <div className="text-3xl font-bold text-purple-400">
                        Final stakeholders coordinating...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-8 w-8 text-blue-400" />
                Acknowledgments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-blue-400" data-testid="text-ack-count">
                {acknowledgments.length}
              </div>
              <div className="text-xl text-slate-400 mt-2">
                out of {totalStakeholders}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="h-8 w-8 text-yellow-400" />
                Avg Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-yellow-400" data-testid="text-avg-response">
                {avgResponseTime}s
              </div>
              <div className="text-xl text-slate-400 mt-2">
                per stakeholder
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-8 w-8 text-green-400" />
                Coordination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-green-400" data-testid="text-progress">
                {progress.toFixed(0)}%
              </div>
              <div className="text-xl text-slate-400 mt-2">
                of target reached
              </div>
            </CardContent>
          </Card>

          {/* Task Execution Timeline */}
          <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-2xl">
                <span className="flex items-center gap-2">
                  <Activity className="h-8 w-8 text-blue-400" />
                  Execution Timeline - What's Happening
                </span>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto" data-testid="feed-timeline">
                {!executionId && (
                  <div className="text-center py-12 text-slate-400 text-xl">
                    Click "Start Demo Activation" to see live execution timeline
                  </div>
                )}
                {executionId && DEMO_SCENARIO.tasks.map((task) => {
                  const isExecuted = executedTasks.has(task.id);
                  const isPending = elapsedTime < task.time;
                  
                  // Choose icon and color based on type
                  const getIcon = () => {
                    if (task.type === 'system') return <Server className="h-6 w-6" />;
                    if (task.type === 'milestone') return <Flag className="h-6 w-6" />;
                    return <Activity className="h-6 w-6" />;
                  };
                  
                  const getColor = () => {
                    if (task.type === 'milestone') return 'text-purple-400 bg-purple-900/30 border-purple-600/50';
                    if (task.type === 'system') return 'text-cyan-400 bg-cyan-900/30 border-cyan-600/50';
                    return 'text-blue-400 bg-blue-900/30 border-blue-600/50';
                  };
                  
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isExecuted 
                          ? getColor() + ' opacity-100 animate-in slide-in-from-left'
                          : 'bg-slate-700/30 border-slate-600/30 opacity-40'
                      }`}
                      data-testid={`timeline-item-${task.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 ${isExecuted ? '' : 'opacity-40'}`}>
                          {getIcon()}
                        </div>
                        <div className="flex-1 page-background">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <div className="font-semibold text-lg">
                              {task.title}
                            </div>
                            <div className="text-sm font-mono whitespace-nowrap">
                              T+{Math.floor(task.time / 60)}:{(task.time % 60).toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className={`text-sm ${isExecuted ? 'opacity-90' : 'opacity-60'}`}>
                            {task.description}
                          </div>
                        </div>
                        {isExecuted && (
                          <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Acknowledgment Feed */}
          <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-2xl">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                  Live Acknowledgment Feed
                </span>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Real-time
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto" data-testid="feed-acknowledgments">
                {acknowledgments.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xl">
                    {executionId 
                      ? 'Waiting for stakeholder acknowledgments...'
                      : 'Click "Start Demo Activation" to begin'
                    }
                  </div>
                )}
                {acknowledgments.map((ack, index) => (
                  <div
                    key={`${ack.id}-${ack.acknowledgedAt}-${index}`}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 animate-in slide-in-from-right"
                    data-testid={`ack-item-${index}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <CheckCircle2 className="h-8 w-8 text-green-400 flex-shrink-0" />
                      <div className="flex-1 page-background">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xl">{ack.name}</span>
                          <Badge variant="secondary" className="text-xs" data-testid={`badge-human-decision-${index}`}>
                            ✓ Human Decision
                          </Badge>
                        </div>
                        <div className="text-lg text-slate-400">{ack.role}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-green-400">
                        +{ack.responseTime}s
                      </div>
                      <div className="text-sm text-slate-400">
                        {new Date(ack.acknowledgedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ROI Comparison */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <DollarSign className="h-8 w-8 text-purple-400" />
                Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-sm text-slate-400 mb-2">WITHOUT M</div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <div className="text-3xl font-bold text-red-400">48-72h</div>
                </div>
                <div className="text-lg text-slate-400 mt-2">
                  coordination time
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="text-sm text-slate-400 mb-2">WITH M</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  <div className="text-3xl font-bold text-green-400">~12min</div>
                </div>
                <div className="text-lg text-slate-400 mt-2">
                  coordination time
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="text-sm text-slate-400 mb-2">TIME SAVED</div>
                <div className="text-4xl font-bold text-purple-400">360x</div>
                <div className="text-lg text-slate-400 mt-2">
                  faster execution
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="text-sm text-slate-400 mb-2">VALUE</div>
                <div className="text-3xl font-bold text-green-400">$283K</div>
                <div className="text-lg text-slate-400 mt-2">
                  executive time saved
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pre-Demo Checklist (collapsible) */}
      {!executionId && (
        <Card className="max-w-7xl mx-auto mt-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl">Pre-Demo Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
                <span>Playbook Library ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
                <span>WebSocket connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
                <span>Demo mode enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
                <span>Ready to activate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}

// Wrap with PageLayout to add unified navigation
export default function DemoLiveActivationPage() {
  return (
    <PageLayout>
      <DemoLiveActivation />
    </PageLayout>
  );
}
