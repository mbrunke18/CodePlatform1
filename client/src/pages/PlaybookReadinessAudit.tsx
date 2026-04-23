import { useState, useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Target,
  Users,
  Clock,
  TrendingUp,
  ChevronRight,
  Calendar,
  Play
} from 'lucide-react';
import { Link } from 'wouter';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';

interface PlaybookReadiness {
  id: string;
  playbookNumber: number;
  name: string;
  domain: string;
  category: string;
  overallScore: number;
  triggerCoverage: number;
  stakeholderReadiness: number;
  practiceFrequency: number;
  outcomeConfidence: number;
  lastDrillDate: string | null;
  drillsCompleted: number;
  stakeholderCount: number;
  tier: 'combat-ready' | 'practice-needed' | 'setup-required' | 'not-configured';
  recommendations: string[];
}

const domains = [
  'Market Response',
  'Operational Resilience', 
  'People & Culture',
  'Technology & Innovation',
  'Regulatory Compliance',
  'Crisis Management',
  'Growth & Expansion',
  'Strategic Partnerships'
];

const generateMockPlaybooks = (): PlaybookReadiness[] => {
  const playbooks: PlaybookReadiness[] = [];
  const playbookNames = [
    'Competitor Price War Response', 'Market Share Defense', 'New Market Entry',
    'Supply Chain Disruption', 'Vendor Failure Recovery', 'Capacity Surge Protocol',
    'Executive Transition', 'Talent Retention Crisis', 'Union Negotiation',
    'Ransomware Response', 'Data Breach Protocol', 'System Outage Recovery',
    'FDA Audit Preparation', 'GDPR Compliance Alert', 'SEC Investigation Response',
    'Product Recall Coordination', 'Reputation Crisis Management', 'Natural Disaster Response',
    'Acquisition Integration', 'Strategic Partnership Launch', 'Market Expansion Protocol',
    'Joint Venture Formation', 'Licensing Agreement Negotiation', 'Technology Transfer'
  ];

  for (let i = 1; i <= 170; i++) {
    const nameIndex = (i - 1) % playbookNames.length;
    const domainIndex = Math.floor((i - 1) / 20) % domains.length;
    
    const triggerCoverage = 0;
    const stakeholderReadiness = 0;
    const practiceFrequency = 0;
    const outcomeConfidence = 0;
    const overallScore = 0;
    
    let tier: PlaybookReadiness['tier'] = 'not-configured';

    const recommendations: string[] = ['Complete initial setup'];

    const lastDrill = null;

    playbooks.push({
      id: `prepared response-${i}`,
      playbookNumber: i,
      name: `${playbookNames[nameIndex]} ${Math.floor(i / 24) + 1}`,
      domain: domains[domainIndex],
      category: `${domains[domainIndex]} - Subcategory ${(i % 6) + 1}`,
      overallScore,
      triggerCoverage,
      stakeholderReadiness,
      practiceFrequency,
      outcomeConfidence,
      lastDrillDate: lastDrill,
      drillsCompleted: 0,
      stakeholderCount: 0,
      tier,
      recommendations
    });
  }
  
  return playbooks;
};

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const tierConfig = {
  'combat-ready': {
    label: 'Combat Ready',
    color: 'bg-[#2B8A6E]',
    textColor: 'text-[#2B8A6E]',
    bgColor: 'bg-[#2B8A6E]/10',
    borderColor: 'border-[#2B8A6E]/20',
    indicator: '#2B8A6E',
    icon: CheckCircle2
  },
  'practice-needed': {
    label: 'Practice Needed',
    color: 'bg-[#C9A84C]',
    textColor: 'text-[#C9A84C]',
    bgColor: 'bg-[#C9A84C]/10',
    borderColor: 'border-[#C9A84C]/20',
    indicator: '#C9A84C',
    icon: Clock
  },
  'setup-required': {
    label: 'Setup Required',
    color: 'bg-[#C9A84C]',
    textColor: 'text-[#C9A84C]',
    bgColor: 'bg-[#C9A84C]/5',
    borderColor: 'border-[#C9A84C]/10',
    indicator: '#C9A84C',
    icon: AlertTriangle
  },
  'not-configured': {
    label: 'Not Configured',
    color: 'bg-[#0A0F2E]',
    textColor: 'text-[#0A0F2E]',
    bgColor: 'bg-[#0A0F2E]/5',
    borderColor: 'border-[#0A0F2E]/10',
    indicator: '#0A0F2E',
    icon: XCircle
  }
};

export default function PlaybookReadinessAudit() {
  const [playbooks] = useState<PlaybookReadiness[]>(generateMockPlaybooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const filteredPlaybooks = useMemo(() => {
    return playbooks.filter(pb => {
      const matchesSearch = pb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pb.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain = selectedDomain === 'all' || pb.domain === selectedDomain;
      const matchesTier = selectedTier === 'all' || pb.tier === selectedTier;
      return matchesSearch && matchesDomain && matchesTier;
    });
  }, [playbooks, searchQuery, selectedDomain, selectedTier]);

  const stats = useMemo(() => {
    const tierCounts = {
      'combat-ready': 0,
      'practice-needed': 0,
      'setup-required': 0,
      'not-configured': 0
    };
    let totalScore = 0;
    
    playbooks.forEach(pb => {
      tierCounts[pb.tier]++;
      totalScore += pb.overallScore;
    });

    return {
      tierCounts,
      averageScore: Math.round(totalScore / playbooks.length),
      total: playbooks.length
    };
  }, [playbooks]);

  return (
    <PageLayout>
      
      <div style={{ background: "#0A0F2E" }} className="relative text-white py-16 overflow-hidden">
        {/* Gold dot grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#C9A84C 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-[2px] bg-[#C9A84C]"></div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#C9A84C]">Readiness Audit</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-8 w-8 text-[#C9A84C]" />
                <h1 className="text-4xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="page-title">
                  Readiness Protocol Readiness Audit
                </h1>
              </div>
              <p className="text-[#6B7280] text-lg max-w-2xl">
                Assess preparedness across your 170 strategic playbooks. Identify gaps, 
                schedule drills, and ensure your organization is ready to execute.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <OnboardingTrigger pageId="prepared response-readiness" autoStart={true} className="bg-white/5 border-white/10 text-white hover:bg-white/10" />
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10" data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="readiness-summary">
          {Object.entries(tierConfig).map(([tier, config]) => {
            const TierIcon = config.icon;
            const count = stats.tierCounts[tier as keyof typeof stats.tierCounts];
            const percentage = Math.round((count / stats.total) * 100);
            
            return (
              <Card 
                key={tier} 
                className={`${config.bgColor} ${config.borderColor} border cursor-pointer transition-all`}
                onClick={() => setSelectedTier(tier)}
                style={{ borderTop: `4px solid ${(config as any).indicator}` }}
                data-testid={`tier-card-${tier}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <TierIcon className={`h-6 w-6 ${config.textColor}`} />
                    <Badge className={`${config.color} text-white border-none`}>
                      {percentage}%
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C9A84C" }}>
                    {count}
                  </div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-[#6B7280]">
                    {config.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border border-[#E8E4DC] bg-white" data-testid="card-overall-readiness">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <TrendingUp className="h-5 w-5 text-[#0A0F2E]" />
              Overall Readiness Score
            </CardTitle>
            <CardDescription>
              Average preparedness across all 170 prepared responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-7xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C9A84C" }}>
                  {stats.averageScore}%
                </div>
                <div className="text-sm text-[#6B7280] mt-2 font-medium">
                  Target: 84.4%
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 font-medium text-[#0A0F2E]">
                      <Target className="h-4 w-4" />
                      Trigger Coverage
                    </span>
                    <span className="font-bold text-[#0A0F2E]">72%</span>
                  </div>
                  <Progress value={72} className="h-2 bg-[#E8E4DC]" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 font-medium text-[#0A0F2E]">
                      <Users className="h-4 w-4" />
                      Stakeholder Readiness
                    </span>
                    <span className="font-bold text-[#0A0F2E]">68%</span>
                  </div>
                  <Progress value={68} className="h-2 bg-[#E8E4DC]" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 font-medium text-[#0A0F2E]">
                      <Calendar className="h-4 w-4" />
                      Practice Frequency
                    </span>
                    <span className="font-bold text-[#0A0F2E]">55%</span>
                  </div>
                  <Progress value={55} className="h-2 bg-[#E8E4DC]" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 font-medium text-[#0A0F2E]">
                      <CheckCircle2 className="h-4 w-4" />
                      Outcome Confidence
                    </span>
                    <span className="font-bold text-[#0A0F2E]">64%</span>
                  </div>
                  <Progress value={64} className="h-2 bg-[#E8E4DC]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search playbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#E8E4DC]"
                data-testid="input-search"
              />
            </div>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-48 border-[#E8E4DC]" data-testid="select-domain">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map(domain => (
                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-48 border-[#E8E4DC]" data-testid="select-tier">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {Object.entries(tierConfig).map(([tier, config]) => (
                  <SelectItem key={tier} value={tier}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm font-medium text-[#6B7280]">
            Showing <span className="text-[#0A0F2E]">{filteredPlaybooks.length}</span> of {playbooks.length} prepared responses
          </div>
        </div>

        <div className="grid gap-4" data-testid="prepared response-list">
          {filteredPlaybooks.slice(0, 20).map((playbook) => {
            const config = tierConfig[playbook.tier];
            const TierIcon = config.icon;
            const isOffense = playbook.domain.includes("Market") || playbook.domain.includes("Growth") || playbook.domain.includes("Expansion") || playbook.domain.includes("Partnerships") || playbook.domain.includes("M&A") || playbook.domain.includes("Response");
            const isDefense = playbook.domain.includes("Crisis") || playbook.domain.includes("Regulatory") || playbook.domain.includes("Resilience") || playbook.domain.includes("Compliance") || playbook.domain.includes("Technology") || playbook.domain.includes("People") || playbook.domain.includes("Talent") || playbook.domain.includes("Culture") || playbook.domain.includes("Recovery") || playbook.domain.includes("Incident");
            const indicatorColor = isOffense ? TEAL : isDefense ? NAVY : GOLD;
            
            return (
              <Card 
                key={playbook.id} 
                className={`border border-[#E8E4DC] bg-white border-l-4 transition-all`}
                style={{ borderLeftColor: indicatorColor }}
                data-testid={`prepared response-card-${playbook.playbookNumber}`}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 ${config.bgColor} rounded flex items-center justify-center`}>
                        <TierIcon className={`h-6 w-6 ${config.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#0A0F2E] text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            #{playbook.playbookNumber} - {playbook.name}
                          </h3>
                          <Badge variant="outline" className={`${config.textColor} border-current bg-current/5`}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium text-[#6B7280]">
                          <span>{playbook.domain}</span>
                          <span className="text-[#E8E4DC]">•</span>
                          <span>{playbook.stakeholderCount} stakeholders</span>
                          <span className="text-[#E8E4DC]">•</span>
                          <span>{playbook.drillsCompleted} drills completed</span>
                          {playbook.lastDrillDate && (
                            <>
                              <span className="text-[#E8E4DC]">•</span>
                              <span>Last drill: {new Date(playbook.lastDrillDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden lg:flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {playbook.triggerCoverage}%
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold">Triggers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {playbook.stakeholderReadiness}%
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold">Stakeholders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: indicatorColor }}>
                            {playbook.practiceFrequency}%
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold">Practice</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: indicatorColor }}>
                            {playbook.outcomeConfidence}%
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold">Confidence</div>
                        </div>
                      </div>

                      <div className="text-center px-6 border-l border-[#E8E4DC]">
                        <div className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: indicatorColor }}>
                          {playbook.overallScore}%
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold">Overall</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-[#E8E4DC] text-[#0A0F2E] font-bold hover:bg-[#F8F7F4]"
                          data-testid={`button-drill-${playbook.playbookNumber}`}
                        >
                          <Play className="h-4 w-4 mr-1 text-[#C9A84C]" />
                          Drill
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-[#6B7280] hover:text-[#0A0F2E]"
                          data-testid={`button-view-${playbook.playbookNumber}`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {playbook.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E8E4DC]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Recommendations:</span>
                        {playbook.recommendations.map((rec, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] bg-[#F8F7F4] text-[#0A0F2E] border-none">
                            {rec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPlaybooks.length > 20 && (
          <div className="text-center pb-12">
            <Button variant="outline" className="border-[#E8E4DC] text-[#0A0F2E] font-bold" data-testid="button-load-more">
              <RefreshCw className="h-4 w-4 mr-2" />
              Load More ({filteredPlaybooks.length - 20} remaining)
            </Button>
          </div>
        )}

        <Card className="bg-[#0A0F2E] text-white overflow-hidden relative border-none">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#C9A84C 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
          <CardContent className="py-10 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Ready to improve readiness?
                </h3>
                <p className="text-[#6B7280] font-medium">
                  Schedule a bulk drill session or import stakeholder data to boost your scores.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/scenario-gallery">
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10" data-testid="button-browse-prepared responses">
                    Browse Prepared responses
                  </Button>
                </Link>
                <Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]" data-testid="button-schedule-drill">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Drill
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
