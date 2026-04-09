import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Send,
  User,
  Mail,
  AlertCircle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";

interface StakeholderAlignmentData {
  id: string;
  stakeholderName: string;
  stakeholderRole: string;
  stakeholderEmail: string;
  notificationMethod: string;
  acknowledged: boolean;
  acknowledgedAt: Date | null;
  tasksAssigned: number;
  tasksCompleted: number;
  responseTime: number | null;
  status: string;
  priority: string;
}

interface StakeholderAlignmentDashboardProps {
  scenarioId: string;
  executionId?: string;
}

export default function StakeholderAlignmentDashboard({ 
  scenarioId, 
  executionId 
}: StakeholderAlignmentDashboardProps) {
  const { data: alignmentDataRaw, isLoading } = useQuery<StakeholderAlignmentData[]>({
    queryKey: ['/api/stakeholder-alignment', scenarioId, executionId],
    enabled: !!scenarioId,
  });
  const alignmentData = Array.isArray(alignmentDataRaw) ? alignmentDataRaw : [];

  const createAlignmentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', `/api/stakeholder-alignment`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stakeholder-alignment', scenarioId] });
    },
  });

  const updateAlignmentMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return await apiRequest('PUT', `/api/stakeholder-alignment/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stakeholder-alignment', scenarioId] });
    },
  });

  // Note: Stakeholder data now comes from organization configuration
  // Users should configure stakeholders in Organization Setup before activating playbooks

  if (isLoading) {
    return null;
  }

  if (!alignmentData || alignmentData.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200 bg-white" data-testid="stakeholder-alignment-empty">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 bg-[#C9A84C]/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-[#C9A84C]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No Stakeholders Assigned
          </h3>
          <p className="text-slate-600 dark:text-slate-200 mb-4 max-w-sm">
            Configure your organization's stakeholders to enable alignment tracking during playbook execution.
          </p>
          <Link href="/organization-setup">
            <Button className="bg-gradient-to-r from-[#0A0F2E] to-[#141B45] hover:from-[#0A0F2E] hover:to-[#141B45]">
              Configure Stakeholders
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const safeAlignmentData = alignmentData || [];
  const acknowledgedCount = safeAlignmentData.filter((s: any) => s.acknowledged).length;
  const totalCount = safeAlignmentData.length;
  const alignmentPercentage = totalCount > 0 ? Math.round((acknowledgedCount / totalCount) * 100) : 0;

  const totalTasks = safeAlignmentData.reduce((sum: number, s: any) => sum + (s.tasksAssigned || 0), 0);
  const completedTasks = safeAlignmentData.reduce((sum: number, s: any) => sum + (s.tasksCompleted || 0), 0);
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card data-testid="stakeholder-alignment-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#C9A84C]" />
            Who's On Board?
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C9A84C]" data-testid="alignment-percentage">
                {alignmentPercentage}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-200">Acknowledged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0A0F2E]" data-testid="task-progress-percentage">
                {taskProgress}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-200">Tasks Complete</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {safeAlignmentData.map((stakeholder: any, idx: number) => (
            <div 
              key={stakeholder.id} 
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800"
              data-testid={`stakeholder-item-${idx}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 ${
                  stakeholder.acknowledged 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <User className={`h-4 w-4 ${
                    stakeholder.acknowledged 
                      ? 'text-green-600' 
                      : 'text-gray-600 dark:text-gray-200'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" data-testid={`stakeholder-name-${idx}`}>
                      {stakeholder.stakeholderName}
                    </span>
                    <Badge 
                      variant={stakeholder.priority === 'critical' ? 'destructive' : 'secondary'}
                      className="text-xs"
                      data-testid={`stakeholder-priority-${idx}`}
                    >
                      {stakeholder.priority}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-200" data-testid={`stakeholder-role-${idx}`}>
                    {stakeholder.stakeholderRole}
                  </div>
                  {stakeholder.tasksAssigned > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <Progress 
                        value={(stakeholder.tasksCompleted / stakeholder.tasksAssigned) * 100} 
                        className="h-1.5 w-24" 
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-300" data-testid={`stakeholder-tasks-${idx}`}>
                        {stakeholder.tasksCompleted}/{stakeholder.tasksAssigned} tasks
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stakeholder.acknowledged ? (
                  <div className="flex items-center gap-2" data-testid={`stakeholder-acknowledged-${idx}`}>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">Acknowledged</div>
                      {stakeholder.responseTime && (
                        <div className="text-xs text-gray-600 dark:text-gray-300">{stakeholder.responseTime}min response</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2" data-testid={`stakeholder-pending-${idx}`}>
                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-200" />
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-200">Pending</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs"
                        data-testid={`resend-notification-${idx}`}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Resend
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-[#0A0F2E] dark:bg-[#0A0F2E]/20 border border-[#E8E4DC] dark:border-[#0A0F2E]">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-[#0A0F2E]" />
            <span className="text-[#0A0F2E] dark:text-white">
              <strong>{acknowledgedCount}</strong> of <strong>{totalCount}</strong> executives ready
              {taskProgress > 0 && (
                <> • <strong>{completedTasks}</strong> of <strong>{totalTasks}</strong> tasks done</>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
