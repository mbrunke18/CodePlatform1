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

export default function ComprehensiveROIBreakdown({ embedded }: { embedded?: boolean }) {
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
    <div className="page-background min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-[#2B8A6E] flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Comprehensive ROI Analysis
                </h1>
                <p className="text-lg text-[#6B7280]">
                  Complete value breakdown across all strategic scenarios
                </p>
              </div>
            </div>
            <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45] gap-2" data-testid="button-export-report">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2B8A6E]/5 dark:bg-[#2B8A6E]/10 border-2 border-[#2B8A6E]/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#2B8A6E]">Total Annual Value</CardDescription>
              <CardTitle className="text-4xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="text-total-annual-value">
                ${totalAnnualValue.toFixed(0)}M
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#6B7280]">
                Across 170 strategic playbooks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0F2E]/5 dark:bg-[#0A0F2E]/10 border-2 border-[#0A0F2E]/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#0A0F2E] dark:text-[#C9A84C]">Avg Speed Advantage</CardDescription>
              <CardTitle className="text-4xl font-bold text-[#0A0F2E] dark:text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="text-avg-speed">
                {avgSpeedImprovement} days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#6B7280]">
                Faster decision execution
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#C9A84C]/5 dark:bg-[#C9A84C]/10 border-2 border-[#C9A84C]/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#C9A84C]">Platform Investment</CardDescription>
              <CardTitle className="text-4xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                $120K
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#6B7280]">
                Annual subscription cost
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0F2E]/5 dark:bg-[#0A0F2E]/10 border-2 border-[#0A0F2E]/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#0A0F2E] dark:text-[#C9A84C]">Net ROI</CardDescription>
              <CardTitle className="text-4xl font-bold text-[#0A0F2E] dark:text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="text-net-roi">
                {Math.round(((totalAnnualValue * 1000000 - 120000) / 120000) * 100).toLocaleString()}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#6B7280]">
                First-year return on investment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Value by Category */}
        <Card className="mb-8 border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Value Distribution by Strategy Type</CardTitle>
            <CardDescription>
              How Execution OS creates value across 8 strategic domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#2B8A6E]/5 dark:bg-[#2B8A6E]/10 rounded-lg p-6 border-2 border-[#2B8A6E]/30">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-[#2B8A6E]" />
                  <h3 className="font-semibold text-lg text-[#2B8A6E]">Market Growth</h3>
                </div>
                <div className="text-3xl font-bold text-[#2B8A6E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="text-offensive-value">
                  ${offensiveValue.toFixed(0)}M
                </div>
                <p className="text-sm text-[#6B7280] mb-4">
                  Market dynamics, opportunities, and expansion playbooks
                </p>
                <div className="space-y-1 text-xs text-[#2B8A6E]">
                  {scenarioData.filter(s => s.category === 'offensive').map(s => (
                    <div key={s.id} className="flex justify-between">
                      <span>{s.title}</span>
                      <span className="font-semibold">${s.valueNumber.toFixed(0)}M</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0A0F2E]/5 dark:bg-[#0A0F2E]/10 rounded-lg p-6 border-2 border-[#0A0F2E]/30">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-[#C9A84C]" />
                  <h3 className="font-semibold text-lg text-[#C9A84C]">Risk Management</h3>
                </div>
                <div className="text-3xl font-bold text-[#C9A84C] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="text-defensive-value">
                  ${defensiveValue.toFixed(0)}M
                </div>
                <p className="text-sm text-[#6B7280] mb-4">
                  Risk mitigation, compliance, crisis response
                </p>
                <div className="space-y-1 text-xs text-[#C9A84C]">
                  {scenarioData.filter(s => s.category === 'defensive').map(s => (
                    <div key={s.id} className="flex justify-between">
                      <span>{s.title}</span>
                      <span className="font-semibold">${s.valueNumber.toFixed(0)}M</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#C9A84C]/5 dark:bg-[#C9A84C]/10 rounded-lg p-6 border-2 border-[#C9A84C]/30">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-[#C9A84C]" />
                  <h3 className="font-semibold text-lg text-[#C9A84C]">Strategic Transformation</h3>
                </div>
                <div className="text-3xl font-bold text-[#C9A84C] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="text-special-teams-value">
                  ${specialTeamsValue.toFixed(0)}M
                </div>
                <p className="text-sm text-[#6B7280] mb-4">
                  M&A, restructuring, sustainability
                </p>
                <div className="space-y-1 text-xs text-[#C9A84C]">
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
          <TabsList className="mb-6 bg-white dark:bg-white/5 border border-[#E8E4DC] dark:border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-all-scenarios">All Playbooks</TabsTrigger>
            <TabsTrigger value="top5" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-top-5">Top 5 by Value</TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-comparison">Traditional vs Execution OS</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
              <CardHeader>
                <CardTitle style={{ fontFamily: "'Cormorant Garamond', serif" }}>Complete Playbook Value Analysis</CardTitle>
                <CardDescription>
                  Financial impact and speed advantages across strategic playbooks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#E8E4DC] dark:border-white/10">
                        <th className="text-left py-3 px-4 font-semibold text-[#0A0F2E] dark:text-white">Scenario</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#0A0F2E] dark:text-white">Category</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#0A0F2E] dark:text-white">Annual Value</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#0A0F2E] dark:text-white">Speed Advantage</th>
                        <th className="text-right py-3 px-4 font-semibold text-[#0A0F2E] dark:text-white">Elements</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarioData.map((scenario, index) => (
                        <tr 
                          key={scenario.id} 
                          className="border-b border-[#E8E4DC] dark:border-white/5 hover:bg-[#F8F7F4] dark:hover:bg-white/5"
                          data-testid={`row-scenario-${scenario.id}`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-[#0A0F2E] dark:text-white">{scenario.title}</div>
                            <div className="text-sm text-[#6B7280]">{scenario.purpose}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              className={
                                scenario.category === 'offensive' ? 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30' : 
                                scenario.category === 'defensive' ? 'bg-[#0A0F2E]/20 text-[#0A0F2E] dark:text-[#C9A84C] border-[#0A0F2E]/30' : 
                                'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30'
                              }
                            >
                              {scenario.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                              ${scenario.valueNumber.toFixed(1)}M
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-[#0A0F2E] dark:text-white">
                              {scenario.speedDays > 0 ? `${scenario.speedDays} days` : scenario.speedAdvantage}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-[#6B7280]">
                              {scenario.elementsActivated?.length || 0}/12
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[#F8F7F4] dark:bg-white/5 font-bold border-t-2 border-[#E8E4DC] dark:border-white/10">
                        <td className="py-4 px-4 text-lg" colSpan={2}>TOTAL VALUE</td>
                        <td className="py-4 px-4 text-right text-xl text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="text-table-total-value">
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
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
              <CardHeader>
                <CardTitle style={{ fontFamily: "'Cormorant Garamond', serif" }}>Top 5 Highest-Value Scenarios</CardTitle>
                <CardDescription>
                  The strategic scenarios that deliver the greatest financial impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topScenarios.map((scenario, index) => (
                    <div 
                      key={scenario.id} 
                      className="bg-[#F8F7F4] dark:bg-white/5 rounded-lg p-6 border-2 border-[#E8E4DC] dark:border-white/10"
                      data-testid={`card-top-scenario-${index + 1}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#2B8A6E] flex items-center justify-center text-white font-bold text-lg">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{scenario.title}</h3>
                            <p className="text-sm text-[#6B7280]">{scenario.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            ${scenario.valueNumber.toFixed(1)}M
                          </div>
                          <div className="text-sm text-[#6B7280]">annual value</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#0A0F2E] dark:text-[#C9A84C]" />
                          <span className="text-sm text-[#6B7280]">{scenario.speedAdvantage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                          <span className="text-sm text-[#6B7280]">
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
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
              <CardHeader>
                <CardTitle style={{ fontFamily: "'Cormorant Garamond', serif" }}>Traditional Approach vs. Execution OS: Side-by-Side Comparison</CardTitle>
                <CardDescription>
                  See how Execution OS' execution infrastructure delivers superior outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Traditional Approach */}
                  <div className="bg-[#0A0F2E]/5 dark:bg-[#0A0F2E]/10 rounded-lg p-6 border-2 border-[#0A0F2E]/30">
                    <h3 className="text-xl font-bold text-[#0A0F2E] dark:text-[#C9A84C] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Traditional Approach
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-[#0A0F2E] dark:text-[#C9A84C] mb-1">Average Response Time</div>
                        <div className="text-2xl font-bold text-[#0A0F2E] dark:text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>72 hours</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#0A0F2E] dark:text-[#C9A84C] mb-1">Decision Process</div>
                        <ul className="text-sm text-[#6B7280] space-y-1">
                          <li>• Emergency meetings to assemble team</li>
                          <li>• Debate response strategies</li>
                          <li>• Delayed decision-making</li>
                          <li>• Fragmented communication</li>
                          <li>• Improvised recovery plans</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm text-[#0A0F2E] dark:text-[#C9A84C] mb-1">Annual Cost Impact</div>
                        <div className="text-xl font-bold text-[#0A0F2E] dark:text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          ${totalAnnualValue.toFixed(0)}M+ in losses
                        </div>
                        <div className="text-xs text-[#6B7280] mt-1">
                          Revenue loss, inefficiencies, missed opportunities
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Execution OS Approach */}
                  <div className="bg-[#2B8A6E]/5 dark:bg-[#2B8A6E]/10 rounded-lg p-6 border-2 border-[#2B8A6E]/30">
                    <h3 className="text-xl font-bold text-[#2B8A6E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      ✅ Execution OS
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-[#2B8A6E] mb-1">Average Response Time</div>
                        <div className="text-2xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12 minutes</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#2B8A6E] mb-1">Decision Process</div>
                        <ul className="text-sm text-[#2B8A6E] space-y-1">
                          <li>• AI detects trigger automatically</li>
                          <li>• Pre-configured playbook activates</li>
                          <li>• One-click stakeholder coordination</li>
                          <li>• Real-time progress monitoring</li>
                          <li>• Learning captured for next time</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm text-[#2B8A6E] mb-1">Annual Value Created</div>
                        <div className="text-xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          ${totalAnnualValue.toFixed(0)}M+ delivered
                        </div>
                        <div className="text-xs text-[#2B8A6E] mt-1">
                          Cost savings, revenue protection, faster execution
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 bg-[#0A0F2E] rounded-lg p-6 border border-[#E8E4DC] dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-[#C9A84C] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        The Choice is Clear
                      </h4>
                      <p className="text-sm text-white/80">
                        Stop losing ${totalAnnualValue.toFixed(0)}M annually to slow, reactive decision-making. 
                        Get execution infrastructure that coordinates in 12 minutes, not 72 hours.
                      </p>
                    </div>
                    <Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] gap-2" data-testid="button-schedule-demo">
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
