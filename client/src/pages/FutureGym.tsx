import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Target, Trophy, TrendingUp, Play, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

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
    setLocation('/try-demo');
    toast({
      title: `Starting: ${scenario.name}`,
      description: `${scenario.difficulty} level exercise - ${scenario.duration}`,
    });
  };

  return (
    <PageLayout>
      <div className="bg-[#F8F7F4] min-h-screen">
        {/* ─── Dark Hero ─────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: '36px 0 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Execute Phase · Strategic Preparedness</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: '#F0EDE4', marginBottom: 8, lineHeight: 1.1 }}>
                  Future <em style={{ color: GOLD }}>Gym</em>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.55)', maxWidth: 540, lineHeight: 1.6 }}>
                  Build strategic muscle through simulated scenarios and practice drills designed for Fortune 1000 teams.
                </div>
              </div>
              <Button size="lg" className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] rounded-none" onClick={handleCreateExercise} data-testid="button-create-exercise">
                <Target className="w-4 h-4 mr-2" />
                Create Custom Exercise
              </Button>
            </div>
          </div>
        </div>

      <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Team Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Total Exercises</CardDescription>
              <CardTitle className="text-3xl text-[#0A0F2E]" style={CG}>{teamStats.totalExercises}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Average Score</CardDescription>
              <CardTitle className="text-3xl text-[#C9A84C]" style={CG}>{teamStats.avgScore}%</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Training Hours</CardDescription>
              <CardTitle className="text-3xl text-[#2B8A6E]" style={CG}>{teamStats.hoursTraining}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Certifications</CardDescription>
              <CardTitle className="text-3xl text-[#C9A84C]" style={CG}>{teamStats.certifications}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Readiness Improvement Tracker */}
        <Card className="border-[#E8E4DC] bg-white shadow-none">
          <CardHeader>
            <CardTitle style={CG} className="text-xl text-[#0A0F2E]">Readiness Improvement Tracker</CardTitle>
            <CardDescription className="text-[#6B7280]">Your training impact on Future Readiness Index™</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Object.entries(readiness).filter(([key]) => key !== 'overall').map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-1" style={CG}>{value}%</div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-[#6B7280] mb-3">
                    {key}
                  </div>
                  <Progress value={value} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': NAVY } as any} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Scenarios */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A0F2E] mb-4" style={CG}>Training Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingScenarios.map((scenario) => (
              <Card key={scenario.id} className="border border-[#E8E4DC] bg-white shadow-none relative overflow-hidden" data-testid={`card-training-${scenario.id}`}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0A0F2E]" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-[#0A0F2E]" style={CG}>{scenario.name}</CardTitle>
                      <CardDescription className="mt-1 text-[#6B7280]">{scenario.description}</CardDescription>
                    </div>
                    {scenario.completed && (
                      <Trophy className="w-5 h-5 text-[#C9A84C]" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={
                        scenario.difficulty === 'Advanced' ? 'bg-[#0A0F2E] text-white border-none' :
                        scenario.difficulty === 'Intermediate' ? 'bg-[#C9A84C] text-[#0A0F2E] border-none' :
                        'bg-[#F8F7F4] text-[#6B7280] border-[#E8E4DC]'
                      }>
                        {scenario.difficulty.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">
                        {scenario.duration}
                      </span>
                    </div>
                    {scenario.completed && scenario.score && (
                      <div className="p-3 bg-[#2B8A6E]/5 rounded-none border border-[#2B8A6E]/20">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#2B8A6E]">
                            Completed
                          </span>
                          <span className="text-xl font-bold text-[#2B8A6E]" style={CG}>
                            {scenario.score}%
                          </span>
                        </div>
                      </div>
                    )}
                    <Button 
                      className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45]" 
                      variant={scenario.completed ? "outline" : "default"}
                      onClick={() => handleStartExercise(scenario)}
                      data-testid={`button-start-${scenario.id}`}
                    >
                      {scenario.completed ? (
                        <span className="font-bold text-[#0A0F2E]">RETAKE EXERCISE</span>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          <span className="font-bold">START EXERCISE</span>
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
      </div>
    </PageLayout>
  );
}
