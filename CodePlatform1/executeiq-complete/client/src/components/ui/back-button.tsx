import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({ label = "Back", className = "" }: BackButtonProps) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`text-slate-400 hover:text-white hover:bg-slate-800 gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
