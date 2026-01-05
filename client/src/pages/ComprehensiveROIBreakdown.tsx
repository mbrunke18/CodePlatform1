import StandardNav from '@/components/layout/StandardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Shield,
  Target,
  Download,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { scenarios } from "@shared/scenarios";

// Parse annual value from string to number (e.g., "$12M annual savings" -> 12)
function parseAnnualValue(valueString: string): number {
  const match = valueString.match(/\$(\d+(?:\.\d+)?)(M|K)?/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2];
  if (unit === 'M') return value;
  if (unit === 'K') return value / 1000;
  return value / 1000000; // Assume dollars if no unit
}

// Calculate speed improvement in days
function parseSpeedAdvantage(speedString: string): number {
  // Extract patterns like "18 days faster" or "2-3 months faster"
  const daysMatch = speedString.match(/(\d+)\s*days?\s*faster/i);
  if (daysMatch) return parseInt(daysMatch[1]);
  
  const monthsMatch = speedString.match(/(\d+)-?(\d+)?\s*months?\s*faster/i);
  if (monthsMatch) {
    const avgMonths = monthsMatch[2] ? (parseInt(monthsMatch[1]) + parseInt(monthsMatch[2])) / 2 : parseInt(monthsMatch[1]);
    return avgMonths * 30;
  }
  
  const weeksMatch = speedString.match(/(\d+)\s*weeks?\s*faster/i);
  if (weeksMatch) return parseInt(weeksMatch[1]) * 7;
  
  return 0;
}

export default function ComprehensiveROIBreakdown() {
  // Calculate totals
  const scenarioData = scenarios.map(scenario => ({
    ...scenario,
    valueNumber: parseAnnualValue(scenario.annualValue || ''),
    speedDays: parseSpeedAdvantage(scenario.speedAdvantage || '')
  }));

  const totalAnnualValue = scenarioData.reduce((sum, s) => sum + s.valueNumber, 0);
  const avgSpeedImprovement = Math.round(
    scenarioData.reduce((sum, s) => sum + s.speedDays, 0) / scenarioData.length
  );

  // Category breakdown
  const offensiveValue = scenarioData.filter(s => s.category === 'offensive').reduce((sum, s) => sum + s.valueNumber, 0);
  const defensiveValue = scenarioData.filter(s => s.category === 'defensive').reduce((sum, s) => sum + s.valueNumber, 0);
  const specialTeamsValue = scenarioData.filter(s => s.category === 'special-teams').reduce((sum, s) => sum + s.valueNumber, 0);

  // Top scenarios by value
  const topScenarios = [...scenarioData].sort((a, b) => b.valueNumber - a.valueNumber).slice(0, 5);

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                  Comprehensive ROI Analysis
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Complete value breakdown across all strategic scenarios
                </p>
              </div>
            </div>
            <Button className="gap-2" data-testid="button-export-report">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700 dark:text-green-300">Total Annual Value</CardDescription>
              <CardTitle className="text-4xl font-bold text-green-900 dark:text-green-100" data-testid="text-total-annual-value">
                ${totalAnnualValue.toFixed(0)}M
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 dark:text-green-300">
                Across 166 strategic playbooks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700 dark:text-blue-300">Avg Speed Advantage</CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-900 dark:text-blue-100" data-testid="text-avg-speed">
                {avgSpeedImprovement} days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Faster decision execution
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700 dark:text-purple-300">Platform Investment</CardDescription>
              <CardTitle className="text-4xl font-bold text-purple-900 dark:text-purple-100">
                $120K
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Annual subscription cost
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-2 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-700 dark:text-orange-300">Net ROI</CardDescription>
              <CardTitle className="text-4xl font-bold text-orange-900 dark:text-orange-100" data-testid="text-net-roi">
                {Math.round(((totalAnnualValue * 1000000 - 120000) / 120000) * 100).toLocaleString()}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                First-year return on investment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Value by Category */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Value Distribution by Strategy Type</CardTitle>
            <CardDescription>
              How M creates value across 8 strategic domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Market Growth</h3>
                </div>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2" data-testid="text-offensive-value">
                  ${offensiveValue.toFixed(0)}M
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  Market dynamics, opportunities, and expansion playbooks
                </p>
                <div className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                  {scenarioData.filter(s => s.category === 'offensive').map(s => (
                    <div key={s.id} className="flex justify-between">
                      <span>{s.title}</span>
                      <span className="font-semibold">${s.valueNumber.toFixed(0)}M</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-950 rounded-lg p-6 border-2 border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-lg text-red-900 dark:text-red-100">Risk Management</h3>
                </div>
                <div className="text-3xl font-bold text-red-900 dark:text-red-100 mb-2" data-testid="text-defensive-value">
                  ${defensiveValue.toFixed(0)}M
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Risk mitigation, compliance, crisis response
                </p>
                <div className="space-y-1 text-xs text-red-600 dark:text-red-400">
                  {scenarioData.filter(s => s.category === 'defensive').map(s => (
                    <div key={s.id} className="flex justify-between">
                      <span>{s.title}</span>
                      <span className="font-semibold">${s.valueNumber.toFixed(0)}M</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">Strategic Transformation</h3>
                </div>
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2" data-testid="text-special-teams-value">
                  ${specialTeamsValue.toFixed(0)}M
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                  M&A, restructuring, sustainability
                </p>
                <div className="space-y-1 text-xs text-purple-600 dark:text-purple-400">
                  {scenarioData.filter(s => s.category === 'special-teams').map(s => (
                    <div key={s.id} className="flex justify-between">
                      <span>{s.title}</span>
                      <span className="font-semibold">${s.valueNumber.toFixed(0)}M</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Scenario Breakdown */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all" data-testid="tab-all-scenarios">All Playbooks</TabsTrigger>
            <TabsTrigger value="top5" data-testid="tab-top-5">Top 5 by Value</TabsTrigger>
            <TabsTrigger value="comparison" data-testid="tab-comparison">Traditional vs M</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Complete Playbook Value Analysis</CardTitle>
                <CardDescription>
                  Financial impact and speed advantages across strategic playbooks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Scenario</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Category</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">Annual Value</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">Speed Advantage</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white">Elements</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarioData.map((scenario, index) => (
                        <tr 
                          key={scenario.id} 
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                          data-testid={`row-scenario-${scenario.id}`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900 dark:text-white">{scenario.title}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{scenario.purpose}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={scenario.category === 'offensive' ? 'default' : scenario.category === 'defensive' ? 'destructive' : 'secondary'}
                            >
                              {scenario.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="font-bold text-green-600 dark:text-green-400">
                              ${scenario.valueNumber.toFixed(1)}M
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-slate-900 dark:text-white">
                              {scenario.speedDays > 0 ? `${scenario.speedDays} days` : scenario.speedAdvantage}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-slate-600 dark:text-slate-400">
                              {scenario.elementsActivated?.length || 0}/12
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 dark:bg-slate-900 font-bold border-t-2 border-slate-300 dark:border-slate-600">
                        <td className="py-4 px-4 text-lg" colSpan={2}>TOTAL VALUE</td>
                        <td className="py-4 px-4 text-right text-xl text-green-600 dark:text-green-400" data-testid="text-table-total-value">
                          ${totalAnnualValue.toFixed(1)}M
                        </td>
                        <td className="py-4 px-4 text-right" colSpan={2}>
                          Avg {avgSpeedImprovement} days faster
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top5">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Highest-Value Scenarios</CardTitle>
                <CardDescription>
                  The strategic scenarios that deliver the greatest financial impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topScenarios.map((scenario, index) => (
                    <div 
                      key={scenario.id} 
                      className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-lg p-6 border-2 border-slate-200 dark:border-slate-700"
                      data-testid={`card-top-scenario-${index + 1}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{scenario.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{scenario.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            ${scenario.valueNumber.toFixed(1)}M
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">annual value</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{scenario.speedAdvantage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {scenario.elementsActivated?.length || 0} elements activated
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Traditional Approach vs. M: Side-by-Side Comparison</CardTitle>
                <CardDescription>
                  See how M's NFL coach-inspired methodology delivers superior outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Traditional Approach */}
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-6 border-2 border-red-200 dark:border-red-800">
                    <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">
                      ❌ Traditional Approach
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-red-700 dark:text-red-300 mb-1">Average Response Time</div>
                        <div className="text-2xl font-bold text-red-900 dark:text-red-100">72 hours</div>
                      </div>
                      <div>
                        <div className="text-sm text-red-700 dark:text-red-300 mb-1">Decision Process</div>
                        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                          <li>• Emergency meetings to assemble team</li>
                          <li>• Debate response strategies</li>
                          <li>• Delayed decision-making</li>
                          <li>• Fragmented communication</li>
                          <li>• Improvised recovery plans</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm text-red-700 dark:text-red-300 mb-1">Annual Cost Impact</div>
                        <div className="text-xl font-bold text-red-900 dark:text-red-100">
                          ${totalAnnualValue.toFixed(0)}M+ in losses
                        </div>
                        <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                          Revenue loss, inefficiencies, missed opportunities
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* M Approach */}
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">
                      ✅ M Platform
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-green-700 dark:text-green-300 mb-1">Average Response Time</div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">12 minutes</div>
                      </div>
                      <div>
                        <div className="text-sm text-green-700 dark:text-green-300 mb-1">Decision Process</div>
                        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                          <li>• AI detects trigger automatically</li>
                          <li>• Pre-configured playbook activates</li>
                          <li>• One-click stakeholder coordination</li>
                          <li>• Real-time progress monitoring</li>
                          <li>• Learning captured for next time</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm text-green-700 dark:text-green-300 mb-1">Annual Value Created</div>
                        <div className="text-xl font-bold text-green-900 dark:text-green-100">
                          ${totalAnnualValue.toFixed(0)}M+ delivered
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                          Cost savings, revenue protection, faster execution
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-2">
                        The Choice is Clear
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Stop losing ${totalAnnualValue.toFixed(0)}M annually to slow, reactive decision-making. 
                        Get NFL coach-level execution speed in your boardroom.
                      </p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2" data-testid="button-schedule-demo">
                      Schedule Demo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
