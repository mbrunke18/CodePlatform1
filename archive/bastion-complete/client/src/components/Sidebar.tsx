import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-bolt text-primary-foreground text-sm"></i>
          </div>
          <h1 className="text-xl font-bold text-foreground">Bastion</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Certainty, Engineered.</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium bg-accent text-accent-foreground"
          data-testid="nav-dashboard"
        >
          <i className="fas fa-chart-line w-5"></i>
          <span>Dashboard</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
          data-testid="nav-organizations"
        >
          <i className="fas fa-building w-5"></i>
          <span>Organizations</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
          data-testid="nav-scenarios"
        >
          <i className="fas fa-lightbulb w-5"></i>
          <span>Strategic Scenarios</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
          data-testid="nav-tasks"
        >
          <i className="fas fa-tasks w-5"></i>
          <span>Task Management</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
          data-testid="nav-ai"
        >
          <i className="fas fa-robot w-5"></i>
          <span>AI Co-pilot</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
          data-testid="nav-team"
        >
          <i className="fas fa-users w-5"></i>
          <span>Team Members</span>
        </a>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground" data-testid="text-user-initials">
              {user?.initials || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" data-testid="text-user-name">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-user-role">
              {user?.role || 'User'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground p-1"
            data-testid="button-logout"
          >
            <i className="fas fa-sign-out-alt w-4"></i>
          </Button>
        </div>
      </div>
    </aside>
  );
}
