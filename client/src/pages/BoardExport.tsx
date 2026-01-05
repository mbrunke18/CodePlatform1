import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText,
  Download,
  Clock,
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Building2,
  Target,
  Zap,
  Eye,
  Loader2
} from 'lucide-react';
import { useLocation } from 'wouter';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';

interface ExportSection {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  included: boolean;
}

const SAMPLE_DATA = {
  organization: 'Meridian Industries',
  reportDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  quarter: 'Q4 2025',
  preparedBy: 'M Strategic Execution Platform',
  
  executiveSummary: {
    overallReadiness: 87,
    activeScenarios: 3,
    resolvedThisQuarter: 12,
    avgResponseTime: '11m 47s',
    budgetUtilization: 78,
  },
  
  activeScenarios: [
    { id: 1, name: 'Supply Chain Disruption - Asia Pacific', severity: 'High', status: 'Monitoring', daysActive: 14, stakeholders: 8 },
    { id: 2, name: 'Competitive Response - Market Entry', severity: 'Medium', status: 'Executing', daysActive: 3, stakeholders: 6 },
    { id: 3, name: 'Regulatory Compliance - GDPR Update', severity: 'Low', status: 'Planning', daysActive: 7, stakeholders: 4 },
  ],
  
  responseMetrics: {
    avgDecisionTime: '12 min',
    avgExecutionTime: '87 min',
    stakeholderResponseRate: 94,
    playboookActivations: 15,
    tasksCompleted: 847,
    blockerResolution: '8 min avg',
  },
  
  financialSummary: {
    budgetAllocated: 2500000,
    budgetUsed: 1950000,
    revenueProtected: 47000000,
    costAvoided: 12000000,
    roiThisQuarter: 312,
  },
  
  stakeholderCoverage: [
    { department: 'Executive', coverage: 100, trained: 8, total: 8 },
    { department: 'Legal', coverage: 92, trained: 11, total: 12 },
    { department: 'Finance', coverage: 88, trained: 14, total: 16 },
    { department: 'Operations', coverage: 85, trained: 34, total: 40 },
    { department: 'Communications', coverage: 100, trained: 6, total: 6 },
    { department: 'IT/Security', coverage: 95, trained: 19, total: 20 },
  ],
  
  playbookReadiness: [
    { domain: 'Crisis Management', playbooks: 24, readiness: 92, lastDrill: '2 weeks ago' },
    { domain: 'Competitive Response', playbooks: 18, readiness: 88, lastDrill: '1 month ago' },
    { domain: 'M&A Integration', playbooks: 12, readiness: 75, lastDrill: '3 months ago' },
    { domain: 'Regulatory Compliance', playbooks: 20, readiness: 94, lastDrill: '1 week ago' },
    { domain: 'Cyber Security', playbooks: 16, readiness: 91, lastDrill: '2 weeks ago' },
    { domain: 'Market Entry', playbooks: 14, readiness: 82, lastDrill: '6 weeks ago' },
  ],
  
  recommendations: [
    { priority: 'High', recommendation: 'Conduct M&A integration drill before Q1 acquisition', owner: 'COO', dueDate: 'Jan 15, 2026' },
    { priority: 'Medium', recommendation: 'Update Asia Pacific supply chain playbooks with new vendors', owner: 'VP Supply Chain', dueDate: 'Jan 30, 2026' },
    { priority: 'Low', recommendation: 'Schedule competitive response refresher training', owner: 'Chief Strategy Officer', dueDate: 'Feb 15, 2026' },
  ],
};

export default function BoardExport() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'pptx' | 'docx'>('pdf');
  
  const [sections, setSections] = useState<ExportSection[]>([
    { id: 'executive_summary', label: 'Executive Summary', description: 'Overall readiness score, active scenarios, key metrics', icon: <Target className="h-5 w-5" />, included: true },
    { id: 'active_scenarios', label: 'Active Scenarios', description: 'Current strategic events and their status', icon: <AlertTriangle className="h-5 w-5" />, included: true },
    { id: 'response_metrics', label: 'Response Metrics', description: 'Decision time, execution time, stakeholder engagement', icon: <Clock className="h-5 w-5" />, included: true },
    { id: 'financial_summary', label: 'Financial Summary', description: 'Budget utilization, revenue protected, ROI', icon: <DollarSign className="h-5 w-5" />, included: true },
    { id: 'stakeholder_coverage', label: 'Stakeholder Coverage', description: 'Department-level training and readiness', icon: <Users className="h-5 w-5" />, included: true },
    { id: 'playbook_readiness', label: 'Playbook Readiness', description: 'Domain-specific playbook status and drill dates', icon: <Shield className="h-5 w-5" />, included: true },
    { id: 'recommendations', label: 'Recommendations', description: 'Action items and next steps for leadership', icon: <Zap className="h-5 w-5" />, included: true },
  ]);

  const toggleSection = (sectionId: string) => {
    setSections(current =>
      current.map(s => s.id === sectionId ? { ...s, included: !s.included } : s)
    );
  };

  const handleExport = async () => {
    setIsGenerating(true);
    
    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const includedSections = sections.filter(s => s.included).map(s => s.label);
    
    toast({
      title: 'Board Report Generated',
      description: `${exportFormat.toUpperCase()} export with ${includedSections.length} sections is ready for download.`,
    });
    
    setIsGenerating(false);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <StandardNav />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <FileText className="h-4 w-4 mr-2" />
              Board-Ready Export
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">
              Executive Briefing Generator
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Generate comprehensive board-ready reports showing strategic readiness, 
              active scenarios, and response metrics—in one click.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    Report Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Export Format</Label>
                    <Select value={exportFormat} onValueChange={(v: 'pdf' | 'pptx' | 'docx') => setExportFormat(v)}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white" data-testid="select-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
                        <SelectItem value="docx">Word Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Report Period</Label>
                    <div className="text-white bg-slate-800 rounded-md px-3 py-2 border border-slate-700">
                      {SAMPLE_DATA.quarter}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <Label className="text-slate-300 mb-3 block">Include Sections</Label>
                    <div className="space-y-3">
                      {sections.map((section) => (
                        <div 
                          key={section.id}
                          className="flex items-start gap-3 p-2 rounded hover:bg-slate-800/50 transition-colors"
                        >
                          <Checkbox
                            id={section.id}
                            checked={section.included}
                            onCheckedChange={() => toggleSection(section.id)}
                            className="mt-0.5"
                            data-testid={`checkbox-${section.id}`}
                          />
                          <div className="flex-1">
                            <Label 
                              htmlFor={section.id}
                              className="text-white cursor-pointer flex items-center gap-2"
                            >
                              <span className="text-slate-400">{section.icon}</span>
                              {section.label}
                            </Label>
                            <div className="text-xs text-slate-500">{section.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleExport}
                disabled={isGenerating || sections.filter(s => s.included).length === 0}
                data-testid="button-generate-report"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Generate Board Report
                  </>
                )}
              </Button>
            </div>

            {/* Right Column - Preview */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Eye className="h-5 w-5 text-slate-400" />
                        Report Preview
                      </CardTitle>
                      <CardDescription>
                        {SAMPLE_DATA.organization} • {SAMPLE_DATA.quarter}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-slate-400">
                      {sections.filter(s => s.included).length} sections selected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6 max-h-[700px] overflow-y-auto">
                  {/* Executive Summary */}
                  {sections.find(s => s.id === 'executive_summary')?.included && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-violet-400" />
                        Executive Summary
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 rounded-lg p-4 text-center border border-green-500/20">
                          <div className="text-3xl font-bold text-green-400">{SAMPLE_DATA.executiveSummary.overallReadiness}%</div>
                          <div className="text-sm text-slate-400">Overall Readiness</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-blue-400">{SAMPLE_DATA.executiveSummary.activeScenarios}</div>
                          <div className="text-sm text-slate-400">Active Scenarios</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-amber-400">{SAMPLE_DATA.executiveSummary.avgResponseTime}</div>
                          <div className="text-sm text-slate-400">Avg Response Time</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Scenarios */}
                  {sections.find(s => s.id === 'active_scenarios')?.included && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        Active Scenarios
                      </h3>
                      <div className="space-y-2">
                        {SAMPLE_DATA.activeScenarios.map((scenario) => (
                          <div 
                            key={scenario.id}
                            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Badge className={
                                scenario.severity === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                scenario.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                'bg-green-500/20 text-green-400 border-green-500/30'
                              }>
                                {scenario.severity}
                              </Badge>
                              <span className="text-white">{scenario.name}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span>{scenario.stakeholders} stakeholders</span>
                              <Badge variant="outline">{scenario.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Response Metrics */}
                  {sections.find(s => s.id === 'response_metrics')?.included && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-400" />
                        Response Metrics
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-white">{SAMPLE_DATA.responseMetrics.avgDecisionTime}</div>
                          <div className="text-xs text-slate-500">Avg Decision Time</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-white">{SAMPLE_DATA.responseMetrics.avgExecutionTime}</div>
                          <div className="text-xs text-slate-500">Avg Execution Time</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-green-400">{SAMPLE_DATA.responseMetrics.stakeholderResponseRate}%</div>
                          <div className="text-xs text-slate-500">Response Rate</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Summary */}
                  {sections.find(s => s.id === 'financial_summary')?.included && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        Financial Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-sm text-slate-400 mb-1">Revenue Protected</div>
                          <div className="text-2xl font-bold text-green-400">{formatCurrency(SAMPLE_DATA.financialSummary.revenueProtected)}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-sm text-slate-400 mb-1">Cost Avoided</div>
                          <div className="text-2xl font-bold text-green-400">{formatCurrency(SAMPLE_DATA.financialSummary.costAvoided)}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-sm text-slate-400 mb-1">Budget Utilization</div>
                          <div className="text-2xl font-bold text-blue-400">
                            {formatCurrency(SAMPLE_DATA.financialSummary.budgetUsed)} / {formatCurrency(SAMPLE_DATA.financialSummary.budgetAllocated)}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 rounded-lg p-3 border border-green-500/20">
                          <div className="text-sm text-slate-400 mb-1">Quarterly ROI</div>
                          <div className="text-2xl font-bold text-green-400">{SAMPLE_DATA.financialSummary.roiThisQuarter}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Playbook Readiness */}
                  {sections.find(s => s.id === 'playbook_readiness')?.included && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-400" />
                        Playbook Readiness by Domain
                      </h3>
                      <div className="space-y-2">
                        {SAMPLE_DATA.playbookReadiness.map((domain) => (
                          <div 
                            key={domain.domain}
                            className="flex items-center justify-between p-2 bg-slate-800/30 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-white text-sm">{domain.domain}</span>
                              <Badge variant="outline" className="text-xs text-slate-400">
                                {domain.playbooks} playbooks
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-500">Drill: {domain.lastDrill}</span>
                              <Badge className={
                                domain.readiness >= 90 ? 'bg-green-500/20 text-green-400' :
                                domain.readiness >= 80 ? 'bg-blue-500/20 text-blue-400' :
                                'bg-amber-500/20 text-amber-400'
                              }>
                                {domain.readiness}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {sections.find(s => s.id === 'recommendations')?.included && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-400" />
                        Recommendations
                      </h3>
                      <div className="space-y-2">
                        {SAMPLE_DATA.recommendations.map((rec, idx) => (
                          <div 
                            key={idx}
                            className="p-3 bg-slate-800/30 rounded-lg border-l-4 border-l-amber-500"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <Badge className={
                                  rec.priority === 'High' ? 'bg-red-500/20 text-red-400 mb-2' :
                                  rec.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400 mb-2' :
                                  'bg-green-500/20 text-green-400 mb-2'
                                }>
                                  {rec.priority} Priority
                                </Badge>
                                <div className="text-white text-sm">{rec.recommendation}</div>
                              </div>
                              <div className="text-right text-xs text-slate-500">
                                <div>{rec.owner}</div>
                                <div>{rec.dueDate}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
