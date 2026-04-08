import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import { CheckCircle2, Shield, Zap, Target } from "lucide-react";
import { useLocation } from "wouter";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

const earlyAccessSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Valid email required"),
  company: z.string().min(1, "Company name required"),
  title: z.string().min(1, "Job title required"),
  companySize: z.string().min(1, "Please select company size"),
  primaryChallenge: z.string().min(10, "Please describe your challenge (min 10 characters)"),
  scenariosOfInterest: z.string().min(5, "Please share scenario examples"),
});

type EarlyAccessForm = z.infer<typeof earlyAccessSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Request Pilot Access - Readiness OS Now in Pilot",
      description: "Join Readiness OS' exclusive pilot program. Limited to 10 Fortune 1000 companies for 90-day validation partnership. Transform strategic execution from days to minutes.",
      ogTitle: "Request Pilot Access - Readiness OS Pilot Program",
      ogDescription: "Limited pilot opportunity for Fortune 1000 companies. 90-day validation partnership. Now accepting applications.",
    });
  }, []);

  const form = useForm<EarlyAccessForm>({
    resolver: zodResolver(earlyAccessSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      title: "",
      companySize: "",
      primaryChallenge: "",
      scenariosOfInterest: "",
    },
  });

  const onSubmit = async (data: EarlyAccessForm) => {
    try {
      const res = await fetch('/api/pilot/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Submission failed');

      toast({
        title: "Application Received!",
        description: "Creating your account now — you'll be redirected to set up your workspace.",
      });

      form.reset();

      setTimeout(() => {
        window.location.href = '/api/login';
      }, 1500);
    } catch {
      toast({
        title: "Submission Failed",
        description: "Please try again or email us at sales@vaughnmartin.com",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <div className="bg-[#F8F7F4]">
        {/* Hero Section - Navy */}
        <section style={{ background: "#0A0F2E", padding: "64px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Now in Pilot</span>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
              Request <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Pilot Access</em>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Join an exclusive group of 10 Fortune 1000 companies transforming strategic execution 
              through Readiness OS' 90-day validation partnership.
            </p>
            <div className="flex gap-8 justify-center flex-wrap">
              {[
                { icon: Shield, label: "Limited to 10 Partners" },
                { icon: Zap, label: "Pilot Active Now" },
                { icon: Target, label: "90-Day Validation" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: GOLD }} />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Form Section */}
        <section className="py-20 px-12 bg-[#F8F7F4]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12">
            {/* Left Column - Value Proposition */}
            <div className="md:col-span-4">
              <div style={{ border: "1px solid #E8E4DC", padding: "32px", background: "#F8F7F4" }} className="sticky top-24">
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "#0A0F2E", marginBottom: 24 }}>Pilot Partner Benefits</h3>
                <div className="space-y-6">
                  {[
                    { title: "Full Platform Access", desc: "Complete 7-component ecosystem during validation period" },
                    { title: "Strategic Implementation", desc: "Dedicated support for 3-5 critical scenarios" },
                    { title: "First-Mover Advantage", desc: "Category leadership in Executive Decision Operations" },
                    { title: "Risk-Free Validation", desc: "Prove ROI in your context before full commitment" }
                  ].map((benefit) => (
                    <div key={benefit.title} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: TEAL }} />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{benefit.title}</div>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#0A0F2E", borderLeft: `4px solid ${GOLD}`, padding: "20px", marginTop: "32px" }}>
                  <p style={{ color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 8 }}>Selection Process</p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Executive interview → Use case assessment → Partnership agreement → Week 1 onboarding
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="md:col-span-8">
              <div style={{ border: "1px solid #E8E4DC", padding: "40px" }}>
                <div className="mb-10">
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "#0A0F2E", marginBottom: 8 }}>Application Form</h2>
                  <p className="text-slate-500">
                    Help us understand your strategic execution challenges and pilot readiness.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0A0F2E] font-bold uppercase text-[10px] tracking-widest">First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} className="border-[#E8E4DC] focus:border-[#0A0F2E] rounded-none h-12" />
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
                            <FormLabel className="text-[#0A0F2E] font-bold uppercase text-[10px] tracking-widest">Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Smith" {...field} className="border-[#E8E4DC] focus:border-[#0A0F2E] rounded-none h-12" />
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
                          <FormLabel className="text-[#0A0F2E] font-bold uppercase text-[10px] tracking-widest">Business Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.smith@company.com" {...field} className="border-[#E8E4DC] focus:border-[#0A0F2E] rounded-none h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0A0F2E] font-bold uppercase text-[10px] tracking-widest">Company Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Corporation" {...field} className="border-[#E8E4DC] focus:border-[#0A0F2E] rounded-none h-12" />
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
                            <FormLabel className="text-[#0A0F2E] font-bold uppercase text-[10px] tracking-widest">Job Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="VP of Strategy" {...field} className="border-[#E8E4DC] focus:border-[#0A0F2E] rounded-none h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0A0F2E] font-bold uppercase text-[10px] tracking-widest">Company Size *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-[#E8E4DC] focus:border-[#0A0F2E] rounded-none h-12">
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10000+">10,000+ (Fortune 1000)</SelectItem>
                              <SelectItem value="5000-10000">5,000-10,000</SelectItem>
                              <SelectItem value="1000-5000">1,000-5,000</SelectItem>
                              <SelectItem value="500-1000">500-1,000</SelectItem>
                              <SelectItem value="<500">Less than 500</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="primaryChallenge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0A0F2E] font-bold uppercase text-[10px] tracking-widest">Execution Challenge *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your primary strategic execution challenge..."
                              className="min-h-[120px] border-[#E8E4DC] focus:border-[#0A0F2E] rounded-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div style={{ background: "#F8F7F4", borderLeft: `4px solid ${GOLD}`, padding: "24px" }}>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-[#0A0F2E]">Note:</strong> Readiness OS is in pre-launch. This pilot program is designed to validate 12-minute execution goals in real-world environments. Selection is limited to 10 companies.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white font-bold uppercase tracking-widest text-sm py-8 rounded-none"
                    >
                      Submit Pilot Request
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting Information */}
        <section className="py-24 px-12 bg-[#F8F7F4] border-t border-[#E8E4DC]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 600, color: "#0A0F2E", marginBottom: 16 }}>
              Questions About the Pilot Program?
            </h2>
            <p className="text-slate-600 mb-10 text-lg">
              Reach out directly or learn more about program structure and success metrics.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <a href="mailto:sales@vaughnmartin.com" className="text-lg font-bold text-[#0A0F2E] hover:text-[#C9A84C] transition-colors border-b-2 border-[#C9A84C] pb-1">
                sales@vaughnmartin.com
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { label: "How It Works", path: "/platform-overview" },
                { label: "170 Playbooks", path: "/playbook-library" },
                { label: "Our Story", path: "/our-story" }
              ].map((link) => (
                <Button
                  key={link.label}
                  onClick={() => setLocation(link.path)}
                  variant="outline"
                  className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none uppercase tracking-widest text-[10px] font-bold px-8 h-12"
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
