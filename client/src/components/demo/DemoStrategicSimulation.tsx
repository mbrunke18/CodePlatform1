import { useDemoController } from '@/contexts/DemoController';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Users, 
  Building2,
  TrendingDown,
  CheckCircle,
  Play,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function DemoStrategicAlert() {
  const { state, currentSceneData } = useDemoController();
  
  if (!state.isActive) return null;
  
  const sceneId = currentSceneData?.id || '';
  
  const showAlert = ['trigger-alert', 'situation-analysis', 'decision-activation', 'playbook-activation', 'execution-tracking'].includes(sceneId);
  
  if (!showAlert) return null;
  
  return (
    <div className="mb-6" data-testid="demo-strategic-alert">
      <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
        <AlertTriangle className="h-5 w-5 text-red-700" />
        <AlertDescription className="ml-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-red-900 dark:text-red-100">STRATEGIC TRIGGER ACTIVATED:</span>
              <span className="text-red-800 dark:text-red-200 ml-2">
                Primary Supplier Financial Distress - AcmeParts Inc
              </span>
            </div>
            <Badge className="bg-red-600 text-white">CRITICAL</Badge>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function DemoActiveStrategicCard() {
  const { state, currentSceneData } = useDemoController();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [taskProgress, setTaskProgress] = useState(0);
  
  useEffect(() => {
    const sceneId = currentSceneData?.id || '';
    
    if (['playbook-activation', 'execution-tracking'].includes(sceneId)) {
      const timer = setInterval(() => {
        setElapsedTime(prev => Math.min(prev + 1, 720)); // 12 minutes max
        setTaskProgress(prev => Math.min(prev + 3, 94));
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentSceneData?.id]);
  
  if (!state.isActive) return null;
  
  const sceneId = currentSceneData?.id || '';
  const showStrategicCard = ['trigger-alert', 'situation-analysis', 'decision-activation', 'playbook-activation', 'execution-tracking'].includes(sceneId);
  
  if (!showStrategicCard) return null;
  
  const isActivated = ['playbook-activation', 'execution-tracking'].includes(sceneId);
  const showAnalysis = ['situation-analysis', 'decision-activation', 'playbook-activation', 'execution-tracking'].includes(sceneId);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className="border-red-300 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 shadow-lg" data-testid="demo-active-strategic-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-6 w-6 text-red-700" />
              <CardTitle className="text-xl text-red-900 dark:text-red-100">
                Supply Chain Disruption - AcmeParts Inc
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-red-600 text-white">CRITICAL</Badge>
              <Badge variant="outline" className="border-orange-500 text-orange-700 dark:text-orange-300">
                Supply Chain
              </Badge>
              {isActivated && (
                <Badge className="bg-green-600 text-gray-900">
                  <Zap className="h-3 w-3 mr-1" />
                  PLAYBOOK ACTIVE
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">Detected</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              3 days ago
            </div>
            {isActivated && (
              <div className="mt-2 text-sm font-mono bg-[#F8F7F4] dark:bg-[#0A0F2E]/30 px-3 py-1 rounded">
                Elapsed: {formatTime(elapsedTime)}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Trigger Conditions Met</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-red-700 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Supplier credit rating dropped to <strong>B-</strong> (threshold: B-)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-red-700 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Stock price fell <strong>42%</strong> in 5 days (threshold: 40%)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-red-700 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Detected <strong>72 hours before competitors</strong> - 5-day head start
              </span>
            </div>
          </div>
        </div>
        
        {showAnalysis && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <span className="text-xs text-gray-800 dark:text-gray-200">Financial Exposure</span>
              </div>
              <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">$12M</div>
              <div className="text-xs text-gray-800 dark:text-gray-300">Quarterly revenue at risk</div>
            </div>
            
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-[#0A0F2E]" />
                <span className="text-xs text-gray-800 dark:text-gray-200">Workforce Impact</span>
              </div>
              <div className="text-lg font-bold text-[#0A0F2E] dark:text-[#0A0F2E]">847</div>
              <div className="text-xs text-gray-800 dark:text-gray-300">Employees affected</div>
            </div>
            
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-[#C9A84C]" />
                <span className="text-xs text-gray-800 dark:text-gray-200">Facilities</span>
              </div>
              <div className="text-lg font-bold text-[#C9A84C] dark:text-[#C9A84C]">3</div>
              <div className="text-xs text-gray-800 dark:text-gray-300">Production sites at risk</div>
            </div>
            
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-red-700" />
                <span className="text-xs text-gray-800 dark:text-gray-200">Capacity Risk</span>
              </div>
              <div className="text-lg font-bold text-red-700 dark:text-red-400">35%</div>
              <div className="text-xs text-gray-800 dark:text-gray-300">Manufacturing capacity</div>
            </div>
          </div>
        )}
        
        {isActivated && (
          <div className="bg-[#0A0F2E] dark:bg-[#0A0F2E]/20 rounded-lg p-4 border border-[#E8E4DC] dark:border-[#0A0F2E]/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#0A0F2E] dark:text-white">
                Coordinated Response Execution
              </h4>
              <span className="text-sm font-semibold text-[#0A0F2E] dark:text-[#DFC178]">
                {taskProgress}% Complete
              </span>
            </div>
            <Progress value={taskProgress} className="mb-3" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                <span className="text-gray-700 dark:text-gray-300">Procurement: Alternative suppliers identified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                <span className="text-gray-700 dark:text-gray-300">Production: Revised schedules deployed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                <span className="text-gray-700 dark:text-gray-300">Finance: Payment protocols activated</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600 animate-pulse" />
                <span className="text-gray-700 dark:text-gray-300">Legal: Contract review in progress</span>
              </div>
            </div>
          </div>
        )}
        
        {!isActivated && sceneId === 'decision-activation' && (
          <Button className="w-full bg-gradient-to-r from-[#0A0F2E] to-[#141B45] text-white" size="lg" data-testid="demo-activate-playbook-btn">
            <Play className="h-5 w-5 mr-2" />
            Activate Supply Chain Disruption Playbook SCM-001
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function DemoStrategicROIResults() {
  const { state, currentSceneData } = useDemoController();
  
  if (!state.isActive || currentSceneData?.id !== 'results-roi') return null;
  
  return (
    <div className="space-y-4" data-testid="demo-strategic-roi-results">
      <Card className="border-green-300 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
        <CardHeader>
          <CardTitle className="text-2xl text-green-900 dark:text-green-100 flex items-center gap-2">
            <CheckCircle className="h-7 w-7 text-[#2B8A6E]" />
            Situation Resolved - Quantified Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">Response Time</div>
              <div className="text-3xl font-bold text-[#2B8A6E] dark:text-green-400">12 min</div>
              <div className="text-xs text-[#2B8A6E] dark:text-green-400">vs weeks of mobilization</div>
            </div>
            
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">Time Saved</div>
              <div className="text-3xl font-bold text-[#0A0F2E] dark:text-[#0A0F2E]">71.8 hrs</div>
              <div className="text-xs text-[#0A0F2E] dark:text-[#0A0F2E]">Decision velocity advantage</div>
            </div>
            
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">Revenue Protected</div>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">$12M</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Quarterly revenue secured</div>
            </div>
            
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">Competitive Edge</div>
              <div className="text-3xl font-bold text-[#C9A84C] dark:text-[#C9A84C]">5 days</div>
              <div className="text-xs text-[#C9A84C] dark:text-[#C9A84C]">Head start vs competitors</div>
            </div>
          </div>
          
          <div className="bg-[#0A0F2E] dark:bg-[#0A0F2E]/20 rounded-lg p-4 border border-[#E8E4DC] dark:border-[#0A0F2E]/50">
            <h4 className="font-semibold text-[#0A0F2E] dark:text-white mb-2">Execution Success Metrics</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-gray-800 dark:text-gray-200">Task Completion</div>
                <div className="text-lg font-bold text-[#0A0F2E] dark:text-[#DFC178]">94%</div>
              </div>
              <div>
                <div className="text-gray-800 dark:text-gray-200">Team Coordination</div>
                <div className="text-lg font-bold text-[#0A0F2E] dark:text-[#DFC178]">47 members</div>
              </div>
              <div>
                <div className="text-gray-800 dark:text-gray-200">Departments</div>
                <div className="text-lg font-bold text-[#0A0F2E] dark:text-[#DFC178]">8 teams</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
