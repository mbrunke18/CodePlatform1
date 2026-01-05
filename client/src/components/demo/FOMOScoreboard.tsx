import { useDemoController } from '@/contexts/DemoController';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { demoData } from '@/lib/demoData';

export function FOMOScoreboard() {
  const demoController = useDemoController();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!demoController.state.isActive) {
      setShow(false);
      return;
    }

    if (demoController.state.currentExecutiveStep === 2) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(hideTimer);
    } else {
      setShow(false);
    }
  }, [demoController.state.isActive, demoController.state.currentExecutiveStep]);

  if (!show) return null;

  // Use enhanced demo data for WOW factor
  const yourScore = demoData.preparedness.overall; // 94
  const yourRank = 12; // Improved from 23
  const totalExecutives = 500;
  const percentile = Math.round((1 - (yourRank / totalExecutives)) * 100);
  const industryAverage = 72; // Improved from 62 to show better delta

  const topPeers = [
    { rank: 1, name: 'Anonymous CEO', company: 'Tech Fortune 100', score: 98 },
    { rank: 2, name: 'Anonymous CEO', company: 'Pharma Fortune 50', score: 97 },
    { rank: 3, name: 'Anonymous CEO', company: 'Finance Fortune 100', score: 96 },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40" data-testid="fomo-scoreboard">
      <Card className="bg-gradient-to-br from-purple-950/90 to-indigo-950/90 border-purple-500/30 backdrop-blur-sm shadow-2xl">
        <div className="p-4 space-y-3 min-w-[320px]">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Executive Preparedness™
            </div>
            <Trophy className="h-4 w-4 text-purple-400 animate-pulse" />
          </div>

          {/* Your Score */}
          <div className="text-center py-2 bg-purple-900/30 rounded-lg border border-purple-500/20">
            <div className="text-xs text-purple-400 mb-1">YOUR SCORE</div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-purple-400 tabular-nums">
                {yourScore}
              </span>
              <span className="text-xl text-purple-300">/100</span>
            </div>
            <div className="text-xs text-purple-300 mt-1">
              Top {percentile}% of Fortune 1000 CEOs
            </div>
          </div>

          {/* Ranking */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-xs text-purple-400/70 mb-1">Your Rank</div>
              <div className="text-2xl font-bold text-purple-400">
                #{yourRank}
              </div>
              <div className="text-xs text-purple-300/70">of {totalExecutives}</div>
            </div>
            
            <div className="text-center border-l border-purple-500/20">
              <div className="text-xs text-purple-400/70 mb-1">vs Average</div>
              <div className="text-2xl font-bold text-emerald-400">
                +{yourScore - industryAverage}
              </div>
              <div className="text-xs text-purple-300/70">points ahead</div>
            </div>
          </div>

          {/* Progress to Top Tier */}
          <div className="space-y-2 pt-2 border-t border-purple-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300">To Top 5 (Score 96)</span>
              <span className="text-purple-400 font-semibold">2 pts</span>
            </div>
            <Progress value={(yourScore / 96) * 100} className="h-2" />
          </div>

          {/* Top 3 Leaderboard */}
          <div className="space-y-2 pt-2 border-t border-purple-500/20">
            <div className="text-xs text-purple-300 font-semibold flex items-center gap-2">
              <Users className="h-3 w-3" />
              Top 3 CEOs
            </div>
            {topPeers.map((peer) => (
              <div key={peer.rank} className="flex items-center justify-between text-xs bg-purple-900/20 rounded px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">#{peer.rank}</span>
                  <div>
                    <div className="text-purple-200">{peer.name}</div>
                    <div className="text-purple-400/70 text-xs">{peer.company}</div>
                  </div>
                </div>
                <span className="font-bold text-purple-300">{peer.score}</span>
              </div>
            ))}
          </div>

          {/* Competitive Pressure */}
          <div className="pt-2 border-t border-purple-500/30 bg-amber-500/10 rounded px-3 py-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span className="font-semibold">
                12 executives practicing scenarios this week
              </span>
            </div>
            <div className="text-xs text-amber-300/70 mt-1">
              Don't fall behind in preparedness rankings
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
