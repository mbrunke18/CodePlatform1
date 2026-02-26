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
  TrendingUp,
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
    color: 'text-[#0A0F2E]',
    bgColor: 'bg-[#0A0F2E]/10',
    borderColor: 'border-[#0A0F2E]/30',
  },
  {
    id: 'playbooks',
    title: 'Playbook Customization',
    description: 'Customize strategic response playbooks',
    icon: Layers,
    color: 'text-[#C9A84C]',
    bgColor: 'bg-[#C9A84C]/10',
    borderColor: 'border-[#C9A84C]/30',
  },
  {
    id: 'metrics',
    title: 'Success Metrics',
    description: 'Define your KPIs and targets',
    icon: BarChart3,
    color: 'text-[#2B8A6E]',
    bgColor: 'bg-[#2B8A6E]/10',
    borderColor: 'border-[#2B8A6E]/30',
  },
];

const Loader2 = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

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
      // Non-blocking
    },
  });

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const promises = [
        apiRequest('PATCH', '/api/organizations/current', {
          industry: orgData.industry,
          size: parseInt(orgData.employeeCount) || 0,
          settings: {
            integrations: integrationsData,
            triggers: triggerData,
            playbooks: playbookData
          }
        }).catch(() => {}),
        ...orgData.departments.map(dept => 
          apiRequest('POST', '/api/config/departments', { name: dept, description: `${dept} department` }).catch(() => {})
        ),
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
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    
    saveProgressMutation.mutate({
      step: ONBOARDING_STEPS[currentStep].id,
      completed: true,
      data: currentStep === 0 ? orgData : currentStep === 1 ? integrationsData : currentStep === 2 ? triggerData : currentStep === 3 ? playbookData : metricsData,
    });
    
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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

        <Card className="bg-white border-[#E8E4DC] rounded-none min-h-[400px]">
          <CardContent className="pt-8">
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
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-gray-800">Industry</Label>
                    <Select value={orgData.industry} onValueChange={(v) => setOrgData({ ...orgData, industry: v })}>
                      <SelectTrigger className="bg-gray-50 border-gray-200">
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
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Label className="text-gray-800 mb-3 block text-xs uppercase tracking-wider">Key Departments</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Executive', 'Operations', 'Finance', 'Legal', 'Communications', 'IT', 'HR', 'Sales', 'Marketing'].map((dept) => (
                      <Badge
                        key={dept}
                        variant={orgData.departments.includes(dept) ? 'default' : 'outline'}
                        className={`cursor-pointer rounded-none border-none ${
                          orgData.departments.includes(dept) 
                            ? 'bg-[#0A0F2E] text-white hover:bg-[#141B45]' 
                            : 'bg-[#F8F7F4] text-[#6B7280] hover:bg-[#E8E4DC]'
                        }`}
                        onClick={() => {
                          if (orgData.departments.includes(dept)) {
                            setOrgData({ ...orgData, departments: orgData.departments.filter(d => d !== dept) });
                          } else {
                            setOrgData({ ...orgData, departments: [...orgData.departments, dept] });
                          }
                        }}
                      >
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-gray-900 font-semibold">Integrations Platform</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gray-50 border-[#E8E4DC] rounded-none">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0A0F2E]/10 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-[#0A0F2E]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#0A0F2E]">Jira</p>
                            <p className="text-xs text-[#6B7280]">Project Tracking</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-[#E8E4DC] rounded-none text-[#0A0F2E]">Setup Later</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border-[#E8E4DC] rounded-none">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0A0F2E]/10 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-[#0A0F2E]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#0A0F2E]">Slack</p>
                            <p className="text-xs text-[#6B7280]">Communication</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-[#E8E4DC] rounded-none text-[#0A0F2E]">Setup Later</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0A0F2E] flex items-center gap-2 uppercase text-xs tracking-wider">
                      <Target className="h-4 w-4" />
                      Financial Thresholds
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-[#6B7280] text-[10px] uppercase">Revenue Variance (%)</Label>
                          <span className="text-sm font-bold text-[#0A0F2E]">{triggerData.revenueThreshold}%</span>
                        </div>
                        <Input 
                          type="range" 
                          min="1" max="20" step="0.5"
                          value={triggerData.revenueThreshold}
                          onChange={(e) => setTriggerData({ ...triggerData, revenueThreshold: parseFloat(e.target.value) })}
                          className="h-1.5 bg-[#E8E4DC] accent-[#0A0F2E]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0A0F2E] flex items-center gap-2 uppercase text-xs tracking-wider">
                      <Shield className="h-4 w-4" />
                      Intelligence Alerts
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 border border-[#E8E4DC]">
                        <div>
                          <p className="text-sm font-bold text-[#0A0F2E]">Competitor Intel</p>
                          <p className="text-[10px] text-[#6B7280]">Monitor competitor moves</p>
                        </div>
                        <Switch 
                          checked={triggerData.competitorAlertEnabled} 
                          onCheckedChange={(c) => setTriggerData({ ...triggerData, competitorAlertEnabled: c })}
                          className="data-[state=checked]:bg-[#2B8A6E]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-gray-900 font-semibold uppercase text-xs tracking-wider">Playbook Activation</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Crisis Response', 'Market Opportunity', 'M&A Integration'].map(pb => (
                      <div 
                        key={pb}
                        onClick={() => {
                          if (playbookData.selectedPlaybooks.includes(pb)) {
                            setPlaybookData({ ...playbookData, selectedPlaybooks: playbookData.selectedPlaybooks.filter(p => p !== pb) });
                          } else {
                            setPlaybookData({ ...playbookData, selectedPlaybooks: [...playbookData.selectedPlaybooks, pb] });
                          }
                        }}
                        className={`p-4 border cursor-pointer ${
                          playbookData.selectedPlaybooks.includes(pb)
                            ? 'bg-[#0A0F2E]/5 border-[#0A0F2E] border-l-4'
                            : 'bg-white border-[#E8E4DC]'
                        }`}
                      >
                        <span className="text-sm font-medium text-[#0A0F2E]">{pb}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="p-6 bg-[#0A0F2E] text-white flex items-center gap-6">
                  <TrendingUp className="h-8 w-8 text-[#C9A84C]" />
                  <div>
                    <h3 style={{ ...CG }} className="text-2xl font-bold">Future Readiness Index™</h3>
                    <p className="text-white/60 text-sm">Target performance baseline</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <Label className="text-gray-900 font-semibold uppercase text-xs tracking-wider">Primary Targets</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-[#6B7280] text-[10px] uppercase">Target FRI (%)</Label>
                          <span className="text-sm font-bold text-[#0A0F2E]">{metricsData.friTarget}%</span>
                        </div>
                        <Input 
                          type="range" min="50" max="100" step="0.1"
                          value={metricsData.friTarget}
                          onChange={(e) => setMetricsData({ ...metricsData, friTarget: parseFloat(e.target.value) })}
                          className="h-1.5 bg-[#E8E4DC] accent-[#0A0F2E]"
                        />
                      </div>
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
                onClick={handleNext}
                className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold px-8 rounded-none"
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
