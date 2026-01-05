import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingDown, Activity } from 'lucide-react';
import { aiDataStreams } from '@shared/luxury-demo-data';

interface DataStream {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface AIRadarSimulationProps {
  title?: string;
  subtitle?: string;
  dataStreams?: DataStream[];
  playbookId?: string;
  playbookName?: string;
  onTriggerFired?: () => void;
  autoStart?: boolean;
}

export default function AIRadarSimulation({ 
  title = "AI Intelligence Monitoring",
  subtitle = "Real-time crisis detection across data streams",
  dataStreams: customDataStreams,
  playbookId = "#044",
  playbookName = "Revenue Shortfall - Asia Pacific",
  onTriggerFired, 
  autoStart = false 
}: AIRadarSimulationProps) {
  const [confidence, setConfidence] = useState(65);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [triggered, setTriggered] = useState(false);
  
  // Use custom data streams if provided, otherwise fall back to default luxury demo data
  const initialStreams = customDataStreams || aiDataStreams;
  const [streams, setStreams] = useState(initialStreams.map(s => ({ ...s, confidence: 65 })));

  useEffect(() => {
    if (autoStart) {
      setIsMonitoring(true);
    }
  }, [autoStart]);

  useEffect(() => {
    if (!isMonitoring || triggered) return;

    const interval = setInterval(() => {
      setConfidence(prev => {
        const next = Math.min(prev + Math.random() * 3, 95);
        
        // Fire trigger at 88%
        if (next >= 88 && !triggered) {
          setTriggered(true);
          setTimeout(() => {
            onTriggerFired?.();
          }, 500);
        }
        
        return next;
      });

      // Update stream statuses
      setStreams(prev => prev.map(stream => ({
        ...stream,
        confidence: Math.min(stream.confidence + Math.random() * 5, 95)
      })));
    }, 800);

    return () => clearInterval(interval);
  }, [isMonitoring, triggered, onTriggerFired]);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return 'text-red-600 dark:text-red-400';
    if (conf >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getStreamStatus = (conf: number) => {
    if (conf >= 85) return 'critical';
    if (conf >= 70) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-xl text-blue-200">{subtitle}</p>
      </div>

      {/* Main Confidence Meter */}
      <Card className={`p-6 bg-slate-900/50 border-blue-800/30 ${triggered ? 'border-red-500 border-2 animate-pulse' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className={`h-5 w-5 ${isMonitoring ? 'animate-pulse text-green-500' : 'text-blue-400'}`} />
            <h3 className="font-semibold text-white">AI Trigger Monitoring</h3>
          </div>
          <Badge variant={triggered ? 'destructive' : isMonitoring ? 'default' : 'outline'} data-testid="badge-monitoring">
            {triggered ? '🚨 TRIGGERED' : isMonitoring ? '● Live' : '○ Inactive'}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Trigger Confidence</span>
            <span className={`text-2xl font-bold ${getConfidenceColor(confidence)}`} data-testid="text-confidence">
              {confidence.toFixed(1)}%
            </span>
          </div>
          
          <Progress value={confidence} className="h-3" data-testid="progress-confidence" />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Threshold: 85%</span>
            {triggered && (
              <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                THRESHOLD EXCEEDED
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Trigger Alert */}
      {triggered && (
        <Card className="p-6 bg-red-950/50 border-red-500 border-2 animate-pulse" data-testid="card-trigger-alert">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-500 rounded-full">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1 text-white">Playbook {playbookId} Recommended</h4>
              <p className="text-sm text-red-200 mb-3">
                {playbookName}
              </p>
              <div className="bg-slate-900/50 p-3 rounded border border-red-800/30">
                <p className="text-xs font-mono text-red-200">
                  <TrendingDown className="inline h-3 w-3 mr-1" />
                  Confidence: {confidence.toFixed(1)}% | Playbook activation recommended
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Data Streams */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Intelligence Data Streams</h4>
        <div className="space-y-3">
          {streams.map(stream => (
            <div key={stream.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-2 h-2 rounded-full ${
                  getStreamStatus(stream.confidence) === 'critical' ? 'bg-red-500 animate-pulse' :
                  getStreamStatus(stream.confidence) === 'warning' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <span className="text-sm">{stream.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={stream.confidence} className="w-20 h-2" />
                <span className={`text-xs font-mono w-12 text-right ${getConfidenceColor(stream.confidence)}`}>
                  {stream.confidence.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {!isMonitoring && (
        <button
          onClick={() => setIsMonitoring(true)}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
          data-testid="button-start-monitoring"
        >
          Start AI Monitoring Simulation
        </button>
      )}
    </div>
  );
}
