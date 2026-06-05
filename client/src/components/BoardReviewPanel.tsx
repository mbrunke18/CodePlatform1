import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  X, Pencil, ChevronRight, CheckCircle2, AlertCircle,
  Trash2, MessageSquare, Plus, RefreshCw, LogOut, ExternalLink
} from 'lucide-react';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';

// ─── Board member definitions ────────────────────────────────────────────────
export const BOARD_MEMBERS = [
  { id: 'gates',    name: 'Bill Gates',      initials: 'BG', color: '#0A0F2E', bgLight: '#EEF0F8', role: 'Technology & Global Scale' },
  { id: 'buffett',  name: 'Warren Buffett',  initials: 'WB', color: '#1B4332', bgLight: '#ECFDF5', role: 'Risk & Capital Allocation' },
  { id: 'blakely',  name: 'Sara Blakely',   initials: 'SB', color: '#9D174D', bgLight: '#FDF2F8', role: 'Founder Experience & Go-to-Market' },
  { id: 'branson',  name: 'Richard Branson', initials: 'RB', color: '#4C1D95', bgLight: '#F5F3FF', role: 'Brand & Enterprise Culture' },
  { id: 'obama',    name: 'Barack Obama',    initials: 'BO', color: '#1E3A5F', bgLight: '#EFF6FF', role: 'Stakeholder Coordination & Trust' },
  { id: 'williams', name: 'Serena Williams', initials: 'SW', color: '#065F46', bgLight: '#ECFDF5', role: 'Performance & Resilience' },
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
  '/board-review':            'Board Review Landing',
  '/board-admin':             'Board Feedback Admin',
  '/founder-story':           'Founder Story',
};

function getPageName(path: string): string {
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];
  // Try prefix match
  for (const [prefix, name] of Object.entries(PAGE_NAMES)) {
    if (prefix !== '/' && path.startsWith(prefix)) return name;
  }
  // Fallback: clean up path
  return path
    .replace(/\//g, ' / ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim() || 'Unknown Page';
}

// ─── Priority + action type colors ───────────────────────────────────────────
const ACTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  change:    { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  add:       { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  eliminate: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
};
const PRIORITY_COLORS: Record<string, { dot: string; label: string }> = {
  critical:       { dot: '#EF4444', label: 'Critical' },
  important:      { dot: GOLD,      label: 'Important' },
  nice_to_have:   { dot: '#9CA3AF', label: 'Nice to Have' },
};
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:     { bg: '#F3F4F6', text: '#6B7280' },
  in_review:   { bg: '#FEF3C7', text: '#92400E' },
  planned:     { bg: '#DBEAFE', text: '#1D4ED8' },
  implemented: { bg: '#D1FAE5', text: '#065F46' },
  declined:    { bg: '#FEE2E2', text: '#991B1B' },
};

// ─── Storage helpers ──────────────────────────────────────────────────────────
export function getBoardMember() {
  return localStorage.getItem('vm_board_member') ?? '';
}
export function isBoardMode() {
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

// ─── Feedback form state ──────────────────────────────────────────────────────
const AREAS = ['design', 'layout', 'messaging', 'feature', 'navigation', 'content', 'data'];
const AREA_LABELS: Record<string, string> = {
  design: 'Design', layout: 'Layout', messaging: 'Messaging',
  feature: 'Feature', navigation: 'Navigation', content: 'Content', data: 'Data / Numbers',
};

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function BoardReviewPanel() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(isBoardMode());
  const [memberId, setMemberId] = useState(getBoardMember());
  const { toast } = useToast();

  // Form state
  const [actionType, setActionType] = useState<'change' | 'add' | 'eliminate'>('change');
  const [area, setArea]             = useState('messaging');
  const [priority, setPriority]     = useState<'critical' | 'important' | 'nice_to_have'>('important');
  const [feedbackText, setFeedbackText] = useState('');
  const [showThisPage, setShowThisPage] = useState(true);

  // Re-check active on location change (so panel updates after navigation)
  useEffect(() => {
    setActive(isBoardMode());
    setMemberId(getBoardMember());
  }, [location]);

  const member = BOARD_MEMBERS.find(m => m.id === memberId);
  const pageName = getPageName(location);

  // Fetch feedback for the current page
  const { data: pageFeedbackData, refetch: refetchPage } = useQuery<any[]>({
    queryKey: ['/api/board/feedback', { pageUrl: location }],
    queryFn: () => fetch(`/api/board/feedback?pageUrl=${encodeURIComponent(location)}`).then(r => r.ok ? r.json() : []),
    enabled: active && isOpen,
  });
  const pageFeedback: any[] = Array.isArray(pageFeedbackData) ? pageFeedbackData : [];

  const submitMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/board/feedback', {
      boardMember: memberId,
      pageUrl: location,
      pageName,
      actionType,
      area,
      priority,
      feedback: feedbackText,
    }).then(r => r.json()),
    onSuccess: () => {
      setFeedbackText('');
      queryClient.invalidateQueries({ queryKey: ['/api/board/feedback'] });
      toast({ title: 'Feedback recorded', description: `${member?.name} — ${actionType} on ${pageName}` });
    },
    onError: () => toast({ title: 'Failed to submit', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/board/feedback/${id}`, {}).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/board/feedback'] }),
  });

  if (!active) return null;

  // ── Collapsed tab ──────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-0 z-50 flex items-center gap-2 px-4 py-3 shadow-lg rounded-l-sm transition-all hover:shadow-xl"
        style={{ background: member?.color ?? NAVY, color: 'white' }}
        title="Open Board Review Panel"
      >
        <div className="flex items-center gap-2">
          {member ? (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
              {member.initials}
            </div>
          ) : (
            <Pencil className="h-4 w-4" />
          )}
          <span className="text-xs font-bold tracking-wider uppercase writing-mode-vertical" style={{ letterSpacing: '0.1em' }}>
            Board Review
          </span>
          {pageFeedback.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
              style={{ color: member?.color ?? NAVY }}>
              {pageFeedback.length}
            </span>
          )}
        </div>
      </button>
    );
  }

  // ── Expanded drawer ────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div
        className="relative flex flex-col w-96 h-full bg-white shadow-2xl pointer-events-auto overflow-hidden"
        style={{ borderLeft: `3px solid ${member?.color ?? NAVY}` }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 p-4 border-b border-gray-100"
          style={{ background: member?.color ?? NAVY }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {member?.initials ?? '?'}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{member?.name ?? 'Not identified'}</div>
                <div className="text-[10px] text-white/60">{member?.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { deactivateBoardMode(); setActive(false); setIsOpen(false); window.location.reload(); }}
                className="p-1.5 rounded-sm hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Exit board review mode"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-sm hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Current page */}
          <div className="flex items-center gap-2 bg-white/10 rounded-sm px-3 py-2">
            <ExternalLink className="h-3 w-3 text-white/60 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{pageName}</div>
              <div className="text-[10px] text-white/50 truncate">{location}</div>
            </div>
          </div>
        </div>

        {/* ── Body (scrollable) ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Feedback Form ────────────────────────────────────────── */}
          <div className="p-4 border-b border-gray-100">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Add Feedback — {pageName}
            </div>

            {/* Action type */}
            <div className="mb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Recommendation</div>
              <div className="grid grid-cols-3 gap-1">
                {(['change', 'add', 'eliminate'] as const).map(t => {
                  const c = ACTION_COLORS[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setActionType(t)}
                      className="py-2 text-xs font-bold rounded-sm border-2 transition-all capitalize"
                      style={actionType === t
                        ? { background: c.bg, color: c.text, borderColor: c.border }
                        : { background: 'white', color: '#9CA3AF', borderColor: '#E5E7EB' }}
                    >
                      {t === 'add' ? '+ Add' : t === 'eliminate' ? '✕ Remove' : '↻ Change'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Area */}
            <div className="mb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Area</div>
              <div className="flex flex-wrap gap-1">
                {AREAS.map(a => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    className="px-2 py-1 text-[10px] font-bold rounded-sm border transition-all"
                    style={area === a
                      ? { background: NAVY, color: 'white', borderColor: NAVY }
                      : { background: 'white', color: '#9CA3AF', borderColor: '#E5E7EB' }}
                  >
                    {AREA_LABELS[a]}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="mb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Priority</div>
              <div className="flex gap-2">
                {(['critical', 'important', 'nice_to_have'] as const).map(p => {
                  const pc = PRIORITY_COLORS[p];
                  return (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold rounded-sm border transition-all flex-1 justify-center"
                      style={priority === p
                        ? { background: pc.dot + '20', color: pc.dot, borderColor: pc.dot }
                        : { background: 'white', color: '#9CA3AF', borderColor: '#E5E7EB' }}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: priority === p ? pc.dot : '#E5E7EB' }} />
                      {pc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback text */}
            <div className="mb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Notes</div>
              <textarea
                className="w-full text-xs p-3 border border-gray-200 rounded-sm resize-none focus:outline-none focus:border-gray-400 placeholder-gray-300"
                rows={4}
                placeholder="Be specific. What exactly should change, be added, or removed? What outcome does this serve?"
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                style={{ fontFamily: 'inherit' }}
              />
            </div>

            <button
              onClick={() => submitMutation.mutate()}
              disabled={!feedbackText.trim() || submitMutation.isPending}
              className="w-full py-2.5 text-xs font-bold rounded-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              style={{ background: member?.color ?? NAVY, color: 'white' }}
            >
              {submitMutation.isPending
                ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                : <MessageSquare className="h-3.5 w-3.5" />}
              Submit Feedback
            </button>
          </div>

          {/* ── This page's feedback ─────────────────────────────────── */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Feedback on This Page {pageFeedback.length > 0 && `(${pageFeedback.length})`}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowThisPage(true)}
                  className="text-[10px] px-2 py-1 rounded-sm font-bold transition-all"
                  style={showThisPage ? { background: NAVY, color: 'white' } : { color: '#9CA3AF' }}
                >
                  This Page
                </button>
                <button
                  onClick={() => setShowThisPage(false)}
                  className="text-[10px] px-2 py-1 rounded-sm font-bold transition-all"
                  style={!showThisPage ? { background: NAVY, color: 'white' } : { color: '#9CA3AF' }}
                >
                  Mine
                </button>
              </div>
            </div>

            {pageFeedback.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">
                No feedback on this page yet.{'\n'}Be the first to leave a note.
              </div>
            ) : (
              <div className="space-y-2">
                {pageFeedback
                  .filter(f => !showThisPage ? f.boardMember === memberId : true)
                  .map((item: any) => {
                    const ac = ACTION_COLORS[item.actionType] ?? ACTION_COLORS.change;
                    const pc = PRIORITY_COLORS[item.priority] ?? PRIORITY_COLORS.important;
                    const sc = STATUS_COLORS[item.status] ?? STATUS_COLORS.pending;
                    const m = BOARD_MEMBERS.find(b => b.id === item.boardMember);
                    return (
                      <div key={item.id} className="border border-gray-100 rounded-sm p-3 relative group">
                        {/* Member + action type badges */}
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          {m && (
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                                style={{ background: m.color, color: 'white' }}>
                                {m.initials}
                              </div>
                              <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.name}</span>
                            </div>
                          )}
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm capitalize"
                            style={{ background: ac.bg, color: ac.text, border: `1px solid ${ac.border}` }}>
                            {item.actionType === 'eliminate' ? 'Remove' : item.actionType}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase"
                            style={{ background: sc.bg, color: sc.text }}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Area + priority */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-gray-400 capitalize">{AREA_LABELS[item.area] ?? item.area}</span>
                          <span className="text-[10px] flex items-center gap-1" style={{ color: pc.dot }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: pc.dot }} />
                            {pc.label}
                          </span>
                        </div>

                        {/* Feedback text */}
                        <p className="text-xs text-gray-700 leading-relaxed">{item.feedback}</p>

                        {/* Founder note if present */}
                        {item.founderNote && (
                          <div className="mt-2 pt-2 border-t border-gray-50">
                            <div className="text-[10px] font-bold text-gray-400 mb-0.5">Founder Note</div>
                            <p className="text-xs text-gray-600 italic">{item.founderNote}</p>
                          </div>
                        )}

                        {/* Timestamp + delete */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-gray-300">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          {item.boardMember === memberId && (
                            <button
                              onClick={() => deleteMutation.mutate(item.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-sm hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="h-3 w-3 text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Admin link */}
            <a
              href="/board-admin"
              className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-sm border transition-all hover:bg-gray-50"
              style={{ borderColor: '#E5E7EB', color: '#9CA3AF' }}
            >
              <ExternalLink className="h-3 w-3" />
              View All Feedback (Admin)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
