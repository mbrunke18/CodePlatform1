import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  TrendingDown, 
  Flame, 
  Scale, 
  AlertTriangle,
  Users,
  Building2,
  Star,
  Shield,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useState } from 'react';

const DEMO_DOMAINS = [
  {
    id: '1',
    name: 'Market Dynamics',
    icon: Target,
    color: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
    playbookCount: 18,
    description: 'Competitive moves, market opportunities, and strategic positioning',
    samplePlaybooks: [
      'New Market Entrant (Funded Startup)',
      'Competitive Product Launch',
      'Pricing War Response'
    ]
  },
  {
    id: '2',
    name: 'Financial Strategy',
    icon: TrendingDown,
    color: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
    playbookCount: 15,
    description: 'Capital allocation, financial performance, and investment decisions',
    samplePlaybooks: [
      'Strategic M&A Opportunity',
      'Cash Flow Optimization',
      'Investment Round Execution'
    ]
  },
  {
    id: '3',
    name: 'Operational Excellence',
    icon: Flame,
    color: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
    playbookCount: 14,
    description: 'Process optimization, efficiency gains, and operational resilience',
    samplePlaybooks: [
      'Supply Chain Disruption Response',
      'Production Scale-Up',
      'Quality Initiative Launch'
    ]
  },
  {
    id: '4',
    name: 'Technology & Innovation',
    icon: AlertTriangle,
    color: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
    playbookCount: 13,
    description: 'Digital transformation, technology adoption, and innovation initiatives',
    samplePlaybooks: [
      'Cloud Migration Strategy',
      'AI/ML Initiative Launch',
      'Security Incident Response'
    ]
  },
  {
    id: '5',
    name: 'Talent & Leadership',
    icon: Users,
    color: 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300',
    playbookCount: 12,
    description: 'Leadership development, talent acquisition, and organizational capability',
    samplePlaybooks: [
      'Executive Leadership Transition',
      'Top Talent Retention Program',
      'Culture Transformation Initiative'
    ]
  },
  {
    id: '6',
    name: 'Brand & Reputation',
    icon: Building2,
    color: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
    playbookCount: 14,
    description: 'Brand strategy, stakeholder relations, and reputation management',
    samplePlaybooks: [
      'Brand Repositioning Campaign',
      'Stakeholder Communication Event',
      'Media Relations Strategy'
    ]
  },
  {
    id: '7',
    name: 'Regulatory & Compliance',
    icon: Scale,
    color: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
    playbookCount: 10,
    description: 'Compliance initiatives, regulatory changes, and governance improvements',
    samplePlaybooks: [
      'New Regulation Compliance',
      'Audit Preparation Protocol',
      'Governance Framework Update'
    ]
  },
  {
    id: '8',
    name: 'Market Opportunities',
    icon: Star,
    color: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300',
    playbookCount: 14,
    description: 'Market expansion, strategic partnerships, and growth initiatives',
    samplePlaybooks: [
      'Geographic Expansion Plan',
      'Strategic Partnership Formation',
      'New Product Market Entry'
    ]
  }
];

export default function PlaybookLibraryDemo() {
  const [selectedDomain, setSelectedDomain] = useState(DEMO_DOMAINS[0]);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-2 border-blue-200 dark:border-blue-800" data-testid="playbook-library-demo">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Interactive Playbook Library
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Explore 166 strategic decision frameworks across 9 operational domains
            </p>
          </div>
          <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
            166 Playbooks
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domain Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DEMO_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isSelected = selectedDomain.id === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomain(domain);
                  setShowDetails(true);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                data-testid={`domain-card-${domain.id}`}
              >
                <div className={`w-12 h-12 rounded-lg ${domain.color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-center mb-1">{domain.name}</div>
                <div className="text-xs text-muted-foreground text-center">
                  {domain.playbookCount} playbooks
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Domain Details */}
        {showDetails && (
          <Card className="bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 rounded-lg ${selectedDomain.color} flex items-center justify-center flex-shrink-0`}>
                  <selectedDomain.icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{selectedDomain.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDomain.description}</p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {selectedDomain.playbookCount} Playbooks
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  <Zap className="h-4 w-4" />
                  Sample Strategic Playbooks
                </div>
                {selectedDomain.samplePlaybooks.map((playbook, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">{playbook}</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        12 min
                      </div>
                      <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700">
                        80% Pre-filled
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                      Enterprise-Ready Templates
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      Each playbook includes: Stakeholder matrix, Communication templates, Decision trees, Budget authorities, Success metrics, and Trigger definitions
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white">
          <div>
            <div className="font-semibold">Ready to explore the full library?</div>
            <div className="text-sm text-blue-100">Browse all 166 strategic playbook templates</div>
          </div>
          <Button 
            variant="secondary" 
            className="bg-white text-blue-600 hover:bg-blue-50"
            data-testid="explore-library-btn"
          >
            Explore Library
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
