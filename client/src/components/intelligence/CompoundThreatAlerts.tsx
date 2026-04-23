import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertTriangle, ChevronRight, RefreshCw, X, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function confidenceColor(c: number) {
  if (c >= 75) return '#EF4444';
  if (c >= 55) return '#F97316';
  if (c >= 35) return GOLD;
  return '#6B7280';
}

export default function CompoundThreatAlerts({ compact = false }: { compact?: boolean }) {
  const { toast } = useToast();

  const { data: threatsRaw, isLoading } = useQuery<any[]>({
    queryKey: ['/api/compound-threats'],
  });
  const threats = Array.isArray(threatsRaw) ? threatsRaw : [];

  const analyzeMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/compound-threats/analyze', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compound-threats'] });
      toast({ title: 'Analysis complete', description: 'Cross-domain synthesis finished.' });
    },
    onError: (error: any) => {
      if (error?.message?.startsWith('401')) {
        toast({ title: 'Sign in required', description: 'Please sign in to run threat analysis.', variant: 'destructive' });
        setTimeout(() => { window.location.href = '/request-access'; }, 1500);
      } else {
        toast({ title: 'Analysis failed', description: 'An error occurred. Please try again.', variant: 'destructive' });
      }
    },
  });

  const dismissMutation = useMutation({
    mutationFn: (id: string) => apiRequest('PATCH', `/api/compound-threats/${id}/dismiss`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/compound-threats'] }),
  });

  const active = threats.filter((t: any) => t.status === 'active');

  if (compact && active.length === 0) return null;

  return (
    <div className={compact ? '' : 'p-6'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {!compact && (
            <div style={{ width: 40, height: 40, background: '#EF444412', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#EF4444' }} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p style={{ ...CG, fontWeight: 700, fontSize: compact ? '1rem' : '1.2rem', color: NAVY }}>
                Compound Threat Intelligence
              </p>
              {active.length > 0 && (
                <span className="text-[9px] font-black px-2 py-0.5" style={{ background: '#EF444415', color: '#EF4444' }}>
                  {active.length} ACTIVE
                </span>
              )}
            </div>
            {!compact && <p className="text-[10px] text-gray-400">System-detected cross-domain threat patterns</p>}
          </div>
        </div>
        <Button
          size="sm"
          disabled={analyzeMutation.isPending}
          onClick={() => analyzeMutation.mutate()}
          style={{ background: NAVY, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          {analyzeMutation.isPending
            ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analyzing...</>
            : <><RefreshCw className="w-3 h-3 mr-1" /> Analyze Now</>}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: GOLD }} />
        </div>
      ) : active.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[#E8E4DC]">
          <Zap className="w-6 h-6 mx-auto mb-2 text-gray-300" />
          <p className="text-[11px] text-gray-400 font-semibold">No compound threats detected</p>
          <p className="text-[9px] text-gray-300 mt-1">Click "Analyze Now" to run cross-domain synthesis</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.slice(0, compact ? 2 : 10).map((threat: any) => {
            const cc = confidenceColor(threat.confidence);
            return (
              <div key={threat.id} className="p-4 border "
                style={{ borderColor: `${cc}30`, background: `${cc}04`, borderLeft: `3px solid ${cc}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Domains + confidence */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {(threat.domains || []).map((d: string) => (
                        <span key={d} className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                          style={{ background: `${NAVY}10`, color: NAVY }}>
                          {d}
                        </span>
                      ))}
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 animate-pulse" style={{ background: cc }} />
                        <span className="text-[9px] font-black" style={{ color: cc }}>{threat.confidence}% confidence</span>
                      </div>
                    </div>

                    {/* Threat type */}
                    <p className="text-[12px] font-bold mb-1.5" style={{ color: NAVY }}>{threat.threatType}</p>

                    {/* AI Hypothesis — styled like an AI alert */}
                    <div className="px-3 py-2 mb-2" style={{ background: `${cc}08`, border: `1px solid ${cc}20` }}>
                      <div className="flex items-start gap-2">
                        <Zap className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: cc }} />
                        <p className="text-[10px] text-gray-600 leading-relaxed">{threat.aiHypothesis}</p>
                      </div>
                    </div>

                    {/* Historical match */}
                    {threat.historicalMatch && (
                      <p className="text-[9px] text-gray-400 mb-1">
                        <span className="font-bold">Resembles:</span> {threat.historicalMatch}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-2">
                      <button className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>
                        <BookOpen className="w-3 h-3" /> Stage Defense Readiness Protocol
                      </button>
                      <span className="text-[8px] text-gray-300">·</span>
                      <span className="text-[9px] text-gray-400">
                        {threat.detectedAt ? format(new Date(threat.detectedAt), 'MMM d, h:mm a') : ''}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => dismissMutation.mutate(threat.id)}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity text-gray-300 hover:text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {compact && active.length > 2 && (
            <button className="w-full text-center text-[10px] font-bold uppercase tracking-wider py-2 hover:opacity-70 transition-opacity flex items-center justify-center gap-1"
              style={{ color: TEAL }}>
              View {active.length - 2} more threats <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
