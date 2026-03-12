import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AIConfidenceBadge from "@/components/AIConfidenceBadge";

interface BoardDeckGeneratorProps {
  organizationId: string;
}

export default function BoardDeckGenerator({ organizationId }: BoardDeckGeneratorProps) {
  const [reportType, setReportType] = useState<string>("executive-summary");
  const [period, setPeriod] = useState<string>("quarter");
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            url: "/downloads/board-deck-q4-2024.pdf",
            filename: "m-executive-brief-q4-2024.pdf",
          });
        }, 2000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Board Deck Generated",
        description: "Your executive briefing is ready for download.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate board deck",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Board Deck Generator</CardTitle>
              <p className="text-sm text-muted-foreground">AI-powered executive briefings</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Generated
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger data-testid="select-report-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="executive-summary">Executive Summary</SelectItem>
                <SelectItem value="roi-impact">ROI Impact Report</SelectItem>
                <SelectItem value="readiness-assessment">Readiness Assessment</SelectItem>
                <SelectItem value="decision-velocity">Decision Velocity Dashboard</SelectItem>
                <SelectItem value="institutional-learning">Institutional Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Time Period</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger data-testid="select-time-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Confidence Indicator */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">AI Analysis Ready</p>
            <AIConfidenceBadge 
              confidence={94} 
              basedOn={156} 
              context="historical decision outcomes"
              size="sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your board deck will include insights from 156 executed playbooks, 47 strategic decisions, and $4.2M in measured ROI impact.
          </p>
        </div>

        {/* Key Metrics Preview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-xs font-medium text-green-700 dark:text-green-400">ROI Impact</p>
            </div>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">$4.2M</p>
            <p className="text-xs text-green-600 dark:text-green-500">Cost savings</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Velocity</p>
            </div>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">12 min</p>
            <p className="text-xs text-blue-600 dark:text-blue-500">Avg execution</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-xs font-medium text-purple-700 dark:text-purple-400">Readiness</p>
            </div>
            <p className="text-lg font-bold text-purple-700 dark:text-purple-400">87/100</p>
            <p className="text-xs text-purple-600 dark:text-purple-500">Exec score</p>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
          data-testid="button-generate-board-deck"
        >
          {generateMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating Board Deck...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate Executive Brief
            </>
          )}
        </Button>

        {generateMutation.isSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                  Board Deck Ready
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mb-3">
                  Your executive briefing has been generated with the latest ROI metrics, decision outcomes, and strategic insights.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
                  data-testid="button-download-deck"
                >
                  <Download className="w-3 h-3 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
