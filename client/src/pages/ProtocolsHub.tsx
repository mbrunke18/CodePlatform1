import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { CheckCircle2, AlertTriangle, XCircle, Radio, Shield, Star, ChevronDown, ChevronUp, Plus, Clock, Play } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import type { CustomProtocol } from '@shared/schema';

// ── Brand constants ───────────────────────────────────────────────────────────
const NAVY   = '#0A0F2E';
const GOLD   = '#C9A84C';
const TEAL   = '#2B8A6E';
const MUTED  = '#6B7280';
const BORDER = '#E5E2D9';

// ── Category labels — mirrors shared/intelligence-signals.ts exactly ──────────
const CATEGORY_LABELS: Record<string, string> = {
  competitive:      'Competitive Movement',
  market:           'Market Dynamics',
  financial:        'Financial & Investment',
  partnership:      'Partnership & Ecosystem',
  innovation:       'Innovation Pipeline',
  technology:       'Technology Disruption',
  regulatory:       'Regulatory & Policy',
  supplychain:      'Supply Chain & Operational',
  cyber:            'Cybersecurity & Threats',
  media:            'Media & Reputation',
  geopolitical:     'Geopolitical & Macro',
  economic:         'Economic Indicators',
  brand_reputation: 'Brand & Reputation',
  ai_governance:    'AI Governance',
  customer:         'Customer Sentiment',
  talent:           'Talent & Workforce',
  esg:              'ESG & Sustainability',
  behavior:         'Customer Behavior',
  execution:        'Internal Execution',
  operational:      'Operational Excellence',
};

// ── Types ─────────────────────────────────────────────────────────────────────
type SignalStatus = 'active' | 'warning' | 'alert' | 'inactive';

interface CategoryStatus {
  categoryId:   string;
  categoryName: string;
  status:       SignalStatus;
  activeAlerts: number;
}

interface ReadinessResult {
  linked:             CategoryStatus[];
  mandatory:          CategoryStatus[];
  activeLinked:       CategoryStatus[];
  inactiveLinked:     CategoryStatus[];
  mandatoryAllFiring: boolean;
  pctActive:          number;
  pctThreshold:       number;
  pctMet:             boolean;
  readinessMet:       boolean;
  verdict:            'ready' | 'partial' | 'not_ready' | 'unconfigured';
}

// ── Readiness computation ─────────────────────────────────────────────────────
function computeReadiness(protocol: CustomProtocol, categories: CategoryStatus[]): ReadinessResult {
  const linkedIds  = protocol.linkedSignalIds   ?? [];
  const mandIds    = protocol.mandatorySignalIds ?? [];
  const mode       = (protocol.readinessMode    ?? 'both') as 'percentage' | 'mandatory' | 'both';
  const threshold  = protocol.readinessPct      ?? 80;

  if (linkedIds.length === 0) {
    return {
      linked: [], mandatory: [], activeLinked: [], inactiveLinked: [],
      mandatoryAllFiring: false, pctActive: 0, pctThreshold: threshold,
      pctMet: false, readinessMet: false, verdict: 'unconfigured',
    };
  }

  const isActive = (s: SignalStatus) => s !== 'inactive';

  const linked         = categories.filter(c => linkedIds.includes(c.categoryId));
  const mandatory      = linked.filter(c => mandIds.includes(c.categoryId));
  const activeLinked   = linked.filter(c => isActive(c.status));
  const inactiveLinked = linked.filter(c => !isActive(c.status));

  const mandatoryAllFiring = mandatory.length > 0 && mandatory.every(c => isActive(c.status));
  const pctActive = linked.length > 0 ? Math.round(activeLinked.length / linked.length * 100) : 0;
  const pctMet    = pctActive >= threshold;

  let readinessMet = false;
  if (mode === 'percentage')  readinessMet = pctMet;
  else if (mode === 'mandatory') readinessMet = mandatoryAllFiring;
  else                          readinessMet = pctMet || mandatoryAllFiring;

  const verdict: ReadinessResult['verdict'] =
    readinessMet       ? 'ready'   :
    activeLinked.length > 0 ? 'partial' :
    'not_ready';

  return { linked, mandatory, activeLinked, inactiveLinked, mandatoryAllFiring, pctActive, pctThreshold: threshold, pctMet, readinessMet, verdict };
}

// ── Verdict badge ─────────────────────────────────────────────────────────────
function VerdictBadge({ verdict }: { verdict: ReadinessResult['verdict'] }) {
  const cfg = {
    ready:        { icon: CheckCircle2,  label: 'READY',           bg: 'rgba(43,138,110,0.1)',   color: TEAL,      border: TEAL },
    partial:      { icon: AlertTriangle, label: 'PARTIAL SIGNAL',  bg: 'rgba(217,119,6,0.08)',  color: '#D97706', border: '#D97706' },
    not_ready:    { icon: XCircle,       label: 'NOT READY',       bg: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '#DC2626' },
    unconfigured: { icon: Radio,         label: 'NOT CONFIGURED',  bg: '#F8F7F4',               color: MUTED,     border: BORDER },
  }[verdict];
  const Icon = cfg.icon;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: '0.15rem', background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <Icon size={11} color={cfg.color} />
      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

// ── Signal pill ───────────────────────────────────────────────────────────────
function SignalPill({ cat, isMandatory }: { cat: CategoryStatus; isMandatory: boolean }) {
  const active = cat.status !== 'inactive';
  const color  = cat.status === 'alert' ? '#DC2626' : cat.status === 'warning' ? '#D97706' : active ? TEAL : MUTED;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: '0.15rem',
      background: active ? `${color}12` : '#F8F7F4',
      border: `1px solid ${active ? color : BORDER}`,
      fontSize: 11, fontWeight: 600, color: active ? color : MUTED,
    }}>
      {isMandatory && <Star size={9} fill={active ? color : MUTED} color={active ? color : MUTED} />}
      <span>{CATEGORY_LABELS[cat.categoryId] ?? cat.categoryName}</span>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
    </div>
  );
}

// ── Protocol card ─────────────────────────────────────────────────────────────
function ProtocolCard({ protocol, categories }: { protocol: CustomProtocol; categories: CategoryStatus[] }) {
  const [expanded, setExpanded] = useState(false);
  const [, navigate] = useLocation();
  const r            = computeReadiness(protocol, categories);
  const mandatoryIds = protocol.mandatorySignalIds ?? [];
  const mode         = (protocol.readinessMode ?? 'both') as 'percentage' | 'mandatory' | 'both';
  const modeLabel    =
    mode === 'percentage' ? `≥${r.pctThreshold}% active` :
    mode === 'mandatory'  ? 'All must-haves fire' :
    `≥${r.pctThreshold}% OR all must-haves`;

  const borderColor  = r.verdict === 'ready' ? TEAL : r.verdict === 'partial' ? '#D97706' : BORDER;
  const barColor     = r.readinessMet ? TEAL : r.pctActive > 0 ? '#D97706' : '#E5E2D9';
  const pctColor     = r.readinessMet ? TEAL : r.pctActive > 0 ? '#D97706' : MUTED;

  return (
    <div style={{ border: `1.5px solid ${borderColor}`, borderRadius: '0.15rem', background: '#fff', overflow: 'hidden', transition: 'border-color 0.2s' }}>

      {/* ── Card header ── */}
      <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{protocol.name}</span>
            <VerdictBadge verdict={r.verdict} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {protocol.riskThreshold && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#DC2626', background: 'rgba(220,38,38,0.08)', padding: '2px 8px', borderRadius: '0.15rem' }}>
                {protocol.riskThreshold}
              </span>
            )}
            {protocol.industry && <span style={{ fontSize: 11, color: MUTED }}>{protocol.industry}</span>}
            {r.verdict !== 'unconfigured' && (
              <span style={{ fontSize: 11, color: MUTED }}>Readiness: {modeLabel}</span>
            )}
          </div>
        </div>

        {r.verdict !== 'unconfigured' && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1, color: pctColor }}>{r.pctActive}%</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{r.activeLinked.length}/{r.linked.length} active</div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {r.verdict === 'ready' && (
            <button
              onClick={() => navigate('/live-activation-center')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: TEAL, color: '#fff', border: 'none', borderRadius: '0.15rem', fontWeight: 700, fontSize: 11, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
            >
              <Play size={10} fill="#fff" />
              Activate Now
            </button>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4, marginTop: 2 }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      {r.verdict !== 'unconfigured' && (
        <div style={{ height: 3, background: '#F0EDE4' }}>
          <div style={{ height: '100%', width: `${r.pctActive}%`, background: barColor, transition: 'width 0.6s ease' }} />
        </div>
      )}

      {/* ── Expanded panel ── */}
      {expanded && (
        <div style={{ padding: '16px 22px 20px', borderTop: `1px solid ${BORDER}`, background: '#FAFAF8' }}>
          {r.verdict === 'unconfigured' ? (
            <div style={{ fontSize: 13, color: MUTED, textAlign: 'center', padding: '12px 0' }}>
              No signal categories linked.{' '}
              <Link href="/protocol-builder" style={{ color: TEAL, fontWeight: 700, textDecoration: 'none' }}>
                Edit in Protocol Builder →
              </Link>
            </div>
          ) : (
            <>
              {/* Signal category grid */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>
                  Linked Signal Categories
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {r.linked.map(cat => (
                    <SignalPill key={cat.categoryId} cat={cat} isMandatory={mandatoryIds.includes(cat.categoryId)} />
                  ))}
                </div>
              </div>

              {/* Must-haves breakdown */}
              {r.mandatory.length > 0 && (
                <div style={{ marginBottom: 14, padding: '10px 14px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>
                    Must-Have Signals —{' '}
                    <span style={{ color: r.mandatoryAllFiring ? TEAL : '#DC2626' }}>
                      {r.mandatoryAllFiring
                        ? 'ALL FIRING'
                        : `${r.mandatory.filter(c => c.status !== 'inactive').length}/${r.mandatory.length} firing`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {r.mandatory.map(cat => (
                      <SignalPill key={cat.categoryId} cat={cat} isMandatory={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Verdict detail */}
              <div style={{ padding: '10px 14px', borderLeft: `4px solid ${r.readinessMet ? TEAL : BORDER}`, background: r.readinessMet ? 'rgba(43,138,110,0.04)' : '#fff' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: r.readinessMet ? TEAL : NAVY }}>
                  {r.readinessMet
                    ? 'This protocol is staged and ready to execute.'
                    : `${r.pctActive}% of linked signals active — ${r.pctThreshold}% threshold ${r.pctMet ? 'met' : 'not met'}.${r.mandatory.length > 0 && !r.mandatoryAllFiring ? ' Must-haves not all firing.' : ''}`}
                </div>
                {!r.readinessMet && r.inactiveLinked.length > 0 && (
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
                    Waiting on: {r.inactiveLinked.map(c => CATEGORY_LABELS[c.categoryId] ?? c.categoryName).join(', ')}.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProtocolsHub() {
  const { data: protocolsRaw, isLoading: loadingProtocols } = useQuery<CustomProtocol[]>({
    queryKey: ['/api/custom-protocols'],
  });

  const { data: dashboardRaw, isLoading: loadingSignals } = useQuery<{ success: boolean; data: { categories: CategoryStatus[] } }>({
    queryKey: ['/api/intelligence/dashboard'],
    refetchInterval: 60_000,
  });

  const protocols:  CustomProtocol[]  = Array.isArray(protocolsRaw) ? protocolsRaw : [];
  const categories: CategoryStatus[]  = dashboardRaw?.data?.categories ?? [];
  const isLoading = loadingProtocols || loadingSignals;

  const readyCount   = protocols.filter(p => computeReadiness(p, categories).verdict === 'ready').length;
  const partialCount = protocols.filter(p => computeReadiness(p, categories).verdict === 'partial').length;
  const notReadyCount = protocols.length - readyCount - partialCount;

  return (
    <PageLayout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>
            PROTOCOL READINESS
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: NAVY, margin: 0, lineHeight: 1.15 }}>My Protocols</h1>
              <p style={{ fontSize: 14, color: MUTED, marginTop: 8, maxWidth: 540, lineHeight: 1.6 }}>
                Live signal coverage for each Readiness Protocol you've built. The verdict updates as signals fire — the response is ready before the trigger fires.
              </p>
            </div>
            <Link href="/protocol-builder">
              <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: NAVY, color: GOLD, border: 'none', borderRadius: '0.15rem', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Plus size={14} /> New Protocol
              </button>
            </Link>
          </div>
        </div>

        {/* ── Summary stats ── */}
        {protocols.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'Protocols Built', value: protocols.length, color: NAVY },
              { label: 'Ready Now',       value: readyCount,       color: TEAL },
              { label: 'Partial Signal',  value: partialCount,     color: '#D97706' },
              { label: 'Not Ready',       value: notReadyCount,    color: MUTED },
            ].map(s => (
              <div key={s.label} style={{ padding: '14px 18px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Freshness notice ── */}
        {!loadingSignals && categories.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, fontSize: 11, color: MUTED }}>
            <Clock size={11} />
            <span>Signal data refreshes every 15 minutes. Readiness updates automatically.</span>
          </div>
        )}

        {/* ── Content ── */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 82, background: '#F8F7F4', borderRadius: '0.15rem' }} />
            ))}
          </div>
        ) : protocols.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', border: `1px dashed ${BORDER}`, borderRadius: '0.15rem' }}>
            <Shield size={32} color={GOLD} style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 8 }}>No protocols yet</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 24, maxWidth: 380, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Build your first Readiness Protocol and define which live signals determine when it's ready to execute.
            </div>
            <Link href="/protocol-builder">
              <button style={{ padding: '12px 24px', background: NAVY, color: GOLD, border: 'none', borderRadius: '0.15rem', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Build Your First Protocol
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {protocols.map(p => (
              <ProtocolCard key={p.id} protocol={p} categories={categories} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
