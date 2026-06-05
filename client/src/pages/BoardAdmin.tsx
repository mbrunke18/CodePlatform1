import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Filter, RefreshCw, MessageSquare, CheckCircle2, Clock,
  XCircle, Flag, ChevronDown, Pencil, Trash2, User,
  BarChart3, TrendingUp, AlertCircle, ArrowUpRight, ExternalLink
} from 'lucide-react';
import { BOARD_MEMBERS } from '@/components/BoardReviewPanel';
import { Button } from '@/components/ui/button';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';

const ACTION_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  change:    { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B', label: 'Change' },
  add:       { bg: '#D1FAE5', text: '#065F46', border: '#10B981', label: 'Add' },
  eliminate: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444', label: 'Eliminate' },
};
const PRIORITY_COLORS: Record<string, { dot: string; label: string }> = {
  critical:     { dot: '#EF4444', label: 'Critical' },
  important:    { dot: GOLD,      label: 'Important' },
  nice_to_have: { dot: '#9CA3AF', label: 'Nice to Have' },
};
const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  pending:     { bg: '#F3F4F6', text: '#6B7280', icon: Clock, label: 'Pending' },
  in_review:   { bg: '#FEF3C7', text: '#92400E', icon: RefreshCw, label: 'In Review' },
  planned:     { bg: '#DBEAFE', text: '#1D4ED8', icon: Flag, label: 'Planned' },
  implemented: { bg: '#D1FAE5', text: '#065F46', icon: CheckCircle2, label: 'Implemented' },
  declined:    { bg: '#FEE2E2', text: '#991B1B', icon: XCircle, label: 'Declined' },
};
const AREA_LABELS: Record<string, string> = {
  design: 'Design', layout: 'Layout', messaging: 'Messaging',
  feature: 'Feature', navigation: 'Navigation', content: 'Content', data: 'Data',
};
const ALL_STATUSES = Object.keys(STATUS_CONFIG);

function FeedbackCard({ item, onStatusChange, onNoteChange, onDelete }: {
  item: any;
  onStatusChange: (id: string, status: string) => void;
  onNoteChange: (id: string, note: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item.founderNote ?? '');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const member = BOARD_MEMBERS.find(m => m.id === item.boardMember);
  const ac = ACTION_COLORS[item.actionType] ?? ACTION_COLORS.change;
  const pc = PRIORITY_COLORS[item.priority] ?? PRIORITY_COLORS.important;
  const sc = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = sc.icon;

  return (
    <div className="bg-white border border-gray-100 rounded-sm p-4 shadow-sm">
      {/* ── Top row ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Member */}
          {member && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: member.color, color: 'white' }}>
                {member.initials}
              </div>
              <span className="text-xs font-bold" style={{ color: member.color }}>{member.name}</span>
            </div>
          )}

          {/* Action type */}
          <span className="text-xs font-bold px-2 py-0.5 rounded-sm capitalize"
            style={{ background: ac.bg, color: ac.text, border: `1px solid ${ac.border}` }}>
            {ac.label}
          </span>

          {/* Area */}
          <span className="text-xs text-gray-500">{AREA_LABELS[item.area] ?? item.area}</span>

          {/* Priority */}
          <span className="flex items-center gap-1 text-xs" style={{ color: pc.dot }}>
            <span className="w-2 h-2 rounded-full" style={{ background: pc.dot }} />
            {pc.label}
          </span>
        </div>

        {/* Status selector */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-bold border transition-all"
            style={{ background: sc.bg, color: sc.text, borderColor: sc.text + '30' }}
          >
            <StatusIcon className="h-3 w-3" />
            {sc.label}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showStatusMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-sm shadow-lg z-10 w-36 overflow-hidden">
              {ALL_STATUSES.map(s => {
                const c = STATUS_CONFIG[s];
                const Icon = c.icon;
                return (
                  <button
                    key={s}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-gray-50 transition-colors text-left"
                    style={{ color: c.text }}
                    onClick={() => { onStatusChange(item.id, s); setShowStatusMenu(false); }}
                  >
                    <Icon className="h-3 w-3" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Page info ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-2">
        <a href={item.pageUrl} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <ExternalLink className="h-3 w-3" />
          <span className="font-medium">{item.pageName}</span>
          <span className="text-gray-300 font-mono">{item.pageUrl}</span>
        </a>
      </div>

      {/* ── Feedback text ───────────────────────────────────────────────── */}
      <p className="text-sm text-gray-800 leading-relaxed mb-3 font-medium">{item.feedback}</p>

      {/* ── Founder note ────────────────────────────────────────────────── */}
      {editingNote ? (
        <div className="border-t border-gray-50 pt-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Founder Note</div>
          <textarea
            className="w-full text-xs p-2 border border-gray-200 rounded-sm resize-none focus:outline-none focus:border-gray-400"
            rows={2}
            placeholder="Your response or planning note…"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-1.5">
            <button onClick={() => setEditingNote(false)} className="text-xs text-gray-400">Cancel</button>
            <button
              onClick={() => { onNoteChange(item.id, noteText); setEditingNote(false); }}
              className="text-xs font-bold px-3 py-1 rounded-sm"
              style={{ background: NAVY, color: 'white' }}
            >
              Save Note
            </button>
          </div>
        </div>
      ) : item.founderNote ? (
        <div className="border-t border-gray-50 pt-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Founder Note</div>
              <p className="text-xs text-gray-600 italic">{item.founderNote}</p>
            </div>
            <button onClick={() => setEditingNote(true)} className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
              <Pencil className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : null}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span className="text-[10px] text-gray-300">
          {new Date(item.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </span>
        <div className="flex items-center gap-1">
          {!item.founderNote && !editingNote && (
            <button
              onClick={() => setEditingNote(true)}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 px-2 py-1 rounded-sm hover:bg-gray-50 transition-colors"
            >
              <Pencil className="h-3 w-3" />
              Add Note
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-300 hover:text-red-400 p-1 rounded-sm hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BoardAdmin() {
  const { toast } = useToast();
  const [filterMember, setFilterMember] = useState<string>('all');
  const [filterType, setFilterType]     = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy]             = useState<'newest' | 'priority' | 'member'>('newest');
  const [activeMemberTab, setActiveMemberTab] = useState<string>('all');

  const { data: feedbackData, isLoading, refetch } = useQuery<any[]>({
    queryKey: ['/api/board/feedback'],
    queryFn: () => fetch('/api/board/feedback').then(r => r.ok ? r.json() : []),
    refetchInterval: 30000,
  });
  const allFeedback: any[] = Array.isArray(feedbackData) ? feedbackData : [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest('PATCH', `/api/board/feedback/${id}`, { status }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/board/feedback'] }),
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, founderNote }: { id: string; founderNote: string }) =>
      apiRequest('PATCH', `/api/board/feedback/${id}`, { founderNote }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/board/feedback'] });
      toast({ title: 'Note saved' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/board/feedback/${id}`, {}).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/board/feedback'] });
      toast({ title: 'Feedback deleted' });
    },
  });

  // ── Summary stats ──────────────────────────────────────────────────────────
  const total = allFeedback.length;
  const byCritical = allFeedback.filter(f => f.priority === 'critical').length;
  const byType = {
    change: allFeedback.filter(f => f.actionType === 'change').length,
    add: allFeedback.filter(f => f.actionType === 'add').length,
    eliminate: allFeedback.filter(f => f.actionType === 'eliminate').length,
  };
  const byStatus = {
    pending: allFeedback.filter(f => f.status === 'pending').length,
    planned: allFeedback.filter(f => f.status === 'planned').length,
    implemented: allFeedback.filter(f => f.status === 'implemented').length,
  };

  // ── Filtered + sorted list ─────────────────────────────────────────────────
  let filtered = allFeedback.filter(f => {
    if (filterMember !== 'all' && f.boardMember !== filterMember) return false;
    if (filterType !== 'all' && f.actionType !== filterType) return false;
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    if (filterPriority !== 'all' && f.priority !== filterPriority) return false;
    if (activeMemberTab !== 'all' && f.boardMember !== activeMemberTab) return false;
    return true;
  });

  filtered = filtered.sort((a, b) => {
    if (sortBy === 'priority') {
      const order = { critical: 0, important: 1, nice_to_have: 2 };
      return (order[a.priority as keyof typeof order] ?? 3) - (order[b.priority as keyof typeof order] ?? 3);
    }
    if (sortBy === 'member') return a.boardMember.localeCompare(b.boardMember);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Per-member counts
  const memberCounts = BOARD_MEMBERS.reduce((acc, m) => {
    acc[m.id] = allFeedback.filter(f => f.boardMember === m.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                — FOUNDER ONLY · CONFIDENTIAL
              </div>
              <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Board Feedback Dashboard</h1>
              <p className="text-gray-400 text-sm mt-0.5">
                Review, triage, and respond to all board recommendations before lock and ship.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/board-review"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-sm border transition-colors hover:bg-gray-50"
                style={{ borderColor: NAVY + '30', color: NAVY }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Board Portal
              </a>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="text-xs gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>

          {/* ── Stats row ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-7 gap-4 mt-5">
            {[
              { label: 'Total Items', val: total, color: NAVY },
              { label: 'Critical', val: byCritical, color: '#EF4444' },
              { label: 'Change', val: byType.change, color: '#D97706' },
              { label: 'Add', val: byType.add, color: TEAL },
              { label: 'Eliminate', val: byType.eliminate, color: '#EF4444' },
              { label: 'Planned', val: byStatus.planned, color: '#1D4ED8' },
              { label: 'Implemented', val: byStatus.implemented, color: TEAL },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex gap-6">

          {/* ── Left sidebar: member tabs ────────────────────────────────────── */}
          <div className="w-48 flex-shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Board Members</div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveMemberTab('all')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-bold transition-all text-left"
                style={activeMemberTab === 'all'
                  ? { background: NAVY, color: 'white' }
                  : { color: '#6B7280', background: 'transparent' }}
              >
                <span>All Members</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${activeMemberTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {total}
                </span>
              </button>

              {BOARD_MEMBERS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMemberTab(m.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-bold transition-all text-left"
                  style={activeMemberTab === m.id
                    ? { background: m.color, color: 'white' }
                    : { color: '#6B7280', background: 'transparent' }}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] flex-shrink-0"
                    style={{ background: activeMemberTab === m.id ? 'rgba(255,255,255,0.3)' : m.color, color: 'white' }}>
                    {m.initials}
                  </div>
                  <span className="flex-1 truncate">{m.name.split(' ')[0]}</span>
                  {memberCounts[m.id] > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm flex-shrink-0 ${activeMemberTab === m.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {memberCounts[m.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Main content area ────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Filter className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />

              {/* Type filter */}
              <select
                className="text-xs px-2 py-1.5 border border-gray-200 rounded-sm bg-white text-gray-600 focus:outline-none"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="change">Change</option>
                <option value="add">Add</option>
                <option value="eliminate">Eliminate</option>
              </select>

              {/* Status filter */}
              <select
                className="text-xs px-2 py-1.5 border border-gray-200 rounded-sm bg-white text-gray-600 focus:outline-none"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>

              {/* Priority filter */}
              <select
                className="text-xs px-2 py-1.5 border border-gray-200 rounded-sm bg-white text-gray-600 focus:outline-none"
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="important">Important</option>
                <option value="nice_to_have">Nice to Have</option>
              </select>

              {/* Sort */}
              <select
                className="text-xs px-2 py-1.5 border border-gray-200 rounded-sm bg-white text-gray-600 focus:outline-none ml-auto"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
              >
                <option value="newest">Sort: Newest</option>
                <option value="priority">Sort: Priority</option>
                <option value="member">Sort: Member</option>
              </select>

              <span className="text-xs text-gray-400 font-bold">
                {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Feedback list */}
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-white rounded-sm border border-gray-100" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-100 rounded-sm">
                <MessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                <div className="text-sm font-bold text-gray-400 mb-1">No feedback yet</div>
                <div className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
                  Share the board review portal with your advisors to start collecting feedback.
                </div>
                <a
                  href="/board-review"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-sm"
                  style={{ background: NAVY, color: 'white' }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Board Portal
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item: any) => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    onStatusChange={(id, status) => updateStatusMutation.mutate({ id, status })}
                    onNoteChange={(id, founderNote) => updateNoteMutation.mutate({ id, founderNote })}
                    onDelete={(id) => deleteMutation.mutate(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
