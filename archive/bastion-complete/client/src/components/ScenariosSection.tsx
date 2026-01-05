import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type StrategicScenario } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateScenarioModal from "@/components/CreateScenarioModal";

export default function ScenariosSection() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: scenarios, isLoading } = useQuery<StrategicScenario[]>({
    queryKey: ["/api/scenarios/recent"],
    queryFn: () => api.getRecentScenarios(),
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'complete': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Strategic Scenarios</h3>
            <Button 
              onClick={() => setShowCreateModal(true)}
              data-testid="button-create-scenario"
            >
              <i className="fas fa-plus w-4 mr-2"></i>
              New Scenario
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-start space-x-4 p-4 rounded-lg border border-border">
                  <div className="w-10 h-10 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : scenarios?.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-lightbulb text-muted-foreground text-3xl mb-4"></i>
              <p className="text-muted-foreground">No scenarios created yet</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4"
                data-testid="button-create-first-scenario"
              >
                Create Your First Scenario
              </Button>
            </div>
          ) : (
            scenarios?.map((scenario, index) => (
              <div 
                key={scenario.id} 
                className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer"
                data-testid={`card-scenario-${index}`}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-lightbulb text-primary w-5"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-1" data-testid={`text-scenario-title-${index}`}>
                    {scenario.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2" data-testid={`text-scenario-description-${index}`}>
                    {scenario.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span data-testid={`text-scenario-creator-${index}`}>
                      Created by {scenario.creatorName}
                    </span>
                    <span data-testid={`text-scenario-date-${index}`}>
                      {getTimeAgo(scenario.createdAt)}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(scenario.status)}`}>
                      {scenario.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span data-testid={`text-scenario-tasks-${index}`}>
                    {scenario.taskCount} tasks
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <CreateScenarioModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </div>
  );
}
