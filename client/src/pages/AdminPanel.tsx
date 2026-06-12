import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Trash2, Plus, Shield, Users, Mail, AlertCircle, Loader2, Check, Link2, Copy, Send, Share2, Briefcase, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";

function formatDate(val: string | null | undefined) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initials(first?: string | null, last?: string | null, email?: string | null) {
  if (first || last) return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
  return (email?.[0] ?? "?").toUpperCase();
}

interface AdminUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  organizationName: string | null;
  accessLevel: string | null;
  lastLoginAt: string | null;
  createdAt: string | null;
}

interface AllowedEmail {
  id: string;
  email: string;
  note: string | null;
  addedAt: string;
}

export default function AdminPanel() {
  const { user, isLoading: authLoading } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newNote, setNewNote] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  // ── Link generator state ──────────────────────────────────────────────────
  const [linkName, setLinkName] = useState("");
  const [linkEmail, setLinkEmail] = useState("");
  const [linkHours, setLinkHours] = useState(72);
  const [generatedLink, setGeneratedLink] = useState<{ url: string; expiresAt: string; emailSent?: boolean } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // ── Group link state ───────────────────────────────────────────────────────
  const [groupLinkDays, setGroupLinkDays] = useState(7);
  const [generatedGroupLink, setGeneratedGroupLink] = useState<{ url: string; linkExpiresAt: string; linkDays: number; sessionHours: number } | null>(null);
  const [groupLinkCopied, setGroupLinkCopied] = useState(false);

  const { data: rawUsers, isLoading: usersLoading, error: usersError } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });
  const userList: AdminUser[] = rawUsers ?? [];

  const { data: rawAllowlist, isLoading: allowlistLoading } = useQuery<AllowedEmail[]>({
    queryKey: ["/api/admin/allowlist"],
  });
  const allowlist: AllowedEmail[] = rawAllowlist ?? [];

  interface PartnerApplication {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    title: string;
    triggerDomain: string | null;
    message: string | null;
    status: string;
    createdAt: string | null;
  }

  const { data: rawPartnerApps, isLoading: partnerAppsLoading } = useQuery<PartnerApplication[]>({
    queryKey: ["/api/founding-partner/applications"],
  });
  const partnerApps: PartnerApplication[] = rawPartnerApps ?? [];

  const { data: partnerStats } = useQuery<{ total: number; filled: number; remaining: number }>({
    queryKey: ["/api/founding-partner/stats"],
  });

  interface InboundLead {
    id: string;
    type: 'contact' | 'request_access' | 'trial';
    typeLabel: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    title: string;
    detail: string | null;
    status: string;
    statusLabel: string;
    createdAt: string | null;
  }

  const { data: rawLeads, isLoading: leadsLoading } = useQuery<InboundLead[]>({
    queryKey: ["/api/admin/inbound-leads"],
    refetchInterval: 30000,
  });
  const leads: InboundLead[] = rawLeads ?? [];

  const updatePartnerStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/founding-partner/applications/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/founding-partner/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/founding-partner/stats"] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setDeleteConfirm(null);
    },
  });

  const addEmail = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/allowlist", { email: newEmail, note: newNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/allowlist"] });
      setNewEmail("");
      setNewNote("");
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    },
  });

  const removeEmail = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/allowlist/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/allowlist"] }),
  });

  const generateLink = useMutation({
    mutationFn: ({ sendEmail }: { sendEmail: boolean }) =>
      apiRequest("POST", "/api/admin/generate-demo-link", {
        name: linkName.trim(),
        email: linkEmail.trim(),
        hours: linkHours,
        sendEmail,
      }).then(res => res.json()),
    onSuccess: (data: any) => {
      setGeneratedLink({ url: data.url, expiresAt: data.expiresAt, emailSent: data.emailSent });
    },
  });

  const generateGroupLink = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/admin/generate-group-link", {
        linkDays: groupLinkDays,
        sessionHours: 72,
      }).then(res => res.json()),
    onSuccess: (data: any) => {
      setGeneratedGroupLink(data);
    },
  });

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: NAVY }} />
      </div>
    );
  }

  if (usersError) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
        <div style={{ textAlign: "center", color: "#DC2626" }}>
          <AlertCircle size={32} style={{ marginBottom: 12 }} />
          <p style={{ fontWeight: 600 }}>Access denied. This page is for platform admins only.</p>
          <a href="/mission-control" style={{ color: NAVY, fontSize: 14 }}>← Return to Mission Control</a>
        </div>
      </div>
    );
  }

  const adminEmail = (user as any)?.email ?? "";

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "system-ui, sans-serif" }}>
      <h1 className="sr-only">User Administration — Readiness OS</h1>
      {/* Header */}
      <div style={{ background: NAVY, padding: "1.25rem 2rem", display: "flex", alignItems: "center", gap: 12 }}>
        <Shield size={20} color={GOLD} />
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.02em" }}>
          VaughnMartin · Platform Admin
        </span>
        <span style={{ marginLeft: "auto", color: "#9CA3AF", fontSize: "0.8125rem" }}>{adminEmail}</span>
        <a href="/mission-control" style={{ color: GOLD, fontSize: "0.8125rem", textDecoration: "none", fontWeight: 600, marginLeft: 16 }}>
          ← Mission Control
        </a>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── Users Table ─────────────────────────────────── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <Users size={18} color={NAVY} />
            <h2 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: NAVY }}>
              Registered Users
            </h2>
            <span style={{
              marginLeft: 8, background: "#E8E4DC", color: NAVY,
              fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10,
            }}>{userList.length}</span>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderRadius: 4, overflow: "hidden" }}>
            {usersLoading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
                <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : userList.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>
                No registered users yet.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #E8E4DC", background: "#F8F7F4" }}>
                    {["User", "Organization", "Access Level", "Joined", "Last Login", ""].map(h => (
                      <th key={h} style={{ padding: "0.625rem 1rem", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: "0.75rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: i < userList.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: NAVY, color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                          }}>
                            {initials(u.firstName, u.lastName, u.email)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: NAVY }}>
                              {u.firstName || u.lastName ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "—"}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{u.email ?? "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{u.organizationName ?? "—"}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span style={{
                          display: "inline-block", padding: "2px 8px", borderRadius: 3,
                          fontSize: "0.7rem", fontWeight: 700,
                          background: u.accessLevel === "admin" ? "#EFF6FF" : "#F3F4F6",
                          color: u.accessLevel === "admin" ? "#1D4ED8" : "#6B7280",
                          textTransform: "uppercase", letterSpacing: "0.04em",
                        }}>
                          {u.accessLevel ?? "basic"}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6B7280", fontSize: "0.8125rem" }}>{formatDate(u.createdAt)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6B7280", fontSize: "0.8125rem" }}>{formatDate(u.lastLoginAt)}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {deleteConfirm === u.id ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => deleteUser.mutate(u.id)}
                              disabled={deleteUser.isPending}
                              style={{
                                padding: "4px 10px", background: "#DC2626", color: "#fff",
                                border: "none", borderRadius: 3, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                              }}
                            >
                              {deleteUser.isPending ? "…" : "Confirm"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              style={{ padding: "4px 10px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 3, fontSize: "0.75rem", cursor: "pointer" }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(u.id)}
                            title="Delete user"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4, borderRadius: 3, display: "flex", alignItems: "center" }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Access Link Generator ───────────────────────── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <Link2 size={18} color={NAVY} />
            <h2 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: NAVY }}>
              Generate Access Link
            </h2>
            <span style={{ marginLeft: 8, background: "#FEF3C7", color: "#92400E", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: "0.04em" }}>
              72 HR
            </span>
          </div>
          <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6 }}>
            Generate a signed access link for any prospect. The link grants full platform access for the chosen duration.
            You can copy and share it yourself, or send it directly to their inbox.
          </p>
          <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderRadius: 4, padding: "1.5rem" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <input
                type="text"
                placeholder="Full name"
                value={linkName}
                onChange={e => { setLinkName(e.target.value); setGeneratedLink(null); }}
                style={{ flex: "1 1 180px", padding: "0.5rem 0.75rem", border: "1px solid #D1D5DB", borderRadius: 4, fontSize: "0.875rem", outline: "none", color: NAVY }}
              />
              <input
                type="email"
                placeholder="email@company.com"
                value={linkEmail}
                onChange={e => { setLinkEmail(e.target.value); setGeneratedLink(null); }}
                style={{ flex: "1 1 200px", padding: "0.5rem 0.75rem", border: "1px solid #D1D5DB", borderRadius: 4, fontSize: "0.875rem", outline: "none", color: NAVY }}
              />
              <select
                value={linkHours}
                onChange={e => { setLinkHours(Number(e.target.value)); setGeneratedLink(null); }}
                style={{ padding: "0.5rem 0.75rem", border: "1px solid #D1D5DB", borderRadius: 4, fontSize: "0.875rem", color: NAVY, background: "#fff", cursor: "pointer" }}
              >
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>72 hours</option>
                <option value={120}>5 days</option>
                <option value={168}>7 days</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => generateLink.mutate({ sendEmail: false })}
                disabled={!linkName.trim() || !linkEmail.trim() || generateLink.isPending}
                style={{
                  padding: "0.5rem 1.25rem", background: NAVY, color: "#fff",
                  border: "none", borderRadius: 4, fontSize: "0.875rem", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  opacity: (!linkName.trim() || !linkEmail.trim()) ? 0.5 : 1,
                }}
              >
                {generateLink.isPending ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Link2 size={14} />}
                Generate Link
              </button>
              <button
                onClick={() => generateLink.mutate({ sendEmail: true })}
                disabled={!linkName.trim() || !linkEmail.trim() || generateLink.isPending}
                style={{
                  padding: "0.5rem 1.25rem", background: "#2B8A6E", color: "#fff",
                  border: "none", borderRadius: 4, fontSize: "0.875rem", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  opacity: (!linkName.trim() || !linkEmail.trim()) ? 0.5 : 1,
                }}
              >
                {generateLink.isPending ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={14} />}
                Generate &amp; Email
              </button>
            </div>
            {generateLink.isError && (
              <p style={{ margin: "0.75rem 0 0", fontSize: "0.8125rem", color: "#DC2626" }}>
                {(generateLink.error as any)?.message ?? "Failed to generate link"}
              </p>
            )}
            {generatedLink && (
              <div style={{ marginTop: "1.25rem", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 4, padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Check size={15} color="#059669" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#065F46" }}>
                    Link generated
                    {generatedLink.emailSent ? " & emailed to " + linkEmail : " — copy and share below"}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#6B7280" }}>
                    Expires {new Date(generatedLink.expiresAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    readOnly
                    value={generatedLink.url}
                    style={{
                      flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #D1FAE5",
                      borderRadius: 4, fontSize: "0.8rem", color: NAVY,
                      background: "#fff", fontFamily: "monospace", outline: "none",
                    }}
                    onFocus={e => e.target.select()}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink.url);
                      setLinkCopied(true);
                      setTimeout(() => setLinkCopied(false), 2000);
                    }}
                    style={{
                      padding: "0.5rem 1rem", background: linkCopied ? "#059669" : NAVY,
                      color: "#fff", border: "none", borderRadius: 4, fontSize: "0.8125rem",
                      fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center",
                      gap: 6, transition: "background 0.2s", whiteSpace: "nowrap",
                    }}
                  >
                    {linkCopied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Shareable Group Link ────────────────────────── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <Share2 size={18} color={NAVY} />
            <h2 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: NAVY }}>
              Shareable Group Link
            </h2>
            <span style={{ marginLeft: 8, background: "#EFF6FF", color: "#1D4ED8", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: "0.04em" }}>
              ADMIN ONLY
            </span>
          </div>
          <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6 }}>
            One link you can send to multiple people. Each person who clicks it gets their own
            72-hour full access session — no name or email required from them.
            Only you can generate this link.
          </p>
          <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderRadius: 4, padding: "1.5rem" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
              <label style={{ fontSize: "0.875rem", color: NAVY, fontWeight: 600, whiteSpace: "nowrap" }}>
                Link stays active for
              </label>
              <select
                value={groupLinkDays}
                onChange={e => { setGroupLinkDays(Number(e.target.value)); setGeneratedGroupLink(null); }}
                style={{ padding: "0.5rem 0.75rem", border: "1px solid #D1D5DB", borderRadius: 4, fontSize: "0.875rem", color: NAVY, background: "#fff", cursor: "pointer" }}
              >
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
              <span style={{ fontSize: "0.8125rem", color: "#6B7280" }}>· Each session: 72 hours</span>
            </div>
            <button
              onClick={() => generateGroupLink.mutate()}
              disabled={generateGroupLink.isPending}
              style={{
                padding: "0.5rem 1.25rem", background: NAVY, color: "#fff",
                border: "none", borderRadius: 4, fontSize: "0.875rem", fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {generateGroupLink.isPending
                ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Generating…</>
                : <><Share2 size={14} /> Generate Shareable Link</>}
            </button>
            {generateGroupLink.isError && (
              <p style={{ margin: "0.75rem 0 0", fontSize: "0.8125rem", color: "#DC2626" }}>
                {(generateGroupLink.error as any)?.message ?? "Failed to generate link"}
              </p>
            )}
            {generatedGroupLink && (
              <div style={{ marginTop: "1.25rem", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 4, padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Check size={15} color="#1D4ED8" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1E40AF" }}>
                    Shareable link ready — anyone with this link gets 72-hour access
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#6B7280" }}>
                    Link expires {new Date(generatedGroupLink.linkExpiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    readOnly
                    value={generatedGroupLink.url}
                    style={{
                      flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #BFDBFE",
                      borderRadius: 4, fontSize: "0.8rem", color: NAVY,
                      background: "#fff", fontFamily: "monospace", outline: "none",
                    }}
                    onFocus={e => e.target.select()}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedGroupLink.url);
                      setGroupLinkCopied(true);
                      setTimeout(() => setGroupLinkCopied(false), 2000);
                    }}
                    style={{
                      padding: "0.5rem 1rem", background: groupLinkCopied ? "#1D4ED8" : NAVY,
                      color: "#fff", border: "none", borderRadius: 4, fontSize: "0.8125rem",
                      fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center",
                      gap: 6, transition: "background 0.2s", whiteSpace: "nowrap",
                    }}
                  >
                    {groupLinkCopied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
                <p style={{ margin: "0.625rem 0 0", fontSize: "0.75rem", color: "#1E40AF", lineHeight: 1.5 }}>
                  Send this link via DM, email, or text. Each recipient clicks once and is in — no sign-up.
                  Generate a new link at any time to retire this one.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Allowlist ────────────────────────────────────── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <Mail size={18} color={NAVY} />
            <h2 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: NAVY }}>
              Access Allowlist
            </h2>
            <span style={{ marginLeft: 8, background: "#E8E4DC", color: NAVY, fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
              {allowlist.length}
            </span>
          </div>
          <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6 }}>
            Only emails on this list (plus your platform admin email) can log in.
            Remove an email here to revoke access — then delete the user account above if they already have one.
          </p>

          {/* Add email form */}
          <div style={{
            background: "#fff", border: "1px solid #E8E4DC", borderRadius: 4,
            padding: "1.25rem", marginBottom: "1rem",
          }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="email@company.com"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                style={{
                  flex: "1 1 200px", padding: "0.5rem 0.75rem",
                  border: "1px solid #D1D5DB", borderRadius: 4,
                  fontSize: "0.875rem", outline: "none", color: NAVY,
                }}
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                style={{
                  flex: "1 1 160px", padding: "0.5rem 0.75rem",
                  border: "1px solid #D1D5DB", borderRadius: 4,
                  fontSize: "0.875rem", outline: "none", color: NAVY,
                }}
              />
              <button
                onClick={() => addEmail.mutate()}
                disabled={!newEmail || addEmail.isPending}
                style={{
                  padding: "0.5rem 1.25rem",
                  background: addSuccess ? "#059669" : NAVY,
                  color: "#fff", border: "none", borderRadius: 4,
                  fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "background 0.2s",
                }}
              >
                {addSuccess ? <><Check size={14} /> Added</> : <><Plus size={14} /> Add Email</>}
              </button>
            </div>
            {addEmail.isError && (
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.8125rem", color: "#DC2626" }}>
                {(addEmail.error as any)?.message ?? "Failed to add email"}
              </p>
            )}
          </div>

          {/* Allowlist table */}
          <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderRadius: 4, overflow: "hidden" }}>
            {allowlistLoading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
                <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : allowlist.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>
                No emails on the allowlist yet. Add one above.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #E8E4DC", background: "#F8F7F4" }}>
                    {["Email", "Note", "Added", ""].map(h => (
                      <th key={h} style={{ padding: "0.625rem 1rem", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: "0.75rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allowlist.map((entry, i) => (
                    <tr key={entry.id} style={{ borderBottom: i < allowlist.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <td style={{ padding: "0.75rem 1rem", color: NAVY, fontWeight: 500 }}>{entry.email}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>{entry.note ?? "—"}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6B7280", fontSize: "0.8125rem" }}>{formatDate(entry.addedAt)}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <button
                          onClick={() => removeEmail.mutate(entry.id)}
                          disabled={removeEmail.isPending}
                          title="Remove from allowlist"
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4, borderRadius: 3, display: "flex", alignItems: "center" }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#9CA3AF", lineHeight: 1.6 }}>
            Your platform admin email (<strong>{adminEmail}</strong>) always has access regardless of this list.
            To revoke access fully: remove the email above, then delete their user account in the table above.
          </p>
        </div>

        {/* ── Founding Partner Applications ────────────────── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <Briefcase size={18} color={NAVY} />
            <h2 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: NAVY }}>
              Founding Partner Applications
            </h2>
            {partnerStats && (
              <span style={{ marginLeft: 8, background: "#E8E4DC", color: NAVY, fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                {partnerStats.filled} / {partnerStats.total} Accepted
              </span>
            )}
            {partnerStats && partnerStats.remaining > 0 && (
              <span style={{ background: "rgba(201,168,76,0.12)", color: "#92670A", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: "0.04em" }}>
                {partnerStats.remaining} REMAINING
              </span>
            )}
            {partnerStats && partnerStats.remaining === 0 && (
              <span style={{ background: "rgba(220,38,38,0.08)", color: "#DC2626", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: "0.04em" }}>
                COHORT FULL
              </span>
            )}
          </div>

          <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderRadius: 4, overflow: "hidden" }}>
            {partnerAppsLoading ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: NAVY }} />
              </div>
            ) : partnerApps.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>
                No applications yet.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #E8E4DC", background: "#F8F7F4" }}>
                    {["Applicant", "Company / Title", "Domain", "Submitted", "Status", ""].map(h => (
                      <th key={h} style={{ padding: "0.625rem 1rem", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: "0.75rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {partnerApps.map((app, i) => (
                    <tr key={app.id} style={{ borderBottom: i < partnerApps.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ fontWeight: 600, color: NAVY }}>{app.firstName} {app.lastName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{app.email}</div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ color: NAVY, fontWeight: 500 }}>{app.company}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{app.title}</div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6B7280", fontSize: "0.8125rem" }}>
                        {app.triggerDomain || "—"}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6B7280", fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                        {formatDate(app.createdAt)}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {app.status === "accepted" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(43,138,110,0.10)", color: "#2B8A6E", fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px", borderRadius: 10, letterSpacing: "0.04em" }}>
                            <CheckCircle size={11} /> ACCEPTED
                          </span>
                        )}
                        {app.status === "rejected" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(220,38,38,0.08)", color: "#DC2626", fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px", borderRadius: 10, letterSpacing: "0.04em" }}>
                            <XCircle size={11} /> REJECTED
                          </span>
                        )}
                        {app.status === "pending" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(107,114,128,0.10)", color: "#6B7280", fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px", borderRadius: 10, letterSpacing: "0.04em" }}>
                            <Clock size={11} /> PENDING
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {app.status !== "accepted" && (
                            <button
                              onClick={() => updatePartnerStatus.mutate({ id: app.id, status: "accepted" })}
                              disabled={updatePartnerStatus.isPending}
                              title="Accept"
                              style={{ background: "rgba(43,138,110,0.10)", border: "none", cursor: "pointer", color: "#2B8A6E", padding: "4px 8px", borderRadius: 3, fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}
                            >
                              <CheckCircle size={12} /> Accept
                            </button>
                          )}
                          {app.status !== "rejected" && (
                            <button
                              onClick={() => updatePartnerStatus.mutate({ id: app.id, status: "rejected" })}
                              disabled={updatePartnerStatus.isPending}
                              title="Reject"
                              style={{ background: "rgba(220,38,38,0.06)", border: "none", cursor: "pointer", color: "#DC2626", padding: "4px 8px", borderRadius: 3, fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          )}
                          {app.status !== "pending" && (
                            <button
                              onClick={() => updatePartnerStatus.mutate({ id: app.id, status: "pending" })}
                              disabled={updatePartnerStatus.isPending}
                              title="Reset to pending"
                              style={{ background: "rgba(107,114,128,0.08)", border: "none", cursor: "pointer", color: "#6B7280", padding: "4px 8px", borderRadius: 3, fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}
                            >
                              <Clock size={12} /> Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Inbound Leads ─────────────────────────────────── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <TrendingUp size={18} color={NAVY} />
            <h2 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: NAVY }}>
              Inbound Leads
            </h2>
            <span style={{
              marginLeft: 8, background: "#E8E4DC", color: NAVY,
              fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10,
            }}>{leads.length}</span>
            <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#9CA3AF" }}>
              Contact Form · Request Access · Trial Access · refreshes every 30s
            </span>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderRadius: 4, overflow: "hidden" }}>
            {leadsLoading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
                <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : leads.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>
                No inbound leads yet. They'll appear here as the carousel drives activity.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #E8E4DC", background: "#F8F7F4" }}>
                    {["Source", "Name & Company", "Email", "Title", "Status", "Received"].map(h => (
                      <th key={h} style={{ padding: "0.625rem 1rem", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: "0.75rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => {
                    const typeBg = lead.type === 'contact'
                      ? { bg: "rgba(201,168,76,0.12)", color: "#8a6c1e" }
                      : lead.type === 'request_access'
                      ? { bg: "rgba(10,15,46,0.08)", color: NAVY }
                      : { bg: "rgba(43,138,110,0.10)", color: "#2B8A6E" };

                    const statusBg = lead.status === 'activated'
                      ? { bg: "rgba(43,138,110,0.10)", color: "#2B8A6E" }
                      : lead.status === 'expired'
                      ? { bg: "rgba(220,38,38,0.08)", color: "#DC2626" }
                      : { bg: "rgba(107,114,128,0.10)", color: "#6B7280" };

                    return (
                      <tr key={lead.id} style={{ borderBottom: i < leads.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span style={{
                            display: "inline-block", padding: "2px 8px", borderRadius: 3,
                            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                            background: typeBg.bg, color: typeBg.color,
                          }}>
                            {lead.typeLabel}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <div style={{ fontWeight: 600, color: NAVY }}>
                            {`${lead.firstName} ${lead.lastName}`.trim() || "—"}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{lead.company}</div>
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <a href={`mailto:${lead.email}`} style={{ color: NAVY, textDecoration: "none", fontWeight: 500 }}>
                            {lead.email}
                          </a>
                        </td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{lead.title || "—"}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span style={{
                            display: "inline-block", padding: "2px 8px", borderRadius: 3,
                            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                            background: statusBg.bg, color: statusBg.color,
                          }}>
                            {lead.statusLabel}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem", color: "#6B7280", fontSize: "0.8125rem" }}>
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
