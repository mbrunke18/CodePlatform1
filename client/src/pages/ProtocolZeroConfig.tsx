import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Shield, Target, CheckCircle2, Clock, Plus, Trash2, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { updatePageMetadata } from "@/lib/seo";
const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const INPUT: React.CSSProperties = {
  width: "100%", border: "1px solid #E8E4DC", padding: "9px 12px",
  fontSize: 13, color: NAVY, background: "#FAFAF9", outline: "none",
  fontFamily: "inherit", lineHeight: 1.5,
};

const LABEL: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 700,
  color: NAVY, marginBottom: 6, letterSpacing: "0.02em",
};

type Retainer = { name: string; role: string; firm: string; contact: string };
type NotifyPerson = { name: string; role: string; email: string };

export default function ProtocolZeroConfig() {
  const [primaryAuthorityName, setPrimaryAuthorityName] = useState("");
  const [primaryAuthorityEmail, setPrimaryAuthorityEmail] = useState("");
  const [primaryAuthorityRole, setPrimaryAuthorityRole] = useState("CEO");
  const [backupAuthorityName, setBackupAuthorityName] = useState("");
  const [backupAuthorityEmail, setBackupAuthorityEmail] = useState("");
  const [backupAuthorityRole, setBackupAuthorityRole] = useState("COO");
  const [emergencyBudgetAmount, setEmergencyBudgetAmount] = useState("");
  const [emergencyBudgetCurrency, setEmergencyBudgetCurrency] = useState("USD");
  const [retainers, setRetainers] = useState<Retainer[]>([
    { name: "", role: "Legal Counsel", firm: "", contact: "" },
    { name: "", role: "PR / Crisis Communications", firm: "", contact: "" },
    { name: "", role: "Crisis Management Advisor", firm: "", contact: "" },
  ]);
  const [notificationList, setNotificationList] = useState<NotifyPerson[]>([
    { name: "", role: "CFO", email: "" },
    { name: "", role: "General Counsel", email: "" },
    { name: "", role: "Board Chair", email: "" },
  ]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    updatePageMetadata(
      "Configure Protocol #0 — Pre-Staging Setup | Readiness OS",
      "Configure the four pre-staged elements required for Protocol #0: authority chain, emergency budget, external retainers, and notification list.",
    );
  }, []);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["/api/protocol-zero/config"],
  });

  useEffect(() => {
    if (!existing) return;
    const c = existing as any;
    if (c.primaryAuthorityName) setPrimaryAuthorityName(c.primaryAuthorityName);
    if (c.primaryAuthorityEmail) setPrimaryAuthorityEmail(c.primaryAuthorityEmail);
    if (c.primaryAuthorityRole) setPrimaryAuthorityRole(c.primaryAuthorityRole);
    if (c.backupAuthorityName) setBackupAuthorityName(c.backupAuthorityName);
    if (c.backupAuthorityEmail) setBackupAuthorityEmail(c.backupAuthorityEmail);
    if (c.backupAuthorityRole) setBackupAuthorityRole(c.backupAuthorityRole);
    if (c.emergencyBudgetAmount) setEmergencyBudgetAmount(String(c.emergencyBudgetAmount));
    if (c.emergencyBudgetCurrency) setEmergencyBudgetCurrency(c.emergencyBudgetCurrency);
    if (c.retainers?.length) setRetainers(c.retainers);
    if (c.notificationList?.length) setNotificationList(c.notificationList);
  }, [existing]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiRequest("POST", "/api/protocol-zero/config", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/protocol-zero/config"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    },
  });

  const handleSave = () => {
    mutation.mutate({
      primaryAuthorityName, primaryAuthorityEmail, primaryAuthorityRole,
      backupAuthorityName, backupAuthorityEmail, backupAuthorityRole,
      emergencyBudgetAmount: emergencyBudgetAmount ? parseInt(emergencyBudgetAmount) : null,
      emergencyBudgetCurrency,
      retainers: retainers.filter(r => r.name || r.firm),
      notificationList: notificationList.filter(n => n.name || n.email),
    });
  };

  const updateRetainer = (i: number, field: keyof Retainer, val: string) => {
    setRetainers(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };
  const addRetainer = () => setRetainers(prev => [...prev, { name: "", role: "", firm: "", contact: "" }]);
  const removeRetainer = (i: number) => setRetainers(prev => prev.filter((_, idx) => idx !== i));

  const updateNotify = (i: number, field: keyof NotifyPerson, val: string) => {
    setNotificationList(prev => prev.map((n, idx) => idx === i ? { ...n, [field]: val } : n));
  };
  const addNotify = () => setNotificationList(prev => [...prev, { name: "", role: "", email: "" }]);
  const removeNotify = (i: number) => setNotificationList(prev => prev.filter((_, idx) => idx !== i));

  const isConfigured = !!(existing as any)?.primaryAuthorityName;

  return (
    <PageLayout>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "52px 0 40px" }}>
        <div className="max-w-3xl mx-auto px-6">
          <a href="/protocol-zero-launch" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none", marginBottom: 20, ...BC, letterSpacing: "0.1em" }}>
            <ArrowLeft size={12} /> Protocol #0 Launch
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <div style={{ width: 20, height: 1.5, background: GOLD }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>
              Pre-Staging Configuration · Protocol #0
            </span>
            {isConfigured && (
              <span style={{ background: "rgba(43,138,110,0.2)", color: TEAL, fontSize: 10, fontWeight: 700, padding: "2px 8px", letterSpacing: "0.1em", ...BC }}>
                CONFIGURED
              </span>
            )}
          </div>
          <h1 style={{ ...CG, color: "#fff", fontSize: 40, fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>
            Configure Universal Response Infrastructure
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.65, maxWidth: 560 }}>
            Set up the four pre-staged elements that make Protocol #0 work in 12 minutes. Configure once — valid for every future activation.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {!isConfigured && !isLoading && (
          <div style={{ background: "#FFF8EC", border: "1px solid rgba(201,168,76,0.4)", borderLeft: `3px solid ${GOLD}`, padding: "14px 18px", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <AlertCircle size={15} color={GOLD} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 13, color: NAVY, lineHeight: 1.55, margin: 0 }}>
              <strong>Protocol #0 is not yet fully pre-staged.</strong> Activation will proceed, but without a configured authority chain or emergency budget envelope. Complete this setup to ensure the 12-minute execution chain is fully armed.
            </p>
          </div>
        )}

        {/* ── SECTION 1: AUTHORITY CHAIN ───────────────────────────── */}
        <Section icon={Shield} color={NAVY} label="01 — Authority Chain" note="The executive who authorizes Protocol #0 activations. Primary and backup — one is always reachable.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={LABEL}>Primary authority — full name</label>
              <input style={INPUT} value={primaryAuthorityName} onChange={e => setPrimaryAuthorityName(e.target.value)} placeholder="e.g. Sarah Chen" />
            </div>
            <div>
              <label style={LABEL}>Email address</label>
              <input style={INPUT} type="email" value={primaryAuthorityEmail} onChange={e => setPrimaryAuthorityEmail(e.target.value)} placeholder="e.g. schen@company.com" />
            </div>
            <div>
              <label style={LABEL}>Role / title</label>
              <input style={INPUT} value={primaryAuthorityRole} onChange={e => setPrimaryAuthorityRole(e.target.value)} placeholder="CEO" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", gap: 12 }}>
            <div>
              <label style={LABEL}>Backup authority — full name</label>
              <input style={INPUT} value={backupAuthorityName} onChange={e => setBackupAuthorityName(e.target.value)} placeholder="e.g. Marcus Williams" />
            </div>
            <div>
              <label style={LABEL}>Email address</label>
              <input style={INPUT} type="email" value={backupAuthorityEmail} onChange={e => setBackupAuthorityEmail(e.target.value)} placeholder="e.g. mwilliams@company.com" />
            </div>
            <div>
              <label style={LABEL}>Role / title</label>
              <input style={INPUT} value={backupAuthorityRole} onChange={e => setBackupAuthorityRole(e.target.value)} placeholder="COO" />
            </div>
          </div>
        </Section>

        {/* ── SECTION 2: EMERGENCY BUDGET ──────────────────────────── */}
        <Section icon={Target} color={GOLD} label="02 — Emergency Budget Envelope" note="A pre-approved spending amount the CFO configures once. No committee approval required at activation — this envelope is already authorized.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}>
            <div>
              <label style={LABEL}>Pre-approved emergency budget amount</label>
              <input
                style={INPUT} type="number" min="0" step="10000"
                value={emergencyBudgetAmount}
                onChange={e => setEmergencyBudgetAmount(e.target.value)}
                placeholder="e.g. 250000"
              />
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 5, lineHeight: 1.5 }}>
                Recommended: 0.1–0.5% of annual revenue. This covers initial response costs — legal, communications, operations — before the situation is fully scoped.
              </p>
            </div>
            <div>
              <label style={LABEL}>Currency</label>
              <select
                style={{ ...INPUT, cursor: "pointer" }}
                value={emergencyBudgetCurrency}
                onChange={e => setEmergencyBudgetCurrency(e.target.value)}
              >
                {["USD", "EUR", "GBP", "CAD", "AUD", "SGD"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* ── SECTION 3: EXTERNAL RETAINERS ────────────────────────── */}
        <Section icon={CheckCircle2} color={TEAL} label="03 — External Retainers" note="Advisors engaged on retainer and available within the 12-minute window. These contacts are pre-notified at activation.">
          {retainers.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 36px", gap: 10, marginBottom: 10 }}>
              <div>
                {i === 0 && <label style={{ ...LABEL, marginBottom: 5 }}>Contact name</label>}
                <input style={INPUT} value={r.name} onChange={e => updateRetainer(i, "name", e.target.value)} placeholder="Full name" />
              </div>
              <div>
                {i === 0 && <label style={{ ...LABEL, marginBottom: 5 }}>Role</label>}
                <input style={INPUT} value={r.role} onChange={e => updateRetainer(i, "role", e.target.value)} placeholder="e.g. Legal Counsel" />
              </div>
              <div>
                {i === 0 && <label style={{ ...LABEL, marginBottom: 5 }}>Firm / organization</label>}
                <input style={INPUT} value={r.firm} onChange={e => updateRetainer(i, "firm", e.target.value)} placeholder="Firm name" />
              </div>
              <div>
                {i === 0 && <label style={{ ...LABEL, marginBottom: 5 }}>Phone / email</label>}
                <input style={INPUT} value={r.contact} onChange={e => updateRetainer(i, "contact", e.target.value)} placeholder="Contact info" />
              </div>
              <div style={{ display: "flex", alignItems: i === 0 ? "flex-end" : "center", paddingBottom: i === 0 ? 0 : 0 }}>
                <button
                  onClick={() => removeRetainer(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#D1D5DB" }}
                  title="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addRetainer}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: TEAL, background: "none", border: `1px dashed ${TEAL}`, padding: "6px 14px", cursor: "pointer", ...BC, fontWeight: 700, letterSpacing: "0.06em", marginTop: 4 }}
          >
            <Plus size={12} /> Add retainer
          </button>
        </Section>

        {/* ── SECTION 4: NOTIFICATION LIST ─────────────────────────── */}
        <Section icon={Clock} color={NAVY} label="04 — Notification List" note="Executives and board members automatically notified at the moment Protocol #0 activates. They receive the situation brief, domain, and urgency — no manual calls required.">
          {notificationList.map((n, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 36px", gap: 10, marginBottom: 10 }}>
              <div>
                {i === 0 && <label style={{ ...LABEL, marginBottom: 5 }}>Full name</label>}
                <input style={INPUT} value={n.name} onChange={e => updateNotify(i, "name", e.target.value)} placeholder="Full name" />
              </div>
              <div>
                {i === 0 && <label style={{ ...LABEL, marginBottom: 5 }}>Role</label>}
                <input style={INPUT} value={n.role} onChange={e => updateNotify(i, "role", e.target.value)} placeholder="e.g. CFO" />
              </div>
              <div>
                {i === 0 && <label style={{ ...LABEL, marginBottom: 5 }}>Email address</label>}
                <input style={INPUT} type="email" value={n.email} onChange={e => updateNotify(i, "email", e.target.value)} placeholder="email@company.com" />
              </div>
              <div style={{ display: "flex", alignItems: i === 0 ? "flex-end" : "center" }}>
                <button
                  onClick={() => removeNotify(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#D1D5DB" }}
                  title="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addNotify}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: NAVY, background: "none", border: `1px dashed ${NAVY}`, padding: "6px 14px", cursor: "pointer", ...BC, fontWeight: 700, letterSpacing: "0.06em", marginTop: 4 }}
          >
            <Plus size={12} /> Add person
          </button>
        </Section>

        {/* ── SAVE ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 8 }}>
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: NAVY, color: "#fff", border: "none",
              padding: "14px 32px", cursor: mutation.isPending ? "not-allowed" : "pointer",
              fontWeight: 800, fontSize: 13, ...BC, letterSpacing: "0.08em",
              opacity: mutation.isPending ? 0.7 : 1,
            }}
          >
            <Save size={14} />
            {mutation.isPending ? "SAVING…" : "SAVE PRE-STAGING CONFIGURATION"}
          </button>

          {saved && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: TEAL, fontSize: 13, fontWeight: 600 }}>
              <CheckCircle2 size={15} />
              Saved — Protocol #0 is fully pre-staged.
            </div>
          )}

          {mutation.isError && (
            <div style={{ color: "#DC2626", fontSize: 13 }}>
              Save failed. Please try again.
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #E8E4DC", marginTop: 32, paddingTop: 20 }}>
          <a href="/protocol-zero-launch" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: TEAL, textDecoration: "none", ...BC, fontWeight: 700, letterSpacing: "0.08em" }}>
            <ArrowLeft size={12} /> Return to Protocol #0 Launch
          </a>
        </div>

      </div>
    </PageLayout>
  );
}

function Section({ icon: Icon, color, label, note, children }: {
  icon: any; color: string; label: string; note: string; children: React.ReactNode;
}) {
  const BC2: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
  return (
    <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderTop: `3px solid ${color}`, padding: "24px 24px 20px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Icon size={14} color={color} />
        <span style={{ ...BC2, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color }}>{label}</span>
      </div>
      <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.55, marginBottom: 18 }}>{note}</p>
      {children}
    </div>
  );
}
