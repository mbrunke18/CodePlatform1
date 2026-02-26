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
import { BrandStamp } from "@/components/BrandStamp";

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
  quarter: 'Q4 2026',
  preparedBy: 'Execution OS Strategic Execution Platform',
  
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
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
      <StandardNav />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <Badge className="mb-4 bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30">
              <FileText className="h-4 w-4 mr-2" />
              Board-Ready Export
            </Badge>
            <h1 className="text-4xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Executive Briefing Generator
            </h1>
            <p className="text-xl text-[#6B7280] dark:text-white/80 max-w-2xl mx-auto">
              Generate comprehensive board-ready reports showing strategic readiness, 
              active scenarios, and response metrics—in one click.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Building2 className="h-5 w-5 text-[#C9A84C]" />
                    Report Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[#0A0F2E] dark:text-white">Export Format</Label>
                    <Select value={exportFormat} onValueChange={(v: 'pdf' | 'pptx' | 'docx') => setExportFormat(v)}>
                      <SelectTrigger className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-white" data-testid="select-format">
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
                    <Label className="text-[#0A0F2E] dark:text-white">Report Period</Label>
                    <div className="text-[#0A0F2E] dark:text-white bg-[#F8F7F4] dark:bg-white/5 rounded-md px-3 py-2 border border-[#E8E4DC] dark:border-white/10">
                      {SAMPLE_DATA.quarter}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E4DC] dark:border-white/10">
                    <Label className="text-[#0A0F2E] dark:text-white mb-3 block">Include Sections</Label>
                    <div className="space-y-3">
                      {sections.map((section) => (
                        <div 
                          key={section.id}
                          className="flex items-start gap-3 p-2 rounded hover:bg-[#F8F7F4] dark:hover:bg-white/5 transition-colors"
                        >
                          <Checkbox
                            id={section.id}
                            checked={section.included}
                            onCheckedChange={() => toggleSection(section.id)}
                            className="mt-0.5 border-[#E8E4DC] data-[state=checked]:bg-[#2B8A6E] data-[state=checked]:border-[#2B8A6E]"
                            data-testid={`checkbox-${section.id}`}
                          />
                          <div className="flex-1">
                            <Label 
                              htmlFor={section.id}
                              className="text-[#0A0F2E] dark:text-white cursor-pointer flex items-center gap-2"
                            >
                              <span className="text-[#C9A84C]">{section.icon}</span>
                              {section.label}
                            </Label>
                            <div className="text-xs text-[#6B7280] dark:text-white/60">{section.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                size="lg" 
                className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white"
                onClick={handleExport}
                disabled={isGenerating || sections.filter(s => s.included).length === 0}
                data-testid="button-generate-report"
                style={{ background: "#0A0F2E" }}
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
              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardHeader className="border-b border-[#E8E4DC] dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <Eye className="h-5 w-5 text-[#C9A84C]" />
                        Report Preview
                      </CardTitle>
                      <CardDescription className="text-[#6B7280] dark:text-white/60">
                        {SAMPLE_DATA.organization} • {SAMPLE_DATA.quarter}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-transparent text-[#0A0F2E] dark:text-white border-[#E8E4DC] dark:border-white/10">
                      {sections.filter(s => s.included).length} sections selected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6 max-h-[700px] overflow-y-auto">
                  {/* Executive Summary */}
                  {sections.find(s => s.id === 'executive_summary')?.included && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <Target className="h-5 w-5 text-[#C9A84C]" />
                        Executive Summary
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#2B8A6E]/10 rounded-lg p-4 text-center border border-[#2B8A6E]/20">
                          <div className="text-3xl font-bold text-[#2B8A6E]">{SAMPLE_DATA.executiveSummary.overallReadiness}%</div>
                          <div className="text-sm text-[#0A0F2E] dark:text-white/80">Overall Readiness</div>
                        </div>
                        <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-4 text-center border border-[#E8E4DC] dark:border-white/10">
                          <div className="text-3xl font-bold text-[#0A0F2E] dark:text-white">{SAMPLE_DATA.executiveSummary.activeScenarios}</div>
                          <div className="text-sm text-[#0A0F2E] dark:text-white/80">Active Scenarios</div>
                        </div>
                        <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-4 text-center border border-[#E8E4DC] dark:border-white/10">
                          <div className="text-3xl font-bold text-[#C9A84C]">{SAMPLE_DATA.executiveSummary.avgResponseTime}</div>
                          <div className="text-sm text-[#0A0F2E] dark:text-white/80">Avg Response Time</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Scenarios */}
                  {sections.find(s => s.id === 'active_scenarios')?.included && (
                    <div className="space-y-4 pt-4 border-t border-[#E8E4DC] dark:border-white/10">
                      <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <AlertTriangle className="h-5 w-5 text-[#C9A84C]" />
                        Active Scenarios
                      </h3>
                      <div className="space-y-2">
                        {SAMPLE_DATA.activeScenarios.map((scenario) => (
                          <div 
                            key={scenario.id}
                            className="flex items-center justify-between p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <Badge className={
                                scenario.severity === 'High' ? 'bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20' :
                                scenario.severity === 'Medium' ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20' :
                                'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20'
                              }>
                                {scenario.severity}
                              </Badge>
                              <span className="text-[#0A0F2E] dark:text-white">{scenario.name}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[#6B7280] dark:text-white/60">
                              <span>{scenario.stakeholders} stakeholders</span>
                              <Badge variant="outline" className="border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-white">{scenario.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Response Metrics */}
                  {sections.find(s => s.id === 'response_metrics')?.included && (
                    <div className="space-y-4 pt-4 border-t border-[#E8E4DC] dark:border-white/10">
                      <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <Clock className="h-5 w-5 text-[#C9A84C]" />
                        Response Metrics
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-3 text-center border border-[#E8E4DC] dark:border-white/10">
                          <div className="text-xl font-bold text-[#0A0F2E] dark:text-white">{SAMPLE_DATA.responseMetrics.avgDecisionTime}</div>
                          <div className="text-xs text-[#6B7280] dark:text-white/60">Avg Decision Time</div>
                        </div>
                        <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-3 text-center border border-[#E8E4DC] dark:border-white/10">
                          <div className="text-xl font-bold text-[#0A0F2E] dark:text-white">{SAMPLE_DATA.responseMetrics.avgExecutionTime}</div>
                          <div className="text-xs text-[#6B7280] dark:text-white/60">Avg Execution Time</div>
                        </div>
                        <div className="bg-[#2B8A6E]/10 rounded-lg p-3 text-center border border-[#2B8A6E]/20">
                          <div className="text-xl font-bold text-[#2B8A6E]">{SAMPLE_DATA.responseMetrics.stakeholderResponseRate}%</div>
                          <div className="text-xs text-[#0A0F2E] dark:text-white/80">Response Rate</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Summary */}
                  {sections.find(s => s.id === 'financial_summary')?.included && (
                    <div className="space-y-4 pt-4 border-t border-[#E8E4DC] dark:border-white/10">
                      <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <DollarSign className="h-5 w-5 text-[#2B8A6E]" />
                        Financial Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-3 border border-[#E8E4DC] dark:border-white/10">
                          <div className="text-sm text-[#6B7280] dark:text-white/60 mb-1">Revenue Protected</div>
                          <div className="text-2xl font-bold text-[#2B8A6E]">{formatCurrency(SAMPLE_DATA.financialSummary.revenueProtected)}</div>
                        </div>
                        <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-3 border border-[#E8E4DC] dark:border-white/10">
                          <div className="text-sm text-[#6B7280] dark:text-white/60 mb-1">Cost Avoided</div>
                          <div className="text-2xl font-bold text-[#2B8A6E]">{formatCurrency(SAMPLE_DATA.financialSummary.costAvoided)}</div>
                        </div>
                        <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-3 border border-[#E8E4DC] dark:border-white/10">
                          <div className="text-sm text-[#6B7280] dark:text-white/60 mb-1">Budget Utilization</div>
                          <div className="text-2xl font-bold text-[#0A0F2E] dark:text-white">
                            {formatCurrency(SAMPLE_DATA.financialSummary.budgetUsed)} / {formatCurrency(SAMPLE_DATA.financialSummary.budgetAllocated)}
                          </div>
                        </div>
                        <div className="bg-[#2B8A6E]/10 rounded-lg p-3 border border-[#2B8A6E]/20">
                          <div className="text-sm text-[#0A0F2E] dark:text-white/80 mb-1">Quarterly ROI</div>
                          <div className="text-2xl font-bold text-[#2B8A6E]">{SAMPLE_DATA.financialSummary.roiThisQuarter}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Playbook Readiness */}
                  {sections.find(s => s.id === 'playbook_readiness')?.included && (
                    <div className="space-y-4 pt-4 border-t border-[#E8E4DC] dark:border-white/10">
                      <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <Shield className="h-5 w-5 text-[#0A0F2E] dark:text-[#C9A84C]" />
                        Playbook Readiness by Domain
                      </h3>
                      <div className="space-y-2">
                        {SAMPLE_DATA.playbookReadiness.map((domain) => (
                          <div 
                            key={domain.domain}
                            className="flex items-center justify-between p-2 bg-[#F8F7F4] dark:bg-white/5 rounded border border-[#E8E4DC] dark:border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[#0A0F2E] dark:text-white text-sm font-medium">{domain.domain}</span>
                              <Badge variant="outline" className="bg-transparent text-xs text-[#6B7280] dark:text-white/60 border-[#E8E4DC] dark:border-white/10">
                                {domain.playbooks} playbooks
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[#6B7280] dark:text-white/60">Drill: {domain.lastDrill}</span>
                              <Badge className={
                                domain.readiness >= 90 ? 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20' :
                                domain.readiness >= 80 ? 'bg-[#0A0F2E]/10 text-[#0A0F2E] dark:text-white border-[#0A0F2E]/20' :
                                'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20'
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
                    <div className="space-y-4 pt-4 border-t border-[#E8E4DC] dark:border-white/10">
                      <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <Zap className="h-5 w-5 text-[#C9A84C]" />
                        Recommendations
                      </h3>
                      <div className="space-y-2">
                        {SAMPLE_DATA.recommendations.map((rec, idx) => (
                          <div 
                            key={idx}
                            className="p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border-l-4 border-l-[#C9A84C] border border-[#E8E4DC] dark:border-white/10"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <Badge className={
                                  rec.priority === 'High' ? 'bg-[#0A0F2E]/10 text-[#0A0F2E] mb-2' :
                                  rec.priority === 'Medium' ? 'bg-[#C9A84C]/10 text-[#C9A84C] mb-2' :
                                  'bg-[#2B8A6E]/10 text-[#2B8A6E] mb-2'
                                }>
                                  {rec.priority} Priority
                                </Badge>
                                <div className="text-[#0A0F2E] dark:text-white text-sm font-medium">{rec.recommendation}</div>
                              </div>
                              <div className="text-right text-xs text-[#6B7280] dark:text-white/60">
                                <div className="font-semibold text-[#0A0F2E] dark:text-white">{rec.owner}</div>
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
