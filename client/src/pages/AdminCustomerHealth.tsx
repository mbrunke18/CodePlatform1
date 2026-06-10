import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Users, Zap, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

function RAGBadge({ status }: { status: "green" | "amber" | "red" }) {
  const config = {
    green: { label: "Active", bg: "#2B8A6E", text: "#fff" },
    amber: { label: "Watch", bg: "#C9A84C", text: "#fff" },
    red: { label: "At Risk", bg: "#DC2626", text: "#fff" },
  }[status];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: config.bg, color: config.text, padding: "3px 10px" }}>
      {config.label}
    </span>
  );
}

function daysSince(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function AdminCustomerHealth() {
  const { user } = useAuth();
  const { data: customersRaw, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/customer-health"],
    enabled: !!user,
  });
  const customers = Array.isArray(customersRaw) ? customersRaw : [];

  const greenCount = customers.filter(c => c.ragStatus === "green").length;
  const amberCount = customers.filter(c => c.ragStatus === "amber").length;
  const redCount = customers.filter(c => c.ragStatus === "red").length;

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: NAVY, padding: "40px 0 32px", marginBottom: 0 }}>
          <div className="container mx-auto px-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white/60 hover:text-white mb-4 p-0 h-auto font-normal">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Admin · Internal View</span>
            </div>
            <h1 style={{ ...CG, fontWeight: 700, fontSize: "clamp(32px,5vw,48px)", color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
              Customer <em style={{ fontStyle: "italic", color: GOLD }}>Health</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
              RAG-status view across all Founding Partner organizations. Green = activation last 7 days. Amber = 8–21 days. Red = 22+ days or never.
            </p>

            {/* Summary bar */}
            <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
              {[
                { label: "Active", count: greenCount, color: TEAL },
                { label: "Watch", count: amberCount, color: "#C9A84C" },
                { label: "At Risk", count: redCount, color: "#DC2626" },
                { label: "Total Organizations", count: customers.length, color: "rgba(255,255,255,0.5)" },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{count}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {isLoading ? (
            <div style={{ textAlign: "center", padding: 60, color: MUTED }}>Loading customer health data...</div>
          ) : customers.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: MUTED }}>No organizations found.</div>
          ) : (
            <div className="space-y-3">
              {/* Sort: red first, then amber, then green */}
              {[...customers]
                .sort((a, b) => {
                  const order = { red: 0, amber: 1, green: 2 };
                  return (order[a.ragStatus as keyof typeof order] ?? 3) - (order[b.ragStatus as keyof typeof order] ?? 3);
                })
                .map((org) => (
                  <Card key={org.id} style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${org.ragStatus === 'green' ? TEAL : org.ragStatus === 'amber' ? '#C9A84C' : '#DC2626'}`, borderRadius: 0 }}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div style={{ width: 40, height: 40, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Building2 className="h-5 w-5 text-white/70" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 style={{ fontWeight: 700, fontSize: 16, color: NAVY }}>{org.name}</h3>
                              <RAGBadge status={org.ragStatus} />
                            </div>
                            <p style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
                              {org.industry || "—"} · {org.size || "—"}
                            </p>
                            <div className="flex flex-wrap gap-6">
                              {[
                                { icon: Zap, label: "Activations", value: org.totalActivations },
                                { icon: CheckCircle2, label: "Completed", value: org.completedActivations },
                                { icon: Clock, label: "Last Activation", value: daysSince(org.lastActivationAt) },
                                { icon: Users, label: "Members", value: org.memberCount },
                                { icon: AlertTriangle, label: "Triggers", value: org.triggerCount },
                                { icon: CheckCircle2, label: "Loop Closed", value: org.closedLoopCount },
                              ].map(({ icon: Icon, label, value }) => (
                                <div key={label} style={{ textAlign: "center" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: MUTED, fontSize: 11, marginBottom: 2 }}>
                                    <Icon className="h-3 w-3" />
                                    <span style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</span>
                                  </div>
                                  <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                                    {value ?? "—"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {org.ragStatus !== "green" && (
                          <div style={{ marginLeft: 16, flexShrink: 0 }}>
                            {org.ragStatus === "red" && (
                              <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 600, textAlign: "right" }}>
                                {org.totalActivations === 0 ? "No activations recorded" : "22+ days since last activation"}
                              </div>
                            )}
                            {org.ragStatus === "amber" && (
                              <div style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600, textAlign: "right" }}>
                                8–21 days since activation
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
