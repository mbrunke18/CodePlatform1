import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { io } from 'socket.io-client';
import {
  Radio,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Zap,
  Shield,
  Clock,
  Bell,
  BellOff,
  RefreshCw,
  Send,
} from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

interface MatchedEvidence {
  engine?: string;
  conditionsMet?: number;
  totalConditions?: number;
  dataPoints?: string[];
  matchedKeywords?: string[];
}

interface Detection {
  id: number;
  triggerName: string;
  triggerDomain: string;
  signalDescription: string;
  signalSource: string;
  signalSourceUrl?: string;
  confidenceScore: number;
  recommendedPlaybook: string;
  alternatePlaybooks?: string[];
  status: string;
  notificationSent: boolean;
  detectedAt: string;
  matchedEvidence?: MatchedEvidence;
}

interface StakeholderContact {
  id: number;
  role: string;
  name?: string;
  email?: string;
  slackUserId?: string;
  slackChannel?: string;
  isActive: boolean;
}

function confidenceColor(score: number) {
  if (score >= 85) return '#DC2626';
  if (score >= 75) return '#EA580C';
  return '#C9A84C';
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function LiveDetectionFeed() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const ORG_ID = user?.organizationId || 'system';
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ role: '', name: '', email: '', slackChannel: '' });

  // Read email link params — trigger name + optional playbook/domain for fallback display
  const _urlParams = new URLSearchParams(window.location.search);
  const urlTriggerName = _urlParams.get('trigger') || '';
  const urlPlaybookName = _urlParams.get('playbook') || '';
  const urlDomain = _urlParams.get('domain') || '';
  const highlightRef = useRef<HTMLDivElement | null>(null);

  // Real-time WebSocket listener — refreshes feed the instant a detection fires
  useEffect(() => {
    const socket = io(window.location.origin, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
    });
    socket.on('new-detection', () => {
      qc.invalidateQueries({ queryKey: ['/api/detections'] });
    });
    return () => { socket.disconnect(); };
  }, [qc]);

  const detectionsQuery = useQuery<{ success: boolean; detections: Detection[] }>({
    queryKey: ['/api/detections', ORG_ID],
    queryFn: () => fetch(`/api/detections?organizationId=${ORG_ID}`).then(r => r.json()),
    refetchInterval: 30000,
  });

  // Scroll to highlighted detection once data loads
  useEffect(() => {
    if (urlTriggerName && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [urlTriggerName, detectionsQuery.data]);

  const contactsQuery = useQuery<{ success: boolean; contacts: StakeholderContact[] }>({
    queryKey: ['/api/stakeholder-contacts', ORG_ID],
    queryFn: () => fetch(`/api/stakeholder-contacts?organizationId=${ORG_ID}`).then(r => r.json()),
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (id: number) => apiRequest('POST', `/api/detections/${id}/acknowledge`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/detections'] });
      toast({ title: 'Detection acknowledged' });
    },
  });

  const testMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/signals/live/test-detection', { organizationId: ORG_ID }),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['/api/detections'] });
      toast({ title: `Test complete — ${data.detectionsCreated ?? 0} detection(s) created` });
    },
  });

  const addContactMutation = useMutation({
    mutationFn: () =>
      apiRequest('POST', '/api/stakeholder-contacts', { ...newContact, organizationId: ORG_ID }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/stakeholder-contacts'] });
      setNewContact({ role: '', name: '', email: '', slackChannel: '' });
      setShowAddContact(false);
      toast({ title: 'Stakeholder contact added' });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/stakeholder-contacts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/stakeholder-contacts'] });
      toast({ title: 'Contact removed' });
    },
  });

  const [sendingTestTo, setSendingTestTo] = useState<number | null>(null);
  const testAlertMutation = useMutation({
    mutationFn: (contact: { id: number; email: string; name?: string; role?: string }) =>
      apiRequest('POST', '/api/stakeholder-contacts/send-test-alert', {
        email: contact.email,
        name: contact.name,
        role: contact.role,
      }),
    onMutate: (contact) => setSendingTestTo(contact.id),
    onSettled: () => setSendingTestTo(null),
    onSuccess: (_data: any, contact) => {
      toast({
        title: 'Sample Alert Sent',
        description: `Test trigger email delivered to ${contact.email}`,
      });
    },
    onError: (_err: any, contact) => {
      toast({
        title: 'Send Failed',
        description: `Could not deliver to ${contact.email} — check Resend domain verification`,
        variant: 'destructive',
      });
    },
  });

  const detections = detectionsQuery.data?.detections ?? [];
  const contacts = contactsQuery.data?.contacts ?? [];
  const active = detections.filter(d => d.status !== 'acknowledged' && d.status !== 'dismissed');
  const acknowledged = detections.filter(d => d.status === 'acknowledged');

  if (!authLoading && !isAuthenticated) {
    // When arriving from an email alert link, find the specific detection that fired
    const emailDetection = urlTriggerName
      ? detections.find(d => d.triggerName.toLowerCase().includes(urlTriggerName.toLowerCase().slice(0, 12)))
      : null;

    return (
      <div style={{ background: '#f8f7f4', minHeight: '100vh' }}>
        <div style={{ background: NAVY, padding: '56px 48px 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
          <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 0, padding: '6px 16px', marginBottom: 24 }}>
              <div style={{ width: 7, height: 7, borderRadius: 0, background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Live System — Monitoring Active</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
              Signal Detection Feed
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, margin: '0 0 40px', lineHeight: 1.6, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
              Real signals from 8 live sources, scored against 16 trigger patterns every 15 minutes. When a threshold is crossed, your team is notified automatically — before competitors react.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
              {[
                { icon: Radio, label: '8 Live Sources', sub: 'NYT, BBC, SEC, CNBC & more' },
                { icon: Zap, label: '16 Trigger Patterns', sub: 'Evaluated every 15 minutes' },
                { icon: Bell, label: 'Instant Alerts', sub: 'Email + Slack on threshold breach' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0, padding: '20px 24px', minWidth: 160, textAlign: 'center' }}>
                  <Icon size={22} color={GOLD} style={{ marginBottom: 8 }} />
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>

          {/* Email link: show the real detection that fired */}
          {emailDetection ? (
            /* ── Real DB detection found ───────────────────────────────── */
            <div style={{ marginBottom: 36 }}>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Detection That Triggered Your Alert</span>
              </div>
              <div style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 16px' }}>
                ▼ Live detection — received from your alert email
              </div>
              <div style={{ background: '#fff', border: `2px solid ${GOLD}`, boxShadow: `0 0 0 3px ${GOLD}33`, borderTop: 'none' }}>
                <div style={{ height: 4, background: GOLD }} />
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <AlertTriangle size={15} style={{ color: confidenceColor(emailDetection.confidenceScore), flexShrink: 0 }} />
                    <span style={{ color: NAVY, fontSize: 16, fontWeight: 700 }}>{emailDetection.triggerName}</span>
                    <span style={{ background: `${confidenceColor(emailDetection.confidenceScore)}15`, color: confidenceColor(emailDetection.confidenceScore), border: `1px solid ${confidenceColor(emailDetection.confidenceScore)}30`, fontSize: 11, fontWeight: 700, padding: '2px 8px' }}>
                      {emailDetection.confidenceScore}% confidence
                    </span>
                  </div>
                  <div style={{ color: '#555', fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
                    {emailDetection.signalDescription.substring(0, 320)}{emailDetection.signalDescription.length > 320 ? '…' : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
                    <span style={{ color: '#666', fontSize: 12 }}>Source: <strong>{emailDetection.signalSource}</strong></span>
                    <span style={{ color: '#666', fontSize: 12 }}>Domain: <strong>{emailDetection.triggerDomain}</strong></span>
                    <span style={{ color: '#666', fontSize: 12 }}>Detected: <strong>{timeAgo(emailDetection.detectedAt)}</strong></span>
                  </div>
                  {emailDetection.recommendedPlaybook && (
                    <div style={{ background: '#0A0F2E06', border: '1px solid #0A0F2E14', padding: '12px 14px', marginBottom: 16 }}>
                      <div style={{ marginBottom: emailDetection.alternatePlaybooks?.length ? 10 : 0 }}>
                        <span style={{ color: '#888', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Primary Readiness Protocol</span>
                        <div style={{ color: NAVY, fontSize: 13, fontWeight: 700, marginTop: 4 }}>{emailDetection.recommendedPlaybook}</div>
                      </div>
                      {(emailDetection.alternatePlaybooks?.length ?? 0) > 0 && (
                        <div style={{ borderTop: '1px solid #0A0F2E12', paddingTop: 10 }}>
                          <span style={{ color: '#888', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Also Aligned</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                            {emailDetection.alternatePlaybooks!.map((p: string) => (
                              <span key={p} style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}30`, color: TEAL, fontSize: 11, fontWeight: 600, padding: '3px 10px' }}>{p}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <a
                    href={`/live-activation-center?playbookName=${encodeURIComponent(emailDetection.recommendedPlaybook)}&domain=${encodeURIComponent(emailDetection.triggerDomain)}`}
                    style={{ display: 'inline-block', background: GOLD, color: NAVY, padding: '12px 28px', fontWeight: 800, fontSize: 14, textDecoration: 'none', letterSpacing: '0.04em' }}
                  >
                    Activate: {emailDetection.recommendedPlaybook} →
                  </a>
                </div>
              </div>
            </div>
          ) : urlTriggerName ? (
            /* ── Came from email but detection not yet in DB — use URL params ── */
            <div style={{ marginBottom: 36 }}>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Detection That Triggered Your Alert</span>
              </div>
              <div style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 16px' }}>
                ▼ Live detection — received from your alert email
              </div>
              <div style={{ background: '#fff', border: `2px solid ${GOLD}`, boxShadow: `0 0 0 3px ${GOLD}33`, borderTop: 'none' }}>
                <div style={{ height: 4, background: GOLD }} />
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <AlertTriangle size={15} style={{ color: GOLD, flexShrink: 0 }} />
                    <span style={{ color: NAVY, fontSize: 16, fontWeight: 700 }}>{urlTriggerName}</span>
                    {urlDomain && <span style={{ background: '#0A0F2E10', color: NAVY, fontSize: 11, fontWeight: 600, padding: '2px 8px' }}>{urlDomain}</span>}
                  </div>
                  {urlPlaybookName && (
                    <div style={{ background: '#0A0F2E06', border: '1px solid #0A0F2E14', padding: '12px 14px', marginBottom: 16 }}>
                      <span style={{ color: '#888', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Readiness Protocol Staged</span>
                      <div style={{ color: NAVY, fontSize: 13, fontWeight: 700, marginTop: 4 }}>{urlPlaybookName}</div>
                    </div>
                  )}
                  <a
                    href={`/live-activation-center?playbookName=${encodeURIComponent(urlPlaybookName || urlTriggerName)}&domain=${encodeURIComponent(urlDomain)}`}
                    style={{ display: 'inline-block', background: GOLD, color: NAVY, padding: '12px 28px', fontWeight: 800, fontSize: 14, textDecoration: 'none', letterSpacing: '0.04em' }}
                  >
                    {urlPlaybookName ? `Activate: ${urlPlaybookName} →` : 'Review & Activate Protocol →'}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* ── General visitor — blurred preview ─────────────────────── */
            <div>
              <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Shield size={16} color={NAVY} />
                <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live Feed Preview</span>
              </div>
              {[
                { trigger: 'Competitive Market Entry Detected', source: 'SEC EDGAR', confidence: 87, time: '3m ago', critical: true, playbook: 'Competitive Threat Response' },
                { trigger: 'Supply Chain Disruption Signal', source: 'CNBC Markets', confidence: 79, time: '41m ago', critical: false, playbook: 'Supply Chain Disruption Protocol' },
                { trigger: 'Geopolitical Risk Escalation', source: 'BBC World News', confidence: 74, time: '2h ago', critical: false, playbook: 'Geopolitical Risk Response' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#fff', border: `1px solid ${item.critical ? 'rgba(192,57,43,0.2)' : '#E8E4DC'}`,
                  borderLeft: `5px solid ${item.critical ? '#C0392B' : GOLD}`,
                  borderRadius: 0, padding: '20px 24px', marginBottom: 12,
                  filter: i > 0 ? 'blur(3px)' : 'none',
                  userSelect: 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{item.trigger}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Source: {item.source} · {item.time}</div>
                    </div>
                    <div style={{ background: item.confidence >= 85 ? 'rgba(192,57,43,0.1)' : 'rgba(201,168,76,0.1)', color: item.confidence >= 85 ? '#C0392B' : '#8B6914', border: `1px solid ${item.confidence >= 85 ? 'rgba(192,57,43,0.25)' : 'rgba(201,168,76,0.25)'}`, borderRadius: 0, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                      {item.confidence}% confidence
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#2B8A6E', fontWeight: 600 }}>→ {item.playbook}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: NAVY, borderRadius: 0, padding: '40px 36px', textAlign: 'center', marginTop: 36 }}>
            <div style={{ width: 48, height: 48, borderRadius: 0, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Shield size={22} color={GOLD} />
            </div>
            <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>
              Access the Full Detection Feed
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>
              Founding Partners get real-time signal detection scoped to their organization, stakeholder alert routing, and full trigger history. 12-minute execution starts here.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/founding-partner-program" style={{ background: GOLD, color: NAVY, padding: '14px 32px', borderRadius: 0, fontWeight: 800, fontSize: 14, textDecoration: 'none', letterSpacing: '0.04em' }}>
                Apply for Founding Partner Access
              </a>
              <a href="/platform-overview" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 28px', borderRadius: 0, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8f7f4', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: NAVY, padding: '48px 48px 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 0, background: '#22C55E', boxShadow: '0 0 8px #22C55E', animation: 'pulse 2s infinite' }} />
            <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Live — Monitoring Active</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '0 0 8px' }}>
            Signal Detection Feed
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, margin: 0, maxWidth: 560 }}>
            Real signals from 8 live sources, evaluated against 16 trigger patterns every 15 minutes. When a threshold is crossed, your team is notified automatically.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 0, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{active.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Active Detections</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 0, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ color: GOLD, fontSize: 24, fontWeight: 700 }}>{contacts.filter(c => c.email).length}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Alert Recipients</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 0, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ color: TEAL, fontSize: 24, fontWeight: 700 }}>{acknowledged.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Acknowledged</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

        {/* ── Left: Detection Feed ─────────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: NAVY, fontSize: 20, fontWeight: 700, margin: 0 }}>
              Active Trigger Detections
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => qc.invalidateQueries({ queryKey: ['/api/detections'] })}
                disabled={detectionsQuery.isFetching}
                style={{ borderColor: '#e8e4dc', color: NAVY }}
              >
                <RefreshCw size={14} className={detectionsQuery.isFetching ? 'animate-spin' : ''} />
              </Button>
              <Button
                size="sm"
                onClick={() => testMutation.mutate()}
                disabled={testMutation.isPending}
                style={{ background: NAVY, color: '#fff', fontSize: 13 }}
              >
                <Zap size={14} style={{ marginRight: 6 }} />
                {testMutation.isPending ? 'Testing…' : 'Fire Test Detection'}
              </Button>
            </div>
          </div>

          {detectionsQuery.isLoading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>Loading detections…</div>
          ) : active.length === 0 ? (
            <Card style={{ border: '1px solid #e8e4dc', borderRadius: 0 }}>
              <CardContent style={{ padding: 48, textAlign: 'center' }}>
                <Shield size={40} style={{ color: TEAL, margin: '0 auto 16px', display: 'block' }} />
                <div style={{ color: NAVY, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Monitoring Active — No Triggers Detected</div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
                  The system is scanning 8 live sources every 15 minutes. Use "Fire Test Detection" to see the full flow end-to-end.
                </div>
                <Button
                  onClick={() => testMutation.mutate()}
                  disabled={testMutation.isPending}
                  style={{ background: NAVY, color: '#fff' }}
                >
                  <Zap size={15} style={{ marginRight: 8 }} />
                  Fire Test Detection
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {active.map(detection => {
                const isHighlighted = urlTriggerName &&
                  detection.triggerName.toLowerCase().includes(urlTriggerName.toLowerCase().slice(0, 12));
                return (
                <div key={detection.id} ref={isHighlighted ? highlightRef : null}>
                {isHighlighted && (
                  <div style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 16px' }}>
                    ▼ Detection from your alert email
                  </div>
                )}
                <Card style={{
                  border: isHighlighted ? `2px solid ${GOLD}` : `2px solid ${confidenceColor(detection.confidenceScore)}22`,
                  borderRadius: 0, overflow: 'hidden',
                  boxShadow: isHighlighted ? `0 0 0 3px ${GOLD}33` : 'none',
                }}>
                  <div style={{ height: 4, background: isHighlighted ? GOLD : confidenceColor(detection.confidenceScore) }} />
                  <CardContent style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <AlertTriangle size={15} style={{ color: confidenceColor(detection.confidenceScore), flexShrink: 0 }} />
                          <span style={{ color: NAVY, fontSize: 16, fontWeight: 700 }}>{detection.triggerName}</span>
                          <Badge style={{
                            background: `${confidenceColor(detection.confidenceScore)}15`,
                            color: confidenceColor(detection.confidenceScore),
                            border: `1px solid ${confidenceColor(detection.confidenceScore)}30`,
                            fontSize: 11, fontWeight: 700,
                          }}>
                            {detection.confidenceScore}% confidence
                          </Badge>
                          {detection.notificationSent && (
                            <Badge style={{ background: '#22C55E15', color: '#16A34A', border: '1px solid #22C55E30', fontSize: 11 }}>
                              <Bell size={10} style={{ marginRight: 4 }} />Notified
                            </Badge>
                          )}
                        </div>

                        <div style={{ color: '#555', fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
                          {detection.signalDescription.substring(0, 280)}
                          {detection.signalDescription.length > 280 ? '…' : ''}
                        </div>

                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Radio size={13} style={{ color: TEAL }} />
                            <span style={{ color: '#666', fontSize: 12 }}>{detection.signalSource}</span>
                            {detection.signalSourceUrl && (
                              <a href={detection.signalSourceUrl} target="_blank" rel="noreferrer">
                                <ExternalLink size={11} style={{ color: GOLD }} />
                              </a>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Shield size={13} style={{ color: NAVY }} />
                            <span style={{ color: '#666', fontSize: 12 }}>{detection.triggerDomain}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={13} style={{ color: '#999' }} />
                            <span style={{ color: '#999', fontSize: 12 }}>{timeAgo(detection.detectedAt)}</span>
                          </div>
                        </div>

                        {/* Evidence trail — which data points fired this trigger */}
                        {detection.matchedEvidence && (detection.matchedEvidence.dataPoints?.length ?? 0) > 0 && (
                          <div style={{ background: '#0A0F2E06', border: '1px solid #0A0F2E14', borderRadius: 0, padding: '12px 14px', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                              <span style={{ color: NAVY, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Evidence Trail</span>
                              <span style={{
                                background: TEAL, color: '#fff', fontSize: 9, fontWeight: 700,
                                padding: '2px 7px', borderRadius: 0, letterSpacing: 0.5,
                              }}>
                                {detection.matchedEvidence.conditionsMet ?? detection.matchedEvidence.dataPoints?.length}/{detection.matchedEvidence.totalConditions ?? detection.matchedEvidence.dataPoints?.length} DATA POINTS MET
                              </span>
                              {detection.matchedEvidence.engine && (
                                <span style={{
                                  background: detection.matchedEvidence.engine === 'configured' ? '#C9A84C20' : '#0A0F2E10',
                                  color: detection.matchedEvidence.engine === 'configured' ? '#92681A' : '#555',
                                  fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 0, textTransform: 'uppercase',
                                }}>
                                  {detection.matchedEvidence.engine === 'configured' ? 'Your Triggers' : 'Platform Patterns'}
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                              {detection.matchedEvidence.dataPoints!.map((dp, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 10px', background: '#fff', borderRadius: 0, borderLeft: `3px solid ${TEAL}` }}>
                                  <span style={{ color: TEAL, fontWeight: 700, fontSize: 11, minWidth: 16, marginTop: 1 }}>{i + 1}</span>
                                  <span style={{ color: '#333', fontSize: 12, lineHeight: 1.4 }}>{dp}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div style={{ background: '#f0ede4', borderLeft: `3px solid ${GOLD}`, borderRadius: 0, padding: '12px 14px' }}>
                          <div style={{ marginBottom: (detection.alternatePlaybooks?.length ?? 0) > 0 ? 10 : 0 }}>
                            <span style={{ color: '#888', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Primary Readiness Protocol</span>
                            <div style={{ color: NAVY, fontSize: 13, fontWeight: 700, marginTop: 4 }}>{detection.recommendedPlaybook}</div>
                          </div>
                          {(detection.alternatePlaybooks?.length ?? 0) > 0 && (
                            <div style={{ borderTop: '1px solid rgba(10,15,46,0.1)', paddingTop: 10 }}>
                              <span style={{ color: '#888', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Also Aligned</span>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                                {detection.alternatePlaybooks!.map((p: string) => (
                                  <span key={p} style={{ background: `${TEAL}15`, border: `1px solid ${TEAL}30`, color: TEAL, fontSize: 11, fontWeight: 600, padding: '3px 10px' }}>{p}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeMutation.mutate(detection.id)}
                        disabled={acknowledgeMutation.isPending}
                        style={{ borderColor: '#e8e4dc', color: '#666', flexShrink: 0, fontSize: 12 }}
                      >
                        Commit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </div>
                );
              })}
            </div>
          )}

          {/* Acknowledged section */}
          {acknowledged.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <h3 style={{ color: '#999', fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Acknowledged ({acknowledged.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {acknowledged.map(d => (
                  <div key={d.id} style={{ background: '#fff', border: '1px solid #e8e4dc', borderRadius: 0, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.7 }}>
                    <div>
                      <span style={{ color: NAVY, fontSize: 14, fontWeight: 600 }}>{d.triggerName}</span>
                      <span style={{ color: '#999', fontSize: 12, marginLeft: 10 }}>{timeAgo(d.detectedAt)}</span>
                    </div>
                    <Badge style={{ background: '#f0f0f0', color: '#888', fontSize: 11 }}>
                      <CheckCircle2 size={10} style={{ marginRight: 4 }} />Acknowledged
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Stakeholder Registry ───────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card style={{ border: '1px solid #e8e4dc', borderRadius: 0 }}>
            <CardHeader style={{ padding: '20px 24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardTitle style={{ color: NAVY, fontSize: 16, fontWeight: 700 }}>Alert Recipients</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddContact(!showAddContact)}
                  style={{ color: NAVY, fontSize: 12 }}
                >
                  <Plus size={14} style={{ marginRight: 4 }} />
                  Add
                </Button>
              </div>
              <p style={{ color: '#888', fontSize: 12, marginTop: 4, marginBottom: 0 }}>
                These contacts receive email + Slack alerts when a trigger is detected.
              </p>
            </CardHeader>
            <CardContent style={{ padding: '16px 24px 24px' }}>
              {showAddContact && (
                <div style={{ background: '#f8f7f4', border: '1px solid #e8e4dc', borderRadius: 0, padding: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <Label style={{ fontSize: 12, color: NAVY, fontWeight: 600 }}>Role</Label>
                      <Input
                        placeholder="e.g. CEO, CFO, CISO"
                        value={newContact.role}
                        onChange={e => setNewContact(p => ({ ...p, role: e.target.value }))}
                        style={{ marginTop: 4, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <Label style={{ fontSize: 12, color: NAVY, fontWeight: 600 }}>Name</Label>
                      <Input
                        placeholder="Full name"
                        value={newContact.name}
                        onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
                        style={{ marginTop: 4, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <Label style={{ fontSize: 12, color: NAVY, fontWeight: 600 }}>Email</Label>
                      <Input
                        placeholder="email@company.com"
                        type="email"
                        value={newContact.email}
                        onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))}
                        style={{ marginTop: 4, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <Label style={{ fontSize: 12, color: NAVY, fontWeight: 600 }}>Slack Channel (optional)</Label>
                      <Input
                        placeholder="#strategy-alerts"
                        value={newContact.slackChannel}
                        onChange={e => setNewContact(p => ({ ...p, slackChannel: e.target.value }))}
                        style={{ marginTop: 4, fontSize: 13 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <Button
                        size="sm"
                        onClick={() => addContactMutation.mutate()}
                        disabled={!newContact.role || addContactMutation.isPending}
                        style={{ background: NAVY, color: '#fff', flex: 1, fontSize: 13 }}
                      >
                        {addContactMutation.isPending ? 'Saving…' : 'Save Contact'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowAddContact(false)}
                        style={{ color: '#666', fontSize: 13 }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {contacts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#aaa', fontSize: 13 }}>
                  <BellOff size={28} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.4 }} />
                  No alert recipients configured yet.
                  <br />Add contacts to receive real-time notifications.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {contacts.map(contact => (
                    <div key={contact.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0ede4' }}>
                      <div>
                        <div style={{ color: NAVY, fontSize: 14, fontWeight: 600 }}>{contact.role}</div>
                        {contact.name && <div style={{ color: '#666', fontSize: 12 }}>{contact.name}</div>}
                        {contact.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <Bell size={10} style={{ color: TEAL }} />
                            <span style={{ color: '#888', fontSize: 11 }}>{contact.email}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Send sample trigger alert email"
                          disabled={sendingTestTo === contact.id}
                          onClick={() => contact.email && testAlertMutation.mutate({ id: contact.id, email: contact.email, name: contact.name, role: contact.role })}
                          style={{ color: TEAL, padding: '4px 8px', fontSize: 11, fontWeight: 600, opacity: contact.email ? 1 : 0.3 }}
                        >
                          {sendingTestTo === contact.id ? (
                            <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <Send size={12} />
                          )}
                          <span style={{ marginLeft: 4 }}>Test</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteContactMutation.mutate(contact.id)}
                          style={{ color: '#ccc', padding: '4px 8px' }}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* How it works */}
          <Card style={{ border: '1px solid #e8e4dc', borderRadius: 0, background: NAVY }}>
            <CardContent style={{ padding: 24 }}>
              <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>How It Works</div>
              {[
                { step: '1', label: 'Signal Ingested', desc: '8 live feeds scanned every 15 minutes — news, SEC filings, financial data' },
                { step: '2', label: 'Trigger Evaluated', desc: 'Signal scored against 16 trigger patterns with keyword + confidence analysis' },
                { step: '3', label: 'Threshold Crossed', desc: 'When confidence ≥ 72%, detection is logged as a real trigger event' },
                { step: '4', label: 'Team Notified', desc: 'Email + Slack fires to all alert recipients within seconds of detection' },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 0, background: `${GOLD}20`, border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: GOLD, fontSize: 11, fontWeight: 700 }}>{item.step}</span>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
