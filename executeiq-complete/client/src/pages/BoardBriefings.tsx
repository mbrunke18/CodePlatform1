import PageLayout from '@/components/layout/PageLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, CheckCircle, TrendingUp, Award } from 'lucide-react';

export default function BoardBriefings() {
  const { data: briefingsData, isLoading: briefingsLoading } = useQuery<any[]>({
    queryKey: ['/api/executive-briefings'],
  });

  const { data: boardReportsData, isLoading: reportsLoading } = useQuery<any[]>({
    queryKey: ['/api/board-reports'],
  });

  const briefings = briefingsData ?? [];
  const boardReports = boardReportsData ?? [];
  const acknowledgedBriefings = briefings.filter((b: any) => b.reviewed);

  return (
    <PageLayout>
      <div className="space-y-6 p-6">
        {/* V2 Feature Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">Coming in V2</Badge>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            This feature launches after your organization builds crisis data. Board Briefings auto-generate executive reports with evidence traceability.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="page-title">
            <FileText className="h-8 w-8 text-blue-500" />
            Board Briefings
          </h1>
          <p className="text-muted-foreground mt-1">
            Automated executive reports with evidence traceability for board presentations
          </p>
        </div>
        <Button data-testid="button-generate-briefing">
          <FileText className="h-4 w-4 mr-2" />
          Generate New Briefing
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card data-testid="card-total-briefings">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Briefings</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{briefings.length}</div>
            <p className="text-xs text-muted-foreground">
              Executive intelligence summaries
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-board-reports">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Board Reports</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boardReports.length}</div>
            <p className="text-xs text-muted-foreground">
              Quarterly board presentations
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-reviewed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acknowledgedBriefings.length}</div>
            <p className="text-xs text-muted-foreground">
              Acknowledged by executives
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-confidence">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {briefings.length > 0 
                ? Math.round(briefings.reduce((acc: number, b: any) => acc + (b.confidenceLevel || 85), 0) / briefings.length)
                : 85}%
            </div>
            <p className="text-xs text-muted-foreground">
              AI-generated insights
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Executive Briefings */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Briefings</CardTitle>
          <CardDescription>
            AI-generated daily intelligence, crisis alerts, and decision support summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {briefingsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading briefings...</div>
          ) : briefings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No briefings generated yet</p>
              <Button className="mt-4" data-testid="button-create-first-briefing">Generate First Briefing</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {briefings.map((briefing: any) => (
                <div 
                  key={briefing.id} 
                  className="border rounded-lg p-4 space-y-3"
                  data-testid={`briefing-${briefing.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 page-background space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold" data-testid={`text-briefing-title-${briefing.id}`}>{briefing.title}</h3>
                        <Badge variant="outline">{briefing.briefingType}</Badge>
                        {briefing.timeToDecision && (
                          <Badge variant="secondary">{briefing.timeToDecision}</Badge>
                        )}
                        {briefing.reviewed && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm">{briefing.executiveSummary}</p>
                      
                      {briefing.keyInsights && briefing.keyInsights.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Key Insights:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {(briefing.keyInsights as any[]).slice(0, 3).map((insight: string, idx: number) => (
                              <li key={idx}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {briefing.confidenceLevel && (
                          <span>Confidence: {briefing.confidenceLevel}%</span>
                        )}
                        {briefing.createdAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(briefing.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" data-testid={`button-view-briefing-${briefing.id}`}>
                        View Full
                      </Button>
                      <Button size="sm" variant="ghost" data-testid={`button-download-briefing-${briefing.id}`}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Board Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Board Reports</CardTitle>
          <CardDescription>
            Comprehensive performance dashboards and strategic updates for board presentations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading board reports...</div>
          ) : boardReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No board reports generated yet</p>
              <Button className="mt-4" data-testid="button-generate-first-report">Generate First Report</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {boardReports.map((report: any) => (
                <div 
                  key={report.id} 
                  className="border rounded-lg p-4 space-y-3"
                  data-testid={`report-${report.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 page-background space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold" data-testid={`text-report-title-${report.id}`}>{report.title}</h3>
                        <Badge variant="outline">{report.reportType}</Badge>
                        <Badge>{report.reportingPeriod}</Badge>
                        {report.approvedBy && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm">{report.executiveSummary}</p>
                      
                      {report.presentedAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Presented: {new Date(report.presentedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" data-testid={`button-view-report-${report.id}`}>
                        View Report
                      </Button>
                      <Button size="sm" variant="outline" data-testid={`button-export-report-${report.id}`}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </PageLayout>
  );
}
