import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
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
import { BrandStamp } from "@/components/BrandStamp";
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
      { id: 'ma-integration', name: 'M&A Integration Prepared Response', domain: 'Strategic', description: 'Orchestrate post-merger integration', triggers: ['Deal close', 'Integration milestone'] },
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
  { id: 'prepared responses', title: 'Select Prepared responses', icon: Layers },
  { id: 'signals', title: 'Configure Signals', icon: Radio },
  { id: 'metrics', title: 'Success Metrics', icon: BarChart3 },
  { id: 'preview', title: 'See Readiness OS in Action', icon: Play },
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
    <PageLayout>
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E8E4DC]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#0A0F2E] flex items-center justify-center border-b-2 border-[#C9A84C]">
                <span className="text-[#C9A84C] font-bold text-[10px] uppercase tracking-tighter">ExOS</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#0A0F2E] uppercase tracking-widest">Readiness OS Onboarding</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-tight">Your first prepared response ready in 15 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Badge variant="outline" className="bg-transparent text-[#0A0F2E] border-[#C9A84C] rounded-none uppercase text-[9px] font-bold tracking-widest">
                Step {state.step + 1} of {STEPS.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="text-slate-500 hover:text-[#0A0F2E] hover:bg-transparent rounded-none uppercase text-[10px] font-bold tracking-widest"
                data-testid="button-home"
              >
                <Home className="h-3 w-3 mr-2" />
                Exit
              </Button>
            </div>
          </div>
          
          <div className="flex gap-1 mt-2">
            {STEPS.map((_, idx) => {
              const isCurrent = idx === state.step;
              const isCompleted = idx < state.step;
              return (
                <div key={idx} className="flex-1">
                  <div className={`h-1 transition-all w-full ${isCurrent ? 'bg-[#C9A84C]' : ''} ${isCompleted ? 'bg-[#2B8A6E]' : ''} ${!isCurrent && !isCompleted ? 'bg-[#E8E4DC]' : ''}`} />
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {state.step === 0 && (
                <div className="text-center space-y-10">
                  <div className="w-24 h-24 mx-auto rounded-none bg-[#0A0F2E] flex items-center justify-center mb-8 border-b-4 border-[#C9A84C]">
                    <Rocket className="h-10 w-10 text-[#C9A84C]" />
                  </div>
                  
                  <div>
                    <h2 className="font-serif text-5xl text-[#0A0F2E] mb-6">
                      Success Favors the Prepared
                    </h2>
                    <p className="text-xl text-[#6B7280] max-w-2xl mx-auto font-light leading-relaxed">
                      Readiness OS replaces reactive scrambles with coordinated precision, turning emerging opportunities 
                      into decisive action in <span className="text-[#2B8A6E] font-bold underline decoration-[#C9A84C] underline-offset-4">12 minutes, not 30 days</span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button
                      size="lg"
                      className="bg-[#0A0F2E] hover:bg-[#141B45] text-white px-12 py-8 font-bold uppercase tracking-widest text-xs rounded-none"
                      onClick={handleNext}
                    >
                      Start Configuration
                      <ChevronRight className="ml-3 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
                    <div className="text-center p-6 border-b-2 border-slate-100 hover:border-[#C9A84C] transition-colors">
                      <div className="text-3xl font-serif text-[#0A0F2E] mb-2">15 min</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Time to Build</div>
                    </div>
                    <div className="text-center p-6 border-b-2 border-slate-100 hover:border-[#C9A84C] transition-colors">
                      <div className="text-3xl font-serif text-[#0A0F2E] mb-2">170</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Prepared responses</div>
                    </div>
                    <div className="text-center p-6 border-b-2 border-slate-100 hover:border-[#C9A84C] transition-colors">
                      <div className="text-3xl font-serif text-[#0A0F2E] mb-2">92</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">Signals</div>
                    </div>
                  </div>

                  <div className="bg-[#F8F7F4] border-l-4 border-[#C9A84C] p-8 max-w-2xl mx-auto mt-12 text-left">
                    <h3 className="font-bold text-[#0A0F2E] uppercase tracking-widest text-xs mb-4">Onboarding Milestones</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-[#2B8A6E]" />
                        Configure Readiness OS for your industry
                      </li>
                      <li className="flex items-center gap-3 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-[#2B8A6E]" />
                        Select your first operational prepared response
                      </li>
                      <li className="flex items-center gap-3 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-[#2B8A6E]" />
                        Enable Continuous signal monitoring
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {state.step === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#0A0F2E] mb-2">Tell us about your organization</h2>
                    <p className="text-[#6B7280]">This helps us personalize your prepared responses and intelligence signals</p>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[#0A0F2E]">Organization Name *</Label>
                        <Input
                          value={state.organizationName}
                          onChange={(e) => updateState({ organizationName: e.target.value })}
                          placeholder="Enter your company name"
                          className="bg-[#F8F7F4] border-[#E8E4DC] h-12 text-[#0A0F2E] placeholder:text-slate-300"
                          data-testid="input-org-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#0A0F2E]">Employee Count</Label>
                        <Select value={state.employeeCount} onValueChange={(v) => updateState({ employeeCount: v })}>
                          <SelectTrigger className="bg-[#F8F7F4] border-[#E8E4DC] h-12 text-[#0A0F2E]" data-testid="select-employees">
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
                      <Label className="text-[#0A0F2E]">Industry *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {INDUSTRIES.map((industry) => {
                          const Icon = industry.icon;
                          const isSelected = state.industry === industry.id;
                          return (
                            <Card
                              key={industry.id}
                              className={`cursor-pointer transition-all rounded-none ${
                                isSelected 
                                  ? 'bg-[#0A0F2E]/5 border-[#C9A84C] ring-1 ring-[#C9A84C]' 
                                  : 'bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#0A0F2E]'
                              }`}
                              onClick={() => updateState({ industry: industry.id, selectedPlaybooks: [] })}
                              data-testid={`industry-${industry.id}`}
                            >
                            <CardContent className="p-4 text-center">
                                <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-[#C9A84C]' : 'text-[#0A0F2E]'}`} />
                                <div className={`text-sm font-medium ${isSelected ? 'text-[#0A0F2E]' : 'text-[#6B7280]'}`}>
                                  {industry.name}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    <Separator className="bg-[#E8E4DC]" />

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[#0A0F2E]">Your Role *</Label>
                        <Select value={state.executiveRole} onValueChange={(v) => updateState({ executiveRole: v })}>
                          <SelectTrigger className="bg-[#F8F7F4] border-[#E8E4DC] h-12 text-[#0A0F2E]" data-testid="select-role">
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
                        <Label className="text-[#0A0F2E]">Your Name</Label>
                        <Input
                          value={state.executiveName}
                          onChange={(e) => updateState({ executiveName: e.target.value })}
                          placeholder="Enter your name"
                          className="bg-[#F8F7F4] border-[#E8E4DC] h-12 text-[#0A0F2E] placeholder:text-slate-300"
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
                    <h2 className="text-3xl font-bold text-[#0A0F2E] mb-2">What are your strategic priorities?</h2>
                    <p className="text-[#6B7280]">Select at least 2 priorities to personalize your prepared response recommendations</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STRATEGIC_PRIORITIES.map((priority) => {
                      const Icon = priority.icon;
                      const isSelected = state.priorities.includes(priority.id);
                      return (
                        <Card
                          key={priority.id}
                          className={`cursor-pointer transition-all rounded-none ${
                            isSelected 
                              ? 'bg-[#0A0F2E]/5 border-[#0A0F2E] ring-1 ring-[#0A0F2E]' 
                              : 'bg-[#F8F7F4] border-[#E8E4DC] hover:border-[#0A0F2E]'
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
                              <Icon className={`h-6 w-6 ${isSelected ? 'text-[#C9A84C]' : 'text-[#0A0F2E]'}`} />
                              {isSelected && <Check className="h-5 w-5 text-[#2B8A6E]" />}
                            </div>
                            <div className={`font-medium mb-1 ${isSelected ? 'text-[#0A0F2E]' : 'text-[#6B7280]'}`}>
                              {priority.name}
                            </div>
                            <div className="text-xs text-[#6B7280]">
                              {priority.description}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {state.priorities.length > 0 && (
                    <div className="bg-gray-50 p-4 border border-[#E8E4DC]">
                      <div className="flex items-center gap-2 text-sm text-gray-800">
                        <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose your first prepared responses</h2>
                    <p className="text-gray-800">
                      Based on your industry ({INDUSTRIES.find(i => i.id === state.industry)?.name}), 
                      we recommend these prepared responses
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
                              ? 'bg-[#0A0F2E]/10 border-[#0A0F2E] ring-1 ring-[#0A0F2E]' 
                              : 'bg-gray-50 border-[#E8E4DC] hover:border-slate-600'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              updateState({ selectedPlaybooks: state.selectedPlaybooks.filter(p => p !== playbook.id) });
                            } else {
                              updateState({ selectedPlaybooks: [...state.selectedPlaybooks, playbook.id] });
                            }
                          }}
                          data-testid={`prepared response-${playbook.id}`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className={`font-semibold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                                    {playbook.name}
                                  </h3>
                                  <Badge variant="outline" className="text-xs border-[#C9A84C] text-[#C9A84C]">
                                    {playbook.domain}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-800 mb-3">{playbook.description}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-800">Triggers:</span>
                                  {playbook.triggers.map((trigger, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs bg-gray-50 border-[#E8E4DC]">
                                      {trigger}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className={`w-8 h-8 flex items-center justify-center ${
                                isSelected ? 'bg-[#2B8A6E]' : 'bg-gray-50'
                              }`}>
                                {isSelected ? (
                                  <Check className="h-5 w-5 text-white" />
                                ) : (
                                  <Layers className="h-5 w-5 text-gray-800" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="bg-gray-50 p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div style={{ width: 3, height: 40, background: '#C9A84C', flexShrink: 0, marginTop: 4 }} />
                      <p className="text-sm text-gray-800">
                        You'll have access to all <span className="text-gray-900 font-semibold">170 prepared responses</span> after setup.
                        These are just recommended starting points.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {state.step === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Enable intelligence monitoring</h2>
                    <p className="text-gray-800">
                      Turn on the signals that matter most to your strategic priorities
                    </p>
                  </div>

                  <div className="bg-[#0A0F2E]/5 border border-[#0A0F2E]/20 p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-[#0A0F2E]" />
                      <span className="text-sm text-gray-800">
                        Based on your priorities, we recommend these signal categories. Toggle them on to enable continuous signal monitoring.
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
                              ? 'bg-[#2B8A6E]/10 border-[#2B8A6E]/50' 
                              : 'bg-gray-50 border-[#E8E4DC]'
                          }`}
                          data-testid={`signal-${category.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div style={{ width: 3, alignSelf: 'stretch', background: isEnabled ? '#2B8A6E' : '#E8E4DC', flexShrink: 0 }} />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                                    {isRecommended && (
                                      <Badge variant="secondary" className="text-xs bg-[#C9A84C]/20 text-[#0A0F2E]">
                                        Recommended
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-800">{category.description}</p>
                                  <p className="text-xs text-gray-800 mt-1">
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

                  <div className="text-center text-sm text-gray-800">
                    {state.enabledSignals.length} of {SIGNAL_CATEGORIES.length} signal categories enabled
                  </div>
                </div>
              )}

              {state.step === 5 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Set your success targets</h2>
                    <p className="text-gray-800">
                      Define what success looks like for your organization
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <Card className="bg-gray-50 border-[#E8E4DC]">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div style={{ width: 3, alignSelf: 'stretch', background: '#0A0F2E', flexShrink: 0 }} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Future Readiness Index™ Target</h3>
                            <p className="text-sm text-gray-800 mb-4">
                              Your organization's strategic preparedness score across 5 dimensions
                            </p>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                value={state.friTarget}
                                onChange={(e) => updateState({ friTarget: Number(e.target.value) })}
                                className="w-24 bg-white border-[#E8E4DC] text-gray-900"
                                min={0}
                                max={100}
                                step={0.1}
                                data-testid="input-fri-target"
                              />
                              <span className="text-gray-800">%</span>
                              <Badge variant="secondary" className="bg-[#2B8A6E]/20 text-[#2B8A6E]">
                                Infrastructure-tier: 84.4%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#F8F7F4] border-[#E8E4DC] rounded-none">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div style={{ width: 3, alignSelf: 'stretch', background: '#2B8A6E', flexShrink: 0 }} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#0A0F2E] mb-1">Decision Velocity Target</h3>
                            <p className="text-sm text-[#6B7280] mb-4">
                              Target time from signal detection to live execution — roles assigned, tasks staged, teams moving
                            </p>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                value={state.velocityTarget}
                                onChange={(e) => updateState({ velocityTarget: Number(e.target.value) })}
                                className="w-24 bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none"
                                min={1}
                                max={60}
                                data-testid="input-velocity-target"
                              />
                              <span className="text-[#0A0F2E]">minutes</span>
                              <Badge variant="secondary" className="bg-[#2B8A6E]/20 text-[#2B8A6E] rounded-none">
                                Industry avg: 30 days
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#F8F7F4] border-[#E8E4DC] rounded-none">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div style={{ width: 3, background: '#C9A84C', alignSelf: 'stretch', flexShrink: 0 }} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#0A0F2E] mb-1">Prepared Response Coverage Target</h3>
                            <p className="text-sm text-[#6B7280] mb-4">
                              Percentage of critical scenarios with ready prepared responses
                            </p>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                value={state.coverageTarget}
                                onChange={(e) => updateState({ coverageTarget: Number(e.target.value) })}
                                className="w-24 bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none"
                                min={50}
                                max={100}
                                data-testid="input-coverage-target"
                              />
                              <span className="text-[#0A0F2E]">%</span>
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
                    <h2 className="text-3xl font-bold text-[#0A0F2E] mb-2">Your Command Center is Ready</h2>
                    <p className="text-[#6B7280]">
                      Here's what Readiness OS will monitor and execute for {state.organizationName || 'your organization'}
                    </p>
                  </div>

                  {/* Live Configuration Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="bg-white border-[#0A0F2E]/20 rounded-none">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-[#0A0F2E] mb-1">{state.enabledSignals.length}</div>
                        <div className="text-sm text-[#6B7280]">Signal Categories</div>
                        <div className="text-xs text-[#0A0F2E] mt-1">Monitoring {state.enabledSignals.length * 6}+ data points</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border-[#C9A84C]/20 rounded-none">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-[#C9A84C] mb-1">{state.selectedPlaybooks.length}</div>
                        <div className="text-sm text-[#6B7280]">Active Prepared responses</div>
                        <div className="text-xs text-[#C9A84C] mt-1">Ready for instant activation</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border-[#2B8A6E]/20 rounded-none">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-[#2B8A6E] mb-1">{state.velocityTarget}m</div>
                        <div className="text-sm text-[#6B7280]">Target Response</div>
                        <div className="text-xs text-[#2B8A6E] mt-1">vs 30-day industry baseline</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Live Signal Monitoring Preview */}
                  <Card className="bg-white border-[#E8E4DC] overflow-hidden rounded-none">
                    <CardHeader className=" border-b border-[#E8E4DC] py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#2B8A6E] animate-pulse" />
                          <span className="font-semibold text-[#0A0F2E] text-sm uppercase tracking-widest">LIVE SIGNAL MONITORING</span>
                        </div>
                        <Badge variant="outline" className="text-[#2B8A6E] border-[#2B8A6E]/50 text-xs rounded-none">
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
                              className="flex items-center justify-between p-3 bg-[#F8F7F4] rounded-none border border-[#E8E4DC]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-none bg-[#0A0F2E]/10 flex items-center justify-center">
                                  <Radio className="h-4 w-4 text-[#0A0F2E]" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-[#0A0F2E]">{category?.name || signalId}</div>
                                  <div className="text-xs text-[#6B7280]">{category?.dataPoints.length || 0} data points active</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-[#E8E4DC] rounded-none overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-[#2B8A6E]"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2, delay: index * 0.2 }}
                                  />
                                </div>
                                <span className="text-xs text-[#2B8A6E]">Connected</span>
                              </div>
                            </motion.div>
                          );
                        })}
                        {state.enabledSignals.length > 4 && (
                          <div className="text-center text-xs text-[#6B7280] py-2">
                            + {state.enabledSignals.length - 4} more signal categories monitoring
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Prepared Response Ready Status */}
                  <Card className="bg-white border-[#E8E4DC] overflow-hidden rounded-none">
                    <CardHeader className=" border-b border-[#E8E4DC] py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Layers className="w-4 h-4 text-[#C9A84C]" />
                          <span className="font-semibold text-[#0A0F2E] text-sm uppercase tracking-widest">PREPARED RESPONSES ARMED & READY</span>
                        </div>
                        <Badge className="bg-[#C9A84C]/20 text-[#0A0F2E] border-[#C9A84C]/50 text-xs rounded-none">
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
                              className="flex items-center justify-between p-3 bg-[#F8F7F4] rounded-none border border-[#E8E4DC]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-none bg-[#C9A84C]/20 flex items-center justify-center">
                                  <Shield className="w-4 h-4 text-[#C9A84C]" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-[#0A0F2E]">{playbook?.name || playbookId}</div>
                                  <div className="text-xs text-[#6B7280]">Triggers: {playbook?.triggers.join(', ')}</div>
                                </div>
                              </div>
                              <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] text-xs rounded-none">Ready</Badge>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* ROI Projection */}
                  <Card className="bg-[#2B8A6E]/5 border-[#2B8A6E]/30 rounded-none">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div style={{ width: 3, background: '#2B8A6E', alignSelf: 'stretch', flexShrink: 0 }} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#0A0F2E] mb-2">Projected Annual Value</h3>
                          <p className="text-sm text-[#6B7280] mb-4">
                            Based on {INDUSTRIES.find(i => i.id === state.industry)?.name || 'your industry'} benchmarks and your configuration
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white border border-[#E8E4DC] rounded-none">
                              <div className="text-xl font-bold text-[#2B8A6E]">$2.4M</div>
                              <div className="text-xs text-[#6B7280]">Risk Mitigation</div>
                            </div>
                            <div className="text-center p-3 bg-white border border-[#E8E4DC] rounded-none">
                              <div className="text-xl font-bold text-[#2B8A6E]">847hrs</div>
                              <div className="text-xs text-[#6B7280]">Executive Time Saved</div>
                            </div>
                            <div className="text-center p-3 bg-white border border-[#E8E4DC] rounded-none">
                              <div className="text-xl font-bold text-[#2B8A6E]">12x</div>
                              <div className="text-xs text-[#6B7280]">Faster Response</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* What Happens Next */}
                  <div className="bg-[#F8F7F4] rounded-none p-4 border border-[#E8E4DC]">
                    <h4 className="font-semibold text-[#0A0F2E] mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                      What happens when you complete setup:
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <CheckCircle className="w-4 h-4 text-[#2B8A6E]" />
                        {state.enabledSignals.length} triggers go live immediately
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <CheckCircle className="w-4 h-4 text-[#2B8A6E]" />
                        {state.selectedPlaybooks.length} prepared responses ready for activation
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <CheckCircle className="w-4 h-4 text-[#2B8A6E]" />
                        Real-time monitoring begins
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <CheckCircle className="w-4 h-4 text-[#2B8A6E]" />
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
                      className="w-24 h-24 rounded-none bg-[#2B8A6E] flex items-center justify-center mx-auto mb-6 border-b-4 border-[#C9A84C]"
                    >
                      <CheckCircle className="h-12 w-12 text-white" />
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-[#0A0F2E] mb-2"
                    >
                      Readiness OS is Now Active
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-[#6B7280] text-lg"
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
                    <Card className=" border-[#E8E4DC]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-[#2B8A6E]" />
                          What's Now Active
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white p-4 border border-[#E8E4DC] text-center">
                            <div className="text-3xl font-bold text-[#2B8A6E]">{state.enabledSignals.length}</div>
                            <div className="text-sm text-gray-800">Signal Categories</div>
                            <div className="text-xs text-[#2B8A6E] mt-1">Monitoring 24/7</div>
                          </div>
                          <div className="bg-white p-4 border border-[#E8E4DC] text-center">
                            <div className="text-3xl font-bold text-[#C9A84C]">{state.selectedPlaybooks.length}</div>
                            <div className="text-sm text-gray-800">Prepared responses</div>
                            <div className="text-xs text-[#C9A84C] mt-1">Armed & Ready</div>
                          </div>
                          <div className="bg-white p-4 border border-[#E8E4DC] text-center">
                            <div className="text-3xl font-bold text-[#0A0F2E]">{state.friTarget}%</div>
                            <div className="text-sm text-gray-800">FRI Target</div>
                            <div className="text-xs text-[#0A0F2E] mt-1">Tracking Active</div>
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
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-800" />
                      Your Configuration
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 border border-[#E8E4DC]">
                        <div className="text-xs text-gray-800 uppercase tracking-wider mb-1">Organization</div>
                        <div className="text-gray-900 font-medium">{state.organizationName}</div>
                        <div className="text-sm text-gray-800">{INDUSTRIES.find(i => i.id === state.industry)?.name}</div>
                      </div>
                      <div className="bg-gray-50 p-4 border border-[#E8E4DC]">
                        <div className="text-xs text-gray-800 uppercase tracking-wider mb-1">Strategic Focus</div>
                        <div className="text-gray-900 font-medium">{state.priorities.length} Priorities</div>
                        <div className="text-sm text-gray-800 truncate">
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
                    <Card className="bg-[#0A0F2E]/5 border-[#0A0F2E]/30">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                          Your First Actions in the Platform
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white border border-[#E8E4DC]">
                            <div className="w-8 h-8 bg-[#0A0F2E]/10 flex items-center justify-center text-[#0A0F2E] font-bold">1</div>
                            <div>
                              <div className="text-gray-900 font-medium">Review Your Dashboard</div>
                              <div className="text-sm text-gray-800">See your Future Readiness Index and active monitoring status</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white border border-[#E8E4DC]">
                            <div className="w-8 h-8 bg-[#0A0F2E]/10 flex items-center justify-center text-[#0A0F2E] font-bold">2</div>
                            <div>
                              <div className="text-gray-900 font-medium">Explore Your Prepared responses</div>
                              <div className="text-sm text-gray-800">Customize response protocols for your specific organization</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white border border-[#E8E4DC]">
                            <div className="w-8 h-8 bg-[#0A0F2E]/10 flex items-center justify-center text-[#0A0F2E] font-bold">3</div>
                            <div>
                              <div className="text-gray-900 font-medium">Visit Command Center</div>
                              <div className="text-sm text-gray-800">When a trigger fires, this is where 12-minute responses are orchestrated</div>
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
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#2B8A6E]/10 border border-[#2B8A6E]/30">
                      <div className="w-2 h-2 bg-[#2B8A6E] animate-pulse" />
                      <span className="text-sm text-[#2B8A6E] font-medium">All Systems Operational</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#0A0F2E]/10 border border-[#0A0F2E]/30">
                      <Radio className="w-3 h-3 text-[#0A0F2E]" />
                      <span className="text-sm text-[#0A0F2E] font-medium">Intelligence Monitoring Active</span>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white backdrop-blur-sm border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {state.step !== 7 ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={state.step === 0}
              className="text-gray-800 hover:text-white"
              data-testid="button-back"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div className="text-gray-800 text-sm">
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
                  className="border-[#0A0F2E]/50 text-[#0A0F2E] hover:bg-[#0A0F2E]/10 min-w-[180px]"
                  data-testid="button-command-center"
                >
                  <Radio className="h-4 w-4 mr-2" />
                  Command Center
                </Button>
                <Button
                  size="lg"
                  onClick={handleNext}
                  className="bg-[#2B8A6E] hover:bg-[#256B56] min-w-[220px] rounded-none font-bold uppercase tracking-widest text-xs"
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
                className="bg-[#2B8A6E] hover:bg-[#256B56] min-w-[200px] rounded-none font-bold uppercase tracking-widest text-xs"
                data-testid="button-complete"
              >
                {completeJourneyMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin mr-2" />
                    Activating Readiness OS...
                  </>
                ) : (
                  <>
                    Activate Readiness OS
                    <Zap className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-[#0A0F2E] hover:bg-[#141B45] text-white min-w-[160px] rounded-none font-bold uppercase tracking-widest text-xs"
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
    </PageLayout>
  );
}
