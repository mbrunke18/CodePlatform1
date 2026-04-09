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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F7F4" }}>
        <div className="max-w-md w-full mx-auto text-center px-8 py-12" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(201,168,76,0.12)" }}>
            <CheckCircle size={32} color={GOLD} />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>Check Your Email</h1>
          <p className="text-sm mb-2" style={{ color: "#374151" }}>
            Your 48-hour trial activation link has been sent to:
          </p>
          <p className="font-bold mb-6" style={{ color: NAVY }}>{submittedEmail}</p>
          <div className="text-left p-4 mb-6" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} color={GOLD} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>What Happens Next</span>
            </div>
            <ul className="text-sm space-y-1" style={{ color: "#374151" }}>
              <li>1. Click the activation link in your email</li>
              <li>2. Full platform access unlocks instantly</li>
              <li>3. Your 24-hour session begins automatically</li>
              <li>4. Apply for the Pilot Program before it expires</li>
            </ul>
          </div>
          <a href="/" className="text-sm" style={{ color: GOLD }}>← Return to homepage</a>
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
            Request access and get an activation link instantly. Your 48-hour session unlocks every capability — live trigger detection, 170 playbooks, Mission Control, and the complete IDEA Framework.
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
