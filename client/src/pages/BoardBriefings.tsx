import PageLayout from '@/components/layout/PageLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, CheckCircle, TrendingUp, Award, AlertTriangle, Brain, Target, Clock, Zap } from 'lucide-react';
import { SubBrandLabel } from "@/components/SubBrandLabel";

const demoBriefings = [
  {
    id: 'br-001',
    title: 'Q4 2025 Quarterly Performance Review',
    briefingType: 'Quarterly Review',
    timeToDecision: '24h window',
    reviewed: true,
    executiveSummary: 'Revenue exceeded targets by 12.3% driven by enterprise expansion and new logo acquisition. Operating margins improved 180bps YoY to 34.2%. Customer retention rate held steady at 96.8%, with NPS increasing to 72. Three strategic initiatives on track for H1 2026 delivery.',
    keyInsights: [
      'Enterprise ARR grew 28% YoY to $47.2M, exceeding guidance by $3.1M',
      'Sales cycle compression from 94 to 71 days following playbook standardization',
      'Gross margin expansion to 78.4% reflects operational leverage from platform investments'
    ],
    confidenceLevel: 94,
    createdAt: '2025-12-15T09:00:00Z'
  },
  {
    id: 'br-002',
    title: 'M&A Integration Update — Nexus Analytics Acquisition',
    briefingType: 'Strategic Update',
    timeToDecision: '48h window',
    reviewed: true,
    executiveSummary: 'Nexus Analytics integration is 78% complete, ahead of the 90-day target timeline. Technology stack consolidation on track with 92% API compatibility achieved. Key talent retention at 94% with 3 critical engineering leads secured on 2-year packages. Revenue synergies estimated at $8.4M for FY2026.',
    keyInsights: [
      'Data platform migration 85% complete — full cutover scheduled for Feb 28',
      'Cross-sell pipeline of $12.6M identified across combined customer base',
      'Cultural integration score at 4.2/5.0 based on pulse survey of 340 employees'
    ],
    confidenceLevel: 89,
    createdAt: '2026-01-22T14:30:00Z'
  },
  {
    id: 'br-003',
    title: 'Cybersecurity Posture & Threat Landscape Report',
    briefingType: 'Risk Assessment',
    timeToDecision: 'Immediate',
    reviewed: false,
    executiveSummary: 'Overall security posture rated "Strong" with SOC 2 Type II audit completed successfully. Zero critical vulnerabilities in production systems. Phishing simulation success rate improved to 97.3% from 89.1% following Q3 training initiative. Third-party vendor risk assessment identified 2 medium-risk dependencies requiring remediation.',
    keyInsights: [
      'Mean time to detect (MTTD) reduced from 4.2hrs to 1.8hrs with new SIEM deployment',
      'Ransomware tabletop exercise completed with 94% team readiness score',
      'Regulatory compliance maintained across SOC 2, GDPR, and CCPA frameworks'
    ],
    confidenceLevel: 91,
    createdAt: '2026-02-03T11:15:00Z'
  },
  {
    id: 'br-004',
    title: 'Digital Transformation Progress — Phase 3 Readiness',
    briefingType: 'Strategic Initiative',
    timeToDecision: '72h window',
    reviewed: false,
    executiveSummary: 'Phase 2 of the enterprise digital transformation completed on budget ($4.2M of $4.5M allocated). AI-powered workflow automation deployed across 6 business units, reducing manual processing time by 62%. Phase 3 planning underway with focus on predictive analytics and customer experience optimization.',
    keyInsights: [
      'Employee adoption of new digital tools reached 88%, exceeding 80% target',
      'Process automation ROI of 340% realized within first 6 months of deployment',
      'Customer-facing AI chatbot handling 73% of Tier 1 support inquiries autonomously'
    ],
    confidenceLevel: 87,
    createdAt: '2026-02-10T16:45:00Z'
  }
];

const demoBoardReports = [
  {
    id: 'rpt-001',
    title: 'FY2025 Annual Board Report — Strategic Execution Review',
    reportType: 'Annual Review',
    reportingPeriod: 'FY2025',
    approvedBy: 'Board of Directors',
    executiveSummary: 'FY2025 closed with record revenue of $52.8M (31% YoY growth), surpassing guidance. All four strategic pillars delivered measurable outcomes. The organization achieved a 94% strategic initiative completion rate, up from 71% in FY2024.',
    presentedAt: '2026-01-28T10:00:00Z'
  },
  {
    id: 'rpt-002',
    title: 'Q1 2026 Board Deck — Growth Acceleration & Market Expansion',
    reportType: 'Quarterly Board Deck',
    reportingPeriod: 'Q1 2026',
    approvedBy: null,
    executiveSummary: 'Q1 pipeline grew 44% QoQ with expansion into EMEA and APAC markets. Two enterprise logos ($1M+ ACV) signed in January. Board approval requested for $6.2M Series B extension to accelerate GTM hiring and product development.',
    presentedAt: null
  },
  {
    id: 'rpt-003',
    title: 'Risk & Compliance Board Summary — February 2026',
    reportType: 'Compliance Report',
    reportingPeriod: 'Feb 2026',
    approvedBy: 'Audit Committee',
    executiveSummary: 'All regulatory compliance frameworks current. Enterprise risk register reviewed with 2 items escalated from "watch" to "monitor" status related to supply chain concentration. Insurance coverage adequate per annual review.',
    presentedAt: '2026-02-05T14:00:00Z'
  }
];

export default function BoardBriefings() {
  const { data: briefingsData, isLoading: briefingsLoading } = useQuery<any[]>({
    queryKey: ['/api/executive-briefings'],
  });

  const { data: boardReportsData, isLoading: reportsLoading } = useQuery<any[]>({
    queryKey: ['/api/board-reports'],
  });

  const briefings = (briefingsData && briefingsData.length > 0) ? briefingsData : demoBriefings;
  const boardReports = (boardReportsData && boardReportsData.length > 0) ? boardReportsData : demoBoardReports;
  const acknowledgedBriefings = briefings.filter((b: any) => b.reviewed);

  return (
    <PageLayout>
      <div className="space-y-6 p-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="page-title" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <FileText className="h-8 w-8 text-[#0A0F2E] dark:text-[#C9A84C]" />
            Board Briefings
          </h1>
          <p className="text-[#6B7280] dark:text-white/60 mt-1">
            Automated executive reports with evidence traceability for board presentations
          </p>
        </div>
        <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" data-testid="button-generate-briefing">
          <FileText className="h-4 w-4 mr-2" />
          Generate New Briefing
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10" data-testid="card-total-briefings">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280] dark:text-white/60 uppercase tracking-wider">Total Briefings</CardTitle>
            <FileText className="h-4 w-4 text-[#0A0F2E] dark:text-[#C9A84C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{briefings.length}</div>
            <p className="text-xs text-[#6B7280] dark:text-white/60">
              Executive intelligence summaries
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10" data-testid="card-board-reports">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280] dark:text-white/60 uppercase tracking-wider">Board Reports</CardTitle>
            <Award className="h-4 w-4 text-[#C9A84C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{boardReports.length}</div>
            <p className="text-xs text-[#6B7280] dark:text-white/60">
              Quarterly board presentations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10" data-testid="card-reviewed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280] dark:text-white/60 uppercase tracking-wider">Reviewed</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{acknowledgedBriefings.length}</div>
            <p className="text-xs text-[#6B7280] dark:text-white/60">
              Acknowledged by executives
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10" data-testid="card-avg-confidence">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#6B7280] dark:text-white/60 uppercase tracking-wider">Avg Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#0A0F2E] dark:text-[#C9A84C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {briefings.length > 0 
                ? Math.round(briefings.reduce((acc: number, b: any) => acc + (b.confidenceLevel || 85), 0) / briefings.length)
                : 85}%
            </div>
            <p className="text-xs text-[#6B7280] dark:text-white/60">
              AI-generated insights
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Executive Briefings */}
      <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
        <CardHeader>
          <CardTitle style={{ fontFamily: "'Cormorant Garamond', serif" }}>Executive Briefings</CardTitle>
          <CardDescription className="text-[#6B7280] dark:text-white/60">
            AI-generated daily intelligence, crisis alerts, and decision support summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {briefingsLoading ? (
            <div className="text-center py-8 text-[#6B7280] dark:text-white/60">Loading briefings...</div>
          ) : (
            <div className="space-y-4">
              {briefings.map((briefing: any) => (
                <div 
                  key={briefing.id} 
                  className="border border-[#E8E4DC] dark:border-white/10 rounded-lg p-4 space-y-3 bg-[#F8F7F4] dark:bg-white/5"
                  data-testid={`briefing-${briefing.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#0A0F2E] dark:text-white" data-testid={`text-briefing-title-${briefing.id}`}>{briefing.title}</h3>
                        <Badge variant="outline" className="border-[#0A0F2E]/30 text-[#0A0F2E] dark:border-white/20 dark:text-white">{briefing.briefingType}</Badge>
                        {briefing.timeToDecision && (
                          <Badge variant="secondary" className="bg-[#C9A84C]/20 text-[#C9A84C] border-none">{briefing.timeToDecision}</Badge>
                        )}
                        {briefing.reviewed && (
                          <CheckCircle className="h-5 w-5 text-[#2B8A6E]" />
                        )}
                      </div>
                      <p className="text-sm text-[#0A0F2E] dark:text-white/80">{briefing.executiveSummary}</p>
                      
                      {briefing.keyInsights && briefing.keyInsights.length > 0 && (
                        <div className="bg-[#0A0F2E]/5 dark:bg-[#0A0F2E]/40 p-3 rounded-md border border-[#0A0F2E]/10">
                          <p className="text-sm font-medium mb-1 text-[#0A0F2E] dark:text-[#C9A84C]">Key Insights:</p>
                          <ul className="list-disc list-inside text-sm text-[#6B7280] dark:text-white/60">
                            {(briefing.keyInsights as any[]).slice(0, 3).map((insight: string, idx: number) => (
                              <li key={idx}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-[#6B7280] dark:text-white/60">
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
                      <Button size="sm" variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E] dark:border-white/20 dark:text-white hover:bg-[#0A0F2E]/5 dark:hover:bg-white/5" data-testid={`button-view-briefing-${briefing.id}`} style={{ color: "#0A0F2E" }}>
                        View Full
                      </Button>
                      <Button size="sm" variant="ghost" className="text-[#0A0F2E] dark:text-white hover:bg-[#0A0F2E]/5 dark:hover:bg-white/5" data-testid={`button-download-briefing-${briefing.id}`} style={{ color: "#0A0F2E" }}>
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

      {/* Key Decisions Pending */}
      <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Decisions Requiring Board Action
          </CardTitle>
          <CardDescription className="text-[#6B7280] dark:text-white/60">Items pending executive approval or board vote</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: 'Approve $6.2M Series B Extension', due: 'March 15', priority: 'High', status: 'Pending Vote' },
              { title: 'APAC Market Entry Authorization', due: 'March 22', priority: 'Medium', status: 'Under Review' },
              { title: 'AI Governance Policy Update', due: 'April 1', priority: 'High', status: 'Draft' },
            ].map((decision) => (
              <div
                key={decision.title}
                className={`border rounded-lg p-4 space-y-2 bg-[#F8F7F4] dark:bg-white/5 ${
                  decision.priority === 'High'
                    ? 'border-l-4 border-l-[#0A0F2E] border-[#E8E4DC] dark:border-white/10'
                    : 'border-l-4 border-l-[#C9A84C] border-[#E8E4DC] dark:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#0A0F2E] dark:text-white">{decision.title}</h3>
                  <Badge className={
                    decision.status === 'Pending Vote' ? 'bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20' :
                    decision.status === 'Under Review' ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20' :
                    'bg-[#0A0F2E]/10 text-[#0A0F2E] dark:bg-white/10 dark:text-white border-none'
                  }>{decision.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6B7280] dark:text-white/60">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Due: {decision.due}
                  </span>
                  <Badge variant="outline" className={
                    decision.priority === 'High' ? 'border-[#0A0F2E]/30 text-[#0A0F2E]' : 'border-[#C9A84C]/30 text-[#C9A84C]'
                  }>{decision.priority} Priority</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <Brain className="h-5 w-5 text-[#C9A84C]" />
              AI-Generated Strategic Recommendations
            </CardTitle>
            <Badge className="bg-[#0A0F2E]/10 text-[#0A0F2E] dark:bg-[#C9A84C]/20 dark:text-[#C9A84C] border-none text-xs font-semibold">
              <SubBrandLabel name="Retrospect™" />
            </Badge>
          </div>
          <CardDescription className="text-[#6B7280] dark:text-white/60">Data-driven recommendations based on cross-functional intelligence analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Accelerate EMEA Expansion',
                description: 'Pipeline data suggests 44% QoQ growth. Recommend increasing GTM investment by 30% in Q2.',
                confidence: 91,
                icon: <TrendingUp className="h-5 w-5 text-[#2B8A6E]" />,
              },
              {
                title: 'Strengthen Supply Chain Redundancy',
                description: 'Single-region dependency risk identified for 3 critical components. Recommend activating backup supplier framework.',
                confidence: 87,
                icon: <Target className="h-5 w-5 text-[#C9A84C]" />,
              },
              {
                title: 'Increase Practice Drill Frequency',
                description: 'Teams with monthly drills show 23% faster response times. Current cadence is quarterly.',
                confidence: 94,
                icon: <Zap className="h-5 w-5 text-[#0A0F2E] dark:text-white" />,
              },
            ].map((rec) => (
              <Card key={rec.title} className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center gap-2">
                    {rec.icon}
                    <h3 className="font-semibold text-sm text-[#0A0F2E] dark:text-white">{rec.title}</h3>
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-white/60">{rec.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#E8E4DC] dark:bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-[#C9A84C] h-1.5 rounded-full"
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#C9A84C]">{rec.confidence}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Board Reports */}
      <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
        <CardHeader>
          <CardTitle style={{ fontFamily: "'Cormorant Garamond', serif" }}>Quarterly Board Reports</CardTitle>
          <CardDescription className="text-[#6B7280] dark:text-white/60">
            Comprehensive performance dashboards and strategic updates for board presentations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="text-center py-8 text-[#6B7280] dark:text-white/60">Loading board reports...</div>
          ) : (
            <div className="space-y-4">
              {boardReports.map((report: any) => (
                <div 
                  key={report.id} 
                  className="border border-[#E8E4DC] dark:border-white/10 rounded-lg p-4 space-y-3 bg-[#F8F7F4] dark:bg-white/5"
                  data-testid={`report-${report.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#0A0F2E] dark:text-white" data-testid={`text-report-title-${report.id}`}>{report.title}</h3>
                        <Badge variant="outline" className="border-[#0A0F2E]/30 text-[#0A0F2E] dark:border-white/20 dark:text-white">{report.reportType}</Badge>
                        <Badge className="bg-[#0A0F2E] text-white border-none">{report.reportingPeriod}</Badge>
                        {report.approvedBy && (
                          <CheckCircle className="h-5 w-5 text-[#2B8A6E]" />
                        )}
                      </div>
                      <p className="text-sm text-[#0A0F2E] dark:text-white/80">{report.executiveSummary}</p>
                      
                      {report.presentedAt && (
                        <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-white/60">
                          <Calendar className="h-4 w-4" />
                          <span>Presented: {new Date(report.presentedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" data-testid={`button-view-report-${report.id}`}>
                        View Report
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E] hover:bg-[#0A0F2E]/5" data-testid={`button-export-report-${report.id}`}>
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
