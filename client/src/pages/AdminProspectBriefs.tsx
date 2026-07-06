import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail, ShieldOff, TrendingUp } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

interface Prospect {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string | null;
  enrolledAt: string | null;
  briefCount: number | null;
  lastBriefAt: string | null;
  isActive: boolean | null;
}

interface BriefSent {
  id: string;
  prospectId: string;
  triggerName: string;
  triggerDomain: string;
  playbookName: string;
  confidenceScore: number | null;
  sentAt: string | null;
  prospectName: string | null;
  prospectEmail: string | null;
  prospectCompany: string | null;
}

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

const th: React.CSSProperties = {
  padding: "10px 16px", textAlign: "left",
  fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
  textTransform: "uppercase", color: "#9CA3AF",
};
const td: React.CSSProperties = { padding: "12px 16px" };

export default function AdminProspectBriefs() {
  const [tab, setTab] = useState("prospects");

  const { data: prospects = [], isLoading: lpx } = useQuery<Prospect[]>({
    queryKey: ["/api/admin/prospect-alerts"],
  });

  const { data: briefs = [], isLoading: lbx } = useQuery<BriefSent[]>({
    queryKey: ["/api/admin/prospect-alerts/briefs"],
  });

  const deactivate = useMutation({
    mutationFn: (id: string) =>
      apiRequest("PATCH", `/api/admin/prospect-alerts/${id}/deactivate`).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/prospect-alerts"] }),
  });

  const active = prospects.filter(p => p.isActive).length;
  const totalBriefs = briefs.length;
  const last7 = briefs.filter(b => b.sentAt && Date.now() - new Date(b.sentAt).getTime() < 604800000).length;

  const stats = [
    { icon: <Users size={15} />, label: "Enrolled", value: prospects.length },
    { icon: <TrendingUp size={15} />, label: "Active", value: active },
    { icon: <Mail size={15} />, label: "Total Briefs Sent", value: totalBriefs },
    { icon: <Mail size={15} />, label: "Last 7 Days", value: last7 },
  ];

  return (
    <PageLayout>
      <div style={{ minHeight: "100vh", background: "#F0EDE4" }}>

        {/* Header */}
        <div style={{ background: NAVY, padding: "36px 48px 28px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: GOLD, marginBottom: 8, fontFamily: "monospace" }}>
              Platform Admin · Prospect Intelligence
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "Georgia, serif" }}>
              Signal Brief Monitor
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "6px 0 0", lineHeight: 1.5 }}>
              Founding Partner applicants enrolled for automated signal brief emails. Briefs fire automatically when high-confidence triggers are detected.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px", display: "flex" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: "18px 32px 18px 0", marginRight: 32, borderRight: i < 3 ? "1px solid #E8E4DC" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: GOLD }}>{s.icon}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF" }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1100, margin: "32px auto", padding: "0 48px" }}>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList style={{ background: "#fff", border: "1px solid #E8E4DC", borderRadius: 2, marginBottom: 24 }}>
              <TabsTrigger value="prospects" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Enrolled Prospects ({prospects.length})
              </TabsTrigger>
              <TabsTrigger value="briefs" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Briefs Sent ({totalBriefs})
              </TabsTrigger>
            </TabsList>

            {/* PROSPECTS TAB */}
            <TabsContent value="prospects">
              <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderRadius: 2, overflow: "hidden" }}>
                {lpx ? (
                  <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>Loading…</div>
                ) : prospects.length === 0 ? (
                  <div style={{ padding: 48, textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>No prospects enrolled yet.</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                      Prospects enroll automatically when they submit a Founding Partner application.
                    </div>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #E8E4DC", background: "#FAFAF8" }}>
                        <th style={th}>Name / Company</th>
                        <th style={th}>Email</th>
                        <th style={th}>Role</th>
                        <th style={th}>Enrolled</th>
                        <th style={{ ...th, textAlign: "center" }}>Briefs</th>
                        <th style={th}>Last Brief</th>
                        <th style={th}>Status</th>
                        <th style={th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {prospects.map((p, i) => (
                        <tr key={p.id} style={{ borderBottom: "1px solid #F3F0E8", background: i % 2 === 0 ? "#fff" : "#FAFAF8" }}>
                          <td style={td}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: NAVY }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: "#6B7280" }}>{p.company}</div>
                          </td>
                          <td style={{ ...td, fontSize: 12, color: "#374151" }}>{p.email}</td>
                          <td style={{ ...td, fontSize: 11, color: "#6B7280" }}>{p.role || "—"}</td>
                          <td style={{ ...td, fontSize: 11, color: "#6B7280" }}>{fmt(p.enrolledAt)}</td>
                          <td style={{ ...td, textAlign: "center" }}>
                            <span style={{ fontWeight: 700, fontSize: 16, color: (p.briefCount ?? 0) > 0 ? TEAL : "#9CA3AF" }}>
                              {p.briefCount ?? 0}
                            </span>
                          </td>
                          <td style={{ ...td, fontSize: 11, color: "#6B7280" }}>{fmt(p.lastBriefAt)}</td>
                          <td style={td}>
                            <Badge style={{
                              background: p.isActive ? "rgba(43,138,110,0.1)" : "rgba(156,163,175,0.1)",
                              color: p.isActive ? TEAL : "#9CA3AF",
                              border: `1px solid ${p.isActive ? TEAL : "#D1D5DB"}`,
                              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                            }}>
                              {p.isActive ? "Active" : "Paused"}
                            </Badge>
                          </td>
                          <td style={td}>
                            {p.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deactivate.mutate(p.id)}
                                disabled={deactivate.isPending}
                                style={{ fontSize: 10, color: "#EF4444", padding: "4px 8px" }}
                              >
                                <ShieldOff size={12} style={{ marginRight: 4 }} />
                                Pause
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </TabsContent>

            {/* BRIEFS SENT TAB */}
            <TabsContent value="briefs">
              <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderRadius: 2, overflow: "hidden" }}>
                {lbx ? (
                  <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>Loading…</div>
                ) : briefs.length === 0 ? (
                  <div style={{ padding: 48, textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>No briefs sent yet.</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                      Briefs fire automatically when a signal reaches ≥75% confidence and prospects pass dedup rules.
                    </div>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #E8E4DC", background: "#FAFAF8" }}>
                        <th style={th}>Sent To</th>
                        <th style={th}>Trigger</th>
                        <th style={th}>Domain</th>
                        <th style={th}>Protocol</th>
                        <th style={{ ...th, textAlign: "center" }}>Confidence</th>
                        <th style={th}>Sent At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {briefs.map((b, i) => (
                        <tr key={b.id} style={{ borderBottom: "1px solid #F3F0E8", background: i % 2 === 0 ? "#fff" : "#FAFAF8" }}>
                          <td style={td}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: NAVY }}>{b.prospectName || "—"}</div>
                            <div style={{ fontSize: 11, color: "#6B7280" }}>{b.prospectEmail}</div>
                            <div style={{ fontSize: 10, color: "#9CA3AF" }}>{b.prospectCompany}</div>
                          </td>
                          <td style={{ ...td, fontSize: 12, color: NAVY, fontWeight: 600, maxWidth: 200, lineHeight: "1.4" }}>
                            {b.triggerName}
                          </td>
                          <td style={td}>
                            <Badge style={{
                              background: "rgba(201,168,76,0.1)", color: "#92681A",
                              border: "1px solid rgba(201,168,76,0.4)",
                              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                            }}>
                              {b.triggerDomain}
                            </Badge>
                          </td>
                          <td style={{ ...td, fontSize: 11, color: "#374151", maxWidth: 220, lineHeight: "1.4" }}>
                            {b.playbookName}
                          </td>
                          <td style={{ ...td, textAlign: "center" }}>
                            <span style={{ fontWeight: 800, fontSize: 15, color: (b.confidenceScore ?? 0) >= 85 ? TEAL : GOLD }}>
                              {b.confidenceScore ?? 0}%
                            </span>
                          </td>
                          <td style={{ ...td, fontSize: 11, color: "#6B7280" }}>
                            {fmt(b.sentAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* How it works note */}
          <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(43,138,110,0.06)", border: "1px solid rgba(43,138,110,0.2)", borderLeft: `4px solid ${TEAL}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 6 }}>
              How This Works
            </div>
            <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>
              Every 15 minutes, Readiness OS scans 248+ data sources. When a signal scores ≥75% confidence, the system checks enrolled prospects,
              applies dedup rules (max 1 per trigger per 48 hours, max 3 per week), and sends a tailored Signal Brief email
              from <strong>pilot@vaughnmartin.com</strong>. Prospects enroll automatically when they submit a Founding Partner application.
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
