import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Brain, TrendingUp, AlertTriangle } from "lucide-react";

interface AIConfidenceBadgeProps {
  confidence: number; // 0-100
  basedOn?: number; // Number of similar scenarios
  context?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function AIConfidenceBadge({ 
  confidence, 
  basedOn, 
  context = "similar scenarios",
  size = "md",
  showIcon = true 
}: AIConfidenceBadgeProps) {
  
  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return {
      level: "Very High",
      color: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
      icon: <TrendingUp className="w-3 h-3" />
    };
    if (score >= 70) return {
      level: "High",
      color: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      icon: <Brain className="w-3 h-3" />
    };
    if (score >= 50) return {
      level: "Medium",
      color: "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      icon: <AlertTriangle className="w-3 h-3" />
    };
    return {
      level: "Low",
      color: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      icon: <AlertTriangle className="w-3 h-3" />
    };
  };

  const confidenceData = getConfidenceLevel(confidence);
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  const tooltipContent = (
    <div className="space-y-2">
      <div className="font-semibold">AI Confidence: {confidence}%</div>
      <div className="text-xs opacity-90">
        {confidenceData.level} confidence level
      </div>
      {basedOn && (
        <div className="text-xs opacity-90">
          Based on {basedOn} {context}
        </div>
      )}
      <div className="text-xs opacity-75 mt-2 pt-2 border-t border-white/20">
        {confidence >= 90 && "AI recommendation has very high accuracy. Safe to execute with minimal review."}
        {confidence >= 70 && confidence < 90 && "AI recommendation is reliable. Executive review recommended."}
        {confidence >= 50 && confidence < 70 && "AI recommendation needs validation. Detailed executive review required."}
        {confidence < 50 && "Limited historical data. Executive judgment strongly recommended."}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`${confidenceData.color} ${sizeClasses[size]} gap-1.5 cursor-help`}
            data-testid={`ai-confidence-badge-${confidenceData.level.toLowerCase().replace(' ', '-')}`}
          >
            {showIcon && confidenceData.icon}
            <span className="font-semibold">{confidence}%</span>
            {size !== "sm" && <span className="opacity-75">AI Confidence</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
