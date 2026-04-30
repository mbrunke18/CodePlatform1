import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { CheckCircle, Clock, Loader2, Lock, Zap } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid work email"),
  company: z.string().min(1, "Required"),
  title: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

export default function TrialAccess() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", company: "", title: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/trial/request", data),
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setSubmitted(true);
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Background grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(43,138,110,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 480, width: "100%", padding: "0 32px", textAlign: "center" }}>
          {/* Overline */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 28, height: 1, background: GOLD }} />
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD, fontFamily: "'Barlow Condensed', sans-serif" }}>Trial Access · Readiness OS</span>
            <div style={{ width: 28, height: 1, background: GOLD }} />
          </div>
          {/* Heading */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,5vw,48px)", fontWeight: 600, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
            Your link is<br /><em style={{ color: GOLD, fontStyle: "italic" }}>on its way.</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em", marginBottom: 4 }}>
            Activation link sent to
          </p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.02em", marginBottom: 40 }}>
            {submittedEmail}
          </p>
          {/* What happens next */}
          <div style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 20, marginBottom: 40, textAlign: "left" }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 14 }}>What happens next</div>
            {[
              { step: "01", text: "Click the activation link in your email" },
              { step: "02", text: "Full platform access unlocks instantly — no password" },
              { step: "03", text: "Your 48-hour session begins automatically" },
              { step: "04", text: "Apply for Founding Partner Access before your session expires" },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: GOLD, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em", flexShrink: 0, marginTop: 2 }}>{step}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.5, letterSpacing: "0.02em" }}>{text}</span>
              </div>
            ))}
          </div>
          {/* Explore links */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 28, marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.25)", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 16 }}>While you wait</div>
            {[
              { href: "/12-minute-experience", label: "Take the 12-Minute Test Drive", tag: "Interactive" },
              { href: "/industry-demos", label: "See Your Industry Scenario", tag: "Vertical" },
              { href: "/roi-calculator", label: "Calculate Your Execution ROI", tag: "Calculator" },
            ].map(({ href, label, tag }, i) => (
              <a key={href} href={href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", textDecoration: "none", gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em" }}>{label}</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: GOLD, flexShrink: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>{tag} →</span>
              </a>
            ))}
          </div>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}>
            Not in your inbox? Check spam or email{" "}
            <a href="mailto:pilot@vaughnmartin.com" style={{ color: "rgba(201,168,76,0.5)", textDecoration: "none" }}>pilot@vaughnmartin.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#F8F7F4" }}>
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-12" style={{ background: NAVY }}>
        <div>
          <VaughnMartinLogo color="light" height={44} variant="full" />
        </div>
        <div>
          <div className="inline-block px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "rgba(201,168,76,0.15)", color: GOLD, border: "1px solid rgba(201,168,76,0.3)" }}>
            48-Hour Full Access
          </div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ lineHeight: 1.25 }}>
            See the full platform.<br />No commitment required.
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            Request access and get an activation link instantly. Your 48-hour session unlocks every capability — live trigger detection, 170 Readiness Protocols, Mission Control, and the complete IDEA Framework.
          </p>
          <div className="space-y-4">
            {[
              { icon: Zap, text: "Activation link delivered in under 60 seconds" },
              { icon: Lock, text: "Full platform — no feature restrictions" },
              { icon: Clock, text: "48 hours from the moment you activate" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201,168,76,0.15)" }}>
                  <Icon size={14} color={GOLD} />
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Reserved for senior executives and qualified organizations.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div className="mb-8 lg:hidden">
            <VaughnMartinLogo color="dark" height={40} variant="full" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>Get 48-Hour Full Access</h1>
          <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
            Fill in your details and we'll send your activation link immediately.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider" style={{ color: "#374151" }}>First Name</FormLabel>
                    <FormControl><Input placeholder="Jane" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider" style={{ color: "#374151" }}>Last Name</FormLabel>
                    <FormControl><Input placeholder="Smith" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider" style={{ color: "#374151" }}>Work Email</FormLabel>
                  <FormControl><Input type="email" placeholder="jane@company.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider" style={{ color: "#374151" }}>Company</FormLabel>
                  <FormControl><Input placeholder="Acme Corporation" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider" style={{ color: "#374151" }}>Title</FormLabel>
                  <FormControl><Input placeholder="Chief Strategy Officer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {mutation.isError && (
                <p className="text-sm text-red-600">{(mutation.error as any)?.message || "Something went wrong. Please try again."}</p>
              )}

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-12 text-sm font-bold uppercase tracking-widest"
                style={{ background: GOLD, color: NAVY, border: "none" }}
              >
                {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Access Link…</> : "Send My Activation Link →"}
              </Button>

              <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
                After your trial, you can apply for the full{" "}
                <a href="/pilot-program" style={{ color: GOLD }}>Pilot Program</a>.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
