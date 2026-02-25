import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import {
  FileText,
  Zap,
  Download,
  Copy,
  Check,
  Loader2,
  BarChart3,
  Shield,
  Target,
  TrendingUp,
  Clock,
  Building2,
  Calendar,
  Sparkles,
  Printer
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";

const reportTypes = [
  {
    id: 'strategic-overview',
    label: 'Strategic Overview',
    description: 'Comprehensive strategic position assessment with IDEA Framework status',
    icon: BarChart3,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'crisis-readiness',
    label: 'Crisis Readiness Report',
    description: 'Preparedness scoring, domain coverage, and drill assessment',
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30'
  },
  {
    id: 'competitive-intelligence',
    label: 'Competitive Intelligence Brief',
    description: 'Market signals, competitor activity, and opportunity windows',
    icon: Target,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'transformation-progress',
    label: 'Transformation Progress',
    description: 'Initiative scorecard, milestones, and board-ready metrics',
    icon: TrendingUp,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  }
];

const industries = [
  'Technology', 'Financial Services', 'Healthcare', 'Manufacturing',
  'Energy', 'Retail', 'Pharmaceutical', 'Automotive',
  'Telecommunications', 'Aerospace & Defense'
];

const timeframes = [
  { value: 'current-quarter', label: 'Current Quarter' },
  { value: 'year-to-date', label: 'Year to Date' },
  { value: 'last-90-days', label: 'Last 90 Days' },
  { value: 'next-quarter-outlook', label: 'Next Quarter Outlook' },
  { value: 'annual-review', label: 'Annual Review' }
];

export default function ExecutiveSummaryGenerator() {
  const [selectedReport, setSelectedReport] = useState('strategic-overview');
  const [timeframe, setTimeframe] = useState('current-quarter');
  const [industry, setIndustry] = useState('Technology');
  const [organizationName, setOrganizationName] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/executive-summary/generate', {
        reportType: selectedReport,
        timeframe,
        industry,
        organizationName: organizationName || 'Your Organization'
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedSummary(data.summary);
      setMetadata(data.metadata);
    }
  });

  const handleCopy = async () => {
    if (generatedSummary) {
      await navigator.clipboard.writeText(generatedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && generatedSummary) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Executive Summary - ${reportTypes.find(r => r.id === selectedReport)?.label}</title>
            <style>
              body { font-family: 'Georgia', serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a1a; line-height: 1.6; }
              h1 { font-size: 24px; border-bottom: 2px solid #1a1a1a; padding-bottom: 8px; }
              h2 { font-size: 20px; color: #2563eb; margin-top: 24px; }
              h3 { font-size: 16px; margin-top: 16px; }
              table { width: 100%; border-collapse: collapse; margin: 12px 0; }
              th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; font-size: 14px; }
              th { background: #f3f4f6; font-weight: 600; }
              ul, ol { padding-left: 20px; }
              li { margin: 4px 0; }
              .meta { color: #6b7280; font-size: 12px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 12px; }
              strong { color: #1e3a5f; }
            </style>
          </head>
          <body>
            ${generatedSummary.replace(/^## /gm, '<h2>').replace(/^### /gm, '<h3>').replace(/\n/g, '<br>')}
            <div class="meta">
              Generated by Execution OS Strategic Execution OS | ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | ${industry} Sector
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    if (!generatedSummary) return;
    const blob = new Blob([generatedSummary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Execution OS-${selectedReport}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeaders: string[] = [];

    const flushTable = () => {
      if (tableHeaders.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  {tableHeaders.map((h, i) => (
                    <th key={i} className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-700 dark:text-slate-300">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('|') && line.endsWith('|')) {
        const cells = line.split('|').filter(c => c.trim() !== '');
        if (cells.every(c => /^[-:]+$/.test(c.trim()))) {
          continue;
        }
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.match(/^\d+\.\s/)) {
        elements.push(
          <div key={i} className="flex gap-3 my-1.5 ml-2">
            <span className="text-blue-500 font-bold min-w-[20px]">{line.match(/^\d+/)![0]}.</span>
            <span className="text-slate-700 dark:text-slate-300">{renderInlineFormatting(line.replace(/^\d+\.\s/, ''))}</span>
          </div>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <div key={i} className="flex gap-2 my-1 ml-4">
            <span className="text-blue-400 mt-1.5">•</span>
            <span className="text-slate-700 dark:text-slate-300">{renderInlineFormatting(line.replace('- ', ''))}</span>
          </div>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i} className="text-slate-700 dark:text-slate-300 my-1 leading-relaxed">
            {renderInlineFormatting(line)}
          </p>
        );
      }
    }

    if (inTable) flushTable();

    return elements;
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const selectedReportInfo = reportTypes.find(r => r.id === selectedReport);

  return (
    <PageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Executive Summary Generator</h1>
              <p className="text-gray-800 dark:text-slate-300">One-click AI-powered executive reports for strategic decision-making</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Report Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Report Type</Label>
                    <div className="space-y-2">
                      {reportTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedReport(type.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedReport === type.id
                                ? `${type.borderColor} ${type.bgColor} ring-1 ring-offset-0`
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${type.color}`} />
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{type.label}</span>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-slate-400 mt-1 ml-6">{type.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                      <Building2 className="w-3.5 h-3.5 inline mr-1" />
                      Organization Name
                    </Label>
                    <Input
                      placeholder="e.g., Acme Corp"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      className="bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                      <Target className="w-3.5 h-3.5 inline mr-1" />
                      Industry
                    </Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="bg-white dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(ind => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />
                      Timeframe
                    </Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="bg-white dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframes.map(tf => (
                          <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => generateMutation.mutate()}
                    disabled={generateMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-gray-900 font-semibold py-5"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Executive Summary
                      </>
                    )}
                  </Button>

                  {generateMutation.isPending && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        AI is analyzing strategic data...
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full animate-pulse" style={{ width: '70%' }} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {metadata && (
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Report Metadata</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-slate-400">Generated</span>
                        <span className="text-slate-700 dark:text-slate-300">{new Date(metadata.generatedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-slate-400">Report Type</span>
                        <BrandStamp variant="dual" size="md" className="mb-8" />
                        <Badge variant="outline" className="text-xs">{selectedReportInfo?.label}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-slate-400">Industry</span>
                        <span className="text-slate-700 dark:text-slate-300">{metadata.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-slate-400">AI Model</span>
                        <Badge variant="outline" className="text-xs">{metadata.model === 'fallback' ? 'Template' : 'GPT-5'}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2">
              {!generatedSummary && !generateMutation.isPending ? (
                <Card className="border border-dashed border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 h-full min-h-[500px] flex items-center justify-center">
                  <CardContent className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Ready to Generate</h3>
                    <p className="text-gray-700 dark:text-slate-400 max-w-sm mx-auto mb-6">
                      Select a report type, configure your parameters, and click generate. Your AI-powered executive summary will appear here.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="outline" className="text-xs">170 Playbooks</Badge>
                      <Badge variant="outline" className="text-xs">9 Strategic Domains</Badge>
                      <Badge variant="outline" className="text-xs">IDEA Framework</Badge>
                      <Badge variant="outline" className="text-xs">C-Suite Ready</Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : generateMutation.isPending ? (
                <Card className="border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 h-full min-h-[500px] flex items-center justify-center">
                  <CardContent className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/10 rounded-2xl flex items-center justify-center animate-pulse">
                      <Sparkles className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Generating Your Report</h3>
                    <p className="text-gray-700 dark:text-slate-400 max-w-sm mx-auto mb-4">
                      AI is synthesizing strategic intelligence across your configured parameters...
                    </p>
                    <div className="space-y-3 max-w-xs mx-auto">
                      {['Analyzing strategic position', 'Processing domain intelligence', 'Compiling executive insights', 'Formatting report'].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      {selectedReportInfo && (
                        <div className={`w-8 h-8 rounded-lg ${selectedReportInfo.bgColor} flex items-center justify-center`}>
                          <selectedReportInfo.icon className={`w-4 h-4 ${selectedReportInfo.color}`} />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">{selectedReportInfo?.label}</CardTitle>
                        <p className="text-xs text-gray-700 dark:text-slate-400">
                          {organizationName || 'Your Organization'} • {industry} • {timeframes.find(t => t.value === timeframe)?.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                        {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs">
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
                        <Printer className="w-3.5 h-3.5 mr-1" />
                        Print
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      {generatedSummary && renderMarkdown(generatedSummary)}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}