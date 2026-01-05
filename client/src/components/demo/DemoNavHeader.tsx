import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useLocation } from "wouter";

interface DemoNavHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function DemoNavHeader({ 
  title = "Interactive Demo", 
  showBackButton = true 
}: DemoNavHeaderProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    // Try to go back in history, fallback to industry demos hub
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/industry-demos');
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10"
      data-testid="demo-nav-header"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLocation('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              data-testid="button-home"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-300 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-slate-900 font-bold text-lg">M</span>
              </div>
              <div className="hidden md:block">
                <div className="text-white font-bold text-lg">M</div>
                <div className="text-blue-400 text-xs">Strategic Execution OS</div>
              </div>
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-blue-300">
              <span className="text-white/50">/</span>
              <span>{title}</span>
            </div>
          </div>

          {/* Right: Navigation Actions */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-white hover:bg-white/10"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={() => setLocation('/playbook-library')}
              className="bg-blue-600 hover:bg-blue-500 text-white"
              data-testid="button-explore-playbooks"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Explore</span> Playbooks
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
