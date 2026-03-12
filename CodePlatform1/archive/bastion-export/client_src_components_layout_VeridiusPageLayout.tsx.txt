import { ReactNode, useState } from 'react';
import bastionLogo from '@assets/bastion-logo.png';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link, useLocation } from 'wouter';
import { 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  Bell,
  User,
  Search,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { renderIcon } from '@/lib/iconRenderer';
import { 
  workflowPhases, 
  workflowSteps, 
  getStepsByPhase, 
  getPhaseByRoute, 
  getNextStep, 
  getCurrentStepNumber, 
  getTotalSteps, 
  getProgressPercentage,
  WorkflowPhase 
} from '@/navigation/workflow';

interface VeridiusPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function VeridiusPageLayout({ children, className = "" }: VeridiusPageLayoutProps) {
  const [location] = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    detection: true,
    planning: false,
    response: false,
    execution: false,
    measurement: false
  });

  // Workflow-based navigation calculations
  const currentPhase = getPhaseByRoute(location);
  const currentStepNumber = getCurrentStepNumber(location);
  const totalSteps = getTotalSteps();
  const progressPercentage = getProgressPercentage(location);
  const nextStep = getNextStep(location);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  return (
    <div className={`h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white relative overflow-hidden ${className}`}>
      {/* Sophisticated background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-indigo-900/5 to-purple-900/5" />
      
      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        
        {/* Executive Sidebar Navigation */}
        <div className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-950/90 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 flex-shrink-0`}>
          
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <img 
                    src={bastionLogo} 
                    alt="Bastion Logo" 
                    className="h-10 w-auto"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-white">Bastion</h1>
                    <p className="text-sm text-slate-400">Certainty, Engineered.</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="text-slate-400 hover:text-white"
                data-testid="sidebar-toggle"
              >
                {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Workflow Progress Indicator */}
          {!isSidebarCollapsed && (
            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-950/30 to-purple-950/30">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Your Progress</span>
                  <span className="text-blue-400 font-bold">Step {currentStepNumber} of {totalSteps}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="text-xs text-slate-400">
                  {currentPhase ? `Current: ${workflowPhases[currentPhase].label}` : 'Select a feature to begin'}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="p-4 space-y-4 h-[calc(100vh-280px)] overflow-y-auto">
            {/* Workflow-Based Navigation */}
            <div className="space-y-3">
              {Object.values(workflowPhases).sort((a, b) => a.orderNumber - b.orderNumber).map((phase) => {
                const phaseSteps = getStepsByPhase(phase.id);
                const isCurrentPhase = currentPhase === phase.id;
                const isExpanded = expandedPhases[phase.id];
                const phaseCompleted = phase.orderNumber < (workflowPhases[currentPhase!]?.orderNumber || 0);

                return (
                  <div key={phase.id} className={`border rounded-lg transition-all ${
                    isCurrentPhase 
                      ? 'border-blue-500 bg-blue-950/20' 
                      : phaseCompleted 
                        ? 'border-green-500/30 bg-green-950/10'
                        : 'border-slate-700/50'
                  }`}>
                    {/* Phase Header */}
                    {!isSidebarCollapsed && (
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className="w-full p-3 flex items-center justify-between hover:bg-slate-800/30 transition-all rounded-t-lg"
                        data-testid={`phase-${phase.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            isCurrentPhase 
                              ? 'bg-blue-500 text-white' 
                              : phaseCompleted
                                ? 'bg-green-500 text-white'
                                : 'bg-slate-700 text-slate-300'
                          }`}>
                            {phaseCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              renderIcon(phase.icon, "h-4 w-4")
                            )}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-semibold text-white">{phase.label}</div>
                            <div className="text-xs text-slate-400 leading-tight">{phase.description}</div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    )}

                    {/* Phase Steps */}
                    {!isSidebarCollapsed && isExpanded && (
                      <div className="p-2 space-y-1 border-t border-slate-700/50">
                        {phaseSteps.map((step) => {
                          const isCurrentStep = location === step.route;
                          const stepCompleted = step.stepNumber < currentStepNumber;

                          return (
                            <Link key={step.id} to={step.route}>
                              <Button
                                variant="ghost"
                                className={`w-full justify-start h-auto p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 ${
                                  isCurrentStep
                                    ? 'bg-slate-800/70 text-white border-l-4 border-l-blue-500 shadow-lg'
                                    : stepCompleted
                                      ? 'text-green-400'
                                      : ''
                                }`}
                                data-testid={`workflow-step-${step.id}`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2">
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                      isCurrentStep 
                                        ? 'bg-blue-500 text-white' 
                                        : stepCompleted
                                          ? 'bg-green-500/20 text-green-400'
                                          : 'bg-slate-700 text-slate-400'
                                    }`}>
                                      {stepCompleted ? '✓' : step.stepNumber}
                                    </div>
                                    <div className="text-left">
                                      <div className="font-medium text-xs leading-tight">{step.label}</div>
                                      {step.estimatedDuration && (
                                        <div className="text-[10px] text-slate-500">~{step.estimatedDuration}</div>
                                      )}
                                    </div>
                                  </div>
                                  {step.badge && (
                                    <Badge 
                                      variant={step.badge === 'CRITICAL' ? 'destructive' : step.badge === 'LIVE' ? 'default' : 'secondary'} 
                                      className="text-[10px] font-medium px-1 py-0"
                                    >
                                      {step.badge}
                                    </Badge>
                                  )}
                                </div>
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next Step Recommendation */}
            {!isSidebarCollapsed && nextStep && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">Next Step</span>
                </div>
                <Link to={nextStep.route}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 hover:bg-blue-950/30 text-white"
                    data-testid="next-step-button"
                  >
                    <div className="text-left">
                      <div className="text-sm font-medium">{nextStep.label}</div>
                      <div className="text-xs text-slate-400">{nextStep.description}</div>
                    </div>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Footer Status */}
          {!isSidebarCollapsed && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
              <div className="bg-primary/10 p-3 rounded-lg border border-primary/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary-foreground">System Status</span>
                </div>
                <div className="text-xs text-primary-foreground/80">
                  All intelligence modules operational
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Executive Header Bar */}
          <div className="h-16 bg-slate-950/50 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 min-w-0">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <Menu className="h-5 w-5 text-slate-400 flex-shrink-0" />
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 min-w-0 max-w-xs">
                <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-400 truncate">Quick search...</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center">3</Badge>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}