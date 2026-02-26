import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Shield, Target, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Link } from 'wouter';

export default function CrisisExposureMatrix() {
  const { data: organizationsData } = useQuery<any[]>({ 
    queryKey: ['/api/organizations'] 
  });
  const organizations = organizationsData ?? [];
  const organizationId = organizations[0]?.id;

  const { data: scenariosQueryData } = useQuery<any[]>({
    queryKey: ['/api/strategic-scenarios', organizationId],
    enabled: !!organizationId,
  });
  const scenariosData = scenariosQueryData ?? [];

  // Group scenarios by likelihood and impact
  const getQuadrant = (likelihood: number, impact: string) => {
    const likelihoodThreshold = 0.5; // 50%
    const isHighLikelihood = likelihood >= likelihoodThreshold;
    const isHighImpact = impact === 'high' || impact === 'severe';

    if (isHighLikelihood && isHighImpact) return 'critical';
    if (!isHighLikelihood && isHighImpact) return 'important';
    if (isHighLikelihood && !isHighImpact) return 'monitor';
    return 'low';
  };

  const critical = scenariosData.filter(s => getQuadrant(s.likelihood || 0, s.impact) === 'critical');
  const important = scenariosData.filter(s => getQuadrant(s.likelihood || 0, s.impact) === 'important');
  const monitor = scenariosData.filter(s => getQuadrant(s.likelihood || 0, s.impact) === 'monitor');
  const low = scenariosData.filter(s => getQuadrant(s.likelihood || 0, s.impact) === 'low');

  const QuadrantCard = ({ 
    title, 
    description, 
    scenarios, 
    className,
    icon: Icon 
  }: { 
    title: string; 
    description: string; 
    scenarios: any[]; 
    className: string;
    icon: any;
  }) => (
    <Card className={`${className} border-2 rounded-none`} data-testid={`card-${title.toLowerCase().replace(' ', '-')}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <CardTitle style={CG} className="text-2xl font-bold">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="text-lg font-bold border-[#E8E4DC] text-[#0A0F2E] rounded-none" data-testid={`badge-count-${title.toLowerCase().replace(' ', '-')}`}>
            {scenarios.length}
          </Badge>
        </div>
        <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {scenarios.length === 0 ? (
          <p className="text-sm text-[#6B7280] italic">No scenarios in this category</p>
        ) : (
          <div className="space-y-2">
            {scenarios.slice(0, 5).map((scenario) => (
              <Link
                key={scenario.id}
                href={`/strategic-monitoring/${scenario.id}`}
                data-testid={`link-scenario-${scenario.id}`}
              >
                <div className="flex items-center justify-between p-2 rounded hover:bg-[#F8F7F4] cursor-pointer transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0A0F2E]">{scenario.title || scenario.name}</p>
                    <p className="text-xs text-[#6B7280]">
                      Likelihood: {Math.round((scenario.likelihood || 0) * 100)}% | Impact: {scenario.impact}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#6B7280]" />
                </div>
              </Link>
            ))}
            {scenarios.length > 5 && (
              <p className="text-xs text-[#6B7280] text-center pt-2">
                +{scenarios.length - 5} more scenarios
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const OFF = "#F8F7F4";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  return (
    <PageLayout>
      <div className="flex-1 bg-[#F8F7F4] overflow-y-auto" data-testid="crisis-exposure-matrix-page">
        {/* Navy Hero Section */}
        <div style={{ background: NAVY, padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "radial-gradient(#C9A84C 0.5px, transparent 0.5px)", 
            backgroundSize: "32px 32px",
            opacity: 0.1
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: GOLD }}>Strategic Risk Assessment</span>
            </div>
            <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(48px,6vw,72px)", lineHeight: 1, color: "#fff", marginBottom: 24 }}>
              Crisis Exposure <em style={{ fontStyle: "italic", color: "#DFC178" }}>Matrix</em>
            </h1>
            <p className="text-white/60 text-xl leading-relaxed max-w-3xl">
              Prioritize your playbook preparation with our Likelihood × Impact framework. 
              Focus on <span className="text-red-700 font-bold">Critical threats</span> first for fastest time-to-value and maximum executive resilience.
            </p>
          </div>
        </div>

        <div className="p-12 max-w-7xl mx-auto space-y-12">
          {/* Strategy Card */}
          <Card className="bg-[#0A0F2E] border-none rounded-none shadow-xl overflow-hidden relative">
            <div style={{ 
              position: "absolute", 
              right: "-5%", 
              bottom: "-10%", 
              width: "40%", 
              height: "120%", 
              background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
              filter: "blur(40px)"
            }} />
            <CardHeader className="p-10 pb-4 relative z-10">
              <CardTitle style={CG} className="text-3xl text-white mb-2">90-Day Onboarding Strategy</CardTitle>
              <CardDescription className="text-[#DFC178] text-lg font-medium italic">
                Don't try to prepare for all 170 playbooks at once. Start with your Top 10 Critical threats.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#C9A84C] text-[#0A0F2E] rounded-none w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-black">01</div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Phase One</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <strong className="text-white block mb-1">Days 1-30: Discovery</strong>
                    Run your Crisis Exposure Matrix workshop with our Senior Crisis Architects.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#2B8A6E] text-white rounded-none w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-black">02</div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Phase Two</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <strong className="text-white block mb-1">Days 31-90: Hardening</strong>
                    Get your Top 10 Critical playbooks to 95%+ readiness level.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#DFC178] text-[#0A0F2E] rounded-none w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-black">03</div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Phase Three</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <strong className="text-white block mb-1">Ongoing: Optimization</strong>
                    Build out remaining playbooks with quarterly readiness sprints.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2x2 Matrix Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Top Left: High Impact, Low Likelihood */}
            <QuadrantCard
              title="Important"
              description="High Impact, Lower Likelihood - Strategic preparation"
              scenarios={important}
              className="bg-white border-[#E8E4DC] hover:border-[#DFC178]/50"
              icon={Shield}
            />

            {/* Top Right: High Impact, High Likelihood */}
            <QuadrantCard
              title="Critical Priority"
              description="High Impact, High Likelihood - Immediate focus"
              scenarios={critical}
              className="bg-red-50 border-red-700/20 hover:border-red-700/50"
              icon={AlertTriangle}
            />

            {/* Bottom Left: Low Impact, Low Likelihood */}
            <QuadrantCard
              title="Low Priority"
              description="Lower Impact, Lower Likelihood - Operational tasks"
              scenarios={low}
              className="bg-white border-[#E8E4DC] hover:border-[#6B7280]/50"
              icon={Target}
            />

            {/* Bottom Right: Low Impact, High Likelihood */}
            <QuadrantCard
              title="Monitor Closely"
              description="Lower Impact, High Likelihood - Reactive protocols"
              scenarios={monitor}
              className="bg-white border-[#E8E4DC] hover:border-[#C9A84C]/50"
              icon={TrendingUp}
            />
          </div>

          {/* Action Items */}
          <Card className="rounded-none border-[#E8E4DC] bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-[#F8F7F4]">
              <CardTitle style={CG} className="text-3xl text-[#0A0F2E]">Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              {[
                { 
                  title: 'Schedule practice drills for your Critical playbooks', 
                  desc: 'Turn preparedness into proven performance', 
                  link: '/practice-drills', 
                  btn: 'Schedule Drills',
                  variant: 'default',
                  tid: 'card-action-drills'
                },
                { 
                  title: 'Review full playbook library', 
                  desc: 'Explore all 170 strategic playbooks', 
                  link: '/playbook-library', 
                  btn: 'View Library',
                  variant: 'outline',
                  tid: 'card-action-library'
                },
                { 
                  title: 'Check your preparedness score', 
                  desc: 'See your overall crisis readiness rating', 
                  link: '/preparedness-report', 
                  btn: 'View Score',
                  variant: 'outline',
                  tid: 'card-action-preparedness'
                }
              ].map((action, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-[#F8F7F4] border border-[#E8E4DC] rounded-none group hover:border-[#C9A84C] transition-colors" data-testid={action.tid}>
                  <div>
                    <p style={CG} className="text-xl font-bold text-[#0A0F2E]">{action.title}</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mt-1">{action.desc}</p>
                  </div>
                  <Link href={action.link}>
                    <Button 
                      variant={action.variant as any} 
                      className={`rounded-none font-bold text-[10px] tracking-widest uppercase px-8 h-12 ${action.variant === 'default' ? 'bg-[#0A0F2E] text-white hover:bg-[#141B45]' : 'border-[#E8E4DC] text-[#0A0F2E] hover:bg-white'}`}
                      data-testid={action.tid.replace('card-action', 'button')}
                    >
                      {action.btn}
                      <ArrowRight className="ml-3 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
