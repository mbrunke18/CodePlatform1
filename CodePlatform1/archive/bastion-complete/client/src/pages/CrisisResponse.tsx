import { useToast } from "@/hooks/use-toast";
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import CrisisResponseDashboard from "@/components/CrisisResponseDashboard";
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Activity, Clock } from "lucide-react";

export default function CrisisResponse() {
  const { toast } = useToast();
  
  // Fetch organizations to get the correct organization ID
  const { data: organizations = [] } = useQuery<any[]>({ queryKey: ['/api/organizations'] });
  const organizationId = organizations[0]?.id || '95b97862-8e9d-4c4c-8609-7d8f37b68d36'; // fallback to known UUID

  // Full access to crisis response platform

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto" data-testid="crisis-response-page">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Enterprise Crisis Response Center</h1>
                <p className="text-red-100 text-lg">Immediate response protocols and emergency management systems</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <Badge variant="secondary" className="bg-white/20 text-white">OPERATIONAL</Badge>
                </div>
                <div className="text-red-100">24/7 Crisis Monitoring Active</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Crisis Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20" data-testid="readiness-status">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Shield className="h-4 w-4" />
                  Readiness Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">98%</div>
                <div className="text-xs text-green-600 dark:text-green-400">Crisis Prepared</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20" data-testid="response-time">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Clock className="h-4 w-4" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">&lt;1hr</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Average Activation</div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20" data-testid="templates-ready">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <Activity className="h-4 w-4" />
                  Templates Ready
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">15+</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Crisis Scenarios</div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20" data-testid="monitoring-status">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <AlertTriangle className="h-4 w-4" />
                  Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">24/7</div>
                <div className="text-xs text-orange-600 dark:text-orange-400">Active Surveillance</div>
              </CardContent>
            </Card>
          </div>

          {/* Crisis Response Dashboard */}
          <CrisisResponseDashboard organizationId={organizationId} />
        </div>
      </div>
    </VeridiusPageLayout>
  );
}