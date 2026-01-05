import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AICopilotPanel() {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const aiMutation = useMutation({
    mutationFn: (query: string) => api.askAI(query),
    onSuccess: (data) => {
      setAiResponse(data.response);
      setQuery("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      aiMutation.mutate(query.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Co-pilot Card */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white w-4"></i>
            </div>
            <h3 className="text-lg font-semibold text-foreground">AI Strategic Co-pilot</h3>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {aiResponse && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-sparkles text-white text-xs"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium mb-1">Strategic Insight</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-ai-response">
                    {aiResponse}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-2">
            <label className="text-sm font-medium text-foreground">Ask the AI Co-pilot</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="How can we improve our agility score?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-12"
                disabled={aiMutation.isPending}
                data-testid="input-ai-query"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                disabled={aiMutation.isPending || !query.trim()}
                data-testid="button-send-ai-query"
              >
                {aiMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <i className="fas fa-paper-plane w-4"></i>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        </CardHeader>
        
        <CardContent className="p-6 space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start h-auto p-4"
            data-testid="button-create-organization"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-building text-blue-600 w-4"></i>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Create Organization</p>
              <p className="text-xs text-muted-foreground">Set up a new organizational unit</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-auto p-4"
            data-testid="button-invite-member"
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-user-plus text-green-600 w-4"></i>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Invite Team Member</p>
              <p className="text-xs text-muted-foreground">Add collaborators to your workspace</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-auto p-4"
            data-testid="button-generate-report"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-chart-pie text-purple-600 w-4"></i>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Generate Report</p>
              <p className="text-xs text-muted-foreground">Export agility metrics and insights</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
