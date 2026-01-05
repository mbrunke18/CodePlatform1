import StandardNav from '@/components/layout/StandardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Target, 
  Building2, 
  Network, 
  Crown, 
  Scale, 
  Workflow, 
  Cpu, 
  Users, 
  Award, 
  MapPin, 
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { OPERATING_MODEL_ELEMENTS, OperatingModelElement, Scenario } from "@shared/scenarios";
import { scenarios } from "@shared/scenarios";

// Health score simulation data (in real app, this would come from backend analytics)
const elementHealthScores = {
  'Purpose': 82,
  'Value Agenda': 75,
  'Structure': 68,
  'Ecosystem': 71,
  'Leadership': 85,
  'Governance': 73,
  'Processes': 65,
  'Technology': 78,
  'Behaviors': 70,
  'Rewards': 62,
  'Footprint': 69,
  'Talent': 80
};

const elementIcons = {
  'Purpose': Activity,
  'Value Agenda': Target,
  'Structure': Building2,
  'Ecosystem': Network,
  'Leadership': Crown,
  'Governance': Scale,
  'Processes': Workflow,
  'Technology': Cpu,
  'Behaviors': Users,
  'Rewards': Award,
  'Footprint': MapPin,
  'Talent': GraduationCap
};

function getHealthStatus(score: number) {
  if (score >= 80) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-600' };
  if (score >= 70) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600' };
  if (score >= 60) return { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
  return { label: 'Needs Attention', color: 'bg-red-500', textColor: 'text-red-600' };
}

function getElementActivationCount(elementId: OperatingModelElement) {
  return scenarios.filter((s: Scenario) => s.elementsActivated?.includes(elementId)).length;
}

export default function OperatingModelHealthReport() {
  const overallScore = Math.round(
    Object.values(elementHealthScores).reduce((a, b) => a + b, 0) / 
    Object.values(elementHealthScores).length
  );
  
  const excellentCount = Object.values(elementHealthScores).filter(s => s >= 80).length;
  const needsAttentionCount = Object.values(elementHealthScores).filter(s => s < 60).length;

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Operating Model Health Report
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                McKinsey's 12 Elements Framework Assessment
              </p>
            </div>
          </div>
        </div>

        {/* Overall Health Score */}
        <Card className="mb-8 border-2 shadow-lg bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl">Organization Readiness Score</CardTitle>
            <CardDescription>
              Composite health across all 12 Operating Model Elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-6xl font-bold text-slate-900 dark:text-white">
                    {overallScore}
                    <span className="text-3xl text-slate-500 dark:text-slate-400">/100</span>
                  </span>
                  <Badge className={`${getHealthStatus(overallScore).color} text-white text-lg px-4 py-2`}>
                    {getHealthStatus(overallScore).label}
                  </Badge>
                </div>
                <Progress value={overallScore} className="h-3 mb-6" data-testid="progress-overall-score" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-600" data-testid="text-excellent-count">{excellentCount}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Excellent</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600" data-testid="text-good-count">
                      {Object.values(elementHealthScores).filter(s => s >= 70 && s < 80).length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Good</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-600" data-testid="text-needs-attention-count">{needsAttentionCount}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Needs Focus</div>
                  </div>
                </div>
              </div>
              <div className="card-bg rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Key Insights
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Leadership and Purpose are your strongest elements, driving strategic clarity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Rewards and Processes need improvement to unlock full transformation potential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Technology investments are paying off with 78% health score</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elements Grid */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all" data-testid="tab-all-elements">All Elements (12)</TabsTrigger>
            <TabsTrigger value="strong" data-testid="tab-strong">Strong ({excellentCount})</TabsTrigger>
            <TabsTrigger value="focus" data-testid="tab-focus">Needs Focus ({needsAttentionCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {OPERATING_MODEL_ELEMENTS.map((element) => {
                const score = elementHealthScores[element.id as keyof typeof elementHealthScores];
                const status = getHealthStatus(score);
                const Icon = elementIcons[element.id as keyof typeof elementIcons];
                const activationCount = getElementActivationCount(element.id);

                return (
                  <Card 
                    key={element.id} 
                    className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-slate-800"
                    data-testid={`card-element-${element.id.toLowerCase().replace(' ', '-')}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className={`h-10 w-10 rounded-lg ${status.color} bg-opacity-10 flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${status.textColor}`} />
                        </div>
                        <Badge className={`${status.color} text-white`}>
                          {score}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{element.id}</CardTitle>
                      <CardDescription>{element.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={score} className="mb-4 h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Status: <span className={`font-semibold ${status.textColor}`}>{status.label}</span>
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {activationCount} scenarios
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="strong">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {OPERATING_MODEL_ELEMENTS.filter((element: { id: OperatingModelElement; description: string }) => 
                elementHealthScores[element.id as keyof typeof elementHealthScores] >= 80
              ).map((element) => {
                const score = elementHealthScores[element.id as keyof typeof elementHealthScores];
                const status = getHealthStatus(score);
                const Icon = elementIcons[element.id as keyof typeof elementIcons];
                const activationCount = getElementActivationCount(element.id);

                return (
                  <Card 
                    key={element.id} 
                    className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-slate-800"
                    data-testid={`card-strong-${element.id.toLowerCase().replace(' ', '-')}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className={`h-10 w-10 rounded-lg ${status.color} bg-opacity-10 flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${status.textColor}`} />
                        </div>
                        <Badge className={`${status.color} text-white`}>
                          {score}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{element.id}</CardTitle>
                      <CardDescription>{element.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={score} className="mb-4 h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Status: <span className={`font-semibold ${status.textColor}`}>{status.label}</span>
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {activationCount} scenarios
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="focus">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {OPERATING_MODEL_ELEMENTS.filter((element: { id: OperatingModelElement; description: string }) => 
                elementHealthScores[element.id as keyof typeof elementHealthScores] < 60
              ).map((element) => {
                const score = elementHealthScores[element.id as keyof typeof elementHealthScores];
                const status = getHealthStatus(score);
                const Icon = elementIcons[element.id as keyof typeof elementIcons];
                const activationCount = getElementActivationCount(element.id);

                return (
                  <Card 
                    key={element.id} 
                    className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-slate-800 border-red-200 dark:border-red-900"
                    data-testid={`card-focus-${element.id.toLowerCase().replace(' ', '-')}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className={`h-10 w-10 rounded-lg ${status.color} bg-opacity-10 flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${status.textColor}`} />
                        </div>
                        <Badge className={`${status.color} text-white`}>
                          {score}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{element.id}</CardTitle>
                      <CardDescription>{element.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={score} className="mb-4 h-2" />
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-slate-600 dark:text-slate-400">
                          Status: <span className={`font-semibold ${status.textColor}`}>{status.label}</span>
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {activationCount} scenarios
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        data-testid={`button-improve-${element.id.toLowerCase().replace(' ', '-')}`}
                      >
                        View Improvement Plan
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recommendations Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Strategic Recommendations
            </CardTitle>
            <CardDescription>
              Prioritized actions to strengthen your operating model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-l-4 border-red-500">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Priority 1: Strengthen Rewards System</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Current score: 62. Misaligned incentives are limiting transformation velocity.
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Action:</strong> Launch the Organizational Restructuring scenario to redesign rewards 
                      to align with strategic outcomes. Expected improvement: +15 points in 90 days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-l-4 border-yellow-500">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Priority 2: Optimize Core Processes</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Current score: 65. Process inefficiencies are creating execution drag.
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Action:</strong> Activate the Process Improvement playbook to streamline workflows 
                      and eliminate bottlenecks. Expected ROI: $8M annually.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Opportunity: Leverage Leadership Strength</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Current score: 85. Strong leadership is your competitive advantage.
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Action:</strong> Use your leadership strength to drive Culture Transformation 
                      and cascade strategic clarity across the organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
