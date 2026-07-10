import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PageLayout from '@/components/layout/PageLayout';
import { useLocation } from 'wouter';
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
import { BrandStamp } from "@/components/BrandStamp";

export default function EnterpriseMetrics({ embedded }: { embedded?: boolean }) {
  const [, setLocation] = useLocation();
  const enterpriseKPIs = [
    { title: "Platform Uptime", value: "99.97%", target: "99.99%", progress: 99.7, color: "text-[#2B8A6E]" },
    { title: "Response Time", value: "12 min", target: "8 min", progress: 85, color: "text-[#0A0F2E]" },
    { title: "User Adoption", value: "94%", target: "98%", progress: 94, color: "text-[#C9A84C]" },
    { title: "Cost Efficiency", value: "$847K", target: "$1.2M", progress: 85, color: "text-[#C9A84C]" }
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
    <PageLayout embedded={embedded}>
      <div className="flex-1 page-background overflow-auto bg-[#F8F7F4]">
        <div className="p-8">
          {/* Enterprise Metrics Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="bg-[#0A0F2E] text-white p-8 relative overflow-hidden w-full flex items-center justify-between">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10 flex items-center gap-4">
                <Building className="h-10 w-10 text-[#C9A84C]" />
                <div>
                  <h1 className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Enterprise Metrics Center</h1>
                  <p className="text-white/70">Platform Performance & Enterprise Integration Hub</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <Badge variant="outline" className="text-[#2B8A6E] border-[#2B8A6E]/30 bg-[#2B8A6E]/10">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Enterprise Ready
                </Badge>
                <Badge className="bg-[#C9A84C] text-[#0A0F2E] font-bold">
                  Startup to Fortune 500
                </Badge>
              </div>
            </div>
          </div>

          {/* Enterprise KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {enterpriseKPIs.map((kpi, index) => (
              <Card key={index} className="bg-white border-[#E8E4DC]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-[#6B7280]">{kpi.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{kpi.value}</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">Target: {kpi.target}</span>
                      <span className={kpi.color}>{kpi.progress}%</span>
                    </div>
                    <Progress value={kpi.progress} className="h-2 [&>div]:bg-[#C9A84C]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Scalability Dashboard */}
            <Card className="bg-white border-[#E8E4DC]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <Database className="w-5 h-5 mr-2 text-[#0A0F2E]" />
                  Platform Scalability Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scalabilityMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#F8F7F4] border border-[#E8E4DC]">
                      <div>
                        <h4 className="font-medium text-[#0A0F2E]">{metric.metric}</h4>
                        <p className="text-sm text-[#6B7280]">{metric.value}</p>
                      </div>
                      <Badge 
                        variant={metric.status === 'Optimal' || metric.status === 'Excellent' ? 'default' : 'secondary'}
                        className={metric.status === 'Optimal' || metric.status === 'Excellent' ? 'bg-[#2B8A6E] text-white' : 'bg-[#E8E4DC] text-[#0A0F2E]'}
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E]/5" variant="outline" data-testid="button-detailed-performance">
                  View Detailed Performance Reports
                </Button>
              </CardContent>
            </Card>

            {/* Integration Hub */}
            <Card className="bg-white border-[#E8E4DC]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <Globe className="w-5 h-5 mr-2 text-[#2B8A6E]" />
                  Enterprise Integration Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrationCapabilities.map((integration, index) => (
                    <div key={index} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#0A0F2E]">{integration.system}</h4>
                        <Badge variant="default" className="bg-[#2B8A6E] text-white">
                          {integration.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-[#6B7280] mb-2">
                        {integration.providers.join(", ")}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7280]">Coverage: {integration.coverage}</span>
                        <CheckCircle className="w-4 h-4 text-[#2B8A6E]" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-[#0A0F2E] text-white hover:bg-[#141B45]" data-testid="button-integration-management">
                  Manage Enterprise Integrations
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enterprise Command Actions */}
          <Card className="bg-[#0A0F2E]/5 border-[#C9A84C]/20">
            <CardHeader>
              <CardTitle className="flex items-center text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <Crown className="w-5 h-5 mr-2 text-[#C9A84C]" />
                Enterprise Command Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-16 bg-[#0A0F2E] hover:bg-[#141B45] text-white" data-testid="button-system-health" onClick={() => setLocation('/audit-logging-center')}>
                  <Activity className="w-5 h-5 mr-2" />
                  System Health Check
                </Button>
                <Button className="h-16 bg-[#2B8A6E] hover:bg-[#237059] text-white" data-testid="button-scale-resources" onClick={() => setLocation('/getting-started')}>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Scale Resources
                </Button>
                <Button className="h-16 bg-[#0A0F2E] hover:bg-[#141B45] text-white" data-testid="button-security-audit" onClick={() => setLocation('/audit-logging-center')}>
                  <Shield className="w-5 h-5 mr-2" />
                  Security Audit
                </Button>
                <Button className="h-16 bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold" data-testid="button-performance-optimization" onClick={() => setLocation('/advance-intelligence')}>
                  <Zap className="w-5 h-5 mr-2" />
                  Optimize Performance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}