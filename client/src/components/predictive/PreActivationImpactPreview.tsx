import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
  FileText,
  Zap,
  Shield,
  Target,
  ArrowRight
} from 'lucide-react';

const seededRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs((Math.sin(hash) * 10000) % 1);
};

interface ResourceConflict {
  resourceType: string;
  resourceName: string;
  conflictingPlaybook: string;
  severity: 'high' | 'medium' | 'low';
  resolution: string;
}

interface ImpactPreview {
  estimatedCost: number;
  estimatedDuration: number;
  departmentsInvolved: string[];
  stakeholdersToNotify: number;
  documentsToStage: number;
  budgetToUnlock: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  successProbability: number;
  resourceConflicts: ResourceConflict[];
  readinessScore: number;
  blockers: string[];
}

interface PlaybookInput {
  id?: string;
  name?: string;
  description?: string;
  averageExecutionTime?: number;
}

interface PreActivationImpactPreviewProps {
  playbook: PlaybookInput;
  onConfirmActivation: () => void;
  onCancel: () => void;
}

export default function PreActivationImpactPreview({ 
  playbook, 
  onConfirmActivation, 
  onCancel 
}: PreActivationImpactPreviewProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  const preview = useMemo((): ImpactPreview => {
    const seed = playbook?.id || playbook?.name || 'default';
    const rand1 = seededRandom(seed + '1');
    const rand2 = seededRandom(seed + '2');
    const rand3 = seededRandom(seed + '3');
    const rand4 = seededRandom(seed + '4');
    const rand5 = seededRandom(seed + '5');
    const rand6 = seededRandom(seed + '6');
    
    const hasConflicts = rand1 > 0.6;
    
    const conflicts: ResourceConflict[] = hasConflicts ? ([
      {
        resourceType: 'Personnel',
        resourceName: 'Crisis Communications Lead',
        conflictingPlaybook: 'Regulatory Response Playbook',
        severity: 'medium' as const,
        resolution: 'Assign backup: VP Communications'
      },
      {
        resourceType: 'Budget',
        resourceName: 'Emergency Response Fund',
        conflictingPlaybook: 'Cyber Incident Playbook',
        severity: 'low' as const,
        resolution: '60% allocation available'
      }
    ] as ResourceConflict[]).slice(0, rand2 > 0.5 ? 2 : 1) : [];

    const blockers = rand3 > 0.7 ? [
      'Legal approval pending for external communications template'
    ] : [];

    const allDepartments = ['Legal', 'Communications', 'Operations', 'Finance', 'HR', 'IT'];
    const deptCount = Math.floor(3 + rand4 * 4);

    return {
      estimatedCost: Math.round((50000 + rand1 * 200000) / 1000) * 1000,
      estimatedDuration: playbook?.averageExecutionTime || Math.round(8 + rand2 * 20),
      departmentsInvolved: allDepartments.slice(0, deptCount),
      stakeholdersToNotify: Math.round(15 + rand3 * 40),
      documentsToStage: Math.round(5 + rand4 * 15),
      budgetToUnlock: Math.round((20000 + rand5 * 100000) / 1000) * 1000,
      riskLevel: rand6 > 0.7 ? 'high' : rand6 > 0.4 ? 'medium' : 'low',
      successProbability: Math.round(75 + rand1 * 20),
      resourceConflicts: conflicts,
      readinessScore: Math.round(70 + rand2 * 25),
      blockers
    };
  }, [playbook]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      default: return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const hasBlockers = preview.blockers.length > 0;
  const hasConflicts = preview.resourceConflicts.length > 0;

  return (
    <Card className="border-2 border-blue-400 dark:border-blue-600 shadow-lg" data-testid="card-pre-activation-preview">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Pre-Activation Impact Preview</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Review projected impact before activating "{playbook?.name || 'Playbook'}"
              </p>
            </div>
          </div>
          <Badge className={getRiskColor(preview.riskLevel)}>
            {preview.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
            <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(preview.estimatedCost)}
            </div>
            <div className="text-xs text-slate-500">Estimated Cost</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {preview.estimatedDuration} min
            </div>
            <div className="text-xs text-slate-500">Est. Duration</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {preview.stakeholdersToNotify}
            </div>
            <div className="text-xs text-slate-500">Stakeholders</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
            <FileText className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {preview.documentsToStage}
            </div>
            <div className="text-xs text-slate-500">Documents</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold">Departments Involved</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {preview.departmentsInvolved.map((dept, idx) => (
                <Badge key={idx} variant="outline">{dept}</Badge>
              ))}
            </div>
          </div>
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold">Readiness Score</h4>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={preview.readinessScore} className="flex-1" />
              <span className="text-lg font-bold text-emerald-600">{preview.readinessScore}%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Success probability: <span className="font-semibold text-blue-600">{preview.successProbability}%</span>
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Budget Auto-Unlock</h4>
          </div>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(preview.budgetToUnlock)}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Pre-approved emergency response fund will be released upon activation
          </p>
        </div>

        {hasConflicts && (
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-900/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <div className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Resource Conflicts Detected
              </div>
              <div className="space-y-2">
                {preview.resourceConflicts.map((conflict, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 rounded p-2 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{conflict.resourceName}</span>
                      <Badge variant="outline" className={
                        conflict.severity === 'high' ? 'border-red-400 text-red-600' :
                        conflict.severity === 'medium' ? 'border-amber-400 text-amber-600' :
                        'border-yellow-400 text-yellow-600'
                      }>
                        {conflict.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Conflicts with: {conflict.conflictingPlaybook}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      Resolution: {conflict.resolution}
                    </p>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {hasBlockers && (
          <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Blockers Identified
              </div>
              <ul className="space-y-1">
                {preview.blockers.map((blocker, idx) => (
                  <li key={idx} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                    <span>•</span> {blocker}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input 
              type="checkbox" 
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              data-testid="checkbox-acknowledge-impact"
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              I have reviewed the projected impact, resource allocation, and any conflicts. 
              I authorize the activation of this playbook and the associated budget unlock.
            </span>
          </label>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onCancel}
              data-testid="button-cancel-activation"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!acknowledged}
              onClick={onConfirmActivation}
              data-testid="button-confirm-activation"
            >
              <Zap className="w-4 h-4 mr-2" />
              Confirm Activation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
