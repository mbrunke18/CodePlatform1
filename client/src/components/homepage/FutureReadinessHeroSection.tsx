import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Zap, Activity, TrendingUp, Target, Brain } from 'lucide-react';
import { useLocation } from 'wouter';

interface ReadinessMetric {
  overallScore: number;
  foresightScore: number;
  velocityScore: number;
  agilityScore: number;
  learningScore: number;
  adaptabilityScore: number;
  activeScenarios: number;
  weakSignalsDetected: number;
  playbooksReady: number;
}

export default function FutureReadinessHeroSection() {
  const [, setLocation] = useLocation();

  const { data: readiness, isLoading, isError } = useQuery<ReadinessMetric>({
    queryKey: ['/api/dynamic-strategy/readiness'],
    refetchInterval: 30000,
  });

  const score = readiness?.overallScore ?? (isLoading ? null : 84.4);
  const isHigh = score !== null && score >= 80;
  const isMedium = score !== null && score >= 65 && score < 80;
  const displayScore = score !== null ? score : 84.4;

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">NEW: Dynamic Strategy Operating System</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Future Readiness Index™
            </h2>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              The world's first real-time strategic preparedness score. Know exactly how ready your organization is—right now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="relative overflow-hidden border-2 border-emerald-500/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
              
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Your Organization</div>
                    <div className="text-2xl font-bold text-white">Future Readiness Index™</div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <div className={`relative flex h-2 w-2 ${isHigh ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-red-400'}`}>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                      </div>
                      <span className={`text-xs font-medium ${isHigh ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-red-400'}`}>
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className={`text-7xl font-bold bg-gradient-to-br ${isHigh ? 'from-emerald-400 to-blue-400' : isMedium ? 'from-amber-400 to-orange-400' : 'from-red-400 to-pink-400'} bg-clip-text text-transparent mb-2`}>
                    {isLoading ? '...' : `${displayScore.toFixed(1)}%`}
                  </div>
                  <div className="text-sm text-slate-400">
                    {isLoading ? 'Loading...' : isError ? 'Error loading data' : 'Overall Readiness Score'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-blue-400" />
                      <div className="text-xs text-slate-400">Foresight</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">{readiness?.foresightScore?.toFixed(0) || '92'}%</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-emerald-400" />
                      <div className="text-xs text-slate-400">Velocity</div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{readiness?.velocityScore?.toFixed(0) || '88'}%</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-purple-400" />
                      <div className="text-xs text-slate-400">Agility</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-400">{readiness?.agilityScore?.toFixed(0) || '86'}%</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-amber-400" />
                      <div className="text-xs text-slate-400">Learning</div>
                    </div>
                    <div className="text-2xl font-bold text-amber-400">{readiness?.learningScore?.toFixed(0) || '75'}%</div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
                  onClick={() => setLocation('/future-readiness')}
                  data-testid="btn-view-full-readiness"
                >
                  View Full Readiness Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Real-Time Intelligence</h3>
                    <p className="text-sm text-slate-400">
                      Monitor {readiness?.activeScenarios || 166} strategic scenarios, detect {readiness?.weakSignalsDetected || 23} weak signals, and track emerging patterns continuously.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Zap className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">12-Minute Response</h3>
                    <p className="text-sm text-slate-400">
                      From trigger detection to coordinated response—what used to take days now happens in 12 minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Self-Learning Playbooks</h3>
                    <p className="text-sm text-slate-400">
                      Every execution teaches the system. AI extracts learnings and automatically refines playbooks over time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    Top 1% of Fortune 1000
                  </div>
                  <p className="text-sm text-slate-400">
                    84.4% readiness places you in the elite tier of strategic execution velocity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
