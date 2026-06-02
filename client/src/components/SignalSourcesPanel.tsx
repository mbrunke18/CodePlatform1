import { useQuery } from '@tanstack/react-query';
import { CheckCircle, AlertTriangle, Clock, ExternalLink, Shield, TrendingUp, Scale, Activity, BarChart3, DollarSign, Truck, Globe, Database, Zap, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

const CATEGORY_ICONS: Record<string, any> = {
  cybersecurity: Shield,
  economic: TrendingUp,
  regulatory: Scale,
  internal: Activity,
  market: BarChart3,
  financial: DollarSign,
  supply_chain: Truck,
  brand: Globe,
  free: Database,
};

const TIER_LABELS: Record<string, string> = {
  premium: 'Premium',
  enterprise: 'Enterprise',
  enterprise_plus: 'Enterprise+',
};

const TIER_COLORS: Record<string, string> = {
  premium: GOLD,
  enterprise: '#8B5CF6',
  enterprise_plus: NAVY,
};

function StatusPip({ status }: { status: string }) {
  if (status === 'active') {
    return (
      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: TEAL, boxShadow: `0 0 6px ${TEAL}` }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>Live</span>
      </div>
    );
  }
  if (status === 'not_configured') {
    return (
      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>Key Required</span>
      </div>
    );
  }
  if (status === 'degraded') {
    return (
      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
        <AlertTriangle className="h-4 w-4" style={{ color: '#F59E0B' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B' }}>Degraded</span>
      </div>
    );
  }
  if (status === 'down') {
    return (
      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>Down</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
      <Clock className="h-4 w-4" style={{ color: '#9CA3AF' }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>Available</span>
    </div>
  );
}

function QuantitativeSourceRow({ source }: { source: any }) {
  const Icon = CATEGORY_ICONS[source.category] || Database;
  const isConfigured = source.status === 'active';
  const needsKey = source.status === 'not_configured';

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 24px',
      background: '#fff', border: '1px solid #E8E4DC', borderRadius: '0.15rem',
      borderLeft: `3px solid ${isConfigured ? TEAL : needsKey ? GOLD : '#E8E4DC'}`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '0.15rem', flexShrink: 0,
        background: isConfigured ? 'rgba(43,138,110,0.08)' : 'rgba(201,168,76,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon className="h-5 w-5" style={{ color: isConfigured ? TEAL : GOLD }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{source.sourceName}</span>
              <Badge style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                background: isConfigured ? 'rgba(43,138,110,0.1)' : 'rgba(201,168,76,0.1)',
                color: isConfigured ? TEAL : GOLD, border: 'none', padding: '2px 8px',
              }}>
                Tier {source.tier} — {source.sourceType === 'free' ? 'Free' : source.sourceType === 'internal' ? 'Internal' : 'Free + API Key'}
              </Badge>
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginTop: 4, maxWidth: 600 }}>
              {source.description}
            </p>
            {source.triggersEnabled?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Triggers:
                </span>
                {source.triggersEnabled.slice(0, 4).map((t: string) => (
                  <span key={t} style={{
                    fontSize: 10, fontWeight: 600, color: NAVY,
                    background: 'rgba(10,15,46,0.06)', padding: '2px 8px', borderRadius: '0.15rem',
                  }}>
                    {t}
                  </span>
                ))}
                {source.triggersEnabled.length > 4 && (
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>+{source.triggersEnabled.length - 4} more</span>
                )}
              </div>
            )}
            {needsKey && source.upgradeNote && (
              <div style={{
                marginTop: 10, padding: '8px 12px', background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.25)', borderRadius: '0.15rem',
              }}>
                <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.5 }}>
                  <strong>Activate:</strong> {source.upgradeNote}
                </p>
              </div>
            )}
            {source.lastSuccessAt && (
              <div style={{ marginTop: 6, fontSize: 10, color: '#9CA3AF' }}>
                Last fetch: {new Date(source.lastSuccessAt).toLocaleTimeString()} · {source.recordsLastFetch} record(s)
              </div>
            )}
          </div>
          <StatusPip status={source.status} />
        </div>
      </div>
    </div>
  );
}

function PremiumSourceRow({ source }: { source: any }) {
  const tierColor = TIER_COLORS[source.tier] || NAVY;
  const tierLabel = TIER_LABELS[source.tier] || 'Enterprise';

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 24px',
      background: '#fff', border: '1px solid #E8E4DC', borderRadius: '0.15rem',
      borderLeft: `3px solid rgba(10,15,46,0.12)`,
      opacity: 0.85,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '0.15rem', flexShrink: 0,
        background: 'rgba(10,15,46,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Lock className="h-5 w-5" style={{ color: '#6B7280' }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{source.name}</span>
              <Badge style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                background: `${tierColor}18`, color: tierColor, border: 'none', padding: '2px 8px',
              }}>
                {tierLabel}
              </Badge>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{source.estimatedMonthlyCost}</span>
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginTop: 4, maxWidth: 600 }}>
              {source.description}
            </p>
            {source.whatYouGet?.length > 0 && (
              <ul style={{ marginTop: 8, paddingLeft: 16, listStyle: 'disc' }}>
                {source.whatYouGet.slice(0, 3).map((item: string) => (
                  <li key={item} style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            )}
            {source.triggersEnabled?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Enables:
                </span>
                {source.triggersEnabled.map((t: string) => (
                  <span key={t} style={{
                    fontSize: 10, fontWeight: 600, color: '#6B7280',
                    background: 'rgba(107,114,128,0.08)', padding: '2px 8px', borderRadius: '0.15rem',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2" style={{ flexShrink: 0 }}>
            <a
              href={source.vendorUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: NAVY, textDecoration: 'none' }}
            >
              {source.vendor} <ExternalLink className="h-3 w-3" />
            </a>
            <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>{source.apiKeyEnvVar}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignalSourcesPanel() {
  const { data: raw, isLoading } = useQuery({ queryKey: ['/api/signal-sources'] });
  const data = raw as any;

  if (isLoading) {
    return (
      <div style={{ padding: '32px 0' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: TEAL, animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Loading signal intelligence layer...</span>
        </div>
      </div>
    );
  }

  const sources = data?.sources || [];
  const freeActive = sources.filter((s: any) => ['free', 'free_key_required', 'internal'].includes(s.sourceType));
  const paidAvailable = data?.paidAvailable || [];
  const paidActive = data?.paidActive || [];
  const summary = data?.summary || {};

  return (
    <div className="space-y-10">

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1,
        background: '#E8E4DC', borderRadius: '0.15rem', overflow: 'hidden',
      }}>
        {[
          { label: 'Total Sources', value: summary.totalSources || freeActive.length + paidAvailable.length + paidActive.length },
          { label: 'Live Now', value: summary.activeSources || freeActive.filter((s: any) => s.status === 'active').length, color: TEAL },
          { label: 'Key Required', value: summary.notConfiguredSources || freeActive.filter((s: any) => s.status === 'not_configured').length, color: GOLD },
          { label: 'Premium Available', value: paidAvailable.length, color: '#8B5CF6' },
          { label: 'Tier 1 Authoritative', value: summary.tier1Sources || freeActive.filter((s: any) => s.tier === 1).length, color: NAVY },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#fff', padding: '20px 24px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: color || NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Active Quantitative Sources ────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 20, height: 2, background: TEAL }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: TEAL }}>
            Quantitative Intelligence Sources
          </span>
          <span style={{ fontSize: 10, color: '#9CA3AF' }}>— Structured data · threshold-based detection</span>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, marginBottom: 20, maxWidth: 700 }}>
          These sources provide the actual data points your triggers are measured against.
          Each source feeds structured, numeric signals into the evaluation engine — no keyword guessing.
          A CISA vulnerability has a CVSS score. An FDA recall has a class rating. A Fed rate change
          has basis points. These are the measurements that determine whether a situation is approaching.
        </p>
        <div className="space-y-3">
          {freeActive.map((source: any) => (
            <QuantitativeSourceRow key={source.sourceKey} source={source} />
          ))}
        </div>
      </div>

      {/* ── Active Premium Sources (if any) ────────────────────────────────────── */}
      {paidActive.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 20, height: 2, background: NAVY }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: NAVY }}>
              Premium Sources — Active
            </span>
          </div>
          <div className="space-y-3">
            {paidActive.map((source: any) => (
              <QuantitativeSourceRow key={source.key} source={{ ...source, sourceName: source.name, sourceKey: source.key, status: 'active', sourceType: 'paid_active', tier: 2, triggersEnabled: source.triggersEnabled }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Available Premium Sources ──────────────────────────────────────────── */}
      {paidAvailable.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 20, height: 2, background: '#9CA3AF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6B7280' }}>
              Premium Intelligence Sources — Available to Activate
            </span>
          </div>
          <div style={{
            background: 'rgba(10,15,46,0.03)', border: '1px solid rgba(10,15,46,0.08)',
            padding: '14px 20px', borderRadius: '0.15rem', marginBottom: 20,
          }}>
            <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
              These premium data sources dramatically expand trigger detection coverage.
              Each source is activated by setting the corresponding API key in your environment secrets.
              Contact your Founding Partner coordinator to discuss which sources match your
              risk profile and industry.
            </p>
          </div>
          <div className="space-y-3">
            {paidAvailable.map((source: any) => (
              <PremiumSourceRow key={source.key} source={source} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
