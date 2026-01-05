import StandardNav from '@/components/layout/StandardNav';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, PlayCircle, BarChart3, Clock, Target, Award } from 'lucide-react';
import AIRadarSimulation from '@/components/demo/AIRadarSimulation';
import TwelveMinuteTimer from '@/components/demo/TwelveMinuteTimer';
import ROIComparison from '@/components/demo/ROIComparison';
import DemoNavHeader from '@/components/demo/DemoNavHeader';
import { crisisScenario, luxuryOrg, playbookTemplate, roiComparisonData, twelveMinuteTimeline } from '@shared/luxury-demo-data';

const luxuryDemoData = {
  timelineEvents: twelveMinuteTimeline
};

type DemoAct = 'intro' | 'detection' | 'coordination' | 'outcome' | 'complete';

export default function LuxuryCrisisDemo() {
  const [currentAct, setCurrentAct] = useState<DemoAct>('intro');

  const proceedToNextAct = () => {
    const actSequence: DemoAct[] = ['intro', 'detection', 'coordination', 'outcome', 'complete'];
    const currentIndex = actSequence.indexOf(currentAct);
    if (currentIndex < actSequence.length - 1) {
      setCurrentAct(actSequence[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderActIndicator = () => {
    const acts = [
      { id: 'intro', label: 'Introduction' },
      { id: 'detection', label: 'Act 1: Detection' },
      { id: 'coordination', label: 'Act 2: Coordination' },
      { id: 'outcome', label: 'Act 3: Outcome' }
    ];

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {acts.map((act, index) => (
          <div key={act.id} className="flex items-center">
            <Badge 
              variant={currentAct === act.id ? 'default' : 'outline'}
              className={currentAct === act.id ? 'animate-pulse' : ''}
            >
              {act.label}
            </Badge>
            {index < acts.length - 1 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page-background min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <DemoNavHeader title="Luxury Crisis Demo" showBackButton={true} />
      <div className="container mx-auto px-4 py-12 pt-24 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" data-testid="badge-demo-type">Interactive Demo</Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {crisisScenario.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            {crisisScenario.subtitle}
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Experience how M transforms AI detection into coordinated execution—
            turning a $280M crisis into a strategic advantage in just 12 minutes.
          </p>
        </div>

        {renderActIndicator()}

        {/* ACT: Introduction */}
        {currentAct === 'intro' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Organization Card */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">{luxuryOrg.name}</h2>
                <Badge variant="outline" className="mb-4">{luxuryOrg.industry}</Badge>
                <div className="grid md:grid-cols-4 gap-6 mt-6">
                  <div>
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">{luxuryOrg.marketCap}</div>
                    <div className="text-sm text-muted-foreground">Market Cap</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{luxuryOrg.brands}</div>
                    <div className="text-sm text-muted-foreground">Maisons</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-400">{luxuryOrg.regions}</div>
                    <div className="text-sm text-muted-foreground">Regions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">
                      {(luxuryOrg.employees / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-muted-foreground">Employees</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* The Scenario */}
            <Card className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <Target className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">The Crisis Event</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    {crisisScenario.triggerEvent}
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                      <div className="text-sm text-muted-foreground mb-1">Financial Impact</div>
                      <div className="text-2xl font-bold text-red-600">{crisisScenario.financialImpact}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                      <div className="text-sm text-muted-foreground mb-1">Response Window</div>
                      <div className="text-2xl font-bold text-yellow-600">{crisisScenario.timeWindow}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                      <div className="text-sm text-muted-foreground mb-1">Stakeholders</div>
                      <div className="text-2xl font-bold text-blue-600">{crisisScenario.stakeholdersInvolved}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* The Playbook */}
            <Card className="p-8 bg-blue-50 dark:bg-blue-950 border-blue-500 border-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 page-background">
                  <h3 className="text-2xl font-bold mb-2">
                    Playbook {playbookTemplate.number}: {playbookTemplate.name}
                  </h3>
                  <Badge className="mb-4">{playbookTemplate.domain}</Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    This playbook is {playbookTemplate.preparedness}% prepared with pre-filled stakeholders, 
                    communication templates, and execution plans ready to activate.
                  </p>
                  <div className="grid md:grid-cols-4 gap-3">
                    {playbookTemplate.sections.slice(0, 4).map(section => (
                      <div key={section.name} className="bg-white dark:bg-gray-900 p-3 rounded text-center">
                        <div className="text-xs text-muted-foreground mb-1">{section.name}</div>
                        <div className="text-lg font-bold text-blue-600">{section.prefill}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={proceedToNextAct}
                className="gap-2"
                data-testid="button-start-demo"
              >
                <PlayCircle className="h-5 w-5" />
                Begin Crisis Simulation
              </Button>
            </div>
          </div>
        )}

        {/* ACT 1: Detection */}
        {currentAct === 'detection' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
              <h2 className="text-3xl font-bold mb-4">Act 1: AI Detection</h2>
              <p className="text-lg text-muted-foreground mb-2">
                {crisisScenario.narrative.detection}
              </p>
              <Badge variant="outline" className="mt-2">
                Watch the AI confidence score climb in real-time
              </Badge>
            </Card>

            <AIRadarSimulation 
              onTriggerFired={proceedToNextAct}
              autoStart={true}
            />

            <div className="text-center text-sm text-muted-foreground">
              The AI will automatically proceed when trigger threshold is reached...
            </div>
          </div>
        )}

        {/* ACT 2: Coordination */}
        {currentAct === 'coordination' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <h2 className="text-3xl font-bold mb-4">Act 2: The 12-Minute Coordination</h2>
              <p className="text-lg text-muted-foreground mb-2">
                {crisisScenario.narrative.coordination}
              </p>
              <Badge variant="outline" className="mt-2">
                <Clock className="h-3 w-3 mr-1 inline" />
                Watch 193 stakeholders coordinate in real-time
              </Badge>
            </Card>

            <TwelveMinuteTimer 
              timelineEvents={luxuryDemoData.timelineEvents}
              onComplete={proceedToNextAct}
              autoStart={true}
            />

            <div className="text-center text-sm text-muted-foreground">
              The timer will automatically proceed when coordination is complete...
            </div>
          </div>
        )}

        {/* ACT 3: Outcome */}
        {currentAct === 'outcome' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <h2 className="text-3xl font-bold mb-4">Act 3: The Outcome</h2>
              <p className="text-lg text-muted-foreground mb-2">
                {crisisScenario.narrative.outcome}
              </p>
              <Badge variant="outline" className="mt-2">
                <BarChart3 className="h-3 w-3 mr-1 inline" />
                See the ROI comparison
              </Badge>
            </Card>

            <ROIComparison
              traditional={{
                label: roiComparisonData.traditional.title,
                duration: roiComparisonData.traditional.timeline,
                approach: roiComparisonData.traditional.approach,
                outcome: roiComparisonData.traditional.outcome,
                points: roiComparisonData.traditional.points
              }}
              vexor={{
                label: roiComparisonData.vexor.title,
                duration: roiComparisonData.vexor.timeline,
                approach: roiComparisonData.vexor.approach,
                outcome: roiComparisonData.vexor.outcome,
                points: roiComparisonData.vexor.points
              }}
              bottomLine={roiComparisonData.bottomLine}
            />

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={proceedToNextAct}
                className="gap-2"
                data-testid="button-see-summary"
              >
                See Final Summary
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Final Summary */}
        {currentAct === 'complete' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-12 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-purple-950 dark:via-blue-950 dark:to-green-950 text-center">
              <Award className="h-16 w-16 mx-auto mb-6 text-green-600" />
              <h2 className="text-4xl font-bold mb-4">Demo Complete</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                You've just experienced how M transforms the gap between AI detection 
                and human execution—from 72 hours of coordination chaos to 12 minutes of 
                orchestrated response.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 border-2 border-green-500">
                  <div className="text-4xl font-bold text-green-600 mb-2">$280M</div>
                  <div className="text-sm text-muted-foreground">Value Preserved</div>
                </Card>
                <Card className="p-6 border-2 border-blue-500">
                  <div className="text-4xl font-bold text-blue-600 mb-2">12 min</div>
                  <div className="text-sm text-muted-foreground">Full Coordination</div>
                </Card>
                <Card className="p-6 border-2 border-purple-500">
                  <div className="text-4xl font-bold text-purple-600 mb-2">193</div>
                  <div className="text-sm text-muted-foreground">Stakeholders Aligned</div>
                </Card>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 border-blue-500 mb-8">
                <p className="font-semibold mb-2">The Strategic Insight</p>
                <p className="text-sm text-muted-foreground">
                  Luxury brands are spending billions on AI for detection. But without M's 
                  execution layer, they're still losing 72 hours—and hundreds of millions—to 
                  coordination chaos. M is the missing piece that turns AI insights into 
                  coordinated action at Fortune 1000 speed and scale.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => setCurrentAct('intro')}
                  variant="outline"
                  data-testid="button-restart-demo"
                >
                  Restart Demo
                </Button>
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/playbook-library'}
                  data-testid="button-explore-playbooks"
                >
                  Explore All 166 Playbooks
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
