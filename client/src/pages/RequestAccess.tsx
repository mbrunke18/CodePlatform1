import { useState, useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import deskImg from "@/assets/images/executive-desk-minimal.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { Loader2, Zap, Lock, Clock } from "lucide-react";
import StandardNav from "@/components/layout/StandardNav";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

type AccessMode = "founding" | "trial";

const CHALLENGE_EXAMPLES = [
  "We take 4–6 weeks to mobilize after a major competitor event",
  "Crisis responses are improvised — no pre-staged protocols",
  "Regulatory triggers require weeks of meetings before execution begins",
  "Every situation starts from zero — no institutional memory",
  "Cross-functional coordination collapses under time pressure",
];

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid work email"),
  company: z.string().min(1, "Required"),
  title: z.string().min(1, "Required"),
  executionChallenge: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: `1px solid rgba(240,237,228,0.2)`,
  borderRadius: 0,
  color: IVORY,
  fontSize: 15,
  fontWeight: 400,
  padding: "10px 0",
  width: "100%",
  outline: "none",
  letterSpacing: "0.01em",
};

function MinimalInput({ field, placeholder, type = "text" }: { field: any; placeholder: string; type?: string }) {
  return (
    <input
      {...field}
      type={type}
      placeholder={placeholder}
      required
      style={fieldStyle}
      className="request-field"
    />
  );
}

export default function RequestAccess() {
  const [mode, setMode] = useState<AccessMode>("founding");
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  useEffect(() => {
    updatePageMetadata({
      title: "Apply for Founding Partner Access — Readiness OS | VaughnMartin",
      description: "Apply for the Founding Partner Program or request a 48-hour trial of Readiness OS. Enterprise readiness infrastructure — startup to Fortune 500.",
      ogTitle: "Founding Partner Access — VaughnMartin Readiness OS",
      ogDescription: "Apply for Founding Partner access or request a 48-hour trial. 180 pre-staged protocols. 12-minute execution from trigger to authorization.",
    });
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", company: "", title: "", executionChallenge: "" },
  });

  const foundingMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/auth/magic-link/request", data),
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setSubmitted(true);
      (window as any).gtag?.("event", "founding_partner_request", {
        event_category: "Lead",
        event_label: "Founding Partner Access Request",
        value: 1,
      });
    },
  });

  const trialMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/trial/request", {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      company: data.company,
      title: data.title,
    }),
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setSubmitted(true);
      (window as any).gtag?.("event", "trial_access_request", {
        event_category: "Lead",
        event_label: "Trial Access Request",
        value: 1,
      });
    },
  });

  const activeMutation = mode === "founding" ? foundingMutation : trialMutation;

  const switchMode = (m: AccessMode) => {
    setMode(m);
    setSubmitted(false);
    form.reset();
    foundingMutation.reset();
    trialMutation.reset();
  };

  const onSubmit = (data: FormData) => activeMutation.mutate(data);

  return (
    <>
      <style>{`
        .request-field::placeholder { color: rgba(240,237,228,0.45); }
        .request-field:focus { border-bottom-color: rgba(201,168,76,0.6); }
        .request-field { transition: border-color 0.2s ease; }
        .access-submit:hover { background: rgba(201,168,76,0.14) !important; border-color: rgba(201,168,76,0.7) !important; }
        .mode-btn { transition: all 0.15s ease; }
        .mode-btn:hover { opacity: 0.9; }
      `}</style>

      <StandardNav />
      <div style={{ minHeight: "100vh", background: NAVY, display: "flex", position: "relative", overflow: "hidden" }}>

        {/* Background texture */}
        <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 20% 60%, rgba(43,138,110,0.07) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.05) 0%, transparent 50%)", pointerEvents: "none" }} />

        {/* Left — editorial statement panel */}
        <div className="hidden lg:flex" style={{ width: 480, flexShrink: 0, flexDirection: "column", justifyContent: "flex-start", gap: 24, padding: "44px 52px 36px", position: "relative", zIndex: 1, borderRight: "1px solid rgba(240,237,228,0.06)", backgroundImage: `url(${deskImg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,15,46,0.88)", zIndex: 0 }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <VaughnMartinLogo color="light" height={40} variant="full" />
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: 28, height: 1.5, background: GOLD, marginBottom: 14 }} />
            <p style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
              Founding Partner Program · 12 Seats
            </p>

            <h2 style={{ ...CG, fontSize: 34, fontWeight: 700, color: IVORY, lineHeight: 1.2, marginBottom: 16 }}>
              The first 12 get what<br />
              <em style={{ color: GOLD }}>no one can buy later.</em>
            </h2>

            <div style={{ borderTop: "1px solid rgba(240,237,228,0.1)" }}>
              {[
                { label: "Founding pricing locked", detail: "Before Year 2 and Year 3 escalators apply to everyone else" },
                { label: "Protocol co-authorship", detail: "Your industry's situations built into the library first" },
                { label: "Named Founding Partner", detail: "First case study in a new enterprise software category" },
                { label: "Direct founder access", detail: "90-day onboarding with the builder — not a CSM" },
                { label: "Investment credited to contract", detail: "100% of the Founding Partner fee credited at close" },
              ].map(({ label, detail }) => (
                <div key={label} style={{ padding: "10px 0", borderBottom: "1px solid rgba(240,237,228,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ color: TEAL, fontWeight: 700, fontSize: 14, lineHeight: 1, flexShrink: 0 }}>→</span>
                    <span style={{ ...BC, fontSize: 13, fontWeight: 700, color: IVORY, letterSpacing: "0.02em" }}>{label}</span>
                  </div>
                  <p style={{ ...BC, fontSize: 12, color: "rgba(240,237,228,0.55)", lineHeight: 1.5, margin: "0 0 0 24px" }}>{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1, marginTop: 24, padding: "16px 18px", background: "rgba(192,57,43,0.07)", borderLeft: "2px solid rgba(192,57,43,0.5)" }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.28em", color: "rgba(220,100,90,0.85)", textTransform: "uppercase" as const, marginBottom: 6 }}>The cost of one unplanned situation</div>
            <div style={{ ...BC, fontSize: 11, color: "rgba(240,237,228,0.55)", marginBottom: 12, lineHeight: 1.5 }}>Your organization will face 15–20 this year.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
              {[
                { n: "$47M",   label: "Regulatory exposure — ransomware, unprepared" },
                { n: "$3.2M",  label: "Activist concessions, avoidable with pre-staging" },
                { n: "30 days", label: "Mobilization lag every time a situation presents itself" },
                { n: "$0",     label: "Penalty exposure — pre-staged, on-time disclosure", teal: true },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ ...CG, fontSize: 18, fontWeight: 700, color: s.teal ? TEAL : "rgba(220,100,90,0.9)", lineHeight: 1, marginBottom: 3 }}>{s.n}</div>
                  <div style={{ ...BC, fontSize: 10, color: "rgba(240,237,228,0.4)", lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1, marginTop: 28, borderTop: "1px solid rgba(240,237,228,0.08)", paddingTop: 20 }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.32em", color: TEAL, textTransform: "uppercase", marginBottom: 14 }}>What happens after you apply</div>
            {[
              { n: "48h", label: "Founder review", detail: "We review your application and reach out within 48 hours — directly from the founder, not a sales team." },
              { n: "60m", label: "Fit conversation", detail: "One call to confirm your organization's strategic situations and identify which protocols apply first." },
              { n: "Day 1", label: "Partnership begins", detail: "Your protocols are configured, your PMO lead is onboarded, and your system is live — not a pilot, a full deployment." },
            ].map(({ n, label, detail }) => (
              <div key={n} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD, flexShrink: 0, minWidth: 36, lineHeight: 1.2 }}>{n}</div>
                <div>
                  <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: "rgba(240,237,228,0.82)", letterSpacing: "0.04em", marginBottom: 2 }}>{label}</div>
                  <div style={{ ...BC, fontSize: 11, color: "rgba(240,237,228,0.45)", lineHeight: 1.5, letterSpacing: "0.01em" }}>{detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ position: "relative", zIndex: 1, marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(240,237,228,0.06)" }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.28em", color: "rgba(240,237,228,0.3)", textTransform: "uppercase", marginBottom: 8 }}>Built for organizations of every size</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Pre-IPO Startup", "Growth Stage", "Mid-Market", "Enterprise", "Fortune 500"].map(size => (
                <span key={size} style={{ ...BC, fontSize: 9, fontWeight: 600, color: "rgba(240,237,228,0.4)", background: "rgba(240,237,228,0.04)", border: "1px solid rgba(240,237,228,0.1)", padding: "3px 10px", letterSpacing: "0.06em" }}>{size}</span>
              ))}
            </div>
          </div>

          <p style={{ ...BC, fontSize: 11, color: "rgba(240,237,228,0.45)", letterSpacing: "0.04em", position: "relative", zIndex: 1, marginTop: 20 }}>
            © VaughnMartin · vaughnmartin.com
          </p>
        </div>

        {/* Right — form panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px", position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", maxWidth: 440 }}>

            {/* Mobile logo */}
            <div className="lg:hidden" style={{ marginBottom: 40 }}>
              <VaughnMartinLogo color="light" height={36} variant="full" />
            </div>

            {/* ── Mode toggle ── */}
            <div style={{ display: "flex", marginBottom: 40, border: "1px solid rgba(201,168,76,0.22)", padding: 3, gap: 3 }}>
              {(["founding", "trial"] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  className="mode-btn"
                  onClick={() => switchMode(m)}
                  style={{
                    flex: 1, padding: "11px 0",
                    background: mode === m ? GOLD : "transparent",
                    color: mode === m ? NAVY : "rgba(240,237,228,0.55)",
                    border: "none", cursor: "pointer",
                    ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  }}
                >
                  {m === "founding" ? "Founding Partner" : "48-Hour Trial"}
                </button>
              ))}
            </div>

            {!submitted ? (
              <>
                {/* Form header */}
                <div style={{ marginBottom: 36 }}>
                  <p style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: TEAL, marginBottom: 14 }}>
                    {mode === "founding" ? "Access Request" : "Trial Access"}
                  </p>
                  <h1 style={{ ...CG, fontSize: 34, fontWeight: 700, color: IVORY, lineHeight: 1.2, marginBottom: 12 }}>
                    {mode === "founding" ? "Apply for Founding Partner Access" : "Request 48-Hour Trial Access"}
                  </h1>
                  <p style={{ ...BC, fontSize: 13, color: "rgba(240,237,228,0.78)", lineHeight: 1.6, letterSpacing: "0.01em" }}>
                    {mode === "founding"
                      ? "We'll review your application and reach out within 48 hours — directly from the founder, not a sales team."
                      : "Get full platform access instantly. Every capability unlocked — live trigger detection, 180 Protocols, Mission Control. No commitment required."}
                  </p>

                  {mode === "founding" && (
                    <div style={{ marginTop: 20, padding: "14px 18px", borderLeft: `2px solid ${GOLD}`, background: "rgba(201,168,76,0.05)" }}>
                      <p style={{ ...CG, fontSize: 14, fontStyle: "italic", color: "rgba(240,237,228,0.7)", lineHeight: 1.6, margin: 0 }}>
                        Picture 9:12am — a high-stakes situation presents itself at 9:00. Your organization is already executing: every role activated, every task assigned, every stakeholder notified. Your competitor is scheduling their first call.
                      </p>
                    </div>
                  )}

                  {mode === "trial" && (
                    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { icon: Zap, text: "Activation link delivered in under 60 seconds" },
                        { icon: Lock, text: "Full platform — no feature restrictions" },
                        { icon: Clock, text: "48 hours from the moment you activate" },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(201,168,76,0.1)" }}>
                            <Icon size={13} color={GOLD} />
                          </div>
                          <span style={{ ...BC, fontSize: 12, color: "rgba(240,237,228,0.65)", letterSpacing: "0.02em" }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
                      <div style={{ marginBottom: 28 }}>
                        <label style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,228,0.72)", display: "block", marginBottom: 6 }}>First Name</label>
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                          <FormItem>
                            <FormControl><MinimalInput field={field} placeholder="Jane" /></FormControl>
                            <FormMessage className="text-xs mt-1" style={{ color: "#EF4444" }} />
                          </FormItem>
                        )} />
                      </div>

                      <div style={{ marginBottom: 28 }}>
                        <label style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,228,0.72)", display: "block", marginBottom: 6 }}>Last Name</label>
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                          <FormItem>
                            <FormControl><MinimalInput field={field} placeholder="Smith" /></FormControl>
                            <FormMessage className="text-xs mt-1" style={{ color: "#EF4444" }} />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <label style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,228,0.72)", display: "block", marginBottom: 6 }}>Work Email</label>
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormControl><MinimalInput field={field} placeholder="jane.smith@company.com" type="email" /></FormControl>
                          <FormMessage className="text-xs mt-1" style={{ color: "#EF4444" }} />
                        </FormItem>
                      )} />
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <label style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,228,0.72)", display: "block", marginBottom: 6 }}>Company</label>
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem>
                          <FormControl><MinimalInput field={field} placeholder="Acme Corporation" /></FormControl>
                          <FormMessage className="text-xs mt-1" style={{ color: "#EF4444" }} />
                        </FormItem>
                      )} />
                    </div>

                    <div style={{ marginBottom: mode === "founding" ? 28 : 40 }}>
                      <label style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,228,0.72)", display: "block", marginBottom: 6 }}>Title / Role</label>
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormControl><MinimalInput field={field} placeholder="Chief Strategy Officer" /></FormControl>
                          <FormMessage className="text-xs mt-1" style={{ color: "#EF4444" }} />
                        </FormItem>
                      )} />
                    </div>

                    {/* Execution challenge — Founding Partner only */}
                    {mode === "founding" && (
                      <div style={{ marginBottom: 40 }}>
                        <label style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,228,0.72)", display: "block", marginBottom: 6 }}>
                          Your Biggest Execution Challenge <span style={{ color: "rgba(240,237,228,0.35)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "none" }}>— optional</span>
                        </label>
                        <FormField control={form.control} name="executionChallenge" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <textarea
                                {...field}
                                rows={3}
                                placeholder="Describe the coordination gap your organization faces when a major situation presents itself…"
                                className="request-field"
                                style={{ ...fieldStyle, resize: "none", lineHeight: 1.55, paddingTop: 8 }}
                              />
                            </FormControl>
                          </FormItem>
                        )} />
                        <div style={{ marginTop: 10 }}>
                          <p style={{ ...BC, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,228,0.35)", marginBottom: 7 }}>Examples — tap to use</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {CHALLENGE_EXAMPLES.map((ex) => (
                              <button
                                key={ex}
                                type="button"
                                onClick={() => form.setValue("executionChallenge", ex)}
                                style={{
                                  ...BC, fontSize: 10, fontWeight: 500, letterSpacing: "0.02em",
                                  color: "rgba(240,237,228,0.55)",
                                  background: "rgba(240,237,228,0.04)",
                                  border: "1px solid rgba(240,237,228,0.12)",
                                  padding: "5px 10px",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  transition: "border-color 0.15s, color 0.15s",
                                  borderRadius: "0.15rem",
                                }}
                                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "rgba(201,168,76,0.4)"; el.style.color = GOLD; }}
                                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "rgba(240,237,228,0.12)"; el.style.color = "rgba(240,237,228,0.55)"; }}
                              >
                                {ex}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMutation.isError && (
                      <p style={{ ...BC, fontSize: 12, color: "#EF4444", marginBottom: 20 }}>
                        Something went wrong. Email <a href="mailto:founding@vaughnmartin.com" style={{ color: GOLD }}>founding@vaughnmartin.com</a>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={activeMutation.isPending}
                      className="access-submit"
                      data-testid="request-access-submit"
                      style={{
                        width: "100%", padding: "16px 0",
                        background: mode === "founding" ? "transparent" : GOLD,
                        border: mode === "founding" ? `1px solid rgba(201,168,76,0.5)` : "none",
                        color: mode === "founding" ? GOLD : NAVY,
                        ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                        cursor: activeMutation.isPending ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        transition: "background 0.2s ease, border-color 0.2s ease",
                        opacity: activeMutation.isPending ? 0.6 : 1,
                      }}
                    >
                      {activeMutation.isPending ? (
                        <><Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> Sending your link…</>
                      ) : mode === "founding" ? (
                        "Submit Application"
                      ) : (
                        "Send My Activation Link →"
                      )}
                    </button>

                    {mode === "trial" && (
                      <p style={{ ...BC, fontSize: 11, color: "rgba(240,237,228,0.45)", textAlign: "center", marginTop: 16, letterSpacing: "0.02em", lineHeight: 1.6 }}>
                        After your trial, apply for the full{" "}
                        <button type="button" onClick={() => switchMode("founding")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", padding: 0, ...BC, fontSize: 11, fontWeight: 600 }}>
                          Founding Partner Program
                        </button>.
                      </p>
                    )}

                    {mode === "founding" && (
                      <p style={{ ...BC, fontSize: 11, color: "rgba(240,237,228,0.45)", textAlign: "center", marginTop: 16, letterSpacing: "0.02em", lineHeight: 1.6 }}>
                        Not ready to apply?{" "}
                        <button type="button" onClick={() => switchMode("trial")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", padding: 0, ...BC, fontSize: 11, fontWeight: 600 }}>
                          Request a 48-hour trial instead
                        </button>.
                      </p>
                    )}
                  </form>
                </Form>
              </>
            ) : (
              /* ── Success state ── */
              <div>
                <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, transparent, ${GOLD})`, margin: "0 auto 32px" }} />

                <p style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: TEAL, marginBottom: 14, textAlign: "center" }}>
                  {mode === "founding" ? "Application Received" : "Trial Access Requested"}
                </p>
                <h2 style={{ ...CG, fontSize: 40, fontWeight: 700, color: IVORY, textAlign: "center", lineHeight: 1.15, marginBottom: 12 }}>
                  Your link is on its way.
                </h2>
                <p style={{ ...BC, fontSize: 13, color: "rgba(240,237,228,0.75)", textAlign: "center", marginBottom: 6, lineHeight: 1.6 }}>
                  Sent to <strong style={{ color: IVORY, fontWeight: 600 }}>{submittedEmail}</strong>
                </p>
                <p style={{ ...BC, fontSize: 11, color: "rgba(240,237,228,0.6)", textAlign: "center", marginBottom: 48, letterSpacing: "0.04em" }}>
                  {mode === "founding" ? "We'll follow up within 48 hours — directly from the founder." : "48-hour session · full platform · no password required"}
                </p>

                {mode === "trial" && (
                  <div style={{ marginBottom: 36, padding: "16px 20px", borderLeft: `2px solid ${GOLD}`, background: "rgba(201,168,76,0.05)" }}>
                    <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase", marginBottom: 10 }}>What happens next</div>
                    {[
                      { step: "01", text: "Click the activation link in your email" },
                      { step: "02", text: "Full platform access unlocks instantly — no password" },
                      { step: "03", text: "Your 48-hour session begins automatically" },
                      { step: "04", text: "Apply for Founding Partner Access before your session expires" },
                    ].map(({ step, text }) => (
                      <div key={step} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                        <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: "0.08em", flexShrink: 0, marginTop: 2 }}>{step}</span>
                        <span style={{ ...BC, fontSize: 12, color: "rgba(240,237,228,0.55)", lineHeight: 1.5, letterSpacing: "0.02em" }}>{text}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ borderTop: "1px solid rgba(240,237,228,0.08)", paddingTop: 32 }}>
                  <p style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,228,0.65)", marginBottom: 20 }}>
                    While you wait
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {[
                      { href: "/12-minute-experience", label: "Take the 12-Minute Test Drive", tag: "Interactive" },
                      { href: "/industry-demos", label: "See Your Industry Scenario", tag: "Vertical" },
                      { href: "/roi-calculator", label: "Calculate Your Execution ROI", tag: "Calculator" },
                    ].map(({ href, label, tag }, i) => (
                      <a
                        key={href}
                        href={href}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "14px 0",
                          borderBottom: i < 2 ? "1px solid rgba(240,237,228,0.06)" : "none",
                          textDecoration: "none", gap: 12,
                        }}
                      >
                        <span style={{ ...BC, fontSize: 12, fontWeight: 500, color: "rgba(240,237,228,0.55)", letterSpacing: "0.02em" }}>{label}</span>
                        <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, flexShrink: 0 }}>{tag} →</span>
                      </a>
                    ))}
                  </div>
                </div>

                <p style={{ ...BC, fontSize: 10, color: "rgba(240,237,228,0.4)", textAlign: "center", marginTop: 28, letterSpacing: "0.04em" }}>
                  Not in your inbox? Check spam or email{" "}
                  <a href="mailto:founding@vaughnmartin.com" style={{ color: "rgba(201,168,76,0.5)", textDecoration: "none" }}>founding@vaughnmartin.com</a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
