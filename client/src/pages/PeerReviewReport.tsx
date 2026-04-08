import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import PageLayout from "@/components/layout/PageLayout";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";

const SCALE_QUESTIONS: Record<string, string> = {
  q1: "Problem significance (strategic trigger gap)",
  q3: "Frequency of missed strategic windows",
  q4: "Pre-staged response maturity",
  q5: "Product clarity",
  q7: "12-minute claim credibility",
  q8: "Value proposition strength",
  q10: "Market need",
  q21: "vs. existing tools",
  q23: "Overall product rating",
  q25: "Commercial viability",
};

function ScoreBar({ label, avg, n, max = 5 }: { label: string; avg: number | null; n?: number; max?: number }) {
  const pct = avg ? (avg / max) * 100 : 0;
  const color = avg == null ? MUTED : avg >= 4 ? TEAL : avg >= 3 ? GOLD : "#DC2626";
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: NAVY, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 800, color, minWidth: 40, textAlign: "right" }}>
          {avg != null ? avg.toFixed(1) : "—"}<span style={{ fontSize: 11, color: MUTED, fontWeight: 400 }}>/5</span>
        </span>
      </div>
      <div style={{ height: 8, background: BORDER, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.6s" }} />
      </div>
      {n != null && <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{n} responses</div>}
    </div>
  );
}

function DistBar({ dist, total }: { dist: Record<number, number>; total: number }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 48, marginTop: 8 }}>
      {[1, 2, 3, 4, 5].map(n => {
        const count = dist[n] || 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ fontSize: 10, color: MUTED }}>{count > 0 ? count : ""}</div>
            <div style={{ width: "100%", background: pct > 0 ? GOLD : BORDER, height: `${Math.max(pct, 4)}%`, borderRadius: "2px 2px 0 0", minHeight: 4 }} />
            <div style={{ fontSize: 10, color: MUTED }}>{n}</div>
          </div>
        );
      })}
    </div>
  );
}

function FreqList({ items, total, color = TEAL }: { items: [string, number][]; total: number; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.slice(0, 8).map(([label, count]) => (
        <div key={label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 12, color: NAVY, flex: 1, marginRight: 12, lineHeight: 1.4 }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color, whiteSpace: "nowrap" }}>{count} <span style={{ color: MUTED, fontWeight: 400 }}>({Math.round(count / total * 100)}%)</span></span>
          </div>
          <div style={{ height: 5, background: BORDER, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(count / total) * 100}%`, background: color, borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Card({ title, children, accent = GOLD }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 24, marginBottom: 24, borderTop: `3px solid ${accent}` }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h3>
      {children}
    </div>
  );
}

function Quotes({ items }: { items: { name: string; role: string; org: string; text: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.slice(0, 6).map((r, i) => (
        <div key={i} style={{ padding: "14px 16px", background: OFF, borderRadius: 6, borderLeft: `3px solid ${GOLD}` }}>
          <p style={{ fontSize: 13, color: NAVY, lineHeight: 1.6, margin: "0 0 8px", fontStyle: "italic" }}>"{r.text}"</p>
          <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{r.name} · {r.role}, {r.org}</p>
        </div>
      ))}
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  messaging: GOLD,
  product: TEAL,
  pricing: "#7C3AED",
  credibility: "#DC2626",
  general: NAVY,
};

const STATUS_COLORS: Record<string, string> = {
  identified: GOLD,
  in_progress: TEAL,
  completed: "#22c55e",
};

function ImprovementLog() {
  const qc = useQueryClient();
  const { data: actionsRaw } = useQuery<any[]>({ queryKey: ["/api/peer-review-actions"] });
  const actions = Array.isArray(actionsRaw) ? actionsRaw : [];

  const [insight, setInsight] = useState("");
  const [action, setAction] = useState("");
  const [category, setCategory] = useState("general");
  const [adding, setAdding] = useState(false);

  const createMutation = useMutation({
    mutationFn: (body: any) => apiRequest("POST", "/api/peer-review-actions", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/peer-review-actions"] });
      setInsight(""); setAction(""); setCategory("general"); setAdding(false);
    },
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/peer-review-actions/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/peer-review-actions"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/peer-review-actions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/peer-review-actions"] }),
  });

  const counts = { identified: 0, in_progress: 0, completed: 0 };
  actions.forEach((a: any) => { if (counts[a.status as keyof typeof counts] !== undefined) counts[a.status as keyof typeof counts]++; });

  return (
    <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 8, marginBottom: 24, borderTop: `3px solid ${TEAL}`, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Lessons Applied — Improvement Log</h3>
          <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>Track what feedback themes were actioned and what changed as a result.</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {Object.entries(counts).map(([s, n]) => (
            <span key={s} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `${STATUS_COLORS[s]}18`, color: STATUS_COLORS[s], border: `1px solid ${STATUS_COLORS[s]}40` }}>
              {n} {s.replace("_", " ")}
            </span>
          ))}
          <button onClick={() => setAdding(!adding)} style={{ background: NAVY, color: GOLD, border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>
            {adding ? "Cancel" : "+ Log Insight"}
          </button>
        </div>
      </div>

      {adding && (
        <div style={{ padding: "20px 24px", background: OFF, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>Feedback Theme / Insight</label>
              <input value={insight} onChange={e => setInsight(e.target.value)} placeholder="e.g. Multiple reviewers questioned the 12-minute claim without seeing a live example"
                style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 13, color: NAVY, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>Action Taken / Planned</label>
              <input value={action} onChange={e => setAction(e.target.value)} placeholder="e.g. Added live activation demo to the test drive complete screen"
                style={{ width: "100%", padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 13, color: NAVY, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 13, color: NAVY, fontFamily: "'DM Sans', sans-serif", background: "white" }}>
                {["messaging", "product", "pricing", "credibility", "general"].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => createMutation.mutate({ insight, action, category, status: "identified" })}
            disabled={!insight.trim() || !action.trim() || createMutation.isPending}
            style={{ background: TEAL, color: "white", border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            {createMutation.isPending ? "Saving..." : "Save Action"}
          </button>
        </div>
      )}

      {actions.length === 0 ? (
        <div style={{ padding: "32px 24px", textAlign: "center", color: MUTED, fontSize: 13 }}>
          No improvement actions logged yet. Use the button above to start tracking what feedback themes are being actioned.
        </div>
      ) : (
        <div>
          {actions.map((a: any) => (
            <div key={a.id} style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, display: "grid", gridTemplateColumns: "auto 1fr 1fr auto", gap: 16, alignItems: "start" }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 3, background: `${CATEGORY_COLORS[a.category] || NAVY}15`, color: CATEGORY_COLORS[a.category] || NAVY, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {a.category}
                </span>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>Feedback Theme</p>
                <p style={{ fontSize: 13, color: NAVY, margin: 0, lineHeight: 1.5 }}>{a.insight}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>Action Taken</p>
                <p style={{ fontSize: 13, color: NAVY, margin: 0, lineHeight: 1.5 }}>{a.action}</p>
                {a.completedAt && <p style={{ fontSize: 11, color: MUTED, margin: "4px 0 0" }}>Completed {new Date(a.completedAt).toLocaleDateString()}</p>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `${STATUS_COLORS[a.status]}18`, color: STATUS_COLORS[a.status], border: `1px solid ${STATUS_COLORS[a.status]}40`, whiteSpace: "nowrap" }}>
                  {a.status.replace("_", " ")}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  {a.status === "identified" && (
                    <button onClick={() => patchMutation.mutate({ id: a.id, status: "in_progress" })} style={{ fontSize: 11, padding: "3px 8px", background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}40`, borderRadius: 4, cursor: "pointer" }}>
                      Start
                    </button>
                  )}
                  {a.status === "in_progress" && (
                    <button onClick={() => patchMutation.mutate({ id: a.id, status: "completed" })} style={{ fontSize: 11, padding: "3px 8px", background: "#22c55e15", color: "#22c55e", border: "1px solid #22c55e40", borderRadius: 4, cursor: "pointer" }}>
                      Complete
                    </button>
                  )}
                  <button onClick={() => deleteMutation.mutate(a.id)} style={{ fontSize: 11, padding: "3px 8px", background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer" }}>
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PeerReviewReport() {
  const { data, isLoading, error } = useQuery<any>({ queryKey: ["/api/peer-reviews/report"] });

  if (isLoading) return (
    <PageLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <p style={{ color: MUTED }}>Loading report data...</p>
      </div>
    </PageLayout>
  );

  if (error || !data) return (
    <PageLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
        <div>
          <p style={{ color: "#DC2626", fontWeight: 600, marginBottom: 8 }}>Access restricted</p>
          <p style={{ color: MUTED, fontSize: 14 }}>This report is available to platform administrators only.</p>
        </div>
      </div>
    </PageLayout>
  );

  if (data.total === 0) return (
    <PageLayout>
      <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>Peer Review Report</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: NAVY, marginBottom: 16 }}>No Submissions Yet</h1>
        <p style={{ color: MUTED, fontSize: 15 }}>Share the questionnaire link to begin collecting feedback. Results will appear here automatically.</p>
        <div style={{ marginTop: 32, padding: 20, background: OFF, border: `1px solid ${BORDER}`, borderRadius: 6, textAlign: "left" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Questionnaire Link</p>
          <code style={{ fontSize: 13, color: NAVY }}>{window.location.origin}/peer-review</code>
        </div>
      </div>
    </PageLayout>
  );

  const total = data.total;
  const scales = data.scales || {};

  // Compute headline metrics
  const overallAvg = scales.q23?.avg;
  const viabilityAvg = scales.q25?.avg;
  const marketAvg = scales.q10?.avg;
  const credibilityAvg = scales.q7?.avg;

  // Buy intent from Q24
  const q24 = data.q24Selection || [];
  const wouldBuy = q24.find(([k]: [string, number]) => k.includes("immediately"))?.[1] || 0;
  const wouldShortlist = q24.find(([k]: [string, number]) => k.includes("shortlist"))?.[1] || 0;
  const positiveIntent = wouldBuy + wouldShortlist;
  const positiveIntentPct = total > 0 ? Math.round((positiveIntent / total) * 100) : 0;

  // Referral from Q26
  const q26 = data.q26Selection || [];
  const wouldRefer = q26.filter(([k]: [string, number]) => k.startsWith("Yes")).reduce((a: number, [, n]: [string, number]) => a + n, 0);
  const referPct = total > 0 ? Math.round((wouldRefer / total) * 100) : 0;

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: NAVY, padding: "40px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>VaughnMartin · Command OS</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 600, color: "white", margin: "0 0 8px" }}>Peer Review Findings Report</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, margin: 0 }}>Independent Product Evaluation — {total} submission{total !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px 80px" }}>
          {/* Headline metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Overall Rating", value: overallAvg ? `${overallAvg.toFixed(1)}/5` : "—", color: TEAL },
              { label: "Commercial Viability", value: viabilityAvg ? `${viabilityAvg.toFixed(1)}/5` : "—", color: GOLD },
              { label: "Buy / Shortlist Intent", value: `${positiveIntentPct}%`, color: TEAL },
              { label: "Would Refer", value: `${referPct}%`, color: GOLD },
            ].map(m => (
              <div key={m.label} style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: m.color, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 8, fontWeight: 500 }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Left column */}
            <div>
              <Card title="Key Scale Scores">
                {Object.entries(SCALE_QUESTIONS).map(([key, label]) => {
                  const s = scales[key];
                  return s ? (
                    <div key={key} style={{ marginBottom: 20 }}>
                      <ScoreBar label={label} avg={s.avg} />
                      <DistBar dist={s.dist || {}} total={total} />
                    </div>
                  ) : null;
                })}
              </Card>

              <Card title="Q16 — Product Dimension Ratings" accent={TEAL}>
                {(data.q16Matrix || []).map((row: any) => (
                  <ScoreBar key={row.dimension} label={row.dimension} avg={row.avg} n={row.n} />
                ))}
              </Card>

              <Card title="Q9 — How Reviewers Categorize the Product">
                <FreqList items={data.q9Selections || []} total={total} color={TEAL} />
              </Card>

              <Card title="Q12 — Top Purchase Barriers">
                <FreqList items={data.q12Selections || []} total={total} color="#DC2626" />
              </Card>
            </div>

            {/* Right column */}
            <div>
              <Card title="Q24 — Purchase Intent">
                <FreqList items={data.q24Selection || []} total={total} color={TEAL} />
              </Card>

              <Card title="Q26 — Referral Intent">
                <FreqList items={data.q26Selection || []} total={total} color={GOLD} />
              </Card>

              <Card title="Q11 — Most Likely Champion">
                <FreqList items={data.q11Selection || []} total={total} color={NAVY} />
              </Card>

              <Card title="Q13 — Pilot Price Expectation">
                <FreqList items={data.q13Selection || []} total={total} color={GOLD} />
              </Card>

              <Card title="Q2 — Response Time in Current Org">
                <FreqList items={data.q2Selection || []} total={total} color={TEAL} />
              </Card>

              <Card title="Q20 — Competitive Awareness">
                <FreqList items={data.q20Selection || []} total={total} color={MUTED} />
              </Card>
            </div>
          </div>

          {/* Qualitative sections */}
          {[
            { key: "q6", label: "Q6 — In Their Own Words: What Does Command OS Do?" },
            { key: "q7", label: "Q7 — What Would Make the 12-Minute Claim More Credible?" },
            { key: "q15", label: "Q15 — Most Significant Gap / Weakness" },
            { key: "q18", label: "Q18 — Founder Advice: Most Important Thing to Fix Before Go-to-Market" },
            { key: "q22", label: "Q22 — Strongest Competitive Argument Against Command OS" },
            { key: "q27", label: "Q27 — What the Founder Should Do in the Next 30 Days" },
            { key: "q28", label: "Q28 — Additional Feedback for the Founder" },
            { key: "q1", label: "Q1 — What Causes the Strategic Response Gap?" },
            { key: "q3", label: "Q3 — Missed Strategic Windows" },
            { key: "q17", label: "Q17 — Missing Capabilities" },
            { key: "q19", label: "Q19 — Integration Requirements" },
          ].map(({ key, label }) => {
            const items = (data.qualitative || {})[key] || [];
            if (items.length === 0) return null;
            return (
              <Card key={key} title={label} accent={TEAL}>
                <Quotes items={items} />
              </Card>
            );
          })}

          {/* Individual submissions table */}
          <ImprovementLog />

          <Card title={`All Submissions (${total})`} accent={MUTED}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                    {["Date", "Name", "Role", "Organization", "Type", "Rating", "Viability", "Purchase Intent", "Would Refer"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.rows || []).map((r: any) => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: "10px 12px", color: MUTED, whiteSpace: "nowrap" }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: NAVY }}>{r.reviewerName}</td>
                      <td style={{ padding: "10px 12px", color: NAVY }}>{r.reviewerRole}</td>
                      <td style={{ padding: "10px 12px", color: NAVY }}>{r.reviewerOrg}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: r.reviewerType === "investor" ? `${GOLD}22` : r.reviewerType === "customer" ? `${TEAL}22` : `${NAVY}11`, color: r.reviewerType === "investor" ? GOLD : r.reviewerType === "customer" ? TEAL : NAVY }}>
                          {r.reviewerType}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: r.q23Scale >= 4 ? TEAL : r.q23Scale >= 3 ? GOLD : "#DC2626" }}>{r.q23Scale ?? "—"}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: r.q25Scale >= 4 ? TEAL : r.q25Scale >= 3 ? GOLD : "#DC2626" }}>{r.q25Scale ?? "—"}</td>
                      <td style={{ padding: "10px 12px", color: NAVY, fontSize: 12, maxWidth: 200 }}>{r.q24Selection?.split("—")[0]?.trim() || "—"}</td>
                      <td style={{ padding: "10px 12px", color: NAVY, fontSize: 12 }}>{r.q26Selection?.split("—")[0]?.trim() || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
