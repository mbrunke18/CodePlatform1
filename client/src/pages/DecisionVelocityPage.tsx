import PageLayout from "@/components/layout/PageLayout";
import DecisionVelocityDashboard from "@/components/DecisionVelocityDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Target, Award } from "lucide-react";

export default function DecisionVelocityPage() {
  const organizationId = "demo-org-1";

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Decision Velocity Dashboard
            </h1>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
              Dynamic Strategy Metric
            </Badge>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Measure your competitive advantage through decision velocity - the #1 metric for Dynamic Strategy practitioners
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            Companies like Microsoft, DBS Bank, and Amazon track decision velocity as their strategic execution metric
          </p>
        </div>

        {/* NFL + Dynamic Strategy Foundation */}
        <Card className="bg-gradient-to-br .section-background dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              The Foundation: NFL Coaching + Dynamic Strategy
            </CardTitle>
            <CardDescription>
              Built by reverse-engineering how NFL coaches make 80+ decisions in under 40 seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-base font-medium text-blue-900 dark:text-blue-100">
                M was built by studying the most demanding decision-making system in the world: <strong>NFL coaching</strong>. 
                Then we discovered Microsoft, DBS Bank, and Amazon independently developed the same system through <strong>Dynamic Strategy</strong> methodology.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 my-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-3">🏈 NFL Coaching (Execution Proof)</div>
                  <div className="space-y-2 text-xs">
                    <div><strong>Game Planning:</strong> Create 100+ plays for every scenario</div>
                    <div><strong>Sideline Headset:</strong> Monitor game in real-time</div>
                    <div><strong>40-Second Clock:</strong> Call play, coordinate 11 players</div>
                    <div><strong>Film Study:</strong> Review decisions, improve playbook</div>
                    <div className="text-green-600 dark:text-green-400 font-semibold mt-2">✓ Works every Sunday, 80+ decisions/game</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-3">🎯 Dynamic Strategy (Strategic Proof)</div>
                  <div className="space-y-2 text-xs">
                    <div><strong>Perpetual Foresight:</strong> Continuous signal scanning</div>
                    <div><strong>Data Pulse:</strong> Real-time intelligence loops</div>
                    <div><strong>Aligned Agility:</strong> Pre-configured execution</div>
                    <div><strong>Org Learning:</strong> Capture outcomes, refine</div>
                    <div className="text-green-600 dark:text-green-400 font-semibold mt-2">✓ Grew Microsoft $300B → $3T</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-4 border-2 border-blue-300 dark:border-blue-700">
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">⚡ M = Both Systems Unified</div>
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  You get the <strong>proven execution speed of NFL coaching</strong> (works every Sunday) combined with the 
                  <strong> proven transformation framework of Dynamic Strategy</strong> (grew Microsoft, DBS Bank, Amazon). 
                  What took them 5 years to build, you get in 90 days.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What is Decision Velocity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              What is Decision Velocity?
            </CardTitle>
            <CardDescription>
              The competitive advantage metric that NFL coaches and Fortune 1000 leaders track
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                <strong>Decision Velocity</strong> measures how fast your organization moves from strategic signal to execution completion. 
                NFL coaches master this with their 40-second play clock. Fortune 1000 companies call it their ultimate competitive advantage.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 my-4">
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  The Formula:
                </div>
                <div className="text-xs space-y-1">
                  <div>Time from Trigger Detection → Decision → Execution Completion</div>
                  <div className="text-muted-foreground">Your velocity: 12 minutes vs Competitor velocity: 72 hours</div>
                  <div className="font-medium text-green-600 dark:text-green-400">Result: 5-day competitive advantage per strategic move</div>
                </div>
              </div>
              <p>
                <strong>Why It Matters:</strong> While competitors coordinate through email chains and meetings, you execute instantly. 
                After 10 strategic events, you're 50 days ahead - the difference between category leader and market follower.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard */}
        <DecisionVelocityDashboard organizationId={organizationId} />

        {/* How to Improve */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              How to Improve Decision Velocity
            </CardTitle>
            <CardDescription>
              Dynamic Strategy principles that amplify velocity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-4">
                <div className="font-semibold text-blue-700 dark:text-blue-300 mb-2">1. Perpetual Foresight</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  24/7 AI monitoring detects signals early. Early detection = faster response = higher velocity.
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-4">
                <div className="font-semibold text-purple-700 dark:text-purple-300 mb-2">2. Aligned Agility</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Pre-configured playbooks with role-based tasks eliminate coordination time. One-click activation = instant execution.
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-4">
                <div className="font-semibold text-green-700 dark:text-green-300 mb-2">3. Ecosystem Connectors</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  More integrations = faster coordination. 10-15 connected systems eliminate manual handoffs.
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-4">
                <div className="font-semibold text-orange-700 dark:text-orange-300 mb-2">4. Institutional Memory</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  AI learns what works. Each execution improves velocity for the next event. Continuous improvement compounds.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Real-World Examples
            </CardTitle>
            <CardDescription>
              How Dynamic Strategy companies achieve decision velocity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="font-semibold text-gray-900 dark:text-white">Microsoft</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Transformed from 5-year planning cycles to continuous iteration. Decision velocity improvement enabled 
                  market cap growth from $300B to $3T. Satya Nadella: "Strategy must be a living process that learns in real time."
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <div className="font-semibold text-gray-900 dark:text-white">DBS Bank</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  "Live More, Bank Less" required rapid execution. Built "data nervous system" and strategy sprints to improve 
                  decision velocity. Result: Named World's Best Bank, executing 5x faster than traditional banks.
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <div className="font-semibold text-gray-900 dark:text-white">Amazon</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  "Always Day One" culture = continuous decision velocity. Bezos insisted on doubling experiments yearly. 
                  Speed of execution (not just innovation) created category leadership in retail, cloud, and logistics.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
