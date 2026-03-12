import { useQuery } from "@tanstack/react-query";
import { api, type Metrics } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Target, CheckSquare, Users, TrendingUp, Activity, Zap } from "lucide-react";

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery<Metrics>({
    queryKey: ["/api/dashboard/metrics"],
    queryFn: () => api.getDashboardMetrics(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center text-muted-foreground">
        Unable to load metrics
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-muted-foreground">Active Scenarios</p>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="text-active-scenarios">
                {metrics.activeScenarios}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+18%</span>
            </div>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="text-pending-tasks">
                {metrics.pendingTasks}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckSquare className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex items-center">
              <Activity className="h-3 w-3 text-amber-600 mr-1" />
              <span className="text-amber-600 font-medium">-8%</span>
            </div>
            <span className="text-muted-foreground ml-2">from last week</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="text-team-members">
                {metrics.teamMembers}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">+2</span>
            </div>
            <span className="text-muted-foreground ml-2">new this week</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-medium text-muted-foreground">Agility Score</p>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="text-agility-score">
                {metrics.agilityScore}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 text-purple-600 mr-1" />
              <span className="text-purple-600 font-medium">+0.7</span>
            </div>
            <span className="text-muted-foreground ml-2">this quarter</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
