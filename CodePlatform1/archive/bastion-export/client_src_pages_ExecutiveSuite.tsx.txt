import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  Crown, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Briefcase,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Shield,
  Brain
} from 'lucide-react';

export default function ExecutiveSuite() {
  const executiveMetrics = [
    { title: "Strategic Initiatives", value: "12 Active", change: "+3 this quarter", trend: "up" },
    { title: "Organizational Health", value: "92%", change: "+8% vs last quarter", trend: "up" },
    { title: "Crisis Readiness", value: "97%", change: "Protocols updated", trend: "stable" },
    { title: "Innovation Pipeline", value: "28 Projects", change: "+5 breakthrough opportunities", trend: "up" }
  ];

  const boardReports = [
    {
      title: "Q3 Strategic Performance Review",
      type: "Quarterly Board Report",
      status: "Ready for Review",
      date: "September 2025",
      icon: <FileText className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Crisis Response Capabilities Assessment",
      type: "Risk Management Report",
      status: "Completed",
      date: "August 2025",
      icon: <Shield className="w-5 h-5 text-green-400" />
    },
    {
      title: "Organizational Intelligence ROI Analysis",
      type: "Investment Performance",
      status: "In Progress",
      date: "September 2025",
      icon: <TrendingUp className="w-5 h-5 text-orange-400" />
    }
  ];

  const executivePriorities = [
    "Digital transformation acceleration (+23% efficiency gains)",
    "Crisis response protocol optimization (4-minute activation time)",
    "AI-powered decision intelligence (85-92% accuracy rate)",
    "Cross-functional team collaboration enhancement",
    "Innovation pipeline management (28 active projects)"
  ];

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-8">
          {/* Executive Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Executive Command Center</h1>
                <p className="text-gray-600 dark:text-gray-300">C-Suite Intelligence & Strategic Command</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-500/50">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Systems Operational
              </Badge>
              <Badge className="bg-purple-600 text-white">
                Executive Access
              </Badge>
            </div>
          </div>

          {/* Executive Performance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {executiveMetrics.map((metric, index) => (
              <Card key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric.value}</div>
                  <div className={`text-sm flex items-center ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {metric.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                    {metric.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Board Reports */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                  Board Reports & Strategic Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {boardReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {report.icon}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{report.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{report.type} • {report.date}</p>
                      </div>
                    </div>
                    <Badge variant={report.status === 'Completed' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                ))}
                <Button className="w-full mt-4" data-testid="button-generate-board-report">
                  Generate Executive Summary
                </Button>
              </CardContent>
            </Card>

            {/* Strategic Priorities */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Target className="w-5 h-5 mr-2 text-blue-500" />
                  Current Strategic Priorities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {executivePriorities.map((priority, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{priority}</span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <Button size="sm" variant="outline" data-testid="button-update-priorities">
                    Update Priorities
                  </Button>
                  <Button size="sm" data-testid="button-strategic-review">
                    Schedule Strategic Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Executive Command Actions */}
          <Card className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Crown className="w-5 h-5 mr-2 text-purple-500" />
                Executive Command Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-16 bg-red-600 hover:bg-red-700 text-white" data-testid="button-emergency-activation">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Emergency Crisis Activation
                </Button>
                <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-strategic-intelligence">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Strategic Intelligence
                </Button>
                <Button className="h-16 bg-green-600 hover:bg-green-700 text-white" data-testid="button-board-presentation">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Generate Board Presentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}