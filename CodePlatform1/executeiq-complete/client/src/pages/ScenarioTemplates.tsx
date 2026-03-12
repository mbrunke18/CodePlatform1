import { useToast } from "@/hooks/use-toast";
import PageLayout from '@/components/layout/PageLayout';
import ScenarioTemplateLibrary from "@/components/ScenarioTemplateLibrary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap, Target, TrendingUp } from "lucide-react";

export default function ScenarioTemplates() {
  const { toast } = useToast();

  // Full access to enterprise template library

  return (
    <PageLayout>
      <div className="flex-1 page-background overflow-auto" data-testid="scenario-templates-page">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Comprehensive Scenario Templates</h1>
                <p className="text-blue-100 text-lg">12+ professional starting templates that grow as you build YOUR playbooks</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-2">
                  ENTERPRISE GRADE
                </Badge>
                <div className="text-blue-100">Customizable & Expandable</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Template Categories Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20" data-testid="crisis-category">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-800 dark:text-red-200">
                  <Zap className="h-4 w-4" />
                  Crisis Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-red-600 dark:text-red-400">Emergency Templates</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20" data-testid="strategic-category">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Target className="h-4 w-4" />
                  Strategic Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">5</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Growth Templates</div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20" data-testid="operational-category">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-800 dark:text-green-200">
                  <TrendingUp className="h-4 w-4" />
                  Operational
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-green-600 dark:text-green-400">Process Templates</div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20" data-testid="innovation-category">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <FileText className="h-4 w-4" />
                  Innovation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-purple-600 dark:text-purple-400">Opportunity Templates</div>
              </CardContent>
            </Card>
          </div>

          {/* Comprehensive Template Library */}
          <ScenarioTemplateLibrary organizationId="org-1" />
        </div>
      </div>
    </PageLayout>
  );
}