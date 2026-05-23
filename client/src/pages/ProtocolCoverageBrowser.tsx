import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from '@/components/layout/PageLayout';
import {
  Search, Globe2, Settings2, DollarSign, Shield, Brain, Users, Star,
  TrendingUp, Cpu, Clock, AlertTriangle, ChevronRight, X, Layers,
  ArrowRight, BookOpen, Zap
} from 'lucide-react';

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const DM: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const ED: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

interface Protocol {
  number: number;
  protocol_code: string;
  name: string;
  trigger: string;
  response: string;
  response_window: string;
  financial_exposure: string;
  domain: number;
  domain_name: string;
  domain_code: string;
  compound: boolean;
  stakeholder_count: number;
}

const DOMAIN_CONFIG: Record<number, { icon: React.ElementType; color: string; bg: string }> = {
  1: { icon: Globe2,      color: "#1E4FC2", bg: "rgba(30,79,194,0.08)"  },
  2: { icon: Settings2,   color: TEAL,      bg: "rgba(43,138,110,0.08)" },
  3: { icon: DollarSign,  color: "#1a7b3a", bg: "rgba(26,123,58,0.08)"  },
  4: { icon: Shield,      color: "#9b1c1c", bg: "rgba(155,28,28,0.08)"  },
  5: { icon: Brain,       color: "#1a4a8b", bg: "rgba(26,74,139,0.08)"  },
  6: { icon: Users,       color: "#6b21a8", bg: "rgba(107,33,168,0.08)" },
  7: { icon: Star,        color: "#92400e", bg: "rgba(146,64,14,0.08)"  },
  8: { icon: TrendingUp,  color: "#065f46", bg: "rgba(6,95,70,0.08)"    },
  9: { icon: Cpu,         color: "#1e3a8a", bg: "rgba(30,58,138,0.08)"  },
};

const QUICK_SEARCHES = [
  "Ransomware attack",
  "Activist investor",
  "Supply chain collapse",
  "CEO departure",
  "EU AI Act",
  "IPO adverse media",
  "Data breach",
  "Labor strike",
];

function scoreProtocol(p: Protocol, terms: string[]): number {
  if (!terms.length) return 0;
  let score = 0;
  const nameLower    = p.name.toLowerCase();
  const triggerLower = p.trigger.toLowerCase();
  const respLower    = p.response.toLowerCase();
  for (const t of terms) {
    if (nameLower === t)          score += 20;
    if (nameLower.includes(t))    score += 8;
    if (triggerLower.includes(t)) score += 4;
    if (respLower.includes(t))    score += 1;
  }
  return score;
}

function highlight(text: string, terms: string[]): string {
  if (!terms.length) return text;
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

function WindowPill({ window: w }: { window: string }) {
  const urgent = w.includes('hour') && !w.includes('24') && !w.includes('48');
  return (
    <span style={{
      ...DM, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', padding: '3px 8px', borderRadius: '0.15rem',
      background: urgent ? 'rgba(155,28,28,0.09)' : 'rgba(43,138,110,0.09)',
      color: urgent ? '#9b1c1c' : TEAL, border: `1px solid ${urgent ? 'rgba(155,28,28,0.2)' : 'rgba(43,138,110,0.2)'}`,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <Clock size={10} /> {w}
    </span>
  );
}

function ProtocolCard({ p, terms }: { p: Protocol; terms: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = DOMAIN_CONFIG[p.domain] ?? DOMAIN_CONFIG[1];
  const IconComp = cfg.icon;
  const triggerSnippet = truncate(p.trigger, 180);
  const exposureSnippet = truncate(p.financial_exposure ?? '', 110);

  return (
    <div style={{
      background: '#fff', border: `1px solid ${p.compound ? 'rgba(43,138,110,0.3)' : 'rgba(10,15,46,0.1)'}`,
      borderRadius: '0.15rem', padding: '20px 22px',
      borderLeft: `4px solid ${p.compound ? TEAL : cfg.color}`,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            ...DM, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: GOLD, background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.25)', padding: '2px 7px', borderRadius: '0.15rem',
          }}>{p.protocol_code}</span>
          <span style={{
            ...DM, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: cfg.color, background: cfg.bg,
            padding: '2px 7px', borderRadius: '0.15rem', display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <IconComp size={9} /> {p.domain_name}
          </span>
          {p.compound && (
            <span style={{
              ...DM, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: TEAL, background: 'rgba(43,138,110,0.1)', border: '1px solid rgba(43,138,110,0.25)',
              padding: '2px 7px', borderRadius: '0.15rem', display: 'inline-flex', alignItems: 'center', gap: 4,
            }}><Layers size={9} /> Compound · Dual Track</span>
          )}
        </div>
        <WindowPill window={p.response_window ?? '12 hours'} />
      </div>

      <div style={{ ...ED, fontSize: 17, fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{p.name}</div>

      <div
        style={{ ...DM, fontSize: 13, fontWeight: 500, color: '#374151', lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{ __html: highlight(triggerSnippet, terms) }}
      />

      {exposureSnippet && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <AlertTriangle size={13} style={{ color: '#9b1c1c', marginTop: 2, flexShrink: 0 }} />
          <span style={{ ...DM, fontSize: 12, fontWeight: 600, color: '#9b1c1c', lineHeight: 1.4 }}>
            {exposureSnippet}
          </span>
        </div>
      )}

      {expanded && p.response && (
        <div style={{
          background: 'rgba(10,15,46,0.03)', borderRadius: '0.15rem',
          border: '1px solid rgba(10,15,46,0.08)', padding: '14px 16px',
          borderLeft: `3px solid ${GOLD}`,
        }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>
            Pre-Staged Response
          </div>
          <div style={{ ...DM, fontSize: 13, fontWeight: 500, color: '#1f2937', lineHeight: 1.6 }}>
            {p.response}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Users size={11} style={{ color: '#6b7280' }} />
          <span style={{ ...DM, fontSize: 11, fontWeight: 600, color: '#6b7280' }}>
            {p.stakeholder_count} executive stakeholders pre-assigned
          </span>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            ...DM, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: expanded ? '#6b7280' : NAVY, background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 0', display: 'inline-flex', alignItems: 'center', gap: 4,
          }}
        >
          {expanded ? 'Hide response' : 'Read pre-staged response →'}
        </button>
      </div>
    </div>
  );
}

function DomainTile({ domain, protocols, onClick, active }: {
  domain: number; protocols: Protocol[]; onClick: () => void; active: boolean;
}) {
  const cfg = DOMAIN_CONFIG[domain] ?? DOMAIN_CONFIG[1];
  const IconComp = cfg.icon;
  const name = protocols[0]?.domain_name ?? '';
  const code = protocols[0]?.domain_code ?? '';
  const samples = protocols.slice(0, 4).map(p => p.name);

  return (
    <div
      onClick={onClick}
      style={{
        background: active ? cfg.bg : '#fff',
        border: `1.5px solid ${active ? cfg.color : 'rgba(10,15,46,0.1)'}`,
        borderRadius: '0.15rem', padding: '18px 20px', cursor: 'pointer',
        transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '0.15rem', background: cfg.bg,
            border: `1px solid ${cfg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconComp size={16} style={{ color: cfg.color }} />
          </div>
          <div>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: cfg.color }}>{code}</div>
            <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY }}>{name}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...DM, fontSize: 20, fontWeight: 700, color: NAVY }}>{protocols.length}</div>
          <div style={{ ...DM, fontSize: 10, fontWeight: 600, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>protocols</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {samples.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
            <span style={{ ...DM, fontSize: 11, fontWeight: 500, color: '#4b5563', lineHeight: 1.3 }}>{s}</span>
          </div>
        ))}
        {protocols.length > 4 && (
          <span style={{ ...DM, fontSize: 11, fontWeight: 600, color: cfg.color, marginTop: 2 }}>
            +{protocols.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProtocolCoverageBrowser() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updatePageMetadata(
      'Protocol Coverage Browser — 210 Pre-Staged Readiness Protocols | VaughnMartin',
      'Search 210 pre-staged response architectures across 9 strategic domains. Every situation your organization may face — already pre-staged with response windows, stakeholders, and financial exposure quantified.',
    );
    fetch('/api/public/protocol-browser')
      .then(r => r.json())
      .then(d => { setProtocols(d.protocols ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const terms = useMemo(() =>
    query.trim().toLowerCase().split(/\s+/).filter(t => t.length > 2),
    [query]
  );

  const results = useMemo(() => {
    if (!terms.length && activeDomain === null) return [];
    let pool = protocols;
    if (activeDomain !== null) pool = pool.filter(p => p.domain === activeDomain || (activeDomain === 99 && p.compound));
    if (!terms.length) return pool;
    return pool
      .map(p => ({ p, score: scoreProtocol(p, terms) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.p);
  }, [protocols, terms, activeDomain]);

  const byDomain = useMemo(() => {
    const map: Record<number, Protocol[]> = {};
    protocols.filter(p => !p.compound).forEach(p => {
      if (!map[p.domain]) map[p.domain] = [];
      map[p.domain].push(p);
    });
    return map;
  }, [protocols]);

  const compoundProtocols = useMemo(() => protocols.filter(p => p.compound), [protocols]);
  const coreCount = protocols.filter(p => !p.compound).length;
  const isSearching = terms.length > 0 || activeDomain !== null;
  const showingAll = activeDomain !== null && !terms.length;

  function handleQuick(s: string) {
    setQuery(s);
    setActiveDomain(null);
    inputRef.current?.focus();
  }

  function handleDomainClick(d: number) {
    setQuery('');
    setActiveDomain(prev => prev === d ? null : d);
  }

  return (
    <PageLayout>
      {/* ── HERO ── */}
      <div style={{ background: NAVY, paddingTop: 72, paddingBottom: 60 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 18 }}>
            Readiness OS · Protocol Coverage Browser
          </div>
          <h1 style={{ ...ED, fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 18 }}>
            Whatever your situation —<br />
            <span style={{ color: GOLD }}>it's already pre-staged.</span>
          </h1>
          <p style={{ ...DM, fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.72)', maxWidth: 680, margin: '0 auto 36px', lineHeight: 1.65 }}>
            {coreCount} core protocols and {compoundProtocols.length} compound protocols across 9 strategic domains — each carrying a response window, pre-assigned executive stakeholders, and a quantified financial exposure ceiling. Search any situation. It's in here.
          </p>

          {/* Search input */}
          <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto 20px' }}>
            <Search size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.45)', pointerEvents: 'none' }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveDomain(null); }}
              placeholder="Describe your situation — ransomware, activist investor, supply chain collapse, IPO window..."
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '16px 48px 16px 50px',
                background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: '0.15rem', color: '#fff', fontSize: 15, fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 500, outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = GOLD)}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.18)')}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick search chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {QUICK_SEARCHES.map(s => (
              <button
                key={s}
                onClick={() => handleQuick(s)}
                style={{
                  ...DM, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
                  padding: '6px 14px', borderRadius: '0.15rem', cursor: 'pointer',
                  background: query === s ? GOLD : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${query === s ? GOLD : 'rgba(255,255,255,0.15)'}`,
                  color: query === s ? NAVY : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.12s',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Stat bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, justifyContent: 'center', marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28 }}>
            {[
              { v: String(coreCount), l: 'Core Protocols' },
              { v: String(compoundProtocols.length), l: 'Compound Protocols' },
              { v: '9', l: 'Strategic Domains' },
              { v: '12 min', l: 'Execution SLA' },
            ].map((s, i, arr) => (
              <div key={s.l} style={{ padding: '0 28px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none', textAlign: 'center' }}>
                <div style={{ ...DM, fontSize: 26, fontWeight: 700, color: GOLD }}>{s.v}</div>
                <div style={{ ...DM, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ background: '#f8f9fb', minHeight: 600, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 0' }}>

          {loading && (
            <div style={{ textAlign: 'center', padding: 60, ...DM, fontSize: 15, color: '#6b7280' }}>Loading protocol library…</div>
          )}

          {/* RESULTS MODE */}
          {!loading && isSearching && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                  <div style={{ ...DM, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>
                    {showingAll ? (byDomain[activeDomain!]?.[0]?.domain_name ?? (activeDomain === 99 ? 'Compound Protocols' : '')) : 'Search Results'}
                  </div>
                  <div style={{ ...ED, fontSize: 22, fontWeight: 700, color: NAVY }}>
                    {results.length === 0
                      ? 'No protocols matched — try different terms'
                      : `${results.length} protocol${results.length !== 1 ? 's' : ''} ${showingAll ? 'in this domain' : 'match your situation'}`}
                  </div>
                </div>
                <button
                  onClick={() => { setQuery(''); setActiveDomain(null); }}
                  style={{ ...DM, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 16px', border: `1px solid rgba(10,15,46,0.15)`, background: '#fff', borderRadius: '0.15rem', cursor: 'pointer', color: NAVY, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <X size={12} /> Clear
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 }}>
                {results.map(p => <ProtocolCard key={p.number} p={p} terms={terms} />)}
              </div>
            </>
          )}

          {/* BROWSE MODE */}
          {!loading && !isSearching && (
            <>
              {/* Domain grid */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>Coverage Map</div>
                    <div style={{ ...ED, fontSize: 24, fontWeight: 700, color: NAVY }}>9 Strategic Domains · Full Coverage</div>
                  </div>
                  <div style={{ ...DM, fontSize: 13, fontWeight: 500, color: '#6b7280' }}>Click a domain to browse all protocols</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                  {Object.entries(byDomain).sort((a, b) => Number(a[0]) - Number(b[0])).map(([domain, protos]) => (
                    <DomainTile
                      key={domain}
                      domain={Number(domain)}
                      protocols={protos}
                      onClick={() => handleDomainClick(Number(domain))}
                      active={activeDomain === Number(domain)}
                    />
                  ))}
                </div>
              </div>

              {/* Compound protocols feature */}
              <div style={{
                background: NAVY, borderRadius: '0.15rem', padding: '32px 36px',
                border: `1px solid rgba(43,138,110,0.3)`, marginBottom: 48,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <Layers size={20} style={{ color: TEAL }} />
                      <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: TEAL }}>Compound Protocol Library</div>
                    </div>
                    <div style={{ ...ED, fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                      {compoundProtocols.length} Simultaneous Dual-Track Protocols
                    </div>
                    <p style={{ ...DM, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 20, maxWidth: 500 }}>
                      Real crises compound. A ransomware attack triggers brand fallout. An activist investor campaign coincides with a regulatory inquiry. An ERP failure breaches enterprise customer SLAs. Compound protocols activate two response tracks simultaneously — the only pre-staged dual-track execution library in the market.
                    </p>
                    <button
                      onClick={() => handleDomainClick(99)}
                      style={{
                        ...DM, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '10px 22px', background: TEAL, border: 'none', borderRadius: '0.15rem',
                        color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                      }}
                    >
                      Browse All {compoundProtocols.length} Compound Protocols <ChevronRight size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 280, flex: 1 }}>
                    {compoundProtocols.slice(0, 8).map(p => (
                      <div
                        key={p.number}
                        onClick={() => handleQuick(p.name.replace('Compound: ', ''))}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '0.15rem', cursor: 'pointer', border: '1px solid rgba(43,138,110,0.15)' }}
                      >
                        <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: GOLD, whiteSpace: 'nowrap' }}>{p.protocol_code}</span>
                        <span style={{ ...DM, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', lineHeight: 1.3 }}>{p.name.replace('Compound: ', '')}</span>
                      </div>
                    ))}
                    <div
                      onClick={() => handleDomainClick(99)}
                      style={{ ...DM, fontSize: 12, fontWeight: 700, color: TEAL, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      +{compoundProtocols.length - 8} more compound scenarios <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </div>

              {/* What makes this different */}
              <div style={{ background: '#fff', border: '1px solid rgba(10,15,46,0.1)', borderRadius: '0.15rem', padding: '36px 40px', marginBottom: 48 }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>What pre-staging means</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 28 }}>
                  {[
                    { icon: Clock, title: 'Response Window', body: 'Every protocol carries a target response window — 2 hours to 30 days — so executives know exactly how much time they have before exposure compounds.' },
                    { icon: AlertTriangle, title: 'Financial Exposure', body: 'Specific dollar exposure ranges per protocol — not generic risk ratings. The CFO knows the ceiling before the trigger fires.' },
                    { icon: Users, title: 'Pre-Assigned Stakeholders', body: 'Every protocol names the exact executives responsible — by role, not by name — so the right people are mobilized in minutes, not hours.' },
                    { icon: Zap, title: '12-Minute Execution', body: 'The response is fully pre-staged. When the trigger fires, the team moves to execution — not to coordination. 30 days of mobilization compressed to 12 minutes.' },
                    { icon: BookOpen, title: 'Executive Brief Included', body: 'Each protocol opens with a two-sentence executive brief — what to do and what happens if you don\'t. Board-ready from day one.' },
                    { icon: Layers, title: 'Compound-Ready', body: '30 protocols are pre-staged for simultaneous multi-domain activation. When a crisis compounds, the response already accounts for it.' },
                  ].map(item => (
                    <div key={item.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <item.icon size={15} style={{ color: GOLD }} />
                        <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY }}>{item.title}</div>
                      </div>
                      <div style={{ ...DM, fontSize: 12, fontWeight: 500, color: '#4b5563', lineHeight: 1.6 }}>{item.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* CTA */}
          {!loading && (
            <div style={{ background: NAVY, borderRadius: '0.15rem', padding: '40px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <div style={{ ...ED, fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                  Your situation is already pre-staged.<br />
                  <span style={{ color: GOLD }}>Your organization isn't.</span>
                </div>
                <div style={{ ...DM, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>
                  Founding Partners go live in 90 days with {coreCount} protocols armed and ready to execute.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
                <Link href="/request-access" style={{
                    ...DM, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '14px 28px', background: GOLD, color: NAVY, borderRadius: '0.15rem',
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}>
                    Apply for Founding Partner Access <ArrowRight size={14} />
                </Link>
                <Link href="/12-minute-experience" style={{
                    ...DM, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '10px 20px', background: 'transparent', color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.15rem', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}>
                    Take the 12-Minute Test Drive <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
