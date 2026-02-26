import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { updatePageMetadata } from "@/lib/seo";
import { CheckCircle2, Shield, Zap, Target } from "lucide-react";
import { useLocation } from "wouter";

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
      title: "Request Early Access - Execution OS Q1 2026 Pilot Program",
      description: "Join Execution OS' exclusive Q1 2026 pilot program. Limited to 10 Fortune 1000 companies for 90-day validation partnership. Transform strategic execution from days to minutes.",
      ogTitle: "Request Early Access - Execution OS Pilot Program",
      ogDescription: "Limited pilot opportunity for Fortune 1000 companies. 90-day validation partnership starting Q1 2026.",
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

      // Redirect to login to begin the real onboarding experience
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 1500);
    } catch {
      toast({
        title: "Submission Failed",
        description: "Please try again or email us at mbrunke@vaughnmartin.com",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <PageHero
        eyebrow="Q1 2026 Pilot Program"
        title="Request Early Access Interview"
        subtitle="Join an exclusive group of 10 Fortune 1000 companies transforming strategic execution through Execution OS' 90-day validation partnership."
        size="lg"
      >
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          {[
            { icon: Shield, label: "Limited to 10 Partners" },
            { icon: Zap, label: "Q1 2026 Launch" },
            { icon: Target, label: "90-Day Validation" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon style={{ width: 16, height: 16, color: "#C9A84C" }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(240,237,228,0.8)" }}>{label}</span>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Main Form Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Left Column - Value Proposition */}
          <div className="md:col-span-1">
            <Card className="sticky top-24" data-testid="card-pilot-benefits">
              <CardHeader>
                <CardTitle className="text-2xl">Pilot Partner Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Full Platform Access</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">Complete 7-component ecosystem during validation period</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Strategic Implementation</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">Dedicated support for 3-5 critical scenarios</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">First-Mover Advantage</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">Category leadership in Executive Decision Operations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Risk-Free Validation</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">Prove ROI in your context before full commitment</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Selection Process:</strong> Executive interview → Use case assessment → Partnership agreement → Week 1 onboarding
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form */}
          <div className="md:col-span-2">
            <Card data-testid="card-early-access-form">
              <CardHeader>
                <CardTitle className="text-3xl">Tell Us About Your Organization</CardTitle>
                <p className="text-slate-700 dark:text-slate-300">
                  Help us understand your strategic execution challenges and pilot readiness.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} data-testid="input-first-name" />
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
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Smith" {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.smith@company.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Company & Title */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Corporation" {...field} data-testid="input-company" />
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
                            <FormLabel>Job Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="VP of Strategy" {...field} data-testid="input-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Company Size */}
                    <FormField
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size (Employees) *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-company-size">
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

                    {/* Primary Challenge */}
                    <FormField
                      control={form.control}
                      name="primaryChallenge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Strategic Execution Challenge *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Example: We miss 60% of market opportunities due to slow stakeholder coordination. By the time we align cross-functional teams, competitors have already moved."
                              className="min-h-[100px]"
                              {...field}
                              data-testid="textarea-challenge"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Scenarios of Interest */}
                    <FormField
                      control={form.control}
                      name="scenariosOfInterest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strategic Scenarios You'd Like to Operationalize *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Example: Competitive response to new entrant, M&A opportunity evaluation, product recall crisis, regulatory change adaptation"
                              className="min-h-[100px]"
                              {...field}
                              data-testid="textarea-scenarios"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Disclaimer */}
                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-sm text-yellow-900 dark:text-yellow-200">
                        <strong>Note:</strong> Execution OS is in pre-launch with zero production customers. This pilot program is designed to validate our design goals (12-minute execution vs 72-hour industry standard) in real-world Fortune 1000 environments. Selection is limited to 10 companies with clear strategic fit and implementation readiness.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-gray-900 text-lg py-6"
                      data-testid="button-submit-early-access"
                    >
                      Submit Early Access Request
                    </Button>

                    <p className="text-sm text-center text-slate-700 dark:text-slate-300">
                      Our team will review your request and contact you within 48 hours to schedule an executive interview.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Supporting Information */}
      <section className="py-16 px-6 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
            Questions About the Pilot Program?
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
            Reach out directly or learn more about program structure and success metrics.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="mailto:mbrunke@vaughnmartin.com" className="text-lg font-medium text-blue-800 dark:text-blue-400 hover:underline">
              mbrunke@vaughnmartin.com
            </a>
            <a href="https://www.executeiq.io" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-blue-800 dark:text-blue-400 hover:underline">
              www.executeiq.io
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => setLocation("/how-it-works")}
              variant="outline"
              size="lg"
              data-testid="button-see-demo"
            >
              See How Execution OS Works
            </Button>
            <Button
              onClick={() => setLocation("/playbook-library")}
              variant="outline"
              size="lg"
              data-testid="button-view-scenarios"
            >
              View 170 Playbooks
            </Button>
            <Button
              onClick={() => setLocation("/our-story")}
              variant="outline"
              size="lg"
              data-testid="button-our-story"
            >
              Read Our Story
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
