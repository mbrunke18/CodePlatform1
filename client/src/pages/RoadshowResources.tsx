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
  Target
} from 'lucide-react';
import StandardNav from '@/components/layout/StandardNav';
import { useLocation } from 'wouter';

import investorFaqContent from '@/data/M-Investor-FAQ.md?raw';
import pilotProgramContent from '@/data/M-Pilot-Program-OnePager.md?raw';
import demoScriptContent from '@/data/M-Demo-Script-3min.md?raw';
import whyNowContent from '@/data/M-WhyNow-SlideContent.md?raw';
import competitiveMoatContent from '@/data/M-Competitive-Moat-TalkingPoints.md?raw';
import checklistContent from '@/data/M-PreRoadshow-Checklist.md?raw';

const KEY_STATS = [
  { label: "Response Time", value: "72h → 12min", color: "text-emerald-400" },
  { label: "Playbooks", value: "166", color: "text-blue-400" },
  { label: "Domains", value: "9", color: "text-purple-400" },
  { label: "Pilot Price", value: "$75K", color: "text-amber-400" },
  { label: "Contract Range", value: "$250K-$1.5M", color: "text-green-400" },
  { label: "Seed Target", value: "$2.6M", color: "text-pink-400" },
];

const DOCUMENTS = [
  {
    id: 'faq',
    title: 'Investor FAQ',
    description: '20 anticipated questions with crisp answers',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    badge: '20 Q&As',
    content: investorFaqContent
  },
  {
    id: 'pilot',
    title: 'Pilot Program',
    description: '90-day engagement structure, pricing, success metrics',
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    badge: '$75K',
    content: pilotProgramContent
  },
  {
    id: 'demo-script',
    title: 'Demo Script',
    description: '3-minute investor demo with exact talking points',
    icon: Clock,
    color: 'from-purple-500 to-violet-500',
    badge: '3 min',
    content: demoScriptContent
  },
  {
    id: 'why-now',
    title: 'Why Now',
    description: '3 slides of market timing narrative and data',
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-500',
    badge: '3 Slides',
    content: whyNowContent
  },
  {
    id: 'moat',
    title: 'Competitive Moat',
    description: 'Responses to "Why can\'t BigCo build this?"',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    badge: '5 Moats',
    content: competitiveMoatContent
  },
  {
    id: 'checklist',
    title: 'Pre-Roadshow Checklist',
    description: '75 tasks with priorities and deadlines',
    icon: CheckSquare,
    color: 'from-green-500 to-emerald-500',
    badge: '75 Tasks',
    content: checklistContent
  },
];

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-2xl font-bold text-white mt-6 mb-4">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-xl font-bold text-white mt-6 mb-3 border-b border-slate-700 pb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-semibold text-emerald-400 mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={idx} className="font-bold text-white my-2">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('> ')) {
          return <blockquote key={idx} className="border-l-4 border-emerald-500 pl-4 my-3 text-slate-300 italic">{line.slice(2)}</blockquote>;
        }
        if (line.startsWith('- [ ] ')) {
          return <div key={idx} className="flex items-start gap-2 my-1"><input type="checkbox" className="mt-1" /><span className="text-slate-300">{line.slice(6)}</span></div>;
        }
        if (line.startsWith('- ')) {
          return <li key={idx} className="text-slate-300 ml-4 my-1">{line.slice(2)}</li>;
        }
        if (line.startsWith('| ') && line.includes(' | ')) {
          const cells = line.split(' | ').map(c => c.replace(/^\||\|$/g, '').trim());
          const isHeader = lines[idx + 1]?.includes('---');
          return (
            <div key={idx} className={`grid gap-2 py-2 border-b border-slate-800 ${isHeader ? 'font-semibold text-white' : 'text-slate-400'}`} style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
              {cells.map((cell, i) => <div key={i} className="text-sm">{cell}</div>)}
            </div>
          );
        }
        if (line.includes('|---')) {
          return null;
        }
        if (line.startsWith('---')) {
          return <hr key={idx} className="border-slate-700 my-6" />;
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-2" />;
        }
        const formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-1 rounded text-emerald-400">$1</code>');
        return <p key={idx} className="text-slate-300 my-1" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
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
    <div className="min-h-screen bg-slate-950">
      <StandardNav />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <Badge className="bg-purple-500 text-white mb-4">
            Internal Resources
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-2" data-testid="heading-roadshow">
            Roadshow Preparation
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Complete investor materials. Click any document to view full content.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Key Numbers to Memorize
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {KEY_STATS.map((stat) => (
              <Card 
                key={stat.label}
                className="bg-slate-900/50 border-slate-700 cursor-pointer hover:border-slate-500 transition-all group"
                onClick={() => copyToClipboard(stat.value, stat.label)}
                data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-500 flex items-center justify-center gap-1">
                    {copiedStat === stat.label ? (
                      <><Check className="h-3 w-3" /> Copied</>
                    ) : (
                      <><Copy className="h-3 w-3" /> Click to copy</>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Documents
            </h2>
            <div className="space-y-2">
              {DOCUMENTS.map((doc) => {
                const IconComponent = doc.icon;
                return (
                  <Card 
                    key={doc.id}
                    className={`bg-slate-900/50 border cursor-pointer transition-all ${
                      activeDoc === doc.id 
                        ? 'border-emerald-500 bg-emerald-950/20' 
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                    onClick={() => setActiveDoc(doc.id)}
                    data-testid={`card-doc-${doc.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${doc.color}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-sm">{doc.title}</div>
                          <div className="text-xs text-slate-400 truncate">{doc.description}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {doc.badge}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                onClick={() => setLocation('/investor-demo')}
                data-testid="button-run-investor-demo"
              >
                <Clock className="mr-2 h-4 w-4" />
                Run Investor Demo
              </Button>
              <Button 
                variant="outline"
                className="w-full border-slate-600 text-slate-300"
                onClick={() => setLocation('/demo')}
                data-testid="button-view-all-demos"
              >
                View All Demos
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeDocument && (
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="border-b border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${activeDocument.color}`}>
                      <activeDocument.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl">{activeDocument.title}</CardTitle>
                      <CardDescription>{activeDocument.description}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600"
                      onClick={() => {
                        navigator.clipboard.writeText(activeDocument.content);
                        setCopiedStat('doc');
                        setTimeout(() => setCopiedStat(null), 2000);
                      }}
                      data-testid="button-copy-document"
                    >
                      {copiedStat === 'doc' ? <><Check className="h-4 w-4 mr-1" /> Copied</> : <><Copy className="h-4 w-4 mr-1" /> Copy All</>}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[600px] pr-4">
                    <MarkdownRenderer content={activeDocument.content} />
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card className="mt-8 bg-gradient-to-r from-purple-950/50 to-blue-950/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Quick Reference Table</h3>
                <p className="text-slate-400 text-sm">What document to use in each situation</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  Tough question → FAQ
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  Pricing talk → Pilot Program
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  About to demo → Demo Script
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  "Why can't Salesforce?" → Competitive Moat
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
