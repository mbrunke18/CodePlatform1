import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Clock, TrendingUp } from 'lucide-react';

export default function TeamPage() {
  return (
    <IDEALayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Team Performance</h1>
          <p className="text-muted-foreground">
            Individual and team execution metrics across playbook activations
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-poise-gold" />
                <div>
                  <div className="text-2xl font-bold">--</div>
                  <div className="text-xs text-muted-foreground">Active Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">--</div>
                  <div className="text-xs text-muted-foreground">Executions Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-poise-teal" />
                <div>
                  <div className="text-2xl font-bold">--</div>
                  <div className="text-xs text-muted-foreground">Avg Response Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-[#2B8A6E]" />
                <div>
                  <div className="text-2xl font-bold">--</div>
                  <div className="text-xs text-muted-foreground">SLA Compliance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No team performance data yet</p>
              <p className="text-sm">Complete playbook executions to see team metrics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IDEALayout>
  );
}
