import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";

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
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-white/10"
      data-testid="demo-nav-header"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setLocation('/');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              data-testid="button-home"
            >
              <ExecuteIQLogo 
                width={32} 
                height={32}
                variant="icon-only"
                color="white"
              />
              <div className="hidden md:block">
                <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <span className="text-white">Execute</span>
                  <span className="text-poise-gold">IQ</span>
                </span>
                <div className="text-poise-teal text-xs">Strategic Execution OS</div>
              </div>
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-poise-teal">
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
              onClick={() => {
                setLocation('/playbooks');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="bg-poise-gold hover:bg-amber-500 text-poise-navy font-semibold"
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
