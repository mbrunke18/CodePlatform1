import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Brain, TrendingUp, AlertCircle, CheckCircle, Calendar } from "lucide-react";

interface IntelligenceReport {
  id: string;
  reportType: string;
  title: string;
  executiveSummary: string;
  confidence: string;
  generatedAt: string;
  findings?: any;
  recommendations?: any;
}

export default function IntelligenceReportsPanel() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const { data: organizations } = useQuery({
    queryKey: ["/api/organizations"],
    enabled: true
  });

  useEffect(() => {
    if (organizations && Array.isArray(organizations) && organizations.length > 0) {
      setOrganizationId(organizations[0].id);
    }
  }, [organizations]);

  const { data: report, isLoading } = useQuery({
    queryKey: [`/api/intelligence-reports/${organizationId}/latest`],
    enabled: !!organizationId
  });

  const getReportTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'strategic analysis': return <Brain className="h-4 w-4" />;
      case 'market intelligence': return <TrendingUp className="h-4 w-4" />;
      case 'risk assessment': return <AlertCircle className="h-4 w-4" />;
      case 'performance review': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'strategic analysis': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'market intelligence': return "bg-green-50 text-green-700 border-green-200";
      case 'risk assessment': return "bg-red-50 text-red-700 border-red-200";
      case 'performance review': return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card data-testid="intelligence-reports-panel" className="h-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Intelligence Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="intelligence-reports-panel" className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Intelligence Reports
        </CardTitle>
        <CardDescription>
          Executive intelligence and strategic recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {report ? (
          <div className="space-y-4">
            <div className={`p-3 rounded-lg border ${getReportTypeColor(report.reportType)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getReportTypeIcon(report.reportType)}
                  <span className="font-medium text-sm" data-testid="report-title">
                    {report.title}
                  </span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getConfidenceColor(parseFloat(report.confidence))}`}
                  data-testid="report-confidence"
                >
                  {(parseFloat(report.confidence) * 100).toFixed(0)}%
                </Badge>
              </div>
              
              <div className="mb-3">
                <Badge variant="outline" className="text-xs mb-2" data-testid="report-type">
                  {report.reportType}
                </Badge>
                <p className="text-xs text-muted-foreground leading-relaxed" data-testid="executive-summary">
                  {report.executiveSummary && report.executiveSummary.length > 200 
                    ? `${report.executiveSummary.substring(0, 200)}...` 
                    : report.executiveSummary
                  }
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span data-testid="report-date">
                    {formatDate(report.generatedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" data-testid="view-full-report">
                View Full Report
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No intelligence reports available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Executive reports will be generated automatically
            </p>
            <Button variant="outline" size="sm" className="mt-4" data-testid="generate-report">
              Generate Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}