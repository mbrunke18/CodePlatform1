import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Target, Trophy, TrendingUp, Play, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const trainingScenarios = [
  {
    id: 1,
    name: 'Crisis Decision Speed',
    description: 'Practice making critical decisions under time pressure',
    difficulty: 'Advanced',
    duration: '45 min',
    completed: false,
    score: null,
  },
  {
    id: 2,
    name: 'Weak Signal Detection',
    description: 'Train your team to identify early warning signs',
    difficulty: 'Intermediate',
    duration: '30 min',
    completed: true,
    score: 87,
  },
  {
    id: 3,
    name: 'Multi-Team Coordination',
    description: 'Simulate complex cross-functional responses',
    difficulty: 'Advanced',
    duration: '60 min',
    completed: false,
    score: null,
  },
  {
    id: 4,
    name: 'Playbook Customization',
    description: 'Adapt standard playbooks to your context',
    difficulty: 'Beginner',
    duration: '20 min',
    completed: true,
    score: 92,
  },
];

const teamStats = {
  totalExercises: 127,
  avgScore: 84,
  hoursTraining: 342,
  certifications: 28,
};

export default function FutureGym() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { readiness } = useDynamicStrategy();

  const handleCreateExercise = () => {
    setLocation('/practice-drills');
    toast({
      title: 'Create Custom Exercise',
      description: 'Use Practice Drills to design and customize your training scenarios.',
    });
  };

  const handleStartExercise = (scenario: typeof trainingScenarios[0]) => {
    setLocation('/executive-simulation');
    toast({
      title: `Starting: ${scenario.name}`,
      description: `${scenario.difficulty} level exercise - ${scenario.duration}`,
    });
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <Dumbbell className="w-10 h-10 text-blue-600" />
              Future Gym
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Build strategic muscle through simulated scenarios and practice drills
            </p>
          </div>
          <Button size="lg" onClick={handleCreateExercise} data-testid="button-create-exercise">
            <Target className="w-4 h-4 mr-2" />
            Create Custom Exercise
          </Button>
        </div>

        {/* Team Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardDescription>Total Exercises</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{teamStats.totalExercises}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Average Score</CardDescription>
              <CardTitle className="text-3xl text-violet-600">{teamStats.avgScore}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Training Hours</CardDescription>
              <CardTitle className="text-3xl text-emerald-600">{teamStats.hoursTraining}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Certifications</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{teamStats.certifications}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Readiness Improvement Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Readiness Improvement Tracker</CardTitle>
            <CardDescription>Your training impact on Future Readiness Index™</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(readiness).filter(([key]) => key !== 'overall').map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{value}%</div>
                  <div className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
                    {key}
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Scenarios */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Training Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingScenarios.map((scenario) => (
              <Card key={scenario.id} data-testid={`card-training-${scenario.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <CardDescription className="mt-1">{scenario.description}</CardDescription>
                    </div>
                    {scenario.completed && (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        scenario.difficulty === 'Advanced' ? 'destructive' :
                        scenario.difficulty === 'Intermediate' ? 'default' :
                        'secondary'
                      }>
                        {scenario.difficulty}
                      </Badge>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {scenario.duration}
                      </span>
                    </div>
                    {scenario.completed && scenario.score && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-900">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-900 dark:text-green-100">
                            Completed
                          </span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {scenario.score}%
                          </span>
                        </div>
                      </div>
                    )}
                    <Button 
                      className="w-full" 
                      variant={scenario.completed ? "outline" : "default"}
                      onClick={() => handleStartExercise(scenario)}
                      data-testid={`button-start-${scenario.id}`}
                    >
                      {scenario.completed ? (
                        <>Retake Exercise</>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Exercise
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
