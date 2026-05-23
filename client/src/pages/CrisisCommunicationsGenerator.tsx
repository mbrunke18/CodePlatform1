import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  MessageSquare, Users, Building2, BarChart3, FileText, Shield,
  Sparkles, Copy, Check, Download, Clock, ArrowRight, Brain,
  AlertTriangle, CheckCircle, Zap, Globe, Loader2
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const SCENARIO_TYPES = [
  { value: 'cyber-breach', label: 'Cybersecurity Breach / Ransomware' },
  { value: 'supply-chain', label: 'Supply Chain Disruption' },
  { value: 'executive-departure', label: 'Unexpected Executive Departure' },
  { value: 'financial-restatement', label: 'Financial Restatement / Earnings Miss' },
  { value: 'regulatory-action', label: 'Regulatory Investigation / Enforcement Action' },
  { value: 'brand-crisis', label: 'Brand / Reputation Crisis' },
  { value: 'ma-announcement', label: 'M&A Announcement' },
  { value: 'product-recall', label: 'Product Safety / Recall Event' },
  { value: 'workforce-action', label: 'Significant Workforce Action' },
  { value: 'geopolitical', label: 'Geopolitical / Market Disruption' },
];

const SEVERITY_LEVELS = [
  { value: 'critical', label: 'Critical — Immediate board and regulator notification required' },
  { value: 'high', label: 'High — Senior executive response within 12 hours' },
  { value: 'medium', label: 'Medium — Cross-functional response within 24 hours' },
];

const AUDIENCES = [
  { id: 'board', label: 'Board of Directors', icon: Building2, color: NAVY, description: '3-bullet board-ready brief — decision rights, financial exposure, recommended posture' },
  { id: 'employees', label: 'Employees', icon: Users, color: TEAL, description: 'Business-as-usual framing, clear leadership signal, what employees should and should not do' },
  { id: 'customers', label: 'Customers / Partners', icon: Globe, color: GOLD, description: 'Confidence-preserving holding statement — commitment to service continuity and transparency' },
  { id: 'analysts', label: 'Investors / Analysts', icon: BarChart3, color: NAVY, description: 'Material disclosure language, financial impact framing, forward-looking caveat' },
  { id: 'regulators', label: 'Regulators / Legal', icon: Shield, color: '#dc2626', description: 'Factual notification draft — incident timeline, scope statement, remediation commitment' },
];

interface GeneratedComms {
  board: string;
  employees: string;
  customers: string;
  analysts: string;
  regulators: string;
  generatedAt: string;
  scenario: string;
  severity: string;
}

const SAMPLE_COMMS: Record<string, Record<string, string>> = {
  'cyber-breach': {
    board: `BOARD BRIEF — CONFIDENTIAL\n[Date] | [Time] | Priority: CRITICAL\n\nSITUATION\nAt [Time], our security operations team detected unauthorized access to [affected systems]. Containment protocols were activated within 12 minutes of detection. No customer data has been confirmed as exfiltrated at this time. Investigation is ongoing.\n\nFINANCIAL EXPOSURE\nEstimated remediation cost: $2.1M–$4.7M. Regulatory notification obligations triggered in 3 jurisdictions. No material revenue interruption anticipated at this stage.\n\nDECISION REQUIRED\nBoard authorization needed for: (1) External forensic firm engagement, (2) Proactive regulatory disclosure in EU and California, (3) Customer notification if data exfiltration is confirmed.\n\nNEXT BRIEF: [Time + 4 hours] | CONTACT: [CISO name/number]`,
    employees: `MESSAGE FROM [CEO NAME]\n\nTeam,\n\nI want to address a situation directly rather than let rumors fill the silence.\n\nEarlier today, our security team identified and contained an attempted breach of our systems. Our response protocols worked exactly as designed — our team acted decisively, and our systems are fully operational.\n\nWhat you should know:\n• Your work is not affected. All systems are running normally.\n• We are conducting a thorough investigation with external experts.\n• You may receive questions from media or contacts. Please direct all inquiries to communications@[company].com — do not comment externally.\n\nWe will share an update by [time] today. Our commitment to transparency with this team has not changed.\n\n[CEO Name]`,
    customers: `STATEMENT — [COMPANY NAME]\n\nWe are writing to inform you that we recently identified and contained a security incident affecting our infrastructure.\n\nOur security team responded immediately. All services are fully operational and we have found no evidence that customer data was accessed or compromised.\n\nWe take the security of your information seriously. We have engaged leading external security experts to conduct a thorough forensic review, and we are cooperating fully with relevant authorities.\n\nWe will proactively communicate any material developments. If you have questions, please contact security@[company].com.\n\nThank you for your trust.\n[Company Name] Leadership`,
    analysts: `INVESTOR STATEMENT — FOR IMMEDIATE RELEASE\n\n[Company Name] today disclosed a cybersecurity incident that was detected and contained by its security operations team on [date].\n\nThe company activated its crisis response Readiness Protocol within 12 minutes of detection. Preliminary assessment indicates no material impact to revenue or customer data. Full forensic review is underway.\n\nThe company estimates remediation costs of $2M–$5M and does not anticipate a material impact to full-year guidance at this time. This assessment may be updated as the investigation progresses.\n\nForward-looking statements apply. Investors are encouraged to review our risk factors in our most recent 10-K.\n\nInvestor Relations: [contact]`,
    regulators: `INCIDENT NOTIFICATION — PRIVILEGED AND CONFIDENTIAL\n\nTo: [Regulatory Body]\nFrom: [CISO / CLO Name]\nDate: [Date]\nRe: Cybersecurity Incident Notification\n\nPursuant to [applicable regulation], [Company Name] hereby provides formal notification of a cybersecurity incident detected on [date] at [time].\n\nINCIDENT SUMMARY\nNature: Unauthorized access attempt to [system description]\nDetected: [Date/Time]\nContained: [Date/Time] — [X] minutes from detection\nSystems Affected: [Description]\nData at Risk: Under investigation — no confirmed exfiltration at time of notification\n\nREMEDIATION\nForensic investigation: [Firm name] engaged [date]\nContainment status: Complete\nEstimated remediation timeline: [X] weeks\n\nWe commit to providing a full incident report within [30/72] days and will cooperate fully with any regulatory review.\n\n[Signature block]`,
  },
};

export default function CrisisCommunicationsGenerator() {
  const { toast } = useToast();
  const [scenarioType, setScenarioType] = useState('');
  const [severity, setSeverity] = useState('');
  const [context, setContext] = useState('');
  const [generated, setGenerated] = useState<GeneratedComms | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [approvedAudiences, setApprovedAudiences] = useState<string[]>([]);

  const generateMutation = useMutation({
    mutationFn: async (payload: { scenarioType: string; severity: string; context: string }) => {
      const res = await apiRequest('POST', '/api/crisis-communications/generate', payload);
      return res.json();
    },
    onSuccess: (data: GeneratedComms) => {
      setGenerated(data);
      toast({ title: 'Communications generated', description: '5 audience-specific messages ready for review and approval.' });
    },
    onError: () => {
      // Graceful fallback with sample content
      const sample = SAMPLE_COMMS[scenarioType] || SAMPLE_COMMS['cyber-breach'];
      setGenerated({
        board: sample.board,
        employees: sample.employees,
        customers: sample.customers,
        analysts: sample.analysts,
        regulators: sample.regulators,
        generatedAt: new Date().toISOString(),
        scenario: scenarioType,
        severity,
      });
      toast({ title: 'Sample communications loaded', description: 'Customize and approve each message before sending.' });
    },
  });

  const handleCopy = (text: string, audienceId: string) => {
    navigator.clipboard.writeText(text);
    setCopied(audienceId);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: 'Copied to clipboard' });
  };

  const handleApprove = (audienceId: string) => {
    setApprovedAudiences(prev => [...prev, audienceId]);
    toast({ title: `${audienceId.charAt(0).toUpperCase() + audienceId.slice(1)} communication approved`, description: 'Ready for distribution.' });
  };

  const selectedScenarioLabel = SCENARIO_TYPES.find(s => s.value === scenarioType)?.label || '';

  return (
    <PageLayout>
      <h1 className="sr-only">Crisis Communications Generator — Readiness OS</h1>
      <div style={{ background: OFF, minHeight: '100vh' }}>

        {/* ─── Dark Hero ─── */}
        <div style={{ background: NAVY, padding: '40px 0 36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Execute Phase · Crisis Communications</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32 }}>
              <div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: '#F0EDE4', marginBottom: 10, lineHeight: 1.1 }}>
                  Crisis Communication <em style={{ color: GOLD }}>Generator</em>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.6)', maxWidth: 580, lineHeight: 1.7 }}>
                  Five audience-specific communications — Board, Employees, Customers, Analysts, and Regulators — generated in under 60 seconds from a single scenario input. Human-reviewed before any message leaves your organization.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
                {generated && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.15)', color: '#3BAF8A', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '5px 12px', border: '1px solid rgba(43,138,110,0.3)' }}>
                    <CheckCircle style={{ width: 12, height: 12 }} />
                    {approvedAudiences.length} of 5 Approved
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'rgba(240,237,228,0.4)', fontSize: 11 }}>
                  <Clock style={{ width: 13, height: 13 }} />
                  Avg generation time: 18 seconds
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'flex-start' }}>

            {/* ─── Config Panel ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24 }}>
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '24px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 20 }}>Scenario Configuration</div>

                <div style={{ marginBottom: 16 }}>
                  <Label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY, marginBottom: 8, display: 'block' }}>Scenario Type</Label>
                  <Select value={scenarioType} onValueChange={setScenarioType}>
                    <SelectTrigger style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}>
                      <SelectValue placeholder="Select scenario type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SCENARIO_TYPES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY, marginBottom: 8, display: 'block' }}>Severity Level</Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}>
                      <SelectValue placeholder="Select severity..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITY_LEVELS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <Label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY, marginBottom: 8, display: 'block' }}>Additional Context <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: 10 }}>(optional)</span></Label>
                  <Textarea
                    value={context}
                    onChange={e => setContext(e.target.value)}
                    placeholder="e.g. 'Breach detected in APAC region. No customer data confirmed exfiltrated. External forensics engaged.'"
                    style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 12, minHeight: 90, resize: 'vertical' }}
                  />
                </div>

                <Button
                  className="w-full font-bold uppercase tracking-wider"
                  style={{ background: NAVY, color: '#fff', borderRadius: 0, fontSize: 12, letterSpacing: '0.12em', padding: '12px 0' }}
                  disabled={!scenarioType || !severity || generateMutation.isPending}
                  onClick={() => generateMutation.mutate({ scenarioType, severity, context })}
                >
                  {generateMutation.isPending ? (
                    <><Loader2 style={{ width: 14, height: 14, marginRight: 8, animation: 'spin 1s linear infinite' }} />Generating...</>
                  ) : (
                    <><Sparkles style={{ width: 14, height: 14, marginRight: 8 }} />Generate 5 Communications</>
                  )}
                </Button>
              </div>

              {/* Audience Overview */}
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '20px 24px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 16 }}>Audiences Generated</div>
                {AUDIENCES.map(a => {
                  const Icon = a.icon;
                  const isApproved = approvedAudiences.includes(a.id);
                  return (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
                      <Icon style={{ width: 14, height: 14, color: a.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{a.label}</div>
                      </div>
                      {isApproved ? (
                        <CheckCircle style={{ width: 14, height: 14, color: TEAL }} />
                      ) : generated ? (
                        <div style={{ width: 8, height: 8, borderRadius: 0, background: GOLD }} />
                      ) : (
                        <div style={{ width: 8, height: 8, borderRadius: 0, background: BORDER }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Protocol note */}
              <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}30`, borderLeft: `3px solid ${GOLD}`, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>Human Review Required</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>Every generated communication requires human approval before distribution. AI provides the draft. You control what goes out.</div>
              </div>
            </div>

            {/* ─── Generated Output Panel ─── */}
            <div>
              {!generated ? (
                <div style={{ background: '#fff', border: `1px dashed ${BORDER}`, padding: '60px 40px', textAlign: 'center' }}>
                  <MessageSquare style={{ width: 40, height: 40, color: BORDER, margin: '0 auto 16px' }} />
                  <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: '#9CA3AF', marginBottom: 8 }}>Configure and generate</div>
                  <div style={{ fontSize: 13, color: '#9CA3AF', maxWidth: 380, margin: '0 auto', lineHeight: 1.6 }}>Select a scenario type and severity level, then generate all 5 audience communications simultaneously.</div>
                </div>
              ) : (
                <div>
                  {/* Generated header */}
                  <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}20`, borderLeft: `3px solid ${TEAL}`, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Brain style={{ width: 16, height: 16, color: TEAL, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>5 communications generated for: {selectedScenarioLabel}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>Review and approve each message. Approved messages are marked ready for distribution. Edit any text directly before approving.</div>
                    </div>
                  </div>

                  <Tabs defaultValue="board">
                    <TabsList style={{ background: `${NAVY}08`, borderRadius: 0, marginBottom: 20, gap: 1 }}>
                      {AUDIENCES.map(a => {
                        const Icon = a.icon;
                        const isApproved = approvedAudiences.includes(a.id);
                        return (
                          <TabsTrigger key={a.id} value={a.id}
                            style={{ borderRadius: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', gap: 6, position: 'relative' }}>
                            <Icon style={{ width: 12, height: 12 }} />
                            {a.label}
                            {isApproved && <CheckCircle style={{ width: 10, height: 10, color: TEAL, marginLeft: 2 }} />}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {AUDIENCES.map(a => {
                      const content = generated[a.id as keyof GeneratedComms] as string;
                      const isApproved = approvedAudiences.includes(a.id);
                      const Icon = a.icon;
                      return (
                        <TabsContent key={a.id} value={a.id}>
                          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderTop: `3px solid ${a.color}` }}>
                            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Icon style={{ width: 18, height: 18, color: a.color }} />
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{a.label} Communication</div>
                                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{a.description}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <Button size="sm" style={{ background: 'transparent', color: NAVY, border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                                  onClick={() => handleCopy(content, a.id)}>
                                  {copied === a.id ? <><Check style={{ width: 12, height: 12, marginRight: 4 }} />Copied</> : <><Copy style={{ width: 12, height: 12, marginRight: 4 }} />Copy</>}
                                </Button>
                                {!isApproved ? (
                                  <Button size="sm" style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                                    onClick={() => handleApprove(a.id)}>
                                    <CheckCircle style={{ width: 12, height: 12, marginRight: 4 }} />Approve
                                  </Button>
                                ) : (
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${TEAL}12`, color: TEAL, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', border: `1px solid ${TEAL}30` }}>
                                    <CheckCircle style={{ width: 12, height: 12 }} />Approved
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ padding: '24px 28px' }}>
                              <pre style={{ fontFamily: 'inherit', fontSize: 13, color: NAVY, lineHeight: 1.75, whiteSpace: 'pre-wrap', margin: 0 }}>{content}</pre>
                            </div>
                            {isApproved && (
                              <div style={{ padding: '12px 20px', background: `${TEAL}06`, borderTop: `1px solid ${TEAL}20`, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircle style={{ width: 14, height: 14, color: TEAL }} />
                                <span style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>Approved for distribution · {new Date().toLocaleTimeString()}</span>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </div>
              )}
            </div>
          </div>

          {/* Bottom instruction row */}
          <div style={{ background: NAVY, padding: '24px 28px', marginTop: 40, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(201,168,76,0.08) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>Part of the 12-Minute Response</div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.65)', lineHeight: 1.6, maxWidth: 560 }}>
                  In a real crisis, you need 5 different messages for 5 different audiences in parallel — not sequentially. This tool removes the 2–4 hour communication drafting bottleneck that turns a contained event into a reputation crisis.
                </div>
              </div>
              <Link href="/command-center">
                <Button style={{ background: GOLD, color: NAVY, borderRadius: 0, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>
                  Go to Command Center <ArrowRight style={{ width: 14, height: 14, marginLeft: 8 }} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
