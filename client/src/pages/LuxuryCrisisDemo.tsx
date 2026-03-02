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
              className={`${currentAct === act.id ? 'bg-[#0A0F2E] text-[#C9A84C] border-[#C9A84C]' : 'text-white/60 border-white/20 hover:bg-white/10'}`}
            >
              {act.label}
            </Badge>
            {index < acts.length - 1 && <ChevronRight className="h-4 w-4 mx-2 text-white/40" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page-background min-h-screen" style={{ background: "#0A0F2E" }}>
      <DemoNavHeader title="Luxury Crisis Demo" showBackButton={true} />
      <div className="container mx-auto px-4 py-12 pt-24 max-w-6xl text-white">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#C9A84C] text-[#0A0F2E]" data-testid="badge-demo-type">Interactive Demo</Badge>
          <h1 className="text-5xl font-bold mb-4 text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {crisisScenario.title}
          </h1>
          <p className="text-xl text-[#DFC178] mb-2">
            {crisisScenario.subtitle}
          </p>
          <p className="text-sm text-white/60 max-w-2xl mx-auto">
            Experience how Execution OS transforms AI detection into coordinated execution—
            turning a $280M crisis into a strategic advantage in just 12 minutes.
          </p>
        </div>

        {renderActIndicator()}

        {/* ACT: Introduction */}
        {currentAct === 'intro' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Organization Card */}
            <Card className="p-8 bg-white/5 border-white/10">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{luxuryOrg.name}</h2>
                <Badge variant="outline" className="mb-4 text-[#C9A84C] border-[#C9A84C]">{luxuryOrg.industry}</Badge>
                <div className="grid md:grid-cols-4 gap-6 mt-6">
                  <div>
                    <div className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{luxuryOrg.marketCap}</div>
                    <div className="text-sm text-white/60">Market Cap</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#DFC178]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{luxuryOrg.brands}</div>
                    <div className="text-sm text-white/60">Maisons</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{luxuryOrg.regions}</div>
                    <div className="text-sm text-white/60">Regions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {(luxuryOrg.employees / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-white/60">Employees</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white/5 border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-[#0A0F2E] rounded-full">
                  <Target className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>The Crisis Event</h3>
                  <p className="text-lg text-white/80 mb-4">
                    {crisisScenario.triggerEvent}
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/5 p-4 rounded border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Financial Impact</div>
                      <div className="text-2xl font-bold text-[#C9A84C]">{crisisScenario.financialImpact}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Response Window</div>
                      <div className="text-2xl font-bold text-[#C9A84C]">{crisisScenario.timeWindow}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Stakeholders</div>
                      <div className="text-2xl font-bold text-[#C9A84C]">{crisisScenario.stakeholdersInvolved}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* The Playbook */}
            <Card className="p-8 bg-white/5 border-[#C9A84C]/50 border-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C9A84C] rounded-full">
                  <Award className="h-6 w-6 text-[#0A0F2E]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Playbook {playbookTemplate.number}: {playbookTemplate.name}
                  </h3>
                  <Badge className="mb-4 bg-[#2B8A6E] text-white">{playbookTemplate.domain}</Badge>
                  <p className="text-sm text-white/60 mb-4">
                    This playbook is {playbookTemplate.preparedness}% prepared with pre-filled stakeholders, 
                    communication templates, and execution plans ready to activate.
                  </p>
                  <div className="grid md:grid-cols-4 gap-3">
                    {playbookTemplate.sections.slice(0, 4).map(section => (
                      <div key={section.name} className="bg-white/5 p-3 rounded text-center border border-white/10">
                        <div className="text-xs text-white/60 mb-1">{section.name}</div>
                        <div className="text-lg font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{section.prefill}%</div>
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
                className="gap-2 bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
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
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Act 1: AI Detection</h2>
              <p className="text-lg text-white/80 mb-2">
                {crisisScenario.narrative.detection}
              </p>
              <Badge variant="outline" className="mt-2 text-[#C9A84C] border-[#C9A84C]">
                Watch the AI confidence score climb in real-time
              </Badge>
            </Card>

            <AIRadarSimulation 
              onTriggerFired={proceedToNextAct}
              autoStart={true}
            />

            <div className="text-center text-sm text-white/60">
              The AI will automatically proceed when trigger threshold is reached...
            </div>
          </div>
        )}

        {/* ACT 2: Coordination */}
        {currentAct === 'coordination' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Act 2: The 12-Minute Coordination</h2>
              <p className="text-lg text-white/80 mb-2">
                {crisisScenario.narrative.coordination}
              </p>
              <Badge variant="outline" className="mt-2 text-[#C9A84C] border-[#C9A84C]">
                <Clock className="h-3 w-3 mr-1 inline" />
                Watch 193 stakeholders coordinate in real-time
              </Badge>
            </Card>

            <TwelveMinuteTimer 
              timelineEvents={luxuryDemoData.timelineEvents}
              onComplete={proceedToNextAct}
              autoStart={true}
            />

            <div className="text-center text-sm text-white/60">
              The timer will automatically proceed when coordination is complete...
            </div>
          </div>
        )}

        {/* ACT 3: Outcome */}
        {currentAct === 'outcome' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="p-8 bg-white/5 border-white/10">
              <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Act 3: The Outcome</h2>
              <p className="text-lg text-white/80 mb-2">
                {crisisScenario.narrative.outcome}
              </p>
              <Badge variant="outline" className="mt-2 text-[#2B8A6E] border-[#2B8A6E]">
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
                className="gap-2 bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
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
            <Card className="p-12 bg-white/5 border-white/10 text-center">
              <Award className="h-16 w-16 mx-auto mb-6 text-[#2B8A6E]" />
              <h2 className="text-4xl font-bold mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Demo Complete</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                You've just experienced how Execution OS transforms the gap between AI detection 
                and human execution—from 72 hours of coordination chaos to 12 minutes of 
                orchestrated response.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 border-2 border-[#2B8A6E] bg-white/5">
                  <div className="text-4xl font-bold text-[#2B8A6E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>$280M</div>
                  <div className="text-sm text-white/60">Value Preserved</div>
                </Card>
                <Card className="p-6 border-2 border-[#DFC178] bg-white/5">
                  <div className="text-4xl font-bold text-[#DFC178] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12 min</div>
                  <div className="text-sm text-white/60">Full Coordination</div>
                </Card>
                <Card className="p-6 border-2 border-[#C9A84C] bg-white/5">
                  <div className="text-4xl font-bold text-[#C9A84C] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>193</div>
                  <div className="text-sm text-white/60">Stakeholders Aligned</div>
                </Card>
              </div>

              <div className="bg-white/5 p-6 rounded-lg border-2 border-[#DFC178] mb-8">
                <p className="font-semibold mb-2 text-white">The Strategic Insight</p>
                <p className="text-sm text-white/80">
                  Luxury brands are spending billions on AI for detection. But without Execution OS' 
                  execution layer, they're still losing 72 hours—and hundreds of millions—to 
                  coordination chaos. Execution OS is the missing piece that turns AI insights into 
                  coordinated action at Fortune 1000 speed and scale.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => setCurrentAct('intro')}
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                  data-testid="button-restart-demo"
                >
                  Restart Demo
                </Button>
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = '/playbook-library'}
                  className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
                  data-testid="button-explore-playbooks"
                >
                  Explore All 170 Playbooks
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
