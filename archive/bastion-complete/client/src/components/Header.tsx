import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isConnected: boolean;
}

export default function Header({ isConnected }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Strategic Dashboard</h2>
          <p className="text-muted-foreground">Monitor your organization's agility metrics and scenarios</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Real-time Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} data-testid="status-indicator"></div>
            <span className="text-sm text-muted-foreground" data-testid="text-connection-status">
              {isConnected ? 'Live Updates' : 'Disconnected'}
            </span>
          </div>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-muted-foreground hover:text-foreground"
            data-testid="button-notifications"
          >
            <i className="fas fa-bell w-5 h-5"></i>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* User Menu */}
          <Button
            variant="ghost"
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent"
            data-testid="button-user-menu"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground" data-testid="text-header-user-initials">
                {user?.initials || 'U'}
              </span>
            </div>
            <i className="fas fa-chevron-down text-muted-foreground w-3"></i>
          </Button>
        </div>
      </div>
    </header>
  );
}
