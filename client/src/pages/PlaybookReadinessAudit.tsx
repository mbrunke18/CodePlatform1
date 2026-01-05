import { useState, useMemo } from 'react';
import StandardNav from '@/components/layout/StandardNav';
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

  for (let i = 1; i <= 166; i++) {
    const nameIndex = (i - 1) % playbookNames.length;
    const domainIndex = Math.floor((i - 1) / 20) % domains.length;
    
    const triggerCoverage = Math.floor(Math.random() * 40) + 60;
    const stakeholderReadiness = Math.floor(Math.random() * 50) + 50;
    const practiceFrequency = Math.floor(Math.random() * 60) + 40;
    const outcomeConfidence = Math.floor(Math.random() * 45) + 55;
    const overallScore = Math.round((triggerCoverage + stakeholderReadiness + practiceFrequency + outcomeConfidence) / 4);
    
    let tier: PlaybookReadiness['tier'];
    if (overallScore >= 80) tier = 'combat-ready';
    else if (overallScore >= 60) tier = 'practice-needed';
    else if (overallScore >= 40) tier = 'setup-required';
    else tier = 'not-configured';

    const recommendations: string[] = [];
    if (triggerCoverage < 70) recommendations.push('Configure additional trigger conditions');
    if (stakeholderReadiness < 70) recommendations.push('Update stakeholder contact information');
    if (practiceFrequency < 50) recommendations.push('Schedule practice drill');
    if (outcomeConfidence < 60) recommendations.push('Review decision tree accuracy');

    const daysAgo = Math.floor(Math.random() * 180);
    const lastDrill = daysAgo < 90 ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString() : null;

    playbooks.push({
      id: `playbook-${i}`,
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
      drillsCompleted: Math.floor(Math.random() * 12),
      stakeholderCount: Math.floor(Math.random() * 30) + 10,
      tier,
      recommendations
    });
  }
  
  return playbooks;
};

const tierConfig = {
  'combat-ready': {
    label: 'Combat Ready',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle2
  },
  'practice-needed': {
    label: 'Practice Needed',
    color: 'bg-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: Clock
  },
  'setup-required': {
    label: 'Setup Required',
    color: 'bg-orange-500',
    textColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    icon: AlertTriangle
  },
  'not-configured': {
    label: 'Not Configured',
    color: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
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
    <div className="page-background min-h-screen">
      <StandardNav />
      
      <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-8 w-8" />
                <h1 className="text-3xl font-bold" data-testid="page-title">
                  Playbook Readiness Audit
                </h1>
              </div>
              <p className="text-blue-100 text-lg max-w-2xl">
                Assess preparedness across your 166 strategic playbooks. Identify gaps, 
                schedule drills, and ensure your organization is ready to execute.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <OnboardingTrigger pageId="playbook-readiness" autoStart={true} className="bg-white/10 border-white/30 text-white hover:bg-white/20" />
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" data-testid="button-export">
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
                className={`${config.bgColor} ${config.borderColor} border-2 cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => setSelectedTier(tier)}
                data-testid={`tier-card-${tier}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <TierIcon className={`h-6 w-6 ${config.textColor}`} />
                    <Badge className={`${config.color} text-white`}>
                      {percentage}%
                    </Badge>
                  </div>
                  <div className={`text-3xl font-bold ${config.textColor}`}>
                    {count}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {config.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-2 border-blue-500 dark:border-blue-700" data-testid="card-overall-readiness">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Overall Readiness Score
            </CardTitle>
            <CardDescription>
              Average preparedness across all 166 playbooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.averageScore}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Target: 84.4%
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Trigger Coverage
                    </span>
                    <span className="font-semibold">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Stakeholder Readiness
                    </span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Practice Frequency
                    </span>
                    <span className="font-semibold">55%</span>
                  </div>
                  <Progress value={55} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Outcome Confidence
                    </span>
                    <span className="font-semibold">64%</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search playbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-48" data-testid="select-domain">
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
              <SelectTrigger className="w-48" data-testid="select-tier">
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
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredPlaybooks.length} of {playbooks.length} playbooks
          </div>
        </div>

        <div className="grid gap-4" data-testid="playbook-list">
          {filteredPlaybooks.slice(0, 20).map((playbook) => {
            const config = tierConfig[playbook.tier];
            const TierIcon = config.icon;
            
            return (
              <Card 
                key={playbook.id} 
                className={`${config.borderColor} border-l-4 hover:shadow-lg transition-shadow`}
                data-testid={`playbook-card-${playbook.playbookNumber}`}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                        <TierIcon className={`h-6 w-6 ${config.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            #{playbook.playbookNumber} - {playbook.name}
                          </h3>
                          <Badge variant="outline" className={config.textColor}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>{playbook.domain}</span>
                          <span>•</span>
                          <span>{playbook.stakeholderCount} stakeholders</span>
                          <span>•</span>
                          <span>{playbook.drillsCompleted} drills completed</span>
                          {playbook.lastDrillDate && (
                            <>
                              <span>•</span>
                              <span>Last drill: {new Date(playbook.lastDrillDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden lg:flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {playbook.triggerCoverage}%
                          </div>
                          <div className="text-xs text-slate-500">Triggers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
                            {playbook.stakeholderReadiness}%
                          </div>
                          <div className="text-xs text-slate-500">Stakeholders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {playbook.practiceFrequency}%
                          </div>
                          <div className="text-xs text-slate-500">Practice</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {playbook.outcomeConfidence}%
                          </div>
                          <div className="text-xs text-slate-500">Confidence</div>
                        </div>
                      </div>

                      <div className="text-center px-4 border-l border-slate-200 dark:border-slate-700">
                        <div className={`text-2xl font-bold ${config.textColor}`}>
                          {playbook.overallScore}%
                        </div>
                        <div className="text-xs text-slate-500">Overall</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-drill-${playbook.playbookNumber}`}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Drill
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          data-testid={`button-view-${playbook.playbookNumber}`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {playbook.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-500">Recommendations:</span>
                        {playbook.recommendations.map((rec, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
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
          <div className="text-center">
            <Button variant="outline" data-testid="button-load-more">
              <RefreshCw className="h-4 w-4 mr-2" />
              Load More ({filteredPlaybooks.length - 20} remaining)
            </Button>
          </div>
        )}

        <Card className="bg-gradient-to-r from-blue-50 via-violet-50 to-purple-50 dark:from-blue-950/30 dark:via-violet-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  Ready to improve readiness?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Schedule a bulk drill session or import stakeholder data to boost your scores.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/scenario-gallery">
                  <Button variant="outline" data-testid="button-browse-playbooks">
                    Browse Playbooks
                  </Button>
                </Link>
                <Button data-testid="button-schedule-drill">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Drill
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
