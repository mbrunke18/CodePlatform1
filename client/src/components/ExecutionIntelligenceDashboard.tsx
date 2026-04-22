import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const RED = "#dc2626";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

interface MaturityData {
  score: number;
  totalActivations: number;
  completedActivations: number;
  targetMetRate: number;
  closedLoopCount: number;
  triggerDepth: number;
  activationScore: number;
  advanceClosureScore: number;
  triggerConfigScore: number;
}

export default function ExecutionIntelligenceDashboard() {
  const { data: maturityData, isLoading } = useQuery<MaturityData>({ 
    queryKey: ['/api/intelligence/maturity-score'],
  });

  if (isLoading) {
    return (
      <Card className="border-[#E8E4DC] bg-white rounded-none mb-8">
        <CardContent className="p-12 text-center">
          <Skeleton className="w-48 h-48 mx-auto mb-4" />
          <Skeleton className="w-32 h-6 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const data = maturityData || {
    score: 0,
    totalActivations: 0,
    completedActivations: 0,
    targetMetRate: 0,
    closedLoopCount: 0,
    triggerDepth: 0,
    activationScore: 0,
    advanceClosureScore: 0,
    triggerConfigScore: 0,
  };

  const getScoreColor = (score: number) => {
    if (score <= 33) return RED;
    if (score <= 66) return GOLD;
    return TEAL;
  };

  const getScoreLabel = (score: number) => {
    if (score <= 33) return "Emerging";
    if (score <= 66) return "Developing";
    return "Operating";
  };

  if (data.totalActivations === 0) {
    return (
      <Card className="border-[#E8E4DC] bg-white rounded-none mb-8">
        <CardContent className="p-12 text-center">
          <p className="text-[#6B7280] font-medium" style={CG}>
            Start activating prepared responses to build your maturity score
          </p>
        </CardContent>
      </Card>
    );
  }

  const scoreColor = getScoreColor(data.score);

  return (
    <Card className="border-[#E8E4DC] bg-white rounded-none mb-8">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Circular Score Display */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#E8E4DC"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={scoreColor}
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 * (1 - data.score / 100)}
                  strokeLinecap="square"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold" style={{ ...CG, color: NAVY }}>{data.score}</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#6B7280]">Maturity Score</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xl font-bold" style={{ ...CG, color: scoreColor }}>{getScoreLabel(data.score)}</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6B7280] mt-1">Execution Maturity Score</div>
            </div>
          </div>

          {/* Breakdown Bars and Stats */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#0A0F2E]">Activation Score (40%)</span>
                  <span className="text-sm font-bold" style={{ ...CG, color: NAVY }}>{data.activationScore}%</span>
                </div>
                <Progress value={data.activationScore} className="h-1 rounded-none bg-[#F8F7F4]" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#0A0F2E]">ADVANCE Closure (40%)</span>
                  <span className="text-sm font-bold" style={{ ...CG, color: NAVY }}>{data.advanceClosureScore}%</span>
                </div>
                <Progress value={data.advanceClosureScore} className="h-1 rounded-none bg-[#F8F7F4]" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#0A0F2E]">Trigger Configuration (20%)</span>
                  <span className="text-sm font-bold" style={{ ...CG, color: NAVY }}>{data.triggerConfigScore}%</span>
                </div>
                <Progress value={data.triggerConfigScore} className="h-1 rounded-none bg-[#F8F7F4]" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8E4DC]">
              <div>
                <div className="text-[9px] font-bold tracking-widest uppercase text-[#6B7280]">Total Activations</div>
                <div className="text-lg font-bold" style={{ ...CG, color: NAVY }}>{data.totalActivations}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-widest uppercase text-[#6B7280]">Target Met Rate</div>
                <div className="text-lg font-bold" style={{ ...CG, color: NAVY }}>{data.targetMetRate}%</div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-widest uppercase text-[#6B7280]">Closed Loop</div>
                <div className="text-lg font-bold" style={{ ...CG, color: NAVY }}>{data.closedLoopCount}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
