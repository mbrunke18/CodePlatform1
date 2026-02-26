import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  AlertTriangle,
  Database,
} from 'lucide-react';

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const ONBOARDING_STEPS = [
  {
    id: 'organization',
    title: 'Organization Setup',
    description: 'Define your organizational structure',
    icon: Building2,
    color: 'text-[#0A0F2E]',
    bgColor: 'bg-[#0A0F2E]/10',
    borderColor: 'border-[#0A0F2E]/30',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect your project tracking and communication tools',
    icon: Zap,
    color: 'text-[#C9A84C]',
    bgColor: 'bg-[#C9A84C]/10',
    borderColor: 'border-[#C9A84C]/30',
  },
  {
    id: 'triggers',
    title: 'Trigger Configuration',
    description: 'Set up intelligence monitoring thresholds',
    icon: Target,
    color: 'text-[#2B8A6E]',
    bgColor: 'bg-[#2B8A6E]/10',
    borderColor: 'border-[#2B8A6E]/30',
  },
  {
    id: 'playbooks',
    title: 'Playbook Customization',
    description: 'Customize strategic response playbooks',
    icon: Layers,
    color: 'text-[#0A0F2E]',
    bgColor: 'bg-[#0A0F2E]/10',
    borderColor: 'border-[#0A0F2E]/30',
  },
  {
    id: 'metrics',
    title: 'Success Metrics',
    description: 'Define your KPIs and targets',
    icon: BarChart3,
    color: 'text-[#C9A84C]',
    bgColor: 'bg-[#C9A84C]/10',
    borderColor: 'border-[#C9A84C]/30',
  },
];

export default function OnboardingWizard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [seedSampleData, setSeedSampleData] = useState(false);
  
  // Organization data
  const [orgData, setOrgData] = useState({
    companyName: '',
    industry: '',
    employeeCount: '',
    departments: ['Executive', 'Operations', 'Finance', 'Legal', 'Communications'],
    primaryContact: '',
    primaryEmail: '',
  });

  // Integrations data
  const [integrationsData, setIntegrationsData] = useState({
    projectTracking: 'jira',
    communication: 'slack',
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
        integrationsData,
        triggerData,
        playbookData,
        metricsData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/setup-progress'] });
    },
    onError: () => {
      // Non-blocking — progress save failed but user can continue
    },
  });

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      // Save all configuration data
      const promises = [
        // Update organization info
        apiRequest('PATCH', '/api/organizations/current', {
          industry: orgData.industry,
          size: parseInt(orgData.employeeCount) || 0,
          settings: {
            integrations: integrationsData,
            triggers: triggerData,
            playbooks: playbookData
          }
        }).catch(() => {}),
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

      // Mark onboarding complete — this sets onboardingCompleted: true on the org
      await apiRequest('POST', '/api/onboarding/complete', {}).catch(() => {});

      return { success: true };
    },
    onSuccess: async () => {
      if (seedSampleData) {
        try {
          await apiRequest('POST', '/api/onboarding/seed-demo-data', {});
        } catch {
          // non-fatal
        }
      }
      toast({
        title: 'Onboarding Complete!',
        description: seedSampleData
          ? 'Your workspace is set up with sample data. Welcome to Execution OS!'
          : 'Your Execution OS platform is configured and ready to use.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setLocation('/dashboard');
    },
    onError: () => {
      toast({
        title: 'Setup Complete',
        description: 'Your configuration has been saved. Welcome to Execution OS!',
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
      data: currentStep === 0 ? orgData : currentStep === 1 ? integrationsData : currentStep === 2 ? triggerData : currentStep === 3 ? playbookData : metricsData,
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
      <div style={{ background: "#0A0F2E", padding: "40px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
          backgroundSize: "44px 44px" 
        }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Onboarding</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.1, color: "#fff" }}>
                Platform <em style={{ fontStyle: "italic", color: "#DFC178" }}>Activation Wizard</em>
              </h1>
              <p className="text-white/60 mt-1 max-w-2xl">
                Initialize your enterprise execution workspace and configure core intelligence parameters
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 py-12">
        {/* Progress Header */}
        <Card className="bg-white border-[#E8E4DC] rounded-none">
          <CardContent className="pt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div style={{ width: 48, height: 48, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <StepIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#0A0F2E" }}>{currentStepInfo.title}</h2>
                <p className="text-sm text-[#6B7280]">{currentStepInfo.description}</p>
              </div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </div>
          </div>
          
          <div className="w-full bg-[#E8E4DC] h-1.5 mb-8 overflow-hidden">
            <div 
              className="bg-[#C9A84C] h-full transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
            
            {/* Step indicators */}
            <div className="flex justify-between">
              {ONBOARDING_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(index);
                const isCurrent = index === currentStep;
                
                return (
                  <div 
                    key={step.id}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div 
                      style={{ 
                        width: 32, 
                        height: 32, 
                        background: isCurrent ? "#0A0F2E" : isCompleted ? "#2B8A6E" : "#F8F7F4",
                        border: isCurrent ? "none" : isCompleted ? "none" : "1px solid #E8E4DC",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isCurrent || isCompleted ? "#fff" : "#6B7280"
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span 
                      style={{ 
                        fontSize: 8, 
                        fontWeight: 700, 
                        letterSpacing: "0.1em", 
                        textTransform: "uppercase", 
                        color: isCurrent ? "#0A0F2E" : "#6B7280"
                      }} 
                      className="hidden md:block"
                    >
                      {step.id}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="bg-white border-[#E8E4DC] rounded-none min-h-[400px]">
          <CardContent className="pt-8">
            {/* Step 1: Organization Setup */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-800">Company Name</Label>
                    <Input
                      id="companyName"
                      value={orgData.companyName}
                      onChange={(e) => setOrgData({ ...orgData, companyName: e.target.value })}
                      placeholder="Enter your company name"
                      className="bg-gray-50 border-gray-200"
                      data-testid="input-company-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-gray-800">Industry</Label>
                    <Select value={orgData.industry} onValueChange={(v) => setOrgData({ ...orgData, industry: v })}>
                      <SelectTrigger className="bg-gray-50 border-gray-200" data-testid="select-industry">
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
                    <Label htmlFor="employeeCount" className="text-gray-800">Employee Count</Label>
                    <Select value={orgData.employeeCount} onValueChange={(v) => setOrgData({ ...orgData, employeeCount: v })}>
                      <SelectTrigger className="bg-gray-50 border-gray-200" data-testid="select-employees">
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
                    <Label htmlFor="primaryContact" className="text-gray-800">Primary Contact</Label>
                    <Input
                      id="primaryContact"
                      value={orgData.primaryContact}
                      onChange={(e) => setOrgData({ ...orgData, primaryContact: e.target.value })}
                      placeholder="Name of primary executive sponsor"
                      className="bg-gray-50 border-gray-200"
                      data-testid="input-primary-contact"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Label className="text-gray-800 mb-3 block">Key Departments (will be included in playbook coordination)</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Executive', 'Operations', 'Finance', 'Legal', 'Communications', 'IT', 'HR', 'Sales', 'Marketing'].map((dept) => (
                      <Badge
                        key={dept}
                        variant={orgData.departments.includes(dept) ? 'default' : 'outline'}
                        className={`cursor-pointer rounded-none ${
                          orgData.departments.includes(dept) 
                            ? 'bg-[#0A0F2E] text-white hover:bg-[#141B45] border-[#0A0F2E]' 
                            : 'hover:bg-[#F8F7F4] text-[#0A0F2E] border-[#E8E4DC]'
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

            {/* Step 2: Integrations */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-gray-900 font-semibold">What do you use for project tracking?</Label>
                  <Select value={integrationsData.projectTracking} onValueChange={(v) => setIntegrationsData({ ...integrationsData, projectTracking: v })}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select tool" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jira">Jira (OAuth 2.0)</SelectItem>
                      <SelectItem value="azure-devops">Azure DevOps (Coming Soon)</SelectItem>
                      <SelectItem value="asana">Asana (Coming Soon)</SelectItem>
                      <SelectItem value="monday">Monday.com (Coming Soon)</SelectItem>
                      <SelectItem value="linear">Linear (Coming Soon)</SelectItem>
                      <SelectItem value="shortcut">Shortcut (Coming Soon)</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4">
                  <Label className="text-gray-900 font-semibold">What do you use for communication?</Label>
                  <Select value={integrationsData.communication} onValueChange={(v) => setIntegrationsData({ ...integrationsData, communication: v })}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select tool" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slack">Slack (OAuth 2.0)</SelectItem>
                      <SelectItem value="teams">Microsoft Teams (Coming Soon)</SelectItem>
                      <SelectItem value="google-chat">Google Chat (Coming Soon)</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Connect Integrations</h3>
                    <span className="text-xs bg-[#C9A84C]/10 text-[#C9A84C] font-medium px-2 py-1 rounded">Optional — set up after onboarding</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gray-50 border-gray-200 rounded-none">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0A0F2E]/10 rounded-none flex items-center justify-center">
                            <Layers className="h-5 w-5 text-[#0A0F2E]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Jira</p>
                            <p className="text-xs text-gray-800">Project tracking</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="rounded-none border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]"
                          onClick={() => {
                            toast({
                              title: 'Jira Integration',
                              description: 'Connect Jira from the Integration Hub after completing onboarding.',
                            });
                          }}
                        >
                          Set Up Later
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border-gray-200 rounded-none">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0A0F2E]/10 rounded-none flex items-center justify-center">
                            <Bell className="h-5 w-5 text-[#0A0F2E]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Slack</p>
                            <p className="text-xs text-gray-800">Team communication</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="rounded-none border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]"
                          onClick={() => {
                            toast({
                              title: 'Slack Integration',
                              description: 'Connect Slack from the Integration Hub after completing onboarding.',
                            });
                          }}
                        >
                          Set Up Later
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  <p className="text-xs text-gray-800 italic text-center">
                    Integrations can be connected from the Integration Hub at any time after onboarding
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Trigger Configuration */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="revenueThreshold" className="text-gray-800">Revenue Risk Threshold (%)</Label>
                    <Input
                      id="revenueThreshold"
                      type="number"
                      value={triggerData.revenueThreshold}
                      onChange={(e) => setTriggerData({ ...triggerData, revenueThreshold: parseInt(e.target.value) })}
                      className="bg-gray-50 border-gray-200"
                    />
                    <p className="text-[10px] text-gray-500 italic">Trigger alert when revenue deviation exceeds this %</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marketShareThreshold" className="text-gray-800">Market Share Risk Threshold (%)</Label>
                    <Input
                      id="marketShareThreshold"
                      type="number"
                      value={triggerData.marketShareThreshold}
                      onChange={(e) => setTriggerData({ ...triggerData, marketShareThreshold: parseInt(e.target.value) })}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sentimentThreshold" className="text-gray-800">Social Sentiment Threshold (%)</Label>
                    <Input
                      id="sentimentThreshold"
                      type="number"
                      value={triggerData.sentimentThreshold}
                      onChange={(e) => setTriggerData({ ...triggerData, sentimentThreshold: parseInt(e.target.value) })}
                      className="bg-gray-50 border-gray-200"
                    />
                    <p className="text-[10px] text-gray-500 italic">Negative sentiment spike required to trigger alert</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <h3 className="font-semibold text-gray-900">Intelligence Scanning</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-[#2B8A6E]" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Competitor Monitoring</p>
                          <p className="text-xs text-[#6B7280]">Scan filings, news, and releases</p>
                        </div>
                      </div>
                      <Switch 
                        checked={triggerData.competitorAlertEnabled}
                        onCheckedChange={(v) => setTriggerData({ ...triggerData, competitorAlertEnabled: v })}
                        className="data-[state=checked]:bg-[#2B8A6E]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-[#0A0F2E]" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Regulatory Scanning</p>
                          <p className="text-xs text-[#6B7280]">Track legislative and regulatory shifts</p>
                        </div>
                      </div>
                      <Switch 
                        checked={triggerData.regulatoryAlertEnabled}
                        onCheckedChange={(v) => setTriggerData({ ...triggerData, regulatoryAlertEnabled: v })}
                        className="data-[state=checked]:bg-[#2B8A6E]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-[#C9A84C]" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Media Sentiment Radar</p>
                          <p className="text-xs text-[#6B7280]">Real-time public perception tracking</p>
                        </div>
                      </div>
                      <Switch 
                        checked={triggerData.mediaAlertEnabled}
                        onCheckedChange={(v) => setTriggerData({ ...triggerData, mediaAlertEnabled: v })}
                        className="data-[state=checked]:bg-[#2B8A6E]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Playbook Customization */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-gray-900 font-semibold">Select core playbooks to activate:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Crisis Response', 
                      'Market Opportunity', 
                      'Competitive Response', 
                      'Regulatory Compliance', 
                      'Supply Chain Resiliency',
                      'Executive Transition'
                    ].map(playbook => (
                      <div 
                        key={playbook}
                        className={`p-3 border cursor-pointer flex items-center justify-between ${
                          playbookData.selectedPlaybooks.includes(playbook)
                            ? 'bg-[#0A0F2E]/5 border-[#0A0F2E]'
                            : 'bg-white border-gray-200 hover:border-[#DFC178]'
                        }`}
                        onClick={() => {
                          if (playbookData.selectedPlaybooks.includes(playbook)) {
                            setPlaybookData({ ...playbookData, selectedPlaybooks: playbookData.selectedPlaybooks.filter(p => p !== playbook) });
                          } else {
                            setPlaybookData({ ...playbookData, selectedPlaybooks: [...playbookData.selectedPlaybooks, playbook] });
                          }
                        }}
                      >
                        <span className="text-sm font-medium">{playbook}</span>
                        {playbookData.selectedPlaybooks.includes(playbook) && (
                          <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <Label htmlFor="responseTime" className="text-gray-800">Target Response Time (Hours)</Label>
                    <Select 
                      value={playbookData.responseTimeTarget.toString()} 
                      onValueChange={(v) => setPlaybookData({ ...playbookData, responseTimeTarget: parseInt(v) })}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Hours (Immediate)</SelectItem>
                        <SelectItem value="4">4 Hours (High Velocity)</SelectItem>
                        <SelectItem value="12">12 Hours (Standard)</SelectItem>
                        <SelectItem value="24">24 Hours (Thorough)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetThreshold" className="text-gray-800">Default Auth Threshold ($)</Label>
                    <Input
                      id="budgetThreshold"
                      type="number"
                      value={playbookData.defaultBudgetThreshold}
                      onChange={(e) => setPlaybookData({ ...playbookData, defaultBudgetThreshold: parseInt(e.target.value) })}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-[#C9A84C]" />
                    <div>
                      <p className="text-sm font-bold text-[#0A0F2E]">Auto-Escalation Engine</p>
                      <p className="text-xs text-[#6B7280]">Automatically escalate if response SLAs are breached</p>
                    </div>
                  </div>
                  <Switch 
                    checked={playbookData.autoEscalationEnabled}
                    onCheckedChange={(v) => setPlaybookData({ ...playbookData, autoEscalationEnabled: v })}
                    className="data-[state=checked]:bg-[#2B8A6E]"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Success Metrics */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Define Your KPIs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-gray-800">Target Future Readiness Index (%)</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={metricsData.friTarget} className="h-2 bg-gray-100 [&>div]:bg-[#C9A84C]" />
                        </div>
                        <span className="font-bold text-[#0A0F2E]">{metricsData.friTarget}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        step="0.1"
                        value={metricsData.friTarget}
                        onChange={(e) => setMetricsData({ ...metricsData, friTarget: parseFloat(e.target.value) })}
                        className="w-full accent-[#0A0F2E]"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-800">Target Decision Velocity (Minutes)</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={100 - (metricsData.velocityTarget / 120 * 100)} className="h-2 bg-gray-100 [&>div]:bg-[#C9A84C]" />
                        </div>
                        <span className="font-bold text-[#2B8A6E]">{metricsData.velocityTarget}m</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
max="120" 
                        step="1"
                        value={metricsData.velocityTarget}
                        onChange={(e) => setMetricsData({ ...metricsData, velocityTarget: parseInt(e.target.value) })}
                        className="w-full accent-[#2B8A6E]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <Label className="text-gray-800">Review & Governance Cadence</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {['daily', 'weekly', 'monthly'].map(cadence => (
                        <div 
                          key={cadence}
                          className={`p-4 border text-center cursor-pointer font-bold text-[10px] uppercase tracking-widest ${
                            metricsData.reviewCadence === cadence
                              ? 'bg-[#0A0F2E] text-white border-[#0A0F2E]'
                              : 'bg-white text-[#6B7280] border-gray-200 hover:border-[#DFC178]'
                          }`}
                          onClick={() => setMetricsData({ ...metricsData, reviewCadence: cadence as any })}
                        >
                          {cadence}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-[#0A0F2E] text-white space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#C9A84C] flex items-center justify-center">
                        <Rocket className="h-5 w-5 text-[#0A0F2E]" />
                      </div>
                      <div>
                        <h4 style={{ ...CG, fontSize: 18 }}>Ready for Launch</h4>
                        <p className="text-xs text-white/60">Configure your workspace with sample demo data to explore capabilities immediately</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-sm font-medium">Seed sample intelligence and playbooks</span>
                      <Switch 
                        checked={seedSampleData}
                        onCheckedChange={setSeedSampleData}
                        className="data-[state=checked]:bg-[#C9A84C]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex items-center justify-between border-t border-[#E8E4DC] p-6 bg-[#F8F7F4] rounded-none">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="border-[#E8E4DC] text-[#0A0F2E] hover:bg-white rounded-none"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setLocation('/dashboard')}
                className="text-gray-500 text-xs uppercase tracking-widest font-bold rounded-none"
              >
                Skip to Dashboard
              </Button>
              <Button
                onClick={handleNext}
                disabled={saveProgressMutation.isPending || completeOnboardingMutation.isPending}
                className="bg-[#0A0F2E] text-white hover:bg-[#141B45] font-bold px-8 rounded-none"
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? (
                  completeOnboardingMutation.isPending ? 'Finalizing...' : 'Complete Setup'
                ) : (
                  <>
                    Next Step
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
}
