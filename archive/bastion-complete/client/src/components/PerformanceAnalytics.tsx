import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PerformanceAnalytics() {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Performance Analytics</h3>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Agility Score Trend */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Agility Score Trend</span>
            <span className="text-sm text-muted-foreground">Last 30 days</span>
          </div>
          <div className="relative h-20 bg-muted/30 rounded-lg" data-testid="chart-agility-trend">
            {/* Simulated chart area */}
            <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
              <div className="w-2 bg-primary h-8 rounded-t"></div>
              <div className="w-2 bg-primary h-12 rounded-t"></div>
              <div className="w-2 bg-primary h-10 rounded-t"></div>
              <div className="w-2 bg-primary h-16 rounded-t"></div>
              <div className="w-2 bg-primary h-14 rounded-t"></div>
              <div className="w-2 bg-primary h-18 rounded-t"></div>
              <div className="w-2 bg-primary h-16 rounded-t"></div>
            </div>
          </div>
        </div>
        
        {/* Key Performance Indicators */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Scenario Completion Rate</span>
              <span className="text-sm font-medium text-foreground" data-testid="text-completion-rate">87%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Task Velocity</span>
              <span className="text-sm font-medium text-foreground" data-testid="text-task-velocity">2.3/day</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Team Engagement</span>
              <span className="text-sm font-medium text-foreground" data-testid="text-team-engagement">94%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>
        
        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-lightbulb text-white text-xs"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">AI Insight</p>
              <p className="text-xs text-muted-foreground" data-testid="text-ai-insight">
                Your team's velocity has increased 23% this month. Consider scaling successful practices to other projects.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
