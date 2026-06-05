import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { X, Pencil, CheckCircle2, Trash2, MessageSquare, RefreshCw, ExternalLink, LogOut, ChevronDown } from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

// ─── Board member definitions ─────────────────────────────────────────────────
export const BOARD_MEMBERS = [
  { id: 'gates',    name: 'Bill Gates',      initials: 'BG', color: '#0A2A4A', role: 'Technology & Global Scale' },
  { id: 'buffett',  name: 'Warren Buffett',  initials: 'WB', color: '#1B4332', role: 'Risk & Capital Allocation' },
  { id: 'blakely',  name: 'Sara Blakely',   initials: 'SB', color: '#7C2D44', role: 'Founder Experience & Go-to-Market' },
  { id: 'branson',  name: 'Richard Branson', initials: 'RB', color: '#3730A3', role: 'Brand & Enterprise Culture' },
  { id: 'obama',    name: 'Barack Obama',    initials: 'BO', color: '#1E3A5F', role: 'Stakeholder Coordination & Trust' },
  { id: 'williams', name: 'Serena Williams', initials: 'SW', color: '#065F46', role: 'Performance & Resilience' },
  { id: 'founder',  name: 'Founder',         initials: 'VM', color: NAVY,      role: 'Platform Review' },
];

// ─── Page name map ────────────────────────────────────────────────────────────
const PAGE_NAMES: Record<string, string> = {
  '/':                        'Homepage',
  '/advance-intelligence':    'ADVANCE Intelligence',
  '/microsoft-connectors':    'Microsoft 365 Connectors',
  '/certification':           '12-Minute Certification',
  '/playbook-library':        'Protocol Library',
  '/live-activation':         'Live Activation Center',
  '/command-tower':           'Command Tower',
  '/roi-calculator':          'ROI Calculator',
  '/executive-brief':         'Executive Brief',
  '/how-it-executes':         'How It Executes',
  '/proof-story':             'Proof Story',
  '/getting-started':         'Getting Started Hub',
  '/12-minute-experience':    '12-Minute Test Drive',
  '/demo-hub':                'Demo Experience Center',
  '/master-demo':             'Master Demo',
  '/investors':               'Investor Page',
  '/investor-landing':        'Investor Landing',
  '/platform-reality':        'Platform Reality',
  '/ms-project':              'Microsoft Positioning',
  '/vs-consulting':           'vs. Consulting',
  '/security-compliance':     'Security & Compliance',
  '/protocol-builder':        'Protocol Builder',
  '/practice-drills':         'Practice Drills',
  '/board-review':            'Review Mode Setup',
  '/board-admin':             'Board Review Dashboard',
  '/founder-story':           'Founder Story',
  '/situation-scanner':       'Situation Scanner',
  '/founding-partner-program':'Founding Partner Program',
  '/request-access':          'Request Access',
};

function getPageName(path: string): string {
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];
  for (const [prefix, name] of Object.entries(PAGE_NAMES)) {
    if (prefix !== '/' && path.startsWith(prefix)) return name;
  }
  return path
    .replace(/\//g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim() || 'This Page';
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const ACTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  change:    { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  add:       { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  eliminate: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
};
const PRIORITY_COLORS: Record<string, { dot: string; label: string }> = {
  critical:     { dot: '#EF4444', label: 'Critical' },
  important:    { dot: GOLD,      label: 'Important' },
  nice_to_have: { dot: '#9CA3AF', label: 'Nice to have' },
};
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:     { bg: '#F3F4F6', text: '#6B7280' },
  in_review:   { bg: '#FEF3C7', text: '#92400E' },
  planned:     { bg: '#DBEAFE', text: '#1D4ED8' },
  implemented: { bg: '#D1FAE5', text: '#065F46' },
  declined:    { bg: '#FEE2E2', text: '#991B1B' },
};

const AREAS = ['design', 'layout', 'messaging', 'feature', 'navigation', 'content', 'data'];
const AREA_LABELS: Record<string, string> = {
  design: 'Design', layout: 'Layout', messaging: 'Messaging',
  feature: 'Feature', navigation: 'Navigation', content: 'Content', data: 'Data / Numbers',
};

// ─── Storage helpers ──────────────────────────────────────────────────────────
export function getBoardMember(): string {
  return localStorage.getItem('vm_board_member') ?? '';
}
export function isBoardMode(): boolean {
  return localStorage.getItem('vm_board_mode') === 'true';
}
export function activateBoardMode(memberId: string) {
  localStorage.setItem('vm_board_mode', 'true');
  localStorage.setItem('vm_board_member', memberId);
}
export function deactivateBoardMode() {
  localStorage.removeItem('vm_board_mode');
  localStorage.removeItem('vm_board_member');
}

// ─── Panel ────────────────────────────────────────────────────────────────────
export default function BoardReviewPanel() {
  const [location] = useLocation();
  const [isOpen, setIsOpen]   = useState(false);
  const [active, setActive]   = useState(isBoardMode());
  const [memberId, setMemberId] = useState(getBoardMember());
  const { toast } = useToast();

  const [actionType, setActionType] = useState<'change' | 'add' | 'eliminate'>('change');
  const [area, setArea]             = useState('messaging');
  const [priority, setPriority]     = useState<'critical' | 'important' | 'nice_to_have'>('important');
  const [note, setNote]             = useState('');

  const member   = BOARD_MEMBERS.find(m => m.id === memberId);
  const pageName = getPageName(location);
  const accentColor = member?.color ?? NAVY;

  useEffect(() => {
    setActive(isBoardMode());
    setMemberId(getBoardMember());
  }, [location]);

  const { data: rawNotes, refetch } = useQuery<any[]>({
    queryKey: ['/api/board/feedback', { pageUrl: location }],
    queryFn: () => fetch(`/api/board/feedback?pageUrl=${encodeURIComponent(location)}`).then(r => r.ok ? r.json() : []),
    enabled: active && isOpen,
  });
  const pageNotes: any[] = Array.isArray(rawNotes) ? rawNotes : [];

  const submitMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/board/feedback', {
      boardMember: memberId || 'founder',
      pageUrl: location,
      pageName,
      actionType,
      area,
      priority,
      feedback: note,
    }).then(r => r.json()),
    onSuccess: () => {
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['/api/board/feedback'] });
      toast({ title: 'Note saved', description: `${member?.name ?? 'Board'} · ${actionType} · ${pageName}` });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/board/feedback/${id}`, {}).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/board/feedback'] }),
  });

  if (!active) return null;

  // ── Collapsed tab ─────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); refetch(); }}
        style={{ position: 'fixed', bottom: 24, right: 0, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: accentColor, color: 'white', border: 'none', borderRadius: '4px 0 0 4px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
        title={`Board review — ${member?.name ?? 'Reviewer'}`}
      >
        {member ? (
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {member.initials}
          </div>
        ) : (
          <Pencil style={{ width: 13, height: 13, color: GOLD }} />
        )}
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'white' }}>
          Review
        </span>
        {pageNotes.length > 0 && (
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: GOLD, color: NAVY, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {pageNotes.length}
          </span>
        )}
      </button>
    );
  }

  // ── Expanded drawer ───────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', pointerEvents: 'auto' }} onClick={() => setIsOpen(false)} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: 380, height: '100%', background: 'white', boxShadow: '-4px 0 40px rgba(0,0,0,0.15)', pointerEvents: 'auto', borderLeft: `3px solid ${accentColor}`, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ flexShrink: 0, padding: '14px 16px', background: accentColor, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {member?.initials ?? '?'}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{member?.name ?? 'Board Review'}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{member?.role ?? ''}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => { deactivateBoardMode(); setActive(false); setIsOpen(false); }}
                style={{ padding: 6, borderRadius: 3, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)' }} title="Exit review mode">
                <LogOut style={{ width: 13, height: 13 }} />
              </button>
              <button onClick={() => setIsOpen(false)}
                style={{ padding: 6, borderRadius: 3, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)' }}>
                <X style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>

          {/* Current page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 3, padding: '6px 10px' }}>
            <ExternalLink style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pageName}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.40)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</div>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* ── Add note ── */}
          <div style={{ padding: 16, borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12 }}>
              Leave Feedback — {pageName}
            </div>

            {/* Action type */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 6 }}>Recommendation</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {(['change', 'add', 'eliminate'] as const).map(t => {
                  const c = ACTION_COLORS[t];
                  return (
                    <button key={t} onClick={() => setActionType(t)}
                      style={{ padding: '7px 4px', fontSize: 11, fontWeight: 700, borderRadius: 3, border: `2px solid ${actionType === t ? c.border : '#E5E7EB'}`, background: actionType === t ? c.bg : 'white', color: actionType === t ? c.text : '#9CA3AF', cursor: 'pointer' }}>
                      {t === 'add' ? '+ Add' : t === 'eliminate' ? '✕ Remove' : '↻ Change'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Area */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 6 }}>Area</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {AREAS.map(a => (
                  <button key={a} onClick={() => setArea(a)}
                    style={{ padding: '4px 8px', fontSize: 10, fontWeight: 700, borderRadius: 3, border: `1px solid ${area === a ? accentColor : '#E5E7EB'}`, background: area === a ? accentColor : 'white', color: area === a ? 'white' : '#9CA3AF', cursor: 'pointer' }}>
                    {AREA_LABELS[a]}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 6 }}>Priority</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['critical', 'important', 'nice_to_have'] as const).map(p => {
                  const pc = PRIORITY_COLORS[p];
                  return (
                    <button key={p} onClick={() => setPriority(p)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '6px 4px', fontSize: 10, fontWeight: 700, borderRadius: 3, border: `1px solid ${priority === p ? pc.dot : '#E5E7EB'}`, background: priority === p ? pc.dot + '18' : 'white', color: priority === p ? pc.dot : '#9CA3AF', cursor: 'pointer' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: priority === p ? pc.dot : '#E5E7EB', flexShrink: 0 }} />
                      {pc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note text */}
            <textarea
              rows={4}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Be specific. What exactly should change, be added, or removed? What outcome does this serve?"
              style={{ width: '100%', fontSize: 12, padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 3, resize: 'none', outline: 'none', fontFamily: 'inherit', marginBottom: 10, boxSizing: 'border-box', color: '#374151' }}
            />

            <button
              onClick={() => submitMutation.mutate()}
              disabled={!note.trim() || submitMutation.isPending}
              style={{ width: '100%', padding: '9px', fontSize: 12, fontWeight: 700, borderRadius: 3, border: 'none', background: accentColor, color: 'white', cursor: note.trim() ? 'pointer' : 'not-allowed', opacity: note.trim() ? 1 : 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {submitMutation.isPending ? <RefreshCw style={{ width: 13, height: 13 }} /> : <MessageSquare style={{ width: 13, height: 13 }} />}
              Submit Feedback
            </button>
          </div>

          {/* ── Notes on this page ── */}
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12 }}>
              Feedback on This Page {pageNotes.length > 0 && `(${pageNotes.length})`}
            </div>

            {pageNotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#D1D5DB' }}>No feedback here yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pageNotes.map((item: any) => {
                  const ac  = ACTION_COLORS[item.actionType] ?? ACTION_COLORS.change;
                  const pc  = PRIORITY_COLORS[item.priority] ?? PRIORITY_COLORS.important;
                  const sc  = STATUS_COLORS[item.status] ?? STATUS_COLORS.pending;
                  const m   = BOARD_MEMBERS.find(b => b.id === item.boardMember);
                  return (
                    <div key={item.id} style={{ border: '1px solid #F3F4F6', borderRadius: 4, padding: 12 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                        {m && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 16, height: 16, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                              {m.initials}
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: m.color }}>{m.name}</span>
                          </div>
                        )}
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: ac.bg, color: ac.text, border: `1px solid ${ac.border}` }}>
                          {item.actionType === 'eliminate' ? 'Remove' : item.actionType}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: sc.bg, color: sc.text }}>
                          {item.status.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: 10, color: '#9CA3AF' }}>{AREA_LABELS[item.area] ?? item.area}</span>
                        <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 3, color: pc.dot }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: pc.dot }} />
                          {pc.label}
                        </span>
                      </div>

                      <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0 }}>{item.feedback}</p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        <span style={{ fontSize: 10, color: '#D1D5DB' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                        <button onClick={() => deleteMutation.mutate(item.id)}
                          style={{ padding: 4, borderRadius: 3, border: 'none', background: 'transparent', cursor: 'pointer', opacity: 0.4 }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}>
                          <Trash2 style={{ width: 12, height: 12, color: '#EF4444' }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <a href="/board-admin"
              style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, fontWeight: 700, padding: '8px', borderRadius: 3, border: '1px solid #E5E7EB', color: '#9CA3AF', textDecoration: 'none' }}>
              <ExternalLink style={{ width: 11, height: 11 }} />
              View All Board Feedback
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
