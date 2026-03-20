import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp } from 'lucide-react';

const phaseSLAs = [
  {
    phase: 'IDENTIFY',
    icon: '🎯',
    color: 'from-[#0A0F2E] to-[#3BAF8A]',
    target: '5 minutes',
    description: 'Time to confirm trigger and assess situation',
    benchmark: 'Industry: 2-4 hours'
  },
  {
    phase: 'DETECT',
    icon: '👁️',
    color: 'from-[#0A0F2E] to-pink-600',
    target: '2 minutes',
    description: 'Time to notify all Tier 1 stakeholders',
    benchmark: 'Industry: 30-60 minutes'
  },
  {
    phase: 'EXECUTE',
    icon: '⚡',
    color: 'from-orange-600 to-red-600',
    target: '12 minutes',
    description: 'Roles assigned. Tasks staged. Comms sent. Execution live.',
    benchmark: 'Industry: 30 days (still planning)'
  },
  {
    phase: 'ADVANCE',
    icon: '📈',
    color: 'from-green-600 to-[#2B8A6E]',
    target: '24 hours',
    description: 'Time to complete lessons learned review',
    benchmark: 'Industry: 2-4 weeks'
  }
];

export default function SLAPage() {
  return (
    <IDEALayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SLA & Timeframes</h1>
          <p className="text-muted-foreground">
            Define execution velocity targets for each phase of the IDEA Framework
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {phaseSLAs.map((sla) => (
            <Card key={sla.phase} className="overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${sla.color}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sla.icon}</span>
                    <CardTitle>{sla.phase}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-lg font-bold">
                    {sla.target}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{sla.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-poise-gold" />
                  <span className="text-muted-foreground">{sla.benchmark}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-poise-gold" />
              Total Execution Time: 12 Minutes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The traditional enterprise spends weeks just getting the right people in the room.
              Execution OS delivers a fully deployed organization — roles assigned, tasks staged,
              communications sent — in 12 minutes. Execution is already underway while competitors
              are still scheduling their kickoff call.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-poise-gold">10x</div>
                <div className="text-sm text-muted-foreground">Faster than industry</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-poise-teal">98</div>
                <div className="text-sm text-muted-foreground">Days saved annually</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-[#2B8A6E]">$2.2M</div>
                <div className="text-sm text-muted-foreground">Average cost savings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </IDEALayout>
  );
}
