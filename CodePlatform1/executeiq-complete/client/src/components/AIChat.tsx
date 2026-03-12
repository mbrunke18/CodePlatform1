import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, FileText, Clock, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{
    id: string;
    title: string;
    content: string;
    relevanceScore: number;
    sourceType: string;
  }>;
  metadata?: {
    tokensUsed: number;
    processingTime: number;
    confidence: number;
  };
}

interface AIChatProps {
  organizationId?: string;
  placeholder?: string;
}

export function AIChat({ organizationId, placeholder = "Ask me anything about your organization..." }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const nlqMutation = useMutation({
    mutationFn: async (query: string) => {
      return apiRequest("POST", "/api/nlq/query", {
        query,
        conversationId,
        organizationId,
      });
    },
    onSuccess: (response: any) => {
      // Set conversation ID for follow-up queries
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
      }

      // Add assistant response to messages
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        sources: response.sources,
        metadata: response.metadata,
      };

      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error: any) => {
      toast({
        title: "Query Failed",
        description: error.message || "Failed to process your question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuery.trim() || nlqMutation.isPending) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentQuery.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Send query to AI
    nlqMutation.mutate(currentQuery.trim());
    
    // Clear input
    setCurrentQuery("");
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="h-[600px] flex flex-col" data-testid="ai-chat-container">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Intelligence Assistant
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ask questions about your organization's data and get insights backed by real information.
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" data-testid="chat-messages">
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">How can I help you today?</p>
                <p className="text-sm">Ask me about strategic scenarios, team performance, or any organizational data.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className={`rounded-lg p-4 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-50 border'
                  }`}>
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid={`message-content-${index}`}>
                        {message.content}
                      </p>

                      {/* Sources for assistant messages */}
                      {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                        <div className="space-y-2">
                          <Separator />
                          <div>
                            <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              Sources ({message.sources.length})
                            </h4>
                            <div className="space-y-2">
                              {message.sources.map((source, idx) => (
                                <div key={source.id} className="bg-white p-2 rounded border text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-800">{source.title}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {Math.round(source.relevanceScore * 100)}% match
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 line-clamp-2">{source.content}</p>
                                  <Badge variant="secondary" className="mt-1">
                                    {source.sourceType}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Metadata for assistant messages */}
                      {message.role === 'assistant' && message.metadata && (
                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {message.metadata.processingTime}ms
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getConfidenceColor(message.metadata.confidence)}`}
                            >
                              {Math.round(message.metadata.confidence * 100)}% confidence
                            </Badge>
                          </div>
                          <div className="text-xs">
                            {message.metadata.tokensUsed} tokens
                          </div>
                        </div>
                      )}

                      <div className="text-xs opacity-70">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {nlqMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-50 border rounded-lg p-4 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="px-6 py-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              placeholder={placeholder}
              disabled={nlqMutation.isPending}
              className="flex-1"
              data-testid="chat-input"
            />
            <Button 
              type="submit" 
              disabled={!currentQuery.trim() || nlqMutation.isPending}
              data-testid="send-button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            AI responses are powered by your organizational data. Ask about scenarios, performance, risks, or any strategic topic.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}