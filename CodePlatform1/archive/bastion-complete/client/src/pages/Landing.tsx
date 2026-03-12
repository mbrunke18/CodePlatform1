import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-bolt text-primary-foreground text-2xl"></i>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Bastion</h1>
          <p className="text-muted-foreground mb-8">Certainty, Engineered.</p>
          
          <Button 
            onClick={handleLogin}
            className="w-full"
            data-testid="button-login"
          >
            Sign In with Replit
          </Button>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Streamline strategic planning, enhance team collaboration, and accelerate organizational agility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
