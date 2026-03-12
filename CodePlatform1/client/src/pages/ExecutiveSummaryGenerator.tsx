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

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const reportTypes = [
  {
    id: 'strategic-overview',
    label: 'Strategic Overview',
    description: 'Comprehensive strategic position assessment with IDEA Framework status',
    icon: BarChart3,
    color: 'text-[#0A0F2E]',
    bgColor: 'bg-[#F8F7F4]',
    borderColor: 'border-[#E8E4DC]'
  },
  {
    id: 'crisis-readiness',
    label: 'Crisis Readiness Report',
    description: 'Preparedness scoring, domain coverage, and drill assessment',
    icon: Shield,
    color: 'text-[#C9A84C]',
    bgColor: 'bg-[#F8F7F4]',
    borderColor: 'border-[#E8E4DC]'
  },
  {
    id: 'competitive-intelligence',
    label: 'Competitive Intelligence Brief',
    description: 'Market signals, competitor activity, and opportunity windows',
    icon: Target,
    color: 'text-[#2B8A6E]',
    bgColor: 'bg-[#F8F7F4]',
    borderColor: 'border-[#E8E4DC]'
  },
  {
    id: 'transformation-progress',
    label: 'Transformation Progress',
    description: 'Initiative scorecard, milestones, and board-ready metrics',
    icon: TrendingUp,
    color: 'text-[#0A0F2E]',
    bgColor: 'bg-[#F8F7F4]',
    borderColor: 'border-[#E8E4DC]'
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
              body { font-family: 'Georgia', serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #0A0F2E; line-height: 1.6; background: #fff; }
              h1 { font-family: 'Cormorant Garamond', serif; font-size: 32px; border-bottom: 2px solid #C9A84C; padding-bottom: 8px; color: #0A0F2E; }
              h2 { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #0A0F2E; margin-top: 24px; border-left: 4px solid #C9A84C; padding-left: 12px; }
              h3 { font-family: 'Cormorant Garamond', serif; font-size: 18px; margin-top: 16px; color: #0A0F2E; }
              table { width: 100%; border-collapse: collapse; margin: 24px 0; }
              th, td { border: 1px solid #E8E4DC; padding: 12px; text-align: left; font-size: 14px; }
              th { background: #F8F7F4; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #6B7280; }
              ul, ol { padding-left: 20px; }
              li { margin: 8px 0; }
              .meta { color: #6B7280; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 48px; border-top: 1px solid #E8E4DC; padding-top: 16px; }
              strong { color: #0A0F2E; font-weight: 700; }
            </style>
          </head>
          <body>
            ${generatedSummary.replace(/^## /gm, '<h2>').replace(/^### /gm, '<h3>').replace(/\n/g, '<br>')}
            <div class="meta">
              VaughnMartin Executive Intelligence | ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | ${industry} Sector
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
    a.download = `VaughnMartin-${selectedReport}-${new Date().toISOString().split('T')[0]}.md`;
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
          <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: OFF }}>
                  {tableHeaders.map((h, i) => (
                    <th key={i} style={{ borderColor: BORDER }} className="border px-4 py-3 text-left font-bold uppercase tracking-wider text-[10px] text-gray-500">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#F8F7F4]/50'}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ borderColor: BORDER }} className="border px-4 py-3 text-slate-700">{cell.trim()}</td>
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
          <h2 key={i} style={{ ...CG, fontSize: "24px", fontWeight: 600, color: NAVY }} className="mt-8 mb-4 border-l-4 border-[#C9A84C] pl-4">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} style={{ ...CG, fontSize: "18px", fontWeight: 600, color: NAVY }} className="mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.match(/^\d+\.\s/)) {
        elements.push(
          <div key={i} className="flex gap-3 my-2 ml-2">
            <span style={{ color: GOLD, fontWeight: 700 }} className="min-w-[20px]">{line.match(/^\d+/)![0]}.</span>
            <span className="text-slate-700">{renderInlineFormatting(line.replace(/^\d+\.\s/, ''))}</span>
          </div>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <div key={i} className="flex gap-2 my-1.5 ml-4">
            <span style={{ color: TEAL }} className="mt-1.5">•</span>
            <span className="text-slate-700">{renderInlineFormatting(line.replace('- ', ''))}</span>
          </div>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={i} className="h-3" />);
      } else {
        elements.push(
          <p key={i} className="text-slate-700 my-1.5 leading-relaxed">
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
        return <strong key={i} style={{ color: NAVY, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const selectedReportInfo = reportTypes.find(r => r.id === selectedReport);

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        {/* Navy Header */}
        <div style={{ background: NAVY, padding: "48px 48px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)" }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                Executive Intelligence
              </span>
            </div>
            <h1 style={{ ...CG, color: "#fff", fontSize: "40px", fontWeight: 600, lineHeight: 1.1 }}>
              Summary <em style={{ fontStyle: "italic", color: "#DFC178" }}>Generator</em>
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <Card className="border-[#E8E4DC] bg-white">
                <CardHeader className="pb-3 border-b border-[#E8E4DC]">
                  <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 block">Report Type</Label>
                    <div className="space-y-3">
                      {reportTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedReport(type.id)}
                            style={{ 
                              background: selectedReport === type.id ? "#F8F7F4" : "#fff",
                              borderColor: selectedReport === type.id ? NAVY : BORDER,
                              borderLeft: selectedReport === type.id ? `4px solid ${GOLD}` : `1px solid ${BORDER}`
                            }}
                            className="w-full text-left p-4 rounded-sm border transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${selectedReport === type.id ? 'text-[#0A0F2E]' : 'text-gray-400'}`} />
                              <span style={{ fontSize: "14px", fontWeight: 700, color: NAVY }}>{type.label}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 ml-7 leading-relaxed">{type.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Organization</Label>
                      <Input
                        placeholder="e.g., Global Enterprise Corp"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="bg-[#F8F7F4] border-[#E8E4DC] h-11"
                      />
                    </div>

                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Industry</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="bg-[#F8F7F4] border-[#E8E4DC] h-11">
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
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Timeframe</Label>
                      <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="bg-[#F8F7F4] border-[#E8E4DC] h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframes.map(tf => (
                            <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={() => generateMutation.mutate()}
                    disabled={generateMutation.isPending}
                    style={{ background: NAVY, height: 52, color: "#fff" }}
                    className="w-full font-bold uppercase tracking-widest text-[11px]"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Synthesizing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Intelligence
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {metadata && (
                <Card style={{ background: NAVY }} className="border-none text-white">
                  <CardContent className="p-6">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 20, height: 2, background: GOLD }} />
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Metadata</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white/40 uppercase tracking-wider">Generated</span>
                        <span className="font-bold">{new Date(metadata.generatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white/40 uppercase tracking-wider">Engine</span>
                        <span className="font-bold">Oracle AI v2.4</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2">
              {!generatedSummary && !generateMutation.isPending ? (
                <Card className="border border-dashed border-[#E8E4DC] bg-white h-full min-h-[600px] flex items-center justify-center">
                  <CardContent className="text-center p-12">
                    <div style={{ width: 64, height: 64, background: "#F8F7F4", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <FileText className="w-8 h-8 text-[#E8E4DC]" />
                    </div>
                    <h3 style={{ ...CG, fontSize: "24px", color: NAVY }}>Awaiting Intelligence Parameters</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2 mb-8">
                      Configure your parameters to generate a board-ready strategic summary.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge style={{ background: "#F8F7F4", color: "#6B7280", border: "1px solid #E8E4DC" }} className="text-[9px] font-bold uppercase tracking-widest">IDEA Framework</Badge>
                      <Badge style={{ background: "#F8F7F4", color: "#6B7280", border: "1px solid #E8E4DC" }} className="text-[9px] font-bold uppercase tracking-widest">C-Suite Ready</Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : generateMutation.isPending ? (
                <Card className="border-[#E8E4DC] bg-white h-full min-h-[600px] flex items-center justify-center">
                  <CardContent className="text-center p-12">
                    <div className="animate-pulse mb-8">
                      <Sparkles style={{ width: 64, height: 64, color: GOLD, margin: "0 auto" }} />
                    </div>
                    <h3 style={{ ...CG, fontSize: "24px", color: NAVY }}>Synthesizing Domain Intelligence</h3>
                    <p className="text-gray-400 text-sm mt-2">AI is processing platform telemetry and strategic patterns...</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-[#E8E4DC] bg-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#E8E4DC] p-6">
                    <div className="flex items-center gap-4">
                      {selectedReportInfo && (
                        <div style={{ width: 40, height: 40, background: NAVY, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <selectedReportInfo.icon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>{selectedReportInfo?.label}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {organizationName || 'Strategic Entity'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {industry}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="h-9 border-[#E8E4DC] text-[10px] font-bold uppercase tracking-widest">
                        {copied ? <Check className="w-3.5 h-3.5 mr-2 text-[#2B8A6E]" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload} className="h-9 border-[#E8E4DC] text-[10px] font-bold uppercase tracking-widest">
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePrint} className="h-9 border-[#E8E4DC] text-[10px] font-bold uppercase tracking-widest">
                        <Printer className="w-3.5 h-3.5 mr-2" />
                        Print
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-12">
                    <div className="max-w-none">
                      {generatedSummary && renderMarkdown(generatedSummary)}
                    </div>
                    <div className="mt-16 pt-8 border-t border-[#E8E4DC]">
                      <p className="text-center text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Confidential Strategic Report • Generated by VaughnMartin Oracle AI
                      </p>
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
