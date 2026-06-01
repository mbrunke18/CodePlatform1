import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Copy, Check, Zap, Clock, Users, ExternalLink, ArrowLeft, Shield, Mail, AlertCircle, FileText } from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

const DURATIONS = [
  { label: '6 hours', value: 6, note: 'Conference / event window' },
  { label: '24 hours', value: 24, note: 'Same-day LinkedIn post' },
  { label: '48 hours', value: 48, note: 'Standard prospect outreach', default: true },
  { label: '72 hours', value: 72, note: 'Investor review window' },
  { label: '7 days', value: 168, note: 'Extended pilot preview' },
];

interface GeneratedLink {
  url: string;
  name: string;
  email: string;
  expiresAt: string;
  durationHours: number;
  emailSent?: boolean;
  emailError?: string;
}

export default function AdminQuickLink() {
  const { user, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hours, setHours] = useState(48);
  const [sendEmail, setSendEmail] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedLink | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<GeneratedLink[]>([]);

  const handleGenerate = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setError('');
    setGenerating(true);
    try {
      const res = await apiRequest('POST', '/api/admin/generate-demo-link', { name, email, hours, sendEmail });
      const data: GeneratedLink = await res.json();
      setResult(data);
      setHistory(prev => [data, ...prev].slice(0, 10));
      setName('');
      setEmail('');
    } catch (e: any) {
      setError(e?.message || 'Failed to generate link. Check your access level.');
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatExpiry = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: 13 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB', fontFamily: "'Barlow','Helvetica Neue',sans-serif" }}>

      {/* Header */}
      <div style={{ background: NAVY, padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/mission-control" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.68)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
              <ArrowLeft size={13} /> Mission Control
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.68)' }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={14} color={GOLD} />
              <span style={{ color: GOLD, fontWeight: 800, fontSize: 14, letterSpacing: '0.06em' }}>QUICK-ISSUE DEMO LINKS</span>
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', fontWeight: 600, letterSpacing: '0.12em' }}>
            ADMIN · VAUGHNMARTIN READINESS OS
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px' }}>

        {/* Intro */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Generate a Demo Access Link</h1>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, maxWidth: 580 }}>
            Generate a personalized, time-limited access link for a specific prospect or executive. Toggle email delivery on to send automatically — or leave it off to copy and send via DM yourself.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

          {/* Form */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 0, padding: '28px 32px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: TEAL, marginBottom: 20, textTransform: 'uppercase' }}>
              Prospect Details
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Kerry Huang"
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #E2E8F0',
                  borderRadius: 0, outline: 'none', color: NAVY, fontFamily: 'inherit',
                  boxSizing: 'border-box' as const,
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="kerry@company.com"
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #E2E8F0',
                  borderRadius: 0, outline: 'none', color: NAVY, fontFamily: 'inherit',
                  boxSizing: 'border-box' as const,
                }}
              />
            </div>

            {/* Send email toggle — placed immediately after email field */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', border: `1px solid ${sendEmail ? TEAL : '#E2E8F0'}`,
              background: sendEmail ? 'rgba(43,138,110,0.05)' : '#FAFAFA',
              cursor: 'pointer', marginBottom: 24, transition: 'all 0.1s',
            }}>
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={e => setSendEmail(e.target.checked)}
                style={{ accentColor: TEAL, width: 15, height: 15 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Mail size={12} color={sendEmail ? TEAL : '#94A3B8'} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: sendEmail ? TEAL : '#64748B' }}>
                    Send email directly to prospect
                  </span>
                </div>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>
                  {sendEmail ? 'Link will be emailed automatically when you generate' : 'Link only — copy and send via DM manually'}
                </span>
              </div>
            </label>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Access Window</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DURATIONS.map(d => (
                  <label key={d.value} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', border: `1px solid ${hours === d.value ? GOLD : '#E2E8F0'}`,
                    borderRadius: 0, cursor: 'pointer',
                    background: hours === d.value ? 'rgba(201,168,76,0.06)' : 'white',
                    transition: 'all 0.1s',
                  }}>
                    <input
                      type="radio" name="duration" value={d.value}
                      checked={hours === d.value}
                      onChange={() => setHours(d.value)}
                      style={{ accentColor: GOLD }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{d.label}</span>
                      <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 8 }}>{d.note}</span>
                    </div>
                    {d.default && <span style={{ fontSize: 9, background: TEAL, color: 'white', padding: '2px 7px', borderRadius: 0, fontWeight: 700, letterSpacing: '0.08em' }}>DEFAULT</span>}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 0, padding: '10px 14px', fontSize: 13, color: '#C0392B', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || !name.trim() || !email.trim()}
              style={{
                width: '100%', padding: '13px 0', background: generating ? '#94A3B8' : NAVY,
                color: 'white', fontWeight: 800, fontSize: 14, border: 'none',
                borderRadius: 0, cursor: generating ? 'not-allowed' : 'pointer',
                letterSpacing: '0.04em', transition: 'background 0.15s',
              }}
            >
              {generating ? 'Generating...' : sendEmail ? 'Generate & Send Email' : 'Generate Demo Link'}
            </button>
          </div>

          {/* Right column: result + guidance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Generated link result */}
            {result && (
              <div style={{ background: 'white', border: `1px solid ${TEAL}`, borderTop: `3px solid ${TEAL}`, borderRadius: 0, padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                  <Zap size={13} color={TEAL} />
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', color: TEAL }}>LINK READY</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{result.name}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{result.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Clock size={11} color='#94A3B8' />
                  <span style={{ fontSize: 11, color: '#64748B' }}>Expires {formatExpiry(result.expiresAt)}</span>
                </div>
                {/* Email delivery status */}
                {result.emailSent ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: 'rgba(43,138,110,0.07)', border: '1px solid rgba(43,138,110,0.25)', marginBottom: 14 }}>
                    <Mail size={11} color={TEAL} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>Email delivered to {result.email}</span>
                  </div>
                ) : result.emailError ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '7px 10px', background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.2)', marginBottom: 14 }}>
                    <AlertCircle size={11} color='#C0392B' style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#C0392B', display: 'block' }}>Email delivery failed — copy link below and send manually</span>
                      <span style={{ fontSize: 10, color: '#94A3B8' }}>{result.emailError}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: 14 }}>
                    <Mail size={11} color='#94A3B8' />
                    <span style={{ fontSize: 11, color: '#64748B' }}>Copy link below and send manually</span>
                  </div>
                )}
                <div style={{
                  background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 0,
                  padding: '10px 12px', fontSize: 11, color: '#475569', wordBreak: 'break-all' as const,
                  lineHeight: 1.5, marginBottom: 12, fontFamily: 'monospace',
                }}>
                  {result.url}
                </div>
                <button
                  onClick={() => copyLink(result.url)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px 0', background: copied ? TEAL : GOLD, color: copied ? 'white' : NAVY,
                    fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 0,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
                </button>
              </div>
            )}

            {/* Usage guide */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 0, padding: '20px 22px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: '#64748B', marginBottom: 14, textTransform: 'uppercase' }}>
                When to Use Each Access Path
              </div>
              {[
                { icon: Users, title: 'This tool', desc: 'Direct DM to a specific person — Kerry Huang, a board contact, a warm prospect. Personalized, one-click, expires automatically.' },
                { icon: ExternalLink, title: 'Public token link', desc: 'LinkedIn post or email blast to a broad audience. Set DEMO_ACCESS_EXPIRES env var to close the window after 36 hours.' },
                { icon: Zap, title: '/request-access form', desc: 'Investor or pilot prospect who wants to enroll properly. Captures their info, triggers the full magic link flow.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 0, padding: 7, flexShrink: 0, height: 30, display: 'flex', alignItems: 'center' }}>
                    <Icon size={13} color={TEAL} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
              {/* Leave-behind document */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 0, padding: 7, flexShrink: 0, height: 30, display: 'flex', alignItems: 'center' }}>
                  <FileText size={13} color={GOLD} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 2 }}>Leave-behind document</div>
                  <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6, marginBottom: 5 }}>Print-ready one-pager: the offer, three mutual commitments, and day-90 success definition. Send before a call or print for in-person meetings.</div>
                  <Link href="/founding-partner-brief" target="_blank" style={{ fontSize: 11, color: GOLD, fontWeight: 700, textDecoration: 'none' }}>
                    Open &amp; Print → /founding-partner-brief
                  </Link>
                </div>
              </div>
              <Link href="/request-access" style={{ display: 'block', textAlign: 'center', fontSize: 11, color: TEAL, fontWeight: 700, textDecoration: 'none', paddingTop: 4 }}>
                View /request-access →
              </Link>
            </div>

            {/* Recent history */}
            {history.length > 0 && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 0, padding: '18px 22px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: '#64748B', marginBottom: 12, textTransform: 'uppercase' }}>
                  This Session
                </div>
                {history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < history.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{h.name}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8' }}>{h.durationHours}h · expires {formatExpiry(h.expiresAt)}</div>
                    </div>
                    <button
                      onClick={() => copyLink(h.url)}
                      style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: 0, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748B', fontWeight: 600 }}
                    >
                      <Copy size={10} /> Copy
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
