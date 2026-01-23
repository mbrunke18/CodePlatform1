import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, TrendingUp, Clock } from 'lucide-react';

const mockThreats = [
  { id: 1, title: 'Competitor Price Undercut', severity: 'high', domain: 'Market Entry', time: '2 hours ago' },
  { id: 2, title: 'Supply Chain Disruption Signal', severity: 'medium', domain: 'Operations', time: '4 hours ago' },
  { id: 3, title: 'Regulatory Announcement', severity: 'low', domain: 'Regulatory', time: '6 hours ago' },
];

export default function ThreatsPage() {
  return (
    <IDEALayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Threat Detection</h1>
          <p className="text-muted-foreground">
            Real-time threat identification and early warning system powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground">Critical Threats</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-xs text-muted-foreground">High Priority</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">847</div>
                  <div className="text-xs text-muted-foreground">Signals Monitored</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-poise-teal" />
                <div>
                  <div className="text-2xl font-bold">99.2%</div>
                  <div className="text-xs text-muted-foreground">Detection Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockThreats.map((threat) => (
                <div key={threat.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className={`w-5 h-5 ${
                      threat.severity === 'high' ? 'text-red-500' :
                      threat.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                    }`} />
                    <div>
                      <div className="font-medium">{threat.title}</div>
                      <div className="text-sm text-muted-foreground">{threat.domain}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={threat.severity === 'high' ? 'destructive' : 'secondary'}>
                      {threat.severity}
                    </Badge>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {threat.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </IDEALayout>
  );
}
