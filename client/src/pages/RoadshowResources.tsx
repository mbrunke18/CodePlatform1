import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Shield, 
  CheckSquare,
  Copy,
  Check,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import StandardNav from '@/components/layout/StandardNav';
import { useLocation } from 'wouter';

import investorFaqContent from '@/data/ExecuteIQ-Investor-FAQ.md?raw';
import pilotProgramContent from '@/data/ExecuteIQ-Pilot-Program-OnePager.md?raw';
import demoScriptContent from '@/data/ExecuteIQ-Demo-Script-3min.md?raw';
import whyNowContent from '@/data/ExecuteIQ-WhyNow-SlideContent.md?raw';
import competitiveMoatContent from '@/data/ExecuteIQ-Competitive-Moat-TalkingPoints.md?raw';
import checklistContent from '@/data/ExecuteIQ-PreRoadshow-Checklist.md?raw';
import { BrandStamp } from "@/components/BrandStamp";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const KEY_STATS = [
  { label: "Response Time", value: "72h → 12min", color: "text-[#2B8A6E]" },
  { label: "Playbooks", value: "170", color: "text-[#0A0F2E]" },
  { label: "Domains", value: "9", color: "text-[#C9A84C]" },
  { label: "Pilot Price", value: "$75K", color: "text-[#C9A84C]" },
  { label: "Contract Range", value: "$250K-$1.5M", color: "text-[#2B8A6E]" },
  { label: "Seed Target", value: "$2.6M", color: "text-[#0A0F2E]" },
];

const DOCUMENTS = [
  {
    id: 'faq',
    title: 'Investor FAQ',
    description: '20 anticipated questions with crisp answers',
    icon: MessageSquare,
    color: 'bg-[#0A0F2E]',
    badge: '20 Q&As',
    content: investorFaqContent
  },
  {
    id: 'pilot',
    title: 'Pilot Program',
    description: '90-day engagement structure, pricing, success metrics',
    icon: Target,
    color: 'bg-[#2B8A6E]',
    badge: '$75K',
    content: pilotProgramContent
  },
  {
    id: 'demo-script',
    title: 'Demo Script',
    description: '3-minute investor demo with exact talking points',
    icon: Clock,
    color: 'bg-[#C9A84C]',
    badge: '3 min',
    content: demoScriptContent
  },
  {
    id: 'why-now',
    title: 'Why Now',
    description: '3 slides of market timing narrative and data',
    icon: TrendingUp,
    color: 'bg-[#0A0F2E]',
    badge: '3 Slides',
    content: whyNowContent
  },
  {
    id: 'moat',
    title: 'Competitive Moat',
    description: 'Responses to "Why can\'t BigCo build this?"',
    icon: Shield,
    color: 'bg-[#2B8A6E]',
    badge: '5 Moats',
    content: competitiveMoatContent
  },
  {
    id: 'checklist',
    title: 'Pre-Roadshow Checklist',
    description: '75 tasks with priorities and deadlines',
    icon: CheckSquare,
    color: 'bg-[#C9A84C]',
    badge: '75 Tasks',
    content: checklistContent
  },
];

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="prose prose-sm max-w-none">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-light text-[#0A0F2E] mt-8 mb-6" style={CG}>{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-light text-[#0A0F2E] mt-8 mb-4 border-b border-[#E8E4DC] pb-2" style={CG}>{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-bold text-[#2B8A6E] mt-6 mb-3 uppercase tracking-wider">{line.slice(4)}</h3>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={idx} className="font-bold text-[#0A0F2E] my-3">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('> ')) {
          return <blockquote key={idx} className="border-l-4 border-[#C9A84C] pl-6 my-6 text-[#0A0F2E] italic bg-[#F8F7F4] py-4">{line.slice(2)}</blockquote>;
        }
        if (line.startsWith('- [ ] ')) {
          return <div key={idx} className="flex items-start gap-3 my-2 text-[#0A0F2E]"><div className="w-4 h-4 border border-[#E8E4DC] mt-1 shrink-0"></div><span>{line.slice(6)}</span></div>;
        }
        if (line.startsWith('- ')) {
          return <li key={idx} className="text-[#0A0F2E] ml-4 my-2 list-none flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] shrink-0"></span>{line.slice(2)}</li>;
        }
        if (line.startsWith('| ') && line.includes(' | ')) {
          const cells = line.split(' | ').map(c => c.replace(/^\||\|$/g, '').trim());
          const isHeader = lines[idx + 1]?.includes('---');
          return (
            <div key={idx} className={`grid gap-4 py-3 border-b border-[#E8E4DC] ${isHeader ? 'font-bold text-[#0A0F2E] bg-[#F8F7F4]' : 'text-[#0A0F2E]'}`} style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
              {cells.map((cell, i) => <div key={i} className="text-sm px-2">{cell}</div>)}
            </div>
          );
        }
        if (line.includes('|---')) {
          return null;
        }
        if (line.startsWith('---')) {
          return <hr key={idx} className="border-[#E8E4DC] my-10" />;
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-4" />;
        }
        const formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#0A0F2E]">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-[#F8F7F4] px-1.5 py-0.5 rounded text-[#2B8A6E] font-mono text-xs">$1</code>');
        return <p key={idx} className="text-[#0A0F2E] my-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      })}
    </div>
  );
}

export default function RoadshowResources() {
  const [, setLocation] = useLocation();
  const [copiedStat, setCopiedStat] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState('faq');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStat(label);
    setTimeout(() => setCopiedStat(null), 2000);
  };

  const activeDocument = DOCUMENTS.find(d => d.id === activeDoc);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <StandardNav />
      
      {/* Navy Hero Header */}
      <div className="py-20 px-6 text-white text-center relative overflow-hidden" style={{ background: "#0A0F2E" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#C9A84C]"></div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Internal Executive Suite</span>
            <div className="w-8 h-[1px] bg-[#C9A84C]"></div>
          </div>
          <h1 className="text-5xl font-light mb-6" style={CG} data-testid="heading-roadshow">
            Roadshow Preparation
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed max-w-2xl mx-auto">
            Complete investor materials and strategic talking points. Premium resources for executive-level presentations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0A0F2E]/10 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <h2 className="text-2xl font-light text-[#0A0F2E]" style={CG}>
              Strategic Benchmarks
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {KEY_STATS.map((stat) => (
              <div 
                key={stat.label}
                className="bg-white border border-[#E8E4DC] p-6 cursor-pointer hover:border-[#C9A84C] transition-all group relative"
                onClick={() => copyToClipboard(stat.value, stat.label)}
                data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`text-2xl font-light mb-1`} style={{ ...CG, color: stat.color.includes('[') ? stat.color.split('-')[1].replace('[', '').replace(']', '') : undefined }}>{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">{stat.label}</div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedStat === stat.label ? <Check className="h-3 w-3 text-[#2B8A6E]" /> : <Copy className="h-3 w-3 text-[#E8E4DC]" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-5 w-5 text-[#0A0F2E]" />
                <h2 className="text-xl font-bold text-[#0A0F2E]">Document Library</h2>
              </div>
              <div className="space-y-3">
                {DOCUMENTS.map((doc) => {
                  const IconComponent = doc.icon;
                  return (
                    <div 
                      key={doc.id}
                      className={`p-4 cursor-pointer transition-all border-l-4 ${
                        activeDoc === doc.id 
                          ? 'border-[#C9A84C] bg-white shadow-sm' 
                          : 'border-transparent bg-transparent hover:bg-white/50'
                      }`}
                      onClick={() => setActiveDoc(doc.id)}
                      data-testid={`card-doc-${doc.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 ${doc.color} flex items-center justify-center text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#0A0F2E] text-sm">{doc.title}</div>
                          <div className="text-xs text-[#6B7280] truncate">{doc.description}</div>
                        </div>
                        <Badge variant="secondary" className="text-[9px] font-bold bg-[#F8F7F4] text-[#0A0F2E] rounded-none">
                          {doc.badge}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E4DC] space-y-3">
              <Button 
                className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none h-12 font-bold"
                onClick={() => setLocation('/try-demo')}
                data-testid="button-run-investor-demo"
              >
                <Clock className="mr-2 h-4 w-4" />
                Launch Investor Demo
              </Button>
              <Button 
                variant="outline"
                className="w-full border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none h-12"
                onClick={() => setLocation('/demo')}
                data-testid="button-view-all-demos"
              >
                Explore Demo Suite
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            {activeDocument && (
              <div className="bg-white border border-[#E8E4DC] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[#E8E4DC] flex items-center justify-between bg-[#F8F7F4]/30">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 ${activeDocument.color} flex items-center justify-center text-white shadow-lg`}>
                      <activeDocument.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-light text-[#0A0F2E]" style={CG}>{activeDocument.title}</h3>
                      <p className="text-[#6B7280] text-sm">{activeDocument.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#E8E4DC] text-[#0A0F2E] hover:bg-white rounded-none"
                    onClick={() => {
                      navigator.clipboard.writeText(activeDocument.content);
                      setCopiedStat('doc');
                      setTimeout(() => setCopiedStat(null), 2000);
                    }}
                    data-testid="button-copy-document"
                  >
                    {copiedStat === 'doc' ? <><Check className="h-4 w-4 mr-2" /> Copied</> : <><Copy className="h-4 w-4 mr-2" /> Copy Source</>}
                  </Button>
                </div>
                <div className="p-10">
                  <ScrollArea className="h-[700px] pr-6">
                    <MarkdownRenderer content={activeDocument.content} />
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 p-10 bg-[#0A0F2E] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-light mb-2" style={CG}>Executive Reference Guide</h3>
                <p className="text-[#6B7280] text-sm">Deployment strategy for high-stakes investor interactions</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: "Tough Question", target: "FAQ" },
                  { label: "Pricing Talk", target: "Pilot Program" },
                  { label: "Product Demo", target: "Demo Script" },
                  { label: "Moat Analysis", target: "Competitive Moat" }
                ].map((item, i) => (
                  <div key={i} className="px-4 py-2 border border-white/10 bg-white/5 flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-[#C9A84C]" />
                    <span className="text-xs font-bold text-[#C9A84C]">{item.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
