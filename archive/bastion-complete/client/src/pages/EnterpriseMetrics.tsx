import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  Building, 
  Users, 
  TrendingUp, 
  Shield, 
  Globe,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Activity,
  Database,
  Zap,
  Crown,
  Briefcase
} from 'lucide-react';

export default function EnterpriseMetrics() {
  const enterpriseKPIs = [
    { title: "Platform Uptime", value: "99.97%", target: "99.99%", progress: 99.7, color: "text-green-600" },
    { title: "Response Time", value: "4 min", target: "2 min", progress: 80, color: "text-blue-600" },
    { title: "User Adoption", value: "94%", target: "98%", progress: 94, color: "text-purple-600" },
    { title: "Cost Efficiency", value: "$847K", target: "$1.2M", progress: 85, color: "text-orange-600" }
  ];

  const scalabilityMetrics = [
    { metric: "Concurrent Users", value: "10,000+", status: "Optimal" },
    { metric: "Data Processing", value: "2.4TB/day", status: "Efficient" },
    { metric: "API Response Time", value: "< 200ms", status: "Excellent" },
    { metric: "Database Performance", value: "99.9%", status: "Optimal" }
  ];

  const integrationCapabilities = [
    {
      system: "Enterprise Resource Planning (ERP)",
      status: "Integrated",
      providers: ["SAP", "Oracle", "Microsoft Dynamics"],
      coverage: "100%"
    },
    {
      system: "Customer Relationship Management (CRM)",
      status: "Integrated", 
      providers: ["Salesforce", "HubSpot", "Microsoft CRM"],
      coverage: "98%" 
    },
    {
      system: "Human Resources Information System",
      status: "Integrated",
      providers: ["Workday", "ADP", "BambooHR"],
      coverage: "95%"
    },
    {
      system: "Business Intelligence Platforms",
      status: "Integrated",
      providers: ["Tableau", "Power BI", "Looker"],
      coverage: "92%"
    }
  ];

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-8">
          {/* Enterprise Metrics Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Enterprise Metrics Center</h1>
                <p className="text-gray-600 dark:text-gray-300">Platform Performance & Enterprise Integration Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-500/50">
                <CheckCircle className="w-3 h-3 mr-1" />
                Enterprise Ready
              </Badge>
              <Badge className="bg-orange-600 text-white">
                Fortune 1000
              </Badge>
            </div>
          </div>

          {/* Enterprise KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {enterpriseKPIs.map((kpi, index) => (
              <Card key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{kpi.value}</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Target: {kpi.target}</span>
                      <span className={kpi.color}>{kpi.progress}%</span>
                    </div>
                    <Progress value={kpi.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Scalability Dashboard */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Database className="w-5 h-5 mr-2 text-blue-500" />
                  Platform Scalability Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scalabilityMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{metric.metric}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{metric.value}</p>
                      </div>
                      <Badge 
                        variant={metric.status === 'Optimal' || metric.status === 'Excellent' ? 'default' : 'secondary'}
                        className={metric.status === 'Optimal' || metric.status === 'Excellent' ? 'bg-green-600' : ''}
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" data-testid="button-detailed-performance">
                  View Detailed Performance Reports
                </Button>
              </CardContent>
            </Card>

            {/* Integration Hub */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Globe className="w-5 h-5 mr-2 text-green-500" />
                  Enterprise Integration Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrationCapabilities.map((integration, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{integration.system}</h4>
                        <Badge variant="default" className="bg-green-600">
                          {integration.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {integration.providers.join(", ")}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Coverage: {integration.coverage}</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" data-testid="button-integration-management">
                  Manage Enterprise Integrations
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enterprise Command Actions */}
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Crown className="w-5 h-5 mr-2 text-orange-500" />
                Enterprise Command Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-system-health">
                  <Activity className="w-5 h-5 mr-2" />
                  System Health Check
                </Button>
                <Button className="h-16 bg-green-600 hover:bg-green-700 text-white" data-testid="button-scale-resources">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Scale Resources
                </Button>
                <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white" data-testid="button-security-audit">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Audit
                </Button>
                <Button className="h-16 bg-orange-600 hover:bg-orange-700 text-white" data-testid="button-performance-optimization">
                  <Zap className="w-5 h-5 mr-2" />
                  Optimize Performance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}