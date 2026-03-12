import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Clock, 
  Play,
  CheckCircle,
  Users,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Zap,
  BarChart3
} from 'lucide-react';
import { useState, useEffect } from 'react';

const DEMO_DRILL_SCENARIOS = [
  {
    id: '1',
    name: 'Competitive Response Simulation',
    domain: 'Market Dynamics',
    difficulty: 'Medium',
    duration: '15 min',
    participants: 8,
    description: 'Practice responding to a competitor product launch with coordinated pricing and marketing actions',
    objectives: [
      'Activate pricing playbook within 3 minutes',
      'Coordinate 8 stakeholders across 3 departments',
      'Execute communication plan in parallel'
    ],
    successRate: 87
  },
  {
    id: '2',
    name: 'Supply Chain Disruption Drill',
    domain: 'Operational Excellence',
    difficulty: 'High',
    duration: '20 min',
    participants: 12,
    description: 'War game a critical supplier failure scenario with alternative sourcing and production adjustments',
    objectives: [
      'Identify alternative suppliers within 5 minutes',
      'Adjust production schedules across 3 facilities',
      'Communicate with customers and stakeholders'
    ],
    successRate: 74
  },
  {
    id: '3',
    name: 'Talent Retention Strategy',
    domain: 'Talent & Leadership',
    difficulty: 'Low',
    duration: '12 min',
    participants: 5,
    description: 'Practice executive retention protocols when a key leader receives external offer',
    objectives: [
      'Activate retention playbook',
      'Coordinate compensation and career discussions',
      'Execute decision within 24 hours'
    ],
    successRate: 92
  }
];

export default function PracticeDrillsDemo() {
  const [selectedDrill, setSelectedDrill] = useState(DEMO_DRILL_SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedObjectives, setCompletedObjectives] = useState<number[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedTime(prev => {
          const next = prev + 1;
          // Simulate progress
          setProgress(Math.min(95, (next / 720) * 100)); // 720 seconds = 12 min
          
          // Simulate objectives being completed
          if (next === 30 && !completedObjectives.includes(0)) {
            setCompletedObjectives(prev => [...prev, 0]);
          }
          if (next === 90 && !completedObjectives.includes(1)) {
            setCompletedObjectives(prev => [...prev, 1]);
          }
          if (next === 150 && !completedObjectives.includes(2)) {
            setCompletedObjectives(prev => [...prev, 2]);
          }
          
          return next;
        });
      }, 100); // Fast simulation
    }
    return () => clearInterval(timer);
  }, [isRunning, completedObjectives]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setProgress(0);
    setElapsedTime(0);
    setCompletedObjectives([]);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 border-2 border-purple-200 dark:border-purple-800" data-testid="practice-drills-demo">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-600" />
              Interactive Strategic Simulations
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Practice decision execution through realistic scenario testing
            </p>
          </div>
          <Badge className="bg-purple-600 text-white px-4 py-2 text-lg">
            <Trophy className="h-4 w-4 mr-1" />
            War Games
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drill Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_DRILL_SCENARIOS.map((drill) => {
            const isSelected = selectedDrill.id === drill.id;
            return (
              <button
                key={drill.id}
                onClick={() => {
                  setSelectedDrill(drill);
                  setIsRunning(false);
                  setProgress(0);
                  setElapsedTime(0);
                  setCompletedObjectives([]);
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
                data-testid={`drill-card-${drill.id}`}
              >
                <div className="font-semibold mb-2">{drill.name}</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getDifficultyColor(drill.difficulty)}>
                      {drill.difficulty}
                    </Badge>
                    <span className="text-muted-foreground">{drill.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {drill.participants} participants
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 dark:text-green-400 font-medium">{drill.successRate}% success rate</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Drill Details and Execution */}
        <Card className="bg-white dark:bg-slate-800 border-purple-300 dark:border-purple-700">
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{selectedDrill.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{selectedDrill.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                    {selectedDrill.domain}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {selectedDrill.duration}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {selectedDrill.participants} participants
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {!isRunning ? (
                  <Button 
                    onClick={handleStart} 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    data-testid="start-drill-btn"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Simulation
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStop} 
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    data-testid="stop-drill-btn"
                  >
                    Stop Drill
                  </Button>
                )}
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <div className="font-semibold text-sm flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Zap className="h-4 w-4" />
                Practice Objectives
              </div>
              {selectedDrill.objectives.map((objective, index) => {
                const isCompleted = completedObjectives.includes(index);
                return (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isCompleted 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                        : 'bg-slate-50 dark:bg-slate-700/50'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                    )}
                    <div className={`flex-1 ${isCompleted ? 'font-medium text-green-900 dark:text-green-100' : ''}`}>
                      {objective}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress (only shown when running) */}
            {isRunning && (
              <div className="space-y-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Simulation Running</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-purple-600">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  {completedObjectives.length} of {selectedDrill.objectives.length} objectives completed
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{selectedDrill.successRate}%</div>
                <div className="text-xs text-muted-foreground">Average Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedDrill.participants}</div>
                <div className="text-xs text-muted-foreground">Stakeholders Coordinated</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white">
          <div>
            <div className="font-semibold">Build execution confidence through practice</div>
            <div className="text-sm text-purple-100">Schedule regular war games and strategic rehearsals</div>
          </div>
          <Button 
            variant="secondary" 
            className="bg-white text-purple-600 hover:bg-purple-50"
            data-testid="schedule-drill-btn"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View All Drills
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
