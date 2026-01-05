import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Turtle, Zap } from 'lucide-react';

interface ROISideProps {
  label: string;
  duration: string;
  approach?: string;
  outcome: string;
  points: string[]; // Can be consequences or benefits
  details?: Record<string, any>;
}

interface ROIComparisonProps {
  traditional: ROISideProps;
  vexor: ROISideProps;
  bottomLine: {
    value: string;
    metric: string;
  };
}

export default function ROIComparison({ traditional, vexor, bottomLine }: ROIComparisonProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Traditional Approach */}
        <Card className="p-6 border-red-500 border-2 bg-red-950/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Turtle className="h-5 w-5 text-red-400" />
              <h3 className="font-bold text-lg text-white">{traditional.label}</h3>
            </div>
            <Badge variant="destructive">{traditional.duration}</Badge>
          </div>

          <div className="space-y-4">
            {traditional.approach && (
              <div className="border-b border-red-800/30 pb-3">
                <p className="text-xs text-red-300">
                  {traditional.approach}
                </p>
              </div>
            )}

            <div className="border-b border-red-800/30 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-200 flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  Outcome
                </span>
              </div>
              <span className="font-bold text-xl text-red-400" data-testid="text-traditional-lost">
                {traditional.outcome}
              </span>
            </div>

            <div className="bg-slate-900/50 p-3 rounded border border-red-800/30">
              <p className="text-xs font-semibold mb-2 text-red-200">The Impact:</p>
              <ul className="text-xs space-y-1 text-red-300">
                {traditional.points.map((point, idx) => (
                  <li key={idx}>• {point}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* M Approach */}
        <Card className="p-6 border-green-500 border-2 bg-green-950/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-400" />
              <h3 className="font-bold text-lg text-white">{vexor.label}</h3>
            </div>
            <Badge className="bg-green-600">{vexor.duration}</Badge>
          </div>

          <div className="space-y-4">
            {vexor.approach && (
              <div className="border-b border-green-800/30 pb-3">
                <p className="text-xs text-green-300">
                  {vexor.approach}
                </p>
              </div>
            )}

            <div className="border-b border-green-800/30 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-200 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Outcome
                </span>
              </div>
              <span className="font-bold text-xl text-green-400" data-testid="text-vexor-preserved">
                {vexor.outcome}
              </span>
            </div>

            <div className="bg-slate-900/50 p-3 rounded border border-green-800/30">
              <p className="text-xs font-semibold mb-2 text-green-200">The Benefits:</p>
              <ul className="text-xs space-y-1 text-green-300">
                {vexor.points.map((point, idx) => (
                  <li key={idx}>• {point}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Line */}
      <Card className="p-6 bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-blue-500">
        <div className="text-center">
          <div className="text-sm text-blue-300 mb-2">Bottom Line</div>
          <div className="text-3xl font-bold text-white mb-2">{bottomLine.value}</div>
          <div className="text-sm text-blue-200">{bottomLine.metric}</div>
        </div>
      </Card>
    </div>
  );
}
