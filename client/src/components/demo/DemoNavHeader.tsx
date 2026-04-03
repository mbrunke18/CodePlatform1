import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

interface DemoNavHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function DemoNavHeader({
  title = "Interactive Demo",
  showBackButton = true,
}: DemoNavHeaderProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/industry-demos");
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{ background: "#0A0F2E" }}
      data-testid="demo-nav-header"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Left: Logo + Demo title */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                setLocation("/");
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              }}
              className="flex items-center hover:opacity-80 transition-opacity"
              data-testid="button-home"
            >
              <VaughnMartinLogo color="light" height={36} variant="full" />
            </button>

            {title && (
              <div className="hidden md:flex items-center gap-2">
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>/</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.55)",
                    textTransform: "uppercase",
                  }}
                >
                  {title}
                </span>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-white/60 hover:text-white hover:bg-white/10"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => {
                setLocation("/playbook-library");
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              }}
              style={{ background: "#C9A84C", color: "#0A0F2E" }}
              className="font-semibold hover:opacity-90"
              data-testid="button-explore-playbooks"
            >
              <BookOpen className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Explore</span> Playbooks
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
