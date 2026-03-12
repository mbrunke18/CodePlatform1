import { useQuery } from "@tanstack/react-query";
import { api, type Activity } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ActivityFeed() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities/recent"],
    queryFn: () => api.getRecentActivities(),
  });

  const getActivityIcon = (action: string) => {
    if (action.includes('completed')) return 'fas fa-check text-green-600';
    if (action.includes('created')) return 'fas fa-lightbulb text-blue-600';
    if (action.includes('joined')) return 'fas fa-users text-orange-600';
    return 'fas fa-info text-blue-600';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities?.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-clock text-muted-foreground text-3xl mb-4"></i>
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          activities?.map((activity, index) => (
            <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-${index}`}>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className={`${getActivityIcon(activity.action)} w-3`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium" data-testid={`text-activity-user-${index}`}>
                    {activity.userName}
                  </span>
                  <span data-testid={`text-activity-action-${index}`}> {activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`text-activity-time-${index}`}>
                  {getTimeAgo(activity.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        
        {activities && activities.length > 0 && (
          <Button 
            variant="ghost" 
            className="w-full text-primary hover:text-primary/80"
            data-testid="button-view-all-activity"
          >
            View All Activity
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
