import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, BookOpen, TrendingUp, Award, AlertCircle, CheckCircle, Clock, Target, Shield, Zap, ArrowUpRight, BarChart3, Lightbulb, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { SubBrandLabel } from "@/components/SubBrandLabel";

const DEMO_OUTCOMES = [
  {
    id: '1',
    decisionType: 'M&A Integration — CloudTech Acquisition',
    outcomeType: 'successful',
    decisionDescription: 'Activated Prepared Response #12 for Day 1 Integration of $2.3B CloudTech acquisition. 45 stakeholders coordinated in 11 minutes 47 seconds. All regulatory filings submitted ahead of deadline.',
    lessonsLearned: 'Early stakeholder tier mapping (5-tier vs 3-tier) reduced communication bottlenecks by 62%. Dual-sign budget authority for >$500K prevented approval delays. Recommend adding acquired-company leadership to Tier 2 by default in future M&A Prepared Responses.',
    date: 'Jan 28, 2026',
    domain: 'M&A',
    executionTime: '11 min 47 sec',
    costSaved: '$4.2M',
  },
  {
    id: '2',
    decisionType: 'Ransomware Incident Response — LockBit 3.0',
    outcomeType: 'successful',
    decisionDescription: 'Critical cybersecurity incident at 2:17 AM. Prepared Response #31 activated via automated trigger from AWS CloudWatch + CrowdStrike Falcon. 47 production servers isolated in 45 seconds. Full recovery achieved from clean backups with 4-hour RPO.',
    lessonsLearned: 'Auto-isolation rule triggered 3 minutes faster than manual approval would have. VPN monitoring trigger should be added to detect credential compromise earlier. Phishing response prepared response now cross-linked for upstream prevention.',
    date: 'Feb 3, 2026',
    domain: 'Cybersecurity',
    executionTime: '11 min 47 sec',
    costSaved: '$12.8M',
  },
  {
    id: '3',
    decisionType: 'Competitive Product Launch Counter-Strategy',
    outcomeType: 'successful',
    decisionDescription: 'Competitor launched rival product 6 weeks ahead of their announced timeline. Signal detected via social media monitoring and patent filing analysis. Prepared Response #45 activated for accelerated feature release and customer retention campaign.',
    lessonsLearned: 'Patent filing monitoring proved more reliable than press release tracking for early detection (14-day lead time vs 3-day). Customer retention outreach within 24 hours preserved 94% of at-risk accounts. Recommend adding supplier intelligence as a secondary signal source.',
    date: 'Feb 8, 2026',
    domain: 'Competitive Response',
    executionTime: '8 min 32 sec',
    costSaved: '$6.7M',
  },
  {
    id: '4',
    decisionType: 'GDPR Compliance Audit Response',
    outcomeType: 'partially_successful',
    decisionDescription: 'EU regulatory body announced surprise audit with 72-hour preparation window. Prepared Response #67 activated for compliance readiness sprint. 28 tasks distributed across Legal, IT, and Compliance teams.',
    lessonsLearned: 'Document staging was 95% automated but 3 legacy systems required manual data export (added to remediation backlog). Stakeholder notification timing should be staggered — simultaneous alerts caused confusion in Legal team. Recommend pre-staging quarterly audit readiness packages.',
    date: 'Jan 15, 2026',
    domain: 'Regulatory',
    executionTime: '14 min 22 sec',
    costSaved: '$2.1M',
  },
  {
    id: '5',
    decisionType: 'Supply Chain Disruption — APAC Region',
    outcomeType: 'successful',
    decisionDescription: 'Critical supplier in Taiwan experienced production halt due to natural disaster. Signal detected via supply chain monitoring API. Prepared Response #52 activated backup supplier network across 3 alternate regions within 12 minutes.',
    lessonsLearned: 'Pre-qualified backup suppliers reduced activation time from 2 weeks to same-day. Financial hedging strategy limited cost impact to 8% vs projected 23%. Recommend expanding backup supplier network to include European alternatives for additional redundancy.',
    date: 'Dec 19, 2025',
    domain: 'Operations',
    executionTime: '12 min 00 sec',
    costSaved: '$8.4M',
  },
];

const DEMO_PATTERNS = [
  {
    id: '1',
    patternType: 'Timing',
    category: 'Execution Speed',
    title: 'Early Morning Incidents Show 23% Faster Response Times',
    description: 'Analysis of 47 incident responses reveals that triggers activated between 6-9 AM local time receive stakeholder acknowledgment 23% faster than afternoon triggers. Recommendation: Schedule high-priority drills during morning hours to leverage natural attention peaks.',
    confidenceLevel: '94%',
    impactScore: 'High',
    dataPoints: 47,
  },
  {
    id: '2',
    patternType: 'Stakeholder',
    category: 'Communication',
    title: 'Tiered Notification Reduces Response Overload by 41%',
    description: 'Organizations using 5-tier stakeholder hierarchies experience 41% fewer "notification fatigue" incidents compared to flat notification structures. Key finding: Tier 1 (CEO, Board) responds best to SMS + phone, while Tier 3+ performs better with Slack/Teams channels.',
    confidenceLevel: '89%',
    impactScore: 'High',
    dataPoints: 156,
  },
  {
    id: '3',
    patternType: 'Automation',
    category: 'Prepared Response Design',
    title: 'Auto-Isolation Rules Cut Cyber Incident Damage by 78%',
    description: 'Prepared responses with automated network isolation rules (triggered within 60 seconds of detection) reduced data exposure by 78% compared to manual-approval workflows. The 3-minute gap between auto and manual represents critical damage window in ransomware scenarios.',
    confidenceLevel: '96%',
    impactScore: 'Critical',
    dataPoints: 23,
  },
  {
    id: '4',
    patternType: 'Integration',
    category: 'Tool Effectiveness',
    title: 'Jira Sync Reduces Project Setup Time by 87%',
    description: 'Auto-creating Jira boards with pre-populated tasks and assignments during prepared response execution saves an average of 4.2 hours per incident compared to manual project creation. Teams using auto-sync report 92% task visibility within the first hour.',
    confidenceLevel: '91%',
    impactScore: 'Medium',
    dataPoints: 89,
  },
  {
    id: '5',
    patternType: 'Financial',
    category: 'Budget Optimization',
    title: 'Pre-Approved Budget Thresholds Accelerate Response by 34%',
    description: 'Organizations with pre-approved emergency budget thresholds (auto-approve below threshold, dual-sign above) execute financial aspects of prepared responses 34% faster. Sweet spot: auto-approve up to $100K, dual-sign $100K-$1M, board approval above $1M.',
    confidenceLevel: '87%',
    impactScore: 'High',
    dataPoints: 112,
  },
  {
    id: '6',
    patternType: 'Learning',
    category: 'Continuous Improvement',
    title: 'Post-Execution Reviews Improve Next-Run Performance by 18%',
    description: 'Prepared responses that capture lessons learned and auto-update trigger conditions show 18% improvement in execution speed on subsequent activations. Organizations conducting reviews within 48 hours capture 3x more actionable insights than those reviewing after 1 week.',
    confidenceLevel: '82%',
    impactScore: 'Medium',
    dataPoints: 67,
  },
];

const DEMO_KNOWLEDGE = [
  {
    id: '1',
    memoryType: 'Best Practice',
    domain: 'M&A',
    title: 'Day 1 Integration Communication Prepared Response',
    summary: 'Employee communications must be sent within 30 minutes of deal close announcement. Use segmented messaging: acquired employees receive empathy-focused messages, existing employees receive stability-focused messages, customers receive continuity assurance. Always include FAQ document and dedicated hotline number.',
    applicability: 'All M&A scenarios above $500M',
    lastUpdated: 'Jan 28, 2026',
  },
  {
    id: '2',
    memoryType: 'Failure Analysis',
    domain: 'Cybersecurity',
    title: 'VPN Credential Compromise Detection Gap',
    summary: 'In the Feb 3 ransomware incident, the initial compromise occurred 72 hours before detection via a phishing email targeting VPN credentials. Current monitoring missed the lateral movement because VPN session monitoring was not integrated with SIEM. Remediation: Added VPN anomaly detection to trigger conditions in all cybersecurity Prepared Responses.',
    applicability: 'All cybersecurity incident prepared responses',
    lastUpdated: 'Feb 5, 2026',
  },
  {
    id: '3',
    memoryType: 'Organizational Wisdom',
    domain: 'Crisis Management',
    title: 'CEO Communication Cadence During Active Crisis',
    summary: 'During active crisis scenarios, CEO updates should be pushed every 30 minutes for the first 2 hours, then hourly for the next 6 hours, then every 4 hours until resolution. This cadence was refined across 12 crisis responses and correlates with 89% board satisfaction scores.',
    applicability: 'All DEFENSE domain prepared responses',
    lastUpdated: 'Feb 10, 2026',
  },
  {
    id: '4',
    memoryType: 'Best Practice',
    domain: 'Regulatory',
    title: 'Regulatory Filing Pre-Staging Strategy',
    summary: 'Maintain a library of 80% pre-completed regulatory filing templates for SEC, GDPR, SOX, and state AG notifications. Auto-populate with organization data quarterly. During an incident, only the incident-specific details need manual input, reducing filing preparation from 8 hours to 45 minutes.',
    applicability: 'All regulatory compliance prepared responses',
    lastUpdated: 'Jan 20, 2026',
  },
  {
    id: '5',
    memoryType: 'Organizational Wisdom',
    domain: 'Operations',
    title: 'Supplier Redundancy Framework',
    summary: 'Maintain at minimum 3 qualified backup suppliers per critical component across 2+ geographic regions. Quarterly capability verification ensures backup suppliers can activate within 48 hours. The Taiwan supply chain incident proved this framework prevented a $15.2M revenue impact.',
    applicability: 'Supply chain and operations prepared responses',
    lastUpdated: 'Dec 22, 2025',
  },
  {
    id: '6',
    memoryType: 'Best Practice',
    domain: 'AI Governance',
    title: 'AI Model Risk Assessment Protocol',
    summary: 'Before deploying any customer-facing AI model, execute the 18-point governance checklist including bias testing across 7 demographic dimensions, explainability scoring (minimum 0.7), and adversarial robustness testing. Models failing any critical checkpoint require VP-level approval and documented risk acceptance.',
    applicability: 'All AI Governance domain prepared responses',
    lastUpdated: 'Feb 1, 2026',
  },
];

export default function InstitutionalMemory({ embedded }: { embedded?: boolean }) {
  const [activeTab, setActiveTab] = useState('outcomes');

  const decisionOutcomes = DEMO_OUTCOMES;
  const learningPatterns = DEMO_PATTERNS;
  const institutionalKnowledge = DEMO_KNOWLEDGE;

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'successful': return <CheckCircle className="h-5 w-5 text-[#2B8A6E]" />;
      case 'partially_successful': return <AlertCircle className="h-5 w-5 text-[#C9A84C]" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-[#0A0F2E] dark:text-[#C9A84C]" />;
      default: return <AlertCircle className="h-5 w-5 text-[#6B7280]" />;
    }
  };

  const totalValueSaved = DEMO_OUTCOMES.reduce((sum, o) => {
    const val = parseFloat(o.costSaved.replace(/[$M,]/g, ''));
    return sum + val;
  }, 0);

  return (
    <PageLayout embedded={embedded}>
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#0A0F2E] text-[#C9A84C] border border-[#C9A84C]/40 text-xs font-semibold">
              <SubBrandLabel name="Retrospect™" />
            </Badge>
            <Badge variant="outline" className="text-xs border-[#E8E4DC]">ADVANCE Phase</Badge>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="page-title">
            <Brain className="h-8 w-8 text-[#C9A84C]" />
            Institutional Memory
          </h1>
          <p className="text-[#6B7280] mt-1">
            Pattern-based learning from past decisions — continuously improving recommendations
          </p>
        </div>
        <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" data-testid="button-record-learning">
          <BookOpen className="h-4 w-4 mr-2" />
          Record New Learning
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10" data-testid="card-decisions-tracked">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decisions Tracked</CardTitle>
            <BookOpen className="h-4 w-4 text-[#0A0F2E] dark:text-[#C9A84C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{decisionOutcomes.length}</div>
            <p className="text-xs text-[#6B7280]">Across 5 strategic domains</p>
          </CardContent>
        </Card>

        <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10" data-testid="card-patterns-identified">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patterns Identified</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{learningPatterns.length}</div>
            <p className="text-xs text-[#6B7280]">AI-discovered insights</p>
          </CardContent>
        </Card>

        <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10" data-testid="card-knowledge-base">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
            <Award className="h-4 w-4 text-[#0A0F2E] dark:text-[#C9A84C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{institutionalKnowledge.length}</div>
            <p className="text-xs text-[#6B7280]">Documented learnings</p>
          </CardContent>
        </Card>

        <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value Protected</CardTitle>
            <Shield className="h-4 w-4 text-[#2B8A6E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>${totalValueSaved.toFixed(1)}M</div>
            <p className="text-xs text-[#6B7280]">Cost savings from learned responses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#0A0F2E]/10 dark:bg-white/10">
                <RefreshCw className="h-5 w-5 text-[#0A0F2E] dark:text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A0F2E] dark:text-white">Continuous Learning Loop</p>
                <p className="text-xs text-[#6B7280]">Every execution makes the next one faster</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={87} className="flex-1" />
              <span className="text-sm font-bold text-[#0A0F2E] dark:text-[#C9A84C]">87%</span>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">Learning utilization rate</p>
          </CardContent>
        </Card>
        <Card className="bg-[#2B8A6E]/5 dark:bg-[#2B8A6E]/10 border-[#2B8A6E]/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#2B8A6E]/10">
                <ArrowUpRight className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2B8A6E]">Response Improvement</p>
                <p className="text-xs text-[#2B8A6E]/70">Avg improvement per prepared response iteration</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>+18%</div>
            <p className="text-xs text-[#2B8A6E]/70 mt-1">Faster execution on each subsequent run</p>
          </CardContent>
        </Card>
        <Card className="bg-[#C9A84C]/5 dark:bg-[#C9A84C]/10 border-[#C9A84C]/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#C9A84C]/10">
                <Lightbulb className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#C9A84C]">AI Recommendations</p>
                <p className="text-xs text-[#C9A84C]/70">Insights applied to active prepared responses</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>34</div>
            <p className="text-xs text-[#C9A84C]/70 mt-1">Auto-applied improvements this quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <BarChart3 className="h-5 w-5 text-[#C9A84C]" />
              Execution Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40 mb-4">
              {[
                { month: 'Sep', value: 34 },
                { month: 'Oct', value: 28 },
                { month: 'Nov', value: 22 },
                { month: 'Dec', value: 18 },
                { month: 'Jan', value: 14 },
                { month: 'Feb', value: 12 },
              ].map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-[#0A0F2E] dark:text-[#C9A84C]">{d.value}m</span>
                  <div
                    className="w-full rounded-t-md bg-[#0A0F2E] dark:bg-[#C9A84C] transition-all"
                    style={{ height: `${(d.value / 34) * 100}%` }}
                  />
                  <span className="text-xs text-[#6B7280]">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-[#2B8A6E]/5 dark:bg-[#2B8A6E]/10 border border-[#2B8A6E]/20 p-3">
              <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />
              <span className="text-sm font-semibold text-[#2B8A6E]">67% improvement in average execution time over 6 months</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <BookOpen className="h-5 w-5 text-[#C9A84C]" />
              Prepared responses Improved From Learnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'M&A Day 1 Integration (#12)', improvement: 'Added 5-tier stakeholder mapping', version: 'v3 → v4', date: 'Jan 28' },
                { name: 'Ransomware Response (#31)', improvement: 'Added VPN anomaly detection trigger', version: 'v2 → v3', date: 'Feb 5' },
                { name: 'Competitive Counter (#45)', improvement: 'Added patent monitoring signal', version: 'v1 → v2', date: 'Feb 10' },
                { name: 'GDPR Compliance (#67)', improvement: 'Staggered notification timing', version: 'v2 → v3', date: 'Jan 18' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between border border-[#E8E4DC] p-3 bg-[#F8F7F4] dark:bg-white/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0A0F2E] dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-[#6B7280]">{item.improvement}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20 text-xs">{item.version}</Badge>
                    <span className="text-xs text-[#6B7280] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-[#E8E4DC]/30" data-testid="tabs-memory-sections">
          <TabsTrigger value="outcomes" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-outcomes">Decision Outcomes</TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-patterns">Learning Patterns</TabsTrigger>
          <TabsTrigger value="knowledge" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="outcomes" className="space-y-4">
          <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Decision Outcomes History</CardTitle>
              <CardDescription>
                Track effectiveness and lessons learned from past executive decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {decisionOutcomes.map((outcome) => (
                  <div 
                    key={outcome.id} 
                    className="border border-[#E8E4DC] p-4 space-y-3 bg-white dark:bg-white/5"
                    data-testid={`outcome-${outcome.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getOutcomeIcon(outcome.outcomeType)}
                          <h3 className="font-semibold text-[#0A0F2E] dark:text-white" data-testid={`text-outcome-type-${outcome.id}`}>
                            {outcome.decisionType}
                          </h3>
                          <Badge className={
                            outcome.outcomeType === 'successful' ? 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20' :
                            'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20'
                          }>
                            {outcome.outcomeType === 'successful' ? 'Successful' : 'Partially Successful'}
                          </Badge>
                          <Badge variant="secondary" className="bg-[#E8E4DC]/30 text-[#0A0F2E] dark:text-white border-none">{outcome.domain}</Badge>
                        </div>
                        <p className="text-sm text-[#0A0F2E]/80 dark:text-white/80">{outcome.decisionDescription}</p>
                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {outcome.date}</span>
                          <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {outcome.executionTime}</span>
                          <span className="flex items-center gap-1 text-[#2B8A6E] font-semibold"><Shield className="h-3 w-3" /> {outcome.costSaved} saved</span>
                        </div>
                        {outcome.lessonsLearned && (
                          <div className="bg-[#F8F7F4] dark:bg-white/5 p-3 rounded-none border border-[#E8E4DC] dark:border-white/10">
                            <p className="text-sm font-medium mb-1 flex items-center gap-1 text-[#0A0F2E] dark:text-[#C9A84C]"><Lightbulb className="h-4 w-4" /> Lessons Learned:</p>
                            <p className="text-sm text-[#6B7280] dark:text-[#E8E4DC]">{outcome.lessonsLearned}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>AI-Discovered Learning Patterns</CardTitle>
              <CardDescription>
                Patterns identified from historical data to improve future recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningPatterns.map((pattern) => (
                  <div 
                    key={pattern.id} 
                    className="border border-[#E8E4DC] p-4 space-y-2 bg-white dark:bg-white/5"
                    data-testid={`pattern-${pattern.id}`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-[#E8E4DC]/30 text-[#0A0F2E] dark:text-white border-none">{pattern.patternType}</Badge>
                      <Badge variant="outline" className="border-[#E8E4DC] text-[#6B7280]">{pattern.category}</Badge>
                      <Badge className={
                        pattern.impactScore === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        pattern.impactScore === 'High' ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20' :
                        'bg-[#0A0F2E]/10 text-[#0A0F2E] dark:bg-white/10 dark:text-white border-[#0A0F2E]/20'
                      }>
                        {pattern.impactScore} Impact
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-[#0A0F2E] dark:text-white" data-testid={`text-pattern-title-${pattern.id}`}>{pattern.title}</h3>
                    <p className="text-sm text-[#6B7280] dark:text-[#E8E4DC]">{pattern.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#6B7280] pt-1">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Confidence: <span className="font-semibold text-[#2B8A6E]">{pattern.confidenceLevel}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        Based on {pattern.dataPoints} data points
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Institutional Knowledge Base</CardTitle>
              <CardDescription>
                Documented organizational wisdom and best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {institutionalKnowledge.map((knowledge) => (
                  <div 
                    key={knowledge.id} 
                    className="border border-[#E8E4DC] p-4 space-y-2 bg-white dark:bg-white/5"
                    data-testid={`knowledge-${knowledge.id}`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={
                        knowledge.memoryType === 'Best Practice' ? 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20' :
                        knowledge.memoryType === 'Failure Analysis' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20'
                      }>{knowledge.memoryType}</Badge>
                      {knowledge.domain && <Badge variant="outline" className="border-[#E8E4DC] text-[#6B7280]">{knowledge.domain}</Badge>}
                    </div>
                    <h3 className="font-semibold text-[#0A0F2E] dark:text-white" data-testid={`text-knowledge-title-${knowledge.id}`}>{knowledge.title}</h3>
                    <p className="text-sm text-[#6B7280] dark:text-[#E8E4DC]">{knowledge.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-[#6B7280] pt-1">
                      <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {knowledge.applicability}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Updated: {knowledge.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
