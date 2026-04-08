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
import { CheckCircle, Loader2, Mail, Shield } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid work email"),
  company: z.string().min(1, "Required"),
  title: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

export default function RequestAccess() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", company: "", title: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/auth/magic-link/request", data),
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setSubmitted(true);
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <div className="min-h-screen flex" style={{ background: "#F8F7F4" }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-12"
        style={{ background: NAVY }}
      >
        <div>
          <VaughnMartinLogo color="light" height={44} variant="full" />
        </div>

        <div>
          <div
            className="inline-block px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-6"
            style={{ background: "rgba(201,168,76,0.15)", color: GOLD, border: "1px solid rgba(201,168,76,0.3)" }}
          >
            Executive Access
          </div>
          <h2 className="text-3xl font-bold leading-tight mb-4" style={{ color: "#ffffff" }}>
            From trigger to full execution
            <span style={{ color: GOLD }}> in 12 minutes.</span>
          </h2>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.6)" }}>
            Enterprise work was designed for a world without AI. Command OS rebuilds how decisions move — 170 pre-staged playbooks, continuous signal monitoring, 3,600× execution head start.
          </p>

          <div className="space-y-4">
            {[
              { stat: "170", label: "Pre-staged playbooks" },
              { stat: "12 min", label: "Trigger to full coordination" },
              { stat: "3,600×", label: "Execution head start" },
            ].map(({ stat, label }) => (
              <div key={stat} className="flex items-center gap-4">
                <div className="text-xl font-bold" style={{ color: GOLD, minWidth: 72 }}>{stat}</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          © VaughnMartin · vaughnmartin.com
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[480px]">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <VaughnMartinLogo color="dark" height={36} variant="full" />
          </div>

          {!submitted ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>
                  Request Executive Access
                </h1>
                <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                  We'll send a secure link to your email. Click once and you're inside the live platform — no password, no commitment.
                </p>
                <div
                  className="flex items-start gap-3 p-3 rounded-lg text-xs leading-relaxed"
                  style={{ background: "rgba(43,138,110,0.07)", border: "1px solid rgba(43,138,110,0.2)" }}
                >
                  <span style={{ color: TEAL, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ color: "#374151" }}>
                    <strong style={{ color: NAVY }}>This grants you Executive Access to the live platform</strong> — not the Pilot Program.{" "}
                    The <a href="/pilot-program" style={{ color: GOLD, fontWeight: 600 }}>Pilot Program</a> is a separate formal engagement for Fortune 1000 enterprises ($75K).
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold tracking-wide uppercase" style={{ color: NAVY }}>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold tracking-wide uppercase" style={{ color: NAVY }}>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Smith" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold tracking-wide uppercase" style={{ color: NAVY }}>Work Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane.smith@company.com" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold tracking-wide uppercase" style={{ color: NAVY }}>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold tracking-wide uppercase" style={{ color: NAVY }}>Title / Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Chief Strategy Officer" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {mutation.isError && (
                    <p className="text-sm text-red-600">
                      Something went wrong. Please try again or email{" "}
                      <a href="mailto:pilot@vaughnmartin.com" className="underline">pilot@vaughnmartin.com</a>.
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full h-12 text-sm font-bold tracking-wide"
                    style={{ background: GOLD, color: NAVY }}
                  >
                    {mutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending your link…</>
                    ) : (
                      <><Mail className="h-4 w-4 mr-2" /> Send My Access Link</>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="flex items-center gap-2 mt-6">
                <Shield className="h-3.5 w-3.5 flex-shrink-0" style={{ color: TEAL }} />
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Your link expires in 24 hours and works for a single sign-in. No password, no subscription required.
                </p>
              </div>
            </>
          ) : (
            /* Success state — enriched */
            <div className="py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(43,138,110,0.12)" }}
              >
                <CheckCircle className="h-8 w-8" style={{ color: TEAL }} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: NAVY }}>Your link is on its way</h2>
              <p className="text-sm text-center mb-1" style={{ color: "#4B5563" }}>
                We've sent your access link to
              </p>
              <p className="text-sm font-bold text-center mb-1" style={{ color: NAVY }}>{submittedEmail}</p>
              <p className="text-xs text-center mb-8" style={{ color: "#9CA3AF" }}>
                Valid for 24 hours · single sign-in · no password required
              </p>

              {/* Next steps — 3 cards */}
              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: NAVY }}>
                  While you wait — explore the platform
                </p>
                <div className="space-y-3">
                  {[
                    {
                      href: "/try-demo",
                      label: "Watch the 12-Minute Test Drive",
                      desc: "See a trigger fire, playbooks activate, and stakeholders coordinate in real time.",
                      badge: "Interactive",
                    },
                    {
                      href: "/industry-demos",
                      label: "See Your Industry Scenario",
                      desc: "Financial services, pharma, manufacturing, luxury — pick the scenario closest to your risk profile.",
                      badge: "Vertical",
                    },
                    {
                      href: "/roi-calculator",
                      label: "Calculate Your Execution ROI",
                      desc: "Estimate annual value, executive time saved, and revenue protected for your organization.",
                      badge: "Calculator",
                    },
                  ].map(({ href, label, desc, badge }) => (
                    <a
                      key={href}
                      href={href}
                      className="flex items-start gap-3 p-3 block transition-colors"
                      style={{ border: "1px solid #E8E4DC", background: "#fff", textDecoration: "none" }}
                    >
                      <div
                        className="flex-shrink-0 mt-0.5 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
                        style={{ background: "rgba(10,15,46,0.06)", color: NAVY, whiteSpace: "nowrap" }}
                      >
                        {badge}
                      </div>
                      <div>
                        <p className="text-xs font-bold mb-0.5" style={{ color: NAVY }}>{label}</p>
                        <p className="text-[11px] leading-relaxed" style={{ color: "#6B7280" }}>{desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Pilot CTA */}
              <div
                className="p-4 text-center"
                style={{ background: "rgba(10,15,46,0.04)", border: "1px solid rgba(10,15,46,0.08)" }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: NAVY }}>
                  Ready for a formal engagement?
                </p>
                <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
                  The 90-day Fortune 1000 Pilot Program ($75K flat) runs alongside platform access.
                </p>
                <a href="/pilot-program" style={{ color: GOLD, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  View Pilot Program details →
                </a>
              </div>

              <p className="text-xs text-center mt-5" style={{ color: "#9CA3AF" }}>
                Link not in your inbox? Check spam or email{" "}
                <a href="mailto:pilot@vaughnmartin.com" style={{ color: GOLD }}>pilot@vaughnmartin.com</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
