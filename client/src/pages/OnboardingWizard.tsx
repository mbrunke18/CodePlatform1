import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import {
  Building2, Users, Layers, CheckCircle, ChevronRight, ChevronLeft,
  Zap, Clock, Calendar, Mail, Target, Shield, TrendingUp, ArrowRight,
  AlertTriangle, Star, Check,
} from 'lucide-react';

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";

const PHASE_1_STEPS = [
  { id: 'profile', title: 'Organization Profile', subtitle: 'Your company and key contacts', icon: Building2 },
  { id: 'idea', title: 'IDEA Framework Setup', subtitle: 'Map decision rights and ownership', icon: Target },
  { id: 'playbooks', title: 'Priority Playbooks', subtitle: 'Select your highest-priority scenarios', icon: Layers },
];

const PLAYBOOK_OPTIONS = [
  { name: 'Financial Crisis Response', domain: 'Financial', count: 24 },
  { name: 'Competitive Intelligence', domain: 'Competitive', count: 22 },
  { name: 'Regulatory Response', domain: 'Regulatory', count: 19 },
  { name: 'M&A Integration', domain: 'M&A', count: 18 },
  { name: 'Crisis & Reputation', domain: 'Crisis', count: 20 },
  { name: 'Go-to-Market Activation', domain: 'GTM', count: 21 },
  { name: 'Talent & Leadership', domain: 'Talent', count: 16 },
  { name: 'Technology & Digital', domain: 'Technology', count: 17 },
  { name: 'Strategic Opportunity', domain: 'Opportunity', count: 13 },
];

const DOMAIN_OWNERS = [
  { domain: 'Financial Response', placeholder: 'e.g. CFO, VP Finance' },
  { domain: 'Competitive Intelligence', placeholder: 'e.g. CSO, VP Strategy' },
  { domain: 'Regulatory & Compliance', placeholder: 'e.g. General Counsel, CCO' },
  { domain: 'Crisis & Communications', placeholder: 'e.g. COO, VP Communications' },
  { domain: 'Technology & Operations', placeholder: 'e.g. CTO, CIO' },
  { domain: 'Talent & Organization', placeholder: 'e.g. CHRO, VP People' },
];

type Phase = 'journey' | 'step' | 'complete';

export default function OnboardingWizard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [view, setView] = useState<Phase>('journey');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const [orgData, setOrgData] = useState({
    companyName: '',
    industry: '',
    employeeCount: '',
    primaryContact: '',
    primaryEmail: '',
    primaryRole: '',
    departments: ['Executive', 'Operations', 'Finance', 'Legal', 'Communications'],
  });

  const [ideaData, setIdeaData] = useState({
    executiveSponsor: '',
    pmoContact: '',
    responseTarget: '12',
    domainOwners: DOMAIN_OWNERS.map(d => ({ domain: d.domain, owner: '' })),
    approvalRequired: true,
    budgetThreshold: '100000',
  });

  const [playbookData, setPlaybookData] = useState({
    selected: ['Financial Crisis Response', 'Competitive Intelligence', 'Crisis & Reputation'],
    triggerAlerts: true,
    autoEscalation: true,
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        apiRequest('PATCH', '/api/organizations/current', {
          industry: orgData.industry,
          size: parseInt(orgData.employeeCount) || 0,
          settings: { playbooks: playbookData, ideaConfig: ideaData },
        }).catch(() => {}),
        ...orgData.departments.map(dept =>
          apiRequest('POST', '/api/config/departments', { name: dept, description: `${dept} department` }).catch(() => {})
        ),
        apiRequest('POST', '/api/config/success-metrics', {
          name: 'Decision Velocity',
          metricType: 'velocity',
          targetValue: parseInt(ideaData.responseTarget) || 12,
          currentValue: 18,
          baselineValue: 45,
          unit: 'minutes',
          reviewCadence: 'daily',
        }).catch(() => {}),
      ]);
      await apiRequest('POST', '/api/onboarding/complete', {}).catch(() => {});
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setView('complete');
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setView('complete');
    },
  });

  const handleStepNext = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    if (currentStep < PHASE_1_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboardingMutation.mutate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else setView('journey');
  };

  return (
    <PageLayout>
    {view === 'complete' ? (
      <CompleteView orgName={orgData.companyName} onGo={() => setLocation('/dashboard')} />
    ) : view === 'journey' ? (
      <JourneyView
        onBegin={() => setView('step')}
        onSkip={() => completeOnboardingMutation.mutate()}
      />
    ) : (
    <div style={{ background: OFF, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>

      {/* Header */}
      <div style={{ background: NAVY, padding: "0 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)`, backgroundSize: "44px 44px" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 860, margin: "0 auto", padding: "40px 0 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 24, height: 2, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Phase 1 of 3 — Foundation</span>
          </div>
          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,3.5vw,42px)", color: "#fff", marginBottom: 8, lineHeight: 1.1 }}>
            Building Your <em style={{ fontStyle: "italic", color: GOLD_LT }}>Execution Foundation</em>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)", marginBottom: 32, maxWidth: 560 }}>
            This session takes about 20 minutes. We'll configure your org profile, map your IDEA framework, and select your priority playbooks. Integration and activation happen over weeks 1–4 with your implementation team.
          </p>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {PHASE_1_STEPS.map((step, i) => {
              const Icon = step.icon;
              const done = completedSteps.has(i);
              const active = i === currentStep;
              return (
                <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36,
                      background: done ? TEAL : active ? GOLD : "rgba(255,255,255,0.08)",
                      border: `1px solid ${done ? TEAL : active ? GOLD : "rgba(255,255,255,0.15)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {done
                        ? <Check size={16} color="#fff" />
                        : <Icon size={16} color={active ? NAVY : "rgba(255,255,255,0.4)"} />
                      }
                    </div>
                    <div style={{ display: i < 2 ? "block" : "block" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: active ? "#fff" : done ? TEAL_LT : "rgba(255,255,255,0.35)" }}>{step.title}</div>
                      <div style={{ fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.25)" }}>{step.subtitle}</div>
                    </div>
                  </div>
                  {i < PHASE_1_STEPS.length - 1 && (
                    <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.1)", margin: "0 16px" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 48px 120px" }}>

        {/* Gold progress bar */}
        <div style={{ height: 3, background: BORDER, marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: GOLD, transition: "width 0.5s ease", width: `${((currentStep + 1) / PHASE_1_STEPS.length) * 100}%` }} />
        </div>

        {/* STEP 1: Organization Profile */}
        {currentStep === 0 && (
          <div>
            <SectionLabel num="01" text="Organization Profile" />
            <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Tell us about your organization</h2>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 40 }}>This configures your Execution OS workspace and personalizes your implementation plan.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
              <Field label="Company Name">
                <Input value={orgData.companyName} onChange={e => setOrgData({ ...orgData, companyName: e.target.value })}
                  placeholder="e.g. Acme Corporation" className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11" />
              </Field>
              <Field label="Industry">
                <Select value={orgData.industry} onValueChange={v => setOrgData({ ...orgData, industry: v })}>
                  <SelectTrigger className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11"><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {['Financial Services', 'Technology', 'Healthcare', 'Manufacturing', 'Retail & Consumer', 'Energy & Utilities', 'Gaming & Entertainment', 'Professional Services', 'Other'].map(i => (
                      <SelectItem key={i} value={i.toLowerCase().replace(/\s+/g, '_')}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Approximate Employee Count">
                <Select value={orgData.employeeCount} onValueChange={v => setOrgData({ ...orgData, employeeCount: v })}>
                  <SelectTrigger className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11"><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    {['500–1,000', '1,000–5,000', '5,000–25,000', '25,000–100,000', '100,000+'].map(r => (
                      <SelectItem key={r} value={r}>{r} employees</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Your Role">
                <Select value={orgData.primaryRole} onValueChange={v => setOrgData({ ...orgData, primaryRole: v })}>
                  <SelectTrigger className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11"><SelectValue placeholder="Select your role" /></SelectTrigger>
                  <SelectContent>
                    {['COO', 'CSO / Chief Strategy Officer', 'PMO Leader / VP Operations', 'CIO / CTO', 'CEO', 'CISO', 'CFO', 'Other Executive'].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Primary Contact Name">
                <Input value={orgData.primaryContact} onChange={e => setOrgData({ ...orgData, primaryContact: e.target.value })}
                  placeholder="Full name" className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11" />
              </Field>
              <Field label="Primary Contact Email">
                <Input type="email" value={orgData.primaryEmail} onChange={e => setOrgData({ ...orgData, primaryEmail: e.target.value })}
                  placeholder="name@company.com" className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11" />
              </Field>
            </div>

            <div style={{ marginBottom: 32 }}>
              <Label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: NAVY, display: "block", marginBottom: 12 }}>Key Departments in Scope</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {['Executive', 'Operations', 'Finance', 'Legal', 'Communications', 'IT', 'HR', 'Sales', 'Marketing', 'Risk', 'Compliance'].map(dept => {
                  const active = orgData.departments.includes(dept);
                  return (
                    <button key={dept} onClick={() => setOrgData({ ...orgData, departments: active ? orgData.departments.filter(d => d !== dept) : [...orgData.departments, dept] })}
                      style={{ padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${active ? NAVY : BORDER}`, background: active ? NAVY : "#fff", color: active ? "#fff" : MUTED }}>
                      {dept}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: IDEA Framework */}
        {currentStep === 1 && (
          <div>
            <SectionLabel num="02" text="IDEA Framework Configuration" />
            <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Map your decision rights</h2>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 12 }}>The IDEA Framework works because accountability is pre-defined. When a trigger fires, there's no question of who owns what. Configure that here.</p>

            <div style={{ padding: "16px 20px", background: `rgba(201,168,76,0.08)`, border: `1px solid rgba(201,168,76,0.25)`, marginBottom: 36, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Star size={16} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: NAVY, fontWeight: 400, lineHeight: 1.6 }}>
                <strong style={{ fontWeight: 700 }}>Why this matters:</strong> The 12-minute execution promise is possible because decision rights are mapped before the crisis arrives. This configuration is the most important thing you'll do today.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
              <Field label="Executive Sponsor">
                <Input value={ideaData.executiveSponsor} onChange={e => setIdeaData({ ...ideaData, executiveSponsor: e.target.value })}
                  placeholder="e.g. Jane Smith, COO" className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11" />
              </Field>
              <Field label="PMO / Program Lead">
                <Input value={ideaData.pmoContact} onChange={e => setIdeaData({ ...ideaData, pmoContact: e.target.value })}
                  placeholder="e.g. John Davis, VP Operations" className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11" />
              </Field>
            </div>

            <div style={{ marginBottom: 32 }}>
              <Label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: NAVY, display: "block", marginBottom: 16 }}>Domain Ownership — Who owns each response domain?</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: BORDER }}>
                {DOMAIN_OWNERS.map((dom, i) => (
                  <div key={dom.domain} style={{ background: "#fff", display: "grid", gridTemplateColumns: "200px 1fr", gap: 0 }}>
                    <div style={{ padding: "14px 20px", background: OFF, borderRight: `1px solid ${BORDER}`, display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{dom.domain}</span>
                    </div>
                    <div style={{ padding: "10px 16px" }}>
                      <Input
                        value={ideaData.domainOwners[i].owner}
                        onChange={e => {
                          const updated = [...ideaData.domainOwners];
                          updated[i] = { ...updated[i], owner: e.target.value };
                          setIdeaData({ ...ideaData, domainOwners: updated });
                        }}
                        placeholder={dom.placeholder}
                        className="bg-transparent border-0 text-[#0A0F2E] rounded-none h-8 p-0 focus-visible:ring-0 placeholder:text-[#9CA3AF] text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: MUTED, marginTop: 8 }}>Fields can be updated and refined during your Week 1-2 integration sessions. Rough entries are fine for now.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
              <Field label="Target Execution Time">
                <Select value={ideaData.responseTarget} onValueChange={v => setIdeaData({ ...ideaData, responseTarget: v })}>
                  <SelectTrigger className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['8', '10', '12', '15', '20'].map(t => <SelectItem key={t} value={t}>{t} minutes trigger-to-execution</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Pre-approved Budget Threshold">
                <Select value={ideaData.budgetThreshold} onValueChange={v => setIdeaData({ ...ideaData, budgetThreshold: v })}>
                  <SelectTrigger className="bg-white border-[#E8E4DC] text-[#0A0F2E] rounded-none h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['50000', '100000', '250000', '500000', '1000000'].map(t => (
                      <SelectItem key={t} value={t}>${parseInt(t).toLocaleString()} per playbook activation</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "14px 18px", background: "#fff", border: `1px solid ${BORDER}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Require human approval before playbook activation</div>
                  <div style={{ fontSize: 11, color: MUTED }}>Recommended — AI recommends, humans approve</div>
                </div>
                <Switch checked={ideaData.approvalRequired} onCheckedChange={c => setIdeaData({ ...ideaData, approvalRequired: c })} className="data-[state=checked]:bg-[#2B8A6E]" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Priority Playbooks */}
        {currentStep === 2 && (
          <div>
            <SectionLabel num="03" text="Priority Playbooks" />
            <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Select your highest-priority scenarios</h2>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 12 }}>Choose the strategic domains most relevant to your organization. You have access to all 170 playbooks — this selection pins your priorities to the top of your execution console.</p>

            <div style={{ padding: "14px 18px", background: `rgba(43,138,110,0.07)`, border: `1px solid rgba(43,138,110,0.2)`, marginBottom: 32, display: "flex", gap: 10, alignItems: "center" }}>
              <CheckCircle size={15} color={TEAL} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: NAVY }}>Select <strong>3 to 5 domains</strong> to prioritize. Your full library of 170 playbooks remains available at any time.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
              {PLAYBOOK_OPTIONS.map(pb => {
                const active = playbookData.selected.includes(pb.name);
                return (
                  <button key={pb.name} onClick={() => setPlaybookData({ ...playbookData, selected: active ? playbookData.selected.filter(p => p !== pb.name) : [...playbookData.selected, pb.name] })}
                    style={{ padding: "20px 18px", border: `1px solid ${active ? NAVY : BORDER}`, borderLeft: active ? `3px solid ${GOLD}` : `1px solid ${BORDER}`, background: active ? `rgba(10,15,46,0.04)` : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: active ? GOLD : MUTED }}>{pb.domain}</span>
                      {active && <Check size={14} color={TEAL} />}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4, lineHeight: 1.3 }}>{pb.name}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{pb.count} playbooks</div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ flex: 1, padding: "16px 18px", background: "#fff", border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Auto-trigger alerts when signals are detected</div>
                  <div style={{ fontSize: 11, color: MUTED }}>Notify relevant domain owners immediately</div>
                </div>
                <Switch checked={playbookData.triggerAlerts} onCheckedChange={c => setPlaybookData({ ...playbookData, triggerAlerts: c })} className="data-[state=checked]:bg-[#2B8A6E]" />
              </div>
              <div style={{ flex: 1, padding: "16px 18px", background: "#fff", border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Automatic escalation after threshold breach</div>
                  <div style={{ fontSize: 11, color: MUTED }}>Escalate if no response within 15 minutes</div>
                </div>
                <Switch checked={playbookData.autoEscalation} onCheckedChange={c => setPlaybookData({ ...playbookData, autoEscalation: c })} className="data-[state=checked]:bg-[#2B8A6E]" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 48, paddingTop: 32, borderTop: `1px solid ${BORDER}` }}>
          <button onClick={handleBack} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: MUTED, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <ChevronLeft size={16} />
            {currentStep === 0 ? 'Back to Overview' : 'Previous Step'}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 11, color: MUTED }}>{currentStep + 1} of {PHASE_1_STEPS.length}</span>
            <button
              onClick={handleStepNext}
              disabled={completeOnboardingMutation.isPending}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 32px", background: NAVY, color: "#fff", border: "none", cursor: completeOnboardingMutation.isPending ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", opacity: completeOnboardingMutation.isPending ? 0.7 : 1 }}>
              {completeOnboardingMutation.isPending ? 'Saving...' : currentStep === PHASE_1_STEPS.length - 1 ? 'Complete Phase 1' : 'Continue'}
              {!completeOnboardingMutation.isPending && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
    )}
    </PageLayout>
  );
}

function JourneyView({ onBegin, onSkip }: { onBegin: () => void; onSkip: () => void }) {
  const PHASES = [
    {
      num: "01", label: "Foundation", timing: "Today · ~20 minutes", color: GOLD, doing: "You complete this",
      items: [
        "Organization profile & key contacts",
        "IDEA Framework — decision rights mapping",
        "Priority playbook selection (from 170)",
      ],
      outcome: "Your workspace is configured and your implementation team is briefed.",
    },
    {
      num: "02", label: "Integration", timing: "Week 1–2 · With your team", color: TEAL, doing: "VaughnMartin configures this",
      items: [
        "Connect to your enterprise stack (Salesforce, ServiceNow, Jira, Slack, etc.)",
        "Signal monitoring configuration & data mapping",
        "Custom trigger thresholds per your environment",
      ],
      outcome: "Execution OS is watching your environment in real-time.",
    },
    {
      num: "03", label: "Activation", timing: "Week 3–4 · Go-live", color: NAVY, doing: "Your team activates",
      items: [
        "First practice drill — full playbook simulation",
        "Executive and PMO team training",
        "Readiness audit & go-live sign-off",
      ],
      outcome: "When a signal fires, you're already executing — not scheduling.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: NAVY, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />
      <div style={{ position: "absolute", top: -120, right: -80, width: 600, height: 600, background: "radial-gradient(ellipse,rgba(43,138,110,0.12) 0%,transparent 65%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto", padding: "80px 48px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 24, height: 2, background: "rgba(255,255,255,0.2)" }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Welcome to Execution OS</span>
        </div>

        <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(36px,5vw,62px)", color: "#fff", lineHeight: 1.05, marginBottom: 16 }}>
          Operational in<br />
          <em style={{ fontStyle: "italic", color: GOLD_LT }}>2–4 weeks.</em>
        </h1>
        <p style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.55)", maxWidth: 580, marginBottom: 64, lineHeight: 1.8 }}>
          Execution OS requires real configuration — your org structure, decision rights, and enterprise integrations. That's why it works in 12 minutes when it matters. Here's your path to live.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,0.06)", marginBottom: 64 }}>
          {PHASES.map((phase, i) => (
            <div key={phase.num} style={{ background: i === 0 ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)", padding: "36px 32px", borderTop: `3px solid ${phase.color}`, position: "relative" }}>
              {i === 0 && (
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 10px", background: GOLD, color: NAVY }}>Today</div>
              )}
              <div style={{ ...CG, fontSize: 48, fontWeight: 300, color: phase.color, lineHeight: 1, marginBottom: 4 }}>{phase.num}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{phase.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: phase.color, marginBottom: 20 }}>{phase.timing}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>{phase.doing}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {phase.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, background: phase.color, borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontStyle: "italic" }}>{phase.outcome}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button
            onClick={onBegin}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 40px", background: GOLD, color: NAVY, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Begin Phase 1 — Foundation
            <ArrowRight size={18} />
          </button>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>About 20 minutes</div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 48 }}>
          {[
            { num: "170", label: "Playbooks ready at go-live" },
            { num: "12min", label: "Execution once live" },
            { num: "2–4wk", label: "Full implementation" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompleteView({ orgName, onGo }: { orgName: string; onGo: () => void }) {
  const MILESTONES = [
    { week: "Within 24 hours", title: "Implementation kickoff", desc: "Your VaughnMartin implementation team will contact you to schedule your integration sessions and review your IDEA Framework configuration.", icon: Mail, color: GOLD, status: "next" },
    { week: "Week 1–2", title: "Enterprise integration", desc: "Connect Execution OS to your Salesforce, ServiceNow, Jira, Slack, and other enterprise systems. Signal monitoring goes live.", icon: Zap, color: TEAL, status: "upcoming" },
    { week: "Week 3–4", title: "First drill & go-live", desc: "Run your first simulated playbook activation with your team. Readiness audit. Executive sign-off. You're live.", icon: TrendingUp, color: NAVY, status: "upcoming" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: OFF, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>

      {/* Navy confirmation header */}
      <div style={{ background: NAVY, padding: "56px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)`, backgroundSize: "44px 44px" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle size={28} color="#fff" />
          </div>
          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,52px)", color: "#fff", marginBottom: 12, lineHeight: 1.1 }}>
            Phase 1 Complete{orgName ? ` — ${orgName}` : ''}.
          </h1>
          <p style={{ fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.55)", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
            Your foundation is configured. Your implementation team will reach out within 24 hours to begin Phase 2 — integration and signal configuration.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 48px" }}>

        <h2 style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 8 }}>What happens next</h2>
        <p style={{ fontSize: 14, color: MUTED, marginBottom: 40 }}>Your path to live execution over the next 2–4 weeks.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: BORDER, marginBottom: 48 }}>
          {MILESTONES.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} style={{ background: "#fff", display: "grid", gridTemplateColumns: "200px 1fr", gap: 0 }}>
                <div style={{ padding: "28px 24px", background: i === 0 ? `rgba(201,168,76,0.06)` : OFF, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ width: 36, height: 36, background: i === 0 ? GOLD : i === 1 ? TEAL : NAVY, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <Icon size={18} color="#fff" />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? GOLD : MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>{m.week}</div>
                </div>
                <div style={{ padding: "28px 28px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 8 }}>{m.title}</div>
                  <div style={{ fontSize: 13, fontWeight: 400, color: MUTED, lineHeight: 1.7 }}>{m.desc}</div>
                  {i === 0 && (
                    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, background: TEAL_LT, borderRadius: "50%", animation: "pulse 2s ease infinite" }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" }}>Next Action</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview access */}
        <div style={{ padding: "36px 40px", background: NAVY, position: "relative", overflow: "hidden", marginBottom: 32 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)`, backgroundSize: "32px 32px" }} />
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>While you wait for integration</div>
              <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Preview your dashboard</h3>
              <p style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 420 }}>
                Explore your execution console with sample data loaded. See how playbook activation works, review your IDEA framework layout, and prepare your team for go-live.
              </p>
            </div>
            <button
              onClick={onGo}
              style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "16px 32px", background: GOLD, color: NAVY, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Open Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: 12, color: MUTED, textAlign: "center" }}>
          Questions? Contact your implementation team at <strong style={{ color: NAVY }}>implementation@executeiq.io</strong>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: NAVY }}>{label}</label>
      {children}
    </div>
  );
}

function SectionLabel({ num, text }: { num: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
      <div style={{ width: 32, height: 2, background: GOLD }} />
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>[{num}] {text}</span>
    </div>
  );
}
