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
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { 
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
  Rocket,
  Settings,
  AlertTriangle
} from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    id: 'organization',
    title: 'Organization Setup',
    description: 'Define your organizational structure',
    icon: Building2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'triggers',
    title: 'Trigger Configuration',
    description: 'Set up intelligence monitoring thresholds',
    icon: Target,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 'playbooks',
    title: 'Playbook Customization',
    description: 'Customize strategic response playbooks',
    icon: Layers,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  {
    id: 'metrics',
    title: 'Success Metrics',
    description: 'Define your KPIs and targets',
    icon: BarChart3,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
];

export default function OnboardingWizard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  // Organization data
  const [orgData, setOrgData] = useState({
    companyName: '',
    industry: '',
    employeeCount: '',
    departments: ['Executive', 'Operations', 'Finance', 'Legal', 'Communications'],
    primaryContact: '',
    primaryEmail: '',
  });
  
  // Trigger data
  const [triggerData, setTriggerData] = useState({
    revenueThreshold: 5,
    marketShareThreshold: 3,
    sentimentThreshold: -15,
    competitorAlertEnabled: true,
    regulatoryAlertEnabled: true,
    mediaAlertEnabled: true,
  });
  
  // Playbook data
  const [playbookData, setPlaybookData] = useState({
    selectedPlaybooks: ['Crisis Response', 'Market Opportunity', 'Competitive Response'],
    responseTimeTarget: 12,
    autoEscalationEnabled: true,
    defaultBudgetThreshold: 100000,
  });
  
  // Metrics data
  const [metricsData, setMetricsData] = useState({
    friTarget: 84.4,
    velocityTarget: 12,
    coverageTarget: 95,
    reviewCadence: 'weekly',
  });

  // Fetch existing progress
  const { data: existingProgress } = useQuery({
    queryKey: ['/api/config/setup-progress', 'default'],
  });

  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (data: { step: string; completed: boolean; data: any }) => {
      return apiRequest('PATCH', '/api/config/setup-progress/default', {
        currentStep: currentStep,
        completedSteps: Array.from(completedSteps),
        orgData,
        triggerData,
        playbookData,
        metricsData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/setup-progress'] });
    },
  });

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      // Save all configuration data
      const promises = [
        // Save departments
        ...orgData.departments.map(dept => 
          apiRequest('POST', '/api/config/departments', { name: dept, description: `${dept} department` }).catch(() => {})
        ),
        // Save success metrics
        apiRequest('POST', '/api/config/success-metrics', {
          name: 'Future Readiness Index',
          metricType: 'fri',
          targetValue: metricsData.friTarget,
          currentValue: 72.3,
          baselineValue: 58.1,
          unit: '%',
          reviewCadence: metricsData.reviewCadence,
        }).catch(() => {}),
        apiRequest('POST', '/api/config/success-metrics', {
          name: 'Decision Velocity',
          metricType: 'velocity',
          targetValue: metricsData.velocityTarget,
          currentValue: 18,
          baselineValue: 45,
          unit: 'minutes',
          reviewCadence: 'daily',
        }).catch(() => {}),
      ];
      
      await Promise.all(promises);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: 'Onboarding Complete!',
        description: 'Your M platform is now configured and ready to use.',
      });
      setLocation('/dashboard');
    },
    onError: () => {
      toast({
        title: 'Setup Complete',
        description: 'Your configuration has been saved. Welcome to M!',
      });
      setLocation('/dashboard');
    },
  });

  const handleNext = () => {
    // Mark current step as completed
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    
    // Save progress
    saveProgressMutation.mutate({
      step: ONBOARDING_STEPS[currentStep].id,
      completed: true,
      data: currentStep === 0 ? orgData : currentStep === 1 ? triggerData : currentStep === 2 ? playbookData : metricsData,
    });
    
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      completeOnboardingMutation.mutate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const currentStepInfo = ONBOARDING_STEPS[currentStep];
  const StepIcon = currentStepInfo.icon;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Progress Header */}
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${currentStepInfo.bgColor} flex items-center justify-center`}>
                  <StepIcon className={`h-6 w-6 ${currentStepInfo.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{currentStepInfo.title}</h2>
                  <p className="text-sm text-slate-400">{currentStepInfo.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-slate-300">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </Badge>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            {/* Step indicators */}
            <div className="flex justify-between mt-4">
              {ONBOARDING_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(index);
                const isCurrent = index === currentStep;
                
                return (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-2 ${
                      isCurrent ? step.color : isCompleted ? 'text-green-500' : 'text-slate-500'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent ? step.bgColor : isCompleted ? 'bg-green-500/10' : 'bg-slate-800'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-xs hidden md:block">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="bg-slate-900 border-slate-700 min-h-[400px]">
          <CardContent className="pt-6">
            {/* Step 1: Organization Setup */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-slate-300">Company Name</Label>
                    <Input
                      id="companyName"
                      value={orgData.companyName}
                      onChange={(e) => setOrgData({ ...orgData, companyName: e.target.value })}
                      placeholder="Enter your company name"
                      className="bg-slate-800 border-slate-700"
                      data-testid="input-company-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-slate-300">Industry</Label>
                    <Select value={orgData.industry} onValueChange={(v) => setOrgData({ ...orgData, industry: v })}>
                      <SelectTrigger className="bg-slate-800 border-slate-700" data-testid="select-industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="financial">Financial Services</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail & Consumer</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="energy">Energy & Utilities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount" className="text-slate-300">Employee Count</Label>
                    <Select value={orgData.employeeCount} onValueChange={(v) => setOrgData({ ...orgData, employeeCount: v })}>
                      <SelectTrigger className="bg-slate-800 border-slate-700" data-testid="select-employees">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                        <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
                        <SelectItem value="10000-50000">10,000 - 50,000</SelectItem>
                        <SelectItem value="50000+">50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primaryContact" className="text-slate-300">Primary Contact</Label>
                    <Input
                      id="primaryContact"
                      value={orgData.primaryContact}
                      onChange={(e) => setOrgData({ ...orgData, primaryContact: e.target.value })}
                      placeholder="Name of primary executive sponsor"
                      className="bg-slate-800 border-slate-700"
                      data-testid="input-primary-contact"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                  <Label className="text-slate-300 mb-3 block">Key Departments (will be included in playbook coordination)</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Executive', 'Operations', 'Finance', 'Legal', 'Communications', 'IT', 'HR', 'Sales', 'Marketing'].map((dept) => (
                      <Badge
                        key={dept}
                        variant={orgData.departments.includes(dept) ? 'default' : 'outline'}
                        className={`cursor-pointer ${
                          orgData.departments.includes(dept) 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'hover:bg-slate-700'
                        }`}
                        onClick={() => {
                          if (orgData.departments.includes(dept)) {
                            setOrgData({ ...orgData, departments: orgData.departments.filter(d => d !== dept) });
                          } else {
                            setOrgData({ ...orgData, departments: [...orgData.departments, dept] });
                          }
                        }}
                        data-testid={`badge-dept-${dept.toLowerCase()}`}
                      >
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Trigger Configuration */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <p className="text-slate-400 mb-4">
                  Configure the thresholds that will trigger strategic alerts and playbook recommendations.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
                        <BarChart3 className="h-4 w-4" />
                        Revenue Impact Threshold
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          value={triggerData.revenueThreshold}
                          onChange={(e) => setTriggerData({ ...triggerData, revenueThreshold: Number(e.target.value) })}
                          className="bg-slate-900 border-slate-600 w-24"
                          data-testid="input-revenue-threshold"
                        />
                        <span className="text-slate-400">% change triggers alert</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-purple-400">
                        <Target className="h-4 w-4" />
                        Market Share Threshold
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          value={triggerData.marketShareThreshold}
                          onChange={(e) => setTriggerData({ ...triggerData, marketShareThreshold: Number(e.target.value) })}
                          className="bg-slate-900 border-slate-600 w-24"
                          data-testid="input-market-threshold"
                        />
                        <span className="text-slate-400">% shift triggers alert</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        Sentiment Threshold
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          value={triggerData.sentimentThreshold}
                          onChange={(e) => setTriggerData({ ...triggerData, sentimentThreshold: Number(e.target.value) })}
                          className="bg-slate-900 border-slate-600 w-24"
                          data-testid="input-sentiment-threshold"
                        />
                        <span className="text-slate-400">% negative swing</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="pt-4 border-t border-slate-700 space-y-4">
                  <h3 className="font-semibold text-white">Alert Categories</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white">Competitor Alerts</p>
                        <p className="text-xs text-slate-400">Monitor competitor moves and market positioning</p>
                      </div>
                    </div>
                    <Switch 
                      checked={triggerData.competitorAlertEnabled}
                      onCheckedChange={(v) => setTriggerData({ ...triggerData, competitorAlertEnabled: v })}
                      data-testid="switch-competitor-alerts"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <div>
                        <p className="text-white">Regulatory Alerts</p>
                        <p className="text-xs text-slate-400">Track regulatory changes and compliance risks</p>
                      </div>
                    </div>
                    <Switch 
                      checked={triggerData.regulatoryAlertEnabled}
                      onCheckedChange={(v) => setTriggerData({ ...triggerData, regulatoryAlertEnabled: v })}
                      data-testid="switch-regulatory-alerts"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white">Media & PR Alerts</p>
                        <p className="text-xs text-slate-400">Monitor brand mentions and sentiment shifts</p>
                      </div>
                    </div>
                    <Switch 
                      checked={triggerData.mediaAlertEnabled}
                      onCheckedChange={(v) => setTriggerData({ ...triggerData, mediaAlertEnabled: v })}
                      data-testid="switch-media-alerts"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Playbook Customization */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <p className="text-slate-400 mb-4">
                  Select and configure the strategic playbooks your organization will use.
                </p>
                
                <div className="space-y-4">
                  <Label className="text-slate-300">Selected Playbook Categories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'Crisis Response', icon: AlertTriangle, color: 'text-red-400' },
                      { id: 'Market Opportunity', icon: Rocket, color: 'text-green-400' },
                      { id: 'Competitive Response', icon: Target, color: 'text-blue-400' },
                      { id: 'M&A Integration', icon: Layers, color: 'text-purple-400' },
                      { id: 'Regulatory Compliance', icon: Shield, color: 'text-amber-400' },
                      { id: 'Digital Transformation', icon: Zap, color: 'text-cyan-400' },
                    ].map((playbook) => (
                      <Card
                        key={playbook.id}
                        className={`cursor-pointer transition-all ${
                          playbookData.selectedPlaybooks.includes(playbook.id)
                            ? 'bg-slate-700 border-green-500/50'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                        }`}
                        onClick={() => {
                          if (playbookData.selectedPlaybooks.includes(playbook.id)) {
                            setPlaybookData({
                              ...playbookData,
                              selectedPlaybooks: playbookData.selectedPlaybooks.filter(p => p !== playbook.id)
                            });
                          } else {
                            setPlaybookData({
                              ...playbookData,
                              selectedPlaybooks: [...playbookData.selectedPlaybooks, playbook.id]
                            });
                          }
                        }}
                        data-testid={`card-playbook-${playbook.id.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <CardContent className="pt-4 pb-4 flex items-center gap-3">
                          <playbook.icon className={`h-5 w-5 ${playbook.color}`} />
                          <span className="text-sm text-white">{playbook.id}</span>
                          {playbookData.selectedPlaybooks.includes(playbook.id) && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700">
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Target Response Time
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={playbookData.responseTimeTarget}
                        onChange={(e) => setPlaybookData({ ...playbookData, responseTimeTarget: Number(e.target.value) })}
                        className="bg-slate-800 border-slate-700 w-24"
                        data-testid="input-response-time"
                      />
                      <span className="text-slate-400">minutes</span>
                    </div>
                    <p className="text-xs text-slate-500">Industry benchmark: 12 minutes</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Default Budget Threshold</Label>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">$</span>
                      <Input
                        type="number"
                        value={playbookData.defaultBudgetThreshold}
                        onChange={(e) => setPlaybookData({ ...playbookData, defaultBudgetThreshold: Number(e.target.value) })}
                        className="bg-slate-800 border-slate-700"
                        data-testid="input-budget-threshold"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Pre-approved spend per activation</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-amber-400" />
                    <div>
                      <p className="text-white">Auto-Escalation</p>
                      <p className="text-xs text-slate-400">Automatically escalate if response time exceeds target</p>
                    </div>
                  </div>
                  <Switch 
                    checked={playbookData.autoEscalationEnabled}
                    onCheckedChange={(v) => setPlaybookData({ ...playbookData, autoEscalationEnabled: v })}
                    data-testid="switch-auto-escalation"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Success Metrics */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="text-slate-400 mb-4">
                  Define the key performance indicators that will measure your strategic execution success.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
                        <Sparkles className="h-4 w-4" />
                        Future Readiness Index™ Target
                      </CardTitle>
                      <CardDescription className="text-xs">Overall organizational preparedness score</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          step="0.1"
                          value={metricsData.friTarget}
                          onChange={(e) => setMetricsData({ ...metricsData, friTarget: Number(e.target.value) })}
                          className="bg-slate-900 border-slate-600 w-24"
                          data-testid="input-fri-target"
                        />
                        <span className="text-slate-400">%</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Recommended: 84.4% (top quartile)</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-green-400">
                        <Zap className="h-4 w-4" />
                        Decision Velocity Target
                      </CardTitle>
                      <CardDescription className="text-xs">Time from trigger to coordinated response</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          value={metricsData.velocityTarget}
                          onChange={(e) => setMetricsData({ ...metricsData, velocityTarget: Number(e.target.value) })}
                          className="bg-slate-900 border-slate-600 w-24"
                          data-testid="input-velocity-target"
                        />
                        <span className="text-slate-400">minutes</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Industry average: 45 minutes</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-purple-400">
                        <Shield className="h-4 w-4" />
                        Scenario Coverage Target
                      </CardTitle>
                      <CardDescription className="text-xs">Percentage of risks with active playbooks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          value={metricsData.coverageTarget}
                          onChange={(e) => setMetricsData({ ...metricsData, coverageTarget: Number(e.target.value) })}
                          className="bg-slate-900 border-slate-600 w-24"
                          data-testid="input-coverage-target"
                        />
                        <span className="text-slate-400">%</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Recommended: 95% coverage</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
                        <Clock className="h-4 w-4" />
                        Review Cadence
                      </CardTitle>
                      <CardDescription className="text-xs">How often metrics are reviewed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select 
                        value={metricsData.reviewCadence} 
                        onValueChange={(v) => setMetricsData({ ...metricsData, reviewCadence: v })}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-600" data-testid="select-review-cadence">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
            data-testid="button-back"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={completeOnboardingMutation.isPending}
            data-testid="button-next"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <>
                Complete Setup
                <Rocket className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setLocation('/dashboard')}
            className="text-slate-500 hover:text-slate-300"
            data-testid="button-skip"
          >
            Skip for now and explore the platform
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
