import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';
import { 
  Rocket,
  Building2,
  Users,
  Target,
  BarChart3,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Bell,
  Layers,
  ArrowRight,
  Settings,
  AlertTriangle,
  TrendingUp,
  Globe,
  DollarSign,
  Briefcase,
  Play,
  Radio,
  Activity,
  Eye,
  Timer,
  Award,
  CircleDot,
  Check,
  X,
  MessageSquare,
  Mail,
  Cpu,
  Home
} from 'lucide-react';

const INDUSTRIES = [
  { id: 'technology', name: 'Technology', icon: Cpu, description: 'Software, Hardware, SaaS, Cloud' },
  { id: 'financial', name: 'Financial Services', icon: DollarSign, description: 'Banking, Insurance, Investment' },
  { id: 'healthcare', name: 'Healthcare & Life Sciences', icon: Shield, description: 'Pharma, Biotech, Medical Devices' },
  { id: 'retail', name: 'Retail & Consumer', icon: Briefcase, description: 'E-commerce, CPG, Luxury' },
  { id: 'manufacturing', name: 'Manufacturing', icon: Settings, description: 'Industrial, Automotive, Aerospace' },
  { id: 'energy', name: 'Energy & Utilities', icon: Zap, description: 'Oil & Gas, Renewables, Utilities' },
  { id: 'media', name: 'Media & Entertainment', icon: Play, description: 'Streaming, Gaming, Publishing' },
  { id: 'telecom', name: 'Telecommunications', icon: Radio, description: 'Carriers, Infrastructure, 5G' },
];

const EXECUTIVE_ROLES = [
  { id: 'ceo', name: 'CEO / President', description: 'Enterprise-wide strategic oversight' },
  { id: 'coo', name: 'COO / Operations', description: 'Operational execution & efficiency' },
  { id: 'cfo', name: 'CFO / Finance', description: 'Financial strategy & risk management' },
  { id: 'cto', name: 'CTO / CIO / Technology', description: 'Technology strategy & innovation' },
  { id: 'cmo', name: 'CMO / Marketing', description: 'Brand & market positioning' },
  { id: 'chro', name: 'CHRO / People', description: 'Talent & organizational development' },
  { id: 'cso', name: 'CSO / Strategy', description: 'Corporate strategy & planning' },
  { id: 'cro', name: 'CRO / Revenue', description: 'Revenue growth & customer success' },
];

const STRATEGIC_PRIORITIES = [
  { id: 'growth', name: 'Revenue Growth', icon: TrendingUp, description: 'Accelerate top-line growth and market expansion' },
  { id: 'efficiency', name: 'Operational Efficiency', icon: Settings, description: 'Optimize operations and reduce costs' },
  { id: 'innovation', name: 'Innovation & Disruption', icon: Sparkles, description: 'Drive product innovation and digital transformation' },
  { id: 'risk', name: 'Risk Mitigation', icon: Shield, description: 'Proactively manage threats and build resilience' },
  { id: 'talent', name: 'Talent & Culture', icon: Users, description: 'Attract, retain, and develop top talent' },
  { id: 'customer', name: 'Customer Experience', icon: Award, description: 'Improve satisfaction and reduce churn' },
  { id: 'market', name: 'Market Positioning', icon: Target, description: 'Strengthen competitive positioning' },
  { id: 'sustainability', name: 'Sustainability & ESG', icon: Globe, description: 'Environmental and social responsibility' },
];

const PLAYBOOK_RECOMMENDATIONS: Record<string, { playbooks: { id: string; name: string; domain: string; description: string; triggers: string[] }[] }> = {
  'technology': {
    playbooks: [
      { id: 'cyber-incident', name: 'Cybersecurity Incident Response', domain: 'Crisis', description: 'Rapid response to security breaches and ransomware', triggers: ['Security breach detected', 'Anomalous network activity'] },
      { id: 'product-launch', name: 'Product Launch Acceleration', domain: 'Market', description: 'Coordinate rapid market entry and GTM execution', triggers: ['Competitor product announcement', 'Market window opening'] },
      { id: 'talent-retention', name: 'Key Talent Retention', domain: 'People', description: 'Respond to attrition risks and competitive poaching', triggers: ['Executive resignation', 'Competitor hiring spree'] },
      { id: 'regulatory-compliance', name: 'Tech Regulatory Response', domain: 'Regulatory', description: 'Navigate evolving tech regulations and privacy laws', triggers: ['New regulation announced', 'Compliance gap identified'] },
    ]
  },
  'financial': {
    playbooks: [
      { id: 'market-volatility', name: 'Market Volatility Response', domain: 'Crisis', description: 'Navigate market disruptions and protect portfolios', triggers: ['Market drop >5%', 'Volatility index spike'] },
      { id: 'regulatory-change', name: 'Regulatory Change Response', domain: 'Regulatory', description: 'Rapid compliance with new financial regulations', triggers: ['Regulatory announcement', 'Audit finding'] },
      { id: 'fraud-response', name: 'Fraud Incident Response', domain: 'Crisis', description: 'Coordinate response to fraud detection', triggers: ['Fraud detected', 'Suspicious activity alert'] },
      { id: 'ma-integration', name: 'M&A Integration Playbook', domain: 'Strategic', description: 'Orchestrate post-merger integration', triggers: ['Deal close', 'Integration milestone'] },
    ]
  },
  'healthcare': {
    playbooks: [
      { id: 'product-recall', name: 'Product Recall Execution', domain: 'Crisis', description: 'Coordinate FDA recalls and patient safety', triggers: ['Safety signal detected', 'FDA notification'] },
      { id: 'clinical-trial', name: 'Clinical Trial Response', domain: 'Regulatory', description: 'Respond to trial outcomes and regulatory decisions', triggers: ['Trial data readout', 'FDA decision'] },
      { id: 'supply-disruption', name: 'Supply Chain Disruption', domain: 'Operations', description: 'Maintain drug supply during shortages', triggers: ['Supplier issue', 'Inventory alert'] },
      { id: 'patent-expiry', name: 'Patent Cliff Response', domain: 'Strategic', description: 'Prepare for generic competition', triggers: ['Patent expiry approaching', 'Generic filing detected'] },
    ]
  },
  'retail': {
    playbooks: [
      { id: 'competitive-pricing', name: 'Competitive Pricing Response', domain: 'Market', description: 'React to aggressive competitor pricing', triggers: ['Competitor price drop', 'Market share shift'] },
      { id: 'supply-chain', name: 'Supply Chain Crisis', domain: 'Operations', description: 'Navigate logistics and inventory disruptions', triggers: ['Supplier failure', 'Port delay'] },
      { id: 'brand-crisis', name: 'Brand Reputation Crisis', domain: 'Crisis', description: 'Manage PR incidents and social media storms', triggers: ['Negative sentiment spike', 'Viral complaint'] },
      { id: 'seasonal-surge', name: 'Seasonal Demand Surge', domain: 'Operations', description: 'Capitalize on peak selling periods', triggers: ['Demand forecast exceeded', 'Inventory running low'] },
    ]
  },
  'manufacturing': {
    playbooks: [
      { id: 'supplier-crisis', name: 'Supplier Failure Response', domain: 'Operations', description: 'Activate backup suppliers and maintain production', triggers: ['Supplier default', 'Quality issue'] },
      { id: 'safety-incident', name: 'Safety Incident Response', domain: 'Crisis', description: 'Manage workplace safety events', triggers: ['Safety incident', 'OSHA notification'] },
      { id: 'quality-recall', name: 'Quality Issue / Recall', domain: 'Crisis', description: 'Coordinate product quality responses', triggers: ['Defect rate spike', 'Customer complaint surge'] },
      { id: 'automation', name: 'Automation Transition', domain: 'Strategic', description: 'Manage workforce and process automation', triggers: ['ROI threshold met', 'Technology available'] },
    ]
  },
  'energy': {
    playbooks: [
      { id: 'grid-failure', name: 'Grid Failure Response', domain: 'Crisis', description: 'Restore service during outages', triggers: ['Grid instability', 'Weather event'] },
      { id: 'price-volatility', name: 'Commodity Price Response', domain: 'Market', description: 'Navigate energy price fluctuations', triggers: ['Price swing >10%', 'OPEC announcement'] },
      { id: 'environmental', name: 'Environmental Incident', domain: 'Crisis', description: 'Respond to spills and environmental events', triggers: ['Leak detected', 'EPA alert'] },
      { id: 'transition', name: 'Energy Transition Acceleration', domain: 'Strategic', description: 'Accelerate renewable energy initiatives', triggers: ['Policy change', 'Technology breakthrough'] },
    ]
  },
  'media': {
    playbooks: [
      { id: 'content-crisis', name: 'Content Crisis Response', domain: 'Crisis', description: 'Manage controversial content situations', triggers: ['Viral complaint', 'Advertiser concern'] },
      { id: 'piracy-response', name: 'Piracy / IP Theft Response', domain: 'Legal', description: 'Combat content piracy and protect IP', triggers: ['Piracy detected', 'IP infringement'] },
      { id: 'talent-dispute', name: 'Talent Dispute Resolution', domain: 'People', description: 'Navigate talent contract issues', triggers: ['Contract dispute', 'Talent departure'] },
      { id: 'platform-launch', name: 'Platform Launch Acceleration', domain: 'Market', description: 'Coordinate new platform/service launches', triggers: ['Competitor launch', 'Market opportunity'] },
    ]
  },
  'telecom': {
    playbooks: [
      { id: 'network-outage', name: 'Network Outage Response', domain: 'Crisis', description: 'Restore service during major outages', triggers: ['Network failure', 'Service degradation'] },
      { id: 'spectrum-auction', name: 'Spectrum Auction Response', domain: 'Strategic', description: 'Navigate regulatory spectrum decisions', triggers: ['Auction announced', 'Spectrum availability'] },
      { id: 'competitive-response', name: 'Competitive Plan Response', domain: 'Market', description: 'React to competitor pricing/plans', triggers: ['Competitor announcement', 'Churn spike'] },
      { id: '5g-rollout', name: '5G Rollout Acceleration', domain: 'Strategic', description: 'Accelerate network technology deployment', triggers: ['Technology milestone', 'Competitor advancement'] },
    ]
  },
};

interface JourneyState {
  step: number;
  organizationName: string;
  industry: string;
  employeeCount: string;
  executiveRole: string;
  executiveName: string;
  executiveEmail: string;
  priorities: string[];
  selectedPlaybooks: string[];
  enabledSignals: string[];
  friTarget: number;
  velocityTarget: number;
  coverageTarget: number;
}

const STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Rocket },
  { id: 'organization', title: 'Your Organization', icon: Building2 },
  { id: 'priorities', title: 'Strategic Priorities', icon: Target },
  { id: 'playbooks', title: 'Select Playbooks', icon: Layers },
  { id: 'signals', title: 'Configure Signals', icon: Radio },
  { id: 'metrics', title: 'Success Metrics', icon: BarChart3 },
  { id: 'preview', title: 'See M in Action', icon: Play },
  { id: 'activated', title: 'System Active', icon: CheckCircle },
];

export default function NewUserJourney() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [state, setState] = useState<JourneyState>({
    step: 0,
    organizationName: '',
    industry: '',
    employeeCount: '',
    executiveRole: '',
    executiveName: '',
    executiveEmail: '',
    priorities: [],
    selectedPlaybooks: [],
    enabledSignals: [],
    friTarget: 84.4,
    velocityTarget: 12,
    coverageTarget: 95,
  });


  const updateState = (updates: Partial<JourneyState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const progress = ((state.step + 1) / STEPS.length) * 100;
  const currentStepInfo = STEPS[state.step];

  const canProceed = () => {
    switch (state.step) {
      case 0: return true;
      case 1: return state.organizationName && state.industry && state.executiveRole;
      case 2: return state.priorities.length >= 2;
      case 3: return state.selectedPlaybooks.length >= 1;
      case 4: return state.enabledSignals.length >= 3;
      case 5: return true;
      case 6: return true;
      case 7: return true;
      default: return false;
    }
  };

  const getRecommendedPlaybooks = () => {
    const industryPlaybooks = PLAYBOOK_RECOMMENDATIONS[state.industry]?.playbooks || [];
    return industryPlaybooks;
  };

  const getRecommendedSignals = () => {
    const priorityToSignals: Record<string, string[]> = {
      'growth': ['competitive', 'market', 'customer'],
      'efficiency': ['execution', 'supplychain', 'financial'],
      'innovation': ['technology', 'innovation', 'market'],
      'risk': ['regulatory', 'geopolitical', 'economic'],
      'talent': ['talent', 'behavior', 'competitive'],
      'customer': ['customer', 'behavior', 'media'],
      'market': ['competitive', 'market', 'media'],
      'sustainability': ['esg', 'regulatory', 'media'],
    };

    const recommendedCategories = new Set<string>();
    state.priorities.forEach(priority => {
      const signals = priorityToSignals[priority] || [];
      signals.forEach(s => recommendedCategories.add(s));
    });

    return Array.from(recommendedCategories);
  };

  const completeJourneyMutation = useMutation({
    mutationFn: async () => {
      const promises = [];
      
      promises.push(
        apiRequest('POST', '/api/config/departments', { name: 'Executive', description: 'Executive leadership' }).catch(() => {}),
        apiRequest('POST', '/api/config/departments', { name: 'Operations', description: 'Operations team' }).catch(() => {}),
        apiRequest('POST', '/api/config/departments', { name: 'Strategy', description: 'Strategy team' }).catch(() => {})
      );

      for (const signalId of state.enabledSignals) {
        const category = SIGNAL_CATEGORIES.find(c => c.id === signalId);
        if (category && category.dataPoints.length > 0) {
          const dataPoint = category.dataPoints[0];
          promises.push(
            apiRequest('POST', '/api/executive-triggers', {
              name: `${category.name} Monitor`,
              description: `Auto-configured during onboarding`,
              category: signalId,
              triggerType: 'threshold',
              conditions: {
                dataPointId: dataPoint.id,
                operator: dataPoint.defaultThreshold?.operator || 'gt',
                value: String(dataPoint.defaultThreshold?.value || 0)
              },
              alertThreshold: 'high',
              isActive: true,
              autoActivate: false,
              recommendedPlaybooks: category.recommendedPlaybooks || []
            }).catch(() => {})
          );
        }
      }

      promises.push(
        apiRequest('POST', '/api/config/success-metrics', {
          name: 'Future Readiness Index',
          metricType: 'fri',
          targetValue: state.friTarget,
          currentValue: 72.3,
          baselineValue: 58.1,
          unit: '%',
        }).catch(() => {}),
        apiRequest('POST', '/api/config/success-metrics', {
          name: 'Decision Velocity',
          metricType: 'velocity',
          targetValue: state.velocityTarget,
          currentValue: 45,
          baselineValue: 72,
          unit: 'minutes',
        }).catch(() => {})
      );

      await Promise.all(promises);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['/api/config'], exact: false });
      queryClient.refetchQueries({ queryKey: ['/api/executive-triggers'], exact: false });
      updateState({ step: 7 });
    },
  });

  const handleNext = () => {
    if (state.step === 7) {
      setLocation('/executive-dashboard');
    } else if (state.step === 6) {
      completeJourneyMutation.mutate();
    } else {
      updateState({ step: state.step + 1 });
    }
  };
  
  const goToCommandCenter = () => {
    setLocation('/command-center');
  };

  const handleBack = () => {
    if (state.step > 0) {
      updateState({ step: state.step - 1 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Getting Started with M</h1>
                <p className="text-xs text-slate-400">Your first playbook will be ready in under 15 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                Step {state.step + 1} of {STEPS.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                data-testid="button-home"
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {STEPS.map((step, index) => {
              const isCompleted = index < state.step;
              const isCurrent = index === state.step;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full transition-all
                    ${isCurrent ? 'bg-indigo-600 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900' : ''}
                    ${isCompleted ? 'bg-green-600' : ''}
                    ${!isCurrent && !isCompleted ? 'bg-slate-700' : ''}
                  `}>
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <Icon className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 ${isCompleted ? 'bg-green-600' : 'bg-slate-700'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {state.step === 0 && (
                <div className="text-center space-y-8">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
                    <Rocket className="h-12 w-12 text-white" />
                  </div>
                  
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                      Success Favors the Prepared
                    </h2>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                      M replaces reactive scrambles with coordinated precision, turning emerging opportunities 
                      into decisive action in <span className="text-indigo-400 font-semibold">12 minutes, not 72 hours</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
                    <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-indigo-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">15 min</div>
                      <div className="text-sm text-slate-400">Time to your first playbook</div>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                        <Layers className="h-6 w-6 text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">166</div>
                      <div className="text-sm text-slate-400">Ready-to-use playbooks</div>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                        <Radio className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">92</div>
                      <div className="text-sm text-slate-400">Intelligence signals</div>
                    </Card>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6 max-w-2xl mx-auto mt-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/30 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-white mb-1">What you'll accomplish</h3>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-400" />
                            Configure M for your industry and role
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-400" />
                            Select and customize your first playbook
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-400" />
                            Enable AI monitoring for key signals
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-400" />
                            See a live simulation of M in action
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {state.step === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Tell us about your organization</h2>
                    <p className="text-slate-400">This helps us personalize your playbooks and intelligence signals</p>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Organization Name *</Label>
                        <Input
                          value={state.organizationName}
                          onChange={(e) => updateState({ organizationName: e.target.value })}
                          placeholder="Enter your company name"
                          className="bg-slate-800/50 border-slate-700 h-12 text-white placeholder:text-slate-500"
                          data-testid="input-org-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Employee Count</Label>
                        <Select value={state.employeeCount} onValueChange={(v) => updateState({ employeeCount: v })}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 h-12 text-white" data-testid="select-employees">
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                            <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
                            <SelectItem value="10000-50000">10,000 - 50,000</SelectItem>
                            <SelectItem value="50000+">50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-300">Industry *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {INDUSTRIES.map((industry) => {
                          const Icon = industry.icon;
                          const isSelected = state.industry === industry.id;
                          return (
                            <Card
                              key={industry.id}
                              className={`cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' 
                                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                              }`}
                              onClick={() => updateState({ industry: industry.id, selectedPlaybooks: [] })}
                              data-testid={`industry-${industry.id}`}
                            >
                              <CardContent className="p-4 text-center">
                                <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                                <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                  {industry.name}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    <Separator className="bg-slate-700" />

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-slate-300">Your Role *</Label>
                        <Select value={state.executiveRole} onValueChange={(v) => updateState({ executiveRole: v })}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 h-12 text-white" data-testid="select-role">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXECUTIVE_ROLES.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <div className="flex flex-col">
                                  <span>{role.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Your Name</Label>
                        <Input
                          value={state.executiveName}
                          onChange={(e) => updateState({ executiveName: e.target.value })}
                          placeholder="Enter your name"
                          className="bg-slate-800/50 border-slate-700 h-12 text-white placeholder:text-slate-500"
                          data-testid="input-exec-name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {state.step === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">What are your strategic priorities?</h2>
                    <p className="text-slate-400">Select at least 2 priorities to personalize your playbook recommendations</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STRATEGIC_PRIORITIES.map((priority) => {
                      const Icon = priority.icon;
                      const isSelected = state.priorities.includes(priority.id);
                      return (
                        <Card
                          key={priority.id}
                          className={`cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' 
                              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              updateState({ priorities: state.priorities.filter(p => p !== priority.id) });
                            } else {
                              updateState({ priorities: [...state.priorities, priority.id] });
                            }
                          }}
                          data-testid={`priority-${priority.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <Icon className={`h-6 w-6 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                              {isSelected && <Check className="h-5 w-5 text-green-400" />}
                            </div>
                            <div className={`font-medium mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                              {priority.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {priority.description}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {state.priorities.length > 0 && (
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>
                          Selected: {state.priorities.map(p => 
                            STRATEGIC_PRIORITIES.find(sp => sp.id === p)?.name
                          ).join(', ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {state.step === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Choose your first playbooks</h2>
                    <p className="text-slate-400">
                      Based on your industry ({INDUSTRIES.find(i => i.id === state.industry)?.name}), 
                      we recommend these playbooks
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {getRecommendedPlaybooks().map((playbook) => {
                      const isSelected = state.selectedPlaybooks.includes(playbook.id);
                      return (
                        <Card
                          key={playbook.id}
                          className={`cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' 
                              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              updateState({ selectedPlaybooks: state.selectedPlaybooks.filter(p => p !== playbook.id) });
                            } else {
                              updateState({ selectedPlaybooks: [...state.selectedPlaybooks, playbook.id] });
                            }
                          }}
                          data-testid={`playbook-${playbook.id}`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                    {playbook.name}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {playbook.domain}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-400 mb-3">{playbook.description}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">Triggers:</span>
                                  {playbook.triggers.map((trigger, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs bg-slate-700">
                                      {trigger}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isSelected ? 'bg-green-500' : 'bg-slate-700'
                              }`}>
                                {isSelected ? (
                                  <Check className="h-5 w-5 text-white" />
                                ) : (
                                  <Layers className="h-5 w-5 text-slate-400" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-300">
                          You'll have access to all <span className="text-white font-semibold">166 playbooks</span> after setup.
                          These are just recommended starting points.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {state.step === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Enable intelligence monitoring</h2>
                    <p className="text-slate-400">
                      Turn on the signals that matter most to your strategic priorities
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-indigo-400" />
                      <span className="text-sm text-slate-300">
                        Based on your priorities, we recommend these signal categories. Toggle them on to enable 24/7 AI monitoring.
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {SIGNAL_CATEGORIES.filter(cat => 
                      getRecommendedSignals().includes(cat.id) || state.enabledSignals.includes(cat.id)
                    ).slice(0, 8).map((category) => {
                      const isEnabled = state.enabledSignals.includes(category.id);
                      const isRecommended = getRecommendedSignals().includes(category.id);
                      
                      return (
                        <Card
                          key={category.id}
                          className={`transition-all ${
                            isEnabled 
                              ? 'bg-green-600/10 border-green-500/50' 
                              : 'bg-slate-800/50 border-slate-700'
                          }`}
                          data-testid={`signal-${category.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: `${category.color}20` }}
                                >
                                  <Radio 
                                    className="h-5 w-5" 
                                    style={{ color: category.color }}
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-white">{category.name}</h3>
                                    {isRecommended && (
                                      <Badge variant="secondary" className="text-xs bg-indigo-500/20 text-indigo-300">
                                        Recommended
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-slate-400">{category.description}</p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {category.dataPoints.length} data points monitored
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    updateState({ enabledSignals: [...state.enabledSignals, category.id] });
                                  } else {
                                    updateState({ enabledSignals: state.enabledSignals.filter(s => s !== category.id) });
                                  }
                                }}
                                data-testid={`switch-signal-${category.id}`}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="text-center text-sm text-slate-500">
                    {state.enabledSignals.length} of {SIGNAL_CATEGORIES.length} signal categories enabled
                  </div>
                </div>
              )}

              {state.step === 5 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Set your success targets</h2>
                    <p className="text-slate-400">
                      Define what success looks like for your organization
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <Target className="h-6 w-6 text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">Future Readiness Index™ Target</h3>
                            <p className="text-sm text-slate-400 mb-4">
                              Your organization's strategic preparedness score across 5 dimensions
                            </p>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                value={state.friTarget}
                                onChange={(e) => updateState({ friTarget: Number(e.target.value) })}
                                className="w-24 bg-slate-900 border-slate-600 text-white"
                                min={0}
                                max={100}
                                step={0.1}
                                data-testid="input-fri-target"
                              />
                              <span className="text-slate-400">%</span>
                              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                                Best-in-class: 84.4%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <Timer className="h-6 w-6 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">Decision Velocity Target</h3>
                            <p className="text-sm text-slate-400 mb-4">
                              Target time from signal detection to coordinated response
                            </p>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                value={state.velocityTarget}
                                onChange={(e) => updateState({ velocityTarget: Number(e.target.value) })}
                                className="w-24 bg-slate-900 border-slate-600 text-white"
                                min={1}
                                max={60}
                                data-testid="input-velocity-target"
                              />
                              <span className="text-slate-400">minutes</span>
                              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                                Industry avg: 72 hours
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Shield className="h-6 w-6 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">Playbook Coverage Target</h3>
                            <p className="text-sm text-slate-400 mb-4">
                              Percentage of critical scenarios with ready playbooks
                            </p>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                value={state.coverageTarget}
                                onChange={(e) => updateState({ coverageTarget: Number(e.target.value) })}
                                className="w-24 bg-slate-900 border-slate-600 text-white"
                                min={50}
                                max={100}
                                data-testid="input-coverage-target"
                              />
                              <span className="text-slate-400">%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {state.step === 6 && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Your Command Center is Ready</h2>
                    <p className="text-slate-400">
                      Here's what M will monitor and execute for {state.organizationName || 'your organization'}
                    </p>
                  </div>

                  {/* Live Configuration Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 border-indigo-500/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-indigo-400 mb-1">{state.enabledSignals.length}</div>
                        <div className="text-sm text-slate-400">Signal Categories</div>
                        <div className="text-xs text-indigo-400 mt-1">Monitoring {state.enabledSignals.length * 6}+ data points</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-1">{state.selectedPlaybooks.length}</div>
                        <div className="text-sm text-slate-400">Active Playbooks</div>
                        <div className="text-xs text-purple-400 mt-1">Ready for instant activation</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-400 mb-1">{state.velocityTarget}m</div>
                        <div className="text-sm text-slate-400">Target Response</div>
                        <div className="text-xs text-green-400 mt-1">vs 72hr industry average</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Live Signal Monitoring Preview */}
                  <Card className="bg-slate-900 border-slate-700 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="font-semibold text-white text-sm">LIVE SIGNAL MONITORING</span>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-500/50 text-xs">
                          <Activity className="w-3 h-3 mr-1" /> Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {state.enabledSignals.slice(0, 4).map((signalId, index) => {
                          const category = SIGNAL_CATEGORIES.find(c => c.id === signalId);
                          return (
                            <motion.div 
                              key={signalId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                  <Radio className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{category?.name || signalId}</div>
                                  <div className="text-xs text-slate-500">{category?.dataPoints.length || 0} data points active</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-green-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2, delay: index * 0.2 }}
                                  />
                                </div>
                                <span className="text-xs text-green-400">Connected</span>
                              </div>
                            </motion.div>
                          );
                        })}
                        {state.enabledSignals.length > 4 && (
                          <div className="text-center text-xs text-slate-500 py-2">
                            + {state.enabledSignals.length - 4} more signal categories monitoring
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Playbook Ready Status */}
                  <Card className="bg-slate-900 border-slate-700 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Layers className="w-4 h-4 text-purple-400" />
                          <span className="font-semibold text-white text-sm">PLAYBOOKS ARMED & READY</span>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                          {state.selectedPlaybooks.length} Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid gap-3">
                        {state.selectedPlaybooks.map((playbookId, index) => {
                          const playbook = getRecommendedPlaybooks().find(p => p.id === playbookId);
                          return (
                            <motion.div 
                              key={playbookId}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                  <Shield className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{playbook?.name || playbookId}</div>
                                  <div className="text-xs text-slate-500">Triggers: {playbook?.triggers.join(', ')}</div>
                                </div>
                              </div>
                              <Badge className="bg-green-500/20 text-green-300 text-xs">Ready</Badge>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* ROI Projection */}
                  <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/30 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">Projected Annual Value</h3>
                          <p className="text-sm text-slate-400 mb-4">
                            Based on {INDUSTRIES.find(i => i.id === state.industry)?.name || 'your industry'} benchmarks and your configuration
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                              <div className="text-xl font-bold text-green-400">$2.4M</div>
                              <div className="text-xs text-slate-500">Risk Mitigation</div>
                            </div>
                            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                              <div className="text-xl font-bold text-green-400">847hrs</div>
                              <div className="text-xs text-slate-500">Executive Time Saved</div>
                            </div>
                            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                              <div className="text-xl font-bold text-green-400">12x</div>
                              <div className="text-xs text-slate-500">Faster Response</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* What Happens Next */}
                  <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      What happens when you complete setup:
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {state.enabledSignals.length} triggers go live immediately
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {state.selectedPlaybooks.length} playbooks ready for activation
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Real-time monitoring begins
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Dashboard reflects your configuration
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {state.step === 7 && (
                <div className="space-y-8">
                  {/* Success Hero */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="h-12 w-12 text-white" />
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-white mb-2"
                    >
                      M is Now Active
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-400 text-lg"
                    >
                      Your strategic execution system is monitoring and ready
                    </motion.p>
                  </div>

                  {/* Activation Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-400" />
                          What's Now Active
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 text-center">
                            <div className="text-3xl font-bold text-green-400">{state.enabledSignals.length}</div>
                            <div className="text-sm text-slate-400">Signal Categories</div>
                            <div className="text-xs text-green-400/70 mt-1">Monitoring 24/7</div>
                          </div>
                          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 text-center">
                            <div className="text-3xl font-bold text-purple-400">{state.selectedPlaybooks.length}</div>
                            <div className="text-sm text-slate-400">Playbooks</div>
                            <div className="text-xs text-purple-400/70 mt-1">Armed & Ready</div>
                          </div>
                          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 text-center">
                            <div className="text-3xl font-bold text-blue-400">{state.friTarget}%</div>
                            <div className="text-sm text-slate-400">FRI Target</div>
                            <div className="text-xs text-blue-400/70 mt-1">Tracking Active</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Your Configuration */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid gap-4"
                  >
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-slate-400" />
                      Your Configuration
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Organization</div>
                        <div className="text-white font-medium">{state.organizationName}</div>
                        <div className="text-sm text-slate-400">{INDUSTRIES.find(i => i.id === state.industry)?.name}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Strategic Focus</div>
                        <div className="text-white font-medium">{state.priorities.length} Priorities</div>
                        <div className="text-sm text-slate-400 truncate">
                          {state.priorities.slice(0, 2).map(p => STRATEGIC_PRIORITIES.find(sp => sp.id === p)?.name).join(', ')}
                          {state.priorities.length > 2 && ` +${state.priorities.length - 2} more`}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Next Steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-indigo-400" />
                          Your First Actions in the Platform
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">1</div>
                            <div>
                              <div className="text-white font-medium">Review Your Dashboard</div>
                              <div className="text-sm text-slate-400">See your Future Readiness Index and active monitoring status</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">2</div>
                            <div>
                              <div className="text-white font-medium">Explore Your Playbooks</div>
                              <div className="text-sm text-slate-400">Customize response protocols for your specific organization</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">3</div>
                            <div>
                              <div className="text-white font-medium">Visit Command Center</div>
                              <div className="text-sm text-slate-400">When a trigger fires, this is where 12-minute responses are orchestrated</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* System Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-3 py-4"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/30">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm text-green-400 font-medium">All Systems Operational</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/30">
                      <Radio className="w-3 h-3 text-blue-400" />
                      <span className="text-sm text-blue-400 font-medium">Intelligence Monitoring Active</span>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {state.step !== 7 ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={state.step === 0}
              className="text-slate-400 hover:text-white"
              data-testid="button-back"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div className="text-slate-500 text-sm">
              Setup complete - your system is now active
            </div>
          )}

          <div className="flex items-center gap-4">
            {state.step === 7 ? (
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={goToCommandCenter}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 min-w-[180px]"
                  data-testid="button-command-center"
                >
                  <Radio className="h-4 w-4 mr-2" />
                  Command Center
                </Button>
                <Button
                  size="lg"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 min-w-[220px]"
                  data-testid="button-enter-platform"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Enter Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : state.step === 6 ? (
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed() || completeJourneyMutation.isPending}
                className="bg-green-600 hover:bg-green-700 min-w-[200px]"
                data-testid="button-complete"
              >
                {completeJourneyMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Activating M...
                  </>
                ) : (
                  <>
                    Activate M
                    <Zap className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-indigo-600 hover:bg-indigo-700 min-w-[160px]"
                data-testid="button-next"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
