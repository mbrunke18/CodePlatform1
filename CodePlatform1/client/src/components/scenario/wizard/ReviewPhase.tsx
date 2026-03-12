import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  AlertTriangle,
  Target,
  Users,
  Bell,
  BarChart3,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';

interface ReviewPhaseProps {
  data: any;
  completionScore: number;
}

export default function ReviewPhase({ data, completionScore }: ReviewPhaseProps) {
  const stakeholderCount = data.stakeholders?.length || 0;
  const triggerCount = data.triggers?.length || 0;
  const metricCount = data.metrics?.length || 0;
  
  const hasExecutiveSponsor = data.stakeholders?.some((s: any) => s.isExecutiveSponsor);
  const hasAccountableOwner = data.stakeholders?.some((s: any) => s.isAccountableOwner);
  const hasKeyMetrics = data.metrics?.some((m: any) => m.isKeyMetric);

  const readinessChecks = [
    { label: 'Scenario Context Defined', met: !!data.mission && !!data.scenarioType, icon: Target },
    { label: 'Executive Sponsor Assigned', met: hasExecutiveSponsor, icon: Users },
    { label: 'Accountable Owner Assigned', met: hasAccountableOwner, icon: Users },
    { label: 'At Least 1 Trigger Configured', met: triggerCount > 0, icon: Bell },
    { label: 'At Least 1 Success Metric', met: metricCount > 0, icon: BarChart3 },
    { label: 'Key Success Metrics Identified', met: hasKeyMetrics, icon: TrendingUp },
  ];

  const metChecks = readinessChecks.filter(c => c.met).length;
  const totalChecks = readinessChecks.length;
  const readinessScore = (metChecks / totalChecks) * 100;

  return (
    <div className="space-y-6">
      {/* Completion Overview */}
      <Card className="border-[#2B8A6E]/30 bg-gradient-to-r  ">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#C9A84C]" />
            Scenario Readiness Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-900 font-medium">Overall Completion</span>
              <span className="text-2xl font-bold text-[#C9A84C]">{Math.round(completionScore)}%</span>
            </div>
            <Progress value={completionScore} className="h-3" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-[#0A0F2E]" />
                <span className="text-sm text-gray-700">Stakeholders</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stakeholderCount}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-[#C9A84C]" />
                <span className="text-sm text-gray-700">Triggers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{triggerCount}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-700">Metrics</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metricCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readiness Checklist */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Readiness Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {readinessChecks.map((check, index) => {
              const Icon = check.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    check.met ? 'bg-green-950/20 border border-green-500/30' : 'bg-white border border-gray-200'
                  }`}
                >
                  {check.met ? (
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  )}
                  <Icon className={`h-4 w-4 ${check.met ? 'text-green-400' : 'text-gray-800'}`} />
                  <span className={`flex-1 ${check.met ? 'text-gray-900' : 'text-gray-700'}`}>
                    {check.label}
                  </span>
                  {check.met && (
                    <Badge className="bg-green-600/20 text-green-300 border-green-500/50 text-xs">
                      Complete
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-[#0A0F2E]/20 border border-[#2B8A6E]/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#0A0F2E] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#DFC178]">Estimated Execution Velocity</p>
                <p className="text-xs text-gray-700 mt-1">
                  {readinessScore >= 80 ? (
                    <>
                      <span className="text-green-400 font-semibold">12-minute coordination ready</span> - Your scenario has all critical elements for rapid execution.
                    </>
                  ) : readinessScore >= 60 ? (
                    <>
                      <span className="text-yellow-400 font-semibold">30-60 minute coordination</span> - Add missing elements to achieve optimal velocity.
                    </>
                  ) : (
                    <>
                      <span className="text-red-400 font-semibold">Multi-hour coordination likely</span> - Complete key requirements for faster execution.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-[#C9A84C]/30 bg-[#C9A84C]/20">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#C9A84C]" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {!hasExecutiveSponsor && (
              <div className="flex items-start gap-2">
                <span className="text-[#C9A84C] mt-0.5">•</span>
                <p className="text-gray-800">
                  <strong className="text-gray-900">Add Executive Sponsor:</strong> Critical for decision authority and rapid approvals
                </p>
              </div>
            )}
            {!hasAccountableOwner && (
              <div className="flex items-start gap-2">
                <span className="text-[#C9A84C] mt-0.5">•</span>
                <p className="text-gray-800">
                  <strong className="text-gray-900">Assign Accountable Owner:</strong> Essential for coordinated execution
                </p>
              </div>
            )}
            {triggerCount < 2 && (
              <div className="flex items-start gap-2">
                <span className="text-[#C9A84C] mt-0.5">•</span>
                <p className="text-gray-800">
                  <strong className="text-gray-900">Add More Triggers:</strong> Multiple signals improve detection accuracy
                </p>
              </div>
            )}
            {!hasKeyMetrics && (
              <div className="flex items-start gap-2">
                <span className="text-[#C9A84C] mt-0.5">•</span>
                <p className="text-gray-800">
                  <strong className="text-gray-900">Mark Key Metrics:</strong> Identify primary success indicators for focus
                </p>
              </div>
            )}
            {stakeholderCount < 3 && (
              <div className="flex items-start gap-2">
                <span className="text-[#C9A84C] mt-0.5">•</span>
                <p className="text-gray-800">
                  <strong className="text-gray-900">Add Cross-functional Stakeholders:</strong> Most scenarios require 3-7 stakeholders
                </p>
              </div>
            )}
            {readinessScore >= 90 && (
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <p className="text-green-300">
                  <strong>Excellent scenario definition!</strong> Ready for deployment and monitoring
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
